import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { company, formattedAddress } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How Syntax Flow collects, uses and protects information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy notice" updated="November 18, 2026">
      <section>
        <h2>Who we are</h2>
        <p>
          This website is operated by {company.legalName}, {formattedAddress}, United States. You can contact us about privacy at{" "}
          <a className="font-semibold text-flow-700 underline" href={`mailto:${company.email}`}>
            {company.email}
          </a>
          .
        </p>
      </section>

      <section>
        <h2>What we collect</h2>
        <p>We collect only the information you choose to send us through our forms:</p>
        <ul>
          <li>
            <strong>Business inquiries:</strong> your name, work email, company, optional phone number, and what you tell us about the technology or talent you need.
          </li>
          <li>
            <strong>Talent network sign-ups:</strong> your name, email, optional phone number, location, preferred roles, skills, work and engagement preferences, an optional
            profile link and an optional message.
          </li>
        </ul>
        <p>We do not accept resumes, identity documents or payment details through this website.</p>
      </section>

      <section>
        <h2>How we use it</h2>
        <ul>
          <li>To reply to your inquiry and discuss the services you asked about.</li>
          <li>For talent network members, to contact you about roles that match your profile.</li>
          <li>To protect the website from spam and abuse.</li>
        </ul>
        <p>We do not sell your information.</p>
      </section>

      <section>
        <h2>How it is processed</h2>
        <p>
          Form submissions are validated on our server and sent to our team by email through an email delivery provider acting on our behalf. Our server keeps a short-lived,
          in-memory record of recent submissions to prevent duplicates and abuse; it is not a permanent database. Server logs record a reference number and the outcome of
          each submission, not its content.
        </p>
      </section>

      <section>
        <h2>Cookies and tracking</h2>
        <p>This website does not set advertising or analytics cookies and does not load third-party tracking scripts. If that changes, we will update this notice first.</p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>[To be confirmed by Syntax Flow: retention periods for business inquiries and talent network profiles, and how deletion requests are fulfilled.]</p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You can ask us what information we hold about you, ask us to correct it, or ask us to delete it, by emailing {company.email}. Talent network members can ask to be
          removed from the network at any time.
        </p>
      </section>

      <section>
        <h2>Changes</h2>
        <p>We will post any changes to this notice on this page and update the date above.</p>
      </section>
    </LegalPage>
  );
}
