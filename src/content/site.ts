/**
 * Single source of truth for company facts and navigation.
 *
 * Facts here were supplied by Syntax Flow. Anything not supplied is either
 * omitted or rendered through <ContentPending>, never invented.
 * See docs/CONTENT_INVENTORY.md for the full list of open content items.
 */

export const company = {
  legalName: "Syntax Flow LLC",
  shortName: "Syntax Flow",
  tagline: "Technology × Talent",
  description:
    "Syntax Flow is a technology and talent solutions company. We help organizations build, modernize and scale through intelligent technology and exceptional technical talent.",
  email: "hr@syntaxflowllc.com",
  phone: { display: "+1 (409) 225-7834", href: "tel:+14092257834", e164: "+14092257834" },
  address: {
    street: "325 N. St. Paul Street, Suite 3100",
    locality: "Dallas",
    region: "TX",
    regionName: "Texas",
    postalCode: "75201",
    country: "US",
    countryName: "United States of America",
  },
  /** Supplied E-Verify enrollment. The company ID itself is deliberately not published. */
  eVerifyParticipant: true,
} as const;

/**
 * Canonical origin. ASSUMPTION: derived from the supplied email domain; confirm
 * apex vs www before launch and set NEXT_PUBLIC_SITE_URL in each environment.
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://syntaxflowllc.com").replace(/\/$/, "");

export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; href?: string; children?: NavLink[] };

export const mainNav: NavGroup[] = [
  {
    label: "Solutions",
    children: [
      { label: "All solutions", href: "/solutions", description: "Eight capabilities across technology and talent." },
      { label: "Technology", href: "/solutions/technology", description: "AI, software, cloud, data, security and automation." },
      { label: "Talent", href: "/solutions/talent", description: "Technical recruiting, IT staffing and dedicated teams." },
      { label: "Transformation", href: "/solutions/transformation", description: "Technology and talent combined in one plan." },
    ],
  },
  { label: "Industries", href: "/industries" },
  { label: "Work", href: "/work" },
  { label: "Company", href: "/company" },
  { label: "Careers", href: "/careers" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Solutions",
    links: [
      { label: "All solutions", href: "/solutions" },
      { label: "Technology", href: "/solutions/technology" },
      { label: "Talent", href: "/solutions/talent" },
      { label: "Transformation", href: "/solutions/transformation" },
      { label: "Industries", href: "/industries" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Work", href: "/work" },
      { label: "Careers", href: "/careers" },
      { label: "Trust & Security", href: "/trust" },
    ],
  },
  {
    heading: "Get started",
    links: [
      { label: "Start a project", href: "/contact?need=technology" },
      { label: "Find talent", href: "/contact?need=talent" },
      { label: "Transform with us", href: "/contact?need=transformation" },
      { label: "Join our network", href: "/careers#join" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Trust & Security", href: "/trust" },
];

export const formattedAddress = `${company.address.street}, ${company.address.locality}, ${company.address.region} ${company.address.postalCode}`;
