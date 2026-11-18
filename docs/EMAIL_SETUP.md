# Email delivery setup (EmailJS)

The website's forms post to `POST /api/inquiry`. After validation, the server sends one email per inquiry through the EmailJS REST API. No EmailJS key reaches the browser.

**Verify every step below against the current EmailJS documentation and your plan's limits before relying on it.** EmailJS settings, plan limits and API details change over time.

## 1. EmailJS account

1. Create or use the company EmailJS account (record the account owner; enable MFA).
2. **Email Services:** add a **Gmail** service and sign in with the company's **Google Workspace** account (for example hr@syntaxflowllc.com). **Service ID supplied by Syntax Flow: `service_53cnnxd`.** Confirm in the EmailJS dashboard that this service is the Gmail/Workspace one.
   This is required, not a preference: the domain's DMARC policy is `p=quarantine` and its SPF and DKIM authorize only Google (docs/DOMAIN_DNS.md). Mail sent through any other EmailJS service as @syntaxflowllc.com would fail alignment and go to spam.
3. **Account, Security:** enable API access for non-browser applications (server-side calls), and enable the private key requirement. Note the **Public Key** and **Private Key**.
4. **Account, Security:** restrict allowed origins to the production domain if your plan offers it.

## 2. Template

**Template ID supplied by Syntax Flow: `template_6m1tuud`** (recorded in `.env.example`; template IDs are not secret).

**Configured and verified 2026-11-18:** To Email `hr@syntaxflowllc.com`, Reply To `{{reply_to}}`, Subject `{{subject}}`, Content `{{body}}` (the stock auto-reply text was removed). Live test SF-YMAN9HYZ arrived in the hr@ inbox with all fields. Public and Private keys are set in Vercel Production; "API access from non-browser applications" is enabled under Account, Security (without it EmailJS returns 403). If sending fails, the reason is in `vercel logs --environment production` as `[inquiry] ... emailjs rejected: <status> <reason>`.

The server sends two sets of variable names, so the template works whether it uses the style below or EmailJS's stock "Contact Us" variables (`{{name}}`, `{{email}}`, `{{title}}`, `{{message}}`, `{{time}}`). Recommended template settings:

| Field | Value |
|---|---|
| To | hr@syntaxflowllc.com (or a role alias) |
| From name | Syntax Flow website |
| Reply-To | `{{reply_to}}` |
| Subject | `{{subject}}` |
| Body | `{{body}}` |

Parameters the server sends: `subject`, `inquiry_type`, `reference`, `from_name`, `reply_to`, `submitted_at`, `body` (all fields as labelled plain text), plus the stock aliases `title` (= subject), `name`, `email` (= reply_to), `message` (= body), `time`, `phone`, `company`.

Whatever the template contains, check that **Reply-To** is set to `{{reply_to}}` (or `{{email}}`), otherwise replies go to the company's own address instead of the visitor.

The request shape (service, template, keys, parameters) is covered by an automated test against a local EmailJS mock (`e2e/email-delivery.spec.ts`). That proves the code; only a real send proves the account and template.

Optional: a second template for talent network sign-ups in `EMAILJS_TEMPLATE_ID_CANDIDATE` (for example routed to a recruiting inbox).

Keep the template plain text so anything a visitor types is never rendered as HTML.

## 3. Environment (hosting provider, not the repository)

```
INQUIRY_DELIVERY=emailjs
EMAILJS_SERVICE_ID=...
EMAILJS_TEMPLATE_ID=...
EMAILJS_PUBLIC_KEY=...
EMAILJS_PRIVATE_KEY=...
NEXT_PUBLIC_SITE_URL=https://syntaxflowllc.com
```

If `INQUIRY_DELIVERY` is unset or credentials are missing in production, forms show "Online inquiries are temporarily unavailable" with the email address and phone number, and the server returns 503. Nothing is silently dropped.

## 4. Domain authentication

Inspected 2026-11-18 (docs/DOMAIN_DNS.md): Google Workspace MX, SPF resolving to `include:_spf.google.com`, Google DKIM (`google._domainkey`) and DMARC `p=quarantine` are all in place. No DNS change is needed for email, provided EmailJS sends through the Gmail/Workspace service (step 1.2). Do not add a second SPF record.

## 5. Verification (must pass before launch)

- [ ] Technology, talent, both and candidate submissions each arrive at the inbox
- [ ] Reply-To is the visitor's address (reply from the inbox reaches them)
- [ ] Reference in the email matches the reference shown on the site
- [ ] Message arrives in Gmail and in one other provider, not in spam
- [ ] SPF, DKIM and DMARC pass in the received headers
- [ ] Wrong credentials produce the 502 message on the site, not a success
- [ ] Removing `INQUIRY_DELIVERY` produces the 503 message
- [ ] Rapid repeat submissions are rate limited
- [ ] Mobile form submission works

Record the results (dates, providers tested, screenshots without personal data) in the release notes.
