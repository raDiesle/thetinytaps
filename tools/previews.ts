import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { type Cdp, evaluate, launchChrome, open, siteUrl, sleep } from "./chrome";

// `bun run previews`: the framed pictures on the menus' cards and lines (user request, November 2026: pictures from the
// games instead of emojis). It opens each card in headless Chrome as a child would, waits until the game stands, and
// keeps a landscape cut of the picture (4:3) as a small webp in the game's `vorschau/` folder – a still image the menus show at
// no cost, where the game's own svg in every card would make a phone draw them all.
//
//   bun run previews                   build, then picture every card of every menu below
//   bun run previews marbles           only the menus whose folder or address contains "marbles"
//   bun run previews --url http://…    picture a server that already runs (the dev server shows its DevTag: avoid it)
//   bun run previews --no-build        picture the out/ that is there
//   bun run previews --shots <dir>     also keep each whole window there, to see why a cut lies where it does
//
// Look at every new picture before committing it: a card whose game starts with a dark screen, a loading slip or a
// story's first words gets a cut of its own in CUTS, or a later moment in WAIT.

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const option = (name: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const filters = args.filter((a, i) => !a.startsWith("--") && !["--url", "--shots"].includes(args[i - 1]));
/** Where to keep each whole window pictured too, to see why a cut lies where it does. */
const shots = option("shots");

/** The window the games are pictured in: a tablet, where every game shows its whole picture. */
const SCREEN = { width: 1024, height: 768, scale: 2 };
/**
 * The pictures' shape and size in pixels: landscape like the games themselves, so a frame shows more of a game than a
 * circle did; about twice the biggest frame on a card (about 180 CSS pixels wide), sharp on most screens.
 */
const ASPECT = 4 / 3;
const WIDTH = 360;
const HEIGHT = Math.round(WIDTH / ASPECT);

/** A menu whose cards get pictures: its address and the folder they go to, `<card's data-mode>.webp`. */
interface Menu {
  path: string;
  dir: string;
  /** How many choices the menu's level row has that show other cards (Gefühle: days, feelings): each is pictured. */
  levels?: number;
  /**
   * Run in the page before each picture, where a game's start shows too little of it: brings more into sight and
   * returns the part of the window to look in (CSS pixels), whose busiest cut becomes the picture.
   */
  prepare?: string;
}

/**
 * Kettenreaktion's worlds are much bigger than the screen, and the camera starts in a corner of sky: this shows the
 * whole world (`.marble-camera`, moved only by its transform) in the window and returns where it lies, so the picture
 * is the busiest cut of it – where the machines stand.
 */
const WHOLE_WORLD = `(() => {
  // Its size before the camera's transform, as cameraLayer sets it (an svg has no offsetWidth).
  const size = (e) => [parseFloat(e.style.width) || 0, parseFloat(e.style.height) || 0];
  const world = [...document.querySelectorAll(".marble-camera")].sort((a, b) => size(b)[0] * size(b)[1] - size(a)[0] * size(a)[1])[0];
  if (!world) return null;
  const style = document.createElement("style");
  style.textContent = ".marble-camera { transform: var(--preview-fit) !important; }";
  document.head.append(style);
  const box = world.parentElement.getBoundingClientRect();
  const [w, h] = size(world);
  const s = Math.min(1, box.width / w, box.height / h);
  const x = (box.width - w * s) / 2;
  const y = (box.height - h * s) / 2;
  world.style.setProperty("--preview-fit", \`translate(\${x}px, \${y}px) scale(\${s})\`);
  return { x: box.left + x, y: box.top + y, width: w * s, height: h * s };
})()`;

/** Every menu with mode cards (`GameShell previews`, `GameCard picture`). A new one goes here and imports its folder. */
const MENUS: Menu[] = [
  { path: "/bilder/", dir: "src/games/scenes/vorschau" },
  { path: "/kettenreaktion/", dir: "src/games/marbles/vorschau", prepare: WHOLE_WORLD },
  { path: "/kleine-abenteuer/", dir: "src/games/elevator/vorschau" },
  { path: "/abenteuer/", dir: "src/games/adventure/vorschau" },
  { path: "/gefuehle/", dir: "src/games/feelings/vorschau", levels: 2 },
  { path: "/wie-gehts-dir/", dir: "src/games/feelings/vorschau" },
];

/** The books whose table of contents gets pictures (`BookContents`), in `src/components/vorschau/<book id>.webp`. */
const BOOKS = ["lebendige-welten", "gefuehle", "zuordnen", "buchstaben-zahlen"];
const BOOK_DIR = "src/components/vorschau";

/** What CUTS and WAITS know a picture by: its game's folder and its id, „marbles/topple“ (a book's line: „components/…“). */
const keyOf = (file: string) => file.split("/").filter((part) => part !== "vorschau").slice(-2).join("/").replace(/\.webp$/, "");

/**
 * Where the cut lies, by `keyOf`: its middle as a share of the window's width and height, and its height as a share of
 * the window's height. By default it is the busiest cut of the window (or of what the menu's `prepare` returns); one given
 * here also skips `prepare`.
 */
const CUTS: Record<string, { x: number; y: number; size: number }> = {
  // The number and the bear hopping it stand far apart.
  "components/mitmachen": { x: 0.5, y: 0.55, size: 0.85 },
};

/**
 * Keys pressed before the picture, by `keyOf`: the keyboard games wait for a key on an empty page („Drück eine
 * Taste!“), and only then show what they are about.
 */
const KEYS: Record<string, string> = {
  "components/buchstaben": "a",
  "components/zaehlen": "4",
  "components/mitmachen": "3",
};

/** How long a game takes to stand after its card was tapped, in ms (the page's turn and the game's first moves). */
const WAIT = 4500;
const WAITS: Record<string, number> = {
  // The camera comes down from the sky first.
  "marbles/water": 8000,
};

/**
 * Hides what lies over every game and is no part of its picture: the corner, the notes, a scene's key letters, count
 * and „Drück eine Taste!“, the story's ⏮ ⏸ ⏭, the marble run's space key, the trail's backpack, Gefühle's
 * sentences under the picture, and the pointing hand (any element whose text is only a 👆, 👇, 👈 or 👉), which would
 * stand in every picture.
 */
const HIDE_OVERLAYS = `(() => {
  const style = document.createElement("style");
  style.textContent = ".exit-corner, .play-options-corner, .play-fullscreen, .play-fullscreen-corner, .dev-tag, .sound-wait, .scene-prompt, .scene-keys, .scene-goal, .scene-keys-toggle, .adventure-controls, .run-space, .fg-words-text, .fg-day-text, .fg-caption { visibility: hidden !important; }";
  document.head.append(style);
  // Kleine Abenteuer's backpack and its button lie in an svg of their own over the trail.
  const hud = document.querySelector(".tl-bag")?.closest("svg");
  if (hud) hud.style.visibility = "hidden";
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (/^[👆👇👈👉]$/u.test(node.textContent.trim())) node.parentElement.style.visibility = "hidden";
  }
})()`;

/** A part of the window, in CSS pixels. */
interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A picture's cut, `ASPECT` wide: its left, top, width and height in pixels. */
interface Cut {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** How tall a cut may be, as a share of the window's height: smaller, a game's thing is cut off; bigger, its details vanish. */
const SMALLEST = 0.4;
const BIGGEST = 0.75;

/**
 * Where to cut `png`: around what it shows where that fits a cut (a letter and its animal on an empty page), else
 * the cut with the most detail (the sum of its brightness steps from pixel to pixel) – plain sky, wall and paper
 * have none, machines, animals and things a lot.
 */
async function bestCut(png: Buffer): Promise<Cut> {
  const { width = 1, height = 1 } = await sharp(png).metadata();
  const f = Math.min(1, 200 / Math.max(width, height));
  // Small and a little blurred, the paper's grain counts as no detail.
  const { data, info } = await sharp(png)
    .greyscale()
    .resize(Math.max(1, Math.round(width * f)), Math.max(1, Math.round(height * f)))
    .blur(0.8)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const [w, h] = [info.width, info.height];
  // A summed table of the steps, so each cut's detail is four lookups; and the box round every clear step.
  const sum = new Float64Array((w + 1) * (h + 1));
  const box = { x0: w, y0: h, x1: 0, y1: 0 };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = data[y * w + x];
      const step = (x + 1 < w ? Math.abs(data[y * w + x + 1] - p) : 0) + (y + 1 < h ? Math.abs(data[(y + 1) * w + x] - p) : 0);
      sum[(y + 1) * (w + 1) + x + 1] = step + sum[y * (w + 1) + x + 1] + sum[(y + 1) * (w + 1) + x] - sum[y * (w + 1) + x];
      if (step > 20) Object.assign(box, { x0: Math.min(box.x0, x), y0: Math.min(box.y0, y), x1: Math.max(box.x1, x), y1: Math.max(box.y1, y) });
    }
  }
  // The cut's height in the small picture (its width ASPECT times it), never wider or taller than the picture.
  const tallest = Math.min(h, w / ASPECT);
  const content = Math.max(box.y1 - box.y0, (box.x1 - box.x0) / ASPECT) * 1.12;
  const ch = Math.round(Math.min(BIGGEST * h, tallest, Math.max(SMALLEST * h, content)));
  const cw = Math.min(w, Math.round(ch * ASPECT));
  let best = { x: 0, y: 0 };
  if (content <= ch) {
    best = { x: Math.round((box.x0 + box.x1 - cw) / 2), y: Math.round((box.y0 + box.y1 - ch) / 2) };
  } else {
    let most = -1;
    for (let y = 0; y + ch <= h; y++) {
      for (let x = 0; x + cw <= w; x++) {
        const detail = sum[(y + ch) * (w + 1) + x + cw] - sum[y * (w + 1) + x + cw] - sum[(y + ch) * (w + 1) + x] + sum[y * (w + 1) + x];
        if (detail > most) [best, most] = [{ x, y }, detail];
      }
    }
  }
  // Back at full size, kept inside the picture (a rounded pixel, or content near an edge).
  const cutHeight = Math.min(height, Math.round(ch / f));
  const cutWidth = Math.min(width, Math.round(cutHeight * ASPECT));
  return {
    width: cutWidth,
    height: cutHeight,
    left: Math.max(0, Math.min(Math.round(best.x / f), width - cutWidth)),
    top: Math.max(0, Math.min(Math.round(best.y / f), height - cutHeight)),
  };
}

