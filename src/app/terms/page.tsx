import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { company } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the Syntax Flow website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use" updated="November 18, 2026">
      <section>
        <h2>About these terms</h2>
        <p>
          These terms apply to your use of this website, operated by {company.legalName}. They do not govern client engagements or employment, which are covered by separate
          written agreements.
        </p>
      </section>
      <section>
        <h2>Information on this website</h2>
        <p>
          We work to keep the information here accurate, but it is provided for general information only. Descriptions of services do not create an offer or a contract.
          Examples labelled as illustrative are not accounts of specific client work.
        </p>
      </section>
      <section>
        <h2>Acceptable use</h2>
        <ul>
          <li>Do not submit false information or information about other people without their permission.</li>
          <li>Do not attempt to disrupt, overload or gain unauthorized access to the website.</li>
          <li>Do not use automated tools to submit forms or collect content.</li>
        </ul>
      </section>
      <section>
        <h2>Intellectual property</h2>
        <p>The Syntax Flow name, logo and website content belong to {company.legalName}. Please do not reuse them without written permission.</p>
      </section>
      <section>
        <h2>Governing law</h2>
        <p>[To be confirmed by counsel: governing law, venue and limitation of liability.]</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>Questions about these terms can be sent to {company.email}.</p>
      </section>
    </LegalPage>
  );
}
