import type { ReactNode } from "react";
import { Cloud, INK } from "@/games/scenes/shared";
import { Saw, Stick, Umbrella } from "./items";
import type { Point, SceneryProps } from "./types";

// "Das Floß" (G-08): the child stands on a raft on the river and paddles instead of walking. From the jetty at
// home past the woodpile (saw) and the angler's spot (umbrella), to the branch hanging into the water, the willow
// with the stick, the reeds where the ducklings hide from their mother, and the waterfall, which the child floats
// down under the open umbrella. On the lake below it climbs the ladder onto the jetty, the raft stays behind, and
// on the shore the beaver has the toy boat. World points: the raft's deck is at y = 740 on the river and y = 1100
// on the lake (the water a little lower); the waterfall drops from x 2660 to 2840; the jetty is at y = 900.

/** The raft's deck on the river, and on the lake below the waterfall. */
export const RIVER_Y = 740;
export const LAKE_Y = 1100;
/** The jetty on the lake and the shore after it. */
export const JETTY_Y = 900;
/** The water's surface is a little below the deck. */
const SINK = 12;
/** Where the river falls over the edge. */
const EDGE_X = 2660;
/** Where the falling water meets the lake; the child floats down to here. */
export const FALL_TO: Point = [2840, LAKE_Y];

/** The rungs of the ladder up onto the jetty, where the feet go, from the lake up. */
export const LADDER: Point[] = Array.from({ length: 4 }, (_, i) => [3236 + i * 14, 1050 - i * 50]);
/** Where the child gets off the raft, at the foot of the ladder. */
export const RAFT_UNTIL = 3200;

/** Where the open umbrella is put down, from the child's feet: stuck into the raft behind the child, as a sunshade. */
export const UMBRELLA_PUT: Point = [-74, -92];

/** Where the toy boat lies: on the shore, in front of the beaver. */
export const BOAT_AT: Point = [3790, JETTY_Y];
const BEAVER_X = 3884;

/** Where the branch is sawn through. */
export const CUT: Point = [1478, 628];

const WATER = "#4dabf7";
const WATER_DARK = "#1c7ed6";
const DEEP = "#339af0";
const GRASS = "#69db7c";
const GRASS_DARK = "#2b8a3e";
const EARTH = "#b08155";
const ROCK = "#adb5bd";
const ROCK_DARK = "#868e96";
const WOOD = "#c08552";
const WOOD_DARK = "#8d5a3b";
const BEAVER = "#a0673a";
const BEAVER_DARK = "#5c3b1e";

/** A wobble when a wrong thing is tried; keyed so every try starts it anew. */
function Nope({ id, nope, children }: { id: string; nope: SceneryProps["nope"]; children: ReactNode }) {
  const on = nope?.id === id;
  return (
    <g key={on ? nope.n : 0} className={on ? "tl-nope" : undefined}>
      {children}
    </g>
  );
}

/** The raft: logs bound with rope, seen from the side a little from above, its deck on (0, 0). While the child
 * paddles, a little wake runs behind it; after the waterfall the umbrella stands in it as a sunshade. */
