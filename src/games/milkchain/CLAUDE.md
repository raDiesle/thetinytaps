# Tapsis Milchkette

Route `/abstillen/` · idea H-44 · research „abstillen-kapitel“.

The book „Abstillen“ among the Alltagshelfer (`MILK_CHAIN_BOOK`, a spine book of its own, playing at once): a weaning
story in chapters (user request, 9 November 2026), read by a grown-up with the child chapter by chapter. It replaced a
first, shorter SVG story „Tschüss, Mama-Milch“ that stood at this address (deleted on the user's request the same day).
Since 21 November 2026 the book holds a second story, „The Milk Sleeps at Night“ (`/abstillen/nachts/`, H-104,
`src/games/nightmilk`), for weaning only at night. Since 22 November 2026 both are **one book** that opens on the choice
of its stories (user request: „ein Buch, darin kann man mehrere Varianten auswählen … die Unterkapitel weglassen oder
sehr minimal anzeigen“), no longer two volumes tied together on the shelf. Also since 22 November 2026 (H-143) the
long story has a short version from its own pages (`/abstillen/kurz/`, `SHORT_PAGES`) and the book a third story, „Three
More Sleeps“ (`/abstillen/abschied/`, `src/games/milkgoodbye`), weaning on a set day with a goodbye party.

Tapsi the fox drank at Mama's breast as a baby and is big now; Mama tells why the milk may go, and over Tapsi's bed hangs
a chain with one milk drop per milk time. Chapter by chapter one drop goes – the day's, the evening's, the night's and
last the morning's – into a little box to remember it, and what comes instead hangs there (ball, book, star, cup). Then
Tapsi misses it, lays the head on Mama's breast and hears her heart, and Mama and Papa love Tapsi as before.
- `milkChain.ts`: the chapters and pages (`MILK_CHAIN`), the steps of gentle weaning (`GENTLE_STEPS`), the order the
  milk times go (`MILK_ORDER`), what comes instead (`INSTEAD`) and which drops are gone on a page (`goneOn`).
- `milkChainPictures.ts`: the Gemini prompt of every page (place, light, chain, cast and clothes, nursing), as the
  picture queue takes them; a made picture goes on `MADE`.
- `milkChain.ts` also holds `SHORT_PAGES`, the pages of the short version in the long story's order (`MILK_CHAIN_SHORT`
  by `shortOf`, the same pictures, translations and recordings); `shortOf` and `minutesOf` (about how long a story takes
  read aloud) live in `src/lib/storyPages.ts`, shared by every chapter book.
- `MilkChainGame.tsx` is the book: one line per story and in it its versions (the long story whole and short
  here, „Mit Abschiedsfest“ from `src/games/milkgoodbye/story.ts`, „Nachts abstillen“ from `src/games/nightmilk/story.ts`),
  handed to `storyBook` and `StoryBookGame` of `src/components/StoryChoice.tsx` – the choice every chapter book opens on
  since 23 November 2026 (Schnullerfee, Kita-Start, Haare waschen, Flasche abgewöhnen and Bett too; a change there
  reaches all). It opens on the choice (`?seite=inhalt`, `DevTag` `A0`): one big line per story – its
  picture, what it is for (`*_KIND`) and its title small under it where it differs – and a paper slip per version to start it („Ganze
  Geschichte“ / „Kurzfassung“, „Lesen“ where there is one), with its pictures and minutes small under its word
  („51 Bilder · ca. 12 Min.“, counted from the pages played). A tap on the line opens its first version, always on its first page. Each story is read with the shared
  `ChapterBook` (`src/components/ChapterBook.tsx`, classes `cb-` in `chapterBook.css`, also the books „Schnullerfee“,
  „Kita-Start“ … – a change there reaches all), opened at that page (`opensAt`), its way back to its contents leading to
  the choice (`onContents`). Every route (`/abstillen/`, `/abstillen/kurz/`, `/abstillen/abschied/`, `/abstillen/nachts/`)
  shows the same page, the address names the story: opening another story from the book's own address goes there in the history, and its way back steps back
  (`goBack`), so the phone's back button does the same. Then one page per tap or key (← and Backspace back, ◀ for the
  grown-up, from the first page back to the choice; a quick second tap or key turns no second page, `screenTap` of
  `src/lib/tapGuard.ts`, user feedback, November 2026), the picture as big as the room allows, under it the chapter's title on its first
  page and the sentence to read aloud, small and decorated; a page whose picture isn't made yet is left out for players and shows a paper placeholder only in the dev server (`withPictures`); `GameEnd` small in the
  corners on the last page, „Nochmal“ opening the choice; `DevTag` `K<chapter>-<page>` and `N<chapter>-<page>`.
- `en.ts`, `zh.ts`, `hi.ts`, `es.ts`, `ar.ts`, `ru.ts`: the chapters' titles and the pages' sentences in each language
  (user request, 9 November 2026), imported only by `src/content/texts/texts-<lang>.ts` and read with `byLanguage`.
- `names.ts`: the book's name on the shelf („Abstillen“), the story's title, its name in the choice and the book's blurb
  in every language.

## Rules

