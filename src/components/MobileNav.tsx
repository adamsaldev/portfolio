"use client";

import { useEffect, useId, useState } from "react";

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  pending?: boolean;
}

/** Small disclosure menu for narrow screens. The only client JS in the header. */
export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="-mr-2 ml-1 px-2 py-2 text-small text-muted transition-colors hover:text-fg"
      >
        {open ? "Close" : "Menu"}
      </button>

      <nav
        id={panelId}
        aria-label="Primary"
        hidden={!open}
        className="palette-in absolute inset-x-0 top-full border-b border-line bg-bg"
      >
        <ul className="px-5 pb-4">
          {items.map((item) => (
            <li key={item.label} className="border-t border-line first:border-t-0">
              {item.pending ? (
                <span
                  className="block py-3.5 text-lead text-subtle underline decoration-dashed underline-offset-4"
                  title="TODO(PORTFOLIO): link not added yet"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-3.5 text-lead"
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {item.label}
                  <span aria-hidden className="text-subtle">
                    {item.external ? "↗" : "→"}
                  </span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
