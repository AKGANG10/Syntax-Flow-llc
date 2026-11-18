# Asset licenses

Every external asset used on the site, with its license as checked on the date shown. If a license cannot be confirmed, the asset is not used.

## Photography (Pexels)

License: [Pexels License](https://www.pexels.com/license/), checked 2026-11-18. Free for commercial and non-commercial use, modification allowed, attribution not required (credited here anyway). Not allowed: selling unaltered copies, implying that people shown endorse Syntax Flow, or using images in a misleading or offensive way.

Each photo page below showed "Free" (no paid marker) on 2026-11-18. Files were downloaded from the Pexels image CDN on 2026-11-18 into `syntax Flow/photos` and imported with `npm run media:import` (resized to 2400px, metadata stripped). Manifest: `src/content/media.ts`.

| Key | Photo | Photographer | Pexels ID | Commercial use | Used on |
|---|---|---|---|---|---|
| discover | [Sticky notes on a whiteboard](https://www.pexels.com/photo/creative-brainstorming-session-with-sticky-notes-29521529/) | Jakub Zerdzicki | 29521529 | Yes | Home: The Flow |
| design | [Wireframes in a notebook](https://www.pexels.com/photo/notebook-beside-the-iphone-on-table-196644/) | picjumbo.com | 196644 | Yes | Home: The Flow |
| build | [Developer at two monitors](https://www.pexels.com/photo/man-coding-on-computers-sitting-at-desk-16129703/) | Lisa Fotios | 16129703 | Yes | Home: The Flow; Technology |
| connect | [Team around a laptop](https://www.pexels.com/photo/a-team-looking-at-a-laptop-and-collaborating-7643742/) | MART PRODUCTION | 7643742 | Yes | Home: The Flow, People and practice |
| scale | [Server racks in a data center](https://www.pexels.com/photo/server-racks-on-data-center-5480781/) | Brett Sayles | 5480781 | Yes | Home: The Flow |
| transform | [Glass skyscrapers from below](https://www.pexels.com/photo/skyscrapers-with-reflecting-walls-in-modern-megapolis-7078666/) | Laura Tancredi | 7078666 | Yes | Home: The Flow; Transformation |
| typing | [Hands typing code on a laptop](https://www.pexels.com/photo/hands-typing-on-a-laptop-computer-5385526/) | TREEDEO.ST | 5385526 | Yes | Home: People and practice |
| office | [Open-plan office](https://www.pexels.com/photo/photo-of-building-interior-3778622/) | Polina Zimmerman | 3778622 | Yes | Company; Careers |
| colleagues | [Two colleagues at a laptop](https://www.pexels.com/photo/a-man-and-woman-working-together-6893945/) | Mikhail Nilov | 6893945 | Yes | Company; Talent |
| technician | [Engineer cabling a server rack](https://www.pexels.com/photo/electronics-engineer-fixing-cables-on-server-442150/) | Field Engineer | 442150 | Yes | Home: People and practice |

**History:** an earlier set of ten Unsplash photos was verified but never imported, because Unsplash blocks automated downloads. It was replaced by this set; no Unsplash file was ever published.

**Usage rule:** stock photos are illustrative. Never caption them as Syntax Flow staff, offices or clients, and never use them as evidence of real events. Several show identifiable people; the Unsplash License does not grant rights for uses that imply those people endorse Syntax Flow.

## Typefaces

| Font | Source | License |
|---|---|---|
| Plus Jakarta Sans | Google Fonts via `next/font` (self-hosted at build) | SIL Open Font License 1.1 |
| IBM Plex Mono | Google Fonts via `next/font` (self-hosted at build) | SIL Open Font License 1.1 |

## Code libraries with visual output

| Library | Version | License |
|---|---|---|
| three.js (incl. `RoomEnvironment` from its examples) | 0.187.0 | MIT |

## Original assets (no external license)

- Logo-derived assets (wordmark, favicon, Open Graph image): produced by `scripts/prepare-brand-assets.mjs` from the logo supplied by Syntax Flow.
- 3D flow core, 2D strand field, intro animation, all mini-visualizations (`mini-viz.tsx`), industry artwork (`industry-art.tsx`), talent network and journey graphics: original work created for this site.
- No icon library is used.
