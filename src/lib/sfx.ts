// Small synthesized sound effects, so no audio files are needed.

// C-major pentatonic: any sequence of these notes sounds pleasant.
const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];

let ctx: AudioContext | null = null;
let masterVolume = 1;

function audio(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  ctx ??= new AudioContext();
  return ctx;
}

/** Scales all effects, e.g. 0.4 for calm mode. */
export function setSfxVolume(volume: number) {
  masterVolume = volume;
}

/** Must be called from a user gesture so the browser allows audio. */
export function unlockAudio() {
  void audio()?.resume();
}

function tone(freq: number, duration: number, type: OscillatorType, volume: number) {
  const ac = audio();
  if (!ac) return;
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume * masterVolume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + duration);
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

/** A short two-note chime when a new letter appears. */
export function playChime() {
  tone(PENTATONIC[2], 0.4, "sine", 0.2);
  setTimeout(() => tone(PENTATONIC[5], 0.5, "sine", 0.2), 90);
}
