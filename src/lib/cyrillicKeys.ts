// Russian letters on any keyboard: each key counts as the Cyrillic letter at its
// place on a Russian (ЙЦУКЕН) keyboard, so a German or English keyboard types
// Russian too (Q = Й, W = Ц …). Found by KeyboardEvent.code, the key's place,
// not by the letter printed on it (German keyboards swap Y and Z).

/** The Russian keyboard as printed on the keys, one string per row from the top. */
export const RUSSIAN_KEYBOARD_ROWS = ["ЙЦУКЕНГШЩЗХЪ", "ФЫВАПРОЛДЖЭ", "ЯЧСМИТЬБЮ"];

/** The key places (KeyboardEvent.code) of the rows above, letter by letter. */
const CODE_ROWS = [
  ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"],
  ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"],
  ["KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period"],
];

/** Ё sits left of 1. */
const LETTER_BY_CODE = new Map<string, string>([["Backquote", "Ё"]]);
CODE_ROWS.forEach((codes, row) => {
  codes.forEach((code, i) => LETTER_BY_CODE.set(code, RUSSIAN_KEYBOARD_ROWS[row][i]));
});

/** The upper-case Cyrillic letter of a key event: typed on a Russian keyboard, or the letter at that place on any other. */
export function cyrillicLetterOf(e: Pick<KeyboardEvent, "key" | "code">): string | undefined {
  if (e.key.length === 1 && /\p{Script=Cyrillic}/u.test(e.key)) return e.key.toLocaleUpperCase("ru-RU");
  return LETTER_BY_CODE.get(e.code);
}

/** Whether `letter` is a Cyrillic letter. */
export const isCyrillic = (letter: string) => /\p{Script=Cyrillic}/u.test(letter);
