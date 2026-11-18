"use client";

import Link from "next/link";
import { startTransition, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { ai, demoLabel, overview, pipelines, talent, transformation } from "@/content/demo-data";
import { useMediaQuery, useScrollProgress } from "@/lib/motion";
import { ArrowIcon, Container, Eyebrow } from "../ui";
import { BarChart, Counter, LineChart, NetworkGraph, Panel, ProgressList, StatusBadge } from "./charts";
import { CommandCenter } from "./command-center";

/*
 * "See the system in motion": entering the system.
 * Desktop with motion: the section pins; a 3D-tilted dashboard far away
 * turns to face the viewer while floating module cards clear, panels boot,
 * the camera zooms into Talent intelligence, Skill distribution and AI
 * matching, then returns to the full dashboard as everything resolves into
 * Technology + Talent + Transformation. The camera is one CSS 3D transform
 * written directly from scroll progress (no re-render per frame).
 * Phones: a vertical story of module cards. Reduced motion: the flat,
 * fully interactive dashboard.
 */

type Frame = { p: number; rx: number; ry: number; rz: number; s: number; target?: string; lift: number };

// `s` is relative to the fitted scale; `target` names a [data-zoom] element to centre.
const frames: Frame[] = [
  { p: 0, rx: 36, ry: -24, rz: 7, s: 0.6, lift: 0.14 },
  { p: 0.24, rx: 0, ry: 0, rz: 0, s: 1, lift: 0 },
  { p: 0.36, rx: 0, ry: 0, rz: 0, s: 1, lift: 0 },
  { p: 0.48, rx: 0, ry: 0, rz: 0, s: 1.7, target: "talent", lift: 0 },
  { p: 0.6, rx: 0, ry: 0, rz: 0, s: 2.2, target: "skills", lift: 0 },
  { p: 0.72, rx: 0, ry: 0, rz: 0, s: 1.9, target: "matching", lift: 0 },
  { p: 0.86, rx: 0, ry: 0, rz: 0, s: 1, lift: 0 },
  { p: 1, rx: 0, ry: 0, rz: 0, s: 0.96, lift: 0 },
];

const captions = [
  { at: 0, title: "Entering the system", text: "Technology, data and people, moving as one." },
  { at: 0.28, title: "Panels activate", text: "Health, AI activity, talent and systems come online." },
  { at: 0.42, title: "Talent intelligence", text: "Who is available, and what they are great at." },
  { at: 0.55, title: "Skill distribution", text: "Coverage across cloud, data, AI and engineering." },
  { at: 0.67, title: "AI matching", text: "Shortlists suggested by AI, decided by recruiters." },
  { at: 0.8, title: "Everything connects", text: "Technology + Talent + Transformation." },
];

const ease = (k: number) => k * k * (3 - 2 * k);

/**
 * True once the element is within a screen of the viewport. The dashboard is the
 * heaviest thing on the home page, so it mounts on approach (as an interruptible
 * transition) instead of during page load.
 */
function useNear(ref: RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        startTransition(() => setNear(true));
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, near]);
  return near;
}

/** Holds the board's place (and size, for the camera) until the dashboard mounts. */
function BoardPlaceholder() {
  return <div aria-hidden="true" className="h-[40rem] rounded-[var(--radius-panel)] bg-white/[0.03] ring-1 ring-white/10" />;
}

/** Card pushed toward the viewer (outer) that bobs gently (inner), so transforms do not collide. */
function Float({ z, delay, className, children }: { z: number; delay: string; className: string; children: ReactNode }) {
  return (
    <div className={`absolute ${className}`} style={{ transform: `translateZ(${z}px)` }}>
      <div style={{ animation: `dash-bob 7s ease-in-out ${delay} infinite` } as CSSProperties}>{children}</div>
    </div>
  );
}

