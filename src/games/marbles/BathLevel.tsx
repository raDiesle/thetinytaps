import { memo, useId, useMemo } from "react";
import { VIEW_H, type LevelProps } from "./level";
import {
  BASIN,
  BATH_SHELF,
  type Bath,
  BLOWHOLE,
  BRUSH,
  BUBBLES,
  BUTTON,
  buildBath,
  COUNTER,
  DRYER,
  FLOOR,
  HANDLE,
  HOLDER,
  KEY,
  LAMP,
  LEVER,
  leverKnob,
  MUG,
  NOZZLE,
  ROLL,
  SHELF,
  TAP,
  TEAR,
  TUB,
  TUBE,
  WAND,
  WHALE,
  WORLD_W,
} from "./bath";
import { easeOut, rad, seg, svgLine } from "./machineKit";
import { MachineStage } from "./MachineStage";
import { BAR_COLORS } from "./parts";
import { INK, Sparkles } from "./scenery";

const PAINT = "#e3f4ff";
const TILE = "#bfe6f5";
const TILE_LINE = "#9fd3e8";
const WATER = "#7fd8ff";
const FOAM = "#ffffff";
const ENAMEL = "#fdfdff";
const CHROME = "#cfd8e3";
const PASTE = "#ffffff";
const DUCK_YELLOW = "#ffd23f";
const WHALE_BLUE = "#4ea8de";
const DRYER_PURPLE = "#b388ff";
const CAP_PINK = "#ff9ed8";
/** Where the tiles end and the paint begins. */
const TILES_TOP = 380;

/**
 * Level 13: the bathroom (R-05). One tap on the red button squeezes the
 * toothpaste tube, the blob tips the toothbrush off the glass shelf into the
 * tooth mug, the mug topples and knocks the squeaky duck onto the bath tap's
 * lever, the tub fills with foam and overflows, the wave carries the duck over
 * the rim against the toilet roll, which rolls off its holder and away over the
 * floor in a long paper ribbon until it winds up the wind-up whale. The whale
 * waddles to the hair dryer and spouts a fountain onto its switch; the dryer
 * blows the shower cap onto the ceiling lamp and soap bubbles out of the
 * bubble wand, which pop at the lamp one by one. The camera travels along.
 */
export function BathLevel(props: LevelProps) {
  const bath = useMemo(buildBath, []);
  const ids = useId();

  return (
    <MachineStage machine={bath} level="bath" {...props}>
      {(t) => (
        <>
          <Room tiles={`${ids}-tiles`} />
          <Washstand />
          <Shelf />
          <Tube bath={bath} t={t} />
          <Mug bath={bath} t={t} />
          <Brush bath={bath} t={t} />
          <Tap bath={bath} t={t} />
          <Water bath={bath} t={t} inside={`${ids}-inside`} />
          <Duck bath={bath} t={t} />
          <Tub />
          <Overflow bath={bath} t={t} />
          <Holder />
          <Roll bath={bath} t={t} />
          <Whale bath={bath} t={t} belly={`${ids}-belly`} />
          <Fountain bath={bath} t={t} />
          <DryerRing />
          <Dryer bath={bath} t={t} />
          <BathShelf />
          <Wand bath={bath} t={t} />
          <FlyingCap bath={bath} t={t} />
          <Lamp bath={bath} t={t} glow={`${ids}-glow`} />
          <Bubbles bath={bath} t={t} sheen={`${ids}-sheen`} />
          <Sparkles x={LAMP.x} y={LAMP.y + 20} age={t - bath.tLast - 0.15} n={12} spread={260} />
          <Sparkles x={WHALE.stop} y={FLOOR - 170} age={t - bath.tLast - 0.5} n={8} spread={200} />
          {t < 0 && <Hint />}
        </>
      )}
    </MachineStage>
  );
}

/* ---------- The room ---------- */

/** The walls, ceiling and floor, with the pictures on them: drawn once, it never changes. */
const Room = memo(function Room({ tiles }: { tiles: string }) {
  return (
    <g>
      <defs>
        <pattern id={tiles} width="80" height="80" patternUnits="userSpaceOnUse" y={TILES_TOP}>
          <rect width="80" height="80" fill={TILE} stroke={TILE_LINE} strokeWidth="4" />
        </pattern>
      </defs>
      <rect x="-400" y="-200" width={WORLD_W + 800} height={TILES_TOP + 200} fill={PAINT} />
      <rect x="-400" y={TILES_TOP} width={WORLD_W + 800} height={FLOOR - TILES_TOP} fill={`url(#${tiles})`} />
      <line x1="-400" y1={TILES_TOP} x2={WORLD_W + 400} y2={TILES_TOP} stroke={TILE_LINE} strokeWidth="8" />
      {/* The ceiling */}
      <rect x="-400" y="-200" width={WORLD_W + 800} height="214" fill="#fff" stroke={INK} strokeWidth="4" />
      <Porthole x={2400} y={190} />
      <Porthole x={3500} y={190} />
      <TowelRail x={2860} />
      <Basket x={5320} />
      <Plant x={5600} />
      {/* The floor: big black and white tiles */}
      <rect x="-400" y={FLOOR} width={WORLD_W + 800} height={VIEW_H - FLOOR + 200} fill="#f4f1ea" />
      {Array.from({ length: Math.ceil((WORLD_W + 800) / 100) }, (_, i) =>
        i % 2 ? null : <rect key={i} x={-400 + i * 100} y={FLOOR} width="100" height="50" fill="#5a6b8c" />,
      )}
      {Array.from({ length: Math.ceil((WORLD_W + 800) / 100) }, (_, i) =>
        i % 2 ? <rect key={i} x={-400 + i * 100} y={FLOOR + 50} width="100" height="60" fill="#5a6b8c" /> : null,
      )}
      <line x1="-400" y1={FLOOR} x2={WORLD_W + 400} y2={FLOOR} stroke={INK} strokeWidth="4" />
    </g>
  );
});

