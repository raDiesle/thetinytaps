// Makes pictures with Gemini and saves them ready for the game (WebP or PNG).
// Guide and examples: .claude/skills/bild-erzeugen/SKILL.md
//
//   bun run image <out.webp> "<prompt>" [--ref a.png ...] [--aspect 4:3] [--size 1200x900]
//              [--transparent] [--key ff00ff] [--quality 80] [--model <id>]
//   bun run image a.webp,b.webp "<prompt>" --grid 1x2 --panel "<a>" --panel "<b>" [options]
//   … --grid 2x2 --transparent --frames      frames of one animation: each keeps its whole cell, so they line up
//   bun run image --jobs jobs.json            many pictures in one batch
//   bun run image <out.webp> --from <picture.png> [--transparent] [--size ...]
//   bun run image status                      batches still running, in all checkouts
//   bun run image fetch [--wait]              saves what is ready (and waits for the rest)
//   bun run image queue [--make] [--force <id,…|all>]
//                                             what of src/content/pictureQueue.ts is cheap now, and makes it
//
// By default the pictures go through the Batch API: half the price, but they can
// take minutes to hours. The script waits and saves them when they are ready;
// --no-wait only sends them, --now asks right away at the full price. Running
// batches are noted in the shared .git folder, so `bun run image fetch` gets them
// from any checkout, even after the worktree that sent them is gone.
//
// --grid asks for several pictures in one (half or a quarter of the price each)
// with magenta gaps and cuts it apart; each panel gets its own --panel description.
// `queue` uses that for the pictures waiting in src/content/pictureQueue.ts: full
// sheets and pictures too big for one are made, sheets short of pictures wait
// (src/content/pictureQueuePlan.ts) unless --force names them.
//
// The untouched Gemini picture is kept in .image-raw/ (not committed), so it can
// be processed again with --from or passed as --ref for the next picture.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { plugin } from "bun";
import sharp from "sharp";
import { appPlugin } from "../tools/appPlugin.ts";

// The queue gathers prompts kept by the games (the Belohnungstafel's, the Gefühle days'), whose data imports like the
// app's (`…?glob`): the app's plugin comes first, then the queue – a static import would load it before the plugin
// (`bun run image queue` failed on „Cannot find module './bilder/*.webp?glob'“, November 2026).
plugin(appPlugin());
const { PICTURE_QUEUE } = await import("../src/content/pictureQueue.ts");
const { jobOf, planQueue, REQUEST_PRICE } = await import("../src/content/pictureQueuePlan.ts");

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
    else if (a === "--frames") opts.frames = true;
    else if (a === "--key") opts.key = next().replace(/^#/, "");
    else if (a === "--quality") opts.quality = Number(next());
    else if (a === "--model") opts.model = next();
    else if (a === "--now") opts.now = true;
    else if (a === "--no-wait") opts.wait = false;
    else if (a === "--wait") opts.wait = true;
    else if (a === "--make") opts.make = true;
    else if (a === "--force") opts.force = next();
    else if (a.startsWith("--")) fail(`unknown option ${a}`);
    else rest.push(a);
  }
  [opts.out, opts.prompt] = rest;
  return opts;
}

/** One request: one picture, or one grid cut into several. Paths relative to the checkout. */
/** The fields a job in --jobs may have; anything else is a typo that would be ignored silently. */
const JOB_FIELDS = new Set(["out", "prompt", "ref", "refs", "panels", "aspect", "grid", "size", "quality", "transparent", "key", "frames"]);

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
    frames: Boolean(o.frames),
  };
  if (job.frames && !(job.grid && job.transparent)) fail("--frames is for the cut-out frames of one sheet: it needs --grid and --transparent");
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
    // Cut-outs share one flat backdrop, which is their gap too: told to give each panel its own background as scenes
    // do, Gemini painted coloured panels and white frame lines round the things, and let them run into the cell's edge
    // (most partners of „Was gehört zusammen?“, November 2026).
    text += job.transparent
      ? `\n\nDraw this as ONE image: ${job.panels.length} separate things side by side in a grid of ${cols} column(s) and ${rows} row(s), all on ONE continuous, flat, solid #${job.key} background. No panels, no boxes, no frames, no lines, no coloured or white areas behind a thing – only the one flat background between and around them. Each thing stands alone in the middle of its cell, whole, and small enough to leave a wide empty margin of background (a fifth of the cell) on every side; nothing touches or crosses into another cell. No numbers, no labels.`
      : `\n\nDraw this as ONE image made of ${job.panels.length} separate pictures in a grid of ${cols} column(s) and ${rows} row(s). All panels are exactly the same size${job.aspect ? ` (each ${job.aspect})` : ""} and separated by straight, solid #${gapColour(job)} gaps; no borders, no numbers, no labels. Every panel is a complete picture with its own background filling the panel edge to edge: no white margin, no frame line, no rounded corners inside a panel.`;
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

