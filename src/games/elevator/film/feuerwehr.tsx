import type { ReactNode } from "react";
import { INK } from "@/games/scenes/shared";
import {
  playAlarm,
  playBeeps,
  playCrackle,
  playEngine,
  playHonk,
  playMeow,
  playPop,
  playRecorded,
  playRing,
  playSiren,
  playSplash,
  playTusch,
  playWash,
  playWhirr,
  playWhoosh,
} from "@/lib/sfx";
import { type Look, HERO, Kid, type Pose } from "../kid";
import { Mug } from "../things";
import type { Picture } from "../trail/items";
import type { Point } from "../trail/types";
import { Go, route } from "./move";
import { CREW, DRIVER, Grownup, NEIGHBOUR, RESIDENT } from "./people";
import {
  AlarmBell,
  BackHouse,
  CAT_ON_BRANCH,
  CatTree,
  DITCH_TILT,
  Ditch,
  FLAMES,
  HOOK,
  Hook,
  House,
  IN_DITCH,
  ON_ROAD,
  Outdoors,
  Road,
  RoundTree,
  SmallCar,
  TreeCat,
  WarningTriangle,
} from "./places";
import { basketAt, FireTruck, LADDER_LEN, LADDER_PIVOT, type Ladder } from "./truck";
import { around, type Beat, type Box, type Film, GROUND, type Option, type Scene, type SceneProps } from "./types";

// „Die Feuerwehr“: the child picks who needs the fire brigade (the cat in the tree, the burning house, the car in the
// ditch), sees the call, slides down the pole at the station, rides out, helps, gets a second call on the radio and
// picks the next job, and at last the station washes the engine and everybody celebrates.

const siren = () => playRecorded("siren", playSiren);
const alarm = () => playRecorded("alarm", playAlarm);
const meow = () => playRecorded("meow", playMeow);
const splash = () => playRecorded("splash", playSplash);
const engine = () => playRecorded("engine", playEngine);
const cheer = () => playRecorded("cheer", playTusch);
const honk = () => playRecorded("honk", playHonk);

/** The three jobs of the film, picked in the town and on the radio. */
export type Job = "katze" | "feuer" | "auto";
export const JOBS: Job[] = ["katze", "feuer", "auto"];

/** Where the engine parks at each job. */
const PARK: Record<Job, number> = { katze: 600, feuer: 420, auto: 560 };
/** Off the picture's left edge, where the engine comes from. */
const AWAY = -700;

/** The child in the fire brigade's clothes. */
function Child({ pose, face = 1, wear = true }: { pose: Pose; face?: 1 | -1; wear?: boolean }) {
  return <Kid look={HERO} pose={pose} holding={null} wear={wear ? ["fire"] : []} face={face} />;
}

/** Something that pops in when it appears. */
function Pop({ children }: { children: ReactNode }) {
  return <g className="fm-pop">{children}</g>;
}

/** The ladder's angle and pull to bring the basket's floor to `target`, on an engine standing at `x`. */
function aim(x: number, [tx, ty]: Point): Ladder {
  const [px, py] = [x + LADDER_PIVOT[0], GROUND + basketAt(0, 0)[1]];
  const dx = tx - px;
  const dy = py - ty;
  return { angle: (Math.atan2(dy, dx) * 180) / Math.PI, reach: Math.hypot(dx, dy) - LADDER_LEN, ms: 2800 };
}

/** The engine driving in from the left to its place at a job (the first beat), its blue light on. */
function ArrivingTruck({ step, busy, x, ladder, basket }: { step: number; busy: boolean; x: number; ladder?: Ladder; basket?: ReactNode }) {
  const path = route<Point[]>(step, [
    [0, [[AWAY, GROUND]]],
    [
      1,
      [
        [AWAY, GROUND],
        [x, GROUND],
      ],
    ],
  ]);
  return (
    <Go path={path} ms={2400}>
      <FireTruck light driving={busy && step === 1} crew={step <= 1} ladder={ladder} basket={basket} />
    </Go>
  );
}

/** The first beat at a job: the engine comes, then the child and a firefighter jump out. */
const arrive: Beat[] = [
  { ms: 2600, sounds: [[0, siren]], say: "Da sind wir!" },
  { ms: 900, sounds: [[0, playPop]] },
];

// ---------- Small pictures: the strip of scenes and the choices ----------

const pic = (w: number, h: number, draw: () => ReactNode): Picture => ({ w, h, draw });

const TOWN_ICON = pic(300, 200, () => (
  <g>
    <rect x="-140" y="-120" width="110" height="120" fill="#ffe8cc" stroke={INK} strokeWidth="6" />
    <path d="M-150 -120 L-85 -190 L-20 -120 Z" fill="#c2410c" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
    <rect x="10" y="-150" width="130" height="150" fill="#d0ebff" stroke={INK} strokeWidth="6" />
    <path d="M0 -150 L75 -200 L150 -150 Z" fill="#5c7cfa" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
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
    <rect x="-140" y="-190" width="280" height="190" fill="#e03131" stroke={INK} strokeWidth="6" />
    <rect x="-110" y="-120" width="100" height="120" fill="#dee2e6" stroke={INK} strokeWidth="5" />
    <rect x="10" y="-120" width="100" height="120" fill="#dee2e6" stroke={INK} strokeWidth="5" />
    <circle cx="0" cy="-158" r="20" fill="#ffd43b" stroke={INK} strokeWidth="5" />
  </g>
));
const TRUCK_ICON = pic(720, 320, () => <FireTruck light />);
const CAT_ICON = pic(600, 840, () => <CatTree cat />);
const FIRE_ICON = pic(540, 820, () => <House flames={[1, 1, 1]} />);
const CAR_ICON = pic(320, 220, () => (
  <g transform="translate(-130 -30)">
    <path d="M-40 60 Q120 60 360 200 H-40 Z" fill="#69db7c" stroke={INK} strokeWidth="6" />
    <g transform={`rotate(${DITCH_TILT})`}>
      <SmallCar colour="#228be6" />
    </g>
  </g>
));
const RADIO_ICON = pic(140, 220, () => <Radio />);
const PARTY_ICON = pic(260, 220, () => <Cake lit />);

