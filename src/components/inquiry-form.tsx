"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react";
import {
  areaOptions,
  budgetOptions,
  candidateEngagementOptions,
  headcountOptions,
  hiringEngagementOptions,
  limits,
  needs,
  timelineOptions,
  workPreferenceOptions,
  type Need,
} from "@/lib/inquiry/options";
import { buttonClass, cx } from "./ui";

type Kind = Need | "candidate";
type Errors = Record<string, string>;
type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; reference: string; name: string; email: string; duplicate: boolean }
  | { state: "error"; message: string };

const CONTACT_EMAIL = "hr@syntaxflowllc.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ---------------------------------------------------------------- fields */

type FieldBase = { name: string; label: string; required?: boolean; hint?: string; error?: string; prefix: string };

function describedBy(prefix: string, name: string, hint?: string, error?: string) {
  return [hint && `${prefix}-${name}-hint`, error && `${prefix}-${name}-error`].filter(Boolean).join(" ") || undefined;
}

function Label({ prefix, name, label, required }: Pick<FieldBase, "prefix" | "name" | "label" | "required">) {
  return (
    <label htmlFor={`${prefix}-${name}`} className="block text-[0.95rem] font-semibold text-ink-900">
      {label}
      {required ? <span className="ml-1 text-danger" aria-hidden="true">*</span> : <span className="ml-1.5 text-sm font-normal text-ink-500">(optional)</span>}
    </label>
  );
}

