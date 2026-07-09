# pozdniakov.github.io

Personal website of Ivan Pozdniakov — [pozdniakov.github.io](https://pozdniakov.github.io).

## Structure

Hand-written static site, no build step, no frameworks. GitHub Pages serves the
`docs/` folder directly:

```
docs/
├── index.html          ← the whole site (single page)
├── assets/
│   ├── style.css       ← all styles; design tokens in :root
│   └── main.js         ← the graph background + the neuron divider
├── images/             ← portrait
├── cv/                 ← CV PDFs (compiled from the CV project)
├── fonts/              ← QuaziNote typeface
└── favicon.svg
```

## The style

One fixed scheme, tuned by hand: a cool-ivory reading page (delicate Cormorant
Garamond) under a soft, slowly breathing sea-green glow, with muted marbled
clouds. Colour tokens live in `:root` at the top of `docs/assets/style.css`
(`--bg`, `--ink`, `--accent`, `--glow`, `--rule`).

Two live touches, both colour-matched to the palette and disabled under
`prefers-reduced-motion` / in-app webviews:

- **An interactive node graph** drifts behind the page — nodes link to each
  other and to the cursor, with signals pulsing along the edges.
- **A hand-drawn neuron divider** between About and Projects. Click it: the
  impulse glides out of the soma, jumps node to node through the myelin
  (saltatory conduction), splits along all three collaterals, and bursts
  confetti from every bouton. It also fires quietly on its own; confetti only
  on click.

## Editing

- **Content** — edit `docs/index.html`; sections are marked with comments.
- **Colour / glow** — the `:root` tokens in `docs/assets/style.css`.
- **CV update** — recompile in the CV project, then copy the PDFs into `docs/cv/`.

Publishing = pushing to `master`. No render step required.
