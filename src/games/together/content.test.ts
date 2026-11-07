import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dealRound, KIND_ORDER, nextKind, TOGETHER_LEVELS } from "./levels";
import { DEFAULT_TOGETHER_SETTINGS } from "./settings";
import type { TargetLanguageId } from "@/content/targetLanguages";
import type { TextsLanguageId } from "@/content/texts";
import { PAIRS, pairsOf, TOGETHER_TEXTS, TOGETHER_TRANSLATIONS, WORK_MS } from "./pairs";
import { BOX_H, BOX_W } from "./scene";
import { SCENES } from "./scenes";
import { TOPICS } from "./topics";
import { KIND_SIGNS } from "./RoundTopic";
import { framesOf, partImage } from "./frames";
import { PAINTED } from "./painted";
import { TOGETHER_PICTURE_QUEUE } from "./picturePrompts";
import { planQueue } from "@/content/pictureQueuePlan";

/** Every pair written down, also the painted ones whose pictures aren't made yet: its id, kind and partner's name. */
const ALL = [
  ...PAIRS.map((p) => ({ id: p.id, kind: p.kind, partner: p.partner.name })),
  ...PAINTED.filter((p) => !PAIRS.some((q) => q.id === p.id)).map((p) => ({ id: p.id, kind: TOPICS[p.topic].kind, partner: p.partner.name })),
];

