// Do the two frames of a moving picture stay the same scene?
//
//   yarn frames [folder or files …]     default: src/games/feelings/bilder
//   yarn frames --all                   also list the pairs that look fine
//
// A second frame (`x-b.webp`, `x-c.webp`) fades in and out over the first one,
// so only a small movement may differ. When Gemini redraws the scene instead –
// the camera zooms, children stand somewhere else, balloons or a table vanish –
// the cross-fade looks restless and toddlers can't follow it. This compares each
// pair on a coarse grid: "changed" is the part of the picture that differs,
// "edge" the part of the outer border, which is background in almost every
// picture and should hardly change. Big changes in the middle can be the movement
// itself (a lightning flash, a jump); look at the flagged pairs before redrawing.
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const W = 48;
const H = 36;
/** Brightness difference (0–255) above which a grid cell counts as changed. */
const CELL_LIMIT = 28;
/** Outer cells counted as the edge. */
const BORDER = 5;
/** Above this, a pair is listed as jumping. */
const LIMITS = { changed: 0.2, edge: 0.08 };

const args = process.argv.slice(2);
const all = args.includes("--all");
const paths = args.filter((a) => !a.startsWith("--"));
const seconds = (paths.length ? paths : ["src/games/feelings/bilder"]).flatMap((p) =>
  statSync(p).isDirectory()
    ? readdirSync(p)
        .filter((f) => /-[bc]\.webp$/.test(f))
        .map((f) => join(p, f))
    : [p],
);

const grid = async (file) => sharp(file).resize(W, H, { fit: "fill" }).blur(0.6).greyscale().raw().toBuffer();

const rows = [];
for (const second of seconds) {
  const first = second.replace(/-[bc]\.webp$/, ".webp");
  if (!existsSync(first)) continue;
  const [a, b] = await Promise.all([grid(first), grid(second)]);
  let changed = 0;
  let edge = 0;
  let edgeCells = 0;
  for (let i = 0; i < a.length; i++) {
    const x = i % W;
    const y = Math.floor(i / W);
    const outer = x < BORDER || y < BORDER || x >= W - BORDER || y >= H - BORDER;
    const diff = Math.abs(a[i] - b[i]) > CELL_LIMIT;
    if (diff) changed++;
    if (outer) {
      edgeCells++;
      if (diff) edge++;
    }
  }
  rows.push({ second, changed: changed / a.length, edge: edge / edgeCells });
}

rows.sort((x, y) => y.edge + y.changed - (x.edge + x.changed));
const pct = (n) => `${(n * 100).toFixed(0).padStart(3)} %`;
let jumping = 0;
console.log("changed    edge");
for (const r of rows) {
  const bad = r.changed > LIMITS.changed || r.edge > LIMITS.edge;
  if (bad) jumping++;
  if (bad || all) console.log(`${pct(r.changed)}   ${pct(r.edge)}   ${bad ? "jumps?" : "      "} ${r.second}`);
}
console.log(`${jumping} of ${rows.length} pairs may jump${all ? "" : " (--all lists every pair)"}`);
