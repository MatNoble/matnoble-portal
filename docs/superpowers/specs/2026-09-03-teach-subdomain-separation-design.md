# Teach Subdomain Separation Design Specification

## 1. Executive Summary

This design specification details the architectural plan to extract the teaching, courseware, interactive demonstrations, and pedagogical tools from the primary personal portal (`matnoble.top` / `matnoble-portal`) into a dedicated standalone subdomain and repository:

- **Target Domain**: `https://teach.matnoble.top`
- **Target Repository**: `matnoble-teach` (hosted locally at `/Users/matnoble/Codes/matnoble-teach`)
- **Hosting Platform**: Cloudflare Pages with Cloudflare R2 bucket integration (`matnoble-assets`)

The primary portal `matnoble.top` will focus on personal identity, research profile, open-source projects, and overarching directory navigation, while `teach.matnoble.top` will become the dedicated academic hub for undergraduate mathematics, computer science fundamentals, and interactive courseware.

---

## 2. Content Scope and Domain Boundaries

### 2.1 Content Migrating to `teach.matnoble.top`

1. **Course Center (`/courses/*`)**:
   - Course hub and semester directory (`courses/index.md`)
   - 2026 Fall active courses (e.g. `discrete-math-2026-fall.md`, and placeholders for `advanced-math-1`, `java-programming`, `linear-algebra-b`)
   - 2026 Spring course archives (`discrete-math-2026-spring.md`, `advanced-math-2-2026-spring.md`, `economic-math-2-2026-spring.md`)
   - Summer term projects (`courses/matlab/*`)
2. **Interactive Teaching Modules (`/teaching/*`)**:
   - Calculus intuitions, Riemann sums, differential notation
   - Linear algebra geometric concepts, Cramer's rule visualizer, elementary transformations, matrix normal forms
   - Space Geometry Lab (Three.js 3D models for planes, quadric surfaces, projection cylinders)
3. **Classroom Pedagogical Tools (`/tools/*`)**:
   - Fullscreen countdown timer (`tools/countdown.md`)
   - Tabular integration demo (`tools/di-method.md`)
   - LaTeX spaced repetition flashcard tool (`tools/memorize.md`)
   - Roll Call Beacon integration
4. **Custom Vue Interactive Components**:
   - `SpaceGeometryLab.vue`, `LazySpaceGeometryLab.vue`, `CramerRuleVisualizer.vue`, `CourseList.vue`, `ChapterNavigation.vue`, `DownloadCard.vue`, `CheatSheetFooter.vue`, etc.

### 2.2 Content Remaining on `matnoble.top`

- Home portal (`index.md`) with high-level personal intro and sub-site showcase cards
- About Me (`about.md`)
- Open-source projects hub (`projects/*`, `projects/tts.md`, `projects/hust-cnlogo.md`)
- Terms & Privacy policy (`privacy.md`, `terms.md`)

---

## 3. System Architecture & Project Layout

### 3.1 Repository Structure (`matnoble-teach`)

```text
/Users/matnoble/Codes/matnoble-teach/
├── docs/
│   ├── index.md                 # Teaching hub homepage (hero, active courses, labs, tools)
│   ├── courses/                 # Course syllabi, slides, and archive pages
│   ├── teaching/                # Interactive lecture notes and 3D visualizers
│   ├── tools/                   # Classroom countdown, DI method, formula flashcards
│   ├── components/              # Vue math visualizers and Three.js labs
│   ├── public/                  # Favicons, logo, _headers, robots.txt, llms.txt
│   └── .vitepress/
│       ├── config.ts            # Site config with teach-focused navigation & SEO schemas
│       └── theme/               # Shared theme, dark mode, MathJax and academic CSS
├── functions/
│   ├── lib/
│   │   └── r2-handler.ts        # Shared R2 streaming, range requests, ETag caching
│   └── pdf/
│       └── [[path]].ts          # Cloudflare Pages Function binding for /pdf/* downloads
├── tests/                       # Automated tests for R2 asset proxying
├── wrangler.jsonc               # Cloudflare Pages binding for DOWNLOADS_BUCKET -> matnoble-assets
├── package.json                 # Build dependencies (VitePress, Vue, Three.js, KaTeX)
└── tsconfig.json
```

---

## 4. Asset Storage & 301 Migration Strategy

