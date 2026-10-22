# The Tiny Taps

Simple keyboard and touch games for toddlers (2–3 years), German first.

## Development

```bash
yarn install
yarn dev           # http://localhost:3000 (Rsbuild dev server)
yarn typecheck
yarn build         # static site in out/
yarn preview       # serve the built site
```

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`
(repo settings → Pages → Source: **GitHub Actions**).

Use **yarn** (not npm); dependencies are locked in `yarn.lock`.

## Structure

| Path | What |
| --- | --- |
| `rsbuild.config.ts`, `index.html` | Build setup (Rsbuild, single-page app; `404.html` fallback for GitHub Pages deep links; writes `sw.js` with the list of all built files) |
| `src/sw.js`, `src/lib/pwa.ts`, `public/manifest.webmanifest` | Offline and installable (PWA): the service worker keeps every file in the browser and starts the app from there; registration, the install button and the offline note on the home page (`src/components/InstallHint.tsx`) |
| `public/icons/` | App icon: `icon.svg` (rounded) and `icon-maskable.svg` (full bleed, for home screens); the PNGs are made from them, see [App icon](#app-icon) |
| `src/App.tsx` | Routes (React Router) |
| `src/pages/` | One component per page |
| `src/components/GameShell.tsx` | Shared shell: parent start screen, fullscreen + keyboard lock, hold-to-exit |
| `src/components/Bursts.tsx` | Colourful shapes for "any other key" and taps |
| `src/components/TouchKeyboard.tsx` | Big on-screen letter keys for tablets (letters and words games) |
| `src/components/Sky.tsx`, `Logo.tsx` | Menu look: sky backdrop and the bouncy logo; colours and buttons in `src/globals.css` |
| `src/content/de.ts` | German words, pictures, number words – edit here to change content |
| `src/content/en.ts`, `tr.ts`, `pl.ts` | English, Turkish and Polish for the letters and words games, chosen under „Sprache“ on their start screens (`src/content/languages.ts`, `src/components/LanguageSetting.tsx`). An optional second language shows and says every word in it too („Bär – bear“); words are matched by their emoji (`src/content/translate.ts`), and `moreWords` names pictures that only other languages have. The other games are German only |
| `src/games/letters/` | Game "Buchstaben & Zahlen": free typing (numbers optionally counted by tapping each thing), "Wo ist das B?" (find the key for a shown letter, `FindPlay.tsx`) or the Buchstaben-Zug (keys become wagons, `TrainPlay.tsx`) |
| `src/games/scenes/` | Game "Lebendige Bilder": scene engine (explore with chain reactions and "alles entdeckt" party, find, sound riddle, trait questions in `quests.ts`, colouring in; tap, hover / swipe or keys with arrow-key frame in `focus.ts`) and the scenes `baustelle/`, `stadt/`, `bauernhof/`, `hof/`, `zoo/`, `unterwasser/`, `badezimmer/`, `wald/`, `feuerwache/`, `weltall/`; shared depth helpers, drawing helpers and sky in `layout.ts`, `shared.tsx`, `sky.tsx` |
| `src/games/animals/` | Game "Was gehört zum Tier?": drag (or tap) the food to the hungry animal, or the animal into its home; the homes are drawn in `homes.tsx`, animals, foods and sentences are in `content.ts` |
| `src/games/shadows/` | Game "Schatten finden": a picture looks for its shadow among 2–4 black ones (the same emoji with `filter: brightness(0)`); tap the right shadow or drag the picture onto it, or choose with arrow keys + Enter / 1–4. A wrong shadow shows its colours for a moment ("Das ist die Giraffe."). Pictures and texts in `content.ts`, by theme (Tiere, Fahrzeuge, Essen, Dinge) |
| `src/games/words/` | Game "Wörter tippen": whole word, first letter only, colour words, doing words (all from `de.ts`) |
| `src/games/teeth/` | Game "Zähne putzen": brushing timer (1–3 minutes) in seven steps in KAI order (chewing surfaces, outside, inside). It starts at the sink (`prep.tsx`, can be turned off): a hand takes the brush out of its cup, the tube puts a blob of toothpaste on it. A small 3D mouth model (`jaw.ts`) shows each step from the right angle – mouth open or teeth together, head turned to the side, the jaw being brushed tipped to show its top or tongue side. Arrows on the lips show when to open or close the mouth. The brush is a small 3D model too (`brush.tsx`), held as dentists teach it for each side (flat on the chewing surfaces, in the cheek pocket with the handle out of the corner of the mouth, tipped towards the gum inside) and glides along the row scrubbing, circling or wiping from gum to tooth. Sugar monsters sit on every tooth not brushed yet; the ones to brush now glow, and each vanishes as the brush reaches it. Music and spoken hints, no tapping needed, keeps the screen on; arrow keys skip steps, Space pauses |
| `src/games/loud/` | Game "Laut und leise" (idea N-29): the microphone only measures how loud it is (`mic.ts`, nothing is recorded) – shouting makes the lion roar and jump, a quiet voice makes the mouse squeak (`animals.tsx`); a ladder in the middle shows the loudness. The room's own noise is learned as it plays; the microphone is deaf while the animals make sounds or talk, so they don't answer themselves. Parents allow the microphone and try it out on the start screen and choose how loud the lion needs it; tapping the animals works too |
| `src/games/feelings/` | Game "Gefühle": comfort the bear (`bear.ts`, `BearPlay.tsx`) and kindergarten stories – pushed, kicked, toy taken, slide full, wanting a toy, angry yourself (`kita.ts`, `KitaPlay.tsx`); the animals in `Critter.tsx`, backgrounds in `places.tsx`; every choice is a picture card (`picture` in the content, drawn by `ChoiceCard` in `shared.tsx`) with a green tick or red cross, so children can choose without reading; illustrations dropped into `bilder/` replace the drawn pictures (file names and image prompts in `bilder/README.md`) |
| `src/games/marbles/` | Game "Kugelbahn": two levels in turn. The marble run (`TrackLevel.tsx`, route and layout in `track.ts`): every tap or key lets a marble out of the hopper; it rolls downhill over a xylophone, rings the bell, circles the funnel, rides the paddle wheel and the seesaw, goes through the tunnel into the basket – a full basket ends the level. "Alles fällt um" (`ToppleLevel.tsx`): everyday things (`things.tsx`) stand small to tall and topple onto each other like dominoes until the drum; each round picks other things |
| `src/games/adventure/` | Game "Bewegungsabenteuer": a 3D movement story (three.js, loaded only on this page). The fox Tapsi shows each movement, the child does it along in front of the screen, and the world answers on its own time – there is no camera and no text, Tapsi says everything. The movement library (`library/`: categories, 94 movements, worlds, scenarios, sequences, quality notes in `library/README.md`) is kept apart from the 3D story (`stories/treasureIsland.ts`, „Die Schatzinsel“, about 4 minutes): it opens with a red dotted trail drawing the way to the chest like on a treasure map, and at every station Tapsi first shows the movement alone, then the child joins in. While a movement is shown and done, the camera looks at Tapsi from the front, big in the middle of the picture (paddling from behind, as if sitting in the canoe too). The fox is a posable rig (`three/guide.ts`) with one motion clip per movement (`three/clips.ts`); `three/player.ts` plays a story on a clock (arrow keys skip, Space pauses), `three/stage.ts` has renderer, sky, light and water. The fox has a thin ink outline, and the parts that move right now (arms, legs, body) get a wide glowing one during a movement (`three/contour.ts`, inverted hulls). A glowing child outline like in "Just Dance" (`three/silhouette.ts`) shows the movement too, for now only when waving. In development `__adventure.seek(seconds)` in the console jumps to a moment |
| `src/lib/` | Speech (Web Speech API), synthesized sounds, settings storage, PWA |
| `src/lib/sounds/` | Real recordings (CC0, from Freesound; sources in its `README.md`) for animals, bells, water, horn …, one MP3 per sound name. So far only "Lebendige Bilder" and "Buchstaben & Zahlen" use them (`playRecorded` / `recorded` in `src/lib/sfx.ts`); until a file is loaded, and in all other games, the synthesized sound plays |
| `src/content/ideas.ts` | Idea collection with fixed IDs (e.g. `N-03`), shown on the hidden page `/ideen/` – hold the „p“ in the home page title for 2 seconds |

To add a scene to "Lebendige Bilder", create a folder like `src/games/scenes/baustelle/`
with the drawing (SVG in React, one component per tappable item), its texts and a
CSS file for the tap animations, then add it to `SCENES` in `src/games/scenes/index.ts`.
The full guide (depth, keys, drawing style, checks) is the Claude Code skill
[`.claude/skills/neue-szene/SKILL.md`](.claude/skills/neue-szene/SKILL.md) – run it with `/neue-szene`.

Defaults: speech is off (except in "Zähne putzen", where the spoken hints are the point) and the picture only moves when someone taps, hovers or
presses a key. Parents can turn on speech, idle movement and the keys mode
("Jedes Ding hat eine Taste") on the start screen.

## Tablets

All games work by touch. The letters and words games show big letter keys on
the screen on touch-only devices (tablets, phones); parents can switch them to
"Immer" or "Nie" on the start screen.

The start screens only offer what fits the device (`src/lib/device.ts`): on
tablets and phones (every pointer is a finger) the keys mode of "Lebendige
Bilder" and the keyboard hints (Esc, arrow keys) are hidden, and a saved keys
mode falls back to tapping; on computers without a touch screen the on-screen
keys option is hidden and the keys stay off. On a phone held upright the
pictures show a "Quer halten" note, since the wide picture gets tiny. On iPad the games go fullscreen; on
iPhone (no fullscreen in Safari) add the page to the home screen to hide the
browser bars.

## Offline and as an app

After the first visit every file of the site is kept in the browser (service
worker, `src/sw.js`), so the games start without network – in the plane or
without WLAN – and straight away. The home page shows „Funktioniert auch ohne
Internet“ once that is done, and an „Als App installieren“ button in Chrome /
Edge / Android (on iPhone and iPad: Safari → Teilen → „Zum Home-Bildschirm“).

A new version is downloaded in the background and used from the next start;
a game that is open keeps running on the old one. Speech offline uses only the
voices on the device (the online „Google“ voices need network). The service
worker only runs in the built site; to try it locally use the `preview-pages`
launch config (`PUBLIC_BASE_PATH=/thetinytaps`, port 3200) – `yarn dev` removes
it again.

### App icon

Edit `public/icons/icon.svg` / `icon-maskable.svg` (same picture; the maskable
one is full bleed with the art inside the middle circle), then:

```bash
cd public/icons
rsvg-convert -w 192 icon.svg -o icon-192.png
rsvg-convert -w 512 icon.svg -o icon-512.png
rsvg-convert -w 512 icon-maskable.svg -o maskable-512.png
rsvg-convert -w 180 icon-maskable.svg -o apple-touch-icon.png
```

To add a picture that has no emoji, put an SVG in `public/images/` and set
`image` on the word (see Xylophon).

## Leaving the game

Hold **Esc** or the ✕ button (top right) for 1 second; the start screen of
every game explains this before it starts. In Chrome/Edge the
keyboard is locked in fullscreen, so shortcuts like Cmd+W are captured;
Cmd+Q / Cmd+Tab can't be blocked by any website.

## Roadmap

1. ~~Buchstaben & Zahlen (MVP)~~
2. ~~Options: themes (Tiere, Fahrzeuge, Essen), announcement style, calm mode, uninterrupted counting~~
3. Own illustrations and recorded voice (incl. letter sounds „b“ instead of „Be“), ~~offline (PWA)~~
4. ~~Wörter tippen~~
5. ~~Lebendige Bilder: Wimmelbild Baustelle, Stadt, Bauernhof, Hof am Teich, Zoo, Unterwasser, Badezimmer, Wald, Feuerwache, Weltall~~ – next: Gute-Nacht-Zimmer
6. ~~Was gehört zum Tier? (Tiere füttern, Wer wohnt wo?)~~
7. ~~Gefühle: Bär trösten, Kindergarten-Geschichten~~
8. ~~Schatten finden~~
9. ~~Laut und leise (Mikrofon)~~
10. ~~Kugelbahn: Kugelbahn und „Alles fällt um“~~
