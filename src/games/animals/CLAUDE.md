# Was gehört zum Tier?

Route `/tiere/`.

Drag (or tap) the food to the hungry animal, or the animal into its home; the switch „Abwechselnd“ next to „Zur Auswahl“ lets the two take turns. The homes are drawn in `homes.tsx`, animals, foods and sentences are in `content.ts`. The third card „Wer schaut da raus?“ plays `PeekPlay` from `src/games/shadows/`.

## Rules

- Only one choice may fit: a wrong food or home must clearly not belong to the animal (no lettuce or apple next to the rabbit's carrot, no pond next to the fish's aquarium). Until idea X-14 adds the "also fits" lists and their test, check every new animal, food and home against all the others by hand.

## Languages

The game speaks the app language (German or Russian, `useAppLanguage()`): start screen and „Über das Spiel“ texts inline with `t({ de, ru })`, game texts through `pick(ANIMAL_TEXTS, language.id)` (`AnimalTexts` in `content.ts`), speech in `language.speechLang`. The Russian words are in `content.ru.ts`, by id: each animal's name, each food's name and accusative for „любит …“, each home's name and „в …“ phrase.
- Translations come only when the user asks. A new or changed German line comes German-only; add the Russian only on request. Gaps are marked in `src/content/ideas/languageStatus.ts`.
- When a German line changes its meaning, delete its Russian in the same change (a stale translation is worse than German).
- An animal, food or home without its Russian words is said entirely in German (`russianTexts` takes the whole German sentence, and `say` gives a sentence without Cyrillic to the German voice), never a German word inside a Russian sentence. `content.test.ts` checks that the Russian there is Cyrillic, no id is stale, and the fallback works.
- Russian sentences must not depend on the animal's gender or use the past tense: build them from the nominative („Где живёт лиса?“) and a fixed verb, not from adjectives or „нашёл/нашла“.
- Never show `animal.name`, `food.name` or `home.name` directly; they are German. Go through `texts.animal/food/home`.
