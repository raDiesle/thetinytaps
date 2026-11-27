import { existsSync } from "node:fs";
import { SOUND_QUEUE } from "@/content/soundQueue";
import { describe, expect, test } from "bun:test";
import { APP_LANGUAGES } from "@/lib/language";
import { PRELUDE_TEXTS } from "./lines";
import { ROAR_VIEW, STEPS } from "./steps";
import { PRELUDE, preludeTiles } from "./TeethPlay";
import { PREP_CUES, PREP_MS, PREP_RECORDINGS, TIDY_RECORDINGS } from "./prep";
import { ORIGIN_CUES, ORIGIN_MS, ORIGIN_RECORDINGS } from "./origin";
import { SPIT_CUES, SPIT_MS } from "./spit";
import { FILL_BEATS, LION_INTRO_BEATS, LION_INTRO_MS, LION_MS, LION_RECORDINGS, ROAR_CUES, ROARING_MS, ROUNDS } from "./lion";

// The sounds of the prelude and of tidying up at the end fire when the brushing clock passes them, so they must lie inside their part.
const PARTS = [
  { name: "sweets", cues: ORIGIN_CUES.evening, ms: ORIGIN_MS.sweets },
  { name: "breakfast", cues: ORIGIN_CUES.morning, ms: ORIGIN_MS.sweets },
  { name: "brush", cues: PREP_CUES.brush, ms: PREP_MS.brush },
  { name: "paste", cues: PREP_CUES.paste, ms: PREP_MS.paste },
  { name: "roar", cues: ROAR_CUES, ms: ROARING_MS },
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

// In the morning the story eats breakfast, not sweets (X-19): nothing is unwrapped and no hard candy crunches.
test("the morning's breakfast sounds like breakfast", () => {
  const played = ORIGIN_CUES.morning.map((c) => c.play.toString()).join(" ");
  expect(played).not.toContain("wrapper");
  expect(played).not.toContain("lolly");
  expect(ORIGIN_CUES.evening.map((c) => c.play.toString()).join(" ")).toContain("wrapper");
});

// The lion comes right after the toothpaste, before the mirror shows the open mouth (X-26, user requests, November
// 2026): the lion first, the child beside it in its costume; then roaring with it, a phase of its own, where the voice
// asks the child to roar and three marks fill one after the other – both roar each time one is full, louder and longer
// each time. Then the mirror shows the mouth wide open with the monsters and 3, 2, 1, so the song begins on an open mouth.
describe("the lion and roaring with it before the song", () => {
  const BEAT = 60000 / 112;

  test("the lion's scene is twelve bars: the lion's two, then three rounds of a mark filling to a note on each beat and both roaring", () => {
    expect(LION_MS).toBeCloseTo(48 * BEAT, 3);
    expect(LION_INTRO_MS).toBeCloseTo(LION_INTRO_BEATS * BEAT, 3);
    expect(PRELUDE.lion.ms + PRELUDE.roar.ms).toBeCloseTo(LION_MS, 3);
    expect(PRELUDE.lion.sounds ?? []).toEqual([]);
    const expected = ROUNDS.flatMap((r) => [...Array.from({ length: FILL_BEATS }, (_, i) => r.fill + i), r.roar].map((b) => b - LION_INTRO_BEATS));
    expect(ROAR_CUES.map((c) => Math.round(c.at / BEAT))).toEqual(expected);
    for (const [k, round] of ROUNDS.entries()) {
      // Both at once: the round's lion and child in one cue, nothing said.
      const roar = ROAR_CUES[(FILL_BEATS + 1) * k + FILL_BEATS];
      expect(roar.play.toString()).toMatch(/round\.lion/);
      expect(roar.play.toString()).toMatch(/round\.child/);
      expect(Math.round(roar.at / BEAT)).toBe(round.roar - LION_INTRO_BEATS);
    }
    for (const cue of ROAR_CUES) expect(cue.play.toString()).not.toMatch(/say|speak|Chime/);
    expect(PRELUDE_TEXTS.lion.cue).toBeUndefined();
  });

  test("the voice asks the child to roar along, in every app language, before the first mark fills", () => {
    const cue = PRELUDE_TEXTS.roar.cue;
    for (const language of APP_LANGUAGES) expect({ language, said: Boolean(cue?.[language]) }).toEqual({ language, said: true });
    // Its longest recording is about 4 s: seven beats leave it room before the first note.
    expect((ROUNDS[0].fill - LION_INTRO_BEATS) * BEAT).toBeGreaterThan(3500);
  });

  test("each roar is a recording from ElevenLabs waiting in the sound queue, with the lion's Freesound roar as stand-in", () => {
    expect(existsSync("src/lib/sounds/roar.mp3")).toBe(true);
    const queued = new Set(SOUND_QUEUE.map((sound) => sound.file));
    for (const round of ROUNDS)
      for (const name of [round.lion, round.child]) {
        expect(LION_RECORDINGS).toContain(name);
        const file = `src/lib/sounds/${name}.mp3`;
        expect({ name, there: existsSync(file) || queued.has(file) }).toEqual({ name, there: true });
      }
    expect(LION_RECORDINGS).toContain("roar");
  });

  test("the lion and the roaring are two phases of their own on the bar, the mirror with the open mouth and 3, 2, 1 at the roaring's end", () => {
    const all = ["sweets", "grow", "brush", "paste", "lion", "roar", "monsters"] as const;
    expect(preludeTiles([...all])).toEqual([
      { phase: "eat", parts: ["sweets", "grow"] },
      { phase: "fetch", parts: ["brush", "paste"] },
      { phase: "lion", parts: ["lion"] },
      { phase: "roar", parts: ["roar", "monsters"] },
    ]);
    expect(preludeTiles(["lion", "roar", "monsters"])).toEqual([
      { phase: "lion", parts: ["lion"] },
      { phase: "roar", parts: ["roar", "monsters"] },
    ]);
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
    expect(play).toMatch(/\["brush", "paste"\] as const\) : \[\]\),\s*"lion",\s*"roar",\s*"monsters",\s*\];/);
    // The mirror is wide open throughout the prelude, so it shows the open mouth after the lion, with no arrows on the lips.
    expect(play).toMatch(/const roaring = before !== null;/);
    // The first step begins with the mouth open, so it has no arrows and no slow opening of its own.
    expect(play).toMatch(/const mouthBefore = phase <= 0 \? "open"/);
  });

  test("has its names on the bar in every app language", () => {
    for (const part of ["lion", "roar"] as const)
      for (const language of APP_LANGUAGES)
        expect({ part, language, title: Boolean(PRELUDE_TEXTS[part].title[language]) }).toEqual({ part, language, title: true });
  });
});
