---
outline: deep
---

<script setup>
import MatrixTransformationDemo from '../../components/math/MatrixTransformationDemo.vue'
import MatrixLeftRightDemo from '../../components/math/MatrixLeftRightDemo.vue'
</script>

<ArticleHero 
  tag="交互式实验 (Lab)"
  title="初等变换：数值的流动" 
  description="线性方程组求解的核心算法。通过交互动画，观察数字如何在空间中流动、组合与重构。"
  :points="['互换：空间重排', '倍乘：维度缩放', '倍加：剪切变换', '行阶梯形矩阵']"
/>

<LearningPathHeader
  :nodes="[
    { text: '理论引入', active: true },
    { text: '交互动画' },
    { text: '初等矩阵' },
    { text: '左右乘规律' }
  ]"
/>

在线性代数中，初等变换是化简矩阵、求解线性方程组的核心算法。为了更直观地理解这三类基本的变换操作，我们可以通过下方的交互式动画来进行物理过程的推演。

## 初等变换：系统的“归一化”

对矩阵进行以下三类操作，统称为 **初等行（列）变换**：

1. **互换（Swap）**：交换两行（列）的位置。记为 $E_{ij}$。
2. **倍乘（Multiply）**：用一个非零常数 $k$ 乘以某一行（列）。记为 $E_i(k)$。
3. **倍加（Add）**：将某一行（列）的 $k$ 倍加到另一行（列）上。记为 $E_{ij}(k)$。

### 交互式动画演示

点击下方按钮，观察数字是如何在空间中流动、组合与重构的。

<ClientOnly>
  <MatrixTransformationDemo />
</ClientOnly>

## 初等矩阵与变换的“算子化”

对单位矩阵 $I$ 执行一次初等变换所得到的矩阵，称为 **初等矩阵**。

在实际操作中，我们需要牢记一个核心准则：

::: warning 避坑指南
记住一句话：**左乘时，下标顺序与行操作一致；右乘时，操作方向与下标顺序相反。**（即左乘对应行变换，右乘对应列变换）。
:::

利用这种几何与代数的映射关系，初等变换不仅能用于求解逆矩阵，还能深刻揭示矩阵“秩”在变换过程中的不变性。

### 左乘与右乘对比动画演示

下面这个动画将以物理“撞击”的隐喻，直观地展示为什么 $E$ 放在左边时改变的是**行**（水平冲击），而放在右边时改变的是**列**（垂直冲击）。

<ClientOnly>
  <MatrixLeftRightDemo />
</ClientOnly>

---

<ChapterNavigation 
  :next="{ 
    title: '空间几何 3D 实验室', 
    link: '/teaching/space-geometry-lab',
    description: '从数值计算跃迁到三维空间，探索曲面的几何本质。'
  }"
/>
