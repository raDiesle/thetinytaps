# Books for Both – notes for Claude

Keyboard and touch games for toddlers. A React 19 single-page app
built and served by Bun, deployed to GitHub Pages, works offline (PWA). No backend.

## Commands (always Bun, never npm, yarn or npx)

```bash
bun run verify     # lint + format check + typecheck + unit tests – run before every commit (never piped into tail or grep before `&& git commit` or `&& git merge`: the pipe hides a failure and the commit or the merge into main goes in anyway – one left main half-merged)
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
never add configs with fixed ports. Bun's dev server can stay stuck on „Could not resolve“ after a merge brought new
files with their importers; `tools/dev.ts` then restarts it on the same port (the page reloads), so a „Could not
resolve“ that stays is a real typo or missing file – never work around it in the code. `preview-pages` serves the built site with
the service worker. Sound and speech are muted when the browser
is Claude's preview (`src/lib/silent.ts`).
In a fresh worktree run `bun install` first.

## Working here

- Several Claude sessions work in parallel, each in its own worktree. When a task
  is done: `bun run verify`, commit on the branch, merge into **local** `main` without asking,
  never push (and don't offer to – pushing is the user's move). Other sessions merge into `main` all the time: merge `main` into your branch and verify there first, and when the merge into `main` still conflicts, `git merge --abort` it there at once and resolve on your branch – never resolve conflicts in the main checkout or leave it half-merged. Each session may run a dev server on its own
  port, so when you hand merged work over, name the URL of the one running from the repo root (local `main`) –
  the user once checked another session's server by mistake. Look at that server before naming it: a running dev server
  does not pick up a merge that brings new files, a changed `index.html` (it kept showing the old name after a rename)
  new exports between modules (a reload still threw „plannerDefaults is not a function“) or rules changed in a game's
  CSS (a merged `rewards.css` stayed old after a reload while its new JS came through – test a class's computed style
  there, not only that the page loads),
  so when it still shows the old state, say it must be restarted (`bun run dev` in the repo root) instead of handing over a stale URL.
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
- Ideas live in `src/content/ideas/` (one file per area) with fixed IDs ("mach N-04"). A game with ideas of its own gets an area of
  its own (a `key` sharing the old prefix, like „Wie geht's dir?“ and „Timer“), never a run of them inside a long mixed
  area, where the user could no longer find the Timer's ideas (user feedback, November 2026). When an idea is
  built, set `done: true` (or `partial`) there; an idea the user turns down gets `rejected: true` (kept, never deleted).
  An idea round only collects – the user decides later what to implement, so don't offer to implement
  after one (say „umsetzen“, not the ambiguous „bauen“).
- The hidden page `/management/` (hold Papa Fox and his child on the o of „Both“ in the home title, `Logo`; `/ideen/` is its old address) is where
  everything goes that helps the user decide: ideas, the language table, and research. Scrolling down it always shows
  every open idea: a tap above (the overview's numbers, the contents) jumps to its place and marks it, never filters, and
  the list's own filters last only for the visit (a stored filter kept the list short for good, user feedback, November 2026). Research (searches,
  market or keyword analyses, measurements) is written into `src/content/research.ts` with its date, method,
  findings and the ideas it led to – not only told in chat. `content.test.ts` checks that its ideas and games exist.
  What a conclusion rests on and you could not read (a price behind a configurator, a law's text) you read some other
  way or ask the user for before concluding, never guess or give an impression: guessed desk calendars at 4–7 € each
  were 0.72 €, and a flip calendar first called „eher kein Spielzeug“ is one by the EU's own guidance on books.

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
  (so a German-only line in a translated game fails until its row says what is missing). A new game that comes German-only
  into the translated menus keeps its card's title and blurb in its own folder (`names.ts`, imported by `games.ts`, like
  `/zusammen/`), so its own row says they are missing, not the home page's.
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
- Texts for parents (the home page's foot, the SEO texts' prose) speak as the parents who made the app: warm,
  flowing sentences in our own words, the way one parent tells another. The user's notes on what to say are a rough
  guide, never wording to copy or to turn into a list of steps (user feedback, October 2026).
- Comments explain *why* and what a thing is for, in plain sentences; every exported
  type, field and function has a short `/** … */`. Match that density.
- Names are English (`ScenePlay`, `useGameSettings`); folder and route names of games
  are German where they are user-facing (`/bilder/`, `/aufzug/`).
- Container units (`cqw`, `cqh`) measure the nearest container *above* the element: on the container itself (its own
  padding, gap) they measure the next one up, often the whole window, so size only a container's children with them.
- CSS is global and each game's CSS arrives only when the game is opened: prefix
  classes and `@keyframes` by game or scene (`el-`, `bs-`); never style another
  game's classes. A game using another game's parts imports that CSS itself. Keyframes a game borrows
  (`pop-in`, `wiggle`, `bob`, …) live in `src/styles/animations.css`, which every page loads – never use
  keyframes from another game's CSS (`css.test.ts` checks it).
- Drawings are SVG in React components, animated with CSS classes; no image files
  unless an emoji or drawing can't do it (`public/images/`, `bilder/` folders).
  Phones must keep up: what moves across a big picture as a whole (a scrolling world, a camera) is an HTML layer of its
  own (its own svg in a `div` with `will-change: transform`, or the whole world's svg moved by a CSS transform like
  Kettenreaktion's `cameraLayer`), never a moved group inside one big svg nor a changing `viewBox`, which the browser
  paints whole again in every frame; and a big still drawing is built once (`useMemo`, `memo`), not again with every
  tick, step or key (Zähne putzen and Kleine Abenteuer both stuttered on phones from this). What moves on every frame
  moves by CSS (`transform`, `opacity`, `filter` of an HTML layer), never by React drawing it again per frame, and only
  what the child is busy with moves (waiting figures stand still). Any CSS animation of an element *inside* an svg, and
  of `mask-position`, `background-position`, `clip-path` or a size, has the phone paint that whole svg or box again in
  every frame: a glow pulsing over the teeth with the lips in one svg, and a shadow band slid across the page beneath
  as a moving mask, each repainted most of the screen 60 times a second. Give such a thing a layer of its own (its own
  svg or element) and animate that layer's `transform` or `opacity`: a small figure that sways or glows is a small
  HTML layer round its own little svg, and the HTML moves, not a group inside (even small svgs animating inside kept an
  old phone's main thread busy; Zähne putzen's monsters, `Sprite`). A layer is only as big as what it shows: a phone
  rasters a changed layer in bands as wide as the screen. Nothing heavy runs while a book flies or a page turns: a new page is drawn before the motion starts,
  never in its middle, and loading other pages' code waits (`holdPreloads` in `src/lib/preloadPages.ts`).
  `bun run perf` measures it: it plays each game in headless
  Chrome as a ten-year-old Android phone (6× slower CPU, 640×360 at 3× pixels) and fails a stretch over the budget
  (`tools/perfScenarios.ts`: p95 frame ≤ 34 ms, ≤ 0.5 frames over 50 ms a second, main thread ≤ 60 % busy, and ≤ 30
  screens of pixels rastered anew a second – the GPU's work, which a gaming phone's 120 Hz screen doubles). Until
  November 2026 it rastered at 1× and counted the idle seconds of collecting its trace into every stretch, so it found
  nothing while the user's phone stuttered: when a phone stutters and the tool says it's fine, doubt the tool first. A new game,
  or a new part that moves a lot, gets a scenario there; run it after changing what moves, and after changing a page a scenario taps through (the home page's cards became a bookshelf and its menu scenario failed until the weekly run; `bun run perf <name>`,
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
  **Every fox or bear drawn in SVG has the one shared head** (`MascotHead`, or the whole `Mascot`, in
  `src/components/Mascot.tsx`, with its colours `MASCOT_COLORS` for the body round it): drawn like the Gemini family
  pictures (`bilder/buch-fuechse.webp`, `buch-baeren.webp`) – a plum-brown line, the fox's white cheeks in tufts, fluff
  in the ears, the far side of the fur in shadow, brows, eyes with two lights, a shiny nose. Never a head of its own
  from circles and triangles: those flat heads looked poor (user feedback, November 2026). Cuddly and true to the
  animal, for children (user feedback, November 2026): eyes a little below the head's middle with a warm brown iris
  round the pupil (a child's bigger and lower), light in the fur as soft tufts, never a round plastic shine; bodies
  round with chubby arms and round paws with toes, the fox's legs dark below the elbow as a real fox's. Hats, bows and glasses go
  in as its `children`, clothes and bodies round it in its colours and line; a better fox or bear is made there, so
  every game gets it. Toys (a teddy), wild animals of a scene and tiny patterns stay drawn on their own. `Mascot.test.ts` checks.
- TypeScript is strict with `noUnusedLocals`/`noUnusedParameters`: delete what is no
  longer used instead of leaving it around.
- Formatting is Biome's (`biome.json`, 160 columns): don't format by hand, run
  `bun run format`. Lint rules that don't fit SVG drawings (index keys, `role` on `<g>`)
  are off; fix what the rest reports instead of ignoring it.

## Rules for every game (toddlers play alone)

- One tap or key = one immediate, visible and audible reaction. Every key does something.
  The feedback fits what the tap did (`useTapFeedback`, `src/components/TapFeedback.tsx`; user feedback, November 2026):
  a tap or key that sets nothing off gets soft rings as on water (`ripple`), or better something of the game's own world
  (Lebendige Bilder's `spots`) – in the menus, start screens and on the bookshelf too (`MenuRipples`, mounted once in
  `index.tsx`, which leaves out what answers by itself and the grown-ups' pages); a tap that sets something off gets a warm light where the finger was (`glow`) and the
  thing itself answers – never a random shape. A reaction, never a firework: **after a choice or an answer the
  picture's change and its sound are the answer** – the faces turning happy or relieved, the animal eating, the door
  opening. Nothing floats up then (no hearts, stars, sparkles, 💢 💥 💧, no `celebrate`), and no card, button or frame
  hops, shakes, pulses, blinks or grows – not the one picked, not the others, not „Weiter“ at the end (user feedback
  from Gefühle, November 2026: too much fast blinking and movement for small children, for every game). What lives in
  the picture may still act (an animal shaking its head at the wrong food, a hidden one coming out happy). Only a
  level's or a story's end is celebrated (`celebrate`), calmly: a few hearts, stars and notes rise slowly while
  everyone in the picture cheers – never a storm of confetti, shapes or fast movement. `tapFeedback.test.ts` keeps it
  calm, `calmAnswers.test.ts` keeps answers still and `celebrate` at the ends.
- No wrong answers, no error sounds, nothing to read: pictures, sounds and voice. That means no words in the picture
  for a sound or a call either – no floating „Mäh!“, „Brumm!“, „Krah!“, no „Danke!“ or „Bäh!“ bubble (removed, user
  feedback, November 2026): the sound says it, and what floats up from a thing tapped in the picture is a music note
  (♪ ♫), a heart or a puff of that thing – never after a choice or an answer (see above). Signs that
  belong to the drawn world (FEUERWEHR, TAXI) may stay. `src/soundWords.test.ts` checks the drawings. Where a
  game plays only synthesized noises, a real CC0 recording from Freesound is better: `src/lib/sounds/README.md` says how
  to cut one, and a game loads its recordings when it starts (`loadRecordings`), so even the first sound is the real one.
  An animal, water or machine sound that has a recording is imported from `@/lib/realSounds` (same names as in
  `@/lib/sfx`, preloaded with `loadRealSounds`), not from `@/lib/sfx` – unless the recording doesn't fit the moment (a
  bicycle bell is no telephone, the farm's goat and donkey bend the synthesized sheep, horse and cow).
- No row of stars counting the rounds played or the things found (user feedback, November 2026): a game flows on with
  nothing to collect. The one exception is Lebendige Bilder, whose „⭐ found/all“ of a picture grown-ups need
  (`src/progressStars.test.ts`). A star chart that is the point (Belohnungstafel, the week charts) is no such count.
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
  really helps, never for a game that plays fine silent. Never add a switch for either again, with one exception: Gefühle's „Alltagssituationen“, where a grown-up
  may want to tell the scenes to the child in their own words, has a loudspeaker in its bottom right corner, switched by one tap, that
  switches its voice off (`VoiceSwitch`, user decision, November 2026) – only there, never as a pattern for other games. Recordings are made only when the user asks (see Language).
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
  The home page's options for all games are „🎵 Musik“, one tap on its own button, never a menu, and „Junge / Mädchen“
  (things standing in the bookshelf, see the picture book below).
- **A figure that stands for the child follows „Junge / Mädchen“** (stickers of a fox girl and a bear boy on a wall inside the shelf, each with a little ♀ / ♂ beside
  it so it is plain which is which, one tap on either chooses it – user decision, October 2026; `useFigure()` from `src/lib/common.ts`, boy by default): the child of Kleine Abenteuer (`useHero()`),
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
  opened in between: in every menu in the top right (`MenuHead`, the last of the home page's buttons) and next to ✕ while playing. A game shows it
  only while out of fullscreen, on every device, to get back in – never to leave it, so a child's tap can't end it and a
  game in fullscreen shows nothing of it (user feedback, October 2026); leaving is the menus' button. Starting or leaving a game in fullscreen must not make the browser
  show its „how to leave fullscreen“ note again: no new fullscreen request when already in it, and the keyboard lock
  (which re-shows the note on lock and unlock) only on computers (`enterKidMode`, `fullscreen.test.ts`). ✕ and the fullscreen button
  lie over every game's picture, also dark ones (night, space), findable on both: the ✕ is the page's corner and the
  fullscreen button and ⚙️ are paper notes clipped on (see below); a game never restyles them. Only Impressum,
  Datenschutz and the management page, which are no book's pages, go back by a big yellow round arrow without words
  (`MenuTop`, its target only as tooltip and read out), close to their title – never far off in the screen's corner,
  where grown-ups on a big monitor didn't find it. A menu's title goes into `MenuHead`, which puts the fullscreen button
  on the right and the way back as the page's corner turned up in its top left, at the outer edge of the left page seen
  (`PageCorner`, user feedback, October 2026), and a tap lifts that very page there and turns it back over the spine to
  the right: what is touched must be what moves, like a real book – a corner in the top right turned the other page, and
  grown-ups didn't look there for the way back. Back onto the shelf (a menu whose way back is the home page) no page
  turns: the book closes and goes back, so there the way back is the book's ribbon (Lesebändchen) coming out over the
  page's top edge and lying on the page with its shadow, a big round paper label on it with a tall, slim bookshelf in
  colour and the yellow round arrow of the way back – a plain arrow, a straight shaft and an even head
  (`PageCornerArt sign="shelf"`, user feedback, October 2026) – never a page's corner, nor a cover's corner lying over
  the page, which floated where no cover can be: what stands for a part of the book lies where that part really is. It
  is much bigger than a page's corner (`--corner`; a shelf stamped small in gold, then a small label with a squat shelf,
  were not seen), and where a wide screen leaves a broad margin beside the table of contents it lies in that margin
  right next to the lines, as big as the margin allows (in the far corner it stayed small, with empty room between it
  and the lines). It never lies over a card, a line, a title or the text below: it scrolls with the paper, and where it
  hangs above the lines the menu's head grows down past it (`--ribbon-reach`, `--menu-pad`) – making it bigger means
  keeping that room free with it (`MenuTop.test.ts`).
  Only what is drawn of a corner is tapped, never the empty rest of its square, which reaches the first line. No round arrow stands beside the title for it (`MenuTop.test.ts`), the sun or a room's window step aside, and nothing
  else goes into that corner. Every way back inside a book is that corner: while playing, the ✕ that leaves is the
  same corner at the top left with a ✕ on it (`PageCornerArt`), tapped or held just like the ✕ – held, it lifts further
  instead of a ring filling – with the fullscreen button right of it, clear of the room it lifts into; a game's ⚙️ (`PlayOptions`) moves to the top right for it, and a game's own buttons and signs in the top
  left keep below it with `top: calc(… + var(--corner-clear, 0px))` (Schatten finden's picture choice lay under the ✕,
  user feedback, October 2026; `css.test.ts` checks).
- The home page is a bookshelf, one picture book per category (D-20, user decision, October 2026; `Bookshelf`): one first picks a book, and only inside it, on its first page, its table of contents,
  do its games stand – never levels on the shelf page itself. A new category is a new book. The one exception is a
  category whose games stand apart (`Category.apart`, „Alltagshelfer“: Belohnungstafel & Zeitplan, Zähne putzen,
  Töpfchen, Timer – user decision, October 2026): each of its games is a book of its own, standing spine out side by side, its
  emoji at the top of a paper label along the spine and its name below it (`SpineBook`, so a child finds it at a glance,
  user feedback, October 2026), opening its game directly; they lean a little to the left together, on their bottom
  left corners (`--lean`), so the names running down their spines are read without bending the
  head as far (user feedback, November 2026) – taken out, a book straightens as it lifts; the category has no page, and its games' way back is the
  shelf. The name on a spine stands in one line, never broken – smaller where it is long (`--len`), checked in every
  language at 844×390 (user feedback, November 2026). A game with parts of its own address (`Game.volumes`) stands as
  that many books tied together with a red ribbon and a bow, each opening its part and found by the way back:
  Belohnungstafel, Zeitplan and „Wie lange warten?“ (the Zeitplan's Countdown), right of Aufs Töpfchen (user feedback, November 2026). The Alltagshelfer are what parents
  need most, so they stand first, top left (first in `CATEGORIES`), and that bundle is the eye-catcher of the shelf:
  glowing brightest, the Belohnungstafel in it bound in gold – still, nothing idles. Every book stands on its board like
  its neighbours, never in a box or pulled out further than they: a slipcase round the two, pulled out and tipped, looked
  as if it floated (user feedback, November 2026). What can be taken is
  plainly unlike what only fills the shelf (user feedback, November 2026): books to take are bright, with paper labels
  or covers, standing at the front and glowing; books only filling it are dull and dim, never a paper label or a glow,
  and answer a tap by rocking with a soft knock (`nudge`), so a child sees the tap was felt. The group is marked as one by a small wooden sign with its
  name screwed onto the board's edge under it (`DailyGroup`; a label from four drafts – bookend, sign, paper band – user
  decision, November 2026, made of wood so it looks mounted, user feedback, November 2026), and the picture books
  standing together on one board just so by „Lernspiele“ on the board under them (`labelOf`); such a sign hangs only a
  little below its board, never over a book on the board below. Beside the helpers words carved into the back panel tell grown-ups in short what
  the shelf is for – „Für Groß & Klein“ – then that it is the first step into the digital world taken together, with
  learning games and little helpers for the day – and nothing else: no „Alles kostenlos.“, no „Seite an Seite“, no „die die Kommunikation fördern“, no „von Eltern für Eltern“ (each tried and
  taken out again, user feedback, November 2026), no pointer to one game („Ein Blick in die
  Belohnungstafel lohnt sich“ was taken out, user feedback, November 2026). It ends with a carved, underlined „mehr …“
  that opens the texts for grown-ups (`RoomNotes`, see below). The carving takes room of its own on the board
  (`planShelf` takes each place's width), all of it where the picture books stay nearly as big (`CARVING_SHRINK`) and the
  words big enough to read, else only its first line and „mehr …“ – never none, since „mehr …“ is the way to those
  texts (`CARVINGS`). Its place is only as wide as its words need: a wider one left a gap beside them, and the picture
  book beside it stands close to its words, not a finger's gap away (only „mehr …“ in their middle takes a tap, user
  feedback, November 2026);
  words added to it widen its place (`CARVINGS`), never spill past the board – measure its first and last line against
  its box at 1280×720 and 1920×1080 (the 3D push makes it look smaller than it is laid out). Every picture book's cover shows a picture painted for its
  book (`src/components/bilder/cover-<category>.webp`, made with `/bild-erzeugen`, user decision, October 2026), never
  emojis: a new category gets one with it (`content.test.ts` checks).
- No menu level more than needed: a book with one game opens that game directly (`categoryHref`, checked
  in `content.test.ts`); and variants of one way to play (which words, how long, whole word or first letter) are
  choices in the always visible row above the cards (`level`), not cards or a menu of their own – or, in a game that
  plays at once, options while playing behind ⚙️ held in the top left corner (`PlayOptions`, Buchstaben & Zahlen; always held, whatever ✕ needs),
  never a tap a child could make by chance. But ways to play that are each a game of their own – something else to do,
  not the same game easier or with other words – are games of their own in the book's table of contents, never one
  game's choice behind ⚙️ (Frei tippen, Zählen and Wörter tippen were one game's „Spielart“ and „Nur Zahlen“, and were
  split again, user feedback, November 2026).
  Where a game's cards are only kinds or steps of one way to play (Was gehört zum Tier?'s Füttern, Wer wohnt wo? and
  Wer schaut da raus?), they become one flowing game instead: the kinds take turns in a fixed order, easiest first, and
  the game finds the difficulty itself by how the child plays (`nextLevel`, like Socken-Paare and Schatten finden), so
  its card plays at once with no start screen. Grown-ups may still switch kinds off or fix the difficulty, behind ⚙️
  while playing (`PlayOptions`), never on cards or a start screen (user feedback, November 2026).
  Where a game's cards come in sorts (`GameMode.kind`: lift stories, walks), the sort is named once above its group of
  cards on a shared frame (`GameShell`, `packGroups` in `useFitGrid`), never as a tag on every card.
- Headings carry no emoji (user feedback, October 2026): a menu's title is plain words („Lebendige Welten“, never
  „🌳 Lebendige Welten“; `MenuHead` takes a string), and so is every heading inside a page – the emoji stays on the
  card or the book, not over it (`MenuTop.test.ts` checks).
- A menu's cards, lines and books always stand in the same order (user feedback, November 2026): nothing moves to the
  front because it was played last – „zuletzt“ only marks the card where it stands (Gefühle once put the group played
  last first; `GameShell.test.ts` checks).
- Nothing to read between a menu's title and its cards, on any screen: no line under the title, no „Was spielen
  wir?“, no tagline under the home logo (all removed, October 2026) – the cards say enough. Only the „level“ row of
  choices may sit there.
- Menus show as many cards as possible without scrolling, on phones too (shorter side < 600 px – the same limit
  in `useFitGrid` and in the styles' `(max-width: 599.98px), (max-height: 599.98px)`): there a menu shows no title
  either (only read out; the home logo stays), and the
  cards get smaller and flat (emoji beside the title; too narrow for that, emoji above a small title without ▶). The sun sits in the top
  left corner, stepped aside for the page's corner (not on a phone, where it only crowds the cards); buttons for grown-ups never cover it. „Einstellungen“ (where a game still has them) is a
  small sign without words (⚙️; the name as tooltip and read out) – a paper
  note clipped beside the fullscreen note, see the picture book below – so it takes no row of its own; a panel opens right under the top row. A
  menu has no „Über das Spiel“ (user decision, October 2026: „wir brauchen keine Infos im Menü“). When a menu fits on one screen, the free room goes around its cards (or „Los geht’s!“, `data-spread`) –
  never everything bunched in the middle; `useFitGrid` leaves that room out when it sizes the cards. What only grown-ups need below the cards (the words
  for search engines) waits below the first screen (`data-below-fold`), never fixed over it – except on the bookshelf, the
  home page, which never scrolls (user feedback, October 2026): there it opens from the carving's „mehr …“
  (`RoomNotes`), and Impressum and Datenschutz stand small in the room's bottom right corner (`.room-legal`). On a phone the home
  page's option menus cover the whole screen, with name and ✕ on top and a „Weiter unten gibt es mehr“ bar
  while there is more to scroll to. Buttons and cards in a menu never touch or overlap, also not with a tilted card's
  corner or a button's shadow: keep clear room between the menu's head (its rows of buttons) and the cards
  (`.home > .menu-head` margin in `menus.css`) and between buttons in a row.
  Check menus at 844×390 and 390×844 as well as tablet and computer.
- Works with touch and keyboard. `src/lib/device.ts` hides keyboard hints on touch
  devices and on-screen keys on computers.
- A game is left with one tap on its ✕, or by holding Esc (`GameShell`): holding ✕ for a moment was the only way once
  and got in the grown-ups' way (user decision, November 2026), so it is a choice now, „Spiel verlassen“ under ⏳ on
  the home page (`leave` in `src/lib/common.ts`, `LeaveOptions`), for parents whose child taps ✕ by chance. Esc is
  always held, since children press it while typing. There is no other way out, also not at the end of a level (see
  `GameEnd`). Never add another. Nothing beside ✕ says what it does, not when a game starts nor while it is pressed or under a mouse: a
  „Zurück zum Menü“ there was more than grown-ups needed (user feedback, November 2026; `css.test.ts`); its name is
  only read out.
- **Back is always the screen seen before** (user feedback, November 2026): ✕, Esc and a menu's way back lead
  to the menu the child came from, never to a menu it didn't pass on its way in. And they step back in the browser's
  history rather than adding a page to it, or the phone's own back button afterwards opened the game just left again,
  or the same menu twice, so that it seemed not to work: a way back goes through `goBack` (`src/lib/goBack.ts`) or
  `useTurnPage(to, "back")`, never a plain `<Link>` or `navigate(to)`. A way back is never dropped while something
  moves (a book still coming out, a page turning): it goes at once, without the animation if need be.
- Play time (`src/lib/playtime.ts`, ⏳ on the home page) limits minutes or games per day for all games. When it is over the game
  says good night, and `PlaytimeLock` (mounted in `index.tsx`) covers every menu, so a child stays there until a grown-up
  holds ⏳ for three seconds. Anything a child could tap never gives more time or resets it: that lives only behind the lock
  or in the grown-ups' menus. A new way to start a game calls `countGame()` (GameShell and GameEnd do). A tool for the day
  rather than a game (the Timer, like the Belohnungstafel) counts no play time and still opens when it is over:
  `GameShell tool` and its address in `PlaytimeLock`.
- Every end of a level or story shows the shared `GameEnd` (`src/components/GameEnd.tsx`): „Nochmal“ and „Weiter“
  (the next level in the game's order, after the last the first, so there is always one). It has no „Menü“ button
  (user feedback, November 2026): the way back is the page's corner in the top left, as in every menu – the ✕, which
  leads to the game's own start screen or the page before it, and where that is the shelf the book's ribbon instead of
  the ✕ while the end is shown (`useEndShown`, GameShell); there it takes one tap even where ✕ is held while playing. They are words only, never an emoji, a symbol or the next level's picture (🔁, ▶
  and the level's emoji looked bad, user feedback, November 2026; `GameEnd.test.ts`): „Weiter“, what most want next, is
  a big painted label taped onto the page, „Nochmal“ a smaller paper slip beside it. So a start screen has no „all in turn“ card (`GameMode` has no such kind):
  the picked level plays first and „Weiter“ goes on from there. A game with only one level or story leaves „Weiter“ out (`next` is optional):
  two buttons doing the same thing confuse. A game that flows on from round to round by itself (Socken-Paare: the next
  wash comes on its own) has no end to show it at; it counts each round as a game itself (`gameEnded`, `countGame`). No game draws its own end buttons: one that places them in its own layout (Gefühle's
  cards' room, Zähne putzen's week chart) passes `inline` (user feedback, November 2026; `GameEnd.test.ts`). Where the end picture is the point (Aufs Töpfchen's party), `corners` puts them small
  in the bottom right corner instead, and only where that game's rules say so.
  Beside the buttons a fox or bear child jumps for joy and its grown-up waves (`CheeringFamily` from
  `src/components/Mascot.tsx`, D-12), fox or bear by chance; it is left out in `corners` and where the end picture
  already shows the family (`noFamily`, the Timer). `Mascot` is the app's one drawn fox and bear standing (grown-up or
  child, standing, waving, cheering, clapping or pointing): a game that wants one standing by takes it rather than
  drawing its own, and a family standing still by what the child looks at is `PointingFamily` (Zählen, Wörter tippen).
  Where the family stands in a game's own end layout, it answers a tap (`CheeringFamily onTap`: both wave and grin with
  their teeth – a decoration a child taps must do something, user feedback from Zähne putzen, November 2026).

## Architecture

```
src/App.tsx              routes; every game page is lazy-loaded (its own JS and CSS chunk)
src/pages/<X>Page.tsx    thin wrapper: useTitle + <XGame/>
src/games/<game>/        one folder per game, see its CLAUDE.md
  <X>Game.tsx            start screen: <GameShell> with modes, level, settings
  <X>Play.tsx            the game itself, mounted only while playing
  settings.ts            settings type, defaults, storage key "tinytaps.<game>.v1"
  content.ts             German texts and pictures
  <game>.css             styles and animations, classes prefixed by the game
