# Deployment

The site needs a host that runs Next.js 16 with a Node.js server for `POST /api/inquiry`. Pages are static.

## Recommendation: Netlify (Free plan)

Checked 2026-11-18:

- Netlify's Free plan allows commercial use and Netlify supports Next.js 16 ([support forum answer](https://answers.netlify.com/t/can-we-use-netlify-free-plan-for-commercial-purposes/41545), [Next.js 16 changelog](https://www.netlify.com/changelog/next-js-16-deploy-on-netlify/)). Limits are credit-based; confirm them on Netlify's pricing page.
- Vercel's Hobby plan is restricted to personal, non-commercial use ([terms](https://vercel.com/legal/terms)), so a company site on Vercel needs a paid Pro plan. Choose Vercel Pro if you prefer the Next.js vendor's platform and accept the monthly cost.

Re-check both before signing up; plans change.

## Netlify steps

1. Create a Netlify account (use a company login, enable MFA).
2. **Add new site, Import an existing project, GitHub**, and select `AKGANG10/Syntax-Flow-llc`, branch `main`. Netlify detects Next.js: build command `npm run build`. Set Node.js to 24 (environment variable `NODE_VERSION=24`).
3. **Site configuration, Environment variables** (mark the private key as secret):

   | Key | Value | Scopes |
   |---|---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://syntaxflowllc.com` | Production |
   | `INQUIRY_DELIVERY` | `emailjs` | All |
   | `EMAILJS_SERVICE_ID` | from EmailJS | All |
   | `EMAILJS_TEMPLATE_ID` | `template_v26pcko` | All |
   | `EMAILJS_PUBLIC_KEY` | from EmailJS | All |
   | `EMAILJS_PRIVATE_KEY` | from EmailJS (secret) | All |
   | `SITE_INDEXABLE` | `false` | Deploy previews and branch deploys only |

   Never set `E2E_TEST_MODE` on Netlify.
4. Deploy. On the generated `*.netlify.app` URL, run the smoke test below **before** touching DNS.
5. **Domain management:** add `syntaxflowllc.com` as the primary domain and `www.syntaxflowllc.com` as an alias. Netlify shows the exact records; apply them in GoDaddy following docs/DOMAIN_DNS.md (change only the apex A and `www` CNAME).
6. Wait for HTTPS to be issued, then repeat the smoke test on the real domain and complete the DNS verification list.

## Smoke test (each deploy)

- [ ] Home, Technology + Talent, Contact, Careers load; no console errors
- [ ] Mobile menu opens and navigates
- [ ] One technology inquiry and one talent network sign-up arrive by email with matching references
- [ ] `/api/inquiry` with a wrong origin returns 403 (`curl -X POST -H "content-type: application/json" -H "origin: https://example.com" https://<host>/api/inquiry -d "{}"`)
- [ ] Response headers include `content-security-policy` and `strict-transport-security`
- [ ] Preview deploys serve `robots.txt` with `Disallow: /`

## Notes for this host

- Serverless functions run as several instances, so the in-memory rate limit is approximate (ADR-005). Acceptable at launch volume; move to a shared store before paid campaigns.
- Rollback: Netlify keeps previous deploys; use **Deploys, select a previous deploy, Publish deploy**.
