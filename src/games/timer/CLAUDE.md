# Timer

Route `/timer/` · idea H-04 („Timer zum Zuschauen“). A book of its own among the Alltagshelfer on the shelf once it is finished. While it is being built (`unfinished` in `games.ts`, user decision, November 2026) it is not on the shelf, only linked from `/management/`, and its way back leads there.

A visual timer for the day, not a game: a grown-up picks the minutes in the row above the cards („Wie lange?“: 1, 2, 3,
5 or 10 Min., `TIMER_MINUTES`) and a picture card starts it. Behind them „Andere …“ opens a sheet for grown-ups
(`OwnTimeSheet`, H-59, H-60): any length from 10 seconds to 3 hours (− and + for hours, minutes and seconds, ready slips
for 15 to 60 minutes, typed on a computer), or „Bis um“ a clock time to end at. The time set there stays as a slip of its
own in the row (`own`, `useOwn`) until another comes. Held ⚙️ while it runs shows the time left in digits for
grown-ups (`TimeLeft`, H-62). The child sees no numbers, only the picture running down:
- „Zug zum Bahnhof“ 🚂: a little train rolls along the track to the buffers at the station, where the bear family waits.
- „Sanduhr“ ⏳: the sand runs from the top bulb into the bottom one; the fox family stands beside it.
- „Kerze“ 🕯️: a candle burns down on the table; at the end the bear child leans over and blows it out.
  At the end a friendly tune and the family waves and hops, then `GameEnd` with „Nochmal“ and „Weiter“ (the next picture,
  the same minutes, `nextPicture`). Every tap or key during the run answers (steam and a whistle, twinkling, the flame
  flaring, soft ripples where it was); nothing has to be tapped, so there is no glow or pointing hand.

Every picture moves a small, soft step every second, so even an hour never looks stuck (H-63): the train's wheels turn
once and a puff rises, a big grain falls through the hourglass's neck, a drop of wax runs a little further. And each
shows where it comes from and where it goes (H-64): the train sets off from a little house and the rail ahead shines
while the rail behind is dark, the glass the sand has left keeps a film of it, the wax that ran down spreads on the holder.

Files: `TimerGame.tsx` (start screen: cards, minutes and the own time's slip), `OwnTimeSheet.tsx` (the sheet behind
„Andere …“), `time.ts` (own times: typing, clock times, labels, digits; tested in `time.test.ts`), `TimerPlay.tsx` (one
run: working out its length, the question when a clock time is past, the clock, the phases `running` →
`blow` (candle only) → `done`, taps, the end), `scenes.tsx` (all drawings and their layers; the fox and bear are the shared `Mascot`, so its `GameEnd` has `noFamily`), `timer.css`, `content.ts`
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
- **A clock time behind us is never quietly tomorrow's** (H-60): the sheet asks „Bis morgen um …?“ and keeps the answer
  for that day only (`tomorrowFrom`); a kept „bis 17:30“ started after 17:30 asks again before it runs (`TimerStart`).
  Numbers are for grown-ups only: in the row, the sheet and behind ⚙️, never in the picture.
- **Every second a small step, never a blink** (H-63): what beats once a second is a small layer of its own (`.tm-beat`)
  moving by `transform` and `opacity` – the wheels are small layers riding in the train's, not groups in its svg – and
  stands still at the end (`.tm-done`). Anything new that moves the whole run long snaps to its last place there too.
- Development: `?sekunden=<n>` in the address makes a run take n seconds instead of the minutes chosen.
- It says nothing, so there is no voice line to record.
- Its ideas are the area „Timer“ on `/management/` (`src/content/ideas/h-timer.ts`, H numbers shared with the
  Alltagshelfer): any time to set (H-59 to H-62), pictures that visibly change every second and show where they go,
  also over long times (H-45, H-63 to H-69), and new pictures. A new timer idea goes there, not into the Alltagshelfer.
