import { expect, test } from "bun:test";
import { join } from "node:path";
import { isThere, stillImported, type UnresolvedImport, unresolvedImportReader } from "../tools/staleImports";

// `bun run dev` (tools/dev.ts) restarts the dev server when Bun is stuck on files that are there by now. It reads
// Bun's error output and looks at the disk itself; a wrong reading would restart it for nothing, or never.

const APP = join(import.meta.dir, "App.tsx");

test("Bun's „Could not resolve“ errors are read with their importer, also in colour", () => {
  const found: UnresolvedImport[] = [];
  const read = unresolvedImportReader((unresolved) => found.push(unresolved));
  const output = [
    '\x1b[2m23 |\x1b[0m const ImprintPage = page(() => import("@/pages/LegalPage"));',
    '\x1b[31merror\x1b[0m: Could not resolve: \x1b[1m"@/pages/LegalPage"\x1b[0m. Maybe you need to "bun install"?',
    `    at \x1b[36m${APP}\x1b[0m:23:40`,
    "",
    'error: Could not resolve: "./nowhere"',
    "    at /x/src/lib/a.ts:1:8",
    "error: Unexpected end of file",
    "    at /x/src/lib/b.ts:9:1",
    "[x2] Reloaded in 4ms: src/App.tsx",
  ];
  for (const line of output) read(line);
  expect(found).toEqual([
    { specifier: "@/pages/LegalPage", importer: APP },
    { specifier: "./nowhere", importer: "/x/src/lib/a.ts" },
  ]);
});

test("an import counts as there by `@/`, relative path, ending, index file or package", () => {
  expect(isThere({ specifier: "@/App", importer: APP })).toBe(true);
  expect(isThere({ specifier: "./lib/silent", importer: APP })).toBe(true);
  expect(isThere({ specifier: "@/lib/sfx", importer: APP })).toBe(true);
  expect(isThere({ specifier: "react-dom/client", importer: APP })).toBe(true);
  expect(isThere({ specifier: "@/lib", importer: APP })).toBe(false);
  expect(isThere({ specifier: "@/lib/noSuchFile", importer: APP })).toBe(false);
  expect(isThere({ specifier: "no-such-package", importer: APP })).toBe(false);
});

test("an import fixed in its importer is no longer waited for", () => {
  expect(stillImported({ specifier: "react-router", importer: APP })).toBe(true);
  expect(stillImported({ specifier: "@/lib/noSuchFile", importer: APP })).toBe(false);
  expect(stillImported({ specifier: "react", importer: "/no/such/file.ts" })).toBe(false);
});
