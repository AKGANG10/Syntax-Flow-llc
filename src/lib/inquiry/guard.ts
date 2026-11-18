import "server-only";
import { createHash, randomInt } from "node:crypto";

/**
 * In-memory abuse controls for the inquiry endpoint.
 *
 * LIMITATION: state is per server instance. On serverless or multi-instance
 * hosting each instance keeps its own counters, so limits are approximate.
 * Before high-traffic production use, move these to a shared store (for
 * example Redis or a platform KV) and keep the same interface.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = Number(process.env.INQUIRY_RATE_LIMIT_MAX ?? 5);
const DEDUPE_MS = 10 * 60 * 1000;
const MAX_KEYS = 5000;

const hits = new Map<string, number[]>();
const recent = new Map<string, { reference: string; at: number }>();

function prune<T>(map: Map<string, T>) {
  if (map.size <= MAX_KEYS) return;
  const drop = map.size - MAX_KEYS;
  let i = 0;
  for (const key of map.keys()) {
    if (i++ >= drop) break;
    map.delete(key);
  }
}

/** Sliding-window limit. Returns seconds to wait when the limit is hit. */
export function rateLimit(key: string, now = Date.now()): { ok: true } | { ok: false; retryAfter: number } {
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(key, list);
    return { ok: false, retryAfter: Math.ceil((WINDOW_MS - (now - list[0])) / 1000) };
  }
  list.push(now);
  hits.set(key, list);
  prune(hits);
  return { ok: true };
}

/** Same payload seen recently? Return its original reference instead of sending twice. */
export function findDuplicate(fingerprint: string, now = Date.now()) {
  const hit = recent.get(fingerprint);
  if (hit && now - hit.at < DEDUPE_MS) return hit.reference;
  if (hit) recent.delete(fingerprint);
  return null;
}

export function rememberSubmission(fingerprint: string, reference: string, now = Date.now()) {
  recent.set(fingerprint, { reference, at: now });
  prune(recent);
}

export function fingerprint(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

/**
 * Client address for rate limiting. Only trustworthy behind a proxy that
 * overwrites these headers (most managed hosts do). See docs/SECURITY.md.
 */
export function clientKey(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newReference() {
  let out = "SF-";
  for (let i = 0; i < 8; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}
