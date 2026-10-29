# Belohnungstafel

Route `/belohnungstafel/` · ideas H-01, H-02 (partial) and area T (`src/content/ideas/t-reward-chart.ts`) · research
„belohnungstafel“ in `src/content/research.ts`. The folder also holds the **Tagesplan** (`/tagesplan/`, below).

Not a game but a tool for grown-ups that a child taps too: a reward chart the parents design freely and that looks
the same on screen and on paper (A4 from the browser, also offline). It is in the „Weitere“ category, but has no
`GameShell`: nothing to start or leave, no play time counted, and `PlaytimeLock` lets it through, so the evening
brushing's star still lands after the minutes are over. It may become a website of its own one day (T-19), so the
folder leans on few shared parts (`MenuHead`, `PanelButton`, `SettingControls`, `useStoredSettings`, sfx, speech, tap
targets) – keep it that way.

## Files

- `catalog.ts` – what grown-ups pick from: tasks (with `linked` for Zähne putzen and Töpfchen, and `slots` for the
  times of day they come with – Zähne putzen: morning and evening), the times of day (`SLOTS`: ☀️ morgens, 🌤️ mittags,
  🌙 abends), rewards (time together first, the ice cream last), marks for a field (with an outline to colour in for
  some), colours, the four views (`KINDS`: Tag, Woche, Monat, Sammeln, each with a line for grown-ups) and the
  templates (each with a `hint`, and `slots` where a task has fewer times than in the catalogue). All emoji for now.
- `board.ts` – a board and the star log, pure functions: days of a week or month board, field keys (`YYYY-MM-DD|task`,
  with a time of day `YYYY-MM-DD|task|evening`, or `count` on a collecting board; `cellKey`/`parseCellKey`), the fields
  of a task (`taskSlots`), progress, add, take back, start over, `withKind` (the same board in another view: stars
  stay, the goal fits), `exampleStars`, `shiftPeriod`/`samePeriod`/`OLDEST_BACK` for looking back, `reviewPeriods`
  for the Rückblick, `possessive` for the title („Lenas Sterne“).
- `linked.ts` – what Zähne putzen (`loadWeek`, with morning or evening) and Aufs Töpfchen (`loadStars`, a count) did
  on which day; such a field is filled without a star in the log – brushing fills the field of its time of day, the
  potty fills a task's fields in the order of the day. Only on day, week and month boards: those games keep two weeks,
  a collecting board would lose stars.
- `settings.ts` – boards, the current one and the print options (`tinytaps.rewards.v1`); stars live apart
  (`tinytaps.rewards.stars.v1`), so changing a board never loses them. The first board has the fixed id `erste`, so
  its stars stay before anything was saved.
- `BoardSheet.tsx` – the sheet itself, used for screen and print alike: week grid, month calendar, day cards or a snaking path
  (`snakeLayout`) to the reward, and the goal below. Sized in container units (`cq*`), so it fits any box.
- `BoardScreen.tsx` – the sheet on screen and the star flow (below).
- `Editor.tsx` – „✏️ Gestalten“ (and `SlotChips`, how often a day a task gets a star); `PrintPanel.tsx` – „🖨️ Drucken“
  with the preview and the print pages; `Gallery.tsx` – the Vorlagen as small pictures (`Thumb`) with example stars;
  `Wizard.tsx` – „＋ Neue Tafel“ step by step; `Review.tsx` – „📜 Rückblick“ (and `usePeriodLabel`, „Letzte Woche“,
  shared with the ‹ › on top); `RewardsGame.tsx` – the page (below).
- `bilder/prompts.ts` – every picture the chart may want, as Gemini prompts. No picture is made yet: the user reviews
  them on `/management/` (🎨 Bildvorschläge, `src/components/PicturePromptReview.tsx`) first. Only generate after
  that, with the reviewed text, and then swap the emoji for the pictures.

## The page

From the first visit, above the board: the switch of views – Tag, Woche, Monat as one big switch (the same stars,
kept per day, seen for a day, a week or a month), Sammeln smaller beside it (it counts stars, not days) – and ‹ › to
go back to earlier days, weeks or months (about two months, as long as stars are kept) to add a forgotten star; the
label turns yellow while it shows the past, and another board or view starts at today again. Below the switch the
row of the grown-up's boards (a tab says the template's name until the board has a heading or a child's name),
„＋ Neue Tafel“ and, where the gallery has no room, „🧩 Vorlagen“. On phones both rows share one line that scrolls
sideways, so the board keeps the screen.

