import { type BookStory, SHORT_STORY, StoryBookGame, storyBook, WHOLE_STORY } from "@/components/StoryChoice";
import { byLanguage } from "@/content/texts";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { KITA_STORY, KITA_STORY_SHORT } from "./kitaStory";
import { KITA_STORY_BOOK, KITA_STORY_TITLE } from "./names";

/** Each page's picture by its file name without extension (`kita-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** „Tapsi geht in die Kita“, the whole story. */
const STORY: BookStory = {
  href: "/kita/",
  kind: KITA_STORY_TITLE,
  title: KITA_STORY_TITLE,
  version: WHOLE_STORY,
  chapters: KITA_STORY,
  pictureOf: (id) => PICTURES.get(`kita-${id}`),
  cover: "anschauen",
  // Tapsi's voice reading the pages, from `stimme/` (German) and `stimme/<language>/`; a page not recorded yet stays silent.
  voice: recordedVoice(voiceFiles),
  // The story in the other languages, filled as each language's texts load (`texts-<id>.ts`).
  translations: byLanguage((texts) => texts.kitaStory),
  code: "E",
};

/**
 * The book, opening like „Abstillen“ on the choice of its stories (`StoryChoice.tsx`, user request, 23 November 2026):
 * its whole story and its short version from its own pages (`KITA_STORY_SHORT`, at `/kita/kurz/`),
 * each slip telling its pictures and minutes, never its chapters.
 */
const BOOK = storyBook(KITA_STORY_BOOK, "E", [[STORY, { ...STORY, href: "/kita/kurz/", version: SHORT_STORY, chapters: KITA_STORY_SHORT, code: "Ek" }]]);

/** „Tapsi geht in die Kita“, read in chapters like the other chapter books (`ChapterBook`), opening at once on its choice. */
export function KitaStoryGame() {
  return <StoryBookGame book={BOOK} />;
}