// ---------- The queue ----------

const dollars = (requests) => `$${(requests * REQUEST_PRICE.batch).toFixed(3)}`;

/** Prints what of the queue is cheap now, what waits for partners and what waits for its reference. */
function printPlan(plan) {
  if (!PICTURE_QUEUE.length) return console.log("the queue is empty (src/content/pictureQueue.ts)");
  const ids = (pictures) => pictures.map((p) => p.id).join(", ");
  console.log(`cheap now – ${plan.now.length} request${plan.now.length === 1 ? "" : "s"}, ${dollars(plan.now.length)}:`);
  if (!plan.now.length) console.log("  nothing");
  for (const sheet of plan.now) {
    const how = sheet.grid ? `sheet ${sheet.grid}${sheet.variants ? ` (+${sheet.variants} variant${sheet.variants > 1 ? "s" : ""})` : ""}` : "alone";
    console.log(`  ${how}${sheet.forced ? ", forced" : ""}: ${ids(sheet.pictures)}`);
  }
  if (plan.waiting.length) {
    console.log("waiting for partners – making them now anyway costs one request more each:");
    for (const w of plan.waiting) console.log(`  sheet ${w.grid}, ${w.missing} missing (+${dollars(1)} now): ${ids(w.pictures)}`);
  }
  if (plan.blocked.length) {
    console.log("waiting for their reference to be made first:");
    for (const { picture, ref } of plan.blocked) console.log(`  ${picture.id} – after ${ref}`);
  }
}

/** Sends the jobs as one batch (or at once with --now) and saves the pictures. */
async function make(jobs) {
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

// ---------- Saving ----------

async function finish(job, picture, root) {
  mkdirSync(join(root, RAW_DIR), { recursive: true });
  const raw = join(root, RAW_DIR, `${basename(job.outs[0], extname(job.outs[0]))}${job.grid ? `-grid${job.grid}` : ""}.png`);
  await sharp(picture).png().toFile(raw);
  console.log(`raw picture in ${relative(process.cwd(), raw)}`);
  const pieces = await cutPieces(job, picture);
  for (const [i, piece] of pieces.entries()) await save(piece, { ...job, out: resolve(root, job.outs[i]) });
}

/**
 * The pictures in what Gemini sent, cut out when asked: the whole, the panels of a grid, or a sheet of frames cut into
 * equal cells and cropped all by one box round what any of them shows, so they still line up.
 */
async function cutPieces(job, picture) {
  if (!job.grid) return [job.transparent ? await cutOut(picture, job.key) : picture];
  if (!job.frames) {
    const pieces = await splitGrid(picture, ...parseGrid(job.grid), gapColour(job), job.transparent);
    return job.transparent ? Promise.all(pieces.map((piece) => cutOut(piece, job.key))) : pieces;
  }
  const frames = await Promise.all((await splitCells(picture, ...parseGrid(job.grid))).map((cell) => cutOut(cell, job.key, false)));
  const boxes = await Promise.all(frames.map(async (f) => (await sharp(f).trim({ threshold: 0 }).toBuffer({ resolveWithObject: true })).info));
  const { width, height } = await sharp(frames[0]).metadata();
  const left = Math.min(...boxes.map((b) => -b.trimOffsetLeft));
  const top = Math.min(...boxes.map((b) => -b.trimOffsetTop));
  const right = Math.max(...boxes.map((b) => -b.trimOffsetLeft + b.width));
  const bottom = Math.max(...boxes.map((b) => -b.trimOffsetTop + b.height));
  const pad = Math.round(Math.max(right - left, bottom - top) * 0.02);
  const box = { left: Math.max(0, left - pad), top: Math.max(0, top - pad) };
  Object.assign(box, { width: Math.min(width, right + pad) - box.left, height: Math.min(height, bottom + pad) - box.top });
  return Promise.all(frames.map((f) => sharp(f).extract(box).png().toBuffer()));
}

// The frames of one animation drawn on one sheet (a child standing, hopping, clapping) are cut into equal cells and
// keep them whole (`--frames`): Gemini places the body at the same spot in each cell, so stacked they line up. Cropped
// to its outline each, a frame with raised arms came out a different size and shifted (Mitmachen, November 2026).
async function splitCells(input, cols, rows) {
  const { width, height } = await sharp(input).metadata();
  const [w, h] = [Math.floor(width / cols), Math.floor(height / rows)];
  const pieces = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      pieces.push(
        await sharp(input)
          .extract({ left: c * w, top: r * h, width: w, height: h })
          .png()
          .toBuffer(),
      );
    }
  }
  return pieces;
}

