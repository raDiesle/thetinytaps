---
name: neue-szene
description: Create a new "Lebendige Bilder" scene (Wimmelbild) for The Tiny Taps, e.g. Bauernhof, Zoo or Stadt – drawing, items, texts, animations, sounds, keys and checks. Use when the user asks for a new scene/picture, or to add many items to one.
---

# New scene for "Lebendige Bilder"

A scene is a hand-drawn SVG picture (React components) for toddlers aged 2–3.
Every item can be tapped, hovered or triggered by a key; then it plays a short
animation and a sound, and may say a German sentence. `baustelle/` is the
reference – read it before starting and copy its patterns.

## Files

```
src/games/scenes/
  layout.ts        // shared: HORIZON, depthScale, float(), ground(), transformOf, towardsHorizon
  shared.tsx       // shared: colours (INK, SKIN …), Wheel, Pane, Inside, Face, Cloud, nth()
  sky.tsx, sky.css // shared: Sonne and Wolke items with their animations
  <id>/
    <Name>.tsx     // export const <id>: Scene = { ..., items: [...] } – items back to front
    layout.ts      // placements of this scene (built with ../layout's ground())
    background.tsx // sky, horizon, ground, static details – nothing tappable
    <group>.tsx    // item drawings, grouped (animals.tsx, buildings.tsx …)
    <id>.css       // all animations of this scene
```

Register the scene in `src/games/scenes/index.ts` (`SCENES`) and remove it from
`UPCOMING_SCENES`. The route `/bilder/<id>` (`src/pages/ScenePage.tsx`) finds it with `findScene`.
Add its search engine entry to `src/content/seo.ts` (`scene("<id>", "<Titel>", "<three things to tap>")`,
things that really are in the picture); `content.test.ts` fails without it.

Reuse instead of copying: import the shared helpers from `../layout`, `../shared`
and `../sky`. When a helper of one scene is needed by another, move it up to
`src/games/scenes/` as well. `baustelle/` and `stadt/` are the references.

## Picture and depth

- Canvas 1600 × 1000, shown with `preserveAspectRatio="xMidYMid meet"`.
- Sky is small: it ends at `HORIZON` ≈ 330. The ground below is where things are
  found, so most items stand on the ground.
- **Depth**: an item further back is smaller. Place items with
  `ground(footX, footY, toX, toY, size)`: the drawing's foot point lands on
  `(toX, toY)` and is scaled by `depthScale(toY)` (≈ 0.45 at the horizon, ≈ 0.95 at
  the bottom). `size` is the item's real-world size relative to others (house 1.3,
  mouse 1). Things in the sky use `float(...)` with a fixed scale.
- **Spread over depths**: never line many items up on one horizontal line. Use at
  least 4 depth bands (back at the fence, middle, a road or path, front) and stagger
  y within a band (e.g. two lanes on a road).
- Draw order = order of `items` (back to front). Items further back come first.
- Items that belong together share one placement (house + crane + cat), exported
  from `layout.ts` and also used for background parts that belong to them
  (`transformOf(SITE)`).
- Background details also follow depth: pebbles, tufts and kerb joints scale with
  `depthScale(y)`; lines on the ground run towards the vanishing point
  (`towardsHorizon`). Far away = lighter colours and a little haze.
- Leave space: items must not cover each other's hit areas. 35–45 items fit.
- Rooms (`badezimmer/`, `kueche/`, `supermarkt/`, `gutenacht/`): the back wall stands on
  the horizon; floor tiles and lines come from `onFloor` in `../layout`.
- Bedtime pictures: `bedtime: true` on the scene makes tapped items keep the class
  `asleep` and darkens the room (class `night` on the scene) once all sleep, instead
  of the party – see `gutenacht/`.

## An item

```ts
{
  id: "traktor",                 // CSS class item-traktor, unique, ascii
  name: "der Traktor",           // with article
  sentences: ["Der Traktor tuckert los!", "Der Traktor ist rot."], // short, toddler German
  sound: "engine",               // SceneSound: recording in src/lib/sounds/ or synthesized in src/lib/sfx/
  traits: ["red", "wheels"],     // for "Was ist rot?", "Was hat Räder?" – only clear cases
  key: "T",                      // optional wished key (big items: first letter)
  box: [x, y, w, h],             // bounds in the drawing's own coordinates
  hitAreas: [[...]],             // optional, when the box would cover other items
  place: ground(footX, footY, toX, toY, size),
  shadow: [cx, cy, rx],          // ellipse under the foot, own coordinates
  durationMs: 2000,              // matches the CSS animation length
  hideout: [0.15, 0.8],          // optional: something peeks out of a <Hideout> while the door is open
  Art: Traktor,
}
```

