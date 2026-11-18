// Imports downloaded Unsplash originals into optimised site images.
//
// Usage: npm run media:import -- "<folder with downloads>"
//
// Each download is matched to src/content/media.ts by the Unsplash photo ID in
// its file name (Unsplash names downloads like "name-<ID>-unsplash.jpg").
// Output: public/images/<key>.jpg (max 2400px wide, metadata stripped) and
// src/content/media-blur.json (tiny blurred placeholders).

import sharp from "sharp";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const inbox = process.argv[2];
if (!inbox) {
  console.error('Usage: npm run media:import -- "<folder>"');
  process.exit(1);
}

const manifest = await readFile(path.join(root, "src/content/media.ts"), "utf8");
const entries = [...manifest.matchAll(/(\w+): \{\s*key: "(\w+)",\s*unsplashId: "([\w-]+)"/g)].map((m) => ({ key: m[2], id: m[3] }));
const files = (await readdir(inbox)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const outDir = path.join(root, "public/images");
await mkdir(outDir, { recursive: true });

const blurFile = path.join(root, "src/content/media-blur.json");
let blur = {};
try {
  blur = JSON.parse(await readFile(blurFile, "utf8"));
} catch {}

let imported = 0;
for (const { key, id } of entries) {
  const file = files.find((f) => f.includes(id));
  if (!file) {
    console.log(`  missing  ${key.padEnd(11)} (${id})`);
    continue;
  }
  const input = path.join(inbox, file);
  const img = sharp(input).rotate();
  const meta = await img.metadata();
  await img
    .resize({ width: Math.min(2400, meta.width ?? 2400), withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true, progressive: true })
    .toFile(path.join(outDir, `${key}.jpg`));
  const tiny = await sharp(input).rotate().resize(16).blur(1).jpeg({ quality: 50 }).toBuffer();
  blur[key] = `data:image/jpeg;base64,${tiny.toString("base64")}`;
  imported++;
  console.log(`  imported ${key.padEnd(11)} <- ${file}`);
}

await writeFile(blurFile, JSON.stringify(blur, null, 2) + "\n");
console.log(`${imported}/${entries.length} photos imported into public/images`);
