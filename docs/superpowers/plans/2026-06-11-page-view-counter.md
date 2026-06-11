# Page View Counter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a non-blocking, privacy-safe per-page view counter backed by Cloudflare Pages Functions and D1.

**Architecture:** Shared pure functions normalize and blacklist paths. A dedicated Pages Function reads or atomically increments D1, while a lazy Vue component schedules one request after initial rendering and suppresses all local-host traffic.

**Tech Stack:** VitePress, Vue 3, Cloudflare Pages Functions, Cloudflare D1, TypeScript, Node built-in test runner.

---

### Task 1: Path Rules and Database Schema

**Files:**
- Create: `functions/lib/page-views.ts`
- Create: `tests/page-views.test.mjs`
- Create: `migrations/0001_create_page_views.sql`
- Modify: `package.json`

- [ ] Write failing tests for slash/query normalization, blacklisted pages, future ordinary paths, and asset paths.
- [ ] Run `npm test` and confirm the missing module causes failure.
- [ ] Implement `normalizePagePath`, `isPageViewEligible`, and `isLocalHostname` as pure functions.
- [ ] Add the D1 schema with `path` primary key, non-negative `views`, and `updated_at`.
- [ ] Run `npm test` and confirm all path tests pass.
- [ ] Commit as `feat: add page view path rules and schema`.

### Task 2: D1 Pages API

**Files:**
- Create: `functions/api/views.ts`
- Extend: `tests/page-views.test.mjs`

- [ ] Add failing tests using a small fake D1 binding for GET zero, GET existing value, POST atomic result, invalid paths, local POST rejection, origin validation, and database failure.
- [ ] Run `npm test` and confirm API tests fail before implementation.
- [ ] Implement `onRequestGet`, `onRequestPost`, and `onRequest` with JSON responses, prepared statements, origin checks, cache headers, and the atomic UPSERT.
- [ ] Run `npm test` and confirm API and path tests pass.
- [ ] Commit as `feat: add D1 page view API`.

### Task 3: Lazy Client Counter

**Files:**
- Create: `docs/.vitepress/theme/components/PageViews.vue`
- Modify: `docs/.vitepress/theme/index.ts`
- Modify: `docs/.vitepress/theme/components/RelatedPosts.vue`

- [ ] Implement route/frontmatter eligibility, local-host short circuit, 30-minute localStorage deduplication, idle scheduling, abort timeout, and stale-route cancellation.
- [ ] Render a fixed-height, initially invisible metadata row that fades in only after a valid response.
- [ ] Insert the lazy component before related posts, sharing, and comments.
- [ ] Remove the counter's upper divider and soften the related-posts divider.
- [ ] Run `npm test`, `npx tsc --noEmit`, and `npm run docs:build`.
- [ ] Commit as `feat: display asynchronous page views`.

### Task 4: Cloudflare Configuration and Verification

**Files:**
- Create: `wrangler.jsonc`
- Create: `docs/agents/page-view-counter.md`
- Modify: `README.md`

- [ ] Add local Pages/D1 configuration with the `PAGE_VIEWS_DB` binding and explicit placeholder database IDs that must be replaced before CLI deployment.
- [ ] Document database creation, migration application, Pages dashboard binding, preview verification, and local non-counting behavior.
- [ ] Run the complete test, type-check, and production build suite.
- [ ] Start the local VitePress site and verify eligible local pages make no `/api/views` request and show no counter.
- [ ] Inspect the final diff for unrelated files and commit as `docs: add page view deployment guide`.
