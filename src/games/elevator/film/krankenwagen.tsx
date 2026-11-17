import type { ReactNode } from "react";
import { INK } from "@/components/drawing";
import { playEngine, playHonk } from "@/lib/realSounds";
import { playAlarm, playChime, playClick, playPlop, playPop, playRecorded, playRing, playRustle, playSiren } from "@/lib/sfx";
import { Kid, KidHead, type Look, type Pose, useHero } from "../kid";
import type { Picture } from "../trail/items";
import type { Cue, Point } from "../trail/types";
import { Go, route } from "./move";
import { Grownup } from "./people";
import { AlarmBell, BackHouse, Outdoors, Road, RoundTree } from "./places";
import { type Beat, type Box, type Film, GROUND, type Option, type Scene, type SceneProps } from "./types";

// „The ambulance“ (G-19, the first of the helpers in town; written English first): the child picks who needs help (a
// little bear who fell off a bike with a sore knee, or off a scooter with a sore elbow), sees the grown-up call the
// ambulance, rides out with the paramedic, helps with a plaster, and drives home. Harmless: nobody is badly hurt, nobody
// cries, and every pick ends the same happy way.

const siren = () => playRecorded("siren", playSiren);
const alarm = () => playRecorded("alarm", playAlarm);
const engine = () => playRecorded("engine", playEngine);
const honk = () => playRecorded("honk", playHonk);

/** What the little bear fell off. */
export type Fall = "bike" | "scooter";
const FALLS: Fall[] = ["bike", "scooter"];

/** Where the ambulance comes from and goes to, out of the picture. */
const AWAY = -800;
/** The lane the ambulance drives on, in front of the pavement. */
const LANE = 830;
/** The pavement's top on the drive, where the houses stand. */
const DRIVE_ROAD = 740;

const CUB: Look = { shirt: "#4dabf7", pants: "#364fc7", hair: "#a0522d", animal: "bear" };
const PARENT: Look = { shirt: "#e64980", pants: "#5f3dc4", hair: "#343a40", curly: true, animal: "fox", lashes: true };
const MEDIC: Look = { shirt: "#ff922b", pants: "#2b3a55", hair: "#5c3d2e", animal: "fox" };
const DRIVER: Look = { shirt: "#ff922b", pants: "#2b3a55", hair: "#e8b04b", curly: true, animal: "bear", lashes: true };

/** The child in its own clothes. */
function Child({ pose, face = 1 }: { pose: Pose; face?: 1 | -1 }) {
  const hero = useHero();
  return <Kid look={hero} pose={pose} holding={null} wear={[]} face={face} />;
}

/** Something that pops in when it appears. */
function Pop({ children }: { children: ReactNode }) {
  return <g className="fm-pop">{children}</g>;
}

// ---------- Things ----------

const WHITE = "#f8f9fa";
const AMB_RED = "#e03131";

/**
 * The ambulance, facing right with its wheels on (0, 0): a white box with a red stripe and a big red cross, the cab with
 * the paramedic and the child behind its window (`crew`), a blue light on the roof (blinking while `light`) and the
 * wheels, which turn while `driving`.
 */
