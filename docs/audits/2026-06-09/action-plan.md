# MatNoble SEO Action Plan

Audit date: 2026-06-09  
Site: https://matnoble.top

## Implementation Status

Branch: `codex/seo-performance-optimization`

Completed in this branch:

- Added a semantic `h1` to `/tools/countdown` while preserving the fullscreen visual layout.
- Fixed malformed JSON-LD on `/courses/`.
- Removed duplicate `/courses/` title wording and improved course-center metadata.
- Improved homepage, countdown, and ODE page descriptions/titles.
- Improved legal-page descriptions for `/privacy` and `/terms`.
- Added alt text to the sitewide WeChat icon.
- Aligned directory breadcrumb JSON-LD URLs with canonical trailing slashes.
- Added `LazySpaceGeometryLab` so the 3D experiment loads only after user activation.
- Converted several globally registered non-critical components to async components.

Still external:

- `www.matnoble.top` TLS/redirect behavior must be fixed in DNS/Cloudflare.

Verification completed locally:

- `npm run docs:build`
- Generated sitemap: 29 URLs, no internal/blocked routes.
- Generated HTML: 29 pages with canonical and description.
- JSON-LD: no empty or invalid blocks.
- Images: no generated `<img>` without `alt`.

## Critical

No critical indexing blockers were found. The main domain, sitemap, robots.txt, canonicals, and noindex controls are working.

## High Priority

1. Fix `www.matnoble.top` canonical-host behavior.
   - Evidence: `curl -I -L https://www.matnoble.top/` failed TLS during audit.
   - Target: redirect `https://www.matnoble.top/*` to `https://matnoble.top/*`.
   - Likely location: DNS / Cloudflare, not this VitePress repo.
   - Impact: avoids duplicate-host ambiguity, broken user links, and crawler fetch failures.

2. Add an `h1` to `/tools/countdown`.
   - Status: Done in `docs/tools/countdown.md`.
   - Evidence: sitemap crawl found no `h1`.
   - Target: one semantic page heading such as `课堂倒计时`.
   - If the UI should remain fullscreen/minimal, use an accessible visually hidden heading.

3. Fix `/teaching/space-geometry-lab` performance and layout stability.
   - Status: First-pass code fix done with lazy activation; needs post-deploy Lighthouse verification.
   - Evidence: Lighthouse Performance `36`, Total Blocking Time `1,610 ms`, CLS `0.586`, transfer size `1,126 KiB`.
   - Target: lazy-load heavy 3D/WebGL code, reserve stable canvas/container dimensions, and defer non-critical scripts.
   - Impact: this is the clearest measured performance problem in the current audit.

## Medium Priority

4. Fix malformed JSON-LD on `/courses/`.
   - Status: Done in `docs/courses/index.md`.
   - Evidence: one `application/ld+json` script has JSON in a `content` attribute and an empty body.
   - Target: place JSON directly inside the script body.
   - Impact: restores structured-data parsing for that block.

5. Improve homepage first render.
   - Status: First-pass code fix done by async-loading non-critical homepage components; needs Lighthouse verification.
   - Evidence: Lighthouse Performance `57`, FCP `4.0 s`, LCP `6.0 s`, TTI `7.2 s`.
   - Target: reduce unused JavaScript and CSS; Lighthouse estimated `249 KiB` unused JavaScript on the homepage.

6. Remove duplicate wording from `/courses/` title.
   - Status: Done in `docs/courses/index.md`.
   - Current: `课程中心 | 课程中心 | MatNoble`.
   - Suggested: `课程中心：高等数学、线性代数与经济数学课件 | MatNoble`.

7. Improve short or generic titles and descriptions.
   - Status: Done for homepage, countdown, courses, ODE page, terms, and privacy.
   - Homepage title: expand beyond `MatNoble`.
   - `/tools/countdown` description: describe classroom use, fullscreen timer, and teaching workflow.
   - `/terms` and `/privacy`: either improve metadata or consider whether these belong in the sitemap.
   - `/teaching/ode-intuition`: expand description to include second-order constant-coefficient ODE search terms.

8. Add alt text to the sitewide WeChat image.
   - Status: Done in `docs/.vitepress/theme/components/Comment.vue`.
   - Evidence: `/wechat-official-account.png` lacks `alt` on 26 sitemap pages.
   - Suggested alt: `MatNoble 微信公众号二维码`.
   - If decorative, use empty alt and ensure nearby visible text identifies it.

9. Align breadcrumb item URLs with canonical trailing slashes.
   - Status: Done in `docs/.vitepress/config.ts`.
   - Evidence: generated breadcrumb items for directory sections can omit trailing slashes.
   - Target: `/courses/`, `/teaching/`, `/tools/`, and `/projects/` in breadcrumb JSON-LD.

## Low Priority

10. Add HSTS after validating subdomain HTTPS coverage.
   - Suggested header: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
   - Only include `includeSubDomains` after confirming all important subdomains support HTTPS.

11. Re-test performance with PageSpeed Insights field data.
   - Lighthouse lab data has now been collected with `npx lighthouse`.
   - PageSpeed Insights can add CrUX field data when available.

12. Consider more specific educational schema.
    - Candidate pages: course pages, calculus overview, linear algebra overview.
    - Only add schema that accurately reflects the page content.

## Verification Checklist

After fixes, verify:

```bash
npm run docs:build
```

Then check:

```bash
curl -I -L https://www.matnoble.top/
curl -I -L https://matnoble.top/courses
curl -I -L https://matnoble.top/.well-known/markdown/about.md
curl -I -L https://matnoble.top/llms.txt
npx lighthouse https://matnoble.top/teaching/space-geometry-lab --chrome-flags='--headless --no-sandbox'
```

Expected:

- `www` redirects to `https://matnoble.top/`.
- Slash variants redirect to canonical trailing-slash pages where intended.
- Markdown mirrors and LLM files retain `X-Robots-Tag: noindex, follow`.
- Sitemap remains limited to canonical public HTML pages.
