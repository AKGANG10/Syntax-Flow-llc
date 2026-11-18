import type { Metadata } from "next";
import { CommandCenter } from "@/components/dashboard/command-center";
import { MiniViz } from "@/components/mini-viz";
import { Container, CtaBand, Eyebrow, Section, SectionHeading } from "@/components/ui";
import { demoLabel } from "@/content/demo-data";

export const metadata: Metadata = {
  title: "Digital Command Center (Interactive Demo)",
  description:
    "An interactive concept experience with sample data: how Syntax Flow brings systems, data, AI and people into one view. We design and build platforms like this for clients.",
  alternates: { canonical: "/platform" },
};

const shows = [
  {
    title: "Platforms we build for clients",
    text: "Operational dashboards, data platforms, observability and internal tools, engineered by our IT services teams.",
    viz: "managed" as const,
  },
  {
    title: "Talent intelligence",
    text: "Pipeline, skills coverage and matching views like these help hiring teams see where the gaps are.",
    viz: "talent" as const,
  },
  {
    title: "AI with human review",
    text: "AI can triage, summarize and recommend. Consequential decisions stay with people, and the interface shows it.",
    viz: "ai" as const,
  },
];

export default function PlatformPage() {
  return (
    <>
      <section className="noise relative isolate overflow-hidden bg-ink-950 pt-[calc(var(--header-h)+3.5rem)] pb-16 text-white lg:pt-[calc(var(--header-h)+5rem)] lg:pb-20">
        <div aria-hidden="true" className="bg-grid-dark mask-radial absolute inset-0 -z-10" />
        <div aria-hidden="true" className="absolute -top-40 left-1/2 -z-10 size-[54rem] -translate-x-1/2 rounded-full bg-flow-600/25 blur-[150px]" />
        <Container>
          <div className="fade-up">
            <Eyebrow tone="dark">Platform · Concept experience</Eyebrow>
          </div>
          <h1 className="fade-up t-h1 mt-5 max-w-4xl text-white" style={{ ["--d" as string]: "90ms" }}>
            Syntax Flow Digital Command Center.
          </h1>
          <p className="fade-up t-lead mt-6 max-w-2xl text-ink-300" style={{ ["--d" as string]: "200ms" }}>
            One view of technology, data, AI and people. Explore every module below. This is an interactive demo with sample data: it shows the kind of platform we build, not a
            product we sell or live client systems.
          </p>
          <p className="fade-up mt-6 inline-flex rounded-full bg-signal-400/12 px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.14em] text-signal-300 uppercase ring-1 ring-signal-400/30" style={{ ["--d" as string]: "300ms" }}>
            {demoLabel}
          </p>
          <div className="fade-up mt-12" style={{ ["--d" as string]: "380ms" }}>
            <CommandCenter />
          </div>
        </Container>
      </section>

      <Section tone="white" aria-labelledby="platform-shows">
        <Container>
          <SectionHeading id="platform-shows" eyebrow="What it demonstrates" title="Built the way we build for clients." />
          <ul className="mt-12 grid gap-5 lg:grid-cols-3">
            {shows.map((s) => (
              <li key={s.title} className="group reveal rounded-[var(--radius-panel)] bg-paper p-8 ring-1 ring-ink-100">
                <div className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-ink-100">
                  <div aria-hidden="true" className="bg-grid mask-radial absolute inset-0" />
                  <MiniViz kind={s.viz} className="relative mx-auto h-32 w-full max-w-56" />
                </div>
                <h3 className="t-h3 mt-6 text-ink-950">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{s.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        title="Want a command center for your organization?"
        lead="We design and build data platforms, dashboards and the teams to run them."
        actions={[
          { label: "Build With Us", href: "/contact?need=technology" },
          { label: "Talk to an Expert", href: "/contact?need=both" },
        ]}
      />
    </>
  );
}
