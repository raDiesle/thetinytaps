import type { ReactNode } from "react";
import { Cloud, INK } from "@/games/scenes/shared";
import { Bone, WateringCan } from "./items";
import type { Point, SceneryProps } from "./types";

// "Der Ball rollt weg": down the own street – the front garden, the traffic light with its button
// and the zebra crossing, the pet shop, the dog at its door, who comes along once it has its bone – into the park,
// past the sunflowers, up the ladder and down the slide to the sandbox, where the dog digs the ball out of the sand.
// World points: the pavement is at y = 740 the whole way; only the ladder and the slide go up.

export const GROUND_Y = 740;

/** The rungs of the slide's ladder, where the feet go, from the bottom up to the platform. */
export const LADDER: Point[] = Array.from({ length: 5 }, (_, i) => [3420 + i * 20, 680 - i * 60]);

/** The slide from the platform down to the grass: the child slides along these points. */
export const SLIDE: Point[] = [
  [3550, 440],
  [3600, 462],
  [3680, 530],
  [3760, 612],
  [3840, 684],
  [3920, 728],
  [4000, GROUND_Y],
];

/** Where the ball ends up: half in the sand of the sandbox. */
export const BALL_AT: Point = [4440, 768];

const PAVEMENT = "#ced4da";
const ROAD = "#495057";
const GRASS = "#69db7c";
const SAND = "#ffd8a8";
const WOOD = "#c08552";
const WOOD_DARK = "#8d5a3b";
/** Where the street ends and the park begins. */
const PARK_X = 2640;
/** The crossing road, from curb to curb. */
const ROAD_FROM = 1070;
const ROAD_TO = 1430;

/** A wobble when a wrong thing is tried; keyed so every try starts it anew. */
function Nope({ id, nope, children }: { id: string; nope: SceneryProps["nope"]; children: ReactNode }) {
  const on = nope?.id === id;
  return (
    <g key={on ? nope.n : 0} className={on ? "tl-nope" : undefined}>
      {children}
    </g>
  );
}

/** A house front standing on the pavement, with windows and a door. */
function Front({ x, w, h, wall, roof, door }: { x: number; w: number; h: number; wall: string; roof: string; door: number }) {
  const top = GROUND_Y - h;
  const windows = [];
  for (let wx = x + 40; wx + 60 <= x + w - 30; wx += 100) if (wx + 60 < door || wx > door + 80) windows.push(wx);
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={wall} stroke={INK} strokeWidth="5" />
      <path
        d={`M${x - 24} ${top + 6} L${x + w / 2} ${top - 120} L${x + w + 24} ${top + 6} Z`}
        fill={roof}
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {windows.map((wx) =>
        [top + 40, top + 150].map((wy) =>
          wy + 60 < GROUND_Y - 20 ? (
            <g key={`${wx}${wy}`}>
              <rect x={wx} y={wy} width="60" height="64" rx="6" fill="#a5d8ff" stroke={INK} strokeWidth="4" />
              <path d={`M${wx + 30} ${wy} V${wy + 64} M${wx} ${wy + 32} H${wx + 60}`} stroke={INK} strokeWidth="3" />
            </g>
          ) : null,
        ),
      )}
      <rect x={door} y={GROUND_Y - 130} width="80" height="130" rx="8" fill="#a0673a" stroke={INK} strokeWidth="5" />
      <circle cx={door + 64} cy={GROUND_Y - 64} r="6" fill="#ffd43b" stroke={INK} strokeWidth="2" />
    </g>
  );
}

/** The pavement along the houses, the street in front of it, and the grass of the park. */
function Ground() {
  return (
    <g>
      <rect x="-1400" y={GROUND_Y + 30} width="12000" height="2000" fill={ROAD} />
      <path d={`M-1400 ${GROUND_Y + 80} H${PARK_X}`} stroke="#fff" strokeWidth="8" strokeDasharray="60 50" />
      {/* The pavement, cut by the crossing road */}
      {[
        [-1400, ROAD_FROM],
        [ROAD_TO, PARK_X],
      ].map(([from, to]) => (
        <g key={from}>
          <rect x={from} y={GROUND_Y - 4} width={to - from} height="34" fill={PAVEMENT} />
          <rect x={from} y={GROUND_Y + 26} width={to - from} height="10" fill="#868e96" />
        </g>
      ))}
      {Array.from({ length: Math.floor((PARK_X + 1400) / 70) }, (_, i) => -1400 + i * 70)
        .filter((x) => x < ROAD_FROM - 10 || x > ROAD_TO + 10)
        .map((x) => (
          <path key={x} d={`M${x} ${GROUND_Y - 2} l-8 30`} stroke="#adb5bd" strokeWidth="3" />
        ))}
      {/* The park: grass and a gravel path */}
      <rect x={PARK_X} y={GROUND_Y - 4} width="8000" height="40" fill={GRASS} />
      <rect x={PARK_X} y={GROUND_Y + 8} width="8000" height="18" fill="#e9c891" />
    </g>
  );
}

