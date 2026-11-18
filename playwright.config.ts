import { defineConfig, devices } from "@playwright/test";
import { EMAILJS_PORT, MOCK_EMAILJS_PORT, UNCONFIGURED_PORT } from "./e2e/ports";

/**
 * End-to-end tests against the production build (`next start`).
 *
 * Uses the locally installed Microsoft Edge (channel "msedge") so no browser
 * download is required. In CI, set PW_CHANNEL=chromium after
 * `npx playwright install chromium`.
 *
 * The server runs with E2E_TEST_MODE=1 and INQUIRY_DELIVERY=log so form
 * submissions are accepted without sending email. Never set these on a
 * deployed environment.
 */
const PORT = Number(process.env.E2E_PORT ?? 3100);
const channel = process.env.PW_CHANNEL ?? "msedge";
const browser = channel === "chromium" ? {} : { channel };

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: true,
  // More workers than this starves `next start` on a laptop and produces pre-hydration clicks.
  workers: process.env.CI ? 2 : 4,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  expect: { timeout: 10_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], ...browser, viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], ...browser } },
  ],
  webServer: [
    // Main server: forms accepted with log delivery.
    {
      command: `npx next start -p ${PORT}`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { E2E_TEST_MODE: "1", INQUIRY_DELIVERY: "log", INQUIRY_RATE_LIMIT_MAX: "8" },
    },
    // Mock of the EmailJS REST API.
    {
      command: `node e2e/mock-emailjs.mjs ${MOCK_EMAILJS_PORT}`,
      url: `http://localhost:${MOCK_EMAILJS_PORT}/health`,
      reuseExistingServer: false,
    },
    // Real EmailJS adapter, pointed at the mock. Fake keys; real template ID.
    {
      command: `npx next start -p ${EMAILJS_PORT}`,
      url: `http://localhost:${EMAILJS_PORT}`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        E2E_TEST_MODE: "1",
        INQUIRY_DELIVERY: "emailjs",
        EMAILJS_API_URL: `http://localhost:${MOCK_EMAILJS_PORT}/api/v1.0/email/send`,
        EMAILJS_SERVICE_ID: "service_e2e",
        EMAILJS_TEMPLATE_ID: "template_v26pcko",
        EMAILJS_PUBLIC_KEY: "public_e2e",
        EMAILJS_PRIVATE_KEY: "private_e2e",
        INQUIRY_RATE_LIMIT_MAX: "50",
      },
    },
    // Production with no delivery configured: must refuse, never fake success.
    {
      command: `npx next start -p ${UNCONFIGURED_PORT}`,
      url: `http://localhost:${UNCONFIGURED_PORT}`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { INQUIRY_DELIVERY: "", INQUIRY_RATE_LIMIT_MAX: "50" },
    },
  ],
});
