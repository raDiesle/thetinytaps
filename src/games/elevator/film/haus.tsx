import type { ReactNode } from "react";
import { INK } from "@/components/drawing";
import { playEngine } from "@/lib/realSounds";
import {
  playBeeps,
  playChime,
  playClick,
  playClonk,
  playCrunch,
  playDoorbell,
  playGlug,
  playKnocks,
  playMunch,
  playPop,
  playRecorded,
  playThump,
  playWhirr,
} from "@/lib/sfx";
import { Kid, KidHead, type Look, type Pose, useHero } from "../kid";
import type { Picture } from "../trail/items";
import type { Cue, Point } from "../trail/types";
import { Go, route } from "./move";
import { Wheel } from "./parts";
import { Grownup } from "./people";
import { Outdoors, RoundTree } from "./places";
import { type Film, GROUND, type Scene, type SceneProps } from "./types";

// „We build a house“ (G-36, a film of something coming to be; written English first): the digger digs the hole, the
// cement mixer pours the floor, the child picks the colour of the house, the builder lays the walls row by row, the big
// crane lifts the roof onto them and its tiles are hammered on, the family moves in with the removal van, and at the
// end everybody who helped has a party in the garden. Many hands help: a fox digging, a bear with the cement mixer, a
// she-bear laying bricks, a vixen on the crane. A calm film: slow machines, soft sounds, one short beep reversing.

const engine = () => playRecorded("engine", playEngine);

const FAR = 2400;
/** Where the machines drive: a little in front of the grass. */
const LANE = GROUND + 30;

const DIGGER_DRIVER: Look = { shirt: "#e8590c", pants: "#364fc7", hair: "#5c3d2e", animal: "fox" };
const MIXER_DRIVER: Look = { shirt: "#12b886", pants: "#495057", hair: "#a0522d", animal: "bear" };
const BUILDER: Look = { shirt: "#7950f2", pants: "#495057", hair: "#e8b04b", curly: true, animal: "bear", lashes: true };
const CRANE_DRIVER: Look = { shirt: "#e64980", pants: "#1971c2", hair: "#a0522d", curly: true, animal: "fox", lashes: true };
/** The child's own grown-up: a person, like the child's family in the other films. */
const PARENT: Look = { shirt: "#20c997", pants: "#495057", hair: "#8d5a3b" };

/** The colours the child can pick for the house: the wall and its brick lines. */
type Colour = "rot" | "gelb" | "blau";
const WALL: Record<Colour, { wall: string; line: string }> = {
  rot: { wall: "#ff8787", line: "#e03131" },
  gelb: { wall: "#ffe066", line: "#f59f00" },
  blau: { wall: "#74c0fc", line: "#1c7ed6" },
};
const colourOf = (picks: string[]): Colour => (picks[0] in WALL ? (picks[0] as Colour) : "rot");

/** The child in its own clothes. */
function Child({ pose, face = 1, holding = null }: { pose: Pose; face?: 1 | -1; holding?: "teddy" | null }) {
  const hero = useHero();
  return <Kid look={hero} pose={pose} holding={holding} wear={[]} face={face} />;
}

/** Something that pops in when it appears. */
function Pop({ children }: { children: ReactNode }) {
  return <g className="fm-pop">{children}</g>;
}

// ---------- The house ----------

/** Half the house's width, the height of one row of the walls (three rows), and the roof's height above them. */
const HALF = 260;
const ROW = 96;
const SLAB = 22;
const WALL_TOP = SLAB + 3 * ROW;
const ROOF_H = 190;
/** The door's middle, from the house's middle. */
const DOOR = -155;
/** The windows' left edges, from the house's middle; each is 100 wide. */
const WINDOWS = [-40, 120];

/** The concrete floor of the house, a little wider than its walls. */
function Slab() {
  return (
    <g>
      <rect x={-HALF - 30} y={-SLAB} width={HALF * 2 + 60} height={SLAB + 6} fill="#adb5bd" stroke={INK} strokeWidth="4" />
      <path d={`M${-HALF - 20} ${-SLAB + 8} H${HALF + 20}`} stroke="#ced4da" strokeWidth="4" />
    </g>
  );
}

/** One row of bricks in the house's colour: its bricks staggered, every other row half a brick along. */
function BrickRow({ k, colour }: { k: number; colour: Colour }) {
  const top = -SLAB - k * ROW;
  const c = WALL[colour];
  let joints = `M${-HALF} ${top + ROW / 2} H${HALF} `;
  for (let half = 0; half < 2; half++) {
    const y = top + half * (ROW / 2);
    for (let x = -HALF + ((k + half) % 2 ? 52 : 0) + 52; x < HALF; x += 104) joints += `M${x} ${y} v${ROW / 2} `;
  }
  return (
    <g>
      <rect x={-HALF} y={top} width={HALF * 2} height={ROW} fill={c.wall} />
      <path d={joints} stroke={c.line} strokeWidth="3" opacity="0.55" />
    </g>
  );
}

