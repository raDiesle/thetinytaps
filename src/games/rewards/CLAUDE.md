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
„＋ Neu“ and, where the gallery has no room, „🧩 Vorlagen“; above that row only ‹ › to go back in time – no switch of
views there any more: the view (Tag, Woche, Monat, Countdown, Erst – Dann, Sammeln) is the „Zeitraum“ option of the editor (user
feedback, November 2026). Beside it the Vorlagen of its kind, grouped under the names of their views; „Gestalten“,
„Drucken“ (and a board's „Rückblick“) work on the one shown. Each address opens its own kind: `/belohnungstafel/` a board
or a plan with a Zähler (below), `/tagesplan/` a plan (so the teeth card's return and a search visitor land there) – on
the shelf each is a book of its own, the two tied with a ribbon (`Game.volumes`, user feedback, November 2026), so the book named
Belohnungstafel opens a board, or the wizard where none is made yet (below). Nothing remembers which was shown last.

**One editor, on the chart itself** (`ChartEditor.tsx`, user decision, November 2026: „exakt gleiche Seite für
Assistent und Seite … alles gleich aussieht und funktioniert“): „＋ Neu“ (`Wizard.tsx`) and „✏️ Gestalten“ are the same
component, the very sheet that will be used, changed right on it (WYSIWYG). Above the sheet a band of options
(`.rw-options-band`): **Zeitraum** (Tag, Woche, Monat, Countdown, Erst – Dann, Sammeln, `SPANS`; on the page only the views of the
chart's own kind, since a plan's Tag and a board's Monat are different charts, and none on a Countdown, which is a chart of its own), „Pfeil wandert“ / „Karte wandert“ (only
without a Zähler), the colours and the child's name – nothing the sheet already does with a tap (user feedback, November
2026: the Zähler, a 🎁 Belohnung switch, „Tag aufteilen?“ and „Anzahl Karten“ stood there twice and went). On the
sheet (`edit` on `PlanSheet` / `BoardSheet`, never on paper) every card and the reward carry ⚙️ in their top left
corner and 🗑️ in their top right (`SheetAction.tsx`): ⚙️ (or a tap on the card) opens its window – its own stars (every
day or only this weekday), earlier / later in its part, remove, swap for another card – and 🗑️ takes it at once (↶
brings it back); the reward's ⚙️ opens the goal and the rewards, its 🗑️ leaves the chart without one („＋ Belohnung“
brings it back). ＋ adds a card to a part; a board shows its tasks as chips over the sheet to tap. What needs typing (own words, own emoji, times of day,
„Von vorn“) stays below under „Weitere Einstellungen“ (`Editor`, `PlanEditor`). Between the band and the sheet „✏️ Direkt
auf der Tafel ändern“ says that the sheet is changed as it is seen and printed so, beside ↶ Rückgängig and ↷ Wiederholen
(`history.ts`, also Ctrl/⌘+Z, Ctrl+Shift+Z, Ctrl+Y outside a box for words; letters typed in a row undo as one word);
the sheet has a dashed edge while it is changed. The stars are set where they are seen: − and ＋ stand at the ends of
the card's row of star fields, no number between them (the fields are the count); under the mouse ＋ shows the next
field pale and − pales the last. A plain plan's card has a small „＋⭐“, which makes it count (and brings a reward). A
part's sign (☀️ / 🌙) stands big for its whole line with 🗑️ above it, „„Morgens“ löschen?“, which marks the line red
under the mouse before it takes it. Where only one part is left its sign stays with its own 🗑️ („Zeichen löschen?“):
then the cards stand without a part, and pale „＋ ☀️ / ＋ 🌙“ before the row put a sign back (`SignBack`). Cards are not
numbered unless „Karten nummerieren“ under „Weitere Einstellungen“ says so (`Plan.numbers`, user feedback, November 2026). The wizard starts on **„Mein Tag“**
(`defaultDraft`): morning and evening on one sheet, three cards each, a Zähler of 1 and a reward; a Zeitraum keeps
name, colours and reward (`draftInSpan`; the Woche with a Zähler is the board Vorlage „woche“'s tasks, the same every
day), „✓ Tafel anlegen“ / „✓ Plan anlegen“ makes it. The wizard's head (`.rw-wizard-head`, sticky on top) holds that
button big and yellow, „Abbrechen“ and the stamp „🖨️ Zum Ausdrucken – auf A4 oder als Fotoabzug“; in the wizard an open
note with an arrow under the Zeitraum says one may switch freely between the kinds and set everything. Opened on a template from the
gallery it starts on that template. While the wizard is open nothing on top or below belongs to the chart behind it.

