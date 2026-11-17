import { join, resolve, sep } from "node:path";

/** What an address stands for inside a root folder: its file path, or the status to answer when it can't be served. */
export type SafePath = { path: string } | { status: 400 | 404 };

/**
 * Resolves an address path under `root` for the local servers. A malformed `%` is a 400; anything that leaves
 * the root (`/../x`, `/%2e%2e/x`) or lands in a sibling folder named like it (`out-x`) is a 404.
 */
export function safePath(root: string, encodedPath: string): SafePath {
  let decoded: string;
  try {
    decoded = decodeURIComponent(encodedPath);
  } catch {
    return { status: 400 };
  }
  const base = resolve(root);
  const path = resolve(join(base, decoded));
  return path === base || path.startsWith(base + sep) ? { path } : { status: 404 };
}
