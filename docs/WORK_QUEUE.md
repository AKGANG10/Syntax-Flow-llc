# Work queue

Status as of 2026-11-18: **IMPLEMENTED and TESTED.** Not deployed. Not release ready until the blockers below are closed.

## Evidence (2026-11-18, local production build, after the dashboard release)

- Lint, type check, production build: pass.
- Playwright: 100 tests pass on Edge (desktop 1440x900 and Pixel 7), including dashboards (tabs by mouse and keyboard, keyboard chart tooltips, live toggle), the real EmailJS adapter against a mock, the unconfigured-production refusal, redirects, and the hero renderer per device.
- Lighthouse 13.6 (local `next start`, Edge headless):

  | Page | Mobile perf | Desktop perf | Accessibility | Best practices | SEO |
  |---|---|---|---|---|---|
  | Home | 91 to 98 | 96 to 99 | 100 | 100 | 100 |
  | Platform | 95 | 99 | 100 | 100 | 100 |
  | Talent | 95 | 100 | 100 | 100 | 100 |

  Ranges are across repeated runs. Local numbers; re-measure on the deployed site.
- `npm audit --omit=dev`: 0 vulnerabilities.

## Done since the first build

- Canonical domain confirmed (apex); `www` permanent redirect added and tested.
- EmailJS template ID `template_6m1tuud` recorded; template variable aliases added; adapter tested against a mock.
- DNS inspected read-only and a safe go-live change set written (docs/DOMAIN_DNS.md). Google Workspace mail records identified and protected.
- Hosting compared; company deployed to Vercel. Live smoke test passed; production correctly refuses inquiries (503) until EmailJS keys are set.
- EmailJS Service ID `service_53cnnxd` recorded.
- Server messages for missing fields made plain-language (found on the live deployment).
- E-Verify poster rule corrected: posters must be hosted on the site, not linked.
- Lighthouse findings fixed: lifecycle list semantics; scroll reveal no longer fades text.

## Launch blockers (need Syntax Flow)

| # | Item | Needs | Acceptance |
|---|---|---|---|
| 1 | EmailJS Public Key and Private Key. Service ID `service_53cnnxd` and Template ID `template_6m1tuud` are set in Vercel | Company | Both keys in Vercel; docs/EMAIL_SETUP.md section 5 all checked |
| 2 | Vercel: deployed, auto-deploys from `main`. Set 2026-11-18: `NEXT_PUBLIC_SITE_URL`, `INQUIRY_DELIVERY`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`; apex and www domains added. Remaining: Pro plan decision | Company | Project on a plan that permits commercial use |
| 3 | ~~GoDaddy DNS change~~ **Done 2026-11-18.** Site live on https://syntaxflowllc.com with HTTPS; email records verified unchanged | | Only remaining check: outside test email to hr@ |
| 4 | Legal review of Privacy and Terms; retention policy | Counsel | Draft banners removed (`draft={false}`) |
| 5 | Confirm statements in docs/CONTENT_INVENTORY.md | Company | Each confirmed or edited |
| 6 | E-Verify and Right to Work posters (English, Spanish) from the E-Verify account | Company | PDFs hosted and linked on Careers; placeholder removed |

## Soon after launch

| # | Item | Notes |
|---|---|---|
| 7 | Case studies, leadership, culture, certifications, partnerships | Remove matching `ContentPending` blocks |
| 8 | Official vector logo files | ADR-009 |
| 9 | Shared-store rate limiting | ADR-005; before paid traffic |
| 10 | Uptime and error alerts for `/api/inquiry` | Alert on 502/503 |
| 11 | Re-run Lighthouse on the live domain | Record here |
| 12 | Screen reader pass (NVDA + Edge, VoiceOver + Safari) | Home, Contact, Careers |
| 13 | Safari and Firefox checks | E2E covers Edge/Chromium only |
| 14 | CAA record and DNSSEC decision | docs/DOMAIN_DNS.md "Later" |

## Enhancements (not started)

- Insights section once three approved articles exist (ADR-007).
- Job board and candidate profiles (needs ATS decision and upload security, ADR-006).
- Guided AI discovery, clearly labelled as AI, with the form as fallback.
- Industry landing pages backed by verified stories.
- HSTS `includeSubDomains` after DNS review (ADR-008).
- Upgrade `eslint-config-next` past the ESLint 9 advisories.
