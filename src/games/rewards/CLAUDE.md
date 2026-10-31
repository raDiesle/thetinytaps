# Belohnungstafel & Tagesplan: both on one page

Route `/belohnungstafel/` (and `/tagesplan/`, the same page opened on a plan: `also` in `games.ts`, so it keeps its
own search entry) · ideas H-01, H-02 (partial) and area T (`src/content/ideas/t-reward-chart.ts`) · research
„belohnungstafel“ in `src/content/research.ts`. One card, „🌟 Belohnungstafel & Tagesplan“
(both names, as parents search for them – user decision, October 2026): the **Belohnungstafel**
(boards of stars, first part below) and the **Tagesplan** (plans of picture cards, second part) share one page, one
row of tabs and one wizard.

## One page, one wizard

`RewardsGame.tsx` is the page for both. On top the grown-up's boards and plans side by side in one row (boards first),
„＋ Neu“ and, where the gallery has no room, „🧩 Vorlagen“; above that row the switch of views of the one shown (a
board's Tag/Woche/Monat/Sammeln, a plan's Tag/Woche) with ‹ ›; beside it the Vorlagen of its kind; „Gestalten“,
„Drucken“ (and a board's „Rückblick“) work on the one shown. The page remembers whether a board or a plan was shown
(`CHARTS_KEY`, `tinytaps.tafeln.v1`); `/tagesplan/` always opens on a plan, so the teeth card's return and a search
visitor land there.

„＋ Neu“ opens the wizard (`Wizard.tsx`) in place of the chart: 1 Art (two big pictures: a board with example stars, a
plan with example ticks), 2 Ansicht (only how it looks: a board's Tag, Woche, Monat, Sammeln, a plan's Tag, Woche –
each as one example board or plan in that view), 3 Vorlage („Leer anfangen“ first, then only that view's
templates), then the kind's own steps – `WizardBoard.tsx`: Aufgaben, Belohnung, Aussehen; `WizardPlan.tsx`: Bilder
(with which days), Aussehen. Every choice is a `Pick` (`pageParts.tsx`): a picture of the board or plan as that
choice would make it (kinds, views, colours) or a big picture card (tasks, cards, rewards, marks) – never a plain list
of words. The first three steps are pictures only, as big as the screen lets them stay in sight (`.rw-picks-big`,
`.rw-picks-views`, `.rw-gallery-big`), with their names and no lines of text. From step 4 the whole board or plan
stands beside each step; „✓ So nehmen“ makes it from any step after the Vorlage. A Vorlage from the gallery beside the
chart opens the wizard on step 4 (or shows the board or plan made from it before). While the wizard is open nothing
on top or below belongs to the chart behind it.

No board or plan exists before the wizard made one (`DEFAULT_REWARDS_SETTINGS`, `DEFAULT_PLANNER_SETTINGS` are
empty): with nothing made – a first visit – the page is the wizard, with no ✕ and no row of tabs, as there is nothing
behind it. Only where an older version's first board or plan (`erste`, `erster-plan`, made before anything was saved)
already has stars, `rewardsDefaults` / `plannerDefaults` keep it. Where only one kind is made, the page shows that one,
whatever the address.

# Belohnungstafel

Not a game but a tool for grown-ups that a child taps too: a reward chart the parents design freely and that looks
the same on screen and on paper (A4 from the browser, also offline). It stands as a book of its own (spine out, of „Für jeden Tag“) on the home page's shelf, but has no
`GameShell`: nothing to start or leave, no play time counted, and `PlaytimeLock` lets it through, so the evening
brushing's star still lands after the minutes are over. It may become a website of its own one day (T-19), so the
folder leans on few shared parts (`MenuHead`, `PanelButton`, `SettingControls`, `useStoredSettings`, sfx, speech, tap
targets) – keep it that way.

## Files

- `catalog.ts` – what grown-ups pick from: tasks (with `linked` for Zähne putzen and Töpfchen, and `slots` for the
  times of day they come with – Zähne putzen: morning and evening), the times of day (`SLOTS`: ☀️ morgens, 🌤️ mittags,
  🌙 abends), rewards (time together first, the ice cream last), marks for a field (with an outline to colour in for
  some), colours, the four views (`KINDS`: Tag, Woche, Monat, Sammeln, each with a line for grown-ups) and the
  templates (each with a `hint`, and `slots` where a task has fewer times than in the catalogue). Each entry has an
  emoji; its picture comes from `pictures.tsx`.
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
  `Wizard.tsx` and `WizardBoard.tsx` – „＋ Neu“ step by step (above); `Review.tsx` – „📜 Rückblick“ (and
  `usePeriodLabel`, „Letzte Woche“, shared with the ‹ › on top); `RewardsGame.tsx` – the page for boards and plans
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
to colour in, and a page of stickers to cut out. Any later print feature (H-02: Schnullerfee-Brief) can
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
- The Rückblick shows only what worked: a week without stars is left out, never shown empty or counted as missed
  (`rewards.test.ts` checks `reviewPeriods`).
- Few tasks: the editor advises one to three and allows `MAX_TASKS`; templates use at most three.
- The child's name stays in localStorage only – never in a URL, a log or a picture prompt.
- What is printed and what is on screen come from the same `BoardSheet`; never give print its own layout.
- Defaults are the same on every load: no random id in anything `rewardsDefaults` gives, since an unsaved
  default is rebuilt on each load and stars are keyed by board and task id (a random task id once lost the stars).
- The views and the ready-made boards are clear from the first visit, never behind a menu: a first visit opens the
  wizard, whose first steps show both kinds, their views and the Vorlagen of a view as big pictures; Tag, Woche and Monat are the big switch
  above the board (parents do ask for months: „belohnungskalender“, „monthly reward chart“), every view has at least
  one template, and so has every view of a plan (`rewards.test.ts` checks), the gallery lies beside the board where there is room and „🧩 Vorlagen“ is
  in the first row where there is not, and switching a view never loses stars.
- Making a board or plan is the wizard's job, and the wizard shows what each choice makes: a picture of the result
  (views, colours) or a big picture card (tasks, cards, rewards, marks), never only words or small chips. A new choice
  in the wizard is a `Pick`; detail that needs typing (own words, own emoji) stays under „Gestalten“.
- The wizard goes from the form to the content (user feedback, October 2026): kind, then the view (how it looks, never
  what is on it), then a Vorlage of that view, „Leer anfangen“ first, then the content. Its pictures are the
  explanation – no description lines under the steps or the choices, and the room they took goes to bigger pictures
  (check them on a computer too: even there they were „viel zu klein“).
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
- On paper a picture never takes more room than the emoji it replaces where words stand beside it (a week row): the
  bigger pictures cut „Zähne putzen“ to „Zähne putze“ in the A4 preview. Look at the print preview after changing sizes.

# Tagesplan

Route `/tagesplan/` (the page above, opened on a plan) · ideas H-03, H-41–H-43 (H-42 done), T-20 (partial) · research
„tagesplan“ in `src/content/research.ts`.

A picture schedule („Strukturtafel“): the steps of a day as big cards in order, „Jetzt“ above the one to do now, and a
week of columns. Like the Belohnungstafel a tool, not a game: no `GameShell`, `PlaytimeLock` lets it through, and it
shares the board's page and parts (sheet look, themes, `A4`/`Preview`, the gallery's classes, the star log).

