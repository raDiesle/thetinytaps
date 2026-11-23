import { type BookStory, StoryBookGame, storyBook } from "@/components/StoryChoice";
import { byLanguage } from "@/content/texts";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { BED_STORY } from "./bedStory";
import { BED_STORY_BOOK, BED_STORY_TITLE } from "./names";

/** Each page's picture by its file name without extension (`bett-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** „Tapsi's Big Bed“, the whole story. */
const STORY: BookStory = {
  href: "/grosses-bett/",
  kind: BED_STORY_TITLE,
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

/**
 * The book, opening like „Abstillen“ on the choice of its stories (`StoryChoice.tsx`, user request, 23 November 2026):
 * its one story,
 * each slip telling its pictures and minutes, never its chapters.
 */
const BOOK = storyBook(BED_STORY_BOOK, "B", [[STORY]]);

/** „Tapsi's Big Bed“, read in chapters like the other chapter books (`ChapterBook`), opening at once on its choice. */
export function BedStoryGame() {
  return <StoryBookGame book={BOOK} />;
}
