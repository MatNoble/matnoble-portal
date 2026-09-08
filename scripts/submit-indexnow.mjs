import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_HOST = "matnoble.top";
const SITEMAP_PATH = resolve("docs/.vitepress/dist/sitemap.xml");
const PUBLIC_DIR = resolve("docs/public");

export function parseSitemapUrls(xmlContent, host = DEFAULT_HOST) {
  if (!xmlContent) return [];
  const matches = xmlContent.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g);
  const urls = [];
  const seen = new Set();

  for (const match of matches) {
    const rawUrl = match[1].trim();
    try {
      const parsed = new URL(rawUrl);
      if (parsed.hostname === host && !seen.has(rawUrl)) {
        seen.add(rawUrl);
        urls.push(rawUrl);
      }
    } catch {
      // Ignore invalid URLs
    }
  }

  return urls;
}

export async function findIndexNowKey(publicDir = PUBLIC_DIR) {
  if (existsSync(publicDir)) {
    const files = await readdir(publicDir);
    for (const file of files) {
      if (/^[0-9a-f]{32}\.txt$/i.test(file)) {
        const key = file.replace(/\.txt$/, "");
        return { key, keyLocation: `https://${DEFAULT_HOST}/${file}` };
      }
    }
  }

  const fallbackKey = "7c6a9686414144409395982823617300";
  return {
    key: fallbackKey,
    keyLocation: `https://${DEFAULT_HOST}/${fallbackKey}.txt`,
  };
}

export const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

export function createIndexNowPayload({ host, key, keyLocation, urlList }) {
  return {
    host,
    key,
    keyLocation,
    urlList,
  };
}

export async function submitUrlsToIndexNow(payload, endpoints = INDEXNOW_ENDPOINTS) {
  let lastError = null;
  let lastResult = null;

  for (const endpoint of endpoints) {
    try {
      console.log(`[IndexNow] Trying endpoint: ${endpoint}`);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      const result = {
        ok: response.ok || response.status === 202,
        status: response.status,
        statusText: response.statusText,
        endpoint,
        body: text,
      };

      if (result.ok) {
        return result;
      }

      lastResult = result;
      console.warn(`[IndexNow] ${endpoint} returned ${result.status} ${result.statusText}, trying next...`);
    } catch (err) {
      lastError = err;
      console.warn(`[IndexNow] Failed connecting to ${endpoint} (${err.message}), trying next...`);
    }
  }

  if (lastResult) return lastResult;
  throw lastError || new Error("All IndexNow endpoints failed");
}

async function main() {
  const args = process.argv.slice(2);
  const isAuto = args.includes("--auto");
  const isDryRun = args.includes("--dry-run");

  if (isAuto && !process.env.CF_PAGES && !process.env.CI) {
    console.log("[IndexNow] Local build detected. Skipping automatic submission (run 'npm run indexnow' to submit manually).");
    return;
  }

  if (!existsSync(SITEMAP_PATH)) {
    console.error(`[IndexNow] Error: Sitemap file not found at ${SITEMAP_PATH}. Please run 'npm run docs:build' first.`);
    process.exit(1);
  }

  const sitemapXml = await readFile(SITEMAP_PATH, "utf-8");
  const urls = parseSitemapUrls(sitemapXml, DEFAULT_HOST);

  if (urls.length === 0) {
    console.warn(`[IndexNow] Warning: No URLs matching host '${DEFAULT_HOST}' found in sitemap.`);
    return;
  }

  const { key, keyLocation } = await findIndexNowKey(PUBLIC_DIR);
  const payload = createIndexNowPayload({
    host: DEFAULT_HOST,
    key,
    keyLocation,
    urlList: urls,
  });

  console.log(`[IndexNow] Found ${urls.length} indexable web pages for ${DEFAULT_HOST}`);
  console.log(`[IndexNow] Using key: ${key}`);
  console.log(`[IndexNow] Key location: ${keyLocation}`);

  if (isDryRun) {
    console.log("[IndexNow] DRY-RUN mode. URLs to be submitted:");
    urls.forEach((url, i) => console.log(`  ${i + 1}. ${url}`));
    return;
  }

  console.log(`[IndexNow] Submitting ${urls.length} URLs to IndexNow endpoints...`);
  try {
    const result = await submitUrlsToIndexNow(payload);
    if (result.ok) {
      console.log(`[IndexNow] Successfully submitted to IndexNow! (Status: ${result.status} ${result.statusText})`);
    } else {
      console.error(`[IndexNow] Submission failed (Status: ${result.status} ${result.statusText})`);
      if (result.body) console.error(`[IndexNow] Response: ${result.body}`);
      if (!isAuto) process.exit(1);
    }
  } catch (error) {
    console.error(`[IndexNow] Network or submission error:`, error);
    if (!isAuto) process.exit(1);
  }
}

if (process.argv[1] && process.argv[1].endsWith("submit-indexnow.mjs")) {
  main().catch((err) => {
    console.error("[IndexNow] Unexpected error:", err);
    process.exit(1);
  });
}
