---
name: bild-erzeugen
description: Generate a raster picture (illustration, card, sprite with transparent background, backdrop) for Fun for Both with Gemini via `bun run image`, check it and put it into the game. Use when the user asks to make/generate a picture, Bild, illustration or asset with Gemini or AI, or to fill an image folder like src/games/feelings/bilder/.
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
  in the picture. `gemini-2.5-flash-image` is deprecated (off on 15 March 2027) and dearer
  ($0.0195 batch). `gemini-nano-banana-2.1` (Nano Banana 2.1, since October 2026) costs the
  same per 1K picture as Lite but more for input and its thinking, and can make 2K ($0.0252
  batch) – four card-sized panels per sheet (`--model gemini-nano-banana-2.1 --image-size 2K
  --thinking minimal`, 58 % cheaper per picture, measured November 2026). **Never for story
  pictures drawn from a reference**: on its sheets they lost things every picture must keep (the
  bunny was missing in six of eight panels, even with „EVERY panel contains …“), Lite alone kept
  them; untested for cards and cut-outs without a reference (idea A-33, research
  „gemini-bildpreise“ on `/management/`). Every batch prints its real cost from the tokens
  Gemini sends back (`BATCH_PRICES` in the script, a new model needs its line). Prices change: check
  ai.google.dev/gemini-api/docs/pricing (Nov 2026) before trusting these. List the models the key can use:
  `curl -s -H "x-goog-api-key: $GEMINI_API_KEY" https://generativelanguage.googleapis.com/v1beta/models`
- The key must be **exported** (`export GEMINI_API_KEY=…` in `~/.zshrc`); if the shell
  of this session started before, run `zsh -ic 'export GEMINI_API_KEY; bun run image …'`.

## Cheap first: the queue (always)

Pictures are always made as cheap as they can be (user decision, November 2026). A request costs the same whether
it brings one picture or a sheet of two or four small ones (`--grid`), so small pictures of one kind wait until their
sheet is full, and later sessions bring the partners.

