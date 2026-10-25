import type { ReactNode } from "react";
import { Cloud, INK } from "@/games/scenes/shared";
import { Apple, Carrot, Corn, Lantern } from "./items";
import type { Point, SceneryProps } from "./types";

// "Die kleine Lok": from the farmhouse past the vegetable patch, the corn field and the rabbit to
// the big hill. There the way forks (G-09): up the stairs and over the hill, past the apple tree
// and the pony, or through the dark tunnel with the lantern from its mouth. Both ways meet at the
// gate of the hen yard, where a hen sits on the toy train. World points: the ground is at y = 740,
// the hilltop at y = 420; the stairs climb from x 1870 to 2250, the way down the other side goes
// from x 3180 to 3540; the tunnel runs below from x 2340 to 3330.

export const GROUND_Y = 740;
export const TOP_Y = 420;

/** The tread middles of the six steps up the hill. */
export const STAIRS: Point[] = Array.from({ length: 6 }, (_, i) => [1870 + i * 76, 690 - i * 54]);

/** The ground of the way over the hill: up the stairs, over the top and down the path on the other side. */
export const OVER_GROUND: Point[] = [[-3000, GROUND_Y], [1820, GROUND_Y], ...STAIRS, [3180, TOP_Y], [3540, GROUND_Y], [9000, GROUND_Y]];

/** Where the toy train stops: in the hen yard, with a hen sitting on it. */
export const LOK_AT: Point = [4300, GROUND_Y];

/** Where the pony stands on the hilltop. */
const PONY_X = 3070;

/** The two signs at the fork: the stairs above, the tunnel below. */
export const SIGN_OVER: Point = [1700, 380];
export const SIGN_THROUGH: Point = [1700, 600];

const GRASS = "#69db7c";
const EARTH = "#b08155";
const PATH = "#e9c891";
const HILL = "#51cf66";
const HILL_DARK = "#2b8a3e";
const WOOD = "#c08552";
const WOOD_DARK = "#8d5a3b";
const STONE = "#ced4da";
const STONE_DARK = "#868e96";

/** The tunnel through the hill, seen cut open from the side. */
const TUNNEL = "M2340 740 V650 Q2340 590 2400 590 H3270 Q3330 590 3330 650 V740 Z";
const TUNNEL_ARCH = "M2340 740 V650 Q2340 590 2400 590 H3270 Q3330 590 3330 650 V740";

/** A wobble when a wrong thing is tried; keyed so every try starts it anew. */
function Nope({ id, nope, children }: { id: string; nope: SceneryProps["nope"]; children: ReactNode }) {
  const on = nope?.id === id;
  return (
    <g key={on ? nope.n : 0} className={on ? "tl-nope" : undefined}>
      {children}
    </g>
  );
}

function Flower({ x, y = GROUND_Y, colour }: { x: number; y?: number; colour: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 V-34" stroke="#2f9e44" strokeWidth="4" />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 9} cy={-40 + Math.sin((a * Math.PI) / 180) * 9} r="7" fill={colour} />
      ))}
      <circle cx="0" cy="-40" r="5" fill="#ffd43b" />
    </g>
  );
}

function Bush({ x, y = GROUND_Y }: { x: number; y?: number }) {
  return (
    <g fill="#40c057" stroke={HILL_DARK} strokeWidth="4">
      <circle cx={x - 34} cy={y - 26} r="30" />
      <circle cx={x + 30} cy={y - 24} r="32" />
      <circle cx={x} cy={y - 46} r="38" />
    </g>
  );
}

