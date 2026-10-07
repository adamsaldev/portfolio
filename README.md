# adamsaleh.dev

Personal engineering portfolio for Adam Saleh, built with Next.js (App Router), TypeScript, and Tailwind CSS. Every page is prerendered as static HTML. The only client-side JavaScript is the mobile menu.

Before deploying, work through **[PORTFOLIO_TODO.md](./PORTFOLIO_TODO.md)**.

---

## 1. Install

Requires Node.js 20.9 or later.

```bash
npm install
```

## 2. Run locally

```bash
npm run dev
```

Open http://localhost:3000.

The dev server runs in **draft mode**, which shows every TODO marker, placeholder screenshot panel, pending link, unconfirmed technology, and empty metric slot. Production builds hide all of them (see [Draft mode](#draft-mode)).

## 3. Where the content lives

All content lives in one typed file:

```
src/data/portfolio.ts
```

| Export       | What it controls                                        |
| ------------ | ------------------------------------------------------- |
| `personal`   | Name, title, intro, availability line, email, resume path |
| `socials`    | GitHub and LinkedIn URLs                                |
| `navigation` | Header section links                                    |
| `education`  | **Now** lines in the intro                              |
| `experience` | **Previously** lines in the intro                       |
| `projects`   | Engineering work and case-study content                 |
| `about`      | About paragraphs and technical interests                |
| `contact`    | Contact heading and copy                                |
| `seo`        | Page title and description                              |

Components never hard-code portfolio information. To find everything that still needs a value, run:

```bash
grep -rn "TODO(PORTFOLIO)" src public
```

### Placeholder conventions

- **Links you haven't provided** use `PENDING` (`"#"`). Draft mode shows them as dashed-underline labels. Production hides them.
- **Unknown values** are `null` or `[]`. They are never guessed.
- **Placeholder entries** (for example, experience) have `placeholder: true`. Only draft mode shows them.

## 4. Add or edit a project

Add an object to the `projects` array in `src/data/portfolio.ts`:

```ts
{
  slug: "my-project",
  number: "04",
  name: "My Project",
  category: "One-line category",
  role: "Software Engineer",
  year: "2026",
  description: "One or two sentences about what it does.",
  status: "published",          // "published" | "in-development" | "placeholder"
  needsVerification: false,     // true shows a warning banner in draft mode
  technologies: ["C++"],        // confirmed only
  metrics: [],                  // real numbers only: [{ value: "…", label: "…" }]
  links: { github: "https://…", demo: null },
  media: {
    hero: {
      src: "/projects/my-project/hero.png",
      label: "My Project — Hero",
      alt: "Describe what the screenshot shows",
      frame: "desktop",          // "wide" (16:9) | "desktop" (16:10) | "phone" (9:19.5)
    },
  },
}
```

- Every project renders as a card (main screenshot, name — role, year, one-line description) and gets its own page at `/projects/<slug>` automatically.
- `featured: true` makes a card span the full width (Varsity uses it). Other cards sit two per row.
- The card uses `media.hero`. In production, a missing screenshot shows a quiet panel with the project name instead.
- Any `status` other than `"published"` shows a small **In Development** label.
- `hidden: true` removes a project from the site without deleting its data.
- `repositories` lists every related repo on the detail page (one row each, with a note). `links.github` is the primary repo shown in the project header.

### Project pages and case studies

`src/app/projects/[slug]/page.tsx` prerenders a page for every visible project. It shows the header, the hero media, features, gallery, focus, repositories, stack, and a "Next project" link.

To add a deeper write-up, give the project a `caseStudy` object (see Varsity). Only `overview` is required; the optional sections are Problem, Architecture (HTML/CSS diagram — horizontal for up to 4 steps, vertical for longer pipelines), Evolution (version-to-version stages, see the data sorter), Performance, Technical challenges, and What I learned. Each section takes `body` (published paragraphs) and `todo` (writing prompts that only draft mode shows). In production, a section with an empty `body` is hidden.

## 5. Replace placeholder screenshots

Each media slot already points at a path. Save your file at that exact path and it replaces the placeholder automatically. You don't need to change any code.

```
public/projects/varsity/hero.png           # wide, 16:9
public/projects/varsity/game-detail.png    # phone, 9:19.5
public/projects/varsity/player-detail.png  # phone, 9:19.5
public/projects/autonomous-vision/autonomous-vision-hero.png        # wide, 16:9 (also the card image)
public/projects/autonomous-vision/lane-detection-output.png         # desktop, 16:10
public/projects/autonomous-vision/robot-control-interface.png       # desktop, 16:10
public/projects/distributed-sorter/distributed-sorter-architecture.png  # wide, 16:9 (also the card image)
public/projects/distributed-sorter/multinode-demo.mp4               # desktop, 16:10 (video)
public/projects/distributed-sorter/terminal-output.png              # desktop, 16:10
```

- `<ProjectMedia />` checks whether each file exists at build time. A missing file renders a labeled placeholder panel in draft mode and nothing at all in production.
- Images go through `next/image` (lazy-loaded, responsive). `.mp4`, `.webm`, and `.mov` files render as a `<video>` with controls.
- To use a different filename or format (for example, `hero.mp4` instead of `hero.png`), update `src` in `portfolio.ts`.
- Replace the `alt` text with a real description of what the screenshot shows.
- Export screenshots at about 2× display size. A 2400px-wide hero image is plenty.

### Headshot

Save a square photo at `public/headshot.jpg`. It appears next to your name in the intro.

## 6. Add the resume

Save your resume at:

```
public/resume.pdf
```

The Resume links (header, intro icon, contact) appear automatically once the file exists. To use another filename, change `personal.resumePath`.

## 7. Update social links and email

In `src/data/portfolio.ts`:

```ts
export const socials = {
  github:   { label: "GitHub",   href: "https://github.com/<your-username>", external: true },
  linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/<your-handle>", external: true },
};

export const personal = {
  // …
  email: "you@example.com",
};
```

Per-project GitHub and demo links live in each project's `links` object. Set a link to `null` if it should never appear (for example, a private repo).

## Design system & interactions

**Type scale.** There are seven sizes, defined in `src/app/globals.css` as Tailwind utilities. Use these rather than arbitrary sizes:

| Class          | Size  | Use                         |
| -------------- | ----- | --------------------------- |
| `text-meta`    | 11.5px | mono labels                |
| `text-small`   | 13px  | metadata, links, captions   |
| `text-body`    | 15px  | paragraphs                  |
| `text-lead`    | 17px  | intros                      |
| `text-title`   | 21px  | card titles                 |
| `text-heading` | 28px  | sub-headings                |
| `text-display` | 44px  | the name, project titles    |

**Interactions.** All are dependency-free, and all turn off under `prefers-reduced-motion`.

- **⌘K / Ctrl+K (or `/`):** opens the command palette. It's built from `src/lib/palette.ts` and lists projects, sections, links, copy actions, and theme controls.
- **Theme toggle:** a circular reveal from the button, using the View Transitions API. The choice is saved in `localStorage` and applied before first paint, so there's no flash.
- **Card → project page:** the screenshot morphs into the page hero (React `<ViewTransition>`).
- **Scroll reveals:** sections use `<Reveal>` (one shared IntersectionObserver). Cards use a CSS scroll-driven entrance.
- **Cursor spotlight on cards:** `.spotlight`, positioned by `ClientEffects`.
- **Live clock:** `personal.timezone`. Set it to `null` to hide the clock.
- **Reading-progress bar** on project pages (CSS `animation-timeline`).
- **Sticky header:** gains a blurred backdrop once you scroll.

## 8. Build for production

```bash
npm run lint        # ESLint
npx tsc --noEmit    # type check
npm run build       # production build
npm run start       # serve the production build at http://localhost:3000
```

### Draft mode

| Command                                    | Draft markers |
| ------------------------------------------ | ------------- |
| `npm run dev`                              | shown         |
| `npm run build && npm run start`           | hidden        |
| `NEXT_PUBLIC_SHOW_DRAFTS=true npm run build` | shown       |
| `NEXT_PUBLIC_SHOW_DRAFTS=false npm run dev`  | hidden      |

To preview exactly what visitors will see, run `NEXT_PUBLIC_SHOW_DRAFTS=false npm run dev`.

## 9. Deploy to Vercel

**Dashboard:** push the repository to GitHub, then go to https://vercel.com/new, import the repo, and click **Deploy**. Vercel detects Next.js automatically, so you don't need to change any settings.

**CLI:**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

Once you have a custom domain, add this environment variable in Vercel (Project → Settings → Environment Variables):

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

The site uses it for the canonical URL and absolute Open Graph URLs. Without it, the site falls back to Vercel's production URL.

---

## Structure

```
src/
  app/
    layout.tsx               fonts, metadata, skip link
    page.tsx                 home: intro (Now / Previously) → project cards → About → Contact
    projects/[slug]/         one prerendered page per project
    opengraph-image.tsx      typographic share card (generated at build time)
    icon.svg                 placeholder favicon
    globals.css              design tokens, link + label styles, reduced motion
  components/
    Header, MobileNav, Hero, SocialIcons, Section, Work,
    ProjectCard, ProjectPage, ProjectParts, ProjectMedia,
    ArchitectureDiagram, About, Contact, Footer,
    TextLink, Todo, Container
  data/portfolio.ts          ← all content
  lib/site.ts                draft mode, file-exists checks, link helpers
  lib/links.ts               resume / email / profile link builders
public/
  projects/{varsity,autonomous-vision,distributed-sorter}/   screenshots and videos go here
```
