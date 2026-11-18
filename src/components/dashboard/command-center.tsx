"use client";

import { startTransition, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import {
  activityPool,
  ai,
  dataVolume,
  demoLabel,
  latency,
  overview,
  pipelines,
  regions,
  services,
  talent,
  transformation,
  uptime,
  type Status,
} from "@/content/demo-data";
import { MiniViz } from "../mini-viz";
import { cx } from "../ui";
import { ActivityFeed, BarChart, Counter, Donut, LineChart, NetworkGraph, Panel, ProgressList, Shimmer, SkillMatrix, Sparkline, StatusBadge } from "./charts";

/*
 * Syntax Flow Command Center: an INTERACTIVE DEMO with SAMPLE DATA.
 * It demonstrates the kind of platforms Syntax Flow builds; it is not a
 * deployed product and none of its numbers describe the business.
 *
 * Layout responds to its own width (container queries), so the same
 * component works in the 3D showcase, embedded on solution pages, and as
 * stacked cards on phones.
 */

export const tabs = [
  { id: "overview", label: "Overview" },
  { id: "technology", label: "Technology" },
  { id: "talent", label: "Talent" },
  { id: "ai", label: "AI" },
  { id: "data", label: "Data" },
  { id: "transformation", label: "Transformation" },
] as const;
export type TabId = (typeof tabs)[number]["id"];

const flowNodes = [
  { id: "tech", label: "Technology", x: 10, y: 22, kind: "tech" as const },
  { id: "data", label: "Data", x: 30, y: 10, kind: "tech" as const },
  { id: "ai", label: "AI", x: 30, y: 36, kind: "tech" as const },
  { id: "core", label: "Syntax Flow", x: 52, y: 23, kind: "core" as const },
  { id: "talent", label: "Talent", x: 72, y: 10, kind: "talent" as const },
  { id: "ops", label: "Operations", x: 72, y: 36, kind: "talent" as const },
  { id: "x", label: "Transformation", x: 91, y: 22, kind: "core" as const },
];
const flowLinks: [string, string][] = [
  ["tech", "data"],
  ["tech", "ai"],
  ["data", "core"],
  ["ai", "core"],
  ["core", "talent"],
  ["core", "ops"],
  ["talent", "x"],
  ["ops", "x"],
];

/** Simulated live data. Pauses off-screen, in background tabs and under reduced motion. */
function useDemoLive(live: boolean, root: RefObject<HTMLElement | null>) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const el = root.current;
    if (!live || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let timer = 0;
    const loop = () => {
      // A transition: simulated updates never block a click or key press.
      if (visible && !document.hidden) startTransition(() => setTick((t) => t + 1));
    };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    timer = window.setInterval(loop, 2800);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [live, root]);

  return useMemo(() => {
    const wobble = (k: number) => Math.sin(tick * 1.7 + k) * 0.5 + 0.5;
    const feed = Array.from({ length: 5 }, (_, i) => {
      const idx = (tick + 4 - i + activityPool.length * 10) % activityPool.length;
      return { id: tick - i, text: activityPool[idx], time: i === 0 ? "now" : `${i * 3}m ago` };
    });
    const series = [...overview.throughput.slice(tick % 6), ...overview.throughput.slice(0, tick % 6)];
    return {
      tick,
      health: Math.round((98.4 + wobble(1) * 0.5) * 10) / 10,
      processes: overview.aiProcesses + tick * 3,
      activeTalent: overview.activeTalent + (tick % 3),
      systems: overview.activeSystems + (tick % 2),
      feed,
      series,
    };
  }, [tick]);
}

type Live = ReturnType<typeof useDemoLive>;

function Metric({ label, value, decimals, suffix, delta, children }: { label: string; value: number; decimals?: number; suffix?: string; delta?: string; children?: ReactNode }) {
  return (
    <Panel title={label} className="@3xl:col-span-3">
      <p className="text-[2rem] leading-none font-extrabold tracking-[-0.04em] text-white">
        <Counter value={value} decimals={decimals} suffix={suffix} />
      </p>
      <div className="mt-2 flex items-center justify-between gap-2">
        {delta && <span className="text-xs font-semibold text-[#3ddc97]">{delta}</span>}
        {children}
      </div>
    </Panel>
  );
}

