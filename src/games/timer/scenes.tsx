import { memo, useId, type CSSProperties, type ReactNode } from "react";
import { useRunClock } from "./pause";

// Everything is drawn on a stage of STAGE_W × STAGE_H that covers the screen (`.tm-stage`): what matters stays within
// x 200–1400 (cut off at 4:3) and y 80–820 (all a phone on its side shows, the backdrop going on beside it, `Bleed`). What moves is an HTML layer of its own
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

/**
 * An SVG filling its layer, in the layer's own units. A backdrop covering the whole stage passes `bleed`, so it goes on
 * past the stage's sides (`Bleed`).
 */
export function Draw({ w, h, bleed, children }: { w: number; h: number; bleed?: boolean; children: ReactNode }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {bleed ? <Bleed>{children}</Bleed> : children}
    </svg>
  );
}

/** The edge band `Bleed` mirrors back and forth, and how many bands it lays beside each edge, in stage units. */
const BAND = 80;
const BANDS = 8;
/** How far a band reaches under the drawing at the edge, so no hairline shows between them. */
const SEAM = 2;

/**
 * A backdrop going on past the stage's left and right edges: the outermost `BAND` of it, mirrored back and forth as
 * far as `BANDS` of them reach, like a wall, sky or floor going on. On a phone on its side the stage is narrower than
 * the screen (`.tm-stage`: it shrinks until y 80–820 fit above the bar – a stage as wide as the screen cut the
 * hourglass's and the red disc's tops off, user feedback, 25 November 2026), and these bands fill the strips beside it.
 * Only a narrow band, never the whole drawing mirrored: that brought a second crane post and half a house into the
 * strips. Each band is a pattern's tile (a tile cuts its drawing off by itself – never a clip path, which drops out while
 * the page turns), its edges crisp so no hairline shows between two; the svg lets them out (`.tm-layer > svg`), `.tm-play` cuts them at the screen. Drawn once with the
 * backdrop, so they cost nothing while it runs.
 */
