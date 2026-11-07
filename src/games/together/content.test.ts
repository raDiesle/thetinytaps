import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dealRound, KIND_ORDER, nextKind, TOGETHER_LEVELS } from "./levels";
import type { TargetLanguageId } from "@/content/targetLanguages";
import type { TextsLanguageId } from "@/content/texts";
import { PAIRS, pairsOf, TOGETHER_TEXTS, TOGETHER_TRANSLATIONS, WORK_MS } from "./pairs";
import { BOX_H, BOX_W } from "./scene";
import { SCENES } from "./scenes";
import { TOPICS } from "./topics";
import { KIND_SIGNS } from "./RoundTopic";

test("ids and partners are unique, and each pair has exactly one partner layer", () => {
  expect(PAIRS.filter((p, i) => PAIRS.findIndex((q) => q.id === p.id) !== i).map((p) => p.id)).toEqual([]);
  for (const kind of KIND_ORDER) {
    const names = pairsOf(kind).map((p) => p.partner.name);
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
  }
  for (const pair of PAIRS) {
    expect(pair.id).toMatch(/^[a-z0-9-]+$/);
    expect(pair.layers.filter((l) => l.tool).length).toBe(1);
    // A layer's class is its key and says how it moves, so it comes once in a picture.
    expect(new Set(pair.layers.map((l) => l.cls)).size).toBe(pair.layers.length);
    // The partner is either an emoji or a drawing.
    expect(!!pair.partner.emoji !== !!pair.partner.draw).toBe(true);
  }
});

test("every layer lies in its picture's box, and the sounds come while the two are at work", () => {
  for (const pair of PAIRS) {
    for (const { at } of pair.layers) {
      const [x, y, w, h] = at;
      expect(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= BOX_W && y + h <= BOX_H, `${pair.id} ${at}`).toBe(true);
    }
    for (const [ms] of pair.sounds) expect(ms).toBeLessThan(WORK_MS);
  }
});

test("each kind has enough pairs for the hardest step", () => {
  for (const kind of KIND_ORDER) expect(pairsOf(kind).length).toBeGreaterThanOrEqual(Math.max(...TOGETHER_LEVELS));
});

test("every step deals exactly one right partner among as many as it says, all of the round's kind", () => {
  for (const count of TOGETHER_LEVELS) {
    for (const pair of PAIRS) {
      const round = dealRound(pair, PAIRS, count);
      expect(round.choices.length).toBe(count);
      expect(new Set(round.choices).size).toBe(count);
      expect(round.choices.filter((p) => p === pair).length).toBe(1);
      expect(round.choices[round.correct]).toBe(pair);
      expect(round.choices.every((p) => p.kind === pair.kind)).toBe(true);
    }
  }
});

test("the kinds take turns, and only those switched on", () => {
  expect(nextKind(null, { pair: true, helper: true })).toBe("pair");
  expect(nextKind("pair", { pair: true, helper: true })).toBe("helper");
  expect(nextKind("helper", { pair: true, helper: true })).toBe("pair");
  expect(nextKind("pair", { pair: true, helper: false })).toBe("pair");
  expect(nextKind(null, { pair: false, helper: true })).toBe("helper");
});

// A kind's sign stands before its name under ⚙️; were it one of the pictures to pick from, it would look like an answer.
test("a kind's sign is never a partner to pick", () => {
  const partners = new Set(PAIRS.flatMap((p) => p.partner.emoji ?? []));
  for (const sign of Object.values(KIND_SIGNS)) expect(partners.has(sign)).toBe(false);
});

// While playing, the round's kind is plain small text under the picture, never its sign in a bubble (user feedback,
// November 2026).
test("the round's topic while playing is plain text, without its sign", async () => {
  const source = await Bun.file(new URL("./RoundTopic.tsx", import.meta.url)).text();
  const component = source.slice(source.indexOf("export function RoundTopic"));
  expect(component).not.toContain("KIND_SIGNS");
  expect(component).not.toContain("bubble");
});

// Every choice has its name small below it for grown-ups (user feedback, November 2026).
test("every choice shows its name below it", async () => {
  const source = await Bun.file(new URL("./TogetherPlay.tsx", import.meta.url)).text();
  expect(source).toContain('className="tg-name"');
});

// `alsoFits` names real pairs of the same kind, and they are never dealt together.
test("pairs that also fit each other are never in one round", () => {
  const byId = new Map(PAIRS.map((p) => [p.id, p]));
  for (const pair of PAIRS) {
    for (const id of pair.alsoFits ?? []) {
      expect(byId.get(id)?.kind === pair.kind ? id : `${pair.id}: alsoFits ${id} is no pair of its kind`).toBe(id);
      for (let i = 0; i < 20; i++) expect(dealRound(pair, PAIRS, 4).choices.some((p) => p.id === id) ? `${pair.id} with ${id}` : "").toBe("");
    }
  }
});