/** A round frosted window, with a little cloud behind the glass. */
function Porthole({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="96" fill="#d7f0ff" stroke={CHROME} strokeWidth="16" />
      <circle r="96" fill="none" stroke={INK} strokeWidth="4" />
      <path d="M-50 20 q14 -30 44 -14 q22 -26 50 0 q26 0 24 24 h-118 z" fill="#fff" />
      <line x1="-96" y1="0" x2="96" y2="0" stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** A chrome rail with a striped towel hanging over it. */
function TowelRail({ x }: { x: number }) {
  return (
    <g>
      <line x1={x} y1="470" x2={x + 230} y2="470" stroke={CHROME} strokeWidth="12" strokeLinecap="round" />
      <line x1={x} y1="470" x2={x + 230} y2="470" stroke={INK} strokeWidth="2" opacity="0.4" />
      <path d={`M${x + 40} 466 h150 v190 q-75 20 -150 0 z`} fill="#ff7bd0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {[40, 90, 140].map((dy) => (
        <line key={dy} x1={x + 40} y1={466 + dy} x2={x + 190} y2={466 + dy} stroke="#fff" strokeWidth="10" />
      ))}
    </g>
  );
}

function Basket({ x }: { x: number }) {
  return (
    <g>
      <path d={`M${x} 620 h180 l-18 180 h-144 z`} fill="#e0b070" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {[650, 690, 730, 770].map((y) => (
        <line key={y} x1={x + 6} y1={y} x2={x + 174} y2={y} stroke="#b8803d" strokeWidth="4" />
      ))}
      <path d={`M${x + 30} 620 q30 -50 70 -20 q30 -30 60 20 z`} fill="#8e7dff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    </g>
  );
}

function Plant({ x }: { x: number }) {
  return (
    <g>
      {[-50, -20, 10, 40].map((dx, i) => (
        <path key={dx} d={`M${x} 680 q${dx} -90 ${dx * 2} -${120 + (i % 2) * 40}`} fill="none" stroke="#3ec300" strokeWidth="14" strokeLinecap="round" />
      ))}
      <path d={`M${x - 60} 670 h120 l-14 130 h-92 z`} fill="#ff8c42" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    </g>
  );
}

/* ---------- Washstand, tube, brush, mug ---------- */

