// Thin wrapper around the browser's Web Speech API.

// Voices that sound friendlier than the defaults, in order of preference.
const PREFERRED_VOICES = ["Anna", "Petra", "Helena", "Google Deutsch", "Katja"];

let cachedVoice: SpeechSynthesisVoice | null = null;
let cachedLang = "";

function supported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(lang: string): SpeechSynthesisVoice | null {
  if (cachedVoice && cachedLang === lang) return cachedVoice;
  const prefix = lang.slice(0, 2);
  const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.replace("_", "-").startsWith(prefix));
  if (voices.length === 0) return null;
  const preferred = PREFERRED_VOICES.map((name) => voices.find((v) => v.name.includes(name))).find(Boolean);
  cachedVoice = preferred ?? voices.find((v) => v.lang.replace("_", "-") === lang) ?? voices[0];
  cachedLang = lang;
  return cachedVoice;
}

/**
 * Speak `text`. By default anything still being spoken is cut off, so the
 * voice always matches what is on screen; pass `queue` to append instead.
 */
export function speak(text: string, lang: string, { queue = false, rate = 0.85 } = {}) {
  if (!supported()) return;
  const synth = window.speechSynthesis;
  if (!queue) synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.voice = pickVoice(lang);
  utterance.rate = rate;
  utterance.pitch = 1.1;
  synth.speak(utterance);
}

export function stopSpeaking() {
  if (supported()) window.speechSynthesis.cancel();
}

/** Must be called from a user gesture: Safari only allows speech after one. */
export function unlockSpeech(lang: string) {
  if (!supported()) return;
  // Voices load asynchronously in Chrome; reset the cache once they arrive.
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
  };
  pickVoice(lang);
  const silent = new SpeechSynthesisUtterance("");
  silent.volume = 0;
  window.speechSynthesis.speak(silent);
}
