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
  plop (`shapes.tsx`, drawn, never emoji), else only ripples. Fireworks come three times as often as the other kinds
  (`TAP_AWAY_SURPRISES.bag`, `FIREWORK_KINDS`), over half of all surprises.
- Every letter, digit and shape bursts onto the page with a small ring of sparks flying out (`POP_SPARKS` streaks,
  `.tw-burst`), a little firework with every press. The streaks stand still inside one layer that grows out and fades,
  and lets go of its layer once over (fill `backwards`): one layer per streak, held for the letter's whole stay, kept up to
  a hundred layers on the page and put letters alone at 42 % of an old phone's main thread (November 2026). Each surprise is one thing aimed at that spot – one
  balloon, one flower, one ball, bubbles round it rather than rising away (user feedback, 25 November 2026; the rule
  stands with the surprises in `src/games/letters/CLAUDE.md`): several things at once come from several presses,
  never from one.
- A mouse moving leaves a short trail of sparkles: tiny spans made imperatively (never by React), each fading by itself.
- Before the first press one still line says what to do („Press any key!“ / „Tap anywhere!“ on touch devices).

## Rules

- **Small and light, never chunky** (user feedback, 25 November 2026: „mache Elemente kleiner, damit sie nicht so
  klobig erscheinen“): letters, shapes and surprises are small shares of the page (`GLYPH_SHARE`, `SHAPE_SHARE`,
  `SURPRISE_SHARE`, smaller than Frei tippen's surprises), so several stand light side by side; never grow them back to
  a card's size. Look at 844×390 that a digit and its shapes still read there (`GLYPH_MIN`).
- **More fireworks** (user request, 25 November 2026): fireworks are what children want most here – over half of the
  surprises are one, and each press bursts with sparks (`tapaway.test.ts` checks both). A new firework kind goes into
  `FIREWORK_KINDS` (`Surprises.tsx`), so it comes as often.

- **Several things at once, side by side** (user request, 24 November 2026): quick presses one after the other each
  show their thing while the ones before still stand – up to `MAX_POPS` letters, digits and shapes, one every
  `POP_GAP_MS`, and up to `TAP_AWAY_SURPRISES.maxAtOnce` surprises (looser than Frei tippen's `SURPRISE`, which stays
  one at a time there). A key's letter or digit lands where nothing else stands as long as there is room (`freeSpot`
  in `place.ts`, keeping clear of the pops and surprises on the page); only a full page lets it overlap, where it
  covers least. A tap's thing lands under the finger.
- Never a storm all the same: the same key again only after `SAME_KEY_PAUSE_MS` (meanwhile a silent ripple), sparkles
  at most `MAX_SPARKLES`, and every limit kept in `tapaway.test.ts`.
- Presses that only ripple share one ripple when they land within `RIPPLE_GAP_MS` of each other (a palm on the keys,
  several fingers at once): each ripple is two rings, each a layer, and both hands smashing kept about 18 rings on the
  page, which alone took a fifth of an old phone's main thread. A child's single taps still each get theirs.
- **Count the layers** (November 2026, `bun run perf zaubertasten`): every element animated by itself is a layer while
  it runs (and while `will-change` or a forward fill holds it), and the canvas fireworks draw in every frame, so each
  frame's commit carries all of them – the more on the page at once, the dearer every frame. Something that comes with
  every press (a burst, a ring) is one layer, and lets go of it when done. With the shared ripples and the burst as one
  layer, both hands smashing went from 81 % busy (budget 60 %) to about 49 %, letters from 42 % to about 22 %.
- `bun run perf zaubertasten` measures letters, surprises, taps and both hands at once with a fixed chance
  (`FIXED_CHANCE`), since the random kinds of surprises alone swung a stretch by over ten points; still run it a few
  times before and after a change, and compare the averages.
- Everything that moves is a small HTML layer animated by `transform` and `opacity` (`tapaway.css`, prefix `tw-`).
- It is a category of its own with `toy: "poster"` in `games.ts` (no cover, no world, no book travel): the shelf draws
  it as `ShelfToy` in `Bookshelf.tsx`, first on the picture books' board (the trophy sign hangs at its right end and hid
  it there), `TOY_SPAN` picture books wide so the picture books keep at least 85 % of their size (`shelfLayout.test.ts`).
  A tap presses its poster back with a knock and a note, then the game opens; ✕ and Esc lead back to the shelf.
- **Its poster** (`ToyPoster`, user request, 24 November 2026) is the whole thing on the shelf: the game's name big on
  top and a picture from the game below, on paper held by three pieces of tape (top left, bottom left, bottom right)
  while the top right corner curls off. It is stuck **flat on the back panel, in the middle between the two boards,
  clear of them, of the left wall and of the book beside it – its tape whole too** – never leaning from the board (user
  feedback, 24 November 2026: „ganz hinten an der Wand, nicht schräg“), never with its foot on the board, where the
  board's front hid its lower tape, and never against the wall, which hid its left tape (user feedback, 25 November
  2026: „Abstand von den Regalbrettern“, „Abstand vom Brett links, das Klebeband darf nicht abgeschnitten sein“).
  `usePosterPlace` fits it, with `POSTER_MARGIN` of its width round the paper on every side (the tape reaches about
  0.15 of it past each corner), into the compartment's panel as seen (`.shelf-cell-shade`, below the board above's
  front edge) and left of the next book, shrinking it where it must, and hangs it in the middle between the boards
  (`--poster-y`); it measures again when the compartment changes and a frame after a resize, since the shelf plans its
  boards anew then. Measure the tape's own boxes against the wall, the boards and the book, not only the paper's (at
  844×390 about 5–7 px clear on every side). Nothing
  stands in front of it (a toy keyboard did first and looked like a till, user feedback, 24 November 2026). On the panel
  the shelf's perspective draws a thing towards the shelf's middle and makes it smaller, so laid out in its place the
  poster was seen behind the book beside it: `usePosterPlace` measures an unseen copy of the place on the panel
  (`.shelf-poster-spot`) against the place itself and moves and grows the poster back over it (`--poster-x`,
  `--poster-k`, `POSTER_REACH`) – never a fixed shift in CSS, which was right on one screen only. Anything on the shelf
  stands clear of the books beside it, measured with `getBoundingClientRect` in the page (the tape's boxes against the
  next cover's left: 5–8 px at 844×390, 390×844, 1024×768, 1280×720 and 1920×1080, the paper's edge about 20 px); `css.test.ts` keeps the poster in its place. The title's size follows its longest word (`--len`, each letter
  `--letter` em wide, more for Cyrillic), so every language's name fits under the curl; it is plain dark red ink, never
  an outline or a coloured shadow, which at a few px smeared „Zaubertasten“ into a blur (user feedback, 26 November
  2026; `css.test.ts`), and the picture takes the room the name leaves, so a name on two lines never pushes it past the
  paper's foot – measure the name's lines and the picture's foot in all seven languages at 844×390 after a change. The picture is `src/components/bilder/plakat-<category>.webp`, made by
  `bun run previews plakat` (`POSTERS` in `tools/previews.ts`): a firework, a letter and a digit with its shapes,
  played with fixed chance so it comes out the same each time – look at it after every change to what the game draws.
