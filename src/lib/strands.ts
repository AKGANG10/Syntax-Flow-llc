/**
 * Strand geometry shared by the animated hero (canvas) and static SVG motifs.
 *
 * It encodes the logo's structure:
 *   - a bundle of fine blue strands (technology) that pinch together at
 *     convergence points and fan out between them;
 *   - a few bold navy "lead" strands with open ring nodes (people) that weave
 *     through the bundle;
 *   - the whole field rising toward the right (growth).
 *
 * All functions are pure and deterministic so server-rendered SVG and the
 * client canvas produce the same shapes.
 */

export type Strand = {
  /** Position inside the bundle, -1 (top) to 1 (bottom). */
  offset: number;
  phase: number;
  freq: number;
  alpha: number;
  /** 0 = light sky, 1 = navy. */
  depth: number;
};

export type LeadStrand = { amp: number; freq: number; phase: number; speed: number };

/** Small seeded PRNG so layouts are stable between server and client. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeBundle(count: number, seed = 7): Strand[] {
  const rnd = seeded(seed);
  return Array.from({ length: count }, (_, i) => {
    const offset = count === 1 ? 0 : -1 + (2 * i) / (count - 1);
    return {
      offset,
      phase: rnd() * Math.PI * 2,
      freq: 0.8 + rnd() * 0.7,
      alpha: 0.2 + rnd() * 0.42,
      depth: Math.min(1, Math.max(0, (offset + 1) / 2 + (rnd() - 0.5) * 0.35)),
    };
  });
}

export const defaultLeads: LeadStrand[] = [
  { amp: 0.34, freq: 1.55, phase: 0.6, speed: 0.22 },
  { amp: 0.26, freq: 1.2, phase: 2.7, speed: -0.17 },
  { amp: 0.2, freq: 2.05, phase: 4.4, speed: 0.13 },
];

const PINCH_FREQ = 3.1;
const FIRST_PINCH = 0.17;

/** Bundle width envelope: near zero at convergence points, wide between them. */
export function envelope(x: number) {
  return 0.06 + 0.94 * Math.abs(Math.sin(Math.PI * PINCH_FREQ * (x - FIRST_PINCH)));
}

/** Centre line (0 to 1 of height), rising toward the right like the logo. */
export function centre(x: number, t: number) {
  const rise = -0.16 * smoothstep(0.45, 1, x);
  const sway = 0.045 * Math.sin(Math.PI * 2 * 0.9 * x + t * 0.35);
  return 0.56 + rise + sway;
}

export function bundleY(s: Strand, x: number, t: number, spread: number) {
  const e = envelope(x);
  // Ribbon twist: phase follows position in the bundle, so neighbours stay near-parallel.
  const twist = 0.12 * Math.sin(Math.PI * 2 * 1.05 * x + s.offset * 0.9 + t * 0.45);
  // A small individual drift keeps it organic without tangling.
  const drift = 0.03 * Math.sin(Math.PI * 2 * s.freq * x + s.phase + t * 0.3);
  return centre(x, t) + e * spread * (s.offset * 0.82 + twist + drift);
}

export function leadY(l: LeadStrand, x: number, t: number, spread: number) {
  const e = 0.3 + 0.7 * envelope(x);
  return centre(x, t) + e * spread * l.amp * 1.7 * Math.sin(Math.PI * 2 * l.freq * x + l.phase + t * l.speed);
}

export function smoothstep(a: number, b: number, x: number) {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
}

/** Linear blend of two hex colours, returned as "r, g, b". */
export function mixRgb(a: string, b: string, k: number) {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  return pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(", ");
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const palette = {
  sky: "#86c0e0",
  steel: "#2380ae",
  navy: "#15263b",
};

/** Colour for a bundle strand by depth: sky, then steel, then navy. */
export function strandRgb(depth: number) {
  return depth < 0.55 ? mixRgb(palette.sky, palette.steel, depth / 0.55) : mixRgb(palette.steel, palette.navy, (depth - 0.55) / 0.45);
}

/** SVG path data for a function sampled across a width. */
export function samplePath(fn: (x: number) => number, width: number, height: number, steps = 96) {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const xn = i / steps;
    const x = (xn * width).toFixed(1);
    const y = (fn(xn) * height).toFixed(1);
    d += i === 0 ? `M${x} ${y}` : `L${x} ${y}`;
  }
  return d;
}
