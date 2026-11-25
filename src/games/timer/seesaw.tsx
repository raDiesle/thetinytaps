import { memo, useEffect, useRef, useState, type CSSProperties } from "react";
import { useRunClock } from "./pause";
import { INK, Layer, STAGE_H, STAGE_W } from "./scenes";
import type { Players, TurnChild } from "./settings";
import { Cushion, type Holder } from "./swap";

// Wippe (H-109): two to four children take turns on a seesaw. The cushions of the children whose turn it is and whose
// comes next sit on its two seats (with two children always the fox's left and the bear's right; with three or four the
// seat that just touched down takes the cushion of the child after next, each with its photo or name). The seat of the child whose turn it is starts up high and sinks slowly the whole turn long until it touches
// down on its tyre – then the turn is over and the other seat, now up high, sinks. What tips it is a chick walking along
// the plank: it starts beside the low seat and walks over to the high one, and as its weight moves the plank tips evenly
// with it (user request, 21 November 2026: the toy riding on the seat looked odd, and on a long turn the slow tilt alone
// did not show that anything moved). Its steps go on at their own pace however long the turn is, so even at ten minutes
// a child sees the seesaw at work; when the seat touches down it turns round and walks back. So the time and whose turn
// it is are one motion, seen from afar, and the waiting child sees its own seat rising towards its turn. The plank turns
// as one HTML layer round the pivot (one CSS animation as long as the turn, back and forth for ever); the chick walks in
// that layer by another one as long, and turns back the same way, so it stays upright.

/** The grass's top, where the tyres lie half buried and the stand stands. */
export const SAW_GROUND = 702;

/**
 * The pivot the plank turns round, at the plank's middle line; the plank's thickness; the seats' middles' distance from
 * the pivot; the plank's half length. Big and steep (user request, 21 November 2026: a bigger board, so the motion is
 * bigger and plainer): the seats as far apart as a tablet's 4:3 cut allows, the pivot high, so they travel far.
 */
export const SAW = { x: 800, y: 454, thick: 44, seat: 450, half: 494 } as const;

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
export const SEAT_CUSHION_W = 180;

/** The chick walking on the plank: its box (its feet at the box's bottom, on the plank) and how far from the pivot it walks each way, between the cushions. */
export const WALKER = { w: 150, h: 160, reach: 280 } as const;

/** The plank's layer, in stage units while it lies level: the pivot in its middle, the chick inside it. */
export const PLANK_BOX = { x: SAW.x - 500, y: SAW.y - 230, w: 1000, h: 460 } as const;

/** The stand under the pivot. */
const STAND = { x: SAW.x - 170, y: SAW.y - 40, w: 340, h: SAW_GROUND + 14 - (SAW.y - 40) } as const;

/** The plank's angle with `kind`'s seat up high, as a turn of that child starts: clockwise lifts the left (the fox's) end. */
const upFor = (kind: Holder) => (kind === "fox" ? SAW_TILT : -SAW_TILT);

/** One tyre half buried in the ground, its top at `TYRE_TOP`. */
function Tyre({ x }: { x: number }) {
  const rx = 78;
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
        <ellipse cx={SAW.x} cy={SAW_GROUND + 40} rx="620" ry="58" fill="#ffe8a3" />
        <Tyre x={TYRE_X.fox} />
        <Tyre x={TYRE_X.bear} />
      </svg>
    </Layer>
  );
});

/**
 * Warm sunlight on the half of the playground whose child has the turn, the other half lying in shade (`SwapShade`):
 * whose turn it is, seen from across the room (user feedback, 21 November 2026: it had to be plainer). Fades in and out
 * as a whole (`opacity`).
 */
export function SeesawSun({ kind, on }: { kind: Holder; on: boolean }) {
  return <Layer x={kind === "fox" ? 0 : SAW.x} y={0} w={STAGE_W - SAW.x} h={STAGE_H} className={`tm-saw-sun tm-saw-sun-${kind}${on ? " tm-on" : ""}`} />;
}

/** A handle to hold on to in front of a seat, towards the middle: a post with a round bar on top. */
function Handle({ x }: { x: number }) {
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d={`M${x} ${PLANK_TOP} V${PLANK_TOP - 84}`} stroke={INK} strokeWidth="20" />
      <path d={`M${x} ${PLANK_TOP} V${PLANK_TOP - 84}`} stroke="#f59f00" strokeWidth="10" />
      <rect x={x - 30} y={PLANK_TOP - 100} width="60" height="22" rx="11" fill="#f59f00" stroke={INK} strokeWidth="5" />
    </g>
  );
}

