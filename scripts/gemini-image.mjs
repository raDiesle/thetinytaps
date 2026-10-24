// Makes a picture with Gemini and saves it ready for the game (WebP or PNG).
// Guide and examples: .claude/skills/bild-erzeugen/SKILL.md
//
//   yarn image <out.webp> "<prompt>" [--ref a.png ...] [--aspect 4:3] [--size 1200x900]
//              [--transparent] [--key ff00ff] [--quality 80] [--model <id>]
//   yarn image <out.webp> --from <picture.png> [--transparent] [--size ...]
//
// The untouched Gemini picture is kept in .image-raw/ (not committed), so it can
// be processed again with --from or passed as --ref for the next picture.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import sharp from "sharp";

const RAW_DIR = ".image-raw";
const DEFAULT_MODEL = "gemini-nano-banana-2.1";
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

function parseArgs(argv) {
  const opts = { refs: [], key: "ff00ff", quality: 80 };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => {
      if (i + 1 >= argv.length) fail(`${a} needs a value`);
      return argv[++i];
    };
    if (a === "--ref") opts.refs.push(next());
    else if (a === "--from") opts.from = next();
    else if (a === "--aspect") opts.aspect = next();
    else if (a === "--size") opts.size = next();
    else if (a === "--transparent") opts.transparent = true;
    else if (a === "--key") opts.key = next().replace(/^#/, "");
    else if (a === "--quality") opts.quality = Number(next());
    else if (a === "--model") opts.model = next();
    else if (a.startsWith("--")) fail(`unknown option ${a}`);
    else rest.push(a);
  }
  [opts.out, opts.prompt] = rest;
  if (!opts.out || (!opts.prompt && !opts.from)) {
    fail('usage: yarn image <out.webp> "<prompt>" [options]  or  yarn image <out.webp> --from <picture.png>');
  }
  if (!/^[0-9a-f]{6}$/i.test(opts.key)) fail("--key must be a colour like ff00ff");
  return opts;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function generate({ prompt, refs, aspect, transparent, key, model }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) fail("GEMINI_API_KEY is not set (create a key in Google AI Studio and export it in ~/.zshrc)");

  const text = transparent
    ? `${prompt}\n\nPlace the subject on a plain, perfectly flat, solid #${key} background that fills the whole picture edge to edge – no gradient, no texture, no floor, no cast shadow, no other objects. Keep a small margin around the subject.`
    : prompt;
  const parts = [{ text }];
  for (const file of refs) {
    const mimeType = MIME[extname(file).toLowerCase()];
    if (!mimeType) fail(`--ref ${file}: only PNG, JPG and WebP`);
    parts.push({ inlineData: { mimeType, data: readFileSync(file).toString("base64") } });
  }
  const generationConfig = { responseModalities: ["IMAGE"] };
  if (aspect) generationConfig.imageConfig = { aspectRatio: aspect };

  const id = model ?? process.env.GEMINI_IMAGE_MODEL ?? DEFAULT_MODEL;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${id}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ parts }], generationConfig }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) fail(`Gemini ${res.status}: ${json.error?.message ?? res.statusText}`);

  const candidate = json.candidates?.[0];
  const image = candidate?.content?.parts?.find((p) => p.inlineData)?.inlineData;
  if (!image) {
    const said = candidate?.content?.parts?.map((p) => p.text).filter(Boolean).join(" ");
    const reason = candidate?.finishReason ?? json.promptFeedback?.blockReason ?? "no picture";
    fail(`Gemini returned no picture (${reason})${said ? `: ${said}` : ""}`);
  }
  return Buffer.from(image.data, "base64");
}

// Removes the flat background: flood fill from the edges over pixels close to
// the key colour, a soft edge in between, and the key colour taken out of the
// edge pixels so no coloured fringe is left.
async function cutOut(input, keyHex) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const key = [0, 2, 4].map((i) => parseInt(keyHex.slice(i, i + 2), 16));
  const HARD = 70;
  const SOFT = 150;
  const dist = (p) =>
    Math.hypot(data[p * 4] - key[0], data[p * 4 + 1] - key[1], data[p * 4 + 2] - key[2]);

  const edge = [];
  for (let x = 0; x < w; x++) edge.push(x, (h - 1) * w + x);
  for (let y = 1; y < h - 1; y++) edge.push(y * w, y * w + w - 1);
  const onKey = edge.filter((p) => dist(p) < HARD).length / edge.length;
  if (onKey < 0.9) {
    console.warn(`warning: only ${Math.round(onKey * 100)}% of the border is the key colour #${keyHex} – the cut-out may be wrong, better generate again`);
  }

  const seen = new Uint8Array(w * h);
  const stack = edge;
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
  console.log(`saved ${out} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`);
}

const opts = parseArgs(process.argv.slice(2));
let picture;
if (opts.from) {
  picture = readFileSync(opts.from);
} else {
  picture = await generate(opts);
  mkdirSync(RAW_DIR, { recursive: true });
  const raw = join(RAW_DIR, `${basename(opts.out, extname(opts.out))}.png`);
  await sharp(picture).png().toFile(raw);
  console.log(`raw picture in ${raw}`);
}
if (opts.transparent) picture = await cutOut(picture, opts.key);
await save(picture, opts);