### 4.1 Zero-Copy Asset Reuse via Cloudflare R2
- The new project `matnoble-teach` will bind directly to the existing Cloudflare R2 bucket: **`matnoble-assets`**.
- The existing Cloudflare Pages Function `functions/pdf/[[path]].ts` will be copied into `matnoble-teach`.
- All course PDF URLs (e.g. `https://teach.matnoble.top/pdf/discrete/2026-2027-1/1-1_Propositional_Logic_Symbols_Connectives.pdf`) stream directly from R2 without uploading or duplicating any assets.

### 4.2 Edge-Level 301 Permanent Redirects on `matnoble-portal`
To ensure zero link rot, preserve SEO ranking, and guarantee student bookmarks remain functional, `matnoble-portal` will deploy wildcard 301 rules in `docs/public/_redirects`:

```text
/courses/*  https://teach.matnoble.top/courses/:splat  301
/teaching/* https://teach.matnoble.top/teaching/:splat 301
/tools/*    https://teach.matnoble.top/tools/:splat    301
/pdf/*      https://teach.matnoble.top/pdf/:splat      301
```

---

## 5. Navigation & Cross-Linking

### 5.1 Portal (`matnoble.top`) Top Navigation
- 关于我 (`/about`)
- 教学中心 ↗ (`https://teach.matnoble.top/`)
- 开源项目 (`/projects/`)
- 技术博客 ↗ (`https://blog.matnoble.top`)
- 光影定格 ↗ (`https://album.matnoble.top/`)

### 5.2 Teaching Site (`teach.matnoble.top`) Top Navigation
- 课程中心 (`/courses/`)
- 教学讲义 (`/teaching/`)
- 数学工具 (`/tools/`)
- 主讲教师 ↗ (`https://matnoble.top/about`)
- 个人门户 ↗ (`https://matnoble.top/`)

---

## 6. SEO & Machine-Readable Metadata (AEO)

1. **Structured Data**:
   - `teach.matnoble.top` generates independent Schema.org `Course`, `LearningResource`, `MathSolver`, and `BreadcrumbList` schemas.
   - Provider references point back to `https://matnoble.top/#person` to maintain a unified entity graph.
2. **Sitemap & Robots**:
   - `https://teach.matnoble.top/sitemap.xml` automatically indexes all active courses and teaching modules.
   - Redirect stubs on `matnoble.top` are marked `noindex, follow` and excluded from `matnoble.top` sitemap.
3. **LLM Context (`llms.txt`)**:
   - `teach.matnoble.top/llms.txt` will serve specialized context for educational AI crawlers.

---

## 7. Step-by-Step Implementation Roadmap

1. **Phase 1: Local Scaffolding (`matnoble-teach`)**
   - Initialize git repo at `/Users/matnoble/Codes/matnoble-teach`.
   - Copy configuration, theme, components, courses, teaching, and tools folders.
   - Customize `docs/index.md` as the dedicated teaching hub homepage.
   - Configure `wrangler.jsonc` and `functions/pdf/[[path]].ts`.
   - Run `npm run docs:build` to verify zero compile or asset errors.

2. **Phase 2: Cloudflare Deployment & Verification**
   - Create new Cloudflare Pages project for `matnoble-teach`.
   - Bind R2 bucket `matnoble-assets` to `DOWNLOADS_BUCKET`.
   - Bind custom domain `teach.matnoble.top`.
   - Verify course PDF downloads and 3D webgl components in live browser.

3. **Phase 3: Portal Cutover & Redirection**
   - Update `matnoble-portal/docs/public/_redirects` with 301 rules.
   - Update `matnoble-portal` top navigation link for 教学中心.
   - Commit and deploy `matnoble-portal`.
   - Perform end-to-end link traversal to confirm seamless 301 redirection.

---

## 8. Verification and Acceptance Criteria

- [ ] `matnoble-teach` builds cleanly with `npm run docs:build`.
- [ ] `https://teach.matnoble.top/` opens the specialized teaching portal.
- [ ] `https://teach.matnoble.top/courses/discrete-math-2026-fall` downloads 2026 fall slides with 200 OK via R2 proxy.
- [ ] Requesting `https://matnoble.top/courses/discrete-math-2026-fall` returns 301 redirecting to `https://teach.matnoble.top/courses/discrete-math-2026-fall`.
- [ ] Three.js 3D space geometry visualizers and KaTeX/MathJax render properly on `teach.matnoble.top`.
- [ ] Both sites possess accurate `sitemap.xml` and Schema.org structured data.
