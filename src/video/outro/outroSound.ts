import { COVERS } from "../intro/IntroScene";
import { A5, bell, C4, C5, C6, D5, E5, G5, knock, rush } from "../sound";
import { GALLERY_BEATS, HELPER_COUNT, PICTURE_COUNT, STEP } from "./gallery";
import { PINBOARD_BEATS } from "./pinboard";
import { type CardBeats, OUTRO_BEATS } from "./timeline";

/** Two notes below C5 the gallery's games rise from. */
const G4 = 392;
const A4 = 440;

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
  cardSound(ac, out, at, OUTRO_BEATS);
}

/**
 * The end card's sound, alike in every outro: as it comes the intro's three notes again (Fun – for – Both), so beginning
 * and end belong together, and a warm chord with the code.
 */
function cardSound(ac: BaseAudioContext, out: AudioNode, at: number, beats: CardBeats) {
  const card = at + beats.card[0] + 0.2;
  bell(ac, out, card, E5, 0.15);
  bell(ac, out, card + 0.28, G5, 0.15);
  bell(ac, out, card + 0.56, C6, 0.16, 2);
  const chord = at + beats.code[0] + 0.1;
  bell(ac, out, chord, C4, 0.11, CHORD_SECONDS);
  bell(ac, out, chord + 0.02, C5, 0.08, CHORD_SECONDS);
  bell(ac, out, chord + 0.04, E5, 0.06, CHORD_SECONDS);
  bell(ac, out, chord + 0.06, G5, 0.06, CHORD_SECONDS);
}

/** The last moment the end card's chord still rings, in seconds from the start of the outro with these `beats`. */
const cardSoundEnd = (beats: CardBeats) => beats.code[0] + 0.1 + 0.06 + CHORD_SECONDS + 0.05;

/** The last moment any of the outro's sounds still rings, in seconds from its start. */
export const OUTRO_SOUND_END = cardSoundEnd(OUTRO_BEATS);

/** A note of the pentatonic scale for each picture of the gallery: the helpers rising from C5, the games from G4. */
const HELPER_NOTES = [C5, D5, E5, G5, A5, C6];
const GAME_NOTES = [G4, A4, C5, D5, E5, G5];

/**
 * Lays the sound of the outro „Bilder aus den Spielen“ onto `ac`: two soft notes as the two categories come, a rush as
 * the helpers' picture goes into the middle, then for each picture coming out of the depth a soft breath of air and
 * a rising note (a scale for the helpers, another for the games), a rush as the last flies past, and the card's sound.
 */
export function scheduleGallerySound(ac: BaseAudioContext, out: AudioNode, at: number) {
  const s = (seconds: number) => at + seconds;
  bell(ac, out, s(GALLERY_BEATS.categories[0] + 0.1), C5, 0.1, 1.4);
  bell(ac, out, s(GALLERY_BEATS.categories[0] + 0.35), G5, 0.1, 1.4);
  const [splitFrom, splitTo] = GALLERY_BEATS.split;
  rush(ac, out, s(splitFrom), splitTo - splitFrom, 900, 2200, 0.06, 0.6);
  bell(ac, out, s(splitTo - 0.1), HELPER_NOTES[0]!, 0.1, 1.2);
  for (let k = 1; k < PICTURE_COUNT; k++) {
    // The step from picture k − 1 to picture k: it begins once the one before has stood its moment.
    const from = GALLERY_BEATS.run[0] + (k - 1 + 0.45) * STEP;
    rush(ac, out, s(from), STEP * 0.55, 700, 1800, 0.035, 0.6);
    const note = k < HELPER_COUNT ? HELPER_NOTES[k] : GAME_NOTES[k - HELPER_COUNT];
    bell(ac, out, s(from + STEP * 0.4), note ?? A5, 0.1, 1.2);
  }
  const [outFrom, outTo] = GALLERY_BEATS.out;
  rush(ac, out, s(outFrom), outTo - outFrom + 0.2, 1600, 500, 0.06, 0.6);
  cardSound(ac, out, at, GALLERY_BEATS);
}

/** The last moment any of the gallery outro's sounds still rings, in seconds from its start. */
export const GALLERY_SOUND_END = cardSoundEnd(GALLERY_BEATS);

/**
 * Lays the sound of the outro „Pinnwand“ onto `ac`: the photos hang from the first frame, so it begins with the sheet
 * in the middle – a soft swish of paper and the taps of its two pins going into the cork – then the card's sound, Fun –
 * for – Both as the sheet is pinned and a warm chord with the address.
 */
export function schedulePinboardSound(ac: BaseAudioContext, out: AudioNode, at: number) {
  const [from, to] = PINBOARD_BEATS.note;
  rush(ac, out, at + from, (to - from) * 0.7, 2400, 900, 0.03, 0.8);
  knock(ac, out, at + to - 0.04, 820, 180, 0.2, 0.06);
  knock(ac, out, at + to + 0.06, 700, 180, 0.2, 0.06);
  cardSound(ac, out, at, PINBOARD_CARD);
}

/** When the pin board's card sound plays: its bells as the address is pinned, its chord with the line. */
const PINBOARD_CARD: CardBeats = { card: [PINBOARD_BEATS.note[0] - 0.2, PINBOARD_BEATS.note[1]], signs: PINBOARD_BEATS.line, code: PINBOARD_BEATS.line };

/** The last moment any of the pin board outro's sounds still rings, in seconds from its start. */
export const PINBOARD_SOUND_END = cardSoundEnd(PINBOARD_CARD);
