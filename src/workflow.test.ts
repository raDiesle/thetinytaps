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

// A test playing a whole story frame by frame takes seconds and ran past `bun test`'s 5 s limit on GitHub's slower
// runner, stopping the deploy (November 2026): such a test is a `heavyTest` (`src/heavyTest.ts`), run before every
// commit and skipped on CI.
test("tests that play a whole story are heavy tests, skipped on CI", () => {
  const tests = new Bun.Glob("**/*.test.{ts,tsx}");
  for (const file of tests.scanSync(join(import.meta.dir))) {
    const text = readFileSync(join(import.meta.dir, file), "utf8");
    if (!/\bstoryFrame\b/.test(text)) continue;
    expect(/^\s*test\(/m.test(text), `${file} plays a story frame by frame with a plain test()`).toBe(false);
    expect(text, file).toContain("heavyTest(");
  }
});

test("every deploy job has a timeout and a deploy running is never cancelled", () => {
  const text = readFileSync(join(WORKFLOWS, "deploy.yml"), "utf8");
  const jobs = text
    .slice(text.indexOf("\njobs:"))
    .split("\n")
    .filter((line) => /^ {2}[\w-]+:\s*$/.test(line));
  expect(jobs.length).toBeGreaterThan(0);
  expect(text.match(/^ {4}timeout-minutes: \d+/gm)?.length).toBe(jobs.length);
  expect(text).toMatch(/cancel-in-progress: false/);
  expect(text).not.toMatch(/cancel-in-progress: true/);
});
