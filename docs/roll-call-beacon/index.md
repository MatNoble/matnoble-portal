---
title: 点名光标 (Roll Call Beacon) - 浏览器点名辅助扩展
description: 结合高校教务系统考勤页面的浏览器扩展。支持在本地解析学生名单、随机抽样并高亮显示。纯本地计算，不上传教务数据。
breadcrumb: 点名光标
structuredData:
  softwareApp:
    name: 点名光标 (Roll Call Beacon)
    category: EducationalApplication
    description: 结合高校教务处系统开发的浏览器点名辅助扩展，支持按固定人数、百分比或黄金比例本地随机抽样并高亮显示学生条目。
---

# 点名光标 (Roll Call Beacon)

<strong>点名光标</strong>（`roll-call-beacon`）是一款用于课堂点名的浏览器扩展，现已上架 Microsoft Edge 扩展市场。它面向学校教务系统的考勤页面，支持随机抽样和高亮显示学生条目。

该扩展遵循 <strong>“纯本地计算、零网络请求”</strong> 的设计原则，不向外部服务器发送学生名单或考勤数据。

<figure class="product-demo">
  <img src="/assets/images/roll-call-beacon/product-demo.png" alt="点名光标在虚构学生考勤名单中随机抽取并高亮学生的界面效果图" loading="lazy">
  <figcaption>插件运行效果示意。图中课程、班级、学号和姓名均为虚构演示数据，不包含真实学生信息。</figcaption>
</figure>

---

## 主要功能 (Core Features)

::: info 设计初衷
大班教学中，教务系统名单较长，手动随机抽问比较费时。“点名光标”在本地读取页面名单，并把抽中的条目高亮显示，减少手动查找。
:::

### 1. 名单识别
- 自动适应并本地解析教务系统考勤页面中的学生列表区域。
- 识别候选学生姓名与对应条目，无需手动导入或复制名单。

### 2. 随机抽样
- <strong>固定人数模式</strong>：指定抽取 $N$ 名学生。
- <strong>百分比模式</strong>：按当前出勤名单的比例进行随机抽样。
- <strong>黄金比例模式</strong>：按约 61.8% 或 38.2% 的比例筛选。

### 3. 高亮反馈
- 抽中的学生条目会在页面中临时高亮显示。
- 仅做视觉高亮，<strong>不勾选复选框，不提交任何表单</strong>，完全保留教师的手动判定权。

### 4. 隐私与安全
- <strong>零网络数据传输</strong>：扩展不申请任何外部域名权限，不向任何服务器发送请求，所有计算与高亮样式均在用户本地浏览器沙盒中完成。
- <strong>配置本地留存</strong>：仅通过浏览器 `localstorage` 保存您的抽样人数偏好，不保存任何学生姓名、学号等隐私信息。

---

## 商店安装 (Install)

推荐通过 Microsoft Edge 扩展市场安装正式发布版本。商店版本可由浏览器自动管理安装状态与后续更新。

<div class="download-container">
  <a href="https://microsoftedge.microsoft.com/addons/detail/%E8%80%83%E5%8B%A4%E9%9A%8F%E6%9C%BA%E7%82%B9%E5%90%8D%E5%8A%A9%E6%89%8B-%E5%AD%A6%E7%94%9F%E6%8A%BD%E6%A0%B7%E9%AB%98%E4%BA%AE%E5%B7%A5%E5%85%B7/cjbbmccelnkmlkeagcachadkipjkbcda" target="_blank" rel="noopener" class="download-btn">
    <span class="btn-icon">🧩</span>
    <span class="btn-text">
      <strong>在 Microsoft Edge 扩展市场安装</strong>
      <small>正式发布版本 v1.0.0 | 支持浏览器自动更新</small>
    </span>
  </a>
</div>

---

## 备用离线包 (Offline Package)

如因网络环境无法访问 Edge 扩展市场，可使用离线安装包手动载入：

