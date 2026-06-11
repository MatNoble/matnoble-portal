# Audit Archive

This directory stores dated engineering audit records. VitePress excludes `audits/**/*.md` from public pages, sitemap generation, feeds, related-post data, and agent-facing Markdown mirrors.

## 2026-06-09 SEO Audit

- [`2026-06-09/full-audit-report.md`](2026-06-09/full-audit-report.md): original SEO and performance baseline.
- [`2026-06-09/action-plan.md`](2026-06-09/action-plan.md): remediation plan and implementation status at the time of the audit.

Most repository changes listed in the action plan were completed on the `codex/seo-performance-optimization` branch. External DNS and Cloudflare items, especially `www.matnoble.top` TLS and redirect behavior, require separate live-environment verification.

Raw Lighthouse JSON and HTML files are intentionally not archived. They are large, environment-specific, and should be regenerated when a current performance baseline is needed.
