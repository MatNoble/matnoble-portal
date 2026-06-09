---
title: "二阶常系数线性微分方程的三类解"
description: "用滚动图文说明二阶常系数齐次线性微分方程的特征方程、实根、重根与共轭复根三类通解形式。"
layout: doc
---

<style>
/* 针对当前页面打破 VitePress 默认的窄版限制 */
.vp-doc {
  max-width: 1200px !important;
}
.vp-doc .container {
  max-width: 1200px !important;
}
</style>

<ArticleHero
  tag="互动教学"
  title="二阶常系数线性微分方程"
  description="围绕特征方程，说明不同判别式对应的三类通解形式。滚动页面可查看图形辅助说明。"
/>

二阶常系数齐次线性微分方程

$$
y'' + py' + qy = 0
$$

可以通过特征方程

$$
r^2 + pr + q = 0
$$

转化为代数问题。根据特征根的情况，通解分为三类。

<ScrollTelling :images="[
  '/assets/images/ode/1.png',
  '/assets/images/ode/2.png',
  '/assets/images/ode/3.png'
]">

<template #step-0>

### 情形 1：两个不相等的实根

为什么通解中会出现 $e^{rx}$？原因是指数函数求导后仍保持指数形式：

如果设 $y=e^{rx}$，则 $y'=re^{rx}$，$y''=r^2e^{rx}$。代入方程得到：

$$ L[e^{rx}] = (r^2 + pr + q)e^{rx} = 0 $$

由于 $e^{rx}\neq 0$，所以只需令 $r^2+pr+q=0$。当特征方程有两个不相等实根 $r_1,r_2$ 时，通解为

$$
y=C_1e^{r_1x}+C_2e^{r_2x}.
$$

</template>

<template #step-1>

### 情形 2：重根

当判别式 $\Delta = 0$ 时，特征方程只有一个重根 $r$。这时 $e^{rx}$ 只能提供一个特解。

二阶线性齐次微分方程的通解需要两个线性无关的特解。因此还需要寻找另一个与 $e^{rx}$ 线性无关的解。

用常数变易法（降阶法）设另一个解为 $y_2 = u(x)e^{rx}$，代入可得到 $u(x)=x$。因此重根情形下的通解为

$$
y=(C_1+C_2x)e^{rx}.
$$

</template>

<template #step-2>

### 情形 3：一对共轭复根

当判别式 $\Delta < 0$ 时，特征方程有一对共轭复根

$$
r=\alpha\pm i\beta.
$$

利用欧拉公式

$$
e^{i\beta x}=\cos \beta x+i\sin \beta x,
$$

可以把复指数形式改写成实函数形式：

$$
y=e^{\alpha x}(C_1\cos\beta x+C_2\sin\beta x).
$$

图中展示的是复指数的旋转部分与实轴投影之间的对应关系。

</template>

</ScrollTelling>

---

## 结语

二阶常系数齐次线性微分方程的求解重点，是把微分方程转化为特征方程，并根据特征根分类写出通解。指数函数负责处理求导后的比例变化，欧拉公式负责把复根对应的解改写为正弦和余弦形式。
