import { defineConfig } from "vitepress";
import webfontDl from "vite-plugin-webfont-dl";
import { genFeed } from "./genFeed";
import { VitePWA } from "vite-plugin-pwa";

const SITE_ORIGIN = "https://matnoble.top";
const SITE_DESCRIPTION =
  "MatNoble 是大学数学教师的个人站点，整理微积分、线性代数、空间解析几何等课程内容，并提供若干交互式教学工具。";

const ROUTE_LABELS: Record<string, string> = {
  "about": "关于 MatNoble",
  "courses": "课程中心",
  "projects": "开源项目",
  "teaching": "教学目录",
  "teaching/calculus": "微积分",
  "teaching/linear-algebra": "线性代数",
  "teaching/linear-algebra/cramers-rule": "克拉默法则",
  "teaching/linear-algebra/elementary-transformations": "初等变换",
  "teaching/linear-algebra/matrix-normal-form": "矩阵化简",
  "tools": "数学工具",
  "courses/matlab": "MATLAB 编程与实践",
  "courses/matlab/basics": "MATLAB 基础与矩阵操作",
  "courses/matlab/conventions": "M 文件与函数规范",
  "courses/matlab/project-calculator": "矩阵计算器项目",
  "courses/matlab/project-gui": "GUI 矩阵计算器项目",
};

const DIRECTORY_ROUTES = new Set(["courses", "projects", "teaching", "tools"]);

function canonicalUrl(relativePath: string): string {
  if (relativePath === "index.md") return `${SITE_ORIGIN}/`;

  const withoutExtension = relativePath.replace(/\.md$/, "");
  if (withoutExtension.endsWith("/index")) {
    return `${SITE_ORIGIN}/${withoutExtension.replace(/index$/, "")}`;
  }

  return `${SITE_ORIGIN}/${withoutExtension}`;
}

function isIndexableUrl(url: string): boolean {
  const pathname = new URL(url, SITE_ORIGIN).pathname;
  return !(
    pathname === "/404" ||
    pathname === "/404.html" ||
    pathname.startsWith("/agents/") ||
    pathname.startsWith("/public/") ||
    pathname.startsWith("/.well-known/")
  );
}

function routePath(relativePath: string): string {
  if (relativePath === "index.md") return "";

  const withoutExtension = relativePath.replace(/\.md$/, "");
  if (withoutExtension.endsWith("/index")) {
    return withoutExtension.replace(/\/index$/, "");
  }

  return withoutExtension;
}

function markdownMirrorUrl(relativePath: string): string {
  const route = routePath(relativePath);
  return `${SITE_ORIGIN}/.well-known/markdown/${route || "index"}.md`;
}

function breadcrumbItemUrl(route: string): string {
  const trailingSlash = DIRECTORY_ROUTES.has(route) ? "/" : "";
  return `${SITE_ORIGIN}/${route}${trailingSlash}`;
}

