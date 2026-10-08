import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";

/** Section: mono label + optional count on a hairline, content below. */
export function Section({
  id,
  label,
  aside,
  children,
  compact = false,
}: {
  id?: string;
  label: string;
  /** Small text on the right of the label row (e.g. a count). */
  aside?: ReactNode;
  children: ReactNode;
  /** Tighter vertical rhythm, used on project pages. */
  compact?: boolean;
}) {
  const headingId = id ? `${id}-label` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`relative scroll-mt-16 ${compact ? "py-8 sm:py-10" : "py-12 sm:py-16"}`}
    >
      <Container>
        <Reveal className="flex items-baseline justify-between border-t border-line pt-5">
          <h2 id={headingId} className="label">
            {label}
          </h2>
          {aside ? <span className="font-mono text-meta text-subtle tabular-nums">{aside}</span> : null}
        </Reveal>
        <div className="mt-6 sm:mt-8">{children}</div>
      </Container>
    </section>
  );
}
