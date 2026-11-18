import type { Metadata } from "next";
import { PillarNode } from "@/components/journey";
import { Container, CtaBand, PageHero, Section } from "@/components/ui";
import { industries } from "@/content/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Technology and technical talent for healthcare, financial services, technology, retail and e-commerce, manufacturing, education, logistics and startups.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Different sectors. The same two needs."
        lead="Every industry we work in needs reliable technology and people who can build and operate it. Here is where each side of our work applies."
        motifSeed={43}
      />

      <Section tone="white" aria-label="Industry focus areas">
        <Container>
          <div className="mb-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-700">
            <span className="flex items-center gap-2.5">
              <PillarNode pillar="technology" className="size-4" /> Technology we bring
            </span>
            <span className="flex items-center gap-2.5">
              <PillarNode pillar="talent" className="size-4" /> Talent we find
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {industries.map((ind) => (
              <article key={ind.id} id={ind.id} className="reveal rounded-[var(--radius-panel)] bg-paper p-8 ring-1 ring-ink-100 sm:p-10">
                <h2 className="t-h3 text-ink-950">{ind.name}</h2>
                <p className="mt-2 leading-relaxed text-ink-600">{ind.summary}</p>
                <div className="mt-7 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="t-label flex items-center gap-2 text-flow-700">
                      <PillarNode pillar="technology" className="size-2.5" /> Technology
                    </h3>
                    <ul className="mt-3 space-y-2 text-[0.95rem] text-ink-800">
                      {ind.technology.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="t-label flex items-center gap-2 text-ink-700">
                      <PillarNode pillar="talent" className="size-2.5 border-2" /> Talent
                    </h3>
                    <ul className="mt-3 space-y-2 text-[0.95rem] text-ink-800">
                      {ind.talent.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-ink-600">
            Working in another sector? The same approach applies. Tell us about your industry and its constraints and we will tell you how we can help.
          </p>
        </Container>
      </Section>

      <CtaBand
        title="Talk to someone who understands your industry's constraints."
        actions={[
          { label: "Talk to an Expert", href: "/contact" },
          { label: "Find Talent", href: "/contact?need=talent" },
        ]}
      />
    </>
  );
}
