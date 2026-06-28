---
layout: doc
title: 实践项目二：GUI 界面矩阵计算器
breadcrumb: GUI 矩阵计算器项目
description: MATLAB 第二部分课程实践项目：使用 App Designer 封装矩阵运算核心逻辑，实现一个包含矩阵输入编辑框、控制按钮和结果显示文本区的图形用户界面计算器。
---

# 实践项目：GUI 矩阵计算器

本章将介绍如何使用 MATLAB 的 **App Designer**，将我们之前写的矩阵计算器算法封装为图形用户界面（GUI）。在这个项目中，你需要练习界面组件的布局，并了解 **事件驱动编程（Event-Driven Programming）** 的基本概念。

## 1. 热身项目：动态正弦波绘制

由于事件驱动的概念可能有些抽象，在开始写矩阵计算器之前，我们先做一个极简的“频率画图”工具来热身。这个工具只需要 3 个基础组件，很快就能跑通。

### 1.1 界面布局与组件命名

在命令行输入 `appdesigner` 开启图形化设计器。**新建一个空白 App，按下 `Ctrl+S` (或 `Cmd+S`) 将其命名保存为 `SineWaveApp.mlapp`**。然后拖拽以下三个组件，搭建出类似下方的界面：

<div style="border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 2rem; max-width: 600px; margin: 1.5rem auto; background-color: var(--vp-c-bg-soft); box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-around; flex-wrap: wrap;">
  <div style="flex: 1; min-width: 250px; text-align: center; margin-bottom: 1rem;">
    <div style="font-weight: bold; font-size: 0.9em; margin-bottom: 0.2rem;">Title</div>
    <div style="display: flex; align-items: center;">
      <div style="transform: rotate(-90deg); transform-origin: center; font-size: 0.9em; margin-right: -1rem; font-weight: bold;">Y</div>
      <div style="flex: 1; background: white; border: 1px solid var(--vp-c-divider); padding: 0.5rem; position: relative;">
        <svg viewBox="0 0 100 40" style="width: 100%; height: 150px; display: block;">
          <path d="M 0 20 Q 8.33 -20 16.66 20 T 33.33 20 T 50 20 T 66.66 20 T 83.33 20 T 100 20" fill="none" stroke="#0072BD" stroke-width="1.5"/>
        </svg>
        <div style="position: absolute; bottom: 0.5rem; right: 0.5rem; background: rgba(255,255,255,0.9); border: 1px solid var(--vp-c-divider); font-size: 0.6em; padding: 0.2rem 0.4rem; text-align: left; line-height: 1.2; box-shadow: 1px 1px 3px rgba(0,0,0,0.1); border-radius: 2px;">
          <span style="color: var(--vp-c-text-2);">X</span> <strong>0.9393</strong><br><span style="color: var(--vp-c-text-2);">Y</span> <strong>-0.9096</strong>
        </div>
      </div>
    </div>
    <div style="font-size: 0.9em; margin-top: 0.2rem; font-weight: bold;">X</div>
  </div>
  
  <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; align-items: center; gap: 2.5rem;">
    <div style="padding: 0.4rem 1.5rem; border: 1px solid #0072BD; border-radius: 6px; background: white; color: black; font-size: 0.9em; cursor: default; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">画图 (Plot)</div>
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <span style="font-size: 0.9em; font-weight: bold;">频率 (Hz):</span>
      <div style="width: 60px; text-align: right; padding: 0.2rem 0.5rem; border: 1px solid var(--vp-c-divider); background: white; color: black;">3</div>
    </div>
  </div>
</div>

在右侧属性检查器（Inspector）中，规范以下系统标识符：
*   **坐标轴**：`UIAxes` 组件，保持默认名称 `UIAxes` 即可（它是用来渲染图形的画布）。
*   **数值输入框**：`NumericEditField` 组件，`Name` 设为 `FreqEditField`，旁边的提示文本（Label）改为 `频率 (Hz):`，并填入默认值 `3`。
*   **执行按钮**：`Button` 组件，`Name` 设为 `PlotButton`，文本设为 `画图 (Plot)`。

