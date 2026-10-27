// Makes pictures with Gemini and saves them ready for the game (WebP or PNG).
// Guide and examples: .claude/skills/bild-erzeugen/SKILL.md
//
//   bun run image <out.webp> "<prompt>" [--ref a.png ...] [--aspect 4:3] [--size 1200x900]
//              [--transparent] [--key ff00ff] [--quality 80] [--model <id>]
//   bun run image a.webp,b.webp "<prompt>" --grid 1x2 --panel "<a>" --panel "<b>" [options]
//   bun run image --jobs jobs.json            many pictures in one batch
//   bun run image <out.webp> --from <picture.png> [--transparent] [--size ...]
//   bun run image status                      batches still running, in all checkouts
//   bun run image fetch [--wait]              saves what is ready (and waits for the rest)
//
// By default the pictures go through the Batch API: half the price, but they can
// take minutes to hours. The script waits and saves them when they are ready;
// --no-wait only sends them, --now asks right away at the full price. Running
// batches are noted in the shared .git folder, so `bun run image fetch` gets them
// from any checkout, even after the worktree that sent them is gone.
//
// --grid asks for several pictures in one (half or a quarter of the price each)
// with magenta gaps and cuts it apart; each panel gets its own --panel description.
//
// The untouched Gemini picture is kept in .image-raw/ (not committed), so it can
// be processed again with --from or passed as --ref for the next picture.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import sharp from "sharp";

const RAW_DIR = ".image-raw";
const DEFAULT_MODEL = "gemini-3.1-flash-lite-image";
const API = "https://generativelanguage.googleapis.com/v1beta";
const POLL_MS = 30_000;
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
/** The gaps between the pictures of a grid: a colour no picture here uses, so the cuts are easy to find. */
const GAP = "ff00ff";
const ASPECTS = ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"];

function fail(message) {
  console.error(message);
  process.exit(1);
}

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();
const ROOT = git("rev-parse", "--show-toplevel");
/** Shared by all worktrees of the repository, so a batch outlives the worktree that sent it. */
const BATCH_DIR = join(git("rev-parse", "--path-format=absolute", "--git-common-dir"), "image-batches");

// ---------- Arguments ----------

function parseArgs(argv) {
  const opts = { refs: [], panels: [], key: "ff00ff", quality: 80 };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) fail(`${a} needs a value`);
      return argv[++i];
    };
    if (a === "--ref") opts.refs.push(next());
    else if (a === "--panel") opts.panels.push(next());
    else if (a === "--grid") opts.grid = next();
    else if (a === "--jobs") opts.jobs = next();
    else if (a === "--from") opts.from = next();
    else if (a === "--aspect") opts.aspect = next();
    else if (a === "--size") opts.size = next();
    else if (a === "--transparent") opts.transparent = true;
    else if (a === "--key") opts.key = next().replace(/^#/, "");
    else if (a === "--quality") opts.quality = Number(next());
    else if (a === "--model") opts.model = next();
    else if (a === "--now") opts.now = true;
    else if (a === "--no-wait") opts.wait = false;
    else if (a === "--wait") opts.wait = true;
    else if (a.startsWith("--")) fail(`unknown option ${a}`);
    else rest.push(a);
  }
  [opts.out, opts.prompt] = rest;
  return opts;
}

/** One request: one picture, or one grid cut into several. Paths relative to the checkout. */
/** The fields a job in --jobs may have; anything else is a typo that would be ignored silently. */
const JOB_FIELDS = new Set(["out", "prompt", "ref", "refs", "panels", "aspect", "grid", "size", "quality", "transparent", "key"]);

/** A job read from a --jobs file, checked for fields this script doesn't know. */
function checkedJob(o) {
  const unknown = Object.keys(o).filter((k) => !JOB_FIELDS.has(k));
  if (unknown.length) fail(`unknown job field(s): ${unknown.join(", ")} – allowed: ${[...JOB_FIELDS].join(", ")}`);
  return o;
}

