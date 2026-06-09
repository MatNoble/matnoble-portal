---
layout: page
title: 大学数学课程与交互式教学工具
breadcrumb: 首页
titleTemplate: false
description: MatNoble 是面向大学数学教学的个人门户，整理微积分、线性代数、空间解析几何课程内容，并提供 3D 演示、DI 表格法和课堂工具。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "MatNoble",
        "url": "https://matnoble.top",
        "description": "记录大学数学教学内容、交互式课件和相关工具开发的个人站点，覆盖微积分、线性代数和课堂教学工具。"
      }
---

<HighFidelityHero 
  name="MatNoble"
  text="数学课程与教学工具"
  tagline="整理大学数学课程内容，并用代码实现可交互的学习工具。"
  :actions="[
    { theme: 'brand', text: '浏览课程内容', link: '/teaching/calculus' },
    { theme: 'alt', text: '关于 MatNoble', link: '/about' }
  ]"
/>


<div class="enterprise-gateway">

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
  scroll-margin-top: 80px; /* 补偿导航栏高度 */
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
  .gateway-section { padding: 40px 16px; }
  .section-title { font-size: 1.6rem; margin-bottom: 24px; }
  .section-subtitle { font-size: 0.9rem; }
}
</style>
