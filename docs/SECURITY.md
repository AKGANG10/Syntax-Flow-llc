# Security

Scope: this marketing website and its inquiry endpoint. The Trust page (`src/app/trust/page.tsx`) states only what is listed under "In place". Keep them in sync.

## In place

| Control | Where | Verified by |
|---|---|---|
| CSP: self-only sources, no framing, no plugins, `form-action 'self'` | `next.config.ts` | `e2e/pages.spec.ts` "sends security headers" |
| HSTS (1 year), nosniff, `X-Frame-Options: DENY`, strict referrer, COOP, Permissions-Policy, no `X-Powered-By` | `next.config.ts` | same test |
| Server-side schema validation (zod), discriminated by inquiry type | `src/lib/inquiry/schema.ts` | `e2e/api.spec.ts` |
| Origin check (same-origin browsers only) | `src/app/api/inquiry/route.ts` | api spec "rejects other origins" |
| JSON only, 16 KB body limit checked before parsing | route | api spec |
| Rate limit, 5 per 10 minutes per client | `src/lib/inquiry/guard.ts` | api spec "rate limits a single client" |
| Honeypot and minimum fill time, refused with a clear message (no fake success) | route | api spec |
| Duplicate suppression (10 minutes) | guard | api spec |
| https-only profile links (blocks `javascript:` URLs) | schema | api spec |
| `Cache-Control: no-store` on API responses | route and config | api spec |
| Secrets server-side only; `server-only` import guards | `src/lib/inquiry/*` | build fails if imported client-side |
| Redacted logging: reference and outcome only | `deliver.ts`, route | code review |
| JSON-LD escaped against `</script>` injection | `src/app/layout.tsx` | code review |
| No cookies, analytics or third-party scripts | whole site | CSP blocks third-party origins |
| Dependency audit of production packages in CI | `.github/workflows/ci.yml` | CI |
| Responsible disclosure contact | `public/.well-known/security.txt`, Trust page | pages spec |

## Known limitations

1. **Rate limits and dedupe are per instance** (ADR-005). Move to a shared store before high traffic.
2. **`clientKey` trusts `x-forwarded-for`.** Correct behind a platform proxy that overwrites it (Vercel, Netlify, most load balancers). If self-hosting, configure the proxy to set it, or the limit can be bypassed by spoofing the header.
3. **CSP allows `'unsafe-inline'` scripts** (ADR-002). Acceptable for a static site without user HTML or third-party scripts; revisit with any of those.
4. **No CAPTCHA.** Honeypot, timing and rate limits stop naive bots. Add Cloudflare Turnstile or hCaptcha if spam gets through (requires CSP and privacy notice updates).
5. **Dev toolchain advisories.** `npm audit` reports high-severity advisories in development-only packages (the ESLint 9 tree from the Next.js scaffold). Production dependencies report 0. Track the `eslint-config-next` upgrade.
6. **EmailJS template content.** The email body includes what visitors type. Keep the template plain text so submitted content is never rendered as HTML.

## Hardening steps before or after launch

- After the DNS inventory confirms every subdomain serves valid HTTPS: change HSTS to `max-age=63072000; includeSubDomains`, then consider `preload`.
- Restrict EmailJS to the production domain in its dashboard and enable its own rate limits.
- Set up uptime monitoring and error alerting for `/api/inquiry` (503 and 502 rates).
- Review `security.txt` `Expires` (2027-11-18) yearly; add a dedicated `security@` alias when available.

## Reporting

Report vulnerabilities to hr@syntaxflowllc.com (see `/.well-known/security.txt`).