function toJob(o) {
  const outs = Array.isArray(o.out)
    ? o.out
    : String(o.out ?? "")
        .split(",")
        .filter(Boolean);
  if (!outs.length || !o.prompt) fail('usage: bun run image <out.webp> "<prompt>" [options]  (see the top of scripts/gemini-image.mjs)');
  const job = {
    outs,
    prompt: o.prompt,
    // "ref" like the --ref option, or "refs"; a string or a list.
    refs: [o.ref ?? [], o.refs ?? []].flat(),
    panels: o.panels ?? [],
    aspect: o.aspect,
    grid: o.grid,
    size: o.size,
    quality: o.quality ?? 80,
    transparent: Boolean(o.transparent),
    key: (o.key ?? "ff00ff").replace(/^#/, ""),
  };
  if (!/^[0-9a-f]{6}$/i.test(job.key)) fail("--key must be a colour like ff00ff");
  if (job.grid) {
    const [cols, rows] = parseGrid(job.grid);
    if (outs.length !== cols * rows) fail(`--grid ${job.grid} needs ${cols * rows} files, comma-separated (got ${outs.length})`);
    if (!o.from && job.panels.length !== outs.length) fail(`--grid ${job.grid} needs one --panel per picture (got ${job.panels.length})`);
  } else if (outs.length > 1) fail("several files need --grid");
  return job;
}

function parseGrid(grid) {
  const m = /^(\d)x(\d)$/.exec(grid ?? "1x1");
  if (!m) fail("--grid must be columns x rows, like 2x2 or 1x2");
  return [Number(m[1]), Number(m[2])];
}

// ---------- Asking Gemini ----------

const POSITIONS = {
  "2x1": ["left", "right"],
  "1x2": ["top", "bottom"],
  "2x2": ["top left", "top right", "bottom left", "bottom right"],
};

/** The whole picture's aspect for a grid of panels with this aspect, if Gemini can make it. */
function gridAspect(aspect, cols, rows) {
  const [w, h] = (aspect ?? "1:1").split(":").map(Number);
  const [gw, gh] = [w * cols, h * rows];
  const exact = ASPECTS.find((a) => {
    const [aw, ah] = a.split(":").map(Number);
    return aw * gh === ah * gw;
  });
  if (!exact) fail(`a ${cols}x${rows} grid of ${aspect ?? "1:1"} pictures is ${gw}:${gh}, which Gemini can't make (${ASPECTS.join(", ")})`);
  return exact;
}

/** On a cut-out the backdrop already is the gap. */
const gapColour = (job) => (job.transparent ? job.key : GAP);

function buildRequest(job) {
  let text = job.prompt;
  let aspect = job.aspect;
  if (job.grid) {
    const [cols, rows] = parseGrid(job.grid);
    const names = POSITIONS[`${cols}x${rows}`] ?? job.panels.map((_, i) => `row ${Math.floor(i / cols) + 1}, column ${(i % cols) + 1}`);
    aspect = gridAspect(job.aspect, cols, rows);
    text += `\n\nDraw this as ONE image made of ${job.panels.length} separate pictures in a grid of ${cols} column(s) and ${rows} row(s). All panels are exactly the same size${job.aspect ? ` (each ${job.aspect})` : ""} and separated by straight, solid #${gapColour(job)} gaps; no borders, no numbers, no labels. Every panel is a complete picture with its own background filling the panel edge to edge.`;
    job.panels.forEach((panel, i) => (text += `\nPanel ${i + 1} (${names[i]}): ${panel}`));
  }
  if (job.transparent) {
    text += `\n\nPlace the subject on a plain, perfectly flat, solid #${job.key} background that fills the whole picture edge to edge – no gradient, no texture, no floor, no cast shadow, no other objects. Keep a small margin around the subject.`;
  }
  const parts = [{ text }];
  for (const file of job.refs) {
    const mimeType = MIME[extname(file).toLowerCase()];
    if (!mimeType) fail(`--ref ${file}: only PNG, JPG and WebP`);
    parts.push({ inlineData: { mimeType, data: readFileSync(resolve(ROOT, file)).toString("base64") } });
  }
  const generationConfig = { responseModalities: ["IMAGE"] };
  if (aspect) generationConfig.imageConfig = { aspectRatio: aspect };
  return { contents: [{ parts }], generationConfig };
}

async function call(path, init = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) fail("GEMINI_API_KEY is not set (create a key in Google AI Studio and export it in ~/.zshrc)");
  const res = await fetch(`${API}/${path}`, {
    ...init,
    headers: { "x-goog-api-key": apiKey, "content-type": "application/json" },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) fail(`Gemini ${res.status}: ${json.error?.message ?? res.statusText}`);
  return json;
}

/** The picture in a generateContent answer, or why there is none. */
function pictureIn(answer) {
  const candidate = answer?.candidates?.[0];
  const image = candidate?.content?.parts?.find((p) => p.inlineData)?.inlineData;
  if (image) return { picture: Buffer.from(image.data, "base64") };
  const said = candidate?.content?.parts
    ?.map((p) => p.text)
    .filter(Boolean)
    .join(" ");
  const reason = candidate?.finishReason ?? answer?.promptFeedback?.blockReason ?? "no picture";
  return { error: `Gemini returned no picture (${reason})${said ? `: ${said}` : ""}` };
}

const modelOf = (opts) => opts.model ?? process.env.GEMINI_IMAGE_MODEL ?? DEFAULT_MODEL;

// ---------- Batches ----------

async function submit(jobs, model) {
  const body = {
    batch: {
      display_name: `tinytaps ${basename(jobs[0].outs[0])}${jobs.length > 1 ? ` +${jobs.length - 1}` : ""}`,
      input_config: { requests: { requests: jobs.map((job, i) => ({ request: buildRequest(job), metadata: { key: String(i) } })) } },
    },
  };
  const batch = await call(`models/${model}:batchGenerateContent`, { method: "POST", body: JSON.stringify(body) });
  const record = {
    name: batch.name,
    model,
    sent: new Date().toISOString(),
    checkout: ROOT,
    branch: git("branch", "--show-current"),
    jobs,
  };
  mkdirSync(BATCH_DIR, { recursive: true });
  writeFileSync(recordPath(record), JSON.stringify(record, null, 2));
  const count = jobs.reduce((n, job) => n + job.outs.length, 0);
  console.log(`sent ${batch.name} (${jobs.length} request${jobs.length > 1 ? "s" : ""}, ${count} picture${count > 1 ? "s" : ""}, half price)`);
  return record;
}

const recordPath = (record) => join(BATCH_DIR, `${record.name.replace(/\W+/g, "-")}.json`);

function openRecords() {
  if (!existsSync(BATCH_DIR)) return [];
  return readdirSync(BATCH_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(BATCH_DIR, f), "utf8")));
}

