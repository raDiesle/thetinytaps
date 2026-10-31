import { useId } from "react";

/**
 * The way back in the book look: the corner of the page before, lifted at the spine (the page's top left) as if a
 * finger had taken it and were turning it back over to the right – which is how the page then turns (`book.css`,
 * `data-turn="back"`), so the corner that is touched is the page that moves (user feedback, October 2026). Its sign
 * tells where it leads: back out of a menu (`back`, an arrow: MenuHead's PageCorner) or out of a game (`close`, a ✕:
 * GameShell's ExitButton, held). Only drawn in the book look; it fills the box it is put in, its spine on the left.
 * The way out of a book back onto the shelf is no page turning but the book closing: `shelf` draws the cover instead.
 */
export function PageCornerArt({ sign }: { sign: "back" | "close" | "shelf" }) {
  const id = useId();
  if (sign === "shelf") return <CoverCornerArt />;
  return (
    <svg className="page-corner-art" viewBox="0 0 100 100" aria-hidden>
      <defs>
        {/* Standing up at the spine (in its own shadow), catching the lamp where it bends over, lying flatter at its tip. */}
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0.25">
          <stop offset="0" stopColor="#cdbb93" />
          <stop offset="0.3" stopColor="#fffaf0" />
          <stop offset="0.75" stopColor="#f6ecd4" />
          <stop offset="1" stopColor="#e2d3b0" />
        </linearGradient>
      </defs>
      {/* Its shadow on this page, then the corner itself, bellying out where it bends over and curling at its tip. */}
      <path className="page-corner-shadow" d="M0 0Q50 2 94 10Q62 58 0 100Z" />
      <path className="page-corner-back" d="M0 0Q46 0 88 5Q56 52 0 94Z" fill={`url(#${id}b)`} />
      <path d="M88 5Q70 22 56 30" fill="none" stroke="#fffaf0" strokeWidth="2.5" strokeLinecap="round" />
      <path className="page-corner-sign" d={sign === "back" ? "M50 36Q32 30 18 42M18 42l2-12M18 42l12 1" : "M16 24L34 42M34 24L16 42"} />
    </svg>
  );
}

/**
 * The way out of a book, back onto the shelf (user feedback, October 2026: a page's corner said „turn the page“, but the
 * book is closed and put back): the corner of the book's cloth cover, lifted as a hand takes it to close the book, with
 * a shelf stamped on it in gold – books standing and this one going back into its gap.
 */
function CoverCornerArt() {
  const id = useId();
  return (
    <svg className="page-corner-art cover-corner-art" viewBox="0 0 100 100" aria-hidden>
      <defs>
        {/* Cloth over board, lit where it bends over towards the lamp. */}
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="#1d4554" />
          <stop offset="0.35" stopColor="#3f88a2" />
          <stop offset="0.8" stopColor="#2e6a80" />
          <stop offset="1" stopColor="#245668" />
        </linearGradient>
      </defs>
      <path className="page-corner-shadow" d="M0 0Q50 2 96 10Q64 60 0 102Z" />
      <path className="cover-corner-board" d="M0 0Q46 0 90 5Q58 54 0 96Z" fill={`url(#${id}c)`} />
      {/* The board's edge, its thickness showing where the cloth folds round it. */}
      <path className="cover-corner-edge" d="M90 5Q58 54 0 96" />
      <g className="cover-corner-stamp">
        {/* The shelf's board and the books standing on it, with a gap. */}
        <path d="M6 47H48" />
        <rect x="8" y="27" width="5" height="20" rx="1" />
        <rect x="14" y="31" width="5" height="16" rx="1" />
        <rect x="33" y="29" width="5" height="18" rx="1" />
        <rect x="39" y="33" width="5" height="14" rx="1" />
        {/* This book, going back into its gap. */}
        <rect className="cover-corner-book" x="22" y="18" width="8" height="22" rx="1.2" transform="rotate(14 26 40)" />
        <path className="cover-corner-arrow" d="M38 6Q30 4 27 12M27 12l-1-7M27 12l6-3" />
      </g>
    </svg>
  );
}
