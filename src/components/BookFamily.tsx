import pictures from "./bilder/*.webp?glob";
import { type Family, READER_FILES } from "./readerPictures";

/** Their cut-out pictures (Gemini, `bilder/`). */
const FAMILY_PICTURES: Record<Family, string | undefined> = {
  fox: pictures["buch-fuechse.webp"],
  bear: pictures["buch-baeren.webp"],
};

/** Counts the visits, so the next one brings the next readers. */
const VISITS_KEY = "tinytaps.readers.v1";

let visit: number | undefined;

/** This visit's number, read and counted once per page load (0 where storage is unavailable). */
function visitNumber(): number {
  if (visit !== undefined) return visit;
  visit = 0;
  try {
    visit = Number(localStorage.getItem(VISITS_KEY)) || 0;
    localStorage.setItem(VISITS_KEY, String(visit + 1));
  } catch {
    // No storage: the parents read, as on a first visit.
  }
  return visit;
}

/** The file of who reads on this side in the visit `n` (D-21, `READER_FILES`). */
export function readerFileOf(family: Family, n: number): string {
  const readers = READER_FILES[family];
  return readers[n % readers.length];
}

/** The picture of who reads on this side in this visit; one not made yet (still in the picture queue) falls back to the parents. */
export function readerOf(family: Family, n = visitNumber()): string | undefined {
  return pictures[readerFileOf(family, n)] ?? FAMILY_PICTURES[family];
}

/**
 * Both families at the bottom of a menu's page (Sky), the foxes in the left corner and the bears in the
 * right, so grown-ups see the book is to be read with the child: below the cards, in the room the page keeps free for
 * them (`--menu-floor`, `book.css`), or on a wide page's margins beside the cards. Never in the top row, beside the
 * title (user feedback, October 2026). Lazy, so a screen that hides them never downloads them.
 */
export function BookFamilies() {
  return (
    <>
      <img className="book-family fox" src={readerOf("fox")} alt="" loading="lazy" decoding="async" />
      <img className="book-family bear" src={readerOf("bear")} alt="" loading="lazy" decoding="async" />
    </>
  );
}
