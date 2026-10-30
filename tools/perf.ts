import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type Budget, BUDGET, DEVICES, type Device, type Part, SCENARIOS, type Scenario, type Step } from "./perfScenarios";

// `bun run perf`: plays every game in headless Chrome as an old Android phone would (a slow CPU, a small screen
// with many pixels) and measures how smoothly its animations run. Nothing to install: it drives the Chrome that
// is on the computer through its DevTools protocol, over Bun's own WebSocket.
//
//   bun run perf                       build, then measure every scenario (tools/perfScenarios.ts)
//   bun run perf zaehne                only the scenarios whose name contains "zaehne"
//   bun run perf --no-build            measure the out/ that is there
//   bun run perf --url http://…        measure a server that already runs (the dev server is much slower: React's checks)
//   bun run perf --device phone2016    another device from DEVICES
//   bun run perf --json report.json    also write the numbers as JSON (the weekly run keeps them)
//   bun run perf --shots               a screenshot at the end of each measurement, next to the JSON or in the system's temp folder
//   bun run perf --profile             also list the functions that took the most time in each stretch (on a build that
//                                      keeps its names)
//
// For each measured stretch it prints the frames per second the page drew, how many frames took too long
// (over 50 ms is a stutter a child sees), the longest one, and how busy the main thread was (script, style,
// layout, and the rest – mostly painting). Rows over the budget (perfScenarios.ts) are marked; the exit code
// is 1 when any is, so a weekly run can tell.

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const optionValues = new Set(["url", "device", "json"].map((n) => option(n)).filter(Boolean));
const filters = args.filter((a) => !a.startsWith("--") && !optionValues.has(a));
const device: Device = DEVICES[option("device") ?? "oldAndroid"] ?? DEVICES.oldAndroid;

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
class Cdp {
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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Opens an address and waits until it has loaded – or 15 s, since going to the address already open may not load anew. */
async function open(cdp: Cdp, url: string) {
  const loaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url });
  await Promise.race([loaded, sleep(15000)]);
}

