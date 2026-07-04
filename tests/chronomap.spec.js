// @ts-check
const { test, expect } = require("@playwright/test");
const path = require("path");
const { pathToFileURL } = require("url");

const APP = pathToFileURL(path.join(__dirname, "..", "index.html")).href;

/** Load the app and fail the test on any uncaught page error or console error. */
async function open(page, query = "") {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(APP + query);
  await page.waitForFunction(() => document.querySelector("#locations g") !== null);
  return errors;
}

test.describe("boot & health", () => {
  test("boots with no console/page errors and correct title", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle(/Chronomap/);
    await expect(page.locator(".brand b")).toHaveText("Chronomap");
    expect(errors, "no runtime errors on boot").toEqual([]);
  });

  test("renders locations and timeline ticks for the default universe", async ({ page }) => {
    await open(page);
    expect(await page.locator("#locations g").count()).toBeGreaterThan(5);
    expect(await page.locator(".track .tick").count()).toBeGreaterThan(5);
  });
});

test.describe("universe switching", () => {
  test("switching universe updates chrome and URL", async ({ page }) => {
    await open(page);
    await page.getByRole("button", { name: "Wizarding Britain" }).click();
    await expect(page.locator("#tagline")).toContainText("Harry");
    await expect(page).toHaveURL(/u=hp/);
    // aria-current is set on the active universe button (idiomatic: present only when true)
    await expect(page.getByRole("button", { name: "Wizarding Britain" })).toHaveAttribute("aria-current", "true");
  });

  test("Matrix exposes its two reality layers", async ({ page }) => {
    await open(page, "?u=matrix");
    await expect(page.locator("#layerGroup")).toBeVisible();
    await expect(page.locator("#layerChips button")).toHaveCount(2);
  });
});

test.describe("timeline", () => {
  test("play advances the scrubber then can be paused", async ({ page }) => {
    await open(page);
    const before = Number(await page.locator("#scrub").inputValue());
    await page.getByRole("button", { name: "Play timeline" }).click();
    await page.waitForTimeout(700);
    await page.getByRole("button", { name: "Pause" }).click();
    const after = Number(await page.locator("#scrub").inputValue());
    expect(after).toBeGreaterThan(before);
    // and it stays paused
    await page.waitForTimeout(200);
    expect(Number(await page.locator("#scrub").inputValue())).toEqual(after);
  });

  test("scrubbing to the end reflects the final era", async ({ page }) => {
    await open(page);
    await page.locator("#scrub").fill("1000");
    await page.locator("#scrub").dispatchEvent("input");
    await expect(page.locator("#nowYear")).toContainText("Return of the King");
  });
});

test.describe("search (combobox a11y + keyboard)", () => {
  test("input is a combobox and toggles aria-expanded", async ({ page }) => {
    await open(page);
    const input = page.locator("#searchInput");
    await expect(input).toHaveAttribute("role", "combobox");
    await input.fill("Frodo");
    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator('#searchResults [role="option"]').first()).toContainText("Frodo");
  });

  test("keyboard: ArrowDown + Enter selects a result and opens the panel", async ({ page }) => {
    await open(page);
    const input = page.locator("#searchInput");
    await input.fill("Council");
    await input.press("ArrowDown");
    await input.press("Enter");
    await expect(page.locator("#detail")).toHaveClass(/open/);
    await expect(page.locator("#dTitle")).toContainText("Council");
  });
});

test.describe("detail panel focus management (a11y)", () => {
  test("opening focuses the close button; Escape closes and returns focus", async ({ page }) => {
    await open(page);
    const firstLoc = page.locator("#locations g").first();
    await firstLoc.focus();
    await firstLoc.press("Enter");
    await expect(page.locator("#detail")).toHaveClass(/open/);
    // focus moved into the panel
    await expect(page.locator("#dClose")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator("#detail")).not.toHaveClass(/open/);
    // focus returned to the trigger
    await expect(firstLoc).toBeFocused();
  });
});

test.describe("accessibility structure", () => {
  test("interactive map is a group (not role=img, which would hide its controls)", async ({ page }) => {
    await open(page);
    await expect(page.locator("#map")).toHaveAttribute("role", "group");
  });
});

