import { expect, test } from "@playwright/test";

/** Forms reject submissions faster than a person could type; tests wait like a person would. */
const humanPause = (page: import("@playwright/test").Page) => page.waitForTimeout(2700);

test.describe("navigation", () => {
  test("Solutions menu works with the keyboard", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop navigation");
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /^Solutions/ });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: /^Transformation/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("Solutions menu navigates and closes", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop navigation");
    await page.goto("/");
    await page.getByRole("button", { name: /^Solutions/ }).click();
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: /^Talent/ }).click();
    await expect(page).toHaveURL(/\/solutions\/talent$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Find the people who can build it.");
    await expect(page.getByRole("button", { name: /^Solutions/ })).toHaveAttribute("aria-expanded", "false");
  });

  test("mobile menu opens, navigates and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile navigation");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("html")).toHaveAttribute("data-menu-open", "true");
    await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Industries" }).click();
    await expect(page).toHaveURL(/\/industries$/);
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("html")).not.toHaveAttribute("data-menu-open", "true");
  });

  test("skip link moves focus to main content", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("intro never blocks interaction", async ({ page }) => {
    await page.goto("/");
    // Clicked immediately, while the intro may still be fading out.
    await page.getByRole("link", { name: "Start a Conversation" }).first().click();
    await expect(page).toHaveURL(/\/contact$/);
  });
});

test.describe("experience", () => {
  test("cursor companion runs only on fine pointers", async ({ page, isMobile }) => {
    await page.goto("/");
    const ring = page.locator("[data-cursor-ring]");
    if (isMobile) await expect(ring).not.toHaveAttribute("data-enabled", "true");
    else await expect(ring).toHaveAttribute("data-enabled", "true");
  });

  test("solution cards expand to show details", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Details about Cybersecurity" }).click();
    // The toggle's name changes from "Details" to "Less" once open.
    const less = page.getByRole("button", { name: "Less about Cybersecurity" });
    await expect(less).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("link", { name: "Explore Cybersecurity" })).toBeVisible();
    await less.click();
    await expect(page.getByRole("button", { name: "Details about Cybersecurity" })).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("link", { name: "Explore Cybersecurity" })).toBeHidden();
  });

  test("talent network responds to role selection", async ({ page }) => {
    await page.goto("/");
    const role = page.getByRole("button", { name: "Data Engineers" });
    await role.click();
    await expect(role).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/pipelines and platforms that analytics and AI depend on/)).toBeVisible();
  });

  test("the flow advances with scroll navigation", async ({ page, isMobile }) => {
    test.skip(isMobile, "pinned desktop interaction");
    await page.goto("/");
    const step = page.getByRole("button", { name: /04 Connect/ });
    await step.click();
    await expect(step).toHaveAttribute("aria-current", "step");
    await expect(page.getByRole("button", { name: /01 Discover/ })).not.toHaveAttribute("aria-current", "step");
  });

  test("all eight industries are reachable from the rail", async ({ page, isMobile }) => {
    await page.goto("/");
    const rail = page.getByRole("region", { name: "Different sectors. The same two needs." });
    await expect(rail.getByRole("listitem")).toHaveCount(8);
    // On desktop the rail is pinned once hydrated and measured (its height includes the travel).
    if (!isMobile) await expect(rail).toHaveAttribute("style", /calc\(100dvh \+ [1-9]\d*px\)/);
    // Keyboard path: focusing a card scrolls the page so the moving rail shows it.
    const link = rail.getByRole("link", { name: /Healthcare/ });
    await link.focus();
    await expect(link).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/industries#healthcare$/);
  });

  test("ecosystem map highlights people and outcomes", async ({ page }) => {
    await page.goto("/solutions/transformation");
    const cloud = page.getByRole("button", { name: "Cloud", exact: true });
    await cloud.click();
    await expect(cloud).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/needs cloud experts/)).toBeVisible();
  });
});

