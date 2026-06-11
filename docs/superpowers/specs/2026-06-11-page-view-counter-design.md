# Page View Counter Design

## Goal

Add a public per-page view counter to MatNoble Portal without delaying content rendering or introducing a separate Worker deployment. The counter will use a Cloudflare Pages Function and D1, appear after article content, and degrade silently when analytics infrastructure is unavailable.

## Product Decisions

- Display per-page views only; do not display a site-wide total.
- Place the counter after the document body and before related posts and sharing controls.
- Count the same browser and normalized path at most once every 30 minutes.
- Enable counting for ordinary pages by default, including `/about`, `/faq`, and `/roll-call-beacon/*`.
- Exclude only technical, legal, and explicitly opted-out pages.
- Disable the counter completely on `localhost`, `127.0.0.1`, and `::1`; local browsing must never increment page views.
- Do not collect IP addresses, user identities, device fingerprints, or raw user-agent data.

## Page Eligibility

Eligibility uses a blacklist rather than a content-path whitelist so future sections are counted automatically.

The counter is disabled for:

- `/`
- `/404` and `/404.html`
- `/privacy` and `/privacy.html`
- `/terms` and `/terms.html`
- `/api/*`
- `/agents/*`
- `/.well-known/*`
- asset requests and paths whose final segment contains a file extension
- Markdown pages with `pageViews: false` in frontmatter

The browser and API both enforce applicable path rules. Client checks prevent unnecessary requests; server checks protect the database from malformed or ineligible paths. Frontmatter is a presentation/build concern and is enforced by the client, while the API enforces the route blacklist independently.

## Architecture

```text
VitePress content page renders
          |
          v
PageViews component mounts without blocking navigation
          |
          v
requestIdleCallback (800 ms fallback)
          |
          v
normalize path and inspect 30-minute localStorage timestamp
          |
          +---- recent visit ----> GET /api/views?path=...
          |
          +---- new visit -------> POST /api/views { path }
                                      |
                                      v
                          Pages Function validates request
                                      |
                                      v
                          D1 prepared atomic UPSERT
                                      |
                                      v
                             { "views": 1284 }
```

No request is made during static generation. The counter is a non-critical client enhancement and is not awaited by VitePress navigation.

## Data Model

Migration:

```sql
CREATE TABLE page_views (
  path TEXT PRIMARY KEY,
  views INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

The normalized path is the primary key. Query strings and fragments are never stored.

Atomic increment:

```sql
INSERT INTO page_views (path, views, updated_at)
VALUES (?1, 1, CURRENT_TIMESTAMP)
ON CONFLICT(path) DO UPDATE SET
  views = page_views.views + 1,
  updated_at = CURRENT_TIMESTAMP
