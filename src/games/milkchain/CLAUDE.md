# Tapsis Milchkette

Route `/milchkette/` · idea H-44 (with „Abstillen“, `src/games/weaning/`) · research „abstillen-kapitel“.

The second, deeper weaning story (user request, 9 November 2026), read by a grown-up with the child chapter by chapter:
Tapsi the fox drank at Mama's breast as a baby and is big now; Mama tells why the milk may go, and over Tapsi's bed hangs
a chain with one milk drop per milk time. Chapter by chapter one drop goes – the day's, the evening's, the night's and
last the morning's – into a little box to remember it, and what comes instead hangs there (ball, book, star, cup). Then
Tapsi misses it, lays the head on Mama's breast and hears her heart, and Mama and Papa love Tapsi as before.
Still being built (`unfinished`, user decision): reached only from „🚧 In Arbeit“ on `/management/`, ✕ goes back there.
- `milkChain.ts`: the chapters and pages (`MILK_CHAIN`), the steps of gentle weaning (`GENTLE_STEPS`), the order the
  milk times go (`MILK_ORDER`), what comes instead (`INSTEAD`) and which drops are gone on a page (`goneOn`).
- `milkChainPictures.ts`: the Gemini prompt of every page (place, light, chain, cast and clothes, nursing), as the
  picture queue takes them; a made picture goes on `MADE`.
- `MilkChainPlay.tsx`: one page per tap or key (← and Backspace back, ◀ for the grown-up), the picture as big as the
  room allows, under it the chapter's title on its first page and the sentence to read aloud; a paper placeholder where
  a picture isn't made yet; `GameEnd` small in the corners on the last page; `DevTag` `K<chapter>-<page>`.
- `en.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts`, `ru.ts`: the chapters' titles and the pages' sentences in each language
  (user request, 9 November 2026), imported only by `src/content/texts/texts-<lang>.ts` and read with `byLanguage`.
- `names.ts`: title and blurb in every language. `milkchain.css`: classes `mk-`.

## Rules

- **The chapters follow the steps of gentle weaning in the guides' order** (`GENTLE_STEPS`, user request: „es gibt eine
  Empfehlung, in welchen Schritten man sanft abstillt – das soll sich in den Kapiteln wiederfinden“): tell the child,
  stop offering without refusing, put off and shorten, replace one milk time after the other, part falling asleep from
  drinking, the night, the farewell, then missing it. `milkchain.test.ts` checks the order. The milk times go day,
  evening, night, morning (`MILK_ORDER`, checked): the evening only after Tapsi has learnt to fall asleep with book and
  song, the night with Papa comforting, the morning last with a thank-you and a farewell.
- Everything in `src/games/weaning/CLAUDE.md`'s rules holds here too: plainly about Mama's breast (the word „Brust“ is
  said, the drinking pictures show Tapsi at the breast as a breastfeeding picture book does, `NURSING`), gentle and
  true, nobody scolds, being sad and angry is shown and held, a grown-up is always close, lines ≤ 110 characters.
- Every language has every chapter and page (`milkchain.test.ts`): a new page or chapter comes in German only and its
  languages' rows in `languageStatus.ts` say what is missing until the user asks for translations; a German line whose
  meaning changes loses its translations (they fall back to German). The rules for the child's languages hold here
  too: Tapsi in each script (Тапси, 塔普西, टैप्सी, تابسي), the breast named (Brust, breast, 乳房, छाती, pecho, صدر, грудь),
  Arabic with „let's“ instead of an imperative, Spanish without adjectives about Tapsi that change with gender.
- The sentence under the picture is for the grown-up; the child follows the pictures. No voice and no browser voice:
  a grown-up reads it.
- Pictures (`/bild-erzeugen`): each place's first picture (`FIRST`) is drawn from the fox family
  (`buch-fuechse.webp`), every other page there from that first picture as its only ref, so the room stays; full bleed,
  never a white margin or rounded corners (two first pictures came back so and were drawn again). Every page drawn from a first
  picture says where the foxes stood there and that those places are empty now (`WAS_THERE`): without it six of
  twenty pages kept a second Tapsi or Mama, or a tail lying on the rug. A page whose foxes stay where
  the first picture can't show them (Tapsi drinking on Mama's lap in the living room) is drawn from a page where they
  already are (`FROM`). Count the foxes on every picture before keeping
  it: only the cast the page names, each once, and look for stray tails.
