import type { LanguageId } from "@/content/languages";
import type { TargetLanguageId } from "@/content/targetLanguages";
import type { SeoTranslation } from "@/content/seo";
import type { LanguagePack } from "@/content/types";
import type { StoryTranslation } from "@/games/adventure/stories/story";
import type { AnimalTranslation } from "@/games/animals/content";
import type { CauseTranslation } from "@/games/cause/scenes";
import type { ComfortId, FeelingId } from "@/games/feelings/bear";
import type { DayText } from "@/games/feelings/days";
import type { SituationId } from "@/games/feelings/kita";
import type { ComfortText, FeelingText, SituationText } from "@/games/feelings/localized";
import type { MilkChainTranslation } from "@/games/milkchain/milkChain";
import type { SceneTranslation } from "@/games/scenes/types";
import type { ShadowTranslation } from "@/games/shadows/content";
import type { SockTexts } from "@/games/socks/content";
import type { TogetherTranslation } from "@/games/together/pairs";
import type { DaytimeTexts } from "@/games/teeth/daytime";
import type { Daytime } from "@/lib/days";
import type { StepId, StepTexts } from "@/games/teeth/steps";

// The texts of each language that live in files of their own (the letters and words pack, scene translations,
// phrasebooks, stories), gathered into one module per language (texts-<id>.ts), so a visit downloads only the
// language it plays in: the app language is loaded before the first screen (loadAppLanguage in
// src/lib/language.ts), another one only when a grown-up switches to it. The older games are written German first
// into the code itself, so German plays without its module; texts-de.ts holds only the German translations of
// what is written English first (since November 2026, root CLAUDE.md), and where it can't be loaded those show
// in English. The service worker keeps only the languages a page has loaded (tools/build.ts leaves texts-*.js out
// of the files it keeps for every visitor).
//
// The biggest games' texts (Was gehört zusammen?, Gefühle, Kleine Abenteuer: about half of a language's texts) are
// parts of their own (`TextsPart`, texts-<id>-<part>.ts), loaded only with their game's page (`withTexts` in
// src/lib/language.ts, App.tsx), so the first screen of a visit in another language doesn't wait for them (R-P4).
//
// The games keep their tables by language (`PHRASEBOOKS`, `SHADOW_TRANSLATIONS`, …); `byLanguage` makes such
// a table and fills it as languages load, so a game reads it as before.

/** Every language with texts of its own (German only for translations of English-first content). */
export type TextsLanguageId = TargetLanguageId | LanguageId;

