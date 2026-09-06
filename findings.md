# 矩阵互联设计发现与调研纪要 (Findings)

1. **Sitemap 规范约束**：
   - 搜索引擎（如 Google、Bing）不允许一个子站的 `urlset` 里直接写入另一个主机的具体网页 `<loc>`。
   - 但允许在主站部署 `<sitemapindex>`，将属于同一个主体/组织下的各个子域名 sitemap 合并在一起索引（前提是在 Search Console 中完成了泛域名验证）。
2. **5 个站点的现有 Sitemap 状态**：
   - `matnoble-portal`: 由 VitePress 自动生成 `/sitemap.xml`。
   - `matnoble-teach`: 由 VitePress 自动生成 `/sitemap.xml`。
   - `blog-source`: 由 Hugo 模板自动生成 `/sitemap.xml`。
   - `tts`: 在 `frontend/public/sitemap.xml` 中已有静态 XML，指向 `https://speak.matnoble.top/`。
   - `album`: 在 `public/sitemap.xml` 中已有静态 XML，指向 `https://album.matnoble.top/`。
3. **llms.txt 规范**：
   - 在每个站点的根目录提供 `/llms.txt`，是目前 LLM 搜索（Perplexity、ChatGPT、Claude）获取实体身份最重要的公开信标。
