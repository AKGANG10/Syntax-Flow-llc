"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cx } from "./ui";

/*
 * Recurring visual concept from the brief: TECHNOLOGY -> TALENT -> OUTCOMES.
 * Visual vocabulary follows the logo: filled blue nodes for systems, open
 * rings for people, and strands connecting them.
 */

const technology = ["AI", "Cloud", "Software", "Data", "Security", "Automation"] as const;
const talent = ["Engineers", "Architects", "Developers", "Data Specialists", "Cybersecurity Professionals", "Cloud Experts", "Recruiters"] as const;
const outcomes = ["Innovation", "Efficiency", "Growth", "Scale", "Transformation"] as const;

type Tech = (typeof technology)[number];
type Person = (typeof talent)[number];
type Outcome = (typeof outcomes)[number];

const map: Record<Tech, { people: Person[]; outcomes: Outcome[] }> = {
  AI: { people: ["Architects", "Engineers", "Data Specialists", "Recruiters"], outcomes: ["Innovation", "Efficiency", "Transformation"] },
  Cloud: { people: ["Cloud Experts", "Architects", "Engineers", "Recruiters"], outcomes: ["Scale", "Efficiency"] },
  Software: { people: ["Developers", "Engineers", "Architects", "Recruiters"], outcomes: ["Growth", "Innovation"] },
  Data: { people: ["Data Specialists", "Engineers", "Recruiters"], outcomes: ["Efficiency", "Growth"] },
  Security: { people: ["Cybersecurity Professionals", "Architects", "Recruiters"], outcomes: ["Scale", "Transformation"] },
  Automation: { people: ["Developers", "Engineers", "Recruiters"], outcomes: ["Efficiency", "Scale"] },
};

type Point = { x: number; y: number };
type Layout = { width: number; height: number; right: Record<string, Point>; left: Record<string, Point> };

function list(items: string[]) {
  return items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

export function EcosystemMap() {
  const [active, setActive] = useState<Tech>("AI");
  const [layout, setLayout] = useState<Layout | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const box = wrap.getBoundingClientRect();
    const right: Record<string, Point> = {};
    const left: Record<string, Point> = {};
    wrap.querySelectorAll<HTMLElement>("[data-node]").forEach((el) => {
      const r = el.getBoundingClientRect();
      const key = el.dataset.node!;
      right[key] = { x: r.right - box.left, y: r.top + r.height / 2 - box.top };
      left[key] = { x: r.left - box.left, y: r.top + r.height / 2 - box.top };
    });
    setLayout({ width: box.width, height: box.height, right, left });
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [measure]);

  const links = useMemo(() => {
    const all: { from: string; to: string; on: boolean }[] = [];
    for (const t of technology) {
      for (const p of map[t].people) all.push({ from: `t:${t}`, to: `p:${p}`, on: t === active });
    }
    const people = map[active].people;
    for (const p of people) for (const o of map[active].outcomes) all.push({ from: `p:${p}`, to: `o:${o}`, on: true });
    return all;
  }, [active]);

  const curve = (a: Point, b: Point) => {
    const mid = (a.x + b.x) / 2;
    return `M${a.x} ${a.y} C${mid} ${a.y}, ${mid} ${b.y}, ${b.x} ${b.y}`;
  };

  const activePeople = map[active].people;
  const activeOutcomes = map[active].outcomes;

  return (
    <div>
      <div ref={wrapRef} className="relative grid gap-10 md:grid-cols-3 md:gap-16 lg:gap-24">
        {layout && (
          <svg
            className="pointer-events-none absolute inset-0 hidden md:block"
            width={layout.width}
            height={layout.height}
            aria-hidden="true"
          >
            {links.map((l) => {
              const a = layout.right[l.from];
              const b = layout.left[l.to];
              if (!a || !b) return null;
              return (
                <path
                  key={`${l.from}-${l.to}`}
                  d={curve({ x: a.x + 8, y: a.y }, { x: b.x - 8, y: b.y })}
                  fill="none"
                  stroke="#86c0e0"
                  strokeOpacity={l.on ? 0.95 : 0.1}
                  strokeWidth={l.on ? 1.6 : 1}
                  className="transition-[stroke-opacity] duration-[var(--duration-slow)]"
                />
              );
            })}
          </svg>
        )}

        <div className="relative">
          <p className="t-label text-flow-300">Technology</p>
          <ul className="mt-5 flex flex-wrap gap-2.5 md:flex-col md:items-start" aria-label="Technology areas">
            {technology.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  data-node={`t:${t}`}
                  aria-pressed={t === active}
                  onClick={() => setActive(t)}
                  onFocus={() => setActive(t)}
                  onMouseEnter={() => setActive(t)}
                  className={cx(
                    "relative flex min-h-11 items-center gap-2.5 rounded-full px-4.5 text-[0.95rem] font-semibold transition-colors duration-[var(--duration-fast)]",
                    t === active ? "bg-flow-500 text-ink-950" : "bg-ink-900 text-white ring-1 ring-inset ring-white/15 hover:ring-white/40",
                  )}
                >
                  <span aria-hidden="true" className={cx("size-2.5 rounded-full", t === active ? "bg-ink-950" : "bg-flow-400")} />
                  {t}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <p className="t-label text-flow-300">Talent</p>
          <ul className="mt-5 flex flex-wrap gap-2.5 md:flex-col md:items-start" aria-label="Talent">
            {talent.map((p) => {
              const on = activePeople.includes(p);
              return (
                <li key={p}>
                  <span
                    data-node={`p:${p}`}
                    className={cx(
                      "flex min-h-11 items-center gap-2.5 rounded-full px-4.5 text-[0.95rem] font-medium transition-colors duration-[var(--duration-normal)]",
                      on ? "bg-white text-ink-950" : "bg-ink-950 text-ink-300 ring-1 ring-inset ring-white/10",
                    )}
                  >
                    <span aria-hidden="true" className={cx("size-2.5 rounded-full border-[1.5px]", on ? "border-ink-950" : "border-ink-400")} />
                    {p}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative">
          <p className="t-label text-flow-300">Business outcomes</p>
          <ul className="mt-5 flex flex-wrap gap-2.5 md:flex-col md:items-start" aria-label="Business outcomes">
            {outcomes.map((o) => {
              const on = activeOutcomes.includes(o);
              return (
                <li key={o}>
                  <span
                    data-node={`o:${o}`}
                    className={cx(
                      "flex min-h-11 items-center gap-2.5 rounded-full px-4.5 text-[0.95rem] font-semibold transition-colors duration-[var(--duration-normal)]",
                      on ? "bg-flow-300 text-ink-950" : "bg-ink-950 text-ink-300 ring-1 ring-inset ring-white/10",
                    )}
                  >
                    <span aria-hidden="true" className={cx("size-2.5 rounded-full", on ? "bg-ink-950" : "bg-ink-500")} />
                    {o}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="mt-10 max-w-3xl text-ink-300" aria-live="polite">
        <span className="font-semibold text-white">{active}</span> needs {list(activePeople.map((p) => p.toLowerCase()))}, and drives{" "}
        {list(activeOutcomes.map((o) => o.toLowerCase()))}.
      </p>
    </div>
  );
}
