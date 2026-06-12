interface R2Range {
  offset: number;
  length: number;
}

interface R2ObjectMetadata {
  size: number;
  httpEtag: string;
  writeHttpMetadata(headers: Headers): void;
}

interface R2ObjectBody extends R2ObjectMetadata {
  body: BodyInit;
  range?: R2Range;
}

interface R2Bucket {
  get(key: string, options?: { range?: R2Range }): Promise<R2ObjectBody | null>;
  head(key: string): Promise<R2ObjectMetadata | null>;
}

interface Env {
  DOWNLOADS_BUCKET: R2Bucket;
}

interface EventContext {
  request: Request;
  env: Env;
  params: { path?: string | string[] };
}

const CACHE_CONTROL = "public, max-age=3600";

export async function onRequest(context: EventContext): Promise<Response> {
  const method = context.request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD" },
    });
  }

  const key = objectKey(context.params.path);
  if (!key) return new Response("Not Found", { status: 404 });

  const metadata = await context.env.DOWNLOADS_BUCKET.head(key);
  if (!metadata) return new Response("Not Found", { status: 404 });

  const headers = objectHeaders(metadata);
  const rangeHeader = context.request.headers.get("Range");
  const range = rangeHeader ? parseRange(rangeHeader, metadata.size) : undefined;

  if (rangeHeader && !range) {
    headers.set("Content-Range", `bytes */${metadata.size}`);
    return new Response(null, { status: 416, headers });
  }

  if (method === "HEAD") {
    headers.set("Content-Length", String(range?.length ?? metadata.size));
    if (range) headers.set("Content-Range", contentRange(range, metadata.size));
    return new Response(null, { status: range ? 206 : 200, headers });
  }

  const object = await context.env.DOWNLOADS_BUCKET.get(key, range ? { range } : undefined);
  if (!object) return new Response("Not Found", { status: 404 });

  headers.set("Content-Length", String(range?.length ?? object.size));
  if (range) headers.set("Content-Range", contentRange(range, metadata.size));

  return new Response(object.body, {
    status: range ? 206 : 200,
    headers,
  });
}

function objectKey(path: string | string[] | undefined): string | undefined {
  const key = Array.isArray(path) ? path.join("/") : path;
  if (!key || key.startsWith("/") || key.split("/").some((part) => !part || part === "." || part === "..")) {
    return undefined;
  }
  return key;
}

function objectHeaders(object: R2ObjectMetadata): Headers {
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("ETag", object.httpEtag);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", CACHE_CONTROL);
  return headers;
}

function parseRange(value: string, size: number): R2Range | undefined {
  const match = /^bytes=(\d+)-(\d*)$/.exec(value.trim());
  if (!match) return undefined;

  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(requestedEnd) || start >= size || requestedEnd < start) {
    return undefined;
  }

  const end = Math.min(requestedEnd, size - 1);
  return { offset: start, length: end - start + 1 };
}

function contentRange(range: R2Range, size: number): string {
  return `bytes ${range.offset}-${range.offset + range.length - 1}/${size}`;
}
