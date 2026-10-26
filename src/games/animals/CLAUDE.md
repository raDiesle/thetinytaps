# Was gehört zum Tier?

Route `/tiere/`.

Drag (or tap) the food to the hungry animal, or the animal into its home; the switch „Abwechselnd“ next to „Zur Auswahl“ lets the two take turns. The homes are drawn in `homes.tsx`, animals, foods and sentences are in `content.ts`. The third card „Wer schaut da raus?“ plays `PeekPlay` from `src/games/shadows/`.

## Languages

The game speaks the app language (German or Russian, `useAppLanguage()`): start screen texts inline with `t({ de, ru })`, game texts through `pick(ANIMAL_TEXTS, language.id)` (`AnimalTexts` in `content.ts`), speech in `language.speechLang`. The Russian words are in `content.ru.ts`, by id: each animal's name, each food's name and accusative for „любит …“, each home's name and „в …“ phrase.
- A new animal, food or home needs its Russian entry in `content.ru.ts` in the same change; `content.test.ts` fails without it (homes don't compile without one).
- Russian sentences must not depend on the animal's gender or use the past tense: build them from the nominative („Где живёт лиса?“) and a fixed verb, not from adjectives or „нашёл/нашла“.
- Never show `animal.name`, `food.name` or `home.name` directly; they are German. Go through `texts.animal/food/home`.
