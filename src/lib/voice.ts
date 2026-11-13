import { targetLanguageFor } from "@/content/targetLanguages";
import { pageStill } from "@/lib/pageMotion";
import { audioContext, decodeSound, speaker } from "@/lib/sfx";
import { atMost, waitingFor } from "./soundWait";
import { speak, stopSpeaking } from "./speech";
import { recordingName } from "./voiceName";

// What the games say, from high-quality ElevenLabs recordings (scripts/elevenlabs-voice.mjs, `bun run voice`):
// one file per line in the game's stimme/ folder (German) or stimme/<language>/ (the others), named by the hash
// of the line's text (voiceName.ts). They play always, like a sound, without a switch. A line without a recording
// (new or changed, not recorded yet) stays silent – unless the game's story is told by the voice and can't be
// followed without it (`browser`): there the browser's voice (Google's, where there is one) says it until the
// recording is made (user decision, October 2026). Nothing is said while a book opens or a page turns: a line waits
// until the page lies still (pageMotion.ts).
// A line the app language has no recording of is said from its English recording where there is one, else not at all –
// never the German recording, which a child hearing Russian or Spanish can't follow (user decision, November 2026).

// What is loaded when (user request, November 2026: the voices are over 200 MB in all): a game loads the lines of the
// round or scene on screen and of the next one (`load`), never all its lines at once (`loadAll` only for a voice of a
// few dozen lines, `voice.test.ts` checks), and holds a round until its lines are there (`ready`, `useVoiceReady`),
// with the paw track of `SoundLoading` while it waits. Files stay for the visit (a few MB at most); decoded lines
// take ten times that, so a line is decoded only when it is said (or a round waits for it) and only the last
// KEEP_SECONDS of them stay decoded.

/** A line to load: its text, or its text and the same line in English (`say`'s `english`). */
export type VoiceLine = string | { text: string; english?: string };

/** The voice of one game: the recordings in its stimme/ folder and the folders below (a `?glob` import of their MP3s). */
export interface RecordedVoice {
  /** Starts fetching the recordings of `lines` in `language`, so each plays right when it is due (this round's and the next's). */
  load: (lines: VoiceLine[], language: string) => void;
  /**
   * Loads the recordings of `lines` in `language`; resolves once all are there (or failed, or after SOUND_WAIT_MS), so a
   * round can start with its first line on time.
   */
  ready: (lines: VoiceLine[], language: string) => Promise<void>;
  /** True when every recording of `lines` in `language` is fetched (or has none). */
  isReady: (lines: VoiceLine[], language: string) => boolean;
  /** Starts loading every recording in `language`, for a game that says only a few dozen lines (`voice.test.ts`). */
  loadAll: (language: string) => void;
  /**
   * Says `text`, a line in `language` – or the German line where the game had no translation and fell back to it, which
   * has no recording in `language` then. `english` is the same line in English: where `language` has no recording of
   * `text`, its English recording plays instead, and where that is missing too, nothing (`recordingUrl`).
   * Cuts off what is being said unless `queue`, which waits for it. With `gap` (ms) it is a line that only accompanies
   * the play (praise like „Ein Paar!“, `ASIDE_LINE_GAP_MS` in spacing.ts): said only when this voice's last such line
   * lies at least `gap` back, and unless `queue`d only while nothing else is said or waiting – never cutting another
   * line off, so quick answers don't chop line after line.
   */
  say: (text: string, language: string, options?: { queue?: boolean; speechLang?: string; gap?: number; english?: string }) => void;
  /** True when `text` has a recording in `language`. */
  has: (text: string, language: string) => boolean;
}

/** How many seconds of decoded lines stay in memory (about 190 kB a second): enough for this round and the next. */
export const KEEP_SECONDS = 150;

/** Every recording fetched or being fetched, by URL: the file itself, about a tenth of its decoded size. */
const files = new Map<string, Promise<ArrayBuffer | null>>();
/** Recordings whose file is here. */
const fetched = new Set<string>();
/** The decoded recordings, the one used last at the end, at most KEEP_SECONDS of them (`forgetOld`). */
const decoded = new Map<string, AudioBuffer>();
/** Recordings being decoded. */
const decoding = new Map<string, Promise<AudioBuffer | null>>();

/** The file at `url`, fetched once per visit; null when it failed (offline), and then tried again next time. */
function fileOf(url: string) {
  const known = files.get(url);
  if (known) return known;
  const file = fetch(url)
    .then((response) => (response.ok ? response.arrayBuffer() : null))
    .catch(() => null)
    .then((bytes) => {
      if (bytes) fetched.add(url);
      else files.delete(url);
      return bytes;
    });
  files.set(url, file);
  return file;
}

/** The decoded recording at `url`: from memory, else decoded (again) from its file. */
function soundOf(url: string): Promise<AudioBuffer | null> {
  const known = decoded.get(url);
  if (known) {
    // Used again: to the end, so it is the last to go.
    decoded.delete(url);
    decoded.set(url, known);
    return Promise.resolve(known);
  }
  let sound = decoding.get(url);
  if (!sound) {
    // Decoding uses the bytes up, so it gets a copy and the file stays for the next time.
    sound = fileOf(url)
      .then((bytes) => (bytes ? decodeSound(bytes.slice(0)) : null))
      .then((buffer) => {
        decoding.delete(url);
        if (buffer) {
          decoded.set(url, buffer);
          forgetOld(decoded);
        }
        return buffer;
      });
    decoding.set(url, sound);
  }
  return sound;
}

/**
 * Drops the decoded lines used longest ago until those left last at most `keep` seconds; their files stay, so one
 * that comes back is only decoded again. A line already waiting to be said keeps its own buffer.
 */
