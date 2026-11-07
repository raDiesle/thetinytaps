import { targetLanguageFor } from "@/content/targetLanguages";
import { pageStill } from "@/lib/pageMotion";
import { audioContext, loadSound } from "@/lib/sfx";
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

/** The voice of one game: the recordings in its stimme/ folder and the folders below (a `?glob` import of their MP3s). */
export interface RecordedVoice {
  /** Starts loading the recordings of `texts` in `language`, so each plays right when it is due. */
  load: (texts: string[], language: string) => void;
  /** Starts loading every recording in `language` and the German ones, for a game that says only a few lines. */
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

const buffers = new Map<string, Promise<AudioBuffer | null>>();
const loadUrl = (url: string) => {
  let buffer = buffers.get(url);
  if (!buffer) {
    buffer = loadSound(url);
    buffers.set(url, buffer);
  }
  return buffer;
};

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
    source.connect(ac.destination);
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
  /** When this voice's last line that only accompanies the play was said (`say`'s `gap`). */
  let lastAside = Number.NEGATIVE_INFINITY;
  return {
    load: (texts, language) => {
      for (const text of texts) {
        const url = urlOf(text, language);
        if (url) void loadUrl(url);
      }
    },
    loadAll: (language) => {
      // The language's own recordings and, for the others, the English ones that stand in for missing lines.
      const own = language === "de" ? /^[0-9a-f]{8}$/ : new RegExp(`^(${language}|en)-[0-9a-f]{8}$`);
      for (const [name, url] of urls) if (own.test(name)) void loadUrl(url);
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
      const buffer = loadUrl(url);
      chain = chain.then(
        counted(async () => {
          await pageStill();
          const decoded = await buffer;
          if (decoded && at === generation) await play(decoded);
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
