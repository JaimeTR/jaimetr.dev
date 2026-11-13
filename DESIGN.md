# Design system: jaimetr.dev

Language of devmarkpe.com (floating UI windows, serif-italic emphasis, rounded buttons, glass bar) in Jaime's celeste on deep navy. Dark only.

## Colour (CSS variables in `src/app/globals.css` and `src/components/inicio/inicio.css`)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#061320` | page ground |
| `--raise` / `--surface` | `#0a1e33` | windows, cards, code |
| `--surface-2` | `#0e2a47` | raised cards |
| `--ink` | `#ebf7ff` | headings and body |
| `--ink-2` | `#aac9e2` | secondary text |
| `--ink-3` | `#87a9c6` | meta (still > 4.5:1) |
| `--rule` / `--line` | `rgba(117,219,255,.16)` | hairlines and borders |
| `--accent` / `--cian` | `#00a8e8` | links, active states, primary button |
| `--cian-soft` | `#75dbff` | highlights, bars, focus ring |
| `--pri` / `--pri-2` | `#0a9be0` / `#0072b8` | gradient ends on bars |

Primary button: celeste gradient (`#4cc9fa` to `#00a8e8`) with **dark text** (white on celeste fails contrast). Closing band: deep blue gradient (`#0a73ad` to `#06476f`) with a white button. A fixed radial glow sits behind the whole site (`body::before`).

## Type

- Sans and display: **Schibsted Grotesk Variable** (weight 500 for titles, tracking -0.035em, line-height 1.02).
- Emphasis word in a title: **Instrument Serif italic** (`<em>` inside `.inicio-titulo` or `.display`).
- Code: system monospace, only in code blocks.

## Components

- Floating glass bar (`.inicio-barra`, sticky), links from the ERP profile, ES/EN links, "Hablemos" button.
- Buttons: 12px radius; `--pri` (gradient), `--vidrio` (glass), `--blanco` (on the band).
- Chips: pill, glass background, 1px line.
- Floating windows (`.inicio-ventana`): title bar with three dots, data-driven bars, 3D tilt and pointer parallax on desktop.
- Experience: sticky card stack (`.inicio-carta`); the covered card scales to .93 and darkens (no transparency).
- Lists elsewhere (projects, articles): hairline rows, no cards.
- Global footer: closing band + links.

## Motion

Lenis smooth scroll + GSAP ScrollTrigger on the home only. One entrance per block; transform/opacity/filter/clip-path only. `prefers-reduced-motion` shows the final state. Mobile (< 900px) drops 3D tilt and pinned effects.
