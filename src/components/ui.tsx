import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { bundleY, defaultLeads, leadY, makeBundle, samplePath, strandRgb } from "@/lib/strands";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-[78rem] px-5 sm:px-8 lg:px-12", className)}>{children}</div>;
}

type Tone = "paper" | "white" | "ink";

const toneClass: Record<Tone, string> = {
  paper: "bg-paper text-ink-900",
  white: "bg-white text-ink-900",
  ink: "bg-ink-950 text-white",
};

export function Section({
  tone = "paper",
  className,
  children,
  ...rest
}: { tone?: Tone; className?: string; children: ReactNode } & Omit<ComponentProps<"section">, "className" | "children">) {
  return (
    <section className={cx(toneClass[tone], "relative py-20 sm:py-24 lg:py-28", className)} data-tone={tone} {...rest}>
      {children}
    </section>
  );
}

/** Mono label with an open ring node, echoing the logo's ring nodes. */
export function Eyebrow({ children, tone = "light", className }: { children: ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p className={cx("t-label flex items-center gap-2.5", tone === "dark" ? "text-flow-300" : "text-flow-700", className)}>
      <span
        aria-hidden="true"
        className={cx("inline-block size-2.5 rounded-full border-[1.5px]", tone === "dark" ? "border-flow-300" : "border-ink-800")}
      />
      {children}
    </p>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={cx("size-4 shrink-0", className)}>
      <path d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Variant = "primary" | "secondary" | "invert" | "outline-invert";

const variantClass: Record<Variant, string> = {
  primary: "bg-ink-900 text-white hover:bg-ink-700 shadow-soft",
  secondary: "bg-white text-ink-900 ring-1 ring-inset ring-ink-200 hover:ring-ink-400",
  invert: "bg-white text-ink-950 hover:bg-flow-100",
  "outline-invert": "text-white ring-1 ring-inset ring-white/30 hover:ring-white/70 hover:bg-white/5",
};

export const buttonClass = (variant: Variant = "primary", size: "md" | "sm" = "md") =>
  cx(
    "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,box-shadow,color] duration-[var(--duration-fast)] ease-[var(--ease-flow)]",
    "focus-visible:outline-offset-4",
    size === "md" ? "min-h-12 px-6 text-[0.95rem]" : "min-h-10 px-4.5 text-sm",
    variantClass[variant],
  );

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  arrow = true,
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: "md" | "sm";
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cx(buttonClass(variant, size), className)}>
      {children}
      {arrow && <ArrowIcon className="transition-transform duration-[var(--duration-normal)] ease-[var(--ease-flow)] group-hover:translate-x-0.5" />}
    </Link>
  );
}

export function TextLink({ href, children, tone = "light" }: { href: string; children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <Link
      href={href}
      className={cx("group inline-flex items-center gap-1.5 font-semibold", tone === "dark" ? "text-flow-300" : "text-flow-700")}
    >
      <span className="strand-link">{children}</span>
      <ArrowIcon className="transition-transform duration-[var(--duration-normal)] group-hover:translate-x-0.5" />
    </Link>
  );
}

/**
 * Marks content the client still has to supply (case studies, leadership,
 * certifications). Intentionally conspicuous so it cannot ship unnoticed.
 * Search the codebase for <ContentPending to list every open slot.
 */
export function ContentPending({ title, note, className }: { title: string; note: string; className?: string }) {
  return (
    <div className={cx("content-pending rounded-[var(--radius-card)] p-6", className)} data-content-pending="true">
      <p className="t-label text-ink-500">Content pending</p>
      <p className="mt-3 font-semibold text-ink-800">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{note}</p>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "light",
  id,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "light" | "dark";
  id?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cx("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow tone={tone} className={cx(align === "center" && "justify-center")}>{eyebrow}</Eyebrow>}
      <h2 id={id} className={cx("t-h2 mt-4", tone === "dark" ? "text-white" : "text-ink-950")}>
        {title}
      </h2>
      {lead && <p className={cx("t-lead mt-5", tone === "dark" ? "text-ink-300" : "text-ink-600")}>{lead}</p>}
    </div>
  );
}

/** Static, server-rendered strand motif for interior page heroes and bands. */
export function StrandMotif({
  className,
  count = 22,
  t = 1.4,
  seed = 7,
  width = 1200,
  height = 360,
  spread = 0.36,
}: {
  className?: string;
  count?: number;
  t?: number;
  seed?: number;
  width?: number;
  height?: number;
  spread?: number;
}) {
  const bundle = makeBundle(count, seed);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      {bundle.map((s, i) => (
        <path
          key={i}
          d={samplePath((x) => bundleY(s, x, t, spread), width, height)}
          fill="none"
          stroke={`rgb(${strandRgb(s.depth)})`}
          strokeOpacity={s.alpha}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {defaultLeads.slice(0, 2).map((l, i) => (
        <path
          key={`l${i}`}
          d={samplePath((x) => leadY(l, x, t, spread), width, height)}
          fill="none"
          stroke="#15263b"
          strokeOpacity={0.85}
          strokeWidth={1.6}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  motifSeed = 7,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  children?: ReactNode;
  motifSeed?: number;
}) {
  return (
    <section className="relative overflow-hidden bg-paper pt-[calc(var(--header-h)+3.5rem)] pb-16 sm:pb-20 lg:pt-[calc(var(--header-h)+5rem)] lg:pb-24">
      <StrandMotif
        seed={motifSeed}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] w-full opacity-60 [mask-image:linear-gradient(to_right,transparent,black_20%,black_85%,transparent)] lg:left-[35%] lg:h-full lg:w-[65%]"
      />
      <Container className="relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="t-h1 mt-5 max-w-4xl text-ink-950">{title}</h1>
        <div className="t-lead mt-6 max-w-2xl text-ink-600">{lead}</div>
        {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
      </Container>
    </section>
  );
}

export function CtaBand({
  title,
  lead,
  actions,
}: {
  title: ReactNode;
  lead?: ReactNode;
  actions: { label: string; href: string; variant?: Variant }[];
}) {
  return (
    <Section tone="ink" className="overflow-hidden">
      <StrandMotif
        seed={19}
        t={3.1}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-35 mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent,black_40%,black_70%,transparent)]"
      />
      <Container className="relative">
        <div className="max-w-3xl">
          <h2 className="t-h2 text-white">
            {title}
          </h2>
          {lead && <p className="t-lead mt-5 text-ink-300">{lead}</p>}
          <div className="mt-9 flex flex-wrap gap-3">
            {actions.map((a, i) => (
              <ButtonLink key={a.href} href={a.href} variant={a.variant ?? (i === 0 ? "invert" : "outline-invert")}>
                {a.label}
              </ButtonLink>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
