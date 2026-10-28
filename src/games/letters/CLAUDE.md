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

The language packs in `src/content/` (`de`, `en`, `tr`, `pl`, `ru`). The game plays in the pack of the app language
(🌐, `useLanguagePack()`), never in another one and never with a second one next to it; it has no language choice of its own.
- Grown-up texts (start screen, settings, hints on the play screen) go through `useT()`: `t({ de: "…", ru: "…" })`, never a bare German string.
- Every key event goes through `keyOf(e, pack)` before the game looks at it: a pack with `letterOfKey` (Russian) types
  by key place (Q = Й, also on a German keyboard). Compare keys only with `keyMatches`/`toUpper(…, pack)`, never with `e.key` directly.
- A new pack needs every letter with a spoken name and words (a letter no word starts with, like Ъ Ы Ь, gets
  `inWord: true` and words with it inside; the card marks it there), number words 0–9, plural forms that are right
  for 0–9 (see `ru.ts`/`pl.ts` for three forms) and keyboard rows covering every letter. `content.test.ts` checks this; add a check for any new rule.
  Colours and doing words of a new pack are `relabel(de.colors|de.actions, …)`.
- "Wo ist das B?" only asks for letters with a key of their own on most keyboards (`findableLetters`: no umlauts, no Ё).
