import type { Metadata } from "next";
import { ServicePillars } from "@/components/service-pillars";
import { SolutionsGrid } from "@/components/solutions-grid";
import { ButtonLink, Container, CtaBand, PageHero, Section, SectionHeading, cx } from "@/components/ui";
import { engagementModels, solutions } from "@/content/capabilities";

export const metadata: Metadata = {
  title: "Solutions: Technology, Talent and Transformation",
  description:
    "AI and intelligent automation, cloud, software engineering, data, digital transformation, cybersecurity, talent solutions and managed technology services from Syntax Flow.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Everything it takes to build, staff and scale."
        lead="IT services, IT consulting and US IT recruitment: eight capabilities, delivered separately or as one engagement."
        motifSeed={13}
      >
        <ButtonLink href="/contact">Start a Conversation</ButtonLink>
        <ButtonLink href="#all" variant="secondary" arrow={false}>
          See all eight
        </ButtonLink>
      </PageHero>

      <ServicePillars id="solutions-what" />

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