export function forgetOld(sounds: Map<string, { duration: number }>, keep = KEEP_SECONDS) {
  let seconds = 0;
  for (const sound of sounds.values()) seconds += sound.duration;
  for (const [url, sound] of sounds) {
    if (seconds <= keep) return;
    sounds.delete(url);
    seconds -= sound.duration;
  }
}

/**
 * The recording of `text` in `language` among `urls` (file name without .mp3 → URL); where `language` has none, that
 * of `english`, the same line in English – never the German one, which a child hearing another language can't follow.
 * German and English themselves have no further fallback.
 */
export function recordingUrl(urls: ReadonlyMap<string, string>, text: string, language: string, english?: string) {
  const own = urls.get(recordingName(text, language));
  if (own || language === "de" || language === "en" || english === undefined) return own;
  return urls.get(recordingName(english, "en"));
}

/** The recording playing now, if any. */
let playing: AudioBufferSourceNode | null = null;
/** Lines that wait for each other play one after the other on this chain. */
let chain: Promise<void> = Promise.resolve();
/** Counts up with every hush, so lines queued before it stay silent. */
let generation = 0;
/** Lines asked for and not yet over (still waiting for the page, loading or playing), in every game. */
let pending = 0;

function play(buffer: AudioBuffer) {
  const ac = audioContext();
  if (!ac) return Promise.resolve();
  return new Promise<void>((done) => {
    const source = ac.createBufferSource();
    source.buffer = buffer;
    source.connect(speaker(ac));
    source.onended = () => {
      if (playing === source) playing = null;
      done();
    };
    playing = source;
    source.start();
  });
}

/**
 * A game's voice from its recording files (file path → URL). With `browser`, a line without a recording (English ones included) is said by
 * the browser's voice, in `speechLang` (the voice of the language the text is in) or else `language`'s – only for
 * games whose story is told by the voice (`voiceLines.test.ts` keeps the list).
 */
export function recordedVoice(files: Record<string, string>, { browser = false }: { browser?: boolean } = {}): RecordedVoice {
  const urls = new Map(Object.entries(files).map(([file, url]) => [file.slice(file.lastIndexOf("/") + 1, -4), url]));
  const urlOf = (text: string, language: string, english?: string) => recordingUrl(urls, text, language, english);
  const urlsOf = (lines: VoiceLine[], language: string) =>
    lines.flatMap((line) => {
      const url = typeof line === "string" ? urlOf(line, language) : urlOf(line.text, language, line.english);
      return url ? [url] : [];
    });
  /** When this voice's last line that only accompanies the play was said (`say`'s `gap`). */
  let lastAside = Number.NEGATIVE_INFINITY;
  return {
    load: (lines, language) => {
      if (!audioContext()) return;
      // Only the files: decoding a line takes a moment when it is said, and a decoded line ten times the memory.
      for (const url of urlsOf(lines, language)) void fileOf(url);
    },
    ready: async (lines, language) => {
      if (!audioContext()) return;
      await atMost(Promise.all(urlsOf(lines, language).map(soundOf)));
    },
    isReady: (lines, language) => !audioContext() || urlsOf(lines, language).every((url) => decoded.has(url) || fetched.has(url)),
    loadAll: (language) => {
      if (!audioContext()) return;
      // The language's own recordings and, for the others, the English ones that stand in for missing lines.
      const own = language === "de" ? /^[0-9a-f]{8}$/ : new RegExp(`^(${language}|en)-[0-9a-f]{8}$`);
      for (const [name, url] of urls) if (own.test(name)) void fileOf(url);
    },
    say: (text, language, { queue = false, speechLang, gap, english } = {}) => {
      if (gap !== undefined) {
        const now = performance.now();
        // Queued, it waits its turn behind the lines before it; else it would cut them off, so it stays silent.
        if ((!queue && (pending > 0 || talking())) || now - lastAside < gap) return;
        lastAside = now;
      }
      const url = urlOf(text, language, english);
      if (!queue) hush();
      const at = generation;
      if (!url) {
        if (browser)
          chain = chain.then(
            counted(async () => {
              await pageStill();
              if (at === generation) speak(text, speechLang ?? targetLanguageFor(language).speechLang, { queue });
            }),
          );
        return;
      }
      if (!audioContext()) return;
      const buffer = soundOf(url);
      chain = chain.then(
        counted(async () => {
          await pageStill();
          // Due and not there yet: the paw track shows until it is (SoundLoading), so the child sees it is coming.
          const sound = fetched.has(url) || at !== generation ? await buffer : await waitingFor(atMost(buffer));
          if (sound && at === generation) await play(sound);
        }),
      );
    },
    has: (text, language) => urlOf(text, language) !== undefined,
  };
}

/**
 * A line's turn on the chain, counted in `pending` from now until it is over. A line that fails stays silent and
 * leaves the chain going, so the lines after it (and `pending`) are not stuck.
 */
function counted(run: () => Promise<void>) {
  pending++;
  return () =>
    run()
      .catch(() => undefined)
      .finally(() => pending--);
}

/** Stops what is being said and everything waiting to be said, in every game. */
export function hush() {
  generation++;
  chain = Promise.resolve();
  playing?.stop();
  playing = null;
  stopSpeaking();
}

/** True while a line is being said, from its recording or by the browser's voice (Tapsi's mouth moves). */
export const talking = () => playing !== null || (typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking);

/**
 * True when no line is said nor waiting to be said, in any game: a round goes on to the next only then, so the line
 * of the round before is never cut off (user feedback, November 2026, Was gehört zum Tier?).
 */
export const voiceQuiet = () => pending === 0 && !talking();
