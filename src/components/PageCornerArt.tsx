import { useId } from "react";

/**
 * The book page's top right corner, turned up as if a finger had lifted it, with a sign on its back: the way back out
 * of a menu (`back`, an arrow: MenuHead's PageCorner) and out of a game (`close`, a ✕: GameShell's ExitButton, held).
 * Only drawn in the book look (`book.css`); it fills the box it is put in.
 */
export function PageCornerArt({ sign }: { sign: "back" | "close" }) {
  const id = useId();
  return (
    <svg className="page-corner-art" viewBox="0 0 100 100" aria-hidden>
      <defs>
        {/* Under the lifted corner: the next page's paper, in the corner's shadow towards the fold. */}
        <linearGradient id={`${id}u`} x1="1" y1="0" x2="0.5" y2="0.5">
          <stop offset="0" stopColor="#efe4ca" />
          <stop offset="1" stopColor="#cdbb93" />
        </linearGradient>
        {/* The corner's back: lit where it bends at the fold, darker towards its tip. */}
        <linearGradient id={`${id}b`} x1="0.5" y1="0.5" x2="0" y2="1">
          <stop offset="0" stopColor="#d8c8a2" />
          <stop offset="0.18" stopColor="#fffaf0" />
          <stop offset="0.7" stopColor="#f3e8cf" />
          <stop offset="1" stopColor="#dfd0ac" />
        </linearGradient>
      </defs>
      <path d="M0 0H100V100Z" fill={`url(#${id}u)`} />
      <path d="M100 100L96 0" stroke="#c9b68f" strokeWidth="1.5" />
      {/* The corner's shadow on the page, then the corner itself, curling a little at its tip. */}
      <path className="page-corner-shadow" d="M0 0L100 100Q56 93 14 100Q6 56 0 0Z" />
      <path className="page-corner-back" d="M0 0L100 100Q58 90 9 95Q3 52 0 0Z" fill={`url(#${id}b)`} />
      <path className="page-corner-sign" d={sign === "back" ? "M58 80Q40 82 28 68M28 68l1 11M28 68l11 1" : "M27 62L45 80M45 62L27 80"} />
    </svg>
  );
}
