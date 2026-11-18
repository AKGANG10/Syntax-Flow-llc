import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, ContentPending, Container, CtaBand, PageHero, Section, SectionHeading } from "@/components/ui";
import { company, formattedAddress } from "@/content/site";

export const metadata: Metadata = {
  title: "Company",
  description: "Syntax Flow LLC is a technology and talent solutions company headquartered in Dallas, Texas.",
  alternates: { canonical: "/company" },
};

const principles = [
  { title: "Outcomes before output", text: "We measure success by what changes for your business, not by hours billed or resumes sent." },
  { title: "Honest about what is hard", text: "If a timeline is unrealistic or a role will be difficult to fill, we say so early." },
  { title: "Verified, not claimed", text: "We do not publish numbers, logos or testimonials we cannot back up." },
  { title: "Security from the start", text: "Protecting client and candidate information is part of how we design everything." },
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

      <Section aria-labelledby="company-principles">
        <Container>
          <SectionHeading id="company-principles" eyebrow="How we work" title="Principles we hold ourselves to." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => (
              <li key={p.title} className="reveal rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink-100">
                <h3 className="font-semibold text-ink-950">{p.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-600">{p.text}</p>
              </li>
            ))}
          </ul>
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

      <Section aria-labelledby="company-culture">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading id="company-culture" eyebrow="Culture" title="Built by technologists and recruiters, side by side." />
          <ContentPending
            title="Culture and team story"
            note="Supply the team's real working culture: how technology and talent teams collaborate, where people work, and what it is like to join."
          />
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