test.describe("low-power tier (renderToggle actually does something)", () => {
  test("toggling adds .low-power, strips the terrain filter, and sets aria-pressed", async ({ page }) => {
    await open(page);
    const btn = page.locator("#renderToggle");
    // default universe (lotr) terrain uses the turbulence filter
    expect(await page.locator("#terrain [filter]").count()).toBeGreaterThan(0);
    await btn.click();
    await expect(page.locator("body")).toHaveClass(/low-power/);
    await expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(await page.locator("#terrain [filter]").count()).toBe(0);
    await btn.click();
    await expect(page.locator("body")).not.toHaveClass(/low-power/);
  });
});

test.describe("robust URL handling", () => {
  test("malformed ?cam does not blank the map (no NaN in transform)", async ({ page }) => {
    await open(page, "?cam=0.4,abc,1");
    const transform = await page.locator("#cam").getAttribute("transform");
    expect(transform).not.toContain("NaN");
  });

  test("deep-link restores universe, layer, and opens the event panel", async ({ page }) => {
    await open(page, "?u=matrix&layer=real&event=e_wake");
    await expect(page.locator("#detail")).toHaveClass(/open/);
    await expect(page.locator("#dTitle")).toContainText("Pod");
    await expect(page.locator("#layerChips button", { hasText: "Real World" })).toHaveAttribute("aria-pressed", "true");
    // a boot-time deep link must NOT steal focus before the user interacts
    await expect(page.locator("#dClose")).not.toBeFocused();
  });
});

test.describe("expanded cast (2+ extra characters per universe)", () => {
  for (const [u, expected] of [
    ["lotr", ["Gandalf", "Samwise Gamgee"]],
    ["hp", ["Hermione Granger", "Severus Snape"]],
    ["matrix", ["Morpheus", "Agent Smith"]],
  ]) {
    test(`${u} has 4 characters incl. the new pair`, async ({ page }) => {
      await open(page, `?u=${u}`);
      await expect(page.locator("#charChips label")).toHaveCount(4);
      for (const name of expected) {
        await expect(page.locator("#charChips label", { hasText: name })).toBeVisible();
      }
    });
  }

  test("a new character deep-links and traces a route", async ({ page }) => {
    await open(page, "?u=lotr&char=gandalf");
    await expect(page.locator("#detail")).toHaveClass(/open/);
    await expect(page.locator("#dTitle")).toContainText("Gandalf");
    expect(await page.locator("#routes polyline").count()).toBeGreaterThan(0);
  });

  test("new events are searchable", async ({ page }) => {
    await open(page, "?u=hp");
    await page.locator("#searchInput").fill("Prince");
    await expect(page.locator('#searchResults [role="option"]').first()).toContainText("Prince's Tale");
  });
});

test.describe("contextual arrival effects", () => {
  test("selecting an event shows the contextual arrival card (kind + place + context)", async ({ page }) => {
    await open(page, "?u=lotr");
    await page.locator("#searchInput").fill("Pelennor");
    await page.locator("#searchInput").press("Enter");
    const card = page.locator("#arrivalCard");
    await expect(card).toHaveClass(/show/);
    await expect(card.locator("h4")).toContainText("Pelennor");
    await expect(card.locator(".ac-kind")).toContainText("Minas Tirith"); // tied to the place
  });

  test("an SVG pulse is emitted into the #fx layer on the map", async ({ page }) => {
    await open(page, "?u=lotr");
    await page.locator("#searchInput").fill("Council");
    await page.locator("#searchInput").press("Enter");
    expect(await page.locator("#fx > g").count()).toBeGreaterThan(0);
  });

  test("low-power suppresses the SVG pulse but keeps the contextual card", async ({ page }) => {
    await open(page, "?u=lotr");
    await page.locator("#renderToggle").click(); // enter low-power
    await page.locator("#searchInput").fill("Pelennor");
    await page.locator("#searchInput").press("Enter");
    await expect(page.locator("#arrivalCard")).toHaveClass(/show/); // context preserved
    expect(await page.locator("#fx > g").count()).toBe(0); // motion suppressed
    // card is still anchored to the pin (not the top-center fallback) even though #fx is display:none
    const left = await page.locator("#arrivalCard").evaluate((el) => el.style.left);
    expect(left).not.toBe("50%");
    expect(left).toMatch(/px$/);
  });
});

test.describe("faux-3D depth", () => {
  test("terrain builds three parallax depth planes", async ({ page }) => {
    await open(page);
    await expect(page.locator("#terrain .tdepth")).toHaveCount(3);
  });

  test("low-power removes the parallax transforms", async ({ page }) => {
    await open(page);
    await page.locator("#renderToggle").click();
    const far = page.locator('#terrain .tdepth[data-depth="0.9"]');
    expect(await far.getAttribute("transform")).toBeNull();
  });
});
