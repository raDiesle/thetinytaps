# Was gehört zusammen?

Route `/zusammen/`, in the Zuordnen book. Ideas Z-03 („Was gehört zusammen?“, things of the day) and Z-13 („Wer braucht
das?“, helpers and their tools), built as one game (user decision, November 2026).

One flowing game, like Was gehört zum Tier?: its card plays at once (`startMode`), with no start screen, no cards and no
`level` row; ✕ goes back to the table of contents. Two kinds of rounds take turns (`KIND_ORDER` in `levels.ts`):
1. Dinge aus dem Alltag (Z-03): a thing stands in its place – the toothbrush in the bathroom, the door in a house
   front – and the child taps what belongs to it (toothpaste, key …).
2. Helfer und ihr Werkzeug (Z-13): a fox or bear grown-up stands in its role and place – the fire fox by the burning
   shed, the bear hairdresser by mirror and chair, the fox postman by the letter box – and the child taps the tool.

Under the picture a quiet line tells grown-ups what the round is about (`RoundTopic.tsx`: „Was gehört zu mir?“, „Was
brauche ich?“); each choice has its name small below it. The right one flies up into the picture and the two set to
work (`.working`, `WORK_MS`). A wrong pick stays still on its plate, and the one it belongs to peeks up over its plate
for a moment (`.tg-owner`) – never shown as wrong.

## The pairs

Each pair belongs to a **topic** (`topics.ts`: Im Bad, Küche & Essen, Zu Hause, Anziehen, Kita & Schule, Spielen, Garten, Wetter,
Unterwegs, Feste – things of the day; Berufe, Bauen & Reparieren, Fahrzeuge, Arzt & Krankenhaus, Feuerwehr, Polizei &
Rettung, Laden, Café & Küche, Bauernhof & Wald, Musik & Bühne, Sport, Märchen & Abenteuer – helpers), so grown-ups may
one day choose topics behind ⚙️. Helpers are split by place on purpose: since the wrong choices come from other topics
first, helpers of one place (the builder's bricks, the crane driver's crane) are rarely dealt together. There are three sorts:
- **Handmade** (`HANDMADE` in `pairs.tsx`, nine: Zahnbürste, Tür, Topf, Blume, Papier, Feuerwehr, Ärztin, Bäcker,
  Friseurin): drawn layer by layer with motions of their own in `together.css` (`.pair-<id>`), the only ones translated
  so far (`content.<lang>.ts`). Drawn in their old 200 × 200 units and moved into the middle of the wide box
  (`handmade`), on a backdrop.
- **Painted** (`painted/<topic>.ts`, `PaintedPair`, user decision, November 2026 – the way new pairs are made): two
  pictures of ONE scene painted with Gemini, the first showing what waits for its partner, the second the very same
  scene with the partner at work, fading in over the first as the partner lands (`PairPicture`'s `live`, `.tg-framed`
  in `together.css`). A pair is written as plain data with its prompts (`before`, `after`, in English) and plays only
  once its pictures are made (`fromPainted`, `framesOf` in `frames.ts`); `picturePrompts.ts` puts the rest into the
  picture queue, as cheap as it gets (user feedback, November 2026: the first 14 pairs went out one picture per
  request and cost twice what they had to): a pair's two frames are **one** request, drawn one under the other with
  the fox and bear families as reference and cut apart (`framesJob`, `panels`), and the painted partners share 2x2
  sheets, drawn from their own words with no reference; all of it goes out in one batch (`bun run image queue
  --make`), never pair by pair. `content.test.ts` fails on a picture drawn alone or a partner with a reference. Check
  each pair before and after side by side (`bun run frames` too), mark it `made`, and redraw what isn't clear: a pair
  whose two frames drift apart is redrawn as one request again, and only if that fails twice its second frame alone
  from the first (`alone: "second frame"`, `/bild-erzeugen`).
