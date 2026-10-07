import { PENDING, personal, socials, type LinkItem } from "@/data/portfolio";
import { publicFileExists } from "@/lib/site";

export function resumeLink(): LinkItem {
  return {
    label: "Resume",
    href: publicFileExists(personal.resumePath) ? personal.resumePath : PENDING,
    external: true,
    todo: `Add resume PDF at /public${personal.resumePath}`,
  };
}

export function emailLink(): LinkItem {
  return {
    label: "Email",
    href: personal.email ? `mailto:${personal.email}` : PENDING,
    todo: "Add email address in src/data/portfolio.ts",
  };
}

/** The four links shown under the hero introduction. */
export function profileLinks(): LinkItem[] {
  return [socials.github, socials.linkedin, resumeLink(), emailLink()];
}
