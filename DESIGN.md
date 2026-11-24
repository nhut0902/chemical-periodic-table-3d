# DESIGN.md — The Periodic Table (3D Science Exhibit)

A single design contract for the interactive periodic table. Everything in `src/`
follows these rules; components should not invent their own tokens.

## 1. Visual identity

**Concept:** a deep-space observatory instrument. Data is precise, surfaces are
dark and quiet, and light is used only where it means something (selection,
energy, classification). No decorative gradients, no coloured card walls, no
emoji.

References in spirit: Apple Vision Pro (depth + restrained translucency),
Linear (spacing, hierarchy, keyboard-first), Stripe (typographic information
design), scientific visualisation software (legends, units, provenance).

- Background: a near-black blue field (`#080D18`) with a **very** faint
  scientific grid (1px lines at 4% alpha, 64px pitch) and a single radial
  bloom behind the hero.
- Glass: only for floating chrome (top bar, tab strips, 3D HUD). Max one
  backdrop-blur layer per visual group, `blur(14px)`, 8% white fill, 1px
  hairline border.
- Light: glow is a state, not a decoration. Hover = +18% luminance, selected =
  1px primary ring + soft outer glow, focus = visible 2px ring.

## 2. Colour tokens

Defined once in `src/index.css` under `@theme`.

| Token | Value | Use |
| --- | --- | --- |
| `--color-abyss` | `#080D18` | page background |
| `--color-abyss-soft` | `#0B1322` | section background |
| `--color-surface` | `#111827` | panels, tiles |
| `--color-surface-2` | `#162034` | raised rows, inputs |
| `--color-line` | `#22304B` | hairline borders |
| `--color-primary` | `#38BDF8` | primary action, selection, links |
| `--color-accent` | `#A78BFA` | secondary highlight, 3D orbital |
| `--color-text` | `#F8FAFC` | primary text |
| `--color-muted` | `#8A9AB8` | secondary text (contrast ≥ 5.2:1 on abyss) |
| `--color-faint` | `#5A6883` | tertiary labels, units |

**Element category palette** (used identically in tiles, legend, charts and the
3D legend — a category always has one colour):

| Category | Hex |
| --- | --- |
| Kim loại kiềm (alkali) | `#F97362` |
| Kim loại kiềm thổ (alkaline earth) | `#F4A259` |
| Kim loại chuyển tiếp (transition) | `#E9C46A` |
| Kim loại hậu chuyển tiếp (post-transition) | `#7DD3A7` |
| Á kim (metalloid) | `#4FD1C5` |
| Phi kim (nonmetal) | `#38BDF8` |
| Halogen | `#63A9FF` |
| Khí hiếm (noble gas) | `#A78BFA` |
| Lanthanide | `#E879C4` |
| Actinide | `#C084FC` |

Semantic: proton `#F97362`, neutron `#8A9AB8`, electron `#38BDF8`. Shell colours
follow a cool→warm ramp so shells read as nested layers, never as decoration.

## 3. Typography

Self-hosted (no runtime font CDN — the exhibit must work offline).

- **Display** — Space Grotesk Variable: hero, section titles, element symbol in
  3D HUD. Tracking `-0.03em` at large sizes, `0` below 18px.
- **UI / body** — Inter Variable: 14–16px body, 12–13px controls, 11px labels.
- **Data** — JetBrains Mono Variable: atomic numbers, masses, temperatures,
  configurations. Always tabular figures.

Scale: 12 / 13 / 14 / 16 / 19 / 24 / 32 / 44 / 64 px. No display text below
24px. Labels that stand alone use `uppercase 11px / 0.18em tracking / faint`.
Numeric values always name their unit in a dimmer sibling span.

## 4. Spacing & layout

4px base grid. Steps: 4, 8, 12, 16, 24, 32, 48, 64, 96. Section rhythm is 96px
desktop / 56px mobile. Content max-width 1280px with a 24px gutter; the
periodic table grid may extend to 1440px because it is the primary object.

Radius: 6px controls, 10px tiles, 14px panels, 999px pills. Never mix radii in
one cluster.

Elevation via borders and background steps, not drop shadows. One shadow token
exists (`--shadow-float`) for floating chrome only.

