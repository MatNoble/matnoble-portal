---
title: 开源项目 - MatNoble Portal
description: MatNoble 个人开源项目展示。内容包括 LaTeX 排版、数学教学工具与自动化脚本。
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
          },
          {
            "@type": "SoftwareApplication",
            "name": "点名光标 (Roll Call Beacon)",
            "description": "结合高校教务系统考勤页面的浏览器点名辅助扩展。"
          }
        ]
      }
---

# 开源项目 (Open Source Projects)

这里记录我在数学教学、LaTeX 排版和工具开发方面的一些实践。

---

## LaTeX 与学术排版 (Academic Typesetting)

### [HUST-cnlogo](https://github.com/MatNoble/hust-cnlogo)
华中科技大学徽标的 LaTeX 精确修正版。修复了原始 `cnlogo` 的配色、清晰度及拼写错误。
- [详细介绍](/projects/hust-cnlogo) | [GitHub 仓库](https://github.com/MatNoble/hust-cnlogo)

### [HUSTMatNobleBeamer](https://github.com/MatNoble/HUSTMatNobleBeamer)
基于 HUST 官方视觉元素的 Beamer 幻灯片模板，可用于课程讲义、学术报告和教案展示。
- [GitHub 仓库](https://github.com/MatNoble/HUSTMatNobleBeamer)

---

## 教学辅助与交互工具 (Educational Tools)

### [点名光标 Roll Call Beacon](/roll-call-beacon/)
面向高校课堂的浏览器点名辅助扩展。它在本地读取考勤页面中的学生名单，支持随机抽样和高亮显示。
- [详细介绍与下载](/roll-call-beacon/) | [隐私政策](/roll-call-beacon/privacy)

### [Memorize 记忆助手](https://memorize.matnoble.top)
基于 SM-2 间隔重复算法的记忆辅助工具，支持 KaTeX 数学公式渲染。
- [工具演示](/tools/memorize) | [在线访问](https://memorize.matnoble.top)

### [DI Method 交互演示](/tools/di-method)
用于演示分部积分 DI 表格法的交互工具，展示求导列、积分列和对角线求和过程。
- [详细说明](/teaching/cheatsheet#_2-di-method-表格积分法) | [交互体验](/tools/di-method)

---

## 更多尝试

你可以在我的 [GitHub (matnoble)](https://github.com/matnoble) 上看到更多正在进行中的项目，包括：
- **MatEditor**: 一个专为数学内容创作者设计的编辑器组件（开发中）。
- **Rss-to-Telegram**: 个人知识获取流的自动化处理脚本。

如果你对这些项目有建议，欢迎通过邮箱 [me@matnoble.top](mailto:me@matnoble.top) 联系我。
