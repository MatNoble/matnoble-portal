---
title: 数学辅助工具 - MatNoble Portal
description: MatNoble 开发的数学学习辅助工具集，包含间隔重复记忆、DI 表格法演示和若干可视化组件。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "数学辅助工具箱",
        "description": "数学学习辅助工具集，包含 Memorize 助手与 DI 表格法演示。",
        "url": "https://matnoble.top/tools/",
        "hasPart": [
          {
            "@type": "SoftwareApplication",
            "name": "Memorize 记忆助手",
            "applicationCategory": "EducationApplication",
            "operatingSystem": "Web",
            "description": "基于艾宾浩斯遗忘曲线的间隔重复公式记忆工具。"
          },
          {
            "@type": "SoftwareApplication",
            "name": "DI 表格法交互演示",
            "applicationCategory": "EducationApplication",
            "operatingSystem": "Web",
            "description": "可视化分部积分推导与 DI Table 自动化生成工具。"
          }
        ]
      }
---

# 数学辅助工具箱

这里收录若干面向数学学习的辅助工具，主要用于公式记忆、计算过程演示和几何可视化。

## 设计原则

这些工具遵循三个设计原则：
1. **轻量使用**：无需安装，打开网页即可使用。
2. **方法明确**：围绕间隔重复、数值模拟或步骤演示等具体场景设计。
3. **公式支持**：支持 LaTeX 渲染，便于展示数学表达式。

---

## 在线工具集

### [DI 表格法交互演示](./di-method)
分部积分法的表格化演示。

- **状态**: 已上线 (MVP)
- **主要逻辑**: 生成 DI 推导步骤，并展示对角线连线。
- **功能**: 包含 LIATE 选角练习、SVG 动态连线、归零型/循环型例题演示。
- **[查看演示 ➜](./di-method)**

### [Memorize 记忆助手](./memorize)
基于间隔重复的公式记忆工具。

- **状态**: 已上线 (v1.0)
- **主要逻辑**: 结合 **艾宾浩斯遗忘曲线** 的间隔重复算法。
- **功能**: 支持 LaTeX 渲染、跨端适配和本地存储。
- **适用场景**: 考研数学公式复习、大一高数定义背诵。
- **[立即使用 ➜](./memorize)**

---

## 实验室与资源 (Resources)

除了计算工具，也整理了一些与学习和科研相关的资源：
- **[学术资源互联指南](./academic-resources)**：整理 Google Scholar、arXiv 及常用 AI 工具的访问与使用建议。
- **LaTeX 自动出题脚本**：基于 Python 随机生成符合大纲的练习题。
- **微积分可视化组件**：基于 Vue 的交互式函数绘图插件。

> 访问 [GitHub (matnoble)](https://github.com/matnoble) 获取源码。

## 未来路线图 (Roadmap)
- [ ] **DI Method 练习生成器**：自动生成分部积分练习题并给出步骤。
- [ ] **线性代数几何变换演示**：基于 WebGL 的三维矩阵变换演示。
