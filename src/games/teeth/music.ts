import { useEffect, useRef, useState } from "react";
import { type Loop, loadSound, playLoop, playTuneNote } from "@/lib/sfx";
import { type SungTimes, sungLanguageOf } from "./sung";

// The brushing songs in musik/ (see the README there). Without one, or while it is
// still loading, the synthesized tune plays instead.
const files = import.meta.webpackContext("./musik", { regExp: /\.mp3$/ });
const timings = import.meta.webpackContext("./musik", { regExp: /\.json$/ });

/** The bundled URL of a song file, or null when it isn't there. */
const urlOf = (file: string) => {
  if (!files.keys().includes(file)) return null;
  const module = files(file) as string | { default: string };
  return typeof module === "string" ? module : module.default;
};

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
 * The instrumental song. It runs at 112 BPM with a new part every 8 bars (17.14 s) –
 * exactly one step of the two-minute brushing, so there the music changes just as
 * the next step begins.
 */
const PLAIN: Song = { file: "./musik-zaehneputzen.mp3", start: 0.27, finale: 120.27, loopEnd: 137.41 };

/**
 * The sung songs by language, found by their file names: one verse per step singing
 * what is shown, a finale for the end. Suno doesn't keep its verses equally long, so
 * the steps follow the verses (`sungSteps`) instead of the other way round.
 */
const SUNG: Record<string, Song & SungTimes> = Object.fromEntries(
  files.keys().flatMap((file) => {
    const lang = sungLanguageOf(file);
    const times = file.replace(/\.mp3$/, ".json");
    if (!lang || !timings.keys().includes(times)) return [];
    const module = timings(times) as SungTimes | { default: SungTimes };
    const { verses } = "default" in module ? module.default : module;
    const finale = verses[verses.length - 1];
    return [[lang, { file, verses, start: verses[0], finale, loopEnd: finale }]];
  }),
);

/** The languages with a sung song, for the settings. */
export const SUNG_LANGUAGES = Object.keys(SUNG).sort();

/** With the song sung in `lang`: when each step begins, in ms of brushing, and last when the brushing ends. Null without one. */
export function sungSteps(lang: string | null): number[] | null {
  const song = lang ? SUNG[lang] : undefined;
  return song ? song.verses.map((t) => Math.round((t - song.start) * 1000)) : null;
}

/** Loudness of the song; mastered music is much louder than the synthesized notes. */
const VOLUME = 0.35;
/** Loudness while the voice says what to do, so it can be understood. */
const DUCKED = 0.08;
/** How often to look whether the voice is speaking. */
const DUCK_CHECK_MS = 150;
const BEAT_MS = 280;

const loading = new Map<string, Promise<AudioBuffer | null>>();

/** Loads a song once per visit; null when there is none. */
const loadSong = ({ file }: Song) => {
  const url = urlOf(file);
  if (!loading.has(file)) loading.set(file, url ? loadSound(url) : Promise.resolve(null));
  return loading.get(file) as Promise<AudioBuffer | null>;
};

/** Where in `song` the brushing is after `ms`, going round the repeating parts. */
const songAt = (song: Song, ms: number) => song.start + ((Math.max(0, ms) / 1000) % (song.loopEnd - song.start));

const speaking = () => typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking;

/**
 * Background music while brushing. The song runs at the brushing time `at` (ms),
 * so after a pause or a jump it goes on where the brushing is; `sync` is any value
 * that changes exactly then (the timer's clock). When `finished`, the finale plays
 * once to the final chord. While the voice speaks, the song gets quiet.
 * With `sung`, the song in that language plays if there is one. Returns whether
 * the sung song is playing, so the voice can leave the singing to it.
 */
export function useBrushingMusic({
  enabled,
  sung,
  playing,
  finished,
  sync,
  at,
}: {
  enabled: boolean;
  sung: string | null;
  playing: boolean;
  finished: boolean;
  sync: unknown;
  at: number;
}) {
  const song = (sung && SUNG[sung]) || PLAIN;
  const [loaded, setLoaded] = useState<{ song: Song; buffer: AudioBuffer | null } | null>(null);
  const buffer = loaded?.song === song ? loaded.buffer : null;
  const atRef = useRef(at);
  atRef.current = at;

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    void loadSong(song).then((buffer) => {
      if (alive) setLoaded({ song, buffer });
    });
    return () => {
      alive = false;
    };
  }, [enabled, song]);

  useEffect(() => {
    if (!enabled || !(playing || finished)) return;
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
  }, [enabled, playing, finished, sync, song, buffer]);

  return enabled && buffer !== null && song !== PLAIN;
}
