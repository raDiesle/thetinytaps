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

function note({ from, to = from, duration, type, volume, delay = 0, lowpass }: Note) {
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

function tone(freq: number, duration: number, type: OscillatorType, volume: number) {
  note({ from: freq, duration, type, volume });
}

/** A low "brumm brumm" for diggers and trucks. */
export function playEngine() {
  note({ from: 60, to: 95, duration: 0.6, type: "sawtooth", volume: 0.35, lowpass: 400 });
  note({ from: 95, to: 55, duration: 0.8, type: "sawtooth", volume: 0.35, lowpass: 400, delay: 0.5 });
}

/** Three short beeps, like a truck backing up. */
export function playBeeps() {
  [0, 0.35, 0.7].forEach((delay) => note({ from: 988, duration: 0.2, type: "square", volume: 0.08, delay }));
}

/** A little bird's chirp. */
export function playTweet() {
  note({ from: 2000, to: 3400, duration: 0.12, type: "sine", volume: 0.15 });
  note({ from: 2000, to: 3400, duration: 0.12, type: "sine", volume: 0.15, delay: 0.16 });
  note({ from: 2400, to: 3800, duration: 0.14, type: "sine", volume: 0.15, delay: 0.32 });
}

/** A springy jump. */
export function playBoing() {
  note({ from: 180, to: 620, duration: 0.4, type: "triangle", volume: 0.3 });
}

/** Raindrops: soft high plinks. */
export function playDrops() {
  [0, 0.22, 0.38, 0.6, 0.75].forEach((delay, i) =>
    note({ from: PENTATONIC[(i * 3) % PENTATONIC.length] * 2, duration: 0.15, type: "sine", volume: 0.12, delay }),
  );
}

/** A jackhammer: fast, buzzy pulses. */
export function playRattle() {
  for (let i = 0; i < 14; i++) note({ from: 140, duration: 0.05, type: "square", volume: 0.12, lowpass: 900, delay: i * 0.07 });
}

/** Helicopter blades: slow, low thumps. */
export function playRotor() {
  for (let i = 0; i < 10; i++) note({ from: 90, to: 60, duration: 0.1, type: "sawtooth", volume: 0.3, lowpass: 300, delay: i * 0.12 });
}

/** "Quak, quak!" */
export function playQuack() {
  [0, 0.25].forEach((delay) => note({ from: 520, to: 340, duration: 0.16, type: "sawtooth", volume: 0.2, lowpass: 1200, delay }));
}

/** "Wau, wau!" */
export function playBark() {
  [0, 0.3].forEach((delay) => note({ from: 420, to: 180, duration: 0.14, type: "square", volume: 0.15, lowpass: 900, delay }));
}

/** A mouse's tiny squeak. */
export function playSqueak() {
  note({ from: 2800, to: 3600, duration: 0.08, type: "sine", volume: 0.12 });
  note({ from: 3000, to: 3800, duration: 0.08, type: "sine", volume: 0.12, delay: 0.12 });
}

/** A short happy tune from the radio. */
export function playMelody() {
  [0, 2, 4, 2, 5, 4].forEach((step, i) =>
    note({ from: PENTATONIC[step], duration: 0.22, type: "triangle", volume: 0.18, delay: i * 0.24 }),
  );
}

/** Quick little sniffs, for the hedgehog. */
export function playSniff() {
  [0, 0.12, 0.24, 0.5].forEach((delay) => note({ from: 1400, to: 900, duration: 0.05, type: "square", volume: 0.06, lowpass: 2000, delay }));
}

/** A pop, as if something jumps out of a hole. */
export function playPop() {
  note({ from: 300, to: 1100, duration: 0.12, type: "sine", volume: 0.3 });
}

/** A soft buzz of tiny wings. */
export function playBuzz() {
  for (let i = 0; i < 8; i++) note({ from: 210, to: 240, duration: 0.08, type: "sawtooth", volume: 0.07, lowpass: 700, delay: i * 0.09 });
}

/** A low rumble of something heavy rolling or tumbling. */
export function playRumble() {
  [0, 0.2, 0.42, 0.6].forEach((delay, i) => note({ from: 110 - i * 10, to: 70, duration: 0.18, type: "triangle", volume: 0.35, delay }));
}

/** A rising hum, like a light switching on. */
export function playHum() {
  note({ from: 220, to: 660, duration: 0.5, type: "sine", volume: 0.2 });
  note({ from: 880, duration: 0.4, type: "sine", volume: 0.12, delay: 0.45 });
}

/** Ritsch, ratsch: a saw going back and forth. */
export function playSaw() {
  [0, 0.25, 0.5, 0.75].forEach((delay, i) =>
    note({ from: i % 2 ? 520 : 300, to: i % 2 ? 300 : 520, duration: 0.2, type: "sawtooth", volume: 0.08, lowpass: 1800, delay }),
  );
}

/** "Tüt, tüt!" – a car horn, two notes at once. */
export function playHonk() {
  [0, 0.3].forEach((delay) => {
    note({ from: 392, duration: 0.22, type: "square", volume: 0.1, lowpass: 1400, delay });
    note({ from: 494, duration: 0.22, type: "square", volume: 0.08, lowpass: 1400, delay });
  });
}

/** "Tschu-tschu!" – a steam whistle: two soft chords, the second one longer. */
export function playWhistle() {
  [
    { delay: 0, duration: 0.3 },
    { delay: 0.4, duration: 0.8 },
  ].forEach(({ delay, duration }) => {
    note({ from: 587, to: 622, duration, type: "triangle", volume: 0.16, delay });
    note({ from: 740, to: 784, duration, type: "triangle", volume: 0.12, delay });
    note({ from: 880, to: 932, duration, type: "sine", volume: 0.08, delay });
  });
}

/** "Tatütata" – two alternating siren notes, soft enough for small ears. */
export function playSiren() {
  [0, 0.4, 0.8, 1.2].forEach((delay, i) => note({ from: i % 2 ? 587 : 440, duration: 0.36, type: "triangle", volume: 0.18, delay }));
}

/** "Bim, bam" – church bells, low and ringing out. */
export function playBells() {
  [0, 0.6, 1.2].forEach((delay, i) => {
    const base = i % 2 ? 330 : 392;
    note({ from: base, duration: 1.2, type: "sine", volume: 0.25, delay });
    note({ from: base * 2.4, duration: 0.6, type: "sine", volume: 0.06, delay });
  });
}

/** "Kling, kling" – a bicycle bell. */
export function playRing() {
  [0, 0.16].forEach((delay) => {
    note({ from: 2200, duration: 0.3, type: "sine", volume: 0.12, delay });
    note({ from: 3300, duration: 0.2, type: "sine", volume: 0.05, delay });
  });
}

/** "Gurr, gurr" – a pigeon. */
export function playCoo() {
  [0, 0.4].forEach((delay) => note({ from: 300, to: 220, duration: 0.3, type: "sine", volume: 0.3, lowpass: 800, delay }));
}

/** "Miau!" – rises and falls. */
export function playMeow() {
  note({ from: 600, to: 900, duration: 0.18, type: "triangle", volume: 0.2 });
  note({ from: 900, to: 520, duration: 0.35, type: "triangle", volume: 0.2, delay: 0.17 });
}

/** Three hammer knocks. */
export function playKnocks() {
  [0, 0.18, 0.36].forEach((delay) => note({ from: 220, to: 120, duration: 0.09, type: "triangle", volume: 0.4, delay }));
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

/** A cheerful brushing tune in steps of the pentatonic scale; null is a rest. */
const TUNE = [0, 2, 4, 4, 5, 4, 2, null, 1, 3, 4, 3, 2, null, null, null, 0, 2, 4, 4, 5, 4, 5, 6, 7, 5, 4, 2, 0, null, null, null];
const TUNE_BASS = [130.81, 196.0, 146.83, 196.0];

/** The i-th beat of the brushing tune, which loops; a soft bass note starts every bar. */
export function playTuneNote(i: number) {
  const step = TUNE[i % TUNE.length];
  if (step !== null) note({ from: PENTATONIC[step], duration: 0.26, type: "triangle", volume: 0.12 });
  if (i % 4 === 0) note({ from: TUNE_BASS[Math.floor(i / 4) % TUNE_BASS.length], duration: 0.9, type: "sine", volume: 0.14 });
}

/** "Puff!" – a little monster vanishes in a cloud, with a sparkle after. */
export function playPoof() {
  note({ from: 900, to: 180, duration: 0.25, type: "sine", volume: 0.25 });
  note({ from: PENTATONIC[7] * 2, duration: 0.3, type: "sine", volume: 0.08, delay: 0.18 });
}
