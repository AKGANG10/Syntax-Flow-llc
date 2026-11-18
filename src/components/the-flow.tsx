"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import type { FlowStep } from "@/content/capabilities";
import { useScrollProgress } from "@/lib/motion";
import { PillarNode } from "./journey";
import { Container, Eyebrow, cx } from "./ui";

const pillarLabel = { technology: "Technology leads", talent: "Talent leads", both: "Technology + Talent" } as const;

/**
 * Signature section. Desktop: the section pins while six steps advance with
 * scroll; the flow line fills, the active node changes, copy, imagery and
 * supporting cards transition. Mobile: the same steps as a stacked story.
 * All step content stays in the DOM in reading order for assistive tech.
 */
export function TheFlow({ steps, media }: { steps: readonly FlowStep[]; media: ReactNode[] }) {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const n = steps.length;

  useScrollProgress(
    section,
    useCallback(
      (p: number) => {
        rail.current?.style.setProperty("--p", p.toFixed(4));
        setActive((prev) => {
          const next = Math.min(n - 1, Math.floor(p * n * 0.999));
          return next === prev ? prev : next;
        });
      },
      [n],
    ),
  );

  const goTo = (i: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (span * (i + 0.5)) / n, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <section ref={section} aria-labelledby="flow-title" className="noise relative bg-ink-950 text-white lg:h-[560vh]">
      <div aria-hidden="true" className="bg-grid-dark mask-fade-y pointer-events-none absolute inset-0" />
      <div className="lg:sticky lg:top-0 lg:flex lg:h-dvh lg:items-center">
        <div aria-hidden="true" className="pointer-events-none absolute top-1/3 left-1/2 hidden size-[42rem] -translate-x-1/2 rounded-full bg-flow-600/20 blur-[140px] lg:block" />
        <Container className="relative py-20 lg:py-0">
          <div className="max-w-2xl">
            <Eyebrow tone="dark">The Flow</Eyebrow>
            <h2 id="flow-title" className="t-h2 mt-4 text-white">
              Six steps from first question to lasting change.
            </h2>
          </div>

          {/* Desktop: pinned, scroll-driven */}
          <div className="mt-12 hidden grid-cols-[13rem_1fr_1.1fr] gap-12 lg:grid xl:gap-16">
            <div ref={rail} className="relative self-start" style={{ ["--p" as string]: 0 }}>
              <span aria-hidden="true" className="absolute top-3 bottom-3 left-[0.6875rem] w-0.5 rounded-full bg-white/10" />
              <span aria-hidden="true" className="absolute top-3 bottom-3 left-[0.6875rem] w-0.5 origin-top scale-y-[var(--p)] rounded-full bg-gradient-to-b from-flow-400 to-signal-400" />
              <ol className="relative space-y-7">
                {steps.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === active ? "step" : undefined}
                      className="group flex items-center gap-4 rounded-lg text-left"
                    >
                      <span
                        aria-hidden="true"
                        className={cx(
                          "relative z-10 flex size-6 items-center justify-center rounded-full border-2 transition-all duration-[var(--duration-slow)]",
                          i === active ? "scale-110 border-signal-400 bg-flow-500 shadow-[0_0_0_6px_rgb(70_210_230/0.15)]" : i < active ? "border-flow-400 bg-ink-950" : "border-white/25 bg-ink-950",
                        )}
                      />
                      <span className={cx("font-mono text-xs tracking-[0.14em] uppercase transition-colors", i === active ? "text-white" : "text-ink-400 group-hover:text-ink-200")}>
                        {String(i + 1).padStart(2, "0")} {s.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative min-h-[22rem]">
              {steps.map((s, i) => (
                <article
                  key={s.id}
                  className={cx(
                    "absolute inset-0 transition-[opacity,transform] duration-[var(--duration-slow)] ease-[var(--ease-flow)]",
                    i === active ? "translate-y-0 opacity-100" : i < active ? "-translate-y-6 opacity-0" : "translate-y-6 opacity-0",
                  )}
                >
                  <p aria-hidden="true" className="font-mono text-[5.5rem] leading-none font-medium text-transparent [-webkit-text-stroke:1px_rgb(134_192_224/0.4)]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-[clamp(2rem,1.4rem+1.6vw,3rem)] font-extrabold tracking-[-0.04em]">{s.title}</h3>
                  <p className="mt-2 text-xl font-semibold text-flow-300">{s.lead}</p>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-300">{s.text}</p>
                  <p className="t-label mt-6 flex items-center gap-2 text-ink-400">
                    <PillarNode pillar={s.pillar} className="size-3" />
                    {pillarLabel[s.pillar]}
                  </p>
                </article>
              ))}
            </div>

            <div className="relative aspect-[4/3.4]">
              {steps.map((s, i) => (
                <div
                  key={s.id}
                  className={cx(
                    "absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[var(--ease-flow)]",
                    i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
                  )}
                  aria-hidden={i !== active}
                >
                  {media[i]}
                  <ul className="absolute right-4 bottom-4 left-4 flex flex-wrap gap-2">
                    {s.points.map((pt, j) => (
                      <li
                        key={pt}
                        className={cx(
                          "rounded-full bg-ink-950/75 px-3.5 py-1.5 text-sm text-white ring-1 ring-white/15 backdrop-blur-md transition-[opacity,transform] duration-[var(--duration-slow)]",
                          i === active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                        )}
                        style={{ transitionDelay: `${150 + j * 90}ms` }}
                      >
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile and tablet: stacked story */}
          <ol className="mt-12 space-y-14 lg:hidden">
            {steps.map((s, i) => (
              <li key={s.id} className="reveal">
                <div className="aspect-[4/3]">{media[i]}</div>
                <p className="t-label mt-6 flex items-center gap-2 text-flow-300">
                  <PillarNode pillar={s.pillar} className="size-3" />
                  {String(i + 1).padStart(2, "0")} · {pillarLabel[s.pillar]}
                </p>
                <h3 className="mt-3 text-3xl font-extrabold tracking-[-0.035em]">{s.title}</h3>
                <p className="mt-1 text-lg font-semibold text-flow-300">{s.lead}</p>
                <p className="mt-3 leading-relaxed text-ink-300">{s.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </div>
    </section>
  );
}
