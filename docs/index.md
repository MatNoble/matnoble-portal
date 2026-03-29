---
layout: page
title: MatNoble
breadcrumb: 首页
titleTemplate: 大学数学教学与技术探索
description: 大学数学教师MatNoble的个人门户。专注于数学教学研究（微积分、线性代数），分享数学学习方法，开发数学辅助工具，致力于以数学训练思维，用技术改善学习与生活。
---

<HighFidelityHero 
  name="MatNoble"
  text="Mathematics as the Core."
  tagline="以数学为原点，用代码重构可解释的世界。致力于数学与计算机科学的交叉探索，构建可解释的方法论。"
  :actions="[
    { theme: 'brand', text: '获取微积分 CheatSheet', link: '/teaching/cheatsheet' },
    { theme: 'alt', text: '学习微分万能公式', link: '/teaching/derivative-method' }
  ]"
/>

<ScholarlyFeatures
  :features="[
    {
      title: '大学数学与考研实战',
      details: '专为应试与思维训练设计。解析 <b>微分万能公式</b> 与 <b>DI 表格法</b>。助力考研，强化计算精度。',
      link: '/teaching/',
      linkText: '获取解题法',
      icon: '<path d=&quot;M22 10v6M2 10l10-5 10 5-10 5z&quot;/><path d=&quot;M6 12v5c3 3 9 3 12 0v-5&quot;/>'
    },
    {
      title: '数学辅助工具箱',
      details: '推出 <b>Memorize 记忆助手</b>，基于 <b>Anki 算法</b>。支持 <b>LaTeX 公式</b>。加速复习效率，强化长期记忆。',
      link: '/tools/',
      linkText: '开始使用',
      icon: '<path d=&quot;M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z&quot;/>'
    },
    {
      title: '关于 MatNoble',
      details: '高校讲师 / 开发者。擅长 <b>数字化教学</b>，将抽象概念转化为可交互代码。分享像工程师一样思考数学的心法。',
      link: '/about',
      linkText: '认识作者',
      icon: '<path d=&quot;M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2&quot;/><circle cx=&quot;12&quot; cy=&quot;7&quot; r=&quot;4&quot;/>'
    }
  ]"
/>

<div class="scholarly-body">

## 知识图谱与学习路径

::: tip 学习指南
顺着图谱的分支，从基础公理爬向工程巅峰。建议从 **微积分底座** 开始。
:::

- **核心底座：微积分 (Calculus)**
  - ├── [微积分三大计算](/teaching/calculus) —— *系统复习攻略*
  - ├── [微分万能公式](/teaching/derivative-method) —— *链式法则简化方案*
  - └── [DI 表格积分法](/teaching/cheatsheet#_2-di-method-表格积分法) —— *分部积分优化工具*
- **进阶骨架：线性代数与几何 (Geometry)**
  - ├── [几何直观：矩阵即变换](/teaching/linear-algebra) —— *建立高维空间直觉*
  - ├── [空间解析几何 3D 实验室](/teaching/space-geometry-lab) —— *可视化探究曲面*
  - └── [SVD 奇异值分解](/teaching/linear-algebra) —— *降维的几何本质*
- **实战武器：工具箱 (Tools)**
  - ├── [Memorize 记忆助手](https://memorize.matnoble.top) —— *对抗遗忘*
  - └── [DI Method 交互演示](/tools/di-method) —— *看清表格每一步*

---

## 核心方法论 (Methodologies)

### 微分万能公式 (Universal Formula)
针对复合函数求导的痛点，提炼出操作性极强的微分公式：$\mathrm{d}y=\mathrm{d}(f(\square))=f'(\square)\mathrm{d}(\square)$。该方法利用一阶微分形式不变性，将复杂的链式法则转化为直观的填空式操作，在隐函数及参数方程求导中具有极高效率。

### DI Method (表格积分法)
针对分部积分法的效率瓶颈，推广 [**DI Method**](/teaching/cheatsheet)。通过表格化管理求导与积分序列，极大提升了混合函数的积分速度与准确率，是考研数学中“秒杀”计算题的利器。

</div>

<style scoped>
.scholarly-body {
  max-width: 800px;
  margin: 64px auto 0;
  padding: 0 24px;
}

:deep(.vp-doc) h2 {
  font-family: var(--vp-font-family-heading);
  text-align: center;
  border-top: none;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

:deep(.vp-doc) h3 {
  font-family: var(--vp-font-family-heading);
  font-size: 1.8rem;
  margin-top: 3rem;
}
</style>
