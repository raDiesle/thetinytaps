import type { ReactNode } from "react";
import { INK } from "@/components/drawing";
import { playEngine } from "@/lib/realSounds";
import { playBeeps, playChime, playClonk, playPlop, playRecorded, playRip, playRumble, playRustle, playThump, playWhirr } from "@/lib/sfx";
import { Kid, KidHead, type Look, type Pose, useHero } from "../kid";
import type { Picture } from "../trail/items";
import type { Cue, Point } from "../trail/types";
import { Go, route } from "./move";
import { Wheel } from "./parts";
import { Grownup } from "./people";
import { BackHouse, Outdoors, Road } from "./places";
import { type Film, GROUND, type Scene, type SceneProps } from "./types";

// „The rubbish truck“ (G-27; written English first): the child picks which bin goes out today and pushes it to the
// street with its grown-up, the rubbish truck backs up slowly with one short beep, its arm lifts the bin and tips the
// rubbish in, the press squeezes it small with a soft whirr, and the truck drives on. Then the family takes glass, paper
// and plastic to the recycling yard, each into its own container. The driver is a bear. A calm film: no horn, no
// siren, only the short beep backing up.

const engine = () => playRecorded("engine", playEngine);

/** The child's own grown-up: a person, like the child's family in the other films. */
const PARENT: Look = { shirt: "#4dabf7", pants: "#343a40", hair: "#5c3d2e" };
const DRIVER: Look = { shirt: "#f76707", pants: "#495057", hair: "#a0522d", animal: "bear" };

/** The child in its own clothes. */
function Child({ pose, face = 1 }: { pose: Pose; face?: 1 | -1 }) {
  const hero = useHero();
  return <Kid look={hero} pose={pose} holding={null} wear={[]} face={face} />;
}

// ---------- The bins ----------

/** The three bins at the house, by what goes into them: rubbish, paper, plastic. */
type BinKind = "grau" | "blau" | "gelb";
const BIN_KINDS: BinKind[] = ["grau", "blau", "gelb"];
const BIN_COLOUR: Record<BinKind, { body: string; lid: string }> = {
  grau: { body: "#868e96", lid: "#495057" },
  blau: { body: "#339af0", lid: "#1971c2" },
  gelb: { body: "#fcc419", lid: "#f59f00" },
};
const binOf = (picks: string[]): BinKind => (BIN_KINDS.includes(picks[0] as BinKind) ? (picks[0] as BinKind) : "grau");

/** What lies in a bin, drawn round (0, 0) at its rim: rubbish bags, paper and a box, or plastic bottles and a pot. */
function Contents({ kind }: { kind: BinKind }) {
  if (kind === "grau")
    return (
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d="M-40 0 Q-46 -40 -16 -44 Q8 -40 4 0 Z" fill="#343a40" />
        <path d="M-22 -42 l-6 -14 l12 4 l6 -6 l2 14" fill="#343a40" />
        <path d="M-4 0 Q-6 -34 20 -36 Q44 -32 40 0 Z" fill="#495057" />
        <path d="M18 -34 l-4 -12 l10 4 l8 -4 l-2 12" fill="#495057" />
      </g>
    );
  if (kind === "blau")
    return (
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d="M-42 0 L-36 -46 L4 -40 L0 0 Z" fill="#d9a066" />
        <path d="M-36 -46 L-26 -56 L10 -50 L4 -40" fill="#c08552" />
        <path d="M-6 0 L6 -50 L44 -42 L34 0 Z" fill="#f8f9fa" />
        <path d="M8 -36 L36 -30 M6 -26 L34 -20 M4 -16 L32 -10" stroke="#adb5bd" strokeWidth="3" />
      </g>
    );
  return (
    <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
      <path d="M-40 0 V-40 Q-40 -50 -32 -52 V-62 H-20 V-52 Q-12 -50 -12 -40 V0 Z" fill="#a5d8ff" />
      <rect x="-33" y="-70" width="14" height="10" rx="2" fill="#e03131" />
      <path d="M-8 0 L-12 -34 H20 L16 0 Z" fill="#f8f9fa" />
      <path d="M-12 -34 H20" stroke="#ff8787" strokeWidth="5" />
      <path d="M20 0 Q18 -26 30 -30 Q44 -24 42 0 Z" fill="#ffd8a8" />
    </g>
  );
}

