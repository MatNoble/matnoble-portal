import { writeFileSync, mkdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { Feed } from 'feed'
import { createContentLoader, type SiteConfig } from 'vitepress'

const baseUrl = 'https://matnoble.top'

export async function genFeed(config: SiteConfig) {
  const feed = new Feed({
    title: 'MatNoble',
    description: '大学数学教师 MatNoble 的个人门户。专注于微积分三大计算（微分万能公式、DI表格法）与线性代数教学，分享数学学习方法与辅助工具。',
    id: baseUrl,
    link: baseUrl,
    language: 'zh-CN',
    image: `${baseUrl}/logo.svg`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright: 'Copyright (c) 2025-2026 MatNoble',
    author: {
      name: 'MatNoble',
      link: 'https://matnoble.top'
    }
  })

  const posts = await createContentLoader('**/*.md', {
    render: true
  }).load()

  // 过滤掉索引页和 404
  const filteredPosts = posts.filter(p => p.url !== '/' && !p.url.endsWith('/') && !p.url.includes('404'))

  filteredPosts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date || Date.now())
    const dateB = new Date(b.frontmatter.date || Date.now())
    return +dateB - +dateA
  })

  for (const { url, frontmatter, html } of filteredPosts) {
    // 尝试获取文件最后修改时间作为日期
    let postDate = frontmatter.date ? new Date(frontmatter.date) : null
    
    if (!postDate) {
      try {
        const filePath = path.join(config.srcDir, url.replace(/^\//, '') + '.md')
        const stats = statSync(filePath)
        postDate = stats.mtime
      } catch (e) {
        postDate = new Date()
      }
    }

    // 规范化为日期精度 (当天零点)
    postDate.setHours(0, 0, 0, 0)

    feed.addItem({
      title: frontmatter.title || '无题',
      id: `${baseUrl}${url}`,
      link: `${baseUrl}${url}`,
      description: frontmatter.description,
      content: html,
      author: [
        {
          name: 'MatNoble',
          link: 'https://matnoble.top'
        }
      ],
      date: postDate
    })
  }

  mkdirSync(config.outDir, { recursive: true })
  writeFileSync(path.join(config.outDir, 'feed.xml'), feed.rss2())
  writeFileSync(path.join(config.outDir, 'atom.xml'), feed.atom1())
}
