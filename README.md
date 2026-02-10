# MatNoble Portal

![VitePress](https://img.shields.io/badge/VitePress-1.0-646CFF?style=flat&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

> **Mathematics as the Core. Technology as the Extension.**
> 以数学为原点，构建可解释的技术世界。

This is the source code for the personal portal of **MatNoble**, a university mathematics teacher and independent developer. It serves as an authoritative entry point for academic content, teaching philosophies, and educational tools.

## ✨ Features

### 🎨 Design & Branding
- **Visual Identity**: Custom **Zhao Shuang String Diagram (赵爽弦图)** logo, representing the geometric proof of the Pythagorean theorem.
- **Color Palette**: **Morandi/Nordic** academic palette (Clay Red, Amber, Sage Teal, Steel Blue) for a professional yet modern look.
- **Typography**:
  - Headings: **Outfit** (Geometric Sans).
  - Body: **Inter** (Highly readable UI font).
- **Micro-interactions**: "Floating" feature cards with spectral glow, breathing buttons, and smooth underline animations.

### 🔍 SEO & AIO (AI Optimization)
- **AI-Ready**: Includes `llms.txt` and `robots.txt` specifically configured to welcome AI crawlers (ChatGPT, Perplexity, etc.).
- **Structured Data**: Injected **JSON-LD** (Schema.org) for rich results and knowledge graph integration.
- **Canonical URLs**: Auto-generated canonical tags to prevent duplicate content issues.
- **Performance**: High Lighthouse scores via VitePress static generation and Vercel edge caching.

## 🛠️ Tech Stack

- **Framework**: [VitePress](https://vitepress.dev/) (Vue 3 + Vite)
- **Styling**: Custom CSS variables + CSS3 Transitions
- **Deployment**: Vercel
- **Fonts**: Google Fonts (Inter & Outfit)

## 🚀 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run docs:dev
   ```
   Access at `http://localhost:5173`.

3. **Build for production**:
   ```bash
   npm run docs:build
   ```

## 📂 Project Structure

```text
matnoble-portal/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts       # Main configuration (SEO, Head, Nav)
│   │   └── theme/          # Custom theme customization
│   │       ├── components/ # Vue components (e.g., Logo.vue)
│   │       └── custom.css  # Global styles & variables
│   ├── public/             # Static assets (logo.svg, robots.txt, llms.txt)
│   ├── teaching/           # Academic content
│   ├── tools/              # Tools showcase
│   └── index.md            # Home page
├── vercel.json             # Vercel deployment config
└── package.json
```

## 📄 Page Overview

The portal is organized into several key sections:

### 🏠 Core Pages
- **[Home](docs/index.md)** (`/`): Introduction to MatNoble and core teaching philosophy.
- **[About](docs/about.md)** (`/about`): Biography, academic background, and social links.
- **[FAQ](docs/faq.md)** (`/faq`): Frequently asked questions about teaching methods and tools.

### 📚 Teaching & Courses
- **Calculus (微积分)**:
  - **[Curriculum Overview](docs/teaching/calculus.md)** (`/teaching/calculus`): The "Calculus Trio" teaching system.
  - **[Universal Formula for Differentials](docs/teaching/derivative-method.md)** (`/teaching/derivative-method`): A simplified framework for differentiation.
  - **[Core CheatSheet](docs/teaching/cheatsheet.md)** (`/teaching/cheatsheet`): Essential formulas and techniques.
- **Linear Algebra (线性代数)**:
  - **[Course Content](docs/teaching/linear-algebra.md)** (`/teaching/linear-algebra`): Syllabus and key concepts.

### 🛠️ Educational Tools
- **[Memorize Assistant](docs/tools/memorize.md)** (`/tools/memorize`): A spaced-repetition tool tailored for mathematical formulas.

## ☁️ Deployment

This project is optimized for **Vercel**.

1. Push code to GitHub.
2. Import repository in Vercel.
3. Settings:
   - **Framework Preset**: VitePress
   - **Build Command**: `npm run docs:build`
   - **Output Directory**: `docs/.vitepress/dist`
4. Add custom domain (`matnoble.top`).

## ✉️ Contact

- **Email**: [me@matnoble.top](mailto:me@matnoble.top)
- **GitHub**: [matnoble](https://github.com/matnoble)
- **Website**: [matnoble.top](https://matnoble.top)

## 📄 License

MIT © [MatNoble](https://github.com/matnoble)
