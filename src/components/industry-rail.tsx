"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";
import type { Industry } from "@/content/industries";
import { useMediaQuery, useScrollProgress } from "@/lib/motion";
import { IndustryArt } from "./industry-art";
import { ArrowIcon, Container, Eyebrow, cx } from "./ui";

/**
 * Spatial industry experience. Desktop with motion: the section pins and the
 * card track moves horizontally with vertical scroll (native scroll, no
 * hijacking). Touch, narrow screens and reduced motion: a swipeable,
 * scroll-snapping row that keyboard users can also tab through.
 */
export function IndustryRail({ items }: { items: Industry[] }) {
  const pinned = useMediaQuery("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", false);
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    if (!pinned || !track.current) return;
    const el = track.current;
    const measure = () => setTravel(Math.max(0, el.scrollWidth - el.clientWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, [pinned]);

  // Keyboard users: a focused card must come into view via the page scroll that drives
  // the rail, not via the browser scrolling the clipped container sideways.
  const onFocusCapture = (e: FocusEvent<HTMLUListElement>) => {
    if (!pinned || !section.current || !track.current) return;
    const card = (e.target as HTMLElement).closest("li");
    const sticky = track.current.parentElement;
    if (sticky) sticky.scrollLeft = 0;
    if (!card || travel <= 0) return;
    const p = Math.min(1, Math.max(0, (card.offsetLeft - track.current.offsetLeft) / travel));
    const top = section.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + p * (section.current.offsetHeight - window.innerHeight), behavior: "auto" });
  };

  useScrollProgress(
    section,
    useCallback(
      (p: number) => {
        if (pinned && track.current) track.current.style.transform = `translate3d(${(-p * travel).toFixed(1)}px,0,0)`;
      },
      [pinned, travel],
    ),
  );

  return (
    <section
      ref={section}
      aria-labelledby="industries-title"
      className="relative bg-ink-950 text-white"
      style={pinned ? { height: `calc(100dvh + ${travel}px)` } : undefined}
    >
      <div className={cx("overflow-hidden", pinned ? "sticky top-0 flex h-dvh flex-col justify-center" : "py-20")}>
        <Container>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <Eyebrow tone="dark">Industries</Eyebrow>
              <h2 id="industries-title" className="t-h2 mt-4 text-white">
                Different sectors. The same two needs.
              </h2>
            </div>
            <Link href="/industries" className="group inline-flex items-center gap-1.5 font-semibold text-flow-300">
              <span className="strand-link">All industries</span>
              <ArrowIcon className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Container>
        <ul
          ref={track}
          onFocusCapture={onFocusCapture}
          className={cx(
            "mt-10 flex gap-5 px-5 will-change-transform sm:px-8 lg:px-[max(3rem,calc((100vw-78rem)/2+3rem))]",
            !pinned && "snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:thin]",
          )}
        >
          {items.map((ind) => (
            <li key={ind.id} className="w-[min(82vw,24rem)] shrink-0 snap-start">
              <Link
                href={`/industries#${ind.id}`}
                data-cursor="View"
                className="group block h-full overflow-hidden rounded-[var(--radius-panel)] bg-white/[0.04] ring-1 ring-white/10 transition-[background-color,box-shadow] hover:bg-white/[0.07] hover:ring-flow-400/50"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-ink-900 to-ink-950">
                  <div aria-hidden="true" className="bg-grid-dark absolute inset-0 opacity-70" />
                  <IndustryArt kind={ind.art} className="absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-[var(--ease-flow)] group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="t-h3 text-white">{ind.name}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-300">{ind.summary}</p>
                  <p className="mt-5 flex flex-wrap gap-1.5">
                    {ind.technology.slice(0, 2).map((t) => (
                      <span key={t} className="rounded-full bg-flow-500/15 px-2.5 py-1 text-xs text-flow-200">
                        {t}
                      </span>
                    ))}
                    {ind.talent.slice(0, 1).map((t) => (
                      <span key={t} className="rounded-full px-2.5 py-1 text-xs text-ink-200 ring-1 ring-inset ring-white/20">
                        {t}
                      </span>
                    ))}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