- `box`, `hitAreas`, `shadow` and CSS `transform-origin` px values are all
  in the drawing's own coordinates; `place` moves them along.
- Hit areas: at least ~60 × 60 units after placement, so small fingers hit them.
  Tiny animals (ladybird, snail) get a larger hit area than their box.
- Key badges are placed by the engine (`badgeSpots` in `ScenePlay.tsx`): just
  **outside** the item's `box`, at the spot covering the least of any item's hit
  areas, so letters never hide faces, doors or animations. The badge of the item
  just started lights up yellow with a glow ring, so the child sees where to look.
  Keep `box` tight around the drawing, otherwise the badge ends up far away.
- Keys are assigned in `src/games/scenes/keys.ts`: wished key → first letter → any
  free key (A–Z, 1–0); when keys run out, items share a key and take turns. Only
  set `key` for the most important items, so letters stay meaningful.
- Traits (`SceneTrait`, questions in `src/games/scenes/quests.ts`): main colour
  (red/yellow/blue/green, only if the item clearly is that colour), `flies`, `big`,
  `small`, `animal`, `wheels`. The answer is built as "<Name> ist rot!" ("Die Tauben
  sind Tiere!" with `plural`). A question is only asked with ≥ 2 answers.
- Plural names ("die Küken") get `plural: true`, so find mode asks "Wo sind die Küken?".
- Sound riddle: only distinctive sounds are asked (`RIDDLE_SOUNDS` in `quests.ts`);
  every item with that sound counts as right, so give each item its most fitting sound.
- Chain reactions: add 2–3 `chains` to the scene (`{ start, steps: [{ item, sentence }] }`),
  little "wenn – dann" stories between items that are near each other or belong
  together (Hund bellt → Katze erschrickt → Vogel fliegt weg). The steps use the
  items' normal tap animations.
- Seasons and holidays are pictures of their own (`winter/`, `herbst/`, `ostern/`), not
  extras in other scenes. Falling leaves and snow for outdoor pictures: `../weather`
  (`FallenLeaves`/`Snow` in the background, `FallingLeaves`/`FallingSnow` as `Overlay`).
- Hidden surprises (idea B-01, `hideout.tsx`): give 2–4 items with a door, window,
  lid, box, hole or sand pile a `<Hideout x y w h size? />` in their drawing, drawn
  **behind** the door (dark interior → Hideout → door), and set `hideout` on the item:
  `true` (out from 20 % to 80 % of `durationMs`) or `[open, close]` matching the
  door's keyframes. Every tap something else peeks out (cat, mouse, present …),
  with its own sound and "Guck-guck! Da ist ja eine Katze!". It draws nothing at
  rest, so the picture stays the same. Reference: Klo, Bauwagen and Sandhaufen in
  `baustelle/site.tsx`.
- Roads to other pictures (optional): a vehicle can drive into another scene
  (`ROADS` in `roads.ts`: `from`, `item`, `to`, the free ground spot `park` where it
  stands as a guest there, and the way the drawing `faces`); add the scene's
  phrases to `PLACES` ("in den Wald", "aus dem Wald", "im Wald"). Pick the park
  spot where it covers little, and check its arrival in the browser.
- New sound? Add it to `SceneSound` (types.ts), the topic file in `src/lib/sfx/` (built on
  `note()`) and the `SOUNDS` map in `src/games/scenes/sounds.ts`. For a real recording, put
  `src/lib/sounds/<sound>.mp3` next to it (CC0 only, source in that folder's
  `README.md`); the scene plays it instead of the synthesized one. Recordings
  are specific (a real dog barks like a dog), so check every item with that sound.

## Drawing style

- Flat, friendly, rounded shapes; outlines in `INK` only where needed; soft
  highlights (white, opacity ≈ 0.5) and darker bottom edges for volume.
- Faces with `Face` (eyes with highlights, cheeks, smile). No scary details.
- People in vehicles sit **behind** the window: draw them inside `Pane` (rect
  windows) or `Inside d="<window path>"` (any shape). They are clipped to the glass,
  so body parts never show on the door.
- Parts that move get a class (`traktor-wheel`, `traktor-smoke`). Puffs, drops,
  notes and lights that only appear during the animation are hidden with
  `opacity: 0` in the scene CSS's hide list.
- Pivot points: `style={{ transformOrigin: "820px 640px" }}` in own coordinates, or
  add the class to the fill-box list (`transform-box: fill-box; transform-origin:
  center`) for puffs and leaves. Never both on the same element.
- Use `nth(i)` to stagger repeated parts (`--i` in CSS).
- SVG ids (clipPath, gradients) must be unique per scene; prefix them (`bs-` for
  Baustelle, `st-` for Stadt). CSS is global, so prefix part classes too. Inside components that can render twice (thumbnails), use `useId()`
  like `Inside` does.

## Animations (`<id>.css`)

- Tap animation: `.item-<id>.playing .<part> { animation: ... }`, length ≤
  `durationMs`. Each item does something different and fun (hop, wobble, spin,
  open/close, puffs) and ends in its resting pose.
- **The more moves, the better.** When tapped, everything a child would expect
  to move does move – several parts per item, staggered over the animation:
  - every door opens and closes again (hinge as pivot, `scaleX` or `rotate`), and
    often someone peeks out; garage doors and gates roll up;
  - every window does something: the sash swings open, the light goes on, a
    curtain moves or a face looks out;
  - lids, flaps, hatches and boot lids lift; levers, handles and switches move;
  - wheels turn, lights blink once, horns/exhausts puff, signs and flags swing;
  - people wave, nod, blink, lift a tool; animals blink, wag, twitch ears, hop;
  - plants rustle, petals open, smoke and dust puff, little extras pop out
    (notes, hearts, drops, sparks) and vanish again.
  Draw these parts as separate elements with their own class from the start, so
  they can move – a door painted into the wall can't open.
- **The picture is still and silent unless someone acts.** No sound ever plays
  without a tap, hover or key (also not with idle movement on). Idle movement (clouds, rotors,
  blinking lights, wagging tails) only under `.scene.lively …` – that class is set
  only when the parent turns on "Bild bewegt sich auch von allein". Check with
  `document.getAnimations().length === 0` after load.
- Calm mode is handled by the engine (quieter sounds, no idle movement); tap
  animations still play, so keep them short and never flashing.

## Texts

- German, 2–3 short sentences per item, present tense, simple words, sounds
  ("Brumm, brumm!", "Quak!"). Speech is off by default, but the texts are also
  used in find mode ("Wo ist der Traktor?").
- `name` with the correct article; the find question is built from it.
- German only, unless the user asks for languages: a scene without (or with an incomplete) `ru.ts` plays
  entirely in German, also on a Russian app (`sceneLanguage` in `localize.ts`). Mark the gap in the
  `/bilder/` row of `src/content/ideas/languageStatus.ts`. When asked for Russian: `src/games/scenes/<id>/ru.ts`
  (`export const RU: SceneTranslation`, see an existing scene) with the title, description, every item (`name` in
  the nominative without article, starting with a Cyrillic letter – it is the item's key; `gender` m/f/n or
  `plural: true` as Russian has it) and the chain sentences in order, imported in `src/content/texts/texts-ru.ts` (`scenes`);
  present tense, "ты", nothing that changes for boy or girl. Changing a German item of a translated scene: delete
  its Russian when the meaning changes.

## Checks before you finish

1. `bun run verify` (typecheck + `scenes.test.ts`: ids, articles, tap sizes, chains,
   keys, question grammar, roads) and `bun run build` (always Bun, never npm or yarn).
2. Preview (`.claude/launch.json`, `preview_start`) at `/bilder/<id>`, then:
   - every item is tappable: for each item, `document.elementFromPoint` inside its
     hit area returns an element within `.item-<id>`;
   - each item animates when tapped and returns to rest;
   - `document.getAnimations()` is empty when nothing was tapped;
   - keys mode (trigger "⌨️ Jedes Ding hat eine Taste", "Tasten im Bild zeigen"):
     every item shows a badge next to it (not on it), badges don't overlap, the key
     triggers it and its badge lights up;
   - tap every item once and look: do all doors, windows, lids and faces move?
   - hover mode and find mode work; the hint ring sits on the item;
   - "Fragen" and "Geräusch-Rätsel" ask sensible questions; every chain plays through;
   - "Ausmalen": everything starts grey and gets its colour when tapped.
3. Screenshot the whole picture and look for items on one line, overlaps, empty
   areas and things that look flat; fix and check again.
4. Update `src/games/scenes/CLAUDE.md` (list of pictures) and the README roadmap, and commit on a branch.
