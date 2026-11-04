import type { ReactNode } from "react";
import { INK } from "@/games/scenes/shared";
import { playMunch } from "@/lib/realSounds";
import { playChime, playClonk, playCrackle, playDing, playPlop, playPop, playRustle, playThump, playWhoosh, playYum } from "@/lib/sfx";
import { BROTHER, Kid, type Look, type Pose, useHero } from "../kid";
import type { Picture } from "../trail/items";
import type { Cue, Point } from "../trail/types";
import { Go, route } from "./move";
import { Grownup } from "./people";
import { Outdoors, RoundTree } from "./places";
import { type Film, GROUND, type Scene, type SceneProps } from "./types";

// „Beim Bäcker“ (G-25, a film of something being made): the child and Mama or Papa go to the bakery, the baker – a
// bear – asks them in, and the child picks what to bake (rolls, a pretzel or a cake). In the bakehouse the flour goes
// into the bowl, the dough is kneaded, rests under a cloth and grows, and gets its shape; in the oven it turns golden
// brown until the bell rings; at home the table is laid and everybody eats together. A calm film: soft sounds, no
// hurry, the oven's warmth shown by its glow and a puff of steam rather than by noise.

/** What the child can bake. */
export type Bake = "broetchen" | "brezel" | "kuchen";

const FAR = 2400;

const PARENT: Look = { shirt: "#20c997", pants: "#495057", hair: "#8d5a3b" };
/** The baker is a bear in a white jacket and a baker's hat (a grown-up in a role, so one of the app's mascots). */
const BAKER: Look = { shirt: "#f8f9fa", pants: "#868e96", hair: "#8d5a3b", animal: "bear" };

/** The child, in its own clothes; in the bakehouse with a baker's hat like the baker's. */
function Child({ pose, face = 1, chef = false }: { pose: Pose; face?: 1 | -1; chef?: boolean }) {
  const hero = useHero();
  return <Kid look={hero} pose={pose} holding={null} wear={chef ? ["chef"] : []} face={face} />;
}

/** Something that pops in when it appears, after `delay` seconds of the film's pace. */
function Pop({ delay = 0, children }: { delay?: number; children: ReactNode }) {
  return (
    <g className="fm-pop" style={delay ? { animationDelay: `calc(${delay}s * var(--fm-pace))` } : undefined}>
      {children}
    </g>
  );
}

// ---------- What is baked ----------

/** The colours of the dough before the oven, and of the crust after it. */
const RAW = { fill: "#f8e3c0", line: "#d9b98a", shine: "#fff4e0" };
const BAKED = { fill: "#d9822b", line: "#8a4b14", shine: "#f4b860" };

