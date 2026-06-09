interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

interface MarkdownManifest {
  routes: Record<string, string>;
}

interface EventContext<Env, Params extends string, Data> {
  request: Request;
  env: Env;
  params: Record<Params, string>;
  data: Data;
  next(): Promise<Response>;
}

const MARKDOWN_MANIFEST_PATH = "/.well-known/markdown/manifest.json";
const ADS_TXT_BODY = "google.com, pub-4221480300398103, DIRECT, f08c47fec0942fa0\n";

export async function onRequest(context: EventContext<Env, string, unknown>): Promise<Response> {
  const request = context.request;
  const url = new URL(request.url);

  if (url.pathname === "/ads.txt") {
    return new Response(ADS_TXT_BODY, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300, must-revalidate",
      },
    });
  }

  if (!prefersMarkdown(request)) {
    return context.next();
  }

  const markdownPath = await resolveMarkdownPath(context.env, url.pathname);

  if (!markdownPath) {
    return context.next();
  }

  const markdownUrl = new URL(markdownPath, url.origin);
  const markdownResponse = await context.env.ASSETS.fetch(new Request(markdownUrl, request));

  if (!markdownResponse.ok) {
    return context.next();
  }

  const body = await markdownResponse.text();
  const headers = new Headers(markdownResponse.headers);
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("Vary", appendVary(headers.get("Vary"), "Accept"));
  headers.set("X-Robots-Tag", "noindex, follow");
  headers.set("x-markdown-tokens", String(estimateTokenCount(body)));

  return new Response(body, {
    status: markdownResponse.status,
    statusText: markdownResponse.statusText,
    headers,
  });
}

function prefersMarkdown(request: Request): boolean {
  const accept = request.headers.get("Accept") || "";
  if (!accept.includes("text/markdown")) return false;

  const markdownQuality = qualityFor(accept, "text/markdown");
  const htmlQuality = qualityFor(accept, "text/html");

  return markdownQuality >= htmlQuality;
}

async function resolveMarkdownPath(env: Env, pathname: string): Promise<string | undefined> {
  const manifestResponse = await env.ASSETS.fetch(new Request(`https://assets.local${MARKDOWN_MANIFEST_PATH}`));
  if (!manifestResponse.ok) return undefined;

  const manifest = (await manifestResponse.json()) as MarkdownManifest;
  const cleanPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;

  return manifest.routes[pathname] || manifest.routes[cleanPath] || manifest.routes[`${cleanPath}/`];
}

function qualityFor(accept: string, mediaType: string): number {
  return accept
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.startsWith(mediaType) || entry.startsWith("*/*"))
    .reduce((quality, entry) => Math.max(quality, parseQuality(entry)), 0);
}

function parseQuality(entry: string): number {
  const match = entry.match(/(?:^|;)q=([0-9.]+)/);
  if (!match) return 1;

  const value = Number(match[1]);
  return Number.isFinite(value) ? value : 0;
}

function appendVary(current: string | null, value: string): string {
  const parts = new Set(
    (current || "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean),
  );
  parts.add(value);
  return Array.from(parts).join(", ");
}

function estimateTokenCount(text: string): number {
  const cjkCharacters = text.match(/[\u3400-\u9fff]/g)?.length || 0;
  const wordLikeTokens = text.match(/[A-Za-z0-9_]+|[^\sA-Za-z0-9_\u3400-\u9fff]/g)?.length || 0;
  return cjkCharacters + wordLikeTokens;
}
