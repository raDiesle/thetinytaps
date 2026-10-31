import pictures from "./bilder/*.webp?glob";

/** The two animal families reading one book together: Tapsi's (the foxes) and the little bear's. */
export type Family = "fox" | "bear";

/** Their cut-out pictures (Gemini, `bilder/`). */
export const FAMILY_PICTURES: Record<Family, string | undefined> = {
  fox: pictures["buch-fuechse.webp"],
  bear: pictures["buch-baeren.webp"],
};

/**
 * Both families at the bottom of a menu's page in the book look (Sky), the foxes in the left corner and the bears in the
 * right, so grown-ups see the book is to be read with the child: below the cards, in the room the page keeps free for
 * them (`--menu-floor`, `book.css`), or on a wide page's margins beside the cards. Never in the top row, beside the
 * title (user feedback, October 2026). Lazy, so a screen that hides them never downloads them.
 */
export function BookFamilies() {
  return (
    <>
      <img className="book-family fox" src={FAMILY_PICTURES.fox} alt="" loading="lazy" decoding="async" />
      <img className="book-family bear" src={FAMILY_PICTURES.bear} alt="" loading="lazy" decoding="async" />
    </>
  );
}