/** The pictures of the three jobs. */
const JOB_ICON: Record<Job, Picture> = { katze: CAT_ICON, feuer: FIRE_ICON, auto: CAR_ICON };
/** What is said when the child picks a job. */
const JOB_SAY: Record<Job, string> = {
  katze: "Die Katze sitzt im Baum fest!",
  feuer: "Im Haus brennt es!",
  auto: "Das Auto steckt im Graben!",
};

/** The fire brigade's radio, standing on (0, 0). */
function Radio() {
  return (
    <g>
      <rect x="18" y="-210" width="14" height="70" rx="6" fill="#495057" stroke={INK} strokeWidth="4" />
      <rect x="-50" y="-150" width="100" height="150" rx="18" fill="#343a40" stroke={INK} strokeWidth="5" />
      <rect x="-36" y="-134" width="72" height="44" rx="6" fill="#69db7c" />
      {[-60, -40, -20].map((y) => (
        <path key={y} d={`M-30 ${y} H30`} stroke="#868e96" strokeWidth="6" strokeLinecap="round" />
      ))}
    </g>
  );
}

/** The party cake with its candles, burning when `lit`. */
function Cake({ lit }: { lit: boolean }) {
  return (
    <g>
      <rect x="-100" y="-90" width="200" height="90" rx="14" fill="#ffc9c9" stroke={INK} strokeWidth="5" />
      <path d="M-100 -60 Q-75 -40 -50 -60 Q-25 -40 0 -60 Q25 -40 50 -60 Q75 -40 100 -60" stroke="#fff" strokeWidth="10" fill="none" />
      {[-60, 0, 60].map((x) => (
        <g key={x}>
          <rect x={x - 7} y="-140" width="14" height="50" rx="4" fill="#4dabf7" stroke={INK} strokeWidth="3" />
          {lit && (
            <path
              className="fm-candle"
              d={`M${x} -170 Q${x - 12} -150 ${x} -142 Q${x + 12} -150 ${x} -170 Z`}
              fill="#ffd43b"
              stroke="#f08c00"
              strokeWidth="3"
            />
          )}
        </g>
      ))}
    </g>
  );
}

// ---------- The town: who needs the fire brigade? ----------

function TownDraw() {
  return (
    <g>
      <Outdoors />
      <Road />
      <BackHouse x={60} w={180} h={300} wall="#d0ebff" roof="#5c7cfa" />
      <BackHouse x={570} w={150} h={240} wall="#fff3bf" roof="#e8590c" />
      <BackHouse x={1080} w={170} h={280} wall="#e6fcf5" roof="#2b8a3e" />
      <BackHouse x={1560} w={180} h={320} wall="#f3d9fa" roof="#9c36b5" />
      <g transform={`translate(300 ${GROUND}) scale(0.75)`}>
        <CatTree cat />
      </g>
      <g transform={`translate(800 ${GROUND}) scale(0.65)`}>
        <House flames={[1, 1, 1]} />
      </g>
      <Ditch />
      <g transform={`translate(${IN_DITCH[0]} ${IN_DITCH[1]}) rotate(${DITCH_TILT}) translate(${-HOOK[0]} ${-HOOK[1]})`}>
        <SmallCar colour="#228be6" />
      </g>
    </g>
  );
}

const town: Scene = {
  id: "stadt",
  icon: TOWN_ICON,
  focus: [60, 140, 1500, 800],
  Draw: TownDraw,
  beats: [{ ms: 600 }],
  choice: {
    ask: "Wer braucht heute die Feuerwehr?",
    options: [
      { id: "katze", picture: CAT_ICON, at: [300, 470], r: 230, say: JOB_SAY.katze },
      { id: "feuer", picture: FIRE_ICON, at: [800, 560], r: 220, say: JOB_SAY.feuer },
      { id: "auto", picture: CAR_ICON, at: [1420, 800], r: 135, say: JOB_SAY.auto },
    ],
  },
};

// ---------- The call: the child sees what happened, and somebody rings the fire brigade ----------

/** Who calls at each job, where they stand and which way they look. */
const CALLER: Record<Job, { look: Look; x: number; face: 1 | -1 }> = {
  katze: { look: NEIGHBOUR, x: 820, face: 1 },
  feuer: { look: RESIDENT, x: 560, face: 1 },
  auto: { look: DRIVER, x: 1000, face: 1 },
};

