import { demoLabel } from "@/content/demo-data";
import { Container, Eyebrow, Section } from "../ui";
import { CommandCenter, type TabId } from "./command-center";

/** A solution page's matching dashboard view, embedded in a dark band. */
export function DashboardEmbed({ tab, eyebrow, title, lead, id }: { tab: TabId; eyebrow: string; title: string; lead: string; id: string }) {
  return (
    <Section tone="ink" aria-labelledby={id} className="noise overflow-hidden">
      <div aria-hidden="true" className="bg-grid-dark mask-fade-y pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/3 left-1/2 size-[44rem] -translate-x-1/2 rounded-full bg-flow-600/15 blur-[140px]" />
      <Container className="relative">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <Eyebrow tone="dark">{eyebrow}</Eyebrow>
            <h2 id={id} className="t-h2 mt-4 text-white">
              {title}
            </h2>
            <p className="t-lead mt-5 text-ink-300">{lead}</p>
          </div>
          <p className="font-mono text-[0.65rem] tracking-[0.14em] text-signal-300 uppercase">{demoLabel}</p>
        </div>
        <div className="mt-12">
          <CommandCenter initialTab={tab} />
        </div>
      </Container>
    </Section>
  );
}
