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

/**
 * Zähne putzen: back to the start of the end's cheer, wherever the jumps before left the brushing: ← once if the end is
 * on (its address says „ende“; → there only skips to the buttons), then → until the address says „ende“ again, one
 * step at a time and waiting for each step's address – on the slow phone a press before the last had landed went past
 * the cheer.
 */
const TO_THE_END = `(async () => {
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const press = async (key) => {
    const was = location.search;
    dispatchEvent(new KeyboardEvent("keydown", { key }));
    for (let t = 0; t < 30 && location.search === was; t++) await pause(100);
    await pause(300);
  };
  if (location.search.includes("ende")) await press("ArrowLeft");
  for (let i = 0; i < 12 && !location.search.includes("ende"); i++) await press("ArrowRight");
})()`;

/** Lebendige Bilder: the items of the picture, and a finger landing on one (an `eval` step defines `tapItem` with it). */
const TAP_ITEMS = `((window.tapItem = (el) => { const r = el.getBoundingClientRect(); el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2, pointerType: "touch", isPrimary: true })); }), [...document.querySelectorAll("[data-item]")])`;

/** Something done before a stretch is measured. */
export type Step = { wait: number } | { waitFor: string } | { tap: string; optional?: boolean } | { key: string } | { eval: string };

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
  /**
   * For a motion that begins a moment after its tap (the next page is drawn first, the screen standing still): the
   * stretch starts only once the motion runs, so it measures the motion and nothing else, and the wait before it is a
   * number of its own with its own limit. Without it the frame counter started somewhere inside that wait, and the
   * stretch passed or failed by how many of the wait's slow frames it happened to catch (code review R-P15).
   */
  startWhen?: StartWhen;
}

