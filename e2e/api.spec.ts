import { expect, test, type APIRequestContext } from "@playwright/test";

/*
 * Failure-first tests for POST /api/inquiry. Each test uses its own client
 * address so rate-limit buckets do not interfere. Runs once (desktop project).
 */

test.beforeEach(({ isMobile }) => {
  test.skip(isMobile, "API behaviour is device independent");
});

// Random per call: parallel workers each load this module, so a counter would collide.
const octet = () => Math.floor(Math.random() * 254) + 1;
const nextIp = () => `10.${octet()}.${octet()}.${octet()}`;

function valid(overrides: Record<string, unknown> = {}) {
  return {
    kind: "talent",
    name: "API Tester",
    email: "api.tester@example.com",
    company: "Example Co",
    roles: "Two senior backend engineers with Kubernetes experience",
    headcount: "2-5",
    engagement: "contract",
    timeline: "asap",
    elapsedMs: 9000,
    hp: "",
    ...overrides,
  };
}

async function post(request: APIRequestContext, body: unknown, opts: { origin?: string | null; ip?: string; type?: string; raw?: string } = {}) {
  const headers: Record<string, string> = {
    "content-type": opts.type ?? "application/json",
    "x-forwarded-for": opts.ip ?? nextIp(),
  };
  const baseOrigin = new URL(test.info().project.use.baseURL!).origin;
  if (opts.origin !== null) headers.origin = opts.origin ?? baseOrigin;
  // A Buffer is sent byte-for-byte; a plain string may be re-encoded as JSON by Playwright.
  return request.post("/api/inquiry", { headers, data: Buffer.from(opts.raw ?? JSON.stringify(body)) });
}

test("accepts a valid inquiry", async ({ request }) => {
  const res = await post(request, valid({ email: `ok-${Date.now()}@example.com` }));
  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(body.ok).toBe(true);
  expect(body.reference).toMatch(/^SF-[A-Z0-9]{8}$/);
  expect(res.headers()["cache-control"]).toContain("no-store");
});

test("rejects other origins", async ({ request }) => {
  expect((await post(request, valid(), { origin: "https://evil.example" })).status()).toBe(403);
  expect((await post(request, valid(), { origin: null })).status()).toBe(403);
});

test("rejects non-JSON content", async ({ request }) => {
  const res = await post(request, null, { type: "text/plain", raw: "hello" });
  expect(res.status()).toBe(415);
});

test("rejects oversized payloads", async ({ request }) => {
  const res = await post(request, valid({ roles: "x".repeat(20_000) }));
  expect(res.status()).toBe(413);
});

test("rejects malformed JSON", async ({ request }) => {
  const res = await post(request, null, { raw: "{not json" });
  expect(res.status()).toBe(400);
  expect((await res.json()).error).toBe("bad_json");
});

test("returns field errors for invalid input", async ({ request }) => {
  const res = await post(request, valid({ email: "not-an-email", roles: "short", headcount: "lots" }));
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body.error).toBe("validation");
  expect(Object.keys(body.fields)).toEqual(expect.arrayContaining(["email", "roles", "headcount"]));
});

test("missing required fields get plain-language messages", async ({ request }) => {
  // Found on production: absent fields used to return zod's raw "expected string" text.
  const res = await post(request, { kind: "talent", elapsedMs: 9000 });
  expect(res.status()).toBe(400);
  const { fields } = await res.json();
  expect(fields).toMatchObject({ name: "Enter your name.", email: "Enter a valid email address.", company: "Enter your company name." });
  for (const message of Object.values(fields) as string[]) expect(message).not.toMatch(/Invalid input|expected/i);
});

test("rejects unknown inquiry kinds", async ({ request }) => {
  const res = await post(request, valid({ kind: "admin" }));
  expect(res.status()).toBe(400);
});

test("candidate sign-up requires consent and an https link", async ({ request }) => {
  const base = {
    kind: "candidate",
    name: "C",
    email: "c@example.com",
    location: "Dallas",
    roles: "QA engineer",
    skills: "Playwright",
    workPreference: "remote",
    engagement: "contract",
    elapsedMs: 9000,
  };
  const res = await post(request, { ...base, profileUrl: "javascript:alert(1)", consent: false });
  expect(res.status()).toBe(400);
  expect(Object.keys((await res.json()).fields)).toEqual(expect.arrayContaining(["profileUrl", "consent"]));
  const ok = await post(request, { ...base, profileUrl: "https://example.com/me", consent: true, email: `c-${Date.now()}@example.com` });
  expect(ok.status()).toBe(201);
});

test("honeypot submissions are refused without a fake success", async ({ request }) => {
  const res = await post(request, valid({ hp: "http://spam.example" }));
  expect(res.status()).toBe(422);
  const body = await res.json();
  expect(body.ok).toBe(false);
  expect(body.message).toContain("hr@syntaxflowllc.com");
});

test("instant submissions are refused", async ({ request }) => {
  const res = await post(request, valid({ elapsedMs: 300 }));
  expect(res.status()).toBe(422);
});

test("duplicate submissions are not sent twice", async ({ request }) => {
  const payload = valid({ email: `dupe-${Date.now()}@example.com` });
  const first = await post(request, payload);
  expect(first.status()).toBe(201);
  const second = await post(request, { ...payload, elapsedMs: 12000 });
  expect(second.status()).toBe(200);
  const a = await first.json();
  const b = await second.json();
  expect(b.duplicate).toBe(true);
  expect(b.reference).toBe(a.reference);
});

test("rate limits a single client", async ({ request }) => {
  const ip = nextIp();
  const statuses: number[] = [];
  for (let i = 0; i < 9; i++) {
    const res = await post(request, valid({ email: `rl-${i}-${Date.now()}@example.com` }), { ip });
    statuses.push(res.status());
    if (res.status() === 429) expect(Number(res.headers()["retry-after"])).toBeGreaterThan(0);
  }
  expect(statuses.slice(0, 8).every((s) => s === 201)).toBe(true);
  expect(statuses[8]).toBe(429);
});
