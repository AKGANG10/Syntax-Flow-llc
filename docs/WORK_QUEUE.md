# Work queue

Status as of 2026-11-18: **IMPLEMENTED and TESTED locally.** Not deployed, not release ready.

Priority order follows the constitution: launch blockers, then committed requirements, then quality, then enhancements.

## Launch blockers

| # | Item | Owner | Acceptance |
|---|---|---|---|
| 1 | Configure EmailJS and pass the verification list | Company + engineer | All boxes in docs/EMAIL_SETUP.md section 5 checked |
| 2 | Legal review of Privacy and Terms; add retention policy | Company + counsel | Draft banners removed (`draft={false}`) |
| 3 | Confirm statements in docs/CONTENT_INVENTORY.md | Company | Each confirmed or edited |
| 4 | Confirm canonical domain (apex or www) | Company | `NEXT_PUBLIC_SITE_URL` set per environment |
| 5 | DNS inventory, then connect the domain with HTTPS | Engineer, with authorization | Domain checklist complete; email records preserved |
| 6 | Choose hosting and set up preview + production with `SITE_INDEXABLE=false` on preview | Company decision | Preview not indexable; production smoke test passes |
| 7 | Link E-Verify and Right to Work posters on Careers | Company | Placeholder removed |

## Before or soon after launch

| # | Item | Notes |
|---|---|---|
| 8 | Supply case studies, leadership, culture, certifications, partnerships | Remove the matching `ContentPending` blocks |
| 9 | Official vector logo files | Replace PNGs, keep file names (ADR-009) |
| 10 | Shared-store rate limiting | ADR-005; required before paid traffic |
| 11 | Uptime and error monitoring for `/api/inquiry` | Alert on 502/503 spikes |
| 12 | Lighthouse and Core Web Vitals measured on the deployed site | Record scores; target 90+ |
| 13 | Screen reader pass (NVDA + Edge, VoiceOver + Safari) on Home, Contact, Careers | Automated checks do not replace this |
| 14 | Safari and Firefox checks | E2E currently runs Edge/Chromium only |

## Enhancements (not started)

- Insights section once three approved articles exist (ADR-007).
- Searchable job board and candidate profiles (needs ATS decision and upload security, ADR-006).
- Guided AI discovery ("What are you trying to build?") per the brief. Must be labelled as AI, keep the deterministic form as fallback, and route to people, not decide.
- Industry-specific landing pages when there are verified stories per industry.
- HSTS `includeSubDomains` after DNS review (ADR-008).
- Upgrade `eslint-config-next` when it drops the ESLint 9 dependency tree with advisories.