function closeRecord(record, how) {
  const done = join(BATCH_DIR, how);
  mkdirSync(done, { recursive: true });
  renameSync(recordPath(record), join(done, basename(recordPath(record))));
}

const stateOf = (batch) => String(batch.metadata?.state ?? batch.state ?? "unknown");

/** Looks at one batch; saves its pictures once it is done. Returns true when nothing is left to wait for. */
async function check(record) {
  const batch = await call(record.name);
  const state = stateOf(batch);
  if (/PENDING|RUNNING|UNSPECIFIED/.test(state)) return false;
  if (!/SUCCEEDED/.test(state)) {
    console.error(`${record.name}: ${state} – nothing to save, send it again`);
    closeRecord(record, "failed");
    return true;
  }
  const answers = batch.response?.inlinedResponses?.inlinedResponses ?? batch.dest?.inlinedResponses ?? batch.response?.inlinedResponses ?? [];
  // A worktree can be gone by now; then the pictures land in this checkout.
  const root = existsSync(record.checkout) ? record.checkout : ROOT;
  if (root !== record.checkout) console.warn(`${record.checkout} is gone – saving into ${root} instead`);
  let failed = 0;
  for (const [i, answer] of answers.entries()) {
    const job = record.jobs[Number(answer.metadata?.key ?? i)];
    const { picture, error } = answer.error ? { error: answer.error.message } : pictureIn(answer.response);
    if (error) {
      failed++;
      console.error(`${job.outs.join(", ")}: ${error}`);
      continue;
    }
    await finish(job, picture, root);
  }
  closeRecord(record, failed ? "failed" : "done");
  return true;
}

