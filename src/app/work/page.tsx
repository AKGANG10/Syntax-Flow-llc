import type { Metadata } from "next";
import { PillarNode } from "@/components/journey";
import { Container, CtaBand, PageHero, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Work: Case Studies",
  description: "Technology projects and talent success stories from Syntax Flow, published only with client permission and verified results.",
  alternates: { canonical: "/work" },
};

const format = ["Client / industry", "Challenge", "Solution", "Impact", "Technology"];

const slots = [
  { kind: "Technology project", pillar: "technology" as const, note: "An approved project with verified results." },
  { kind: "Talent success story", pillar: "talent" as const, note: "An approved placement with real time-to-fill, quality and retention figures." },
  { kind: "Technology + Talent engagement", pillar: "both" as const, note: "An approved engagement where Syntax Flow built the solution and staffed the team." },
];

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Results we can stand behind."
        lead="We publish case studies only with our clients' permission, and only with numbers we have verified. Every story follows the same structure so you can compare like with like."
        motifSeed={53}
      />

      <Section tone="white" aria-labelledby="work-format">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <SectionHeading id="work-format" eyebrow="How we report" title="Every case study answers five questions." />
          <ol className="divide-y divide-ink-200 border-y border-ink-200">
            {format.map((f, i) => (
              <li key={f} className="flex items-baseline gap-6 py-5">
                <span className="font-mono text-xs text-flow-700">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[clamp(1.4rem,1.1rem+1vw,2rem)] font-extrabold tracking-[-0.03em] text-ink-950">{f}</span>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="ink" aria-labelledby="work-stories" className="noise">
        <div aria-hidden="true" className="bg-grid-dark mask-fade-y pointer-events-none absolute inset-0" />
        <Container className="relative">
          <SectionHeading id="work-stories" tone="dark" eyebrow="Case studies" title="Published case studies" lead="New stories appear here as clients approve them." />
          <div className="mt-12 space-y-5">
            {slots.map((s) => (
              <article
                key={s.kind}
                className="grid gap-6 rounded-[var(--radius-panel)] border-[1.5px] border-dashed border-white/20 p-8 sm:p-10 lg:grid-cols-[0.9fr_1.6fr]"
                data-content-pending="true"
              >
                <div>
                  <p className="t-label text-ink-400">Content pending</p>
                  <h3 className="mt-4 flex items-center gap-3 text-2xl font-extrabold tracking-[-0.03em] text-white">
                    <PillarNode pillar={s.pillar} className="size-4" />
                    {s.kind}
                  </h3>
                  <p className="mt-2 text-ink-300">{s.note}</p>
                </div>
                <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-5">
                  {format.map((f) => (
                    <div key={f} className="bg-ink-950 p-4">
                      <dt className="font-mono text-[0.65rem] tracking-[0.14em] text-ink-400 uppercase">{f}</dt>
                      <dd className="mt-3">
                        <span className="sr-only">Not yet published</span>
                        <span aria-hidden="true" className="block h-2 w-3/4 rounded-full bg-white/10" />
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Have a challenge worth writing about?"
        actions={[
          { label: "Start a Conversation", href: "/contact" },
          { label: "Find Talent", href: "/contact?need=talent" },
        ]}
      />
    </>
  );
}
