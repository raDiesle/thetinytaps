import { memo, useMemo, type CSSProperties } from "react";
import { type Hop, Hopper, hopKeyframes } from "./hop";
import { type Frame, holdToEnd, keyframes } from "./keyframes";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";
import { ToyArt, type ToyKind } from "./tidy";

// Five Boxes (H-120, user request, 22 November 2026: more timers for tidying up): five open toy boxes stand side by side
// against the wall, each for one sort – blocks, cars, balls, ducks, books, its sort's picture on its front – and each
// sort's toys lie on the floor in front of its box. Box after box, from the left, its toys hop into it one at a time,
// and once the last is in, its lid swings shut. Five minutes are five boxes, one a minute: „noch zwei Kisten“ is plain
// without a clock. The toy whose turn it is wiggles once a second while it waits (H-63); the last lid shuts as the time
// is up. Toys and lids are small layers on keyframes written for the run (`BoxesKeyframes`).

/** How many boxes, one for each sort, from the left. */
export const BOX_COUNT = 5;

/** Each box's sort, from the left, drawn by the Tidy Up's toys (`ToyArt`). */
export const BOX_KINDS: readonly ToyKind[] = ["block", "car", "ball", "duck", "book"];

/** Each box's paint: its front, its darker inside and the rim's lighter band. */
const BOX_PAINT = [
  { front: "#fa5252", inside: "#a61e1e", rim: "#ff8787" },
  { front: "#40c057", inside: "#1f7a33", rim: "#8ce99a" },
  { front: "#4dabf7", inside: "#1c5f99", rim: "#a5d8ff" },
  { front: "#fcc419", inside: "#a6740a", rim: "#ffe066" },
  { front: "#9775fa", inside: "#4b2fa0", rim: "#d0bfff" },
] as const;

/** The boxes: the first one's left edge, their width and the gap between them, their rim and the floor they stand on. */
export const BOXES = { x: 290, w: 180, gap: 30, rim: 420, bottom: 600 } as const;

/** How deep the box's opening is seen from above, behind the rim; the lid's hinge lies at its back edge. */
export const OPENING = 34;

/** The lid standing open behind the box: its height above the hinge. Shut, it lies over the opening. */
export const LID_H = 120;

/** Box `k`'s left edge and middle. */
export const boxLeft = (k: number) => BOXES.x + k * (BOXES.w + BOXES.gap);
export const boxMiddle = (k: number) => boxLeft(k) + BOXES.w / 2;

/** A toy's size on the floor (its layer is TOY × TOY, its foot on the floor). */
export const TOY = 84;

/** How big a toy lies in its box, so four fit side by side and its top shows in the opening. */
export const IN_BOX = 0.55;

/**
 * How many toys of each sort, for a run of any length: five minutes takes one every 20 seconds; a shorter or longer run
 * puts all of them away, only faster or slower (user request, 24 November 2026).
 */
export const PER_BOX = 3;

/**
 * Where box `k`'s toys lie on the floor in front of it, nearest the box first: two at the back, then one or two at the
 * front, half a toy aside, so none hides another and they look dropped rather than set in a row.
 */
export function floorPlaces(k: number, count: number): { x: number; y: number }[] {
  const c = boxMiddle(k);
  const back = [
    { x: c - 50, y: 680 },
    { x: c + 50, y: 684 },
  ];
  const front =
    count === 3
      ? [{ x: c - 8, y: 752 }]
      : [
          { x: c - 46, y: 750 },
          { x: c + 46, y: 754 },
        ];
  return [...back, ...front].slice(0, count);
}

/** Where the j-th of `count` toys lies in box `k`: side by side across it, its foot a little below the rim. */
export function boxSlot(k: number, j: number, count: number): { x: number; y: number } {
  const step = count > 3 ? 34 : 40;
  const wobble = ((j * 5 + k * 3) % 3) - 1;
  return { x: boxMiddle(k) + (j - (count - 1) / 2) * step + 4 * wobble, y: BOXES.rim + 14 + 2 * wobble };
}

/** How long a toy's hop takes at most, in ms, and its lid's swing (less when things come quickly). */
export const HOP_MS = 900;
export const LID_MS = 700;

/** One toy: its sort, its colour turned on the colour wheel (so three cars are three cars), and its hop. */
export interface BoxToy {
  box: number;
  kind: ToyKind;
  hue: number;
  hop: Hop;
}

/** One box's lid: when it starts to swing shut and when it lies shut. */
export interface BoxLid {
  start: number;
  shut: number;
}

/** Turns of the colour wheel for the toys of one sort, so neighbours never look the same. */
const HUES = [0, 150, 250, 60];

/**
 * Works out a run of `total` ms with `count` toys of each sort: each box gets a fifth of the time, its toys hop in one
 * after the other with even room between them, and its lid swings shut at the end of its fifth – the last as the time
 * is up.
 */
