import songFiles from "./musik/*.mp3?glob";
import timingFiles from "./musik/*.json?glob";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { audioContext, decodeSound, type Loop, playLoop, playTuneNote } from "@/lib/sfx";
import { type SungTimes, sungLanguageOf } from "./sung";

// The sung brushing songs in musik/ (see the README there). While one is still
// loading, or when it can't be loaded, the synthesized tune plays instead.
/** The bundled URL of a song file, or null when it isn't there. */
const urlOf = (file: string) => songFiles[file] ?? null;

/** A song file and where things are in it, in seconds. Measure again for a new song. */
interface Song {
  file: string;
  /** First beat of the first part: brushing time 0 plays from here. */
  start: number;
  /** The eighth part, after seven parts: plays on to the final chord when the brushing is done. */
  finale: number;
  /** End of the eighth part; while brushing, the song goes back to `start` here (a pause and the final chord follow). */
  loopEnd: number;
}

/**
 * The sung songs by language, found by their file names: one verse per step singing
 * what is shown, a finale for the end. Suno doesn't keep its verses equally long, so
 * the steps follow the verses (`sungSteps`) instead of the other way round.
 */
const SUNG: Record<string, Song & SungTimes> = Object.fromEntries(
  Object.keys(songFiles).flatMap((file) => {
    const lang = sungLanguageOf(file);
    const times = timingFiles[file.replace(/\.mp3$/, ".json")] as unknown as SungTimes | undefined;
    if (!lang || !times) return [];
    const { verses } = times;
    const finale = verses[verses.length - 1];
    return [[lang, { file, verses, start: verses[0], finale, loopEnd: finale }]];
  }),
);

/** The languages with a sung song. */
export const SUNG_LANGUAGES = Object.keys(SUNG).sort();

/** With the song sung in `lang`: when each step begins, in ms of brushing, and last when the brushing ends. */
export function sungSteps(lang: string): number[] {
  const song = SUNG[lang];
  return song.verses.map((t) => Math.round((t - song.start) * 1000));
}

/** Loudness of the song; mastered music is much louder than the synthesized notes. */
const VOLUME = 0.35;
/** Loudness while the voice says what to do, so it can be understood. */
const DUCKED = 0.08;
/** How often to look whether the voice is speaking. */
const DUCK_CHECK_MS = 150;
const BEAT_MS = 280;

/** How far a song has come: downloaded share, then the decoded sound. */
interface SongLoad {
  /** Share of the file downloaded, 0–1; stays 0 when the size isn't known. */
  progress: number;
  /** The decoded song once it is there; null when it can't be loaded. */
  buffer?: AudioBuffer | null;
}

const loads = new Map<string, SongLoad>();
const listeners = new Set<() => void>();
const LOADING: SongLoad = { progress: 0 };

const report = (file: string, load: SongLoad) => {
  loads.set(file, load);
  for (const listener of listeners) listener();
};

/** Downloads the file in pieces, so a loading bar can show how far it is. */
async function download(file: string, url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  const total = Number(response.headers.get("content-length")) || 0;
  if (!response.body || !total) return response.arrayBuffer();
  const reader = response.body.getReader();
  const pieces: BlobPart[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return new Blob(pieces).arrayBuffer();
    pieces.push(value);
    received += value.length;
    // A compressed answer states its compressed size; then the bar just waits at the end.
    report(file, { progress: Math.min(1, received / total) });
  }
}

/** Loads a song once per visit; its buffer is null when there is none or it fails. */
function loadSong({ file }: Song) {
  if (loads.has(file)) return;
  const url = urlOf(file);
  if (!url || !audioContext()) return report(file, { progress: 1, buffer: null });
  report(file, LOADING);
  void download(file, url)
    .then(decodeSound, () => null)
    .then((buffer) => report(file, { progress: 1, buffer }));
}

/**
 * Starts loading the song sung in `sung` as soon as the game is chosen in the menu, so it
 * is there by the time the brushing begins: a 2-minute song is a few MB, and switching from
 * the stand-in tune to it, or decoding it, in the middle of brushing makes the picture stutter.
 */
export function preloadSong(sung: string) {
  if (SUNG[sung]) loadSong(SUNG[sung]);
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** How far the song sung in `sung` has loaded; `ready` also when it can't be loaded (then the stand-in tune plays). */
export function useSongLoad(sung: string): { ready: boolean; progress: number; buffer: AudioBuffer | null } {
  const song = SUNG[sung];
  useEffect(() => loadSong(song), [song]);
  const load = useSyncExternalStore(subscribe, () => loads.get(song.file) ?? LOADING);
  return { ready: load.buffer !== undefined, progress: load.progress, buffer: load.buffer ?? null };
}

/** Where in `song` the brushing is after `ms`, going round the repeating parts. */
const songAt = (song: Song, ms: number) => song.start + ((Math.max(0, ms) / 1000) % (song.loopEnd - song.start));

const speaking = () => typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking;

/**
 * The song sung in `sung` while brushing, always – even when music is off for all
 * games, because the song is the brushing: it sings each step and sets how long it
 * lasts. It runs at the brushing time `at` (ms), so after a pause or a jump it goes
 * on where the brushing is; `sync` is any value that changes exactly then (the
 * timer's clock). When `finished`, the finale plays once to the final chord. While
 * the voice speaks, the song gets quiet. Returns whether the song is playing, so
 * the voice can leave the steps to it.
 */
export function useBrushingMusic({ sung, playing, finished, sync, at }: { sung: string; playing: boolean; finished: boolean; sync: unknown; at: number }) {
  const song = SUNG[sung];
  const { buffer } = useSongLoad(sung);
  const atRef = useRef(at);
  atRef.current = at;

  useEffect(() => {
    if (!(playing || finished)) return;
    if (!buffer) {
      if (finished) return;
      let beat = 0;
      const timer = setInterval(() => playTuneNote(beat++), BEAT_MS);
      return () => clearInterval(timer);
    }
    const volume = speaking() ? DUCKED : VOLUME;
    const now = songAt(song, atRef.current);
    let loop: Loop | null;
    if (finished) {
      // At the end of the brushing the song is just at the finale and goes on without a break; after a jump it goes there.
      const goesOn = now >= song.finale && now < song.finale + 1;
      loop = playLoop(buffer, { offset: goesOn ? now : song.finale, volume, once: true, fadeIn: goesOn ? 0.05 : 0.4 });
    } else {
      loop = playLoop(buffer, { offset: now, volume, loopStart: song.start, loopEnd: song.loopEnd });
    }
    let ducked = speaking();
    const timer = setInterval(() => {
      if (speaking() === ducked) return;
      ducked = !ducked;
      loop?.fade(ducked ? DUCKED : VOLUME, ducked ? 0.25 : 0.8);
    }, DUCK_CHECK_MS);
    return () => {
      clearInterval(timer);
      loop?.stop();
    };
  }, [playing, finished, sync, song, buffer]);

  return buffer !== null;
}
