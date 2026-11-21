import { bell, C4, C5, C6, E5, G5, knock, rush } from "../sound";
import { BEATS } from "./timeline";

// The intro's sound on its own time line, from the notes and noise of `../sound.ts`.

/** How long the chord rings as the foxes sit down. */
const CHORD_SECONDS = 2;

/**
 * Lays the intro's sound onto `ac`, starting at `at` seconds of its clock, into `out`: a soft knock as the book tips,
 * its rush out of the shelf, the cover's page-turn, a rising three-note motif as the name is printed (Fun – for – Both),
 * a little patter of paws along the tracks, and a warm chord as the foxes sit down.
 */
export function scheduleIntroSound(ac: BaseAudioContext, out: AudioNode, at: number) {
  const s = (seconds: number) => at + seconds;
  knock(ac, out, s(BEATS.tip[0] + 0.05), 210, 120, 0.35, 0.14);
  rush(ac, out, s(BEATS.out[0]), BEATS.out[1] - BEATS.out[0], 420, 1400, 0.07, 0.6);
  // The cover turning over, as the app's page-turn (playPageTurn): paper rushing past, then landing softly.
  const open = BEATS.open[1] - BEATS.open[0];
  rush(ac, out, s(BEATS.open[0]), open * 0.55, 900, 3200, 0.1, 0.6);
  rush(ac, out, s(BEATS.open[0] + open * 0.45), open * 0.4, 2600, 1200, 0.07, 0.8);
  knock(ac, out, s(BEATS.open[0] + open * 0.88), 160, 90, 0.22);
  // Fun – for – Both: one note with each word as it is printed.
  const letters = BEATS.letters[1] - BEATS.letters[0];
  bell(ac, out, s(BEATS.letters[0] + letters * 0.05), E5, 0.16);
  bell(ac, out, s(BEATS.letters[0] + letters * 0.32), G5, 0.16);
  bell(ac, out, s(BEATS.letters[0] + letters * 0.6), C6, 0.17, 2);
  // Paws patting along the tracks, the big one lower, the small one higher.
  const tracks = BEATS.tracks[1] - BEATS.tracks[0];
  for (let i = 0; i < 6; i++) {
    const big = i % 2 === 0;
    knock(ac, out, s(BEATS.tracks[0] + (tracks * (i + 0.5)) / 6), big ? 330 : 480, big ? 220 : 330, 0.13, 0.06);
  }
  // The foxes sit down: a soft, warm chord that rings out.
  const land = s(BEATS.foxes[0] + 0.12);
  bell(ac, out, land, C4, 0.12, CHORD_SECONDS);
  bell(ac, out, land + 0.02, C5, 0.09, CHORD_SECONDS);
  bell(ac, out, land + 0.04, E5, 0.07, CHORD_SECONDS);
  bell(ac, out, land + 0.06, G5, 0.07, CHORD_SECONDS);
  bell(ac, out, land + 0.08, C6, 0.05, CHORD_SECONDS);
}

/** The last moment any of the intro's sounds still rings, in seconds from its start. */
export const INTRO_SOUND_END = BEATS.foxes[0] + 0.12 + 0.08 + CHORD_SECONDS + 0.05;
