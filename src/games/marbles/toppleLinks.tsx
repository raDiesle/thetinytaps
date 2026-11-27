// The links of „Alles fällt um“ drawn: each in its own units (x from its left edge, the floor at y = 0), posed by
// `topple.ts` for the seconds since it was hit.

import { decay } from "./level";
import { lerp } from "./machineKit";
import {
  BALLOON,
  type BalloonLink,
  BENCH,
  type BenchLink,
  BOARD,
  BOAT,
  BOLSTER_R,
  type ChairLink,
  EGG,
  FAN,
  type FanLink,
  HOPPER_R,
  type HopperLink,
  type Link,
  POUF,
  RAMP,
  ROLY,
  type SkateLink,
  SPRIT,
  STOOL,
  TEDDY,
  TENT,
  TUNNEL,
} from "./topple";

const INK = "#2a1e5c";
const LINE = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** One link at `age` seconds after it was hit (0 before), at `left` in the row. */
export function LinkArt({ link, left, age }: { link: Link; left: number; age: number }) {
  return (
    <g transform={`translate(${left} 0)`}>
      {link.kind === "bench" && <Bench link={link} age={age} />}
      {link.kind === "hopper" && <Hopper link={link} age={age} />}
      {link.kind === "balloon" && <Balloon link={link} age={age} />}
      {link.kind === "skate" && <Skate link={link} age={age} />}
      {link.kind === "fan" && <Fan link={link} age={age} />}
      {link.kind === "chair" && <Chair link={link} age={age} />}
    </g>
  );
}

function Bench({ link, age }: { link: BenchLink; age: number }) {
  const { bolster, spin, press, tent, jolt } = link.pose(age);
  const { w, h, seat } = BENCH;
  const tentW = lerp(150, TENT.w, tent);
  const tentH = lerp(TENT.flat - 8 * press, TENT.h, tent);
  const sway = tent > 0 ? 1 + 0.06 * decay((age - link.hitAt + 1.4) * 4) * Math.sin((age - link.hitAt + 1.4) * 22) : 1;
  return (
    <g>
      <g transform={`translate(${jolt} 0)`}>
        {[30, w - 50].map((x) => (
          <rect key={x} x={x} y={-h + seat} width="20" height={h - seat} fill="#a86b35" {...LINE} />
        ))}
        <rect x="0" y={-h} width={w} height={seat} rx="6" fill="#c98b4f" {...LINE} />
        <line x1="14" y1={-h + 7} x2={w - 14} y2={-h + 7} stroke="#e0a868" strokeWidth="3" />
      </g>
      <g transform={`translate(${link.tentX} 0) scale(1 ${sway})`}>
        <path d={`M${-tentW / 2} 0 A ${tentW / 2} ${tentH} 0 0 1 ${tentW / 2} 0 Z`} fill="#ffb703" {...LINE} />
        {tent > 0.3 && (
          <>
            <path d={`M0 ${-tentH} Q ${-tentW * 0.22} ${-tentH * 0.5} ${-tentW * 0.18} 0`} fill="none" stroke="#e07a00" strokeWidth="3" />
            <path d={`M0 ${-tentH} Q ${tentW * 0.22} ${-tentH * 0.5} ${tentW * 0.18} 0`} fill="none" stroke="#e07a00" strokeWidth="3" />
            <path d={`M-26 0 Q 0 ${-tentH * 0.55} 26 0 Z`} fill="#7a4a00" opacity={tent} />
          </>
        )}
      </g>
      <g transform={`translate(${bolster.x} ${bolster.y}) rotate(${(spin * 180) / Math.PI})`}>
        <circle r={BOLSTER_R} fill="#7fc8f8" {...LINE} />
        <circle r={BOLSTER_R * 0.45} fill="#fff6e0" {...LINE} />
        <line x1={-BOLSTER_R} y1="0" x2={-BOLSTER_R * 0.45} y2="0" {...LINE} />
        <line x1={BOLSTER_R * 0.45} y1="0" x2={BOLSTER_R} y2="0" {...LINE} />
      </g>
    </g>
  );
}

