# Tapsi and the Warm Rain

Routes `/haare-waschen/dusche/` and `/haare-waschen/dusche/kurz/` · idea H-146 · research „haare-waschen“ (its addendum
on the shower, 23 November 2026).

The second story in the book „Haare waschen“ (`src/games/hairstory`), for families with a shower and no bathtub: the first
story plays wholly in the tub, while under a shower other things matter – the shower held low, sitting on the floor,
head back. Twenty pages in six chapters, about four minutes, and a short version of eleven of its own pages: beside the
bath's 25 and its short version the book offers four lengths. In the book's choice (`HairStoryGame.tsx`) it is „In the
shower“ / „Unter der Dusche“ (`SHOWER_KIND`), beside „In the bathtub“ / „In der Badewanne“ (`HAIR_BATH_KIND`).

Tapsi the fox (the same family and home as the other chapter books) has sand in the hair; Papa says that tonight the hair
is washed in the shower, feet first, then the hair. Tapsi finds the shower loud, Papa shows it can be soft. Tapsi plays
shower with the bunny and an empty watering can, then lets it rain on Papa's feet. In the shower Tapsi sits on a soft
mat with fish, the rain comes low on the toes first, and Tapsi holds the shower too. Head back, eyes up to the fish
sticker on the tiles, foam spikes like a hedgehog, „Now!“, Papa rinses from behind – the eyes stay dry. Once water
splashes into Tapsi's face: Papa turns it off at once, dries it, Tapsi may cry, and Tapsi picks the shower or the cup to
finish. Then the warm yellow towel, Mama comes and rubs the hair dry, Tapsi is proud, and Mama and Papa love Tapsi with
sand in the hair and with clean hair.
- `hairShower.ts`: the chapters and pages (`SHOWER_STORY`), each page's place, light, cast and picture, the steps it
  tells (`SHOWER_STEPS`, the bath story's `WASH_STEPS`) and the short version (`SHOWER_SHORT_PAGES`, `SHOWER_STORY_SHORT`).
- `hairShowerPictures.ts`: the Gemini prompt of every page, as the picture queue takes them; a made picture goes on
  `MADE`. What is left once all are made stands in their `after`.
- `story.ts`: what the book needs from this folder – Tapsi's voice (`SHOWER_VOICE`, from `stimme/`, listed in
  `recordedLines.ts` as `haare-dusche`, recorded only when the user asks), the pictures (`showerPictureOf`) and the
  translations (`SHOWER_TRANSLATIONS`, through `byLanguage`). The book plays it with the shared `ChapterBook`
  (`first="en"`, dev tags `D…`/`Dk…`, `level="dusche"` so its trophy is its own, named in `trophyNames.ts`).
- `names.ts`: the story's title and its name in the book's choice, in all seven languages.
- `de.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts`, `ru.ts`: the story in the other languages (`StoryTranslation`), loaded only
  with `texts-<language>.ts` (`hairShower`) – never imported by the game.

## Rules

- **Waiting for its twenty pictures** (queued 23 November 2026, made only in a Claude cloud session): until then players
  don't see it (`ChapterBook`'s `withPictures`, the choice leaves a story without pictures out), and both addresses are in
  `WAITING_PATHS` (`seo.ts`: `noindex`, out of the sitemap). What to do once they are made stands in the pictures' `after`.
- **Written English first, translated into all seven languages** (checked in `hairShower.test.ts`: every chapter and
  page, Tapsi in each language's script, the shower named, no Latin letters in Russian, Chinese, Hindi or Arabic). A
  changed page changes its line in every language in the same commit. Tapsi is masculine in Russian, Hindi and Arabic,
  as in the bath story; German says „Tapsi“, never er or sie; Spanish without adjectives about Tapsi.
- **Shorter than the bath story** (checked: at most 85 % of its pages), and its short version made of its own pages
  (`src/components/storyBooks.test.ts`: at least ten pages, at most 55 % of the whole, crying followed by comfort).
- **The water never comes from above** (checked, in texts and pictures): low, feet first, rinsed at the back with the
  head tipped back. Never forced: when it is too much Papa turns it off at once, Tapsi may cry, and Tapsi chooses how to
  finish (checked). No scolding, hurrying, clock, age or weekday.
- **In the shower Tapsi sits on the mat and a grown-up kneels beside it, outside** (checked: every shower prompt ends with
  `IN_THE_SHOWER`): the guides never leave a small child alone with the water, and sitting on the floor is safer than
  standing on wet tiles.
- **Tapsi wears small swim shorts in the shower** (checked): there is no foam to stand in for clothes as in the bath, and
  the app's foxes wear clothes in every picture. No bathtub anywhere in the shower room (checked).
- Pictures (`/bild-erzeugen`, read Kita-Start's lessons and the bath story's in `src/games/hairstory/CLAUDE.md` first):
  the living room is drawn from the Milchkette's „kette-fragen-nicht“, Tapsi's room from the Schnullerfee's „fee-drei“,
  the shower room once from the fox family (`FIRST`, „papa-fuesse“) and every other shower page from that one, so the
  shower stays the same (checked). Look at „papa-fuesse“ hardest before the other shower pages are made: a thing wrongly
  there comes back on every one. Count the foxes, one shower head, one washcloth, one cup, one shampoo, and look that
  Mama and Papa are two foxes (flower, glasses).
- Tapsi is an animal, not the child's figure, so it does not follow „Junge / Mädchen“.
