---
layout: doc
title: 实践项目二：GUI 界面矩阵计算器
breadcrumb: GUI 矩阵计算器项目
description: MATLAB 第二部分课程实践项目：使用 App Designer 封装矩阵运算核心逻辑，实现一个包含矩阵输入编辑框、控制按钮和结果显示文本区的图形用户界面计算器。
---

# 实践项目：GUI 矩阵计算器

本指南用于指导如何使用 MATLAB 的 App Designer 将之前实现的命令行矩阵计算器重构并打包为一个可视化的图形用户界面（GUI）程序。通过本项目，旨在掌握界面组件设计、回调函数事件响应，以及业务计算逻辑与界面渲染的分离。

---

## 1. 界面布局设计

在命令行输入 `appdesigner` 可打开 MATLAB 的图形开发环境。在空白画板上，我们需要拖拽并排列以下核心组件以搭建交互界面：

```
┌────────────────────────────────────────────────────────┐
│                    矩阵计算器 GUI                       │
├────────────────────────────────────────────────────────┤
│ 矩阵 A 输入区 [TextArea]    │ 矩阵 B 输入区 [TextArea]    │
│ [ [1 2; 3 4]           ]  │ [ [2; 1]               ]  │
├───────────────────────────┴────────────────────────────┤
│ 运算选择区 [Buttons]                                    │
│ [ A+B ]  [ A-B ]  [ A*B ]  [ A.*B ]  [ 转置 ]  [ 分析 ]   │
│                                                        │
│ [                    求解方程组 Ax = B                ] │
├────────────────────────────────────────────────────────┤
│ 结果输出区 [TextArea (Read-Only)]                      │
│ [ 求解成功！                                          ] │
│ [ 结果 x = ...                                         ] │
│ [ 残差范数 = ...                                       ] │
└────────────────────────────────────────────────────────┘
```

### 1.1 组件属性设置
为了方便在代码中引用组件，应在右侧的组件浏览器中将组件命名修改为清晰的英文标识：
*   **A矩阵输入框**：`TextArea`，命名为 `MatrixAEditField`，提示文本设置为 `例如: [1 2; 3 4]`。
*   **B矩阵输入框**：`TextArea`，命名为 `MatrixBEditField`，提示文本设置为 `例如: [2; 1]`。
*   **“求解方程组”按钮**：`Button`，命名为 `SolveButton`，文本设为 `求解方程组 Ax = B`。
*   **结果显示区**：`TextArea`，命名为 `ResultTextArea`，并勾选其属性栏中的 `ReadOnly`（只读）选项。

---

## 2. 界面值提取与数据解析

由于 `TextArea` 组件获取的输入数据为字符串类型，我们需要在后台将其解析转换为 MATLAB 可识别的数值矩阵。

### 2.1 使用 `str2num` 函数解析
在按钮回调函数中，可以使用 `str2num` 将字符串（如 `"[1 2; 3 4]"`）直接解析并还原为矩阵：
```matlab
% 获取界面编辑框中的字符串内容
strA = app.MatrixAEditField.Value;

% 将其解析为数值矩阵
A = str2num(strA{1});  % TextArea 的 Value 属性是一个 cell 数组，取第一行字符串
```

---

## 3. 回调函数 (Callback) 的事件绑定

在 App Designer 中，右键点击“求解方程组 Ax=B”按钮，选择 **Callbacks -> Add ButtonPushedFcn callback**，编辑器将自动跳转至代码试图并生成回调函数模板。

### 3.1 核心回调函数代码实现
在回调函数内部，我们需要编写矩阵合法性检查、线性求解以及结果格式化输出的逻辑：

```matlab
% Callback function: SolveButtonPushed
function SolveButtonPushed(app, event)
    % 使用 try-catch 结构防御计算异常，避免界面假死或闪退
    try
        % 1. 获取输入并解析为数值矩阵
        % Note: TextArea 的 Value 属性一般为 cell 型，需拼接为单个字符向量
        valA = strjoin(app.MatrixAEditField.Value, '\n');
        valB = strjoin(app.MatrixBEditField.Value, '\n');
        
        A = str2num(valA);
        B = str2num(valB);
        
        if isempty(A) || isempty(B)
            error('输入矩阵 A 或 B 的格式不正确，无法解析为数值矩阵。');
        end
        
        % 2. 校验方程组维度约束
        [rA, cA] = size(A);
        [rB, cB] = size(B);
        
        if rA ~= rB
            error('矩阵 A 的行数 (%d) 必须等于 B 的行数 (%d)。', rA, rB);
        end
        
        % 3. 方程特性分析与求解
        if rA == cA
            % 方阵情况，可附带分析行列式
            d = det(A);
            if abs(d) < 1e-10
                txtInfo = sprintf('A 为奇异方阵 (det≈0)，解可能不稳定。\n');
            else
                txtInfo = sprintf('A 为非奇异方阵，有唯一解。\n');
            end
        else
            if rA > cA
                txtInfo = sprintf('A 为非方阵 (%dx%d)，方程组超定，返回最小二乘解。\n', rA, cA);
            else
                txtInfo = sprintf('A 为非方阵 (%dx%d)，方程组欠定，返回最小范数解。\n', rA, cA);
            end
        end
        
        % 4. 计算求解与残差验证
        x = A \ B;
        resNorm = norm(A*x - B);
        
        % 5. 格式化输出字符串并更新界面组件
        outputStr = { ...
            '========================================', ...
            txtInfo, ...
            '求解结果矩阵 x =', ...
            formatted_matrix_string(x), ...
            '----------------------------------------', ...
            sprintf('残差范数 ||Ax - B|| = %e', resNorm), ...
            '========================================' ...
        };
        
        app.ResultTextArea.Value = outputStr;
        
    catch ME
        % 捕捉异常并呈现在界面上
        app.ResultTextArea.Value = {['>> 求解失败！原因: ' ME.message]};
    end
end

% ---------------------------------------------------------------------
% 辅助函数：将数值矩阵格式化为排版整齐的字符串 cell 数组
% ---------------------------------------------------------------------
function strCell = formatted_matrix_string(M)
    [r, c] = size(M);
    strCell = cell(r, 1);
    for i = 1:r
        rowStr = '';
        for j = 1:c
            rowStr = [rowStr, sprintf('    %8.4f', M(i,j))];
        end
        strCell{i} = rowStr;
    end
end
```

---

## 4. 实践课思考与优化任务

在完成了基础按钮绑定后，请尝试在界面中添加新的功能组件以优化计算器：
1.  **清空按钮 (Clear Button)**：添加一个 `Clear` 按钮，点击后清空输入框与结果输出区的值。
2.  **转置快捷键**：设计一个按钮，点击后直接在原编辑框内实现矩阵 $A$ 的转置。
3.  **结果导出**：尝试利用 `save` 函数将求解出的 $x$ 矩阵保存到本地 `.mat` 文件中。
