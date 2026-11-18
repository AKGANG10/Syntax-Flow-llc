import type { Metadata } from "next";
import Link from "next/link";
import { PillarNode } from "@/components/journey";
import { SolutionsGrid } from "@/components/solutions-grid";
import { ArrowIcon, ButtonLink, Container, CtaBand, PageHero, Section, SectionHeading, cx } from "@/components/ui";
import { engagementModels, solutions } from "@/content/capabilities";

export const metadata: Metadata = {
  title: "Solutions: Technology, Talent and Transformation",
  description:
    "AI and intelligent automation, cloud, software engineering, data, digital transformation, cybersecurity, talent solutions and managed technology services from Syntax Flow.",
  alternates: { canonical: "/solutions" },
};

const paths = [
  { title: "Technology", text: "Engineering for AI, software, cloud, data and security.", href: "/solutions/technology", pillar: "technology" as const },
  { title: "Talent", text: "Recruiting, IT staffing and dedicated technical teams.", href: "/solutions/talent", pillar: "talent" as const },
  { title: "Transformation", text: "The system and the team in one plan.", href: "/solutions/transformation", pillar: "both" as const },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Everything it takes to build, staff and scale."
        lead="Eight capabilities across technology and talent, delivered separately or as one engagement."
        motifSeed={13}
      >
        <ButtonLink href="/contact">Start a Conversation</ButtonLink>
        <ButtonLink href="#all" variant="secondary" arrow={false}>
          See all eight
        </ButtonLink>
      </PageHero>

      <Section tone="white" aria-labelledby="solutions-paths">
        <Container>
          <SectionHeading id="solutions-paths" eyebrow="Three paths" title="Start from the side you need most." />
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {paths.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  data-cursor="Explore"
                  className="group border-flow flex h-full flex-col rounded-[var(--radius-panel)] bg-paper p-8 ring-1 ring-ink-100 transition-shadow hover:shadow-lift"
                >
                  <PillarNode pillar={p.pillar} className="size-5" />
                  <span className="mt-6 text-[1.75rem] font-extrabold tracking-[-0.035em] text-ink-950">{p.title}</span>
                  <span className="mt-2 flex-1 leading-relaxed text-ink-600">{p.text}</span>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-flow-700">
                    Explore <ArrowIcon className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="all" aria-labelledby="solutions-all" className="noise">
        <div aria-hidden="true" className="bg-grid mask-fade-y pointer-events-none absolute inset-0 opacity-60" />
        <Container className="relative">
          <SectionHeading id="solutions-all" eyebrow="All solutions" title="Eight capabilities, one standard." lead="Open a card for what is included." />
          <div className="mt-14">
            <SolutionsGrid items={solutions} />
          </div>
        </Container>
      </Section>

      <Section tone="ink" aria-labelledby="solutions-models">
        <Container>
          <SectionHeading id="solutions-models" tone="dark" eyebrow="Engagement" title="Build, scale or transform." />
          <ul className="mt-12 grid gap-5 lg:grid-cols-3">
            {engagementModels.map((m, i) => (
              <li key={m.id} className={cx("flex flex-col rounded-[var(--radius-panel)] p-8 ring-1", i === 2 ? "bg-flow-500/15 ring-flow-400/40" : "bg-white/[0.04] ring-white/10")}>
                <h3 className="text-[1.75rem] font-extrabold tracking-[-0.03em] text-white">{m.name}</h3>
                <p className="mt-2 flex-1 text-ink-300">{m.headline}</p>
                <div className="mt-6">
                  <ButtonLink href={m.cta.href} variant={i === 2 ? "invert" : "outline-invert"} size="sm">
                    {m.cta.label}
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        title="Not sure which path fits?"
        lead="Describe the outcome you need. We will map the technology and the team it takes."
        actions={[
          { label: "Start a Conversation", href: "/contact" },
          { label: "Talk to an Expert", href: "/contact?need=both" },
        ]}
      />
    </>
  );
}
