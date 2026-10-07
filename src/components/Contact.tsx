import { contact, personal, socials } from "@/data/portfolio";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { TextLink } from "@/components/TextLink";
import { Todo } from "@/components/Todo";
import { resumeLink } from "@/lib/links";
import { shouldShowLink } from "@/lib/site";

export function Contact() {
  const links = [socials.linkedin, socials.github, resumeLink()].filter(shouldShowLink);
  return (
    <Section id="contact" label="Contact">
      <Reveal>
        <h3 className="text-heading font-semibold">{contact.heading}</h3>
        <p className="mt-3 max-w-[30rem] text-lead text-muted">
          {contact.body}
          {personal.email ? ` ${contact.emailLine}` : null}
        </p>

        <div className="mt-6">
          {personal.email ? (
            <a href={`mailto:${personal.email}`} className="group inline-flex items-baseline gap-2 text-title font-medium">
              <span className="link break-all">{personal.email}</span>
              <span aria-hidden className="arrow text-subtle">→</span>
            </a>
          ) : (
            // TODO(PORTFOLIO): Add email address in src/data/portfolio.ts
            <Todo>TODO: Add email address</Todo>
          )}
        </div>

        {links.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-small text-muted">
            {links.map((l) => (
              <li key={l.label}>
                <TextLink link={l} />
              </li>
            ))}
          </ul>
        ) : null}
      </Reveal>
    </Section>
  );
}
