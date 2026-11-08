import voiceFiles from "./stimme/**/*.mp3?glob";
import type { TargetLanguage } from "@/content/targetLanguages";
import { waitingFor } from "@/lib/soundWait";
import { recordedVoice, type VoiceLine } from "@/lib/voice";
import { texts, type Story } from "./content";
import type { Film } from "./film/types";
import { spokenIn } from "./phrases";
import type { Station, TrailLevel } from "./trail/types";

// What the stories, levels and films say, from their ElevenLabs recordings (`bun run voice make`,
// src/content/recordedLines.ts): one file per sentence in stimme/ (German) or stimme/<language>/. The voice tells
// the story, so a sentence not recorded yet is said by the browser's voice meanwhile.
// A story, level or film loads only its own lines as it starts (the game has hundreds per language), and its first
// line holds the start until it is there (`linesReady`), so it comes with the picture.

const voice = recordedVoice(voiceFiles, { browser: true });

/** Says a German sentence of the game in `language`, or in German where its phrasebook has no translation. */
export function sayIn(german: string, language: TargetLanguage) {
  const { text, speechLang, english } = spokenIn(german, language);
  voice.say(text, language.id, { speechLang, english });
}

/** The recordings `sayIn` plays for these German sentences in `language`. */
const linesIn = (germans: (string | undefined)[], language: TargetLanguage): VoiceLine[] =>
  germans.flatMap((german) => {
    if (!german) return [];
    const { text, english } = spokenIn(german, language);
    return [{ text, english }];
  });

/** Starts fetching the recordings of these German sentences in `language` (not decoded), so each comes on time. */
export function loadLines(germans: (string | undefined)[], language: TargetLanguage) {
  voice.load(linesIn(germans, language), language.id);
}

/**
 * Starts loading these German sentences in `language` and gives a function that resolves once they are there (or
 * after SOUND_WAIT_MS): call it when the first of them is due. Only then, if they are still loading, the paw track of
 * `SoundLoading` shows – the moments the script waits anyway (a pose, the iris) load without it.
 */
export function linesReady(germans: (string | undefined)[], language: TargetLanguage): () => Promise<void> {
  const lines = linesIn(germans, language);
  const loaded = voice.ready(lines, language.id);
  return () => (voice.isReady(lines, language.id) ? loaded : waitingFor(loaded));
}

/** Everything a lift story says (and the lines every story may say). */
export const storyLines = (story: Story): (string | undefined)[] => [
  story.need.say,
  ...story.steps.flatMap((step) => [step.ask, step.done, ...(step.tasks ?? []).flatMap((task) => [task.wish?.ask, task.done])]),
  ...Object.values(texts),
];

/** Everything a trail level says, along every way. */
export function trailLines(level: TrailLevel): (string | undefined)[] {
  const lines: (string | undefined)[] = [level.away.say, level.finale.say];
  const station = (s: Station) => {
    lines.push(s.ask, s.done);
    if (s.kind === "obstacle" && s.befriends) lines.push(s.befriends.say);
  };
  for (const s of level.stations) {
    if (s.kind !== "fork") station(s);
    else {
      lines.push(s.ask);
      for (const way of s.ways) {
        lines.push(way.say);
        way.stations.forEach(station);
      }
    }
  }
  return lines;
}

/**
 * What a film says up to its next choice not yet made, for the picks so far: the scenes' lines, the choice's question and
 * options, and the end. Loaded again after each pick, so only the way taken is fetched.
 */
export function filmLines(film: Film, picks: string[]): (string | undefined)[] {
  const scenes = film.scenes(picks);
  const choice = scenes.filter((s) => s.choice).length > picks.length ? scenes.at(-1)?.choice : undefined;
  return [
    ...scenes.flatMap((scene) => scene.beats.flatMap((beat) => [beat.ask, beat.say])),
    ...(choice ? [choice.ask, ...choice.options.map((o) => o.say)] : []),
    film.end,
  ];
}
