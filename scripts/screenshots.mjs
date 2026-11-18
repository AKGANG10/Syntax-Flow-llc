// Visual review helper: full-page screenshots of every route at desktop and phone widths.
//
// Usage: npm run build && node scripts/screenshots.mjs <output-dir> [route ...]
// Uses the installed Microsoft Edge (set PW_CHANNEL=chromium to use Playwright's Chromium).
//
// Full-page captures use reduced motion: scroll-driven reveals would otherwise
// leave below-the-fold content at its starting opacity. A separate viewport
// capture of the home hero shows the animated canvas.

import { chromium } from "@playwright/test";
import { spawn, spawnSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve(process.argv[2] ?? "screenshots");
const routes = process.argv.slice(3).length
  ? process.argv.slice(3)
  : ["/", "/solutions/technology", "/solutions/talent", "/solutions/technology-talent", "/industries", "/work", "/company", "/careers", "/trust", "/contact", "/privacy"];
const port = 3200;
const base = `http://localhost:${port}`;
const channel = process.env.PW_CHANNEL ?? "msedge";

// Refuse to run against something already on the port: it could be a stale build.
try {
  await fetch(base);
  console.error(`Port ${port} is already in use. Stop that process first so screenshots reflect the current build.`);
  process.exit(1);
} catch {}

// One fixed command string (no user input), so running it through the shell is safe on Windows.
const server = spawn(`npx next start -p ${port}`, {
  stdio: "ignore",
  shell: true,
  env: { ...process.env, E2E_TEST_MODE: "1", INQUIRY_DELIVERY: "log" },
});

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("server did not start");
}

const slug = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replace(/\//g, "_"));

try {
  await waitForServer();
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch(channel === "chromium" ? {} : { channel });
  const sizes = [
    { name: "desktop", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
    { name: "mobile", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  ];
  for (const size of sizes) {
    const { name, ...opts } = size;
    const ctx = await browser.newContext({ ...opts, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    for (const r of routes) {
      await page.goto(base + r, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);
      const file = path.join(outDir, `${name}-${slug(r)}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(file);
    }
    await ctx.close();

    const live = await browser.newContext(opts);
    const hero = await live.newPage();
    await hero.goto(base + "/", { waitUntil: "networkidle" });
    await hero.waitForTimeout(1500);
    const heroFile = path.join(outDir, `${name}-hero-animated.png`);
    await hero.screenshot({ path: heroFile });
    console.log(heroFile);
    await live.close();
  }
  await browser.close();
} finally {
  // Windows: kill the whole tree while the shell wrapper is still alive, or `next` is orphaned.
  if (process.platform === "win32" && server.pid) spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  else server.kill();
}
