import Image from "next/image";
import Link from "next/link";
import { company, footerNav, legalNav } from "@/content/site";
import { Container } from "./ui";

async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  const { address } = company;
  return (
    <footer className="border-t border-ink-100 bg-white text-ink-700">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_2fr]">
          <div>
            <Link href="/" className="inline-block rounded-md" aria-label={`${company.shortName} home`}>
              {/* Already a 37 KB 2x PNG: served as-is, skipping an optimizer round trip. */}
              <Image src="/brand/syntax-flow-wordmark.png" alt="" width={657} height={96} unoptimized className="h-7 w-auto" />
            </Link>
            <p className="mt-5 max-w-sm leading-relaxed text-ink-600">
              Technology and talent solutions. We help organizations build, modernize and scale with the right technology and the people to run it.
            </p>
            <address className="mt-8 space-y-1.5 text-[0.95rem] not-italic leading-relaxed">
              <span className="block font-semibold text-ink-900">{company.legalName}</span>
              <span className="block">{address.street}</span>
              <span className="block">
                {address.locality}, {address.regionName} {address.postalCode}, USA
              </span>
              <a className="strand-link mt-3 block w-fit text-ink-900" href={company.phone.href}>
                {company.phone.display}
              </a>
              <a className="strand-link block w-fit text-ink-900" href={`mailto:${company.email}`}>
                {company.email}
              </a>
            </address>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {footerNav.map((col) => (
              <div key={col.heading}>
                <h2 className="t-label text-ink-500">{col.heading}</h2>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="strand-link text-[0.95rem] text-ink-800">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-ink-100 pt-8 text-sm text-ink-600 md:flex-row md:items-center md:justify-between">
          <p>
            © <CopyrightYear /> {company.legalName}. All rights reserved.
            {company.eVerifyParticipant && <span className="block sm:ml-2 sm:inline">E-Verify® participating employer.</span>}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="strand-link">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