export function Bleed({ children }: { children: ReactNode }) {
  const id = `tm-bleed-${useId().replace(/[^\w-]/g, "")}`;
  // The band at each edge as it is, and mirrored; `x` is where in the drawing the band starts.
  const tiles = [
    { key: "l", x: 0, mirror: false },
    { key: "lm", x: 0, mirror: true },
    { key: "r", x: STAGE_W - BAND, mirror: false },
    { key: "rm", x: STAGE_W - BAND, mirror: true },
  ];
  // Beside the edge the band comes mirrored, beyond it as it is, and so on.
  const bands = Array.from({ length: BANDS }, (_, k) => [
    { key: `l${k}`, x: -(k + 1) * BAND, tile: k % 2 ? "l" : "lm", seam: k === 0 },
    { key: `r${k}`, x: STAGE_W + k * BAND, tile: k % 2 ? "r" : "rm", seam: k === 0 },
  ]).flat();
  return (
    <>
      <defs>
        {tiles.map((t) => (
          <pattern key={t.key} id={`${id}-${t.key}`} patternUnits="userSpaceOnUse" width={BAND} height={STAGE_H}>
            <use href={`#${id}`} transform={t.mirror ? `matrix(-1 0 0 1 ${t.x + BAND} 0)` : `translate(${-t.x} 0)`} />
          </pattern>
        ))}
      </defs>
      {bands.map((b) => (
        <rect
          key={b.key}
          x={b.x < 0 ? b.x : b.x - (b.seam ? SEAM : 0)}
          width={BAND + (b.seam ? SEAM : 0)}
          height={STAGE_H}
          fill={`url(#${id}-${b.tile})`}
          shapeRendering="crispEdges"
        />
      ))}
      <g id={id}>{children}</g>
    </>
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
      <Draw w={STAGE_W} h={STAGE_H} bleed>
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
 * The little stops along the track (H-45, `TRAIN_STOPS`): a post with a bell just ahead of where the train's front halts,
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

/** A room with a rug and a picture on the wall, the Sanduhr's backdrop. Drawn once. */
export const SandBackdrop = memo(function SandBackdrop() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H} bleed>
        <defs>
          {/* A soft striped wallpaper with little flowers between the stripes. */}
          <pattern id="tm-sand-wall" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="#fde8c8" />
            <rect x="0" width="44" height="120" fill="#fbdfb8" />
            <circle cx="82" cy="30" r="5" fill="#f7c99a" />
            <circle cx="82" cy="90" r="5" fill="#f7c99a" />
          </pattern>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="url(#tm-sand-wall)" />
        {/* The skirting board, then the floorboards. */}
        <rect y={SAND_FLOOR - 44} width={STAGE_W} height="30" fill="#f4d3a6" stroke="#9c6334" strokeWidth="5" />
        <rect y={SAND_FLOOR - 16} width={STAGE_W} height={STAGE_H} fill="#c98b52" />
        <path d={`M0 ${SAND_FLOOR - 16} H1600`} stroke="#9c6334" strokeWidth="6" />
        <path
          d={`M0 ${SAND_FLOOR + 30} H1600 M0 ${SAND_FLOOR + 80} H1600 M220 ${SAND_FLOOR - 16} V${SAND_FLOOR + 30} M1380 ${SAND_FLOOR + 30} V${SAND_FLOOR + 80}`}
          stroke="#b07440"
          strokeWidth="4"
        />
        {/* The rug under the hourglass: a border round its middle and a fringe at both ends. */}
        <ellipse cx="900" cy={SAND_FLOOR + 6} rx="520" ry="40" fill="#ff8787" />
        <ellipse cx="900" cy={SAND_FLOOR + 6} rx="470" ry="30" fill="none" stroke="#ffc9c9" strokeWidth="6" strokeDasharray="22 14" />
        <path
          d={`M372 ${SAND_FLOOR - 4} l-26 -4 M368 ${SAND_FLOOR + 8} l-28 0 M372 ${SAND_FLOOR + 20} l-26 4 M1428 ${SAND_FLOOR - 4} l26 -4 M1432 ${SAND_FLOOR + 8} l28 0 M1428 ${SAND_FLOOR + 20} l26 4`}
          stroke="#e8686a"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* A picture on the wall: a sun over a hill. */}
        <rect x="260" y="200" width="220" height="170" rx="10" fill="#e7f5ff" stroke="#9c6334" strokeWidth="12" />
        <path d="M266 330 Q370 270 474 330 V364 H266 Z" fill="#8ce99a" />
        <circle cx="420" cy="250" r="26" fill="#ffd43b" />
      </Draw>
    </Layer>
  );
});

/** The hourglass's box on the stage: the glass with the posts and the wooden plates round it. */
export const HOURGLASS_BOX = {
  x: GLASS.cx - GLASS.w / 2 - 60,
  y: GLASS.top - 4 - PLATE,
  w: GLASS.w + 120,
  h: GLASS.bottom - GLASS.top + 8 + 2 * PLATE,
} as const;

/** A box in stage units as a place in percent of the hourglass's box. */
function inHourglass(x: number, y: number, w: number, h: number): CSSProperties {
  const B = HOURGLASS_BOX;
  return {
    position: "absolute",
    left: `${((x - B.x) / B.w) * 100}%`,
    top: `${((y - B.y) / B.h) * 100}%`,
    width: `${(w / B.w) * 100}%`,
    height: `${(h / B.h) * 100}%`,
  };
}

/** The glass's pale inside, behind the sand. */
const GlassInside = memo(function GlassInside() {
  const B = HOURGLASS_BOX;
  return (
    <svg viewBox={`${B.x} ${B.y} ${B.w} ${B.h}`} style={inHourglass(B.x, B.y, B.w, B.h)}>
      <path d={`${bulbPath(GLASS.top, GLASS.neck, false)} Z`} fill="#f1f8ff" />
      <path d={`${bulbPath(GLASS.neck, GLASS.bottom, true)} Z`} fill="#f1f8ff" />
    </svg>
  );
});

