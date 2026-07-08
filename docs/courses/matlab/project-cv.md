---
title: 期末综合实战：电子时钟数码管识别与 GUI 封装
breadcrumb: 期末综合实战：电子时钟数码管识别
description: MATLAB 计算机视觉综合大作业。结合电子、通信与光电专业背景，从图像预处理、形态学缝合、连通域特征提取，一直到七段译码器解码，最终封装为带 GUI 交互的智能识别桌面软件。
head:
  - - meta
    - name: keywords
      content: MATLAB计算机视觉, 数码管识别, 7-Segment, 形态学处理, 图像分割, App Designer, 期末大作业
---

# 期末综合实战：电子时钟数码管识别与 GUI 封装

这是咱们这门课的期末大作业。这次大家要自己动手写个程序，让计算机去认出照片里电子时钟上的数字。

平时做硬件，都是用单片机去点亮数码管。今天我们反着来：扔给电脑一张照片，让 MATLAB 把屏幕上的数字抠出来读懂。

<img :src="'/p/clock.png'" alt="数码管原始图像" />

*(测试素材：大家可以右键保存上面这张图，作为这次实验的标准输入。)*

---

咱们按照经典的视觉流水线，分 6 步搞定它：

1. **图像采集/输入**
2. **色彩阈值分割 (前景提取)**
3. **形态学滤波 (去噪)**
4. **连通域分析 (定位与分割)**
5. **特征工程 (七段特征提取)**
6. **分类器 (查表译码)**

---

## 1. 图像采集/输入

首先，得把照片读进 MATLAB 里。

同学们记住，读入一张彩色照片时，MATLAB 眼里看到的是一个三维矩阵（长 $\times$ 宽 $\times$ 3）。这第三个维度装的就是红 (R)、绿 (G)、蓝 (B) 三个通道。知道了这点，后面用 `img(:,:,1)` 单独抽出红色层就顺理成章了。

```matlab
% 读取图像文件，img 是一个 MxNx3 的三维矩阵
try
    img = imread('digital_clock.png');
catch
    error('请确保当前运行目录下存在 digital_clock.png 图片。');
end

% 提取 R、G、B 通道分量矩阵
R = img(:,:,1);
G = img(:,:,2);
B = img(:,:,3);
```

---

## 2. 色彩阈值分割 (前景提取)

拿到照片，下一步就是把发着红光的数字从黑底里分离出来。这步做完，你会得到一张纯黑白的二值化图像（Mask）。白的部分代表数字，黑的代表背景。

既然数码管亮着红光，那它的 R 通道值肯定远大于 G 和 B。利用这个特征，我们设个阈值，拿逻辑符号（`>` 和 `&`）一卡，红字就现形了。注意，MATLAB 做矩阵比大小时，会直接还给你一个同等大小、全是 `0` 和 `1` 的逻辑矩阵，这点非常省事。

```matlab
% 色彩差值分割：提取红色分量显著大于绿色和蓝色的区域
% 设定阈值：红通道绝对值大于 150，且与蓝绿通道的差值大于 50
bw = (R > 150) & (R - G > 50) & (R - B > 50);

figure;
imshow(bw);
title('2. 色彩阈值分割结果');
```

---

## 3. 形态学滤波 (去噪)

二值图虽然有了，但别急着往下走。你们仔细观察会发现，数码管的每根线段中间都有断裂的物理黑缝。要是直接去找连通域，系统绝对会把一个 8 拆成 7 个零件。所以，得先给它做个“缝合”手术顺带去噪。

*   **闭运算 (`imclose`)**：说白了就是“先膨胀后腐蚀”。它能把数字内部的断裂糊上，同时又不会让数字轮廓发福得太厉害。
*   **结构元素 (`strel`)**：用来告诉系统你要拿个多大的刷子去缝合。

```matlab
% 1. 构造结构元素：采用 15x15 的矩形窗口以覆盖线段间的缝隙
se = strel('rectangle', [15, 15]); 

% 2. 执行闭运算：缝合物理断裂
bw_closed = imclose(bw, se);       

% 3. 噪声过滤：把面积小于 500 像素的孤立噪点直接抹掉
bw_clean = bwareaopen(bw_closed, 500); 

figure;
imshow(bw_clean);
title('3. 形态学滤波去噪结果');
```

---

## 4. 连通域分析 (定位与分割)

现在图像上的每个数字都成了一整块完整的白斑。我们呼叫连通域分析，把它们的位置坐标一个不落挖出来。

*   **`regionprops`**：这是个极其好用的函数。拿它一扫，目标的面积、包围框 (`BoundingBox`) 就全有了。

```matlab
% 特征提取：获取连通域的边界框 (BoundingBox) 和面积 (Area)
stats = regionprops(bw_clean, 'BoundingBox', 'Area');

% 🚨 防坑预警：坐标排序
% regionprops 给你的结果顺序是乱的。
% 如果不想最后读出的时间变成乱码，乖乖拿 X 坐标给它们重新排个队：
bboxes = reshape([stats.BoundingBox], 4, [])';
[~, sort_idx] = sort(bboxes(:, 1));
stats = stats(sort_idx);

figure;
imshow(bw_clean); hold on;

% 遍历并在处理后的二值图像上绘制定位框
for i = 1:length(stats)
    bbox = stats(i).BoundingBox;
    % 依据先验知识过滤非目标区域（比如中间的冒号，太矮了，跳过不画框）
    if bbox(4) > 50  
        rectangle('Position', bbox, 'EdgeColor', 'g', 'LineWidth', 2);
    end
end
title('4. 连通域定位与分割');
```

