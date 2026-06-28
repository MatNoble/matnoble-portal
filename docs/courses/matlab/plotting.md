---
layout: doc
title: MATLAB 数据可视化与绘图
breadcrumb: 数据可视化
description: MATLAB 二维绘图基础、多条曲线对比、分块子图 (subplot)、散点图与柱状图。
---

# MATLAB 数据可视化与绘图

在完成矩阵运算与数据处理后，通常需要将结果以直观的图形展现出来。MATLAB 拥有极其强大的数据可视化能力，本章将带你掌握最常用的工程绘图技巧。

<img :src="'/p/Integration_Geometry_Color_SCI.png'" alt="Integration Geometry" />

---

## 1. 基础二维绘图 (plot)

利用 `plot` 绘制自变量与因变量的关系图像是最直观的数据表现形式。绘制一条完整的曲线，通常需要遵循以下四个标准化步骤：

### 1.1 步骤 1：定义自变量范围

首先，需要生成一个代表自变量（通常是 x 轴）的数据点向量。我们通常使用冒号算子或 `linspace` 函数：

*   **冒号算子 (`:`)**：语法为 `start:step:end`。例如 `x = 0:0.1:2*pi` 表示从 $0$ 开始，步长为 $0.1$，直到 $2\pi$ 结束。若省略步长（如 `1:10`），默认步长为 1。
*   **`linspace` 函数**：语法为 `linspace(start, end, n)`。例如 `x = linspace(0, 2*pi, 100)` 表示在 $0$ 到 $2\pi$ 之间均匀生成 $100$ 个数据点。

### 1.2 步骤 2：定义因变量关系

基于已定义的自变量 $x$，根据数学函数关系计算因变量向量 $y$。

> [!IMPORTANT]
> **关键点：点运算符**
> 当对向量中的每个元素独立进行运算时，必须在乘 `*`、除 `/`、乘方 `^` 前加上点号（即 `.*`, `./`, `.^`）。
> *   *正确示例*：`y = x.^2 .* sin(x)`
> *   *无需点号的情况*：简单的标量加减法（如 `y = x + 2`）或调用内置数学函数（如 `y = sin(x)`）。

### 1.3 步骤 3：调用绘图函数与样式设置

准备好数据后，执行 `plot(x, y)` 即可渲染曲线。

为了让图表更具辨识度，我们可以传入第三个参数（格式字符串，如 `'r--o'`）来精确控制曲线的**颜色、线型以及数据点的标记符号**。这三个属性可以自由组合，顺序不限。

**常用样式代码表：**
| 颜色代码 | 含义 | 线型代码 | 含义 | 标记代码 | 含义 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `r` | 红色 (Red) | `-` | 实线 (默认) | `o` | 圆圈 |
| `b` | 蓝色 (Blue) | `--` | 虚线 | `*` | 星号 |
| `g` | 绿色 (Green)| `:` | 点线 | `s` | 正方形 |
| `k` | 黑色 (Black)| `-.` | 点划线 | `^` | 向上三角形 |

*示例：绘制红色虚线，星号标记，线宽设为 2*
```matlab
plot(x, y, 'r--*', 'LineWidth', 2); 
```

### 1.4 步骤 4：完善图表标注

一个专业的工程图表不能只有干巴巴的曲线，还必须有清晰的坐标轴与图例标注：

*   `grid on;`：开启背景网格线
*   `xlabel('标签');` / `ylabel('标签');`：添加 x/y 轴的说明
*   `title('图表标题');`：添加主标题
*   `legend('曲线1', '曲线2');`：在图表角落添加图例

---

### 1.5 完整流程代码示例

将上述四个步骤串联起来，我们以绘制阻尼正弦波 $y = e^{-0.2x} \sin(x)$ 图像为例：

```matlab
% 步骤 1：定义自变量（0 到 4*pi，生成 200 个数据点）
x = linspace(0, 4*pi, 200);

% 步骤 2：计算因变量（注意使用点乘 .*）
y = exp(-0.2*x) .* sin(x);

% 步骤 3：绘制曲线（指定为蓝色实线，线宽为 1.5）
plot(x, y, 'b-', 'LineWidth', 1.5);

% 步骤 4：添加图表修饰
grid on;                      % 开启网格线
xlabel('自变量 x');            % x 轴标签
ylabel('函数值 y');            % y 轴标签
title('y = e^{-0.2x} \cdot \sin(x) 图像'); % 标题
legend('阻尼正弦波');          % 图例
```

### 🎯 闯关题目 1

