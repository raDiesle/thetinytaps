import { existsSync, readFileSync } from "node:fs";
import { expect, test } from "bun:test";
import { LANGUAGE_STATUS } from "@/content/ideas/languageStatus";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { COMFORTS, type ComfortId, FEELINGS } from "./bear";
import { DAY_PICTURE_QUEUE } from "./dayPictures";
import { DAYS, dayImage, dayImages, firstImage, NIGHT_IMAGE } from "./days";
import { bearImages, imageFor, moodImages, situationImages } from "./images";
import { SITUATIONS, type SituationId } from "./kita";
import { COMFORT_TEXTS, DAY_TEXTS, dayIn, FEELING_TEXTS, SITUATION_TEXTS, storyIn } from "./localized";
import { asCaption, MOODS, morningMood, STRENGTH_ANSWERS, STRENGTHS, withMood } from "./mood";
import { MOOD_PICTURE_QUEUE } from "./moodPictures";
import { NEEDS, needsCameFrom } from "./needs";
import { SELF_SITUATIONS } from "./selbst";
import { GROUPS } from "./groups";
import { readAlong, roundLines, roundOf, stepsOf } from "./rounds";
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

// „Wie geht's dir?“ (user feedback, November 2026): eight feelings, four pleasant ones first and four unpleasant ones,
// each with its card of the little bear alone (or planned).
test("every feeling has its card, in a group of four", () => {
  expect(new Set(MOODS.map((m) => m.id)).size, "a feeling twice").toBe(MOODS.length);
  expect(MOODS.map((m) => m.pleasant)).toEqual([true, true, true, true, false, false, false, false]);
  for (const { id, caption, moment } of MOODS) {
    expectPicture(moodImages.feeling(id));
    expect(caption.de, id).not.toMatch(/[.!]$/);
    expect(moment, id).not.toBe("");
  }
});