---

## 5. 特征工程 (七段特征提取)

位置都找准了，接下来就是把每个数字单拎出来（做局部切片），并提取它的 7 段特征。行规的七段数码管编号是这样的：
1: 上横, 2: 左上竖, 3: 右上竖, 4: 中横, 5: 左下竖, 6: 右下竖, 7: 下横。

别把代码全塞主函数里，把这步单独写个 `extract_7seg_features.m`，代码看起来会清爽很多。

```matlab
function code = extract_7seg_features(digit_img)
    % 输入: digit_img - 切片后的单个数字黑白图
    % 输出: code - 长度为 7 的布尔数组，哪段亮哪段就是 1

    [H, W] = size(digit_img);
    
    % 1. 横向采样区 (高度只取边缘，宽度取中间 40%~60%，刻意避开两边的竖线)
    c_mid = max(1, round(W*0.4)) : min(W, round(W*0.6));
    region_top = digit_img(1 : max(1, round(H*0.2)), c_mid);           
    region_mid = digit_img(max(1, round(H*0.4)) : min(H, round(H*0.6)), c_mid); 
    region_bot = digit_img(min(H, round(H*0.8)) : H, c_mid);           
    
    % 2. 纵向采样区 (高度避开中间横线，宽度放宽，哪怕有点斜体也能包住)
    r_top = max(1, round(H*0.25)) : min(H, round(H*0.45));
    r_bot = max(1, round(H*0.55)) : min(H, round(H*0.75));
    c_left  = 1 : max(1, round(W*0.4));
    c_right = min(W, round(W*0.6)) : W;
    
    region_tl = digit_img(r_top, c_left);   
    region_tr = digit_img(r_top, c_right);  
    region_bl = digit_img(r_bot, c_left);   
    region_br = digit_img(r_bot, c_right); 
    
    % 3. 统计每个区域的平均亮度
    means = [mean(region_top(:)), mean(region_tl(:)), mean(region_tr(:)), ...
             mean(region_mid(:)), mean(region_bl(:)), mean(region_br(:)), ...
             mean(region_bot(:))];
             
    % 判断是否点亮：平均亮度过个 0.15 的及格线，就算它亮了。
    code = means > 0.15;
end
```

---

## 6. 分类器 (查表译码)

临门一脚。手头已经拿到了长度为 7 的 0/1 密码本，怎么认出它是几？最粗暴有效的就是查表法：直接拿密码本去对账单。

同样，写个独立的 `seg7_decode.m`。

```matlab
function digit = seg7_decode(seg)
    % 拿着 7 段亮灭状态，去译 0-9 的码
    digits_map = [
        1, 1, 1, 0, 1, 1, 1; % 0
        0, 0, 1, 0, 0, 1, 0; % 1
        1, 0, 1, 1, 1, 0, 1; % 2
        1, 0, 1, 1, 0, 1, 1; % 3
        0, 1, 1, 1, 0, 1, 0; % 4
        1, 1, 0, 1, 0, 1, 1; % 5
        1, 1, 0, 1, 1, 1, 1; % 6
        1, 0, 1, 0, 0, 1, 0; % 7
        1, 1, 1, 1, 1, 1, 1; % 8
        1, 1, 1, 1, 0, 1, 1  % 9
    ];
    
    digit = NaN; % 默认译不出
    
    % 循环比对输入状态与标准映射表
    for i = 1:10
        if isequal(seg(:)', digits_map(i, :))
            digit = i - 1; % 索引 1 对应数字 0，以此类推
            return;
        end
    end
end
```

> **提示：数字 1 的特殊处理**
> 数字 1 实在太瘦了，如果死板地按上面的网格硬切，肯定会错乱甚至越界。主循环切图前可以加个拦截特判：如果算出来的宽高比 `w/h < 0.35`，直接拍板它是数字 1，跳过提取和查表步骤。

---

## 7. 综合实践项目：GUI 智能识别应用

底层算法都跑通了？很好。现在进入产品阶段：你需要把前面的逻辑包进一个有界面的桌面软件里。

### 交付要求

1. **界面设计**：在 MATLAB 敲 `appdesigner` 启动它，搭个像样的界面。得有：
   * 导图片的按钮。
   * 跑算法的执行按钮。
   * 至少两个 `UIAxes` 画板，用来对比原图和提取中间结果。
   * 一个大号字的 `Label`，专门用来显示拼接出来的最终时间（比如 `11:58 19`）。
2. **逻辑封装**：把上面这 6 步主逻辑封装好，绑到对应按钮的回调函数 (`Callback`) 里。
3. **你得交什么**：
   * 跑得通的 `*.mlapp` 源文件。
   * 一份独立 PDF 报告。要有程序流程图、0-9 特征码表，还有形态学处理前后的疗效对比图。
