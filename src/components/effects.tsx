"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { useMagnetic, useTiltCard } from "@/lib/motion";
import { cx } from "./ui";

/** Wraps a control so it drifts toward the pointer (desktop, motion allowed). */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useMagnetic(ref, strength);
  return (
    <span ref={ref} className={cx("inline-flex will-change-transform", className)}>
      {children}
    </span>
  );
}

/** Tilting surface with a pointer-following glare. */
export function Tilt({ children, className, max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useTiltCard(ref, max);
  return (
    <div ref={ref} className={cx("tilt", className)}>
      {children}
      <span aria-hidden="true" className="tilt-glare" />
    </div>
  );
}

/**
 * Desktop cursor companion: a ring that follows the pointer, grows over links
 * and shows a label over elements with data-cursor="Label". The native cursor
 * stays visible; disabled on touch and under reduced motion.
 */
export function CursorCompanion() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ring.current;
    if (!el) return;
    const ok = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
    if (!ok) return;
    el.dataset.enabled = "true";
    let x = -100;
    let y = -100;
    let sx = x;
    let sy = y;
    let raf = 0;
    const loop = () => {
      sx += (x - sx) * 0.2;
      sy += (y - sy) * 0.2;
      el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;
      raf = Math.abs(x - sx) + Math.abs(y - sy) > 0.2 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      el.dataset.visible = "true";
      const target = (e.target as Element | null)?.closest?.("[data-cursor], a, button, [role='button'], summary, label") as HTMLElement | null;
      const text = target?.dataset.cursor;
      el.dataset.state = text ? "label" : target ? "link" : "idle";
      if (label.current) label.current.textContent = text ?? "";
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const hide = () => (el.dataset.visible = "false");
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      delete el.dataset.enabled;
    };
  }, []);

  // Reset contextual label after navigation.
  useEffect(() => {
    if (ring.current) ring.current.dataset.state = "idle";
  }, [pathname]);

  return (
    <div ref={ring} className="cursor-ring max-lg:hidden" aria-hidden="true" data-cursor-ring="">
      <span ref={label} />
    </div>
  );
}