/** A window with a cross in it. */
function Win({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="60" height="60" rx="5" fill="#a5d8ff" stroke={INK} strokeWidth="4" />
      <path d={`M${x + 30} ${y} V${y + 60} M${x} ${y + 30} H${x + 60}`} stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** Home: the farmhouse with its red roof; the rails of the toy train lie on the grass in front. */
function Farmhouse() {
  return (
    <g>
      <rect x="-520" y="480" width="620" height="260" fill="#fff3bf" stroke={INK} strokeWidth="5" />
      <path d="M-560 490 L-210 300 L140 490 Z" fill="#e03131" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <rect x="-120" y="330" width="44" height="90" fill="#adb5bd" stroke={INK} strokeWidth="4" />
      <Win x={-460} y={540} />
      <Win x={-330} y={540} />
      <Win x={-40} y={540} />
      <rect x="-200" y="600" width="90" height="140" rx="8" fill="#2f9e44" stroke={INK} strokeWidth="5" />
      <circle cx="-126" cy="672" r="6" fill="#ffd43b" stroke={INK} strokeWidth="2" />
      {/* A small wooden track where the train was playing */}
      <path d="M130 736 H420" stroke={WOOD_DARK} strokeWidth="6" />
      {[150, 190, 230, 270, 310, 350, 390].map((x) => (
        <rect key={x} x={x - 5} y="730" width="10" height="14" rx="2" fill={WOOD} stroke={INK} strokeWidth="2" />
      ))}
    </g>
  );
}

function VegPatch({ carrot }: { carrot: boolean }) {
  return (
    <g>
      <rect x="470" y="716" width="300" height="26" rx="10" fill="#8d5a3b" stroke={INK} strokeWidth="4" />
      {[510, 570, 710, 750].map((x) => (
        <g key={x} fill="#8ce99a" stroke={HILL_DARK} strokeWidth="3">
          <ellipse cx={x - 8} cy="708" rx="14" ry="10" />
          <ellipse cx={x + 8} cy="708" rx="14" ry="10" />
          <ellipse cx={x} cy="700" rx="14" ry="12" />
        </g>
      ))}
      {carrot && (
        <g transform="translate(640 730) scale(0.75)">
          <Carrot />
        </g>
      )}
    </g>
  );
}

/** Tall corn plants; one big cob stands at the edge, by the path. */
function CornField({ corn }: { corn: boolean }) {
  return (
    <g>
      {[840, 885, 930, 1010, 1055, 1100].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 740 V${520 + (i % 2) * 20}`} stroke="#2f9e44" strokeWidth="7" strokeLinecap="round" />
          <path
            d={`M${x} 660 Q${x - 40} 630 ${x - 52} 660 M${x} 600 Q${x + 40} 570 ${x + 52} 600`}
            stroke="#40c057"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path d={`M${x} 540 l-14 -26 M${x} 540 l14 -26 M${x} 540 v-30`} stroke="#e8a500" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx={x + 10} cy="630" rx="8" ry="18" fill="#ffe066" stroke={INK} strokeWidth="2.5" transform={`rotate(20 ${x + 10} 630)`} />
        </g>
      ))}
      {corn && (
        <g transform="translate(970 744) scale(0.8)">
          <Corn />
        </g>
      )}
    </g>
  );
}

function Rabbit({ done, here, nope }: SceneryProps) {
  const solved = done.includes("rabbit");
  return (
    <g transform="translate(1380 742)">
      <g className={`tl-lok-rabbit${solved ? " done" : ""}`}>
        <Nope id="rabbit" nope={nope}>
          <g className={here === "rabbit" && !solved ? "tl-meet" : undefined}>
            <circle cx="44" cy="-30" r="12" fill="#fff" stroke={INK} strokeWidth="3.5" />
            <ellipse cx="12" cy="-30" rx="36" ry="28" fill="#adb5bd" stroke={INK} strokeWidth="4" />
            <ellipse cx="-4" cy="-4" rx="16" ry="6" fill="#adb5bd" stroke={INK} strokeWidth="3" />
            <g className="tl-lok-rabbit-head">
              <g fill="#adb5bd" stroke={INK} strokeWidth="3.5">
                <ellipse cx="-30" cy="-98" rx="9" ry="28" transform="rotate(-12 -30 -98)" />
                <ellipse cx="-12" cy="-96" rx="9" ry="28" transform="rotate(14 -12 -96)" />
              </g>
              <ellipse cx="-30" cy="-98" rx="4" ry="18" fill="#ffc9c9" transform="rotate(-12 -30 -98)" />
              <ellipse cx="-12" cy="-96" rx="4" ry="18" fill="#ffc9c9" transform="rotate(14 -12 -96)" />
              <circle cx="-26" cy="-56" r="22" fill="#adb5bd" stroke={INK} strokeWidth="4" />
              <circle cx="-34" cy="-60" r="3.5" fill={INK} />
              <circle cx="-46" cy="-50" r="4" fill="#ff8fa3" />
              <path d="M-46 -48 L-66 -46 M-46 -50 L-64 -56" stroke={INK} strokeWidth="1.5" />
              {solved && (
                <g transform="translate(-54 -36) rotate(-70) scale(0.4)">
                  <g className="tl-chew">
                    <Carrot />
                  </g>
                </g>
              )}
            </g>
          </g>
        </Nope>
      </g>
    </g>
  );
}

/** The signpost at the fork; the two round picture signs on it are drawn by the game, which lets the child tap them. */
function Signpost() {
  const [x, top] = SIGN_OVER;
  return (
    <g>
      <rect x={x - 9} y={top} width="18" height={GROUND_Y - top} fill={WOOD} stroke={INK} strokeWidth="4" />
      {/* Wooden arrows behind the signs: up the hill, and straight on into the tunnel */}
      <path
        d={`M${x} ${top + 20} L${x + 96} ${top - 34} L${x + 90} ${top - 64} L${x + 130} ${top - 50} L${x + 112} ${top - 12} L${x + 106} ${top - 30} L${x + 10} ${top + 40} Z`}
        fill={WOOD}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d={`M${x} ${SIGN_THROUGH[1] - 14} H${x + 104} V${SIGN_THROUGH[1] - 34} L${x + 136} ${SIGN_THROUGH[1]} L${x + 104} ${SIGN_THROUGH[1] + 34} V${SIGN_THROUGH[1] + 14} H${x} Z`}
        fill={WOOD}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** The picture on the sign of the way over the hill: stairs going up. */
export function StairsSign() {
  return (
    <g>
      <path d="M-50 42 V20 H-26 V-4 H-2 V-28 H22 V-52 H46 V42 Z" fill={STONE} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-50 20 H-26 M-26 -4 H-2 M-2 -28 H22" stroke={STONE_DARK} strokeWidth="3" />
    </g>
  );
}

/** The picture on the sign of the way through the hill: a green hill with a dark tunnel. */
export function TunnelSign() {
  return (
    <g>
      <path d="M-54 40 Q-52 -46 0 -48 Q52 -46 54 40 Z" fill={HILL} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-24 40 V6 Q-24 -18 0 -18 Q24 -18 24 6 V40" fill="#101028" stroke={STONE} strokeWidth="9" />
      <path d="M-29 40 V6 Q-29 -23 0 -23 Q29 -23 29 6 V40" fill="none" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** The hill with the stairs up its side, the path down the other side and the tunnel through it. */
function Hill({ done, nope }: SceneryProps) {
  const lit = done.includes("dark");
  return (
    <g>
      <path d={`M1760 740 Q1930 460 2250 ${TOP_Y} H3180 L3560 740 Z`} fill={HILL} stroke={HILL_DARK} strokeWidth="5" strokeLinejoin="round" />
      {/* The sandy path over the top and down the other side */}
      <path d={`M2250 ${TOP_Y + 4} H3180 L3540 744`} stroke={PATH} strokeWidth="14" fill="none" />
      {[
        [2500, 500],
        [2900, 470],
        [3100, 520],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="12" fill="#ffd43b" opacity="0.8" />
      ))}
      {STAIRS.map(([x, y], i) => (
        <rect key={i} x={x - 40} y={y} width="80" height={GROUND_Y - y} fill={STONE} stroke={STONE_DARK} strokeWidth="4" />
      ))}
      {/* The tunnel: a stone arch, inside drops and a sleeping bat; dark until the lantern comes */}
      <path d={TUNNEL} fill="#5c4632" />
      <path d="M2420 740 H3260" stroke="#7a5c40" strokeWidth="10" />
      <g transform="translate(2900 590)">
        <path d="M0 0 V10" stroke={INK} strokeWidth="3" />
        <ellipse cx="0" cy="26" rx="14" ry="18" fill="#5f3dc4" />
        <path d="M-14 18 Q-34 30 -24 44 Q-16 36 -12 40 Z M14 18 Q34 30 24 44 Q16 36 12 40 Z" fill="#7048e8" />
        <path d="M-6 34 q3 3 6 0 M2 34 q3 3 6 0" stroke="#fff" strokeWidth="2" fill="none" />
      </g>
      {[2500, 3100].map((x) => (
        <ellipse key={x} cx={x} cy="616" rx="5" ry="8" fill="#74c0fc" />
      ))}
      {lit && (
        <g transform="translate(2560 720)">
          <Lantern lit />
        </g>
      )}
      <Nope id="dark" nope={nope}>
        <path className={`tl-dark${lit ? " lit" : ""}`} d={TUNNEL} fill="#101028" />
      </Nope>
      <path d={TUNNEL_ARCH} fill="none" stroke={STONE} strokeWidth="22" />
      <path d={TUNNEL_ARCH} fill="none" stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** A wooden post at the tunnel's mouth; the lantern hangs on its arm. */
function LanternPost({ lantern }: { lantern: boolean }) {
  return (
    <g>
      <rect x="2294" y="590" width="12" height="150" fill={WOOD} stroke={INK} strokeWidth="4" />
      <path d="M2300 596 H2336 V608" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
      {lantern && (
        <g transform="translate(2336 724)">
          <Lantern />
        </g>
      )}
    </g>
  );
}

function AppleTree({ apple }: { apple: boolean }) {
  return (
    <g>
      <path d={`M2668 ${TOP_Y} L2674 240 H2694 L2700 ${TOP_Y} Z`} fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
      <path d="M2680 300 Q2640 290 2596 268" stroke={WOOD_DARK} strokeWidth="12" strokeLinecap="round" fill="none" />
      {[
        [2690, 170, 96],
        [2600, 220, 60],
        [2780, 220, 64],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill="#40c057" stroke={HILL_DARK} strokeWidth="4" />
      ))}
      {[
        [2660, 140],
        [2740, 200],
        [2720, 110],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="10" fill="#fa5252" stroke={INK} strokeWidth="2.5" />
      ))}
      {apple && (
        <g transform="translate(2598 336)">
          <Apple />
        </g>
      )}
    </g>
  );
}

function Pony({ done, here, nope }: SceneryProps) {
  const solved = done.includes("pony");
  return (
    <g transform={`translate(${PONY_X} ${TOP_Y})`}>
      <g className={`tl-lok-pony${solved ? " done" : ""}`}>
        <Nope id="pony" nope={nope}>
          <g className={here === "pony" && !solved ? "tl-meet" : undefined}>
            <path d="M50 -84 Q86 -70 80 -24" stroke="#5c3b1e" strokeWidth="14" strokeLinecap="round" fill="none" />
            {[-40, -20, 26, 46].map((x) => (
              <rect key={x} x={x - 7} y="-56" width="14" height="56" rx="5" fill="#fff" stroke={INK} strokeWidth="3.5" />
            ))}
            <ellipse cx="4" cy="-74" rx="62" ry="32" fill="#fff" stroke={INK} strokeWidth="4" />
            <ellipse cx="20" cy="-80" rx="20" ry="14" fill="#d9a066" />
            <ellipse cx="-24" cy="-66" rx="14" ry="10" fill="#d9a066" />
            <g className="tl-lok-pony-head">
              <path d="M-40 -90 Q-60 -130 -72 -148 L-96 -132 Q-74 -104 -52 -66 Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
              <path d="M-68 -152 Q-40 -140 -34 -96" stroke="#5c3b1e" strokeWidth="14" strokeLinecap="round" fill="none" />
              <ellipse cx="-96" cy="-130" rx="30" ry="18" transform="rotate(-24 -96 -130)" fill="#fff" stroke={INK} strokeWidth="4" />
              <path d="M-84 -150 L-82 -172 L-70 -154 Z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
              <circle cx="-92" cy="-138" r="3.5" fill={INK} />
              <circle cx="-118" cy="-118" r="3" fill={INK} />
              {solved && (
                <g transform="translate(-124 -100) scale(0.5)">
                  <g className="tl-chew">
                    <Apple />
                  </g>
                </g>
              )}
            </g>
          </g>
        </Nope>
      </g>
    </g>
  );
}

/** The fence round the hen yard and its gate across the path; the child opens the gate. */
function Gate({ done }: SceneryProps) {
  const open = done.includes("gate");
  return (
    <g>
      {[3850, 3970].map((x) => (
        <rect key={x} x={x - 9} y="626" width="18" height="114" rx="3" fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
      ))}
      <path d="M3980 670 H4700 M3980 710 H4700" stroke={WOOD} strokeWidth="10" />
      {[4060, 4160, 4560, 4660].map((x) => (
        <rect key={x} x={x - 7} y="646" width="14" height="94" rx="3" fill={WOOD} stroke={INK} strokeWidth="3" />
      ))}
      <g className={`tl-lok-gate${open ? " open" : ""}`} style={{ transformOrigin: "3858px 690px" }}>
        <g fill={WOOD} stroke={INK} strokeWidth="4">
          <rect x="3858" y="646" width="104" height="14" rx="3" />
          <rect x="3858" y="700" width="104" height="14" rx="3" />
          <rect x="3864" y="640" width="12" height="90" rx="3" />
          <rect x="3944" y="640" width="12" height="90" rx="3" />
          <path d="M3870 706 L3950 652" strokeWidth="10" stroke={INK} />
          <path d="M3870 706 L3950 652" strokeWidth="5" stroke={WOOD} />
        </g>
      </g>
    </g>
  );
}

/** A hen, looking left, standing on (0, 0); `sit` hides its legs. */
function Hen({ sit = false, colour = "#fff" }: { sit?: boolean; colour?: string }) {
  return (
    <g>
      {!sit && <path d="M-6 0 V-14 M8 0 V-14" stroke="#f08c00" strokeWidth="5" strokeLinecap="round" />}
      <path d="M22 -46 Q48 -66 44 -30 Z" fill={colour} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <ellipse cx="2" cy="-32" rx="32" ry="22" fill={colour} stroke={INK} strokeWidth="4" />
      <path d="M-6 -36 Q12 -40 20 -26" stroke={INK} strokeWidth="2.5" fill="none" />
      <g className="tl-lok-hen-head">
        <path d="M-34 -72 q4 -10 8 -2 q4 -10 8 0 q6 -6 6 4 Z" fill="#fa5252" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="-26" cy="-58" r="14" fill={colour} stroke={INK} strokeWidth="3.5" />
        <path d="M-38 -60 L-52 -54 L-38 -50 Z" fill="#fcc419" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M-38 -48 q-2 10 4 8" fill="#fa5252" stroke={INK} strokeWidth="2" />
        <circle cx="-30" cy="-62" r="3" fill={INK} />
      </g>
    </g>
  );
}

function HenYard() {
  return (
    <g>
      {/* The hen house on short legs, with its little ladder */}
      <path d="M4470 740 V680 M4630 740 V680" stroke={INK} strokeWidth="8" />
      <rect x="4450" y="560" width="200" height="124" fill="#e8590c" stroke={INK} strokeWidth="5" />
      <path d="M4430 566 L4550 486 L4670 566 Z" fill={WOOD_DARK} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M4520 684 V620 Q4520 596 4544 596 Q4568 596 4568 620 V684 Z" fill="#5c3b1e" stroke={INK} strokeWidth="4" />
      <path d="M4500 740 L4530 684 M4520 740 L4550 684" stroke={WOOD} strokeWidth="6" />
      <g transform="translate(4720 740)">
        <Hen colour="#ffa94d" />
      </g>
      {[4400, 4430, 4760].map((x) => (
        <path key={x} d={`M${x} 740 l-8 -14 M${x} 740 l0 -16 M${x} 740 l8 -14`} stroke="#e8a500" strokeWidth="3" strokeLinecap="round" />
      ))}
    </g>
  );
}

/** The world of "Die kleine Lok", drawn as far as the child has come. */
export function LokScenery(props: SceneryProps) {
  const { done } = props;
  return (
    <g>
      <rect x="-1200" y={GROUND_Y} width="7200" height="2000" fill={EARTH} />
      <rect x="-1200" y={GROUND_Y - 4} width="7200" height="22" fill={GRASS} />
      <rect x="-1200" y={GROUND_Y + 10} width="7200" height="20" fill={PATH} />
      <Farmhouse />
      <Bush x={-700} />
      <VegPatch carrot={!done.includes("carrot")} />
      <CornField corn={!done.includes("corn")} />
      {[1130, 3640, 4980].map((x, i) => (
        <Flower key={x} x={x} colour={["#ff8fa3", "#ffd43b", "#cc5de8", "#fff"][i % 4]} />
      ))}
      <Hill {...props} />
      <LanternPost lantern={!done.includes("lantern")} />
      <Signpost />
      {[2440, 2860, 3120].map((x, i) => (
        <Flower key={x} x={x} y={TOP_Y} colour={["#ffd43b", "#ff8fa3", "#cc5de8"][i]} />
      ))}
      <AppleTree apple={!done.includes("apple")} />
      <Pony {...props} />
      <Rabbit {...props} />
      <Gate {...props} />
      <HenYard />
      <Bush x={4900} />
      <Bush x={5300} />
    </g>
  );
}

/** In front of the toy train: the hen sitting on it; with the corn it hops down and pecks. */
export function LokFront({ done, here, nope }: SceneryProps) {
  const solved = done.includes("hen");
  return (
    <g>
      {solved && (
        <g transform="translate(4236 740) rotate(-90) scale(0.55)">
          <Corn />
        </g>
      )}
      <g transform={`translate(${LOK_AT[0] + 4} ${LOK_AT[1] - 66})`}>
        <g className={`tl-lok-hen${solved ? " done" : ""}`}>
          <Nope id="hen" nope={nope}>
            <g className={here === "hen" && !solved ? "tl-meet" : undefined}>
              <Hen sit={!solved} />
            </g>
          </Nope>
        </g>
      </g>
    </g>
  );
}

/** Mountains with snow far away, clouds and the sun; drawn at a third of the world's speed. */
export function LokBackdrop() {
  const peaks: [number, number][] = [];
  for (let i = 0; i < 12; i++) peaks.push([-1200 + i * 420, 220 + ((i * 53) % 120)]);
  return (
    <g>
      <circle cx="1300" cy="120" r="70" fill="#ffe066" />
      <Cloud x={100} y={110} scale={1.2} />
      <Cloud x={900} y={190} />
      <Cloud x={1800} y={90} scale={1.4} />
      <Cloud x={2700} y={170} />
      {peaks.map(([x, top]) => (
        <g key={x}>
          <path d={`M${x - 300} 700 L${x} ${top} L${x + 300} 700 Z`} fill="#bac8ff" />
          <path
            d={`M${x - 70} ${top + 70} L${x} ${top} L${x + 70} ${top + 70} L${x + 30} ${top + 56} L${x} ${top + 76} L${x - 30} ${top + 56} Z`}
            fill="#fff"
          />
        </g>
      ))}
      <path d="M-1200 690 Q-500 620 200 680 Q900 610 1600 680 Q2300 620 3000 680 Q3700 620 4400 680 V1600 H-1200 Z" fill="#8ce99a" />
    </g>
  );
}
