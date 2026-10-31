---
name: bild-erzeugen
description: Generate a raster picture (illustration, card, sprite with transparent background, backdrop) for The Tiny Taps with Gemini via `bun run image`, check it and put it into the game. Use when the user asks to make/generate a picture, Bild, illustration or asset with Gemini or AI, or to fill an image folder like src/games/feelings/bilder/.
---

# Pictures with Gemini

`scripts/gemini-image.mjs` (run as `bun run image`) sends a prompt to the Gemini API,
keeps the untouched result in `.image-raw/` (git-ignored) and saves a game-ready
WebP/PNG. Drawn SVG stays the first choice for things that move or are tapped in a
scene (see `/neue-szene`); use pictures for illustrations, cards and backdrops.

## Setup (the user does this, never ask for the key)

- `GEMINI_API_KEY` must be exported in the user's shell (key from Google AI Studio).
  If the script says it is missing, tell the user to set it themselves.
- Image models need billing enabled in AI Studio (the free tier allows 0 pictures;
  a `429 … free_tier … limit: 0` means billing is off). Don't generate dozens of
  variants without asking.
- Default model `gemini-3.1-flash-lite-image` (Nano Banana 2 Lite, $0.034 per 1K
  picture, $0.017 as batch, Oct 2026 – the cheapest; 1K is its only size, enough for
  these simple pictures, also for second frames with `--ref`). `--model` or
  `GEMINI_IMAGE_MODEL` switches, e.g. `gemini-3.1-flash-image` (Nano Banana 2, $0.067)
  or `gemini-3-pro-image` (Nano Banana Pro, $0.134) only for hard scenes with many
  characters – ask the user first. Keep costs low, but only where the saving doesn't show
  in the picture. `gemini-2.5-flash-image` is switched off. List the models the key can use:
  `curl -s -H "x-goog-api-key: $GEMINI_API_KEY" https://generativelanguage.googleapis.com/v1beta/models`
- The key must be **exported** (`export GEMINI_API_KEY=…` in `~/.zshrc`); if the shell
  of this session started before, run `zsh -ic 'export GEMINI_API_KEY; bun run image …'`.

## Batches (the default)

Every request goes through the Gemini Batch API at half the price. It usually takes
a few minutes, at most 24 hours (then it expires). The script waits and saves the
pictures when they are ready.

- **Run `bun run image …` in the background** (Bash `run_in_background`). While it
  waits, the session has live background work, and the app never archives such a
  session – so nothing that is still coming in gets lost.
- **Put many pictures in one batch** with `--jobs jobs.json` (an array of
  `{ "out", "prompt", "ref": [...], … }`, same names as the options) instead of
  many single runs. The script stops on a field it doesn't know: a misspelled one (it once
  read only `refs`, so every `ref` was dropped and the pictures came without reference –
  new rooms, new style) must never be ignored silently. After a batch with references,
  look first whether the room and style really match the reference. A picture that needs another as `--ref` (second frames) goes into
  the next batch.
- **Commit the pictures as soon as they are saved** and merge into main, so the
  worktree can be archived. `bun run archive-check` lists every worktree with what
  would still be lost (waiting batches, uncommitted files, commits not in main).
- Running batches are noted in the shared `.git/image-batches/`. `bun run image status`
  shows them, `bun run image fetch [--wait]` saves finished ones from any checkout – into
  the checkout that sent them, or into this one if that worktree is gone.
- `--now` asks right away at the full price: only for a quick single try while
  getting a prompt right. `--no-wait` only sends.

## Commands

```bash
# card / illustration, cropped to an exact size
bun run image src/games/feelings/bilder/push-1.webp "<style block> <prompt>" --aspect 4:3 --size 1200x900

# single thing with transparent background (flat magenta backdrop is asked for and cut out)
bun run image public/images/traktor.webp "<style block> A red tractor, side view" --transparent --size 512

# same character again: pass earlier pictures as references
bun run image public/images/fuchs-sprung.webp "The same fox from the reference, now jumping" --ref .image-raw/fuchs.png --transparent --size 512

# process again without a new request (other size, cut-out, or a picture the user made in the Gemini app)
bun run image public/images/traktor.webp --from .image-raw/traktor.png --transparent --size 768
```