/** Starts headless Chrome and connects to its first tab. */
async function launchChrome() {
  const profile = mkdtempSync(join(tmpdir(), "tinytaps-perf-"));
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
      `--window-size=${device.width},${device.height}`,
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

/** Builds the site and serves out/, or uses the server given with --url. */
async function siteUrl(): Promise<{ url: string; stop: () => void }> {
  const given = option("url");
  if (given) return { url: given.replace(/\/$/, ""), stop: () => {} };
  if (!flag("no-build")) {
    console.log("Building …");
    const build = Bun.spawnSync(["bun", "run", "build"], { stdout: "ignore", stderr: "inherit", env: { ...process.env, PUBLIC_BASE_PATH: "/", READABLE: flag("profile") ? "1" : "" } });
    if (build.exitCode !== 0) throw new Error("The build failed.");
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

/** In the page: counts frames and long animation frames until `__perfStop()`. */
const FRAME_COUNTER = `(() => {
  const deltas = [];
  let last = performance.now();
  let running = true;
  const frame = (t) => { deltas.push(t - last); last = t; if (running) requestAnimationFrame(frame); };
  requestAnimationFrame((t) => { last = t; requestAnimationFrame(frame); });
  const long = [];
  let observer;
  try {
    observer = new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        const scripts = (e.scripts || []).map((s) => ({ source: (s.sourceFunctionName || s.invoker || "?") + " " + (s.sourceURL || "").split("/").pop(), ms: s.duration }));
        long.push({ ms: e.duration, render: e.renderStart ? e.startTime + e.duration - e.renderStart : 0, scripts });
      }
    });
    observer.observe({ type: "long-animation-frame", buffered: false });
  } catch {}
  window.__perfStop = () => { running = false; observer && observer.disconnect(); return { deltas, long }; };
})()`;

/** One measured stretch of a scenario. */
interface Measurement {
  scenario: string;
  label: string;
  seconds: number;
  fps: number;
  /** Frames that took longer than 50 ms: a stutter a child sees. */
  stutters: number;
  /** The longest frame, in ms. */
  longest: number;
  /** The slowest 5 % of frames take at least this long, in ms. */
  p95: number;
  /** Share of the time the main thread was busy, and with what (0 to 1). */
  busy: number;
  script: number;
  style: number;
  layout: number;
  /** Mostly painting the picture; what is left of `busy`. */
  other: number;
  /** Painting (recording what to draw, main thread) and rastering (turning it into pixels, helper threads), ms per second. */
  paintMsPerS: number;
  rasterMsPerS: number;
  /** Style recalculations and layouts per second: a lot of them usually means something moves through layout. */
  stylesPerS: number;
  layoutsPerS: number;
  /** The scripts that ran longest inside long frames. */
  culprits: string[];
  /** When in the stretch (seconds from its start) each stutter came: a glide stutters throughout, a change of picture once. */
  stutterAt: number[];
  /** With --profile: the functions that took the most time themselves. */
  hot: string[];
  over: string[];
}

async function evaluate<T>(cdp: Cdp, expression: string): Promise<T> {
  const result = await cdp.send<{ result: { value: T }; exceptionDetails?: { text: string } }>("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(`${result.exceptionDetails.text}: ${expression}`);
  return result.result.value;
}

/** The middle of the first element matching `selector`, or null. */
async function centerOf(cdp: Cdp, selector: string) {
  return evaluate<{ x: number; y: number } | null>(
    cdp,
    `(() => { const e = [...document.querySelectorAll(${JSON.stringify(selector)})].find((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`,
  );
}

/** A finger's tap, as on a phone: pointer down, up and the click it makes. */
async function tapAt(cdp: Cdp, x: number, y: number) {
  await cdp.send("Input.synthesizeTapGesture", { x, y, duration: 60, gestureSourceType: "touch" });
}

const KEY_CODES: Record<string, number> = { ArrowRight: 39, ArrowLeft: 37, ArrowUp: 38, ArrowDown: 40, " ": 32, Enter: 13, Escape: 27 };

async function pressKey(cdp: Cdp, key: string) {
  const code = KEY_CODES[key] ?? key.toUpperCase().charCodeAt(0);
  const base = { key, code: key === " " ? "Space" : key.length === 1 ? `Key${key.toUpperCase()}` : key, windowsVirtualKeyCode: code, nativeVirtualKeyCode: code };
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", ...base, text: key.length === 1 ? key : undefined });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", ...base });
}

async function runStep(cdp: Cdp, step: Step) {
  if ("wait" in step) await sleep(step.wait);
  else if ("waitFor" in step) {
    for (let tries = 0; tries < 100; tries++) {
      if (await centerOf(cdp, step.waitFor)) return;
      await sleep(100);
    }
    throw new Error(`Never appeared: ${step.waitFor}`);
  } else if ("tap" in step) {
    const at = await centerOf(cdp, step.tap);
    if (!at) {
      if (step.optional) return;
      throw new Error(`Nothing to tap: ${step.tap}`);
    }
    await tapAt(cdp, at.x, at.y);
  } else if ("key" in step) await pressKey(cdp, step.key);
  else if ("eval" in step) await evaluate(cdp, step.eval);
}

/** Presses `keys` one after the other every `every` ms while a measurement runs, like a child on a keyboard. */
function startTyping(cdp: Cdp, keys: string[], every: number) {
  let stopped = false;
  const run = async () => {
    for (let i = 0; !stopped; i++) {
      await pressKey(cdp, keys[i % keys.length]);
      await sleep(every);
    }
  };
  const done = run();
  return async () => {
    stopped = true;
    await done;
  };
}

/** Taps `selector` things one after the other every `every` ms while a measurement runs, like a child would. */
function startTapping(cdp: Cdp, selector: string, every: number) {
  let stopped = false;
  let i = 0;
  const run = async () => {
    while (!stopped) {
      const spots = await evaluate<{ x: number; y: number }[]>(
        cdp,
        `[...document.querySelectorAll(${JSON.stringify(selector)})].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth).map((r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 }))`,
      );
      if (spots.length) {
        const spot = spots[i++ % spots.length];
        await tapAt(cdp, spot.x, spot.y);
      }
      await sleep(every);
    }
  };
  const done = run();
  return async () => {
    stopped = true;
    await done;
  };
}

type Metrics = Record<string, number>;
async function metrics(cdp: Cdp): Promise<Metrics> {
  const { metrics } = await cdp.send<{ metrics: { name: string; value: number }[] }>("Performance.getMetrics");
  return Object.fromEntries(metrics.map((m) => [m.name, m.value]));
}

const percentile = (values: number[], p: number) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
};

interface TraceEvent {
  name: string;
  ph: string;
  dur?: number;
  tid: number;
}

/** Records Chrome's trace while `during` runs: where painting (main thread) and rastering (its helper threads) take time. */
async function traced(cdp: Cdp, during: () => Promise<void>) {
  const events: TraceEvent[] = [];
  const off = cdp.on("Tracing.dataCollected", (params) => events.push(...(params.value as TraceEvent[])));
  await cdp.send("Tracing.start", {
    traceConfig: { includedCategories: ["devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.timeline.frame"] },
    transferMode: "ReportEvents",
  });
  await during();
  const complete = cdp.once("Tracing.tracingComplete");
  await cdp.send("Tracing.end");
  await complete;
  off();
  const total = (names: string[]) => events.filter((e) => e.ph === "X" && names.includes(e.name)).reduce((sum, e) => sum + (e.dur ?? 0), 0) / 1000;
  if (flag("trace-names")) {
    const counts = new Map<string, number>();
    for (const e of events) counts.set(e.name, (counts.get(e.name) ?? 0) + 1);
    console.log([...counts].sort((a, b) => b[1] - a[1]).slice(0, 40));
  }
  return { paintMs: total(["Paint"]), rasterMs: total(["RasterTask"]) };
}

/** Measures `ms` of whatever runs now. */
async function measure(cdp: Cdp, scenario: Scenario, part: Part, budget: Budget): Promise<Measurement> {
  const { label, ms, tap, type } = part;
  await evaluate(cdp, FRAME_COUNTER);
  const before = await metrics(cdp);
  const start = performance.now();
  let hot: string[] = [];
  const { paintMs, rasterMs } = await traced(cdp, async () => {
    const play = async () => {
      const stopTapping = tap ? startTapping(cdp, tap.selector, tap.every) : null;
      const stopTyping = type ? startTyping(cdp, type.keys, type.every) : null;
      await sleep(ms);
      await stopTapping?.();
      await stopTyping?.();
    };
    if (flag("profile")) hot = await profiled(cdp, play);
    else await play();
  });
  const wall = (performance.now() - start) / 1000;
  const after = await metrics(cdp);
  const { deltas, long } = await evaluate<{ deltas: number[]; long: { ms: number; scripts: { source: string; ms: number }[] }[] }>(cdp, "window.__perfStop()");
  const spent = (name: string) => (after[name] - before[name]) / wall;
  const busy = spent("TaskDuration");
  const [script, style, layout] = [spent("ScriptDuration"), spent("RecalcStyleDuration"), spent("LayoutDuration")];
  const bySource = new Map<string, number>();
  for (const frame of long) for (const s of frame.scripts) bySource.set(s.source, (bySource.get(s.source) ?? 0) + s.ms);
  const culprits = [...bySource]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([source, total]) => `${source.trim()} ${Math.round(total)} ms`);
  const m: Measurement = {
    scenario: scenario.name,
    label,
    seconds: Math.round(wall * 10) / 10,
    fps: Math.round((deltas.length / wall) * 10) / 10,
    stutters: deltas.filter((d) => d > 50).length,
    longest: Math.round(Math.max(0, ...deltas)),
    p95: Math.round(percentile(deltas, 0.95)),
    busy,
    script,
    style,
    layout,
    other: Math.max(0, busy - script - style - layout),
    paintMsPerS: Math.round(paintMs / wall),
    rasterMsPerS: Math.round(rasterMs / wall),
    stylesPerS: Math.round(spent("RecalcStyleCount")),
    layoutsPerS: Math.round(spent("LayoutCount")),
    culprits,
    stutterAt: deltas.flatMap((d, i) => (d > 50 ? [Math.round(deltas.slice(0, i + 1).reduce((a, b) => a + b, 0) / 100) / 10] : [])),
    hot,
    over: [],
  };
  const limits = { ...budget, ...scenario.budget };
  if (m.p95 > limits.p95) m.over.push(`p95 ${m.p95} > ${limits.p95} ms`);
  if (m.stutters / wall > limits.stuttersPerS) m.over.push(`${m.stutters} stutters`);
  if (m.busy > limits.busy) m.over.push(`busy ${Math.round(m.busy * 100)} % > ${Math.round(limits.busy * 100)} %`);
  return m;
}