/** Which child's cushion sits on each seat: the left one (the fox's side) and the right one (the bear's). */
export type SeatKids = Record<Holder, TurnChild>;

/** The seats with two children: the fox's left, the bear's right. A constant, so the plank isn't drawn again each second. */
export const TWO_SEATS: SeatKids = { fox: "fox", bear: "bear" };
const NO_PLAYERS: Players = {};

/**
 * The plank with its handles, the cushions on its seats and the hub it turns on, lying level; drawn once (again only
 * when a seat's cushion changes) and turned as a whole.
 */
const PlankDrawing = memo(function PlankDrawing({ seats, players }: { seats: SeatKids; players: Players }) {
  const B = PLANK_BOX;
  return (
    <svg viewBox={`${B.x} ${B.y} ${B.w} ${B.h}`}>
      <rect x={SAW.x - SAW.half} y={PLANK_TOP} width={SAW.half * 2} height={SAW.thick} rx="16" fill="#d9844a" stroke={INK} strokeWidth="6" />
      <path
        d={`M${SAW.x - SAW.half + 30} ${SAW.y - 6} H${SAW.x - 44} M${SAW.x + 44} ${SAW.y + 6} H${SAW.x + SAW.half - 30}`}
        stroke="#b8642f"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <Handle x={SAW.x - SAW.seat + 120} />
      <Handle x={SAW.x + SAW.seat - 120} />
      <Cushion kind={seats.fox} x={SAW.x - SAW.seat} y={PLANK_TOP + 4} w={SEAT_CUSHION_W} look={players[seats.fox]} />
      <Cushion kind={seats.bear} x={SAW.x + SAW.seat} y={PLANK_TOP + 4} w={SEAT_CUSHION_W} look={players[seats.bear]} />
      <circle cx={SAW.x} cy={SAW.y} r="30" fill="#ffd43b" stroke={INK} strokeWidth="6" />
      <circle cx={SAW.x} cy={SAW.y} r="9" fill={INK} />
    </svg>
  );
});

/** The stand under the pivot, behind the plank; drawn once. */
export const SeesawStand = memo(function SeesawStand() {
  const S = STAND;
  return (
    <Layer x={S.x} y={S.y} w={S.w} h={S.h}>
      <svg viewBox={`${S.x} ${S.y} ${S.w} ${S.h}`}>
        <g strokeLinejoin="round" strokeLinecap="round">
          <path d={`M${SAW.x - 130} ${SAW_GROUND + 6} L${SAW.x} ${SAW.y} L${SAW.x + 130} ${SAW_GROUND + 6}`} fill="none" stroke={INK} strokeWidth="34" />
          <path d={`M${SAW.x - 130} ${SAW_GROUND + 6} L${SAW.x} ${SAW.y} L${SAW.x + 130} ${SAW_GROUND + 6}`} fill="none" stroke="#e03131" strokeWidth="23" />
          <path d={`M${SAW.x - 74} ${SAW.y + 120} H${SAW.x + 74}`} stroke={INK} strokeWidth="20" />
          <path d={`M${SAW.x - 74} ${SAW.y + 120} H${SAW.x + 74}`} stroke="#e03131" strokeWidth="10" />
        </g>
      </svg>
    </Layer>
  );
});

/** One of the chick's legs with its three toes, a little layer of its own that swings round the hip as it steps. */
function ChickLeg({ x, far }: { x: number; far?: boolean }) {
  const W = WALKER;
  const top = 112;
  return (
    <div
      className={`tm-saw-leg${far ? " tm-saw-leg-far" : ""}`}
      style={{ left: `${((x - 20) / W.w) * 100}%`, top: `${(top / W.h) * 100}%`, width: `${(40 / W.w) * 100}%`, height: `${((W.h - top) / W.h) * 100}%` }}
    >
      <svg viewBox={`0 0 40 ${W.h - top}`}>
        <g fill="none" stroke={far ? "#e8590c" : "#fd7e14"} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 4 V40" />
          <path d="M6 46 L20 40 L34 46 M20 40 L24 46" />
        </g>
      </svg>
    </div>
  );
}

