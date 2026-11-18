# Decision log

Each entry: context, decision, trade-offs, and the trigger that should reopen it. Dated 2026-11-18 unless noted.

## ADR-001: Next.js 16 with Cache Components, fully static pages

**Context.** Marketing site, no accounts, content changes rarely. The constitution's default stack is Next.js, React and TypeScript.
**Decision.** Next.js 16.4 App Router with the scaffold defaults (`cacheComponents`, `partialPrefetching`). All pages prerender to static HTML; only `POST /api/inquiry` runs per request.
**Trade-offs.** Pages stay mounted after navigation (React Activity), which affects duplicate ids, effects and test selectors (see CLAUDE.md).
**Revisit when** the site needs per-user content, authentication or a CMS with preview.

## ADR-002: CSP set as a static header, not per-request nonces

**Context.** Nonce-based CSP forces every page to render dynamically and disables static generation and CDN caching (Next.js CSP guide).
**Decision.** Strict CSP in `next.config.ts`: `default-src 'self'`, no third-party origins, `object-src 'none'`, `frame-ancestors 'none'`, `form-action 'self'`. `script-src` allows `'unsafe-inline'` for the framework's inline bootstrap scripts.
**Why it is acceptable now.** No user-generated HTML is rendered, React escapes all output, JSON-LD escapes `<`, and no third-party scripts load.
**Revisit when** adding authentication, a candidate portal, analytics or any third-party script. Then move to nonces in `proxy.ts` and accept dynamic rendering.

## ADR-003: 2D canvas and CSS instead of WebGL, Three.js or GSAP

**Context.** The brief lists WebGL, R3F, GSAP and particles as possible techniques. The constitution says to use the lightest technology that achieves the intent.
**Decision.** The hero is one 2D canvas drawing the logo's strands (about 36 polylines per frame). Scroll reveals and the journey line use CSS scroll-driven animations as progressive enhancement. Zero animation dependencies.
**Trade-offs.** No 3D depth or shader effects. In exchange: no extra JavaScript, works on low-end phones, trivial reduced-motion path.
**Revisit when** a concrete story needs spatial depth (for example an interactive capability map in 3D) and has a performance budget and a 2D fallback.

> **Superseded in part by ADR-010 (2026-11-18):** the owner's redesign brief explicitly requires 3D and immersive motion. The 2D canvas remains the fallback.

## ADR-004: EmailJS called from the server, behind a delivery adapter

**Context.** The constitution bundle includes EmailJS setup rules. No email provider credentials exist yet.
**Decision.** `src/lib/inquiry/deliver.ts` sends through the EmailJS REST API from the server, so the private key never reaches the browser. Provider selection is explicit (`INQUIRY_DELIVERY`). Unconfigured production returns HTTP 503 with direct contact details; it never shows a false success.
**Trade-offs.** EmailJS must have "API access from non-browser environments" enabled. Volume limits depend on the EmailJS plan.
**Revisit when** volume grows, attachments (resumes) are needed, or delivery events and bounces must be tracked. A server transactional provider (for example Resend, Postmark or SES) can replace the adapter without touching the forms.

## ADR-005: In-memory rate limiting and deduplication

**Decision.** Sliding-window limit (5 per 10 minutes per client), 10-minute duplicate suppression, origin check, honeypot and minimum fill time, all in process memory.
**Limitation.** Per instance only. On serverless or multiple instances the limits are approximate.
**Revisit before** high-traffic launch or any paid advertising: move state to a shared store (Redis or a platform KV).

## ADR-006: No resume uploads through the website

**Decision.** The talent network collects profile details and an optional https profile link. Resumes are exchanged with a recruiter after first contact.
**Why.** Uploads of personal documents need storage, malware scanning, access control and retention rules that do not exist yet.
**Revisit when** a candidate portal or ATS integration is approved.

## ADR-007: Insights section deferred

**Decision.** No Insights page until real articles exist. An empty blog is a thin page and hurts trust and SEO.
**Revisit when** the first three articles are written and approved.

## ADR-008: HSTS without includeSubDomains or preload

**Decision.** `Strict-Transport-Security: max-age=31536000`.
**Why.** `includeSubDomains` and `preload` would force HTTPS on every subdomain of the domain, including mail and any legacy services. DNS has not been inspected.
**Revisit after** the DNS inventory in the domain checklist confirms all subdomains serve valid HTTPS.

## ADR-009: Header wordmark derived from the supplied raster logo

**Decision.** `scripts/prepare-brand-assets.mjs` makes transparent PNGs from the supplied logo with a colour-to-alpha pass. The favicon uses the filled "o" of "Flow" (blue disk in a navy ring).
**Revisit when** official vector (SVG) logo files are available. Replace the PNGs and keep the same file names.

## ADR-010: 3D hero with three.js, code-split and capability-gated (2026-11-18)

**Context.** The owner's redesign brief requires a cinematic, immersive, 3D experience with a narrative purpose ("no random rotating sphere").
**Decision.** A single three.js scene (`flow-core-3d.ts`): technology strands and talent strands with ring nodes converge into a glass core holding the logo's disk-in-ring, then leave as one rising ribbon; cyan pulses travel the strands. Plain three.js, not React Three Fiber or Drei: one scene does not justify the extra dependencies. Strand motion runs in vertex shaders.
**Gates.** Loaded by dynamic import only when the device has a fine pointer, at least 1024px width, at least 4 cores, WebGL2 and no reduced-motion preference. Everyone else gets the 2D canvas. Render loop pauses off-screen and in background tabs; DPR capped at 1.75; a fresh canvas per mount so React Activity can hide and re-show the page safely.
**Trade-offs.** 136 KB gzipped (557 KB raw) of JavaScript, measured 2026-11-18, fetched by dynamic import on capable desktops only (not referenced by the initial HTML). Measured with Lighthouse after the change (docs/WORK_QUEUE.md).
**Revisit when** Lighthouse desktop performance drops below 90 or a lighter technique gives the same story.

## ADR-011: No GSAP, ScrollTrigger, Lenis or Framer Motion (2026-11-18)

**Context.** The brief lists these as possible tools and asks for the minimum necessary dependencies.
**Decision.** Pinned sections (The Flow, industries rail) use CSS `position: sticky` plus a 60-line `useScrollProgress` hook; reveals, text scrub, photo reveal, parallax and progress use CSS scroll-driven animations as progressive enhancement; micro-interactions (`useMagnetic`, `useTiltCard`, cursor companion) are small hooks. Native scrolling is kept: no smooth-scroll library, because it hijacks scrolling, which the owner's constitution prohibits without strong justification.
**Revisit when** a sequence needs timeline choreography that these primitives cannot express cleanly.

## ADR-012: Photography from verified Unsplash photos, with procedural fallbacks (2026-11-18)

**Decision.** Ten photos, each verified as free under the Unsplash License (not Unsplash+), recorded in docs/ASSET_LICENSES.md. Unsplash blocks automated downloads, so files are downloaded by a person and imported with `npm run media:import`. `<PhotoFrame>` renders original procedural art until a file exists, so the site never ships a broken or unlicensed image. Industries use original artwork instead of photos.

## ADR-013: Route rename `/solutions/technology-talent` to `/solutions/transformation` (2026-11-18)

**Decision.** Follows the brief's route list. The old URL was live, so it redirects permanently (308) in `next.config.ts`; covered by an E2E test.