/** The roof, its eaves on (0, 0): wooden rafters while bare, red tiles over them once tiled, and a chimney. */
function Roof({ tiled }: { tiled: boolean }) {
  const w = HALF + 44;
  return (
    <g>
      <rect x="120" y="-170" width="46" height="110" fill="#c92a2a" stroke={INK} strokeWidth="4" />
      <rect x="112" y="-180" width="62" height="16" fill="#a61e1e" stroke={INK} strokeWidth="3" />
      <path d={`M${-w} 0 L0 ${-ROOF_H} L${w} 0 Z`} fill="#e8b678" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path
        d={[-200, -120, -40, 40, 120, 200].map((x) => `M${x} 0 L${x * 0.25} ${-ROOF_H + 40 + Math.abs(x) * 0.08}`).join(" ")}
        stroke="#b07a46"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path d={`M${-w + 50} -30 H${w - 50} M${-w + 140} -90 H${w - 140}`} stroke="#b07a46" strokeWidth="8" strokeLinecap="round" />
      <g className="fm-hs-tiles" style={{ opacity: tiled ? 1 : 0 }}>
        <path d={`M${-w} 0 L0 ${-ROOF_H} L${w} 0 Z`} fill="#e03131" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        {[0.25, 0.5, 0.75].map((t) => {
          const y = -ROOF_H * t;
          const half = w * (1 - t);
          let d = `M${-half} ${y}`;
          for (let x = -half; x < half - 1; x += 40) d += ` q20 16 40 0`;
          return <path key={t} d={d} stroke="#a61e1e" strokeWidth="5" fill="none" />;
        })}
      </g>
    </g>
  );
}

/**
 * The new house standing on (0, 0): the dug hole (`hole`, 0 to 1), the concrete floor over it (`slab`), as many rows
 * of wall as are built (`rows`, the door and windows in once all three are up), the roof (`roof`), and once it is lived
 * in, glass, curtains and a front door (`done`) and light in the windows (`lights`).
 */
function NewHouse({
  colour,
  hole = 0,
  slab = true,
  rows = 3,
  roof = "tiled",
  done = false,
  lights = false,
  growing = false,
  children,
}: {
  colour: Colour;
  hole?: number;
  slab?: boolean;
  rows?: number;
  roof?: "none" | "bare" | "tiled";
  done?: boolean;
  lights?: boolean;
  /** While the walls go up: the door and windows come in only after the last row has grown. */
  growing?: boolean;
  children?: ReactNode;
}) {
  return (
    <g>
      <ellipse
        className="fm-hs-grow"
        cx="0"
        cy="14"
        rx={HALF + 40}
        ry="34"
        fill={slab ? "#868e96" : "#5c3a1e"}
        style={{ transform: `scale(${hole || 0.05})`, opacity: hole ? 1 : 0 }}
      />
      <g className="fm-hs-fade" style={{ opacity: slab ? 1 : 0 }}>
        <Slab />
      </g>
      {[1, 2, 3].map((k) => (
        <g key={k} className="fm-hs-grow" style={{ transform: rows >= k ? "scaleY(1)" : "scaleY(0)" }}>
          <BrickRow k={k} colour={colour} />
        </g>
      ))}
      {rows >= 3 && (
        <g className={growing ? "fm-hs-fade-in" : undefined}>
          <path d={`M${-HALF} ${-WALL_TOP} H${HALF} V${-SLAB} H${-HALF} Z`} fill="none" stroke={INK} strokeWidth="4" />
          <rect x={DOOR - 45} y={-SLAB - 172} width="90" height="172" rx="6" fill={done ? "#8d5a3b" : "#495057"} stroke={INK} strokeWidth="4" />
          {done && <circle cx={DOOR + 26} cy={-SLAB - 84} r="7" fill="#ffd43b" stroke={INK} strokeWidth="2" />}
          {WINDOWS.map((x) => (
            <g key={x}>
              <rect x={x} y={-SLAB - 250} width="100" height="96" rx="4" fill={done ? "#a5d8ff" : "#495057"} stroke={INK} strokeWidth="4" />
              <rect className="fm-hs-light" x={x} y={-SLAB - 250} width="100" height="96" rx="4" fill="#ffe066" style={{ opacity: lights ? 1 : 0 }} />
              {done && (
                <g>
                  <path d={`M${x + 50} ${-SLAB - 250} V${-SLAB - 154} M${x} ${-SLAB - 202} H${x + 100}`} stroke="#fff" strokeWidth="7" />
                  <path d={`M${x + 4} ${-SLAB - 246} Q${x + 26} ${-SLAB - 210} ${x + 10} ${-SLAB - 158} H${x + 4} Z`} fill="#ff8787" />
                  <path d={`M${x + 96} ${-SLAB - 246} Q${x + 74} ${-SLAB - 210} ${x + 90} ${-SLAB - 158} H${x + 96} Z`} fill="#ff8787" />
                  <rect x={x - 8} y={-SLAB - 156} width="116" height="10" rx="4" fill="#f8f9fa" stroke={INK} strokeWidth="2" />
                </g>
              )}
            </g>
          ))}
        </g>
      )}
      {roof !== "none" && (
        <g transform={`translate(0 ${-WALL_TOP})`}>
          <Roof tiled={roof === "tiled"} />
        </g>
      )}
      {children}
    </g>
  );
}

/** The building site's ground round the house at `x`: trodden brown earth instead of grass, with soft edges. */
function Site({ x }: { x: number }) {
  const l = x - HALF - 180;
  const r = x + HALF + 180;
  return (
    <path
      d={`M${l} ${GROUND + 4} Q${l + 50} ${GROUND - 30} ${l + 120} ${GROUND - 30} H${r - 120} Q${r - 50} ${GROUND - 30} ${r} ${GROUND + 4} V${GROUND + 400} H${l} Z`}
      fill="#b08150"
    />
  );
}

/** The sign at the building site: a board on two posts showing the house that will stand there, on (0, 0). */
function SiteSign() {
  return (
    <g>
      <path d="M-60 0 V-170 M60 0 V-170" stroke="#8d5a3b" strokeWidth="12" strokeLinecap="round" />
      <rect x="-90" y="-260" width="180" height="120" rx="8" fill="#f8f9fa" stroke={INK} strokeWidth="4" />
      <path d="M-46 -160 V-206 L0 -238 L46 -206 V-160 Z" fill="#ffc9c9" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="-12" y="-190" width="22" height="30" fill="#8d5a3b" />
    </g>
  );
}