export default defineConfig({
  lang: "zh-CN",
  title: "MatNoble",
  titleTemplate: ":title | MatNoble", // 统一标题模板，防止重复
  description: SITE_DESCRIPTION,

  markdown: {
    math: true,
  },

  router: {
    prefetchLinks: false,
  },

  buildEnd: genFeed,
  srcExclude: [
    "agents/**/*.md",
    "audits/**/*.md",
    "public/**/*.md",
    "superpowers/**/*.md",
  ],

  vite: {
    server: {
      proxy: {
        "^/(r2-assets|p|pdf)/.*": {
          target: "https://matnoble.top",
          changeOrigin: true,
        },
      },
    },
    build: {
      target: "es2019",
      cssTarget: "chrome61",
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/three")) {
              return "vendor-three";
            }
            if (id.includes("node_modules/video.js") || id.includes("node_modules/videojs")) {
              return "vendor-videojs";
            }
            if (id.includes("node_modules/katex")) {
              return "vendor-katex";
            }
          }
        }
      }
    },
    plugins: [
      webfontDl([
        "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700&display=swap",
      ]),
      VitePWA({
        outDir: ".vitepress/dist",
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "logo.svg", "apple-touch-icon.png"],
        manifest: {
          name: "MatNoble",
          short_name: "MatNoble",
          description: "大学数学教师 MatNoble 的个人门户",
          theme_color: "#ffffff",
          icons: [
            {
              src: "/favicon.png",
              sizes: "32x32",
              type: "image/png",
            },
            {
              src: "/logo.svg",
              sizes: "any",
              type: "image/svg+xml",
            },
            {
              src: "/logo.svg",
              sizes: "512x512",
              type: "image/svg+xml",
              purpose: "any maskable",
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
        workbox: {
          globPatterns: ["**/*.{css,js,html,svg,png,ico,txt,woff2}"],
        },
      }),
    ],
  },

  // 关键 SEO 配置：生成 sitemap
  sitemap: {
    hostname: SITE_ORIGIN,
    lastmodDateOnly: true,
    xmlns: {
      news: false,
      video: true,
      image: true,
      xhtml: true,
    },
    transformItems: (items) => {
      return items.filter((item) => isIndexableUrl(item.url));
    },
  },

  themeConfig: {
    // logo: '/logo.svg', // 注释掉此处，防止导航栏出现双重 Logo (已通过 Logo.vue 组件自定义)
    siteTitle: false,
    // 顶部导航
    nav: [
      { text: "关于我", link: "/about" },
      { text: "课程中心", link: "/courses/" },
      { text: "开源项目", link: "/projects/" },
      { text: "技术博客", link: "https://blog.matnoble.top" },
      { text: "在线相册", link: "https://album.matnoble.top/" },
    ],

    // 移除侧边栏，实现全屏沉浸式阅读
    sidebar: [],

    socialLinks: [],

    footer: {
      message: '以数学构建逻辑，用技术驱动学习。<br><a href="/privacy">隐私政策</a> | <a href="/terms">服务条款</a><br>Copyright © 2025-2026 MatNoble',
      copyright: "",
    },

    // --- 汉化配置 ---
    outline: {
      label: "本页目录",
      level: [2, 3],
    },
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "回到顶部",
    darkModeSwitchLabel: "外观",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
        },
      },
    },

    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "short",
      },
    },
  },

  // --- SEO & Indexing 核心配置 ---
  lastUpdated: true, // 显示最后更新时间，提示爬虫内容鲜活
  cleanUrls: true, // 生成无 .html 后缀的干净链接 (对 SEO 更友好)

  // 动态注入 Canonical URL (规范链接)，防止重复内容降权
  // 动态注入 Canonical URL (规范链接) 和 Open Graph / Twitter Card 元数据
  transformHead: ({ pageData }) => {
    const url = canonicalUrl(pageData.relativePath);

    const siteTitle = "MatNoble";
    const pageTitle = pageData.title;
    const title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;

    const description = pageData.description || SITE_DESCRIPTION;

    const image = pageData.frontmatter.image || "/social-card.png";
    const imageUrl = image.startsWith("http")
      ? image
      : `https://matnoble.top${image.startsWith('/') ? '' : '/'}${image}`;

    const schemas: any[] = [];

    // 1. BreadcrumbList Schema
    const breadcrumbs = [];
    breadcrumbs.push({
      "@type": "ListItem",
      "position": 1,
      "name": "首页",
      "item": "https://matnoble.top/"
    });

    const pageRoutePath = routePath(pageData.relativePath);
    const pathSegments = pageRoutePath ? pageRoutePath.split("/") : [];
    if (pathSegments.length > 0) {
      pathSegments.forEach((segment, index) => {
        const currentRoute = pathSegments.slice(0, index + 1).join("/");
        const isLast = index === pathSegments.length - 1;
        const name =
          (isLast && pageData.frontmatter.breadcrumb) ||
          ROUTE_LABELS[currentRoute] ||
          segment.replace(/-/g, " ");
        breadcrumbs.push({
          "@type": "ListItem",
          "position": index + 2,
          "name": name,
          "item": breadcrumbItemUrl(currentRoute)
        });
      });
    }
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs
    });

    // 2. FAQPage Schema
    if (pageData.frontmatter.structuredData?.faq) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": pageData.frontmatter.structuredData.faq.map((item: any) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      });
    }

    // 3. MathSolver Schema
    if (pageData.frontmatter.structuredData?.mathSolver) {
      const ms = pageData.frontmatter.structuredData.mathSolver;
      schemas.push({
        "@context": "https://schema.org",
        "@type": ["MathSolver", "LearningResource"],
        "name": ms.name,
        "url": url,
        "inLanguage": "zh-CN",
        "learningResourceType": "Math Solver",
        "eduQuestionType": "Integration",
        "usageInfo": "https://matnoble.top/about",
        "provider": { "@id": "https://matnoble.top/#person" },
        "description": ms.description,
        "potentialAction": ms.potentialAction.map((action: any) => ({
          "@type": action.type === "SolveAction" ? "SolveMathAction" : action.type,
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": action.target + "?q={math_expression}"
          },
          "mathExpression-input": "required name=math_expression",
          "eduQuestionType": "Integration"
        }))
      });
    }

    // 4. Course Schema
    if (pageData.frontmatter.structuredData?.course) {
      const course = pageData.frontmatter.structuredData.course;
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Course",
        "name": course.name,
        "description": course.description,
        "provider": {
          "@type": "Organization",
          "name": course.provider,
          "sameAs": "https://matnoble.top"
        }
      });
    }

    // 5. SoftwareApplication Schema
    if (pageData.frontmatter.structuredData?.softwareApp) {
      const app = pageData.frontmatter.structuredData.softwareApp;
      schemas.push({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": app.name,
        "applicationCategory": app.category,
        "description": app.description,
        "operatingSystem": "Web",
        "author": { "@id": "https://matnoble.top/#person" }
      });
    }

    // 6. ProfilePage Schema
    if (pageData.frontmatter.structuredData?.profile) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": { "@id": "https://matnoble.top/#person" }
      });
    }

    // 7. Article Schema (for teaching content)
    if (pageData.relativePath.startsWith('teaching/') && pageData.relativePath !== 'teaching/index.md') {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": imageUrl,
        "author": { "@id": "https://matnoble.top/#person" },
        "publisher": { "@id": "https://matnoble.top/#person" },
        "datePublished": new Date(pageData.lastUpdated || Date.now()).toISOString(),
        "dateModified": new Date(pageData.lastUpdated || Date.now()).toISOString(),
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": url
        }
      });
    }

    // 8. Dynamic Keywords handling
    const keywords = pageData.frontmatter.keywords || "计算数学, 算法思维, 微积分, 线性代数, MatNoble";

    return [
      ["link", { rel: "canonical", href: url }],
      ["link", { rel: "alternate", type: "text/markdown", href: markdownMirrorUrl(pageData.relativePath) }],
      ["meta", { name: "robots", content: "index, follow, max-image-preview:large" }],
      ["meta", { name: "author", content: "MatNoble" }],
      ["meta", { name: "keywords", content: keywords }],
      // Open Graph
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:title", content: title }],
      ["meta", { property: "og:description", content: description }],
      ["meta", { property: "og:image", content: imageUrl }],
      ["meta", { property: "og:image:width", content: "1200" }],
      ["meta", { property: "og:image:height", content: "630" }],
      ["meta", { property: "og:image:type", content: "image/png" }],
      // Twitter Card
      ["meta", { name: "twitter:url", content: url }],
      ["meta", { name: "twitter:title", content: title }],
      ["meta", { name: "twitter:description", content: description }],
      ["meta", { name: "twitter:image", content: imageUrl }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:site", content: "@MatNoble" }],
      ["meta", { name: "twitter:creator", content: "@MatNoble" }],
      // JSON-LD Scripts
      ...schemas.map(schema => ["script", { type: "application/ld+json" }, JSON.stringify(schema)])
    ] as any;
  },

  head: [
    /* MathJax 学术级渲染 — 放大 10%，继承衬线字体，居中 display 公式 */
    [
      "script",
      {},
      `window.MathJax = {
        options: { skipHtmlTags: ['script','noscript','style','textarea','pre'] },
        loader: { load: ['[tex]/physics'] },
        chtml: {
          scale: 1.15,
          minScale: 0.9,
          mtextInheritFont: true,
          merrorInheritFont: true,
          displayAlign: 'center',
          displayIndent: '0',
          fontURL: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/mathjax/3.2.0/es5/output/chtml/fonts/stix2'
        },
        tex: {
          packages: {'[+]': ['physics']},
          inlineMath: [['$','$']],
          displayMath: [['$$','$$']],
          processEscapes: true
        }
      };`,
    ],
    [
      "link",
      {
        rel: "alternate",
        type: "application/atom+xml",
        title: "Atom Feed for MatNoble",
        href: "/atom.xml",
      },
    ],
    [
      "link",
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "RSS Feed for MatNoble",
        href: "/feed.xml",
      },
    ],
    ["link", { rel: "icon", href: "/favicon.ico", sizes: "any" }],
    ["link", { rel: "icon", href: "/logo.svg", type: "image/svg+xml" }],
    ["link", { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }],
    // IndexNow 验证
    ["meta", { name: "indexnow-key", content: "7c6a9686414144409395982823617300" },],
    // Google Search Console 验证
    [
      "meta",
      {
        name: "google-site-verification",
        content: "OeFbtbYCwGN3Bnb3MSOm50bnnxInp9jj_bQT5vOIBPo",
      },
    ],
    // Bing Webmaster Tools 验证
    [
      "meta",
      { name: "msvalidate.01", content: "1267ABE5F71B3CA9AF5AF169FD89E296" },
    ],
    ["link", { rel: "manifest", href: "/manifest.webmanifest" }],
    ["meta", { name: "theme-color", content: "#ffffff" }],
    ["meta", { name: "mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "default" }],
    // Security Headers
    ['meta', { name: 'referrer', content: 'strict-origin-when-cross-origin' }],
    [
      "meta",
      {
        name: "keywords",
        content: "计算数学, 算法思维, 微积分, 线性代数, 微分万能公式, DI表格积分法, 数学建模, 开发者工具, MatNoble, 高等数学速查表, CS与数学",
      },
    ],

    // --- Open Graph (社交媒体/AI 引用卡片) ---
    ["meta", { property: "og:site_name", content: "MatNoble" }],
    ["meta", { property: "og:type", content: "website" }],
    // 其他动态 meta 已移至 transformHead 配置

    // --- JSON-LD (Schema.org 结构化数据 - AI 知识图谱核心) ---
    [
      "script",
      { type: "application/ld+json" },
      JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": "https://matnoble.top/#person",
            name: "MatNoble",
            url: "https://matnoble.top",
            jobTitle: "University Mathematics Lecturer",
            knowsAbout: [
              "Calculus",
              "Linear Algebra",
              "Computer Science",
              "Educational Technology",
              "Web Development",
            ],
            description:
              "大学数学教师与独立开发者，主要整理微积分、线性代数等课程内容，并开发交互式教学工具。",
            image: "https://matnoble.top/logo.svg",
            sameAs: [
              "https://github.com/matnoble",
              "https://blog.matnoble.top",
              "https://www.zhihu.com/people/matnoble",
              "https://www.youtube.com/@RossMatNoble"
            ],
          },
          {
            "@type": "WebSite",
            "@id": "https://matnoble.top/#website",
            url: "https://matnoble.top",
            name: "MatNoble Portal",
            description: SITE_DESCRIPTION,
            publisher: { "@id": "https://matnoble.top/#person" },
            inLanguage: "zh-CN"
          },
          {
            "@type": "EducationalOrganization",
            "@id": "https://matnoble.top/#organization",
            "name": "MatNoble",
            "url": "https://matnoble.top",
            "description": "面向大学数学教学的个人站点，包含课程讲义、交互演示和学习工具。",
            "logo": "https://matnoble.top/logo.svg",
            "founder": {
              "@type": "Person",
              "name": "MatNoble"
            },
            "sameAs": [
              "https://github.com/matnoble",
              "https://blog.matnoble.top"
            ]
          },
          {
            "@type": "DefinedTermSet",
            "@id": "https://matnoble.top/#methods",
            "name": "大学数学常用计算方法",
            "hasDefinedTerm": [
              {
                "@type": "DefinedTerm",
                "name": "Universal Formula for Differentials (微分万能公式)",
                "description": "利用一阶微分形式不变性，将链式法则写成逐层微分操作：dy = d(f(□)) = f'(□) d(□)。",
                "url": "https://matnoble.top/teaching/derivative-method",
                "sameAs": [
                  "https://en.wikipedia.org/wiki/Differential_(mathematics)",
                  "https://en.wikipedia.org/wiki/Chain_rule"
                ]
              },
              {
                "@type": "DefinedTerm",
                "name": "DI Method (表格积分法)",
                "description": "分部积分法的一种表格化写法，通过 D (求导) 和 I (积分) 两列组织计算，遵循 LIATE 优先级法则。",
                "url": "https://matnoble.top/teaching/cheatsheet",
                "sameAs": [
                  "https://en.wikipedia.org/wiki/Integration_by_parts"
                ]
              }
            ]
          },
          {
            "@type": "CreativeWork",
            name: "Universal Formula for Differentials (微分万能公式)",
            author: { "@id": "https://matnoble.top/#person" },
            description:
              "一种用于整理复合函数微分计算步骤的写法：\\mathrm{d}y = \\mathrm{d}(f(□)) = f'(□)\\mathrm{d}(□)。",
            inLanguage: "zh-CN",
          },
          {
            "@type": "SoftwareApplication",
            name: "Memorize",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            author: { "@id": "https://matnoble.top/#person" },
            description:
              "支持 LaTeX 公式录入的间隔重复记忆工具。",
            url: "https://matnoble.top/tools/memorize",
          },
        ],
      }),
    ],
  ],
});
