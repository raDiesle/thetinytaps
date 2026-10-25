import type { ReactNode } from "react";
import { Cloud, INK } from "@/games/scenes/shared";
import { groundY } from "./ground";
import { Balloon, Bread, Fish, Plank, Sunflower, Umbrella } from "./items";
import type { Point, SceneryProps } from "./types";

// "Der Luftballon": from home along the street past the bakery, the fish stall and the flower
// stall, through the park with the duck pond, the bench and the sprinkler, over the hanging bridge,
// past the cat and up the long stairs to the church tower, where a dove holds the balloon. World
// points: the ground is at y = 740, the church square on top at y = 340; the bridge sags a little
// between x 2640 and 3140; the stairs climb from x 3510 to 4240.

export const GROUND_Y = 740;
export const TOP_Y = 340;

/** The lowest point of the hanging bridge, in its middle. */
export const BRIDGE_DIP: Point = [2890, 764];
const BRIDGE_FROM = 2640;
const BRIDGE_TO = 3140;

/** The tread middles of the eight steps up to the church. */
export const STAIRS: Point[] = Array.from({ length: 8 }, (_, i) => [3560 + i * 90, 690 - i * 50]);

/** The ground of the level: the street, the sag of the bridge, the stairs and the church square. */
export const BALLON_GROUND: Point[] = [
  [-3000, GROUND_Y],
  [BRIDGE_FROM, GROUND_Y],
  BRIDGE_DIP,
  [BRIDGE_TO, GROUND_Y],
  [3500, GROUND_Y],
  ...STAIRS,
  [9000, TOP_Y],
];

const ground = (x: number) => groundY(BALLON_GROUND, x);

/** Where the dove keeps the balloon: next to it on the tower, until it gets a sunflower. */
export const DOVE_HOLDS: Point = [4540, 30];

const GRASS = "#69db7c";
const EARTH = "#b08155";
const STREET = "#dee2e6";
const WOOD = "#c08552";
const WOOD_DARK = "#8d5a3b";
const STONE = "#ced4da";

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