// ---------- The machines ----------

const YELLOW = "#fab005";

/** The digger, standing on (0, 0) and facing left: tracks, its cab with the driver, and the arm with the bucket, which
 * scoops while `digging`. */
function Digger({ digging = false }: { digging?: boolean }) {
  const arm = (d: string) => (
    <g>
      <path d={d} stroke={INK} strokeWidth="42" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={d} stroke={YELLOW} strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  );
  return (
    <g>
      <ellipse cx="0" cy="2" rx="200" ry="12" fill="#000" opacity="0.15" />
      <rect x="40" y="-210" width="150" height="116" rx="12" fill={YELLOW} stroke={INK} strokeWidth="4" />
      <rect x="150" y="-196" width="40" height="88" rx="8" fill="#495057" stroke={INK} strokeWidth="3" />
      <rect x="96" y="-262" width="14" height="56" rx="4" fill="#495057" stroke={INK} strokeWidth="3" />
      <rect x="-120" y="-100" width="240" height="36" fill="#343a40" stroke={INK} strokeWidth="3" />
      <rect x="-70" y="-286" width="130" height="190" rx="12" fill={YELLOW} stroke={INK} strokeWidth="4" />
      <rect x="-56" y="-270" width="100" height="92" rx="8" fill="#a5d8ff" opacity="0.8" />
      <g transform="translate(-6 -146) scale(0.52)">
        <KidHead look={DIGGER_DRIVER} />
      </g>
      <path d="M-50 -260 l22 -8 M-48 -244 l12 -4" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <rect x="-170" y="-66" width="340" height="66" rx="33" fill="#495057" stroke={INK} strokeWidth="4" />
      {[-122, -42, 42, 122].map((x) => (
        <circle key={x} cx={x} cy="-33" r="22" fill="#868e96" stroke={INK} strokeWidth="3" />
      ))}
      <g className={digging ? "fm-hs-arm dig" : "fm-hs-arm"} style={{ transformOrigin: "-60px -160px" }}>
        {arm("M-60 -160 L-250 -330 L-350 -150")}
        <path d="M-90 -200 L-200 -300" stroke="#adb5bd" strokeWidth="9" strokeLinecap="round" />
        <path d="M-344 -176 L-404 -150 Q-410 -96 -350 -92 L-312 -126 Z" fill="#868e96" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M-404 -150 l-10 18 M-396 -116 l-14 10" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <circle cx="-250" cy="-330" r="12" fill="#495057" stroke={INK} strokeWidth="3" />
      </g>
    </g>
  );
}

/** The cement mixer, standing on (0, 0) and facing left: the cab with its driver, the big drum that turns while
 * `turning`, and its chute at the back, which pours while `pouring`. */
function Mixer({ turning = false, pouring = false }: { turning?: boolean; pouring?: boolean }) {
  return (
    <g>
      <ellipse cx="0" cy="2" rx="300" ry="12" fill="#000" opacity="0.15" />
      <rect x="-290" y="-120" width="560" height="40" rx="8" fill="#495057" stroke={INK} strokeWidth="4" />
      <path d="M-300 -90 V-240 Q-300 -270 -270 -270 H-170 L-150 -90 Z" fill="#f76707" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-286 -160 V-234 Q-286 -254 -266 -254 H-190 V-160 Z" fill="#a5d8ff" opacity="0.8" />
      <g transform="translate(-238 -128) scale(0.48)">
        <KidHead look={MIXER_DRIVER} />
      </g>
      <path d="M-120 -120 L-90 -300 M220 -120 L200 -220" stroke="#868e96" strokeWidth="14" strokeLinecap="round" />
      <g transform="rotate(-10 60 -230)">
        <ellipse cx="60" cy="-230" rx="180" ry="100" fill="#dee2e6" stroke={INK} strokeWidth="4" />
        <path
          className={turning ? "fm-hs-drum turn" : "fm-hs-drum"}
          d="M-90 -290 Q-40 -150 30 -138 M-10 -320 Q50 -170 120 -142 M80 -326 Q150 -190 200 -170"
          stroke="#f76707"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray="60 30"
          fill="none"
        />
        <ellipse cx="236" cy="-250" rx="22" ry="60" fill="#adb5bd" stroke={INK} strokeWidth="4" />
      </g>
      <path d="M250 -190 L300 -110" stroke={INK} strokeWidth="26" strokeLinecap="round" />
      <path d="M250 -190 L300 -110" stroke="#868e96" strokeWidth="18" strokeLinecap="round" />
      {pouring && (
        <path className="fm-hs-pour" d={`M304 -104 V${GROUND - LANE + 20}`} stroke="#868e96" strokeWidth="18" strokeLinecap="round" strokeDasharray="16 10" />
      )}
      {[-200, 120, 210].map((x) => (
        <g key={x} transform={`translate(${x} -46)`}>
          <Wheel r={46} spin={turning && !pouring} />
        </g>
      ))}
    </g>
  );
}

const MAST_X = 1400;
const JIB_Y = 150;

/** The tower crane, its mast standing on the ground at `MAST_X`: the lattice mast, the jib along `JIB_Y` from far left
 * to its counterweight on the right, and the cab with the crane driver under the jib. The trolley is drawn by the
 * scene, since it moves. */
