// Thin wrapper around the browser's Web Speech API.

import { silent } from "./silent";

// Nicer voices first: online/neural voices sound far more natural than the
// compact system ones. Voices matching none of these come last.
const VOICE_RANKING = [/Google/, /Natural/, /Premium/, /Enhanced|Erweitert/, /Anna|Petra|Helena|Katja|Markus|Yannick|Viktor/];

function supported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

const rank = (voice: SpeechSynthesisVoice) => {
  const index = VOICE_RANKING.findIndex((pattern) => pattern.test(voice.name));
  return index === -1 ? VOICE_RANKING.length : index;
};

/**
 * Voices for `lang` (e.g. "de-DE"), nicest first. Empty if the browser has
 * none, or hasn't loaded them yet.
 */
export function voicesFor(lang: string): SpeechSynthesisVoice[] {
  if (!supported()) return [];
  const prefix = lang.slice(0, 2);
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.replace("_", "-").startsWith(prefix))
    .sort((a, b) => rank(a) - rank(b));
}

/**
 * The nicest voice for `lang`, else null. Without network
 * only voices on the device itself (the online "Google" ones stay silent offline).
 */
export function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = voicesFor(lang).filter((v) => navigator.onLine || v.localService);
  return voices[0] ?? null;
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
