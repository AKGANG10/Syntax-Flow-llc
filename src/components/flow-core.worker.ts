/**
 * Worker entry for the hero 3D scene: three.js loads, compiles and renders here,
 * on an OffscreenCanvas, so it never blocks the page's main thread.
 * Messages: init (canvas, pixel ratio, first input), update (input patch).
 * Replies: ready, or error.
 */
import { createFlowCore, type FlowCore, type FlowCoreInput } from "./flow-core-3d";

type Message = { type: "init"; canvas: OffscreenCanvas; pixelRatio: number; input: FlowCoreInput } | { type: "update"; input: Partial<FlowCoreInput> };

// Typed loosely: the project compiles against the DOM library, not the worker one.
const scope = self as unknown as { onmessage: ((e: MessageEvent<Message>) => void) | null; postMessage: (m: unknown) => void };

let core: FlowCore | undefined;
const pending: Partial<FlowCoreInput> = {};

scope.onmessage = (e) => {
  const msg = e.data;
  if (msg.type === "init") {
    createFlowCore(msg.canvas, msg.pixelRatio, msg.input).then(
      (c) => {
        core = c;
        c.update(pending);
        scope.postMessage({ type: "ready" });
      },
      (err: unknown) => scope.postMessage({ type: "error", message: String(err) }),
    );
  } else if (core) core.update(msg.input);
  else Object.assign(pending, msg.input);
};