/**
 * A wheelie bin of its `kind`, standing on (0, 0) with its wheel at the left and its lid hinged at the right: `open`
 * the lid stands up and what lies in it shows over the rim, unless it is `empty`.
 */
function Bin({ kind, open = false, empty = false }: { kind: BinKind; open?: boolean; empty?: boolean }) {
  const c = BIN_COLOUR[kind];
  return (
    <g>
      <ellipse cx="0" cy="2" rx="52" ry="8" fill="#000" opacity="0.12" />
      {open && !empty && (
        <g transform="translate(0 -136)">
          <Contents kind={kind} />
        </g>
      )}
      <path d="M-40 0 L-46 -136 H46 L40 0 Z" fill={c.body} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-30 -110 V-20 M0 -110 V-20 M30 -110 V-20" stroke={INK} strokeOpacity="0.18" strokeWidth="6" strokeLinecap="round" />
      <path d="M-40 -124 L-38 -110" stroke="#fff" strokeOpacity="0.5" strokeWidth="6" strokeLinecap="round" />
      <g className="fm-mu-lid" style={{ transformOrigin: "50px -144px", transform: open ? "rotate(-100deg)" : "rotate(0deg)" }}>
        <rect x="-52" y="-152" width="104" height="16" rx="6" fill={c.lid} stroke={INK} strokeWidth="4" />
        <rect x="-60" y="-150" width="14" height="10" rx="4" fill={c.lid} stroke={INK} strokeWidth="3" />
      </g>
      <circle cx="-30" cy="-12" r="14" fill="#343a40" stroke={INK} strokeWidth="3" />
      <circle cx="-30" cy="-12" r="5" fill="#adb5bd" />
    </g>
  );
}

// ---------- The rubbish truck ----------

const ORANGE = "#f76707";
/** The arm's pivot at the truck's back, from its middle (drawn facing left, so the back is on the right). */
const PIVOT: Point = [310, -332];
/** How far the arm swings to tip the bin over the hopper on the roof. */
const TIP = -165;
/** Where the bin stands in the arm, from the pivot (its feet on the pavement while the arm is down). */
const IN_ARM: Point = [75, 252];
/** From the truck's middle to the bin it picks up, along the street: the truck stands this far right of the bin. */
const REACH = PIVOT[0] + IN_ARM[0];

/**
 * The rubbish truck, its wheels on (0, 0) and facing right: the cab with its driver, the box with the press, the
 * hopper on its roof at the back, and the arm at the back, which holds `bin` and tips it over the hopper while `tipping`
 * (the rubbish falls in once it is up). The box squeezes a little while `pressing`; the wheels turn while `rolling`.
 */
