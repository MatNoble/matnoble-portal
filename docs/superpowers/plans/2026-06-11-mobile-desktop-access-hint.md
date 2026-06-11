# Mobile Desktop Access Hint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a subtle desktop-access recommendation only to mobile visitors on every course detail page.

**Architecture:** Add identical semantic hint markup to the three course Markdown pages and centralize its hidden-by-default responsive presentation in the shared VitePress theme stylesheet. Verification uses source assertions, the production build, and generated asset inspection.

**Tech Stack:** VitePress, Markdown with embedded HTML, CSS media queries

---

### Task 1: Add the shared mobile hint

**Files:**
- Modify: `docs/courses/advanced-math-2.md`
- Modify: `docs/courses/economic-math-2.md`
- Modify: `docs/courses/discrete-math.md`
- Modify: `docs/.vitepress/theme/custom.css`

- [ ] **Step 1: Verify the feature is absent**

Run:

```bash
rg -n "mobile-desktop-hint|建议使用电脑桌面端访问" docs/courses docs/.vitepress/theme/custom.css
```

Expected: no matches.

- [ ] **Step 2: Add the hint markup**

Insert this immediately after each course introduction:

```html
<p class="mobile-desktop-hint">建议使用电脑桌面端访问，以获得更佳的课件浏览与下载体验。</p>
```

- [ ] **Step 3: Add centralized responsive styling**

Append this to `docs/.vitepress/theme/custom.css`:

```css
.mobile-desktop-hint {
  display: none;
  margin: 0.5rem 0 0;
  color: var(--mn-text-muted);
  font-size: 0.8125rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .mobile-desktop-hint {
    display: block;
  }
}
```

- [ ] **Step 4: Verify source coverage**

Run:

```bash
rg -n "mobile-desktop-hint|建议使用电脑桌面端访问" docs/courses/*.md docs/.vitepress/theme/custom.css
```

Expected: one hint in each course detail page and one shared style definition plus one media-query rule.

- [ ] **Step 5: Build and inspect generated output**

Run:

```bash
npm run docs:build
rg -n "mobile-desktop-hint|建议使用电脑桌面端访问" docs/.vitepress/dist/courses/*.html docs/.vitepress/dist/assets/*.css
```

Expected: build succeeds; all three generated course pages include the hint and generated CSS contains the hidden-by-default mobile rule.

- [ ] **Step 6: Commit the implementation**

```bash
git add docs/courses/advanced-math-2.md docs/courses/economic-math-2.md docs/courses/discrete-math.md docs/.vitepress/theme/custom.css docs/superpowers/plans/2026-06-11-mobile-desktop-access-hint.md
git commit -m "feat: add mobile course access hint"
```
