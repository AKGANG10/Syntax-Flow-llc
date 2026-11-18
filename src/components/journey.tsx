import { cx } from "./ui";

export type Pillar = "technology" | "talent" | "both";
export type JourneyStep = { title: string; text: string; pillar: Pillar };

const pillarLabel: Record<Pillar, string> = {
  technology: "Technology",
  talent: "Talent",
  both: "Technology + Talent",
};

/** Node vocabulary from the logo: filled = systems, ring = people, ring around fill = both (the "o" in Flow). */
export function PillarNode({ pillar, className }: { pillar: Pillar; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "block rounded-full",
        pillar === "technology" && "bg-flow-500",
        pillar === "talent" && "border-[2.5px] border-ink-800 bg-white",
        pillar === "both" && "border-[2.5px] border-ink-800 bg-flow-500",
        className,
      )}
    />
  );
}

export function JourneyLegend() {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-700" aria-label="Legend">
      {(["technology", "talent", "both"] as const).map((p) => (
        <li key={p} className="flex items-center gap-2.5">
          <PillarNode pillar={p} className="size-4" />
          {pillarLabel[p]}
        </li>
      ))}
    </ul>
  );
}

export function Journey({ steps }: { steps: JourneyStep[] }) {
  return (
    <div className="relative">
      <span aria-hidden="true" className="absolute top-3 bottom-3 left-[0.9375rem] w-0.5 rounded-full bg-ink-100 sm:left-[1.1875rem]" />
      <span aria-hidden="true" className="journey-fill absolute top-3 bottom-3 left-[0.9375rem] w-0.5 rounded-full bg-flow-500 sm:left-[1.1875rem]" />
      <ol className="relative space-y-4">
        {steps.map((s, i) => (
          <li key={s.title} className="reveal flex gap-5 sm:gap-7">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-paper sm:size-10">
              <PillarNode pillar={s.pillar} className="size-5 sm:size-6" />
            </div>
            <div className="flex-1 rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink-100 sm:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="t-h3 text-ink-950">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="t-label text-ink-500">{pillarLabel[s.pillar]}</p>
              </div>
              <p className="mt-2 leading-relaxed text-ink-600">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
