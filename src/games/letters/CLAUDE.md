# Buchstaben & Zahlen

Route `/buchstaben/` (the old `/woerter/` leads here). The only game of its home category, so the home card opens it directly.

Four ways to play, as cards on one start screen:
- Frei tippen (`LettersPlay.tsx`): every key shows its letter with a picture and word; a number shows its things and
  digit at once, or optionally counts them aloud, step by step or by tapping each thing.
- Zählen (`LettersPlay.tsx` with `numbersOnly`): like Frei tippen with numbers only; a digit shows itself, any other key
  without a meaning of its own (Space, Enter, arrows, Backspace keep theirs) brings a number from 1 to 9 by chance.
  On touch screens only the digit keys.
- „Wo ist das B?“ (`FindPlay.tsx`): find the key for a shown letter.
- Wörter tippen (`WordsPlay.tsx`): whole word or first letter only; picture words (Substantive), colour words, doing
  words or all of them mixed (all from the language pack).

## Rules

- Variants of one way to play are choices above the cards, never cards of their own: „Wörter tippen“ is one card, and
  whole word / first letter, which words and the word length sit in the always visible row above the cards (`level`),
  next to the letters (A / A a / a) that every mode follows – the words too („A a“ writes „Bär“).
- Choices show the plain value, not an example to decode: the word length is the number of letters (3, 4, 7).
- „Wörter tippen“ has no settings of its own: no own letter case, picture reveal, „any key types“ or tablet keys;
  it uses the game's shared ones (pictures theme, letters, on-screen keys). Don't add them back.
- On a phone on its side (Frei tippen, Zählen) letter, picture and word – or the things and the digit – stand side by
  side, not stacked: the on-screen keys leave little height, and stacked they would be tiny (`letters.css`, end).
- One right key is all a round of „Wo ist das B?“ and „Wörter tippen“ takes: after a short celebration (`CELEBRATE_MS`)
  the next letter comes by itself (in „Wo ist das B?“), never waiting for another key or tap. Keys and taps during the
  celebration only make shapes and sounds.

## Languages

The language packs in `src/content/` (`de`, `en`, `tr`, `pl`, `ru`, `es`, `zh`, `hi`, `ar`). The game plays in the pack of
the app language (🌐, `useLanguagePack()`), never in another one and never with a second one next to it; it has no language choice of its own.
- Grown-up texts (start screen, settings, hints on the play screen) go through `useT()` with every app language
  (`t({ de, ru, en, zh, hi, es, ar })`), never a bare German string.
- Every key event goes through `keyOf(e, pack)` before the game looks at it: a pack with `letterOfKey` types by key
  place on its own keyboard, also on a German one (Russian ЙЦУКЕН Q = Й, Hindi InScript K = क, Arabic F = ب, Spanish Ñ
  right of L). Compare keys only with `keyMatches`/`toUpper(…, pack)`, never with `e.key` directly. `keyMatches` lets the
  plain letter count for its forms (A for Á, ا for أ/إ, ت for ة) and, in Hindi, a key for both its letters (`sameKey`:
  क and ख on K) – a toddler never needs Shift.
- Words are typed and marked in pieces (`textUnits`, `src/content/spelling.ts`), never in single code points: a Hindi
  letter with its vowel sign and joined consonants (कि, ट्र) is one piece, typed by its first letter (क) and said as it
  sounds; an Arabic letter is one piece and keeps its joined shape when drawn on its own (`joinedForms`, zero-width
  joiners), and Arabic slots run right to left. Chinese words are typed and marked by their pinyin (`WordEntry.spelling`,
  with tone marks, no key needed for a tone): the characters stand above, the pinyin under them; the voice says the
  Chinese word, and letters are named as Chinese children read pinyin (b → 玻).
- Hindi and Arabic letters have one form (`hasCase`): the start screen hides A / A a / a and plays with the one form.
- The start screen's examples use `sampleLetter` (B, Russian Б, or the pack's `exampleLetter`: Hindi क, Arabic ب).
- A new pack needs every letter with a spoken name and words (a letter no word starts with, like Ъ Ы Ь, Hindi ङ ञ ण ष
  or pinyin I O U, gets `inWord: true` and words with it inside; the card marks it there), number words 0–9, counting
  that is right for 0–9 (three forms in `ru.ts`/`pl.ts`, gender and dual in `ar.ts`, measure words in `zh.ts`) and keyboard
  rows covering every letter. A pack in another script says and shows no Latin letters (pinyin aside). Every piece of every
  word must have a letter in the pack, or the on-screen keys can't type it. `content.test.ts` and `packs.test.ts` check
  this; add a check for any new rule. Colours and doing words of a new pack are `relabel(de.colors|de.actions, …)`, one
  word each (they must be typeable: Hindi leaves out sleep, wave and clap, which need two words).
- "Wo ist das B?" only asks for letters with a key of their own on most keyboards (`findableLetters`: no umlauts, no Ё,
  no Ñ; in Hindi and Arabic the letters printed on the keyboard rows, none that needs Shift).