<div class="download-container secondary-download">
  <a href="/assets/roll-call-beacon-v1.0.0.zip" class="download-btn offline-btn" id="download-zip-btn">
    <span class="btn-icon">📦</span>
    <span class="btn-text">
      <strong>下载点名光标离线包 (v1.0.0)</strong>
      <small>大小: 约 1.2MB | 格式: .zip 压缩包</small>
    </span>
  </a>
</div>

---

## 安装指南 (Installation Guide)

### 推荐方式：Edge 扩展市场安装

1. 点击上方 <strong>“在 Microsoft Edge 扩展市场安装”</strong> 按钮。
2. 在 Microsoft Edge 扩展市场页面中点击 <strong>“获取”</strong> 或 <strong>“安装”</strong>。
3. 安装成功后，点击浏览器右上角的“扩展”图标，找到“点名光标”，并将其固定到工具栏。
4. 当您打开学校教务处系统的考勤点名页面时，点击工具栏中的“点名光标”图标即可唤醒使用。

### 备用方式：离线安装

离线包需要通过浏览器的 <strong>开发者模式</strong> 手动载入。请按照以下步骤进行操作：

#### 第一步：下载并解压
1. 点击上方按钮下载 `roll-call-beacon-v1.0.0.zip`。
2. 将下载的压缩包解压到您电脑的本地文件夹中（例如解压到电脑的“文档”或“工具”目录下，文件夹命名为 `roll-call-beacon`）。
3. <strong>重要提示</strong>：安装完成后，请不要删除或移动该文件夹，否则浏览器将无法加载扩展。

#### 第二步：打开浏览器扩展管理
1. 打开您的 Google Chrome 浏览器（或 Microsoft Edge、360极速浏览器等基于 Chromium 内核的浏览器）。
2. 在浏览器地址栏中输入 `chrome://extensions/` 并回车，进入扩展程序管理页面。

#### 第三步：开启开发者模式
1. 在扩展程序页面的 <strong>右上角</strong>，找到 <strong>“开发者模式”</strong>（Developer mode）开关。
2. 将该开关切换为 <strong>开启（ON）</strong> 状态。

#### 第四步：加载解压后的程序
1. 开启开发者模式后，页面左上角会显示出新的一行菜单。
2. 点击 <strong>“加载已解压的扩展程序”</strong>（英文通常为 <strong>Load unpacked</strong>）按钮。
3. 在弹出的文件夹选择框中，选择您在第一步中解压出来的 <strong>`roll-call-beacon` 文件夹</strong>（即包含 `manifest.json` 文件的那个根目录），然后点击“选择”或“确定”。

#### 第五步：固定并使用
1. 安装成功后，您将在扩展列表中看到“点名光标”的图标。
2. 点击浏览器右上角的“拼图”图标（扩展程序按钮），找到“点名光标”，点击旁边的 <strong>图钉图标</strong>，将其固定到浏览器工具栏。
3. 当您打开学校教务处系统的考勤点名页面时，点击工具栏中的“点名光标”图标即可唤醒使用。

---

## 开发者与合规说明

- <strong>项目开发者</strong>: MatNoble
- <strong>技术支持邮箱</strong>: contact@matnoble.top
- <strong>合规声明</strong>: 本工具仅作为教学辅助使用，所有功能均符合教务系统使用规范。
- <strong>隐私声明</strong>: 详情请参阅我们的 [《点名光标隐私政策》](./privacy)。

<style scoped>
.product-demo {
  margin: 28px 0 32px;
}

.product-demo img {
  display: block;
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
}

.product-demo figcaption {
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
  line-height: 1.5;
  text-align: center;
}

.download-container {
  margin: 32px 0;
  display: flex;
  justify-content: center;
}

.secondary-download {
  margin-top: 20px;
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

.offline-btn {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-divider);
  box-shadow: var(--shadow-sm);
}

.offline-btn:hover {
  color: var(--vp-c-text-1) !important;
  background: var(--vp-c-bg-mute);
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
