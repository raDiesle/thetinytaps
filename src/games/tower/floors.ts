import { ROW, TOTAL } from "./names";

// The house's ten floors, one for each ten (user request, 24 November 2026: every new ten should look new and more
// interesting, not every block the same – a door or a window built in between the numbers). Each floor has its own
// colours, its own pattern on the plain blocks and its own beam laid on top when it is full; a few of its blocks are
// something of the house that answers as it lands, each with its own sound.

/** What is painted on a floor's plain blocks. */
export type Pattern = "bricks" | "dots" | "stones" | "stripes" | "stars" | "planks" | "logs" | "hearts" | "glass" | "rainbow";

/**
 * A block that is part of the house rather than a plain block: the front door, a window whose light goes on, an animal
 * looking out, flowers growing in their box … Each shows its number on a small plate and does its thing once as it
 * lands; afterwards it stays as it ended (the light on, the cat in the window).
 */
export type Special = "door" | "window" | "cat" | "dog" | "birdhouse" | "flowers" | "fish" | "heart" | "star";

/** One floor of the house: the ten numbers from `first + 1` to `first + 10`. */
export interface Floor {
  /** The blocks' colours, in turn from the left. */
  colors: string[];
  pattern: Pattern;
  /** The wooden beam laid over the floor when its ten are full. */
  beam: string;
  /** The floor's special blocks, by their place in the row (1 to 10). */
  specials: Partial<Record<number, Special>>;
}

/** The floors from the ground up: 1–10, 11–20 … 91–100. */
export const FLOORS: Floor[] = [
  { colors: ["#f0643c", "#e8553a"], pattern: "bricks", beam: "#ffd43b", specials: { 2: "window", 5: "door", 8: "window" } },
  { colors: ["#4dabf7", "#3bc9db"], pattern: "dots", beam: "#ff6b6b", specials: { 2: "flowers", 5: "cat", 9: "window" } },
  { colors: ["#69db7c", "#8ce99a"], pattern: "stones", beam: "#ff922b", specials: { 3: "birdhouse", 6: "fish", 9: "window" } },
  { colors: ["#ffd43b", "#fcc419"], pattern: "stripes", beam: "#4dabf7", specials: { 2: "window", 5: "dog", 8: "flowers" } },
  { colors: ["#9775fa", "#b197fc"], pattern: "stars", beam: "#51cf66", specials: { 4: "heart", 7: "star" } },
  { colors: ["#ffa94d", "#ff922b"], pattern: "planks", beam: "#cc5de8", specials: { 2: "cat", 5: "window", 8: "birdhouse" } },
  { colors: ["#c08552", "#a9714b"], pattern: "logs", beam: "#f783ac", specials: { 3: "fish", 6: "window", 9: "flowers" } },
  { colors: ["#f783ac", "#faa2c1"], pattern: "hearts", beam: "#20c997", specials: { 2: "heart", 5: "dog", 8: "window" } },
  { colors: ["#a5d8ff", "#99e9f2"], pattern: "glass", beam: "#fab005", specials: { 2: "star", 5: "window", 8: "cat" } },
  {
    colors: ["#ff6b6b", "#ff922b", "#ffd43b", "#8ce99a", "#38d9a9", "#4dabf7", "#748ffc", "#b197fc", "#f783ac", "#fcc419"],
    pattern: "rainbow",
    beam: "#e8590c",
    specials: { 3: "window", 6: "flowers", 9: "heart" },
  },
];

/** The floor of number `n` (0 for 1–10 … 9 for 91–100). */
export const floorOf = (n: number) => Math.floor((Math.min(Math.max(n, 1), TOTAL) - 1) / ROW);

/** Number `n`'s place in its row, 1 to 10. */
export const placeOf = (n: number) => ((n - 1) % ROW) + 1;

/** What number `n` is: a plain block or one of the house's specials. */
export const specialOf = (n: number): Special | undefined => FLOORS[floorOf(n)].specials[placeOf(n)];

/** The colour of number `n`'s block. */
export function colorOf(n: number): string {
  const { colors } = FLOORS[floorOf(n)];
  return colors[(placeOf(n) - 1) % colors.length];
}