// Cuts a grid picture into its panels. The model never draws the gaps exactly
// where asked, so each cut goes along the line with most gap colour near where
// it should be, and gap colour left at a panel's edges is trimmed away.
async function splitGrid(input, cols, rows, gapHex, cutOutLater = false) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const gap = [0, 2, 4].map((i) => parseInt(gapHex.slice(i, i + 2), 16));
  // The gap sometimes comes back far darker than asked (a plum 150, 45, 105 round two pairs' frames, November 2026, left
  // as bands): where the sheet has a plain border of a magenta-ish colour, that colour is gap too.
  const border = [];
  for (let x = 0; x < w; x += 4) border.push((2 * w + x) * 3, ((h - 3) * w + x) * 3);
  const median = (c) => border.map((p) => data[p + c]).sort((a, b) => a - b)[border.length >> 1];
  const seen = [median(0), median(1), median(2)];
  const plain = border.filter((p) => Math.hypot(data[p] - seen[0], data[p + 1] - seen[1], data[p + 2] - seen[2]) < 40).length / border.length;
  const tinted = (c) => [0, 1, 2].every((i) => (gap[i] > 128 ? c[i] - Math.min(...c) > 40 : c[i] <= Math.min(...c) + 10));
  const second = plain > 0.8 && tinted(seen) ? seen : null;
  const isGap = (x, y) => {
    const p = (y * w + x) * 3;
    // Wide enough for the darker magenta the book's softened colours bring (198, 24, 147 left a band of gap on two
    // pictures, November 2026); a cut still needs most of a whole row or column in it.
    if (Math.hypot(data[p] - gap[0], data[p + 1] - gap[1], data[p + 2] - gap[2]) < 150) return true;
    return !!second && Math.hypot(data[p] - second[0], data[p + 1] - second[1], data[p + 2] - second[2]) < 50;
  };
  // A pixel tinted by the gap colour: its strongest channels rise above its weakest as the gap's do (magenta: red and
  // blue well above green), even where it is blended with the picture's paper.
  const highs = [0, 1, 2].filter((i) => gap[i] > 128);
  const lows = [0, 1, 2].filter((i) => gap[i] <= 128);
  const isTint = (x, y) => {
    const p = (y * w + x) * 3;
    const top = Math.max(...lows.map((i) => data[p + i]));
    // Blended with the paper the plum gap is a dusty pink, far from magenta's tint but near the plum itself.
    if (second && Math.hypot(data[p] - second[0], data[p + 1] - second[1], data[p + 2] - second[2]) < 90 && data[p] - data[p + 1] > 30) return true;
    return highs.length > 0 && lows.length > 0 && highs.every((i) => data[p + i] > 110 && data[p + i] - top > 45);
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
      const [lo, hi] = [expected - reach, expected + reach];
      let a;
      let b;
      let line = expected;
      for (let p = lo; p <= hi; p++) if (gapness(p) < gapness(line)) line = p;
      if (gapness(lo) > 0.8 && gapness(hi) > 0.8 && gapness(line) < 0.2) {
        // The panels' own background is the gap colour and the gap another one, a clean line of it across the sheet
        // (white gaps between magenta panels, November 2026 – a cut spreading over all that magenta took whole panels
        // away): the gap is that line. A cut-out sheet on one flat backdrop has no such line, and is cut in its middle.
        [a, b] = [line, line];
        while (a > lo && gapness(a - 1) < 0.5) a--;
        while (b < hi && gapness(b + 1) < 0.5) b++;
      } else {
        let best = expected;
        for (let p = lo; p <= hi; p++) if (gapness(p) > gapness(best)) best = p;
        [a, b] = [best, best];
        // Spread only over lines nearly as clean as the cleanest: on one flat backdrop a wide thing (a bus) fills
        // only a fifth of its columns, which still counted as gap at 80 % and cut its front off (November 2026).
        const clean = Math.max(0.8, gapness(best) - 0.03);
        if (gapness(best) > 0.8) {
          while (a > lo && gapness(a - 1) > clean) a--;
          while (b < hi && gapness(b + 1) > clean) b++;
        }
        // A sheet cut out afterwards is cut in the backdrop's middle: the cut-out takes the backdrop away, and cutting
        // at the gap's edges took the tip of what reached into it (a wheelchair's footrest, November 2026).
        if (cutOutLater) [a, b] = [(a + b) >> 1, ((a + b) >> 1) - 1];
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
      // Rows and columns wholly of gap colour are trimmed: a border round the whole sheet was 50 px on top, more than
      // the 6 % once allowed, and stayed in the scene (November 2026). Only a panel cut out later keeps the cap, since
      // its own background is the gap colour and the cut-out takes it away.
      const most = cutOutLater ? 0.06 : 0.3;
      const [maxX, maxY] = [Math.round((x1 - x0) * most), Math.round((y1 - y0) * most)];
      for (let n = 0; n < maxY && rowGap(y0, x0, x1) > 0.8; n++) y0++;
      for (let n = 0; n < maxY && rowGap(y1 - 1, x0, x1) > 0.8; n++) y1--;
      for (let n = 0; n < maxX && columnGap(x0, y0, y1) > 0.8; n++) x0++;
      for (let n = 0; n < maxX && columnGap(x1 - 1, y0, y1) > 0.8; n++) x1--;
      // A seam of gap colour only partly across a row or column, on any side (also the sheet's outer edge), is
      // trimmed too: lines covering 16–54 % of a row stayed on four of 15 Gefühle cards (November 2026). Pictures keep
      // magenta out of themselves, so a few pixels of it at the very edge are always seam.
      // The seam is gap colour blended into the picture (a soft pink), so it is told by its tint, not its distance.
      const [seamX, seamY] = [Math.round((x1 - x0) * 0.025), Math.round((y1 - y0) * 0.025)];
      const tintRow = (y) => {
        let n = 0;
        for (let x = x0; x < x1; x++) n += isTint(x, y);
        return n / (x1 - x0);
      };
      const tintColumn = (x) => {
        let n = 0;
        for (let y = y0; y < y1; y++) n += isTint(x, y);
        return n / (y1 - y0);
      };
      // Two lines clean in a row end the seam: a single clean line can lie inside a soft one.
      const trim = (from, step, limit, tint) => {
        let at = from;
        for (let n = 0; n < limit && (tint(at) > 0.03 || tint(at + step) > 0.03); n++) at += step;
        return at;
      };
      // A sheet cut out afterwards keeps its edges: the cut-out takes the seam away with the backdrop.
      if (!cutOutLater) {
        y0 = trim(y0, 1, seamY, tintRow);
        y1 = trim(y1 - 1, -1, seamY, tintRow) + 1;
        x0 = trim(x0, 1, seamX, tintColumn);
        x1 = trim(x1 - 1, -1, seamX, tintColumn) + 1;
        // The soft edge of a gap still has a tint of its colour: cut a little more where panels meet.
        const [insetX, insetY] = [Math.round((x1 - x0) * 0.012), Math.round((y1 - y0) * 0.012)];
        if (c > 0) x0 += insetX;
        if (c < cols - 1) x1 -= insetX;
        if (r > 0) y0 += insetY;
        if (r < rows - 1) y1 -= insetY;
        // The outermost line still blends with the border round the sheet: a faint pink row stayed on every frame of
        // 140 pairs (review, November 2026).
        [x0, x1, y0, y1] = [x0 + 2, x1 - 2, y0 + 2, y1 - 2];
      }
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
async function cutOut(input, keyHex, crop = true) {
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
  if (!crop)
    return sharp(data, { raw: { width: w, height: h, channels: 4 } })
      .png()
      .toBuffer();
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
  // Saved into this checkout or the one that sent the batch: the path ends in the queued file's.
  const queued = PICTURE_QUEUE.find((p) => out.endsWith(`/${p.file}`));
  if (queued) console.log(`  made: take "${queued.id}" out of src/content/pictureQueue.ts`);
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
  const pieces = await cutPieces(job, picture);
  for (const [i, piece] of pieces.entries()) await save(piece, { ...job, out: resolve(ROOT, job.outs[i]) });
} else if (opts.out === "queue") {
  // A picture whose file exists is made, only not yet taken out: making it again cost a second request and replaced a
  // good picture by a worse one, and its twin waited for it as if it were still missing.
  const made = PICTURE_QUEUE.filter((p) => existsSync(resolve(ROOT, p.file)));
  for (const p of made) console.log(`made already – take "${p.id}" out of src/content/pictureQueue.ts`);
  const plan = planQueue(
    PICTURE_QUEUE.filter((p) => !made.includes(p)),
    opts.force === "all" ? "all" : (opts.force?.split(",") ?? []),
  );
  const unknown = opts.force && opts.force !== "all" ? opts.force.split(",").filter((id) => !PICTURE_QUEUE.some((p) => p.id === id)) : [];
  if (unknown.length) fail(`not in the queue: ${unknown.join(", ")}`);
  printPlan(plan);
  if (opts.make) {
    if (!plan.now.length) fail("nothing is cheap to make now – --force <id> makes a waiting picture anyway");
    await make(plan.now.map((sheet) => toJob(checkedJob(jobOf(sheet)))));
  }
} else {
  const shared = { refs: opts.refs, aspect: opts.aspect, size: opts.size, quality: opts.quality, transparent: opts.transparent, key: opts.key };
  await make(opts.jobs ? JSON.parse(readFileSync(opts.jobs, "utf8")).map((o) => toJob({ ...shared, ...checkedJob(o) })) : [toJob(opts)]);
}