function FloatingCards() {
  return (
    <div aria-hidden="true" className="absolute inset-0 [perspective:1400px] [transform-style:preserve-3d]">
      <Float z={240} delay="0s" className="top-[12%] left-[15%] w-56">
        <Panel title="System health" className="!bg-ink-900/85 shadow-2xl backdrop-blur-md">
          <p className="text-3xl font-extrabold tracking-[-0.04em]">{overview.systemHealth}%</p>
          <StatusBadge status="healthy" className="mt-2" />
        </Panel>
      </Float>
      <Float z={170} delay="-2.5s" className="right-[15%] bottom-[14%] w-72">
        <Panel title="Talent network" className="!bg-ink-900/85 shadow-2xl backdrop-blur-md">
          <NetworkGraph
            label="Talent network (demo)"
            height={86}
            nodes={[
              { id: "a", label: "Cloud", x: 12, y: 9, kind: "talent" },
              { id: "b", label: "Data", x: 38, y: 20, kind: "talent" },
              { id: "c", label: "AI", x: 64, y: 8, kind: "talent" },
              { id: "d", label: "QA", x: 88, y: 20, kind: "talent" },
              { id: "e", label: "Team", x: 50, y: 4, kind: "core" },
            ]}
            links={[
              ["a", "b"],
              ["b", "c"],
              ["c", "d"],
              ["e", "b"],
              ["e", "c"],
            ]}
          />
        </Panel>
      </Float>
      <Float z={290} delay="-4.5s" className="top-[14%] right-[17%] w-52">
        <Panel title="AI activity" className="!bg-ink-900/85 shadow-2xl backdrop-blur-md">
          <BarChart data={ai.tasks.slice(0, 6).map((v, i) => ({ label: `${i * 4}h`, value: Math.round(v) }))} label="AI activity (demo)" height={60} />
        </Panel>
      </Float>
    </div>
  );
}

/** Flow lines from the hero's language entering the dashboard. */
function FlowLines() {
  const paths = [
    "M0 120 C 240 120, 300 300, 620 330",
    "M0 210 C 260 210, 330 330, 620 350",
    "M0 300 C 250 300, 360 360, 620 370",
    "M0 420 C 260 420, 340 400, 620 390",
    "M0 520 C 240 520, 320 430, 620 410",
  ];
  return (
    <svg viewBox="0 0 620 640" preserveAspectRatio="none" className="absolute inset-y-0 left-0 h-full w-1/2" aria-hidden="true">
      {paths.map((d, i) => (
        <g key={d}>
          <path d={d} fill="none" stroke="rgba(134,192,224,0.28)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <path d={d} fill="none" stroke="#46d2e6" strokeWidth="1.6" strokeDasharray="3 22" vectorEffect="non-scaling-stroke" style={{ animation: `viz-dash ${1.6 + i * 0.3}s linear infinite` }} />
        </g>
      ))}
    </svg>
  );
}

