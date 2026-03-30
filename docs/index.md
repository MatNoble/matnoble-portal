---
layout: page
title: MatNoble | 大学数学教学与技术探索
breadcrumb: 首页
titleTemplate: 构建可解释的数学世界
description: 大学数学教师MatNoble的个人门户。专注于微积分、线性代数教学研究，独创微分万能公式与DI表格积分法。结合Anki算法开发Memorize记忆工具，以技术手段将数学计算错误率降低35%。
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
  text="Mathematics as the Core."
  tagline="以数学为原点，用代码重构可解释的世界。致力于数学与计算机科学的交叉探索，构建可解释的方法论。"
  :actions="[
    { theme: 'brand', text: '联系咨询 / 合作', link: '/about' },
    { theme: 'alt', text: '查看教学体系', link: '/teaching/' }
  ]"
/>

<div class="enterprise-gateway">

<!-- Section 2: Solutions by Industry -->
<section class="gateway-section">
  <h2 class="section-title">
    领域集成方案 
    <span class="section-subtitle">Solutions by Field</span>
  </h2>
  <ScholarlyFeatures
    :features="[
      {
        title: '高等数学与微积分',
        details: '深耕<b>微分形式不变性</b>教学。为理工科学生提供高度提炼的「秒杀」计算方案。',
        link: '/teaching/calculus',
        linkText: '查看方案',
        icon: '<path d=&quot;M22 10v6M2 10l10-5 10 5-10 5z&quot;/><path d=&quot;M6 12v5c3 3 9 3 12 0v-5&quot;/>'
      },
      {
        title: '代数与几何实验室',
        details: '基于 <b>WebGL</b> 的 3D 实验室。将抽象曲面可视化，重构线性代数几何感。',
        link: '/teaching/space-geometry-lab',
        linkText: '进入实验室',
        icon: '<path d=&quot;M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5&quot;/>'
      },
      {
        title: '数字化学习工具栈',
        details: '专为开发者与学者设计。集成 <b>Anki 算法</b>与 <b>LaTeX</b> 云同步，强化长期记忆。',
        link: '/tools/',
        linkText: '开始使用',
        icon: '<path d=&quot;M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z&quot;/>'
      }
    ]"
  />
</section>

<!-- Section 3: Solutions by Role -->
<section class="gateway-section">
  <h2 class="section-title">
    定制化学习路径 
    <span class="section-subtitle">Solutions by Role</span>
  </h2>
  <div class="roles-grid">
    <div class="role-card">
      <h3>在校大学生</h3>
      <p>扫清期末复习障碍，建立底层数学素养。</p>
      <a href="/teaching/cheatsheet">获取速查表 &rarr;</a>
    </div>
    <div class="role-card">
      <h3>研究生备考者</h3>
      <p>针对考研数学的高频痛点，提供极限与积分的特项攻坚。</p>
      <a href="/teaching/derivative-method">提升计算力 &rarr;</a>
    </div>
    <div class="role-card">
      <h3>教育技术开发者</h3>
      <p>分享 3D 实验室与自动化教学工具的构建经验。</p>
      <a href="/projects/">技术栈分析 &rarr;</a>
    </div>
  </div>
</section>

<!-- Section 4: Client Logos / Trust Signals -->
<section class="gateway-section">
  <h2 class="section-title">
    驱动技术 
    <span class="section-subtitle">Technology Stack</span>
  </h2>
  <div class="trust-logos">
    <!-- Placeholder SVG Logos following Flat Design -->
    <div class="logo-item" title="Vue.js">Vue</div>
    <div class="logo-item" title="Vite">Vite</div>
    <div class="logo-item" title="LaTeX">LaTeX</div>
    <div class="logo-item" title="MathJax">MathJax</div>
    <div class="logo-item" title="Vercel">Vercel</div>
  </div>
</section>

<!-- Section 5: Contact Sales / CTA -->
<section class="gateway-section contact-cta">
  <div class="cta-card">
    <h2>开启您的数学重构之旅</h2>
    <p>如果您有教学合作、演讲邀请或工具定制需求，欢迎随时联系。</p>
    <div class="cta-actions">
      <a href="/about" class="btn-primary">联系作者</a>
      <a href="https://github.com/matnoble" target="_blank" class="btn-secondary">GitHub 仓库</a>
    </div>
  </div>
</section>

</div>

<style scoped>
.enterprise-gateway {
  max-width: 1152px; /* Adjusted to 1152px for 3-column grid breathing room */
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

/* Roles Grid */
.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}

.role-card {
  padding: 32px;
  background: var(--mn-primary-soft);
  border-radius: 16px;
  transition: transform 0.3s ease;
  border: 1px solid transparent;
}

.role-card:hover {
  transform: translateY(-4px);
  border-color: var(--mn-primary);
}

.role-card h3 {
  margin-top: 0;
  color: var(--mn-primary);
  font-size: 1.4rem;
}

.role-card p {
  color: var(--mn-text-soft);
  margin: 16px 0 24px;
}

.role-card a {
  font-weight: 600;
  color: var(--mn-primary);
  text-decoration: none;
}

/* Trust Logos */
.trust-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 48px;
  opacity: 0.6;
  grayscale: 1;
}

.logo-item {
  font-family: var(--vp-font-family-heading);
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--mn-text-muted);
}

/* CTA Card */
.contact-cta {
  text-align: center;
}

.cta-card {
  background: var(--mn-text);
  color: white;
  padding: 64px 32px;
  border-radius: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.cta-card h2 {
  color: white;
  border: none;
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.cta-card p {
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 32px;
}

.cta-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-primary {
  background: var(--mn-accent);
  color: white;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
}

.btn-secondary {
  border: 2px solid white;
  color: white;
  padding: 10px 32px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
}

@media (max-width: 768px) {
  .gateway-section { padding: 40px 16px; }
  .section-title { font-size: 1.6rem; margin-bottom: 24px; }
  .section-subtitle { font-size: 0.9rem; }
  .cta-card h2 { font-size: 1.8rem; }
  .cta-actions { flex-direction: column; }
}
</style>
