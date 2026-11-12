# Tapsi geht in die Kita

Route `/kita/` · idea H-10 · research „kita-eingewoehnung“.

The book „Kita-Start“ among the Alltagshelfer, right of „Schnullerfee“ (`KITA_STORY_BOOK`, a spine book of its own,
playing at once): a story about settling into a Kita and the morning's goodbye, in chapters like „Abstillen“ (user
request, 11 November 2026: „setze Idee H-10 im gleichen Stil wie Abstillen um“), read by a grown-up with the child.

Tapsi the fox (the same family and home as in „Abstillen“ and „Schnullerfee“) is told about the Kita, looks at it from
the street with Papa and packs the backpack with slippers and the plush bunny. In the first days Mama stays on a little
chair while Tapsi meets Mia, the teacher, and Bruno; then Mama goes out for a moment for the first time, saying she
comes back, Tapsi cries and Mia comforts, and Mama comes back. Mia takes over breakfast and comforting, Mama is at
home meanwhile (vacuuming), and she stays away longer each day, while Tapsi plays with the whole group in the garden.
Every morning the same goodbye: the same way, the jacket on the hook with the yellow star, a big squeeze, a kiss on the nose, „Ich hole dich nach dem Mittagsschlaf ab“, Mia's hand, waving at the window. Then Tapsi's
day (circle, tower, sandpit, lunch, nap), and right after the nap Mama is there, as she said.
- `kitaStory.ts`: the chapters and pages (`KITA_STORY`) and the steps of settling in (`SETTLING_STEPS`).
- `kitaStoryPictures.ts`: the Gemini prompt of every page (place, light, cast and clothes, bunny, backpack, star), as the
  picture queue takes them; a made picture goes on `MADE`.
- `KitaStoryGame.tsx` plays it with the shared `ChapterBook` (`src/components/ChapterBook.tsx`, the same as „Abstillen“
  and „Schnullerfee“; dev tags `E0`, `E<chapter>-<page>`). A change to how the book reads goes there, so all get it.
- `names.ts`: the book's name on the shelf („Kita-Start“), the story's title and its blurb – German only until the user
  asks for translations; then `<lang>.ts` files like the Schnullerfee's, imported only by `src/content/texts/texts-<lang>.ts`.

## Rules

- **The chapters follow the steps of settling in in the guides' order** (`SETTLING_STEPS`, checked, after the Berliner
  Modell): tell the child, a parent stays as a safe harbour, the first short goodbye, the teacher comforts, the same
  goodbye every morning, the day's order, coming back as said. The last chapter only tells the story.
- **The morning's chapter is the ritual a family reads every morning** (idea H-10): short (at most six pages), always the
  same, and it ends with waving, never in tears (checked) – sadness after the goodbye belongs to the teacher's chapter.
- The story is gentle and true to the guides: Mama never sneaks away (checked), says when she comes back by the day's
  order („nach dem Mittagsschlaf“), never by the clock, and comes back just then (checked). Tapsi may cry – „Das darf
  Tapsi“ – and a grown-up is always close. Nobody scolds or hurries; no days or ages are named. Lines ≤ 110 characters,
  in the present tense.
- The foxes are the family; the Kita's people are bears in roles – Mia the teacher, Bruno the friend, two children of the
  group („kinder“) and four more where the whole group plays („gruppe“) – and stay in the Kita (checked). Papa is at home and on the walk to look at the Kita.
- Where Mama is while Tapsi is in the Kita (at home, vacuuming) is shown only once she stays away longer, in Mia's
  chapter, never in the first short goodbye: there the guides keep her in the building for a few minutes (user decision,
  12 November 2026).
- Tapsi is an animal, not the child's figure, so it does not follow „Junge / Mädchen“, and the German text names Tapsi
  instead of „er“ or „sie“.
- Pictures (`/bild-erzeugen`): the living room, Tapsi's room and the path are drawn from „Abstillen“'s and the
  Schnullerfee's pictures (one home for all three books); each Kita place is drawn once (`PLACES.first`, from the fox and
  the bear family) and every other page there from it. Mia and Bruno keep their look from the page they first came in
  (`PEOPLE`), added as a further reference where the place's picture doesn't show them. Count the characters on every
  picture before keeping it, each once („kinder“ are two, „gruppe“ four), and look for stray tails.
  Gemini keeps what the reference shows where a page doesn't plainly move it: the pram of „Abstillen“'s path stood
  beside Tapsi on the way to the Kita, and Tapsi stayed on the living room's rug (with a second bunny on the sofa) when
  the page only said „on the sofa between them“. So `PLACES.was` names every thing of the reference that is gone now
  (the pram too), and a page whose character moves from the reference's place says where it is not („the rug is empty“).
  Saying the reference's places are empty isn't enough either: Mama stayed on the play room's chair (once with a second
  Tapsi on her lap, once in Mia's clothes in Mia's place), so every prompt names who of its story picture is not there
  (`absent`, checked). A pose the reference already shows (someone on the chair with Tapsi on the lap) is drawn at
  another place when others take it: Mia with Tapsi on that chair came back next to a second Mia and Tapsi. Drawn on the rug instead, a second Tapsi still sat on that chair; one more figure in an otherwise good picture is
  taken out by an edit of that picture (it as the only reference, „keep it exactly, remove only …“), not by drawing it anew. Even then Tapsi „between them on the sofa“ came back as a bunny in Tapsi's clothes with no Tapsi: put a character
  where the reference has it when the story allows (the cuddle on the rug).
  What a character wears is chosen by words of the picture text (`castOf`): Tapsi wears the rain jacket only where the
  text says „Tapsi in a jacket“ – a page with the jacket hanging on its hook once dressed Tapsi in a second one. Name
  the thing a page shows hanging or lying by its colour, so Gemini doesn't draw another one (a green „jacket“ on the
  hook beside the backpack). Bears get „only a tiny round bear tail“: Mia once came with a fox's bushy tail. People behind a
  window seen from outside came out in front of the house twice, also with „inside, seen through the glass“: draw such
  a page from inside, with the one outside seen small through the window (the waving window is the play room's).
  The Kita from the street is plainly a Kita, not a family's house (user feedback, 12 November 2026): a playground with
  toys in its garden, the front door and a big entrance gate standing wide open. A worn backpack sits on the back with
  only its straps in front (`thingsOf`): the arrival once had a second one on Tapsi's chest. Look at every face before
  keeping a picture: calm Tapsi packing came back frowning as if angry (the style block now asks for friendly faces).