function Hopper({ link, age }: { link: HopperLink; age: number }) {
  const { ball, squash, tilt } = link.pose(age);
  const r = HOPPER_R;
  const s = 0.18 * squash;
  return (
    <g transform={`translate(${ball.x} ${ball.y + r}) scale(${1 + s} ${1 - s}) rotate(${tilt} 0 ${-r}) translate(0 ${-r})`}>
      <path d={`M-30 ${-r + 10} q-10 -40 4 -46 q8 0 8 36 Z`} fill="#ff8c42" {...LINE} />
      <path d={`M30 ${-r + 10} q10 -40 -4 -46 q-8 0 -8 36 Z`} fill="#ff8c42" {...LINE} />
      <circle r={r} fill="#ff8c42" {...LINE} />
      <ellipse cx={-24} cy={-26} rx="14" ry="9" fill="#ffd2a8" />
      <circle cx="-16" cy="-6" r="6" fill={INK} />
      <circle cx="18" cy="-6" r="6" fill={INK} />
      <path d="M-14 18 Q 2 32 18 18" fill="none" {...LINE} />
      <ellipse cx="2" cy="6" rx="7" ry="5" fill="#c4572a" />
    </g>
  );
}

function Balloon({ link, age }: { link: BalloonLink; age: number }) {
  const { basket, bag, slack, tied, puff } = link.pose(age);
  const { rx, ry, basket: bw, basketH, lines, bag: bs } = BALLOON;
  const envelopeY = basket.y - basketH - lines - ry + 8;
  const rope = slack
    ? `M${basket.x} ${basket.y} Q ${(basket.x + bag.x) / 2 + 10} ${Math.max(basket.y, bag.y) + 30} ${bag.x} ${bag.y - bs / 2}`
    : `M${basket.x} ${basket.y} L${bag.x} ${bag.y - bs / 2}`;
  return (
    <g>
      <g transform={`translate(0 0) scale(1 ${1 - 0.1 * puff})`}>
        <rect x="0" y={-POUF.h} width={POUF.w} height={POUF.h} rx="22" fill="#8e7dff" {...LINE} />
        <path d={`M8 ${-POUF.h * 0.5} H${POUF.w - 8}`} stroke="#b3a8ff" strokeWidth="6" />
        <circle cx={POUF.w / 2} cy={-POUF.h * 0.5} r="6" fill="#b3a8ff" {...LINE} />
      </g>
      {tied && (
        <path
          d={`M${basket.x + bw / 2} ${basket.y - 8} Q ${POUF.w - 6} ${-POUF.h - 18} ${POUF.w - 10} ${-POUF.h + 4}`}
          fill="none"
          stroke="#ff5d73"
          strokeWidth="4"
        />
      )}
      <path d={rope} fill="none" stroke="#8a5a2b" strokeWidth="3" />
      <rect x={bag.x - bs / 2} y={bag.y - bs / 2} width={bs} height={bs + 2} rx="6" fill="#d9b38c" {...LINE} />
      <line x1={bag.x - 5} y1={bag.y - bs / 2 + 4} x2={bag.x + 5} y2={bag.y - bs / 2 + 4} {...LINE} />
      {[-1, 1].map((side) => (
        <line
          key={side}
          x1={basket.x + (side * bw) / 2}
          y1={basket.y - basketH}
          x2={basket.x + side * rx * 0.45}
          y2={envelopeY + ry * 0.85}
          stroke={INK}
          strokeWidth="2"
        />
      ))}
      <rect x={basket.x - bw / 2} y={basket.y - basketH} width={bw} height={basketH} rx="5" fill="#c98b4f" {...LINE} />
      <line x1={basket.x - bw / 2 + 4} y1={basket.y - basketH / 2} x2={basket.x + bw / 2 - 4} y2={basket.y - basketH / 2} stroke="#a86b35" strokeWidth="3" />
      <ellipse cx={basket.x} cy={envelopeY} rx={rx} ry={ry} fill="#ff5d73" {...LINE} />
      <path
        d={`M${basket.x} ${envelopeY - ry} C ${basket.x - rx * 0.55} ${envelopeY - ry * 0.4} ${basket.x - rx * 0.55} ${envelopeY + ry * 0.4} ${basket.x} ${envelopeY + ry}`}
        fill="#ffd23f"
        {...LINE}
      />
      <path
        d={`M${basket.x} ${envelopeY - ry} C ${basket.x + rx * 0.55} ${envelopeY - ry * 0.4} ${basket.x + rx * 0.55} ${envelopeY + ry * 0.4} ${basket.x} ${envelopeY + ry}`}
        fill="#ffd23f"
        {...LINE}
      />
      <ellipse cx={basket.x - rx * 0.55} cy={envelopeY - ry * 0.4} rx="9" ry="14" fill="#fff" opacity="0.5" />
    </g>
  );
}

