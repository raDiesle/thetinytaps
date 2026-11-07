import { memo, useId, type CSSProperties, type ReactNode } from "react";

// Everything is drawn on a stage of STAGE_W × STAGE_H that covers the screen (`.tm-stage`): what matters stays within
// x 200–1400 (cut off at 4:3) and y 80–820 (cut off on a phone on its side). What moves is an HTML layer of its own
// (`Layer`), moved by a CSS animation as long as the timer, so the big still drawing behind it is never painted again.

/** The stage's size in its own units. */
export const STAGE_W = 1600;
export const STAGE_H = 900;

export const INK = "#3b2a20";

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

/**
 * What is still left lights up softly for a moment when the child taps (H-51, „Wie lange noch?“): put inside the part
 * that shrinks (the rail ahead, the top sand, the wax, the slices), so the light is exactly as big as what is left.
 * `n` keys it, a new tap lights it again; 0 shows nothing.
 */
export function LeftGlow({ n }: { n: number }) {
  return n > 0 ? <div key={n} className="tm-left-glow" /> : null;
}

/** An SVG filling its layer, in the layer's own units. */
export function Draw({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {children}
    </svg>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Zug zum Bahnhof: a little train rolls along the track to the station.

/** The track's top; the train's wheels stand on it. */
export const RAIL_Y = 650;
/**
 * Where the train starts (its left end), its size on the stage and where its front stops, at the buffers before the
 * station: a small train on a long track, so it is plain how far it has come and how far it still goes (user feedback,
 * November 2026: the way was too short to see it move).
 */
export const TRAIN = { x: 200, w: 270, h: 150, stop: 1290 } as const;

/** The train is drawn in these units and shrunk to `TRAIN.w` × `TRAIN.h`. */
const TRAIN_ART = { w: 360, h: 200 } as const;

/** The track's right end, just behind the buffers. */
const TRACK_END = TRAIN.stop + 40;

/** The little house where the train sets off (H-64): behind its start, its roof and window above the train. */
export const HOME = { x: 210, w: 200, top: 430 } as const;

/** The station at the track's end, behind where the train halts: its left edge, width and the wall's top. */
const STATION = { x: 1080, w: 250, top: 430 } as const;

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
        {[600, 800].map((x) => (
          <g key={x}>
            <rect x={x - 10} y="520" width="20" height="90" fill="#8a5a2b" stroke={INK} strokeWidth="4" />
            <circle cx={x} cy="500" r="52" fill="#40a35a" stroke={INK} strokeWidth="4" />
          </g>
        ))}
        {/* The station: a house with a red roof behind the platform at the track's end. */}
        <rect x={STATION.x} y={STATION.top} width={STATION.w} height={RAIL_Y - 30 - STATION.top} fill="#fff3d6" stroke={INK} strokeWidth="5" />
        <path
          d={`M${STATION.x - 20} ${STATION.top + 10} L${STATION.x + STATION.w / 2} ${STATION.top - 90} L${STATION.x + STATION.w + 20} ${STATION.top + 10} Z`}
          fill="#e8590c"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <rect x={STATION.x + 30} y={STATION.top + 40} width="70" height="56" rx="6" fill="#a5d8ff" stroke={INK} strokeWidth="4" />
        <rect x={STATION.x + 150} y={STATION.top + 40} width="70" height="56" rx="6" fill="#a5d8ff" stroke={INK} strokeWidth="4" />
        {/* The station's clock under its roof's tip. */}
        <circle cx={STATION.x + STATION.w / 2} cy={STATION.top - 22} r="24" fill="#fff" stroke={INK} strokeWidth="4" />
        <path
          d={`M${STATION.x + STATION.w / 2} ${STATION.top - 22} V${STATION.top - 38} M${STATION.x + STATION.w / 2} ${STATION.top - 22} H${STATION.x + STATION.w / 2 + 12}`}
          stroke={INK}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <rect x={STATION.x - 20} y={RAIL_Y - 40} width={STAGE_W - STATION.x + 20} height="34" fill="#ced4da" stroke={INK} strokeWidth="4" />
        {/* The track: sleepers, the rail and the buffers at its end. */}
        <rect x="0" y={RAIL_Y + 4} width={TRACK_END} height="24" fill="#a68a6d" />
        {Array.from({ length: Math.floor(TRACK_END / 48) }, (_, i) => (
          <rect key={i} x={10 + i * 48} y={RAIL_Y + 2} width="26" height="18" rx="3" fill="#6b4a2b" />
        ))}
        {/* The rail is dark where the train has been; ahead of it a shining rail lies over it (`RailAhead`). */}
        <rect x="0" y={RAIL_Y - 6} width={TRACK_END} height="10" rx="4" fill="#3d434a" />
        {/* The end, plain from afar (user feedback, November 2026): big red and white buffers and a chequered flag over them. */}
        <rect x={TRAIN.stop + 8} y={RAIL_Y - 84} width="28" height="84" fill="#e03131" stroke={INK} strokeWidth="4" />
        <path d={`M${TRAIN.stop + 8} ${RAIL_Y - 62} h28 M${TRAIN.stop + 8} ${RAIL_Y - 34} h28`} stroke="#fff" strokeWidth="10" />
        <rect x={TRAIN.stop - 2} y={RAIL_Y - 74} width="18" height="28" rx="6" fill="#ffd43b" stroke={INK} strokeWidth="3" />
        <rect x={TRAIN.stop + 18} y={RAIL_Y - 404} width="10" height="320" rx="4" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
        <g stroke={INK} strokeWidth="4" strokeLinejoin="round">
          <path
            d={`M${TRAIN.stop + 18} ${RAIL_Y - 400} L${TRAIN.stop - 92} ${RAIL_Y - 390} L${TRAIN.stop - 92} ${RAIL_Y - 320} L${TRAIN.stop + 18} ${RAIL_Y - 330} Z`}
            fill="#fff"
          />
          <path
            d={[0, 1, 2, 3, 4]
              .flatMap((c) =>
                [0, 1, 2].filter((r) => (c + r) % 2 === 0).map((r) => `M${TRAIN.stop + 18 - c * 22} ${RAIL_Y - 400 + c * 2 + r * 23.3} h-22 v23.3 h22 Z`),
              )
              .join(" ")}
            fill={INK}
            strokeWidth="0"
          />
        </g>
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
  return {
    left: `${(x / TRAIN_ART.w) * 100}%`,
    top: `${(y / TRAIN_ART.h) * 100}%`,
    width: `${(w / TRAIN_ART.w) * 100}%`,
    height: `${(h / TRAIN_ART.h) * 100}%`,
  };
}

/**
 * The train: a locomotive facing right with two wagons, drawn in TRAIN_ART units, its wheels on the rail; `puff` keys a steam
 * cloud. Every second its wheels turn once and a small puff of steam rises from the chimney (H-63) – the wheels and the
 * puff are small layers of their own riding in the train's, so the train's drawing is never painted again.
 */
export function Train({ puff }: { puff: number }) {
  const { w, h } = TRAIN_ART;
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
 * The little stops along the track, one a minute (H-45): a post with a bell just ahead of where the train's front halts,
 * so the child sees how many stretches are left. The last stop is the station itself, so `pieces - 1` posts.
 */
export const TrainStops = memo(function TrainStops({ pieces }: { pieces: number }) {
  const from = TRAIN.x + TRAIN.w;
  const way = TRAIN.stop - from;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-dims">
      <Draw w={STAGE_W} h={STAGE_H}>
        {Array.from({ length: pieces - 1 }, (_, i) => {
          const x = from + ((i + 1) / pieces) * way + 10;
          return (
            <g key={i}>
              <rect x={x - 4} y={RAIL_Y - 96} width="8" height="92" rx="3" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
              <path
                d={`M${x - 15} ${RAIL_Y - 96} Q${x - 15} ${RAIL_Y - 124} ${x} ${RAIL_Y - 126} Q${x + 15} ${RAIL_Y - 124} ${x + 15} ${RAIL_Y - 96} Z`}
                fill="#ffd43b"
                stroke={INK}
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <circle cx={x} cy={RAIL_Y - 92} r="4" fill={INK} />
            </g>
          );
        })}
      </Draw>
    </Layer>
  );
});

/**
 * The rail ahead of the train, shining (H-64): it lies over the dark rail from the train's front to the buffers and
 * gets shorter as the train rolls on, so what lies behind is dark and what is still to come shines.
 */
export function RailAhead({ glow }: { glow: number }) {
  const from = TRAIN.x + TRAIN.w;
  return (
    <Layer x={from} y={RAIL_Y - 6} w={TRAIN.stop - from} h={10}>
      <div className="tm-rail-shine tm-move">
        <LeftGlow n={glow} />
      </div>
    </Layer>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Sanduhr: a big, tall hourglass whose sand runs from the top into the bottom (user feedback, November 2026: taller,
// so the heap is seen growing). Only the sand is drawn – no film on the glass it left, no grain over the stream.

/** The hourglass's glass: its middle, width, the top and bottom bulbs (between the wooden plates) and the neck. */
export const GLASS = { cx: 800, w: 300, top: 152, neck: 451, bottom: 750 } as const;

/** The wooden plates' height above and below the glass (with a small gap to it). */
export const PLATE = 34;

/** The room's floor, where the hourglass stands. */
export const SAND_FLOOR = GLASS.bottom + PLATE + 8;

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

/** How far down its bulb the sand begins: the full top's surface, and the full bottom heap's top at the end. */
export const SAND_LEVEL = 0.3;

/** The bulb as a CSS polygon, the right way up (top) or upside down (bottom). */
function bulbPolygon(upsideDown: boolean) {
  return `polygon(${BULB.map(([x, y]) => `${x * 100}% ${(upsideDown ? 1 - y : y) * 100}%`).join(", ")})`;
}

/**
 * The part of a bulb below `level` (fractions of its box), as an SVG path in a 100 × 100 box: the sand when that bulb
 * is full. The bulb's outline cut by one line (Sutherland–Hodgman with one edge).
 */
export function bulbBelow(level: number, upsideDown: boolean) {
  const points = BULB.map(([x, y]): [number, number] => [x, upsideDown ? 1 - y : y]);
  const kept: [number, number][] = [];
  points.forEach((p, i) => {
    const q = points[(i + 1) % points.length];
    if (p[1] >= level) kept.push(p);
    if (p[1] >= level !== q[1] >= level) kept.push([p[0] + ((q[0] - p[0]) * (level - p[1])) / (q[1] - p[1]), level]);
  });
  return `${kept.map(([x, y], i) => `${i ? "L" : "M"}${(x * 100).toFixed(2)} ${(y * 100).toFixed(2)}`).join(" ")} Z`;
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

/** The glass's outline and the wooden frame, in front of the sand. Drawn once. */
export const SandFrame = memo(function SandFrame() {
  const left = GLASS.cx - GLASS.w / 2 - 50;
  const right = GLASS.cx + GLASS.w / 2 + 50;
  const { top, neck, bottom } = GLASS;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H}>
      <Draw w={STAGE_W} h={STAGE_H}>
        <g fill="none" stroke={INK} strokeWidth="6" strokeLinejoin="round">
          <path d={bulbPath(top, neck, false)} />
          <path d={bulbPath(neck, bottom, true)} />
        </g>
        {[left + 10, right - 30].map((x) => (
          <rect key={x} x={x} y={top - 10} width="20" height={bottom - top + 20} rx="8" fill="#b5651d" stroke={INK} strokeWidth="5" />
        ))}
        <rect x={left - 10} y={top - 4 - PLATE} width={right - left + 20} height={PLATE} rx="12" fill="#c97d3a" stroke={INK} strokeWidth="6" />
        <rect x={left - 10} y={bottom + 4} width={right - left + 20} height={PLATE} rx="12" fill="#c97d3a" stroke={INK} strokeWidth="6" />
      </Draw>
    </Layer>
  );
});

/**
 * The sand in one bulb, filling the box it is put in (the bulb's box). The sand is drawn still in the bulb's shape, and
 * a window over it (`overflow: hidden`, no `clip-path`) slides: down in the top bulb, so the sand left sinks, up in
 * the bottom one, its top rounded to a heap, while the drawing inside slides back the other way and stays put. Both
 * move by `transform` only. A `clip-path` round a moving layer was left out of the picture of a turning page, and the
 * top's sand showed as a square for a moment (user feedback, November 2026). `glow` lights the sand left (H-51).
 */
export function BulbSand({ bottom = false, glow = 0 }: { bottom?: boolean; glow?: number }) {
  // useId gives characters a url(#…) would need escaped.
  const id = `tm-sand-${useId().replace(/[^\w-]/g, "")}`;
  return (
    <div className={`tm-sand ${bottom ? "tm-sand-bottom" : "tm-sand-top"} tm-move`} style={{ "--tm-level": `${SAND_LEVEL * 100}%` } as CSSProperties}>
      <div className="tm-sand-fill tm-move">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffd8a8" />
              <stop offset="1" stopColor="#f4a95c" />
            </linearGradient>
          </defs>
          <path d={bulbBelow(SAND_LEVEL, bottom)} fill={`url(#${id})`} />
        </svg>
        {glow > 0 && (
          <div className="tm-sand-light" style={{ clipPath: bulbPolygon(bottom) }}>
            <LeftGlow n={glow} />
          </div>
        )}
      </div>
    </div>
  );
}

/** The sand: the top heap sinking, the thin stream through the neck and the bottom heap growing, each its own layer. */
export function Sand({ running, glow }: { running: boolean; glow: number }) {
  const left = GLASS.cx - GLASS.w / 2;
  return (
    <>
      <Layer x={left} y={GLASS.top} w={GLASS.w} h={GLASS.neck - GLASS.top} className="tm-bulb">
        <BulbSand glow={glow} />
      </Layer>
      {running && (
        <Layer x={GLASS.cx - 6} y={GLASS.neck - 4} w={12} h={GLASS.bottom - GLASS.neck} className="tm-stream">
          <div className="tm-stream-grains tm-move" />
        </Layer>
      )}
      <Layer x={left} y={GLASS.neck} w={GLASS.w} h={GLASS.bottom - GLASS.neck} className="tm-bulb">
        <BulbSand bottom />
      </Layer>
    </>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Kerze: three tall candles on the table burn down one after another (user feedback, November 2026: taller, and
// several, so more of the time shows); each burns all the way down into its puddle on the holder, and only then goes
// out, its smoke rising slowly for a few seconds while the next lights up (user feedback, November 2026: they went out
// with a good piece still standing, and the puff was gone at once). At the end the last one goes out with a puff too. Each candle burns in its third of the
// time: the same animations as one candle, each with a third of the time as duration and its turn as delay.

/** The candles when new: their middles, width, top and the table they stand on; at the end only a thin `stub` of each is left in its puddle. */
export const CANDLE = { xs: [600, 800, 1000], w: 110, top: 215, base: 785, stub: 10 } as const;

/** How tall the flame stands above a candle's top, so the first candle's flame stays on every screen. */
export const FLAME_H = 130;

/** The candle burning at `share` (0–1) of the time, counted from 0. */
export function candleAt(share: number): number {
  return Math.min(CANDLE.xs.length - 1, Math.max(0, Math.floor(share * CANDLE.xs.length)));
}

/** A cosy evening room with a window and the table with the candles' holders; drawn once. */
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
        <rect x="1110" y="150" width="220" height="240" rx="12" fill="#1c2a5a" stroke="#c9a46b" strokeWidth="14" />
        <path d="M1220 150 V390 M1110 270 H1330" stroke="#c9a46b" strokeWidth="10" />
        <circle cx="1170" cy="215" r="32" fill="#fff3bf" />
        <circle cx="1186" cy="205" r="28" fill="#1c2a5a" />
        {[
          [1280, 200],
          [1295, 330],
          [1150, 340],
        ].map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r="5" fill="#fff3bf" />
        ))}
        <rect x="0" y={CANDLE.base + 10} width={STAGE_W} height={STAGE_H} fill="#8a5a2b" />
        <rect x="0" y={CANDLE.base + 10} width={STAGE_W} height="16" fill="#a8743f" />
        {CANDLE.xs.map((cx) => (
          <ellipse key={cx} cx={cx} cy={CANDLE.base + 8} rx="92" ry="18" fill="#e6b44c" stroke={INK} strokeWidth="5" />
        ))}
      </Draw>
    </Layer>
  );
});

/** The animation timing of candle `i` for the CSS: its turn (`--tm-i`) among `--tm-of` candles. */
function turn(i: number): CSSProperties {
  return { "--tm-i": i, "--tm-of": CANDLE.xs.length } as CSSProperties;
}

/**
 * One candle: the wax that has run down, a puddle on the holder that grows as it burns (H-64), behind it; the wax,
 * shrinking from the bottom up (its CSS scales it); and its top with wick and flame going down with the wax – a layer as
 * tall as the candle, moved down by the part that burns away. The flame lights up at the candle's turn and, but on the
 * last, goes out once it is burnt down, with a slow curl of smoke. `out` puts the last one's flame out; `flare` keys the flame flaring
 * up at a tap; `glow` lights the wax still to burn (H-51), given only to the candles not yet burnt.
 */
function Candle({ i, out, flare, glow }: { i: number; out: boolean; flare: number; glow: number }) {
  const cx = CANDLE.xs[i];
  const w = CANDLE.w;
  const h = CANDLE.base - CANDLE.top;
  const last = i === CANDLE.xs.length - 1;
  return (
    <>
      <Layer x={cx - 90} y={CANDLE.base - 14} w={180} h={28} style={turn(i)}>
        <div className="tm-puddle tm-move" />
      </Layer>
      <Layer x={cx - w / 2} y={CANDLE.top} w={w} h={h} className="tm-wax-box" style={turn(i)}>
        <div className="tm-wax tm-move">
          <LeftGlow n={glow} />
        </div>
      </Layer>
      <Layer x={cx - w / 2} y={CANDLE.top} w={w} h={h} className="tm-flame-box tm-move" style={turn(i)}>
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <ellipse cx={w / 2} cy="0" rx={w / 2 - 2} ry="13" fill="#ffe3e3" stroke={INK} strokeWidth="4" />
          <path d={`M${w / 2} 0 V-22`} stroke={INK} strokeWidth="5" strokeLinecap="round" />
        </svg>
        <div className={`tm-lit${last ? "" : " tm-goes-out"}`}>
          {/* A drop of wax running down the candle's side, a little further every second (H-63). */}
          <div className="tm-drop tm-beat" />
          {out ? (
            <Smoke />
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
        </div>
        {!last && <Smoke puff />}
      </Layer>
    </>
  );
}

/** The smoke's soft puffs: their width (% of the smoke's box), when they rise (s) and how far they drift sideways (%). */
const SMOKE_PUFFS = [
  { size: 40, at: 0, dx: -40 },
  { size: 55, at: 0.5, dx: 60 },
  { size: 35, at: 1.1, dx: -80 },
  { size: 60, at: 1.8, dx: 30 },
  { size: 45, at: 2.6, dx: -20 },
] as const;

/**
 * The smoke of a candle gone out: a thin wisp curling up from the wick, and soft puffs rising one after the other,
 * drifting apart and fading – each a small layer of its own moved by transform and opacity. `puff` waits for the end
 * of the candle's turn (a candle burnt down), else it rises at once (the last one, blown out).
 */
function Smoke({ puff }: { puff?: boolean }) {
  return (
    <div className={`tm-smoke${puff ? " tm-puff" : ""}`}>
      <div className="tm-wisp">
        <svg viewBox="0 0 40 160">
          <path d="M20 160 C6 136 34 120 20 96 C6 72 32 58 22 34 C16 20 26 10 20 0" fill="none" stroke="#e2e2ee" strokeWidth="6" strokeLinecap="round" />
          <path d="M22 150 C32 128 12 112 24 90 C34 70 14 54 26 30" fill="none" stroke="#c4c4d6" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      {SMOKE_PUFFS.map((p, i) => (
        <div key={i} className="tm-smoke-puff" style={{ "--s": `${p.size}%`, "--d": `${p.at}s`, "--dx": `${p.dx}%` } as CSSProperties} />
      ))}
    </div>
  );
}

/**
 * The three candles. The one burning while a tap comes is worked out from the clock, so its wax and those after it
 * light up, never the stubs already burnt.
 */
export function Candles({ out, flare, glow, startedAt, total }: { out: boolean; flare: number; glow: number; startedAt: number; total: number }) {
  const now = glow ? candleAt((Date.now() - startedAt) / total) : 0;
  return (
    <>
      {CANDLE.xs.map((_, i) => (
        <Candle key={i} i={i} out={out} flare={i === now ? flare : 0} glow={i >= now ? glow : 0} />
      ))}
    </>
  );
}
