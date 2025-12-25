---
title: 微积分公式大全 & DI表格积分法速查表 (可打印 PDF)
description: 专为工科大学生设计的期末复习/考研数学速查表。包含“微分万能公式”操作流程、“分部积分 DI 表格法”优先级口诀。支持 A4 打印与 PDF 导出。
layout: doc
---

<script setup>
const printPage = () => {
  window.print()
}
</script>

<div class="print-header">
  <div class="cs-header-inner">
    <div class="cs-header-left">
      <h1 class="cs-header-title">核心心法速查表</h1>
      <p class="cs-header-subtitle">Engineering Math Core Methods Cheat Sheet</p>
    </div>
    <div class="cs-header-right">
      <span class="cs-header-brand">MatNoble</span>
      <br>
      <span class="cs-header-url">matnoble.top</span>
    </div>
  </div>
</div>

<div class="no-print" style="margin-bottom: 2rem; padding: 1rem; background-color: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider);">
  <p style="margin: 0 0 1rem 0;">💡 <b>说明：</b>此页面专为打印设计（支持导出为 A4 PDF）。点击下方按钮或使用浏览器打印功能 (Ctrl+P)。</p>
  <button @click="printPage" style="background-color: var(--vp-c-brand); color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: bold;">🖨️ 打印 / 另存为 PDF</button>
</div>

## 1. 微分万能公式 (Universal Formula)

::: tip 核心定义
利用**一阶微分形式不变性**，将链式法则转化为“填空游戏”。
$$\mathrm{d}y=\mathrm{d}(f(\square))=f'(\square)\mathrm{d}(\square)$$
:::

### 💡 操作流程

1.  **观察**：识别最外层函数 $f$ 和内层函数 $\square$。
2.  **剥皮**：对最外层求导 $f'(\square)$，保留内层不动。
3.  **填空**：在微分号 $\mathrm{d}$ 后填入内层函数 $\square$，继续对 $\mathrm{d}(\square)$ 重复上述步骤。

### 🔥 实战示例

求 $y=\ln(\sin(e^x))$ 的微分：

$$\begin{aligned}\mathrm{d}y & = \mathrm{d}(\ln(\sin(e^x)))\\&=\frac{1}{\sin(e^x)}\mathrm{d}(\sin(e^x))\quad\text{(剥去 ln)}\\&=\frac{1}{\sin(e^x)}\cos(e^x)\mathrm{d}(e^x)\quad\text{(剥去 sin)}\\&=\cot(e^x)e^x\mathrm{d}x\quad\text{(剥去 e)}\end{aligned}$$

> 💡 **深度学习**：想要掌握隐函数、参数方程求导等更高级的技巧？查看 [**微分万能公式详解**](/teaching/derivative-method)。

---

## 2. DI Method (表格积分法)

::: tip 核心定义
分部积分法 $\int u\mathrm{d}v=uv-\int v\mathrm{d}u$ 的**表格化**版本，特别适用于多次分部积分。
:::

### 💡 核心法则 (LIATE)

选取 **D 列 (求导)** 和 **I 列 (积分)** 的优先级：

1.  **L**ogarithmic (对数) $\to$ 优先 D
2.  **I**nverse Trig (反三角) $\to$ 优先 D
3.  **A**lgebraic (代数/多项式) $\to$ 视情况 (通常 D)
4.  **T**rigonometric (三角) $\to$ I
5.  **E**xponential (指数) $\to$ I

### 🔥 实战示例

求 $\int x^2 e^{2x}\mathrm{d}x$：

| 符号 | **D** (求导) | **I** (积分)        |
| :--: | :----------- | :------------------ |
| $+$  | $x^2$        | $e^{2x}$            |
| $-$  | $2x$         | $\frac{1}{2}e^{2x}$ |
| $+$  | $2$          | $\frac{1}{4}e^{2x}$ |
| $-$  | $0$          | $\frac{1}{8}e^{2x}$ |

**结果** (对角线相乘求和)：
$$\int x^2 e^{2x}\mathrm{d}x=\left(x^2\cdot\frac{1}{2}e^{2x}\right)-\left(2x\cdot\frac{1}{4}e^{2x}\right)+\left(2\cdot\frac{1}{8}e^{2x}\right)+C$$
$$=\frac{1}{2}x^2 e^{2x}-\frac{1}{2}x e^{2x}+\frac{1}{4}e^{2x}+C$$

---

<CheatSheetFooter />

<style>
@media print {
  .no-print {
    display: none !important;
  }
  @page {
    margin: 1cm;
  }
}
</style>
