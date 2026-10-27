// Do the pictures of a moving story stay the same scene?
//
//   bun run frames [folder or files …]     the two frames of each moving picture
//   bun run frames --scenes [folder]       every picture of a story against its first one
//   bun run frames --all                   also list the pictures that look fine
//
// Default folder: src/games/feelings/bilder.
//
// A second frame (`x-b.webp`, `x-c.webp`) fades in and out over the first one,
// so only a small movement may differ. When Gemini redraws the scene instead –
// the camera zooms, children stand somewhere else, balloons or a table vanish –
// the cross-fade looks restless and toddlers can't follow it. This compares each
// pair on a coarse grid: "changed" is the part of the picture that differs,
// "edge" the part of the outer border, which is background in almost every
// picture and should hardly change. Big changes in the middle can be the movement
// itself (a lightning flash, a jump); look at the flagged pairs before redrawing.
//
// --scenes does the same from picture to picture of one story: what the bear does
// in the middle changes, the place around it should not. Each picture of a
// kindergarten story is compared with `<story>-passiert`, each picture at home
// with `baer-<feeling>` (its comforts are read from bear.ts). Only "edge" counts
// there; a picture flagged here usually got a new background, a zoom or a new camera.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join } from "node:path";
import sharp from "sharp";

const W = 48;
const H = 36;
/** Brightness difference (0–255) above which a grid cell counts as changed. */
const CELL_LIMIT = 28;
/** Outer cells counted as the edge. */
const BORDER = 5;
/** Above this, a pair of frames is listed as jumping. */
const LIMITS = { changed: 0.2, edge: 0.08 };
/** Above this edge change, a picture is listed as a different scene than its story's first picture. */
const SCENE_EDGE = 0.15;

const args = process.argv.slice(2);
const all = args.includes("--all");
const scenes = args.includes("--scenes");
const paths = args.filter((a) => !a.startsWith("--"));
const folder = paths[0] && statSync(paths[0]).isDirectory() ? paths[0] : "src/games/feelings/bilder";

const grid = async (file) => sharp(file).resize(W, H, { fit: "fill" }).blur(0.6).greyscale().raw().toBuffer();

/** How much of the whole picture and of its border differs between two pictures. */
async function compare(first, second) {
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
  return { changed: changed / a.length, edge: edge / edgeCells };
}

/** Pairs [reference, picture] of every story: kindergarten by name, home by the comforts in bear.ts. */
function scenePairs() {
  const names = readdirSync(folder)
    .filter((f) => f.endsWith(".webp") && !/-[bc]\.webp$/.test(f))
    .map((f) => f.replace(/\.webp$/, ""));
  const pairs = [];
  for (const ref of names.filter((n) => n.endsWith("-passiert"))) {
    const story = ref.replace(/-passiert$/, "");
    for (const n of names) if (n !== ref && n.startsWith(`${story}-`)) pairs.push([ref, n]);
  }
  const bear = readFileSync("src/games/feelings/bear.ts", "utf8");
  const feelings = [...bear.matchAll(/id: "(\w+)",[\s\S]*?comforts: \[([^\]]*)\]/g)].map(([, id, list]) => ({
    id,
    comforts: [...list.matchAll(/"(\w+)"/g)].map((m) => m[1]),
  }));
  const used = feelings.flatMap((f) => f.comforts);
  for (const { id, comforts } of feelings) {
    const ref = `baer-${id}`;
    // A comfort shown for more than one feeling can't match every room; it is left out.
    const own = comforts.filter((c) => used.indexOf(c) === used.lastIndexOf(c)).map((c) => `trost-${c}`);
    for (const n of [`${ref}-nein`, `${ref}-gut`, ...own]) if (names.includes(n)) pairs.push([ref, n]);
  }
  return pairs.map(([ref, n]) => [join(folder, `${ref}.webp`), join(folder, `${n}.webp`)]);
}

function framePairs() {
  const seconds = (paths.length ? paths : [folder]).flatMap((p) =>
    statSync(p).isDirectory()
      ? readdirSync(p)
          .filter((f) => /-[bc]\.webp$/.test(f))
          .map((f) => join(p, f))
      : [p],
  );
  return seconds.map((second) => [second.replace(/-[bc]\.webp$/, ".webp"), second]).filter(([first]) => existsSync(first));
}

const rows = [];
for (const [first, second] of scenes ? scenePairs() : framePairs()) {
  const r = await compare(first, second);
  const bad = scenes ? r.edge > SCENE_EDGE : r.changed > LIMITS.changed || r.edge > LIMITS.edge;
  rows.push({ first, second, bad, ...r });
}

rows.sort((x, y) => y.edge + y.changed - (x.edge + x.changed));
const pct = (n) => `${(n * 100).toFixed(0).padStart(3)} %`;
console.log("changed    edge");
for (const r of rows) {
  const label = scenes ? `${basename(r.second)}  (against ${basename(r.first)})` : r.second;
  if (r.bad || all) console.log(`${pct(r.changed)}   ${pct(r.edge)}   ${r.bad ? (scenes ? "new scene?" : "jumps?") : "      "} ${label}`);
}
const flagged = rows.filter((r) => r.bad).length;
const what = scenes ? "pictures may show another scene than their story's first picture" : "pairs may jump";
console.log(`${flagged} of ${rows.length} ${what}${all ? "" : " (--all lists every one)"}`);