/** Presses `key` (a letter or digit) as a child on a keyboard would. */
async function press(cdp: Cdp, key: string) {
  const code = /\d/.test(key) ? `Digit${key}` : `Key${key.toUpperCase()}`;
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key, code, text: key });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key, code });
}

/** Pictures what the window shows now into `file`: the cut CUTS says, or the busiest cut of `area` (by default the window). */
async function picture(cdp: Cdp, file: string, area?: Area | null) {
  const key = keyOf(file);
  if (KEYS[key]) {
    await press(cdp, KEYS[key]);
    await sleep(2000);
  }
  await evaluate(cdp, HIDE_OVERLAYS);
  await sleep(150);
  mkdirSync(file.slice(0, file.lastIndexOf("/")), { recursive: true });
  const cut = CUTS[key];
  if (!cut) {
    area ??= { x: 0, y: 0, width: SCREEN.width, height: SCREEN.height };
    const shot = await cdp.send<{ data: string }>("Page.captureScreenshot", { format: "png", clip: { ...area, scale: 1 } });
    const png = Buffer.from(shot.data, "base64");
    if (shots) await Bun.write(join(shots, `${key.replace("/", "-")}.png`), png);
    await sharp(png).extract(await bestCut(png)).resize(WIDTH, HEIGHT).webp({ quality: 72 }).toFile(file);
  } else {
    const height = cut.size * SCREEN.height;
    const width = Math.min(SCREEN.width, height * ASPECT);
    const clip = { x: Math.max(0, cut.x * SCREEN.width - width / 2), y: cut.y * SCREEN.height - height / 2, width, height, scale: 1 };
    const shot = await cdp.send<{ data: string }>("Page.captureScreenshot", { format: "png", clip });
    await sharp(Buffer.from(shot.data, "base64")).resize(WIDTH, HEIGHT).webp({ quality: 72 }).toFile(file);
  }
  console.log(`  ${file}`);
}

