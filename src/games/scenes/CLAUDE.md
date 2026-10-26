# Lebendige Bilder

Routes `/bilder/` (menu) and `/bilder/<id>/`.

Scene engine (modes in menu order: colouring in – a tapped item gets its colour back, and every tap paints a big round dab of colour into the grey background, so the parts that never move can be painted too; Space paints a random spot of the background where nothing happens (Enter still starts the item in the frame), shown as a small wide key at the bottom in the middle while the key badges are on; find with the item big in the bubble; trait questions in `quests.ts`; "Freies Entdecken" with chain reactions and "alles entdeckt" party; tap, hover / swipe or keys with arrow-key frame in `focus.ts`; vehicles that drive into another picture in `roads.ts` – every second tap sends the fire engine, the tractor, the bus or the dump truck off, a sign at the edge follows it, and in the other picture the same drawing drives in and parks as a guest) and the scenes `baustelle/`, `stadt/`, `bauernhof/`, `hof/`, `zoo/`, `unterwasser/`, `badezimmer/`, `wald/`, `feuerwache/`, `weltall/`, `spielplatz/`, `kueche/`, `supermarkt/`, `flughafen/`, `winterbaustelle/` (reuses the Baustelle drawings with snow on top), `kita/`, `kinderarzt/`, `strand/`, `dinotal/`, `gutenacht/` (bedtime picture: `bedtime` on the scene makes every tapped thing fall asleep, and when all sleep the room goes dark instead of the party), and the season pictures `winter/`, `herbst/`, `ostern/`; hidden surprises in `hideout.tsx` (an item with `hideout` draws a `<Hideout>` behind its door, lid or sand pile, and on every tap another animal or present peeks out); shared depth helpers (`onFloor` for rooms), drawing helpers and sky in `layout.ts`, `shared.tsx`, `sky.tsx`; leaves and snow on the ground and in the air for outdoor pictures in `weather.tsx`.

## Working on scenes

- New picture or many new items: run `/neue-szene` (`.claude/skills/neue-szene/SKILL.md`); it has the full
  guide to depth, keys, drawing style, animations and the browser checks.
- `scenes.test.ts` checks every picture's data (unique ids, articles, tap sizes, chains, keys,
  plural grammar in questions, roads). `yarn test` after every change to items.
- `ScenePlay.tsx` is the engine and is shared by every picture (sounds in `sounds.ts`, the marks drawn over a picture in `marks.tsx`): keep scene-specific things in the
  scene's folder and its CSS, and prefix CSS classes and SVG ids by the scene (CSS is global).
- Music is the background song of all games (`src/lib/backgroundMusic.ts`, played by `GameShell`, switched on the
  home page). The shell stays mounted when the child follows a vehicle into another picture, so the song goes on.
  Not in Gute Nacht (`bedtime`, `useNoBackgroundMusic`), which could get a lullaby of its own.

## Languages (German and Russian)

The pictures speak the app language (chosen on the home page, `src/lib/language.ts`). Rules:
- An item's words live in two places: German in the scene's item (`name`, `sentences`, chains), every other
  language in the scene folder's `ru.ts` (`SceneTranslation`: title, description, items by id with name,
  sentences, `gender` or `plural`, chain sentences in order), wired up in `translations.ts`. When you add or
  change an item, a sentence or a chain step in German, write the Russian next to it in `ru.ts` in the same
  commit; `scenes.test.ts` fails on a missing item, a chain of the wrong length or a name without gender/plural.
- Grammar follows the translation, never the German: an item can be plural in Russian and not in German
  (санки, часы) and the other way round. `localize.ts` (`localizeScene`, `localizeItem`) gives ScenePlay,
  the menu and guests from other pictures the scene in the app language, German where a translation is missing.
- Every sentence the engine builds itself (prompts, praise, party, find and trait questions, wrong taps,
  vehicles driving between pictures, labels) is in `phrases.ts`, one block per language; never put a
  German sentence into `ScenePlay.tsx` or `quests.ts`. Russian adjectives agree with the item's gender/plural
  (`agree`). Start-screen texts are inline with `t({ de, ru })` in `ScenesGame.tsx`; the surprises in a
  hideout have `found: { de, ru }`.
- Speech uses the app language's `speechLang`. Keys mode in Russian: the keys are the Cyrillic letters
  (`RUSSIAN_SCENE_KEYS`), found by key place (`pressedKey` → `cyrillicLetterOf`), so a German keyboard types
  Russian; an item wants the first letter of its whole Russian name (put the noun first in a translation
  where you can), and the Latin `key` wishes only count in German.
