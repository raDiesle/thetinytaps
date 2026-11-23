# Counting Tower (Zähl-Turm)

`/zaehlturm/`, a page of the book „Buchstaben & Zahlen“ (L-18, November 2026). Every key or tap puts the next block
on a tower, the fox or bear child (`useFigure`, `Kid.tsx`) climbs onto it and the voice says its number. English first:
its name, the goals' names and the options behind ⚙️ wait for their translations (`languageStatus.ts`).

## How it plays

- It counts to one hundred, with no option for less (user decision, November 2026): ten rounds of ten blocks, 1–10,
  11–20 … 91–100, the numbers printed on the blocks and the big digit beside the tower showing the whole number (the
  tenth block of each round gold). It plays at once (`startMode`), no start screen.
- Each round has a goal of its own above the tower, in `GOAL_ORDER` (`names.ts`): balloon, nest, paper plane, cloud,
  rainbow slide, kite, big bird, hot-air balloon, the owl's hollow and the moon at 100. The sky goes from morning to
  night over the ten rounds (`SKY` in `drawings.tsx`). Every block must bring more suspense: the goal stirs and comes
  nearer at blocks 3, 6 and 9 (`STIR_AT`), the tower leans and sways a little more with each block (`BLOCK_SHIFT`,
  `SWAY_DEG`), the child reaches up from the eighth, and the goal is out of reach at nine and reached at ten
  (`layout.test.ts` checks this for every goal on every screen). The tenth block lands slower (`LAST_FLY_MS`).
- At ten the goal does its own thing with the child (`FINALE`: floats carry it down, homes take the baby animal back and
  the child jumps into the leaves, the cloud and the moon rock it, the rainbow is a slide, the bird and the hot-air
  balloon take it for a ride), the tower tumbles, and `GameEnd` shows that round's trophy (`level` = the goal).
  „Nochmal“ builds the same round again, „Weiter“ goes on to the next ten (after 100: from 1),
  showing the next goal on its sky (`GoalCard` in `drawings.tsx`, user request, 23 November 2026).
- Behind ⚙️ (held, `PlayOptions`, as play starts its `intro`) only two things, user request November 2026: „Start at“, a
  slider 1–100 that jumps to any number and goes on from there – the earlier blocks of that round already stand, without
  flying in – and „From 1“. Nothing else goes there; no settings of the start screen.
- Where it stands is kept: the address's `?seite=` is the next block's number (`useStepAddress`), and the next number is
  stored (`tinytaps.tower.v1`), so a link or a new visit goes on there.

## Rules

- Everything that moves (blocks, the child, the goal, the tower swaying, stars, leaves) is a small HTML layer moved by
  its transform with `element.animate`; the sky, meadow and tree are one svg drawn once (`Backdrop`, `memo`). Never
  animate inside that svg. `bun run perf zaehlturm` measures a round.
- One press, one block; presses while a block flies or the finale runs only ripple, with a soft knock at most every
  `EXTRA_SOUND_GAP_MS`. Numbers are said one after the other, never over each other.
- The voice: one to nine from the letters games' recordings (`lettersVoice`), 10–99 their English two-digit words
  (`TWO_DIGIT_WORDS`), 100 `HUNDRED` – silent until recorded, listed in `voiceLines.ts`.
- A new goal gets its place in `goalPlace` (`layout.ts`, checked on every screen in `layout.test.ts`), its drawing, its
  `FINALE` timing, its name in `GOAL_NAMES`, its trophy picture, its `GoalCard`, and the SEO texts in all seven languages name it.
