// Tunes, notes and game sounds (jumps, pops, chimes, sparkles).

import { PENTATONIC, hiss, note, tone } from "./core";

/** A springy jump. */
export function playBoing() {
  note({ from: 180, to: 620, duration: 0.4, type: "triangle", volume: 0.3 });
}

/** A short happy tune from the radio. */
export function playMelody() {
  [0, 2, 4, 2, 5, 4].forEach((step, i) => note({ from: PENTATONIC[step], duration: 0.22, type: "triangle", volume: 0.18, delay: i * 0.24 }));
}

/** A pop, as if something jumps out of a hole. */
export function playPop() {
  note({ from: 300, to: 1100, duration: 0.12, type: "sine", volume: 0.3 });
}

/** A random soft note, used for shapes and bubbles. */
export function playRandomNote() {
  const freq = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
  tone(freq, 0.6, "sine", 0.25);
}

/** A rising note for the i-th counted item, so counting "climbs". */
export function playCountNote(i: number) {
  tone(PENTATONIC[i % PENTATONIC.length], 0.35, "triangle", 0.2);
}

/** "Dong" – the i-th note struck by something heavy: two octaves lower, long and dull. */
export function playDeepNote(i: number) {
  note({ from: PENTATONIC[i % PENTATONIC.length] / 4, duration: 0.7, type: "triangle", volume: 0.4, lowpass: 700 });
}

/** A short two-note chime when a new letter appears. */
export function playChime() {
  tone(PENTATONIC[2], 0.4, "sine", 0.2);
  setTimeout(() => tone(PENTATONIC[5], 0.5, "sine", 0.2), 90);
}

/** A cheerful brushing tune in steps of the pentatonic scale; null is a rest. */
const TUNE = [0, 2, 4, 4, 5, 4, 2, null, 1, 3, 4, 3, 2, null, null, null, 0, 2, 4, 4, 5, 4, 5, 6, 7, 5, 4, 2, 0, null, null, null];
const TUNE_BASS = [130.81, 196.0, 146.83, 196.0];

/** The i-th beat of the brushing tune, which loops; a soft bass note starts every bar. */
export function playTuneNote(i: number) {
  const step = TUNE[i % TUNE.length];
  if (step !== null) note({ from: PENTATONIC[step], duration: 0.26, type: "triangle", volume: 0.12 });
  if (i % 4 === 0) note({ from: TUNE_BASS[Math.floor(i / 4) % TUNE_BASS.length], duration: 0.9, type: "sine", volume: 0.14 });
}

/** A calm waiting tune for sitting on the potty, in four bars of four beats; null is a rest. */
const WAIT_TUNE = [4, 4, 2, null, 4, 4, 2, null, 5, 4, 3, 2, 1, null, 0, null];
const WAIT_BASS = [130.81, 174.61, 196.0, 130.81];

/** The i-th beat of the waiting tune (0 to 15); a soft bass note starts every bar. */
export function playWaitNote(i: number) {
  const step = WAIT_TUNE[i % WAIT_TUNE.length];
  if (step !== null) note({ from: PENTATONIC[step], duration: 0.4, type: "triangle", volume: 0.13 });
  if (i % 4 === 0) note({ from: WAIT_BASS[Math.floor(i / 4) % WAIT_BASS.length], duration: 1.4, type: "sine", volume: 0.14 });
}

/** Beats in the waiting tune. */
export const WAIT_BEATS = WAIT_TUNE.length;

/** "Puff!" – a little monster vanishes in a cloud, with a sparkle after. */
export function playPoof() {
  note({ from: 900, to: 180, duration: 0.25, type: "sine", volume: 0.25 });
  note({ from: PENTATONIC[7] * 2, duration: 0.3, type: "sine", volume: 0.08, delay: 0.18 });
}

/** A slow, soft lullaby falling down the scale, for good night. */
export function playLullaby() {
  [5, 4, 2, 3, 1, 0].forEach((step, i) => note({ from: PENTATONIC[step], duration: 0.9, type: "sine", volume: 0.12, delay: i * 0.6 }));
}

/** Funkel, funkel: quick high notes, like a star glittering. */
export function playTwinkle() {
  [7, 5, 6, 4, 7].forEach((step, i) => note({ from: PENTATONIC[step] * 2, duration: 0.25, type: "sine", volume: 0.08, delay: i * 0.09 }));
}

