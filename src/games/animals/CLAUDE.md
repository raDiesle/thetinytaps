# Was gehört zum Tier?

Route `/tiere/`.

One flowing game, like Socken-Paare: its card plays at once (`startMode`), with no start screen, no cards and no `level`
row; ✕ and „Menü“ go back to the table of contents. Its only options lie behind ⚙️ while playing (`PlayOptions`). `AnimalsRounds.tsx` lets three kinds of rounds take
turns in a fixed order (`KIND_ORDER` in `levels.ts`), starting with the easiest:
1. „Wer schaut da raus?“ (X-04, `PeekPlay` from `src/games/shadows/`, which shares the stage, pictures and glyphs with
   the shadows): a part of an animal peeks out of a bush or the pond, the child taps the whole animal below.
2. Füttern (N-08): tap (or drag) the food to the hungry animal.
3. Wer wohnt wo? (N-09): tap the animal's home (or drag the animal into it).

Each round is mounted anew (`key={turn}`) and reports `onSolved(misses)` when the right thing is picked and `onNext()`
when the reaction has been watched; the stars (top left, `sh-bar` from `shadows.css`), the step and the animals still
to come live in `AnimalsRounds`. Every three rounds count as a game for the play-time limit (`gameEnded`,
`countGame`). Homes are drawn in `homes.tsx`; animals, foods and sentences are in `content.ts`.

**Difficulty** (`ANIMAL_LEVELS`, `dealFeed`, `dealHome`, `dealPeek` in `levels.ts`; the step rule is `nextLevel` from
Schatten finden): one step for all three kinds. Two rounds in a row without a wrong pick → one up; two wrong picks in
one round, or one in each of two rounds in a row → one down. Time plays no part. Every visit begins on the first step;
`?level=N` starts on step N while developing. Up the steps there are more things to choose from (2 → 4 foods or homes,
2 → 5 animals) and „Wer schaut da raus?“ shows less: a smaller share of the animal, then others that look like it to
choose from (`PEEK_LOOKS` in `src/games/shadows/content.ts`: small furry ones, big ones on four legs, birds, small
crawling or flying ones, the pond's own), and on the last steps the animal hides wholly behind the bush and shows only
through round gaps in its leaves (`holes`, placed on drawn parts of the animal by `pickPeepholes` in `glyph.ts`; out of
the pond it still peeks out).

## Rules

- No start screen and no cards for the three kinds: by default all three take turns and the game finds the difficulty
  itself (user decision, November 2026). Grown-ups change that only behind ⚙️ held while playing (user feedback,
  November 2026), and a change counts from the next round:
  - „Was drankommt“: each kind on or off (`settings.peek/feed/home`); the turns go on with the next kind switched on
    (`nextKind`), and the last one can't be switched off.
  - „Schwierigkeit“: „Von selbst“ (the default, `nextLevel`) or a fixed step, Leicht · Mittel · Schwer (`FIXED_LEVELS`);
    back on „Von selbst“ the game climbs on from the fixed step.
    No other options (names, dragging instead of tapping were left out on purpose).
- Harder means more to choose from and less to see, never quicker: no clock, and time doesn't count for the difficulty.
- A wrong pick is never shown as wrong (the animal says „Bäh!“, the real resident peeks out, the animal shown says who
  it is); it only feeds `nextLevel`.
- Nothing to read while playing: no question, no names under the things; the pictures carry their names only as
  `aria-label`.
- Only one choice may fit: a wrong food or home must clearly not belong to the animal (no lettuce or apple next to the rabbit's carrot, no fish next to the bear's honey, no pond next to the fish's aquarium). `content.test.ts` checks that every step deals exactly one right choice among as many as it says.
  - Foods: every fed animal lists in `alsoEats` everything else among the foods it eats, in reality or as a child knows it (the panda is a „Pandabär“, so honey; the lion a big cat, so fish) – when in doubt, list it. `wrongFoods()` leaves those out of the wrong choices, and `content.test.ts` checks that the list is there and that at least three wrong foods are left. A new food means going through every animal's list; a new animal gets its list with its food.
  - An animal that eats nearly everything has no clearly wrong food and is not fed (the pig only has its home; its potato was dropped).
  - Homes the same way: every animal with a home lists in `alsoLives` the other homes it lives in too (the rabbit's hutch, the bear's ice as an „Eisbär“, the fish's pond), `wrongHomes()` leaves them out and `content.test.ts` checks the list and that three wrong homes are left. A new home means going through every animal's list.

## Languages

The game speaks the app language (German, English, Chinese, Hindi, Spanish, Arabic or Russian, `useAppLanguage()`): game texts through `pick(ANIMAL_TEXTS, language.id)` (`AnimalTexts` in `content.ts`), speech in `language.speechLang`. Each other language is a `content.<lang>.ts` (en, zh, hi, es, ar, ru), listed in `src/content/texts/texts-<lang>.ts` (which fills `ANIMAL_TRANSLATIONS`): its words by id and a function building the sentences with its grammar – English „the“ and the plural in „likes carrots“; Spanish articles, „al“ and „gusta/gustan“ by the food; Chinese the words as they are and a place word („狗窝里“); Hindi with को/का and the oblique form (कुत्ते को) instead of verbs that follow the animal's gender („गुफा भालू का घर है।“); Arabic with the animal word's gender (`female`: جائع/جائعة، يعيش/تعيش); Russian the accusative for „любит …“ and „в …“.
- Translations come only when the user asks. A new or changed German line comes German-only; add the other languages only on request. Gaps are marked in `src/content/ideas/languageStatus.ts`.
- When a German line changes its meaning, delete its translations in the same change (a stale translation is worse than German).
- An animal, food or home without its words in a language is said entirely in German (the language's texts function takes the whole German sentence, and `say` gives a sentence without the language's letters to the German voice, `voiceFor`), never a German word inside another language. `content.test.ts` checks that no id is stale, that the languages translated so far have every word, that Russian, Chinese, Hindi and Arabic have no Latin letters, and that the fallback works.
- Sentences must not depend on the child's gender or use the past tense; where a language's verbs follow the animal's gender, build them so they don't (Russian „Где живёт лиса?“, Hindi „… का घर कहाँ है?“) or store the gender (Arabic).
- Never show `animal.name`, `food.name` or `home.name` directly; they are German. Go through `texts.animal/food/home`.