## Files

- `plan.ts` – a plan (`Plan`: view `day` or `week`, `days` as seven lists Monday first, or `same: true` and only
  `days[0]`), pure functions: `planFromTemplate`, `stepsOn`, `stepDone` (a tick in the log, or the linked game –
  brushing only for the step's `slot`), `currentStep`, `splitDone` (the row and the Fertig-Kiste), `exampleTicks`, `restartDay`, `nightsUntil`, `withSteps`,
  `withSame`, `distinctSteps` (the cards to print).
- `catalog.ts` – `ACTIVITIES` (the day's parts, beside the board's `TASKS`), `PLAN_VIEWS` and `PLAN_TEMPLATES`:
  Morgenroutine, Abendroutine, Erst – Dann, Kita-Tag (own weekdays), Wochenplan.
- `PlanSheet.tsx` – the sheet for screen and print: day cards (`planLayout` picks rows and columns for the box) and on
  screen the Fertig-Kiste below them (`DoneBox`), Erst–Dann with the arrow while both of its two steps are open, the week's columns with moons for the nights until a day.
- `PlanScreen.tsx` – the sheet on screen and the tick flow (below); `PlanEditor.tsx` – „✏️ Gestalten“;
  `PlanPrint.tsx` – „🖨️ Drucken“: the cards as photo prints (`PhotoPrint`), then A4 with the cards to cut out; `PlanGallery.tsx` – the templates as small pictures (`PlanThumb`);
  `WizardPlan.tsx` – a plan's own steps in the wizard; `planSettings.ts` – plans, current one, print options
  (`tinytaps.planner.v1`); the page is `RewardsGame.tsx`; `pageParts.tsx` – `useComputer`, `PanelButton`, `Pick`;
  `planner.css` – classes `pl-`.
- Ticks live in the board's star log (`REWARDS_STARS_KEY`) under the plan's id, keyed `YYYY-MM-DD|stepId` (`cellKey`).

## The tick flow

The child taps the card under „Jetzt“: in the day view it flies with a sound into the Fertig-Kiste at the bottom edge
(H-42), as on a Velcro board at home, and the row gets shorter until only the last card (the bed) is left; the voice (if
on) names what comes next, and the last one starts a small party, the full basket filling the sheet. The flight
(`PlanScreen`, Web Animations from the card's old place) only follows a tap, and is left out with reduced motion. In the
week the cards are small and stay in their column with a ✓. A done card (in the box) twinkles, the box itself names
what is in it, a later one wiggles (in the week: „Noch N-mal schlafen“). No
grown-up hold as on the board: a plan is a guide through the day, not a reward. A key wiggles the „Jetzt“ card but
never ticks it. „↶ Zurück“ shows for a moment after a tick; when the day is done „↺ Von vorn“ starts it again (for the
next Erst–Dann) and every card flies back out of the box. A new plan shows example ticks (the first steps of today,
never all; in the day view pale cards in the box), and the first tap only ends them.

The teeth card under „Jetzt“ opens Zähne putzen instead of ticking (`gameOf`, `GAME_ROUTES` in `plan.ts`): the plan
navigates there with `{ returnTo }` in the router state (`src/lib/routine.ts`), `GameShell` plays at once without the
start screen, and leaving (✕, Esc, „Menü“) goes back to the plan. The plan first notes the card (`waitForStep`, per
visit), the brushing's end calls `finishRoutineStep`, and back on the plan `takeFinishedStep` ticks exactly that card –
also a morning routine's teeth brushed after 14:00, which Zähne putzen files as evening. Left early with ✕, the card
stays „Jetzt“. Such a step is part of the day, not play: no game counted, no play time, and `PlaytimeLock` lets it through. Under
Gestalten a grown-up sets the card to „Nur abhaken“ (`PlanStep.noGame`) when the family brushes without the app.

## Rules

- A key never ticks a card – only a tap on „Jetzt“ does, so a child hammering keys doesn't finish the day.
- A card whose game ticks it opens that game only when it is „Jetzt“ (never a done or later card), and the game always
  comes back to the plan; never tick it by the tap as well. A finished game ticks the card it was opened for, whatever
  its own log says (by the clock a late morning brushing is an evening one), so the child never comes back to a card
  that still glows after brushing.
- Few steps: three to six for two- and three-year-olds, `MAX_STEPS` at most; a template stays within it (`plan.test.ts`).
- No clock times: order, „Jetzt – Dann“ and moons for the days to come; toddlers read no clock.
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
