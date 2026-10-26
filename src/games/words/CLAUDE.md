# Wörter tippen

Route `/woerter/`.

Whole word, first letter only, colour words, doing words (all from `de.ts`).

## Languages

Same language packs and choice as „Buchstaben & Zahlen“ (see `src/games/letters/CLAUDE.md`, "Languages"): grown-up
texts through `useT()` with German and Russian side by side, every key event through `keyOf(e, pack)` (Russian types
by key place), keys compared with `keyMatches` only. Colours and doing words of a new pack are `relabel(de.colors|de.actions, …)`.
