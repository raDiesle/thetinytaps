// What `bun run perf` (tools/perf.ts) plays and how smooth it has to be. A new game, or a new part of one that
// moves a lot, gets a scenario here: open it, start it as a child would, and measure the stretches where most
// moves (a story, a camera, many taps).

/** A phone to pretend to be. */
export interface Device {
  name: string;
  /** The screen in CSS pixels, held sideways. */
  width: number;
  height: number;
  /** Device pixels per CSS pixel: how many pixels have to be painted. */
  scale: number;
  /** How many times slower the main thread runs than on this computer. */
  cpuSlowdown: number;
}

export const DEVICES: Record<string, Device> = {
  // About ten years old (Galaxy S7, Moto G4, 2016): a 1920×1080 screen, and DevTools' "low-end mobile" CPU.
  oldAndroid: { name: "Old Android (about 2016)", width: 640, height: 360, scale: 3, cpuSlowdown: 6 },
  // A phone of a few years (2020) on its side, the size the layouts are checked at.
  phone: { name: "Phone (about 2020)", width: 844, height: 390, scale: 2, cpuSlowdown: 3 },
  // A cheap tablet.
  tablet: { name: "Tablet", width: 1024, height: 768, scale: 2, cpuSlowdown: 4 },
};

/** Limits a stretch must keep; a scenario may loosen or tighten them. */
export interface Budget {
  /** The slowest 5 % of frames, in ms (33 is 30 frames a second). */
  p95: number;
  /** Frames over 50 ms per second. */
  stuttersPerS: number;
  /** Share of the time the main thread may be busy; above it, taps answer late too. */
  busy: number;
  /**
   * Whole screens of pixels rastered anew per second. A phone's GPU paints them, however fast the computer measuring is:
   * a picture painted again in every frame costs 60 (120 on a gaming phone's screen), which the frames and the main
   * thread here never showed while Zähne putzen, the marble run and the page turn stuttered on phones (November 2026).
   */
  rasterScreensPerS: number;
}

export const BUDGET: Budget = { p95: 34, stuttersPerS: 0.5, busy: 0.6, rasterScreensPerS: 30 };

/** Something done before a stretch is measured. */
export type Step =
  | { wait: number }
  | { waitFor: string }
  | { tap: string; optional?: boolean }
  | { key: string }
  | { eval: string };

/** A stretch to measure. */
export interface Part {
  label: string;
  before?: Step[];
  ms: number;
  /** Tap these one after the other while measuring, every `every` ms, as a child would. */
  tap?: { selector: string; every: number };
  /** Press these keys one after the other while measuring, every `every` ms. */
  type?: { keys: string[]; every: number };
  /** Limits of this stretch alone, over the scenario's; only for a decision written down next to it. */
  budget?: Partial<Budget>;
}

/** One game (or one mode of it) to play. */
export interface Scenario {
  name: string;
  /** The address to open, e.g. "/zaehne/". */
  path: string;
  /** Script run on the page before it opens, e.g. to set a game's settings in localStorage. */
  storage?: string;
  budget?: Partial<Budget>;
  parts: Part[];
}

/** The first card or start button of a game's start screen. */
const START: Step = { tap: ".start-button, .mode-card", optional: true };
/** What a child taps while playing: anything that answers a tap, but the way back (a menu's page corner), which leaves. */
const TAPS = { selector: "[data-tap]:not(.page-corner)", every: 700 };
const key = (k: string, times = 1): Step[] => Array.from({ length: times }, () => [{ key: k }, { wait: 150 }]).flat() as Step[];

