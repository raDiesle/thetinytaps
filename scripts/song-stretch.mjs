// Evens out a song whose tempo drifts (Suno sped up from 112 to 115 BPM while
// singing): finds where each part really starts, then stretches every part to
// exactly `bars` bars at `bpm`, so the parts fall on the game's step times again.
// Guide: .claude/skills/musik-erzeugen/SKILL.md
//
//   yarn song:stretch <song.wav> <out.wav> --bpm 112 [--bars 8] [--start 0.2]
//
// --start is the first beat of the first part (from `yarn song`). Prints the parts
// found and the stretch of each; measure the result with `yarn song` again.
// The pitch stays, only the speed changes (ffmpeg atempo). Needs ffmpeg.
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : Number(args[i + 1]);
};
const [file, out] = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
const bpm = option("bpm", null);
if (!file || !out || !bpm) {
  console.error("usage: yarn song:stretch <song.wav> <out.wav> --bpm 112 [--bars 8] [--start 0.2]");
  process.exit(1);
}
const beats = option("bars", 8) * 4;
const target = (beats * 60) / bpm;

// Onsets in the bass (kick and bass line carry the beat), every 5 ms.
const RATE = 4000;
const HOP = 0.005;
const raw = execFileSync("ffmpeg", ["-loglevel", "error", "-i", file, "-ac", "1", "-af", "lowpass=f=150", "-ar", String(RATE), "-f", "s16le", "-"], {
  maxBuffer: 1 << 30,
});
const samples = new Int16Array(raw.buffer, raw.byteOffset, raw.length / 2);
const n = RATE * HOP;
const env = [];
for (let i = 0; i + n <= samples.length; i += n) {
  let sum = 0;
  for (let k = i; k < i + n; k++) sum += samples[k] * samples[k];
  env.push(Math.sqrt(sum / n));
}
const onsets = env.map((v, i) => (i === 0 ? 0 : Math.max(0, v - env[i - 1])));
/** The strongest onset within 10 ms of `t`. */
const onsetAt = (t) => Math.max(...[-2, -1, 0, 1, 2].map((d) => onsets[Math.round(t / HOP) + d] ?? 0));
const duration = env.length * HOP;

// The first beat, near --start.
let t = option("start", 0);
{
  let best = { score: -1, t };
  for (let x = Math.max(0, t - 0.1); x <= t + 0.1; x += HOP) {
    let score = 0;
    for (let k = 0; k < 16; k++) score += onsetAt(x + (k * 60) / bpm);
    if (score > best.score) best = { score, t: x };
  }
  t = best.t;
}

// Part by part: the tempo (±6 BPM) whose beats, and above all the next part's first beat, hit the most onsets.
const starts = [];
while (t < duration - 2) {
  starts.push(t);
  let best = { score: -1, tempo: bpm, shift: 0 };
  for (let tempo = bpm - 6; tempo <= bpm + 6; tempo += 0.05) {
    for (let shift = -0.03; shift <= 0.03; shift += HOP) {
      let score = 0;
      for (let k = 0; k <= beats; k++) score += onsetAt(t + shift + (k * 60) / tempo) * (k === beats ? 2 : 1);
      if (score > best.score) best = { score, tempo, shift };
    }
  }
  t += best.shift + (beats * 60) / best.tempo;
}

// The lead-in stays; each part becomes `target` long; what follows the last start keeps the stretch before it.
const segments = [[0, starts[0], 1]];
for (let i = 0; i < starts.length - 1; i++) segments.push([starts[i], starts[i + 1], (starts[i + 1] - starts[i]) / target]);
segments.push([starts.at(-1), duration, segments.at(-1)[2]]);
const s = (x) => `${x.toFixed(2)} s`;
segments.forEach(([a, b, r], i) => console.log(`${i === 0 ? "lead-in" : `part ${i}`.padEnd(7)}  ${s(a)}–${s(b)}  ×${r.toFixed(4)}`));

const graph = segments
  .map(([a, b, r], i) => `[0:a]atrim=start=${a}:end=${b},asetpts=PTS-STARTPTS${Math.abs(r - 1) > 1e-4 ? `,atempo=${r.toFixed(6)}` : ""}[s${i}]`)
  .join(";");
const join = `${segments.map((_, i) => `[s${i}]`).join("")}concat=n=${segments.length}:v=0:a=1[o]`;
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", file, "-filter_complex", `${graph};${join}`, "-map", "[o]", "-c:a", "pcm_s16le", out]);
console.log(`written       ${out}  (parts start at ${s(starts[0])} + n × ${s(target)})`);
