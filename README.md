# pozdniakov.github.io

Personal website of Ivan Pozdniakov — [pozdniakov.github.io](https://pozdniakov.github.io).

## Structure

Hand-written static site, no build step, no frameworks. GitHub Pages serves the
`docs/` folder directly:

```
docs/
├── index.html          ← the whole site (single page)
├── assets/
│   ├── style.css       ← all styles (design tokens at the top)
│   └── main.js         ← neural canvas, scroll reveal, lightbox
├── images/
│   ├── profile.jpg     ← About-section portrait
│   └── gallery/        ← photo strip (Tbilisi, Feb 2026)
├── cv/                 ← CV PDFs (compiled from the CV project)
├── fonts/              ← QuaziNote typeface
└── favicon.svg
```

## Editing

- **Content** — edit `docs/index.html` directly; every section is marked with
  an `<!-- ===== SECTION ===== -->` comment.
- **Colors / typography** — CSS custom properties at the top of
  `docs/assets/style.css` (`:root`).
- **CV update** — recompile in the CV project, then copy the PDFs into
  `docs/cv/`.
- **Photos** — drop images into `docs/images/gallery/` and add an `<img>` tag
  to the strip in `index.html`.

Publishing = pushing to `master`. No render step required.
