# Teach Subdomain Separation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the courses, teaching lectures, interactive 3D math labs, and pedagogical tools from `matnoble-portal` (`matnoble.top`) into an independent repository `matnoble-teach` (`teach.matnoble.top`), binding to the existing Cloudflare R2 bucket (`matnoble-assets`) and wiring edge-level 301 permanent redirects on `matnoble.top`.

**Architecture:** Initialize a dedicated VitePress project in `/Users/matnoble/Codes/matnoble-teach` inheriting the proven academic theme, MathJax/Three.js visualizers, and Cloudflare Pages Functions R2 asset proxy. Configure edge 301 redirects in `matnoble-portal/docs/public/_redirects` to transparently forward old course/teaching/tool URLs to `teach.matnoble.top`.

**Tech Stack:** VitePress 1.6+, Vue 3, Three.js, KaTeX, MathJax, Cloudflare Pages, Cloudflare R2 (`matnoble-assets`), Node.js native test runner.

## Global Constraints

- Standalone target repository: `/Users/matnoble/Codes/matnoble-teach`
- Primary portal repository: `/Users/matnoble/Codes/matnoble-portal`
- Target subdomain: `https://teach.matnoble.top`
- Cloudflare R2 Bucket name: `matnoble-assets` (binding: `DOWNLOADS_BUCKET`)
- All course PDF download routes follow: `/pdf/*`
- All legacy course/teaching/tools routes on `matnoble.top` must redirect with 301 HTTP status code.

---

### Task 1: Scaffold `matnoble-teach` Workspace, Dependencies, and Cloudflare Config

**Files:**
- Create: `/Users/matnoble/Codes/matnoble-teach/package.json`
- Create: `/Users/matnoble/Codes/matnoble-teach/tsconfig.json`
- Create: `/Users/matnoble/Codes/matnoble-teach/wrangler.jsonc`
- Create: `/Users/matnoble/Codes/matnoble-teach/functions/lib/r2-handler.ts`
- Create: `/Users/matnoble/Codes/matnoble-teach/functions/pdf/[[path]].ts`

**Interfaces:**
- Produces: Base project structure, npm scripts (`docs:dev`, `docs:build`, `test`), and Cloudflare R2 function proxying `matnoble-assets`.

- [ ] **Step 1: Initialize Git repository and directory structure**

```bash
mkdir -p /Users/matnoble/Codes/matnoble-teach/functions/lib
mkdir -p /Users/matnoble/Codes/matnoble-teach/functions/pdf
mkdir -p /Users/matnoble/Codes/matnoble-teach/docs
cd /Users/matnoble/Codes/matnoble-teach && git init
```

- [ ] **Step 2: Create `package.json`**

Write to `/Users/matnoble/Codes/matnoble-teach/package.json`:

```json
{
  "name": "matnoble-teach",
  "version": "1.0.0",
  "type": "module",
  "description": "MatNoble Teaching Hub & Courseware Platform",
  "main": "index.js",
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "docs:markdown": "node scripts/generate-agent-markdown.mjs",
    "docs:dev": "vitepress dev docs",
    "docs:build": "npm run docs:markdown && vitepress build docs",
    "docs:preview": "vitepress preview docs"
  },
  "keywords": [
    "math",
    "teaching",
    "courseware",
    "discrete-math",
    "calculus",
    "linear-algebra"
  ],
  "author": "MatNoble <me@matnoble.top>",
  "license": "MIT",
  "devDependencies": {
    "@types/katex": "^0.16.8",
    "@types/qrcode": "^1.5.6",
    "@types/video.js": "^7.3.58",
    "axios": "^1.6.0",
    "feed": "^5.2.0",
    "markdown-it-mathjax3": "^4.3.2",
    "vite-plugin-pwa": "^1.2.0",
    "vite-plugin-webfont-dl": "^3.11.1",
    "vitepress": "^1.0.0",
    "vue": "^3.0.0"
  },
  "dependencies": {
    "@types/three": "^0.183.1",
    "@waline/client": "^3.8.0",
    "katex": "^0.16.28",
    "medium-zoom": "^1.1.0",
    "qrcode": "^1.5.4",
    "three": "^0.183.2",
    "video.js": "^8.23.7"
  }
}
```

- [ ] **Step 3: Create `wrangler.jsonc`**

Write to `/Users/matnoble/Codes/matnoble-teach/wrangler.jsonc`:

```jsonc
{
  "$schema": "https://unpkg.com/wrangler/config-schema.json",
  "name": "matnoble-teach",
  "pages_build_output_dir": "docs/.vitepress/dist",
  "r2_buckets": [
    {
      "binding": "DOWNLOADS_BUCKET",
      "bucket_name": "matnoble-assets"
    }
  ]
}
```

- [ ] **Step 4: Replicate R2 Pages Function Proxy**

Copy `functions/lib/r2-handler.ts` and `functions/pdf/[[path]].ts` from `matnoble-portal` to `matnoble-teach`:

```bash
cp /Users/matnoble/Codes/matnoble-portal/functions/lib/r2-handler.ts /Users/matnoble/Codes/matnoble-teach/functions/lib/r2-handler.ts
cp /Users/matnoble/Codes/matnoble-portal/functions/pdf/\[\[path\]\].ts /Users/matnoble/Codes/matnoble-teach/functions/pdf/\[\[path\]\].ts
```

- [ ] **Step 5: Install dependencies in `matnoble-teach`**

Run:

```bash
cd /Users/matnoble/Codes/matnoble-teach && npm install
```

Expected output: `added ... packages in ...`

- [ ] **Step 6: Commit Task 1**

```bash
cd /Users/matnoble/Codes/matnoble-teach && git add . && git commit -m "chore: scaffold matnoble-teach project and Cloudflare R2 proxy"
```

---

### Task 2: Replicate and Customize Theme, Config, and Components for `matnoble-teach`

**Files:**
- Create: `/Users/matnoble/Codes/matnoble-teach/docs/.vitepress/config.ts`
- Create: `/Users/matnoble/Codes/matnoble-teach/docs/.vitepress/theme/*`
- Create: `/Users/matnoble/Codes/matnoble-teach/docs/components/*`
- Create: `/Users/matnoble/Codes/matnoble-teach/scripts/generate-agent-markdown.mjs`

**Interfaces:**
- Consumes: Academic theme and components from `matnoble-portal`.
- Produces: Standalone VitePress build configuration for `https://teach.matnoble.top`.

- [ ] **Step 1: Copy theme, scripts, and components**

Run:

```bash
cp -r /Users/matnoble/Codes/matnoble-portal/docs/.vitepress/theme /Users/matnoble/Codes/matnoble-teach/docs/.vitepress/
cp -r /Users/matnoble/Codes/matnoble-portal/docs/components /Users/matnoble/Codes/matnoble-teach/docs/
mkdir -p /Users/matnoble/Codes/matnoble-teach/scripts
cp /Users/matnoble/Codes/matnoble-portal/scripts/generate-agent-markdown.mjs /Users/matnoble/Codes/matnoble-teach/scripts/
```

- [ ] **Step 2: Create `docs/.vitepress/config.ts` configured for `teach.matnoble.top`**

Write `/Users/matnoble/Codes/matnoble-teach/docs/.vitepress/config.ts` with:
- `SITE_ORIGIN = "https://teach.matnoble.top"`
- `SITE_DESCRIPTION = "MatNoble 教学中心：大学数学（离散数学、高等数学、线性代数、经济数学）与工程计算精品课件、章节大纲、3D互动几何实验与课堂工具。"`
- Top Navigation:
  ```ts
  nav: [
    { text: "课程中心", link: "/courses/" },
    { text: "教学讲义", link: "/teaching/" },
    { text: "数学工具", link: "/tools/" },
    { text: "主讲教师 ↗", link: "https://matnoble.top/about" },
    { text: "个人门户 ↗", link: "https://matnoble.top/" }
  ]
  ```
- All Route Labels for courses, teaching, and tools.
- Auto-generation of Schema.org `Course` and `BreadcrumbList`.

- [ ] **Step 3: Commit Task 2**

```bash
cd /Users/matnoble/Codes/matnoble-teach && git add . && git commit -m "feat(theme): configure teach.matnoble.top theme, components, and navigation"
```

---

### Task 3: Migrate Courses, Teaching, and Tools Content to `matnoble-teach`

**Files:**
- Create: `/Users/matnoble/Codes/matnoble-teach/docs/index.md` (Teaching hub homepage)
- Create: `/Users/matnoble/Codes/matnoble-teach/docs/courses/*`
- Create: `/Users/matnoble/Codes/matnoble-teach/docs/teaching/*`
- Create: `/Users/matnoble/Codes/matnoble-teach/docs/tools/*`
- Create: `/Users/matnoble/Codes/matnoble-teach/docs/public/*` (llms.txt, _headers, robots.txt, icons)

**Interfaces:**
- Consumes: Standardized semester course pages (`discrete-math-2026-fall.md`, `discrete-math-2026-spring.md`, `advanced-math-2-2026-spring.md`, `economic-math-2-2026-spring.md`).
- Produces: Complete educational content repository ready for students and crawlers.

- [ ] **Step 1: Copy content folders**

Run:

```bash
cp -r /Users/matnoble/Codes/matnoble-portal/docs/courses /Users/matnoble/Codes/matnoble-teach/docs/
cp -r /Users/matnoble/Codes/matnoble-portal/docs/teaching /Users/matnoble/Codes/matnoble-teach/docs/
cp -r /Users/matnoble/Codes/matnoble-portal/docs/tools /Users/matnoble/Codes/matnoble-teach/docs/
cp -r /Users/matnoble/Codes/matnoble-portal/docs/public /Users/matnoble/Codes/matnoble-teach/docs/
```

