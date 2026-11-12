import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { type Cdp, evaluate, launchChrome, open, siteUrl, sleep } from "./chrome";

// `bun run previews`: the pictures on the menus' cards and lines (user request, November 2026: pictures from the
// games instead of emojis). It opens each card in headless Chrome as a child would, waits until the game stands, and
// keeps a 3 : 2 cut of the picture as a small webp in the game's `vorschau/` folder – a still image the menus show at
// no cost, where the game's own svg in every card would make a phone draw them all. A card shows it over nearly its
// whole face, a table of contents' line as a rounded rectangle (`CardPicture`, user feedback, November 2026).
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
/** The pictures' size in pixels, `PREVIEW_SIZE` in GameCard.tsx: 3 : 2, like a card, sharp enough on most screens. */
const SIZE = { width: 480, height: 320 };
/** Width over height of every cut. */
const ASPECT = SIZE.width / SIZE.height;

/** A menu whose cards get pictures: its address and the folder they go to, `<card's data-mode>.webp`. */
interface Menu {
  path: string;
  dir: string;
  /** How many choices the menu's level row has that show other cards (Gefühle: days, feelings): each is pictured. */
  levels?: number;
  /**
   * Run in the page before each picture, where a game's start shows too little of it: brings more into sight and
   * returns the part of the window to look in (CSS pixels), whose busiest part becomes the picture.
   */
  prepare?: string;
}

/**
 * Kettenreaktion's worlds are much bigger than the screen, and the camera starts in a corner of sky: this shows the
 * whole world (`.marble-camera`, moved only by its transform) in the window and returns where it lies, so the picture
 * is the busiest part of it – where the machines stand.
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

/** Where the tables of contents' pictures go: smaller in the line than on a card, so they are cut closer (`ZOOMED`). */
const isBook = (file: string) => file.startsWith(BOOK_DIR);

/** What CUTS and WAITS know a picture by: its game's folder and its id, „marbles/topple“ (a book's line: „components/…“). */
const keyOf = (file: string) => file.split("/").filter((part) => part !== "vorschau").slice(-2).join("/").replace(/\.webp$/, "");

/**
 * Where the cut lies, by `keyOf`: its middle as a share of the window's width and height, and its height as a share of
 * the window's height (its width is `ASPECT` times that). By default it is the busiest part of the window (or of what
 * the menu's `prepare` returns); one given here also skips `prepare`.
 */
const CUTS: Record<string, { x: number; y: number; size: number }> = {
  // The clothesline with the pairs hung on it (`PLAYS`), not the floor.
  "components/socken": { x: 0.39, y: 0.2, size: 0.58 },
  // The shelf with its red, yellow and blue marble, what the child picks from, rather than the run's empty middle.
  "marbles/colortrack": { x: 0.28, y: 0.25, size: 0.5 },
};

/**
 * Cut round everything the window shows (each clear edge in it), however big that is, by `keyOf`: where the parts of
 * a game's picture stand far apart and the busiest part would cut one off (user feedback, November 2026: Frei tippen's
 * „A“, its monkey and „Affe“ whole and in the middle; Zählen's number and all its things; Mitmachen's number and the
 * fox hopping it; the animal with the right thing and a wrong one beside it).
 */
const WHOLE = new Set(["components/buchstaben", "components/zaehlen", "components/mitmachen", "components/gross-klein", "components/tiere"]);

/**
 * A part of the window shown alone, by `keyOf`, in CSS pixels: cut out and set into a blurred copy of itself widened
 * to 3 : 2, its sides fading into it, so it fills the picture. Bewegungsabenteuer's dark dancer, in its box at the bottom right, shows the
 * movement better than the fox seen from behind (user feedback, November 2026).
 */
const ALONE: Record<string, Area> = {
  // Inside the box's rounded corners (it stands at 745–1000 × 443–717 in the tablet's window), its feet whole.
  "components/abenteuer": { x: 758, y: 446, width: 228, height: 270 },
};

