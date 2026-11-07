# Schatten finden

Route `/schatten/`.

Its card plays at once (`startMode`): there is nothing to choose before playing, and ✕ goes back to the table of contents („Was gehört zum Tier?“ …), never to a start screen with only „Los geht’s!“. A picture looks for its shadow among 2–6 black ones (the same emoji with `filter: brightness(0)`); tap the right shadow or drag the picture onto it, or choose with arrow keys + Enter / 1–6. A wrong shadow shows its colours for a moment (spoken: "Das ist die Giraffe."). Pictures and texts in `content.ts`, by theme (Tiere, Fahrzeuge, Essen, Dinge).

**Difficulty** (`SHADOW_LEVELS`, `nextLevel`, `dealShadows` in `levels.ts`, like Socken-Paare): it begins with 2 shadows of different kinds (an animal among a car and a banana), then 3, then 3 of the same kind (`alike`), up to 6. After each picture, from the wrong shadows tapped in the pictures on the current step: two pictures in a row without one → one up; two in one picture, or one in each of two pictures in a row → one down. Time plays no part (a slow but sure child climbs too). Every visit begins on the first step.

**Kind of pictures**: mixed at the start of every visit (not saved). The button in the top left corner (its emoji; four small ones for mixed) opens a row of five emoji buttons below it: mixed, Tiere, Fahrzeuge, Essen, Dinge. Picking one brings a new picture of it at once, on the same step; a tap anywhere else closes the row. With one kind only, `alike` makes no difference.

„Wer schaut da raus?“ (idea X-04, `PeekPlay.tsx`): one kind of round of "Was gehört zum Tier?", which plays it in turn with feeding and homes and sets how hard it is (see `src/games/animals/CLAUDE.md`). It lives here since it shares the stage, pictures and glyphs with the shadows: only a part of an animal peeks out of a bush (top, left or right) or the pond (`hideouts.tsx`) – nothing stands beside it (a fox or bear family pointing at the bush was decoration and was taken out, user feedback, November 2026) –, or on the hardest steps shows only through gaps in the bush's leaves (`pk-hole`); the child taps the whole animal among 2–5 below, and it comes out; tapping the bush rustles it and the animal makes its noise. The emoji is drawn on a canvas and cut to its outline (`glyph.ts`, which also measures where it is drawn for the gaps), so the part that shows is the same on every system. The rules below are for the shadows only.

## Rules

- Nothing to read for the child while playing: no question, no numbers, nothing on a wrong shadow. Only for grown-ups,
  each shadow (and each whole animal in „Wer schaut da raus?“) has its name small and quiet below it (`.sh-name`, the
  picture's name from `texts.name`, in the app language), one line, centred (user feedback, November 2026).
- The shadows are as big as the meadow below the picture allows – 2 to 6 in a row (2 or 3 to a row on a phone held
  upright, `choiceRows` in `levels.ts`), clear of the page's paper margin, with room kept below for their names
  (`--name-room`); sizes come from the meadow as a size container (`--size` in `shadows.css`), never from fixed `vh`
  caps (user feedback, November 2026: the buttons were small with room to spare).
- No options: no start screen before playing and no settings. Difficulty comes from `nextLevel`, the kind of pictures from the button while playing – the user asked for both.
- A wrong shadow never shows or sounds as wrong; it only feeds `nextLevel`.
- Harder means more shadows and closer outlines, never quicker: no clock, and time doesn't count for the difficulty.
- Exactly one shadow fits (X-14): pictures whose black shadows can't be told apart on Apple's or Google's emojis
  (pig, sheep and turtle on Android, cat and dog on an iPhone, apple and strawberry, mushroom and tree) are listed in
  `SHADOW_LOOKALIKES` and never dealt together; `shadows.test.ts` checks every step. Closer outlines make a step harder
  only while each can still be told apart. A new picture is looked at in black next to the pictures closest to it, in
  both fonts (Noto Color Emoji from Google Fonts in the preview), and joins the list where it is one of them; the same
  goes for „Wer schaut da raus?“ (`PEEK_LOOKALIKES`: what peeks out, in colour, at the hardest share and through the
  gaps – the cat's and the dog's tail, grey elephant, cow and sheep, grey-white rabbit and mouse). Plain fur of one
  colour is what gives animals away least through the gaps: the brown and tan ones (monkey, deer, kangaroo, camel, goat,
  horse), the grey ones and the green ones are paired there. A new animal goes into exactly one `PEEK_LOOKS` group and,
  when it lives in water, into `IN_THE_POND`; only whole bodies, never a face or a round blob (🐤 and 🐸 are faces). Of two animals that are the same shape (tiger and leopard, camel and dromedary, dolphin and shark) take one.

## Languages

Both games speak the app language (German, English, Chinese, Hindi, Spanish, Arabic or Russian, `useAppLanguage()`): start screen texts inline with `t({ de, en, zh, hi, es, ar, ru })`, game texts through `pick(SHADOW_TEXTS, language.id)` (`ShadowTexts` in `content.ts`). Every sentence is said from its ElevenLabs recording (`voice.ts`, files in `stimme/`), recorded in German only so far
(November 2026): a sentence in another language stays silent until the user asks for its recordings, a German fallback
sentence plays its German one. A new or changed sentence is listed by `src/content/recordedLines.ts` (`schatten`) and recorded with
`bun run voice make --only schatten`, only when the user asks. „Wer schaut da raus?“ speaks with Was gehört zum Tier?'s recordings (`animalsVoice`). Each other language is a `content.<lang>.ts` (en, zh, hi, es, ar, ru), listed in `src/content/texts/texts-<lang>.ts` (which fills `SHADOW_TRANSLATIONS`): the pictures' names by id in the shape its grammar needs – English and Spanish `many` for plural words („scissors are“, „las tijeras buscan“), Spanish the article („del elefante“); Hindi the oblique form before की (कछुए की) and sentences without gendered verbs („… की परछाईं कहाँ है?“, „यह … है।“); Arabic `female` for the verb and pronoun (يبحث عن ظله / تبحث عن ظلها) and `the` where ال can't simply go in front; Russian the genitive for „Вот тень слона!“ and `many` („ножницы ищут“).
- Translations come only when the user asks. A new or changed German line comes German-only; add the other languages only on request. Gaps are marked in `src/content/ideas/languageStatus.ts`.
- A new picture comes German only: its id goes on `GERMAN_ONLY` in `content.ts` (November 2026: twenty animals of „Wer schaut da raus?“, from the tiger to the lizard), `shadows.test.ts` checks that the translated languages name every other picture and none of these yet, and the Schatten finden row in `languageStatus.ts` says what is missing. Once the user asks for their translations, they come off the list.
- When a German line changes its meaning, delete its translations in the same change (a stale translation is worse than German).
- A picture without its name in a language is said entirely in German (the language's texts function takes the whole German sentence, and `say` plays that German sentence's German recording). `shadows.test.ts` checks that no id is stale, that the languages translated so far name every picture, that Russian, Chinese, Hindi and Arabic have no Latin letters, and that the fallback works.
- Sentences must not use the past tense or depend on the picture's gender where the language can avoid it (no „нашёл/нашла“, no „его/её“; Hindi without रहा/रही); use the stored forms.
- Never show `item.name` directly; it is German. Use `texts.name(item)`.
