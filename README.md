# Pro One Goalkeeping

Website for Pro One Goalkeeping Academy, a goalkeeper coaching service.
Plain HTML, CSS and JavaScript, no build step.

Live: https://pro-one-goalkeeping.georgedimi67.workers.dev

## Structure

- `index.html` – the whole one-page site (sections, booking form)
- `css/style.css` – styles, light/dark mode, phone layout
- `js/script.js` – menu scrolling, carousels, theme switch, booking form
- `assets/` – images, icons, logo and videos

## Run locally

Open `index.html` in a browser.

## Deploy

The site runs on a Cloudflare Worker that serves the files as static assets
(see `wrangler.jsonc`). Every push to `main` builds and deploys automatically.
Files listed in `.assetsignore` are not uploaded.

Videos must stay under 25 MB each (Cloudflare's per-file limit).

## Booking form

The booking form sends submissions through [Web3Forms](https://web3forms.com).
