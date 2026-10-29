import type { ReactNode } from "react";
import { Cloud, INK } from "@/games/scenes/shared";
import { FlipFlops, Mattress, Roll, Shell } from "./items";
import type { Point, SceneryProps } from "./types";

// "Die Sandburg" (G-05): along the beach, the sea behind it. A wave takes the bucket and the shovel to the far end
// of the beach. On the way: a shell at the waterline, a bread roll from the kiosk, the gull on the path, flip-flops
// on the towel, the air mattress at the beach hut, then hot sand, stone steps up the rocks, the gap of sea water
// between two rocks, and down the dune to the bucket, where a hermit crab has moved in. At the end everybody builds a
// sandcastle. World points: the beach is at y = 740, the rocks' top at y = 450; the steps climb from x 2960 to 3310,
// the gap between the rocks is from x 3600 to 3780, the dune goes down from x 3960 to 4360.

export const GROUND_Y = 740;
export const TOP_Y = 450;

/** The tread middles of the six stone steps up the rocks. */
export const STEPS: Point[] = Array.from({ length: 6 }, (_, i) => [2960 + i * 70, 700 - i * 50]);

/** The beach: along the sand, up the steps, over the rocks (and the mattress over the gap), down the dune. */
export const SANDBURG_GROUND: Point[] = [[-3000, GROUND_Y], [2910, GROUND_Y], ...STEPS, [3960, TOP_Y], [4360, GROUND_Y], [9000, GROUND_Y]];

/** Where the wave leaves the bucket: on the sand at the end of the beach, with the crab in it. */
export const PAIL_AT: Point = [4800, GROUND_Y];

/** Where the mattress lies over the gap, its top level with the rocks. */
export const GAP_AT: Point = [3690, TOP_Y + 40];

const SAND = "#ffe8a3";
const SAND_DARK = "#f2c879";
const SAND_LINE = "#d9a441";
const ROCK = "#868e96";
const ROCK_DARK = "#495057";
const STONE = "#ced4da";
const WATER = "#4dabf7";
const WATER_DARK = "#1c7ed6";
const FOAM = "#e7f5ff";

/** A wobble when a wrong thing is tried; keyed so every try starts it anew. */
function Nope({ id, nope, children }: { id: string; nope: SceneryProps["nope"]; children: ReactNode }) {
  const on = nope?.id === id;
  return (
    <g key={on ? nope.n : 0} className={on ? "tl-nope" : undefined}>
      {children}
    </g>
  );
}

/** A tuft of beach grass. */
function Grass({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x - 14} ${y} Q${x - 18} ${y - 30} ${x - 26} ${y - 44} M${x} ${y} Q${x} ${y - 36} ${x + 4} ${y - 56} M${x + 14} ${y} Q${x + 20} ${y - 26} ${x + 30} ${y - 38}`}
      stroke="#8ce99a"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
  );
}

/** The beach between the path and the sea, with the foam where the water runs out. */
function Beach() {
  const foam: string[] = [];
  for (let x = -1200; x < 6400; x += 60) foam.push(`M${x} 652 q15 -10 30 0 q15 -10 30 0`);
  return (
    <g>
      <rect x="-1200" y="650" width="7600" height="2000" fill={SAND} />
      <rect x="-1200" y="650" width="7600" height="26" fill={SAND_DARK} opacity="0.6" />
      <path d={foam.join(" ")} stroke={FOAM} strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="-1200" y={GROUND_Y + 6} width="7600" height="22" fill={SAND_DARK} />
      {[-500, 260, 1210, 1960, 4480, 5300].map((x) => (
        <Grass key={x} x={x} y={704} />
      ))}
    </g>
  );
}

/** The wave that takes the bucket at the start: it rolls up the beach once and runs out again. */
function Wave() {
  return (
    <g className="tl-sand-wave">
      <path
        d="M300 676 Q340 560 450 560 Q540 562 568 626 Q530 600 504 616 Q540 648 640 676 Z"
        fill={WATER}
        stroke={WATER_DARK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M350 600 Q420 566 500 578 M330 640 Q420 610 520 640" stroke={FOAM} strokeWidth="7" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** The beach chair where the child sat: a wicker basket under a striped hood. */
function BeachChair() {
  const stripes = [60, 100, 140, 180];
  return (
    <g>
      <rect x="40" y="600" width="170" height="140" rx="10" fill="#e9c891" stroke={INK} strokeWidth="5" />
      {[624, 652, 680, 708].map((y) => (
        <path key={y} d={`M44 ${y} H206`} stroke="#c99a4b" strokeWidth="3" />
      ))}
      <path d="M30 616 Q30 480 125 472 Q220 480 220 616 Z" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <g clipPath="url(#tl-sand-hood)">
        <clipPath id="tl-sand-hood">
          <path d="M30 616 Q30 480 125 472 Q220 480 220 616 Z" />
        </clipPath>
        {stripes.map((x) => (
          <rect key={x} x={x} y="460" width="20" height="160" fill="#4dabf7" />
        ))}
      </g>
      <path d="M30 616 Q30 480 125 472 Q220 480 220 616" fill="none" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M58 612 Q58 520 125 512 Q192 520 192 612 Z" fill="#1864ab" stroke={INK} strokeWidth="4" />
      <rect x="58" y="600" width="134" height="20" rx="6" fill="#ff8787" stroke={INK} strokeWidth="3.5" />
    </g>
  );
}

/** A beach umbrella, red and white. */
function BeachUmbrella({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} 742 V520`} stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d={`M${x - 130} 540 Q${x} 420 ${x + 130} 540 Z`} fill="#fa5252" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d={`M${x - 44} 530 Q${x} 432 ${x + 44} 530 Z`} fill="#fff" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
    </g>
  );
}

