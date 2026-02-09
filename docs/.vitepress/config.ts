import { defineConfig } from "vitepress";
import webfontDl from "vite-plugin-webfont-dl";

export default defineConfig({
  lang: "zh-CN",
  title: "MatNoble",
  description:
    "大学数学教师 MatNoble 的个人门户。专注于微积分三大计算（微分万能公式、DI表格法）与线性代数教学，分享数学学习方法与辅助工具。",

  markdown: {
    math: true,
  },

  vite: {
    plugins: [
      webfontDl([
        "https://fonts.googleapis.com/css2?family=Outfit:wght@500;700&family=Lora:ital,wght@0,400..700;1,400..700&family=Noto+Serif+SC:wght@400;700&display=swap",
      ]),
    ],
  },

  // 关键 SEO 配置：生成 sitemap
  sitemap: {
    hostname: "https://matnoble.top",
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
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zM5.934 12.088c.492-2.103 3.033-3.146 5.357-4.144 2.872-1.233 5.486-2.353 5.486-2.353s1.102-.455 1.018.618c-.033.432-.237 1.763-.44 3.14-.306 2.072-.638 4.31-.815 5.093-.195.86-.55 1.144-.55 1.144s-.305.28-.627.05c-.322-.23-.847-.574-1.39-.932-.474-.313-1.074-.71-1.425-1.002-.27-.225-.492-.542-.144-.84.07-.06.27-.243.51-.462 1.353-1.237 2.152-1.968 2.152-1.968.21-.193.394-.525-.07-.525-.11 0-.312.04-.63.25-.43.284-3.12 2.064-4.22 2.793-.412.272-.782.406-1.11.398-.36-.008-1.047-.215-1.56-.38-.63-.203-1.132-.31-1.087-.655.023-.18.264-.366.723-.556z"/></svg>',
        },
        link: "https://t.me/HUSTMatNoble",
      },
    ],

    footer: {
      message: "以数学训练思维，用技术改善学习与生活。",
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
      .replace(/\.md$/, "");

    const siteTitle = "MatNoble";
    const pageTitle = pageData.title;
    const title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;
    
    const description =
      pageData.description ||
      "大学数学教师 MatNoble 的个人门户。专注于微积分三大计算（微分万能公式、DI表格法）与线性代数教学，分享数学学习方法与辅助工具。";
    
    const image = pageData.frontmatter.image || "/social-card.svg"; 
    const imageUrl = image.startsWith("http")
      ? image
      : `https://matnoble.top${image}`;

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
    ["link", { rel: "icon", href: "/favicon.ico", sizes: "any" }],
    ["link", { rel: "icon", href: "/logo.svg", type: "image/svg+xml" }],
    ["link", { rel: "apple-touch-icon", href: "/favicon.png" }],
    // IndexNow 验证
    [
      "meta",
      { name: "indexnow-key", content: "7c6a9686414144409395982823617300" },
    ],
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

    [
      "meta",
      {
        name: "keywords",
        content:
          "微分计算, 导数计算, 微积分三大计算, 微分万能公式, DI表格积分法, 微积分公式大全, 大学数学复习, 工科数学, MatNoble, 高等数学速查表, 考研数学工具",
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
              "Educational Technology",
              "Web Development",
            ],
            description:
              "大学数学教师与独立开发者。专注于工科数学教学研究，通过“微分万能公式”与“DI Method”等高效方法论，构建可解释的数学世界。",
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
