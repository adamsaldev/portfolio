import type { CSSProperties } from "react";
import type { Comparison } from "@/data/portfolio";

const fmt = (s: number) => (s >= 10 ? s.toFixed(1) : s.toFixed(2));

/**
 * Horizontal bar chart for a timing comparison (one measure, linear scale
 * from zero). The highlighted row is the accent; everything else is neutral.
 * Values are direct-labeled; hover/focus a row for its individual trials.
 */
export function ComparisonChart({ data }: { data: Comparison }) {
  const max = Math.max(...data.rows.map((r) => r.median));
  const baseline = data.rows.find((r) => r.baseline);

  return (
    <figure className="rounded-lg border border-line p-5 sm:p-8">
      <figcaption className="mb-6">
        <p className="text-body font-medium">{data.title}</p>
        <p className="mt-1 text-small text-muted">{data.setup}</p>
      </figcaption>

      <ul className="space-y-4">
        {data.rows.map((r) => {
          const pct = Math.max((r.median / max) * 100, 0.4);
          const ratio = baseline && r !== baseline ? r.median / baseline.median : null;
          return (
            <li
              key={r.label}
              tabIndex={0}
              className="group/bar relative grid gap-x-6 gap-y-1.5 rounded-md outline-offset-4 sm:grid-cols-[minmax(0,15rem)_1fr]"
            >
              <div className="min-w-0">
                <p className={`text-small font-medium ${r.highlight ? "text-fg" : "text-muted"}`}>{r.label}</p>
                <p className="text-meta text-subtle">{r.detail}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative h-2.5 flex-1">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-r-[4px] transition-opacity duration-200 group-hover/bar:opacity-80 ${
                      r.highlight ? "bg-accent" : "bg-line-strong"
                    }`}
                    style={{ width: `${pct}%` } as CSSProperties}
                  />
                </div>
                <span className="w-16 shrink-0 text-right font-mono text-small tabular-nums">
                  {fmt(r.median)} s
                </span>
              </div>

              {/* Tooltip: individual trials + ratio to the baseline */}
              <div
                role="tooltip"
                className="pointer-events-none absolute right-0 bottom-full z-10 mb-2 rounded-md border border-line-strong bg-bg-raised px-3 py-2 font-mono text-meta text-muted opacity-0 shadow-lg transition-opacity duration-150 group-hover/bar:opacity-100 group-focus-visible/bar:opacity-100"
              >
                <span className="text-fg">{r.label}</span>
                <br />
                {r.trials.length > 1
                  ? `median of ${r.trials.length}: ${r.trials.map(fmt).join(" · ")} s`
                  : `1 run: ${fmt(r.trials[0])} s`}
                {ratio ? (
                  <>
                    <br />
                    {ratio >= 1
                      ? `${ratio.toFixed(ratio >= 10 ? 0 : 1)}× slower than ${baseline?.label}`
                      : `${(1 / ratio).toFixed(1 / ratio >= 10 ? 0 : 1)}× faster than ${baseline?.label}`}
                  </>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      {data.note ? <p className="mt-6 text-small text-subtle">{data.note}</p> : null}
    </figure>
  );
}
