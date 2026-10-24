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
| `src/components/GameShell.tsx` | Shared shell: parent start screen with a big card per way to play (mode or level; a tap picks it and starts) and the game's own options folded away, fullscreen + keyboard lock, the ✕ in the corner (a click leaves after half a second, „Zurück zum Menü“ shows next to it for a moment; Esc has to be held) |
| `src/components/HomeOptions.tsx`, `src/lib/common.ts`, `src/lib/playtime.ts` | On the home page, for all games: the play time per day (every minute in any game counts, kept in localStorage per day; the last minute winds down, then „Gute Nacht“), and folded away language, read aloud, sounds and calm mode. Games read their own settings through `useGameSettings`, which fills in the shared ones |
| `src/components/Bursts.tsx` | Colourful shapes for "any other key" and taps |
| `src/components/TouchKeyboard.tsx` | Big on-screen letter keys for tablets (letters and words games) |
| `src/components/Sky.tsx`, `Logo.tsx` | Menu look: sky backdrop and the bouncy logo; colours and buttons in `src/globals.css` |
| `src/content/de.ts` | German words, pictures, number words – edit here to change content |
| `src/content/en.ts`, `tr.ts`, `pl.ts` | English, Turkish and Polish for the letters and words games, chosen under „Sprache“ on the home page (`src/content/languages.ts`, `src/components/LanguageSetting.tsx`). An optional second language shows and says every word in it too („Bär – bear“); words are matched by their emoji (`src/content/translate.ts`), and `moreWords` names pictures that only other languages have. The other games are German only |
| `src/games/letters/` | Game "Buchstaben & Zahlen": free typing (numbers optionally counted by tapping each thing), "Wo ist das B?" (find the key for a shown letter, `FindPlay.tsx`) or the Buchstaben-Zug (keys become wagons, `TrainPlay.tsx`) |
| `src/games/scenes/` | Game "Lebendige Bilder": scene engine (explore with chain reactions and "alles entdeckt" party, find, sound riddle, trait questions in `quests.ts`, colouring in; tap, hover / swipe or keys with arrow-key frame in `focus.ts`; vehicles that drive into another picture in `roads.ts` – every second tap sends the fire engine, the tractor, the bus or the dump truck off, a sign at the edge follows it, and in the other picture the same drawing drives in and parks as a guest) and the scenes `baustelle/`, `stadt/`, `bauernhof/`, `hof/`, `zoo/`, `unterwasser/`, `badezimmer/`, `wald/`, `feuerwache/`, `weltall/`, `spielplatz/`, `kueche/`, `supermarkt/`, `flughafen/`, `winterbaustelle/` (reuses the Baustelle drawings with snow on top), `kita/`, `kinderarzt/`, `strand/`, `dinotal/`, `gutenacht/` (bedtime picture: `bedtime` on the scene makes every tapped thing fall asleep, and when all sleep the room goes dark instead of the party), and the season pictures `winter/`, `herbst/`, `ostern/`; hidden surprises in `hideout.tsx` (an item with `hideout` draws a `<Hideout>` behind its door, lid or sand pile, and on every tap another animal or present peeks out); shared depth helpers (`onFloor` for rooms), drawing helpers and sky in `layout.ts`, `shared.tsx`, `sky.tsx`; leaves and snow on the ground and in the air for outdoor pictures in `weather.tsx` |
| `src/games/animals/` | Game "Was gehört zum Tier?": drag (or tap) the food to the hungry animal, or the animal into its home; the homes are drawn in `homes.tsx`, animals, foods and sentences are in `content.ts` |
| `src/games/shadows/` | Game "Schatten finden": a picture looks for its shadow among 2–4 black ones (the same emoji with `filter: brightness(0)`); tap the right shadow or drag the picture onto it, or choose with arrow keys + Enter / 1–4. A wrong shadow shows its colours for a moment ("Das ist die Giraffe."). Pictures and texts in `content.ts`, by theme (Tiere, Fahrzeuge, Essen, Dinge). The mode „Wer schaut da raus?“ (idea X-04, `PeekPlay.tsx`): only a part of an animal peeks out of a bush (top, left or right) or the pond (`hideouts.tsx`), the child taps the whole animal among 2–4 below, and it comes out; tapping the bush rustles it and the animal makes its noise. The emoji is drawn on a canvas and cut to its outline (`glyph.ts`), so the part that shows is the same on every system |
| `src/games/words/` | Game "Wörter tippen": whole word, first letter only, colour words, doing words (all from `de.ts`) |
| `src/games/teeth/` | Game "Zähne putzen": brushing timer (1–3 minutes) in seven steps in KAI order (chewing surfaces, outside, inside). It starts at the sink (`prep.tsx`, can be turned off): a hand takes the brush out of its cup, the tube puts a blob of toothpaste on it. A small 3D mouth model (`jaw.ts`) shows each step from the right angle – mouth open or teeth together, head turned to the side, the jaw being brushed tipped to show its top or tongue side. Arrows on the lips show when to open or close the mouth. The brush is a small 3D model too (`brush.tsx`), held as dentists teach it for each side (flat on the chewing surfaces, in the cheek pocket with the handle out of the corner of the mouth, tipped towards the gum inside) and glides along the row scrubbing, circling or wiping from gum to tooth. Sugar monsters sit on every tooth not brushed yet; the ones to brush now glow, and each vanishes as the brush reaches it. Music and spoken hints, no tapping needed, keeps the screen on; arrow keys skip steps, Space pauses |
| `src/games/loud/` | Game "Laut und leise" (idea N-29): the microphone only measures how loud it is (`mic.ts`, nothing is recorded) – shouting makes the lion roar and jump, a quiet voice makes the mouse squeak (`animals.tsx`); a ladder in the middle shows the loudness. The room's own noise is learned as it plays; the microphone is deaf while the animals make sounds or talk, so they don't answer themselves. Parents allow the microphone and try it out on the start screen and choose how loud the lion needs it; tapping the animals works too. Second level "Pusten" (idea X-06, `BlowPlay.tsx`, pictures in `stations.tsx`): blowing (or a loud voice) is turned into a wind of 0–1 that blows out birthday candles, sends dandelion seeds flying, turns a pinwheel until the rainbow is complete and sails the mouse's boat to the lion; a tap is a gust, holding the finger keeps blowing. `LoudPlay.tsx` plays the levels in turn and keeps the microphone on between them |
| `src/games/feelings/` | Game "Gefühle": comfort the bear (`bear.ts`, `BearPlay.tsx`) and kindergarten stories – pushed, kicked, toy taken, slide full, wanting a toy, angry yourself (`kita.ts`, `KitaPlay.tsx`); the animals in `Critter.tsx`, backgrounds in `places.tsx`; every choice is a picture card (`picture` in the content, drawn by `ChoiceCard` in `shared.tsx`) with a green tick or red cross, so children can choose without reading; illustrations dropped into `bilder/` replace the drawn pictures (file names and image prompts in `bilder/README.md`) |
| `src/games/marbles/` | Game "Kugelbahn": eight levels in turn (or only the machines, or one of them). The marble run (`TrackLevel.tsx`, route and layout in `track.ts`): every tap or key lets a marble out of the hopper; it rolls downhill over a xylophone, rings the bell, circles the funnel, rides the paddle wheel and the seesaw, goes through the tunnel into the basket – a full basket ends the level. "Alles fällt um" (`ToppleLevel.tsx`): everyday things (`things.tsx`) stand small to tall and topple onto each other like dominoes until the drum; each round picks other things. "Große Maschine" (`MachineLevel.tsx`, layout and timing in `machine.ts`): a Rube Goldberg machine through a 6900 px long playroom – one tap, and for about 30 seconds one thing sets off the next (marble, xylophone, bell, funnel, ten dominoes, a toy car through a loop onto a seesaw catapult, a beach ball down block stairs into a bucket, which pulls up a gate for the train, which presses the button for the jack-in-the-box); the camera follows whatever moves. Everything is a function of the seconds since the tap; in development `__machine.seek(seconds)` in the console jumps to a moment. Five more Rube Goldberg machines run the same way, each with its own world and no element repeated from another: „Verrückte Küche" (`kitchen.ts`, `KitchenLevel.tsx`), „Im Garten" (`garden.ts`), „Baustelle" (`building.ts`), „Zirkus" (`circus.ts`), „Raketenstart" (`space.ts`). They share the helpers in `machineKit.ts` (paths, rolling, hops, timeline, camera), the stage in `MachineStage.tsx` (clock, sounds, camera, tap) and wall pictures in `scenery.tsx`; in development `?level=garden` in the address opens one level directly |
| `src/games/elevator/` | Game "Aufzug" (idea N-37): picture stories of about two minutes in a house in cross-section with four floors and a lift. A thought bubble above the child shows what it needs next (the same drawing as the thing in the room), and the child rides the lift to that floor – big buttons 1–4 beside the house, a tap on the room, or the number keys and arrows. A wrong floor: the child looks out, shakes its head and the right room starts to glow; after a while without a tap the bubble pops up again and the room glows too. Three stories, picked on the start screen and again on picture cards at the end (`content.ts`): „Pfannkuchen“ (hungry: fridge in the cellar, pancakes in the kitchen, fetch the little brother, his juice, eat together on the roof terrace), „Gute Nacht“ (bath, warm milk, brushing teeth, teddy, bed – the house goes dark) and „Pfützen“ (rain: boots, raincoat, umbrella, paper boat, jump in the garden puddles until the rainbow comes). The children with their poses and clothes and the thought bubble are in `kid.tsx`, the things in `things.tsx`, the ten rooms in `rooms.tsx`, house, lift and buttons in `house.tsx`, sizes in `layout.ts`; the story runs as a script of waits in `ElevatorPlay.tsx`. All drawn in SVG, no emojis, nothing to read |
| `src/games/adventure/` | Game "Bewegungsabenteuer": a 3D movement story (three.js, loaded only on this page). The fox Tapsi shows each movement, the child does it along in front of the screen, and the world answers on its own time – there is no camera and no text, Tapsi says everything. The movement library (`library/`: categories, 100 movements, worlds, scenarios, sequences, quality notes in `library/README.md`) is kept apart from the 3D story (`stories/treasureIsland.ts`, „Die Schatzinsel“, about 5 minutes): it opens with a red dotted trail drawing the way to the chest like on a treasure map, and at every station Tapsi first shows the movement alone, then the child joins in. Tapsi always faces the island and the camera looks from behind, so the child sees what Tapsi sees and left is left; where arms in front of the body would be hidden (rope, flowers) it moves round to the side and up; it opens on Tapsi's face for the hello and films the stone jumps from the side like a jump-and-run. Every movement does something to a thing in front of Tapsi: waving to Kiki, the paddle, scorpions, stones and star boxes to bump with the head, the branch, flowers, coconuts, the riddle door, cobwebs, the rope, the chest, the crabs. The beach party at the end is a stop dance: when the music stops, Tapsi, Kiki and the crabs freeze, for pauses of different length (`STOP_DANCE` in `three/clips.ts`). The fox is a posable rig (`three/guide.ts`) with one motion clip per movement (`three/clips.ts`); `three/player.ts` plays a story on a clock (arrow keys skip, Space pauses), `three/stage.ts` has renderer, sky, light and water. The fox has a thin ink outline, and only the body part a movement is about (e.g. the arms at the crank) gets a wide glowing one while it moves (`three/contour.ts`, inverted hulls). A dark child figure with a glowing rim like in "Just Dance" (`three/silhouette.ts`) shows every movement too, seen from the same side as the camera sees the fox. In development `__adventure.seek(seconds)` in the console jumps to a moment |
| `src/lib/` | Speech (Web Speech API), synthesized sounds, settings storage, PWA |
| `src/lib/sounds/` | Real recordings (CC0, from Freesound; sources in its `README.md`) for animals, bells, water, horn …, one MP3 per sound name. So far only "Lebendige Bilder", "Buchstaben & Zahlen" and "Aufzug" use them (`playRecorded` / `recorded` in `src/lib/sfx.ts`); until a file is loaded, and in all other games, the synthesized sound plays |
| `scripts/gemini-image.mjs` | `yarn image <out.webp> "<prompt>"`: makes a picture with Gemini (needs `GEMINI_API_KEY` in your shell), optionally cut out (`--transparent`), sized and saved as WebP; the raw result stays in `.image-raw/`. Guide: the Claude Code skill [`.claude/skills/bild-erzeugen/SKILL.md`](.claude/skills/bild-erzeugen/SKILL.md) (`/bild-erzeugen`) |
| `src/content/ideas.ts` | Idea collection with fixed IDs (e.g. `N-03`), shown on the hidden page `/ideen/` – hold the „p“ in the home page title for 2 seconds |

