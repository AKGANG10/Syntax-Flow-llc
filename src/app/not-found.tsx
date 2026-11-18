import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow, StrandMotif } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-paper pt-[calc(var(--header-h)+5rem)] pb-28">
      <StrandMotif seed={5} className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] w-full opacity-50" />
      <Container className="relative">
        <Eyebrow>404</Eyebrow>
        <h1 className="t-h1 mt-5 max-w-2xl text-ink-950">This strand leads nowhere.</h1>
        <p className="t-lead mt-6 max-w-xl text-ink-600">The page you were looking for does not exist or has moved.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Contact us
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
