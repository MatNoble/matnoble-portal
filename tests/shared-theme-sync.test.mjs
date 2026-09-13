import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolvePeerRoot, compareSharedFiles } from "../scripts/sync-shared-theme.mjs";

test("shared theme components remain in sync across portal and teach", (t) => {
  const currentRoot = process.cwd();
  const peerRoot = resolvePeerRoot(currentRoot);

  if (!peerRoot || !existsSync(peerRoot)) {
    t.skip("Peer repository not present in environment (e.g. CI/Cloudflare Pages), skipping cross-repo check.");
    return;
  }

  const comparison = compareSharedFiles(currentRoot, peerRoot);
  const diffs = comparison.filter((item) => item.status !== "SYNCED");

  assert.equal(
    diffs.length,
    0,
    `Found divergent shared components between portal and teach:\n${diffs.map((d) => `  ${d.status}: ${d.path}`).join("\n")}\nRun 'node scripts/sync-shared-theme.mjs --sync --from=...' to synchronize.`
  );
});