1. **线型与样式**：在 `plot` 函数中，如何通过格式字符串将曲线设为“绿色的点划线，并使用向上三角形作为数据点标记”？
2. **图表标注**：绘制好曲线后，如果要开启图表的背景网格线，并将主标题设置为“实验数据”，应该依次执行哪两条命令？
3. **综合实战**：运用 4 个标准步骤，编写完整的 MATLAB 代码绘制 $y = x^2 - 4x + 3$ 的图像。要求：将自变量 $x$ 的范围设定为 $-2$ 到 $6$（均匀生成 $50$ 个点）；使用红色的虚线带圆圈标记，线宽为 `2`；开启网格线，分别给横轴和纵轴贴上标签 `'x'` 和 `'y'`，标题设为 `'二次函数图像'`。

<details>
<summary>▶ 查看答案</summary>

1. **线型与样式**：格式字符串可以写为 `'g-.^'`（其中 `g` 代表绿色，`-.` 代表点划线，`^` 代表向上三角形）。
2. **图表标注**：`grid on;` 和 `title('实验数据');`。
3. **综合实战**：此题为动手实战题，请同学们在 MATLAB 中自行敲击代码补充完整并运行验证：
   ```matlab
   % 1. 定义自变量范围
   x = _______; 
   
   % 2. 定义因变量关系（注意点运算）
   y = _______;
   
   % 3. 绘图与样式设置
   plot(_______, _______, '_______', 'LineWidth', 2);
   
   % 4. 完善图表标注
   grid on;
   xlabel('_______');
   ylabel('_______');
   title('_______');
   ```

</details>

---

## 2. 进阶绘图技巧

### 2.1 绘制多条曲线 (hold on)
如果需要将多条曲线绘制在同一张图内进行对比，可在多次调用 `plot` 之间使用 `hold on` 和 `hold off` 控制：
```matlab
x = linspace(0, 2*pi, 100);
y1 = sin(x);
y2 = cos(x);

plot(x, y1, 'r-', 'LineWidth', 1.5);  % 绘制红色实线
hold on;                             % 保持当前图窗，允许在其上继续叠加新线
plot(x, y2, 'b--', 'LineWidth', 1.5); % 绘制蓝色虚线
hold off;                            % 释放图窗状态

grid on;
xlabel('x');
ylabel('y');
title('三角函数对比图像');
legend('sin(x)', 'cos(x)');
```

### 2.2 分块子图 (subplot)
如果你想在一个窗口中显示多个独立的坐标系，可以使用 `subplot(m, n, p)`，它会将窗口划分为 $m \times n$ 的网格，并在第 $p$ 个位置绘图：
```matlab
x = linspace(0, 2*pi, 100);

subplot(2, 1, 1);       % 2行1列，第1个区域
plot(x, sin(x), 'r');
title('正弦函数');

subplot(2, 1, 2);       % 2行1列，第2个区域
plot(x, cos(x), 'b');
title('余弦函数');
```

### 2.3 智能函数绘图 (fplot) 与匿名函数

在前面使用 `plot` 时，我们需要自己利用 `linspace` 设定具体的数据点。如果我们只知道数学公式，如何让 MATLAB 自己去决定怎么画最平滑呢？这就需要用到**匿名函数**（函数句柄）与 `fplot`：

*   **匿名函数 `f = @(x) ...`**：
    这是把一个数学法则直接传给计算机的方法。比如我们要定义 $f(x) = \sin(1/x)$：
    ```matlab
    f = @(x) sin(1./x);
    ```
    *(💡 注：匿名函数中如果包含自变量自身的乘除，依然要遵循点运算原则)*
*   **智能绘图 `fplot`**：
    将刚刚定义的句柄 `f` 传给 `fplot`，并指定绘图区间 `[xmin, xmax]` 即可。为了更直观地感受它的强大，我们可以使用 `subplot` 将传统的 `plot` 与 `fplot` 放在一起对比，并特意加上数据点标记 `'o'`，来看看它们是怎么取点的：
    ```matlab
    fig = figure('Name', 'fplot 智能绘图', 'Position', [100, 100, 1000, 600], 'Color', 'w');
    
    % 左图：传统 plot 绘图（即使取 100 个点，在剧烈震荡处依然会变成折线甚至失真）
    subplot(1, 2, 1);
    x = linspace(0.01, 0.1, 100);  % 取 100 个点
    plot(x, sin(1./x), 'r-o', 'LineWidth', 1.5);
    xlim([0.01, 0.1]);             % 强制对齐 X 轴区间
    title('plot (手动取 100 个点)');
    
    % 右图：智能 fplot 绘图（自适应算法会在震荡处密集撒点，保持绝对平滑）
    subplot(1, 2, 2);
    f = @(x) sin(1./x);
    fplot(f, [0.01, 0.1], 'b-o', 'LineWidth', 1.5);
    title('fplot (自适应撒点)');
    
    % 保存高清对比图
    exportgraphics(fig, 'fplot_smart.png', 'Resolution', 300);
    ```

    <img :src="'/p/fplot_smart.png'" alt="fplot 智能绘图对比" />


    
    *不仅是绘图，在后续的课程中解方程 (`fzero`)、求定积分 (`integral`) 时，匿名函数都会大显身手哦！*