/** The road that crosses the pavement, going away into the town, with the zebra crossing and a car waiting. */
function Crossing() {
  return (
    <g>
      <path d={`M${ROAD_FROM} ${GROUND_Y + 36} V${GROUND_Y - 4} L1210 560 H1290 L${ROAD_TO} ${GROUND_Y - 4} V${GROUND_Y + 36} Z`} fill={ROAD} />
      <path d={`M1250 ${GROUND_Y - 20} V570`} stroke="#fff" strokeWidth="5" strokeDasharray="26 22" />
      {/* The zebra crossing: white bars across the road */}
      {Array.from({ length: 6 }, (_, i) => ROAD_FROM + 20 + i * 58).map((x) => (
        <path key={x} d={`M${x} ${GROUND_Y + 30} l14 -34 h32 l-14 34 Z`} fill="#fff" />
      ))}
      {/* A small car waits further back */}
      <g transform="translate(1250 672) scale(0.7)">
        <rect x="-70" y="-40" width="140" height="66" rx="18" fill="#f76707" stroke={INK} strokeWidth="5" />
        <path d="M-50 -40 L-36 -86 H36 L50 -40 Z" fill="#f76707" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M-38 -44 L-28 -78 H28 L38 -44 Z" fill="#a5d8ff" stroke={INK} strokeWidth="3" />
        {[-44, 44].map((x) => (
          <circle key={x} cx={x} cy="-10" r="14" fill="#fff3bf" stroke={INK} strokeWidth="4" />
        ))}
        <rect x="-22" y="4" width="44" height="12" rx="4" fill="#adb5bd" stroke={INK} strokeWidth="3" />
        {[-52, 52].map((x) => (
          <rect key={x} x={x - 14} y="22" width="28" height="22" rx="6" fill={INK} />
        ))}
      </g>
    </g>
  );
}

/** A little walking man in a lamp of the traffic light: red stands, green walks. */
function Walker({ y, colour, walking, lit }: { y: number; colour: string; walking: boolean; lit: boolean }) {
  return (
    <g transform={`translate(1030 ${y})`}>
      <rect x="-30" y="-30" width="60" height="60" rx="10" fill="#212529" />
      <g fill={lit ? colour : "#495057"}>
        <circle cx="0" cy="-17" r="7" />
        {walking ? (
          <path d="M-6 -8 H6 L10 6 L18 22 H10 L4 10 L-4 22 H-14 L-6 6 Z M6 -6 L18 6 L14 9 L4 2 Z M-6 -6 L-16 6 L-12 9 L-4 2 Z" />
        ) : (
          <path d="M-8 -8 H8 V10 H4 V24 H-4 V10 H-8 Z M-8 -8 L-16 10 H-12 L-8 2 Z M8 -8 L16 10 H12 L8 2 Z" />
        )}
      </g>
    </g>
  );
}

/** The traffic light for walkers, with the button box at the child's hand. */
function TrafficLight({ done, here }: SceneryProps) {
  const green = done.includes("light");
  const waiting = here === "light" && !green;
  return (
    <g>
      <rect x="1022" y="430" width="16" height={GROUND_Y - 430} fill="#868e96" stroke={INK} strokeWidth="4" />
      <rect x="994" y="436" width="72" height="146" rx="12" fill="#343a40" stroke={INK} strokeWidth="5" />
      <Walker y={474} colour="#ff6b6b" walking={false} lit={!green} />
      <Walker y={544} colour="#51cf66" walking lit={green} />
      {/* The button box: its lamp lights up when the child presses */}
      <rect x="996" y="606" width="66" height="70" rx="10" fill="#fcc419" stroke={INK} strokeWidth="5" />
      <rect x="1008" y="616" width="42" height="14" rx="5" className={waiting ? "tl-ball-signal" : undefined} fill={waiting ? "#fff" : "#868e96"} />
      <circle cx="1029" cy="652" r="12" fill="#f8f9fa" stroke={INK} strokeWidth="4" />
    </g>
  );
}

