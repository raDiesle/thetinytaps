import { memo, useState, type CSSProperties } from "react";
import { MASCOT_COLORS, Mascot } from "@/components/Mascot";
import { INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";
import type { Holder } from "./swap";

// Tennis (user request, November 2026): another way of taking turns. The fox child and the bear child stand on a
// tennis court, the net between them. The child whose turn it is bounces the ball on its racket, a little hop each
// second, while its side lies in the light and the other side in soft shade. When the turn is over it hits the ball,
// which flies slowly in a high arc over the net to the other child – the shade changes sides as the ball crosses the
// net, so the bright side is always the one with the ball. A board on the fence has a row of lights that go out one by
// one over the turn, so the child sees how long it still has. The children are the app's shared `Mascot`, standing
// still; only the ball and the rackets move, each a small layer of its own.

/** The court: where the children's feet stand, the net's middle, and the floor the ball waits on before the first turn. */
export const COURT = { floor: 770, net: STAGE_W / 2 } as const;

/** The two children: the middles of where they stand (the same way either side of the net) and their size in `Mascot`'s 200 × 300 box. */
export const PLAYERS = { fox: 440, bear: 1160, scale: 1.5 } as const;

/** A child's figure as a box on the stage. */
export function playerBox(kind: Holder) {
  const w = 200 * PLAYERS.scale;
  const h = 300 * PLAYERS.scale;
  return { x: PLAYERS[kind] - w / 2, y: COURT.floor - h, w, h };
}

/**
 * The paw holding the racket, on the side towards the net: the arm hanging at `Mascot`'s (46, 238), the fox drawn
 * mirrored so its tail is away from the net and that paw on its right.
 */
export function paw(kind: Holder): [number, number] {
  const box = playerBox(kind);
  const x = kind === "fox" ? 200 - 46 : 46;
  return [box.x + x * PLAYERS.scale, box.y + 238 * PLAYERS.scale];
}

/** The racket, drawn up from its grip: how far it leans towards the net, its handle and its oval head. */
export const RACKET = { tilt: 35, handle: 78, head: 150, rx: 48, ry: 62 } as const;

/** The racket's layer round its grip (`grip` inside it), large enough for its head leaning over. */
const RACKET_BOX = { w: 200, h: 220, grip: { x: 30, y: 200 } } as const;

/** Where the middle of a child's racket head is on the stage. */
export function racketHead(kind: Holder): [number, number] {
  const [x, y] = paw(kind);
  const a = (RACKET.tilt * Math.PI) / 180;
  const side = kind === "fox" ? 1 : -1;
  return [x + side * RACKET.head * Math.sin(a), y - RACKET.head * Math.cos(a)];
}

/**
 * The ball: its radius, the height of its middle as it touches the racket, how high it hops each second, how high it
 * flies over the net (its arc above the line between the rackets), and where it lies at the net's foot while the
 * lights draw who begins.
 */
export const BALL = { r: 32, contact: 470, hop: 150, arc: 190, waiting: { x: COURT.net, y: 786 } } as const;

/** How long the ball flies from one racket to the other: slow, so a child follows it over the net. */
export const FLIGHT_MS = 2400;

/** The board on the fence: its place, and how many lights on it go out one by one over a turn. */
export const BOARD = { x: 520, y: 128, w: 560, h: 96, lights: 10 } as const;

/** The net: its two posts and how high it stands, as a narrow panel of mesh seen from the side. */
export const NET = { left: 764, right: 836, top: 598, slant: 18, bottom: 812 } as const;

const FENCE_TOP = 330;
const COURT_TOP = 620;

/** One light's middle on the board, the first one going out being the rightmost. */
function lightAt(i: number) {
  const gap = BOARD.w / BOARD.lights;
  return { x: BOARD.x + BOARD.w - gap * (i + 0.5), y: BOARD.y + BOARD.h / 2 + 4, r: 21 };
}

/** The sky, the dark green fence with the board on it, the court with its lines, and the net; drawn once. */
export const TennisBackdrop = memo(function TennisBackdrop() {
  const n = NET;
  const mesh: string[] = [];
  for (let x = n.left + 8; x < n.right; x += 12) mesh.push(`M${x} ${n.top - ((x - n.left) / (n.right - n.left)) * n.slant + 10} V${n.bottom - 4}`);
  for (let y = n.top + 22; y < n.bottom; y += 14) mesh.push(`M${n.left} ${y} L${n.right} ${y - n.slant}`);
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="none">
        <rect width={STAGE_W} height={STAGE_H} fill="#cfe9ff" />
        {/* Trees behind the fence. */}
        {[120, 300, 1300, 1480].map((x, i) => (
          <circle key={x} cx={x} cy={FENCE_TOP - 10 + (i % 2) * 20} r={110} fill={i % 2 ? "#69b578" : "#5aa66b"} />
        ))}
        {/* The board on its two posts, behind the fence's top. */}
        <path
          d={`M${BOARD.x + 90} ${BOARD.y + BOARD.h} V${FENCE_TOP + 20} M${BOARD.x + BOARD.w - 90} ${BOARD.y + BOARD.h} V${FENCE_TOP + 20}`}
          stroke={INK}
          strokeWidth="26"
        />
        <path
          d={`M${BOARD.x + 90} ${BOARD.y + BOARD.h} V${FENCE_TOP + 20} M${BOARD.x + BOARD.w - 90} ${BOARD.y + BOARD.h} V${FENCE_TOP + 20}`}
          stroke="#868e96"
          strokeWidth="16"
        />
        <rect x={BOARD.x} y={BOARD.y} width={BOARD.w} height={BOARD.h} rx="22" fill="#1f4d33" stroke={INK} strokeWidth="6" />
        <rect x={BOARD.x + 10} y={BOARD.y + 10} width={BOARD.w - 20} height={BOARD.h - 20} rx="14" fill="none" stroke="#f8f9fa" strokeWidth="4" opacity="0.7" />
        {/* The lights' sockets, seen where a light has gone out. */}
        {Array.from({ length: BOARD.lights }, (_, i) => {
          const l = lightAt(i);
          return <circle key={i} cx={l.x} cy={l.y} r={l.r} fill="#163a26" stroke="#0e2a1b" strokeWidth="3" />;
        })}
        {/* The fence: a dark green windscreen with its posts. */}
        <rect y={FENCE_TOP} width={STAGE_W} height={COURT_TOP - FENCE_TOP + 10} fill="#2f6b47" />
        <path d={`M0 ${FENCE_TOP} H${STAGE_W}`} stroke="#1f4d33" strokeWidth="10" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${i * 200} ${FENCE_TOP - 8} V${COURT_TOP}`} stroke="#1f4d33" strokeWidth="12" />
        ))}
        {/* The ground round the court, and the court with its white lines. */}
        <rect y={COURT_TOP} width={STAGE_W} height={STAGE_H - COURT_TOP} fill="#6fbf73" />
        <path d={`M110 ${COURT_TOP + 20} H1490 L1580 ${STAGE_H - 30} H20 Z`} fill="#4c8fd6" />
        <path
          d={`M150 ${COURT_TOP + 38} H1450 L1520 ${STAGE_H - 50} H80 Z M180 ${COURT_TOP + 38} L120 ${STAGE_H - 50} M1420 ${COURT_TOP + 38} L1480 ${STAGE_H - 50} M260 ${COURT_TOP + 140} H1340`}
          fill="none"
          stroke="#f8f9fa"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        {/* The net: its shadow, the mesh, the white band on top and the two posts. */}
        <path d={`M${n.left} ${n.bottom + 6} L${n.right + 60} ${n.bottom - n.slant + 2}`} stroke="#000" strokeWidth="14" opacity="0.12" />
        <path d={`M${n.left} ${n.top} L${n.right} ${n.top - n.slant} V${n.bottom - n.slant} L${n.left} ${n.bottom} Z`} fill="#f8f9fa" opacity="0.18" />
        <path d={mesh.join(" ")} stroke="#343a40" strokeWidth="2.5" opacity="0.75" />
        <path d={`M${n.left} ${n.top + 6} L${n.right} ${n.top - n.slant + 6}`} stroke={INK} strokeWidth="18" strokeLinecap="round" />
        <path d={`M${n.left} ${n.top + 6} L${n.right} ${n.top - n.slant + 6}`} stroke="#f8f9fa" strokeWidth="12" strokeLinecap="round" />
        {[
          [n.left, n.top - 6, n.bottom],
          [n.right, n.top - n.slant - 6, n.bottom - n.slant],
        ].map(([x, top, bottom]) => (
          <g key={x}>
            <path d={`M${x} ${top} V${bottom}`} stroke={INK} strokeWidth="18" strokeLinecap="round" />
            <path d={`M${x} ${top} V${bottom}`} stroke="#adb5bd" strokeWidth="10" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    </Layer>
  );
});

/** The two children with their rackets in hand, standing still; drawn once. */
export const TennisPlayers = memo(function TennisPlayers() {
  return (
    <>
      {(["fox", "bear"] as const).map((kind) => {
        const box = playerBox(kind);
        return (
          <Layer key={kind} {...box} className="tm-tennis-player" style={kind === "fox" ? { transform: "scaleX(-1)" } : undefined}>
            <Mascot kind={kind} child />
          </Layer>
        );
      })}
    </>
  );
});

/** A racket in its owner's colours, drawn up from its grip at (0, 0): handle, throat, oval head with strings. */
function RacketDrawing({ kind }: { kind: Holder }) {
  const { handle, head, rx, ry } = RACKET;
  const frame = kind === "fox" ? "#f08c00" : MASCOT_COLORS.bear.shade;
  const strings: string[] = [];
  for (let x = -rx + 12; x < rx - 6; x += 12) {
    const h = ry * Math.sqrt(1 - (x / rx) ** 2);
    strings.push(`M${x} ${-head - h} V${-head + h}`);
  }
  for (let y = -ry + 12; y < ry - 6; y += 12) {
    const w = rx * Math.sqrt(1 - (y / ry) ** 2);
    strings.push(`M${-w} ${-head + y} H${w}`);
  }
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="0" cy={-head} rx={rx} ry={ry} fill="#fff" opacity="0.25" />
      <path d={strings.join(" ")} stroke="#ced4da" strokeWidth="2.5" />
      <path d={`M0 ${-handle + 6} L-30 ${-head + ry - 6} M0 ${-handle + 6} L30 ${-head + ry - 6}`} stroke={INK} strokeWidth="16" />
      <path d={`M0 ${-handle + 6} L-30 ${-head + ry - 6} M0 ${-handle + 6} L30 ${-head + ry - 6}`} stroke={frame} strokeWidth="9" />
      <ellipse cx="0" cy={-head} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth="19" />
      <ellipse cx="0" cy={-head} rx={rx} ry={ry} fill="none" stroke={frame} strokeWidth="11" />
      <rect x="-10" y={-handle} width="20" height={handle + 8} rx="8" fill="#495057" stroke={INK} strokeWidth="4" />
      <path
        d={`M-9 ${-handle + 20} L9 ${-handle + 8} M-9 ${-handle + 42} L9 ${-handle + 30} M-9 ${-handle + 64} L9 ${-handle + 52}`}
        stroke="#868e96"
        strokeWidth="3"
      />
    </g>
  );
}

/**
 * A child's racket, a small layer of its own turning at its grip: the one whose turn it is flicks it up each time the
 * ball lands on it (`bouncing`), the one who has just hit the ball over swings it through (`swing`, keyed by the hop).
 * It lies behind the child, so the paw holds its handle.
 */
export function Racket({ kind, bouncing, swing }: { kind: Holder; bouncing: boolean; swing: number }) {
  const [x, y] = paw(kind);
  const { w, h, grip } = RACKET_BOX;
  const gx = kind === "fox" ? grip.x : w - grip.x;
  const state = swing > 0 ? " tm-racket-swing" : bouncing ? " tm-racket-bounce" : "";
  return (
    <Layer
      key={`${kind}-${swing}`}
      x={x - gx}
      y={y - grip.y}
      w={w}
      h={h}
      className={`tm-racket tm-racket-${kind}${state}`}
      style={{ transformOrigin: `${(gx / w) * 100}% ${(grip.y / h) * 100}%` }}
    >
      <svg viewBox={`0 0 ${w} ${h}`}>
        <g transform={`translate(${gx} ${grip.y}) rotate(${kind === "fox" ? RACKET.tilt : -RACKET.tilt})`}>
          <RacketDrawing kind={kind} />
        </g>
      </svg>
    </Layer>
  );
}

/** Where the ball is: on a child's racket, or at the net's foot while the lights draw who begins. */
export type BallPlace = Holder | "middle";

/** The ball's middle on the stage at a place. */
export function ballAt(place: BallPlace): [number, number] {
  return place === "middle" ? [BALL.waiting.x, BALL.waiting.y] : [racketHead(place)[0], BALL.contact];
}

/**
 * The ball. It travels from place to place by `transform` (a CSS transition as long as its flight), rises and falls in
 * a high arc on its way (`hop`, a new number for every flight) and, once on a racket, hops up from it once a second
 * until the next flight.
 */
export function Ball({ place, hop }: { place: BallPlace; hop: number }) {
  const { r } = BALL;
  const [hx, hy] = ballAt("fox");
  const [x, y] = ballAt(place);
  const d = 2 * r;
  return (
    <Layer x={hx - r} y={hy - r} w={d} h={d} className="tm-ball tm-move" style={{ transform: `translate(${((x - hx) / d) * 100}%, ${((y - hy) / d) * 100}%)` }}>
      <div key={hop} className={hop ? "tm-ball-arc" : undefined}>
        <div className={place === "middle" ? undefined : "tm-ball-bounce"}>
          <svg viewBox={`${-r - 3} ${-r - 3} ${d + 6} ${d + 6}`}>
            <circle r={r} fill="#d8ec3c" stroke={INK} strokeWidth="4" />
            <path
              d={`M${-r + 6} ${-r / 2} C${-r / 3} ${-r / 4} ${-r / 3} ${r / 4} ${-r + 6} ${r / 2}`}
              fill="none"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d={`M${r - 6} ${-r / 2} C${r / 3} ${-r / 4} ${r / 3} ${r / 4} ${r - 6} ${r / 2}`}
              fill="none"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <ellipse cx={-r / 3} cy={-r / 2} rx={r / 4} ry={r / 6} fill="#fff" opacity="0.45" />
          </svg>
        </div>
      </div>
    </Layer>
  );
}

/**
 * The board's lights for one turn: each goes out over its share of the turn, the rightmost first, from `startedAt` on,
 * so it shows the turn's real time even when drawn later (a phone waking up) – give each turn its own `key`. While
 * `waiting` (the lights still draw who begins) they all shine. A tap lights the ones still on (H-51).
 */
export function TennisBoard({ ms, startedAt, waiting, glow }: { ms: number; startedAt: number; waiting: boolean; glow: number }) {
  const [delay] = useState(() => (waiting ? 0 : Math.max(0, Date.now() - startedAt)));
  return (
    <Layer
      x={BOARD.x}
      y={BOARD.y}
      w={BOARD.w}
      h={BOARD.h}
      className={`tm-tennis-board${waiting ? " tm-wait" : ""}`}
      style={{ "--tm-ms": `${ms}ms`, "--tm-delay": `${-delay}ms`, "--tm-lights": BOARD.lights } as CSSProperties}
    >
      {Array.from({ length: BOARD.lights }, (_, i) => {
        const l = lightAt(i);
        return (
          <div
            key={i}
            className="tm-tennis-light"
            style={
              {
                left: `${((l.x - l.r - BOARD.x) / BOARD.w) * 100}%`,
                top: `${((l.y - l.r - BOARD.y) / BOARD.h) * 100}%`,
                width: `${((2 * l.r) / BOARD.w) * 100}%`,
                height: `${((2 * l.r) / BOARD.h) * 100}%`,
                "--tm-i": i,
              } as CSSProperties
            }
          >
            <LeftGlow n={glow} />
          </div>
        );
      })}
    </Layer>
  );
}

/** The CSS variables of the tennis picture's stage: how long the ball flies, how high, and when it crosses the net. */
export function tennisStyle(): CSSProperties {
  const d = 2 * BALL.r;
  return {
    "--tm-flight": `${FLIGHT_MS}ms`,
    "--tm-cross": `${FLIGHT_MS / 2}ms`,
    "--tm-arc": `${(-BALL.arc / d) * 100}%`,
    "--tm-hop": `${(-BALL.hop / d) * 100}%`,
  } as CSSProperties;
}
