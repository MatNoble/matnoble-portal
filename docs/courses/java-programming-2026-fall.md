---
layout: doc
title: Java程序设计 (2026秋季)
breadcrumb: Java程序设计 (2026秋季)
description: 计算机与软件工程等专业《Java程序设计》（2026秋季学期）教学大纲、章节课件与授课讲义。涵盖语法基础、面向对象、网络通信与并发底座、物联网网关项目实战。
head:
  - - meta
    - name: keywords
      content: Java程序设计, 语法基础, 面向对象, Socket通信, 多线程并发, 异常处理, 物联网网关, Java课件, 课件下载, MatNoble
prev: false
next: false
---

<script setup>
const CDN_BASE = 'https://matnoble.top/pdf/java/2026_fall'

const part1Lectures = [
  { chap: '1.1', topic: 'Java 语言入门与开发环境搭建', filename: 'lec01-java-intro.pdf' },
  { chap: '1.2', topic: '数据类型、变量、常量与运算表达式', filename: 'lec02-data-types.pdf' },
  { chap: '1.3', topic: '控制台交互、格式化 I/O 与 Math 库', filename: 'lec03-console-io.pdf' },
  { chap: '1.4', topic: '流程控制与分支结构（if-else 与 switch）', filename: 'lec04-flow-control.pdf' },
  { chap: '1.5', topic: '循环结构与算法控制（for, while 与转向控制）', filename: 'lec05-loops.pdf' },
  { chap: '1.6', topic: '方法设计、JVM 栈帧与参数值传递机制', filename: 'lec06-methods.pdf' },
  { chap: '1.7', topic: '数组、矩阵操作与 Arrays 工具库', filename: 'lec07-arrays.pdf' },
  { chap: '1.8', topic: '经典排序算法与 ArrayList 动态列表', filename: 'lec08-sort-arraylist.pdf' }
]

const part2Lectures = [
  { chap: '2.1', topic: '面向对象世界观、类与封装性' },
  { chap: '2.2', topic: 'static 静态成员与单例设计模式' },
  { chap: '2.3', topic: '继承性、方法重写与 super 关键字' },
  { chap: '2.4', topic: '多态性、动态绑定与类型转换' },
  { chap: '2.5', topic: '接口设计规范与策略模式' },
  { chap: '2.6', topic: '期中综合实战——智能网联设备中台设计' }
]

const part3Lectures = [
  { chap: '3.1', topic: '字节流 I/O、十六进制编码与通信数据序列化' },
  { chap: '3.2', topic: '网络编程基础与 TCP Socket 通信' },
  { chap: '3.3', topic: 'UDP 数据报通信与自定义二进制帧结构' },
  { chap: '3.4', topic: 'TCP 粘包拆包与有限状态机 (FSM) 协议定界' },
  { chap: '3.5', topic: '多线程基础与并发任务处理' },
  { chap: '3.6', topic: '线程安全、并发锁与阻塞队列' }
]

const part4Lectures = [
  { chap: '4.1', topic: '异常处理、健壮性设计与日志系统' },
  { chap: '4.2', topic: '物联网通信网关综合系统集成' },
  { chap: '4.3', topic: '课程大作业联合调试、性能排查与测试验证' },
  { chap: '4.4', topic: '课程全景知识图谱总结与大作业答辩' }
]
</script>

# Java程序设计 <span class="subtitle">2026 秋季学期</span>

《Java程序设计》是计算机与软件工程等专业核心实践必修课程，内容涵盖语法基础、面向对象世界观、网络通信与并发底座，以及物联网综合实战。本页面提供 2026 秋季学期授课课件下载，随教学进度逐步开放更新。

<p class="mobile-desktop-hint">建议使用电脑桌面端访问，以获得更佳的课件浏览与下载体验。</p>

---

## 章节大纲与课件下载

### 第一篇：语法基础篇

<table class="academic-table">
  <thead>
    <tr>
      <th style="width: 12%">章节</th>
      <th style="width: 73%">知识要点</th>
      <th style="width: 15%; text-align: center;">授课课件</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in part1Lectures" :key="item.chap">
      <td class="chap-num">{{ item.chap }}</td>
      <td class="chap-title">{{ item.topic }}</td>
      <td class="download-cell">
        <a :href="CDN_BASE + '/' + item.filename" target="_blank" rel="noopener" class="btn-dl">PDF 📂</a>
      </td>
    </tr>
  </tbody>
