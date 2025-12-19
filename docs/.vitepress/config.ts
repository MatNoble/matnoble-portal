import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'MatNoble',
  description: '大学数学教师 MatNoble 的个人门户。分享工科数学教学（微积分、线性代数）与学习方法，提供数学辅助工具。',
  
  markdown: {
    math: true
  },

  // 关键 SEO 配置：生成 sitemap
  sitemap: {
    hostname: 'https://matnoble.top'
  },

  themeConfig: {
    // logo: '/logo.svg', // 注释掉此处，防止导航栏出现双重 Logo (已通过 Logo.vue 组件自定义)
    siteTitle: false, 
    // 顶部导航
    nav: [
      { text: '首页', link: '/' },
      { text: '大学数学教学', link: '/teaching/' },
      { text: '常见问题', link: '/faq' },
      { text: '数学工具', link: '/tools/' },
      { text: '技术博客', link: 'https://blog.matnoble.top' }, // 外部链接区分门户与博客
      { text: '关于', link: '/about' }
    ],

    // 侧边栏配置
    sidebar: {
      '/teaching/': [
        {
          text: '大学数学教学',
          items: [
            { text: '教学体系概览', link: '/teaching/' },
            { text: '工科微积分', link: '/teaching/calculus' },
            { text: '线性代数', link: '/teaching/linear-algebra' },
            { text: '常见问题 (FAQ)', link: '/faq' }
          ]
        }
      ],
      '/tools/': [
        {
          text: '数学工具',
          items: [
            { text: '工具集概览', link: '/tools/' },
            { text: 'Memorize 记忆助手', link: '/tools/memorize' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/matnoble' },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Telegram</title><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zM5.934 12.088c.492-2.103 3.033-3.146 5.357-4.144 2.872-1.233 5.486-2.353 5.486-2.353s1.102-.455 1.018.618c-.033.432-.237 1.763-.44 3.14-.306 2.072-.638 4.31-.815 5.093-.195.86-.55 1.144-.55 1.144s-.305.28-.627.05c-.322-.23-.847-.574-1.39-.932-.474-.313-1.074-.71-1.425-1.002-.27-.225-.492-.542-.144-.84.07-.06.27-.243.51-.462 1.353-1.237 2.152-1.968 2.152-1.968.21-.193.394-.525-.07-.525-.11 0-.312.04-.63.25-.43.284-3.12 2.064-4.22 2.793-.412.272-.782.406-1.11.398-.36-.008-1.047-.215-1.56-.38-.63-.203-1.132-.31-1.087-.655.023-.18.264-.366.723-.556z"/></svg>'
        },
        link: 'https://t.me/HUSTMatNoble'
      }
    ],

    footer: {
      message: '以数学训练思维，用技术改善学习与生活。',
      copyright: 'Copyright © 2025 MatNoble'
    }
  },

  // --- SEO & Indexing 核心配置 ---
  lastUpdated: true, // 显示最后更新时间，提示爬虫内容鲜活
  cleanUrls: true,   // 生成无 .html 后缀的干净链接 (对 SEO 更友好)

  // 动态注入 Canonical URL (规范链接)，防止重复内容降权
  transformHead: ({ pageData }) => {
    const canonicalUrl = `https://matnoble.top/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
    return [
      ['link', { rel: 'canonical', href: canonicalUrl }]
    ]
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico', sizes: 'any' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: '/favicon.png' }],
    // IndexNow 验证
    ['meta', { name: 'indexnow-key', content: '7c6a9686414144409395982823617300' }],
    // Google Search Console 验证
    ['meta', { name: 'google-site-verification', content: 'OeFbtbYCwGN3Bnb3MSOm50bnnxInp9jj_bQT5vOIBPo' }],
    // Bing Webmaster Tools 验证
    ['meta', { name: 'msvalidate.01', content: '1267ABE5F71B3CA9AF5AF169FD89E296' }],
    
    ['meta', { name: 'keywords', content: '大学数学,微积分,线性代数,数学教学,数学学习方法,工科数学,数学工具,数学教师,MatNoble' }],
    // 引入 Google Fonts: Outfit (几何无衬线，适合 Logo)
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@500;700&family=Inter:wght@400;500;600&display=swap', rel: 'stylesheet' }],
    
    // --- Open Graph (社交媒体/AI 引用卡片) ---
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'MatNoble' }],
    ['meta', { property: 'og:image', content: 'https://matnoble.top/logo.svg' }], // 确保有一个高质量的 PNG 用于预览
    ['meta', { property: 'twitter:card', content: 'summary' }],

    // --- JSON-LD (Schema.org 结构化数据 - AI 知识图谱核心) ---
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "MatNoble",
      "url": "https://matnoble.top",
      "jobTitle": "University Mathematics Teacher",
      "knowsAbout": [
        "Calculus", 
        "Linear Algebra", 
        "Universal Formula for Differentials (微分万能公式)", 
        "DI Method (Tabular Integration)",
        "Educational Technology", 
        "Web Development"
      ],
      "description": "大学数学教师与独立开发者。专注于工科数学教学研究，通过“微分万能公式”与“DI Method”等高效方法论，构建可解释的数学世界。",
      "image": "https://matnoble.top/logo.svg",
      "sameAs": [
        "https://github.com/matnoble",
        "https://blog.matnoble.top"
      ]
    })]
  ]
})
