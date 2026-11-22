# Tapsi's Big Bed

Route `/grosses-bett/` · idea H-106 · research „grosses-bett“.

The book „Big Bed“ among the Alltagshelfer, right of „Hair Washing“ (`BED_STORY_BOOK`, a spine book of its own once
published, playing at once): a story about moving from the cot into a bed of one's own, in chapters like „Abstillen“,
„Schnullerfee“, „Kita-Start“ and „Hair Washing“, read by a grown-up with the child in the days before the big bed comes
and in its first evenings. It is still `unfinished` in `games.ts`, though its pictures are all made (21 November 2026), until
the user says to publish it: reached only from „🚧 In Arbeit“ on `/management/`, out of the sitemap and `noindex`.

Tapsi the fox (the same family and home as in the other books) stretches in the cot and the feet bump the end, then
climbs the bars – Papa is there and says Tapsi is growing. Mama reads a picture book about a mouse in a big bed, says
it will stand just where the cot is now, and that Bunny, the little yellow blanket and their song come along. Tapsi
picks blue covers, says thank you and goodbye to the cot, hands Papa the boards and makes the bed with Mama. The rail is
tried by rolling against it, the moon night light glows, and the first sleep in the bed is a nap with Mama on a chair
beside it. In the evening all is as every evening – pyjamas, teeth, story, song – and Papa promises to look in and does.
When Tapsi gets up in the night, Papa brings Tapsi back, calm and with few words, as often as it takes. Mama sits on the
chair beside the bed and moves it further away evening by evening, until she sits by the door. In the morning Mama and
Papa share Tapsi's pride. Then Bruno, Tapsi's bear friend from „Kita-Start“, moves out of his parents' bed into his own
room (naps first, Mama Bear lying beside him, Papa Bear holding his paw, someone always comes when he calls), and on one
night Tapsi has a bad dream: Mama comes at once, listens, lies down beside the bed and stays – Mama and Papa are always
close and love Tapsi in the little bed and the big one.
- `bedStory.ts`: the chapters and pages (`BED_STORY`) and the steps of the move as the guides give them (`BED_STEPS`).
- `bedStoryPictures.ts`: the Gemini prompt of every page (place, light, cast and night clothes, bunny, blanket, chair,
  night light, boat pillow, a safe bed), as the picture queue takes them; a made picture goes on `MADE`.
- `BedStoryGame.tsx` plays it with the shared `ChapterBook` (`first="en"`, dev tags `B0`, `B<chapter>-<page>`). A change
  to how the book reads goes there, so all chapter books get it. Tapsi's voice reads each page (`voice`, from `stimme/`,
  listed in `recordedLines.ts` as `grosses-bett`, recorded only when the user asks), and the loudspeaker switches it off
  (`VoiceSwitch`); a page without its recording stays silent.
- `names.ts`: the book's name on the shelf, the story's title and its blurb, in all seven languages.
- `de.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts`, `ru.ts`: the chapters and pages in the other languages (`StoryTranslation`,
  keyed by chapter and page id), loaded only with their language's texts (`texts-<lang>.ts`, `bedStory`) and read by
  `BedStoryGame.tsx` through `byLanguage`; never import them from game code (`texts.test.ts`).

## Rules

- **English first** (root CLAUDE.md, Language): pages, title, book name and blurb are written in English, and the whole
  story is translated into all seven app languages (22 November 2026); a new or changed page, chapter or name gets the
  other languages, German too, in the same commit (user decision, 22 November 2026; `bedstory.test.ts` checks every
  language has every chapter, page and name, Tapsi and Bruno in each script). Tapsi's recordings are still missing in
  every language (`languageStatus.ts` says what is missing). The search texts (`seo.ts`, `seo.<lang>.ts`) stand in all seven languages.
- **The chapters follow the guides' steps in their order** (`BED_STEPS`, checked): the signs that it is time (climbing
  out, too small), telling and reading about it beforehand, choosing and helping, the bed where the cot stood with the
  old blanket, the cuddly toy, a rail and a night light and naps first, the same evening ritual with a promise to look in
  that is kept, bringing back calmly, a grown-up close who moves away step by step, pride in the morning, and from the
  family bed (Bruno). The last chapter, the bad dream, tells no step.
- **Gentle and true** (research „grosses-bett“): nobody scolds, punishes, locks a door or lets a child cry it out; a fear
  is listened to, never „only a dream“ or „there are no monsters“; and there is no sticker chart or reward – the guides
  disagree on rewards for sleep, and Graf & Seide advise against them where fear or the wish for closeness is behind it,
  so the morning has praise and pride, nothing to earn (`bedstory.test.ts` checks the words). No rule about the
  parents' bed either: the sources disagree, so the story shows parents who stay near and come. A grown-up is in every
  picture of the night but the two where Tapsi gets up or calls (checked). No clock, age or weekday; lines ≤ 110
  characters, in the present tense, ending in love.
- The move is never tied to something else that changes (a sibling, Kita-Start, the potty): the guides advise against
  it, so no page of this book mentions them.
- Tapsi is an animal, not the child's figure, so it does not follow „Junge / Mädchen“.
- Pictures (`/bild-erzeugen`, read Kita-Start's lessons in `src/games/kitastory/CLAUDE.md` and the hair book's in
  `src/games/hairstory/CLAUDE.md` first – they all hold here): the living room comes from Abstillen's
  (`kette-fragen-nicht`), Tapsi's room from the Schnullerfee's (`fee-drei`) – the big bed is the very bed Tapsi has in
  the other books. The room with the cot is drawn once from it („eng“, the bed swapped for a white cot), and the made bed
  with its rail and moon night light once („machen“); every later page of a room is drawn from that first picture, so a
  thing wrongly in „eng“ or „machen“ comes back on up to 20 pages: look at those two hardest before the rest are made –
  the cot must stand where the bed stands, the rail and the moon must be there and the room otherwise unchanged. Bruno's
  two rooms are drawn once from the bear family and Kita-Start's Bruno (`kita-stuhl`, only Bruno of it). Every bear
  keeps a tiny round bear tail (checked; Mia came with a fox's tail), the night's clothes follow the page's words
  („Tapsi in pyjamas“, „Mama in her nightgown“, checked), and whoever lies in bed lies safely inside it (`SAFE_BED`,
  checked). Count the characters, each once, look for stray tails, and name faces, never „seriously“.
- Every picture was made on 21 November 2026 (`/paid-queue`), with the spine picture
  (`src/components/bilder/spine-grosses-bett.webp`, Tapsi with the bunny on the bed, cut from „machen“) and the perf
  scenario „grosses-bett“. The book waits only for the user's word to publish it – then `unfinished` goes, and the home
  page's and the Alltagshelfer's search texts name the book (never published without that word).
