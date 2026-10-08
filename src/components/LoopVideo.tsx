"use client";

import { useEffect, useRef } from "react";

/**
 * Silent looping demo clip. Autoplays only while on screen, and not at all
 * for people who prefer reduced motion (they get the poster + controls).
 */
export function LoopVideo({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      v.controls = true;
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => (v.controls = true));
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
