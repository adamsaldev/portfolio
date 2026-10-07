import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { about, education, experience, personal } from "@/data/portfolio";
import { Container } from "@/components/Container";
import { LocalTime } from "@/components/LocalTime";
import { TextLink } from "@/components/TextLink";
import { Todo } from "@/components/Todo";
import { profileLinks } from "@/lib/links";
import { isDraft, publicFileExists, shouldShowLink } from "@/lib/site";

const delay = (d: number) => ({ "--d": d }) as CSSProperties;

/** The name, with each letter rising in on first paint. */
function AnimatedName({ text }: { text: string }) {
  let i = 0;
  return (
    <span aria-hidden>
      {text.split(" ").map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch) => (
            <span key={i} className="rise" style={{ "--i": i++ } as CSSProperties}>
              {ch}
            </span>
          ))}
          {w < text.split(" ").length - 1 ? <span className="inline-block w-[0.26em]" /> : null}
        </span>
      ))}
    </span>
  );
}

function Portrait() {
  const src = personal.headshotPath;
  const frame = "aspect-square w-16 shrink-0 overflow-hidden rounded-lg";
  if (src && publicFileExists(src)) {
    return (
      <div className={`relative ${frame}`}>
        <Image src={src} alt={`Portrait of ${personal.name}`} fill sizes="64px" preload className="object-cover" />
      </div>
    );
  }
  if (!isDraft) return null;
  return (
    <div
      className={`${frame} flex items-center justify-center border border-dashed border-line-strong font-mono text-[9px] text-subtle`}
      title={`TODO(PORTFOLIO): Add headshot at /public${src ?? "/headshot.jpg"}`}
    >
      PHOTO
    </div>
  );
}

/** Institution name with an optional favicon; links out when `href` is set. */
function Institution({ name, href, logo }: { name: string; href?: string; logo?: string }) {
  const icon =
    logo && publicFileExists(logo) ? (
      <Image
        src={logo}
        alt=""
        width={32}
        height={32}
        className="mr-1.5 inline-block size-3.5 rounded-[3px] align-[-0.15em]"
      />
    ) : null;
  if (!href) {
    return (
      <span>
        {icon}
        {name}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-baseline transition-colors duration-200 hover:text-fg"
    >
      {icon}
      <span className="link-quiet">{name}</span>
      <ArrowUpRight
        aria-hidden
        className="arrow arrow-up ml-0.5 size-3 self-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        strokeWidth={1.75}
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** One datasheet row: mono label left, value right. */
function Row({ label, children, d }: { label: string; children: ReactNode; d: number }) {
  return (
    <div
      className="fade-up group/row grid grid-cols-[6.5rem_1fr] gap-4 py-3 transition-colors duration-200"
      style={delay(d)}
    >
      <dt className="label pt-[3px] transition-colors duration-200 group-hover/row:text-fg">{label}</dt>
      <dd className="min-w-0 text-body leading-snug">{children}</dd>
    </div>
  );
}

export function Hero() {
  const links = profileLinks().filter(shouldShowLink);
  const jobs = experience.filter((e) => isDraft || !e.placeholder);

  return (
    <section aria-labelledby="hero-name" className="pt-14 pb-6 sm:pt-24 sm:pb-10">
      <Container>
        <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-10">
          {/* Identity */}
          <div className="md:col-span-7">
            <div className="fade-up flex items-center gap-4" style={delay(0)}>
              <Portrait />
              <p className="font-mono text-small text-subtle">{personal.title}</p>
            </div>

            <h1 id="hero-name" className="mt-6 text-display font-semibold" aria-label={personal.name}>
              <AnimatedName text={personal.name} />
            </h1>

            <p className="fade-up mt-5 max-w-[30rem] text-lead text-muted" style={delay(2)}>
              {personal.intro}
            </p>

            {links.length > 0 ? (
              <ul
                className="fade-up mt-7 flex flex-wrap gap-x-5 gap-y-2 text-small"
                style={delay(3)}
                aria-label="Profiles and contact"
              >
                {links.map((link) => (
                  <li key={link.label}>
                    <TextLink link={link} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Datasheet */}
          <dl className="divide-y divide-line border-y border-line md:col-span-5 md:self-end">
            <Row label="Now" d={2}>
              {education.map((e) => (
                <div key={e.institution}>
                  <p className="font-medium">{e.field}</p>
                  <p className="text-muted">
                    <Institution name={e.institution} href={e.href} logo={e.logo} />
                  </p>
                  <p className="mt-0.5 font-mono text-meta text-subtle tabular-nums">
                    {e.start} — {e.end}
                    {e.endNote ? ` · ${e.endNote}` : ""}
                  </p>
                  {e.details.length > 0 ? (
                    <p className="mt-1 text-small text-muted">{e.details.join(" · ")}</p>
                  ) : null}
                </div>
              ))}
            </Row>

            {jobs.length > 0 ? (
              <Row label="Previously" d={3}>
                <ul id="experience" className="space-y-2">
                  {jobs.map((job, i) => (
                    <li key={`${job.organization}-${i}`} className={job.placeholder ? "opacity-60" : ""}>
                      <p>
                        <span className="font-medium">{job.position}</span>
                        <span className="text-muted">, </span>
                        {job.href ? (
                          <a href={job.href} target="_blank" rel="noopener noreferrer" className="link-quiet text-muted">
                            {job.organization}
                          </a>
                        ) : (
                          <span className="text-muted">{job.organization}</span>
                        )}
                      </p>
                      <p className="mt-0.5 font-mono text-meta text-subtle">
                        {job.date}
                        {job.placeholder ? (
                          <span className="ml-2">
                            <Todo>Placeholder</Todo>
                          </span>
                        ) : null}
                      </p>
                    </li>
                  ))}
                </ul>
              </Row>
            ) : null}

            <Row label="Focus" d={4}>
              <span className="text-muted">{about.interests.map((i) => i.area).join(" · ")}</span>
            </Row>

            {personal.timezone ? (
              <Row label="Local time" d={5}>
                <LocalTime timeZone={personal.timezone} label={personal.timezoneLabel} />
              </Row>
            ) : null}

            {personal.availability ? (
              <Row label="Status" d={6}>
                <span className="inline-flex items-center gap-2.5">
                  <span aria-hidden className="relative inline-flex size-1.5 shrink-0">
                    <span className="breathe absolute inset-0 rounded-full bg-accent" />
                    <span className="relative size-1.5 rounded-full bg-accent" />
                  </span>
                  {personal.availability}
                </span>
              </Row>
            ) : null}
          </dl>
        </div>
      </Container>
    </section>
  );
}
