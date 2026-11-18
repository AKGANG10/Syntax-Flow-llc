"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import type { Status } from "@/content/demo-data";
import { useInView } from "@/lib/motion";
import { cx } from "../ui";

/*
 * Dashboard chart primitives. Custom SVG + CSS in the Syntax Flow system
 * (no chart library). Charts animate when they enter the viewport; under
 * reduced motion they render their final state. Every chart carries a text
 * equivalent, and interactive charts are keyboard operable.
 */

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt = (v: number, d = 0) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

/** Animates from its previous value to `value` once visible. */
export function Counter({ value, decimals = 0, prefix = "", suffix = "", className }: { value: number; decimals?: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, "0px");
  const [shown, setShown] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    if (!seen) return;
    const start = from.current;
    let raf = 0;
    if (reduced()) {
      raf = requestAnimationFrame(() => setShown(value));
      from.current = value;
      return () => cancelAnimationFrame(raf);
    }
    const t0 = performance.now();
    const dur = start === 0 ? 1300 : 600;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setShown(start + (value - start) * e);
      if (k < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);

  return (
    <span ref={ref} className={cx("tabular-nums", className)}>
      {prefix}
      {fmt(shown, decimals)}
      {suffix}
    </span>
  );
}

const statusMeta: Record<Status, { label: string; dot: string; anim?: string }> = {
  healthy: { label: "Healthy", dot: "bg-[#3ddc97]", anim: "status-pulse" },
  processing: { label: "Processing", dot: "bg-signal-400" },
  warning: { label: "Warning", dot: "bg-[#f0b94a]", anim: "status-warn" },
  offline: { label: "Offline", dot: "bg-ink-500" },
  error: { label: "Error", dot: "bg-[#ff7a7a]" },
};

/** Status with motion that matches its meaning, always with a text label. */
export function StatusBadge({ status, label, className }: { status: Status; label?: string; className?: string }) {
  const m = statusMeta[status];
  return (
    <span className={cx("inline-flex items-center gap-2 text-xs font-medium", status === "offline" ? "text-ink-400" : "text-ink-200", className)}>
      <span aria-hidden="true" className="relative flex size-2.5 items-center justify-center">
        {status === "processing" ? (
          <span className="absolute inset-[-3px] animate-spin rounded-full border-[1.5px] border-signal-400 border-t-transparent [animation-duration:1.4s]" />
        ) : (
          m.anim && <span className={cx("absolute inset-0 rounded-full", m.dot)} style={{ animation: `${m.anim} 2.4s ease-in-out infinite` }} />
        )}
        <span className={cx("relative size-2 rounded-full", m.dot)} />
      </span>
      {label ?? m.label}
    </span>
  );
}

function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

/** Self-drawing area line chart with hover and keyboard tooltip. */
export function LineChart({ data, label, unit = "", height = 120, xLabel = (i: number) => `Point ${i + 1}` }: { data: number[]; label: string; unit?: string; height?: number; xLabel?: (i: number) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const [active, setActive] = useState<number | null>(null);
  const W = 320;
  const H = height;
  const pad = 8;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [pad + (i / (data.length - 1)) * (W - pad * 2), H - pad - ((v - min) / span) * (H - pad * 3)] as [number, number]);
  const line = smoothPath(pts);
  const area = `${line} L${W - pad},${H} L${pad},${H} Z`;
  const gid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  const pick = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const k = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    setActive(Math.round(k * (data.length - 1)));
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setActive((a) => {
        const cur = a ?? data.length - 1;
        return Math.min(data.length - 1, Math.max(0, cur + (e.key === "ArrowRight" ? 1 : -1)));
      });
    }
    if (e.key === "Escape") setActive(null);
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="group"
      aria-label={`${label}. Use the left and right arrow keys to read values.`}
      onPointerMove={(e) => pick(e.clientX)}
      onPointerLeave={() => setActive(null)}
      onFocus={() => setActive((a) => a ?? data.length - 1)}
      onBlur={() => setActive(null)}
      onKeyDown={onKey}
      className="relative rounded-xl outline-offset-4 focus-visible:outline-2 focus-visible:outline-signal-400"
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#46d2e6" stopOpacity="0.32" />
            <stop offset="1" stopColor="#46d2e6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={pad} x2={W - pad} y1={H * g} y2={H * g} stroke="rgba(185,219,238,0.08)" />
        ))}
        <path d={area} fill={`url(#${gid})`} style={{ opacity: seen ? 1 : 0, transition: "opacity 900ms 500ms" }} />
        <path
          d={line}
          fill="none"
          stroke="#46d2e6"
          strokeWidth="2"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={seen ? 0 : 1}
          style={{ transition: "stroke-dashoffset 1600ms cubic-bezier(.22,1,.36,1)" }}
        />
        {active !== null && (
          <g>
            <line x1={pts[active][0]} x2={pts[active][0]} y1={pad} y2={H} stroke="rgba(225,240,248,0.35)" strokeDasharray="3 4" />
            <circle cx={pts[active][0]} cy={pts[active][1]} r="9" fill="rgba(70,210,230,0.18)" />
            <circle cx={pts[active][0]} cy={pts[active][1]} r="4" fill="#0a1422" stroke="#46d2e6" strokeWidth="2" />
          </g>
        )}
      </svg>
      <div aria-live="polite" className="pointer-events-none absolute inset-x-0 -top-2 min-h-6">
        {active !== null && (
          <span
            className="absolute -translate-x-1/2 -translate-y-full rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-ink-950 shadow-lift"
            style={{ left: `${((pts[active][0] / W) * 100).toFixed(2)}%` }}
          >
            {xLabel(active)}: {fmt(data[active], 1)}
            {unit}
          </span>
        )}
      </div>
      <p className="sr-only">
        {label}: {data.length} values from {fmt(min, 1)} to {fmt(max, 1)}
        {unit}. Latest {fmt(data[data.length - 1], 1)}
        {unit}.
      </p>
    </div>
  );
}

