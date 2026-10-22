import type { CSSProperties } from "react";
import { depthScale, ground, HORIZON } from "./layout";
import type { Season } from "./season";
import { CHEEK, Eye, INK, nth, side } from "./shared";
import type { Scene, SceneItem, SeasonSpot } from "./types";
import "./seasonal.css";

// The seasonal extras of every scene (idea B-18): a pumpkin and fallen leaves in
// autumn, a snowman and snow in winter, a Christmas tree in Advent and a hidden
// egg at Easter. Each scene says where they go (`seasons` in its Scene); the
// drawings stand on their foot point (0, 0), so they can go anywhere.

const LEAF_COLOURS = ["#e76f51", "#f4a261", "#e9c46a", "#d62828", "#bc6c25"];
const LEAF = "M0 -9 C6 -6 7 3 0 9 C-7 3 -6 -6 0 -9 Z";

function Leaf({ x, y, angle, scale, colour }: { x: number; y: number; angle: number; scale: number; colour: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <path d={LEAF} fill={colour} />
      <path d="M0 -7 V8" stroke="#000" strokeOpacity="0.18" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

// ---------- Kürbis ----------

const PILE = [
  [-92, -6, 20, 0],
  [-74, -3, -40, 3],
  [-104, -2, 70, 1],
  [-60, -8, 110, 4],
  [-84, -12, -10, 2],
  [76, -4, 30, 1],
  [96, -3, -60, 3],
];

export function Kuerbis() {
  return (
    <>
      {/* A mouse lives behind the pumpkin and peeks out when it hops. */}
      <g className="sk-mouse">
        <circle cx="42" cy="-80" r="9" fill="#adb5bd" />
        <circle cx="42" cy="-80" r="5" fill="#ffc6d0" />
        <circle cx="64" cy="-80" r="9" fill="#adb5bd" />
        <circle cx="64" cy="-80" r="5" fill="#ffc6d0" />
        <ellipse cx="53" cy="-66" rx="16" ry="14" fill="#ced4da" />
        <Eye cx={47} cy={-68} r={2.6} />
        <Eye cx={59} cy={-68} r={2.6} />
        <circle cx="53" cy="-60" r="3" fill={CHEEK} />
      </g>
      <g className="sk-body" style={{ transformOrigin: "0px 0px" }}>
        <path className="sk-vine" d="M8 -92 C24 -110 44 -100 38 -88 C33 -80 24 -88 32 -94" stroke="#52b788" strokeWidth="3.5" strokeLinecap="round" fill="none" style={{ transformOrigin: "8px -92px" }} />
        <ellipse cx="0" cy="-48" rx="64" ry="48" fill="#f77f00" />
        <ellipse cx="-34" cy="-48" rx="30" ry="46" fill="#f8961e" />
        <ellipse cx="34" cy="-48" rx="30" ry="46" fill="#f3722c" />
        <ellipse cx="0" cy="-48" rx="26" ry="48" fill="#fb8b24" />
        <path d="M-14 -94 Q-20 -48 -14 -2 M14 -94 Q20 -48 14 -2" stroke="#d9620f" strokeWidth="2.5" fill="none" opacity="0.6" />
        <path d="M-50 -76 Q-56 -60 -54 -44" stroke="#fff" strokeOpacity="0.45" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M-6 -92 Q-4 -108 6 -114 L12 -110 Q6 -104 6 -92 Z" fill="#6b4423" />
        <path className="sk-leafy" d="M4 -100 C-14 -116 -34 -108 -36 -96 C-20 -94 -8 -96 4 -100 Z" fill="#40916c" style={{ transformOrigin: "4px -100px" }} />
      </g>
      <g className="sk-pile">
        {PILE.map(([x, y, angle, c], i) => (
          <g key={i} className="sk-leaf" style={{ ...nth(i), ...side(x < 0 ? -1 : 1) }}>
            <Leaf x={x} y={y} angle={angle} scale={1.6} colour={LEAF_COLOURS[c]} />
          </g>
        ))}
      </g>
    </>
  );
}

// ---------- Tannenbaum ----------

/** The tiers of the tree, and their right halves, which are in the shade. */
const TIERS = [
  "M-100 -62 L-22 -176 L22 -176 L100 -62 Q50 -48 0 -56 Q-50 -48 -100 -62 Z",
  "M-80 -140 L-16 -238 L16 -238 L80 -140 Q40 -128 0 -134 Q-40 -128 -80 -140 Z",
  "M-56 -214 L0 -300 L56 -214 Q28 -204 0 -210 Q-28 -204 -56 -214 Z",
];
const SHADES = [
  "M0 -176 L22 -176 L100 -62 Q50 -48 0 -56 Z",
  "M0 -238 L16 -238 L80 -140 Q40 -128 0 -134 Z",
  "M0 -300 L56 -214 Q28 -204 0 -210 Z",
];

const BALLS: [number, number, string][] = [
  [-56, -78, "#e63946"],
  [40, -84, "#4dabf7"],
  [-6, -112, "#ffd60a"],
  [-38, -160, "#4dabf7"],
  [34, -168, "#e63946"],
  [4, -236, "#e63946"],
];

const LIGHTS: [number, number, string][] = [
  [-72, -70, "#ffd60a"],
  [-24, -66, "#ff8fa3"],
  [22, -66, "#69db7c"],
  [70, -72, "#ffd60a"],
  [-50, -146, "#ff8fa3"],
  [-6, -142, "#ffd60a"],
  [50, -148, "#69db7c"],
  [-30, -222, "#ffd60a"],
  [28, -224, "#ff8fa3"],
  [0, -270, "#69db7c"],
];

const STAR = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 ? 11 : 26;
  const a = (i * Math.PI) / 5 - Math.PI / 2;
  return `${(r * Math.cos(a)).toFixed(1)} ${(-314 + r * Math.sin(a)).toFixed(1)}`;
}).join(" L");

