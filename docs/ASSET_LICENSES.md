# Asset licenses

Every external asset used on the site, with its license as checked on the date shown. If a license cannot be confirmed, the asset is not used.

## Photography (Unsplash)

License: [Unsplash License](https://unsplash.com/license), checked 2026-11-18. Commercial and non-commercial use allowed; no permission or attribution required (credit given here anyway). Not permitted: selling the images without significant modification, or compiling them into a competing image service. Neither applies.

Each photo page below showed "Free to use under the Unsplash License" on 2026-11-18. Photos marked **Unsplash+** (paid) were rejected; one candidate (Alex Shuper, server room) was rejected for that reason.

| Key | Photo | Photographer | Unsplash ID | Commercial use | Used on |
|---|---|---|---|---|---|
| discover | [Wall of sticky notes](https://unsplash.com/photos/a-wall-with-a-bunch-of-sticky-notes-on-it-fQOyF0D0cDU) | Jakub Żerdzicki | fQOyF0D0cDU | Yes | Home: The Flow, step 1 |
| design | [Designing wireframes at a desk](https://unsplash.com/photos/man-designing-wireframes-at-desk-with-laptop-pqzRfBhd9r0) | UX Indonesia | pqzRfBhd9r0 | Yes | Home: The Flow, step 2 |
| build | [Programmer at several monitors](https://unsplash.com/photos/programmer-coding-at-a-desk-with-several-monitors-bWVBCDtTRJI) | Jakub Żerdzicki | bWVBCDtTRJI | Yes | Home: The Flow, step 3; Technology |
| connect | [Team around a computer](https://unsplash.com/photos/team-collaborating-around-a-computer-in-an-office-UikYLDQj9_I) | Vitaly Gariev | UikYLDQj9_I | Yes | Home: The Flow, step 4; People and practice |
| scale | [Server racks in a data center](https://unsplash.com/photos/server-racks-in-data-center-klWUhr-wPJ8) | imgix | klWUhr-wPJ8 | Yes | Home: The Flow, step 5 |
| transform | [Glass skyscrapers](https://unsplash.com/photos/modern-glass-skyscrapers-reflecting-the-sky-ybJO3h3YsiE) | Sebastian Schuster | ybJO3h3YsiE | Yes | Home: The Flow, step 6; Transformation |
| typing | [Hands typing, code on screens](https://unsplash.com/photos/hands-typing-on-a-keyboard-with-computer-screens-8ljjFxQFwKM) | Jakub Żerdzicki | 8ljjFxQFwKM | Yes | Home: People and practice |
| office | [Open-plan office](https://unsplash.com/photos/an-office-with-a-lot-of-desks-and-chairs-pYlBAu3de0w) | Bernd Dittrich | pYlBAu3de0w | Yes | Company; Careers |
| colleagues | [Two colleagues at a laptop](https://unsplash.com/photos/two-colleagues-collaborating-on-a-project-at-a-laptop-tRvuRPE8cr4) | Vitaly Gariev | tRvuRPE8cr4 | Yes | Company; Talent |
| technician | [Technician at server equipment](https://unsplash.com/photos/technician-working-on-server-equipment-with-tools-ufT32_VFS-I) | Valentin Lacoste | ufT32_VFS-I | Yes | Home: People and practice |

**Status:** verified, not yet imported. Unsplash blocks automated downloads, so the files must be downloaded by a person ("Download free" on each page) and imported with `npm run media:import -- "<folder>"`. Until then, each slot renders original procedural art (no broken images).

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
