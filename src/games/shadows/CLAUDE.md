# Schatten finden

Route `/schatten/`.

A picture looks for its shadow among 2–4 black ones (the same emoji with `filter: brightness(0)`); tap the right shadow or drag the picture onto it, or choose with arrow keys + Enter / 1–4. A wrong shadow shows its colours for a moment ("Das ist die Giraffe."). Pictures and texts in `content.ts`, by theme (Tiere, Fahrzeuge, Essen, Dinge). „Wer schaut da raus?“ (idea X-04, `PeekPlay.tsx`, a card of "Was gehört zum Tier?" that shares the stage, pictures and glyphs with the shadows): only a part of an animal peeks out of a bush (top, left or right) or the pond (`hideouts.tsx`), the child taps the whole animal among 2–4 below, and it comes out; tapping the bush rustles it and the animal makes its noise. The emoji is drawn on a canvas and cut to its outline (`glyph.ts`), so the part that shows is the same on every system.

## Languages

Both games speak the app language (German or Russian, `useAppLanguage()`): start screen texts inline with `t({ de, ru })`, game texts through `pick(SHADOW_TEXTS, language.id)` (`ShadowTexts` in `content.ts`), speech in `language.speechLang`. `content.ru.ts` gives every picture, by id, its Russian name in the nominative and the genitive for „Вот тень слона!“ (`many` for plural words like „ножницы“, so the verb is „ищут“).
- A new picture needs its Russian entry in `content.ru.ts` in the same change; `shadows.test.ts` fails without it.
- Russian sentences must not use the past tense or depend on the picture's gender (no „нашёл/нашла“, no „его/её“); use the nominative or the stored genitive.
- Never show `item.name` directly; it is German. Use `texts.name(item)`.