/** "Wusch!" – something flies past: a soft sweep up and down. */
export function playWhoosh() {
  note({ from: 300, to: 1600, duration: 0.35, type: "sawtooth", volume: 0.05, lowpass: 1400 });
  note({ from: 1600, to: 200, duration: 0.5, type: "sine", volume: 0.1, delay: 0.3 });
}

/** "Trrrillll!" – a whistle with a rolling pea inside. */
export function playTrill() {
  [0, 0.55].forEach((start, n) => {
    for (let i = 0; i < (n ? 8 : 4); i++) note({ from: i % 2 ? 2350 : 2150, duration: 0.05, type: "sine", volume: 0.12, delay: start + i * 0.045 });
  });
}

/** "Ding!" – a small bright bell that rings out. */
export function playDing() {
  note({ from: 1568, duration: 1.3, type: "sine", volume: 0.22 });
  note({ from: 3920, duration: 0.5, type: "sine", volume: 0.05 });
}

/** "Wirrr" – a marble running round and round a funnel, getting faster and lower. */
export function playSwirl() {
  for (let i = 0; i < 12; i++) note({ from: 1000 - i * 55, to: 940 - i * 55, duration: 0.1, type: "sine", volume: 0.07, delay: i * (0.16 - i * 0.006) });
}

/** "Bumm!" – a big toy drum. */
export function playDrum() {
  note({ from: 150, to: 48, duration: 0.6, type: "sine", volume: 0.55 });
  hiss({ from: 900, to: 200, duration: 0.25, volume: 0.18, q: 0.6 });
}

/** One second of a snare drum roll, louder with each `i` (0, 1, 2 …): "trrrrr" building up to something. */
export function playDrumRoll(i: number) {
  const hits = 18;
  for (let k = 0; k < hits; k++) {
    const volume = (0.06 + 0.05 * i + (0.04 * k) / hits) * (0.85 + 0.3 * Math.random());
    hiss({ from: 2600, to: 1700, duration: 0.07, volume, delay: k / hits, q: 0.8 });
    note({ from: 210, to: 170, duration: 0.05, type: "triangle", volume: volume * 0.6, delay: k / hits });
  }
}

/** "Tusch!" – the end of a drum roll: a big drum, a cymbal and a bright chord. */
export function playTusch() {
  note({ from: 140, to: 45, duration: 0.7, type: "sine", volume: 0.55 });
  hiss({ from: 7000, to: 3500, duration: 1.4, volume: 0.22, q: 0.4 });
  [0, 2, 3, 5].forEach((step) => note({ from: PENTATONIC[step], duration: 1.1, type: "triangle", volume: 0.1 }));
}

/** "Bumm, bamm, bimm" – toy drums from big and low (0) to small and high. */
export function playDrumNote(i: number) {
  const pitch = 130 * 1.4 ** i;
  note({ from: pitch, to: pitch * 0.4, duration: 0.45, type: "sine", volume: 0.5 });
  hiss({ from: 900 + i * 300, to: 250, duration: 0.18, volume: 0.14, q: 0.6 });
}

/** "Plinng" – a hanging metal chime, low (0) to high, ringing on softly. */
export function playChimeNote(i: number) {
  const freq = PENTATONIC[i % PENTATONIC.length];
  note({ from: freq, duration: 1.6, type: "sine", volume: 0.16 });
  note({ from: freq * 2.76, duration: 0.5, type: "sine", volume: 0.04 });
}

/** "Pling, pling" – a music box: slow, high, bell-like notes of a lullaby. */
export function playMusicbox() {
  [4, 2, 4, 2, 1, 0].forEach((step, i) => {
    note({ from: PENTATONIC[step] * 2, duration: 0.6, type: "sine", volume: 0.1, delay: i * 0.3 });
    note({ from: PENTATONIC[step] * 4, duration: 0.25, type: "sine", volume: 0.025, delay: i * 0.3 });
  });
}

/** "Plink" – a marble on a nail: a short, bright note of the pentatonic scale, low (0) to high. */
export function playPlink(i: number) {
  const freq = PENTATONIC[i % PENTATONIC.length];
  note({ from: freq, duration: 0.3, type: "triangle", volume: 0.12 });
  note({ from: freq * 3, duration: 0.07, type: "sine", volume: 0.04 });
}
