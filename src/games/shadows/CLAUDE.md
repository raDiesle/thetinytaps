# Schatten finden

Route `/schatten/`.

A picture looks for its shadow among 2–4 black ones (the same emoji with `filter: brightness(0)`); tap the right shadow or drag the picture onto it, or choose with arrow keys + Enter / 1–4. A wrong shadow shows its colours for a moment ("Das ist die Giraffe."). Pictures and texts in `content.ts`, by theme (Tiere, Fahrzeuge, Essen, Dinge). „Wer schaut da raus?“ (idea X-04, `PeekPlay.tsx`, a card of "Was gehört zum Tier?" that shares the stage, pictures and glyphs with the shadows): only a part of an animal peeks out of a bush (top, left or right) or the pond (`hideouts.tsx`), the child taps the whole animal among 2–4 below, and it comes out; tapping the bush rustles it and the animal makes its noise. The emoji is drawn on a canvas and cut to its outline (`glyph.ts`), so the part that shows is the same on every system.

## Languages

Both games speak the app language (German or Russian, `useAppLanguage()`): start screen and „Über das Spiel“ texts inline with `t({ de, ru })`, game texts through `pick(SHADOW_TEXTS, language.id)` (`ShadowTexts` in `content.ts`), speech in `language.speechLang`. `content.ru.ts` gives pictures, by id, their Russian name in the nominative and the genitive for „Вот тень слона!“ (`many` for plural words like „ножницы“, so the verb is „ищут“).
- Translations come only when the user asks. A new or changed German line comes German-only; add the Russian only on request. Gaps are marked in `src/content/ideas/languageStatus.ts`.
- When a German line changes its meaning, delete its Russian in the same change (a stale translation is worse than German).
- A picture without its Russian name is said entirely in German (`russianTexts` takes the whole German sentence, and `say` gives a sentence without Cyrillic to the German voice). `shadows.test.ts` checks that the Russian there is Cyrillic, no id is stale, and the fallback works.
- Russian sentences must not use the past tense or depend on the picture's gender (no „нашёл/нашла“, no „его/её“); use the nominative or the stored genitive.
- Never show `item.name` directly; it is German. Use `texts.name(item)`.
