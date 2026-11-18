# Content inventory

What the company supplied, what is still missing, and which statements need confirmation before launch. Placeholders render through `<ContentPending>` (search the code for `ContentPending` or `data-content-pending`).

## Supplied and used

| Fact | Where it appears |
|---|---|
| Legal name: Syntax Flow LLC | Footer, Company, legal pages, structured data |
| Address: 325 N. St. Paul Street, Suite 3100, Dallas, TX 75201, USA | Footer, Contact, Company, Home trust strip, structured data |
| Phone: +1 (409) 225-7834 | Footer, Contact, Company, error fallbacks |
| Email: hr@syntaxflowllc.com | Footer, Contact, forms, Trust, legal pages, security.txt |
| E-Verify participation | Footer, Home, Company, Careers (the E-Verify company ID is not published) |
| Logo | Header, footer, Company, Open Graph image, favicon motif |
| Positioning, services, industries, navigation, CTAs | All pages, from the positioning brief |

## Deliberately not published

- **EIN.** Not needed on a public website and increases the risk of business identity fraud. Share it on W-9s and contracts only.
- **E-Verify company ID number.** Participation is stated; the ID is not needed publicly.

## Missing (placeholders on the site)

| Item | Page | Notes |
|---|---|---|
| Technology case study | Work | Approved project, verified results |
| Talent success story | Work | Real time-to-fill, quality, retention |
| Technology + Talent engagement story | Work | Approved, verified |
| Leadership profiles (3 slots) | Company | Name, role, licensed photo, verified bio |
| Culture and team story | Company | Real working culture |
| Data handling and retention policy | Trust, Privacy | Retention periods, internal access, deletion process |
| Certifications and compliance | Trust | Only those actually held |
| Technology partnerships | Trust | Only active, displayable programs |
| E-Verify and Right to Work posters | Careers | Download the official English and Spanish posters from the company's E-Verify account (View Essential Resources) and host them on the site. E-Verify does not permit linking official posters from external websites ([FAQ](https://www.e-verify.gov/faq/can-e-verify-posters-be-downloaded-or-linked-electronically-to-external-web-sites)) |
| Privacy notice and Terms legal review | Privacy, Terms | Both are drafts with a visible banner |

## Statements to confirm

These are written as company commitments. Confirm each is true or edit it:

1. Careers: "Syntax Flow never asks candidates to pay a fee, buy equipment or share banking details to apply."
2. Careers: "Our recruiters use @syntaxflowllc.com email addresses."
3. Careers: "We introduce you only to roles that fit, and only with your agreement."
4. Talent: "We stay in touch after the start date to make sure the placement is working."
5. Company: the four "How we work" principles.
6. Home: "We publish client results only with permission and with real, checked numbers."
7. Company: the brand story line, "Many strands of technology and people, converging where the work happens and moving forward together."
8. ~~Canonical domain~~ Confirmed 2026-11-18: `https://syntaxflowllc.com` (apex); `www` redirects to it.
9. Contact email: hr@syntaxflowllc.com is used for all inquiries. Consider role aliases (`hello@`, `sales@`, `talent@`, `security@`).

## Supplied in the 2026-11 redesign brief

Used as given: the company principles (Build with purpose, Move with intelligence, Design for scale, People first, Engineer for tomorrow), the eight solutions including **Managed Technology Services**, the Flow steps (Discover, Design, Build, Connect, Scale, Transform) and the industry list (Financial Services, Healthcare, Technology, Retail, Manufacturing, Professional Services, Government, Startups). Education and Logistics, from the original brief, are now mentioned only as "other sectors".

Still missing: **social media profile URLs** (the footer omits social links until real profiles are supplied), the **company timeline** (placeholder on Company), and the **ten photos** (verified, awaiting download: docs/ASSET_LICENSES.md).

## Illustrative content

The "AI platform" example (Home) and "Modernizing an existing platform" example (Technology + Talent) are labelled on the page as illustrative examples, not client case studies.

## Demo data (dashboards)

- Every number on the home dashboard, `/platform` and the solution-page dashboards is fictional sample data from `src/content/demo-data.ts`, labelled "Interactive demo · Sample data" on screen. See ADR-014.
- Do not replace it with real figures unless Syntax Flow confirms them and has permission to publish them.

## Positioning

- Confirmed by the owner (2026-11-18): Syntax Flow is an IT services and IT consulting company and a US IT recruitment firm. Home, Solutions, metadata and structured data say so plainly.
