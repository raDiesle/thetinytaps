import type { ReactNode } from "react";
import { EDGE, ROAD_BOTTOM, ROAD_TOP, VIEW_W, ZEBRA_L, ZEBRA_R, type AnimalId, type CarKind, type Phase } from "./world";

// The drawings of "Ampel und Zebrastreifen", in the SVG units of world.ts. Animals and cars
// are drawn with their feet or wheels at y = 0; a car's front bumper is at x = 0 and it faces right.

const INK = "#2b2d42";
const PAVEMENT = "#ddd6cb";
const KERB = "#adb5bd";

/** The houses behind the far pavement: x, width, height, wall and roof colour. */
const HOUSES: [number, number, number, string, string][] = [
  [-360, 150, 120, "#caffbf", "#7fb069"],
  [-190, 170, 104, "#bde0fe", "#7aa6d6"],
  [-20, 170, 112, "#ffb4a2", "#e5989b"],
  [170, 140, 132, "#bde0fe", "#7aa6d6"],
  [330, 190, 100, "#fff3b0", "#e09f3e"],
  [540, 150, 128, "#caffbf", "#7fb069"],
  [710, 170, 108, "#ffd6ff", "#c77dff"],
  [900, 140, 124, "#ffc8a2", "#e76f51"],
  [1060, 160, 110, "#fff3b0", "#e09f3e"],
  [1240, 150, 126, "#ffb4a2", "#e5989b"],
];

const GROUND = 150;

/** One house: wall, roof, windows and a door. */
function House({ x, w, h, wall, roof }: { x: number; w: number; h: number; wall: string; roof: string }) {
  const top = GROUND - h;
  const windows = Math.floor((w - 30) / 50);
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={wall} />
      <path d={`M${x - 10} ${top} L${x + w / 2} ${top - 44} L${x + w + 10} ${top} Z`} fill={roof} />
      {Array.from({ length: windows }, (_, i) => (
        <rect key={i} x={x + 22 + i * 50} y={top + 18} width="30" height="30" rx="4" fill="#fdfcdc" stroke={INK} strokeWidth="3" />
      ))}
      <rect x={x + w / 2 - 15} y={GROUND - 46} width="30" height="46" rx="6" fill={roof} />
    </g>
  );
}

/** Houses, both pavements, the road with its centre line, the stop lines and the zebra crossing. */
export function Street() {
  const dashes = [];
  for (let x = 10 - 70 * 6; x < VIEW_W + EDGE; x += 70) {
    if (x + 40 > ZEBRA_L - 20 && x < ZEBRA_R + 20) continue;
    dashes.push(<rect key={x} x={x} y={(ROAD_TOP + ROAD_BOTTOM) / 2 - 3} width="40" height="6" rx="3" fill="#f8f9fa" />);
  }
  return (
    <g>
      {HOUSES.map(([x, w, h, wall, roof]) => (
        <House key={x} x={x} w={w} h={h} wall={wall} roof={roof} />
      ))}
      <rect x={-EDGE} y={GROUND} width={VIEW_W + 2 * EDGE} height={ROAD_TOP - GROUND} fill={PAVEMENT} />
      <rect x={-EDGE} y={ROAD_TOP - 6} width={VIEW_W + 2 * EDGE} height="8" fill={KERB} />
      <rect x={-EDGE} y={ROAD_TOP} width={VIEW_W + 2 * EDGE} height={ROAD_BOTTOM - ROAD_TOP} fill="#5a6170" />
      {dashes}
      {/* Stop lines: where the cars wait, one in each lane */}
      <rect x={ZEBRA_L - 18} y={(ROAD_TOP + ROAD_BOTTOM) / 2 + 4} width="7" height={(ROAD_BOTTOM - ROAD_TOP) / 2 - 8} fill="#f8f9fa" />
      <rect x={ZEBRA_R + 11} y={ROAD_TOP + 4} width="7" height={(ROAD_BOTTOM - ROAD_TOP) / 2 - 8} fill="#f8f9fa" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={ZEBRA_L} y={ROAD_TOP + 10 + i * 32} width={ZEBRA_R - ZEBRA_L} height="18" rx="2" fill="#f8f9fa" />
      ))}
      <rect x={-EDGE} y={ROAD_BOTTOM - 2} width={VIEW_W + 2 * EDGE} height="8" fill={KERB} />
      <rect x={-EDGE} y={ROAD_BOTTOM + 6} width={VIEW_W + 2 * EDGE} height="300" fill={PAVEMENT} />
      <rect x={-EDGE} y="664" width={VIEW_W + 2 * EDGE} height="200" fill="#8ac926" />
      {[60, 180, 820, 940].map((x) => (
        <g key={x} transform={`translate(${x} 668)`}>
          <circle r="7" fill="#ffd60a" />
          <circle r="3" fill="#ff8c42" />
        </g>
      ))}
    </g>
  );
}

