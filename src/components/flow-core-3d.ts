/**
 * Hero 3D scene: the Syntax Flow "flow core" (motion level L5).
 *
 * Narrative: fine blue strands (technology) and bold navy strands carrying
 * open ring nodes (talent) converge into a glass core holding a blue disk in
 * a navy ring (the "o" of the Flow wordmark), then leave as one rising
 * ribbon (transformation). Cyan pulses travel the strands (data).
 *
 * Loaded only on capable desktops (see hero-scene.tsx). DOM-free: it runs in a
 * worker on an OffscreenCanvas (flow-core.worker.ts) or, where that is not
 * supported, on the main thread (flow-core-host.ts). Strand motion runs in the
 * vertex shader; the CPU only moves ~40 pulses and the camera.
 */

import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Group,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const INK = new Color("#15263b");
const STEEL = new Color("#2380ae");
const SKY = new Color("#86c0e0");
const DISK = new Color("#4a97c4");
const SIGNAL = new Color("#46d2e6");

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Displacement shared by the shaders and the CPU (pulses, ring nodes). */
const WAVE = /* glsl */ `
  uniform float uTime;
  vec3 flowWave(vec3 p, float seed) {
    float env = smoothstep(0.4, 6.5, abs(p.x));
    float ph = p.x * 0.55 + uTime * 0.55 + seed * 6.2831;
    return vec3(0.0, sin(ph) * 0.34 * env, cos(ph * 0.8) * 0.26 * env);
  }
`;
function flowWave(p: Vector3, seed: number, t: number, out: Vector3) {
  const ax = Math.abs(p.x);
  const k = Math.min(1, Math.max(0, (ax - 0.4) / 6.1));
  const env = k * k * (3 - 2 * k);
  const ph = p.x * 0.55 + t * 0.55 + seed * Math.PI * 2;
  return out.set(p.x, p.y + Math.sin(ph) * 0.34 * env, p.z + Math.cos(ph * 0.8) * 0.26 * env);
}

function strandMaterial(opacity: number) {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: opacity } },
    vertexShader: /* glsl */ `
      ${WAVE}
      attribute float aSeed;
      attribute vec3 aColor;
      varying vec3 vColor;
      varying float vFade;
      void main() {
        vec3 p = position + flowWave(position, aSeed);
        vColor = aColor;
        vFade = smoothstep(-9.5, -6.0, position.x) * (1.0 - smoothstep(7.0, 9.5, position.x));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying vec3 vColor;
      varying float vFade;
      void main() { gl_FragColor = vec4(vColor, uOpacity * vFade); }
    `,
  });
}

/** Path through the core: spread on the left, pinched at x=0, rising ribbon on the right. */
function strandCurve(y: number, z: number, spread: number) {
  return new CatmullRomCurve3([
    new Vector3(-9.5, y * spread, z * spread),
    new Vector3(-6.2, y * spread * 0.82 + 0.25, z * spread * 0.7),
    new Vector3(-3.1, y * spread * 0.36, z * spread * 0.32),
    new Vector3(0, y * 0.05, z * 0.05),
    new Vector3(3.0, 0.55 + y * 0.22, z * 0.2),
    new Vector3(6.1, 1.55 + y * 0.4, z * 0.35),
    new Vector3(9.5, 2.9 + y * 0.6, z * 0.5),
  ]);
}

/** What the page tells the scene: CSS pixel size, pointer (-1..1), hero scroll progress (0..1), and whether to animate. */
export type FlowCoreInput = { width: number; height: number; pointerX: number; pointerY: number; scroll: number; running: boolean };

export type FlowCore = { update: (input: Partial<FlowCoreInput>) => void; dispose: () => void };

/** Lets other work run between setup stages, so no single task blocks for long. */
const breathe = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

// Workers have requestAnimationFrame for OffscreenCanvas in current browsers; fall back to a timer.
const nextFrame = (cb: (now: number) => void): number =>
  typeof requestAnimationFrame === "function" ? requestAnimationFrame(cb) : (setTimeout(() => cb(performance.now()), 16) as unknown as number);
const cancelFrame = (id: number) => (typeof cancelAnimationFrame === "function" ? cancelAnimationFrame(id) : clearTimeout(id));

/**
 * Builds the scene in stages, compiles shaders (in parallel where the driver
 * allows), draws the first frame and resolves. Rejects if WebGL setup fails.
 */
