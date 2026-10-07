"use client";

import { useEffect } from "react";

/**
 * Page-wide, dependency-free interactions:
 *  - cursor spotlight position for .spotlight elements
 *  - `data-scrolled` on <html> once the page leaves the top
 */
export function ClientEffects() {
  // Spotlight + scrolled header.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const onScroll = () => {
      const root = document.documentElement;
      if (scrollY > 8) root.setAttribute("data-scrolled", "");
      else root.removeAttribute("data-scrolled");
    };
    onScroll();
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("pointermove", onMove);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