/** The place of a job before the engine comes. */
function Place({ job, children }: { job: Job; children?: ReactNode }) {
  return (
    <g>
      <Outdoors />
      <Road />
      {job === "katze" && (
        <>
          <RoundTree x={300} s={1.1} />
          <g transform={`translate(1300 ${GROUND})`}>
            <CatTree cat />
          </g>
        </>
      )}
      {job === "feuer" && (
        <>
          <BackHouse x={-120} w={260} h={360} wall="#d0ebff" roof="#5c7cfa" />
          <g transform={`translate(1150 ${GROUND})`}>
            <House flames={[1, 1, 1]} />
          </g>
        </>
      )}
      {job === "auto" && (
        <>
          <RoundTree x={240} />
          <RoundTree x={1560} s={1.2} />
          <Ditch />
          <g transform={`translate(${IN_DITCH[0]} ${IN_DITCH[1]}) rotate(${DITCH_TILT}) translate(${-HOOK[0]} ${-HOOK[1]})`}>
            <SmallCar colour="#228be6" />
          </g>
        </>
      )}
      {children}
    </g>
  );
}

/** The place of the job picked first, and its caller, who rings the fire brigade at the tap. */
function CallDraw({ step, picks }: SceneProps) {
  const job = picks[0] as Job;
  const { look, x, face } = CALLER[job];
  return (
    <Place job={job}>
      <g transform={`translate(${x} ${GROUND})`}>
        <Grownup look={look} pose={step >= 2 ? "phone" : "stand"} face={face} />
      </g>
    </Place>
  );
}

/** What has to be seen of each call: the whole tree with the cat, the burning house, the car in the ditch. */
const CALL_FOCUS: Record<Job, Box> = { katze: [150, -40, 1350, 860], feuer: [200, 120, 1300, 700], auto: [80, 240, 1440, 600] };

function callScene(job: Job): Scene {
  const { x } = CALLER[job];
  const first: Record<Job, Beat> = {
    katze: {
      ms: 2600,
      sounds: [
        [0, meow],
        [1200, meow],
      ],
      say: "Miau! Die Katze kommt nicht mehr vom Baum herunter.",
    },
    feuer: { ms: 3000, sounds: [[0, playCrackle]], say: "Oh nein, im Haus brennt es! Alle sind schnell hinausgelaufen." },
    auto: { ms: 3200, sounds: [[0, honk]], say: "Oh je, das Auto ist in den Graben gerutscht. Der Fahrerin geht es gut." },
  };
  return {
    id: `anruf-${job}`,
    icon: PHONE_ICON,
    focus: CALL_FOCUS[job],
    Draw: CallDraw,
    beats: [
      first[job],
      {
        tap: { at: [x, GROUND - 150], r: 150 },
        ask: "Wer hilft? Ruf die Feuerwehr an!",
        sounds: [
          [0, playRing],
          [450, playRing],
          [900, playRing],
        ],
        say: "Eins, eins, zwei. Hallo Feuerwehr, bitte kommt schnell!",
        ms: 3800,
      },
    ],
  };
}

// ---------- The fire station ----------

const FLOOR = 400;
const POLE = 680;

/** The station in cross-section: the crew room upstairs with the bell, the pole down through the floor, the garage
 * with the hooks for jackets and helmets and the gate on the right. */