function TowerCrane() {
  const lattice = (x: number, top: number, bottom: number, w: number) => {
    let d = `M${x} ${bottom} V${top} M${x + w} ${bottom} V${top} `;
    for (let y = bottom; y > top + 1; y -= w) d += `M${x} ${y} L${x + w} ${y - w} M${x + w} ${y - w} H${x} `;
    return d;
  };
  let jib = `M200 ${JIB_Y} H${MAST_X + 320} M200 ${JIB_Y - 34} H${MAST_X + 320} `;
  for (let x = 200; x < MAST_X + 320; x += 34) jib += `M${x} ${JIB_Y} L${x + 17} ${JIB_Y - 34} L${x + 34} ${JIB_Y} `;
  return (
    <g>
      <path d={lattice(MAST_X - 30, JIB_Y, GROUND, 60)} stroke="#f59f00" strokeWidth="8" fill="none" strokeLinejoin="round" />
      <rect x={MAST_X - 60} y={GROUND - 30} width="120" height="30" fill="#868e96" stroke={INK} strokeWidth="3" />
      <path d={`M${MAST_X - 20} ${JIB_Y - 34} L${MAST_X} ${JIB_Y - 150} L${MAST_X + 20} ${JIB_Y - 34} Z`} fill="#fcc419" stroke={INK} strokeWidth="3" />
      <path d={`M${MAST_X} ${JIB_Y - 150} L240 ${JIB_Y - 34} M${MAST_X} ${JIB_Y - 150} L${MAST_X + 300} ${JIB_Y - 34}`} stroke="#495057" strokeWidth="4" />
      <path d={jib} stroke="#f59f00" strokeWidth="7" fill="none" strokeLinejoin="round" />
      <rect x={MAST_X + 220} y={JIB_Y - 10} width="100" height="70" fill="#868e96" stroke={INK} strokeWidth="4" />
      <path d={`M${MAST_X + 220} ${JIB_Y + 14} H${MAST_X + 320} M${MAST_X + 220} ${JIB_Y + 38} H${MAST_X + 320}`} stroke="#495057" strokeWidth="3" />
      <rect x={MAST_X - 130} y={JIB_Y + 4} width="110" height="100" rx="10" fill="#fcc419" stroke={INK} strokeWidth="4" />
      <rect x={MAST_X - 118} y={JIB_Y + 16} width="80" height="56" rx="6" fill="#a5d8ff" opacity="0.8" />
      <g transform={`translate(${MAST_X - 78} ${JIB_Y + 108}) scale(0.4)`}>
        <KidHead look={CRANE_DRIVER} />
      </g>
    </g>
  );
}

/** The crane's trolley, hanging under the jib at (0, `JIB_Y`). */
function Trolley() {
  return (
    <g>
      <rect x="-34" y={JIB_Y} width="68" height="26" rx="6" fill="#495057" stroke={INK} strokeWidth="3" />
      <circle cx="-18" cy={JIB_Y} r="7" fill="#212529" />
      <circle cx="18" cy={JIB_Y} r="7" fill="#212529" />
    </g>
  );
}

/** The removal van, standing on (0, 0) and facing left: the cab, and its box with a big shutter on the side, which
 * rolls up when `open` to show the boxes, the lamp and the plant inside (the teddy's box unless `taken`). */
function Van({ open = false, taken = false, rolling = false }: { open?: boolean; taken?: boolean; rolling?: boolean }) {
  const hero = useHero();
  return (
    <g>
      <ellipse cx="40" cy="2" rx="300" ry="12" fill="#000" opacity="0.15" />
      <rect x="-60" y="-320" width="360" height="250" rx="12" fill="#f8f9fa" stroke={INK} strokeWidth="4" />
      <rect x="-30" y="-300" width="300" height="200" rx="6" fill="#5c3d2e" />
      <g fill="#d9a066" stroke={INK} strokeWidth="3">
        <rect x="-16" y="-190" width="90" height="80" />
        <rect x="-6" y="-262" width="74" height="70" />
        <rect x="190" y="-180" width="70" height="70" />
        {!taken && <rect x="96" y="-176" width="80" height="66" />}
      </g>
      <path d="M-16 -150 H74 M-6 -228 H68 M190 -146 H260" stroke="#b07a46" strokeWidth="5" />
      {!taken && (
        <g transform="translate(136 -168) scale(0.42)">
          <path d="M-60 0 V-60 H60 V0" fill="none" />
          <circle cx="0" cy="-60" r="34" fill="#c08552" stroke={INK} strokeWidth="5" />
          <circle cx="-26" cy="-88" r="14" fill="#c08552" stroke={INK} strokeWidth="5" />
          <circle cx="26" cy="-88" r="14" fill="#c08552" stroke={INK} strokeWidth="5" />
        </g>
      )}
      <path d="M110 -300 V-236 M90 -236 H130 L120 -212 H100 Z" stroke="#495057" strokeWidth="4" fill="#ffe066" />
      <path
        d="M220 -260 q-16 -40 0 -60 q16 20 0 60 M220 -260 q-30 -24 -34 -44 M220 -260 q30 -24 34 -44"
        stroke="#2f9e44"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="198" y="-262" width="44" height="40" fill="#e8590c" stroke={INK} strokeWidth="3" />
      <g className="fm-hs-shutter" style={{ transform: open ? "scaleY(0.1)" : "scaleY(1)" }}>
        <rect x="-30" y="-300" width="300" height="200" fill="#4dabf7" stroke={INK} strokeWidth="3" />
        <path d="M-30 -260 H270 M-30 -220 H270 M-30 -180 H270 M-30 -140 H270" stroke="#339af0" strokeWidth="5" />
        <rect x="100" y="-122" width="40" height="12" rx="4" fill="#495057" />
      </g>
      <rect x="-60" y="-96" width="360" height="26" fill="#1c7ed6" />
      <path
        d="M-60 -70 V-240 Q-60 -250 -70 -250 H-180 Q-230 -250 -246 -200 L-266 -120 V-70 Z"
        fill="#1c7ed6"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M-80 -150 V-232 H-170 Q-206 -232 -218 -194 L-230 -150 Z" fill="#a5d8ff" opacity="0.85" />
      {!open && (
        <g>
          <g transform="translate(-170 -108) scale(0.44)">
            <KidHead look={PARENT} />
          </g>
          <g transform="translate(-112 -100) scale(0.38)">
            <KidHead look={hero} />
          </g>
        </g>
      )}
      <rect x="-276" y="-116" width="24" height="14" rx="4" fill="#ffe066" stroke={INK} strokeWidth="2" />
      {[-180, 220].map((x) => (
        <g key={x} transform={`translate(${x} -44)`}>
          <Wheel r={44} spin={rolling} />
        </g>
      ))}
    </g>
  );
}