export function Tannenbaum() {
  return (
    <>
      <g className="tb-tree" style={{ transformOrigin: "0px -40px" }}>
        <rect x="-12" y="-66" width="24" height="30" fill="#7f5539" />
        {TIERS.map((d, i) => (
          <g key={i}>
            <path d={d} fill={["#2d6a4f", "#40916c", "#52b788"][i]} />
            <path d={SHADES[i]} fill="#1b4332" opacity="0.25" />
          </g>
        ))}
        <path d="M-86 -82 Q0 -100 84 -96 M-66 -158 Q0 -176 64 -170 M-42 -232 Q0 -246 40 -240" stroke="#ffd166" strokeWidth="4" strokeLinecap="round" fill="none" />
        {BALLS.map(([cx, cy, fill], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9" fill={fill} />
            <circle cx={cx - 3} cy={cy - 3} r="3" fill="#fff" opacity="0.6" />
          </g>
        ))}
        {LIGHTS.map(([cx, cy, fill], i) => (
          <g key={i} className="tb-light" style={nth(i)}>
            <circle cx={cx} cy={cy} r="11" fill={fill} opacity="0.35" />
            <circle cx={cx} cy={cy} r="5" fill={fill} />
            <circle cx={cx - 1.5} cy={cy - 1.5} r="1.6" fill="#fff" />
          </g>
        ))}
      </g>
      <g className="tb-shine" style={{ transformOrigin: "0px -314px" }}>
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="0" y1="-350" x2="0" y2="-362" stroke="#ffd60a" strokeWidth="5" strokeLinecap="round" transform={`rotate(${i * 45} 0 -314)`} />
        ))}
      </g>
      <g className="tb-star" style={{ transformOrigin: "0px -314px" }}>
        <path d={`M${STAR} Z`} fill="#ffd60a" stroke="#f4a100" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="-6" cy="-322" r="4" fill="#fff" opacity="0.6" />
      </g>
      {/* Pot and presents. */}
      <path d="M-34 -40 H34 L28 0 H-28 Z" fill="#c1121f" />
      <rect x="-38" y="-46" width="76" height="10" rx="4" fill="#e63946" />
      <rect x="-104" y="-44" width="52" height="44" rx="4" fill="#4dabf7" />
      <rect x="-82" y="-44" width="8" height="44" fill="#ffd60a" />
      <g className="tb-lid" style={{ transformOrigin: "-106px -44px" }}>
        <rect x="-108" y="-54" width="60" height="12" rx="4" fill="#339af0" />
        <rect x="-82" y="-54" width="8" height="12" fill="#ffd60a" />
        <path d="M-78 -54 C-92 -70 -100 -56 -78 -54 C-64 -70 -56 -56 -78 -54 Z" fill="#ffd60a" />
      </g>
      <g className="tb-surprise" style={{ transformOrigin: "-78px -50px" }}>
        <path d={`M${STAR} Z`} fill="#ffd60a" transform="translate(-78 -50) scale(0.5) translate(0 314)" />
      </g>
      <rect x="54" y="-34" width="44" height="34" rx="4" fill="#e63946" />
      <rect x="72" y="-34" width="8" height="34" fill="#fff" />
      <rect x="50" y="-40" width="52" height="9" rx="3" fill="#d62828" />
      <path d="M76 -40 C64 -54 56 -42 76 -40 C88 -54 96 -42 76 -40 Z" fill="#fff" />
    </>
  );
}

