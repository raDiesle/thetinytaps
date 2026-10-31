# The Tiny Taps – notes for Claude

Keyboard and touch games for toddlers (2–3 years). A React 19 single-page app
built and served by Bun, deployed to GitHub Pages, works offline (PWA). No backend.

## Commands (always Bun, never npm, yarn or npx)

```bash
bun run verify     # lint + format check + typecheck + unit tests – run before every commit (never piped into tail or grep before `&& git commit`: the pipe hides a failure and the commit goes in anyway)
bun run format     # format everything and apply safe lint fixes (Biome)
bun test           # unit tests only (bun test, < 1 s); bun test --watch while working
bun run build      # production build into out/ (tools/build.ts) – never `bun build`, that is Bun's bare bundler
bun run image ...  # picture with Gemini, see /bild-erzeugen
bun run song ...   # measure a song from Suno, see /musik-erzeugen
bun run perf ...   # how smoothly the games run on a ten-year-old Android phone, see Language and style
bun run frames     # do the two frames of each moving picture stay the same scene? --scenes: every picture of a story
```

Bun does everything: installs, runs the scripts and tools (`[run] bun = true`, no Node needed), tests, bundles
(`tools/build.ts`) and serves (`tools/dev.ts`, `tools/preview.ts`); no other bundler, no Node.
`bunfig.toml` keeps installs safe and `src/packageSafety.test.ts` checks it stays so: only the public npm
registry, only versions at least 3 days old (`minimumReleaseAge`), no install scripts, no packages fetched on
the fly. Never loosen these; add a package with `bun add --exact <name>` (`-d` for tools), never with `bunx`
or `bun x`, which fetch past the lockfile. Tests import from `bun:test`.
What a bundler adds to the code comes from one Bun plugin (`tools/appPlugin.ts`), used alike by build, dev server
(`bunfig.toml`, `[serve.static]`) and tests (`src/testPreload.ts`): a folder of files is `import files from
"./bilder/*.webp?glob"` (one extension per pattern – Bun can't load `{a,b}` – `**` for subfolders), facts about the
build come from `src/lib/buildInfo.ts` (never `import.meta.env`), and in the build a stylesheet a module imports travels in
that module's chunk (Bun alone would load every game's CSS with the start page; the dev server still does, for hot
reload, so a game borrowing another's CSS shows only in `preview-pages` – `css.test.ts` checks the keyframes). Keep it that way when adding such code.

Dev servers are in `.claude/launch.json`: start them with `preview_start`.
Use `dev` – it moves to the next free port when another session has 3000, so
never add configs with fixed ports. `preview-pages` serves the built site with
the service worker. Sound and speech are muted when the browser
is Claude's preview (`src/lib/silent.ts`).
In a fresh worktree run `bun install` first.

## Working here

- Several Claude sessions work in parallel, each in its own worktree. When a task
  is done: `bun run verify`, commit on the branch, merge into **local** `main` without asking,
  never push (and don't offer to – pushing is the user's move). Each session may run a dev server on its own
  port, so when you hand merged work over, name the URL of the one running from the repo root (local `main`) –
  the user once checked another session's server by mistake.
  Shared files many branches touch (`ScenePlay.tsx`, `src/lib/sfx/`, `src/styles/`,
  `src/content/ideas/`): keep edits there small and local, so merges stay easy.
  Before building something bigger in a game, merge local `main` into your branch and read the game's latest
  commits and `CLAUDE.md`: another session may already be building the same thing (two sweets stories once
  had to be folded into one), and its new rules apply to your work too.
- Commit messages: `<Game or area>: <what changed, in plain words>`, e.g.
  `Lebendige Bilder: the belt loader at the airport has wheels too`.
- Each game documents itself in a `CLAUDE.md` in its folder (loaded when you work
  there). Update that file with the code, not the README – the README only has one
  line per game, so parallel branches don't all conflict on it.
- **Feedback becomes a written rule**, so the next session doesn't make the same mistake. Write it
  generally (what to always/never do, not a note about one bug), in the same commit as the fix, into the
  file that is loaded where it matters: one game → that game's `CLAUDE.md` (its rules section);
  a Bewegungsabenteuer level → [`src/games/adventure/LEVEL-REGELN.md`](src/games/adventure/LEVEL-REGELN.md)
  (German; read it before touching a level and check the work against it); work done with a skill →
  its `.claude/skills/<name>/SKILL.md`; every game or how to work here → this file. When a rule
  already covers it, sharpen that rule instead of adding a second one; when new feedback
  contradicts a rule, replace the old one. Feedback the user gives "only to keep" about how future
  content should be made (stories, pictures) is such a rule too, not an idea in `src/content/ideas/`. The same goes for mistakes you find yourself (a failed
  check, a bug seen in the preview, a wrong assumption) that the next session could make again.
  A check beats a sentence: when a test can catch it, add the test. Claude's private memory is only
  for things that don't belong in the repo. A `UserPromptSubmit` hook (`.claude/hooks/feedback-reminder.md`)
  repeats this reminder with every message.
- Ideas live in `src/content/ideas/` (one file per area) with fixed IDs ("mach N-04"). When an idea is
  built, set `done: true` (or `partial`) there; an idea the user turns down gets `rejected: true` (kept, never deleted).
  An idea round only collects – the user decides later what to implement, so don't offer to implement
  after one (say „umsetzen“, not the ambiguous „bauen“).
- The hidden page `/management/` (hold the „p“ in the home title; `/ideen/` is its old address) is where
  everything goes that helps the user decide: ideas, the language table, and research. Research (searches,
  market or keyword analyses, measurements) is written into `src/content/research.ts` with its date, method,
  findings and the ideas it led to – not only told in chat. `content.test.ts` checks that its ideas and games exist.

## Language and style

- Everything the child or parent sees or hears is **German** (short, simple, present
  tense). Other languages come game by game: the app aims at German, the five most spoken
  languages (English, Chinese, Hindi, Spanish, Arabic), Russian and Italian (`src/content/targetLanguages.ts`).
  Translations and recordings (ElevenLabs voice, Suno songs) are made **only when the user asks** for
  them, since they cost tokens and credits: new features, stories, modes and changed lines come in German
  only, never translated or recorded on your own, also in a game that already speaks other languages.
  Instead keep `src/content/ideas/languageStatus.ts` (shown on `/management/`) true in the same commit: what is
  there and what is missing, per game, as `parts` where a part (a story, a mode, the song) differs, and
  `"text"` where it is translated but not yet recorded. `content.test.ts` checks it where files tell, and
  `inlineTexts.test.ts` checks that every inline `t({ de: … })` of a game has each language its row marks as there
  (so a German-only line in a translated game fails until its row says what is missing).
  **One language for everything, never mixed**: menus, letters and keys, words and voice all follow the app language
  (🌐 on the home page, `useAppLanguage()`); no game or menu adds a language choice of its own (a „Spielsprache“ once
  put Russian letters under German menus). A language joins `APP_LANGUAGES` only once the menus and the letters and
  words games speak it (`language.test.ts` checks the pack); until then packs and recordings in other languages wait
  in the code. No second language next to the first either (a „Zweite Sprache“, „Bär – bear“, was removed), and
  grown-ups choose exactly one language, in one place: 🌐. The app language starts on
  `playLanguage(…)` (`src/lib/locale.ts`): German while developing, for players the browser's language if offered,
  else the first one – never a hard-coded `"de"`. Where a game lacks the language, it plays in English, then German.
  Code, comments, docs and commit messages are English, except
  German names of games, modes and content.
- **The whole app speaks German, English, Chinese, Hindi, Spanish, Arabic and Russian** (🌐 on the home page,
  `APP_LANGUAGES` in `src/lib/language.ts`): grown-ups' screens and what the child hears and sees, translated once on
  request (Russian, then the other five, October 2026). Write every user-facing text so it can be translated: short
  texts inline as `t({ de: "…" })` (`useT()`), adding the other languages only when translations are asked for; larger
  content gets a `<lang>.ts` / `*.<lang>.ts` file next to the German data, keyed by id, and a table by language.
  A visit downloads only its own language: such a file is imported only by `src/content/texts/texts-<lang>.ts` (one chunk
  per language, loaded before the first screen; the service worker keeps only the languages played), and the game's
  table fills from there with `byLanguage(…)` – never import it from game code, or every visitor downloads it
  (`texts.test.ts` checks this). Inline texts stay in the code with all their languages: moving them into the language
  chunks at build time was tried (October 2026) and saved too little for what it cost (the app waiting for its
  language, a reload on every switch, a build step), so don't do it again.
  A text without a translation shows and speaks in German, with the German voice – never German words with another
  language's voice: speak a text with the speech language of the language it is in (`spokenIn`, `voiceFor`), never a
  fixed `de-DE`. When the meaning of a German line changes, delete its translations (they fall back to German) rather
  than leaving wrong ones. For the child: present tense, informal (ты, tú, तुम, 你), and nothing that changes for boy or
  girl – Spanish without adjectives about the child, Hindi with requests or „let's“ instead of gendered verbs, Arabic
  with „let's“ (هيّا ن…) instead of an imperative. Grown-ups: вы, usted, आप, Arabic plural. Names the voice says
  (Tapsi → „Тапси“, „塔普西“, „टैप्सी“, „تابسي“) are written in the language's own script, never in Latin letters inside a
  Russian, Chinese, Hindi or Arabic sentence (the tests check those four for Latin letters). Keys that stand for
  letters take the letter at their place on that language's keyboard: Cyrillic at ЙЦУКЕН (`cyrillicKeys.ts`),
  Devanagari at InScript (`devanagariKeys.ts`, a Shift letter also on its key without Shift), Arabic on the Arabic
  keyboard (`arabicKeys.ts`); Chinese types pinyin on Latin keys. Arabic text runs right to left (`:root[lang="ar"]`
  in `base.css`) while pictures and layout stay as they are. Only the management page and Impressum and Datenschutz (German law) stay German; the pages for search engines are German and English (see Search engines).
- Comments explain *why* and what a thing is for, in plain sentences; every exported
  type, field and function has a short `/** … */`. Match that density.
- Names are English (`ScenePlay`, `useGameSettings`); folder and route names of games
  are German where they are user-facing (`/bilder/`, `/aufzug/`).
- CSS is global and each game's CSS arrives only when the game is opened: prefix
  classes and `@keyframes` by game or scene (`el-`, `bs-`); never style another
  game's classes. A game using another game's parts imports that CSS itself. Keyframes a game borrows
  (`pop-in`, `wiggle`, `bob`, …) live in `src/styles/animations.css`, which every page loads – never use
  keyframes from another game's CSS (`css.test.ts` checks it).
- Drawings are SVG in React components, animated with CSS classes; no image files
  unless an emoji or drawing can't do it (`public/images/`, `bilder/` folders).
  Phones must keep up: what moves across a big picture as a whole (a scrolling world, a camera) is an HTML layer of its
  own (its own svg in a `div` with `will-change: transform`), never a moved group inside one big svg, which the browser
  paints whole again in every frame; and a big still drawing is built once (`useMemo`, `memo`), not again with every
  tick, step or key (Zähne putzen and Kleine Abenteuer both stuttered on phones from this). What moves on every frame
  moves by CSS (`transform`, `opacity` of an HTML layer), never by React drawing it again per frame, and only what the
  child is busy with moves (waiting figures stand still). `bun run perf` measures it: it plays each game in headless
  Chrome as a ten-year-old Android phone (6× slower CPU, 640×360 at 3× pixels) and fails a stretch over the budget
  (`tools/perfScenarios.ts`: p95 frame ≤ 34 ms, ≤ 0.5 frames over 50 ms a second, main thread ≤ 60 % busy). A new game,
  or a new part that moves a lot, gets a scenario there; run it after changing what moves (`bun run perf <name>`,
  `--profile` names the functions that cost, `--shots` shows what was measured). The build ships React's production code
  (`PRODUCTION` in `tools/appPlugin.ts`, checked in `buildTools.test.ts`): without it every game ran several times slower.
  A scheduled task on the user's Mac (`tinytaps-perf-weekly`, Mondays) measures every game, keeps the numbers in
  `tools/perf-history/<date>.json` to compare with the week before, and turns a game over budget or clearly worse into
  an idea „Leistung: <Spiel> …“ in `src/content/ideas/a-all-games.ts` – the user picks it, the run fixes nothing.
- **The app's mascots are the fox and the bear** (Tapsi is a fox, the book's readers are a fox and a bear family; user
  decision, October 2026 – the fox alone was dropped with the address toddlerfox.com): they come back as a motif in
  every game, so a child finds them again everywhere – a fox or bear grown-up instead of a drawn person here and there
  (the baker, the doctor, the driver), a fox or bear child peeking out of the background, the two cheering at the end.
  Not in every corner and not both everywhere: people may stay, and a bear is as welcome as a fox (never turn a bear
  into a fox). Animals that are a game's subject (the farm's cow, the Gefühle animals) stay what they are. Games get them
  step by step from the table „🦊🐻 Fuchs & Bär“ on `/management/` (`src/content/ideas/mascotStatus.ts`, area D): a game
  that gets its fox or bear marks it there in the same commit, and a new game or picture adds its row or task.
  Pictures from Gemini wait there and are made together in one batch when the user asks, since a batch costs less.
