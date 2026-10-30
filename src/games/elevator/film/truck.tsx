import type { ReactNode } from "react";
import { INK } from "@/games/scenes/shared";
import { FireHelmet, KidHead, useHero } from "../kid";
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
  const hero = useHero();
  const [px, py] = LADDER_PIVOT;
  const turn = { transition: `transform ${ladder.ms}ms ease-in-out` };
  return (
    <g className="fm-truck">
      <ellipse cx="0" cy="2" rx="380" ry="16" fill="#000" opacity="0.15" />
      {/* The body with its shutters, a shining stripe, the wheel arches and the hose reel at the back */}
      <rect x="-330" y="-212" width="496" height="164" rx="14" fill={RED} stroke={INK} strokeWidth="4" />
      <path d="M-316 -204 H150" stroke="#ff8787" strokeWidth="5" strokeLinecap="round" />
      {[-310, -190, -70].map((x) => (
        <g key={x}>
          <rect x={x} y="-196" width="104" height="108" rx="8" fill="#dee2e6" stroke={INK} strokeWidth="3" />
          {[-176, -156, -136, -116].map((y) => (
            <path key={y} d={`M${x + 6} ${y} H${x + 98}`} stroke="#adb5bd" strokeWidth="3" />
          ))}
          <path d={`M${x + 12} -170 l22 -16`} stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          <rect x={x + 40} y="-102" width="24" height="8" rx="4" fill="#868e96" />
        </g>
      ))}
      <rect x="-330" y="-84" width="496" height="8" fill="#fff" stroke={INK} strokeWidth="2" />
      <rect x="-330" y="-76" width="496" height="12" fill="#ffd43b" stroke={INK} strokeWidth="2" />
      {[-210, 210].map((x) => (
        <path key={x} d={`M${x - 60} -48 A60 60 0 0 1 ${x + 60} -48 Z`} fill={DARK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      ))}
      <rect x="-340" y="-62" width="34" height="14" rx="4" fill="#ff6b6b" stroke={INK} strokeWidth="2.5" />
      <circle cx="-336" cy="-150" r="30" fill={DARK} stroke={INK} strokeWidth="3" />
      <circle cx="-336" cy="-150" r="22" fill="none" stroke="#f76707" strokeWidth="6" />
      <circle cx="-336" cy="-150" r="12" fill="none" stroke="#f76707" strokeWidth="6" />
      <circle cx="-336" cy="-150" r="5" fill="#495057" />
      {/* The cab: window, door with its handle and the fire brigade's golden badge, a mirror and a step */}
      <path d="M160 -48 V-240 H286 Q300 -240 306 -226 L334 -150 V-48 Z" fill={RED} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M174 -48 V-232 H284 Q294 -232 298 -222 L310 -190" stroke="#ff8787" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M180 -224 H282 L306 -164 H180 Z" fill="#a5d8ff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M192 -212 l26 -8 M190 -196 l14 -4" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <path d="M176 -230 V-56 H306" stroke={INK} strokeWidth="3" fill="none" />
      <g transform="translate(270 -110)">
        <circle r="17" fill="#ffd43b" stroke={INK} strokeWidth="3" />
        <path d="M0 -10 Q-9 -2 -6 6 Q-2 11 0 11 Q2 11 6 6 Q9 -2 0 -10 Z" fill={RED} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <rect x="334" y="-214" width="10" height="34" rx="4" fill="#495057" stroke={INK} strokeWidth="2" />
      <rect x="196" y="-56" width="70" height="10" rx="4" fill="#adb5bd" stroke={INK} strokeWidth="2.5" />
      {crew && (
        <g>
          <g transform="translate(206 -112) scale(0.5)">
            <KidHead look={CREW[0]} />
            <FireHelmet />
          </g>
          <g transform="translate(262 -104) scale(0.46)">
            <KidHead look={hero} />
            <FireHelmet />
          </g>
        </g>
      )}
      <path d="M180 -164 H306" stroke={INK} strokeWidth="3" />
      <rect x="196" y="-140" width="40" height="8" rx="4" fill={DARK} />
      <circle cx="320" cy="-100" r="13" fill="#ffe066" stroke={INK} strokeWidth="3" />
      <circle cx="316" cy="-104" r="4" fill="#fff" />
      <rect x="296" y="-74" width="52" height="24" rx="8" fill="#adb5bd" stroke={INK} strokeWidth="3" />
      <path d="M302 -66 H340" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      {/* The winch at the front */}
      <circle cx="352" cy="-62" r="12" fill="#495057" stroke={INK} strokeWidth="3" />
      {/* The blue lights, on the cab and at the back */}
      <g className={`fm-blue${light ? " on" : ""}`}>
        <circle className="fm-blue-glow" cx="272" cy="-252" r="34" fill="#74c0fc" />
        <circle className="fm-blue-glow" cx="-306" cy="-224" r="28" fill="#74c0fc" />
        <rect x="252" y="-262" width="40" height="22" rx="8" fill="#4dabf7" stroke={INK} strokeWidth="3" />
        <rect x="-322" y="-234" width="32" height="20" rx="7" fill="#4dabf7" stroke={INK} strokeWidth="3" />
      </g>
      {/* The wheels */}
      {[-210, 210].map((x) => (
        <g key={x} transform={`translate(${x} -44)`}>
          <g className={driving ? "fm-wheel spin" : "fm-wheel"}>
            <circle r="44" fill="#343a40" stroke={INK} strokeWidth="4" />
            <circle r="34" fill="none" stroke="#495057" strokeWidth="3" />
            <circle r="20" fill="#ced4da" stroke={INK} strokeWidth="3" />
            <path d="M-20 0 H20 M0 -20 V20" stroke="#868e96" strokeWidth="4" />
            <circle r="6" fill="#495057" />
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
                <path d="M-30 -34 V0 M0 -34 V0 M30 -34 V0" stroke="#868e96" strokeWidth="3" />
                <path d="M-54 -26 H54" stroke={RED} strokeWidth="6" />
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