Beside the board (≥ 1000 × 600 px) the gallery of Vorlagen: every template as a small picture of the board with its
example stars, its name, view and one line. A template whose board was made before selects that board (with its
stars); otherwise it opens the wizard on it. The wizard (in place of the board): 1 Vorlage (or „Leer anfangen“),
2 Ansicht, 3 Aufgaben with their times of day, 4 Belohnung and goal, 5 Name and colours, with the board as it will
look beside each step; „✓ So nehmen“ makes the board from any step after the first, its footer stays in sight.

A new board (from a template, the wizard or the default) shows example stars (`Board.examples`, `exampleStars`): the
first two days of a week (Monday and Tuesday, the second short of one), the first four days of a month, all but the
last card of a day, two on a path – pale, with a line under the board saying so and „Ausblenden“. They are never in
the log and never printed; the first real star or „Ausblenden“ ends them. An example field is open: holding it gives
the real star.

„📜 Rückblick“ (not on a collecting board) shows in place of the board the last weeks to look at together with the
child – what already worked (T-18): one big, newest first, and all of them below as small pictures in a strip that
scrolls sideways. A tap on the big one, ‹ › or the arrow keys flip on (round), a small one shows it big. A month board
looks back by months, a day board by weeks (a day is too little). Only weeks with stars, as far back as stars are
kept; nothing can be changed there – a forgotten star is added on the board with ‹.

On a computer (≥ 900 px, mouse) „✏️ Gestalten“ and „🖨️ Drucken“ lie open below the board, reached by scrolling (the
buttons on top scroll there); on phones and tablets they open as panels in place of the board.

## Times of day

A task can have a field per time of day (`BoardTask.slots`: morning, noon, evening; none means once a day), chosen
with `SlotChips` in the wizard and under Gestalten. Brushing teeth comes with morning and evening. The week grid
gives such a task a row per time under one head, the month and day views put its fields side by side; every such
field carries its sun or moon on its edge, filled or not, on screen and on paper. A day is full with every time.

## The star flow

A grown-up holds an open field (`HOLD_MS`) while a ring fills; then a big star waits in the middle and the child taps
it (or presses any key), and it flies into the field with a sound. A short tap gives no star: a filled field twinkles,
a field of a later day wiggles, an open one only starts the ring. On a collecting board any open field fills the next
one. A full day gets small bursts, the goal a party (and speech, if Vorlesen is on). „Stern zurück“ shows for
`UNDO_MS` after a star, for a grown-up who held the wrong field.

## Printing

`PrintPages` renders A4 pages (mm-sized, `@page` set per board) into `.rw-print-root` at the end of `<body>`; the print
CSS hides everything else. The print is empty, with „Woche vom ____“ / „Datum ____“ to fill in (a month board prints its month, this one or
the next); options: orientation
(auto: portrait for a day board with up to two tasks), colour or grey (no inline colours, so `.rw-grey` wins), fields
to colour in, and a page of stickers to cut out. Any later print feature (H-02: Bildkarten, Schnullerfee-Brief) can
use the same way.

## Rules

- No punishment, ever: a star is never taken away by the board, only undone right after a mistake; a missed day stays
  an empty field, not a cross or a sad face. No screen time as a reward (T-21 rejected).
- The Rückblick shows only what worked: a week without stars is left out, never shown empty or counted as missed
  (`rewards.test.ts` checks `reviewPeriods`).
- Few tasks: the editor advises one to three and allows `MAX_TASKS`; templates use at most three.
- The child's name stays in localStorage only – never in a URL, a log or a picture prompt.
- What is printed and what is on screen come from the same `BoardSheet`; never give print its own layout.
- Defaults are the same on every load: no random id in anything `DEFAULT_REWARDS_SETTINGS` holds, since an unsaved
  default is rebuilt on each load and stars are keyed by board and task id (a random task id once lost the stars).
- The views and the ready-made boards are clear from the first visit, never behind a menu: Tag, Woche and Monat are
  the big switch above the board (parents do ask for months: „belohnungskalender“, „monthly reward chart“), every
  view has at least one template (`rewards.test.ts` checks), the gallery lies beside the board where there is room
  and „🧩 Vorlagen“ is in the first row where there is not, and switching a view never loses stars.
