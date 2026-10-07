import fs from "node:fs";
import path from "node:path";
import { PENDING, type LinkItem, type Project } from "@/data/portfolio";

/**
 * Draft mode shows TODO markers, placeholder experience entries, pending
 * links, case-study writing prompts, and empty metric slots.
 *
 * Default: on for `next dev`, off for production builds.
 * Override either way with NEXT_PUBLIC_SHOW_DRAFTS=true|false.
 */
export const isDraft: boolean =
  process.env.NEXT_PUBLIC_SHOW_DRAFTS !== undefined
    ? process.env.NEXT_PUBLIC_SHOW_DRAFTS === "true"
    : process.env.NODE_ENV !== "production";

/**
 * Absolute site URL. Never guessed: it comes from NEXT_PUBLIC_SITE_URL, or
 * from Vercel's production URL when deployed there.
 */
export const siteUrl: string | null =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : null);

/** True when a link still needs a real URL. */
export function isPending(href: string | null | undefined): boolean {
  return !href || href === PENDING;
}

/**
 * Checks whether a file exists in /public. Runs on the server at build
 * time, so a missing screenshot renders a placeholder instead of a 404.
 */
export function publicFileExists(src: string | null | undefined): boolean {
  if (!src || /^https?:\/\//.test(src)) return Boolean(src);
  try {
    return fs.statSync(path.join(process.cwd(), "public", src)).isFile();
  } catch {
    return false;
  }
}

export const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

/** Projects that should render on the site. */
export function visibleProjects(projects: Project[]): Project[] {
  return projects.filter((p) => !p.hidden);
}

/**
 * A link is shown if it is real, or if we're in draft mode (where pending
 * links render as TODO markers).
 */
export function shouldShowLink(link: LinkItem): boolean {
  return isDraft || !isPending(link.href);
}
