import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/*
 * Content Security Policy.
 *
 * Decision (docs/DECISIONS.md, ADR-002): pages are statically prerendered, so a
 * per-request nonce is not possible without making every page dynamic.
 * Scripts are restricted to this origin; 'unsafe-inline' is allowed for the
 * framework's inline bootstrap scripts. The site renders no user-supplied
 * HTML and loads no third-party scripts. Revisit (move to nonces via proxy.ts)
 * when adding authentication, a candidate portal or any third-party script.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // One year, no includeSubDomains/preload until every subdomain is confirmed HTTPS-ready (docs/SECURITY.md).
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), browsing-topics=()",
  },
];

// Canonical host is the apex (confirmed 2026-11-18). www redirects to it on any host.
const canonical = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://syntaxflowllc.com");
const wwwHost = canonical.hostname.startsWith("www.") ? null : `www.${canonical.hostname}`;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    if (!wwwHost) return [];
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: wwwHost }],
        destination: `${canonical.origin}/:path*`,
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