- A board is never shown empty the first time: templates and new boards show example stars as if in use, but never a
  full board (`rewards.test.ts` checks), pale and named as examples, never saved and never printed.
- What is done more than once a day gets a field each time, marked with its time of day (Zähne putzen: morning and
  evening); a linked game fills the field of the time it was played, never every field of the day.
- Class names built from data get a prefix of their own (`rw-kind-${kind}`), never plain `rw-${id}`: `rw-day` and
  `rw-month` once styled a whole sheet with the rules of a weekday label and the calendar.
- A new catalogue entry needs its picture prompt and line-art twin in `bilder/prompts.ts` (`rewards.test.ts` checks).

# Tagesplan

Route `/tagesplan/` · ideas H-03 (partial), H-41–H-43, T-20 (partial) · research „tagesplan“ in `src/content/research.ts`.

A picture schedule („Strukturtafel“): the steps of a day as big cards in order, „Jetzt“ above the one to do now, and a
week of columns. Like the Belohnungstafel a tool, not a game: no `GameShell`, `PlaytimeLock` lets it through, and it
shares the board's parts (sheet look, themes, `A4`/`Preview`, the gallery's classes, the star log).

## Files

- `plan.ts` – a plan (`Plan`: view `day` or `week`, `days` as seven lists Monday first, or `same: true` and only
  `days[0]`), pure functions: `planFromTemplate`, `stepsOn`, `stepDone` (a tick in the log, or the linked game –
  brushing only for the step's `slot`), `currentStep`, `exampleTicks`, `restartDay`, `nightsUntil`, `withSteps`,
  `withSame`, `distinctSteps` (the cards to print).
- `catalog.ts` – `ACTIVITIES` (the day's parts, beside the board's `TASKS`), `PLAN_VIEWS` and `PLAN_TEMPLATES`:
  Morgenroutine, Abendroutine, Erst – Dann, Kita-Tag (own weekdays), Wochenplan.
- `PlanSheet.tsx` – the sheet for screen and print: day cards (`planLayout` picks rows and columns for the box),
  Erst–Dann with the arrow when a day has exactly two steps, the week's columns with moons for the nights until a day.
- `PlanScreen.tsx` – the sheet on screen and the tick flow (below); `PlanEditor.tsx` – „✏️ Gestalten“;
  `PlanPrint.tsx` – „🖨️ Drucken“ with the cards to cut out; `PlanGallery.tsx` – the templates as small pictures;
  `planSettings.ts` – plans, current one, print options (`tinytaps.planner.v1`); `PlannerGame.tsx` – the page;
  `pageParts.tsx` – `useComputer`, `PanelButton`, shared with `RewardsGame.tsx`; `planner.css` – classes `pl-`.
- Ticks live in the board's star log (`REWARDS_STARS_KEY`) under the plan's id, keyed `YYYY-MM-DD|stepId` (`cellKey`).

## The tick flow

The child taps the card under „Jetzt“: it gets its ✓ with a sound, and the voice (if on) names what comes next; the
last one starts a small party. A done card twinkles, a later one wiggles (in the week: „Noch N-mal schlafen“). No
grown-up hold as on the board: a plan is a guide through the day, not a reward. A key wiggles the „Jetzt“ card but
never ticks it. „↶ Zurück“ shows for a moment after a tick; when the day is done „↺ Von vorn“ starts it again (for the
next Erst–Dann). A new plan shows example ticks (the first steps of today, never all), and the first tap only ends them.

## Rules

- A key never ticks a card – only a tap on „Jetzt“ does, so a child hammering keys doesn't finish the day.
- Few steps: three to six for two- and three-year-olds, `MAX_STEPS` at most; a template stays within it (`plan.test.ts`).
- No clock times: order, „Jetzt – Dann“ and moons for the days to come; toddlers read no clock.
- Printed cards are big (about 6 cm) and the texts suggest Velcro (Klett), never small magnets: they are a choking
  hazard under three (research „belohnungstafel“, „tagesplan“).
- A new activity needs its `schritt-<id>` prompt and line-art twin in `bilder/prompts.ts` (`plan.test.ts` checks).
- Container units: a `.pl-col` sizes its own gap, padding and border in the sheet's units (`cqmin`), what is inside
  it in its own width (`cqi`) – cqi on the column itself resolves against the sheet and gave huge borders and tiny cards.
- Defaults are the same on every load (the first plan has the fixed id `erster-plan`), as for the board.
