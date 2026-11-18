import type { Metadata } from "next";
import Link from "next/link";
import { PhotoFrame } from "@/components/photo-frame";
import { TalentEquation, TalentNetwork } from "@/components/talent-network";
import { ButtonLink, Container, CtaBand, Eyebrow, PageHero, Section, SectionHeading } from "@/components/ui";
import { talentCapabilities } from "@/content/capabilities";

export const metadata: Metadata = {
  title: "Talent Solutions: Technical Recruiting, IT Staffing and Dedicated Teams",
  description:
    "Technical recruiting, IT staffing, contract and direct hire, dedicated engineering teams and workforce solutions from Syntax Flow.",
  alternates: { canonical: "/solutions/talent" },
};

const engagementTypes = [
  { title: "Contract", text: "Specialists for a defined period or project, without adding permanent headcount." },
  { title: "Contract-to-hire", text: "Work together first, then convert when both sides are confident." },
  { title: "Direct hire", text: "Permanent placement for roles that need a long-term owner." },
  { title: "Dedicated team", text: "A complete, managed team aligned to your roadmap." },
];

const process = [
  { title: "Intake", text: "We learn the role, the team, the technology and what good looks like in your environment." },
  { title: "Calibration", text: "We agree on must-have and nice-to-have skills, level, location and budget before sourcing." },
  { title: "Sourcing", text: "We search our network and the wider market for people who fit the work, not just the keywords." },
  { title: "Technical screening", text: "Candidates are assessed against the real requirements of the role." },
  { title: "Shortlist", text: "You see a focused shortlist with clear notes on each candidate's strengths and gaps." },
  { title: "Interviews and offer", text: "We coordinate interviews, feedback and offers so good candidates are not lost to delays." },
  { title: "Onboarding and follow-up", text: "We stay in touch after the start date to make sure the placement is working." },
];

export default function TalentPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions / Talent"
        title="Find the people who can build it."
        lead="We help organizations find, deploy and manage the technical people they need, from a single specialist to a complete team."
        motifSeed={23}
      >
        <ButtonLink href="/contact?need=talent">Find Talent</ButtonLink>
        <ButtonLink href="/careers" variant="secondary">
          I am looking for a role
        </ButtonLink>
      </PageHero>

      <Section tone="white" aria-labelledby="talent-services">
        <Container>
          <SectionHeading id="talent-services" eyebrow="Services" title="Talent services for technical organizations." />
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {talentCapabilities.map((c) => (
              <article key={c.id} id={c.id} className="reveal rounded-[var(--radius-panel)] bg-paper p-8 ring-1 ring-ink-100 sm:p-10">
                <span aria-hidden="true" className="block size-3.5 rounded-full border-2 border-ink-800" />
                <h3 className="t-h3 mt-5 text-ink-950">{c.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{c.summary}</p>
                <ul className="mt-6 space-y-2.5">
                  {c.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-ink-800">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-ink-700" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="talent-types">
        <Container>
          <SectionHeading id="talent-types" eyebrow="Engagement types" title="Hire the way the role demands." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {engagementTypes.map((t) => (
              <li key={t.title} className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink-100">
                <h3 className="font-semibold text-ink-950">{t.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-600">{t.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="ink" aria-labelledby="talent-network" className="noise overflow-hidden">
        <div aria-hidden="true" className="bg-grid-dark mask-fade-y pointer-events-none absolute inset-0" />
        <Container className="relative">
          <Eyebrow tone="dark">People flow</Eyebrow>
          <h2 id="talent-network" className="sr-only">
            Roles we recruit
          </h2>
          <div className="mt-6">
            <TalentEquation />
          </div>
          <div className="mt-14">
            <TalentNetwork />
          </div>
        </Container>
      </Section>

      <Section tone="white" aria-label="Recruiting in practice" className="pb-0 sm:pb-0 lg:pb-0">
        <Container>
          <PhotoFrame name="colleagues" fallback="talent" className="aspect-[21/9] w-full max-sm:aspect-[4/3]" sizes="(min-width: 1280px) 1200px, 100vw" />
        </Container>
      </Section>

      <Section tone="white" aria-labelledby="talent-process">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <SectionHeading
              id="talent-process"
              eyebrow="How we recruit"
              title="Recruiting run by people who understand the work."
              lead="Technical hiring fails when the recruiter cannot tell a strong engineer from a strong resume. Our process is built around the role's real requirements."
            />
          </div>
          <ol className="space-y-3">
            {process.map((p, i) => (
              <li key={p.title} className="reveal flex gap-5 rounded-[var(--radius-card)] bg-paper p-6 ring-1 ring-ink-100">
                <span className="t-label pt-1 text-flow-700">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-semibold text-ink-950">{p.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink-600">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section aria-labelledby="talent-candidates">
        <Container>
          <div className="flex flex-col gap-6 rounded-[var(--radius-panel)] bg-flow-50 p-8 ring-1 ring-flow-100 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 id="talent-candidates" className="t-h3 text-ink-950">
                Are you a technology professional?
              </h2>
              <p className="mt-2 leading-relaxed text-ink-600">
                Join our talent network to hear about contract and permanent roles that match your skills.{" "}
                <Link href="/careers" className="font-semibold text-flow-700 underline decoration-flow-300 underline-offset-4">
                  Learn about careers
                </Link>
              </p>
            </div>
            <ButtonLink href="/careers#join" className="shrink-0">
              Join Our Network
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <CtaBand
        title="What kind of professional or team do you need?"
        lead="Tell us about the role, the team and the timeline. We will tell you honestly how hard it will be to fill."
        actions={[
          { label: "Find Talent", href: "/contact?need=talent" },
          { label: "Talk to an Expert", href: "/contact?need=both" },
        ]}
      />
    </>
  );
}
