# MatNoble SEO Audit Report

Audit date: 2026-06-09  
Audited site: https://matnoble.top  
Business type detected: education / personal teaching portal / interactive math tools  
Scope: live robots.txt, live sitemap.xml, all 29 sitemap URLs, selected edge routes, local VitePress build output, and Lighthouse lab audits via `npx lighthouse`.

## Executive Summary

Overall SEO Health Score: 84/100

MatNoble has a healthy technical SEO foundation. The primary indexable surface is small and coherent: the live sitemap contains 29 URLs, all sitemap URLs return `200`, all checked pages expose self-referencing canonical URLs, and the prior machine-readable route cleanup is deployed. The strongest areas are crawlability, canonical control, structured educational content, and AI-search readiness.

The main remaining risks are not broad indexing blockers. They are cleanup, authority, and performance issues: `www.matnoble.top` does not resolve/serve cleanly over HTTPS, one JSON-LD block is malformed on `/courses/`, `/tools/countdown` has no visible `h1`, one repeated WeChat QR image lacks alt text sitewide, several pages have very generic or short metadata, and the 3D geometry page has poor Lighthouse performance.

Top issues:

1. `https://www.matnoble.top/` failed TLS connection during audit instead of redirecting to `https://matnoble.top/`.
2. `/courses/` contains an empty JSON-LD script because structured data is placed in a `content` attribute.
3. `/tools/countdown` has no `h1`.
4. `/wechat-official-account.png` is missing `alt` on 26 crawled pages.
5. `/teaching/space-geometry-lab` scored `36` in Lighthouse Performance, driven by high Total Blocking Time and Cumulative Layout Shift.

Quick wins:

1. Add a DNS/Cloudflare redirect rule for `www.matnoble.top` to the naked domain.
2. Fix the `/courses/` JSON-LD script so JSON appears inside the script body.
3. Add an accessible `h1` to `/tools/countdown`.
4. Add `alt` text to the WeChat official account image component.
5. Defer heavy JavaScript and stabilize layout on `/teaching/space-geometry-lab`.

## Crawl Summary

- `robots.txt`: reachable with crawler user agent, allows general crawling, lists only `https://matnoble.top/sitemap.xml`.
- `sitemap.xml`: reachable, valid XML, 29 URLs.
- Sitemap URL status: 29/29 returned `200`.
- Canonicals: 29/29 sitemap pages have self-referencing canonical URLs.
- Noindex: 0 sitemap URLs carried `X-Robots-Tag: noindex`.
- Local build: `npm run docs:build` passed and generated a 29 URL sitemap matching the live URL set.
- Machine-readable routes: Markdown mirrors and `llms.txt` are served with `X-Robots-Tag: noindex, follow`, matching source configuration.

## Technical SEO

Score: 19/22

Strengths:

- HTTP redirects to HTTPS correctly.
- Directory slash variants redirect cleanly, for example `/courses` returns `308` to `/courses/`.
- Sitemap excludes internal agent/public Markdown routes.
- `robots.txt` avoids listing non-sitemap discovery files as sitemaps.
- Security headers include `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, frame restrictions, and `X-XSS-Protection`.
- Clean URLs and canonical URLs are configured in `docs/.vitepress/config.ts`.

Issues:

- High: `www.matnoble.top` failed TLS during audit. This should redirect to `https://matnoble.top/` or be explicitly unsupported at DNS level, but search engines and users commonly test `www`.
- Medium: HTML pages use `cache-control: public, max-age=0, must-revalidate`. This is acceptable for freshness but reduces edge-cache benefit.
- Low: No HSTS header was observed. Consider adding `Strict-Transport-Security` after confirming all subdomains are HTTPS-ready.

## Content Quality

Score: 20/23

Strengths:

- Most pages have substantial body content. The crawl measured roughly 688 to 1465 text tokens per page using a mixed Chinese/Latin token heuristic.
- Content has a clear topical identity: university math, calculus, linear algebra, teaching resources, and classroom tools.
- Author identity is present through `Person`, `WebSite`, and profile/contact pages.
- Teaching pages include original explanatory framing and interactive visual materials.

Issues:

- Medium: Some pages are useful but under-positioned for search intent because metadata is generic. Examples: homepage title is just `MatNoble`; `/terms` description is only 21 characters; `/tools/countdown` description is 16 characters.
- Medium: Course pages are strong resource hubs, but could benefit from clearer exam/review/courseware intent in headings and snippet copy.
- Low: Legal/privacy pages are indexable. This is acceptable, but they are low SEO value and may not need sitemap inclusion if crawl budget becomes a concern.

## On-Page SEO

Score: 16/20

Strengths:

- All pages have title tags and meta descriptions.
- All checked canonical URLs are correct.
- Most pages have one `h1` and structured `h2` sections.
- Breadcrumb JSON-LD appears on generated pages.

Issues:

