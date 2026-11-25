import type { TargetLanguageId } from "@/content/targetLanguages";

/**
 * „Kugel-Lied“ (K-11): the eight bars of row 1 are tuned so that each thing rolling over them plays the next line of a
 * well-known children's song, and things one after the other play the whole song. Each line is eight beats, one per
 * bar – four on row 1a, four on row 1b after the first spot –, a note or `null` where the note before it is held.
 */
export interface Song {
  /** What it is, for grown-ups reading the code and the tests. */
  name: string;
  /** Each line's eight beats in Hz; `null` holds the note before it on. */
  lines: (number | null)[][];
}

/** The notes the songs use, C5 to A5 like the run's pentatonic bars. */
const C = 523.25;
const D = 587.33;
const E = 659.25;
const F = 698.46;
const G = 783.99;
const A = 880.0;
const _ = null;

/** The beats a line has: one per bar of row 1. */
export const SONG_BEATS = 8;

/** „Alle meine Entchen“, the song every German child knows (traditional, 19th century). */
const ENTCHEN: Song = {
  name: "Alle meine Entchen",
  lines: [
    [C, D, E, F, G, _, G, _],
    [A, A, A, A, G, _, _, _],
    [A, A, A, A, G, _, _, _],
    [F, F, F, F, E, _, E, _],
    [D, D, D, D, C, _, _, _],
  ],
};

/**
 * „Twinkle, Twinkle, Little Star“ (the French tune „Ah ! vous dirai-je, maman“, 18th century): known as 小星星, „Estrellita,
 * ¿dónde estás?“, the alphabet song and in nurseries from India to Russia, so it is the song for every other language.
 */
const TWINKLE: Song = {
  name: "Twinkle, Twinkle, Little Star",
  lines: [
    [C, C, G, G, A, A, G, _],
    [F, F, E, E, D, D, C, _],
    [G, G, F, F, E, E, D, _],
    [G, G, F, F, E, E, D, _],
    [C, C, G, G, A, A, G, _],
    [F, F, E, E, D, D, C, _],
  ],
};

/** The song a child of this app language knows best: German children „Alle meine Entchen“, everyone else „Twinkle, Twinkle“. */
export function songFor(language: TargetLanguageId): Song {
  return language === "de" ? ENTCHEN : TWINKLE;
}

/** Every song, for the tests. */
export const SONGS = [ENTCHEN, TWINKLE];

/**
 * The note a beat strikes and how many beats it rings (itself and the held ones after it), or null on a held beat,
 * where the bar lights up while the note before it still sounds.
 */
export function songBeat(line: (number | null)[], beat: number): { freq: number; beats: number } | null {
  const freq = line[beat];
  if (freq == null) return null;
  let beats = 1;
  while (beat + beats < line.length && line[beat + beats] == null) beats++;
  return { freq, beats };
}
