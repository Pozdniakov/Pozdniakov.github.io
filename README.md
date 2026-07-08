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

Twenty-five schemes (plus one secret); a theme = colours + its own typography
(most themes restyle the headings too) + small details:

- **paper** — warm cream, umber ink, madder-red accent (default)
- **manuscript** — parchment, EB Garamond, rubricated drop cap, justified text, fleurons, page frame
- **cyanotype** — Prussian blue with pale exposure, straw accent, blue-print portrait
- **terminal** — green phosphor CRT: VT323, scanlines, tube vignette, glow, blinking cursor
- **macintosh** — 1-bit early GUI: title-bar stripes, Silkscreen pixel headings, hard shadows
- **gameboy** — DMG LCD: four shades of pea-soup green, pixel headline, LCD grid
- **riso** — risograph overprint: blue + fluorescent pink, off-registration, halftone paper
- **punchcard** — IBM manila card: punched top row, cut corner, IBM-blue print
- **herbarium** — pressed-plant archive: sage paper, rust stamps, ❦ dividers, specimen portrait
- **workbench** — Amiga 1.3: blue/white/orange/black, checker drag-bar, hard shadows
- **darkroom** — safelight: red-on-black, heavy vignette, film grain, red-duotone portrait
- **notebook** — squared exercise book: graph paper, red margin line, QuaziNote headings
- **swiss** — International Typographic Style: white, black, Helvetica, Swiss red
- **dawn** — soft utopian morning: gradient sky, italic Cormorant headline in a terracotta gradient
- **bodoni** — headline-first editorial: uppercase Bodoni Moda masthead, thick-and-thin black rules, grayscale portrait, crimson on hover
- **marble** — Roman museum: veined stone, Cinzel capitals, bronze accents
- **sumi** — ink wash on washi paper; § headers as vermilion hanko seals
- **pinstripe** — bespoke navy wool with a chalk stripe, small-caps headings, burgundy silk
- **xray** — radiograph: film black, viridian marks, the portrait develops as a negative
- **atelier** — sober editorial: warm ivory, graphite-aubergine ink, muted wine accent, Cormorant Garamond
- **vapor** — vaporwave grown up: dusk indigo, drifting aurora haze, holographic pink–cyan headline, faint horizon grid
- **atlas** — old cartography: sepia stock, graticule grid, small-caps headings, compass red
- **opera** — velvet & gold: burgundy dark, stage-light glow, gilded gradient headline, framed portrait
- **brutalist** — raw web: Times, Arial Black caps, marker-yellow highlights, default-blue links
- **ink** — quiet near-black, dry-sage accent
- **amber** — hidden until a certain 10-key sequence is entered

An interactive node graph drifts behind every theme — nodes link to each other
and to the cursor, signals pulse along edges, and the colours are inherited
from the active scheme. `[graph]` in the picker turns it off (persisted);
it renders a single static frame under `prefers-reduced-motion` and is dimmed
on small screens.

Between About and Projects sits a hand-drawn neuron divider — dendrites,
soma, myelinated axon, and branching terminals. Click it and an impulse
travels the full axon and its collaterals, then bursts confetti from the
terminals (it also fires quietly on its own; confetti only on click, and
never under `prefers-reduced-motion`).

Switching: click a name in the top-right picker · press `t` to cycle ·
digits `1`–`9` jump directly · `??` picks at random · `?theme=terminal` in the
URL makes a shareable link. The choice persists in localStorage and defaults
to `prefers-color-scheme`; favicon, tab title and `theme-color` follow the
theme, and switches cross-fade via the View Transitions API where supported.

Colour variables live at the top of `docs/assets/style.css`; per-theme details
in the "Theme details" block below them. New theme = a `[data-theme='…']`
variable block + a button in `index.html` + an entry in `BASE_THEMES`/`COLORS`
in `main.js`. Bump the `?v=` query on asset links when changing CSS/JS.

## Editing

- **Content** — edit `docs/index.html`; sections are marked with comments.
- **CV update** — recompile in the CV project, then copy the PDFs into `docs/cv/`.

Publishing = pushing to `master`. No render step required.
