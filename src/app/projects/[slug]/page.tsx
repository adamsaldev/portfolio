import { ViewTransition } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Contact } from "@/components/Contact";
import { ProjectPage } from "@/components/ProjectPage";
import { projects } from "@/data/portfolio";
import { siteUrl, visibleProjects } from "@/lib/site";

const list = visibleProjects(projects);

// Every visible project gets a prerendered page at /projects/<slug>.
export function generateStaticParams() {
  return list.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = list.find((p) => p.slug === slug);
  if (!project) return {};
  const title = project.name;
  return {
    title,
    description: project.description,
    alternates: siteUrl ? { canonical: `/projects/${project.slug}` } : undefined,
    // Page-level openGraph replaces the root one, so re-reference the share image.
    openGraph: { title, description: project.description, images: ["/opengraph-image"] },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function Page({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const index = list.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = list[index];
  const next = list.length > 1 ? list[(index + 1) % list.length] : undefined;

  return (
    <main id="main" className="flex-1">
      <ViewTransition enter="page-enter" exit="page-exit" default="none">
        <div>
          <ProjectPage project={project} next={next} />
          <Contact />
        </div>
      </ViewTransition>
    </main>
  );
}
