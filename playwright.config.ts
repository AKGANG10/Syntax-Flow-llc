import { defineConfig, devices } from "@playwright/test";

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
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      E2E_TEST_MODE: "1",
      INQUIRY_DELIVERY: "log",
      INQUIRY_RATE_LIMIT_MAX: "8",
    },
  },
});
