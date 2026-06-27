---
layout: doc
title: M 文件与自定义函数规范
breadcrumb: M 文件与函数规范
description: MATLAB 脚本与函数的编写差异、变量及函数的命名规范、代码布局、健壮性逻辑设计、控制流结构，以及命令行矩阵计算器实践项目。
---

# M 文件与自定义函数规范

为了确保代码的易读性、复用性以及团队协作的规范性，编写 MATLAB 代码时应严格遵循统一的编码标准与设计模式。

---

## 1. 脚本 (Script) 与函数 (Function)

MATLAB 代码文件均以 `.m` 为扩展名，按结构主要分为以下两类：

| 维度 | 脚本文件 (Script) | 函数文件 (Function) |
| :--- | :--- | :--- |
| **定义形式** | 顺序执行的命令集合，不包含函数声明头。 | 以 `function` 关键字开头，显式声明输入输出参数。 |
| **工作区范围** | 运行在**主工作区 (Base Workspace)**，内部变量在程序结束后仍保留在内存中，存在变量覆盖风险。 | 运行在**局部工作区 (Local Workspace)**，函数执行结束后内部变量自动销毁，只返回输出参数。 |
| **数据传递** | 无法直接进行参数传递，不具备返回值。 | 通过输入与输出参数列表进行明确的数据交换。 |
| **使用场景** | 流程控制入口、系统初始化或测试画图。 | 独立数学算法模块封装或高内聚功能模块实现。 |

---

## 2. 命名规范与风格

### 2.1 变量命名
*   **局部变量**：采用小驼峰命名法（`camelCase`），即首字母小写，后续各单词首字母大写。
    *   *示例*：`studentTable`、`numStudents`、`classNames`。
*   **常量命名**：采用全大写字母并使用下划线分隔。
    *   *示例*：`MAX_ITERATIONS`、`TOLERANCE`。
*   **循环计数器**：通常使用简短的 `i`、`j`、`k`。但需注意，若代码中涉及复数运算，建议使用 `ii`、`jj` 作为循环索引，以避免覆盖 MATLAB 默认的虚数单位 $\sqrt{-1}$。

### 2.2 文件命名与主函数绑定规则
*   **文件命名拼写**：使用全小写字母并以下划线分隔（`snake_case`），如 `class_manager.m`。
*   **命名绑定约束**：M 文件中的**主函数名称必须与文件名完全保持一致**。
    ::: warning 注意
    MATLAB 对外部函数的检索和识别完全依赖于文件名，而非文件内部第一行的函数声明名称。若将声明为 `function attendance_smart()` 的函数保存在 `attendance_cli.m` 文件中，调用者通过 `attendance_smart()` 将无法识别该函数。
    :::

---

## 3. 自定义函数编写标准结构

一个规范的自定义函数文件应当具备合理的防御性检查与清晰的文档注释：

```matlab
function [out1, out2] = my_algorithm(in1, in2)
% MY_ALGORITHM  计算两个矩阵的特征差异 (H1 描述行)
%   [OUT1, OUT2] = MY_ALGORITHM(IN1, IN2) 接收两个形状相同的矩阵 IN1 与 IN2，
%   并计算出它们的相似度 OUT1 以及残差 OUT2。
%
%   输入参数:
%       in1 - 矩阵 A (double)
%       in2 - 矩阵 B (double)
%
%   输出参数:
%       out1 - 相似度评分 (0~1)
%       out2 - 二次残差值
%
%   创建时间: 2026-06-25, 作者: MatNoble

    % 1. 输入校验
    if ~isequal(size(in1), size(in2))
        error('输入矩阵 in1 和 in2 的维度必须相同。');
    end

    % 2. 计算逻辑
    temp_diff = calculate_diff(in1, in2);
    
    % 3. 赋值返回
    out1 = 1 - temp_diff;
    out2 = temp_diff^2;
end

% ---------------------------------------------------------------------
% 局部子函数 (仅限本文件内部调用)
% ---------------------------------------------------------------------
function diff = calculate_diff(x, y)
    diff = norm(x - y) / (norm(x) + norm(y));
end
```

### 3.1 核心结构要素说明
1.  **H1 描述行**：紧随 `function` 声明后的首行注释。该行用于简短概述函数功能，MATLAB 的 `lookfor` 命令通过检索该行来实现函数搜索。
2.  **帮助文档块 (Help Block)**：接在 H1 描述行后的多行注释，当在命令行输入 `help my_algorithm` 时，该部分注释将被输出展示。
3.  **输入校验**：在核心算法执行前，应对输入的类型、维度及是否为空等边界条件进行判断（如使用 `size`、`isempty`），避免运行中发生异常错误。
4.  **局部子函数 (Local Functions)**：当函数计算逻辑较多时，可将子模块写在同一个文件的末尾。局部子函数仅对当前文件内的主函数可见，有利于代码的封装。

