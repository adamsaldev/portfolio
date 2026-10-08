"use client";

import Image from "next/image";
import {
  ViewTransition,
  addTransitionType,
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Polaroid } from "@/data/portfolio";

// Resting tilt (degrees) and vertical offset (px) per photo, repeated for longer lists.
const TILTS = [-5, 4, -2, 6, -4, 3, -6, 2];
const OFFSETS = [0, 14, -6, 10, -12, 6, 16, -4];

// The card and the focused view both render the small size first, so the
// focused view always starts from an image that's already in the cache.
const SMALL_SIZES = "200px";
const LARGE_SIZES = "(min-width: 640px) 440px, 86vw";

/** 15% white hairline drawn on the inside edge of the photo. */
function InnerStroke() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.15)]"
    />
  );
}

/** Small photo in the pile. */
function Card({ p }: { p: Polaroid }) {
  return (
    <div className="relative aspect-[5/6] overflow-hidden rounded-xl bg-panel shadow-[0_10px_24px_-12px_rgb(0_0_0/0.5)]">
      <Image
        src={p.src}
        alt={p.alt}
        fill
        sizes={SMALL_SIZES}
        className="object-cover"
        draggable={false}
      />
      <InnerStroke />
    </div>
  );
}

/**
 * Focused photo. First paints the exact file the card already shows (read from
 * the card's <img>, so it's in memory and the zoom animation always lands on a
 * real photo), then fades in the sharp, larger version on top.
 */
function Focused({ p, preview }: { p: Polaroid; preview: string | null }) {
  const [sharp, setSharp] = useState(false);
  return (
    <div className="relative aspect-[5/6] overflow-hidden rounded-2xl bg-panel shadow-[0_30px_80px_-24px_rgb(0_0_0/0.7)]">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element -- must reuse the card's already-loaded file verbatim
        <img
          src={preview}
          alt={p.alt}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <Image
          src={p.src}
          alt={p.alt}
          fill
          sizes={SMALL_SIZES}
          loading="eager"
          className="object-cover"
          draggable={false}
        />
      )}
      <Image
        src={p.src}
        alt=""
        aria-hidden
        fill
        sizes={LARGE_SIZES}
        loading="eager"
        onLoad={() => setSharp(true)}
        className={`object-cover transition-opacity duration-300 ${sharp ? "opacity-100" : "opacity-0"}`}
        draggable={false}
      />
      <InnerStroke />
    </div>
  );
}

/**
 * A messy, overlapping pile of tilted photos. They drop in when scrolled into
 * view, lift on hover, and open into a focused view on click (shared-element
 * morph via React <ViewTransition>). In the focused view: arrow keys, buttons,
 * or swipe to step; Esc, the close button, or the backdrop to close.
 */
