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
- **Shaded-relief maps.** Each landmass is drawn as layered terrain — coastal
  shallows, hypsometric elevation tints, a directional hillshade, and a parchment
  grain — with shaded mountain ranges (sunlit/shadow faces + snow), forest canopy
  masses, tapered river networks, roads, region labels, and map furniture
  (an ornamental title cartouche, compass, graticule, neatline frame). Three
  parallax depth planes shift as you pan for a faux-3D sense of depth, and coasts
  and rivers shimmer gently on the capable tier.
- **Overview minimap.** A corner minimap shows the full map extent, every location,
  and a live viewport rectangle — click or drag it to jump anywhere, so the whole
  map stays legible at any zoom level.
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
- **Responsive.** On phones the controls collapse into a drawer (map leads), the
  detail panel goes full-screen, search collapses to an icon, and tap targets grow
  to ~44px. Event labels de-collide so titles never stack.
- **Keyboard + screen-reader friendly.** Focusable map markers, a combobox search
  with arrow-key navigation, focus management on the detail panel and mobile drawer,
  a keyboard-operable minimap, and a visible focus ring throughout.

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
