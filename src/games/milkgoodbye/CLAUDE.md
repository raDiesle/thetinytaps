# Three More Sleeps

Route `/abstillen/abschied/` · idea H-143 · research „abstillen-kapitel“.

A third story in the book „Abstillen“ (user request, 22 November 2026: „eine weitere Geschichte, die kürzer ist als
ganz abstillen“), for weaning altogether on one day set beforehand, with a little goodbye party – for a child who drinks
only now and then any more, or a family that wants the end plain and near rather than one milk time after the other over
weeks, as „Tapsis Milchkette“ (`src/games/milkchain`) tells it. Twelve pages in four chapters, about three minutes. In the
book's choice (`MilkChainGame.tsx`) it is „With a goodbye party“ / „Mit Abschiedsfest“ (`GOODBYE_MILK_KIND`), its
title „Three More Sleeps“ / „Noch dreimal schlafen“; the address names the story.

Tapsi the fox (the same family and home as the other chapter books) is big and still drinks at Mama's breast. Mama says
her breast has made milk for so long, and in three sleeps they say goodbye to the milk; Tapsi doesn't want that and is
hugged. Three red paper hearts stand on Tapsi's shelf, one taken away each morning, and until then there is still milk
and a long cuddle; Tapsi bakes a cake with Papa. When the last heart is gone Tapsi drinks one last time, slowly, waves
„Thank you, Mama's breast! Goodbye, milk!“, and there is cake and a new orange cup just for Tapsi. In the evening Tapsi
wants milk, is angry and cries, held by Mama and Papa; every day gets easier – the milk is gone, but cuddles stay.
- `goodbyeMilk.ts`: the chapters and pages (`GOODBYE_MILK`), the steps of weaning on a set day (`GOODBYE_STEPS`), and
  each page's place, light, cast and picture.
- `goodbyeMilkPictures.ts`: the Gemini prompt of every page (reference room, light, cast and clothes, the hearts, cup,
  cake and teddy, nursing), as the picture queue takes them; a made picture goes on `MADE`. What is left once all are
  made stands in their `after`.
- `story.ts`: what the book needs from this folder – Tapsi's voice (`GOODBYE_VOICE`, from `stimme/`, listed in
  `recordedLines.ts` as `abstillen-abschied`, recorded only when the user asks), the pictures (`goodbyePictureOf`) and the
  translations (`GOODBYE_TRANSLATIONS`, through `byLanguage`). The book plays it with the shared `ChapterBook`
  (`first="en"`, dev tags `F<chapter>-<page>`, `level="abschied"` so its trophy is its own, named in `trophyNames.ts`).
- `names.ts`: the story's title and its name in the book's choice, in all seven languages.
- `de.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts`, `ru.ts`: the story in the other languages (`StoryTranslation`, keyed by
  chapter and page id), loaded only with `texts-<language>.ts` (`goodbyeMilk`) – never imported by the game.

## Rules

- **Not published until its pictures are made**: players don't see it (the book's choice leaves out a story without a
  picture, `ChapterBook`'s `withPictures`), and `/abstillen/abschied/` stays in `WAITING_PATHS` (`seo.ts`: out of the search
  pages, `noindex`) with its search texts waiting. The twelve pictures wait in the picture queue for a Claude cloud session (`/paid-queue`); their `after` says
  what to do then (MADE, WAITING_PATHS, naming the story in the search texts of `/abstillen/` and in `MILK_CHAIN_BLURB`,
  the language row, this file, `bun run previews /abstillen/`).
- **Written English first, translated into all seven languages** (`<language>.ts`, checked in `goodbyeMilk.test.ts`:
  every chapter and page, Tapsi in each language's script, the breast named, no Latin letters in Russian, Chinese, Hindi
  or Arabic). A changed page changes its line in every language in the same commit. Tapsi's grammar follows the other
  Abstillen stories (masculine in Russian, Hindi and Arabic).
- **The chapters follow the guides' steps in their order** (`GOODBYE_STEPS`, checked): tell beforehand, why and when;
  make the days until then something to see and touch, with the milk still there; drink one last time on purpose, say
  thank you and celebrate; afterwards let the child miss it, always in a grown-up's arms.
- **Shorter than „Tapsis Milchkette“, by far** (checked: at most a third of its pages): a new page earns its place.
- **The milk is gone after the day** (checked): Tapsi drinks only before the goodbye, plainly at Mama's breast (`NURSING`
  of the Milchkette's pictures), never „just once more“. Tapsi may be sad, angry and cry, always held by a grown-up; no
  scolding, no hurrying; no clock, age or weekday – „three sleeps“ is the story's own count, each family picks its day.
- Tapsi is an animal, not the child's figure, so it does not follow „Junge / Mädchen“.
- Pictures (`/bild-erzeugen`, made only in a Claude cloud session; read Kita-Start's and the Schnullerfee's lessons):
  the living room and the kitchen are drawn from the Milchkette's „kette-fragen-nicht“ and „kette-essen“, Tapsi's room
  from the Schnullerfee's „fee-drei“ – never from a Milchkette picture of Tapsi's room, whose chain of milk drops would
  come back (checked). Count the foxes and the paper hearts on every picture (three, then two on the shelf and one in
  Tapsi's paw, then none) and look for a second cup or cake.