/** Vertical bars that rise into place; values shown above each bar. */
export function BarChart({ data, unit = "", label, height = 120 }: { data: { label: string; value: number }[]; unit?: string; label: string; height?: number }) {
  const ref = useRef<HTMLUListElement>(null);
  const seen = useInView(ref);
  const max = Math.max(...data.map((d) => d.value)) || 1;
  return (
    <ul ref={ref} className="flex items-end gap-2" style={{ height }} aria-label={label}>
      {data.map((d, i) => (
        <li key={d.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <span className="text-[0.65rem] font-semibold text-ink-200 tabular-nums">
            {d.value}
            {unit}
          </span>
          <span
            aria-hidden="true"
            className="w-full origin-bottom rounded-t-md bg-gradient-to-t from-flow-600 to-signal-400 transition-[transform,filter] duration-[900ms] ease-[var(--ease-flow)] group-hover:brightness-125"
            style={{ height: `${(d.value / max) * 78}%`, transform: `scaleY(${seen ? 1 : 0})`, transitionDelay: `${i * 70}ms` }}
          />
          <span className="max-w-full truncate text-[0.62rem] text-ink-400">{d.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** Radial progress from 0 to `value` percent. */
export function Donut({ value, label, size = 112, sub }: { value: number; label: string; size?: number; sub?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const gid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const seen = useInView(ref);
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div ref={ref} className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${value}%`}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(185,219,238,0.12)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={seen ? c * (1 - value / 100) : c}
          style={{ transition: "stroke-dashoffset 1500ms cubic-bezier(.22,1,.36,1)" }}
        />
        <defs>
          <linearGradient id={gid} x1="0" x2="1">
            <stop offset="0" stopColor="#3a92c2" />
            <stop offset="1" stopColor="#46d2e6" />
          </linearGradient>
        </defs>
      </svg>
      <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-extrabold tracking-[-0.03em] text-white">
          <Counter value={value} decimals={value % 1 ? 1 : 0} suffix="%" />
        </span>
        {sub && <span className="text-[0.6rem] tracking-[0.12em] text-ink-400 uppercase">{sub}</span>}
      </div>
    </div>
  );
}

export function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const min = Math.min(...data);
  const span = Math.max(...data) - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${30 - ((v - min) / span) * 26}`).join(" ");
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className={cx("h-8 w-full", className)} aria-hidden="true">
      <polyline points={pts} fill="none" stroke="#46d2e6" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Horizontal progress bars (transformation phases, pipeline funnel, locations). */
export function ProgressList({ items, unit = "%", max = 100, label }: { items: { label: string; value: number }[]; unit?: string; max?: number; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const seen = useInView(ref);
  return (
    <ul ref={ref} className="space-y-3" aria-label={label}>
      {items.map((it, i) => (
        <li key={it.label}>
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium text-ink-200">{it.label}</span>
            <span className="text-ink-400 tabular-nums">
              {it.value}
              {unit}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full origin-left rounded-full bg-gradient-to-r from-flow-500 to-signal-400 transition-transform duration-[1100ms] ease-[var(--ease-flow)]"
              style={{ width: `${(it.value / max) * 100}%`, transform: `scaleX(${seen ? 1 : 0})`, transitionDelay: `${i * 90}ms` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

type NetNode = { id: string; label: string; x: number; y: number; kind?: "tech" | "talent" | "core" };

/** Nodes that connect one by one when visible, with data flowing on the links. */
export function NetworkGraph({ nodes, links, label, height = 160, highlight }: { nodes: NetNode[]; links: [string, string][]; label: string; height?: number; highlight?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <div ref={ref} role="img" aria-label={`${label}: ${nodes.map((n) => n.label).join(", ")}.`}>
      <svg viewBox={`0 0 100 ${(height / 320) * 100}`} className="block w-full overflow-visible" aria-hidden="true">
        {links.map(([a, b], i) => {
          const p = byId[a];
          const q = byId[b];
          const on = !highlight || a === highlight || b === highlight;
          return (
            <g key={`${a}-${b}`}>
              <line
                x1={p.x}
                y1={p.y}
                x2={q.x}
                y2={q.y}
                stroke={on ? "rgba(134,192,224,0.55)" : "rgba(134,192,224,0.15)"}
                strokeWidth="0.5"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={seen ? 0 : 1}
                style={{ transition: `stroke-dashoffset 700ms ${200 + i * 110}ms ease-out, stroke 400ms` }}
              />
              {on && seen && <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#46d2e6" strokeWidth="0.7" strokeDasharray="1.5 6" style={{ animation: `viz-dash ${2 + (i % 3) * 0.5}s linear infinite` }} />}
            </g>
          );
        })}
        {nodes.map((n, i) => (
          <g key={n.id} style={{ opacity: seen ? 1 : 0, transition: `opacity 500ms ${i * 90}ms` }}>
            <circle
              cx={n.x}
              cy={n.y}
              r={n.kind === "core" ? 4 : 2.6}
              fill={n.kind === "talent" ? "#0a1422" : n.kind === "core" ? "#4a97c4" : "#3a92c2"}
              stroke={n.kind === "core" || n.kind === "talent" ? "#e1f0f8" : "none"}
              strokeWidth={n.kind === "core" ? 1.4 : 0.8}
            />
            <text x={n.x} y={n.y + (n.kind === "core" ? 8.5 : 7)} textAnchor="middle" fontSize="3.4" fill="#b4bfcc" fontFamily="var(--font-sans)">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Items appear one by one; new live items slide in at the top. */
export function ActivityFeed({ items }: { items: { id: number; text: string; time: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const seen = useInView(ref);
  return (
    <ol ref={ref} className="space-y-2.5" aria-label="Recent activity (demo)" aria-live="off">
      {items.map((it, i) => (
        <li
          key={it.id}
          className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2 text-xs"
          style={seen ? ({ animation: "feed-in 520ms cubic-bezier(.22,1,.36,1) both", animationDelay: `${i * 140}ms` } as CSSProperties) : { opacity: 0 }}
        >
          <span className="flex items-center gap-2 text-ink-100">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-signal-400" />
            {it.text}
          </span>
          <span className="shrink-0 text-ink-500">{it.time}</span>
        </li>
      ))}
    </ol>
  );
}

/** Role-by-skill coverage as a real table (screen readers get the values). */
export function SkillMatrix({ rows, cols, values, caption }: { rows: string[]; cols: string[]; values: number[][]; caption: string }) {
  return (
    <table className="w-full border-separate border-spacing-1 text-[0.62rem]">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          <th scope="col" className="sr-only">
            Role
          </th>
          {cols.map((c) => (
            <th key={c} scope="col" className="pb-1 font-medium text-ink-400">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r}>
            <th scope="row" className="pr-2 text-left font-medium whitespace-nowrap text-ink-300">
              {r}
            </th>
            {values[i].map((v, j) => (
              <td key={j} className="h-6 rounded-md" style={{ background: `rgba(70,210,230,${(0.08 + v * 0.72).toFixed(2)})` }} title={`${r} · ${cols[j]}: ${Math.round(v * 100)}%`}>
                <span className="sr-only">{Math.round(v * 100)}%</span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Shimmer({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cx("rounded-xl bg-[linear-gradient(110deg,rgba(255,255,255,0.04)_30%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.04)_70%)] bg-[length:200%_100%] [animation:shimmer_1.4s_linear_infinite]", className)} />;
}

/** Glass dashboard panel. */
export function Panel({ title, meta, children, className, zoom }: { title: string; meta?: ReactNode; children: ReactNode; className?: string; zoom?: string }) {
  return (
    <article data-zoom={zoom} className={cx("dash-panel relative flex flex-col rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/[0.08]", className)} aria-label={title}>
      <header className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[0.62rem] tracking-[0.16em] text-ink-300 uppercase">{title}</p>
        {meta}
      </header>
      {children}
    </article>
  );
}
