import "server-only";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { mediaSrc, type MediaKey } from "@/content/media";

/**
 * Build-time check for imported photos. Synchronous file access keeps pages
 * statically prerenderable. Returns null when the photo has not been imported,
 * so callers fall back to procedural art.
 */
let blurCache: Record<string, string> | null = null;

function blurs() {
  if (blurCache) return blurCache;
  try {
    blurCache = JSON.parse(readFileSync(path.join(process.cwd(), "src/content/media-blur.json"), "utf8"));
  } catch {
    blurCache = {};
  }
  return blurCache!;
}

export function photo(key: MediaKey) {
  const src = mediaSrc(key);
  if (!existsSync(path.join(process.cwd(), "public", src))) return null;
  return { src, blurDataURL: blurs()[key] as string | undefined };
}