/** The cars' light on the far pavement: red, amber, green. */
export function CarLight({ phase }: { phase: Phase }) {
  const red = phase === "walk" || phase === "toStop";
  const amber = phase === "toWalk" || phase === "toStop";
  const green = phase === "stop";
  return (
    <g transform="translate(330 0)">
      <rect x="-5" y="120" width="10" height="104" fill="#495057" />
      <rect x="-26" y="14" width="52" height="116" rx="12" fill={INK} />
      <circle cy="42" r="14" fill={red ? "#ff3b3b" : "#5a1e1e"} />
      <circle cy="73" r="14" fill={amber ? "#ffb703" : "#5c4310"} />
      <circle cy="104" r="14" fill={green ? "#3ec300" : "#1e3a24"} />
    </g>
  );
}

/** The red man, standing; its middle at 0, 0. */
const RED_MAN = (
  <g transform="scale(1.9) translate(0 218)">
    <circle cx="0" cy="-230" r="5" />
    <rect x="-6" y="-224" width="12" height="15" rx="3" />
    <rect x="-10" y="-223" width="4" height="12" rx="2" />
    <rect x="6" y="-223" width="4" height="12" rx="2" />
    <rect x="-6" y="-210" width="5" height="8" rx="2" />
    <rect x="1" y="-210" width="5" height="8" rx="2" />
  </g>
);

/** The green man, walking; its middle at 0, 0. */
const GREEN_MAN = (
  <g transform="scale(1.9) translate(0 175)">
    <circle cx="2" cy="-186" r="5" stroke="none" />
    <path d="M1 -178 L-1 -168 M-1 -168 L-7 -160 M-1 -168 L5 -160 M0 -176 L-7 -170 M1 -176 L7 -172" fill="none" />
  </g>
);

/** The big light for the walkers next to the zebra, with its yellow button box. */
export function WalkLight({ phase, press }: { phase: Phase; press: number }) {
  const green = phase === "walk";
  return (
    <g className="amp-walklight" transform="translate(700 0)">
      <rect x="-7" y="600" width="14" height="92" fill="#495057" />
      <rect x="-56" y="440" width="112" height="172" rx="18" fill={INK} />
      <rect x="-44" y="452" width="88" height="70" rx="10" fill={green ? "#3a1414" : "#5a1e1e"} />
      <rect x="-44" y="530" width="88" height="70" rx="10" fill={green ? "#1e3a24" : "#142417"} />
      <g transform="translate(0 487)" fill={green ? "#6b2a2a" : "#ff3b3b"}>
        {RED_MAN}
      </g>
      <g transform="translate(0 565)" fill={green ? "#3ec300" : "#24502c"} stroke={green ? "#3ec300" : "#24502c"} strokeWidth="4" strokeLinecap="round">
        {GREEN_MAN}
      </g>
      <rect x="-50" y="446" width="12" height="160" rx="6" fill="#fff" opacity="0.1" />
      {/* The button box: its signal lights up while the light changes */}
      <g key={press} className={press ? "amp-press" : undefined} style={{ transformOrigin: "0px 640px" }}>
        <rect x="-26" y="614" width="52" height="52" rx="8" fill="#ffd60a" />
        <rect x="-16" y="621" width="32" height="8" rx="3" fill={phase === "toWalk" ? "#ff8c42" : "#c9a227"} />
        <circle cx="0" cy="646" r="10" fill={INK} />
      </g>
    </g>
  );
}

