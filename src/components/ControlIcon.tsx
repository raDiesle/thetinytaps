/** The ink of the drawn control signs, the books' dark purple line. */
const INK = "#2a1e5c";

/**
 * The drawn signs on a game's play controls (Zähne putzen, Aufs Töpfchen), never emoji (⏸️ ▶️ looked poor, user
 * feedback, November 2026): two round bars to pause, a round triangle to go on, an arrow turning round to start again,
 * and an arrow pointing right on to the next (a level's end, `GameEnd`): a straight shaft and an even head.
 */
export function ControlIcon({ kind, className }: { kind: "pause" | "play" | "again" | "next"; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden>
      {kind === "next" ? (
        <path d="M7 16 H20.5 V8.5 L34 20 L20.5 31.5 V24 H7 Z" fill={INK} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      ) : kind === "pause" ? (
        <g fill={INK}>
          <rect x={10} y={9} width={7.5} height={22} rx={3} />
          <rect x={22.5} y={9} width={7.5} height={22} rx={3} />
        </g>
      ) : kind === "play" ? (
        <path d="M14 9.5 C14 7.8 15.8 6.9 17.2 7.8 L31 17.4 C32.3 18.3 32.3 21.7 31 22.6 L17.2 32.2 C15.8 33.1 14 32.2 14 30.5 Z" fill={INK} />
      ) : (
        // A ring turning clockwise, open at the top right where its arrowhead points on round it.
        <g stroke={INK} strokeLinecap="round" strokeLinejoin="round" transform="translate(0 1)">
          <path d="M30.8 18.1 A11 11 0 1 1 23.8 9.7" fill="none" strokeWidth={4.5} />
          <path d="M25.6 4.5 L30.3 12.1 L21.9 14.8 Z" fill={INK} strokeWidth={2} />
        </g>
      )}
    </svg>
  );
}