function Overview({ live }: { live: Live }) {
  const [greeting, setGreeting] = useState("Welcome back.");
  useEffect(() => {
    const h = new Date().getHours();
    const id = requestAnimationFrame(() => setGreeting(h < 12 ? "Good morning." : h < 18 ? "Good afternoon." : "Good evening."));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3 @3xl:col-span-12">
        <div>
          <p className="text-2xl font-extrabold tracking-[-0.03em] text-white">{greeting}</p>
          <p className="text-sm text-ink-300">Your transformation ecosystem is moving.</p>
        </div>
        <StatusBadge status="healthy" label="All core systems operational" />
      </div>
      <Metric label="System health" value={live.health} decimals={1} suffix="%">
        <StatusBadge status="healthy" />
      </Metric>
      <Metric label="AI activity" value={live.processes}>
        <span className="text-xs text-ink-400">processes today</span>
      </Metric>
      <Metric label="Talent" value={live.activeTalent}>
        <span className="text-xs text-ink-400">active consultants</span>
      </Metric>
      <Metric label="Active systems" value={live.systems} delta={`+${overview.activeSystemsDelta}%`}>
        <Sparkline data={live.series} className="w-20" />
      </Metric>
      <Panel title="Technology flow network" zoom="flow" className="@3xl:col-span-7">
        <NetworkGraph nodes={flowNodes} links={flowLinks} label="Technology, data and AI flow through Syntax Flow to talent, operations and transformation" height={150} />
      </Panel>
      <Panel title="Talent intelligence" zoom="talent" className="@3xl:col-span-5" meta={<span className="text-[0.62rem] text-ink-400">This quarter</span>}>
        <div data-zoom="skills">
          <p className="mb-2 text-xs text-ink-400">Skill distribution, % of active consultants</p>
          <BarChart data={talent.skills} unit="%" label="Skill distribution, percent of active consultants (demo)" height={96} />
        </div>
      </Panel>
      <Panel title="Transformation progress" className="@3xl:col-span-4">
        <ProgressList items={transformation.phases} label="Transformation progress by phase (demo)" />
      </Panel>
      <Panel title="AI matching" zoom="matching" className="@3xl:col-span-4" meta={<StatusBadge status="processing" label="Matching" />}>
        <ul className="space-y-2.5" aria-label="Top role matches (demo)">
          {talent.matches.map((m) => (
            <li key={m.role} className="flex items-center gap-3">
              <span className="flex-1 truncate text-xs text-ink-100">{m.role}</span>
              <span className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.08]">
                <span className="block h-full rounded-full bg-signal-400" style={{ width: `${m.score}%` }} />
              </span>
              <span className="w-9 text-right text-xs font-semibold text-white tabular-nums">{m.score}%</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[0.65rem] text-ink-500">Shortlists go to a recruiter for human review.</p>
      </Panel>
      <Panel title="Recent activity" className="@3xl:col-span-4">
        <ActivityFeed items={live.feed} />
      </Panel>
    </>
  );
}

function Technology({ live }: { live: Live }) {
  return (
    <>
      <Panel title="Services" className="@3xl:col-span-5" meta={<StatusBadge status="warning" label="1 needs attention" />}>
        <ul className="divide-y divide-white/[0.06]" aria-label="Service status (demo)">
          {services.map((s) => (
            <li key={s.name} className={cx("flex items-center justify-between gap-3 py-2 text-xs", s.status === "offline" && "opacity-60")}>
              <span className="text-ink-100">{s.name}</span>
              <span className="flex items-center gap-3">
                <span className="text-ink-400">{s.detail}</span>
                <StatusBadge status={s.status} className="w-24" />
              </span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Cloud infrastructure" className="@3xl:col-span-7">
        <NetworkGraph
          label="Cloud regions connected through the edge (demo)"
          nodes={regions.map((r) => ({ id: r.id, label: `${r.name} · ${r.load}%`, x: r.x, y: r.y * 0.5, kind: r.id === "edge" ? ("core" as const) : ("tech" as const) }))}
          links={[
            ["edge", "west"],
            ["edge", "central"],
            ["edge", "east"],
            ["west", "central"],
            ["central", "east"],
          ]}
          height={150}
        />
      </Panel>
      <Panel title="Uptime, last 30 days" className="@3xl:col-span-7" meta={<span className="text-xs font-semibold text-white">99.93%</span>}>
        <ol className="flex h-10 items-end gap-1" aria-label="Daily uptime: 28 healthy days, 1 degraded, 1 incident (demo)">
          {uptime.map((u, i) => (
            <li key={i} title={`Day ${i + 1}: ${u}`} className={cx("h-full flex-1 rounded-sm", u === "healthy" ? "bg-[#3ddc97]/70" : u === "warning" ? "bg-[#f0b94a]" : "bg-[#ff7a7a]")}>
              <span className="sr-only">
                Day {i + 1}: {u}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-[0.65rem] text-ink-500">Each bar is one day. Amber: degraded. Red: incident.</p>
      </Panel>
      <Panel title="API latency" className="@3xl:col-span-5">
        <LineChart data={latency} label="API latency, last 30 days (demo)" unit=" ms" height={96} xLabel={(i) => `Day ${i + 1}`} />
      </Panel>
      <Panel title="Security posture" className="@3xl:col-span-4">
        <ul className="space-y-2 text-xs" aria-label="Security checks (demo)">
          {[
            ["Identity and access review", "healthy"],
            ["Dependency scan", "healthy"],
            ["Certificate renewal", "processing"],
            ["Pen test findings", "warning"],
          ].map(([t, s]) => (
            <li key={t} className="flex items-center justify-between gap-2">
              <span className="text-ink-200">{t}</span>
              <StatusBadge status={s as Status} />
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Throughput" className="@3xl:col-span-4">
        <LineChart data={live.series} label="Requests per second, last 24 hours (demo)" unit=" k/s" height={80} xLabel={(i) => `${i}:00`} />
      </Panel>
      <Panel title="Incidents" className="@3xl:col-span-4">
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-4 text-center">
          <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-[#3ddc97]/15 text-[#3ddc97]">
            <svg viewBox="0 0 20 20" className="size-5" fill="none">
              <path d="m5 10.5 3.2 3L15 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="text-sm font-semibold text-white">No open incidents</p>
          <p className="text-xs text-ink-400">Empty state: nothing needs attention.</p>
        </div>
      </Panel>
    </>
  );
}

function TalentView({ live }: { live: Live }) {
  return (
    <>
      <Metric label="Available talent" value={talent.available}>
        <span className="text-xs text-ink-400">profiles ready</span>
      </Metric>
      <Metric label="Active consultants" value={live.activeTalent}>
        <span className="text-xs text-ink-400">on assignment</span>
      </Metric>
      <Metric label="Placements" value={talent.placementsQuarter}>
        <span className="text-xs text-ink-400">this quarter</span>
      </Metric>
      <Metric label="Avg. time to fill" value={talent.avgDaysToFill} suffix=" days">
        <span className="text-xs text-ink-400">all roles</span>
      </Metric>
      <Panel title="Skill matrix" className="@3xl:col-span-7">
        <SkillMatrix rows={talent.matrixRoles} cols={talent.matrixSkills} values={talent.matrix} caption="Skill coverage by role, percent of consultants (demo)" />
      </Panel>
      <Panel title="Pipeline" className="@3xl:col-span-5">
        <ProgressList items={talent.pipeline} unit="" max={talent.pipeline[0].value} label="Candidate pipeline by stage (demo)" />
      </Panel>
      <Panel title="Skills distribution" className="@3xl:col-span-5">
        <BarChart data={talent.skills} unit="%" label="Skills distribution (demo)" height={110} />
      </Panel>
      <Panel title="Locations" className="@3xl:col-span-4">
        <ProgressList items={talent.locations} label="Consultants by location, percent (demo)" />
      </Panel>
      <Panel title="Experience" className="@3xl:col-span-3">
        <BarChart data={talent.experience} unit="%" label="Consultants by years of experience (demo)" height={110} />
      </Panel>
    </>
  );
}

function AIView({ live }: { live: Live }) {
  return (
    <>
      <div className="rounded-xl bg-signal-400/10 px-4 py-3 text-xs text-signal-300 ring-1 ring-signal-400/30 @3xl:col-span-12">
        Example AI experience. Illustrates how AI workflows can be monitored, with human review on consequential actions.
      </div>
      <Panel title="Models and agents" className="@3xl:col-span-5">
        <MiniViz kind="ai" live className="mx-auto h-28 w-full max-w-64" />
        <ul className="mt-3 space-y-2 text-xs" aria-label="Models (demo)">
          {ai.models.map((m) => (
            <li key={m.name} className="flex items-center justify-between gap-2">
              <span>
                <span className="block text-ink-100">{m.name}</span>
                <span className="text-ink-500">{m.detail}</span>
              </span>
              <StatusBadge status={m.status} />
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Tasks processed" className="@3xl:col-span-7" meta={<span className="text-xs font-semibold text-white">{live.processes.toLocaleString("en-US")} today</span>}>
        <LineChart data={ai.tasks} label="AI tasks processed per hour (demo)" unit=" tasks" height={110} xLabel={(i) => `${i}:00`} />
      </Panel>
      <Panel title="Agent activity" className="@3xl:col-span-6">
        <ActivityFeed items={ai.timeline.map((t, i) => ({ id: i, text: t, time: `${(i + 1) * 4}m ago` }))} />
      </Panel>
      <Panel title="Recommendation" className="@3xl:col-span-6" meta={<StatusBadge status="processing" label="Awaiting review" />}>
        <p className="text-sm leading-relaxed text-ink-100">{ai.recommendation}</p>
        <div className="mt-4 flex gap-2">
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-950">Approve</span>
          <span className="rounded-full px-3 py-1.5 text-xs font-semibold text-ink-200 ring-1 ring-white/20">Dismiss</span>
        </div>
        <p className="mt-3 text-[0.65rem] text-ink-500">Demo only: AI recommends, a person decides.</p>
      </Panel>
    </>
  );
}

function DataView() {
  return (
    <>
      <Panel title="Data pipelines" className="@3xl:col-span-8">
        <table className="w-full text-left text-xs">
          <caption className="sr-only">Data pipeline status (demo)</caption>
          <thead className="text-[0.62rem] tracking-[0.12em] text-ink-500 uppercase">
            <tr>
              <th scope="col" className="pb-2 font-medium">
                Pipeline
              </th>
              <th scope="col" className="pb-2 font-medium">
                Rows today
              </th>
              <th scope="col" className="pb-2 font-medium">
                Freshness
              </th>
              <th scope="col" className="pb-2 font-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {pipelines.map((p) => (
              <tr key={p.name} className={cx(p.status === "error" && "bg-[#ff7a7a]/[0.06]")}>
                <td className="py-2 text-ink-100">{p.name}</td>
                <td className="py-2 text-ink-300 tabular-nums">{p.rows}</td>
                <td className="py-2 text-ink-300">{p.fresh}</td>
                <td className="py-2">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <Panel title="Volume, last 7 days" className="@3xl:col-span-4">
        <BarChart data={dataVolume} unit="M" label="Rows processed per day, millions (demo)" height={120} />
      </Panel>
      <Panel title="Data streams" className="@3xl:col-span-8">
        <MiniViz kind="data" live className="mx-auto h-32 w-full max-w-md" />
      </Panel>
      <Panel title="Legacy import" className="@3xl:col-span-4" meta={<StatusBadge status="error" label="Paused" />}>
        <p className="text-sm font-semibold text-white">Source unavailable</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-400">Controlled error state: the pipeline paused safely and will retry in 30 seconds. No data was lost.</p>
        <Shimmer className="mt-3 h-2 w-full" />
      </Panel>
    </>
  );
}

function TransformationView() {
  return (
    <>
      <Panel title="Transformation score" className="@3xl:col-span-4">
        <div className="flex items-center gap-4">
          <Donut value={transformation.score} label="Transformation score (demo)" sub="score" />
          <p className="text-xs leading-relaxed text-ink-300">Weighted across architecture, delivery, adoption and team readiness.</p>
        </div>
      </Panel>
      <Panel title="Phases" className="@3xl:col-span-8">
        <ProgressList items={transformation.phases} label="Progress by phase (demo)" />
      </Panel>
      <Panel title="Milestones" className="@3xl:col-span-6">
        <ol className="relative space-y-3 pl-5" aria-label="Milestones (demo)">
          <span aria-hidden="true" className="absolute top-1 bottom-1 left-[0.3rem] w-px bg-white/15" />
          {transformation.milestones.map((m) => (
            <li key={m.label} className="relative text-xs">
              <span aria-hidden="true" className={cx("absolute top-0.5 -left-5 size-3 rounded-full border-2", m.done ? "border-signal-400 bg-signal-400" : "border-ink-500 bg-ink-950")} />
              <span className={m.done ? "text-ink-100" : "text-ink-400"}>{m.label}</span>
              <span className="sr-only">{m.done ? " (done)" : " (upcoming)"}</span>
            </li>
          ))}
        </ol>
      </Panel>
      <Panel title="Project health" className="@3xl:col-span-6">
        <ul className="grid grid-cols-2 gap-3" aria-label="Project health (demo)">
          {transformation.health.map((h) => (
            <li key={h.label} className="rounded-lg bg-white/[0.04] p-3">
              <p className="text-xs text-ink-300">{h.label}</p>
              <StatusBadge status={h.status} className="mt-1.5" label={h.status === "healthy" ? "On track" : "At risk"} />
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Architecture: legacy to modern" className="@3xl:col-span-12">
        <MiniViz kind="transformation" live className="mx-auto h-28 w-full max-w-lg" />
      </Panel>
    </>
  );
}

export function CommandCenter({ initialTab = "overview", className, frameless }: { initialTab?: TabId; className?: string; frameless?: boolean }) {
  const [tab, setTab] = useState<TabId>(initialTab);
  const [live, setLive] = useState(true);
  const [booted, setBooted] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const base = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const data = useDemoLive(live, root);

  // Brief loading shimmer the first time the dashboard is seen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        // Rendering every panel is the heaviest update here: as a transition it yields to input.
        window.setTimeout(() => startTransition(() => setBooted(true)), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onTabKey = (e: KeyboardEvent, i: number) => {
    const n = tabs.length;
    const to = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    setTab(tabs[to].id);
    tabRefs.current[tabs[to].id]?.focus();
  };

  return (
    <div
      ref={root}
      className={cx("@container overflow-hidden text-white", !frameless && "rounded-[1.75rem] bg-ink-950 shadow-[0_40px_120px_-40px_rgb(10_20_34/0.8)] ring-1 ring-white/10", className)}
      data-dashboard=""
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-white/[0.02] px-4 py-3 @3xl:px-5">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="size-3.5 rounded-full border-[3px] border-white bg-flow-500" />
          <span className="text-sm font-bold tracking-[-0.01em]">Syntax Flow</span>
          <span className="hidden text-sm text-ink-400 @md:inline">Command Center</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-signal-400/12 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.14em] text-signal-300 uppercase ring-1 ring-signal-400/30">{demoLabel}</span>
          <button
            type="button"
            aria-pressed={live}
            onClick={() => setLive((l) => !l)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold text-ink-200 ring-1 ring-white/15 hover:ring-white/40"
          >
            <span aria-hidden="true" className={cx("size-1.5 rounded-full", live ? "bg-[#3ddc97]" : "bg-ink-500")} />
            {live ? "Live demo on" : "Live demo paused"}
          </button>
        </div>
      </div>

      <div className="flex flex-col @3xl:flex-row">
        <div role="tablist" aria-label="Dashboard views" className="flex gap-1 overflow-x-auto border-white/[0.08] p-2 [scrollbar-width:none] @3xl:w-44 @3xl:shrink-0 @3xl:flex-col @3xl:border-r @3xl:p-3">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`${base}-panel`}
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => setTab(t.id)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={cx(
                "shrink-0 rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors",
                tab === t.id ? "bg-white text-ink-950" : "text-ink-300 hover:bg-white/[0.06] hover:text-white",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${tab}`} className="min-w-0 flex-1 p-3 @3xl:p-5" tabIndex={0}>
          {!booted ? (
            <div className="grid grid-cols-1 gap-3 @3xl:grid-cols-12" role="status" aria-busy="true" aria-label="Loading dashboard">
              <Shimmer className="h-12 @3xl:col-span-12" />
              {[0, 1, 2, 3].map((i) => (
                <Shimmer key={i} className="h-24 @3xl:col-span-3" />
              ))}
              <Shimmer className="h-40 @3xl:col-span-7" />
              <Shimmer className="h-40 @3xl:col-span-5" />
            </div>
          ) : (
            <div key={tab} className="dash-enter grid grid-cols-1 gap-3 @3xl:grid-cols-12">
              {tab === "overview" && <Overview live={data} />}
              {tab === "technology" && <Technology live={data} />}
              {tab === "talent" && <TalentView live={data} />}
              {tab === "ai" && <AIView live={data} />}
              {tab === "data" && <DataView />}
              {tab === "transformation" && <TransformationView />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
