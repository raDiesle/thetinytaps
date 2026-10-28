# Lebendige Bilder

Routes `/bilder/` (menu) and `/bilder/<id>/`.

Scene engine (modes in menu order: "Freies Entdecken" first and the default, see below; colouring in – a tapped item gets its colour back, and every tap paints a big round dab of colour into the grey background, so the parts that never move can be painted too; Space paints a random spot of the background where nothing happens (Enter still starts the item in the frame), shown as a small wide key at the bottom in the middle while the key badges are on; find with only the item, glowing, in the bubble; trait questions in `quests.ts` (colours also count for a part, `colourParts.ts`); "Freies Entdecken" with chain reactions and "alles entdeckt" party; tap, hover / swipe or keys with arrow-key frame in `focus.ts`; vehicles that drive into another picture in `roads.ts` – every second tap sends the fire engine, the tractor, the bus or the dump truck off, a sign at the edge follows it, and in the other picture the same drawing drives in and parks as a guest) and the scenes `baustelle/`, `stadt/`, `bauernhof/`, `hof/`, `zoo/`, `unterwasser/`, `badezimmer/`, `wald/`, `feuerwache/`, `weltall/`, `spielplatz/`, `kueche/`, `supermarkt/`, `flughafen/`, `winterbaustelle/` (reuses the Baustelle drawings with snow on top), `kita/`, `kinderarzt/`, `strand/`, `dinotal/`, `gutenacht/` (bedtime picture: `bedtime` on the scene makes every tapped thing fall asleep, and when all sleep the room goes dark instead of the party), and the season pictures `winter/`, `herbst/`, `ostern/`; hidden surprises in `hideout.tsx` (an item with `hideout` draws a `<Hideout>` behind its door, lid or sand pile, and on every tap another animal or present peeks out); shared depth helpers (`onFloor` for rooms), drawing helpers and sky in `layout.ts`, `shared.tsx`, `sky.tsx`; leaves and snow on the ground and in the air for outdoor pictures in `weather.tsx`.

## Working on scenes

- New picture or many new items: run `/neue-szene` (`.claude/skills/neue-szene/SKILL.md`); it has the full
  guide to depth, keys, drawing style, animations and the browser checks.
- `scenes.test.ts` checks every picture's data (unique ids, articles, tap sizes, chains, keys,
  plural grammar in questions, roads). `bun test` after every change to items.
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

- Find mode asks without words on screen: the bubble shows only the item (the question is spoken and is the
  bubble's `aria-label`), small enough to leave the picture free, and makes itself seen by a glow that grows and
  shrinks three times when a new question comes, then stands still.
- Answers are judged generously, never only by the tags: for a colour question every item with a visible part
  in that colour is right (`coloursIn` reads the colours from the drawing, `colourName` decides what a child would
  call red, yellow, green or blue – `colourParts.test.ts`), praised with „Da ist Rot!“ instead of „Der Bus ist rot!“.
  `traits` still tag what is not drawn as a colour (flies, wheels, animal, big, small) and the items that are all
  or mostly one colour; a new kind of question needs the same care, so a child who taps something that partly fits
  is never told otherwise.
