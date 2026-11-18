/**
 * Capability catalogue, taken from the Syntax Flow positioning brief.
 * Descriptions state what the service is. They make no claims about past
 * clients, volumes or results.
 */

export type Capability = {
  id: string;
  title: string;
  summary: string;
  items: string[];
};

export const technologyCapabilities: Capability[] = [
  {
    id: "ai",
    title: "AI & Intelligent Systems",
    summary: "Practical AI that sits inside real workflows, with the guardrails to trust it.",
    items: [
      "Generative AI",
      "AI agents",
      "Machine learning",
      "Natural language processing",
      "Computer vision",
      "AI automation",
      "Predictive analytics",
      "Intelligent workflow systems",
    ],
  },
  {
    id: "software",
    title: "Software Engineering",
    summary: "Products and platforms engineered to be maintained, extended and scaled.",
    items: [
      "Custom software development",
      "Enterprise applications",
      "SaaS development",
      "Web and mobile applications",
      "API development",
      "Platform engineering",
      "Legacy modernization",
      "Product engineering",
    ],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    summary: "Infrastructure that ships reliably and costs what it should.",
    items: [
      "Cloud strategy and migration",
      "AWS, Microsoft Azure and Google Cloud",
      "DevOps and CI/CD",
      "Infrastructure automation",
      "Kubernetes and containerization",
      "Cloud cost optimization",
    ],
  },
  {
    id: "data",
    title: "Data & Analytics",
    summary: "Data platforms that turn scattered records into decisions.",
    items: [
      "Data engineering",
      "Data platforms and warehousing",
      "Data integration",
      "Business intelligence",
      "Analytics and visualization",
    ],
  },
  {
    id: "security",
    title: "Cybersecurity",
    summary: "Security designed into the architecture, not added at the end.",
    items: [
      "Security architecture",
      "Application and cloud security",
      "Identity and access management",
      "Vulnerability management",
      "Security monitoring",
      "Compliance support",
      "Secure software development",
    ],
  },
  {
    id: "automation",
    title: "Automation",
    summary: "Less manual work between the systems and teams you already have.",
    items: [
      "Business process automation",
      "Workflow automation",
      "Robotic process automation (RPA)",
      "API integrations",
      "AI-powered automation",
      "Operational automation",
    ],
  },
];

export const talentCapabilities: Capability[] = [
  {
    id: "acquisition",
    title: "Talent Acquisition",
    summary: "Technical and leadership hiring for roles that are hard to fill well.",
    items: [
      "Technical recruiting",
      "Executive technology recruiting",
      "Contract recruiting",
      "Direct hire and permanent placement",
      "Contract-to-hire",
    ],
  },
  {
    id: "staffing",
    title: "IT Staffing",
    summary: "Specialists who can contribute from the first sprint.",
    items: [
      "Software, full stack, backend, frontend and mobile engineers",
      "Data engineers and data scientists",
      "DevOps and cloud engineers",
      "AI/ML engineers",
      "Cybersecurity professionals",
      "QA engineers",
      "Business analysts, project and product managers",
      "Enterprise technology specialists",
    ],
  },
  {
    id: "teams",
    title: "Dedicated Teams",
    summary: "Complete teams, not just individual candidates.",
    items: ["Engineering teams", "AI teams", "Cloud and DevOps teams", "Data teams", "QA teams", "Product teams"],
  },
  {
    id: "workforce",
    title: "Workforce Solutions",
    summary: "Planning and scaling the technical workforce behind your roadmap.",
    items: [
      "Technical workforce planning",
      "Resource augmentation",
      "Team scaling",
      "Workforce optimization",
      "Technical talent pipelines",
      "Global sourcing where legally and operationally appropriate",
    ],
  },
];

/** Visual identifier for a solution's mini-visualization (src/components/mini-viz.tsx). */
export type VizKind = "ai" | "cloud" | "software" | "data" | "transformation" | "security" | "talent" | "managed";

export type Solution = {
  id: string;
  title: string;
  summary: string;
  details: string[];
  viz: VizKind;
  href: string;
  pillar: "technology" | "talent" | "both";
};