/** The washstand with its mirror, cupboard and basin: drawn once, it never changes. */
const Washstand = memo(function Washstand() {
  const { x0, x1, top } = COUNTER;
  return (
    <g>
      {/* The mirror over the basin */}
      <rect x={BASIN.x0 - 30} y="130" width={BASIN.x1 - BASIN.x0 + 60} height="230" rx="24" fill="#d4f1ff" stroke={CHROME} strokeWidth="12" />
      <rect x={BASIN.x0 - 30} y="130" width={BASIN.x1 - BASIN.x0 + 60} height="230" rx="24" fill="none" stroke={INK} strokeWidth="4" />
      <path d={`M${BASIN.x0 + 30} 190 l60 -40 M${BASIN.x0 + 40} 240 l110 -80`} stroke="#fff" strokeWidth="12" strokeLinecap="round" />
      {/* The cupboard and its top */}
      <rect x={x0} y={top} width={x1 - x0} height={FLOOR - top - 20} rx="8" fill="#8ecae6" stroke={INK} strokeWidth="4" />
      {[0, 1, 2, 3].map((i) => {
        const w = (x1 - x0 - 50) / 4;
        const dx = x0 + 10 + i * (w + 10);
        return (
          <g key={i}>
            <rect x={dx} y={top + 40} width={w} height={FLOOR - top - 80} rx="6" fill="#a8dadc" stroke={INK} strokeWidth="3" />
            <circle cx={dx + (i % 2 ? 22 : w - 22)} cy={top + 100} r="8" fill={CHROME} stroke={INK} strokeWidth="2" />
          </g>
        );
      })}
      <rect x={x0 - 10} y={top} width={x1 - x0 + 20} height="26" rx="8" fill="#fff" stroke={INK} strokeWidth="4" />
      {/* The basin, sunk into the top, and its tap */}
      <path d={`M${BASIN.x0} ${top + 2} h${BASIN.x1 - BASIN.x0} q-10 80 -150 80 q-140 0 -150 -80 z`} fill={ENAMEL} stroke={INK} strokeWidth="4" />
      <path
        d={`M${(BASIN.x0 + BASIN.x1) / 2 - 12} ${top} v-70 q0 -20 20 -20 h46 v24 h-30 v66 z`}
        fill={CHROME}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* A bar of soap and a little jar on the top */}
      <rect x={x0 + 20} y={top - 26} width="70" height="26" rx="12" fill="#ffb3e1" stroke={INK} strokeWidth="3" />
      <rect x={BASIN.x1 + 40} y={top - 60} width="40" height="60" rx="8" fill="#b9fbc0" stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** The glass shelf on two brackets. */
const Shelf = memo(function Shelf() {
  const { x0, x1, y } = SHELF;
  return (
    <g>
      {[x0 + 30, x1 - 50].map((x) => (
        <path key={x} d={`M${x} ${y + 6} v30 l20 -30 z`} fill={CHROME} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      ))}
      <rect x={x0} y={y} width={x1 - x0} height="12" rx="4" fill="#c9f1ff" opacity="0.85" stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** The tube hanging upside down in its holder; the button presses it flat from the top and the paste comes out below. */
function Tube({ bath, t }: { bath: Bath; t: number }) {
  const { x, nozzle, w } = TUBE;
  const flat = bath.squash(t);
  const top = TUBE.top + 70 * flat;
  // Squeezed, it gets a little fatter at the bottom.
  const half = w / 2 + 6 * flat;
  const press = bath.press(t);
  const blob = bath.blobAt(t);
  const shoulder = nozzle - 34;
  const label = (top + shoulder) / 2;
  return (
    <g>
      {/* The tube: crimped end at the top, round shoulders and the cap at the bottom */}
      <path
        d={`M${x - half} ${top + 12} H${x + half} V${shoulder - 22} Q${x + half} ${shoulder} ${x + 16} ${shoulder} H${x - 16} Q${x - half} ${shoulder} ${x - half} ${shoulder - 22} Z`}
        fill="#fff"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${x - half + 4} ${label - 14} H${x + half - 4}`} stroke="#ff5d73" strokeWidth="16" />
      <path d={`M${x - half + 4} ${label + 10} H${x + half - 4}`} stroke="#3a86ff" strokeWidth="10" />
      <rect x={x - w / 2 - 6} y={top} width={w + 12} height="16" rx="3" fill="#e9eef5" stroke={INK} strokeWidth="3" />
      {[-24, -8, 8, 24].map((dx) => (
        <line key={dx} x1={x + dx} y1={top + 3} x2={x + dx} y2={top + 13} stroke={INK} strokeWidth="2" />
      ))}
      <rect x={x - 16} y={shoulder - 2} width="32" height={nozzle - shoulder + 2} rx="5" fill="#3a86ff" stroke={INK} strokeWidth="3" />
      {/* The clip that holds it to the wall */}
      <rect x={x - half - 10} y={shoulder - 60} width={2 * half + 20} height="18" rx="6" fill={CHROME} stroke={INK} strokeWidth="3" />
      {/* The big red button on top, riding down as the tube gets flat */}
      <g transform={`translate(${x} ${top + BUTTON.y - TUBE.top + 8 * press})`}>
        <rect x="-8" y="0" width="16" height={TUBE.top - BUTTON.y - 8 * press} fill={CHROME} stroke={INK} strokeWidth="2" />
        <path
          d={`M${-BUTTON.r} 6 a${BUTTON.r} ${BUTTON.r * 0.8} 0 0 1 ${2 * BUTTON.r} 0 z`}
          fill="#ff5d73"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <ellipse cx="-10" cy="-8" rx="8" ry="4" fill="#fff" opacity="0.7" />
      </g>
      {blob && <Blob x={x} y={blob.y} size={bath.blobSize(t)} />}
    </g>
  );
}

/** The curly blob of toothpaste, white with a red and a blue stripe. */
function Blob({ x, y, size, angle = 0 }: { x: number; y: number; size: number; angle?: number }) {
  if (size <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}>
      <path d="M-22 6 q-4 -14 10 -16 q-2 -14 14 -12 q14 -2 12 12 q14 2 10 16 z" fill={PASTE} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M-14 0 q14 -8 28 0" fill="none" stroke="#ff5d73" strokeWidth="4" strokeLinecap="round" />
      <path d="M-8 -9 q8 -5 16 0" fill="none" stroke="#3a86ff" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

/** The toothbrush: a long handle and a head with bristles; once the blob has landed it rides on the bristles. */
function Brush({ bath, t }: { bath: Bath; t: number }) {
  const { pt, angle } = bath.brushAt(t);
  const { half, thick } = BRUSH;
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${angle})`}>
      <rect x={-half} y={-thick / 2} width={2 * half - 50} height={thick} rx={thick / 2} fill="#00b4d8" stroke={INK} strokeWidth="3" />
      <rect x={-half + 40} y={-thick / 2 + 3} width="60" height={thick - 6} rx="4" fill="#90e0ef" />
      <rect x={half - 62} y={-thick / 2} width="62" height={thick} rx="5" fill="#00b4d8" stroke={INK} strokeWidth="3" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect
          key={i}
          x={half - 58 + i * 10}
          y={-thick / 2 - 18}
          width="6"
          height="18"
          rx="2"
          fill={i % 2 ? "#fff" : "#caf0f8"}
          stroke={INK}
          strokeWidth="1.5"
        />
      ))}
      {t >= bath.tBlobLand && <Blob x={half - 30} y={-thick / 2 - 24} size={1} />}
    </g>
  );
}

/** The glass tooth mug: it wobbles when the brush lands in it, then falls over on its right corner. */
function Mug({ bath, t }: { bath: Bath; t: number }) {
  const { x, bottom, h, w } = MUG;
  const c = bath.corner;
  return (
    <g transform={`rotate(${bath.mugAngle(t)} ${c.x} ${c.y})`}>
      <path
        d={`M${x - w / 2} ${bottom - h} h${w} l-8 ${h} h${-(w - 16)} z`}
        fill="#c6f6d5"
        opacity="0.75"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${x - w / 2 + 14} ${bottom - h + 14} v${h - 30}`} stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x - 12 + i * 16} cy={bottom - h / 2} r="7" fill={BAR_COLORS[(i * 3) % BAR_COLORS.length]} />
      ))}
    </g>
  );
}

/** The squeaky duck, in a little blue sailor's hat; it turns as it flies. */
function Duck({ bath, t }: { bath: Bath; t: number }) {
  const { pt, spin } = bath.duckAt(t);
  // It squeaks happily (beak open) when it is hit, when it lands on the lever and when it bonks the toilet roll.
  const open = [bath.tHit, bath.tLever, bath.tBonk].some((at) => t > at && t < at + 0.35);
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${spin})`}>
      <path
        d="M-44 6 q0 34 40 34 h20 q28 0 30 -30 q-12 6 -24 2 q-6 -16 -28 -16 q-26 0 -38 10 z"
        fill={DUCK_YELLOW}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="-14" r="22" fill={DUCK_YELLOW} stroke={INK} strokeWidth="4" />
      <path d="M-26 14 q14 12 30 0" fill="none" stroke="#e0a800" strokeWidth="4" strokeLinecap="round" />
      <circle cx="22" cy="-18" r="4.5" fill={INK} />
      {open ? (
        <path d="M34 -12 l18 -8 l-4 10 l4 10 l-18 -4 z" fill="#ff8c42" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      ) : (
        <path d="M34 -12 q20 0 18 8 q-4 6 -18 4 z" fill="#ff8c42" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      )}
      {/* The sailor's hat */}
      <path d="M-4 -30 q20 -20 40 0 z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="-8" y="-34" width="48" height="8" rx="4" fill="#3a86ff" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/* ---------- Tap, tub, water, foam ---------- */

/** The bath tap on the wall, with its lever; the water rushes out of its spout. */
function Tap({ bath, t }: { bath: Bath; t: number }) {
  const { x, y } = TAP;
  const knob = leverKnob(bath.leverAngle(t));
  const pour = bath.pour(t);
  const spout = { x: x + 62, y: y + 34 };
  const surface = bath.waterY(t);
  return (
    <g>
      {pour > 0 && (
        <g opacity={pour}>
          <path
            d={`M${spout.x - 12} ${spout.y} q4 ${(surface - spout.y) / 2} 0 ${surface - spout.y} h28 q-6 ${-(surface - spout.y) / 2} 8 ${-(surface - spout.y)} z`}
            fill={WATER}
            opacity="0.85"
          />
          <path d={`M${spout.x - 2} ${spout.y + 10} v${surface - spout.y - 20}`} stroke="#fff" strokeWidth="4" strokeDasharray="18 22" opacity="0.8" />
        </g>
      )}
      <rect x={x - 40} y={y - 12} width="80" height="36" rx="12" fill={CHROME} stroke={INK} strokeWidth="4" />
      <path d={`M${x + 20} ${y} h30 q22 0 22 22 v12 h-26 v-8 q0 -6 -6 -6 h-20 z`} fill={CHROME} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <line x1={LEVER.pivot.x} y1={LEVER.pivot.y} x2={knob.x} y2={knob.y} stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <line x1={LEVER.pivot.x} y1={LEVER.pivot.y} x2={knob.x} y2={knob.y} stroke={CHROME} strokeWidth="8" strokeLinecap="round" />
      <circle cx={knob.x} cy={knob.y} r="14" fill="#ff5d73" stroke={INK} strokeWidth="3" />
      <circle cx={LEVER.pivot.x} cy={LEVER.pivot.y} r="10" fill={CHROME} stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** The tub seen cut open from the side: thick enamel walls round the inside, on four little feet. */
const TUB_INSIDE = `M${TUB.x0 + 30} ${TUB.rim} L${TUB.x0 + 60} ${TUB.bottom - 50} Q${TUB.x0 + 80} ${TUB.bottom} ${TUB.x0 + 160} ${TUB.bottom} L${TUB.x1 - 160} ${TUB.bottom} Q${TUB.x1 - 80} ${TUB.bottom} ${TUB.x1 - 60} ${TUB.bottom - 50} L${TUB.x1 - 30} ${TUB.rim} Z`;

const Tub = memo(function Tub() {
  const { x0, x1, rim, bottom } = TUB;
  const outer = `M${x0} ${rim} L${x0 + 30} ${bottom} Q${x0 + 50} ${bottom + 30} ${x0 + 140} ${bottom + 30} L${x1 - 140} ${bottom + 30} Q${x1 - 50} ${bottom + 30} ${x1 - 30} ${bottom} L${x1} ${rim} Z`;
  return (
    <g>
      {[x0 + 90, x1 - 130].map((x) => (
        <path
          key={x}
          d={`M${x} ${bottom + 20} q-10 30 -4 ${FLOOR - bottom - 20} h44 q6 -30 -4 ${-(FLOOR - bottom - 20)} z`}
          fill="#ffb703"
          stroke={INK}
          strokeWidth="4"
        />
      ))}
      <path d={`${outer} ${TUB_INSIDE}`} fillRule="evenodd" fill={ENAMEL} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <rect x={x0 - 14} y={rim - 12} width="54" height="20" rx="10" fill={ENAMEL} stroke={INK} strokeWidth="4" />
      <rect x={x1 - 40} y={rim - 12} width="54" height="20" rx="10" fill={ENAMEL} stroke={INK} strokeWidth="4" />
    </g>
  );
});

/** The water in the tub and the foam on it, both rising until they reach the rim. */
function Water({ bath, t, inside }: { bath: Bath; t: number; inside: string }) {
  const y = bath.waterY(t);
  const foam = bath.foam(t);
  const still = Math.min(t, bath.duration);
  if (bath.pour(t) <= 0 && t < bath.tWater) return null;
  const width = TUB.x1 - TUB.x0;
  return (
    <g>
      <defs>
        <clipPath id={inside}>
          <path d={TUB_INSIDE} />
          {/* Foam may heap up over the rim. */}
          <rect x={TUB.x0 + 20} y={TUB.rim - 200} width={width - 40} height="200" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${inside})`}>
        <rect x={TUB.x0} y={y} width={width} height={TUB.bottom - y + 10} fill={WATER} opacity="0.85" />
        {Array.from({ length: Math.ceil(width / 70) * (foam > 4 ? 1 : 0) }, (_, i) => {
          const bx = TUB.x0 + 40 + i * 70;
          const r = 24 + ((i * 7) % 4) * 6;
          return (
            <g key={i}>
              <circle
                cx={bx}
                cy={y - foam * 0.45 + 6 * Math.sin(still * 2 + i)}
                r={r * (0.4 + 0.6 * (foam / 90))}
                fill={FOAM}
                stroke="#cbe9f7"
                strokeWidth="3"
              />
              <circle cx={bx + 34} cy={y - foam * 0.85} r={r * 0.8 * (foam / 90)} fill={FOAM} stroke="#cbe9f7" strokeWidth="3" />
            </g>
          );
        })}
      </g>
    </g>
  );
}

/** Foam spilling down the outside of the tub's right end, and the puddle spreading over the floor. */
function Overflow({ bath, t }: { bath: Bath; t: number }) {
  const k = bath.spill(t);
  if (k <= 0) return null;
  const still = Math.min(t, bath.duration);
  return (
    <g>
      <ellipse cx={TUB.x1 + 40 + 120 * k} cy={FLOOR + 14} rx={60 + 260 * k} ry={10 + 12 * k} fill={WATER} opacity="0.7" />
      {Array.from({ length: 6 }, (_, i) => {
        const fall = (still * 0.6 + i / 6) % 1;
        const y = TUB.rim + fall * (FLOOR - TUB.rim) * k;
        return <circle key={i} cx={TUB.x1 + 10 + 18 * Math.sin(fall * 3)} cy={y} r={18 - 6 * fall} fill={FOAM} stroke="#cbe9f7" strokeWidth="3" opacity={k} />;
      })}
      <path
        d={`M${TUB.x1 - 30} ${TUB.rim - 10} q50 -30 60 10 q10 ${60 * k} -6 ${120 * k} q-30 10 -40 -20 z`}
        fill={FOAM}
        stroke="#cbe9f7"
        strokeWidth="3"
        opacity={k}
      />
    </g>
  );
}

/* ---------- Toilet roll ---------- */

/** The toilet roll holder: a chrome arm out of a wall plate, and the tear bar under it that keeps the paper's end. */
const Holder = memo(function Holder() {
  const { x, y } = HOLDER;
  return (
    <g>
      <rect x={x - 76} y={y - 34} width="20" height="68" rx="6" fill={CHROME} stroke={INK} strokeWidth="3" />
      <line x1={x - 58} y1={y} x2={x + 12} y2={y} stroke={INK} strokeWidth="12" strokeLinecap="round" />
      <line x1={x - 58} y1={y} x2={x + 12} y2={y} stroke={CHROME} strokeWidth="6" strokeLinecap="round" />
      <path d={`M${x - 58} ${y + 28} Q${x - 20} ${TEAR.y + 6} ${TEAR.x - 22} ${TEAR.y}`} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <rect x={TEAR.x - 24} y={TEAR.y - 5} width="44" height="10" rx="4" fill={CHROME} stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** The paper ribbon: white with a dark edge and little perforation lines. */
function Paper({ d }: { d: string }) {
  return (
    <g fill="none" strokeLinejoin="round" strokeLinecap="round">
      <path d={d} stroke={INK} strokeWidth="18" />
      <path d={d} stroke="#fff" strokeWidth="12" />
      <path d={d} stroke="#d9d9e6" strokeWidth="12" strokeDasharray="2 26" strokeLinecap="butt" />
    </g>
  );
}

/** The toilet roll: on its holder with its end hanging over the tear bar, then rolling off, thinner and thinner. */
function Roll({ bath, t }: { bath: Bath; t: number }) {
  const { pt, r, spin } = bath.rollAt(t);
  const ribbon = bath.ribbon(t);
  const flap = `M${HOLDER.x + ROLL.r - 2} ${HOLDER.y} L${TEAR.x + 6} ${TEAR.y - 2} L${TEAR.x + 6} ${TEAR.y + 46}`;
  return (
    <g>
      <Paper d={ribbon ? svgLine(ribbon) : flap} />
      <g transform={`translate(${pt.x} ${pt.y}) rotate(${spin})`}>
        <circle r={r} fill="#fff" stroke={INK} strokeWidth="4" />
        {/* Little hearts printed on the paper show it turning. */}
        {r > ROLL.core + 8 &&
          [0, 120, 240].map((a) => {
            const m = (r + ROLL.core) / 2;
            return <circle key={a} cx={m * Math.cos(rad(a))} cy={m * Math.sin(rad(a))} r={Math.min(6, (r - ROLL.core) / 3)} fill={CAP_PINK} />;
          })}
        <circle r={ROLL.core} fill="#d9a86c" stroke={INK} strokeWidth="3" />
        <circle r={ROLL.core - 7} fill="#8a5a2b" />
        <line x1="0" y1={-ROLL.core} x2="0" y2={-r} stroke="#d9d9e6" strokeWidth="3" />
      </g>
    </g>
  );
}

/* ---------- Wind-up whale ---------- */

/** The wind-up whale on its two little feet, its golden key in its side; asleep (eyes shut) until it is wound up. */
function Whale({ bath, t, belly }: { bath: Bath; t: number; belly: string }) {
  const { x, tilt, lift, foot, awake, swell, keyTurn } = bath.whaleAt(t);
  const { half, h, feet } = WHALE;
  const cy = -feet - h / 2;
  const turnK = Math.cos(rad(keyTurn));
  const keyY = KEY.y - FLOOR;
  // Its tail wags while it walks and when it wakes.
  const wag = awake ? 10 * Math.sin(Math.min(t, bath.duration) * 9) * (foot !== 0 || t < bath.tWalk ? 1 : 0.2) : 0;
  return (
    <g transform={`translate(${x} ${FLOOR - lift}) rotate(${tilt})`}>
      {/* Feet: the back one lifts on one step, the front one on the next */}
      {[-48, 40].map((fx, i) => {
        const up = (i === 0 ? Math.max(0, -foot) : Math.max(0, foot)) * 12;
        return <rect key={fx} x={fx - 14} y={-feet - 4 - up} width="34" height={feet + 4} rx="10" fill="#ff8c42" stroke={INK} strokeWidth="3" />;
      })}
      {/* The key */}
      <line x1={-half + 50} y1={keyY} x2={KEY.dx} y2={keyY} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1={-half + 50} y1={keyY} x2={KEY.dx} y2={keyY} stroke="#ffc94a" strokeWidth="4" strokeLinecap="round" />
      {[-1, 1].map((side) => (
        <ellipse key={side} cx={KEY.dx - 2} cy={keyY + side * 16 * turnK} rx="9" ry={Math.abs(15 * turnK) + 2} fill="#ffc94a" stroke={INK} strokeWidth="3" />
      ))}
      <g transform={`translate(0 ${cy}) scale(${1 + swell}) translate(0 ${-cy})`}>
        {/* The tail with its fluke, up behind */}
        <g transform={`rotate(${wag} ${-half + 20} ${cy})`}>
          <path
            d={`M${-half + 20} ${cy + 10} Q${-half - 20} ${cy - 10} ${-half - 18} ${cy - 50} q-30 -6 -36 -26 q24 -4 40 14 q8 -24 34 -26 q-2 22 -28 34 Q${-half + 4} ${cy - 24} ${-half + 34} ${cy - 16} z`}
            fill={WHALE_BLUE}
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id={belly}>
            <ellipse cx="0" cy={cy} rx={half} ry={h / 2} />
          </clipPath>
        </defs>
        <ellipse cx="0" cy={cy} rx={half} ry={h / 2} fill={WHALE_BLUE} />
        <g clipPath={`url(#${belly})`}>
          <ellipse cx="25" cy={cy + h / 2} rx="90" ry="30" fill="#dff4ff" />
          {[-30, 0, 30, 60].map((bx) => (
            <line key={bx} x1={bx} y1={cy + h / 2 - 26} x2={bx + 10} y2={cy + h / 2} stroke="#a9d8f5" strokeWidth="3" />
          ))}
        </g>
        <ellipse cx="0" cy={cy} rx={half} ry={h / 2} fill="none" stroke={INK} strokeWidth="4" />
        {/* The flipper */}
        <path d={`M-10 ${cy + 14} q-14 26 10 34 q10 -16 8 -30 z`} fill="#3a8fc4" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        {/* The face: eyes shut until it is wound up, then wide open; pink cheeks and a smile */}
        {awake ? (
          <g>
            <circle cx="62" cy={cy - 12} r="11" fill="#fff" stroke={INK} strokeWidth="3" />
            <circle cx="65" cy={cy - 12} r="5" fill={INK} />
          </g>
        ) : (
          <path d={`M51 ${cy - 12} q11 8 22 0`} fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        )}
        <circle cx="84" cy={cy + 8} r="9" fill={CAP_PINK} opacity="0.7" />
        <path d={`M72 ${cy + 18} q18 12 36 -4`} fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        {/* The blowhole */}
        <ellipse cx={BLOWHOLE.dx} cy={BLOWHOLE.dy + 5} rx="9" ry="4" fill={INK} />
      </g>
    </g>
  );
}

/** The whale's water: a little spurt, then a big jet up to the dryer's switch, splashing there and dripping down. */
function Fountain({ bath, t }: { bath: Bath; t: number }) {
  const f = bath.fountainAt(t);
  if (!f) return null;
  const x = WHALE.stop + BLOWHOLE.dx;
  const base = FLOOR + BLOWHOLE.dy + 4;
  const w = 8 + 10 * f.k;
  const top = f.top;
  const atSwitch = top <= HANDLE.y + 2;
  return (
    <g opacity={Math.min(1, 0.4 + f.k)}>
      <path
        d={`M${x - w / 2} ${base} Q${x - w / 4} ${(base + top) / 2} ${x - w} ${top} H${x + w} Q${x + w / 4} ${(base + top) / 2} ${x + w / 2} ${base} Z`}
        fill={WATER}
        stroke="#4fb6e8"
        strokeWidth="3"
      />
      <line x1={x - 2} y1={base - 6} x2={x - 2} y2={top + 10} stroke="#fff" strokeWidth="3" strokeDasharray="14 16" />
      {/* The crown of drops at the top, flying out wider at the switch */}
      {[-1, -0.5, 0.5, 1].map((s, i) => (
        <circle
          key={s}
          cx={x + s * (atSwitch ? 42 : 18 + 10 * f.k)}
          cy={top + 8 + Math.abs(s) * (atSwitch ? 18 : 8) + (i % 2) * 4}
          r={4 + 4 * f.k}
          fill={WATER}
          stroke="#4fb6e8"
          strokeWidth="2"
        />
      ))}
    </g>
  );
}

/* ---------- Hair dryer, shelf, cap and wand ---------- */

/** The chrome ring on the wall the dryer rests in, and the socket its cord goes into. */
const DryerRing = memo(function DryerRing() {
  return (
    <g>
      <rect x={DRYER.x - 40} y={DRYER.y - 84} width="80" height="18" rx="6" fill={CHROME} stroke={INK} strokeWidth="3" />
      <rect x={DRYER.x - 12} y={DRYER.y - 68} width="24" height="34" fill={CHROME} stroke={INK} strokeWidth="3" />
      <rect x={DRYER.x - 150} y={DRYER.y + 150} width="40" height="54" rx="8" fill="#fff" stroke={INK} strokeWidth="3" />
      <circle cx={DRYER.x - 136} cy={DRYER.y + 177} r="4" fill={INK} />
      <circle cx={DRYER.x - 124} cy={DRYER.y + 177} r="4" fill={INK} />
    </g>
  );
});

/** The hair dryer: it jolts in its ring when the jet hits its switch, the switch slides on, and air streams out of it. */
function Dryer({ bath, t }: { bath: Bath; t: number }) {
  const { x, y } = DRYER;
  const on = bath.blowing(t);
  const still = Math.min(t, bath.duration);
  const knob = t >= bath.tHitDryer && t < bath.tDryerOff + 0.15 ? -16 : 0;
  return (
    <g>
      {on > 0 && (
        <g opacity={on} fill="none" stroke="#8fb8d8" strokeWidth="6" strokeLinecap="round" strokeDasharray="44 34" strokeDashoffset={-still * 520}>
          {[-30, -10, 10, 30].map((dy, i) => (
            <path key={dy} d={`M${NOZZLE.x + 10} ${y + dy * 0.6} q90 ${dy * 0.4 + (i % 2 ? 10 : -10)} 180 ${dy * 0.9} t180 ${dy * 1.4}`} />
          ))}
        </g>
      )}
      <g transform={`rotate(${bath.dryerAngle(t)} ${x} ${y})`}>
        {/* The cord, curling down to the socket */}
        <path d={`M${HANDLE.x} ${HANDLE.y} q-8 40 -40 34 q-24 -6 -20 24 q4 30 -40 44`} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        {/* The handle, with its switch */}
        <path
          d={`M${x - 56} ${y + 20} L${x - 16} ${y + 20} L${HANDLE.x + 16} ${HANDLE.y} L${HANDLE.x - 16} ${HANDLE.y} Z`}
          fill={DRYER_PURPLE}
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <rect x={HANDLE.x - 6} y={y + 52} width="12" height="40" rx="5" fill="#7c5bd6" stroke={INK} strokeWidth="2" />
        <rect x={HANDLE.x - 9} y={y + 74 + knob} width="18" height="14" rx="4" fill={knob ? "#3ec300" : "#ff5d73"} stroke={INK} strokeWidth="2" />
        {/* The barrel with its nozzle and the grille at the back */}
        <path
          d={`M${x + 70} ${y - 26} L${NOZZLE.x} ${y - 18} V${y + 18} L${x + 70} ${y + 26} Z`}
          fill="#7c5bd6"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <rect x={x - 76} y={y - 36} width="150" height="72" rx="34" fill={DRYER_PURPLE} stroke={INK} strokeWidth="4" />
        <ellipse cx={x - 64} cy={y} rx="14" ry="30" fill="#e9e1ff" stroke={INK} strokeWidth="3" />
        {[-14, 0, 14].map((dy) => (
          <line key={dy} x1={x - 72} y1={y + dy} x2={x - 56} y2={y + dy} stroke={INK} strokeWidth="2" />
        ))}
        <ellipse cx={x} cy={y - 18} rx="34" ry="7" fill="#fff" opacity="0.5" />
        {/* It glows a little while it blows */}
        <circle cx={x + 30} cy={y} r="8" fill={on > 0 ? "#ffd23f" : "#e9e1ff"} stroke={INK} strokeWidth="2" />
      </g>
    </g>
  );
}

/** The little glass shelf with the jar of bubble soap on it. */
const BathShelf = memo(function BathShelf() {
  const { x0, x1, y } = BATH_SHELF;
  return (
    <g>
      {[x0 + 30, x1 - 50].map((bx) => (
        <path key={bx} d={`M${bx} ${y + 6} v30 l20 -30 z`} fill={CHROME} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      ))}
      <rect x={x0} y={y} width={x1 - x0} height="12" rx="4" fill="#c9f1ff" opacity="0.85" stroke={INK} strokeWidth="3" />
      <rect x={WAND.x - 24} y={y - 40} width="48" height="40" rx="10" fill="#ffd6f5" stroke={INK} strokeWidth="3" />
      <rect x={WAND.x - 28} y={y - 46} width="56" height="10" rx="4" fill="#3a86ff" stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** The bubble wand in its jar: a ring that trembles in the dryer's air, its soap film bulging out toward the lamp. */
function Wand({ bath, t }: { bath: Bath; t: number }) {
  const on = bath.blowing(t);
  const still = Math.min(t, bath.duration);
  const shake = on * 4 * Math.sin(still * 30);
  return (
    <g transform={`rotate(${shake} ${WAND.x} ${BATH_SHELF.y - 40})`}>
      <line x1={WAND.x} y1={BATH_SHELF.y - 40} x2={WAND.x} y2={WAND.y + WAND.r} stroke={INK} strokeWidth="6" strokeLinecap="round" />
      {on > 0 && <ellipse cx={WAND.x + 10 * on} cy={WAND.y} rx={6 + 14 * on} ry={WAND.r - 3} fill="#e6f8ff" opacity="0.6" stroke="#9fe6ff" strokeWidth="2" />}
      <circle cx={WAND.x} cy={WAND.y} r={WAND.r} fill="none" stroke={INK} strokeWidth="9" />
      <circle cx={WAND.x} cy={WAND.y} r={WAND.r} fill="none" stroke="#ff7bd0" strokeWidth="4" />
    </g>
  );
}

/** The pink shower cap with white dots and a frilly edge; its bottom middle is at 0 0. */
function ShowerCap() {
  return (
    <g>
      <path d="M-46 0 q0 -50 46 -50 q46 0 46 50 z" fill={CAP_PINK} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {[
        [-22, -28],
        [4, -40],
        [24, -20],
        [-4, -14],
      ].map(([cx, cy]) => (
        <circle key={`${cx}`} cx={cx} cy={cy} r="5" fill="#fff" />
      ))}
      <path
        d="M-50 0 q6 10 12.5 0 q6 10 12.5 0 q6 10 12.5 0 q6 10 12.5 0 q6 10 12.5 0 q6 10 12.5 0 q6 10 12.5 0 q6 10 12.5 0"
        fill="#fff"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** The shower cap on the shelf, then fluttering through the air; once it sits on the lamp the lamp draws it. */
function FlyingCap({ bath, t }: { bath: Bath; t: number }) {
  const cap = bath.capAt(t);
  if (!cap) return null;
  return (
    <g transform={`translate(${cap.pt.x} ${cap.pt.y}) rotate(${cap.angle} 0 -24)`}>
      <ShowerCap />
    </g>
  );
}

/* ---------- Lamp and bubbles ---------- */

/** The ceiling lamp: a glass globe on a cord that glows a little more with every bubble and swings at the last one; once the shower cap has landed it wears it like a hat. */
function Lamp({ bath, t, glow }: { bath: Bath; t: number; glow: string }) {
  const lit = bath.popped(t) / BUBBLES;
  return (
    <g transform={`rotate(${bath.lampSwing(t)} ${LAMP.x} 14)`}>
      <defs>
        <radialGradient id={glow}>
          <stop offset="0" stopColor="#fff6b8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff6b8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <line x1={LAMP.x} y1="14" x2={LAMP.x} y2={LAMP.y - LAMP.r} stroke={INK} strokeWidth="4" />
      <rect x={LAMP.x - 18} y={LAMP.y - LAMP.r - 16} width="36" height="20" rx="5" fill={CHROME} stroke={INK} strokeWidth="3" />
      {lit > 0 && <circle cx={LAMP.x} cy={LAMP.y} r={LAMP.r + 40 + 120 * lit} fill={`url(#${glow})`} opacity={lit} />}
      <circle cx={LAMP.x} cy={LAMP.y} r={LAMP.r} fill={lit > 0 ? "#fff3b0" : "#e9f3fb"} stroke={INK} strokeWidth="4" />
      <circle cx={LAMP.x} cy={LAMP.y} r={LAMP.r} fill="#ffd23f" opacity={0.6 * lit} />
      <ellipse cx={LAMP.x - 20} cy={LAMP.y - 22} rx="14" ry="8" fill="#fff" opacity="0.8" />
      {t >= bath.tCapLand && (
        <g transform={`translate(${bath.capOn.x} ${bath.capOn.y})`}>
          <ShowerCap />
        </g>
      )}
    </g>
  );
}

/** Soap bubbles: see-through with a rainbow sheen and a shine; each pops in a little ring at the lamp. */
function Bubbles({ bath, t, sheen }: { bath: Bath; t: number; sheen: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9ed8" />
          <stop offset="0.5" stopColor="#9fe6ff" />
          <stop offset="1" stopColor="#c9ffb0" />
        </linearGradient>
      </defs>
      {Array.from({ length: BUBBLES }, (_, i) => {
        const b = bath.bubbleAt(i, t);
        const age = t - bath.tPop[i];
        if (!b) {
          // Just popped: a ring of drops flies apart.
          if (age < 0 || age > 0.5) return null;
          const k = easeOut(seg(age, 0, 0.5));
          return (
            <g key={i} opacity={1 - k}>
              {Array.from({ length: 8 }, (_, j) => {
                const a = (j * Math.PI) / 4;
                return <circle key={j} cx={LAMP.x + (30 + 50 * k) * Math.cos(a)} cy={LAMP.y + LAMP.r + (30 + 50 * k) * Math.sin(a)} r="5" fill="#9fe6ff" />;
              })}
            </g>
          );
        }
        const r = 46 * b.size;
        return (
          <g key={i}>
            <circle cx={b.pt.x} cy={b.pt.y} r={r} fill="#e6f8ff" opacity="0.35" />
            <circle cx={b.pt.x} cy={b.pt.y} r={r} fill="none" stroke={`url(#${sheen})`} strokeWidth="5" />
            <ellipse
              cx={b.pt.x - r * 0.38}
              cy={b.pt.y - r * 0.4}
              rx={r * 0.22}
              ry={r * 0.13}
              transform={`rotate(-35 ${b.pt.x - r * 0.38} ${b.pt.y - r * 0.4})`}
              fill="#fff"
            />
          </g>
        );
      })}
    </g>
  );
}

/** Before the tap: a soft glow round the red button and a still finger pointing at it. */
function Hint() {
  return (
    <g className="marble-hint">
      <circle cx={BUTTON.x} cy={BUTTON.y} r="62" fill="#ffd23f" opacity="0.35" />
      <circle cx={BUTTON.x} cy={BUTTON.y} r="62" fill="none" stroke="#ffb703" strokeWidth="6" />
      <text x={BUTTON.x - 120} y={BUTTON.y + 32} fontSize="90" textAnchor="middle">
        👉
      </text>
    </g>
  );
}
