import type { CSSProperties, JSX } from "react";
import type { VizKind } from "@/content/capabilities";
import { cx } from "./ui";

/*
 * Original animated mini-visualizations, one per solution. Pure SVG + CSS:
 * no icon library, no JavaScript. Animations run while the parent `.group`
 * is hovered, focused or open (see `.viz` in globals.css); under reduced
 * motion they show their resting frame.
 */

const ink = "#15263b";
const steel = "#2380ae";
const sky = "#86c0e0";
const signal = "#16b3cc";

const anim = (name: string, dur: number, delay = 0, extra = ""): CSSProperties => ({
  animation: `${name} ${dur}s ${extra || "ease-in-out"} ${delay}s infinite`,
});
const dash = (dur = 1.6, delay = 0): CSSProperties => ({ strokeDasharray: "6 6", ...anim("viz-dash", dur, delay, "linear") });
const rise = (delay: number): CSSProperties => ({ transformBox: "fill-box", transformOrigin: "bottom", ...anim("viz-rise", 1.8, delay) });

function AI() {
  const layers = [
    [22, 30, 55, 80],
    [70, 22, 44, 66, 88],
    [118, 40, 70],
  ];
  const nodes = layers.flatMap(([x, ...ys]) => ys.map((y) => [x, y] as const));
  return (
    <>
      {layers.slice(0, -1).flatMap(([x1, ...ys1], li) => {
        const [x2, ...ys2] = layers[li + 1];
        return ys1.flatMap((y1, a) => ys2.map((y2, b) => <line key={`${li}-${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={sky} strokeWidth="1" style={(a + b) % 3 === 0 ? dash(1.4, a * 0.1) : undefined} />));
      })}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i > 7 ? 6 : 4.5} fill={i > 7 ? "#4a97c4" : "#fff"} stroke={ink} strokeWidth="1.8" style={anim("viz-pulse", 1.6, i * 0.12)} />
      ))}
      <path d="M128 55h18" stroke={signal} strokeWidth="2" strokeLinecap="round" style={dash(1)} />
    </>
  );
}

function Cloud() {
  return (
    <>
      <path d="M44 42a16 16 0 0 1 31-6 13 13 0 0 1 24 5 11 11 0 0 1 1 22H46a11 11 0 0 1-2-21z" fill="#fff" stroke={ink} strokeWidth="1.8" />
      {[38, 70, 102].map((x, i) => (
        <g key={x}>
          <line x1={x + 10} y1="63" x2={x + 10} y2="74" stroke={steel} strokeWidth="1.5" style={dash(1.2, i * 0.2)} />
          {[74, 84, 94].map((y) => (
            <rect key={y} x={x} y={y} width="20" height="7" rx="2" fill="#fff" stroke={ink} strokeWidth="1.4" />
          ))}
          {[77.5, 87.5, 97.5].map((y, j) => (
            <circle key={y} cx={x + 16} cy={y} r="1.4" fill={signal} style={anim("viz-pulse", 1, (i + j) * 0.25)} />
          ))}
        </g>
      ))}
    </>
  );
}

function Software() {
  const lines = [44, 30, 52, 24, 38];
  return (
    <>
      <rect x="14" y="16" width="84" height="78" rx="8" fill="#fff" stroke={ink} strokeWidth="1.8" />
      <path d="M14 30h84" stroke={ink} strokeWidth="1.2" />
      {[22, 28, 34].map((x) => (
        <circle key={x} cx={x} cy="23" r="2" fill={sky} />
      ))}
      {lines.map((w, i) => (
        <rect key={i} x={i % 2 ? 30 : 22} y={38 + i * 10} width={w} height="4" rx="2" fill={i === 2 ? steel : sky} />
      ))}
      <rect x="72" y="78" width="2" height="8" fill={ink} style={anim("viz-pulse", 0.9)} />
      <path d="M98 40h12v22h12M110 62v20h12" stroke={steel} strokeWidth="1.5" fill="none" style={dash(1.4)} />
      {[
        [126, 62],
        [126, 82],
        [110, 40],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 6} y={y - 6} width="12" height="12" rx="3" fill="#fff" stroke={ink} strokeWidth="1.6" />
      ))}
    </>
  );
}

function Data() {
  return (
    <>
      {[30, 44, 58].map((y, i) => (
        <path key={y} d={`M8 ${y}c18-10 30 10 48 0s30-10 44 0`} stroke={i === 1 ? steel : sky} strokeWidth="1.6" fill="none" style={dash(1.3, i * 0.2)} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={106 + i * 11} y={34 - i * 6} width="7" height={60 + i * 6} rx="2" fill={i === 3 ? "#4a97c4" : "#fff"} stroke={ink} strokeWidth="1.4" style={rise(i * 0.2)} />
      ))}
      <path d="M100 96h50" stroke={ink} strokeWidth="1.2" />
    </>
  );
}

function Transformation() {
  return (
    <>
      {[0, 1, 2].flatMap((r) =>
        [0, 1].map((c) => <rect key={`${r}${c}`} x={14 + c * 16} y={28 + r * 16} width="12" height="12" rx="2" fill="#e9eef3" stroke="#8392a5" strokeWidth="1.2" />),
      )}
      <path d="M54 55c20 0 22-22 44-22s22 22 44 22" stroke={steel} strokeWidth="1.8" fill="none" style={dash(1.2)} />
      <path d="M54 55c20 0 22 22 44 22s22-22 44-22" stroke={sky} strokeWidth="1.4" fill="none" style={dash(1.6, 0.3)} />
      <circle cx="142" cy="55" r="9" fill="#4a97c4" stroke={ink} strokeWidth="3" style={anim("viz-pulse", 1.8)} />
    </>
  );
}

function Security() {
  return (
    <>
      {[0, 1, 2, 3, 4, 5].flatMap((r) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((c) => <rect key={`${r}-${c}`} x={10 + c * 12} y={14 + r * 13} width="8" height="8" rx="1.5" fill={(r * 3 + c) % 7 === 0 ? sky : "#eef3f7"} />),
      )}
      <rect x="10" y="12" width="92" height="3" fill={signal} opacity="0.7" style={{ ...anim("viz-scan", 2.4, 0, "linear"), transformBox: "view-box" }} />
      <path d="M128 18l20 8v18c0 16-9 26-20 31-11-5-20-15-20-31V26z" fill="#fff" stroke={ink} strokeWidth="2" />
      <path d="M120 48l6 6 11-13" stroke={steel} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" style={anim("viz-pulse", 1.6)} />
    </>
  );
}

function Talent() {
  const people = [
    [30, 30],
    [26, 80],
    [80, 14],
    [134, 30],
    [138, 80],
    [80, 96],
  ];
  return (
    <>
      {people.map(([x, y], i) => (
        <line key={i} x1="80" y1="55" x2={x} y2={y} stroke={sky} strokeWidth="1.4" style={i % 2 ? dash(1.4, i * 0.15) : undefined} />
      ))}
      <path d="M30 30L80 14 134 30M26 80l54 16 58-16" stroke="#d6dde5" strokeWidth="1" fill="none" />
      {people.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="7" fill="#fff" stroke={ink} strokeWidth="2.2" style={anim("viz-pulse", 2, i * 0.2)} />
      ))}
      <circle cx="80" cy="55" r="11" fill="#4a97c4" stroke={ink} strokeWidth="3.5" />
    </>
  );
}

function Managed() {
  return (
    <>
      <rect x="10" y="18" width="140" height="74" rx="10" fill="#fff" stroke={ink} strokeWidth="1.8" />
      <path d="M18 62h28l7-18 10 34 9-24 6 8h64" stroke={steel} strokeWidth="2" fill="none" strokeLinejoin="round" style={{ strokeDasharray: "180", ...anim("viz-dash", 2.2, 0, "linear") }} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={26 + i * 22} cy="32" r="3" fill={signal} style={anim("viz-pulse", 1.2, i * 0.3)} />
          <rect x={33 + i * 22} y="30" width="10" height="4" rx="2" fill="#e9eef3" />
        </g>
      ))}
      <text x="140" y="35" textAnchor="end" fontFamily="var(--font-mono)" fontSize="8" fill="#566880">
        LIVE
      </text>
    </>
  );
}

const views: Record<VizKind, () => JSX.Element> = { ai: AI, cloud: Cloud, software: Software, data: Data, transformation: Transformation, security: Security, talent: Talent, managed: Managed };

export function MiniViz({ kind, className, live }: { kind: VizKind; className?: string; live?: boolean }) {
  const View = views[kind];
  return (
    <svg viewBox="0 0 160 110" className={cx("viz", className)} data-live={live ? "true" : undefined} aria-hidden="true" focusable="false">
      <View />
    </svg>
  );
}
