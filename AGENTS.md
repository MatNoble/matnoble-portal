# MatNoble Portal Agent Guidelines

## 1. Git 操作规范 (最高优先级)

- **禁止主动执行任何 Git 暂存或提交操作**：严禁在未得到用户明确指令的情况下执行 `git add`、`git commit` 或 `git push`。
- **验证前不暂存**：开发和调试期间保持工作区清洁，所有代码修改在本地完成并通过自检（`npm test` 与 `npm run docs:build`）。
- **严格遵循用户指令**：只有当用户明确给出提交意图（如“帮我提交 git”、“提交代码并推送”）时，方可按需执行 `git add` 与 `git commit`。

## 2. 双站共享主题与组件同步机制 (Shared Theme)

- **主题共享**：本项目与教学站 `matnoble-teach` 共用一套前端主题设计与交互组件（位于 `docs/.vitepress/theme/`，包括组件、composables、样式文件）。
- **漂移防范**：修改任何共享组件（如 `Share.vue`, `Comment.vue`, `FollowSection.vue`, `useShare.ts` 等）后，必须运行：
  - `npm run check:theme`：检查双站主题一致性。
  - `npm run sync:theme`：自动双向同步更新。
- **自动化测试**：完成工作前必须运行 `npm test`，确保包含 `tests/shared-theme-sync.test.mjs` 的自动化测试套件全部通过。
- 详细说明参见 `docs/agents/theme-sync.md`。

## 3. SPA 响应式交互与状态规范

- **路由响应式**：组件在获取当前页面 URL、路径或页面切换时，必须依赖 Vue 响应式路由（如 `useRoute().path`），严禁使用静态 `window.location.href` 作为依赖，避免 SPA 客户端导航导致 URL/参数滞后（如社交分享、评论区挂载）。
- **Waline 评论区**：路由变化时需使用 `watch(() => route.path)` 主动更新 Waline 实例路径并做好组件卸载清理。

## 4. 本地开发与 RSS 处理

- **RSS 中间件**：VitePress 开发服务器在 `npm run docs:dev` 模式下不会触发 `buildEnd: genFeed`。已在 `docs/.vitepress/config.ts` 中挂载开发中间件，优先读取 `.vitepress/dist/` 下的构建产物，若不存在则回落至线上。
- **构建输出隔离**：严禁将构建生成的 `feed.xml` 或 `atom.xml` 手动提交至 `docs/public/`。

## 5. Agent skills

### Issue tracker

GitHub Issues (using `gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical labels. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout. See `docs/agents/domain.md`.

### Theme synchronization

Shared component synchronizer. See `docs/agents/theme-sync.md`.
