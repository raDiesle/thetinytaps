import { describe, expect, it } from "bun:test";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

// `bun run ship` merges into main, pushes it and deletes the session's branch – only in a Claude cloud session
// (user request, 21 November 2026); on the Mac pushing stays the user's move.
describe("bun run ship", () => {
  it("refuses outside a Claude cloud session", () => {
    const env = { ...process.env };
    delete env.CLAUDE_CODE_REMOTE;
    const result = spawnSync("bun", ["tools/ship.ts"], { env, encoding: "utf8" });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("only in a Claude cloud session");
  });

  it("verifies before it pushes, never forces, and deletes the branch only after main is pushed", () => {
    const ship = readFileSync(new URL("../tools/ship.ts", import.meta.url), "utf8");
    expect(ship).not.toMatch(/"--force"|"-f"|force-with-lease/);
    const verify = ship.indexOf('["run", "verify"]');
    const pushMain = ship.indexOf('push("origin", "main")');
    const deleteBranch = ship.indexOf('"--delete"');
    expect(verify).toBeGreaterThan(0);
    expect(verify).toBeLessThan(pushMain);
    expect(pushMain).toBeLessThan(deleteBranch);
  });
});
