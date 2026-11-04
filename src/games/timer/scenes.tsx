import { memo, type CSSProperties, type ReactNode } from "react";
import { Mascot } from "@/components/Mascot";

// Everything is drawn on a stage of STAGE_W × STAGE_H that covers the screen (`.tm-stage`): what matters stays within
// x 200–1400 (cut off at 4:3) and y 80–820 (cut off on a phone on its side). What moves is an HTML layer of its own
// (`Layer`), moved by a CSS animation as long as the timer, so the big still drawing behind it is never painted again.

/** The stage's size in its own units. */
export const STAGE_W = 1600;
export const STAGE_H = 900;

const INK = "#3b2a20";

/** A piece of the picture as an HTML layer of its own, placed in stage units and drawn in its own units (0 0 w h). */
export function Layer({
  x,
  y,
  w,
  h,
  className,
  style,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={`tm-layer${className ? ` ${className}` : ""}`}
      style={{ left: `${(x / STAGE_W) * 100}%`, top: `${(y / STAGE_H) * 100}%`, width: `${(w / STAGE_W) * 100}%`, height: `${(h / STAGE_H) * 100}%`, ...style }}
      aria-hidden
    >
      {children}
    </div>
  );
}

/** An SVG filling its layer, in the layer's own units. */
function Draw({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {children}
    </svg>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// The fox and the bear family: a grown-up and a child, standing still while they wait and waving at the end.

/** A grown-up with its child beside it, standing on `floor`; the whole family cheers with `.tm-done` on the stage. */
export function Family({ kind, x, floor, childLeft = false }: { kind: "fox" | "bear"; x: number; floor: number; childLeft?: boolean }) {
  const grown = { w: 190, h: 285 };
  const small = { w: 120, h: 180 };
  const childX = childLeft ? x - small.w + 10 : x + grown.w - 10;
  return (
    <>
      <Layer x={x} y={floor - grown.h} w={grown.w} h={grown.h} className="tm-mascot">
        <Mascot kind={kind} />
      </Layer>
      <Layer x={childX} y={floor - small.h} w={small.w} h={small.h} className="tm-mascot tm-mascot-child">
        <Mascot kind={kind} child />
      </Layer>
    </>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Zug zum Bahnhof: a little train rolls along the track to the station, where the bear family waits.

/** The track's top; the train's wheels stand on it. */
export const RAIL_Y = 650;
/**
 * Where the train starts (its left end) and where its front stops, at the buffers before the station; `family` is where
 * the bear grown-up stands on the platform, its child left of it – all within x 1400, where a tablet cuts the picture.
 */
export const TRAIN = { x: 200, w: 360, h: 200, stop: 1060, family: 1205 } as const;

/** The little house where the train sets off (H-64): behind its start, its roof and window above the train. */
export const HOME = { x: 225, w: 210, top: 430 } as const;

/** The countryside with the track and the station; drawn once. */
export const TrainBackdrop = memo(function TrainBackdrop() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <defs>
          <linearGradient id="tm-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8fd3ff" />
            <stop offset="1" stopColor="#e7f7ff" />
          </linearGradient>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="url(#tm-sky)" />
        <circle cx="330" cy="190" r="70" fill="#ffe066" />
        {[
          [560, 170],
          [980, 130],
          [1280, 210],
        ].map(([cx, cy]) => (
          <g key={cx} fill="#fff">
            <ellipse cx={cx} cy={cy} rx="70" ry="30" />
            <ellipse cx={cx + 46} cy={cy - 18} rx="46" ry="30" />
            <ellipse cx={cx - 40} cy={cy - 8} rx="36" ry="24" />
          </g>
        ))}
        <path d="M0 520 Q240 400 520 500 T1040 480 T1600 470 V900 H0 Z" fill="#9bd57a" />
        <path d="M0 600 Q400 540 820 590 T1600 580 V900 H0 Z" fill="#7cc35a" />
        {/* The little house the train sets off from (H-64): it stays behind as the train rolls away. */}
        <rect x={HOME.x} y={HOME.top} width={HOME.w} height={RAIL_Y - HOME.top} fill="#ffe3b3" stroke={INK} strokeWidth="5" />
        <path
          d={`M${HOME.x - 22} ${HOME.top + 10} L${HOME.x + HOME.w / 2} ${HOME.top - 85} L${HOME.x + HOME.w + 22} ${HOME.top + 10} Z`}
          fill="#4c8fd6"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <rect x={HOME.x + 30} y={HOME.top + 22} width="50" height="44" rx="6" fill="#fff3bf" stroke={INK} strokeWidth="4" />
        <rect x={HOME.x + 130} y={HOME.top + 22} width="50" height="44" rx="6" fill="#fff3bf" stroke={INK} strokeWidth="4" />
        <rect x={HOME.x + 80} y={HOME.top + 90} width="50" height={RAIL_Y - HOME.top - 90} rx="6" fill="#8a5a2b" stroke={INK} strokeWidth="4" />
        {/* Trees along the way, so the child sees how far the train has come. */}
        {[640, 890].map((x) => (
          <g key={x}>
            <rect x={x - 10} y="520" width="20" height="90" fill="#8a5a2b" stroke={INK} strokeWidth="4" />
            <circle cx={x} cy="500" r="56" fill="#40a35a" stroke={INK} strokeWidth="4" />
          </g>
        ))}
        {/* The station: a house with a red roof behind the platform at the track's end. */}
        <rect x="1060" y="420" width="290" height="200" fill="#fff3d6" stroke={INK} strokeWidth="5" />
        <path d="M1040 430 L1205 330 L1370 430 Z" fill="#e8590c" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <rect x="1240" y="500" width="60" height="120" rx="6" fill="#8a5a2b" stroke={INK} strokeWidth="4" />
        <rect x="1085" y="460" width="70" height="60" rx="6" fill="#a5d8ff" stroke={INK} strokeWidth="4" />
        <rect x="1315" y="460" width="24" height="60" rx="6" fill="#a5d8ff" stroke={INK} strokeWidth="4" />
        <rect x="1060" y="610" width="540" height="34" fill="#ced4da" stroke={INK} strokeWidth="4" />
        {/* The track: sleepers, the rail and the buffers at its end. */}
        <rect x="0" y={RAIL_Y + 4} width="1100" height="24" fill="#a68a6d" />
        {Array.from({ length: 23 }, (_, i) => (
          <rect key={i} x={10 + i * 48} y={RAIL_Y + 2} width="26" height="18" rx="3" fill="#6b4a2b" />
        ))}
        {/* The rail is dark where the train has been; ahead of it a shining rail lies over it (`RailAhead`). */}
        <rect x="0" y={RAIL_Y - 6} width="1100" height="10" rx="4" fill="#3d434a" />
        <rect x="1072" y={RAIL_Y - 70} width="22" height="70" fill="#e03131" stroke={INK} strokeWidth="4" />
        <rect x="1060" y={RAIL_Y - 64} width="16" height="22" rx="5" fill="#ffd43b" stroke={INK} strokeWidth="3" />
      </Draw>
    </Layer>
  );
});

/** The wheels under the train: their middle in the train's units and their radius. */
const WHEELS = [
  { cx: 30, r: 18 },
  { cx: 80, r: 18 },
  { cx: 140, r: 18 },
  { cx: 190, r: 18 },
  { cx: 250, r: 22 },
  { cx: 320, r: 22 },
] as const;

/** A box in the train's own units as a place in percent of it, for the layers riding along inside it. */
function inTrain(x: number, y: number, w: number, h: number): CSSProperties {
  return { left: `${(x / TRAIN.w) * 100}%`, top: `${(y / TRAIN.h) * 100}%`, width: `${(w / TRAIN.w) * 100}%`, height: `${(h / TRAIN.h) * 100}%` };
}

/**
 * The train: a locomotive facing right with two wagons, TRAIN.w × TRAIN.h, its wheels on the rail; `puff` keys a steam
 * cloud. Every second its wheels turn once and a small puff of steam rises from the chimney (H-63) – the wheels and the
 * puff are small layers of their own riding in the train's, so the train's drawing is never painted again.
 */
export function Train({ puff }: { puff: number }) {
  const { w, h } = TRAIN;
  return (
    <>
      <Draw w={w} h={h}>
        {/* Two wagons, each with a window for a fox or bear passenger. */}
        {[0, 110].map((x, i) => (
          <g key={x}>
            <rect x={x + 6} y={70} width="96" height="96" rx="12" fill={i ? "#4dabf7" : "#69db7c"} stroke={INK} strokeWidth="5" />
            <rect x={x + 22} y={86} width="64" height="40" rx="8" fill="#e7f5ff" stroke={INK} strokeWidth="4" />
            <rect x={x + 102} y={140} width="10" height="10" fill={INK} />
          </g>
        ))}
        {/* The locomotive. */}
        <rect x="220" y="56" width="70" height="110" rx="10" fill="#e03131" stroke={INK} strokeWidth="5" />
        <rect x="234" y="72" width="42" height="36" rx="6" fill="#fff3bf" stroke={INK} strokeWidth="4" />
        <path d="M214 56 H296 V44 H214 Z" fill={INK} />
        <rect x="286" y="96" width="70" height="70" rx="14" fill="#e03131" stroke={INK} strokeWidth="5" />
        <rect x="312" y="52" width="24" height="46" rx="4" fill="#343a40" stroke={INK} strokeWidth="4" />
        <circle cx="350" cy="120" r="8" fill="#ffd43b" stroke={INK} strokeWidth="3" />
        {puff > 0 && (
          <g key={puff} className="tm-steam">
            <circle cx="324" cy="30" r="22" fill="#fff" />
            <circle cx="300" cy="14" r="18" fill="#fff" />
            <circle cx="344" cy="10" r="16" fill="#fff" />
          </g>
        )}
      </Draw>
      <div className="tm-chug tm-beat" style={inTrain(306, 18, 36, 36)} />
      {WHEELS.map(({ cx, r }) => (
        <div key={cx} className="tm-wheel tm-beat" style={inTrain(cx - r, h - 2 * r, 2 * r, 2 * r)}>
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="#495057" stroke={INK} strokeWidth="10" />
            <path d="M50 12 V88 M12 50 H88 M23 23 L77 77 M77 23 L23 77" stroke="#adb5bd" strokeWidth="7" strokeLinecap="round" />
            <circle cx="50" cy="50" r="15" fill="#ffd43b" />
          </svg>
        </div>
      ))}
    </>
  );
}

/**
 * The rail ahead of the train, shining (H-64): it lies over the dark rail from the train's front to the buffers and
 * gets shorter as the train rolls on, so what lies behind is dark and what is still to come shines.
 */
export function RailAhead() {
  const from = TRAIN.x + TRAIN.w;
  return (
    <Layer x={from} y={RAIL_Y - 6} w={TRAIN.stop - from} h={10}>
      <div className="tm-rail-shine tm-move" />
    </Layer>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Sanduhr: a big hourglass whose sand runs from the top into the bottom; the fox family stands beside it.

/** The hourglass's glass: its middle, the top and bottom bulbs (between the wooden plates) and the neck. */
export const GLASS = { cx: 800, w: 230, top: 190, neck: 452, bottom: 715 } as const;

/** The room's floor, where the hourglass and the fox family stand. */
export const SAND_FLOOR = GLASS.bottom + 48;

/** The top bulb's outline as fractions of its box (x, y), from top left round to top right; the bottom one is it upside down. */
export const BULB: [number, number][] = [
  [0, 0],
  [0.01, 0.25],
  [0.06, 0.45],
  [0.18, 0.65],
  [0.35, 0.82],
  [0.46, 0.95],
  [0.48, 1],
  [0.52, 1],
  [0.54, 0.95],
  [0.65, 0.82],
  [0.82, 0.65],
  [0.94, 0.45],
  [0.99, 0.25],
  [1, 0],
];

/** The bulb as a CSS polygon, the right way up (top) or upside down (bottom). */
export function bulbPolygon(upsideDown: boolean) {
  return `polygon(${BULB.map(([x, y]) => `${x * 100}% ${(upsideDown ? 1 - y : y) * 100}%`).join(", ")})`;
}

/** The same outline in stage units, for the drawn glass. */
function bulbPath(top: number, bottom: number, upsideDown: boolean) {
  const left = GLASS.cx - GLASS.w / 2;
  return BULB.map(([x, y], i) => `${i ? "L" : "M"}${left + x * GLASS.w} ${upsideDown ? bottom - y * (bottom - top) : top + y * (bottom - top)}`).join(" ");
}

/** A room with a rug; the glass's pale inside is drawn here, behind the sand. Drawn once. */
export const SandBackdrop = memo(function SandBackdrop() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <rect width={STAGE_W} height={STAGE_H} fill="#fde8c8" />
        <rect y={SAND_FLOOR - 16} width={STAGE_W} height={STAGE_H} fill="#c98b52" />
        <path d={`M0 ${SAND_FLOOR - 16} H1600`} stroke="#9c6334" strokeWidth="6" />
        <ellipse cx="900" cy={SAND_FLOOR + 6} rx="520" ry="40" fill="#ff8787" opacity="0.7" />
        {/* A picture on the wall: a sun over a hill. */}
        <rect x="260" y="200" width="220" height="170" rx="10" fill="#e7f5ff" stroke="#9c6334" strokeWidth="12" />
        <path d="M266 330 Q370 270 474 330 V364 H266 Z" fill="#8ce99a" />
        <circle cx="420" cy="250" r="26" fill="#ffd43b" />
        <path d={`${bulbPath(GLASS.top, GLASS.neck, false)} Z`} fill="#f1f8ff" />
        <path d={`${bulbPath(GLASS.neck, GLASS.bottom, true)} Z`} fill="#f1f8ff" />
      </Draw>
    </Layer>
  );
});

/** The glass's outline and shine and the wooden frame, in front of the sand. Drawn once. */
export const SandFrame = memo(function SandFrame() {
  const left = GLASS.cx - GLASS.w / 2 - 50;
  const right = GLASS.cx + GLASS.w / 2 + 50;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H}>
      <Draw w={STAGE_W} h={STAGE_H}>
        <g fill="none" stroke={INK} strokeWidth="6" strokeLinejoin="round">
          <path d={bulbPath(GLASS.top, GLASS.neck, false)} />
          <path d={bulbPath(GLASS.neck, GLASS.bottom, true)} />
        </g>
        <path
          d={`M${GLASS.cx - 90} ${GLASS.top + 30} Q${GLASS.cx - 96} ${GLASS.top + 120} ${GLASS.cx - 60} ${GLASS.top + 200}`}
          stroke="#fff"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d={`M${GLASS.cx - 60} ${GLASS.bottom - 200} Q${GLASS.cx - 96} ${GLASS.bottom - 120} ${GLASS.cx - 90} ${GLASS.bottom - 30}`}
          stroke="#fff"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
        {[left + 10, right - 30].map((x) => (
          <rect key={x} x={x} y={GLASS.top - 10} width="20" height={GLASS.bottom - GLASS.top + 20} rx="8" fill="#b5651d" stroke={INK} strokeWidth="5" />
        ))}
        <rect x={left - 10} y={GLASS.top - 44} width={right - left + 20} height="40" rx="14" fill="#c97d3a" stroke={INK} strokeWidth="6" />
        <rect x={left - 10} y={GLASS.bottom + 4} width={right - left + 20} height="40" rx="14" fill="#c97d3a" stroke={INK} strokeWidth="6" />
      </Draw>
    </Layer>
  );
});

