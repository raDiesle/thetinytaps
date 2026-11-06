import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// GitHub runs actions written for Node.js 20 on Node.js 24 by force and warns on every build that Node.js 20 is
// deprecated (November 2026). These are the first major versions of the actions we use that target Node.js 24 –
// a workflow never goes back below them. An action added to a workflow gets its line here.

const WORKFLOWS = join(import.meta.dir, "..", ".github", "workflows");

/** First major version of each action that runs on Node.js 24 (checked in its action.yml's `runs.using`). */
const NODE24_SINCE: Record<string, number> = {
  "actions/checkout": 5,
  "oven-sh/setup-bun": 2,
  "actions/upload-pages-artifact": 5,
  "actions/deploy-pages": 5,
};

test("every action in the workflows is a version that runs on Node.js 24", () => {
  for (const file of readdirSync(WORKFLOWS)) {
    const text = readFileSync(join(WORKFLOWS, file), "utf8");
    for (const [, name, major] of text.matchAll(/uses:\s*([\w.-]+\/[\w.-]+)@v(\d+)/g)) {
      expect(NODE24_SINCE[name], `${file}: ${name} has no line in NODE24_SINCE`).toBeDefined();
      expect(Number(major), `${file}: ${name}@v${major}`).toBeGreaterThanOrEqual(NODE24_SINCE[name]);
    }
  }
});
