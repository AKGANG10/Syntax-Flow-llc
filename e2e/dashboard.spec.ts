import { expect, test } from "@playwright/test";

/* Interactive dashboard demo: labelling, tabs, keyboard access, live mode. */

test("every dashboard is labelled as a demo with sample data", async ({ page }) => {
  await page.goto("/platform");
  const board = page.locator("[data-dashboard]").first();
  await expect(board.getByText("Interactive demo · Sample data")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Syntax Flow Digital Command Center.");
});

test("tabs switch views with mouse and keyboard", async ({ page }) => {
  await page.goto("/platform");
  const tablist = page.getByRole("tablist", { name: "Dashboard views" }).first();
  const overview = tablist.getByRole("tab", { name: "Overview" });
  await expect(overview).toHaveAttribute("aria-selected", "true");

  await tablist.getByRole("tab", { name: "Talent" }).click();
  await expect(tablist.getByRole("tab", { name: "Talent" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("table", { name: /Skill coverage by role/ })).toBeVisible();

  // Arrow keys move between tabs (roving focus).
  await tablist.getByRole("tab", { name: "Talent" }).focus();
  await page.keyboard.press("ArrowRight");
  const aiTab = tablist.getByRole("tab", { name: "AI" });
  await expect(aiTab).toBeFocused();
  await expect(aiTab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("Example AI experience.", { exact: false })).toBeVisible();
});

test("line charts are readable with the keyboard", async ({ page }) => {
  await page.goto("/platform");
  await page.getByRole("tablist", { name: "Dashboard views" }).first().getByRole("tab", { name: "Technology" }).click();
  const chart = page.getByRole("group", { name: /API latency, last 30 days/ });
  await chart.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(chart).toContainText(/Day 29: \d+(\.\d)? ms/);
});

test("live demo data can be paused", async ({ page }) => {
  await page.goto("/platform");
  const toggle = page.getByRole("button", { name: /Live demo/ }).first();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(toggle).toHaveText(/paused/);
});

test("home shows the pinned 3D story on desktop and module cards on phones", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await expect(page.locator("[data-system-story]")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "See the system in motion." })).toBeVisible();
  } else {
    await expect(page.locator("[data-system-story]")).toHaveCount(1);
  }
});

test("solution pages embed their matching dashboard view", async ({ page }) => {
  for (const [path, tab] of [
    ["/solutions/technology", "Technology"],
    ["/solutions/talent", "Talent"],
    ["/solutions/transformation", "Transformation"],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole("tablist", { name: "Dashboard views" }).getByRole("tab", { name: tab })).toHaveAttribute("aria-selected", "true");
  }
});
