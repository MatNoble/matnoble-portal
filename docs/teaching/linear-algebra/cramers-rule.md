---
title: 克拉默法则的几何直观 | 面积比值与线性方程组
breadcrumb: 克拉默法则
description: 通过交互式面积可视化理解克拉默法则。将二维线性方程组的解解释为替换列行列式与基准行列式的面积比值。
keywords: 克拉默法则, Cramer's Rule, 行列式几何意义, 线性方程组, 面积比值, 线性代数可视化
sidebar: false
aside: true
pageClass: cramer-page
structuredData:
  course:
    name: "线性代数几何直观"
    description: "通过交互图形理解克拉默法则中的列替换与面积比值。"
    provider: "MatNoble"
---

<ArticleHero
  tag="线性代数"
  title="克拉默法则的几何直观"
  description="把二维线性方程组看成向量合成问题：未知数不是抽象符号，而是把右端向量拆成两条基向量时的缩放比例。"
/>

<ThreeOneQuote author="MatNoble">
  “在二维情形下，克拉默法则可以看成两个有向面积的比值。”
</ThreeOneQuote>

设二维线性方程组写成矩阵形式：

$$
A\boldsymbol{x}=\boldsymbol{b}, \qquad
A = \begin{bmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{bmatrix}
= \begin{bmatrix} \boldsymbol{a}_1 & \boldsymbol{a}_2 \end{bmatrix}.
$$

这句话的几何含义是：

$$
x_1\boldsymbol{a}_1 + x_2\boldsymbol{a}_2 = \boldsymbol{b}.
$$

也就是说，求解方程组就是把右端向量 $\boldsymbol{b}$ 拆成两条列向量 $\boldsymbol{a}_1,\boldsymbol{a}_2$ 的线性组合。

## 交互演示

下面的模型需要全屏打开。进入演示后，可以调整右端向量 $\boldsymbol{b}$，查看 $D_1$、$D_2$ 与解的对应关系。

<CramerRuleVisualizer />

## 面积为什么会给出解？

行列式

$$
D = \det(\boldsymbol{a}_1, \boldsymbol{a}_2)
$$

表示由两条列向量围成的有向面积。当

$$
\boldsymbol{b} = x_1\boldsymbol{a}_1 + x_2\boldsymbol{a}_2
$$

时，用 $\boldsymbol{b}$ 替换第一列：

$$
D_1 = \det(\boldsymbol{b}, \boldsymbol{a}_2)
= \det(x_1\boldsymbol{a}_1 + x_2\boldsymbol{a}_2, \boldsymbol{a}_2).
$$

利用行列式对列的线性性：

$$
D_1 = x_1\det(\boldsymbol{a}_1, \boldsymbol{a}_2)
+ x_2\det(\boldsymbol{a}_2, \boldsymbol{a}_2)
= x_1D.
$$

因为两列相同的行列式为 $0$，所以只剩下 $x_1D$。同理：

$$
D_2 = \det(\boldsymbol{a}_1, \boldsymbol{b}) = x_2D.
$$

只要 $D \neq 0$，两条列向量没有共线，方程组就有唯一解：

$$
x_1 = \frac{D_1}{D}, \qquad x_2 = \frac{D_2}{D}.
$$

## 小结

- $D$ 是原始列向量围成的基准面积。
- $D_1$ 是用右端向量 $\boldsymbol{b}$ 替换第一列后的面积。
- $D_2$ 是用右端向量 $\boldsymbol{b}$ 替换第二列后的面积。
- 解的分量就是“替换后的面积”与“基准面积”的比值。

当 $D = 0$ 时，基准面积为零，说明两条列向量共线。此时克拉默法则不能直接使用，方程组需要改用相容性与秩来判断。

<ChapterNavigation
  :prev="{
    title: '线性代数总论',
    link: '/teaching/linear-algebra',
    description: '回到线性代数专题总览。'
  }"
  :next="{
    title: '初等变换：行列操作',
    link: '/teaching/linear-algebra/elementary-transformations',
    description: '继续理解方程组求解背后的行列变换。'
  }"
/>