The page is one tall page of the book that carries everything and scrolls with it (user feedback,
November 2026): `<Sky />` lies in the page's box (`position: absolute`), not fixed to the window, the text for search
engines is on it too, and the content keeps inside its paper margin. The wizard is printed on the page, no card laid on
it; its buttons are paper (`:root` rules at the end of `rewards.css`, kept in the folder rather than in
`book.css`, T-19). The families, the room's floor and its toys at the page's foot stay out here: the chart fills the page.

No board or plan exists before the wizard made one (`DEFAULT_REWARDS_SETTINGS`, `DEFAULT_PLANNER_SETTINGS` are
empty): with nothing made – a first visit – the page is the wizard, with no ✕ and no row of tabs, as there is nothing
behind it. Only where an older version's first board or plan (`erste`, `erster-plan`, made before anything was saved)
already has stars, `rewardsDefaults` / `plannerDefaults` keep it. Where only the other kind is made than the address asks for (a plan
without a Zähler, the Belohnungstafel's book opened), the wizard opens with the other kind's chart behind it, which ✕ shows (`pageStart` in `settings.ts`, user feedback, November 2026): a book is
never just its neighbour's chart.

# Belohnungstafel

Not a game but a tool for grown-ups that a child taps too: a reward chart the parents design freely and that looks
the same on screen and on paper (A4 from the browser, also offline). It stands on the home page's shelf as two books, „Belohnungstafel“ and „Zeitplan“, tied together with a red ribbon right of Aufs Töpfchen among the „Alltagshelfer“, but has no
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
  `ChartEditor.tsx` – the one editor of „＋ Neu“ and „Gestalten“ (above), `SheetAction.tsx` – its ⚙️ / 🗑️ in a corner, `Wizard.tsx` – „＋ Neu“ around it; `Review.tsx` – „📜 Rückblick“ (and
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

From the first visit, above the board: ‹ › to go back to earlier days, weeks or months (about two months, as long as stars are kept) to add a forgotten star; the
label turns yellow while it shows the past, and another board or view starts at today again. Below it the
row of tabs (a board's tab says the template's name until the board has a heading or a child's name). On phones both
rows share one line that scrolls sideways, so the board keeps the screen.

Beside the board (≥ 1000 × 600 px) the gallery of Vorlagen: every template as a small picture of the board with its
example stars, its name, view and one line. A template whose board was made before selects that board (with its
stars); otherwise it opens the wizard on it (above). In the wizard a task gets its times of day, and the footer stays
in sight.

A new board (from a template, the wizard or the default) shows example stars (`Board.examples`, `exampleStars`): the
first two days of a week (Monday and Tuesday, the second short of one), the first four days of a month, all but the
last card of a day, two on a path – pale, with a line under the board saying so and „Ausblenden“. They are never in
the log and never printed; the first real star or „Ausblenden“ ends them. An example field is open: a tap gives the real star.

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

„✏️ Gestalten“ turns the chart itself into the editor (above), in place, on every screen. On a computer (≥ 900 px,
mouse) „🖨️ Drucken“ lies open below the board, reached by scrolling; on phones and tablets it opens as a panel in place
of the board.

## Times of day

A task can have a field per time of day (`BoardTask.slots`: morning, noon, evening; none means once a day), chosen
with `SlotChips` in the wizard and under Gestalten. Brushing teeth comes with morning and evening. The week grid
gives such a task a row per time under one head, the month and day views put its fields side by side; every such
field carries its sun or moon on its edge, filled or not, on screen and on paper. A day is full with every time.

## The star flow

The child taps an open field and its star pops in with a sound – one tap is enough (user decision, November 2026: the
grown-up's hold and the big star to send off are gone). A filled field twinkles, a field of a later day wiggles. On a collecting board any open field fills the next
one. A full day gets a few hearts, stars and notes rising from it, the goal a party (and speech, if Vorlesen is on). „Stern zurück“ shows for
`UNDO_MS` after a star, for a wrong tap.

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
  wizard on „Mein Tag“ with every Zeitraum named in its first option (parents do ask for months: „belohnungskalender“,
  „monthly reward chart“), every view has at least one template, and so has every view of a plan (`rewards.test.ts`
  checks), the gallery lies beside the board where there is room and „🧩 Vorlagen“ is in the first row where there is
  not, and switching a view never loses stars. The view is an option of the editor, never a row of view pictures or a
  switch on top of the page (user feedback, November 2026).
- The wizard and „Gestalten“ are one editor (`ChartEditor`), the chart itself changed in place: a new choice joins
  it on the sheet (a tap on what it changes, opening a window of picture cards) or as an option in the band (`.rw-options-band`),
  never as a step, a page or a second editor of its own (user decision, November 2026). Only what needs typing stays
  under „Weitere Einstellungen“.
- Never put into the band what a tap on the sheet does (user feedback, November 2026): one place for each change, the
  one where its result is seen. A count that the sheet shows (star fields) is never written beside its − ＋ as well.
- Delete and change are drawn icons in a thing's corners (`SheetAction`: a bin and a gear in a white disc, the bin red),
  never an emoji in a ring, which cut through the bin; under the mouse each says its question („„Anziehen“ löschen?“)
  and a 🗑️ marks in red what it would take. A new thing that can be removed or changed on the sheet gets the same pair
  with a `data-edit` of its own in `ChartEditor`, not a button somewhere else.
- `.rw-field` (`rewards.css`) loads after `planner.css` on the dev server: a plan rule that hides or shows a star field
  needs more weight than it (`.pl-star.pl-star-ghost`), and a size in `padding: %` resolves against the card, not the
  action – size with `var(--rw-act)`.
- The options draw the eye, as they lead to the other charts grown-ups come for (user feedback, November 2026, replacing
  „quiet options“): a band of their own, the Zeitraum as big picture buttons (`SpanPic`, the shape of each chart) under
  its visible name, the chosen one yellow; what a choice means goes into its button in a few words with a visual sign,
  never a paragraph of notes under it.
- The first screen says, without scrolling, that the chart prints (the stamp in the wizard's head, never „kostenlos“),
  that it is changed right on the sheet („Direkt auf der Tafel ändern“) and that the kinds can be switched freely (the
  note in the wizard); „✓ Tafel anlegen“ is the biggest button there and stays in sight while the page scrolls.
- Every change in the editor can be undone and redone (↶ ↷, keys); a new kind of change needs nothing more as long as it
  goes through the draft (`onChange`).
- What a sheet shows for one card stays as nice in every view as the Belohnungstafel was before the charts were made
  one: star fields are the board's big rings with its star sticker (`StarFields`, `rw-field`), a counting card is taller
  than wide (`STAR_CARD`), and a counting week whose days have the same cards is the old grid – a row per card, a column
  per day (`WeekStars`, `sameCards`). Look at every Zeitraum with and without a Zähler after changing a sheet.
- No count of stars under the reward (user feedback, November 2026): on paper it is in the way, the fields show them.
- A new class name is checked against the folder first (`grep`): the editor's ↶ ↷ were first called `rw-undo`, the
  class of „Stern zurück“, and stood fixed in the screen's corner.
- **The Zähler** (`PlanStep.stars`, user decision, November 2026): above 0 the plan's cards count stars – a star field
  per star under each card, the child taps the card for the next star, and there may be a reward; only at 0 the paper
  arrow (or the „Jetzt“ field) shows the card to do. A card may have more stars than the others, every day or on one
  weekday only (`withStepStars`, two stars on Monday for brushing), set right on the card with the − ＋ at its stars; in a
  week's grid the row's − ＋, ⚙️, 🗑️ and its picture change the card of every day alike (`withEveryDay`, `data-every`). A plan with a Zähler is a Belohnungstafel: „✓ Tafel
  anlegen“, and the Belohnungstafel's book opens it.
- **One reward** for the whole chart, there by default (`defaultReward`). Its 🗑️ or „Ohne Belohnung“ takes away only
  the reward (`Plan.reward` null) – the stars stay; „＋ Belohnung“ on the sheet brings it back.
- A sheet in the editor stands in a row (`rw-main` round `rw-screen`), like the chart on the page: in a column under a
  box with only a min-height it got no height and shrank to a strip.
- A button that can do nothing is left out, never shown greyed.
- Group what belongs together, and what nobody wants without the other goes on one page: Mein Morgen and Mein Abend
  are one „Mein Tag“ (a plan's `parts`, a board's tasks with their times of day), printed on one page (user feedback,
  October 2026). A view's name says what it shows, never „Tagesansicht“, which reads as „one day only“. What differs
  only in shape is one view with its shape chosen among the options, never views or Vorlagen of their own: the old
  Ablaufplan, Jetzt – Dann and „Mein Kita-Tag“ were one plan told apart only by parts and number of cards, and are now
  the one „Jetzt – Dann“ (user feedback, November 2026).
- Never show a board or plan the grown-up didn't make: no default chart (a Zähne-Woche nobody chose was removed),
  a first visit always starts with the wizard (`rewards.test.ts`, `plan.test.ts` check the empty defaults).
- Boards and plans are one page: never a second page, menu card or wizard for one of them; a new kind of chart joins
  `CHART_TYPES` and the wizard's first step, its views placed in the time spans (`SPANS`).
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

Route `/tagesplan/` (the page above, opened on a plan) · ideas H-03, H-41–H-43 (H-41, H-42 done), T-20 · research
„tagesplan“ in `src/content/research.ts`.

A picture schedule („Strukturtafel“), called „Zeitplan“ beside the Belohnungstafel (`CHART_TYPES`), in four views (`PLAN_VIEWS`) –
three ways of showing the same cards, and the Countdown: **Jetzt – Dann** (view id `"day"`: the day's cards in reading
order, left to right and row by row, a row per part of the day where it has two; all of them stay fixed on one sheet
and a paper arrow cut out of card (`PaperArrow`) points up at the card to do from below it and moves on;
or, as a variant, `nowField`, the card to do stands big on a panel of its own under „Jetzt“, the others smaller under
„Dann“, and done cards go into the Fertig-Kiste), **Erst – Dann** (pairs of two, each a small board of its own, up to four on a
page to cut apart) and the **Woche** (a column per day); the **Countdown** (H-41, „Wie oft noch schlafen?“) is a chart of
its own: one card, the picture of a big day (Geburtstag, Urlaub, Oma und Opa), and a moon for every night until it. Like the Belohnungstafel a tool, not a game: no `GameShell`, `PlaytimeLock` lets it through, and it
shares the board's page and parts (sheet look, themes, `A4`/`Preview`, the gallery's classes, the star log).

## Files

- `plan.ts` – a plan (`Plan`: its `view`, `days` as seven lists Monday first, or `same: true` and only `days[0]`,
  `nowField` for the „Jetzt“ field; a step's `part` is its part of the day, morning or evening; `fromOlder` reads a
  plan saved as the old view „now-next“ as a Jetzt – Dann with the field, `numbers` for numbered cards), pure functions:
  `planFromTemplate`, `templateLists`,
  `stepsOn`, `stepDone` (a tick in the log, or the linked game – brushing only for the step's `slot`), `currentStep`,
  `nowSteps` (the cards to do now: one, or on an Erst–Dann the first open one of every pair), `partsOf`, `pairsOf`,
  `splitDone` (the row and the Fertig-Kiste), `exampleTicks`, `restartDay` (a day, or only some of its steps),
  `nightsUntil`, the Countdown's `bigDayOf`, `bigDayStep`, `moonsLeft` (`Plan.bigDay`, `COUNTDOWN_NIGHTS`, `MAX_NIGHTS`), `withSteps`, `withSame`, `joinLastPart` (a new card joins the last part), `distinctSteps` (the cards
  to print, a card twice where one day has it twice).
- `catalog.ts` – `ACTIVITIES` (the day's parts, beside the board's `TASKS`), `PLAN_VIEWS`, `NOW_WAYS` (marker or
  „Jetzt“ field, each with the note that says what it means to make) and `PLAN_TEMPLATES`: Mein Tag (Jetzt – Dann:
  Morgen and Abend as `parts` on one page), Erst – Dann (four pairs), Wochenplan (own weekdays, with the Kita), Wie oft noch schlafen? (a
  Countdown to a birthday five nights away).
- `PlanSheet.tsx` – the sheet for screen and print, one component per view: `DaySteps` (the rows – `planLayout` picks
  rows and columns for one part, as many in a row as fit unless another row makes the cards clearly bigger, several
  parts get a line each with their ☀️ / 🌙 before it – with the paper arrow under the card to do; with the field
  the „Jetzt“ panel under a 👇, the other rows and on screen the Fertig-Kiste below, `DoneBox`, and on paper `FieldFrames`),
  `FirstThen` (`pairLayout`), `WeekColumns` (moons for the nights until a day), `Countdown` (a field of moons ➜ the
  big day's card; on the day itself only the card, big and golden). No date on the sheet: only a printed
  plan whose weekdays differ names its weekday.
- `PlanScreen.tsx` – the sheet on screen and the tick flow (below); `PlanEditor.tsx` – „✏️ Gestalten“;
  `PlanPrint.tsx` – „🖨️ Drucken“: the cards as photo prints (`PhotoPrint`), then A4 with the cards to cut out
  (`CutCardPages`) – what comes besides the sheet is `printsCards`: a marker's plan nothing, the field's always its
  cards, the other views as chosen; `PlanGallery.tsx` – the templates as small pictures (`PlanThumb`);
  `planSettings.ts` – plans, current one, print options
  (`tinytaps.planner.v1`); the page is `RewardsGame.tsx`; `pageParts.tsx` – `useComputer`, `PanelButton`, `Pick` (a picture card to choose in the editor's windows);
  `planner.css` – classes `pl-`.
- Ticks live in the board's star log (`REWARDS_STARS_KEY`) under the plan's id, keyed `YYYY-MM-DD|stepId` (`cellKey`).

## The tick flow

The child taps the card to do. In Jetzt – Dann with the marker the card stays in its place with a tick and the paper
arrow slides on to the next card, as at home the paper arrow moves along the sheet; with the „Jetzt“ field the card
flies with a sound into the Fertig-Kiste at the bottom edge (H-42), as on a Velcro board at home, and the row gets
shorter until only the last card (the bed) is left. The voice (if on) names what comes next, and the last one starts a
small party. The flight (`PlanScreen`, Web Animations from the card's or the marker's old place, `flyFrom`) only
follows a tap, and is left out with reduced motion. On a
Countdown a tap on a moon or the big card counts the moons, each lighting up with a rising note, then the card wiggles
and the voice (if on) says „Noch 3-mal schlafen, dann Geburtstag“; on the day itself a tap starts a party. Nothing
is ticked: a moon goes by itself each night. In the
week the cards are small and stay in their column with a ✓. A done card (in the box) twinkles, the box itself names
what is in it, a later one wiggles (in the week: „Noch N-mal schlafen“). With a Zähler (above) any open card of today takes a tap: one star per tap pops into its fields until it has
them all, and the reward's party comes when its goal is reached. A key wiggles the „Jetzt“ card but
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
- A Countdown is a chart of its own, never a view the Zeitraum switches into or out of on the page (its one card is
  a day, not a routine). Its date and picture are set by a tap on its card in the editor (`BigDayDialog`: a date, or
  − ＋ nights, and the picture), never in the band; it has no Zähler, no examples and no cards to cut out, and it never
  counts more than `MAX_NIGHTS` moons (a month fits a sheet). On paper the moons are printed from the day of printing,
  to colour in or cross out one each morning (`plan.test.ts`).
- No clock times and no dates on a plan's sheet: order, „Jetzt – Dann“ and moons for the days to come; toddlers read
  no clock (the date in the corner was removed, user feedback, October 2026).
- No words for the child on a plan's sheet (user feedback, November 2026): a card is its picture only (its word is the
  tooltip and what is read out), a part of the day is its ☀️ or 🌙, „Jetzt“ is a 👇, an Erst – Dann pair is card ➜ card.
  Only what grown-ups need stays written: the heading and the week's day names. The cards are square, with little room
  between them, so as many as possible fit a row.
- In Jetzt – Dann every card stays fixed on one sheet in reading order and only a marker moves to show the card to do
  – on screen a paper arrow cut by hand, red card with a strip of tape, as one a family would make (user feedback,
  November 2026), and on paper the room under every card where the real one goes – that is the default, since nothing is cut out and one sheet is the whole plan (user feedback, November 2026). The
  card that moves into a „Jetzt“ field is a variant (`nowField`), and its cost is said plainly wherever it is chosen
  (wizard, Gestalten) and printed: its cards are printed separately, cut out and fixed with Velcro (`NOW_WAYS`'
  `print` and notes, `printsCards`). With the field, „Jetzt“ stands apart: its card big on a lit panel under a 👇 on a
  banner edged in the ink's colour, parted from the smaller cards to come by a line, so it is plain which card matters now (user feedback,
  October 2026). Erst – Dann is a view of a plan, like the week; it holds up to four pairs, a page of them
  (`plan.test.ts`).
- Printed cards are big (at least `MIN_CARD_MM`, 4.5 cm, room for a 20 mm Velcro dot) and the texts suggest Velcro
  (Klett), never small magnets: they are a choking hazard under three (research „belohnungstafel“, „tagesplan“).
- Every print instruction that names something to buy links the user's example on German screens (`shopLinks.tsx`,
  user feedback, November 2026): „Aufkleber“ for the stars → `StickerLink` (reward stickers), „Klettpunkte“ for cards
  → `VelcroLink` (a search for self-adhesive Velcro dots) – in the board's A4 note, the photo guide and the plan's
  note alike, never in one place only (`rewards.test.ts` checks). Links are cut to the product or search, without
  Amazon's tracking parameters.
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