function FrontGarden({ can }: { can: boolean }) {
  return (
    <g>
      {[470, 540, 610, 680, 750].map((x, i) => (
        <circle key={x} cx={x} cy={GROUND_Y - 34 - (i % 2) * 8} r="44" fill="#2f9e44" stroke="#2b8a3e" strokeWidth="4" />
      ))}
      <rect x="430" y={GROUND_Y - 30} width="370" height="30" fill="#2f9e44" />
      {[490, 590, 700].map((x, i) => (
        <circle key={x} cx={x} cy={GROUND_Y - 64 + i * 6} r="9" fill={["#ff8fa3", "#fff", "#ffd43b"][i]} stroke={INK} strokeWidth="2" />
      ))}
      {can && (
        <g transform={`translate(640 ${GROUND_Y + 2})`}>
          <WateringCan />
        </g>
      )}
    </g>
  );
}

/** The pet shop: a fish bowl and a bird in the window, a paw on its sign; a bone lies on the table outside. */
function PetShop({ bone }: { bone: boolean }) {
  return (
    <g>
      <rect x="1460" y="420" width="520" height="320" fill="#fff4e6" stroke={INK} strokeWidth="5" />
      <path d="M1436 426 L1720 320 L2004 426 Z" fill="#c92a2a" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      {/* The awning, striped */}
      <path d="M1480 520 H1960 L1980 570 H1460 Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {Array.from({ length: 8 }, (_, i) => 1480 + i * 60).map((x) => (
        <path key={x} d={`M${x} 520 h30 l3 50 h-30 Z`} fill="#fa5252" />
      ))}
      <path
        d="M1460 570 q15 16 30 0 q15 16 30 0 q15 16 30 0 q15 16 30 0 q15 16 30 0 q15 16 30 0 q15 16 30 0 q15 16 30 0 q15 16 30 0 q15 16 30 0 q15 16 30 0 q15 16 30 0 q15 16 30 0 q15 16 30 0 q15 16 30 0 q15 16 30 0 q15 16 30 0"
        fill="#fa5252"
        stroke={INK}
        strokeWidth="3"
      />
      {/* The shop window with a fish bowl and a bird in its cage */}
      <rect x="1490" y="590" width="230" height="110" rx="8" fill="#d0ebff" stroke={INK} strokeWidth="5" />
      <path d="M1496 680 H1714" stroke={WOOD} strokeWidth="6" />
      <circle cx="1546" cy="648" r="28" fill="#a5d8ff" stroke={INK} strokeWidth="3" />
      <path d="M1524 640 H1568" stroke="#74c0fc" strokeWidth="4" />
      <path d="M1536 654 q10 -10 20 0 q-10 10 -20 0 Z M1536 654 l-8 -6 v12 Z" fill="#fd7e14" stroke={INK} strokeWidth="2" />
      <path d="M1626 676 V626 Q1650 598 1674 626 V676 Z" fill="none" stroke="#868e96" strokeWidth="3" />
      {[1638, 1650, 1662].map((x) => (
        <path key={x} d={`M${x} 676 V${x === 1650 ? 608 : 614}`} stroke="#868e96" strokeWidth="2" />
      ))}
      <path d="M1630 652 H1670" stroke={WOOD} strokeWidth="3" />
      <ellipse cx="1650" cy="640" rx="11" ry="10" fill="#ffd43b" stroke={INK} strokeWidth="2.5" />
      <path d="M1660 640 l7 2 l-7 3 Z" fill="#fd7e14" />
      <rect x="1840" y="610" width="90" height="130" rx="8" fill="#a0673a" stroke={INK} strokeWidth="5" />
      <circle cx="1856" cy="676" r="6" fill="#ffd43b" stroke={INK} strokeWidth="2" />
      {/* The sign over the window: a paw */}
      <path d="M1720 424 V446" stroke={INK} strokeWidth="6" />
      <circle cx="1720" cy="478" r="34" fill="#fff" stroke={INK} strokeWidth="5" />
      <g fill="#8d5a3b">
        <ellipse cx="1720" cy="488" rx="14" ry="11" />
        {[
          [1702, 470],
          [1714, 462],
          [1726, 462],
          [1738, 470],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="5.5" />
        ))}
      </g>
      {/* A little table outside with a basket of bones; one bone lies on top */}
      <rect x="1640" y="682" width="140" height="14" rx="4" fill="#fff" stroke={INK} strokeWidth="4" />
      {[1656, 1764].map((x) => (
        <rect key={x} x={x - 5} y="696" width="10" height="44" fill="#868e96" stroke={INK} strokeWidth="3" />
      ))}
      {[-24, 18].map((turn) => (
        <g key={turn} transform={`translate(${1752 + turn / 3} 668) rotate(${turn}) scale(0.4)`}>
          <Bone />
        </g>
      ))}
      <path d="M1736 682 L1730 656 H1776 L1770 682 Z" fill={WOOD} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {bone && (
        <g transform="translate(1690 682) scale(0.8)">
          <Bone />
        </g>
      )}
    </g>
  );
}

