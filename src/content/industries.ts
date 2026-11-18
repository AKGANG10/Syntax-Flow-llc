/**
 * Industry focus areas from the positioning brief.
 * Copy describes where technology and talent apply in each sector. It does not
 * claim prior engagements; add verified case studies per industry when approved.
 */

export type Industry = {
  id: string;
  name: string;
  summary: string;
  technology: string[];
  talent: string[];
};

export const industries: Industry[] = [
  {
    id: "healthcare",
    name: "Healthcare",
    summary: "Modernizing care and operations while protecting sensitive patient data.",
    technology: ["Patient and provider portals", "Clinical and operational data platforms", "Workflow automation", "Security for regulated data"],
    talent: ["Healthcare software engineers", "Data and integration specialists", "Security professionals"],
  },
  {
    id: "financial-services",
    name: "Financial Services",
    summary: "Secure, auditable systems for institutions where accuracy is non-negotiable.",
    technology: ["Core platform modernization", "Fraud and risk analytics", "Cloud migration with strong controls", "Identity and access management"],
    talent: ["Backend and platform engineers", "Data scientists", "Cloud security engineers"],
  },
  {
    id: "technology",
    name: "Technology",
    summary: "Extra engineering depth for product companies moving faster than hiring allows.",
    technology: ["SaaS product engineering", "Platform and API development", "AI features in existing products", "DevOps and reliability"],
    talent: ["Full stack and mobile engineers", "AI/ML engineers", "Dedicated product teams"],
  },
  {
    id: "retail",
    name: "Retail & E-commerce",
    summary: "Commerce platforms and data that keep pace with customer demand.",
    technology: ["E-commerce platforms", "Inventory and order integrations", "Personalization and analytics", "Performance at peak traffic"],
    talent: ["Frontend and commerce engineers", "Data engineers", "QA engineers"],
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    summary: "Connecting plant, supply chain and business systems.",
    technology: ["Operational data platforms", "Process and workflow automation", "Predictive maintenance analytics", "Legacy system modernization"],
    talent: ["Integration engineers", "Data specialists", "Enterprise technology specialists"],
  },
  {
    id: "education",
    name: "Education",
    summary: "Digital learning and administrative systems that are accessible to everyone.",
    technology: ["Learning and student platforms", "Accessible web applications", "Data and reporting", "Cloud infrastructure"],
    talent: ["Web and mobile engineers", "Business analysts", "Project managers"],
  },
  {
    id: "logistics",
    name: "Logistics",
    summary: "Real-time visibility across fleets, warehouses and partners.",
    technology: ["Tracking and visibility platforms", "Partner API integrations", "Route and demand analytics", "Operational automation"],
    talent: ["Backend and integration engineers", "Data engineers", "DevOps engineers"],
  },
  {
    id: "startups",
    name: "Startups",
    summary: "From first architecture to first engineering hires.",
    technology: ["MVP and product engineering", "Architecture that can scale", "Cloud setup and CI/CD", "AI prototypes"],
    talent: ["Founding engineers", "Contract-to-hire specialists", "Small dedicated teams"],
  },
];