interface ProfileNode {
  id: number;
  callFrame: { functionName: string; url: string; lineNumber: number };
}

/** Runs `during` under the JavaScript profiler and returns the functions that took the most time themselves. */
async function profiled(cdp: Cdp, during: () => Promise<void>): Promise<string[]> {
  await cdp.send("Profiler.enable");
  await cdp.send("Profiler.setSamplingInterval", { interval: 200 });
  await cdp.send("Profiler.start");
  await during();
  const { profile } = await cdp.send<{ profile: { nodes: ProfileNode[]; samples: number[]; timeDeltas: number[] } }>("Profiler.stop");
  const nodes = new Map(profile.nodes.map((n) => [n.id, n]));
  const self = new Map<string, number>();
  profile.samples.forEach((id, i) => {
    const { functionName, url, lineNumber } = nodes.get(id)!.callFrame;
    if (["(idle)", "(program)", "(garbage collector)"].includes(functionName) || !url) return;
    const name = `${functionName || "(anonymous)"} ${url.split("/").pop()?.split("?")[0]}:${lineNumber + 1}`;
    self.set(name, (self.get(name) ?? 0) + profile.timeDeltas[i] / 1000);
  });
  return [...self]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, ms]) => `${name} ${Math.round(ms)} ms`);
}

const pct = (k: number) => `${Math.round(k * 100)}`.padStart(3);

