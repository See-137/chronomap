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
- **Synchronized map + timeline.** Scrub or press play to watch events light up
  and journeys trace across the map.
- **Canon vs. interpretation.** Adaptation-only or sequencing-changed events are
  flagged, with a "canon only" filter.
- **Deep-linkable state.** Universe, layer, timeline position, selection, filters,
  and camera all live in the URL, so any view can be shared.
- **Low-power tier.** The `2D` toggle drops the SVG turbulence filter, camera
  easing, and playback frame-rate for weaker hardware.
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
