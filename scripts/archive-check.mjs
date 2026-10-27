// Which session worktrees can be archived without losing anything?
//
//   bun run archive-check
//
// Not safe while a worktree still waits for Gemini pictures (a batch sent from
// it), has changes that are not committed, or commits that are not in main yet.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const BATCH_DIR = join(git("rev-parse", "--path-format=absolute", "--git-common-dir"), "image-batches");
const MAIN = "main";

const batches = existsSync(BATCH_DIR)
  ? readdirSync(BATCH_DIR)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(readFileSync(join(BATCH_DIR, f), "utf8")))
  : [];

const worktrees = git("worktree", "list", "--porcelain")
  .split("\n\n")
  .map((block) => ({
    path: /^worktree (.+)$/m.exec(block)?.[1],
    branch: /^branch refs\/heads\/(.+)$/m.exec(block)?.[1],
  }))
  .filter((w) => w.path);

let unsafe = 0;
for (const { path, branch } of worktrees) {
  if (branch === MAIN) continue;
  const reasons = [];
  const waiting = batches.filter((b) => b.checkout === path);
  if (waiting.length) reasons.push(`waits for ${waiting.length} picture batch(es) – bun run image status`);
  if (existsSync(path)) {
    const changes = git("-C", path, "status", "--porcelain").split("\n").filter(Boolean).length;
    if (changes) reasons.push(`${changes} file(s) not committed`);
  }
  if (branch) {
    const ahead = Number(git("rev-list", "--count", `${MAIN}..${branch}`));
    if (ahead) reasons.push(`${ahead} commit(s) not merged into ${MAIN}`);
  }
  if (reasons.length) unsafe++;
  console.log(`${reasons.length ? "KEEP " : "ok   "} ${branch ?? "(no branch)"}  ${path}`);
  for (const reason of reasons) console.log(`        ${reason}`);
}

const orphans = batches.filter((b) => !existsSync(b.checkout));
for (const b of orphans) console.log(`KEEP  batch ${b.name} from a worktree that is gone – bun run image fetch saves it here`);

console.log(unsafe || orphans.length ? "\nArchive only the ones marked ok." : "\nAll worktrees can be archived.");
