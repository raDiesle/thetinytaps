import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Headless Chrome for the tools that play the app (`bun run perf`, `bun run previews`): nothing to install, it drives
// the Chrome that is on the computer through its DevTools protocol, over Bun's own WebSocket.

/** Chrome's own program, wherever this computer keeps it. */
function chromePath() {
  const candidates = [
    process.env.CHROME,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  const found = candidates.find((c) => c && Bun.file(c).size > 0);
  if (!found) throw new Error("No Chrome found: set CHROME to its program.");
  return found;
}

/** A minimal DevTools protocol client: commands with answers, and events. */
export class Cdp {
  private next = 1;
  private waiting = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  private listeners = new Map<string, ((params: Record<string, unknown>) => void)[]>();
  private constructor(private socket: WebSocket) {
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const w = this.waiting.get(message.id);
        this.waiting.delete(message.id);
        if (message.error) w?.reject(new Error(`${message.error.message} ${message.error.data ?? ""}`));
        else w?.resolve(message.result);
      } else for (const listener of this.listeners.get(message.method) ?? []) listener(message.params);
    });
  }

  static async connect(url: string) {
    const socket = new WebSocket(url);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    });
    return new Cdp(socket);
  }

  send<T = Record<string, unknown>>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    const id = this.next++;
    this.socket.send(JSON.stringify({ id, method, params }));
    // A call that never answers (a tap gesture on a page that hangs) fails after a while instead of stopping the run.
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.waiting.delete(id);
        reject(new Error(`${method} did not answer within 30 s`));
      }, 30000);
      this.waiting.set(id, {
        resolve: (v: unknown) => {
          clearTimeout(timer);
          (resolve as (v: unknown) => void)(v);
        },
        reject: (e: Error) => {
          clearTimeout(timer);
          reject(e);
        },
      });
    });
  }

  /** Listens to an event until the returned function is called. */
  on(method: string, listener: (params: Record<string, unknown>) => void) {
    this.listeners.set(method, [...(this.listeners.get(method) ?? []), listener]);
    return () => this.listeners.set(method, (this.listeners.get(method) ?? []).filter((l) => l !== listener));
  }

  once(method: string) {
    return new Promise<Record<string, unknown>>((resolve) => {
      const off = this.on(method, (params) => {
        off();
        resolve(params);
      });
    });
  }

  close() {
    this.socket.close();
  }
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Opens an address and waits until it has loaded – or 15 s, since going to the address already open may not load anew. */
export async function open(cdp: Cdp, url: string) {
  const loaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url });
  await Promise.race([loaded, sleep(15000)]);
}

/** The window Chrome draws into: its size in CSS pixels and how many device pixels each has. */
export interface Screen {
  width: number;
  height: number;
  scale: number;
}

/** Starts headless Chrome with a window of `screen` and connects to its first tab. */
export async function launchChrome(screen: Screen) {
  const profile = mkdtempSync(join(tmpdir(), "tinytaps-chrome-"));
  const chrome = Bun.spawn(
    [
      chromePath(),
      "--headless=new",
      "--remote-debugging-port=0",
      `--user-data-dir=${profile}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--mute-audio",
      "--autoplay-policy=no-user-gesture-required",
      // A microphone that hears a tone, allowed without asking (Laut & Leise).
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
      `--window-size=${screen.width * screen.scale},${screen.height * screen.scale}`,
      // The phone's pixels for real: DevTools' device emulation alone tells the page it has 3× pixels but rasters the
      // picture at the window's own 1×, so what painting many pixels costs went unmeasured (November 2026).
      `--force-device-scale-factor=${screen.scale}`,
      // A screen as big as the phone's, or fullscreen (which a phone's first tap asks for) shrinks the window to Chrome's own.
      `--screen-info={${screen.width * screen.scale}x${screen.height * screen.scale}}`,
      "about:blank",
    ],
    { stdout: "ignore", stderr: "ignore" },
  );
  let port = 0;
  for (let tries = 0; tries < 100 && !port; tries++) {
    await sleep(100);
    try {
      port = Number(readFileSync(join(profile, "DevToolsActivePort"), "utf8").split("\n")[0]);
    } catch {}
  }
  if (!port) throw new Error("Chrome did not start.");
  const tabs = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()) as { type: string; webSocketDebuggerUrl: string }[];
  const cdp = await Cdp.connect(tabs.find((t) => t.type === "page")!.webSocketDebuggerUrl);
  const stop = () => {
    cdp.close();
    chrome.kill();
    rmSync(profile, { recursive: true, force: true });
  };
  return { cdp, stop };
}

/**
 * Builds the site and serves out/ (unless `build` is false: the out/ that is there), or uses the server at `url`.
 * `readable` keeps the build's function names, for profiles.
 */
export async function siteUrl({ url, build = true, readable = false }: { url?: string; build?: boolean; readable?: boolean }): Promise<{ url: string; stop: () => void }> {
  if (url) return { url: url.replace(/\/$/, ""), stop: () => {} };
  if (build) {
    console.log("Building …");
    const built = Bun.spawnSync(["bun", "run", "build"], { stdout: "ignore", stderr: "inherit", env: { ...process.env, PUBLIC_BASE_PATH: "/", READABLE: readable ? "1" : "" } });
    if (built.exitCode !== 0) throw new Error("The build failed.");
  }
  const server = Bun.spawn(["bun", join(import.meta.dir, "preview.ts"), "--port", "3400"], { stdout: "pipe", stderr: "inherit" });
  const reader = server.stdout.getReader();
  let text = "";
  while (!/http:\/\/\S+/.test(text)) {
    const { value, done } = await reader.read();
    if (done) throw new Error("The preview server did not start.");
    text += new TextDecoder().decode(value);
  }
  return { url: text.match(/http:\/\/\S+/)![0].replace(/\/$/, ""), stop: () => server.kill() };
}

/** Runs `expression` in the page and returns its value (awaited, as JSON). */
export async function evaluate<T>(cdp: Cdp, expression: string): Promise<T> {
  const result = await cdp.send<{ result: { value: T }; exceptionDetails?: { text: string } }>("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(`${result.exceptionDetails.text}: ${expression}`);
  return result.result.value;
}
