# Shared Theme Synchronization

`matnoble-portal` and `matnoble-teach` share a unified frontend theme and custom component layer (located under `docs/.vitepress/theme/`).

## Tracked Shared Resources

The shared inventory is defined in `scripts/sync-shared-theme.mjs`:
- **Components**:
  - `BaseCard.vue`
  - `BlurhashImage.vue`
  - `CodeGroupItem.vue`
  - `Comment.vue`
  - `CopyButton.vue`
  - `DocInfo.vue`
  - `FollowSection.vue`
  - `Hitokoto.vue`
  - `Logo.vue`
  - `NavSearch.vue`
  - `QRCode.vue`
  - `SearchBox.vue`
  - `Share.vue`
  - `SiteMatrix.vue`
  - `ViewsCount.vue`
- **Composables**:
  - `composables/useShare.ts`
- **Styles**:
  - `styles/base.css`
  - `styles/custom.css`
- **Tooling**:
  - `scripts/sync-shared-theme.mjs`
  - `tests/shared-theme-sync.test.mjs`

## Commands

- **Check drift**:
  ```bash
  npm run check:theme
  ```
  Compares MD5 checksums of all tracked files between the companion repositories. Exits with code 1 if differences exist.

- **Synchronize changes**:
  ```bash
  npm run sync:theme
  ```
  Syncs tracked files between both repositories based on modification timestamps (newer replaces older).

- **Automated Verification**:
  ```bash
  npm test
  ```
  Runs `tests/shared-theme-sync.test.mjs` as part of the test suite. If the companion repository is cloned locally at `../matnoble-teach` or `../matnoble-portal`, it enforces zero drift. In CI, it gracefully skips if the peer repo is not present.
