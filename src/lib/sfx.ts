// Small synthesized sound effects, so no audio files are needed.

import { silent } from "./silent";

// C-major pentatonic: any sequence of these notes sounds pleasant.
const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];

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

/** Scales all effects, e.g. 0.4 for calm mode. */
export function setSfxVolume(volume: number) {
  masterVolume = volume;
}

/** Must be called from a user gesture so the browser allows audio. */
export function unlockAudio() {
  void audio()?.resume();
}

// Real recordings for sounds that should sound like the real thing (animals,
// bells, water …), one file per sound name; sources in sounds/README.md.
const files = import.meta.webpackContext("./sounds", { regExp: /\.mp3$/ });
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
    const buffer = fetch(url)
      .then((response) => response.arrayBuffer())
      .then((data) => ac.decodeAudioData(data))
      .then((decoded) => (loaded.set(name, decoded), decoded))
      .catch(() => null);
    recordings.set(name, buffer);
  }
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

/** "Oink, oink!" – two short grunts. */
export function playOink() {
  [0, 0.28].forEach((delay) => note({ from: 260, to: 180, duration: 0.14, type: "square", volume: 0.12, lowpass: 700, delay }));
}

/** "Mäh!" – a bleat: a quick wobble of short notes. */
export function playBaa() {
  for (let i = 0; i < 6; i++) note({ from: i % 2 ? 560 : 500, to: 470, duration: 0.09, type: "sawtooth", volume: 0.14, lowpass: 1500, delay: i * 0.08 });
}

/** "Gack, gack, gaaack!" – a hen. */
export function playCluck() {
  [0, 0.18, 0.36].forEach((delay, i) =>
    note({ from: 700, to: i === 2 ? 900 : 500, duration: i === 2 ? 0.26 : 0.1, type: "triangle", volume: 0.18, lowpass: 2000, delay }),
  );
}

/** "Kikeriki!" – the cock crows: three short notes and a long high one. */
export function playCrow() {
  [0, 0.14, 0.28].forEach((delay, i) => note({ from: 660 + i * 80, duration: 0.12, type: "sawtooth", volume: 0.12, lowpass: 2200, delay }));
  note({ from: 980, to: 820, duration: 0.6, type: "sawtooth", volume: 0.12, lowpass: 2200, delay: 0.44 });
}

/** A horse's whinny: a high, trembling note that falls. */
export function playNeigh() {
  for (let i = 0; i < 8; i++) note({ from: 900 - i * 60, to: 840 - i * 60, duration: 0.1, type: "triangle", volume: 0.16, delay: i * 0.08 });
}

/** "Schuhu!" – an owl, two soft low hoots. */
export function playHoot() {
  note({ from: 420, to: 380, duration: 0.25, type: "sine", volume: 0.3 });
  note({ from: 400, to: 340, duration: 0.5, type: "sine", volume: 0.3, delay: 0.35 });
}

/** "Quak, quak!" of a frog – lower and rounder than the duck. */
export function playCroak() {
  [0, 0.3].forEach((delay) => note({ from: 190, to: 140, duration: 0.16, type: "sawtooth", volume: 0.25, lowpass: 600, delay }));
}

/** "Roooar!" – a lion's yawn: a low growl that rises and sinks, soft enough for small ears. */
export function playRoar() {
  note({ from: 90, to: 150, duration: 0.35, type: "sawtooth", volume: 0.28, lowpass: 500 });
  note({ from: 150, to: 80, duration: 0.8, type: "sawtooth", volume: 0.28, lowpass: 500, delay: 0.3 });
  note({ from: 60, to: 45, duration: 0.9, type: "square", volume: 0.08, lowpass: 300, delay: 0.2 });
}

/** "Törööö!" – an elephant: a brassy note that climbs and holds. */
export function playTrumpet() {
  note({ from: 330, to: 620, duration: 0.25, type: "sawtooth", volume: 0.14, lowpass: 1800 });
  note({ from: 620, to: 560, duration: 0.7, type: "sawtooth", volume: 0.14, lowpass: 1800, delay: 0.22 });
  note({ from: 1240, to: 1120, duration: 0.6, type: "triangle", volume: 0.04, delay: 0.25 });
}