/** The chick, seen from the side looking right: a round yellow body and head, a little wing, an orange beak; its legs below. */
const Chick = memo(function Chick() {
  const W = WALKER;
  return (
    <>
      <ChickLeg x={60} far />
      <div className="tm-saw-chick-body">
        <svg viewBox={`0 0 ${W.w} ${W.h}`}>
          <g stroke={INK} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M18 92 L2 80 L14 104 Z" fill="#fcc419" />
            <ellipse cx="66" cy="98" rx="56" ry="44" fill="#ffd43b" />
            <circle cx="102" cy="54" r="34" fill="#ffd43b" />
            <path d="M88 22 C90 10 98 8 100 18 C104 8 112 10 110 22" fill="none" />
            <path d="M132 48 L150 56 L132 64 Z" fill="#fd7e14" />
            <path d="M38 96 C52 118 86 118 92 96 C80 104 54 104 38 96 Z" fill="#fcc419" />
          </g>
          <circle cx="112" cy="48" r="6.5" fill={INK} />
          <circle cx="114" cy="46" r="2.2" fill="#fff" />
          <ellipse cx="108" cy="68" rx="9" ry="6" fill="#ffa8a8" opacity="0.7" />
        </svg>
      </div>
      <ChickLeg x={82} />
    </>
  );
});

/**
 * The seesaw: its plank with the cushions, tipped by the chick walking on it.
 * - Before the turns run (`running` false) it lies tipped with `holder`'s seat up high and the chick standing still
 *   beside the other, low seat, ready to walk over.
 * - While they run it goes back and forth for ever, one turn each way (`turnMs`), from `startedAt` on: the first
 *   child's seat sinking first (`first`), the chick walking towards it. `round` is a new number whenever the turns start
 *   anew, so the animations do.
 * - At the end (`level`) it lies level, the chick standing in the middle.
 */
export function Seesaw({
  holder,
  running,
  first,
  turnMs,
  startedAt,
  round,
  level = false,
  seats = TWO_SEATS,
  players = NO_PLAYERS,
}: {
  /** The side whose seat sinks in this turn (the fox's left, the bear's right). */
  holder: Holder;
  running: boolean;
  first: Holder;
  turnMs: number;
  startedAt: number;
  round: number;
  level?: boolean;
  /** The children whose cushions sit on the seats. */
  seats?: SeatKids;
  /** Their photos and names. */
  players?: Players;
}) {
  const B = PLANK_BOX;
  const W = WALKER;
  const rest = level ? 0 : upFor(holder);
  // Before its turn's walk the chick stands beside the low seat, the other child's.
  const restAt = level ? 0 : holder === "fox" ? W.reach : -W.reach;
  // A page coming back (a phone waking, a tab shown again) starts the motion anew from the clock: while hidden the
  // animations' own time may have stood still while the turns ran on (seen in the preview: the seat sinking was the
  // waiting child's).
  const [wake, setWake] = useState(0);
  useEffect(() => {
    const onVisible = () => document.visibilityState === "visible" && setWake((n) => n + 1);
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);
  // The animations' delay is read once as the turns start to run, never again at the renders every second after: a
  // delay changed on a running animation moves it.
  const clock = useRunClock();
  const anchor = useRef({ key: "", delay: 0 });
  const key = `${round}-${wake}-${running}-${startedAt}`;
  if (anchor.current.key !== key) anchor.current = { key, delay: startedAt - clock.now() };
  const name = running ? ` tm-saw-${(round + wake) % 2 ? "b" : "a"}` : "";
  const style = {
    transformOrigin: `${((SAW.x - B.x) / B.w) * 100}% ${((SAW.y - B.y) / B.h) * 100}%`,
    "--tm-tilt": `${SAW_TILT}deg`,
    "--tm-reach": `${(W.reach / W.w) * 100}%`,
    "--tm-ms": `${turnMs}ms`,
    "--tm-delay": `${anchor.current.delay}ms`,
    "--tm-saw-dir": first === "fox" ? "alternate" : "alternate-reverse",
  } as CSSProperties;
  return (
    <Layer x={B.x} y={B.y} w={B.w} h={B.h} className={`tm-saw tm-move${name}`} style={{ ...style, transform: running ? undefined : `rotate(${rest}deg)` }}>
      <PlankDrawing seats={seats} players={players} />
      <div
        className="tm-saw-walker"
        style={{
          left: `${((SAW.x - W.w / 2 - B.x) / B.w) * 100}%`,
          top: `${((PLANK_TOP - W.h - B.y) / B.h) * 100}%`,
          width: `${(W.w / B.w) * 100}%`,
          height: `${(W.h / B.h) * 100}%`,
        }}
      >
        <div className={`tm-saw-walk${name}`} style={running ? undefined : { transform: `translateX(${(restAt / W.w) * 100}%)` }}>
          <div className={`tm-saw-upright${name}`} style={running ? undefined : { transform: `rotate(${-rest}deg)` }}>
            {/* It looks the way it walks: towards the seat of the child whose turn it is. */}
            <div className={`tm-saw-face${running ? " tm-saw-walking" : ""}`} style={{ transform: holder === "fox" && !level ? "scaleX(-1)" : undefined }}>
              <Chick />
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
