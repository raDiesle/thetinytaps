import { existsSync, readFileSync } from "node:fs";
import { expect, test } from "bun:test";
import { LANGUAGE_STATUS } from "@/content/ideas/languageStatus";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { COMFORTS, type ComfortId, FEELINGS } from "./bear";
import { bearImages, imageFor, moodImages, situationImages } from "./images";
import { SITUATIONS, type SituationId } from "./kita";
import { COMFORT_TEXTS, FEELING_TEXTS, SITUATION_TEXTS, storyIn } from "./localized";
import { BREATH_MS, HELPS, MOODS, STRENGTHS } from "./mood";
import { SELF_SITUATIONS } from "./selbst";
import { GROUPS } from "./groups";
import { roundOf, stepsOf } from "./rounds";
import { STORIES } from "./stories";
import { RECORDED_SOUNDS } from "./story";

// The languages a part has been translated into whole, as the language table on /management/ says: a part marked
// "done" (or "text", translated but not recorded yet) there has every text, and changing a German line means marking
// it "partial" until it is translated again.
const STATUS_PARTS = LANGUAGE_STATUS.find((row) => row.href === "/gefuehle/")?.parts ?? [];
/** The languages a part of the language table has, whole (`done`, `text`) or, with `partly`, also in part. */
const translatedIn = (label: string, partly = false) =>
  (Object.entries(STATUS_PARTS.find((part) => part.label === label)?.languages ?? {}) as [TargetLanguageId, string][])
    .filter(([language, state]) => language !== "de" && (state === "done" || state === "text" || (partly && state === "partial")))
    .map(([language]) => language);
const TRANSLATED_HOME = translatedIn("Zu Hause");
const TRANSLATED_HOME_PARTLY = translatedIn("Zu Hause", true);
const TRANSLATED_KITA = translatedIn("Wie geht's dir? und Kindergarten");
const TRANSLATED_SELF = translatedIn("Mehr Gefühle", true);

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

test("every story has its own id", () => {
  const ids = STORIES.map((s) => s.id);
  expect(new Set(ids).size).toBe(ids.length);
});

// „Alltagssituationen“ plays a group's scenes one after another, so a story outside every group would never be seen.
test("every story is in exactly one group", () => {
  const grouped = GROUPS.flatMap((g) => g.stories);
  expect(new Set(GROUPS.map((g) => g.id)).size, "a group id twice").toBe(GROUPS.length);
  expect(grouped.toSorted()).toEqual(STORIES.map((s) => s.id).toSorted());
});

// Only the last step of a story shows its happy end.
test("every story ends on its last step", () => {
  for (const story of STORIES) {
    for (let step = 0; step < stepsOf(story); step++) {
      const round = roundOf(story, step, "de");
      expect(!!round.end, `${story.id} step ${step + 1} end`).toBe(step === stepsOf(story) - 1);
    }
  }
});

// „Wie geht's dir?“ (C-29, C-30): every feeling has its face and the grown-up's hug, and leads to a group; the four
// that had a weather card keep it for the built site until the faces are made.
test("every feeling has its face and hug, and leads to a group", () => {
  expect(new Set(MOODS.map((m) => m.id)).size, "a feeling twice").toBe(MOODS.length);
  for (const { id, group, weather, caption } of MOODS) {
    expectPicture(moodImages.face(id));
    expectPicture(moodImages.hug(id));
    if (weather) expect(imageFor(moodImages.weather(weather.picture)), moodImages.weather(weather.picture)).toBeDefined();
    expect(GROUPS.map((g) => g.id)).toContain(group);
    expect(caption.de, id).not.toMatch(/[.!]$/);
  }
  expect(MOODS.filter((m) => m.weather).length, "the built site's first screen before the faces").toBe(4);
  // Both mascots show feelings, and each sign of „Wie doll ist es?“ belongs to one feeling only.
  expect(new Set(MOODS.map((m) => m.kind))).toEqual(new Set(["fox", "bear"]));
  expect(new Set(MOODS.map((m) => m.sky)).size).toBe(MOODS.length);
});

// „Wie doll ist es?“ (C-36): three sizes, small to big, and only the biggest of a hard feeling brings the breaths.
test("the three sizes grow, and the breath's circle keeps time with the game", () => {
  expect(STRENGTHS.map((s) => s.scale)).toEqual(STRENGTHS.map((s) => s.scale).toSorted((a, b) => a - b));
  expect(STRENGTHS.length).toBe(3);
  const css = readFileSync("src/games/feelings/feelings.css", "utf8");
  expect(css).toContain(`mood-breathe ${BREATH_MS / 1000}s`);
});

// „Was hilft dir jetzt?“ (C-31): three different things after every feeling, each with its card; none is wrong.
test("every feeling offers three different helps, each with its card", () => {
  for (const { id, helps } of MOODS) expect(new Set(helps).size, id).toBe(3);
  for (const help of Object.values(HELPS)) {
    expectPicture(moodImages.help(help.id));
    expect(help.caption.de, help.id).not.toMatch(/[.!]$/);
  }
  const offered = new Set(MOODS.flatMap((m) => m.helps));
  expect([...offered].toSorted(), "a help no feeling offers is never seen").toEqual(
    Object.values(HELPS)
      .map((h) => h.id)
      .toSorted(),
  );
});

