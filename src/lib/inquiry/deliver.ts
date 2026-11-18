import "server-only";
import {
  areaOptions,
  budgetOptions,
  candidateEngagementOptions,
  headcountOptions,
  hiringEngagementOptions,
  labelFor,
  timelineOptions,
  workPreferenceOptions,
} from "./options";
import type { Inquiry } from "./schema";

/**
 * Delivery adapter. The provider is chosen explicitly with INQUIRY_DELIVERY:
 *
 *   emailjs  EmailJS REST API, called from the server (keys never reach the browser)
 *   log      prints a redacted line to the server console; development and E2E only
 *
 * Unset: "log" in development, refusal (not_configured) everywhere else. The
 * endpoint never reports success for an inquiry that was not delivered.
 * Setup: docs/EMAIL_SETUP.md.
 */

export type DeliveryResult =
  | { ok: true; provider: "emailjs" | "log" }
  | { ok: false; reason: "not_configured" | "provider_error" | "timeout"; detail?: string };

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const TIMEOUT_MS = 10_000;

/** E2E only: point the real adapter at a local mock. Ignored outside test mode. */
function emailjsEndpoint() {
  const override = process.env.E2E_TEST_MODE === "1" ? process.env.EMAILJS_API_URL : undefined;
  return override || EMAILJS_ENDPOINT;
}

function mode(): "emailjs" | "log" | null {
  const configured = process.env.INQUIRY_DELIVERY?.trim().toLowerCase();
  const isProd = process.env.NODE_ENV === "production";
  const e2e = process.env.E2E_TEST_MODE === "1";
  if (configured === "emailjs") return "emailjs";
  if (configured === "log") return !isProd || e2e ? "log" : null;
  if (!configured && !isProd) return "log";
  return null;
}

const kindLabel: Record<Inquiry["kind"], string> = {
  technology: "Technology inquiry",
  talent: "Talent request",
  both: "Technology + Talent inquiry",
  transformation: "Transformation inquiry",
  candidate: "Talent network sign-up",
};

/** Plain-text summary used as the email body. */
export function summarize(inq: Inquiry, reference: string, submittedAt: string) {
  const rows: [string, string | undefined][] = [
    ["Reference", reference],
    ["Type", kindLabel[inq.kind]],
    ["Submitted", submittedAt],
    ["Name", inq.name],
    ["Email", inq.email],
    ["Phone", inq.phone],
  ];
  switch (inq.kind) {
    case "technology":
      rows.push(
        ["Company", inq.company],
        ["Industry", inq.industry],
        ["Areas", inq.areas.map((a) => labelFor(areaOptions, a)).join(", ")],
        ["Timeline", labelFor(timelineOptions, inq.timeline)],
        ["Budget", labelFor(budgetOptions, inq.budget)],
        ["What they want to build", inq.project],
      );
      break;
    case "talent":
      rows.push(
        ["Company", inq.company],
        ["People needed", labelFor(headcountOptions, inq.headcount)],
        ["Engagement", labelFor(hiringEngagementOptions, inq.engagement)],
        ["Location", inq.location],
        ["Timeline", labelFor(timelineOptions, inq.timeline)],
        ["Roles / team", inq.roles],
      );
      break;
    case "both":
    case "transformation":
      rows.push(
        ["Company", inq.company],
        ["Areas", inq.areas.map((a) => labelFor(areaOptions, a)).join(", ")],
        ["People needed", labelFor(headcountOptions, inq.headcount)],
        ["Timeline", labelFor(timelineOptions, inq.timeline)],
        ["Goal", inq.goal],
      );
      break;
    case "candidate":
      rows.push(
        ["Location", inq.location],
        ["Preferred roles", inq.roles],
        ["Skills", inq.skills],
        ["Work preference", labelFor(workPreferenceOptions, inq.workPreference)],
        ["Engagement", labelFor(candidateEngagementOptions, inq.engagement)],
        ["Profile / portfolio", inq.profileUrl],
        ["Message", inq.message],
        ["Privacy notice acknowledged", "Yes"],
      );
      break;
  }
  return rows
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => (String(v).includes("\n") ? `${k}:\n${v}` : `${k}: ${v}`))
    .join("\n");
}

export function deliveryConfigured() {
  return mode() !== null;
}

export async function deliver(inq: Inquiry, reference: string): Promise<DeliveryResult> {
  const m = mode();
  const now = new Date();
  // Dallas time for the people reading the email, plus UTC for an unambiguous record.
  const dallas = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(now);
  const submittedAt = `${dallas} (${now.toISOString().slice(0, 16).replace("T", " ")} UTC)`;

  if (m === "log") {
    // Redacted on purpose: no names, emails or message content in logs.
    console.info(`[inquiry] ${reference} ${inq.kind} accepted (log delivery, not emailed)`);
    return { ok: true, provider: "log" };
  }

  if (m !== "emailjs") return { ok: false, reason: "not_configured" };

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = (inq.kind === "candidate" && process.env.EMAILJS_TEMPLATE_ID_CANDIDATE) || process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  if (!serviceId || !templateId || !publicKey || !privateKey) return { ok: false, reason: "not_configured" };

  const subject = `${kindLabel[inq.kind]} from ${inq.name} (${reference})`;
  const body = summarize(inq, reference, submittedAt);

  try {
    const res = await fetch(emailjsEndpoint(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {
          subject,
          inquiry_type: kindLabel[inq.kind],
          reference,
          from_name: inq.name,
          reply_to: inq.email,
          submitted_at: submittedAt,
          body,
          // Aliases for EmailJS's stock templates, so either variable style fills in.
          title: subject,
          name: inq.name,
          email: inq.email,
          message: body,
          time: submittedAt,
          phone: inq.phone,
          company: "company" in inq ? inq.company : "",
        },
      }),
    });
    if (res.ok) return { ok: true, provider: "emailjs" };
    const detail = (await res.text().catch(() => "")).slice(0, 200);
    console.error(`[inquiry] ${reference} emailjs rejected: ${res.status} ${detail}`);
    return { ok: false, reason: "provider_error", detail: String(res.status) };
  } catch (err) {
    const timeout = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError");
    console.error(`[inquiry] ${reference} emailjs ${timeout ? "timed out" : "failed"}`);
    return { ok: false, reason: timeout ? "timeout" : "provider_error" };
  }
}
