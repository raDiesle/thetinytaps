import type { ReactNode } from "react";
import { INK } from "@/games/scenes/shared";
import { FireHelmet, HERO, KidHead } from "../kid";
import { CREW } from "./people";

/** The turntable ladder's pivot on the truck's back, and how long one section is. */
export const LADDER_PIVOT = [-250, -214] as const;
export const LADDER_LEN = 420;
/** The ladder lies this far above its pivot, clear of the cab. */
const LIFT = 34;

/** The ladder: lying on the truck (`angle` 0), or raised by `angle` degrees and pulled out by `reach`, in `ms`. */
export interface Ladder {
  angle: number;
  reach: number;
  ms: number;
}

const RED = "#e03131";
const DARK = "#a51d1d";

/** One section of the ladder, from (0, 0) along x: two rails with rungs between. */
function Section() {
  return (
    <g>
      <rect x="0" y="-16" width={LADDER_LEN} height="8" rx="3" fill="#ced4da" stroke={INK} strokeWidth="2.5" />
      <rect x="0" y="6" width={LADDER_LEN} height="8" rx="3" fill="#ced4da" stroke={INK} strokeWidth="2.5" />
      {Array.from({ length: 13 }, (_, i) => (
        <path key={i} d={`M${16 + i * 32} -8 V6`} stroke="#868e96" strokeWidth="5" />
      ))}
    </g>
  );
}

/**
 * The fire engine, facing right with its wheels on (0, 0): the red body with its shutters and the hose reel at the
 * back, the cab with the child and a firefighter behind the window (`crew`), the blue light on the roof (blinking
 * while `light`), the turntable ladder with its basket on top and the winch at the front. The wheels turn while
 * `driving`.
 */
export function FireTruck({
  light = false,
  driving = false,
  crew = false,
  ladder = { angle: 0, reach: 0, ms: 0 },
  basket,
}: {
  light?: boolean;
  driving?: boolean;
  crew?: boolean;
  ladder?: Ladder;
  /** Who stands in the basket, drawn standing on its floor (0, 0). */
  basket?: ReactNode;
}) {
  const [px, py] = LADDER_PIVOT;
  const turn = { transition: `transform ${ladder.ms}ms ease-in-out` };
  return (
    <g className="fm-truck">
      {/* The body with its shutters, a shining stripe and the hose reel at the back */}
      <rect x="-330" y="-212" width="496" height="164" rx="14" fill={RED} stroke={INK} strokeWidth="4" />
      {[-310, -190, -70].map((x) => (
        <g key={x}>
          <rect x={x} y="-196" width="104" height="108" rx="8" fill="#dee2e6" stroke={INK} strokeWidth="3" />
          {[-176, -156, -136, -116].map((y) => (
            <path key={y} d={`M${x + 6} ${y} H${x + 98}`} stroke="#adb5bd" strokeWidth="3" />
          ))}
          <rect x={x + 40} y="-102" width="24" height="8" rx="4" fill="#868e96" />
        </g>
      ))}
      <rect x="-330" y="-80" width="496" height="12" fill="#ffd43b" stroke={INK} strokeWidth="2" />
      <circle cx="-336" cy="-150" r="26" fill={DARK} stroke={INK} strokeWidth="3" />
      <circle cx="-336" cy="-150" r="14" fill="#fff3bf" stroke={INK} strokeWidth="2" />
      {/* The cab */}
      <path d="M160 -48 V-240 H286 Q300 -240 306 -226 L334 -150 V-48 Z" fill={RED} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M180 -224 H282 L306 -164 H180 Z" fill="#a5d8ff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {crew && (
        <g>
          <g transform="translate(206 -112) scale(0.5)">
            <KidHead look={CREW[0]} />
            <FireHelmet />
          </g>
          <g transform="translate(262 -104) scale(0.46)">
            <KidHead look={HERO} />
            <FireHelmet />
          </g>
        </g>
      )}
      <path d="M180 -164 H306" stroke={INK} strokeWidth="3" />
      <rect x="196" y="-140" width="60" height="8" rx="4" fill={DARK} />
      <circle cx="320" cy="-100" r="12" fill="#ffe066" stroke={INK} strokeWidth="3" />
      <rect x="296" y="-74" width="52" height="24" rx="8" fill="#adb5bd" stroke={INK} strokeWidth="3" />
      {/* The winch at the front */}
      <circle cx="352" cy="-62" r="12" fill="#495057" stroke={INK} strokeWidth="3" />
      {/* The blue light */}
      <g className={`fm-blue${light ? " on" : ""}`}>
        <circle className="fm-blue-glow" cx="272" cy="-252" r="34" fill="#74c0fc" />
        <rect x="252" y="-262" width="40" height="22" rx="8" fill="#4dabf7" stroke={INK} strokeWidth="3" />
      </g>
      {/* The wheels */}
      {[-210, 210].map((x) => (
        <g key={x} transform={`translate(${x} -44)`}>
          <g className={driving ? "fm-wheel spin" : "fm-wheel"}>
            <circle r="44" fill="#343a40" stroke={INK} strokeWidth="4" />
            <circle r="20" fill="#ced4da" stroke={INK} strokeWidth="3" />
            <path d="M-20 0 H20 M0 -20 V20" stroke="#868e96" strokeWidth="4" />
          </g>
        </g>
      ))}
      {/* The ladder on its turntable: raised and pulled out by CSS, the basket staying upright at its tip */}
      <rect x={px - 34} y={py - 6} width="68" height="16" rx="6" fill="#868e96" stroke={INK} strokeWidth="3" />
      <rect x="140" y="-236" width="14" height="26" fill="#868e96" stroke={INK} strokeWidth="2.5" />
      <rect x={px - 10} y={py - 30} width="20" height="24" fill="#868e96" stroke={INK} strokeWidth="2.5" />
      <g transform={`translate(${px} ${py - LIFT})`}>
        <g style={{ ...turn, transform: `rotate(${-ladder.angle}deg)` }}>
          <Section />
          <g style={{ ...turn, transform: `translateX(${ladder.reach}px)` }}>
            <Section />
            <g transform={`translate(${LADDER_LEN} 0)`}>
              <g style={{ ...turn, transform: `rotate(${ladder.angle}deg)` }}>
                <rect x="-50" y="-70" width="100" height="70" rx="6" fill="#fff" fillOpacity="0.25" stroke={INK} strokeWidth="3" />
                {basket}
                <rect x="-54" y="-34" width="108" height="34" rx="6" fill="#ced4da" stroke={INK} strokeWidth="3" />
                <path d="M-54 -70 H54" stroke={INK} strokeWidth="5" strokeLinecap="round" />
              </g>
            </g>
          </g>
        </g>
        <circle r="14" fill="#495057" stroke={INK} strokeWidth="3" />
      </g>
    </g>
  );
}

/** Where the basket's floor is, on a truck standing at (0, 0) with its ladder raised by `angle` and pulled out by `reach`. */
export function basketAt(angle: number, reach: number): [number, number] {
  const a = (angle * Math.PI) / 180;
  const len = LADDER_LEN + reach;
  return [LADDER_PIVOT[0] + Math.cos(a) * len, LADDER_PIVOT[1] - LIFT - Math.sin(a) * len];
}