---

## 4. 编程规范建议

### 4.1 分号的必要性
所有命令行的赋值和执行语句末尾，原则上均应加上分号 `;`。**不加分号会导致程序运行中频繁向控制台输出中间值，极大地拉低程序运行效率。**

::: warning 案例：效率杀手
如果你在一个循环了 10 万次的 `for` 语句里，给变量赋值时忘记了加分号，那么这 10 万次的中间结果都会不断往屏幕上刷新输出，原本只需要 0.01 秒的循环可能会卡死控制台好几分钟！
:::

### 4.2 异常捕获 (try-catch)
对于涉及文件读写（如 `load` / `save`）或用户输入（`input`）等具有不确定性的操作，应使用 `try-catch` 结构进行容错处理，避免程序报错崩溃。

```matlab
% ❌ 反面示例：如果 data.mat 不存在，程序会直接红字报错并终止！
load('data.mat');

% ✅ 正面示例：优雅地处理异常
try
    load('data.mat');
    disp('数据加载成功！');
catch ME
    fprintf('数据加载失败，原因：%s\n', ME.message);
    % 此时程序不会崩溃，可以继续执行后续逻辑或使用备用数据
end
```

### 4.3 向量化 (Vectorization) 原则
在处理矩阵或向量数据时，尽量采用 MATLAB 内置的整体运算，**强烈建议避免使用 `for` 循环逐个遍历元素**。内置运算经过底层高度优化，执行速度显著优于循环遍历。

**案例对比：计算一百万个数据的正弦值**
```matlab
% ❌ 低效的做法：使用 for 循环（传统语言思维）
x = 1:1000000;
y = zeros(1, 1000000); % 就算提前预分配了内存，依然不够快
for i = 1:length(x)
    y(i) = sin(x(i));
end

% ✅ 推荐的做法：利用向量化特性（MATLAB 核心思维）
x = 1:1000000;
y = sin(x); % 一行代码搞定！底层高度并行化，速度起飞 🚀
```

---

## 5. 控制流结构

### 5.1 分支结构 (if-elseif-else)
```matlab
score = 85;
if score >= 90
    disp('优秀');
elseif score >= 80
    disp('良好');
else
    disp('继续努力');
end
```

### 5.2 循环结构 (for)
```matlab
% 计算 1 到 100 的累加和
sum_val = 0;
for i = 1:100
    sum_val = sum_val + i;
end
fprintf('累加结果: %d\n', sum_val);
```

### 5.3 循环结构 (while)
```matlab
count = 1;
while count <= 5
    fprintf('当前计数: %d\n', count);
    count = count + 1;
end
```

### 5.4 综合练习题
为了巩固以上控制流和矩阵操作的知识，请尝试完成以下经典编程练习：

1. **矩阵最值查找**：有一个 $4 \times 5$ 的矩阵，请编写程序求其最大值及其所处的位置（行号与列号）。
2. **阶乘求和**：编写程序计算 $\sum_{n=1}^{20} n!$ 的结果。
3. **皮球落地物理模拟**：一个皮球从 100 米高度自由落下，每次落地后反跳回原高度的一半，再落下。求它在第 10 次落地时，共经过了多少米？第 10 次反弹有多高？
4. **自定义函数计算**：已知一个二元函数 $f(x,y) = x^2 + \sin(xy) + 2y$，写一段交互式程序，要求输入自变量 $x$ 和 $y$ 的值，并输出对应的函数值。

<div v-if="!isUnlocked" style="padding: 1rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; margin-top: 1rem; background-color: var(--vp-c-bg-soft);">
  <p style="margin: 0 0 0.5rem 0; font-weight: bold;">🔒 输入密码解锁参考答案</p>
  <div style="display: flex; gap: 0.5rem; align-items: center;">
    <input type="password" v-model="pwd" @keyup.enter="checkPwd" placeholder="请输入助教提供的密码" style="padding: 0.3rem 0.6rem; border: 1px solid var(--vp-c-divider); border-radius: 4px; outline: none; background: var(--vp-c-bg); color: var(--vp-c-text-1); font-size: 0.9em; flex: 1; max-width: 200px;" />
    <button @click="checkPwd" style="padding: 0.3rem 0.8rem; background-color: var(--vp-c-brand); color: white; border-radius: 4px; cursor: pointer; font-size: 0.9em; font-weight: bold; border: none;">解锁</button>
  </div>
  <p v-if="errorMsg" style="color: var(--vp-c-danger-1, #e33); margin: 0.5rem 0 0 0; font-size: 0.9em;">{{ errorMsg }}</p>
