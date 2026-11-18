import Link from "next/link";
import type { ReactNode } from "react";
import { PillarNode } from "./journey";
import { ArrowIcon, Container, Eyebrow, cx } from "./ui";

/**
 * Says plainly what kind of company Syntax Flow is: an IT services and IT
 * consulting company and a US IT recruitment firm (owner direction,
 * 2026-11-18). Used on the home and solutions pages.
 */
const pillars = [
  {
    name: "IT Services",
    lead: "We design, build, secure and run your systems.",
    items: ["Custom software and SaaS", "Cloud, DevOps and infrastructure", "Data, analytics and AI", "Cybersecurity", "Managed technology services"],
    href: "/solutions/technology",
    cta: "Explore IT services",
    pillar: "technology" as const,
  },
  {
    name: "IT Consulting",
    lead: "Strategy, architecture and transformation advice you can act on.",
    items: ["Technology strategy and roadmaps", "Solution and cloud architecture", "Modernization and digital transformation", "Security and compliance advisory", "Delivery and program leadership"],
    href: "/solutions/transformation",
    cta: "Explore IT consulting",
    pillar: "both" as const,
  },
  {
    name: "IT Recruitment",
    tag: "USA",
    lead: "Technical recruiting and IT staffing for US organizations.",
    items: ["Contract and contract-to-hire", "Direct hire and executive search", "Dedicated engineering teams", "Cloud, data, AI and security specialists", "Technical workforce planning"],
    href: "/solutions/talent",
    cta: "Explore IT recruitment",
    pillar: "talent" as const,
  },
];

export function ServicePillars({
  id,
  tone = "white",
  headingLevel = "h2",
  image,
}: {
  id: string;
  tone?: "white" | "paper";
  headingLevel?: "h2" | "h3";
  /** Optional wide visual between the heading and the pillars. */
  image?: ReactNode;
}) {
  const H = headingLevel;
  return (
    <section aria-labelledby={id} className={cx("relative py-20 sm:py-24", tone === "white" ? "bg-white" : "bg-paper")}>
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>What we do</Eyebrow>
          <H id={id} className="t-h2 mt-4 text-ink-950">
            An IT services, IT consulting and US IT recruitment company.
          </H>
          <p className="t-lead mt-5 text-ink-600">One partner for the systems you need and the technical people who build and run them, headquartered in Dallas, Texas.</p>
        </div>
        {image ? <div className="mt-12">{image}</div> : null}
        <ul className={cx("grid gap-5 lg:grid-cols-3", image ? "mt-8" : "mt-14")}>
          {pillars.map((p) => (
            <li key={p.name}>
              <Link
                href={p.href}
                data-cursor="Explore"
                className="group border-flow flex h-full flex-col rounded-[var(--radius-panel)] bg-paper p-8 ring-1 ring-ink-100 transition-shadow hover:shadow-lift"
              >
                <span className="flex items-center gap-3">
                  <PillarNode pillar={p.pillar} className="size-5" />
                  {p.tag && <span className="rounded-full bg-ink-950 px-2.5 py-0.5 font-mono text-[0.65rem] tracking-[0.14em] text-white">{p.tag}</span>}
                </span>
                <span className="mt-6 text-[1.9rem] leading-none font-extrabold tracking-[-0.04em] text-ink-950">{p.name}</span>
                <span className="mt-3 leading-relaxed text-ink-600">{p.lead}</span>
                <span className="mt-6 flex-1 space-y-2.5">
                  {p.items.map((it) => (
                    <span key={it} className="flex items-start gap-2.5 text-[0.95rem] text-ink-800">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-flow-500" />
                      {it}
                    </span>
                  ))}
                </span>
                <span className="mt-8 inline-flex items-center gap-1.5 font-semibold text-flow-700">
                  {p.cta} <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
