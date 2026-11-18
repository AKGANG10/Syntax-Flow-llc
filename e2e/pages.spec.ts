import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/",
  "/solutions/technology",
  "/solutions/talent",
  "/solutions/technology-talent",
  "/industries",
  "/work",
  "/company",
  "/careers",
  "/trust",
  "/contact",
  "/privacy",
  "/terms",
];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

for (const route of routes) {
  test(`renders ${route} cleanly`, async ({ page }) => {
    const errors = collectErrors(page);
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle(/Syntax Flow/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "no horizontal scroll").toBeLessThanOrEqual(1);

    await page.waitForLoadState("networkidle");
    expect(errors, "no console errors").toEqual([]);
  });
}

test("sends security headers", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["content-security-policy"]).toContain("object-src 'none'");
  expect(h["content-security-policy"]).not.toContain("unsafe-eval");
  expect(h["strict-transport-security"]).toContain("max-age=");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["permissions-policy"]).toContain("camera=()");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("unknown routes return a real 404", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("leads nowhere");
});

test("publishes sitemap, robots and security.txt", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/solutions/technology-talent");
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  expect(await (await request.get("/.well-known/security.txt")).text()).toContain("Contact: mailto:");
});

test("hero animation respects reduced motion", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator("canvas[data-motion]")).toHaveAttribute("data-motion", "static");
  await ctx.close();
});

test("hero animation runs by default", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("canvas[data-motion]")).toHaveAttribute("data-motion", "animated");
});