/** A cardboard box with tape, carried in front of the chest. */
function MovingBox() {
  return (
    <g>
      <rect x="-40" y="-36" width="80" height="62" fill="#d9a066" stroke={INK} strokeWidth="3" />
      <path d="M-40 -14 H40 M0 -36 V-14" stroke="#b07a46" strokeWidth="6" />
    </g>
  );
}

/** A brick in the builder's hands. */
function Brick({ colour }: { colour: Colour }) {
  return <rect x="-30" y="-14" width="60" height="28" rx="3" fill={WALL[colour].wall} stroke={INK} strokeWidth="3" />;
}

/** A pallet stacked with bricks in the house's colour, standing on (0, 0). */
function BrickPallet({ colour, left }: { colour: Colour; left: number }) {
  return (
    <g>
      <rect x="-90" y="-18" width="180" height="18" fill="#b07a46" stroke={INK} strokeWidth="3" />
      {[0, 1, 2].slice(0, left).map((k) => (
        <g key={k} transform={`translate(0 ${-18 - k * 44})`}>
          <rect x="-80" y="-44" width="160" height="44" fill={WALL[colour].wall} stroke={INK} strokeWidth="3" />
          <path d="M-80 -22 H80 M-40 -44 V-22 M40 -44 V-22 M0 -22 V0" stroke={WALL[colour].line} strokeWidth="3" />
        </g>
      ))}
    </g>
  );
}

// ---------- Icons and cards ----------

const pic = (w: number, h: number, draw: () => ReactNode): Picture => ({ w, h, draw });

const DIG_ICON = pic(840, 440, () => (
  <g transform="translate(100 0)">
    <Digger />
  </g>
));
const WALL_ICON = pic(640, 360, () => <NewHouse colour="rot" rows={2} roof="none" />);
const CRANE_ICON = pic(1560, 800, () => (
  <g transform={`translate(-960 ${-GROUND})`}>
    <TowerCrane />
  </g>
));
const VAN_ICON = pic(640, 360, () => (
  <g transform="translate(-20 0)">
    <Van />
  </g>
));
const PARTY_ICON = pic(680, 620, () => (
  <NewHouse colour="gelb" done>
    <Bunting />
  </NewHouse>
));

/** A little house in the picked colour, its card in the choice: built, roofed and lived in. */
const houseCard = (colour: Colour) =>
  pic(680, 600, () => (
    <g transform="translate(0 -20)">
      <NewHouse colour={colour} done />
    </g>
  ));

// ---------- Dig and pour ----------

const HOUSE_X = 820;
const DIG_X = 1440;
const MIXER_STOP = HOUSE_X - 250 - 300 + 40;

function DigDraw({ step, busy }: SceneProps) {
  const digger = route<Point[]>(step, [
    [0, [[DIG_X + 900, LANE]]],
    [
      1,
      [
        [DIG_X + 900, LANE],
        [DIG_X, LANE],
      ],
    ],
  ]);
  const mixer = route<Point[]>(step, [
    [0, [[-800, LANE]]],
    [
      3,
      [
        [-800, LANE],
        [MIXER_STOP, LANE],
      ],
    ],
  ]);
  return (
    <g>
      <Outdoors />
      <Site x={HOUSE_X} />
      <g transform={`translate(200 ${GROUND + 10}) scale(0.9)`}>
        <SiteSign />
      </g>
      <g transform={`translate(${HOUSE_X + 400} ${GROUND - 20})`}>
        <path
          className="fm-hs-grow"
          d="M-110 0 Q-60 -90 0 -96 Q60 -90 110 0 Z"
          fill="#8d5a3b"
          stroke={INK}
          strokeWidth="4"
          style={{ transform: step >= 2 ? "scale(1)" : "scale(0)" }}
        />
      </g>
      <g transform={`translate(${HOUSE_X} ${GROUND})`}>
        <NewHouse colour="rot" hole={step >= 2 ? 1 : 0} slab={step >= 4} rows={0} roof="none" />
      </g>
      <Go path={digger} ms={3600}>
        <Digger digging={busy && step === 2} />
      </Go>
      <Go path={mixer} ms={4200}>
        <Mixer turning={step >= 3 && busy} pouring={busy && step === 4} />
      </Go>
    </g>
  );
}

const COLOUR_SAY: Record<Colour, string> = { rot: "A red house!", gelb: "A yellow house!", blau: "A blue house!" };

