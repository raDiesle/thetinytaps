import { type BookStory, SHORT_STORY, StoryBookGame, storyBook, WHOLE_STORY } from "@/components/StoryChoice";
import { byLanguage } from "@/content/texts";
import { SHOWER_STORY, SHOWER_STORY_SHORT } from "@/games/hairshower/hairShower";
import { SHOWER_KIND, SHOWER_TITLE } from "@/games/hairshower/names";
import { SHOWER_TRANSLATIONS, SHOWER_VOICE, showerPictureOf } from "@/games/hairshower/story";
import { recordedVoice } from "@/lib/voice";
import pictureFiles from "./bilder/*.webp?glob";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { HAIR_STORY, HAIR_STORY_SHORT } from "./hairStory";
import { HAIR_BATH_KIND, HAIR_STORY_BOOK, HAIR_STORY_TITLE } from "./names";

/** Each page's picture by its file name without extension (`haare-<page id>`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** „Tapsi and the Foam Crown“, the whole story. */
const STORY: BookStory = {
  href: "/haare-waschen/",
  kind: HAIR_BATH_KIND,
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

/** „Tapsi and the Warm Rain“ (src/games/hairshower), the whole story: hair washed in the shower, for families without a bathtub. */
const SHOWER: BookStory = {
  href: "/haare-waschen/dusche/",
  level: "dusche",
  kind: SHOWER_KIND,
  title: SHOWER_TITLE,
  version: WHOLE_STORY,
  chapters: SHOWER_STORY,
  pictureOf: showerPictureOf,
  cover: "schaum",
  tone: "warm",
  voice: SHOWER_VOICE,
  translations: SHOWER_TRANSLATIONS,
  first: "en",
  code: "D",
};

/**
 * The book, opening like „Abstillen“ on the choice of its stories (`StoryChoice.tsx`, user request, 23 November 2026):
 * „Tapsi and the Foam Crown“ in the bathtub, whole and in its short version from its own pages (`HAIR_STORY_SHORT`, at
 * `/haare-waschen/kurz/`), and „Tapsi and the Warm Rain“ in the shower for families without a tub (idea H-146), shorter,
 * whole and short too (`/haare-waschen/dusche/`, `/haare-waschen/dusche/kurz/`). Each slip tells its pictures and
 * minutes, never its chapters.
 */
const BOOK = storyBook(HAIR_STORY_BOOK, "H", [
  [STORY, { ...STORY, href: "/haare-waschen/kurz/", version: SHORT_STORY, chapters: HAIR_STORY_SHORT, code: "Hk" }],
  [SHOWER, { ...SHOWER, href: "/haare-waschen/dusche/kurz/", version: SHORT_STORY, chapters: SHOWER_STORY_SHORT, code: "Dk" }],
]);

/** The browser tab's title on an address of the book: the story's there. */
export const titleAt = (pathname: string) => BOOK.storyAt(pathname).title;

/** The book „Haare waschen“ with its two stories, read like the other chapter books (`ChapterBook`), opening at once on its choice. */
export function HairStoryGame() {
  return <StoryBookGame book={BOOK} />;
}
