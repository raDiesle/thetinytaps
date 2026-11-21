import type { Serve, Server } from "bun";

/**
 * Starts a server on the first free port from `port` on: several sessions run dev servers side by side.
 * Bun takes "localhost" as 127.0.0.1 and wouldn't see a server already on [::1]:3000 – where the browser
 * goes first – so it listens on ::1 itself, and prints the address as localhost. A machine without IPv6 (the Claude
 * cloud container, November 2026: `bun run previews` stopped on EAFNOSUPPORT) gets 127.0.0.1 instead.
 */
export function serveOnFreePort(port: number, options: Omit<Serve.Options<undefined>, "port" | "hostname">): Server<undefined> {
  let hostname = "::1";
  for (let tries = 0; ; tries++) {
    try {
      const server = Bun.serve({ ...options, port: port + tries, hostname } as Serve.Options<undefined>);
      return server;
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code === "EAFNOSUPPORT" && hostname === "::1") {
        hostname = "127.0.0.1";
        tries--;
        continue;
      }
      if (code !== "EADDRINUSE" || tries === 20) throw error;
    }
  }
}

/** The port asked for with `--port 3200`, else PORT, else the fallback. */
export function askedPort(fallback: number) {
  const flag = process.argv.indexOf("--port");
  return Number(flag >= 0 ? process.argv[flag + 1] : process.env.PORT) || fallback;
}
