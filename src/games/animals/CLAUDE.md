# Was gehört zum Tier?

Route `/tiere/`.

One flowing game, like Socken-Paare: its card plays at once (`startMode`), with no start screen, no cards and no `level`
row; ✕ goes back to the table of contents. Its only options lie behind ⚙️ while playing (`PlayOptions`). `AnimalsRounds.tsx` lets five kinds of rounds take
turns in a fixed order (`KIND_ORDER` in `levels.ts`), starting with the easiest:
1. „Wer schaut da raus?“ (X-04, `PeekPlay` from `src/games/shadows/`, which shares the stage, pictures and glyphs with
   the shadows): a part of an animal peeks out of a bush or the pond, the child taps the whole animal below.
   The animals are Schatten finden's `PEEK_ITEMS` (47 since November 2026); a new one comes German only (`GERMAN_ONLY` in
   `src/games/shadows/content.ts`), and the shadows' `CLAUDE.md` says how it is put into its `PEEK_LOOKS` group, the
   pond and the lookalike pairs.
2. Füttern (N-08): tap (or drag) the food to the hungry animal – the farm's and the wood's animals, and since November
   2026 zoo and sea animals too (elephant and peanuts, parrot and grapes, crocodile, tiger and wolf with meat, …), and
   more since (hamster and nuts, hippo and melon, rhino, elk and sloth with leaves, kangaroo and hay, deer and nuts,
   otter, shark and eagle with fish, octopus, flamingo and whale with shrimps, beaver and wood, …).
