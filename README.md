# pozdniakov.github.io

Personal website of Ivan Pozdniakov — [pozdniakov.github.io](https://pozdniakov.github.io).

## Structure

Hand-written static site, no build step, no frameworks. GitHub Pages serves the
`docs/` folder directly:

```
docs/
├── index.html          ← the whole site (single page)
├── assets/
│   ├── style.css       ← all styles; three palettes defined at the top
│   └── main.js         ← colour-scheme switcher (the only JS)
├── images/profile.jpg  ← portrait
├── cv/                 ← CV PDFs (compiled from the CV project)
├── fonts/              ← QuaziNote typeface
└── favicon.svg
```

## Themes

Six schemes switchable via the picker in the top-right corner (persisted in
localStorage; defaults follow `prefers-color-scheme`). A theme = colours +
optionally its own typography and small decorations:

- **paper** — warm cream, umber ink, madder-red accent (default)
- **manuscript** — parchment, EB Garamond, rubricated drop cap, justified text, fleuron dividers
- **cyanotype** — Prussian blue with pale exposure, straw accent, blue-print portrait
- **terminal** — green phosphor CRT: VT323, scanlines, blinking cursor, inverse-video links
- **macintosh** — 1-bit early GUI: black on white, Silkscreen pixel headings, hard shadows
- **ink** — quiet near-black, dry-sage accent

Colour variables live at the top of `docs/assets/style.css`; per-theme details
in the "Theme details" block below them. New theme = a `[data-theme='…']`
variable block + a button in `index.html` + an entry in `THEME_COLOR` in
`main.js`. Bump the `?v=` query on asset links when changing CSS/JS.

## Editing

- **Content** — edit `docs/index.html`; sections are marked with comments.
- **CV update** — recompile in the CV project, then copy the PDFs into `docs/cv/`.

Publishing = pushing to `master`. No render step required.