function Truck({
  bin = null,
  tipping = false,
  pressing = false,
  rolling = false,
}: {
  bin?: BinKind | null;
  tipping?: boolean;
  pressing?: boolean;
  rolling?: boolean;
}) {
  // Drawn facing left and turned round, so the arm's swing over the roof is one rotation.
  return (
    <g transform="scale(-1 1)">
      <ellipse cx="20" cy="2" rx="360" ry="14" fill="#000" opacity="0.15" />
      <rect x="-330" y="-110" width="660" height="36" rx="6" fill="#495057" stroke={INK} strokeWidth="4" />
      <g className={pressing ? "fm-mu-squeeze on" : "fm-mu-squeeze"} style={{ transformOrigin: "-140px -210px" }}>
        <rect x="-140" y="-330" width="450" height="236" rx="18" fill={ORANGE} stroke={INK} strokeWidth="4" />
        <path d="M-80 -316 V-110 M-10 -316 V-110 M60 -316 V-110 M130 -316 V-240 M130 -150 V-110 M240 -316 V-110" stroke="#e8590c" strokeWidth="9" />
        <rect x="-140" y="-128" width="450" height="14" fill="#f8f9fa" opacity="0.9" />
      </g>
      <rect x="196" y="-346" width="100" height="20" rx="4" fill="#343a40" stroke={INK} strokeWidth="3" />
      {/* the press's button, which the child taps */}
      <rect x="112" y="-234" width="76" height="76" rx="10" fill="#dee2e6" stroke={INK} strokeWidth="4" />
      <circle cx="150" cy="-196" r="24" fill={pressing ? "#8ce99a" : "#40c057"} stroke={INK} strokeWidth="4" />
      <path
        d="M-140 -94 V-300 Q-140 -320 -160 -320 H-256 Q-298 -320 -310 -280 L-330 -170 V-94 Z"
        fill={ORANGE}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M-160 -180 V-300 H-250 Q-278 -300 -288 -270 L-306 -180 Z" fill="#a5d8ff" opacity="0.85" />
      <g transform="translate(-218 -176) scale(0.48)">
        <KidHead look={DRIVER} />
      </g>
      <path d="M-262 -290 l20 -6 M-270 -270 l10 -3" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <rect x="-222" y="-342" width="44" height="22" rx="9" fill="#ffa94d" stroke={INK} strokeWidth="3" />
      <rect x="-340" y="-150" width="20" height="18" rx="4" fill="#ffe066" stroke={INK} strokeWidth="2" />
      <rect x="-346" y="-100" width="40" height="18" rx="6" fill="#ced4da" stroke={INK} strokeWidth="3" />
      {[-240, 120, 230].map((x) => (
        <g key={x} transform={`translate(${x} -46)`}>
          <Wheel r={46} spin={rolling} />
        </g>
      ))}
      <rect x="290" y="-368" width="40" height="70" rx="8" fill="#495057" stroke={INK} strokeWidth="4" />
      <g transform={`translate(${PIVOT[0]} ${PIVOT[1]})`}>
        <g className="fm-mu-arm" style={{ transform: `rotate(${tipping ? TIP : 0}deg)` }}>
          {bin && (
            <g transform={`translate(${IN_ARM[0]} ${IN_ARM[1]})`}>
              <Bin kind={bin} open={tipping} empty={tipping} />
            </g>
          )}
          <path d="M0 0 L30 70 V200" stroke={INK} strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M0 0 L30 70 V200" stroke="#868e96" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M30 130 H44 M30 180 H44" stroke="#495057" strokeWidth="14" strokeLinecap="round" />
          <circle r="16" fill="#495057" stroke={INK} strokeWidth="4" />
        </g>
      </g>
      {tipping && bin && (
        <g transform="translate(250 -334)">
          <g className="fm-mu-fall">
            <Contents kind={bin} />
          </g>
        </g>
      )}
    </g>
  );
}

// ---------- The recycling yard ----------

type Stuff = "glass" | "paper" | "plastic";
const STUFF: Stuff[] = ["glass", "paper", "plastic"];

/** Where each container stands, and where its opening is that the things go into. */
const CONTAINER_X: Record<Stuff, number> = { glass: 720, paper: 1020, plastic: 1320 };
const OPENING_Y = GROUND - 222;

/** A container of the recycling yard, standing on (0, 0): the green bottle bank with its round hole, the blue paper
 * container with its slot, the yellow plastic one with its flap; a picture on the front says what goes in. */
