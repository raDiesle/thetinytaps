import { existsSync, readFileSync } from "node:fs";
import { SOUND_QUEUE } from "@/content/soundQueue";
import { describe, expect, test } from "bun:test";
import { APP_LANGUAGES } from "@/lib/language";
import { LION_CALLS, PRELUDE_TEXTS } from "./lines";
import { ROAR_VIEW, STEPS } from "./steps";
import { PRELUDE, preludeTiles } from "./TeethPlay";
import { PREP_CUES, PREP_MS, PREP_RECORDINGS, TIDY_RECORDINGS } from "./prep";
import { ORIGIN_CUES, ORIGIN_MS, ORIGIN_RECORDINGS } from "./origin";
import { SPIT_CUES, SPIT_MS } from "./spit";
import { CALL_BEATS, CALL_MS, LION_BEATS, LION_MS, LION_RECORDINGS, ROAR_CUES, ROUNDS } from "./lion";

// The sounds of the prelude and of tidying up at the end fire when the brushing clock passes them, so they must lie inside their part.
const PARTS = [
  { name: "sweets", cues: ORIGIN_CUES, ms: ORIGIN_MS.sweets },
  { name: "brush", cues: PREP_CUES.brush, ms: PREP_MS.brush },
  { name: "paste", cues: PREP_CUES.paste, ms: PREP_MS.paste },
  { name: "lion", cues: ROAR_CUES, ms: LION_MS },
  { name: "spit", cues: SPIT_CUES, ms: SPIT_MS },
  { name: "tidy", cues: PREP_CUES.tidy, ms: PREP_MS.tidy },
];

test("prelude sounds are in order and inside their part", () => {
  for (const { name, cues, ms } of PARTS) {
    const times = cues.map((c) => c.at);
    expect({ name, times }).toEqual({ name, times: [...times].sort((a, b) => a - b) });
    for (const at of times) expect({ name, at, inside: at >= 0 && at < ms }).toEqual({ name, at, inside: true });
  }
});

test("every preloaded prelude recording has its file", () => {
  for (const name of [...ORIGIN_RECORDINGS, ...PREP_RECORDINGS, ...TIDY_RECORDINGS])
    expect({ name, file: existsSync(`src/lib/sounds/${name}.mp3`) }).toEqual({ name, file: true });
});

// The toothpaste going on gets no stars and no twinkle (user feedback, November 2026): the dab on the brush is enough.
test("the toothpaste gets no twinkle, seen or heard", async () => {
  const prep = await Bun.file("src/games/teeth/prep.tsx").text();
  expect(prep).toMatch(/\bpaste: \[\],/);
  expect(PREP_CUES.paste.some((c) => c.play.toString().includes("Twinkle"))).toBe(false);
});

// Getting the brush took too long (user feedback, November 2026): each part ends a moment after its animation
// (`grab-brush` 4.5 s, `tube-over` 5.5 s in teeth.css), never with seconds of waiting.
test("getting the brush and the toothpaste keep no wait after their animation", async () => {
  const css = await Bun.file("src/games/teeth/teeth.css").text();
  const length = (rule: string) => Number(css.match(new RegExp(`animation: ${rule} ([\\d.]+)s`))?.[1]) * 1000;
  expect(PREP_MS.brush - length("grab-brush")).toBeLessThanOrEqual(400);
  expect(PREP_MS.paste - length("tube-over")).toBeLessThanOrEqual(400);
});

// The story eats the same at any time of day (user request, November 2026): an apple and a lollipop – never breakfast
// in the morning and sweets in the evening again; nothing in it is unwrapped. The eating took too long with three foods
// and pauses between them (user feedback, November 2026): two, the next coming as the one before is bitten.
test("the story eats an apple and a lollipop, morning and evening alike, without pauses", async () => {
  const origin = await Bun.file("src/games/teeth/origin.tsx").text();
  expect(origin).toContain("const TREATS: (() => ReactElement)[] = [Apple, Lollipop];");
  expect(origin).toContain("const ARRIVE_MS = [2300, 4600];");
  expect(ORIGIN_MS.sweets + ORIGIN_MS.grow).toBeLessThanOrEqual(11000);
  expect(origin).not.toMatch(/Record<Daytime, (Cue|string|\(\(\) => ReactElement\))/);
  expect(ORIGIN_CUES.map((c) => c.play.toString()).join(" ")).not.toContain("wrapper");
  const lines = await Bun.file("src/games/teeth/lines.ts").text();
  expect(lines).not.toMatch(/BREAKFAST|Daytime/);
});

