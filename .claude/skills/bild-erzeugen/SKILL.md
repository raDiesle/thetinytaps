---
name: bild-erzeugen
description: Generate a raster picture (illustration, card, sprite with transparent background, backdrop) for The Tiny Taps with Gemini via `yarn image`, check it and put it into the game. Use when the user asks to make/generate a picture, Bild, illustration or asset with Gemini or AI, or to fill an image folder like src/games/feelings/bilder/.
---

# Pictures with Gemini

`scripts/gemini-image.mjs` (run as `yarn image`) sends a prompt to the Gemini API,
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
  characters – ask the user first. `gemini-2.5-flash-image` is switched off. List the models the key can use:
  `curl -s -H "x-goog-api-key: $GEMINI_API_KEY" https://generativelanguage.googleapis.com/v1beta/models`
- The key must be **exported** (`export GEMINI_API_KEY=…` in `~/.zshrc`); if the shell
  of this session started before, run `zsh -ic 'export GEMINI_API_KEY; yarn image …'`.

## Batches (the default)

Every request goes through the Gemini Batch API at half the price. It usually takes
a few minutes, at most 24 hours (then it expires). The script waits and saves the
pictures when they are ready.

- **Run `yarn image …` in the background** (Bash `run_in_background`). While it
  waits, the session has live background work, and the app never archives such a
  session – so nothing that is still coming in gets lost.
- **Put many pictures in one batch** with `--jobs jobs.json` (an array of
  `{ "out", "prompt", "ref": [...], … }`, same names as the options) instead of
  many single runs. A picture that needs another as `--ref` (second frames) goes into
  the next batch.
- **Commit the pictures as soon as they are saved** and merge into main, so the
  worktree can be archived. `yarn archive-check` lists every worktree with what
  would still be lost (waiting batches, uncommitted files, commits not in main).
- Running batches are noted in the shared `.git/image-batches/`. `yarn image status`
  shows them, `yarn image fetch [--wait]` saves finished ones from any checkout – into
  the checkout that sent them, or into this one if that worktree is gone.
- `--now` asks right away at the full price: only for a quick single try while
  getting a prompt right. `--no-wait` only sends.

## Commands

```bash
# card / illustration, cropped to an exact size
yarn image src/games/feelings/bilder/push-1.webp "<style block> <prompt>" --aspect 4:3 --size 1200x900

# single thing with transparent background (flat magenta backdrop is asked for and cut out)
yarn image public/images/traktor.webp "<style block> A red tractor, side view" --transparent --size 512

# same character again: pass earlier pictures as references
yarn image public/images/fuchs-sprung.webp "The same fox from the reference, now jumping" --ref .image-raw/fuchs.png --transparent --size 512

# process again without a new request (other size, cut-out, or a picture the user made in the Gemini app)
yarn image public/images/traktor.webp --from .image-raw/traktor.png --transparent --size 768
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
  Then run `yarn frames` (a folder or files): it lists pairs where more than the
  movement changed, above all at the edge, which is background.
- **The same place stays the same** from picture to picture of a story: pass its first
  picture as the only `--ref` and change only what the character does. Two references
  (one for the room, one for the pose) make the Lite model invent the room anew.
- **`2x2` only for pictures that are never shown big** (icons, stickers, small
  cards): each panel is only about 590 px wide.
- Check both pieces: nothing cut off at the inner edges, no pink seam left.

## Style

Always start the prompt with the style block, so all pictures fit together:

```
Children's picture-book illustration for 2–4 year olds. Soft, flat, rounded
shapes with thick dark-purple outlines (#2a1e5c), bright friendly colours, gentle
shading. Simple, uncluttered background. No text, no letters, no numbers,
no speech bubbles, no frames.
```

For `--transparent` drop "Simple, uncluttered background" – the script adds the
flat backdrop instruction itself. Folders with their own guide (like
`src/games/feelings/bilder/README.md`) have their own style block, characters and file
names – use those.

## Workflow

1. Write the prompt in English: subject, pose, mood, what must be readable for a
   toddler. One clear subject; describe characters with the same words every time.
2. For a recurring character, make a reference first (character sheet or the best
   picture) and pass it with `--ref` to every later picture.
3. Run `yarn image …` in the background, then **look at the saved file with Read**. Check: is it what was
   asked, does a child who can't read understand it, faces/feelings clear, no text or
   stray letters, no extra limbs, edges of a cut-out clean (no magenta fringe, nothing
   of the subject cut away). A "warning: only N% of the border …" means the backdrop
   was not flat – generate again.
4. If it's wrong, change the prompt (be specific about what was wrong) and run again;
   stop after about three tries and show the user the best one with what's off.
5. Keep files small: cards ~1200×900 at quality 80 (< 200 KB), sprites 512–768 px.
   Commit only the final file in the game folder, never `.image-raw/`, right after
   the pictures arrive, and merge into main.