3. Was gibt uns das Tier? (Z-01): tap (or drag) what the animal gives us to it – cow and milk, hen, duck and goose and egg, bee
   and honey, sheep and llama and wool, goat and cheese (`gives`, drawn in `gifts.tsx`). It flies to the animal's side
   and the animal makes it anew there (`.ap-made`): the glass fills with milk, the jar with honey, the egg drops into
   the nest, the ball of wool rolls out, the cheese drops onto its board. A wrong gift: the animal shakes its head and
   the one it comes from pops up behind the plate (`giverOf`: the gift's best-known giver, `Gift.giver`).
4. Wer wohnt wo? (N-09): tap the animal's home (or drag the animal into it). Besides the farm's and the wood's homes
   there are the beaver lodge, the anthill, the sea, the desert, the jungle, the savanna and the bamboo forest, and since
   November 2026 the cage (hamster), the leaf pile (hedgehog), the meadow (butterfly, ladybird, grasshopper), the garden
   (snail, caterpillar), the river (crocodile, hippo, otter), the mountain (goat, llama, eagle), the forest (deer, wolf,
   elk, boar, raccoon) and the coral reef (pufferfish, octopus).
5. Was wird aus mir? (Z-12, `GrowPlay.tsx`, drawn in `growth.tsx`): something small stands above – a caterpillar, an
   egg, a seed, a tadpole, an acorn, a bulb, a pumpkin seed, a coconut, a rose bud – and the child taps what it
   becomes below (butterfly, chick, sunflower, frog, tree, tulip, pumpkin, palm, rose; tapping only, like „Wer schaut
   da raus?“). It flies up into the small one, which becomes it (`.growing`): the caterpillar climbs
   to the twig, spins itself in and a butterfly flutters out; the egg wobbles, cracks and the chick comes up out of
   its shell; the seed sinks into the soil, sprouts and grows into a sunflower; the tadpole grows legs, loses its tail
   and hops onto the lily pad as a frog; the acorn hops and sinks into the meadow, a sapling and then the tree grow; the
   bulb wiggles into its pot and a tulip rises between two leaves; the pumpkin seed sinks, a vine creeps out and the
   pumpkin swells and ripens from green to orange; the coconut rocks, fronds pop out and a palm grows behind it; the
   bud swells, its sepals open and the rose blooms. Each small one is two layers of drawing with the emoji of what it becomes
   between them (`back`, `front`: the egg's lower shell and the nest, the soil). A wrong pick: the small one it comes
   from pops up over that plate. Plants are never dealt together (`GROW_LOOKALIKES`, see the rules), so a plant's
   wrong choices are the butterfly, the chick and the frog.

Each round is mounted anew (`key={turn}`) and reports `onSolved(misses)` when the right thing is picked and `onNext()`
when the reaction has been watched; the step and the animals still to come live in `AnimalsRounds`, which also hands
each round its `RoundTopic` (`topic`) to show under its picture. Every five rounds (one of each kind) count as a game for the play-time limit (`gameEnded`,
`countGame`). Homes are drawn in `homes.tsx`, gifts in `gifts.tsx`, the small ones and their growing in `growth.tsx`; animals, foods, gifts' givers and sentences are in `content.ts`.

**Difficulty** (`ANIMAL_LEVELS`, `dealFeed`, `dealGift`, `dealHome`, `dealPeek`, `dealGrow` in `levels.ts`; the step rule is `nextLevel` from
Schatten finden): one step for all five kinds. Two rounds in a row without a wrong pick → one up; two wrong picks in
one round, or one in each of two rounds in a row → one down. Time plays no part. Every visit begins on the first step;
`?level=N` starts on step N while developing, and `?animal=<id>` deals only that animal (to look at its rounds and home). Up the steps there are more things to choose from (2 → 4 foods, gifts, homes or grown ones,
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
- What a round is about stands for grown-ups as plain small text centred right under the picture (`RoundTopic.tsx`; in
  „Wer wohnt wo?“, where the homes fill the sky, under the animal on the ground): its question as the animal or the
  small one asks it – „Wer versteckt sich da?“, „Was esse ich?“, „Was produziere ich?“, „Wo lebe ich?“, „Was wird aus
  mir?“ –, quiet (small, muted ink), with no emoji, no bubble, no frame and nothing hopping in, letting every tap
  through (user feedback, November 2026: the bubble with its big sign was too loud; `content.test.ts`). The kind's
  sign (`KIND_SIGNS`) stands only before its name under ⚙️ and is never a picture the child picks from.
- The choices (plates, homes, the animals to pick) are as big as the room below the picture allows – for homes the sky
  above the animal – on a tablet, a computer and a phone on its side alike, in one row of 2 to 5 (two to a row on a
  phone held upright, `choiceRows`), clear of the page's paper margin, with clear room between them. Each has its name
  small and quiet below it for grown-ups (`.ap-name`, `.sh-name`: the same words as its `aria-label`, in the app
  language), one line, centred; the name stays with its plate when the food or gift flies off (user feedback,
  November 2026). Sizes come from the container round the row (`container-type: size`, `--size` in `animals.css`),
  never from fixed `vh` caps; the names' room (`--name-room`) is kept free below every row.
- No stars or other count of rounds played (user feedback, November 2026): the game flows on, nothing to collect.
- Only one choice may fit: a wrong food or home must clearly not belong to the animal (no lettuce or apple next to the rabbit's carrot, no fish next to the bear's honey, no pond next to the fish's aquarium). `content.test.ts` checks that every step deals exactly one right choice among as many as it says.
  - Foods: every fed animal lists in `alsoEats` everything else among the foods it eats, in reality or as a child knows it (the panda is a „Pandabär“, so honey; the lion a big cat, so fish) – when in doubt, list it. `wrongFoods()` leaves those out of the wrong choices, and `content.test.ts` checks that the list is there and that at least three wrong foods are left. A new food means going through every animal's list; a new animal gets its list with its food.
  - An animal that eats nearly everything has no clearly wrong food and is not fed (the pig only has its home; its potato was dropped).
  - Gifts the same way: every animal that gives us something lists in `alsoGives` the other gifts it gives too (the
    sheep's milk), `wrongGifts()` leaves them out. There are only five gifts, so an animal giving several gets as
    many choices as are left (the sheep and the goat at most three); `content.test.ts` checks the list and that at least two wrong gifts
    are left. Only gifts a child knows from the animal (no leather, no feathers), and a new gift means going through
    every giver's list. The animal that pops up after a wrong gift is the one the gift names (`Gift.giver`), its
    best-known giver (the hen's egg, not the duck's or the goose's; the cow's cheese, though the goat is asked for it)
    – never simply the first in `ANIMALS`, so a new giver of an existing gift changes nothing there.
  - Homes the same way: every animal with a home lists in `alsoLives` the other homes it lives in too (the rabbit's hutch, the bear's ice as an „Eisbär“, the fish's pond), `wrongHomes()` leaves them out and `content.test.ts` checks the list and that three wrong homes are left. A new home means going through every animal's list. Every home has at least one animal with it as its `home` (the first one peeks out on a wrong pick), the animal at `spot`/`fit` stays inside the drawing (`content.test.ts`), and landscapes that look alike to a child never count as a wrong choice for each other's animals: they are a group in `HOME_LOOKALIKES` (`homes.tsx`: Teich, Meer, Fluss and Korallenriff; Savanne and Wüste; Dschungel, Bambuswald and Wald), and an animal living in one lists all of its group (`content.test.ts`). A new home that looks like another joins that group. A new home is drawn so it doesn't look like an old one, or it joins its group (a beach or terrarium was left out, too close to sea and desert).
  - A picture counts by what it shows, not only by its name (🌾 „Heu“ shows grain, so birds and hens list it in `alsoEats`), and an animal a child knows from a famous picture book counts what it eats there (the Raupe Nimmersatt's fruit, cheese and sausage); a bear of any kind counts honey. A food shared by several animals is written the same for each (`content.test.ts`).
  - Two animals never share an emoji (no alpaca beside the llama), and only animals with an emoji of their own take part – no woodpecker or mole drawn as another bird or animal (`content.test.ts`).
  - What the small one becomes the same way: small ones whose grown ones a child could mix up are in one group of `GROW_LOOKALIKES` (`growth.tsx`) and never dealt together (`dealGrow`). Every plant is alike to every other (no child can tell which seed, nut, bulb or bud becomes which plant), so a plant's wrong choices are the butterfly, the chick and the frog. A new small one joins a group or starts one and keeps at least three others it isn't alike to (`content.test.ts`).
  - Who peeks out the same way: animals whose peeking part looks the same (the cat's and the dog's tail, an
    elephant's grey next to a cow's or a sheep's) are never offered together (`PEEK_LOOKALIKES` in
    `src/games/shadows/content.ts`, `dealPeek`); see the shadows' `CLAUDE.md` for how a new animal is checked.

## Languages

The game speaks the app language (German, English, Chinese, Hindi, Spanish, Arabic or Russian, `useAppLanguage()`): game texts through `pick(ANIMAL_TEXTS, language.id)` (`AnimalTexts` in `content.ts`). Every sentence is said from its ElevenLabs recording (`animalsVoice` in `voice.ts`, files in `stimme/`, also for „Wer schaut da raus?“), recorded in German only so far (November 2026): a sentence in another language stays silent until the user asks for its recordings, a German fallback sentence plays its German one. A new or changed sentence is listed by `src/content/recordedLines.ts` (`tiere`) and recorded with `bun run voice make --only tiere`, only when the user asks. „Was gibt uns das Tier?“ and „Was wird aus mir?“ speak every language too: their sentences are `GIFT_TEXTS` and `GROW_TEXTS` (filled with `byLanguage` from each language file's `gifts` and `growth`, German where a gift, animal or small one has no words), and `content.test.ts` asks every language for every animal, gift and small one. Each other language is a `content.<lang>.ts` (en, zh, hi, es, ar, ru), listed in `src/content/texts/texts-<lang>.ts` (which fills `ANIMAL_TRANSLATIONS`): its words by id and a function building the sentences with its grammar – English „the“ and the plural in „likes carrots“; Spanish articles, „al“ and „gusta/gustan“ by the food; Chinese the words as they are and a place word („狗窝里“); Hindi with को/का and the oblique form (कुत्ते को) instead of verbs that follow the animal's gender („गुफा भालू का घर है।“); Arabic with the animal word's gender (`female`: جائع/جائعة، يعيش/تعيش); Russian the accusative for „любит …“ and „в …“.
- Translations come only when the user asks. A new or changed German line comes German-only; add the other languages only on request. Gaps are marked in `src/content/ideas/languageStatus.ts`, and every animal, food, home, gift or small one still German only is listed in `GERMAN_ONLY` (`content.ts`): `content.test.ts` asks every translated language for the words of all others and checks these have none yet – take them off the list when they are translated.
- When a German line changes its meaning, delete its translations in the same change (a stale translation is worse than German).
- An animal, food or home without its words in a language is said entirely in German (the language's texts function takes the whole German sentence, and `say` plays that German sentence's German recording), never a German word inside another language. `content.test.ts` checks that no id is stale, that the languages translated so far have every word, that Russian, Chinese, Hindi and Arabic have no Latin letters, and that the fallback works.
- Sentences must not depend on the child's gender or use the past tense; where a language's verbs follow the animal's gender, build them so they don't (Russian „Где живёт лиса?“, Hindi „… का घर कहाँ है?“) or store the gender (Arabic).
- Never show `animal.name`, `food.name` or `home.name` directly; they are German. Go through `texts.animal/food/home`.