/** "Uh, uh, ah, ah!" – a monkey: short hoots that climb. */
export function playChatter() {
  for (let i = 0; i < 5; i++) note({ from: 420 + i * 70, to: 620 + i * 90, duration: 0.1, type: "triangle", volume: 0.18, delay: i * 0.13 });
}

/** "Kraah!" – a parrot or a peacock: a raspy call, twice. */
export function playSquawk() {
  [0, 0.35].forEach((delay) => note({ from: 1100, to: 650, duration: 0.22, type: "sawtooth", volume: 0.1, lowpass: 2600, delay }));
}

/** "Schnapp, schnapp!" – a crocodile's jaw closing twice. */
export function playSnap() {
  [0.3, 1].forEach((delay) => {
    note({ from: 900, to: 180, duration: 0.07, type: "triangle", volume: 0.35, delay });
    note({ from: 140, to: 90, duration: 0.12, type: "sine", volume: 0.25, delay });
  });
}

/** "Blubb, blubb!" – bubbles wobbling up through the water. */
export function playBlub() {
  [0, 0.15, 0.32, 0.46].forEach((delay, i) => note({ from: 280 + i * 70, to: 820 + i * 140, duration: 0.1, type: "sine", volume: 0.22, delay }));
}

/** "Uuuuh!" – a whale's song: a long, low note that slides up and down. */
export function playWhale() {
  note({ from: 170, to: 300, duration: 0.8, type: "sine", volume: 0.3 });
  note({ from: 300, to: 140, duration: 1.1, type: "sine", volume: 0.3, delay: 0.7 });
  note({ from: 340, to: 600, duration: 0.8, type: "triangle", volume: 0.05 });
}

/** "Ping!" – a submarine's sonar, with a soft echo. */
export function playPing() {
  note({ from: 1480, duration: 0.6, type: "sine", volume: 0.22 });
  note({ from: 1480, duration: 0.5, type: "sine", volume: 0.07, delay: 0.45 });
}

/** "Ki-ki-ki!" – a dolphin: quick clicks and a whistle that goes up and down. */
export function playDolphin() {
  for (let i = 0; i < 4; i++) note({ from: 2600, to: 2200, duration: 0.04, type: "square", volume: 0.04, lowpass: 4000, delay: i * 0.07 });
  note({ from: 1400, to: 2800, duration: 0.3, type: "sine", volume: 0.14, delay: 0.32 });
  note({ from: 2800, to: 1800, duration: 0.25, type: "sine", volume: 0.14, delay: 0.62 });
}

/** Three hammer knocks. */
export function playKnocks() {
  [0, 0.18, 0.36].forEach((delay) => note({ from: 220, to: 120, duration: 0.09, type: "triangle", volume: 0.4, delay }));
}

/** "Muh!" – a long, low moo. */
export function playMoo() {
  note({ from: 160, to: 120, duration: 0.9, type: "sawtooth", volume: 0.25, lowpass: 600 });
}

/** "Mampf, mampf" – three soft crunchy bites. */
export function playMunch() {
  [0, 0.28, 0.56].forEach((delay) => {
    note({ from: 260, to: 140, duration: 0.1, type: "square", volume: 0.1, lowpass: 700, delay });
    note({ from: 900, to: 500, duration: 0.06, type: "triangle", volume: 0.08, delay: delay + 0.04 });
  });
}

