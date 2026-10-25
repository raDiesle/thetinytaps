import { useEffect, useState, useSyncExternalStore } from "react";
import { downloadMusic } from "@/lib/musicFile";
import { decodeSound, type Loop, playLoop } from "@/lib/sfx";

// The song every game plays in the background (downloaded in musicFile.ts), unless
// the game has its own music or must stay quiet. It is on by default and switched
// off for all games in the options on the home page. Without the file there is no music.

/**
 * Where things are in the song, in seconds. It runs at 97 BPM with a new part
 * every 8 bars (19.79 s); it goes round the first eight parts, right before the
 * break Suno put after them. Measure again for a new song.
 */
const SONG = {
  /** First beat of the first part. */
  start: 0.46,
  /** End of the eighth part: the song goes back to `start` here. */
  loopEnd: 158.81,
};

/** Loudness of the song: below the tap sounds, which are what the games are about. */
const VOLUME = 0.25;
/** Loudness while the voice speaks, so it can be understood. */
const DUCKED = 0.06;
/** How often to look whether the voice is speaking. */
const DUCK_CHECK_MS = 150;

let song: Promise<AudioBuffer | null> | null = null;

/** The decoded song, once per visit; null when there is none. */
const loadSong = () => {
  song ??= downloadMusic().then((data) => (data ? decodeSound(data) : null));
  return song;
};

// Where the song was when it last stopped, so in the next game (or after a trip
// into another picture) it goes on there instead of starting over.
let stoppedAt = SONG.start;

/** Where in the song it is `seconds` after starting from `from`, going round the parts. */
const songAt = (from: number, seconds: number) => SONG.start + ((from - SONG.start + seconds) % (SONG.loopEnd - SONG.start));

const speaking = () => typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking;

const hidden = () => typeof document !== "undefined" && document.hidden;

// How many mounted parts of the game want the song off (see useNoBackgroundMusic).
let hushes = 0;
const listeners = new Set<() => void>();
const notify = () => {
  for (const listener of listeners) listener();
};
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/**
 * Keeps the background song off while the calling component is mounted (and
 * `when` holds): for games with music of their own, a microphone that would hear
 * it, or a picture that is about falling asleep.
 */
export function useNoBackgroundMusic(when = true) {
  useEffect(() => {
    if (!when) return;
    hushes++;
    notify();
    return () => {
      hushes--;
      notify();
    };
  }, [when]);
}

/**
 * The background song while a game is played (`enabled`), from the child's first
 * tap or key (`started`). It stops while the page is hidden or a game part wants
 * quiet, and gets quiet while the voice speaks.
 */
export function useBackgroundMusic({ enabled, started }: { enabled: boolean; started: boolean }) {
  const hushed = useSyncExternalStore(subscribe, () => hushes > 0);
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [visible, setVisible] = useState(() => !hidden());
  const on = enabled && !hushed;

  useEffect(() => {
    if (!on) return;
    let alive = true;
    void loadSong().then((loaded) => {
      if (alive) setBuffer(loaded);
    });
    return () => {
      alive = false;
    };
  }, [on]);

  useEffect(() => {
    const onChange = () => setVisible(!hidden());
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  useEffect(() => {
    if (!on || !started || !visible || !buffer) return;
    const from = stoppedAt;
    const startedAt = performance.now();
    const loop: Loop | null = playLoop(buffer, {
      offset: from,
      volume: speaking() ? DUCKED : VOLUME,
      loopStart: SONG.start,
      loopEnd: SONG.loopEnd,
      fadeIn: 1.5,
    });
    let ducked = speaking();
    const timer = setInterval(() => {
      if (speaking() === ducked) return;
      ducked = !ducked;
      loop?.fade(ducked ? DUCKED : VOLUME, ducked ? 0.25 : 0.8);
    }, DUCK_CHECK_MS);
    return () => {
      clearInterval(timer);
      loop?.stop();
      stoppedAt = songAt(from, (performance.now() - startedAt) / 1000);
    };
  }, [on, started, visible, buffer]);
}
