---
title: DI 表格法交互演示
description: 用交互方式学习 DI Method。通过逐步推演，理解表格积分法如何组织分部积分计算。
structuredData:
  mathSolver:
    name: "DI Method Integration Solver"
    description: "Step-by-step solver for integration by parts using the DI Method."
    potentialAction:
      - type: "SolveMathAction"
        target: "https://matnoble.top/tools/di-method"
  softwareApp:
    name: "DI Method Interactive Solver"
    category: "EducationalApplication"
    description: "An interactive tool to demonstrate and solve integration problems using the DI Table method."
---

# DI 表格法交互演示

**DI Method (Differentiate & Integrate Method)** 是分部积分法的一种表格化写法。它把“求导”和“积分”分成两列，并用交替符号组织计算步骤，适合处理需要多次分部积分的题目。

::: tip 提示
点击下方的题目切换例题，点击 **“下一步”** 观察表格是如何构建的。
:::

<ClientOnly>
  <DISolver />
</ClientOnly>

---

## 如何使用 DI 表格法？

1.  **选角 (LIATE 法则)**：
    *   **L**ogarithmic (对数函数)
    *   **I**nverse Trigonometric (反三角函数)
    *   **A**lgebraic (代数/多项式函数)
    *   **T**rigonometric (三角函数)
    *   **E**xponential (指数函数)
    *   优先级高的（排在前面的）作为 **D 列**，优先级低的作为 **I 列**。

2.  **构建表格**：
    *   第一列：写正负号，从 `+` 开始，交替出现。
    *   第二列 (D)：对选定的函数不断求导。
    *   第三列 (I)：对选定的函数不断积分。

3.  **停止条件**：
    *   **归零型**：D 列出现 $0$ 时停止。
    *   **循环型**：D 和 I 的乘积出现初始形式（或易于处理的形式）时停止。

4.  **组装答案**：
    *   按照**对角线**方向相乘：$(Row_1, D) \times (Row_2, I)$，带上 $Row_1$ 的符号。
    *   如果有水平残余项，则作为积分处理：$\pm \int (\text{LastRow}, D \times I) \mathrm{d}{x}$。