/** The eight solutions from the redesign brief, one card each. */
export const solutions: Solution[] = [
  {
    id: "ai",
    title: "AI & Intelligent Automation",
    summary: "Generative AI, agents and machine learning built into the workflows people already use.",
    details: ["Generative AI and AI agents", "Machine learning and predictive analytics", "Intelligent workflow automation", "Guardrails, evaluation and human review"],
    viz: "ai",
    href: "/solutions/technology#ai",
    pillar: "technology",
  },
  {
    id: "cloud",
    title: "Cloud & Infrastructure",
    summary: "Cloud platforms that deploy reliably, scale on demand and cost what they should.",
    details: ["Cloud strategy and migration", "AWS, Microsoft Azure and Google Cloud", "Kubernetes and containers", "Infrastructure as code and CI/CD"],
    viz: "cloud",
    href: "/solutions/technology#cloud",
    pillar: "technology",
  },
  {
    id: "software",
    title: "Software Engineering",
    summary: "Products, platforms and APIs engineered to be maintained and extended for years.",
    details: ["Custom and enterprise applications", "SaaS and product engineering", "Web, mobile and API development", "Legacy modernization"],
    viz: "software",
    href: "/solutions/technology#software",
    pillar: "technology",
  },
  {
    id: "data",
    title: "Data & Analytics",
    summary: "Data platforms that turn scattered records into decisions people trust.",
    details: ["Data engineering and integration", "Warehouses and data platforms", "Business intelligence", "Analytics and visualization"],
    viz: "data",
    href: "/solutions/technology#data",
    pillar: "technology",
  },
  {
    id: "transformation",
    title: "Digital Transformation",
    summary: "Modernize the systems and the ways of working behind them, together.",
    details: ["Modernization roadmaps", "Platform and process redesign", "Change and adoption support", "Technology and team planning in one plan"],
    viz: "transformation",
    href: "/solutions/transformation",
    pillar: "both",
  },
  {
    id: "security",
    title: "Cybersecurity",
    summary: "Security designed into the architecture from the first diagram, not added at the end.",
    details: ["Security architecture", "Application and cloud security", "Identity and access management", "Vulnerability management and monitoring"],
    viz: "security",
    href: "/solutions/technology#security",
    pillar: "technology",
  },
  {
    id: "talent",
    title: "Talent Solutions",
    summary: "Technical recruiting, IT staffing and complete teams for roles that are hard to fill well.",
    details: ["Technical and executive recruiting", "Contract, contract-to-hire and direct hire", "Dedicated engineering teams", "Workforce planning"],
    viz: "talent",
    href: "/solutions/talent",
    pillar: "talent",
  },
  {
    id: "managed",
    title: "Managed Technology Services",
    summary: "Ongoing operation, support and improvement of the systems you depend on.",
    details: ["Monitoring and incident response", "Maintenance and upgrades", "Performance and cost reviews", "Specialists on call when you need them"],
    viz: "managed",
    href: "/contact?need=technology",
    pillar: "both",
  },
];

/** The signature "Flow" journey. Each step names which side of the company leads. */
export const flowSteps = [
  {
    id: "discover",
    title: "Discover",
    lead: "Start with the outcome.",
    text: "We define the business problem, the people affected, the constraints and what success has to look like before anything is designed.",
    points: ["Business goals and constraints", "Current systems and team audit"],
    pillar: "both",
  },
  {
    id: "design",
    title: "Design",
    lead: "Shape the solution and the team.",
    text: "Architecture, delivery plan and the skills it will take are designed together, so the plan you approve is one you can staff.",
    points: ["Solution architecture", "Team and skills plan"],
    pillar: "technology",
  },
  {
    id: "build",
    title: "Build",
    lead: "Engineer it in the open.",
    text: "Software, data, AI and integrations delivered in small, reviewed, tested increments you can see working.",
    points: ["Product and platform engineering", "Security built in"],
    pillar: "technology",
  },
  {
    id: "connect",
    title: "Connect",
    lead: "Bring in the right people.",
    text: "Specialists, contractors and permanent hires recruited for the system you are building, by people who understand the work.",
    points: ["Technical recruiting", "Dedicated teams"],
    pillar: "talent",
  },
  {
    id: "scale",
    title: "Scale",
    lead: "Grow capacity on both sides.",
    text: "The platform scales with demand and the team scales with the roadmap, without starting over with a new vendor.",
    points: ["Cloud and reliability", "Team extension"],
    pillar: "both",
  },
  {
    id: "transform",
    title: "Transform",
    lead: "Outcomes that last.",
    text: "Modern systems, a capable team and the knowledge to keep improving: the business moves differently, not just faster.",
    points: ["Operations and continuous improvement", "Knowledge that stays with you"],
    pillar: "both",
  },
] as const;

export type FlowStep = (typeof flowSteps)[number];

export const engagementModels = [
  {
    id: "build",
    name: "Build",
    headline: "We build technology solutions.",
    examples: ["AI systems", "SaaS products", "Enterprise software", "Cloud platforms", "Data platforms", "Automation"],
    cta: { label: "Build With Us", href: "/contact?need=technology" },
  },
  {
    id: "scale",
    name: "Scale",
    headline: "We provide technical talent and teams.",
    examples: ["Individual specialists", "Contract talent", "Direct hire", "Dedicated teams", "Engineering teams", "Workforce solutions"],
    cta: { label: "Find Talent", href: "/contact?need=talent" },
  },
  {
    id: "transform",
    name: "Transform",
    headline: "We combine technology and talent.",
    examples: ["Architecture", "Engineering", "Cloud", "Cybersecurity", "Project leadership", "Technical specialists"],
    cta: { label: "Transform With Us", href: "/contact?need=transformation" },
  },
] as const;