### 1.2 在指定坐标轴上绘图

在 App Designer 中绘图需要注意一点：以前我们在命令行直接敲 `plot(x, y)`，会自动弹出一个新的图形窗口。但在 GUI 开发中，界面上可能有多个坐标轴，因此**必须明确指定要把曲线画在哪一个坐标轴上**。

在设计视图中右键点击 `画图 (Plot)` 按钮，选择 **Callbacks -> Add ButtonPushedFcn callback**，并填入以下代码：

```matlab
% Callback function: PlotButtonPushed
function PlotButtonPushed(app, event)
    % 1. 获取输入框内的频率数值
    f = app.FreqEditField.Value;
    
    % 2. 生成离散的时间向量 t (从 0 到 1 秒，打 1000 个点)
    t = linspace(0, 1, 1000);
    
    % 3. 生成正弦波的振幅向量 y
    y = sin(2 * pi * f * t);
    
    % 4. 【核心】定向渲染：强制将图像绘制在 app.UIAxes 画布上
    plot(app.UIAxes, t, y, 'LineWidth', 2);
end
```

### 闯关题目 1：进阶思考——用“滑块 (Slider)”替代文本框

每次想改变波形，都要手动删除数字、重新敲击数字，再点击“画图”，这样的交互体验非常糟糕。
如果我们将输入框替换为 **滑块 (Slider)** 组件，并搭建如下的“控制台 (Control Panel)”：

<img :src="'/p/SineWave.png'" alt="正弦波控制台升级版" />

如果绑定其专有的 **ValueChangingFcn**（数值正在改变中）回调事件，请思考：在拖拽滑块的过程中，波形会发生什么变化？这种事件驱动机制在底层是如何工作的？

<details>
<summary>▶ 查看参考答案</summary>

**现象**：
在拖拽滑块的瞬间，无需松手，也无需点击画图按钮，屏幕上的正弦波就会像有生命一样，随着滑块的左右移动，**实时、平滑地发生扭动（波形的频率动态连续变化）**。

**底层机制**：
`ValueChangingFcn` 是一个高频触发事件。当鼠标拖拽滑块时，哪怕只移动了一毫米，系统也会立刻触发一次回调函数。该函数会瞬间读取当前的临时滑块值（提取为 `event.Value`），重新计算新的 $y$ 向量，并将其覆盖渲染到画布上。因为计算极快，从而在视觉上形成了连贯的逐帧动画效果。

</details>

## 2. 理论基础：事件驱动与 UI 对象树

刚刚的热身项目展示了点击按钮就能画图的效果。现在我们简单了解一下这背后的运行机制，为后续开发矩阵计算器做准备。

### 2.1 事件驱动编程模型
传统的 MATLAB 命令行程序属于 **过程式（Procedural）编程**，代码按照由上至下的顺序依次执行，直到结束。而在刚刚的 GUI 程序中，程序的执行是由 **事件（Event）** 来主导触发的（例如：用户点击按钮、拖动滑块等）。为了响应这些事件，我们需要为特定的界面组件编写专属的 **回调函数（Callback Function）**。

### 2.2 UI 组件对象模型
在 App Designer 中，整个应用程序被封装为一个面向对象的实例（通常用 `app` 变量指代）。所有的按钮、文本框、坐标轴等图形组件都是该实例下的内部属性。
例如：我们在热身项目中通过 `app.FreqEditField.Value` 提取了频率值；若要操作名为 `CalculateButton` 的按钮，则在后台代码中通过 `app.CalculateButton` 访问。

### 闯关题目 2：UI 属性控制

假设我们在界面上放置了一个按钮（Name 属性为 `CalculateButton`），请完成下面这段代码的填空，使得在其他回调代码执行时，能够动态修改该按钮的显示文本为“正在计算...”，并将其背景颜色设为红色（RGB 颜色向量为 `[1 0 0]`）：

