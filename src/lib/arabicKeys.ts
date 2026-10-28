// Arabic letters on any keyboard: each key counts as the Arabic letter at its place
// on the standard Arabic (101) keyboard, so a German or English keyboard types Arabic
// too (F = ب, G = ل …). Found by KeyboardEvent.code, the key's place. The few keys that
// carry a form rather than a letter of the alphabet (ة, ى, ئ, ء, لا) type the letter
// it is written with, so every key gives one of the 28 letters.

/** The Arabic keyboard as the on-screen keys show it, one string per row from the top. */
export const ARABIC_KEYBOARD_ROWS = ["ضصثقفغعهخحجد", "شسيبلاتنمكط", "ذرزوظ"];

/** The key places (KeyboardEvent.code) of the rows above, letter by letter. */
const CODE_ROWS = [
  ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"],
  ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"],
  ["Backquote", "KeyV", "Period", "Comma", "Slash"],
];

/** Keys of forms, as the letter they are written with: ئ → ي, ء → ا, ؤ → و, لا → ل, ى → ي, ة → ت. */
const LETTER_BY_CODE = new Map<string, string>([
  ["KeyZ", "ي"],
  ["KeyX", "ا"],
  ["KeyC", "و"],
  ["KeyB", "ل"],
  ["KeyN", "ي"],
  ["KeyM", "ت"],
]);
CODE_ROWS.forEach((codes, row) => {
  [...ARABIC_KEYBOARD_ROWS[row]].forEach((letter, i) => LETTER_BY_CODE.set(codes[i], letter));
});

/** Forms typed on a real Arabic keyboard, as the letter of the alphabet they are written with. */
const BASE_LETTER: Record<string, string> = { أ: "ا", إ: "ا", آ: "ا", ء: "ا", ئ: "ي", ى: "ي", ؤ: "و", ة: "ت" };

/**
 * The Arabic letter of a key event: typed on an Arabic keyboard, or the letter at that place on any other.
 * An Arabic digit (٣, also the Persian ۳) is the digit it stands for ("3"), so number keys count on every keyboard.
 */
export function arabicLetterOf(e: Pick<KeyboardEvent, "key" | "code">): string | undefined {
  if (/^[٠-٩]$/.test(e.key)) return String(e.key.charCodeAt(0) - "٠".charCodeAt(0));
  if (/^[۰-۹]$/.test(e.key)) return String(e.key.charCodeAt(0) - "۰".charCodeAt(0));
  if (e.key.length === 1 && /\p{Script=Arabic}/u.test(e.key) && /\p{Letter}/u.test(e.key)) return BASE_LETTER[e.key] ?? e.key;
  return LETTER_BY_CODE.get(e.code);
}

/** Whether `letter` is an Arabic letter. */
export const isArabic = (letter: string) => /\p{Script=Arabic}/u.test(letter);