Options: `--aspect` (1:1, 3:4, 4:3, 9:16, 16:9 …), `--size W` (longest side, no
enlarging) or `WxH` (cover crop; with `--transparent` fitted inside), `--transparent`,
`--key ff00ff` (backdrop colour to cut out – change it if the subject itself is
magenta), `--quality 80`, `--ref` (repeatable), `--from`, `--model`, `--jobs`,
`--now`, `--no-wait`, `--grid` with `--panel` (see below).

## Several pictures in one (`--grid`)

`--grid 1x2` (two panels on top of each other) or `2x2` asks for one picture with
the panels separated by magenta gaps and cuts it apart; one request, so each picture
costs a half or a quarter. `--aspect` is the aspect of each panel; the files are
comma-separated, one `--panel "<what differs>"` each, the prompt holds what is shared.

- **Not for the two frames of a moving picture.** Drawn as one grid, Gemini draws the
  scene twice: the camera zooms, characters stand elsewhere, balloons or a table vanish,
  and the cross-fade looks restless. Make the first frame alone, then the second with
  the first as the only `--ref` and a prompt that names just the small movement
  ("Redraw this exact picture … Nothing appears, disappears or moves except …").
  Then run `bun run frames` (a folder or files): it lists pairs where more than the
  movement changed, above all at the edge, which is background. It doesn't notice the opposite: the Lite model
  sometimes returns the second frame almost unchanged (a block put on a tower), so look at both, and name a
  movement big enough to see (a head turned, a paw waving).
