import type { ReactNode } from "react";
import { Cloud, INK } from "@/games/scenes/shared";
import { Cabbage, SandBucket, Seeds, Snowman, SnowShovel } from "./items";
import type { Point, SceneryProps } from "./types";

// "Der Schneemann" (G-06): a hare snatches the carrot nose and hops off, and the child follows its tracks through the
// snow – past the house (snow shovel), the shed (bird seed), a deep snow drift, the grit box (a bucket of sand), the
// hungry birds at the bird table, a cabbage in the snowy bed and the frozen pond – up the snow steps of the hill and
// down the other side on the sled, to the snowman. The hare sits in front of it with the carrot and trades it for the
// cabbage. World points: the snow is at y = 740, the hilltop at y = 420; the steps climb from x 3160 to 3540, the sled
// run goes down from x 3660 to 4460.

export const GROUND_Y = 740;
export const TOP_Y = 420;

/** The tread middles of the six snow steps up the hill. */
export const STAIRS: Point[] = Array.from({ length: 6 }, (_, i) => [3160 + i * 76, 690 - i * 54]);

/** The sled run down the other side of the hill, ground points from the top to the bottom. */
export const SLED_RUN: Point[] = [
  [3660, TOP_Y],
  [3760, 440],
  [3860, 480],
  [3960, 540],
  [4060, 610],
  [4160, 670],
  [4260, 712],
  [4360, 734],
  [4460, GROUND_Y],
];

/** Where the hare leaves the carrot: lying in the snow behind it, in front of the snowman. */
export const CARROT_AT: Point = [4980, GROUND_Y + 4];

/** Where the snowman stands; its nose goes to `NOSE_AT` (the carrot's thick end in the middle of its face). */
const SNOWMAN_X = 5120;
export const NOSE_AT: Point = [SNOWMAN_X + 52, GROUND_Y - 248];

/** Where the hare sits, its feet in the snow; its mouth is 40 left of and 54 above them. */
const HARE_AT: Point = [4875, GROUND_Y];

const SNOW = "#fff";
const SNOW_EDGE = "#a5d8ff";
const SNOW_SHADE = "#e7f5ff";
const WOOD = "#c08552";
const WOOD_DARK = "#8d5a3b";
const HARE = "#a47148";
const HARE_LIGHT = "#e6ccb2";

/** A wobble when a wrong thing is tried; keyed so every try starts it anew. */
function Nope({ id, nope, children }: { id: string; nope: SceneryProps["nope"]; children: ReactNode }) {
  const on = nope?.id === id;
  return (
    <g key={on ? nope.n : 0} className={on ? "tl-nope" : undefined}>
      {children}
    </g>
  );
}

/** A hare looking left, its feet on (0, 0) and its mouth at (-40, -54). */
export function Hare() {
  return (
    <g>
      <circle cx="40" cy="-34" r="11" fill="#fff" stroke={INK} strokeWidth="3" />
      <ellipse cx="12" cy="-32" rx="36" ry="30" fill={HARE} stroke={INK} strokeWidth="4" />
      <ellipse cx="-4" cy="-26" rx="14" ry="18" fill={HARE_LIGHT} />
      <ellipse cx="14" cy="-5" rx="26" ry="7" fill={HARE} stroke={INK} strokeWidth="3" />
      <ellipse cx="-22" cy="-5" rx="10" ry="6" fill={HARE} stroke={INK} strokeWidth="3" />
      <g className="tl-snow-hare-head">
        <g fill={HARE} stroke={INK} strokeWidth="3.5">
          <ellipse cx="-14" cy="-110" rx="9" ry="30" transform="rotate(-10 -14 -110)" />
          <ellipse cx="4" cy="-106" rx="9" ry="30" transform="rotate(16 4 -106)" />
        </g>
        <ellipse cx="-14" cy="-110" rx="4" ry="20" fill="#ffc9c9" transform="rotate(-10 -14 -110)" />
        <ellipse cx="4" cy="-106" rx="4" ry="20" fill="#ffc9c9" transform="rotate(16 4 -106)" />
        <path d="M-14 -134 l-4 -8 l8 2 Z" fill={INK} />
        <circle cx="-18" cy="-66" r="24" fill={HARE} stroke={INK} strokeWidth="4" />
        <ellipse cx="-30" cy="-56" rx="12" ry="9" fill={HARE_LIGHT} />
        <circle cx="-26" cy="-72" r="4" fill={INK} />
        <circle cx="-41" cy="-60" r="4.5" fill="#ff8fa3" />
        <path d="M-40 -58 L-62 -56 M-40 -60 L-60 -68" stroke={INK} strokeWidth="1.5" />
      </g>
    </g>
  );
}