- TypeScript is strict with `noUnusedLocals`/`noUnusedParameters`: delete what is no
  longer used instead of leaving it around.
- Formatting is Biome's (`biome.json`, 160 columns): don't format by hand, run
  `bun run format`. Lint rules that don't fit SVG drawings (index keys, `role` on `<g>`)
  are off; fix what the rest reports instead of ignoring it.

## Rules for every game (toddlers play alone)

- One tap or key = one immediate, visible and audible reaction. Every key does something.
- No wrong answers, no error sounds, nothing to read: pictures, sounds and voice.
- A game that gets harder does so in what the child has to see, remember or tell apart (more things, more alike,
  some hidden like memory cards) – never by asking it to be quicker: no faster pace, nothing that speeds up, no clock.
  Time may only hint how easy a round was (Socken-Paare skips a step when it was quick), never be a hurdle.
- What the child taps to set things off is plainly marked (a glow, and a still hand pointing at it before the first tap)
  and lies wholly in the picture, clear of the edges and the ✕. Where the picture moves away from it, a big button
  brings it back.
- Where the child picks one of several (Zuordnen, Schatten, a quiz), exactly one choice fits: never offer a wrong
  choice a child could rightly pick (no lettuce or apple next to the rabbit's carrot – a rabbit eats those too).
- Silent and still until the child acts: no sound without a tap/hover/key, no idle
  animation unless the parent turns it on (`document.getAnimations()` is empty after load). In a game that plays
  at once (`startMode`), the tap on its card is that act: it may start moving and sounding right away.
- Sounds and voice have no switch (user decision, October 2026): sounds always play, and the browser's voice speaks
  nothing of its own (`FIXED` in `src/lib/common.ts`) – it sounds too poor for a child. What a game says comes as a high-quality
  ElevenLabs recording (like Tapsi's lines in Bewegungsabenteuer), which always plays, like a sound; a line without
  one stays silent – except in a game whose story is told by the voice and can't be followed without it (Kleine
  Abenteuer, Bewegungsabenteuer): there the browser's voice (Google's) says a line until its recording is made
  (`recordedVoice(files, { browser: true })`, user decision, October 2026). Give a game that fallback only where it
  really helps, never for a game that plays fine silent. Never add a switch for either again. Recordings are made only when the user asks (see Language).
  What still waits for its recording is listed on `/management/` (🎙️ Stimmen), read from the games' own data by
  `src/content/voiceLines.ts`: a game that says something new adds where it comes from there, never a call of the
  browser's voice (`voiceLines.test.ts` fails on a `speak()` that the always-off read aloud option doesn't guard, and on
  a game with the fallback that is not on its list).
  A game gets its recordings by listing its lines in every language in `src/content/recordedLines.ts` (`bun run voice
  make --only <name>` records what is missing into its `stimme/`, `--dry` first) and playing them with
  `recordedVoice(files)` from `src/lib/voice.ts` (a `./stimme/**/*.mp3?glob` import), as Zähne putzen, Kleine
  Abenteuer and the good-night sentence do; the management list then leaves its recorded lines out. Music hushes
  while a recording plays (`talking()`). The dev server keeps the file list of a `?glob` from its start: after
  recording (or adding any files to a globbed folder) restart it before checking, or the new files seem missing.
  The home page's options for all games are „🎵 Musik“, one tap on its own button, never a menu, and „Junge / Mädchen“.