/** The ids of the cards the menu shows now (`data-mode`), in their order. */
const cardIds = (cdp: Cdp) => evaluate<string[]>(cdp, `[...document.querySelectorAll("[data-mode]:not([aria-disabled])")].map((e) => e.dataset.mode)`);

/** Taps the menu's `n`-th choice of its level row (0 for none). */
async function pickLevel(cdp: Cdp, n: number) {
  if (n > 0) await evaluate(cdp, `document.querySelectorAll(".mode-level button")[${n - 1}]?.click()`);
  await sleep(400);
}

async function pictureMenu(cdp: Cdp, base: string, menu: Menu) {
  for (let level = menu.levels ? 1 : 0; level <= (menu.levels ?? 0); level++) {
    await open(cdp, `${base}${menu.path}`);
    await sleep(1500);
    await pickLevel(cdp, level);
    for (const id of await cardIds(cdp)) {
      await open(cdp, `${base}${menu.path}`);
      await sleep(1200);
      await pickLevel(cdp, level);
      await evaluate(cdp, `document.querySelector('[data-mode="${id}"]')?.click()`);
      const file = join(menu.dir, `${id}.webp`);
      await sleep(WAITS[keyOf(file)] ?? WAIT);
      await picture(cdp, file, menu.prepare && !CUTS[keyOf(file)] ? await evaluate<Area | null>(cdp, menu.prepare) : null);
    }
  }
}

