# Bye-Bye, Bottle!

Route `/flaeschchen/` · idea H-105 · research „flasche-abgewoehnen“.

The book „Bottle to Cup“ („Flasche abgewöhnen“) among the Alltagshelfer (`BOTTLE_STORY_BOOK`, a spine book of its own, playing at once): a
story in chapters like „Abstillen“, but for the bottle, and shorter (idea H-105, user request, 21 November 2026: „setze
um in hoher Qualität Idee H-105“). It is read by a grown-up with the child over the days the bottles go: one chapter
per step, the bedtime chapter on the evening the bedtime bottle goes.

Tapsi the fox (the same family and home as in the other chapter books) drank from the bottle as a baby, from Papa's
arms, and is big now. Mama says that big children drink from a cup and that the bottle says bye-bye bit by bit, together.
Tapsi picks the green cup with the little leaf, sips water, spills and laughs, and gives Bunny a drink. The daytime
bottle rests in the cupboard, out of sight; the milk comes in the cup at lunch, and when Tapsi wants the bottle Papa
hugs, offers the cup and they play outside. The morning milk comes in the cup on Mama's lap – the bottle goes, the cuddle
stays. In the evening the milk comes in the cup at the table, then teeth; in bed there is no bottle, but Bunny, a book
and Mama's song, and Tapsi may miss it and cry in Mama's arms. In the night Papa brings water in the cup and hums, and
every night it is a little easier. Then Tapsi and Papa wash the bottle one last time, Tapsi lays it in a box – „Thank
you, bottle. Bye-bye!“ – and the box goes on the shelf, to remember or for a little baby one day. Tapsi drinks from
the cup everywhere now, sometimes still thinks of the bottle and gets a cuddle, and Mama and Papa love Tapsi.
- `bottleStory.ts`: the chapters and pages (`BOTTLE_STORY`), the steps from bottle to cup as the guides give them
  (`BOTTLE_STEPS`) and the order the bottles go (`BOTTLE_ORDER`).
- `bottleStoryPictures.ts`: the Gemini prompt of every page (place from another book's picture, who is not there any
  more, light, cast and clothes, the bottle, the green cup, the bunny, the box), as the picture queue takes them; a made
  picture goes on `MADE`. `AFTER` says what is left once a picture is made, the last one publishing the book.
- `BottleStoryGame.tsx` plays it with the shared `ChapterBook` (`first="en"`, dev tags `F0`, `F<chapter>-<page>`): a
  change to how the book reads goes there, so every chapter book gets it. Tapsi's voice reads each page (`voice`, from
  `stimme/`, listed in `recordedLines.ts` as `flaeschchen`, recorded only when the user asks), and the loudspeaker
  switches it off (`VoiceSwitch`); a page without its recording stays silent.
- `names.ts`: the book's name on the shelf, the story's title and its blurb in every language.
- `de.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts`, `ru.ts`: the chapters' titles and the pages' sentences in each language,
  imported only by `src/content/texts/texts-<lang>.ts` and read with `byLanguage`.

## Rules

- **Written English first, translated on request** (root CLAUDE.md, Language): pages, title, book name and blurb were
  written in English and translated the same day (21 November 2026, „übersetze alles in alle Sprachen“) into every app
  language, German as one of them: `<language>.ts` here, loaded by `texts-<language>.ts` into `texts.bottleStory`, and
  `names.ts`. A changed page is changed in English first and its translations deleted until made again (they fall back
  to English, never German); `bottlestory.test.ts` checks every language has every chapter and page, Tapsi in its own
  script (Тапси, 塔普西, टैप्सी, تابسي) and no Latin letters in Russian, Chinese, Hindi and Arabic. The rules for the
  child's languages hold: Spanish without adjectives about Tapsi that change with gender („Tapsi es grande“, „tú y
  yo“ rather than „juntos“), Russian without past-tense forms that show a gender, Arabic with „let's“ (هيّا) instead
  of an imperative to the child. A new page needs its six translations again, when the user asks.
