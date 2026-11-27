# Belohnungstafel & Zeitplan: both on one page

Route `/belohnungstafel/` (and `/tagesplan/`, the same page opened on a plan, and `/wie-lange-warten/`, opened on a
Countdown: `also` in `games.ts`, so each keeps its own search entry) · ideas H-01, H-02, H-76 and area T (`src/content/ideas/t-reward-chart.ts`) · research
„belohnungstafel“ in `src/content/research/`. One card, „📅 Belohnungstafel & Zeitplan“
(both things it makes, a calendar as its sign – user decision, October 2026; the search entries keep „Tagesplan“, as
parents search for it): the **Belohnungstafel**
(boards of stars, first part below) and the **Tagesplan** (plans of picture cards, second part) share one page, one
row of tabs and one wizard.

## One page, one wizard

`RewardsGame.tsx` is the page for both. On top the grown-up's boards and plans side by side in one row (boards first)
and „＋ Neu“; above that row only ‹ › to go back in time – no switch of views there any more: the view (Tag, Woche,
Monat, Countdown, Erst – Dann, Sammeln) is the „Zeitraum“ option of the editor (user feedback, November 2026). The
chart takes the page's whole width: **there are no Vorlagen any more** – no gallery beside the chart and no „🧩
Vorlagen“ button (user request, 26 November 2026); a new chart starts in the wizard, its Zeitraum and the quick choice
of the three kinds (below) leading to every other. The template data stays in `catalog.ts`: `defaultDraft`,
`draftInSpan` and `draftOfKind` build charts from it. „Gestalten“, „Drucken“ (and a board's „Rückblick“) work on the one
shown. Each address opens its own kind: `/belohnungstafel/` a board or a plan with a Zähler (below), `/tagesplan/` a
plan of the day, never a Countdown (so the teeth card's return and a search visitor land there), `/wie-lange-warten/` a
Countdown (H-05, user request, November 2026) – the wizard on its kind where none is made yet (a Countdown: `{ kind:
"countdown" }`), with the other charts behind it. On the shelf the three are **one ring-bound calendar** (user request,
26 November 2026; the shelf's part is documented with `Bookshelf.tsx`): a tap opens `/tagesplan/` with the router state
`OPEN_EDITOR` (`openEditor.ts`, which imports nothing, so the home page's chunk never pulls in this page), and the page
opens straight in the editor – the wizard where nothing is made yet, else „Gestalten“ on the chart shown
(`opensEditor`). The wizard opened so starts on „Mein Tag“ like every first visit, though its Zähler makes the quick
row mark „Belohnungstafel“ – never a Zeitplan without stars instead (user decision, 26 November 2026). Without that state (the teeth card's return, a search visitor, a link) the page opens on the chart as
before. Once a tab or the wizard showed another chart, the address no longer picks (`chosen` in `RewardsGame`). Nothing
remembers which was shown last.

**One editor, on the chart itself** (`ChartEditor.tsx`, user decision, November 2026: „exakt gleiche Seite für
Assistent und Seite … alles gleich aussieht und funktioniert“): „＋ Neu“ (`Wizard.tsx`) and „✏️ Gestalten“ are the same
component, the very sheet that will be used, changed right on it (WYSIWYG). From the top: the **quick choice of the
three kinds**, the edit bar, the Zeitraum with the colours, the band of options, the sheet. The quick choice
(`.rw-chart-kinds`, `CHART_KINDS`, user request, 26 November 2026: the shelf's three books became one calendar, and the
three functions stay reachable inside the editor) is a row of three paper buttons, each a small ink drawing (`KindPic`,
in `SpanPic`'s style) with its name – **Zeitplan** (a plan of the day without stars), **Belohnungstafel** (a chart that
counts stars: a board, or a plan with a Zähler) and **Wie lange warten?** (the Countdown) – named as the shelf named
their books (`names.ts`). The one being edited (`kindOf`) is marked by the book's highlighter on its name
(`aria-pressed`). In the wizard a tap turns the draft into that kind (`draftOfKind`: the day's span without a Zähler,
with one, or the Countdown, keeping name, photo, colours and reward); under „Gestalten“ it shows the chart of that kind
shown last, in the editor too, or opens the wizard on that kind where none is made (`onKind`, `designKind` in
`RewardsGame`). Then, right under the edit bar, the **Zeitraum** comes first (user request, 26 November 2026: first the
Zeitraum, then the Tageszeiten, which belong after it), as the visual first step (`.rw-span-row`, the big picture
buttons, `SpanPic`): on the left (Tag, Woche, Monat, Countdown, Erst – Dann, Sammeln, `SPANS`; on the page only the
views of the chart's own kind, since a plan's Tag and a board's Monat are different charts, and none on a Countdown,
which is a chart of its own), the colours on its right. After it, right above the sheet and only where a chart has
one, the band of options (`.rw-options-band`): „Pfeil wandert“ / „Karte wandert“ (only
without a Zähler) – nothing the sheet already does with a tap (user feedback, November
2026: the Zähler, a 🎁 Belohnung switch, „Tag aufteilen?“ and „Anzahl Karten“ stood there twice and went), and the
**Tageszeiten** – „Ganzer Tag“ (default), „Früh & Abend“ or „Früh, Mittag & Abend“, one, two or three lines (or a
board's fields per day) for the whole chart (`Plan.dayParts`, `withDayParts`; a board's from its tasks' slots,
`withBoardDayParts`) – with, from two parts on, their **Zeichen**: „Ohne“ (default, the lines told apart by their tints),
a drawn sky, the Tagesplan's pictures, sun and moon, a landscape, or cock, plate and bed (`daySigns.tsx`, `Plan.signs`,
`Board.signs`). Parts are never added or taken line by line on the sheet, and a task has no switches of its own for
them (user feedback, November 2026: one layout option instead). On the
sheet (`edit` on `PlanSheet` / `BoardSheet`, never on paper) every card and the reward carry ⚙️ in their top left
corner and 🗑️ in their top right (`SheetAction.tsx`): ⚙️ (or a tap on the card) opens its window, which only swaps it for another card –
its stars are its − ＋, its place is where it was put, 🗑️ takes it at once (↶ brings it back): never a second way in
the window to do what the sheet already does (user feedback, November 2026: „Früher / Später“, „Entfernen“, „Sterne“ and
„Jeden Tag / Nur Freitag“ went); the reward's ⚙️ (or a tap on it) opens the rewards, with no 🗑️: „Ohne
Belohnung“ is the first of them, a reward like any other, with Tapsi in confetti as its picture (below). A new card comes from a small ＋ on a card's edge
(`InsertCard`, `withInserted`): the first card carries two, before and after it, every other card one after it (user
request, 27 November 2026: the two ＋ belong to the first card, never the last), left and right in a line, above and
below in a week's column – under the mouse a blue bar shows where it goes, in that card's part. No empty ＋ card keeps a place:
the cards always take the best layout, and are set out anew when one comes (user feedback, November 2026); only an
empty day, line or column shows a ＋ place. A board of days shows its tasks as a strip of cards over the sheet (`EditTasks`): a
tap swaps one, its 🗑️ takes it (never the last), ＋ adds one in the board's times of day; a collecting board has no
strip, its tasks are its ways (Sammeln, below). The heading of every chart is typed right on the sheet (`SheetTitle`,
its automatic title as the placeholder – so there is no field for the child's name), its sign before it a tap of its
own to change it or take it away (`titleMark`, „Ohne Zeichen“; a pale ＋ keeps its place while the chart is made), and
„Tafel löschen“ / „Plan löschen“ stands at the far end of the edit bar (`ChartEditor onRemove`). What needs typing besides (own words, own emoji, times of day,
„Von vorn“) stays below under „Weitere Einstellungen“ (`Editor`, `PlanEditor`) – and a Countdown has none of it, so it
has no „Weitere Einstellungen“ at all. The edit bar starts with **„✏️ Bearbeiten“ / „🖨️ Druckansicht“**, two
joined paper buttons, the one shown yellow (`ViewSwitch`, user request, 27 November 2026): always there, so a grown-up
sees at any moment what the paper will show – the sheet in colour on an A4 page turned as the print panel turns it by
default (`.rw-print-paper`, `orientationOf`, `planOrientation`), with nothing to tap on it – and goes back with one tap.
Then ↶ Rückgängig and ↷ Wiederholen, then „✏️ Direkt
auf der Tafel ändern“, which says that the sheet is changed as it is seen and printed so (↶ ↷:
`history.ts`, also Ctrl/⌘+Z, Ctrl+Shift+Z, Ctrl+Y outside a box for words; letters typed in a row undo as one word);
the sheet has a dashed edge while it is changed. The stars are set where they are seen: − and ＋ stand at the ends of
the card's row of star fields, no number between them (the fields are the count), and the fields stand in the
card's middle between them – the ghost below has an unseen twin before the first field (`.pl-star-spacer`, user
request, 27 November 2026: a single field stood left of the middle); under the mouse ＋ shows the next
field pale and − pales the last – that field keeps its room unseen all the time (`visibility`, never `display`), so
nothing jumps under the mouse (user feedback, November 2026). A plain plan's card has a small „＋⭐“, which makes it
count (without a reward). A part's sign, where one is chosen, stands big for its whole line (`PartName`). Cards are not
numbered unless „Karten nummerieren“ under „Weitere Einstellungen“ says so (`Plan.numbers`, user feedback, November 2026). The wizard starts on **„Mein Tag“**
(`defaultDraft`): its cards in one line („Ganzer Tag“), no signs, a Zähler of 1 and no reward; a Zeitraum keeps
name, colours and reward (`draftInSpan`; the Woche with a Zähler is the board Vorlage „woche“'s tasks, the same every
day), „✓ Tafel anlegen“ / „✓ Plan anlegen“ makes it. The wizard's head (`.rw-wizard-head`, sticky on top) holds, from
the left, that button big and yellow, „Abbrechen“ and the stamp „🖨️ Zum Ausdrucken – auf A4, als Fotoabzug oder als Fotoposter“ – the
editor's buttons all start on the left (user feedback, November 2026). No note explains the Zeitraum: its picture
buttons say it (the note with an arrow went, user feedback, November 2026). Opened on a kind (`WizardStart`) it
starts on that kind's first chart. While the wizard is open nothing on top or below belongs to the chart behind it.

**A photo of the child** (user request, November 2026) goes on any board or plan, every Zeitraum: while the chart is
made a pale ＋ place with a drawn portrait stands beside the heading's sign (`ChildPhoto`, `data-edit="add-photo"`), and
a tap on it opens the file picker (`accept="image/*"`) – the one way in. Once there the photo is a print with a white
rim, a little askew, held by a strip of tape, still (no animation), greyed with the rest in the grey print; it carries
⚙️ and 🗑️ like a card, and ⚙️ (or a tap on it) opens its window: its place – **oben links** (default), **oben rechts**
or **neben der Überschrift** (`PhotoPlace`, each a small drawn sheet) – and „Anderes Foto wählen“. Nothing else, never a
second way to do what the sheet does. In a corner the photo makes the head as tall as itself (`photoHead`,
`.rw-head-portrait-*`), so the cards are set out below it and never lie under it; beside the heading it is small and
sits in the title's line. The place is data on the chart (`Board.photo`, `Plan.photo`, optional, so old charts need
nothing), so screen, editor and both A4 orientations draw it from the same sheet, and a later export can too. No
bottom corners: the sheets' feet hold the reward, the goal and the Zähler. **The photo never leaves the device**: it is
read with its EXIF orientation, shrunk to `PHOTO_MAX_SIDE` and re-encoded as JPEG in a canvas (which drops EXIF: place,
camera, time), kept in IndexedDB by a random key (`photoStore.ts`, the one file that touches IndexedDB), and shown by an
object URL – never in a URL or address, `localStorage`, a log, `track()` or a picture prompt (`chartPhoto.test.ts`
checks the sources). 🗑️ takes it from the chart (↶ brings it back while the editor is open); `RewardsGame` deletes every
stored photo no saved chart names, but only while neither the wizard nor „Gestalten“ is open, so undo still finds it –
deleting a chart, 🗑️ on the photo or „Abbrechen“ in the wizard deletes the file. A Zeitraum keeps the photo
(`draftInSpan`). The Datenschutzerklärung names it (IndexedDB, `tracking.test.ts`). Its classes are `rw-portrait*`:
`rw-photo*` belongs to the photo prints (`PhotoPrint`).

**An own photo for a task or card** (T-13: the child's own potty, toothbrush or Kita door, which a two-year-old knows
best): the window a card of a plan or a task of a board opens (a tap or its ⚙️) starts its one list of pictures with
„Foto wählen“ (a drawn camera, `CameraSign`), which opens the same file picker as the child's photo, and once there
„Anderes Foto“ and „Ohne Foto“, which brings the picture back (`OwnPhotoPicks`, `withCardPhoto`, `withTaskPhoto`) – tiles
like the others, no heading or note of their own (below). The file
picker knows where a photo goes by `photoFor` in `ChartEditor` (null: the child's). The card keeps its name, stars and
place; only its key is new on it (`PlanStep.photo`, `BoardTask.photo`, a key in the same store, read by the same
`photoStore`). `ItemPic` draws it wherever the picture stood – screen, A4, cut-out cards, poster, Urkunde – as a square
cut of its middle with soft corners (`.rw-item-photo`, grey on a grey print), its place empty while it is read and the
picture or emoji where it is not on this device; the photo prints draw it on their canvas the same way
(`PhotoCard.photo`, `usePhotoUrls` in `PlanPrint`). Swapping the card, „Ohne Foto“ or an emoji typed under „Weitere
Einstellungen“ takes it off, and `photoKeysOf` keeps every task's and card's photo when the store is cleaned – a new
place that can hold a photo key joins it there, or its photo is deleted at the next visit (`chartPhoto.test.ts`). Only
tasks and cards have one: not the reward nor the Countdown's big day (the idea names tasks).

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
the same on screen and on paper (A4 from the browser, also offline). It stands on the home page's shelf among the
„Alltagshelfer“ as one ring-bound calendar for the Zeitplan, „Wie lange warten?“ and the Belohnungstafel, which opens the
editor (above), but has no
`GameShell`: nothing to start or leave, no play time counted, and `PlaytimeLock` lets it through, so the evening
brushing's star still lands after the minutes are over. It may become a website of its own one day (T-19), so the
folder leans on few shared parts (`MenuHead`, `PanelButton`, `SettingControls`, `useStoredSettings`, sfx, tap
targets) – keep it that way.

## Files

- `catalog.ts` – `CHART_TYPES` (Belohnungstafel, Zeitplan) and what grown-ups pick from: tasks (with `linked` for Zähne putzen and Töpfchen, and `slots` for the
  times of day they come with – Zähne putzen: morning and evening), the times of day (`SLOTS`: ☀️ morgens, 🌤️ mittags,
  🌙 abends), rewards (time together first, the ice cream last), marks for a field (with an outline to colour in for
  some), colours, the four views (`KINDS`: Tag, Woche, Monat, Sammeln, each with a line for grown-ups) and the
  templates (each with a `hint`, and `slots` where a task has other times than in the catalogue: „Mein Tag“ dresses in
  the morning, bathes in the evening and brushes at both). Each entry has an
  emoji; its picture comes from `pictures.tsx`.
- `board.ts` – a board and the star log, pure functions: days of a week or month board (a month is four weeks from
  `Board.start` without dates, `fourWeeks`/`fourWeeksOf`/`periodDays`/`boardShift`, or a calendar month with
  `span: "month"`; its look `MonthLook`), a day's fields in the day's order (`dayFields`, `DAY_ORDER`), field keys (`YYYY-MM-DD|task`,
  with a time of day `YYYY-MM-DD|task|evening`, or `count|task` per way on a collecting board – an older board's `count`
  is its first way's; `cellKey`/`parseCellKey`; the ways: `collectWays`, `wayCount`, `addWayStar`, `withWayGoal`, `withWayReward`), the fields
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
- `SheetTitle.tsx` – the heading of a board and a plan alike, typed on the sheet, with its sign (`titleMarkOf`).
- `chartPhoto.ts` – the photo of the child on a chart as data (`ChartPhoto` on `Board.photo` and `Plan.photo`: its
  key, `place`, frame `ratio`), its places (`PHOTO_PLACES`), the size it is shrunk to and its keys, pure functions;
  `photoStore.ts` – the photos themselves in IndexedDB (`tinytaps-photos`), shrunk and re-encoded first
  (`shrinkPhoto`), `keepOnlyPhotos`; `ChildPhoto.tsx` – the photo on the sheet (or its pale ＋ place while the chart
  is made) and `photoHead`, the head's room for it (below).
- `BoardSheet.tsx` – the sheet itself, used for screen and print alike: week grid, a month as calendar, table or
  four week blocks (`MonthCalendar`, `MonthTable`, `MonthBlocks`), day cards or a snaking path
  (`snakeLayout`) to the reward, and the goal below. Sized in container units (`cq*`), so it fits any box.
- `BoardScreen.tsx` – the sheet on screen and the star flow (below).
- `Editor.tsx` – „✏️ Gestalten“ (and `SlotChips`, how often a day a task gets a star); `PrintPanel.tsx` – „🖨️ Drucken“
  with the preview and the print pages; `openEditor.ts` – `OPEN_EDITOR`, the router state of the shelf's calendar;
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
- `bilder/prompts.ts` – every picture of the chart as its Gemini prompt (made on 30 October 2026). A changed or
  new prompt goes into the picture queue (`/bild-erzeugen`); `/management/` shows no prompts to review, only what waits. Card pictures are
  free-standing cut-outs (never „inside a circle“, `rewards.test.ts`), at least 600 px for photo prints; the `-linie`
  twins are drawn from the colour picture flattened onto white.

## The page

From the first visit, above the board: ‹ › to go back to earlier days, weeks or months (about two months, as long as stars are kept) to add a forgotten star; the
label turns yellow while it shows the past, and another board or view starts at today again. Below it the
row of tabs (a board's tab says the template's name until the board has a heading or a child's name). On phones both
rows share one line that scrolls sideways, so the board keeps the screen.

The board takes the page's whole width: no gallery of Vorlagen beside it (taken out, user request, 26 November 2026).

A new board (from the wizard or the default) shows example stars (`Board.examples`, `exampleStars`): the
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

A task can have a field per time of day (`BoardTask.slots`: morning, noon, evening; none means once a day), chosen for
all tasks at once with the band's „Tageszeiten“ (`withBoardDayParts`; a new task gets the board's, `taskInParts`) and
still per task with `SlotChips` under „Weitere Einstellungen“. A catalogue task has no times of its own; the Vorlage
„Zähne-Woche“ brushes morning and evening (`Template.slots`). The week grid
gives such a task a row per time under one head, the month and day views put its fields side by side; every such
field carries the sign of its time on its edge, filled or not, on screen and on paper – the board's chosen set
(`Board.signs`), none by default. A day is full with every time.
A day always runs in its order – the morning's fields first, then the day's (midday or once a day), then the
evening's (`dayFields`, `weekRows`) – each part on its own tint (`--rw-tint-morning`, `-day`, `-evening`, grey on a
black-and-white print) where a sheet has more than one.

## The star flow

The child taps an open field and its star pops in with a sound – one tap is enough (user decision, November 2026: the
grown-up's hold and the big star to send off are gone). A filled field twinkles, a field of a later day wiggles. On a collecting board any open field of a way fills that way's
next one, and its goal brings that way's own reward to the party. A full day gets a few hearts, stars and notes rising from it, the goal a party. „Stern zurück“ shows for
`UNDO_MS` after a star, for a wrong tap.

## Printing

`PrintPages` renders A4 pages (mm-sized, `@page` set per board) into `.rw-print-root` at the end of `<body>`; the print
CSS hides everything else. The print is empty, with „Woche vom ____“ / „Datum ____“ to fill in (a calendar month prints its month, this one or
the next; four weeks print „1. Woche“ to „4. Woche“ without dates); options: orientation
(auto: portrait for a day board with up to two tasks), colour or black and white to colour in (`InkChoice`; no inline colours, so `.rw-grey` wins), fields
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

**Two ways** (T-31, `PrintWayChoice` in `PrintPanel.tsx`, `PrintOptions.way`, `PlanPrintOptions.way`): „🖼️ Alles fest
auf einem Bild“ (nothing to cut: no sticker or card pages, no photo print of cards, a plan without the „Jetzt“ field)
and „✂️ Karten zum Ausschneiden“. A chart's old options pick its way until one is chosen (stickers or cards on: cards).
A plan that can only be one (`printsCards`: a marker's plan fixed, the field's cards) shows no choice.

**Fotoposter** (T-32 to T-40; `poster.ts` the formats and arithmetic, `posterDecor.tsx` the frames, `PosterPrint.tsx`
the panel): the very sheet of screen and A4, laid out with its short side at 210 mm (`layoutSize`) in an offscreen
stage (`.rw-poster-stage`, portalled to `body`) and rasterized by `html-to-image` (imported when needed) into a JPG at
the format's pixels – 20 × 30, 30 × 40 (default), 40 × 60, a panorama 30 × 90 / 40 × 120 for a day in one or two rows,
a square 30 × 30 for a Countdown and a collecting board (`posterFormatsFor`). English names them in inches. It redraws
once the stage has stood still `SETTLE_MS` (the child's photo arrives later from IndexedDB). Round it a frame of the
season by default (`seasonalDecor`) or all year, the heading on a ribbon, the sheet lifted with a shadow; the painted
grounds `poster-<theme>` (made 27 November 2026), a gradient of the theme where one is missing. On 40 × 60 another chart may
join it (T-39, `PosterCompanion`, built in `RewardsGame`): the poster stands upright, the plan above, the board below.
The preview dashes the `POSTER_SAFE_MM` margin, warns where a picture prints under `SHARP_DPI` and names the largest
sharp format (`blurriest`, `largestSharp`), and a drawn child's room shows the poster at true size beside a child of
90 cm (`PosterWall`, the figure by „Junge / Mädchen“). Then „💾 Speichern“ / „📤 Teilen“ and the guide: order matte as
„ganzes Bild“, an acrylic frame and a whiteboard marker or stickers, a clothes peg for a plan.

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
- What is printed and what is on screen come from the same `BoardSheet`; never give print its own layout. The photo
  poster too: it rasterizes that sheet with a decoration round it, never a poster layout of its own – a new poster idea
  is a layer round the sheet (`posterDecor.tsx`) or a size (`POSTER_FORMATS`, checked in `poster.test.ts`).
- No fox, bear or Tapsi as decoration on a poster (T-33 asked for them at the edge): mascots stand only where they do
  something (root `CLAUDE.md`); the poster's room may draw the child as the measure of size (`Mascot.test.ts`).
- A row of choices styled for itself overrides the shared `.choice` as `.choice.rw-…`: its legend floats left
  (`start-screen.css`), and big picture buttons wrapped beside it until `.choice.rw-print-ways` set it on a line of its own.
- html-to-image copies an svg's children without their stylesheet: a collecting board's dotted way (`fill: none` by
  class) came out as a black shape. `inlineSvgStyles` writes their computed styles on for the drawing and takes them
  off again; a new style an svg on the sheet needs from CSS joins `SVG_STYLES`. Look at the poster of every Zeitraum
  after changing a sheet's svg.
- The poster is drawn only after the stage stands still, and a hidden Browser pane throttles its timers: „wird
  gezeichnet“ standing for seconds there is no bug – wait, or look with the pane shown.
- Defaults are the same on every load: no random id in anything `rewardsDefaults` gives, since an unsaved
  default is rebuilt on each load and stars are keyed by board and task id (a random task id once lost the stars).
- The views and the ready-made boards are clear from the first visit, never behind a menu: a first visit opens the
  wizard on „Mein Tag“ with every Zeitraum named in its first option (parents do ask for months: „belohnungskalender“,
  „monthly reward chart“), every view has at least one template for the Zeitraum to start from, and so has every view
  of a plan (`rewards.test.ts` checks), and switching a view never loses stars. The view is an option of the editor,
  never a row of view pictures or a switch on top of the page (user feedback, November 2026). Never bring back a
  gallery of Vorlagen or a „🧩 Vorlagen“ button (user request, 26 November 2026): the Zeitraum and the quick choice of
  the three kinds are the ways to another chart, and the chart keeps the page's width (`rewards.test.ts`).
- The editor's order is fixed (user request, 26 November 2026): the quick choice of the three kinds on top, then the
  edit bar, then the Zeitraum (with the colours), then the band with the Tageszeiten and their Zeichen, then the sheet.
  A new option joins the band, never above the Zeitraum. The quick choice's names are the shelf's names of the three
  (`names.ts`, all seven languages, `rewards.test.ts`).
- The wizard and „Gestalten“ are one editor (`ChartEditor`), the chart itself changed in place: a new choice joins
  it on the sheet (a tap on what it changes, opening a window of picture cards) or as an option in the band (`.rw-options-band`),
  never as a step, a page or a second editor of its own (user decision, November 2026). Only what needs typing stays
  under „Weitere Einstellungen“.
- Never put into the band what a tap on the sheet does (user feedback, November 2026): one place for each change, the
  one where its result is seen. The same goes for „Weitere Einstellungen“: nothing there that the sheet, the band or
  the edit bar already does (the name, the colours, the heading and „löschen“ stood there twice and went, user feedback,
  November 2026); a chart with nothing left to type there shows no „Weitere Einstellungen“. And so for every window a
  tap opens: it offers only what is not on the sheet already (the reward's window lost its goal on a collecting board,
  whose circles have their own − ＋, and its 🗑️; user feedback, November 2026). A count that the sheet shows (star fields) is never written beside its − ＋ as well.
- **A window of pictures to pick is one list** (`PickGrid`, user request, 27 November 2026): every picture in its
  order – the own photo's tiles or „Ohne Belohnung“ first, then the rituals, then the day's pictures – with no headings
  splitting it („Eigenes Foto“, „Rituale …“, „Bilder für den Tag“, „Tauschen gegen“ went) and no note in it (the note on
  the own potty's photo went); a search over their names on top (case and accents ignored, focused at once only with a
  mouse, never popping a phone's keyboard over the pictures), and the window as wide as the screen with big pictures
  (`EditDialog wide`). A new window of pictures uses the same (`rewards.test.ts`).
- Every action on the sheet and in the edit bar says what it does under the mouse (`title`): ⚙️, 🗑️, ＋, − ＋ at the
  stars, the reward's tag, the kinds, the Zeitraum, the view switch, the window's ✕ (user request, 27 November 2026).
- While a chart is made and in the Druckansicht its circles are empty, also on a chart with stars or examples
  (`ticks`/`stars` `undefined` in `ChartEditor`): a star is stuck on or coloured in, never printed (user request, 27
  November 2026); the stars are seen on the chart itself.
- Delete and change are drawn icons in a thing's corners (`SheetAction`: a bin and a gear in a white disc, the bin red),
  never an emoji in a ring, which cut through the bin; under the mouse each says its question („„Anziehen“ löschen?“)
  and a 🗑️ marks in red what it would take. A new thing that can be removed or changed on the sheet gets the same pair
  with a `data-edit` of its own in `ChartEditor`, not a button somewhere else.
- `.rw-field` (`rewards.css`) loads after `planner.css` on the dev server: a plan rule that hides or shows a star field
  needs more weight than it (`.pl-star.pl-star-ghost`), and a size in `padding: %` resolves against the card, not the
  action – size with `var(--rw-act)`.
- The options draw the eye, as they lead to the other charts grown-ups come for (user feedback, November 2026, replacing
  „quiet options“): the Zeitraum as big picture buttons (`SpanPic`, the shape of each chart) beside its visible name,
  the chosen one yellow, the first step under the edit bar, the other options in a band of their own after it; what a choice means goes into its button in a few words with a visual sign,
  never a paragraph of notes under it.
- What sets the charts apart is said where grown-ups decide, not only found deep in an option (user feedback, November
  2026): the black-and-white print, whose every picture has its `-linie` twin drawn to colour in, is named in the
  wizard's print stamp on every screen (`rw-print-badge-ink`), in both search texts (`seo.ts`, `seo.en.ts`) and in the
  print panel as a choice named for what it gives, „🖍️ Schwarz-weiß zum Ausmalen“ beside „🎨 In Farbe“ (`InkChoice`),
  never as a switch „In Farbe“ that only says what is lost when off.
- The first screen says, without scrolling, that the chart prints (the stamp in the wizard's head, never „kostenlos“)
  and that it is changed right on the sheet („Direkt auf der Tafel ändern“); the Zeitraum's picture buttons show the
  kinds without a note; „✓ Tafel anlegen“ is the biggest button there, first on the left, and stays in sight while the
  page scrolls.
- Every change in the editor can be undone and redone (↶ ↷, keys); a new kind of change needs nothing more as long as it
  goes through the draft (`onChange`).
- What a sheet shows for one card stays as nice in every view as the Belohnungstafel was before the charts were made
  one: star fields are the board's big rings with its star sticker (`StarFields`, `rw-field`), a counting card is taller
  than wide (`STAR_CARD`), and a counting week is the old grid – a row per card, a column per day (`WeekStars`,
  `weekRows`), also when single days differ (a day without a row's card leaves its place empty). Look at every
  Zeitraum with and without a Zähler after changing a sheet.
- **The circles are changed where they are, never inside a card or in a window** (user feedback, November 2026): in a
  counting week each day's cell has its own small ＋ and − beside its circles (`withCellStars`; − on the last takes the
  card off that day, a big pale ＋ ring brings it back), and the row's ＋ − for every day stand in a column of their own
  right of the grid, headed „Kreise“, with ▲▼, a ＋ for a row above or below, and the row's time of day where the week has parts (`RowTools`). A tap on a circle while
  the chart is made opens nothing; the card's picture swaps it, its 🗑️ takes the row.
- **The layout is chosen, never changed by what is tapped** (user feedback, November 2026: picking a card turned the
  week into a picture per day): the band's „Darstellung“ chooses it – a week „Eine Karte je Zeile“ (default) or „Bild
  über jedem Kreis“ (`Plan.weekLook`), a month Kalender, Tabelle or Wochen (`Board.look`). A new look goes there too,
  with its small picture (`LookPic`).
- **A month shows its tasks in its fields, not above them** (user feedback, November 2026: tasks over the days and only
  circles per day was unusual): each field carries its task's picture, plainly visible (`.rw-mark.pale` stays bright in
  a month), in the day's order and tints. The tasks are named once – on the sheet's own fields or row heads.
- **A month is four weeks without dates by default** (user feedback, November 2026): „1. Woche“ … „4. Woche“ from this
  week's Monday (`withStart`), on and on in blocks of 28 days; „Monat als: Kalendermonat“ in the band makes it a dated
  month (`span: "month"`). The week's sheet shows no dates either, only the weekdays.
- No count of stars under the reward (user feedback, November 2026): on paper it is in the way, the fields show them.
- A new class name is checked against the folder first (`grep`): the editor's ↶ ↷ were first called `rw-undo`, the
  class of „Stern zurück“, and stood fixed in the screen's corner.
- **The Zähler** (`PlanStep.stars`, user decision, November 2026): above 0 the plan's cards count stars – a star field
  per star under each card, the child taps the card for the next star, and there may be a reward; only at 0 the paper
  arrow (or the „Jetzt“ field) shows the card to do. A card may have more stars than the others, every day or on one
  weekday only (`withStepStars`, two stars on Monday for brushing), set right on the card with the − ＋ at its stars; in a
  week's grid the row's − ＋, ⚙️, 🗑️ and its picture change the card of every day alike (`withEveryDay`, `data-every`). A plan with a Zähler is a Belohnungstafel: „✓ Tafel
  anlegen“, and the Belohnungstafel's book opens it.
- **One reward** for the whole chart (each way on a collecting board), none by default, and none takes room (user
  feedback, November 2026): without one the sheet has no goal line and no footer, only a small „＋ 🎁 Belohnung“ tag in
  the heading while it is made (`AddReward`, `.rw-reward-add`); a collecting way ends in Tapsi in confetti instead.
  „Ohne Belohnung“ is a choice like any reward, the first in the reward's window with that picture, and one is always
  chosen: no 🗑️ on a reward (`RewardActions`). It takes away only the reward (`Plan.reward` null) – the stars stay.
- **Sammeln is one way per task** (user feedback, November 2026): each task starts its own row of circles to its own
  reward (`BoardTask.goal`, `BoardTask.reward`, `collectWays`), up to `MAX_WAYS` on a page, so several fit one sheet
  instead of one huge one. A way starts with its task as a big picture – no small chip with picture and words above it
  – a tap there only swaps it, and its 🗑️ (only with two ways or more) takes the way. Its circles are changed by the − ＋
  between its last circle and its end (`.rw-way-count`, 1 to `MAX_COLLECT`), the end swaps its reward, and „＋ Noch ein
  Weg – für eine andere Aufgabe“ under the ways adds one. Under the mouse the way marks all three (a dashed square round
  picture and reward, „Kreise“ at the − ＋), and the picture or reward under it gets a light veil with ⇄ „Tauschen“
  (`SwapVeil`, picked from four variants, user decision, November 2026) – a tap there only swaps, deleting is its 🗑️,
  whose square turns red. A new thing on the sheet that a tap swaps shows the same veil. A way's circles take the columns that
  give the biggest cells (`snakeLayout`), so a low way stays one row.
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
- A picture loads when it is seen (user request, November 2026): the chips under the
  folded „Weitere Einstellungen“ stand inside `LazyPictures` (`loading="lazy"`; the folded chips alone were 45 files,
  2 MB, on every first visit). A new place showing many pictures out of sight (a list below the screen, something
  folded) does the same; a chart itself and every print never, so a print misses no picture (`loading.test.tsx`).
- On paper a picture never takes more room than the emoji it replaces where words stand beside it (a week row): the
  bigger pictures cut „Zähne putzen“ to „Zähne putze“ in the A4 preview. Look at the print preview after changing sizes.

# Tagesplan

Route `/tagesplan/` (the page above, opened on a plan) · ideas H-03, H-41–H-43 (H-41, H-42 done), T-20 · research
„tagesplan“ in `src/content/research/`.

A picture schedule („Strukturtafel“), called „Zeitplan“ beside the Belohnungstafel (`CHART_TYPES`), in four views (`PLAN_VIEWS`) –
three ways of showing the same cards, and the Countdown: **Jetzt – Dann** (view id `"day"`: the day's cards in reading
order, left to right and row by row, a row per part of the day where it has two; all of them stay fixed on one sheet
and a paper arrow cut out of card (`PaperArrow`) points up at the card to do from below it and moves on;
or, as a variant, `nowField`, the card to do stands big on a panel of its own under „Jetzt“, the others smaller under
„Dann“, and done cards go into the Fertig-Kiste), **Erst – Dann** (pairs of two, each a small board of its own, up to four on a
page to cut apart) and the **Woche** (a column per day); the **Countdown** (H-41, H-05, „Wie oft noch schlafen?“, „Wie lange
warten?“ in the editor's quick choice) is a chart of its own: one card, the picture of a big day (Geburtstag, Urlaub, Oma
und Opa), and a field for every night of the waiting – the fox or bear child asleep in its bed (`NIGHT_LOOKS`, picked
on the sheet, else following „Junge / Mädchen“) with a star field under it like the Belohnungstafel's, which the child
fills in the morning. Like the Belohnungstafel a tool, not a game: no `GameShell`, `PlaytimeLock` lets it through, and it
shares the board's page and parts (sheet look, themes, `A4`/`Preview`, the star log).

## Files

- `plan.ts` – a plan (`Plan`: its `view`, `days` as seven lists Monday first, or `same: true` and only `days[0]`,
  `nowField` for the „Jetzt“ field; a step's `part` is its part of the day, morning or evening; `fromOlder` reads a
  plan saved as the old view „now-next“ as a Jetzt – Dann with the field, `numbers` for numbered cards), pure functions:
  `planFromTemplate`, `templateLists`,
  `stepsOn`, `stepDone` (a tick in the log, or the linked game – brushing only for the step's `slot`), `currentStep`,
  `nowSteps` (the cards to do now: one, or on an Erst–Dann the first open one of every pair), `partsOf`, `pairsOf`,
  `splitDone` (the row and the Fertig-Kiste), `exampleTicks`, `restartDay` (a day, or only some of its steps),
  `nightsUntil`, the Countdown's `bigDayOf`, `bigDayStep`, `moonsLeft`, `nightsOf` (its nights and their state),
  `bigDayCome`, `withBigDay`, `withNightsLeft` (＋ and 🗑️ on the sheet; `Plan.bigDay`, `Plan.since`, `Plan.night`,
  `COUNTDOWN_NIGHTS`, `MAX_NIGHTS`), `withSteps`, `withSame`, `joinLastPart` (a new card joins the last part), `distinctSteps` (the cards
  to print, a card twice where one day has it twice).
- `catalog.ts` – `ACTIVITIES` (the day's parts, beside the board's `TASKS`), `PLAN_VIEWS`, `NOW_WAYS` (marker or
  „Jetzt“ field, each with the note that says what it means to make) and `PLAN_TEMPLATES`: Mein Tag (Jetzt – Dann:
  Morgen and Abend as `parts` on one page), Erst – Dann (four pairs), Wochenplan (own weekdays, with the Kita), Wie oft noch schlafen? (a
  Countdown to a birthday five nights away).
- `PlanSheet.tsx` – the sheet for screen and print, one component per view: `DaySteps` (the rows – `planLayout` picks
  rows and columns for one part, as many in a row as fit unless another row makes the cards clearly bigger, several
  parts get a line each on their tint, with their chosen sign before it – with the paper arrow under the card to do; with the field
  the „Jetzt“ panel under a 👇, the other rows and on screen the Fertig-Kiste below, `DoneBox`, and on paper `FieldFrames`),
  `FirstThen` (`pairLayout`), `WeekColumns` (moons for the nights until a day), `Countdown` (a field of `NightCard`s,
  each the night's picture `NightPic` over one `StarFields` ring, ➜ the big day's card; once the big day has come only the card, big and golden). No date on the sheet: only a printed
  plan whose weekdays differ names its weekday.
- `PlanScreen.tsx` – the sheet on screen and the tick flow (below); `PlanEditor.tsx` – „✏️ Gestalten“;
  `PlanPrint.tsx` – „🖨️ Drucken“: the cards as photo prints (`PhotoPrint`), then A4 with the cards to cut out
  (`CutCardPages`) – what comes besides the sheet is `printsCards`: a marker's plan nothing, the field's always its
  cards, the other views as chosen;
  `planSettings.ts` – plans, current one, print options
  (`tinytaps.planner.v1`); the page is `RewardsGame.tsx`; `pageParts.tsx` – `useComputer`, `PanelButton`, `Pick` (a picture card to choose in the editor's windows);
  `planner.css` – classes `pl-`.
- `rituals.ts` – the rituals (H-58, research „rituale“): catalogue cards like the activities (`STEP_BY_ID` finds them,
  `ritualOf(step)` tells one), each with when it belongs, its words for the grown-up in parts (what they ask, say, or
  the child says after them) and how it goes best; `RitualCard.tsx` – those words as a card: `RitualDialog` on screen,
  `RitualPages` on paper (two by two standing, four in a row lying). The editor offers them first in its one list of
  pictures, with no heading of their own; the template „Mein Tag mit Ritualen“ puts all four on the day.
- Ticks live in the board's star log (`REWARDS_STARS_KEY`) under the plan's id, keyed `YYYY-MM-DD|stepId` (`cellKey`).

## The tick flow

The child taps the card to do. In Jetzt – Dann with the marker the card stays in its place with a tick and the paper
arrow slides on to the next card, as at home the paper arrow moves along the sheet; with the „Jetzt“ field the card
flies with a sound into the Fertig-Kiste at the bottom edge (H-42), as on a Velcro board at home, and the row gets
shorter until only the last card (the bed) is left. The last one starts a
small party. The flight (`PlanScreen`, Web Animations from the card's or the marker's old place, `flyFrom`) only
follows a tap, and is left out with reduced motion. On a
Countdown (H-05) the field of each night slept glows in the morning, a 👇 over the first: the child's tap puts the star
into its ring, with the rooster's crow (`playCrow` from `realSounds`). A tap on any glowing night fills the oldest one waiting (a morning was missed). The tick is the
morning's key with the task id `nacht`, so another picture keeps the stars. A tap on a night still to come or on the
big card counts the nights, each lighting up with a rising note, then the card wiggles; while a night glows on the big
day itself, that night wiggles instead. The last morning's star lands first, then the picture comes big with the party.
„↶ Zurück“ takes a star back like any tick. In the
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
start screen, and leaving (✕, Esc) goes back to the plan. The plan first notes the card (`waitForStep`, per
visit), the brushing's end calls `finishRoutineStep`, and back on the plan `takeFinishedStep` ticks exactly that card –
also a morning routine's teeth brushed after 14:00, which Zähne putzen files as evening. Left early with ✕, the card
stays „Jetzt“. Such a step is part of the day, not play: no game counted, no play time, and `PlaytimeLock` lets it through. Under
Gestalten a grown-up sets the card to „Nur abhaken“ (`PlanStep.noGame`) when the family brushes without the app.
The ritual „Wie geht's dir?“ opens its game the same way (`Ritual.game`, C-33).

A ritual's card (Mutmach-Sätze, Erzählen, Gute-Nacht-Sätze), tapped when it is the one to do, opens its words over the
plan (`RitualDialog`) for the grown-up to read from; „✓ Gemacht“ ticks it like a tap on any other card, ✕, Esc or a tap
beside it close it without a tick. The plan prints every ritual it has as a card after its pages (`ritualsOf`).

## Rules

- A key never ticks a card – only a tap on the card to do does, so a child hammering keys doesn't finish the day.
- A card whose game ticks it opens that game only when it is „Jetzt“ (never a done or later card), and the game always
  comes back to the plan; never tick it by the tap as well. A finished game ticks the card it was opened for, whatever
  its own log says (by the clock a late morning brushing is an evening one), so the child never comes back to a card
  that still glows after brushing.
- Few steps: three to six for two- and three-year-olds, `MAX_STEPS` at most, or `MAX_PART_STEPS` in each part of a day
  in two parts (`stepLimit`); a template and every shape the wizard offers stay within it (`plan.test.ts`).
- A Countdown is a chart of its own, never a view the Zeitraum switches into or out of on the page (its one card is
  a day, not a routine), and has its own name and address („Wie lange warten?“, `/wie-lange-warten/`), reached in the editor by the quick choice of the three kinds. Everything
  of it is changed on the sheet (user feedback, November 2026): ＋ after the nights adds one, 🗑️ on a night still to
  come takes one (`withNightsLeft`), ⚙️ on a night picks the picture of every night (`NightDialog`, `NIGHT_LOOKS`), and a
  tap on the big day's card opens its date and picture (`BigDayDialog`) – never in the band. It has no Zähler, no
  examples and no cards to cut out, and it never counts more than `MAX_NIGHTS` nights (a month fits a sheet). Each night
  is a card of its own, plainly a field, with the Belohnungstafel's star ring under it; on paper only the nights from
  the day of printing, the rings empty for a sticker or a crayon (`plan.test.ts`).
- A Countdown's night gets its star only by the child's tap on its morning (H-05), never by itself: the waiting is
  the child's to count. Each night of the waiting stays on the sheet (from `Plan.since`), so the stars grow as the nights
  to come get fewer; a new big day after the old one is over starts a new waiting, a big day moved keeps the suns (`withBigDay`).
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
- A ritual's words are for the grown-up, never on the child's card: the card is its picture like any other, the words
  open on a tap and are printed on cards of their own. They say what to say, in the family's own voice („Ich hab dich
  lieb, genau so, wie du bist“), never something that promises achievement („Ich bin der Beste“): self-statements a
  child doesn't believe can backfire, so „Ich schaffe das“ always comes with „hilft mir jemand“ (research „rituale“).
  The child is never made to repeat them; the card's `how` says so. Paper cards of words stay taller than wide on both
  orientations: two by two on a page lying cut the good-night card's last lines – look at the print preview after
  adding lines.
- Container units: a `.pl-col` sizes its own gap, padding and border in the sheet's units (`cqmin`), what is inside
  it in its own width (`cqi`) – cqi on the column itself resolves against the sheet and gave huge borders and tiny cards.
- Defaults are the same on every load (the old first plan kept the fixed id `erster-plan`), as for the board.
- Cards always stand in the best layout (user feedback, November 2026, replacing „a card added fills the last row
  first“): `planLayout` counts only the cards, never a ＋ place, so no empty place is kept, and a card added may set
  them out anew (`plan.test.ts`). New cards come from the ＋ on a card's edge (`InsertCard`), a new night from the ＋ at
  the last night's edge.
- A card standing alone in the row (the others in the Fertig-Kiste) keeps a card's shape: a day's slot is never wider
  than tall, or the last card stretched across the whole sheet.

## Languages

Board, plan, wizard, prints and the catalog speak the app language (German, English, Chinese, Hindi, Spanish, Arabic,
Russian; `useAppLanguage()`), translated in October 2026: every text inline as `t({ de, en, zh, hi, es, ar, ru })` or a
`Localized` in `catalog.ts`. New lines are written English first and come with all seven languages
at once (`t({ en: "…", de: "…", … })`; a `Localized` field of `catalog.ts` taking one becomes a `Texts` of
`src/lib/language.ts`; root `CLAUDE.md`, user decision, 22 November 2026), and a changed line of the older German-first
ones is changed in its German and its translations; both are marked in
`src/content/ideas/languageStatus.ts` (`inlineTexts.test.ts` fails on a line missing a language while the row says done).
- What is built from parts has a form per language, never German pieces glued together: weekday names from
  `DAY_NAMES` (catalog.ts), headings with the child's name from `AUTO_TITLES` (board.ts; Russian puts the name first,
  „Лена: мой день“, as a typed name can't be declined), „Noch 3-mal schlafen“ with `Intl.PluralRules` (`SLEEPS_LEFT`).
- What the board and the plan are meant to say to the child (praise, „Schon fertig:“, „Noch 3-mal schlafen, dann …“)
  lives as data in `lines.ts` (`REWARD_LINES`, `SLEEPS_UNTIL`), listed on /management/ (🎙️ Stimmen) to record: nothing
  says it until it is recorded, then the game says it with `recordedVoice`.
- A template's title is stored in the language the board or plan was made in, and shown in the app language as long
  as it is still a template's own title in any language (`isTemplateTitle`); a title a grown-up typed stays as typed.
- Chinese, Hindi and Arabic have no Latin letters (no „A4“ there, „cm“ as 厘米 / सेमी / سم); German shop names and
  links (dm, CEWE, amazon.de) stay on German screens only.
