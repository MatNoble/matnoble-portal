import test from "node:test";
import assert from "node:assert/strict";
import { parseSitemapUrls, findIndexNowKey, createIndexNowPayload } from "../scripts/submit-indexnow.mjs";

test("parseSitemapUrls extracts valid urls matching the host", () => {
  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://matnoble.top/</loc></url>
  <url><loc>https://matnoble.top/about</loc></url>
  <url><loc>https://other-domain.com/page</loc></url>
  <url><loc>https://matnoble.top/about</loc></url>
</urlset>`;

  const urls = parseSitemapUrls(sampleXml, "matnoble.top");
  assert.deepEqual(urls, [
    "https://matnoble.top/",
    "https://matnoble.top/about",
  ]);
});

test("parseSitemapUrls returns empty array on empty input", () => {
  assert.deepEqual(parseSitemapUrls(""), []);
  assert.deepEqual(parseSitemapUrls(null), []);
});

test("findIndexNowKey discovers key from public folder", async () => {
  const { key, keyLocation } = await findIndexNowKey();
  assert.equal(key, "7c6a9686414144409395982823617300");
  assert.equal(keyLocation, "https://matnoble.top/7c6a9686414144409395982823617300.txt");
});

test("createIndexNowPayload structures correct payload", () => {
  const payload = createIndexNowPayload({
    host: "matnoble.top",
    key: "testkey",
    keyLocation: "https://matnoble.top/testkey.txt",
    urlList: ["https://matnoble.top/"],
  });

  assert.equal(payload.host, "matnoble.top");
  assert.equal(payload.key, "testkey");
  assert.equal(payload.keyLocation, "https://matnoble.top/testkey.txt");
  assert.deepEqual(payload.urlList, ["https://matnoble.top/"]);
});
