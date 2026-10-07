"use client";

import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";

function resolvedTheme(): Theme {
  const attr = document.documentElement.dataset.theme;
  if (attr === "light" || attr === "dark") return attr;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Switch theme with a circular reveal from (x, y).
 * Falls back to an instant switch without View Transitions or with
 * reduced motion. `null` returns to the system preference.
 */
export function setTheme(next: Theme | null, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const apply = () => {
    if (next) root.dataset.theme = next;
    else delete root.dataset.theme;
    try {
      if (next) localStorage.setItem("theme", next);
      else localStorage.removeItem("theme");
    } catch {}
  };

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduce) return apply();

  const x = origin?.x ?? innerWidth - 40;
  const y = origin?.y ?? 32;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  root.classList.add("theme-switching");
  const t = document.startViewTransition(() => flushSync(apply));
  t.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 560, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  });
  t.finished.finally(() => root.classList.remove("theme-switching"));
}

export function toggleTheme(origin?: { x: number; y: number }) {
  setTheme(resolvedTheme() === "dark" ? "light" : "dark", origin);
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Toggle light and dark theme"
      title="Toggle theme"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className="inline-flex size-8 items-center justify-center rounded-md text-muted transition-colors duration-200 hover:bg-panel hover:text-fg"
    >
      {/* Both icons render; CSS shows the right one, so there's no hydration flash. */}
      <Sun aria-hidden className="theme-icon-dark size-4" strokeWidth={1.75} />
      <Moon aria-hidden className="theme-icon-light size-4" strokeWidth={1.75} />
    </button>
  );
}