export function boxesPlan(total: number, count: number): { toys: BoxToy[]; lids: BoxLid[] } {
  const share = total / BOX_COUNT;
  const lidMs = Math.min(LID_MS, share * 0.12);
  const toys: BoxToy[] = [];
  const lids: BoxLid[] = [];
  for (let k = 0; k < BOX_COUNT; k++) {
    const begin = k * share;
    const lidStart = (k + 1) * share - lidMs;
    const unit = (lidStart - begin) / count;
    const hopMs = Math.min(HOP_MS, unit * 0.5);
    floorPlaces(k, count).forEach((from, j) => {
      const land = begin + (j + 1) * unit;
      const start = land - hopMs;
      const to = boxSlot(k, j, count);
      // The toy whose turn comes waits from the one before it landing (or the box's turn starting).
      const waitFrom = j === 0 ? begin : begin + j * unit;
      toys.push({
        box: k,
        kind: BOX_KINDS[k],
        hue: HUES[j % HUES.length],
        hop: { from, to, scale: IN_BOX, start, land, peak: BOXES.rim - 170, waitFrom: start - waitFrom >= 1000 ? waitFrom + 300 : undefined },
      });
    });
    lids.push({ start: lidStart, shut: (k + 1) * share });
  }
  return { toys, lids };
}

/** The lid shut as a scale of the lid standing open: folded over to the front, lying on the opening. */
export const LID_SHUT = -OPENING / LID_H;

/** The toys' hops and the lids' swings as keyframes made for this run. */
function BoxesKeyframes({ total, toys, lids }: { total: number; toys: BoxToy[]; lids: BoxLid[] }) {
  const rules = toys.flatMap((toy, i) => hopKeyframes(`tm-boxes-toy-${i}`, total, toy.hop, TOY));
  lids.forEach((lid, k) => {
    // The lid folds forward over its hinge: the half standing behind the toys shrinks to its edge, then the half lying
    // in front of them grows from its edge to shut, so it passes from behind the toys to over them.
    const half = (lid.start + lid.shut) / 2;
    const back: Frame[] = [
      { at: 0, transform: "scaleY(1)" },
      { at: lid.start, transform: "scaleY(1)", ease: "ease-in" },
      { at: half, transform: "scaleY(0)" },
    ];
    const front: Frame[] = [
      { at: 0, transform: "scaleY(0)" },
      { at: half, transform: "scaleY(0)", ease: "ease-out" },
      { at: lid.shut, transform: `scaleY(${LID_SHUT.toFixed(4)})` },
    ];
    rules.push(keyframes(`tm-boxes-lid-back-${k}`, total, holdToEnd(back, total)), keyframes(`tm-boxes-lid-front-${k}`, total, holdToEnd(front, total)));
  });
  return <style>{rules.join("\n")}</style>;
}

/** The room – a sunny wall with soft stripes, the floorboards and a rug – and each box's dark inside; drawn once. */
const BoxesBackdrop = memo(function BoxesBackdrop() {
  const wall = 470;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H} bleed>
        <rect width={STAGE_W} height={wall} fill="#fff3d6" />
        {Array.from({ length: 20 }, (_, i) => (
          <rect key={i} x={i * 80 + 20} y="0" width="34" height={wall} fill="#ffe8b8" />
        ))}
        <rect y={wall} width={STAGE_W} height={STAGE_H - wall} fill="#e2ad74" />
        {[560, 650, 760].map((y) => (
          <path key={y} d={`M0 ${y} H${STAGE_W}`} stroke="#cf9558" strokeWidth="4" />
        ))}
        {[180, 520, 860, 1200, 1500].map((x, i) => (
          <path key={x} d={`M${x + (i % 2) * 90} ${i % 2 ? 560 : 650} v${i % 2 ? 90 : 110}`} stroke="#cf9558" strokeWidth="4" />
        ))}
        <rect y={wall - 24} width={STAGE_W} height="28" fill="#fff" stroke="#e3cfa8" strokeWidth="3" />
        {/* A long rug in front of the boxes, the toys lying on it. */}
        <rect x="240" y="616" width="1120" height="176" rx="36" fill="#c3e6cb" stroke="#8fcb9b" strokeWidth="8" />
        <rect x="266" y="638" width="1068" height="132" rx="26" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="18 14" />
        {/* Each box's inside, behind the toys landing in it. */}
        {BOX_PAINT.map((paint, k) => {
          const left = boxLeft(k);
          const right = left + BOXES.w;
          return (
            <path
              key={k}
              d={`M${left} ${BOXES.rim} L${left + 16} ${BOXES.rim - OPENING} H${right - 16} L${right} ${BOXES.rim} Z`}
              fill={paint.inside}
              stroke={INK}
              strokeWidth="6"
              strokeLinejoin="round"
            />
          );
        })}
      </Draw>
    </Layer>
  );
});

