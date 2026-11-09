# Abstillen

Route `/abstillen/` · idea H-44 („Abstillen: Tschüss, Mama-Milch“).

A picture story for a child being weaned, read with a grown-up: Tapsi the fox was a baby and drank Mama's milk; now
Tapsi is big, runs, eats an apple, drinks from a cup, hears from Mama that the milk will soon be gone and waves it
goodbye. In the evening Tapsi wants it and is sad – Mama is close, cuddles, reads, sings a lullaby – Tapsi falls asleep
and in the morning Mama and Papa are proud. Once finished it stands on the shelf as a spine book of its own among the Alltagshelfer
and plays at once (`GameShell` `startMode`); ✕ goes back to the page before it. While it is being built (`unfinished` in `games.ts`, user decision, November 2026) it is not on the shelf, only linked from `/management/`, and its way back leads there.
- `content.ts`: the pages (`STEPS`) in order – id, sky (day, night, morning), the sentence, how long its moving part runs.
- `scene.tsx`: everything drawn, in SVG (1600×900, cut like a cover picture; keep what matters within x 200–1400,
  y 90–820). One room (`Room`, built once per sky) with window, shelf, lamp, rug, chair and bed; Mama sits in the chair
  and the child lies or sits between her body and her arms (`Mama`'s children); `Figures` picks what stands where per page.
- `WeaningPlay.tsx`: one page per tap or key (← and Backspace back, ◀ for the grown-up), each page's sounds (`SOUNDS`)
  and its sentence (`recordedVoice`, silent until recorded), hearts, stars and notes rising on the morning, `GameEnd` small in the corners on the
  last page (one story, so only „Nochmal“).
- `weaning.css`: classes `wn-`; every animation runs a few times as its page begins and then stands still.
- `milkChain.ts`: a second story, „Tapsis Milchkette“ (user request, 9 November 2026), German text only so far, not yet
  played: nine chapters in the order weaning guides advise (research „abstillen-kapitel“) – Tapsi as a baby at Mama's
  breast, Tapsi big, Mama tells why (milk is for babies, her breast is tired and may rest, slowly, one milk time after
  the other, being sad is allowed, she will miss it too), then the day's milk goes, the night's („Nachts schläft die
  Milch“, Papa comforts), the morning's, and last the evening's with a farewell and a small party, then missing it
  (head on Mama's breast, her heart beats) and what stays. Its motif is a chain over the bed with one milk drop per
  milk time; each drop that goes is kept in a box, and what comes instead hangs there (ball, star, cup, heart). Every
  page carries an English `picture` brief for its Gemini picture, made only when the user asks (`/bild-erzeugen`); then
  it gets played here, with each chapter readable on its own.

## Rules

- The story is gentle and true: the milk is gone and stays gone (no „just once more“), Tapsi may be sad, and a grown-up
  is always close. Nobody scolds, nothing is bad or naughty (`weaning.test.ts` checks the words), and the baby lies in
  Mama's arms.
- **It is plainly about Mama's breast** (user feedback, November 2026, replacing „a milk drop, never a breast“: a child
  doesn't understand the story otherwise): the word „Brust“ is said (`weaning.test.ts` checks the Milchkette), and the
  pictures of drinking show Tapsi at the breast as a picture book about breastfeeding does – Mama's top lifted at one
  side, the breast a soft round shape of her fur, Tapsi's face hiding the nipple, nothing more bare (`NURSING_PICTURE`
  in `milkChain.ts`). Where nobody drinks, Mama lays her paw on her breast through her clothes.
- Weaning goes one milk time after the other, the easiest first and the evening's milk at bedtime last (`MILK_ORDER`,
  checked), with the reason told in a toddler's words and the hard part shown (anger, tears, held in a grown-up's arms
  until they are done), never skipped. A new story about weaning (night only, a longer one) keeps that order.
- The sentence under the picture is for the grown-up reading along; the child follows the pictures. Keep lines short
  (≤ 80 characters, checked) and in the present tense.
- No browser voice: the story is read by the grown-up, so until its lines are recorded (`recordedLines.ts`, name
  `abstillen`) it stays silent, like every game that plays fine without it.
- Tapsi is an animal, not the child's figure, so it does not follow „Junge / Mädchen“.
- A page moved by CSS only (`transform` round each part's own (0, 0) inside a translated group, `transform-box:
  view-box`); the page left lies under the new one with its animations at their end (`wn-still`), never playing again.
- Nothing lies over Tapsi's face: on Mama's lap Tapsi sits right before her right shoulder, so that arm goes behind
  Tapsi (`holding`), and what Mama holds (the book) lies on Tapsi's lap, below its head. Look at every lap page magnified
  after changing a pose (an arm across the face and a paw on the head like a cap were only seen there).
- The Milchkette's lines may be a little longer than the first story's (≤ 110 characters, checked): it goes deeper and
  is read one chapter at a time.
