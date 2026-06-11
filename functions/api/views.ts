import { isLocalHostname, isPageViewEligible, normalizePagePath } from "../lib/page-views.ts";

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T>(): Promise<T | null>;
}

interface D1Database {
  prepare(query: string): D1Statement;
}

interface Env {
  PAGE_VIEWS_DB?: D1Database;
}

interface EventContext {
  request: Request;
  env: Env;
}

const SELECT_VIEWS = "SELECT views FROM page_views WHERE path = ?1";
const INCREMENT_VIEWS = `
  INSERT INTO page_views (path, views, updated_at)
  VALUES (?1, 1, CURRENT_TIMESTAMP)
  ON CONFLICT(path) DO UPDATE SET
    views = page_views.views + 1,
    updated_at = CURRENT_TIMESTAMP
  RETURNING views
`;

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

export async function onRequest(context: EventContext): Promise<Response> {
  if (context.request.method === "GET") return onRequestGet(context);
  if (context.request.method === "POST") return onRequestPost(context);
  return json({ error: "Method not allowed" }, 405, { Allow: "GET, POST", "Cache-Control": "no-store" });
}

export async function onRequestGet({ request, env }: EventContext): Promise<Response> {
  const path = normalizePagePath(new URL(request.url).searchParams.get("path"));
  if (!path) return json({ error: "Invalid path" }, 400, { "Cache-Control": "no-store" });
  if (!isPageViewEligible(path)) return json({ error: "Not found" }, 404, { "Cache-Control": "no-store" });
  if (!env.PAGE_VIEWS_DB) return unavailable();

  try {
    const row = await env.PAGE_VIEWS_DB.prepare(SELECT_VIEWS).bind(path).first<{ views: number }>();
    return json({ views: toViewCount(row?.views) }, 200, {
      "Cache-Control": "public, max-age=0, s-maxage=30",
    });
  } catch {
    return unavailable();
  }
}

export async function onRequestPost({ request, env }: EventContext): Promise<Response> {
  const url = new URL(request.url);
  if (isLocalHostname(url.hostname)) {
    return json({ error: "Local counting is disabled" }, 403, { "Cache-Control": "no-store" });
  }
  if (request.headers.get("Content-Type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") {
    return json({ error: "Content-Type must be application/json" }, 415, { "Cache-Control": "no-store" });
  }
  if (request.headers.get("Origin") !== url.origin) {
    return json({ error: "Origin not allowed" }, 403, { "Cache-Control": "no-store" });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400, { "Cache-Control": "no-store" });
  }

  const path = normalizePagePath((payload as { path?: unknown } | null)?.path);
  if (!path) return json({ error: "Invalid path" }, 400, { "Cache-Control": "no-store" });
  if (!isPageViewEligible(path)) return json({ error: "Not found" }, 404, { "Cache-Control": "no-store" });
  if (!env.PAGE_VIEWS_DB) return unavailable();

  try {
    const row = await env.PAGE_VIEWS_DB.prepare(INCREMENT_VIEWS).bind(path).first<{ views: number }>();
    if (!row) return unavailable();
    return json({ views: toViewCount(row.views) }, 200, { "Cache-Control": "no-store" });
  } catch {
    return unavailable();
  }
}

function toViewCount(value: unknown): number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function unavailable(): Response {
  return json({ error: "Page view service unavailable" }, 503, { "Cache-Control": "no-store" });
}

function json(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });
}