function printRow(m: Measurement) {
  const mark = m.over.length ? "✗" : "✓";
  console.log(
    `  ${mark} ${m.label.padEnd(34)} ${String(m.fps).padStart(5)} fps  ${String(m.stutters).padStart(3)} stutters  longest ${String(m.longest).padStart(4)} ms  p95 ${String(m.p95).padStart(3)} ms  busy ${pct(m.busy)} % (script ${pct(m.script)}, style ${pct(m.style)}, layout ${pct(m.layout)}, other ${pct(m.other)})  paint ${String(m.paintMsPerS).padStart(3)}  raster ${String(m.rasterMsPerS).padStart(4)} ms/s${m.over.length ? `  ← ${m.over.join(", ")}` : ""}`,
  );
  if (m.over.length && m.culprits.length) console.log(`      slowest scripts in long frames: ${m.culprits.join(" · ")}`);
  if (m.over.length && m.stutterAt.length) console.log(`      stutters at: ${m.stutterAt.map((t) => `${t}s`).join(" ")}`);
  if (m.hot.length) console.log(`      most time in: ${m.hot.join(" · ")}`);
}

async function runScenario(cdp: Cdp, base: string, scenario: Scenario, shotsDir: string | null): Promise<Measurement[]> {
  // Every scenario starts as a first visit would after the cover: fresh storage, the book already opened, in German.
  await open(cdp, `${base}/`);
  await evaluate(
    cdp,
    `localStorage.clear(); localStorage.setItem("tinytaps.book.opened", "1"); localStorage.setItem("tinytaps.applanguage.v1", "de"); ${scenario.storage ?? ""}`,
  );
  await open(cdp, `${base}${scenario.path}`);
  await sleep(1500);
  // On a phone the first tap of a visit goes to the fullscreen hint (ScreenHint), as a parent's would.
  await runStep(cdp, { tap: ".screen-hint-button", optional: true });
  await sleep(500);
  const results: Measurement[] = [];
  for (const part of scenario.parts) {
    for (const step of part.before ?? []) await runStep(cdp, step);
    const m = await measure(cdp, scenario, part, BUDGET);
    results.push(m);
    printRow(m);
    if (shotsDir) {
      const { data } = await cdp.send<{ data: string }>("Page.captureScreenshot", { format: "png" });
      writeFileSync(join(shotsDir, `${scenario.name}-${part.label}.png`.replace(/[^\w.-]+/g, "_")), Buffer.from(data, "base64"));
    }
  }
  return results;
}

async function main() {
  const scenarios = SCENARIOS.filter((s) => !filters.length || filters.some((f) => s.name.includes(f)));
  if (!scenarios.length) throw new Error(`No scenario matches ${filters.join(", ")}.`);
  const site = await siteUrl();
  const { cdp, stop } = await launchChrome();
  const shotsDir = flag("shots") ? mkdtempSync(join(tmpdir(), "tinytaps-perf-shots-")) : null;
  const all: Measurement[] = [];
  try {
    await cdp.send("Page.enable");
    // A game asks before the page is left (GameShell, so a child can't leave it); the next scenario leaves anyway.
    cdp.on("Page.javascriptDialogOpening", () => void cdp.send("Page.handleJavaScriptDialog", { accept: true }));
    await cdp.send("Performance.enable", { timeDomain: "threadTicks" });
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: device.width, height: device.height, deviceScaleFactor: device.scale, mobile: true });
    await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: device.cpuSlowdown });
    console.log(
      `${device.name}: ${device.width}×${device.height} at ${device.scale}× pixels, CPU ${device.cpuSlowdown}× slower than this computer · ${site.url}`,
    );
    for (const scenario of scenarios) {
      console.log(`\n${scenario.name}`);
      try {
        all.push(...(await runScenario(cdp, site.url, scenario, shotsDir)));
      } catch (error) {
        console.log(`  ! ${(error as Error).message}`);
      }
    }
  } finally {
    stop();
    site.stop();
  }
  const over = all.filter((m) => m.over.length);
  console.log(`\n${all.length - over.length} of ${all.length} stretches within budget.`);
  if (shotsDir) console.log(`Screenshots: ${shotsDir}`);
  const json = option("json");
  if (json) writeFileSync(json, `${JSON.stringify({ date: new Date().toISOString(), device, measurements: all }, null, 2)}\n`);
  process.exit(over.length ? 1 : 0);
}

await main();
