import pictures from "./bilder/*.webp?glob";

/** The two animal families reading one book together: Tapsi's (the foxes) and the little bear's. */
export type Family = "fox" | "bear";

/** Their cut-out pictures (Gemini, `bilder/`). */
export const FAMILY_PICTURES: Record<Family, string | undefined> = {
  fox: pictures["buch-fuechse.webp"],
  bear: pictures["buch-baeren.webp"],
};

/**
 * Who reads with the child at the bottom of the menus, in turn from visit to visit (D-21): the parents, then Oma, then
 * Opa – on the bears' side Opa before Oma, so the two sides never show the same grown-ups (Oma Fuchs beside Opa Bär).
 * A picture not made yet falls back to the parents.
 */
export const READERS: Record<Family, (string | undefined)[]> = {
  fox: [FAMILY_PICTURES.fox, pictures["buch-oma-fuchs.webp"], pictures["buch-opa-fuchs.webp"]],
  bear: [FAMILY_PICTURES.bear, pictures["buch-opa-baer.webp"], pictures["buch-oma-baer.webp"]],
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

/** The picture of who reads on this side in this visit. */
export function readerOf(family: Family, n = visitNumber()): string | undefined {
  const readers = READERS[family];
  return readers[n % readers.length] ?? FAMILY_PICTURES[family];
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
