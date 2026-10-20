# FIREWORK design reference (exact look)

These HTML/CSS mock-ups are the ground truth for how every page must look.

- `preview/*.html` — ready-to-open pages (shared head already injected).
- `pages/*.html` — source pages with a `<!--HEAD-->` placeholder (see head.html).
- `atlas.css` — design tokens and component classes (.app, .topbar, .panel, .chip, .seg, .toggle, .slider, .kv, .tile, .warn/.err/.ok, .mobile, .m-tabs, .sheet).
- `kit.js` — globe/region/chart helpers (d3) used by the mock-ups.
- `earth3d.js` + `three.module.js` + `tex/` — realistic Home hero (three.js). Home page = `hero_photo.html`.
- `screenshots/*.jpg` — rendered images of each page (1600x1000 desktop, 390 wide mobile).
- `fonts/` — Fraunces, Inter, JetBrains Mono, Space Grotesk, Caveat (SIL Open Font License).

## View
Serve this folder (paths start with `/`):

    python3 -m http.server 8765
    open http://localhost:8765/preview/hero_photo.html

## Rule for building the real app
Recreate each page in React with the same layout, spacing, colours, fonts and components.
Compare a Playwright screenshot of the React page (1600x1000) with `screenshots/<page>.jpg`; differences should be data only.
Numbers in mock-ups are DEMO values; in the real app they come from the API.
