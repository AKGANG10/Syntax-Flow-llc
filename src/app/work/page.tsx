import type { Metadata } from "next";
import { PillarNode } from "@/components/journey";
import { ContentPending, Container, CtaBand, PageHero, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Work: Case Studies",
  description: "Technology projects and talent success stories from Syntax Flow, published only with client permission and verified results.",
  alternates: { canonical: "/work" },
};

const technologyFormat = ["Challenge", "Strategy", "Architecture", "Technology", "Implementation", "Security", "Results"];
const talentFormat = ["Client requirement", "Talent challenge", "Sourcing strategy", "Candidate profile", "Time to fill", "Quality", "Retention", "Business outcome"];

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Results we can stand behind."
        lead="We publish case studies only with our clients' permission, and only with numbers we have verified. Every story here follows the same structure so you can compare like with like."
        motifSeed={53}
      />

      <Section tone="white" aria-labelledby="work-formats">
        <Container>
          <SectionHeading id="work-formats" eyebrow="How we report" title="Two kinds of case study." />
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[var(--radius-panel)] bg-flow-50 p-8 ring-1 ring-flow-100 sm:p-10">
              <PillarNode pillar="technology" className="size-5" />
              <h3 className="t-h3 mt-5 text-ink-950">Technology projects</h3>
              <ol className="mt-6 flex flex-wrap gap-2">
                {technologyFormat.map((s, i) => (
                  <li key={s} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-ink-800 ring-1 ring-flow-100">
                    <span className="font-mono text-xs text-flow-700">{i + 1}</span> {s}
                  </li>
                ))}
              </ol>
            </article>
            <article className="rounded-[var(--radius-panel)] bg-ink-50 p-8 ring-1 ring-ink-100 sm:p-10">
              <PillarNode pillar="talent" className="size-5" />
              <h3 className="t-h3 mt-5 text-ink-950">Talent success stories</h3>
              <ol className="mt-6 flex flex-wrap gap-2">
                {talentFormat.map((s, i) => (
                  <li key={s} className="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-ink-800 ring-1 ring-ink-100">
                    <span className="font-mono text-xs text-ink-600">{i + 1}</span> {s}
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="work-stories">
        <Container>
          <SectionHeading id="work-stories" eyebrow="Case studies" title="Published case studies" lead="New stories appear here as clients approve them." />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <ContentPending title="Technology case study" note="Supply an approved project with verified results. Format: challenge, strategy, architecture, technology, implementation, security, results." />
            <ContentPending title="Talent success story" note="Supply an approved placement with real time-to-fill, quality and retention figures." />
            <ContentPending title="Technology + Talent engagement" note="Supply an approved engagement where Syntax Flow delivered the solution and staffed the team." />
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Have a challenge worth writing about?"
        actions={[
          { label: "Start a Conversation", href: "/contact" },
          { label: "Find Talent", href: "/contact?need=talent" },
        ]}
      />
    </>
  );
}