/** The hare running off with the carrot: it jumps up out of the snow at the carrot's tip, pulls, turns round and runs,
 * the thick end in its mouth (the turn is `tl-thief`, a flip round the carrot's middle). */
export function HareThief() {
  return (
    <g transform="translate(96 38)">
      <Hare />
    </g>
  );
}

/** A fir tree with snow on its branches. */
function Fir({ x, y = GROUND_Y, s = 1 }: { x: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-10" y="-40" width="20" height="40" fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path
            d={`M${-80 + i * 18} ${-36 - i * 70} L0 ${-150 - i * 70} L${80 - i * 18} ${-36 - i * 70} Z`}
            fill="#2f9e44"
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d={`M${-56 + i * 14} ${-76 - i * 70} Q0 ${-96 - i * 70} ${56 - i * 14} ${-76 - i * 70} L0 ${-150 - i * 70} Z`}
            fill={SNOW}
            stroke={SNOW_EDGE}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>
      ))}
    </g>
  );
}

/** The hare's tracks in the snow: two long hind feet in front, two small front feet behind, hop after hop. */
function Tracks({ from, to }: { from: number; to: number }) {
  const hops: number[] = [];
  for (let x = from; x <= to; x += 150) hops.push(x);
  return (
    <g fill="#a5b4cb">
      {hops.map((x) => (
        <g key={x}>
          <ellipse cx={x + 30} cy={GROUND_Y + 12} rx="11" ry="4" />
          <ellipse cx={x + 30} cy={GROUND_Y + 22} rx="11" ry="4" />
          <ellipse cx={x} cy={GROUND_Y + 15} rx="5" ry="3.5" />
          <ellipse cx={x - 14} cy={GROUND_Y + 19} rx="5" ry="3.5" />
        </g>
      ))}
    </g>
  );
}

