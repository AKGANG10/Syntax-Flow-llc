import { overview, talent } from "@/content/demo-data";
import { Sparkline } from "./charts";

/** Small dashboard fragments floating in the hero (desktop). Decorative and labelled as demo. */
export function HeroFragments() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute right-[4%] bottom-[9%] z-10 hidden w-64 space-y-3 xl:block">
      <div className="glass fade-up translate-x-10 rounded-2xl p-4" style={{ ["--d" as string]: "1100ms" }}>
        <p className="flex items-center justify-between font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">
          <span>System health</span>
          <span className="text-flow-700">Demo</span>
        </p>
        <p className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-ink-950">{overview.systemHealth}%</p>
        <Sparkline data={overview.throughput} className="mt-1 [&_polyline]:stroke-flow-600" />
      </div>
      <div className="glass fade-up rounded-2xl p-4" style={{ ["--d" as string]: "1250ms" }}>
        <p className="flex items-center justify-between font-mono text-[0.6rem] tracking-[0.14em] text-ink-500 uppercase">
          <span>Talent matched</span>
          <span className="text-flow-700">Demo</span>
        </p>
        <p className="mt-1 flex items-baseline gap-2 text-2xl font-extrabold tracking-[-0.03em] text-ink-950">
          {talent.matches.length * 4}
          <span className="text-xs font-semibold text-ink-500">roles this week</span>
        </p>
      </div>
    </div>
  );
}