src/components/          shared UI: GameShell, GameEnd (Nochmal/Weiter), SettingControls, …
src/content/             home menu (games.ts), language packs (de/en/tr/pl), ideas
src/lib/                 speech, sfx (synthesized + recorded sounds), storage, device, PWA
```

- Start screen: a game opened in the moment (Aufs Töpfchen: the child has to go now), or one with nothing to choose
  before playing (Socken-Paare finds its difficulty itself, Frei tippen changes everything behind ⚙️ while
  playing), skips it with `startMode` and plays at once. A game without cards or a `level` row to pick from never has a
  start screen with only „Los geht’s!“: it plays at once, and the options it keeps go behind ⚙️ while playing
  (`PlayOptions`; Zähne putzen had such a screen, user feedback, November 2026; `GameShell.test.ts` checks). A game that
  plays at once goes back with ✕, Esc and „Menü“ to the page before it, the book's table of contents (or the shelf),
  never to a start screen the child didn't see on the way in – neither one with only „Los geht’s!“ nor one with cards
  whose choice is made while playing (user feedback, October and November 2026; `GameShell` does it by itself). A game whose menu is
  the page before it (a picture of Lebendige Bilder, its mode chosen in the row on `/bilder/`) has no start screen at all:
  `leaveTo` sends ✕, Esc and „Menü“ back to that page. A game a routine opens for one of its steps (the Tagesplan's
  🪥 card, `{ returnTo }` in the router state, `src/lib/routine.ts`) plays at once too, outside play time, and ✕ or
  „Menü“ go back to the routine.
  **Aim for no settings and no description**, so start screens stay clear: a game should explain itself by playing
  (a glow, the pointing hand, a reaction to every tap), and what a switch would choose is decided once, the way that
  plays best, instead of being left to grown-ups. `GameShell` has no `info` („ℹ️ Über das Spiel“, removed from every
  game, user decision, October 2026): never bring a description back to a start screen. `settings` („⚙️ Einstellungen“)
  is optional and its button shows only when a game passes it; Kettenreaktion has none. Never add it to a game that has
  none, and when touching a game that still has it, prefer removing it (keep the default behaviour, delete the code for
  the other). Where it is still kept, it holds only options and the notes that explain them. A game adds no own switch for what the home page already sets for all games
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
  "Bitte quer halten" while the device stands upright (its „Trotzdem hochkant“, a small plain button beside the big ones so a
  child's hand goes elsewhere, lets a grown-up play upright for the rest of the visit), and asks once per visit for fullscreen, which on Android
  also locks landscape (`src/lib/fullscreen.ts`). Computers see neither.
- Updates: a page opened online always comes from the network, so it runs the newest build; the service worker answers
  it from its cache only offline, on an error status or after 3 s without an answer (`src/sw.js`, `sw.test.ts`). Never
  answer pages from the cache first: phones then kept the old build through several reloads, until the new worker had
  downloaded every file in the background (user feedback, November 2026).
  An installed app that stays open looks for a new version every hour and when it comes back, and restarts with it
  only between games, while it is in the background on a menu: menu pages call `useUpdateBetweenGames()`
  (`src/lib/pwa.ts`) – a new menu page does too, a game never. Never restart or reload on a tap: restarting when a
  menu card was tapped made the next menu take seconds to show.
- Offline: the service worker keeps what a visit uses – at install only the start (`shellFiles` in `tools/build.ts`:
  index.html, its scripts and styles and the pictures they name), then every file of the site once a page fetched it,
  so a game played once plays offline – and the whole site only for an installed app (`keepAll`, `isStandalone`). A new
  build takes over the files named by their content from the old cache instead of downloading them again. Never
  download every file for every visitor again: it was 42 MB on each first visit and after each build, while few play
  offline (November 2026; `sw.test.ts`). What is fetched ahead (other pages' code, the song) waits when the visitor
  saves data (`savesData()` in `src/lib/pwa.ts`).
- A tap in a menu shows the next screen at once: the home page and the category pages load the lazy pages behind their
  cards while they wait (`usePreloadPages`, `src/lib/preloadPages.ts`, each lazy page registers its addresses in
  `App.tsx` – checked in `preloadPages.test.ts`), and a card starts loading its page as the finger lands. A new menu
  whose cards open lazy pages does the same.
  Nothing ever loads in the dark (user feedback, November 2026: Zähne putzen opened straight from its address stood dark
  for seconds on a phone, showing only the small words for search engines on the table): a built page shows its title
  on a sheet of paper with a paw track coming and going (`.boot` in `base.css`, `BOOT_WAIT` in `tools/pageStart.ts`),
  its words for search engines below it, and the app's `Suspense` shows the same paper and paws while a page's code still
  loads (`PageLoading`), never nothing. A built page fetches its own page's code, and on an English page the English
  texts, together with the start's (`modulepreload`, `pagePreloads` in `tools/build.ts`), not one after the other: a
  new lazy page is a `page(…)` line in `App.tsx` with its addresses, and `pageStart.test.tsx` checks every page for
  search engines finds its code. Fetching ahead stays as it is: after the page has loaded, in idle moments, never the
  songs or every game for every visitor.
- **The app looks like a picture book a grown-up and a child read together** (A-20, area D on `/management/`,
  `src/lib/look.ts`). **It is the only look** (user decision, November 2026): the old toy-block look (cards on a sky,
  buttons on top, its switch `?buch=aus` and its stored choice) was removed, since keeping it only kept code no one
  sees – never bring back a second look or a switch between looks, and write new styles as the book's plain rules, with
  no `data-look` or other branch (`look.test.ts`). Like this: the home page is a room with a bookshelf (`Bookshelf`, D-20, user
  decision, October 2026), the app's name „Books for Both“ in its title, each category a picture book standing on it with its cover out;
  a category's page looks like its book's table of contents (`BookContents`, user feedback, October 2026): one line per
  game sharing the page's height – a round picture, its name, dots leading to its page number (the first game on page 1,
  `gamePage`, user feedback, October 2026) – each line a soft wash of
  its world's colour and all of it the tap, never cards; every
  menu is a paper page, and the game's picture lies inside the page's paper margin (`.book-frame`). The page seen is
  always the book's **left** page: its outer edge on the left with the board and the table round it, the spine on the
  right with the facing page in its shadow beyond it (`--page-left`, `--page-right`; `look.test.ts`). Most of it is CSS
  in `src/styles/book.css` and `bookshelf.css`, whose rules begin with `:root` to win over the shared base styles; games
  don't style for it.
  It should look real, not flat (user feedback, October 2026): the shelf is drawn in 3D (boards seen from the eye's
  height, walls going back, books as boxes with spines and page edges, other books standing with their spines out to
  fill it, some lying in stacks), still until tapped, and planned by `planShelf` (`shelfLayout.ts`) to fill the room on
  every screen. Every compartment holds something to tap – never a board only of filler books (users found it odd that
  nothing up there could be tapped): on wider screens the everyday helpers with the carved words stand up top, for the
  grown-ups, and the picture books side by side on the board below, where a child's eye finds them together, with warm
  light on the back panel behind what can be taken and the books only filling the shelf in its shadow (`BooksLight`,
  user decision, November 2026); each stands with clear room round it so it is seen whole and a finger finds one book, never its neighbour (`BOOK_GAP`, `shelfLayout.test.ts`).
  On each board the books stand together in the middle with just `BOOK_GAP` between them, and books spine out fill the
  ends up to them – never spread over a wide board with big empty room between them (on a big monitor they looked lost,
  user feedback, November 2026; `.shelf-row`, `endsFor`).
  The picture books are as big as the shelf allows (`TAKE_OUT`, little room above them, user feedback, October 2026) and
  show that they are there to be taken: they stand at the board's front edge, before the books spine out, their tops
  tipped forwards as a hand takes a book out, with a warm glow round the cover; a mouse over one tips it further out.
  A tap on a book takes it out (`takeOutBook`, `bookTravel.ts`): it comes off its board, into the middle, its cover swings open
  to the left, and its left page, the next menu printed on it, comes close until it is the screen – **no page turns on
  the way into a book**. Back to the shelf (`useTurnPage("/")` → `putBookBack`) is the same backwards: the book closes
  and goes back into its own gap (`shelfBookOf`, `bookTravel.test.ts`). The grown-ups' options on the shelf's page are
  things one finds on a bookshelf, standing in its own narrow compartments beside the books, never buttons and never
  loose around the room (`RoomOptions.tsx`, user feedback, October 2026), on a wide screen all in one column at the
  shelf's right, one compartment over the other (`SIDE_COLUMN`, user decision, November 2026): on top, in the tallest,
  the hourglass (play time, the most needed), below it a wooden loudspeaker (music, one tap), at the bottom a globe with
  the 🌐 lines and the language's name on its foot (the language – never a light switch); stickers of the fox girl and
  the bear boy (the figure) are stuck on the right wall of the big compartment on top, beside the everyday helpers,
  where they are seen better than in a narrow one (user feedback, November 2026; on an upright screen on the shelf's
  right inner side), and no books spine out stand against that wall to hide them. „Wer spielt?“ stands small on that same wall
  right above the first sticker's head, the fox's, in one line (`.shelf-figure-ask`, user feedback, November 2026:
  carved big into the back panel beside the wall it was too far from the stickers it asks about). The texts that stood below
  the shelf – what the app is (the page's words for search engines, `SeoWords`) and „Ein paar Worte von uns“
  (`ParentsNote`) – open together from „mehr …“ at the end of the carved words, where grown-ups already read (a little
  „i“ book in the shelf was replaced by it, user feedback, November 2026); their text stays in the page unseen while
  closed (`MenuButton keep`) so search engines read it (`RoomNotes`). Browsers show how to leave fullscreen over the
  middle of the screen's bottom (or top) edge for a while, again whenever fullscreen starts: so nothing to tap lies
  there (user feedback, November 2026). On a wide screen the shelf starts right under the fullscreen button's room and
  stands on four legs at its corners, two in front and two behind them, never one in the middle (`--legs`, user
  feedback, November 2026), leaving the bottom's middle to the floor, and the app's name is a painted sign hanging
  on its two little chains in front of the shelf, down into its top compartment (`SIGN_DIP`; standing on the floor at
  the bottom left it was taken out again, user feedback, November 2026): over the carved words, which begin below it
  and stand centred under it, moved right where it hangs right of their place (`ShelfLayout.wordsShift`),
  the plan keeping room for it there (`ShelfCell.trail`, `ShelfLayout.sign`), so it never covers a book to take nor the
  wall with the stickers, and the foxes on its o stay on the screen (`shelfLayout.test.ts`). On an upright screen it
  hangs above the shelf, never touching it. A new option becomes such a thing in the shelf too (`SHELF_THINGS`); their
  menus open outside the shelf's 3D (`MenuButton` portals them), since a transform would hold them in. The wall's picture (`bilder/buch-cover.webp`,
  only where there is room beside the shelf) shows one family of each mascot: a fox parent with a fox child and a bear parent
  with a bear child, one of the children a boy and one a girl – never a third grown-up or a child too many (user
  feedback, October 2026).
  Inside a book every change of page turns a page: a new menu link uses `useTurnPage(to, direction)`, a game starting or
  ending (or any other change of screen) goes through `turnPageWith(direction, update)` – forward the next page comes
  over from the right onto this one, back this one lifts at its outer edge, where the
  way back's corner is, and turns over to the right. Between two pages of one book further apart (a game's page back to
  the table of contents, or on to a later game) as many pages turn as lie between them (`pagesBetween`), **in one turn**,
  as a bundle taken at once: blank sheets fan out under the turning page (`.turn-sheet`), never one turn per page (user
  feedback, October 2026). The turning page is the app (`#root`, `view-transition-name: turn-page`, only while it turns),
  so the table lies still and the sheets can lie between it and the page beneath. A page takes its time to turn, as a grown-up turns it for a child (`TURN_SECONDS`, at least 1.5 s, its sound landing
  with it – `look.test.ts`): its corner lifts first, the page bends and catches the light, then darkens as it turns away,
  and its shadow slides across the page beneath with its edge; never a quick flick, never a stiff board. A lifted page
  must not swell past the screen (keep the eye far: `perspective(320vw)`), and its keyframes run `linear` – an easing
  restarts at every keyframe, so the page would stop and start.
  The fox and the bear family stand at the bottom of every menu's page (`BookFamilies`, in `Sky`), the foxes in the left
  corner and the bears in the right, seen whole on every screen: below 1400 × 640 the page keeps that room free under
  its cards (`--menu-floor`, read by `useFitGrid`, and the table of contents' `--toc-bottom`), and the world's things that
  stood there (barn, trees, blocks, toys) are left out; wider pages have them on the margins beside the cards. Never in
  the top row beside the title, where they were too small and in the way (user feedback, October 2026); the cards move
  up into the room the top row leaves. On a phone the sun, clouds and a room's window are left out too. A new kind of button gets its paper look in `book.css` with the others, never shiny plastic; a card is a picture taped onto the page without a ▶ on it (the whole card is tapped, so it is lower than its row), and the level row's choices are slips of paper lying askew, the chosen one yellow and taped down like a card (user feedback, October 2026). The fullscreen button and ⚙️ are
  small notes of plain paper with a paperclip over the edge they hang from – the page's top edge in a menu's top right
  corner, the picture's top edge while playing (user decision, October 2026: quieter than buttons or taped tabs, and
  findable on dark pictures). While playing, ⚙️'s note is the big one, its gear large and its name
  in words beside it, always shown („Einstellungen“, „halten“ under it) – on a phone clearly smaller, about as tall as ✕'s
  corner, so it doesn't cover the picture (user feedback, November 2026) – and as play starts it lights up softly twice,
  then stands still – never a glow that keeps going or comes back while playing (user feedback, November 2026: the small
  grey gear wasn't seen, and without words grown-ups didn't know it held the options; `look.test.ts`). A game with many
  ways to play behind it says so as play starts with `PlayOptions intro`: a note under ⚙️ for grown-ups, telling what can
  be chosen there, that fades by itself after a few seconds, goes once the options were opened and lets taps through
  (`PlayOptions.test.ts`). What is on – ⚙️ while its options are open or held, and the chosen choice inside the
  grown-ups' options (`.settings`) – is marked by a highlighter stroke drawn across it as it comes on
  (`book-highlight`), never by yellow paper and tape like the level row's chosen slip (user feedback, October 2026;
  `look.test.ts`); „zuletzt“ and „bald“ on a card are page markers of coloured film stuck on
  over its top edge; and the emoji of cards and the table of contents look printed into the paper (softer colours, the
  paper's grain over them, `book.css`). While playing, the ✕ is the page's corner. Pictures of the fox and the bear family reading with their
  children at the bottom of the menu's page (`BookFamilies`) show that the book is read together: never over a card or button. Nothing idles: the sky's clouds and rays stand still in the book.
  Fox and bear, the app's mascots, are never a lone animal but a grown-up with a child – Mama, Papa, Oma or Opa Fuchs
  or Bär with its child (user feedback, October 2026): the book is about grown-up and child experiencing it together,
  with the child at the centre. Wherever they turn up (a menu, a game, an idea in `d-book.ts` or `mascotStatus.ts`), the
  child does the thing (taps, brushes, blows, peeks out) and the grown-up is beside it, watching, helping, cheering; only
  a fox or bear in a role (the baker, the doctor) stands alone. The wall's picture keeps its two families (above).
- Each home category has a world of its own (`src/components/Worlds.tsx`): its page and its games' start screens show
  it behind the cards (`Sky` finds it from the address), its cards come in its family of colours (`data-world`), and its
  book's cover on the shelf shows a piece of it. A new category draws its world (`content.test.ts` checks).
  Every card has a `blurb`: one short line for grown-ups, shown only on tablets and computers with room for it; on a
  picture book's cover it lies low, as far from the picture as the title (it once touched the picture, user feedback,
  November 2026).