const dig: Scene = {
  id: "bagger",
  icon: DIG_ICON,
  focus: [100, 200, 1400, 640],
  Draw: DigDraw,
  beats: [
    { ms: 4600, sounds: [[0, engine]], say: "Here we build a new house. First comes the digger." },
    {
      tap: { at: [DIG_X - 80, GROUND - 210], r: 130 },
      ask: "Dig a hole!",
      sounds: [
        [0, engine],
        [2200, playCrunch],
      ],
      say: "The digger digs a big hole.",
      ms: 6200,
    },
    {
      ms: 4600,
      sounds: [
        [0, engine],
        [2800, playBeeps],
      ],
      say: "Here comes the cement mixer.",
    },
    {
      tap: { at: [MIXER_STOP + 270, GROUND - 120], r: 100 },
      ask: "Pour the concrete!",
      sounds: [[600, playGlug]],
      say: "Now the floor is flat and hard.",
      ms: 4800,
    },
  ],
  choice: {
    ask: "What colour shall our house be?",
    options: (["rot", "gelb", "blau"] as Colour[]).map((colour, i) => ({
      id: colour,
      picture: houseCard(colour),
      card: houseCard(colour),
      sounds: [[0, playPop]] as Cue[],
      at: [560 + i * 240, 330] as Point,
      r: 100,
      sign: true,
      say: COLOUR_SAY[colour],
    })),
  },
};

// ---------- The walls ----------

const PALLET_X = HOUSE_X + 540;
const BUILDER_X = HOUSE_X + 370;
const KID_WALLS = HOUSE_X - 470;

function WallsDraw({ step, busy, picks }: SceneProps) {
  const colour = colourOf(picks);
  const rows = Math.max(0, Math.min(3, step - 1));
  const laying = busy && step >= 2 && step <= 4;
  return (
    <g>
      <Outdoors />
      <Site x={HOUSE_X} />
      <RoundTree x={1580} s={1.05} />
      <g transform={`translate(${HOUSE_X} ${GROUND})`}>
        <NewHouse colour={colour} rows={rows} roof="none" growing />
      </g>
      <g transform={`translate(${PALLET_X} ${GROUND + 10})`}>
        <BrickPallet colour={colour} left={3 - rows} />
      </g>
      <g transform={`translate(${BUILDER_X} ${GROUND + 10})`}>
        <Grownup
          look={BUILDER}
          pose={laying ? "hold" : busy && step === 5 ? "cheer" : "stand"}
          wear={["builder"]}
          face={-1}
          holding={laying ? <Brick colour={colour} /> : undefined}
        />
      </g>
      <g transform={`translate(${KID_WALLS} ${GROUND + 10})`}>
        <Child pose={busy && step === 5 ? "cheer" : "stand"} />
      </g>
    </g>
  );
}

const walls: Scene = {
  id: "mauern",
  icon: WALL_ICON,
  focus: [100, 200, 1400, 640],
  Draw: WallsDraw,
  beats: [
    { ms: 3600, say: "Now the walls. The builder lays brick on brick." },
    {
      tap: { at: [PALLET_X, GROUND - 60], r: 100 },
      ask: "Lay the first row!",
      sounds: [
        [400, playClonk],
        [1500, playClonk],
      ],
      say: "Clink, clonk. The first row.",
      ms: 3600,
    },
    {
      tap: { at: [PALLET_X, GROUND - 50], r: 100 },
      ask: "One more row!",
      sounds: [
        [400, playClonk],
        [1500, playClonk],
      ],
      say: "The walls grow higher.",
      ms: 3200,
    },
    {
      tap: { at: [PALLET_X, GROUND - 40], r: 100 },
      ask: "And the last row!",
      sounds: [
        [400, playClonk],
        [1500, playClonk],
      ],
      say: "Now there are windows and a door.",
      ms: 3600,
    },
    { ms: 3200, sounds: [[0, playChime]], say: "The walls are ready. Now we need a roof!" },
  ],
};

// ---------- The crane and the roof ----------

const CRANE_HOUSE = 900;
const ROOF_GROUND: Point = [300, GROUND];
const ROOF_UP: Point = [300, 420];
const ROOF_OVER: Point = [CRANE_HOUSE, 420];
const ROOF_ON: Point = [CRANE_HOUSE, GROUND - WALL_TOP];
const KID_CRANE = 1250;
const LIFT_MS = 3000;
const SWING_MS = 3600;

function CraneDraw({ step, busy, picks }: SceneProps) {
  const roof = route<Point[]>(step, [
    [0, [ROOF_GROUND]],
    [2, [ROOF_GROUND, ROOF_UP]],
    [3, [ROOF_UP, ROOF_OVER]],
    [4, [ROOF_OVER, ROOF_ON]],
  ]);
  const ms = step === 3 ? SWING_MS : LIFT_MS;
  const trolley = route<Point[]>(step, [
    [0, [[ROOF_GROUND[0], 0]]],
    [
      3,
      [
        [ROOF_GROUND[0], 0],
        [ROOF_OVER[0], 0],
      ],
    ],
  ]);
  return (
    <g>
      <Outdoors />
      <Site x={CRANE_HOUSE} />
      <defs>
        <clipPath id="fm-hs-rope">
          <rect x={-FAR} y={JIB_Y + 20} width={FAR * 3} height={FAR} />
        </clipPath>
      </defs>
      <g transform={`translate(${CRANE_HOUSE} ${GROUND})`}>
        <NewHouse colour={colourOf(picks)} roof="none" />
      </g>
      <TowerCrane />
      <g clipPath="url(#fm-hs-rope)">
        <Go path={roof} ms={ms}>
          <path d={`M0 ${-ROOF_H} V-1600`} stroke="#343a40" strokeWidth="5" />
        </Go>
      </g>
      <Go path={trolley} ms={SWING_MS}>
        <Trolley />
      </Go>
      <Go path={roof} ms={ms}>
        <Roof tiled={step >= 5} />
        <path d={`M-30 ${-ROOF_H - 26} L0 ${-ROOF_H} L30 ${-ROOF_H - 26}`} stroke="#343a40" strokeWidth="5" fill="none" />
        <path d={`M0 ${-ROOF_H - 12} q-14 12 0 22`} stroke="#495057" strokeWidth="7" fill="none" strokeLinecap="round" />
      </Go>
      <g transform={`translate(${KID_CRANE} ${GROUND + 10})`}>
        <Child pose={busy && (step === 4 || step === 6) ? "cheer" : "stand"} face={-1} />
      </g>
    </g>
  );
}