/** One roll standing on (0, 0), with its cut across the top. */
function Roll({ c }: { c: typeof RAW }) {
  return (
    <g>
      <ellipse cx="0" cy="-30" rx="46" ry="31" fill={c.fill} stroke={INK} strokeWidth="4" />
      <path d="M-26 -42 Q-8 -54 22 -46" stroke={c.shine} strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M-18 -50 Q2 -40 20 -52" stroke={c.line} strokeWidth="5" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** The pretzel's loops, centred on (0, -70); `half` is what is left of it once eaten. */
const PRETZEL = "M-50 30 C-84 0 -62 -52 -20 -46 C10 -42 16 -10 0 16 C-16 -10 -10 -42 20 -46 C62 -52 84 0 50 30 C30 46 -30 46 -50 30";
const PRETZEL_HALF = "M-50 30 C-84 0 -62 -52 -20 -46 C10 -42 16 -10 0 16 M-50 30 C-40 40 -24 44 -8 44";

/** A pretzel standing on (0, 0): its dough as a thick rope, a darker line round it, salt on the crust. */
function Pretzel({ c, half = false, salt = true }: { c: typeof RAW; half?: boolean; salt?: boolean }) {
  const d = half ? PRETZEL_HALF : PRETZEL;
  return (
    <g transform="translate(0 -62) scale(1.4)">
      <path d={d} fill="none" stroke={INK} strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={c.fill} strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-62 -6 Q-56 -36 -26 -38" fill="none" stroke={c.shine} strokeWidth="5" strokeLinecap="round" />
      {salt && (
        <g fill="#fff">
          {(
            [
              [-60, 10],
              [-38, -44],
              [-6, -18],
              [32, -46],
              [62, 4],
              [-20, 42],
              [24, 42],
            ] as const
          )
            .filter(([x]) => !half || x < 0)
            .map(([x, y]) => (
              <rect key={`${x}${y}`} x={x - 3} y={y - 3} width="6" height="6" rx="1" />
            ))}
        </g>
      )}
    </g>
  );
}

/** A round cake in its tin, standing on (0, 0): batter level with the rim before the oven, a golden dome after it,
 * and cherries on top either way. */
function Cake({ c, risen, tin = true }: { c: typeof RAW; risen: boolean; tin?: boolean }) {
  const top = risen ? -112 : -84;
  return (
    <g>
      <path d={`M-110 -80 Q-112 ${top - 28} 0 ${top - 34} Q112 ${top - 28} 110 -80 Z`} fill={c.fill} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d={`M-70 ${top - 18} Q-20 ${top - 34} 40 ${top - 26}`} stroke={c.shine} strokeWidth="8" strokeLinecap="round" fill="none" />
      {[-60, 0, 60].map((x, i) => (
        <g key={x} transform={`translate(${x} ${top - 22 - (i === 1 ? 8 : 0)})`}>
          <path d="M0 -10 Q6 -30 18 -36" stroke="#2f9e44" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle r="13" fill="#e03131" stroke={INK} strokeWidth="3" />
          <circle cx="-4" cy="-4" r="4" fill="#ffa8a8" />
        </g>
      ))}
      {tin ? (
        <g>
          {/* The tin */}
          <path d="M-116 -84 H116 L110 0 H-110 Z" fill="#adb5bd" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M-112 -60 H112 M-110 -30 H110" stroke="#868e96" strokeWidth="3" />
          <path d="M-100 -76 Q-104 -40 -98 -8" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6" />
        </g>
      ) : (
        <g>
          {/* Out of the tin: its golden side */}
          <path d="M-110 -84 H110 V0 H-110 Z" fill={c.fill} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M-96 -70 Q-100 -40 -94 -12" stroke={c.shine} strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>
      )}
    </g>
  );
}

/** One slice of the cake standing on (0, 0): what is left once it is eaten. */
function CakeSlice() {
  return (
    <g>
      <path d="M-70 0 H70 V-74 L-70 -54 Z" fill="#ffe8a3" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-70 -54 L70 -74" stroke={BAKED.fill} strokeWidth="12" strokeLinecap="round" />
      <g fill="#e03131" opacity="0.7">
        <circle cx="-30" cy="-24" r="7" />
        <circle cx="26" cy="-36" r="6" />
      </g>
      <g transform="translate(40 -84)">
        <circle r="12" fill="#e03131" stroke={INK} strokeWidth="3" />
      </g>
    </g>
  );
}

/** What is baked, standing on (0, 0), at most 300 wide: raw dough, or with its crust once `baked`, or what is left
 * after eating (`eaten`); the cake stands in its tin until it is on the table at home (`tin`). */
function Goods({ bake, baked, eaten = false, tin = true }: { bake: Bake; baked: boolean; eaten?: boolean; tin?: boolean }) {
  const c = baked ? BAKED : RAW;
  if (bake === "broetchen")
    return (
      <g>
        {(eaten ? [0] : [-96, 0, 96]).map((x) => (
          <g key={x} transform={`translate(${x} 0)`}>
            <Roll c={c} />
          </g>
        ))}
      </g>
    );
  if (bake === "brezel") return <Pretzel c={c} half={eaten} salt={baked} />;
  return eaten ? <CakeSlice /> : <Cake c={c} risen={baked} tin={tin} />;
}

/** The goods, raw, with their crust laid over them that fades in while they bake: so they turn brown in the oven. */
function Browning({ bake, baked }: { bake: Bake; baked: boolean }) {
  return (
    <g>
      <Goods bake={bake} baked={false} />
      <g className="fm-bk-brown" style={{ opacity: baked ? 1 : 0 }}>
        <Goods bake={bake} baked />
      </g>
    </g>
  );
}

/** A dark baking tray, its top at (0, 0), 360 wide. */
function Tray() {
  return (
    <g>
      <rect x="-180" y="0" width="360" height="16" rx="5" fill="#495057" stroke={INK} strokeWidth="3" />
      <path d="M-170 4 H170" stroke="#868e96" strokeWidth="3" />
    </g>
  );
}

/** Puffs of warm steam rising slowly from (0, 0), once. */
function Steam() {
  return (
    <g fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity="0.9">
      {[-80, 0, 80].map((x, i) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <path className="fm-bk-steam" style={{ animationDelay: `calc(${1.6 + i * 0.5}s * var(--fm-pace))` }} d="M0 0 Q-16 -30 0 -60 Q16 -90 0 -120" />
        </g>
      ))}
    </g>
  );
}

// ---------- Small pictures: the strip of scenes and the choice ----------

/** A picture for the strip or a sign, drawn centred and lifted so it stands on (0, 0) like the other pictures. */
const pic = (w: number, h: number, draw: () => ReactNode): Picture => ({ w, h, draw: () => <g transform={`translate(0 ${-h / 2})`}>{draw()}</g> });

/** The goods alone, baked, for the strip. */
const goodsIcon = (bake: Bake): Picture =>
  pic(320, 220, () => (
    <g transform="translate(0 80)">
      <Goods bake={bake} baked />
    </g>
  ));
const BAKE_ICON: Record<Bake, Picture> = { broetchen: goodsIcon("broetchen"), brezel: goodsIcon("brezel"), kuchen: goodsIcon("kuchen") };

/** A choice's card: a close-up of the baked goods on their tray on the floury table, as they will come out of the
 * oven, warm. */
const bakeCard = (bake: Bake): Picture =>
  pic(420, 320, () => (
    <g>
      <rect x="-210" y="-160" width="420" height="320" fill="#e8b678" />
      <path d="M-210 -80 H210 M-210 40 H210" stroke="#c08552" strokeWidth="4" />
      <g fill="#fff" opacity="0.7">
        <circle cx="-150" cy="110" r="6" />
        <circle cx="-120" cy="124" r="4" />
        <circle cx="150" cy="-110" r="5" />
        <circle cx="170" cy="120" r="4" />
      </g>
      <g transform="translate(0 70)">
        <Tray />
        <Goods bake={bake} baked />
      </g>
      <g fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity="0.8">
        <path d="M-60 -70 Q-74 -96 -60 -122" />
        <path d="M60 -70 Q46 -96 60 -122" />
      </g>
    </g>
  ));
const BAKE_CARD: Record<Bake, Picture> = { broetchen: bakeCard("broetchen"), brezel: bakeCard("brezel"), kuchen: bakeCard("kuchen") };

const BAKE_SAY: Record<Bake, string> = {
  broetchen: "Brötchen!",
  brezel: "Eine Brezel!",
  kuchen: "Einen Kuchen!",
};
/** Each option's sound as its card comes out. */
const BAKE_SOUND: Record<Bake, Cue[]> = {
  broetchen: [[0, playPlop]],
  brezel: [[0, playRustle]],
  kuchen: [[0, playChime]],
};

const SHOP_ICON = pic(300, 260, () => (
  <g>
    <path d="M-130 -60 L0 -130 L130 -60 Z" fill="#e8590c" stroke={INK} strokeWidth="8" strokeLinejoin="round" />
    <rect x="-120" y="-60" width="240" height="190" fill="#ffd8a8" stroke={INK} strokeWidth="8" />
    <rect x="-90" y="20" width="60" height="110" rx="6" fill="#a0522d" stroke={INK} strokeWidth="6" />
    <rect x="0" y="10" width="100" height="70" rx="6" fill="#fff9db" stroke={INK} strokeWidth="6" />
    <g transform="translate(-10 -20) scale(0.5)">
      <Pretzel c={BAKED} salt={false} />
    </g>
  </g>
));
const BOWL_ICON = pic(300, 200, () => (
  <g>
    <path d="M-140 -40 Q-130 90 0 96 Q130 90 140 -40 Z" fill="#4dabf7" stroke={INK} strokeWidth="8" strokeLinejoin="round" />
    <ellipse cx="0" cy="-40" rx="140" ry="34" fill="#1c7ed6" stroke={INK} strokeWidth="8" />
    <path d="M-90 -36 Q0 -110 90 -36 Z" fill="#fff" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
  </g>
));
const OVEN_ICON = pic(300, 280, () => (
  <g>
    <path d="M-130 130 V-60 Q-130 -130 0 -130 Q130 -130 130 -60 V130 Z" fill="#c92a2a" stroke={INK} strokeWidth="8" strokeLinejoin="round" />
    <rect x="-90" y="-20" width="180" height="120" rx="12" fill="#495057" stroke={INK} strokeWidth="7" />
    <rect x="-70" y="0" width="140" height="80" rx="8" fill="#ffa94d" />
  </g>
));
const TABLE_ICON = pic(320, 200, () => (
  <g>
    <rect x="-150" y="0" width="300" height="24" rx="5" fill="#a0522d" stroke={INK} strokeWidth="7" />
    <rect x="-130" y="24" width="18" height="80" fill="#8d5a3b" />
    <rect x="112" y="24" width="18" height="80" fill="#8d5a3b" />
    <ellipse cx="-80" cy="-6" rx="50" ry="12" fill="#fff" stroke={INK} strokeWidth="5" />
    <ellipse cx="80" cy="-6" rx="50" ry="12" fill="#fff" stroke={INK} strokeWidth="5" />
    <rect x="-20" y="-60" width="40" height="54" rx="8" fill="#74c0fc" stroke={INK} strokeWidth="5" />
  </g>
));

// ---------- In front of the bakery: what do we bake? ----------

const SHOP = { left: 420, right: 1300, top: GROUND - 500 };
const DOOR_X = 560;
const DOOR = { w: 130, h: 220 };
/** The shop window, with the goods on show in it. */
const WINDOW = { left: 740, right: 1240, top: 470, bottom: 700 };
/** Where each of the goods stands in the window: what the child taps to pick it. */
const IN_WINDOW: Record<Bake, Point> = { broetchen: [845, 660], brezel: [990, 650], kuchen: [1135, 662] };
const KID_SHOP = 450;
const PARENT_SHOP = 290;

/** The bakery's front: a house with a roof, a shop window under a striped awning, the door with its bell, and the
 * golden pretzel hanging as its sign. */
function Bakery({ open }: { open: boolean }) {
  const { left, right, top } = SHOP;
  const w = right - left;
  const mid = (left + right) / 2;
  return (
    <g>
      {/* Chimney and roof */}
      <rect x={right - 230} y={top - 150} width="54" height="120" fill="#c2410c" stroke={INK} strokeWidth="3" />
      <rect x={right - 236} y={top - 158} width="66" height="14" fill="#a5a5a5" stroke={INK} strokeWidth="3" />
      <path d={`M${left - 24} ${top} L${mid} ${top - 140} L${right + 24} ${top} Z`} fill="#e8590c" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d={`M${left + 160} ${top - 50} H${right - 160} M${left + 60} ${top - 18} H${right - 60}`} stroke={INK} strokeOpacity="0.25" strokeWidth="3" />
      {/* The wall */}
      <rect x={left} y={top} width={w} height={GROUND - top} fill="#ffd8a8" stroke={INK} strokeWidth="4" />
      <path d={`M${left} ${GROUND - 14} H${right}`} stroke={INK} strokeOpacity="0.15" strokeWidth="24" />
      {/* The windows upstairs, with flower boxes */}
      {[560, 860, 1160].map((x) => (
        <g key={x}>
          <rect x={x - 44} y={top + 30} width="88" height="80" rx="6" fill="#fff3bf" stroke={INK} strokeWidth="3" />
          <path d={`M${x} ${top + 30} V${top + 110} M${x - 44} ${top + 66} H${x + 44}`} stroke={INK} strokeWidth="2.5" />
          <rect x={x - 52} y={top + 110} width="104" height="18" rx="4" fill="#a0522d" stroke={INK} strokeWidth="3" />
          {[-30, 0, 30].map((dx, i) => (
            <circle key={dx} cx={x + dx} cy={top + 106} r="10" fill={["#ff6b6b", "#ffd43b", "#f783ac"][i]} stroke={INK} strokeWidth="2" />
          ))}
        </g>
      ))}
      {/* The awning over the shop window, red and white */}
      <g>
        {Array.from({ length: 10 }, (_, i) => {
          const x = WINDOW.left - 20 + i * 54;
          return (
            <path
              key={i}
              d={`M${x} ${WINDOW.top - 80} H${x + 54} V${WINDOW.top - 28} Q${x + 27} ${WINDOW.top - 6} ${x} ${WINDOW.top - 28} Z`}
              fill={i % 2 ? "#fff" : "#e03131"}
              stroke={INK}
              strokeWidth="3"
              strokeLinejoin="round"
            />
          );
        })}
      </g>
      {/* The shop window: a warm room behind the glass, a shelf, the goods on show */}
      <rect
        x={WINDOW.left - 12}
        y={WINDOW.top - 12}
        width={WINDOW.right - WINDOW.left + 24}
        height={WINDOW.bottom - WINDOW.top + 24}
        rx="8"
        fill="#a0522d"
        stroke={INK}
        strokeWidth="4"
      />
      <rect x={WINDOW.left} y={WINDOW.top} width={WINDOW.right - WINDOW.left} height={WINDOW.bottom - WINDOW.top} fill="#fff4e6" />
      <rect x={WINDOW.left} y={WINDOW.top} width={WINDOW.right - WINDOW.left} height="70" fill="#ffe8cc" />
      <rect x={WINDOW.left} y={WINDOW.bottom - 18} width={WINDOW.right - WINDOW.left} height="18" fill="#c08552" />
      {/* Rolls in a basket */}
      <g transform={`translate(${IN_WINDOW.broetchen[0]} ${IN_WINDOW.broetchen[1] + 22})`}>
        <path d="M-70 -30 L-60 22 H60 L70 -30 Z" fill="#e8b04b" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M-66 -10 H66 M-62 8 H62" stroke="#c08552" strokeWidth="3" />
        {[-34, 34, 0].map((x, i) => (
          <g key={x} transform={`translate(${x} ${i === 2 ? -36 : -26}) scale(0.62)`}>
            <Roll c={BAKED} />
          </g>
        ))}
      </g>
      <g transform={`translate(${IN_WINDOW.brezel[0]} ${IN_WINDOW.brezel[1] + 50}) scale(0.62)`}>
        <Pretzel c={BAKED} />
      </g>
      <g transform={`translate(${IN_WINDOW.kuchen[0]} ${IN_WINDOW.kuchen[1] + 40}) scale(0.5)`}>
        <ellipse cx="0" cy="2" rx="140" ry="16" fill="#fff" stroke={INK} strokeWidth="5" />
        <Cake c={BAKED} risen />
      </g>
      {/* Light on the glass */}
      <path
        d={`M${WINDOW.left + 30} ${WINDOW.top + 90} L${WINDOW.left + 110} ${WINDOW.top + 10} M${WINDOW.right - 90} ${WINDOW.bottom - 30} L${WINDOW.right - 20} ${WINDOW.bottom - 100}`}
        stroke="#fff"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* The door: open, the warm shop behind it; or shut, with its glass and handle */}
      <rect x={DOOR_X - DOOR.w / 2 - 10} y={GROUND - DOOR.h - 10} width={DOOR.w + 20} height={DOOR.h + 10} rx="8" fill="#8d5a3b" stroke={INK} strokeWidth="4" />
      {open ? (
        <g>
          <rect x={DOOR_X - DOOR.w / 2} y={GROUND - DOOR.h} width={DOOR.w} height={DOOR.h} fill="#ffe8cc" />
          <rect x={DOOR_X - DOOR.w / 2} y={GROUND - 90} width={DOOR.w} height="90" fill="#e8b678" />
          <path
            d={`M${DOOR_X - DOOR.w / 2} ${GROUND - DOOR.h} L${DOOR_X - DOOR.w / 2 + 26} ${GROUND - DOOR.h + 12} V${GROUND - 8} L${DOOR_X - DOOR.w / 2} ${GROUND} Z`}
            fill="#a0522d"
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>
      ) : (
        <g>
          <rect x={DOOR_X - DOOR.w / 2} y={GROUND - DOOR.h} width={DOOR.w} height={DOOR.h} fill="#a0522d" stroke={INK} strokeWidth="3" />
          <rect x={DOOR_X - DOOR.w / 2 + 18} y={GROUND - DOOR.h + 18} width={DOOR.w - 36} height="100" rx="6" fill="#fff3bf" stroke={INK} strokeWidth="3" />
          <path d={`M${DOOR_X} ${GROUND - DOOR.h + 18} V${GROUND - DOOR.h + 118}`} stroke={INK} strokeWidth="2.5" />
          <rect x={DOOR_X + 36} y={GROUND - 120} width="12" height="34" rx="5" fill="#ffd43b" stroke={INK} strokeWidth="2.5" />
        </g>
      )}
      <rect x={DOOR_X - DOOR.w / 2 - 20} y={GROUND - 8} width={DOOR.w + 40} height="8" fill="#adb5bd" stroke={INK} strokeWidth="2" />
      {/* The little brass bell over the door */}
      <g transform={`translate(${DOOR_X} ${GROUND - DOOR.h - 18})`}>
        <path d="M0 -24 V-14" stroke={INK} strokeWidth="3" />
        <path d="M-14 6 Q-14 -16 0 -16 Q14 -16 14 6 Z" fill="#fcc419" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="0" cy="8" r="4" fill={INK} />
      </g>
      {/* The bakery's sign: a golden pretzel hanging from an iron arm at the corner */}
      <path d={`M${left} ${top + 90} H${left - 110} M${left} ${top + 130} L${left - 60} ${top + 90}`} stroke="#495057" strokeWidth="7" strokeLinecap="round" />
      <path d={`M${left - 92} ${top + 90} V${top + 116}`} stroke="#495057" strokeWidth="4" />
      <g transform={`translate(${left - 92} ${top + 206}) scale(0.62)`}>
        <Pretzel c={{ fill: "#fcc419", line: "#e67700", shine: "#fff3bf" }} salt={false} />
      </g>
      {/* Flower pots beside the door */}
      {[DOOR_X - 110, DOOR_X + 110].map((x) => (
        <g key={x} transform={`translate(${x} ${GROUND})`}>
          <path d="M-22 0 L-18 -40 H18 L22 0 Z" fill="#e8590c" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <g fill="#51cf66" stroke={INK} strokeWidth="2.5">
            <circle cx="-12" cy="-52" r="14" />
            <circle cx="12" cy="-54" r="14" />
            <circle cx="0" cy="-70" r="16" />
          </g>
        </g>
      ))}
    </g>
  );
}

