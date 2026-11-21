# Buchstaben & Zahlen

The book „Buchstaben & Zahlen“ holds five games, each a page of its table of contents (`games.ts`), sharing this folder
and one store of settings (`tinytaps.letters.v2`, so letters, pictures and keys stay as chosen in each):
- Frei tippen, `/buchstaben/` (`LettersPlay.tsx`): every key shows its letter with a picture and word; a number shows its
  things and digit at once, or optionally counts them aloud, step by step or by tapping each thing. Every other key
  without a job of its own, and every tap beside the card, opens a surprise (`Surprises.tsx`, `surprises.css`, below).
- Zählen, `/zaehlen/` (`LettersPlay.tsx` with `numbersOnly`): only numbers come – a digit shows itself, any other key
  without a meaning of its own (Space, Enter, arrows, Backspace keep theirs) brings a number from 1 to 9 by chance; on
  touch screens only the digit keys. With `digitOnRepeat` (for „Alles sofort“ and „Vorzählen“, in both games) a number
  shows its things first and its digit only when the same number is pressed again right after. With `twoDigits`
  („Two-digit numbers“ behind ⚙️, in both games; user request, November 2026) two keys make one number
  (`twoDigits.ts`): the first digit waits big beside an empty dashed place (`HalfNumberCard`, a soft note, no voice,
  Backspace takes it back), the second makes the number – a leading 0 a one-digit number – and Zählen's keys by chance
  bring 10–99. A two-digit number always shows everything at once, whatever „Zahlen“ says: its things in rows of ten,
  each row two groups of five as on a counting frame, the rest's row starting under them (`TensGrid`), sized from the
  stage so 99 fits on a phone on its side – counting 99 aloud or by tapping would be no game. Its word („twenty-three!“,
  English first, `TWO_DIGIT_WORDS`) waits for its recording and stays silent until then; the second digit always
  answers, while the same number again within `SAME_KEY_PAUSE_MS` stays quiet.
  Zählen's other way to play is „Wo ist die 3?“ (`countPlay: "find"`, „What to play?“ behind ⚙️, L-17;
  `NumberFindPlay.tsx`, `numberFind.ts`), as „Wo ist das B?“ is Wörter tippen's: things appear with an empty key under
  them, and the child finds the digit key for how many there are. The question („How many? Find the number!“,
  `NUMBER_FIND_PROMPT`, English first, silent until recorded) never names the number – counting is the point. Other
  keys only ripple with the soft note; every third the question comes again and, with `hints`, the key lights up (on the
  screen's keys, or the small keyboard's digit row). The right key fills the empty key with its digit, pressed and lit,
  and says the counting sentence – nothing hops. It finds its own pace (`nextPace`): 1–3 first, three rounds in a row
  found with the first key bring the next step (up to 5, then 9, its new numbers first), a round that needed the hint
  the step before. A digit counts by its place too (`digitOf`: top row or keypad), so a French keyboard needs no Shift.
- Frei tippen's dark page (`dark`, „Dark page“ behind ⚙️, Frei tippen only; user request, November 2026): night
  colours take turns behind the card (`DARK_BACKGROUNDS`), and the stage alone turns its `--ink` and `--accent` light
  (`.ft-dark .stage`), so letters, words, the letter family's hands and the tracing dots follow – the on-screen keys keep
  their dark outlines and the letters' eyes their dark pupils. A new colour on the card uses `--ink` or `--accent`, never
  a fixed dark one, or it vanishes on the dark page.
