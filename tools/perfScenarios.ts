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
}

export const BUDGET: Budget = { p95: 34, stuttersPerS: 0.5, busy: 0.6 };

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
];
