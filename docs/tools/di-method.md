---
title: DI 表格法交互演示 | MatNoble
description: 交互式学习分部积分法的系统性优化工具 —— DI Method。通过逐步推演，掌握表格积分法的核心逻辑。
structuredData:
  mathSolver:
    name: "DI Method Integration Solver"
    description: "Step-by-step solver for integration by parts using the DI Method."
    potentialAction:
      - type: "SolveAction"
        target: "https://matnoble.top/tools/di-method"
        mathExpression: "integral of x*exp(x) dx"
  softwareApp:
    name: "DI Method Interactive Solver"
    category: "EducationalApplication"
    description: "An interactive tool to demonstrate and solve integration problems using the DI Table method."
---

# DI 表格法交互演示

**DI Method (Differentiate & Integrate Method)** 是对分部积分法的一种高效、直观的简化。它通过将“求导”与“积分”过程解耦，极大地降低了计算过程中的符号错误率，特别适合处理需要多次分部积分的题目。

::: tip 提示
点击下方的题目切换例题，点击 **“下一步”** 观察表格是如何构建的。
:::

<DISolver />

---

## 💡 如何使用 DI 表格法？

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
    *   按照**对角线**方向相乘：$(Row_1, D) 	imes (Row_2, I)$，带上 $Row_1$ 的符号。
    *   如果有水平残余项，则作为积分处理：$\pm \int (LastRow, D 	imes I) dx$。
