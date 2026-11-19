// „Farbenbahn“ (K-10): the three colours a marble can have, its tube at the end
// of the run and what the voice says as one lands there. Plain data, so the
// management page and the recording script read the lines without the drawing.

import type { TargetLanguageId } from "@/content/targetLanguages";
import type { Localized } from "@/lib/language";
import { BALL_R, type Pt } from "./path";
import { TRACK_H } from "./track";

/** One colour of the run and what it looks like. */
export interface SortColor {
  id: "red" | "yellow" | "blue";
  /** The marble's colour. */
  fill: string;
  /** A light tint of it, for the inside of its tube. */
  tint: string;
}

/** Red, yellow and blue, in their order on the shelf and in the tubes, left to right. */
export const SORT_COLORS: SortColor[] = [
  { id: "red", fill: "#ff4d4d", tint: "#ffd9d9" },
  { id: "yellow", fill: "#ffd23f", tint: "#fff3c4" },
  { id: "blue", fill: "#3a86ff", tint: "#d6e6ff" },
];

/** Marbles of one colour that fill its tube; the first full tube ends the run. */
export const TUBE_FULL = 5;

/** The tubes at the bottom right of the wall, where the wooden run has its basket: their middles, bottoms and tops. */
export const TUBES = {
  x: [1338, 1424, 1510],
  /** The inside's bottom, well above the wall's lower edge, which the screen's frame and corners cut on some screens. */
  bottom: TRACK_H - 60,
  /** Inner half width: a marble and a little room. */
  half: 28,
  /** One marble on top of the other. */
  step: 2 * BALL_R + 1,
};

/** The tubes' rim, with room for `TUBE_FULL` marbles and a little more. */
export const TUBE_TOP = TUBES.bottom - TUBE_FULL * TUBES.step - 14;

/** Where the n-th marble (0 first) of the i-th colour comes to rest in its tube; more than fit pile up out of its top. */
export const tubeSlot = (tube: number, n: number): Pt => ({ x: TUBES.x[tube], y: TUBES.bottom - BALL_R - 1 - n * TUBES.step });

/**
 * „Drei rote!“ in every language, by colour (red, yellow, blue) and count (1 to 5): a marble is „Kugel“ (feminine), „canica“
 * (feminine), „шарик“, „कंचा“ (masculine), „كرة“ (feminine, one and two by the noun's own forms) and „颗“ in Chinese.
 */
const COUNTS: { de: string[][] } & Partial<Record<TargetLanguageId, string[][]>> = {
  de: [
    ["Eine rote!", "Zwei rote!", "Drei rote!", "Vier rote!", "Fünf rote!"],
    ["Eine gelbe!", "Zwei gelbe!", "Drei gelbe!", "Vier gelbe!", "Fünf gelbe!"],
    ["Eine blaue!", "Zwei blaue!", "Drei blaue!", "Vier blaue!", "Fünf blaue!"],
  ],
  en: [
    ["One red!", "Two red!", "Three red!", "Four red!", "Five red!"],
    ["One yellow!", "Two yellow!", "Three yellow!", "Four yellow!", "Five yellow!"],
    ["One blue!", "Two blue!", "Three blue!", "Four blue!", "Five blue!"],
  ],
  zh: [
    ["一颗红的！", "两颗红的！", "三颗红的！", "四颗红的！", "五颗红的！"],
    ["一颗黄的！", "两颗黄的！", "三颗黄的！", "四颗黄的！", "五颗黄的！"],
    ["一颗蓝的！", "两颗蓝的！", "三颗蓝的！", "四颗蓝的！", "五颗蓝的！"],
  ],
  hi: [
    ["एक लाल!", "दो लाल!", "तीन लाल!", "चार लाल!", "पाँच लाल!"],
    ["एक पीला!", "दो पीले!", "तीन पीले!", "चार पीले!", "पाँच पीले!"],
    ["एक नीला!", "दो नीले!", "तीन नीले!", "चार नीले!", "पाँच नीले!"],
  ],
  es: [
    ["¡Una roja!", "¡Dos rojas!", "¡Tres rojas!", "¡Cuatro rojas!", "¡Cinco rojas!"],
    ["¡Una amarilla!", "¡Dos amarillas!", "¡Tres amarillas!", "¡Cuatro amarillas!", "¡Cinco amarillas!"],
    ["¡Una azul!", "¡Dos azules!", "¡Tres azules!", "¡Cuatro azules!", "¡Cinco azules!"],
  ],
  ar: [
    ["كرة حمراء واحدة!", "كرتان حمراوان!", "ثلاث كرات حمراء!", "أربع كرات حمراء!", "خمس كرات حمراء!"],
    ["كرة صفراء واحدة!", "كرتان صفراوان!", "ثلاث كرات صفراء!", "أربع كرات صفراء!", "خمس كرات صفراء!"],
    ["كرة زرقاء واحدة!", "كرتان زرقاوان!", "ثلاث كرات زرقاء!", "أربع كرات زرقاء!", "خمس كرات زرقاء!"],
  ],
  ru: [
    ["Один красный!", "Два красных!", "Три красных!", "Четыре красных!", "Пять красных!"],
    ["Один жёлтый!", "Два жёлтых!", "Три жёлтых!", "Четыре жёлтых!", "Пять жёлтых!"],
    ["Один синий!", "Два синих!", "Три синих!", "Четыре синих!", "Пять синих!"],
  ],
};

/** What the voice says as the n-th marble (from 1) of the i-th colour lands: „Drei rote!“. Past five it says nothing. */
export const countLine = (tube: number, n: number): Localized | null =>
  n >= 1 && n <= TUBE_FULL ? (Object.fromEntries(Object.entries(COUNTS).map(([language, lines]) => [language, lines[tube][n - 1]])) as Localized) : null;

/** Every counting line, for the recordings (`voiceLines.ts`). */
export const COUNT_LINES: Localized[] = SORT_COLORS.flatMap((_, tube) => COUNTS.de[tube].map((_, n) => countLine(tube, n + 1))).filter(
  (l): l is Localized => !!l,
);

/** Said once a tube is full, after its last count. */
export const TUBE_FULL_LINE: Localized = {
  de: "Die Röhre ist voll!",
  en: "The tube is full!",
  zh: "管子满啦！",
  hi: "नली भर गई!",
  es: "¡El tubo está lleno!",
  ar: "امتلأ الأنبوب!",
  ru: "Трубка полная!",
};
