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

/**
 * The part of each song that repeats, in seconds, measured on its beat grid (`bun run song`): from just before the
 * first sung word to the same place in the bar after the last turnaround, a whole number of bars, so the beat goes on
 * across the jump. Looping inside the file rather than the whole file keeps it seamless in every browser, however it
 * trims the silence an MP3 starts and ends with. A song without an entry repeats the whole file.
 */
const LOOPS: Record<string, { loopStart: number; loopEnd: number }> = {
  // 100 BPM, beats at 0.48 + 0.6 k s; „Ich“ comes on the eighth before the first bar; 55 bars (verses, choruses,
  // bridge, the 8-bar turnaround), then the file holds a little of what follows, never reached.
  de: { loopStart: 0.08, loopEnd: 0.08 + 55 * 2.4 },
  // 97.42 BPM (Suno sang it a little slower than asked), beats at 0.898 + 0.6159 k s; „Си-“ comes on the eighth
  // before the first bar; 47 bars (verses, choruses, bridge, the instrumental after the last chorus), ending just
  // before the bass drops into an extra quiet chorus that is never reached.
  ru: { loopStart: 0.5, loopEnd: 0.5 + 47 * (240 / 97.42) },
  // 100.91 BPM on average (Suno sped up a little, from 99.6 to 101.7), the first verse's first bar at 0.5 s and „Me“
  // just after it; 48 bars (verses, choruses, bridge), from a tenth before that bar to the same place after the last
  // chorus, where Suno goes on into a bell interlude and sings the last verse again – never reached.
  es: { loopStart: 0.4, loopEnd: 0.4 + 48 * (240 / 100.91) },
  // 98.71 BPM (the choruses come exactly 8, 8, 12 and 8 bars apart), „I'm“ on the beat before the first bar at 0.5 s;
  // 44 bars (verses, choruses, bridge), from a tenth before „I'm“ to the same place after the last chorus, where the
  // backing goes on as before verse 2 and Suno ends with a few bars of outro – never reached.
  en: { loopStart: 0.4, loopEnd: 0.4 + 44 * (240 / 98.71) },
  // 100.0 BPM (the choruses come exactly 8, 8, 12 and 8 bars apart), a woodblock count-in before „पॉटी“ at 0.5 s;
  // 44 bars (verses, choruses, bridge), from a tenth before it to the same place after the last chorus, where the
  // backing goes on as before verse 2 and Suno ends with a few bars of bells – never reached.
  hi: { loopStart: 0.4, loopEnd: 0.4 + 44 * (240 / 100.007) },
};

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
    const part = (lang && LOOPS[lang]) || { loopStart: 0, loopEnd: song.duration };
    const loop: Loop | null = playLoop(song, { offset: part.loopStart, volume: ducked ? DUCKED : VOLUME, ...part });
    const timer = setInterval(() => {
      if (speaking() === ducked) return;
      ducked = !ducked;
      loop?.fade(ducked ? DUCKED : VOLUME, ducked ? 0.25 : 0.8);
    }, DUCK_CHECK_MS);
    return () => {
      clearInterval(timer);
      loop?.stop();
    };
  }, [playing, song, lang]);
}
