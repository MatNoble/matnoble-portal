---
title: HUST-cnlogo (华中科技大学徽标 LaTeX 版)
description: 华中科技大学 LaTeX 版徽标分享，修复官方配色、清晰度及排版对齐问题。
image: https://raw.githubusercontent.com/MatNoble/hust-cnlogo/master/images/svg/hustcwhole.svg
---

# HUST-cnlogo

**华中科技大学 LaTeX 版徽标 (Official Color & Vector)**

这是我在大学期间开发的一个开源项目，用于在 LaTeX 文档中绘制华中科技大学徽标。

[![GitHub stars](https://img.shields.io/github/stars/MatNoble/hust-cnlogo?style=social)](https://github.com/MatNoble/hust-cnlogo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 为什么需要这个项目？

在 LaTeX 排版中，徽标的清晰度和配色会影响文档观感。原始 `cnlogo` 宏包中的华中科技大学徽标主要有以下问题：
1. **配色偏差**: 与官方标准色不符。
2. **边缘锯齿**: 位图渲染导致高分辨率下清晰度不足。
3. **排版缺陷**: 英文校名中缺失了 'OF' 单词，且中英文对齐不够美观。

## 主要特性

- **官方配色修正**: 参考 [官方配色标准](https://github.com/MatNoble/hust-cnlogo/blob/master/images/official.png)，调整打印与显示效果。
- **矢量绘制**: 采用 TikZ 绘制与 SVG 路径优化，适合不同尺寸的文档使用。
- **排版对齐优化**: 修复了英文校名拼写错误，重构了中英文对齐逻辑。
- **Beamer 集成**: 可配合 [HUSTMatNobleBeamer](https://github.com/MatNoble/HUSTMatNobleBeamer) 模板使用。

## 📥 安装与使用

项目已托管于 GitHub，你可以直接下载 `.sty` 文件或克隆仓库：

```bash
git clone https://github.com/MatNoble/hust-cnlogo.git
```

在你的 LaTeX 文档中引用：

```latex
\usepackage{hust_cnlogo}
...
\hustlogo[scale=1.5] % 渲染官方校标
```

## 🔗 相关资源

- [说明文档 (PDF)](https://github.com/MatNoble/hust-cnlogo/blob/master/hust_cnlogo.pdf)
- [GitHub 仓库](https://github.com/MatNoble/hust-cnlogo)

---

> 该项目目前作为独立包分发，欢迎在 GitHub 上提交建议或 PR。
