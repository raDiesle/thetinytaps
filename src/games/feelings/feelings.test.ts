import { existsSync, readFileSync } from "node:fs";
import { expect, test } from "bun:test";
import { LANGUAGE_STATUS } from "@/content/ideas/languageStatus";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { COMFORTS, type ComfortId, FEELINGS } from "./bear";
import { bearImages, imageFor, moodImages, situationImages } from "./images";
import { SITUATIONS } from "./kita";
import { COMFORT_TEXTS, FEELING_TEXTS, SITUATION_TEXTS, storyIn } from "./localized";
import { MOOD_ID, WEATHERS } from "./mood";
import { SELF_SITUATIONS } from "./selbst";
import { STORIES, storyAfter } from "./stories";
import { RECORDED_SOUNDS } from "./story";

// The languages a part has been translated into whole, as the language table on /management/ says: a part marked
// "done" (or "text", translated but not recorded yet) there has every text, and changing a German line means marking
// it "partial" until it is translated again.
const STATUS_PARTS = LANGUAGE_STATUS.find((row) => row.href === "/gefuehle/")?.parts ?? [];
const translatedIn = (label: string) =>
  (Object.entries(STATUS_PARTS.find((part) => part.label === label)?.languages ?? {}) as [TargetLanguageId, string][])
    .filter(([language, state]) => language !== "de" && (state === "done" || state === "text"))
    .map(([language]) => language);
const TRANSLATED_HOME = translatedIn("Zu Hause");
const TRANSLATED_KITA = translatedIn("Wie geht's dir? und Kindergarten");

// Every picture the game asks for is in bilder/. A missing one shows a placeholder with its file name, which is
// allowed only while bilder/README.md lists it under „Geplant“ with its prompt, for the grown-up to look at first.
const README = readFileSync("src/games/feelings/bilder/README.md", "utf8");
const PLANNED = README.slice(README.indexOf("## Geplant"));
const PLANNED_NAMES = [...PLANNED.matchAll(/^\| `([\w-]+)`/gm)].map((m) => m[1]);

function expectPicture(name: string) {
  if (!imageFor(name)) expect(PLANNED_NAMES, `${name}: no picture in bilder/, and not planned in README.md`).toContain(name);
}

// The kindergarten stories and the stories of more feelings (selbst.ts) play alike and find their pictures by id.
const ALL_SITUATIONS = [...SITUATIONS, ...SELF_SITUATIONS];

test("every kindergarten story has its pictures", () => {
  const ids = ALL_SITUATIONS.map((s) => s.id);
  expect(new Set(ids).size, "a story id twice would share its pictures").toBe(ids.length);
  for (const situation of ALL_SITUATIONS) situationImages(situation).forEach(expectPicture);
});

test("the bear has a picture for every feeling, every round and every comfort", () => {
  for (const { id, comforts, instead } of FEELINGS) {
    expect(imageFor(bearImages.feeling(id)), bearImages.feeling(id)).toBeDefined();
    expect(imageFor(bearImages.happy(id)), bearImages.happy(id)).toBeDefined();
    // Every round: the kind thing and the not-so-good idea next to it.
    expect(instead.length, id).toBe(comforts.length);
    instead.forEach((_, i) => expectPicture(bearImages.instead(id, i)));
  }
  for (const id of Object.keys(COMFORTS)) expectPicture(bearImages.comfort(id));
});

// A not-so-good idea is never scolded: its answer starts softly with „Hmm,“ and then says what is better.
test("every not-so-good answer starts with „Hmm,“", () => {
  for (const { id, steps } of ALL_SITUATIONS) steps.forEach((step, i) => expect(step.instead.answer, `${id} step ${i + 1}`).toStartWith("Hmm, "));
  for (const { id, instead } of FEELINGS) instead.forEach((idea, i) => expect(idea.answer, `${id} round ${i + 1}`).toStartWith("Hmm, "));
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

test("„Weiter“ goes through the stories in the start screen's order", () => {
  const played = [STORIES[0]];
  for (let i = 1; i <= STORIES.length; i++) played.push(storyAfter(played[i - 1]));
  expect(played).toEqual([...STORIES, STORIES[0]]);
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
  for (const situation of ALL_SITUATIONS) situation.steps.forEach((step, i) => asks(step.question, `${situation.id} step ${i + 1}`));
});

// Translations come only on request, so a story may have none yet (it is told in German); one that has keeps the sounds.
test("a translated story has no German title left and keeps its sounds", () => {
  for (const language of Object.keys(FEELING_TEXTS) as TargetLanguageId[]) {
    for (const story of STORIES) {
      const translated = storyIn(story, language);
      if (story.kind === "home" ? !FEELING_TEXTS[language]?.[story.feeling.id] : !SITUATION_TEXTS[language]?.[story.situation.id]) continue;
      expect(translated.title, `${language} ${story.id}`).not.toBe(story.title);
      if (story.kind === "kita" && translated.kind === "kita") {
        expect(translated.situation.steps.map((s) => s.instead.sound)).toEqual(story.situation.steps.map((s) => s.instead.sound));
        expect(translated.situation.intro.map((b) => b.sound)).toEqual(story.situation.intro.map((b) => b.sound));
      }
    }
  }
  expect(storyIn(STORIES[0], "de")).toEqual(STORIES[0]);
});

/** Every string inside a translation, however deep. */
const stringsIn = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(stringsIn) : [];

// A part the language table marks translated is translated whole: every kind thing, feeling (each not-so-good idea
// too) and kindergarten story, so none of them is told half in German.
test("every translated language has every story", () => {
  expect(TRANSLATED_KITA.length, "the language table's parts of /gefuehle/").toBeGreaterThan(0);
  for (const language of TRANSLATED_HOME) {
    for (const id of Object.keys(COMFORTS) as ComfortId[]) expect(COMFORT_TEXTS[language]?.[id], `${language} comfort ${id}`).toBeDefined();
    for (const { id } of FEELINGS) {
      expect(FEELING_TEXTS[language]?.[id], `${language} feeling ${id}`).toBeDefined();
      expect(FEELING_TEXTS[language]?.[id]?.instead, `${language} feeling ${id}`).not.toContain(null);
    }
  }
  for (const language of TRANSLATED_KITA) {
    for (const { id } of SITUATIONS) expect(SITUATION_TEXTS[language]?.[id], `${language} story ${id}`).toBeDefined();
  }
});

// A language in its own script has no word left in Latin letters (a name like Tapsi is written in its letters too).
test("translations in another script have no Latin letters", () => {
  for (const language of ["ru", "zh", "hi", "ar"] as const) {
    const texts = [COMFORT_TEXTS[language], FEELING_TEXTS[language], SITUATION_TEXTS[language]].flatMap(stringsIn);
    for (const text of texts) expect(text, language).not.toMatch(/[A-Za-z]/);
  }
});