export async function createFlowCore(canvas: HTMLCanvasElement | OffscreenCanvas, pixelRatio: number, initial: FlowCoreInput): Promise<FlowCore> {
  const input = { ...initial };
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(pixelRatio);
  await breathe();

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  await breathe();

  const camera = new PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.35, 12.5);

  const world = new Group();
  scene.add(world);

  const disposables: { dispose: () => void }[] = [envTex, pmrem];
  const track = <T extends { dispose: () => void }>(x: T) => (disposables.push(x), x);
  const shaderMats: ShaderMaterial[] = [];

  const rand = rng(20261118);

  /* Technology: a bundle of fine strands, merged into one draw call. */
  const TECH = 72;
  const SEGMENTS = 150;
  const techCurves: { curve: CatmullRomCurve3; seed: number }[] = [];
  {
    const positions = new Float32Array(TECH * SEGMENTS * 2 * 3);
    const seeds = new Float32Array(TECH * SEGMENTS * 2);
    const colors = new Float32Array(TECH * SEGMENTS * 2 * 3);
    let o = 0;
    for (let i = 0; i < TECH; i++) {
      const a = (i / TECH) * Math.PI * 2;
      const r = 0.35 + rand() * 1.0;
      const curve = strandCurve(Math.sin(a) * r * 2.1, Math.cos(a) * r * 1.6, 1);
      const seed = rand();
      techCurves.push({ curve, seed });
      const pts = curve.getPoints(SEGMENTS);
      const c = SKY.clone().lerp(STEEL, rand() * 0.85).lerp(INK, rand() * 0.25);
      for (let s = 0; s < SEGMENTS; s++) {
        for (const p of [pts[s], pts[s + 1]]) {
          positions.set([p.x, p.y, p.z], o * 3);
          colors.set([c.r, c.g, c.b], o * 3);
          seeds[o] = seed;
          o++;
        }
      }
    }
    const geo = track(new BufferGeometry());
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new BufferAttribute(seeds, 1));
    geo.setAttribute("aColor", new BufferAttribute(colors, 3));
    const mat = track(strandMaterial(0.42));
    shaderMats.push(mat);
    world.add(new LineSegments(geo, mat));
  }
  await breathe();

  /* Talent: a few bold strands carrying ring nodes (people). */
  const TALENT = 6;
  const talentCurves: { curve: CatmullRomCurve3; seed: number }[] = [];
  const tubeMat = track(
    new ShaderMaterial({
      transparent: true,
      uniforms: { uTime: { value: 0 }, uColor: { value: INK } },
      vertexShader: /* glsl */ `
        ${WAVE}
        attribute float aSeed;
        varying float vFade;
        void main() {
          vec3 p = position + flowWave(position, aSeed);
          vFade = smoothstep(-9.5, -6.0, position.x) * (1.0 - smoothstep(7.0, 9.5, position.x));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vFade;
        void main() { gl_FragColor = vec4(uColor, 0.92 * vFade); }
      `,
    }),
  );
  shaderMats.push(tubeMat);
  for (let i = 0; i < TALENT; i++) {
    const a = (i / TALENT) * Math.PI * 2 + 0.4;
    const curve = strandCurve(Math.sin(a) * 2.6, Math.cos(a) * 1.9, 1.05);
    const seed = rand();
    talentCurves.push({ curve, seed });
    const geo = track(new TubeGeometry(curve, 220, 0.016, 6, false));
    const count = geo.getAttribute("position").count;
    geo.setAttribute("aSeed", new BufferAttribute(new Float32Array(count).fill(seed), 1));
    world.add(new Mesh(geo, tubeMat));
  }

  const ringGeo = track(new TorusGeometry(0.1, 0.02, 10, 40));
  const ringMat = track(new MeshBasicMaterial({ color: INK }));
  const ringDiscGeo = track(new SphereGeometry(0.082, 20, 12));
  const ringDiscMat = track(new MeshBasicMaterial({ color: "#f6f9fb" }));
  const rings = talentCurves.flatMap(({ curve, seed }, i) =>
    [0.12 + (i % 3) * 0.05, 0.74 + (i % 2) * 0.08].map((t) => {
      const node = new Group();
      node.add(new Mesh(ringDiscGeo, ringDiscMat), new Mesh(ringGeo, ringMat));
      world.add(node);
      return { node, base: curve.getPointAt(t), seed };
    }),
  );

  await breathe();

  /* The core: blue disk in a navy ring inside a glass shell. */
  const core = new Group();
  world.add(core);
  const shell = new Mesh(
    track(new SphereGeometry(1.08, 64, 40)),
    track(
      new MeshPhysicalMaterial({
        color: "#eaf4fb",
        metalness: 0,
        roughness: 0.06,
        transparent: true,
        opacity: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        iridescence: 0.35,
        envMapIntensity: 1.4,
        depthWrite: false,
      }),
    ),
  );
  const disk = new Mesh(track(new SphereGeometry(0.5, 48, 32)), track(new MeshPhysicalMaterial({ color: DISK, roughness: 0.35, clearcoat: 0.6, emissive: DISK, emissiveIntensity: 0.18 })));
  // Matte navy so it reads as the wordmark's ring, not chrome.
  const ring = new Mesh(track(new TorusGeometry(0.66, 0.075, 24, 96)), track(new MeshPhysicalMaterial({ color: INK, roughness: 0.55, metalness: 0, clearcoat: 0.3, envMapIntensity: 0.35 })));
  const halo = new Mesh(track(new TorusGeometry(1.42, 0.008, 8, 160)), track(new MeshBasicMaterial({ color: STEEL, transparent: true, opacity: 0.45 })));
  const halo2 = new Mesh(track(new TorusGeometry(1.7, 0.005, 8, 160)), track(new MeshBasicMaterial({ color: SKY, transparent: true, opacity: 0.4 })));
  halo.rotation.x = 1.15;
  halo2.rotation.set(0.5, 0.6, 0);
  core.add(disk, ring, shell, halo, halo2);

  /* Data pulses travelling the technology strands. */
  const PULSES = 42;
  const pulseGeo = track(new SphereGeometry(0.042, 12, 8));
  const pulseMat = track(new MeshBasicMaterial({ color: SIGNAL }));
  const pulseGlowMat = track(new MeshBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0.18, blending: AdditiveBlending, depthWrite: false }));
  const pulseGlowGeo = track(new SphereGeometry(0.12, 12, 8));
  const pulses = Array.from({ length: PULSES }, () => {
    const g = new Group();
    g.add(new Mesh(pulseGeo, pulseMat), new Mesh(pulseGlowGeo, pulseGlowMat));
    world.add(g);
    const src = techCurves[Math.floor(rand() * techCurves.length)];
    return { g, ...src, t: rand(), speed: 0.035 + rand() * 0.05 };
  });

  /* Ambient particles, very low contrast. */
  {
    const n = 520;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) pos.set([(rand() - 0.5) * 22, (rand() - 0.5) * 11, (rand() - 0.5) * 8 - 1], i * 3);
    const geo = track(new BufferGeometry());
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    const mat = track(
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uColor: { value: STEEL } },
        vertexShader: /* glsl */ `
          uniform float uTime;
          void main() {
            vec3 p = position;
            p.y += sin(uTime * 0.2 + position.x) * 0.15;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = 2.2 * (8.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            gl_FragColor = vec4(uColor, smoothstep(0.5, 0.1, d) * 0.35);
          }
        `,
      }),
    );
    shaderMats.push(mat);
    scene.add(new Points(geo, mat));
  }

  await breathe();

  /* Layout and loop. */
  const pointer = { sx: 0, sy: 0 };
  const resize = () => {
    const w = Math.max(1, input.width);
    const h = Math.max(1, input.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Keep the core to the right of the headline on wide screens.
    world.position.x = w / h > 1.5 ? 2.5 : 1.2;
    camera.updateProjectionMatrix();
  };
  resize();

  const tmp = new Vector3();
  let raf = 0;
  let running = false;
  let ready = false;
  let last = 0;
  let time = 0;

  const render = () => {
    for (const m of shaderMats) m.uniforms.uTime.value = time;
    for (const p of pulses) {
      p.t = (p.t + p.speed * 0.016) % 1;
      flowWave(p.curve.getPointAt(p.t), p.seed, time, tmp);
      p.g.position.copy(tmp);
      const fade = Math.min(1, p.t * 8, (1 - p.t) * 8);
      p.g.scale.setScalar(0.4 + fade * 0.6);
    }
    for (const r of rings) {
      flowWave(r.base, r.seed, time, tmp);
      r.node.position.copy(tmp);
      r.node.lookAt(camera.position);
    }
    core.rotation.y = time * 0.18;
    ring.rotation.x = Math.PI / 2 + Math.sin(time * 0.4) * 0.18;
    disk.scale.setScalar(1 + Math.sin(time * 1.4) * 0.025);
    halo.rotation.z = time * 0.12;
    halo2.rotation.z = -time * 0.08;

    pointer.sx += (input.pointerX - pointer.sx) * 0.04;
    pointer.sy += (input.pointerY - pointer.sy) * 0.04;
    world.rotation.y = -0.18 + pointer.sx * 0.16;
    world.rotation.x = 0.06 + pointer.sy * 0.08 + input.scroll * 0.12;
    camera.position.z = 12.5 - input.scroll * 2.2;
    renderer.render(scene, camera);
  };

  const frame = (now: number) => {
    raf = nextFrame(frame);
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    time += dt;
    render();
  };

  const sync = () => {
    const should = ready && input.running;
    if (should && !running) {
      running = true;
      last = 0;
      raf = nextFrame(frame);
    } else if (!should && running) {
      running = false;
      cancelFrame(raf);
    }
  };

  try {
    await renderer.compileAsync(scene, camera);
  } catch {
    // Compiling during the first render instead is slower but still correct.
  }
  ready = true;
  render();
  sync();

  return {
    update(patch) {
      const sized = (patch.width !== undefined && patch.width !== input.width) || (patch.height !== undefined && patch.height !== input.height);
      Object.assign(input, patch);
      if (sized) {
        resize();
        if (!running) render();
      }
      sync();
    },
    dispose() {
      cancelFrame(raf);
      running = false;
      for (const d of disposables) d.dispose();
      renderer.dispose();
      // The canvas is discarded after this, so releasing the context is safe.
      renderer.forceContextLoss();
    },
  };
}