function Container({ stuff }: { stuff: Stuff }) {
  const fill = stuff === "glass" ? "#40c057" : stuff === "paper" ? "#1c7ed6" : "#fcc419";
  const dark = stuff === "glass" ? "#2b8a3e" : stuff === "paper" ? "#1864ab" : "#e8a317";
  return (
    <g>
      <ellipse cx="0" cy="4" rx="150" ry="12" fill="#000" opacity="0.12" />
      {stuff === "glass" ? (
        <path d="M-130 0 V-150 Q-130 -240 0 -240 Q130 -240 130 -150 V0 Z" fill={fill} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      ) : (
        <rect x="-140" y="-230" width="280" height="230" rx="14" fill={fill} stroke={INK} strokeWidth="5" />
      )}
      <rect x="-140" y="-20" width="280" height="20" fill={dark} opacity="0.5" />
      {stuff === "glass" && <circle cx="0" cy="-196" r="28" fill="#212529" stroke={INK} strokeWidth="4" />}
      {stuff === "paper" && <rect x="-70" y="-212" width="140" height="22" rx="8" fill="#212529" stroke={INK} strokeWidth="4" />}
      {stuff === "plastic" && (
        <g>
          <rect x="-150" y="-246" width="300" height="24" rx="8" fill={dark} stroke={INK} strokeWidth="4" />
          <rect x="-50" y="-222" width="100" height="22" rx="6" fill="#212529" stroke={INK} strokeWidth="3" />
        </g>
      )}
      <g transform="translate(0 -60) scale(0.9)">
        <circle r="46" fill="#fff" stroke={INK} strokeWidth="4" />
        <g transform="translate(0 24)">
          <Thing stuff={stuff} />
        </g>
      </g>
    </g>
  );
}

/** A thing to take to the yard, standing on (0, 0): a green glass bottle, a folded newspaper, a plastic bottle. */
function Thing({ stuff }: { stuff: Stuff }) {
  if (stuff === "glass")
    return (
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <path d="M-14 0 V-36 Q-14 -46 -6 -50 V-66 H6 V-50 Q14 -46 14 -36 V0 Z" fill="#69db7c" />
        <path d="M-7 -38 V-8" stroke="#fff" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" />
      </g>
    );
  if (stuff === "paper")
    return (
      <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
        <rect x="-26" y="-40" width="52" height="40" fill="#f8f9fa" />
        <path d="M-18 -30 H18 M-18 -20 H6 M-18 -10 H18" stroke="#868e96" strokeWidth="3" />
      </g>
    );
  return (
    <g stroke={INK} strokeWidth="3" strokeLinejoin="round">
      <path d="M-14 0 V-40 Q-14 -50 -6 -52 V-62 H6 V-52 Q14 -50 14 -40 V0 Z" fill="#a5d8ff" />
      <rect x="-7" y="-70" width="14" height="10" rx="2" fill="#e03131" />
    </g>
  );
}

/** A wooden crate with the three things in it, standing on (0, 0); a thing taken out is no longer drawn. */
function Crate({ left }: { left: Stuff[] }) {
  return (
    <g>
      {left.map((s) => (
        <g key={s} transform={`translate(${CRATE_SPOT[s]} -40)`}>
          <Thing stuff={s} />
        </g>
      ))}
      <rect x="-80" y="-56" width="160" height="56" rx="6" fill="#d9a066" stroke={INK} strokeWidth="4" />
      <path d="M-80 -28 H80" stroke="#b07a46" strokeWidth="5" />
    </g>
  );
}
/** Where each thing stands in the crate, from its middle. */
const CRATE_SPOT: Record<Stuff, number> = { glass: -46, paper: 2, plastic: 50 };

// ---------- Icons and cards ----------

const pic = (w: number, h: number, draw: () => ReactNode): Picture => ({ w, h, draw });

const BINS_ICON = pic(420, 240, () => (
  <g transform="scale(1.2)">
    {BIN_KINDS.map((kind, i) => (
      <g key={kind} transform={`translate(${(i - 1) * 110} 0)`}>
        <Bin kind={kind} />
      </g>
    ))}
  </g>
));
const STREET_ICON = pic(500, 260, () => (
  <g>
    <g transform="translate(-130 0)">
      <Child pose="walk" />
    </g>
    <g transform="translate(60 0) scale(1.1)">
      <Bin kind="grau" />
    </g>
  </g>
));
const TRUCK_ICON = pic(840, 640, () => (
  <g transform="translate(-60 0)">
    <Truck bin="grau" tipping />
  </g>
));
const YARD_ICON = pic(980, 300, () => (
  <g transform="scale(1.1)">
    {STUFF.map((s, i) => (
      <g key={s} transform={`translate(${(i - 1) * 300} 0)`}>
        <Container stuff={s} />
      </g>
    ))}
  </g>
));

