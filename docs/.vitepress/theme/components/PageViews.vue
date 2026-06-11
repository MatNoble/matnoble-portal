<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { useData, useRoute } from "vitepress";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);
const EXACT_EXCLUSIONS = new Set(["/", "/404", "/404.html", "/privacy", "/privacy.html", "/terms", "/terms.html"]);
const PREFIX_EXCLUSIONS = ["/api/", "/agents/", "/.well-known/"];
const FILE_EXTENSION = /\.[a-z0-9]{1,10}$/i;
const DEDUPE_WINDOW_MS = 30 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 2500;
const STORAGE_PREFIX = "matnoble:page-view:";

const route = useRoute();
const { frontmatter } = useData();
const views = ref<number | null>(null);
const visible = ref(false);

let abortController: AbortController | null = null;
let idleHandle: number | null = null;
let fallbackHandle: number | null = null;
let requestVersion = 0;

function normalizePath(value: string): string {
  const path = value.split(/[?#]/, 1)[0];
  const normalized = `/${path.split("/").filter(Boolean).join("/")}`;
  return normalized === "/" ? "/" : normalized.replace(/\/$/, "");
}

function isEligible(path: string): boolean {
  if (EXACT_EXCLUSIONS.has(path)) return false;
  if (PREFIX_EXCLUSIONS.some((prefix) => path === prefix.slice(0, -1) || path.startsWith(prefix))) return false;
  return !FILE_EXTENSION.test(path.slice(path.lastIndexOf("/") + 1));
}

function cancelPendingWork() {
  abortController?.abort();
  abortController = null;
  if (typeof window === "undefined") return;
  if (idleHandle !== null && "cancelIdleCallback" in window) window.cancelIdleCallback(idleHandle);
  if (fallbackHandle !== null) window.clearTimeout(fallbackHandle);
  idleHandle = null;
  fallbackHandle = null;
}

function wasRecentlyCounted(path: string): boolean {
  try {
    const timestamp = Number(window.localStorage.getItem(`${STORAGE_PREFIX}${path}`));
    return Number.isFinite(timestamp) && Date.now() - timestamp < DEDUPE_WINDOW_MS;
  } catch {
    return true;
  }
}

function recordCount(path: string) {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${path}`, String(Date.now()));
  } catch {
    // Storage is optional; page rendering and count display remain unaffected.
  }
}

async function loadViews(path: string, version: number) {
  abortController = new AbortController();
  const timeout = window.setTimeout(() => abortController?.abort(), REQUEST_TIMEOUT_MS);
  const increment = !wasRecentlyCounted(path);

  try {
    const response = await fetch(increment ? "/api/views" : `/api/views?path=${encodeURIComponent(path)}`, {
      method: increment ? "POST" : "GET",
      headers: increment ? { "Content-Type": "application/json" } : undefined,
      body: increment ? JSON.stringify({ path }) : undefined,
      signal: abortController.signal,
      credentials: "same-origin",
    });
    if (!response.ok) return;

    const data = await response.json() as { views?: unknown };
    if (version !== requestVersion || typeof data.views !== "number" || !Number.isSafeInteger(data.views) || data.views < 0) return;
    if (increment) recordCount(path);
    views.value = data.views;
    visible.value = true;
  } catch {
    // Page views are a non-critical enhancement and fail silently.
  } finally {
    window.clearTimeout(timeout);
  }
}

function scheduleLoad(path: string, version: number) {
  if ("requestIdleCallback" in window) {
    idleHandle = window.requestIdleCallback(() => loadViews(path, version), { timeout: 2000 });
    return;
  }
  fallbackHandle = window.setTimeout(() => loadViews(path, version), 800);
}

watch(
  () => [route.path, frontmatter.value.pageViews] as const,
  ([rawPath, pageViews]) => {
    requestVersion += 1;
    cancelPendingWork();
    views.value = null;
    visible.value = false;

    if (typeof window === "undefined" || LOCAL_HOSTNAMES.has(window.location.hostname) || pageViews === false) return;
    const path = normalizePath(rawPath);
    if (!isEligible(path)) return;
    scheduleLoad(path, requestVersion);
  },
  { immediate: true },
);

onBeforeUnmount(cancelPendingWork);
</script>

<template>
  <div class="page-views" :class="{ visible }" aria-live="polite">
    <template v-if="views !== null">
      <svg class="page-views-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.6" />
      </svg>
      <span>已浏览 <strong>{{ views.toLocaleString() }}</strong> 次</span>
    </template>
  </div>
</template>

<style scoped>
.page-views {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 22px;
  margin-top: 1.5rem;
  color: var(--vp-c-text-3);
  font-size: 0.8125rem;
  line-height: 1.4;
  opacity: 0;
  transition: opacity 180ms ease;
}

.page-views.visible {
  opacity: 1;
}

.page-views-icon {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  stroke-width: 1.8;
}

.page-views strong {
  color: var(--vp-c-text-2);
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .page-views {
    transition: none;
  }
}
</style>
