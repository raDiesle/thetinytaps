import type { CSSProperties } from "react";
import { nth } from "../shared";
import { Leaf } from "../weather";

// The two big autumn trees and a chestnut on the ground. Foot point at (0, 0).

type Blob = readonly [cx: number, cy: number, r: number, fill: string];

function Crown({ blobs, light }: { blobs: readonly Blob[]; light: string }) {
  return (
    <>
      {blobs.map(([cx, cy, r, fill]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={fill} />
      ))}
      {blobs.slice(0, 4).map(([cx, cy, r]) => (
        <ellipse key={`l${cx}-${cy}`} cx={cx - r * 0.3} cy={cy - r * 0.4} rx={r * 0.38} ry={r * 0.22} fill={light} opacity="0.55" />
      ))}
    </>
  );
}

/** A spiky green chestnut shell, centred on (x, y). */
function Shell({ x, y, r = 11 }: { x: number; y: number; r?: number }) {
  return (
    <>
      <path
        d={Array.from({ length: 10 }, (_, i) => {
          const a = (i * Math.PI) / 5;
          return `M${x + Math.cos(a) * r * 0.8} ${y + Math.sin(a) * r * 0.8} L${x + Math.cos(a) * r * 1.4} ${y + Math.sin(a) * r * 1.4}`;
        }).join(" ")}
        stroke="#55a630"
        strokeWidth={r * 0.18}
        strokeLinecap="round"
      />
      <circle cx={x} cy={y} r={r} fill="#80b918" />
      <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.3} fill="#fff" opacity="0.4" />
    </>
  );
}

const CHESTNUT_CROWN: Blob[] = [
  [0, -300, 140, "#e9c46a"],
  [-118, -250, 88, "#f4a261"],
  [122, -254, 92, "#e9b44c"],
  [-70, -384, 92, "#f6bd60"],
  [78, -380, 88, "#f4a261"],
  [6, -440, 66, "#e9c46a"],
  [-150, -330, 52, "#e9b44c"],
  [154, -336, 50, "#f6bd60"],
];

const HANGING = [
  [-92, -232],
  [58, -282],
  [112, -332],
  [-34, -366],
  [18, -222],
  [-130, -310],
];

/** The horse chestnut tree in yellow and orange: the crown shakes, chestnuts drop and leaves flutter down. */
export function Kastanienbaum() {
  return (
    <>
      <path d="M-30 0 Q-18 -90 -17 -176 H17 Q18 -90 32 0 Z" fill="#8d5a2b" />
      <path d="M8 -20 Q12 -90 10 -160" stroke="#a47148" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M-30 0 q-14 2 -22 8 M32 0 q14 2 24 8" stroke="#8d5a2b" strokeWidth="10" strokeLinecap="round" />
      <path d="M-14 -40 q-8 -6 -6 -14 M12 -100 q6 -6 4 -14" stroke="#6b4423" strokeWidth="3" strokeLinecap="round" fill="none" />
      <g className="he-kb-crown" style={{ transformOrigin: "0px -170px" }}>
        <path d="M-10 -168 L-64 -236 M10 -168 L72 -246 M0 -176 V-270" stroke="#7f5539" strokeWidth="14" strokeLinecap="round" />
        <Crown blobs={CHESTNUT_CROWN} light="#fff3b0" />
        {[
          [-40, -300, 30, 4],
          [80, -310, -40, 0],
          [-100, -276, 60, 1],
          [30, -420, 10, 4],
          [120, -260, -20, 1],
          [-60, -410, 80, 0],
        ].map(([x, y, a, c]) => (
          <Leaf key={`${x}-${y}`} x={x} y={y} angle={a} scale={2.4} colour={["#d68c45", "#bc6c25", "#e76f51", "#e9c46a", "#c97c2e"][c]} />
        ))}
        {HANGING.map(([x, y]) => (
          <Shell key={`${x}-${y}`} x={x} y={y} />
        ))}
      </g>
      <g className="he-kb-fall">
        {[
          [-92, -232],
          [58, -282],
          [18, -222],
        ].map(([x, y], i) => (
          <g key={x} className="he-kb-nut" style={{ ...nth(i), "--fall": `${-y - 12}px` } as CSSProperties}>
            <Shell x={x} y={y} r={12} />
          </g>
        ))}
      </g>
      <g className="he-kb-leaves">
        {[
          [-140, -240, "#f4a261"],
          [-40, -230, "#e9c46a"],
          [90, -230, "#bc6c25"],
          [150, -290, "#e76f51"],
          [-100, -330, "#e9c46a"],
        ].map(([x, y, c], i) => (
          <g key={i} className="he-kb-leaf" style={nth(i)}>
            <Leaf x={Number(x)} y={Number(y)} angle={i * 50} scale={2.6} colour={String(c)} />
          </g>
        ))}
      </g>
    </>
  );
}

