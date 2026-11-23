import { type BookStory, SHORT_STORY, StoryBookGame, storyBook, WHOLE_STORY } from "@/components/StoryChoice";
import { byLanguage } from "@/content/texts";
import { CHILDMINDER_STORY, CHILDMINDER_STORY_SHORT } from "@/games/childminder/childminder";
import { CHILDMINDER_KIND, CHILDMINDER_TITLE } from "@/games/childminder/names";
import { CHILDMINDER_TRANSLATIONS, CHILDMINDER_VOICE, childminderPictureOf } from "@/games/childminder/story";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { KITA_STORY, KITA_STORY_SHORT } from "./kitaStory";
import { KITA_CENTRE_KIND, KITA_STORY_BOOK, KITA_STORY_TITLE } from "./names";

/** Each page's picture by its file name without extension (`kita-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** „Tapsi geht in die Kita“, the whole story. */
const STORY: BookStory = {
  href: "/kita/",
  kind: KITA_CENTRE_KIND,
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

/** „Tapsi Goes to Lotta's“ (src/games/childminder), the whole story: settling in with a childminder (Tagesmutter) instead of a Kita. */
const CHILDMINDER: BookStory = {
  href: "/kita/tagesmutter/",
  level: "tagesmutter",
  kind: CHILDMINDER_KIND,
  title: CHILDMINDER_TITLE,
  version: WHOLE_STORY,
  chapters: CHILDMINDER_STORY,
  pictureOf: childminderPictureOf,
  cover: "besuch",
  tone: "rose",
  voice: CHILDMINDER_VOICE,
  translations: CHILDMINDER_TRANSLATIONS,
  first: "en",
  code: "T",
};

/**
 * The book, opening like „Abstillen“ on the choice of its stories (`StoryChoice.tsx`, user request, 23 November 2026):
 * „Tapsi geht in die Kita“, whole and in its short version from its own pages (`KITA_STORY_SHORT`, at `/kita/kurz/`), and
 * „Tapsi Goes to Lotta's“ at a childminder's (idea H-147), shorter, whole and short too (`/kita/tagesmutter/`,
 * `/kita/tagesmutter/kurz/`). Each slip tells its pictures and minutes, never its chapters.
 */
const BOOK = storyBook(KITA_STORY_BOOK, "E", [
  [STORY, { ...STORY, href: "/kita/kurz/", version: SHORT_STORY, chapters: KITA_STORY_SHORT, code: "Ek" }],
  [CHILDMINDER, { ...CHILDMINDER, href: "/kita/tagesmutter/kurz/", version: SHORT_STORY, chapters: CHILDMINDER_STORY_SHORT, code: "Tk" }],
]);

/** The browser tab's title on an address of the book: the story's there. */
export const titleAt = (pathname: string) => BOOK.storyAt(pathname).title;

/** The book „Kita-Start“ with its two stories, read like the other chapter books (`ChapterBook`), opening at once on its choice. */
export function KitaStoryGame() {
  return <StoryBookGame book={BOOK} />;
}
