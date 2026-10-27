import type { Serve, Server } from "bun";

/**
 * Starts a server on the first free port from `port` on: several sessions run dev servers side by side.
 * Bun takes "localhost" as 127.0.0.1 and wouldn't see a server already on [::1]:3000 – where the browser
 * goes first – so it listens on ::1 itself, and prints the address as localhost.
 */
export function serveOnFreePort(port: number, options: Omit<Serve.Options<undefined>, "port" | "hostname">): Server<undefined> {
  for (let tries = 0; ; tries++) {
    try {
      const server = Bun.serve({ ...options, port: port + tries, hostname: "::1" } as Serve.Options<undefined>);
      return server;
    } catch (error) {
      if ((error as { code?: string }).code !== "EADDRINUSE" || tries === 20) throw error;
    }
  }
}

/** The port asked for with `--port 3200`, else PORT, else the fallback. */
export function askedPort(fallback: number) {
  const flag = process.argv.indexOf("--port");
  return Number(flag >= 0 ? process.argv[flag + 1] : process.env.PORT) || fallback;
}
