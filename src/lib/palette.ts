import type { PaletteItem } from "@/components/CommandPalette";
import { personal, projects, socials } from "@/data/portfolio";
import { emailLink, resumeLink } from "@/lib/links";
import { isPending, visibleProjects } from "@/lib/site";

/** Everything the ⌘K menu can do, built from portfolio data at build time. */
export function paletteItems(): PaletteItem[] {
  const items: PaletteItem[] = [];

  for (const p of visibleProjects(projects)) {
    items.push({
      id: `project-${p.slug}`,
      group: "Projects",
      label: p.name,
      hint: p.number,
      href: `/projects/${p.slug}`,
      keywords: `${p.category} ${p.technologies.join(" ")}`,
    });
  }

  items.push(
    { id: "nav-home", group: "Navigate", label: "Home", href: "/" },
    { id: "nav-work", group: "Navigate", label: "Projects", href: "/#work", keywords: "work engineering" },
    { id: "nav-about", group: "Navigate", label: "About", href: "/#about", keywords: "interests" },
    { id: "nav-contact", group: "Navigate", label: "Contact", href: "/#contact", keywords: "email hire" },
  );

  for (const l of [socials.github, socials.linkedin, resumeLink()]) {
    if (!isPending(l.href)) {
      items.push({ id: `link-${l.label}`, group: "Links", label: l.label, href: l.href, external: true });
    }
  }

  if (personal.email) {
    items.push({
      id: "copy-email",
      group: "Actions",
      label: "Copy email address",
      action: "copy-email",
      value: personal.email,
      keywords: "contact mail",
    });
    const mail = emailLink();
    items.push({ id: "send-email", group: "Actions", label: "Send an email", href: mail.href, external: true });
  }

  items.push(
    { id: "theme", group: "Actions", label: "Toggle light / dark", action: "toggle-theme", keywords: "theme dark light mode" },
    { id: "theme-system", group: "Actions", label: "Use system theme", action: "system-theme", keywords: "theme auto" },
    { id: "copy-link", group: "Actions", label: "Copy link to this page", action: "copy-link", keywords: "share url" },
  );

  return items;
}
