---
title: Memorize - 数学公式记忆工具
description: 面向数学学习者的间隔重复记忆工具，支持 LaTeX 公式渲染。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Memorize 支持 LaTeX 数学公式吗？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "是的，Memorize 支持 LaTeX 公式渲染，可录入常见数学公式。不同设备上的显示效果取决于浏览器环境。"
            }
          },
          {
            "@type": "Question",
            "name": "Memorize 是免费的吗？",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "是的，Memorize 是一个免费的 Web 应用，无需下载安装，打开浏览器即可使用。"
            }
          }
        ]
      }
---

# Memorize 记忆助手

<div class="tip custom-block" style="padding: 20px; border-radius: 8px; background-color: var(--vp-c-brand-soft); border: 1px solid var(--vp-c-brand);">
  <p style="font-size: 1.2em; font-weight: bold; margin: 0; color: var(--vp-c-brand-1);">
    使用间隔重复方法复习数学公式。
  </p>
</div>

**Memorize** 是面向大学数学学习的间隔重复 (Spaced Repetition) 记忆工具，用于整理并定期复习公式。

## 为什么选择 Memorize？

### 支持 LaTeX

Memorize 支持常用 LaTeX 数学公式录入和渲染。

- **示例**：可以录入并渲染：
  $$\mathrm{d}y=\mathrm{d}(f(\square))=f'(\square)\mathrm{d}(\square)$$

### 复习算法

基于 **SM-2 算法**，系统会根据掌握程度（简单、模糊、忘记）调整下一次出现的间隔。

### 轻量化与跨端

无需下载，打开浏览器即用。支持数据本地存储，保障隐私。

## 使用入口

::: info 推荐用法
在学习 [大学数学教学体系](/teaching/) 时，遇到核心公式可一键加入复习计划。
:::

<div style="margin: 30px 0; text-align: center;">
  <a href="https://memorize.matnoble.top" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 36px; background-color: var(--vp-c-brand); color: white; border-radius: 24px; font-weight: bold; text-decoration: none; font-size: 1.1em; transition: transform 0.2s;">
    立即开始记忆
  </a>
</div>

---

## 关联项目

- [数学工具集概览](/tools/)
- [技术博客：关于算法的实现细节](https://blog.matnoble.top)
