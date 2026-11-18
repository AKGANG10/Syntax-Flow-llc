// Builds web-ready brand assets from the supplied raster logo.
//
// Source: assets/brand/syntax-flow-logo-source.png (supplied by Syntax Flow).
// Output: transparent logo and wordmark in public/brand, plus the Open Graph
// image, Apple touch icon and favicon.ico in src/app.
//
// Run: npm run brand:assets
//
// Replace this pipeline with official vector (SVG) files when the brand owner
// supplies them. A raster source limits sharpness at very large sizes.

import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "assets/brand/syntax-flow-logo-source.png");
const out = path.join(root, "public/brand");

// The wordmark sits below this row in the source; the strand mark sits above it.
const SPLIT_Y = 690;
const ALPHA_FLOOR = 0.035;

/** Colour-to-alpha against a white background, preserving anti-aliased edges. */
async function toTransparent(input) {
  const { data, info } = await sharp(input)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const rgba = Buffer.alloc(width * height * 4);

  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    let a = Math.max(1 - r, 1 - g, 1 - b);
    if (a < ALPHA_FLOOR) a = 0;
    if (a === 0) continue;
    const un = (c) => Math.min(1, Math.max(0, 1 - (1 - c) / a));
    rgba[j] = Math.round(un(r) * 255);
    rgba[j + 1] = Math.round(un(g) * 255);
    rgba[j + 2] = Math.round(un(b) * 255);
    rgba[j + 3] = Math.round(a * 255);
  }
  return { rgba, width, height };
}

/** Tight bounding box of visible pixels inside a horizontal band. */
function bbox({ rgba, width }, y0, y1, minAlpha = 40) {
  let left = width, right = -1, top = y1, bottom = -1;
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < width; x++) {
      if (rgba[(y * width + x) * 4 + 3] >= minAlpha) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

function rawImage({ rgba, width, height }) {
  return sharp(rgba, { raw: { width, height, channels: 4 } });
}

async function main() {
  await mkdir(out, { recursive: true });
  const img = await toTransparent(await readFile(source));
  const pad = 6;

  const full = bbox(img, 0, img.height);
  const word = bbox(img, SPLIT_Y, img.height);
  const mark = bbox(img, 0, SPLIT_Y);
  const padded = (b) => ({
    left: Math.max(0, b.left - pad),
    top: Math.max(0, b.top - pad),
    width: Math.min(img.width - Math.max(0, b.left - pad), b.width + pad * 2),
    height: Math.min(img.height - Math.max(0, b.top - pad), b.height + pad * 2),
  });

  // next/image converts formats on request, so only the PNG master is published.
  const fullPng = await rawImage(img).extract(padded(full)).resize({ width: 1200 }).png({ compressionLevel: 9 }).toBuffer();
  await sharp(fullPng).toFile(path.join(out, "syntax-flow-logo.png"));

  // Header/footer wordmark, rendered at roughly 26 to 32 CSS px tall; 2x is plenty.
  const wordPng = await rawImage(img).extract(padded(word)).resize({ height: 96 }).png({ compressionLevel: 9 }).toBuffer();
  await sharp(wordPng).toFile(path.join(out, "syntax-flow-wordmark.png"));
  const wordMeta = await sharp(wordPng).metadata();

  // Open Graph card: the full logo centred on the brand paper colour.
  const ogLogo = await sharp(fullPng).resize({ width: 820 }).toBuffer();
  const ogLogoMeta = await sharp(ogLogo).metadata();
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#F6F9FB" } })
    .composite([{ input: ogLogo, left: Math.round((1200 - 820) / 2), top: Math.round((630 - ogLogoMeta.height) / 2) }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(root, "src/app/opengraph-image.png"));

  // Apple touch icon from the vector favicon.
  const iconSvg = await readFile(path.join(root, "src/app/icon.svg"));
  await sharp(iconSvg, { density: 600 }).resize(180, 180).png().toFile(path.join(root, "src/app/apple-icon.png"));

  // favicon.ico for clients that request it directly: one 32x32 PNG wrapped in an ICO container.
  const ico32 = await sharp(iconSvg, { density: 300 }).resize(32, 32).png().toBuffer();
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  header.writeUInt8(32, 6); // width
  header.writeUInt8(32, 7); // height
  header.writeUInt8(0, 8); // palette
  header.writeUInt8(0, 9); // reserved
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(ico32.length, 14); // image size
  header.writeUInt32LE(22, 18); // image offset
  await writeFile(path.join(root, "src/app/favicon.ico"), Buffer.concat([header, ico32]));

  console.log("full", full, "\nwordmark", word, "->", `${wordMeta.width}x${wordMeta.height}`, "\nmark", mark);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
