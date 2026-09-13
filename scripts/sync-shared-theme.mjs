import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";

/**
 * 共有前端组件与工具清单（Single Source of Truth 治理目录）
 * 这些文件在 matnoble-portal 与 matnoble-teach 之间应保持 100% 行为一致与代码同步。
 */
export const SHARED_FILES = [
  "docs/.vitepress/theme/components/BrownianBackground.vue",
  "docs/.vitepress/theme/components/Comment.vue",
  "docs/.vitepress/theme/components/ContactCta.vue",
  "docs/.vitepress/theme/components/FollowSection.vue",
  "docs/.vitepress/theme/components/HighFidelityHero.vue",
  "docs/.vitepress/theme/components/ManimVideo.vue",
  "docs/.vitepress/theme/components/PageViews.vue",
  "docs/.vitepress/theme/components/ReadingProgressBar.vue",
  "docs/.vitepress/theme/components/RelatedPosts.vue",
  "docs/.vitepress/theme/components/RoleGrid.vue",
  "docs/.vitepress/theme/components/ScholarMap.vue",
  "docs/.vitepress/theme/components/ScholarlyFeatures.vue",
  "docs/.vitepress/theme/components/Share.vue",
  "docs/.vitepress/theme/components/TrustLogos.vue",
  "docs/.vitepress/theme/composables/useShare.ts",
  "docs/.vitepress/posts.data.ts",
  "docs/.vitepress/genFeed.ts",
  "scripts/generate-agent-markdown.mjs",
];

export function resolvePeerRoot(currentRoot = process.cwd()) {
  const currentName = basename(resolve(currentRoot));
  const parentDir = dirname(resolve(currentRoot));

  if (currentName === "matnoble-portal") {
    return resolve(parentDir, "matnoble-teach");
  }
  if (currentName === "matnoble-teach") {
    return resolve(parentDir, "matnoble-portal");
  }
  return null;
}

export function compareSharedFiles(rootA, rootB) {
  const results = [];
  for (const relPath of SHARED_FILES) {
    const fileA = resolve(rootA, relPath);
    const fileB = resolve(rootB, relPath);

    const existsA = existsSync(fileA);
    const existsB = existsSync(fileB);

    if (!existsA || !existsB) {
      results.push({
        path: relPath,
        status: "MISSING",
        message: !existsA ? "Missing in Root A" : "Missing in Root B",
      });
      continue;
    }

    const contentA = readFileSync(fileA, "utf-8");
    const contentB = readFileSync(fileB, "utf-8");

    if (contentA === contentB) {
      results.push({ path: relPath, status: "SYNCED" });
    } else {
      results.push({ path: relPath, status: "DIFF" });
    }
  }
  return results;
}

export function syncFiles(sourceRoot, targetRoot) {
  const synced = [];
  for (const relPath of SHARED_FILES) {
    const src = resolve(sourceRoot, relPath);
    const dest = resolve(targetRoot, relPath);

    if (!existsSync(src)) {
      console.warn(`[Skip] 来源文件不存在: ${relPath}`);
      continue;
    }

    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, readFileSync(src));
    synced.push(relPath);
  }
  return synced;
}

async function main() {
  const args = process.argv.slice(2);
  const isSync = args.includes("--sync");
  const fromPeer = args.includes("--from=peer");
  const toPeer = args.includes("--to=peer");

  const currentRoot = process.cwd();
  const peerRoot = resolvePeerRoot(currentRoot);

  if (!peerRoot || !existsSync(peerRoot)) {
    console.log(`[Info] 对端站点仓库未在本地发现，跳过跨站同步检查。`);
    return;
  }

  const currentName = basename(currentRoot);
  const peerName = basename(peerRoot);

  if (isSync) {
    if (fromPeer) {
      console.log(`🔄 正在从 [${peerName}] 同步共有组件到 [${currentName}]...`);
      const files = syncFiles(peerRoot, currentRoot);
      console.log(`✅ 同步完成，共更新 ${files.length} 个文件。`);
      return;
    }
    if (toPeer) {
      console.log(`🔄 正在从 [${currentName}] 同步共有组件到 [${peerName}]...`);
      const files = syncFiles(currentRoot, peerRoot);
      console.log(`✅ 同步完成，共更新 ${files.length} 个文件。`);
      return;
    }
    console.error("❌ 使用 --sync 时必须指定 --from=peer 或 --to=peer");
    process.exit(1);
  }

  // 默认模式：检查一致性
  console.log(`🔍 正在比对 [${currentName}] 与 [${peerName}] 的共有前端组件...`);
  const comparison = compareSharedFiles(currentRoot, peerRoot);
  let hasDiff = false;

  for (const res of comparison) {
    if (res.status === "SYNCED") {
      console.log(`  ✅ [MATCH] ${res.path}`);
    } else {
      hasDiff = true;
      console.log(`  ❌ [${res.status}] ${res.path}`);
    }
  }

  if (hasDiff) {
    console.error(`\n⚠️ 发现共有组件存在差异！请确认修改并执行同步：`);
    console.error(`  - 从对端覆盖当前：node scripts/sync-shared-theme.mjs --sync --from=peer`);
    console.error(`  - 从当前同步至对端：node scripts/sync-shared-theme.mjs --sync --to=peer\n`);
    process.exit(1);
  } else {
    console.log(`\n🎉 检查通过！全部 ${comparison.length} 个共有组件与逻辑 100% 保持同步。\n`);
  }
}

if (process.argv[1] && process.argv[1].endsWith("sync-shared-theme.mjs")) {
  main().catch((err) => {
    console.error("运行失败:", err);
    process.exit(1);
  });
}