/** A thought bubble with the red man, over the bear when it calls the duck back. */
export function StopBubble() {
  return (
    <g className="amp-bubble">
      <circle cx="0" cy="-160" r="34" fill="#fff" stroke={INK} strokeWidth="3" />
      <circle cx="-14" cy="-118" r="7" fill="#fff" stroke={INK} strokeWidth="3" />
      <g transform="translate(0 -160) scale(0.85)" fill="#ff3b3b">
        {RED_MAN}
      </g>
    </g>
  );
}

/** An animal at the crossing. `wave` lifts the bear's arm, `look` turns the duck's head left and right. */
export function AnimalFigure({ id, wave, look }: { id: AnimalId; wave?: boolean; look?: boolean }) {
  return DRAW[id](wave ?? false, look ?? false);
}

const eyes = (y: number, dx: number, r = 3.5) => (
  <>
    <circle cx={-dx} cy={y} r={r} fill={INK} />
    <circle cx={dx} cy={y} r={r} fill={INK} />
  </>
);

const DRAW: Record<AnimalId, (wave: boolean, look: boolean) => ReactNode> = {
  baer: (wave) => (
    <>
      <ellipse cx="-15" cy="-9" rx="13" ry="10" fill="#7b4a1f" />
      <ellipse cx="15" cy="-9" rx="13" ry="10" fill="#7b4a1f" />
      <ellipse cx="0" cy="-44" rx="31" ry="35" fill="#9c6230" />
      <ellipse cx="0" cy="-40" rx="18" ry="22" fill="#d9a066" />
      <ellipse cx="-30" cy="-50" rx="9" ry="19" fill="#7b4a1f" />
      <g className={wave ? "amp-arm amp-waving" : "amp-arm"} style={{ transformOrigin: "28px -64px" }}>
        <ellipse cx="30" cy="-50" rx="9" ry="19" fill="#7b4a1f" />
      </g>
      <circle cx="-21" cy="-104" r="11" fill="#7b4a1f" />
      <circle cx="21" cy="-104" r="11" fill="#7b4a1f" />
      <circle cx="0" cy="-88" r="27" fill="#9c6230" />
      <ellipse cx="0" cy="-79" rx="13" ry="10" fill="#d9a066" />
      <ellipse cx="0" cy="-84" rx="6" ry="4" fill={INK} />
      <path d="M-5 -76 Q0 -72 5 -76" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {eyes(-95, 10)}
    </>
  ),
  ente: (_, look) => (
    <>
      <ellipse cx="-9" cy="-3" rx="10" ry="4" fill="#ff8c42" />
      <ellipse cx="9" cy="-3" rx="10" ry="4" fill="#ff8c42" />
      <ellipse cx="0" cy="-24" rx="25" ry="20" fill="#ffd60a" />
      <ellipse cx="-21" cy="-26" rx="8" ry="13" fill="#f2b705" />
      <ellipse cx="21" cy="-26" rx="8" ry="13" fill="#f2b705" />
      <g className={look ? "amp-looking" : undefined}>
        <circle cx="0" cy="-55" r="17" fill="#ffd60a" />
        <path d="M-2 -71 q4 -10 8 -2" stroke="#f2b705" strokeWidth="4" fill="none" strokeLinecap="round" />
        {eyes(-59, 6, 3)}
        <ellipse cx="0" cy="-49" rx="9" ry="5" fill="#ff8c42" />
      </g>
    </>
  ),
  hase: () => (
    <>
      <ellipse cx="-12" cy="-5" rx="12" ry="6" fill="#ced4da" />
      <ellipse cx="12" cy="-5" rx="12" ry="6" fill="#ced4da" />
      <ellipse cx="0" cy="-33" rx="22" ry="27" fill="#dee2e6" />
      <ellipse cx="0" cy="-29" rx="13" ry="17" fill="#fff" />
      <g transform="rotate(-8 -9 -84)">
        <ellipse cx="-9" cy="-100" rx="8" ry="22" fill="#dee2e6" />
        <ellipse cx="-9" cy="-100" rx="4" ry="15" fill="#ffafcc" />
      </g>
      <g transform="rotate(8 9 -84)">
        <ellipse cx="9" cy="-100" rx="8" ry="22" fill="#dee2e6" />
        <ellipse cx="9" cy="-100" rx="4" ry="15" fill="#ffafcc" />
      </g>
      <circle cx="0" cy="-68" r="20" fill="#dee2e6" />
      {eyes(-72, 7, 3)}
      <circle cx="0" cy="-63" r="3.5" fill="#ff7bac" />
      <rect x="-4" y="-59" width="8" height="6" rx="1" fill="#fff" stroke={INK} strokeWidth="1" />
    </>
  ),
  schwein: () => (
    <>
      <rect x="-20" y="-16" width="10" height="16" rx="3" fill="#f4a3b5" />
      <rect x="10" y="-16" width="10" height="16" rx="3" fill="#f4a3b5" />
      <ellipse cx="0" cy="-32" rx="30" ry="23" fill="#ffc2d1" />
      <path d="M-18 -72 L-22 -88 L-6 -76 Z M18 -72 L22 -88 L6 -76 Z" fill="#f4a3b5" />
      <circle cx="0" cy="-60" r="20" fill="#ffc2d1" />
      {eyes(-66, 7, 3)}
      <ellipse cx="0" cy="-53" rx="10" ry="7" fill="#f4a3b5" />
      <circle cx="-3.5" cy="-53" r="2" fill="#c9184a" />
      <circle cx="3.5" cy="-53" r="2" fill="#c9184a" />
    </>
  ),
};

