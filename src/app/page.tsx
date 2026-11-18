import type { Metadata } from "next";
import Link from "next/link";
import { DashboardShowcase } from "@/components/dashboard/showcase";
import { HeroFragments } from "@/components/dashboard/hero-fragments";
import { Magnetic } from "@/components/effects";
import { HeroScene } from "@/components/hero-scene";
import { IndustryRail } from "@/components/industry-rail";
import { WordReveal } from "@/components/intro";
import { NeedCards } from "@/components/need-cards";
import { PhotoFrame } from "@/components/photo-frame";
import { ServicePillars } from "@/components/service-pillars";
import { SolutionsGrid } from "@/components/solutions-grid";
import { TalentEquation, TalentNetwork } from "@/components/talent-network";
import { TheFlow } from "@/components/the-flow";
import { ButtonLink, Container, CtaBand, Eyebrow, Section, SectionHeading, TextLink } from "@/components/ui";
import { flowSteps, solutions, type VizKind } from "@/content/capabilities";
import { industries } from "@/content/industries";
import type { MediaKey } from "@/content/media";
import { company, formattedAddress } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: "Syntax Flow | IT Services, IT Consulting and IT Recruitment" },
  alternates: { canonical: "/" },
};

const stepMedia: { key: MediaKey; viz: VizKind }[] = [
  { key: "discover", viz: "data" },
  { key: "design", viz: "software" },
  { key: "build", viz: "ai" },
  { key: "connect", viz: "talent" },
  { key: "scale", viz: "cloud" },
  { key: "transform", viz: "transformation" },
];

const caseFormat = ["Client / industry", "Challenge", "Solution", "Impact", "Technology"];

