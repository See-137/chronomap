# Chronomap

Interactive timeline-map across three fictional universes — **Middle-earth**,
**Wizarding Britain**, and **The Matrix**. Map and timeline stay synchronized;
explore events, places, characters, factions, and journeys.

**Zero runtime dependencies** — the whole app is a single `index.html`. Open it in
any modern browser (or serve the folder) and it runs. Nothing to build.

**Live:** https://see-137.github.io/chronomap/ (once GitHub Pages is enabled:
Settings → Pages → Source: Deploy from a branch → `main` / `(root)`).

## Features

- **Three worlds, one engine.** A world swap is a theme-token swap, not a layout
  change. Per-universe timelines, terrain, factions, characters, and routes.
- **Rich, layered maps.** Each world is drawn with mountain ranges (cast shadows),
  rivers, forests, roads, region labels, and an atmospheric vignette — over three
  parallax depth planes that shift as you pan for a faux-3D sense of depth.
- **Four characters per world.** Frodo, Aragorn, Gandalf & Sam; Harry, Voldemort,
  Hermione & Snape; Neo, Trinity, Morpheus & Agent Smith — each with their own
  route and timeline presence.
- **Synchronized map + timeline.** Scrub or press play to watch events light up
  and journeys trace across the map.
- **Contextual arrival effects.** When the timeline reaches an important event, a
  themed pulse fires at that location and a contextual card surfaces the kind,
  place, a one-line summary, and who's involved — feedback that's more than a
  repeated name.
- **Canon vs. interpretation.** Adaptation-only or sequencing-changed events are
  flagged, with a "canon only" filter.
- **Deep-linkable state.** Universe, layer, timeline position, selection, filters,
  and camera all live in the URL, so any view can be shared.
- **Low-power tier.** The `2D` toggle drops the SVG turbulence/elevation filters,
  parallax, ambient motion, camera easing, and playback frame-rate for weaker
  hardware. Motion also respects `prefers-reduced-motion`.
- **Keyboard + screen-reader friendly.** Focusable map markers, a combobox search
  with arrow-key navigation, focus management on the detail panel, and a visible
  focus ring throughout.

## Development

The app ships with no runtime dependencies. The only tooling is a Playwright
regression suite (dev-only) that exercises boot health, universe switching,
timeline playback, search keyboard nav, detail-panel focus management, the
low-power tier, and robust URL handling.

```bash
npm install                      # installs @playwright/test (dev only)
npx playwright install chromium  # one-time browser download
npm test                         # run the suite
npm run test:headed              # watch it run in a browser
```

Source & design docs: [See-137/.github → apps/timeline-map](https://github.com/See-137/.github/tree/main/apps/timeline-map)