function Skate({ link, age }: { link: SkateLink; age: number }) {
  const { roly, board, tilt } = link.pose(age);
  const { r, head } = ROLY;
  const { len, deck, wheel } = BOARD;
  const rampEnd = { x: link.rampX + RAMP.len * Math.cos(RAMP.angle), y: -RAMP.len * Math.sin(RAMP.angle) };
  return (
    <g>
      <g transform={`translate(${ROLY.x + r * roly} ${-r}) rotate(${(roly * 180) / Math.PI})`}>
        <circle r={r} fill="#ff5d73" {...LINE} />
        <path d={`M${-r * 0.7} ${-r * 0.3} Q 0 ${r * 0.25} ${r * 0.7} ${-r * 0.3}`} fill="none" stroke="#fff" strokeWidth="5" />
        <circle cy={-r - head + 8} r={head} fill="#ffe0c2" {...LINE} />
        <path d={`M${-head} ${-r - head} Q 0 ${-r - 2 * head - 26} ${head} ${-r - head} Z`} fill="#ff5d73" {...LINE} />
        <circle cx="-11" cy={-r - head + 6} r="4" fill={INK} />
        <circle cx="11" cy={-r - head + 6} r="4" fill={INK} />
        <path d={`M-8 ${-r - head + 20} Q 0 ${-r - head + 27} 8 ${-r - head + 20}`} fill="none" {...LINE} />
        <circle cx="-20" cy={-r - head + 16} r="5" fill="#ffadbb" />
        <circle cx="20" cy={-r - head + 16} r="5" fill="#ffadbb" />
      </g>
      <polygon points={`${link.rampX},0 ${rampEnd.x},${rampEnd.y} ${rampEnd.x},${rampEnd.y + 10} ${link.rampX + 10},0`} fill="#c98b4f" {...LINE} />
      <rect x={rampEnd.x - 70} y={rampEnd.y + 8} width="80" height={-rampEnd.y - 8} rx="4" fill="#4cc9f0" {...LINE} />
      <rect x={rampEnd.x - 74} y={rampEnd.y + 8} width="88" height="12" rx="4" fill="#3a86ff" {...LINE} />
      <g transform={`translate(${board.x} ${board.y}) rotate(${tilt})`}>
        <path
          d={`M${-len / 2 - 6} ${-deck / 2 - 16} Q ${-len / 2 + 4} ${-deck / 2} ${-len / 2 + 22} ${-deck / 2} H${len / 2 - 22} Q ${len / 2 - 4} ${-deck / 2} ${len / 2 + 2} ${-deck / 2 - 10} L${len / 2 - 2} ${deck / 2} H${-len / 2 + 18} Q ${-len / 2 - 2} ${deck / 2} ${-len / 2 - 10} ${-deck / 2 - 12} Z`}
          fill="#3ec300"
          {...LINE}
        />
        {[-len / 2 + 30, len / 2 - 30].map((x) => (
          <circle key={x} cx={x} cy={deck / 2 + wheel} r={wheel} fill="#ffd23f" {...LINE} />
        ))}
      </g>
      <g>
        <rect x={TUNNEL.x} y={-TUNNEL.h} width={TUNNEL.len} height={TUNNEL.h} rx="18" fill="#ff8c42" {...LINE} />
        {Array.from({ length: 5 }, (_, i) => (
          <path
            key={i}
            d={`M${TUNNEL.x + 30 + i * 60} ${-TUNNEL.h + 2} Q ${TUNNEL.x + 44 + i * 60} ${-TUNNEL.h / 2} ${TUNNEL.x + 30 + i * 60} -2`}
            fill="none"
            stroke="#e0662a"
            strokeWidth="4"
          />
        ))}
        <ellipse cx={TUNNEL.x + 6} cy={-TUNNEL.h / 2} rx="14" ry={TUNNEL.h / 2 - 4} fill="#7a3a12" {...LINE} />
        <ellipse cx={TUNNEL.x + TUNNEL.len - 6} cy={-TUNNEL.h / 2} rx="14" ry={TUNNEL.h / 2 - 4} fill="#ff8c42" {...LINE} />
      </g>
    </g>
  );
}

