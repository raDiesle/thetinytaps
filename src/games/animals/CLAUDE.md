# Was gehört zum Tier?

Route `/tiere/`.

One flowing game, like Socken-Paare: its card plays at once (`startMode`), with no start screen, no cards and no `level`
row; ✕ goes back to the table of contents. Its only options lie behind ⚙️ while playing (`PlayOptions`). `AnimalsRounds.tsx` lets five kinds of rounds take
turns in a fixed order (`KIND_ORDER` in `levels.ts`), starting with the easiest:
1. „Wer schaut da raus?“ (X-04, `PeekPlay` from `src/games/shadows/`, which shares the stage, pictures and glyphs with
   the shadows): a part of an animal peeks out of a bush or the pond, the child taps the whole animal below.
2. Füttern (N-08): tap (or drag) the food to the hungry animal.
3. Was gibt uns das Tier? (Z-01): tap (or drag) what the animal gives us to it – cow and milk, hen and egg, bee and
   honey, sheep and wool (`gives`, drawn in `gifts.tsx`). It flies to the animal's side and the animal makes it anew
   there (`.ap-made`): the glass fills with milk, the jar with honey, the egg drops into the nest, the ball of wool
   rolls out. A wrong gift: the animal shakes its head and the one it comes from pops up behind the plate
   (`giverOf`).
4. Wer wohnt wo? (N-09): tap the animal's home (or drag the animal into it).
5. Was wird aus mir? (Z-12, `GrowPlay.tsx`, drawn in `growth.tsx`): something small stands above – a caterpillar, an
   egg, a seed, a tadpole – and the child taps what it becomes below (butterfly, chick, sunflower, frog; tapping only,
   like „Wer schaut da raus?“). It flies up into the small one, which becomes it (`.growing`): the caterpillar climbs
   to the twig, spins itself in and a butterfly flutters out; the egg wobbles, cracks and the chick comes up out of
   its shell; the seed sinks into the soil, sprouts and grows into a sunflower; the tadpole grows legs, loses its tail
   and hops onto the lily pad as a frog. Each small one is two layers of drawing with the emoji of what it becomes
   between them (`back`, `front`: the egg's lower shell and the nest, the soil). A wrong pick: the small one it comes
   from pops up over that plate. The four each become something none of the others does, so every other one is a
   clearly wrong choice; there are only four, so at most four to choose from.

Each round is mounted anew (`key={turn}`) and reports `onSolved(misses)` when the right thing is picked and `onNext()`
when the reaction has been watched; the step and the animals still to come live in `AnimalsRounds`, which also shows
each round's `TopicBubble`. Every five rounds (one of each kind) count as a game for the play-time limit (`gameEnded`,
`countGame`). Homes are drawn in `homes.tsx`, gifts in `gifts.tsx`, the small ones and their growing in `growth.tsx`; animals, foods, gifts' givers and sentences are in `content.ts`.

