# Domain and DNS: syntaxflowllc.com

Canonical host: **https://syntaxflowllc.com** (apex), confirmed by Syntax Flow on 2026-11-18. `www` redirects to it with a permanent 308 (in `next.config.ts`, tested in `e2e/email-delivery.spec.ts`).

## Snapshot (read-only lookup, 2026-11-18, via 8.8.8.8)

| Record | Value | Owner / purpose | At go-live |
|---|---|---|---|
| NS | ns39.domaincontrol.com, ns40.domaincontrol.com | GoDaddy DNS | **Keep** |
| A (apex) | 15.197.148.33, 3.33.130.190 | GoDaddy parked page (serves a redirect to `/lander`) | **Replace** with the host's apex records |
| CNAME www | syntaxflowllc.com | Points www at the parked apex | **Change** to the host's target |
| MX | aspmx.l.google.com (1), alt1/alt2 (5), alt3/alt4 (10) | Google Workspace mail for hr@syntaxflowllc.com | **Keep, do not touch** |
| TXT (apex) | `v=spf1 include:dc-bdaca08905._spfm.syntaxflowllc.com ~all` | GoDaddy-managed SPF, resolves to `include:_spf.google.com` | **Keep** |
| TXT (apex) | `google-site-verification=...` | Google Workspace / Search Console ownership | **Keep** |
| TXT google._domainkey | DKIM public key (RSA) | Google Workspace DKIM signing | **Keep** |
| TXT _dmarc | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;` | DMARC, reports to GoDaddy | **Keep** |
| CAA | none | Any CA may issue | Optional later (see below) |
| AAAA | none | | Add only if the host provides IPv6 apex records |

No live website is replaced: the apex currently serves only GoDaddy's parking redirect.

## Why email must not be disturbed

Mail for the company runs on Google Workspace. DMARC is at `p=quarantine`, so mail that fails SPF and DKIM alignment goes to spam. Website DNS changes touch **only** the apex A record(s) and the `www` CNAME. Never "reset" the zone, switch nameservers, or apply a host's "recommended" record set that replaces MX or TXT records.

The website's form emails pass DMARC only if EmailJS sends through the Google Workspace account (see docs/EMAIL_SETUP.md).

## Go-live change set (after the host shows its required values)

Take the exact values from the hosting provider's domain screen at that time; do not use values from memory.

1. In GoDaddy, turn off domain **Forwarding** and **Parking** for syntaxflowllc.com if they are enabled.
2. Apex: replace the two parked A records with the host's apex A record(s) (or ALIAS/ANAME if the host requires it and GoDaddy supports it).
3. `www`: change the CNAME target to the host's `www` target.
4. Leave every MX and TXT record exactly as in the snapshot above.
5. In the host, add both `syntaxflowllc.com` (primary) and `www.syntaxflowllc.com`, and let it issue the HTTPS certificate.

Rollback: restore the two A records (15.197.148.33, 3.33.130.190) and the `www` CNAME to `syntaxflowllc.com`.

## Verification after the change

- [ ] `https://syntaxflowllc.com` loads the new site with a valid certificate
- [ ] `http://` redirects to `https://`; `https://www.syntaxflowllc.com/any-path` redirects (308) to the apex with the same path
- [ ] MX, SPF, DKIM and DMARC records unchanged (repeat the lookups in this file)
- [ ] Send an email to hr@syntaxflowllc.com from an outside account and receive it
- [ ] Form submission arrives with SPF/DKIM/DMARC pass (docs/EMAIL_SETUP.md section 5)
- [ ] `/sitemap.xml` and `/robots.txt` show `https://syntaxflowllc.com` URLs

## Later

- CAA: once the host's certificate authority is known (for Netlify and most hosts, Let's Encrypt), add `0 issue "letsencrypt.org"` so only that CA can issue. Check the host's docs first; a wrong CAA blocks certificate renewal.
- HSTS `includeSubDomains`: only after every subdomain is confirmed to serve valid HTTPS (ADR-008).
- DNSSEC: available at GoDaddy; evaluate after go-live (record the decision here).
