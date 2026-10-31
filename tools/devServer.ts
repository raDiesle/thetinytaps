import { readdirSync } from "node:fs";
import { join } from "node:path";
import index from "../index.html";
import { askedPort, serveOnFreePort } from "./serve";

// The dev server: the app from the sources with hot reload. Bun bundles index.html on the fly with the
// app's plugin (bunfig.toml, [serve.static]); every address the app doesn't know as a file of public/
// gets the app, which shows the page itself. `bun run dev` starts it through tools/dev.ts, which restarts
// it when Bun gets stuck on a file that has arrived since.

const PUBLIC = join(import.meta.dir, "../public");

/** public/ as it is: /manifest.webmanifest, /icons/…, /images/…. */
const publicRoutes = Object.fromEntries(
  readdirSync(PUBLIC, { withFileTypes: true }).map((entry) => [
    entry.isDirectory() ? `/${entry.name}/*` : `/${entry.name}`,
    async (request: Request) => {
      const file = Bun.file(join(PUBLIC, decodeURIComponent(new URL(request.url).pathname)));
      return (await file.exists()) ? new Response(file) : new Response("Not found", { status: 404 });
    },
  ]),
);

const server = serveOnFreePort(askedPort(3000), {
  routes: { ...publicRoutes, "/*": index },
  development: { hmr: true, console: true },
});
console.log(`Books for Both: http://localhost:${server.port}/`);

// Started by tools/dev.ts: when that ends without stopping this one (killed hard), end too instead of
// keeping the port.
const parent = process.ppid;
setInterval(() => process.ppid !== parent && process.exit(), 2000);
