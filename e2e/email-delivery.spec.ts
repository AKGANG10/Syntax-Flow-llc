import { request as http } from "node:http";
import { expect, test } from "@playwright/test";
import { EMAILJS_PORT, MOCK_EMAILJS_PORT, UNCONFIGURED_PORT } from "./ports";

/*
 * Exercises the real EmailJS adapter against a local mock (see
 * e2e/mock-emailjs.mjs), plus the safety behaviour when delivery is not
 * configured. Device independent, so desktop only.
 */

test.beforeEach(({ isMobile }) => {
  test.skip(isMobile, "server behaviour");
});

const emailServer = `http://localhost:${EMAILJS_PORT}`;
const unconfiguredServer = `http://localhost:${UNCONFIGURED_PORT}`;
const octet = () => Math.floor(Math.random() * 254) + 1;

function inquiry(overrides: Record<string, unknown> = {}) {
  return {
    kind: "talent",
    name: "Email Tester",
    email: `email-${Date.now()}-${octet()}@example.com`,
    company: "Example Co",
    roles: "A senior data engineer for a six month contract",
    headcount: "1",
    engagement: "contract",
    timeline: "1-3-months",
    elapsedMs: 9000,
    ...overrides,
  };
}

async function send(base: string, body: unknown) {
  const res = await fetch(`${base}/api/inquiry`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: base, "x-forwarded-for": `10.9.${octet()}.${octet()}` },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json() };
}

test("delivers through EmailJS with the expected payload", async () => {
  const payload = inquiry();
  const { status, json } = await send(emailServer, payload);
  expect(status).toBe(201);
  expect(json.reference).toMatch(/^SF-[A-Z0-9]{8}$/);

  const recorded = (await (await fetch(`http://localhost:${MOCK_EMAILJS_PORT}/__requests`)).json()) as {
    contentType: string;
    body: { service_id: string; template_id: string; user_id: string; accessToken: string; template_params: Record<string, string> };
  }[];
  const sent = recorded.find((r) => r.body?.template_params?.reference === json.reference);
  expect(sent, "request reached EmailJS").toBeTruthy();
  expect(sent!.contentType).toContain("application/json");
  expect(sent!.body).toMatchObject({
    service_id: "service_e2e",
    template_id: "template_v26pcko",
    user_id: "public_e2e",
    accessToken: "private_e2e",
  });
  const p = sent!.body.template_params;
  expect(p.reply_to).toBe(payload.email);
  expect(p.subject).toContain("Talent request from Email Tester");
  expect(p.body).toContain("Roles / team:");
  expect(p.body).toContain(json.reference);
  // Stock-template aliases
  expect(p).toMatchObject({ name: "Email Tester", email: payload.email, title: p.subject, message: p.body, company: "Example Co" });
});

test("an EmailJS rejection surfaces as an error, never as success", async () => {
  const { status, json } = await send(emailServer, inquiry({ name: "Reject me [reject]" }));
  expect(status).toBe(502);
  expect(json.ok).toBe(false);
  expect(json.error).toBe("delivery_failed");
  expect(json.message).toContain("hr@syntaxflowllc.com");
});

test("production without delivery configured refuses with 503", async () => {
  const { status, json } = await send(unconfiguredServer, inquiry());
  expect(status).toBe(503);
  expect(json.error).toBe("not_configured");
  expect(json.message).toContain("hr@syntaxflowllc.com");
});

test("www redirects permanently to the apex", async () => {
  const { status, location } = await new Promise<{ status?: number; location?: string }>((resolve, reject) => {
    const req = http({ host: "localhost", port: UNCONFIGURED_PORT, path: "/solutions/talent?x=1", headers: { host: "www.syntaxflowllc.com" } }, (res) => {
      resolve({ status: res.statusCode, location: res.headers.location });
      res.resume();
    });
    req.on("error", reject);
    req.end();
  });
  expect(status).toBe(308);
  expect(location).toBe("https://syntaxflowllc.com/solutions/talent?x=1");
});
