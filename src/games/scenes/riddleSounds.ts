import riddleFiles from "./geraeusche/*.mp3?glob";
import { loadSound, playBuffer } from "@/lib/sfx";
import { playSound } from "./sounds";
import type { SceneSound } from "./types";

// The recordings of the „Geräusch-Rätsel“ (idea B-02, soundRiddle.ts), made with ElevenLabs into geraeusche/ (its
// README): clearer than the sounds every mode plays, since the sound alone is the question here. They are fetched only
// in that mode (user request, November 2026): the glob gives addresses, never the files, and nothing but
// `loadRiddleSounds`, which ScenePlay calls only while the mode is on, fetches one.

const URLS = new Map(Object.entries(riddleFiles).map(([file, url]) => [file.replace(/\.mp3$/, ""), url]));
const loaded = new Map<string, AudioBuffer>();
/** Recordings on their way or there; one that failed is taken out again, so a later picture asks again. */
const loading = new Map<string, Promise<unknown>>();

/** Starts fetching the riddle recordings of these sounds; a sound without one is skipped. */
export function loadRiddleSounds(sounds: Iterable<SceneSound>) {
  for (const sound of sounds) {
    const url = URLS.get(sound);
    if (!url || loading.has(sound)) continue;
    loading.set(
      sound,
      loadSound(url).then((buffer) => {
        if (buffer) loaded.set(sound, buffer);
        else loading.delete(sound);
      }),
    );
  }
}

/** Resolves once the riddle recording of `sound` is there, has failed, or when it has none (call `loadRiddleSounds` first). */
export const riddleSoundReady = (sound: SceneSound): Promise<unknown> => loading.get(sound) ?? Promise.resolve();

/** Plays the riddle recording of `sound` once it is loaded, else the sound every mode plays. */
export function playRiddleSound(sound: SceneSound) {
  const buffer = loaded.get(sound);
  if (buffer) playBuffer(buffer);
  else playSound(sound);
}
