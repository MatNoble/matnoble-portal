---
layout: doc
title: 实践项目一：命令行矩阵计算器
breadcrumb: 矩阵计算器项目
description: MATLAB 第一讲实践课项目：实现一个支持矩阵输入生成、基本代数运算、特征分析（秩、逆、行列式）与非方阵线性方程组求解的多功能命令行矩阵计算器。
---

# 实践项目：命令行矩阵计算器 (Matrix Calculator)

本指南用于指导实现一个命令行交互式矩阵计算器。通过本项目的开发，旨在掌握 MATLAB 矩阵表示、切片索引、矩阵级与元素级运算、控制流，以及防御性程序设计的核心应用。

---

## 1. 功能设计与模块划分

计算器运行于命令行交互环境下，通过循环机制保持程序运行，并通过用户选择的菜单项对两个全局矩阵变量 $A$ 与 $B$ 进行以下操作：

1.  **矩阵录入与生成**：支持手动录入矩阵（如以 `[1 2; 3 4]` 格式直接解析），或通过内置指令生成单位矩阵、均匀分布随机整数矩阵。
2.  **基本代数运算**：支持两矩阵的加减法、普通矩阵乘法（$A \times B$）、点乘（$A \cdot B$，对应元素相乘）以及矩阵转置。
3.  **高级特征分析**：计算矩阵的秩（`rank`）；如果为方阵，进一步计算其行列式（`det`）并验证其非奇异性（行列式不为 0）后计算其逆矩阵（`inv`）。
4.  **方程组求解**：利用左除算子 `\` 求解线性方程组 $Ax = B$。

---

## 2. 实践开发规范

1.  **类型与边界检查**：在执行加减乘除前，必须确保参与计算的矩阵已被定义且不为空（`isempty`）。
2.  **点乘与叉乘尺寸检查**：矩阵乘法 `*` 需校验 $A$ 的列数是否等于 $B$ 的行数；逐元素乘法 `.*` 需校验 $A$ 与 $B$ 的维度是否完全相同。
3.  **支持非方阵方程组求解**：
    *   在求解线性方程组 $Ax = B$ 时，不要限制 $A$ 必须为方阵。
    *   若 $A$ 是矩形矩阵，需根据其尺寸向用户提示方程的约束特性：若行数大于列数，提示该方程组为超定方程组（方程数多于未知数，返回最小二乘解）；若行数小于列数，提示其为欠定方程组（方程数少于未知数，返回最小范数特解）。
    *   计算结果输出后，应求解并打印残差范数 $||Ax - B||$ 以验证解的准确度。
4.  **异常保护处理**：使用 `try-catch` 捕获运算过程中因维度冲突或奇异矩阵引起的异常错误，打印友好错误信息，避免程序直接中止。

---

## 3. 骨架模板代码

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
