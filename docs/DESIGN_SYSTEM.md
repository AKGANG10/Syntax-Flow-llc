# Design system

## Design story

The logo is the design system. It shows many fine blue strands that pinch together at convergence points and fan out again, a few bold navy strands with open ring nodes weaving through them, scattered filled dots, and the whole field rising to the right. The "o" in "Flow" is a blue disk inside a navy ring.

The site reads that as the company's two connected capabilities:

| Logo element | Meaning on the site | Used as |
|---|---|---|
| Fine blue strands, filled blue nodes | Technology: many systems | Technology markers, capability cards |
| Bold navy strands, open rings | Talent: the people who carry the work | Talent markers, people chips |
| Blue disk inside a navy ring (the "o") | Technology + Talent together | "Both" markers, favicon, success state |
| Pinch points | Where the work happens: a project, a hire | Hero composition |
| Rise to the right | Growth and scale | Hero, lifecycle |

This interpretation is the design team's proposal. Confirm it with the brand owner before using it in public copy beyond the current About paragraph.

**Style family.** Hybrid of Premium Technology and Editorial: light, airy "paper" sections with large tight type, alternating with dark ink bands for the ecosystem map and calls to action. Mono labels act as "syntax" markers.

**Avoided on purpose.** Purple AI gradients, robot imagery, stock photography, fake logos and statistics, glass on every card, scroll hijacking.

## Tokens (`src/app/globals.css`)

**Colour.** `ink-50..950` from the wordmark navy, `flow-50..900` from the strand blues, `paper` background, `success`, `danger`.

Contrast checked against WCAG 2.2 AA:

| Pair | Ratio | Use |
|---|---|---|
| `ink-900` on white | about 17:1 | Body and headings |
| `ink-600` on white | about 8:1 | Secondary text |
| `ink-500` on white | 5.7:1 | Muted text, minimum for small text |
| `flow-700` on white | 5.9:1 | Links and labels |
| `flow-600` on white | 4.4:1 | Graphics and large text only, never small text |
| `flow-300` on `ink-950` | 8.5:1 | Labels on dark |
| `ink-300` on `ink-950` | about 9:1 | Body on dark |

**Type.** Plus Jakarta Sans (variable) for everything, IBM Plex Mono for labels. Both self-hosted by `next/font`. Roles are utilities: `t-display`, `t-h1`, `t-h2`, `t-h3`, `t-lead`, `t-label`, all fluid with `clamp()`.

**Shape.** Pills for buttons and chips (ring motif); `--radius-card` 1.25rem and `--radius-panel` 1.75rem for surfaces.

**Motion tokens.** `--ease-flow` (`cubic-bezier(.22,1,.36,1)`), `--duration-fast` 160ms, `--duration-normal` 280ms, `--duration-slow` 520ms.

**Liquid glass.** Only the floating header and the hero path chips. Fallback to opaque `paper` when `backdrop-filter` is unsupported, or under `prefers-reduced-transparency` or `prefers-contrast: more`. Never used for forms or dense content.

## Motion levels in use

| Level | Where | Reduced motion |
|---|---|---|
| L1 micro-interaction | Buttons, links (strand underline), chips | Transitions near zero |
| L2 interface | Ecosystem map highlighting, menus | Instant |
| L3 story | Hero canvas, scroll reveals, journey progress line | Canvas draws one still frame; reveals and line show final state |

The hero canvas pauses when off-screen or in a background tab, caps device pixel ratio at 2, draws fewer strands under 640px and 1100px, halves frame rate on small or low-core devices, and reacts to the pointer only on fine pointers.

Scroll reveals use `animation-timeline: view()` inside `@supports`, so browsers without support show content immediately. Nothing waits on JavaScript to become visible.

## Components

| Component | File | Notes |
|---|---|---|
| Header | `site-header.tsx` | Disclosure menu (Escape, outside click, focus out, route change close it). Mobile panel with scroll lock via `html[data-menu-open]` |
| Footer | `site-footer.tsx` | Semantic `<address>`, cached copyright year |
| FlowField | `flow-field.tsx` | Hero canvas, decorative, `aria-hidden` |
| StrandMotif | `ui.tsx` | Static SVG strands from the same geometry |
| EcosystemMap | `ecosystem-map.tsx` | Toggle buttons with `aria-pressed`, polite live region describes the relationship |
| LifecycleRail | `lifecycle-rail.tsx` | Ordered list; horizontal on desktop, vertical on mobile |
| Journey, PillarNode | `journey.tsx` | Technology / Talent / Both node vocabulary |
| Forms | `inquiry-form.tsx` | Labels, hints and errors linked by `aria-describedby`; error summary as alert; focus to first invalid field in screen order |
| ContentPending | `ui.tsx` | Dashed placeholder for content the company must supply |

## Responsive strategy

Designed separately for phone (single column, strands below the hero copy, menu panel), tablet (two-column grids) and desktop (strands behind copy with a fade, sticky section intros, three-column map with connectors). Verified at 390px and 1440px; E2E tests assert no horizontal scroll on every page at both sizes.
