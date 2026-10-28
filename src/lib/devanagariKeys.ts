// Hindi letters on any keyboard: each key counts as the Devanagari letter at its
// place on the InScript keyboard (the standard Hindi layout in India), so a German
// or English keyboard types Hindi too (K = क, J = र …). Found by KeyboardEvent.code,
// the key's place. Where InScript puts a vowel sign (ा, ि …) the key types the vowel
// itself (आ, इ …): a child presses one key and gets a letter, never a sign alone.
// The two keys whose InScript letter needs Shift and whose plain sign is no letter (] = ़, , = ,)
// type that letter plainly (ञ, ष), so every letter but ङ and ण has a key without Shift; and since a
// toddler doesn't hold Shift, the games let a key count for both its letters (sameDevanagariKey).

/** Letters by key place (KeyboardEvent.code), without Shift. */
const PLAIN: Record<string, string> = {
  KeyQ: "औ",
  KeyW: "ऐ",
  KeyE: "आ",
  KeyR: "ई",
  KeyT: "ऊ",
  KeyY: "ब",
  KeyU: "ह",
  KeyI: "ग",
  KeyO: "द",
  KeyP: "ज",
  BracketLeft: "ड",
  KeyA: "ओ",
  KeyS: "ए",
  KeyD: "अ",
  KeyF: "इ",
  KeyG: "उ",
  KeyH: "प",
  KeyJ: "र",
  KeyK: "क",
  KeyL: "त",
  Semicolon: "च",
  Quote: "ट",
  KeyC: "म",
  KeyV: "न",
  KeyB: "व",
  KeyN: "ल",
  KeyM: "स",
  Slash: "य",
  BracketRight: "ञ",
  Comma: "ष",
};

/** Letters by key place with Shift: the breathy consonants (ख, घ …) and a few more. */
const SHIFTED: Record<string, string> = {
  KeyY: "भ",
  KeyU: "ङ",
  KeyI: "घ",
  KeyO: "ध",
  KeyP: "झ",
  BracketLeft: "ढ",
  BracketRight: "ञ",
  KeyH: "फ",
  KeyK: "ख",
  KeyL: "थ",
  Semicolon: "छ",
  Quote: "ठ",
  KeyC: "ण",
  KeyM: "श",
  Comma: "ष",
};

/** Vowel signs typed on a real Hindi keyboard, as the vowel they stand for. */
const VOWEL_OF_SIGN: Record<string, string> = { "ा": "आ", "ि": "इ", "ी": "ई", "ु": "उ", "ू": "ऊ", "े": "ए", "ै": "ऐ", "ो": "ओ", "ौ": "औ", "्": "अ" };

/** The Hindi keyboard as the on-screen keys show it, one string per row from the top (without Shift). */
export const HINDI_KEYBOARD_ROWS = ["औऐआईऊबहगदजड", "ओएअइउपरकतचट", "मनवलसय"];

/**
 * The Devanagari letter of a key event: typed on a Hindi keyboard, or the letter at that place on any other.
 * A Devanagari digit (१) is the digit it stands for ("1"), so number keys count on a Hindi keyboard too.
 */
export function devanagariLetterOf(e: Pick<KeyboardEvent, "key" | "code"> & { shiftKey?: boolean }): string | undefined {
  if (/^[०-९]$/.test(e.key)) return String(e.key.charCodeAt(0) - "०".charCodeAt(0));
  if (e.key.length === 1 && /\p{Script=Devanagari}/u.test(e.key)) {
    const letter = VOWEL_OF_SIGN[e.key] ?? e.key;
    if (/\p{Letter}/u.test(letter)) return letter;
  }
  return (e.shiftKey ? SHIFTED[e.code] : undefined) ?? PLAIN[e.code];
}

/** The key place (KeyboardEvent.code) of each letter, with or without Shift. */
const CODE_OF = new Map<string, string>([...Object.entries(SHIFTED), ...Object.entries(PLAIN)].map(([code, letter]) => [letter, code]));

/** Whether two letters share a key, one with Shift and one without (क and ख on K, स and श on M). */
export function sameDevanagariKey(a: string, b: string) {
  const code = CODE_OF.get(a);
  return code !== undefined && code === CODE_OF.get(b);
}

/** Whether `letter` is a Devanagari letter. */
export const isDevanagari = (letter: string) => /\p{Script=Devanagari}/u.test(letter);
