// The sounds of the videos drawn frame by frame (intro, outro), made of notes and noise like the app's own sounds
// (src/lib/sfx), but laid out on time lines of their own: the same schedule plays live through the app's one audio
// context (which `silent` keeps quiet in Claude's preview) and is rendered into a file by an OfflineAudioContext for
// `bun run video`, which plays nothing.

/** A soft bell, like a music box: a sine with a quiet octave and a quieter bright partial, dying away slowly. */
export function bell(ac: BaseAudioContext, out: AudioNode, at: number, freq: number, volume: number, seconds = 1.6) {
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
export function knock(ac: BaseAudioContext, out: AudioNode, at: number, from: number, to: number, volume: number, seconds = 0.12) {
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
export function rush(ac: BaseAudioContext, out: AudioNode, at: number, seconds: number, from: number, to: number, volume: number, q = 0.7) {
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

// C major, the app's pentatonic notes: nothing in a motif can sound wrong.
export const C4 = 261.63;
export const C5 = 523.25;
export const E5 = 659.25;
export const G5 = 783.99;
export const C6 = 1046.5;

export const D5 = 587.33;
export const A5 = 880;

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
