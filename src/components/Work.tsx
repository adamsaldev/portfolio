import type { CSSProperties } from "react";
import { projects } from "@/data/portfolio";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import { visibleProjects } from "@/lib/site";

/** PROJECTS — project cards. Featured projects span the full width. */
export function Work() {
  const list = visibleProjects(projects);
  return (
    <Section id="work" label="Projects">
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 md:gap-y-14">
        {list.map((p, i) => (
          // Scroll-driven entrance (not [data-reveal]) so a visible card is never
          // hidden when the image morphs back from its project page.
          <div
            key={p.slug}
            style={{ "--d": p.featured ? 0 : i % 2 } as CSSProperties}
            className={`reveal-view ${p.featured ? "md:col-span-2" : ""}`}
          >
            <ProjectCard project={p} large={p.featured} />
          </div>
        ))}
      </div>
    </Section>
  );
}
