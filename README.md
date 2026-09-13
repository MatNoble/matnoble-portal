# MatNoble Portal

![VitePress](https://img.shields.io/badge/VitePress-1.0-646CFF?style=flat&logo=vite&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Deployment-Cloudflare%20Pages-F38020?style=flat&logo=cloudflare&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-Passing-success?style=flat&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

> **Mathematics as the Core. Technology as the Extension.**
> 以数学为原点，构建可解释的技术世界。

This is the source code for the personal portal of **MatNoble**, a university mathematics teacher and independent developer. It serves as an authoritative entry point for academic content, teaching philosophies, independent projects, and educational tools.

## ✨ Features

### 🎨 Design & Branding
- **Visual Identity**: Custom **Zhao Shuang String Diagram (赵爽弦图)** logo, representing the geometric proof of the Pythagorean theorem.
- **Color Palette**: **Morandi/Nordic** academic palette (Clay Red, Amber, Sage Teal, Steel Blue) for a professional yet modern look.
- **Typography**:
  - Headings: **Outfit** (Geometric Sans).
  - Body: **Inter** (Highly readable UI font).
- **Micro-interactions**: "Floating" feature cards with spectral glow, breathing buttons, QR code modal previews, and smooth underline animations.

### 🔄 Reactive Engagement & Sharing
- **Dynamic Social Sharing**: Unified `useShare` composable with full reactivity for SPA client-side route changes, generating accurate share URLs across X (Twitter), Telegram, and QR codes.
- **Waline Comments**: Seamlessly integrated discussion and comment system with automatic path watchers across SPA page transitions.
- **Cross-Repository Theme Synchronization**: Tooling (`scripts/sync-shared-theme.mjs`) ensuring seamless consistency and drift prevention between this portal and `matnoble-teach`.

### 🔍 SEO & AIO (AI Optimization)
- **AI-Ready**: Includes `llms.txt` and `robots.txt` specifically configured to welcome AI crawlers (ChatGPT, Perplexity, etc.).
- **Structured Data**: Injected **JSON-LD** (Schema.org) for rich results, author credentials, and knowledge graph integration.
- **RSS Feeds**: Auto-generated `feed.xml` / `atom.xml` upon build, with zero-config local dev server middleware fallback.
- **Canonical URLs**: Auto-generated canonical tags to prevent duplicate content issues.
- **Performance**: High Lighthouse scores via VitePress static generation and Cloudflare edge caching.

## 🛠️ Tech Stack

- **Framework**: [VitePress](https://vitepress.dev/) (Vue 3 + Vite)
- **Styling**: Custom CSS variables + CSS3 Transitions
- **Deployment**: Cloudflare Pages
- **Page Views**: Cloudflare Pages Functions + Cloudflare D1 database, loaded asynchronously after content rendering
- **Fonts**: Google Fonts (Inter & Outfit)

## 🚀 Local Development & Scripts

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run docs:dev
   ```
   Access at `http://localhost:5173`. Local dev includes middleware for instant `/feed.xml` preview.

3. **Run automated tests**:
   ```bash
   npm test
   ```
   Runs unit tests for Pages Functions D1 view counter and validates shared theme synchronization with `matnoble-teach`.

4. **Theme synchronization**:
   ```bash
   # Check if shared theme components match matnoble-teach
   npm run check:theme

   # Bi-directionally synchronize newer theme files
   npm run sync:theme
   ```

5. **Build for production**:
   ```bash
   npm run docs:build
   ```

## 📂 Project Structure

```text
matnoble-portal/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts       # Main configuration (SEO, Head, Nav, dev middleware)
│   │   ├── genFeed.ts      # RSS & Atom feed generator
│   │   └── theme/          # Custom theme customization
│   │       ├── components/ # Vue components (Logo, Share, Comment, FollowSection, SiteMatrix)
│   │       ├── composables/# Shared composables (useShare.ts)
│   │       └── styles/     # Global styles & variables (base.css, custom.css)
│   ├── public/             # Static assets (logo.svg, robots.txt, llms.txt, headers)
│   ├── projects/           # Independent projects & products showcase
│   ├── teaching/           # Academic teaching philosophies & course overviews
│   ├── tools/              # Tools showcase
│   ├── about.md            # About & personal profile
│   ├── faq.md              # Frequently Asked Questions
│   └── index.md            # Home page
├── functions/              # Cloudflare Pages Functions (D1 page view counter API)
├── scripts/                # Development, sync & SEO automation scripts
├── tests/                  # Automated tests (D1 API tests, theme sync tests)
├── AGENTS.md               # AI coding assistant guidelines & workflows
├── package.json
└── wrangler.jsonc          # Cloudflare Pages & D1 binding configuration
```

## 📄 Page Overview

The portal is organized into several key sections:

### 🏠 Core Pages
- **[Home](docs/index.md)** (`/`): Introduction to MatNoble and core teaching philosophy.
- **[About](docs/about.md)** (`/about`): Biography, academic background, matrix links, and social channels.
- **[FAQ](docs/faq.md)** (`/faq`): Frequently asked questions about teaching methods and tools.

### 🚀 Projects
- **[Projects Hub](docs/projects/index.md)** (`/projects`): Independent open-source projects, apps, and developer tools:
  - **GeekAI-Bot (极客智算)**: AI daily news crawler and Telegram channel ([@geekai_daily](https://t.me/geekai_daily)).
  - **D1 Page Views Counter**: Serverless privacy-friendly visitor analytics.
  - **Study Vault & Memorize Assistant**: Formula memorization and spaced-repetition tools.

### 📚 Teaching & Courses
- **Calculus (微积分)**:
  - **[Curriculum Overview](docs/teaching/calculus.md)** (`/teaching/calculus`): The "Calculus Trio" teaching system.
  - **[Universal Formula for Differentials](docs/teaching/derivative-method.md)** (`/teaching/derivative-method`): Simplified algebraic differentiation.
  - **[Core CheatSheet](docs/teaching/cheatsheet.md)** (`/teaching/cheatsheet`): Essential formulas and techniques.
- **Linear Algebra (线性代数)**:
  - **[Course Content](docs/teaching/linear-algebra.md)** (`/teaching/linear-algebra`): Syllabus and key concepts.

### 🛠️ Educational Tools
- **[Memorize Assistant](docs/tools/memorize.md)** (`/tools/memorize`): A spaced-repetition tool tailored for mathematical formulas.

## ☁️ Deployment

This project is optimized for **Cloudflare Pages**.

1. Push code to GitHub.
2. Import repository in Cloudflare Pages.
3. Settings:
   - **Framework Preset**: VitePress
   - **Build Command**: `npm run docs:build`
   - **Output Directory**: `docs/.vitepress/dist`
4. Add custom domain (`matnoble.top`).

The site content is statically generated, while lightweight Pages Functions provide content negotiation and the public page-view API. The page-view counter uses a D1 binding named `PAGE_VIEWS_DB`; it runs within the Pages deployment and does not require a separate Worker service. Database setup and verification are documented in [`docs/agents/page-view-counter.md`](docs/agents/page-view-counter.md).

## ✉️ Contact

- **Email**: [me@matnoble.top](mailto:me@matnoble.top)
- **GitHub**: [matnoble](https://github.com/matnoble)
- **Website**: [matnoble.top](https://matnoble.top)
- **Telegram Channel**: [@geekai_daily](https://t.me/geekai_daily)

## 📄 License

MIT © [MatNoble](https://github.com/matnoble)
