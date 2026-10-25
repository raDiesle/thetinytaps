import { audioContext, loadSound } from "@/lib/sfx";
import type { TargetLanguage } from "@/content/targetLanguages";
import { speak, stopSpeaking } from "@/lib/speech";
import { DEFAULT_TURN, type Story } from "./stories/story";
import { recordingName, spokenLines } from "./voiceId";

// Tapsi's recorded voice: a warm coach voice made with ElevenLabs
// (scripts/elevenlabs-voice.mjs, `yarn voice`), one file per line in the
// story's stimme/ folder (German) or stimme/<language>/ (the others). A line with
// a recording plays from its file; any other line falls back to the browser's
// voice, so a line changed but not recorded again is still said.

const files = import.meta.webpackContext("./stories", { recursive: true, regExp: /\/stimme\/(?:[a-z]{2}\/[a-z]{2}-)?[0-9a-f]{8}\.mp3$/ });
/** Each recording by its file name (recordingName). */
const URLS = new Map<string, string>();
for (const key of files.keys()) {
  const module = files(key) as string | { default: string };
  URLS.set(key.slice(key.lastIndexOf("/") + 1, -4), typeof module === "string" ? module : module.default);
}

const buffers = new Map<string, Promise<AudioBuffer | null>>();
const load = (url: string) => {
  let buffer = buffers.get(url);
  if (!buffer) {
    buffer = loadSound(url);
    buffers.set(url, buffer);
  }
  return buffer;
};

const recordingOf = (text: string, language: TargetLanguage) => URLS.get(recordingName(text, language.id));

/** Starts loading the recordings of a story's lines (already in `language`), so each plays right when it is due. */
export function loadVoice(story: Story, language: TargetLanguage) {
  for (const { text } of spokenLines(story.opening?.lines ?? [], story.lines, DEFAULT_TURN)) {
    const url = recordingOf(text, language);
    if (url) void load(url);
  }
}

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
 * Says `text`: its recording if there is one, else with the browser's voice.
 * Like speak(), cuts off what is being said unless `queue`, which waits for it.
 */
export function say(text: string, language: TargetLanguage, { queue = false } = {}) {
  const url = recordingOf(text, language);
  if (!queue) hush();
  // Without a recording it does not wait for one still playing; that only happens while lines are being recorded anew.
  if (!url || !audioContext()) {
    speak(text, language.speechLang, { queue: true });
    return;
  }
  const at = generation;
  const buffer = load(url);
  chain = chain.then(async () => {
    const decoded = await buffer;
    if (decoded && at === generation) await play(decoded);
  });
}

/** Stops what is being said and everything waiting to be said. */
export function hush() {
  generation++;
  chain = Promise.resolve();
  playing?.stop();
  playing = null;
  stopSpeaking();
}

/** True while a line is being said, recorded or by the browser: Tapsi's mouth moves. */
export const talking = () => playing !== null || (typeof speechSynthesis !== "undefined" && speechSynthesis.speaking);
