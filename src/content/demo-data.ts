/**
 * DEMO DATA for the interactive dashboard experiences.
 *
 * Every value here is fictional sample data created to demonstrate the kind
 * of platforms Syntax Flow designs and builds. None of it describes Syntax
 * Flow's business, clients, staff or systems. The UI labels every dashboard
 * "Interactive demo · Sample data". Do not reuse these numbers as facts.
 */

export type Status = "healthy" | "processing" | "warning" | "offline" | "error";

export const demoLabel = "Interactive demo · Sample data";

/** Deterministic series so server and client render the same starting frame. */
export function demoSeries(length: number, base: number, swing: number, seed: number) {
  let s = seed >>> 0;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  let v = base;
  return Array.from({ length }, () => {
    v = Math.max(base - swing, Math.min(base + swing, v + (rnd() - 0.5) * swing * 0.6));
    return Math.round(v * 10) / 10;
  });
}

export const overview = {
  systemHealth: 98.7,
  aiProcesses: 1284,
  activeTalent: 247,
  activeSystems: 128,
  activeSystemsDelta: 14.8,
  throughput: demoSeries(24, 62, 18, 7),
};

export const services: { name: string; status: Status; detail: string }[] = [
  { name: "Customer API", status: "healthy", detail: "42 ms p95" },
  { name: "Payments service", status: "healthy", detail: "61 ms p95" },
  { name: "Data pipeline", status: "processing", detail: "Batch 3 of 5" },
  { name: "Search index", status: "warning", detail: "Lag 4 min" },
  { name: "Legacy ERP bridge", status: "offline", detail: "Maintenance window" },
];

export const regions = [
  { id: "west", name: "US West", x: 18, y: 46, load: 61 },
  { id: "central", name: "US Central", x: 48, y: 52, load: 74 },
  { id: "east", name: "US East", x: 80, y: 40, load: 68 },
  { id: "edge", name: "Edge", x: 50, y: 18, load: 32 },
];

export const uptime = Array.from({ length: 30 }, (_, i) => (i === 11 ? "warning" : i === 23 ? "error" : "healthy") as Status);
export const latency = demoSeries(30, 48, 16, 11);

export const talent = {
  available: 412,
  activeConsultants: 247,
  placementsQuarter: 38,
  avgDaysToFill: 19,
  skills: [
    { label: "Full stack", value: 22 },
    { label: "Cloud", value: 24 },
    { label: "Data", value: 18 },
    { label: "AI/ML", value: 14 },
    { label: "QA", value: 12 },
    { label: "Security", value: 10 },
  ],
  pipeline: [
    { label: "Sourced", value: 120 },
    { label: "Screened", value: 64 },
    { label: "Interviewing", value: 28 },
    { label: "Offered", value: 9 },
    { label: "Placed", value: 6 },
  ],
  locations: [
    { label: "Texas", value: 34 },
    { label: "California", value: 22 },
    { label: "New York", value: 15 },
    { label: "Illinois", value: 9 },
    { label: "Remote, US", value: 20 },
  ],
  experience: [
    { label: "0-3 yrs", value: 18 },
    { label: "3-6 yrs", value: 34 },
    { label: "6-10 yrs", value: 31 },
    { label: "10+ yrs", value: 17 },
  ],
  matrixRoles: ["Backend", "Frontend", "Data", "Cloud", "AI/ML"],
  matrixSkills: ["Python", "TypeScript", "SQL", "AWS", "Kubernetes", "ML"],
  matrix: [
    [0.8, 0.4, 0.6, 0.5, 0.4, 0.2],
    [0.3, 0.9, 0.3, 0.3, 0.2, 0.1],
    [0.8, 0.2, 0.9, 0.5, 0.3, 0.5],
    [0.5, 0.3, 0.3, 0.9, 0.8, 0.2],
    [0.9, 0.3, 0.6, 0.5, 0.4, 0.9],
  ],
  matches: [
    { role: "Senior data engineer", score: 94 },
    { role: "Cloud architect", score: 89 },
    { role: "AI/ML engineer", score: 86 },
  ],
};

export const ai = {
  workflows: 36,
  tasksToday: 1284,
  tasks: demoSeries(24, 54, 20, 21),
  models: [
    { name: "Document classifier", status: "healthy" as Status, detail: "Accuracy 96% (eval set)" },
    { name: "Support summarizer", status: "processing" as Status, detail: "Re-indexing" },
    { name: "Talent matching", status: "healthy" as Status, detail: "Human review on" },
  ],
  timeline: ["Agent triaged 14 tickets", "Workflow drafted 3 reports", "Model evaluation passed", "Human approved 12 actions"],
  recommendation: "Add a second worker to the ingestion pipeline before the Monday peak.",
};

export const pipelines: { name: string; status: Status; rows: string; fresh: string }[] = [
  { name: "Orders to warehouse", status: "healthy", rows: "1.2M", fresh: "2 min" },
  { name: "CRM sync", status: "processing", rows: "84K", fresh: "Running" },
  { name: "Clickstream", status: "healthy", rows: "9.6M", fresh: "1 min" },
  { name: "Finance ledger", status: "warning", rows: "310K", fresh: "47 min" },
  { name: "Legacy import", status: "error", rows: "0", fresh: "Paused, retrying" },
];
export const dataVolume = [
  { label: "Mon", value: 62 },
  { label: "Tue", value: 71 },
  { label: "Wed", value: 68 },
  { label: "Thu", value: 84 },
  { label: "Fri", value: 77 },
  { label: "Sat", value: 41 },
  { label: "Sun", value: 38 },
];

export const transformation = {
  score: 72,
  phases: [
    { label: "Discovery", value: 100 },
    { label: "Design", value: 82 },
    { label: "Build", value: 61 },
    { label: "Deploy", value: 38 },
    { label: "Optimize", value: 15 },
  ],
  milestones: [
    { label: "Architecture approved", done: true },
    { label: "Cloud landing zone live", done: true },
    { label: "First services migrated", done: true },
    { label: "Data platform cut-over", done: false },
    { label: "Legacy retired", done: false },
  ],
  health: [
    { label: "Scope", status: "healthy" as Status },
    { label: "Budget", status: "healthy" as Status },
    { label: "Schedule", status: "warning" as Status },
    { label: "Team", status: "healthy" as Status },
  ],
};

export const activityPool = [
  "System optimized",
  "AI workflow deployed",
  "New talent matched",
  "Cloud service connected",
  "Data pipeline optimized",
  "Security scan completed",
  "Consultant onboarded",
  "API latency improved",
];
