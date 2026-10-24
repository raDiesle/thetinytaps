# Lebendige Bilder

Routes `/bilder/` (menu) and `/bilder/<id>/`.

Scene engine (modes in menu order: colouring in – a tapped item gets its colour back, and every tap paints a big round dab of colour into the grey background, so the parts that never move can be painted too; find with the item big in the bubble; trait questions in `quests.ts`; "Freies Entdecken" with chain reactions and "alles entdeckt" party; tap, hover / swipe or keys with arrow-key frame in `focus.ts`; vehicles that drive into another picture in `roads.ts` – every second tap sends the fire engine, the tractor, the bus or the dump truck off, a sign at the edge follows it, and in the other picture the same drawing drives in and parks as a guest) and the scenes `baustelle/`, `stadt/`, `bauernhof/`, `hof/`, `zoo/`, `unterwasser/`, `badezimmer/`, `wald/`, `feuerwache/`, `weltall/`, `spielplatz/`, `kueche/`, `supermarkt/`, `flughafen/`, `winterbaustelle/` (reuses the Baustelle drawings with snow on top), `kita/`, `kinderarzt/`, `strand/`, `dinotal/`, `gutenacht/` (bedtime picture: `bedtime` on the scene makes every tapped thing fall asleep, and when all sleep the room goes dark instead of the party), and the season pictures `winter/`, `herbst/`, `ostern/`; hidden surprises in `hideout.tsx` (an item with `hideout` draws a `<Hideout>` behind its door, lid or sand pile, and on every tap another animal or present peeks out); shared depth helpers (`onFloor` for rooms), drawing helpers and sky in `layout.ts`, `shared.tsx`, `sky.tsx`; leaves and snow on the ground and in the air for outdoor pictures in `weather.tsx`.

## Working on scenes

- New picture or many new items: run `/neue-szene` (`.claude/skills/neue-szene/SKILL.md`); it has the full
  guide to depth, keys, drawing style, animations and the browser checks.
- `scenes.test.ts` checks every picture's data (unique ids, articles, tap sizes, chains, keys,
  plural grammar in questions, roads). `yarn test` after every change to items.
- `ScenePlay.tsx` is the engine and is shared by every picture (sounds in `sounds.ts`, the marks drawn over a picture in `marks.tsx`): keep scene-specific things in the
  scene's folder and its CSS, and prefix CSS classes and SVG ids by the scene (CSS is global).
- Music (`music.ts`, setting "Musik im Hintergrund", off by default): `musik/lebendige-bilder.mp3`, a calm Suno
  instrumental at 97 BPM that goes round its eight parts (`SONG`). It starts with the first tap, or when the child
  follows a vehicle in, and goes on where it was in the next picture; it stops while the page is hidden, gets quiet
  while the voice speaks, and needs the sounds on. Not in Gute Nacht (`bedtime`), which could get a lullaby of its own.
