import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LinkItem } from "@/data/portfolio";
import { isDraft, isPending } from "@/lib/site";

/**
 * Renders a LinkItem.
 * - Real URL → link (external links open in a new tab with an arrow).
 * - PENDING  → dashed TODO marker in draft mode, nothing in production.
 */
export function TextLink({
  link,
  className = "",
  arrow = true,
  quiet = false,
  icon,
}: {
  link: LinkItem;
  className?: string;
  arrow?: boolean;
  /** Underline on hover only (navigation). */
  quiet?: boolean;
  /** Small icon shown before the label (e.g. a site's mark). */
  icon?: ReactNode;
}) {
  const underline = quiet ? "link-quiet" : "link";
  if (isPending(link.href)) {
    if (!isDraft) return null;
    return (
      <span
        className={`cursor-help text-subtle underline decoration-dashed decoration-1 underline-offset-4 ${className}`}
        title={`TODO(PORTFOLIO): ${link.todo ?? `Add ${link.label} URL`}`}
        data-todo
      >
        {icon ? <span className="mr-1.5 inline-flex align-[-0.125em]">{icon}</span> : null}
        {link.label}
      </span>
    );
  }

  const isMail = link.href.startsWith("mailto:");
  const isInternal = link.href.startsWith("/") && !link.external;

  if (isInternal) {
    return (
      <Link href={link.href} className={`${underline} ${className}`}>
        {link.label}
      </Link>
    );
  }

  return (
    <a
      href={link.href}
      className={`group inline-flex items-baseline gap-0.5 ${className}`}
      {...(link.external && !isMail
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {icon ? <span className="mr-1 self-center">{icon}</span> : null}
      <span className={underline}>{link.label}</span>
      {arrow && link.external && !isMail ? (
        <ArrowUpRight
          aria-hidden
          className="arrow arrow-up size-3.5 translate-y-[1px] text-subtle"
          strokeWidth={1.75}
        />
      ) : null}
      {link.external && !isMail ? (
        <span className="sr-only"> (opens in a new tab)</span>
      ) : null}
    </a>
  );
}