// One figure for every feeling, the little bear, dressed (user feedback, November 2026): the drawings never take the fox.
test("the feelings are always the little bear, in his clothes", () => {
  const art = readFileSync("src/games/feelings/moodArt.tsx", "utf8");
  expect(art).not.toMatch(/kind=\{|kind="fox"/);
  // Their prompts, waiting in the queue or kept in bilder/README.md once made.
  const rows = [...README.matchAll(/^\| `((?:gefuehl|brauche)-[\w-]+)` +\| (.*)\|$/gm)].map((m) => ({ id: m[1], prompt: m[2] }));
  const prompts = [...rows, ...MOOD_PICTURE_QUEUE.map((p) => ({ id: p.id, prompt: `${p.prompt} --ref ${p.ref?.join(" ")}` }))];
  expect(prompts.length).toBeGreaterThanOrEqual(15);
  for (const { id, prompt } of prompts) {
    expect(prompt, id).toContain("light-blue T-shirt and dark blue-purple trousers");
    // A feeling a little or a whole lot is drawn from its card, the same moment, the bear alone; every card from the bear.
    const strength = id.match(/^(gefuehl-\w+)-(?:wenig|doll)$/);
    if (strength) {
      expect(prompt, id).toContain(`${strength[1]}.webp`);
      expect(prompt, id).toContain("only ONE little bear");
      expect(prompt, id).toContain("same camera framing");
      continue;
    }
    expect(prompt, id).toContain("baer-sad-gut");
    if (id.startsWith("gefuehl-")) expect(prompt, id).toContain("He is the only character: no grown-up");
  }
});

// „Wie doll ist es?“ (C-36): three pictures of every feeling, a little to a whole lot (user wish, November 2026: pictures,
// no slider) – the middle its card, the other two drawn from it; their captions are the answers said.
test("every feeling shows a little, quite a lot and a whole lot", () => {
  expect(STRENGTHS).toEqual([0, 1, 2]);
  for (const mood of MOODS) {
    expect(moodImages.strength(mood.id, 1)).toBe(moodImages.feeling(mood.id));
    for (const strength of STRENGTHS) expectPicture(moodImages.strength(mood.id, strength));
  }
  for (const answer of STRENGTH_ANSWERS) for (const line of Object.values(answer)) expect(asCaption(line), line).not.toMatch(/[.!¡。！।]/u);
  const css = readFileSync("src/games/feelings/feelings.css", "utf8");
  expect(css).not.toContain("mood-slider");
});

// „Was brauche ich?“ (C-31): different things, each with its picture card like the others (user feedback, November 2026:
// the drawn head of „Tief pusten“ didn't fit them), none of them wrong; its answer says it does good.
test("every need has its card and says it does good", () => {
  expect(new Set(NEEDS.map((n) => n.id)).size).toBe(NEEDS.length);
  for (const need of NEEDS) {
    expectPicture(moodImages.need(need.id));
    expect(need.caption.de, need.id).not.toMatch(/[.!]$/);
    expect(need.answer.de, need.id).toMatch(/\.$/);
  }
});

// From one thing big back to all of them is the page's corner (user feedback, November 2026: there was no way back from
// a picked feeling).
test("the corner goes back from one feeling to all of them", () => {
  expect(readFileSync("src/games/feelings/MoodPlay.tsx", "utf8")).toContain("useInnerBack(");
});

// „Was brauche ich?“ never shows a need big (user feedback, November 2026): the cards stay, the one picked is only marked
// where it stands (the others pale), so there is nothing to go back from.
test("a picked need stays a card among the others", () => {
  const play = readFileSync("src/games/feelings/NeedsPlay.tsx", "utf8");
  expect(play).not.toContain("useInnerBack(");
  expect(play).not.toMatch(/mood-big|StoryPicture|<Frames/);
  expect(play).toContain("pale");
  expect(readFileSync("src/games/feelings/feelings.css", "utf8")).toContain(".mood-need.pale .fg-card-image");
});

// Nothing floats up, hops, shakes or pulses after a choice: the picture's change is the answer (user feedback,
// November 2026). The big picture's slow two-frame fade is the only thing that keeps going.
test("the game answers calmly", () => {
  const files = ["shared.tsx", "RoundPlay.tsx", "MoodPlay.tsx", "NeedsPlay.tsx", "PassPlay.tsx", "DayPlay.tsx", "DayPage.tsx"].map((f) =>
    readFileSync(`src/games/feelings/${f}`, "utf8"),
  );
  for (const code of files) expect(code).not.toMatch(/float\(|Floater/);
  const css = readFileSync("src/games/feelings/feelings.css", "utf8");
  for (const name of ["fg-hop", "fg-shake", "fg-call", "fg-glow", "fg-stamp", "pop-in", "wiggle"]) expect(css, name).not.toContain(name);
  expect(css.match(/infinite/g)?.length ?? 0, "only the picture's fade repeats").toBeLessThanOrEqual(1);
});

// A scene waits for a tap on its picture (▶), never for a timer; then the big picture stands still and the cards' frames
// take turns, so only one thing moves at a time. Captions are never cut off with „…“ (user feedback, November 2026).
test("a scene goes on with a tap, and one thing moves at a time", () => {
  const round = readFileSync("src/games/feelings/RoundPlay.tsx", "utf8");
  expect(round).toContain('const next = phase === "intro" ? goOn : phase === "done" ? onDone : undefined;');
  expect(round).toContain('still={phase === "choose"}');
  expect(round, "the intro's beats only end in the question").toContain("playBeats(round.start.beats, () => say(round.question, true))");
  expect(readFileSync("src/games/feelings/shared.tsx", "utf8")).toContain('<Frames name={image} moving={active} className="fg-card-image" />');
  expect(readFileSync("src/games/feelings/feelings.css", "utf8")).not.toMatch(/text-overflow:\s*ellipsis|white-space:\s*nowrap/);
});

// „Alltagssituationen“ alone has a switch for its voice, for grown-ups who tell the story themselves (user decision,
// November 2026): one tap, like the book beside it (held, it was too slow, user feedback), and „Wie geht's dir?“ always speaks.
test("the voice switch is Alltagssituationen's alone, and tapped", () => {
  const users = ["FeelingsPlay.tsx", "MoodGame.tsx", "MoodPlay.tsx", "PassPlay.tsx", "RoundPlay.tsx", "DayPlay.tsx", "DayPage.tsx"].filter((f) =>
    readFileSync(`src/games/feelings/${f}`, "utf8").includes("<VoiceSwitch"),
  );
  expect(users).toEqual(["FeelingsPlay.tsx"]);
  expect(readFileSync("src/games/feelings/MoodGame.tsx", "utf8")).toContain("voice: true");
  const button = readFileSync("src/games/feelings/VoiceSwitch.tsx", "utf8");
  expect(button).toContain("{...tapProps(onToggle)}");
  expect(button).not.toContain("useHold");
  expect(readFileSync("src/games/feelings/shared.tsx", "utf8"), "a line due while switched off stays silent").toContain("if (speaking.current) voice.say(");
});

// Grown-ups who read the scenes out themselves (the voice switched off) open the round's whole text from the screen's
// bottom right corner, beside the loudspeaker (user feedback, November 2026): it holds every line the voice would say,
// in Alltagssituationen only; it opens with one tap, never held; switching the voice off opens it, and then nothing on
// it is marked, since the grown-up reads it all.
test("the text to read out holds every line a round says", () => {
  for (const story of STORIES)
    for (let step = 0; step < stepsOf(story); step++) {
      const round = roundOf(story, step, "de");
      const sheet = readAlong(round)
        .map((part) => part.text)
        .join(" ");
      for (const line of roundLines(round).filter(Boolean)) expect(sheet, `${story.id} ${step}`).toContain(line);
    }
  // The corner is made once, for the passes by feeling and the days alike.
  const users = ["FeelingsPlay.tsx", "MoodGame.tsx", "MoodPlay.tsx", "PassPlay.tsx", "DayPlay.tsx"].filter((f) =>
    readFileSync(`src/games/feelings/${f}`, "utf8").includes("ReadAlongCorner = {"),
  );
  expect(users).toEqual(["FeelingsPlay.tsx"]);
  const note = readFileSync("src/games/feelings/ReadAlong.tsx", "utf8");
  expect(note).not.toContain("useHold");
  expect(note).toContain("{...tapProps(onToggle)}");
  expect(note, "the loudspeaker stands in the same corner").toContain('className="story-corner"');
  expect(note, "with the voice off nothing is marked").toContain("part={voice ? part : undefined}");
  expect(readFileSync("src/games/feelings/FeelingsPlay.tsx", "utf8"), "switching the voice off opens the text").toContain("{ voice: false, text: true }");
});

// After the good choice its picture waits for ▶ too, never on to the next scene by a timer, and the „Weiter“ at a
// pass's end that changes the feeling names the next one (user feedback, November 2026).
test("after the good choice ▶ brings the next scene, and „Weiter“ names a new feeling", () => {
  const pass = readFileSync("src/games/feelings/PassPlay.tsx", "utf8");
  expect(pass).toMatch(/<GameEnd inline showNext /);
  expect(pass).toContain("onDone={last ? undefined : goOn}");
  const finish = pass.slice(pass.indexOf("const finish"), pass.indexOf("const goOn"));
  expect(finish, "finishing a scene doesn't move on by itself").not.toContain("setNow");
});

// ▶ stands at the same place on every screen of the game, the screen's bottom right corner, and the whole screen goes
// on unless a tap lands next to something else (user feedback, November 2026: on the pages of a day's story it lay
// elsewhere, under the grown-ups' notes). Those notes are the scenes' alone: on a page they change nothing. The dots
// at the top play a scene again (user wish, November 2026).
test("▶ keeps one place, the notes stay off the pages, and the dots go back", () => {
  const read = (f: string) => readFileSync(`src/games/feelings/${f}`, "utf8");
  const shared = read("shared.tsx");
  const picture = shared.slice(shared.indexOf("export function StoryPicture"), shared.indexOf("export type CardState"));
  expect(picture, "the big picture is no button of its own").not.toContain("onNext");
  for (const f of ["RoundPlay.tsx", "DayPage.tsx"]) expect(read(f), f).toContain("<GoOn ");
  for (const f of ["RoundPlay.tsx", "DayPage.tsx", "MoodPlay.tsx", "PassPlay.tsx", "DayPlay.tsx"]) expect(read(f), f).not.toContain("fg-next-sign");
  const page = read("DayPage.tsx");
  expect(page).not.toMatch(/story-corner|voiceSwitch|VoiceSwitch|ReadAlong/);
  expect(read("DayPlay.tsx")).not.toContain("corner={");
  const css = read("feelings.css");
  const next = css.slice(css.indexOf(".fg-next {"), css.indexOf("}", css.indexOf(".fg-next {")));
  expect(next, "▶ in the screen's corner").toMatch(/right: var\(--pad\);\s+bottom: var\(--pad\);/);
  expect(css, "the notes stand left of ▶").toContain("right: calc(var(--next-w) + 2 * var(--pad) - 8px);");
  for (const f of ["RoundPlay.tsx", "DayPage.tsx"]) expect(read(f), f).toContain("onPick={onPick}");
  for (const f of ["PassPlay.tsx", "DayPlay.tsx"]) expect(read(f), f).toContain("onPick={replay}");
  const dots = shared.slice(shared.indexOf("export function StepDots"));
  expect(dots, "a tap next to a dot finds the nearest, done or not").toContain('data-tap=""');
  expect(dots).not.toContain('"done"');
});

// The days (user idea, November 2026): every scene is in exactly one day, so the days tell all of them and none
// twice; every page of a day's story has its picture or is planned, named by its day and place.
test("every story is in exactly one day, and every page of a day has its picture", () => {
  expect(new Set(DAYS.map((d) => d.id)).size, "a day id twice").toBe(DAYS.length);
  const told = DAYS.flatMap((d) => d.scenes.map((s) => s.story));
  expect(told.toSorted()).toEqual(STORIES.map((s) => s.id).toSorted());
  DAYS.forEach((day, d) => {
    day.scenes.forEach((scene, i) => expect(scene.before.image, day.id).toBe(dayImage(d + 1, i + 1)));
    dayImages(day).forEach(expectPicture);
    for (const text of [...day.scenes.map((s) => s.before.text), day.end]) expect(text, day.id).toMatch(/[.!]$/);
    expect(day.end, "a day ends at night").toContain("Gute Nacht!");
    // A page still to make waits in the queue, drawn from the first picture of the scene it leads to.
    for (const { story, before } of day.scenes) {
      if (imageFor(before.image)) continue;
      const queued = DAY_PICTURE_QUEUE.find((p) => p.id === before.image);
      expect(queued?.ref, before.image).toEqual([`src/games/feelings/bilder/${firstImage(story)}.webp`]);
    }
  });
  if (!imageFor(NIGHT_IMAGE)) expect(DAY_PICTURE_QUEUE.map((p) => p.id)).toContain(NIGHT_IMAGE);
});

// A day's translation tells the same day: one page per scene, every one a sentence, and the day ends at night.
test("every translation of a day has one page per scene", () => {
  for (const [language, texts] of Object.entries(DAY_TEXTS)) {
    for (const [id, text] of Object.entries(texts ?? {})) {
      const day = DAYS.find((d) => d.id === id);
      expect(day, `${language} ${id}`).toBeDefined();
      if (!day || !text) continue;
      expect(text.pages.length, `${language} ${id} pages`).toBe(day.scenes.length);
      for (const page of [...text.pages, text.end]) expect(page, `${language} ${id}`).toMatch(/[.!。！।]$/);
      expect(dayIn(day, language as TargetLanguageId).end).toBe(text.end);
    }
  }
});

// A page of a day's story only tells: no cards, no question, never a timer – one tap (or key) turns to the scene, and
// after a scene ▶ on its last picture brings the next page (user idea, November 2026).
test("a page of a day's story only tells, and goes on with a tap", () => {
  const page = readFileSync("src/games/feelings/DayPage.tsx", "utf8");
  expect(page).not.toMatch(/ChoiceCard|setTimeout|\.question/);
  const day = readFileSync("src/games/feelings/DayPlay.tsx", "utf8");
  expect(day).toContain("onDone={goOn}");
  expect(day).toMatch(/<GameEnd inline showNext /);
  expect(day).not.toContain("setTimeout");
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
    const texts = [COMFORT_TEXTS[language], FEELING_TEXTS[language], SITUATION_TEXTS[language], DAY_TEXTS[language]].flatMap(stringsIn);
    for (const text of texts) expect(text, language).not.toMatch(/[A-Za-z]/);
  }
});

// C-33: in the evening the morning's feeling stands beside the evening's – only today's, never yesterday's.
test("the evening shows this morning's feeling, never yesterday's, and never in the morning", () => {
  const morning = new Date("2026-11-04T08:00");
  const evening = new Date("2026-11-04T19:00");
  const day = withMood(undefined, "traurig", morning);
  expect(morningMood(day, morning)).toBeUndefined();
  expect(morningMood(withMood(day, "froh", evening), evening)).toBe("traurig");
  expect(morningMood(day, new Date("2026-11-05T19:00"))).toBeUndefined();
  expect(withMood(day, "muede", new Date("2026-11-05T08:00"))).toEqual({ day: "2026-11-05", morning: "muede" });
});

// A card's caption is only its few words: a note for grown-ups („Heute früh“) on a marker over the card, never
// joined into the caption, where „Heute früh: Traurig“ took three lines over the bear's face (user feedback, November 2026).
test("the morning's feeling is marked beside its caption, never in it", () => {
  const play = readFileSync("src/games/feelings/MoodPlay.tsx", "utf8");
  expect(play).toContain("marker={m.id === morning ? t(THIS_MORNING)");
  expect(play).not.toMatch(/caption=\{[^}]*THIS_MORNING/);
});

// „Wie geht's dir?“ leads on to „Was brauche ich?“, whose way back comes to it again (user wish, November 2026).
test("a feeling's screen links to „Was brauche ich?“, and only it is gone back to from there", () => {
  expect(readFileSync("src/games/feelings/MoodPlay.tsx", "utf8")).toContain("<NeedsLink />");
  expect(needsCameFrom({ from: "/wie-gehts-dir/" })).toBe("/wie-gehts-dir/");
  expect(needsCameFrom({ from: "//elsewhere.example/" })).toBeUndefined();
  expect(needsCameFrom(null)).toBeUndefined();
});