<details>
<summary>▶ 查看参考答案</summary>

```matlab
% 修改按钮显示文本
app.CalculateButton.Text = '正在计算...';

% 修改按钮背景颜色
app.CalculateButton.BackgroundColor = [1 0 0];
```

</details>

## 3. 矩阵计算器界面搭建

有了前面的基础，我们可以开始编写矩阵计算器了。

### 3.1 界面布局
**首先新建一个空白 App，将其保存为 `MatrixCalculator.mlapp`。** 从组件库中拖拽相关组件，搭建出类似下面的界面：

<div style="border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 1rem; max-width: 500px; margin: 1.5rem auto; background-color: var(--vp-c-bg-soft); box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
  <div style="text-align: center; font-weight: bold; margin-bottom: 1rem; font-size: 1.1em; letter-spacing: 1px;">矩阵计算器 GUI</div>
  
  <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
    <div style="flex: 1; border: 1px solid var(--vp-c-divider); border-radius: 4px; padding: 0.5rem; background: var(--vp-c-bg);">
      <div style="font-size: 0.85em; color: var(--vp-c-text-2); margin-bottom: 0.5rem;">矩阵 A 输入区 [TextArea]</div>
      <div style="font-family: var(--vp-font-family-mono); color: var(--vp-c-text-1);">[1 2; 3 4]</div>
    </div>
    <div style="flex: 1; border: 1px solid var(--vp-c-divider); border-radius: 4px; padding: 0.5rem; background: var(--vp-c-bg);">
      <div style="font-size: 0.85em; color: var(--vp-c-text-2); margin-bottom: 0.5rem;">矩阵 B 输入区 [TextArea]</div>
      <div style="font-family: var(--vp-font-family-mono); color: var(--vp-c-text-1);">[2; 1]</div>
    </div>
  </div>

  <div style="border: 1px solid var(--vp-c-divider); border-radius: 4px; padding: 0.8rem; margin-bottom: 1rem; background: var(--vp-c-bg);">
    <div style="font-size: 0.85em; color: var(--vp-c-text-2); margin-bottom: 0.8rem;">运算选择区 [Buttons]</div>
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
      <button style="padding: 0.3rem 0.6rem; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: var(--vp-c-bg-mute); font-size: 0.9em; cursor: default;">A+B</button>
      <button style="padding: 0.3rem 0.6rem; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: var(--vp-c-bg-mute); font-size: 0.9em; cursor: default;">A-B</button>
      <button style="padding: 0.3rem 0.6rem; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: var(--vp-c-bg-mute); font-size: 0.9em; cursor: default;">A*B</button>
      <button style="padding: 0.3rem 0.6rem; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: var(--vp-c-bg-mute); font-size: 0.9em; cursor: default;">A.*B</button>
      <button style="padding: 0.3rem 0.6rem; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: var(--vp-c-bg-mute); font-size: 0.9em; cursor: default;">转置</button>
      <button style="padding: 0.3rem 0.6rem; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: var(--vp-c-bg-mute); font-size: 0.9em; cursor: default;">分析</button>
    </div>
    <div style="width: 100%; padding: 0.5rem; background: var(--vp-c-brand); color: white; border: none; border-radius: 4px; font-weight: bold; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">求解方程组 Ax = B</div>
  </div>

  <div style="border: 1px solid var(--vp-c-divider); border-radius: 4px; padding: 0.5rem; background: var(--vp-c-bg);">
    <div style="font-size: 0.85em; color: var(--vp-c-text-2); margin-bottom: 0.5rem;">结果输出区 [TextArea (Read-Only)]</div>
    <div style="font-family: var(--vp-font-family-mono); color: var(--vp-c-text-1); white-space: pre-wrap; font-size: 0.9em; line-height: 1.5;">求解成功！
结果 x = ...
残差范数 = ...</div>
  </div>
</div>

