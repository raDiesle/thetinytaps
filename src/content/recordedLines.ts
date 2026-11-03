// What the games with ElevenLabs recordings (besides Bewegungsabenteuer, whose stories list their own lines) say, in
// every language they are translated into (or in German only so far, `germanOnly`): the list
// scripts/elevenlabs-voice.mjs records from, one MP3 per line in the game's stimme/ folder (src/lib/voice.ts plays them). German lines come from voiceLines.ts, the list on
// /management/; the other languages from each game's translations. A line a language has no translation of is said
// in German, so only translated lines get a recording in that language.

import { APP_LANGUAGES, type Localized } from "@/lib/language";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { voiceLines } from "@/content/voiceLines";
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

/**
 * A game recorded in German only so far (Was gehört zum Tier?, Gefühle, Schatten finden, Was gehört zusammen?,
 * Kettenreaktion, Aufs Töpfchen, Socken-Paare, November 2026): its other languages are
 * recorded only when the user asks (root CLAUDE.md), so until then they say nothing, and a `make` for other games
 * spends no credits on them. Its praise is said proudly, everything else warmly.
 */
const germanOnly =
  (href: string) =>
  (language: TargetLanguageId): RecordedLine[] =>
    language !== "de"
      ? []
      : once(
          (voiceLines().find((g) => g.href === href)?.groups ?? []).flatMap((g) =>
            g.lines.map((text) => ({ text, kind: g.label === "Lob" ? ("praise" as const) : ("instruction" as const) })),
          ),
        );

function goodNight(language: TargetLanguageId): RecordedLine[] {
  const text = GOOD_NIGHT[language];
  return text ? [{ text, kind: "calm" }] : [];
}

/** Every game recorded this way. */
export const RECORDED_GAMES: RecordedGame[] = [
  { name: "zaehne", folder: "src/games/teeth/stimme", lines: teeth },
  { name: "kleine-abenteuer", folder: "src/games/elevator/stimme", lines: elevator },
  { name: "gute-nacht", folder: "src/components/stimme", lines: goodNight },
  { name: "abstillen", folder: "src/games/weaning/stimme", lines: weaning },
  { name: "tiere", folder: "src/games/animals/stimme", lines: germanOnly("/tiere/") },
  { name: "gefuehle", folder: "src/games/feelings/stimme", lines: germanOnly("/gefuehle/") },
  { name: "schatten", folder: "src/games/shadows/stimme", lines: germanOnly("/schatten/") },
  { name: "zusammen", folder: "src/games/together/stimme", lines: germanOnly("/zusammen/") },
  { name: "kettenreaktion", folder: "src/games/marbles/stimme", lines: germanOnly("/kettenreaktion/") },
  { name: "toepfchen", folder: "src/games/potty/stimme", lines: germanOnly("/toepfchen/") },
  { name: "socken", folder: "src/games/socks/stimme", lines: germanOnly("/socken/") },
];

/** The languages these games are recorded in: the app's. */
export const RECORDED_LANGUAGES: TargetLanguageId[] = APP_LANGUAGES;
