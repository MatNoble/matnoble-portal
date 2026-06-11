import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, relative } from "node:path";

const docsRoot = "docs";
const outputRoot = join(docsRoot, "public", ".well-known", "markdown");
const manifestPath = join(outputRoot, "manifest.json");
const excludedDirs = new Set([
  ".vitepress",
  "agents",
  "audits",
  "components",
  "dev-dist",
  "public",
  "superpowers",
]);

async function collectMarkdownFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (dir === docsRoot && excludedDirs.has(entry.name)) continue;
      files.push(...await collectMarkdownFiles(fullPath));
      continue;
    }

    if (entry.isFile() && extname(entry.name) === ".md") {
      files.push(fullPath);
    }
  }

  return files;
}

function routeFor(sourcePath) {
  const relativePath = relative(docsRoot, sourcePath);
  const parsed = relativePath.slice(0, -extname(relativePath).length);

  if (parsed === "index") return "/";
  if (basename(parsed) === "index") return `/${dirname(parsed).replace(/\\/g, "/")}/`;
  return `/${parsed.replace(/\\/g, "/")}`;
}

function markdownPathFor(route) {
  const cleanRoute = route === "/" ? "index" : route.replace(/^\/|\/$/g, "");
  return `${cleanRoute || "index"}.md`;
}

async function main() {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  const files = await collectMarkdownFiles(docsRoot);
  const routes = {};

  for (const file of files) {
    const route = routeFor(file);
    const outputRelative = markdownPathFor(route);
    const outputPath = join(outputRoot, outputRelative);
    const source = await readFile(file, "utf8");

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, source);

    routes[route] = `/.well-known/markdown/${outputRelative}`;
    if (route !== "/" && !route.endsWith("/")) {
      routes[`${route}/`] = routes[route];
    }
  }

  await writeFile(
    manifestPath,
    `${JSON.stringify({ generated_at: new Date().toISOString(), routes }, null, 2)}\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
