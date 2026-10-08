# Portfolio TODO

Everything that still needs a real value before deploying. Content lives in `src/data/portfolio.ts` unless noted.
Find every marker in code with: `grep -rn "TODO(PORTFOLIO)" src public`

> Production builds hide unfinished items automatically, but a missing value means the item simply doesn't appear.
> To preview the public site, run `NEXT_PUBLIC_SHOW_DRAFTS=false npm run dev`.

## Personal information

- [ ] Location, optional → `personal.location`
- [ ] Confirm the time zone for the live clock (currently `America/New_York`, "ET") → `personal.timezone`. Set it to `null` to hide the clock.
- [x] Headshot → `public/headshot.jpg`
- [ ] Confirm the UF start year (currently `2026`) → `education[0].start`
- [ ] Optional verified details for the Now section (relevant coursework, honors) → `education[0].details`
- [ ] Confirm the availability line "Seeking software engineering internships" → `personal.availability` (set to `null` to hide)
- [ ] Read the About copy and rewrite it in your own voice if needed → `about.paragraphs`
- [ ] Confirm the technical-interest list → `about.interests`
- [ ] Favicon: `src/app/icon.svg` is a plain "AS" placeholder. Replace it if you have your own.
- [ ] Optional: a designed share image (replace `src/app/opengraph-image.tsx` with `opengraph-image.png`)

## Links

- [x] GitHub, LinkedIn, and email added
- [ ] Varsity GitHub URL, or `null` if private → `projects[0].links.github`
- [ ] Varsity live / App Store / TestFlight / demo URL, or `null` → `projects[0].links.demo`
- [x] Autonomous Vision and Distributed Sorter GitHub repos added
- [ ] Production domain → Vercel env var `NEXT_PUBLIC_SITE_URL`

## Resume

- [ ] Add the resume PDF at `public/resume.pdf`. The header, intro icon, and contact links appear automatically once it exists.

## Varsity assets

- [ ] Hero screenshot or video (16:9). This is also the project card image → `public/projects/varsity/hero.png`
- [ ] Game detail screenshot (phone) → `public/projects/varsity/game-detail.png`
- [ ] Player detail screenshot (phone) → `public/projects/varsity/player-detail.png`
- [ ] Real `alt` text for each of the three images above
- [x] Year: 2025 — Present
- [ ] Verified project metric(s), real numbers only → `projects[0].metrics`
- [ ] **Case study** (`projects[0].caseStudy`):
  - [ ] Verify the data-source list: NCAA API, CFBD API, ESPN Data, Supabase → `architecture.sources`
  - [ ] Verify the pipeline layer names: Data Layer → Cache → View Models → SwiftUI → `architecture.pipeline`
  - [ ] Overview: audience, platform, release state
  - [ ] Problem: rewrite in your own words
  - [ ] Architecture: entity matching across sources, what lives in Supabase, live refresh strategy
  - [ ] Performance: **TODO: ADD VERIFIED PERFORMANCE METRIC**, plus how you measured it
  - [ ] Technical challenges: 2–4 real problems and how you solved them → `challenges.items`
  - [ ] What I learned → `learned.body`

## Autonomous Vision & Robot Control

- [ ] Hero image or recording (16:9). This is also the card image → `public/projects/autonomous-vision/autonomous-vision-hero.png`
- [ ] Real frame of the lane-detection overlay → `public/projects/autonomous-vision/lane-detection-output.png`
- [ ] Screenshot of the Tkinter control panel → `public/projects/autonomous-vision/robot-control-interface.png`
- [ ] Real `alt` text for the images above
- [ ] Role → `projects[1].role` (year set: 2024)
- [ ] Technical challenges and What I learned → `projects[1].caseStudy`

## Distributed Binary Data Sorter

- [x] Hero / card image → `public/projects/distributed-sorter/run-summary.jpg`. Optional retake: this screenshot shows 999,900 sorted because 1,000,000 ÷ 150 chunks doesn't divide evenly. `run.sh` now defaults to 160 chunks, so a retake shows 1,000,000 on both lines.
- [ ] Recording of a multinode run → `public/projects/distributed-sorter/multinode-demo.mp4`
- [ ] Screenshot of real terminal output → `public/projects/distributed-sorter/terminal-output.png`
- [ ] Real `alt` text for the media above
- [ ] Role → `projects[2].role` (year set: 2026)
- [x] Measured comparison (3 setups, 1M numbers) → `projects[2].caseStudy.performance.comparison`. Re-run it with `~/Desktop/sort-demo/bench/bench.py`.
- [ ] What I learned → `projects[2].caseStudy.learned`

## Experience

- [x] Sports Videographer & Photographer, @adamflicks (2023 — Present)
- [ ] Add more roles to `experience` in `src/data/portfolio.ts` as you get them (optional `logo` at `public/logos/…`)
