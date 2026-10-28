# Belohnungstafel

Route `/belohnungstafel/` · ideas H-01, H-02 (partial) and area T (`src/content/ideas/t-reward-chart.ts`) · research
„belohnungstafel“ in `src/content/research.ts`.

Not a game but a tool for grown-ups that a child taps too: a reward chart the parents design freely and that looks
the same on screen and on paper (A4 from the browser, also offline). It is in the „Weitere“ category, but has no
`GameShell`: nothing to start or leave, no play time counted, and `PlaytimeLock` lets it through, so the evening
brushing's star still lands after the minutes are over. It may become a website of its own one day (T-19), so the
folder leans on few shared parts (`MenuHead`, `PanelButton`, `SettingControls`, `useStoredSettings`, sfx, speech, tap
targets) – keep it that way.

## Files

- `catalog.ts` – what grown-ups pick from: tasks (with `linked` for Zähne putzen and Töpfchen), rewards (time
  together first, the ice cream last), marks for a field (with an outline to colour in for some), colours, the four
  views (`KINDS`: Tag, Woche, Monat, Sammeln) and the templates. All emoji for now.
- `board.ts` – a board and the star log, pure functions: days of a week or month board, field keys (`YYYY-MM-DD|task`, or
  `count` on a collecting board), progress, add, take back, start over, `withKind` (the same board in another view: stars stay, the goal fits), `possessive` for the title („Lenas Sterne“).
- `linked.ts` – the days Zähne putzen (`loadWeek`) and Aufs Töpfchen (`loadStars`) were done; such a field is filled
  without a star in the log. Only on day, week and month boards: those games keep two weeks, a collecting board would lose stars.
- `settings.ts` – boards, the current one and the print options (`tinytaps.rewards.v1`); stars live apart
  (`tinytaps.rewards.stars.v1`), so changing a board never loses them. The first board has the fixed id `erste`, so
  its stars stay before anything was saved.
- `BoardSheet.tsx` – the sheet itself, used for screen and print alike: week grid, month calendar, day cards or a snaking path
  (`snakeLayout`) to the reward, and the goal below. Sized in container units (`cq*`), so it fits any box.
- `BoardScreen.tsx` – the sheet on screen and the star flow (below).
- `Editor.tsx` – „✏️ Gestalten“; `PrintPanel.tsx` – „🖨️ Drucken“ with the preview and the print pages;
  `RewardsGame.tsx` – the page (below).
- `bilder/prompts.ts` – every picture the chart may want, as Gemini prompts. No picture is made yet: the user reviews
  them on `/management/` (🎨 Bildvorschläge, `src/components/PicturePromptReview.tsx`) first. Only generate after
  that, with the reviewed text, and then swap the emoji for the pictures.

## The page

From the first visit, above the board: a row of the four views (switching keeps the board and its stars – day, week
and month keep stars per day, so all three show the same ones) and a row of chips with every ready-made board, the
grown-up's own boards and „＋ Eigene Tafel“. A chip makes its board from the template the first time and selects it
after that (`Board.template`). On phones both rows share one line that scrolls sideways, so the board keeps the screen.
On a computer (≥ 900 px, mouse) „✏️ Gestalten“ and „🖨️ Drucken“ lie open below the board, reached by scrolling (the
buttons on top scroll there); on phones and tablets they open as panels in place of the board.

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
- Few tasks: the editor advises one to three and allows `MAX_TASKS`; templates use at most three.
- The child's name stays in localStorage only – never in a URL, a log or a picture prompt.
- What is printed and what is on screen come from the same `BoardSheet`; never give print its own layout.
- Defaults are the same on every load: no random id in anything `DEFAULT_REWARDS_SETTINGS` holds, since an unsaved
  default is rebuilt on each load and stars are keyed by board and task id (a random task id once lost the stars).
- Ready-made boards and views stay visible from the first visit, never behind a menu: every view has at least one
  template (`rewards.test.ts` checks), and switching a view never loses stars.
- Class names built from data get a prefix of their own (`rw-kind-${kind}`), never plain `rw-${id}`: `rw-day` and
  `rw-month` once styled a whole sheet with the rules of a weekday label and the calendar.
- A new catalogue entry needs its picture prompt and line-art twin in `bilder/prompts.ts` (`rewards.test.ts` checks).