// The wrong choices come from other topics first: a round of the bathroom offers no second bathroom thing while
// other topics have enough.
test("the wrong choices come from other topics where there are enough", () => {
  for (const pair of PAIRS) {
    const otherTopics = new Set(PAIRS.filter((p) => p.kind === pair.kind && p.topic !== pair.topic).map((p) => p.topic));
    const round = dealRound(pair, PAIRS, 4);
    const wrong = round.choices.filter((p) => p !== pair);
    if (otherTopics.size >= 3) expect(new Set(wrong.map((p) => p.topic)).size).toBe(wrong.length);
    if (otherTopics.size >= 1) expect(wrong.some((p) => p.topic === pair.topic) ? pair.id : "").toBe("");
  }
});

test("every sentence is there and says the names", () => {
  const de = TOGETHER_TEXTS.de!;
  for (const pair of PAIRS) {
    expect(de.question(pair)).toContain(pair.kind === "pair" ? pair.toThe : pair.the);
    expect(de.right(pair).toLowerCase()).toContain(pair.partner.the.toLowerCase().split(" ")[1]);
    expect(de.belongs(pair).trim().length).toBeGreaterThan(0);
  }
});

// Within a kind each emoji stands for one thing only: a partner's emoji is no other pair's partner nor any thing above,
// and nothing placed round a thing for context is a partner a child could be offered as the answer.
test("an emoji means one thing in its kind, and no context emoji is a partner", () => {
  for (const kind of KIND_ORDER) {
    const scenes = SCENES.filter((s) => TOPICS[s.topic].kind === kind);
    const partners = pairsOf(kind).flatMap((p) => p.partner.emoji ?? []);
    const things = scenes.flatMap((s) => s.thing ?? []);
    expect(
      partners.filter((e, i) => partners.indexOf(e) !== i),
      `${kind} partners`,
    ).toEqual([]);
    expect(
      things.filter((e, i) => things.indexOf(e) !== i),
      `${kind} things`,
    ).toEqual([]);
    expect(
      partners.filter((e) => things.includes(e)),
      `${kind} both`,
    ).toEqual([]);
    const props = scenes.flatMap((s) => (s.props ?? []).map(([e]) => [s.id, e]));
    expect(
      props.filter(([, e]) => partners.includes(e)),
      `${kind} props`,
    ).toEqual([]);
  }
});

test("every scene is of its topic's kind: a helper has its fox or bear, a thing of the day its thing", () => {
  for (const scene of SCENES) {
    const helper = TOPICS[scene.topic].kind === "helper";
    expect(!!scene.helper, scene.id).toBe(helper);
    if (!helper) expect(scene.thing, scene.id).toBeDefined();
    if (scene.act === "hold") expect(helper && !scene.thing, scene.id).toBe(true);
  }
});

/** The handmade pairs, translated (November 2026); the scenes are German only until translations are asked for. */
const TRANSLATED = new Set(["zahnbuerste", "tuer", "topf", "blume", "papier", "feuerwehr", "aerztin", "baecker", "friseurin"]);

/** The languages translated whole so far: every pair has its sentences. */
const COMPLETE: (TargetLanguageId & TextsLanguageId)[] = ["en", "zh", "hi", "es", "ar", "ru"];

/** The languages in a script of their own: no Latin letter may be left in their sentences. */
const OWN_SCRIPT: TargetLanguageId[] = ["zh", "hi", "ar", "ru"];

test("the translated languages say every pair in their own words", () => {
  const ids = new Set(PAIRS.map((p) => p.id));
  for (const [language, sentences] of Object.entries(TOGETHER_TRANSLATIONS)) {
    for (const id of Object.keys(sentences ?? {})) expect(ids.has(id), `${language} ${id}`).toBe(true);
  }
  for (const language of COMPLETE) {
    const texts = TOGETHER_TEXTS[language]!;
    const de = TOGETHER_TEXTS.de!;
    for (const pair of PAIRS.filter((p) => TRANSLATED.has(p.id))) {
      expect(TOGETHER_TRANSLATIONS[language]?.[pair.id], `${language} ${pair.id}`).toBeDefined();
      const said = (["name", "partner", "question", "right", "belongs"] as const).map((key) => [texts[key](pair), de[key](pair)]);
      for (const [sentence, german] of said) {
        expect(sentence, `${language} ${pair.id}`).not.toBe(german);
        if (OWN_SCRIPT.includes(language)) expect(sentence, `${language} ${pair.id}`).not.toMatch(/[A-Za-zäöüß]/);
      }
    }
  }
});

// Every class a layer moves by has its rule, so no layer stands still by a typo (and none waits hidden for ever).
test("every layer's class is styled in together.css", () => {
  const css = readFileSync(new URL("./together.css", import.meta.url), "utf8");
  for (const pair of PAIRS) {
    for (const { cls } of pair.layers) {
      if (cls.startsWith("tg-base")) continue;
      expect(css.includes(`.${cls}`)).toBe(true);
    }
  }
});
