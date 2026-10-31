import { useId } from "react";

/**
 * The way back in the book look: the corner of the page before, lifted at the spine (the page's top left) as if a
 * finger had taken it and were turning it back over to the right – which is how the page then turns (`book.css`,
 * `data-turn="back"`), so the corner that is touched is the page that moves (user feedback, October 2026). Its sign
 * tells where it leads: back out of a menu (`back`, an arrow: MenuHead's PageCorner) or out of a game (`close`, a ✕:
 * GameShell's ExitButton, held). Only drawn in the book look; it fills the box it is put in, its spine on the left.
 * The way out of a book back onto the shelf is no page turning but the book closing: `shelf` draws its ribbon instead.
 */
export function PageCornerArt({ sign }: { sign: "back" | "close" | "shelf" }) {
  const id = useId();
  if (sign === "shelf") return <RibbonArt />;
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
 * The way out of a book, back onto the shelf (user feedback, October 2026): no page turns there, the book is closed and
 * put back. A page's corner said „turn the page“, and a corner of the cover lying over the page floated where no cover
 * can be (the open book's cover lies under its pages). So it is the book's ribbon instead, the Lesebändchen one lays in
 * before closing a book: a band of red satin coming out over the page's top edge from the book's head, lying on the
 * page with its shadow and ending in a swallowtail, with a shelf embroidered on it in gold – books standing and this
 * one going back into its gap. Drawn in a box 36 × 80, the page's edge at y 8, so it hangs no lower than a page's corner would.
 */
function RibbonArt() {
  const id = useId();
  return (
    <svg className="page-ribbon-art" viewBox="0 0 36 80" aria-hidden>
      <defs>
        {/* Satin: dark at its edges, where it curves down onto the paper, and a band of sheen along it from the lamp. */}
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a1d28" />
          <stop offset="0.18" stopColor="#ad2f3b" />
          <stop offset="0.36" stopColor="#e06a6c" />
          <stop offset="0.5" stopColor="#c23e47" />
          <stop offset="0.85" stopColor="#a02a36" />
          <stop offset="1" stopColor="#701a25" />
        </linearGradient>
        {/* Where it bends over the page's edge: in the book's shadow above, catching the light on the fold. */}
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b0a10" stopOpacity="0.75" />
          <stop offset="0.55" stopColor="#2b0a10" stopOpacity="0.25" />
          <stop offset="0.75" stopColor="#ffd9d0" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffd9d0" stopOpacity="0" />
        </linearGradient>
        {/* The fine ribs of the woven band. */}
        <pattern id={`${id}r`} width="4" height="1.6" patternUnits="userSpaceOnUse">
          <rect width="4" height="0.6" fill="#3a0c14" opacity="0.18" />
        </pattern>
      </defs>
      <path className="page-ribbon-shadow" d={RIBBON} />
      <path d={RIBBON} fill={`url(#${id}s)`} />
      <path d={RIBBON} fill={`url(#${id}r)`} />
      <rect x="6" y="0" width="24" height="14" fill={`url(#${id}f)`} />
      {/* Its woven edges, a little lighter. */}
      <path className="page-ribbon-edge" d="M7.6 2C7.8 24 8 46 9 72M28.4 2C28.6 24 29 46 30 71" />
      <g className="page-ribbon-stamp" transform="translate(1.2 0)">
        {/* A shelf's compartment with its books, a gap between them, and this book going back into it. */}
        <rect className="page-ribbon-frame" x="8.5" y="36" width="19" height="24" rx="0.8" />
        <rect x="10.4" y="42" width="2.6" height="17" rx="0.5" />
        <rect x="13.6" y="45" width="2.6" height="14" rx="0.5" />
        <rect x="21" y="43" width="2.6" height="16" rx="0.5" />
        <rect x="24" y="46" width="2.2" height="13" rx="0.5" />
        <rect className="page-ribbon-book" x="17" y="32" width="3.4" height="19" rx="0.6" transform="rotate(14 18.7 51)" />
      </g>
    </svg>
  );
}

/** The ribbon's outline: out of the book's head above the page, lying down it, drifting a little as satin does, cut into a swallowtail. */
const RIBBON = "M6 0H30C29.8 12 29.6 24 30.1 38C30.6 52 30.9 62 31.6 76L19.6 68.5L7.6 77.5C7.2 63 6.8 52 6.6 38C6.4 24 6.2 12 6 0Z";
