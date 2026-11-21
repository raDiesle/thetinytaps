import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { APP_LANGUAGES } from "@/lib/language";
import { RECORDED_GAMES } from "./recordedLines";
import { CLONES, VOICE_QUEUE } from "./voiceQueue";

test("voice jobs have unique ids and a date", () => {
  expect(new Set(VOICE_QUEUE.map((job) => job.id)).size).toBe(VOICE_QUEUE.length);
  for (const job of VOICE_QUEUE) expect(job.date, job.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

test("a voice job names parts and languages `bun run voice make` knows", () => {
  const parts = new Set(RECORDED_GAMES.map((game) => game.name));
  for (const job of VOICE_QUEUE) {
    expect(job.only.length, job.id).toBeGreaterThan(0);
    for (const part of job.only) expect(parts.has(part), `${job.id}: ${part}`).toBe(true);
    expect(job.lang.length, job.id).toBeGreaterThan(0);
    for (const language of job.lang) expect(APP_LANGUAGES as string[], job.id).toContain(language);
  }
});

// Tapsi's own voice lives only in the first account, the clones only in the second, whose plan allows 3 requests at once.
test("a voice job records with the account its voice lives in", () => {
  for (const job of VOICE_QUEUE) {
    if (!job.voice) {
      expect(job.account, job.id).toBe("first");
      continue;
    }
    expect(CLONES[job.voice], `${job.id}: unknown clone`).toBeDefined();
    expect(job.account, job.id).toBe("second");
    expect(job.parallel ?? 4, job.id).toBeLessThanOrEqual(2);
    for (const language of job.lang) expect(CLONES[job.voice]?.languages, `${job.id}: the clone for ${language}`).toContain(language);
  }
});

test("bun run paid knows every account's key", () => {
  const script = readFileSync("scripts/paid-queue.mjs", "utf8");
  expect(script).toContain("ACCOUNT_KEYS[job.account]");
  expect(readFileSync("package.json", "utf8")).toContain('"paid": "bun scripts/paid-queue.mjs"');
});
