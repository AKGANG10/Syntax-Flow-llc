import { cx } from "./ui";

type Step = { step: string; text: string };

/**
 * Steps sit on alternating peaks and troughs of one strand, like the ring
 * nodes on the logo's lead strands. Desktop: horizontal. Mobile: vertical.
 */
export function LifecycleRail({ steps, tone = "light" }: { steps: readonly Step[]; tone?: "light" | "dark" }) {
  const n = steps.length;
  const amp = 30;
  const mid = 50;
  const path = (phase: number, a: number) => {
    let d = "";
    for (let i = 0; i <= 120; i++) {
      const x = i / 120;
      // Minus: SVG y grows downward, so step 1 (even index) sits on a peak, matching its node.
      const y = mid - a * Math.cos(Math.PI * (x * n - 0.5) + phase);
      d += `${i ? "L" : "M"}${(x * 1000).toFixed(1)} ${y.toFixed(2)}`;
    }
    return d;
  };
  const dark = tone === "dark";

  return (
    <ol className="relative">
      {/* Desktop strand */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 hidden h-[100px] lg:block">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          {[0.35, 0.7, -0.4].map((p, i) => (
            <path key={i} d={path(p, amp * 0.85)} fill="none" stroke="#86c0e0" strokeOpacity={0.45} strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ))}
          <path d={path(0, amp)} fill="none" stroke={dark ? "#b9dbee" : "#15263b"} strokeWidth={1.75} vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <div className="grid gap-0 lg:grid-cols-6 lg:gap-6">
        {steps.map((s, i) => {
          const up = i % 2 === 0;
          return (
            <li key={s.step} className="relative flex gap-5 pb-10 last:pb-0 lg:block lg:pb-0">
              {/* Mobile vertical connector */}
              {i < n - 1 && (
                <span aria-hidden="true" className={cx("absolute top-6 bottom-0 left-[0.6875rem] w-px lg:hidden", dark ? "bg-white/20" : "bg-ink-200")} />
              )}
              <div className="relative h-[100px] shrink-0 max-lg:h-auto">
                <span
                  aria-hidden="true"
                  className={cx(
                    "relative z-10 block size-6 rounded-full border-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2",
                    up ? "lg:top-[20px]" : "lg:top-[80px]",
                    dark ? "border-flow-200 bg-ink-950" : "border-ink-800 bg-paper",
                  )}
                />
              </div>
              <div className="lg:mt-6 lg:text-center">
                <p className={cx("t-label", dark ? "text-flow-300" : "text-flow-700")}>{String(i + 1).padStart(2, "0")}</p>
                <h3 className={cx("t-h3 mt-2", dark ? "text-white" : "text-ink-950")}>{s.step}</h3>
                <p className={cx("mt-2 text-[0.95rem] leading-relaxed", dark ? "text-ink-300" : "text-ink-600")}>{s.text}</p>
              </div>
            </li>
          );
        })}
      </div>
    </ol>
  );
}
