import type { Metadata } from "next";
import { TalentNetworkForm } from "@/components/inquiry-form";
import { PhotoFrame } from "@/components/photo-frame";
import { ButtonLink, ContentPending, Container, PageHero, Section, SectionHeading } from "@/components/ui";
import { company } from "@/content/site";

export const metadata: Metadata = {
  title: "Careers: Join Our Talent Network",
  description:
    "Technology professionals: join the Syntax Flow talent network to hear about contract and permanent roles in engineering, data, cloud, AI and security.",
  alternates: { canonical: "/careers" },
};

const steps = [
  { title: "Share your profile", text: "Tell us about your skills, preferred roles and how you like to work." },
  { title: "Talk to a recruiter", text: "When there is a potential match, a recruiter contacts you to learn more." },
  { title: "Get matched", text: "We introduce you only to roles that fit, and only with your agreement." },
  { title: "Stay supported", text: "We stay in touch through interviews, offers and after you start." },
];

const fields = ["Software engineering", "Data and analytics", "Cloud and DevOps", "AI and machine learning", "Cybersecurity", "QA and testing", "Product and project management", "Enterprise technology"];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="For talent"
        title="Your next opportunity starts here."
        lead="We connect technology professionals with organizations building serious things. Join our talent network and we will reach out when a role fits your skills and the way you want to work."
        motifSeed={83}
      >
        <ButtonLink href="#join">Join Our Talent Network</ButtonLink>
      </PageHero>

      <Section tone="white" aria-labelledby="careers-how">
        <Container>
          <SectionHeading id="careers-how" eyebrow="How it works" title="A recruiting process that respects your time." />
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="reveal rounded-[var(--radius-card)] bg-paper p-6 ring-1 ring-ink-100">
                <p className="t-label text-flow-700">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-semibold text-ink-950">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-600">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-14">
            <h3 className="t-label text-ink-500">Fields we recruit for</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {fields.map((f) => (
                <li key={f} className="flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink-800 ring-1 ring-ink-100">
                  <span aria-hidden="true" className="size-2 rounded-full border-[1.5px] border-ink-800" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section tone="white" aria-label="Life in technology" className="pt-0 sm:pt-0 lg:pt-0">
        <Container>
          <PhotoFrame name="office" fallback="talent" className="aspect-[21/9] w-full max-sm:aspect-[4/3]" sizes="(min-width: 1280px) 1200px, 100vw" />
        </Container>
      </Section>

      <Section id="join" aria-labelledby="careers-join">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <SectionHeading
              id="careers-join"
              eyebrow="Join our network"
              title="Tell us what you do best."
              lead="It takes about three minutes. You can share your resume with your recruiter once you have spoken."
            />
            <div className="mt-8 space-y-4">
              <div className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-ink-100">
                <h3 className="font-semibold text-ink-950">Open roles</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  Our recruiters share current openings directly with matching candidates. A searchable job board is planned.
                </p>
              </div>
              <div className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-ink-100">
                <h3 className="font-semibold text-ink-950">Protect yourself from recruitment fraud</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                  {company.shortName} never asks candidates to pay a fee, buy equipment or share banking details to apply. Our recruiters use
                  @syntaxflowllc.com email addresses. If you are unsure, email {company.email}.
                </p>
              </div>
              {company.eVerifyParticipant && (
                <div className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-ink-100">
                  <h3 className="font-semibold text-ink-950">E-Verify® participating employer</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                    {company.legalName} participates in E-Verify. E-Verify is used only after a job offer is accepted and Form I-9 is completed.
                  </p>
                </div>
              )}
              <ContentPending
                title="E-Verify and Right to Work notices"
                note="Download the official E-Verify Participation and IER Right to Work posters (English and Spanish) from your E-Verify account under View Essential Resources, and host them on this site. E-Verify does not permit linking official posters from external websites."
              />
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] bg-white p-6 shadow-soft ring-1 ring-ink-100 sm:p-10">
            <TalentNetworkForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
