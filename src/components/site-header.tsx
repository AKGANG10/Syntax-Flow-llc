"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { company, mainNav } from "@/content/site";
import { buttonClass, cx } from "./ui";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const solutionsButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const solutionsId = useId();
  const mobileId = useId();

  // Close transient menus whenever the route changes (state adjusted during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setSolutionsOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock is owned by React through a data attribute (see globals).
  useEffect(() => {
    const root = document.documentElement;
    if (mobileOpen) root.dataset.menuOpen = "true";
    else delete root.dataset.menuOpen;
    return () => {
      delete root.dataset.menuOpen;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!solutionsOpen && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (solutionsOpen) {
        setSolutionsOpen(false);
        solutionsButtonRef.current?.focus();
      }
      if (mobileOpen) {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (solutionsOpen && solutionsRef.current && !solutionsRef.current.contains(e.target as Node)) setSolutionsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [solutionsOpen, mobileOpen]);

  const solutions = mainNav.find((g) => g.children)!;
  const solutionsActive = solutions.children!.some((c) => isActive(pathname, c.href));

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={cx(
          "glass mx-auto flex h-[calc(var(--header-h)-0.75rem)] max-w-[80rem] items-center justify-between gap-4 rounded-full pr-2 pl-5 transition-shadow duration-[var(--duration-normal)] sm:pl-6",
          scrolled && "shadow-lift",
        )}
      >
        <Link href="/" className="flex shrink-0 items-center rounded-md" aria-label={`${company.shortName} home`}>
          <Image
            src="/brand/syntax-flow-wordmark.png"
            alt=""
            width={657}
            height={96}
            priority
            unoptimized
            className="h-[1.375rem] w-auto sm:h-6"
          />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            <li>
              <div
                ref={solutionsRef}
                className="relative"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setSolutionsOpen(false);
                }}
              >
                <button
                  ref={solutionsButtonRef}
                  type="button"
                  aria-expanded={solutionsOpen}
                  aria-controls={solutionsId}
                  onClick={() => setSolutionsOpen((o) => !o)}
                  className={cx(
                    "flex min-h-10 items-center gap-1.5 rounded-full px-4 text-[0.925rem] font-medium transition-colors hover:bg-ink-900/5",
                    solutionsActive ? "text-ink-950" : "text-ink-700",
                  )}
                >
                  {solutions.label}
                  <svg viewBox="0 0 12 12" aria-hidden="true" className={cx("size-3 transition-transform", solutionsOpen && "rotate-180")}>
                    <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  {solutionsActive && <span className="sr-only">(current section)</span>}
                </button>
                <div
                  id={solutionsId}
                  hidden={!solutionsOpen}
                  className="absolute top-[calc(100%+0.75rem)] left-0 w-[23rem] rounded-[var(--radius-card)] border border-ink-100 bg-white p-2 shadow-lift"
                >
                  <ul>
                    {solutions.children!.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={pathname === item.href ? "page" : undefined}
                          className="group block rounded-2xl px-4 py-3 transition-colors hover:bg-flow-50 aria-[current=page]:bg-flow-50"
                        >
                          <span className="flex items-center gap-2 font-semibold text-ink-950">
                            <span aria-hidden="true" className="size-2 rounded-full bg-flow-500 transition-transform group-hover:scale-125" />
                            {item.label}
                          </span>
                          <span className="mt-0.5 block pl-4 text-sm text-ink-600">{item.description}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
            {mainNav
              .filter((g) => g.href)
              .map((g) => (
                <li key={g.href}>
                  <Link
                    href={g.href!}
                    aria-current={isActive(pathname, g.href!) ? "page" : undefined}
                    className="flex min-h-10 items-center rounded-full px-4 text-[0.925rem] font-medium text-ink-700 transition-colors hover:bg-ink-900/5 aria-[current=page]:text-ink-950 aria-[current=page]:underline aria-[current=page]:decoration-flow-500 aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
                  >
                    {g.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* max-sm:hidden, not "hidden sm:inline-flex": buttonClass already sets display and would win. */}
          <Link href="/contact" className={cx(buttonClass("primary", "sm"), "max-sm:hidden")}>
            Start a Conversation
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            className="flex size-11 items-center justify-center rounded-full text-ink-900 hover:bg-ink-900/5 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6">
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id={mobileId}
        hidden={!mobileOpen}
        className="mx-auto mt-2 max-h-[calc(100dvh-var(--header-h)-1rem)] max-w-[80rem] overflow-y-auto rounded-[var(--radius-panel)] border border-ink-100 bg-white p-3 shadow-lift lg:hidden"
      >
        <nav aria-label="Mobile">
          <p className="t-label px-4 pt-3 pb-2 text-ink-500">Solutions</p>
          <ul>
            {solutions.children!.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block rounded-2xl px-4 py-3 aria-[current=page]:bg-flow-50"
                >
                  <span className="font-semibold text-ink-950">{item.label}</span>
                  <span className="block text-sm text-ink-600">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="my-2 h-px bg-ink-100" />
          <ul>
            {mainNav
              .filter((g) => g.href)
              .map((g) => (
                <li key={g.href}>
                  <Link
                    href={g.href!}
                    aria-current={isActive(pathname, g.href!) ? "page" : undefined}
                    className="flex min-h-12 items-center rounded-2xl px-4 font-semibold text-ink-900 aria-[current=page]:bg-flow-50"
                  >
                    {g.label}
                  </Link>
                </li>
              ))}
          </ul>
          <div className="mt-3 grid gap-2 p-1 sm:grid-cols-2">
            <Link href="/contact" className={buttonClass("primary")}>
              Start a Conversation
            </Link>
            <Link href="/careers#join" className={buttonClass("secondary")}>
              Join Our Network
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
