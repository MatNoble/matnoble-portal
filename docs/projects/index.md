---
title: 开源项目 - MatNoble Portal
description: MatNoble 个人开源项目展示。涵盖 LaTeX 学术排版、数学教学工具与自动化脚本。通过代码重构数学直觉，为 Huster 及数学爱好者提供工业级工具支持。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "开源项目 (Open Source Projects)",
        "description": "MatNoble 在数学教学、LaTeX 排版及工具开发方面的开源实践。",
        "url": "https://matnoble.top/projects/",
        "hasPart": [
          {
            "@type": "CreativeWork",
            "name": "HUST-cnlogo",
            "description": "华中科技大学徽标的 LaTeX 精确修正版。"
          },
          {
            "@type": "SoftwareApplication",
            "name": "HUSTMatNobleBeamer",
            "description": "基于 HUST 官方视觉元素的 Beamer 幻灯片模板。"
          }
        ]
      }
---

# 开源项目 (Open Source Projects)

这里记录了我作为 **独立开发者** 在数学教学、LaTeX 排版及工具开发方面的一些实践。通过代码，我试图将数学的严谨与排版的美学传递给更多人。

---

## LaTeX 与学术排版 (Academic Typsetting)

### [HUST-cnlogo](https://github.com/MatNoble/hust-cnlogo)
华中科技大学徽标的 LaTeX 精确修正版。修复了原始 `cnlogo` 的配色、清晰度及拼写错误。
- [详细介绍](/projects/hust-cnlogo) | [GitHub 仓库](https://github.com/MatNoble/hust-cnlogo)

### [HUSTMatNobleBeamer](https://github.com/MatNoble/HUSTMatNobleBeamer)
基于 HUST 官方视觉元素的 Beamer 幻灯片模板。专为学术报告、教案展示设计，集成上述 `hust-cnlogo` 优化版徽标。
- [GitHub 仓库](https://github.com/MatNoble/HUSTMatNobleBeamer)

---

## 教学辅助与交互工具 (Educational Tools)

### [Memorize 记忆助手](https://memorize.matnoble.top)
基于 SM-2 间隔重复算法的记忆辅助工具。深度集成 KaTeX 渲染，完美支持数学公式，助你对抗遗忘。
- [工具演示](/tools/memorize) | [在线访问](https://memorize.matnoble.top)

### [DI Method 交互演示](/tools/di-method)
针对微积分中分部积分法的系统性优化工具。动态展示 DI 表格的每一步推演过程，是考研数学计算的利器。
- [详细说明](/teaching/cheatsheet#_2-di-method-表格积分法) | [交互体验](/tools/di-method)

---

## 更多尝试

你可以在我的 [GitHub (matnoble)](https://github.com/matnoble) 上看到更多正在进行中的项目，包括：
- **MatEditor**: 一个专为数学内容创作者设计的编辑器组件（开发中）。
- **Rss-to-Telegram**: 个人知识获取流的自动化处理脚本。

> "编程是现代数学教师的第二语言。" —— 如果你对这些项目有任何想法，欢迎通过邮箱 [me@matnoble.top](mailto:me@matnoble.top) 与我交流。