/** One lid: a board with a rounded front edge and a handle, the same drawing standing open and folded shut. */
function LidArt({ k }: { k: number }) {
  const w = BOXES.w - 32;
  const paint = BOX_PAINT[k];
  return (
    <Draw w={w} h={LID_H}>
      <rect x="3" y="3" width={w - 6} height={LID_H - 6} rx="12" fill={paint.front} stroke={INK} strokeWidth="6" />
      <rect x="16" y="16" width={w - 32} height={LID_H - 48} rx="8" fill={paint.rim} opacity="0.6" />
      <rect x={w / 2 - 26} y="12" width="52" height="14" rx="7" fill={paint.inside} stroke={INK} strokeWidth="4" />
    </Draw>
  );
}

/** Box `k`'s lid, as two layers turning on the hinge: the half behind the toys and the half lying over them. */
function Lid({ k, front }: { k: number; front: boolean }) {
  const w = BOXES.w - 32;
  return (
    <Layer
      x={boxLeft(k) + 16}
      y={BOXES.rim - OPENING - LID_H}
      w={w}
      h={LID_H}
      className={`tm-boxes-lid ${front ? "tm-boxes-lid-front" : "tm-boxes-lid-back"}`}
      style={{ "--tm-anim": `tm-boxes-lid-${front ? "front" : "back"}-${k}`, "--tm-end": `scaleY(${front ? LID_SHUT.toFixed(4) : 0})` } as CSSProperties}
    >
      <LidArt k={k} />
    </Layer>
  );
}

/** The boxes' fronts, over the toys in them: painted boards with the rim's band and a round label of the sort; drawn once. */
const BoxFronts = memo(function BoxFronts() {
  const h = BOXES.bottom - BOXES.rim + 6;
  return (
    <>
      {BOX_PAINT.map((paint, k) => (
        <Layer key={k} x={boxLeft(k)} y={BOXES.rim - 4} w={BOXES.w} h={h}>
          <Draw w={BOXES.w} h={h}>
            <rect x="3" y="6" width={BOXES.w - 6} height={h - 9} rx="12" fill={paint.front} stroke={INK} strokeWidth="6" />
            <path d={`M12 ${h - 30} H${BOXES.w - 12}`} stroke={paint.inside} strokeWidth="4" opacity="0.5" />
            <rect x="0" y="0" width={BOXES.w} height="22" rx="10" fill={paint.rim} stroke={INK} strokeWidth="6" />
            <circle cx={BOXES.w / 2} cy={h / 2 + 12} r="54" fill="#fff" stroke={INK} strokeWidth="5" />
          </Draw>
          {/* The sort's picture on the label, so a child sees where the cars go. */}
          <div
            className="tm-boxes-label"
            style={{
              left: `${((BOXES.w / 2 - 40) / BOXES.w) * 100}%`,
              top: `${((h / 2 + 12 - 42) / h) * 100}%`,
              width: `${(80 / BOXES.w) * 100}%`,
              height: `${(80 / h) * 100}%`,
            }}
          >
            <ToyArt kind={BOX_KINDS[k]} />
          </div>
        </Layer>
      ))}
    </>
  );
});

/**
 * The toys, each on its hop (`Hopper`): on the floor until its turn, wiggling a second at a time while it waits, then
 * one hop into its box. While it lies on the floor a tap lights it (H-51: what is left).
 */
const BoxToys = memo(function BoxToys({ toys, glow }: { toys: BoxToy[]; glow: number }) {
  return (
    <>
      {toys.map((toy, i) => (
        <Hopper
          key={i}
          name={`tm-boxes-toy-${i}`}
          hop={toy.hop}
          size={TOY}
          extra={<LeftGlow n={glow} />}
          artStyle={toy.hue ? { filter: `hue-rotate(${toy.hue}deg)` } : undefined}
        >
          <ToyArt kind={toy.kind} />
        </Hopper>
      ))}
    </>
  );
});

/** The whole picture: the room, the lids standing open, the toys, the boxes' fronts and the lids shutting over them. */
export function BoxesScene({ count, total, glow }: { count: number; total: number; glow: number }) {
  // Worked out once for the run, so the memoised parts are not drawn again when a tap lights the toys.
  const { toys, lids } = useMemo(() => boxesPlan(total, count), [total, count]);
  return (
    <>
      <BoxesBackdrop />
      <BoxesKeyframes total={total} toys={toys} lids={lids} />
      {lids.map((_, k) => (
        <Lid key={k} k={k} front={false} />
      ))}
      <BoxToys toys={toys} glow={glow} />
      <BoxFronts />
      {lids.map((_, k) => (
        <Lid key={k} k={k} front />
      ))}
    </>
  );
}
