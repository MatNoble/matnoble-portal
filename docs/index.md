---
layout: page
title: 大学数学课程、开源工程与数字空间
breadcrumb: 首页
titleTemplate: false
description: MatNoble 是大学数学教师与独立开发者的数字空间，包含教学中心（离散数学、高等数学、3D空间解析几何实验室）、开源工具、技术博客与光影定格。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "MatNoble",
        "url": "https://matnoble.top",
        "description": "大学数学教师与独立开发者 MatNoble 的个人主页与数字空间矩阵。"
      }
---

<script setup>
import { defineAsyncComponent } from 'vue'

const HighFidelityHero = defineAsyncComponent(() => import('./.vitepress/theme/components/HighFidelityHero.vue'))
const KnowledgeGraph = defineAsyncComponent(() => import('./.vitepress/theme/components/KnowledgeGraph.vue'))
const FollowSection = defineAsyncComponent(() => import('./.vitepress/theme/components/FollowSection.vue'))
</script>

<HighFidelityHero 
  name="MatNoble"
  text="大学数学与开源工程"
  tagline="以数学直觉为引领，用代码与算力重塑科学认知与实践。"
  :actions="[
    { theme: 'brand', text: '访问教学中心 ↗', link: 'https://teach.matnoble.top/' },
    { theme: 'alt', text: '关于 MatNoble', link: '/about' }
  ]"
/>

<div class="enterprise-gateway">

<section class="gateway-section">
  <h2 class="section-title">
    站点矩阵
    <span class="section-subtitle">Site Matrix</span>
  </h2>
  
  <div class="matrix-grid">
    <a href="https://teach.matnoble.top/" class="matrix-card primary-card">
      <div class="matrix-badge">核心子站</div>
      <div class="matrix-icon">🎓</div>
      <div class="matrix-title">教学中心 <span class="matrix-arrow">↗</span></div>
      <div class="matrix-desc">《离散数学》《高等数学》《线性代数》等本科课程章节课件下载、3D 空间解析几何实验室与在线教学工具。</div>
      <div class="matrix-domain">teach.matnoble.top</div>
    </a>

    <a href="/projects/" class="matrix-card">
      <div class="matrix-badge neutral-badge">工程成果</div>
      <div class="matrix-icon">💻</div>
      <div class="matrix-title">开源项目</div>
      <div class="matrix-desc">MatNoble-TTS 语音合成工作流、华中科技大学矢量视觉标志等实用工具与开放源码项目。</div>
      <div class="matrix-domain">matnoble.top/projects</div>
    </a>

    <a href="https://blog.matnoble.top" class="matrix-card">
      <div class="matrix-badge neutral-badge">知识手记</div>
      <div class="matrix-icon">✍️</div>
      <div class="matrix-title">技术博客 <span class="matrix-arrow">↗</span></div>
      <div class="matrix-desc">偏微分方程数值计算、现代编程实践与算法思维的深度探索笔记。</div>
      <div class="matrix-domain">blog.matnoble.top</div>
    </a>

    <a href="https://album.matnoble.top/" class="matrix-card">
      <div class="matrix-badge neutral-badge">视觉纪实</div>
      <div class="matrix-icon">📷</div>
      <div class="matrix-title">光影定格 <span class="matrix-arrow">↗</span></div>
      <div class="matrix-desc">镜头下的城市光影、校园四季与自然风光的高清摄影作品精选。</div>
      <div class="matrix-domain">album.matnoble.top</div>
    </a>
  </div>
</section>

<section id="knowledge-graph" class="gateway-section">
  <h2 class="section-title">
    内容地图
    <span class="section-subtitle">Site Map</span>
  </h2>
  
  <KnowledgeGraph />
</section>

<!-- Section 3: Contact / CTA -->
<FollowSection />

</div>

<style scoped>
.enterprise-gateway {
  max-width: 1152px;
  margin: 0 auto;
}

.gateway-section {
  padding: 40px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  scroll-margin-top: 80px;
}

.gateway-section > * {
  width: 100%;
}

.section-title {
  text-align: center;
  font-family: var(--vp-font-family-heading);
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--mn-text);
  border: none;
  line-height: 1.2;
}

.section-subtitle {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--mn-text-muted);
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 矩阵卡片网格 */
.matrix-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
  width: 100%;
  margin-bottom: 1rem;
}

.matrix-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  text-decoration: none;
  transition: all 0.25s ease;
  position: relative;
}

.matrix-card:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.matrix-card.primary-card {
  border-color: rgba(77, 132, 196, 0.3);
  background: linear-gradient(to bottom, var(--vp-c-bg-soft), rgba(77, 132, 196, 0.03));
}

.matrix-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.matrix-badge.neutral-badge {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.matrix-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.matrix-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.matrix-arrow {
  font-size: 0.95rem;
  color: var(--vp-c-brand-1);
}

.matrix-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  flex-grow: 1;
}

.matrix-domain {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
}

@media (max-width: 768px) {
  .gateway-section { padding: 32px 16px; }
  .section-title { font-size: 1.6rem; margin-bottom: 20px; }
  .section-subtitle { font-size: 0.9rem; }
  .matrix-grid { grid-template-columns: 1fr; }
}
</style>
