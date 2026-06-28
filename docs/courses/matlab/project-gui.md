---
layout: doc
title: 实践项目二：GUI 界面矩阵计算器
breadcrumb: GUI 矩阵计算器项目
description: MATLAB 第二部分课程实践项目：使用 App Designer 封装矩阵运算核心逻辑，实现一个包含矩阵输入编辑框、控制按钮和结果显示文本区的图形用户界面计算器。
---

# 实践项目：GUI 矩阵计算器

本章将指导大家如何使用 MATLAB 的 **App Designer**，将前期基于命令行编写的矩阵计算器算法，封装为一个交互友好的图形用户界面（GUI）。通过本项目，不仅要求掌握界面组件的布局设计，更核心的是理解 **事件驱动编程（Event-Driven Programming）** 的思想以及界面层与业务算法层的彻底解耦。

## 1. 热身项目：动态正弦波绘制 (Hello World)

对于初次接触 GUI 开发的同学，如果直接切入抽象的事件驱动理论，可能会觉得难以理解。因此，在挑战矩阵计算器之前，我们先用一个极简的“频率画图”工具作为热身，它只需要 3 个基础组件，大约 3 分钟即可跑通。先让程序跑起来，我们再去剖析它背后的理论！

### 1.1 界面布局与组件命名

在命令行输入 `appdesigner` 开启图形化设计器。拖拽以下三个组件，并搭建出类似下方的界面：

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

### 1.2 核心破局点：定向坐标轴绘图

在 App Designer 中，最容易踩坑的地方就是绘图。以前我们在命令行直接敲 `plot(x, y)`，图形会自动弹出一个新的 Figure 窗口。**但在 GUI 开发中，界面上可能存在多个画布，你必须显式地告诉编译器，这根曲线要画在哪个指定的坐标轴上！**

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

## 2. 理论进阶：事件驱动与 UI 对象树

在刚刚的热身项目中，我们体会到了点击按钮就能画出图形的神奇效果。现在，让我们来拔高认知，从底层理论剖析这种现象，为后续开发复杂的“矩阵计算器”打好基础。

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

## 3. 核心实战：矩阵计算器骨架搭建

在完成了前面的热身项目和理论铺垫后，我们再来挑战更为复杂的矩阵计算器就游刃有余了。

### 3.1 高保真原型设计
按照现代标准的桌面级工具软件范式，从组件库中拖拽相关组件搭建如下界面：

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

### 3.2 核心组件映射规范
为保证回调代码的健壮与可读性， **绝对禁止** 在工程代码中使用诸如 `Button1`、`TextArea2` 这种默认生成的无意义流水号命名。请在右侧检查器（Inspector）中，严格规范以下系统标识符：
*   **输入框 A**：`TextArea` 组件，`Name` 设为 `MatrixAEditField`。
*   **输入框 B**：`TextArea` 组件，`Name` 设为 `MatrixBEditField`。
*   **执行按钮**：`Button` 组件，`Name` 设为 `SolveButton`。
*   **输出显示区**：`TextArea` 组件，`Name` 设为 `ResultTextArea`，并务必在属性栏中勾选 `ReadOnly`（开启只读模式以防止终端用户恶意篡改计算结果）。

## 4. 数据层：跨界面的数据提取与清洗解析

### 4.1 核心知识点：字符串的降维与解析处理
当用户在 `TextArea` 这种允许多行输入的文本框中敲击内容时，MATLAB 读取到的 `app.MatrixAEditField.Value` 返回的并不是一个单一连续的普通字符串，而是一个 **按换行符切断的多维细胞数组 (Cell Array of Character Vectors)** 。
因此，直接对细胞数组使用 `str2num` 会导致隐式类型转换异常。在传入底层算法引擎前，必须经过两步数据清洗流程：
1. **降维聚合**：利用 `strjoin(..., '\n')` 函数，将多行零碎的细胞数组重新粘合拼接为包含实体换行符的单一连续字符串。
2. **逻辑解析**：使用 `str2num` 函数让 MATLAB 编译器将这段干净的字符解释转化为等价的数值矩阵空间。

### 闯关题目 3：文本解析陷阱识别

