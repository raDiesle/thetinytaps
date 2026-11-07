import { memo, type CSSProperties } from "react";
import { GardenBackdrop } from "./flower";
import { INK, Layer, LeftGlow } from "./scenes";

// Eimer (H-69): time that fills up, for waiting for something good. A watering can hangs over a clear bucket in the
// garden and a drop falls from it every second (H-63), rippling the water; the water rises to a red line, where a little
// wooden boat already hangs waiting from a stick laid over the bucket (H-64: the goal is seen from the start). At the end
// the water reaches it and it floats, and the flower in the pot beside the bucket, which the bear child waters with it,
// opens. The water is one block sliding up inside a box cut to the bucket's inside, never drawn again or stretched.

/** The bucket: its middle, its rim and its floor, and its width there (its walls lean outwards). */
export const BUCKET = { cx: 680, top: 440, bottom: 790, wTop: 420, wBottom: 330 } as const;

/** How full the bucket is at the start (a little water already) and at the end: up to the red line. */
export const WATER = { start: 0.08, goal: 0.72 } as const;

/** The red line on the bucket, where the water ends up. */
export const GOAL_Y = BUCKET.bottom - WATER.goal * (BUCKET.bottom - BUCKET.top);

/** The boat waiting at the line, hanging from the stick: its hull's ends and its keel, a little below the line. */
export const BOAT = { left: 700, right: 820, keel: GOAL_Y + 10 } as const;

/** The spout's tip, where a drop falls from every second, and how far it falls before it is in the bucket. */
export const SPOUT = { x: 610, y: 388, fall: 70 } as const;

/** The pot with the flower beside the bucket. */
export const POT = { cx: 950, floor: 800, bud: 640 } as const;

/** The bucket's left and right inner edge at height `y`. */
export function bucketEdges(y: number) {
  const { cx, top, bottom, wTop, wBottom } = BUCKET;
  const w = wTop + ((wBottom - wTop) * (y - top)) / (bottom - top);
  return { left: cx - w / 2, right: cx + w / 2 };
}

/** A still clip cutting a box from `y0` to `y1` (as wide as the rim) to the bucket's inside. */
function insideClip(y0: number, y1: number) {
  const x0 = BUCKET.cx - BUCKET.wTop / 2;
  const pc = (x: number) => `${(((x - x0) / BUCKET.wTop) * 100).toFixed(2)}%`;
  const a = bucketEdges(y0);
  const b = bucketEdges(y1);
  return `polygon(${pc(a.left)} 0, ${pc(a.right)} 0, ${pc(b.right)} 100%, ${pc(b.left)} 100%)`;
}

/** The trapezoid of the bucket's outline, in stage units. */
function bucketPath(dx = 0, dy = 0) {
  const { top, bottom } = BUCKET;
  const a = bucketEdges(top);
  const b = bucketEdges(bottom);
  return `M${a.left - dx} ${top - dy} L${a.right - dx} ${top - dy} L${b.right - dx} ${bottom - dy} L${b.left - dx} ${bottom - dy} Z`;
}

/** The post with its arm the watering can hangs from, drawn in its own units and placed 50 further left; drawn once. */
const Post = memo(function Post() {
  return (
    <Layer x={250} y={180} w={340} h={620} className="tm-dims">
      <svg viewBox="300 180 340 620">
        <rect x="330" y="200" width="22" height="600" rx="6" fill="#b07c45" stroke={INK} strokeWidth="4" />
        <rect x="330" y="196" width="292" height="20" rx="6" fill="#b07c45" stroke={INK} strokeWidth="4" />
        <path d="M352 290 L430 216" stroke={INK} strokeWidth="14" strokeLinecap="round" />
        <path d="M352 290 L430 216" stroke="#b07c45" strokeWidth="7" strokeLinecap="round" />
        <path d="M594 216 V298" stroke={INK} strokeWidth="4" />
      </svg>
    </Layer>
  );
});

/** The watering can hanging tilted from the arm, its spout over the bucket; drawn once. */
const Can = memo(function Can() {
  return (
    <Layer x={420} y={255} w={210} h={160} className="tm-dims">
      <svg viewBox="0 0 210 160">
        <g transform="translate(2 39) rotate(35 105 70)">
          <path d="M120 50 L185 34 L188 46 L126 68 Z" fill="#4dabf7" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <rect x="180" y="30" width="14" height="20" rx="3" transform="rotate(-15 187 40)" fill="#339af0" stroke={INK} strokeWidth="4" />
          <rect x="30" y="30" width="100" height="70" rx="10" fill="#4dabf7" stroke={INK} strokeWidth="5" />
          <path d="M45 30 Q80 -10 115 30" fill="none" stroke={INK} strokeWidth="7" />
          <rect x="30" y="44" width="100" height="12" fill="#a5d8ff" />
        </g>
      </svg>
    </Layer>
  );
});

