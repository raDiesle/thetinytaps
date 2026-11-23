import { memo, useId, useMemo } from "react";
import { wobble, VIEW_H, type LevelProps } from "./level";
import {
  BOARD,
  BOTTLE,
  BREADBOX,
  BREAKFAST,
  buildKitchen,
  BUNNY,
  COFFEE,
  COOKTOP,
  CORK,
  COUNTER,
  CRANK,
  CUP,
  DIAL_MAX,
  DRIP_Y,
  EGG,
  EGG_CUP,
  FLOOR,
  HONEY,
  HONEY_MOUTH_X,
  HOPPER,
  JAR,
  JELLY,
  KETTLE,
  type Kitchen,
  KNOB_X,
  LADLE,
  LEVER,
  MEATBALL,
  MILL,
  MUG,
  mugTop,
  PAN,
  PANCAKE,
  PEG,
  PIN,
  PLATE,
  PLATE_PEG_DX,
  POT,
  POT_RIM,
  ROLL,
  SHELF,
  SPAGHETTI,
  SPINNER,
  SPOON,
  spoonY,
  SPOUT_Y,
  TOAST,
  TIMER,
  TOASTER,
  TRAY,
  WEDGE,
  WORLD_W,
} from "./kitchen";
import { deg, hop, seg } from "./machineKit";
import { MachineStage } from "./MachineStage";
import { Bunting, DARK_WOOD, INK, MARBLE_COLOR, MID_WOOD, Sparkles, WallClock, Window, WOOD } from "./scenery";
import type { Pt } from "./path";
import { BAR_COLORS, Ball, still } from "./parts";

/** The tiled wall; also the page colour around the picture. */
const WALL = "#dff3ea";
const STEEL = "#cfd5e6";
const POPCORN = "#fff4cf";

/**
 * Level 5: the crazy kitchen. One tap lets the marble out of the spice jar,
 * and then one thing sets off the next for about a minute: the wooden
 * spoon, the paper towel roll, the rolling pin down the cutting board, the
 * swinging ladle that throws a meatball, a plate rolling along the counter
 * into the salad spinner's crank, the whirling spinner popping its lid and
 * flinging lettuce, a leaf winding up the egg timer, which ticks, rings and
 * rattles off the cookie jar onto the pancake pan's handle, the pancake's
 * double somersault onto the wobbling jelly, which tips the pepper mill
 * against the coffee machine's button, the machine grinding, pouring and
 * puffing the cork out of the apple fizz onto the egg, the egg wobbling down
 * the baking tray into the honey jar, the honey oozing onto the cooktop's
 * touch field, popcorn popping into a mug that pulls down the toaster lever,
 * and the toast flying onto the bunny's plate. The camera travels along with
 * whatever moves.
 */
export function KitchenLevel(props: LevelProps) {
  const kitchen = useMemo(buildKitchen, []);
  const ids = useId();

  // The backdrop never changes: a layer of its own, painted once.
  const backdrop = useMemo(
    () => [
      {
        content: (
          <>
            <Room tiles={`${ids}-tiles`} />
            <Shelf />
          </>
        ),
      },
    ],
    [ids],
  );

  return (
    <MachineStage back={backdrop} machine={kitchen} level="kitchen" start={{ x: HOPPER.x, y: HOPPER.y - 70, r: 82 }} {...props}>
      {(t) => (
        <>
          <PaperTowel kitchen={kitchen} t={t} />
          <Spoon />
          <Board />
          <LadleRail />
          <Spaghetti />
          <PlatePegs />
          <Wedge />
          <CookieJar />
          <Cooktop kitchen={kitchen} t={t} />
          <Kettle />
          <Steam kitchen={kitchen} t={t} />
          <PotBack />
          <PopcornHeap kitchen={kitchen} t={t} />
          <PotFront />
          <BreakfastPlate />
          <Bunny age={t - kitchen.tToast} />

          <MovingThings kitchen={kitchen} t={t} />

          <SpiceJar t={t} />
          <Sparkles x={BREAKFAST.cx} y={BREAKFAST.top - 60} age={t - kitchen.tToast} />
        </>
      )}
    </MachineStage>
  );
}

