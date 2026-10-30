# Lebendige Bilder

Routes `/bilder/` (menu) and `/bilder/<id>/`. The menu has the mode as a choice row above the pictures
(`mode` in `settings.ts`), and a tap on a picture plays it at once in that mode: a picture has no start screen,
no „Über das Spiel“ and no „Einstellungen“ (`GameShell` with `startMode` and `leaveTo`), and ✕, Esc and „Menü“ go
back to `/bilder/`.

Scene engine (modes in menu order: "Freies Entdecken" first and the default, see below; colouring in – a tapped item gets its colour back, and every tap paints a big round dab of colour into the grey background, so the parts that never move can be painted too; Space paints a random spot of the background where nothing happens (Enter still starts the item in the frame), shown as a small wide key at the bottom in the middle while the key badges are on; find with only the item, glowing, in the bubble; trait questions in `quests.ts` (colours also count for a part, `colourParts.ts`); "Taschenlampe" in `torch.tsx` (idea B-17: the picture lies under a night layer, an HTML div above the svg whose radial gradient leaves a round light where the mouse hovers, a finger slides or taps and the arrow keys push it; any other key takes the light to some item; no key badges and no ⌨️ there; what comes into the light wakes up – moves, sounds, speaks and is counted – and at the party the night fades away, while a bedtime picture stays dark; a tap still starts the tapped item itself); "Straße malen" (see below); "Freies Entdecken" with chain reactions and "alles entdeckt" party; tap, or keys with arrow-key frame in `focus.ts` (keys mode is on wherever there is a keyboard, with the key
badges in the picture; ⌨️ in the bottom left corner switches it off and on, kept for the next pictures); vehicles that drive into another picture in `roads.ts` – every second tap sends the fire engine, the tractor, the bus or the dump truck off, a sign at the edge follows it, and in the other picture the same drawing drives in and parks as a guest) and the scenes `baustelle/`, `stadt/`, `bauernhof/`, `hof/`, `zoo/`, `unterwasser/`, `badezimmer/`, `wald/`, `feuerwache/`, `weltall/`, `spielplatz/`, `kueche/`, `supermarkt/`, `flughafen/`, `winterbaustelle/` (reuses the Baustelle drawings with snow on top), `kita/`, `kinderarzt/`, `strand/`, `dinotal/`, `gutenacht/` (bedtime picture: `bedtime` on the scene makes every tapped thing fall asleep, and when all sleep the room goes dark instead of the party), and the season pictures `winter/`, `herbst/`, `ostern/`; every tap on the background brings something to life in `spots.tsx` (a thing of the background wrapped in `<Poke>` sways, wobbles, hops or glows; anywhere else the scene's `spots` say what comes out there – a gust of wind in the sky that bends the trees and blows the clouds along, a beetle crawling out of the floor tiles, a spider on the wall, a flower and butterfly from the meadow, a fish jumping out of the water; no speech, so nothing to translate); hidden surprises in `hideout.tsx` (an item with `hideout` draws a `<Hideout>` behind its door, lid or sand pile, and on every tap another animal or present peeks out); shared depth helpers (`onFloor` for rooms), drawing helpers and sky in `layout.ts`, `shared.tsx`, `sky.tsx`; leaves and snow on the ground and in the air for outdoor pictures in `weather.tsx`.

## Straße malen (idea N-43)

Mode `road`, „🛣️ Straßen“ in the row. A line drawn with a finger or the mouse becomes a road, and a car, a tractor or a
steam engine drives exactly along it, through bends and loops; at its end it honks, hops and waits. What it drives past
wakes up like in the torch's light (moves, sounds, speaks, is counted), so the picture ends with the usual party.
- `lanes.ts`: the numbers and geometry (points, pose along the road, the smooth path, the vehicle's turn and mirror so it
  never drives upside down, the bend a key draws); `lanes.test.ts` checks them. `LaneLayer.tsx`: the roads, the three
  vehicles, the pointer handling and the frame loop; `lanes.css` (classes `lane-`).
- The layer is an HTML div of its own above the picture's svg (same viewBox), so a moving vehicle never repaints the
  picture. It reads pointers on the picture without stopping them: a tap still does what it does in „Freies Entdecken“,
  and only a line longer than `MIN_LANE` becomes a road (it appears once that long, and its vehicle follows the finger).
- Each kind has its own road: the car asphalt with a dashed line, the tractor a dirt track, the train rails on sleepers.
  A road begun near a waiting vehicle is that vehicle's next one; elsewhere the next kind in turn comes, and with all
  three out, the one that has had its road longest jumps to it. At most `MAX_LANES` roads stay.
- A tap on a waiting vehicle honks. Keys work as in „Freies Entdecken“ and also draw a road from the last waiting vehicle
  (or the bottom middle) to the key's item (`LaneControl.driveTo`).
- Everything is still once the vehicles wait: wheels turn only while driving, and the frame loop stops.
- Its prompt (`roadPrompts` in `phrases.ts`) is German only; other languages show the usual prompt.

## Working on scenes

- New picture or many new items: run `/neue-szene` (`.claude/skills/neue-szene/SKILL.md`); it has the full
  guide to depth, keys, drawing style, animations and the browser checks.
- `scenes.test.ts` checks every picture's data (unique ids, articles, tap sizes, chains, keys,
  plural grammar in questions, roads). `bun test` after every change to items.