// The lion comes right after the toothpaste, before the mirror shows the open mouth (X-26, user requests, November
// 2026): the lion briefly, then the child beside it in its costume, both roaring together three times, louder and longer
// each time – one phase, whose voice tells the child what comes and calls before each roar; nothing on the picture
// counts. Then the mirror shows the mouth wide open with the monsters and 3, 2, 1, so the song begins on an open mouth.
describe("the lion and roaring with it before the song", () => {
  const BEAT = 60000 / 112;

  test("one part, shorter than the two it was, with both roaring in each of three rounds", () => {
    expect(LION_MS).toBeCloseTo(LION_BEATS * BEAT, 3);
    // The lion's and the roaring's parts were 48 beats together (user feedback, November 2026: too long).
    expect(LION_BEATS).toBeLessThanOrEqual(38);
    expect(PRELUDE.lion.ms).toBeCloseTo(LION_MS, 3);
    expect(ROAR_CUES.map((c) => Math.round(c.at / BEAT))).toEqual(ROUNDS.map((r) => r.roar));
    for (const cue of ROAR_CUES) {
      // Both at once: the round's lion and child in one cue, nothing said and no count notes.
      expect(cue.play.toString()).toMatch(/round\.lion/);
      expect(cue.play.toString()).toMatch(/round\.child/);
      expect(cue.play.toString()).not.toMatch(/say|speak|Chime|CountNote/);
    }
  });

  test("the voice explains it: what comes as the part begins, and a call before each roar, in every app language", () => {
    // „Before we brush, let's roar like a lion – three times!“ (user request, November 2026).
    expect(PRELUDE_TEXTS.lion.cue?.en).toMatch(/lion.*three times/);
    expect(LION_CALLS).toHaveLength(ROUNDS.length);
    for (const text of [PRELUDE_TEXTS.lion.cue, ...LION_CALLS])
      for (const language of APP_LANGUAGES) expect({ language, said: Boolean(text?.[language]) }).toEqual({ language, said: true });
    // Each call ends before its roar sounds and after the mouths of the round before have closed; the first leaves the
    // part's own line (about 4 s) room.
    expect(CALL_MS.map((at) => Math.round(at / BEAT))).toEqual(ROUNDS.map((r) => r.roar - CALL_BEATS));
    expect(CALL_MS[0]).toBeGreaterThan(4500);
    for (const [k, round] of ROUNDS.entries()) if (k > 0) expect(round.roar - CALL_BEATS).toBeGreaterThanOrEqual(ROUNDS[k - 1].roar + ROUNDS[k - 1].open + 1);
    // TeethPlay says the calls when the clock passes them, queued after a line still said.
    const play = readFileSync("src/games/teeth/TeethPlay.tsx", "utf8");
    expect(play).toContain("CALL_MS.map((at, k) => ({ at, play: () => say(spokenIn(LION_CALLS[k], language), true) }))");
    expect(play).toContain('before === "lion" ? [...ROAR_CUES, ...lionCalls]');
  });

  test("each roar is a recording of its own from ElevenLabs, made or waiting in the sound queue, and loaded before the prelude", () => {
    const queued = new Set(SOUND_QUEUE.map((sound) => sound.file));
    for (const round of ROUNDS)
      for (const name of [round.lion, round.child]) {
        expect(LION_RECORDINGS).toContain(name);
        const file = `src/lib/sounds/${name}.mp3`;
        expect({ name, there: existsSync(file) || queued.has(file) }).toEqual({ name, there: true });
      }
  });

  test("the lion is one phase on the bar, the mirror with the open mouth and 3, 2, 1 at its end", () => {
    const all = ["sweets", "grow", "brush", "paste", "lion", "monsters"] as const;
    expect(preludeTiles([...all])).toEqual([
      { phase: "eat", parts: ["sweets", "grow"] },
      { phase: "fetch", parts: ["brush", "paste"] },
      { phase: "lion", parts: ["lion", "monsters"] },
    ]);
    expect(preludeTiles(["lion", "monsters"])).toEqual([{ phase: "lion", parts: ["lion", "monsters"] }]);
  });

  test("the mirror after it is the monsters' look with the mouth open, then the countdown's three seconds", () => {
    expect(PRELUDE.monsters.ms).toBeCloseTo(9 * BEAT + 3000, 3);
    expect(PRELUDE.monsters.sounds ?? []).toEqual([]);
  });

  test("leaves the mouth wide open from the front for the first verse, which opens it no further", () => {
    expect(ROAR_VIEW.open).toBe(1);
    expect(ROAR_VIEW.yaw).toBe(0);
    expect(STEPS[0].mouth).toBe("open");
    expect(STEPS[0].view.open).toBe(ROAR_VIEW.open);
  });

  test("comes right after the toothpaste, before the mirror shows the open mouth", async () => {
    const play = await Bun.file("src/games/teeth/TeethPlay.tsx").text();
    expect(play).toMatch(/\["brush", "paste"\] as const\) : \[\]\),\s*"lion",\s*"monsters",\s*\];/);
    // The mirror is wide open throughout the prelude, so it shows the open mouth after the lion, with no arrows on the lips.
    expect(play).toMatch(/const roaring = before !== null;/);
    // The first step begins with the mouth open, so it has no arrows and no slow opening of its own.
    expect(play).toMatch(/const mouthBefore = phase <= 0 \? "open"/);
  });

  test("has its names on the bar in every app language", () => {
    for (const part of ["lion"] as const)
      for (const language of APP_LANGUAGES)
        expect({ part, language, title: Boolean(PRELUDE_TEXTS[part].title[language]) }).toEqual({ part, language, title: true });
  });
});