/**
 * The sand: the top heap sinking, the thin stream through the neck and the bottom heap growing, each its own layer.
 * Every second one big grain falls through the neck into the heap (H-63), and the glass the sand has left keeps a
 * faint film of it (H-64), so what is over shows above and what is still to come below.
 */
export function Sand({ running }: { running: boolean }) {
  const left = GLASS.cx - GLASS.w / 2;
  return (
    <>
      <Layer x={left} y={GLASS.top} w={GLASS.w} h={GLASS.neck - GLASS.top} className="tm-bulb" style={{ clipPath: bulbPolygon(false) }}>
        <div className="tm-sand-dust" />
        <div className="tm-sand tm-sand-top tm-move" />
      </Layer>
      {running && (
        <Layer x={GLASS.cx - 5} y={GLASS.neck - 4} w={10} h={GLASS.bottom - GLASS.neck} className="tm-stream">
          <div className="tm-stream-grains tm-move" />
        </Layer>
      )}
      {running && (
        <Layer x={GLASS.cx - 11} y={GLASS.neck - 8} w={22} h={22}>
          <div className="tm-grain tm-beat" />
        </Layer>
      )}
      <Layer x={left} y={GLASS.neck} w={GLASS.w} h={GLASS.bottom - GLASS.neck} className="tm-bulb" style={{ clipPath: bulbPolygon(true) }}>
        <div className="tm-sand tm-sand-bottom tm-move" />
      </Layer>
    </>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Kerze: a candle on the table burns down; at the end the bear child blows it out.

/** The candle when lit: its middle, width, top and the table it stands on; at the end only `stub` of it is left. */
export const CANDLE = { cx: 820, w: 120, top: 250, base: 760, stub: 90 } as const;

/** A cosy evening room with a window and the table; drawn once. */
export const CandleBackdrop = memo(function CandleBackdrop() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <defs>
          <radialGradient id="tm-room" cx="0.51" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#5c4b8a" />
            <stop offset="1" stopColor="#2b2d5c" />
          </radialGradient>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="url(#tm-room)" />
        <rect x="1100" y="150" width="240" height="260" rx="12" fill="#1c2a5a" stroke="#c9a46b" strokeWidth="14" />
        <path d="M1220 150 V410 M1100 280 H1340" stroke="#c9a46b" strokeWidth="10" />
        <circle cx="1170" cy="220" r="34" fill="#fff3bf" />
        <circle cx="1186" cy="210" r="30" fill="#1c2a5a" />
        {[
          [1280, 200],
          [1300, 340],
          [1150, 350],
        ].map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r="5" fill="#fff3bf" />
        ))}
        <rect x="0" y={CANDLE.base + 10} width={STAGE_W} height={STAGE_H} fill="#8a5a2b" />
        <rect x="0" y={CANDLE.base + 10} width={STAGE_W} height="16" fill="#a8743f" />
        <ellipse cx={CANDLE.cx} cy={CANDLE.base + 8} rx="110" ry="20" fill="#e6b44c" stroke={INK} strokeWidth="5" />
      </Draw>
    </Layer>
  );
});

