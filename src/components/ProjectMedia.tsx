import Image from "next/image";
import type { MediaAsset, MediaFrame } from "@/data/portfolio";
import { isDraft, isVideo, publicFileExists } from "@/lib/site";

type Frame = MediaFrame | "card";

const ASPECT: Record<Frame, string> = {
  card: "aspect-[16/10]",
  wide: "aspect-[16/9]",
  desktop: "aspect-[16/10]",
  phone: "aspect-[9/19.5]",
};

const RADIUS: Record<Frame, string> = {
  card: "rounded-xl",
  wide: "rounded-lg",
  desktop: "rounded-lg",
  phone: "rounded-[1.75rem]",
};

/** Whether a media slot renders at all (real file, or placeholder in draft). */
export function mediaVisible(asset: MediaAsset | undefined): boolean {
  if (!asset) return false;
  return isDraft || publicFileExists(asset.src);
}

/**
 * Displays a project image or video, preserving aspect ratio.
 *
 * If the file is missing from /public:
 *   - draft mode → a labeled placeholder panel showing where to put it
 *   - production → a quiet title panel if `fallbackTitle` is given,
 *                  otherwise nothing (layouts adapt via `mediaVisible`)
 */
export function ProjectMedia({
  asset,
  frame: frameOverride,
  sizes = "(min-width: 1152px) 1088px, 100vw",
  preload = false,
  fallbackTitle,
  spotlight = false,
  className = "",
}: {
  asset: MediaAsset;
  /** Force an aspect ratio, e.g. "card" for the project grid. */
  frame?: Frame;
  sizes?: string;
  preload?: boolean;
  /** Production-only fallback: show this title instead of nothing. */
  fallbackTitle?: string;
  /** Cursor-following light on hover (inside a `.group`). */
  spotlight?: boolean;
  className?: string;
}) {
  const exists = publicFileExists(asset.src);
  const f = frameOverride ?? asset.frame;
  const frame = `relative overflow-hidden border border-line bg-panel ${ASPECT[f]} ${RADIUS[f]} ${spotlight ? "spotlight" : ""} ${className}`;

  if (!exists && !isDraft) {
    if (!fallbackTitle) return null;
    // Typographic panel — clearly not a screenshot.
    return (
      <div className={frame}>
        <p className="absolute inset-0 flex items-center justify-center p-8 text-center text-heading font-semibold text-line-strong">
          {fallbackTitle}
        </p>
      </div>
    );
  }

  if (!exists) return <MediaPlaceholder asset={asset} className={frame} frameName={f} />;

  if (isVideo(asset.src)) {
    return (
      <div className={frame}>
        <video
          src={asset.src}
          poster={asset.poster}
          controls
          muted
          playsInline
          preload="metadata"
          aria-label={asset.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={frame}>
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover object-top transition-transform duration-700 ease-[var(--ease)] motion-safe:group-hover:scale-[1.02]"
      />
    </div>
  );
}

function MediaPlaceholder({
  asset,
  className,
  frameName,
}: {
  asset: MediaAsset;
  className: string;
  frameName: Frame;
}) {
  const kind = isVideo(asset.src) ? "video" : "image";
  return (
    // Not role="img": a placeholder must not pretend to be real imagery.
    <div className={className} data-placeholder>
      <CropMarks />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="font-mono text-meta uppercase text-muted">
          [ {asset.label} ]
        </p>
        <p className="max-w-full font-mono text-meta break-all text-subtle">
          Replace with: /public{asset.src}
        </p>
      </div>
      <p className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.08em] text-subtle">
        {frameName} · {kind}
      </p>
    </div>
  );
}

function CropMarks() {
  const base = "absolute size-3 border-line-strong";
  return (
    <span aria-hidden>
      <span className={`${base} top-3 left-3 border-t border-l`} />
      <span className={`${base} top-3 right-3 border-t border-r`} />
      <span className={`${base} bottom-3 left-3 border-b border-l`} />
      <span className={`${base} right-3 bottom-3 border-r border-b`} />
    </span>
  );
}
