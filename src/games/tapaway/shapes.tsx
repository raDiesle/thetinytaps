// The bright shapes of „Tap Magic“, drawn by the app itself, never emojis (as Frei tippen's surprises): a press where no
// surprise may come yet still brings something to see.

/** The kinds of shape. */
export const SHAPES = ["star", "heart", "circle", "triangle", "flower", "moon", "square", "drop"] as const;

/** One kind of shape. */
export type ShapeKind = (typeof SHAPES)[number];

const LINE = "#5a3a2a";

/** A shape in `color` with a dark outline and a little light on it, filling its box. */
export function ShapeView({ shape, color }: { shape: ShapeKind; color: string }) {
  return (
    <svg viewBox="-50 -50 100 100" role="presentation">
      <g fill={color} stroke={LINE} strokeWidth="3" strokeLinejoin="round">
        {shape === "star" && <path d="M0 -44 L12 -14 L44 -12 L19 9 L28 40 L0 22 L-28 40 L-19 9 L-44 -12 L-12 -14 Z" />}
        {shape === "heart" && (
          <path d="M0 38 C-30 18 -44 2 -44 -16 C-44 -32 -32 -42 -19 -42 C-9 -42 -3 -36 0 -28 C3 -36 9 -42 19 -42 C32 -42 44 -32 44 -16 C44 2 30 18 0 38 Z" />
        )}
        {shape === "circle" && <circle r="40" />}
        {shape === "triangle" && <path d="M0 -42 L42 36 L-42 36 Z" />}
        {shape === "square" && <rect x="-36" y="-36" width="72" height="72" rx="12" />}
        {shape === "drop" && <path d="M0 -44 C14 -22 34 -2 34 16 C34 34 18 44 0 44 C-18 44 -34 34 -34 16 C-34 -2 -14 -22 0 -44 Z" />}
        {shape === "moon" && <path d="M14 -40 C-12 -36 -30 -14 -30 6 C-30 28 -10 44 14 42 C-4 32 -12 16 -12 0 C-12 -18 -2 -32 14 -40 Z" />}
        {shape === "flower" && (
          <>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cy="-24" rx="15" ry="20" transform={`rotate(${a})`} />
            ))}
            <circle r="14" fill="#ffd23f" />
          </>
        )}
      </g>
      <ellipse cx="-14" cy="-16" rx="7" ry="11" fill="#ffffff88" transform="rotate(30 -14 -16)" />
    </svg>
  );
}