/** A street tree in its little fenced bed. */
function StreetTree() {
  return (
    <g>
      <path d="M2086 740 L2092 520 H2112 L2118 740 Z" fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
      {[
        [2102, 440, 90],
        [2040, 500, 64],
        [2164, 500, 64],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill="#40c057" stroke="#2b8a3e" strokeWidth="4" />
      ))}
      <path d="M2050 740 V700 H2154 V740 M2050 716 H2154" stroke="#495057" strokeWidth="5" fill="none" />
    </g>
  );
}

/** Where the dog sits on the pavement, its feet; from here it comes along as a friend. */
export const DOG_AT: Point = [2470, GROUND_Y];

/** The dog sits on the pavement and looks hungry; with the bone it chews and wags, then it comes along (drawn by
 * `TrailPlay` as a friend from then on). */
function Dog({ done, here, nope, friends }: SceneryProps) {
  const solved = done.includes("dog");
  if (friends.includes("dog")) return null;
  return (
    <g transform={`translate(${DOG_AT[0]} ${DOG_AT[1]})`}>
      <g className={`tl-ball-dog${solved ? " done" : ""}`}>
        <Nope id="dog" nope={nope}>
          <g className={here === "dog" && !solved ? "tl-meet" : undefined}>
            <path className="tl-ball-dog-tail" d="M40 -16 Q76 -20 70 -60" stroke={INK} strokeWidth="14" strokeLinecap="round" fill="none" />
            <path className="tl-ball-dog-tail" d="M40 -16 Q76 -20 70 -60" stroke="#f8f9fa" strokeWidth="7" strokeLinecap="round" fill="none" />
            <ellipse cx="22" cy="-18" rx="34" ry="18" fill="#f8f9fa" stroke={INK} strokeWidth="4" />
            <ellipse cx="6" cy="-62" rx="36" ry="50" fill="#f8f9fa" stroke={INK} strokeWidth="4" />
            {[
              [-12, -80, 7],
              [20, -50, 9],
              [-4, -36, 6],
              [30, -14, 7],
              [14, -94, 5],
            ].map(([x, y, r]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={INK} />
            ))}
            {[-24, -6].map((x) => (
              <rect key={x} x={x - 8} y="-60" width="16" height="60" rx="7" fill="#f8f9fa" stroke={INK} strokeWidth="3.5" />
            ))}
            <path d="M-26 -100 Q6 -110 34 -100" stroke="#e03131" strokeWidth="9" strokeLinecap="round" fill="none" />
            <g className="tl-ball-dog-head" style={{ transformOrigin: "0px -110px" }}>
              <circle cx="-8" cy="-130" r="32" fill="#f8f9fa" stroke={INK} strokeWidth="4" />
              <ellipse cx="-40" cy="-118" rx="24" ry="17" fill="#f8f9fa" stroke={INK} strokeWidth="3.5" />
              <circle cx="-60" cy="-124" r="7" fill={INK} />
              <circle cx="-16" cy="-140" r="5" fill={INK} />
              <path d="M10 -156 Q34 -150 28 -110 Q10 -116 6 -150 Z" fill={INK} />
              {solved ? (
                <g transform="translate(-50 -86) scale(0.5)">
                  <g className="tl-chew">
                    <Bone />
                  </g>
                </g>
              ) : (
                <path d="M-50 -104 Q-42 -96 -34 -102" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
              )}
            </g>
          </g>
        </Nope>
      </g>
    </g>
  );
}

function ParkGate() {
  return (
    <g>
      {[PARK_X, PARK_X + 70].map((x) => (
        <rect key={x} x={x - 14} y="590" width="28" height="150" rx="4" fill="#ced4da" stroke={INK} strokeWidth="4" />
      ))}
      <path d={`M${PARK_X + 70} 640 H4300 M${PARK_X + 70} 690 H4300`} stroke="#5c940d" strokeWidth="8" />
      {Array.from({ length: 24 }, (_, i) => PARK_X + 140 + i * 70).map((x) => (
        <rect key={x} x={x - 5} y="626" width="10" height="114" fill="#5c940d" />
      ))}
    </g>
  );
}