- **The chapters follow the steps of gentle weaning in the guides' order** (`GENTLE_STEPS`, user request: „es gibt eine
  Empfehlung, in welchen Schritten man sanft abstillt – das soll sich in den Kapiteln wiederfinden“): tell the child,
  stop offering without refusing, put off and shorten, replace one milk time after the other, part falling asleep from
  drinking, the night, the farewell, then missing it. `milkchain.test.ts` checks the order. The milk times go day,
  evening, night, morning (`MILK_ORDER`, checked): the evening only after Tapsi has learnt to fall asleep with book and
  song, the night with Papa comforting, the morning last with a thank-you and a farewell.
- **The book opens on the choice of its stories, which shows only how many pictures each has, about how long it takes
  and where it starts** (user request, 22 November 2026: „nur die maximale Anzahl der Bilder bzw. Schritte anzeigen und
  dass klar wird, wo man die Geschichte starten kann … die Dauer ca.“, replacing the chapters as small numbers): never
  chapter numbers there, and every version a slip of its own to start it. The book never starts on page one, and while
  a page is open the corner goes back to the choice (`useInnerBack`). A new story about weaning gets its line in
  `MilkChainGame.tsx`'s `storyBook`, a shorter telling of one a second slip in its line – never a book or volume of its own on the shelf.
  `milkchain.test.ts` checks.
- **The short version is made of the long story's own pages** (`SHORT_PAGES`, checked: in order, from the baby to the
  love that stays, every milk time, a page holding Tapsi after each one where Tapsi cries), so it needs no picture,
  translation or recording of its own; it shares the long story's trophy. A page renamed in the long story is renamed
  there too.
- The story is gentle and true: the milk is gone and stays gone (no „just once more“), Tapsi may be sad and angry, and a
  grown-up is always close and holds it until it is done – never skipped. Nobody scolds, nothing is bad or naughty
  (`milkchain.test.ts` checks the words). Lines ≤ 110 characters, in the present tense.
- **It is plainly about Mama's breast** (user feedback, November 2026, replacing „a milk drop, never a breast“: a child
  doesn't understand the story otherwise): the word „Brust“ is said (checked), and the pictures of drinking show Tapsi
  at the breast as a picture book about breastfeeding does – Mama's top lifted at one side, the breast a soft round
  shape of her fur, Tapsi's face hiding the nipple, nothing more bare (`NURSING` in `milkChainPictures.ts`). Where nobody
  drinks, Mama lays her paw on her breast through her clothes.
- Tapsi is an animal, not the child's figure, so it does not follow „Junge / Mädchen“. A new story about weaning (night
  only) keeps the order of `MILK_ORDER`.
- Every language has every chapter and page (`milkchain.test.ts`): a new page or chapter is written English first
  and comes with every other language, German included, in the same commit (root `CLAUDE.md`, user decision, 22 November
  2026) – the stories are German first and `ChapterBook`'s `first` is the whole book's, so the
  first English-first page teaches the book a page's first language, with a test, never by writing it German first
  after all – and its languages' rows in `languageStatus.ts` say what is missing (`"text"` until recorded); a German line
  whose meaning changes is changed in its German and translated again with it. The rules for the child's languages hold here
  too: Tapsi in each script (Тапси, 塔普西, टैप्सी, تابسي), the breast named (Brust, breast, 乳房, छाती, pecho, صدر, грудь),
  Arabic with „let's“ instead of an imperative, Spanish without adjectives about Tapsi that change with gender.
- **Tapsi's voice reads each page's sentence** as it comes (user decision, 13 November 2026, replacing „a grown-up
  reads it, no voice“), from the recordings in `stimme/` (German) and `stimme/<language>/`, listed in `recordedLines.ts`
  (`abstillen`) and made only when the user asks (`bun run voice make --only abstillen`); a page without its recording
  stays silent, never the browser's voice. A loudspeaker above ▶ switches it off for grown-ups who read themselves
  (`VoiceSwitch`, one switch for all chapter books, `ChapterBook`). A changed sentence needs its recording again.
- **The picture as big as the screen allows, the words small under it** (user feedback, November 2026: the picture was
  small and the sentence big): the sentence is set like Gefühle's day pages (the book's serif, its first letter big and
  red) at `--caption-size`, between two curled flourishes, always in the room of the chapter's line and two lines so the
  picture keeps its size from page to page. No room is kept under the ✕'s corner: the picture stands in the middle, and
  the sides kept free for ◀ and ▶ keep it clear of the corner (keeping `--corner-clear` above it cost a sixth of the
  height on a phone). Look at 844×390, 1024×768 and 1280×720.
- Pictures (`/bild-erzeugen`): each place's first picture (`FIRST`) is drawn from the fox family
  (`buch-fuechse.webp`), every other page there from that first picture as its only ref, so the room stays; full bleed,
  never a white margin or rounded corners (two first pictures came back so and were drawn again). Every page drawn from a first
  picture says where the foxes stood there and that those places are empty now (`WAS_THERE`): without it six of
  twenty pages kept a second Tapsi or Mama, or a tail lying on the rug. A page whose foxes stay where
  the first picture can't show them (Tapsi drinking on Mama's lap in the living room) is drawn from a page where they
  already are (`FROM`). Count the foxes on every picture before keeping
  it: only the cast the page names, each once, and look for stray tails.