/** The colours of the cars, one after the other. */
const CAR_COLOURS = ["#e63946", "#4cc9f0", "#8e7dff", "#3ec300", "#ff8c42"];

/** A wheel at x; it turns while the car drives. */
function Wheel({ x, rolling }: { x: number; rolling: boolean }) {
  return (
    <g transform={`translate(${x} -16)`}>
      <g className={rolling ? "amp-rolling" : undefined}>
        <circle r="17" fill={INK} />
        <circle r="7" fill="#adb5bd" />
        <rect x="-2" y="-15" width="4" height="10" fill="#adb5bd" />
      </g>
    </g>
  );
}

/** A car or the bus, with a driver behind the windscreen. */
export function CarFigure({ kind, n, rolling }: { kind: CarKind; n: number; rolling: boolean }) {
  if (kind === "bus") {
    return (
      <>
        <rect x="-250" y="-112" width="250" height="96" rx="16" fill="#ffb703" />
        <rect x="-250" y="-52" width="250" height="10" fill="#fb8500" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={-236 + i * 42} y="-98" width="32" height="32" rx="5" fill="#cfeffd" />
        ))}
        <rect x="-26" y="-100" width="20" height="48" rx="5" fill="#cfeffd" />
        <circle cx="-40" cy="-80" r="8" fill="#ffd6a5" />
        <circle cx="-8" cy="-30" r="6" fill="#fff3b0" />
        <Wheel x={-46} rolling={rolling} />
        <Wheel x={-204} rolling={rolling} />
      </>
    );
  }
  const colour = CAR_COLOURS[n % CAR_COLOURS.length];
  return (
    <>
      <path d="M-118 -58 L-98 -92 H-48 L-28 -58 Z" fill={colour} />
      <path d="M-108 -60 L-94 -85 H-76 V-60 Z M-70 -60 V-85 H-52 L-38 -60 Z" fill="#cfeffd" />
      <circle cx="-60" cy="-70" r="7" fill="#ffd6a5" />
      <rect x="-150" y="-60" width="150" height="44" rx="14" fill={colour} />
      <circle cx="-8" cy="-44" r="6" fill="#fff3b0" />
      <rect x="-150" y="-52" width="6" height="12" rx="2" fill="#c1121f" />
      <Wheel x={-32} rolling={rolling} />
      <Wheel x={-118} rolling={rolling} />
    </>
  );
}