## 5. Component rules

- **Element tile**: 18 columns × 3 rows + f-block rows. Filled with category
  colour at 10% alpha, 1px border at 32% alpha. Contents: Z (10px mono, faint),
  symbol (18px Space Grotesk 600), name (9–10px, truncated), mass (9px mono,
  faint). Tile is a `<button>`; hover lifts 1px and raises border alpha.
  Dimmed state (search/filter miss) = 22% opacity, never hidden.
- **Panels**: `--color-surface`, 1px `--color-line`, 14px radius, 20–24px pad.
  Data rows are 40px tall with a hairline divider; label left, monospace value
  right, unit in faint.
- **Tabs**: 44px tall, text-only, active = primary text + 1px primary underline
  inset 30%; no pill backgrounds.
- **Buttons**: primary = primary fill with abyss text; secondary = transparent
  with `--color-line` border; icon buttons are 36px square, 20px icon, never
  icon-only without `aria-label` and a `title`.
- **Charts**: no chart junk. 1px grid at `--color-line`, axis labels 11px faint,
  one accent per series, tooltips on surface-2 with mono numbers. Every chart
  caption states the dataset metric and units.
- **Empty states** are never blank: they name the control that fills them.

## 6. Animation principles

- Purposeful only: state change, spatial continuity, physical motion of the atom.
- Durations: 120ms (hover), 200ms (panels/tabs), 420ms (view transitions).
  Easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- The 3D atom is the only perpetual animation. It is pauseable, speed-adjustable
  and disabled by `prefers-reduced-motion`.
- Never animate layout properties in lists; opacity + transform only.
- Number counters animate at most once per view change.

## 7. Responsive behaviour

- ≥1280px: full 18-column table, 3-column detail layouts, side-by-side lab.
- 1024–1279px: table keeps all columns, tiles shrink to 44px tall; detail panel
  stacks under the 3D stage.
- 768–1023px: table becomes horizontally scrollable with a sticky category
  rail, minimum tile 40px; navigation collapses to a menu button.
- <768px: single column; the table scrolls horizontally with a visible
  "scroll →" affordance; heavy 3D effects are reduced (DPR cap 1.5, fewer
  particles, no orbit rings shadows).
- Touch: all targets ≥ 40px; OrbitControls with one-finger rotate, two-finger
  zoom/pan; no hover-only information.

## 8. 3D visualisation standards

- Units and honesty: the nucleus is **not to scale** (radius ∝ A^(1/3), then
  normalised); the HUD states "mô hình trực quan hoá, không theo tỉ lệ thật".
- Two explicitly named modes: **Bohr (minh hoạ)** — discrete shells with moving
  electrons; **Orbital (xác suất)** — point clouds sampled from |ψ|²
  approximations. The UI must never present Bohr as quantum-mechanical truth.
- Colour: protons warm, neutrons neutral grey, electrons primary; shell tints
  from a cool→warm ramp, one tint per shell.
- Lighting: one key light, one cool rim light, faint ambient. Emissive only on
  the nucleus core and electron markers.
- Performance: `InstancedMesh` for nucleons and electrons, a single `Points`
  draw call per orbital cloud, DPR clamped to 1.75 (1.5 on mobile), rendering
  paused when the tab is hidden, WebGL fallback panel with install-free
  instructions when unavailable.
- Camera: perspective 45°, initial distance ~9 units, OrbitControls with
  damping, min/max distance [4, 22], pan enabled, auto-rotate at 0.6 rpm.

## 9. Data provenance

`src/data/elements.ts` holds standard atomic weights, IUPAC group/period,
category, melting/boiling points (K at 1 atm), density (g·cm⁻³ at 20 °C),
Pauling electronegativity, covalent radii (Cordero 2008, pm), first ionisation
energy (kJ·mol⁻¹), discovery year and discoverer. Electron configurations are
computed from Z (aufbau + documented exceptions) rather than typed by hand.
Sources are surfaced in the UI footer and in the Education view. Any value that
is not measurable (e.g. electronegativity of noble gases) is `null` and renders
as "—", never as a fabricated number.
