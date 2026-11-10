# Tapsi und die Schnullerfee

Route `/schnullerfee/` · idea H-11 · research „schnullerfee-kapitel“.

The book „Schnullerfee“ among the Alltagshelfer, right of „Abstillen“ (`PACIFIER_STORY_BOOK`, a spine book of its own,
playing at once): a story about saying goodbye to the pacifier, in chapters like „Abstillen“ (user request, 10 November
2026: „ähnlich wie wir es im Stil gemacht haben zu Abstillen“), read by a grown-up with the child. A first, played
Schnullerfee (SVG, one room, box or balloon) was deleted for it on the user's request the same day.

Tapsi the fox (the same family and home as in „Abstillen“) has three pacifiers, a red, a blue and a yellow one. Mama and
Papa tell of the pacifier fairy, the pacifier first stays in bed, Tapsi says the fairy may come and Papa sticks three
stars on the window, one taken down each morning; on the day Tapsi gathers the three into a box with a ribbon, kisses
them goodbye and puts the box on the windowsill with a drawing. The first night is hard, Mama and Papa stay; the fairy (a
little bear with wings) takes the box and leaves a present, a cuddly bunny that helps with falling asleep from then on.
Tapsi misses the pacifier, is comforted, and Mama and Papa love Tapsi with and without it.
- `pacifierStory.ts`: the chapters and pages (`PACIFIER_STORY`) and the steps of a gentle goodbye (`PACIFIER_STEPS`).
- `pacifierStoryPictures.ts`: the Gemini prompt of every page (place, light, cast and clothes, the pacifiers, box and
  toys), as the picture queue takes them; a made picture goes on `MADE`.
- `PacifierStoryGame.tsx` plays it with the shared `ChapterBook` (`src/components/ChapterBook.tsx`, the same as
  „Abstillen“: table of contents first, one page per tap, the picture big and the sentence small under it; dev tags
  `S0`, `S<chapter>-<page>`). A change to how the book reads goes there, so both books get it.
- `en.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts`, `ru.ts`: the chapters' titles and the pages' sentences in each language
  (translated on request, 10 November 2026), imported only by `src/content/texts/texts-<lang>.ts` and read with
  `byLanguage` (`pacifierStory`), passed to `ChapterBook` as `translations`.
- `names.ts`: the book's name on the shelf („Schnullerfee“), the story's title and its blurb in every language.

## Rules

- **The chapters follow the steps of a gentle goodbye in the guides' order** (`PACIFIER_STEPS`, checked): tell the
  child, keep the pacifier for falling asleep only, pick the day together, gather and give them away, the first night,
  the swap, stay with it. A chapter without a step (the start, the farewell, the fairy, the end) only tells the story.
- The story is gentle and true: the child takes part and decides the day, nothing is done behind its back (no cut
  pacifier, no trick), and the pacifiers stay gone – after the fairy took them no picture shows one again (checked).
  Tapsi may cry and be sad, a grown-up is always close. Nobody scolds, nothing is bad or for babies only
  (`pacifierstory.test.ts` checks the words). No age is named. Lines ≤ 110 characters, in the present tense.
- The fairy is a bear in a role and comes alone, only at night, while Tapsi sleeps or on her way (checked); she only
  ever gives. The foxes are the family: Tapsi, Mama and Papa Fuchs, never a fox or bear only standing by.
- Tapsi is an animal, not the child's figure, so it does not follow „Junge / Mädchen“, and the German text names Tapsi
  instead of „er“ or „sie“, as „Abstillen“ does.
- Every language has every chapter and page (`pacifierstory.test.ts`): a new page or chapter comes in German only and
  the row in `languageStatus.ts` says what is missing until the user asks for translations; a German line whose meaning
  changes loses its translations (they fall back to German). The child's languages' rules hold: Tapsi in each script
  (Тапси, 塔普西, टैप्सी, تابسي), the pacifier named the same way throughout (pacifier, 奶嘴, चुसनी, chupete, لهاية,
  пустышка), Arabic with „let's“ instead of an imperative, Spanish without adjectives about Tapsi that change with
  gender; Tapsi's grammar follows „Abstillen“'s (masculine in Russian, Hindi and Arabic).
- Pictures (`/bild-erzeugen`): the living room and the garden are drawn from the first pictures of „Abstillen“'s
  (`kette-fragen-nicht`, `kette-tag-raus`), so both books show one home; Tapsi's room is drawn once from the fox family
  (`fee-drei`, with a wide windowsill for the stars, the box and the fairy) and every other page there from it; the
  night sky from the page where the fairy comes in (`fee-kommt`), so she looks the same. Every prompt names where the
  characters stand in its reference and says those places are empty now (`PLACES.was`). A picture text names a
  pacifier only where one is drawn (the prompt then adds what the three look like) – „without pacifier“ made one appear.
  Count the characters on every picture before keeping it, each once, and look for stray tails and a second fairy.
  Gemini doubles what a page shows at two moments at once, and „only one“ in the prompt doesn't stop it: a lid held
  over an open box came back as a second lid on the rug (twice), a box being set on the sill as a second box already
  there, Tapsi on Mama's lap as a second Tapsi on the rug where the reference had one. So a picture shows each thing at
  one place only (the lid lying beside the box, the box already standing), and a character where the reference had it
  if the story allows. Say where feet are: „at the windowsill on tiptoes“ put Tapsi standing on the sill.
