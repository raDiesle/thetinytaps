import { join } from "node:path";

// `bun run verify`: lint and format check, typecheck and unit tests, the check before every commit. The three run at
// the same time (one after the other they took 18 s, 90 % of it the tests; side by side, with the test files spread
// over the cores by `bun test --parallel`, about 6 s), and each one's output is printed whole and in a fixed order once
// it is done, so nothing is mixed up.
//
// A failure can't hide here: every step's exit code is kept, a failing step's whole output is printed, the last line
// names what failed and the script exits with 1 when anything did. A verify whose failure was hidden (piped into
// `tail` before `&& git merge`) once left main half-merged, so never pipe this into something that drops its exit code.

/** One of the checks `bun run verify` runs. */
export type Step = {
  /** Its short name in the header and in the last line: "lint", "typecheck", "tests". */
  name: string;
  /** What it runs, as arguments for Bun (no shell): a tool's file in node_modules/.bin, or one of Bun's own commands. */
  args: string[];
  /** The same as one would type it, for the header. */
  shown: string;
};

/** How a step ended. */
export type StepResult = {
  step: Step;
  /** Its exit code; null when it was killed by a signal or could not be started, which counts as failed. */
  exitCode: number | null;
  /** Everything it wrote, standard output and errors together. */
  output: string;
  /** How long it ran, in milliseconds. */
  ms: number;
};

/** The repository's root: the tools are found and run from here, wherever verify was started. */
const ROOT = join(import.meta.dir, "..");

/**
 * The checks, in the order they are printed. The tools are run by Bun from node_modules/.bin as `bun run lint` and
 * `bun run typecheck` run them (no Node needed); the tests with `--parallel`, which gives each core test files of its
 * own, every file in a fresh global (`--isolate`), and reads `bunfig.toml`'s `[test]` as a plain `bun test` does.
 */
export const STEPS: Step[] = [
  { name: "lint", args: [join(ROOT, "node_modules/.bin/biome"), "check"], shown: "biome check" },
  { name: "typecheck", args: [join(ROOT, "node_modules/.bin/tsc"), "--noEmit"], shown: "tsc --noEmit" },
  { name: "tests", args: ["test", "--parallel"], shown: "bun test --parallel" },
];

/** The tests as GitHub's runner runs them: one file after the other. */
export const CI_TESTS: Step = { name: "tests", args: ["test"], shown: "bun test" };

/** True when a step did not end well: any exit code but 0, also none at all. */
export const failed = (result: StepResult) => result.exitCode !== 0;

/** A duration as seconds with one decimal: "6.4 s". */
const seconds = (ms: number) => `${(ms / 1000).toFixed(1)} s`;

/** The line above a step's output: its name, what ran, how it ended and how long it took. */
export function stepHeader(result: StepResult) {
  const ended = result.exitCode === null ? "no exit code" : `exit ${result.exitCode}`;
  return `── ${result.step.name}: ${result.step.shown} · ${failed(result) ? "FAILED" : "ok"} (${ended}) · ${seconds(result.ms)} ──`;
}

/** The last line of verify: "verify: OK (6.4 s)", or "verify: FAILED (lint, tests)" naming every step that failed. */
export function summaryLine(results: StepResult[], ms: number) {
  const bad = results.filter(failed).map((result) => result.step.name);
  // No steps at all is no success either: something must have been checked.
  if (results.length === 0) return "verify: FAILED (nothing ran)";
  return bad.length ? `verify: FAILED (${bad.join(", ")})` : `verify: OK (${seconds(ms)})`;
}

/** The exit code of verify itself: 0 only when every step ran and ended with 0. */
export const verifyExitCode = (results: StepResult[]) => (results.length > 0 && !results.some(failed) ? 0 : 1);

/** Runs one step and collects what it writes; never throws, a step that can't be started is a failed step. */
async function run(step: Step): Promise<StepResult> {
  const started = performance.now();
  try {
    const child = Bun.spawn([process.execPath, ...step.args], { cwd: ROOT, stdin: "ignore", stdout: "pipe", stderr: "pipe" });
    // Both streams are read as they come, into one text in the order their pieces arrive: a pipe left unread would
    // stop a step that writes a lot (a test run with many failures).
    const decoder = new TextDecoder();
    let output = "";
    const read = async (stream: ReadableStream<Uint8Array>) => {
      for await (const piece of stream) output += decoder.decode(piece, { stream: true });
    };
    const [exitCode] = await Promise.all([child.exited, read(child.stdout), read(child.stderr)]);
    // A step killed by a signal has no exit code of its own: it failed.
    return {
      step,
      exitCode: child.signalCode ? null : exitCode,
      output: child.signalCode ? `${output}\nkilled by ${child.signalCode}` : output,
      ms: performance.now() - started,
    };
  } catch (error) {
    return { step, exitCode: null, output: `could not be started: ${error}`, ms: performance.now() - started };
  }
}

/** Runs the given steps at the same time, printing each one's header and whole output in the given order as it is done. */
async function runTogether(steps: Step[]) {
  const results: StepResult[] = [];
  for (const running of steps.map(run)) {
    const result = await running;
    console.log(`${stepHeader(result)}\n${result.output.trimEnd()}\n`);
    results.push(result);
  }
  return results;
}

/** Everything `bun run verify` does: runs the steps, prints them, and returns verify's exit code. */
async function verify() {
  const started = performance.now();
  const others = STEPS.filter((step) => step.name !== "tests");
  // On GitHub's runner (`CI`) the tests wait for lint and typecheck and run one file after the other, as they always
  // did there: its two cores are slow enough that a test sharing them could run past `bun test`'s 5 s limit, which
  // stopped a deploy before (see src/heavyTest.ts). Everywhere else all three start at once.
  const results = process.env.CI ? [...(await runTogether(others)), ...(await runTogether([CI_TESTS]))] : await runTogether(STEPS);
  console.log(summaryLine(results, performance.now() - started));
  return verifyExitCode(results);
}

if (import.meta.main) {
  // Anything going wrong in verify itself is a failure too, said in the same last line.
  process.exitCode = await verify().catch((error) => {
    console.error(error);
    console.log("verify: FAILED (verify itself)");
    return 1;
  });
}
