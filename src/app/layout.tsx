import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { CursorCompanion } from "@/components/effects";
import { Intro, introScript, ScrollProgress } from "@/components/intro";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { company, siteUrl } from "@/content/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Syntax Flow | IT Services, IT Consulting and IT Recruitment",
    template: "%s | Syntax Flow",
  },
  description: company.description,
  applicationName: company.shortName,
  openGraph: {
    type: "website",
    siteName: company.shortName,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#f6f9fb",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.shortName,
  legalName: company.legalName,
  url: siteUrl,
  logo: `${siteUrl}/brand/syntax-flow-logo.png`,
  description: company.description,
  areaServed: { "@type": "Country", name: "United States" },
  knowsAbout: ["IT services", "IT consulting", "IT recruitment", "IT staffing", "Software engineering", "Cloud and DevOps", "Data and analytics", "Artificial intelligence", "Cybersecurity"],
  email: company.email,
  telephone: company.phone.e164,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.street,
    addressLocality: company.address.locality,
    addressRegion: company.address.region,
    postalCode: company.address.postalCode,
    addressCountry: company.address.country,
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: company.shortName,
  url: siteUrl,
  publisher: { "@type": "Organization", name: company.legalName },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the intro script sets data-intro on <html> before hydration.
    <html lang="en" className={`${jakarta.variable} ${plexMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Intro />
        <ScrollProgress />
        <CursorCompanion />
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-ink-900 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