// Nothing floats up, hops, shakes or pulses after a choice: the picture's change is the answer (user feedback,
// November 2026). The big picture's slow two-frame fade is the only thing that keeps going.
test("the game answers calmly", () => {
  const files = ["shared.tsx", "RoundPlay.tsx", "MoodPlay.tsx", "PassPlay.tsx"].map((f) => readFileSync(`src/games/feelings/${f}`, "utf8"));
  for (const code of files) expect(code).not.toMatch(/float\(|Floater/);
  const css = readFileSync("src/games/feelings/feelings.css", "utf8");
  for (const name of ["fg-hop", "fg-shake", "fg-call", "fg-glow", "fg-stamp", "pop-in", "wiggle"]) expect(css, name).not.toContain(name);
  expect(css.match(/infinite/g)?.length ?? 0, "only the picture's fade repeats").toBeLessThanOrEqual(1);
});

// A scene waits for a tap on its picture (▶), never for a timer; then the big picture stands still and the cards' frames
// take turns, so only one thing moves at a time. Captions are never cut off with „…“ (user feedback, November 2026).
test("a scene goes on with a tap, and one thing moves at a time", () => {
  const round = readFileSync("src/games/feelings/RoundPlay.tsx", "utf8");
  expect(round).toContain('onNext={phase === "intro" ? goOn : undefined}');
  expect(round).toContain('still={phase === "choose"}');
  expect(round, "the intro's beats only end in the question").toContain("playBeats(round.start.beats, () => say(round.question, true))");
  expect(readFileSync("src/games/feelings/shared.tsx", "utf8")).toContain('<Frames name={image} moving={active} className="fg-card-image" />');
  expect(readFileSync("src/games/feelings/feelings.css", "utf8")).not.toMatch(/text-overflow:\s*ellipsis|white-space:\s*nowrap/);
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
    for (const situation of ALL_SITUATIONS) {
      const text = texts[situation.id];
      if (!text) continue;
      const where = `${language} ${situation.id}`;
      expect(beatParts(text.intro), `${where} intro`).toEqual(beatParts(situation.intro));
      if (text.outro) expect(beatParts(text.outro), `${where} outro`).toEqual(beatParts(situation.outro));
      expect(text.steps.length, `${where} steps`).toBe(situation.steps.length);
      // A step that is `null` is told in German until it is translated.
      situation.steps.forEach((step, i) => {
        const words = text.steps[i];
        if (words) expect(beatParts(words.beats), `${where} step ${i + 1}`).toEqual(beatParts(step.beats));
      });
      // Every step's card has a caption of its own.
      const captions = text.steps.flatMap((s) => (s ? [s.caption] : []));
      expect(new Set(captions).size, `${where} captions`).toBe(captions.length);
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
  // A part marked `partial` has every story, with a changed line here and there told in German (`null`); a part
  // marked translated has every line.
  for (const language of TRANSLATED_HOME_PARTLY) {
    for (const id of Object.keys(COMFORTS) as ComfortId[]) expect(COMFORT_TEXTS[language]?.[id], `${language} comfort ${id}`).toBeDefined();
    for (const { id } of FEELINGS) {
      expect(FEELING_TEXTS[language]?.[id], `${language} feeling ${id}`).toBeDefined();
      if (TRANSLATED_HOME.includes(language)) expect(FEELING_TEXTS[language]?.[id]?.instead, `${language} feeling ${id}`).not.toContain(null);
    }
  }
  const whole = (language: TargetLanguageId, id: SituationId) => {
    const text = SITUATION_TEXTS[language]?.[id];
    expect(text, `${language} story ${id}`).toBeDefined();
    expect(text?.steps, `${language} story ${id}`).not.toContain(null);
    expect(text?.outro && text.endCaption, `${language} story ${id} end`).toBeDefined();
  };
  for (const language of TRANSLATED_KITA) for (const { id } of SITUATIONS) whole(language, id);
  for (const language of TRANSLATED_SELF) {
    for (const { id } of SELF_SITUATIONS) expect(SITUATION_TEXTS[language]?.[id], `${language} story ${id}`).toBeDefined();
  }
  for (const language of translatedIn("Mehr Gefühle")) for (const { id } of SELF_SITUATIONS) whole(language, id);
});

// A language in its own script has no word left in Latin letters (a name like Tapsi is written in its letters too).
test("translations in another script have no Latin letters", () => {
  for (const language of ["ru", "zh", "hi", "ar"] as const) {
    const texts = [COMFORT_TEXTS[language], FEELING_TEXTS[language], SITUATION_TEXTS[language]].flatMap(stringsIn);
    for (const text of texts) expect(text, language).not.toMatch(/[A-Za-z]/);
  }
});
