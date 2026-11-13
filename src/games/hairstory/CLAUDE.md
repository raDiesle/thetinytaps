# Tapsi and the Foam Crown

Route `/haare-waschen/` · idea H-14 · research „haare-waschen“.

The book „Hair Washing“ among the Alltagshelfer, right of „Kita-Start“ (`HAIR_STORY_BOOK`, a spine book of its own,
playing at once): a story about washing hair without drama, in chapters like „Abstillen“, „Schnullerfee“ and
„Kita-Start“ (user request, 13 November 2026: „erstelle eine neue Alltagshelfer-Buch zu Haare waschen im gleichen Stil“),
read by a grown-up with the child before hair-washing night, or on it.

Tapsi the fox (the same family and home as in the other three books) has porridge and sand in the hair. Mama says that
tonight is hair-washing night – not every night – and in which order it goes, and listens when Tapsi says what Tapsi
doesn't like: water in the eyes. Tapsi practises on the plush bunny with an empty cup and the cloth, then washes Mama's
hair. In the bathroom Tapsi picks the red cup and the apple shampoo, feels the water and holds the green washcloth.
Head back, looking up at the sun on the ceiling, a foam crown seen in the mirror, „Now!“, Mama counts and rinses with the
cup – the eyes stay dry. Once a drop runs into Tapsi's eyes: Mama stops at once, dries the face, Tapsi may cry, and
Tapsi decides – more water or stop for today. Then the warm yellow towel, Papa rubs the hair dry, says what Tapsi did
all alone, and in bed Tapsi promises the bunny a foam crown next time.
- `hairStory.ts`: the chapters and pages (`HAIR_STORY`) and the steps of washing hair gently (`WASH_STEPS`).
- `hairStoryPictures.ts`: the Gemini prompt of every page (place, light, cast and clothes, bunny, cup, washcloth,
  shampoo, towel, mirror), as the picture queue takes them; a made picture goes on `MADE`.
- `HairStoryGame.tsx` plays it with the shared `ChapterBook` (`first="en"`, dev tags `H0`, `H<chapter>-<page>`). A
  change to how the book reads goes there, so all four get it. Tapsi's voice reads each page (`voice`, from `stimme/`,
  listed in `recordedLines.ts` as `haare-waschen`, recorded only when the user asks), and the loudspeaker above ▶
  switches it off (`VoiceSwitch`); a page without its recording stays silent.
- `names.ts`: the book's name on the shelf, the story's title and its blurb.

## Rules

- **The first English-first chapter book** (root CLAUDE.md, Language): pages, title, book name and blurb were written in
  English and translated on request the same day (13 November 2026) into every app language, German as one of them:
  `<language>.ts` here, loaded with `texts-<language>.ts` (German's chunk `texts-de.ts` began with this book). A changed
  page is changed in English first, and its translations deleted until made again (they fall back to English, never
  German). `ChapterBook first="en"`: a page without a translation shows and is said in English; `recordedLines.ts`
  records a translated page with that language's voice.
- **The chapters follow the guides' steps in their order** (`WASH_STEPS`, checked): tell what comes and in which order,
  practise on a soft toy and on a grown-up, let the child choose and join in, keep the eyes dry, stop when it is too
  much, the warm towel and praise afterwards. The last chapter only tells the story.
- Never forced: when it is too much, Mama stops at once, Tapsi may cry, and Tapsi decides how to go on (checked).
  Nobody holds Tapsi still, scolds, hurries or praises by „good boy“; no clock, age or weekday (checked). Lines ≤ 110
  characters, in the present tense, ending in love.
- **A grown-up is beside Tapsi in every picture in the bath** (checked): the guides agree never to leave a small child
  alone in the tub, not even for a moment.
- In the bath, bubbles take the place of clothes: Tapsi sits in water to the tummy under thick foam up to the
  shoulders (`tapsiWears`) – the one exception to the foxes' clothes in every picture.
- Tapsi is an animal, not the child's figure, so it does not follow „Junge / Mädchen“.
- Pictures (`/bild-erzeugen`, read Kita-Start's lessons in `src/games/kitastory/CLAUDE.md` first – they all hold here):
  the living room and Tapsi's room are drawn from the other books' pictures; the bathroom once from the fox family
  (`PLACES.bad.first`, page „becher“) and every other bath page from it. So a thing wrongly in „becher“ comes back on 14
  pages: look at it hardest before the bath pages are made. Its first take had a second shampoo bottle on the shelf
  beside the one in Mama's paw, though the prompt said „only one“, and was edited out („keep it exactly, remove only
  …“) before the other bath pages were drawn. Tapsi washing the bunny „very seriously“ came back frowning as if angry:
  never „seriously“ or „concentrating“ for a child doing something gently – name the face (a calm, caring little
  smile), and look at every face before keeping a picture. Put each character where the reference has it (Tapsi on the rug, Mama on the sofa; Tapsi on the bed), and
  count the characters, each once, and look for stray tails. The first bath pictures came back with a
  see-through tub showing Tapsi's body like a glass bowl, Tapsi lying with the head over the tub's edge while Mama
  poured onto the face, and a second red cup or shampoo bottle in Mama's other paw – each though „only one“ was said:
  every bath prompt ends with `IN_THE_BATH` (checked). A thing too many, a see-through tub or a face is fixed by
  editing the picture; a wrong pose is not – Tapsi's head over the tub's edge came back unchanged from an edit – so draw
  that page anew with a page text that places the pose plainly („its whole head inside the tub“).