为了确保无论是复制粘贴单行文本还是回车输入多行矩阵数据，软件都能稳定正确地完成解析。请补充完整下方位于数据拦截器的数据清洗代码块：
```matlab
% 第一步：获取界面产生的不规则多行字符切片
rawInput = app.MatrixAEditField.______;

% 第二步：将 Cell 切片数组降维拼接为连续字符长链
joinedStr = ______(rawInput, '\n');

% 第三步：提取矩阵数值空间
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

### 5.1 UI 容错与进程防假死策略
图形界面的生命周期与终端程序不同，如果底层算法因为用户恶意的乱填输入格式（如矩阵未闭合、输入非法字符）而触发编译错误，且未被安全隔离捕获的话，系统抛出的底层异常信号将直接阻塞进程，导致整个 UI 假死或闪退。因此，核心计算逻辑必须全部纳入 `try-catch` 保护仓内。

### 5.2 核心算力代码模板接入
在系统自动生成的回调函数结构体内，嵌入前期开发的数学算法核心，并最终将格式化后的计算结果投送回界面结果区：

```matlab
% Callback function: SolveButtonPushed
function SolveButtonPushed(app, event)
    try
        % 1. 数据采集与清洗隔离
        valA = strjoin(app.MatrixAEditField.Value, '\n');
        valB = strjoin(app.MatrixBEditField.Value, '\n');
        A = str2num(valA);
        B = str2num(valB);
        
        if isempty(A) || isempty(B)
            error('输入数据栈为空或格式无法被核心引擎解析。');
        end
        
        % 2. 空间维度合规性检查
        if size(A, 1) ~= size(B, 1)
            error('矩阵 A 的行向量尺度必须严格对应 B 的尺度。');
        end
        
        % 3. 核心计算 (调用系统高精算子)
        x = A \ B;
        resNorm = norm(A*x - B);
        
        % 4. 界面反馈与视图刷新
        outputStr = { ...
            '==========================', ...
            '求解结果目标向量 x =', ...
            formatted_matrix_string(x), ...
            '--------------------------', ...
            sprintf('计算残差范数 ||Ax - B|| = %e', resNorm), ...
            '==========================' ...
        };
        app.ResultTextArea.Value = outputStr;
        
    catch ME
        % TODO: 需要设计符合人机工程学的弹窗错误反馈机制，而不是单纯塞入输入框
        app.ResultTextArea.Value = {['>> 核心线程异常拦截：' ME.message]};
    end
end
```

### 闯关题目 4：优雅的视觉弹窗报错设计

在上方的容错代码示例中，仅仅把错误文字丢进普通结果框内（`app.ResultTextArea.Value = ...`）显然缺乏足够的“警告视觉张力”。
在成熟的桌面软件开发中，对于此类致命性异常必须通过操作系统的独立模态弹窗进行强制阻断性提示。请查阅 AppDesigner 官方文档，将代码的 `catch ME` 处理逻辑，替换为调用 `uialert` 组件弹出一个红色的异常拦截提示窗。

```matlab
catch ME
    % 调用高级别系统警告弹窗
    % 第一个参数：挂载的宿主根窗口指针 UIFigure (在 app 结构树顶部)
    % 第二个参数：被拦截下的致命错误文本特征
    % 第三个参数：弹窗框体的醒目警告语
    ______(app.UIFigure, ME.______, '系统核心运算遭到拒绝');
end
```

<details>
<summary>▶ 查看参考答案</summary>

```matlab
catch ME
    uialert(app.UIFigure, ME.message, '系统核心运算遭到拒绝');
end
```

</details>

## 6. 综合实战工程拓展验证

在主干算力流实现并能跑通基准测试后，作为本阶段考核工程实战的重点，请独立完成以下边缘业务逻辑拓展的设计开发：

1. **缓存复位 (Memory Reset / Clear)**：在视图布局中额外新增一个带有醒目颜色的“清除重置”按钮。点击后，绑定其回调生命周期，一键置空所有的文本区以及内部算法可能驻留的缓存变量。
2. **状态提示 (Status Visual Feedback)**：若矩阵求解动作顺利且残差符合精度，请尝试在输出运算结果的同时，使用代码将结果输出区（`ResultTextArea`）的边框（或其他背景属性）通过属性动画的形式瞬变渲染为绿色。借此提供“即时性视觉正向反馈”。
3. **数据快照导出 (Data Snapshot Export)**：利用 `save` 指令串联图形化的 `uiputfile`（图形化文件保存弹窗句柄），开发一个专门保存运行结果快照的模块，允许操作员将当前求出的最终 $x$ 矩阵数据落盘备份为标准的 `.mat` 加密数据包中。
