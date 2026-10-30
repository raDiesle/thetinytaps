import pictures from "./bilder/*.webp?glob";

/** The two animal families reading one book together: Tapsi's (the foxes) and the little bear's. */
export type Family = "fox" | "bear";

/** Their cut-out pictures (Gemini, `bilder/`). */
export const FAMILY_PICTURES: Record<Family, string | undefined> = {
  fox: pictures["buch-fuechse.webp"],
  bear: pictures["buch-baeren.webp"],
};

/**
 * One family in a menu's top row, in the book look, where the page is too small for them beside the cards (Sky):
 * next to the home page's title, or beside the way back. The slot takes what room the row leaves and the picture
 * shrinks into it – and hides where too little is left (`book.css`), so it never pushes or covers a button.
 * Lazy, so a screen that hides it never downloads it.
 */
export function BookFamily({ family }: { family: Family }) {
  return (
    <span className={`book-family-slot ${family}`} aria-hidden>
      <img src={FAMILY_PICTURES[family]} alt="" loading="lazy" decoding="async" />
    </span>
  );
}
