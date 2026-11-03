# Abstillen

Route `/abstillen/` · idea H-44 („Abstillen: Tschüss, Mama-Milch“).

A picture story for a child being weaned, read with a grown-up: Tapsi the fox was a baby and drank Mama's milk; now
Tapsi is big, runs, eats an apple, drinks from a cup, hears from Mama that the milk will soon be gone and waves it
goodbye. In the evening Tapsi wants it and is sad – Mama is close, cuddles, reads, sings a lullaby – Tapsi falls asleep
and in the morning Mama and Papa are proud. It stands on the shelf as a spine book of its own among the Alltagshelfer
and plays at once (`GameShell` `startMode`); ✕ and „Menü“ go back to the shelf.
- `content.ts`: the pages (`STEPS`) in order – id, sky (day, night, morning), the sentence, how long its moving part runs.
- `scene.tsx`: everything drawn, in SVG (1600×900, cut like a cover picture; keep what matters within x 200–1400,
  y 90–820). One room (`Room`, built once per sky) with window, shelf, lamp, rug, chair and bed; Mama sits in the chair
  and the child lies or sits between her body and her arms (`Mama`'s children); `Figures` picks what stands where per page.
- `WeaningPlay.tsx`: one page per tap or key (← and Backspace back, ◀ for the grown-up), each page's sounds (`SOUNDS`)
  and its sentence (`recordedVoice`, silent until recorded), confetti on the morning, `GameEnd` small in the corners on the
  last page (one story, so only „Menü“ and „Nochmal“).
- `weaning.css`: classes `wn-`; every animation runs a few times as its page begins and then stands still.

## Rules

- The story is gentle and true: the milk is gone and stays gone (no „just once more“), Tapsi may be sad, and a grown-up
  is always close. Nobody scolds, nothing is bad or naughty (`weaning.test.ts` checks the words). Mama's milk is shown as a
  friendly milk drop, never a breast, and the baby lies in Mama's arms.
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
