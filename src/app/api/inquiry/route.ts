import type { NextRequest } from "next/server";
import { company, siteUrl } from "@/content/site";
import { deliver } from "@/lib/inquiry/deliver";
import { clientKey, findDuplicate, fingerprint, newReference, rateLimit, rememberSubmission } from "@/lib/inquiry/guard";
import { MIN_FILL_MS } from "@/lib/inquiry/options";
import { fieldErrors, inquirySchema } from "@/lib/inquiry/schema";

const MAX_BYTES = 16 * 1024;
const fallback = `Please email ${company.email} or call ${company.phone.display}.`;

function json(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "cache-control": "no-store", ...headers } });
}

function fail(status: number, error: string, message: string, extra: Record<string, unknown> = {}, headers?: Record<string, string>) {
  return json(status, { ok: false, error, message, ...extra }, headers);
}

function originAllowed(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  const requestHost = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  return host === requestHost || host === new URL(siteUrl).host;
}

export async function POST(req: NextRequest) {
  // 1. Same-origin browsers only (CSRF and cross-site abuse protection).
  if (!originAllowed(req)) return fail(403, "forbidden_origin", "This form can only be submitted from the Syntax Flow website.");

  // 2. JSON only. Cross-site JSON requests also require a CORS preflight, which we never grant.
  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return fail(415, "unsupported_media", "Unsupported request format.");
  }

  // 3. Size limit before reading or parsing anything.
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BYTES) return fail(413, "too_large", "That submission is too long. Please shorten your message.");

  // 4. Rate limit per client.
  const limited = rateLimit(clientKey(req.headers));
  if (!limited.ok) {
    return fail(429, "rate_limited", "Too many submissions. Please wait a few minutes and try again.", { retryAfter: limited.retryAfter }, {
      "retry-after": String(limited.retryAfter),
    });
  }

  const raw = await req.text();
  if (raw.length > MAX_BYTES) return fail(413, "too_large", "That submission is too long. Please shorten your message.");

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return fail(400, "bad_json", "We could not read that submission. Please try again.");
  }

  // 5. Validate. Honeypot and timing are checked after the schema so bots get no special signal.
  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) {
    return fail(400, "validation", "Please check the highlighted fields.", { fields: fieldErrors(parsed.error) });
  }
  const inquiry = parsed.data;

  if (inquiry.hp || inquiry.elapsedMs < MIN_FILL_MS) {
    // Never a fake success: a person caught by this sees a clear way to reach us.
    return fail(422, "rejected", `We could not accept this submission automatically. ${fallback}`);
  }

  // 6. Duplicate protection: the same inquiry twice within the window is not sent twice.
  // Fingerprint the content only; timing and honeypot fields differ between otherwise identical sends.
  const print = fingerprint({ ...inquiry, hp: undefined, elapsedMs: undefined });
  const existing = findDuplicate(print);
  if (existing) return json(200, { ok: true, reference: existing, duplicate: true });

  // 7. Deliver.
  const reference = newReference();
  const result = await deliver(inquiry, reference);
  if (!result.ok) {
    if (result.reason === "not_configured") {
      console.error(`[inquiry] ${reference} rejected: delivery is not configured`);
      return fail(503, "not_configured", `Online inquiries are temporarily unavailable. ${fallback}`);
    }
    return fail(502, "delivery_failed", `Your message could not be sent right now. ${fallback}`);
  }

  rememberSubmission(print, reference);
  return json(201, { ok: true, reference });
}
