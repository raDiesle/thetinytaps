// Thin wrapper around the browser's Web Speech API.

import { silent } from "./silent";

// Nicer voices first: online/neural voices sound far more natural than the
// compact system ones. Voices matching none of these come last.
const VOICE_RANKING = [/Google/, /Natural/, /Premium/, /Enhanced|Erweitert/, /Anna|Petra|Helena|Katja|Markus|Yannick|Viktor/];

const VOICE_NAME_KEY = "tinytaps.voice.v1";

function supported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

const rank = (voice: SpeechSynthesisVoice) => {
  const index = VOICE_RANKING.findIndex((pattern) => pattern.test(voice.name));
  return index === -1 ? VOICE_RANKING.length : index;
};

/**
 * Voices for `lang` (e.g. "de-DE"), nicest first. Empty if the browser has
 * none, or hasn't loaded them yet (see onVoicesChanged).
 */
export function voicesFor(lang: string): SpeechSynthesisVoice[] {
  if (!supported()) return [];
  const prefix = lang.slice(0, 2);
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.replace("_", "-").startsWith(prefix))
    .sort((a, b) => rank(a) - rank(b));
}

/** Calls `callback` when the browser has (re)loaded its voices; returns an unsubscribe function. */
export function onVoicesChanged(callback: () => void) {
  if (!supported()) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", callback);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", callback);
}

/** Name of the voice chosen by the parent, if any. */
export function savedVoiceName(): string | null {
  try {
    return localStorage.getItem(VOICE_NAME_KEY);
  } catch {
    return null;
  }
}

export function saveVoiceName(name: string) {
  try {
    localStorage.setItem(VOICE_NAME_KEY, name);
  } catch {
    // Storage disabled: the default voice is used next time.
  }
}

/**
 * The chosen voice for `lang`, else the nicest one, else null. Without network
 * only voices on the device itself (the online "Google" ones stay silent offline).
 */
export function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = voicesFor(lang).filter((v) => navigator.onLine || v.localService);
  return voices.find((v) => v.name === savedVoiceName()) ?? voices[0] ?? null;
}

/**
 * Speak `text`. By default anything still being spoken is cut off, so the
 * voice always matches what is on screen; pass `queue` to append instead.
 * Stays silent if there is no voice for `lang`, since e.g. an English voice
 * reading German words sounds wrong.
 */
export function speak(text: string, lang: string, { queue = false, rate = 0.85 } = {}) {
  if (!supported() || silent) return;
  const voice = pickVoice(lang);
  if (!voice) return;
  const synth = window.speechSynthesis;
  if (!queue) synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.voice = voice;
  utterance.rate = rate;
  utterance.pitch = 1.1;
  synth.speak(utterance);
}

export function stopSpeaking() {
  if (supported()) window.speechSynthesis.cancel();
}

/** Must be called from a user gesture: Safari only allows speech after one. */
export function unlockSpeech() {
  if (!supported()) return;
  const silent = new SpeechSynthesisUtterance("");
  silent.volume = 0;
  window.speechSynthesis.speak(silent);
}