- **The chapters follow the guides' steps in their order** (`BOTTLE_STEPS`, checked): tell beforehand, choose an open
  cup and practise, then one bottle after the other – the daytime bottle first, the morning's next, the bedtime bottle
  last (`BOTTLE_ORDER`, checked) –, the night, the goodbye. The last chapter only tells the story. The sources differ on
  which bottle goes first (research „flasche-abgewoehnen“); the bedtime bottle last is what all agree on – keep it so.
- **Never a bottle in bed, nor in the evening or the night** (checked): the guides agree a bottle to fall asleep with
  harms the teeth, so the evening milk comes in the cup at the table before brushing, and at night there is water in
  the cup. Once the bottle is in its box, no later picture shows it (checked).
- **The cup is an open cup**: the green cup has two handles and no lid, spout or straw, said in every prompt that shows
  it – the guides' goal is the open cup, and a spouted or valved cup works like a bottle.
- **It fits a child who was never breastfed** (idea H-105): baby Tapsi gets the bottle from Papa, and nothing speaks of
  Mama's milk or the breast (checked) – „Abstillen“ tells that.
- Gentle and true: the bottle goes and stays gone, Tapsi may want it, be cross and cry, and a grown-up is there in every
  picture where Tapsi cries or calls in the night (checked). Nobody scolds, shames („like a baby“, „too big for“),
  hurries or bribes (no reward, sweets or juice); no clock, age or weekday (each family has its own child and day).
  Lines ≤ 110 characters, in the present tense, ending in love (all checked in `bottlestory.test.ts`).
- Tapsi is an animal, not the child's figure, so it does not follow „Junge / Mädchen“.
- Pictures (`/bild-erzeugen`; read the lessons in `src/games/kitastory/CLAUDE.md` and `src/games/hairstory/CLAUDE.md`
  first – they all hold here): every page is drawn from one picture of the other books (`PLACES`: the living room and
  the garden from „Abstillen“, the kitchen from its meal page, Tapsi's room from „Schnullerfee“), so the home stays the
  same. Each prompt says who stood where in that reference and that those places are empty now, and names who of the
  reference is not in this picture at all (`absent`) – without it Mama stayed on Kita-Start's chair. In the kitchen Papa
  sits where the reference has him; Mama sits on the empty grown-up chair at the front left, never in Papa's place,
  where Gemini would give her his clothes. A box shown open has its lid lying beside it (a lid held over a box came back
  twice in Schnullerfee). The bottle, the green cup, the bunny and the box are described the same on every page and
  said to be there only once (checked) – still count them, and the foxes, on every picture before keeping it.

## Publishing

All pictures wait in the queue (`src/content/pictureQueue.ts`, made in a Claude cloud session with `/paid-queue`), so
the book is `unfinished: true` in `CATEGORIES`: off the shelf, `noindex`, reached from „🚧 In Arbeit“ on `/management/`.
The dev server shows every page with its placeholder. Once the last picture is made (`AFTER`):
1. Crop a 160×160 spine picture of the green cup in Tapsi's paws from `flasche-schluck.webp` to
   `src/components/bilder/spine-flaeschchen.webp`, like `spine-haare-waschen.webp`, and run `bun run previews` for the
   book's line.
2. Drop `unfinished: true` from `/flaeschchen/` in `src/content/games.ts`, so the book stands among the Alltagshelfer
   right of „Abstillen“, and add it to the Alltagshelfer order in `content.test.ts`.
3. Add a perf scenario „flaeschchen“ in `tools/perfScenarios.ts` like „haare-waschen“ and run it.
4. Name the bottle story in the home page's search text („/“ in `seo.ts` and every `seo.<lang>.ts`, like „fürs
   Haarewaschen“), and in the book's own text if it changed.
5. Look at it at 844×390 and 1024×768: the contents, a page, the end.
