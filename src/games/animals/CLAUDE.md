# Was gehört zum Tier?

Route `/tiere/`.

Drag (or tap) the food to the hungry animal, or the animal into its home; the switch „Abwechselnd“ next to „Zur Auswahl“ lets the two take turns. The homes are drawn in `homes.tsx`, animals, foods and sentences are in `content.ts`. The third card „Wer schaut da raus?“ plays `PeekPlay` from `src/games/shadows/`.

## Rules

- Only one choice may fit: a wrong food or home must clearly not belong to the animal (no lettuce or apple next to the rabbit's carrot, no fish next to the bear's honey, no pond next to the fish's aquarium).
  - Foods: every fed animal lists in `alsoEats` everything else among the foods it eats, in reality or as a child knows it (the panda is a „Pandabär“, so honey; the lion a big cat, so fish) – when in doubt, list it. `wrongFoods()` leaves those out of the wrong choices, and `content.test.ts` checks that the list is there and that at least three wrong foods are left. A new food means going through every animal's list; a new animal gets its list with its food.
  - An animal that eats nearly everything has no clearly wrong food and is not fed (the pig only has its home; its potato was dropped).
  - Homes have no such list yet (idea X-14): check every new animal and home against all the others by hand.

## Languages

The game speaks the app language (German, English, Chinese, Hindi, Spanish, Arabic or Russian, `useAppLanguage()`): start screen texts inline with `t({ de, en, zh, hi, es, ar, ru })`, game texts through `pick(ANIMAL_TEXTS, language.id)` (`AnimalTexts` in `content.ts`), speech in `language.speechLang`. Each other language is a `content.<lang>.ts` (en, zh, hi, es, ar, ru), listed in `src/content/texts/texts-<lang>.ts` (which fills `ANIMAL_TRANSLATIONS`): its words by id and a function building the sentences with its grammar – English „the“ and the plural in „likes carrots“; Spanish articles, „al“ and „gusta/gustan“ by the food; Chinese the words as they are and a place word („狗窝里“); Hindi with को/का and the oblique form (कुत्ते को) instead of verbs that follow the animal's gender („गुफा भालू का घर है।“); Arabic with the animal word's gender (`female`: جائع/جائعة، يعيش/تعيش); Russian the accusative for „любит …“ and „в …“.
- Translations come only when the user asks. A new or changed German line comes German-only; add the other languages only on request. Gaps are marked in `src/content/ideas/languageStatus.ts`.
- When a German line changes its meaning, delete its translations in the same change (a stale translation is worse than German).
- An animal, food or home without its words in a language is said entirely in German (the language's texts function takes the whole German sentence, and `say` gives a sentence without the language's letters to the German voice, `voiceFor`), never a German word inside another language. `content.test.ts` checks that no id is stale, that the languages translated so far have every word, that Russian, Chinese, Hindi and Arabic have no Latin letters, and that the fallback works.
- Sentences must not depend on the child's gender or use the past tense; where a language's verbs follow the animal's gender, build them so they don't (Russian „Где живёт лиса?“, Hindi „… का घर कहाँ है?“) or store the gender (Arabic).
- Never show `animal.name`, `food.name` or `home.name` directly; they are German. Go through `texts.animal/food/home`.