- The mode labels for the row on `/bilder/` are `SCENE_MODES` in `settings.ts`, so their languages count for this game in
  `languageStatus.ts`; a new mode comes with its label in German only and a part marking the gap there. Keep labels
  short: all modes must fit in one row on a phone on its side (844 × 390), or the row wraps and pushes the pictures down
  („Straße malen“ is „🛣️ Straßen“ there for this). Check the row there after adding a mode.
- `ScenePlay.tsx` is the engine and is shared by every picture (sounds in `sounds.ts`, the marks drawn over a picture in `marks.tsx`): keep scene-specific things in the
  scene's folder and its CSS, and prefix CSS classes and SVG ids by the scene (CSS is global).
- Music is the background song of all games (`src/lib/backgroundMusic.ts`, played once for the whole app by
  `BackgroundMusic`, switched on the home page), so it goes on when the child follows a vehicle into another picture.
  Not in Gute Nacht (`bedtime`, `useNoBackgroundMusic`), which could get a lullaby of its own.

## Languages (German, Russian, English, Chinese, Hindi, Spanish, Arabic)

The pictures speak the app language (chosen on the home page, `src/lib/language.ts`). Rules:
- An item's words live in two places: German in the scene's item (`name`, `sentences`, chains), every other
  language in the scene folder's `ru.ts`, `en.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts` (`SceneTranslation`: title,
  description, items by id with name, sentences, `gender`/`plural`, chain sentences in order), listed in
  `src/content/texts/texts-<lang>.ts` (loaded with the app language, `translations.ts` fills `SCENE_TRANSLATIONS`). New items and sentences come in German only until the user asks for a language; when a German
  line's meaning changes, delete its translations. A picture plays in a language only when its translation covers
  every item and chain step, otherwise entirely in German, voice and keys included (`sceneLanguage` in
  `localize.ts`), never mixed; mark such a gap in `src/content/ideas/languageStatus.ts`.
- The grammar contract of a translated name (`scenes.test.ts` checks it, and that ru/zh/hi/ar lines have no Latin letters):
  - ru: no article; `gender` ("m"/"f"/"n") or `plural`, never both.
  - en: no article, lower case (a proper name, every word in capitals – Santa Claus –, gets no „the“); `plural` where plural; no gender.
  - zh: bare noun, no measure word; neither gender nor plural.
  - es: no article; always `gender` "m"/"f", plurals too (`plural`). The engine adds el/la/los/las (el agua).
  - hi: always `gender` "m"/"f", plurals too. The name never stands before a postposition (के, में, से) in
    `phrases.ts`, since that would change its form (घोड़ा → घोड़े).
  - ar: with its article ال (on the second word of a construct: سيارة الإطفاء); always `gender`, plurals too: a plural
    of things or animals is "f" (it takes feminine singular agreement), a plural of people "m" (masculine plural).
