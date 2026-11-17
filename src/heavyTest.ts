import { test } from "bun:test";

// Tests that take seconds (a whole story played frame by frame) run here before every commit (`bun run verify`), but
// not on GitHub's runner, which is about twice as slow as a Mac and stopped the deploy on main past `bun test`'s 5 s
// limit (November 2026). There they only checked again what was already checked before the commit; the deploy runs
// the rest of the tests. GitHub sets `CI` in every workflow.

/** How long a heavy test may take here before it fails: the Schatzinsel's collisions take about 3.5 s on a Mac. */
export const HEAVY_TEST_MS = 30_000;

/** True on GitHub's runner (and any other CI), where heavy tests are skipped. */
export const onCi = Boolean(process.env.CI);

/** A test taking seconds: run locally with a timeout of its own, skipped on CI. */
export function heavyTest(name: string, check: () => void | Promise<void>) {
  test.skipIf(onCi)(name, check, HEAVY_TEST_MS);
}
