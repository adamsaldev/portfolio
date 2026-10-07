/**
 * Data-flow diagram in plain HTML/CSS (no image).
 *
 *   Source A ─┐
 *   Source B ─┼── Layer → Layer → Layer → View
 *   Source C ─┘
 *
 * Desktop: sources merge into a horizontal pipeline.
 * Mobile:  everything reflows vertically.
 */
export function ArchitectureDiagram({
  sources,
  pipeline,
  caption = "Conceptual data flow",
}: {
  sources: string[];
  pipeline: string[];
  caption?: string;
}) {
  // Long pipelines don't fit across; render them as a vertical flow instead.
  if (pipeline.length > 4) {
    return <StackedDiagram sources={sources} pipeline={pipeline} caption={caption} />;
  }

  const last = sources.length - 1;

  return (
    <figure className="rounded-lg border border-line p-5 sm:p-8">
      <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] lg:gap-10">
        {/* Sources */}
        <div>
          <p className="label mb-3">Sources</p>
          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {sources.map((s, i) => (
              <li
                key={s}
                className="relative rounded-md border border-line-strong bg-bg px-3 transition-colors duration-200 hover:border-fg py-2.5 font-mono text-small"
              >
                {s}
                {/* connector: horizontal stub */}
                <span aria-hidden className="absolute top-1/2 left-full hidden h-px w-5 bg-line-strong lg:block" />
                {/* connector: vertical spine segment */}
                <span
                  aria-hidden
                  className={`absolute left-[calc(100%+1.25rem)] hidden w-px bg-line-strong lg:block ${
                    sources.length === 1
                      ? "h-0"
                      : i === 0
                        ? "top-1/2 -bottom-1"
                        : i === last
                          ? "-top-1 bottom-1/2"
                          : "-top-1 -bottom-1"
                  }`}
                />
              </li>
            ))}
          </ul>
        </div>

        <p aria-hidden className="text-center font-mono text-subtle lg:hidden">↓</p>

        {/* Pipeline */}
        <div className="relative lg:pt-7">
          <span aria-hidden className="absolute top-[calc(50%+0.875rem)] right-full hidden h-px w-5 bg-line-strong lg:block" />
          <p className="label mb-3 lg:absolute lg:top-0 lg:left-0 lg:mb-0">Application</p>
          <ol className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-stretch lg:gap-0">
            {pipeline.map((step, i) => (
              <li key={step} className="flex min-w-0 flex-col items-stretch lg:flex-1 lg:flex-row">
                <div
                  className={`flex-1 rounded-md border bg-bg px-3 py-3 transition-colors duration-200 hover:border-fg lg:px-2.5 lg:py-4 ${
                    i === pipeline.length - 1 ? "border-accent" : "border-line-strong"
                  }`}
                >
                  <span className="block font-mono text-meta text-subtle tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block text-small font-medium lg:whitespace-nowrap">{step}</span>
                </div>
                {i < pipeline.length - 1 ? (
                  <span aria-hidden className="py-1 text-center font-mono text-subtle lg:self-center lg:px-1.5 lg:py-0">
                    <span className="lg:hidden">↓</span>
                    <span className="hidden lg:inline">→</span>
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <figcaption className="mt-6 font-mono text-meta text-subtle">
        {caption}: {sources.join(", ")} → {pipeline.join(" → ")}
      </figcaption>
    </figure>
  );
}

/** Vertical variant: source chips, then numbered steps joined by arrows. */
function StackedDiagram({
  sources,
  pipeline,
  caption,
}: {
  sources: string[];
  pipeline: string[];
  caption: string;
}) {
  return (
    <figure className="rounded-lg border border-line p-5 sm:p-8">
      <p className="label mb-3">{sources.length > 1 ? "Sources" : "Source"}</p>
      <ul className="flex flex-wrap gap-2">
        {sources.map((s) => (
          <li
            key={s}
            className="rounded-md border border-line-strong bg-bg px-3 py-2.5 font-mono text-small transition-colors duration-200 hover:border-fg"
          >
            {s}
          </li>
        ))}
      </ul>

      <p aria-hidden className="py-1.5 pl-4 font-mono text-subtle">↓</p>

      <ol className="max-w-[28rem]">
        {pipeline.map((step, i) => (
          <li key={step}>
            <div
              className={`flex items-baseline gap-3 rounded-md border bg-bg px-3 py-2.5 transition-colors duration-200 hover:border-fg ${
                i === pipeline.length - 1 ? "border-accent" : "border-line-strong"
              }`}
            >
              <span className="font-mono text-meta text-subtle tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-small font-medium">{step}</span>
            </div>
            {i < pipeline.length - 1 ? (
              <p aria-hidden className="py-0.5 pl-4 font-mono text-meta leading-5 text-subtle">↓</p>
            ) : null}
          </li>
        ))}
      </ol>

      <figcaption className="mt-6 font-mono text-meta text-subtle">
        {caption}: {sources.join(", ")} → {pipeline.join(" → ")}
      </figcaption>
    </figure>
  );
}
