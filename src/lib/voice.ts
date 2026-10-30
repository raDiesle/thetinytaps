import { targetLanguageFor } from "@/content/targetLanguages";
import { audioContext, loadSound } from "@/lib/sfx";
import { speak, stopSpeaking } from "./speech";
import { recordingName } from "./voiceName";

// What the games say, from high-quality ElevenLabs recordings (scripts/elevenlabs-voice.mjs, `bun run voice`):
// one file per line in the game's stimme/ folder (German) or stimme/<language>/ (the others), named by the hash
// of the line's text (voiceName.ts). They play always, like a sound, without a switch. A line without a recording
// (new or changed, not recorded yet) stays silent – unless the game's story is told by the voice and can't be
// followed without it (`browser`): there the browser's voice (Google's, where there is one) says it until the
// recording is made (user decision, October 2026).

/** The voice of one game: the recordings in its stimme/ folder and the folders below (a `?glob` import of their MP3s). */
export interface RecordedVoice {
  /** Starts loading the recordings of `texts` in `language`, so each plays right when it is due. */
  load: (texts: string[], language: string) => void;
  /** Starts loading every recording in `language` and the German ones, for a game that says only a few lines. */
  loadAll: (language: string) => void;
  /**
   * Says `text`, a line in `language` – or the German line where the game had no translation and fell back to it.
   * Cuts off what is being said unless `queue`, which waits for it.
   */
  say: (text: string, language: string, options?: { queue?: boolean; speechLang?: string }) => void;
  /** True when `text` has a recording in `language` (or in German). */
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

/** The recording playing now, if any. */
let playing: AudioBufferSourceNode | null = null;
/** Lines that wait for each other play one after the other on this chain. */
let chain: Promise<void> = Promise.resolve();
/** Counts up with every hush, so lines queued before it stay silent. */
let generation = 0;

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
 * A game's voice from its recording files (file path → URL). With `browser`, a line without a recording is said by
 * the browser's voice, in `speechLang` (the voice of the language the text is in) or else `language`'s – only for
 * games whose story is told by the voice (`voiceLines.test.ts` keeps the list).
 */
export function recordedVoice(files: Record<string, string>, { browser = false }: { browser?: boolean } = {}): RecordedVoice {
  const urls = new Map(Object.entries(files).map(([file, url]) => [file.slice(file.lastIndexOf("/") + 1, -4), url]));
  // A text with no recording in the language is a German fallback line of the game: its German recording.
  const urlOf = (text: string, language: string) => urls.get(recordingName(text, language)) ?? urls.get(recordingName(text, "de"));
  return {
    load: (texts, language) => {
      for (const text of texts) {
        const url = urlOf(text, language);
        if (url) void loadUrl(url);
      }
    },
    loadAll: (language) => {
      const own = language === "de" ? /^[0-9a-f]{8}$/ : new RegExp(`^(${language}-)?[0-9a-f]{8}$`);
      for (const [name, url] of urls) if (own.test(name)) void loadUrl(url);
    },
    say: (text, language, { queue = false, speechLang } = {}) => {
      const url = urlOf(text, language);
      if (!queue) hush();
      if (!url) {
        if (browser) speak(text, speechLang ?? targetLanguageFor(language).speechLang, { queue });
        return;
      }
      if (!audioContext()) return;
      const at = generation;
      const buffer = loadUrl(url);
      chain = chain.then(async () => {
        const decoded = await buffer;
        if (decoded && at === generation) await play(decoded);
      });
    },
    has: (text, language) => urlOf(text, language) !== undefined,
  };
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
