import type { StoryChapter, StoryPage } from "@/components/ChapterBook";

// What the chapter books' choice shows of each story and version (`StoryChoice.tsx`): its short version made of its own
// pages, and about how long it takes. Kept apart from the components, so a story's data and its tests can use it
// without loading a page.

/**
 * A story's short version from its own pages (user requests, 22 and 23 November 2026: „eine Kurzfassung … aus dem, was
 * schon da ist“): each chapter with only the pages `ids` names, in the story's order, the chapters left empty dropped.
 * So it needs no picture, translation or recording of its own, and a page renamed in the story must be renamed in `ids`
 * (`storyBooks.test.ts` checks every id is a page).
 */
export function shortOf<C extends StoryChapter>(chapters: C[], ids: readonly string[]): C[] {
  return chapters
    .map((chapter) => ({ ...chapter, pages: chapter.pages.filter((page) => ids.includes(page.id)) }))
    .filter((chapter) => chapter.pages.length > 0);
}

/**
 * About how many minutes a story takes read aloud to a small child: a few seconds per page to look at its picture, and
 * a slow reader's pace for its sentence (the first language's words). Shown in the choice, so a grown-up sees what fits
 * the evening (user request, 22 November 2026: „die Dauer ca. … je Geschichte“).
 */
export function minutesOf(pages: StoryPage[]): number {
  const seconds = pages.reduce((sum, page) => sum + LOOK_SECONDS + page.text.split(/\s+/).length * SECONDS_PER_WORD, 0);
  return Math.max(1, Math.round(seconds / 60));
}

/** Seconds a page's picture is looked at and its page turned, beside its sentence. */
const LOOK_SECONDS = 8;
/** Seconds a word takes read slowly to a small child. */
const SECONDS_PER_WORD = 0.45;
