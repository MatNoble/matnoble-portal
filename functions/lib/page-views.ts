const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);
const EXACT_EXCLUSIONS = new Set(["/", "/404", "/404.html", "/privacy", "/privacy.html", "/terms", "/terms.html"]);
const PREFIX_EXCLUSIONS = ["/api/", "/agents/", "/.well-known/"];
const FILE_EXTENSION = /\.[a-z0-9]{1,10}$/i;

export function normalizePagePath(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0 || value.length > 512) return null;
  if (!value.startsWith("/") || value.startsWith("//") && !/^\/{2,}[^/]/.test(value)) return null;
  if (value.includes("://") || value.includes("\\") || value.includes("\0")) return null;

  const rawPath = value.split(/[?#]/, 1)[0];
  const segments = rawPath.split("/");
  if (segments.some((segment) => segment === "." || segment === "..")) return null;

  const normalized = `/${segments.filter(Boolean).join("/")}`;
  return normalized === "/" ? "/" : normalized.replace(/\/$/, "");
}

export function isPageViewEligible(value: unknown): boolean {
  const path = normalizePagePath(value);
  if (!path || EXACT_EXCLUSIONS.has(path)) return false;
  if (PREFIX_EXCLUSIONS.some((prefix) => path === prefix.slice(0, -1) || path.startsWith(prefix))) return false;

  const finalSegment = path.slice(path.lastIndexOf("/") + 1);
  return !FILE_EXTENSION.test(finalSegment);
}

export function isLocalHostname(hostname: string): boolean {
  return LOCAL_HOSTNAMES.has(hostname.toLowerCase());
}
