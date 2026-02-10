import { defineConfig } from "vitepress";
import webfontDl from "vite-plugin-webfont-dl";
import { genFeed } from "./genFeed";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  lang: "zh-CN",
  title: "MatNoble",
  titleTemplate: ":title | MatNoble", // 统一标题模板，防止重复
  description:
    "大学数学教师 MatNoble 的个人门户。致力于数学与计算机科学的交叉探索，分享微积分、线性代数的高效方法论及数学辅助工具开发。为热爱数学与编程的探索者提供深度内容。",

  markdown: {
    math: true,
  },

  buildEnd: genFeed,

  vite: {
    build: {
      target: "esnext",
      chunkSizeWarningLimit: 1000,
    },
    plugins: [
      webfontDl([
        "https://fonts.googleapis.com/css2?family=Outfit:wght@500;700&family=Lora:ital,wght@0,400..700;1,400..700&family=Noto+Serif+SC:wght@400;700&display=swap",
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
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "gstatic-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],
  },

  // 关键 SEO 配置：生成 sitemap
  sitemap: {
    hostname: "https://matnoble.top",
    lastmodDateOnly: true,
    xmlns: {
      news: false,
      video: false,
      image: false,
      xhtml: false,
    },
    transformItems: (items) => {
      return items
        .filter((item) => !item.url.endsWith("404") && !item.url.endsWith("404.html"))
        .map((item) => ({
          ...item,
          url: item.url.replace(/\/$/, ""),
        }));
    },
  },

  themeConfig: {
    // logo: '/logo.svg', // 注释掉此处，防止导航栏出现双重 Logo (已通过 Logo.vue 组件自定义)
    siteTitle: false,
    // 顶部导航
    nav: [
      { text: "首页", link: "/" },
      {
        text: "课程",
        items: [
          {
            text: "微积分 (Calculus)",
            items: [
              { text: "教学体系概览", link: "/teaching/calculus" },
              { text: "微分万能公式", link: "/teaching/derivative-method" },
              { text: "核心心法速查表 (CheatSheet)", link: "/teaching/cheatsheet" },
            ],
          },
          { text: "线性代数", link: "/teaching/linear-algebra" },
        ],
      },
      {
        text: "在线工具",
        items: [
          { text: "DI 表格法演示", link: "/tools/di-method" },
          { text: "Memorize 助手", link: "/tools/memorize" },
        ],
      },
      { text: "技术博客", link: "https://blog.matnoble.top" },
      { text: "关于", link: "/about" },
    ],

    // 侧边栏配置
    sidebar: {
      // 全局菜单已移至顶部导航下拉框
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/matnoble" },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Email</title><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
        },
        link: "mailto:me@matnoble.top",
      },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zM5.934 12.088c.492-2.103 3.033-3.146 5.357-4.144 2.872-1.233 5.486-2.353 5.486-2.353s1.102-.455 1.018.618c-.033.432-.237 1.763-.44 3.14-.306 2.072-.638 4.31-.815 5.093-.195.86-.55 1.144-.55 1.144s-.305.28-.627.05c-.322-.23-.847-.574-1.39-.932-.474-.313-1.074-.71-1.425-1.002-.27-.225-.492-.542-.144-.84.07-.06.27-.243.51-.462 1.353-1.237 2.152-1.968 2.152-1.968.21-.193.394-.525-.07-.525-.11 0-.312.04-.63.25-.43.284-3.12 2.064-4.22 2.793-.412.272-.782.406-1.11.398-.36-.008-1.047-.215-1.56-.38-.63-.203-1.132-.31-1.087-.655.023-.18.264-.366.723-.556z"/></svg>',
        },
        link: "https://t.me/HUSTMatNoble",
      },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>RSS</title><path d="M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.265 0 24 10.735 24 24h-4.801zM3.291 17.415c1.814 0 3.293 1.479 3.293 3.295 0 1.813-1.485 3.29-3.301 3.29C1.47 24 0 22.515 0 20.71s1.47-3.295 3.291-3.295zM15.909 24h-4.665c0-6.169-5.004-11.167-11.244-11.167V8.167c8.744 0 15.91 7.161 15.91 15.833z"/></svg>',
        },
        link: "/atom.xml",
      },
    ],

    footer: {
      message: '以数学构建逻辑，用技术驱动学习。 | <a href="mailto:me@matnoble.top">me@matnoble.top</a>',
      copyright: "Copyright © 2025-2026 MatNoble",
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
    const url = `https://matnoble.top/${pageData.relativePath}`
      .replace(/index\.md$/, "")
      .replace(/\.md$/, "")
      .replace(/\/$/, "");

    const siteTitle = "MatNoble";
    const pageTitle = pageData.title;
    const title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
    
    const description =
      pageData.description ||
      "大学数学教师 MatNoble 的个人门户。专注于微积分三大计算（微分万能公式、DI表格法）与线性代数教学，分享数学学习方法与辅助工具。";
    
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

    const pathSegments = pageData.relativePath.split('/').filter(s => s !== 'index.md');
    if (pathSegments.length > 0) {
       let cumulativePath = "https://matnoble.top/";
       pathSegments.forEach((segment, index) => {
          const cleanSegment = segment.replace('.md', '');
          cumulativePath += cleanSegment + '/';
          const name = pageData.frontmatter.breadcrumb || cleanSegment.charAt(0).toUpperCase() + cleanSegment.slice(1);
          breadcrumbs.push({
            "@type": "ListItem",
            "position": index + 2,
            "name": name,
            "item": cumulativePath.replace(/\/$/, "")
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
        "@type": "MathSolver",
        "name": ms.name,
        "description": ms.description,
        "potentialAction": ms.potentialAction.map((action: any) => ({
          "@type": action.type,
          "target": action.target,
          "mathExpression": action.mathExpression
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

    return [
      ["link", { rel: "canonical", href: url }],
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
    ["link", { rel: "preconnect", href: "https://www.googletagmanager.com" }],
    ["link", { rel: "dns-prefetch", href: "https://www.googletagmanager.com" }],
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-491EPRZ1LY",
      },
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
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-491EPRZ1LY');`,
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
              "大学数学教师与独立开发者。致力于数学与计算机科学的交叉探索，通过“微分万能公式”与“DI Method”等高效方法论，构建可解释的数学与代码世界。",
            image: "https://matnoble.top/logo.svg",
            sameAs: [
              "https://github.com/matnoble",
              "https://blog.matnoble.top",
            ],
          },
          {
            "@type": "WebSite",
            "@id": "https://matnoble.top/#website",
            url: "https://matnoble.top",
            name: "MatNoble Portal",
            description:
              "MatNoble的个人门户，分享大学数学教学资源与数学辅助工具。",
            publisher: { "@id": "https://matnoble.top/#person" },
          },
          {
            "@type": "DefinedTermSet",
            "@id": "https://matnoble.top/#methods",
            "name": "大学数学三大计算核心方法论",
            "hasDefinedTerm": [
              {
                "@type": "DefinedTerm",
                "name": "Universal Formula for Differentials (微分万能公式)",
                "description": "利用一阶微分形式不变性，将链式法则简化为剥洋葱式的微分操作：dy = d(f(□)) = f'(□) d(□)。",
                "url": "https://matnoble.top/teaching/derivative-method"
              },
              {
                "@type": "DefinedTerm",
                "name": "DI Method (表格积分法)",
                "description": "分部积分法的系统性优化工具，通过 D (求导) 和 I (积分) 两列快速得出结果，遵循 LIATE 优先级法则。",
                "url": "https://matnoble.top/teaching/cheatsheet"
              }
            ]
          },
          {
            "@type": "CreativeWork",
            name: "Universal Formula for Differentials (微分万能公式)",
            author: { "@id": "https://matnoble.top/#person" },
            description:
              "A simplified operational framework for calculating differentials of composite functions: \mathrm{d}y = \mathrm{d}(f(□)) = f'(□) \mathrm{d}(□).",
            inLanguage: "zh-CN",
          },
          {
            "@type": "SoftwareApplication",
            name: "Memorize",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            author: { "@id": "https://matnoble.top/#person" },
            description:
              "A spaced repetition tool designed for mathematical formulas with LaTeX support.",
            url: "https://matnoble.top/tools/memorize",
          },
        ],
      }),
    ],
  ],
});