function ShopDraw({ step, busy }: SceneProps) {
  const kid = route<Point[]>(step, [
    [0, [[-60, GROUND]]],
    [
      1,
      [
        [-60, GROUND],
        [KID_SHOP, GROUND],
      ],
    ],
  ]);
  const parent = route<Point[]>(step, [
    [0, [[-220, GROUND]]],
    [
      1,
      [
        [-220, GROUND],
        [PARENT_SHOP, GROUND],
      ],
    ],
  ]);
  const walking = busy && step === 1;
  const open = step >= 2;
  return (
    <g>
      <Outdoors />
      <RoundTree x={1460} s={1.05} />
      <Bakery open={open} />
      {/* The pavement in front of the shop */}
      <rect x={-FAR} y={GROUND} width={FAR * 3} height="24" fill="#dee2e6" stroke={INK} strokeWidth="3" />
      <path d={`M${-FAR} ${GROUND + 12} H${FAR * 2}`} stroke="#adb5bd" strokeWidth="20" strokeDasharray="3 117" />
      {open && (
        <g transform={`translate(${DOOR_X} ${GROUND})`}>
          <Pop>
            <Grownup look={BAKER} pose={step >= 3 && busy ? "cheer" : "stand"} wear={["baker"]} face={-1} />
          </Pop>
        </g>
      )}
      <Go path={parent} ms={3000}>
        <Grownup look={PARENT} pose={walking ? "walk" : "stand"} face={1} />
      </Go>
      <Go path={kid} ms={3000}>
        <Child pose={walking ? "walk" : step >= 3 && busy ? "cheer" : "stand"} />
      </Go>
    </g>
  );
}

