# 全矩阵站点 SEO 与 GEO (AI 搜索) 综合优化设计方案 (Design Specification)

## 1. 背景与目标 (Background & Goals)
MatNoble 旗下拥有 5 个专注于数学教育、计算机技术与多媒体创作的数字站点（Portal, Teach, Blog, Speak, Album）。
结合 2026 年 Google 搜索引擎政策演进（如富媒体结果向核心行业收紧、AI Overviews 广泛普及）以及 AI 智能体检索生态（ChatGPT Web Search, Perplexity 等），本方案旨在为这 5 个站点打造：
1. **全矩阵 SEO 深度体检与技术标准化 (Audit & Technical SEO)**：统一爬虫抓取控制、规范链接、元数据以及站点地图聚合索引。
2. **跨域知识图谱与实体对齐 (Unified Knowledge Graph & Schema Alignment)**：以母站为核心，统一自然人（Person）与教育机构（EducationalOrganization）全局唯一 `@id`，实现五站相互背书与实体闭环。
3. **生成式 AI 搜索就绪度 (GEO / AEO)**：精细化放行 AI 实时搜索引文爬虫（GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot），并在 `llms.txt` 中强化自包含、高引文价值的实体与业务描述。

---

## 2. 5 站架构与角色矩阵 (Site Architecture & Roles)

| 序号 | 站点代号 | 域名 | 技术栈 | 业务角色定位 | 核心 Schema 类型 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Portal** | `https://matnoble.top` | VitePress (SSG) | 个人数字门户 / 矩阵总枢纽 | `Person`, `EducationalOrganization`, `WebSite`, `ProfilePage` |
| 2 | **Teach** | `https://teach.matnoble.top` | VitePress (SSG) | 大学数学教学中心 / 课件下载 | `Course`, `CourseInstance`, `EducationalOrganization` |
| 3 | **Blog** | `https://blog.matnoble.top` | Hugo + FixIt (SSG) | 深度思考、算法与技术博客 | `Blog`, `BlogPosting`, `Person`, `Organization` |
| 4 | **Speak** | `https://speak.matnoble.top` | Vite + React (SPA) | 免费在线 AI 文字转语音工坊 | `WebApplication`, `BreadcrumbList` |
| 5 | **Album** | `https://album.matnoble.top` | Vite + React (SPA) | 现代典雅摄影与光影画廊 | `WebSite`, `VisualArtwork`, `ProfilePage` |

---

## 3. 技术规范与详细设计 (Technical Design)

### 3.1 跨域统一实体知识图谱 (Unified Entity Graph)
全矩阵共享全局唯一的 Schema.org 实体锚点：
- **核心作者实体 (Person)**：
  - `@id`: `https://matnoble.top/#person`
  - `name`: `MatNoble`
  - `jobTitle`: `University Mathematics Lecturer`
  - `url`: `https://matnoble.top`
  - `sameAs`: 包含 5 个矩阵站、GitHub、Zhihu、YouTube
- **核心矩阵组织 (EducationalOrganization)**：
  - `@id`: `https://matnoble.top/#organization`
  - `name`: `MatNoble`
  - `url`: `https://matnoble.top`
  - `founder`: `{ "@id": "https://matnoble.top/#person" }`
- **各子站实体绑定规则**：
  - `Teach` 声明 `parentOrganization: { "@id": "https://matnoble.top/#organization" }`，课程 provider 指向个人与母站组织。
  - `Blog` 通过自定义 head 模板注入 JSON-LD，将站点 publisher 与 author 锚定到母站 `@id`。
  - `Speak` 在 `WebApplication` 中将 `author` 和 `publisher` 指向母站 `@id`，并声明 `isPartOf: { "@id": "https://matnoble.top/#website" }`。
  - `Album` 在 `ProfilePage` 和 `WebSite` 中使用统一的母站 `@id`。

### 3.2 爬虫策略分级与 Robots.txt 规范 (Robots & AI Crawlers)
5 个站点的 `robots.txt` 统一遵循以下三层结构：
```txt
# 1. 核心搜索引擎爬虫
User-agent: Googlebot
User-agent: Bingbot
User-agent: Baiduspider
Allow: /

# 2. 生成式 AI 搜索与实时浏览爬虫（核心引流，必须放行）
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ClaudeBot
User-agent: PerplexityBot
Allow: /

# 3. 站点地图声明
Sitemap: https://<current-domain>/sitemap.xml
Sitemap: https://matnoble.top/sitemap-matrix.xml
```

### 3.3 GEO 引用优化与 `llms.txt` 双向信标
- **第一屏高引文密度 (High Citability)**：保证主页与核心大纲页面前 30% 内容有完整、无上下文依赖的清晰定义与数据，便于 AI 搜索模型提取为 Direct Answers。
- **`llms.txt` 规范化**：
  - 每个站点根目录均提供标准 `/llms.txt`。
  - 声明该站隶属于 MatNoble 矩阵体系，标明母站与矩阵兄弟站点的精确链接。

### 3.4 基础元数据与技术一致性
- `referrer: strict-origin-when-cross-origin`：全站统一注入。
- `og:locale: zh_CN` 及规范 `twitter:card: summary_large_image`。
- `canonical URL`：确保各站规范链接均为小写、无末尾多余斜杠（除首页外）的标准绝对路径。

---

## 4. 实施阶段与操作计划 (Phases)

### Phase 1: Robots.txt 与全站地图矩阵统一部署
- 检查并更新全部 5 站的 `robots.txt`，确保 AI 搜索爬虫配置与矩阵 Sitemap 路径声明一致。

### Phase 2: 全矩阵 Schema.org 实体挂接
- **Portal**: 优化 `matnoble-portal/docs/.vitepress/config.ts`，降级 `FAQPage`，强化全站图谱。
- **Teach**: 完善 `matnoble-teach/docs/.vitepress/config.ts` 的 `sameAs` 矩阵闭环。
- **Blog**: 在 `blog-source/layouts/partials/custom/head.html` 注入母站实体关联 JSON-LD。
- **Speak**: 在 `tts/frontend/index.html` 完善 `WebApplication` 实体与母站关联。
- **Album**: 在 `album/index.html` 完善 `WebSite` 与 `ProfilePage` 实体关联。

### Phase 3: GEO 引文与 Meta 规范落地
- 审查各站 HTML head 元标签与 `llms.txt` 矩阵互链。

### Phase 4: 构建与语法自检
- 对 5 个仓库分别运行编译命令，保证零语法报错、零破损链接、JSON-LD 语法合法。

---

## 5. 验证与验收标准 (Verification & Acceptance Criteria)
1. **构建自检**：
   - `matnoble-portal`: `npm run docs:build` 成功。
   - `matnoble-teach`: `npm run docs:build` 成功。
   - `blog-source`: `hugo --gc --minify` 成功。
   - `tts/frontend`: `npm run build` 成功。
   - `album`: `npm run build` 成功。
2. **Schema 校验**：
   - 提取生成的 HTML，校验所有 JSON-LD 均符合 Schema.org 规范，`@id` 跨域解析无环回或断链错误。
3. **Robots / Sitemap 校验**：
   - 各站的 `robots.txt` 能正常访问，且正确引用 `sitemap-matrix.xml`。
