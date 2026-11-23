import { type BookStory, SHORT_STORY, StoryBookGame, storyBook, WHOLE_STORY } from "@/components/StoryChoice";
import { byLanguage } from "@/content/texts";
import { TREE_KIND, TREE_TITLE } from "@/games/pacifiertree/names";
import { TREE_STORY, TREE_STORY_SHORT } from "@/games/pacifiertree/pacifierTree";
import { TREE_TRANSLATIONS, TREE_VOICE, treePictureOf } from "@/games/pacifiertree/story";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { PACIFIER_STORY, PACIFIER_STORY_SHORT } from "./pacifierStory";
import { PACIFIER_FAIRY_KIND, PACIFIER_STORY_BOOK, PACIFIER_STORY_TITLE } from "./names";

/** Each page's picture by its file name without extension (`fee-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** „Tapsi und die Schnullerfee“, the whole story. */
const STORY: BookStory = {
  href: "/schnullerfee/",
  kind: PACIFIER_FAIRY_KIND,
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

/** „Tapsi and the Pacifier Tree“ (src/games/pacifiertree), the whole story: the pacifiers hung on the tree in the park, no fairy. */
const TREE: BookStory = {
  href: "/schnullerfee/baum/",
  level: "baum",
  kind: TREE_KIND,
  title: TREE_TITLE,
  version: WHOLE_STORY,
  chapters: TREE_STORY,
  pictureOf: treePictureOf,
  cover: "alle",
  tone: "warm",
  voice: TREE_VOICE,
  translations: TREE_TRANSLATIONS,
  first: "en",
  code: "B",
};

/**
 * The book, opening like „Abstillen“ on the choice of its stories (`StoryChoice.tsx`, user request, 23 November 2026):
 * „Tapsi und die Schnullerfee“ whole and in its short version from its own pages (`PACIFIER_STORY_SHORT`, at
 * `/schnullerfee/kurz/`), and „Tapsi and the Pacifier Tree“ for families who want no fairy (idea H-145), shorter, whole
 * and short too (`/schnullerfee/baum/`, `/schnullerfee/baum/kurz/`; user: „unterschiedliche Länge und zwei Versionen
 * kurz lang anzubieten ist perfekt“). Each slip tells its pictures and minutes, never its chapters.
 */
const BOOK = storyBook(PACIFIER_STORY_BOOK, "S", [
  [STORY, { ...STORY, href: "/schnullerfee/kurz/", version: SHORT_STORY, chapters: PACIFIER_STORY_SHORT, code: "Sk" }],
  [TREE, { ...TREE, href: "/schnullerfee/baum/kurz/", version: SHORT_STORY, chapters: TREE_STORY_SHORT, code: "Bk" }],
]);

/** The browser tab's title on an address of the book: the story's there. */
export const titleAt = (pathname: string) => BOOK.storyAt(pathname).title;

/** The book „Schnullerfee“ with its two stories, read like the other chapter books (`ChapterBook`), opening at once on its choice. */
export function PacifierStoryGame() {
  return <StoryBookGame book={BOOK} />;
}
