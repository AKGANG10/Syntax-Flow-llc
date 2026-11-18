import type { Metadata } from "next";
import { Suspense } from "react";
import { BusinessInquiryForm } from "@/components/inquiry-form";
import { Container, Eyebrow, StrandMotif } from "@/components/ui";
import { company } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact: Start a Conversation",
  description: "Tell Syntax Flow what you need to build: technology, technical talent, or both.",
  alternates: { canonical: "/contact" },
};

function FormFallback() {
  return (
    <div className="min-h-[56rem] rounded-[var(--radius-panel)] bg-paper" aria-busy="true">
      <p className="p-8 text-ink-600">Loading the inquiry form…</p>
      <noscript>
        <p className="px-8 text-ink-800">
          The form needs JavaScript. You can also email {company.email} or call {company.phone.display}.
        </p>
      </noscript>
    </div>
  );
}

export default function ContactPage() {
  const { address } = company;
  return (
    <section className="relative overflow-hidden bg-paper pt-[calc(var(--header-h)+3rem)] pb-20 lg:pt-[calc(var(--header-h)+4.5rem)] lg:pb-28">
      <StrandMotif seed={71} className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] w-full opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <Container className="relative grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="t-h1 mt-5 text-ink-950">Tell us what you need to build.</h1>
          <p className="t-lead mt-6 text-ink-600">
            Choose technology, talent or both. A few questions help us route you to the right people the first time.
          </p>
          <div className="mt-10 space-y-6 border-t border-ink-200 pt-8">
            <div>
              <h2 className="t-label text-ink-500">Email</h2>
              <a href={`mailto:${company.email}`} className="strand-link mt-2 inline-block font-semibold text-ink-900">
                {company.email}
              </a>
            </div>
            <div>
              <h2 className="t-label text-ink-500">Phone</h2>
              <a href={company.phone.href} className="strand-link mt-2 inline-block font-semibold text-ink-900">
                {company.phone.display}
              </a>
            </div>
            <div>
              <h2 className="t-label text-ink-500">Office</h2>
              <address className="mt-2 leading-relaxed text-ink-800 not-italic">
                {company.legalName}
                <br />
                {address.street}
                <br />
                {address.locality}, {address.regionName} {address.postalCode}
                <br />
                United States
              </address>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius-panel)] bg-white p-6 shadow-soft ring-1 ring-ink-100 sm:p-10">
          <Suspense fallback={<FormFallback />}>
            <BusinessInquiryForm />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}