/**
 * What a child does before the picture, by `keyOf`: the keyboard games wait for a key on an empty page („Drück eine
 * Taste!“), and only then show what they are about; others show their best only after playing a while.
 */
const PLAYS: Record<string, (cdp: Cdp) => Promise<void>> = {
  "components/buchstaben": async (cdp) => {
    await press(cdp, "a");
    await sleep(2000);
  },
  // Three things, counted in one by one, then the digit: small enough to stand whole beside it.
  "components/zaehlen": async (cdp) => {
    await press(cdp, "3");
    await sleep(4500);
  },
  "components/mitmachen": async (cdp) => {
    await press(cdp, "3");
    await sleep(2000);
  },
  // The stomping (the sixth step, a knee and an arm up), a few seconds in, when the dancer is in the middle of it.
  "components/abenteuer": async (cdp) => {
    for (let i = 0; i < 6; i++) {
      await press(cdp, "ArrowRight");
      await sleep(300);
    }
    await sleep(6000);
  },
  // Many pairs on the line (user feedback, November 2026): three washes hung whole, so the game takes the child to
  // four pairs with patterns, and of those all but one.
  "components/socken": (cdp) => hangSocks(cdp, 3),
};

/** Hangs every pair of `washes` washes and then all but one pair of the next, as a quick child would. */
async function hangSocks(cdp: Cdp, washes: number) {
  for (let wash = 0; wash <= washes; wash++) {
    await until(cdp, `!!document.querySelector(".socks-play.sorting")`);
    // The socks tumble out, the baskets come down.
    await sleep(3000);
    for (;;) {
      const left = await evaluate<number>(cdp, `document.querySelectorAll(".sock:not(.gone)").length`);
      if (left <= (wash === washes ? 2 : 0)) break;
      await tap(cdp, ".sock:not(.gone)");
      await sleep(300);
      await tap(cdp, '.sock[data-tap="goal"]');
      await sleep(1200);
    }
    if (wash < washes) await until(cdp, `!document.querySelector(".socks-play.sorting")`);
  }
  await sleep(800);
}

/** Waits until `condition` (run in the page) holds, at most `ms`. */
async function until(cdp: Cdp, condition: string, ms = 20_000) {
  for (const end = Date.now() + ms; Date.now() < end; await sleep(200)) if (await evaluate<boolean>(cdp, condition)) return;
  throw new Error(`Waited in vain for ${condition}`);
}

/** Taps the middle of the first element `selector` finds, as a mouse would. */
async function tap(cdp: Cdp, selector: string) {
  const at = await evaluate<{ x: number; y: number } | null>(
    cdp,
    `(() => { const r = document.querySelector(${JSON.stringify(selector)})?.getBoundingClientRect(); return r ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; })()`,
  );
  if (!at) throw new Error(`Nothing to tap: ${selector}`);
  for (const type of ["mousePressed", "mouseReleased"]) await cdp.send("Input.dispatchMouseEvent", { type, ...at, button: "left", clickCount: 1 });
}

/** How long a game takes to stand after its card was tapped, in ms (the page's turn and the game's first moves). */
const WAIT = 4500;
const WAITS: Record<string, number> = {
  // The camera comes down from the sky first.
  "marbles/water": 8000,
};

/**
 * Hides what lies over every game and is no part of its picture: the corner, the notes, a scene's key letters, count
 * and „Drück eine Taste!“, the story's ⏮ ⏸ ⏭, the marble run's space key, the trail's backpack, Gefühle's
 * sentences under the picture, its dots, ◀, ▶ and loudspeaker (seen as content, they made the cut take the whole page
 * round a small picture), and the pointing hand (any element whose text is only a 👆, 👇, 👈 or 👉), which would
 * stand in every picture.
 */
