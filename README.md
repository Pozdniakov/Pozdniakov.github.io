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

## Colour schemes

Three palettes switchable via the dots in the top-right corner (persisted in
localStorage; defaults follow `prefers-color-scheme`):

- **paper** — warm cream, umber ink, madder-red accent (default)
- **cyanotype** — Prussian blue with pale exposure, straw accent
- **ink** — quiet near-black, dry-sage accent

Each palette is ~6 CSS custom properties in `docs/assets/style.css` — edit or
add a theme there and mirror it in `THEME_COLOR` in `main.js`.

## Editing

- **Content** — edit `docs/index.html`; sections are marked with comments.
- **CV update** — recompile in the CV project, then copy the PDFs into `docs/cv/`.

Publishing = pushing to `master`. No render step required.