/** The picked bin close up, its lid up and what lies in it showing: its card in the choice. */
const binCard = (kind: BinKind) =>
  pic(300, 340, () => (
    <g transform="translate(-10 -10) scale(1.7)">
      <Bin kind={kind} open />
    </g>
  ));

// ---------- At the house ----------

const OUR_HOUSE = 520;
/** Where each bin stands beside the house. */
const BIN_SPOT: Record<BinKind, number> = { grau: 980, blau: 1140, gelb: 1300 };

function BinsDraw() {
  return (
    <g>
      <Outdoors />
      <BackHouse x={OUR_HOUSE} w={420} h={380} wall="#fff3bf" roof="#1971c2" />
      {BIN_KINDS.map((kind) => (
        <g key={kind} transform={`translate(${BIN_SPOT[kind]} ${GROUND + 10}) scale(1.25)`}>
          <Bin kind={kind} />
        </g>
      ))}
      <g transform={`translate(560 ${GROUND + 14})`}>
        <Grownup look={PARENT} pose="stand" />
      </g>
      <g transform={`translate(780 ${GROUND + 14})`}>
        <Child pose="stand" />
      </g>
    </g>
  );
}

const BIN_SAY: Record<BinKind, string> = {
  grau: "The grey bin, with the rubbish bags!",
  blau: "The blue bin, with the paper!",
  gelb: "The yellow bin, with the plastic!",
};
const BIN_SOUND: Record<BinKind, Cue[]> = { grau: [[0, playRustle]], blau: [[0, playRip]], gelb: [[0, playPlop]] };

const bins: Scene = {
  id: "tonnen",
  icon: BINS_ICON,
  focus: [100, 200, 1400, 640],
  Draw: BinsDraw,
  beats: [{ ms: 3400, say: "Today the rubbish truck comes!" }],
  choice: {
    ask: "Which bin goes out today?",
    options: BIN_KINDS.map((kind) => ({
      id: kind,
      picture: binCard(kind),
      card: binCard(kind),
      sounds: BIN_SOUND[kind],
      at: [BIN_SPOT[kind], GROUND - 80] as Point,
      r: 70,
      say: BIN_SAY[kind],
    })),
  },
};

// ---------- Out to the street ----------

/** The pavement the bin and the family stand on, and the lane the truck drives along in front of it. */
const PAVEMENT = GROUND + 14;
const LANE = PAVEMENT + 80;
const BIN_START = 400;
/** Where the bin stands at the kerb, and the truck once it has backed up to it. */
const KERB_X = 760;
const TRUCK_STOP = KERB_X + REACH;
const PUSH_MS = 4000;

/** The street with our house on the left and the neighbours' houses behind. */
function Street() {
  return (
    <g>
      <Outdoors />
      <BackHouse x={260} w={300} h={360} wall="#fff3bf" roof="#1971c2" />
      <BackHouse x={920} w={180} h={280} wall="#e6fcf5" roof="#2b8a3e" />
      <BackHouse x={1320} w={220} h={320} wall="#f3d9fa" roof="#9c36b5" />
      <Road />
    </g>
  );
}