export function Ambulance({ light = false, driving = false, crew = false }: { light?: boolean; driving?: boolean; crew?: boolean }) {
  const hero = useHero();
  return (
    <g className="fm-truck">
      <ellipse cx="0" cy="2" rx="360" ry="16" fill="#000" opacity="0.15" />
      {/* The box with its stripe, the cross, the back doors and the wheel arches */}
      <rect x="-310" y="-250" width="470" height="196" rx="16" fill={WHITE} stroke={INK} strokeWidth="4" />
      <path d="M-296 -240 H146" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <rect x="-310" y="-130" width="470" height="30" fill={AMB_RED} stroke={INK} strokeWidth="3" />
      <g transform="translate(-60 -190)">
        <rect x="-18" y="-50" width="36" height="100" rx="5" fill={AMB_RED} stroke={INK} strokeWidth="4" />
        <rect x="-50" y="-18" width="100" height="36" rx="5" fill={AMB_RED} stroke={INK} strokeWidth="4" />
        <rect x="-14" y="-18" width="28" height="36" fill={AMB_RED} />
      </g>
      <rect x="-306" y="-240" width="52" height="170" rx="6" fill="#e9ecef" stroke={INK} strokeWidth="3" />
      <rect x="-290" y="-196" width="20" height="10" rx="4" fill="#868e96" />
      {[-196, 196].map((x) => (
        <path key={x} d={`M${x - 58} -54 A58 58 0 0 1 ${x + 58} -54 Z`} fill="#adb5bd" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      ))}
      <rect x="-326" y="-76" width="32" height="14" rx="4" fill="#ff6b6b" stroke={INK} strokeWidth="2.5" />
      {/* The cab: window with the crew, door, mirror, headlight and bumper */}
      <path d="M160 -54 V-246 H274 Q290 -246 296 -232 L330 -150 V-54 Z" fill={WHITE} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M176 -54 V-236 H272 Q282 -236 286 -226 L302 -190" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M172 -228 H272 L300 -162 H172 Z" fill="#a5d8ff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M184 -216 l24 -8 M182 -200 l14 -4" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      {crew && (
        <g>
          <g transform="translate(204 -116) scale(0.5)">
            <KidHead look={MEDIC} />
          </g>
          <g transform="translate(262 -108) scale(0.46)">
            <KidHead look={hero} />
          </g>
        </g>
      )}
      <path d="M172 -162 H302" stroke={INK} strokeWidth="3" />
      <rect x="160" y="-110" width="170" height="26" fill={AMB_RED} stroke={INK} strokeWidth="3" />
      <path d="M172 -240 V-60 H300" stroke={INK} strokeWidth="3" fill="none" />
      <circle cx="318" cy="-100" r="13" fill="#ffe066" stroke={INK} strokeWidth="3" />
      <circle cx="314" cy="-104" r="4" fill="#fff" />
      <rect x="294" y="-76" width="50" height="22" rx="8" fill="#adb5bd" stroke={INK} strokeWidth="3" />
      <rect x="330" y="-214" width="10" height="34" rx="4" fill="#495057" stroke={INK} strokeWidth="2" />
      {/* The blue lights: one bar on the roof of the cab, one on the box */}
      <g className={`fm-blue${light ? " on" : ""}`}>
        <circle className="fm-blue-glow" cx="236" cy="-270" r="36" fill="#74c0fc" />
        <circle className="fm-blue-glow" cx="-250" cy="-266" r="28" fill="#74c0fc" />
        <rect x="212" y="-282" width="48" height="24" rx="8" fill="#4dabf7" stroke={INK} strokeWidth="3" />
        <rect x="-268" y="-276" width="36" height="20" rx="7" fill="#4dabf7" stroke={INK} strokeWidth="3" />
      </g>
      {/* The wheels */}
      {[-196, 196].map((x) => (
        <g key={x} transform={`translate(${x} -44)`}>
          <g className={driving ? "fm-wheel spin" : "fm-wheel"}>
            <circle r="44" fill="#343a40" stroke={INK} strokeWidth="4" />
            <circle r="34" fill="none" stroke="#495057" strokeWidth="3" />
            <circle r="20" fill="#ced4da" stroke={INK} strokeWidth="3" />
            <path d="M-20 0 H20 M0 -20 V20" stroke="#868e96" strokeWidth="4" />
            <circle r="6" fill="#495057" />
          </g>
        </g>
      ))}
    </g>
  );
}

