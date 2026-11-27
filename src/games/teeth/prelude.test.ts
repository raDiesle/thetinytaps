import { existsSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { APP_LANGUAGES } from "@/lib/language";
import { PRELUDE_TEXTS } from "./lines";
import { ROAR_VIEW, STEPS } from "./steps";
import { PRELUDE } from "./TeethPlay";
import { PREP_CUES, PREP_MS, PREP_RECORDINGS, TIDY_RECORDINGS } from "./prep";
import { ORIGIN_CUES, ORIGIN_MS, ORIGIN_RECORDINGS } from "./origin";
import { SPIT_CUES, SPIT_MS } from "./spit";

// The sounds of the prelude and of tidying up at the end fire when the brushing clock passes them, so they must lie inside their part.
const PARTS = [
  { name: "sweets", cues: ORIGIN_CUES.evening, ms: ORIGIN_MS.sweets },
  { name: "breakfast", cues: ORIGIN_CUES.morning, ms: ORIGIN_MS.sweets },
  { name: "brush", cues: PREP_CUES.brush, ms: PREP_MS.brush },
  { name: "paste", cues: PREP_CUES.paste, ms: PREP_MS.paste },
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

// Before the first verse the mouth in the mirror opens wide like a little lion's and roars softly (X-26): two bars,
// the roar inside them, then 3, 2, 1 with the mouth still open, so the song begins on an open mouth.
describe("the lion's open mouth before the song", () => {
  const BEAT = 60000 / 112;
  const TWO_BARS = 8 * BEAT;

  test("is two bars, then the countdown's three seconds", () => {
    expect(PRELUDE.roar.ms).toBeCloseTo(TWO_BARS + 3000, 3);
  });

  test("roars once, within its two bars, and says nothing", () => {
    const sounds = PRELUDE.roar.sounds ?? [];
    expect(sounds.length).toBe(1);
    expect(sounds[0].at).toBeGreaterThan(0);
    expect(sounds[0].at).toBeLessThan(TWO_BARS - 2 * BEAT);
    expect(PRELUDE_TEXTS.roar.cue).toBeUndefined();
    expect(sounds[0].play.toString()).not.toMatch(/say|speak/);
  });

  test("leaves the mouth wide open from the front for the first verse, which opens it no further", () => {
    expect(ROAR_VIEW.open).toBe(1);
    expect(ROAR_VIEW.yaw).toBe(0);
    expect(STEPS[0].mouth).toBe("open");
    expect(STEPS[0].view.open).toBe(ROAR_VIEW.open);
  });

  test("comes right after the first look in the mirror, as the last part before the brushing", async () => {
    const play = await Bun.file("src/games/teeth/TeethPlay.tsx").text();
    expect(play).toMatch(/"monsters",\s*"roar",\s*\];/);
    // The first step begins with the mouth open, so it has no arrows and no slow opening of its own.
    expect(play).toMatch(/const mouthBefore = phase <= 0 \? "open"/);
  });

  test("has its name on the bar in every app language", () => {
    for (const language of APP_LANGUAGES) expect({ language, title: Boolean(PRELUDE_TEXTS.roar.title[language]) }).toEqual({ language, title: true });
  });
});