function Fan({ link, age }: { link: FanLink; age: number }) {
  const { blades, wind, boat, button } = link.pose(age);
  const top = -STOOL.h;
  const head = { x: FAN.x, y: top - 14 - FAN.neck - FAN.r * 0.6 };
  return (
    <g>
      {[14, STOOL.w - 34].map((x) => (
        <rect key={x} x={x} y={top + 14} width="20" height={STOOL.h - 14} fill="#a86b35" {...LINE} />
      ))}
      <rect x="0" y={top} width={STOOL.w} height="18" rx="6" fill="#c98b4f" {...LINE} />
      <rect x={-12 + 6 * button} y={top + 24} width="14" height="26" rx="5" fill="#ff5d73" {...LINE} />
      <ellipse cx={FAN.x} cy={top - 7} rx="38" ry="9" fill="#9aa5b1" {...LINE} />
      <rect x={FAN.x - 6} y={top - 14 - FAN.neck} width="12" height={FAN.neck} fill="#9aa5b1" {...LINE} />
      <g transform={`translate(${head.x} ${head.y}) scale(0.45 1)`}>
        <circle r={FAN.r} fill="#e8f4ff" stroke={INK} strokeWidth="5" />
        <g transform={`rotate(${blades})`}>
          {[0, 120, 240].map((a) => (
            <ellipse key={a} transform={`rotate(${a}) translate(0 ${-FAN.r * 0.48})`} rx="15" ry={FAN.r * 0.42} fill="#3a86ff" stroke={INK} strokeWidth="4" />
          ))}
        </g>
        <circle r="10" fill="#ffd23f" stroke={INK} strokeWidth="5" />
      </g>
      {wind > 0 &&
        [0, 1, 2].map((i) => {
          const run = (age * 260 + i * 130) % 390;
          const x = FAN.x + 40 + run;
          const y = head.y - 30 + i * 30;
          return (
            <path
              key={i}
              d={`M${x} ${y} q 20 -10 40 0 t 40 0`}
              fill="none"
              stroke="#9fd8ff"
              strokeWidth="5"
              strokeLinecap="round"
              opacity={wind * (1 - run / 390)}
            />
          );
        })}
      {!link.boatMoving(age) && <FanBoat link={link} boat={boat} wind={wind} />}
    </g>
  );
}

/** Where the middle of the fan's boat is, from its mast's foot: the sprite that carries it is centred there. */
export const BOAT_MID = { dx: 14, y: -BOAT.mast / 2 };
/** How far the boat reaches from its middle, in the link's units, with a margin – up to its bowsprit's tip too. */
export const boatPad = (link: FanLink) => Math.max(110, BOAT_MID.y - link.spritY + 12);

/**
 * The fan's toy boat with its mast at `boat` (link units, the floor at y = 0), its sail filled by `wind` (0–1). Drawn
 * in the link while it stands, and as a sprite of its own over the room while its sail fills or it rolls
 * (`FanLink.boatMoving`): rolling across the floor in the room's svg, it rastered its band while the fan's blades turned
 * high above it (perf, A-46).
 */
