"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

// One observer shared by every <Reveal>.
const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | null = null;
function observe(el: Element, onIn: () => void) {
  if (!("IntersectionObserver" in window)) return onIn();
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        callbacks.get(e.target)?.();
        callbacks.delete(e.target);
        observer?.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );
  callbacks.set(el, onIn);
  observer.observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}

/**
 * Fades + lifts its content in the first time it scrolls into view.
 * Without JS (no `html.js`), content is simply visible.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Stagger step (×80ms). */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    return observe(ref.current, () => setSeen(true));
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      data-in={seen ? "" : undefined}
      style={{ "--d": delay } as CSSProperties}
      className={className}
    >
      {children}
    </div>
  );
}
