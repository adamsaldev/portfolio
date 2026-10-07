import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { ProjectMedia } from "@/components/ProjectMedia";
import { StatusLabel } from "@/components/ProjectParts";
import { Todo } from "@/components/Todo";

/**
 * Project card: main screenshot, then name — role, year, and a one-line
 * description. The whole card links to /projects/<slug>; its image morphs
 * into the project page hero.
 */
export function ProjectCard({ project, large = false }: { project: Project; large?: boolean }) {
  const subtitle = project.role ?? project.category;

  return (
    <article aria-labelledby={`${project.slug}-title`}>
      <Link href={`/projects/${project.slug}`} className="group block rounded-xl focus-visible:outline-offset-4">
        <ViewTransition name={`media-${project.slug}`} share="morph" default="none">
          <div className="rounded-xl transition-transform duration-500 ease-[var(--ease)] group-hover:-translate-y-1">
            <ProjectMedia
              asset={project.media.hero}
              frame={large ? "wide" : "card"}
              fallbackTitle={project.name}
              spotlight
              sizes={large ? "(min-width: 960px) 896px, 100vw" : "(min-width: 960px) 436px, (min-width: 768px) 46vw, 100vw"}
              className="transition-[border-color,box-shadow] duration-500 group-hover:border-line-strong group-hover:shadow-[0_18px_40px_-24px_rgb(0_0_0/0.35)]"
            />
          </div>
        </ViewTransition>

        <div className="mt-4 flex items-baseline justify-between gap-4">
          <h3 id={`${project.slug}-title`} className="min-w-0 text-title">
            <span className="font-semibold">{project.name}</span>
            <span className="text-muted"> — {subtitle}</span>
          </h3>
          <span className="shrink-0 font-mono text-small text-subtle tabular-nums">
            {project.year ?? <Todo>Year</Todo>}
          </span>
        </div>

        <p className={`mt-1.5 text-body text-muted ${large ? "max-w-[40rem]" : ""}`}>{project.description}</p>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-small font-medium">
            <span className="link-quiet">View project</span>
            <ArrowRight aria-hidden className="arrow size-3.5" strokeWidth={1.75} />
          </span>
          <StatusLabel project={project} />
        </div>
      </Link>
    </article>
  );
}