RETURNING views;
```

The increment is a single SQL statement. There is no read-modify-write sequence in application code, so concurrent requests do not overwrite each other.

## API Contract

### Read

`GET /api/views?path=/teaching/example`

Success:

```json
{ "views": 1284 }
```

An eligible path without a row returns `{ "views": 0 }`.

### Increment

`POST /api/views`

Request:

```json
{ "path": "/teaching/example" }
```

Success returns the value produced by the atomic UPSERT:

```json
{ "views": 1285 }
```

### Validation and Responses

- Only `GET` and `POST` are accepted.
- `POST` requires `application/json` and a same-origin `Origin` header in production.
- `POST` rejects requests whose request URL hostname is `localhost`, `127.0.0.1`, or `::1`, preventing local Pages Function testing from mutating any bound database.
- Paths must be absolute site paths, contain no scheme or host, and remain below a conservative length limit.
- The server normalizes duplicate slashes and trailing slashes, and removes query strings and fragments.
- Ineligible paths return `404` so the endpoint does not disclose or create counters for them.
- Malformed requests return `400` or `415`; unsupported methods return `405` with an `Allow` header.
- Database failures return a small `503` JSON response and are not exposed in the page UI.
- Responses set `Content-Type: application/json; charset=utf-8` and `X-Content-Type-Options: nosniff`.
- `POST` and errors use `Cache-Control: no-store`.
- `GET` uses `Cache-Control: public, max-age=0, s-maxage=30` because a slightly stale display is acceptable.

## Client Behavior

The component receives the current VitePress route and frontmatter. On every route change it:

1. Cancels any request and idle callback belonging to the previous route.
2. Resets its visible state while preserving fixed layout height.
3. Stops immediately on `localhost`, `127.0.0.1`, or `::1`, without reading storage or making an API request.
4. Checks page eligibility and `pageViews: false`.
5. Waits for browser idle time, with an 800 ms `setTimeout` fallback when `requestIdleCallback` is unavailable.
6. Reads a namespaced localStorage timestamp for the normalized path.
7. Uses `GET` when the previous counted visit is less than 30 minutes old; otherwise uses `POST`.
8. Records the timestamp only after a successful increment response.
9. Fades in the formatted count after a successful response.

Requests use `AbortController` with a 2.5 second timeout. Errors, timeouts, unavailable storage, malformed responses, and missing D1 bindings leave the component hidden. They do not trigger retries or console noise in normal production use.

If localStorage is unavailable, the component can still fetch the count but must avoid aggressive repeated increments during the same mounted page lifecycle. Storage is an analytics-quality optimization, not a prerequisite for reading content.

## Visual Design

The component is a quiet metadata row:

- eye outline icon
- text `已浏览 1,284 次`
- 13 px secondary text color
- slightly stronger weight on the number
- no upper divider
- modest spacing after the final paragraph
- fixed minimum height to prevent layout shift

The related-posts divider remains but uses a lower-opacity divider color. The counter does not use a card, background fill, heading, spinner, or error state. Before success it is visually transparent; on success it fades in. Motion is disabled when `prefers-reduced-motion: reduce` applies.

## Layout Integration

The VitePress `doc-after` slot order becomes:

1. `PageViews`
2. `RelatedPosts`
3. `Share`
4. `Comment`

The component is registered as an async component so its code is split from the initial theme bundle. It must not render on the home layout or on blacklisted/opted-out pages.

## Performance Budget

- No D1 or API work during static generation.
- No synchronous network request or navigation blocking.
- One API request per eligible route navigation.
- Counter JavaScript remains a small lazy-loaded chunk.
- No spinner animation, polling, retry loop, or third-party script.
- No layout shift from loading or failure states.
- API timeout is capped near 2.5 seconds and requests are aborted on route changes.
- The feature must not add a new render-blocking asset or materially change Lighthouse performance metrics.

## Security and Abuse Boundaries

- All SQL uses prepared statements with bound parameters.
- The API accepts only normalized local paths.
- Same-origin validation reduces drive-by cross-site increments.
- Local-host checks exist in both the component and increment API so local browsing and direct local API tests cannot change counts.
- D1 atomic updates preserve increments under normal concurrency.
- The 30-minute browser rule reduces accidental refresh inflation but is not an anti-fraud system.
- No fingerprinting or IP-based identity is introduced.
- Deliberate automated inflation remains possible; stronger abuse controls are explicitly out of scope unless observed traffic makes them necessary.

## Files

Expected additions and edits:

- `functions/api/views.ts`: Pages Function API
- `functions/lib/page-views.ts`: shared normalization and eligibility logic
- `docs/.vitepress/theme/components/PageViews.vue`: lazy client component
- `docs/.vitepress/theme/index.ts`: slot integration
- `migrations/0001_create_page_views.sql`: D1 schema
- `wrangler.jsonc`: local/CLI Pages and D1 configuration
- focused tests for pure routing logic and API behavior
- deployment documentation for creating and binding the D1 database

The existing `functions/[[path]].ts` Markdown negotiation route remains unchanged. Cloudflare Pages routing selects the more specific `/api/views` function before the catch-all route.

## Deployment

1. Create a D1 database for page-view data.
2. Apply the checked-in migration.
3. Add the D1 binding to the Cloudflare Pages project, using a stable binding name such as `PAGE_VIEWS_DB`.
4. Configure the production D1 binding in the Cloudflare Pages dashboard. Keep Wrangler configuration for local development and CLI migration commands.
5. Deploy the Pages project normally; no separate Worker service is required.
6. Verify read, increment, blacklist, and failure behavior on the Pages preview domain before production promotion.

## Testing and Acceptance

Automated tests cover:

- path normalization
- blacklist decisions
- asset/file-extension rejection
- trailing slash and query normalization
- malformed API requests
- GET returning zero for a missing eligible path
- POST using the atomic increment result
- database error handling

Build and runtime verification cover:

- `npm run docs:build`
- Pages Function type/build compatibility
- desktop and mobile placement
- route navigation cancellation and state reset
- 30-minute client deduplication
- `pageViews: false`
- no component request or D1 mutation on `localhost`, `127.0.0.1`, or `::1`
- D1 unavailable or unbound behavior
- no console errors in the normal flow
- no visible loading error, spinner, or layout shift

The feature is complete when new ordinary content paths are counted by default, excluded pages never query or mutate D1, repeated visits inside 30 minutes do not increment, concurrent increments do not lose updates, and page reading remains unaffected by API failure.

## Out of Scope

- site-wide totals
- unique visitor reporting
- administrative dashboards
- historical charts
- server-side fingerprinting
- bot scoring services
- import of historical GA4 data
- exact parity with GA4 page-view definitions
