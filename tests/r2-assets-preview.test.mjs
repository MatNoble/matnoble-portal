import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { onRequest } from "../functions/assets/[[path]].ts";

const encoder = new TextEncoder();

function createBucket(objects = new Map()) {
  return {
    async get(key, options = {}) {
      const entry = objects.get(key);
      if (!entry) return null;

      const bytes = encoder.encode(entry.body);
      const range = options.range;
      const offset = range?.offset ?? 0;
      const length = range?.length ?? bytes.byteLength;
      const body = bytes.slice(offset, offset + length);

      return {
        body,
        size: bytes.byteLength,
        range: range ? { offset, length: body.byteLength } : undefined,
        httpEtag: '"preview-etag"',
        writeHttpMetadata(headers) {
          headers.set("Content-Type", entry.contentType || "application/octet-stream");
        },
      };
    },
    async head(key) {
      const entry = objects.get(key);
      if (!entry) return null;
      return {
        size: encoder.encode(entry.body).byteLength,
        httpEtag: '"preview-etag"',
        writeHttpMetadata(headers) {
          headers.set("Content-Type", entry.contentType || "application/octet-stream");
        },
      };
    },
  };
}

function assetRequest(path, init = {}, bucket = createBucket()) {
  return onRequest({
    request: new Request(`https://preview.matnoble.pages.dev/assets/${path}`, init),
    env: { DOWNLOADS_BUCKET: bucket },
    params: { path: path.split("/") },
  });
}

test("returns 404 when the R2 object does not exist", async () => {
  const response = await assetRequest("missing.pdf");
  assert.equal(response.status, 404);
});

test("streams an R2 object with metadata and cache headers", async () => {
  const bucket = createBucket(new Map([
    ["calculus/II/guide.pdf", { body: "PDF DATA", contentType: "application/pdf" }],
  ]));
  const response = await assetRequest("calculus/II/guide.pdf", {}, bucket);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Type"), "application/pdf");
  assert.equal(response.headers.get("Content-Length"), "8");
  assert.equal(response.headers.get("Accept-Ranges"), "bytes");
  assert.equal(response.headers.get("Cache-Control"), "public, max-age=3600");
  assert.equal(await response.text(), "PDF DATA");
});

test("HEAD returns object headers without a body", async () => {
  const bucket = createBucket(new Map([["archive.zip", { body: "ZIP DATA" }]]));
  const response = await assetRequest("archive.zip", { method: "HEAD" }, bucket);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Length"), "8");
  assert.equal(await response.text(), "");
});

test("returns a single byte range with 206", async () => {
  const bucket = createBucket(new Map([["video.mp4", { body: "0123456789", contentType: "video/mp4" }]]));
  const response = await assetRequest("video.mp4", {
    headers: { Range: "bytes=2-5" },
  }, bucket);

  assert.equal(response.status, 206);
  assert.equal(response.headers.get("Content-Range"), "bytes 2-5/10");
  assert.equal(response.headers.get("Content-Length"), "4");
  assert.equal(await response.text(), "2345");
});

test("rejects malformed and multiple ranges", async () => {
  const bucket = createBucket(new Map([["video.mp4", { body: "0123456789" }]]));

  for (const range of ["items=0-2", "bytes=0-1,4-5", "bytes=20-30"]) {
    const response = await assetRequest("video.mp4", { headers: { Range: range } }, bucket);
    assert.equal(response.status, 416, range);
    assert.equal(response.headers.get("Content-Range"), "bytes */10");
  }
});

test("preview download pages use the same-origin R2 proxy", async () => {
  const files = [
    "docs/courses/advanced-math-2.md",
    "docs/courses/economic-math-2.md",
    "docs/courses/discrete-math.md",
    "docs/roll-call-beacon/index.md",
  ];

  for (const file of files) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
    assert.match(source, /\/assets\//, file);
    assert.doesNotMatch(source, /\/assets-test\//, file);
    assert.doesNotMatch(source, /https:\/\/assets\.matnoble\.top\//, file);
  }
});
