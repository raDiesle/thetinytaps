import { type BookStory, StoryBookGame, storyBook } from "@/components/StoryChoice";
import { byLanguage } from "@/content/texts";
import { OWN_BED_STORY } from "@/games/ownbed/ownBed";
import { OWN_BED_KIND, OWN_BED_TITLE } from "@/games/ownbed/names";
import { OWN_BED_TRANSLATIONS, OWN_BED_VOICE, ownBedPictureOf } from "@/games/ownbed/story";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { BED_STORY } from "./bedStory";
import { BED_STORY_BOOK, BED_STORY_KIND, BED_STORY_TITLE } from "./names";

/** Each page's picture by its file name without extension (`bett-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** „Tapsi's Big Bed“, the whole story: from the cot into a bed of one's own. */
const STORY: BookStory = {
  href: "/grosses-bett/",
  kind: BED_STORY_KIND,
  title: BED_STORY_TITLE,
  chapters: BED_STORY,
  pictureOf: (id) => PICTURES.get(`bett-${id}`),
  cover: "mittag",
  // Tapsi's voice reading the pages, from `stimme/en/` (English first) and `stimme/<language>/`; a page not recorded yet stays silent.
  voice: recordedVoice(voiceFiles),
  // The story in the other languages, filled as each language's texts load (`texts-<id>.ts`).
  translations: byLanguage((texts) => texts.bedStory),
  first: "en",
  code: "B",
};

/** „Tapsi's Own Bed“ (src/games/ownbed): from Mama and Papa's bed into Tapsi's own bed and room. */
const OWN_BED: BookStory = {
  href: "/grosses-bett/eigenes-bett/",
  level: "eigenes-bett",
  kind: OWN_BED_KIND,
  title: OWN_BED_TITLE,
  chapters: OWN_BED_STORY,
  pictureOf: ownBedPictureOf,
  cover: "kuscheln",
  tone: "night",
  voice: OWN_BED_VOICE,
  translations: OWN_BED_TRANSLATIONS,
  first: "en",
  code: "E",
};

/**
 * The book „Sleep Tight“, opening like „Abstillen“ on the choice of its stories (`StoryChoice.tsx`, user request, 23 November
 * 2026): „Tapsi's Big Bed“ from the cot, and „Tapsi's Own Bed“ out of the parents' bed (user request, 24 November 2026),
 * each slip telling its pictures and minutes, never its chapters. A story whose pictures still wait stays out of the
 * built site (`storyBook`).
 */
const BOOK = storyBook(BED_STORY_BOOK, "B", [[STORY], [OWN_BED]]);

/** The browser tab's title on an address of the book: the story's there. */
export const titleAt = (pathname: string) => BOOK.storyAt(pathname).title;

/** The book „Sleep Tight“ with its two stories, read in chapters like the other chapter books (`ChapterBook`), opening at once on its choice. */
export function BedStoryGame() {
  return <StoryBookGame book={BOOK} />;
}
