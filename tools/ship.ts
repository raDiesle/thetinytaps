import { spawnSync } from "node:child_process";

// `bun run ship`: what a Claude cloud session does after every task it finished well (user request, 21 November 2026):
// verify, bring the latest main in, merge into main, push main, and delete its own branch once main holds it. Only in a
// cloud session (`CLAUDE_CODE_REMOTE`): on the user's Mac pushing stays the user's move (CLAUDE.md, „Working here“).
//
// It stops at the first thing that is not fine – a dirty tree, a failed verify, a merge conflict, a push refused – and
// then leaves everything as it was, so the session fixes it and runs it again. It never force-pushes, never rewrites
// history and never deletes a branch main does not hold.

/** Runs git (or Bun) with the terminal's output; returns whether it ended well. */
function run(command: string, args: string[]): boolean {
  console.log(`\n$ ${command} ${args.join(" ")}`);
  return spawnSync(command, args, { stdio: "inherit" }).status === 0;
}

/** Runs git quietly and returns what it printed, trimmed; null when it failed. */
function git(...args: string[]): string | null {
  const result = spawnSync("git", args, { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
}

function fail(message: string): never {
  console.error(`\nship: STOPPED – ${message}`);
  process.exit(1);
}

/** Pushes, trying again after a network error up to four times (2, 4, 8, 16 s), as the cloud's git rules ask. */
function push(...args: string[]): boolean {
  for (let attempt = 0; attempt < 5; attempt++) {
    if (run("git", ["push", ...args])) return true;
    if (attempt < 4) Bun.sleepSync(2000 * 2 ** attempt);
  }
  return false;
}

if (!process.env.CLAUDE_CODE_REMOTE) fail("only in a Claude cloud session; on the Mac merge into local main and leave pushing to the user");
const branch = git("rev-parse", "--abbrev-ref", "HEAD");
if (!branch || branch === "HEAD") fail("not on a branch");
if (branch === "main") fail("run it on the session's branch, not on main");
if (git("status", "--porcelain")) fail("uncommitted changes: commit them (or drop them) first");

if (!run("git", ["fetch", "origin", "main"])) fail("could not fetch main");
if (!run("git", ["merge", "--no-edit", "origin/main"])) {
  run("git", ["merge", "--abort"]);
  fail("main does not merge cleanly into the branch: merge origin/main yourself, resolve, commit, run ship again");
}
// Verify what main will hold: the branch with main merged in.
if (!run("bun", ["run", "verify"])) fail("verify failed: fix it on the branch and run ship again");

if (!run("git", ["checkout", "-B", "main", "origin/main"])) fail("could not check out main");
const merged = run("git", ["merge", "--ff-only", branch]);
if (!merged) {
  run("git", ["checkout", branch]);
  fail("main moved meanwhile: run ship again");
}
if (!push("origin", "main")) {
  run("git", ["checkout", branch]);
  fail("pushing main was refused: the branch stays, push it and tell the user to merge it");
}

// Main holds the branch now: its remote copy goes, and the session goes on from main under the same name, so the next
// task starts from the newest state and pushes to a fresh branch of that name.
// The cloud's git proxy may refuse deleting a branch (HTTP 403, a policy, not the network: November 2026), so it is tried
// once, and the last line says truthfully whether the branch is gone – the user deletes it on GitHub otherwise.
let cleaned = !git("ls-remote", "--heads", "origin", branch);
if (!cleaned) cleaned = run("git", ["push", "origin", "--delete", branch]);
run("git", ["checkout", "-B", branch, "main"]);
git("branch", "--unset-upstream");
console.log(
  cleaned
    ? `\nship: OK – main pushed, origin/${branch} deleted`
    : `\nship: OK – main pushed; deleting origin/${branch} was refused here, so the user deletes it on GitHub (main holds all of it)`,
);
