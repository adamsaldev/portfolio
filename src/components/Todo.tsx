import type { ReactNode } from "react";
import { isDraft } from "@/lib/site";

/** Inline TODO marker. Rendered only in draft mode. */
export function Todo({ children }: { children: ReactNode }) {
  if (!isDraft) return null;
  return <span className="todo">{children}</span>;
}

/** Block of writing prompts / missing items. Rendered only in draft mode. */
export function DraftNote({
  title = "Draft — hidden in production",
  items,
}: {
  title?: string;
  items: string[];
}) {
  if (!isDraft || items.length === 0) return null;
  return (
    <aside className="rounded-md border border-dashed border-line-strong p-4 sm:p-5">
      <p className="label">{title}</p>
      <ul className="mt-3 space-y-1.5 font-mono text-small text-subtle">
        {items.map((item) => (
          <li key={item}>TODO(PORTFOLIO): {item}</li>
        ))}
      </ul>
    </aside>
  );
}