</table>

### 第二篇：面向对象篇

<table class="academic-table">
  <thead>
    <tr>
      <th style="width: 12%">章节</th>
      <th style="width: 73%">知识要点</th>
      <th style="width: 15%; text-align: center;">授课课件</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in part2Lectures" :key="item.chap">
      <td class="chap-num">{{ item.chap }}</td>
      <td class="chap-title">{{ item.topic }}</td>
      <td class="download-cell"><span class="btn-lock">待更新 🔒</span></td>
    </tr>
  </tbody>
</table>

### 第三篇：通信底座与并发篇

<table class="academic-table">
  <thead>
    <tr>
      <th style="width: 12%">章节</th>
      <th style="width: 73%">知识要点</th>
      <th style="width: 15%; text-align: center;">授课课件</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in part3Lectures" :key="item.chap">
      <td class="chap-num">{{ item.chap }}</td>
      <td class="chap-title">{{ item.topic }}</td>
      <td class="download-cell"><span class="btn-lock">待更新 🔒</span></td>
    </tr>
  </tbody>
</table>

### 第四篇：综合实战与系统集成篇

<table class="academic-table">
  <thead>
    <tr>
      <th style="width: 12%">章节</th>
      <th style="width: 73%">知识要点</th>
      <th style="width: 15%; text-align: center;">授课课件</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in part4Lectures" :key="item.chap">
      <td class="chap-num">{{ item.chap }}</td>
      <td class="chap-title">{{ item.topic }}</td>
      <td class="download-cell"><span class="btn-lock">待更新 🔒</span></td>
    </tr>
  </tbody>
</table>

<style scoped>
.subtitle {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--mn-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: -10px;
  margin-bottom: 24px;
}

.sec-eng {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--mn-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-left: 8px;
}

/* 高颜值学术表格样式 */
.academic-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 16px 0 32px;
  background: var(--vp-c-bg-soft);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.3s;
}

.dark .academic-table {
  background: rgba(22, 27, 34, 0.2);
  border-color: rgba(255, 255, 255, 0.04);
}

.academic-table th {
  background: rgba(56, 189, 248, 0.05) !important;
  color: var(--mn-text) !important;
  font-size: 0.88rem !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 14px 18px !important;
  border-bottom: 1.5px solid rgba(56, 189, 248, 0.15) !important;
}

.dark .academic-table th {
  background: rgba(56, 189, 248, 0.02) !important;
  border-bottom-color: rgba(56, 189, 248, 0.1) !important;
}

.academic-table td {
  padding: 14px 18px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03) !important;
  color: var(--mn-text-soft);
  font-size: 0.95rem !important;
  vertical-align: middle;
  transition: all 0.2s ease;
}

.dark .academic-table td {
  border-bottom-color: rgba(255, 255, 255, 0.02) !important;
}

.academic-table tr:last-child td {
  border-bottom: none !important;
}

.academic-table tr:hover td {
  background: rgba(56, 189, 248, 0.03);
  color: var(--mn-text);
}

.dark .academic-table tr:hover td {
  background: rgba(255, 255, 255, 0.01);
}

/* 章节号强调 */
.chap-num {
  font-family: var(--vp-font-family-mono);
  font-weight: 700;
  color: var(--mn-primary) !important;
}

.chap-title {
  font-weight: 500;
}

/* 高颜值下载徽章 */
.download-cell {
  text-align: center !important;
  padding: 8px 18px !important;
}

.btn-dl {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 20px;
  background: var(--mn-primary-soft);
  color: var(--mn-primary) !important;
  border: 1px solid var(--mn-primary-ring);
  text-decoration: none !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(56, 189, 248, 0.05);
}

.btn-dl:hover {
  background: var(--mn-primary);
  color: #ffffff !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--mn-primary-ring);
}

/* 暂未开放状态样式 */
.btn-lock {
  display: inline-flex;
  padding: 4px 12px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--mn-text-muted);
  border: 1px dashed rgba(0, 0, 0, 0.12);
  border-radius: 20px;
  background: transparent;
}

.dark .btn-lock {
  border-color: rgba(255, 255, 255, 0.08);
}
</style>
