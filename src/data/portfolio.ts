/**
 * ---------------------------------------------------------------------------
 * PORTFOLIO CONTENT — single source of truth.
 * ---------------------------------------------------------------------------
 *
 * Every piece of copy, every link and every asset path on the site lives in
 * this file. Components never hard-code portfolio information.
 *
 * Placeholder conventions (search the repo for `TODO(PORTFOLIO)`):
 *
 *   - Links that have not been provided use `PENDING` ("#").
 *     They render as dashed TODO markers in draft mode and are hidden in
 *     production (see `src/lib/site.ts`).
 *   - Values that are unknown are `null`, or an empty array.
 *   - Entries that are not real yet are flagged with `placeholder: true`.
 *   - Media paths point at files that may not exist yet. `<ProjectMedia />`
 *     checks the file at build time and renders a placeholder panel when it
 *     is missing — drop the file into /public and it appears automatically.
 *
 * NEVER replace a TODO with a guessed value. Only add verified information.
 */

/** Marker for a link that has not been provided yet. */
export const PENDING = "#";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LinkItem {
  label: string;
  href: string;
  /** Opens in a new tab and shows an outbound arrow. */
  external?: boolean;
  /** Reason shown in draft mode when `href` is still PENDING. */
  todo?: string;
}

export interface Personal {
  name: string;
  title: string;
  affiliation: string;
  intro: string;
  /** Short status line shown in the intro. `null` hides it. */
  availability: string | null;
  location: string | null;
  /** IANA time zone for the live "Local time" clock. `null` hides it. */
  timezone: string | null;
  /** Short label shown after the clock, e.g. "ET". */
  timezoneLabel: string;
  email: string | null;
  /** Path under /public. Missing file → link hidden in production. */
  resumePath: string;
  /** Path under /public. Hero never shows a photo unless this file exists. */
  headshotPath: string | null;
}

export interface Education {
  field: string;
  institution: string;
  start: string;
  end: string;
  /** Qualifier for the end date, e.g. "Expected". */
  endNote?: string;
  /** Optional small supporting lines (coursework, honors…). Verified only. */
  details: string[];
  /** Institution website. */
  href?: string;
  /** Small icon shown before the institution name (path under /public). */
  logo?: string;
}

export interface Experience {
  organization: string;
  position: string;
  date: string;
  location: string | null;
  description: string;
  /** Path under /public, e.g. "/logos/company.svg". Optional. */
  logo?: string;
  href?: string;
  /** Placeholder entries render only in draft mode. */
  placeholder?: boolean;
}

export type MediaFrame = "wide" | "desktop" | "phone";

export interface MediaAsset {
  /** Path under /public. Images (.png/.jpg/.webp/.avif) or video (.mp4/.webm). */
  src: string;
  /** Heading shown on the placeholder panel. */
  label: string;
  /** Alt text used once the real asset exists. Describe what is shown. */
  alt: string;
  frame: MediaFrame;
  /** Optional poster image for videos (path under /public). */
  poster?: string;
}

export interface Metric {
  value: string;
  label: string;
}

/** One measured approach in a timing comparison. */
export interface ComparisonRow {
  label: string;
  /** Short description of how it works. */
  detail: string;
  /** Seconds; the median of `trials`. */
  median: number;
  /** Every measured run, in seconds. */
  trials: number[];
  /** The project's own approach — drawn in the accent color. */
  highlight?: boolean;
  /** Reference row other rows are compared against in the tooltip. */
  baseline?: boolean;
}

/** A measured timing comparison (real runs only — never estimates). */
export interface Comparison {
  title: string;
  /** How it was measured: data, machine, settings. */
  setup: string;
  rows: ComparisonRow[];
  note?: string;
}

/** A source repository shown on a project's detail page. */
export interface Repository {
  label: string;
  href: string;
  /** One line on what this repo contributes to the project. */
  note?: string;
}

/** One step in a project's evolution (e.g. v1 → experiment → optimized). */
export interface EvolutionStage {
  /** Small label, e.g. "Version 1", "Experiment". */
  stage: string;
  name: string;
  href?: string;
  points: string[];
}

/**
 * - `published`       verified, complete enough to show as-is.
 * - `in-development`  real work in progress. Public label: "In Development".
 * - `placeholder`     structure only, not started or not verified.
 *                     Public label: "In Development".
 */
export type ProjectStatus = "published" | "in-development" | "placeholder";

