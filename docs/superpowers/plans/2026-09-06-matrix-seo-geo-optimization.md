# 全矩阵 SEO 与 GEO (AI 搜索) 综合优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 依据 `claude-seo` 的 2026 规范与 Google 搜索指南，对 MatNoble 旗下 5 个数字站点（Portal, Teach, Blog, Speak, Album）实施技术标准化、跨域知识图谱统一实体挂接、AI 爬虫分级与 GEO 引文优化。

**Architecture:** 统一母站（`matnoble.top`）的核心组织与人物 Schema `@id`，子站通过父子组织关联与作者引用建立图谱闭环；分级优化 5 站 `robots.txt`，放行生成式 AI 搜索爬虫并聚合母站 `sitemap-matrix.xml`；规范化 Meta 与社交卡片标签；执行 5 站编译自检。

**Tech Stack:** VitePress (TypeScript / Vue 3), Hugo (Go Template / FixIt), Vite + React 18 / 19 (TypeScript / TailwindCSS), Schema.org JSON-LD.

## Global Constraints
- **严禁未经用户明确指令执行任何 git add、git commit 或 git push**。
- 所有修改均需通过本地静态构建命令验证（如 `npm run docs:build`、`hugo`、`npm run build`）。
- 遵循现代典雅画廊与学术站点风格，禁止引入破坏现有 UI 的样式。

---

### Task 1: 5 站 `robots.txt` 规范化与 AI 爬虫分级

**Files:**
- Modify: `/Users/matnoble/Codes/matnoble-portal/docs/public/robots.txt`
- Modify: `/Users/matnoble/Codes/matnoble-teach/docs/public/robots.txt`
- Modify: `/Users/matnoble/Codes/blog-source/layouts/robots.txt`
- Modify: `/Users/matnoble/Codes/tts/frontend/public/robots.txt`
- Modify: `/Users/matnoble/Codes/album/public/robots.txt`

**Interfaces:**
- 核心爬虫标准：放行 `Googlebot`, `Bingbot`, `Baiduspider`
- AI 搜索爬虫标准：放行 `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`
- Sitemap 规范：声明各自单站 `sitemap.xml` 及母站 `https://matnoble.top/sitemap-matrix.xml`

- [ ] **Step 1: 规范 Portal 与 Teach 的 robots.txt**
  将 `matnoble-portal` 与 `matnoble-teach` 中被 Disallow 的 `GPTBot` 调整为 Allow，保留对纯爬虫（如 `CCBot`）的屏蔽或统一分级，确保 AI 搜索正常收录引文。
- [ ] **Step 2: 规范 Blog 的 robots.txt**
  补齐 `OAI-SearchBot` 与 `ClaudeBot`，确保与母站策略一致。
- [ ] **Step 3: 规范 Speak 与 Album 的 robots.txt**
  在保护 `/v1/`, `/admin/`, `/api/admin/` 内部接口的前提下，显式补充 AI 搜索爬虫放行规则。
- [ ] **Step 4: 校验 robots.txt 语法**
  检查各站 `robots.txt` 语法合规性与末尾换行符。

---

### Task 2: Portal (`matnoble-portal`) Schema 升级与实体对齐

**Files:**
- Modify: `/Users/matnoble/Codes/matnoble-portal/docs/.vitepress/config.ts`

**Interfaces:**
- Produces: `@id: https://matnoble.top/#person`, `@id: https://matnoble.top/#organization`, `@id: https://matnoble.top/#website`

- [ ] **Step 1: 调整 config.ts 中的 Schema 定义**
  - 完善 `EducationalOrganization` 与 `Person` 的 `sameAs` 数组，完整覆盖全部 5 站。
  - 清理/降级已被 Google 弃用的 `FAQPage` 强依赖。
  - 确保 `transformHead` 注入正确的 `canonical`、`og:locale`（`zh_CN`）、`twitter:card`。
- [ ] **Step 2: 本地构建验证**
  运行：`cd /Users/matnoble/Codes/matnoble-portal && npm run docs:build`
  预期：0 报错，成功生成 `.vitepress/dist`。

---

### Task 3: Teach (`matnoble-teach`) 跨域实体继承与 Course Schema 优化

**Files:**
- Modify: `/Users/matnoble/Codes/matnoble-teach/docs/.vitepress/config.ts`

**Interfaces:**
- Consumes: `@id: https://matnoble.top/#person`, `@id: https://matnoble.top/#organization`
- Produces: `@id: https://teach.matnoble.top/#organization`, `@id: https://teach.matnoble.top/#website`

- [ ] **Step 1: 完善 teach 的 EducationalOrganization 与 sameAs**
  在 `docs/.vitepress/config.ts` 的 `head` JSON-LD 中，补齐 `sameAs` 中对 `speak` 与 `album` 的引用，确保子机构与母机构的层级继承。
- [ ] **Step 2: 本地构建验证**
  运行：`cd /Users/matnoble/Codes/matnoble-teach && npm run docs:build`
  预期：0 报错，成功生成 `.vitepress/dist`。

---

### Task 4: Blog (`blog-source`) 跨域实体 JSON-LD 注入

**Files:**
- Modify: `/Users/matnoble/Codes/blog-source/layouts/partials/custom/head.html`

**Interfaces:**
- Consumes: `@id: https://matnoble.top/#person`, `@id: https://matnoble.top/#organization`

- [ ] **Step 1: 编写 JSON-LD 实体挂接模板**
  在 `layouts/partials/custom/head.html` 中注入结构化数据，声明博客所属的 `publisher` 为母站教育组织，`author` 为母站统一 Person 实体，并挂载 5 站 `sameAs`。
- [ ] **Step 2: 本地 Hugo 构建验证**
  运行：`cd /Users/matnoble/Codes/blog-source && hugo --gc --minify`
  预期：生成成功，且生成的 HTML 中包含合法的 JSON-LD 脚本标签。

---

### Task 5: Speak (`tts`) 与 Album (`album`) SPA 结构化数据挂接

**Files:**
- Modify: `/Users/matnoble/Codes/tts/frontend/index.html`
- Modify: `/Users/matnoble/Codes/album/index.html`

**Interfaces:**
- Consumes: `@id: https://matnoble.top/#person`, `@id: https://matnoble.top/#organization`, `@id: https://matnoble.top/#website`

- [ ] **Step 1: 升级 Speak 的 WebApplication 结构化数据**
  将 `author` 和 `publisher` 指向统一的母站实体 ID，并增加所属母站矩阵关系。
- [ ] **Step 2: 完善 Album 的 WebSite 与 ProfilePage 结构化数据**
  绑定母站统一 `@id: https://matnoble.top/#person`，确保摄影创作者与数学/技术身份统一。
- [ ] **Step 3: 运行构建自检**
  运行：`cd /Users/matnoble/Codes/tts/frontend && npm run build`
  运行：`cd /Users/matnoble/Codes/album && npm run build`
  预期：两者前端均构建成功。

---

### Task 6: 全矩阵综合验证与成果归档

- [ ] **Step 1: 全站 Sitemap 与 Robots 连通性测试**
  通过脚本校验 5 个站点的静态产物与 XML / Robots 规则。
- [ ] **Step 2: 更新任务进度文档**
  在 `task_plan.md` 和 `progress.md` 中标记完成项，输出完整的执行成果报告供用户审阅。
