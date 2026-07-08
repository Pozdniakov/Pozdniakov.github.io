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

Thirty-eight schemes (plus one secret); a theme = colours + its own typography
(section headings and the masthead speak each theme's display voice) + small
details:

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
- **dawn** — soft utopian morning: gradient sky with a slowly kindling sun, italic Cormorant headline in a terracotta gradient
- **matins** — a scriptorium at first light: dawn sun over parchment, scholarly EB Garamond, justified text, rubricated drop cap, gilded gradient headline
- **lauds** — the palest hour before sunrise: cool grey-blue quiet, EB Garamond, one gold thread of first light under the name
- **vespers** — the scriptorium at dusk: sunset embers on dark parchment, candle-gold drop cap, ember-to-violet headline
- **compline** — the last office of the day: near-dark, a breathing pool of candlelight over the page, gold versal
- **observatory** — a star atlas at midnight: engraved brass small caps on deep blue, night-toned portrait, the graph as a star chart
- **bodoni** — headline-first editorial: uppercase Bodoni Moda masthead, thick-and-thin black rules, grayscale portrait, crimson on hover
- **marble** — Roman museum: veined stone, Cinzel capitals, bronze accents
- **sumi** — ink wash on washi paper; § headers as vermilion hanko seals
- **pinstripe** — bespoke navy wool with a chalk stripe, small-caps headings, burgundy silk
- **xray** — radiograph: film black, viridian marks, the portrait develops as a negative
- **prism** — a white page in refracted light: strict justified EB Garamond, ink dissolving into indigo and teal at the end of the name, a faint cool band crossing the paper
- **endpaper** — marbled endpapers of a library book: muted swirls (indigo, olive, terracotta, slate) under delicate Cormorant, oxblood accents
- **terrazzo** — palazzo floor: stone chips in library colours scattered across ivory, a little chip before each heading
- **collage** — cut-paper shapes (cobalt, olive, terracotta) around strict Cormorant; headings sit at slight angles
- **specimen** — a type-specimen sheet: justified EB Garamond, proof-mark red pilcrows, one enormous ghost ampersand
- **moire** — op-art scholarship: two fine grids slowly interfering, red-blue double vision on the name
- **rorschach** — a ghostly symmetric inkblot over the reading column, clinical grayscale portrait
- **errata** — the photocopy went in crooked: the whole page tilted a third of a degree, typo-squiggles under the links, [sic] after the headings, [citation needed] after the rabbit holes
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
soma, a partly myelinated axon (a few well-spaced internodes with bare
initial and terminal segments), and three branching collaterals. Click it:
the impulse glides smoothly out of the soma, jumps node to node through the
myelin (saltatory conduction), glides smoothly into the branch point, splits
along all three collaterals, and bursts confetti from every bouton (it also
fires quietly on its own; confetti only on click, and never under
`prefers-reduced-motion`).

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