</div>

<div v-if="isUnlocked">

**1. 矩阵最值查找**
```matlab
A = rand(4, 5); % 生成一个随机测试矩阵
[max_val, linear_idx] = max(A(:)); % A(:) 将矩阵拉平为列向量寻找最大值
[row, col] = ind2sub(size(A), linear_idx); % 线性索引转行列下标
fprintf('最大值为: %f, 位于第 %d 行, 第 %d 列\n', max_val, row, col);
```

**2. 阶乘求和**
```matlab
% 方法 1：基于 for 循环
total_sum = 0;
curr_factorial = 1;
for n = 1:20
    curr_factorial = curr_factorial * n;
    total_sum = total_sum + curr_factorial;
end
fprintf('使用循环计算结果: %e\n', total_sum);

% 方法 2：利用内置函数向量化 (推荐)
n = 1:20;
fprintf('向量化计算结果: %e\n', sum(factorial(n)));
```

**3. 皮球落地物理模拟**
```matlab
height = 100;
total_distance = height; % 初始化为第一次下落的 100 米

for i = 1:9 % 前 9 次弹起和落下
    height = height / 2; % 弹起的高度
    total_distance = total_distance + height * 2; % 累加弹起和再落下的距离
end

height_10 = height / 2; % 第 10 次落地后的反弹高度
fprintf('第 10 次落地时共经过: %f 米\n', total_distance);
fprintf('第 10 次反弹高度为: %f 米\n', height_10);
```

**4. 自定义函数计算**
```matlab
% 使用匿名函数定义 f(x, y)
f = @(x, y) x^2 + sin(x*y) + 2*y;

% 交互式接收用户输入
x = input('请输入自变量 x 的值: ');
y = input('请输入自变量 y 的值: ');

result = f(x, y);
fprintf('函数 f(%f, %f) 的计算结果为: %f\n', x, y, result);
```

</div>

---

## 6. 实践项目：命令行矩阵计算器 (Matrix Calculator)

本指南用于指导实现一个命令行交互式矩阵计算器。通过本项目的开发，旨在掌握 MATLAB 矩阵表示、切片索引、矩阵级与元素级运算、控制流，以及防御性程序设计的核心应用。

### 7.1 功能设计与模块划分

计算器运行于命令行交互环境下，通过循环机制保持程序运行，并通过用户选择的菜单项对两个全局矩阵变量 $A$ 与 $B$ 进行以下操作：

