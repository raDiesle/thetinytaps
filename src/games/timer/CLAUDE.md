# Timer

Route `/timer/` · idea H-04 („Timer zum Zuschauen“). A book of its own among the Alltagshelfer on the shelf once it is finished. While it is being built (`unfinished` in `games.ts`, user decision, November 2026) it is not on the shelf, only linked from `/management/`, and its way back leads there.

A visual timer for the day, not a game: a grown-up picks the minutes in the row above the cards („Wie lange?“: 1, 2, 3,
5 or 10 Min., `TIMER_MINUTES`) and a picture card starts it. The child sees no numbers, only the picture running down:
- „Zug zum Bahnhof“ 🚂: a little train rolls along the track to the buffers at the station, where the bear family waits.
- „Sanduhr“ ⏳: the sand runs from the top bulb into the bottom one; the fox family stands beside it.
- „Kerze“ 🕯️: a candle burns down on the table; at the end the bear child leans over and blows it out.
  At the end a friendly tune and the family waves and hops, then `GameEnd` with „Nochmal“ and „Weiter“ (the next picture,
  the same minutes, `nextPicture`). Every tap or key during the run answers (steam and a whistle, twinkling, the flame
  flaring, soft ripples where it was); nothing has to be tapped, so there is no glow or pointing hand.

Files: `TimerGame.tsx` (start screen: cards and minutes), `TimerPlay.tsx` (one run: the clock, the phases `running` →
`blow` (candle only) → `done`, taps, the end), `scenes.tsx` (all drawings and their layers), `timer.css`, `content.ts`
(names, order), `settings.ts`.

## Rules

- **A tool, not a game** (`GameShell tool`, `/timer` in `PlaytimeLock`): it counts no play time, never says good night
  and still runs when play time is over – „noch fünf Minuten spielen“ is about the real world. Its „Nochmal“ and
  „Weiter“ count no game either (`useCountsPlaytime`).
- **Real minutes**: the end is `Date.now()` past `endsAt`, checked every second and again when the page comes back, so
  a phone that slept in between still ends on time; the screen is kept on while it runs (`useWakeLock`). At the end the
  CSS snaps every moving part to its last place (`.tm-done`), whatever the animation's clock says.
- **Phones keep up**: everything that moves is an HTML layer of its own (`Layer`), moved by one CSS animation as long
  as the timer (`--tm-ms` on the stage), never React drawing per frame; the backdrops are `memo` and drawn once. The
  stage is 1600 × 900 covering the screen: keep what matters within x 200–1400 and y 80–820.
- Development: `?sekunden=<n>` in the address makes a run take n seconds instead of the minutes chosen.
- It says nothing, so there is no voice line to record.
