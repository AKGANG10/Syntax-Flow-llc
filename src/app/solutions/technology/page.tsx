import type { Metadata } from "next";
import { ButtonLink, Container, CtaBand, PageHero, Section, SectionHeading, TextLink } from "@/components/ui";
import { technologyCapabilities } from "@/content/capabilities";

export const metadata: Metadata = {
  title: "Technology Solutions: AI, Software, Cloud, Data and Security",
  description:
    "AI and intelligent systems, software engineering, cloud and DevOps, data and analytics, cybersecurity and automation from Syntax Flow.",
  alternates: { canonical: "/solutions/technology" },
};

const delivery = [
  { title: "Discover", text: "We start with the business outcome, the users and the constraints, then agree on what success means before any code is written." },
  { title: "Architect", text: "We choose the simplest architecture that safely meets the real requirements, and document why." },
  { title: "Engineer", text: "Small, reviewed, tested increments you can see working, rather than a big reveal at the end." },
  { title: "Secure", text: "Access control, data protection and dependency hygiene are part of the design, not a final checklist." },
  { title: "Deploy", text: "Automated pipelines, separate environments and a rollback path for every release." },
  { title: "Operate", text: "Monitoring, maintenance and the people to keep improving it, from our team or yours." },
];

const models = [
  { title: "Project delivery", text: "A defined outcome, delivered end to end by a Syntax Flow team." },
  { title: "Team extension", text: "Our engineers work inside your team, on your roadmap and your tools." },
  { title: "Advisory", text: "Architecture, security and modernization guidance before you commit to a build." },
];

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions / Technology"
        title="Technology built to last beyond launch."
        lead="We help organizations build, modernize and scale digital systems, from AI and data platforms to cloud infrastructure and secure enterprise software."
        motifSeed={11}
      >
        <ButtonLink href="/contact?need=technology">Build With Us</ButtonLink>
        <ButtonLink href="/solutions/technology-talent" variant="secondary">
          Technology + Talent
        </ButtonLink>
      </PageHero>

      <Section tone="white" aria-labelledby="tech-areas">
        <Container>
          <SectionHeading id="tech-areas" eyebrow="Capability areas" title="Six areas, one engineering standard." />
          <div className="mt-14 divide-y divide-ink-100 border-y border-ink-100">
            {technologyCapabilities.map((c, i) => (
              <article key={c.id} id={c.id} className="grid gap-6 py-10 lg:grid-cols-[0.9fr_1.4fr] lg:gap-16 lg:py-12">
                <div>
                  <p className="t-label text-flow-700">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="t-h3 mt-3 text-ink-950">{c.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-600">{c.summary}</p>
                </div>
                <ul className="grid content-start gap-x-8 gap-y-3 sm:grid-cols-2">
                  {c.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-ink-800">
                      <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-full bg-flow-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="tech-delivery">
        <Container>
          <SectionHeading
            id="tech-delivery"
            eyebrow="How we deliver"
            title="A delivery process you can inspect."
            lead="Every engagement follows the same discipline, scaled to the size and risk of the work."
          />
          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {delivery.map((d, i) => (
              <li key={d.title} className="reveal rounded-[var(--radius-card)] bg-white p-7 ring-1 ring-ink-100">
                <p className="t-label text-flow-700">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="t-h3 mt-3 text-ink-950">{d.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{d.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="white" aria-labelledby="tech-models">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            id="tech-models"
            eyebrow="Engagement models"
            title="Work with us the way your organization works."
            lead="Need people to run what we build, or to join your team while we build it? Our talent division works alongside every technology engagement."
          />
          <div>
            <ul className="space-y-4">
              {models.map((m) => (
                <li key={m.title} className="rounded-[var(--radius-card)] bg-paper p-6 ring-1 ring-ink-100">
                  <h3 className="font-semibold text-ink-950">{m.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink-600">{m.text}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <TextLink href="/solutions/talent">Explore talent solutions</TextLink>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        title="What are you trying to build?"
        lead="Tell us about the problem. We will come back with questions, not a sales deck."
        actions={[
          { label: "Build With Us", href: "/contact?need=technology" },
          { label: "Talk to an Expert", href: "/contact?need=both" },
        ]}
      />
    </>
  );
}
