import type { Metadata } from "next";
import { EcosystemMap } from "@/components/ecosystem-map";
import { Journey, JourneyLegend, PillarNode, type JourneyStep } from "@/components/journey";
import { PhotoFrame } from "@/components/photo-frame";
import { ButtonLink, Container, CtaBand, PageHero, Section, SectionHeading, cx } from "@/components/ui";
import { engagementModels } from "@/content/capabilities";

export const metadata: Metadata = {
  title: "Transformation: Technology and Talent in One Plan",
  description:
    "The right technology and the right people from one partner. Syntax Flow combines technology consulting and engineering with technical talent and dedicated teams.",
  alternates: { canonical: "/solutions/transformation" },
};

const journey: JourneyStep[] = [
  { title: "Business challenge", pillar: "both", text: "Start with the outcome the business needs, not with a technology or a headcount number." },
  { title: "Technology strategy", pillar: "technology", text: "Decide what to build, buy, modernize or retire, and in what order." },
  { title: "Solution architecture", pillar: "technology", text: "Design a system that is secure, maintainable and sized for real demand." },
  { title: "Engineering", pillar: "both", text: "Our engineers build it, joined by specialists recruited for the skills the work needs." },
  { title: "Technical talent", pillar: "talent", text: "Recruit the people who will own the platform: contract, permanent or a dedicated team." },
  { title: "Deployment", pillar: "technology", text: "Release through automated pipelines with monitoring and a rollback path." },
  { title: "Operations", pillar: "both", text: "Run, support and improve the system, with knowledge transferred to your team." },
  { title: "Scale", pillar: "both", text: "Grow capacity in the system and in the team at the same time." },
];

const reasons = [
  { title: "One accountable plan", text: "The roadmap and the hiring plan are written together, so the team you hire matches the system you are building." },
  { title: "No handoff gap", text: "The people who designed the system help choose and onboard the people who will run it." },
  { title: "Knowledge that stays", text: "Documentation, training and continuity are part of the engagement, not an afterthought." },
  { title: "Scale in both directions", text: "Add engineering capacity or new capabilities without starting a new vendor relationship." },
];

const transformNeeds = ["Architecture", "Engineering", "Cloud", "Cybersecurity", "Project leadership", "Technical specialists"];

