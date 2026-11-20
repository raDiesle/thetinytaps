import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { CI_TESTS, failed, STEPS, type StepResult, summaryLine, verifyExitCode } from "../tools/verify";

/** A step's result with the given exit code. */
const ended = (name: string, exitCode: number | null): StepResult => ({ step: { name, args: [], shown: name }, exitCode, output: "", ms: 1 });

// `bun run verify` stands before every commit and every merge into main: a failure it lets through goes in.
test("verify fails when any step fails, was killed or nothing ran", () => {
  expect(verifyExitCode([ended("lint", 0), ended("typecheck", 0), ended("tests", 0)])).toBe(0);
  expect(verifyExitCode([ended("lint", 0), ended("typecheck", 0), ended("tests", 1)])).toBe(1);
  expect(verifyExitCode([ended("lint", 2), ended("typecheck", 0), ended("tests", 0)])).toBe(1);
  expect(verifyExitCode([ended("lint", 0), ended("tests", null)])).toBe(1);
  expect(verifyExitCode([])).toBe(1);
  expect(failed(ended("tests", null))).toBe(true);
});

test("verify's last line names what failed", () => {
  expect(summaryLine([ended("lint", 0), ended("tests", 0)], 6400)).toBe("verify: OK (6.4 s)");
  expect(summaryLine([ended("lint", 1), ended("typecheck", 0), ended("tests", 3)], 1)).toBe("verify: FAILED (lint, tests)");
  expect(summaryLine([], 1)).toBe("verify: FAILED (nothing ran)");
});

test("verify runs lint, typecheck and the tests, and package.json starts it", () => {
  expect(STEPS.map((step) => step.name)).toEqual(["lint", "typecheck", "typecheck scripts", "tests"]);
  expect(STEPS[3].args).toEqual(["test", "--parallel"]);
  // GitHub's slow runner keeps the plain run, whose tests it is known to finish in time.
  expect(CI_TESTS.args).toEqual(["test"]);
  const scripts = JSON.parse(readFileSync("package.json", "utf8")).scripts as Record<string, string>;
  expect(scripts.verify).toBe("bun tools/verify.ts");
});

// The scripts in scripts/ are plain JavaScript, and two of them spend money when they run (`bun run voice make`,
// `bun run image`): a typo there costs credits before anyone sees it, so their JSDoc types are checked like the app.
test("the typecheck covers every script in scripts/", () => {
  const config = JSON.parse(readFileSync("tsconfig.scripts.json", "utf8"));
  expect(config.include).toContain("scripts");
  expect(config.compilerOptions).toMatchObject({ allowJs: true, checkJs: true });
  // Strict like the app: no option of the main config is loosened for the scripts.
  for (const loose of ["strict", "noImplicitAny", "strictNullChecks", "noUnusedLocals", "noUnusedParameters"])
    expect(config.compilerOptions[loose]).toBeUndefined();
  expect(STEPS.find((step) => step.name === "typecheck scripts")?.args.slice(1)).toEqual(["--noEmit", "-p", "tsconfig.scripts.json"]);
  const scripts = JSON.parse(readFileSync("package.json", "utf8")).scripts as Record<string, string>;
  expect(scripts.typecheck).toContain("tsc --noEmit -p tsconfig.scripts.json");
  for (const file of readdirSync("scripts")) {
    expect(file).toMatch(/\.mjs$/);
    expect(readFileSync(`scripts/${file}`, "utf8")).not.toContain("@ts-nocheck");
  }
});
