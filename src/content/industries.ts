/**
 * Industry focus areas (redesign brief, 2026-11-18).
 * Copy describes where technology and talent apply in each sector. It does not
 * claim prior engagements; add verified case studies per industry when approved.
 */

export type IndustryArt =
  | "finance"
  | "healthcare"
  | "technology"
  | "retail"
  | "manufacturing"
  | "professional"
  | "government"
  | "startups";

export type Industry = {
  id: string;
  name: string;
  summary: string;
  technology: string[];
  talent: string[];
  art: IndustryArt;
};

export const industries: Industry[] = [
  {
    id: "financial-services",
    name: "Financial Services",
    summary: "Secure, auditable systems for institutions where accuracy is non-negotiable.",
    technology: ["Core platform modernization", "Fraud and risk analytics", "Cloud migration with strong controls"],
    talent: ["Platform engineers", "Data scientists", "Cloud security engineers"],
    art: "finance",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    summary: "Modernizing care and operations while protecting sensitive patient data.",
    technology: ["Patient and provider portals", "Clinical data platforms", "Security for regulated data"],
    talent: ["Healthcare software engineers", "Integration specialists", "Security professionals"],
    art: "healthcare",
  },
  {
    id: "technology",
    name: "Technology",
    summary: "Extra engineering depth for product companies moving faster than hiring allows.",
    technology: ["SaaS product engineering", "AI features in existing products", "DevOps and reliability"],
    talent: ["Full stack engineers", "AI/ML engineers", "Dedicated product teams"],
    art: "technology",
  },
  {
    id: "retail",
    name: "Retail",
    summary: "Commerce platforms and data that keep pace with customer demand.",
    technology: ["E-commerce platforms", "Inventory and order integrations", "Personalization and analytics"],
    talent: ["Commerce engineers", "Data engineers", "QA engineers"],
    art: "retail",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    summary: "Connecting plant, supply chain and business systems.",
    technology: ["Operational data platforms", "Process automation", "Predictive maintenance analytics"],
    talent: ["Integration engineers", "Data specialists", "Enterprise technology specialists"],
    art: "manufacturing",
  },
  {
    id: "professional-services",
    name: "Professional Services",
    summary: "Client platforms, knowledge systems and automation for firms that sell expertise.",
    technology: ["Client portals", "Document and workflow automation", "Knowledge and search systems"],
    talent: ["Business analysts", "Automation engineers", "Project managers"],
    art: "professional",
  },
  {
    id: "government",
    name: "Government",
    summary: "Accessible, secure digital services for the public and the people who run them.",
    technology: ["Accessible public services", "Legacy system modernization", "Secure cloud infrastructure"],
    talent: ["Accessibility-minded engineers", "Security professionals", "Program managers"],
    art: "government",
  },
  {
    id: "startups",
    name: "Startups",
    summary: "From first architecture to first engineering hires.",
    technology: ["MVP and product engineering", "Architecture that can scale", "AI prototypes"],
    talent: ["Founding engineers", "Contract-to-hire specialists", "Small dedicated teams"],
    art: "startups",
  },
];
