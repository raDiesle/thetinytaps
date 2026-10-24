import { silent } from "../silent";

// The audio context, recorded sounds and the note helpers every synthesized sound is made of.

// C-major pentatonic: any sequence of these notes sounds pleasant.
export const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];

let ctx: AudioContext | null = null;
let masterVolume = 1;

function audio(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  // Silent: the context runs (timing, microphone) but has no speaker to play to.
  // (`sinkId` is not in TypeScript's types yet.)
  ctx ??= silent ? new AudioContext({ sinkId: { type: "none" } } as AudioContextOptions) : new AudioContext();
  return ctx;
}

/** The shared audio context, e.g. to listen to the microphone; unlockAudio() resumes it. */
export function audioContext(): AudioContext | null {
  return audio();
}

/** Scales all effects, e.g. while play time fades out. */
export function setSfxVolume(volume: number) {
  masterVolume = volume;
}

/** Must be called from a user gesture so the browser allows audio. */
export function unlockAudio() {
  void audio()?.resume();
}

// Real recordings for sounds that should sound like the real thing (animals,
// bells, water …), one file per sound name; sources in sounds/README.md.
const files = import.meta.webpackContext("../sounds", { regExp: /\.mp3$/ });
const RECORDING_URLS = new Map<string, string>();
for (const key of files.keys()) {
  const module = files(key) as string | { default: string };
  RECORDING_URLS.set(key.replace(/^\.\//, "").replace(/\.mp3$/, ""), typeof module === "string" ? module : module.default);
}
const recordings = new Map<string, Promise<AudioBuffer | null>>();
const loaded = new Map<string, AudioBuffer>();

/** Starts loading these recordings, so they are ready by the first tap; names without a file are skipped. */
export function loadRecordings(names: Iterable<string>) {
  const ac = audio();
  if (!ac) return;
  for (const name of names) {
    const url = RECORDING_URLS.get(name);
    if (!url || recordings.has(name)) continue;
    const buffer = loadSound(url).then((decoded) => {
      if (decoded) loaded.set(name, decoded);
      return decoded;
    });
    recordings.set(name, buffer);
  }
}

/** Fetches and decodes the sound file at `url`; null without audio or if it fails. */
export async function loadSound(url: string): Promise<AudioBuffer | null> {
  const ac = audio();
  if (!ac) return null;
  try {
    const response = await fetch(url);
    return await ac.decodeAudioData(await response.arrayBuffer());
  } catch {
    return null;
  }
}

/** A sound playing on repeat, see playLoop. */
export interface Loop {
  /** Glides the loudness to `volume` (times the effects volume) over `seconds`. */
  fade(volume: number, seconds: number): void;
  /** Fades out quickly, so it ends without a click. */
  stop(): void;
}

/** Plays `buffer` on repeat from `offset` seconds in, fading in to `volume`: background music. */
export function playLoop(buffer: AudioBuffer, offset: number, volume: number): Loop | null {
  const ac = audio();
  if (!ac) return null;
  const source = ac.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, ac.currentTime);
  source.connect(gain).connect(ac.destination);
  source.start(0, offset % buffer.duration);
  const fade = (to: number, seconds: number) => {
    const t = ac.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.linearRampToValueAtTime(to * masterVolume, t + seconds);
  };
  fade(volume, 0.4);
  return {
    fade,
    stop() {
      fade(0, 0.15);
      source.stop(ac.currentTime + 0.2);
    },
  };
}

/** Plays the recording `name`, slightly higher or lower each time; `synth` while it is still loading or if there is none. */
export function playRecorded(name: string, synth: () => void) {
  const ac = audio();
  const buffer = loaded.get(name);
  if (!ac || !buffer) {
    loadRecordings([name]);
    synth();
    return;
  }
  const source = ac.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = 0.96 + Math.random() * 0.08;
  const gain = ac.createGain();
  gain.gain.value = masterVolume;
  source.connect(gain).connect(ac.destination);
  source.start();
}

/** `synth` as a recording where there is one, e.g. `recorded("honk", playHonk)`. */
export const recorded = (name: string, synth: () => void) => () => playRecorded(name, synth);

interface Note {
  /** Start pitch in Hz; glides to `to` if given. */
  from: number;
  to?: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  /** Seconds from now. */
  delay?: number;
  /** Cut-off in Hz, to soften harsh waveforms like sawtooth. */
  lowpass?: number;
}

export function note({ from, to = from, duration, type, volume, delay = 0, lowpass }: Note) {
  const ac = audio();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(to, start + duration);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume * masterVolume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  let out: AudioNode = osc.connect(gain);
  if (lowpass) {
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = lowpass;
    out = out.connect(filter);
  }
  out.connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration);
}

export function tone(freq: number, duration: number, type: OscillatorType, volume: number) {
  note({ from: freq, duration, type, volume });
}

/** White noise through a band-pass filter gliding from `from` to `to` Hz: rushing water, blowing air. */
export function hiss({
  from,
  to = from,
  duration,
  volume,
  delay = 0,
  q = 1,
}: {
  from: number;
  to?: number;
  duration: number;
  volume: number;
  delay?: number;
  q?: number;
}) {
  const ac = audio();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * duration), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = ac.createBufferSource();
  source.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = q;
  filter.frequency.setValueAtTime(from, start);
  filter.frequency.exponentialRampToValueAtTime(to, start + duration);
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume * masterVolume, start + Math.min(0.08, duration / 4));
  gain.gain.setValueAtTime(volume * masterVolume, start + duration * 0.6);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  source.connect(filter).connect(gain).connect(ac.destination);
  source.start(start);
  source.stop(start + duration);
}
