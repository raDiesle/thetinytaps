import { readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";

// Bun's dev server can get stuck on an import it once failed to resolve: when a merge or a branch switch
// writes an importer before the new file it imports, Bun reports "Could not resolve" and keeps doing so
// after the file is there, until it is restarted. These helpers let tools/dev.ts tell that apart from a
// real mistake (a typo, a file that is really missing), which a restart wouldn't fix.

const ROOT = join(import.meta.dir, "..");
const SRC = join(ROOT, "src");

/** An import Bun reported it could not resolve: what was imported, and the file that imports it. */
export interface UnresolvedImport {
  specifier: string;
  importer: string;
}

/**
 * A reader for the dev server's output, line by line: calls `found` for each "Could not resolve" error
 * once its "at <file>:<line>:<column>" line has come. Colours are ignored.
 */
export function unresolvedImportReader(found: (unresolved: UnresolvedImport) => void) {
  let specifier: string | undefined;
  return (line: string) => {
    // biome-ignore lint/suspicious/noControlCharactersInRegex: the escape that starts a terminal colour
    const text = line.replace(/\x1b\[[0-9;]*m/g, "");
    const error = text.match(/Could not resolve: "([^"]+)"/);
    if (error) {
      specifier = error[1];
      return;
    }
    const at = text.match(/^\s+at (\/.+?):\d+:\d+\s*$/);
    if (at && specifier) found({ specifier, importer: at[1] });
    if (at || text.trim().startsWith("error:")) specifier = undefined;
  };
}

/** Endings Bun tries for an import without one. */
const ENDINGS = ["", ".ts", ".tsx", ".js", ".jsx", ".json", "/index.ts", "/index.tsx", "/index.js"];

const isFile = (path: string) => statSync(path, { throwIfNoEntry: false })?.isFile() ?? false;

/** Whether the importer still imports it (else it was fixed there, and Bun saw that). */
export function stillImported({ specifier, importer }: UnresolvedImport) {
  try {
    const code = readFileSync(importer, "utf8");
    return code.includes(`"${specifier}"`) || code.includes(`'${specifier}'`);
  } catch {
    return false;
  }
}

/** Whether the imported file (or package) is there now. Looks at the disk itself, since a resolver's cache may be as stale as Bun's. */
export function isThere({ specifier, importer }: UnresolvedImport) {
  const path = specifier.replace(/\?.*$/, "");
  let base: string;
  if (path.startsWith("@/")) base = join(SRC, path.slice(2));
  else if (path.startsWith(".")) base = join(dirname(importer), path);
  else if (isAbsolute(path)) base = path;
  else {
    const name = path.split("/").slice(0, path.startsWith("@") ? 2 : 1).join("/");
    return isFile(join(ROOT, "node_modules", name, "package.json"));
  }
  return ENDINGS.some((ending) => isFile(base + ending));
}
