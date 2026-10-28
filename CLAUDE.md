# The Tiny Taps – notes for Claude

Keyboard and touch games for toddlers (2–3 years). A React 19 single-page app
built and served by Bun, deployed to GitHub Pages, works offline (PWA). No backend.

## Commands (always Bun, never npm, yarn or npx)

```bash
bun run verify     # lint + format check + typecheck + unit tests – run before every commit
bun run format     # format everything and apply safe lint fixes (Biome)
bun test           # unit tests only (bun test, < 1 s); bun test --watch while working
bun run build      # production build into out/ (tools/build.ts) – never `bun build`, that is Bun's bare bundler
bun run image ...  # picture with Gemini, see /bild-erzeugen
bun run song ...   # measure a song from Suno, see /musik-erzeugen
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
  `"text"` where it is translated but not yet recorded. `content.test.ts` checks it where files tell.
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
- **The whole app also speaks Russian** (🌐 on the home page, `src/lib/language.ts`): grown-ups' screens and what
  the child hears and sees, translated once on request (October 2026). Write every user-facing text so it can
  be translated: short texts inline as `t({ de: "…" })` (`useT()`), adding `ru: "…"` only when translations
  are asked for; larger content gets a `*.ru.ts` / `ru.ts` file next to the German data, keyed by id. A text
  without Russian shows and speaks in German, with the German voice – never German words with a Russian voice:
  speak a text with the speech language of the language it is in (`useAppLanguage().speechLang`), never a fixed
  `de-DE`. When the meaning of a German line changes, delete its Russian line (it falls back to German) rather
  than leaving a wrong one. Russian for the child: present tense, "ты", nothing that changes for boy or girl.
  Keys that stand for letters take the Cyrillic letter at their ЙЦУКЕН place (`src/lib/cyrillicKeys.ts`).
  The app language starts on `playLanguage(APP_LANGUAGES)` like every language choice. Only the management
  page and the SEO pages stay German.
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
- TypeScript is strict with `noUnusedLocals`/`noUnusedParameters`: delete what is no
  longer used instead of leaving it around.
- Formatting is Biome's (`biome.json`, 160 columns): don't format by hand, run
  `bun run format`. Lint rules that don't fit SVG drawings (index keys, `role` on `<g>`)
  are off; fix what the rest reports instead of ignoring it.

## Rules for every game (toddlers play alone)

- One tap or key = one immediate, visible and audible reaction. Every key does something.
- No wrong answers, no error sounds, nothing to read: pictures, sounds and voice.
- Where the child picks one of several (Zuordnen, Schatten, a quiz), exactly one choice fits: never offer a wrong
  choice a child could rightly pick (no lettuce or apple next to the rabbit's carrot – a rabbit eats those too).
- Silent and still until the child acts: no sound without a tap/hover/key, no idle
  animation unless the parent turns it on (`document.getAnimations()` is empty after load).
- Speech is off by default (`src/lib/common.ts`); sounds are on.
- The picture is as big as the screen allows, on a phone on its side (844×390) and a tablet (1024×768)
  as well as a computer: let it fill the screen behind headings and controls and zoom what matters into
  the room left between them, instead of a fixed box with empty space round it. Look at both sizes in the preview.
- Tap areas are bigger than they look: everything a child can tap carries `data-tap`, and a tap up to
  30 px next to it still counts (`src/lib/tapTargets.ts`, installed by `GameShell`). Where grown areas
  overlap, the right answer wins (`data-tap="goal"`), then one not tapped yet (not `"done"`), then the
  nearest – use `tapState({ goal, done })`. Targets react on `onPointerDown` (only that is sent on);
  overlays inside a game get `data-tap-root`, drawing/dragging surfaces `data-tap-keep`.
- The fullscreen button is always there to get back into fullscreen, which a phone leaves whenever another app was
  opened in between: in every menu next to the back link (`MenuTop`) and next to ✕ while playing. Grown-ups on a
  computer (≥ 900 px wide with a mouse) see it always, also to leave fullscreen; on phones and tablets a game shows it
  only while out of fullscreen, so a child's tap can't end it. On a computer the back link of a menu is big, yellow and
  fixed in the top left corner, so it never scrolls away; phones and tablets keep it small.
- No menu level more than needed: a home category with one game opens that game directly (`categoryHref`, checked
  in `content.test.ts`), and variants of one way to play (which words, how long, whole word or first letter) are
  choices in the always visible row above the cards (`level`), not cards or a menu of their own.
- Menus show as many cards as possible without scrolling, on phones too (shorter side < 600 px – the same limit
  in `useFitGrid` and in the styles' `(max-width: 599.98px), (max-height: 599.98px)`): there a menu shows no title,
  no line under it and no „Was spielen wir?“ (only read out – the cards say enough; the home logo stays), and the
  cards get smaller and flat (emoji beside the title; too narrow for that, emoji above a small title without ▶). Buttons for grown-ups sit in the top
  left corner, never over the sun in the top right one. When a menu fits on one screen, the free room goes around its cards
  (or „Los geht’s!“, `data-spread`), so the back link stays on top and the buttons under the cards (ℹ️, ⚙️) sit on the bottom
  edge – never everything bunched in the middle; `useFitGrid` leaves that room out when it sizes the cards. What only grown-ups need below the cards (version,
  install hint) waits below the first screen (`data-below-fold`), never fixed over it. On a phone the home
  page's option menus cover the whole screen, with name and ✕ on top and a „Weiter unten gibt es mehr“ bar
  while there is more to scroll to. Check menus at 844×390 and 390×844 as well as tablet and computer.
- Works with touch and keyboard. `src/lib/device.ts` hides keyboard hints on touch
  devices and on-screen keys on computers.
- Leaving needs a grown-up: hold Esc or the ✕ (`GameShell`). The only other way out is „Menü“ at the end
  of a level. Never add another.
- Play time (`src/lib/playtime.ts`, ⏳ on the home page) limits minutes or games per day for all games. When it is over the game
  says good night, and `PlaytimeLock` (mounted in `index.tsx`) covers every menu, so a child stays there until a grown-up
  holds ⏳ for three seconds. Anything a child could tap never gives more time or resets it: that lives only behind the lock
  or in the grown-ups' menus. A new way to start a game calls `countGame()` (GameShell and GameEnd do).
- Every end of a level or story shows the shared `GameEnd` (`src/components/GameEnd.tsx`): big „Menü“ (back to the
  current game's own start screen before play, `useLeaveGame()` – never the home page; its picture is four cards,
  `MenuIcon`, never a house), „Nochmal“ and „Weiter“ (the next level in the game's order, after the last
  the first, so there is always one). So a start screen has no „all in turn“ card (`GameMode` has no such kind):
  the picked level plays first and „Weiter“ goes on from there. A game with only one level or story leaves „Weiter“ out (`next` is optional):
  two buttons doing the same thing confuse. A game with its own end buttons (Gefühle, Zähne putzen) still offers all three
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

- Start screen: a game opened in the moment (Aufs Töpfchen: the child has to go now) skips it with `startMode` and plays
  at once; the start screen comes only after ✕ or „Menü“. What the game is and how it is played (also keys and tips for grown-ups) goes into `info`
  („ℹ️ Über das Spiel“, every game has one); `settings` („⚙️ Einstellungen“) holds only options and the notes
  that explain them. A game adds no own switch for what the home page already sets for all games
  (Vorlesen, Töne, Musik, Sprache), nor a choice for what the game can tell by itself (morning or evening by the clock).
  A song that is the game itself (the Zahnputzlied sings the steps) plays even with Musik off and sings in the app language.
- Settings: `useGameSettings(KEY, DEFAULTS)` – saved in localStorage, merged into the
  defaults (so new fields need no migration); `speech`/`sounds` come from the shared
  options on the home page. Bump the key's `.vN` only when old values would break.
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
  only between games: menu pages call `useUpdateBetweenGames()` (`src/lib/pwa.ts`) – a new menu page does too, a game never.
- A new game needs: folder, page, route in `App.tsx`, entry in `CATEGORIES`
  (`src/content/games.ts`), a row in `src/content/ideas/languageStatus.ts`, an entry in `src/content/seo.ts` – use `/neues-spiel`.
- Search engines: every game, category and scene has a title, description and text in `src/content/seo.ts`
  (checked by `content.test.ts`). The build writes an own `index.html` per entry (GitHub Pages would answer
  with 404.html and status 404, which Google skips), plus `sitemap.xml`; the app keeps title and head in step
  (`useTitle`, `SeoHead`). Texts say only what the page really does. Heavy downloads (service worker copy,
  songs) start only after the page has loaded (`afterLoad` in `src/lib/pwa.ts`).
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
   (Bewegungsabenteuer), `?level=<id>` on `/kettenreaktion/`.