- **The same place stays the same** from picture to picture of a story: only the core
  of the picture (what the characters do) may change, never the background, objects or
  camera around it. Get the story's first picture right (cast, every object once), then
  draw every later picture with it as the only `--ref`. Write the prompt in two parts:
  what stays ("Redraw this exact picture … Keep the place exactly as it is: …, same
  camera framing (no zoom, no shift)"), naming every character that must be there
  ("each exactly once … Nobody else"), then "Now this happens: …". Two references
  (one for the room, one for the pose) make the Lite model invent the room anew.
  `bun run frames --scenes` lists pictures whose border (the background) differs from
  the story's first picture; a look at the story side by side shows a missing or
  extra character.
- **What stays put across pictures comes from a picture where it already is.** Several pictures in which a
  character keeps sitting, lying or holding something (sitting on the potty while the parents do things) are
  drawn from the picture where it already does so, not from the place's first picture: from the empty room the
  model drew the potty again where it stood and the child sitting on nothing beside it. Say in the prompt that
  there is only one of the thing.
- **A moment before a picture** (trousers still up, about to sit down) is drawn from that picture as the only `--ref`,
  so the room stays the same – but the model keeps the reference's pose unless told plainly what is not so yet:
  "Tapsi is NOT sitting yet: stands upright …, a visible gap between …". With only the wanted pose described, the
  child sat on the potty again and the trousers were at the ankles again. Look at each one: does the pose really differ?
- **`2x2` only for pictures that are never shown big** (icons, stickers, small
  cards): each panel is only about 590 px wide.
- Check both pieces: nothing cut off at the inner edges, no pink seam left.

## Style

Always start the prompt with the style block, so all pictures fit together. The app looks like a picture book
(paper pages, softened printed colours, plum ink – see „The app looks like a picture book“ in the root `CLAUDE.md`
and the colours in `src/styles/book.css`), so the pictures are drawn as pages of that book:

```
Children's picture-book illustration for 2–4 year olds, like a page of a printed
picture book. Soft, flat, rounded shapes with thick dark plum ink outlines
(#3d3045), warm friendly colours softened like gouache printed on matte paper –
still clear and easy to tell apart, never dull or grey – gentle shading. Simple,
uncluttered background. No text, no letters, no numbers, no speech bubbles,
no frames, no book, page or paper edge drawn around the picture.
```

The app draws the book, its page and margin round every picture itself: never ask Gemini for them, and keep the
last line of the block, so „a page of a picture book“ doesn't come back as a drawn open book. A picture added to a set that already exists (a story, a folder
with its own guide) keeps that set's look and is drawn from its pictures as `--ref`, even when they still have the
older bright style with dark-purple outlines (#2a1e5c) – one story never mixes the two.

Take foxes in wherever they fit (see „The app's animal is the fox“ in `CLAUDE.md`): a fox
grown-up instead of a person, a fox child in the background; pass a picture of Tapsi or the fox family
(`src/components/bilder/buch-fuechse.webp`) as `--ref`, so every fox is the same kind. A picture that a fox task in
`src/content/ideas/foxStatus.ts` asks for goes into the batch with the other waiting ones there, and the task is marked.

For `--transparent` drop "Simple, uncluttered background" and "printed on matte paper" (a paper texture spoils the
cut-out) – the script adds the flat backdrop instruction itself. Never ask a cut-out for a shape behind its subject („a round sticker“, „inside a
circle“): Gemini then draws a disc that keeps the magenta of the backdrop, a white ring, or a small circle on a white
square, and the cut-out fails. Ask for a free-standing illustration with no circle, disc or frame behind it instead
(only a sticker that *is* a shape, a star or a heart, is fine). Leave out light that spreads (a lamp's glow, sunbeams
through a window): it came out magenta-pink. Ask for the whole thing to fit („the whole bathtub fits in the
picture“), or the model cuts a tub or pool at the edge.
A long strip (a print border, `--aspect 21:9` cropped to 4:1) comes back as a narrower strip with white bands
above and below, even when the prompt says „edge to edge“: the cover crop then keeps white rows, or cuts the sides
(the sun of a sky strip). Trim the white rows from the raw `.image-raw/` picture first (sharp `extract`), then crop
to the size; move the crop (`position`) so the strip's main thing stays whole. Folders with their own guide (like
`src/games/feelings/bilder/README.md`) have their own style block, characters and file
names – use those.

## Workflow

0. Pictures the user didn't ask for (a feature of yours needs new ones) are not generated on your own:
   leave a placeholder in the game (the Gefühle game shows the file name, `Placeholder` in its `shared.tsx`)
   and list file name and prompt where the game keeps them (e.g. „Geplant“ in its `bilder/README.md`),
   so the user looks at the ideas first and then makes them with you.
   Prompts collected for review on `/management/` (`src/content/picturePrompts.ts`) stay there once made, each with
   the `url` of its picture, so the page shows it as made and not as missing (`picturePrompts.test.ts` checks it).
1. Write the prompt in English: subject, pose, mood, what must be readable for a
   toddler. One clear subject; describe characters with the same words every time.
2. For a recurring character, make a reference first (character sheet or the best
   picture) and pass it with `--ref` to every later picture.
3. Run `bun run image …` in the background, then **look at the saved file with Read**. Check: is it what was
   asked, does a child who can't read understand it, faces/feelings clear, no text or
   stray letters, no extra limbs, edges of a cut-out clean (no magenta fringe, nothing
   of the subject cut away). A "warning: only N% of the border …" means the backdrop
   was not flat – generate again.
4. If it's wrong, change the prompt (be specific about what was wrong) and run again;
   stop after about three tries and show the user the best one with what's off.
5. Keep files small: cards ~1200×900 at quality 80 (< 200 KB), sprites 512–768 px.
   Commit only the final file in the game folder, never `.image-raw/`, right after
   the pictures arrive, and merge into main.
