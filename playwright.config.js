// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/**
 * Chronomap is a single static index.html with zero runtime dependencies, so the
 * suite loads it directly over file:// (see tests/helpers). No web server needed.
 */
module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