/** A window glowing warm. */
function Win({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="60" height="60" rx="5" fill="#ffe066" stroke={INK} strokeWidth="4" />
      <path d={`M${x + 30} ${y} V${y + 60} M${x} ${y + 30} H${x + 60}`} stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** Home: a wooden house with snow on its roof; the snow shovel leans on a snow heap beside the path. */
function House({ shovel }: { shovel: boolean }) {
  return (
    <g>
      <rect x="-520" y="480" width="600" height="260" fill="#d9480f" stroke={INK} strokeWidth="5" />
      {[520, 560, 600, 640, 680].map((y) => (
        <path key={y} d={`M-516 ${y} H76`} stroke="#b8400c" strokeWidth="3" />
      ))}
      <path d="M-560 490 L-220 300 L120 490 Z" fill="#5c3b1e" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path
        d="M-570 492 L-220 296 L130 492 Q90 470 50 488 Q-10 462 -80 486 Q-160 460 -240 484 Q-330 462 -400 486 Q-470 462 -570 492 Z"
        fill={SNOW}
        stroke={SNOW_EDGE}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect x="-110" y="326" width="44" height="90" fill="#adb5bd" stroke={INK} strokeWidth="4" />
      <path d="M-116 326 Q-88 304 -60 326 Z" fill={SNOW} stroke={SNOW_EDGE} strokeWidth="3" />
      <Win x={-460} y={550} />
      <Win x={-330} y={550} />
      <rect x="-190" y="600" width="90" height="140" rx="8" fill="#1971c2" stroke={INK} strokeWidth="5" />
      <circle cx="-116" cy="672" r="6" fill="#ffd43b" stroke={INK} strokeWidth="2" />
      {/* The heap the shovel leans on */}
      <path d="M560 744 Q590 660 660 664 Q720 668 740 744 Z" fill={SNOW} stroke={SNOW_EDGE} strokeWidth="4" />
      {shovel && (
        <g transform="translate(640 746) rotate(-8) scale(0.8)">
          <SnowShovel />
        </g>
      )}
    </g>
  );
}

/** The garden shed; the sack of bird seed stands on a crate in front of it. */
function Shed({ seeds }: { seeds: boolean }) {
  return (
    <g>
      <rect x="1000" y="560" width="170" height="180" fill="#5c940d" stroke={INK} strokeWidth="5" />
      <rect x="1050" y="620" width="70" height="120" rx="4" fill="#74b816" stroke={INK} strokeWidth="4" />
      <path d="M984 570 L1085 500 L1186 570 Z" fill={WOOD_DARK} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path
        d="M978 572 L1085 496 L1192 572 Q1150 556 1110 568 Q1060 552 1020 566 Q1000 558 978 572 Z"
        fill={SNOW}
        stroke={SNOW_EDGE}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect x="900" y="690" width="100" height="50" fill={WOOD} stroke={INK} strokeWidth="4" />
      <path d="M900 715 H1000 M950 690 V740" stroke={WOOD_DARK} strokeWidth="3" />
      {seeds && (
        <g transform="translate(950 692) scale(0.8)">
          <Seeds />
        </g>
      )}
    </g>
  );
}

/** A deep snow drift across the path; the shovel digs it away. */
function Drift({ done, here, nope }: SceneryProps) {
  const dug = done.includes("drift");
  return (
    <g>
      {/* The snow thrown to the sides, once it is dug */}
      {dug && (
        <g className="tl-snow-heaps" fill={SNOW} stroke={SNOW_EDGE} strokeWidth="4">
          <path d="M1180 744 Q1200 700 1236 704 Q1262 708 1270 744 Z" />
          <path d="M1400 744 Q1414 692 1452 696 Q1484 702 1490 744 Z" />
        </g>
      )}
      <Nope id="drift" nope={nope}>
        <g className={here === "drift" && !dug ? "tl-meet" : undefined}>
          <path
            className={`tl-snow-drift${dug ? " done" : ""}`}
            d="M1220 746 Q1222 600 1290 586 Q1330 556 1370 584 Q1440 594 1450 746 Z"
            fill={SNOW}
            stroke={SNOW_EDGE}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </g>
      </Nope>
      {dug && (
        <g transform="translate(1300 744)">
          <g className="tl-snow-dig">
            <g transform="rotate(-30) scale(0.8)">
              <SnowShovel />
            </g>
          </g>
        </g>
      )}
    </g>
  );
}

/** The yellow grit box by the path, snow on its lid; the bucket of sand stands on top. */
function GritBox({ sand }: { sand: boolean }) {
  return (
    <g>
      <path d="M1606 740 V672 H1754 V740" fill="#fcc419" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <rect x="1598" y="656" width="164" height="20" rx="4" fill="#fab005" stroke={INK} strokeWidth="4" />
      <path d="M1600 658 Q1620 642 1640 652 M1700 652 Q1730 640 1760 656" stroke={SNOW} strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M1660 700 H1700" stroke="#e8a500" strokeWidth="5" strokeLinecap="round" />
      {sand && (
        <g transform="translate(1660 658) scale(0.8)">
          <SandBucket />
        </g>
      )}
    </g>
  );
}

/** A small bird looking left, standing on (0, 0): brown with a red breast, or blue with a yellow one. */
function Bird({ blue = false }: { blue?: boolean }) {
  const [back, breast] = blue ? ["#4dabf7", "#ffe066"] : ["#a47148", "#ff6b6b"];
  return (
    <g>
      <path d="M-4 0 V-10 M6 0 V-10" stroke="#e8590c" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M20 -24 L44 -34 L40 -16 Z" fill={back} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="4" cy="-24" rx="22" ry="16" fill={back} stroke={INK} strokeWidth="3.5" />
      <ellipse cx="-6" cy="-20" rx="11" ry="10" fill={breast} />
      <g className="tl-snow-bird-head">
        <circle cx="-14" cy="-42" r="13" fill={blue ? "#fff" : back} stroke={INK} strokeWidth="3.5" />
        {blue && <path d="M-26 -46 Q-14 -60 -2 -46 Z" fill="#1c7ed6" />}
        <circle cx="-18" cy="-44" r="3" fill={INK} />
        <path d="M-26 -42 L-38 -38 L-26 -35 Z" fill="#fcc419" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** The bird table, empty, and two hungry birds in the snow in front of it; with the seed they fly up and peck. */
function BirdTable({ done, here, nope }: SceneryProps) {
  const fed = done.includes("birds");
  return (
    <g>
      <rect x="2254" y="600" width="12" height="140" fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
      <rect x="2184" y="596" width="152" height="14" rx="3" fill={WOOD} stroke={INK} strokeWidth="4" />
      <path d="M2190 596 V556 M2330 596 V556" stroke={WOOD_DARK} strokeWidth="6" />
      <path d="M2164 562 L2260 500 L2356 562 Z" fill="#e03131" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path
        d="M2158 564 L2260 496 L2362 564 Q2320 550 2280 560 Q2240 546 2200 560 Q2180 554 2158 564 Z"
        fill={SNOW}
        stroke={SNOW_EDGE}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {fed && (
        <g transform="translate(2236 598)">
          <g className="tl-bites late">
            <path d="M-34 0 Q0 -30 34 0 Z" fill="#ffd43b" stroke="#e8a500" strokeWidth="3" />
            {[-16, -4, 8, 18, -8, 4].map((x, i) => (
              <ellipse key={i} cx={x} cy={i < 4 ? -8 : -16} rx="4" ry="2.5" fill="#e8a500" />
            ))}
          </g>
        </g>
      )}
      <Nope id="birds" nope={nope}>
        <g className={here === "birds" && !fed ? "tl-meet" : undefined}>
          <g transform="translate(1950 740) scale(1.6)">
            <g className={`tl-snow-bird b0${fed ? " done" : ""}`}>
              <Bird />
            </g>
          </g>
          <g transform="translate(2030 740) scale(1.6)">
            <g className={`tl-snow-bird b1${fed ? " done" : ""}`}>
              <Bird blue />
            </g>
          </g>
        </g>
      </Nope>
    </g>
  );
}

/** A raised bed under the snow; one cabbage stands in it. */
function Bed({ cabbage }: { cabbage: boolean }) {
  return (
    <g>
      <rect x="2510" y="712" width="170" height="30" rx="4" fill={WOOD} stroke={INK} strokeWidth="4" />
      <path d="M2510 714 Q2550 698 2590 712 Q2640 698 2680 714" stroke={SNOW} strokeWidth="10" strokeLinecap="round" fill="none" />
      {cabbage && (
        <g transform="translate(2560 722)">
          <Cabbage />
        </g>
      )}
    </g>
  );
}

/** The frozen pond across the path, with reeds in the snow; the sand is strewn over the ice. */
function Pond({ done, here, nope }: SceneryProps) {
  const strewn = done.includes("pond");
  return (
    <g>
      {[2780, 2806, 3096].map((x) => (
        <path key={x} d={`M${x} 744 Q${x - 6} 690 ${x + 4} 660`} stroke="#8d5a3b" strokeWidth="5" fill="none" strokeLinecap="round" />
      ))}
      <Nope id="pond" nope={nope}>
        <g className={here === "pond" && !strewn ? "tl-meet" : undefined}>
          <ellipse cx="2940" cy="748" rx="156" ry="20" fill="#a5d8ff" stroke="#1c7ed6" strokeWidth="4" />
          <ellipse cx="2940" cy="746" rx="120" ry="11" fill="#d0ebff" />
          <path d="M2850 744 H2890 M2960 750 H3020" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        </g>
      </Nope>
      {strewn && (
        <>
          <g transform="translate(2860 700)">
            <g className="tl-snow-pour">
              <g transform="rotate(70)">
                <SandBucket />
              </g>
            </g>
          </g>
          {Array.from({ length: 18 }, (_, i) => (
            <circle
              key={i}
              className="tl-snow-sand"
              cx={2800 + i * 16}
              cy={744 + ((i * 7) % 3) * 3 - 3}
              r="4.5"
              fill="#c8913f"
              style={{ animationDelay: `${200 + i * 50}ms` }}
            />
          ))}
        </>
      )}
    </g>
  );
}

/** A wooden sled, its front curled up to the right, standing on (0, 0); a child sitting on it sits on its seat. */
export function Sled() {
  return (
    <g>
      <path d="M-30 -40 V-6 M30 -40 V-6" stroke={INK} strokeWidth="6" />
      <path d="M-58 -4 H52 Q78 -4 72 -30" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M-58 -4 H52 Q78 -4 72 -30" stroke="#adb5bd" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="-48" y="-50" width="100" height="14" rx="5" fill="#e03131" stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** The hill with its snow steps; the sled waits on top until the child rides it down, and stays at the bottom. */
function Hill({ done, here }: SceneryProps) {
  const ridden = done.includes("hill");
  const run = SLED_RUN.map(([x, y]) => `L${x} ${y}`).join(" ");
  return (
    <g>
      <path d={`M3110 744 Q3140 470 3540 ${TOP_Y} ${run} L4460 744 Z`} fill={SNOW} stroke={SNOW_EDGE} strokeWidth="5" strokeLinejoin="round" />
      <path d={`M3680 ${TOP_Y + 30} Q3960 520 4160 690`} stroke={SNOW_SHADE} strokeWidth="26" fill="none" strokeLinecap="round" />
      {STAIRS.map(([x, y], i) => (
        <rect key={i} x={x - 40} y={y} width="80" height={GROUND_Y - y} fill={SNOW_SHADE} stroke="#74c0fc" strokeWidth="4" />
      ))}
      <Fir x={3620} y={TOP_Y} s={0.8} />
      {!ridden && here !== "hill" && (
        <g transform={`translate(3550 ${TOP_Y})`}>
          <Sled />
        </g>
      )}
      {ridden && (
        <g transform={`translate(4460 ${GROUND_Y})`}>
          <Sled />
        </g>
      )}
    </g>
  );
}

/** The hare in front of the snowman, the carrot behind it; with the cabbage it nibbles and lets the carrot go. */
function HareStop({ done, here, nope }: SceneryProps) {
  const solved = done.includes("hare");
  return (
    <g transform={`translate(${HARE_AT[0]} ${HARE_AT[1]})`}>
      <g className={`tl-snow-hare${solved ? " done" : ""}`}>
        <Nope id="hare" nope={nope}>
          <g className={here === "hare" && !solved ? "tl-meet" : undefined}>
            <Hare />
            {solved && (
              <g transform="translate(-44 -50) scale(0.5)">
                <g className="tl-chew">
                  <Cabbage />
                </g>
              </g>
            )}
          </g>
        </Nope>
      </g>
    </g>
  );
}

/** The world of "Der Schneemann", drawn as far as the child has come. */
export function SchneemannScenery(props: SceneryProps) {
  const { done } = props;
  const nosed = done.includes("nose");
  return (
    <g>
      <rect x="-1200" y={GROUND_Y} width="7200" height="2000" fill={SNOW_SHADE} />
      <rect x="-1200" y={GROUND_Y - 4} width="7200" height="30" fill={SNOW} />
      <path d={`M-1200 ${GROUND_Y - 4} H6000`} stroke={SNOW_EDGE} strokeWidth="4" />
      <Fir x={-700} />
      <Fir x={1470} s={0.7} />
      <Fir x={1792} s={0.6} />
      <Fir x={5360} />
      <Fir x={5560} s={0.8} />
      <Tracks from={420} to={2740} />
      <Tracks from={4500} to={4820} />
      <House shovel={!done.includes("snowshovel")} />
      <Shed seeds={!done.includes("seeds")} />
      <Drift {...props} />
      <GritBox sand={!done.includes("sand")} />
      <BirdTable {...props} />
      <Bed cabbage={!done.includes("cabbage")} />
      <Pond {...props} />
      <Hill {...props} />
      <g transform={`translate(${SNOWMAN_X} ${GROUND_Y})`}>
        <g className={`tl-snow-snowman${nosed ? " dance" : ""}`}>
          <Snowman nose={nosed} />
        </g>
      </g>
      <HareStop {...props} />
    </g>
  );
}

/** Snowy mountains far away, a pale winter sky with clouds and a low sun; drawn at a third of the world's speed. */
export function SchneemannBackdrop() {
  const peaks: [number, number][] = [];
  for (let i = 0; i < 12; i++) peaks.push([-1200 + i * 420, 200 + ((i * 61) % 130)]);
  return (
    <g>
      <rect x="-2000" y="-600" width="8000" height="1600" fill="#e7f5ff" opacity="0.55" />
      <circle cx="1200" cy="150" r="60" fill="#ffe8a3" />
      <Cloud x={100} y={120} scale={1.2} />
      <Cloud x={900} y={200} />
      <Cloud x={1800} y={100} scale={1.4} />
      <Cloud x={2700} y={180} />
      {peaks.map(([x, top]) => (
        <g key={x}>
          <path d={`M${x - 300} 700 L${x} ${top} L${x + 300} 700 Z`} fill="#bac8ff" />
          <path
            d={`M${x - 110} ${top + 110} L${x} ${top} L${x + 110} ${top + 110} L${x + 50} ${top + 90} L${x} ${top + 120} L${x - 50} ${top + 90} Z`}
            fill="#fff"
          />
        </g>
      ))}
      <path d="M-1200 690 Q-500 630 200 680 Q900 620 1600 680 Q2300 630 3000 680 Q3700 630 4400 680 V1600 H-1200 Z" fill="#f1f3f5" />
    </g>
  );
}