- **A figure that stands for the child follows „Junge / Mädchen“** (👦 / 👧 on the home page, a menu so a child's tap
  can't switch it; `useFigure()` from `src/lib/common.ts`, boy by default): the child of Kleine Abenteuer (`useHero()`),
  the face in Zähne putzen's mirror and story. The girl differs only in hair (pigtails, lashes where only the eyes show)
  and clothes' colours, never in size or poses. Animals (Tapsi, the Gefühle animals), the people in the pictures and the
  Bewegungsabenteuer's dark dancer (no hair, it stands for anyone) stay as they are; no game adds a choice of its own for
  it. A new drawing of the child goes on `CHILD_DRAWINGS` in `src/figure.test.ts`, which also checks that nothing calls
  the child a „braver Junge“ or the like. With „Mädchen“ the menus get the girl's colours (`:root[data-figure="girl"]` in
  `base.css`: a lilac sky going pink): a new shared colour of the menus gets its girl's value there too.
- The picture is as big as the screen allows, on a phone on its side (844×390) and a tablet (1024×768)
  as well as a computer: let it fill the screen behind headings and controls and zoom what matters into
  the room left between them, instead of a fixed box with empty space round it. Look at both sizes in the preview.
- Tap areas are bigger than they look: everything a child can tap carries `data-tap`, and a tap up to
  30 px next to it still counts (`src/lib/tapTargets.ts`, installed by `GameShell`). Where grown areas
  overlap, the right answer wins (`data-tap="goal"`), then one not tapped yet (not `"done"`), then the
  nearest – use `tapState({ goal, done })`. Targets react on `onPointerDown` (only that is sent on);
  overlays inside a game get `data-tap-root`, drawing/dragging surfaces `data-tap-keep`.