export default function TechnologyTalentPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions / Transformation"
        title={
          <>
            The right technology.
            <br />
            The right people.
            <br />
            <span className="text-flow-700">One strategic partner.</span>
          </>
        }
        lead="Organizations rarely have just one problem. They need technology, and they need people capable of building and operating it. We solve both."
        motifSeed={31}
      >
        <ButtonLink href="/contact?need=transformation">Transform With Us</ButtonLink>
        <ButtonLink href="#journey" variant="secondary" arrow={false}>
          See the journey
        </ButtonLink>
      </PageHero>

      <Section tone="white" aria-labelledby="tt-challenges">
        <Container>
          <SectionHeading id="tt-challenges" eyebrow="Two challenges" title="Most technology problems are also people problems." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-[var(--radius-panel)] bg-flow-50 p-8 ring-1 ring-flow-100 sm:p-10">
              <PillarNode pillar="technology" className="size-5" />
              <h3 className="t-h3 mt-5 text-ink-950">1. You need technology.</h3>
              <p className="mt-2 leading-relaxed text-ink-600">A platform to build, a system to modernize, data to put to work, or an AI capability to add.</p>
            </div>
            <div className="rounded-[var(--radius-panel)] bg-ink-50 p-8 ring-1 ring-ink-100 sm:p-10">
              <PillarNode pillar="talent" className="size-5" />
              <h3 className="t-h3 mt-5 text-ink-950">2. You need people who can build and run it.</h3>
              <p className="mt-2 leading-relaxed text-ink-600">Engineers, architects and specialists who are hard to find, and harder to find quickly.</p>
            </div>
          </div>
          <blockquote className="mt-14 max-w-4xl border-l-2 border-flow-500 pl-6 sm:pl-8">
            <p className="text-[clamp(1.35rem,1.1rem+1vw,2rem)] leading-snug font-semibold tracking-[-0.02em] text-ink-900">
              Technology without the right people doesn&rsquo;t scale. Great people without the right technology can&rsquo;t reach their full
              potential. <span className="text-flow-700">We bring both together.</span>
            </p>
          </blockquote>
        </Container>
      </Section>

      <Section id="journey" aria-labelledby="tt-journey">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.3fr] lg:gap-20">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <SectionHeading
              id="tt-journey"
              eyebrow="The journey"
              title="From business challenge to scale."
              lead="Each step shows which side of the company leads. Most steps need both."
            />
            <div className="mt-8">
              <JourneyLegend />
            </div>
          </div>
          <Journey steps={journey} />
        </Container>
      </Section>

      <Section tone="white" aria-label="Transformation in practice" className="pt-0 sm:pt-0 lg:pt-0">
        <Container>
          <PhotoFrame name="transform" fallback="transformation" className="aspect-[21/9] w-full max-sm:aspect-[4/3]" sizes="(min-width: 1280px) 1200px, 100vw" />
        </Container>
      </Section>

      <Section tone="ink" aria-labelledby="tt-map">
        <Container>
          <SectionHeading
            id="tt-map"
            tone="dark"
            eyebrow="Technology × Talent × Outcomes"
            title="Plan the system and the team together."
            lead="Choose a technology to see the people it takes and the outcomes it supports."
          />
          <div className="mt-14">
            <EcosystemMap />
          </div>
        </Container>
      </Section>

      <Section tone="white" aria-labelledby="tt-ways">
        <Container>
          <SectionHeading id="tt-ways" eyebrow="Three ways to work with us" title="Build, scale or transform." />
          <ul className="mt-12 grid gap-5 lg:grid-cols-3">
            {engagementModels.map((m, i) => (
              <li key={m.id} className={cx("flex flex-col rounded-[var(--radius-panel)] p-8", i === 2 ? "bg-ink-950 text-white" : "bg-paper ring-1 ring-ink-100")}>
                <h3 className={cx("text-[1.75rem] font-extrabold tracking-[-0.03em]", i === 2 ? "text-white" : "text-ink-950")}>{m.name}</h3>
                <p className={cx("mt-2 flex-1", i === 2 ? "text-ink-300" : "text-ink-600")}>{m.headline}</p>
                <div className="mt-6">
                  <ButtonLink href={m.cta.href} variant={i === 2 ? "invert" : "primary"} size="sm">
                    {m.cta.label}
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section aria-labelledby="tt-transform">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              id="tt-transform"
              eyebrow="Example: Transform"
              title="Modernizing an existing platform."
              lead="A company needs to modernize a platform that the business depends on. That takes more than engineers, and more than a plan. We can provide every part of it from one team."
            />
            <p className="mt-6 text-sm text-ink-500">Illustrative example of the engagement model. Not a client case study.</p>
          </div>
          <ul className="grid content-start gap-3 sm:grid-cols-2">
            {transformNeeds.map((n) => (
              <li key={n} className="flex items-center gap-3 rounded-[var(--radius-card)] bg-white p-5 font-semibold text-ink-900 ring-1 ring-ink-100">
                <PillarNode pillar="both" className="size-4" />
                {n}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="white" aria-labelledby="tt-why">
        <Container>
          <SectionHeading id="tt-why" eyebrow="Why one partner" title="What changes when technology and talent share a plan." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <li key={r.title} className="reveal rounded-[var(--radius-card)] bg-paper p-6 ring-1 ring-ink-100">
                <h3 className="font-semibold text-ink-950">{r.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-600">{r.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        title="What are you trying to accomplish?"
        lead="Describe the outcome. We will map the technology and the team it takes."
        actions={[
          { label: "Transform With Us", href: "/contact?need=transformation" },
          { label: "Talk to an Expert", href: "/contact" },
        ]}
      />
    </>
  );
}