/** A drop falling from the spout into the bucket every second (H-63). */
function Drop() {
  return (
    <Layer x={SPOUT.x - 8} y={SPOUT.y} w={16} h={22}>
      <div className="tm-water tm-beat" style={{ "--tm-fall": `${(SPOUT.fall / 22) * 100}%` } as CSSProperties} />
    </Layer>
  );
}

/** The bucket's back wall seen through its clear front, with its handle laid down behind; drawn once. */
const BucketBack = memo(function BucketBack() {
  const { top, bottom } = BUCKET;
  const a = bucketEdges(top);
  return (
    <Layer x={a.left - 20} y={top - 20} w={BUCKET.wTop + 40} h={bottom - top + 40}>
      <svg viewBox={`${a.left - 20} ${top - 20} ${BUCKET.wTop + 40} ${bottom - top + 40}`}>
        <path d={bucketPath()} fill="#e7f5ff" />
        <path
          d={`M${a.left + 12} ${top + 14} Q${BUCKET.cx} ${top + 230} ${a.right - 12} ${top + 14}`}
          fill="none"
          stroke="#adb5bd"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </svg>
    </Layer>
  );
});

/** The water: a block sliding up inside a box cut to the bucket's inside, a ring spreading where each drop lands. */
function Water() {
  const { top, bottom, cx, wTop } = BUCKET;
  const style = {
    clipPath: insideClip(top, bottom),
    "--tm-from": `${(1 - WATER.start) * 100}%`,
    "--tm-to": `${(1 - WATER.goal) * 100}%`,
    "--tm-drop": `${((SPOUT.x - (cx - wTop / 2)) / wTop) * 100}%`,
  } as CSSProperties;
  return (
    <Layer x={cx - wTop / 2} y={top} w={wTop} h={bottom - top} className="tm-sky-box" style={style}>
      <div className="tm-water-level tm-move">
        <div className="tm-ring tm-beat" />
      </div>
    </Layer>
  );
}

/**
 * The way still to fill, from the water up to the red line: a box cut to the bucket whose lower end rises with the
 * water, so a tap lights exactly what is left (H-51).
 */
function StillToFill({ glow }: { glow: number }) {
  const { bottom, cx, wTop } = BUCKET;
  const style = { clipPath: insideClip(GOAL_Y, bottom) } as CSSProperties;
  return (
    <Layer x={cx - wTop / 2} y={GOAL_Y} w={wTop} h={bottom - GOAL_Y} className="tm-sky-box" style={style}>
      <div className="tm-to-grow tm-move" style={{ "--tm-sprout": `${(-WATER.start / WATER.goal) * 100}%` } as CSSProperties}>
        <LeftGlow n={glow} />
      </div>
    </Layer>
  );
}

/** The bucket's clear front: its outline, two ribs, a shine, and the red line where the time is up; drawn once. */
const BucketFront = memo(function BucketFront() {
  const { top, bottom } = BUCKET;
  const a = bucketEdges(top);
  const line = bucketEdges(GOAL_Y);
  const rib = (y: number) => {
    const e = bucketEdges(y);
    return `M${e.left} ${y} L${e.right} ${y}`;
  };
  return (
    <Layer x={a.left - 20} y={top - 20} w={BUCKET.wTop + 40} h={bottom - top + 40}>
      <svg viewBox={`${a.left - 20} ${top - 20} ${BUCKET.wTop + 40} ${bottom - top + 40}`}>
        <path d={rib(top + 26)} stroke="#a5d8ff" strokeWidth="10" opacity="0.8" />
        <path d={rib(bottom - 24)} stroke="#a5d8ff" strokeWidth="10" opacity="0.8" />
        <path
          d={`M${a.left + 34} ${top + 50} L${bucketEdges(bottom).left + 34} ${bottom - 50}`}
          stroke="#fff"
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path d={`M${line.left} ${GOAL_Y} L${line.right} ${GOAL_Y}`} stroke="#e03131" strokeWidth="9" />
        <path d={bucketPath()} fill="none" stroke={INK} strokeWidth="8" strokeLinejoin="round" />
        <rect x={a.left - 14} y={top - 8} width={BUCKET.wTop + 28} height="16" rx="8" fill="#d0ebff" stroke={INK} strokeWidth="5" />
      </svg>
    </Layer>
  );
});

