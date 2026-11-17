import { useCallback, useEffect, useRef, useState } from "react";
import { appLanguage, pick, useAppLanguage, type Localized } from "@/lib/language";
import { loadRecordings } from "@/lib/sfx";
import { hush, recordedVoice } from "@/lib/voice";
import { useVoiceReady } from "@/lib/voiceReady";
import { RECORDED_SOUNDS, SOUNDS, type OopsSound, type SoundName } from "./story";
import type { FeelingsSettings } from "./settings";
import voiceFiles from "./stimme/**/*.mp3?glob";

/** Said with the laugh when a good idea is chosen, one at random. */
export const PRAISE: Localized<string[]> = {
  de: ["Juhu!", "Ja!", "Super!"],
  ru: ["Ура!", "Да!", "Молодец!"],
  en: ["Yay!", "Yes!", "Great!"],
  zh: ["耶！", "对！", "真棒！"],
  hi: ["वाह!", "हाँ!", "शाबाश!"],
  es: ["¡Bien!", "¡Sí!", "¡Genial!"],
  ar: ["رائع!", "نعم!", "أحسنت!"],
};

/** How long the green frame and the laugh stay before the bear does the good thing. */
export const CHEER_MS = 1100;

/** The red frame stays at least this long, even when nothing is said: long enough to see what went wrong. */
export const OOPS_MS = 2600;

/**
 * A good idea was chosen: a laugh and „Juhu!“. Nothing floats up or hops: the picture of the good idea, with the
 * bear relieved and happy, is the answer (user feedback, November 2026).
 */
export function cheer(say: (text: string) => void, sound: (name: SoundName) => void) {
  const praise = pick(PRAISE, appLanguage());
  sound("laugh");
  say(praise[Math.floor(Math.random() * praise.length)]);
}

/** A not-so-good idea was chosen: what it leads to, heard – „Aua!“, a crash, or crying; its picture shows the rest. */
export function oops(heard: OopsSound | undefined, sound: (name: SoundName) => void) {
  sound(heard ?? "cry");
}

// What the game says, from its ElevenLabs recordings (`bun run voice make --only gefuehle`, src/content/recordedLines.ts):
// one file per line in stimme/ (German; every other app language in stimme/<language>/, November 2026). A line not recorded yet
// stays silent.
const voice = recordedVoice(voiceFiles);

/**
 * Speech and sounds: each line from its recording in the app language, a line not translated yet (still German) from
 * its German one. `voiced` tells whether a line has a recording, so a story waits for it to be said – also while the
 * voice is switched off (`FeelingsSettings.voice`), so a grown-up telling the story has the same time for it.
 */
export function useVoice(settings: FeelingsSettings) {
  const language = useAppLanguage();
  useEffect(() => {
    if (settings.sounds) loadRecordings(RECORDED_SOUNDS);
  }, [settings.sounds]);

  // Read when a line is due, not when it was planned: switched off mid-story, the lines already waiting stay silent too.
  const speaking = useRef(settings.voice);
  speaking.current = settings.voice;
  useEffect(() => {
    if (!settings.voice) hush();
  }, [settings.voice]);

  const say = useCallback(
    (text: string, queue = false) => {
      if (speaking.current) voice.say(text, language.id, { queue });
    },
    [language.id],
  );
  const voiced = useCallback((text: string) => voice.has(text, language.id), [language.id]);
  /** Starts loading the recordings of a story's lines, so each is said right when its picture comes; nothing while the voice is off. */
  const preload = useCallback(
    (texts: (string | undefined)[]) => {
      if (speaking.current)
        voice.load(
          texts.filter((t): t is string => !!t),
          language.id,
        );
    },
    [language.id],
  );

  const sound = useCallback(
    (name: SoundName | undefined) => {
      if (name && settings.sounds) SOUNDS[name]();
    },
    [settings.sounds],
  );

  return { say, sound, voiced, preload };
}

/**
 * Whether a scene or page may start telling: true once the recordings of `lines` (what it opens with) are loaded, or
 * after SOUND_WAIT_MS, with the paw track meanwhile (`useVoiceReady`). Then `next` loads quietly: the rest of the scene
 * and the opening of the one after it, so a whole day never loads at once. Once true it stays true, so switching the
 * voice back on never stops a scene that began. With the voice off nothing is loaded and it is true at once – the
 * story still waits for each line's length (`voiced`).
 */
export function useLinesReady(settings: FeelingsSettings, lines: string[], next: string[] = []) {
  const language = useAppLanguage();
  const ready = useVoiceReady(voice, lines.filter(Boolean), language.id, { next: next.filter(Boolean), enabled: settings.voice });
  const [begun, setBegun] = useState(ready);
  if (ready && !begun) setBegun(true);
  return begun || ready;
}
