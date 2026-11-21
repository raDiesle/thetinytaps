# The Milk Sleeps at Night

Route `/abstillen/nachts/` · idea H-104 · research „nachts-abstillen“ (and „youtube-themen“ for why).

A second story in the book „Abstillen“, for families who wean only at night and go on breastfeeding by day – which
„Tapsis Milchkette“ (`src/games/milkchain`, weaning altogether) can't tell. Its own address, so a video or a search for
„night weaning“ lands right on it. It is a volume of the Abstillen game (`volumes` in `games.ts`): once published, the
book „Abstillen“ stands on the shelf as two books tied together, „Abstillen“ and „Night Weaning“ (`NIGHT_MILK_BOOK`).

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
- `NightMilkGame.tsx` plays it with the shared `ChapterBook` (`first="en"`, dev tags `N0`, `N<chapter>-<page>`,
  `level="nachts"` so its trophy is its own and not the Milchkette's – `GameEnd` finds the game `/abstillen/` by the
  address). Tapsi's voice reads each page (`voice`, from `stimme/`, listed in `recordedLines.ts` as `abstillen-nachts`,
  recorded only when the user asks), switched off by the loudspeaker (`VoiceSwitch`).
- `names.ts`: the story's title, the volume's name on its spine and its blurb – English only so far.

## Rules

- **English first, nothing translated yet** (root CLAUDE.md, Language): pages, titles and names are English; German and
  the others come only when the user asks, then as `<language>.ts` here loaded with `texts-<language>.ts`, like „Hair
  Washing“ (and `ChapterBook`'s `translations`, `voiceLines.ts`' `chapterBook(…)`, the row's part in
  `languageStatus.ts`). Its search texts are in all seven languages and say the story is so far in English: drop that
  sentence in every language when it is translated.
- **Published since its pictures were made** (21 November 2026, a Claude cloud session's `/paid-queue`): the volume has
  no `unfinished` in `games.ts` any more, so „Abstillen“ stands as two books tied together, its spine picture
  `src/components/bilder/spine-abstillennachts.webp` (named by `bookIdOf`, which only drops the slashes) cut from „weiter“ (Tapsi asleep with the teddy, the moon left out:
  with it the cut was too wide to know Tapsi on a spine). A picture drawn again replaces its file and changes nothing else.
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