/**
 * The wax that has run down, a puddle on the holder that grows as the candle burns (H-64): what has burnt lies
 * below, what is still to burn stands above. Behind the candle, so it shows on both sides of it.
 */
export function WaxPuddle() {
  return (
    <Layer x={CANDLE.cx - 100} y={CANDLE.base - 14} w={200} h={28}>
      <div className="tm-puddle tm-move" />
    </Layer>
  );
}

/** The candle's wax, shrinking from the bottom up as it burns (its CSS scales it). */
export function CandleWax() {
  return (
    <Layer x={CANDLE.cx - CANDLE.w / 2} y={CANDLE.top} w={CANDLE.w} h={CANDLE.base - CANDLE.top} className="tm-wax-box">
      <div className="tm-wax tm-move" />
    </Layer>
  );
}

/**
 * The candle's top with its wick and flame, going down with the wax: a layer as tall as the candle, moved down by the
 * part that burns away. `out` puts the flame out with a curl of smoke; `flare` keys the flame flaring up at a tap.
 */
export function CandleFlame({ out, flare }: { out: boolean; flare: number }) {
  const w = CANDLE.w;
  const h = CANDLE.base - CANDLE.top;
  return (
    <Layer x={CANDLE.cx - w / 2} y={CANDLE.top} w={w} h={h} className="tm-flame-box tm-move">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <ellipse cx={w / 2} cy="0" rx={w / 2 - 2} ry="14" fill="#ffe3e3" stroke={INK} strokeWidth="4" />
        <path d={`M${w / 2} 0 V-22`} stroke={INK} strokeWidth="5" strokeLinecap="round" />
      </svg>
      {/* A drop of wax running down the candle's side, a little further every second (H-63). */}
      <div className="tm-drop tm-beat" />
      {out ? (
        <div className="tm-smoke" />
      ) : (
        <div className="tm-flame">
          <div key={flare} className={flare ? "tm-flare" : undefined}>
            <svg viewBox="0 0 80 130">
              <path d="M40 4 C60 40 76 70 70 96 C64 120 16 120 10 96 C4 70 22 40 40 4 Z" fill="#ffa94d" />
              <path d="M40 40 C52 62 58 82 54 100 C50 116 30 116 26 100 C22 82 30 62 40 40 Z" fill="#ffe066" />
            </svg>
          </div>
        </div>
      )}
    </Layer>
  );
}
