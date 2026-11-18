# Email delivery setup (EmailJS)

The website's forms post to `POST /api/inquiry`. After validation, the server sends one email per inquiry through the EmailJS REST API. No EmailJS key reaches the browser.

**Verify every step below against the current EmailJS documentation and your plan's limits before relying on it.** EmailJS settings, plan limits and API details change over time.

## 1. EmailJS account

1. Create or use the company EmailJS account (record the account owner; enable MFA).
2. **Email Services:** connect the mailbox that will send (ideally a Google Workspace or Microsoft 365 account on syntaxflowllc.com). Note the **Service ID**.
3. **Account, Security:** enable API access for non-browser applications (server-side calls), and enable the private key requirement. Note the **Public Key** and **Private Key**.
4. **Account, Security:** restrict allowed origins to the production domain if your plan offers it.

## 2. Template

Create a plain-text template (Template ID into `EMAILJS_TEMPLATE_ID`):

| Field | Value |
|---|---|
| To | hr@syntaxflowllc.com (or a role alias) |
| From name | Syntax Flow website |
| Reply-To | `{{reply_to}}` |
| Subject | `{{subject}}` |
| Body | `{{body}}` |

Parameters the server sends: `subject`, `inquiry_type`, `reference`, `from_name`, `reply_to`, `submitted_at`, `body` (all fields as labelled plain text).

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

Before launch, inspect existing DNS (MX, SPF, DKIM, DMARC) for syntaxflowllc.com. Merge, never duplicate, SPF. Enable DKIM for the sending mailbox provider. Publish or confirm DMARC. Follow the constitution's domain and email checklist.

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
