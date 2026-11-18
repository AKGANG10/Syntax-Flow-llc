import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

/** Update when page content changes materially. A fixed date keeps the sitemap static. */
const LAST_UPDATED = "2026-11-18";

const routes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/solutions/technology-talent", priority: 0.9 },
  { path: "/solutions/technology", priority: 0.9 },
  { path: "/solutions/talent", priority: 0.9 },
  { path: "/industries", priority: 0.7 },
  { path: "/careers", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
  { path: "/company", priority: 0.6 },
  { path: "/work", priority: 0.5 },
  { path: "/trust", priority: 0.5 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `${siteUrl}${r.path === "/" ? "" : r.path}`,
    lastModified: LAST_UPDATED,
    changeFrequency: "monthly",
    priority: r.priority,
  }));
}