### 2.4 其他常用图表
除了 `plot` 之外，MATLAB 还可以轻松绘制其他类型的图表：
*   **散点图**：`scatter(x, y)`，用于表示离散数据点的分布情况。
    ```matlab
    x = rand(1, 50);         % 生成 50 个 0~1 之间的随机数
    y = rand(1, 50);
    scatter(x, y, 'filled'); % 绘制实心散点图
    ```
*   **柱状图**：`bar(x, y)`，常用于比较不同类别的数值大小。
    ```matlab
    x = 2020:2024;           % 年份
    y = [15, 22, 28, 35, 42]; % 销量数据
    bar(x, y);               % 绘制垂直柱状图
    ```
*   **直方图**：`histogram(data)`，用于统计数据在各个区间的频率分布。
    ```matlab
    data = randn(1, 1000);   % 生成 1000 个标准正态分布随机数
    histogram(data, 20);     % 分成 20 个区间进行统计
    ```

### 2.5 导出高清图片 (exportgraphics)

在撰写论文或实验报告时，我们通常需要无损、高分辨率的图表。相比于手动点击窗口的“保存”按钮或者使用截图软件，MATLAB 提供了专门用于导出学术级高清图片的利器：`exportgraphics`。

```matlab
% 1. 导出为 300 分辨率的高清 PNG 图片（适合插入 Word 或网页）
exportgraphics(gcf, 'my_plot.png', 'Resolution', 300);

% 2. 导出为纯矢量图格式的 PDF（适合 LaTeX 排版，无限放大不失真）
exportgraphics(gcf, 'my_plot.pdf', 'ContentType', 'vector');
```

> 💡 **名词解释：什么是 `gcf`？**
> 
> `gcf` 是 **G**et **C**urrent **F**igure 的缩写。它是 MATLAB 的一个内置函数，用于自动“获取当前正在活跃的图窗句柄”。
> * 只要你刚刚画完一张图，不需要提前去定义它，`gcf` 就会自动指代刚刚画好的那张图窗。
> * 另外，如果你在创建窗口时自己定义了变量名（比如我们在前面的对比图里用的 `fig = figure(...)`），那么也可以不写 `gcf`，直接写 `exportgraphics(fig, ...)`。

**为什么推荐用代码导出？**
* **分辨率可控**：通过 `Resolution` 参数可以设定任意 DPI（如 300 或 600），满足顶级期刊的要求。
* **自动裁剪白边**：导出的图片会自动贴合图表的紧凑边界，不会带有 MATLAB 默认图窗周围那一大圈多余的灰色或白色边距。

通过熟练组合这些基础绘图指令和导出方法，你就能应对绝大多数二维平面工程报告的作图与排版需求！

### 🎯 闯关题目 2
1. **多图叠加**：在使用 `hold on` 叠加多条曲线后，必须使用什么命令才能让后续的绘图重新覆盖（而不是继续叠加在当前图窗上）？
2. **子图排布**：如果想要创建一个 3 行 2 列的图表排布，并在第 2 行第 1 列（即左边中间位置）绘制图形，`subplot` 的三个参数应该怎么填？
3. **综合实战**：请利用 `subplot` 和 `fplot`，创建一个**左右并排**（1行2列）的图表。左图绘制散点图（$x$ 为 1 到 10 的整数，$y$ 为对应的随机数）；右图利用匿名函数智能绘制 $f(x) = x \sin(x)$（区间为 $0$ 到 $10$）。

<details>
<summary>▶ 查看答案</summary>

