import songFiles from "./musik/*.mp3?glob";
import { useEffect, useState } from "react";
import { type Loop, loadSound, playLoop, playWaitNote } from "@/lib/sfx";
import { BEAT_MS } from "./content";

// The waiting song while the animal sits on the potty: musik/musik-toepfchen-warten-<lang>.mp3,
// found by its file name, so a new language needs only its file (see the README there).
// Sitting lasts as long as it lasts, so the song repeats until the tap that ends it.

/** The language code in a waiting song's file name, or null for any other file. */
export const waitLanguageOf = (file: string) => /musik-toepfchen-warten-([a-z]{2})\.mp3$/.exec(file)?.[1] ?? null;

/** The language the waiting song is sung in: the app language, German when there is none in it, null when there is no song at all. */
export const waitLanguageFor = (appLanguage: string, available: readonly string[]) =>
  available.includes(appLanguage) ? appLanguage : available.includes("de") ? "de" : null;

/** The bundled waiting songs by language. */
const SONGS: Record<string, string> = Object.fromEntries(
  Object.entries(songFiles).flatMap(([file, url]) => {
    const lang = waitLanguageOf(file);
    return lang ? [[lang, url]] : [];
  }),
);

/** Loudness of the song; mastered music is much louder than the synthesized notes. */
const VOLUME = 0.35;
/** Loudness while the voice speaks, so it can be understood. */
const DUCKED = 0.08;
const DUCK_CHECK_MS = 150;

const loading = new Map<string, Promise<AudioBuffer | null>>();

const speaking = () => typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking;

/**
 * Plays the waiting song in `appLanguage` (see waitLanguageFor) over and over while
 * `playing`, getting quiet while the voice speaks; the synthesized tune repeats
 * instead while there is no song or it still loads. It stops when `playing` ends.
 */
export function useWaitingMusic(playing: boolean, appLanguage: string) {
  const lang = waitLanguageFor(appLanguage, Object.keys(SONGS));
  const [buffer, setBuffer] = useState<{ lang: string; buffer: AudioBuffer | null } | null>(null);
  const song = buffer?.lang === lang ? buffer.buffer : null;

  // Loaded when sitting begins, not before: most visits never get that far.
  useEffect(() => {
    if (!playing || !lang) return;
    let alive = true;
    if (!loading.has(lang)) loading.set(lang, loadSound(SONGS[lang]));
    void loading.get(lang)?.then((loaded) => {
      if (alive) setBuffer({ lang, buffer: loaded });
    });
    return () => {
      alive = false;
    };
  }, [playing, lang]);

  useEffect(() => {
    if (!playing) return;
    if (!song) {
      let beat = 0;
      playWaitNote(beat++);
      const timer = setInterval(() => playWaitNote(beat++), BEAT_MS);
      return () => clearInterval(timer);
    }
    let ducked = speaking();
    const loop: Loop | null = playLoop(song, { offset: 0, volume: ducked ? DUCKED : VOLUME });
    const timer = setInterval(() => {
      if (speaking() === ducked) return;
      ducked = !ducked;
      loop?.fade(ducked ? DUCKED : VOLUME, ducked ? 0.25 : 0.8);
    }, DUCK_CHECK_MS);
    return () => {
      clearInterval(timer);
      loop?.stop();
    };
  }, [playing, song]);
}