/** Sunflowers in their bed, hanging their heads over the path; with water they stand up. */
function Sunflowers({ done, here, nope }: SceneryProps) {
  const watered = done.includes("flowers");
  return (
    <g>
      <ellipse cx="3130" cy={GROUND_Y + 2} rx="110" ry="18" fill={WOOD_DARK} />
      <Nope id="flowers" nope={nope}>
        <g className={here === "flowers" && !watered ? "tl-meet" : undefined}>
          {[
            [3080, 230, 0],
            [3130, 270, 160],
            [3180, 220, 320],
          ].map(([x, len, delay]) => (
            <g key={x} transform={`translate(${x} ${GROUND_Y})`}>
              <g className={`tl-ball-flower${watered ? " up" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
                <path d={`M0 0 V${-len}`} stroke="#2f9e44" strokeWidth="9" strokeLinecap="round" />
                <path
                  d={`M0 ${-len * 0.4} q-40 -30 -60 -6 q30 18 60 6 Z M0 ${-len * 0.6} q40 -30 60 -6 q-30 18 -60 6 Z`}
                  fill="#51cf66"
                  stroke="#2b8a3e"
                  strokeWidth="3"
                />
                <g transform={`translate(0 ${-len})`}>
                  {Array.from({ length: 10 }, (_, i) => (i * Math.PI) / 5).map((a) => (
                    <ellipse
                      key={a}
                      cx={Math.cos(a) * 30}
                      cy={Math.sin(a) * 30}
                      rx="16"
                      ry="9"
                      transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 30} ${Math.sin(a) * 30})`}
                      fill="#fcc419"
                      stroke={INK}
                      strokeWidth="2.5"
                    />
                  ))}
                  <circle r="22" fill={WOOD_DARK} stroke={INK} strokeWidth="3" />
                  <circle cx="-6" cy="-6" r="4" fill="#5c3b1e" />
                  <circle cx="6" cy="4" r="4" fill="#5c3b1e" />
                </g>
              </g>
            </g>
          ))}
        </g>
      </Nope>
      {/* The watering can pours over them, then goes away */}
      {watered && (
        <g transform="translate(2880 580)">
          <g className="tl-ball-pour">
            <g transform="rotate(34)">
              <WateringCan />
            </g>
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                className="tl-ball-drops"
                style={{ animationDelay: `${i * 160}ms` }}
                d={`M${64 + i * 12} -10 v18`}
                stroke="#4dabf7"
                strokeWidth="6"
                strokeLinecap="round"
              />
            ))}
          </g>
        </g>
      )}
    </g>
  );
}

