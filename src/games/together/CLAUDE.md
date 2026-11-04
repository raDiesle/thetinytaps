# Was gehört zusammen?

Route `/zusammen/`, in the Zuordnen book. Ideas Z-03 („Was gehört zusammen?“, things of the day) and Z-13 („Wer braucht
das?“, helpers and their tools), built as one game (user decision, November 2026).

One flowing game, like Was gehört zum Tier?: its card plays at once (`startMode`), with no start screen, no cards and no
`level` row; ✕ and „Menü“ go back to the table of contents. Two kinds of rounds take turns (`KIND_ORDER` in
`levels.ts`), each with a speech bubble for grown-ups at the left (`TopicBubble.tsx`, 🤝 „Was gehört zu mir?“ and 🦺 „Was
brauche ich?“):
1. Dinge aus dem Alltag (Z-03): a thing stands above – toothbrush, door, pot, flower pot, sheet of paper – and the child
   taps what belongs to it below (toothpaste, key, lid, watering can, crayon).
2. Helfer und ihr Werkzeug (Z-13): a helper stands above – the fire fox, the bear doctor, the fox baker, the bear
   hairdresser, the fox postman – and the child taps the tool (hose, stethoscope, roll, scissors, parcel).

The right one flies up and the two set to work (`.working`, `WORK_MS`): the toothpaste squeezes a blob onto the brush,
which scrubs; the key turns and the door opens on a bear child; the lid lands and the pot steams; the can pours and the
flower stands up; the crayon draws a heart; the hose puts out the fire; the stethoscope finds the fox child's heart;
the rolls come out of the oven; the scissors cut the fox child's tuft; the parcel goes to the bear child. A wrong pick
stays still on its plate, and the one it belongs to peeks up over its plate for a moment (`.tg-owner`) – never shown as wrong.

Files: `pairs.tsx` holds the pairs, their drawings and sentences (`PAIRS`, `TOGETHER_TEXTS`); `PairPicture.tsx` draws one
above in its 200 × 200 box; `TogetherPlay.tsx` is one round, `TogetherRounds.tsx` the turns, the step and the decks
(`useDeck`, so a thing comes again only after all of its kind); `together.css` all of the moving; `names.ts` the game's name and blurb, also for its card in `games.ts` (there while the
game is German only, see Languages).

**Difficulty** (`TOGETHER_LEVELS`, `dealRound` in `levels.ts`): 2, 3, 3, 4, 4 things to choose from, with the step rule
of Schatten finden (`nextLevel`). Every visit begins on the first step; `?level=N` starts on step N while developing.
Every six rounds count as a game for the play-time limit (`gameEnded`, `countGame`).

## Rules

- Grown-ups change things only behind ⚙️ held while playing (`PlayOptions`): „Was drankommt“ (each kind on or off, the
  last can't be switched off) and „Schwierigkeit“ (Von selbst, Leicht, Mittel, Schwer). No other options.
- Kinds never mix in one round: the wrong choices are partners of the same kind (`dealRound`), and each partner belongs
  to exactly one thing or helper, so exactly one choice fits. A new pair must not fit another one above (no second thing
  a key opens, no helper who also uses scissors); `content.test.ts` checks ids, partners and the dealing.
- Helpers are fox or bear grown-ups (the mascots in a role), the children they help are fox or bear children; no drawn
  people. Fox and bear take turns, so neither is left out.
- Each picture is made of layers (`Layer`), every one a small svg of its own placed in per cent of the box: what moves
  moves as a whole layer, by `transform` or `opacity` (phones, see the root `CLAUDE.md`). Parts that move together (the
  toothpaste blob on the bristles) get the same motion in the picture's units (`--scrub` in each layer's own width).
  What must stay when something goes (the logs under the fire) is a layer of its own. Every layer's class is styled in
  `together.css` (`content.test.ts`).
- A partner is an emoji or a drawing; draw it where the emoji vanishes on the picture (🩺 on the child's green coat was
  replaced by a drawn stethoscope).
- Nothing to read in the picture; names only as `aria-label`. No stars or count of rounds.

## Languages

German only so far (`TOGETHER_TEXTS`, inline `t({ de })`). Every sentence is said from its ElevenLabs recording (`voice.ts`, files in `stimme/`), recorded in German only so far
(November 2026): a sentence in another language stays silent until the user asks for its recordings, a German fallback
sentence plays its German one. A new or changed sentence is listed by `src/content/recordedLines.ts` (`zusammen`) and recorded with
`bun run voice make --only zusammen`, only when the user asks.
Translations and recordings only when the user asks; `languageStatus.ts` says what is missing.
