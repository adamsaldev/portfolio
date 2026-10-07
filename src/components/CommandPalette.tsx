"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, CornerDownLeft, Search } from "lucide-react";
import { setTheme, toggleTheme } from "@/components/ThemeToggle";

export type PaletteAction = "toggle-theme" | "system-theme" | "copy-email" | "copy-link";

export interface PaletteItem {
  id: string;
  group: string;
  label: string;
  hint?: string;
  href?: string;
  external?: boolean;
  action?: PaletteAction;
  keywords?: string;
  /** Payload for copy actions. */
  value?: string;
}

/** Event other components dispatch to open the palette. */
export const OPEN_PALETTE = "palette:open";

/**
 * Rank an item for a query. Substring hits on the label score highest, then
 * label subsequences (word starts weighted), then substring hits on group /
 * keywords. -1 means no match.
 */
function score(query: string, item: PaletteItem): number {
  const q = query.toLowerCase();
  const label = item.label.toLowerCase();
  const i = label.indexOf(q);
  if (i !== -1) return 200 - i;

  let ti = 0;
  let s = 0;
  let matched = true;
  for (const ch of q) {
    const j = label.indexOf(ch, ti);
    if (j === -1) {
      matched = false;
      break;
    }
    s += j === 0 || label[j - 1] === " " ? 6 : j === ti ? 3 : 1;
    ti = j + 1;
  }
  // Scattered single letters aren't a real match.
  if (matched && s >= q.length * 2) return 100 + s;

  const extra = `${item.group} ${item.keywords ?? ""}`.toLowerCase();
  return extra.includes(q) ? 50 : -1;
}

export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const listId = useId();

  const results = useMemo(() => {
    if (!query.trim()) return items;
    return items
      .map((it) => ({ it, s: score(query.trim(), it) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.it);
  }, [items, query]);

  const show = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  // Global shortcuts: ⌘K / Ctrl+K toggles; "/" opens when not typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, [contenteditable]");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else show();
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        show();
      }
    };
    const onOpen = () => show();
    addEventListener("keydown", onKey);
    addEventListener(OPEN_PALETTE, onOpen);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener(OPEN_PALETTE, onOpen);
    };
  }, [open, show, close]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Keep the active row in view.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(id);
  }, [toast]);

  const run = async (item: PaletteItem) => {
    close();
    if (item.href) {
      if (item.external) window.open(item.href, "_blank", "noopener,noreferrer");
      else router.push(item.href);
      return;
    }
    switch (item.action) {
      case "toggle-theme":
        toggleTheme();
        break;
      case "system-theme":
        setTheme(null);
        setToast("Following system theme");
        break;
      case "copy-email":
      case "copy-link": {
        const text = item.action === "copy-link" ? location.href : (item.value ?? "");
        try {
          await navigator.clipboard.writeText(text);
          setToast(item.action === "copy-link" ? "Link copied" : "Email copied");
        } catch {
          setToast("Couldn't access clipboard");
        }
        break;
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) run(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      // Keep focus inside the dialog: the input is the only tab stop.
      e.preventDefault();
    }
  };

  let lastGroup = "";

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-[100]" onKeyDown={onKeyDown}>
          <div
            className="overlay-in absolute inset-0 bg-[rgb(0_0_0/0.28)] backdrop-blur-[2px]"
            onClick={close}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            className="palette-in relative mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-[34rem] overflow-hidden rounded-xl border border-line-strong bg-bg-raised shadow-[0_24px_80px_-12px_rgb(0_0_0/0.35)]"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search aria-hidden className="size-4 shrink-0 text-subtle" strokeWidth={1.75} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Search projects, links, actions…"
                aria-label="Search commands"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={results[active] ? `${listId}-${results[active].id}` : undefined}
                className="palette-input h-12 w-full bg-transparent text-body placeholder:text-subtle"
                autoComplete="off"
                spellCheck={false}
              />
              <span className="kbd shrink-0">esc</span>
            </div>

            <ul ref={listRef} id={listId} role="listbox" className="max-h-[min(22rem,55vh)] overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="px-3 py-8 text-center text-small text-subtle">No results for “{query}”</li>
              ) : (
                results.map((item, i) => {
                  const header = item.group !== lastGroup && !query ? item.group : null;
                  lastGroup = item.group;
                  return (
                    <li key={item.id} role="presentation">
                      {header ? <p className="label px-3 pt-3 pb-1.5">{header}</p> : null}
                      <div
                        id={`${listId}-${item.id}`}
                        role="option"
                        aria-selected={i === active}
                        data-index={i}
                        onMouseMove={() => setActive(i)}
                        onClick={() => run(item)}
                        className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-body transition-colors duration-100 ${
                          i === active ? "bg-panel text-fg" : "text-muted"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        <span className="flex shrink-0 items-center gap-2 font-mono text-meta text-subtle">
                          {item.hint}
                          {item.external ? (
                            <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.75} />
                          ) : i === active ? (
                            <CornerDownLeft aria-hidden className="size-3.5" strokeWidth={1.75} />
                          ) : null}
                        </span>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>

            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-meta text-subtle">
              <span className="flex items-center gap-1.5">
                <span className="kbd">↑</span>
                <span className="kbd">↓</span> navigate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="kbd">↵</span> open
              </span>
              <span className="ml-auto hidden sm:inline">⌘K anywhere</span>
            </div>
          </div>
        </div>
      ) : null}

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[110] flex justify-center">
        {toast ? (
          <p className="palette-in flex items-center gap-2 rounded-full border border-line-strong bg-bg-raised px-4 py-2 text-small shadow-lg">
            <Check aria-hidden className="size-3.5 text-accent" strokeWidth={2} />
            {toast}
          </p>
        ) : null}
      </div>
    </>
  );
}

/** Small header button that opens the palette (shows ⌘K). */
export function PaletteButton() {
  return (
    <button
      type="button"
      onClick={() => dispatchEvent(new Event(OPEN_PALETTE))}
      aria-label="Open command menu"
      className="group inline-flex h-8 items-center gap-2 rounded-md px-2 text-small text-muted transition-colors duration-200 hover:bg-panel hover:text-fg"
    >
      <Search aria-hidden className="size-3.5" strokeWidth={1.75} />
      <span className="kbd hidden transition-colors group-hover:text-fg sm:inline">⌘K</span>
    </button>
  );
}