function Kiosk({ roll }: { roll: boolean }) {
  return (
    <g>
      <rect x="900" y="560" width="240" height="180" fill="#a5d8ff" stroke={INK} strokeWidth="5" />
      <rect x="920" y="574" width="200" height="56" fill="#1864ab" stroke={INK} strokeWidth="4" />
      {/* A basket of rolls inside the window */}
      <path d="M1040 630 L1048 604 H1104 L1112 630 Z" fill="#c08552" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      {[1058, 1080, 1100].map((x) => (
        <g key={x} transform={`translate(${x} 608) scale(0.34)`}>
          <Roll />
        </g>
      ))}
      <rect x="892" y="626" width="256" height="16" rx="4" fill="#fff" stroke={INK} strokeWidth="4" />
      {/* An ice cream cone painted on the front */}
      <g transform="translate(1020 728)">
        <path d="M-16 -42 L0 0 L16 -42 Z" fill="#e8a35c" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <circle cx="-8" cy="-50" r="13" fill="#ffc9c9" stroke={INK} strokeWidth="3" />
        <circle cx="9" cy="-52" r="13" fill="#fff3bf" stroke={INK} strokeWidth="3" />
        <circle cx="0" cy="-66" r="12" fill="#b2f2bb" stroke={INK} strokeWidth="3" />
      </g>
      {/* The striped awning and the roof */}
      <rect x="884" y="500" width="272" height="26" rx="6" fill="#1971c2" stroke={INK} strokeWidth="4" />
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d={`M${886 + i * 34} 524 V552 Q${903 + i * 34} 568 ${920 + i * 34} 552 V524 Z`}
          fill={i % 2 ? "#fff" : "#fa5252"}
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      ))}
      {roll && (
        <g transform="translate(960 628)">
          <Roll />
        </g>
      )}
    </g>
  );
}

/** A gull, facing left, its feet on (0, 0). */
function Gull() {
  return (
    <g>
      <path d="M-6 0 V-30 M8 0 V-30" stroke="#f08c00" strokeWidth="5" strokeLinecap="round" />
      <path d="M-14 0 h14 M0 0 h14" stroke="#f08c00" strokeWidth="5" strokeLinecap="round" />
      <path d="M44 -62 L74 -74 L68 -46 Z" fill="#fff" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M-40 -66 Q-30 -94 -20 -60" fill="#fff" stroke={INK} strokeWidth="4" />
      <ellipse cx="6" cy="-56" rx="46" ry="28" fill="#fff" stroke={INK} strokeWidth="4" />
      <path d="M-14 -68 Q30 -84 66 -52 Q30 -44 -14 -60 Z" fill="#adb5bd" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M46 -64 Q58 -58 66 -52 Q56 -50 44 -52 Z" fill={INK} />
      <g className="tl-sand-gull-head">
        <circle cx="-32" cy="-86" r="21" fill="#fff" stroke={INK} strokeWidth="4" />
        <path d="M-50 -88 L-78 -80 L-50 -74 Z" fill="#fcc419" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="-70" cy="-79" r="3" fill="#e03131" />
        <circle cx="-38" cy="-92" r="4" fill={INK} />
      </g>
    </g>
  );
}

