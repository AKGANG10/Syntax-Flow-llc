"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { Solution } from "@/content/capabilities";
import { Tilt } from "./effects";
import { PillarNode } from "./journey";
import { MiniViz } from "./mini-viz";
import { ArrowIcon, cx } from "./ui";

/** Interactive solution cards: live mini-visualization, tilt, expandable detail. */
export function SolutionsGrid({ items, tone = "light" }: { items: Solution[]; tone?: "light" | "dark" }) {
  const [open, setOpen] = useState<string | null>(null);
  const base = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const dark = tone === "dark";

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((s) => {
        const isOpen = open === s.id;
        const panel = `${base}-${s.id}`;
        return (
          <li key={s.id} className="reveal">
            <Tilt max={5} className={cx("group border-flow h-full rounded-[var(--radius-panel)]")}>
              <div
                data-open={isOpen ? "true" : undefined}
                className={cx(
                  "group relative flex h-full flex-col rounded-[var(--radius-panel)] p-6",
                  dark ? "bg-white/[0.04] ring-1 ring-white/10" : "bg-white shadow-soft ring-1 ring-ink-100",
                )}
              >
                <div className={cx("relative -mx-2 -mt-2 mb-5 overflow-hidden rounded-2xl", dark ? "bg-white/[0.03]" : "bg-paper")}>
                  <div aria-hidden="true" className={cx("absolute inset-0 mask-radial", dark ? "bg-grid-dark" : "bg-grid")} />
                  <MiniViz kind={s.viz} live={isOpen} className="relative mx-auto block h-32 w-full max-w-56" />
                </div>
                <p className={cx("t-label flex items-center gap-2", dark ? "text-ink-400" : "text-ink-500")}>
                  <PillarNode pillar={s.pillar} className="size-2.5" />
                  {s.pillar === "both" ? "Technology + Talent" : s.pillar === "talent" ? "Talent" : "Technology"}
                </p>
                <h3 className={cx("t-h3 mt-2", dark ? "text-white" : "text-ink-950")}>{s.title}</h3>
                <p className={cx("mt-2 flex-1 text-[0.95rem] leading-relaxed", dark ? "text-ink-300" : "text-ink-600")}>{s.summary}</p>

                <div className={cx("grid transition-[grid-template-rows] duration-[var(--duration-slow)] ease-[var(--ease-flow)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div id={panel} className="overflow-hidden" hidden={!isOpen}>
                    <ul className="space-y-2 pt-4">
                      {s.details.map((d) => (
                        <li key={d} className={cx("flex items-start gap-2.5 text-sm", dark ? "text-ink-200" : "text-ink-700")}>
                          <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-flow-500" />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <Link href={s.href} className={cx("mt-4 inline-flex items-center gap-1.5 text-sm font-semibold", dark ? "text-flow-300" : "text-flow-700")}>
                      <span className="strand-link">Explore {s.title}</span>
                      <ArrowIcon />
                    </Link>
                  </div>
                </div>

                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panel}
                  onClick={() => setOpen(isOpen ? null : s.id)}
                  data-cursor={isOpen ? "Close" : "Open"}
                  className={cx(
                    "mt-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    dark ? "bg-white/10 text-white hover:bg-white/15" : "bg-ink-50 text-ink-900 hover:bg-flow-100",
                  )}
                >
                  {isOpen ? "Less" : "Details"}
                  <span className="sr-only"> about {s.title}</span>
                  <svg viewBox="0 0 12 12" aria-hidden="true" className={cx("size-3 transition-transform duration-[var(--duration-normal)]", isOpen && "rotate-45")}>
                    <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </Tilt>
          </li>
        );
      })}
    </ul>
  );
}
