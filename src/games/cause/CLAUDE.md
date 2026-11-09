# Was ist passiert?

Route `/was-ist-passiert/`, idea **J-03** (area J on `/management/`, `src/content/ideas/j-feelings-games.ts`), the fourth
game of the book „Gefühle“ (after „Alltagssituationen“, „Wie geht's dir?“ and „Was brauche ich?“). A child (fox or bear,
with its grown-up beside it) shows a feeling in its face; two pictures show what happened. The right one lets the face
change (crying → smiling, the grown-up claps), then the next round comes. A wrong one only makes the child shake its head
gently. **Still being built** (`unfinished` in `games.ts`, user feedback, November 2026: trying it, the user didn't
understand it): it stands neither in the book nor in search results, only under „🚧 In Arbeit“ on `/management/`, with
its help text (`CAUSE_HELP` in `names.ts`, shown there as `Game.help`). Before publishing it, it must explain itself by
playing: a feeling plain beyond the mouth (sad and angry are both `frown` now), causes shown as scenes rather than
lone emojis, and the cause played out – then drop the mark, delete the help, and name the game again in the book's
search texts (`/spiele/gefuehle/`, all seven languages). Four rounds, then the shared end (`GameEnd`, „Nochmal“). Plays at once, no start screen, no settings, silent:
no voice, only the sounds of a tap (`playTwinkle`, `playPlop`).
- `CauseGame.tsx` – the start screen (`GameShell startMode="play"`).
- `CausePlay.tsx` – the rounds, taps, keys (digits pick, any other key one at random), the timer to the next round.
- `rounds.ts` – the rounds and their pictures (emojis; the `label` is for grown-ups and read out only).
- `names.ts` – the name and line, German only (the language row in `languageStatus.ts` says so).
- `cause.css` – classes prefixed `cause-`.

Rules of this game:
- Exactly one picture per round fits the feeling (`cause.test.ts`).
- The pictures are emojis, not drawings: no text in them.
- The head shake is on the HTML layer round the child's svg (`.cause-no`), never inside the svg.
