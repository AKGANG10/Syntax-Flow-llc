import type { CSSProperties, JSX } from "react";
import type { IndustryArt as Art } from "@/content/industries";
import { cx } from "./ui";

/*
 * Original atmospheric artwork per industry, drawn for dark surfaces.
 * Pure SVG + CSS; motion pauses unless the parent card is hovered or focused
 * (`.viz` rules) and freezes under reduced motion.
 */

const line = "#86c0e0";
const soft = "rgba(185,219,238,0.35)";
const node = "#e1f0f8";
const signal = "#46d2e6";

const anim = (name: string, dur: number, delay = 0, ease = "ease-in-out"): CSSProperties => ({ animation: `${name} ${dur}s ${ease} ${delay}s infinite` });
const dash = (dur = 2, delay = 0): CSSProperties => ({ strokeDasharray: "8 10", ...anim("viz-dash", dur, delay, "linear") });

const arts: Record<Art, () => JSX.Element> = {
  finance: () => (
    <>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const h = [40, 62, 50, 78, 70, 96, 88, 118][i];
        return (
          <g key={i}>
            <line x1={34 + i * 34} y1={170 - h - 14} x2={34 + i * 34} y2={170 - h + 30} stroke={soft} strokeWidth="1.5" />
            <rect x={26 + i * 34} y={170 - h} width="16" height={h * 0.4 + 10} rx="3" fill={i % 3 === 2 ? "#3a92c2" : "rgba(134,192,224,0.25)"} stroke={line} strokeWidth="1.2" />
          </g>
        );
      })}
      <path d="M20 140 L90 116 L150 124 L210 86 L270 70 L300 44" stroke={signal} strokeWidth="2.2" fill="none" style={dash(2.4)} />
    </>
  ),
  healthcare: () => (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M0 ${40 + i * 30}H320`} stroke="rgba(185,219,238,0.08)" />
      ))}
      <path d="M10 110h70l14-38 18 72 16-52 12 18h170" stroke={signal} strokeWidth="2.4" fill="none" strokeLinejoin="round" style={{ strokeDasharray: "420", ...anim("viz-dash", 3, 0, "linear") }} />
      <path d="M250 40h16v16h16v16h-16v16h-16v-16h-16v-16h16z" fill="none" stroke={line} strokeWidth="1.6" style={anim("viz-pulse", 2)} />
    </>
  ),
  technology: () => (
    <>
      {[
        "M10 50h80v40h70",
        "M10 120h50v-30h110v60h60",
        "M160 90v-50h90v30h60",
        "M230 150v-40h80",
        "M90 170v-20h80",
      ].map((d, i) => (
        <path key={i} d={d} stroke={i % 2 ? soft : line} strokeWidth="1.6" fill="none" style={i % 2 ? undefined : dash(2, i * 0.2)} />
      ))}
      {[
        [90, 50],
        [160, 90],
        [250, 40],
        [230, 150],
        [60, 120],
        [170, 150],
      ].map(([x, y], i) => (
        <rect key={i} x={x - 6} y={y - 6} width="12" height="12" rx="3" fill="#0a1422" stroke={node} strokeWidth="1.6" style={anim("viz-pulse", 1.6, i * 0.2)} />
      ))}
    </>
  ),
  retail: () => (
    <>
      <circle cx="160" cy="100" r="64" stroke={soft} strokeWidth="1.2" fill="none" />
      <circle cx="160" cy="100" r="36" stroke={soft} strokeWidth="1.2" fill="none" />
      <g style={{ transformOrigin: "160px 100px", ...anim("viz-orbit", 14, 0, "linear") }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i / 5) * Math.PI * 2;
          return <circle key={i} cx={160 + Math.cos(a) * 64} cy={100 + Math.sin(a) * 64} r="6" fill={i === 0 ? signal : "#0a1422"} stroke={node} strokeWidth="1.6" />;
        })}
      </g>
      <path d="M146 92h28l-4 18h-20z" fill="none" stroke={node} strokeWidth="1.8" strokeLinejoin="round" />
    </>
  ),
  manufacturing: () => (
    <>
      {[70, 52, 34].map((r, i) => (
        <circle key={r} cx="110" cy="104" r={r} fill="none" stroke={i ? soft : line} strokeWidth="1.4" strokeDasharray={i === 0 ? "10 8" : undefined} style={i === 0 ? { transformOrigin: "110px 104px", ...anim("viz-orbit", 18, 0, "linear") } : undefined} />
      ))}
      <path d="M210 160v-50l40-34 34 22" stroke={node} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="210" cy="110" r="7" fill="#0a1422" stroke={node} strokeWidth="2" />
      <circle cx="250" cy="76" r="7" fill="#0a1422" stroke={node} strokeWidth="2" />
      <circle cx="284" cy="98" r="5" fill={signal} style={anim("viz-pulse", 1.4)} />
    </>
  ),
  professional: () => (
    <>
      {[
        [40, 40],
        [150, 26],
        [250, 56],
        [90, 120],
        [210, 130],
      ].map(([x, y], i, all) => (
        <g key={i}>
          {i < all.length - 1 && <line x1={x + 24} y1={y + 16} x2={all[i + 1][0] + 24} y2={all[i + 1][1] + 16} stroke={line} strokeWidth="1.3" style={dash(2, i * 0.2)} />}
          <rect x={x} y={y} width="48" height="34" rx="6" fill="#0a1422" stroke={node} strokeWidth="1.4" />
          <rect x={x + 8} y={y + 10} width="26" height="3" rx="1.5" fill={soft} />
          <rect x={x + 8} y={y + 18} width="18" height="3" rx="1.5" fill={soft} />
        </g>
      ))}
    </>
  ),
  government: () => (
    <>
      <path d="M60 70l100-40 100 40z" fill="none" stroke={node} strokeWidth="1.8" strokeLinejoin="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={76 + i * 38} y="80" width="14" height="70" rx="2" fill="rgba(134,192,224,0.18)" stroke={line} strokeWidth="1.2" />
      ))}
      <path d="M52 160h216" stroke={node} strokeWidth="1.8" />
      <path d="M20 40c60 30 90-20 140 10s90 0 140-20" stroke={signal} strokeWidth="1.6" fill="none" style={dash(2.6)} />
    </>
  ),
  startups: () => (
    <>
      <path d="M20 170C90 168 140 140 180 100S250 30 300 18" stroke={line} strokeWidth="2" fill="none" style={dash(1.8)} />
      <path d="M20 170C110 166 170 150 300 110" stroke={soft} strokeWidth="1.4" fill="none" />
      {[
        [80, 160],
        [180, 100],
        [250, 46],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 2 ? 9 : 6} fill={i === 2 ? "#4a97c4" : "#0a1422"} stroke={node} strokeWidth={i === 2 ? 3 : 1.8} style={anim("viz-pulse", 1.8, i * 0.3)} />
      ))}
    </>
  ),
};

export function IndustryArt({ kind, className }: { kind: Art; className?: string }) {
  const View = arts[kind];
  return (
    <svg viewBox="0 0 320 190" preserveAspectRatio="xMidYMid slice" className={cx("viz", className)} aria-hidden="true" focusable="false">
      <View />
    </svg>
  );
}
