"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FlowField } from "./flow-field";
import { cx } from "./ui";

/*
 * Chooses the hero renderer:
 *   - capable desktop (fine pointer, >= 1024px, >= 4 cores, WebGL2, motion OK)
 *     -> 3D flow core, code-split and loaded after first paint;
 *   - everything else, or if the 3D module fails -> 2D canvas strands.
 */

const QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

let webgl2: boolean | undefined;
function hasWebGL2() {
  if (webgl2 === undefined) {
    try {
      webgl2 = !!document.createElement("canvas").getContext("webgl2");
    } catch {
      webgl2 = false;
    }
  }
  return webgl2;
}

function capable() {
  return window.matchMedia(QUERY).matches && (navigator.hardwareConcurrency ?? 8) >= 4 && hasWebGL2();
}

function subscribe(cb: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

export function HeroScene({ className, fallbackClassName }: { className?: string; fallbackClassName?: string }) {
  const use3d = useSyncExternalStore(subscribe, capable, () => false);
  const [failed, setFailed] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!use3d || failed || !box.current) return;
    // A fresh canvas per mount: a WebGL context cannot be recreated on a canvas whose context was released.
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.dataset.motion = "pending";
    canvas.className = "absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[900ms]";
    box.current.appendChild(canvas);
    let handle: { dispose: () => void } | undefined;
    let cancelled = false;
    import("./flow-core-3d")
      .then(({ mountFlowCore }) => {
        if (cancelled) return;
        handle = mountFlowCore(canvas);
        requestAnimationFrame(() => canvas.classList.replace("opacity-0", "opacity-100"));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      handle?.dispose();
      canvas.remove();
    };
  }, [use3d, failed]);

  if (!use3d || failed) return <FlowField className={fallbackClassName ?? className} />;
  return <div ref={box} className={cx("relative", className)} aria-hidden="true" />;
}