/** Desktop pinned story. */
function Story() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const extras = useRef<HTMLDivElement>(null);
  const [cap, setCap] = useState(0);
  const pointer = useRef({ x: 0, y: 0 });
  const progress = useRef(0);
  const near = useNear(section);

  const targetOf = useCallback((name?: string) => {
    const root = board.current;
    if (!root || !name) return null;
    const el = root.querySelector<HTMLElement>(`[data-zoom="${name}"]`);
    if (!el) return null;
    let x = el.offsetWidth / 2;
    let y = el.offsetHeight / 2;
    let n: HTMLElement | null = el;
    while (n && n !== root) {
      x += n.offsetLeft;
      y += n.offsetTop;
      n = n.offsetParent as HTMLElement | null;
    }
    // Safety: if the chain did not end at the board, ignore the target rather than fly off-stage.
    return n === root ? { x, y } : null;
  }, []);

  const apply = useCallback(
    (p: number) => {
      const st = stage.current;
      const cam = camera.current;
      const b = board.current;
      if (!st || !cam || !b) return;
      const W = b.offsetWidth;
      const H = b.offsetHeight;
      const fit = Math.min(1, (st.clientWidth - 80) / W, (st.clientHeight - 32) / H);
      let i = frames.findIndex((f) => f.p > p) - 1;
      if (i < 0) i = p >= 1 ? frames.length - 2 : 0;
      const a = frames[i];
      const z = frames[i + 1];
      const k = ease(Math.min(1, Math.max(0, (p - a.p) / (z.p - a.p))));
      const mix = (u: number, v: number) => u + (v - u) * k;
      const ca = targetOf(a.target) ?? { x: W / 2, y: H / 2 };
      const cz = targetOf(z.target) ?? { x: W / 2, y: H / 2 };
      const s = fit * mix(a.s, z.s);
      const cx = mix(ca.x, cz.x);
      const cy = mix(ca.y, cz.y);
      const settled = (p > 0.24 && p < 0.38) || p > 0.86 ? 1 : 0;
      const rx = mix(a.rx, z.rx) - pointer.current.y * 3 * settled;
      const ry = mix(a.ry, z.ry) + pointer.current.x * 4 * settled;
      const lift = mix(a.lift, z.lift) * st.clientHeight;
      cam.style.transform = `translate3d(${(-(cx - W / 2) * s).toFixed(1)}px, ${(-(cy - H / 2) * s + lift).toFixed(1)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${mix(a.rz, z.rz).toFixed(2)}deg) scale(${s.toFixed(4)})`;
      if (extras.current) extras.current.style.opacity = String(Math.max(0, 1 - p / 0.26));
      const c = captions.reduce((acc, cur, idx) => (p >= cur.at ? idx : acc), 0);
      setCap((prev) => (prev === c ? prev : c));
    },
    [targetOf],
  );

  useScrollProgress(
    section,
    useCallback(
      (p: number) => {
        progress.current = p;
        apply(p);
      },
      [apply],
    ),
  );

  // Subtle cursor-driven rotation once the dashboard faces the viewer; re-fit on resize.
  useEffect(() => {
    let raf = 0;
    const move = (e: PointerEvent) => {
      pointer.current = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => apply(progress.current));
    };
    window.addEventListener("pointermove", move, { passive: true });
    const ro = new ResizeObserver(() => apply(progress.current));
    if (stage.current) ro.observe(stage.current);
    if (board.current) ro.observe(board.current);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      ro.disconnect();
    };
  }, [apply]);

  return (
    <section ref={section} aria-labelledby="system-title" className="noise relative h-[380vh] bg-ink-950 text-white" data-system-story="">
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden">
        <div aria-hidden="true" className="bg-grid-dark mask-radial pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 size-[56rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flow-600/20 blur-[160px]" />
        <Container className="relative pt-[calc(var(--header-h)+1.5rem)]">
          <div className="flex items-end justify-between gap-8">
            <div className="max-w-xl">
              <Eyebrow tone="dark">Platform</Eyebrow>
              <h2 id="system-title" className="t-h2 mt-3 text-white">
                See the system in motion.
              </h2>
              <p className="mt-3 text-ink-300">We turn complex systems, people, data and operations into intelligent experiences.</p>
            </div>
            <div className="hidden w-80 shrink-0 text-right xl:block" aria-live="polite">
              <p className="t-label text-signal-300">
                {String(cap + 1).padStart(2, "0")} · {captions[cap].title}
              </p>
              <p className="mt-2 text-ink-300">{captions[cap].text}</p>
            </div>
          </div>
        </Container>
        <div ref={stage} className="relative flex-1 [perspective:1800px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div ref={camera} className="origin-center [transform-style:preserve-3d]">
              {/* relative: zoom targets are measured via offsetParent, which must stop at this element. */}
              <div ref={board} className="relative w-[1180px]">
                {near ? <CommandCenter /> : <BoardPlaceholder />}
              </div>
            </div>
          </div>
          <div ref={extras} className="pointer-events-none absolute inset-0">
            {near ? (
              <>
                <FlowLines />
                <FloatingCards />
              </>
            ) : null}
          </div>
        </div>
        <Container className="relative pb-6">
          <p className="flex items-center justify-between gap-4 text-xs text-ink-400">
            <span className="font-mono tracking-[0.14em] text-signal-300 uppercase">{demoLabel}</span>
            <Link href="/platform" className="group inline-flex items-center gap-1.5 font-semibold text-white">
              <span className="strand-link">Open the full command center</span>
              <ArrowIcon className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </p>
        </Container>
      </div>
    </section>
  );
}

