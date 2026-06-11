import test from "node:test";
import assert from "node:assert/strict";

import {
  isLocalHostname,
  isPageViewEligible,
  normalizePagePath,
} from "../functions/lib/page-views.ts";

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