function StreetDraw({ step, busy, picks }: SceneProps) {
  const pushed = (from: number): Point[] =>
    route<Point[]>(step, [
      [0, [[from, PAVEMENT]]],
      [
        2,
        [
          [from, PAVEMENT],
          [from + KERB_X - BIN_START, PAVEMENT],
        ],
      ],
    ]);
  const truck = route<Point[]>(step, [
    [0, [[TRUCK_STOP + 1700, LANE]]],
    [
      3,
      [
        [TRUCK_STOP + 1700, LANE],
        [TRUCK_STOP, LANE],
      ],
    ],
  ]);
  const walking = busy && step === 2;
  return (
    <g>
      <Street />
      <Go path={pushed(BIN_START - 190)} ms={PUSH_MS}>
        <Grownup look={PARENT} pose={walking ? "walk" : "stand"} />
      </Go>
      <Go path={pushed(BIN_START)} ms={PUSH_MS}>
        <Bin kind={binOf(picks)} />
      </Go>
      <Go path={pushed(BIN_START - 90)} ms={PUSH_MS}>
        <Child pose={walking ? "walk" : "stand"} />
      </Go>
      <Go path={truck} ms={5000}>
        <Truck rolling={busy && step === 3} />
      </Go>
    </g>
  );
}

const street: Scene = {
  id: "strasse",
  icon: STREET_ICON,
  focus: [100, 200, 1400, 640],
  Draw: StreetDraw,
  beats: [
    { ms: 3400, say: "Let's take the bin out to the street." },
    {
      tap: { at: [BIN_START, PAVEMENT - 80], r: 90 },
      ask: "Push the bin to the street!",
      sounds: [[200, playRumble]],
      say: "Roll, roll, roll. The bin waits at the street.",
      ms: 4800,
    },
    {
      ms: 6000,
      sounds: [
        [0, engine],
        [3400, playBeeps],
      ],
      say: "Here comes the rubbish truck. It backs up slowly.",
    },
  ],
};

// ---------- The arm and the press ----------

function LiftDraw({ step, busy, picks }: SceneProps) {
  const kind = binOf(picks);
  const gone = step >= 5;
  const truck = route<Point[]>(step, [
    [0, [[TRUCK_STOP, LANE]]],
    [
      5,
      [
        [TRUCK_STOP, LANE],
        [TRUCK_STOP + 1800, LANE],
      ],
    ],
  ]);
  return (
    <g>
      <Street />
      <g transform={`translate(${KERB_X - 330} ${PAVEMENT})`}>
        <Grownup look={PARENT} pose="stand" />
      </g>
      <g transform={`translate(${KERB_X - 200} ${PAVEMENT})`}>
        <Child pose={busy && step === 2 ? "cheer" : "stand"} />
      </g>
      {gone && (
        <g transform={`translate(${KERB_X} ${PAVEMENT})`}>
          <Bin kind={kind} />
        </g>
      )}
      <Go path={truck} ms={4400}>
        <Truck bin={gone ? null : kind} tipping={step === 2} pressing={busy && step === 4} rolling={busy && step === 5} />
      </Go>
    </g>
  );
}

/** The press's button on the truck's side, in the picture. */
const BUTTON: Point = [TRUCK_STOP - 150, LANE - 196];

const lift: Scene = {
  id: "greifarm",
  icon: TRUCK_ICON,
  focus: [300, 160, 1250, 700],
  Draw: LiftDraw,
  beats: [
    { ms: 3200, say: "The truck has a strong arm. It holds our bin." },
    {
      tap: { at: [KERB_X - 10, PAVEMENT - 90], r: 100 },
      ask: "Lift the bin!",
      sounds: [
        [0, playWhirr],
        [2400, playRumble],
      ],
      say: "Up goes the bin, and everything falls in!",
      ms: 5400,
    },
    {
      ms: 4200,
      sounds: [
        [0, playWhirr],
        [2300, playThump],
      ],
      say: "Down it goes. The bin is empty.",
    },
    {
      tap: { at: BUTTON, r: 80 },
      ask: "Press the green button!",
      sounds: [
        [0, playWhirr],
        [1400, playWhirr],
      ],
      say: "Mmmm. The press squeezes it all small.",
      ms: 4400,
    },
    { ms: 4800, sounds: [[0, engine]], say: "Bye, rubbish truck! See you next week." },
  ],
};

// ---------- The recycling yard ----------

