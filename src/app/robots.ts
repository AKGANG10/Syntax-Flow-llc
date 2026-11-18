import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/site";

/**
 * Preview and staging deployments must never be indexed. Set
 * SITE_INDEXABLE=false there (Vercel previews are detected automatically).
 */
export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.SITE_INDEXABLE !== "false" && process.env.VERCEL_ENV !== "preview";
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
