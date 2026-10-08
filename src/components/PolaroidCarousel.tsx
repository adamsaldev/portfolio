"use client";

import Image from "next/image";
import {
  ViewTransition,
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

/** Bare photo: rounded corners + the same thin translucent stroke as project cards. */
function Frame({ p, large = false }: { p: Polaroid; large?: boolean }) {
  return (
    <div
      className={`relative aspect-[5/6] overflow-hidden border border-line bg-panel ${
        large
          ? "rounded-2xl shadow-[0_30px_80px_-24px_rgb(0_0_0/0.7)]"
          : "rounded-xl shadow-[0_10px_24px_-12px_rgb(0_0_0/0.5)]"
      }`}
    >
      <Image
        src={p.src}
        alt={p.alt}
        fill
        sizes={large ? "(min-width: 640px) 440px, 86vw" : "200px"}
        className="object-cover"
        draggable={false}
      />
    </div>
  );
}

/**
 * A messy, overlapping pile of tilted photos. They drop in when scrolled into
 * view, lift on hover, and open into a focused view on click (shared-element morph via
 * React <ViewTransition>). Arrow keys navigate; Esc / backdrop closes.
 */
export function PolaroidCarousel({ photos }: { photos: Polaroid[] }) {
  const [focused, setFocused] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  // Fade only when stepping between photos — never on open, so the morph has a visible target.
  const [stepped, setStepped] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastCard = useRef<HTMLButtonElement | null>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

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

  const open = (i: number, el: HTMLButtonElement) => {
    lastCard.current = el;
    startTransition(() => {
      setStepped(false);
      setFocused(i);
    });
  };
  const close = useCallback(() => {
    startTransition(() => setFocused(null));
    requestAnimationFrame(() => lastCard.current?.focus({ preventScroll: true }));
  }, []);
  const step = useCallback(
    (d: number) => {
      setStepped(true);
      setFocused((f) => (f === null ? f : (f + d + photos.length) % photos.length));
    },
    [photos.length],
  );

  // Lightbox: keys, scroll lock, focus.
  useEffect(() => {
    if (focused === null) return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      removeEventListener("keydown", onKey);
    };
  }, [focused, close, step]);

  const scrollBy = (d: number) =>
    trackRef.current?.scrollBy({ left: d * 220, behavior: "smooth" });

  return (
    <div ref={rootRef} className="relative">
      <ul
        ref={trackRef}
        className="-mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 pt-10 pb-14 [justify-content:safe_center] [mask-image:linear-gradient(to_right,transparent,black_2.5rem,black_calc(100%-2.5rem),transparent)] [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((p, i) => {
          const tilt = TILTS[i % TILTS.length];
          const offset = OFFSETS[i % OFFSETS.length];
          const isFocused = focused === i;
          return (
            <li
              key={p.src}
              className={`polaroid-card w-40 shrink-0 snap-center not-first:-ml-10 sm:w-44 sm:not-first:-ml-12 ${inView ? "is-in" : ""}`}
              style={{ "--r": `${tilt}deg`, "--y": `${offset}px`, "--i": i } as CSSProperties}
            >
              <button
                type="button"
                onClick={(e) => open(i, e.currentTarget)}
                aria-label={`Open photo ${i + 1} of ${photos.length}`}
                className="block w-full cursor-zoom-in rounded-2xl outline-offset-4"
              >
                {isFocused ? (
                  // Keep the slot; the photo is "lifted" into the lightbox.
                  <div className="opacity-0">
                    <Frame p={p} />
                  </div>
                ) : (
                  <ViewTransition name={`polaroid-${i}`} share="morph" default="none">
                    <div>
                      <Frame p={p} />
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
            { d: -1, on: canScroll.left, label: "Scroll photos left", Icon: ChevronLeft },
            { d: 1, on: canScroll.right, label: "Scroll photos right", Icon: ChevronRight },
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

      {/* Focused view */}
      {focused !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${focused + 1} of ${photos.length}`}
          className="fixed inset-0 z-[95] flex items-center justify-center p-4"
        >
          <div className="overlay-in absolute inset-0 bg-[rgb(0_0_0/0.72)] backdrop-blur-sm" onClick={close} aria-hidden />

          <div className="relative w-[min(86vw,27.5rem,calc((100dvh-9rem)*0.76))]">
            <ViewTransition name={`polaroid-${focused}`} share="morph" default="none">
              <div key={focused} className={stepped ? "polaroid-swap" : ""}>
                <Frame p={photos[focused]} large />
              </div>
            </ViewTransition>

            <div className="mt-4 flex items-center justify-between text-[rgb(255_255_255/0.85)]">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="inline-flex size-9 items-center justify-center rounded-full bg-[rgb(255_255_255/0.08)] transition-colors hover:bg-[rgb(255_255_255/0.18)]"
              >
                <ChevronLeft aria-hidden className="size-4" strokeWidth={1.75} />
              </button>
              <span className="font-mono text-meta tabular-nums">
                {focused + 1} / {photos.length}
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
      ) : null}
    </div>
  );
}
