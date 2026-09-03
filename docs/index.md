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
const SiteMatrix = defineAsyncComponent(() => import('./.vitepress/theme/components/SiteMatrix.vue'))
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
  
  <SiteMatrix />
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

@media (max-width: 768px) {
  .gateway-section { padding: 32px 16px; }
  .section-title { font-size: 1.6rem; margin-bottom: 20px; }
  .section-subtitle { font-size: 0.9rem; }
}
</style>