test("ids and partners are unique, and each pair has exactly one partner layer", () => {
  expect(ALL.filter((p, i) => ALL.findIndex((q) => q.id === p.id) !== i).map((p) => p.id)).toEqual([]);
  expect(PAINTED.filter((p, i) => PAINTED.findIndex((q) => q.id === p.id) !== i).map((p) => p.id)).toEqual([]);
  for (const kind of KIND_ORDER) {
    const names = ALL.filter((p) => p.kind === kind).map((p) => p.partner);
    expect(names.filter((n, i) => names.indexOf(n) !== i)).toEqual([]);
  }
  for (const pair of PAIRS) {
    expect(pair.id).toMatch(/^[a-z0-9-]+$/);
    // A painted pair shows its two frames instead of layers.
    expect(pair.layers.filter((l) => l.tool).length).toBe(pair.frames ? 0 : 1);
    // A layer's class is its key and says how it moves, so it comes once in a picture.
    expect(new Set(pair.layers.map((l) => l.cls)).size).toBe(pair.layers.length);
    // The partner is an emoji, a drawing or a painted picture, exactly one of them, and a painted one is there.
    const { emoji, draw, image } = pair.partner;
    expect([emoji, draw, image].filter(Boolean).length, pair.id).toBe(1);
    if (image) expect(partImage(image), `${pair.id}: bilder/teile/${image}.webp`).toBeDefined();
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
  const byId = new Map(ALL.map((p) => [p.id, p]));
  for (const pair of [...PAIRS, ...PAINTED.map((p) => ({ ...p, kind: TOPICS[p.topic].kind }))]) {
    for (const id of pair.alsoFits ?? []) {
      expect(byId.get(id)?.kind === pair.kind ? id : `${pair.id}: alsoFits ${id} is no pair of its kind`).toBe(id);
      if (!("layers" in pair)) continue;
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

/** The languages translated whole (the handmade pairs in `content.<lang>.ts`, the scenes in `content.scenes.<lang>.ts`, November 2026): every pair has its sentences. */
const COMPLETE: (TargetLanguageId & TextsLanguageId)[] = ["en", "zh", "hi", "es", "ar", "ru"];

/**
 * The painted pairs (`painted/`, November 2026) came after the translations: a new one is German only until the user
 * asks for its translations, and one turned from an emoji scene keeps them where its names stayed the same.
 */
const GERMAN_ONLY = new Set(PAINTED.map((p) => p.id));

/** The languages in a script of their own: no Latin letter may be left in their sentences. */
const OWN_SCRIPT: TargetLanguageId[] = ["zh", "hi", "ar", "ru"];

test("the translated languages say every pair in their own words", () => {
  const ids = new Set(ALL.map((p) => p.id));
  for (const [language, sentences] of Object.entries(TOGETHER_TRANSLATIONS)) {
    for (const id of Object.keys(sentences ?? {})) expect(ids.has(id), `${language} ${id}`).toBe(true);
  }
  for (const language of COMPLETE) {
    const texts = TOGETHER_TEXTS[language]!;
    const de = TOGETHER_TEXTS.de!;
    for (const pair of PAIRS) {
      if (GERMAN_ONLY.has(pair.id) && !TOGETHER_TRANSLATIONS[language]?.[pair.id]) continue;
      expect(TOGETHER_TRANSLATIONS[language]?.[pair.id], `${language} ${pair.id}`).toBeDefined();
      const said = (["name", "partner", "question", "right", "belongs"] as const).map((key) => [key, texts[key](pair), de[key](pair)]);
      for (const [key, sentence, german] of said) {
        // A name may be the German word in a language with Latin letters (Pizza, Computer, Piñata); a sentence never is.
        if (!(OWN_SCRIPT.includes(language) === false && (key === "name" || key === "partner"))) expect(sentence, `${language} ${pair.id}`).not.toBe(german);
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

// The painted pairs (user decision, November 2026): a pair marked made has all its pictures (both frames, and its
// painted partner where it has one) and one with all of them is marked made, so it left the picture queue; no picture
// lies there without its pair; and the partner on its plate is an emoji or painted, exactly one of them.
// The pictures cost as little as they can (user feedback, November 2026: frames and partners sent one per request cost
// twice as much): a pair's two frames are one request, cut apart, and the painted partners share sheets of four.
test("the painted pairs' pictures go out on shared sheets, never one per request", () => {
  const fromFirst = new Set(PAINTED.filter((p) => p.fromFirst).map((p) => `zusammen-${p.id}-2`));
  for (const p of TOGETHER_PICTURE_QUEUE) {
    if (fromFirst.has(p.id)) {
      // Only a pair whose frames drifted apart twice as one request: its kept first frame is the reference.
      expect(p.alone).toBe("second frame");
      expect(p.ref?.length).toBe(1);
      expect(existsSync(p.ref?.[0] ?? ""), `${p.id}: its first frame is kept`).toBe(true);
      continue;
    }
    expect(p.alone, `${p.id} is drawn alone`).toBeUndefined();
    if (p.transparent) expect(p.ref ?? [], `${p.id}: a partner is drawn from its words, so it can share a sheet`).toEqual([]);
    else expect(p.panels?.length, `${p.id}: both frames in one request`).toBe(2);
  }
  const plan = planQueue(TOGETHER_PICTURE_QUEUE);
  const sheets = [...plan.now, ...plan.waiting];
  const parts = TOGETHER_PICTURE_QUEUE.filter((p) => p.transparent).length;
  expect(sheets.length).toBeLessThanOrEqual(TOGETHER_PICTURE_QUEUE.length - parts + Math.ceil(parts / 4) + 1);
  expect(fromFirst.size, "a second frame alone is the exception").toBeLessThan(PAINTED.length / 5);
});

test("every painted pair has its pictures once made, and every picture its pair", () => {
  const byId = new Map(PAINTED.map((p) => [p.id, p]));
  for (const p of PAINTED) {
    expect(!!p.partner.emoji !== !!p.part, `${p.id}: an emoji or a part, exactly one`).toBe(true);
    const frames = !!framesOf(p.id);
    const made = frames && (!p.part || !!partImage(p.id));
    const part = !!p.part && !!partImage(p.id);
    expect(p.made, `${p.id}: made when all its pictures are there, "frames" or "part" when only those`).toBe(
      made ? true : frames && p.part ? "frames" : part ? "part" : undefined,
    );
    expect(PAIRS.some((q) => q.id === p.id)).toBe(made);
    expect(p.toThe, p.id).toBe(TOPICS[p.topic].kind === "helper" ? p.the : p.toThe);
    expect(p.sounds.length, p.id).toBeGreaterThan(0);
  }
  const files = (folder: string) => {
    const path = new URL(folder, import.meta.url).pathname;
    return existsSync(path) ? [...new Bun.Glob("*.webp").scanSync({ cwd: path })] : [];
  };
  for (const file of files("./bilder")) expect(byId.has(file.replace(/-[12]\.webp$/, "")) && /-[12]\.webp$/.test(file), `bilder/${file}`).toBe(true);
  for (const file of files("./bilder/teile")) expect(!!byId.get(file.replace(/\.webp$/, ""))?.part, `bilder/teile/${file}`).toBe(true);
});
