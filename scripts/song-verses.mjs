// Puts a sung song (e.g. the Zähneputzen-Lied from Suno) into a game: converts it to
// the game's MP3 and finds where each verse begins by listening with Whisper, so the
// game can change its picture exactly when the next verse starts. Suno doesn't keep
// verses to a fixed number of bars, so counting bars is not enough.
// Guide: .claude/skills/zahnputzlied/SKILL.md
//
//   yarn song:verses <song.wav> <out.mp3> --lang en [--lyrics src/games/teeth/musik/suno-lied.md]
//
// The lyrics file has a section "## … (`<lang>`, …)" with the text typed into Suno; the
// first sung line after every [Part N] tag is looked for in the song, in order.
// Writes <out>.json: { "verses": [start of each part in seconds] }, the last one being
// the finale. Needs ffmpeg and whisper-cpp (`brew install whisper-cpp`) with a model in
// ~/.cache/whisper/ggml-base.bin (or WHISPER_MODEL).
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const [file, out] = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
const lang = option("lang", null);
const lyricsFile = option("lyrics", "src/games/teeth/musik/suno-lied.md");
if (!file || !out?.endsWith(".mp3") || !lang) {
  console.error("usage: yarn song:verses <song.wav> <out.mp3> --lang en [--lyrics src/games/teeth/musik/suno-lied.md]");
  process.exit(1);
}
const model = process.env.WHISPER_MODEL ?? join(homedir(), ".cache/whisper/ggml-base.bin");
if (!existsSync(model)) {
  console.error(`No Whisper model at ${model}. Install it once:
  brew install whisper-cpp
  mkdir -p ~/.cache/whisper && curl -L -o ~/.cache/whisper/ggml-base.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin`);
  process.exit(2);
}

/** The step change comes this long before the first sung word, so the picture is there when the verse begins. */
const LEAD = 0.3;
/** A first word is sung at most this long before the second. */
const FIRST_WORD = 0.8;
/** Shorter or longer steps are odd for brushing: a sign of a missed line or a take that doesn't follow the lyrics. */
const SHORTEST = 13;
const LONGEST = 26;

// The first line of every part, from the language's section of the lyrics file.
const lyrics = readFileSync(lyricsFile, "utf8");
const section = lyrics.split(/^## /m).find((s) => s.split("\n")[0].includes(`(\`${lang}\``));
if (!section) {
  console.error(`No section "## … (\`${lang}\`, …)" in ${lyricsFile}.`);
  process.exit(1);
}
const lines = section.split("```text")[1].split("```")[0].split("\n");
const firstLines = lines.flatMap((line, i) => {
  if (!/^\[Part \d+/.test(line)) return [];
  const sung = lines.slice(i + 1).find((l) => l.trim() && !l.startsWith("["));
  return sung ? [sung] : [];
});

// Convert, then listen to the converted file, so the times fit it exactly.
execFileSync("ffmpeg", [
  ...["-y", "-loglevel", "error", "-i", file, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11"],
  ...["-ar", "44100", "-c:a", "libmp3lame", "-b:a", "128k", "-map_metadata", "-1", out],
]);
const dir = mkdtempSync(join(tmpdir(), "song-verses-"));
const wav = join(dir, "song.wav");
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", out, "-ac", "1", "-ar", "16000", wav]);

const letters = (text) => text.toLocaleLowerCase(lang).replace(/[^\p{L}]/gu, "");

/** The words Whisper hears in the song, with their times. */
function hear() {
  execFileSync("whisper-cli", ["-m", model, "-l", lang, "-f", wav, "-ml", "1", "-dtw", "base", "-oj", "-of", join(dir, "song")], { stdio: "ignore" });
  // Whisper's pieces become words: a piece starting with a space starts a new word.
  const words = [];
  for (const { text, offsets } of JSON.parse(readFileSync(join(dir, "song.json"), "utf8")).transcription) {
    const w = letters(text);
    if (!w) continue;
    if (text.startsWith(" ") || words.length === 0) words.push({ t: offsets.from / 1000, w });
    else words[words.length - 1].w += w;
  }
  return words;
}

const distance = (a, b) => {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const up = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = up;
    }
  }
  return row[b.length];
};

/**
 * Where `line` begins among `words` (an index), from the time `after` on: the first place
 * where the heard letters match the line's first three words (Whisper mishears sung words,
 * so a quarter may differ). Null when it isn't there.
 */
function find(words, line, after) {
  const target = line.split(/\s+/).slice(0, 3).map(letters).join("");
  for (let i = words.findIndex((w) => w.t > after); i >= 0 && i < words.length; i++) {
    let heard = "";
    for (let k = i; k < words.length && heard.length < target.length; k++) heard += words[k].w;
    if (heard.length >= target.length && distance(heard.slice(0, target.length), target) <= target.length / 4) return i;
  }
  return null;
}

// The whole song at once, verse after verse. Whisper sometimes puts the first word after a
// break too early (at the end of the break), so it is taken no earlier than shortly before
// the second word. Checked against a spectrogram: the voice came in where this says.
const words = hear();
const verses = [];
for (const line of firstLines) {
  const after = (verses.at(-1) ?? -1) + 1;
  const i = find(words, line, after);
  if (i === null) {
    console.error(`Not found: "${line}". Heard after ${after.toFixed(1)} s:`);
    console.error(
      words
        .filter((w) => w.t > after)
        .slice(0, 60)
        .map((w) => `${w.t.toFixed(1)} ${w.w}`)
        .join(" | "),
    );
    process.exit(1);
  }
  const sung = Math.max(words[i].t, (words[i + 1]?.t ?? words[i].t) - FIRST_WORD);
  verses.push(Math.max(0, Math.round((sung - LEAD) * 100) / 100));
}

writeFileSync(out.replace(/\.mp3$/, ".json"), `${JSON.stringify({ verses })}\n`);
let odd = false;
verses.forEach((t, i) => {
  const length = i < verses.length - 1 ? verses[i + 1] - t : null;
  const warn = length !== null && (length < SHORTEST || length > LONGEST);
  odd ||= warn;
  console.log(
    `part ${i + 1}  ${t.toFixed(2).padStart(6)} s  ${length === null ? "finale" : `${length.toFixed(1)} s`}${warn ? "  <- odd length" : ""}  ${firstLines[i]}`,
  );
});
console.log(`written       ${out} and ${out.replace(/\.mp3$/, ".json")}; brushing lasts ${(verses.at(-1) - verses[0]).toFixed(1)} s`);
if (odd) console.log("Some parts are much shorter or longer than a brushing step: listen there, a new take may be better.");
