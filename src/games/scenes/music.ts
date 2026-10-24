import { useEffect, useState } from "react";
import { type Loop, loadSound, playLoop } from "@/lib/sfx";

// The song musik/lebendige-bilder.mp3 (see the README there). Without it there is
// no music; the pictures have their own sounds anyway.
const files = import.meta.webpackContext("./musik", { regExp: /\.mp3$/ });
const SONG_FILE = "./lebendige-bilder.mp3";
const songModule = files.keys().includes(SONG_FILE) ? (files(SONG_FILE) as string | { default: string }) : null;
const SONG_URL = typeof songModule === "string" ? songModule : (songModule?.default ?? null);

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

/** Loudness of the song: below the tap sounds, which are what the picture is about. */
const VOLUME = 0.25;
/** Loudness while the voice speaks, so it can be understood. */
const DUCKED = 0.06;
/** How often to look whether the voice is speaking. */
const DUCK_CHECK_MS = 150;

let song: Promise<AudioBuffer | null> | null = null;

/** Loads the song once per visit; null when there is none. */
const loadSong = () => {
  song ??= SONG_URL ? loadSound(SONG_URL) : Promise.resolve(null);
  return song;
};

// Where the song was when it last stopped, so after a trip into another picture
// (a new ScenePlay) it goes on there instead of starting over.
let stoppedAt = SONG.start;

/** Where in the song it is `seconds` after starting from `from`, going round the parts. */
const songAt = (from: number, seconds: number) => SONG.start + ((from - SONG.start + seconds) % (SONG.loopEnd - SONG.start));

const speaking = () => typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking;

const hidden = () => typeof document !== "undefined" && document.hidden;

/**
 * Background music in a picture once `started` (the child tapped, or followed a
 * vehicle in). It stops while the page is hidden and gets quiet while the voice speaks.
 */
export function useSceneMusic({ enabled, started }: { enabled: boolean; started: boolean }) {
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null);
  const [visible, setVisible] = useState(() => !hidden());

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
    const onChange = () => setVisible(!hidden());
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  useEffect(() => {
    if (!enabled || !started || !visible || !buffer) return;
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
  }, [enabled, started, visible, buffer]);
}
