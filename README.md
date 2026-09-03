# getantiviral.app

The Antiviral website. The home page is a scroll-driven story (`src/mockup/`); `/privacy`, `/terms`, and `/devlog` are the React pages in `src/` served through `site.html`. The page performs the product's argument: it opens inside the feed (a Three.js torrent of glowing cards), the reader's scroll slows it into a finite stack, and at the pivot ("Same machinery. Different employer. You.") the whole page turns from dark to paper and stays there. The masthead folio counts pages and proves the site ends.

## Run it

```bash
npm install
npm run build && npm run preview     # http://localhost:4173 and on the LAN (see terminal)
# or, with hot reload:
npm run dev                          # http://localhost:5173
```

The waitlist form posts to `/api/waitlist`. Locally a stub in `vite.config.js` answers it; on Vercel the Resend-backed function in `api/` does.

## Layout

- `src/mockup/main.js` assembles the sections listed in `src/mockup/sections/index.js` (story order) and starts Lenis + GSAP ScrollTrigger.
- `src/mockup/styles/tokens.css` defines the two worlds (feed = dark, paper = light) behind world-agnostic aliases; `src/mockup/lib/world.js` flips them.
- `src/mockup/hero/stream.js` is the Three.js hero: instanced cards in a tunnel, scroll drives `order` from stream to stack.
- `src/mockup/lib/phone.js` is the shared iPhone frame used by every product screen.
- `src/mockup/data/logos.js` pulls authentic brand marks from `simple-icons`.
- `public/video/wave-loop.mp4` is generated, not filmed: `video-src/wave-loop.html` renders frames in headless Chrome and `scripts/render-video.mjs` encodes them with ffmpeg-static (`npm run video`).
- `scripts/screenshot.mjs` and `scripts/shot-at.mjs` capture iPhone and desktop review screenshots through the installed Chrome.

## Sources for the cited studies

Every statistic on the page was checked against its primary source; the curated list with safe phrasings is in the session notes (`evidence-verified.json`). Citations link out from the page.
