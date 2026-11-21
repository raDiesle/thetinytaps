import { memo, useRef, type CSSProperties } from "react";
import { INK, Layer, STAGE_H, STAGE_W } from "./scenes";
import type { SwapToy } from "./settings";
import { Cushion, type Holder, ToyDrawing } from "./swap";

// Wippe (H-109): two children take turns on a seesaw. The cushions in the fox's and the bear's colours sit on its two
// seats, and the toy rides on the seat of the child whose turn it is. That seat starts up high and sinks slowly the
// whole turn long until it touches down on its tyre – then the turn is over, the toy hops over to the other seat, now
// up high, and the seesaw carries that one down. So the time and whose turn it is are one motion, seen from afar, and
// the waiting child sees its own seat rising towards its turn – no hourglass, board or clock beside it. The plank turns
// as one HTML layer round the pivot (one CSS animation as long as the turn, back and forth for ever), and the toy riding
// on it turns back the same way, so it stays upright.

/** The grass's top, where the tyres lie half buried and the stand stands. */
export const SAW_GROUND = 702;

/** The pivot the plank turns round, at the plank's middle line; the plank's thickness; the seats' middles' distance from the pivot; the plank's half length. */
export const SAW = { x: 800, y: 560, thick: 26, seat: 440, half: 482 } as const;

/** The plank's top and its underside, while it lies level. */
const PLANK_TOP = SAW.y - SAW.thick / 2;
const PLANK_BOTTOM = SAW.y + SAW.thick / 2;

/** The top of the tyres half buried in the ground under the seats, where a seat touches down at the end of its turn. */
export const TYRE_TOP = 676;

/** How far the plank tips each way, in degrees: until the underside under a seat lies on its tyre. */
export const SAW_TILT = (Math.asin((TYRE_TOP - PLANK_BOTTOM) / SAW.seat) * 180) / Math.PI;

/** Where a seat's middle is on the stage while it lies on its tyre: the tyres lie there. */
export const TYRE_X = { fox: SAW.x - SAW.seat * Math.cos((SAW_TILT * Math.PI) / 180), bear: SAW.x + SAW.seat * Math.cos((SAW_TILT * Math.PI) / 180) } as const;

/** The cushions on the seats: their width. */
const SEAT_CUSHION_W = 180;

/** The toy riding on a seat: its size, and its bottom sunk a little into the cushion (plank level); in front of the stand while the sides draw who begins. */
export const SAW_TOY = { w: 180, h: 146, onSeat: PLANK_TOP - 36, waiting: SAW_GROUND + 58 } as const;

/** The plank's layer, in stage units while it lies level: the pivot in its middle, the toy on a seat and in front of the stand inside it. */
export const PLANK_BOX = { x: SAW.x - 500, y: SAW.y - 230, w: 1000, h: 460 } as const;

/** The stand under the pivot. */
const STAND = { x: SAW.x - 140, y: SAW.y - 40, w: 280, h: SAW_GROUND + 14 - (SAW.y - 40) } as const;

/** The plank's angle with `kind`'s seat up high, as a turn of that child starts: clockwise lifts the left (the fox's) end. */
const upFor = (kind: Holder) => (kind === "fox" ? SAW_TILT : -SAW_TILT);

/** One tyre half buried in the ground, its top at `TYRE_TOP`. */
function Tyre({ x }: { x: number }) {
  const rx = 74;
  const ry = SAW_GROUND - TYRE_TOP;
  return (
    <g strokeLinejoin="round">
      <path d={`M${x - rx} ${SAW_GROUND} A${rx} ${ry} 0 0 1 ${x + rx} ${SAW_GROUND} Z`} fill="#343a40" stroke={INK} strokeWidth="5" />
      <path d={`M${x - rx + 26} ${SAW_GROUND} A${rx - 26} ${ry - 12} 0 0 1 ${x + rx - 26} ${SAW_GROUND}`} fill="none" stroke="#5c636a" strokeWidth="6" />
    </g>
  );
}