export function FanBoat({ link, boat, wind }: { link: FanLink; boat: number; wind: number }) {
  const { len, mast } = BOAT;
  const deckY = -44;
  const bow = boat + len / 2;
  const belly = 10 + 26 * wind;
  return (
    <g>
      <line x1={bow - 6} y1={deckY + 4} x2={bow + SPRIT} y2={link.spritY} {...LINE} strokeWidth={5} />
      <line x1={boat} y1={deckY} x2={boat} y2={-mast} {...LINE} strokeWidth={5} />
      <path
        d={`M${boat - 4} ${-mast + 8} Q ${boat - 60 + belly} ${(-mast + deckY) / 2} ${boat - 4} ${deckY - 8} L${boat - 70} ${deckY - 8} Z`}
        fill="#fff"
        {...LINE}
      />
      <path d={`M${boat} ${-mast} l 26 7 l -26 7 Z`} fill="#ff5d73" {...LINE} />
      <path d={`M${boat - len / 2} ${deckY} H${bow} L${bow - 18} -16 H${boat - len / 2 + 12} Z`} fill="#3a86ff" {...LINE} />
      <circle cx={boat - 20} cy={deckY + 12} r="5" fill="#fff" {...LINE} />
      <circle cx={boat + 10} cy={deckY + 12} r="5" fill="#fff" {...LINE} />
      {[boat - len / 2 + 26, bow - 30].map((x) => (
        <circle key={x} cx={x} cy={-9} r="9" fill="#ffd23f" {...LINE} />
      ))}
    </g>
  );
}

function Chair({ link, age }: { link: ChairLink; age: number }) {
  const { swing, teddy, free, roll } = link.pose(age);
  const { hook } = link;
  const centre = { x: EGG.x, y: EGG.bottom - EGG.h / 2 };
  const top = centre.y - EGG.h / 2;
  return (
    <g>
      <g transform={`rotate(${(-swing * 180) / Math.PI} ${hook.x} ${hook.y})`}>
        <line x1={hook.x} y1={hook.y} x2={centre.x} y2={top + 6} stroke="#8a5a2b" strokeWidth="6" />
        <ellipse cx={centre.x} cy={centre.y} rx={EGG.w / 2} ry={EGG.h / 2} fill="#e8c07d" {...LINE} />
        {[-0.5, 0, 0.5].map((k) => (
          <path
            key={k}
            d={`M${centre.x + (k * EGG.w) / 2} ${top + 10} Q ${centre.x + k * EGG.w * 0.7} ${centre.y} ${centre.x + (k * EGG.w) / 2} ${EGG.bottom - 10}`}
            fill="none"
            stroke="#c99a52"
            strokeWidth="3"
          />
        ))}
        <ellipse cx={centre.x + 8} cy={centre.y + 14} rx={EGG.w * 0.36} ry={EGG.h * 0.32} fill="#a8743a" {...LINE} />
        <ellipse cx={centre.x + 8} cy={centre.y + 50} rx={EGG.w * 0.32} ry="18" fill="#ffadbb" {...LINE} />
        {!free && <Teddy at={teddy} roll={0} />}
      </g>
      <circle cx={hook.x} cy={hook.y + 4} r="8" fill="#9aa5b1" {...LINE} />
      {free && <Teddy at={teddy} roll={roll} />}
    </g>
  );
}

/** A toy teddy, sitting. */
function Teddy({ at, roll }: { at: { x: number; y: number }; roll: number }) {
  const { w, h } = TEDDY;
  return (
    <g transform={`translate(${at.x} ${at.y}) rotate(${roll})`}>
      <ellipse cy={h * 0.18} rx={w * 0.42} ry={h * 0.3} fill="#c68a4a" {...LINE} />
      <circle cx={-w * 0.3} cy={-h * 0.3} r="8" fill="#c68a4a" {...LINE} />
      <circle cx={w * 0.3} cy={-h * 0.3} r="8" fill="#c68a4a" {...LINE} />
      <circle cy={-h * 0.14} r={w * 0.34} fill="#c68a4a" {...LINE} />
      <ellipse cy={-h * 0.06} rx="9" ry="7" fill="#f1d3a8" {...LINE} />
      <circle cx="-7" cy={-h * 0.2} r="3" fill={INK} />
      <circle cx="7" cy={-h * 0.2} r="3" fill={INK} />
      <circle cy={-h * 0.1} r="2.5" fill={INK} />
      <ellipse cx={-w * 0.3} cy={h * 0.42} rx="9" ry="6" fill="#c68a4a" {...LINE} />
      <ellipse cx={w * 0.3} cy={h * 0.42} rx="9" ry="6" fill="#c68a4a" {...LINE} />
    </g>
  );
}