/** The gull on the path: it wants the roll, pecks it up where it lands and flies off. */
function PathGull({ done, here, nope }: SceneryProps) {
  const solved = done.includes("gull");
  return (
    <g>
      {solved && (
        <g transform="translate(1370 744) scale(0.8)">
          <g className="tl-bites">
            <Roll />
          </g>
        </g>
      )}
      <g transform="translate(1500 740) scale(1.2)">
        <g className={`tl-sand-gull${solved ? " done" : ""}`}>
          <Nope id="gull" nope={nope}>
            <g className={here === "gull" && !solved ? "tl-meet" : undefined}>
              <g className="tl-sand-peck" style={{ transformOrigin: "0px 0px" }}>
                <Gull />
              </g>
            </g>
          </Nope>
        </g>
      </g>
    </g>
  );
}

function Towel({ flipflops }: { flipflops: boolean }) {
  return (
    <g>
      <BeachUmbrella x={1840} />
      <path d="M1660 744 L1690 728 H1900 L1880 744 Z" fill="#69db7c" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M1720 728 L1700 744 M1780 728 L1760 744 M1840 728 L1820 744" stroke="#fff" strokeWidth="6" />
      {flipflops && (
        <g transform="translate(1720 742)">
          <FlipFlops />
        </g>
      )}
    </g>
  );
}

/** The striped beach hut, with the air mattress leaning against it. */
function BeachHut({ mattress }: { mattress: boolean }) {
  return (
    <g>
      <rect x="2060" y="560" width="200" height="180" fill="#fff" stroke={INK} strokeWidth="5" />
      {[2080, 2140, 2200].map((x) => (
        <rect key={x} x={x} y="562" width="30" height="176" fill="#8ce99a" />
      ))}
      <path d="M2040 566 L2160 494 L2280 566 Z" fill="#2b8a3e" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <rect x="2126" y="630" width="68" height="110" rx="6" fill="#c08552" stroke={INK} strokeWidth="4" />
      <rect x="2060" y="560" width="200" height="180" fill="none" stroke={INK} strokeWidth="5" />
      {mattress && (
        <g transform="translate(2010 740) rotate(-72)">
          <g transform="translate(112 0)">
            <Mattress />
          </g>
        </g>
      )}
    </g>
  );
}

/** Sand so hot it glows; the heat rises from it while the child stands at it. */
function HotSand({ here }: { here: string | null }) {
  const specks = [2410, 2470, 2530, 2600, 2660, 2730, 2790];
  return (
    <g>
      <path
        d="M2370 742 Q2390 732 2420 736 Q2600 726 2800 736 Q2830 732 2850 742 V780 H2370 Z"
        fill="#ff922b"
        stroke="#e8590c"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {specks.map((x, i) => (
        <circle key={x} cx={x} cy={752 + (i % 3) * 7} r="4" fill="#e03131" />
      ))}
      <g className={`tl-sand-heat${here === "hot" ? " on" : ""}`} stroke="#ff6b6b" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7">
        {[2440, 2560, 2680, 2790].map((x) => (
          <path key={x} d={`M${x} 716 q-10 -12 0 -24 q10 -12 0 -24 q-10 -12 0 -24`} />
        ))}
      </g>
    </g>
  );
}

