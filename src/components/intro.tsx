import type { CSSProperties, ElementType } from "react";

/*
 * Server-rendered experience primitives (no client JavaScript):
 *   Intro          ~1.4s "node, network, identity" reveal, once per session
 *   ScrollProgress page progress bar on a CSS scroll timeline
 *   WordReveal     masked word-by-word heading reveal
 */

/** Runs before first paint: marks the intro as seen for the rest of the session. */
export const introScript = `try{var s=sessionStorage;if(s.getItem("sf-intro"))document.documentElement.dataset.intro="seen";else s.setItem("sf-intro","1")}catch(e){}`;

export function Intro() {
  const nodes: [number, number, number][] = [
    [40, 90, 0],
    [120, 52, 120],
    [200, 98, 220],
    [280, 60, 320],
  ];
  return (
    <div className="intro" aria-hidden="true">
      <svg viewBox="0 0 320 150" className="w-[min(70vw,22rem)]" fill="none">
        <path className="intro-line" d="M10 108 C 60 108, 80 52, 120 52 S 170 98, 200 98 S 250 60, 310 40" stroke="#86c0e0" strokeWidth="1.5" />
        <path className="intro-line" d="M10 70 C 70 70, 90 110, 140 104 S 220 50, 310 74" stroke="#2380ae" strokeWidth="1.2" style={{ animationDelay: "200ms" }} />
        {nodes.map(([cx, cy, d], i) => (
          <circle
            key={i}
            className="intro-node"
            cx={cx}
            cy={cy}
            r={i === 2 ? 11 : 6}
            fill={i === 2 ? "#4a97c4" : "#f6f9fb"}
            stroke="#15263b"
            strokeWidth={i === 2 ? 4 : 2}
            style={{ "--d": `${d + 200}ms` } as CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}

export function ScrollProgress() {
  return <div className="scroll-progress" aria-hidden="true" />;
}

/**
 * Heading whose words rise out of a mask. The full text stays in the DOM and
 * accessibility tree; only the visual words are split.
 */
export function WordReveal({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  accentFrom,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Index of the first word styled as the accent colour. */
  accentFrom?: number;
}) {
  const words = text.split(" ");
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            <span className="word-mask">
              <span className={accentFrom !== undefined && i >= accentFrom ? "text-flow-700" : undefined} style={{ "--i": i, "--d": `${delay}ms` } as CSSProperties}>
                {w}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