/** All texts of one language that live in files of their own; a part the language has no translation of yet is left out. */
export interface LanguageTexts {
  /** The pack of the letters and words games (`src/content/<id>.ts`). */
  pack?: LanguagePack;
  /** Lebendige Bilder: each picture's translation by scene id (`scenes/<scene>/<id>.ts`). */
  scenes?: Record<string, SceneTranslation>;
  /** Kleine Abenteuer: the phrasebook by German sentence, and by English one for the films written English first (`elevator/<id>.ts`, German only for those), in its part (`texts-<id>-elevator.ts`). */
  elevator?: Record<string, string>;
  /** Tiere füttern (`animals/content.<id>.ts`). */
  animals?: AnimalTranslation;
  /** Schatten (`shadows/content.<id>.ts`). */
  shadows?: ShadowTranslation;
  /** Socken-Paare (`socks/content.<id>.ts`); German fills the gaps. */
  socks?: Partial<SockTexts>;
  /** Was gehört zusammen?: each pair's sentences (`together/content.<id>.ts`), in its part; German fills the gaps. */
  together?: TogetherTranslation;
  /** Zähne putzen: the steps by step id (`teeth/steps.<id>.ts`). */
  teethSteps?: Partial<Record<StepId, Partial<StepTexts>>>;
  /** Zähne putzen: morning and evening (`teeth/daytime.<id>.ts`). */
  teethDaytime?: Record<Daytime, Partial<DaytimeTexts>>;
  /** Gefühle, Zu Hause: the kind things and the bear's feelings (`feelings/bear.<id>.ts`); all of Gefühle is in its part. */
  comforts?: Partial<Record<ComfortId, ComfortText>>;
  feelings?: Partial<Record<FeelingId, FeelingText>>;
  /** Gefühle, Im Kindergarten (`feelings/kita.<id>.ts`). */
  situations?: Partial<Record<SituationId, SituationText>>;
  /** Gefühle, the days' pages of the story by day id (`feelings/days.<id>.ts`). */
  days?: Partial<Record<string, DayText>>;
  /** Tapsis Milchkette: chapter titles and pages (`milkchain/<id>.ts`). */
  milkChain?: MilkChainTranslation;
  /** Tapsi und die Schnullerfee: chapter titles and pages (`pacifierstory/<id>.ts`). */
  pacifierStory?: MilkChainTranslation;
  /** Tapsi geht in die Kita: chapter titles and pages (`kitastory/<id>.ts`). */
  kitaStory?: MilkChainTranslation;
  /** Tapsi and the Foam Crown, written English first: chapter titles and pages (`hairstory/<id>.ts`, German too). */
  hairStory?: MilkChainTranslation;
  /** Was ist passiert?: each scene's words for grown-ups by scene id (`cause/scenes.<id>.ts`). */
  cause?: CauseTranslation;
  /** What search engines read on the pages under /<id>/, shown below a menu's first screen too (`content/seo.<id>.ts`). */
  seo?: SeoTranslation;
  /** Bewegungsabenteuer: Tapsi's lines by story folder (`adventure/stories/<story>/lines.<id>.ts`). */
  stories?: Partial<Record<"cloudTrip" | "fireRescue" | "treasureIsland", StoryTranslation>>;
}

/** Each language's module; a dynamic import each, so each becomes a chunk of its own (texts-<id>.<hash>.js). */
const MODULES: Record<TextsLanguageId, () => Promise<{ TEXTS: LanguageTexts }>> = {
  de: () => import("./texts-de"),
  en: () => import("./texts-en"),
  zh: () => import("./texts-zh"),
  hi: () => import("./texts-hi"),
  es: () => import("./texts-es"),
  ar: () => import("./texts-ar"),
  ru: () => import("./texts-ru"),
  it: () => import("./texts-it"),
  tr: () => import("./texts-tr"),
  pl: () => import("./texts-pl"),
};

/** Every language with texts of its own, e.g. for the tests, which load them all. */
export const TEXTS_LANGUAGES = Object.keys(MODULES) as TextsLanguageId[];

/**
 * The parts loaded only with their game's page, each language's a chunk of its own (texts-<id>-<part>.<hash>.js, which
 * src/lib/offlineParts.ts knows by its name); a language without one (German, but for Kleine Abenteuer's English-first films) loads nothing for it.
 */
const PART_MODULES = {
  together: {
    en: () => import("./texts-en-together"),
    zh: () => import("./texts-zh-together"),
    hi: () => import("./texts-hi-together"),
    es: () => import("./texts-es-together"),
    ar: () => import("./texts-ar-together"),
    ru: () => import("./texts-ru-together"),
  },
  feelings: {
    en: () => import("./texts-en-feelings"),
    zh: () => import("./texts-zh-feelings"),
    hi: () => import("./texts-hi-feelings"),
    es: () => import("./texts-es-feelings"),
    ar: () => import("./texts-ar-feelings"),
    ru: () => import("./texts-ru-feelings"),
  },
  elevator: {
    de: () => import("./texts-de-elevator"),
    en: () => import("./texts-en-elevator"),
    zh: () => import("./texts-zh-elevator"),
    hi: () => import("./texts-hi-elevator"),
    es: () => import("./texts-es-elevator"),
    ar: () => import("./texts-ar-elevator"),
    ru: () => import("./texts-ru-elevator"),
  },
} satisfies Record<string, Partial<Record<TextsLanguageId, () => Promise<{ TEXTS: LanguageTexts }>>>>;

