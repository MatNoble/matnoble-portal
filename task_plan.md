# 全矩阵 SEO、Schema 与 GEO (AI 搜索) 综合优化任务计划 (Task Plan)

## 1. 目标
遵循 `claude-seo` 的 2026 技术标准与 Google AI 搜索指南，对 MatNoble 旗下全部 5 个站点（Portal, Teach, Blog, Speak, Album）实施 **A + C 综合方案**：
- **Phase C**: 深度技术体检审计与基准评分 (已完成设计评估)
- **Phase A**: 技术标准化、统一知识图谱与实体对齐、GEO (AI 引文与爬虫) 优化落地

## 2. 站点矩阵与职责
- **Portal** (`https://matnoble.top`): 矩阵核心枢纽，母站实体定义
- **Teach** (`https://teach.matnoble.top`): 教学中心，Course / EducationalOrganization 实体
- **Blog** (`https://blog.matnoble.top`): 思考与博客，BlogPosting 挂载统一 author/publisher
- **Speak** (`https://speak.matnoble.top`): 语音平台，WebApplication 挂载统一 author
- **Album** (`https://album.matnoble.top`): 摄影画廊，VisualArtwork & ProfilePage

## 3. 执行阶段 (Phases)
- [x] **Brainstorming & Design Spec**:
  - 完成 5 站现状诊断、实体图谱设计、爬虫策略设计。
  - 生成设计文档 `docs/superpowers/specs/2026-09-06-matrix-seo-geo-design.md`。
  - 生成实施计划 `docs/superpowers/plans/2026-09-06-matrix-seo-geo-optimization.md`。
- [x] **Phase 1: Robots.txt 与 AI 爬虫分级管理**
  - 统一配置 5 站的 `robots.txt`（明确放行 GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot）。
  - 声明各站自身的 `sitemap.xml` 与母站 `sitemap-matrix.xml`。
- [x] **Phase 2: 全矩阵 Schema.org 跨域实体对齐**
  - Portal: 优化 `config.ts` 中的 Schema 结构，强化全局 `@id` 与 `subOrganization`。
  - Teach: 优化 `config.ts` 中的 `sameAs` 数组与母站组织关联。
  - Blog: 在 `layouts/partials/custom/head.html` 注入关联母站实体的 JSON-LD。
  - Speak: 在 `frontend/index.html` 关联统一 `@id: https://matnoble.top/#person` 与 `isPartOf`。
  - Album: 在 `index.html` 关联统一实体 `@id` 与 `isPartOf`。
- [x] **Phase 3: GEO (AI 搜索) 与元数据一致性强化**
  - 全站统一添加 `meta name="referrer" content="strict-origin-when-cross-origin"`。
  - 规范社交标签 `og:locale` (`zh_CN`) 与 `twitter:card` (`summary_large_image`)。
- [x] **Phase 4: 全站本地构建自检与验证**
  - 分别执行 5 个站点的构建命令，全部 100% 通过（0 报错）：
    - `matnoble-portal`: VitePress build SUCCESS (2.78s)
    - `matnoble-teach`: VitePress build SUCCESS (5.76s)
    - `blog-source`: Hugo build SUCCESS (935ms)
    - `tts/frontend`: Vite build SUCCESS (61ms)
    - `album`: Vite build SUCCESS (83ms)