**Never one picture per request where a sheet can hold it** (user feedback, November 2026, „das darf nicht nochmal
passieren“: 14 scenes of „Was gehört zusammen?“ went out as two requests each, every frame alone, and their cut-out
partners each alone with a reference – about twice what sheets would have cost). Before writing a queue entry or a
`--jobs` file, go through these, cheapest first, and take the first that works:
- small things, cut-outs and cards share 2x2 sheets: no `ref` and no `alone`, the prompt says what to draw by itself
  (a partner's look comes from its own words, not „from this picture“);
- pictures that belong together (the two moments of one scene, a story's steps) go in one request as `panels`
  (`QueuedPicture.panels`, `--grid 1x2` / `2x2`), cut apart after – a before and after drawn so changed 8–12 % of the
  picture and 1 % of its edge, as steady as a second frame drawn from its first (measured with `bun run frames`,
  November 2026, „Was gehört zusammen?“);
- only what a check proved can't share – a second frame that must keep a first already made, a redrawn picture –
  is `alone` or drawn from a `ref`, and its `alone` names that reason (`pictureQueue.test.ts` takes only the reasons in
  `ALONE_REASONS`).
Then everything that is cheap goes out in **one** batch (`queue --make`), never pair by pair, and the plan's line
„cheap now – N requests“ is read before sending: more requests than pictures ÷ 2 means something above was missed.

1. **Every picture asked for goes into `src/content/pictureQueue.ts` first** (id, file, German `use`, the prompt
   *without* the style block, aspect, size, `transparent`, `ref`, date; `alone` with the reason for a second frame or a
   story picture that must keep its room – those never share a sheet). A game may keep its prompts in its own folder
   (`dayPictures.ts`, the Belohnungstafel's) and spread them in there; such a file is plain data, and when it or the
   queue imports game data with `?glob`, the script needs the app's plugin first – a script or tool that loads game
   data registers `appPlugin()` and then imports dynamically (`scripts/gemini-image.mjs`), never statically, or
   `bun run image queue` fails on „Cannot find module './bilder/*.webp?glob'“.
2. **`bun run image queue`** shows the plan (`src/content/pictureQueuePlan.ts`): *cheap now* are full sheets and
   pictures that never share one (no `size`, bigger than a panel, `alone`) – waiting saves nothing there; *waiting for
   partners* are sheets not yet full, together with older pictures already waiting there; *after their reference* are
   pictures drawn from another one still in the queue.
3. **Make the cheap part at once without asking**: `bun run image queue --make` (in the background, like every batch) –
   except pictures a game's rules keep for the user (Gefühle's „Geplant“, `src/games/feelings/CLAUDE.md`): those only
   wait in the queue for a batch the user asks for.
4. **For what waits, ask the user in the session** (AskUserQuestion, „warten“ first): wait for partners, or make it now
   for one request more (≈ $0.017). Now: `bun run image queue --make --force <id,…>` (or `all`) – the sheet's spare
   panels become variants of its pictures in `.image-raw/variants/`, to pick the best. Waiting: commit the queue entry
   with the feature, which shows a placeholder until then (see Workflow 0), and merge it, so the next session finds it.
5. **A made picture leaves the queue** in the commit that adds it (the script reminds you; `pictureQueue.test.ts`
   fails while a queued file exists).
6. **Redrawing a picture that is already in a game** (a mistake in it the user pointed out, a second frame to match a
   redrawn first) skips the queue: its file exists, so `pictureQueue.test.ts` would fail, and such a picture is drawn
   alone from its reference anyway, so waiting saves nothing. Make it at once with `--jobs` (a batch), the old file in
   git until the new one is right.

Pictures that still wait for the user's word – the mascot pictures in `mascotStatus.ts`, unmade prompts in
`picturePrompts.ts` – come into the queue only once the user asks for them. „Offene Bilder“ on `/management/` shows how
many pictures wait in the queue, split the same way, with what forcing would cost. The page shows no prompts to read,
change or approve (a „Bildvorschläge“ review was removed, user decision, November 2026: the user only wants to know how
many pictures are open) – never bring a prompt review back there; ask in the session when a prompt needs the user's look.

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
  the checkout that sent them, or into this one if that worktree is gone. `fetch` is for a batch nobody waits for:
  beside the run still waiting for it, both save and one stops with ENOENT. Never pipe a run into `head` either – it
  cuts off the list of saved pictures (send its output to a file).
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

- **Not for the two frames of a Lebendige-Bilder picture**, where only a small movement may change. Drawn as one
  grid, Gemini draws the scene twice: the camera zooms, characters stand elsewhere, balloons or a table vanish,
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
- **Describe only the characters that are in the picture.** A shared character list in the prompt (or in the queue's
  `style`) with characters a picture doesn't have makes the model draw them anyway, „Nobody else“ notwithstanding: a
  baby in a high chair and the big bear turned up at a table and in a kindergarten that had neither. Put each
  character's description into that picture's own prompt, with „Exactly N characters, each once: …“. Even then the
  Lite model adds a double of one of them, most often in a doorway, on a sofa or at the edge: of 39 story pages drawn
  with „each exactly once: … Nobody else“, ten had a second big bear, fox or bear child, a character in another look
  (the dressed bunny as a plain rabbit) or one missing. Add „only ONE of each in the whole picture, nobody more in a
  doorway, on the furniture or peeking in from an edge“, and count every character on every picture before keeping
  it – a contact sheet of reference and result side by side makes that quick.
- **A 1x2 or 2x2 sheet is cut where its gaps are magenta**: the book's softened colours sometimes darken the gap
  (198, 24, 147), and a band of it stayed on two cards until the cut took darker magenta too (`splitGrid`). A seam
  only partly across an edge, soft pink blended into the picture, also on a panel's outer sides, stayed on seven of 15
  Gefühle cards (November 2026) until the cut trimmed rows and columns tinted by the gap colour on every side too. Look
  at each piece's edges (a contact sheet of all of them on black shows a pink line at once); `--from
  .image-raw/<first>-grid1x2.png --grid 1x2 …` cuts again for free – fix the cut there, never trim pieces by hand.
  A `--transparent` sheet is one flat backdrop with no gap lines (the prompt asks so; boxes or frames round each thing
  stayed in the cut-outs): the cut lies in the middle of the backdrop between them, so a wide thing (a bus) or one
  reaching into the gap (a wheelchair's footrest) keeps its tip, and a sheet whose panels came out magenta with white
  lines between them is cut at those lines (November 2026). Look at the cut-outs on grey (#6a6a6a), not only the raw
  sheet. A border warning of 75–90 % on such a sheet is the backdrop's darker vignette, not a fault, as long as the
  piece looks clean.
- **A cut-out's figure never touches the picture's edge** where it isn't meant to end: Gemini sometimes draws it cut
  off by its frame, and the trim then leaves a straight line (Opa Bär's cap ended flat at the top, and every menu
  showed his head sliced, user feedback, November 2026). Before keeping a cut-out, check that its top and side rows
  are transparent (only a figure sitting on the page's foot may touch the bottom); if not, draw it again with „whole
  figure, room on every side“, or for a small missing tip redraw it with its own line and colours on a taller canvas.
  `BookFamily.test.ts` checks the menu's readers.
- **What stays put across pictures comes from a picture where it already is.** Several pictures in which a
  character keeps sitting, lying or holding something (sitting on the potty while the parents do things) are
  drawn from the picture where it already does so, not from the place's first picture: from the empty room the
  model drew the potty again where it stood and the child sitting on nothing beside it. Say in the prompt that
  there is only one of the thing. The same goes for a thing a character picks up in a later picture: say that its
  old place is empty now („picked up from the chair, so that chair corner is empty“). „Exactly one plush bunny“ alone
  still gave a second bunny in the bear's arms, beside the one left on the chair (Gefühle, the broken cookie).
  A character that leaves its place is drawn twice just the same (the little bear still on top of the slide and in the
  sandpit, a second fox at the party): say its old place is empty and „only ONE … in the whole picture“ for each. A
  story drawn from one first picture names in every prompt where the characters stand in that reference and says those
  places are empty now (Tapsis Milchkette's `WAS_THERE`): „Nobody else“ alone left six of twenty pages with a second
  Tapsi or Mama, or only Tapsi's tail lying on the rug where the reference had Tapsi (November 2026).
- **A moment before a picture** (trousers still up, about to sit down) is drawn from that picture as the only `--ref`,
  so the room stays the same – but the model keeps the reference's pose unless told plainly what is not so yet:
  "Tapsi is NOT sitting yet: stands upright …, a visible gap between …". With only the wanted pose described, the
  child sat on the potty again and the trousers were at the ankles again. Look at each one: does the pose really differ?
- **Cut-out frames of one animation** (a figure standing, hopping, clapping; a symbol before and after) are drawn on
  one sheet and cut with `--frames` (`frames` in `--jobs`; the queue sets it for `transparent` `panels`): equal cells,
  all cropped by one shared box, so stacked they line up. Without it every piece is cropped to its own outline, and a
  pose with raised arms came out smaller and shifted against the standing one (Mitmachen, November 2026). Gemini puts
  the body at the same spot in each cell; check it on a contact sheet. A `3x2` sheet holds three pairs of frames.
- **Never start a panel's words with a label and a colon** („Standing ready: upright …“): Gemini wrote the labels as
  words under the figures, despite „No text“ (Mitmachen, November 2026). Describe the pose plainly („Upright, both feet
  …“). Words drawn into a sheet anyway are painted over in the raw `.image-raw/` sheet with its backdrop colour and cut
  again with `--from`, never cropped off piece by piece.
- **`2x2` only for pictures that are never shown big** (icons, stickers, small
  cards): each panel is only about 590 px wide.
- Check both pieces: nothing cut off at the inner edges, no pink seam left.

## Style

Always start the prompt with the style block, so all pictures fit together (the queue adds it itself: `BOOK_STYLE`
in `pictureQueuePlan.ts`, the same words as here – `pictureQueue.test.ts` checks). The app looks like a picture book
(paper pages, softened printed colours, plum ink – see „The app looks like a picture book“ in the root `CLAUDE.md`
and the colours in `src/styles/book.css`), so the pictures are drawn as pages of that book:

```
Children's picture-book illustration for 2–4 year olds, like a page of a printed
picture book. Soft, flat, rounded shapes with thick dark plum ink outlines
(#3d3045), warm friendly colours softened like gouache printed on matte paper –
still clear and easy to tell apart, never dull or grey – gentle shading. Simple,
uncluttered background. Every fox and bear wears clothes. No text, no letters,
no numbers, no speech bubbles, no frames, no book, page or paper edge drawn
around the picture.
```

The app draws the book, its page and margin round every picture itself: never ask Gemini for them, and keep the
last line of the block, so „a page of a picture book“ doesn't come back as a drawn open book. Never call the picture a
„cover“ or „the cover picture of a book“ either: with that word the shelf books' covers came back as a booklet with
paper edge and rounded corners, or framed by a black border, despite the block. Write „The picture of a book about …“
and add „The illustration fills the whole square edge to edge (full bleed): no border, no frame, no margin, no rounded
corners“. A picture added to a set that already exists (a story, a folder
with its own guide) keeps that set's look and is drawn from its pictures as `--ref`, even when they still have the
older bright style with dark-purple outlines (#2a1e5c) – one story never mixes the two.

Let the app's mascots, the fox and the bear, come back where they fit (see „The app's mascots are the fox and the
bear“ in `CLAUDE.md`): now and then a fox or bear grown-up instead of a person, a fox or bear child in the background –
not in every picture. Pass a picture of Tapsi or the fox family (`src/components/bilder/buch-fuechse.webp`) or of the
bear family (`buch-baeren.webp`) as `--ref`, so every fox and every bear is the same kind. A picture that a task in
`src/content/ideas/mascotStatus.ts` asks for goes into the batch with the other waiting ones there, and the task is marked.
**Every fox and bear wears clothes** (user feedback, November 2026: the grown-up bears of the old „Was hilft“ cards
stood there naked): the block says so, and a prompt names what they wear – the little bear his light-blue T-shirt and
dark blue-purple trousers, a grown-up a sweater, a dress or a shirt. A child the picture is about stands in front and
big, alone unless what it shows needs someone else (a hug), on a calm background that doesn't draw the eye away.

For `--transparent` drop "Simple, uncluttered background" and "printed on matte paper" (a paper texture spoils the
cut-out) – the script adds the flat backdrop instruction itself. Never ask a cut-out for a shape behind its subject („a round sticker“, „inside a
circle“): Gemini then draws a disc that keeps the magenta of the backdrop, a white ring, or a small circle on a white
square, and the cut-out fails. Ask for a free-standing illustration with no circle, disc or frame behind it instead
(only a sticker that *is* a shape, a star or a heart, is fine). Don't call it „a cut-out“ or „free-standing“ either:
with those words Oma and Opa Fuchs came back as stickers with a thick white edge round them, unlike their reference
family (November 2026). Say instead „no white outline, sticker edge or halo round them – their dark plum ink line is
their outer edge, as in the reference picture“. An old fox or bear keeps the family's fur colour, with only a little
grey round the muzzle or on the head: „grey around the muzzle“ alone made Oma Fuchs grey all over, more wolf than fox. Leave out light that spreads (a lamp's glow, sunbeams
through a window): it came out magenta-pink. Ask for the whole thing to fit („the whole bathtub fits in the
picture“), or the model cuts a tub or pool at the edge.
A picture that takes a letter's place in a word (the o of „Both“ in the title) is drawn on that very letter: render
the letter in the page's font as a reference picture (sharp, dark plum on white, saved in `.image-raw/`), pass it as
`--ref` and ask for it „copied exactly … flat solid plum, no outline“, then measure where the letter lies in the result
and place the picture in em over the letter of the font. Look closely where a figure meets the letter: Gemini drew
Papa Fox a little above the o's top, floating. Then cut the flat letter out of the picture (its thick plum areas, eroded
so outlines stay, the cut legs' edges outlined again) and let the font's real letter show beneath, the figures placed
lower until they sit on it (`.logo-o` in `menus.css`, the original kept in `.image-raw/`). Figures on a letter are
only as big as the text: draw them about twice the letter's height and make the text big enough. A reference picture
sets the layout for the Lite model – asked for bigger figures with the earlier picture as `--ref`, it drew the same
picture again; what worked was the letter drawn small at the bottom of an empty canvas as the first `--ref` („Redraw
the first reference picture: keep its letter o exactly as it is … the same small size“), the figures alone as the second.
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
   Prompts kept in `src/content/picturePrompts.ts` stay there once made, each with the `url` of its picture, so it
   counts as made and not as missing (`picturePrompts.test.ts` checks it).
1. Write the prompt in English: subject, pose, mood, what must be readable for a
   toddler. One clear subject; describe characters with the same words every time.
2. For a recurring character, make a reference first (character sheet or the best
   picture) and pass it with `--ref` to every later picture.
3. Put it into the queue and run `bun run image queue --make` in the background (see „Cheap first“; a single
   `bun run image …` only for retries of a picture and `--now` tries of a prompt), then **look at the saved file with Read**. Check: is it what was
   asked, does a child who can't read understand it, faces/feelings clear, no text or
   stray letters, no extra limbs, edges of a cut-out clean (no magenta fringe, nothing
   of the subject cut away). A "warning: only N% of the border …" means the backdrop
   was not flat – generate again. A picture that shows an action is looked at alone, without its caption: is the
   action the biggest thing, caught at its plainest moment (a throw with the thing just leaving the paw), does nothing
   lie where it goes (a breath blown towards a fallen tower read as blowing it over), and does the face show what the
   moment is meant to be (relieved after a deep breath, not still red with anger)? No hands from the edge unless
   someone off-picture really acts – say so in the prompt, or Gemini adds a pointing hand.
4. If it's wrong, change the prompt (be specific about what was wrong) and run again;
   stop after about three tries and show the user the best one with what's off.
5. Keep files small: cards ~1200×900 at quality 80 (< 200 KB), sprites 512–768 px.
   Commit only the final file in the game folder, never `.image-raw/`, right after
   the pictures arrive, and merge into main.
