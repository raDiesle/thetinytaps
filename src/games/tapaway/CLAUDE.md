# Zaubertasten („Magic Keys“)

Route `/drauflos/`, idea L-24 (user request, 24 November 2026). A toy for banging on the keyboard, clicking the mouse
or patting the screen, in the spirit of the keyboard smash toys parents search for – never named after one of them, not
even hidden in a metatag (root `CLAUDE.md`, Search engines). Nothing to find or learn, no card, no end.
It was „Tap Away“ / „Drauflos tippen“ at first; with its poster it got a name (`names.ts`, all seven languages), while
its address stays `/drauflos/`.

## How it plays

- A letter key: that letter big and bright somewhere on the page (`GLYPH_SHARE` of the shorter side), a chime note,
  and its name from Buchstaben & Zahlen's recordings (`lettersVoice`, loaded as play starts – a few dozen lines), said
  only while nothing else is said (`talking()`).
- A digit 1–9: the digit a little smaller (`COUNTED_SHARE`) with as many drawn shapes round it on a ring
  (`Counted`, `COUNT_SHAPES`, never the moon), popping in one after the other (`--delay`) so they can be counted;
  0 stays a digit alone.
- Every other key, every tap and click: one of Frei tippen's surprises right where the finger landed (`useSurprises`,
  `SurpriseLayer` from `src/games/letters/Surprises.tsx`), else – while one may not come yet – a bright shape with a
  plop (`shapes.tsx`, drawn, never emoji), else only ripples.
- A mouse moving leaves a short trail of sparkles: tiny spans made imperatively (never by React), each fading by itself.
- Before the first press one still line says what to do („Press any key!“ / „Tap anywhere!“ on touch devices).

## Rules

- **Several things at once, side by side** (user request, 24 November 2026): quick presses one after the other each
  show their thing while the ones before still stand – up to `MAX_POPS` letters, digits and shapes, one every
  `POP_GAP_MS`, and up to `TAP_AWAY_SURPRISES.maxAtOnce` surprises (looser than Frei tippen's `SURPRISE`, which stays
  one at a time there). A key's letter or digit lands where nothing else stands as long as there is room (`freeSpot`
  in `place.ts`, keeping clear of the pops and surprises on the page); only a full page lets it overlap, where it
  covers least. A tap's thing lands under the finger.
- Never a storm all the same: the same key again only after `SAME_KEY_PAUSE_MS` (meanwhile a silent ripple), sparkles
  at most `MAX_SPARKLES`, and every limit kept in `tapaway.test.ts`.
- Everything that moves is a small HTML layer animated by `transform` and `opacity` (`tapaway.css`, prefix `tw-`).
- It is a category of its own with `toy: "keyboard"` in `games.ts` (no cover, no world, no book travel): the shelf draws
  it as `ShelfToy` in `Bookshelf.tsx`, first on the picture books' board (the trophy sign hangs at its right end and hid
  it there), `TOY_SPAN` picture books wide so the picture books keep at least 85 % of their size (`shelfLayout.test.ts`).
  A tap presses it down with a knock and a note, then the game opens; ✕ and Esc lead back to the shelf.
- **Its poster** (`ToyPoster`, user request, 24 November 2026): a paper poster on the back panel behind the keyboard,
  its bottom at the keyboard's middle height, the game's name big on top and a picture from the game below, held by
  three pieces of tape (top left, bottom left, bottom right) while the top right corner curls off the panel. It is
  only paper on the wall (`aria-hidden`, not tapped – the keyboard is the way in), and must stay clear of the book
  beside it and the board above (look at 844×390, 390×844, 1024×768 and 1920×1080). The title's size follows its
  longest word (`--len`), so every language's name fits under the curl. The picture is
  `src/components/bilder/plakat-<category>.webp`, made by `bun run previews plakat` (`POSTERS` in `tools/previews.ts`):
  a firework, a letter and a digit with its shapes, played with fixed chance so it comes out the same each time – look
  at it after every change to what the game draws.
