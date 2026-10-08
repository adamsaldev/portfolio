import Link from "next/link";
import { ViewTransition, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { CaseStudySection, EvolutionStage, Project, Repository } from "@/data/portfolio";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { ComparisonChart } from "@/components/ComparisonChart";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { ProjectMedia, mediaVisible } from "@/components/ProjectMedia";
import {
  OutboundLinks,
  ProjectMeta,
  StatusLabel,
  VerificationBanner,
} from "@/components/ProjectParts";
import { Section } from "@/components/Section";
import { DraftNote } from "@/components/Todo";
import { isDraft } from "@/lib/site";

function Prose({ paragraphs }: { paragraphs: string[] }) {
  if (paragraphs.length === 0) return null;
  return (
    <div className="max-w-[38rem] space-y-4 text-lead text-muted">
      {paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

/**
 * Case-study block. Shown when it has real content, when `show` forces it,
 * or in draft mode (where its TODO prompts appear).
 */
function Block({
  id,
  label,
  section,
  show = false,
  children,
}: {
  id: string;
  label: string;
  section?: CaseStudySection;
  show?: boolean;
  children?: ReactNode;
}) {
  const hasBody = (section?.body.length ?? 0) > 0;
  const hasTodo = isDraft && (section?.todo?.length ?? 0) > 0;
  if (!hasBody && !show && !hasTodo) return null;
  return (
    <Section id={id} label={label} compact>
      <Reveal className="space-y-8">
        <Prose paragraphs={section?.body ?? []} />
        {children}
        <DraftNote items={section?.todo ?? []} />
      </Reveal>
    </Section>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-8 border-t border-line text-body sm:grid-cols-2">
      {items.map((f) => (
        <li key={f} className="flex items-baseline gap-3 border-b border-line py-2.5">
          <span aria-hidden className="size-1 shrink-0 translate-y-[-2px] rounded-full bg-accent" />
          {f}
        </li>
      ))}
    </ul>
  );
}

/** Source repositories, one per row. */
function Repositories({ repos }: { repos: Repository[] }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {repos.map((r) => (
        <li key={r.href}>
          <a
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid gap-1 py-3.5 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-6"
          >
            <span className="inline-flex items-center gap-1 font-mono text-small">
              <span className="link-quiet truncate">{r.label}</span>
              <ArrowUpRight aria-hidden className="arrow arrow-up size-3.5 shrink-0 text-subtle" strokeWidth={1.75} />
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
            {r.note ? (
              <span className="text-small text-muted transition-colors duration-200 group-hover:text-fg">
                {r.note}
              </span>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** How the project changed across versions: stacked stages joined by arrows. */
function Evolution({ stages }: { stages: EvolutionStage[] }) {
  return (
    <ol className="space-y-0">
      {stages.map((st, i) => (
        <li key={st.name}>
          <div
            className={`rounded-lg border px-4 py-4 transition-colors duration-200 hover:border-fg sm:px-5 ${
              i === stages.length - 1 ? "border-accent" : "border-line-strong"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="label">
                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span> · {st.stage}
              </p>
              {st.href ? (
                <a
                  href={st.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 font-mono text-meta text-subtle transition-colors hover:text-fg"
                >
                  <span className="link-quiet">GitHub</span>
                  <ArrowUpRight aria-hidden className="arrow arrow-up size-3" strokeWidth={1.75} />
                  <span className="sr-only"> — {st.name} (opens in a new tab)</span>
                </a>
              ) : null}
            </div>
            <h3 className="mt-1.5 text-body font-medium">{st.name}</h3>
            <ul className="mt-2 space-y-1">
              {st.points.map((pt) => (
                <li key={pt} className="flex items-baseline gap-3 text-small text-muted">
                  <span aria-hidden className="size-1 shrink-0 translate-y-[-2px] rounded-full bg-accent" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
          {i < stages.length - 1 ? (
            <p aria-hidden className="py-1.5 text-center font-mono text-subtle">↓</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function ProjectPage({ project, next }: { project: Project; next?: Project }) {
  const cs = project.caseStudy;
  const gallery = (project.media.gallery ?? []).filter(mediaVisible);
  const features = project.features ?? [];
  const focus = project.focus ?? [];
  const phoneGallery = gallery.every((a) => a.frame === "phone");

  return (
    <>
      <div className="read-progress" aria-hidden />

      {/* Title */}
      <Container className="pt-8 sm:pt-12">
        <Link
          href="/#work"
          className="group inline-flex items-center gap-1.5 text-small text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft
            aria-hidden
            className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
            strokeWidth={1.75}
          />
          All projects
        </Link>

        <div className="mt-10 sm:mt-12">
          <VerificationBanner project={project} />
        </div>

        <div className="fade-up mt-4 grid gap-y-8 md:grid-cols-12 md:gap-x-10">
          <div className="md:col-span-7">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="label">
                Project <span className="tabular-nums">· {project.number}</span>
              </p>
              <StatusLabel project={project} />
            </div>
            <h1 className="mt-4 text-display font-semibold">
              {project.name}
            </h1>
            <p className="mt-2 text-title text-muted">
              {project.category}
            </p>
            <p className="mt-5 max-w-[34rem] text-lead text-muted">
              {project.description}
            </p>
            <div className="mt-6">
              <OutboundLinks project={project} />
            </div>
          </div>
          <div className="md:col-span-5 md:self-end">
            <ProjectMeta project={project} />
          </div>
        </div>

        {mediaVisible(project.media.hero) ? (
          <div className="mt-10 sm:mt-12">
            <ViewTransition name={`media-${project.slug}`} share="morph" default="none">
              <div>
                <ProjectMedia asset={project.media.hero} preload />
              </div>
            </ViewTransition>
          </div>
        ) : null}
      </Container>

      <div className="mt-6">
        <Block
          id="overview"
          label="Overview"
          section={cs?.overview}
          show={features.length > 0}
        >
          {features.length > 0 ? <FeatureList items={features} /> : null}
        </Block>

        {gallery.length > 0 ? (
          <Container>
            <Reveal
              className={`grid gap-4 sm:gap-6 md:grid-cols-12 ${phoneGallery ? "grid-cols-2" : "grid-cols-1"}`}
            >
              {gallery.map((asset, i) => (
                <div
                  key={asset.src}
                  className={
                    phoneGallery
                      ? `md:col-span-4 ${i === 0 && gallery.length === 2 ? "md:col-start-4" : ""}`
                      : "md:col-span-6"
                  }
                >
                  <ProjectMedia
                    asset={asset}
                    sizes={phoneGallery ? "(min-width: 768px) 340px, 50vw" : "(min-width: 768px) 440px, 100vw"}
                  />
                </div>
              ))}
            </Reveal>
          </Container>
        ) : null}

        {focus.length > 0 ? (
          <Section id="focus" label="Focus" compact>
            <ul className="flex flex-wrap gap-2">
              {focus.map((f) => (
                <li key={f} className="rounded-md border border-line-strong px-3 py-1.5 text-small transition-colors duration-200 hover:border-fg">
                  {f}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {cs ? (
          <>
            <Block id="problem" label="Problem" section={cs.problem} />

            {cs.architecture ? (
              <Block id="architecture" label="Architecture" section={cs.architecture} show>
                <ArchitectureDiagram
                  sources={cs.architecture.sources}
                  pipeline={cs.architecture.pipeline}
                  caption={cs.architecture.caption}
                />
              </Block>
            ) : null}

            {cs.evolution ? (
              <Block id="evolution" label="Evolution" section={cs.evolution} show>
                <Evolution stages={cs.evolution.stages} />
              </Block>
            ) : null}

            <Block
              id="performance"
              label="Performance"
              section={cs.performance}
              show={(cs.performance?.metrics.length ?? 0) > 0 || !!cs.performance?.comparison}
            >
              {cs.performance?.comparison ? <ComparisonChart data={cs.performance.comparison} /> : null}
              {cs.performance && cs.performance.metrics.length > 0 ? (
                <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {cs.performance.metrics.map((m) => (
                    <div key={m.label} className="border-t border-line pt-3">
                      <dt className="label">{m.label}</dt>
                      <dd className="mt-1 text-heading font-medium tabular-nums">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </Block>

            <Block
              id="challenges"
              label="Technical challenges"
              section={cs.challenges}
              show={(cs.challenges?.items.length ?? 0) > 0}
            >
              {cs.challenges && cs.challenges.items.length > 0 ? (
                <ol className="divide-y divide-line border-y border-line">
                  {cs.challenges.items.map((c, i) => (
                    <li key={c.title} className="grid gap-2 py-5 sm:grid-cols-[3rem_1fr]">
                      <span className="font-mono text-small text-subtle tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-medium tracking-[-0.01em]">{c.title}</h3>
                        <p className="mt-1.5 max-w-[40rem] leading-relaxed text-muted">{c.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : null}
            </Block>

            <Block id="learned" label="What I learned" section={cs.learned} />
          </>
        ) : null}

        {project.repositories && project.repositories.length > 0 ? (
          <Section id="repositories" label="Repositories" compact>
            <Reveal>
              <Repositories repos={project.repositories} />
            </Reveal>
          </Section>
        ) : null}

        {project.technologies.length > 0 ? (
          <Section id="stack" label="Stack" compact>
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <li key={t} className="rounded-md border border-line-strong px-3 py-1.5 font-mono text-small transition-colors duration-200 hover:border-fg">
                  {t}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {next ? (
          <Container className="pt-6 pb-4">
            <Link
              href={`/projects/${next.slug}`}
              className="group flex items-baseline justify-between gap-6 border-t border-line pt-8"
            >
              <span className="label">Next project</span>
              <span className="inline-flex items-center gap-2 text-title font-semibold">
                <span className="link-quiet">{next.name}</span>
                <ArrowRight aria-hidden className="arrow size-[0.8em]" strokeWidth={1.75} />
              </span>
            </Link>
          </Container>
        ) : null}
      </div>
    </>
  );
}
