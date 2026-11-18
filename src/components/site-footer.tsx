import Link from "next/link";
import { company, footerNav, legalNav } from "@/content/site";
import { Magnetic } from "./effects";
import { FlowField } from "./flow-field";
import { WordReveal } from "./intro";
import { ArrowIcon, Container, buttonClass } from "./ui";

async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

/**
 * Cinematic footer: "Build what's next." over the moving flow network
 * ("future flow"). Social links are omitted until real profiles are supplied
 * (docs/CONTENT_INVENTORY.md).
 */
export function SiteFooter() {
  const { address } = company;
  return (
    <footer className="noise defer-render relative isolate overflow-hidden bg-ink-950 text-ink-300">
      <FlowField tone="dark" spread={0.3} className="absolute inset-x-0 top-0 -z-10 h-[34rem] w-full opacity-70 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]" />
      <div aria-hidden="true" className="bg-grid-dark mask-fade-y absolute inset-0 -z-10" />

      <Container className="pt-28 pb-16 lg:pt-36">
        <WordReveal as="p" text="Build what’s next." className="block text-[clamp(3.25rem,1.5rem+8vw,9.5rem)] leading-[0.92] font-extrabold tracking-[-0.055em] text-white" accentFrom={2} />
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-lg leading-relaxed text-ink-300">IT services, IT consulting and US IT recruitment, planned together. Tell us what you are building.</p>
          <Magnetic>
            <Link href="/contact" className={buttonClass("invert")} data-cursor="Talk">
              Let&rsquo;s build what&rsquo;s next
              <ArrowIcon />
            </Link>
          </Magnetic>
        </div>

        <div className="mt-20 grid gap-12 border-t border-white/10 pt-14 lg:grid-cols-[1.2fr_2fr]">
          <address className="space-y-1.5 text-[0.95rem] not-italic leading-relaxed">
            <span className="mb-3 block text-lg font-bold tracking-[-0.02em] text-white">{company.legalName}</span>
            <span className="block">{address.street}</span>
            <span className="block">
              {address.locality}, {address.regionName} {address.postalCode}, USA
            </span>
            <a className="strand-link mt-3 block w-fit text-white" href={company.phone.href}>
              {company.phone.display}
            </a>
            <a className="strand-link block w-fit text-white" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </address>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {footerNav.map((col) => (
              <div key={col.heading}>
                <h2 className="t-label text-flow-300">{col.heading}</h2>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="strand-link text-[0.95rem] text-ink-200 hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-8 text-sm md:flex-row md:items-center md:justify-between">
          <p>
            © <CopyrightYear /> {company.legalName}. All rights reserved.
            {company.eVerifyParticipant && <span className="block sm:ml-2 sm:inline">E-Verify® participating employer.</span>}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="strand-link hover:text-white">
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
