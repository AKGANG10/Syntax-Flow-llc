import type { ReactNode } from "react";
import { Container, Eyebrow } from "./ui";

/** Layout for legal pages. `draft` shows a banner until counsel approves the text. */
export function LegalPage({ title, updated, draft = true, children }: { title: string; updated: string; draft?: boolean; children: ReactNode }) {
  return (
    <section className="bg-paper pt-[calc(var(--header-h)+3.5rem)] pb-24">
      <Container className="max-w-3xl">
        <Eyebrow>Legal</Eyebrow>
        <h1 className="t-h1 mt-5 text-ink-950">{title}</h1>
        <p className="mt-4 text-sm text-ink-600">Last updated: {updated}</p>
        {draft && (
          <div className="content-pending mt-8 rounded-2xl p-5" data-content-pending="true" role="note">
            <p className="font-semibold text-ink-900">Draft for legal review</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-700">
              This text describes how the website currently works. It has not yet been reviewed by legal counsel and must be approved before launch.
            </p>
          </div>
        )}
        <div className="mt-10 space-y-8 leading-relaxed text-ink-800 [&_h2]:t-h3 [&_h2]:text-ink-950 [&_li]:mt-2 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </Container>
    </section>
  );
}