- Grammar follows the translation, never the German: an item can be plural in a translation and not in German
  (санки, часы) and the other way round. `localize.ts` (`localizeScene`, `localizeItem`) gives ScenePlay,
  the menu and guests from other pictures the scene in the app language, German where the translation is missing or incomplete.
- Every sentence the engine builds itself (prompts, praise, party, find and trait questions, wrong taps,
  vehicles driving between pictures, labels) is in `phrases.ts`, one block per language; never put a
  German sentence into `ScenePlay.tsx` or `quests.ts`. Adjectives and verbs agree with the item's gender/plural
  (Russian `agree`, `esAgree`, `hiAgree`, `arAgree`); nothing said to the child depends on it being a boy or a girl
  (Arabic says „let's“, هيّا, instead of an imperative). Start-screen texts are inline with `t({ de, ru, en, … })` in
  `ScenesGame.tsx`; the surprises in a hideout have `found` in every language.
- Speech uses the scene language's `speechLang`. Keys mode (`keys.ts`): an item wants the first letter of its whole
  translated name (put the noun first in a translation where you can), typed at its place on any keyboard
  (`pressedKey`), so a German keyboard types every language. Russian: the Cyrillic letters (`RUSSIAN_SCENE_KEYS`,
  `cyrillicLetterOf`). Hindi: the InScript letters without Shift (`HINDI_SCENE_KEYS`, `devanagariLetterOf`); a
  letter on Shift (ख, घ, भ) counts as the letter on the same key without it, so a toddler never needs Shift.
  Arabic: the 28 letters (`ARABIC_SCENE_KEYS`, `arabicLetterOf`), the first letter after ال, forms as their letter
  (أ → ا). English and Spanish: Latin keys, accents dropped (ñ → N). Chinese: the German keys, by the German name.
  The Latin `key` wishes count only in German and Chinese.

## Rules

- No options for grown-ups on a picture: what the start screen once offered (counting with a party, vehicles
  driving into other pictures, hints in Fragen, the picture moving by itself, how the picture is set off, what
  is said) is fixed – the party, the vehicles and the hints are always on, the picture never moves by itself.
  The only choice is the mode, in the row on `/bilder/`; don't bring back a ⚙️ or ℹ️ for a picture, and put
  something a grown-up must switch while playing (like ⌨️) small into a corner of the picture.
- Every tap on a picture brings something to life, never only shapes: on an item its animation, on the
  background a `<Poke>` thing or what lives in that part of the picture (`spots`, covering the whole picture,
  `scenes.test.ts`). A new picture or a new background drawing gets both; pick what a toddler expects there
  (a crab from sand, not from a kitchen floor), and keep bedtime pictures calm (fireflies, stars).
- One way of finding at a time: a mode with its own way to find things (the torch light) shows no key badges and no ⌨️,
  since letters in the picture would give away what the light is for; its keys still do something (move the light).
- Find mode asks without words on screen: the bubble shows only the item (the question is spoken and is the
  bubble's `aria-label`), small enough to leave the picture free, and makes itself seen by a glow that grows and
  shrinks three times when a new question comes, then stands still.
- Answers are judged generously, never only by the tags: for a colour question every item with a visible part
  in that colour is right (`coloursIn` reads the colours from the drawing, `colourName` decides what a child would
  call red, yellow, green or blue – `colourParts.test.ts`), praised with „Da ist Rot!“ instead of „Der Bus ist rot!“.
  `traits` still tag what is not drawn as a colour (flies, wheels, animal, big, small) and the items that are all
  or mostly one colour; a new kind of question needs the same care, so a child who taps something that partly fits
  is never told otherwise.
