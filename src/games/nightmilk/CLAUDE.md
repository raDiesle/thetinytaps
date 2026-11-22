# The Milk Sleeps at Night

Route `/abstillen/nachts/` · idea H-104 · research „nachts-abstillen“ (and „youtube-themen“ for why).

A second story in the book „Abstillen“, for families who wean only at night and go on breastfeeding by day – which
„Tapsis Milchkette“ (`src/games/milkchain`, weaning altogether) can't tell. Its own address, so a video or a search for
„night weaning“ lands right on it. The book opens on the choice between the two stories (`MilkChainGame.tsx` in
`src/games/milkchain`, user request, 22 November 2026), where this one is „Night weaning“ / „Nachts abstillen“
(`NIGHT_MILK_KIND`) with its chapters as small numbers; the address `/abstillen/nachts/` shows the same book and names
this story. It is no longer a volume tied to the other on the shelf.

Tapsi the fox (the same family and home as in the other chapter books) drinks at Mama's breast by day and at night. With a
little picture book of the moon and the sun Mama tells the rule: „When the moon shines, the milk sleeps. When the sun
comes up, it wakes again.“ By day there is milk and cuddles as much as Tapsi likes, and Papa promises to come at night.
In the evening Tapsi drinks once more, waves to the moon „Good night, milk!“, and Papa reads. At night Tapsi wakes and
calls; Papa comes at once, holds the angry, crying Tapsi tight, gives a sip from the blue cup, carries and hums until
Tapsi sleeps on his fur. In the morning the milk is awake. The next night Papa comes again, and a few nights later Tapsi
wakes, sees the moon, hugs the teddy and sleeps on. Milk in the day, sleep at night – and love all the time.
- `nightMilk.ts`: the chapters and pages (`NIGHT_MILK`), the steps of gentle night weaning (`NIGHT_STEPS`), and each
  page's place, light, cast and picture.
- `nightMilkPictures.ts`: the Gemini prompt of every page (reference room, light, moon, cast and clothes, the things
  that come back, nursing), as the picture queue takes them; a made picture goes on `MADE`. What is left once all are
  made stands in their `after`.
- `story.ts`: what the book needs from this folder – Tapsi's voice (`NIGHT_VOICE`, from `stimme/`, listed in
  `recordedLines.ts` as `abstillen-nachts`, recorded only when the user asks), the pictures (`nightPictureOf`) and the
  translations (`NIGHT_TRANSLATIONS`, through `byLanguage`). Its `?glob` imports stay here, relative to this folder (an
  `@/` path finds no files). The book plays it with the shared `ChapterBook` (`first="en"`, dev tags
  `N<chapter>-<page>`, `level="nachts"` so its trophy is its own and not the Milchkette's – `GameEnd` finds the game
  `/abstillen/` by the address), switched off by the loudspeaker (`VoiceSwitch`).
- `names.ts`: the story's title and its name in the book's choice, in all seven languages.
- `de.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts`, `ru.ts`: the story in the other languages (`StoryTranslation`, keyed by
  chapter and page id), loaded only with `texts-<language>.ts` (`nightMilk`) and read through `byLanguage` – never
  imported by the game.

## Rules

- **Written English first, translated into all seven languages** (22 November 2026, as „Hair Washing“): pages,
  chapter titles and names come in German, Chinese, Hindi, Spanish, Arabic and Russian too (`<language>.ts`, checked in
  `nightmilk.test.ts`: every chapter and page, Tapsi in each language's script, no Latin letters in Russian, Chinese,
  Hindi or Arabic), and its search texts no longer say it is English only. A changed page changes its line in every
  language in the same commit. The recordings are still missing in every language (`abstillen-nachts` in
  `recordedLines.ts`, made only when the user asks).
- **Published since its pictures were made** (21 November 2026, a Claude cloud session's `/paid-queue`). Its picture in
  the book's choice is „weiter“ (Tapsi asleep with the teddy). The spine picture
  `src/components/bilder/spine-abstillennachts.webp`, cut for the tied volume, is no longer shown. A picture drawn again
  replaces its file and changes nothing else.
- **The chapters follow the guides' steps in their order** (`NIGHT_STEPS`, checked): tell beforehand, with one rule
  tied to dark and light and who comes at night; keep the evening's milk but end with a fixed ritual; comfort instead
  of milk at night – the other parent, water, carrying, humming; the milk comes back with the sun; the same night after
  night.
- **Never alone, never forced** (checked): Tapsi may be angry and cry, always in a grown-up's arms; no scolding, no
  hurrying, no „big kids don't…“; where the guides differ (Gordon stops picking the child up), the story follows the
  gentler ones. No clock, age, number of nights or weekday: each family has its own night.
- **The milk keeps its rule**: Tapsi drinks only by day, in the evening or in the morning, never in a night picture
  (checked), and plainly at Mama's breast (`NURSING` of the Milchkette's pictures).
- The bottle night is not in it: a child weaned from a night bottle gets it in „Bye-Bye, Bottle!“ (`/flaeschchen/`, H-105).
- Tapsi is an animal, not the child's figure, so it does not follow „Junge / Mädchen“.
- Pictures (`/bild-erzeugen`, made only in a Claude cloud session; read Kita-Start's lessons in
  `src/games/kitastory/CLAUDE.md` and Hair Washing's first – they hold here): the living room is drawn from the
  Milchkette's „kette-fragen-nicht“, Tapsi's room from the Schnullerfee's „fee-drei“ – never from a Milchkette picture of
  Tapsi's room, whose chain of milk drops over the bed would come back on every page (checked). Both references are in
  daylight, so every prompt says the page's light, and the moon looks the same on each page that shows it (`MOON`).
  Count the foxes, look at every face, and check that the night pictures stay dark blue but clearly seen.
