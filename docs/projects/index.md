---
title: 精选开源项目与学术工具列表 - MatNoble Portal
description: MatNoble 个人开源项目精选与技术实践展示。涵盖基于 Cloudflare Workers 的全栈 AI 语音合成平台 (TTS)、LaTeX 科技排版工具、高校考勤点名辅助插件以及交互式数学教学演示套件。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "开源项目 (Open Source Projects)",
        "description": "MatNoble 在 AI 语音、数学教学、LaTeX 排版及工具开发方面的开源实践。",
        "url": "https://matnoble.top/projects/",
        "hasPart": [
          {
            "@type": "SoftwareApplication",
            "name": "MatNoble-TTS",
            "description": "基于 Cloudflare Workers 的全栈 AI 语音处理平台与 AI 配音导演技能 (Audio Director Skill)。",
            "url": "https://speak.matnoble.top"
          },
          {
            "@type": "SoftwareApplication",
            "name": "极客智算 (GeekAI-Bot)",
            "description": "基于双云大模型的 Telegram 每日高信噪比科技资讯脱水智能播发系统。",
            "url": "https://t.me/geekai_daily"
          },
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
          },
          {
            "@type": "WebApplication",
            "name": "MANIFOLD (流形空间)",
            "description": "基于 Three.js 与纯程序化几何的沉浸式数学曲面与拓扑流形实验场。",
            "url": "https://matnoble.top/manifold/"
          }
        ]
      }
---

# 开源项目

这里记录我在 AI 语音工程、数学教学、LaTeX 排版和工具开发方面的一些开源实践。

---

## AI 与全栈开发

### [MatNoble-TTS](https://speak.matnoble.top)
基于 Cloudflare Workers 的全栈 AI 语音处理平台，集成高拟真文字转语音（TTS）、语音转文字（STT）、D1 边缘额度流控与 **AI 配音导演技能 (Audio Director Skill)**。
- [详细介绍](/projects/tts) | [🌐 在线体验](https://speak.matnoble.top) | [⚡ 配套 Skill 仓库](https://github.com/MatNoble/matnoble-tts-skill)
- **Agent 一键集成**：`npx skills add MatNoble/matnoble-tts-skill`

### [极客智算 GeekAI-Bot](https://t.me/geekai_daily)
专为极客与开发者打造的 Telegram 高信噪比资讯智能播发系统。定时聚合多源科技资讯与 GitHub Trending，基于 Groq (Qwen) 与 Google Gemini 双云容灾大模型进行 3 句话极简脱水提炼，杜绝公关水文。
- [📢 订阅频道](https://t.me/geekai_daily) | [💬 读者交流群](https://t.me/geekai_chat) | [✍️ 深度解读文章](https://blog.matnoble.top/tech/ai/geekai-daily-intro/) | [💻 GitHub 仓库](https://github.com/MatNoble/geekai-bot)
- **核心特性**：强制 3 句话脱水结构 · A股/美股与科技七巨头智能晨报 · 节假日休市自适应 · 夜间智能免打扰

---

## LaTeX 与学术排版

### [HUST-cnlogo](https://github.com/MatNoble/hust-cnlogo)
华中科技大学徽标的 LaTeX 精确修正版。修复了原始 `cnlogo` 的配色、清晰度及拼写错误。
- [详细介绍](/projects/hust-cnlogo) | [GitHub 仓库](https://github.com/MatNoble/hust-cnlogo)

### [HUSTMatNobleBeamer](https://github.com/MatNoble/HUSTMatNobleBeamer)
基于 HUST 官方视觉元素的 Beamer 幻灯片模板，可用于课程讲义、学术报告和教案展示。
- [GitHub 仓库](https://github.com/MatNoble/HUSTMatNobleBeamer)

---

## 创意编程与数学视觉

### [流形空间 MANIFOLD](/manifold/)
基于 Three.js 与纯参数方程构建的沉浸式拓扑曲面画廊。涵盖莫比乌斯带、克莱因瓶、Enneper 极小曲面、Dini 伪球面与洛伦兹混沌吸引子，支持实时参数形变与深空光影交互。
- [🌌 沉浸体验](/manifold/)

---

## 教学辅助工具

### [点名光标 Roll Call Beacon](/roll-call-beacon/)
面向高校课堂的浏览器点名辅助扩展。它在本地读取考勤页面中的学生名单，支持随机抽样和高亮显示。
- [详细介绍与下载](/roll-call-beacon/) | [隐私政策](/roll-call-beacon/privacy)