- A game still being built is marked `unfinished: true` in `CATEGORIES` (user decision, November 2026): it stands
  neither on the shelf nor in its book, its page carries `noindex` and stays out of the sitemap (its texts wait in
  `SEO_TEXTS`), and it is reached only from „🚧 In Arbeit“ on `/management/`, where its ✕ and „Menü“ lead back. Its
  rows in the tables (languages, mascots, voice) stay. Removing the mark publishes it; never hide a game by deleting its
  entry or route. `content.test.ts` checks it.
- A new game needs: folder, page, route in `App.tsx`, entry in `CATEGORIES`
  (`src/content/games.ts`, with its `blurb`), a row in `src/content/ideas/languageStatus.ts`, an entry in `src/content/seo.ts` and its English in `seo.en.ts` – use `/neues-spiel`.
- The app is called „Books for Both“ and lives at booksforboth.com (bought October 2026; toddlerfox.com and funforboth.com
  only redirect there; until then it was „The Tiny Taps“, whose `tinytaps.` storage keys stay so nothing saved is lost).
  The name is `SITE_NAME` in `seo.ts` and the same in every language; title, cover, manifest and `index.html` say it
  (`content.test.ts` checks). Its name and addresses never say „toddler“ or „baby“ (user decision, October 2026: offering screen games expressly for small
  children is delicate) – the age may stand in page texts, where parents search for it, never in a name.
  The title shows who „Both“ are (user feedback, October 2026): the o of „Both“ is a picture of Papa Fox
  sitting on the letter with his child on his lap, reading it a story, and a big and a small paw track run under the name
  up to them (`Logo`). The o itself is the title's real letter; the picture holds only the foxes (Gemini drew them on
  Georgia's bold o, which was then cut out) and lies over it so that Papa really sits on the letter – never floating above
  it (user feedback, October 2026, twice: look at the seat magnified, his thighs must lie on the letter's top stroke). The foxes are twice the letter's height, rising above the sign. The
  sign is big enough for them to be seen (`--sign`; `SIGN_SIZE` in `Bookshelf.tsx` in front of a wide shelf): at the
  sign's earlier size the foxes were a few pixels and nobody saw them (user feedback, October 2026).
- Search engines: every game, category and scene has a title, description and text in `src/content/seo.ts`
  and in English in `seo.en.ts` (the English pages are part of being found, A-22, so a new entry gets its English
  line in the same commit, unlike other translations; `content.test.ts` checks both). The build writes an own
  `index.html` per entry and language – German at `/zaehne/`, English at `/en/zaehne/`, joined by hreflang (GitHub
  Pages would answer with 404.html and status 404, which Google skips), plus `sitemap.xml`; the app keeps title
  and head in step (`useTitle`, `SeoHead`). Under `/en/` the router runs below the prefix (`routerBase()`,
  `src/lib/pageAddress.ts`), so links stay in English pages and routes need no change; players still get their
  browser's language. Texts say only what the page really does. No text names an age the app is for („ab 2“,
  „2- bis 3-Jährige“, „Ages 2+“; „Kleinkinder“, „toddlers“ are fine): each family decides when its child starts with
  screens, which „Ein paar Worte von uns“ on the home page (`ParentsNote`) tells: the real world first, then a screen together,
  later a learning game alone, plain watching least – Books for Both meant as that first step together (user
  decision, October 2026; `content.test.ts` checks). Google reads the page after the app ran, in an
  English browser: so search engines play in the language of the address (`isCrawler` in `src/lib/locale.ts`) –
  a crawler that runs pages and isn't on its list gets added there. The app replaces the built page's text when
  it starts, so every menu ends its `<main>` with `<SeoText />`, which shows that text below the first screen on a
  panel of its own (the home page behind the carving's „mehr …“ instead); a new menu page does the same. Pages that must stay out of results get a
  `noindex` tag (`NO_INDEX_PATHS`), never a `Disallow` in robots.txt, which hides the tag from Google. No
  `<meta name="keywords">` (ignored by Google, a spam hint for Bing): the searched words go into title, description and text. Heavy downloads (service worker copy,
  songs) start only after the page has loaded (`afterLoad` in `src/lib/pwa.ts`).
- Visits are counted only by Cloudflare Web Analytics (no cookies, no consent banner; the build adds it with the
  repository variable `CF_BEACON_TOKEN`, `tools/build.ts`): never add Google Analytics or another tracker that sets
  cookies or needs consent (user decision, October 2026; `tracking.test.ts` checks).
- Impressum and Datenschutz (`/impressum/`, `/datenschutz/`, `src/pages/LegalPage.tsx`, linked small in the bookshelf room's
  bottom right corner; who runs the site in `src/content/legal.ts`) stay true: a change that sends,
  stores or reads something new (a service, a tracker, camera, microphone, location) updates the Datenschutzerklärung
  and its `PRIVACY_UPDATED` in the same commit (`tracking.test.ts` checks the main ones). Both stay out of search results.
- A new Lebendige-Bilder picture: `/neue-szene`. A new Kleine-Abenteuer level: `/neues-abenteuer`. A generated picture: `/bild-erzeugen`
  – always as cheap as it can be (user decision, November 2026): every picture asked for goes into the queue
  (`src/content/pictureQueue.ts`, shown on `/management/` under „Offene Bilder“) and `bun run image queue` makes only
  what is already as cheap as it gets; a small picture whose shared sheet isn't full waits for later sessions, unless
  the user, asked in the session, says to make it now. Music from Suno: `/musik-erzeugen`; the Zähneputzen-Lied in a new language: `/zahnputzlied`.

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