### 3.2 组件命名规范
为了让代码更易读，**不要**保留 `Button1`、`TextArea2` 这种默认名称。请在右侧的检查器（Inspector）中，将这几个关键组件重命名：
*   **输入框 A**：`TextArea` 组件，`Name` 设为 `MatrixAEditField`。
*   **输入框 B**：`TextArea` 组件，`Name` 设为 `MatrixBEditField`。
*   **执行按钮**：`Button` 组件，`Name` 设为 `SolveButton`。
*   **输出显示区**：`TextArea` 组件，`Name` 设为 `ResultTextArea`，并务必在属性栏中**取消勾选 `Editable`**（关闭可编辑状态，进入只读模式，以防止终端用户恶意篡改计算结果）。

## 4. 处理多行文本输入

### 4.1 字符串拼接与解析
当用户在多行文本框（`TextArea`）中输入矩阵时，`app.MatrixAEditField.Value` 获取到的不是一串普通的字符串，而是**由每一行构成的细胞数组 (Cell Array)**。

如果直接对这个细胞数组使用 `str2num` 会报错。我们需要先将它拼接成一个长字符串：
1. **拼接字符串**：使用 `strjoin(..., '\n')` 将多行细胞数组用换行符连接起来，变成一个完整的字符串。
2. **转换为矩阵**：再使用 `str2num` 函数将这个字符串解析为数值矩阵。

### 闯关题目 3：处理多行文本

为了让程序既能解析单行文本，也能解析多行文本，请完成下面这段文本处理代码的填空：
```matlab
% 1. 获取文本框输入内容
rawInput = app.MatrixAEditField.______;

% 2. 将多行文本拼接成一个长字符串
joinedStr = ______(rawInput, '\n');

% 3. 将字符串转换为数值矩阵
A = ______(joinedStr);
```

<details>
<summary>▶ 查看参考答案</summary>

```matlab
rawInput = app.MatrixAEditField.Value;

joinedStr = strjoin(rawInput, '\n');

A = str2num(joinedStr);
```

</details>

## 5. 业务层：回调函数中的事件响应绑定

在 App Designer 工作区的主视图中，右键点击“求解方程组”按钮，依次选择 `Callbacks` -> `Add ButtonPushedFcn callback`。

### 5.1 错误处理 (try-catch)
与普通的命令行脚本不同，GUI 程序如果遇到计算报错（比如用户输入了非法的格式），整个界面可能会卡死。因此，我们需要把计算逻辑放在 `try-catch` 语句中，拦截可能发生的错误。

### 5.2 计算功能代码实现
在系统自动生成的回调函数中，写入我们之前的矩阵计算代码，并将结果输出到文本框中：

```matlab
% Callback function: SolveButtonPushed
function SolveButtonPushed(app, event)
    try
        % 1. 获取并处理输入数据
        valA = strjoin(app.MatrixAEditField.Value, '\n');
        valB = strjoin(app.MatrixBEditField.Value, '\n');
        A = str2num(valA);
        B = str2num(valB);
        
        if isempty(A) || isempty(B)
            error('输入数据为空或格式不正确。');
        end
        
        % 2. 检查矩阵维度
        if size(A, 1) ~= size(A, 2)
            error('系数矩阵 A 必须是方阵。');
        end
        if size(A, 1) ~= size(B, 1)
            error('矩阵 A 的行数必须与矩阵 B 的行数相等。');
        end
        
        % 3. 执行计算
        x = A \ B;
        resNorm = norm(A*x - B);
        
        % 4. 在界面上输出结果
        outputStr = { ...
            '==========================', ...
            '求解结果目标向量 x =', ...
            mat2str(x, 4), ...
            '--------------------------', ...
            sprintf('计算残差范数 ||Ax - B|| = %e', resNorm), ...
            '==========================' ...
        };
        app.ResultTextArea.Value = outputStr;
        
    catch ME
        % TODO: 后续可改为弹窗报错
        app.ResultTextArea.Value = {['>> 错误：' ME.message]};
    end
end
```