async function waitFor(records) {
  let open = records;
  let rounds = 0;
  while (open.length) {
    const still = [];
    for (const record of open) if (!(await check(record))) still.push(record);
    open = still;
    if (!open.length) break;
    if (rounds++ % 10 === 0) console.log(`waiting for ${open.length} batch${open.length > 1 ? "es" : ""} … (${new Date().toLocaleTimeString()})`);
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
}

async function status() {
  const records = openRecords();
  if (!records.length) return console.log("no batches running");
  for (const record of records) {
    const batch = await call(record.name);
    const pictures = record.jobs.flatMap((job) => job.outs);
    const gone = existsSync(record.checkout) ? "" : " (worktree gone, fetch saves here)";
    console.log(`${record.name}  ${stateOf(batch)}  sent ${record.sent}  ${record.branch}${gone}\n  ${pictures.join("\n  ")}`);
  }
}

// ---------- Saving ----------

async function finish(job, picture, root) {
  mkdirSync(join(root, RAW_DIR), { recursive: true });
  const raw = join(root, RAW_DIR, `${basename(job.outs[0], extname(job.outs[0]))}${job.grid ? `-grid${job.grid}` : ""}.png`);
  await sharp(picture).png().toFile(raw);
  console.log(`raw picture in ${relative(process.cwd(), raw)}`);
  const pieces = job.grid ? await splitGrid(picture, ...parseGrid(job.grid), gapColour(job)) : [picture];
  for (const [i, piece] of pieces.entries()) {
    const out = resolve(root, job.outs[i]);
    await save(job.transparent ? await cutOut(piece, job.key) : piece, { ...job, out });
  }
}

// Cuts a grid picture into its panels. The model never draws the gaps exactly
// where asked, so each cut goes along the line with most gap colour near where
// it should be, and gap colour left at a panel's edges is trimmed away.
async function splitGrid(input, cols, rows, gapHex) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const gap = [0, 2, 4].map((i) => parseInt(gapHex.slice(i, i + 2), 16));
  const isGap = (x, y) => {
    const p = (y * w + x) * 3;
    return Math.hypot(data[p] - gap[0], data[p + 1] - gap[1], data[p + 2] - gap[2]) < 110;
  };
  const columnGap = (x, y0 = 0, y1 = h) => {
    let n = 0;
    for (let y = y0; y < y1; y++) n += isGap(x, y);
    return n / (y1 - y0);
  };
  const rowGap = (y, x0 = 0, x1 = w) => {
    let n = 0;
    for (let x = x0; x < x1; x++) n += isGap(x, y);
    return n / (x1 - x0);
  };
  // The cuts between panels: [end of one, start of the next].
  const cuts = (count, length, gapness) => {
    const result = [[0, 0]];
    for (let i = 1; i < count; i++) {
      const expected = Math.round((length * i) / count);
      const reach = Math.round(length * 0.08);
      let best = expected;
      for (let p = expected - reach; p <= expected + reach; p++) if (gapness(p) > gapness(best)) best = p;
      let [a, b] = [best, best];
      if (gapness(best) > 0.8) {
        while (a > 0 && gapness(a - 1) > 0.8) a--;
        while (b < length - 1 && gapness(b + 1) > 0.8) b++;
      }
      result.push([a, b + 1]);
    }
    result.push([length, length]);
    return result;
  };
  const xs = cuts(cols, w, (x) => columnGap(x));
  const ys = cuts(rows, h, (y) => rowGap(y));

  const pieces = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let [x0, x1, y0, y1] = [xs[c][1], xs[c + 1][0], ys[r][1], ys[r + 1][0]];
      const most = 0.06;
      const [maxX, maxY] = [Math.round((x1 - x0) * most), Math.round((y1 - y0) * most)];
      for (let n = 0; n < maxY && rowGap(y0, x0, x1) > 0.8; n++) y0++;
      for (let n = 0; n < maxY && rowGap(y1 - 1, x0, x1) > 0.8; n++) y1--;
      for (let n = 0; n < maxX && columnGap(x0, y0, y1) > 0.8; n++) x0++;
      for (let n = 0; n < maxX && columnGap(x1 - 1, y0, y1) > 0.8; n++) x1--;
      // The soft edge of a gap still has a tint of its colour: cut a little more where panels meet.
      const [insetX, insetY] = [Math.round((x1 - x0) * 0.012), Math.round((y1 - y0) * 0.012)];
      if (c > 0) x0 += insetX;
      if (c < cols - 1) x1 -= insetX;
      if (r > 0) y0 += insetY;
      if (r < rows - 1) y1 -= insetY;
      pieces.push(
        await sharp(input)
          .extract({ left: x0, top: y0, width: x1 - x0, height: y1 - y0 })
          .png()
          .toBuffer(),
      );
    }
  }
  return pieces;
}