/** A game's texts loaded with its page rather than before the first screen (`withTexts` in src/lib/language.ts). */
export type TextsPart = keyof typeof PART_MODULES;

/** Every part, e.g. for the tests and tools, which load them all (`loadEveryText`). */
export const TEXTS_PARTS = Object.keys(PART_MODULES) as TextsPart[];

/** The texts loaded so far, the language's own (by id) and its parts' (by `<id>-<part>`), in the order they came. */
const loaded = new Map<string, { id: TextsLanguageId; texts: LanguageTexts }>();
const loading = new Map<string, Promise<void>>();
const fillers = new Set<(id: TextsLanguageId, texts: LanguageTexts) => void>();

/** Downloads one module of texts once under `key` and fills every table made with `byLanguage`. */
function loadModule(key: string, id: TextsLanguageId, load: () => Promise<{ TEXTS: LanguageTexts }>): Promise<void> {
  if (loaded.has(key)) return Promise.resolve();
  const running =
    loading.get(key) ??
    load().then(
      ({ TEXTS }) => {
        loaded.set(key, { id, texts: TEXTS });
        for (const fill of fillers) fill(id, TEXTS);
      },
      (error: unknown) => {
        // A later try (back online) starts afresh.
        loading.delete(key);
        throw error;
      },
    );
  loading.set(key, running);
  return running;
}

/** Whether the texts of `id` are there (its own; its parts by `hasTextsPart`). */
export const hasTexts = (id: TargetLanguageId | LanguageId) => loaded.has(id);

/** Downloads the texts of `id` once and fills every table made with `byLanguage`; fails when offline and not kept. */
export const loadTexts = (id: TargetLanguageId | LanguageId): Promise<void> => loadModule(id, id, MODULES[id]);

/** The module of `part` in `id`, if that language has one. */
const partModule = (part: TextsPart, id: TextsLanguageId): (() => Promise<{ TEXTS: LanguageTexts }>) | undefined =>
  (PART_MODULES[part] as Partial<Record<TextsLanguageId, () => Promise<{ TEXTS: LanguageTexts }>>>)[id];

/** Whether `part` is there in `id`; always where the language has no such part. */
export const hasTextsPart = (part: TextsPart, id: TargetLanguageId | LanguageId) => !partModule(part, id) || loaded.has(`${id}-${part}`);

/** Downloads `part` in `id` once, like `loadTexts`; nothing where the language has no such part. */
export function loadTextsPart(part: TextsPart, id: TargetLanguageId | LanguageId): Promise<void> {
  const load = partModule(part, id);
  return load ? loadModule(`${id}-${part}`, id, load) : Promise.resolve();
}

/** The texts of `id` with every part, for the tests and tools that read every game in every language. */
export const loadEveryText = (id: TargetLanguageId | LanguageId) => Promise.all([loadTexts(id), ...TEXTS_PARTS.map((part) => loadTextsPart(part, id))]);

/** Calls `fill` for every language (and part) loaded so far and for each one loaded later. */
export function onTexts(fill: (id: TextsLanguageId, texts: LanguageTexts) => void) {
  for (const { id, texts } of loaded.values()) fill(id, texts);
  fillers.add(fill);
}

/**
 * A table by language, filled from each language's texts as it loads: `byLanguage((texts) => texts.elevator)`.
 * With `german`, the German entry is there from the start, so the table is a `Localized` for `pick`.
 */
export function byLanguage<T>(select: (texts: LanguageTexts) => T | undefined): Partial<Record<TextsLanguageId, T>>;
export function byLanguage<T>(select: (texts: LanguageTexts) => T | undefined, german: T): { de: T } & Partial<Record<TextsLanguageId, T>>;
export function byLanguage<T>(select: (texts: LanguageTexts) => T | undefined, german?: T) {
  const table: Partial<Record<TextsLanguageId | "de", T>> = german === undefined ? {} : { de: german };
  onTexts((id, texts) => {
    const value = select(texts);
    if (value !== undefined) table[id] = value;
  });
  return table;
}
