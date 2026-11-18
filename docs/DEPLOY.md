# Deployment

**Host: Vercel** (chosen by Syntax Flow, 2026-11-18). Live preview: https://syntax-flow-llc.vercel.app

Smoke test of that deployment on 2026-11-18 (commit `9e08bcb`): all 12 pages 200, unknown routes 404, all security headers present, robots and sitemap correct, inquiry API rejects other origins (403), wrong content type (415) and invalid fields (400). A valid inquiry returned **503 not configured**: EmailJS keys are not set yet, and the site correctly refuses instead of losing the message.

## Plan note

Vercel's Hobby (free) plan is limited to personal, non-commercial use ([terms](https://vercel.com/legal/terms)); a company website is commercial use. Vercel can pause Hobby projects that break this. Use a **Pro** team for this project, or move to a host whose free plan allows commercial use (Netlify, see the end of this file). This is the company's decision; it is recorded here so it is not forgotten.

## Environment variables (Project, Settings, Environment Variables)

| Key | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://syntaxflowllc.com` | Production |
| `INQUIRY_DELIVERY` | `emailjs` | Production, Preview |
| `EMAILJS_SERVICE_ID` | `service_53cnnxd` | Production, Preview |
| `EMAILJS_TEMPLATE_ID` | `template_6m1tuud` | Production, Preview |
| `EMAILJS_PUBLIC_KEY` | from EmailJS, Account, General | Production, Preview |
| `EMAILJS_PRIVATE_KEY` | from EmailJS, Account, Security (mark **Sensitive**) | Production, Preview |

Never set `E2E_TEST_MODE` or `EMAILJS_API_URL` on Vercel. Preview deployments are kept out of search engines automatically (`VERCEL_ENV=preview`).

Environment variable changes apply to the **next** deployment: redeploy after adding them (Deployments, latest, Redeploy).

## Git integration

Confirmed 2026-11-18: a push to `main` (commit `9c26505`) reached production automatically within minutes, so the project deploys from GitHub. GitHub shows no deployment records for it; that only affects the repository's "Environments" panel, not deploys.

## Custom domain (Project, Settings, Domains)

1. Add `syntaxflowllc.com`, then `www.syntaxflowllc.com`. Set the apex as primary and let Vercel redirect `www` (the app also redirects `www` itself, so either works).
2. Vercel shows the exact records to create. Apply them in GoDaddy following docs/DOMAIN_DNS.md: change **only** the apex A record(s) and the `www` CNAME. Keep every MX and TXT record.
3. Wait for Vercel to show the domain as valid and the certificate as issued.
4. Run the smoke test below on `https://syntaxflowllc.com` and complete the verification list in docs/DOMAIN_DNS.md.

## Smoke test (each production deploy)

- [ ] Home, Technology + Talent, Contact, Careers load without console errors
- [ ] Mobile menu opens and navigates
- [ ] One technology inquiry and one talent network sign-up arrive at hr@syntaxflowllc.com with matching references, and Reply-To is the visitor
- [ ] `curl -X POST -H "content-type: application/json" -H "origin: https://example.com" https://syntaxflowllc.com/api/inquiry -d "{}"` returns 403
- [ ] Response headers include `content-security-policy` and `strict-transport-security`

Rollback: Deployments, choose the last good deployment, **Promote to Production** (or Instant Rollback).

## Notes for Vercel

- Functions run as several instances, so the in-memory rate limit is approximate (ADR-005). Fine at launch volume; move to a shared store (for example Upstash Redis from the Vercel Marketplace) before paid campaigns.
- Vercel sets `x-forwarded-for` itself, so the rate limiter's client key is trustworthy there.

## Alternative: Netlify Free

Netlify's free plan allows commercial use and supports Next.js 16 ([forum answer](https://answers.netlify.com/t/can-we-use-netlify-free-plan-for-commercial-purposes/41545), [changelog](https://www.netlify.com/changelog/next-js-16-deploy-on-netlify/)). Import the GitHub repo, set `NODE_VERSION=24` and the same variables as above (use `SITE_INDEXABLE=false` on deploy previews), then follow the same domain steps.