/** The glass's outline and the wooden frame, in front of the sand: no white streaks for its shine (user feedback, November 2026). */
const GlassFrame = memo(function GlassFrame() {
  const B = HOURGLASS_BOX;
  const left = GLASS.cx - GLASS.w / 2 - 50;
  const right = GLASS.cx + GLASS.w / 2 + 50;
  const { top, neck, bottom } = GLASS;
  return (
    <svg viewBox={`${B.x} ${B.y} ${B.w} ${B.h}`} style={inHourglass(B.x, B.y, B.w, B.h)}>
      <g fill="none" stroke={INK} strokeWidth="6" strokeLinejoin="round">
        <path d={bulbPath(top, neck, false)} />
        <path d={bulbPath(neck, bottom, true)} />
      </g>
      {/* Turned wooden posts: a slim shaft with a light edge, and round beads near its ends and at the neck. */}
      {[left + 20, right - 20].map((x) => (
        <g key={x}>
          <rect x={x - 10} y={top - 10} width="20" height={bottom - top + 20} rx="8" fill="#b5651d" stroke={INK} strokeWidth="5" />
          <path d={`M${x - 3} ${top + 4} V${bottom - 4}`} stroke="#d98c45" strokeWidth="4" strokeLinecap="round" />
          {[top + 26, neck, bottom - 26].map((y) => (
            <g key={y}>
              <ellipse cx={x} cy={y} rx="19" ry="14" fill="#b5651d" stroke={INK} strokeWidth="5" />
              <ellipse cx={x - 5} cy={y - 4} rx="6" ry="4" fill="#d98c45" />
            </g>
          ))}
        </g>
      ))}
      {/* The plates: a light top edge, a darker underside and the wood's grain. */}
      {[top - 4 - PLATE, bottom + 4].map((y) => (
        <g key={y}>
          <rect x={left - 10} y={y} width={right - left + 20} height={PLATE} rx="12" fill="#c97d3a" />
          <rect x={left - 4} y={y + 4} width={right - left + 8} height="7" rx="3.5" fill="#e3a062" />
          <rect x={left - 4} y={y + PLATE - 9} width={right - left + 8} height="6" rx="3" fill="#a8622a" />
          <path
            d={`M${left + 20} ${y + 17} C${left + 90} ${y + 12} ${left + 150} ${y + 22} ${left + 230} ${y + 16} M${right - 170} ${y + 19} C${right - 110} ${y + 14} ${right - 60} ${y + 22} ${right - 10} ${y + 17}`}
            fill="none"
            stroke="#9c5a22"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />
          <rect x={left - 10} y={y} width={right - left + 20} height={PLATE} rx="12" fill="none" stroke={INK} strokeWidth="6" />
        </g>
      ))}
    </svg>
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

/**
 * The one hourglass of the timer, shared by „Sanduhr“ and „Abwechseln“ (user request, November 2026: one drawing, not
 * two built side by side): the pale glass, the top heap sinking, the thin stream through the neck while `running`, the
 * bottom heap growing, and the frame in front – one layer, so Abwechseln can turn it over as a whole. The sand runs over
 * `--tm-ms` (set on the stage, or in `style`); `glow` lights the sand left (H-51).
 */
export function Hourglass({ running, glow = 0, className, style }: { running: boolean; glow?: number; className?: string; style?: CSSProperties }) {
  const left = GLASS.cx - GLASS.w / 2;
  const B = HOURGLASS_BOX;
  return (
    <Layer x={B.x} y={B.y} w={B.w} h={B.h} className={`tm-hourglass${className ? ` ${className}` : ""}`} style={style}>
      <GlassInside />
      <div style={inHourglass(left, GLASS.top, GLASS.w, GLASS.neck - GLASS.top)}>
        <BulbSand glow={glow} />
      </div>
      {running && (
        <div className="tm-stream" style={inHourglass(GLASS.cx - 6, GLASS.neck - 4, 12, GLASS.bottom - GLASS.neck)}>
          <div className="tm-stream-grains tm-move" />
        </div>
      )}
      <div style={inHourglass(left, GLASS.neck, GLASS.w, GLASS.bottom - GLASS.neck)}>
        <BulbSand bottom />
      </div>
      <GlassFrame />
    </Layer>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Kerze: six tall candles stand side by side on a table and burn down one after another, linked like a chain reaction
// (user request, 24 November 2026: more candles, the table seen, and plain to see how one leads to the next): from
// each candle's dish a fuse runs across the table, over the next one's dish and up its side to its wick. Each candle
// burns all the way down into its puddle and only then goes out (user feedback, November 2026: they went out with a
// good piece still standing), its last flame lights the fuse, a spark runs along it – the cord burning away behind it,
// leaving a thin line of ash on the table – and lights the next candle's wick, while the smoke of the one gone out
// rises slowly for a few seconds. At the end the last one goes out with a puff. Every candle has its sixth of the time
// (`candlePlan`); the fuse takes the first moments of the next one's share.

/** The candles when new: their middles, width, top and where they stand on the table; at the end only a thin `stub` of each is left in its puddle. */
export const CANDLE = { xs: [325, 515, 705, 895, 1085, 1275], w: 96, top: 240, base: 655, stub: 10 } as const;

/** How tall the flame stands above a candle's top, so the first candle's flame stays on every screen. */
export const FLAME_H = 130;

/** The table the candles stand on, seen a little from above: its top's back and front edge, its front's lower edge, its ends and legs. */
export const TABLE = { back: 600, front: 700, edge: 732, left: 228, right: 1372, inset: 30, leg: 52 } as const;

/** How long the spark runs along a fuse at most, and never more than this share of a candle's time (a short run is only quicker). */
export const FUSE_MS = 3500;
export const FUSE_SHARE = 0.25;

/** When candle `i` lights, when it is burnt down and goes out, and when the spark on the fuse into it sets off (`fuse` ms long; none for the first). */
export interface CandleTurn {
  light: number;
  out: number;
  fuseAt: number;
  fuse: number;
}

/**
 * Each candle's moments in a run of `total` ms: its share starts as the one before goes out, the spark runs the fuse
 * in its first moments, and it burns from the moment the spark reaches its wick to the end of its share. The first is
 * lit from the start.
 */
export function candlePlan(total: number): CandleTurn[] {
  const count = CANDLE.xs.length;
  const share = total / count;
  const fuse = Math.min(FUSE_MS, share * FUSE_SHARE);
  return CANDLE.xs.map((_, i) => {
    const start = share * i;
    const lit = i === 0 ? 0 : fuse;
    return { light: start + lit, out: start + share, fuseAt: start, fuse: i === 0 ? 0 : fuse };
  });
}

/** The candle burning at `share` (0–1) of the time, counted from 0. */
export function candleAt(share: number): number {
  return Math.min(CANDLE.xs.length - 1, Math.max(0, Math.floor(share * CANDLE.xs.length)));
}

/** Points of a quadratic curve from `a` over `c` to `b`, without `a`. */
function curve(a: readonly [number, number], c: readonly [number, number], b: readonly [number, number], steps: number): [number, number][] {
  return Array.from({ length: steps }, (_, k) => {
    const t = (k + 1) / steps;
    const u = 1 - t;
    return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]] as [number, number];
  });
}

/** How far apart the candles stand. */
const STEP = CANDLE.xs[1] - CANDLE.xs[0];

/**
 * The fuse from one candle to the next, in stage units counted from the first candle's middle: from beside its stub
 * in its dish over the dish's rim, across the table in a little dip towards the front, over the next dish's rim, up
 * that candle's side and over its top to its wick. Every fuse is the same, moved by `STEP`.
 */
export const FUSE: readonly [number, number][] = (() => {
  const { base, top, w } = CANDLE;
  const side = STEP - w / 2 + 4;
  const rimOut: [number, number][] = [
    [34, base - 8],
    [50, base - 6],
    [62, base - 1],
    [70, base + 6],
    [75, base + 16],
  ];
  const across = curve([75, base + 16], [STEP / 2, base + 56], [STEP - 75, base + 16], 10);
  const rimIn: [number, number][] = [
    [STEP - 70, base + 6],
    [STEP - 62, base - 1],
    [side, base - 8],
  ];
  const up: [number, number][] = [
    [side, (base + top) / 2],
    [side, top + 16],
  ];
  const over = curve([side, top + 16], [side, top - 8], [STEP - 5, top - 16], 6);
  return [...rimOut, ...across, ...rimIn, ...up, ...over];
})();

/** How far along the fuse each of its points lies, as a share of its whole length (0 at its start, 1 at the wick). */
export const FUSE_AT: readonly number[] = (() => {
  const lengths = FUSE.map((p, k) => (k === 0 ? 0 : Math.hypot(p[0] - FUSE[k - 1][0], p[1] - FUSE[k - 1][1])));
  const sums = lengths.map((_, k) => lengths.slice(0, k + 1).reduce((x, y) => x + y, 0));
  const all = sums[sums.length - 1];
  return sums.map((s) => s / all);
})();

/** The fuse's box on the stage, counted from a candle's middle and the stage's top. */
const FUSE_BOX = { x: 0, y: CANDLE.top - 40, w: STEP + 10, h: CANDLE.base + 70 - (CANDLE.top - 40) } as const;

/** The spark's box, round the point it is at. */
const SPARK = 100;

/** A path through the fuse's points within its box; `onTable` only the part lying on the table, where its ash stays. */
function fusePath(onTable = false): string {
  const points = onTable ? FUSE.filter(([, y]) => y >= CANDLE.base + 6) : FUSE;
  return points.map(([x, y], k) => `${k ? "L" : "M"}${(x - FUSE_BOX.x).toFixed(1)} ${(y - FUSE_BOX.y).toFixed(1)}`).join(" ");
}

/**
 * The spark's way along the fuse as keyframes, from its start to the wick, at an even pace by length (as the cord
 * burns away behind it), growing and shrinking a little from point to point so it fizzles.
 */
export function fuseKeyframes(): string {
  const [x0, y0] = FUSE[0];
  const steps = FUSE.map(([x, y], k) => {
    const at = (FUSE_AT[k] * 100).toFixed(3);
    const dx = (((x - x0) / SPARK) * 100).toFixed(2);
    const dy = (((y - y0) / SPARK) * 100).toFixed(2);
    return `${at}% { transform: translate(${dx}%, ${dy}%) scale(${k % 2 ? 1.25 : 0.9}); }`;
  });
  return `@keyframes tm-fuse-run {${steps.join(" ")}}`;
}

/** The spark's keyframes, the same for every fuse and run. */
const FUSE_RUN = fuseKeyframes();

/** A cosy evening room with a quiet wallpaper, and the table with the candles' holders; drawn once. */
export const CandleBackdrop = memo(function CandleBackdrop() {
  const { back, front, edge, left, right, inset, leg } = TABLE;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H} bleed>
        <defs>
          <radialGradient id="tm-room" cx="0.51" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#5c4b8a" />
            <stop offset="1" stopColor="#2b2d5c" />
          </radialGradient>
          <pattern id="tm-paper" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M60 18 l8 12 l-8 12 l-8 -12 Z M0 78 l8 12 l-8 12 l-8 -12 Z M120 78 l8 12 l-8 12 l-8 -12 Z" fill="#ffffff" opacity="0.06" />
          </pattern>
          <linearGradient id="tm-table-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9c6834" />
            <stop offset="1" stopColor="#c08850" />
          </linearGradient>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="url(#tm-room)" />
        <rect width={STAGE_W} height={STAGE_H} fill="url(#tm-paper)" />
        {/* The floor and its skirting board, behind the table's legs. */}
        <rect x="0" y="820" width={STAGE_W} height="80" fill="#4a2f1a" />
        <rect x="0" y="806" width={STAGE_W} height="16" fill="#6b4526" />
        <path d="M0 852 H1600 M0 880 H1600" stroke="#3a2412" strokeWidth="3" />
        {/* The back legs, darker, then the front legs. */}
        {[left + inset + 26, right - inset - 26 - leg].map((x) => (
          <rect key={x} x={x} y={edge - 10} width={leg - 8} height={STAGE_H} fill="#5e3b1c" stroke={INK} strokeWidth="5" />
        ))}
        {[left + 24, right - 24 - leg].map((x) => (
          <rect key={x} x={x} y={edge - 10} width={leg} height={STAGE_H} fill="#7a4f26" stroke={INK} strokeWidth="5" />
        ))}
        {/* Under the top a band of shadow, then the top seen from above and its front edge. */}
        <rect x={left + 10} y={edge} width={right - left - 20} height="22" fill="#000" opacity="0.25" />
        <path
          d={`M${left + inset} ${back} H${right - inset} L${right} ${front} H${left} Z`}
          fill="url(#tm-table-top)"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d={`M${left + 90} ${back + 26} C560 ${back + 20} 820 ${back + 34} 1100 ${back + 24} S1260 ${back + 22} ${right - 60} ${back + 30} M${left + 30} ${back + 62} C520 ${back + 56} 820 ${back + 72} ${right - 30} ${back + 64}`}
          fill="none"
          stroke="#8a5a2b"
          strokeWidth="4"
          opacity="0.7"
        />
        <rect x={left} y={front} width={right - left} height={edge - front} fill="#8a5a2b" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d={`M${left + 6} ${front + 6} H${right - 6}`} stroke="#b47a42" strokeWidth="4" />
        {/* Each holder a brass dish with a rim, its shadow on the table. */}
        {CANDLE.xs.map((cx) => (
          <g key={cx}>
            <ellipse cx={cx + 6} cy={CANDLE.base + 26} rx="80" ry="12" fill="#000" opacity="0.22" />
            <ellipse cx={cx} cy={CANDLE.base + 16} rx="70" ry="15" fill="#b8862a" stroke={INK} strokeWidth="5" />
            <ellipse cx={cx} cy={CANDLE.base + 8} rx="70" ry="15" fill="#e6b44c" stroke={INK} strokeWidth="5" />
            <ellipse cx={cx} cy={CANDLE.base + 8} rx="56" ry="10" fill="none" stroke="#f7d779" strokeWidth="4" />
          </g>
        ))}
      </Draw>
    </Layer>
  );
});

/**
 * The fuse into candle `i` (from the one before): a cord with a dark outline lying over the dishes, the table and the
 * candle's side, burning away from its start as the spark runs along it (`--tm-fuse-at`, `--tm-fuse`), a thin line of
 * ash staying on the table; the spark is a small glowing layer of its own riding its way (`tm-fuse-run`).
 */
function Fuse({ i, turn }: { i: number; turn: CandleTurn }) {
  const x = CANDLE.xs[i - 1];
  const timing = { "--tm-fuse-at": `${turn.fuseAt}ms`, "--tm-fuse": `${turn.fuse}ms` } as CSSProperties;
  const line = fusePath();
  const [sx, sy] = FUSE[0];
  return (
    <>
      <Layer x={x + FUSE_BOX.x} y={FUSE_BOX.y} w={FUSE_BOX.w} h={FUSE_BOX.h}>
        <svg viewBox={`0 0 ${FUSE_BOX.w} ${FUSE_BOX.h}`} preserveAspectRatio="none">
          <path
            d={fusePath(true)}
            fill="none"
            stroke="#2b2320"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="3 9"
            opacity="0.7"
          />
        </svg>
      </Layer>
      <Layer x={x + FUSE_BOX.x} y={FUSE_BOX.y} w={FUSE_BOX.w} h={FUSE_BOX.h} className="tm-fuse" style={timing}>
        <svg viewBox={`0 0 ${FUSE_BOX.w} ${FUSE_BOX.h}`} preserveAspectRatio="none">
          <path className="tm-fuse-line" d={line} pathLength={1} fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
          <path className="tm-fuse-line" d={line} pathLength={1} fill="none" stroke="#fff1d6" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Layer>
      <Layer x={x + sx - SPARK / 2} y={sy - SPARK / 2} w={SPARK} h={SPARK} className="tm-spark" style={timing}>
        <div className="tm-spark-go" style={{ animationName: "tm-fuse-run" }}>
          <svg viewBox="-32 -32 64 64">
            <circle r="31" fill="#ffd43b" opacity="0.3" />
            <circle r="20" fill="#ffe066" opacity="0.5" />
            <path
              d="M0 -26 L5 -6 L24 -10 L8 3 L18 22 L0 10 L-18 22 L-8 3 L-24 -10 L-5 -6 Z"
              fill="#ffe066"
              stroke="#ff922b"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle r="7" fill="#fff9db" />
          </svg>
        </div>
      </Layer>
    </>
  );
}

/** The animation timing of candle `i` for the CSS: when it lights (`--tm-from`) and how long it burns (`--tm-turn`), with its wax colours. */
function timing(i: number, turn: CandleTurn): CSSProperties {
  const wax = WAX[i % WAX.length];
  return {
    "--tm-from": `${turn.light}ms`,
    "--tm-turn": `${turn.out - turn.light}ms`,
    "--tm-wax-side": wax.side,
    "--tm-wax-light": wax.light,
    "--tm-wax-top": wax.top,
    "--tm-wax-run": wax.run,
  } as CSSProperties;
}

/** Each candle's wax: its shaded sides, its lit middle, its top and what runs down (drop and puddle) – pink, blue, yellow, green, lilac, orange. */
const WAX = [
  { side: "#ffc9c9", light: "#fff0f0", top: "#ffe3e3", run: "#ffb3c1" },
  { side: "#a5d8ff", light: "#eef7ff", top: "#d0ebff", run: "#8cc8f5" },
  { side: "#ffe066", light: "#fffbe0", top: "#fff3bf", run: "#ffd43b" },
  { side: "#b2f2bb", light: "#f0fff2", top: "#d3f9d8", run: "#8ce99a" },
  { side: "#d0bfff", light: "#f6f2ff", top: "#e5dbff", run: "#b197fc" },
  { side: "#ffc078", light: "#fff4e6", top: "#ffd8a8", run: "#ffa94d" },
] as const;

/**
 * One candle: the wax that has run down, a puddle on the holder that grows as it burns (H-64), behind it; the wax,
 * shrinking from the bottom up (its CSS scales it); and its top with wick and flame going down with the wax – a layer as
 * tall as the candle, moved down by the part that burns away. The flame lights up at the candle's turn and, but on the
 * last, goes out once it is burnt down, with a slow curl of smoke. `out` puts the last one's flame out; `flare` keys the flame flaring
 * up at a tap; `glow` lights the wax still to burn (H-51), given only to the candles not yet burnt.
 */
function Candle({ i, turn, out, flare, glow }: { i: number; turn: CandleTurn; out: boolean; flare: number; glow: number }) {
  const cx = CANDLE.xs[i];
  const w = CANDLE.w;
  const h = CANDLE.base - CANDLE.top;
  const last = i === CANDLE.xs.length - 1;
  return (
    <>
      <Layer x={cx - 66} y={CANDLE.base - 12} w={132} h={26} style={timing(i, turn)}>
        <div className="tm-puddle tm-move" />
      </Layer>
      <Layer x={cx - w / 2} y={CANDLE.top} w={w} h={h} className="tm-wax-box" style={timing(i, turn)}>
        <div className="tm-wax tm-move">
          <LeftGlow n={glow} />
        </div>
      </Layer>
      <Layer x={cx - w / 2} y={CANDLE.top} w={w} h={h} className="tm-flame-box tm-move" style={timing(i, turn)}>
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <ellipse cx={w / 2} cy="0" rx={w / 2 - 2} ry="13" style={{ fill: "var(--tm-wax-top)" }} stroke={INK} strokeWidth="4" />
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
 * The candles and the fuses between them. The one burning while a tap comes is worked out from the clock, so its wax
 * and those after it light up, never the stubs already burnt. The spark's way is written once (`fuseKeyframes`).
 */
export function Candles({ out, flare, glow, startedAt, total }: { out: boolean; flare: number; glow: number; startedAt: number; total: number }) {
  const clock = useRunClock();
  const now = glow ? candleAt((clock.now() - startedAt) / total) : 0;
  const plan = candlePlan(total);
  return (
    <>
      <style>{FUSE_RUN}</style>
      {plan.map((turn, i) => (
        <Candle key={i} i={i} turn={turn} out={out} flare={i === now ? flare : 0} glow={i >= now ? glow : 0} />
      ))}
      {plan.map((turn, i) => (i === 0 ? null : <Fuse key={i} i={i} turn={turn} />))}
    </>
  );
}