/** "Bäh!" – a short, falling grumble, funny rather than sad. */
export function playYuck() {
  note({ from: 330, to: 200, duration: 0.35, type: "sawtooth", volume: 0.12, lowpass: 900 });
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

/** A slow, soft lullaby falling down the scale, for good night. */
export function playLullaby() {
  [5, 4, 2, 3, 1, 0].forEach((step, i) =>
    note({ from: PENTATONIC[step], duration: 0.9, type: "sine", volume: 0.12, delay: i * 0.6 }),
  );
}

/** "Wuuusch!" – a rocket lifts off: a deep rumble and a rush that climbs higher and higher. */
export function playLaunch() {
  note({ from: 70, to: 48, duration: 1.4, type: "sawtooth", volume: 0.3, lowpass: 300 });
  note({ from: 160, to: 1100, duration: 1.2, type: "triangle", volume: 0.12, delay: 0.25 });
  note({ from: 320, to: 1800, duration: 1, type: "sine", volume: 0.06, delay: 0.45 });
}

/** Funkel, funkel: quick high notes, like a star glittering. */
export function playTwinkle() {
  [7, 5, 6, 4, 7].forEach((step, i) => note({ from: PENTATONIC[step] * 2, duration: 0.25, type: "sine", volume: 0.08, delay: i * 0.09 }));
}

/** "Wiu, wiu!" – the ufo's beam: a note that slides up and down three times. */
export function playBeam() {
  [0, 0.36, 0.72].forEach((delay, i) => {
    note({ from: 500 + i * 60, to: 1100 + i * 60, duration: 0.18, type: "sine", volume: 0.15, delay });
    note({ from: 1100 + i * 60, to: 600 + i * 60, duration: 0.16, type: "sine", volume: 0.15, delay: delay + 0.18 });
  });
}

/** "Bip, bop, bip!" – a robot talking in short square beeps. */
export function playRobot() {
  [880, 660, 990, 520].forEach((freq, i) => note({ from: freq, duration: 0.1, type: "square", volume: 0.07, lowpass: 2500, delay: i * 0.14 }));
}

/** "Bliep, blop!" – a little alien: a wobbly voice going up, down and up again. */
export function playAlien() {
  note({ from: 600, to: 1300, duration: 0.18, type: "triangle", volume: 0.16 });
  note({ from: 1100, to: 500, duration: 0.2, type: "triangle", volume: 0.16, delay: 0.22 });
  note({ from: 700, to: 1500, duration: 0.14, type: "triangle", volume: 0.14, delay: 0.46 });
}

/** "Wusch!" – something flies past: a soft sweep up and down. */
export function playWhoosh() {
  note({ from: 300, to: 1600, duration: 0.35, type: "sawtooth", volume: 0.05, lowpass: 1400 });
  note({ from: 1600, to: 200, duration: 0.5, type: "sine", volume: 0.1, delay: 0.3 });
}

/** "Rrrring!" – a fire station's alarm bell: fast, bright strokes. */
export function playAlarm() {
  for (let i = 0; i < 12; i++) {
    note({ from: 1320, duration: 0.09, type: "triangle", volume: 0.1, delay: i * 0.08 });
    note({ from: 2640, duration: 0.06, type: "sine", volume: 0.04, delay: i * 0.08 });
  }
}

/** "Trrrillll!" – a whistle with a rolling pea inside. */
export function playTrill() {
  [0, 0.55].forEach((start, n) => {
    for (let i = 0; i < (n ? 8 : 4); i++) note({ from: i % 2 ? 2350 : 2150, duration: 0.05, type: "sine", volume: 0.12, delay: start + i * 0.045 });
  });
}

/** White noise through a band-pass filter gliding from `from` to `to` Hz: rushing water, blowing air. */
function hiss({ from, to = from, duration, volume, delay = 0, q = 1 }: { from: number; to?: number; duration: number; volume: number; delay?: number; q?: number }) {
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

/** "Ssssss!" – a snake hissing, twice. */
export function playHiss() {
  [0, 0.55].forEach((delay) => hiss({ from: 5200, to: 4200, duration: 0.45, volume: 0.14, delay, q: 1.4 }));
}

/** "Wuuusch!" – the toilet flushes: rushing water that swirls down, and a gurgle at the end. */
export function playFlush() {
  hiss({ from: 500, to: 1600, duration: 0.7, volume: 0.35, q: 0.8 });
  hiss({ from: 1600, to: 300, duration: 1.1, volume: 0.3, delay: 0.6, q: 0.8 });
  [1.4, 1.55, 1.7].forEach((delay, i) => note({ from: 220 + i * 60, to: 520 + i * 80, duration: 0.09, type: "sine", volume: 0.18, delay }));
}

/** "Ssssss!" – warm air from a hair dryer, with the soft hum of its motor. */
export function playBlow() {
  hiss({ from: 1400, to: 1900, duration: 1.3, volume: 0.22, q: 0.6 });
  note({ from: 180, to: 200, duration: 1.2, type: "sawtooth", volume: 0.05, lowpass: 500 });
}

/** "Schrubb, schrubb!" – a toothbrush going back and forth. */
export function playScrub() {
  for (let i = 0; i < 6; i++) hiss({ from: i % 2 ? 3200 : 2400, duration: 0.13, volume: 0.2, delay: i * 0.17, q: 2 });
}

/** "Plitsch, platsch!" – splashing water, with a few drops after. */
export function playSplash() {
  [0, 0.3].forEach((delay) => hiss({ from: 1800, to: 500, duration: 0.35, volume: 0.3, delay, q: 0.9 }));
  [0.65, 0.8, 0.92].forEach((delay, i) => note({ from: PENTATONIC[(i * 2 + 3) % PENTATONIC.length] * 2, duration: 0.12, type: "sine", volume: 0.1, delay }));
}

/** "Tick, tack!" – a clock, high and low in turn. */
export function playTick() {
  [0, 0.4, 0.8, 1.2].forEach((delay, i) => note({ from: i % 2 ? 1300 : 1900, duration: 0.04, type: "square", volume: 0.07, lowpass: 3000, delay }));
}

/** "Tock-tock-tock!" – a woodpecker drumming on a tree: very fast, dry knocks that fade. */
export function playPeck() {
  for (let i = 0; i < 12; i++) note({ from: 900, to: 420, duration: 0.035, type: "triangle", volume: 0.3 - i * 0.018, delay: i * 0.055 });
}

/** "Kuckuck!" – a cuckoo: two soft notes, the second a third lower, twice. */
export function playCuckoo() {
  [0, 0.75].forEach((delay) => {
    note({ from: 784, to: 770, duration: 0.24, type: "sine", volume: 0.28, delay });
    note({ from: 622, to: 610, duration: 0.34, type: "sine", volume: 0.28, delay: delay + 0.3 });
  });
}

/** "Hihihi!" – a child giggling: quick little notes that hop and fall. */
export function playGiggle() {
  [0, 0.13, 0.26, 0.39, 0.52].forEach((delay, i) =>
    note({ from: 880 - i * 40, to: 1180 - i * 50, duration: 0.09, type: "triangle", volume: 0.16, delay }),
  );
}

/** "Quietsch, quietsch!" – a swing's chain creaking forward and back. */
export function playCreak() {
  [0, 0.6].forEach((delay) => {
    note({ from: 520, to: 880, duration: 0.22, type: "sawtooth", volume: 0.05, lowpass: 1800, delay });
    note({ from: 820, to: 560, duration: 0.2, type: "sawtooth", volume: 0.04, lowpass: 1800, delay: delay + 0.24 });
  });
}

/** "Rauschel" – wind in the leaves of a tree: soft high noise swelling and fading. */
export function playLeaves() {
  [0, 0.35, 0.7].forEach((delay, i) => hiss({ from: 2600 + i * 400, to: 3600, duration: 0.6, volume: 0.1, delay, q: 0.8 }));
}

/** "Ding!" – a small bright bell that rings out. */
export function playDing() {
  note({ from: 1568, duration: 1.3, type: "sine", volume: 0.22 });
  note({ from: 3920, duration: 0.5, type: "sine", volume: 0.05 });
}

/** "Ssssch" – sliding lift doors. */
export function playSlide() {
  hiss({ from: 900, to: 600, duration: 0.5, volume: 0.08, q: 0.7 });
}

/** "Wuuumm" – a lift humming up or down for `seconds`. */
export function playLift(seconds: number, up: boolean) {
  note({ from: up ? 110 : 140, to: up ? 140 : 110, duration: seconds, type: "triangle", volume: 0.18, lowpass: 500 });
}

/** "Wirrr" – a marble running round and round a funnel, getting faster and lower. */
export function playSwirl() {
  for (let i = 0; i < 12; i++) note({ from: 1000 - i * 55, to: 940 - i * 55, duration: 0.1, type: "sine", volume: 0.07, delay: i * (0.16 - i * 0.006) });
}

/** "Plopp" – something soft drops into a basket. */
export function playPlop() {
  note({ from: 260, to: 90, duration: 0.2, type: "sine", volume: 0.3 });
}

/** "Tock!" – wood knocking on wood; a higher `pitch` for small things. */
export function playKnock(pitch = 700) {
  note({ from: pitch, to: pitch * 0.5, duration: 0.08, type: "triangle", volume: 0.3 });
  note({ from: 160, to: 70, duration: 0.12, type: "sine", volume: 0.25 });
}

/** "Plumps" – something soft or hollow falls over, like a paper roll or a carton. */
export function playThump() {
  note({ from: 150, to: 55, duration: 0.22, type: "sine", volume: 0.4 });
  hiss({ from: 700, to: 300, duration: 0.15, volume: 0.12, q: 0.7 });
}

/** "Klong!" – a tin or a bottle hits something. */
export function playClonk() {
  note({ from: 640, to: 600, duration: 0.45, type: "triangle", volume: 0.16 });
  note({ from: 1710, duration: 0.3, type: "sine", volume: 0.06 });
  note({ from: 140, to: 70, duration: 0.1, type: "sine", volume: 0.2 });
}

/** "Rassel" – cereal shaking in its box as it falls over. */
export function playRustle() {
  for (let i = 0; i < 5; i++) hiss({ from: 4200, duration: 0.08, volume: 0.12, delay: i * 0.06, q: 1.5 });
  note({ from: 140, to: 60, duration: 0.2, type: "sine", volume: 0.3, delay: 0.05 });
}

/** "Bumm!" – a big toy drum. */
export function playDrum() {
  note({ from: 150, to: 48, duration: 0.6, type: "sine", volume: 0.55 });
  hiss({ from: 900, to: 200, duration: 0.25, volume: 0.18, q: 0.6 });
}

/** "Fiiiiep!" – a whistling kettle: steam hisses, then the whistle rises and wobbles. */
export function playKettle() {
  hiss({ from: 2500, to: 3200, duration: 1.4, volume: 0.1, q: 1.2 });
  for (let i = 0; i < 6; i++) note({ from: 1180 + i * 40, to: 1240 + i * 40, duration: 0.2, type: "sine", volume: 0.1, delay: 0.3 + i * 0.18 });
  note({ from: 1400, to: 1480, duration: 0.5, type: "sine", volume: 0.12, delay: 1.38 });
}

/** "Brutzel, brutzel!" – an egg sizzling in the pan: crackling hiss with tiny pops. */
export function playSizzle() {
  hiss({ from: 5000, to: 4200, duration: 1.3, volume: 0.12, q: 0.7 });
  for (let i = 0; i < 9; i++) note({ from: 2600 + (i % 3) * 400, to: 1800, duration: 0.03, type: "triangle", volume: 0.07, delay: 0.1 + i * 0.13 + (i % 2) * 0.04 });
}

/** "Knirsch, knirsch" – footsteps or a shovel in fresh snow: short, dry, muffled crunches. */
export function playCrunch() {
  for (let i = 0; i < 4; i++) {
    hiss({ from: 1800, to: 900, duration: 0.14, volume: 0.22, delay: i * 0.32, q: 0.8 });
    hiss({ from: 3600, duration: 0.06, volume: 0.08, delay: i * 0.32 + 0.03, q: 2 });
  }
}

/** "Kling-kling" – sleigh bells jingling in a quick rhythm over the swish of the runners. */
export function playSleigh() {
  hiss({ from: 2500, to: 1200, duration: 1.4, volume: 0.06, q: 0.6 });
  for (let i = 0; i < 8; i++) {
    const delay = i * 0.17;
    note({ from: 2350, to: 2300, duration: 0.12, type: "sine", volume: 0.09, delay });
    note({ from: 3140, to: 3100, duration: 0.1, type: "triangle", volume: 0.04, delay: delay + 0.02 });
  }
}

/** "Knister, knack" – a fire crackling: small random pops over a soft roar. */
export function playCrackle() {
  hiss({ from: 400, to: 250, duration: 1.4, volume: 0.1, q: 0.5 });
  for (let i = 0; i < 10; i++) hiss({ from: 2000 + Math.random() * 3000, duration: 0.03, volume: 0.2, delay: Math.random() * 1.3, q: 3 });
}

/** "Uaaah!" – a sleepy yawn: a soft voice that rises a little, then sinks slowly. */
export function playYawn() {
  note({ from: 330, to: 440, duration: 0.35, type: "triangle", volume: 0.14, lowpass: 900 });
  note({ from: 440, to: 220, duration: 1, type: "triangle", volume: 0.14, lowpass: 900, delay: 0.3 });
}

/** "Pling, pling" – a music box: slow, high, bell-like notes of a lullaby. */
export function playMusicbox() {
  [4, 2, 4, 2, 1, 0].forEach((step, i) => {
    note({ from: PENTATONIC[step] * 2, duration: 0.6, type: "sine", volume: 0.1, delay: i * 0.3 });
    note({ from: PENTATONIC[step] * 4, duration: 0.25, type: "sine", volume: 0.025, delay: i * 0.3 });
  });
}

/** "Tschu-tschu, tüüt!" – a train rolls in: rhythmic chuffs that slow down, then its two-tone horn. */
export function playTrain() {
  [0, 0.2, 0.42, 0.68].forEach((delay, i) => hiss({ from: 1100, to: 650, duration: 0.15, volume: 0.28 - i * 0.04, delay, q: 1.2 }));
  [370, 466].forEach((from, i) => note({ from, duration: 0.7, type: "triangle", volume: i ? 0.12 : 0.16, delay: 1 }));
}

/** "Wuuuusch!" – a jet takes off: a deep roar that swells and rushes higher and higher. */
export function playJet() {
  hiss({ from: 350, to: 2600, duration: 1.8, volume: 0.3, q: 0.7 });
  note({ from: 80, to: 150, duration: 1.6, type: "sawtooth", volume: 0.12, lowpass: 500 });
}

/** "Rrr … ha … ha … hatschi!" – a dinosaur's very soft roar, two breaths in, then a big sneeze. */
export function playSneeze() {
  note({ from: 110, to: 150, duration: 0.5, type: "sawtooth", volume: 0.12, lowpass: 420 });
  note({ from: 150, to: 100, duration: 0.4, type: "sawtooth", volume: 0.1, lowpass: 420, delay: 0.4 });
  [0.95, 1.3].forEach((delay, i) => {
    note({ from: 380 + i * 60, to: 520 + i * 80, duration: 0.25, type: "triangle", volume: 0.12, lowpass: 1400, delay });
    hiss({ from: 900, to: 1400, duration: 0.25, volume: 0.06, delay, q: 0.8 });
  });
  note({ from: 820, to: 300, duration: 0.18, type: "triangle", volume: 0.18, lowpass: 2000, delay: 1.75 });
  hiss({ from: 4200, to: 2200, duration: 0.45, volume: 0.32, delay: 1.78, q: 0.9 });
}

/** "Bumbum, bumbum" – a heart heard through the stethoscope: two soft, low thumps, twice. */
export function playHeartbeat() {
  [0, 0.75].forEach((delay) => {
    note({ from: 70, to: 45, duration: 0.18, type: "sine", volume: 0.55, delay });
    note({ from: 62, to: 40, duration: 0.16, type: "sine", volume: 0.4, delay: delay + 0.22 });
  });
}
