# Buchstaben & Zahlen

The book „Buchstaben & Zahlen“ holds four games, each a page of its table of contents (`games.ts`), sharing this folder
and one store of settings (`tinytaps.letters.v2`, so letters, pictures and keys stay as chosen in each):
- Frei tippen, `/buchstaben/` (`LettersPlay.tsx`): every key shows its letter with a picture and word; a number shows its
  things and digit at once, or optionally counts them aloud, step by step or by tapping each thing.
- Zählen, `/zaehlen/` (`LettersPlay.tsx` with `numbersOnly`): only numbers come – a digit shows itself, any other key
  without a meaning of its own (Space, Enter, arrows, Backspace keep theirs) brings a number from 1 to 9 by chance; on
  touch screens only the digit keys. With `digitOnRepeat` (for „Alles sofort“ and „Vorzählen“, in both games) a number
  shows its things first and its digit only when the same number is pressed again right after.
- Mitmachen, `/mitmachen/` (`MovePlay.tsx`, `move.css`; L-15): a digit, or any other key for a number by chance, has a
  fox or bear child hop, clap or stamp that many times (the three take turns), alone; it
  invites first („Hüpf mit!“ – hop and clap from the pack's doing words, `joinIn`), then counts each one aloud with a
  wait between (`BEAT_MS`), so the child can join in. A row of marks under the digit fills one by one. Keys during a
  round only ripple; a tap on the child afterwards plays the same number again. No ⚙️: nothing to choose.
- Wörter tippen, `/woerter/`: the whole word (`WordsPlay.tsx`: picture words, colour words, doing words or all of them
  mixed, all from the language pack), or the first letter, which plays „Wo ist das B?“ (`FindPlay.tsx`: find the key
  for a shown letter).

`LettersGame way={…}` is all four (`LettersPage.tsx` has a page for each); names and table-of-contents lines in
`names.ts`. Each plays at once (`startMode`) with no start screen: ✕ goes back to the book's table of contents,
the page before it.

## Rules

- The four are games of their own in the table of contents, never „Spielart“ or „Nur Zahlen“ choices behind one
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
- Pressing keys quickly never turns into a din (user feedback, November 2026): in Frei tippen and Zählen a new letter or
  number comes at most every `MIN_CHANGE_MS` (1 s), the same key again – and a tap on the card or its picture again –
  only after `REPEAT_PAUSE_MS` (`repeats`, Space, Enter, arrows and Backspace too: the card still moves, silently), and
  the soft note of a press that sets nothing off at most every `EXTRA_SOUND_GAP_MS` in all four games (`useSoftTap`).
  Presses the game asks for again (the next step, tapping each thing, the digit of `digitOnRepeat`) keep answering at once.
- Choices show the plain value, not an example to decode: the word length is the number of letters (3, 4, 7).
- „Wörter tippen“ has no settings of its own: no own letter case, picture reveal, „any key types“ or tablet keys;
  it uses the shared ones (pictures theme, letters, on-screen keys). Don't add them back. The letters
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
- Grown-up texts (start screen, options, hints on the play screen) go through `useT()` (`t({ de, ru, en, zh, hi, es, ar })`);
  new or changed lines come German-only until translations are asked for, marked in `languageStatus.ts`.
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