const crane: Scene = {
  id: "kran",
  icon: CRANE_ICON,
  focus: [100, 60, 1440, 780],
  Draw: CraneDraw,
  beats: [
    { ms: 3600, say: "Here is the big crane. It can lift heavy things." },
    {
      tap: { at: [ROOF_GROUND[0], GROUND - 110], r: 110 },
      ask: "Lift the roof up!",
      sounds: [[0, playWhirr]],
      say: "Up, up goes the roof!",
      ms: 4000,
    },
    {
      tap: { at: [MAST_X - 75, JIB_Y + 50], r: 90 },
      ask: "Swing it over the house!",
      sounds: [[0, playWhirr]],
      say: "The crane swings round, slowly.",
      ms: 5000,
    },
    { ms: 4400, sounds: [[3000, playThump]], say: "Gently, gently. The roof sits on the house!" },
    {
      tap: { at: [ROOF_ON[0], ROOF_ON[1] - 80], r: 110 },
      ask: "Put on the tiles!",
      sounds: [
        [300, playKnocks],
        [1600, playKnocks],
      ],
      say: "Knock, knock. Now the roof keeps out the rain.",
      ms: 4200,
    },
    { ms: 3200, sounds: [[0, playChime]], say: "The house is finished!" },
  ],
};

// ---------- Moving in ----------

const NEW_HOME = 1020;
const VAN_STOP = 380;
const DOOR_X = NEW_HOME + DOOR;
/** Where the teddy's box lies in the van, and where the child and the grown-up stand once out of it, either side. */
const TEDDY_BOX: Point = [VAN_STOP + 136, LANE - 143];
const OUT_KID = VAN_STOP + 240;
const OUT_PARENT = VAN_STOP - 50;
const WALK_MS = 3200;

/** The house lived in: in its colour, a path to the door, a tree and a fence, standing at `NEW_HOME`. */
function Home({ colour, lights = false, children }: { colour: Colour; lights?: boolean; children?: ReactNode }) {
  return (
    <g>
      <RoundTree x={1460} s={1.05} />
      <g transform={`translate(${NEW_HOME} ${GROUND})`}>
        <NewHouse colour={colour} done lights={lights}>
          {children}
        </NewHouse>
      </g>
      <path
        d={`M${DOOR_X - 45} ${GROUND} L${DOOR_X - 70} ${GROUND + 60} H${DOOR_X + 70} L${DOOR_X + 45} ${GROUND} Z`}
        fill="#dee2e6"
        stroke={INK}
        strokeWidth="3"
      />
      <path
        d={
          [1320, 1360, 1400, 1440, 1480, 1520].map((x) => `M${x} ${GROUND} V${GROUND - 70}`).join(" ") +
          ` M1300 ${GROUND - 50} H1540 M1300 ${GROUND - 22} H1540`
        }
        stroke="#f8f9fa"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </g>
  );
}

function MoveDraw({ step, busy, picks }: SceneProps) {
  const van = route<Point[]>(step, [
    [0, [[-900, LANE]]],
    [
      1,
      [
        [-900, LANE],
        [VAN_STOP, LANE],
      ],
    ],
  ]);
  const kid = route<Point[]>(step, [
    [0, [[OUT_KID, GROUND + 10]]],
    [
      3,
      [
        [OUT_KID, GROUND + 10],
        [DOOR_X, GROUND + 10],
      ],
    ],
  ]);
  const parent = route<Point[]>(step, [
    [0, [[OUT_PARENT, GROUND + 10]]],
    [
      3,
      [
        [OUT_PARENT, GROUND + 10],
        [DOOR_X, GROUND + 10],
      ],
    ],
  ]);
  const walking = busy && step === 3;
  return (
    <g>
      <Outdoors />
      <Home colour={colourOf(picks)} lights={step >= 4} />
      <Go path={van} ms={4000}>
        <Van open={step >= 2} taken={step >= 3} rolling={busy && step === 1} />
      </Go>
      {step >= 2 && (
        <>
          <Go path={parent} ms={WALK_MS} className={step >= 3 ? "fm-hs-inside" : undefined}>
            <Pop>
              <Grownup look={PARENT} pose={walking ? "walk" : step >= 3 ? "hold" : "stand"} face={1} holding={step >= 3 ? <MovingBox /> : undefined} />
            </Pop>
          </Go>
          <Go path={kid} ms={WALK_MS} className={step >= 3 ? "fm-hs-inside" : undefined}>
            <Pop>
              <Child pose={walking ? "walk" : "stand"} holding={step >= 3 ? "teddy" : null} />
            </Pop>
          </Go>
        </>
      )}
    </g>
  );
}

const moveIn: Scene = {
  id: "einzug",
  icon: VAN_ICON,
  focus: [100, 200, 1400, 640],
  Draw: MoveDraw,
  beats: [
    {
      ms: 4800,
      sounds: [
        [0, engine],
        [2600, playBeeps],
      ],
      say: "Our house is ready. Today we move in!",
    },
    {
      tap: { at: [VAN_STOP + 120, GROUND - 230], r: 100 },
      ask: "Open the van!",
      sounds: [[200, playWhirr]],
      say: "Look, all our things are inside.",
      ms: 3400,
    },
    {
      tap: { at: TEDDY_BOX, r: 80 },
      ask: "Carry the teddy inside!",
      say: "Into our new house!",
      ms: 4600,
    },
    {
      tap: { at: [NEW_HOME + WINDOWS[1] + 50, GROUND - SLAB - 202], r: 80 },
      ask: "Switch on the light!",
      sounds: [[0, playClick]],
      say: "Click! The light is on. Welcome home!",
      ms: 3600,
    },
  ],
};

