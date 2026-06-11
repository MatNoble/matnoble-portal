# Page View Counter Operations

The public page-view counter uses the Pages Function at `/api/views` and a D1 binding named `PAGE_VIEWS_DB`. It does not require a separately deployed Worker.

## Create and migrate D1

Install or invoke a current Wrangler release, then create the database:

```bash
npx wrangler d1 create matnoble-page-views
```

Copy the returned database ID into `wrangler.jsonc` for CLI use. Do not commit account credentials or API tokens.

Apply the schema:

```bash
npx wrangler d1 migrations apply matnoble-page-views --remote
```

## Bind the Pages project

In Cloudflare Dashboard:

1. Open **Workers & Pages**, then the MatNoble Pages project.
2. Open **Settings > Bindings**.
3. Add a **D1 database binding**.
4. Use variable name `PAGE_VIEWS_DB`.
5. Select the `matnoble-page-views` database.
6. Redeploy the Pages project so the binding is available to Functions.

Configure the binding for both Preview and Production when preview deployments should exercise the counter. Preview data will use the selected database, so use a separate preview database if isolation is required.

## Local behavior

Normal local VitePress browsing never calls `/api/views` and never displays the counter on:

- `localhost`
- `127.0.0.1`
- `::1`

The API also rejects local `POST` requests. This prevents local development from changing either a local or accidentally bound remote database.

Pure API behavior is covered by `npm test`; production view-count integration should be verified on a Cloudflare Pages preview deployment.

## Preview verification

After deploying a preview with a D1 binding:

1. Open an eligible page such as `/about`.
2. Confirm exactly one `POST /api/views` request succeeds.
3. Refresh within 30 minutes and confirm the page uses `GET /api/views` instead.
4. Open `/privacy` and confirm no request is made and no counter appears.
5. Add `pageViews: false` to a test Markdown page and confirm the same behavior.
6. Temporarily remove the preview binding and confirm the page still renders without a visible error.

## SQL inspection

Inspect the most-viewed pages without exposing an administrative endpoint:

```bash
npx wrangler d1 execute matnoble-page-views --remote \
  --command "SELECT path, views, updated_at FROM page_views ORDER BY views DESC LIMIT 20"
```

## Privacy and counting semantics

- No IP address, identity, or device fingerprint is stored.
- A browser counts a path at most once every 30 minutes when localStorage is available.
- D1 increments are atomic, but the counter is an engagement indicator rather than fraud-resistant analytics.
- GA4 remains the source for deeper traffic analysis.
