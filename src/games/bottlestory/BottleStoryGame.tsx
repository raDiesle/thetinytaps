import { type BookStory, SHORT_STORY, StoryBookGame, storyBook, WHOLE_STORY } from "@/components/StoryChoice";
import { byLanguage } from "@/content/texts";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { BOTTLE_STORY, BOTTLE_STORY_SHORT } from "./bottleStory";
import { BOTTLE_STORY_BOOK, BOTTLE_STORY_TITLE } from "./names";

/** Each page's picture by its file name without extension (`flasche-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** „Bye-Bye, Bottle!“, the whole story. */
const STORY: BookStory = {
  href: "/flaeschchen/",
  kind: BOTTLE_STORY_TITLE,
  title: BOTTLE_STORY_TITLE,
  version: WHOLE_STORY,
  chapters: BOTTLE_STORY,
  pictureOf: (id) => PICTURES.get(`flasche-${id}`),
  cover: "schluck",
  // Tapsi's voice reading the pages, from `stimme/en/` (English first) and `stimme/<language>/`; a page not recorded yet stays silent.
  voice: recordedVoice(voiceFiles),
  // The story in the other languages, filled as each language's texts load (`texts-<id>.ts`).
  translations: byLanguage((texts) => texts.bottleStory),
  first: "en",
  code: "F",
};

/**
 * The book, opening like „Abstillen“ on the choice of its stories (`StoryChoice.tsx`, user request, 23 November 2026):
 * its whole story and its short version from its own pages (`BOTTLE_STORY_SHORT`, at `/flaeschchen/kurz/`),
 * each slip telling its pictures and minutes, never its chapters.
 */
const BOOK = storyBook(BOTTLE_STORY_BOOK, "F", [
  [STORY, { ...STORY, href: "/flaeschchen/kurz/", version: SHORT_STORY, chapters: BOTTLE_STORY_SHORT, code: "Fk" }],
]);

/** „Bye-Bye, Bottle!“, read in chapters like the other chapter books (`ChapterBook`), opening at once on its choice. */
export function BottleStoryGame() {
  return <StoryBookGame book={BOOK} />;
}
