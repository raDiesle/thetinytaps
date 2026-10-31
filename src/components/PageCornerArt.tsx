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
 * can be (the open book's cover lies under its pages). So it is the book's ribbon, the Lesebändchen one lays in before
 * closing a book: a band of red satin coming out over the page's top edge from the book's head, lying on the page with
 * its shadow and ending in a swallowtail. Nearly all of it is a big round paper label with a tall, slim bookshelf on it
 * in colour, and the app's yellow round arrow of the way back over its edge, the same plain arrow as the toy look's –
 * big and plain, so a grown-up sees at once where it leads (a shelf stamped small in gold, then a small label with a
 * squat shelf and a bent arrow, were not recognised). Drawn in a box 60 × 80, the page's edge at y 6.
 */
function RibbonArt() {
  const id = useId();
  return (
    <svg className="page-ribbon-art" viewBox="0 0 60 80" aria-hidden>
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
      <g className="page-ribbon-shadow">
        <path d={RIBBON} />
        <circle cx="30" cy="35" r="26" />
        <circle cx="47.5" cy="62.5" r="12.5" />
      </g>
      <path d={RIBBON} fill={`url(#${id}s)`} />
      <path d={RIBBON} fill={`url(#${id}r)`} />
      <rect x="17" y="0" width="26" height="10" fill={`url(#${id}f)`} />
      {/* Its woven edges, a little lighter. */}
      <path className="page-ribbon-edge" d="M18.6 1.5C18.8 30 18.8 55 18.3 77M41.4 1.5C41.2 30 41.2 55 41.7 77" />
      {/* The label, a patch of paper-coloured cloth sewn on round its edge. */}
      <circle className="page-ribbon-label" cx="30" cy="35" r="26" />
      <circle className="page-ribbon-stitch" cx="30" cy="35" r="23.4" />
      <g className="page-ribbon-shelf">
        {/* The shelf: tall and slim, thin boards, three shelves of books, one gap for this book. */}
        <rect className="page-ribbon-wood" x="18.5" y="14" width="19" height="39" rx="0.8" />
        <rect className="page-ribbon-inside" x="20" y="15.5" width="16" height="10.6" />
        <rect className="page-ribbon-inside" x="20" y="27.4" width="16" height="10.6" />
        <rect className="page-ribbon-inside" x="20" y="39.3" width="16" height="12.2" />
        <rect x="20.6" y="17.8" width="2.4" height="8.3" fill="#c0503c" />
        <rect x="23.3" y="19" width="2" height="7.1" fill="#3f6f8f" />
        <rect x="25.6" y="17.4" width="2.4" height="8.7" fill="#5d8a5a" />
        <rect x="31" y="18.4" width="2.2" height="7.7" fill="#e0b85c" />
        <rect x="33.5" y="17.8" width="2" height="8.3" fill="#8a5a8f" />
        <rect x="20.6" y="29.4" width="2.2" height="8.6" fill="#d9a441" />
        <rect x="23.1" y="30.6" width="2.4" height="7.4" fill="#2f5d62" />
        <rect x="25.8" y="29" width="2" height="9" fill="#c77d4f" />
        <rect x="28.1" y="30.2" width="2.4" height="7.8" fill="#c0503c" />
        <rect x="32.8" y="29.6" width="2.6" height="8.4" fill="#3f6f8f" />
        <rect x="20.6" y="42.6" width="2.6" height="8.9" fill="#5d8a5a" />
        <rect x="23.5" y="41.8" width="2" height="9.7" fill="#e0b85c" />
        <rect x="29.4" y="42.2" width="2.4" height="9.3" fill="#8a5a8f" />
        <rect x="32.1" y="43.4" width="2.6" height="8.1" fill="#c77d4f" />
        <rect className="page-ribbon-wood" x="19" y="53" width="2.4" height="1.6" />
        <rect className="page-ribbon-wood" x="34.6" y="53" width="2.4" height="1.6" />
      </g>
      {/* The way back's round yellow arrow, drawn as the toy look's round arrow (MenuTop's back-arrow). */}
      <circle className="page-ribbon-badge" cx="47.5" cy="62.5" r="12.5" />
      <path className="page-ribbon-arrow" d="M53.9 62.5H41.5M46.7 56.9L41.1 62.5L46.7 68.1" />
    </svg>
  );
}

/** The ribbon's outline: out of the book's head above the page, lying down it, drifting a little as satin does, cut into a swallowtail. */
const RIBBON = "M17 0H43C42.8 20 42.9 50 43.4 80L30 72.5L16.6 80C17.1 50 17.2 20 17 0Z";
