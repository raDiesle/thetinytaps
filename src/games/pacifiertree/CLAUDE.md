# Tapsi and the Pacifier Tree

Routes `/schnullerfee/baum/` and `/schnullerfee/baum/kurz/` · idea H-145 · research „schnullerfee-kapitel“.

The second story in the book „Schnullerfee“ (`src/games/pacifierstory`), for families who want no fairy: Tapsi hangs the
pacifiers on the pacifier tree in the park – a real custom in many towns – and says goodbye there (user request, 23
November 2026: „berücksichtige, dass unterschiedliche Länge und zwei Versionen kurz lang anzubieten perfekt ist“). Twenty
pages in seven chapters, about five minutes, and a short version of eleven of its own pages, about three: beside the
fairy's 40 and 18 pages the book offers four lengths. In the book's choice (`PacifierStoryGame.tsx`) it is „At the
pacifier tree“ / „Am Schnullerbaum“ (`TREE_KIND`), beside „With the pacifier fairy“ (`PACIFIER_FAIRY_KIND`).

Tapsi the fox (the same family and home as the other chapter books) has three pacifiers, a red, a blue and a yellow one,
as in the fairy's story. Papa shows a book with the pacifier tree; Tapsi holds them tight („Mine!“) and is hugged. The
pacifiers stay in bed in the daytime, Tapsi picks the day („after two more sleeps“) and a ribbon for each. In the park
Papa lifts Tapsi up, Tapsi ties them to a low branch among many other children's and waves goodbye. The first night Tapsi
cries and is held, Papa sings, in the morning Tapsi is proud; on a walk Tapsi visits them in the tree, and Mama and Papa
love Tapsi with a pacifier and without one.
- `pacifierTree.ts`: the chapters and pages (`TREE_STORY`), the steps it tells (`TREE_STEPS`: the fairy's but the swap),
  each page's place, light, cast and picture, and the short version (`TREE_SHORT_PAGES`, `TREE_STORY_SHORT`).
- `pacifierTreePictures.ts`: the Gemini prompt of every page, as the picture queue takes them; a made picture goes on
  `MADE`. What is left once all are made stands in their `after`.
- `story.ts`: what the book needs from this folder – Tapsi's voice (`TREE_VOICE`, from `stimme/`, listed in
  `recordedLines.ts` as `schnullerbaum`, recorded only when the user asks), the pictures (`treePictureOf`) and the
  translations (`TREE_TRANSLATIONS`, through `byLanguage`). The book plays it with the shared `ChapterBook` (`first="en"`,
  dev tags `B…`/`Bk…`, `level="baum"` so its trophy is its own, named in `trophyNames.ts`).
- `names.ts`: the story's title and its name in the book's choice, in all seven languages.
- `de.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts`, `ru.ts`: the story in the other languages (`StoryTranslation`), loaded only
  with `texts-<language>.ts` (`pacifierTree`) – never imported by the game.

## Rules

- **Waiting for its twenty pictures** (queued 23 November 2026, made only in a Claude cloud session): until then players
  don't see it (`ChapterBook`'s `withPictures`, the choice leaves a story without pictures out), and both addresses are in
  `WAITING_PATHS` (`seo.ts`: `noindex`, out of the sitemap). What to do once they are made stands in the pictures' `after`:
  `MADE`, out of `WAITING_PATHS`, name the story in the search texts of `/schnullerfee/` and in `PACIFIER_STORY_BLURB`,
  this file, `bun run previews /schnullerfee/`.
- **Written English first, translated into all seven languages** (checked in `pacifierTree.test.ts`: every chapter and
  page, Tapsi in each language's script, the pacifier named, no Latin letters in Russian, Chinese, Hindi or Arabic). A
  changed page changes its line in every language in the same commit. Tapsi is masculine in Russian, Hindi and Arabic,
  as in the fairy's story; German says „Tapsi“, never er or sie; Spanish without adjectives about Tapsi.
- **A different length from the fairy's story** (checked: at most 60 % of its pages), and its short version made of its
  own pages (`src/components/storyBooks.test.ts`): a new page earns its place.
- **The pacifiers stay in the tree** (checked): after „tschuess“ no picture shows Tapsi's own pacifiers but hanging in the
  tree. Tapsi gives them away itself on a day it picked; Tapsi may be sad and cry, always held by a grown-up; no
  scolding, no hurrying, no clock, age or weekday.
- Pictures: the living room is drawn from the Milchkette's „kette-fragen-nicht“, Tapsi's room from the Schnullerfee's
  „fee-drei“ (never a Milchkette picture of Tapsi's room, whose chain of milk drops would come back), the park once from
  the fox family (`baum-los`) and every other park page from that one, so the tree stays the same (checked). Count the
  foxes and Tapsi's three pacifiers on every picture and look that Mama and Papa are two foxes (flower, glasses).
- Tapsi is an animal, not the child's figure, so it does not follow „Junge / Mädchen“.