export default function HomePage() {
  return (
    <>
      {/* HERO: data flow */}
      <section className="relative isolate flex flex-col overflow-hidden bg-paper">
        <div aria-hidden="true" className="bg-grid mask-radial absolute inset-0 -z-20 opacity-70" />
        <div aria-hidden="true" className="absolute -top-40 right-[-10%] -z-20 size-[52rem] rounded-full bg-flow-100/70 blur-[120px]" />
        <div className="relative order-last h-72 w-full sm:h-80 lg:absolute lg:inset-0 lg:-z-10 lg:h-full">
          <HeroScene
            className="absolute inset-0 h-full w-full"
            fallbackClassName="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] lg:top-[12%] lg:h-[80%]"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,var(--color-paper)_0%,rgb(246_249_251/0.94)_34%,rgb(246_249_251/0)_60%)] max-lg:hidden" />
        <HeroFragments />

        <Container className="flex flex-col justify-start pt-[calc(var(--header-h)+3.5rem)] pb-4 sm:pt-[calc(var(--header-h)+5rem)] lg:min-h-[max(42rem,100svh)] lg:justify-center lg:pt-[var(--header-h)] lg:pb-20">
          <div className="max-w-[42rem]">
            <div className="fade-up" style={{ ["--d" as string]: "80ms" }}>
              <Eyebrow>{company.category}</Eyebrow>
            </div>
            <WordReveal as="h1" text="Build what’s next." className="t-display mt-6 block text-ink-950" delay={150} />
            <p className="fade-up mt-6 text-[clamp(1.25rem,1.05rem+0.9vw,1.75rem)] font-semibold tracking-[-0.02em] text-ink-800" style={{ ["--d" as string]: "520ms" }}>
              Technology. Talent. <span className="text-flow-700">Transformation.</span>
            </p>
            <p className="fade-up t-lead mt-5 max-w-xl text-ink-600" style={{ ["--d" as string]: "640ms" }}>
              An IT services and IT consulting company and a US IT recruitment firm. We help ambitious organizations build, modernize and scale with intelligent technology and exceptional technical talent.
            </p>
            <div className="fade-up mt-9 flex flex-wrap gap-3" style={{ ["--d" as string]: "760ms" }}>
              <Magnetic>
                <ButtonLink href="/contact">Start a Conversation</ButtonLink>
              </Magnetic>
              <Magnetic>
                <ButtonLink href="#solutions" variant="secondary" arrow={false}>
                  Explore Our Capabilities
                </ButtonLink>
              </Magnetic>
            </div>
            <p className="fade-up mt-8 text-sm text-ink-600" style={{ ["--d" as string]: "880ms" }}>
              Looking for your next role?{" "}
              <Link href="/careers#join" className="font-semibold text-flow-700 underline decoration-flow-300 underline-offset-4 hover:decoration-flow-700">
                Join our talent network
              </Link>
            </p>
          </div>
        </Container>
      </section>

      {/* WHAT DO YOU NEED? */}
      <section aria-labelledby="home-need" className="relative bg-paper pb-20 sm:pb-24">
        <Container>
          <div className="mb-6 flex items-end justify-between gap-6">
            <h2 id="home-need" className="t-label text-ink-500">
              What do you need?
            </h2>
            <span aria-hidden="true" className="mb-1 h-px flex-1 bg-gradient-to-r from-ink-200 to-transparent" />
          </div>
          <NeedCards />
        </Container>
      </section>

      {/* WHAT WE DO: IT services, IT consulting, IT recruitment */}
      <ServicePillars id="home-what" tone="white" />

      {/* STATEMENT */}
      <Section aria-label="What we believe">
        <Container>
          <p className="scrub-text max-w-5xl text-[clamp(1.9rem,1.2rem+3vw,4rem)] leading-[1.08] font-extrabold tracking-[-0.04em] text-ink-950">
            Technology needs people. People need the right technology. Syntax Flow connects both, from the first question to the team that runs it.
          </p>
        </Container>
      </Section>

      {/* THE FLOW */}
      <TheFlow
        steps={flowSteps}
        media={stepMedia.map((m, i) => (
          <PhotoFrame key={m.key} name={m.key} fallback={m.viz} tone="dark" className="h-full w-full" sizes="(min-width: 1024px) 40vw, 100vw" priority={i === 0} parallax={false} />
        ))}
      />

      {/* SOLUTIONS: technology flow */}
      <Section id="solutions" aria-labelledby="home-solutions" className="noise">
        <div aria-hidden="true" className="bg-grid mask-fade-y pointer-events-none absolute inset-0 opacity-60" />
        <Container className="relative">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading id="home-solutions" eyebrow="Solutions" title="Eight capabilities. One connected partner." lead="Open any card to see what is inside. Each one can be delivered by our engineers, staffed by our recruiters, or both." />
            <div className="shrink-0">
              <TextLink href="/solutions">All solutions</TextLink>
            </div>
          </div>
          <div className="mt-14">
            <SolutionsGrid items={solutions} />
          </div>
        </Container>
      </Section>

      {/* DASHBOARDS: see the system in motion */}
      <DashboardShowcase />

      {/* HUMAN ENVIRONMENT */}
      <Section tone="white" aria-labelledby="home-human" className="overflow-hidden">
        <Container className="grid items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <SectionHeading
              id="home-human"
              eyebrow="People and practice"
              title="Behind every system is a team that knows it."
              lead="Our engineers and our recruiters plan together. The people who design a platform help choose the people who will run it, so knowledge stays where the work is."
            />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                ["Engineering judgment", "Architecture, security and delivery decisions made by practitioners."],
                ["Recruiting depth", "Candidates assessed against the real requirements of the role."],
                ["One plan", "The roadmap and the hiring plan are written together."],
                ["Knowledge that stays", "Documentation and handover are part of every engagement."],
              ].map(([t, d]) => (
                <li key={t} className="rounded-[var(--radius-card)] bg-paper p-5 ring-1 ring-ink-100">
                  <p className="font-semibold text-ink-950">{t}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{d}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative grid grid-cols-6 grid-rows-6 gap-4 [aspect-ratio:1/1.02] max-sm:[aspect-ratio:1/1.2]">
            <PhotoFrame name="typing" fallback="software" className="col-span-4 row-span-4 rounded-[2.5rem_0.75rem_2.5rem_2.5rem]" sizes="(min-width: 1024px) 34vw, 66vw" />
            <PhotoFrame name="connect" fallback="talent" className="col-span-2 col-start-5 row-span-3 row-start-2" sizes="(min-width: 1024px) 17vw, 33vw" />
            <PhotoFrame name="technician" fallback="cloud" className="col-span-3 col-start-3 row-span-2 row-start-5 rounded-[0.75rem_2.5rem_2.5rem_2.5rem]" sizes="(min-width: 1024px) 25vw, 50vw" />
            <div aria-hidden="true" className="col-span-2 col-start-1 row-span-2 row-start-5 flex items-center justify-center rounded-[var(--radius-frame)] bg-ink-950">
              <span className="size-10 rounded-full border-[5px] border-white bg-flow-500" />
            </div>
          </div>
        </Container>
      </Section>

      {/* TALENT: people flow */}
      <Section tone="ink" aria-labelledby="home-talent" className="noise overflow-hidden">
        <div aria-hidden="true" className="bg-grid-dark mask-fade-y pointer-events-none absolute inset-0" />
        <Container className="relative">
          <Eyebrow tone="dark">Talent</Eyebrow>
          <h2 id="home-talent" className="sr-only">
            Technology plus people equals transformation
          </h2>
          <div className="mt-6">
            <TalentEquation />
          </div>
          <p className="t-lead mt-6 max-w-2xl text-ink-300">
            Every system needs people who can build it, run it and improve it. Explore the roles we recruit and the teams we assemble.
          </p>
          <div className="mt-14">
            <TalentNetwork />
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href="/contact?need=talent" variant="invert">
              Find Talent
            </ButtonLink>
            <ButtonLink href="/careers" variant="outline-invert">
              Join Our Network
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* PROOF: project flow */}
      <Section aria-labelledby="home-proof">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
            <div>
              <SectionHeading
                id="home-proof"
                eyebrow="Work"
                title="Proof, without the fiction."
                lead="We publish case studies only with client permission and verified numbers. Each one follows the same structure, so you can compare like with like."
              />
              <ol className="mt-10 divide-y divide-ink-200 border-y border-ink-200">
                {caseFormat.map((c, i) => (
                  <li key={c} className="flex items-baseline gap-6 py-4">
                    <span className="font-mono text-xs text-flow-700">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-xl font-bold tracking-[-0.02em] text-ink-900">{c}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <TextLink href="/work">How we report outcomes</TextLink>
              </div>
            </div>
            <ul className="grid content-start gap-4">
              {[
                ["Headquartered in Dallas, Texas", formattedAddress],
                ["E-Verify® participating employer", `${company.legalName} participates in E-Verify to confirm employment eligibility in the United States.`],
                ["Security built in", "Strict security headers, validated inputs and no third-party trackers on this website."],
              ].map(([t, d]) => (
                <li key={t} className="rounded-[var(--radius-card)] bg-white p-6 shadow-soft ring-1 ring-ink-100">
                  <p className="font-semibold text-ink-950">{t}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{d}</p>
                </li>
              ))}
              <li className="rounded-[var(--radius-card)] bg-ink-950 p-6 text-white">
                <p className="font-semibold">Verified outcomes only</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">
                  No invented logos, testimonials or statistics.{" "}
                  <Link href="/trust" className="font-semibold text-flow-300 underline underline-offset-4">
                    Trust &amp; Security
                  </Link>
                </p>
              </li>
            </ul>
          </div>
        </Container>
      </Section>

      {/* INDUSTRIES: global flow */}
      <IndustryRail items={industries} />

      <CtaBand
        title="Tell us what you need to build."
        lead="Technology, talent or both. Start with a short conversation and we will point you to the right team."
        actions={[
          { label: "Start a Conversation", href: "/contact" },
          { label: "Find Talent", href: "/contact?need=talent" },
        ]}
      />
    </>
  );
}
