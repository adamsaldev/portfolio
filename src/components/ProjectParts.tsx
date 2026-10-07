import type { ReactNode } from "react";
import type { Project } from "@/data/portfolio";
import { TextLink } from "@/components/TextLink";
import { Todo } from "@/components/Todo";
import { isDraft, isPending } from "@/lib/site";

export function StatusLabel({ project }: { project: Project }) {
  if (project.status === "published") return null;
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-meta whitespace-nowrap text-subtle uppercase">
      <span aria-hidden className="size-1.5 rounded-full border border-current" />
      In Development
    </span>
  );
}

export function VerificationBanner({ project }: { project: Project }) {
  if (!isDraft || !project.needsVerification) return null;
  return (
    <p className="todo inline-block">⚠ Needs verification before publication — see src/data/portfolio.ts</p>
  );
}

function hasTech(project: Project) {
  return project.technologies.length > 0;
}

export function TechList({ project }: { project: Project }) {
  if (!hasTech(project)) return null;
  return <span className="font-mono text-small text-muted">{project.technologies.join(" · ")}</span>;
}

/** Role / Year / Stack as a compact definition list. */
export function ProjectMeta({ project }: { project: Project }) {
  const rows: { term: string; value: ReactNode }[] = [];
  if (project.role) rows.push({ term: "Role", value: project.role });
  else if (isDraft) rows.push({ term: "Role", value: <Todo>Add role</Todo> });
  if (project.year) rows.push({ term: "Year", value: project.year });
  else if (isDraft) rows.push({ term: "Year", value: <Todo>Add verified year</Todo> });
  if (hasTech(project)) rows.push({ term: "Stack", value: <TechList project={project} /> });
  if (rows.length === 0) return null;

  return (
    <dl className="divide-y divide-line border-y border-line text-small">
      {rows.map((r) => (
        <div key={r.term} className="grid grid-cols-[5rem_1fr] gap-4 py-3">
          <dt className="label leading-6">{r.term}</dt>
          <dd className="leading-6">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** GitHub / Live demo links. Pending links show only in draft mode. */
export function OutboundLinks({ project }: { project: Project }) {
  const { github, demo } = project.links;
  const links = [
    github ? { label: "GitHub", href: github, todo: `Add ${project.name} GitHub URL` } : null,
    demo ? { label: "Live / Demo", href: demo, todo: `Add ${project.name} demo URL` } : null,
  ].filter((l): l is NonNullable<typeof l> => l !== null && (isDraft || !isPending(l.href)));
  if (links.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-small">
      {links.map((l) => (
        <li key={l.label}>
          <TextLink link={{ ...l, external: true }} />
        </li>
      ))}
    </ul>
  );
}