// Removes the flat background: flood fill from the edges over pixels close to
// the key colour, a soft edge in between, and the key colour taken out of the
// edge pixels so no coloured fringe is left.
async function cutOut(input, keyHex) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  let key = [0, 2, 4].map((i) => parseInt(keyHex.slice(i, i + 2), 16));
  const HARD = 70;
  const SOFT = 150;
  const dist = (p) => Math.hypot(data[p * 4] - key[0], data[p * 4 + 1] - key[1], data[p * 4 + 2] - key[2]);

  const edge = [];
  for (let x = 0; x < w; x++) edge.push(x, (h - 1) * w + x);
  for (let y = 1; y < h - 1; y++) edge.push(y * w, y * w + w - 1);

  // The model never paints the exact colour asked for (ff00ff comes back as
  // ff36f8), so key on what the border really is.
  const near = edge.filter((p) => dist(p) < SOFT);
  if (near.length) {
    const median = (c) => near.map((p) => data[p * 4 + c]).sort((a, b) => a - b)[near.length >> 1];
    key = [median(0), median(1), median(2)];
  }
  const onKey = edge.filter((p) => dist(p) < HARD).length / edge.length;
  if (onKey < 0.9) {
    console.warn(`warning: only ${Math.round(onKey * 100)}% of the border is the key colour #${keyHex} – the cut-out may be wrong, better generate again`);
  }

  // Also start inside: holes the subject closes in (a window, between arms)
  // show the backdrop too, and almost exactly the key colour is never the subject.
  const stack = edge;
  for (let p = 0; p < w * h; p++) if (dist(p) < HARD / 2) stack.push(p);
  const seen = new Uint8Array(w * h);
  while (stack.length) {
    const p = stack.pop();
    if (seen[p]) continue;
    seen[p] = 1;
    const d = dist(p);
    if (d >= SOFT) continue;
    if (d >= HARD) {
      const a = (d - HARD) / (SOFT - HARD);
      for (let c = 0; c < 3; c++) {
        const v = (data[p * 4 + c] - (1 - a) * key[c]) / a;
        data[p * 4 + c] = Math.max(0, Math.min(255, Math.round(v)));
      }
      data[p * 4 + 3] = Math.round(a * 255);
      continue;
    }
    data[p * 4 + 3] = 0;
    const x = p % w;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (p >= w) stack.push(p - w);
    if (p < w * (h - 1)) stack.push(p + w);
  }

  // Crop to what is left, with a small margin.
  let [x0, y0, x1, y1] = [w, h, -1, -1];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 8) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
      }
    }
  }
  if (x1 < 0) fail("the cut-out removed everything – is the key colour right?");
  const pad = Math.round(Math.max(x1 - x0, y1 - y0) * 0.02);
  const left = Math.max(0, x0 - pad);
  const top = Math.max(0, y0 - pad);
  return sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left, top, width: Math.min(w, x1 + pad + 1) - left, height: Math.min(h, y1 + pad + 1) - top })
    .png()
    .toBuffer();
}

async function save(input, { out, size, quality, transparent }) {
  let img = sharp(input);
  if (size) {
    // "512" = longest side (never enlarged), "1200x900" = exactly that size
    const [width, height] = size.split("x").map(Number);
    img = height
      ? img.resize({ width, height, fit: transparent ? "contain" : "cover", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      : img.resize({ width, height: width, fit: "inside", withoutEnlargement: true });
  }
  const ext = extname(out).toLowerCase();
  if (ext === ".webp") img = img.webp({ quality, alphaQuality: 90, effort: 6 });
  else if (ext === ".png") img = img.png({ compressionLevel: 9 });
  else if (ext === ".jpg" || ext === ".jpeg") img = img.flatten({ background: "#ffffff" }).jpeg({ quality, mozjpeg: true });
  else fail(`${out}: use .webp, .png or .jpg`);

  mkdirSync(dirname(out), { recursive: true });
  const info = await img.toFile(out);
  console.log(`saved ${relative(process.cwd(), out)} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`);
}

// ---------- Main ----------

const opts = parseArgs(process.argv.slice(2));

if (opts.out === "status") {
  await status();
} else if (opts.out === "fetch") {
  const records = openRecords();
  if (!records.length) console.log("no batches running");
  else if (opts.wait) await waitFor(records);
  else for (const record of records) if (!(await check(record))) console.log(`${record.name}: not ready yet`);
} else if (opts.from) {
  if (!opts.out) fail("usage: bun run image <out.webp> --from <picture.png>");
  const job = toJob({ ...opts, prompt: "-" });
  const picture = readFileSync(opts.from);
  const pieces = job.grid ? await splitGrid(picture, ...parseGrid(job.grid), gapColour(job)) : [picture];
  for (const [i, piece] of pieces.entries()) {
    await save(job.transparent ? await cutOut(piece, job.key) : piece, { ...job, out: resolve(ROOT, job.outs[i]) });
  }
} else {
  const shared = { refs: opts.refs, aspect: opts.aspect, size: opts.size, quality: opts.quality, transparent: opts.transparent, key: opts.key };
  const jobs = opts.jobs ? JSON.parse(readFileSync(opts.jobs, "utf8")).map((o) => toJob({ ...shared, ...checkedJob(o) })) : [toJob(opts)];
  if (opts.now) {
    for (const job of jobs) {
      const answer = await call(`models/${modelOf(opts)}:generateContent`, { method: "POST", body: JSON.stringify(buildRequest(job)) });
      const { picture, error } = pictureIn(answer);
      if (error) fail(error);
      await finish(job, picture, ROOT);
    }
  } else {
    const record = await submit(jobs, modelOf(opts));
    if (opts.wait !== false) await waitFor([record]);
    else console.log("not waiting – `bun run image fetch` saves the pictures once they are ready");
  }
}
