import type { JSX } from "react";
import { INK } from "./face";
import type { TeethSymbol } from "./symbols";

// Drawn stand-ins for the bar's pictures that Gemini has not painted yet (user request, November 2026: the toothpaste
// tube was missing from the bar, its place empty while the picture waited in the queue). Drawn in the painted set's
// manner – one chunky thing with a plum outline, soft shading and a light – so they sit among the painted ones; never an
// emoji. Each goes once its picture is made (`BarSymbol` takes the picture first).

/** A toothpaste tube lying tilted, white with a blue and a red stripe, a striped dab coming out of its nozzle. */
function Tube() {
  return (
    <g stroke={INK} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" transform="rotate(-28 50 52)">
      {/* The crimped end and the body, widening towards the shoulder. */}
      <path d="M16 36 L64 31 Q76 30 78 41 L78 61 Q76 72 64 71 L16 66 Z" fill="url(#bar-tube)" />
      <path d="M18 45 L74 42 L74 49 L18 51 Z" fill="#4cc9f0" stroke="none" />
      <path d="M18 54 L74 53 L74 58 L18 59 Z" fill="#ff5c7a" stroke="none" />
      <path d="M16 36 L64 31 Q76 30 78 41 L78 61 Q76 72 64 71 L16 66 Z" fill="none" />
      <rect x={6} y={33} width={12} height={36} rx={3} fill="#e9eef8" />
      <path d="M10 38 V64 M14 38 V64" strokeWidth={2} opacity={0.5} />
      {/* The shoulder and the nozzle. */}
      <path d="M78 43 L87 46 L87 56 L78 59 Z" fill="#e9eef8" />
      <rect x={87} y={46.5} width={6} height={9} rx={1.5} fill="#fff" />
      {/* The dab of paste, white with a blue stripe, curling up out of the nozzle. */}
      <path d="M93 46 C104 40 110 52 101 57 C97 59 93 57 93 55 Z" fill="#fff" />
      <path d="M95 49 C101 46 105 51 100 54" fill="none" stroke="#4cc9f0" strokeWidth={3} />
      {/* The light along the top. */}
      <path d="M24 39 L60 35" stroke="#fff" strokeWidth={4} opacity={0.9} />
    </g>
  );
}

/** A light-blue cup with a clean child's brush standing in it, head up, two drops on its bristles. */
function Cup() {
  return (
    <g stroke={INK} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" transform="translate(6 1)">
      {/* The brush behind the cup's front: green grip, white handle, white and light-blue tufts. */}
      <path d="M44 74 L56 22" stroke={INK} strokeWidth={11} />
      <path d="M44 74 L56 22" stroke="#fff" strokeWidth={5} />
      <path d="M45.5 68 L50 49" stroke="#5ccf7a" strokeWidth={5} />
      <rect x={49} y={6} width={13} height={20} rx={4} fill="#fff" transform="rotate(13 55 16)" />
      <path d="M62 8 L70 10 M63 13 L71 15 M62 18 L70 20" stroke="#4cc9f0" strokeWidth={4} transform="rotate(13 55 16)" />
      <circle cx={74} cy={27} r={3} fill="#bde0fe" strokeWidth={2} />
      <circle cx={79} cy={35} r={2.4} fill="#bde0fe" strokeWidth={2} />
      {/* The cup, its rim and a light down its side. */}
      <path d="M24 44 L76 44 L70 94 L30 94 Z" fill="url(#bar-cup)" />
      <ellipse cx={50} cy={44} rx={26} ry={5} fill="#d6ecff" />
      <path d="M33 52 L37 86" stroke="#fff" strokeWidth={4} opacity={0.8} />
    </g>
  );
}

/** Each stand-in with the part of its drawing it fills the symbol's square with. */
const DRAWN: Partial<Record<TeethSymbol, { Drawing: () => JSX.Element; viewBox: string }>> = {
  zahnpasta: { Drawing: Tube, viewBox: "6 6 102 92" },
  becher: { Drawing: Cup, viewBox: "14 1 84 98" },
};

/** Whether the bar has a drawn stand-in for a picture still waiting. */
export const hasDrawnSymbol = (name: TeethSymbol) => name in DRAWN;

/** A bar symbol drawn in SVG, standing in until its picture is painted; nothing where there is none. */
export function DrawnSymbol({ name }: { name: TeethSymbol }) {
  const drawn = DRAWN[name];
  if (!drawn) return null;
  const { Drawing, viewBox } = drawn;
  return (
    <svg className="teeth-symbol" viewBox={viewBox} aria-hidden>
      <defs>
        <linearGradient id="bar-tube" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#dfe6f3" />
        </linearGradient>
        <linearGradient id="bar-cup" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#bde0fe" />
          <stop offset="1" stopColor="#7cc0f5" />
        </linearGradient>
      </defs>
      <Drawing />
    </svg>
  );
}