export const SCENARIOS: Scenario[] = [
  {
    name: "zaehne",
    path: "/zaehne/",
    parts: [
      { label: "Geschichte: Süßes", before: [START, { wait: 300 }], ms: 9000 },
      { label: "Geschichte: Monster wachsen", before: [{ wait: 600 }], ms: 5500 },
      { label: "Waschbecken", ms: 12000 },
      { label: "Spiegel, Countdown", before: [{ wait: 3000 }], ms: 4500 },
      { label: "Putzen: Kauflächen", before: [{ wait: 1000 }], ms: 6000 },
      { label: "Putzen: Kopf dreht sich", before: key("ArrowRight"), ms: 5000 },
      { label: "Putzen: Mund geht zu", before: key("ArrowRight"), ms: 5000 },
      { label: "Putzen: innen", before: key("ArrowRight", 3), ms: 5000 },
      { label: "Ende", before: key("ArrowRight", 2), ms: 6000 },
    ],
  },
  {
    name: "menues",
    path: "/",
    parts: [
      { label: "Startseite", ms: 3000 },
      // The home page is a bookshelf: a book is taken out and opened at its table of contents, whose line turns a page.
      { label: "Buch aus dem Regal nehmen", before: [{ tap: '.shelf-book[data-book="lebendige-welten"]' }], ms: 2500 },
      { label: "Seite blättern in ein Spiel", before: [{ waitFor: ".toc-line" }, { tap: ".toc-line" }], ms: 2500 },
    ],
  },
  {
    name: "buchstaben",
    path: "/buchstaben/",
    parts: [{ label: "Tippen auf der Tastatur", before: [{ wait: 1500 }], ms: 8000, type: { keys: [..."abcmotx"], every: 500 } }],
  },
  { name: "tiere", path: "/tiere/", parts: [{ label: "Wer schaut da raus? und Füttern", before: [{ wait: 1500 }], ms: 8000, tap: TAPS }] },
  {
    // „Was wird aus mir?“ alone, the right one tapped each time, so the small ones keep growing up.
    name: "tiere-werden",
    path: "/tiere/",
    storage: `localStorage.setItem("tinytaps.animals.v3", JSON.stringify({ peek: false, feed: false, gift: false, home: false, grow: true }))`,
    parts: [{ label: "Was wird aus mir?", before: [{ wait: 1500 }], ms: 9000, tap: { selector: '[data-tap="goal"]', every: 700 } }],
  },
  {
    // „Was gehört zusammen?“: the right one tapped each time, so every pair and helper sets to work in turn.
    name: "zusammen",
    path: "/zusammen/",
    parts: [{ label: "Was gehört zusammen?", before: [{ wait: 1500 }], ms: 9000, tap: { selector: '[data-tap="goal"]', every: 700 } }],
  },
  { name: "bilder", path: "/bilder/flughafen/", parts: [{ label: "Flughafen antippen", before: [{ wait: 2000 }], ms: 10000, tap: TAPS }] },
  { name: "schnullerfee", path: "/schnullerfee/", parts: [{ label: "Geschichte", before: [{ wait: 1500 }], ms: 10000, tap: TAPS }] },
  { name: "toepfchen", path: "/toepfchen/", parts: [{ label: "Geschichte", before: [{ wait: 1500 }], ms: 8000, tap: TAPS }] },
  { name: "abstillen", path: "/abstillen/", parts: [{ label: "Geschichte blättern", before: [{ wait: 1500 }], ms: 8000, tap: TAPS }] },
  { name: "belohnungstafel", path: "/belohnungstafel/", parts: [{ label: "Sterne kleben", before: [START, { wait: 1500 }], ms: 6000, tap: TAPS }] },
  // The timer's three pictures, each running for a while with a tap now and then (the steam, the twinkling, the flame).
  ...(["zug", "sanduhr", "kerze"] as const).map((name, i) => ({
    name: `timer-${name}`,
    path: "/timer/",
    parts: [{ label: "Läuft", before: [{ tap: `.mode-list > li:nth-child(${i + 1}) .mode-card` }, { wait: 1500 }], ms: 8000, tap: { selector: ".tm-play", every: 1500 } }],
  })),
  { name: "gefuehle", path: "/gefuehle/", parts: [{ label: "Wie geht's dir?", before: [START, { wait: 1500 }], ms: 8000, tap: TAPS }] },
  { name: "schatten", path: "/schatten/", parts: [{ label: "Schatten finden", before: [{ wait: 1500 }], ms: 8000, tap: TAPS }] },
  { name: "socken", path: "/socken/", parts: [{ label: "Waschen", before: [{ wait: 500 }], ms: 8000 }, { label: "Socken paaren", ms: 8000, tap: TAPS }] },
  { name: "kettenreaktion", path: "/kettenreaktion/", parts: [{ label: "Erstes Level", before: [START, { wait: 1500 }], ms: 10000, tap: TAPS }] },
  {
    // The marble run's camera following three things down the wall (the barrier open, „Von selbst“): the picture that
    // moves most, and stuttered on phones while the camera was a changing viewBox.
    name: "kugelbahn",
    path: "/kettenreaktion/",
    storage: `localStorage.setItem("tinytaps.marbles.v1", JSON.stringify({ play: "watch" }))`,
    parts: [
      {
        label: "Kamera folgt den Kugeln",
        before: [START, { wait: 1500 }, ...[1, 2, 3].flatMap(() => [{ tap: ".run-shelf-thing" }, { wait: 700 }] as Step[])],
        ms: 12000,
      },
    ],
  },
  {
    // A machine: one tap, and the camera follows what moves through a wide room for 40 seconds.
    name: "maschine",
    path: "/kettenreaktion/",
    parts: [
      {
        label: "Große Maschine läuft",
        before: [{ eval: `[...document.querySelectorAll(".mode-card")].find((c) => c.textContent.includes("Große Maschine")).click()` }, { wait: 1500 }, ...key(" ")],
        ms: 12000,
      },
    ],
  },
  {
    name: "kleine-abenteuer",
    path: "/kleine-abenteuer/",
    parts: [{ label: "Erste Geschichte", before: [START, { wait: 2000 }], ms: 12000, tap: TAPS }],
  },
  // three.js: headless Chrome draws WebGL on the CPU (SwiftShader), so this measures more than a phone's GPU would cost.
  {
    name: "abenteuer",
    path: "/abenteuer/",
    parts: [
      { label: "Tapsi bewegt sich", before: [START, { wait: 3000 }], ms: 10000 },
      // The arrow keys skip from the first movement to the drums: the busiest place, and the arms glow.
      // It stays busier than the budget: user decision, October 2026 – it keeps 60 fps (p95 17 ms), never drops to 30 fps
      // on slow phones, and a quarter of the busy time is SwiftShader's WebGL work on the CPU, which a phone's GPU does.
      // Measured 85–90 % busy (up to 98 % while other programs load the computer); more than 95 % is a real regression.
      {
        label: "Trommeln (leuchtet)",
        before: [...key("ArrowRight", 8), { wait: 4000 }],
        ms: 10000,
        budget: { busy: 0.95 },
      },
    ],
  },
];