- High: `/tools/countdown` has no `h1`. Add a semantic heading even if visually hidden in the app UI.
- Medium: `/courses/` title is duplicated as `课程中心 | 课程中心 | MatNoble`.
- Medium: Several title tags are short or brand-heavy. The homepage title should describe the offer, for example university math teaching resources and tools.
- Low: Some breadcrumb item URLs omit intended trailing slashes for directory pages in JSON-LD, even though canonical URLs preserve them. Align breadcrumb item URLs with canonicals.

## Schema And Structured Data

Score: 8/10

Strengths:

- 94 JSON-LD scripts were detected across sitemap pages.
- All non-empty JSON-LD scripts parsed as valid JSON.
- Sitewide entity graph includes `Person`, `WebSite`, `EducationalOrganization`, `DefinedTermSet`, `CreativeWork`, and `SoftwareApplication`.
- Article and software schemas are present on relevant pages.

Issues:

- Medium: `/courses/` has one empty JSON-LD script with JSON stored in a `content` attribute. Search engines will ignore that block.
- Low: Educational pages could add more specific `LearningResource`, `Course`, or `EducationalOccupationalCredential` style schema where it accurately fits the content.

## Performance

Score: 5/10

Lighthouse was run with `npx lighthouse` on 2026-06-09. All tested pages scored `100` for Lighthouse SEO, but performance varies significantly.

| Page | Perf | A11y | Best Practices | SEO | FCP | LCP | TBT | CLS | TTI | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `/` | 57 | 94 | 73 | 100 | 4.0 s | 6.0 s | 370 ms | 0 | 7.2 s | 872 KiB |
| `/teaching/derivative-method` | 74 | 100 | 73 | 100 | 2.6 s | 4.4 s | 260 ms | 0.054 | 6.7 s | 831 KiB |
| `/teaching/cheatsheet` | 72 | 96 | 96 | 100 | 2.6 s | 4.3 s | 260 ms | 0.054 | 7.3 s | 812 KiB |
| `/teaching/space-geometry-lab` | 36 | 98 | 73 | 100 | 2.6 s | 2.7 s | 1,610 ms | 0.586 | 8.9 s | 1,126 KiB |
| `/tools/di-method` | 79 | 89 | 73 | 100 | 2.4 s | 3.5 s | 230 ms | 0.054 | 7.7 s | 921 KiB |

Key performance findings:

- `/teaching/space-geometry-lab` is the weakest page: Performance `36`, Total Blocking Time `1,610 ms`, CLS `0.586`, and transfer size `1,126 KiB`.
- Homepage performance is also weak: Performance `57`, FCP `4.0 s`, LCP `6.0 s`, and TTI `7.2 s`.
- Lighthouse flagged unused JavaScript on both homepage and the 3D geometry page. Estimated savings: `249 KiB` on homepage and `376 KiB` on `/teaching/space-geometry-lab`.
- Server response time is not the main problem: root documents were measured between `160 ms` and `260 ms`.

Recommendations:

- Lazy-load Three.js/WebGL and other heavy interactive modules until the user reaches the relevant viewport or opens the tool.
- Reserve stable dimensions for interactive/canvas/media containers, especially on `/teaching/space-geometry-lab`, to reduce CLS.
- Split or defer non-critical JavaScript and CSS that ships sitewide but is unused on first render.
- Re-test with PageSpeed Insights for CrUX field data after deployment.

## Images

Score: 4/5

The crawl found one repeated missing-alt pattern:

- `/wechat-official-account.png`, class `wechat-official-icon`, missing `alt` on 26 sitemap pages.

This is a sitewide component issue, not 26 independent content-image defects. Add a meaningful alt such as `MatNoble 微信公众号二维码`, or `alt=""` only if it is purely decorative and adjacent text already identifies it.

## AI Search Readiness

Score: 9/10

Strengths:

- `llms.txt` and `llms-full.txt` are present and served as `text/markdown`.
- AI/search crawler policy is explicit in `robots.txt`.
- Markdown mirrors under `/.well-known/markdown/` are accessible for parsing and marked `noindex, follow`.
- `Link` headers advertise API catalog, agent skills, MCP server card, and LLM context files.
- Canonical pages are clearly identified as the source of record in `llms-full.txt`.

Issue:

- Low: DNS for AI Discovery is documented in `docs/agents/dns-aid.md`, but DNS publication cannot be verified from this repository alone.

## Local Build Verification

Command run:

```bash
npm run docs:build
```

Result:

- Build completed successfully.
- VitePress generated the sitemap successfully.
- Generated sitemap contains the same 29 canonical URLs observed live.

## Score Breakdown

| Category | Weight | Score |
| --- | ---: | ---: |
| Technical SEO | 22 | 19 |
| Content Quality | 23 | 20 |
| On-Page SEO | 20 | 16 |
| Schema / Structured Data | 10 | 8 |
| Performance | 10 | 5 |
| AI Search Readiness | 10 | 9 |
| Images | 5 | 4 |
| Total | 100 | 84 |

## Lighthouse Artifacts

Generated files:

- `lighthouse-home.report.html`
- `lighthouse-home.report.json`
- `lighthouse-derivative-method.report.json`
- `lighthouse-cheatsheet.report.json`
- `lighthouse-space-geometry-lab.report.json`
- `lighthouse-di-method.report.json`