/** A table of contents: each game as it plays, or, where its page is a menu of cards, as its first card plays. */
async function pictureBook(cdp: Cdp, base: string, book: string) {
  await open(cdp, `${base}/spiele/${book}/`);
  await sleep(1500);
  const hrefs = await evaluate<string[]>(cdp, `[...document.querySelectorAll(".toc-line")].map((e) => e.getAttribute("href"))`);
  for (const href of hrefs) {
    await open(cdp, `${base}${href}`);
    await sleep(2000);
    const first = (await cardIds(cdp))[0];
    if (first) await evaluate(cdp, `document.querySelector('[data-mode="${first}"]')?.click()`);
    const file = join(BOOK_DIR, `${href.replaceAll("/", "")}.webp`);
    await sleep(WAITS[keyOf(file)] ?? WAIT);
    const prepare = MENUS.find((menu) => menu.path === href)?.prepare;
    await picture(cdp, file, prepare && !CUTS[keyOf(file)] ? await evaluate<Area | null>(cdp, prepare) : null);
  }
}

const site = await siteUrl({ url: option("url"), build: !flag("no-build") });
const { cdp, stop } = await launchChrome(SCREEN);
try {
  await cdp.send("Page.enable");
  // The window is SCREEN's device pixels; the page lays out in its CSS pixels (else a tablet's game twice as big).
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: SCREEN.width, height: SCREEN.height, deviceScaleFactor: SCREEN.scale, mobile: false });
  await cdp.send("Runtime.enable");
  // A game that had a key pressed asks before its page is left (GameShell blocks `beforeunload`): leave anyway.
  cdp.on("Page.javascriptDialogOpening", () => void cdp.send("Page.handleJavaScriptDialog", { accept: true }));
  // German, the boy, and no question for fullscreen: as a first visit on a computer.
  await open(cdp, `${site.url}/`);
  await evaluate(cdp, `localStorage.clear(); localStorage.setItem("tinytaps.applanguage.v1", "de"); true`);
  const wanted = (text: string) => !filters.length || filters.some((f) => text.includes(f));
  for (const book of BOOKS.filter((b) => wanted(`${b} ${BOOK_DIR}`))) {
    console.log(`/spiele/${book}/`);
    await pictureBook(cdp, site.url, book);
  }
  for (const menu of MENUS.filter((m) => wanted(`${m.path} ${m.dir}`))) {
    console.log(menu.path);
    await pictureMenu(cdp, site.url, menu);
  }
} finally {
  stop();
  site.stop();
}
