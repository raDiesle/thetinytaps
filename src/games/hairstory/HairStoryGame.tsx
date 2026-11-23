import { type BookStory, SHORT_STORY, StoryBookGame, storyBook, WHOLE_STORY } from "@/components/StoryChoice";
import { byLanguage } from "@/content/texts";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { HAIR_STORY, HAIR_STORY_SHORT } from "./hairStory";
import { HAIR_STORY_BOOK, HAIR_STORY_TITLE } from "./names";

/** Each page's picture by its file name without extension (`haare-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** „Tapsi and the Foam Crown“, the whole story. */
const STORY: BookStory = {
  href: "/haare-waschen/",
  kind: HAIR_STORY_TITLE,
  title: HAIR_STORY_TITLE,
  version: WHOLE_STORY,
  chapters: HAIR_STORY,
  pictureOf: (id) => PICTURES.get(`haare-${id}`),
  cover: "spiegel",
  // Tapsi's voice reading the pages, from `stimme/en/` (English first) and `stimme/<language>/`; a page not recorded yet stays silent.
  voice: recordedVoice(voiceFiles),
  // The story in the other languages, filled as each language's texts load (`texts-<id>.ts`).
  translations: byLanguage((texts) => texts.hairStory),
  first: "en",
  code: "H",
};

/**
 * The book, opening like „Abstillen“ on the choice of its stories (`StoryChoice.tsx`, user request, 23 November 2026):
 * its whole story and its short version from its own pages (`HAIR_STORY_SHORT`, at `/haare-waschen/kurz/`),
 * each slip telling its pictures and minutes, never its chapters.
 */
const BOOK = storyBook(HAIR_STORY_BOOK, "H", [
  [STORY, { ...STORY, href: "/haare-waschen/kurz/", version: SHORT_STORY, chapters: HAIR_STORY_SHORT, code: "Hk" }],
]);

/** „Tapsi and the Foam Crown“, read in chapters like the other chapter books (`ChapterBook`), opening at once on its choice. */
export function HairStoryGame() {
  return <StoryBookGame book={BOOK} />;
}
