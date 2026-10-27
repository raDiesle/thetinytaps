import { existsSync, readFileSync } from "node:fs";
import { expect, test } from "@rstest/core";
import { COMFORTS, FEELINGS } from "./bear";
import { bearImages, imageFor, moodImages, storyImages } from "./images";
import { SITUATIONS } from "./kita";
import { FEELING_TEXTS, SITUATION_TEXTS, storyIn } from "./localized";
import { MOOD_ID, WEATHERS } from "./mood";
import { STORIES } from "./stories";
import { RECORDED_SOUNDS } from "./story";

// Every picture the game asks for is in bilder/. A missing one shows a placeholder with its file name, which is
// allowed only while bilder/README.md lists it under „Geplant“ with its prompt, for the grown-up to look at first.
const README = readFileSync("src/games/feelings/bilder/README.md", "utf8");
const PLANNED = README.slice(README.indexOf("## Geplant"));
const PLANNED_NAMES = [...PLANNED.matchAll(/^\| `([\w-]+)`/gm)].map((m) => m[1]);

function expectPicture(name: string) {
  if (!imageFor(name)) expect(PLANNED_NAMES, `${name}: no picture in bilder/, and not planned in README.md`).toContain(name);
}

test("every kindergarten story has its pictures", () => {
  for (const { id, steps } of SITUATIONS) {
    [storyImages.problem(id), storyImages.end(id), ...steps.flatMap((_, i) => [storyImages.step(id, i), storyImages.instead(id, i)])].forEach(expectPicture);
  }
});

test("the bear has a picture for every feeling, every round and every comfort", () => {
  for (const { id, comforts, instead } of FEELINGS) {
    expect(imageFor(bearImages.feeling(id)), bearImages.feeling(id)).toBeDefined();
    expect(imageFor(bearImages.happy(id)), bearImages.happy(id)).toBeDefined();
    // Every round: the kind thing and the not-so-good idea next to it.
    expect(instead.length, id).toBe(comforts.length);
    instead.forEach((_, i) => expectPicture(bearImages.instead(id, i)));
  }
  for (const id of Object.keys(COMFORTS)) expect(imageFor(bearImages.comfort(id)), bearImages.comfort(id)).toBeDefined();
});

test("a planned picture that is made leaves „Geplant“", () => {
  for (const name of PLANNED_NAMES) expect(imageFor(name), `${name} is made: move its row out of „Geplant“`).toBeUndefined();
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

test("every translation of the bear's feelings has its rounds", () => {
  for (const [language, texts] of Object.entries(FEELING_TEXTS)) {
    for (const feeling of FEELINGS) {
      const text = texts[feeling.id];
      if (!text) continue;
      // One not-so-good idea and one question per round, `null` where it is not translated yet: a shorter list would shift them into the wrong round.
      expect(text.instead.length, `${language} ${feeling.id} rounds`).toBe(feeling.instead.length);
      if (text.questions) expect(text.questions.length, `${language} ${feeling.id} questions`).toBe(feeling.questions.length);
    }
  }
});

// Grown-ups once could not tell whether a card meant the bear does it or the child does it for him: every choice
// asks a question that ends by saying who acts – „… machst du?“ / „… feierst du …?“ or „… kann (der kleine Bär | er) tun/machen?“.
test("every choice asks who acts", () => {
  const whoActs = /(\bdu\b[^.!?]*|\b(der (kleine )?Bär|er)\b[^.!?]*)\?$/;
  const asks = (question: string, where: string) => {
    const last = question.split(/(?<=[.!?])\s+/).at(-1) ?? "";
    expect(last, where).toMatch(whoActs);
    expect(last.startsWith("W"), `${where}: a W-question`).toBe(true);
  };
  for (const feeling of FEELINGS) {
    expect(feeling.questions.length, `${feeling.id} questions`).toBe(feeling.comforts.length);
    feeling.questions.forEach((q, i) => asks(q, `${feeling.id} round ${i + 1}`));
  }
  for (const situation of SITUATIONS) situation.steps.forEach((step, i) => asks(step.question, `${situation.id} step ${i + 1}`));
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
