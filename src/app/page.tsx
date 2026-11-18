import type { Metadata } from "next";
import Link from "next/link";
import { EcosystemMap } from "@/components/ecosystem-map";
import { FlowField } from "@/components/flow-field";
import { LifecycleRail } from "@/components/lifecycle-rail";
import { ArrowIcon, ButtonLink, Container, CtaBand, Eyebrow, Section, SectionHeading, TextLink, cx } from "@/components/ui";
import { engagementModels, lifecycle, talentCapabilities, technologyCapabilities } from "@/content/capabilities";
import { industries } from "@/content/industries";
import { company, formattedAddress } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: "Syntax Flow | Technology and Talent Solutions" },
  alternates: { canonical: "/" },
};

const routes = [
  { label: "I need technology", href: "/contact?need=technology" },
  { label: "I need talent", href: "/contact?need=talent" },
  { label: "I need both", href: "/contact?need=both" },
];

const exampleSteps = [
  "Define the business problem",
  "Design the solution",
  "Architect the platform",
  "Build the software",
  "Implement the AI",
  "Secure the environment",
  "Deploy to the cloud",
  "Provide the engineers to operate and scale it",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      {/* Phones: strands sit in flow below the text. Desktop: behind it, faded under the copy. */}
      <section className="relative isolate flex flex-col overflow-hidden bg-paper">
        <div className="relative order-last h-72 w-full sm:h-80 lg:absolute lg:inset-x-0 lg:top-[10%] lg:-z-10 lg:h-[84%]">
          <FlowField className="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]" />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 max-lg:hidden bg-[linear-gradient(90deg,var(--color-paper)_0%,rgb(246_249_251/0.96)_40%,rgb(246_249_251/0)_66%)]"
        />
        <Container className="flex flex-col justify-start pt-[calc(var(--header-h)+3.5rem)] pb-4 sm:pt-[calc(var(--header-h)+5rem)] lg:min-h-[max(40rem,100svh)] lg:justify-center lg:pt-[var(--header-h)] lg:pb-16">
          <div className="max-w-[40rem]">
            <Eyebrow>{company.tagline}</Eyebrow>
            <h1 className="t-display mt-6 text-ink-950">Build what&rsquo;s next.</h1>
            <p className="mt-6 text-[clamp(1.25rem,1.05rem+0.9vw,1.75rem)] font-semibold tracking-[-0.02em] text-ink-800">
              Technology. Talent. <span className="text-flow-700">Transformation.</span>
            </p>
            <p className="t-lead mt-5 max-w-xl text-ink-600">
              We help ambitious organizations build, modernize and scale through intelligent technology and exceptional technical talent.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Start a Conversation</ButtonLink>
              <ButtonLink href="#capabilities" variant="secondary" arrow={false}>
                Explore Our Capabilities
              </ButtonLink>
            </div>
            <nav aria-label="Choose your path" className="mt-10">
              <p className="text-sm font-medium text-ink-600">What do you need?</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {routes.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="glass flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-900 transition-colors hover:border-flow-400"
                    >
                      <span aria-hidden="true" className="size-2 rounded-full bg-flow-500" />
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-ink-600">
                Looking for your next role?{" "}
                <Link href="/careers#join" className="font-semibold text-flow-700 underline decoration-flow-300 underline-offset-4 hover:decoration-flow-700">
                  Join our talent network
                </Link>
              </p>
            </nav>
          </div>
        </Container>
      </section>

      {/* Two connected worlds */}
      <Section tone="white" aria-labelledby="home-worlds">
        <Container>
          <SectionHeading
            id="home-worlds"
            eyebrow="One company, two connected capabilities"
            title="Technology needs people. People need the right technology. We connect both."
          />
          <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <article className="reveal rounded-[var(--radius-panel)] bg-flow-50 p-8 ring-1 ring-flow-100 sm:p-10">
              <p className="t-label text-flow-700">Build with technology</p>
              <h3 className="t-h3 mt-4 text-ink-950">Systems designed for the problem you actually have.</h3>
              <p className="mt-3 leading-relaxed text-ink-600">
                AI, software, cloud, data, security and automation, engineered to be maintained and scaled long after launch.
              </p>
              <div className="mt-6">
                <TextLink href="/solutions/technology">Technology solutions</TextLink>
              </div>
            </article>
            <div aria-hidden="true" className="flex items-center justify-center py-2 lg:px-2">
              <span className="flex size-16 items-center justify-center rounded-full border-2 border-ink-800 bg-white text-2xl font-bold text-ink-900 shadow-soft">
                ×
              </span>
            </div>
            <article className="reveal rounded-[var(--radius-panel)] bg-ink-50 p-8 ring-1 ring-ink-100 sm:p-10">
              <p className="t-label text-ink-700">Build with people</p>
              <h3 className="t-h3 mt-4 text-ink-950">The specialists and teams to deliver and run it.</h3>
              <p className="mt-3 leading-relaxed text-ink-600">
                Engineers, architects, data specialists, security professionals and complete teams, recruited by people who understand the work.
              </p>
              <div className="mt-6">
                <TextLink href="/solutions/talent">Talent solutions</TextLink>
              </div>
            </article>
          </div>
          <p className="mt-8 text-center text-ink-600">
            One strategic partner for the solution and the people behind it.{" "}
            <Link href="/solutions/technology-talent" className="font-semibold text-flow-700 underline decoration-flow-300 underline-offset-4 hover:decoration-flow-700">
              See how Technology + Talent works
            </Link>
          </p>
        </Container>
      </Section>

      {/* Lifecycle */}
      <Section aria-labelledby="home-lifecycle">
        <Container>
          <SectionHeading
            id="home-lifecycle"
            eyebrow="Discover → Scale"
            title="From the first question to a team that runs it."
            lead="Bring us a business problem or a technology challenge. We can stay with it across the whole lifecycle, or step in exactly where you need us."
          />
          <div className="mt-16">
            <LifecycleRail steps={lifecycle} />
          </div>
        </Container>
      </Section>

      {/* Capabilities */}
      <Section tone="white" id="capabilities" aria-labelledby="home-capabilities">
        <Container>
          <SectionHeading id="home-capabilities" eyebrow="Capabilities" title="Capabilities across both worlds." />

          <div className="mt-14 flex items-center gap-4">
            <h3 className="t-label text-flow-700">Technology</h3>
            <span aria-hidden="true" className="h-px flex-1 bg-flow-200" />
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {technologyCapabilities.map((c) => (
              <li key={c.id} className="reveal">
                <Link
                  href={`/solutions/technology#${c.id}`}
                  className="group flex h-full flex-col rounded-[var(--radius-card)] bg-paper p-6 ring-1 ring-ink-100 transition-[box-shadow,transform] duration-[var(--duration-normal)] hover:-translate-y-0.5 hover:shadow-lift hover:ring-flow-200"
                >
                  <span aria-hidden="true" className="size-3 rounded-full bg-flow-500" />
                  <span className="t-h3 mt-5 block text-ink-950">{c.title}</span>
                  <span className="mt-2 block flex-1 leading-relaxed text-ink-600">{c.summary}</span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-flow-700">
                    Explore <ArrowIcon className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-16 flex items-center gap-4">
            <h3 className="t-label text-ink-700">Talent</h3>
            <span aria-hidden="true" className="h-px flex-1 bg-ink-200" />
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {talentCapabilities.map((c) => (
              <li key={c.id} className="reveal">
                <Link
                  href={`/solutions/talent#${c.id}`}
                  className="group flex h-full flex-col rounded-[var(--radius-card)] bg-paper p-6 ring-1 ring-ink-100 transition-[box-shadow,transform] duration-[var(--duration-normal)] hover:-translate-y-0.5 hover:shadow-lift hover:ring-ink-300"
                >
                  <span aria-hidden="true" className="size-3 rounded-full border-2 border-ink-800" />
                  <span className="t-h3 mt-5 block text-ink-950">{c.title}</span>
                  <span className="mt-2 block flex-1 leading-relaxed text-ink-600">{c.summary}</span>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-flow-700">
                    Explore <ArrowIcon className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Three ways */}
      <Section aria-labelledby="home-ways">
        <Container>
          <SectionHeading id="home-ways" eyebrow="Engagement" title="Three ways to work with us." />
          <ul className="mt-14 grid gap-5 lg:grid-cols-3">
            {engagementModels.map((m, i) => (
              <li
                key={m.id}
                className={cx(
                  "reveal flex flex-col rounded-[var(--radius-panel)] p-8 sm:p-10",
                  i === 2 ? "bg-ink-950 text-white" : "bg-white ring-1 ring-ink-100",
                )}
              >
                <p className={cx("t-label", i === 2 ? "text-flow-300" : "text-flow-700")}>{String(i + 1).padStart(2, "0")}</p>
                <h3 className={cx("mt-4 text-[2rem] font-extrabold tracking-[-0.035em]", i === 2 ? "text-white" : "text-ink-950")}>{m.name}</h3>
                <p className={cx("mt-2 font-medium", i === 2 ? "text-ink-200" : "text-ink-700")}>{m.headline}</p>
                <ul className={cx("mt-6 flex-1 space-y-2.5 text-[0.95rem]", i === 2 ? "text-ink-300" : "text-ink-600")}>
                  {m.examples.map((e) => (
                    <li key={e} className="flex items-center gap-3">
                      <span aria-hidden="true" className={cx("size-1.5 rounded-full", i === 2 ? "bg-flow-300" : "bg-flow-500")} />
                      {e}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <ButtonLink href={m.cta.href} variant={i === 2 ? "invert" : "primary"}>
                    {m.cta.label}
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Ecosystem map */}
      <Section tone="ink" aria-labelledby="home-map">
        <Container>
          <SectionHeading
            id="home-map"
            tone="dark"
            eyebrow="Technology × Talent × Outcomes"
            title="Every system needs the people who can run it."
            lead="Pick a technology to see the people it takes and the outcomes it drives. This is how we plan engagements: the solution and the team, together."
          />
          <div className="mt-14">
            <EcosystemMap />
          </div>
        </Container>
      </Section>

      {/* Example engagement */}
      <Section tone="white" aria-labelledby="home-example">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <SectionHeading
              id="home-example"
              eyebrow="Example engagement"
              title="A company wants to build an AI platform."
              lead="A typical technology firm hands this off halfway. A staffing firm starts at the end. We can carry it the whole way, so nothing gets lost between the people who designed it and the people who run it."
            />
            <p className="mt-6 text-sm text-ink-500">Illustrative example of the engagement model. Not a client case study.</p>
          </div>
          <ol className="relative space-y-0">
            {exampleSteps.map((s, i) => (
              <li key={s} className="relative flex gap-5 pb-6 last:pb-0">
                {i < exampleSteps.length - 1 && <span aria-hidden="true" className="absolute top-8 bottom-0 left-[0.9375rem] w-px bg-flow-200" />}
                <span
                  aria-hidden="true"
                  className={cx(
                    "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-medium",
                    i === exampleSteps.length - 1 ? "border-2 border-ink-800 bg-white text-ink-900" : "bg-flow-100 text-flow-800",
                  )}
                >
                  {i + 1}
                </span>
                <p className="pt-1 text-lg font-semibold text-ink-900">{s}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Industries */}
      <Section aria-labelledby="home-industries">
        <Container>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              id="home-industries"
              eyebrow="Industries"
              title="Built for the sectors that run on technology and skilled people."
            />
            <div className="shrink-0">
              <TextLink href="/industries">All industries</TextLink>
            </div>
          </div>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind) => (
              <li key={ind.id}>
                <Link
                  href={`/industries#${ind.id}`}
                  className="group flex h-full flex-col rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-ink-100 transition-shadow hover:shadow-soft hover:ring-flow-200"
                >
                  <span className="font-semibold text-ink-950">{ind.name}</span>
                  <span className="mt-1.5 text-sm leading-relaxed text-ink-600">{ind.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Trust */}
      <Section tone="white" aria-labelledby="home-trust">
        <Container>
          <SectionHeading
            id="home-trust"
            eyebrow="Trust"
            title="Credibility we can show you."
            lead="No invented logos, testimonials or statistics. Here is what you can verify today."
          />
          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <li className="rounded-[var(--radius-card)] bg-paper p-6 ring-1 ring-ink-100">
              <p className="font-semibold text-ink-950">Headquartered in Dallas, Texas</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{formattedAddress}</p>
            </li>
            <li className="rounded-[var(--radius-card)] bg-paper p-6 ring-1 ring-ink-100">
              <p className="font-semibold text-ink-950">E-Verify® participating employer</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {company.legalName} participates in E-Verify to confirm employment eligibility in the United States.
              </p>
            </li>
            <li className="rounded-[var(--radius-card)] bg-paper p-6 ring-1 ring-ink-100">
              <p className="font-semibold text-ink-950">Verified outcomes only</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">We publish client results only with permission and with real, checked numbers.</p>
            </li>
            <li className="rounded-[var(--radius-card)] bg-paper p-6 ring-1 ring-ink-100">
              <p className="font-semibold text-ink-950">Security built in</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Strict security headers, validated inputs and no third-party trackers on this site.{" "}
                <Link href="/trust" className="font-semibold text-flow-700 underline decoration-flow-300 underline-offset-4">
                  Trust & Security
                </Link>
              </p>
            </li>
          </ul>
        </Container>
      </Section>

      <CtaBand
        title="Tell us what you need to build."
        lead="Technology, talent or both. Start with a short conversation and we will point you to the right team."
        actions={[
          { label: "I need technology", href: "/contact?need=technology" },
          { label: "I need talent", href: "/contact?need=talent" },
          { label: "I need both", href: "/contact?need=both" },
        ]}
      />
    </>
  );
}
