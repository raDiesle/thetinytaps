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

Each pair belongs to a **topic** (`topics.ts`: Im Bad, Küche & Essen, Zu Hause, Anziehen, Kita & Schule, Spielen,
Garten, Wetter, Unterwegs, Feste – things of the day; Berufe, Sport, Märchen & Abenteuer – helpers), so grown-ups may one day choose
topics behind ⚙️. There are two sorts:
- **Handmade** (`HANDMADE` in `pairs.tsx`, nine: Zahnbürste, Tür, Topf, Blume, Papier, Feuerwehr, Ärztin, Bäcker,
  Friseurin): drawn layer by layer with motions of their own in `together.css` (`.pair-<id>`), the only ones translated
  so far (`content.<lang>.ts`). Drawn in their old 200 × 200 units and moved into the middle of the wide box
  (`handmade`), on a backdrop.
- **Scenes** (`scenes/<topic>.ts`, about 190, `SceneSpec` and `fromScene` in `scene.tsx`): written as data – a backdrop, the thing
  as a big emoji (or, for a helper, the fox or bear in its outfit, `Helper.tsx`, with what it works on), a few small
  emoji round it for context (`props`), the partner, and one of a few shared motions (`Act`: onto, into, beside, rub,
  pour, tap, turn, light, hold; `.act-<act>` in `together.css`). A helper's tool lands in its paw first and is carried
  to the thing (`--from-x`, `--t`); then the thing hops, then the helper.

The picture is a wide box, 300 × 200 (`BOX_W`, `BOX_H`), as big as the room above allows; on a phone on its side it
stands at the left, as tall as the screen, and the choices beside it two to a row. **Backdrops** (`backdrops/`, one
file each for home, outside and places of work) tell where a thing or helper is: drawn once, still, paler than what
stands in front, the middle kept quiet, no people, no words and never a thing that could be an answer (rules at the
top of `backdrops/index.ts`). A new scene picks a backdrop that tells its place; a new place gets a backdrop there.

While developing, `?pair=<id>` shows that pair first and `?level=N` starts on difficulty step N.

**Difficulty** (`TOGETHER_LEVELS`, `dealRound` in `levels.ts`): 2, 3, 3, 4, 4 things to choose from, with the step rule
of Schatten finden (`nextLevel`). Every visit begins on the first step. Every six rounds count as a game for the
play-time limit (`gameEnded`, `countGame`). A thing comes again only after all of its kind (`useDeck`).

## Rules

- Grown-ups change things only behind ⚙️ held while playing (`PlayOptions`): „Was drankommt“ („Gemischt“ or exactly one
  kind, `settings.kinds` – never a mix of some, user feedback, November 2026) and „Schwierigkeit“ (Von selbst, Leicht,
  Mittel, Schwer). No other options.
- Exactly one choice fits. Kinds never mix in one round, and the wrong choices come from other topics first, each from
  a topic of its own (`dealRound`), so things of one topic may belong loosely together (soap and sponge in the
  bathroom) – requiring every partner of a topic to fit nothing else in it left a bathroom of two pairs. A partner is
  the obvious answer for its own one; where it also fits another pair of its kind, in any topic (no second thing a key
  opens, no other helper who uses scissors), the two name each other in `alsoFits` and are never dealt together. Ask
  it both ways: does this partner fit another thing, and does another partner fit this thing (a cushion on the chair,
  a pine cone on the Christmas tree)? A partner that fits a whole group names every pair of it (the washing machine
  everything worn, `CLOTHES` in `scenes/bad.ts`).
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
- A partner is an emoji or a drawing; draw it where the emoji vanishes on the picture (🩺 on a green coat).
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
(Spanish la doctora, Arabic تحتاج). Only the nine handmade pairs are translated (`TRANSLATED` in `content.test.ts`,
which checks those languages have every one of them); the scenes and the topics' names are German only until the user
asks. Every sentence is said from its ElevenLabs recording (`voice.ts`, files in `stimme/`), recorded in German only for
the handmade pairs so far: a sentence without its recording stays silent. New sentences are listed by
`src/content/recordedLines.ts` (`zusammen`) and recorded with `bun run voice make --only zusammen`, only when the user
asks. `languageStatus.ts` says what is missing.