export interface CaseStudySection {
  /** Verified paragraphs. */
  body: string[];
  /** Prompts shown only in draft mode, telling you what to write. */
  todo?: string[];
}

/** Every section except the overview is optional; omitted ones don't render. */
export interface CaseStudy {
  overview: CaseStudySection;
  problem?: CaseStudySection;
  architecture?: CaseStudySection & {
    sources: string[];
    pipeline: string[];
    /** Diagram caption. Defaults to "Conceptual data flow". */
    caption?: string;
  };
  evolution?: CaseStudySection & { stages: EvolutionStage[] };
  performance?: CaseStudySection & { metrics: Metric[]; comparison?: Comparison };
  challenges?: CaseStudySection & { items: { title: string; body: string }[] };
  learned?: CaseStudySection;
}

export interface Project {
  slug: string;
  number: string;
  name: string;
  category: string;
  role: string | null;
  /** Leave `null` until a verified year is provided. */
  year: string | null;
  description: string;
  status: ProjectStatus;
  /** Shows a "verify before publishing" banner in draft mode. */
  needsVerification: boolean;
  /** Set to true to remove the project from the site entirely. */
  hidden?: boolean;
  /** Featured projects get the large hero treatment. */
  featured?: boolean;
  /** Confirmed technologies only. */
  technologies: string[];
  /** Concepts the project works with — shown as tags on the detail page. */
  focus?: string[];
  features?: string[];
  /** Verified metrics only. Leave empty until you have real numbers. */
  metrics: Metric[];
  /** Each project gets a detail page at /projects/<slug>. */
  links: {
    /** Primary repository (the GitHub link in the project header). */
    github: string | null;
    demo: string | null;
  };
  /** All related repositories, listed on the detail page. */
  repositories?: Repository[];
  media: {
    hero: MediaAsset;
    gallery?: MediaAsset[];
  };
  caseStudy?: CaseStudy;
}

export interface Interest {
  area: string;
  note: string;
}

// ---------------------------------------------------------------------------
// Personal
// ---------------------------------------------------------------------------

export const personal: Personal = {
  name: "Adam Saleh",
  title: "Software Engineer",
  affiliation: "University of Florida",
  intro:
    "CS student at UF. I build fast, data-driven software and I'm really into systems, performance, and how computers actually work.",
  availability: "Probably studying",
  // TODO(PORTFOLIO): Add location (optional), e.g. city you want to show.
  location: null,
  // TODO(PORTFOLIO): Confirm time zone (set to null to hide the clock).
  timezone: "America/New_York",
  timezoneLabel: "ET",
  email: "adamsalehdev@gmail.com",
  // TODO(PORTFOLIO): Add resume PDF at /public/resume.pdf
  resumePath: "/resume.pdf",
  // TODO(PORTFOLIO): Add headshot at /public/headshot.jpg (square crop works best).
  headshotPath: "/headshot.jpg",
};

// ---------------------------------------------------------------------------
// Social links
// ---------------------------------------------------------------------------

export const socials = {
  github: {
    label: "GitHub",
    href: "https://github.com/adamsaldev",
    external: true,
  },
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/adamsaleh08",
    external: true,
  },
} satisfies Record<string, LinkItem>;

// ---------------------------------------------------------------------------
// Navigation (in-page anchors; Resume + GitHub are appended automatically)
// ---------------------------------------------------------------------------

export const navigation = {
  sections: [
    { label: "Projects", href: "/#work" },
    { label: "About", href: "/#about" },
  ],
} as const;

// ---------------------------------------------------------------------------
// Education — rendered under NOW in the intro
// ---------------------------------------------------------------------------

export const education: Education[] = [
  {
    field: "Computer Science",
    institution: "University of Florida",
    href: "https://www.ufl.edu/",
    // Official favicon from ufl.edu.
    logo: "/logos/ufl.png",
    // TODO(PORTFOLIO): Confirm start year.
    start: "2026",
    end: "2030",
    endNote: "Expected",
    // TODO(PORTFOLIO): Optional verified details (relevant coursework, honors). Do not add GPA unless you want it shown.
    details: [],
  },
];

// ---------------------------------------------------------------------------
// Experience — rendered under PREVIOUSLY in the intro
// ---------------------------------------------------------------------------

