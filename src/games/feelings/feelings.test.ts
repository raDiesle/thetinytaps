import { existsSync } from "node:fs";
import { expect, test } from "bun:test";
import { COMFORTS, FEELINGS } from "./bear";
import { bearImages, imageFor, moodImages, storyImages } from "./images";
import { SITUATIONS } from "./kita";
import { FEELING_TEXTS, SITUATION_TEXTS, storyIn } from "./localized";
import { MOOD_ID, WEATHERS } from "./mood";
import { STORIES } from "./stories";
import { RECORDED_SOUNDS } from "./story";

// Every picture the game asks for is in bilder/; a missing one shows an empty card.

test("every kindergarten story has its pictures", () => {
  for (const { id, steps } of SITUATIONS) {
    const names = [storyImages.problem(id), storyImages.end(id), ...steps.flatMap((_, i) => [storyImages.step(id, i), storyImages.instead(id, i)])];
    for (const name of names) expect(imageFor(name), name).toBeDefined();
  }
});

test("the bear has a picture for every feeling and every comfort", () => {
  for (const { id } of FEELINGS) {
    expect(imageFor(bearImages.feeling(id)), bearImages.feeling(id)).toBeDefined();
    expect(imageFor(bearImages.happy(id)), bearImages.happy(id)).toBeDefined();
    expect(imageFor(bearImages.instead(id)), bearImages.instead(id)).toBeDefined();
  }
  for (const id of Object.keys(COMFORTS)) expect(imageFor(bearImages.comfort(id)), bearImages.comfort(id)).toBeDefined();
});

test("every story on the start screen has its own id", () => {
  const ids = STORIES.map((s) => s.id);
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids).not.toContain("all");
  expect(ids).not.toContain(MOOD_ID);
});

test("every weather has its card and leads to a feeling of the bear", () => {
  for (const { id, feeling } of WEATHERS) {
    expect(imageFor(moodImages.weather(id)), moodImages.weather(id)).toBeDefined();
    expect(FEELINGS.map((f) => f.id)).toContain(feeling);
  }
});

// „Aua!“ has no recording yet; every other sound the stories load is a file, or the first tap would only hear the synthesized stand-in.
test("every recorded sound of the stories has its file", () => {
  for (const name of RECORDED_SOUNDS.filter((n) => n !== "aua")) expect(existsSync(`src/lib/sounds/${name}.mp3`), name).toBe(true);
});

// Every translated story tells the same story as the German: the same steps, the same beats (a narration or a line
// where the German has one, so the timing and sounds fit), a question only where the German feeling has its own.
test("every translation of a kindergarten story matches the German beat for beat", () => {
  const beatParts = (beats: { narration?: string; line?: string }[]) => beats.map((b) => [!!b.narration, !!b.line]);
  for (const [language, texts] of Object.entries(SITUATION_TEXTS)) {
    for (const situation of SITUATIONS) {
      const text = texts[situation.id];
      if (!text) continue;
      const where = `${language} ${situation.id}`;
      expect(beatParts(text.intro), `${where} intro`).toEqual(beatParts(situation.intro));
      expect(beatParts(text.outro), `${where} outro`).toEqual(beatParts(situation.outro));
      expect(text.steps.length, `${where} steps`).toBe(situation.steps.length);
      situation.steps.forEach((step, i) => expect(beatParts(text.steps[i].beats), `${where} step ${i + 1}`).toEqual(beatParts(step.beats)));
      // The happy end shows the steps as cards keyed by caption.
      expect(new Set(text.steps.map((s) => s.caption)).size, `${where} captions`).toBe(text.steps.length);
    }
  }
});

test("every translation of the bear's feelings asks its own question where the German does", () => {
  for (const [language, texts] of Object.entries(FEELING_TEXTS)) {
    for (const feeling of FEELINGS) {
      const text = texts[feeling.id];
      if (text) expect(!!text.question, `${language} ${feeling.id}`).toBe(!!feeling.question);
    }
  }
});

// Translations come only on request, so a story may have none yet (it is told in German); one that has keeps the sounds.
test("a translated story has no German title left and keeps its sounds", () => {
  for (const story of STORIES) {
    const ru = storyIn(story, "ru");
    if (story.kind === "home" ? !FEELING_TEXTS.ru?.[story.feeling.id] : !SITUATION_TEXTS.ru?.[story.situation.id]) continue;
    expect(ru.title).not.toBe(story.title);
    if (story.kind === "kita" && ru.kind === "kita") {
      expect(ru.situation.steps.map((s) => s.instead.sound)).toEqual(story.situation.steps.map((s) => s.instead.sound));
      expect(ru.situation.intro.map((b) => b.sound)).toEqual(story.situation.intro.map((b) => b.sound));
    }
  }
  expect(storyIn(STORIES[0], "de")).toEqual(STORIES[0]);
});
