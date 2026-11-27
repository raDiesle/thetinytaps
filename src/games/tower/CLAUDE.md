# Counting Tower (Zähl-Turm)

`/zaehlturm/`, a page of the book „Buchstaben & Zahlen“ (L-18). Built new on 24 November 2026 (user request): one
house built from 1 to 100 in one go. Its name, line and the plus's name are in all seven languages (`names.ts`).

## How it plays

- **One continuous level from 1 to 100** (user request, 24 November 2026): no rounds, no cards, no options behind ⚙️.
  It plays at once (`startMode`). Each tap or key lowers the next block from the crane's hook into its place, the fox
  or bear child (`useFigure`, `Kid.tsx`) hops onto it and the voice says its number.
- **The number comes only as the block lands** (user request, 25 November 2026): the block on the hook shows a „?“
  (`HouseBlock hidden`), and its number appears once it is laid.
- **The screen's width is used** (user request): a floor is ten blocks side by side across the screen
  (`houseLayout` in `layout.ts`), with a ledge on the left where the child waits for a floor's first block. When a
  floor's ten are laid, a colourful wooden beam slides in over it from the left, the child jumps onto it, and **the
  camera goes up a floor like a jump-and-run** (the whole world is one layer moved by its transform; `cameraAt`). The
  next ten fill the next row from left to right.
- **No block looks like another** (user request, 25 November 2026): each floor has its own colours, pattern and beam
  (`FLOORS` in `floors.ts`), and each block wears a dressing of its own round its number – cat or bunny ears,
  headphones, a crown, wheels, spikes, flowers, water the number swims in, a cake's candle, wings … (`DRESSINGS`,
  `dressingOf`: shifted by `FLOOR_SHIFT` each floor, so no dressing repeats beside or above itself) – which arrives with
  a little move and, where it has one, its sound (`DRESS_ARRIVAL` in `TowerPlay.tsx`). A floor's tenth comes down
  slowly to a drum roll.
- **Big blocks** (user request, asked twice): ten across the whole width left inside the book's paper margin
  (`--frame`, measured and passed to `houseLayout`), at most a fifth of the screen's height; the plus's narrow room is
  all that stands beside them (`layout.test.ts` checks every screen, at 844 wide at least 70 px).
- **Going on at the next ten is a small plus** (user feedback, 25 November 2026: the elevator panel's arrows were far
  too loud): a pale, dashed little plus at the right end of the row that comes next (`AddRow`, `plusAt`), named only for
  screen readers („Next ten“). A tap lays the rest of this ten at once and goes on at 11, 21 … – the camera rides from
  where it was. There is no way back by a ten and no panel showing the number; never bring either back. Only a tap on
  the plus jumps (`screenTap`), never a press elsewhere.
- **Swipe or scroll to look up and down the house** (user request, 25 November 2026): a finger or mouse dragged up or
  down, or the mouse wheel, moves the camera within `lookRange` (the floors built, a little sky above); nothing is laid
  then. The next press rides back to the building floor (`BACK_MS`) and lays its block.
- At 100 the child runs to the ledge, the roof comes down on the crane's rope, smoke puffs from the chimney, the flag
  goes up and the camera zooms out to the whole house, then `GameEnd` with the game's one trophy. „Nochmal“ builds it
  again from 1 (`onAgain`); there is no „Weiter“ (one level).
- Where it stands is kept: the address's `?seite=` is the next block's number (`useStepAddress`), and the next number is
  stored (`tinytaps.tower.v1`), so a link or a new visit goes on there; after 100 a new visit starts at 1.

## Rules

- Classes are prefixed `zt-` (Tippzauber has `tw-`; `css.test.ts` fails on a prefixed class two games style).
- **The number is the same on every block** (user feedback, 25 November 2026): one font, size, weight and outline
  (`BlockNumber`), always in the block's middle. A block differs only round it – its frame, outline, colour, pattern
  and the dressing – never by a smaller, moved or differently drawn number, and nothing lies over it. So no motif that
  needs the face for itself (a door, a window with a light in it: not recognised, user feedback). A dressing draws
  behind the face (`back`), on the face under the number, clipped to it (`inside`, like the water), or round the edge in
  front (`front`), in the 100 × 100 cell and the room just outside it.
- A new dressing gets its name in `DRESSINGS`, its drawing in `dressParts` (`drawings.tsx`) and its move and sound in
  `DRESS_ARRIVAL`; `layout.test.ts` keeps every block's look (pattern + dressing) unique, no dressing beside or above
  itself, and every dressing used. A dressing must be big enough to be seen at a phone's block size (look at 844×390).
- Everything that moves (the world as camera, blocks and their dressings, beams, the hook, the child, roof, flag, smoke)
  is an HTML layer moved by its transform or opacity with `element.animate` (set the final style, animate from the
  old). The backdrop is one svg drawn once (`Backdrop`, `memo`), never animated inside. `bun run perf zaehlturm`
  measures a floor and the camera going up.
- **A press lays its block as the finger lifts, or after holding still for `HOLD_MS`**, not as it lands: the scene is
  swiped, so a finger moving `SWIPE_PX` first is a look, not a block (the one exception to „targets react on
  `onPointerDown`“, which stays true for the plus). A second finger lays at once; keys lay at once.
- One press, one block; presses while a block comes down, a beam slides or the camera moves only ripple, with a soft
  knock at most every `EXTRA_SOUND_GAP_MS`, and a dressing's sound comes at most that often too. Numbers are said one
  after the other (`queue`).
- The voice: one to nine from the letters games' recordings (`lettersVoice`), 10–99 their English two-digit words
  (`TWO_DIGIT_WORDS`), 100 `HUNDRED` – silent until recorded, listed in `voiceLines.ts`. The current and next floor's
  words are loaded as a floor starts.
- Upright phones (after „Trotzdem hochkant“) show the house narrow with much sky; that is fine, phones are played
  sideways.