1. **多图叠加**：需要使用 `hold off` 命令来释放图窗状态。
2. **子图排布**：使用 `subplot(3, 2, 3)`。因为在 3 行 2 列的网格中，子图是从左到右、从上到下按 1 到 6 编号的。第 2 行第 1 列对应第 3 个位置。
3. **综合实战**：此题为动手实战题，请同学们在 MATLAB 中补充完整代码并运行验证：
   ```matlab
   % 1. 激活左侧子图（1行2列的第1个位置）
   subplot(____, ____, ____);
   x_scatter = 1:10;
   y_scatter = rand(1, 10);
   scatter(____, ____, 'filled');
   title('随机散点图');
   
   % 2. 激活右侧子图（1行2列的第2个位置）
   subplot(____, ____, ____);
   f = @(x) _________;   % 💡 提示：定义匿名函数 x*sin(x)，别忘了点运算
   fplot(____, [0, 10]);
   title('x \cdot sin(x) 智能绘图');
   ```

</details>

---

## 3. 三维数据可视化 (3D Plotting)

MATLAB 在三维空间数据的展示上同样非常出色，最常见的应用场景是绘制三维曲面图。

### 3.1 核心概念：生成网格 (meshgrid)
绘制三维曲面 $z = f(x, y)$ 的核心在于：我们需要先在 x-y 平面上铺设一张“坐标网格底板”。
1. **生成一维坐标**：分别定义 $x$ 轴和 $y$ 轴的坐标向量。
2. **生成二维网格**：利用 `[X, Y] = meshgrid(x, y)`，将这两个一维向量交叉展开为覆盖整个平面的二维矩阵坐标。
    *   *原理示例*：假设 `x = [1, 2, 3]` 且 `y = [4, 5]`，执行 `[X, Y] = meshgrid(x, y)` 后，`X` 会变为 `[1, 2, 3; 1, 2, 3]`（行复制），`Y` 会变为 `[4, 4, 4; 5, 5, 5]`（列复制）。此时同位置的 `(X(i,j), Y(i,j))` 就构成了平面上的每一个坐标点。
3. **计算高度 Z**：通过点运算，根据底板矩阵 `X` 和 `Y` 计算出每个坐标点对应的高度矩阵 `Z`。
4. **渲染曲面**：调用 `surf(X, Y, Z)`（实心渐变曲面）或 `mesh(X, Y, Z)`（网格线骨架）进行渲染。

### 3.2 绘制“墨西哥帽”曲面示例
我们以绘制经典的墨西哥帽曲面 (Sombrero) $z = \frac{\sin(r)}{r}$ 为例，其中 $r = \sqrt{x^2 + y^2}$：

```matlab
% 1. 定义 x 和 y 轴的采样范围
x = linspace(-8, 8, 50);
y = linspace(-8, 8, 50);

% 2. 生成平面交叉网格 [X, Y]
[X, Y] = meshgrid(x, y);

% 3. 计算距离半径 R，以及对应高度 Z
R = sqrt(X.^2 + Y.^2) + eps; % 加上 eps(极小数) 是为了防止 r=0 时出现除零错误
Z = sin(R) ./ R;             % 计算高度（注意：必须使用点除 ./）

% 4. 绘制三维表面图
surf(X, Y, Z);

% 5. 图表修饰
shading interp;     % 平滑着色，隐藏表面的网格黑线
colormap jet;       % 使用 jet 经典彩虹色映射
colorbar;           % 在右侧显示颜色对照条
title('三维墨西哥帽曲面 (Sombrero)');
xlabel('X轴'); ylabel('Y轴'); zlabel('Z轴');
```

<img :src="'/p/plot_3d.png'" alt="三维墨西哥帽曲面 (Sombrero)" />

*(💡 提示：绘制出三维图后，你可以在 MATLAB 图窗工具栏中点击“三维旋转”按钮，通过鼠标任意拖拽改变视角。)*

除了曲面，如果你的数据是一条三维空间中连续运动的轨迹线，你可以直接使用 `plot3(x, y, z)` 进行绘制，其语法和二维的 `plot` 完全一致：

```matlab
% 绘制三维螺旋线轨迹
t = 0:pi/50:10*pi;
x = sin(t);
y = cos(t);
z = t;
plot3(x, y, z, 'LineWidth', 1.5);
title('三维螺旋线轨迹');
grid on;
```

### 🎯 闯关题目 3
1. **网格生成**：绘制三维曲面图时，首先需要使用哪个核心函数将一维的 x 和 y 坐标转换为覆盖整个平面的二维坐标矩阵？
2. **曲面渲染**：`surf(X,Y,Z)` 和 `mesh(X,Y,Z)` 在渲染效果上最主要的区别是什么？

<details>
<summary>查看答案</summary>

