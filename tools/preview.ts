import { join, normalize } from "node:path";
import { askedPort, serveOnFreePort } from "./serve";

// `bun run preview`: serves out/ like GitHub Pages does – under PUBLIC_BASE_PATH, a folder answers with
// its index.html, an unknown address with 404.html and status 404 – so the built site, its search
// engine pages and the service worker can be tried before they go online.

const OUT = join(import.meta.dir, "../out");
const base = (process.env.PUBLIC_BASE_PATH || "/").replace(/\/$/, "");

/** The file of out/ an address stands for, if there is one. */
async function fileFor(pathname: string) {
  if (!pathname.startsWith(`${base}/`)) return null;
  let path = normalize(join(OUT, decodeURIComponent(pathname.slice(base.length))));
  if (!path.startsWith(OUT)) return null;
  if (pathname.endsWith("/")) path = join(path, "index.html");
  const file = Bun.file(path);
  return (await file.exists()) ? file : null;
}

const server = serveOnFreePort(askedPort(3000), {
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (base && pathname === "/") return Response.redirect(`${base}/`);
    if (base && pathname === base) return Response.redirect(`${base}/`);
    const file = await fileFor(pathname);
    if (file) return new Response(file);
    // GitHub Pages: a folder without its trailing slash moves to it.
    if (await fileFor(`${pathname}/`)) return Response.redirect(`${pathname}/`);
    return new Response(Bun.file(join(OUT, "404.html")), { status: 404, headers: { "Content-Type": "text/html;charset=utf-8" } });
  },
});
console.log(`The Tiny Taps (out/): http://localhost:${server.port}${base}/`);