/** A playground: sky, a row of soft bushes far off, the grass and the sand under the seesaw with its two tyres; drawn once. */
export const SeesawBackdrop = memo(function SeesawBackdrop() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="none">
        <rect width={STAGE_W} height={STAGE_H} fill="#d0ebff" />
        <path
          d={`M0 ${SAW_GROUND - 120} C120 ${SAW_GROUND - 200} 260 ${SAW_GROUND - 190} 380 ${SAW_GROUND - 130} C520 ${SAW_GROUND - 210} 700 ${SAW_GROUND - 200} 820 ${SAW_GROUND - 140} C980 ${SAW_GROUND - 220} 1180 ${SAW_GROUND - 200} 1300 ${SAW_GROUND - 135} C1420 ${SAW_GROUND - 190} 1540 ${SAW_GROUND - 180} ${STAGE_W} ${SAW_GROUND - 120} V${SAW_GROUND} H0 Z`}
          fill="#8ce99a"
        />
        <rect y={SAW_GROUND} width={STAGE_W} height={STAGE_H - SAW_GROUND} fill="#69db7c" />
        <path d={`M0 ${SAW_GROUND} H${STAGE_W}`} stroke="#40c057" strokeWidth="6" />
        <ellipse cx={SAW.x} cy={SAW_GROUND + 40} rx="600" ry="58" fill="#ffe8a3" />
        <Tyre x={TYRE_X.fox} />
        <Tyre x={TYRE_X.bear} />
      </svg>
    </Layer>
  );
});

/** A handle to hold on to in front of a seat, towards the middle: a post with a round bar on top. */
function Handle({ x }: { x: number }) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d={`M${x} ${PLANK_TOP} V${PLANK_TOP - 78}`} stroke={INK} strokeWidth="18" />
      <path d={`M${x} ${PLANK_TOP} V${PLANK_TOP - 78}`} stroke="#f59f00" strokeWidth="9" />
      <rect x={x - 28} y={PLANK_TOP - 92} width="56" height="20" rx="10" fill="#f59f00" stroke={INK} strokeWidth="5" />
    </g>
  );
}

/** The plank with its handles, the two cushions on its seats and the hub it turns on, lying level; drawn once and turned as a whole. */
const PlankDrawing = memo(function PlankDrawing() {
  const B = PLANK_BOX;
  return (
    <svg viewBox={`${B.x} ${B.y} ${B.w} ${B.h}`}>
      <rect x={SAW.x - SAW.half} y={PLANK_TOP} width={SAW.half * 2} height={SAW.thick} rx="12" fill="#d9844a" stroke={INK} strokeWidth="5" />
      <path
        d={`M${SAW.x - SAW.half + 30} ${SAW.y + 2} H${SAW.x - 40} M${SAW.x + 40} ${SAW.y - 2} H${SAW.x + SAW.half - 30}`}
        stroke="#b8642f"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Handle x={SAW.x - SAW.seat + 130} />
      <Handle x={SAW.x + SAW.seat - 130} />
      <Cushion kind="fox" x={SAW.x - SAW.seat} y={PLANK_TOP + 4} w={SEAT_CUSHION_W} />
      <Cushion kind="bear" x={SAW.x + SAW.seat} y={PLANK_TOP + 4} w={SEAT_CUSHION_W} />
      <circle cx={SAW.x} cy={SAW.y} r="24" fill="#ffd43b" stroke={INK} strokeWidth="5" />
      <circle cx={SAW.x} cy={SAW.y} r="7" fill={INK} />
    </svg>
  );
});

/** The stand under the pivot, behind the plank (the toy waits in front of it while the sides draw who begins); drawn once. */
export const SeesawStand = memo(function SeesawStand() {
  const S = STAND;
  return (
    <Layer x={S.x} y={S.y} w={S.w} h={S.h}>
      <svg viewBox={`${S.x} ${S.y} ${S.w} ${S.h}`}>
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d={`M${SAW.x - 110} ${SAW_GROUND + 6} L${SAW.x} ${SAW.y} L${SAW.x + 110} ${SAW_GROUND + 6}`} fill="none" stroke={INK} strokeWidth="30" />
          <path d={`M${SAW.x - 110} ${SAW_GROUND + 6} L${SAW.x} ${SAW.y} L${SAW.x + 110} ${SAW_GROUND + 6}`} fill="none" stroke="#e03131" strokeWidth="20" />
          <path d={`M${SAW.x - 62} ${SAW.y + 80} H${SAW.x + 62}`} stroke={INK} strokeWidth="18" />
          <path d={`M${SAW.x - 62} ${SAW.y + 80} H${SAW.x + 62}`} stroke="#e03131" strokeWidth="9" />
        </g>
      </svg>
    </Layer>
  );
});

