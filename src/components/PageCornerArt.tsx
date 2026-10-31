import { useId } from "react";

/**
 * The way back in the book look: the corner of the page before, lifted at the spine (the page's top left) as if a
 * finger had taken it and were turning it back over to the right – which is how the page then turns (`book.css`,
 * `data-turn="back"`), so the corner that is touched is the page that moves (user feedback, October 2026). Its sign
 * tells where it leads: back out of a menu (`back`, an arrow: MenuHead's PageCorner) or out of a game (`close`, a ✕:
 * GameShell's ExitButton, held). Only drawn in the book look; it fills the box it is put in, its spine on the left.
 */
export function PageCornerArt({ sign }: { sign: "back" | "close" }) {
  const id = useId();
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
