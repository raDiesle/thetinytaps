import { ROW, TOTAL } from "./names";

// The house's ten floors, one for each ten (user request, 24 November 2026: every new ten should look new and more
// interesting). Each floor has its own colours, its own pattern on its blocks and its own beam laid on top when it is
// full, so the tens are seen at a glance. And no block looks like another (user feedback, 25 November 2026): each wears
// a dressing of its own – ears, headphones, spikes, a crown, wheels … – round its number, never over it.

/** What is painted on a floor's blocks. */
export type Pattern = "bricks" | "dots" | "stones" | "stripes" | "stars" | "planks" | "logs" | "hearts" | "glass" | "rainbow";

/**
 * What a block wears round its number: something on its top, at its sides or its foot, its outline or what fills it
 * behind the number (water the number swims in). Never anything over the number nor a smaller number: every number
 * stands alike, the same size and place on every block (user feedback, 25 November 2026: the windows and the door
 * shrank their numbers onto little plates). Each comes as its block lands, with its own sound where it has one.
 */
export const DRESSINGS = [
  "cat",
  "headphones",
  "crown",
  "wheels",
  "spikes",
  "flowers",
  "water",
  "antennae",
  "bowtie",
  "bunny",
  "cake",
  "shoes",
  "wings",
  "propeller",
  "gift",
  "frog",
  "lights",
  "dino",
  "bear",
  "nest",
] as const;

/** One of the blocks' dressings. */
export type Dressing = (typeof DRESSINGS)[number];

/** One floor of the house: the ten numbers from `first + 1` to `first + 10`. */
export interface Floor {
  /** The blocks' colours, in turn from the left. */
  colors: string[];
  pattern: Pattern;
  /** The wooden beam laid over the floor when its ten are full. */
  beam: string;
}

/** The floors from the ground up: 1–10, 11–20 … 91–100. */
export const FLOORS: Floor[] = [
  { colors: ["#f0643c", "#e8553a"], pattern: "bricks", beam: "#ffd43b" },
  { colors: ["#4dabf7", "#3bc9db"], pattern: "dots", beam: "#ff6b6b" },
  { colors: ["#69db7c", "#8ce99a"], pattern: "stones", beam: "#ff922b" },
  { colors: ["#ffd43b", "#fcc419"], pattern: "stripes", beam: "#4dabf7" },
  { colors: ["#9775fa", "#b197fc"], pattern: "stars", beam: "#51cf66" },
  { colors: ["#ffa94d", "#ff922b"], pattern: "planks", beam: "#cc5de8" },
  { colors: ["#c08552", "#a9714b"], pattern: "logs", beam: "#f783ac" },
  { colors: ["#f783ac", "#faa2c1"], pattern: "hearts", beam: "#20c997" },
  { colors: ["#a5d8ff", "#99e9f2"], pattern: "glass", beam: "#fab005" },
  {
    colors: ["#ff6b6b", "#ff922b", "#ffd43b", "#8ce99a", "#38d9a9", "#4dabf7", "#748ffc", "#b197fc", "#f783ac", "#fcc419"],
    pattern: "rainbow",
    beam: "#e8590c",
  },
];

/** How far the dressings move on from one floor to the next, so a block never wears what the one under it wears. */
const FLOOR_SHIFT = 7;

/** The floor of number `n` (0 for 1–10 … 9 for 91–100). */
export const floorOf = (n: number) => Math.floor((Math.min(Math.max(n, 1), TOTAL) - 1) / ROW);

/** Number `n`'s place in its row, 1 to 10. */
export const placeOf = (n: number) => ((n - 1) % ROW) + 1;

/** What number `n`'s block wears: the ten of a floor all different, and each unlike its neighbours and the one below. */
export const dressingOf = (n: number): Dressing => DRESSINGS[(placeOf(n) - 1 + floorOf(n) * FLOOR_SHIFT) % DRESSINGS.length];

/** The colour of number `n`'s block. */
export function colorOf(n: number): string {
  const { colors } = FLOORS[floorOf(n)];
  return colors[(placeOf(n) - 1) % colors.length];
}
