# Design sources and inspiration

What informed the 2026-11 redesign, and what was deliberately not taken from it. Nothing here was copied: no layouts, code, graphics, animations, wording or identity.

## Primary source: the Syntax Flow logo

Everything visual derives from the supplied logo: fine blue strands pinching at convergence points, bold navy strands with open ring nodes, scattered dots, a rise to the right, and the blue disk inside a navy ring (the "o" in "Flow"). See docs/DESIGN_SYSTEM.md for how each element maps to meaning.

## Benchmarks for quality (not templates)

| Reference | What we studied | What we did not take |
|---|---|---|
| [Scrolltide](https://www.scrolltide.co/) (named in the owner's constitution as a technique reference) | Pacing of scroll-driven storytelling, pinned sections, restraint in shader effects | Any template, component, animation or visual identity |
| Premium product storytelling in general (Apple-style launch pages) | One idea per screen, cinematic pacing, large type | Layouts, imagery, copy |
| Awwwards-level studio sites in general | Micro-interaction finish: magnetic controls, cursor companions, tilt | Specific interactions or code |

## Technique references

- Next.js 16 bundled documentation (`node_modules/next/dist/docs/`): Cache Components, Activity, CSP, images.
- three.js documentation and examples (MIT): `RoomEnvironment`, `ShaderMaterial`, `LineSegments`.
- MDN: CSS scroll-driven animations (`animation-timeline: view()` and `scroll()`), `@property`, `prefers-reduced-motion`, `prefers-reduced-transparency`.
- WCAG 2.2 for contrast, focus and motion requirements.

## Explicitly avoided

Dark neon cyberpunk, crypto and gaming aesthetics, generic purple AI gradients, random rotating spheres, stock "business handshake" imagery, fake client logos, testimonials or statistics.
