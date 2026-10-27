import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Installing packages is where a supply-chain attack gets in, so bunfig.toml keeps Bun careful
// (see the comments there). These checks fail when a setting is loosened or another package
// manager's files come back.

const ROOT = join(import.meta.dir, "..");
const bunfig = Bun.TOML.parse(readFileSync(join(ROOT, "bunfig.toml"), "utf8")) as { telemetry?: boolean; install?: Record<string, unknown> };
const install = bunfig.install ?? {};
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as { packageManager?: string; trustedDependencies?: string[] };

test("installs come only from the public npm registry and only versions at least 3 days old", () => {
  expect(install.registry).toBe("https://registry.npmjs.org/");
  expect(install.minimumReleaseAge).toBeGreaterThanOrEqual(3 * 24 * 60 * 60);
});

test("packages run no install scripts and nothing is installed on the fly", () => {
  expect(install.ignoreScripts).toBe(true);
  expect(install.auto).toBe("disable");
  expect(pkg.trustedDependencies ?? []).toEqual([]);
  expect(bunfig.telemetry).toBe(false);
});

test("Bun is the only package manager", () => {
  expect(pkg.packageManager).toStartWith("bun@");
  expect(existsSync(join(ROOT, "bun.lock"))).toBe(true);
  for (const other of ["yarn.lock", "package-lock.json", "pnpm-lock.yaml", ".yarnrc.yml", ".npmrc"]) expect(existsSync(join(ROOT, other)), other).toBe(false);
});