/** The slide with its ladder; the ground line runs over the rungs and down the chute. */
function Slide() {
  const chute = SLIDE.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y + 10}`).join(" ");
  return (
    <g>
      {/* The legs, from under the platform and the chute down to the grass */}
      {[
        [3560, 440],
        [3760, 620],
        [3900, 720],
      ].map(([x, top]) => (
        <rect key={x} x={x - 8} y={top} width="16" height={GROUND_Y - top} fill="#adb5bd" stroke={INK} strokeWidth="3" />
      ))}
      {[-26, 26].map((d) => (
        <path key={d} d={`M${3400 + d} ${GROUND_Y} L${3520 + d} 380`} stroke="#1c7ed6" strokeWidth="12" strokeLinecap="round" />
      ))}
      {LADDER.map(([x, y]) => (
        <path key={x} d={`M${x - 30} ${y} H${x + 30}`} stroke="#fcc419" strokeWidth="10" strokeLinecap="round" />
      ))}
      <rect x="3490" y="440" width="80" height="16" rx="4" fill="#fcc419" stroke={INK} strokeWidth="4" />
      <path d="M3500 440 V380 H3560 V440" stroke="#1c7ed6" strokeWidth="8" fill="none" strokeLinejoin="round" />
      <path d={chute} stroke={INK} strokeWidth="30" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d={chute} stroke="#fa5252" strokeWidth="22" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d={chute} transform="translate(0 -8)" stroke="#ffa8a8" strokeWidth="5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
}

/** The sandbox behind the ball: back board, sand and a few toys; the dog digs in it. */
function Sandbox() {
  return (
    <g>
      <rect x="4300" y="712" width="420" height="20" fill={WOOD} stroke={INK} strokeWidth="4" />
      <rect x="4304" y="730" width="412" height="44" fill={SAND} />
      {/* A sand cake and a bucket */}
      <path d="M4600 744 L4608 716 H4652 L4660 744 Z" fill="#f4c27a" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M4640 680 L4648 716 H4684 L4692 680 Z" fill="#cc5de8" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M4640 680 Q4666 650 4692 680" stroke={INK} strokeWidth="3" fill="none" />
    </g>
  );
}

/** Drawn in front of the ball: the sand heap that hides half of it, and the sandbox's front board. */
export function BallFront({ done }: SceneryProps) {
  const dug = done.includes("sandbox");
  return (
    <g>
      <g className={dug ? "tl-ball-heap" : undefined}>
        <path d="M4370 772 Q4400 746 4440 748 Q4480 746 4510 772 Z" fill={SAND} stroke="#e8a35c" strokeWidth="4" />
        <circle cx="4420" cy="752" r="3" fill="#e8a35c" />
        <circle cx="4462" cy="758" r="3" fill="#e8a35c" />
      </g>
      <rect x="4290" y="760" width="440" height="22" fill={WOOD} stroke={INK} strokeWidth="4" />
    </g>
  );
}

function ParkTree({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x - 14} ${GROUND_Y} L${x - 8} 520 H${x + 8} L${x + 14} ${GROUND_Y} Z`} fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
      <circle cx={x} cy="460" r="100" fill="#40c057" stroke="#2b8a3e" strokeWidth="4" />
      <circle cx={x - 70} cy="520" r="60" fill="#40c057" stroke="#2b8a3e" strokeWidth="4" />
    </g>
  );
}

function Bench({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y="672" width="160" height="14" rx="4" fill={WOOD} stroke={INK} strokeWidth="4" />
      <rect x={x} y="640" width="160" height="14" rx="4" fill={WOOD} stroke={INK} strokeWidth="4" />
      {[x + 14, x + 146].map((lx) => (
        <rect key={lx} x={lx - 5} y="640" width="10" height="100" fill="#495057" />
      ))}
    </g>
  );
}

/** The world of "Der Ball rollt weg", drawn as far as the child has come. */
export function BallScenery(props: SceneryProps) {
  const { done } = props;
  return (
    <g>
      <Ground />
      <Front x={0} w={440} h={300} wall="#ffe8cc" roof="#e8590c" door={260} />
      <FrontGarden can={!done.includes("can")} />
      <Front x={820} w={190} h={260} wall="#d0ebff" roof="#495057" door={880} />
      <Crossing />
      <TrafficLight {...props} />
      <PetShop bone={!done.includes("bone")} />
      <StreetTree />
      <Front x={2210} w={380} h={300} wall="#e5dbff" roof="#5f3dc4" door={2490} />
      <Dog {...props} />
      <ParkGate />
      <Sunflowers {...props} />
      <Slide />
      <ParkTree x={4180} />
      <Sandbox />
      <ParkTree x={4900} />
      <Bench x={5000} />
      <ParkTree x={5400} />
    </g>
  );
}

/** The town far away: rows of roofs, a church tower, clouds and the sun; drawn at a third of the world's speed. */
export function BallBackdrop() {
  const roofs = [];
  for (let x = -1200; x < 3200; x += 150) roofs.push(x);
  return (
    <g>
      <circle cx="1500" cy="130" r="70" fill="#ffe066" />
      <Cloud x={300} y={130} scale={1.2} />
      <Cloud x={1100} y={220} />
      <Cloud x={2000} y={110} scale={1.3} />
      <g fill="#bac8ff">
        <rect x="560" y="300" width="70" height="400" />
        <path d="M548 304 L595 200 L642 304 Z" />
      </g>
      {roofs.map((x, i) => (
        <g key={x} fill={["#dbe4ff", "#e5dbff", "#d0ebff"][i % 3]}>
          <rect x={x} y={500 - (i % 3) * 40} width="130" height="400" />
          <path d={`M${x - 10} ${504 - (i % 3) * 40} L${x + 65} ${440 - (i % 3) * 40} L${x + 140} ${504 - (i % 3) * 40} Z`} />
        </g>
      ))}
      <path d="M-1200 640 Q-500 600 200 640 Q900 600 1600 640 Q2300 600 3200 640 V1600 H-1200 Z" fill="#b2f2bb" />
    </g>
  );
}
