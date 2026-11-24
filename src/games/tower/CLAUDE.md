# Counting Tower (Zähl-Turm)

`/zaehlturm/`, a page of the book „Buchstaben & Zahlen“ (L-18). Built new on 24 November 2026 (user request): one
house built from 1 to 100 in one go. Its name, line and the panel's arrows' names are in all seven languages
(`names.ts`).

## How it plays

- **One continuous level from 1 to 100** (user request, 24 November 2026): no rounds, no cards, no options behind ⚙️.
  It plays at once (`startMode`). Each tap or key lowers the next block from the crane's hook into its place, the fox
  or bear child (`useFigure`, `Kid.tsx`) hops onto it and the voice says its number.
- **The screen's width is used** (user request): a floor is ten blocks side by side across the screen
  (`houseLayout` in `layout.ts`), with a ledge on the left where the child waits for a floor's first block and the
  elevator panel on the right. When a floor's ten are laid, a colourful wooden beam slides in over it from the left,
  the child jumps onto it, and **the camera goes up a floor like a jump-and-run** (the whole world is one layer moved by
  its transform; `cameraAt`). The next ten fill the next row from left to right.
- **Every ten looks different** (user request): each floor has its own colours, pattern and beam (`FLOORS` in
  `floors.ts`), and a few blocks of each floor are part of the house that answer as they land, each with its own
  sound – the front door opening (5), windows lighting up, a cat and a dog looking out, a birdhouse, flowers growing,
  a fish swimming by, a heart, a star (`Special`, `ARRIVAL` in `TowerPlay.tsx`). A floor's tenth is always plain and
  comes down slowly to a drum roll.
- **Big blocks** (user request): as big as ten across the room left of the panel allow, at most a fifth of the screen's
  height (`layout.test.ts` checks every screen).
- **Jump a ten up or back** (user request): the elevator panel on the right holds only its two arrows; ▲ goes on at the
  next ten (11, 21 …), ▼ back to the ten before (on the first floor: from 1). Jumping by tens is all it does – no
  display of the number laid between them (user feedback, 24 November 2026: jumping by tens is enough), nor single
  steps or a number to pick. The scene is built anew there and the
  camera rides from where it was, like an elevator. Only a tap on an arrow jumps (`screenTap`), never a press
  elsewhere.
- At 100 the child runs to the ledge, the roof comes down on the crane's rope, smoke puffs from the chimney, the flag
  goes up and the camera zooms out to the whole house, then `GameEnd` with the game's one trophy. „Nochmal“ builds it
  again from 1 (`onAgain`); there is no „Weiter“ (one level).
- Where it stands is kept: the address's `?seite=` is the next block's number (`useStepAddress`), and the next number is
  stored (`tinytaps.tower.v1`), so a link or a new visit goes on there; after 100 a new visit starts at 1.

## Rules

- Classes are prefixed `zt-` (Zaubertasten has `tw-`; `css.test.ts` fails on a prefixed class two games style).
- Everything that moves (the world as camera, blocks, beams, the hook, the child, roof, flag, smoke, a special's moving
  part) is an HTML layer moved by its transform or opacity with `element.animate` (set the final style, animate from the
  old). The backdrop is one svg drawn once (`Backdrop`, `memo`), never animated inside. `bun run perf zaehlturm` measures
  a floor and the camera going up.
- One press, one block; presses while a block comes down, a beam slides or the camera moves only ripple, with a soft
  knock at most every `EXTRA_SOUND_GAP_MS`. Numbers are said one after the other (`queue`).
- The voice: one to nine from the letters games' recordings (`lettersVoice`), 10–99 their English two-digit words
  (`TWO_DIGIT_WORDS`), 100 `HUNDRED` – silent until recorded, listed in `voiceLines.ts`. The current and next floor's
  words are loaded as a floor starts.
- A new special gets its type in `floors.ts`, its drawing (`ACTOR`, `SpecialBack`/`SpecialActor`/`SpecialFront` in
  `drawings.tsx`) and its arrival and sound in `ARRIVAL`; a floor keeps at least two specials, never on place 10.
- Upright phones (after „Trotzdem hochkant“) show the house narrow with much sky; that is fine, phones are played
  sideways.