function Messages({ prefix, name, hint, error }: Pick<FieldBase, "prefix" | "name" | "hint" | "error">) {
  return (
    <>
      {hint && (
        <p id={`${prefix}-${name}-hint`} className="mt-1.5 text-sm text-ink-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${prefix}-${name}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </>
  );
}

const controlClass = (error?: string) =>
  cx(
    "mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-base text-ink-950 placeholder:text-ink-400",
    "transition-[border-color,box-shadow] duration-[var(--duration-fast)] focus:border-flow-500 focus:ring-4 focus:ring-flow-100 focus:outline-none",
    error ? "border-danger" : "border-ink-200 hover:border-ink-300",
  );

function TextField({
  type = "text",
  autoComplete,
  maxLength,
  inputMode,
  ...f
}: FieldBase & { type?: string; autoComplete?: string; maxLength?: number; inputMode?: "email" | "tel" | "url" | "text" }) {
  return (
    <div>
      <Label {...f} />
      <input
        id={`${f.prefix}-${f.name}`}
        name={f.name}
        type={type}
        autoComplete={autoComplete}
        maxLength={maxLength}
        inputMode={inputMode}
        required={f.required}
        aria-required={f.required || undefined}
        aria-invalid={f.error ? true : undefined}
        aria-describedby={describedBy(f.prefix, f.name, f.hint, f.error)}
        className={controlClass(f.error)}
      />
      <Messages {...f} />
    </div>
  );
}

function TextArea({ rows = 5, maxLength = limits.long, ...f }: FieldBase & { rows?: number; maxLength?: number }) {
  return (
    <div>
      <Label {...f} />
      <textarea
        id={`${f.prefix}-${f.name}`}
        name={f.name}
        rows={rows}
        maxLength={maxLength}
        required={f.required}
        aria-required={f.required || undefined}
        aria-invalid={f.error ? true : undefined}
        aria-describedby={describedBy(f.prefix, f.name, f.hint, f.error)}
        className={cx(controlClass(f.error), "resize-y leading-relaxed")}
      />
      <Messages {...f} />
    </div>
  );
}

function SelectField({ options, ...f }: FieldBase & { options: readonly { value: string; label: string }[] }) {
  return (
    <div>
      <Label {...f} />
      <div className="relative">
        <select
          id={`${f.prefix}-${f.name}`}
          name={f.name}
          required={f.required}
          defaultValue=""
          aria-required={f.required || undefined}
          aria-invalid={f.error ? true : undefined}
          aria-describedby={describedBy(f.prefix, f.name, f.hint, f.error)}
          className={cx(controlClass(f.error), "appearance-none pr-10")}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg viewBox="0 0 12 12" aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 mt-1 size-3.5 -translate-y-1/2 text-ink-700">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      <Messages {...f} />
    </div>
  );
}

function ChoiceChips({ name, legend, options, prefix }: { name: string; legend: string; options: readonly { value: string; label: string }[]; prefix: string }) {
  return (
    <fieldset>
      <legend className="text-[0.95rem] font-semibold text-ink-900">
        {legend} <span className="ml-0.5 text-sm font-normal text-ink-500">(optional, choose any)</span>
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer">
            <input id={`${prefix}-${name}-${o.value}`} type="checkbox" name={name} value={o.value} className="peer sr-only" />
            <span className="flex min-h-10 items-center gap-2 rounded-full border border-ink-200 bg-white px-4 text-sm font-medium text-ink-800 transition-colors peer-checked:border-flow-600 peer-checked:bg-flow-50 peer-checked:text-ink-950 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-flow-500 hover:border-ink-400">
              <span aria-hidden="true" className="size-2 rounded-full border border-ink-400 [input:checked+span_&]:border-flow-600 [input:checked+span_&]:bg-flow-500" />
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-6">
      <legend className="t-label mb-6 text-flow-700">{title}</legend>
      {children}
    </fieldset>
  );
}

/* ------------------------------------------------------ client validation */

function validate(kind: Kind, d: FormData): Errors {
  const e: Errors = {};
  const s = (k: string) => String(d.get(k) ?? "").trim();
  const req = (k: string, msg: string) => {
    if (!s(k)) e[k] = msg;
  };
  const detail = (k: string, msg: string) => {
    if (s(k).length < limits.minDetail) e[k] = msg;
  };

  req("name", "Enter your name.");
  if (!EMAIL_RE.test(s("email"))) e.email = "Enter a valid email address.";
  if (s("phone") && !/^[+()\d\s.-]*$/.test(s("phone"))) e.phone = "Use digits, spaces and + ( ) - only.";

  if (kind === "technology") {
    detail("project", "Tell us a little about what you want to build (at least 10 characters).");
    req("timeline", "Choose a timeline.");
  }
  if (kind === "talent") {
    req("company", "Enter your company name.");
    detail("roles", "Describe the role or team you need (at least 10 characters).");
    req("headcount", "Choose how many people you need.");
    req("engagement", "Choose an engagement type.");
    req("timeline", "Choose a timeline.");
  }
  if (kind === "both") {
    detail("goal", "Tell us what you are trying to accomplish (at least 10 characters).");
    req("timeline", "Choose a timeline.");
  }
  if (kind === "candidate") {
    req("location", "Enter your city and state, or country.");
    req("roles", "Tell us which roles you are interested in.");
    req("skills", "List your main skills.");
    req("workPreference", "Choose a work preference.");
    req("engagement", "Choose an engagement type.");
    const url = s("profileUrl");
    if (url && !/^https:\/\/\S+\.\S+/.test(url)) e.profileUrl = "Enter a full https:// link, or leave this empty.";
    if (d.get("consent") !== "on") e.consent = "Please confirm you have read the privacy notice.";
  }
  return e;
}

function toPayload(kind: Kind, d: FormData, elapsedMs: number) {
  const out: Record<string, unknown> = { kind, elapsedMs, hp: String(d.get("hp_field") ?? "") };
  for (const [k, v] of d.entries()) {
    if (k === "hp_field" || k === "areas" || k === "consent" || k === "need") continue;
    const value = String(v).trim();
    if (value) out[k] = value;
  }
  if (kind === "technology" || kind === "both") out.areas = d.getAll("areas").map(String);
  if (kind === "candidate") out.consent = d.get("consent") === "on";
  return out;
}

/* ------------------------------------------------------------ the engine */

function useInquiry(kind: Kind) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<Errors>({});
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // When Activity hides this page, clear a finished submission so returning starts fresh.
  useLayoutEffect(
    () => () => {
      if (statusRef.current.state === "success") {
        setStatus({ state: "idle" });
        setErrors({});
      }
    },
    [],
  );

  useEffect(() => {
    if (status.state === "success") successRef.current?.focus();
  }, [status.state]);

  /** Errors in on-screen order, so the summary and focus follow what the user sees. */
  const inDomOrder = (errs: Errors): Errors => {
    const form = formRef.current;
    if (!form) return errs;
    const ordered: Errors = {};
    for (const el of Array.from(form.elements) as HTMLInputElement[]) {
      if (el.name && errs[el.name] && !ordered[el.name]) ordered[el.name] = errs[el.name];
    }
    return { ...ordered, ...errs };
  };

  const focusFirstError = (errs: Errors) => {
    const first = Object.keys(errs)[0];
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    if (el) el.focus();
    else summaryRef.current?.focus();
  };

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (status.state === "submitting") return;
    const data = new FormData(ev.currentTarget);
    const clientErrors = inDomOrder(validate(kind, data));
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) {
      setStatus({ state: "idle" });
      requestAnimationFrame(() => focusFirstError(clientErrors));
      return;
    }

    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(toPayload(kind, data, Date.now() - startedAt.current)),
        signal: AbortSignal.timeout(20_000),
      });
      const body = (await res.json().catch(() => null)) as
        | { ok: true; reference: string; duplicate?: boolean }
        | { ok: false; error: string; message: string; fields?: Errors }
        | null;

      if (res.ok && body?.ok) {
        setStatus({
          state: "success",
          reference: body.reference,
          name: String(data.get("name") ?? "").trim().split(/\s+/)[0] ?? "",
          email: String(data.get("email") ?? "").trim(),
          duplicate: Boolean(body.duplicate),
        });
        formRef.current?.reset();
        return;
      }
      if (body && !body.ok && body.fields) {
        const serverErrors = inDomOrder(body.fields);
        setErrors(serverErrors);
        setStatus({ state: "idle" });
        requestAnimationFrame(() => focusFirstError(serverErrors));
        return;
      }
      setStatus({
        state: "error",
        message: body && !body.ok ? body.message : `Something went wrong on our side. Please email ${CONTACT_EMAIL}.`,
      });
    } catch (err) {
      const timedOut = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
      setStatus({
        state: "error",
        message: timedOut
          ? `The request timed out. Please try again, or email ${CONTACT_EMAIL}.`
          : `We could not reach our server. Check your connection and try again, or email ${CONTACT_EMAIL}.`,
      });
    }
    requestAnimationFrame(() => summaryRef.current?.focus());
  }

  const reset = () => {
    setStatus({ state: "idle" });
    setErrors({});
    startedAt.current = Date.now();
  };

  return { status, errors, onSubmit, reset, formRef, successRef, summaryRef };
}