export const experience: Experience[] = [
  {
    organization: "@adamflicks",
    position: "Sports Videographer & Photographer",
    date: "2023 — Present",
    location: null,
    description: "Sports video and photo work",
    href: "https://www.instagram.com/adamflicks",
    logo: "/logos/instagram.png",
  },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const projects: Project[] = [
  // -------------------------------------------------------------------------
  // 01 — VARSITY (featured)
  // -------------------------------------------------------------------------
  {
    slug: "varsity",
    number: "01",
    name: "Varsity",
    category: "Real-Time College Sports Platform",
    role: "Creator / Software Engineer",
    year: "2025 — Present",
    description:
      "A native college sports app — live scores, play-by-play, team and player stats, rankings, and game analytics, all pulled from a bunch of different sources into one place.",
    status: "published",
    needsVerification: false,
    featured: true,
    technologies: ["Swift", "SwiftUI", "Supabase", "REST APIs"],
    features: [
      "Live game scores and status",
      "Upcoming and completed games",
      "Rankings",
      "Team pages",
      "Player pages",
      "Play-by-play",
      "Drive information",
      "Team statistics",
      "Game analytics",
      "Win probability",
      "Search",
      "Favorites",
      "Refresh / live data behavior",
    ],
    // TODO(PORTFOLIO): Add verified project metric(s). Never estimate.
    metrics: [],
    links: {
      // TODO(PORTFOLIO): Add Varsity GitHub URL (or set to null if private).
      github: PENDING,
      // TODO(PORTFOLIO): Add Varsity live / App Store / TestFlight / demo URL (or null).
      demo: PENDING,
    },
    media: {
      hero: {
        src: "/projects/varsity/hero.jpg",
        label: "Varsity — Hero Screenshot",
        alt: "Two Varsity screens under a large VARSITY wordmark: a final Ohio State vs. Texas game with the quarter-by-quarter score and team stats, and a player page for Ole Miss running back Kewan Lacy",
        frame: "wide",
      },
      gallery: [
        // TODO(PORTFOLIO): Replace Varsity game detail screenshot
        {
          src: "/projects/varsity/game-detail.png",
          label: "Varsity — Game Detail",
          alt: "Varsity game detail screen", // TODO(PORTFOLIO): describe the real screenshot
          frame: "phone",
        },
        // TODO(PORTFOLIO): Replace Varsity player detail screenshot
        {
          src: "/projects/varsity/player-detail.png",
          label: "Varsity — Player Detail",
          alt: "Varsity player detail screen", // TODO(PORTFOLIO): describe the real screenshot
          frame: "phone",
        },
      ],
    },
    caseStudy: {
      overview: {
        body: [
          "Varsity is a college sports app I built. It pulls live scores, play-by-play, stats, rankings, and game analytics from a few different sources and puts it all in one app.",
        ],
        todo: [
          "Who is it for, what platform does it run on, and what state is it in (TestFlight, App Store, personal use)?",
        ],
      },
      problem: {
        body: [
          "College sports data is split up across a bunch of different sources, and they all format things differently. Varsity pulls it all together into one fast app.",
        ],
        todo: [
          "In your own words: what was frustrating about existing apps, and what did you set out to do differently?",
        ],
      },
      architecture: {
        // TODO(PORTFOLIO): Verify this list matches the sources Varsity actually uses.
        sources: ["NCAA API", "CFBD API", "ESPN Data", "Supabase"],
        // TODO(PORTFOLIO): Verify the layer names match the real implementation.
        pipeline: ["Data Layer", "Cache", "View Models", "SwiftUI"],
        body: [
          "Each source feeds into a shared data layer, gets cached, and then view models hand it off to the SwiftUI screens.",
        ],
        todo: [
          "How are entities (teams, players, games) matched across sources?",
          "What lives in Supabase versus what is fetched directly?",
          "How does refresh work while a game is live?",
        ],
      },
      performance: {
        // TODO(PORTFOLIO): Add verified performance metric(s), e.g. measured
        // cold-start time or refresh latency, with how they were measured.
        metrics: [],
        body: [],
        todo: [
          "TODO: ADD VERIFIED PERFORMANCE METRIC",
          "Describe what you optimized and how you measured it (Instruments, logging, etc.).",
        ],
      },
      challenges: {
        // TODO(PORTFOLIO): Add 2–4 real technical challenges and how you solved them.
        items: [],
        body: [],
        todo: [
          "Pick 2–4 real problems you hit (data consistency, live updates, caching, rate limits, UI performance) and explain your solution to each.",
        ],
      },
      learned: {
        // TODO(PORTFOLIO): Add what you learned building Varsity.
        body: [],
        todo: ["2–3 sentences on what building Varsity taught you."],
      },
    },
  },

  // -------------------------------------------------------------------------
  // 02 — AUTONOMOUS VISION & ROBOT CONTROL
  // Two repos, one project: the lane-detection client (recorded video, full
  // pipeline) and the robot client (live camera stream + HTTP control).
  // Copy is grounded in the code — classical CV only, no ML.
  // -------------------------------------------------------------------------
  {
    slug: "autonomous-vision",
    number: "02",
    name: "Autonomous Vision & Robot Control",
    category: "Computer Vision / Robotics",
    role: null,
    year: "2024",
    description:
      "Computer vision + robot project. It looks at road video, finds the lane lines, figures out which way the road is turning, and shows it all in the app you use to drive the robot.",
    status: "published",
    needsVerification: false,
    technologies: ["Python", "OpenCV", "NumPy", "Tkinter", "HTTP requests"],
    focus: [
      "Classical computer vision",
      "Perspective transforms",
      "Edge detection",
      "Hough line detection",
      "Network-based control",
    ],
    features: [
      "Recorded and live video processing",
      "Yellow lane color filtering",
      "Bird's-eye perspective transform",
      "Grayscale + Canny edge detection",
      "Probabilistic Hough line detection",
      "Slope- and position-based lane filtering",
      "Lane-center estimation",
      "Turn prediction (left / right / straight)",
      "Lane overlay projected back onto the frame",
      "Tkinter control panel with live video",
      "Movement commands sent to the robot over HTTP",
      "Account login and per-user command log",
    ],
    metrics: [],
    links: {
      github: "https://github.com/adamsaldev/autonomous-lane-detection-client",
      demo: null,
    },
    repositories: [
      {
        label: "autonomous-lane-detection-client",
        href: "https://github.com/adamsaldev/autonomous-lane-detection-client",
        note: "The full lane pipeline on recorded road video — perspective warp, lane lines, and turn calls.",
      },
      {
        label: "autonomous-robot-client",
        href: "https://github.com/adamsaldev/autonomous-robot-client",
        note: "Live camera feed from the robot, line detection, and buttons that send movement commands to its Flask API.",
      },
    ],
    media: {
      // TODO(PORTFOLIO): Add autonomous-vision hero image or recording
      hero: {
        src: "/projects/autonomous-vision/autonomous-vision-hero.png",
        label: "Autonomous Vision — Hero",
        alt: "Autonomous vision project", // TODO(PORTFOLIO): describe the real image
        frame: "wide",
      },
      gallery: [
        // TODO(PORTFOLIO): Add a real frame of the lane-detection overlay
        {
          src: "/projects/autonomous-vision/lane-detection-output.png",
          label: "Lane Detection Output",
          alt: "Lane-detection overlay on road video", // TODO(PORTFOLIO): describe the real image
          frame: "desktop",
        },
        // TODO(PORTFOLIO): Add a screenshot of the Tkinter control panel
        {
          src: "/projects/autonomous-vision/robot-control-interface.png",
          label: "Robot Control Interface",
          alt: "Robot control panel with live video and movement buttons", // TODO(PORTFOLIO): describe the real image
          frame: "desktop",
        },
      ],
    },
    caseStudy: {
      overview: {
        body: [
          "This one went through two versions. The first runs on recorded road video — it picks out the lane lines, finds the middle of the lane, guesses if the road is turning left, right, or going straight, and draws all of that back on the video.",
          "The second version does it on a live camera feed from the robot and adds a control panel (Tkinter) that sends movement commands to the robot over HTTP.",
        ],
      },
      architecture: {
        sources: ["Video / Camera Feed"],
        pipeline: [
          "Image Preprocessing",
          "Perspective Transformation",
          "Edge Detection",
          "Hough Line Detection",
          "Lane Filtering",
          "Lane Geometry",
          "Steering / Turn Decision",
          "Robot Control Interface",
        ],
        caption: "Processing pipeline",
        body: [
          "First I crop each frame, pick out the yellow lane lines by color, and warp it so it's like looking down at the road from above. Then it goes grayscale, Canny finds the edges, and a Hough transform turns those edges into line segments.",
          "Next I toss out lines that aren't close to vertical and split the rest into left and right lanes based on where they are. Averaging each side gives me the lane lines plus a center line, and where that center line sits decides the turn call. Last step, the overlay gets warped back to the normal view and shown in the app.",
          "The live robot version runs a simpler take on this on the camera feed: grayscale, blur, Canny, Hough, and a slope filter.",
        ],
      },
      challenges: {
        // TODO(PORTFOLIO): Add 2–3 real challenges and how you solved them.
        items: [],
        body: [],
        todo: [
          "What was hard in practice — noisy lines, choosing thresholds, lighting, latency between video and commands?",
        ],
      },
      learned: {
        // TODO(PORTFOLIO): Add what you learned building this.
        body: [],
        todo: ["2–3 sentences on what this project taught you."],
      },
    },
  },

  // -------------------------------------------------------------------------
  // 03 — DISTRIBUTED BINARY DATA SORTER
  // Three repos, one project: multinode sorter (v1) → binary merge utility
  // (experiment) → binary-optimized sorter (final, primary).
  // -------------------------------------------------------------------------
  {
    slug: "distributed-data-sorter",
    number: "03",
    name: "Distributed Binary Data Sorter",
    category: "Distributed Computing / Data Processing",
    role: null,
    year: "2026",
    description:
      "Sorts a big list of numbers across multiple machines. Each one sorts its own chunk, everything stays in binary along the way, and the results get merged back together as they come in.",
    status: "published",
    needsVerification: false,
    technologies: ["Python", "Dispy", "struct", "threading"],
    focus: [
      "Distributed computing",
      "Worker nodes",
      "Binary file I/O",
      "Synchronization",
      "Incremental merging",
    ],
    features: [
      "Streams the input and packs chunks into 4-byte integers",
      "Submits each chunk to worker nodes as soon as it's ready",
      "Workers sort chunks read from shared storage",
      "Sorted results written back in binary",
      "Pairwise merging as jobs complete",
      "Lock-protected merge queue across job callbacks",
      "Per-job error reporting",
      "Final merge converts to text output",
    ],
    metrics: [],
    links: {
      github: "https://github.com/adamsaldev/bin-opt-multinode-data-sorter-py",
      demo: null,
    },
    repositories: [
      {
        label: "bin-opt-multinode-data-sorter-py",
        href: "https://github.com/adamsaldev/bin-opt-multinode-data-sorter-py",
        note: "Final version — binary chunks, sorting across machines, merging as results come in.",
      },
      {
        label: "multinode-data-sorter",
        href: "https://github.com/adamsaldev/multinode-data-sorter",
        note: "Version 1 — text chunks sorted across machines and merged on the coordinator.",
      },
      {
        label: "binary-merge-py",
        href: "https://github.com/adamsaldev/binary-merge-py",
        note: "Side experiment — merging sorted number files straight in binary.",
      },
    ],
    media: {
      hero: {
        src: "/projects/distributed-sorter/run-summary.jpg",
        label: "Distributed Sorter — Run Summary",
        alt: "Terminal output of a local run: a 1,000,000-number input split into 150 binary chunks, each chunk sorted and merged as it comes back, ending in a summary of 999,900 numbers sorted in 17.28 seconds",
        frame: "wide",
      },
      gallery: [
        // TODO(PORTFOLIO): Add a recording of a multinode run
        {
          src: "/projects/distributed-sorter/multinode-demo.mp4",
          label: "Multinode Demo",
          alt: "Recording of a distributed sort across worker nodes",
          frame: "desktop",
        },
        // TODO(PORTFOLIO): Add a screenshot of real terminal output
        {
          src: "/projects/distributed-sorter/terminal-output.png",
          label: "Terminal Output",
          alt: "Coordinator terminal output during a sort", // TODO(PORTFOLIO): describe the real image
          frame: "desktop",
        },
      ],
    },
    caseStudy: {
      overview: {
        body: [
          "One machine (the coordinator) breaks a big file of numbers into chunks and sends them out to worker machines with Dispy. Each worker sorts its chunk, and the coordinator merges finished chunks two at a time while the rest are still running.",
          "In the final version everything stays in binary — numbers get packed into 4-byte ints before they're sent out and stay that way through every merge, until the very end when it's written out as text.",
        ],
      },
      architecture: {
        sources: ["Input dataset"],
        pipeline: [
          "Chunk + pack to binary",
          "Dispatch jobs (Dispy)",
          "Sort on worker nodes",
          "Incremental binary merge",
          "Final text output",
        ],
        caption: "Sorting pipeline",
        body: [
          "The coordinator reads the input as it goes instead of loading it all at once, packs each chunk with Python's struct module, and sends it off right away — so workers start sorting before the whole file has even been read. Every time a job finishes, a callback adds its output to a queue and merges pairs of files, with a lock so callbacks don't step on each other.",
        ],
      },
      evolution: {
        body: [
          "I built this in three steps: get a distributed sort working, figure out where it was doing extra work, test a fix on its own, then put it back in.",
        ],
        stages: [
          {
            stage: "Version 1",
            name: "Multinode Data Sorter",
            href: "https://github.com/adamsaldev/multinode-data-sorter",
            points: [
              "Split a big text file into chunks on shared storage",
              "Sent the sorting work out to multiple worker machines",
              "Merged the sorted files back on the coordinator — but every merge had to read and rewrite each number as text",
            ],
          },
          {
            stage: "Experiment",
            name: "Binary Merge Utility",
            href: "https://github.com/adamsaldev/binary-merge-py",
            points: [
              "Merged two sorted files of numbers straight in binary",
              "Compared the raw 4-byte values instead of reading text lines",
            ],
          },
          {
            stage: "Optimized version",
            name: "Binary-Optimized Multinode Data Sorter",
            href: "https://github.com/adamsaldev/bin-opt-multinode-data-sorter-py",
            points: [
              "Turn chunks into binary",
              "Send binary chunks to workers as soon as they're ready",
              "Sort on the workers",
              "Merge the binary results as each job finishes",
              "Write the final result out as text",
            ],
          },
        ],
      },
      performance: {
        metrics: [],
        // Measured on 2026-10-07 with ~/Desktop/sort-demo/bench/bench.py (results.json there).
        comparison: {
          title: "Sorting 1,000,000 numbers, three ways",
          setup:
            "Same 1,000,000 random integers, 160 chunks, all on my MacBook Pro (14 cores) acting as both coordinator and worker. Median of 3 runs (the one-process run ran once). Every output was checked: sorted, nothing missing.",
          rows: [
            {
              label: "Python sorted()",
              detail: "Built-in sort, one process — reference",
              median: 0.34,
              trials: [0.35, 0.34, 0.34],
              baseline: true,
            },
            {
              label: "Binary pipeline, distributed",
              detail: "Bubble sort on workers, binary merges",
              median: 19.0,
              trials: [18.59, 19.0, 19.28],
              highlight: true,
            },
            {
              label: "Binary pipeline, one process",
              detail: "Same pipeline, chunks sorted one at a time",
              median: 106.35,
              trials: [106.35],
            },
          ],
          note: "Distributed times start once the cluster is up.",
        },
        body: [
          "I timed three setups on the same million numbers on my laptop. Spreading the work across 14 cores made the pipeline about 5.6× faster than running it in one process — 106 seconds down to 19.",
          "Python's built-in sorted() still beats both at 0.34 seconds. The workers use bubble sort, so the interesting part here is the pipeline, not the sorting algorithm.",
        ],
      },
      learned: {
        // TODO(PORTFOLIO): Add what you learned building this.
        body: [],
        todo: ["2–3 sentences on what this project taught you."],
      },
    },
  },
];

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

export const about = {
  /** Personal interests, shown in the intro's "Interests" row. */
  hobbies: ["Piano", "Art", "Football"],
  // TODO(PORTFOLIO): Rewrite in your own voice. Keep it to two short
  // paragraphs and only include things that are true today.
  paragraphs: [
    "I like building software that deals with live, messy data — the biggest one being Varsity, an app that pulls college sports data from a bunch of sources into one place.",
    "Lately I've been getting into the lower-level stuff — systems programming, parallel computing, and figuring out what actually makes code fast.",
  ],
  interests: [
    { area: "Systems", note: "Processes, memory, and operating system interfaces" },
    { area: "Performance", note: "Profiling, benchmarking, and optimization" },
    { area: "Parallel computing", note: "CPU and GPU execution models" },
    { area: "Mobile", note: "Native apps built on live data" },
  ] satisfies Interest[],
};

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export const contact = {
  heading: "Get in touch.",
  body: "Want to talk about something I've built, or something you're building?",
  /** Appended to `body` only when `personal.email` is set. */
  emailLine: "Email's the fastest way to reach me.",
};

// ---------------------------------------------------------------------------
// Site / SEO
// ---------------------------------------------------------------------------

export const seo = {
  title: "Adam Saleh — Software Engineer",
  description:
    "Computer Science student at the University of Florida building software across mobile, data, and systems engineering.",
  // TODO(PORTFOLIO): Set NEXT_PUBLIC_SITE_URL once you have a production domain.
  // Canonical URLs and absolute Open Graph URLs are derived from it.
};
