---
title: 点名光标 (Roll Call Beacon) - 浏览器点名辅助扩展
description: 结合高校教务系统考勤页面的浏览器扩展，专为教学场景设计。支持在本地对学生名单进行智能识别、随机抽样与护眼高亮展示。纯本地计算，不上传任何教务数据，保障隐私安全。
breadcrumb: 点名光标
structuredData:
  softwareApp:
    name: 点名光标 (Roll Call Beacon)
    category: EducationalApplication
    description: 结合高校教务处系统开发的浏览器点名辅助扩展，支持按固定人数、百分比或黄金比例本地随机抽样并高亮显示学生条目。
---

# 点名光标 (Roll Call Beacon)

**点名光标**（`roll-call-beacon`）是一款专为高校教学场景设计的浏览器扩展（Chrome Extension）。它与学校教务系统的考勤页面深度结合，旨在帮助教师在课堂上进行高效、随机的课堂互动与点名抽考。

该扩展遵循**“纯本地计算、零网络请求”**的设计原则，在保障学校教务敏感数据绝对安全的前提下，通过轻量化的交互设计提升课堂点名效率。

---

## 核心功能 (Core Features)

::: info 💡 设计初衷
在传统的大班教学中，教务系统的名单冗长，手动随机抽问不仅耗时，而且容易产生盲区。“点名光标”通过本地轻量化注入，为教务考勤页面赋予了动态随机抽样与高亮瞩目的能力。
:::

### 1. 智能名单识别
- 自动适应并本地解析教务系统考勤页面中的学生列表区域。
- 识别候选学生姓名与对应条目，无需手动导入或复制名单。

### 2. 科学随机抽样
- **固定人数模式**：指定抽取 $N$ 名学生。
- **百分比模式**：按当前出勤名单的比例进行随机抽样。
- **黄金比例模式**：以美学与随机平衡的黄金比例（约 61.8% 或 38.2%）快速筛选。

### 3. 护眼高亮视觉反馈
- 抽中的学生条目会在页面中以和谐的背景色进行临时高亮展示。
- 仅做视觉高亮，**不勾选复选框，不提交任何表单**，完全保留教师的手动判定权。

### 4. 绝对隐私与安全
- **零网络数据传输**：扩展不申请任何外部域名权限，不向任何服务器发送请求，所有计算与高亮样式均在用户本地浏览器沙盒中完成。
- **配置本地留存**：仅通过浏览器 `localstorage` 保存您的抽样人数偏好，不保存任何学生姓名、学号等隐私信息。

---

## 安装包下载 (Download)

目前该扩展正在审核中，为了方便教师在教学中抢先使用，我们提供免商店的离线安装包：

<div class="download-container">
  <a href="https://assets.matnoble.top/roll-call-beacon-v1.0.0.zip" class="download-btn" id="download-zip-btn">
    <span class="btn-icon">📦</span>
    <span class="btn-text">
      <strong>下载点名光标离线包 (v1.0.0)</strong>
      <small>大小: 约 1.2MB | 格式: .zip 压缩包</small>
    </span>
  </a>
</div>

---

## 离线安装指南 (Installation Guide)

由于此离线包未通过 Chrome Web Store 商店上架，您需要通过浏览器的**开发者模式**手动载入。请按照以下步骤进行操作：

### 第一步：下载并解压
1. 点击上方按钮下载 `roll-call-beacon-v1.0.0.zip`。
2. 将下载的压缩包解压到您电脑的本地文件夹中（例如解压到电脑的“文档”或“工具”目录下，文件夹命名为 `roll-call-beacon`）。
3. **重要提示**：安装完成后，请不要删除或移动该文件夹，否则浏览器将无法加载扩展。

### 第二步：打开浏览器扩展管理
1. 打开您的 Google Chrome 浏览器（或 Microsoft Edge、360极速浏览器等基于 Chromium 内核的浏览器）。
2. 在浏览器地址栏中输入 `chrome://extensions/` 并回车，进入扩展程序管理页面。

### 第三步：开启开发者模式
1. 在扩展程序页面的**右上角**，找到 **“开发者模式”**（Developer mode）开关。
2. 将该开关切换为**开启（ON）**状态。

### 第四步：加载解压后的程序
1. 开启开发者模式后，页面左上角会显示出新的一行菜单。
2. 点击 **“加载已解压的扩展程序”**（英文通常为 **Load unpacked**）按钮。
3. 在弹出的文件夹选择框中，选择您在第一步中解压出来的 **`roll-call-beacon` 文件夹**（即包含 `manifest.json` 文件的那个根目录），然后点击“选择”或“确定”。

### 第五步：固定并使用
1. 安装成功后，您将在扩展列表中看到“点名光标”的图标。
2. 点击浏览器右上角的“拼图”图标（扩展程序按钮），找到“点名光标”，点击旁边的**图钉图标**，将其固定到浏览器工具栏。
3. 当您打开学校教务处系统的考勤点名页面时，点击工具栏中的“点名光标”图标即可唤醒使用。

---

## 开发者与合规说明

- **项目开发者**: MatNoble
- **技术支持邮箱**: contact@matnoble.top
- **合规声明**: 本工具仅作为教学辅助使用，所有功能均符合教务系统使用规范。
- **隐私声明**: 详情请参阅我们的 [《点名光标隐私政策》](./privacy)。

<style scoped>
.download-container {
  margin: 32px 0;
  display: flex;
  justify-content: center;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, var(--vp-c-brand-1) 0%, var(--vp-c-brand-2) 100%);
  color: #ffffff !important;
  padding: 16px 28px;
  border-radius: 12px;
  text-decoration: none !important;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  filter: brightness(1.05);
}

.download-btn:active {
  transform: translateY(1px);
}

.btn-icon {
  font-size: 2.2rem;
}

.btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.3;
}

.btn-text strong {
  font-size: 1.15rem;
}

.btn-text small {
  font-size: 0.8rem;
  opacity: 0.85;
  margin-top: 4px;
}
</style>
