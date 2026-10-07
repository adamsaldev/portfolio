import Link from "next/link";
import { navigation, personal, socials } from "@/data/portfolio";
import { PaletteButton } from "@/components/CommandPalette";
import { Container } from "@/components/Container";
import { MobileNav, type NavItem } from "@/components/MobileNav";
import { TextLink } from "@/components/TextLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { resumeLink } from "@/lib/links";
import { isDraft, isPending } from "@/lib/site";

function navItems(): NavItem[] {
  const outbound = [resumeLink(), socials.github].filter((l) => isDraft || !isPending(l.href));
  return [
    ...navigation.sections.map((s) => ({ label: s.label, href: s.href })),
    ...outbound.map((l) => ({
      label: l.label,
      href: l.href,
      external: true,
      pending: isPending(l.href),
    })),
  ];
}

/** Sticky top bar; gains a blurred backdrop + hairline once scrolled. */
export function Header() {
  const items = navItems();
  return (
    <header className="site-header sticky top-0 z-40 border-b border-transparent">
      <Container className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2 text-small font-medium tracking-[-0.01em]"
          aria-label={`${personal.name} — home`}
        >
          <span aria-hidden className="size-1.5 rounded-[1px] bg-accent transition-transform duration-300 group-hover:rotate-45" />
          {personal.name}
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Primary" className="mr-2 hidden sm:block">
            <ul className="flex items-center gap-6 text-small text-muted">
              {items.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <TextLink
                      link={{ label: item.label, href: item.href, external: true }}
                      arrow={false}
                      quiet
                      className="transition-colors hover:text-fg"
                    />
                  ) : (
                    <Link href={item.href} className="link-quiet transition-colors hover:text-fg">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <PaletteButton />
          <ThemeToggle />
          <MobileNav items={items} />
        </div>
      </Container>
    </header>
  );
}