1.  **矩阵录入与生成**：支持手动录入矩阵（如以 `[1 2; 3 4]` 格式直接解析），或通过内置指令生成单位矩阵、均匀分布随机整数矩阵。
2.  **基本代数运算**：支持两矩阵的加减法、普通矩阵乘法（$A \times B$）、点乘（$A \cdot B$，对应元素相乘）以及矩阵转置。
3.  **高级特征分析**：计算矩阵的秩（`rank`）；如果为方阵，进一步计算其行列式（`det`）并验证其非奇异性（行列式不为 0）后计算其逆矩阵（`inv`）。
4.  **方程组求解**：利用左除算子 `\` 求解线性方程组 $Ax = B$。

### 7.2 实践开发规范

1.  **类型与边界检查**：在执行加减乘除前，必须确保参与计算的矩阵已被定义且不为空（`isempty`）。
2.  **点乘与叉乘尺寸检查**：矩阵乘法 `*` 需校验 $A$ 的列数是否等于 $B$ 的行数；逐元素乘法 `.*` 需校验 $A$ 与 $B$ 的维度是否完全相同。
3.  **支持非方阵方程组求解**：
    *   在求解线性方程组 $Ax = B$ 时，不要限制 $A$ 必须为方阵。
    *   若 $A$ 是矩形矩阵，需根据其尺寸向用户提示方程的约束特性：若行数大于列数，提示该方程组为超定方程组（方程数多于未知数，返回最小二乘解）；若行数小于列数，提示其为欠定方程组（方程数少于未知数，返回最小范数特解）。
    *   计算结果输出后，应求解并打印残差范数 $||Ax - B||$ 以验证解的准确度。
4.  **异常保护处理**：使用 `try-catch` 捕获运算过程中因维度冲突或奇异矩阵引起的异常错误，打印友好错误信息，避免程序直接中止。

### 7.3 骨架模板代码

本模板定义了计算器的交互逻辑架构与输入输出流，核心运算部分已挖空（标有 `TODO` 注释），供编码练习使用：

```matlab
function matrix_calculator_template()
    % 初始化两个默认矩阵
    A = [];
    B = [];
    
    fprintf('==========================================\n');
    fprintf('        MATLAB 矩阵计算器 (学生模板)       \n');
    fprintf('==========================================\n');
    
    while true
        fprintf('\n当前状态:\n');
        show_matrix('A', A);
        show_matrix('B', B);
        
        fprintf('------------------------------------------\n');
        fprintf('  [1] 输入/生成矩阵 A\n');
        fprintf('  [2] 输入/生成矩阵 B\n');
        fprintf('  [3] 矩阵加减法 (A + B / A - B)\n');
        fprintf('  [4] 矩阵乘法 (A * B) 与点乘 (A .* B)\n');
        fprintf('  [5] 矩阵转置 (A'' 或 B'')\n');
        fprintf('  [6] 矩阵特征分析 (行列式 det / 秩 rank / 逆 inv)\n');
        fprintf('  [7] 求解线性方程组 (Ax = B)\n');
        fprintf('  [Q] 退出计算器\n');
        fprintf('------------------------------------------\n');
        
        choice = strtrim(input('请选择操作 >> ', 's'));
        
        if strcmpi(choice, 'q')
            fprintf('感谢使用，再见！\n');
            break;
        end
        
        % 使用 try-catch 结构保证计算器在捕获计算报错后不会中断退出
        try
            switch choice
                case '1'
                    A = input_or_generate_matrix('A');
                case '2'
                    B = input_or_generate_matrix('B');
                case '3'
                    % TODO: 实现矩阵 A 和 B 的加减法并显示结果
                    % 提示 1：需要检查 A 和 B 是否为空 (用 isempty)
                    % 提示 2：矩阵加减法要求 A 和 B 维度相同
                    
                case '4'
                    % TODO: 实现 A * B 和 A .* B 并显示结果
                    % 提示 1：需要检查 A 和 B 是否为空
                    % 提示 2：提供子菜单选择普通乘法 (*) 还是点乘 (.*)
                    
                case '5'
                    % TODO: 实现矩阵的转置并显示结果
                    % 提示：提供子菜单选择转置 A 还是 B，使用单引号 ' 进行转置
                    
                case '6'
                    % TODO: 计算行列式 det(A)、秩 rank(A)、逆 inv(A)
                    % 提示 1：行列式 det(A) 和求逆 inv(A) 仅对方阵有效，求逆前需检查是否为奇异矩阵 (行列式接近 0)
                    % 提示 2：秩 rank(A) 适用于任意形状的矩阵
                    
                case '7'
                    % TODO: 求解 Ax = B (即 x = A \ B)
                    % 提示 1：要求 A 和 B 的行数必须一致
                    % 提示 2：使用 A \ B 进行求解，并计算残差 norm(A*x - B) 验证解的准确度
                    
                otherwise
                    fprintf('>> [警告] 无效的选择，请重新输入。\n');
            end
        catch ME
            % 捕获错误并友好地打印，避免程序崩溃退出
            fprintf('>> [错误] 计算失败！原因: %s\n', ME.message);
        end
    end
end

%% 辅助函数：显示矩阵
function show_matrix(name, M)
    if isempty(M)
        fprintf('  矩阵 %s: [未定义]\n', name);
    else
        [r, c] = size(M);
        fprintf('  矩阵 %s (%dx%d):\n', name, r, c);
        disp(M);
    end
end

%% 辅助函数：输入或生成矩阵
function M = input_or_generate_matrix(name)
    fprintf('\n--- 设置矩阵 %s ---\n', name);
    fprintf('  [M] 手动输入矩阵 (例如: [1 2; 3 4])\n');
    fprintf('  [I] 快速生成单位矩阵 (eye)\n');
    fprintf('  [R] 快速生成随机矩阵 (rand)\n');
    method = upper(strtrim(input('请选择输入方式 >> ', 's')));
    
    switch method
        case 'M'
            M = input('请输入矩阵 (直接按 MATLAB 语法输入，如 [1 2; 3 4])：');
        case 'I'
            n = input('请输入阶数 n: ');
            M = eye(n);
        case 'R'
            r = input('请输入行数 rows: ');
            c = input('请输入列数 cols: ');
            M = randi([0, 10], r, c);
        otherwise
            fprintf('>> [错误] 无效选择，矩阵保持不变。\n');
            M = [];
    end
end
```

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