// ---------- The party ----------

/** A string of little flags across the front of the house, under the roof. */
function Bunting() {
  const colours = ["#e03131", "#fab005", "#40c057", "#1c7ed6", "#ae3ec9"];
  const y = -WALL_TOP + 10;
  return (
    <g>
      <path d={`M${-HALF - 10} ${y} Q0 ${y + 70} ${HALF + 10} ${y}`} stroke="#495057" strokeWidth="3" fill="none" />
      {Array.from({ length: 9 }, (_, i) => {
        const t = (i + 0.5) / 9;
        const x = -HALF - 10 + t * (HALF * 2 + 20);
        const sag = y + 4 * 70 * t * (1 - t) * 0.5;
        return <path key={i} d={`M${x - 18} ${sag} L${x + 18} ${sag} L${x} ${sag + 38} Z`} fill={colours[i % colours.length]} stroke={INK} strokeWidth="2" />;
      })}
    </g>
  );
}

/** The garden table with a cake on it; once `cut`, the slices lie on plates. */
function CakeTable({ cut }: { cut: boolean }) {
  return (
    <g>
      <path d="M-120 -110 V0 M120 -110 V0" stroke="#8d5a3b" strokeWidth="12" strokeLinecap="round" />
      <rect x="-150" y="-124" width="300" height="20" rx="6" fill="#f8f9fa" stroke={INK} strokeWidth="3" />
      <path
        d="M-150 -104 l20 20 l20 -20 l20 20 l20 -20 l20 20 l20 -20 l20 20 l20 -20 l20 20 l20 -20 l20 20 l20 -20 l20 20 l20 -20"
        stroke="#ff8787"
        strokeWidth="5"
        fill="none"
      />
      <g transform="translate(0 -124)">
        <rect x="-70" y="-80" width="140" height="80" rx="12" fill="#ffc9c9" stroke={INK} strokeWidth="4" />
        <path d="M-70 -56 q17 16 35 0 q17 16 35 0 q17 16 35 0 q17 16 35 0" stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round" />
        <rect x="-70" y="-30" width="140" height="10" fill="#e64980" opacity="0.6" />
        {cut && <path d="M10 -80 L50 -80 L50 0 L10 0 Z" fill="#f8f9fa" />}
        {[-30, 0, 30].map((x) => (
          <circle key={x} cx={x} cy="-86" r="10" fill="#e03131" stroke={INK} strokeWidth="2" />
        ))}
      </g>
      {cut &&
        [-120, 120].map((x) => (
          <g key={x} transform={`translate(${x} -124)`}>
            <Pop>
              <ellipse cx="0" cy="-4" rx="34" ry="8" fill="#fff" stroke={INK} strokeWidth="2" />
              <path d="M-18 -8 L18 -8 L0 -42 Z" fill="#ffc9c9" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            </Pop>
          </g>
        ))}
    </g>
  );
}

const TABLE_X = 360;
/** The helpers standing in the garden, from left to right. */
const GUESTS: { look: Look; x: number }[] = [
  { look: DIGGER_DRIVER, x: 560 },
  { look: BUILDER, x: 1150 },
  { look: CRANE_DRIVER, x: 1290 },
  { look: MIXER_DRIVER, x: 1420 },
];

function PartyDraw({ step, busy, picks }: SceneProps) {
  const joy = busy && step >= 2;
  return (
    <g>
      <Outdoors />
      <Home colour={colourOf(picks)} lights>
        {step >= 1 && (
          <Pop>
            <Bunting />
          </Pop>
        )}
      </Home>
      <g transform={`translate(${TABLE_X} ${GROUND + 10})`}>
        <CakeTable cut={step >= 2} />
      </g>
      {GUESTS.map(({ look, x }) => (
        <g key={x} transform={`translate(${x} ${GROUND + 14})`}>
          <Grownup look={look} pose={joy ? "cheer" : "stand"} wear={["builder"]} face={x < NEW_HOME ? 1 : -1} />
        </g>
      ))}
      <g transform={`translate(1000 ${GROUND + 14})`}>
        <Grownup look={PARENT} pose={joy ? "cheer" : "stand"} face={-1} />
      </g>
      <g transform={`translate(160 ${GROUND + 14})`}>
        <Child pose={joy ? "cheer" : "stand"} />
      </g>
    </g>
  );
}

const party: Scene = {
  id: "fest",
  icon: PARTY_ICON,
  focus: [100, 200, 1400, 640],
  Draw: PartyDraw,
  beats: [
    { ms: 4000, sounds: [[400, playPop]], say: "Now we have a party with everyone who helped." },
    {
      tap: { at: [TABLE_X, GROUND - 160], r: 90 },
      ask: "Cut the cake!",
      sounds: [[1200, playMunch]],
      say: "Mmm! Cake for everyone.",
      ms: 3600,
    },
    {
      tap: { at: [DOOR_X, GROUND - SLAB - 90], r: 80 },
      ask: "Ring our new doorbell!",
      sounds: [[0, playDoorbell]],
      say: "Ding dong! This is our new home.",
      ms: 3400,
    },
    { ms: 3400, say: "Thank you, digger, crane and builders!" },
  ],
};

/** „We build a house“: from the hole in the ground to the walls, the roof, moving in and the party. */
export const HAUS: Film = {
  id: "haus",
  first: "en",
  title: "We build a house",
  end: "So many helped to build our house. Thank you!",
  scenes: (picks) => (picks[0] ? [dig, walls, crane, moveIn, party] : [dig]),
};
