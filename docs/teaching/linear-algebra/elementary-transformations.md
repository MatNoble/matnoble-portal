---
title: 初等变换的矩阵形式 | 线性代数直观教学
breadcrumb: 初等变换
description: 说明线性代数中的初等行变换与初等列变换。通过 Manim 动画演示交换（Swap）、倍乘（Stretch）与倍加（Shear）对应的矩阵乘法。
sidebar: false
aside: true
---

<ArticleHero 
  tag="线性代数"
  title="初等变换的直观理解" 
  description="初等变换用于描述矩阵的基本行列操作，也是高斯消元、求逆矩阵和矩阵方程求解的基础。"
/>

<ThreeOneQuote author="MatNoble">
  “左乘初等矩阵对应行变换，右乘初等矩阵对应列变换。”
</ThreeOneQuote>

在矩阵计算中，初等变换主要分为三类：交换、倍乘和倍加。需要记住的规则是：**左乘行，右乘列**。

## 1. 交换变换 (Swap)
*交换坐标轴的顺序。*

<ComparisonGrid>

<div class="comparison-item">

#### 行交换 (Row Swap)
左乘一个交换矩阵 $E_{ij}$，实现第 $i$ 行与第 $j$ 行对调。

$$
\begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} = \begin{bmatrix} 3 & 4 \\ 1 & 2 \end{bmatrix}
$$

<ManimVideo src="SwapRow.mp4" />

</div>

<div class="comparison-item">

#### 列交换 (Col Swap)
右乘一个交换矩阵 $E_{ij}$，实现第 $i$ 列与第 $j$ 列对调。

$$
\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix} = \begin{bmatrix} 2 & 1 \\ 4 & 3 \end{bmatrix}
$$

<ManimVideo src="SwapCol.mp4" />

</div>

</ComparisonGrid>

## 2. 倍乘变换 (Stretch)
*在特定维度上的拉伸或压缩。*

<ComparisonGrid>

<div class="comparison-item">

#### 行倍乘 (Row Stretch)
左乘对角矩阵，对特定行进行缩放。

$$
\begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} = \begin{bmatrix} 2 & 4 \\ 3 & 4 \end{bmatrix}
$$

<ManimVideo src="StretchRow.mp4" />

</div>

<div class="comparison-item">

#### 列倍乘 (Col Stretch)
右乘对角矩阵，对特定列进行缩放。

$$
\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} \begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 2 & 2 \\ 6 & 4 \end{bmatrix}
$$

<ManimVideo src="StretchCol.mp4" />

</div>

</ComparisonGrid>

## 3. 倍加变换 (Shear)
*消元法中的倍加变换可以看成保持面积/体积不变的错切。*

<ComparisonGrid>

<div class="comparison-item">

#### 行倍加 (Row Shear)
将一行的倍数加到另一行。

$$
\begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} = \begin{bmatrix} 7 & 10 \\ 3 & 4 \end{bmatrix}
$$

<ManimVideo src="ShearRow.mp4" />

</div>

<div class="comparison-item">

#### 列倍加 (Col Shear)
将一列的倍数加到另一列。

$$
\begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix} \begin{bmatrix} 1 & 2 \\ 0 & 1 \end{bmatrix} = \begin{bmatrix} 1 & 4 \\ 3 & 10 \end{bmatrix}
$$

<ManimVideo src="ShearCol.mp4" />

</div>

</ComparisonGrid>

## 4. 综合应用：求逆与方程求解
*初等变换常用于求逆矩阵、解线性方程组和处理矩阵方程。*

### 求逆矩阵 (Matrix Inversion)
求逆可以理解为寻找一组初等变换，将 $A$ 化为单位矩阵 $I$。

<ComparisonGrid>

<div class="comparison-item">

#### 行变换求逆
构造增广矩阵 $(A | I)$，通过行变换将其化为 $(I | A^{-1})$。

$$
E_n \dots E_1 A = I \implies A^{-1} = E_n \dots E_1 I
$$

<ManimVideo src="InverseRow.mp4" />

</div>

<div class="comparison-item">

#### 列变换求逆
构造增广矩阵 $\begin{bmatrix} A \\ \hline I \end{bmatrix}$，通过列变换将其化为 $\begin{bmatrix} I \\ \hline A^{-1} \end{bmatrix}$。

$$
A E_1 \dots E_n = I \implies A^{-1} = I E_1 \dots E_n
$$

<ManimVideo src="InverseCol.mp4" />

</div>

</ComparisonGrid>

### 解矩阵方程 (Solving Matrix Equations)
根据变量 $X$ 的位置，决定使用行变换还是列变换。

<ComparisonGrid>

<div class="comparison-item">

#### 求解 $AX = B$
$X$ 在 A 的右侧，故对 A 进行**行变换**。构造 $(A | B)$，化为 $(I | X)$。

$$
X = A^{-1}B
$$

<ManimVideo src="SolveAXB.mp4" />

</div>

<div class="comparison-item">

#### 求解 $XA = B$
$X$ 在 A 的左侧，故对 A 进行**列变换**。构造 $\begin{bmatrix} A \\ \hline B \end{bmatrix}$，化为 $\begin{bmatrix} I \\ \hline X \end{bmatrix}$。

$$
X = B A^{-1}
$$

<ManimVideo src="SolveXAB.mp4" />

</div>

</ComparisonGrid>

## 结语
初等变换把矩阵运算拆成可追踪的基本步骤。理解左乘和右乘的区别，有助于后续学习逆矩阵、秩和矩阵化简。
