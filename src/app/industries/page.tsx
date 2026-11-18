import type { Metadata } from "next";
import { IndustryArt } from "@/components/industry-art";
import { PillarNode } from "@/components/journey";
import { Container, CtaBand, PageHero, Section } from "@/components/ui";
import { industries } from "@/content/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Technology and technical talent for financial services, healthcare, technology, retail, manufacturing, professional services, government and startups.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Different sectors. The same two needs."
        lead="Every industry we serve needs reliable technology and people who can build and operate it. Here is where each side of our work applies."
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
          <div className="grid gap-6 md:grid-cols-2">
            {industries.map((ind) => (
              <article
                key={ind.id}
                id={ind.id}
                className="group reveal overflow-hidden rounded-[var(--radius-panel)] bg-paper ring-1 ring-ink-100 transition-shadow hover:shadow-lift"
              >
                <div className="relative aspect-[16/7] overflow-hidden bg-gradient-to-br from-ink-900 to-ink-950">
                  <div aria-hidden="true" className="bg-grid-dark absolute inset-0 opacity-70" />
                  <IndustryArt kind={ind.art} className="absolute inset-0 h-full w-full transition-transform duration-[900ms] group-hover:scale-105" />
                  <h2 className="absolute bottom-5 left-6 text-[1.75rem] font-extrabold tracking-[-0.035em] text-white sm:left-8">{ind.name}</h2>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="leading-relaxed text-ink-600">{ind.summary}</p>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
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
                        <PillarNode pillar="talent" className="size-2.5" /> Talent
                      </h3>
                      <ul className="mt-3 space-y-2 text-[0.95rem] text-ink-800">
                        {ind.talent.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-ink-600">
            Working in another sector, such as education or logistics? The same approach applies. Tell us about your industry and its constraints.
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