/** When a stretch starts, see `Part.startWhen`. */
export interface StartWhen {
  /** An expression asked in the page at every frame after the finger landed: the stretch starts once it is true. */
  holds: string;
  /** What the time from the finger landing (the first tap of `before`) to that frame is called in the output. */
  lead: string;
  /** That time's limit in ms on this device: longer, and the tap feels unanswered. */
  within: number;
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

/**
 * A fixed chance from here on (`Math.random` replaced by a seeded one): Tippzauber's surprises are drawn by chance, and
 * which kinds came swung its smashing stretch between 58 and 70 % busy on the same code (November 2026).
 */
const FIXED_CHANCE: Step = {
  eval: "(() => { let a = 12345; Math.random = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; })()",
};

/** Tippzauber: a finger landing somewhere on the screen every 130 ms, for the next 10 s. */
const SMASH = `(() => { const end = performance.now() + 10000; const id = setInterval(() => { const el = document.querySelector(".tw-play"); if (!el || performance.now() > end) return clearInterval(id); const r = el.getBoundingClientRect(); el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: r.x + Math.random() * r.width, clientY: r.y + 60 + Math.random() * (r.height - 60), pointerType: "touch", isPrimary: true })); }, 130); })()`;

/** The first card or start button of a game's start screen. */
const START: Step = { tap: ".start-button, .mode-card", optional: true };
/** What a child taps while playing: anything that answers a tap, but the way back (a menu's page corner), which leaves. */
const TAPS = { selector: "[data-tap]:not(.page-corner)", every: 700 };
const key = (k: string, times = 1): Step[] => Array.from({ length: times }, () => [{ key: k }, { wait: 150 }]).flat() as Step[];

/**
 * Every level of Kettenreaktion (`LEVELS` in src/games/marbles/catalog.ts, by its address), so a level that stutters on a
 * phone is found even where no one plays it in the other scenarios: the whole world is drawn in one big svg there, and a
 * level that draws a moving thing into it has the phone paint the whole picture again in every frame.
 */
export const KETTEN_LEVELS = [
  "track",
  "colortrack",
  "snowtrack",
  "spacetrack",
  "slidetrack",
  "sitetrack",
  "machine",
  "sneeze",
  "kitchen",
  "garden",
  "pegs",
  "topple",
  "building",
  "water",
  "circus",
  "space",
  "light",
  "bath",
  "farm",
  "night",
  "tidy",
] as const;

/** A marble run, started as a child does: the three things on the shelf tapped one after the other. */
const RUN_LEVELS = new Set<string>(["track", "colortrack", "snowtrack", "spacetrack", "slidetrack", "sitetrack"]);

/**
 * One Kettenreaktion level opened at its address, started, and measured twice: the first seconds and a stretch in its
 * middle (each level lasts about a minute). „Von selbst“ is set, but a machine still stood at its stop in the middle
 * (November 2026), so a machine also gets a key now and then, which lets it run on from a stop and does nothing else.
 */
function chainLevel(id: (typeof KETTEN_LEVELS)[number]): Scenario {
  const start: Step[] = RUN_LEVELS.has(id) ? [1, 2, 3].flatMap(() => [{ tap: ".run-shelf-thing" }, { wait: 700 }] as Step[]) : key(" ");
  // The pegboard drops a marble at every key, so a child keeps pressing there – but slowly enough that its twenty
  // marbles last into the middle: at a key every 600 ms the level was over before it, and „Mitte“ measured the turn to
  // the next level (A-36).
  const run = RUN_LEVELS.has(id);
  const type = id === "pegs" ? { keys: ["a", "s", "d", "f", "g", "h", "j"], every: 1500 } : run ? undefined : { keys: [" "], every: 2500 };
  const middle: Step[] = run ? [{ wait: 12000 }] : [1, 2, 3].flatMap(() => [{ wait: 4000 }, ...key(" ")]);
  // A marble run's own lower wall (the orbit round the planet, the helix tower, the chair lift, …) begins about half a
  // minute after the first tap, after both stretches above: nobody measured it, and the Weltraumbahn stuttered on a
  // gaming phone while things circled its planet (user feedback, 26 November 2026).
  const lower: Scenario["parts"] = run ? [{ label: "Unten", ms: 14000 }] : [];
  return {
    name: `ketten-${id}`,
    path: `/kettenreaktion/${id}/`,
    parts: [{ label: "Anfang", before: [{ wait: 1500 }, ...start], ms: 10000, type }, { label: "Mitte", before: middle, ms: 10000, type }, ...lower],
  };
}

export const SCENARIOS: Scenario[] = [
  {
    // The shared tap hint waiting for a child who doesn't find what to tap: its hand presses again and again, maybe for
    // minutes. Its shadow lay over the pressing layer, and the GPU blurred it anew in every frame (A-55). Measured on the
    // wooden marble run's shelf before its first tap, in the hint's first stage (the hand presses, nothing darkens yet).
    name: "tipp-hinweis",
    path: "/kettenreaktion/track/",
    parts: [{ label: "Hand drückt", before: [{ waitFor: ".tap-hint.stage-1" }], ms: 5000 }],
  },
  {
    // One stretch after the other, with no waits between them: collecting a trace already leaves seconds unmeasured
    // between two stretches, and a stretch started after a wait of its own missed the story's monsters growing, which
    // painted the whole screen 60 times a second until November 2026 (the sky's colour and the monsters swaying inside
    // svgs). The jumps glide the mirror to the next step every two seconds, far more often than a child sees it.
    name: "zaehne",
    path: "/zaehne/",
    parts: [
      { label: "Geschichte: Süßes", before: [START], ms: 9500 },
      { label: "Geschichte: Monster wachsen", ms: 5500 },
      { label: "Hinunter zum Waschbecken", ms: 6000 },
      { label: "Waschbecken", ms: 8000 },
      { label: "Hinauf in den Spiegel", ms: 5000 },
      // X-26: the lion, then the child beside it in its costume, three times 3, 2, 1 and both roar; then the mirror, mouth open, 3, 2, 1.
      { label: "Brüllen wie ein Löwe", ms: 21500 },
      { label: "Mund offen, Countdown", ms: 5100 },
      { label: "Putzen: Los!", ms: 6000 },
      { label: "Putzen: Monster antippen", ms: 6000, tap: { selector: ".monster-body", every: 700 } },
      { label: "Putzen: springen", ms: 12000, type: { keys: ["ArrowRight"], every: 2000 } },
      // The jumps above run on into the end and skip it to the buttons, so until November 2026 this stretch measured
      // only the still grin (X-18): it goes back to the cheer's start first and watches cheer, spitting and tidying whole.
      { label: "Ende, Ausspucken und Aufräumen", before: [{ eval: TO_THE_END }], ms: 17500 },
    ],
  },
  {
    // The book on the shelf starts the brushing at once: its flight, then the story beginning as the book lies open.
    name: "zaehne-vom-regal",
    path: "/",
    parts: [
      {
        label: "Buch aus dem Regal nehmen",
        before: [{ tap: '[data-book="zaehne"]' }],
        startWhen: { holds: 'document.querySelector(".bt-book")?.getAnimations({ subtree: true }).length > 0', lead: "tap to lift", within: 600 },
        ms: 3000,
      },
      { label: "Geschichte beginnt", ms: 5000 },
    ],
  },
  {
    // Hände waschen plays at once: sleeves and soap from the pump, then the rubbing with the hands crossing and the foam
    // growing while the dirt fades, then water on, the rinse under the stream, water off and the hands into the towel.
    // The built site leaves out the painted rooms until they are made. The stretches follow the clock with no waits.
    name: "haende-waschen",
    path: "/haende-waschen/",
    parts: [
      { label: "Ärmel und Seife", ms: 5500 },
      { label: "Reiben: Handflächen und Handrücken", ms: 10000 },
      { label: "Reiben: aufs Bild tippen", ms: 8000, tap: { selector: ".hw-stage", every: 700 } },
      { label: "Reiben: springen", ms: 6000, type: { keys: ["ArrowRight"], every: 2000 } },
      { label: "Wasser, Abspülen, Handtuch", ms: 14000 },
    ],
  },
  {
    name: "menues",
    path: "/",
    parts: [
      { label: "Startseite", ms: 3000 },
      // The home page is a bookshelf: a book is taken out and opened at its table of contents, whose line turns a page.
      // The book lifts only once its first page is drawn (the screen still meanwhile): that wait is „tap to lift“, and
      // the stretch is the flight itself, to its end and the page landing as the screen (2.55 s, `bookTravel.ts`).
      {
        label: "Buch aus dem Regal nehmen",
        before: [{ tap: '.shelf-book[data-book="lebendige-welten"]' }],
        startWhen: { holds: 'document.querySelector(".bt-book")?.getAnimations({ subtree: true }).length > 0', lead: "tap to lift", within: 600 },
        ms: 3000,
      },
      { label: "Seite blättern in ein Spiel", before: [{ waitFor: ".toc-line" }, { tap: ".toc-line" }], ms: 2500 },
    ],
  },
  {
    name: "buchstaben",
    path: "/buchstaben/",
    parts: [
      { label: "Tippen auf der Tastatur", before: [{ wait: 1500 }], ms: 8000, type: { keys: [..."abcmotx"], every: 500 } },
      // Keys that are no letter or number open a surprise each (fireworks on a canvas, a snowflake, a present …), at most three at once.
      { label: "Überraschungen", before: [{ wait: 1500 }], ms: 9000, type: { keys: [...",.-+#<*"], every: 600 } },
    ],
  },
  {
    // Tippzauber: a hand banging on the keys or the screen brings several letters, digits with their shapes and
    // surprises at once (up to `MAX_POPS` and five surprises), each a small layer of its own – far quicker presses than
    // in the other keyboard games, since that is how the toy is played.
    name: "zaubertasten",
    path: "/drauflos/",
    parts: [
      { label: "Buchstaben und Zahlen", before: [{ wait: 1500 }, FIXED_CHANCE], ms: 8000, type: { keys: [..."a3km7zb9xe5"], every: 200 } },
      { label: "Überraschungen", before: [{ wait: 1500 }, FIXED_CHANCE], ms: 9000, type: { keys: [...",.-+#<*"], every: 250 } },
      { label: "Auf den Bildschirm patschen", before: [{ wait: 1500 }, FIXED_CHANCE], ms: 8000, tap: { selector: ".tw-play", every: 300 } },
      // Both hands at once: keys of every kind and fingers landing all over the screen, as fast as the limits let things come.
      {
        label: "Mit beiden Händen",
        before: [{ wait: 1500 }, FIXED_CHANCE, { eval: SMASH }],
        ms: 9000,
        type: { keys: [..."q,w7.e-r3t+z#u<i*o9p"], every: 110 },
      },
    ],
  },
  {
    name: "zaehlen",
    path: "/zaehlen/",
    parts: [{ label: "Zahlen tippen", before: [{ wait: 1500 }], ms: 8000, type: { keys: [..."3719524"], every: 700 } }],
  },
  {
    // Zähl-Turm: each key lowers a block from the crane's hook and the child hops onto it, all layers moved by their
    // transform; the tenth brings the beam sliding in and the whole world (the camera) going up a floor.
    name: "zaehlturm",
    path: "/zaehlturm/?seite=1",
    parts: [{ label: "Ein Stockwerk und hinauf", before: [{ wait: 1500 }], ms: 15000, type: { keys: [..."aaaaaaaaaaaa"], every: 1100 } }],
  },
  {
    // Mitmachen: the child hops, claps and stamps on its own layer; keys during a round only ripple.
    name: "mitmachen",
    path: "/mitmachen/",
    parts: [{ label: "Hüpfen, klatschen, stampfen", before: [{ wait: 1500 }], ms: 9000, type: { keys: [..."3a2b"], every: 2200 } }],
  },
  {
    // Wo ist das kleine b?: letter keys choose among the three small letters; the right one walks over on its own layer.
    name: "gross-klein",
    path: "/gross-klein/",
    parts: [{ label: "Kleine Buchstaben finden", before: [{ wait: 1500 }], ms: 9000, type: { keys: [..."abcdefghiklmnoprstu"], every: 450 } }],
  },
  {
    name: "woerter",
    path: "/woerter/",
    parts: [{ label: "Wörter tippen", before: [{ wait: 1500 }], ms: 8000, type: { keys: [..."abcdefghijklmnoprstu"], every: 400 } }],
  },
  { name: "tiere", path: "/tiere/", parts: [{ label: "Wer schaut da raus? und Füttern", before: [{ wait: 1500 }], ms: 8000, tap: TAPS }] },
  {
    // „Was wird aus mir?“ alone, the right one tapped each time, so the small ones keep growing up.
    name: "tiere-werden",
    path: "/tiere/",
    storage: `localStorage.setItem("tinytaps.animals.v3", JSON.stringify({ kinds: "grow" }))`,
    parts: [{ label: "Was wird aus mir?", before: [{ wait: 1500 }], ms: 9000, tap: { selector: '[data-tap="goal"]', every: 700 } }],
  },
  {
    // „Wer macht das Geräusch?“ alone: the curtain tapped (it sways) and the right animal picked, so it opens again and again.
    name: "tiere-geraeusche",
    path: "/tiere/",
    storage: `localStorage.setItem("tinytaps.animals.v3", JSON.stringify({ kinds: "sound" }))`,
    parts: [{ label: "Wer macht das Geräusch?", before: [{ wait: 1500 }], ms: 9000, tap: { selector: '.as-stage, [data-tap="goal"]', every: 700 } }],
  },
  {
    // „Was gehört zusammen?“: the right one tapped each time, so every pair and helper sets to work in turn.
    name: "zusammen",
    path: "/zusammen/",
    parts: [{ label: "Was gehört zusammen?", before: [{ wait: 1500 }], ms: 9000, tap: { selector: '[data-tap="goal"]', every: 700 } }],
  },
  {
    name: "bilder",
    path: "/bilder/flughafen/",
    parts: [
      { label: "Flughafen antippen", before: [{ wait: 2000 }], ms: 10000, tap: TAPS },
      // The end once all is found (B-21): the evening light fades in and everything bows in turn. From a reload, all
      // items but one tapped and left to finish their own animations, then the last one, as a child finds it.
      {
        label: "Ende: Abendlicht und Verbeugung",
        before: [
          { eval: "location.reload()" },
          { wait: 2500 },
          { tap: ".screen-hint-button", optional: true },
          { eval: `${TAP_ITEMS}.slice(1).forEach(tapItem)` },
          { wait: 4000 },
          { eval: `tapItem(${TAP_ITEMS}[0])` },
          { wait: 700 },
        ],
        ms: 6000,
      },
    ],
  },
  { name: "toepfchen", path: "/toepfchen/", parts: [{ label: "Geschichte", before: [{ wait: 1500 }], ms: 8000, tap: TAPS }] },
  { name: "abstillen", path: "/abstillen/", parts: [{ label: "Inhalt, dann Geschichte blättern", before: [{ wait: 1500 }], ms: 8000, tap: TAPS }] },
  { name: "kita", path: "/kita/", parts: [{ label: "Inhalt, dann Geschichte blättern", before: [{ wait: 1500 }], ms: 8000, tap: TAPS }] },
  { name: "haare-waschen", path: "/haare-waschen/", parts: [{ label: "Inhalt, dann Geschichte blättern", before: [{ wait: 1500 }], ms: 8000, tap: TAPS }] },
  { name: "flaeschchen", path: "/flaeschchen/", parts: [{ label: "Inhalt, dann Geschichte blättern", before: [{ wait: 1500 }], ms: 8000, tap: TAPS }] },
  { name: "grosses-bett", path: "/grosses-bett/", parts: [{ label: "Inhalt, dann Geschichte blättern", before: [{ wait: 1500 }], ms: 8000, tap: TAPS }] },
  { name: "belohnungstafel", path: "/belohnungstafel/", parts: [{ label: "Sterne kleben", before: [START, { wait: 1500 }], ms: 6000, tap: TAPS }] },
  // The timer's pictures in their order on its start screen, each running for a while with a tap now and then (the
  // twinkling, the flame, what is left lighting up), the moon setting and the sun rising, the pizza's slices
  // lifted off, the ladybug crawling round the red disc, the alarm clock's digits ticking, the toy crane carrying toys
  // into the box, the crystal's beam carrying the blocks out of their jumble into the block house, the pickaxe digging the treasure tunnel block by block, the lift riding up its tower with the floors counting on its display, the tower sliding down behind it, in „Abwechseln“ the toy hopping onto the first cushion and the hourglass running,
  // on the Kugelbahn the marble rolling down its ramps, on the Rennstrecke the kart driving round the figure eight, and the marbles bouncing down the pegboard into the jar. Each card is tapped by its name (its
  // tooltip), so the cards' order and groups may change.
  ...(
    [
      ["scheibe", "Rote Scheibe"],
      ["sanduhr", "Sanduhr"],
      ["apfelbaum", "Apfelbaum"],
      ["wecker", "Wecker"],
      ["blume", "Blume"],
      ["aufzug", "Mit dem Aufzug nach oben"],
      ["pizza", "Pizza"],
      ["kerze", "Kerze"],
      // Tidy Up was written English first; the German app names their cards in German since they were translated.
      ["aufraeumen", "Aufräumen"],
      ["kloetzchen", "Klötzchenhaus"],
      ["schatztunnel", "Schatztunnel"],
      ["raupe", "Raupe"],
      ["sonne", "Sonnenaufgang"],
      ["kugelglas", "Kugelglas"],
      ["abwechseln", "Abwechseln"],
      ["kugelbahn", "Kugelbahn"],
      ["rennstrecke", "Rennstrecke"],
    ] as const
  ).map(([name, title]) => ({
    name: `timer-${name}`,
    path: "/timer/",
    parts: [{ label: "Läuft", before: [{ tap: `.mode-card[title^="${title}"]` }, { wait: 1500 }], ms: 8000, tap: { selector: ".tm-play", every: 1500 } }],
  })),
  // „Abwechseln“ meant with short turns: the cushions pricking their ears, the lamps changing and the hourglass turning itself over.
  // `?sekunden=` works only on the dev server, so on the built site these two measure the start of a turn of the row's
  // length (November 2026).
  {
    name: "timer-abwechseln-wechsel",
    path: "/timer/?sekunden=5",
    parts: [
      {
        label: "Wechsel",
        before: [{ tap: `.mode-card[title^="Abwechseln"]` }, { wait: 500 }],
        ms: 10000,
        tap: { selector: ".tm-play", every: 1500 },
      },
    ],
  },
  // The Kugelbahn with short turns: the marble rolling down the run, falling into the next cup, the strips of light changing.
  {
    name: "timer-kugelbahn-wechsel",
    path: "/timer/?sekunden=5",
    parts: [{ label: "Wechsel", before: [{ tap: `.mode-card[title^="Kugelbahn"]` }, { wait: 500 }], ms: 10000, tap: { selector: ".tm-play", every: 1500 } }],
  },
  // The Rennstrecke with short turns: the start light, the kart driving its lap, the children hopping out and in at the line.
  {
    name: "timer-rennstrecke-wechsel",
    path: "/timer/?sekunden=5",
    parts: [{ label: "Wechsel", before: [{ tap: `.mode-card[title^="Rennstrecke"]` }, { wait: 500 }], ms: 10000, tap: { selector: ".tm-play", every: 1500 } }],
  },
  // A timer's last moments and its end, with the shortest length (10 s, the first slip): the bar along the bottom
  // filling, the warm light gathering from the edges, the bar's marker and flag beating, then the end's light and trophy.
  {
    name: "timer-letzte-sekunden",
    path: "/timer/",
    parts: [
      {
        label: "Letzte Sekunden",
        before: [{ tap: ".tm-lengths button" }, { wait: 300 }, { tap: `.mode-card[title^="Rote Scheibe"]` }, { wait: 4000 }],
        ms: 7000,
        tap: { selector: ".tm-play", every: 1500 },
      },
    ],
  },
  // The Apfelbaum's harvest, sped up: bees buzzing, apples ripening and falling into the cart the bear child pushes.
  {
    name: "timer-apfelbaum-ernte",
    path: "/timer/?sekunden=16",
    parts: [{ label: "Ernte", before: [{ tap: `.mode-card[title^="Apfelbaum"]` }, { wait: 6000 }], ms: 8000, tap: { selector: ".tm-play", every: 1500 } }],
  },
  // „Was ist passiert?“: scene after scene by keys – the feeling, the two cards, the cause big – each key one step,
  // so the pictures' slow fading and the cards coming are measured (taps could hit ◀ and step back).
  {
    name: "was-ist-passiert",
    path: "/was-ist-passiert/",
    parts: [
      {
        label: "Szenen spielen",
        before: [{ wait: 1500 }, { tap: ".screen-hint-button", optional: true }, { wait: 1500 }],
        ms: 10000,
        type: { keys: ["x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x"], every: 800 },
      },
    ],
  },
  // „Alltagssituationen“: the first group's scenes, one tap on a card each; the book's other games play at once.
  { name: "gefuehle", path: "/gefuehle/", parts: [{ label: "Szenen wählen", before: [START, { wait: 1500 }], ms: 10000, tap: TAPS }] },
  // „Wie geht's dir?“: a feeling's card, then its three pictures, a little to a whole lot, picked in turn (C-36).
  {
    name: "wie-gehts-dir",
    path: "/wie-gehts-dir/",
    parts: [
      // The start screen's first card „Wie geht's dir?“ (the second is „Was brauche ich?“).
      { label: "Gefühl wählen", before: [{ wait: 1500 }, { tap: ".mode-picker li:nth-child(1) button" }, { wait: 1500 }], ms: 4000, tap: TAPS },
      {
        label: "Wie doll",
        // The taps before left a feeling open, or went on to „Was brauche ich?“ by its link: the page starts again at
        // its own address (a reload stayed on the other page), waiting first or the old page is found, its fullscreen
        // question answered as at the start.
        before: [
          { eval: "location.assign('/wie-gehts-dir/')" },
          { wait: 4000 },
          { tap: ".screen-hint-button", optional: true },
          { wait: 500 },
          { waitFor: ".mode-picker li:nth-child(1) button" },
          { tap: ".mode-picker li:nth-child(1) button" },
          { wait: 1500 },
          { waitFor: '.fg-card[aria-label="Wütend"]' },
          { wait: 1500 },
          { tap: '.fg-card[aria-label="Wütend"]' },
          { waitFor: ".mood-strengths" },
          { wait: 1500 },
        ],
        ms: 8000,
        // The arrows pick a weaker or stronger picture, the other two going pale.
        type: { keys: ["ArrowRight", "ArrowRight", "ArrowLeft", "ArrowLeft", "ArrowLeft", "ArrowRight", "ArrowRight", "ArrowRight"], every: 700 },
      },
    ],
  },
  // „Was brauche ich?“, „Stampfen und pusten“: the picked card stays where it stands, the others going pale, while
  // the two slow breaths are said (the breath's circle round a big face is gone, November 2026).
  {
    name: "was-brauche-ich-pusten",
    path: "/wie-gehts-dir/",
    parts: [
      {
        label: "Stampfen und pusten",
        // The start screen's second card „Was brauche ich?“ first, then its card.
        before: [
          { eval: "location.assign('/wie-gehts-dir/')" },
          { wait: 4000 },
          { tap: ".screen-hint-button", optional: true },
          { wait: 500 },
          { waitFor: ".mode-picker li:nth-child(2) button" },
          { tap: ".mode-picker li:nth-child(2) button" },
          { wait: 1500 },
          { waitFor: '.fg-card[aria-label="Stampfen und pusten"]' },
          { tap: '.fg-card[aria-label="Stampfen und pusten"]' },
        ],
        ms: 6000,
      },
    ],
  },
  { name: "schatten", path: "/schatten/", parts: [{ label: "Schatten finden", before: [{ wait: 1500 }], ms: 8000, tap: TAPS }] },
  {
    name: "socken",
    path: "/socken/",
    parts: [
      { label: "Waschen", before: [{ wait: 500 }], ms: 8000 },
      { label: "Socken paaren", ms: 8000, tap: TAPS },
    ],
  },
  { name: "kettenreaktion", path: "/kettenreaktion/", parts: [{ label: "Erstes Level", before: [START, { wait: 1500 }], ms: 10000, tap: TAPS }] },
  {
    // The marble run's camera following three things down the wall (the barrier always up): the picture that
    // moves most, and stuttered on phones while the camera was a changing viewBox.
    name: "kugelbahn",
    path: "/kettenreaktion/",
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
        before: [
          { eval: `[...document.querySelectorAll(".mode-card")].find((c) => c.textContent.includes("Große Maschine")).click()` },
          { wait: 1500 },
          ...key(" "),
        ],
        ms: 12000,
      },
    ],
  },
  ...KETTEN_LEVELS.map(chainLevel),
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
  // The fire brigade story: its opening flies over the town, and the hose (the fifth step, after the pump) is its
  // busiest place (hose, water, smoke).
  {
    name: "feuerwehr",
    path: "/abenteuer/feuerwehr/",
    parts: [
      { label: "Flug über die Stadt", before: [{ tap: ".screen-hint-button", optional: true }, { wait: 3000 }], ms: 10000 },
      // The arms glow there like at the drums, so the same decision holds: 60 fps (p95 17 ms) at about 65 % busy (November 2026).
      { label: "Schlauch", before: [...key("ArrowRight", 5), { wait: 4000 }], ms: 10000, budget: { busy: 0.95 } },
    ],
  },
];