const shop: Scene = {
  id: "baeckerei",
  icon: SHOP_ICON,
  focus: [200, 180, 1200, 640],
  Draw: ShopDraw,
  beats: [
    { ms: 3000, say: "Heute gehen wir zum Bäcker." },
    {
      tap: { at: [DOOR_X, GROUND - 110], r: 90 },
      ask: "Mach die Tür auf!",
      sounds: [[0, playDing]],
      say: "Bimmel, bimmel. Da kommt der Bäcker.",
      ms: 2600,
    },
    { ms: 2600, say: "Er sagt: Komm, wir backen zusammen!" },
  ],
  choice: {
    ask: "Was backen wir heute?",
    options: (["broetchen", "brezel", "kuchen"] as Bake[]).map((bake) => ({
      id: bake,
      picture: BAKE_ICON[bake],
      card: BAKE_CARD[bake],
      sounds: BAKE_SOUND[bake],
      at: IN_WINDOW[bake],
      r: 68,
      say: BAKE_SAY[bake],
    })),
  },
};

// ---------- In the bakehouse: flour, kneading, resting, shaping ----------

/** The work table's top, and where it ends. */
const BENCH_TOP = 600;
const BENCH = { left: 260, right: 1360 };
const SACK_X = 360;
const BOWL: Point = [680, 482];
/** The board where the dough is kneaded, rests and gets its shape. */
const BOARD: Point = [1170, BENCH_TOP - 6];
/** The child stands behind the table (on a stool), between the bowl and the board, clear of the tipping sack; the
 * baker beside the table on the right. */
const KID_BENCH = 945;
const BAKER_BENCH = 1440;

/** The bakehouse: tiled walls, a window with the morning outside, a shelf of flour sacks and jars, a lamp, and the
 * big oven's corner at the back (left out where the oven itself stands in front). */