- **Scenes** (`scenes/<topic>.ts`, about 220, the older emoji scenes, `SceneSpec` and `fromScene` in `scene.tsx`): written as data – a backdrop, the thing
  as a big emoji (or, for a helper, the fox or bear in its outfit, `Helper.tsx`, with what it works on), a few small
  emoji round it for context (`props`), the partner, and one of a few shared motions (`Act`: onto, into, beside, rub,
  pour, tap, turn, light, hold; `.act-<act>` in `together.css`). A helper's tool lands in its paw first and is carried
  to the thing (`--from-x`, `--t`); then the thing hops, then the helper.

The picture is a wide box, 300 × 200 (`BOX_W`, `BOX_H`), as big as the room above allows; on a phone on its side it
stands at the left, as tall as the screen, and the choices beside it two to a row. **Backdrops** (`backdrops/`, one
file each for home, outside and places of work) tell where a thing or helper is: drawn once, still, paler than what
stands in front, the middle kept quiet, no people, no words and never a thing that could be an answer (rules at the
top of `backdrops/index.ts`). A new scene picks a backdrop that tells its place; a new place gets a backdrop there.

While developing, a `DevTag` at the bottom right names the pair on screen (`C07`: its topic's letter and its place in the topic, plus the id), and `?pair=<id>` shows that pair first and `?level=N` starts on difficulty step N.

**Difficulty** (`TOGETHER_LEVELS`, `dealRound` in `levels.ts`): 2, 3, 3, 4, 4 things to choose from, with the step rule
of Schatten finden (`nextLevel`). Every visit begins on the first step. Every six rounds count as a game for the
play-time limit (`gameEnded`, `countGame`). A thing comes again only after all of its kind (`useDeck`).

## Rules

### Painted pairs (user feedback from the review of the emoji scenes, November 2026)

- **The first picture plainly lacks the partner, and shows nothing else that would do its job.** No cake that already
  has candles, no letter box with a letter in it, no present that already has its bow, no building site where the
  bricks already lie ready. Whoever is there shows it waits: a fox or bear empty-pawed, unsure or searching, looking
  at what is missing – feelings only in faces and poses, never a „?“ or other sign floating in the air. Write the face
  („brows raised, mouth a small o“), never „puzzled“ or „confused“: Gemini drew a „?“ over the head for that word in a
  quarter of 166 pairs, whatever else the prompt said (review, November 2026).
- **The second picture is the very same scene a moment later**: the partner in use (the candles burning on the cake,
  the brush down in the chimney held by its rope, the reindeer pulling the sleigh) and everyone glad to have it.
  Nothing else changes. A partner that is merely there, lying beside someone with empty paws, is no answer: the
  prompt says who holds it and what it does. The partner comes to whoever waits, never the other way round: nobody
  moves to another place between the frames (into a cockpit, up a cliff), since Gemini then draws them twice, at the old
  place and the new – the rescue pilot climbing into her helicopter came out doubled three times, and stands beside it
  on its landing pad now (November 2026).
- **The thing lacks the partner, never the other way round**: the juicer waits for its orange, not the orange for its
  juice; the fire pit with its stacked wood waits for the fire, not the fire for wood.
- **A helper needs a tool, vehicle, animal or instrument to do its job – never what it hands out or makes** (Father
  Christmas needs his reindeer, not a present; the pastry cook a piping bag, not a cake), and never a thing every child
  has at home (the dentist needs her mouth mirror, not a toothbrush).
- **The place is plain at a glance**: a building site behind its barrier with a half-built wall, a lifeguard tower on
  the beach, a mine with its cart on rails, a kitten up a tree for the fire engine's ladder. Name the few things that
  tell the place in `before`, nothing more.
- **Only partners that look one way**: a thing a child knows by one look (a carrot, a key, a life ring), never one that
  looks very different from home to home (a charging cable was removed). Emblems on things (a shield, a flag, a coat)
  are neutral – a star, a paw, stripes – never a religious or national sign, since children in every app language play
  it (the knight's shield had a cross and was redrawn with a star, November 2026).
- **The partner on its plate looks like the partner in the second picture**: its emoji only where Apple's emoji
  matches it (🍊, 🦌, 🥕), else a `part` whose words describe it as the second frame shows it (Apple's 🕯️ stands on a
  metal dish – birthday candles don't); check the plate against the frame and redraw the part where they differ.
- **Review every made pair before marking it `made`**, frame by frame and the plate on grey (a contact sheet of
  before | after | plate; subagents can share the looking): of the first 166 drawn as one request each, 70 needed
  their frames again (a character or the partner twice in the second, the partner already somewhere in the first, a
  „?“, a drawn frame, a changed framing) and 77 their plate (white frame lines, a coloured panel left behind, cut off at
  its cell's edge – the sheet prompt for cut-outs was wrong then). `TWO_FRAMES` in `picturePrompts.ts` now says each
  of these per panel; a fault that comes back often goes there, not into each pair's words. Delete what fails and let
  `made` say what is left (`true`, `"frames"`, `"part"`): the queue then draws only the rest. Small motion strokes
  pass; a „?“, stars, sparkles, glow rays, hearts or letters in the picture, or on a uniform, fail (the second frame is
  the answer, and nothing floats up after an answer). Of the 92 redrawn on shared sheets, 33 pairs and 12 plates failed
  again, most because someone moved to a new place (now a rule above) or the framing drifted.
- One plain scene, the main thing big in the middle, a few things that tell the place, and only the characters named,
  each once (`CAST` in `picturePrompts.ts` says so to Gemini). Fox and bear take turns; a helper is a fox or bear
  grown-up in its role, children are fox or bear children, and everyone wears clothes. Things and children stay as the
  rules for all pairs below say (exactly one choice fits, `alsoFits` both ways, partner names unique within a kind).

### All pairs

- Grown-ups change things only behind ⚙️ held while playing (`PlayOptions`): „Was drankommt“ („Gemischt“ or exactly one
  kind, `settings.kinds` – never a mix of some, user feedback, November 2026) and „Schwierigkeit“ (Von selbst, Leicht,
  Mittel, Schwer). No other options.
- Exactly one choice fits. Kinds never mix in one round, and the wrong choices come from other topics first, each from
  a topic of its own (`dealRound`), so things of one topic may belong loosely together (soap and sponge in the
  bathroom) – requiring every partner of a topic to fit nothing else in it left a bathroom of two pairs. A partner is
  the obvious answer for its own one; where it also fits another pair of its kind, in any topic (no second thing a key
  opens, no other helper who uses scissors), the two name each other in `alsoFits` and are never dealt together. Ask
  it both ways: does this partner fit another thing, and does another partner fit this thing (a cushion on the chair,
  a pine cone on the Christmas tree)? A partner that fits a whole group names every pair of it (a coin every slot a coin goes into).
  Within a kind every emoji – partner or thing – is used once, and no context emoji is a partner (`content.test.ts`).
  No animals as things (Was gehört zum Tier? pairs animals with food and homes).
- What stands above shows its context (user feedback, November 2026): the door in a house front, the hairdresser
  with mirror and chair, the postman with letter box and bicycle. No stray figures that play no part (the postman's
  child was removed).
- Neither the thing nor its backdrop already shows the answer: no police car whose emoji has its blue light, no
  building site with a crane and a pile of bricks, no space with a ringed planet, no moon with the night's stars, no
  second bed or jacket in the room behind, no paint box or brushes on the painting table (all taken out in the reviews
  of the many scenes, November 2026). Look at the emoji itself, magnified, before choosing it: Apple's 🛶 holds its
  own paddle, so the canoe was left out. An emoji that looks like a photo or a sign (🏞️, 🛣️) or carries letters or
  numbers (🏪's „24“, 📓's printed label – 📒 instead) is no thing either.
- Look at every new scene before it goes in, at the end of its motion (`?pair=<id>`; in a hidden preview pane call
  `finish()` on `document.getAnimations()`): the partner stands plainly on, in or beside the thing, big enough to see
  – a helper's vehicle as big as what it stands on (`spot`), never a small one by the paw.
- Helpers are fox or bear grown-ups in their role (`Helper.tsx`: the shared `MascotHead`, `Arm`, `BODY` with an outfit –
  coat, hat, detail), the children they help fox or bear children (`Mascot child`); no drawn people, no heads of their
  own. Fox and bear take turns, so neither is left out.
- Each picture is made of layers (`Layer`), every one a small layer of its own placed in per cent of the box: what moves
  moves as a whole layer, by `transform` or `opacity` (phones, see the root `CLAUDE.md`). What must stay when something
  goes (the logs under the fire) is a layer of its own, and a layer drawn behind another comes first (the salon chair
  before the child sitting on it). Every layer's class is styled in `together.css` (`content.test.ts`).
- A partner is an emoji or a drawing; draw it where the emoji vanishes on the picture (🩺 on a green coat), and where
  there is no emoji or only one newer than Unicode 13 (🛟, 🛞, 🪏 and 🪈 show as empty boxes on older phones): such tools
  are drawn in `tools.tsx`, big and plain in the 100 × 100 box, and checked at the size of a choice on a phone.
- A tool that should still be seen at work moves `onto`, `beside` or with `rub` / `tap` / `turn`; `into` makes it
  vanish (the letter in its box, the pizza in the oven), so use it only where vanishing is the point (the chimney
  sweep's brush vanished into the chimney and the scene showed nothing).
- A helper is named by what the child sees it do with its tool: players by their instrument (Trommler, Geigerin –
  never a „Musiker“ several instruments would fit), and a role whose usual tool another helper has gets another of its
  own (the witch has the broom, so the cleaner has a vacuum cleaner).
- After the right pick the picture's change and its sound are the answer: nothing floats up (no sparkles, the old
  ones were removed), only the thing and the helper hop.
- Nothing to read in the picture; names only below the choices (for grown-ups) and as `aria-label`. No stars or count
  of rounds.

## Languages

The game speaks the app language (German, English, Chinese, Hindi, Spanish, Arabic, Russian; November 2026). Grown-ups'
texts (name, blurb, ⚙️, the topic line) are inline `t({ de, … })`; the sentences are `TOGETHER_TEXTS` (`pick(…, language.id)`),
German built from the pairs' articles (`GERMAN_SAYS`: „gehört“, „gehören“ for a `plural` partner, „braucht“), every
other language written out per pair in `content.<lang>.ts` (a `TogetherTranslation`: name, partner, question, right,
belongs) and listed in `src/content/texts/texts-<lang>.ts`, never imported from game code. A pair without its sentences
in a language is said wholly in German, and its name under the choice shows in German. Things "go with" each other,
helpers "need" their tools; where a verb would follow someone's gender, the sentence is built so it follows the tool or
no one (Hindi „… के लिए … चाहिए“, Russian „нужен / нужна / нужны“), and the helpers keep the German ones' gender
(Spanish la doctora, Arabic تحتاج). Every pair is translated in all six languages (the nine handmade ones in `content.<lang>.ts`, the scenes in
`content.scenes.<lang>.ts`; both are merged in `src/content/texts/texts-<lang>.ts`, and `content.test.ts` checks that every
pair has its sentences in each language, which differ from the German, the names of things excepted in languages with
Latin letters: Pizza, Computer). The topics' names are translated inline in `topics.ts`. A new scene or topic comes in German
only until the user asks for its translations; then the pairs are added to each `content.scenes.<lang>.ts` and the test
is relaxed for them like `GERMAN_ONLY` in the other games (the test wants all pairs again once they are translated). Every sentence is said from its ElevenLabs recording (`voice.ts`, files in `stimme/`), recorded in German only for
the handmade pairs so far: a sentence without its recording stays silent. New sentences are listed by
`src/content/recordedLines.ts` (`zusammen`) and recorded with `bun run voice make --only zusammen`, only when the user
asks. `languageStatus.ts` says what is missing.
