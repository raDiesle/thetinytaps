import { COVERS } from "../intro/IntroScene";
import { A5, bell, C4, C5, C6, D5, E5, G5, knock, rush } from "../sound";
import { OUTRO_BEATS } from "./timeline";

// The outro's sound on its own time line, from the notes and noise of `../sound.ts`: the intro's sounds backwards
// where its motion is backwards, then a note for each book that lights up and the intro's motif again for the card.

/** How long the last chord rings as the code comes. */
const CHORD_SECONDS = 2.2;

/** One rising note for each picture book as it lights up, the app's pentatonic C major. */
const TOUR_NOTES = [C5, D5, E5, G5];

/**
 * Lays the outro's sound onto `ac`, starting at `at` seconds of its clock, into `out`: the cover closing (paper rushing
 * the other way, then a soft clap), the book's rush back into its gap and a knock as it stands, a note for each book
 * lighting up, then Fun – for – Both as the card comes and a warm chord with the code.
 */
export function scheduleOutroSound(ac: BaseAudioContext, out: AudioNode, at: number) {
  const s = (seconds: number) => at + seconds;
  const [closeFrom, closeTo] = OUTRO_BEATS.close;
  const close = closeTo - closeFrom;
  rush(ac, out, s(closeFrom), close * 0.55, 1200, 2800, 0.08, 0.7);
  rush(ac, out, s(closeFrom + close * 0.4), close * 0.45, 3000, 900, 0.09, 0.6);
  knock(ac, out, s(closeTo - 0.06), 170, 95, 0.26);
  const [backFrom, backTo] = OUTRO_BEATS.back;
  rush(ac, out, s(backFrom), backTo - backFrom, 1400, 420, 0.07, 0.6);
  knock(ac, out, s(OUTRO_BEATS.settle[0] + 0.05), 200, 115, 0.32, 0.14);
  const tourStep = (OUTRO_BEATS.tour[1] - OUTRO_BEATS.tour[0]) / COVERS.length;
  COVERS.forEach((_, k) => {
    bell(ac, out, s(OUTRO_BEATS.tour[0] + k * tourStep + 0.04), TOUR_NOTES[k] ?? A5, 0.12, 1.2);
  });
  // The card comes: the intro's three notes again, so beginning and end belong together.
  const card = OUTRO_BEATS.card[0] + 0.2;
  bell(ac, out, s(card), E5, 0.15);
  bell(ac, out, s(card + 0.28), G5, 0.15);
  bell(ac, out, s(card + 0.56), C6, 0.16, 2);
  const chord = s(OUTRO_BEATS.code[0] + 0.1);
  bell(ac, out, chord, C4, 0.11, CHORD_SECONDS);
  bell(ac, out, chord + 0.02, C5, 0.08, CHORD_SECONDS);
  bell(ac, out, chord + 0.04, E5, 0.06, CHORD_SECONDS);
  bell(ac, out, chord + 0.06, G5, 0.06, CHORD_SECONDS);
}

/** The last moment any of the outro's sounds still rings, in seconds from its start. */
export const OUTRO_SOUND_END = OUTRO_BEATS.code[0] + 0.1 + 0.06 + CHORD_SECONDS + 0.05;