/** Where the toy is: on a child's seat, or in front of the stand while the sides draw who begins. */
export type SawPlace = Holder | "middle";

/**
 * The seesaw: its plank with the cushions and the toy riding on the seat of `holder`.
 * - Before the turns run (`running` false) it lies level, or – once `holder` is known – tips that child's seat up,
 *   turning there slowly while the toy hops on.
 * - While they run it goes back and forth for ever, one turn each way (`turnMs`), from `startedAt` on: the first
 *   child's seat sinking first (`first`). `round` is a new number whenever the turns start anew, so the animation does.
 * - At the end (`level`) it lies level, the toy staying on its seat.
 * The toy moves from seat to seat by `transform` and hops on its way (`hop`, a new number for every move); while the
 * turns run it bounces softly on its seat once a second (H-63), so even a long turn never looks stuck.
 */
export function Seesaw({
  toy,
  place,
  hop,
  running,
  first,
  turnMs,
  startedAt,
  round,
  level = false,
}: {
  toy: SwapToy;
  place: SawPlace;
  hop: number;
  running: boolean;
  first: Holder;
  turnMs: number;
  startedAt: number;
  round: number;
  level?: boolean;
}) {
  const B = PLANK_BOX;
  const T = SAW_TOY;
  const rest = place === "middle" || level ? 0 : upFor(place);
  // The animation's delay is read once as the turns start to run, never again at the renders every second after: a
  // delay changed on a running animation moves it.
  const anchor = useRef({ key: "", delay: 0 });
  const key = `${round}-${running}-${startedAt}`;
  if (anchor.current.key !== key) anchor.current = { key, delay: startedAt - Date.now() };
  const name = round % 2 ? "b" : "a";
  const style = {
    transformOrigin: `${((SAW.x - B.x) / B.w) * 100}% ${((SAW.y - B.y) / B.h) * 100}%`,
    "--tm-tilt": `${SAW_TILT}deg`,
    "--tm-ms": `${turnMs}ms`,
    "--tm-delay": `${anchor.current.delay}ms`,
    "--tm-saw-dir": first === "fox" ? "alternate" : "alternate-reverse",
  } as CSSProperties;
  const at = (p: SawPlace) => (p === "fox" ? -SAW.seat : p === "bear" ? SAW.seat : 0);
  const dx = (at(place) / T.w) * 100;
  const dy = place === "middle" ? ((T.waiting - T.onSeat) / T.h) * 100 : 0;
  return (
    <Layer
      x={B.x}
      y={B.y}
      w={B.w}
      h={B.h}
      className={`tm-saw tm-move${running ? ` tm-saw-${name}` : ""}`}
      style={{ ...style, transform: running ? undefined : `rotate(${rest}deg)` }}
    >
      <PlankDrawing />
      <div
        className="tm-saw-toy"
        style={{
          left: `${((SAW.x - T.w / 2 - B.x) / B.w) * 100}%`,
          top: `${((T.onSeat - T.h - B.y) / B.h) * 100}%`,
          width: `${(T.w / B.w) * 100}%`,
          height: `${(T.h / B.h) * 100}%`,
          transform: `translate(${dx}%, ${dy}%)`,
        }}
      >
        <div className={`tm-saw-upright${running ? ` tm-saw-${name}` : ""}`} style={running ? undefined : { transform: `rotate(${-rest}deg)` }}>
          <div key={hop} className={hop ? "tm-toy-hop" : undefined}>
            <div className={running ? "tm-saw-bob" : undefined}>
              <ToyDrawing toy={toy} />
            </div>
          </div>
        </div>
      </div>
    </Layer>
  );
}

/** Where the seat of `kind` touches down: lights up softly when the child taps (H-51, „Wie lange noch?“), `n` keying it. */
export function SeesawGoal({ kind, n }: { kind: Holder; n: number }) {
  if (n <= 0) return null;
  return (
    <Layer x={TYRE_X[kind] - 130} y={TYRE_TOP - 90} w={260} h={150}>
      <div key={n} className="tm-saw-goal" />
    </Layer>
  );
}
