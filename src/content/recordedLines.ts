// What the games with ElevenLabs recordings (besides Bewegungsabenteuer, whose stories list their own lines) say, in
// every language they are translated into: the list
// scripts/elevenlabs-voice.mjs records from, one MP3 per line in the game's stimme/ folder (src/lib/voice.ts plays them). German lines come from voiceLines.ts, the list on
// /management/; the other languages from each game's translations. A line a language has no translation of is said
// in German, so only translated lines get a recording in that language.

import { APP_LANGUAGES, type Localized } from "@/lib/language";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { voiceLines } from "@/content/voiceLines";
import { AGAIN_ONLY, AGAIN_OR_NEXT } from "@/components/GameEnd";
import { GOOD_NIGHT } from "@/components/GameShell";
import { translationOf } from "@/games/elevator/phrases";
import { DAYTIME, DAYTIME_TRANSLATIONS } from "@/games/teeth/daytime";
import { type Step, STEP_TRANSLATIONS, STEPS } from "@/games/teeth/steps";
import { DONE_SAY, PRELUDE, TIDY_SAY } from "@/games/teeth/TeethPlay";
import { STEPS as STEPS_WEANING } from "@/games/weaning/content";

/** How a line is said: the recording script puts an audio tag for it in front. */
export type RecordedKind = "instruction" | "praise" | "calm";

/** One line to record. */
export interface RecordedLine {
  text: string;
  kind: RecordedKind;
}

/** A game whose lines are recorded, and where its recordings go. */
export interface RecordedGame {
  /** A short name for the script's output. */
  name: string;
  /** The folder of its German recordings, from the repository root; the other languages go in <folder>/<language>/. */
  folder: string;
  /** Everything it says in `language`, each line once. */
  lines: (language: TargetLanguageId) => RecordedLine[];
}

/** Each text once, without empty ones. */
const once = (lines: (RecordedLine | false | "" | undefined)[]) => {
  const seen = new Set<string>();
  return lines.filter((l): l is RecordedLine => !!l && !!l.text.trim() && !seen.has(l.text) && !!seen.add(l.text));
};

/** The German lines of a game on the /management/ list (voiceLines.ts). */
const germanOf = (href: string) =>
  voiceLines()
    .find((g) => g.href === href)
    ?.groups.flatMap((g) => g.lines) ?? [];

function teeth(language: TargetLanguageId): RecordedLine[] {
  const daytimes = (["morning", "evening"] as const).map((d) => (language === "de" ? DAYTIME[d] : DAYTIME_TRANSLATIONS[language]?.[d]));
  const daytime = (key: "hello" | "grow" | "after", kind: RecordedKind) => daytimes.map((d) => d?.[key] && { text: d[key], kind });
  const said = (texts: Localized | undefined, kind: RecordedKind) => {
    const text = texts?.[language];
    return text !== undefined && { text, kind };
  };
  const cue = (step: Step) => (language === "de" ? step.cue : STEP_TRANSLATIONS[language]?.[step.id]?.cue);
  return once([
    ...daytime("hello", "instruction"),
    ...daytime("grow", "instruction"),
    ...Object.values(PRELUDE).map((p) => said(p.cue, "instruction")),
    said(DONE_SAY, "praise"),
    said(TIDY_SAY, "instruction"),
    ...daytime("after", "calm"),
    ...STEPS.map((step) => cue(step) && { text: cue(step)!, kind: "instruction" as const }),
  ]);
}

function elevator(language: TargetLanguageId): RecordedLine[] {
  return once(
    germanOf("/kleine-abenteuer/").map((german) => {
      const text = translationOf(german, language);
      return text !== undefined && { text, kind: "instruction" };
    }),
  );
}

function weaning(language: TargetLanguageId): RecordedLine[] {
  return once(STEPS_WEANING.map((step) => step.line[language] !== undefined && { text: step.line[language]!, kind: "calm" as const }));
}

/** The list of `voiceLines.ts` in each language, built once: it reads every game's data. */
const LISTS = new Map<TargetLanguageId, ReturnType<typeof voiceLines>>();
const listIn = (language: TargetLanguageId) => {
  if (!LISTS.has(language)) LISTS.set(language, voiceLines(language));
  return LISTS.get(language)!;
};

/**
 * A game whose lines `voiceLines.ts` lists in every language (November 2026: the user asked for every language).
 * Its praise is said proudly, everything else warmly. A line a language has no translation of yet is said in German
 * there, which has no recording in that language, so a line of another language that is also one of the German lines
 * is left out – unless the game's texts are whole in each language (`whole`, the letters' language packs, where an
 * English „A!“ is English).
 */
const spoken =
  (href: string, { whole = false }: { whole?: boolean } = {}) =>
  (language: TargetLanguageId): RecordedLine[] => {
    const groups = (lang: TargetLanguageId) => listIn(lang).find((g) => g.href === href)?.groups ?? [];
    const german = language === "de" || whole ? new Set<string>() : new Set(groups("de").flatMap((g) => g.lines));
    return once(
      groups(language).flatMap((g) =>
        g.lines.filter((text) => !german.has(text)).map((text) => ({ text, kind: g.label === "Lob" ? ("praise" as const) : ("instruction" as const) })),
      ),
    );
  };

/** What every game says: good night when play time is over, and the question at a level's end (GameEnd). */
function allGames(language: TargetLanguageId): RecordedLine[] {
  return once([
    GOOD_NIGHT[language] !== undefined && { text: GOOD_NIGHT[language]!, kind: "calm" as const },
    ...[AGAIN_OR_NEXT, AGAIN_ONLY].map((line) => line[language] !== undefined && { text: line[language]!, kind: "instruction" as const }),
  ]);
}

/**
 * Every game recorded this way. Lebendige Bilder is not here and must not come without the user ordering it: its lines
 * are parked (`parked` in voiceLines.ts, src/games/scenes/CLAUDE.md).
 */
export const RECORDED_GAMES: RecordedGame[] = [
  { name: "zaehne", folder: "src/games/teeth/stimme", lines: teeth },
  { name: "kleine-abenteuer", folder: "src/games/elevator/stimme", lines: elevator },
  { name: "alle-spiele", folder: "src/components/stimme", lines: allGames },
  { name: "abstillen", folder: "src/games/weaning/stimme", lines: weaning },
  { name: "tiere", folder: "src/games/animals/stimme", lines: spoken("/tiere/") },
  { name: "gefuehle", folder: "src/games/feelings/stimme", lines: spoken("/gefuehle/") },
  { name: "schatten", folder: "src/games/shadows/stimme", lines: spoken("/schatten/") },
  { name: "zusammen", folder: "src/games/together/stimme", lines: spoken("/zusammen/") },
  { name: "kettenreaktion", folder: "src/games/marbles/stimme", lines: spoken("/kettenreaktion/") },
  { name: "toepfchen", folder: "src/games/potty/stimme", lines: spoken("/toepfchen/") },
  { name: "socken", folder: "src/games/socks/stimme", lines: spoken("/socken/") },
  { name: "timer", folder: "src/games/timer/stimme", lines: spoken("/timer/") },
  { name: "buchstaben", folder: "src/games/letters/stimme", lines: spoken("/buchstaben/", { whole: true }) },
];

/** The languages these games are recorded in: the app's. */
export const RECORDED_LANGUAGES: TargetLanguageId[] = APP_LANGUAGES;
