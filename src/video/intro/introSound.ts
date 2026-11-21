import { BEATS } from "./timeline";

// The intro's sound, made of notes and noise like the app's own sounds (src/lib/sfx), but laid out on a time line of
// its own: the same schedule plays live through the app's one audio context (`IntroVideo`, which `silent` keeps quiet in
// Claude's preview) and is rendered into a file by an OfflineAudioContext for `bun run video intro`, which plays nothing.

/** A soft bell, like a music box: a sine with a quiet octave and a quieter bright partial, dying away slowly. */
function bell(ac: BaseAudioContext, out: AudioNode, at: number, freq: number, volume: number, seconds = 1.6) {
  for (const [ratio, share] of [
    [1, 1],
    [2, 0.28],
    [3.01, 0.08],
  ] as const) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = freq * ratio;
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(volume * share, at + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + seconds / ratio);
    osc.connect(gain).connect(out);
    osc.start(at);
    osc.stop(at + seconds + 0.05);
  }
}

/** A short low knock or tap, a pitch falling quickly (a book set down, a paw on paper). */
function knock(ac: BaseAudioContext, out: AudioNode, at: number, from: number, to: number, volume: number, seconds = 0.12) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + seconds);
  gain.gain.setValueAtTime(volume, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + seconds);
  osc.connect(gain).connect(out);
  osc.start(at);
  osc.stop(at + seconds + 0.02);
}

/** The same noise every time (a fixed seed), so every rendering of the intro sounds alike. */
function noiseBuffer(ac: BaseAudioContext, seconds: number) {
  const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * seconds), ac.sampleRate);
  const data = buffer.getChannelData(0);
  let seed = 12345;
  for (let i = 0; i < data.length; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    data[i] = (seed / 0x7fffffff) * 2 - 1;
  }
  return buffer;
}

/** Paper or air rushing: noise through a band that sweeps from `from` to `to` Hz, swelling and fading. */
function rush(ac: BaseAudioContext, out: AudioNode, at: number, seconds: number, from: number, to: number, volume: number, q = 0.7) {
  const source = ac.createBufferSource();
  source.buffer = noiseBuffer(ac, seconds);
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = q;
  band.frequency.setValueAtTime(from, at);
  band.frequency.exponentialRampToValueAtTime(to, at + seconds);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(volume, at + seconds * 0.4);
  gain.gain.linearRampToValueAtTime(0, at + seconds);
  source.connect(band).connect(gain).connect(out);
  source.start(at);
}

/** How long the chord rings as the foxes sit down. */
const CHORD_SECONDS = 2;

// C major, the app's pentatonic notes: nothing in the motif can sound wrong.
const C4 = 261.63;
const C5 = 523.25;
const E5 = 659.25;
const G5 = 783.99;
const C6 = 1046.5;

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

/** Writes rendered sound as a 16-bit WAV file. */
export function wavBytes(buffer: AudioBuffer): Uint8Array {
  const channels = buffer.numberOfChannels;
  const frames = buffer.length;
  const bytes = new Uint8Array(44 + frames * channels * 2);
  const view = new DataView(bytes.buffer);
  const text = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
  };
  text(0, "RIFF");
  view.setUint32(4, 36 + frames * channels * 2, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, frames * channels * 2, true);
  const data = Array.from({ length: channels }, (_, c) => buffer.getChannelData(c));
  let offset = 44;
  for (let i = 0; i < frames; i++)
    for (let c = 0; c < channels; c++) {
      const sample = Math.max(-1, Math.min(1, data[c]![i]!));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  return bytes;
}

/** Renders the intro's sound without playing it (for the video file): `seconds` long, at 48 kHz in stereo. */
export async function renderIntroSound(seconds: number): Promise<AudioBuffer> {
  const ac = new OfflineAudioContext(2, Math.ceil(48000 * seconds), 48000);
  const limiter = ac.createDynamicsCompressor();
  limiter.threshold.value = -3;
  limiter.ratio.value = 20;
  limiter.connect(ac.destination);
  scheduleIntroSound(ac, limiter, 0);
  return ac.startRendering();
}