To add a scene to "Lebendige Bilder", create a folder like `src/games/scenes/baustelle/`
with the drawing (SVG in React, one component per tappable item), its texts and a
CSS file for the tap animations, then add it to `SCENES` in `src/games/scenes/index.ts`.
The full guide (depth, keys, drawing style, checks) is the Claude Code skill
[`.claude/skills/neue-szene/SKILL.md`](.claude/skills/neue-szene/SKILL.md) – run it with `/neue-szene`.

Defaults: speech is off (except in "Zähne putzen", where the spoken hints are the point and have their own switch) and the picture only moves when someone taps, hovers or
presses a key. Parents turn on speech for all games on the home page, and idle movement and the keys mode
("Jedes Ding hat eine Taste") on the start screen of "Lebendige Bilder".

## Tablets

All games work by touch. The letters and words games show big letter keys on
the screen on touch-only devices (tablets, phones); "Frei tippen" in
Buchstaben & Zahlen shows them on every touch screen, also on a touch laptop or
an iPad with keyboard. Parents can switch them to "Immer" or "Nie" on the start
screen.

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
5. ~~Lebendige Bilder: Wimmelbild Baustelle, Stadt, Bauernhof, Hof am Teich, Zoo, Unterwasser, Badezimmer, Wald, Feuerwache, Weltall, Spielplatz, Küche, Supermarkt, Flughafen & Bahnhof, Winter-Baustelle, Kita, Kinderarzt, Strand, Dinotal, Gute-Nacht-Zimmer, Winter, Herbst, Ostern; hidden surprises behind doors, lids and in the sand; silent until tapped~~
6. ~~Was gehört zum Tier? (Tiere füttern, Wer wohnt wo?)~~
7. ~~Gefühle: Bär trösten, Kindergarten-Geschichten~~
8. ~~Schatten finden~~
9. ~~Laut und leise (Mikrofon): Löwe und Maus, Pusten~~
10. ~~Kugelbahn: Kugelbahn und „Alles fällt um“~~
11. ~~Aufzug~~