// ---------- Schneemann ----------

const FLAKES = [
  [-80, -230],
  [70, -250],
  [-96, -150],
  [92, -120],
  [-60, -60],
  [80, -40],
];

export function Schneemann() {
  return (
    <>
      <ellipse cx="0" cy="-6" rx="70" ry="14" fill="#fff" />
      <g className="sm-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-36 -134 L-84 -168 M-66 -156 L-76 -178 M-66 -156 L-90 -156" stroke="#7f5539" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path className="sm-arm" d="M34 -134 L84 -172 M68 -160 L74 -182 M68 -160 L92 -162" stroke="#7f5539" strokeWidth="5" strokeLinecap="round" fill="none" style={{ transformOrigin: "34px -134px" }} />
        <circle cx="0" cy="-52" r="52" fill="#fff" />
        <path d="M-50 -38 A52 52 0 0 0 50 -38 A60 50 0 0 1 -50 -38 Z" fill="#dbe9fb" />
        <circle cx="0" cy="-130" r="38" fill="#fff" />
        <path d="M-36 -120 A38 38 0 0 0 36 -120 A44 36 0 0 1 -36 -120 Z" fill="#dbe9fb" />
        {[-140, -122, -104].map((cy) => (
          <circle key={cy} cx="0" cy={cy} r="4.5" fill={INK} />
        ))}
        <circle cx="0" cy="-192" r="30" fill="#fff" />
        <path d="M-26 -184 A30 30 0 0 0 26 -184 A34 28 0 0 1 -26 -184 Z" fill="#dbe9fb" />
        <Eye cx={-10} cy={-198} r={4} />
        <Eye cx={10} cy={-198} r={4} />
        <circle cx="-18" cy="-184" r="5" fill={CHEEK} opacity="0.5" />
        <circle cx="18" cy="-184" r="5" fill={CHEEK} opacity="0.5" />
        <path className="sm-nose" d="M0 -194 L30 -188 L0 -184 Z" fill="#f77f00" style={{ transformOrigin: "0px -189px" }} />
        {[-10, -4, 3, 9].map((x, i) => (
          <circle key={x} cx={x} cy={-177 + (i === 0 || i === 3 ? -2 : 0)} r="2.2" fill={INK} />
        ))}
        <g className="sm-scarf" style={{ transformOrigin: "14px -162px" }}>
          <path d="M14 -164 L26 -128 L12 -126 L4 -160 Z" fill="#e63946" />
          <path d="M18 -146 L20 -140 M14 -138 L16 -132" stroke="#fff" strokeWidth="2.5" />
        </g>
        <rect x="-32" y="-168" width="64" height="14" rx="7" fill="#e63946" />
        <path d="M-20 -168 V-154 M-4 -168 V-154 M12 -168 V-154" stroke="#fff" strokeWidth="2.5" />
        <g className="sm-hat" style={{ transformOrigin: "0px -216px" }}>
          <rect x="-34" y="-224" width="68" height="10" rx="5" fill={INK} />
          <rect x="-22" y="-262" width="44" height="40" rx="4" fill={INK} />
          <rect x="-22" y="-234" width="44" height="8" fill="#4dabf7" />
          <rect x="-16" y="-258" width="6" height="22" rx="3" fill="#fff" opacity="0.2" />
        </g>
      </g>
      <g className="sm-flakes" fill="#fff" stroke="#a5d8ff" strokeWidth="1.5">
        {FLAKES.map(([x, y], i) => (
          <circle key={i} className="sm-flake" cx={x} cy={y} r="7" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

// ---------- Osterei ----------

const EGG = "M0 -78 C24 -78 32 -42 30 -28 C28 -10 15 -2 0 -2 C-15 -2 -28 -10 -30 -28 C-32 -42 -24 -78 0 -78 Z";

function Blades({ xs, shade }: { xs: number[]; shade: string }) {
  return (
    <>
      {xs.map((x, i) => (
        <path key={x} d={`M${x - 6} 0 Q${x - 2} ${-24 - (i % 3) * 8} ${x + (i % 2 ? 8 : -6)} ${-36 - (i % 3) * 8} Q${x + 2} -18 ${x + 6} 0 Z`} fill={shade} />
      ))}
    </>
  );
}

export function Osterei() {
  return (
    <>
      <Blades xs={[-34, -16, 14, 34]} shade="#40916c" />
      {/* The Easter bunny is hiding behind the grass and wiggles its ears. */}
      <g className="oe-ears" style={{ transformOrigin: "52px -30px" }}>
        <ellipse cx="44" cy="-46" rx="7" ry="20" fill="#f1f3f5" transform="rotate(-12 44 -46)" />
        <ellipse cx="44" cy="-46" rx="3.5" ry="14" fill="#ffc6d0" transform="rotate(-12 44 -46)" />
        <ellipse cx="60" cy="-44" rx="7" ry="20" fill="#f1f3f5" transform="rotate(14 60 -44)" />
        <ellipse cx="60" cy="-44" rx="3.5" ry="14" fill="#ffc6d0" transform="rotate(14 60 -44)" />
      </g>
      <g className="oe-egg" style={{ transformOrigin: "0px -4px" }}>
        <path d={EGG} fill="#ffadad" />
        <path d="M-29 -40 L-20 -48 L-10 -40 L0 -48 L10 -40 L20 -48 L29 -40" stroke="#fff" strokeWidth="5" strokeLinejoin="round" fill="none" />
        <path d="M-30 -28 H30" stroke="#a0c4ff" strokeWidth="6" />
        {[
          [-10, -62],
          [10, -62],
          [0, -70],
          [-14, -14],
          [14, -14],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3.5" fill={i < 3 ? "#ffd60a" : "#caffbf"} />
        ))}
        <path d="M-16 -68 Q-22 -58 -22 -48" stroke="#fff" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
      <Blades xs={[-28, -8, 6, 24, 42, 56]} shade="#52b788" />
      <g className="oe-sparkles" fill="#ffd60a">
        {[
          [-44, -86],
          [40, -96],
          [-56, -40],
          [60, -70],
        ].map(([x, y], i) => (
          <path key={i} className="oe-spark" d={`M${x} ${y - 10} Q${x} ${y} ${x + 10} ${y} Q${x} ${y} ${x} ${y + 10} Q${x} ${y} ${x - 10} ${y} Q${x} ${y} ${x} ${y - 10} Z`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

// ---------- The extras as items ----------

const at = ([x, y, size = 1]: SeasonSpot) => ground(0, 0, x, y, size);

function pumpkin(spot: SeasonSpot): SceneItem {
  return {
    id: "saison-kuerbis",
    name: "der Kürbis",
    sentences: ["Der Kürbis hüpft! Raschel, raschel!", "Der Kürbis ist dick und rund.", "Hinter dem Kürbis wohnt eine Maus."],
    sound: "boing",
    box: [-110, -116, 220, 116],
    hitAreas: [[-64, -112, 128, 112]],
    place: at(spot),
    shadow: [0, 0, 66],
    durationMs: 2000,
    Art: Kuerbis,
  };
}

function tree(spot: SeasonSpot): SceneItem {
  return {
    id: "saison-tannenbaum",
    name: "der Tannenbaum",
    sentences: ["Der Tannenbaum leuchtet!", "Oben auf dem Baum ist ein Stern.", "Unter dem Baum liegen Geschenke."],
    sound: "twinkle",
    traits: ["green"],
    box: [-108, -342, 216, 342],
    place: at(spot),
    shadow: [0, 0, 100],
    durationMs: 2400,
    Art: Tannenbaum,
  };
}

function snowman(spot: SeasonSpot): SceneItem {
  return {
    id: "saison-schneemann",
    name: "der Schneemann",
    sentences: ["Der Schneemann winkt!", "Der Schneemann hat eine Möhrennase.", "Brrr, ist das kalt!"],
    sound: "whoosh",
    box: [-92, -264, 184, 264],
    hitAreas: [[-70, -264, 140, 264]],
    place: at(spot),
    durationMs: 2400,
    Art: Schneemann,
  };
}

function egg(spot: SeasonSpot): SceneItem {
  return {
    id: "saison-osterei",
    name: "das Osterei",
    sentences: ["Da ist ein Osterei versteckt!", "Das Osterei ist bunt.", "Der Osterhase hat es versteckt."],
    sound: "pop",
    traits: ["small"],
    box: [-44, -80, 108, 80],
    hitAreas: [[-60, -96, 130, 100]],
    place: at(spot),
    durationMs: 2000,
    Art: Osterei,
  };
}

// ---------- Leaves and snow ----------

/** Always the same "random" numbers for a scene, so the leaves don't jump around between visits. */
function random(seed: string) {
  let a = [...seed].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761), 1779033703);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Somewhere on the ground: lower down is nearer, so there are more spots there. */
function onGround(rnd: () => number): [number, number] {
  return [rnd() * 1600, HORIZON + 20 + Math.sqrt(rnd()) * (1000 - HORIZON - 20)];
}

/**
 * With "Bild bewegt sich auch von allein", leaves and flakes in the air fall
 * through the whole picture; the delay puts each one where it is drawn at the start.
 */
function fall(y: number, seconds: number): CSSProperties {
  return {
    "--from": `${-y - 40}px`,
    "--to": `${1040 - y}px`,
    "--fall": `${seconds}s`,
    "--delay": `${(-seconds * (y + 40)) / 1080}s`,
  } as CSSProperties;
}

function FallenLeaves({ seed }: { seed: string }) {
  const rnd = random(`${seed}-leaves`);
  const leaves = Array.from({ length: 70 }, () => {
    const [x, y] = onGround(rnd);
    return { x, y, angle: rnd() * 360, scale: depthScale(y) * (1.4 + rnd()), colour: LEAF_COLOURS[Math.floor(rnd() * 5)] };
  });
  return (
    <g className="season-ground">
      {leaves.map((leaf, i) => (
        <Leaf key={i} {...leaf} />
      ))}
    </g>
  );
}

function Snow({ seed }: { seed: string }) {
  const rnd = random(`${seed}-snow`);
  const patches = Array.from({ length: 34 }, () => {
    const [x, y] = onGround(rnd);
    return { x, y, rx: depthScale(y) * (60 + rnd() * 90) };
  });
  const drift = Array.from({ length: 17 }, (_, i) => `Q${i * 100 + 50} ${955 - rnd() * 30} ${(i + 1) * 100} 975`).join(" ");
  return (
    <g className="season-ground">
      <rect x="0" y={HORIZON - 6} width="1600" height={1006 - HORIZON} fill="#fff" opacity="0.28" />
      {patches.map(({ x, y, rx }, i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={rx} ry={rx * 0.28} fill="#fff" opacity="0.9" />
          <ellipse cx={x + rx * 0.15} cy={y + rx * 0.08} rx={rx * 0.7} ry={rx * 0.14} fill="#dbe9fb" opacity="0.7" />
        </g>
      ))}
      <path d={`M-10 1010 L-10 975 L0 975 ${drift} L1610 975 L1610 1010 Z`} fill="#fff" />
    </g>
  );
}

function FallingLeaves({ seed }: { seed: string }) {
  const rnd = random(`${seed}-falling`);
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const x = rnd() * 1600;
        const y = 60 + rnd() * 760;
        return (
          <g key={i} className="season-fall season-leaf" style={fall(y, 14 + rnd() * 8)}>
            <g className="season-sway" style={nth(i)}>
              <Leaf x={x} y={y} angle={rnd() * 360} scale={1.6 + rnd() * 0.6} colour={LEAF_COLOURS[i % 5]} />
            </g>
          </g>
        );
      })}
    </>
  );
}

function FallingSnow({ seed }: { seed: string }) {
  const rnd = random(`${seed}-flakes`);
  return (
    <>
      {Array.from({ length: 50 }, (_, i) => {
        const y = rnd() * 1000;
        return (
          <g key={i} className="season-fall season-flake" style={fall(y, 10 + rnd() * 8)}>
            <circle cx={rnd() * 1600} cy={y} r={3 + rnd() * 4} fill="#fff" opacity={0.75 + rnd() * 0.25} />
          </g>
        );
      })}
    </>
  );
}

// ---------- Putting it into a scene ----------

/** The scene as it looks in that season: the same picture with a few extras. */
export function withSeason(scene: Scene, season: Season | null): Scene {
  const spots = scene.seasons;
  if (!season || !spots) return scene;
  const extras: SceneItem[] = [];
  if (season === "herbst" && spots.pumpkin) extras.push(pumpkin(spots.pumpkin));
  if (season === "advent" && spots.tree) extras.push(tree(spots.tree));
  if ((season === "winter" || season === "advent") && spots.snowman) extras.push(snowman(spots.snowman));
  if (season === "ostern" && spots.egg) extras.push(egg(spots.egg));

  const weather = !spots.weather ? null : season === "herbst" ? "leaves" : season === "ostern" ? null : "snow";
  const Ground = weather === "leaves" ? FallenLeaves : Snow;
  const Air = weather === "leaves" ? FallingLeaves : FallingSnow;
  const Background = scene.Background;
  return {
    ...scene,
    items: [...scene.items, ...extras],
    Background: weather
      ? () => (
          <>
            <Background />
            <Ground seed={scene.id} />
          </>
        )
      : Background,
    Overlay: weather ? () => <Air seed={scene.id} /> : scene.Overlay,
  };
}