- The fullscreen button is always there to get back into fullscreen, which a phone leaves whenever another app was
  opened in between: in every menu in the top right (`MenuHead`, the last of the home page's buttons) and next to ✕ while playing. Grown-ups on a
  computer (≥ 900 px wide with a mouse) see it always, also to leave fullscreen; on phones and tablets a game shows it
  only while out of fullscreen, so a child's tap can't end it. Starting or leaving a game in fullscreen must not make the browser
  show its „how to leave fullscreen“ note again: no new fullscreen request when already in it, and the keyboard lock
  (which re-shows the note on lock and unlock) only on computers (`enterKidMode`, `fullscreen.test.ts`). ✕ and the fullscreen button
  lie over every game's picture, also dark ones (night, space): they are pale see-through discs with a thin dark edge and
  a dark sign (`playing.css`), never only a dark see-through sign; a game never restyles them (in the book look the ✕
  is the page's corner, see below). The way back from a menu is a big yellow
  round arrow without words (its target only as tooltip and read out, `MenuTop`), right next to the title on its left, close to the
  cards – never far off in the screen's corner, where grown-ups on a big monitor didn't find it (biggest on a computer). A
  menu's title goes into `MenuHead`, which puts the way back beside it and the fullscreen button on the right. In the
  book look the way back is instead the corner of the page before, standing up at the spine in the page's top left
  (`PageCorner`, user feedback, October 2026), and a tap turns that very page back over to the right: what is touched must
  be what moves, like a real book – a corner in the top right turned the other page, and grown-ups didn't look there for
  the way back. The round arrow is hidden there (`MenuTop.test.ts`), the sun or a room's window step aside, and nothing
  else goes into that corner. Every way back in the book look is that corner: while playing, the ✕ held to leave is the
  same corner at the top left with a ✕ on it (`PageCornerArt`), held just like the ✕ – it lifts further while held
  instead of a ring filling – with the fullscreen button and „Zurück zum Menü · halten“ right of it, clear of the room it
  lifts into; a game's ⚙️ (`PlayOptions`) moves to the top right for it.
- No menu level more than needed: a home category with one game opens that game directly (`categoryHref`, checked
  in `content.test.ts`); a category of a few games that stand apart (`onHome`: „Weitere“) has no card and no page of its
  own, its games stand right on the home page on a frame named after it, like a game's sorts below; and variants of one way to play (which words, how long, whole word or first letter) are
  choices in the always visible row above the cards (`level`), not cards or a menu of their own – or, in a game that
  plays at once, options while playing behind ⚙️ held in the top left corner like ✕ (`PlayOptions`, Buchstaben & Zahlen),
  never a tap a child could make by chance.
  Where a game's cards come in sorts (`GameMode.kind`: lift stories, walks), the sort is named once above its group of
  cards on a shared frame (`GameShell`, `packGroups` in `useFitGrid`), never as a tag on every card.
- Nothing to read between a menu's title and its cards, on any screen: no line under the title, no „Was spielen
  wir?“, no tagline under the home logo (all removed, October 2026) – the cards say enough. Only the „level“ row of
  choices may sit there.
- Menus show as many cards as possible without scrolling, on phones too (shorter side < 600 px – the same limit
  in `useFitGrid` and in the styles' `(max-width: 599.98px), (max-height: 599.98px)`): there a menu shows no title
  either (only read out; the home logo stays), and the
  cards get smaller and flat (emoji beside the title; too narrow for that, emoji above a small title without ▶). The sun sits in the top
  left corner (in the book look, where the families take its place, they do); buttons for grown-ups never cover it (the
  home page's sit on the right, a phone's way back in the middle). „Über das Spiel“
  and „Einstellungen“ (where a game still has them) are small round signs without words (a plain „i“, ⚙️; the name as
  tooltip and read out) right next to the way back, so they take no row of their own; a panel opens right under the top row. When a menu fits on one screen, the free room goes around its cards (or „Los geht’s!“, `data-spread`) –
  never everything bunched in the middle; `useFitGrid` leaves that room out when it sizes the cards. What only grown-ups need below the cards (version,
  install hint) waits below the first screen (`data-below-fold`), never fixed over it. On a phone the home
  page's option menus cover the whole screen, with name and ✕ on top and a „Weiter unten gibt es mehr“ bar
  while there is more to scroll to. Buttons and cards in a menu never touch or overlap, also not with a tilted card's
  corner or a button's shadow: keep clear room between the menu's head (its rows of buttons) and the cards
  (`.home > .menu-head` margin in `menus.css`) and between buttons in a row.
  Check menus at 844×390 and 390×844 as well as tablet and computer.
- Works with touch and keyboard. `src/lib/device.ts` hides keyboard hints on touch
  devices and on-screen keys on computers.
- Leaving needs a grown-up: hold Esc or the ✕ (`GameShell`). The only other way out is „Menü“ at the end
  of a level. Never add another. Starting a game shows no note on how to leave (that goes into `info`): the
  „Zurück zum Menü“ next to ✕ appears only while it is held or a mouse is over it.
- Play time (`src/lib/playtime.ts`, ⏳ on the home page) limits minutes or games per day for all games. When it is over the game
  says good night, and `PlaytimeLock` (mounted in `index.tsx`) covers every menu, so a child stays there until a grown-up
  holds ⏳ for three seconds. Anything a child could tap never gives more time or resets it: that lives only behind the lock
  or in the grown-ups' menus. A new way to start a game calls `countGame()` (GameShell and GameEnd do).
- Every end of a level or story shows the shared `GameEnd` (`src/components/GameEnd.tsx`): big „Menü“ (back to the
  current game's own start screen before play, `useLeaveGame()` – never the home page; its picture is four cards,
  `MenuIcon`, never a house), „Nochmal“ and „Weiter“ (the next level in the game's order, after the last
  the first, so there is always one). So a start screen has no „all in turn“ card (`GameMode` has no such kind):
  the picked level plays first and „Weiter“ goes on from there. A game with only one level or story leaves „Weiter“ out (`next` is optional):
  two buttons doing the same thing confuse. A game that flows on from round to round by itself (Socken-Paare: the next
  wash comes on its own) has no end to show it at; it counts each round as a game itself (`gameEnded`, `countGame`). A game with its own end buttons (Gefühle, Zähne putzen) still offers all three
  it has a use for, just as big. Where the end picture is the point (Aufs Töpfchen's party), `corners` puts them small
  in the bottom corners instead – „Menü“ left, the others right – and only where that game's rules say so.

## Architecture

```
src/App.tsx              routes; every game page is lazy-loaded (its own JS and CSS chunk)
src/pages/<X>Page.tsx    thin wrapper: useTitle + <XGame/>
src/games/<game>/        one folder per game, see its CLAUDE.md
  <X>Game.tsx            start screen: <GameShell> with modes, level, info, settings
  <X>Play.tsx            the game itself, mounted only while playing
  settings.ts            settings type, defaults, storage key "tinytaps.<game>.v1"
  content.ts             German texts and pictures
  <game>.css             styles and animations, classes prefixed by the game
src/components/          shared UI: GameShell, GameEnd (Nochmal/Weiter), SettingControls, …
src/content/             home menu (games.ts), language packs (de/en/tr/pl), ideas
src/lib/                 speech, sfx (synthesized + recorded sounds), storage, device, PWA
```

- Start screen: a game opened in the moment (Aufs Töpfchen: the child has to go now), or one with nothing to choose
  before playing (Socken-Paare finds its difficulty itself), skips it with `startMode` and plays at once; the start screen comes only after ✕ or „Menü“. A game whose menu is
  the page before it (a picture of Lebendige Bilder, its mode chosen in the row on `/bilder/`) has no start screen at all:
  `leaveTo` sends ✕, Esc and „Menü“ back to that page. A game a routine opens for one of its steps (the Tagesplan's
  🪥 card, `{ returnTo }` in the router state, `src/lib/routine.ts`) plays at once too, outside play time, and ✕ or
  „Menü“ go back to the routine.
  **Aim for no settings and no description**, so start screens stay clear: a game should explain itself by playing
  (a glow, the pointing hand, a reaction to every tap), and what a switch would choose is decided once, the way that
  plays best, instead of being left to grown-ups. `info` („ℹ️ Über das Spiel“) and `settings` („⚙️ Einstellungen“)
  are optional in `GameShell`, and their buttons show only when a game passes them; Kettenreaktion has neither. Never add one
  to a game that has none, and when touching a game that still has them, prefer removing them (keep the default
  behaviour, delete the code for the other). Where one is still kept, `info` says what the game is and how it is played (also
  keys and tips for grown-ups), `settings` holds only options and the notes that explain them. A game adds no own switch for what the home page already sets for all games
  (Musik, Sprache), nor a switch for sounds or voice, nor a choice for what the game can tell by itself (morning or evening by the clock).
  A song that is the game itself (the Zahnputzlied sings the steps) plays even with Musik off and sings in the app language.
- Settings: `useGameSettings(KEY, DEFAULTS)` – saved in localStorage, merged into the
  defaults (so new fields need no migration); `speech`/`sounds` are filled in from the
  shared options (always off and on). Bump the key's `.vN` only when old values would break.
- Sounds: `src/lib/sfx/` synthesizes everything (Web Audio), one file per topic (animals, vehicles, music, home; helpers in `core.ts`), all imported from `@/lib/sfx`; `playRecorded(name, fallback)`
  plays `src/lib/sounds/<name>.mp3` when there is one (CC0, source in its README). A new file replaces the sound at every
  `playRecorded(name, …)` in every game, so grep the name first and pick a new one unless all of them should change.
- Music: one background song plays behind the menus and every game from the first tap or key of the visit
  (`src/components/BackgroundMusic.tsx`, mounted once in `index.tsx`, so it runs on without a break from the
  menus into a game and back; `src/lib/backgroundMusic.ts`), on by default, "🎵 Musik" on the home page turns it off
  for all games and then no song is downloaded. A game with its own music (or a microphone)
  calls `useNoBackgroundMusic()` while it needs quiet, and the song goes on where it stopped afterwards;
  song files are named `musik-*.mp3`, see `/musik-erzeugen`. A game that runs along its own song (its steps follow it)
  starts loading it on its start screen and waits for it before the part that follows the song, showing how far it is
  when it is late – never switch a song in or decode it mid-play, that makes the picture stutter on phones. The shared options (`useCommonSettings`) are one
  store for the app, so a switch reaches everything already playing.
- Phones and tablets are played sideways: `ScreenHint` (mounted in `index.tsx`) covers menus and games with
  "Bitte quer halten" while the device stands upright (its „Trotzdem hochkant“ lets a grown-up play upright for
  the rest of the visit), and asks once per visit for fullscreen, which on Android
  also locks landscape (`src/lib/fullscreen.ts`). Computers see neither.
- Updates: an installed app looks for a new version every hour and when it comes back, and restarts with it
  only between games, while it is in the background on a menu: menu pages call `useUpdateBetweenGames()`
  (`src/lib/pwa.ts`) – a new menu page does too, a game never. Never restart or reload on a tap: restarting when a
  menu card was tapped made the next menu take seconds to show.
- A tap in a menu shows the next screen at once: the home page and the category pages load the lazy pages behind their
  cards while they wait (`usePreloadPages`, `src/lib/preloadPages.ts`, each lazy page registers its addresses in
  `App.tsx` – checked in `preloadPages.test.ts`), and a card starts loading its page as the finger lands. A new menu
  whose cards open lazy pages does the same.
- **The app looks like a picture book a grown-up and a child read together** (A-20, area D on `/management/`; `?buch=aus`
  brings back the old toy-block look, `src/lib/look.ts`): a cover to open on the first visit to the home page
  (`BookCover`, shown once per visit – `sessionStorage` – and only on the home page), the home page as the
  contents page with page numbers, paper and softened colours, and the game's picture inside the page's paper margin
  (`.book-frame`). All of it is CSS under `:root[data-look="book"]` in `src/styles/book.css`; games don't style for it.
  It should look real, not flat (user feedback, October 2026): the closed book lies on a wooden table seen at a slant,
  drawn in 3D with its boards, page edges and shadow, and its cover swings open slowly before the book comes close; the
  open page lies on the book's cloth-covered board, lit from above. The cover's picture (`bilder/buch-cover.webp`) shows
  one family of each mascot: a fox parent with a fox child and a bear parent with a bear child, one of the children a
  boy and one a girl – never a third grown-up or a child too many (user feedback, October 2026).
  Every change of page turns a page: a new menu link uses `useTurnPage(to, direction)`, a game starting or ending (or
  any other change of screen) goes through `turnPageWith(direction, update)` – forward into a menu or game, back out of
  one. A page takes its time to turn, as a grown-up turns it for a child (`TURN_SECONDS`, at least 1.5 s, its sound landing
  with it – `look.test.ts`): its corner lifts first, the page bends and catches the light, then darkens as it turns away,
  and its shadow slides across the page beneath with its edge; never a quick flick, never a stiff board. A lifted page
  must not swell past the screen (keep the eye far: `perspective(320vw)`), and its keyframes run `linear` – an easing
  restarts at every keyframe, so the page would stop and start.
  Where the page has no room for the families beside the cards (below 1400 × 640), they sit in the menu's top row
  instead of the sun and clouds (`BookFamily`, in `MenuHead` and the home page's `.home-top`), shrinking into the room
  left and hiding where too little is: never pushing or covering a button. On a phone the home page's title moves up into
  that row, top left, and its buttons for grown-ups become round signs without words (name as tooltip, read out, on top
  of the menu they open), so the cards keep the room. A new kind of button gets its paper look in `book.css` with the others, never shiny plastic; the fullscreen
  button and ⚙️ stay pale see-through discs there too, the ✕ is the page's corner. Pictures of the fox and the bear family reading with their
  children beside the menu's cards (`BookFamily`) show that the book is read together: they only go where there is room, never over a
  card or button. Nothing idles: the sky's clouds and rays stand still in the book.
- Each home category has a world of its own (`src/components/Worlds.tsx`): its page and its games' start screens show
  it behind the cards (`Sky` finds it from the address), its cards come in its family of colours (`data-world`), and its
  home card shows a piece of it under the collage of its games. A new category draws its world (`content.test.ts` checks).
  Every card has a `blurb`: one short line for grown-ups, shown only on tablets and computers with room for it.
- A new game needs: folder, page, route in `App.tsx`, entry in `CATEGORIES`
  (`src/content/games.ts`, with its `blurb`), a row in `src/content/ideas/languageStatus.ts`, an entry in `src/content/seo.ts` and its English in `seo.en.ts` – use `/neues-spiel`.
- The app lives at booksforboth.com (bought October 2026; toddlerfox.com and funforboth.com only redirect there). Its name
  and addresses never say „toddler“ or „baby“ (user decision, October 2026: offering screen games expressly for small
  children is delicate) – the age may stand in page texts, where parents search for it, never in a name.
- Search engines: every game, category and scene has a title, description and text in `src/content/seo.ts`
  and in English in `seo.en.ts` (the English pages are part of being found, A-22, so a new entry gets its English
  line in the same commit, unlike other translations; `content.test.ts` checks both). The build writes an own
  `index.html` per entry and language – German at `/zaehne/`, English at `/en/zaehne/`, joined by hreflang (GitHub
  Pages would answer with 404.html and status 404, which Google skips), plus `sitemap.xml`; the app keeps title
  and head in step (`useTitle`, `SeoHead`). Under `/en/` the router runs below the prefix (`routerBase()`,
  `src/lib/pageAddress.ts`), so links stay in English pages and routes need no change; players still get their
  browser's language. Texts say only what the page really does. Google reads the page after the app ran, in an
  English browser: so search engines play in the language of the address (`isCrawler` in `src/lib/locale.ts`) –
  a crawler that runs pages and isn't on its list gets added there. The app replaces the built page's text when
  it starts, so every menu ends its `<main>` with `<SeoText />`, which shows that text below the first screen on a
  panel of its own; a new menu page does the same. Pages that must stay out of results get a
  `noindex` tag (`NO_INDEX_PATHS`), never a `Disallow` in robots.txt, which hides the tag from Google. No
  `<meta name="keywords">` (ignored by Google, a spam hint for Bing): the searched words go into title, description and text. Heavy downloads (service worker copy,
  songs) start only after the page has loaded (`afterLoad` in `src/lib/pwa.ts`).
- Visits are counted only by Cloudflare Web Analytics (no cookies, no consent banner; the build adds it with the
  repository variable `CF_BEACON_TOKEN`, `tools/build.ts`): never add Google Analytics or another tracker that sets
  cookies or needs consent (user decision, October 2026; `tracking.test.ts` checks).
- Impressum and Datenschutz (`/impressum/`, `/datenschutz/`, `src/pages/LegalPage.tsx`, linked next to the version
  below the home page's first screen; who runs the site in `src/content/legal.ts`) stay true: a change that sends,
  stores or reads something new (a service, a tracker, camera, microphone, location) updates the Datenschutzerklärung
  and its `PRIVACY_UPDATED` in the same commit (`tracking.test.ts` checks the main ones). Both stay out of search results.
- A new Lebendige-Bilder picture: `/neue-szene`. A new Kleine-Abenteuer level: `/neues-abenteuer`. A generated picture: `/bild-erzeugen`. Music from Suno: `/musik-erzeugen`; the Zähneputzen-Lied in a new language: `/zahnputzlied`.

## Checking your work

1. `bun run verify`. The tests (`*.test.ts` next to the code) check data that is easy to
   get wrong by hand: scene items (ids, tap sizes, chains, keys, plural grammar), roads,
   the home menu against the routes and kid tiles, ideas, language packs, the movement
   library, the Gefühle pictures, unique `@keyframes` names.
   When you add data with rules like these, add a check.
2. Look at it in the browser preview: the change itself, the console, and the rules above.
   Sound is muted there, so "I hear no music" can't be checked by ear: wrap
   `AudioBufferSourceNode.prototype.start` in the console and log `this.buffer.duration` and the offset
   (the length tells which song started, and when). Say that you checked it this way, not by ear.
   Development helpers: `__machine.seek(s)` (Kettenreaktion), `__adventure.seek(s)`
   (Bewegungsabenteuer), `?level=<id>` on `/kettenreaktion/` (the card tapped starts that level), `?level=<n>` on `/socken/`.