- [ ] **Step 2: Create dedicated teaching portal homepage (`docs/index.md`)**

Write to `/Users/matnoble/Codes/matnoble-teach/docs/index.md` featuring:
- Hero: "MatNoble 教学中心" / "以数学直觉为引领，用计算与代码重构科学视野"
- Direct entry cards to 2026 Fall 《离散数学》
- Direct entry cards to 3D Space Geometry Lab and Cramer's Rule visualizer
- Direct entry cards to Classroom Countdown and DI Method
- Quick link back to personal portal `https://matnoble.top`

- [ ] **Step 3: Configure `docs/public/_redirects` in `matnoble-teach`**

Write `/Users/matnoble/Codes/matnoble-teach/docs/public/_redirects`:

```text
/courses/discrete-math /courses/discrete-math-2026-fall 302
/courses/advanced-math-2 /courses/advanced-math-2-2026-spring 302
/courses/economic-math-2 /courses/economic-math-2-2026-spring 302
```

- [ ] **Step 4: Commit Task 3**

```bash
cd /Users/matnoble/Codes/matnoble-teach && git add . && git commit -m "feat(content): populate courses, teaching modules, tools, and dedicated teaching homepage"
```

---

### Task 4: Build Verification & Local Testing on `matnoble-teach`

**Files:**
- Create: `/Users/matnoble/Codes/matnoble-teach/tests/r2-assets.test.mjs`

- [ ] **Step 1: Copy and adjust tests**

```bash
mkdir -p /Users/matnoble/Codes/matnoble-teach/tests
cp /Users/matnoble/Codes/matnoble-portal/tests/r2-assets.test.mjs /Users/matnoble/Codes/matnoble-teach/tests/
```

- [ ] **Step 2: Run test suite**

Run:

```bash
cd /Users/matnoble/Codes/matnoble-teach && npm test
```

Expected: Tests pass.

- [ ] **Step 3: Run full production build**

Run:

```bash
cd /Users/matnoble/Codes/matnoble-teach && npm run docs:build
```

Expected output:
- `✓ building client + server bundles...`
- `✓ rendering pages...`
- `✓ generating sitemap...`
- `build complete in ...`

- [ ] **Step 4: Commit Task 4**

```bash
cd /Users/matnoble/Codes/matnoble-teach && git add . && git commit -m "test: add automated test coverage and verify clean production build"
```

---

### Task 5: Configure 301 Redirects and Update Navigation on `matnoble-portal`

**Files:**
- Modify: `docs/public/_redirects`
- Modify: `docs/.vitepress/config.ts`

**Interfaces:**
- Consumes: Target domain `https://teach.matnoble.top`.
- Produces: Edge 301 redirection from `matnoble.top` to `teach.matnoble.top` for all course, lecture, and tool paths.

- [ ] **Step 1: Configure Edge-level 301 redirect rules on `matnoble-portal`**

Update `/Users/matnoble/Codes/matnoble-portal/docs/public/_redirects`:

```text
/courses/*  https://teach.matnoble.top/courses/:splat  301
/teaching/* https://teach.matnoble.top/teaching/:splat 301
/tools/*    https://teach.matnoble.top/tools/:splat    301
/pdf/*      https://teach.matnoble.top/pdf/:splat      301
```

- [ ] **Step 2: Update top navigation on `matnoble-portal`**

In `/Users/matnoble/Codes/matnoble-portal/docs/.vitepress/config.ts`, update `themeConfig.nav`:

```ts
    nav: [
      { text: "关于我", link: "/about" },
      { text: "教学中心 ↗", link: "https://teach.matnoble.top/" },
      { text: "开源项目", link: "/projects/" },
      { text: "技术博客 ↗", link: "https://blog.matnoble.top" },
      { text: "光影定格 ↗", link: "https://album.matnoble.top/" },
    ],
```

- [ ] **Step 3: Verify build of `matnoble-portal`**

Run:

```bash
cd /Users/matnoble/Codes/matnoble-portal && npm run docs:build
```

Expected output: `build complete in ...`

- [ ] **Step 4: Commit `matnoble-portal` changes**

```bash
git add docs/public/_redirects docs/.vitepress/config.ts
git commit -m "feat(nav): link to teach.matnoble.top and set up 301 edge redirects for teaching assets"
```

---

## Plan Self-Review

1. **Spec coverage**:
   - Local scaffolding (`matnoble-teach`): Covered in Task 1.
   - Theme and components replication: Covered in Task 2.
   - Content migration: Covered in Task 3.
   - Testing and verification: Covered in Task 4.
   - Edge 301 redirection and portal nav update: Covered in Task 5.
2. **Placeholder scan**: Zero TBDs, TODOs, or incomplete steps.
3. **Type consistency**: R2 bindings, directory names, and URL splats match verbatim between tasks.
