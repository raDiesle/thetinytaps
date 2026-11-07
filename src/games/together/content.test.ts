import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { dealRound, KIND_ORDER, nextKind, TOGETHER_LEVELS } from "./levels";
import { DEFAULT_TOGETHER_SETTINGS } from "./settings";
import type { TargetLanguageId } from "@/content/targetLanguages";
import type { TextsLanguageId } from "@/content/texts";
import { PAIRS, type PairId, pairsOf, TOGETHER_TEXTS, TOGETHER_TRANSLATIONS, WORK_MS } from "./pairs";
import { KIND_SIGNS } from "./TopicBubble";

test("ids and partners are unique, and each pair has exactly one partner layer", () => {
  expect(new Set(PAIRS.map((p) => p.id)).size).toBe(PAIRS.length);
  expect(new Set(PAIRS.map((p) => p.partner.name)).size).toBe(PAIRS.length);
  for (const pair of PAIRS) {
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
      expect(x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 200 && y + h <= 200).toBe(true);
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

// Grown-ups choose all kinds or exactly one, never a mix of some (user feedback, November 2026).
test("the kinds take turns, or only the one chosen; no kind is switched on or off on its own", () => {
  expect(nextKind(null, "all")).toBe("pair");
  expect(nextKind("pair", "all")).toBe("helper");
  expect(nextKind("helper", "all")).toBe("pair");
  expect(nextKind("pair", "pair")).toBe("pair");
  expect(nextKind(null, "helper")).toBe("helper");
  expect(DEFAULT_TOGETHER_SETTINGS.kinds).toBe("all");
  for (const kind of KIND_ORDER) expect(kind in DEFAULT_TOGETHER_SETTINGS, kind).toBe(false);
});

// The bubble's sign tells grown-ups what a round is about; were it one of the pictures to pick from, it would give the
// answer away.
test("a kind's sign is never a partner to pick", () => {
  const partners = new Set(PAIRS.flatMap((p) => p.partner.emoji ?? []));
  for (const sign of Object.values(KIND_SIGNS)) expect(partners.has(sign)).toBe(false);
});

test("every sentence is there and says the names", () => {
  const de = TOGETHER_TEXTS.de!;
  for (const pair of PAIRS) {
    expect(de.question(pair)).toContain(pair.kind === "pair" ? pair.toThe : pair.the);
    expect(de.right(pair).toLowerCase()).toContain(pair.partner.the.toLowerCase().split(" ")[1]);
    expect(de.belongs(pair).trim().length).toBeGreaterThan(0);
  }
});

/** The languages translated whole so far: every pair has its sentences. */
const COMPLETE: (TargetLanguageId & TextsLanguageId)[] = ["en", "zh", "hi", "es", "ar", "ru"];

/** The languages in a script of their own: no Latin letter may be left in their sentences. */
const OWN_SCRIPT: TargetLanguageId[] = ["zh", "hi", "ar", "ru"];

test("the translated languages say every pair in their own words", () => {
  const ids = new Set(PAIRS.map((p) => p.id));
  for (const [language, sentences] of Object.entries(TOGETHER_TRANSLATIONS)) {
    for (const id of Object.keys(sentences ?? {})) expect(ids.has(id as PairId), `${language} ${id}`).toBe(true);
  }
  for (const language of COMPLETE) {
    const texts = TOGETHER_TEXTS[language]!;
    const de = TOGETHER_TEXTS.de!;
    for (const pair of PAIRS) {
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
      if (cls === "tg-base") continue;
      expect(css.includes(`.${cls}`)).toBe(true);
    }
  }
});