1. **网格生成**：需要使用 `meshgrid` 函数。例如 `[X, Y] = meshgrid(x, y)`。
2. **曲面渲染**：`surf` 绘制的是带颜色填充的实心三维曲面（Surface），而 `mesh` 绘制的是仅显示网格线骨架的空心网格曲面（Mesh）。

</details>

---

## 4. 实践项目：初等函数画册

为了巩固本章的绘图技巧，请你使用 MATLAB 绘制一个包含 4 个独立坐标系的“初等函数画册”。

### 3.1 项目描述
请使用 `subplot(2, 2, p)` 将图形窗口分为 2 行 2 列，并在 4 个子图中分别绘制以下初等函数：
1. **左上角 (p=1)**：二次函数 $y = x^2$。自变量范围：$[-5, 5]$。线型要求：红色虚线 (`r--`)。
2. **右上角 (p=2)**：指数函数 $y = e^x$。自变量范围：$[-3, 3]$。线型要求：蓝色实线 (`b-`)。
3. **左下角 (p=3)**：自然对数函数 $y = \ln(x)$。自变量范围：$[0.1, 10]$。线型要求：黑色实线 (`k-`)。*(注意：由于 $\ln(x)$ 在 $x \le 0$ 时无意义，起点不能为 0)*
4. **右下角 (p=4)**：正弦函数 $y = \sin(x)$。自变量范围：$[-2\pi, 2\pi]$。线型要求：绿色点划线 (`g-.`)。

**附加要求**：为每个子图添加对应的标题（如 `'y = x^2'`）并开启网格线（`grid on`）。

### 3.2 动手实践

请先尝试自己在 MATLAB 中编写脚本运行并观察出图效果。本题参考代码已加密保护：

<div v-if="!isUnlocked" style="padding: 1rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; margin-top: 1rem; background-color: var(--vp-c-bg-soft);">
  <p style="margin: 0 0 0.5rem 0; font-weight: bold;">🔒 输入密码解锁参考代码</p>
  <div style="display: flex; gap: 0.5rem; align-items: center;">
    <input type="password" v-model="pwd" @keyup.enter="checkPwd" placeholder="请输入助教提供的密码" style="padding: 0.3rem 0.6rem; border: 1px solid var(--vp-c-divider); border-radius: 4px; outline: none; background: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 0.9em; flex: 1; max-width: 200px;" />
    <button @click="checkPwd" style="padding: 0.3rem 0.8rem; background-color: var(--vp-c-brand); color: white; border-radius: 4px; cursor: pointer; font-size: 0.9em; font-weight: bold; border: none;">解锁</button>
  </div>
  <p v-if="errorMsg" style="color: var(--vp-c-danger-1, #e33); margin: 0.5rem 0 0 0; font-size: 0.9em;">{{ errorMsg }}</p>
</div>

<div v-if="isUnlocked">

```matlab
% --- 1. 二次函数 y = x^2 ---
subplot(2, 2, 1);
x1 = linspace(-5, 5, 100);
y1 = x1.^2;                  % 必须使用点乘方
plot(x1, y1, 'r--', 'LineWidth', 1.5);
title('y = x^2');
grid on;

% --- 2. 指数函数 y = e^x ---
subplot(2, 2, 2);
x2 = linspace(-3, 3, 100);
y2 = exp(x2);
plot(x2, y2, 'b-', 'LineWidth', 1.5);
title('y = e^x');
grid on;

% --- 3. 对数函数 y = ln(x) ---
subplot(2, 2, 3);
x3 = linspace(0.1, 10, 100); % x 必须大于 0
y3 = log(x3);                % MATLAB 中 log() 即代表自然对数 ln()
plot(x3, y3, 'k-', 'LineWidth', 1.5);
title('y = ln(x)');
grid on;

% --- 4. 正弦函数 y = sin(x) ---
subplot(2, 2, 4);
x4 = linspace(-2*pi, 2*pi, 100);
y4 = sin(x4);
plot(x4, y4, 'g-.', 'LineWidth', 1.5);
title('y = sin(x)');
grid on;
```

</div>

通过这个实践，你已经能够熟练使用 `subplot` 排布图形，并掌握了不同基本初等函数的绘制方法与点运算符 `.^` 的应用场景了！

<script setup>
import { ref } from 'vue'

const pwd = ref('')
const isUnlocked = ref(false)
const errorMsg = ref('')

function checkPwd() {
  if (pwd.value === 'matlab2026') {
    isUnlocked.value = true
    errorMsg.value = ''
  } else {
    errorMsg.value = '密码错误！'
  }
}
</script>
