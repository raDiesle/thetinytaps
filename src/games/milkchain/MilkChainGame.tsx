import { type BookStory, SHORT_STORY, StoryBookGame, storyBook, WHOLE_STORY } from "@/components/StoryChoice";
import { byLanguage } from "@/content/texts";
import { GOODBYE_MILK } from "@/games/milkgoodbye/goodbyeMilk";
import { GOODBYE_MILK_KIND, GOODBYE_MILK_TITLE } from "@/games/milkgoodbye/names";
import { GOODBYE_TRANSLATIONS, GOODBYE_VOICE, goodbyePictureOf } from "@/games/milkgoodbye/story";
import { NIGHT_MILK } from "@/games/nightmilk/nightMilk";
import { NIGHT_MILK_KIND, NIGHT_MILK_TITLE } from "@/games/nightmilk/names";
import { NIGHT_TRANSLATIONS, NIGHT_VOICE, nightPictureOf } from "@/games/nightmilk/story";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { MILK_CHAIN, MILK_CHAIN_SHORT } from "./milkChain";
import { MILK_CHAIN_BOOK, MILK_CHAIN_KIND, MILK_CHAIN_TITLE } from "./names";

/** Each page's picture by its file name without extension (`kette-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** „Tapsis Milchkette“, weaning altogether in chapters along the guides' steps, the whole story. */
const MILK_CHAIN_STORY: BookStory = {
  href: "/abstillen/",
  kind: MILK_CHAIN_KIND,
  title: MILK_CHAIN_TITLE,
  version: WHOLE_STORY,
  chapters: MILK_CHAIN,
  pictureOf: (id) => PICTURES.get(`kette-${id}`),
  cover: "kette",
  tone: "warm",
  // Tapsi's voice reading the pages, from `stimme/` (German) and `stimme/<language>/`; a page not recorded yet stays silent.
  voice: recordedVoice(voiceFiles),
  // The story in the other languages, filled as their texts load; German is in `milkChain.ts`.
  translations: byLanguage((texts) => texts.milkChain),
  first: "de",
  code: "K",
};

/**
 * The book „Abstillen“ and its stories (user requests, 22 November 2026: „ein Buch, darin kann man mehrere Varianten
 * auswählen“): „Tapsis Milchkette“ whole and in its short version (its own pages, `SHORT_PAGES`, read in one evening),
 * „Three More Sleeps“ (src/games/milkgoodbye) for weaning on one day with a goodbye party, and „The Milk Sleeps at
 * Night“ (src/games/nightmilk) for families who wean only at night. Each line of the choice is one story, its versions
 * side by side on it (`StoryChoice.tsx`, shared with every chapter book).
 */
const BOOK = storyBook(MILK_CHAIN_BOOK, "A", [
  [MILK_CHAIN_STORY, { ...MILK_CHAIN_STORY, href: "/abstillen/kurz/", version: SHORT_STORY, chapters: MILK_CHAIN_SHORT, code: "S" }],
  [
    {
      href: "/abstillen/abschied/",
      level: "abschied",
      kind: GOODBYE_MILK_KIND,
      title: GOODBYE_MILK_TITLE,
      chapters: GOODBYE_MILK,
      pictureOf: goodbyePictureOf,
      cover: "fest",
      tone: "rose",
      voice: GOODBYE_VOICE,
      translations: GOODBYE_TRANSLATIONS,
      first: "en",
      code: "F",
    },
  ],
  [
    {
      href: "/abstillen/nachts/",
      level: "nachts",
      kind: NIGHT_MILK_KIND,
      title: NIGHT_MILK_TITLE,
      chapters: NIGHT_MILK,
      pictureOf: nightPictureOf,
      cover: "weiter",
      tone: "night",
      voice: NIGHT_VOICE,
      translations: NIGHT_TRANSLATIONS,
      first: "en",
      code: "N",
    },
  ],
]);

/** The browser tab's title on an address of the book: the story's there. */
export const titleAt = (pathname: string) => BOOK.storyAt(pathname).title;

/** The book „Abstillen“, opening at once on the choice of its stories. */
export function MilkChainGame() {
  return <StoryBookGame book={BOOK} />;
}