function Tree({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x - 14} 740 L${x - 8} 560 H${x + 8} L${x + 14} 740 Z`} fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
      <circle cx={x} cy="500" r="90" fill="#40c057" stroke="#2b8a3e" strokeWidth="4" />
      <circle cx={x - 60} cy="560" r="56" fill="#40c057" stroke="#2b8a3e" strokeWidth="4" />
      <circle cx={x + 60} cy="560" r="60" fill="#40c057" stroke="#2b8a3e" strokeWidth="4" />
    </g>
  );
}

function StreetLamp({ x, y = GROUND_Y }: { x: number; y?: number }) {
  return (
    <g>
      <rect x={x - 6} y={y - 220} width="12" height="220" fill="#495057" />
      <path d={`M${x - 20} ${y - 220} L${x} ${y - 250} L${x + 20} ${y - 220} Z`} fill="#495057" />
      <rect x={x - 14} y={y - 224} width="28" height="8" rx="3" fill="#fff3bf" />
    </g>
  );
}

/** A window with a cross in it. */
function Win({ x, y, w = 56, h = 64 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="5" fill="#a5d8ff" stroke={INK} strokeWidth="4" />
      <path d={`M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}`} stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** Home: a tall town house; two more balloons are tied at the door. */
function Home() {
  return (
    <g>
      <rect x="-520" y="420" width="500" height="320" fill="#fff3bf" stroke={INK} strokeWidth="5" />
      <rect x="-540" y="400" width="540" height="24" fill="#e8590c" stroke={INK} strokeWidth="5" />
      {[-470, -340, -210, -110].map((x) => (
        <Win key={x} x={x} y={470} />
      ))}
      <Win x={-470} y={600} />
      <Win x={-340} y={600} />
      <rect x="-200" y="620" width="80" height="120" rx="6" fill="#40c057" stroke={INK} strokeWidth="5" />

      <rect x="20" y="340" width="400" height="400" fill="#ffc9c9" stroke={INK} strokeWidth="5" />
      <rect x="0" y="318" width="440" height="26" fill="#c92a2a" stroke={INK} strokeWidth="5" />
      {[70, 180, 290].map((x) => (
        <Win key={x} x={x} y={390} />
      ))}
      <Win x={70} y={510} />
      <Win x={290} y={510} />
      <rect x="180" y="600" width="80" height="140" rx="8" fill="#4dabf7" stroke={INK} strokeWidth="5" />
      <circle cx="244" cy="672" r="6" fill="#ffd43b" stroke={INK} strokeWidth="2" />
      <rect x="166" y="736" width="108" height="10" rx="4" fill="#adb5bd" />
      {/* The other two balloons, tied to the door lamp */}
      <path d="M150 610 Q130 540 110 470 M150 610 Q150 520 160 450" stroke={INK} strokeWidth="3" fill="none" />
      <g transform="translate(110 470) rotate(-12) scale(0.55)">
        <Balloon colour="#4dabf7" />
      </g>
      <g transform="translate(160 450) rotate(6) scale(0.55)">
        <Balloon colour="#ffd43b" />
      </g>
      <rect x="140" y="604" width="20" height="26" rx="4" fill="#fff3bf" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** A striped awning over a shop or a stall. */
function Awning({ x, w, y, colour }: { x: number; w: number; y: number; colour: string }) {
  const n = Math.round(w / 40);
  const step = w / n;
  return (
    <g stroke={INK} strokeWidth="4" strokeLinejoin="round">
      {Array.from({ length: n }, (_, i) => (
        <path
          key={i}
          d={`M${x + i * step} ${y} H${x + (i + 1) * step} V${y + 34} Q${x + (i + 0.5) * step} ${y + 52} ${x + i * step} ${y + 34} Z`}
          fill={i % 2 ? "#fff" : colour}
        />
      ))}
    </g>
  );
}

function Bakery({ bread }: { bread: boolean }) {
  return (
    <g>
      <rect x="460" y="420" width="320" height="320" fill="#ffe8cc" stroke={INK} strokeWidth="5" />
      <rect x="450" y="400" width="340" height="24" fill="#a0673a" stroke={INK} strokeWidth="5" />
      <Awning x={470} w={300} y={520} colour="#e03131" />
      {/* The shop window, with loaves inside */}
      <rect x="490" y="600" width="140" height="100" rx="6" fill="#d0ebff" stroke={INK} strokeWidth="4" />
      {[525, 595].map((x) => (
        <g key={x} transform={`translate(${x} 690) scale(0.45)`}>
          <Bread />
        </g>
      ))}
      <rect x="670" y="610" width="80" height="130" rx="6" fill="#a0673a" stroke={INK} strokeWidth="4" />
      {/* A small blue table in front, with the bread on it */}
      <path d="M612 686 V740 M668 686 V740" stroke={INK} strokeWidth="6" />
      <rect x="596" y="676" width="88" height="12" rx="4" fill="#4dabf7" stroke={INK} strokeWidth="4" />
      {bread && (
        <g transform="translate(640 678) scale(0.8)">
          <Bread />
        </g>
      )}
    </g>
  );
}

/** A market stall on four posts: awning on top, a wooden counter. */
function Stall({ x, colour, children }: { x: number; colour: string; children?: ReactNode }) {
  return (
    <g>
      <rect x={x} y="540" width="200" height="200" fill="#fff9db" />
      {[x + 6, x + 194].map((px) => (
        <rect key={px} x={px - 6} y="530" width="12" height="210" fill={WOOD_DARK} stroke={INK} strokeWidth="3" />
      ))}
      <Awning x={x - 10} w={220} y={500} colour={colour} />
      {children}
      <rect x={x} y="660" width="200" height="80" fill={WOOD} stroke={INK} strokeWidth="4" />
      <path d={`M${x + 50} 664 V736 M${x + 100} 664 V736 M${x + 150} 664 V736`} stroke={WOOD_DARK} strokeWidth="3" />
    </g>
  );
}

function FishStall({ fish }: { fish: boolean }) {
  return (
    <Stall x={830} colour="#1c7ed6">
      {/* Ice on the counter, with more fish in the back */}
      <rect x="836" y="644" width="188" height="18" rx="6" fill="#e7f5ff" stroke={INK} strokeWidth="3" />
      {[870, 990].map((x) => (
        <g key={x} transform={`translate(${x} 650) scale(0.55)`}>
          <Fish colour="#91a7ff" />
        </g>
      ))}
      {fish && (
        <g transform="translate(940 654) scale(0.8)">
          <Fish />
        </g>
      )}
    </Stall>
  );
}

function FlowerStall({ sunflower }: { sunflower: boolean }) {
  return (
    <g>
      <Stall x={1070} colour="#2f9e44">
        {[1110, 1160].map((x, i) => (
          <g key={x}>
            {[-12, 0, 12].map((d) => (
              <Flower key={d} x={x + d} y={660 - Math.abs(d)} colour={["#ff8fa3", "#cc5de8"][i]} />
            ))}
          </g>
        ))}
      </Stall>
      {/* The bucket in front, with the sunflower */}
      {sunflower && (
        <g transform="translate(1210 704) scale(0.8)">
          <Sunflower />
        </g>
      )}
      <path d="M1186 696 H1234 L1228 740 H1192 Z" fill="#adb5bd" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    </g>
  );
}

/** A duck standing on (0, 0), looking left. */
function Duck({ x, s, body, beak }: { x: number; s: number; body: string; beak: string }) {
  return (
    <g transform={`translate(${x} 0) scale(${s})`}>
      <path d="M-6 0 V-14 M12 0 V-14" stroke={beak} strokeWidth="6" strokeLinecap="round" />
      <path d="M-30 -40 Q-30 -10 6 -10 Q46 -10 52 -44 Q40 -36 30 -40 Q20 -60 -10 -56 Z" fill={body} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M0 -44 Q20 -50 30 -34" stroke={INK} strokeWidth="3" fill="none" />
      <g className="tl-ballon-duck-head">
        <circle cx="-30" cy="-66" r="20" fill={body} stroke={INK} strokeWidth="4" />
        <path d="M-48 -66 L-70 -60 Q-66 -52 -46 -56 Z" fill={beak} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="-36" cy="-72" r="3.5" fill={INK} />
      </g>
    </g>
  );
}

function Ducks({ done, here, nope }: SceneryProps) {
  const solved = done.includes("ducks");
  return (
    <g>
      {/* The pond behind the path */}
      <ellipse cx="1730" cy="714" rx="134" ry="24" fill="#4dabf7" stroke="#1c7ed6" strokeWidth="4" />
      {[1606, 1620, 1848].map((x, i) => (
        <path key={x} d={`M${x} 718 Q${x - 4} ${680 - i * 8} ${x + 4} ${666 - i * 6}`} stroke="#2f9e44" strokeWidth="5" fill="none" strokeLinecap="round" />
      ))}
      {solved &&
        [
          [1690, 712],
          [1770, 716],
          [1740, 706],
        ].map(([x, y]) => <ellipse key={x} cx={x} cy={y} rx="8" ry="5" fill="#e8a35c" stroke={INK} strokeWidth="2" />)}
      <g transform="translate(1560 740)">
        <g className={`tl-ballon-ducks${solved ? " done" : ""}`}>
          <Nope id="ducks" nope={nope}>
            <g className={here === "ducks" && !solved ? "tl-meet" : undefined}>
              <Duck x={0} s={1.5} body="#fff" beak="#ff922b" />
              <Duck x={96} s={0.75} body="#ffd43b" beak="#ff922b" />
              <Duck x={156} s={0.75} body="#ffd43b" beak="#ff922b" />
            </g>
          </Nope>
        </g>
      </g>
    </g>
  );
}

function Bench({ umbrella }: { umbrella: boolean }) {
  return (
    <g>
      <path d="M1880 690 V740 M2000 690 V740" stroke={INK} strokeWidth="7" />
      <rect x="1866" y="682" width="148" height="14" rx="4" fill={WOOD} stroke={INK} strokeWidth="4" />
      <path d="M1886 682 V630 M1994 682 V630" stroke={INK} strokeWidth="6" />
      <rect x="1870" y="626" width="140" height="14" rx="4" fill={WOOD} stroke={INK} strokeWidth="4" />
      <rect x="1870" y="650" width="140" height="14" rx="4" fill={WOOD} stroke={INK} strokeWidth="4" />
      {umbrella && (
        <g transform="translate(1906 740) rotate(16) scale(0.62)">
          <Umbrella />
        </g>
      )}
    </g>
  );
}

/** The water arcs of the sprinkler, from its nozzle across the path. */
const SPRAY = ["M2172 704 Q2240 520 2330 744", "M2172 704 Q2220 590 2290 744", "M2172 704 Q2270 470 2380 744"];
/** With the umbrella over the path, the water lands on it and splashes off. */
const SPRAY_BLOCKED = ["M2172 704 Q2210 470 2276 584", "M2172 704 Q2230 440 2312 576", "M2172 704 Q2200 520 2248 612"];

function Sprinkler({ done, here, nope }: SceneryProps) {
  const solved = done.includes("sprinkler");
  return (
    <g>
      <Nope id="sprinkler" nope={nope}>
        <g className={`tl-ballon-spray${here === "sprinkler" ? " on" : ""}`}>
          {(solved ? SPRAY_BLOCKED : SPRAY).map((d) => (
            <path key={d} d={d} stroke="#74c0fc" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="16 12" />
          ))}
        </g>
        {!solved &&
          [2290, 2330, 2380].map((x) => (
            <g key={x}>
              <circle cx={x - 10} cy="736" r="5" fill="#74c0fc" />
              <circle cx={x + 10} cy="734" r="4" fill="#74c0fc" />
            </g>
          ))}
        <g className={here === "sprinkler" && !solved ? "tl-meet" : undefined}>
          <rect x="2150" y="726" width="44" height="14" rx="5" fill="#fcc419" stroke={INK} strokeWidth="4" />
          <rect x="2164" y="700" width="16" height="30" rx="4" fill="#fcc419" stroke={INK} strokeWidth="4" />
          <path d="M2150 734 Q2100 744 2060 736" stroke="#37b24d" strokeWidth="7" fill="none" />
        </g>
      </Nope>
      {solved && (
        <g transform="translate(2300 742)">
          <g className="tl-plank-laid">
            <Umbrella />
          </g>
          {[
            [10, -196],
            [40, -186],
            [74, -160],
            [84, -134],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="5" fill="#74c0fc" />
          ))}
        </g>
      )}
    </g>
  );
}

function WoodPile({ plank }: { plank: boolean }) {
  return (
    <g>
      {[2390, 2490].map((x) => (
        <g key={x}>
          <circle cx={x} cy="722" r="18" fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
          <circle cx={x} cy="722" r="8" fill="#e0a96d" />
        </g>
      ))}
      {plank && (
        <g transform="translate(2440 706)">
          <Plank />
        </g>
      )}
    </g>
  );
}

/** The boards of the bridge deck, on the sagging ground, with a gap in the middle until the plank is there. */
function Bridge({ done, nope }: SceneryProps) {
  const mended = done.includes("bridge");
  const boards = [];
  for (let x = BRIDGE_FROM + 10; x < BRIDGE_TO; x += 40) if (x < 2790 || x > 2980) boards.push(x);
  return (
    <g>
      {/* The gorge with the river far below */}
      <path d={`M${BRIDGE_FROM} 740 L${BRIDGE_FROM + 40} 1100 H${BRIDGE_TO - 40} L${BRIDGE_TO} 740 Z`} fill="#5c3b1e" />
      <rect x={BRIDGE_FROM + 30} y="860" width={BRIDGE_TO - BRIDGE_FROM - 60} height="240" fill="#4dabf7" />
      <path d="M2690 876 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#d0ebff" strokeWidth="5" fill="none" />
      <Nope id="bridge" nope={nope}>
        {[BRIDGE_FROM - 10, BRIDGE_TO + 10].map((x) => (
          <rect key={x} x={x - 9} y="590" width="18" height="160" rx="4" fill={WOOD} stroke={INK} strokeWidth="4" />
        ))}
        <path d={`M${BRIDGE_FROM - 10} 600 Q${BRIDGE_DIP[0]} 700 ${BRIDGE_TO + 10} 600`} stroke={WOOD_DARK} strokeWidth="6" fill="none" />
        {Array.from({ length: 11 }, (_, i) => {
          const x = BRIDGE_FROM + 20 + i * 46;
          const t = (x - BRIDGE_FROM + 10) / (BRIDGE_TO - BRIDGE_FROM + 20);
          const top = 600 + 2 * t * (1 - t) * 100;
          return <path key={x} d={`M${x} ${top} V${ground(x)}`} stroke={WOOD_DARK} strokeWidth="3" />;
        })}
        {boards.map((x) => (
          <rect key={x} x={x - 17} y={ground(x) - 2} width="34" height="16" rx="3" fill="#e0a96d" stroke={INK} strokeWidth="3" />
        ))}
        {mended && (
          <g transform={`translate(${BRIDGE_DIP[0]} ${BRIDGE_DIP[1] + 22})`}>
            <g className="tl-plank-laid">
              <Plank />
            </g>
          </g>
        )}
      </Nope>
    </g>
  );
}

function Cat({ done, here, nope }: SceneryProps) {
  const solved = done.includes("cat");
  return (
    <g>
      {/* A low stone wall the cat jumps onto */}
      <rect x="3300" y="660" width="190" height="80" fill={STONE} stroke={INK} strokeWidth="4" />
      <path d="M3300 700 H3490 M3360 660 V700 M3430 660 V700 M3330 700 V740 M3400 700 V740 M3460 700 V740" stroke="#868e96" strokeWidth="3" />
      <g transform="translate(3390 740)">
        <g className={`tl-ballon-cat${solved ? " done" : ""}`}>
          <Nope id="cat" nope={nope}>
            <g className={here === "cat" && !solved ? "tl-meet" : undefined}>
              <path className="tl-ballon-cat-tail" d="M40 -14 Q80 -10 76 -50" stroke="#e8590c" strokeWidth="12" strokeLinecap="round" fill="none" />
              <ellipse cx="6" cy="-22" rx="46" ry="22" fill="#ffa94d" stroke={INK} strokeWidth="4" />
              <path d="M-14 -38 V-10 M14 -40 V-12" stroke="#e8590c" strokeWidth="5" />
              <circle cx="-42" cy="-40" r="24" fill="#ffa94d" stroke={INK} strokeWidth="4" />
              <path d="M-62 -54 L-60 -78 L-44 -62 Z M-36 -64 L-24 -80 L-22 -56 Z" fill="#ffa94d" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
              <circle cx="-52" cy="-44" r="3.5" fill={INK} />
              <circle cx="-36" cy="-44" r="3.5" fill={INK} />
              <path d="M-48 -34 q4 4 8 0" stroke={INK} strokeWidth="2.5" fill="none" />
              <path d="M-60 -34 H-80 M-60 -30 L-78 -24 M-30 -34 H-12 M-30 -30 L-14 -24" stroke={INK} strokeWidth="2" />
              {solved && (
                <g transform="translate(-74 -18) scale(0.5)">
                  <g className="tl-chew">
                    <Fish />
                  </g>
                </g>
              )}
            </g>
          </Nope>
        </g>
      </g>
    </g>
  );
}

function Stairs() {
  return (
    <g>
      <path d={`M3470 740 C3560 540 3900 ${TOP_Y} 4240 ${TOP_Y} H9600 V2600 H3470 Z`} fill="#8ce99a" stroke="#2b8a3e" strokeWidth="5" />
      <rect x="4200" y={TOP_Y - 4} width="5400" height="20" fill={STREET} />
      {STAIRS.map(([x, y], i) => (
        <rect key={i} x={x - 46} y={y} width="96" height={GROUND_Y - y} fill={STONE} stroke="#868e96" strokeWidth="4" />
      ))}
    </g>
  );
}

/** The church on the hill; the dove sits on a ledge of its tower and holds the balloon's string. */
function Church({ done, here, nope }: SceneryProps) {
  const solved = done.includes("dove");
  return (
    <g>
      <rect x="4740" y="60" width="420" height={TOP_Y - 60} fill="#fff3bf" stroke={INK} strokeWidth="5" />
      <path d="M4720 70 L4950 -90 L5180 70 Z" fill="#c92a2a" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M4900 340 V240 Q4900 190 4950 190 Q5000 190 5000 240 V340 Z" fill={WOOD} stroke={INK} strokeWidth="5" />
      {[4800, 5060].map((x) => (
        <path key={x} d={`M${x} 250 V170 Q${x} 140 ${x + 25} 140 Q${x + 50} 140 ${x + 50} 170 V250 Z`} fill="#a5d8ff" stroke={INK} strokeWidth="4" />
      ))}
      {/* The tower */}
      <rect x="4600" y="-240" width="140" height={TOP_Y + 240} fill="#ffe8cc" stroke={INK} strokeWidth="5" />
      <path d="M4586 -236 L4670 -420 L4754 -236 Z" fill="#2f9e44" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <circle cx="4670" cy="-150" r="42" fill="#fff" stroke={INK} strokeWidth="5" />
      <path d="M4670 -150 V-180 M4670 -150 H4694" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M4640 40 V-30 Q4640 -60 4670 -60 Q4700 -60 4700 -30 V40 Z" fill="#495057" stroke={INK} strokeWidth="4" />
      <rect x="4570" y="190" width="200" height="16" rx="4" fill={STONE} stroke={INK} strokeWidth="4" />
      {solved && (
        <g transform="translate(4634 196) rotate(-80) scale(0.55)">
          <Sunflower />
        </g>
      )}
      {/* The dove, looking left; its string goes to the balloon until it lets go */}
      {!solved && <path d={`M4568 156 Q4540 100 ${DOVE_HOLDS[0]} ${DOVE_HOLDS[1]}`} stroke={INK} strokeWidth="3" fill="none" />}
      <g transform="translate(4610 190)">
        <Nope id="dove" nope={nope}>
          <g className={`tl-ballon-dove${here === "dove" && !solved ? " tl-meet" : ""}${solved ? " done" : ""}`}>
            <path d="M20 -24 L56 -14 L52 -4 L18 -12 Z" fill="#868e96" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <ellipse cx="6" cy="-20" rx="30" ry="18" fill="#adb5bd" stroke={INK} strokeWidth="3.5" />
            <path d="M0 -26 Q20 -30 30 -18 Q14 -12 0 -26 Z" fill="#868e96" stroke={INK} strokeWidth="3" />
            <g className="tl-ballon-dove-head">
              <circle cx="-18" cy="-36" r="15" fill="#adb5bd" stroke={INK} strokeWidth="3.5" />
              <path d="M-26 -26 Q-18 -18 -8 -24" stroke="#63e6be" strokeWidth="5" fill="none" />
              <path d="M-32 -36 L-44 -32 L-32 -30 Z" fill="#ffa94d" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
              <circle cx="-22" cy="-40" r="3" fill={INK} />
            </g>
            <path d="M-2 -2 V4 M10 -2 V4" stroke="#e8590c" strokeWidth="4" strokeLinecap="round" />
          </g>
        </Nope>
      </g>
    </g>
  );
}

/** The world of "Der Luftballon", drawn as far as the child has come. */
export function BallonScenery(props: SceneryProps) {
  const { done } = props;
  return (
    <g>
      <rect x="-1200" y={GROUND_Y} width="4800" height="2000" fill={EARTH} />
      <rect x="-1200" y={GROUND_Y - 4} width="2520" height="24" fill={STREET} />
      <rect x="1320" y={GROUND_Y - 4} width="2280" height="22" fill={GRASS} />
      <rect x="3140" y={GROUND_Y - 4} width="460" height="24" fill={STREET} />
      <Home />
      {[440, 1290].map((x) => (
        <StreetLamp key={x} x={x} />
      ))}
      <Bakery bread={!done.includes("bread")} />
      <FishStall fish={!done.includes("fish")} />
      <FlowerStall sunflower={!done.includes("sunflower")} />
      <Tree x={1420} />
      <Tree x={2090} />
      <Tree x={2560} />
      {[1350, 1960, 2040, 2420, 2520].map((x, i) => (
        <Flower key={x} x={x} colour={["#ff8fa3", "#ffd43b", "#cc5de8", "#fff"][i % 4]} />
      ))}
      <Ducks {...props} />
      <Bench umbrella={!done.includes("umbrella")} />
      <Sprinkler {...props} />
      <WoodPile plank={!done.includes("plank")} />
      <Bridge {...props} />
      <Cat {...props} />
      <Stairs />
      <StreetLamp x={4300} y={TOP_Y} />
      {[4440, 5240, 5400].map((x, i) => (
        <Flower key={x} x={x} y={TOP_Y} colour={["#ff8fa3", "#cc5de8", "#ffd43b"][i]} />
      ))}
      <Church {...props} />
    </g>
  );
}

/** The roofs of the town far away, clouds and the sun; drawn at a third of the world's speed. */
export function BallonBackdrop() {
  const roofs: [number, number, number][] = [];
  for (let i = 0; i < 26; i++) roofs.push([-1200 + i * 170, 120 + ((i * 37) % 70), 150]);
  return (
    <g>
      <circle cx="1300" cy="120" r="70" fill="#ffe066" />
      <Cloud x={100} y={120} scale={1.2} />
      <Cloud x={900} y={200} />
      <Cloud x={1700} y={90} scale={1.4} />
      <Cloud x={2500} y={180} />
      {roofs.map(([x, h, w], i) => (
        <g key={x} fill={i % 2 ? "#d0bfff" : "#bac8ff"}>
          <rect x={x} y={640 - h} width={w} height={h + 1000} />
          <path d={`M${x - 10} ${640 - h} L${x + w / 2} ${580 - h} L${x + w + 10} ${640 - h} Z`} />
        </g>
      ))}
      <path d="M2000 470 L2030 330 L2060 470 Z" fill="#b197fc" />
      <path d="M-1200 690 Q-500 640 200 690 Q900 640 1600 690 Q2300 640 3000 690 V1600 H-1200 Z" fill="#b2f2bb" />
    </g>
  );
}
