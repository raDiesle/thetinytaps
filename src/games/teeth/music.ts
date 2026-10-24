import { useEffect, useRef, useState } from "react";
import { type Loop, loadSound, playLoop, playTuneNote } from "@/lib/sfx";

// The brushing song: whatever MP3 lies in musik/ (see the README there). With
// none, or while it is still loading, the synthesized tune plays instead.
const files = import.meta.webpackContext("./musik", { regExp: /\.mp3$/ });
const SONG_URL =
  files.keys().map((key) => {
    const module = files(key) as string | { default: string };
    return typeof module === "string" ? module : module.default;
  })[0] ?? null;

/** Loudness of the song; mastered music is much louder than the synthesized notes. */
const VOLUME = 0.35;
/** Loudness while the voice says what to do, so it can be understood. */
const DUCKED = 0.08;
/** How often to look whether the voice is speaking. */
const DUCK_CHECK_MS = 150;
const BEAT_MS = 280;

let song: Promise<AudioBuffer | null> | null = null;

/** Loads the song once per visit; null when there is none. */
const loadSong = () => {
  song ??= SONG_URL ? loadSound(SONG_URL) : Promise.resolve(null);
  return song;
};

const speaking = () => typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking;

/**
 * Background music while brushing. The song runs on repeat at the brushing time
 * `at` (ms), so after a pause or a jump it goes on where the brushing is; `sync`
 * is any value that changes exactly then (the timer's clock). While the voice
 * speaks, the song gets quiet.
 */
export function useBrushingMusic({ enabled, playing, sync, at }: { enabled: boolean; playing: boolean; sync: unknown; at: number }) {
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const atRef = useRef(at);
  atRef.current = at;

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    void loadSong().then((loaded) => {
      if (alive) setBuffer(loaded);
    });
    return () => {
      alive = false;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !playing) return;
    if (!buffer) {
      let beat = 0;
      const timer = setInterval(() => playTuneNote(beat++), BEAT_MS);
      return () => clearInterval(timer);
    }
    const loop: Loop | null = playLoop(buffer, Math.max(0, atRef.current) / 1000, speaking() ? DUCKED : VOLUME);
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
  }, [enabled, playing, sync, buffer]);
}
