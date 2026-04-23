---
layout: page
title: MatNoble | 大学数学教学与技术探索
breadcrumb: 首页
titleTemplate: 构建可解释的数学世界
description: MatNoble 是一站式大学数学与技术探索门户。专注于微积分（微分万能公式、DI表格法）、线性代数教学与 3D 辅助实验室开发。通过技术算法优化数学学习深度，为理工科学生与开发者构建可解释的数学世界。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "MatNoble",
        "url": "https://matnoble.top",
        "description": "专注于大学数学教学与AI技术交叉探索的个人门户。",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://matnoble.top/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
---

<HighFidelityHero 
  name="MatNoble"
  text="The Digital Scholar's Lab"
  tagline="以数学为原点，用代码重构可解释的世界。我们在这里通过算法优化学习，通过可视化洞察本质。"
  :actions="[
    { theme: 'brand', text: '开启探索之旅', link: '/teaching/calculus' },
    { theme: 'alt', text: '了解方法论', link: '/about' }
  ]"
/>

<div class="enterprise-gateway">

<section class="gateway-section">
  <h2 class="section-title">
    核心研学地图
    <span class="section-subtitle">Scholarly Knowledge Graph</span>
  </h2>
  
  <KnowledgeGraph />
</section>

<!-- Section 3: Contact / CTA -->
<section class="gateway-section contact-cta">
  <ContactCta
    title="共同重构数学世界"
    details="探索更高效的学习方式。如果您有教学合作或工具定制需求，欢迎随时联系。"
    :actions="[
      { theme: 'primary', text: '联系作者', link: '/about' },
      { theme: 'secondary', text: 'GitHub', link: 'https://github.com/matnoble', external: true }
    ]"
  />
</section>

</div>

<style scoped>
.enterprise-gateway {
  max-width: 1152px;
  margin: 0 auto;
}

.gateway-section {
  padding: 80px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.gateway-section > * {
  width: 100%;
}

.section-title {
  text-align: center;
  font-family: var(--vp-font-family-heading);
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 48px;
  color: var(--mn-text);
  border: none;
  line-height: 1.2;
}

.section-subtitle {
  display: block;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--mn-text-muted);
  margin-top: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .gateway-section { padding: 40px 16px; }
  .section-title { font-size: 1.6rem; margin-bottom: 24px; }
  .section-subtitle { font-size: 0.9rem; }
}
</style>
