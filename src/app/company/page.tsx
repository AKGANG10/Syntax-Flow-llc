import type { Metadata } from "next";
import Image from "next/image";
import { PhotoFrame } from "@/components/photo-frame";
import { ButtonLink, ContentPending, Container, CtaBand, PageHero, Section, SectionHeading } from "@/components/ui";
import { company, formattedAddress } from "@/content/site";

export const metadata: Metadata = {
  title: "Company",
  description: "Syntax Flow LLC is a technology and talent solutions company headquartered in Dallas, Texas.",
  alternates: { canonical: "/company" },
};

/** Principles supplied in the redesign brief (2026-11-18). */
const principles = [
  { title: "Build with purpose", text: "Every system and every hire starts from the outcome it has to deliver." },
  { title: "Move with intelligence", text: "Decisions grounded in evidence, engineering judgment and honest trade-offs." },
  { title: "Design for scale", text: "Architecture, processes and teams that can grow without starting over." },
  { title: "People first", text: "For clients, candidates and our own team: respect, clarity and follow-through." },
  { title: "Engineer for tomorrow", text: "Secure, maintainable work that is still an asset years from now." },
];

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="One company. Two connected capabilities."
        lead="Syntax Flow operates where technology and talent meet. We help organizations turn ambitious ideas into measurable outcomes, with the systems and the people to make them real."
        motifSeed={61}
      >
        <ButtonLink href="/contact">Start a Conversation</ButtonLink>
        <ButtonLink href="/careers" variant="secondary">
          Careers
        </ButtonLink>
      </PageHero>

      <Section tone="white" aria-labelledby="company-about">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              id="company-about"
              eyebrow="About"
              title="A strategic technology and talent partner."
              lead="We are not a traditional staffing agency, and not a generic outsourcing firm. Clients come to us with a business or technology challenge and receive consulting, a technology solution, skilled technical talent, a dedicated team, or the combination their situation needs."
            />
            <p className="mt-6 leading-relaxed text-ink-600">
              Our name says what we do. Many strands of technology and people, converging where the work happens and moving forward together.
            </p>
          </div>
          <div className="rounded-[var(--radius-panel)] bg-paper p-8 ring-1 ring-ink-100 sm:p-12">
            <Image
              src="/brand/syntax-flow-logo.png"
              alt="Syntax Flow LLC logo"
              width={1200}
              height={714}
              sizes="(min-width: 1024px) 34rem, 90vw"
              className="h-auto w-full"
            />
          </div>
        </Container>
      </Section>

      <Section tone="ink" aria-labelledby="company-principles" className="noise overflow-hidden">
        <div aria-hidden="true" className="bg-grid-dark mask-fade-y pointer-events-none absolute inset-0" />
        <Container className="relative">
          <SectionHeading id="company-principles" tone="dark" eyebrow="How we work" title="Five principles. Every engagement." />
          <ol className="mt-14 divide-y divide-white/10 border-y border-white/10">
            {principles.map((p, i) => (
              <li key={p.title} className="reveal grid gap-3 py-8 md:grid-cols-[6rem_1.2fr_1fr] md:items-baseline md:gap-8">
                <span className="font-mono text-sm text-flow-300">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-[clamp(1.75rem,1.2rem+2vw,3rem)] leading-none font-extrabold tracking-[-0.04em] text-white">{p.title}</h3>
                <p className="text-lg leading-relaxed text-ink-300">{p.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="white" aria-labelledby="company-leadership">
        <Container>
          <SectionHeading id="company-leadership" eyebrow="Leadership" title="The people accountable for the work." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <ContentPending title="Leadership profile" note="Name, role, photo (licensed or owned) and a short verified biography." />
            <ContentPending title="Leadership profile" note="Name, role, photo (licensed or owned) and a short verified biography." />
            <ContentPending title="Leadership profile" note="Name, role, photo (licensed or owned) and a short verified biography." />
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="company-culture" className="overflow-hidden">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <SectionHeading id="company-culture" eyebrow="Culture" title="Built by technologists and recruiters, side by side." />
              <ContentPending
                className="mt-10"
                title="Culture and team story"
                note="Supply the team's real working culture: how technology and talent teams collaborate, where people work, and what it is like to join."
              />
              <ContentPending className="mt-4" title="Company timeline" note="Founding date and verified milestones, in order. Nothing is shown until real dates are supplied." />
            </div>
            <div className="grid grid-cols-5 gap-4">
              <PhotoFrame name="office" fallback="managed" className="col-span-5 aspect-[16/10] rounded-[2.5rem_0.75rem_2.5rem_2.5rem]" sizes="(min-width: 1024px) 45vw, 100vw" />
              <PhotoFrame name="colleagues" fallback="talent" className="col-span-3 aspect-[4/3]" sizes="(min-width: 1024px) 27vw, 60vw" />
              <div aria-hidden="true" className="col-span-2 flex items-center justify-center rounded-[var(--radius-frame)] bg-ink-950">
                <span className="size-12 rounded-full border-[6px] border-white bg-flow-500" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white" aria-labelledby="company-facts">
        <Container>
          <SectionHeading id="company-facts" eyebrow="Company facts" title="Syntax Flow at a glance." />
          <dl className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-ink-100 ring-1 ring-ink-100 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Legal name", v: company.legalName },
              { k: "Headquarters", v: formattedAddress },
              { k: "Contact", v: `${company.phone.display} · ${company.email}` },
              { k: "Employment verification", v: "E-Verify® participating employer" },
            ].map((f) => (
              <div key={f.k} className="bg-white p-6">
                <dt className="t-label text-ink-500">{f.k}</dt>
                <dd className="mt-2 leading-relaxed font-medium text-ink-900">{f.v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <CtaBand
        title="Build what's next with us."
        actions={[
          { label: "Start a Conversation", href: "/contact" },
          { label: "Join Our Network", href: "/careers#join" },
        ]}
      />
    </>
  );
}
