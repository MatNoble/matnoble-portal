# Mobile Desktop Access Hint

## Goal

On each course detail page, show mobile visitors a subtle recommendation to use a desktop computer for a better browsing and download experience.

## Scope

Apply the hint to these course detail pages:

- `docs/courses/advanced-math-2.md`
- `docs/courses/economic-math-2.md`
- `docs/courses/discrete-math.md`

The course index and non-course pages are unchanged.

## Presentation

Place the following text immediately below each course introduction and before the horizontal divider:

> 建议使用电脑桌面端访问，以获得更佳的课件浏览与下载体验。

Render it as ordinary small text with the existing muted text color. It has no icon, background, border, or callout container.

## Responsive Behavior

The hint is hidden by default and displayed only when the viewport width is at most `768px`. This keeps it absent on desktop layouts while covering common phone and small tablet widths.

## Implementation

Use the same semantic class in all three Markdown pages. Define the responsive style in the shared VitePress theme stylesheet so the behavior and visual treatment remain consistent without duplicating CSS across pages.

## Verification

- The production VitePress build succeeds.
- All three generated course pages contain the hint.
- The hint is hidden above `768px` and visible at or below `768px`.
- No other page content or download link changes.
