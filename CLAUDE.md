# The Tiny Taps – notes for Claude

Keyboard and touch games for toddlers (2–3 years). A React 19 single-page app
built with Rsbuild, deployed to GitHub Pages, works offline (PWA). No backend.

## Commands (always yarn, never npm)

```bash
yarn verify        # lint + format check + typecheck + unit tests – run before every commit
yarn format        # format everything and apply safe lint fixes (Biome)
yarn test          # unit tests only (Rstest, ~1 s); yarn test:watch while working
yarn build         # production build into out/
yarn image ...     # picture with Gemini, see /bild-erzeugen
yarn song ...      # measure a song from Suno, see /musik-erzeugen
yarn frames        # do the two frames of each moving picture stay the same scene? --scenes: every picture of a story
```

Dev servers are in `.claude/launch.json`: start them with `preview_start`.
Use `dev` – it moves to the next free port when another session has 3000, so
never add configs with fixed ports. `preview-pages` serves the built site with
the service worker. Sound and speech are muted when the browser
is Claude's preview (`src/lib/silent.ts`).
In a fresh worktree run `yarn install` first.

## Working here

- Several Claude sessions work in parallel, each in its own worktree. When a task
  is done: `yarn verify`, commit on the branch, merge into **local** `main`, never push.
  Shared files many branches touch (`ScenePlay.tsx`, `src/lib/sfx/`, `src/styles/`,
  `src/content/ideas/`): keep edits there small and local, so merges stay easy.
- Commit messages: `<Game or area>: <what changed, in plain words>`, e.g.
  `Lebendige Bilder: the belt loader at the airport has wheels too`.
- Each game documents itself in a `CLAUDE.md` in its folder (loaded when you work
  there). Update that file with the code, not the README – the README only has one
  line per game, so parallel branches don't all conflict on it.
- Before touching a Bewegungsabenteuer level read [`src/games/adventure/LEVEL-REGELN.md`](src/games/adventure/LEVEL-REGELN.md)
  and check the work against it; write every piece of feedback on a level into it as a general rule
  (German, in the same commit as the fix).
- Ideas live in `src/content/ideas/` (one file per area) with fixed IDs ("mach N-04"). When an idea is
  built, set `done: true` (or `partial`) there; an idea the user turns down gets `rejected: true` (kept, never deleted).

## Language and style

- Everything the child or parent sees or hears is **German** (short, simple, present
  tense). Code, comments, docs and commit messages are English, except
  German names of games, modes and content.
- Comments explain *why* and what a thing is for, in plain sentences; every exported
  type, field and function has a short `/** … */`. Match that density.
- Names are English (`ScenePlay`, `useGameSettings`); folder and route names of games
  are German where they are user-facing (`/bilder/`, `/aufzug/`).
- CSS is global and each game's CSS arrives only when the game is opened: prefix
  classes and `@keyframes` by game or scene (`el-`, `bs-`); never style another
  game's classes. A game using another game's parts imports that CSS itself.
- Drawings are SVG in React components, animated with CSS classes; no image files
  unless an emoji or drawing can't do it (`public/images/`, `bilder/` folders).
- TypeScript is strict with `noUnusedLocals`/`noUnusedParameters`: delete what is no
  longer used instead of leaving it around.
- Formatting is Biome's (`biome.json`, 160 columns): don't format by hand, run
  `yarn format`. Lint rules that don't fit SVG drawings (index keys, `role` on `<g>`)
  are off; fix what the rest reports instead of ignoring it.

## Rules for every game (toddlers play alone)

- One tap or key = one immediate, visible and audible reaction. Every key does something.
- No wrong answers, no error sounds, nothing to read: pictures, sounds and voice.
- Silent and still until the child acts: no sound without a tap/hover/key, no idle
  animation unless the parent turns it on (`document.getAnimations()` is empty after load).
- Speech is off by default (`src/lib/common.ts`); sounds are on.
- Works with touch and keyboard. `src/lib/device.ts` hides keyboard hints on touch
  devices and on-screen keys on computers.
- Leaving needs a grown-up: hold Esc or the ✕ (`GameShell`). Never add another way out.

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

- Start screen: what the game is and how it is played (also keys and tips for grown-ups) goes into `info`
  („ℹ️ Über das Spiel“, every game has one); `settings` („⚙️ Einstellungen“) holds only options and the notes
  that explain them. A game adds no own switch for what the home page already sets for all games
  (Vorlesen, Töne, Musik); „Zähne putzen“ (brushing hints, music while brushing) is the only exception so far.
- Settings: `useGameSettings(KEY, DEFAULTS)` – saved in localStorage, merged into the
  defaults (so new fields need no migration); `speech`/`sounds` come from the shared
  options on the home page. Bump the key's `.vN` only when old values would break.
- Sounds: `src/lib/sfx/` synthesizes everything (Web Audio), one file per topic (animals, vehicles, music, home; helpers in `core.ts`), all imported from `@/lib/sfx`; `playRecorded(name, fallback)`
  plays `src/lib/sounds/<name>.mp3` when there is one (CC0, source in its README).
- Music: `GameShell` plays one background song in every game from the child's first tap
  (`src/lib/backgroundMusic.ts`), on by default, "🎵 Musik" on the home page turns it off
  for all games and then no song is downloaded. A game with its own music (or a microphone)
  calls `useNoBackgroundMusic()`; song files are named `musik-*.mp3`, see `/musik-erzeugen`.
- A new game needs: folder, page, route in `App.tsx`, entry in `CATEGORIES`
  (`src/content/games.ts`) – use `/neues-spiel`.
- A new Lebendige-Bilder picture: `/neue-szene`. A new Kleine-Abenteuer level: `/neues-abenteuer`. A generated picture: `/bild-erzeugen`. Music from Suno: `/musik-erzeugen`.

## Checking your work

1. `yarn verify`. The tests (`*.test.ts` next to the code) check data that is easy to
   get wrong by hand: scene items (ids, tap sizes, chains, keys, plural grammar), roads,
   the home menu against the routes and kid tiles, ideas, language packs, the movement
   library, the Gefühle pictures, unique `@keyframes` names.
   When you add data with rules like these, add a check.
2. Look at it in the browser preview: the change itself, the console, and the rules above.
   Development helpers: `__machine.seek(s)` (Kettenreaktion), `__adventure.seek(s)`
   (Bewegungsabenteuer), `?level=<id>` on `/kettenreaktion/`.