test.describe("business inquiry form", () => {
  test("preselects the path from the URL", async ({ page }) => {
    await page.goto("/contact?need=talent");
    await expect(page.getByRole("radio", { name: /^Talent/ })).toBeChecked();
    await expect(page.getByLabel(/What kind of professional or team do you need/)).toBeVisible();
  });

  test("switching path updates fields and URL", async ({ page }) => {
    await page.goto("/contact");
    // Click the visible card, as a person would; the real radio sits visually hidden inside it.
    const form = page.getByRole("form", { name: "Business inquiry" });
    await form.locator("label").filter({ hasText: "Transformation" }).click();
    await expect(page.getByRole("radio", { name: /^Transformation/ })).toBeChecked();
    await expect(page.getByLabel(/What needs to change/)).toBeVisible();
    await expect(page).toHaveURL(/need=transformation/);
    await form.locator("label").filter({ hasText: "Technology + Talent" }).click();
    await expect(page.getByLabel(/What are you trying to accomplish/)).toBeVisible();
    await expect(page).toHaveURL(/need=both/);
  });

  test("empty submit shows errors and focuses the first invalid field", async ({ page }) => {
    await page.goto("/contact?need=technology");
    await page.getByRole("button", { name: "Let’s build what’s next" }).click();
    // Scope to the form: Next.js also renders a role="alert" route announcer.
    await expect(page.getByRole("form", { name: "Business inquiry" }).getByRole("alert")).toContainText("Please fix");
    const main = page.getByLabel(/What are you building/);
    await expect(main).toBeFocused();
    await expect(main).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel(/Work email/)).toHaveAttribute("aria-invalid", "true");
  });

  test("valid technology inquiry succeeds with a reference", async ({ page }, info) => {
    // Unique per project: identical payloads within 10 minutes are deduplicated by design.
    const email = `test.person+${info.project.name}-${Date.now()}@example.com`;
    await page.goto("/contact?need=technology");
    await page.getByLabel(/What are you building/).fill("A customer portal with AI-assisted support search for our field teams.");
    await page.getByLabel(/Full name/).fill("Test Person");
    await page.getByLabel(/Work email/).fill(email);
    await page.locator("summary", { hasText: "Add project details" }).click();
    await page.getByText("AI & intelligent systems").click();
    await page.getByLabel(/^Timeline/).selectOption("1-3-months");
    await humanPause(page);
    await page.getByRole("button", { name: "Let’s build what’s next" }).click();
    const status = page.getByRole("status");
    await expect(status).toContainText("Thank you, Test. We have your message.");
    await expect(status).toContainText(/Reference: SF-[A-Z0-9]{8}/);
    await expect(status).toContainText(email);
    await expect(status).toBeFocused();
  });
});

test.describe("talent network form", () => {
  test("requires consent and succeeds once given", async ({ page }, info) => {
    await page.goto("/careers#join");
    await page.getByLabel(/Full name/).fill("Candidate Example");
    await page.getByLabel(/^Email/).fill(`candidate+${info.project.name}-${Date.now()}@example.com`);
    await page.getByLabel(/^Location/).fill("Dallas, TX");
    await page.getByLabel(/Roles you are interested in/).fill("Backend engineer");
    await page.getByLabel(/Main skills/).fill("Go, PostgreSQL, AWS");
    await page.getByLabel(/Work preference/).selectOption("remote");
    await page.getByLabel(/^Engagement/).selectOption("either");
    await page.getByLabel(/LinkedIn, GitHub or portfolio/).fill("http://insecure.example.com");
    await humanPause(page);
    await page.getByRole("button", { name: "Join the network" }).click();
    await expect(page.getByRole("form", { name: "Join our talent network" }).getByRole("alert")).toContainText("privacy notice");
    await expect(page.getByLabel(/LinkedIn, GitHub or portfolio/)).toHaveAttribute("aria-invalid", "true");

    await page.getByLabel(/LinkedIn, GitHub or portfolio/).fill("https://github.com/example");
    await page.getByRole("checkbox", { name: /I have read the/ }).check();
    await page.getByRole("button", { name: "Join the network" }).click();
    await expect(page.getByRole("status")).toContainText("You are in our network.");
  });
});
