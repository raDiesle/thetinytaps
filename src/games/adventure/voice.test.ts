import { existsSync, readdirSync } from "node:fs";
import { expect, test } from "bun:test";
import { TARGET_LANGUAGES } from "@/content/targetLanguages";
import { CLOUD_TRIP } from "./stories/cloudTrip";
import { DEFAULT_TURN, type Story, storyIn } from "./stories/story";
import { TREASURE_ISLAND } from "./stories/treasureIsland";
import { recordingName } from "@/lib/voiceName";
import { spokenLines } from "./voiceId";

// Recordings are named by the hash of their line (voice.ts, `bun run voice make`).
const STORIES = [
  { dir: "src/games/adventure/stories/treasureIsland", story: TREASURE_ISLAND },
  { dir: "src/games/adventure/stories/cloudTrip", story: CLOUD_TRIP },
];

/** The story in every language it has, with the folder of its recordings. */
const voices = () =>
  STORIES.flatMap(({ dir, story }) =>
    TARGET_LANGUAGES.filter((l) => l.id === "de" || story.translations?.[l.id]).map((l) => ({
      language: l.id,
      folder: l.id === "de" ? `${dir}/stimme` : `${dir}/stimme/${l.id}`,
      story: storyIn(story, l.id),
    })),
  );

const linesOf = (story: Story) => spokenLines(story.opening?.lines ?? [], story.lines, DEFAULT_TURN);

test("every lines.<language>.ts is a language of the app and listed in the story's translations", () => {
  for (const { dir, story } of STORIES) {
    const files = readdirSync(dir).flatMap((f) => /^lines\.([a-z]+)\.ts$/.exec(f)?.[1] ?? []);
    expect(files.filter((id) => !TARGET_LANGUAGES.some((l) => l.id === id))).toEqual([]);
    expect(Object.keys(story.translations ?? {}).sort()).toEqual(files.sort());
  }
});

test("a translation has the same steps and lines as the German story", () => {
  for (const { story } of STORIES) {
    for (const [language, t] of Object.entries(story.translations ?? {})) {
      expect(t.opening.length, `${language}: opening`).toBe(story.opening?.lines.length ?? 0);
      expect(t.steps.length, `${language}: steps`).toBe(story.lines.length);
      story.lines.forEach((step, i) => {
        const own = t.steps[i];
        const has = (s: { situation?: string; turn?: string; again?: string }) => [!!s.situation, !!s.turn, !!s.again];
        expect(has(own), `${language}: step ${i + 1} (${step.icon}) has situation, turn, again like the German`).toEqual(has(step));
        expect(own.more?.length ?? 0, `${language}: step ${i + 1} (${step.icon}) more`).toBe(step.more?.length ?? 0);
      });
    }
  }
});

test("no two lines of a story share a recording", () => {
  for (const { story, language } of voices()) {
    const lines = linesOf(story);
    expect(new Set(lines.map((l) => recordingName(l.text, language))).size, language).toBe(lines.length);
  }
});

test("a story with recordings has one for every line and none left over (bun run voice make)", () => {
  for (const { folder, story, language } of voices()) {
    if (!existsSync(folder)) continue;
    const wanted = linesOf(story).map((l) => `${recordingName(l.text, language)}.mp3`);
    const files = readdirSync(folder).filter((f) => f.endsWith(".mp3"));
    expect(
      wanted.filter((f) => !files.includes(f)),
      `${language}: lines without a recording`,
    ).toEqual([]);
    expect(
      files.filter((f) => !wanted.includes(f)),
      `${language}: recordings no line uses`,
    ).toEqual([]);
  }
});

// Translations come only on request, so a story may lack a title or step names in a language (they show in German).
test("Russian, Chinese, Hindi and Arabic titles and step names, where a story has them, are written in their own letters", () => {
  for (const { dir, story } of STORIES) {
    for (const language of ["ru", "zh", "hi", "ar"] as const) {
      const own = story.translations?.[language];
      const names = [own?.title, ...(own?.steps.map((s) => s.name) ?? [])].flatMap((n) => (n ? [n] : []));
      for (const name of names) expect(name, `${dir} ${language}: ${name}`).toMatch(/^[^A-Za-z]*$/);
    }
  }
});

// A story with Russian titles and step names has them in the other translated languages too (October 2026).
test("a story with a Russian title and step names has them in en, zh, hi, es and ar too", () => {
  for (const { dir, story } of STORIES) {
    const ru = story.translations?.ru;
    if (!ru?.title) continue;
    for (const language of ["en", "zh", "hi", "es", "ar"] as const) {
      const own = story.translations?.[language];
      expect(own?.title?.trim(), `${dir} ${language}`).toBeTruthy();
      ru.steps.forEach((step, i) => {
        if (step.name) expect(own?.steps[i]?.name?.trim(), `${dir} ${language} step ${i}`).toBeTruthy();
      });
    }
  }
});
