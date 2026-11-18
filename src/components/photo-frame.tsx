import Image from "next/image";
import type { VizKind } from "@/content/capabilities";
import { media, type MediaKey } from "@/content/media";
import { photo } from "@/lib/media-server";
import { MiniViz } from "./mini-viz";
import { StrandMotif, cx } from "./ui";

/**
 * Integrated photography: masked frame, clip/grayscale reveal and parallax on
 * scroll (CSS view timelines). Falls back to an original procedural panel
 * until the photo has been imported, so nothing ever renders broken.
 * Server component: pass the rendered element into client components as a prop.
 */
export function PhotoFrame({
  name,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  fallback = "software",
  tone = "light",
  parallax = true,
}: {
  name: MediaKey;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallback?: VizKind;
  tone?: "light" | "dark";
  parallax?: boolean;
}) {
  const file = photo(name);
  const meta = media[name];

  if (!file) {
    return (
      <div
        className={cx(
          "relative isolate overflow-hidden rounded-[var(--radius-frame)]",
          tone === "dark" ? "bg-ink-900 ring-1 ring-white/10" : "bg-gradient-to-br from-flow-50 via-white to-ink-50 ring-1 ring-ink-100",
          className,
        )}
        data-photo-fallback={name}
      >
        <div aria-hidden="true" className={cx("absolute inset-0", tone === "dark" ? "bg-grid-dark" : "bg-grid", "mask-radial")} />
        <StrandMotif seed={name.length * 7} count={9} className="absolute inset-x-0 bottom-0 h-2/3 w-full opacity-50" />
        <MiniViz kind={fallback} live className="absolute top-1/2 left-1/2 w-[58%] max-w-80 -translate-x-1/2 -translate-y-1/2 drop-shadow-sm" />
      </div>
    );
  }

  return (
    <figure className={cx("photo-reveal relative isolate overflow-hidden rounded-[var(--radius-frame)] bg-ink-100", className)}>
      <div className={cx("absolute inset-0", parallax && "parallax-inner")}>
        <Image
          src={file.src}
          alt={meta.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={file.blurDataURL ? "blur" : "empty"}
          blurDataURL={file.blurDataURL}
          className="object-cover"
        />
      </div>
      {meta.source === "generated" ? (
        // Generated artwork is labelled, so no one mistakes it for a photo of real people or offices.
        <span className="absolute bottom-3 left-3 rounded-full bg-ink-950/70 px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.14em] text-white uppercase">Illustration</span>
      ) : null}
    </figure>
  );
}
