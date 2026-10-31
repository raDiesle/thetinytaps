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
 * its shadow and ending in a swallowtail. On it hangs a round paper label with a little bookshelf in colour, and the
 * app's yellow round arrow of the way back over its edge – big and plain, so a grown-up sees at once where it leads (a
 * shelf stamped small in gold was not recognised). Drawn in a box 60 × 88, the page's edge at y 8: short, so it
 * stays in the room the menus keep free for it.
 */
function RibbonArt() {
  const id = useId();
  return (
    <svg className="page-ribbon-art" viewBox="0 0 60 88" aria-hidden>
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
        <circle cx="30" cy="49" r="23" />
      </g>
      <path d={RIBBON} fill={`url(#${id}s)`} />
      <path d={RIBBON} fill={`url(#${id}r)`} />
      <rect x="19" y="0" width="22" height="14" fill={`url(#${id}f)`} />
      {/* Its woven edges, a little lighter. */}
      <path className="page-ribbon-edge" d="M20.6 2C20.8 26 21 52 22.2 82M39.4 2C39.6 26 40 52 41.2 81" />
      {/* The label, a patch of paper-coloured cloth sewn on round its edge. */}
      <circle className="page-ribbon-label" cx="30" cy="49" r="23" />
      <circle className="page-ribbon-stitch" cx="30" cy="49" r="20.6" />
      <g className="page-ribbon-shelf" transform="translate(30 49) translate(-28 -28.5)">
        {/* The shelf: its frame, a board in the middle, books standing on both boards, one gap for this book. */}
        <rect className="page-ribbon-wood" x="13" y="13" width="30" height="31" rx="1.5" />
        <rect className="page-ribbon-inside" x="16" y="16" width="24" height="11" />
        <rect className="page-ribbon-inside" x="16" y="30" width="24" height="11" />
        <rect x="17" y="18" width="4" height="9" fill="#c0503c" />
        <rect x="21.5" y="19.5" width="3.5" height="7.5" fill="#3f6f8f" />
        <rect x="30" y="18.5" width="4" height="8.5" fill="#5d8a5a" />
        <rect x="34.5" y="20" width="4.5" height="7" fill="#e0b85c" />
        <rect x="17" y="32" width="4.5" height="9" fill="#8a5a8f" />
        <rect x="22" y="33" width="3.5" height="8" fill="#d9a441" />
        <rect x="26" y="31.5" width="4" height="9.5" fill="#2f5d62" />
        <rect x="34" y="32.5" width="5" height="8.5" fill="#c77d4f" />
      </g>
      {/* The way back's round yellow arrow, as on every menu in the toy look. */}
      <circle className="page-ribbon-badge" cx="47" cy="66" r="11" />
      <path className="page-ribbon-arrow" d="M51.5 70.5Q53 61 44 61M44 61l4-4.2M44 61l4.2 3.4" />
    </svg>
  );
}

/** The ribbon's outline: out of the book's head above the page, lying down it, drifting a little as satin does, cut into a swallowtail. */
const RIBBON = "M19 0H41C40.8 14 40.6 30 41.1 46C41.6 60 41.9 72 42.6 86L31.6 79L20.6 87.5C20.2 72 19.8 60 19.6 46C19.4 30 19.2 14 19 0Z";
