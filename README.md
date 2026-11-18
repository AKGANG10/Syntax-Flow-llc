# Syntax Flow website

Marketing and lead-generation site for **Syntax Flow LLC**, a technology and talent solutions company in Dallas, Texas. It presents both pillars (Technology and Talent), the combined Technology + Talent offer, and routes visitors into the right inquiry: technology, talent, both, or joining the talent network.

Status: **live at https://syntaxflowllc.com** (Vercel). Contact forms show a fallback until the EmailJS keys are set. Canonical URL: https://syntaxflowllc.com. See [docs/WORK_QUEUE.md](docs/WORK_QUEUE.md) for evidence and what is left before launch, and [docs/DEPLOY.md](docs/DEPLOY.md) to go live.

## Stack

| Area | Choice |
|---|---|
| Framework | Next.js 16.4 (App Router, Cache Components), React 19.3, TypeScript (strict) |
| Styling | Tailwind CSS 4.3 with design tokens in `src/app/globals.css` |
| Motion | CSS, CSS scroll-driven animations, one 2D canvas. No animation libraries |
| Validation | zod 4 (server only) |
| Email | EmailJS REST API, called from the server |
| Tests | Playwright 1.65 against the production build |
| Runtime | Node.js 24 LTS |

Every page is statically prerendered. The only dynamic route is `POST /api/inquiry`.

## Commands

```bash
npm install
npm run dev            # http://localhost:3000, form submissions logged instead of emailed
npm run lint
npm run typecheck
npm run build
npm run test:e2e       # builds must exist; starts `next start` on :3100
npm run verify         # lint + typecheck + build + e2e
npm run screenshots -- <out-dir> [routes...]   # full-page captures, desktop and phone
npm run brand:assets   # regenerate logo assets from assets/brand/
```

Playwright uses the locally installed Microsoft Edge by default (no browser download). In CI or on machines without Edge: `npx playwright install chromium` and set `PW_CHANNEL=chromium`.

## Configuration

Copy `.env.example` to `.env.local`. Nothing secret belongs in the repository.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical origin for metadata, sitemap and structured data |
| `INQUIRY_DELIVERY` | Production | `emailjs`. Unset in production means forms refuse submissions with a clear message |
| `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY` | With `emailjs` | Server-side EmailJS credentials |
| `EMAILJS_TEMPLATE_ID_CANDIDATE` | No | Separate template for talent network sign-ups |
| `INQUIRY_RATE_LIMIT_MAX` | No | Submissions per client per 10 minutes (default 5) |
| `SITE_INDEXABLE` | Preview/staging | `false` to block indexing |

Email setup and the delivery test plan: [docs/EMAIL_SETUP.md](docs/EMAIL_SETUP.md).

## Structure

```
src/app/            routes, layout, metadata, sitemap, robots, API
src/components/     UI primitives, header/footer, flow field, ecosystem map, forms
src/content/        company facts, navigation, capabilities, industries (single source of truth)
src/lib/strands.ts  strand geometry shared by the canvas and SVG motifs
src/lib/inquiry/    schema, abuse guards, delivery adapter (server only)
e2e/                Playwright tests
scripts/            brand asset pipeline, screenshot helper
docs/               decisions, design system, security, content inventory, work queue
```

## Documentation

- [docs/DECISIONS.md](docs/DECISIONS.md): architecture and design decisions with revisit triggers
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md): brand DNA, tokens, type, motion, accessibility
- [docs/SECURITY.md](docs/SECURITY.md): controls, known limitations, hardening steps
- [docs/CONTENT_INVENTORY.md](docs/CONTENT_INVENTORY.md): placeholders and claims the company must supply or confirm
- [docs/EMAIL_SETUP.md](docs/EMAIL_SETUP.md): EmailJS configuration and verification
- [docs/DOMAIN_DNS.md](docs/DOMAIN_DNS.md): DNS snapshot for syntaxflowllc.com and the safe go-live change set
- [docs/DEPLOY.md](docs/DEPLOY.md): hosting recommendation, environment variables, smoke test
- [docs/WORK_QUEUE.md](docs/WORK_QUEUE.md): evidence and prioritized remaining work
