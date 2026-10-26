---
name: neues-spiel
description: Add a new game to The Tiny Taps – folder, start screen, settings, page, route, home menu, docs and checks. Use when the user asks for a new game or wants to build an idea from the ideas page (e.g. "mach N-12") that is a game of its own, not a new mode of an existing game.
---

# New game

Read the root `CLAUDE.md` first (toddler rules, style). Pick the closest existing
game as reference and copy its patterns: `shadows/` (small, cards and drag),
`elevator/` (SVG story with a script of waits), `loud/` (levels with „Nochmal / Weiter“).

If the idea fits an existing game as a mode or level, add it there instead
(`modes` on its `GameShell`) – fewer games in the menu are easier for parents.

## Files

```
src/games/<game>/          folder name: short English word (marbles, elevator)
  <X>Game.tsx              start screen: <GameShell title emoji modes mode onMode level info settings>
  <X>Play.tsx              the game, mounted only while playing; props: settings (+ mode)
  settings.ts              <X>Settings, DEFAULT_<X>_SETTINGS, <X>_SETTINGS_KEY = "tinytaps.<game>.v1"
  content.ts               German texts, pictures, sentences
  <game>.css               all styles; every class prefixed (`elev-`, `shadow-` …), CSS is global
  CLAUDE.md                what the game does and where its parts are (see below)
src/pages/<X>Page.tsx      useTitle("<Titel>"); return <XGame />
```

Wire it up (the tests in `src/content/content.test.ts` fail if one is missing):

1. Route in `src/App.tsx`, German path with trailing slash in the link (`/aufzug/`).
   Lazy-load it like the other pages.
2. `CATEGORIES` in `src/content/games.ts`: the game in the fitting category.
3. The idea in `src/content/ideas/<area>.ts`: `done: true` (or `partial: "…"`).
   And its entry in `src/content/seo.ts`: a title with what parents search for (see the research
   on `/management/`), a description of 80–160 characters and a short text; true to what the game does.
4. One line in the README structure table and the roadmap.

## Settings and shared parts

- `useGameSettings(KEY, DEFAULTS)` in `<X>Game`; include `speech` and `sounds` fields
  if the game talks or makes noise – they are filled in from the home page options.
  Defaults: `speech: false`, `sounds: true`.
- What the game is and how it is played goes into `info` (required, „ℹ️ Über das Spiel“): short German
  `<p>`s for grown-ups, one per mode, keyboard hints only when `!useDevice().touchOnly`.
- Parent options go into `settings` with `SettingsGroup`, `Toggle`, `Choice`
  (`src/components/SettingControls.tsx`) – only options, no description; no own switch for
  Vorlesen, Töne, Musik or Sprache, the home page sets those for all games.
- Sounds: build on `note()` and friends in `src/lib/sfx/core.ts` (the new sound goes into the topic file it fits), or `playRecorded(name, fallback)`
  for a recording in `src/lib/sounds/`. Speech: `speak()` from `src/lib/speech.ts`, only if
  `settings.speech`.
- End of a level: `<GameEnd onAgain next />` from `src/components/GameEnd.tsx`.
- Leaving is handled by `GameShell` (hold Esc / ✕). Never add another exit.

## The game itself

- Every tap and every key does something at once – also "wrong" ones, which do
  something nice instead of an error. Keys: letters, digits, arrows, Space, Enter.
- Nothing to read; big targets (≥ 60 px on a phone); works upright and landscape.
- Every tappable thing carries `data-tap` (`tapState({ goal, done })` for the right answer / one tapped already),
  so taps next to it count too (`src/lib/tapTargets.ts`); react on `onPointerDown`, not `onClick`.
- Still and silent until the child acts.
- Drawings in SVG components with CSS animations; generated pictures via `/bild-erzeugen`.

## CLAUDE.md of the game

Start with `# <Titel>`, the route and the idea id, then a paragraph on how it plays
and which file holds what. Add notes that save the next session time: dev helpers
(`?level=`, `window.__x.seek`), rules learned from feedback, what not to break.

## Checks before you finish

1. `yarn verify`; add a `<game>.test.ts` for content rules (unique ids, every
   sentence non-empty, references between lists exist).
2. Preview (`preview_start` with `dev`): start screen, every mode, touch and keys,
   the end of a level, leaving with Esc held. `document.getAnimations()` is empty
   before the first tap.
3. Commit on the branch, merge into local main.
