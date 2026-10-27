# Buchstaben & Zahlen

Route `/buchstaben/`.

Free typing (a number shows its things and digit at once, or optionally counts them aloud, step by step or by tapping each thing), "Wo ist das B?" (find the key for a shown letter, `FindPlay.tsx`) or the Buchstaben-Zug (keys become wagons, `TrainPlay.tsx`).

## Rules

- One right key is all a round takes: after a short celebration (`CELEBRATE_MS`) the next letter comes by itself,
  never waiting for another key or tap. Keys and taps during the celebration only make shapes and sounds.

## Languages

The language packs in `src/content/` (`de`, `en`, `tr`, `pl`, `ru`) are shared with „Wörter tippen“. Both play in the
pack of the app language (🌐, `useLanguagePack()`), never in another one and never with a second one next to it; the
games have no language choice of their own.
- Grown-up texts (start screen, settings, hints on the play screen) go through `useT()`: `t({ de: "…", ru: "…" })`, never a bare German string.
- Every key event goes through `keyOf(e, pack)` before the game looks at it: a pack with `letterOfKey` (Russian) types
  by key place (Q = Й, also on a German keyboard). Compare keys only with `keyMatches`/`toUpper(…, pack)`, never with `e.key` directly.
- A new pack needs every letter with a spoken name and words (a letter no word starts with, like Ъ Ы Ь, gets
  `inWord: true` and words with it inside; the card marks it there), number words 0–9, plural forms that are right
  for 0–9 (see `ru.ts`/`pl.ts` for three forms) and keyboard rows covering every letter. `content.test.ts` checks this; add a check for any new rule.
- "Wo ist das B?" only asks for letters with a key of their own on most keyboards (`findableLetters`: no umlauts, no Ё).