/** The two rocks, with the stone steps up the first one and the sea water in the gap between them. */
function Rocks({ done }: { done: string[] }) {
  const bridged = done.includes("gap");
  return (
    <g>
      {/* The water in the gap, sea blue down to the sand */}
      <rect x="3570" y="600" width="240" height="300" fill={WATER} />
      <path className="tl-water" d="M3580 612 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t20 0" stroke={FOAM} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M3580 660 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0" stroke={WATER_DARK} strokeWidth="4" fill="none" opacity="0.5" />
      {/* The first rock */}
      <path
        d={`M2860 744 Q2880 640 2980 560 Q3140 440 3330 ${TOP_Y} H3600 Q3612 600 3590 800 H2860 Z`}
        fill={ROCK}
        stroke={ROCK_DARK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {STEPS.map(([x, y], i) => (
        <rect key={i} x={x - 36} y={y} width="74" height={GROUND_Y - y + 4} fill={STONE} stroke={ROCK_DARK} strokeWidth="4" />
      ))}
      <rect x="3300" y={TOP_Y} width="300" height="16" fill={STONE} stroke={ROCK_DARK} strokeWidth="4" />
      {/* The second rock, and the dune down from it */}
      <path
        d={`M3790 800 Q3770 600 3790 ${TOP_Y} H3960 L4360 ${GROUND_Y + 4} V800 Z`}
        fill={SAND_DARK}
        stroke={SAND_LINE}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d={`M3790 800 Q3770 600 3790 ${TOP_Y} H3960 Q3990 560 3960 800 Z`} fill={ROCK} stroke={ROCK_DARK} strokeWidth="5" strokeLinejoin="round" />
      <rect x="3780" y={TOP_Y} width="190" height="16" fill={STONE} stroke={ROCK_DARK} strokeWidth="4" />
      {[
        [3060, 640],
        [3420, 540],
        [3880, 560],
      ].map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx="22" ry="10" fill={ROCK_DARK} opacity="0.35" />
      ))}
      <Grass x={4080} y={560} />
      <Grass x={4220} y={650} />
      {bridged && (
        <g transform={`translate(${GAP_AT[0]} ${GAP_AT[1]})`}>
          <g className="tl-plank-laid">
            <Mattress />
          </g>
        </g>
      )}
    </g>
  );
}

/** A hermit crab living in a shell: shell on its back, claws and eyes out of the opening; it faces left. */
function ShellCrab() {
  return (
    <g>
      <path d="M-30 -8 L-50 2 M-24 -4 L-40 6 M-18 -2 L-28 8" stroke="#e03131" strokeWidth="5" strokeLinecap="round" />
      <g transform="translate(14 0) scale(0.9)">
        <Shell />
      </g>
      <path d="M-34 -30 L-42 -58 M-24 -30 L-26 -60" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {[
        [-42, -60],
        [-26, -62],
      ].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="8" fill="#fff" stroke={INK} strokeWidth="3" />
          <circle cx={x - 2} cy={y} r="3.5" fill={INK} />
        </g>
      ))}
      <path
        className="tl-sand-claw"
        d="M-36 -22 Q-70 -38 -74 -20 Q-66 -22 -62 -16 Q-70 -10 -66 -4 Q-50 -6 -36 -14 Z"
        fill="#fa5252"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** The crab in the bucket: only its top shows above the rim – eyes on stalks, claws on the rim. */