/** The stick laid over the bucket, the boat hangs from it; drawn once. */
const Stick = memo(function Stick() {
  const a = bucketEdges(BUCKET.top);
  return (
    <Layer x={a.left - 30} y={BUCKET.top - 20} w={BUCKET.wTop + 60} h={20} className="tm-dims">
      <svg viewBox={`0 0 ${BUCKET.wTop + 60} 20`}>
        <rect x="2" y="2" width={BUCKET.wTop + 56} height="16" rx="8" fill="#c9a46b" stroke={INK} strokeWidth="4" />
      </svg>
    </Layer>
  );
});

/** The little wooden boat waiting at the line on a string; at the end the water lifts it and it floats. */
function Boat() {
  const x0 = BOAT.left - 20;
  const y0 = BUCKET.top - 4;
  const w = BOAT.right - BOAT.left + 40;
  const h = BOAT.keel - y0 + 4;
  const mast = (BOAT.left + BOAT.right) / 2 + 4;
  const deck = BOAT.keel - 38;
  return (
    <Layer x={x0} y={y0} w={w} h={h} className="tm-boat">
      <svg viewBox={`${x0} ${y0} ${w} ${h}`}>
        <path d={`M${mast} ${y0} V${deck - 64}`} stroke={INK} strokeWidth="3" />
        <path d={`M${mast} ${deck} V${deck - 66}`} stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <path
          d={`M${mast + 4} ${deck - 60} L${mast + 46} ${deck - 8} L${mast + 4} ${deck - 8} Z`}
          fill="#fff"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d={`M${mast - 4} ${deck - 52} L${mast - 34} ${deck - 8} L${mast - 4} ${deck - 8} Z`}
          fill="#ffe066"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d={`M${BOAT.left} ${deck} H${BOAT.right} L${BOAT.right - 22} ${BOAT.keel} H${BOAT.left + 18} Z`}
          fill="#c07a3a"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path d={`M${BOAT.left + 8} ${deck + 12} H${BOAT.right - 10}`} stroke="#8a5a2b" strokeWidth="4" />
      </svg>
    </Layer>
  );
}

/** The flower pot with its closed bud beside the bucket; drawn once. */
const Pot = memo(function Pot() {
  const { cx, floor, bud } = POT;
  return (
    <Layer x={cx - 50} y={bud - 30} w={100} h={floor - bud + 30} className="tm-dims">
      <svg viewBox={`${cx - 50} ${bud - 30} 100 ${floor - bud + 30}`}>
        <path d={`M${cx} ${floor - 60} V${bud + 10}`} stroke={INK} strokeWidth="12" strokeLinecap="round" />
        <path d={`M${cx} ${floor - 60} V${bud + 10}`} stroke="#4caf3a" strokeWidth="6" strokeLinecap="round" />
        <path
          d={`M${cx} ${floor - 90} Q${cx + 30} ${floor - 120} ${cx + 44} ${floor - 104} Q${cx + 24} ${floor - 86} ${cx} ${floor - 90} Z`}
          fill="#58b947"
          stroke={INK}
          strokeWidth="4"
        />
        <path
          d={`M${cx} ${bud + 26} C${cx - 20} ${bud + 20} ${cx - 18} ${bud - 6} ${cx} ${bud - 12} C${cx + 18} ${bud - 6} ${cx + 20} ${bud + 20} ${cx} ${bud + 26} Z`}
          fill="#58b947"
          stroke={INK}
          strokeWidth="4"
        />
        <path
          d={`M${cx - 38} ${floor - 66} H${cx + 38} L${cx + 28} ${floor} H${cx - 28} Z`}
          fill="#e8590c"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <rect x={cx - 44} y={floor - 72} width="88" height="16" rx="5" fill="#fd7e14" stroke={INK} strokeWidth="4" />
      </svg>
    </Layer>
  );
});

/** The flower opening at the end round the bud. */
function PotBloom() {
  const size = 120;
  return (
    <Layer x={POT.cx - size / 2} y={POT.bud + 6 - size / 2} w={size} h={size} className="tm-bloom">
      <svg viewBox="0 0 100 100">
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} cx="50" cy="22" rx="13" ry="22" fill="#b197fc" stroke={INK} strokeWidth="3" transform={`rotate(${i * 45} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="17" fill="#ffd43b" stroke={INK} strokeWidth="3" />
      </svg>
    </Layer>
  );
}

/** The whole picture: drops fill the bucket up to the boat at the line, then it floats and the flower opens. */
export function BucketScene({ glow, running }: { glow: number; running: boolean }) {
  return (
    <>
      <GardenBackdrop />
      <Post />
      <BucketBack />
      <Boat />
      <StillToFill glow={glow} />
      <Water />
      <BucketFront />
      <Stick />
      <Can />
      {running && <Drop />}
      <Pot />
      <PotBloom />
    </>
  );
}
