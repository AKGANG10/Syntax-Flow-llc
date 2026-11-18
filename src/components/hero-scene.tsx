"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { mountFlowCore, type FlowCoreHandle } from "./flow-core-host";
import { FlowField } from "./flow-field";
import { cx } from "./ui";

/*
 * Chooses the hero renderer:
 *   - capable desktop (fine pointer, >= 1024px, >= 4 cores, WebGL2, motion OK)
 *     -> 3D flow core, started once the page is idle, rendered in a worker
 *        (OffscreenCanvas) where supported;
 *   - everything else, or if the 3D module fails -> 2D canvas strands.
 */

const QUERY = "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

let webgl2: boolean | undefined;
/**
 * True only for hardware-accelerated WebGL2. Software renderers (SwiftShader,
 * llvmpipe, Microsoft Basic Render) run the scene on the CPU: slow and hot,
 * so those visitors get the 2D canvas instead.
 */
function hasWebGL2() {
  if (webgl2 === undefined) {
    try {
      const gl = document.createElement("canvas").getContext("webgl2");
      if (!gl) webgl2 = false;
      else {
        const info = gl.getExtension("WEBGL_debug_renderer_info");
        const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
        webgl2 = !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
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
    let handle: FlowCoreHandle | undefined;
    let cancelled = false;
    let idle = 0;
    let timer = 0;
    const start = () => {
      if (cancelled) return;
      handle = mountFlowCore(canvas, {
        onReady: (thread) => {
          if (cancelled) return;
          canvas.dataset.motion = "animated";
          canvas.dataset.renderer = "webgl";
          canvas.dataset.thread = thread;
          canvas.classList.replace("opacity-0", "opacity-100");
        },
        onError: () => {
          if (!cancelled) setFailed(true);
        },
      });
    };
    // The scene is decoration: start it once the page has loaded and the main
    // thread is idle, so it never competes with first paint or hydration.
    const schedule = () => {
      // Safari has no requestIdleCallback.
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(start, { timeout: 2500 });
      else timer = window.setTimeout(start, 400);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idle) window.cancelIdleCallback(idle);
      window.clearTimeout(timer);
      handle?.dispose();
      canvas.remove();
    };
  }, [use3d, failed]);

  if (!use3d || failed) return <FlowField className={fallbackClassName ?? className} />;
  return <div ref={box} className={cx("relative", className)} aria-hidden="true" />;
}