function BucketCrab() {
  return (
    <g>
      <path d="M-30 4 Q-30 -32 0 -34 Q30 -32 30 4 Z" fill="#fa5252" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-12 -32 L-16 -60 M12 -32 L16 -60" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {[-16, 16].map((x) => (
        <g key={x}>
          <circle cx={x} cy="-62" r="9" fill="#fff" stroke={INK} strokeWidth="3" />
          <circle cx={x - 2} cy="-62" r="4" fill={INK} />
        </g>
      ))}
      <path d="M-10 -14 Q0 -8 10 -14" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* The bucket's rim again, in front of the crab, so it sits inside */}
      <rect x="-50" y="-4" width="100" height="16" rx="7" fill="#fcc419" stroke={INK} strokeWidth="4.5" />
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${s * 46} -4) scale(${s} 1)`}>
          <path d="M0 0 Q4 -26 22 -24 Q20 -16 12 -14 Q22 -8 20 0 Q10 6 0 0 Z" fill="#fa5252" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        </g>
      ))}
    </g>
  );
}

/** The sandcastle everybody builds at the end: towers grow one after the other, a flag on top, a gull lands on it. */
function Sandcastle() {
  const towers: [number, number, number][] = [
    [4920, 50, 600],
    [4990, 60, 560],
    [5060, 50, 610],
  ];
  return (
    <g>
      <path d="M4870 744 Q4880 690 4990 684 Q5100 690 5110 744 Z" fill={SAND_DARK} stroke={SAND_LINE} strokeWidth="4" strokeLinejoin="round" />
      {towers.map(([x, w, top], i) => (
        <g key={x} className="tl-sand-tower" style={{ animationDelay: `${0.3 + i * 0.45}s` }}>
          <path
            d={`M${x - w / 2} 700 V${top} h${w / 5} v-14 h${w / 5} v14 h${w / 5} v-14 h${w / 5} v14 h${w / 5} V700 Z`}
            fill={SAND_DARK}
            stroke={SAND_LINE}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path d={`M${x - 8} ${top + 40} q8 -14 16 0 v14 h-16 Z`} fill={SAND_LINE} />
        </g>
      ))}
      <g className="tl-sand-tower" style={{ animationDelay: "1.6s" }}>
        <path d="M4990 546 V490" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M4992 490 L5034 502 L4992 516 Z" fill="#f03e3e" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        {[4930, 5050].map((x) => (
          <g key={x} transform={`translate(${x} 734) scale(0.3)`}>
            <Shell />
          </g>
        ))}
      </g>
      <g transform="translate(4920 586) scale(0.8)">
        <g className="tl-sand-land">
          <Gull />
        </g>
      </g>
    </g>
  );
}

/** The world of "Die Sandburg", drawn as far as the child has come. */
export function SandburgScenery(props: SceneryProps) {
  const { done, here, party } = props;
  return (
    <g>
      <Beach />
      <Wave />
      <BeachChair />
      <BeachUmbrella x={-380} />
      {!done.includes("shell") && (
        <g transform="translate(650 746)">
          <Shell />
        </g>
      )}
      <Kiosk roll={!done.includes("roll")} />
      <PathGull {...props} />
      <Towel flipflops={!done.includes("flipflops")} />
      <BeachHut mattress={!done.includes("mattress")} />
      <HotSand here={here} />
      <Rocks done={done} />
      {party && <Sandcastle />}
    </g>
  );
}

/** In front of the bucket: the crab living in it, and after the shell, the crab in its new house. */
export function SandburgFront({ done, here, nope, party }: SceneryProps) {
  const solved = done.includes("crab");
  return (
    <g>
      {!solved && (
        <g transform={`translate(${PAIL_AT[0]} ${PAIL_AT[1] - 90})`}>
          <Nope id="crab" nope={nope}>
            <g className={here === "crab" ? "tl-meet" : undefined}>
              <BucketCrab />
            </g>
          </Nope>
        </g>
      )}
      {solved && (
        <g transform="translate(4700 746)">
          <g className={`tl-sand-crab${party ? " party" : ""}`}>
            <g className="tl-sand-movein">
              <ShellCrab />
            </g>
          </g>
        </g>
      )}
    </g>
  );
}

/** The sea up to the sky, with a boat and an island far out, the sun and clouds; drawn at a third of the world's speed. */
export function SandburgBackdrop() {
  return (
    <g>
      <circle cx="1300" cy="130" r="70" fill="#ffe066" />
      <Cloud x={200} y={120} scale={1.2} />
      <Cloud x={1000} y={200} />
      <Cloud x={1900} y={100} scale={1.4} />
      <Cloud x={2800} y={180} />
      <path d="M600 560 Q760 470 920 560 Z" fill="#8ce99a" />
      <rect x="-1200" y="556" width="5600" height="1100" fill={WATER} />
      <rect x="-1200" y="556" width="5600" height="10" fill={WATER_DARK} opacity="0.5" />
      {[-900, -300, 400, 1100, 1800, 2500, 3200].map((x, i) => (
        <path key={x} d={`M${x} ${600 + (i % 2) * 30} q20 -10 40 0 t40 0`} stroke={FOAM} strokeWidth="5" fill="none" strokeLinecap="round" />
      ))}
      <g transform="translate(1600 590)">
        <path d="M-50 0 H50 L36 22 H-36 Z" fill="#e8590c" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M0 -4 V-90 L44 -10 Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      </g>
    </g>
  );
}