export function Raft({ paddling, done }: { paddling: boolean; done: string[] }) {
  return (
    <g>
      {done.includes("waterfall") && (
        <g transform={`translate(${UMBRELLA_PUT[0]} ${UMBRELLA_PUT[1] + 92})`}>
          <Umbrella />
        </g>
      )}
      {paddling && (
        <path className="tl-floss-wake" d="M-96 16 q-16 -8 -32 0 M-110 26 q-18 -8 -36 0" stroke="#e7f5ff" strokeWidth="5" fill="none" strokeLinecap="round" />
      )}
      {/* The deck: the tops of the logs, side by side */}
      <path d="M-80 -10 H92 L86 4 H-86 Z" fill="#d9a066" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-60 -6 H74 M-70 -1 H80" stroke={WOOD_DARK} strokeWidth="2" opacity="0.6" />
      {/* The nearest log along its length, its round ends showing */}
      <rect x="-90" y="2" width="180" height="24" rx="12" fill={WOOD} stroke={INK} strokeWidth="4" />
      <path d="M-70 10 Q-20 6 30 12 T80 10" stroke={WOOD_DARK} strokeWidth="2.5" fill="none" />
      {[-50, 50].map((x) => (
        <path key={x} d={`M${x - 6} -8 L${x - 6} 26 M${x + 4} -8 L${x + 4} 26`} stroke="#ffe066" strokeWidth="4" />
      ))}
      <path d="M-100 20 q8 -6 16 0 M84 20 q8 -6 16 0" stroke="#e7f5ff" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Tree({ x, y = RIVER_Y, h = 260, r = 80 }: { x: number; y?: number; h?: number; r?: number }) {
  return (
    <g>
      <path d={`M${x - 14} ${y} L${x - 8} ${y - h} H${x + 8} L${x + 14} ${y} Z`} fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
      <g fill="#40c057" stroke={GRASS_DARK} strokeWidth="4">
        <circle cx={x - r * 0.6} cy={y - h + 10} r={r * 0.7} />
        <circle cx={x + r * 0.6} cy={y - h + 14} r={r * 0.7} />
        <circle cx={x} cy={y - h - r * 0.4} r={r} />
      </g>
    </g>
  );
}

function Bush({ x, y = RIVER_Y }: { x: number; y?: number }) {
  return (
    <g fill="#40c057" stroke={GRASS_DARK} strokeWidth="4">
      <circle cx={x - 30} cy={y - 24} r="28" />
      <circle cx={x + 28} cy={y - 22} r="30" />
      <circle cx={x} cy={y - 42} r="34" />
    </g>
  );
}

/** The river, its far bank with grass, and the earth below; it ends at the waterfall's rocky edge. */
function River() {
  const top = RIVER_Y + SINK;
  return (
    <g>
      <path d={`M-1400 ${RIVER_Y - 50} Q-400 ${RIVER_Y - 70} 600 ${RIVER_Y - 54} T${EDGE_X} ${RIVER_Y - 50} V${top} H-1400 Z`} fill={GRASS} />
      <path d={`M-1400 ${top - 8} H${EDGE_X}`} stroke={GRASS_DARK} strokeWidth="6" />
      <rect x="-1400" y={top} width={EDGE_X + 1400} height="120" fill={WATER} />
      <rect x="-1400" y={top + 120} width={EDGE_X + 1400} height="1400" fill={EARTH} />
      <path d={`M-1400 ${top} H${EDGE_X}`} stroke={WATER_DARK} strokeWidth="4" />
      {[-900, -300, 400, 1100, 1900, 2400].map((x) => (
        <path
          key={x}
          d={`M${x} ${top + 40} q30 -10 60 0 M${x + 160} ${top + 80} q30 -10 60 0`}
          stroke="#a5d8ff"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      {/* The rocky edge: the cliff the river falls down */}
      <path d={`M${EDGE_X - 30} ${top + 110} Q${EDGE_X + 10} ${top + 200} ${EDGE_X + 20} ${LAKE_Y + 600} H${EDGE_X - 300} V${top + 110} Z`} fill={ROCK} />
      {[
        [EDGE_X - 60, top + 200],
        [EDGE_X - 140, top + 290],
        [EDGE_X - 40, top + 330],
      ].map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx="34" ry="16" fill={ROCK_DARK} />
      ))}
    </g>
  );
}

/** The water falling over the edge into the lake, with foam where it lands. */
function Waterfall({ here, nope }: SceneryProps) {
  const top = RIVER_Y + SINK;
  return (
    <Nope id="waterfall" nope={nope}>
      <g className={here === "waterfall" ? "tl-meet" : undefined}>
        <path
          d={`M${EDGE_X - 40} ${top} H${EDGE_X} Q${EDGE_X + 60} ${top + 10} ${EDGE_X + 90} ${top + 120} L${EDGE_X + 130} ${LAKE_Y + SINK} H${EDGE_X + 20} L${EDGE_X - 10} ${top + 120} Q${EDGE_X - 20} ${top + 30} ${EDGE_X - 40} ${top + 120} Z`}
          fill={WATER}
          stroke={WATER_DARK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {[EDGE_X + 20, EDGE_X + 50, EDGE_X + 80].map((x, i) => (
          <path key={x} d={`M${x} ${top + 30 + i * 20} L${x + 20} ${LAKE_Y - 40}`} stroke="#e7f5ff" strokeWidth="5" strokeLinecap="round" />
        ))}
        <g fill="#fff" stroke="#a5d8ff" strokeWidth="3">
          {[0, 40, 80, 120, 150].map((dx, i) => (
            <circle key={dx} cx={EDGE_X + dx} cy={LAKE_Y + SINK - (i % 2) * 10} r={22 - (i % 2) * 6} />
          ))}
        </g>
      </g>
    </Nope>
  );
}

/** The lake below the waterfall, its far shore, and the jetty with its ladder; the shore rises after it. */
function Lake() {
  const top = LAKE_Y + SINK;
  return (
    <g>
      <path d={`M${EDGE_X} ${top - 40} Q3400 ${top - 64} 4400 ${top - 46} T6000 ${top - 50} V${top} H${EDGE_X} Z`} fill={GRASS} />
      <rect x={EDGE_X} y={top} width="3400" height="1000" fill={DEEP} />
      <path d={`M${EDGE_X} ${top} H6000`} stroke={WATER_DARK} strokeWidth="4" />
      {[2960, 3100].map((x) => (
        <path key={x} d={`M${x} ${top + 50} q30 -10 60 0`} stroke="#a5d8ff" strokeWidth="5" fill="none" strokeLinecap="round" />
      ))}
      {/* The shore after the jetty: grass on top, earth below */}
      <path d={`M3560 ${JETTY_Y + 4} Q3600 ${JETTY_Y + 120} 3620 ${top + 600} H6000 V${JETTY_Y + 4} Z`} fill={EARTH} />
      <rect x="3560" y={JETTY_Y - 4} width="2440" height="22" fill={GRASS} />
      {/* The jetty on its posts */}
      {[3250, 3400, 3550].map((x) => (
        <rect key={x} x={x - 9} y={JETTY_Y} width="18" height={top - JETTY_Y + 40} fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
      ))}
      <rect x="3230" y={JETTY_Y} width="400" height="22" rx="4" fill={WOOD} stroke={INK} strokeWidth="4" />
      {[3290, 3350, 3410, 3470, 3530].map((x) => (
        <path key={x} d={`M${x} ${JETTY_Y + 2} V${JETTY_Y + 20}`} stroke={WOOD_DARK} strokeWidth="3" />
      ))}
      {/* The ladder up from the water */}
      <path d={`M3222 ${top + 20} L3256 ${JETTY_Y - 30} M3270 ${top + 20} L3304 ${JETTY_Y - 30}`} stroke={WOOD_DARK} strokeWidth="9" strokeLinecap="round" />
      {LADDER.map(([x, y]) => (
        <path key={y} d={`M${x - 20} ${y} H${x + 30}`} stroke={WOOD} strokeWidth="8" strokeLinecap="round" />
      ))}
      <path d={`M3226 ${JETTY_Y - 30} V${JETTY_Y}`} stroke={WOOD_DARK} strokeWidth="6" />
      {/* A post with a ring, to tie the raft to */}
      <rect x="3194" y={top - 60} width="16" height="100" rx="4" fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** Home: the little house on the bank with its jetty; the raft was tied to the post. */
function Home() {
  return (
    <g>
      <rect x="-560" y="520" width="380" height="200" fill="#fff3bf" stroke={INK} strokeWidth="5" />
      <path d="M-590 530 L-370 380 L-150 530 Z" fill="#e03131" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <rect x="-420" y="600" width="70" height="120" rx="6" fill="#4263eb" stroke={INK} strokeWidth="5" />
      <rect x="-520" y="570" width="60" height="56" rx="5" fill="#a5d8ff" stroke={INK} strokeWidth="4" />
      <rect x="-290" y="570" width="60" height="56" rx="5" fill="#a5d8ff" stroke={INK} strokeWidth="4" />
      <rect x="-60" y={RIVER_Y - 20} width="300" height="18" rx="4" fill={WOOD} stroke={INK} strokeWidth="4" />
      {[-40, 100, 220].map((x) => (
        <rect key={x} x={x - 7} y={RIVER_Y - 4} width="14" height="80" fill={WOOD_DARK} stroke={INK} strokeWidth="3" />
      ))}
      <path d="M220 708 q30 20 60 26" stroke="#e8a317" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** A chopping block on the bank with logs stacked beside it; the saw lies on the block. */
function Woodpile({ saw }: { saw: boolean }) {
  return (
    <g>
      {[0, 1, 2].map((row) =>
        Array.from({ length: 3 - row }, (_, i) => (
          <g key={`${row}${i}`}>
            <circle cx={760 + i * 44 + row * 22} cy={RIVER_Y - 14 - row * 40} r="21" fill={WOOD} stroke={INK} strokeWidth="4" />
            <circle cx={760 + i * 44 + row * 22} cy={RIVER_Y - 14 - row * 40} r="9" fill="none" stroke={WOOD_DARK} strokeWidth="3" />
          </g>
        )),
      )}
      <path d="M612 748 V708 H700 V748 Z" fill={WOOD_DARK} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <ellipse cx="656" cy="708" rx="44" ry="10" fill="#d9a066" stroke={INK} strokeWidth="4" />
      {saw && (
        <g transform="translate(660 712)">
          <Saw />
        </g>
      )}
    </g>
  );
}

/** The angler's spot: a stool, a bucket and the big umbrella stuck into the bank. */
function AnglerSpot({ umbrella }: { umbrella: boolean }) {
  return (
    <g>
      <path d="M1080 748 L1110 700 M1140 748 L1110 700" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <rect x="1084" y="692" width="54" height="12" rx="4" fill="#40c057" stroke={INK} strokeWidth="4" />
      <path d="M1160 716 H1204 L1198 748 H1166 Z" fill="#fcc419" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M1162 716 Q1182 690 1202 716" stroke={INK} strokeWidth="3" fill="none" />
      {umbrella && (
        <g transform="translate(1000 748)">
          <Umbrella />
        </g>
      )}
    </g>
  );
}

/** The big tree on the bank whose branch hangs down into the water across the way; the saw cuts it, and the cut part
 * falls into the water and drifts off. */
function Branch({ done, here, nope }: SceneryProps) {
  const solved = done.includes("branch");
  const [cx, cy] = CUT;
  return (
    <g>
      <Tree x={1590} h={330} r={96} />
      <path d={`M1584 560 Q1530 580 ${cx} ${cy}`} stroke={INK} strokeWidth="30" strokeLinecap="round" fill="none" />
      <path d={`M1584 560 Q1530 580 ${cx} ${cy}`} stroke={WOOD_DARK} strokeWidth="22" strokeLinecap="round" fill="none" />
      <g className={`tl-floss-limb${solved ? " done" : ""}`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <Nope id="branch" nope={nope}>
          <g className={here === "branch" && !solved ? "tl-meet" : undefined}>
            <path d={`M${cx} ${cy} Q1420 680 1400 776`} stroke={INK} strokeWidth="26" strokeLinecap="round" fill="none" />
            <path d={`M${cx} ${cy} Q1420 680 1400 776`} stroke={WOOD_DARK} strokeWidth="18" strokeLinecap="round" fill="none" />
            <path d="M1430 690 L1380 660 M1412 740 L1460 724" stroke={WOOD_DARK} strokeWidth="9" strokeLinecap="round" />
            <g fill="#40c057" stroke={GRASS_DARK} strokeWidth="4">
              <circle cx="1372" cy="650" r="30" />
              <circle cx="1466" cy="716" r="28" />
              <circle cx="1394" cy="716" r="26" />
            </g>
          </g>
        </Nope>
      </g>
      {/* The saw at work: back and forth across the branch, then gone */}
      {solved && (
        <g transform={`translate(${cx} ${cy + 30}) rotate(32)`}>
          <g className="tl-floss-sawing">
            <Saw />
          </g>
        </g>
      )}
    </g>
  );
}

/** The willow on the bank; a stick lies at its foot. */
function Willow({ stick }: { stick: boolean }) {
  return (
    <g>
      <path d="M1940 748 L1950 520 H1974 L1986 748 Z" fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
      <ellipse cx="1962" cy="500" rx="120" ry="70" fill="#8ce99a" stroke={GRASS_DARK} strokeWidth="4" />
      {[1860, 1900, 1940, 1990, 2030, 2070].map((x, i) => (
        <path
          key={x}
          d={`M${x} 520 Q${x - 10} ${600 + (i % 2) * 20} ${x} ${660 - (i % 3) * 20}`}
          stroke="#51cf66"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      {stick && (
        <g transform="translate(1820 752)">
          <Stick />
        </g>
      )}
    </g>
  );
}

/** A duck swimming, looking left, its body on the water at (0, 0); small for a duckling. */
function SwimDuck({ body, s }: { body: string; s: number }) {
  return (
    <g transform={`scale(${s})`}>
      <path d="M-30 -24 Q-30 6 6 6 Q46 6 52 -28 Q40 -20 30 -24 Q20 -44 -10 -40 Z" fill={body} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M0 -28 Q20 -34 30 -18" stroke={INK} strokeWidth="3" fill="none" />
      <circle cx="-30" cy="-50" r="20" fill={body} stroke={INK} strokeWidth="4" />
      <path d="M-48 -50 L-70 -44 Q-66 -36 -46 -40 Z" fill="#ff922b" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="-36" cy="-56" r="3.5" fill={INK} />
    </g>
  );
}

/** The mother duck on the water looking for her ducklings, which hide in the reeds by the bank; the reeds part, the
 * ducklings swim to her, she turns round and they all swim off to the far bank, away from the waterfall. */
function Ducks({ done, here }: SceneryProps) {
  const found = done.includes("ducks");
  const open = found || here === "ducks";
  const water = RIVER_Y + SINK;
  return (
    <g>
      <g className={`tl-floss-family${found ? " done" : ""}`}>
        {[2176, 2206, 2236].map((x, i) => (
          <g key={x} transform={`translate(${x} ${water})`}>
            <g className={`tl-floss-chick${open ? " out" : ""}`} style={{ transitionDelay: `${300 + i * 250}ms` }}>
              <g transform="scale(-1 1)">
                <SwimDuck body="#ffd43b" s={0.42} />
              </g>
            </g>
          </g>
        ))}
        <g transform={`translate(2340 ${water})`}>
          <g className={`tl-floss-mother${found ? " done" : ""}`}>
            <g className={here === "ducks" && !found ? "tl-meet" : undefined}>
              <SwimDuck body="#fff" s={1} />
            </g>
          </g>
        </g>
      </g>
      {/* The reeds in front of the ducklings; they bend aside when the child reaches out */}
      {[2160, 2186, 2212, 2238, 2262].map((x, i) => (
        <g
          key={x}
          className={`tl-floss-reed${open ? " open" : ""}`}
          style={{ transformOrigin: `${x}px ${water}px`, rotate: open ? `${i < 2 ? -24 : 24}deg` : undefined }}
        >
          <path
            d={`M${x} ${water} Q${x - 6} ${water - 70} ${x + 2} ${water - 128 + (i % 2) * 20}`}
            stroke="#2f9e44"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
          <rect x={x - 6} y={water - 128 + (i % 2) * 20} width="13" height="34" rx="6" fill="#8d5a3b" stroke={INK} strokeWidth="2.5" />
        </g>
      ))}
    </g>
  );
}

/** A beaver standing up, looking left, its feet on (0, 0), its flat tail behind it. */
function BeaverBody() {
  return (
    <g>
      <path d="M26 -10 Q90 -6 92 -34 Q70 -36 30 -30 Z" fill={BEAVER_DARK} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M44 -24 L80 -28 M48 -16 L84 -20" stroke="#8d5a3b" strokeWidth="2.5" />
      <ellipse cx="6" cy="-50" rx="38" ry="50" fill={BEAVER} stroke={INK} strokeWidth="4" />
      <ellipse cx="-2" cy="-42" rx="22" ry="32" fill="#d9a066" />
      <ellipse cx="-14" cy="-4" rx="16" ry="7" fill={BEAVER_DARK} stroke={INK} strokeWidth="3" />
      <ellipse cx="22" cy="-4" rx="16" ry="7" fill={BEAVER_DARK} stroke={INK} strokeWidth="3" />
      <g className="tl-floss-beaver-head">
        <circle cx="16" cy="-112" r="9" fill={BEAVER} stroke={INK} strokeWidth="3" />
        <circle cx="-6" cy="-100" r="28" fill={BEAVER} stroke={INK} strokeWidth="4" />
        <ellipse cx="-30" cy="-92" rx="14" ry="11" fill="#d9a066" stroke={INK} strokeWidth="3" />
        <circle cx="-38" cy="-98" r="5" fill={INK} />
        <circle cx="-12" cy="-110" r="4" fill={INK} />
        <rect x="-34" y="-84" width="12" height="13" rx="2" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <path d="M-28 -84 V-71" stroke={INK} strokeWidth="2" />
      </g>
    </g>
  );
}

/** The beaver's lodge of sticks on the shore, and the beaver in front of it. With the stick it gnaws it bite by bite
 * and then carries on to its lodge. */
function Beaver({ done, here, nope }: SceneryProps) {
  const solved = done.includes("beaver");
  return (
    <g>
      <path
        d={`M3990 ${JETTY_Y} Q4000 ${JETTY_Y - 150} 4110 ${JETTY_Y - 160} Q4220 ${JETTY_Y - 150} 4240 ${JETTY_Y} Z`}
        fill={WOOD_DARK}
        stroke={INK}
        strokeWidth="5"
      />
      {[
        [4010, -40, 4120, -110],
        [4040, -20, 4210, -70],
        [4060, -130, 4180, -120],
        [4100, -60, 4230, -20],
      ].map(([x1, y1, x2, y2]) => (
        <path key={`${x1}${y1}`} d={`M${x1} ${JETTY_Y + y1} L${x2} ${JETTY_Y + y2}`} stroke={WOOD} strokeWidth="9" strokeLinecap="round" />
      ))}
      <path d={`M4080 ${JETTY_Y} V${JETTY_Y - 44} Q4110 ${JETTY_Y - 70} 4140 ${JETTY_Y - 44} V${JETTY_Y} Z`} fill="#3b2a1a" />
      <g transform={`translate(${BEAVER_X} ${JETTY_Y})`}>
        <g className={`tl-floss-beaver${solved ? " done" : ""}`}>
          <Nope id="beaver" nope={nope}>
            <g className={here === "beaver" && !solved ? "tl-meet" : undefined}>
              <BeaverBody />
            </g>
          </Nope>
          {solved && (
            <g transform="translate(-44 -78) rotate(-10) scale(0.5)">
              <g className="tl-bites">
                <Stick />
              </g>
            </g>
          )}
        </g>
      </g>
    </g>
  );
}

/** The world of "Das Floß", drawn as far as the child has come. */
export function FlossScenery(props: SceneryProps) {
  const { done } = props;
  return (
    <g>
      <River />
      <Lake />
      <Home />
      <Bush x={-760} y={RIVER_Y - 30} />
      <Tree x={420} y={RIVER_Y - 40} h={220} r={70} />
      <Woodpile saw={!done.includes("saw")} />
      <AnglerSpot umbrella={!done.includes("umbrella")} />
      <Branch {...props} />
      <Willow stick={!done.includes("stick")} />
      <Ducks {...props} />
      <Tree x={2520} y={RIVER_Y - 40} h={200} r={64} />
      <Waterfall {...props} />
      <Tree x={3000} y={LAKE_Y - 40} h={240} r={72} />
      <Bush x={3460} y={LAKE_Y - 40} />
      <Beaver {...props} />
      <Tree x={4420} y={JETTY_Y} h={260} r={80} />
      <Bush x={4700} y={JETTY_Y} />
    </g>
  );
}

/** In front of the toy boat: the beaver's paws on it, until it gets the stick. */
export function FlossFront({ done }: SceneryProps) {
  if (done.includes("beaver")) return null;
  return (
    <g fill={BEAVER} stroke={INK} strokeWidth="3">
      <ellipse cx={BEAVER_X - 34} cy={JETTY_Y - 34} rx="12" ry="9" />
      <ellipse cx={BEAVER_X - 30} cy={JETTY_Y - 56} rx="12" ry="9" />
    </g>
  );
}

/** Green hills far away, clouds and the sun; drawn at a third of the world's speed. They reach far down, since the
 * world goes down the waterfall. */
export function FlossBackdrop() {
  return (
    <g>
      <circle cx="1200" cy="120" r="70" fill="#ffe066" />
      <Cloud x={100} y={120} scale={1.2} />
      <Cloud x={900} y={200} />
      <Cloud x={1800} y={100} scale={1.4} />
      <Cloud x={2600} y={180} />
      <path d="M-1200 640 Q-700 420 -200 600 Q300 380 800 590 Q1300 400 1800 600 Q2300 420 2800 600 Q3300 420 3800 600 V2200 H-1200 Z" fill="#b2f2bb" />
      <path d="M-1200 700 Q-500 600 200 680 Q900 590 1600 680 Q2300 600 3000 680 Q3700 600 4400 680 V2200 H-1200 Z" fill="#8ce99a" />
    </g>
  );
}
