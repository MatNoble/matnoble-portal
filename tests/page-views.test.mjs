import test from "node:test";
import assert from "node:assert/strict";

import {
  isLocalHostname,
  isPageViewEligible,
  normalizePagePath,
} from "../functions/lib/page-views.ts";
import { onRequest } from "../functions/api/views.ts";

test("normalizePagePath removes query, hash, duplicate slashes, and trailing slash", () => {
  assert.equal(normalizePagePath("//teaching///calculus/?from=nav#part"), "/teaching/calculus");
});

test("normalizePagePath rejects absolute URLs and parent traversal", () => {
  assert.equal(normalizePagePath("https://example.com/about"), null);
  assert.equal(normalizePagePath("/teaching/../privacy"), null);
});

test("ordinary and future content paths are eligible", () => {
  assert.equal(isPageViewEligible("/about"), true);
  assert.equal(isPageViewEligible("/faq"), true);
  assert.equal(isPageViewEligible("/roll-call-beacon"), true);
  assert.equal(isPageViewEligible("/future-section/new-article"), true);
});

test("technical and legal paths are excluded", () => {
  for (const path of ["/", "/404", "/404.html", "/privacy", "/terms/", "/api/views", "/agents/domain", "/.well-known/markdown"]) {
    assert.equal(isPageViewEligible(path), false, path);
  }
});

test("asset-like paths are excluded", () => {
  for (const path of ["/logo.svg", "/downloads/guide.pdf", "/assets/app.js", "/images/photo.webp"]) {
    assert.equal(isPageViewEligible(path), false, path);
  }
});

test("local hostnames are detected", () => {
  assert.equal(isLocalHostname("localhost"), true);
  assert.equal(isLocalHostname("127.0.0.1"), true);
  assert.equal(isLocalHostname("::1"), true);
  assert.equal(isLocalHostname("matnoble.top"), false);
});

function createDatabase(initial = new Map()) {
  const values = new Map(initial);
  return {
    prepare(sql) {
      let path;
      return {
        bind(value) {
          path = value;
          return this;
        },
        async first() {
          if (sql.startsWith("SELECT")) {
            return values.has(path) ? { views: values.get(path) } : null;
          }
          const next = (values.get(path) || 0) + 1;
          values.set(path, next);
          return { views: next };
        },
      };
    },
  };
}

function apiRequest(path, init = {}, database = createDatabase()) {
  const request = new Request(`https://matnoble.top/api/views${path}`, init);
  return onRequest({ request, env: { PAGE_VIEWS_DB: database } });
}

test("GET returns zero for an eligible missing path", async () => {
  const response = await apiRequest("?path=/about");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { views: 0 });
  assert.equal(response.headers.get("Cache-Control"), "public, max-age=0, s-maxage=30");
});

test("GET returns an existing count", async () => {
  const response = await apiRequest("?path=/faq", {}, createDatabase(new Map([["/faq", 12]])));
  assert.deepEqual(await response.json(), { views: 12 });
});

test("POST returns the atomic increment result", async () => {
  const response = await apiRequest("", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://matnoble.top" },
    body: JSON.stringify({ path: "/about" }),
  }, createDatabase(new Map([["/about", 4]])));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { views: 5 });
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("API rejects ineligible paths", async () => {
  const response = await apiRequest("?path=/privacy");
  assert.equal(response.status, 404);
});

test("POST rejects cross-origin requests", async () => {
  const response = await apiRequest("", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://example.com" },
    body: JSON.stringify({ path: "/about" }),
  });
  assert.equal(response.status, 403);
});

test("POST rejects local-host writes", async () => {
  const request = new Request("http://localhost/api/views", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "http://localhost" },
    body: JSON.stringify({ path: "/about" }),
  });
  const response = await onRequest({ request, env: { PAGE_VIEWS_DB: createDatabase() } });
  assert.equal(response.status, 403);
});

test("database errors degrade to a small 503 response", async () => {
  const response = await apiRequest("?path=/about", {}, {
    prepare() {
      throw new Error("database unavailable");
    },
  });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "Page view service unavailable" });
});
