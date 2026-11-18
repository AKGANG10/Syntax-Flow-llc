"use client";

import { useState } from "react";
import { cx } from "./ui";

const roles = [
  { id: "developers", name: "Developers", text: "Front-end, back-end and full-stack engineers who ship product features every sprint." },
  { id: "engineers", name: "Engineers", text: "Platform, QA and integration engineers who keep complex systems reliable." },
  { id: "cloud", name: "Cloud Architects", text: "Design secure, cost-aware cloud foundations and lead migrations." },
  { id: "data", name: "Data Engineers", text: "Build the pipelines and platforms that analytics and AI depend on." },
  { id: "ai", name: "AI Engineers", text: "Take models from prototype to production, with evaluation and guardrails." },
  { id: "pm", name: "Project Managers", text: "Keep scope, budget and people aligned from kickoff to launch." },
  { id: "leaders", name: "Technical Leaders", text: "Architects, engineering managers and interim technology leaders who set direction." },
] as const;

const W = 560;
const H = 440;
const C = { x: W / 2, y: H / 2 };
const R = 168;
const pos = roles.map((_, i) => {
  const a = -Math.PI / 2 + (i / roles.length) * Math.PI * 2;
  return { x: C.x + Math.cos(a) * R * 1.12, y: C.y + Math.sin(a) * R };
});

/**
 * People network (dark surface). Role buttons drive the diagram, so the
 * interaction works with keyboard, touch and screen readers; the SVG is
 * decorative and mirrors the selected state.
 */
export function TalentNetwork() {
  const [active, setActive] = useState(0);
  const role = roles[active];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-0 rounded-full bg-flow-600/15 blur-[90px]" />
        <svg viewBox={`0 0 ${W} ${H}`} className="relative w-full" aria-hidden="true">
          <circle cx={C.x} cy={C.y} r={R * 0.62} fill="none" stroke="rgba(185,219,238,0.12)" strokeDasharray="3 7" />
          <ellipse cx={C.x} cy={C.y} rx={R * 1.12} ry={R} fill="none" stroke="rgba(185,219,238,0.1)" />
          {pos.map((p, i) => {
            const next = pos[(i + 1) % pos.length];
            return <line key={`p${i}`} x1={p.x} y1={p.y} x2={next.x} y2={next.y} stroke="rgba(185,219,238,0.12)" />;
          })}
          {pos.map((p, i) => (
            <line
              key={i}
              x1={C.x}
              y1={C.y}
              x2={p.x}
              y2={p.y}
              stroke={i === active ? "#46d2e6" : "rgba(134,192,224,0.3)"}
              strokeWidth={i === active ? 2 : 1}
              strokeDasharray={i === active ? "6 8" : undefined}
              style={i === active ? { animation: "viz-dash 1.2s linear infinite" } : undefined}
              className="transition-[stroke] duration-[var(--duration-slow)]"
            />
          ))}
          {pos.map((p, i) => (
            <g key={`n${i}`} className="cursor-pointer" onPointerEnter={() => setActive(i)} onClick={() => setActive(i)}>
              <circle cx={p.x} cy={p.y} r={i === active ? 15 : 11} fill="#0a1422" stroke={i === active ? "#e1f0f8" : "rgba(225,240,248,0.6)"} strokeWidth={i === active ? 3 : 2} className="transition-all duration-[var(--duration-normal)]" />
              <text
                x={p.x}
                y={p.y + (p.y < C.y ? -26 : 34)}
                textAnchor="middle"
                fontSize="13"
                fontWeight={i === active ? 700 : 500}
                fill={i === active ? "#ffffff" : "#b4bfcc"}
                fontFamily="var(--font-sans)"
              >
                {roles[i].name}
              </text>
            </g>
          ))}
          <circle cx={C.x} cy={C.y} r="38" fill="#4a97c4" stroke="#e1f0f8" strokeWidth="7" />
          <circle cx={C.x} cy={C.y} r="58" fill="none" stroke="rgba(70,210,230,0.35)" strokeWidth="1.5" style={{ animation: "viz-pulse 2.4s ease-in-out infinite" }} />
          <text x={C.x} y={C.y + 82} textAnchor="middle" fontSize="11" letterSpacing="2" fill="#86c0e0" fontFamily="var(--font-mono)">
            YOUR TEAM
          </text>
        </svg>
      </div>

      <div>
        <ul className="flex flex-wrap gap-2" aria-label="Roles we recruit">
          {roles.map((r, i) => (
            <li key={r.id}>
              <button
                type="button"
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                onPointerEnter={() => setActive(i)}
                className={cx(
                  "flex min-h-11 items-center gap-2.5 rounded-full px-4 text-[0.95rem] font-medium transition-colors duration-[var(--duration-fast)]",
                  i === active ? "bg-white text-ink-950" : "text-ink-200 ring-1 ring-inset ring-white/15 hover:ring-white/40",
                )}
              >
                <span aria-hidden="true" className={cx("size-2.5 rounded-full border-[1.5px]", i === active ? "border-ink-950" : "border-ink-300")} />
                {r.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-8 rounded-[var(--radius-card)] bg-white/[0.05] p-6 ring-1 ring-white/10" aria-live="polite">
          <p className="t-label text-signal-300">{role.name}</p>
          <p className="mt-3 text-lg leading-relaxed text-ink-100">{role.text}</p>
        </div>
      </div>
    </div>
  );
}

/** Technology + People = Transformation. */
export function TalentEquation() {
  const parts = [
    { label: "Technology", node: <span className="block size-5 rounded-full bg-flow-400" /> },
    { op: "+" },
    { label: "People", node: <span className="block size-5 rounded-full border-[3px] border-white" /> },
    { op: "=" },
    { label: "Transformation", node: <span className="block size-5 rounded-full border-[3px] border-white bg-flow-500" /> },
  ];
  return (
    <p className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[clamp(1.5rem,1rem+2vw,2.75rem)] font-extrabold tracking-[-0.035em] text-white">
      {parts.map((p, i) =>
        "op" in p ? (
          <span key={i} aria-hidden="true" className="font-light text-flow-300">
            {p.op}
          </span>
        ) : (
          <span key={i} className="inline-flex items-center gap-3">
            <span aria-hidden="true">{p.node}</span>
            {p.label}
          </span>
        ),
      )}
      <span className="sr-only">Technology plus people equals transformation.</span>
    </p>
  );
}
