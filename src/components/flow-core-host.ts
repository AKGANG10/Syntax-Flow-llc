import type { FlowCore, FlowCoreInput } from "./flow-core-3d";

export type FlowCoreHandle = { dispose: () => void };

/**
 * Runs the hero 3D scene. Where OffscreenCanvas is supported it runs in a
 * worker, so three.js never loads or renders on the main thread; elsewhere it
 * runs here. Either way this side forwards size, pointer, scroll and
 * visibility, coalesced to one message per frame.
 */
export function mountFlowCore(
  canvas: HTMLCanvasElement,
  { onReady, onError }: { onReady: (thread: "worker" | "main") => void; onError: () => void },
): FlowCoreHandle {
  let disposed = false;
  const fail = () => {
    if (!disposed) onError();
  };
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
  const read = (): FlowCoreInput => ({
    width: canvas.clientWidth || 1,
    height: canvas.clientHeight || 1,
    pointerX: 0,
    pointerY: 0,
    scroll: Math.min(1, window.scrollY / Math.max(1, window.innerHeight)),
    running: !document.hidden,
  });

  let send: (patch: Partial<FlowCoreInput>) => void;
  let stop: () => void;

  if (typeof canvas.transferControlToOffscreen === "function" && typeof Worker === "function") {
    const worker = new Worker(new URL("./flow-core.worker.ts", import.meta.url), { type: "module" });
    const offscreen = canvas.transferControlToOffscreen();
    worker.onmessage = (e: MessageEvent<{ type: string }>) => {
      if (disposed) return;
      if (e.data?.type === "ready") onReady("worker");
      else fail();
    };
    worker.onerror = fail;
    worker.postMessage({ type: "init", canvas: offscreen, pixelRatio, input: read() }, [offscreen]);
    send = (patch) => worker.postMessage({ type: "update", input: patch });
    stop = () => worker.terminate();
  } else {
    let core: FlowCore | undefined;
    const pending: Partial<FlowCoreInput> = {};
    import("./flow-core-3d")
      .then(({ createFlowCore }) => createFlowCore(canvas, pixelRatio, read()))
      .then((c) => {
        if (disposed) return c.dispose();
        core = c;
        c.update(pending);
        onReady("main");
      }, fail);
    send = (patch) => (core ? core.update(patch) : Object.assign(pending, patch));
    stop = () => core?.dispose();
  }

  // One message per frame at most, however often the pointer moves.
  const queued: Partial<FlowCoreInput> = {};
  let frame = 0;
  const queue = (patch: Partial<FlowCoreInput>) => {
    Object.assign(queued, patch);
    frame ||= requestAnimationFrame(() => {
      frame = 0;
      send({ ...queued });
      for (const k of Object.keys(queued)) delete queued[k as keyof FlowCoreInput];
    });
  };

  let inView = true;
  const visibility = () => queue({ running: inView && !document.hidden });
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    visibility();
  });
  io.observe(canvas);
  document.addEventListener("visibilitychange", visibility);

  const ro = new ResizeObserver(() => queue({ width: canvas.clientWidth || 1, height: canvas.clientHeight || 1 }));
  ro.observe(canvas);

  const onPointer = (e: PointerEvent) => queue({ pointerX: (e.clientX / window.innerWidth) * 2 - 1, pointerY: (e.clientY / window.innerHeight) * 2 - 1 });
  const onScroll = () => queue({ scroll: Math.min(1, window.scrollY / Math.max(1, window.innerHeight)) });
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      stop();
    },
  };
}