- Mitmachen, `/mitmachen/` (`MovePlay.tsx`, `move.css`; L-15): a digit, or any other key for a number by chance, has a
  fox or bear child hop, clap or stamp that many times (the three take turns), alone; it
  invites first („Hüpf mit!“ – hop and clap from the pack's doing words, `joinIn`), then counts each one aloud with a
  wait between (`BEAT_MS`), so the child can join in. A row of marks under the digit fills one by one. Keys during a
  round only ripple; a tap on the child afterwards plays the same number again. No ⚙️: nothing to choose.
- Wörter tippen, `/woerter/`: the whole word (`WordsPlay.tsx`: picture words, colour words, doing words or all of them
  mixed, all from the language pack), or the first letter, which plays „Wo ist das B?“ (`FindPlay.tsx`: find the key
  for a shown letter). On a touch screen, where the on-screen keys show, both play with a few big keys instead of the
  whole alphabet (W-02, `BigKeys.tsx`, `fewKeys.ts`, `bigKeys.css`): the right one and others that never type it too
  (not A beside Ä, not ख beside क; `bigKeyChoices`, from `findableLetters`), beside the picture on a wide screen (one
  column up to three keys, two for more, clear of the notes top right) and under it on an upright one (rows of up to
  three). They are dealt anew for each letter and stay put while it is looked for. Their number finds itself
  (`nextKeyLevel`): three at first, one more after `GROW_AFTER` letters found at the first tap, one less after a letter
  found only after wrong taps, between 3 and 6 – more to tell apart, never faster. Grown-ups may fix it at 3, 4 or 6, or
  go back to the whole keyboard, behind ⚙️ in the Tablet group (`bigKeys`, shown only where the on-screen keys show).
  Among a few keys the right one is marked only after `HINT_AFTER_WRONG` wrong taps, still (`.hint`, never pulsing) –
  lit at once there would be nothing to find; „Wo ist das B?“ presses it down and lights it once found (`.lit`).
- Wo ist das kleine b?, `/gross-klein/` (`CasePlay.tsx`, `case.css`; L-23, published, playable from the menu): a big letter
  looks for its child among three small letters; the right one (tapped, or its key pressed) walks over in
  little hops and stands beside it, a wrong one shakes its head. Three rounds in a row found at the first tap bring
  look-alikes (b next to d, `ALIKE`), a wrong tap among them plainly different ones again (`choicesFor`). Only letters
  with a big and a small form and no marks over them (`caseLetters`: no umlauts, no Й); Hindi and Arabic, which have
  one form, play it in English. It asks „Wo ist das kleine …?“ (`SMALL_PROMPT`, in German, English, Chinese, Spanish and Russian, recorded only in
  German so far, silent where not) and says the letter's name when found, from the recordings of the other games. No ⚙️.

`LettersGame way={…}` is all five (`LettersPage.tsx` has a page for each); names and table-of-contents lines in
`names.ts`. Each plays at once (`startMode`) with no start screen: ✕ goes back to the book's table of contents,
the page before it.

## Rules

- Letters in „Wo ist das kleine b?“ carry nothing drawn on them – no eyes, no chain or hands joining big and small
  (user feedback, November 2026: they distract from recognising the letter's shape). Keep the letters bare.
- The five are games of their own in the table of contents, never „Spielart“ or „Nur Zahlen“ choices behind one
  game's ⚙️: they were folded into one game once and split again (user feedback, November 2026). A new thing to do with
  letters or numbers is a new game in the book; a variant of one (which words, how numbers come) is an option of it.
- Every option is changed while playing, never in the menu: ⚙️ in the top right corner (the way back, the page's corner, takes the left), always held (`PlayOptions`),
  opens them over the game, which keeps playing behind; there is no start screen, no `level` row and no `settings`. The
  panel shows only the options of the game being played (Zählen no letters). An option that changes what comes next
  (which words, the kind of pictures) brings a new word or letter at once (the play component's `key`).
- Each game plays at once, so grown-ups wouldn't guess what waits behind ⚙️: as play starts a note under it
  (`PlayOptions intro`) names it – for Wörter tippen whole words, colours, doing words, „Wo ist das B?“. When a big
  variant is added, name it there too (user feedback, November 2026).
- Mitmachen waits at every hop, clap or stamp long enough for a small child to do it too and land (`BEAT_MS`, 1.5 s)
  – never a quick run of them: the child moving along is the point, not watching. The child is a Gemini picture in two
  frames per move (user request, November 2026; `bilder/<fuchs|baer>-<stehen|huepfen|klatschen|stampfen>.webp`): standing
  is every move's first frame, the move's own frame lies over it on the same HTML layer (`.mv-kid`) and is cut in hard
  for the moment of the move (`MOVE_SHOWN`), never cross-faded (both children would show at once); the layer itself
  hops or dips by `element.animate`. The marks under the digit are the move's symbol, also from Gemini in two frames
  (`bilder/zeichen-<move>-1|2.webp`): the first faint while to do, the second once done. All four poses of one child
  come from one 2x2 sheet, with the family picture as `--ref`, so the child stays the same; a new move gets its frame
  drawn from `<kind>-stehen.webp` as the only `--ref`. Only the child that moves stands there: a grown-up standing beside it was decoration and was taken out (user
  feedback, November 2026).
- No fox or bear stands by as decoration in these games: a family in Zählen's and Wörter tippen's corner, pointing at
  the things or the picture, was taken out (user feedback, November 2026) – children wanted to tap it and thought it
  belonged to the game. A fox or bear comes in only where it does the game's thing (Mitmachen's child, „Fuchs“ at F).
- Pressing keys quickly never turns into a din (user feedback, November 2026), yet every deliberate press answers at
  once: a second before a new letter and three before the same key again felt as if presses were lost (user feedback,
  November 2026), so the gates are short (`pace.ts`, `pace.test.ts`). In Frei tippen and Zählen a new letter or number
  comes at most every `MIN_CHANGE_MS` (¼ s), a surprise every `SURPRISE.gapMs`, the same key again – and a tap on the
  card or its picture again – only after `SAME_KEY_PAUSE_MS` (1.2 s, `repeats`, Space, Enter, arrows and Backspace too:
  the card still moves, silently), and
  the soft note of a press that sets nothing off at most every `EXTRA_SOUND_GAP_MS` in all four games (`useSoftTap`).
  Presses the game asks for again (the next step, tapping each thing, the digit of `digitOnRepeat`) keep answering at once.
- Frei tippen's surprises (user request, November 2026): a key that is no letter or number and has no job of its own
  (arrows and Backspace keep theirs), Space and Enter, or a tap beside the card, opens a surprise – Space and Enter do
  their own thing (the card's jump, the horn or whistle) only when no surprise can come now, pressed quickly again (user
  request, November 2026; `specialKey`; in step-by-step counting they still reveal the next part first). A surprise is a firework, a present
  with a toy, an egg a baby animal hatches from, balloons that pop, flowers growing, soap bubbles, a rainbow – a tap
  right where the finger landed, a key somewhere on the stage clear of the card. The kinds take turns from a shuffled
  bag, never the same twice in a row, and each is drawn anew every time (colours, pattern, burst, what comes out), so
  every press brings something new. It appears, does its thing and goes again by itself within `SURPRISE.lifeMs`. Never a
  storm: a new one at most every `SURPRISE.gapMs` (¼ s), at most `SURPRISE.maxAtOnce` at once, presses between only ripple; its
  sound answers at once, a second one only as a spaced extra. Each is a few small HTML layers moved only by transform and
  opacity (`surprises.test.ts`, perf stretch „Überraschungen“). Zählen and the other games keep their calm ripples: this
  is Frei tippen's own, never a pattern for other games' answers (root `CLAUDE.md`). A new kind goes into
  `SURPRISE_KINDS`, its classes into the test's `CLASSES`.
- Choices show the plain value, not an example to decode: the word length is the number of letters (3, 4, 7).
- „Wörter tippen“ has no settings of its own: no own letter case, picture reveal, „any key types“ or tablet keys;
  it uses the shared ones (pictures theme, letters, on-screen keys). Don't add them back. The one exception is how many
  big keys a touch screen shows (W-02, above), which finds itself unless a grown-up fixes it. The letters
  (A / A a / a) are shared by Frei tippen and Wörter tippen – the words too („A a“ writes „Bär“).
- On a phone on its side (Frei tippen and Zählen) letter, picture and word – or the things and the digit – stand side by
  side, not stacked: the on-screen keys leave little height, and stacked they would be tiny (`letters.css`, end).
- One right key is all a round of „Wo ist das B?“ and „Wörter tippen“ takes: after a short moment (`CELEBRATE_MS`) the
  next letter comes by itself (in „Wo ist das B?“), never waiting for another key or tap. The right key's answer is the
  key pressed down and lit, the word said (and a colour word's colour, a doing word acted out) – no shower of shapes, no
  hopping picture or letters (root `CLAUDE.md`). Keys and taps during that moment only make ripples and sounds.

## Languages

The language packs in `src/content/` (`de`, `en`, `tr`, `pl`, `ru`, `es`, `zh`, `hi`, `ar`). The game plays in the pack of
the app language (🌐, `useLanguagePack()`), never in another one and never with a second one next to it; it has no language choice of its own.
- What the game says is played from its ElevenLabs recording (`voice.ts`, `useLettersSay`, files in `stimme/`), recorded
  in every app language (November 2026), each in the pack of its language. A new
  or changed line comes onto the list by `src/content/voiceLines.ts` (`letters()`), is recorded with `bun run voice make
  --only buchstaben` only when the user asks, and must be said exactly as listed – `eins!` with its „!“, never `eins`,
  or its recording is never found. Two lines in a row (a word, then the praise) are said one after the other (`queue`),
  never joined into one sentence, which has no recording. The counting sentences („drei Äpfel!“) are recorded too
  (November 2026); one without its recording (a new thing to count) says the number word alone (`sentenceFor`).
- The recordings are hundreds of lines a language, so the game never loads them all (`loadAll`): Frei tippen and Zählen
  load what the next press can say as play starts and after each press (`loadAhead`: every number with the things it
  counts next – drawn one ahead, `nextThing` – and every letter with its next word); Mitmachen its number words and
  invitations. Wörter tippen and „Wo ist das B?“ draw each word or letter one round ahead: the next one's lines load
  while this one is played, and a round comes on screen only once its lines are there (`useVoiceReady`, the paw track
  meanwhile), so its first line comes with its picture. A new line the game says goes into those lists.
- Grown-up texts (start screen, options, hints on the play screen) go through `useT()` (`t({ de, ru, en, zh, hi, es, ar })`);
  new lines come in English only (`t({ en: "…" })`, root `CLAUDE.md`, Language) until translations are asked for,
  German included, and a changed line of the older German-first ones is changed in its German; both marked in `languageStatus.ts`.
- Every key event goes through `keyOf(e, pack)` before the game looks at it: a pack with `letterOfKey` types by key
  place on its own keyboard, also on a German one (Russian ЙЦУКЕН Q = Й, Hindi InScript K = क, Arabic F = ب, Spanish Ñ
  right of L). Compare keys only with `keyMatches`/`toUpper(…, pack)`, never with `e.key` directly. `keyMatches` lets the
  plain letter count for its forms (A for Á, ا for أ/إ, ت for ة) and, in Hindi, a key for both its letters (`sameKey`:
  क and ख on K) – a toddler never needs Shift.
- Words are typed and marked in pieces (`textUnits`, `src/content/spelling.ts`), never in single code points: a Hindi
  letter with its vowel sign and joined consonants (कि, ट्र) is one piece, typed by its first letter (क) and said as it
  sounds; an Arabic letter is one piece and keeps its joined shape when drawn on its own (`joinedForms`, zero-width
  joiners), and Arabic slots run right to left. Chinese words are typed and marked by their pinyin (`WordEntry.spelling`,
  with tone marks, no key needed for a tone): the characters stand above, the pinyin under them; the voice says the
  Chinese word, and letters are named as Chinese children read pinyin (b → 玻).
- Hindi and Arabic letters have one form (`hasCase`): the options hide A / A a / a and the game plays with the one form.
- The examples in the options use `sampleLetter` (B, Russian Б, or the pack's `exampleLetter`: Hindi क, Arabic ب).
- A new pack needs every letter with a spoken name and words (a letter no word starts with, like Ъ Ы Ь, Hindi ङ ञ ण ष
  or pinyin I O U, gets `inWord: true` and words with it inside; the card marks it there), number words 0–9, counting
  that is right for 0–9 (three forms in `ru.ts`/`pl.ts`, gender and dual in `ar.ts`, measure words in `zh.ts`) and keyboard
  rows covering every letter. A pack in another script says and shows no Latin letters (pinyin aside). Every piece of every
  word must have a letter in the pack, or the on-screen keys can't type it. `content.test.ts` and `packs.test.ts` check
  this; add a check for any new rule. Colours and doing words of a new pack are `relabel(de.colors|de.actions, …)`, one
  word each (they must be typeable: Hindi leaves out sleep, wave and clap, which need two words).
- "Wo ist das B?" only asks for letters with a key of their own on most keyboards (`findableLetters`: no umlauts, no Ё,
  no Ñ; in Hindi and Arabic the letters printed on the keyboard rows, none that needs Shift).
- Each key pops a big card: `.card` has `will-change: transform, opacity` so the pop-in scales a finished layer (A-27, perf: 29.9 → 26 screens/s rastered, limit 30); a new big card that pops in does the same.
