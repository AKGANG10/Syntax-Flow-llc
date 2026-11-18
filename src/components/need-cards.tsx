"use client";

import Link from "next/link";
import type { VizKind } from "@/content/capabilities";
import { Tilt } from "./effects";
import { PillarNode, type Pillar } from "./journey";
import { MiniViz } from "./mini-viz";
import { ArrowIcon, cx } from "./ui";

const needs: { id: string; title: string; text: string; details: string[]; href: string; cta: string; pillar: Pillar; viz: VizKind }[] = [
  {
    id: "technology",
    title: "Technology",
    text: "Build and modernize your digital foundation.",
    details: ["AI, software and data platforms", "Cloud, DevOps and security", "Modernization of what you already run"],
    href: "/contact?need=technology",
    cta: "Build With Us",
    pillar: "technology",
    viz: "cloud",
  },
  {
    id: "talent",
    title: "Talent",
    text: "Access exceptional technical professionals.",
    details: ["Specialists and contract talent", "Direct hire and contract-to-hire", "Complete dedicated teams"],
    href: "/contact?need=talent",
    cta: "Find Talent",
    pillar: "talent",
    viz: "talent",
  },
  {
    id: "both",
    title: "Both",
    text: "Combine technology and talent to accelerate transformation.",
    details: ["One plan for the system and the team", "No handoff gap between build and run", "Capacity that scales on both sides"],
    href: "/contact?need=both",
    cta: "Transform With Us",
    pillar: "both",
    viz: "transformation",
  },
];

/** Premium path selector: tilt, flowing border, expansion on hover or focus. */
export function NeedCards({ className }: { className?: string }) {
  return (
    <ul className={cx("grid gap-4 md:grid-cols-3", className)}>
      {needs.map((n) => (
        <li key={n.id}>
          <Tilt className="group border-flow h-full rounded-[var(--radius-panel)]">
            <div className="glass relative flex h-full flex-col rounded-[var(--radius-panel)] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="t-label flex items-center gap-2 text-ink-500">
                    <PillarNode pillar={n.pillar} className="size-3" /> I need
                  </p>
                  <h3 className="mt-3 text-[1.6rem] font-extrabold tracking-[-0.035em] text-ink-950">{n.title}</h3>
                </div>
                <MiniViz kind={n.viz} className="-mt-1 -mr-2 w-28 shrink-0 opacity-90 transition-transform duration-[var(--duration-slow)] group-hover:scale-105" />
              </div>
              <p className="mt-2 leading-relaxed text-ink-600">{n.text}</p>
              <div className="grid transition-[grid-template-rows] duration-[var(--duration-slow)] ease-[var(--ease-flow)] max-lg:grid-rows-[1fr] lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-within:grid-rows-[1fr]">
                <ul className="overflow-hidden">
                  {n.details.map((d) => (
                    <li key={d} className="flex items-center gap-2.5 pt-2.5 text-sm text-ink-700 first:pt-4">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-flow-500" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={n.href}
                data-cursor="Start"
                className="mt-6 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-ink-950 after:absolute after:inset-0 after:rounded-[var(--radius-panel)] after:content-['']"
              >
                <span className="strand-link">{n.cta}</span>
                <ArrowIcon className="transition-transform duration-[var(--duration-normal)] group-hover:translate-x-1" />
              </Link>
            </div>
          </Tilt>
        </li>
      ))}
    </ul>
  );
}