function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" name="hp_field" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

function ErrorSummary({ errors, status, summaryRef }: { errors: Errors; status: Status; summaryRef: RefObject<HTMLDivElement | null> }) {
  const list = Object.values(errors);
  const show = list.length > 0 || status.state === "error";
  return (
    <div ref={summaryRef} tabIndex={-1} role="alert" className="outline-none">
      {show && (
        <div className="rounded-2xl border border-danger/30 bg-danger-bg p-5 text-danger">
          {status.state === "error" ? (
            <p className="font-semibold">{status.message}</p>
          ) : (
            <>
              <p className="font-semibold">
                Please fix {list.length === 1 ? "1 field" : `${list.length} fields`} before sending:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {list.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Success({
  status,
  onReset,
  successRef,
  candidate,
}: {
  status: Extract<Status, { state: "success" }>;
  onReset: () => void;
  successRef: RefObject<HTMLDivElement | null>;
  candidate?: boolean;
}) {
  return (
    <div ref={successRef} tabIndex={-1} role="status" className="rounded-[var(--radius-panel)] bg-success-bg p-8 outline-none ring-1 ring-success/20 sm:p-10">
      <span aria-hidden="true" className="flex size-12 items-center justify-center rounded-full border-2 border-ink-800 bg-flow-500">
        <svg viewBox="0 0 20 20" className="size-5 text-white" fill="none">
          <path d="m5 10.5 3.2 3L15 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 className="t-h3 mt-6 text-ink-950">
        {status.duplicate ? "We already have this one." : candidate ? `Thank you${status.name ? `, ${status.name}` : ""}. You are in our network.` : `Thank you${status.name ? `, ${status.name}` : ""}. We have your message.`}
      </h2>
      <p className="mt-3 leading-relaxed text-ink-700">
        {status.duplicate
          ? "This exact submission reached us a few minutes ago, so we did not send it twice."
          : candidate
            ? "A recruiter will contact you when a role matches your skills and preferences."
            : "A member of our team will reply by email."}{" "}
        We will write to <span className="font-semibold text-ink-900">{status.email}</span>.
      </p>
      <p className="mt-5 font-mono text-sm text-ink-700">
        Reference: <span className="font-medium text-ink-950">{status.reference}</span>
      </p>
      <button type="button" onClick={onReset} className={cx(buttonClass("secondary", "sm"), "mt-7")}>
        {candidate ? "Submit another profile" : "Send another inquiry"}
      </button>
    </div>
  );
}

function SubmitRow({ submitting, label }: { submitting: boolean; label: string }) {
  return (
    <div className="flex flex-col gap-4 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-ink-600">
        Fields marked <span className="text-danger" aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required. See our{" "}
        <Link href="/privacy" className="font-semibold text-flow-700 underline underline-offset-4">
          privacy notice
        </Link>
        .
      </p>
      <button type="submit" disabled={submitting} aria-disabled={submitting} className={cx(buttonClass("primary"), "shrink-0 disabled:cursor-wait disabled:opacity-70")}>
        {submitting ? (
          <>
            <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Sending…
          </>
        ) : (
          label
        )}
      </button>
    </div>
  );
}

/* ------------------------------------------------------ business inquiry */

const needCards: { value: Need; title: string; text: string }[] = [
  { value: "technology", title: "I need technology", text: "Build, modernize or secure a system." },
  { value: "talent", title: "I need talent", text: "Hire specialists or a whole team." },
  { value: "both", title: "I need both", text: "The solution and the people to run it." },
];

export function BusinessInquiryForm() {
  const params = useSearchParams();
  const fromUrl = params.get("need");
  const [need, setNeed] = useState<Need>(needs.includes(fromUrl as Need) ? (fromUrl as Need) : "technology");
  const prefix = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { status, errors, onSubmit, reset, formRef, successRef, summaryRef } = useInquiry(need);

  const choose = (n: Need) => {
    setNeed(n);
    window.history.replaceState(null, "", `?need=${n}`);
  };

  if (status.state === "success") return <Success status={status} onReset={reset} successRef={successRef} />;

  const f = (name: string) => ({ name, prefix, error: errors[name] });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative space-y-10" aria-label="Business inquiry">
      <fieldset>
        <legend className="t-label mb-4 text-flow-700">What do you need?</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {needCards.map((c) => (
            <label key={c.value} className="cursor-pointer">
              <input
                type="radio"
                name="need"
                value={c.value}
                checked={need === c.value}
                onChange={() => choose(c.value)}
                className="peer sr-only"
              />
              <span className="flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-5 transition-[border-color,box-shadow] peer-checked:border-ink-900 peer-checked:shadow-soft peer-checked:ring-1 peer-checked:ring-ink-900 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-flow-500 hover:border-ink-400">
                <span className="font-semibold text-ink-950">{c.title}</span>
                <span className="mt-1 text-sm text-ink-600">{c.text}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-600">
          Looking for your next role instead?{" "}
          <Link href="/careers#join" className="font-semibold text-flow-700 underline underline-offset-4">
            Join our talent network
          </Link>
        </p>
      </fieldset>

      <ErrorSummary errors={errors} status={status} summaryRef={summaryRef} />

      <Group title="About the work">
        {need === "technology" && (
          <>
            <TextArea {...f("project")} label="What are you trying to build?" required hint="The problem, who it is for, and anything already in place." />
            <ChoiceChips name="areas" legend="Which areas are involved?" options={areaOptions} prefix={prefix} />
            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField {...f("timeline")} label="Timeline" required options={timelineOptions} />
              <SelectField {...f("budget")} label="Budget range" options={budgetOptions} />
            </div>
            <TextField {...f("industry")} label="Industry" maxLength={limits.short} />
          </>
        )}
        {need === "talent" && (
          <>
            <TextArea {...f("roles")} label="What kind of professional or team do you need?" required hint="Roles, key skills, seniority and anything unusual about the work." />
            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField {...f("headcount")} label="How many people?" required options={headcountOptions} />
              <SelectField {...f("engagement")} label="Engagement type" required options={hiringEngagementOptions} />
              <TextField {...f("location")} label="Work location" hint="City, region, or remote." maxLength={limits.short} />
              <SelectField {...f("timeline")} label="When do you need them?" required options={timelineOptions} />
            </div>
          </>
        )}
        {need === "both" && (
          <>
            <TextArea {...f("goal")} label="What are you trying to accomplish?" required hint="The business outcome, the system involved and the team you have today." />
            <ChoiceChips name="areas" legend="Which technology areas are involved?" options={areaOptions} prefix={prefix} />
            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField {...f("headcount")} label="Team size you expect to need" options={headcountOptions} />
              <SelectField {...f("timeline")} label="Timeline" required options={timelineOptions} />
            </div>
          </>
        )}
      </Group>

      <Group title="About you">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField {...f("name")} label="Full name" required autoComplete="name" maxLength={limits.name} />
          <TextField {...f("email")} label="Work email" required type="email" inputMode="email" autoComplete="email" maxLength={limits.email} />
          <TextField {...f("company")} label="Company" required={need === "talent"} autoComplete="organization" maxLength={limits.company} />
          <TextField {...f("phone")} label="Phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={limits.phone} />
        </div>
      </Group>

      <Honeypot />
      <SubmitRow submitting={status.state === "submitting"} label="Send inquiry" />
    </form>
  );
}

/* ------------------------------------------------------- talent network */

export function TalentNetworkForm() {
  const prefix = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { status, errors, onSubmit, reset, formRef, successRef, summaryRef } = useInquiry("candidate");

  if (status.state === "success") return <Success status={status} onReset={reset} successRef={successRef} candidate />;

  const f = (name: string) => ({ name, prefix, error: errors[name] });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative space-y-10" aria-label="Join our talent network">
      <ErrorSummary errors={errors} status={status} summaryRef={summaryRef} />

      <Group title="About you">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField {...f("name")} label="Full name" required autoComplete="name" maxLength={limits.name} />
          <TextField {...f("email")} label="Email" required type="email" inputMode="email" autoComplete="email" maxLength={limits.email} />
          <TextField {...f("phone")} label="Phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={limits.phone} />
          <TextField {...f("location")} label="Location" required hint="City and state, or country." autoComplete="address-level2" maxLength={limits.short} />
        </div>
      </Group>

      <Group title="Your work">
        <TextField {...f("roles")} label="Roles you are interested in" required hint="For example: backend engineer, cloud architect, QA lead." maxLength={limits.short * 2} />
        <TextArea {...f("skills")} label="Main skills" required rows={3} maxLength={limits.medium} hint="Languages, platforms, tools and certifications." />
        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField {...f("workPreference")} label="Work preference" required options={workPreferenceOptions} />
          <SelectField {...f("engagement")} label="Engagement" required options={candidateEngagementOptions} />
        </div>
        <TextField {...f("profileUrl")} label="LinkedIn, GitHub or portfolio link" type="url" inputMode="url" autoComplete="url" maxLength={300} hint="Must start with https://" />
        <TextArea {...f("message")} label="Anything else we should know?" rows={3} maxLength={limits.medium * 2} />
      </Group>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            id={`${prefix}-consent`}
            type="checkbox"
            name="consent"
            required
            aria-required
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${prefix}-consent-error` : undefined}
            className="mt-1 size-5 shrink-0 rounded border-ink-300 accent-ink-900"
          />
          <span className="text-[0.95rem] text-ink-800">
            I have read the{" "}
            <Link href="/privacy" className="font-semibold text-flow-700 underline underline-offset-4">
              privacy notice
            </Link>{" "}
            and agree that Syntax Flow may store these details to contact me about relevant opportunities.
            <span className="ml-1 text-danger" aria-hidden="true">*</span>
          </span>
        </label>
        {errors.consent && (
          <p id={`${prefix}-consent-error`} className="mt-1.5 pl-8 text-sm font-medium text-danger">
            {errors.consent}
          </p>
        )}
      </div>

      <Honeypot />
      <SubmitRow submitting={status.state === "submitting"} label="Join the network" />
    </form>
  );
}
