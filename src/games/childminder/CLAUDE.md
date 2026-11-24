# Tapsi Goes to Lotta's

Routes `/kita/tagesmutter/` and `/kita/tagesmutter/kurz/` · idea H-147 · research „kita-eingewoehnung“ (addendum of
23 November 2026).

The second story of the book „Kita-Start“ (`src/games/kitastory`), chosen in its choice of stories (`StoryChoice`) like
the second stories of „Abstillen“, „Schnullerfee“ and „Haare waschen“: settling in with a childminder (Tagesmutter,
Kindertagespflege) instead of a Kita, for the roughly one in seven children under three in care who go to one (Destatis,
1 March 2026). Written English first (user request, 23 November 2026), translated at once into the six other app
languages, German included. Whole (28 pages, seven chapters) and short (`CHILDMINDER_SHORT_PAGES`, 13 of its own pages).

Mama and Papa tell Tapsi about Lotta, who looks after a few children in her home; Papa and Tapsi visit her, and they pack
the backpack with slippers, spare clothes and Bunny. On the first day Mama sits on Lotta's sofa with Tapsi on her lap,
then Tapsi plays trains with Emil, and they go home together. A few days later Mama goes out for a moment, Tapsi cries,
Lotta comforts, Mama comes back. Lotta takes over the snack at the big kitchen table and the comforting, Mama is at home
meanwhile (watering the plants) and stays away longer each day. Every morning the same goodbye: the same way to Lotta's
door, the jacket on the ladybug hook, a squeeze, a kiss on the nose, „I'll pick you up after your nap“, Lotta's hand,
waving at the kitchen window. Then Tapsi's day (the red handcart to the playground, the sandpit, noodles at the kitchen
table, the nap in a little bed at Lotta's), and right after the nap Mama is there, as she said.
- `childminder.ts`: the chapters and pages (`CHILDMINDER_STORY`), following the Kita story's `SETTLING_STEPS`, and the
  short version (`CHILDMINDER_SHORT_PAGES`, `CHILDMINDER_STORY_SHORT`).
- `childminderPictures.ts`: the Gemini prompt of every page, as the picture queue takes them; a made picture goes on `MADE`.
- `story.ts`: what the book needs to read it (pictures, translations, Tapsi's voice from `stimme/`, listed in
  `recordedLines.ts` as `kita-tagesmutter`, recorded only when the user asks).
- `de.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts`, `ru.ts`: chapters and pages in each language, imported only by
  `src/content/texts/texts-<lang>.ts` (`childminder`).
- `names.ts`: its title and its name in the book's choice („At a childminder's“ / „Bei der Tagesmutter“).
- The book itself (`KitaStoryGame.tsx`) holds its `BookStory` (level `tagesmutter`, code `T`, short `Tk`).

**Published with its 28 pictures** (made with Gemini on 23 November 2026 in a Claude cloud session), named in the search
texts of `/kita/` and in `KITA_STORY_BLURB`.

## Rules

- Everything the Kita story's rules say about the story holds here too (`src/games/kitastory/CLAUDE.md`): the steps of
  settling in in the guides' order, the morning's ritual short and ending with waving, Mama never sneaking away and coming
  back by the day's order („after your nap“), crying allowed with a grown-up close, nothing scolding or hurrying, no days,
  ages or clock, Mama away from Tapsi shown only in Lotta's chapter. `childminder.test.ts` checks them.
- **It is a childminder's home, never a small Kita**: one grown-up (Lotta) with a few children of different ages (Emil, a
  baby, a bigger girl), in a family's flat – a hall with a coat rack, a living room used as play room, the family's
  kitchen with one long table, a bedroom with little beds –, out with the handcart to a public playground. Keep it so in
  text and pictures (`PLACES.looks`).
- It stays a length of its own, shorter than the Kita story (at most 85 % of its pages, checked).
- The foxes are the family, Lotta's people are bears (Lotta, Emil, „kinder“: the baby and the bigger girl) and stay at
  Lotta's places and on her outing; Papa only at home and on the first visit (checked).
- Pictures follow the Kita story's lessons (`/bild-erzeugen`, `src/games/kitastory/CLAUDE.md`): each new place drawn once
  from the families (`PLACES.first`), every other page there from it; Lotta and Emil from the page they first came in
  (`PEOPLE`); every prompt names who of its reference is not there (`absent`, checked); the waving page is seen from inside.
  Where a place's reference has someone standing where a page wants nobody, Gemini keeps a figure there (Papa on the
  hall's doormat, Mama at the kitchen table's end, a second Lotta): draw that page from another page of the place whose
  people stand where it wants them (`DRAWN_FROM`: the slippers from „kuss“, lunch from „winken“).