/** A bicycle lying on its side on the ground, centred on (0, 0): the wheels are round, so it shows them tipped. */
function BikeLying() {
  return (
    <g transform="translate(0 -30) rotate(-34)">
      {[-62, 62].map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <circle r="40" fill="none" stroke="#343a40" strokeWidth="9" />
          <circle r="34" fill="none" stroke="#adb5bd" strokeWidth="2" />
          <path d="M-34 0 H34 M0 -34 V34" stroke="#ced4da" strokeWidth="2.5" />
          <circle r="6" fill="#495057" />
        </g>
      ))}
      <path
        d="M-62 0 L-14 -40 H34 L62 0 M-14 -40 L-30 0 H20 L34 -40 M20 0 L-14 -40"
        stroke="#e03131"
        strokeWidth="8"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M-32 -48 H4" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M34 -40 L42 -66 H64" stroke="#495057" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** A scooter lying on its side on the ground, centred on (0, 0). */
function ScooterLying() {
  return (
    <g transform="translate(0 -24) rotate(-30)">
      {[-70, 78].map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <circle r="26" fill="#343a40" stroke={INK} strokeWidth="4" />
          <circle r="12" fill="#ced4da" stroke={INK} strokeWidth="2.5" />
        </g>
      ))}
      <rect x="-74" y="-34" width="150" height="14" rx="6" fill="#40c057" stroke={INK} strokeWidth="4" />
      <path d="M72 -34 L58 -150" stroke="#868e96" strokeWidth="10" strokeLinecap="round" />
      <path d="M38 -152 H80" stroke="#343a40" strokeWidth="10" strokeLinecap="round" />
    </g>
  );
}

const TOY: Record<Fall, () => ReactNode> = { bike: () => <BikeLying />, scooter: () => <ScooterLying /> };

/** Where the sore spot is on the sitting bear, from its middle: the bent knee, or the elbow of the arm held at the side. */
const SORE: Record<Fall, Point> = { bike: [74, -60], scooter: [-44, -54] };

/**
 * The little bear sitting on the ground with its legs out, centred on (0, 0): a bent knee, an arm resting at its side
 * and a soft pink graze on the sore spot (`fall`), covered by a plaster once `plaster`. Looking out at the child with
 * a small smile: nothing here is scary.
 */
function SittingCub({ fall, plaster }: { fall: Fall; plaster: boolean }) {
  const [sx, sy] = SORE[fall];
  return (
    <g>
      <ellipse cx="40" cy="0" rx="120" ry="10" fill="#000" opacity="0.14" />
      {/* Legs: the near one bent up at the knee, the other stretched out */}
      <path d="M10 -26 L74 -60 L128 -12" stroke={CUB.pants} strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M10 -22 L120 -22" stroke={CUB.pants} strokeWidth="24" strokeLinecap="round" fill="none" opacity="0.85" />
      <ellipse cx="136" cy="-14" rx="16" ry="11" fill="#495057" />
      {/* The body, an arm hanging with its elbow out, and the head */}
      <rect x="-26" y="-84" width="52" height="66" rx="20" fill={CUB.shirt} />
      <path d="M-18 -74 Q-48 -62 -44 -54 Q-42 -36 -26 -28" stroke={CUB.shirt} strokeWidth="17" strokeLinecap="round" fill="none" />
      <circle cx="-26" cy="-26" r="10" fill="#d9a066" />
      <g transform="translate(0 40) scale(0.9)">
        <KidHead look={CUB} />
      </g>
      {!plaster && <ellipse cx={sx} cy={sy} rx="13" ry="10" fill="#ffa8a8" opacity="0.9" />}
      {plaster && (
        <g transform={`translate(${sx} ${sy}) rotate(-20)`}>
          <Plaster />
        </g>
      )}
    </g>
  );
}