const HIDE_OVERLAYS = `(() => {
  const style = document.createElement("style");
  style.textContent = ".exit-corner, .play-options-corner, .play-fullscreen, .play-fullscreen-corner, .corner-choices, .dev-tag, .sound-wait, .scene-prompt, .scene-keys, .scene-goal, .scene-keys-toggle, .adventure-controls, .adventure-time, .run-space, .fg-words-text, .fg-day-text, .fg-caption, .fg-dots, .fg-go-on, .fg-next, .fg-back, .story-voice { visibility: hidden !important; }";
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

/** A picture's cut: its left, top, width and height in pixels. */
interface Cut {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * How tall a cut may be, as a share of the picture's height: smaller, a game's thing is cut off; bigger, its details
 * vanish. A card shows much of its game; a table of contents' line, smaller, is cut closer so it can be made out
 * (user feedback, November 2026: „etwas mehr Zoom“).
 */
const WIDE = { smallest: 0.5, biggest: 0.88 };
const ZOOMED = { smallest: 0.38, biggest: 0.6 };

/**
 * Where to cut `png` in `ASPECT`: around what it shows where that fits (a letter and its animal on an empty page),
 * else the part with the most detail (the sum of its brightness steps from pixel to pixel) – plain sky, wall and
 * paper have none, machines, animals and things a lot.
 */
async function bestCut(png: Buffer, { smallest, biggest }: typeof WIDE): Promise<Cut> {
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
      // The page's paper edge round the picture is no content.
      const inside = x > w * 0.04 && x < w * 0.96 && y > h * 0.04 && y < h * 0.96;
      if (step > 20 && inside) Object.assign(box, { x0: Math.min(box.x0, x), y0: Math.min(box.y0, y), x1: Math.max(box.x1, x), y1: Math.max(box.y1, y) });
    }
  }
  // The cut's height: what the content needs, within the bounds and never wider than the picture.
  const content = Math.max(box.y1 - box.y0, (box.x1 - box.x0) / ASPECT) * 1.12;
  const ch = Math.round(Math.min(biggest * h, w / ASPECT, Math.max(smallest * h, content)));
  const cw = Math.min(w, Math.round(ch * ASPECT));
  let best = { x: 0, y: 0 };
  // Compared with the bound, not with the rounded height: 112.000…1 > 112 once cut Frei tippen's „A“ off.
  if (content <= Math.min(biggest * h, w / ASPECT)) {
    best = { x: Math.round((box.x0 + box.x1 - cw) / 2), y: Math.round((box.y0 + box.y1 - ch) / 2) };
  } else {
    let most = -1;
    // Clear of the page's paper edge where there is room: its line is detail too, and stood as a strip at the side.
    const [mx, my] = [Math.min(Math.round(w * 0.03), Math.floor((w - cw) / 2)), Math.min(Math.round(h * 0.03), Math.floor((h - ch) / 2))];
    for (let y = my; y + ch <= h - my; y++) {
      for (let x = mx; x + cw <= w - mx; x++) {
        const detail = sum[(y + ch) * (w + 1) + x + cw] - sum[y * (w + 1) + x + cw] - sum[(y + ch) * (w + 1) + x] + sum[y * (w + 1) + x];
        if (detail > most) [best, most] = [{ x, y }, detail];
      }
    }
  }
  // Back at full size, kept inside the picture (a rounded pixel, or content near an edge).
  const cutWidth = Math.min(width, Math.round(cw / f));
  const cutHeight = Math.min(height, Math.round(cutWidth / ASPECT));
  return {
    width: cutWidth,
    height: cutHeight,
    left: Math.max(0, Math.min(Math.round(best.x / f), width - cutWidth)),
    top: Math.max(0, Math.min(Math.round(best.y / f), height - cutHeight)),
  };
}

/** Presses `key` (a letter, a digit or a named key like „ArrowRight“) as a child on a keyboard would. */
async function press(cdp: Cdp, key: string) {
  const named = key.length > 1;
  const code = named ? key : /\d/.test(key) ? `Digit${key}` : `Key${key.toUpperCase()}`;
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key, code, ...(named ? {} : { text: key }) });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key, code });
}

/** The webp's quality: low enough to stay under the size `previews.test.ts` allows a picture. */
const QUALITY = 70;

/** Pictures what the window shows now into `file`: the cut CUTS says, or the busiest part of `area` (by default the window). */
async function picture(cdp: Cdp, file: string, area?: Area | null) {
  const key = keyOf(file);
  await PLAYS[key]?.(cdp);
  await evaluate(cdp, HIDE_OVERLAYS);
  await sleep(150);
  mkdirSync(file.slice(0, file.lastIndexOf("/")), { recursive: true });
  const cut = CUTS[key];
  const alone = ALONE[key];
  if (alone) {
    const shot = await cdp.send<{ data: string }>("Page.captureScreenshot", { format: "png", clip: { ...alone, scale: 1 } });
    const png = Buffer.from(shot.data, "base64");
    if (shots) await Bun.write(join(shots, `${key.replace("/", "-")}.png`), png);
    const { width = 1, height = 1 } = await sharp(png).metadata();
    const wide = Math.round(height * ASPECT);
    const backdrop = await sharp(png).resize(wide, height, { fit: "fill" }).blur(24).png().toBuffer();
    // Its left and right sides fade out, so no edge shows where it meets the blur.
    const fade = Math.round(width * 0.12);
    const mask = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="f"><stop offset="0" stop-opacity="0"/><stop offset="${fade / width}" stop-opacity="1"/><stop offset="${1 - fade / width}" stop-opacity="1"/><stop offset="1" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#f)"/></svg>`,
    );
    const alpha = await sharp(mask).resize(width, height, { fit: "fill" }).png().toBuffer();
    const faded = await sharp(png).ensureAlpha().composite([{ input: alpha, blend: "dest-in" }]).png().toBuffer();
    // Two steps: sharp resizes before it composites (or extends), whatever order they are asked in.
    const whole = await sharp(backdrop)
      .composite([{ input: faded, left: Math.round((wide - width) / 2), top: 0 }])
      .png()
      .toBuffer();
    await sharp(whole).resize(SIZE.width, SIZE.height).webp({ quality: QUALITY }).toFile(file);
  } else if (!cut) {
    area ??= { x: 0, y: 0, width: SCREEN.width, height: SCREEN.height };
    const shot = await cdp.send<{ data: string }>("Page.captureScreenshot", { format: "png", clip: { ...area, scale: 1 } });
    const png = Buffer.from(shot.data, "base64");
    if (shots) await Bun.write(join(shots, `${key.replace("/", "-")}.png`), png);
    const rect = await bestCut(png, WHOLE.has(key) ? { smallest: ZOOMED.smallest, biggest: 1 } : isBook(file) ? ZOOMED : WIDE);
    await sharp(png).extract(rect).resize(SIZE.width, SIZE.height).webp({ quality: QUALITY }).toFile(file);
  } else {
    const height = cut.size * SCREEN.height;
    const width = height * ASPECT;
    // Kept inside the window.
    const x = Math.max(0, Math.min(cut.x * SCREEN.width - width / 2, SCREEN.width - width));
    const y = Math.max(0, Math.min(cut.y * SCREEN.height - height / 2, SCREEN.height - height));
    const clip = { x, y, width, height, scale: 1 };
    const shot = await cdp.send<{ data: string }>("Page.captureScreenshot", { format: "png", clip });
    if (shots) await Bun.write(join(shots, `${key.replace("/", "-")}.png`), Buffer.from(shot.data, "base64"));
    await sharp(Buffer.from(shot.data, "base64")).resize(SIZE.width, SIZE.height).webp({ quality: QUALITY }).toFile(file);
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
