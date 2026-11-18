# Syntax Flow website: agent instructions

@AGENTS.md

This repository follows the owner's Website & Product Constitution (supplied separately). The rules below are the project-specific parts.

## Before changing code

- This Next.js version differs from older training data. Read the relevant guide in `node_modules/next/dist/docs/` first (see AGENTS.md).
- Cache Components is on. Pages stay mounted but hidden (React Activity) after navigation, so:
  - never hard-code element `id`s that could repeat across pages; use `useId()` or page-prefixed ids;
  - use `getByRole` locators in tests (hidden pages are excluded from the accessibility tree);
  - no `new Date()` or `Math.random()` in prerendered server components without `"use cache"`.
- Company facts live in `src/content/site.ts`. Never invent clients, metrics, testimonials, certifications or people. Use `<ContentPending>` and record the item in `docs/CONTENT_INVENTORY.md`.

## Harness

"Done" for a change means all of these pass, and UI changes have been looked at in a browser:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run screenshots -- <scratch-dir> <routes>   # then inspect desktop and mobile captures
```

## Rules that are easy to break

- The inquiry endpoint must never report success for an inquiry that was not delivered.
- `INQUIRY_DELIVERY=log` and `E2E_TEST_MODE` are for local and CI test runs only.
- Keep `zod` and anything in `src/lib/inquiry/schema.ts`, `guard.ts`, `deliver.ts` out of client components (`server-only`).
- Motion must respect `prefers-reduced-motion`, and content must never wait on JavaScript or animation to become visible.
- Text in docs, comments and commit messages: no em dashes, no filler.
