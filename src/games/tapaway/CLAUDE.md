# Drauflos tippen („Tap Away“)

Route `/drauflos/`, idea L-24 (user request, 24 November 2026). A toy for banging on the keyboard, clicking the mouse
or patting the screen, in the spirit of the keyboard smash toys parents search for – never named after one of them, not
even hidden in a metatag (root `CLAUDE.md`, Search engines). Nothing to find or learn, no card, no count, no end.

## How it plays

- A letter or digit key: that letter big and bright somewhere on the page (`GLYPH_SHARE` of the shorter side), a chime
  note, and its name from Buchstaben & Zahlen's recordings (`lettersVoice`, loaded as play starts – a few dozen lines),
  said only while nothing else is said (`talking()`).
- Every other key, every tap and click: one of Frei tippen's surprises right where the finger landed (`useSurprises`,
  `SurpriseLayer` from `src/games/letters/Surprises.tsx`), else – while one may not come yet – a bright shape with a
  plop (`shapes.tsx`, drawn, never emoji), else only ripples.
- A mouse moving leaves a short trail of sparkles: tiny spans made imperatively (never by React), each fading by itself.
- Before the first press one still line says what to do („Press any key!“ / „Tap anywhere!“ on touch devices).

## Rules

- Never a storm: at most `MAX_POPS` letters and shapes at once and one every `MIN_CHANGE_MS`, surprises by their own
  limits, the same key again only after `SAME_KEY_PAUSE_MS` (meanwhile a silent ripple), sparkles at most
  `MAX_SPARKLES`. Wild hammering must stay calm (`tapaway.test.ts`).
- Everything that moves is a small HTML layer animated by `transform` and `opacity` (`tapaway.css`, prefix `tw-`).
- It is a category of its own with `toy: "keyboard"` in `games.ts` (no cover, no world, no book travel): the shelf draws
  it as `ShelfToy` in `Bookshelf.tsx`, first on the picture books' board (the trophy sign hangs at its right end and hid
  it there), `TOY_SPAN` picture books wide so the picture books keep at least 85 % of their size (`shelfLayout.test.ts`).
  A tap presses it down with a knock and a note, then the game opens; ✕ and Esc lead back to the shelf.