export function PolaroidCarousel({ photos }: { photos: Polaroid[] }) {
  const [focused, setFocused] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  // Fade only when stepping between photos — never on open, so the morph has a visible target.
  const [stepped, setStepped] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipeX = useRef<number | null>(null);
  // The file a card is currently showing (if loaded) — read in event handlers
  // only, and kept in state, for an instant first frame in the focused view.
  const [preview, setPreview] = useState<string | null>(null);
  const previewFor = useCallback((i: number) => {
    const img = cardRefs.current[i]?.querySelector("img");
    return img && img.complete && img.naturalWidth > 0 ? img.currentSrc : null;
  }, []);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });
  // Last photo shown, so the counter doesn't jump while the view fades out.
  const [lastShown, setLastShown] = useState(0);

  // Drop-in once visible.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Show scroll arrows only when the row overflows.
  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const update = () =>
      setCanScroll({
        left: t.scrollLeft > 4,
        right: t.scrollLeft + t.clientWidth < t.scrollWidth - 4,
      });
    update();
    t.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(t);
    return () => {
      t.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const open = (i: number) => {
    const src = previewFor(i);
    startTransition(() => {
      addTransitionType("lightbox");
      setStepped(false);
      setPreview(src);
      setLastShown(i);
      setFocused(i);
    });
  };

  const close = useCallback(() => {
    const i = focused;
    startTransition(() => {
      addTransitionType("lightbox");
      setFocused(null);
    });
    // Return focus to the photo that's now showing (the one you last viewed).
    if (i !== null)
      requestAnimationFrame(() =>
        cardRefs.current[i]?.focus({ preventScroll: true }),
      );
  }, [focused]);

  const step = useCallback(
    (d: number) => {
      if (focused === null) return;
      const n = (focused + d + photos.length) % photos.length;
      setStepped(true);
      setPreview(previewFor(n));
      setLastShown(n);
      setFocused(n);
    },
    [focused, photos.length, previewFor],
  );

  // Focused view: keys, focus trap, scroll lock (without layout shift).
  useEffect(() => {
    if (focused === null) return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Tab") {
        const els = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>("button") ?? [],
        );
        if (els.length === 0) return;
        const idx = els.indexOf(document.activeElement as HTMLElement);
        const next = e.shiftKey
          ? idx <= 0
            ? els.length - 1
            : idx - 1
          : idx === els.length - 1
            ? 0
            : idx + 1;
        e.preventDefault();
        els[next].focus();
      }
    };
    const html = document.documentElement;
    const gutter = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, pr: html.style.paddingRight };
    html.style.overflow = "hidden";
    if (gutter > 0) html.style.paddingRight = `${gutter}px`;
    addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.pr;
      removeEventListener("keydown", onKey);
    };
  }, [focused, close, step]);

  // Swipe left/right on the focused photo (touch + pen + mouse drag).
  const onPointerDown = (e: React.PointerEvent) => {
    swipeX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (swipeX.current === null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
  };

  const isOpen = focused !== null;
  const shown = focused ?? lastShown;

  const scrollBy = (d: number) =>
    trackRef.current?.scrollBy({ left: d * 220, behavior: "smooth" });

  return (
    <div ref={rootRef} className="relative">
      <ul
        ref={trackRef}
        className="-mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 pt-10 pb-14 [justify-content:safe_center] [mask-image:linear-gradient(to_right,transparent,black_2.5rem,black_calc(100%-2.5rem),transparent)] [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((p, i) => {
          const isFocused = focused === i;
          return (
            <li
              key={p.src}
              className={`polaroid-card w-40 shrink-0 snap-center not-first:-ml-7 sm:w-44 sm:not-first:-ml-9 ${inView ? "is-in" : ""}`}
              style={
                {
                  "--r": `${TILTS[i % TILTS.length]}deg`,
                  "--y": `${OFFSETS[i % OFFSETS.length]}px`,
                  "--i": i,
                } as CSSProperties
              }
            >
              <button
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                type="button"
                onClick={() => open(i)}
                aria-label={`Open photo ${i + 1} of ${photos.length}`}
                className="block w-full cursor-zoom-in touch-manipulation rounded-xl outline-offset-4"
              >
                {isFocused ? (
                  // Keep the slot; the photo is "lifted" into the focused view.
                  <div className="opacity-0">
                    <Card p={p} />
                  </div>
                ) : (
                  <ViewTransition
                    name={`polaroid-${i}`}
                    share="photo-zoom"
                    default="none"
                  >
                    <div>
                      <Card p={p} />
                    </div>
                  </ViewTransition>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {canScroll.left || canScroll.right ? (
        <div className="flex justify-end gap-2">
          {[
            {
              d: -1,
              on: canScroll.left,
              label: "Scroll photos left",
              Icon: ChevronLeft,
            },
            {
              d: 1,
              on: canScroll.right,
              label: "Scroll photos right",
              Icon: ChevronRight,
            },
          ].map(({ d, on, label, Icon }) => (
            <button
              key={d}
              type="button"
              onClick={() => scrollBy(d)}
              disabled={!on}
              aria-label={label}
              className="inline-flex size-8 items-center justify-center rounded-md border border-line-strong text-muted transition-colors duration-200 hover:border-fg hover:text-fg disabled:opacity-30"
            >
              <Icon aria-hidden className="size-4" strokeWidth={1.75} />
            </button>
          ))}
        </div>
      ) : null}

      {/* Focused view. Always mounted; shown/hidden instantly at the
          transition's commit. The container is its own view-transition layer
          (.lb-chrome), so the browser fades the backdrop + buttons in/out in
          step with the photo morph — one animation, every time. */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal={isOpen}
        aria-hidden={!isOpen}
        aria-label={`Photo ${shown + 1} of ${photos.length}`}
        inert={!isOpen}
        className={`lb-chrome lb-fade fixed inset-0 z-[95] flex items-center justify-center p-4 ${
          isOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-[rgb(0_0_0/0.75)]"
          onClick={close}
          aria-hidden
        />

        <div className="relative w-[min(86vw,27.5rem,calc((100dvh-9rem)*0.8))]">
          <div
            className="aspect-[5/6] touch-pan-y select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipeX.current = null)}
          >
            {focused !== null ? (
              <ViewTransition
                name={`polaroid-${focused}`}
                share="photo-zoom"
                default="none"
              >
                <div key={focused} className={stepped ? "polaroid-swap" : ""}>
                  <Focused p={photos[focused]} preview={preview} />
                </div>
              </ViewTransition>
            ) : null}
          </div>

          <div
            className="mt-4 flex items-center justify-between text-[rgb(255_255_255/0.85)]"
          >
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="inline-flex size-9 items-center justify-center rounded-full bg-[rgb(255_255_255/0.08)] transition-colors hover:bg-[rgb(255_255_255/0.18)]"
            >
              <ChevronLeft aria-hidden className="size-4" strokeWidth={1.75} />
            </button>
            <span className="font-mono text-meta tabular-nums" aria-live="polite">
              {shown + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className="inline-flex size-9 items-center justify-center rounded-full bg-[rgb(255_255_255/0.08)] transition-colors hover:bg-[rgb(255_255_255/0.18)]"
            >
              <ChevronRight aria-hidden className="size-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close photo"
          className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full bg-[rgb(255_255_255/0.08)] text-white transition-colors hover:bg-[rgb(255_255_255/0.18)]"
        >
          <X aria-hidden className="size-5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
