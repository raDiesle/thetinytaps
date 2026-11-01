# Belohnungstafel & Zeitplan: both on one page

Route `/belohnungstafel/` (and `/tagesplan/`, the same page opened on a plan: `also` in `games.ts`, so it keeps its
own search entry) · ideas H-01, H-02 (partial) and area T (`src/content/ideas/t-reward-chart.ts`) · research
„belohnungstafel“ in `src/content/research.ts`. One card, „📅 Belohnungstafel & Zeitplan“
(both things it makes, a calendar as its sign – user decision, October 2026; the search entries keep „Tagesplan“, as
parents search for it): the **Belohnungstafel**
(boards of stars, first part below) and the **Tagesplan** (plans of picture cards, second part) share one page, one
row of tabs and one wizard.

## One page, one wizard

`RewardsGame.tsx` is the page for both. On top the grown-up's boards and plans side by side in one row (boards first),
„＋ Neu“ and, where the gallery has no room, „🧩 Vorlagen“; above that row the switch of views of the one shown (a
board's Tag/Woche/Monat/Sammeln, a plan's Jetzt – Dann/Erst – Dann/Woche) with ‹ ›; beside it the Vorlagen
of its kind, grouped under the names of their views; „Gestalten“,
„Drucken“ (and a board's „Rückblick“) work on the one shown. The page remembers whether a board or a plan was shown
(`CHARTS_KEY`, `tinytaps.tafeln.v1`); `/tagesplan/` always opens on a plan, so the teeth card's return and a search
visitor land there.

„＋ Neu“ opens the wizard (`Wizard.tsx`) in place of the chart. Its first step, „Ansicht“, is the whole choice of form
(user feedback, October 2026): both kinds on the one page, each in an area under its name („Belohnungstafel“,
„Zeitplan“, without emoji like every heading, the one the page was opened on first), and in each every view, its name big on top as a heading (Tag,
Woche, Monat, Sammeln; Jetzt – Dann, Erst – Dann, Woche), the view's Vorlagen as big pictures under it,
each with its name above it, a 🔍 on its corner and a small „✏️ Leer anfangen“ beside the view's name. The views
share the rows so they fill them (`--rw-tile`: room for five pictures a row, a view as wide as its pictures). The first
step shows no list of steps – a lone „1 Ansicht“ over the pictures confused (user feedback, October 2026) –, its help
sits at the foot; from the second step on the steps show, on a big screen (≥ 1400 × 700) as a column on the left, the
kinds under „Ansicht“ as links to their areas, the picked one marked. On a big screen the pictures stand three a
row, on columns the views share (`--rw-span`, holes filled by a later view).
The 🔍 shows the Vorlage over the whole screen (`Zoom`, a modal `<dialog>`), with „Auswählen“ and ‹ › through all.
A tap picks a Vorlage (yellow glow, ✓) – only one at a time, of either kind: another tap picks that one instead, a
tap on the picked one puts it back. „Weiter“ goes on to its own steps – `WizardBoard.tsx`: Aufgaben, Belohnung,
Aussehen; `WizardPlan.tsx`: Bilder (with which days), Aussehen – with the whole board or plan beside each step, and
only the last step makes it („✓ Tafel anlegen“ / „✓ Plan anlegen“, `onDone` takes one draft). „Leer anfangen“ goes
there at once. Jetzt – Dann has one Vorlage, „Mein Tag“, and its form is chosen right beside it on the first step
(`DayConfig` in `WizardPlan.tsx`, a cell two pictures wide): the day in two parts, morgens and abends, or „Der ganze
Tag am Stück“; how many cards each part has (− and +, `dayCards` picks the most important of `DAY_CARDS` and keeps
them in the day's order, `withShape` keeps a part whose count didn't change); and „Was wandert?“ – a marker (default)
or the card into a „Jetzt“ field. Every choice of the later steps is a `Pick` (`pageParts.tsx`): a picture of the board
or plan as that choice would make it (colours) or a big picture card (tasks, cards, rewards, marks) – never a plain
list of words. A Vorlage from the gallery beside the chart opens the wizard on its own steps (or shows the board or
plan made from it before). While the wizard is open nothing on top or below belongs to the chart behind it.

In the book look the page is a page of the book like every menu (`<Sky />`), the wizard a sheet of paper laid on it
and its buttons paper (`:root[data-look="book"]` rules at the end of `rewards.css`, kept in the folder rather than in
`book.css`, T-19). The families at the page's foot stay out here: the chart fills the page and would hide them.

No board or plan exists before the wizard made one (`DEFAULT_REWARDS_SETTINGS`, `DEFAULT_PLANNER_SETTINGS` are
empty): with nothing made – a first visit – the page is the wizard, with no ✕ and no row of tabs, as there is nothing
behind it. Only where an older version's first board or plan (`erste`, `erster-plan`, made before anything was saved)
already has stars, `rewardsDefaults` / `plannerDefaults` keep it. Where only one kind is made, the page shows that one,
whatever the address.

# Belohnungstafel

Not a game but a tool for grown-ups that a child taps too: a reward chart the parents design freely and that looks
the same on screen and on paper (A4 from the browser, also offline). It stands as a book of its own (spine out, the first and gold of the „Alltagshelfer“) on the home page's shelf, but has no
`GameShell`: nothing to start or leave, no play time counted, and `PlaytimeLock` lets it through, so the evening
brushing's star still lands after the minutes are over. It may become a website of its own one day (T-19), so the
folder leans on few shared parts (`MenuHead`, `PanelButton`, `SettingControls`, `useStoredSettings`, sfx, speech, tap
targets) – keep it that way.

## Files

- `catalog.ts` – `CHART_TYPES` (Belohnungstafel, Zeitplan) and what grown-ups pick from: tasks (with `linked` for Zähne putzen and Töpfchen, and `slots` for the
  times of day they come with – Zähne putzen: morning and evening), the times of day (`SLOTS`: ☀️ morgens, 🌤️ mittags,
  🌙 abends), rewards (time together first, the ice cream last), marks for a field (with an outline to colour in for
  some), colours, the four views (`KINDS`: Tag, Woche, Monat, Sammeln, each with a line for grown-ups) and the
  templates (each with a `hint`, and `slots` where a task has other times than in the catalogue: „Mein Tag“ dresses in
  the morning, bathes in the evening and brushes at both). Each entry has an
  emoji; its picture comes from `pictures.tsx`.
- `board.ts` – a board and the star log, pure functions: days of a week or month board, field keys (`YYYY-MM-DD|task`,
  with a time of day `YYYY-MM-DD|task|evening`, or `count` on a collecting board; `cellKey`/`parseCellKey`), the fields
  of a task (`taskSlots`), progress, add, take back, start over, `withKind` (the same board in another view: stars
  stay, the goal fits), `exampleStars`, `shiftPeriod`/`samePeriod`/`OLDEST_BACK` for looking back, `reviewPeriods`
  for the Rückblick, `suggestsCertificate`/`longerGoal`/`oncePerDay` for the Urkunde and winding down, `possessive`
  for the title („Lenas Sterne“).
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
  with the preview and the print pages; `Gallery.tsx` – the Vorlagen as small pictures (`Thumb`) with example stars, grouped by view;
  `Wizard.tsx` and `WizardBoard.tsx` – „＋ Neu“ step by step (above); `Review.tsx` – „📜 Rückblick“ (and
  `usePeriodLabel`, „Letzte Woche“, shared with the ‹ › on top); `Certificate.tsx` – „🏅 Urkunde“ (below);
  `RewardsGame.tsx` – the page for boards and plans
  (above). There is no „ℹ️ Über die Tafel“ or „Über den Plan“ (removed with every menu's „Über das Spiel“, user
  decision, October 2026): the chart explains itself by its pictures, the wizard and „Gestalten“.
- `pictures.tsx` – the pictures of `bilder/` in place of the catalogue's emoji (`ItemPic`, `MarkPic`, `Pic`): tasks,
  plan cards, rewards and marks on screen, in the wizard and the editor's chips, on paper and on the photo prints
  (`PhotoCard.picture`, drawn on the canvas); Tapsi celebrating (`fest`) at a party without a reward and at the end of a
  plan, Tapsi with the star (`stern-halten`, unused since „Über die Tafel“ went, waiting for a new place), a theme's strip (`SheetStrip`) along the top of a
  colour print, and the `-linie` twins on grey prints. An `<img class="rw-pic">` takes its size from the font size the
  emoji had (`1.2em`, more where there is room). `tafel.webp` waits for pages with their own og:image (idea V-10).
- `bilder/prompts.ts` – every picture of the chart as its Gemini prompt (made on 30 October 2026, shown on
  `/management/`, 🎨 Bildvorschläge). A changed or new prompt is reviewed there first, then made. Card pictures are
  free-standing cut-outs (never „inside a circle“, `rewards.test.ts`), at least 600 px for photo prints; the `-linie`
  twins are drawn from the colour picture flattened onto white.

## The page

From the first visit, above the board: the switch of views – Tag, Woche, Monat as one big switch (the same stars,
kept per day, seen for a day, a week or a month), Sammeln smaller beside it (it counts stars, not days) – and ‹ › to
go back to earlier days, weeks or months (about two months, as long as stars are kept) to add a forgotten star; the
label turns yellow while it shows the past, and another board or view starts at today again. Below the switch the
row of tabs (a board's tab says the template's name until the board has a heading or a child's name). On phones both
rows share one line that scrolls sideways, so the board keeps the screen.

Beside the board (≥ 1000 × 600 px) the gallery of Vorlagen: every template as a small picture of the board with its
example stars, its name, view and one line. A template whose board was made before selects that board (with its
stars); otherwise it opens the wizard on it (above). In the wizard a task gets its times of day, and the footer stays
in sight.

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

„🏅 Urkunde“ (T-15, a board with tasks) shows in place of the board what ends a round when something works by
itself: a certificate on one A4 page standing – a rosette, „Urkunde für Lena“ (a line to write on without a name),
the task's picture big (its line-art twin on a grey print), its name, „Das kann ich jetzt ganz allein!“, the board's
marks, the date and a line to sign – beside the task to pick, the child's name and „Urkunde drucken“. Below, „Wie
geht es weiter?“ says how parents' guides wind a reward chart down (announce it, then make the stars rarer, then let
the task go) and does each in one tap: „Mehr Sterne bis zur Belohnung: 8 statt 5“ (`longerGoal`, half as many again,
on a collecting board the next size; not on a day board), „nur noch einmal am Tag“ for a task with several times
(`oncePerDay` keeps the last, brushing the evening), and „ablösen“, which takes the task off the board and opens
„Gestalten“ for the next one. Once the goal is reached (on a day board: the last seven days full,
`suggestsCertificate`), a line under the board asks „Klappt es schon von selbst?“ and opens the Urkunde – a grown-up's
line, never a party a child taps into. The certificate prints in colour or grey as the board does.

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
to colour in, a page of stickers to cut out, and a page of the tasks and the reward as picture cards to cut out
(`cards`, T-20, for a Velcro board beside the chart). Both charts print such cards with the same `CutCardPages`
(`PrintPanel.tsx`), never a page layout of their own. Any later print feature (H-02: Schnullerfee-Brief) can
use the same way.

**Fotoabzug** (`photo.ts`, `PhotoPrint.tsx`, H-02): cards for a Velcro board are made for photo paper first – firm,
wipeable, no laminating, and every drugstore, photo kiosk and online shop prints it. The grown-up picks 10 × 15
(default, 4 × 6″ abroad), 13 × 18 (5 × 7″) or 20 × 30 cm (8 × 12″); `photoLayout` lays square cards of at least
`MIN_CARD_MM` (a plan's pictures) or `MIN_STAR_MM` (the board's stars) on it inside a white `PHOTO_MARGIN_MM`, with cut
lines from edge to edge and a white rim inside each cell. A canvas draws each photo as a 300-dpi JPG in the exact
shape of the format (`photoPx`), shown in the panel with „💾 Speichern“ (and „📤 Teilen“ where the browser can share
files, so a phone hands it to the photo app or a shop's app). Below it the guide „Anleitung: vom Foto zur Klett-Tafel“:
save, order like holiday photos (matt, „ganzes Bild“), cut and round the corners, 20 mm Velcro dots (soft side on the
card), safety. The Tagesplan shows it first, before A4; the board after its A4 page.

## Rules

- No punishment, ever: a star is never taken away by the board, only undone right after a mistake; a missed day stays
  an empty field, not a cross or a sad face. No screen time as a reward (T-21 rejected).
- Winding down only ever asks more of a habit that already works – a longer way to the same reward, fewer fields a
  day, a task let go with a certificate – never fewer stars for the same thing or a reward taken back (`rewards.test.ts`
  checks `longerGoal` never shortens).
- Only one set of pages waits for the printer: a panel that prints on its own (the Urkunde) hides the board's print
  pages below it on a computer, or both would come out of the printer (`.rw-print-root` is one per panel).
- The Rückblick shows only what worked: a week without stars is left out, never shown empty or counted as missed
  (`rewards.test.ts` checks `reviewPeriods`).
- Few tasks: the editor advises one to three and allows `MAX_TASKS`; templates use at most three.
- The child's name stays in localStorage only – never in a URL, a log or a picture prompt.
- What is printed and what is on screen come from the same `BoardSheet`; never give print its own layout.
- Defaults are the same on every load: no random id in anything `rewardsDefaults` gives, since an unsaved
  default is rebuilt on each load and stars are keyed by board and task id (a random task id once lost the stars).
- The views and the ready-made boards are clear from the first visit, never behind a menu: a first visit opens the
  wizard, whose first step shows both kinds, every view by its name and its Vorlagen as pictures; Tag, Woche and Monat are the big switch
  above the board (parents do ask for months: „belohnungskalender“, „monthly reward chart“), every view has at least
  one template, and so has every view of a plan (`rewards.test.ts` checks), the gallery lies beside the board where there is room and „🧩 Vorlagen“ is
  in the first row where there is not, and switching a view never loses stars.
- Making a board or plan is the wizard's job, and the wizard shows what each choice makes: a picture of the result
  (views, colours) or a big picture card (tasks, cards, rewards, marks), never only words or small chips. A new choice
  in the wizard is a `Pick`; detail that needs typing (own words, own emoji) stays under „Gestalten“.
- The wizard goes from the form to the content (user feedback, October 2026): kind, view and Vorlage are one step,
  the content follows. Both kinds show at once, grouped in their two areas – never a switch that hides one, which
  grown-ups overlooked; from the second step on, on a big screen, they are named in the steps' column under „Ansicht“.
  Never show a list of steps while there is only the first one to see (a lone „1 Ansicht“ confused). Each view's name stands
  big on top of its Vorlagen as a heading, and a Vorlage's name above its picture, never small below it; a picture has
  no second frame round it (it is framed itself), only a glow when picked. One chart is designed and made at a time:
  a single Vorlage is picked, never several at once (user feedback, November 2026). Every chart goes through every
  step of the wizard, and only the last one makes it – no shortcut like „So nehmen“ on an earlier step (removed, user
  feedback, November 2026). The pictures are as big as the rows allow, with no empty room beside them: check at 1920 × 1080, 1440 × 900,
  1024 × 768 and 844 × 390 (on a computer they were „viel zu klein“, „erkenne ich nicht“, and five a row still were
  on 1920), and every picture of a whole chart has a 🔍 beside the tap that picks it, opening it as big as the screen
  allows – a picture small enough to sit among others is never big enough to read. The pictures are the
  explanation – no description lines under the choices; the one help line, on every step, says what the wizard is
  for: use the charts on screen, print and make them, or order the photo prints, one Vorlage step by step.
- A button that can do nothing is left out, never shown greyed (the first step has no „Zurück“).
- Group what belongs together, and what nobody wants without the other goes on one page: Mein Morgen and Mein Abend
  are one „Mein Tag“ (a plan's `parts`, a board's tasks with their times of day), printed on one page (user feedback,
  October 2026). A view's name says what it shows, never „Tagesansicht“, which reads as „one day only“. What differs
  only in shape is one view with its shape chosen beside its Vorlage, never views or Vorlagen of their own: the old
  Ablaufplan, Jetzt – Dann and „Mein Kita-Tag“ were one plan told apart only by parts and number of cards, and are now
  the one „Jetzt – Dann“ (user feedback, November 2026).
- Never show a board or plan the grown-up didn't make: no default chart (a Zähne-Woche nobody chose was removed),
  a first visit always starts with the wizard (`rewards.test.ts`, `plan.test.ts` check the empty defaults).
- Boards and plans are one page: never a second page, menu card or wizard for one of them; a new kind of chart joins
  `CHART_TYPES` and the wizard's first step.
- A board is never shown empty the first time: templates and new boards show example stars as if in use, but never a
  full board (`rewards.test.ts` checks), pale and named as examples, never saved and never printed.
- What is done more than once a day gets a field each time, marked with its time of day (Zähne putzen: morning and
  evening); a linked game fills the field of the time it was played, never every field of the day.
- Class names built from data get a prefix of their own (`rw-kind-${kind}`), never plain `rw-${id}`: `rw-day` and
  `rw-month` once styled a whole sheet with the rules of a weekday label and the calendar.
- A new catalogue entry needs its picture prompt and line-art twin in `bilder/prompts.ts`, and the pictures made
  (`rewards.test.ts` checks both).
- A picture stands for the catalogue's emoji only: a task, card or reward whose emoji a grown-up changed, and an own
  one, shows that emoji (`itemPicture`); never put a picture over what a grown-up chose.
- A rule that changes `.rw-page` (its `display`, padding) for one kind of page goes after `.rw-page` in `rewards.css`,
  never into `planner.css`: the two stylesheets load in another order on the dev server than in the build, so a page's
  grid in `planner.css` lost to `.rw-page`'s flex and the cut-out cards stood as tall strips in the preview.
- On paper a picture never takes more room than the emoji it replaces where words stand beside it (a week row): the
  bigger pictures cut „Zähne putzen“ to „Zähne putze“ in the A4 preview. Look at the print preview after changing sizes.

# Tagesplan

Route `/tagesplan/` (the page above, opened on a plan) · ideas H-03, H-41–H-43 (H-42 done), T-20 · research
„tagesplan“ in `src/content/research.ts`.

A picture schedule („Strukturtafel“), called „Zeitplan“ beside the Belohnungstafel (`CHART_TYPES`), in three views –
three ways of showing the same cards (`PLAN_VIEWS`): **Jetzt – Dann** (view id `"day"`: the day's cards in reading
order, left to right and row by row, a row per part of the day where it has two; all of them stay fixed on one sheet
and a yellow sticky note – at home a paper arrow, a clothes peg or a sticky note – marks the card to do and moves on;
or, as a variant, `nowField`, the card to do stands big on a panel of its own under „Jetzt“, the others smaller under
„Dann“, and done cards go into the Fertig-Kiste), **Erst – Dann** (pairs of two, each a small board of its own, up to four on a
page to cut apart) and the **Woche** (a column per day). Like the Belohnungstafel a tool, not a game: no `GameShell`, `PlaytimeLock` lets it through, and it
shares the board's page and parts (sheet look, themes, `A4`/`Preview`, the gallery's classes, the star log).

## Files

- `plan.ts` – a plan (`Plan`: its `view`, `days` as seven lists Monday first, or `same: true` and only `days[0]`,
  `nowField` for the „Jetzt“ field; a step's `part` is its part of the day, morning or evening; `fromOlder` reads a
  plan saved as the old view „now-next“ as a Jetzt – Dann with the field), pure functions: the day's shape
  (`shapeOf`, `DAY_SHAPES`, `dayCards`, `withShape`, `partRoom`, `stepLimit`), `planFromTemplate`, `templateLists`,
  `stepsOn`, `stepDone` (a tick in the log, or the linked game – brushing only for the step's `slot`), `currentStep`,
  `nowSteps` (the cards to do now: one, or on an Erst–Dann the first open one of every pair), `partsOf`, `pairsOf`,
  `splitDone` (the row and the Fertig-Kiste), `exampleTicks`, `restartDay` (a day, or only some of its steps),
  `nightsUntil`, `withSteps`, `withSame`, `joinLastPart` (a new card joins the last part), `distinctSteps` (the cards
  to print, a card twice where one day has it twice).
- `catalog.ts` – `ACTIVITIES` (the day's parts, beside the board's `TASKS`), `PLAN_VIEWS`, `NOW_WAYS` (marker or
  „Jetzt“ field, each with the note that says what it means to make), `DAY_CARDS` (the cards a day's shape is filled
  from, per part in the day's order, `rank` saying which come first) and `PLAN_TEMPLATES`: Mein Tag (Jetzt – Dann:
  Morgen and Abend as `parts` on one page), Erst – Dann (four pairs), Wochenplan (own weekdays, with the Kita).
- `PlanSheet.tsx` – the sheet for screen and print, one component per view: `DaySteps` (the rows – `planLayout` picks
  rows and columns for one part, several parts get a line each – with the marker under the card to do; with the field
  the „Jetzt“ panel, the „Dann“ rows and on screen the Fertig-Kiste below, `DoneBox`, and on paper `FieldFrames`),
  `FirstThen` (`pairLayout`), `WeekColumns` (moons for the nights until a day). No date on the sheet: only a printed
  plan whose weekdays differ names its weekday.
- `PlanScreen.tsx` – the sheet on screen and the tick flow (below); `PlanEditor.tsx` – „✏️ Gestalten“;
  `PlanPrint.tsx` – „🖨️ Drucken“: the cards as photo prints (`PhotoPrint`), then A4 with the cards to cut out
  (`CutCardPages`) – what comes besides the sheet is `printsCards`: a marker's plan nothing, the field's always its
  cards, the other views as chosen; `PlanGallery.tsx` – the templates as small pictures (`PlanThumb`);
  `WizardPlan.tsx` – a plan's own steps in the wizard; `planSettings.ts` – plans, current one, print options
  (`tinytaps.planner.v1`); the page is `RewardsGame.tsx`; `pageParts.tsx` – `useComputer`, `PanelButton`, `Pick`;
  `planner.css` – classes `pl-`.
- Ticks live in the board's star log (`REWARDS_STARS_KEY`) under the plan's id, keyed `YYYY-MM-DD|stepId` (`cellKey`).

## The tick flow

The child taps the card to do. In Jetzt – Dann with the marker the card stays in its place with a tick and the sticky
note slides on to the next card, as at home the paper arrow moves along the sheet; with the „Jetzt“ field the card
flies with a sound into the Fertig-Kiste at the bottom edge (H-42), as on a Velcro board at home, and the row gets
shorter until only the last card (the bed) is left. The voice (if on) names what comes next, and the last one starts a
small party. The flight (`PlanScreen`, Web Animations from the card's or the marker's old place, `flyFrom`) only
follows a tap, and is left out with reduced motion. In the
week the cards are small and stay in their column with a ✓. A done card (in the box) twinkles, the box itself names
what is in it, a later one wiggles (in the week: „Noch N-mal schlafen“). No
grown-up hold as on the board: a plan is a guide through the day, not a reward. A key wiggles the „Jetzt“ card but
never ticks it. „↶ Zurück“ shows for a moment after a tick; when the day is done „↺ Von vorn“ starts it again and
every card flies back out of the box (the marker back to the first). On an Erst – Dann each pair stands on its own: the first open card of every
pair is „now“, done cards keep their place with a tick, and „↺ Von vorn“ (shown once a pair is done) clears only the
finished pairs, so the pair can be used again. A new plan shows example ticks (the first steps of today,
never all; with the field pale cards in the box), and the first tap only ends them.

The teeth card, when it is the one to do, opens Zähne putzen instead of ticking (`gameOf`, `GAME_ROUTES` in `plan.ts`): the plan
navigates there with `{ returnTo }` in the router state (`src/lib/routine.ts`), `GameShell` plays at once without the
start screen, and leaving (✕, Esc, „Menü“) goes back to the plan. The plan first notes the card (`waitForStep`, per
visit), the brushing's end calls `finishRoutineStep`, and back on the plan `takeFinishedStep` ticks exactly that card –
also a morning routine's teeth brushed after 14:00, which Zähne putzen files as evening. Left early with ✕, the card
stays „Jetzt“. Such a step is part of the day, not play: no game counted, no play time, and `PlaytimeLock` lets it through. Under
Gestalten a grown-up sets the card to „Nur abhaken“ (`PlanStep.noGame`) when the family brushes without the app.

## Rules

- A key never ticks a card – only a tap on the card to do does, so a child hammering keys doesn't finish the day.
- A card whose game ticks it opens that game only when it is „Jetzt“ (never a done or later card), and the game always
  comes back to the plan; never tick it by the tap as well. A finished game ticks the card it was opened for, whatever
  its own log says (by the clock a late morning brushing is an evening one), so the child never comes back to a card
  that still glows after brushing.
- Few steps: three to six for two- and three-year-olds, `MAX_STEPS` at most, or `MAX_PART_STEPS` in each part of a day
  in two parts (`stepLimit`); a template and every shape the wizard offers stay within it (`plan.test.ts`).
- No clock times and no dates on a plan's sheet: order, „Jetzt – Dann“ and moons for the days to come; toddlers read
  no clock (the date in the corner was removed, user feedback, October 2026).
- In Jetzt – Dann every card stays fixed on one sheet in reading order and only a marker moves to show the card to do
  – that is the default, since nothing is cut out and one sheet is the whole plan (user feedback, November 2026). The
  card that moves into a „Jetzt“ field is a variant (`nowField`), and its cost is said plainly wherever it is chosen
  (wizard, Gestalten) and printed: its cards are printed separately, cut out and fixed with Velcro (`NOW_WAYS`'
  notes, `printsCards`). With the field, „Jetzt“ stands apart: its card big on a lit panel under a banner in the ink's
  colour, parted from the smaller „Dann“ cards by a line, so it is plain which card matters now (user feedback,
  October 2026). Erst – Dann is a view of a plan, like the week; it holds up to four pairs, a page of them
  (`plan.test.ts`).
- Printed cards are big (at least `MIN_CARD_MM`, 4.5 cm, room for a 20 mm Velcro dot) and the texts suggest Velcro
  (Klett), never small magnets: they are a choking hazard under three (research „belohnungstafel“, „tagesplan“).
- Pictures for the boards are made for print first: cards go on a photo format every shop sells (`PHOTO_FORMATS`,
  never a size of our own), in its exact shape at 300 dpi, nothing that matters within `PHOTO_MARGIN_MM` of the edge
  (`photo.test.ts` checks). A generated picture that replaces an emoji must still be sharp there: at least 600 px
  square (5 cm at 300 dpi).
- A new activity needs its `schritt-<id>` prompt and line-art twin in `bilder/prompts.ts` (`plan.test.ts` checks).
- Container units: a `.pl-col` sizes its own gap, padding and border in the sheet's units (`cqmin`), what is inside
  it in its own width (`cqi`) – cqi on the column itself resolves against the sheet and gave huge borders and tiny cards.
- Defaults are the same on every load (the old first plan kept the fixed id `erster-plan`), as for the board.
- A day's cards come from `DAY_CARDS` by rank: a new card for the day's shape joins its part with a rank of its own
  (`plan.test.ts` checks the ranks are unique and that 4 + 4 is Mein Tag).
- A card standing alone in the row (the others in the Fertig-Kiste) keeps a card's shape: a day's slot is never wider
  than tall, or the last card stretched across the whole sheet.

## Languages

Board, plan, wizard, prints and the catalog speak the app language (German, English, Chinese, Hindi, Spanish, Arabic,
Russian; `useAppLanguage()`), translated in October 2026: every text inline as `t({ de, en, zh, hi, es, ar, ru })` or a
`Localized` in `catalog.ts`. New or changed lines come German-only until translations are asked for, marked in
`src/content/ideas/languageStatus.ts` (`inlineTexts.test.ts` fails on a German-only line while the row says done).
- What is built from parts has a form per language, never German pieces glued together: weekday names from
  `DAY_NAMES` (catalog.ts), headings with the child's name from `AUTO_TITLES` (board.ts; Russian puts the name first,
  „Лена: мой день“, as a typed name can't be declined), „Noch 3-mal schlafen“ with `Intl.PluralRules` (`SLEEPS_LEFT`).
- A template's title is stored in the language the board or plan was made in, and shown in the app language as long
  as it is still a template's own title in any language (`isTemplateTitle`); a title a grown-up typed stays as typed.
- Chinese, Hindi and Arabic have no Latin letters (no „A4“ there, „cm“ as 厘米 / सेमी / سم); German shop names and
  links (dm, CEWE, amazon.de) stay on German screens only.
