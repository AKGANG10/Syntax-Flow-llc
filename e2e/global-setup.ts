import type { FullConfig } from "@playwright/test";

/**
 * Warm the production server before tests run.
 *
 * `next start` loads each route's server module on its first request. On a
 * cold server under parallel test load, that first client-side navigation can
 * exceed assertion timeouts, which made navigation tests flaky. Requesting
 * every route once (HTML and the RSC payload used by client navigation)
 * means tests measure behaviour, not cold start.
 */
const routes = [
  "/",
  "/solutions/technology",
  "/solutions/talent",
  "/solutions",
  "/solutions/transformation",
  "/industries",
  "/work",
  "/company",
  "/careers",
  "/trust",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL;
  if (!baseURL) return;
  await Promise.all(
    routes.flatMap((r) => [
      fetch(baseURL + r).then((res) => res.arrayBuffer()),
      fetch(baseURL + r, { headers: { RSC: "1" } }).then((res) => res.arrayBuffer()),
    ]),
  );
}
