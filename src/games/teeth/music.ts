import { useEffect, useRef, useState } from "react";
import { type Loop, loadSound, playLoop, playTuneNote } from "@/lib/sfx";

// The brushing song musik/zaehneputzen.mp3 (see the README there). Without it,
// or while it is still loading, the synthesized tune plays instead.
const files = import.meta.webpackContext("./musik", { regExp: /\.mp3$/ });
const SONG_FILE = "./zaehneputzen.mp3";
const songModule = files.keys().includes(SONG_FILE) ? (files(SONG_FILE) as string | { default: string }) : null;
const SONG_URL = typeof songModule === "string" ? songModule : (songModule?.default ?? null);

/**
 * Where things are in the song, in seconds. It runs at 112 BPM with a new part
 * every 8 bars (17.14 s) – exactly one step of the two-minute brushing, so there
 * the music changes just as the next step begins. Measure again for a new song.
 */
const SONG = {
  /** First beat of the first part: brushing time 0 plays from here. */
  start: 0.27,
  /** The eighth part, after seven parts: plays on to the final chord when the brushing is done. */
  finale: 120.27,
  /** End of the eighth part; while brushing, the song goes back to `start` here (a pause and the final chord follow). */
  loopEnd: 137.41,
};

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

/** Where in the song the brushing is after `ms`, going round the repeating parts. */
const songAt = (ms: number) => SONG.start + ((Math.max(0, ms) / 1000) % (SONG.loopEnd - SONG.start));

const speaking = () => typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking;

/**
 * Background music while brushing. The song runs at the brushing time `at` (ms),
 * so after a pause or a jump it goes on where the brushing is; `sync` is any value
 * that changes exactly then (the timer's clock). When `finished`, the finale plays
 * once to the final chord. While the voice speaks, the song gets quiet.
 */
export function useBrushingMusic({
  enabled,
  playing,
  finished,
  sync,
  at,
}: {
  enabled: boolean;
  playing: boolean;
  finished: boolean;
  sync: unknown;
  at: number;
}) {
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
    if (!enabled || !(playing || finished)) return;
    if (!buffer) {
      if (finished) return;
      let beat = 0;
      const timer = setInterval(() => playTuneNote(beat++), BEAT_MS);
      return () => clearInterval(timer);
    }
    const volume = speaking() ? DUCKED : VOLUME;
    const now = songAt(atRef.current);
    let loop: Loop | null;
    if (finished) {
      // After two minutes the song is just at the finale and goes on without a break; otherwise it jumps there.
      const goesOn = now >= SONG.finale && now < SONG.finale + 1;
      loop = playLoop(buffer, { offset: goesOn ? now : SONG.finale, volume, once: true, fadeIn: goesOn ? 0.05 : 0.4 });
    } else {
      loop = playLoop(buffer, { offset: now, volume, loopStart: SONG.start, loopEnd: SONG.loopEnd });
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
  }, [enabled, playing, finished, sync, buffer]);
}
