import { join } from "node:path";
import type { Subprocess } from "bun";
import { askedPort } from "./serve";
import { isThere, stillImported, type UnresolvedImport, unresolvedImportReader } from "./staleImports";

// `bun run dev`: runs the dev server (tools/devServer.ts) and restarts it when Bun gets stuck. A merge
// that brings new files together with their importers (main merged into a worktree) can leave Bun
// reporting "Could not resolve" for files that are there by now, until it is restarted. So this watches
// the server's output: when every file it couldn't find is there, but the page still fails to build, the
// server restarts on the same port and the browser reloads by itself. A real mistake (a typo, a missing
// file) never restarts it; Bun shows it until it is fixed, as before.

const SERVER = join(import.meta.dir, "devServer.ts");

/** The port the server is on: asked for first, then the one it found free, kept across restarts. */
let port = askedPort(3000);
let server: Subprocess<"inherit", "pipe", "pipe">;
let restarting = false;
let startedAt = 0;
/** The imports the running server reported it couldn't resolve, by specifier and importer. */
const unresolved = new Map<string, UnresolvedImport>();
/** When each of them was first seen to be there. */
const arrivedAt = new Map<string, number>();

function start() {
  unresolved.clear();
  arrivedAt.clear();
  startedAt = Date.now();
  server = Bun.spawn(["bun", SERVER, "--port", String(port)], {
    stdin: "inherit",
    stdout: "pipe",
    stderr: "pipe",
    // Bun keeps its colours though its output goes through here.
    env: { ...process.env, FORCE_COLOR: "1" },
  });
  pass(server.stdout, process.stdout);
  pass(server.stderr, process.stderr);
  server.exited.then((code) => restarting || process.exit(code));
}

/** Copies the server's output to ours as it comes, and reads it line by line. */
async function pass(stream: ReadableStream<Uint8Array>, out: NodeJS.WriteStream) {
  const read = unresolvedImportReader((found) => unresolved.set(`${found.specifier}\n${found.importer}`, found));
  const decoder = new TextDecoder();
  let rest = "";
  for await (const chunk of stream) {
    out.write(chunk);
    const lines = (rest + decoder.decode(chunk, { stream: true })).split("\n");
    rest = lines.pop() ?? "";
    for (const line of lines) {
      const address = line.match(/http:\/\/localhost:(\d+)\//);
      if (address) port = Number(address[1]);
      read(line);
    }
  }
}

/** Whether the page fails to build right now (Bun's error page instead of the app). */
async function buildFails() {
  try {
    return (await (await fetch(`http://localhost:${port}/`)).text()).includes("<title>Bun - Build Failed</title>");
  } catch {
    return false;
  }
}

async function restart(missing: string[]) {
  restarting = true;
  console.log(`\nBun still can't find ${missing.join(", ")}, which are there now: restarting the dev server.\n`);
  server.kill();
  await server.exited;
  restarting = false;
  start();
}

let checking = false;
setInterval(async () => {
  // Bun recovers from most of these by itself within moments; give it time, and the new server too.
  if (checking || restarting || unresolved.size === 0 || Date.now() - startedAt < 3000) return;
  checking = true;
  for (const [key, found] of unresolved)
    if (!stillImported(found)) {
      unresolved.delete(key);
      arrivedAt.delete(key);
    }
  // Files still missing stay listed: in the middle of a merge they may come a moment later. After a
  // restart, a new server lists only those that really are missing, so it never restarts again for them.
  // A file that has just come gets two seconds for Bun to find it by itself, which it mostly does.
  for (const [key, found] of unresolved) if (!arrivedAt.has(key) && isThere(found)) arrivedAt.set(key, Date.now());
  const arrived = [...unresolved].filter(([key]) => Date.now() - (arrivedAt.get(key) ?? Date.now()) >= 2000).map(([, found]) => found);
  if (arrived.length > 0) {
    if (await buildFails()) await restart([...new Set(arrived.map(({ specifier }) => specifier))]);
    else {
      unresolved.clear();
      arrivedAt.clear();
    }
  }
  checking = false;
}, 1000);

for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"] as const) process.on(signal, () => server.kill(signal));

start();