/** Phones and tablets: the dashboard becomes a vertical story of module cards. */
function MobileStory() {
  return (
    <section aria-labelledby="system-title-m" className="noise relative bg-ink-950 py-20 text-white">
      <div aria-hidden="true" className="bg-grid-dark mask-fade-y pointer-events-none absolute inset-0" />
      <Container className="relative">
        <Eyebrow tone="dark">Platform</Eyebrow>
        <h2 id="system-title-m" className="t-h2 mt-3 text-white">
          See the system in motion.
        </h2>
        <p className="mt-3 text-ink-300">We turn complex systems, people, data and operations into intelligent experiences.</p>
        <p className="mt-4 font-mono text-[0.65rem] tracking-[0.14em] text-signal-300 uppercase">{demoLabel}</p>
        <ol className="mt-10 space-y-4">
          <li className="reveal">
            <Panel title="System health" meta={<StatusBadge status="healthy" />}>
              <p className="text-4xl font-extrabold tracking-[-0.04em]">
                <Counter value={overview.systemHealth} decimals={1} suffix="%" />
              </p>
              <p className="mt-1 text-sm text-ink-400">
                <Counter value={overview.activeSystems} /> active systems
              </p>
            </Panel>
          </li>
          <li className="reveal">
            <Panel title="Talent">
              <BarChart data={talent.skills} unit="%" label="Skill distribution (demo)" height={110} />
            </Panel>
          </li>
          <li className="reveal">
            <Panel title="AI activity">
              <LineChart data={ai.tasks} label="AI tasks processed per hour (demo)" unit=" tasks" height={100} xLabel={(i) => `${i}:00`} />
            </Panel>
          </li>
          <li className="reveal">
            <Panel title="Data">
              <ul className="space-y-2 text-xs">
                {pipelines.slice(0, 4).map((p) => (
                  <li key={p.name} className="flex items-center justify-between gap-2">
                    <span className="text-ink-100">{p.name}</span>
                    <StatusBadge status={p.status} />
                  </li>
                ))}
              </ul>
            </Panel>
          </li>
          <li className="reveal">
            <Panel title="Transformation">
              <ProgressList items={transformation.phases} label="Transformation progress by phase (demo)" />
            </Panel>
          </li>
        </ol>
        <Link href="/platform" className="mt-8 inline-flex items-center gap-1.5 font-semibold text-white">
          <span className="strand-link">Open the full command center</span>
          <ArrowIcon />
        </Link>
      </Container>
    </section>
  );
}

/** Reduced motion on desktop: the flat, fully interactive dashboard. */
function StaticBoard() {
  const section = useRef<HTMLElement>(null);
  const near = useNear(section);
  return (
    <section ref={section} aria-labelledby="system-title-s" className="relative bg-ink-950 py-24 text-white">
      <Container>
        <Eyebrow tone="dark">Platform</Eyebrow>
        <h2 id="system-title-s" className="t-h2 mt-3 text-white">
          See the system in motion.
        </h2>
        <p className="mt-3 max-w-xl text-ink-300">We turn complex systems, people, data and operations into intelligent experiences.</p>
        <div className="mt-10">{near ? <CommandCenter /> : <BoardPlaceholder />}</div>
      </Container>
    </section>
  );
}

export function DashboardShowcase() {
  const desktop = useMediaQuery("(min-width: 1024px)", false);
  const motion = useMediaQuery("(prefers-reduced-motion: no-preference)", false);
  if (!desktop) return <MobileStory />;
  if (!motion) return <StaticBoard />;
  return <Story />;
}