function MovingThings({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const marble = kitchen.marbleAt(t);
  const pin = kitchen.pinAt(t);
  const meatball = kitchen.meatballAt(t);
  const plate = kitchen.plateAt(t);
  const angle = kitchen.ladleAngle(t);
  const ladle = `translate(${LADLE.hook.x} ${LADLE.hook.y}) rotate(${-angle})`;
  return (
    <g>
      <Ball color={MARBLE_COLOR} x={marble.pt.x} y={marble.pt.y} spin={marble.spin} />
      <g transform={ladle}>
        <LadleBack />
      </g>
      <Meatball at={meatball.pt} spin={meatball.spin} />
      <g transform={ladle}>
        <LadleFront />
      </g>
      <RollingPin at={pin.pt} turned={pin.turned} />
      <Plate at={plate.pt} turned={plate.turned} tilt={plate.tilt} flat={plate.flat} />
      <SaladSpinner kitchen={kitchen} t={t} />
      <Jelly kitchen={kitchen} t={t} />
      <PancakePan kitchen={kitchen} t={t} />
      <CoffeeMachine kitchen={kitchen} t={t} />
      <PepperMill kitchen={kitchen} t={t} />
      <BreadBox />
      <Egg kitchen={kitchen} t={t} />
      <EggCup />
      <Cork kitchen={kitchen} t={t} />
      <Honey kitchen={kitchen} t={t} />
      <HoneyJar kitchen={kitchen} t={t} />
      <EggTimer kitchen={kitchen} t={t} />
      <Leaves kitchen={kitchen} t={t} />
      <Kernels kitchen={kitchen} t={t} />
      <Toast kitchen={kitchen} t={t} />
      <Toaster kitchen={kitchen} t={t} />
      <Mug kitchen={kitchen} t={t} />
    </g>
  );
}

/* ---------- The kitchen ---------- */

const Room = still(function Room({ tiles }: { tiles: string }) {
  return (
    <g>
      <defs>
        <pattern id={tiles} width="64" height="64" patternUnits="userSpaceOnUse">
          <rect width="64" height="64" fill="#c8e9da" />
          <rect x="2" y="2" width="60" height="60" rx="4" fill={WALL} />
        </pattern>
      </defs>
      <rect x="-400" y="-200" width={WORLD_W + 800} height={COUNTER + 200} fill={`url(#${tiles})`} />
      <Window x={1250} />
      <WallClock x={2420} y={150} />
      <Window x={3420} />
      <Window x={4560} />
      <Window x={6300} />
      <SpiceRack />
      <Bunting x0={BREAKFAST.cx - 140} x1={WORLD_W + 20} y={30} />
      {/* Worktop and the cupboards under it */}
      <rect x="-400" y={COUNTER + 24} width={WORLD_W + 800} height={FLOOR - COUNTER - 24} fill="#8ecae6" />
      {Array.from({ length: Math.ceil(WORLD_W / 260) + 2 }, (_, i) => {
        const x = -260 + i * 260;
        return (
          <g key={i}>
            <rect x={x + 10} y={COUNTER + 36} width="240" height={FLOOR - COUNTER - 66} rx="8" fill="#a8d8ee" stroke={INK} strokeWidth="3" />
            <circle cx={x + (i % 2 ? 34 : 226)} cy={COUNTER + 70} r="8" fill="#ffd23f" stroke={INK} strokeWidth="2.5" />
          </g>
        );
      })}
      <rect x="-400" y={FLOOR - 16} width={WORLD_W + 800} height="16" fill="#4a6fa5" />
      <rect x="-400" y={COUNTER} width={WORLD_W + 800} height="24" fill={WOOD} stroke={INK} strokeWidth="4" />
      {/* Floor tiles */}
      <rect x="-400" y={FLOOR} width={WORLD_W + 800} height={VIEW_H - FLOOR + 200} fill="#f6efe2" />
      {Array.from({ length: Math.ceil((WORLD_W + 800) / 50) }, (_, i) => (
        <rect key={i} x={-400 + i * 50} y={FLOOR + ((i % 2) * 50 + 0)} width="50" height="50" fill="#e6d8c0" />
      ))}
      <line x1="-400" y1={FLOOR} x2={WORLD_W + 400} y2={FLOOR} stroke={INK} strokeWidth="4" />
    </g>
  );
});

/** A small shelf with spice jars above the cooktop. */
const SpiceRack = memo(function SpiceRack() {
  const y = 300;
  return (
    <g>
      {[-70, 10, 90, 170]
        .map((dx) => KETTLE.cx + dx)
        .map((x, i) => (
          <g key={x}>
            <rect x={x} y={y - 64} width="50" height="64" rx="8" fill="#e8f6ffcc" stroke={INK} strokeWidth="3" />
            <rect x={x + 4} y={y - 40} width="42" height="36" rx="5" fill={BAR_COLORS[(i * 3) % BAR_COLORS.length]} opacity="0.75" />
            <rect x={x - 2} y={y - 76} width="54" height="16" rx="5" fill={BAR_COLORS[(i * 3 + 5) % BAR_COLORS.length]} stroke={INK} strokeWidth="3" />
          </g>
        ))}
      <rect x={KETTLE.cx - 100} y={y} width="350" height="16" rx="5" fill={WOOD} stroke={INK} strokeWidth="3" />
      {[KETTLE.cx - 60, KETTLE.cx + 210].map((x) => (
        <path key={x} d={`M${x} ${y + 16} L${x} ${y + 50} L${x + 26} ${y + 16} Z`} fill={MID_WOOD} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      ))}
    </g>
  );
});

/* ---------- Spice jar, spoon, paper towel ---------- */

/** The spice jar hangs upside down in a strap; its cap flaps open at the tap. */
function SpiceJar({ t }: { t: number }) {
  const { x, y } = HOPPER;
  const open = t < 0 ? 0 : 80 * Math.min(1, t / 0.15);
  return (
    <g>
      <rect x={x - 112} y={y - 112} width="30" height="54" rx="6" fill={MID_WOOD} stroke={INK} strokeWidth="3" />
      <rect x={x - 86} y={y - 92} width="40" height="14" fill={DARK_WOOD} stroke={INK} strokeWidth="2.5" />
      <rect x={x - 48} y={y - 140} width="96" height="116" rx="18" fill="#e8f6ff" opacity="0.55" stroke={INK} strokeWidth="4" />
      <path d={`M${x - 30} ${y - 124} L${x - 30} ${y - 60}`} stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity="0.9" />
      <rect x={x - 50} y={y - 100} width="100" height="22" fill="#ff5d73" stroke={INK} strokeWidth="3" />
      <path d={`M${x + 4} ${y - 96} l4 7 l8 1 l-6 5 l2 8 l-8 -4 l-8 4 l2 -8 l-6 -5 l8 -1 Z`} fill="#ffd23f" />
      {/* The shaker cap, with the flap the marble comes out of */}
      <rect x={x - 40} y={y - 28} width="80" height="28" rx="6" fill="#ff8c42" stroke={INK} strokeWidth="4" />
      {[-28, 28].map((dx) => (
        <circle key={dx} cx={x + dx} cy={y - 14} r="4" fill={INK} />
      ))}
      <rect x={x - 22} y={y - 4} width="44" height="6" fill={INK} />
      <g transform={`translate(${x - 22} ${y + 2}) rotate(${open})`}>
        <rect x="0" y="-5" width="44" height="9" rx="3" fill="#ffb703" stroke={INK} strokeWidth="3" />
      </g>
    </g>
  );
}

/** The big wooden spoon: bowl at the top end, handle down to the paper towel roll, on three wall brackets. */
const Spoon = memo(function Spoon() {
  const { from, to, bowlX } = SPOON;
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  const slope = deg(Math.atan2(to.y - from.y, to.x - from.x));
  const bowlU = (bowlX - from.x) / Math.cos(Math.atan2(to.y - from.y, to.x - from.x));
  return (
    <g>
      {[bowlX, 420, 680].map((x) => {
        const y = spoonY(x) + (x === bowlX ? 30 : 12);
        return (
          <g key={x}>
            <rect x={x - 8} y={y} width="16" height="34" rx="4" fill={MID_WOOD} stroke={INK} strokeWidth="3" />
            <circle cx={x} cy={y + 24} r="3" fill={INK} />
          </g>
        );
      })}
      <g transform={`translate(${from.x} ${from.y}) rotate(${slope})`}>
        <rect x={bowlU + 50} y="0" width={len - bowlU - 50} height="14" rx="7" fill={WOOD} stroke={INK} strokeWidth="3.5" />
        <path d={`M${bowlU - 82} 0 A82 32 0 0 0 ${bowlU + 82} 0 Z`} fill={WOOD} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <ellipse cx={bowlU} cy="3" rx="74" ry="9" fill={MID_WOOD} />
        <line x1={bowlU + 90} y1="7" x2={len - 30} y2="7" stroke={MID_WOOD} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={len - 16} cy="7" r="4" fill={DARK_WOOD} />
      </g>
    </g>
  );
});

/** A cylinder seen from one end, with its other end `depth` up and to the right: the outline of both ends and the sides. */
function cylinder(c: Pt, r: number, depth: Pt) {
  const len = Math.hypot(depth.x, depth.y);
  const nx = (-depth.y / len) * r;
  const ny = (depth.x / len) * r;
  const b = { x: c.x + depth.x, y: c.y + depth.y };
  return `M${c.x + nx} ${c.y + ny} L${b.x + nx} ${b.y + ny} A${r} ${r} 0 0 0 ${b.x - nx} ${b.y - ny} L${c.x - nx} ${c.y - ny} A${r} ${r} 0 0 0 ${c.x + nx} ${c.y + ny} Z`;
}

/** The paper towel roll on its wall holder, and the paper it lets down onto the shelf as it spins. */
function PaperTowel({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const { cx, cy, r, depth } = ROLL;
  const turned = kitchen.rollAngle(t);
  const paper = 46 + turned * r;
  const room = SHELF.y - cy - 2;
  const hang = Math.min(paper, room);
  const pile = Math.max(0, paper - room);
  const x0 = cx + r;
  const folds = Math.min(5, Math.ceil(pile / 40));
  return (
    <g>
      {/* The holder: an arm from the wall up to the axle at the back */}
      <rect x={cx - 4} y={cy + 66} width="56" height="22" rx="5" fill={STEEL} stroke={INK} strokeWidth="3" />
      <line x1={cx + 24} y1={cy + 70} x2={cx + depth.x} y2={cy + depth.y} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1={cx + 24} y1={cy + 70} x2={cx + depth.x} y2={cy + depth.y} stroke={STEEL} strokeWidth="4" strokeLinecap="round" />
      {/* The hanging sheet, seen a little from the side */}
      <path
        d={`M${x0} ${cy} L${x0 + depth.x} ${cy + depth.y} L${x0 + depth.x} ${cy + depth.y + hang} L${x0} ${cy + hang} Z`}
        fill="#fff"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {Array.from({ length: Math.floor(hang / 56) }, (_, i) => {
        const y = cy + hang - 20 - i * 56;
        return <line key={i} x1={x0 + 4} y1={y} x2={x0 + depth.x - 4} y2={y + depth.y} stroke="#9fb4d6" strokeWidth="2.5" strokeDasharray="5 5" />;
      })}
      {Array.from({ length: folds }, (_, i) => (
        <rect key={i} x={x0 - 18 + (i % 2) * 8} y={SHELF.y - 6 - i * 6} width="66" height="7" rx="3.5" fill="#fff" stroke={INK} strokeWidth="2" />
      ))}
      <path d={cylinder({ x: cx, y: cy }, r, depth)} fill="#f4f6fb" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke={INK} strokeWidth="3.5" />
      {[38, 28].map((rr) => (
        <circle key={rr} cx={cx} cy={cy} r={rr} fill="none" stroke="#dde3f0" strokeWidth="2" />
      ))}
      <g transform={`translate(${cx} ${cy}) rotate(${deg(turned)})`}>
        {[0, 120, 240].map((a) => (
          <circle key={a} cx={33 * Math.cos((a * Math.PI) / 180)} cy={33 * Math.sin((a * Math.PI) / 180)} r="5" fill="#8ecae6" />
        ))}
        <circle r="17" fill="#c98a4b" stroke={INK} strokeWidth="3" />
        <circle r="10" fill="#6b4423" />
      </g>
    </g>
  );
}

const Shelf = memo(function Shelf() {
  const { x0, x1, y, h } = SHELF;
  return (
    <g>
      {[x0 + 50, x1 - 80].map((x) => (
        <path key={x} d={`M${x} ${y + h} L${x} ${y + h + 52} L${x + 34} ${y + h} Z`} fill={MID_WOOD} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      ))}
      <rect x={x0} y={y} width={x1 - x0} height={h} rx="5" fill={WOOD} stroke={INK} strokeWidth="4" />
    </g>
  );
});

/* ---------- Rolling pin and cutting board ---------- */

/** The cutting board, hooked under the shelf by its hole, its lower end on the counter. */
const Board = memo(function Board() {
  const { from, to, h } = BOARD;
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  const slope = deg(Math.atan2(to.y - from.y, to.x - from.x));
  return (
    <g>
      <g transform={`translate(${from.x} ${from.y}) rotate(${slope})`}>
        <rect x="-6" y="0" width={len + 6} height={h} rx="6" fill="#e9b97f" stroke={INK} strokeWidth="3.5" />
        <line x1="40" y1={h / 2} x2={len - 30} y2={h / 2} stroke="#d39a5a" strokeWidth="2" />
      </g>
      <circle cx={from.x + 12} cy={from.y + 6} r="4" fill={INK} />
      <path d={`M${from.x + 12} ${SHELF.y + SHELF.h} L${from.x + 12} ${from.y + 4}`} stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
});

/** The rolling pin, seen from its end with the rest of it going back to the right; `turned` is how far it has rolled. */
function RollingPin({ at, turned }: { at: Pt; turned: number }) {
  const { r, depth } = PIN;
  const back = { x: at.x + depth.x, y: at.y + depth.y };
  const spin = deg(turned / r);
  return (
    <g>
      <circle cx={back.x + depth.x * 0.45} cy={back.y + depth.y * 0.45} r="10" fill={MID_WOOD} stroke={INK} strokeWidth="3" />
      <path d={cylinder(at, r, depth)} fill={WOOD} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx={at.x} cy={at.y} r={r} fill="#e8a865" stroke={INK} strokeWidth="3.5" />
      <g transform={`translate(${at.x} ${at.y}) rotate(${spin})`}>
        <circle r="20" fill="none" stroke={MID_WOOD} strokeWidth="2" />
        <line x1="-24" y1="0" x2="-14" y2="0" stroke={MID_WOOD} strokeWidth="3" strokeLinecap="round" />
        <line x1="14" y1="0" x2="24" y2="0" stroke={MID_WOOD} strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* The front handle sticks out towards us */}
      <line x1={at.x} y1={at.y} x2={at.x - depth.x * 0.35} y2={at.y - depth.y * 0.35} stroke={INK} strokeWidth="22" strokeLinecap="round" />
      <line x1={at.x} y1={at.y} x2={at.x - depth.x * 0.35} y2={at.y - depth.y * 0.35} stroke={MID_WOOD} strokeWidth="16" strokeLinecap="round" />
      <g transform={`translate(${at.x - depth.x * 0.35} ${at.y - depth.y * 0.35}) rotate(${spin})`}>
        <circle r="10" fill="#c98a4b" stroke={INK} strokeWidth="3" />
        <line x1="-6" y1="0" x2="6" y2="0" stroke={DARK_WOOD} strokeWidth="2.5" />
      </g>
    </g>
  );
}

/* ---------- Ladle and meatball ---------- */

/** The rail the ladle hangs from, a whisk and a spatula next to it, and the wall peg that stops the ladle. */
const LadleRail = memo(function LadleRail() {
  const { hook } = LADLE;
  return (
    <g>
      {[1830, 2170].map((x) => (
        <rect key={x} x={x - 7} y={hook.y - 30} width="14" height="26" rx="4" fill={STEEL} stroke={INK} strokeWidth="3" />
      ))}
      <rect x="1830" y={hook.y - 14} width="340" height="10" rx="5" fill={STEEL} stroke={INK} strokeWidth="3" />
      {/* A whisk */}
      <g transform={`translate(1870 ${hook.y - 4})`}>
        <path d="M0 0 L0 12 M0 12 L0 80" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <rect x="-6" y="16" width="12" height="62" rx="6" fill="#ff5d73" stroke={INK} strokeWidth="3" />
        {[-24, -12, 0, 12, 24].map((dx) => (
          <path key={dx} d={`M0 78 Q${dx * 1.4} 120 0 170`} fill="none" stroke="#9aa3bf" strokeWidth="3" />
        ))}
        <path d="M0 78 Q-34 120 0 170 Q34 120 0 78" fill="none" stroke={INK} strokeWidth="3" />
      </g>
      {/* A spatula */}
      <g transform={`translate(1932 ${hook.y - 4})`}>
        <path d="M0 0 L0 14" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <rect x="-6" y="14" width="12" height="90" rx="6" fill="#3ec300" stroke={INK} strokeWidth="3" />
        <rect x="-22" y="104" width="44" height="58" rx="8" fill="#3ec300" stroke={INK} strokeWidth="3" />
        {[-10, 0, 10].map((dx) => (
          <line key={dx} x1={dx} y1="114" x2={dx} y2="150" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        ))}
      </g>
      <circle cx={PEG.x} cy={PEG.y} r="11" fill={MID_WOOD} stroke={INK} strokeWidth="3" />
      <circle cx={PEG.x - 3} cy={PEG.y - 3} r="3" fill="#fff8" />
    </g>
  );
});

/** The ladle's hook, handle and the inside of its bowl, drawn hanging straight from the hook at (0, 0). */
const LadleBack = memo(function LadleBack() {
  const { bowl, bowlR } = LADLE;
  return (
    <g>
      <path d="M0 14 L0 -2 Q0 -12 -10 -10" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <line x1="0" y1="10" x2="0" y2={bowl.y} stroke={INK} strokeWidth="13" strokeLinecap="round" />
      <line x1="0" y1="10" x2="0" y2={bowl.y} stroke={STEEL} strokeWidth="7" strokeLinecap="round" />
      <circle cx="0" cy="26" r="5" fill={INK} />
      <ellipse cx={bowl.x} cy={bowl.y} rx={bowlR} ry="8" fill="#8d93a8" stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** The front of the ladle's bowl, over the meatball. */
const LadleFront = memo(function LadleFront() {
  const { bowl, bowlR } = LADLE;
  return (
    <g>
      <path
        d={`M${bowl.x - bowlR} ${bowl.y} A${bowlR} ${bowlR} 0 0 0 ${bowl.x + bowlR} ${bowl.y} A${bowlR} 8 0 0 1 ${bowl.x - bowlR} ${bowl.y} Z`}
        fill={STEEL}
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d={`M${bowl.x - bowlR + 10} ${bowl.y + 12} Q${bowl.x - bowlR + 14} ${bowl.y + 26} ${bowl.x - 12} ${bowl.y + 32}`}
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
});

function Meatball({ at, spin }: { at: Pt; spin: number }) {
  const r = MEATBALL.r;
  return (
    <g transform={`translate(${at.x} ${at.y})`}>
      <circle r={r} fill="#a0522d" stroke={INK} strokeWidth="3" />
      <g transform={`rotate(${deg(spin)})`}>
        {[
          [-9, -6, 4],
          [8, -10, 3],
          [10, 8, 4],
          [-6, 10, 3],
        ].map(([x, y, rr]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={rr} fill="#7a3b1c" />
        ))}
        <path d="M-4 -2 L2 0 M6 2 L2 6" stroke="#3ec300" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="-8" cy="-10" r="5" fill="#fff" opacity="0.6" />
    </g>
  );
}

/** A bowl of spaghetti with tomato sauce, which catches the meatball. */
const Spaghetti = memo(function Spaghetti() {
  const { cx, rimY, w } = SPAGHETTI;
  const h = w / 2;
  return (
    <g>
      <path
        d={`M${cx - h + 8} ${rimY} Q${cx - h + 20} ${rimY - 30} ${cx} ${rimY - 30} Q${cx + h - 20} ${rimY - 30} ${cx + h - 8} ${rimY} Z`}
        fill="#ffe08a"
        stroke={INK}
        strokeWidth="3"
      />
      {[-40, -18, 6, 28].map((dx, i) => (
        <path
          key={dx}
          d={`M${cx + dx} ${rimY - 4} q8 -${12 + (i % 2) * 6} 16 0 q8 -14 16 0`}
          fill="none"
          stroke="#e8b84a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
      <ellipse cx={cx} cy={rimY - 18} rx="30" ry="10" fill="#ff5d3a" />
      <path
        d={`M${cx - h} ${rimY} L${cx + h} ${rimY} Q${cx + h - 6} ${COUNTER - 4} ${cx + 34} ${COUNTER} L${cx - 34} ${COUNTER} Q${cx - h + 6} ${COUNTER - 4} ${cx - h} ${rimY} Z`}
        fill="#00b4d8"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {[-36, -12, 12, 36].map((dx) => (
        <circle key={dx} cx={cx + dx} cy={rimY + 16} r="5" fill="#fff" />
      ))}
    </g>
  );
});

/* ---------- Plate and cooktop ---------- */

/** The two little wooden pegs the plate stands between. */
const PlatePegs = memo(function PlatePegs() {
  const { x0, pegW, pegH } = PLATE;
  return (
    <g>
      {[x0 - PLATE_PEG_DX - pegW, x0 + PLATE_PEG_DX].map((x) => (
        <rect key={x} x={x} y={COUNTER - pegH} width={pegW} height={pegH + 2} rx="3" fill={DARK_WOOD} stroke={INK} strokeWidth="2.5" />
      ))}
    </g>
  );
});

/** The plate rolling on its rim, seen face on; `flat` lays it down backwards onto the counter. */
function Plate({ at, turned, tilt, flat }: { at: Pt; turned: number; tilt: number; flat: number }) {
  const r = PLATE.r;
  const squash = 1 - 0.82 * flat;
  return (
    <g transform={`translate(${at.x} ${COUNTER}) rotate(${tilt}) scale(1 ${squash}) translate(0 ${at.y - COUNTER})`}>
      <circle r={r} fill="#fff" stroke={INK} strokeWidth="3.5" />
      <circle r={r - 12} fill="none" stroke="#3a86ff" strokeWidth="6" />
      <circle r={r - 34} fill="#f3f7ff" stroke="#b9c9ea" strokeWidth="2" />
      <g transform={`rotate(${deg(turned / r)})`}>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return <circle key={i} cx={(r - 23) * Math.cos(a)} cy={(r - 23) * Math.sin(a)} r="4.5" fill="#ff7bd0" />;
        })}
        {/* Two cherries in the middle */}
        <path d="M-10 6 Q-6 -16 6 -22 M10 4 Q8 -12 6 -22" fill="none" stroke="#3ec300" strokeWidth="3" strokeLinecap="round" />
        <circle cx="-10" cy="10" r="9" fill="#ff3b3b" stroke={INK} strokeWidth="2" />
        <circle cx="11" cy="8" r="9" fill="#ff3b3b" stroke={INK} strokeWidth="2" />
      </g>
      <path d={`M${-r + 18} -22 A${r - 18} ${r - 18} 0 0 1 -22 ${-r + 18}`} fill="none" stroke="#fff" strokeWidth="5" opacity="0.8" />
    </g>
  );
}

/** The cooktop set into the worktop: glowing rings under the kettle and the pot, and the touch field that lights up. */
function Cooktop({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const heat = kitchen.heat(t);
  const on = t >= kitchen.tBeep;
  return (
    <g>
      <rect x={COOKTOP.x0} y={COUNTER - 5} width={COOKTOP.x1 - COOKTOP.x0} height="10" rx="3" fill="#2b2d42" stroke={INK} strokeWidth="2.5" />
      {[KETTLE.cx, POT.cx].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={COUNTER - 2} rx="100" ry="14" fill="#ff4d2e" opacity={0.55 * heat} />
          <rect x={x - 96} y={COUNTER - 4} width="192" height="7" rx="3.5" fill="#ff4d2e" opacity={heat} />
          <rect x={x - 80} y={COUNTER - 2} width="160" height="3" rx="1.5" fill="#ffd23f" opacity={heat} />
        </g>
      ))}
      {/* The touch field's symbol on the worktop edge */}
      <circle cx={COOKTOP.touchX} cy={COUNTER + 12} r="9" fill={on ? "#3ec300" : "#2b2d42"} stroke={INK} strokeWidth="2" />
      <path d={`M${COOKTOP.touchX} ${COUNTER + 6} L${COOKTOP.touchX} ${COUNTER + 12}`} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

const Kettle = memo(function Kettle() {
  const { cx, h } = KETTLE;
  const top = COUNTER - h;
  return (
    <g>
      <path d={`M${cx - 50} ${COUNTER - 60} L${cx - 92} ${COUNTER - 98}`} stroke={INK} strokeWidth="20" strokeLinecap="round" />
      <path d={`M${cx - 50} ${COUNTER - 60} L${cx - 92} ${COUNTER - 98}`} stroke="#00b4d8" strokeWidth="13" strokeLinecap="round" />
      <circle cx={cx - 96} cy={COUNTER - 102} r="8" fill="#ffd23f" stroke={INK} strokeWidth="2.5" />
      <path d={`M${cx - 36} ${top + 26} Q${cx} ${top - 50} ${cx + 36} ${top + 26}`} fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d={`M${cx - 36} ${top + 26} Q${cx} ${top - 50} ${cx + 36} ${top + 26}`} fill="none" stroke="#ff5d73" strokeWidth="4" strokeLinecap="round" />
      <path
        d={`M${cx - 62} ${COUNTER - 4} Q${cx - 66} ${top + 24} ${cx} ${top + 18} Q${cx + 66} ${top + 24} ${cx + 62} ${COUNTER - 4} Z`}
        fill="#00b4d8"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <ellipse cx={cx} cy={top + 20} rx="28" ry="7" fill="#0096b4" stroke={INK} strokeWidth="3" />
      <circle cx={cx} cy={top + 10} r="7" fill="#ff5d73" stroke={INK} strokeWidth="2.5" />
      <rect x={cx - 64} y={COUNTER - 12} width="128" height="10" rx="4" fill={INK} />
      <path
        d={`M${cx - 38} ${top + 50} Q${cx - 46} ${top + 76} ${cx - 42} ${top + 96}`}
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.8"
      />
    </g>
  );
});

/** Steam from the kettle's spout: a puff now and then once it is hot, and lots of it when it whistles. */
function Steam({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const start = kitchen.tBeep + 2.2;
  if (t < start) return null;
  const whistle = kitchen.tToast + 0.35;
  const life = 1.6;
  // The kettle goes quiet a few seconds after it whistled: steaming for ever kept the phone painting it (perf).
  const last = Math.min(t, whistle + 4);
  const puffs = [];
  for (let te = start; te <= last; te += te >= whistle ? 0.14 : 0.5) {
    const age = t - te;
    if (age > life) continue;
    const big = te >= whistle;
    const x = KETTLE.cx - 100 + (big ? 30 : 10) * age;
    const y = COUNTER - 108 - 80 * age;
    puffs.push(
      <circle key={te} cx={x} cy={y} r={(big ? 14 : 8) + 18 * age} fill="#f4f5fb" stroke="#b9bdd6" strokeWidth="3" opacity={0.9 * (1 - age / life)} />,
    );
  }
  return <g>{puffs}</g>;
}

/* ---------- Salad spinner, egg timer, pancake pan ---------- */

/** A ruffled lettuce leaf with its pale middle vein, lengthwise round (0, 0). */
function Lettuce({ x, y, angle, s = 1 }: { x: number; y: number; angle: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
      <path
        d="M-26 0 Q-24 -14 -12 -12 Q-6 -20 4 -14 Q14 -20 20 -10 Q30 -6 26 2 Q28 12 16 12 Q8 18 -2 12 Q-12 18 -18 10 Q-28 10 -26 0 Z"
        fill="#7ed957"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M-20 1 Q0 -3 22 0 M-4 -1 L4 -9 M6 -1 L12 6" fill="none" stroke="#d4f7b5" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/**
 * The salad spinner: a see-through bowl with the basket and lettuce going
 * round inside, and the lid with its crank, which pops off while it whirls.
 */
function SaladSpinner({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const { cx, top, w, foot } = SPINNER;
  const dx = kitchen.spinnerShake(t);
  const phi = kitchen.crankAngle(t);
  const turned = Math.PI - phi;
  const half = w / 2;
  const low = foot / 2;
  const bottom = COUNTER - 8;
  const bowl = `M${cx - half} ${top} L${cx + half} ${top} L${cx + low} ${bottom - 14} Q${cx + low - 2} ${bottom} ${cx + low - 16} ${bottom} L${cx - low + 16} ${bottom} Q${cx - low + 2} ${bottom} ${cx - low} ${bottom - 14} Z`;
  // Only the basket's slats on the front half are drawn, so it seems to turn.
  const slats = Array.from({ length: 10 }, (_, i) => turned + (i * Math.PI) / 5).filter((a) => Math.sin(a) > 0);
  const lid = kitchen.lidAt(t);
  const kx = CRANK.r * Math.cos(phi);
  const ky = 4 * Math.sin(phi);
  return (
    <g>
      <g transform={`translate(${dx} 0)`}>
        <path d={bowl} fill="#d8f5e3" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        {[0, 1, 2, 3].map((i) => {
          const a = turned + (i * Math.PI) / 2;
          return <Lettuce key={i} x={cx + 40 * Math.cos(a)} y={top + 40 + (i % 2) * 22} angle={i * 50 + 20 * Math.cos(a)} s={0.85 + 0.15 * Math.sin(a)} />;
        })}
        {slats.map((a) => (
          <line key={a} x1={cx + 64 * Math.cos(a)} y1={top + 10} x2={cx + 52 * Math.cos(a)} y2={bottom - 8} stroke="#fff" strokeWidth="4" opacity="0.85" />
        ))}
        <path d={bowl} fill="#7fd6a8" opacity="0.35" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d={`M${cx - half + 16} ${top + 14} L${cx - low + 12} ${bottom - 22}`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
        <rect x={cx - low + 8} y={bottom} width={foot - 16} height="8" rx="3" fill="#3ec300" stroke={INK} strokeWidth="2.5" />
      </g>
      <g transform={`translate(${lid.pt.x} ${lid.pt.y}) rotate(${lid.angle})`}>
        <path d={`M${-half - 4} 6 Q${-half} -10 0 -10 Q${half} -10 ${half + 4} 6 Z`} fill="#3ec300" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <path d={`M${-half + 18} -2 Q0 -8 ${half - 18} -2`} fill="none" stroke="#a6f07a" strokeWidth="3" strokeLinecap="round" />
        <rect x="-9" y="-24" width="18" height="16" rx="4" fill="#ffd23f" stroke={INK} strokeWidth="3" />
        <line x1="0" y1="-18" x2={kx} y2={-18 + ky} stroke={INK} strokeWidth="11" strokeLinecap="round" />
        <line x1="0" y1="-18" x2={kx} y2={-18 + ky} stroke="#ffd23f" strokeWidth="5" strokeLinecap="round" />
        <circle cx={kx} cy={-CRANK.knobUp + ky} r={CRANK.knobR} fill="#ff5d73" stroke={INK} strokeWidth="3" />
      </g>
    </g>
  );
}

/** The leaves flung out of the salad spinner; the big one flies to the egg timer. */
function Leaves({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  return (
    <g>
      {kitchen.leaves.map((_, i) => {
        const leaf = kitchen.leafAt(i, t);
        return leaf && <Lettuce key={i} x={leaf.pt.x} y={leaf.pt.y} angle={leaf.angle} s={leaf.big ? 1.5 : 1} />;
      })}
    </g>
  );
}

/** The wooden wedge the pancake pan rests on. */
const Wedge = memo(function Wedge() {
  const { x, h, w } = WEDGE;
  return (
    <path
      d={`M${x - w / 2} ${COUNTER} L${x - 5} ${COUNTER - h + 4} Q${x} ${COUNTER - h - 1} ${x + 5} ${COUNTER - h + 4} L${x + w / 2} ${COUNTER} Z`}
      fill={MID_WOOD}
      stroke={INK}
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
  );
});

/** The glass cookie jar the egg timer stands on. */
const CookieJar = memo(function CookieJar() {
  const { x0, x1, top } = JAR;
  const w = x1 - x0;
  const cookies = [
    [34, -26],
    [86, -24],
    [58, -64],
    [100, -66],
  ];
  return (
    <g>
      <rect x={x0} y={top + 16} width={w} height={COUNTER - top - 16} rx="20" fill="#e8f6ff" stroke={INK} strokeWidth="4" />
      {cookies.map(([dx, dy]) => (
        <g key={dx}>
          <circle cx={x0 + dx} cy={COUNTER + dy} r="22" fill="#d9a35b" stroke={INK} strokeWidth="2.5" />
          {[
            [-8, -6],
            [7, -2],
            [-2, 9],
          ].map(([cx, cy]) => (
            <circle key={cx} cx={x0 + dx + cx} cy={COUNTER + dy + cy} r="3.5" fill="#6b4423" />
          ))}
        </g>
      ))}
      <path d={`M${x0 + 18} ${top + 36} L${x0 + 18} ${COUNTER - 30}`} stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity="0.8" />
      <rect x={x0 + 10} y={top + 12} width={w - 20} height="10" fill="#ff5d73" stroke={INK} strokeWidth="2.5" />
      <rect x={x0 - 6} y={top} width={w + 12} height="18" rx="8" fill="#ff7bd0" stroke={INK} strokeWidth="3.5" />
    </g>
  );
});

/** The egg timer, face on: its dial turns, it rocks with every tick, and it rings with its little bell on top. */
function EggTimer({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const { pt, tilt, dial, ringing } = kitchen.timerAt(t);
  const { rx, ry, foot } = TIMER;
  const egg = `M0 ${-ry} C${rx * 0.75} ${-ry} ${rx} ${-ry * 0.1} ${rx} ${ry * 0.25} C${rx} ${ry * 0.75} ${rx * 0.55} ${ry} 0 ${ry} C${-rx * 0.55} ${ry} ${-rx} ${ry * 0.75} ${-rx} ${ry * 0.25} C${-rx} ${-ry * 0.1} ${-rx * 0.75} ${-ry} 0 ${-ry} Z`;
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${tilt})`}>
      {[-1, 1].map((side) => (
        <ellipse key={side} cx={side * 15} cy={foot - 5} rx="11" ry="5" fill="#ff8c42" stroke={INK} strokeWidth="3" />
      ))}
      <path d={egg} fill="#fffaf0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path
        d={`M${-rx + 1} 12 Q0 20 ${rx - 1} 12 C${rx - 2} ${ry * 0.75} ${rx * 0.55} ${ry - 2} 0 ${ry - 2} C${-rx * 0.55} ${ry - 2} ${-rx + 2} ${ry * 0.75} ${-rx + 1} 12 Z`}
        fill="#ffd23f"
      />
      <path d={egg} fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {/* The dial: its marks and the red part of the set time go round with it */}
      <circle cy="-10" r="22" fill="#fff" stroke={INK} strokeWidth="3" />
      <g transform={`translate(0 -10) rotate(${dial})`}>
        <path
          d={`M0 0 L0 -18 A18 18 0 0 0 ${-18 * Math.sin((DIAL_MAX * Math.PI) / 180 / 4)} ${-18 * Math.cos((DIAL_MAX * Math.PI) / 180 / 4)} Z`}
          fill="#ff5d73"
          opacity="0.8"
        />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="0" y1={i % 3 ? -15 : -12} x2="0" y2="-19" stroke={INK} strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${i * 30})`} />
        ))}
        <circle r="4" fill={INK} />
      </g>
      <path d="M0 -30 L-6 -40 L6 -40 Z" fill="#ff3b3b" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      {/* A little face */}
      <circle cx="-10" cy="24" r="3.5" fill={INK} />
      <circle cx="10" cy="24" r="3.5" fill={INK} />
      {ringing ? (
        <ellipse cy="33" rx="5" ry="6" fill="#ff5d73" stroke={INK} strokeWidth="2.5" />
      ) : (
        <path d="M-6 31 Q0 36 6 31" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      )}
      <circle cy={-ry - 5} r="8" fill="#ffd23f" stroke={INK} strokeWidth="3" />
      {ringing &&
        [-1, 1].map((side) => (
          <path
            key={side}
            d={`M${side * 16} ${-ry - 6} q${side * 8} -4 ${side * 8} -16 M${side * 24} ${-ry + 2} q${side * 12} -6 ${side * 14} -24`}
            fill="none"
            stroke="#ff8c42"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
    </g>
  );
}

/** The pancake, seen from the side: a golden disc that turns somersaults; `squash` flattens it as it lands. */
function Pancake({ at, angle, squash }: { at: Pt; angle: number; squash: number }) {
  const { r, h } = PANCAKE;
  return (
    <g transform={`translate(${at.x} ${at.y + h / 2}) scale(${2 - squash} ${squash}) translate(0 ${-h / 2}) rotate(${angle})`}>
      <ellipse rx={r} ry={h / 2 + 1} fill="#e9a23b" stroke={INK} strokeWidth="3" />
      <ellipse cy="-2" rx={r - 10} ry={h / 2 - 3} fill="#ffd27a" />
      {[-26, 2, 24].map((dx) => (
        <circle key={dx} cx={dx} cy="-1" r="2.5" fill="#b8691f" />
      ))}
    </g>
  );
}

/** The pancake pan on its wedge, the pancake in it; the egg timer landing on its handle tips it over. */
function PancakePan({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const cake = kitchen.pancakeAt(t);
  const pan = `translate(${WEDGE.x} ${COUNTER - WEDGE.h}) rotate(${-kitchen.panAngle(t)})`;
  const { back, rimH, handle, handleH } = PAN;
  const left = -back - 22;
  const mid = (left + 12) / 2;
  const rx = (12 - left) / 2;
  return (
    <g>
      <g transform={pan}>
        <ellipse cx={mid} cy={-rimH} rx={rx} ry="9" fill="#2b2d42" stroke={INK} strokeWidth="3" />
      </g>
      <Pancake at={cake.pt} angle={cake.angle} squash={cake.squash} />
      <g transform={pan}>
        <rect x="0" y={-handleH} width={handle} height={handleH} rx="7" fill="#ff5d73" stroke={INK} strokeWidth="3.5" />
        <circle cx={handle - 12} cy={-handleH / 2} r="3.5" fill={INK} />
        <path
          d={`M${left} ${-rimH} L${-back} -3 Q${-back + 1} 0 ${-back + 6} 0 L-14 0 Q-9 0 -8 -3 L12 ${-rimH} A${rx} 9 0 0 1 ${left} ${-rimH} Z`}
          fill="#4a4e69"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d={`M${left + 24} ${-rimH + 14} Q${mid} ${-rimH + 20} ${-24} ${-rimH + 14}`} fill="none" stroke="#8d93a8" strokeWidth="4" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* ---------- Jelly, pepper mill, coffee machine ---------- */

/** The raspberry jelly on its plate: it sways and squashes under the pancake, sheared over its foot. */
function Jelly({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const { sway, squash } = kitchen.jellyAt(t);
  const { cx, h, foot, top, plate, plateH } = JELLY;
  const skew = -deg(Math.atan(sway / (h * squash)));
  const shape = `M${-foot / 2} 0 L${-top / 2} ${-h + 16} Q${-top / 2} ${-h} ${-top / 2 + 16} ${-h} L${top / 2 - 16} ${-h} Q${top / 2} ${-h} ${top / 2} ${-h + 16} L${foot / 2} 0 Z`;
  return (
    <g>
      <ellipse cx={cx} cy={COUNTER - plateH / 2} rx={plate / 2} ry={plateH / 2 + 3} fill="#fff" stroke={INK} strokeWidth="3" />
      <g transform={`translate(${cx} ${COUNTER - plateH}) skewX(${skew}) scale(1 ${squash})`}>
        <path d={shape} fill="#ff4d6d" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        {[-1, 0, 1].map((k) => (
          <path key={k} d={`M${(k * foot) / 3} -4 L${(k * top) / 3} ${-h + 8}`} stroke="#d62850" strokeWidth="5" strokeLinecap="round" />
        ))}
        <path d={`M${-foot / 2 + 16} -14 L${-top / 2 + 10} ${-h + 22}`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.75" />
      </g>
    </g>
  );
}

/** The wooden pepper mill: it rocks and falls over its bottom right corner. */
function PepperMill({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const { x0, w, h } = MILL;
  return (
    <g transform={`translate(${x0 + w} ${COUNTER}) rotate(${kitchen.millTilt(t)})`}>
      <rect x={-w + 9} y={-h + 50} width={w - 18} height={h - 110} fill={MID_WOOD} stroke={INK} strokeWidth="3.5" />
      <rect x={-w} y="-64" width={w} height="64" rx="6" fill={DARK_WOOD} stroke={INK} strokeWidth="3.5" />
      <rect x={-w} y={-h} width={w} height="54" rx="6" fill={DARK_WOOD} stroke={INK} strokeWidth="3.5" />
      <rect x={-w} y="-58" width={w} height="8" fill="#ffd23f" stroke={INK} strokeWidth="2.5" />
      <rect x={-w} y={-h + 44} width={w} height="8" fill="#ffd23f" stroke={INK} strokeWidth="2.5" />
      <circle cx={-w / 2} cy={-h - 8} r="10" fill={DARK_WOOD} stroke={INK} strokeWidth="3" />
      <path d={`M${-w + 12} -76 L${-w + 12} ${-h + 64}`} stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
    </g>
  );
}

/** The coffee machine's body, which stays as it is: hopper, front, spout and drip tray. */
const CoffeeBody = memo(function CoffeeBody() {
  const { x0, w, top } = COFFEE;
  const x1 = x0 + w;
  return (
    <g>
      {/* The bean hopper on top */}
      <path
        d={`M${x0 + 22} ${top} L${x0 + 30} ${top - 46} L${x0 + 96} ${top - 46} L${x0 + 104} ${top} Z`}
        fill="#e8f6ffcc"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {[
        [40, -12],
        [58, -10],
        [76, -13],
        [92, -9],
        [48, -26],
        [68, -28],
        [86, -24],
      ].map(([dx, dy]) => (
        <ellipse key={`${dx}${dy}`} cx={x0 + dx} cy={top + dy} rx="7" ry="5" fill="#6b4423" stroke={INK} strokeWidth="1.5" />
      ))}
      <rect x={x0 + 24} y={top - 54} width="78" height="10" rx="4" fill="#4a4e69" stroke={INK} strokeWidth="2.5" />
      <rect x={x0} y={top} width={w} height={COUNTER - top} rx="18" fill="#9b5de5" stroke={INK} strokeWidth="4" />
      {/* The recess the cup stands in */}
      <rect x={CUP.cx - 62} y={SPOUT_Y - 30} width="124" height={DRIP_Y - SPOUT_Y + 30} rx="12" fill="#3d405b" stroke={INK} strokeWidth="3" />
      <rect x={CUP.cx - 34} y={SPOUT_Y - 30} width="68" height="20" rx="6" fill={STEEL} stroke={INK} strokeWidth="2.5" />
      <rect x={CUP.cx - 7} y={SPOUT_Y - 12} width="14" height="12" rx="3" fill={STEEL} stroke={INK} strokeWidth="2.5" />
      <rect x={CUP.cx - 70} y={DRIP_Y} width="140" height={COUNTER - DRIP_Y} rx="4" fill={STEEL} stroke={INK} strokeWidth="3" />
      {/* The vent under the bottle */}
      {[-14, 0, 14].map((dx) => (
        <line key={dx} x1={BOTTLE.cx + dx} y1={top + 8} x2={BOTTLE.cx + dx} y2={top + 22} stroke="#5a2d91" strokeWidth="4" strokeLinecap="round" />
      ))}
      <path d={`M${x1 - 18} ${top + 40} L${x1 - 18} ${top + 100}`} stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity="0.5" />
    </g>
  );
});

/** The coffee machine: it shakes while it grinds, pours into the cup and puffs steam; the leaning mill pushes its button in. */
function CoffeeMachine({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const { x0, w, top, button, buttonY, buttonR } = COFFEE;
  const out = button - kitchen.buttonIn(t);
  const full = kitchen.cupFull(t);
  const brewing = t >= kitchen.tPress && t < kitchen.tBrewed;
  const level = DRIP_Y - 8 - (CUP.h - 16) * full;
  const puff = t - kitchen.tBrewed;
  return (
    <g>
      <g transform={`translate(${kitchen.coffeeShake(t)} 0)`}>
        <rect x={x0 - out} y={buttonY - buttonR} width={out + 6} height={2 * buttonR} rx="6" fill="#ff3b3b" stroke={INK} strokeWidth="3" />
        <CoffeeBody />
        <circle cx={x0 + w - 40} cy={top + 46} r="11" fill={brewing ? "#7ed957" : "#2b2d42"} stroke={INK} strokeWidth="3" />
        <Bottle kitchen={kitchen} t={t} />
      </g>
      {kitchen.pouring(t) && <rect x={CUP.cx - 3} y={SPOUT_Y} width="6" height={level - SPOUT_Y} rx="3" fill="#6b3a1e" />}
      {/* The cup on the drip tray, filling up */}
      <path d={`M${CUP.cx + CUP.w / 2 - 4} ${DRIP_Y - CUP.h + 12} q26 2 22 18 q-4 14 -24 10`} fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d={`M${CUP.cx + CUP.w / 2 - 4} ${DRIP_Y - CUP.h + 12} q26 2 22 18 q-4 14 -24 10`} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path
        d={`M${CUP.cx - CUP.w / 2} ${DRIP_Y - CUP.h} L${CUP.cx + CUP.w / 2} ${DRIP_Y - CUP.h} L${CUP.cx + CUP.w / 2 - 6} ${DRIP_Y - 4} Q${CUP.cx + CUP.w / 2 - 8} ${DRIP_Y} ${CUP.cx + CUP.w / 2 - 14} ${DRIP_Y} L${CUP.cx - CUP.w / 2 + 14} ${DRIP_Y} Q${CUP.cx - CUP.w / 2 + 8} ${DRIP_Y} ${CUP.cx - CUP.w / 2 + 6} ${DRIP_Y - 4} Z`}
        fill="#fff"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {full > 0 && <rect x={CUP.cx - CUP.w / 2 + 8} y={level} width={CUP.w - 16} height={DRIP_Y - 8 - level} rx="3" fill="#6b3a1e" />}
      <path d={`M${CUP.cx - 18} ${DRIP_Y - 30} L${CUP.cx + 18} ${DRIP_Y - 30}`} stroke="#ff5d73" strokeWidth="5" strokeLinecap="round" />
      {/* The puff of steam round the bottle's foot when the coffee is ready */}
      {puff > 0 &&
        puff < 1.2 &&
        [-1, 1].map((side) => (
          <circle
            key={side}
            cx={BOTTLE.cx + side * (26 + 30 * puff)}
            cy={top - 8 - 40 * puff}
            r={10 + 22 * puff}
            fill="#f4f5fb"
            stroke="#b9bdd6"
            strokeWidth="3"
            opacity={0.9 * (1 - puff / 1.2)}
          />
        ))}
    </g>
  );
}

/** The bottle of apple fizz on the machine: bubbles rise as it is shaken, and it hops at the puff of steam. */
function Bottle({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const { cx, w, h } = BOTTLE;
  const top = COFFEE.top;
  const fizz = kitchen.fizz(t);
  const bubbles = Math.round(fizz * 9);
  const body = top - h + 44;
  return (
    <g transform={`translate(0 ${-kitchen.bottleHop(t)})`}>
      <path
        d={`M${cx - w / 2} ${top - 4} L${cx - w / 2} ${body + 10} Q${cx - w / 2} ${body - 8} ${cx - 13} ${body - 22} L${cx - 13} ${top - h} L${cx + 13} ${top - h} L${cx + 13} ${body - 22} Q${cx + w / 2} ${body - 8} ${cx + w / 2} ${body + 10} L${cx + w / 2} ${top - 4} Q${cx + w / 2} ${top} ${cx + w / 2 - 6} ${top} L${cx - w / 2 + 6} ${top} Q${cx - w / 2} ${top} ${cx - w / 2} ${top - 4} Z`}
        fill="#ffe066"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {Array.from({ length: bubbles }, (_, i) => {
        const rise = (t * 70 + i * 23) % (h - 40);
        return <circle key={i} cx={cx + ((i * 7) % 3) * 9 - 9} cy={top - 8 - rise} r={2.5 + (i % 3)} fill="#fff" opacity="0.85" />;
      })}
      {/* The label: an apple, no words */}
      <rect x={cx - w / 2} y={body + 18} width={w} height="38" fill="#fff8e7" stroke={INK} strokeWidth="2.5" />
      <circle cx={cx} cy={body + 39} r="11" fill="#ff3b3b" stroke={INK} strokeWidth="2" />
      <path d={`M${cx} ${body + 28} q4 -6 9 -4 q-3 6 -9 4`} fill="#3ec300" stroke={INK} strokeWidth="1.5" />
      <path
        d={`M${cx - w / 2 + 8} ${body + 4} L${cx - w / 2 + 8} ${body + 14} M${cx - w / 2 + 8} ${top - 30} L${cx - w / 2 + 8} ${top - 12}`}
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </g>
  );
}

/** The cork: in the neck, then flying in somersaults, then lying on the bread box. */
function Cork({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const { pt, angle } = kitchen.corkAt(t);
  const { w, h } = CORK;
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${angle})`}>
      <path
        d={`M${-w / 2} ${-h / 2} L${w / 2} ${-h / 2} L${w / 2 - 3} ${h / 2} L${-w / 2 + 3} ${h / 2} Z`}
        fill="#d9a35b"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="-4" cy="-4" r="2" fill="#a86f2f" />
      <circle cx="4" cy="5" r="2" fill="#a86f2f" />
    </g>
  );
}

/* ---------- Bread box, egg, honey ---------- */

/** The bread box with its roll-top front, and the baking tray leaning against it. */
const BreadBox = memo(function BreadBox() {
  const { x0, x1, top } = BREADBOX;
  const { from, to, h } = TRAY;
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  const n = { x: (-(to.y - from.y) * h) / len, y: ((to.x - from.x) * h) / len };
  return (
    <g>
      <rect x={x0} y={top} width={x1 - x0} height={COUNTER - top} rx="16" fill={MID_WOOD} stroke={INK} strokeWidth="4" />
      {[22, 36, 50, 64].map((dy) => (
        <line key={dy} x1={x0 + 14} y1={top + dy} x2={x1 - 14} y2={top + dy} stroke={DARK_WOOD} strokeWidth="3" strokeLinecap="round" />
      ))}
      <rect x={(x0 + x1) / 2 - 24} y={top + 72} width="48" height="12" rx="6" fill="#ffd23f" stroke={INK} strokeWidth="2.5" />
      <path
        d={`M${from.x} ${from.y} L${to.x} ${to.y} L${to.x + n.x} ${to.y + n.y} L${from.x + n.x} ${from.y + n.y} Z`}
        fill="#6c757d"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d={`M${from.x + 14} ${from.y + 3} L${to.x - 14} ${to.y - 1}`} stroke="#c9cfd6" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
});

/** The egg cup on the bread box, drawn over the egg so the egg sits in it. */
const EggCup = memo(function EggCup() {
  const { cx, w, h } = EGG_CUP;
  const y = BREADBOX.top;
  return (
    <g>
      <ellipse cx={cx} cy={y - 4} rx={w / 2 - 2} ry="5" fill="#ffd23f" stroke={INK} strokeWidth="3" />
      <rect x={cx - 6} y={y - 16} width="12" height="12" fill="#ffd23f" stroke={INK} strokeWidth="3" />
      <path
        d={`M${cx - w / 2} ${y - h} L${cx + w / 2} ${y - h} Q${cx + w / 2} ${y - 14} ${cx} ${y - 14} Q${cx - w / 2} ${y - 14} ${cx - w / 2} ${y - h} Z`}
        fill="#ffd23f"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx={cx - 8} cy={y - h + 7} r="2.5" fill="#ff5d73" />
      <circle cx={cx + 6} cy={y - h + 9} r="2.5" fill="#ff5d73" />
    </g>
  );
});

/** The egg: it tips out of its cup and rolls end over end, so it wobbles as it goes. */
function Egg({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const { pt, angle } = kitchen.eggAt(t);
  const { rx, ry } = EGG;
  const shape = `M0 ${-ry} C${rx * 0.75} ${-ry} ${rx} ${-ry * 0.2} ${rx} ${ry * 0.2} C${rx} ${ry * 0.75} ${rx * 0.55} ${ry} 0 ${ry} C${-rx * 0.55} ${ry} ${-rx} ${ry * 0.75} ${-rx} ${ry * 0.2} C${-rx} ${-ry * 0.2} ${-rx * 0.75} ${-ry} 0 ${-ry} Z`;
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${angle})`}>
      <path d={shape} fill="#f6dcb5" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d={`M${-rx + 7} -4 Q${-rx + 6} ${-ry + 12} -4 ${-ry + 6}`} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    </g>
  );
}

/** The honey running out of the fallen jar along the worktop to the touch field. */
function Honey({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  if (t < kitchen.tJarDown + 0.1) return null;
  const mouth = HONEY_MOUTH_X;
  const front = kitchen.honeyFront(t);
  const lip = Math.min(1, (t - kitchen.tJarDown - 0.1) / 0.4);
  return (
    <path
      d={`M${mouth - 8} ${COUNTER - 34} Q${mouth + 6 + 10 * lip} ${COUNTER - 32} ${mouth + 10 + 6 * lip} ${COUNTER - 13} L${front - 8} ${COUNTER - 13} Q${front + 6} ${COUNTER - 13} ${front + 6} ${COUNTER} L${mouth - 8} ${COUNTER} Z`}
      fill="#f4a300"
      stroke="#b86e00"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  );
}

/** The honey jar: a glass jar full of honey with a honeycomb label; it teeters and falls over its bottom right corner. */
function HoneyJar({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const { x0, w, h } = HONEY;
  const left = kitchen.honeyLeft(t);
  const lid = kitchen.honeyLidAt(t);
  return (
    <g>
      <g transform={`translate(${x0 + w} ${COUNTER}) rotate(${kitchen.jarTilt(t)})`}>
        <rect x={-w} y={-h} width={w} height={h} rx="16" fill="#e8f6ff" stroke={INK} strokeWidth="4" />
        <rect x={-w + 6} y={-(h - 14) * left - 6} width={w - 12} height={(h - 14) * left} rx="10" fill="#f4a300" />
        <path d={`M${-w / 2 - 10} ${-h / 2 - 9} l10 -6 l10 6 l0 12 l-10 6 l-10 -6 Z`} fill="#ffd23f" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d={`M${-w + 12} ${-h + 22} L${-w + 12} -18`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
        <rect x={-w + 6} y={-h - 4} width={w - 12} height="8" fill="#e8f6ff" stroke={INK} strokeWidth="3" />
      </g>
      <g transform={`translate(${lid.pt.x} ${lid.pt.y}) rotate(${lid.angle})`}>
        <rect x={-w / 2 - 4} y={-HONEY.lid / 2} width={w + 8} height={HONEY.lid} rx="5" fill="#ff8c42" stroke={INK} strokeWidth="3" />
        {[-24, -8, 8, 24].map((dx) => (
          <line key={dx} x1={dx} y1={-HONEY.lid / 2 + 4} x2={dx} y2={HONEY.lid / 2 - 4} stroke="#c95f1a" strokeWidth="3" strokeLinecap="round" />
        ))}
      </g>
    </g>
  );
}

/* ---------- Popcorn ---------- */

/** A popped corn: a little cloud with an outline. */
function Popcorn({ x, y, s = 1.4 }: { x: number; y: number; s?: number }) {
  const blobs = [
    [0, 0, 8],
    [-7, 3, 6],
    [7, 3, 6],
    [0, -6, 6],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {blobs.map(([bx, by, r]) => (
        <circle key={`o${bx}${by}`} cx={bx} cy={by} r={r + 2} fill={INK} />
      ))}
      {blobs.map(([bx, by, r]) => (
        <circle key={`f${bx}${by}`} cx={bx} cy={by} r={r} fill={POPCORN} />
      ))}
      <circle cx="2" cy="2" r="2.5" fill="#ffb703" />
    </g>
  );
}

const PotBack = memo(function PotBack() {
  return <ellipse cx={POT.cx} cy={POT_RIM} rx={POT.w / 2} ry="12" fill="#7a2a3a" stroke={INK} strokeWidth="3" />;
});

/** The popcorn in the pot, rising as more of it pops. */
function PopcornHeap({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const n = kitchen.popped(t);
  if (n === 0) return null;
  const top = kitchen.heapY(n);
  const blobs = [];
  for (let row = 0; top + row * 18 < POT_RIM + 18; row++) {
    for (let i = 0; i < 6; i++) {
      const x = POT.cx - 56 + i * 22 + (row % 2) * 11;
      blobs.push(<Popcorn key={`${row}-${i}`} x={x} y={top + row * 18 + (i % 2) * 5} />);
    }
  }
  return <g>{blobs}</g>;
}

const PotFront = memo(function PotFront() {
  const { cx, w } = POT;
  const half = w / 2;
  return (
    <g>
      {[-1, 1].map((side) => (
        <rect key={side} x={cx + side * (half + 6) - 14} y={POT_RIM + 14} width="28" height="12" rx="6" fill={INK} />
      ))}
      <path
        d={`M${cx - half} ${POT_RIM} A${half} 12 0 0 0 ${cx + half} ${POT_RIM} L${cx + half - 4} ${COUNTER - 10} Q${cx + half - 6} ${COUNTER - 2} ${cx + half - 18} ${COUNTER - 2} L${cx - half + 18} ${COUNTER - 2} Q${cx - half + 6} ${COUNTER - 2} ${cx - half + 4} ${COUNTER - 10} Z`}
        fill="#ff5d73"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${cx - half + 16} ${POT_RIM + 22} L${cx - half + 16} ${COUNTER - 22}`} stroke="#fff8" strokeWidth="7" strokeLinecap="round" />
      {[-30, 0, 30].map((dx) => (
        <circle key={dx} cx={cx + dx} cy={POT_RIM + 46} r="7" fill="#fff" opacity="0.85" />
      ))}
    </g>
  );
});

/** Popcorn in the air, and what has landed on the counter. */
function Kernels({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  return (
    <g>
      {kitchen.kernels.map((k, i) => {
        if (t < k.t0) return null;
        if (t >= k.t1) return k.to === "counter" ? <Popcorn key={i} x={k.b.x} y={k.b.y} /> : null;
        const p = hop(k.a, k.b, k.h, seg(t, k.t0, k.t1));
        const flash = t - k.t0 < 0.1;
        return (
          <g key={i}>
            {flash && <path transform={`translate(${k.a.x} ${k.a.y - 10})`} d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4 Z" fill="#ffd23f" />}
            <Popcorn x={p.x} y={p.y} s={1.4 * Math.min(1, 0.4 + (t - k.t0) * 6)} />
          </g>
        );
      })}
    </g>
  );
}

/* ---------- Toaster and finale ---------- */

/** The mug hangs on the toaster lever by its handle; the popcorn in it pulls the lever down. */
function Mug({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const knob = kitchen.knobY(t);
  const top = mugTop(knob);
  const n = kitchen.mugCount(t);
  const swing = wobble(t - kitchen.tPop, 9, 12, 3);
  const left = MUG.x - MUG.w / 2;
  return (
    <g>
      <rect x={KNOB_X} y={knob - 9} width={LEVER.knobW + 14} height="18" rx="7" fill="#3b3b4f" stroke={INK} strokeWidth="3" />
      <g transform={`rotate(${swing} ${KNOB_X + 6} ${knob})`}>
        <ellipse cx={KNOB_X + 2} cy={knob + 10} rx="15" ry="19" fill="none" stroke={INK} strokeWidth="10" />
        <ellipse cx={KNOB_X + 2} cy={knob + 10} rx="15" ry="19" fill="none" stroke="#ffd23f" strokeWidth="5" />
        <rect x={left} y={top} width={MUG.w} height={MUG.h} rx="10" fill="#ffd23f" stroke={INK} strokeWidth="4" />
        <ellipse cx={MUG.x} cy={top + 3} rx={MUG.w / 2 - 4} ry="5" fill="#b07a12" />
        <path d={`M${MUG.x - 2} ${top + 36} c-6 -8 -16 -2 -10 6 l10 10 l10 -10 c6 -8 -4 -14 -10 -6 Z`} fill="#ff5d73" />
        {Array.from({ length: n }, (_, j) => (
          <Popcorn key={j} x={MUG.x + Math.sin(j * 2.3) * 13} y={top + 6 - Math.min(j, 6) * 3} />
        ))}
      </g>
    </g>
  );
}

function Toaster({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const { x0, x1, top, slotX } = TOASTER;
  const hot = t >= kitchen.tLever && t < kitchen.tPop ? 0.6 + 0.4 * Math.sin(t * 9) : 0;
  // The timer dial turns back to zero while the toast is in.
  const dial = -150 * (1 - seg(t, kitchen.tLever, kitchen.tPop)) * (t >= kitchen.tLever ? 1 : 0);
  return (
    <g>
      {[x0 + 30, x1 - 50].map((x) => (
        <rect key={x} x={x} y={COUNTER - 10} width="20" height="10" rx="3" fill={INK} />
      ))}
      <rect x={x0} y={top} width={x1 - x0} height={COUNTER - 8 - top} rx="34" fill={STEEL} stroke={INK} strokeWidth="4" />
      <rect x={x0} y={top + 92} width={x1 - x0} height="26" fill="#3a86ff" stroke={INK} strokeWidth="3" />
      <rect x={slotX - 54} y={top - 3} width="108" height="12" rx="5" fill="#3b3b4f" stroke={INK} strokeWidth="2.5" />
      <ellipse cx={slotX} cy={top - 4} rx="62" ry="14" fill="#ff8c42" opacity={0.45 * hot} />
      <rect x={slotX - 50} y={top} width="100" height="6" rx="3" fill="#ff8c42" opacity={hot} />
      <path d={`M${x0 + 26} ${top + 24} L${x0 + 26} ${top + 78}`} stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
      <circle cx={x1 - 40} cy={top + 56} r="14" fill="#fff" stroke={INK} strokeWidth="3" />
      <line
        x1={x1 - 40}
        y1={top + 56}
        x2={x1 - 40}
        y2={top + 46}
        stroke={INK}
        strokeWidth="3"
        strokeLinecap="round"
        transform={`rotate(${dial} ${x1 - 40} ${top + 56})`}
      />
      <circle cx={x1 - 78} cy={top + 56} r="6" fill={hot ? "#ff3b3b" : "#7a2a3a"} stroke={INK} strokeWidth="2" />
      {/* The slot the lever runs in */}
      <rect x={x0 + 6} y={LEVER.up - 12} width="8" height={LEVER.down - LEVER.up + 24} rx="4" fill="#3b3b4f" />
    </g>
  );
}

/** The slice of toast: pale until the toaster has done its work. */
function Toast({ kitchen, t }: { kitchen: Kitchen; t: number }) {
  const { pt, angle, flat } = kitchen.toastAt(t);
  const { w, h } = TOAST;
  const done = t >= kitchen.tPop;
  return (
    <g transform={`translate(${pt.x} ${pt.y + h / 2}) scale(1 ${1 - 0.72 * flat}) translate(0 ${-h / 2}) rotate(${angle})`}>
      <path
        d={`M${-w / 2} ${h / 2 - 8} L${-w / 2} ${-h / 2 + 30} Q${-w / 2 - 6} ${-h / 2} ${-w / 4} ${-h / 2} Q0 ${-h / 2 - 8} ${w / 4} ${-h / 2} Q${w / 2 + 6} ${-h / 2} ${w / 2} ${-h / 2 + 30} L${w / 2} ${h / 2 - 8} Q${w / 2} ${h / 2} ${w / 2 - 8} ${h / 2} L${-w / 2 + 8} ${h / 2} Q${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - 8} Z`}
        fill={done ? "#b36b26" : "#d9a35b"}
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <rect x={-w / 2 + 10} y={-h / 2 + 14} width={w - 20} height={h - 24} rx="12" fill={done ? "#e9b56a" : "#fbe7b5"} />
      {done && <path d={`M${-w / 2 + 16} -6 L${w / 2 - 16} -6 M${-w / 2 + 16} 14 L${w / 2 - 16} 14`} stroke="#c98a3c" strokeWidth="4" strokeLinecap="round" />}
      {done && <path d="M-8 -26 Q2 -34 12 -26 Q4 -18 -8 -26 Z" fill="#ffe36b" />}
    </g>
  );
}

/** The breakfast plate lying on the counter, a cup of cocoa and a jar of jam. */
const BreakfastPlate = memo(function BreakfastPlate() {
  const { cx, top } = BREAKFAST;
  const cup = cx - 204;
  const jam = cx + 310;
  return (
    <g>
      <path
        d={`M${cup - 46} ${COUNTER} L${cup - 36} ${COUNTER - 62} L${cup + 36} ${COUNTER - 62} L${cup + 46} ${COUNTER} Z`}
        fill="#ff7bd0"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <ellipse cx={cup} cy={COUNTER - 62} rx="36" ry="7" fill="#7a3b1c" stroke={INK} strokeWidth="2.5" />
      <path d={`M${cup + 46} ${COUNTER - 48} q24 4 0 30`} fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path
        d={`M${cx - 40} ${COUNTER} L${cx - 30} ${top + 8} L${cx + 30} ${top + 8} L${cx + 40} ${COUNTER} Z`}
        fill="#e8eefc"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <ellipse cx={cx} cy={top} rx="92" ry="14" fill="#fff" stroke={INK} strokeWidth="3.5" />
      <ellipse cx={cx} cy={top} rx="70" ry="9" fill="none" stroke="#3a86ff" strokeWidth="3" />
      <rect x={jam} y={COUNTER - 74} width="56" height="74" rx="10" fill="#ff3b3bcc" stroke={INK} strokeWidth="3.5" />
      <rect x={jam - 6} y={COUNTER - 88} width="68" height="20" rx="6" fill="#fff" stroke={INK} strokeWidth="3" />
      <path d={`M${jam - 6} 552 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6`} fill="none" stroke="#ff5d73" strokeWidth="3" />
    </g>
  );
});

/** The toy bunny waiting for breakfast; it cheers when the toast lands. */
function Bunny({ age }: { age: number }) {
  const x = BUNNY.x;
  const cheer = age >= 0;
  const jump = cheer ? Math.abs(wobble(age, 22, 9, 2.4)) : 0;
  const arm = cheer ? -130 + wobble(age, 20, 10, 1.5) : -20;
  return (
    <g transform={`translate(${x} ${-jump})`}>
      {[-1, 1].map((side) => (
        <g key={side} transform={`rotate(${side * (cheer ? 14 : 8) + wobble(age, 8, 12, 2)} ${side * 18} 470)`}>
          <ellipse cx={side * 22} cy="410" rx="15" ry="52" fill="#fff" stroke={INK} strokeWidth="3.5" />
          <ellipse cx={side * 22} cy="414" rx="7" ry="36" fill="#ffb3c7" />
        </g>
      ))}
      <ellipse cx="0" cy={COUNTER - 46} rx="56" ry="48" fill="#fff" stroke={INK} strokeWidth="3.5" />
      <path d={`M-30 ${COUNTER - 82} L30 ${COUNTER - 82} L0 ${COUNTER - 40} Z`} fill="#8ecae6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {[-1, 1].map((side) => (
        <g key={side} transform={`rotate(${side * arm} ${side * 42} ${COUNTER - 74})`}>
          <ellipse cx={side * 42} cy={COUNTER - 46} rx="14" ry="30" fill="#fff" stroke={INK} strokeWidth="3" />
        </g>
      ))}
      <circle cx="0" cy="505" r="46" fill="#fff" stroke={INK} strokeWidth="3.5" />
      <circle cx="-17" cy="498" r="6" fill={INK} />
      <circle cx="17" cy="498" r="6" fill={INK} />
      <circle cx="-15" cy="496" r="2" fill="#fff" />
      <circle cx="19" cy="496" r="2" fill="#fff" />
      <circle cx="-30" cy="518" r="8" fill="#ffb3c7" />
      <circle cx="30" cy="518" r="8" fill="#ffb3c7" />
      <ellipse cx="0" cy="512" rx="6" ry="4.5" fill="#ff7bd0" />
      {cheer ? (
        <path d="M-14 524 Q0 544 14 524 Z" fill="#ff5d73" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      ) : (
        <circle cx="0" cy="528" r="5" fill="none" stroke={INK} strokeWidth="2.5" />
      )}
      <ellipse cx="-30" cy={COUNTER - 4} rx="22" ry="10" fill="#fff" stroke={INK} strokeWidth="3" />
      <ellipse cx="30" cy={COUNTER - 4} rx="22" ry="10" fill="#fff" stroke={INK} strokeWidth="3" />
    </g>
  );
}
