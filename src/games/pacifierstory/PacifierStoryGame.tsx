import { type BookStory, SHORT_STORY, StoryBookGame, storyBook, WHOLE_STORY } from "@/components/StoryChoice";
import { byLanguage } from "@/content/texts";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { PACIFIER_STORY, PACIFIER_STORY_SHORT } from "./pacifierStory";
import { PACIFIER_STORY_BOOK, PACIFIER_STORY_TITLE } from "./names";

/** Each page's picture by its file name without extension (`fee-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** „Tapsi und die Schnullerfee“, the whole story. */
const STORY: BookStory = {
  href: "/schnullerfee/",
  kind: PACIFIER_STORY_TITLE,
  title: PACIFIER_STORY_TITLE,
  version: WHOLE_STORY,
  chapters: PACIFIER_STORY,
  pictureOf: (id) => PICTURES.get(`fee-${id}`),
  cover: "drei",
  // Tapsi's voice reading the pages, from `stimme/` (German) and `stimme/<language>/`; a page not recorded yet stays silent.
  voice: recordedVoice(voiceFiles),
  // The story in the other languages, filled as each language's texts load (`texts-<id>.ts`).
  translations: byLanguage((texts) => texts.pacifierStory),
  code: "S",
};

/**
 * The book, opening like „Abstillen“ on the choice of its stories (`StoryChoice.tsx`, user request, 23 November 2026):
 * its whole story and its short version from its own pages (`PACIFIER_STORY_SHORT`, at `/schnullerfee/kurz/`),
 * each slip telling its pictures and minutes, never its chapters.
 */
const BOOK = storyBook(PACIFIER_STORY_BOOK, "S", [
  [STORY, { ...STORY, href: "/schnullerfee/kurz/", version: SHORT_STORY, chapters: PACIFIER_STORY_SHORT, code: "Sk" }],
]);

/** „Tapsi und die Schnullerfee“, read in chapters like the other chapter books (`ChapterBook`), opening at once on its choice. */
export function PacifierStoryGame() {
  return <StoryBookGame book={BOOK} />;
}