### 闯关题目 4：使用弹窗报错

在上面的代码中，我们只是把报错信息打印在了文本框里。
在实际软件中，通常会使用系统弹窗来提示用户错误信息。请查阅 App Designer 官方文档，尝试将 `catch ME` 中的处理逻辑改为：弹出一个错误提示框。

```matlab
catch ME
    % 弹出警告提示窗
    % 第一个参数：App 的主窗口 (在 app 结构树顶部的 UIFigure)
    % 第二个参数：错误信息
    % 第三个参数：弹窗标题
    ______(app.UIFigure, ME.______, '计算失败');
end
```

<details>
<summary>▶ 查看参考答案</summary>

```matlab
catch ME
    uialert(app.UIFigure, ME.message, '计算失败');
end
```

</details>

### 5.3 算力引擎上机测试与数值稳定性验证

在完成核心算力代码的编写后，可通过以下两组典型测试用例验证 GUI 的运行状态及 MATLAB 数值计算的特性。由于底层数据解析采用了 `str2num`，输入框内可以直接调用 MATLAB 内置函数进行数据生成：

#### 测试用例 1：良态矩阵测试 (Well-conditioned Matrix)
本例采用条件数较小、具有精确解的常规方程组进行基准测试。
*   **矩阵 A 输入区**：`[4 3; 6 3]`
*   **矩阵 B 输入区**：`[10; 12]`

**运行结果**：目标向量解为精确的 `[1; 2]`。此时输出的残差范数通常为 `0` 或接近 `1.7e-15`（双精度浮点数的机器精度限制），表明算力引擎在常规数据下具备极高的计算精度。

#### 测试用例 2：病态矩阵测试 (Ill-conditioned Matrix)
在数值分析中，希尔伯特矩阵 (Hilbert Matrix) 常被作为评估数值算法稳定性的基准。12 阶希尔伯特矩阵的条件数接近 $10^{16}$，达到了 64 位双精度浮点数的精度极限。

*   **矩阵 A 输入区**：`hilb(12)`
*   **矩阵 B 输入区**：`ones(12, 1)`

**运行结果**：
1. 计算得到的目标向量 $x$ 会出现极大数值（如 $10^8$ 级别），严重偏离理论精确解。
2. 结果输出区的残差范数将显著放大至 $10^{-9}$ 或更大量级，远超双精度浮点数的常规截断误差下限。
3. 同步查看 MATLAB 命令行终端，通常会触发系统级的条件数异常警告：`警告: 矩阵接近奇异值，或缩放错误。结果可能不准确。`

该测试直观地揭示了数值计算中的“失真现象”：在工程计算环境中，即使理论数学公式严谨，若输入数据矩阵呈现高度“病态”，浮点误差将被急剧放大并导致计算结果失效。

## 6. 课后练习与功能拓展

在完成了“求解矩阵方程”的核心功能后，请尝试独立完成以下拓展功能，以完善整个矩阵计算器：

1. **实现其余运算功能**：参考 `SolveButtonPushed` 的代码结构，为加法 (`A+B`)、减法 (`A-B`) 和乘法 (`A*B`) 按钮编写相应的回调函数。
   *提示：不同的矩阵运算对维度有不同的要求（例如，加减法要求两矩阵维度完全一致，乘法要求 A 的列数等于 B 的行数），请务必在计算前加入对应的维度检查逻辑。*
2. **添加“清空”按钮**：在界面上新增一个“清除重置”按钮。编写回调函数，使得点击该按钮后，能够一键清空两个输入框以及结果输出区中的所有内容。
3. **增加状态颜色提示**：为了提升交互体验，请修改代码：当运算成功并输出结果时，将 `ResultTextArea` 的背景色设为淡绿色（可使用 RGB 向量 `[0.8, 1, 0.8]`）；当触发 `catch` 捕获到报错（如维度不匹配）时，将其背景色设为淡红色（例如 `[1, 0.8, 0.8]`）。