const MAPLE_CROWN: Blob[] = [
  [0, -290, 132, "#e85d04"],
  [-112, -240, 82, "#d62828"],
  [114, -240, 86, "#dc2f02"],
  [-64, -370, 86, "#f48c06"],
  [70, -366, 84, "#e85d04"],
  [4, -420, 60, "#faa307"],
  [-140, -316, 48, "#f48c06"],
  [146, -320, 46, "#d62828"],
];

/** The red maple: the crown sways, leaves drop and the winged seeds spin down like little helicopters. */
export function Ahorn() {
  return (
    <>
      <path d="M-24 0 Q-14 -90 -14 -170 H14 Q14 -90 26 0 Z" fill="#6b4423" />
      <path d="M6 -16 Q10 -90 8 -150" stroke="#8d5a2b" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M-24 0 q-12 2 -18 7 M26 0 q12 2 20 7" stroke="#6b4423" strokeWidth="9" strokeLinecap="round" />
      {/* A little hole in the trunk */}
      <ellipse cx="2" cy="-96" rx="7" ry="10" fill="#3d2a17" />
      <g className="he-ahorn-crown" style={{ transformOrigin: "0px -160px" }}>
        <path d="M-8 -160 L-58 -226 M8 -160 L62 -232 M0 -168 V-260" stroke="#5c3d1e" strokeWidth="12" strokeLinecap="round" />
        <Crown blobs={MAPLE_CROWN} light="#ffd166" />
        {[
          [-50, -300, 20, "#9d0208"],
          [60, -320, -30, "#ffba08"],
          [-110, -250, 60, "#ffba08"],
          [100, -250, 10, "#9d0208"],
          [0, -400, -50, "#d00000"],
        ].map(([x, y, a, c]) => (
          <Leaf key={`${x}-${y}`} x={Number(x)} y={Number(y)} angle={Number(a)} scale={2.6} colour={String(c)} />
        ))}
      </g>
      <g className="he-ahorn-seeds">
        {[
          [-90, -210],
          [40, -220],
          [110, -260],
          [-20, -250],
        ].map(([x, y], i) => (
          <g key={x} className="he-ahorn-fall" style={{ ...nth(i), "--fall": `${-y - 20}px` } as CSSProperties}>
            <g className="he-ahorn-seed" style={{ transformOrigin: `${x}px ${y}px` }}>
              <path d={`M${x} ${y} q-6 -22 -24 -26 q-4 12 18 28 Z M${x} ${y} q6 -22 24 -26 q4 12 -18 28 Z`} fill="#c9a227" />
              <circle cx={x} cy={y} r="5" fill="#8d5a2b" />
            </g>
          </g>
        ))}
      </g>
      <g className="he-ahorn-leaves">
        {[
          [-120, -220, "#d62828"],
          [-30, -210, "#f48c06"],
          [80, -214, "#e85d04"],
          [140, -280, "#faa307"],
        ].map(([x, y, c], i) => (
          <g key={i} className="he-ahorn-leaf" style={nth(i)}>
            <Leaf x={Number(x)} y={Number(y)} angle={i * 60} scale={2.6} colour={String(c)} />
          </g>
        ))}
      </g>
    </>
  );
}

/** A chestnut lying in its spiky shell, which is a little open: it pops open, the chestnut hops out and back in. */
export function Kastanie() {
  const spikes = (s: 1 | -1) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (-80 + i * 32) * (Math.PI / 180);
      const x = s * Math.cos(a);
      const y = Math.sin(a);
      return `M${x * 26} ${-32 + y * 26} L${x * 38} ${-32 + y * 38}`;
    }).join(" ");
  return (
    <>
      <g className="he-kastanie-nut" style={{ transformOrigin: "0px -30px" }}>
        <ellipse cx="0" cy="-30" rx="21" ry="19" fill="#7f4f24" />
        <path d="M-17 -20 Q0 -10 17 -20 Q12 -12 0 -12 Q-12 -12 -17 -20 Z" fill="#e6ccb2" />
        <ellipse cx="-7" cy="-40" rx="7" ry="4" fill="#fff" opacity="0.5" />
      </g>
      {([-1, 1] as const).map((s) => (
        <g key={s} className="he-kastanie-half" style={{ transformOrigin: `${s * 4}px -4px`, "--s": s } as CSSProperties}>
          <g transform={`rotate(${s * 14} ${s * 4} -4)`}>
            <path d={spikes(s)} stroke="#55a630" strokeWidth="4" strokeLinecap="round" />
            <path d={`M0 -2 A30 30 0 0 ${s < 0 ? 1 : 0} 0 -62 Q${s * 8} -32 0 -2 Z`} fill="#80b918" />
            <path d={`M${s * 10} -50 q${s * 10} 8 ${s * 12} 22`} stroke="#fff" strokeOpacity="0.45" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
        </g>
      ))}
      <g className="he-kastanie-sparkle" fill="#ffd60a">
        <circle cx="-34" cy="-70" r="4" style={nth(0)} />
        <circle cx="30" cy="-78" r="5" style={nth(1)} />
        <circle cx="4" cy="-90" r="3.5" style={nth(2)} />
      </g>
    </>
  );
}
