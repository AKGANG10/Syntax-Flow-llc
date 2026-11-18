import type { Metadata } from "next";
import { ContentPending, Container, CtaBand, PageHero, Section, SectionHeading } from "@/components/ui";
import { company } from "@/content/site";

export const metadata: Metadata = {
  title: "Trust & Security",
  description: "How Syntax Flow protects this website and the information clients and candidates share with us.",
  alternates: { canonical: "/trust" },
};

/** Only controls that are implemented in this codebase. Keep in sync with docs/SECURITY.md. */
const controls = [
  { title: "Encrypted connections", text: "The site is served over HTTPS, with HTTP Strict Transport Security telling browsers never to connect without encryption." },
  { title: "Content Security Policy", text: "A strict policy limits where scripts, styles, images and connections can come from, and blocks the site from being framed by other sites." },
  { title: "Security headers", text: "Headers prevent content sniffing, restrict referrer data and switch off browser features the site does not use, such as camera, microphone and location." },
  { title: "Validated inputs", text: "Every form field is validated on our server against strict rules for type and length. Browser checks are a convenience, never the control." },
  { title: "Abuse protection", text: "Form submissions are limited per visitor, checked for automated behavior, deduplicated, and must come from this website." },
  { title: "No hidden tracking", text: "This site sets no advertising or analytics cookies and loads no third-party tracking scripts." },
  { title: "Secrets stay on the server", text: "Email delivery credentials live in server-side environment configuration and never reach your browser." },
  { title: "Careful logging", text: "Server logs record a reference number and outcome for each inquiry, never the names, contact details or messages you send." },
  { title: "Dependency checks", text: "Every change to the website's code is automatically checked for known vulnerabilities in the third-party packages it uses." },
];

export default function TrustPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust & Security"
        title="Security is part of the architecture."
        lead="Clients trust us with their systems and candidates trust us with their careers. Here is exactly how this website protects the information you share, with nothing overstated."
        motifSeed={97}
      />

      <Section tone="white" aria-labelledby="trust-controls">
        <Container>
          <SectionHeading id="trust-controls" eyebrow="In place on this website" title="Controls you can check." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {controls.map((c) => (
              <li key={c.title} className="reveal rounded-[var(--radius-card)] bg-paper p-6 ring-1 ring-ink-100">
                <span aria-hidden="true" className="block size-3 rounded-full border-2 border-ink-800 bg-flow-500" />
                <h3 className="mt-4 font-semibold text-ink-950">{c.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-600">{c.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section aria-labelledby="trust-data">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            id="trust-data"
            eyebrow="Your information"
            title="We collect only what we need to respond."
            lead="Business inquiries ask about the work and how to reach you. Talent network sign-ups ask about your skills and preferences. We do not accept resumes or identity documents through this website."
          />
          <div className="space-y-4">
            <ContentPending
              title="Data handling and retention policy"
              note="Supply how long inquiries and candidate profiles are kept, who can access them internally, and how deletion requests are handled."
            />
            <ContentPending
              title="Certifications and compliance"
              note="List only certifications and assessments the company actually holds, with issuer and date. Leave empty if none."
            />
            <ContentPending title="Technology partnerships" note="List only active, verifiable partner programs, with permission to display them." />
          </div>
        </Container>
      </Section>

      <Section tone="white" aria-labelledby="trust-report">
        <Container>
          <div className="rounded-[var(--radius-panel)] bg-ink-950 p-8 text-white sm:p-12">
            <h2 id="trust-report" className="t-h3">
              Report a security issue
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-ink-300">
              If you believe you have found a vulnerability in this website, please email{" "}
              <a href={`mailto:${company.email}?subject=Security%20report`} className="font-semibold text-white underline underline-offset-4">
                {company.email}
              </a>{" "}
              with the details. Please do not access data that is not yours or disrupt the service. Our contact details are also published at{" "}
              <a href="/.well-known/security.txt" className="font-semibold text-white underline underline-offset-4">
                /.well-known/security.txt
              </a>
              .
            </p>
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Talk to us about secure engineering."
        lead="Security architecture, application and cloud security, identity and access management, and compliance support."
        actions={[
          { label: "Talk to an Expert", href: "/contact?need=technology" },
          { label: "Cybersecurity services", href: "/solutions/technology#security" },
        ]}
      />
    </>
  );
}