/** A plaster, centred on (0, 0) in about 56 × 22. */
function Plaster() {
  return (
    <g>
      <rect x="-28" y="-11" width="56" height="22" rx="8" fill="#ffd8a8" stroke={INK} strokeWidth="3" />
      <rect x="-11" y="-11" width="22" height="22" fill="#fff4e6" stroke={INK} strokeWidth="2" />
      <path d="M-22 -4 h5 M-22 4 h5 M17 -4 h5 M17 4 h5" stroke="#e8a35c" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

/** The paramedic's bag, centred on (0, 0): red with a white cross, its lid open with a plaster showing once `open`. */
function Bag({ open }: { open: boolean }) {
  return (
    <g>
      <rect x="-36" y="-22" width="72" height="50" rx="10" fill={AMB_RED} stroke={INK} strokeWidth="4" />
      <path d="M-18 -22 Q0 -42 18 -22" stroke={INK} strokeWidth="5" fill="none" />
      <rect x="-5" y="-12" width="10" height="30" rx="2" fill="#fff" />
      <rect x="-15" y="-2" width="30" height="10" rx="2" fill="#fff" />
      {open && (
        <g>
          <path d="M-36 -22 L-46 -56 H46 L36 -22 Z" fill="#c92a2a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <g transform="translate(0 -68) rotate(-12)">
            <Plaster />
          </g>
        </g>
      )}
    </g>
  );
}

// ---------- Small pictures: the strip of scenes and the choices ----------

const pic = (w: number, h: number, draw: () => ReactNode): Picture => ({ w, h, draw });

const PARK_ICON = pic(300, 220, () => (
  <g>
    <circle cx="-60" cy="-150" r="50" fill="#69db7c" stroke={INK} strokeWidth="6" />
    <rect x="-70" y="-110" width="20" height="110" fill="#8d5a3b" stroke={INK} strokeWidth="5" />
    <ellipse cx="60" cy="-10" rx="80" ry="18" fill="#b2f2bb" stroke={INK} strokeWidth="5" />
  </g>
));
const PHONE_ICON = pic(160, 160, () => (
  <g>
    <rect x="-50" y="-150" width="100" height="150" rx="16" fill="#343a40" stroke={INK} strokeWidth="6" />
    <rect x="-36" y="-134" width="72" height="100" rx="6" fill="#a5d8ff" />
    <path d="M-14 -92 q-8 -14 4 -22 l8 10 q-6 6 0 14 q6 8 14 2 l8 10 q-10 10 -22 0 Z" fill="#40c057" />
  </g>
));
const STATION_ICON = pic(300, 240, () => (
  <g>
    <rect x="-140" y="-190" width="280" height="190" fill={WHITE} stroke={INK} strokeWidth="6" />
    <rect x="-100" y="-120" width="200" height="120" fill="#868e96" stroke={INK} strokeWidth="5" />
    <rect x="-16" y="-180" width="32" height="64" fill={AMB_RED} stroke={INK} strokeWidth="4" />
    <rect x="-36" y="-160" width="72" height="24" fill={AMB_RED} stroke={INK} strokeWidth="4" />
  </g>
));
const AMBULANCE_ICON = pic(720, 340, () => <Ambulance light />);
const BAG_ICON = pic(200, 160, () => (
  <g transform="scale(1.8) translate(0 -28)">
    <Bag open />
  </g>
));
const HOME_ICON = pic(300, 240, () => (
  <g>
    <rect x="-130" y="-150" width="260" height="150" fill={WHITE} stroke={INK} strokeWidth="6" />
    <path d="M-150 -150 L0 -230 L150 -150 Z" fill={AMB_RED} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
    <rect x="-34" y="-90" width="68" height="90" fill="#ffe3e3" stroke={INK} strokeWidth="5" />
  </g>
));
const BIKE_ICON = pic(400, 300, () => <BikeLying />);
const SCOOTER_ICON = pic(360, 320, () => <ScooterLying />);
const FALL_ICON: Record<Fall, Picture> = { bike: BIKE_ICON, scooter: SCOOTER_ICON };

// ---------- The park: who needs the ambulance? ----------

/** Where the little bear sits in the park, and the toy it fell off lies beside it, on each side of the picture. */
const PARK_SEAT: Record<Fall, number> = { bike: 470, scooter: 1190 };
const TOY_SIDE: Record<Fall, number> = { bike: 730, scooter: 1450 };

/** The park's paths, trees and houses in the back; the places of the call, the help and the choice stand on it. */
function ParkBack({ children }: { children?: ReactNode }) {
  return (
    <g>
      <Outdoors />
      <BackHouse x={-120} w={260} h={330} wall="#d0ebff" roof="#5c7cfa" />
      <BackHouse x={1700} w={240} h={300} wall="#fff3bf" roof="#e8590c" />
      <RoundTree x={140} s={1.1} />
      <RoundTree x={1640} s={0.9} />
      <Road />
      {children}
    </g>
  );
}

function TownDraw() {
  return (
    <ParkBack>
      {FALLS.map((fall) => (
        <g key={fall}>
          <g transform={`translate(${TOY_SIDE[fall]} ${GROUND - 4})`}>{TOY[fall]()}</g>
          <g transform={`translate(${PARK_SEAT[fall]} ${GROUND - 4})`}>
            <SittingCub fall={fall} plaster={false} />
          </g>
        </g>
      ))}
    </ParkBack>
  );
}

/** A part of the park, `[left, top, width, height]`, as a picture for a choice's card. */
const townPart = ([x, y, w, h]: Box): Picture =>
  pic(w, h, () => (
    <g transform={`translate(${-(x + w / 2)} ${-(y + h)})`}>
      <TownDraw />
    </g>
  ));

const FALL_CARD: Record<Fall, Picture> = { bike: townPart([120, 560, 520, 240]), scooter: townPart([880, 560, 520, 240]) };
const FALL_SOUND: Record<Fall, Cue[]> = { bike: [[0, playPlop]], scooter: [[0, playPop]] };
const FALL_SAY: Record<Fall, string> = { bike: "The little bear fell off the bike!", scooter: "The little bear fell off the scooter!" };
const SORE_WORD: Record<Fall, string> = { bike: "knee", scooter: "elbow" };

const park: Scene = {
  id: "park",
  icon: PARK_ICON,
  focus: [60, 400, 1500, 480],
  Draw: TownDraw,
  beats: [{ ms: 600 }],
  choice: {
    ask: "Who needs the ambulance today?",
    options: FALLS.map(
      (fall): Option => ({
        id: fall,
        picture: FALL_ICON[fall],
        card: FALL_CARD[fall],
        sounds: FALL_SOUND[fall],
        at: [PARK_SEAT[fall] + 40, GROUND - 130],
        r: 190,
        say: FALL_SAY[fall],
      }),
    ),
  },
};

// ---------- The call ----------

const SEAT = 760;
const PARENT_AT = 1200;

/** The park of the picked fall: the little bear sitting beside what it fell off, its grown-up standing by. */
function CallDraw({ step, picks }: SceneProps) {
  const fall = picks[0] as Fall;
  return (
    <ParkBack>
      <g transform={`translate(${SEAT + 230} ${GROUND - 4})`}>{TOY[fall]()}</g>
      <g transform={`translate(${SEAT} ${GROUND - 4})`}>
        <SittingCub fall={fall} plaster={false} />
      </g>
      <g transform={`translate(${PARENT_AT} ${GROUND})`}>
        <Grownup look={PARENT} pose={step >= 2 ? "phone" : "stand"} face={-1} />
      </g>
    </ParkBack>
  );
}

function callScene(fall: Fall): Scene {
  const sore = SORE_WORD[fall];
  return {
    id: `call-${fall}`,
    icon: PHONE_ICON,
    focus: [330, 360, 1050, 540],
    Draw: CallDraw,
    beats: [
      { ms: 3400, sounds: [[0, playPlop]], say: `Oops! The ${fall} tipped over. Ouch, a sore ${sore}.` },
      {
        tap: { at: [PARENT_AT, GROUND - 150], r: 150 },
        ask: "Who helps? Call the ambulance!",
        sounds: [
          [0, playRing],
          [1000, playRing],
        ],
        say: `Hello, ambulance? Please come, someone has a sore ${sore}.`,
        ms: 3800,
      },
    ],
  };
}

// ---------- The rescue station ----------

const GARAGE_X = 380;
const AMB_X = 1010;

/** The rescue station: a white building with a red cross over its open garage, the alarm bell by the door. */
function StationBack({ ring, children }: { ring: boolean; children?: ReactNode }) {
  return (
    <g>
      <Outdoors />
      <g transform={`translate(${GARAGE_X} ${GROUND})`}>
        <rect x="-300" y="-330" width="600" height="330" fill={WHITE} stroke={INK} strokeWidth="4" />
        <path d="M-320 -330 H320 L260 -400 H-260 Z" fill={AMB_RED} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M-300 -24 H300" stroke={INK} strokeOpacity="0.15" strokeWidth="30" />
        <rect x="-230" y="-250" width="460" height="250" rx="8" fill="#6c757d" stroke={INK} strokeWidth="4" />
        <path d="M-230 -226 H230 M-230 -196 H230 M-230 -166 H230" stroke="#868e96" strokeWidth="4" />
        <g transform="translate(0 -370)">
          <rect x="-12" y="-34" width="24" height="68" rx="4" fill="#fff" stroke={INK} strokeWidth="3" />
          <rect x="-34" y="-12" width="68" height="24" rx="4" fill="#fff" stroke={INK} strokeWidth="3" />
        </g>
        {[-270, 250].map((x) => (
          <rect key={x} x={x} y="-120" width="20" height="120" fill="#adb5bd" stroke={INK} strokeWidth="3" />
        ))}
      </g>
      <g transform="translate(640 -0)">
        <g transform={`translate(0 ${GROUND - 220}) scale(0.9)`}>
          <AlarmBell ring={ring} />
        </g>
      </g>
      <RoundTree x={1560} s={1} />
      <Road />
      {children}
    </g>
  );
}

/** The paramedic and the child, boarding at the cab's door. */
function Boarders({ step, busy }: { step: number; busy: boolean }) {
  const medic = route<Point[]>(step, [
    [0, [[560, GROUND]]],
    [
      2,
      [
        [560, GROUND],
        [AMB_X + 200, GROUND],
      ],
    ],
  ]);
  const child = route<Point[]>(step, [
    [0, [[680, GROUND]]],
    [
      2,
      [
        [680, GROUND],
        [AMB_X + 270, GROUND],
      ],
    ],
  ]);
  if (step >= 3 || (step === 2 && !busy)) return null;
  return (
    <>
      <Go path={medic} ms={2400}>
        <Grownup look={MEDIC} pose={step === 2 && busy ? "walk" : "stand"} wear={["rescue"]} face={1} />
      </Go>
      <Go path={child} ms={2400} delay={300}>
        <Child pose={step === 2 && busy ? "walk" : "stand"} />
      </Go>
    </>
  );
}

function StationDraw({ step, busy }: SceneProps) {
  const ambulance = route<Point[]>(step, [
    [0, [[AMB_X, GROUND]]],
    [
      4,
      [
        [AMB_X, GROUND],
        [2900, GROUND],
      ],
    ],
  ]);
  return (
    <StationBack ring={step === 1 && busy}>
      <Boarders step={step} busy={busy} />
      <Go path={ambulance} ms={3200}>
        <Ambulance crew={step >= 3} driving={busy && step === 4} />
      </Go>
    </StationBack>
  );
}

const station: Scene = {
  id: "station",
  icon: STATION_ICON,
  focus: [160, 340, 1280, 540],
  Draw: StationDraw,
  beats: [
    { ms: 3200, sounds: [[0, alarm]], say: "Ring ring! The ambulance is needed." },
    {
      tap: { at: [AMB_X + 250, GROUND - 130], r: 130 },
      ask: "Hop in!",
      sounds: [[0, playClick]],
      say: "Hop in, we are going to help.",
      ms: 3000,
    },
    { ms: 900, sounds: [[0, playPop]] },
    { ms: 3400, sounds: [[0, engine]] },
  ],
};

// ---------- The drive ----------

const DRIVE_STOP = 400;

function DriveDraw({ step, busy }: SceneProps) {
  const truck = route<Point[]>(step, [
    [0, [[AWAY, LANE]]],
    [
      1,
      [
        [AWAY, LANE],
        [DRIVE_STOP, LANE],
      ],
    ],
    [
      3,
      [
        [DRIVE_STOP, LANE],
        [2800, LANE],
      ],
    ],
  ]);
  return (
    <g>
      <Outdoors />
      {[
        [-160, 220, 340, "#d0ebff", "#5c7cfa"],
        [180, 200, 260, "#fff3bf", "#e8590c"],
        [520, 240, 380, "#e6fcf5", "#2b8a3e"],
        [880, 200, 300, "#f3d9fa", "#9c36b5"],
        [1240, 230, 360, "#ffe3e3", "#c92a2a"],
        [1600, 210, 280, "#d0ebff", "#1971c2"],
        [1940, 220, 340, "#fff3bf", "#e8590c"],
      ].map(([x, w, h, wall, roof]) => (
        <BackHouse key={x} x={x as number} w={w as number} h={h as number} wall={wall as string} roof={roof as string} base={DRIVE_ROAD} />
      ))}
      <Road top={DRIVE_ROAD} />
      <Go path={truck} ms={step >= 3 ? 2400 : 2000}>
        <Ambulance light={step >= 2} driving={busy && (step === 1 || step === 3)} crew />
      </Go>
    </g>
  );
}

const drive: Scene = {
  id: "drive",
  icon: AMBULANCE_ICON,
  focus: [100, 300, 1400, 600],
  Draw: DriveDraw,
  beats: [
    { ms: 2200, sounds: [[0, engine]] },
    {
      tap: { at: [DRIVE_STOP + 236, LANE - 262], r: 130 },
      ask: "Nee-naw! Switch on the blue light!",
      sounds: [[0, siren]],
      say: "Nee-naw, nee-naw! We are on our way.",
      ms: 2800,
    },
    { ms: 2500 },
  ],
};

// ---------- Help at the park ----------

const PARK_AMB = 120;
const MEDIC_STAND = 840;
const CHILD_STAND = 690;
const CUB_AT = 1080;
const MOM_AT = 1500;

function HelpDraw({ step, busy, picks }: SceneProps) {
  const fall = picks[0] as Fall;
  const ambulance = route<Point[]>(step, [
    [0, [[AWAY, GROUND]]],
    [
      1,
      [
        [AWAY, GROUND],
        [PARK_AMB, GROUND],
      ],
    ],
  ]);
  const out = step >= 2;
  const open = step >= 4;
  const patched = step >= 5;
  const cheering = step >= 6;
  const kidPath = route<Point[]>(step, [
    [0, [[PARK_AMB + 440, GROUND]]],
    [
      3,
      [
        [PARK_AMB + 440, GROUND],
        [CHILD_STAND, GROUND],
      ],
    ],
  ]);
  const medicPath = route<Point[]>(step, [
    [0, [[PARK_AMB + 400, GROUND]]],
    [
      3,
      [
        [PARK_AMB + 400, GROUND],
        [MEDIC_STAND, GROUND],
      ],
    ],
  ]);
  const walking = busy && step === 3;
  return (
    <ParkBack>
      <g transform={`translate(${CUB_AT + 250} ${GROUND - 4})`}>{TOY[fall]()}</g>
      <g transform={`translate(${CUB_AT} ${GROUND - 4})`}>
        <SittingCub fall={fall} plaster={patched} />
      </g>
      {step >= 3 && (
        <g transform={`translate(${MEDIC_STAND + 100} ${GROUND - 28})`}>
          <Pop>
            <Bag open={open} />
          </Pop>
        </g>
      )}
      <g transform={`translate(${MOM_AT} ${GROUND})`}>
        <Grownup look={PARENT} pose={cheering ? "cheer" : "stand"} face={-1} />
      </g>
      {out && (
        <>
          <Go path={medicPath} ms={2400}>
            <Pop>
              <Grownup look={MEDIC} pose={walking ? "walk" : cheering ? "cheer" : "stand"} wear={["rescue"]} face={1} />
            </Pop>
          </Go>
          <Go path={kidPath} ms={2400} delay={300}>
            <Pop>
              <Child pose={walking ? "walk" : cheering ? "cheer" : "stand"} />
            </Pop>
          </Go>
        </>
      )}
      <Go path={ambulance} ms={3000}>
        <Ambulance light driving={busy && step === 1} crew={step <= 1} />
      </Go>
    </ParkBack>
  );
}

function helpScene(fall: Fall): Scene {
  const sore = SORE_WORD[fall];
  const [sx, sy] = SORE[fall];
  const bag: Beat = {
    tap: { at: [MEDIC_STAND + 100, GROUND - 40], r: 90 },
    ask: "Open the first-aid bag!",
    sounds: [[0, playClick]],
    say: `Look, there is a plaster for the sore ${sore}.`,
    ms: 3200,
  };
  return {
    id: `help-${fall}`,
    icon: BAG_ICON,
    focus: [540, 340, 1040, 560],
    Draw: HelpDraw,
    beats: [
      { ms: 3000, sounds: [[0, siren]], say: "Here we are!" },
      { ms: 900, sounds: [[0, playPop]] },
      { ms: 2600, say: "The paramedic and the child walk to the little bear." },
      bag,
      {
        tap: { at: [CUB_AT + sx, GROUND + sy], r: 80 },
        ask: `Put the plaster on the ${sore}!`,
        sounds: [
          [0, playRustle],
          [1200, playPop],
        ],
        say: `Now the ${sore} is all better.`,
        ms: 3400,
      },
      {
        tap: { at: [CUB_AT, GROUND - 120], r: 130 },
        ask: "Give the little bear a high five!",
        sounds: [[0, playChime]],
        say: "High five! Everyone is happy.",
        ms: 3800,
      },
    ],
  };
}

// ---------- Back at the station ----------

const HOME_STOP = 1000;

function HomeDraw({ step, busy }: SceneProps) {
  const ambulance = route<Point[]>(step, [
    [0, [[AWAY, GROUND]]],
    [
      1,
      [
        [AWAY, GROUND],
        [HOME_STOP, GROUND],
      ],
    ],
  ]);
  const off = step >= 4;
  const out = step >= 3;
  return (
    <StationBack ring={false}>
      <Go path={ambulance} ms={3400}>
        <Ambulance light={!off} driving={busy && step === 1} crew={step <= 2} />
      </Go>
      {out && (
        <>
          <g transform={`translate(${HOME_STOP + 130} ${GROUND})`}>
            <Pop>
              <Grownup look={DRIVER} pose={off ? "cheer" : "stand"} wear={["rescue"]} face={-1} />
            </Pop>
          </g>
          <g transform={`translate(${HOME_STOP + 280} ${GROUND})`}>
            <Pop>
              <Child pose={off ? "cheer" : "stand"} face={-1} />
            </Pop>
          </g>
        </>
      )}
    </StationBack>
  );
}

const home: Scene = {
  id: "home",
  icon: HOME_ICON,
  focus: [160, 340, 1380, 540],
  Draw: HomeDraw,
  beats: [
    { ms: 3600, sounds: [[0, engine]], say: "Back home at the station." },
    { ms: 900, sounds: [[0, playPop]] },
    {
      tap: { at: [HOME_STOP + 236, GROUND - 262], r: 130 },
      ask: "Switch off the blue light!",
      sounds: [[0, playClick]],
      say: "Good night, blue light. Well done!",
      ms: 3200,
    },
    { ms: 2600, sounds: [[0, honk]] },
  ],
};

/** „The ambulance“: who needs help, picked by the child, from the call to the ride home. */
export const KRANKENWAGEN: Film = {
  id: "krankenwagen",
  first: "en",
  title: "The ambulance",
  end: "What a day! Everyone is happy.",
  scenes: (picks) => {
    const fall = picks[0] as Fall | undefined;
    return fall ? [park, callScene(fall), station, drive, helpScene(fall), home] : [park];
  },
};