function StationHouse({ ring, open, hooks, children }: { ring: boolean; open: boolean; hooks: boolean; children?: ReactNode }) {
  return (
    <g>
      <Outdoors />
      <rect x="80" y="90" width="1440" height="310" fill="#fff4e6" />
      <rect x="80" y="424" width="1440" height={GROUND - 424} fill="#e9ecef" />
      {[900, 1220].map((x) => (
        <g key={x}>
          <rect x={x} y="150" width="160" height="130" rx="8" fill="#d0ebff" stroke={INK} strokeWidth="4" />
          <path d={`M${x + 80} 150 V280`} stroke={INK} strokeWidth="3" />
        </g>
      ))}
      {[180, 300, 420].map((x) => (
        <g key={x} transform={`translate(${x} 520)`}>
          <Hook full={hooks} />
        </g>
      ))}
      <g transform="translate(400 190)">
        <AlarmBell ring={ring} />
      </g>
      {/* The gate: it rolls up into its box at the top */}
      <rect x="1500" y="424" width="44" height={GROUND - 424} fill="#495057" />
      <g className="fm-gate" style={{ transform: `scaleY(${open ? 0.08 : 1})`, transformOrigin: "0px 430px" }}>
        <rect x="1496" y="430" width="52" height={GROUND - 430} fill="#ced4da" stroke={INK} strokeWidth="3" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M1496 ${458 + i * 28} H1548`} stroke="#868e96" strokeWidth="3" />
        ))}
      </g>
      {children}
      {/* The walls, the roof, the floor with its hole, and the pole */}
      <rect x="40" y="50" width="1520" height="44" fill="#a51d1d" stroke={INK} strokeWidth="4" />
      <rect x="40" y="50" width="40" height={GROUND - 50} fill="#c92a2a" stroke={INK} strokeWidth="4" />
      <rect x="1500" y="50" width="60" height="380" fill="#c92a2a" stroke={INK} strokeWidth="4" />
      <rect x="80" y={FLOOR} width={POLE - 40 - 80} height="24" fill="#adb5bd" stroke={INK} strokeWidth="3" />
      <rect x={POLE + 40} y={FLOOR} width={1500 - POLE - 40} height="24" fill="#adb5bd" stroke={INK} strokeWidth="3" />
      <rect x={POLE - 6} y="94" width="12" height={GROUND - 94} rx="5" fill="#fcc419" stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/** The crew room's table with its mugs. */
function CrewTable() {
  return (
    <g>
      <rect x="200" y="300" width="330" height="18" rx="6" fill="#a0522d" stroke={INK} strokeWidth="3" />
      <rect x="220" y="318" width="14" height="82" fill="#8d5a3b" />
      <rect x="496" y="318" width="14" height="82" fill="#8d5a3b" />
      {[260, 470].map((x) => (
        <g key={x} transform={`translate(${x} 300) scale(0.6)`}>
          <Mug />
        </g>
      ))}
    </g>
  );
}

/** Where the child and the two firefighters go: from the table in the crew room (right of the pole) down the pole to
 * the hooks on the left, then to the engine. */
const STATION_PATHS: { from: Point; hook: number; delay: number }[] = [
  { from: [770, FLOOR], hook: 460, delay: 0 },
  { from: [920, FLOOR], hook: 330, delay: 700 },
  { from: [1080, FLOOR], hook: 200, delay: 1400 },
];
const STATION_TRUCK = 1000;

function StationDraw({ step, busy }: SceneProps) {
  const dressed = step >= 3;
  const people = STATION_PATHS.map(({ from, hook, delay }, i) => {
    const down: Point[] = [from, [POLE + 30, FLOOR], [POLE + 30, GROUND], [hook, GROUND]];
    const path = route<Point[]>(step, [
      [0, [from]],
      [2, down],
      [
        4,
        [
          [hook, GROUND],
          [STATION_TRUCK + 230, GROUND],
        ],
      ],
    ]);
    const walking = busy && (step === 2 || step === 4);
    const alarmed = busy && step === 1;
    // Everybody runs one way: left to the pole and down to the hooks, then right to the engine.
    const face = step >= 4 ? 1 : -1;
    return (
      <Go key={i} path={path} ms={step >= 4 ? 1800 : 2000} delay={step >= 4 ? i * 300 : delay}>
        <g className={step >= 4 ? "fm-board" : undefined} style={{ transitionDelay: `${1600 + i * 300}ms` }}>
          <g key={`${dressed}`} className={dressed ? "fm-pop" : undefined}>
            {i === 0 ? (
              <Child pose={alarmed ? "jump" : walking ? "walk" : "stand"} face={face} wear={dressed} />
            ) : (
              <Grownup look={CREW[i - 1]} pose={alarmed ? "cheer" : walking ? "walk" : "stand"} wear={dressed ? ["fire"] : []} face={face} />
            )}
          </g>
        </g>
      </Go>
    );
  });
  const truck = route<Point[]>(step, [
    [0, [[STATION_TRUCK, GROUND]]],
    [
      5,
      [
        [STATION_TRUCK, GROUND],
        [2700, GROUND],
      ],
    ],
  ]);
  return (
    <StationHouse ring={busy && step === 1} open={step >= 4} hooks={step < 3}>
      <Go path={truck} ms={2800} delay={300}>
        <FireTruck light={step >= 5} driving={busy && step === 5} crew={step >= 4} />
      </Go>
      {people}
      <g transform="translate(640 0)">
        <CrewTable />
      </g>
    </StationHouse>
  );
}

const station: Scene = {
  id: "wache",
  icon: STATION_ICON,
  focus: [20, 50, 1560, 760],
  Draw: StationDraw,
  beats: [
    {
      ms: 2400,
      sounds: [
        [0, alarm],
        [900, alarm],
      ],
      say: "Alarm! Die Feuerwehr wird gebraucht!",
    },
    {
      tap: { at: [POLE, 250], r: 110 },
      ask: "Schnell, die Stange hinunter!",
      sounds: [
        [400, playWhoosh],
        [1100, playWhoosh],
        [1800, playWhoosh],
      ],
      say: "Wuuusch!",
      ms: 3600,
    },
    {
      tap: { at: [300, 600], r: 170 },
      ask: "Jacke an, Helm auf!",
      sounds: [
        [0, playPop],
        [250, playPop],
        [500, playPop],
      ],
      say: "Jacke an, Helm auf. Fertig!",
      ms: 2000,
    },
    {
      tap: { at: [1510, 600], r: 70 },
      ask: "Tor auf!",
      sounds: [[1800, engine]],
      say: "Das Tor geht auf. Alle steigen ein.",
      ms: 2800,
    },
    { ms: 2800, sounds: [[0, engine]], say: "Los geht's!" },
  ],
};

// ---------- On the way ----------

const LANE = 830;

function DriveDraw({ step, busy }: SceneProps) {
  const truck = route<Point[]>(step, [
    [0, [[AWAY, LANE]]],
    [
      1,
      [
        [AWAY, LANE],
        [400, LANE],
      ],
    ],
    [
      3,
      [
        [400, LANE],
        [2700, LANE],
      ],
    ],
  ]);
  const aside = step >= 2;
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
        <BackHouse key={x} x={x as number} w={w as number} h={h as number} wall={wall as string} roof={roof as string} />
      ))}
      <Road top={740} />
      <Go path={truck} ms={step >= 3 ? 2400 : 2000}>
        <FireTruck light={step >= 2} driving={busy && (step === 1 || step === 3)} crew />
      </Go>
      {[
        [900, "#40c057"],
        [1260, "#fab005"],
      ].map(([x, colour], i) => (
        <Go
          key={x}
          path={
            aside
              ? [
                  [x as number, LANE],
                  [(x as number) + 50, 900],
                ]
              : [[x as number, LANE]]
          }
          ms={1200}
          delay={400 + i * 300}
        >
          <SmallCar colour={colour as string} />
        </Go>
      ))}
    </g>
  );
}

function drive(id: string): Scene {
  return {
    id,
    icon: TRUCK_ICON,
    focus: [100, 300, 1400, 600],
    Draw: DriveDraw,
    beats: [
      { ms: 2200, sounds: [[0, engine]] },
      {
        tap: { at: [672, LANE - 252], r: 130 },
        ask: "Tatü-tata! Mach das Martinshorn an!",
        sounds: [
          [0, siren],
          [2600, siren],
        ],
        say: "Tatü-tata! Alle Autos machen Platz.",
        ms: 2800,
      },
      { ms: 2500 },
    ],
  };
}

// ---------- The jobs ----------

const TREE_X = 1300;
const CAT_AT: Point = [TREE_X + CAT_ON_BRANCH[0], GROUND + CAT_ON_BRANCH[1]];
/** Where the basket stops beside the cat. */
const LADDER_UP = aim(PARK.katze, [CAT_AT[0] - 70, CAT_AT[1] + 30]);

function CatJob({ step, busy }: SceneProps) {
  const x = PARK.katze;
  const ladder = step >= 3 && step < 5 ? LADDER_UP : { ...LADDER_UP, angle: 0, reach: 0 };
  const inBasket = step >= 4 && step < 6;
  const basket = step >= 2 && (
    <g transform="scale(0.62)">
      <Pop>
        <Child pose={step >= 6 && !busy ? "cheer" : "stand"} />
      </Pop>
      {inBasket && (
        <g transform="translate(70 -100) scale(-0.9 0.9)">
          <Pop>
            <TreeCat />
          </Pop>
        </g>
      )}
    </g>
  );
  return (
    <g>
      <Outdoors />
      <Road />
      <RoundTree x={200} s={1.1} />
      <g transform={`translate(${TREE_X} ${GROUND})`}>
        <CatTree cat={step < 4} />
      </g>
      <ArrivingTruck step={step} busy={busy} x={x} ladder={ladder} basket={basket} />
      {step >= 2 && (
        <g transform={`translate(1000 ${GROUND})`}>
          <Pop>
            <Grownup look={CREW[0]} pose={step >= 6 && !busy ? "cheer" : "stand"} wear={["fire"]} face={1} />
          </Pop>
        </g>
      )}
      <g transform={`translate(1160 ${GROUND})`}>
        <Grownup
          look={NEIGHBOUR}
          pose={step >= 6 ? "hold" : "stand"}
          face={-1}
          holding={
            step >= 6 && (
              <g transform="translate(-10 16) scale(-0.55 0.55)">
                <Pop>
                  <TreeCat />
                </Pop>
              </g>
            )
          }
        />
      </g>
    </g>
  );
}

const catJob: Scene = {
  id: "einsatz-katze",
  icon: CAT_ICON,
  focus: [180, 70, 1340, 710],
  Draw: CatJob,
  beats: [
    ...arrive,
    {
      tap: { at: [PARK.katze + 170, GROUND - 300], r: 130 },
      ask: "Die Leiter hoch, zur Katze!",
      sounds: [
        [0, playWhirr],
        [1400, playWhirr],
      ],
      say: "Hoch hinauf!",
      ms: 3000,
    },
    {
      tap: { at: [CAT_AT[0], CAT_AT[1] - 60], r: 110 },
      ask: "Komm, Katze, spring in den Korb!",
      sounds: [[200, meow]],
      say: "Hopp! Die Katze ist im Korb.",
      ms: 1800,
    },
    { ms: 3000, sounds: [[0, playWhirr]], say: "Und langsam wieder hinunter." },
    {
      ms: 3200,
      sounds: [
        [0, meow],
        [600, cheer],
      ],
      say: "Da ist ja meine Katze! Danke, Feuerwehr!",
    },
  ],
};

const HOUSE_X = 1150;
/** Where each flame burns, in the picture. */
const FLAME_AT: Point[] = FLAMES.map(([fx, fy]) => [HOUSE_X + fx, GROUND + fy - 30]);
const HOSE_KID = 880;
/** The nozzle in the child's hand. */
const NOZZLE: Point = [HOSE_KID + 70, GROUND - 116];

function FireJob({ step, busy }: SceneProps) {
  const x = PARK.feuer;
  const kidPath = route<Point[]>(step, [
    [0, [[x + 380, GROUND]]],
    [
      3,
      [
        [x + 380, GROUND],
        [HOSE_KID, GROUND],
      ],
    ],
  ]);
  const flames = FLAMES.map((_, i) => (step >= 4 + i ? 0 : 1));
  const spraying = busy && step >= 4 && step <= 6 ? FLAME_AT[step - 4] : null;
  const done = step >= 7;
  return (
    <g>
      <Outdoors />
      <Road />
      <BackHouse x={-160} w={260} h={360} wall="#d0ebff" roof="#5c7cfa" />
      <g transform={`translate(${HOUSE_X} ${GROUND})`}>
        <House flames={flames} />
      </g>
      <ArrivingTruck step={step} busy={busy} x={x} />
      {step >= 3 && (
        <path
          className="fm-hose"
          d={`M${x - 20} ${GROUND - 90} Q${x - 10} ${GROUND + 2} ${x + 100} ${GROUND + 2} L${HOSE_KID - 10} ${GROUND + 2} Q${HOSE_KID + 30} ${GROUND} ${NOZZLE[0] - 10} ${NOZZLE[1] + 8}`}
          stroke="#e8590c"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          pathLength={100}
        />
      )}
      {step >= 2 && (
        <>
          <g transform={`translate(${x + 120} ${GROUND})`}>
            <Pop>
              <Grownup look={CREW[1]} pose={done && !busy ? "cheer" : "stand"} wear={["fire"]} face={1} />
            </Pop>
          </g>
          <Go path={kidPath} ms={1400}>
            <Pop>
              <Child pose={done && !busy ? "cheer" : busy && step === 3 ? "walk" : step >= 3 ? "reach" : "stand"} />
            </Pop>
          </Go>
        </>
      )}
      {step >= 3 && !done && (
        <path d={`M${NOZZLE[0] - 14} ${NOZZLE[1] + 6} l30 -10 l4 12 Z`} fill="#495057" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      )}
      {spraying && (
        <path
          key={step}
          className="fm-jet"
          d={`M${NOZZLE[0] + 16} ${NOZZLE[1] - 6} Q${(NOZZLE[0] + spraying[0]) / 2} ${Math.min(NOZZLE[1], spraying[1]) - 180} ${spraying[0]} ${spraying[1]}`}
          stroke="#74c0fc"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
          pathLength={100}
        />
      )}
      <g transform={`translate(1480 ${GROUND})`}>
        <Grownup look={RESIDENT} pose={done ? "cheer" : "stand"} face={-1} />
      </g>
    </g>
  );
}

const fireJob: Scene = {
  id: "einsatz-feuer",
  icon: FIRE_ICON,
  focus: [100, 70, 1420, 710],
  Draw: FireJob,
  beats: [
    ...arrive,
    {
      tap: { at: [PARK.feuer - 20, GROUND - 140], r: 130 },
      ask: "Den Schlauch ausrollen!",
      sounds: [[0, playWhirr]],
      say: "Der Schlauch ist ganz lang.",
      ms: 1800,
    },
    ...FLAME_AT.map(
      ([fx, fy], i): Beat => ({
        tap: { at: [fx, fy - 70], r: 110 },
        ask: "Wasser marsch!",
        sounds: [[300, splash]],
        say: i < FLAME_AT.length - 1 ? "Zisch!" : "Zisch! Das Feuer ist aus.",
        ms: 2000,
      }),
    ),
    { ms: 3200, sounds: [[0, cheer]], say: "Alle sind gesund. Danke, Feuerwehr!" },
  ],
};

/** The winch at the front of the engine parked at the car. */
const WINCH: Point = [PARK.auto + 352, GROUND - 62];
const ROPE_LEN = 560;
/** The warning triangle stands at the engine's back, and the child carries it further back along the road. */
const TRIANGLE_AT = 220;
const TRIANGLE_X = 100;

function CarJob({ step, busy }: SceneProps) {
  const x = PARK.auto;
  const pulled = step >= 4;
  const car = pulled ? [IN_DITCH, ON_ROAD] : [IN_DITCH];
  const [rx, ry] = [WINCH[0] - IN_DITCH[0], WINCH[1] - IN_DITCH[1]];
  const rope = Math.hypot(rx, ry);
  const kidPath = route<Point[]>(step, [
    [0, [[x - 260, GROUND]]],
    [
      3,
      [
        [x - 260, GROUND],
        [x - 260 - (TRIANGLE_AT - TRIANGLE_X), GROUND],
      ],
    ],
  ]);
  const trianglePath = route<Point[]>(step, [
    [0, [[TRIANGLE_AT, GROUND]]],
    [
      3,
      [
        [TRIANGLE_AT, GROUND],
        [TRIANGLE_X, GROUND],
      ],
    ],
  ]);
  const crewPath = route<Point[]>(step, [
    [0, [[x + 400, GROUND]]],
    [
      5,
      [
        [x + 400, GROUND],
        [1010, GROUND],
      ],
    ],
  ]);
  const warm = step >= 5;
  const happy = step >= 5 && !busy;
  return (
    <g>
      <Outdoors />
      <Road />
      <RoundTree x={1560} s={1.2} />
      <Ditch />
      <Go path={car} ms={3000} delay={300}>
        {step === 4 && <path d={`M0 0 L${(rx / rope) * ROPE_LEN} ${(ry / rope) * ROPE_LEN}`} stroke="#495057" strokeWidth="6" strokeLinecap="round" />}
        <g className="fm-tilt" style={{ transform: `rotate(${pulled ? 0 : DITCH_TILT}deg)` }}>
          <g transform={`translate(${-HOOK[0]} ${-HOOK[1]})`}>
            <SmallCar colour="#228be6" hook />
          </g>
        </g>
      </Go>
      <ArrivingTruck step={step} busy={busy} x={x} />
      {step >= 2 && (
        <Go path={trianglePath} ms={1600}>
          <Pop>
            <WarningTriangle />
          </Pop>
        </Go>
      )}
      {step >= 2 && (
        <>
          <Go path={crewPath} ms={1600}>
            <Pop>
              <Grownup look={CREW[1]} pose={happy ? "cheer" : busy && step === 5 ? "walk" : "stand"} wear={["fire"]} face={1} />
            </Pop>
          </Go>
          <Go path={kidPath} ms={1600}>
            <Pop>
              <Child pose={happy ? "cheer" : busy && step === 3 ? "walk" : "stand"} face={busy && step === 3 ? -1 : 1} />
            </Pop>
          </Go>
        </>
      )}
      <g transform={`translate(1110 ${GROUND})`}>
        <Grownup
          look={DRIVER}
          pose={warm ? "hold" : "stand"}
          face={-1}
          wear={warm ? ["blanket"] : []}
          holding={
            warm && (
              <g transform="translate(-6 30) scale(0.7)">
                <Mug steam />
              </g>
            )
          }
        />
      </g>
    </g>
  );
}

const carJob: Scene = {
  id: "einsatz-auto",
  icon: CAR_ICON,
  focus: [40, 250, 1520, 680],
  Draw: CarJob,
  beats: [
    ...arrive,
    {
      tap: { at: [TRIANGLE_AT, GROUND - 60], r: 100 },
      ask: "Zuerst das Warndreieck aufstellen!",
      say: "Das Warndreieck warnt die anderen Autos.",
      ms: 2400,
    },
    {
      tap: { at: [WINCH[0], WINCH[1] - 10], r: 110 },
      ask: "Jetzt ziehen wir das Auto heraus!",
      sounds: [
        [0, playWhirr],
        [1200, playWhirr],
        [2400, playWhirr],
      ],
      say: "Hau ruck! Das Auto steht wieder auf der Straße.",
      ms: 3600,
    },
    {
      tap: { at: [1110, GROUND - 150], r: 150 },
      ask: "Der Fahrerin ist kalt. Eine Decke, bitte!",
      sounds: [
        [1600, playPop],
        [2600, cheer],
      ],
      say: "Eine warme Decke und Tee. Danke, Feuerwehr!",
      ms: 3600,
    },
  ],
};

const JOB_SCENE: Record<Job, Scene> = { katze: catJob, feuer: fireJob, auto: carJob };
/** Where the engine's cab is at each job, for the radio's bubble to point at. */
const CAB = (job: Job): Point => [PARK[job] + 240, GROUND - 200];

// ---------- The radio: a second job ----------

const BUBBLE: [number, number, number, number] = [470, 110, 660, 300];

/** The job picked first, all done, and a speech bubble from the engine's cab with the radio in it. */
function RadioDraw({ step, picks }: SceneProps) {
  const first = picks[0] as Job;
  const Job = JOB_SCENE[first].Draw;
  const done = JOB_SCENE[first].beats.length;
  const [bx, by, bw, bh] = BUBBLE;
  const [cx, cy] = CAB(first);
  return (
    <g>
      <Job step={done} busy={false} picks={picks} />
      {step >= 1 && (
        <g className="fm-pop">
          <path d={`M${cx - 30} ${by + bh - 10} L${cx} ${cy} L${cx + 40} ${by + bh - 10} Z`} fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <rect x={bx} y={by} width={bw} height={bh} rx="40" fill="#fff" stroke={INK} strokeWidth="5" />
          <path d={`M${cx - 26} ${by + bh - 3} H${cx + 36}`} stroke="#fff" strokeWidth="8" />
          <g transform={`translate(${bx + 70} ${by + bh - 60}) scale(0.7)`}>
            <Radio />
          </g>
        </g>
      )}
    </g>
  );
}

function radioScene(first: Job): Scene {
  const others = JOBS.filter((j) => j !== first);
  const [bx, by, bw, bh] = BUBBLE;
  return {
    id: `funk-${first}`,
    icon: RADIO_ICON,
    focus: around(JOB_SCENE[first].focus, [bx - 20, by - 20, bw + 40, bh + 40]),
    Draw: RadioDraw,
    beats: [
      {
        ms: 2400,
        sounds: [
          [0, playBeeps],
          [900, playBeeps],
        ],
        say: "Funk! Die Feuerwehr wird noch einmal gebraucht.",
      },
    ],
    choice: {
      ask: "Wohin fahren wir jetzt?",
      options: others.map(
        (job, i): Option => ({ id: job, picture: JOB_ICON[job], at: [bx + 290 + i * 230, by + bh / 2], r: 100, sign: true, say: JOB_SAY[job] }),
      ),
    },
  };
}

// ---------- Home again ----------

/** The people the fire brigade helped, as they come to the party. */
function Visitor({ job }: { job: Job }) {
  if (job === "katze")
    return (
      <Grownup
        look={NEIGHBOUR}
        pose="hold"
        face={-1}
        holding={
          <g transform="translate(-10 16) scale(-0.55 0.55)">
            <TreeCat />
          </g>
        }
      />
    );
  if (job === "auto") return <Grownup look={DRIVER} pose="cheer" face={-1} wear={["blanket"]} />;
  return <Grownup look={RESIDENT} pose="cheer" face={-1} />;
}

function HomeDraw({ step, busy, picks }: SceneProps) {
  const truck = route<Point[]>(step, [
    [0, [[2700, GROUND]]],
    [
      1,
      [
        [2700, GROUND],
        [STATION_TRUCK, GROUND],
      ],
    ],
  ]);
  const party = step >= 4;
  const clean = step >= 3;
  const kidPath = route<Point[]>(step, [
    [0, [[1400, GROUND]]],
    [
      4,
      [
        [1400, GROUND],
        [1180, GROUND],
      ],
    ],
  ]);
  return (
    <StationHouse ring={false} open hooks={false}>
      <Go path={truck} ms={3200}>
        <FireTruck driving={busy && step === 1} />
        <g className={`fm-mud${clean ? " gone" : ""}`} fill="#8d6e48" opacity="0.85">
          {[
            [-250, -70, 30],
            [-120, -110, 24],
            [20, -64, 34],
            [150, -100, 22],
            [250, -70, 28],
            [-300, -150, 20],
          ].map(([mx, my, r]) => (
            <ellipse key={`${mx}`} cx={mx} cy={my} rx={r} ry={r * 0.7} />
          ))}
        </g>
        {busy && step === 3 && (
          <g className="fm-foam" fill="#fff" stroke="#a5d8ff" strokeWidth="3">
            {Array.from({ length: 18 }, (_, i) => (
              <circle
                key={i}
                cx={-300 + (i % 6) * 120}
                cy={-60 - Math.floor(i / 6) * 60}
                r={34 - (i % 3) * 6}
                style={{ animationDelay: `${(i % 6) * 120}ms` }}
              />
            ))}
          </g>
        )}
      </Go>
      <g transform={`translate(330 ${GROUND})`}>
        <rect x="-130" y="-110" width="260" height="18" rx="6" fill="#a0522d" stroke={INK} strokeWidth="3" />
        <rect x="-110" y="-92" width="14" height="92" fill="#8d5a3b" />
        <rect x="96" y="-92" width="14" height="92" fill="#8d5a3b" />
        <g transform="translate(0 -110) scale(0.7)">
          <Cake lit={party} />
        </g>
      </g>
      {step >= 2 && (
        <>
          {[0, 1].map((i) => (
            <g key={i} transform={`translate(${540 + i * 110} ${GROUND})`}>
              <Pop>
                <Grownup look={CREW[i]} pose={party && !busy ? "cheer" : "stand"} wear={["fire"]} face={1} />
              </Pop>
            </g>
          ))}
          <Go path={kidPath} ms={1400}>
            <Pop>
              <Child pose={party && !busy ? "cheer" : busy && step === 4 ? "walk" : "stand"} face={-1} />
            </Pop>
          </Go>
          <g transform={`translate(1475 ${GROUND})`}>
            <Bucket />
          </g>
        </>
      )}
      {party &&
        picks.slice(0, 2).map((job, i) => (
          <Go
            key={job}
            path={[
              [1800 + i * 160, GROUND],
              [860 + i * 150, GROUND],
            ]}
            ms={2400}
            delay={i * 500}
          >
            <Visitor job={job as Job} />
          </Go>
        ))}
    </StationHouse>
  );
}

/** A bucket of soapy water with a sponge. */
function Bucket() {
  return (
    <g>
      <path d="M-40 -80 H40 L32 0 H-32 Z" fill="#4dabf7" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <ellipse cx="0" cy="-80" rx="40" ry="10" fill="#fff" stroke={INK} strokeWidth="3" />
      <circle cx="-14" cy="-92" r="12" fill="#fff" stroke="#a5d8ff" strokeWidth="2" />
      <circle cx="12" cy="-96" r="9" fill="#fff" stroke="#a5d8ff" strokeWidth="2" />
      <rect x="-6" y="-104" width="40" height="22" rx="6" fill="#ffd43b" stroke={INK} strokeWidth="3" transform="rotate(-14)" />
    </g>
  );
}

const home: Scene = {
  id: "zurueck",
  icon: PARTY_ICON,
  focus: [20, 50, 1560, 760],
  Draw: HomeDraw,
  beats: [
    {
      ms: 3400,
      sounds: [
        [0, playBeeps],
        [1100, playBeeps],
        [2200, playBeeps],
      ],
      say: "Zurück in der Feuerwache.",
    },
    { ms: 900, sounds: [[0, playPop]] },
    {
      tap: { at: [1475, GROUND - 70], r: 90 },
      ask: "Das Feuerwehrauto ist schmutzig. Waschen!",
      sounds: [
        [0, playWash],
        [1900, splash],
      ],
      say: "Schrubb, schrubb! Jetzt glänzt es wieder.",
      ms: 3400,
    },
    {
      tap: { at: [330, GROUND - 170], r: 140 },
      ask: "Jetzt feiern alle zusammen!",
      sounds: [[1800, cheer]],
      say: "Danke, liebe Feuerwehr!",
      ms: 3400,
    },
  ],
};

/** „Die Feuerwehr“: two jobs picked by the child, from the call to the party. */
export const FEUERWEHR: Film = {
  id: "feuerwehr",
  title: "Die Feuerwehr",
  picture: TRUCK_ICON,
  end: "Was für ein Tag! Alle sind froh.",
  scenes: (picks) => {
    const [first, second] = picks as Job[];
    if (!first) return [town];
    const start = [town, callScene(first), station, drive("fahrt"), JOB_SCENE[first], radioScene(first)];
    if (!second) return start;
    return [...start, drive("fahrt-2"), JOB_SCENE[second], home];
  },
};
