// Measures a song (e.g. from Suno) for a game: tempo, the first beat, where each
// part starts, quiet stretches in the bass, and a spectrogram picture to check by eye.
// Guide: .claude/skills/musik-erzeugen/SKILL.md
//
//   bun run song <song.wav|mp3> [--bpm 112] [--bars 8]
//
// --bpm is what was asked of Suno (the search looks ±4 BPM around it, otherwise
// 70–160); --bars is the length of one part. Needs ffmpeg.
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : Number(args[i + 1]);
};
const file = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
if (!file) {
  console.error("usage: bun run song <song.wav|mp3> [--bpm 112] [--bars 8]");
  process.exit(1);
}
const askedBpm = option("bpm", null);
const bars = option("bars", 8);

/** The song as mono samples, only the bass (kick and bass line carry the beat). */
function bass(rate) {
  const raw = execFileSync("ffmpeg", ["-loglevel", "error", "-i", file, "-ac", "1", "-af", "lowpass=f=150", "-ar", String(rate), "-f", "s16le", "-"], {
    maxBuffer: 1 << 30,
  });
  return new Int16Array(raw.buffer, raw.byteOffset, raw.length / 2);
}

/** Loudness (RMS) in windows of `hop` seconds. */
function envelope(samples, rate, hop) {
  const n = Math.round(rate * hop);
  const out = [];
  for (let i = 0; i + n <= samples.length; i += n) {
    let sum = 0;
    for (let k = i; k < i + n; k++) sum += samples[k] * samples[k];
    out.push(Math.sqrt(sum / n));
  }
  return out;
}

const RATE = 2000;
const samples = bass(RATE);
const duration = samples.length / RATE;

// Tempo: the beat period whose comb of onsets (with the best phase) collects the most.
const HOP = 0.01;
const env = envelope(samples, RATE, HOP);
const onsets = env.map((v, i) => (i === 0 ? 0 : Math.max(0, v - env[i - 1])));
function comb(period) {
  let best = { score: 0, phase: 0 };
  for (let ph = 0; ph < period; ph += HOP) {
    let score = 0;
    for (let t = ph; t / HOP < onsets.length - 1; t += period) score += onsets[Math.round(t / HOP)];
    if (score > best.score) best = { score, phase: ph };
  }
  return best;
}
const [from, to] = askedBpm ? [askedBpm - 4, askedBpm + 4] : [70, 160];
let tempo = { score: 0, bpm: 0, phase: 0 };
for (let bpm = from; bpm <= to + 1e-9; bpm += 0.1) {
  const { score, phase } = comb(60 / bpm);
  if (score > tempo.score) tempo = { score, bpm: Math.round(bpm * 10) / 10, phase };
}
const beat = 60 / tempo.bpm;
const part = bars * 4 * beat;

// Quiet bass for at least 0.4 s: breaks, a gentle part, the pause before a final chord.
const slow = envelope(samples, RATE, 0.1);
const loud = Math.max(...slow);
const quiet = [];
let since = null;
slow.forEach((v, i) => {
  if (v < loud * 0.05) since ??= i;
  else if (since !== null) {
    if (i - since >= 4) quiet.push([since / 10, i / 10]);
    since = null;
  }
});
if (since !== null && slow.length - since >= 4) quiet.push([since / 10, slow.length / 10]);

const png = join(tmpdir(), `${basename(file, extname(file))}.spectrum.png`);
execFileSync("ffmpeg", [
  "-loglevel",
  "error",
  "-y",
  "-i",
  file,
  "-lavfi",
  `showspectrumpic=s=${Math.max(800, Math.round(duration * 10))}x500:legend=1:scale=log:fscale=log:stop=8000`,
  png,
]);

const s = (t) => `${t.toFixed(2)} s`;
console.log(`duration      ${s(duration)}`);
console.log(`tempo         ${tempo.bpm} BPM (beat ${s(beat)}, ${bars}-bar part ${s(part)})`);
console.log(`first beat    ${s(tempo.phase)}  (the beat grid's phase; a part may start a few beats later)`);
console.log("part starts   " + Array.from({ length: Math.floor((duration - tempo.phase) / part) + 1 }, (_, k) => s(tempo.phase + k * part)).join(", "));
console.log("quiet bass    " + (quiet.length ? quiet.map(([a, b]) => `${s(a)}–${s(b)}`).join(", ") : "none"));
console.log(`spectrogram   ${png}`);