function Bakehouse({ backOven = true, children }: { backOven?: boolean; children?: ReactNode }) {
  return (
    <g>
      <rect x={-FAR} y={-FAR} width={FAR * 3} height={FAR + GROUND} fill="#fff9db" />
      <path
        d={`${Array.from({ length: 12 }, (_, i) => `M${-FAR} ${GROUND - 300 + i * 50 - 300} H${FAR * 2}`).join(" ")} ${Array.from({ length: 60 }, (_, i) => `M${-600 + i * 70} ${GROUND - 600} V${GROUND}`).join(" ")}`}
        stroke="#f1e3b5"
        strokeWidth="3"
      />
      <rect x={-FAR} y={GROUND - 16} width={FAR * 3} height="16" fill="#c08552" stroke={INK} strokeWidth="2" />
      <rect x={-FAR} y={GROUND} width={FAR * 3} height={FAR} fill="#ced4da" />
      <path d={Array.from({ length: 50 }, (_, i) => `M${-1200 + i * 90} ${GROUND} l-60 ${FAR}`).join(" ")} stroke="#adb5bd" strokeWidth="3" />
      {/* The window: morning sky, a roof across the street */}
      <rect x="140" y="130" width="300" height="230" rx="10" fill="#ffd8a8" stroke={INK} strokeWidth="5" />
      <circle cx="210" cy="300" r="36" fill="#ffe066" stroke="#fab005" strokeWidth="4" />
      <path d="M330 360 L380 290 L440 330 V360 Z" fill="#e8590c" opacity="0.6" />
      <path d="M290 130 V360 M140 245 H440" stroke="#fff" strokeWidth="12" />
      <path d="M290 130 V360 M140 245 H440" stroke={INK} strokeWidth="3" />
      <rect x="130" y="356" width="320" height="14" rx="5" fill="#fff" stroke={INK} strokeWidth="3" />
      {/* The shelf with sacks and jars */}
      <rect x="620" y="250" width="620" height="16" rx="4" fill="#a0522d" stroke={INK} strokeWidth="3" />
      {[680, 780].map((x) => (
        <g key={x} transform={`translate(${x} 250) scale(0.55)`}>
          <FlourSack />
        </g>
      ))}
      {[900, 980, 1060, 1150].map((x, i) => (
        <g key={x} transform={`translate(${x} 250)`}>
          <rect x="-26" y="-70" width="52" height="70" rx="8" fill={["#ffe066", "#ffc9c9", "#d3f9d8", "#e7f5ff"][i]} stroke={INK} strokeWidth="3" />
          <rect x="-28" y="-84" width="56" height="16" rx="4" fill="#e03131" stroke={INK} strokeWidth="3" />
        </g>
      ))}
      {/* The lamp */}
      <path d={`M1000 ${-FAR} V60`} stroke="#495057" strokeWidth="5" />
      <path d="M950 100 Q1000 40 1050 100 Z" fill="#fcc419" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {/* The big oven's corner at the back on the right, and a peel leaning on the wall */}
      {backOven && (
        <g>
          <path d="M1420 300 Q1420 230 1520 230 H1700 V780 H1420 Z" fill="#c92a2a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <path d="M1420 380 H1700 M1420 480 H1700 M1420 580 H1700 M1420 680 H1700" stroke="#a61e1e" strokeWidth="4" />
        </g>
      )}
      {children}
    </g>
  );
}

/** A sack of flour standing on (0, 0), open at the top with the flour showing, a wheat ear on it. */
function FlourSack() {
  return (
    <g>
      <path d="M-66 0 Q-74 -80 -56 -150 H56 Q74 -80 66 0 Z" fill="#e9d8b4" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-56 -150 Q-64 -172 -40 -176 H40 Q64 -172 56 -150" fill="#d9c49a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <ellipse cx="0" cy="-160" rx="42" ry="12" fill="#fff" stroke={INK} strokeWidth="3" />
      <g transform="translate(0 -70)" stroke="#c08552" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M0 40 V-40" />
        {[-28, -10, 8].map((y) => (
          <g key={y}>
            <path d={`M0 ${y} q-18 -6 -20 -22`} />
            <path d={`M0 ${y} q18 -6 20 -22`} />
          </g>
        ))}
      </g>
    </g>
  );
}

/** The work table: its top at `BENCH_TOP`, a thick front and four legs. */
function Bench() {
  return (
    <g>
      {[BENCH.left + 30, BENCH.right - 46].map((x) => (
        <rect key={x} x={x} y={BENCH_TOP + 40} width="16" height={GROUND - BENCH_TOP - 40} fill="#8d5a3b" stroke={INK} strokeWidth="2" />
      ))}
      <rect x={BENCH.left} y={BENCH_TOP} width={BENCH.right - BENCH.left} height="60" rx="6" fill="#c08552" stroke={INK} strokeWidth="4" />
      <path d={`M${BENCH.left} ${BENCH_TOP + 18} H${BENCH.right}`} stroke="#e8b678" strokeWidth="6" />
      <path
        d={`M${BENCH.left + 200} ${BENCH_TOP + 40} q30 6 60 0 M${BENCH.right - 300} ${BENCH_TOP + 36} q40 6 80 0`}
        stroke="#a0522d"
        strokeWidth="4"
        fill="none"
      />
      {/* A dusting of flour on the table */}
      <g fill="#fff" opacity="0.8">
        <ellipse cx={BENCH.left + 380} cy={BENCH_TOP + 6} rx="40" ry="5" />
        <ellipse cx={BENCH.right - 380} cy={BENCH_TOP + 6} rx="30" ry="4" />
      </g>
    </g>
  );
}

/** The mixing bowl, seen a little from above, its rim at (0, 0); the flour or the dough shows inside it. */
function Bowl({ flour, dough }: { flour: boolean; dough: boolean }) {
  return (
    <g>
      <path d="M-160 0 Q-150 110 0 116 Q150 110 160 0 Z" fill="#4dabf7" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-120 30 Q-110 80 -60 96" stroke="#a5d8ff" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="0" cy="0" rx="160" ry="34" fill="#1c7ed6" stroke={INK} strokeWidth="4" />
      <ellipse cx="0" cy="2" rx="146" ry="26" fill="#e7f5ff" />
      {flour && !dough && (
        <g className="fm-bk-heap">
          <path d="M-100 8 Q-50 -66 0 -60 Q50 -66 100 8 Z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M-40 -40 Q-10 -56 20 -50" stroke="#e9ecef" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
      )}
    </g>
  );
}