**Difficulty** (`ANIMAL_LEVELS`, `dealFeed`, `dealGift`, `dealHome`, `dealPeek`, `dealGrow` in `levels.ts`; the step rule is `nextLevel` from
Schatten finden): one step for all five kinds. Two rounds in a row without a wrong pick → one up; two wrong picks in
one round, or one in each of two rounds in a row → one down. Time plays no part. Every visit begins on the first step;
`?level=N` starts on step N while developing. Up the steps there are more things to choose from (2 → 4 foods, gifts, homes or grown ones,
2 → 5 animals) and „Wer schaut da raus?“ shows less: a smaller share of the animal, then others that look like it to
choose from (`PEEK_LOOKS` in `src/games/shadows/content.ts`: small furry ones, big ones on four legs, birds, small
crawling or flying ones, the pond's own), and on the last steps the animal hides wholly behind the bush and shows only
through round gaps in its leaves (`holes`, placed on drawn parts of the animal by `pickPeepholes` in `glyph.ts`; out of
the pond it still peeks out).

An animal makes its real sound (a CC0 recording from `src/lib/sounds/`, `real(name, synth)` in `content.ts`, loaded when the game starts; the synthesized one until then); a fed animal munches and hearts float up – no „Danke!“ or „Bäh!“ bubble, the sound says it.

## Rules

- No start screen and no cards for the five kinds: by default all five take turns and the game finds the difficulty
  itself (user decision, November 2026). Grown-ups change that only behind ⚙️ held while playing (user feedback,
  November 2026), and a change counts from the next round:
  - „Was drankommt“: „Gemischt“ (all five take turns, the default) or exactly one kind (`settings.kinds`, `nextKind`) –
    never a mix of some switched on and off one by one (user feedback, November 2026; `content.test.ts` checks the
    settings have no switch per kind).
  - „Schwierigkeit“: „Von selbst“ (the default, `nextLevel`) or a fixed step, Leicht · Mittel · Schwer (`FIXED_LEVELS`);
    back on „Von selbst“ the game climbs on from the fixed step.
    No other options (names, dragging instead of tapping were left out on purpose).
- Harder means more to choose from and less to see, never quicker: no clock, and time doesn't count for the difficulty.
- A wrong pick is never shown as wrong (the animal says „Bäh!“, the real resident peeks out, the animal shown says who
  it is); it only feeds `nextLevel`.
- What a round is about stands for grown-ups in a speech bubble at the left of the picture (`TopicBubble.tsx`, user
  feedback, November 2026): the kind's sign big (`KIND_SIGNS`, also before its name under ⚙️), its question small below
  it, as the animal or the small one asks it – „Wer versteckt sich da?“, „Was esse ich?“, „Was produziere ich?“, „Wo
  lebe ich?“, „Was wird aus mir?“. A sign is never a picture the child picks from (`content.test.ts`), and the bubble
  lets every tap through. Otherwise nothing to read: no names under the things; the pictures carry their names only as
  `aria-label`.
- No stars or other count of rounds played (user feedback, November 2026): the game flows on, nothing to collect.
- Only one choice may fit: a wrong food or home must clearly not belong to the animal (no lettuce or apple next to the rabbit's carrot, no fish next to the bear's honey, no pond next to the fish's aquarium). `content.test.ts` checks that every step deals exactly one right choice among as many as it says.
  - Foods: every fed animal lists in `alsoEats` everything else among the foods it eats, in reality or as a child knows it (the panda is a „Pandabär“, so honey; the lion a big cat, so fish) – when in doubt, list it. `wrongFoods()` leaves those out of the wrong choices, and `content.test.ts` checks that the list is there and that at least three wrong foods are left. A new food means going through every animal's list; a new animal gets its list with its food.
  - An animal that eats nearly everything has no clearly wrong food and is not fed (the pig only has its home; its potato was dropped).
  - Gifts the same way: every animal that gives us something lists in `alsoGives` the other gifts it gives too (the
    sheep's milk), `wrongGifts()` leaves them out. There are only four gifts, so an animal giving two gets as many
    choices as are left (the sheep at most three); `content.test.ts` checks the list and that at least two wrong gifts
    are left. Only gifts a child knows from the animal (no leather, no feathers), and a new gift means going through
    every giver's list.
  - Homes the same way: every animal with a home lists in `alsoLives` the other homes it lives in too (the rabbit's hutch, the bear's ice as an „Eisbär“, the fish's pond), `wrongHomes()` leaves them out and `content.test.ts` checks the list and that three wrong homes are left. A new home means going through every animal's list.
  - Who peeks out the same way: animals whose peeking part looks the same (the cat's and the dog's tail, an
    elephant's grey next to a cow's or a sheep's) are never offered together (`PEEK_LOOKALIKES` in
    `src/games/shadows/content.ts`, `dealPeek`); see the shadows' `CLAUDE.md` for how a new animal is checked.

## Languages

The game speaks the app language (German, English, Chinese, Hindi, Spanish, Arabic or Russian, `useAppLanguage()`): game texts through `pick(ANIMAL_TEXTS, language.id)` (`AnimalTexts` in `content.ts`). Every sentence is said from its ElevenLabs recording (`animalsVoice` in `voice.ts`, files in `stimme/`, also for „Wer schaut da raus?“), recorded in German only so far (November 2026): a sentence in another language stays silent until the user asks for its recordings, a German fallback sentence plays its German one. A new or changed sentence is listed by `src/content/recordedLines.ts` (`tiere`) and recorded with `bun run voice make --only tiere`, only when the user asks. „Was gibt uns das Tier?“ and „Was wird aus mir?“ speak every language too: their sentences are `GIFT_TEXTS` and `GROW_TEXTS` (filled with `byLanguage` from each language file's `gifts` and `growth`, German where a gift, animal or small one has no words), and `content.test.ts` asks every language for every animal, gift and small one. Each other language is a `content.<lang>.ts` (en, zh, hi, es, ar, ru), listed in `src/content/texts/texts-<lang>.ts` (which fills `ANIMAL_TRANSLATIONS`): its words by id and a function building the sentences with its grammar – English „the“ and the plural in „likes carrots“; Spanish articles, „al“ and „gusta/gustan“ by the food; Chinese the words as they are and a place word („狗窝里“); Hindi with को/का and the oblique form (कुत्ते को) instead of verbs that follow the animal's gender („गुफा भालू का घर है।“); Arabic with the animal word's gender (`female`: جائع/جائعة، يعيش/تعيش); Russian the accusative for „любит …“ and „в …“.
- Translations come only when the user asks. A new or changed German line comes German-only; add the other languages only on request. Gaps are marked in `src/content/ideas/languageStatus.ts`.
- When a German line changes its meaning, delete its translations in the same change (a stale translation is worse than German).
- An animal, food or home without its words in a language is said entirely in German (the language's texts function takes the whole German sentence, and `say` plays that German sentence's German recording), never a German word inside another language. `content.test.ts` checks that no id is stale, that the languages translated so far have every word, that Russian, Chinese, Hindi and Arabic have no Latin letters, and that the fallback works.
- Sentences must not depend on the child's gender or use the past tense; where a language's verbs follow the animal's gender, build them so they don't (Russian „Где живёт лиса?“, Hindi „… का घर कहाँ है?“) or store the gender (Arabic).
- Never show `animal.name`, `food.name` or `home.name` directly; they are German. Go through `texts.animal/food/home`.
