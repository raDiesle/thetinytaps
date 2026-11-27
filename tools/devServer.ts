import { readdirSync } from "node:fs";
import { join } from "node:path";
import index from "../index.html";
import { DEV_FILES } from "./appPlugin";
import { safePath } from "./safePath";
import { askedPort, serveOnFreePort } from "./serve";

// The dev server: the app from the sources with hot reload. Bun bundles index.html on the fly with the
// app's plugin (bunfig.toml, [serve.static]); every address the app doesn't know as a file of public/
// gets the app, which shows the page itself. `bun run dev` starts it through tools/dev.ts, which restarts
// it when Bun gets stuck on a file that has arrived since.

const PUBLIC = join(import.meta.dir, "../public");
const SRC = join(import.meta.dir, "../src");

/** A file of `root` at the address's path below `prefix`, or 404. */
const fileOf = (root: string, prefix: string) => async (request: Request) => {
  const found = safePath(root, new URL(request.url).pathname.slice(prefix.length));
  if ("status" in found) return new Response("Not found", { status: found.status });
  const file = Bun.file(found.path);
  return (await file.exists()) ? new Response(file) : new Response("Not found", { status: 404 });
};

/** public/ as it is: /manifest.webmanifest, /icons/…, /images/…. */
const publicRoutes = Object.fromEntries(
  readdirSync(PUBLIC, { withFileTypes: true }).map((entry) => [entry.isDirectory() ? `/${entry.name}/*` : `/${entry.name}`, fileOf(PUBLIC, "")]),
);

const server = serveOnFreePort(askedPort(3000), {
  // The pictures and recordings of `?glob` imports, read from src/ as they are asked for (tools/appPlugin.ts, DEV_FILES).
  routes: { ...publicRoutes, [`${DEV_FILES}*`]: fileOf(SRC, DEV_FILES), "/*": index },
  development: { hmr: true, console: true },
});
console.log(`Little Steps to Grow: http://localhost:${server.port}/`);

// Started by tools/dev.ts: when that ends without stopping this one (killed hard), end too instead of
// keeping the port.
const parent = process.ppid;
setInterval(() => process.ppid !== parent && process.exit(), 2000);