/** A ball of dough standing on (0, 0). */
function Dough() {
  return (
    <g>
      <ellipse cx="0" cy="-40" rx="86" ry="44" fill={RAW.fill} stroke={INK} strokeWidth="4" />
      <path d="M-50 -60 Q-20 -78 20 -72" stroke={RAW.shine} strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M-30 -36 Q0 -28 30 -40" stroke={RAW.line} strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** The checked cloth the dough rests under, standing on (0, 0). */
function Cloth() {
  return (
    <g>
      <path d="M-128 0 Q-120 -120 0 -126 Q120 -120 128 0 Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <g stroke="#e03131" strokeWidth="9" fill="none" opacity="0.85">
        <path d="M-84 -4 Q-80 -86 -40 -112" />
        <path d="M-28 -2 Q-24 -94 0 -124" />
        <path d="M28 -2 Q24 -94 0 -124" />
        <path d="M84 -4 Q80 -86 40 -112" />
        <path d="M-122 -40 Q0 -60 122 -40" />
        <path d="M-104 -84 Q0 -104 104 -84" />
      </g>
      <path d="M-128 0 Q-120 -120 0 -126 Q120 -120 128 0 Z" fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    </g>
  );
}

function DoughDraw({ step, busy, picks }: SceneProps) {
  const bake = picks[0] as Bake;
  const pouring = step === 2 && busy;
  const kneaded = step >= 3;
  const dough = route<Point[]>(step, [
    [0, [[BOWL[0], BOWL[1] + 10]]],
    [3, [[BOWL[0], BOWL[1] + 10], [930, 360], BOARD]],
  ]);
  const cloth = route<Point[]>(step, [
    [0, [[BOARD[0], -200]]],
    [4, [[BOARD[0], -200], BOARD]],
    [5, [BOARD, [BOARD[0] + 40, 360], [BOARD[0] + 420, 160]]],
  ]);
  const risen = step >= 4;
  const shaped = step >= 6;
  return (
    <Bakehouse>
      <g transform={`translate(${KID_BENCH} ${GROUND - 140})`}>
        <Child pose={step >= 6 && busy ? "cheer" : "stand"} chef />
      </g>
      <g transform={`translate(${BAKER_BENCH} ${GROUND})`}>
        <Grownup look={BAKER} pose={step >= 6 && busy ? "cheer" : "stand"} wear={["baker"]} face={-1} />
      </g>
      <Bench />
      {/* The flour sack tips over the bowl while it pours */}
      <g transform={`translate(${SACK_X} ${BENCH_TOP})`}>
        <g className={pouring ? "fm-bk-tip" : undefined} style={{ transformOrigin: "66px 0px" }}>
          <FlourSack />
        </g>
      </g>
      {pouring && (
        <path
          className="fm-bk-pour"
          d={`M${SACK_X + 118} 440 Q${SACK_X + 230} 400 ${BOWL[0] - 60} ${BOWL[1]}`}
          stroke="#fff"
          strokeWidth="26"
          strokeLinecap="round"
          fill="none"
        />
      )}
      <g transform={`translate(${BOWL[0]} ${BOWL[1]})`}>
        <Bowl flour={step >= 2} dough={kneaded} />
      </g>
      {/* The board */}
      <path
        d={`M${BOARD[0] - 180} ${BENCH_TOP} L${BOARD[0] - 166} ${BENCH_TOP - 14} H${BOARD[0] + 166} L${BOARD[0] + 180} ${BENCH_TOP} Z`}
        fill="#e8b678"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* The dough is there from the start (hidden in the bowl), so that it travels to the board when kneaded; under
          the cloth it grows, and the cloth with it, once the cloth has come down over it. */}
      <Go path={dough} ms={1400} className={shaped ? "fm-bk-gone" : undefined}>
        <g style={{ opacity: kneaded ? 1 : 0 }}>
          <g className="fm-bk-rise" style={{ transform: risen ? "scale(1.35)" : "none" }}>
            <g className={step === 3 && busy ? "fm-bk-knead" : undefined}>
              <Dough />
            </g>
          </g>
        </g>
      </Go>
      <Go path={cloth} ms={1400} className={step >= 5 ? "fm-bk-gone" : undefined}>
        <g className="fm-bk-rise" style={{ transform: risen ? "scale(1.35)" : "none" }}>
          <Cloth />
        </g>
      </Go>
      {shaped && (
        <g transform={`translate(${BOARD[0]} ${BENCH_TOP - 30})`}>
          <Pop delay={1.2}>
            <Tray />
            <Goods bake={bake} baked={false} />
          </Pop>
        </g>
      )}
    </Bakehouse>
  );
}

const dough: Scene = {
  id: "backstube",
  icon: BOWL_ICON,
  focus: [200, 300, 1260, 520],
  Draw: DoughDraw,
  beats: [
    { ms: 2400, say: "Hier in der Backstube backen wir." },
    {
      tap: { at: [SACK_X, BENCH_TOP - 90], r: 90 },
      ask: "Schütte das Mehl in die Schüssel!",
      sounds: [[500, playRustle]],
      say: "Das Mehl rieselt hinein.",
      ms: 3000,
    },
    {
      tap: { at: [BOWL[0], BOWL[1] + 20], r: 110 },
      ask: "Jetzt kneten wir den Teig!",
      sounds: [
        [1500, playThump],
        [2400, playThump],
      ],
      say: "Kneten, kneten. Der Teig wird schön weich.",
      ms: 3600,
    },
    { ms: 3800, sounds: [[0, playRustle]], say: "Unter dem Tuch ruht der Teig und wird groß." },
    {
      tap: { at: [BOARD[0], BOARD[1] - 80], r: 110 },
      ask: "Schau unter das Tuch!",
      sounds: [[200, playWhoosh]],
      say: "So groß ist der Teig geworden!",
      ms: 2600,
    },
    { ms: 2600, sounds: [[600, playPop]], say: "Jetzt bekommt der Teig seine Form." },
  ],
};

// ---------- The oven ----------

const OVEN = { left: 480, right: 1120, top: 200, base: 700 };
const OVEN_DOOR = { x: 800, top: 430, w: 340, h: 220 };
/** Where the tray waits before and after baking, on the side table, and where it stands in the oven. */
const TRAY_OUT: Point = [290, 640];
const TRAY_IN: Point = [800, 604];
const KID_OVEN = 470;
const BAKER_OVEN = 1240;

/** The baker's oven: a tiled front with an arch, a chimney pipe, a door with a window to watch through, and the
 * kitchen timer's bell on top. */
function OvenBody() {
  const { left, right, top, base } = OVEN;
  return (
    <g>
      <rect x={(left + right) / 2 - 40} y={-FAR} width="80" height={FAR + top} fill="#868e96" stroke={INK} strokeWidth="4" />
      <path
        d={`M${left} ${base} V${top + 120} Q${left} ${top} ${(left + right) / 2} ${top} Q${right} ${top} ${right} ${top + 120} V${base} Z`}
        fill="#e8590c"
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d={Array.from({ length: 8 }, (_, i) => `M${left} ${top + 120 + i * 64} H${right}`).join(" ")} stroke="#c2410c" strokeWidth="4" />
      <path
        d={`M${left + 40} ${top + 110} Q${left + 60} ${top + 40} ${left + 150} ${top + 30}`}
        stroke="#ffa94d"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <rect x={left - 30} y={base} width={right - left + 60} height={GROUND - base} fill="#868e96" stroke={INK} strokeWidth="4" />
      <path d={`M${left - 30} ${base + 30} H${right + 30}`} stroke="#adb5bd" strokeWidth="5" />
    </g>
  );
}

/** The oven's door, hinged at the bottom, with its window and handle. */
function OvenDoor() {
  const { x, top, w, h } = OVEN_DOOR;
  return (
    <g>
      {/* The frame has a hole for the window, so what bakes inside shows through the glass. */}
      <path
        d={`M${x - w / 2} ${top} h${w} v${h} h${-w} Z M${x - w / 2 + 30} ${top + 26} v${h - 70} h${w - 60} v${-(h - 70)} Z`}
        fillRule="evenodd"
        fill="#495057"
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <rect x={x - w / 2 + 30} y={top + 26} width={w - 60} height={h - 70} fill="#ffd8a8" opacity="0.18" stroke={INK} strokeWidth="4" />
      <path d={`M${x - w / 2 + 50} ${top + 70} L${x - w / 2 + 100} ${top + 40}`} stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
      <rect x={x - 80} y={top + h - 34} width="160" height="16" rx="8" fill="#ced4da" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** The kitchen timer's bell on top of the oven; it rocks once when it rings. */
function TimerBell({ ring }: { ring: boolean }) {
  return (
    <g transform={`translate(${OVEN.right - 130} ${OVEN.top + 60})`}>
      <g className={ring ? "fm-bk-ding" : undefined}>
        <circle cx="0" cy="-30" r="30" fill="#fcc419" stroke={INK} strokeWidth="4" />
        <circle cx="0" cy="-30" r="20" fill="#fff" stroke={INK} strokeWidth="3" />
        <path d="M0 -30 V-44 M0 -30 L10 -24" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <rect x="-6" y="-68" width="12" height="10" rx="3" fill="#495057" />
      </g>
    </g>
  );
}

/** A pile of firewood beside the oven. */
function Firewood({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} ${GROUND})`}>
      {(
        [
          [-60, -26],
          [0, -26],
          [60, -26],
          [-30, -76],
          [30, -76],
          [0, -126],
        ] as const
      ).map(([lx, ly]) => (
        <g key={`${lx}${ly}`}>
          <circle cx={lx} cy={ly} r="26" fill="#a0522d" stroke={INK} strokeWidth="3" />
          <circle cx={lx} cy={ly} r="14" fill="none" stroke="#e8b678" strokeWidth="4" />
        </g>
      ))}
    </g>
  );
}

function OvenDraw({ step, busy, picks }: SceneProps) {
  const bake = picks[0] as Bake;
  const tray = route<Point[]>(step, [
    [0, [TRAY_OUT]],
    [1, [TRAY_OUT, [560, 604], TRAY_IN]],
    [4, [TRAY_IN, [560, 604], TRAY_OUT]],
  ]);
  const opening = busy && (step === 1 || step === 4);
  const baking = step >= 2 && step < 4;
  return (
    <Bakehouse backOven={false}>
      <OvenBody />
      {/* Inside the oven: dark, glowing warm while it bakes */}
      <rect x={OVEN_DOOR.x - OVEN_DOOR.w / 2} y={OVEN_DOOR.top} width={OVEN_DOOR.w} height={OVEN_DOOR.h} rx="14" fill="#5c3d2e" />
      <rect
        className="fm-bk-glow"
        x={OVEN_DOOR.x - OVEN_DOOR.w / 2 + 10}
        y={OVEN_DOOR.top + 10}
        width={OVEN_DOOR.w - 20}
        height={OVEN_DOOR.h - 20}
        rx="10"
        fill="#ff922b"
        style={{ opacity: baking ? 0.85 : 0.25 }}
      />
      {/* The side table */}
      <rect x="120" y={TRAY_OUT[1] + 16} width="16" height={GROUND - TRAY_OUT[1] - 16} fill="#8d5a3b" stroke={INK} strokeWidth="2" />
      <rect x="430" y={TRAY_OUT[1] + 16} width="16" height={GROUND - TRAY_OUT[1] - 16} fill="#8d5a3b" stroke={INK} strokeWidth="2" />
      <rect x="100" y={TRAY_OUT[1] + 16} width="360" height="22" rx="5" fill="#a0522d" stroke={INK} strokeWidth="3" />
      <Go path={tray} ms={1600} delay={500}>
        <Tray />
        <Browning bake={bake} baked={step >= 2} />
        {step >= 4 && (
          <g transform="translate(0 -150)">
            <Steam />
          </g>
        )}
      </Go>
      <g transform={`translate(0 ${OVEN_DOOR.top + OVEN_DOOR.h})`}>
        <g className={opening ? "fm-bk-door" : undefined}>
          <g transform={`translate(0 ${-(OVEN_DOOR.top + OVEN_DOOR.h)})`}>
            <OvenDoor />
          </g>
        </g>
      </g>
      <TimerBell ring={step === 3 && busy} />
      <Firewood x={1420} />
      <g transform={`translate(${KID_OVEN} ${GROUND})`}>
        <Child pose={step >= 4 && busy ? "cheer" : "stand"} chef />
      </g>
      <g transform={`translate(${BAKER_OVEN} ${GROUND})`}>
        <Grownup look={BAKER} pose="stand" wear={["baker"]} face={-1} />
      </g>
    </Bakehouse>
  );
}

const oven: Scene = {
  id: "ofen",
  icon: OVEN_ICON,
  focus: [150, 200, 1300, 620],
  Draw: OvenDraw,
  beats: [
    {
      tap: { at: [OVEN_DOOR.x, OVEN_DOOR.top + 110], r: 110 },
      ask: "Mach den Ofen auf!",
      sounds: [[2900, playClonk]],
      say: "Ab in den Ofen!",
      ms: 3400,
    },
    { ms: 4200, sounds: [[400, playCrackle]], say: "Im Ofen ist es warm. Schau, es wird braun!" },
    { ms: 2200, sounds: [[0, playDing]], say: "Ding! Fertig gebacken." },
    {
      tap: { at: [OVEN_DOOR.x, OVEN_DOOR.top + 110], r: 110 },
      ask: "Hol es aus dem Ofen!",
      sounds: [[2900, playClonk]],
      say: "Mmh, wie das duftet!",
      ms: 4000,
    },
  ],
};

// ---------- At home: breakfast together ----------

const HOME_TABLE = { left: 560, right: 1040, top: 640 };
/** The wooden board in the middle of the table, where the goods go. */
const PLATE: Point = [800, HOME_TABLE.top];
const KID_HOME = 520;
const PARENT_HOME = 270;
const BROTHER_HOME = 1090;
/** The child carries the paper bag against its chest. */
const BAG_AT = (x: number): Point => [x + 34, GROUND - 30];

/** A paper bag, its bottom on (0, 0). */
function PaperBag() {
  return (
    <g>
      <path d="M-34 0 L-30 -70 H30 L34 0 Z" fill="#e8b678" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M-30 -70 L-24 -84 H24 L30 -70" fill="#d9a066" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <g transform="translate(0 -36) scale(0.18)">
        <Pretzel c={BAKED} salt={false} />
      </g>
    </g>
  );
}

/** The kitchen at home: a warm wall, a window, a picture, a lamp; the table laid with plates, cups and jam. */
function Kitchen({ children }: { children?: ReactNode }) {
  const { left, right, top } = HOME_TABLE;
  return (
    <g>
      <rect x={-FAR} y={-FAR} width={FAR * 3} height={FAR + GROUND} fill="#e6fcf5" />
      <rect x={-FAR} y={GROUND - 220} width={FAR * 3} height="220" fill="#c3fae8" />
      <path d={`M${-FAR} ${GROUND - 220} H${FAR * 2}`} stroke="#63e6be" strokeWidth="10" />
      <rect x={-FAR} y={GROUND - 16} width={FAR * 3} height="16" fill="#d9a066" stroke={INK} strokeWidth="2" />
      <rect x={-FAR} y={GROUND} width={FAR * 3} height={FAR} fill="#d9a066" />
      <path d={`M${-FAR} ${GROUND + 40} H${FAR * 2} M${-FAR} ${GROUND + 92} H${FAR * 2}`} stroke="#c08552" strokeWidth="4" />
      {/* The window with the morning sun */}
      <rect x="640" y="150" width="320" height="250" rx="8" fill="#a5d8ff" stroke={INK} strokeWidth="5" />
      <circle cx="900" cy="210" r="32" fill="#ffe066" stroke="#fab005" strokeWidth="4" />
      <path d="M680 330 Q680 306 708 308 Q720 286 746 298 Q772 292 776 320 Q796 326 780 342 H690 Q676 342 680 330 Z" fill="#fff" />
      <path d="M800 150 V400 M640 275 H960" stroke="#fff" strokeWidth="12" />
      <path d="M800 150 V400 M640 275 H960" stroke={INK} strokeWidth="3" />
      <rect x="630" y="396" width="340" height="14" rx="5" fill="#fff" stroke={INK} strokeWidth="3" />
      {/* A drawing on the wall and the lamp */}
      <rect x="230" y="210" width="150" height="120" rx="6" fill="#fff" stroke="#a0522d" strokeWidth="10" />
      <path d="M260 300 Q290 240 320 290 Q340 250 360 300" stroke="#2f9e44" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="340" cy="244" r="14" fill="#ffd43b" />
      <path d={`M1250 ${-FAR} V90`} stroke="#495057" strokeWidth="5" />
      <path d="M1200 130 Q1250 70 1300 130 Z" fill="#ff8787" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {/* The table with its cloth, plates, cups and the jam */}
      {[left + 20, right - 36].map((x) => (
        <rect key={x} x={x} y={top + 20} width="16" height={GROUND - top - 20} fill="#8d5a3b" stroke={INK} strokeWidth="2" />
      ))}
      <path d={`M${left - 10} ${top} H${right + 10} V${top + 60} H${left - 10} Z`} fill="#fff" stroke={INK} strokeWidth="3" />
      <path
        d={Array.from({ length: 13 }, (_, i) => `M${left - 10 + i * 40} ${top} V${top + 60}`).join(" ") + ` M${left - 10} ${top + 30} H${right + 10}`}
        stroke="#74c0fc"
        strokeWidth="8"
        opacity="0.7"
      />
      {[left + 70, right - 70].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={top - 4} rx="56" ry="12" fill="#fff" stroke={INK} strokeWidth="3" />
          <g transform={`translate(${x + (x < PLATE[0] ? 40 : -40)} ${top - 10})`}>
            <rect x="-18" y="-38" width="36" height="38" rx="6" fill={x < PLATE[0] ? "#ffa8a8" : "#ffe066"} stroke={INK} strokeWidth="3" />
            <path d="M18 -30 q14 0 14 12 q0 12 -14 12" stroke={INK} strokeWidth="3" fill="none" />
          </g>
        </g>
      ))}
      <g transform={`translate(${PLATE[0] + 120} ${top - 4})`}>
        <rect x="-20" y="-46" width="40" height="46" rx="8" fill="#e03131" stroke={INK} strokeWidth="3" />
        <rect x="-22" y="-56" width="44" height="14" rx="4" fill="#fff" stroke={INK} strokeWidth="3" />
      </g>
      {/* The wooden board in the middle, waiting */}
      <ellipse cx={PLATE[0]} cy={top - 4} rx="110" ry="16" fill="#c08552" stroke={INK} strokeWidth="3" />
      {children}
    </g>
  );
}

function HomeDraw({ step, busy, picks }: SceneProps) {
  const bake = picks[0] as Bake;
  const kid = route<Point[]>(step, [
    [0, [[-60, GROUND]]],
    [
      1,
      [
        [-60, GROUND],
        [KID_HOME, GROUND],
      ],
    ],
  ]);
  const parent = route<Point[]>(step, [
    [0, [[-220, GROUND]]],
    [
      1,
      [
        [-220, GROUND],
        [PARENT_HOME, GROUND],
      ],
    ],
  ]);
  const bag = route<Point[]>(step, [
    [0, [BAG_AT(-60)]],
    [1, [BAG_AT(-60), BAG_AT(KID_HOME)]],
    [2, [BAG_AT(KID_HOME), [PLATE[0] - 140, PLATE[1] - 140], [PLATE[0] - 150, PLATE[1] - 4]]],
  ]);
  const walking = busy && step === 1;
  const onTable = step >= 2;
  const eating = step === 3 && busy;
  const eaten = step >= 3;
  const happy = step >= 4;
  return (
    <Kitchen>
      {onTable && (
        <g transform={`translate(${PLATE[0]} ${PLATE[1] - 8}) scale(0.72)`}>
          <Pop delay={1.2}>
            <Goods bake={bake} baked eaten={eaten && !(step === 3 && busy)} tin={false} />
          </Pop>
        </g>
      )}
      <g transform={`translate(${BROTHER_HOME} ${GROUND})`}>
        <Kid look={BROTHER} pose={eating ? "reach" : happy ? "cheer" : "stand"} holding={null} wear={[]} face={-1} />
      </g>
      <Go path={parent} ms={3000}>
        <Grownup look={PARENT} pose={walking ? "walk" : happy ? "cheer" : "stand"} face={1} />
      </Go>
      <Go path={kid} ms={3000}>
        <Child pose={walking ? "walk" : eating ? "reach" : happy ? "cheer" : "stand"} />
      </Go>
      <Go path={bag} ms={step === 2 ? 1200 : 3000} className={onTable ? "fm-bk-gone" : undefined}>
        <PaperBag />
      </Go>
    </Kitchen>
  );
}

const home: Scene = {
  id: "fruehstueck",
  icon: TABLE_ICON,
  focus: [150, 300, 1250, 520],
  Draw: HomeDraw,
  beats: [
    { ms: 3000, say: "Zu Hause ist der Tisch schon gedeckt." },
    {
      tap: { at: [PLATE[0], PLATE[1] - 50], r: 100 },
      ask: "Leg es auf den Tisch!",
      sounds: [[0, playRustle]],
      say: "Selbst gebacken!",
      ms: 2600,
    },
    {
      tap: { at: [PLATE[0], PLATE[1] - 50], r: 100 },
      ask: "Jetzt essen wir!",
      sounds: [
        [200, playMunch],
        [1400, playYum],
      ],
      say: "Mmh, lecker!",
      ms: 3200,
    },
    { ms: 2400, sounds: [[0, playChime]], say: "Alle sind satt und froh." },
  ],
};

/** „Beim Bäcker“: what the child picks, from the shop window through the bakehouse and the oven to the table at home. */
export const BAECKER: Film = {
  id: "baecker",
  title: "Beim Bäcker",
  end: "Selbst gebacken schmeckt es am besten!",
  scenes: (picks) => (picks[0] ? [shop, dough, oven, home] : [shop]),
};
