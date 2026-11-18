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

export const lifecycle = [
  { step: "Discover", text: "Define the business problem, the constraints and what success should look like." },
  { step: "Design", text: "Shape the solution, the architecture and a delivery plan you can hold us to." },
  { step: "Build", text: "Engineer the software, data, AI and integrations." },
  { step: "Secure", text: "Build security in from the architecture up." },
  { step: "Staff", text: "Bring in the specialists and teams to deliver and operate it." },
  { step: "Scale", text: "Grow the platform and the team as demand grows." },
] as const;

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
    cta: { label: "Transform With Us", href: "/contact?need=both" },
  },
] as const;