const CRATE_X = 430;
/** The crate and its things are drawn this much bigger, so a small hand finds each thing. */
const CRATE_SCALE = 1.3;
const ITEM_MS = 1800;
/** Where each thing stands in the crate, in the picture. */
const IN_CRATE = (s: Stuff): Point => [CRATE_X + CRATE_SPOT[s] * CRATE_SCALE, GROUND + 10 - 40 * CRATE_SCALE];

function YardDraw({ step, busy }: SceneProps) {
  // The things go one after the other: the glass at step 2, the paper at 3, the plastic at 4.
  const at = (s: Stuff) => 2 + STUFF.indexOf(s);
  const left = STUFF.filter((s) => step < at(s));
  const flying = STUFF.find((s) => step === at(s));
  return (
    <g>
      <Outdoors ground="#dee2e6" />
      <path
        d={`M-200 ${GROUND - 60} H1800 ${Array.from({ length: 21 }, (_, i) => `M${-200 + i * 100} ${GROUND - 120} V${GROUND - 4}`).join(" ")}`}
        stroke="#adb5bd"
        strokeWidth="6"
      />
      {STUFF.map((s) => (
        <g key={s} transform={`translate(${CONTAINER_X[s]} ${GROUND + 10})`}>
          <Container stuff={s} />
        </g>
      ))}
      <g transform={`translate(170 ${GROUND + 14})`}>
        <Grownup look={PARENT} pose="stand" />
      </g>
      <g transform={`translate(${CRATE_X} ${GROUND + 10}) scale(${CRATE_SCALE})`}>
        <Crate left={left} />
      </g>
      <g transform={`translate(${CRATE_X - 150} ${GROUND + 14})`}>
        <Child pose={busy && step === 5 ? "cheer" : busy && flying ? "reach" : "stand"} />
      </g>
      {/* Each thing has its Go from the start (a Go's first path only places it), drawn only while it flies. */}
      {STUFF.map((s) => {
        const path = route<Point[]>(step, [
          [0, [IN_CRATE(s)]],
          [at(s), [IN_CRATE(s), [CONTAINER_X[s], OPENING_Y - 140], [CONTAINER_X[s], OPENING_Y + 20]]],
        ]);
        return (
          <Go key={s} path={path} ms={ITEM_MS} className={s === flying ? "fm-mu-into" : undefined}>
            {s === flying && (
              <g transform={`scale(${CRATE_SCALE})`}>
                <Thing stuff={s} />
              </g>
            )}
          </Go>
        );
      })}
    </g>
  );
}

const yard: Scene = {
  id: "wertstoffhof",
  icon: YARD_ICON,
  focus: [100, 200, 1400, 640],
  Draw: YardDraw,
  beats: [
    { ms: 4400, say: "Now we go to the recycling yard. Everything has its own place." },
    {
      tap: { at: [IN_CRATE("glass")[0], IN_CRATE("glass")[1] - 40], r: 60 },
      ask: "The glass goes in the green one!",
      sounds: [[1900, playClonk]],
      say: "Clink! The glass is in.",
      ms: 3600,
    },
    {
      tap: { at: [IN_CRATE("paper")[0], IN_CRATE("paper")[1] - 20], r: 60 },
      ask: "The paper goes in the blue one!",
      sounds: [[1900, playRustle]],
      say: "Swish! The paper is in.",
      ms: 3600,
    },
    {
      tap: { at: [IN_CRATE("plastic")[0], IN_CRATE("plastic")[1] - 40], r: 60 },
      ask: "The plastic goes in the yellow one!",
      sounds: [[1900, playPlop]],
      say: "Plop! The plastic is in.",
      ms: 3600,
    },
    { ms: 3400, sounds: [[0, playChime]], say: "Everything is in its place!" },
  ],
};

/** „The rubbish truck“: the bin out to the street, the truck's arm and press, and the recycling yard. */
export const MUELL: Film = {
  id: "muell",
  first: "en",
  title: "The rubbish truck",
  end: "Thank you, rubbish truck! Now everything is clean.",
  scenes: (picks) => (picks[0] ? [bins, street, lift, yard] : [bins]),
};
