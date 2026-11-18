"use client";

import { useEffect, useRef } from "react";
import { bundleY, defaultLeads, leadY, makeBundle, palette, seeded, strandRgb, type Strand } from "@/lib/strands";

type Props = {
  className?: string;
  /** Bundle half-height as a fraction of the canvas height. */
  spread?: number;
};

/**
 * Animated rendering of the Syntax Flow strands (motion level L3).
 *
 * Budget: one 2D canvas, at most 34 strands x ~170 points per frame, DPR capped
 * at 2. Pauses off-screen and in background tabs; reduced motion renders one
 * still frame; pointer response only on fine pointers. Decorative only.
 */
export function FlowField({ className, spread = 0.36 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;

    let w = 0;
    let h = 0;
    let bundle: Strand[] = [];
    let raf = 0;
    let running = false;
    let inView = true;
    let t = 2.2;
    let last = 0;
    let skip = false;

    const pointer = { x: -1e4, y: -1e4, sx: -1e4, sy: -1e4 };

    const rnd = seeded(41);
    const dots = Array.from({ length: 8 }, (_, i) => ({
      x: 0.06 + rnd() * 0.9,
      y: 0.18 + rnd() * 0.72,
      r: 2.5 + rnd() * 4.5,
      colour: [palette.steel, palette.sky, palette.navy, "#4a97c4"][i % 4],
      phase: rnd() * Math.PI * 2,
    }));

    const displace = (x: number, y: number) => {
      if (!finePointer) return y;
      const dx = x - pointer.sx;
      const dy = y - pointer.sy;
      const f = Math.exp(-(dx * dx + dy * dy) / (2 * 95 * 95));
      return y + Math.sign(dy || 1) * 26 * f;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const steps = Math.max(64, Math.round(w / 9));

      ctx.lineWidth = 1;
      for (const s of bundle) {
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const xn = i / steps;
          const x = xn * w;
          const y = displace(x, bundleY(s, xn, t, spread) * h);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${strandRgb(s.depth)}, ${s.alpha})`;
        ctx.stroke();
      }

      // Lead strands (people) with ring nodes at their turning points.
      const rings: [number, number][] = [];
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = `rgba(21, 38, 59, 0.88)`;
      defaultLeads.forEach((l, li) => {
        ctx.beginPath();
        let prevY = 0;
        let prevSlope = 0;
        for (let i = 0; i <= steps; i++) {
          const xn = i / steps;
          const x = xn * w;
          const y = displace(x, leadY(l, xn, t, spread) * h);
          if (i === 0) ctx.moveTo(x, y);
          else {
            ctx.lineTo(x, y);
            const slope = Math.sign(y - prevY);
            const turning = li < 2 && prevSlope !== 0 && slope !== prevSlope && xn > 0.04 && xn < 0.97;
            // Keep ring nodes apart so they read as distinct people, not clutter.
            if (turning && rings.every(([rx, ry]) => Math.hypot(rx - x, ry - prevY) > 90)) rings.push([x, prevY]);
            prevSlope = slope || prevSlope;
          }
          prevY = y;
        }
        ctx.stroke();
      });

      ctx.lineWidth = 1.8;
      for (const [x, y] of rings) {
        ctx.beginPath();
        ctx.arc(x, y, 6.5, 0, Math.PI * 2);
        ctx.fillStyle = "#f6f9fb";
        ctx.fill();
        ctx.strokeStyle = palette.navy;
        ctx.stroke();
      }

      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h + Math.sin(t * 0.7 + d.phase) * 5, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.colour;
        ctx.globalAlpha = 0.78;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (lowPower || w < 640) {
        skip = !skip;
        if (skip) return;
      }
      t += dt * 0.55;
      pointer.sx += (pointer.x - pointer.sx) * 0.08;
      pointer.sy += (pointer.y - pointer.sy) * 0.08;
      draw();
    };

    const sync = () => {
      const shouldRun = inView && !document.hidden && !reduceMotion.matches;
      canvas.dataset.motion = reduceMotion.matches ? "static" : "animated";
      if (shouldRun && !running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
      if (!running) draw();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bundle = makeBundle(w < 640 ? 18 : w < 1100 ? 26 : 34);
      if (!running) draw();
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -1e4;
      pointer.y = -1e4;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    reduceMotion.addEventListener("change", sync);
    if (finePointer) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    resize();
    sync();

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduceMotion.removeEventListener("change", sync);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [spread]);

  return <canvas ref={ref} className={className} aria-hidden="true" data-motion="pending" />;
}
