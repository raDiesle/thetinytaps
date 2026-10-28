import type { LanguageId } from "@/content/languages";
import type { TargetLanguageId } from "@/content/targetLanguages";
import type { LanguagePack } from "@/content/types";
import type { StoryTranslation } from "@/games/adventure/stories/story";
import type { AnimalTranslation } from "@/games/animals/content";
import type { ComfortId, FeelingId } from "@/games/feelings/bear";
import type { SituationId } from "@/games/feelings/kita";
import type { ComfortText, FeelingText, SituationText } from "@/games/feelings/localized";
import type { SceneTranslation } from "@/games/scenes/types";
import type { ShadowTranslation } from "@/games/shadows/content";
import type { SockTexts } from "@/games/socks/content";
import type { Daytime, DaytimeTexts } from "@/games/teeth/daytime";
import type { StepId, StepTexts } from "@/games/teeth/steps";

// The texts of each language besides German that live in files of their own (the letters and words pack,
// scene translations, phrasebooks, stories), gathered into one module per language (texts-<id>.ts), so a
// visit downloads only the language it plays in: the app language is loaded before the first screen
// (loadAppLanguage in src/lib/language.ts), another one only when a grown-up switches to it. German is
// written into the code itself and always there. The service worker keeps only the languages a page has
// loaded (tools/build.ts leaves texts-*.js out of the files it keeps for every visitor).
//
// The games keep their tables by language (`PHRASEBOOKS`, `SHADOW_TRANSLATIONS`, …); `byLanguage` makes such
// a table and fills it as languages load, so a game reads it as before.

/** Every language with texts of its own besides German. */
export type TextsLanguageId = Exclude<TargetLanguageId | LanguageId, "de">;

/** All texts of one language that live in files of their own; a part the language has no translation of yet is left out. */
export interface LanguageTexts {
  /** The pack of the letters and words games (`src/content/<id>.ts`). */
  pack?: LanguagePack;
  /** Lebendige Bilder: each picture's translation by scene id (`scenes/<scene>/<id>.ts`). */
  scenes?: Record<string, SceneTranslation>;
  /** Kleine Abenteuer: the phrasebook by German sentence (`elevator/<id>.ts`). */
  elevator?: Record<string, string>;
  /** Tiere füttern (`animals/content.<id>.ts`). */
  animals?: AnimalTranslation;
  /** Schatten (`shadows/content.<id>.ts`). */
  shadows?: ShadowTranslation;
  /** Socken-Paare (`socks/content.<id>.ts`); German fills the gaps. */
  socks?: Partial<SockTexts>;
  /** Zähne putzen: the steps by step id (`teeth/steps.<id>.ts`). */
  teethSteps?: Partial<Record<StepId, Partial<StepTexts>>>;
  /** Zähne putzen: morning and evening (`teeth/daytime.<id>.ts`). */
  teethDaytime?: Record<Daytime, Partial<DaytimeTexts>>;
  /** Gefühle, Zu Hause: the kind things and the bear's feelings (`feelings/bear.<id>.ts`). */
  comforts?: Partial<Record<ComfortId, ComfortText>>;
  feelings?: Partial<Record<FeelingId, FeelingText>>;
  /** Gefühle, Im Kindergarten (`feelings/kita.<id>.ts`). */
  situations?: Partial<Record<SituationId, SituationText>>;
  /** Bewegungsabenteuer: Tapsi's lines by story folder (`adventure/stories/<story>/lines.<id>.ts`). */
  stories?: Partial<Record<"cloudTrip" | "treasureIsland", StoryTranslation>>;
}

/** Each language's module; a dynamic import each, so each becomes a chunk of its own (texts-<id>.<hash>.js). */
const MODULES: Record<TextsLanguageId, () => Promise<{ TEXTS: LanguageTexts }>> = {
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

const loaded = new Map<TextsLanguageId, LanguageTexts>();
const loading = new Map<TextsLanguageId, Promise<void>>();
const fillers = new Set<(id: TextsLanguageId, texts: LanguageTexts) => void>();

/** Whether the texts of `id` are there (German always is). */
export const hasTexts = (id: TargetLanguageId | LanguageId) => id === "de" || loaded.has(id);

/** Downloads the texts of `id` once and fills every table made with `byLanguage`; fails when offline and not kept. */
export function loadTexts(id: TargetLanguageId | LanguageId): Promise<void> {
  if (id === "de" || loaded.has(id)) return Promise.resolve();
  const running =
    loading.get(id) ??
    MODULES[id]().then(
      ({ TEXTS }) => {
        loaded.set(id, TEXTS);
        for (const fill of fillers) fill(id, TEXTS);
      },
      (error: unknown) => {
        // A later try (back online) starts afresh.
        loading.delete(id);
        throw error;
      },
    );
  loading.set(id, running);
  return running;
}

/** Calls `fill` for every language loaded so far and for each one loaded later. */
export function onTexts(fill: (id: TextsLanguageId, texts: LanguageTexts) => void) {
  for (const [id, texts] of loaded) fill(id, texts);
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
