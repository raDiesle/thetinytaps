import { memo, type CSSProperties } from "react";
import { ladybugLaps } from "./pieces";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Rote Scheibe (H-47): the plainest picture, as many Kitas know it from the „Time Timer“ – a big red disc on a white
// face that gets smaller like a clock's hand going round, until nothing red is left. Bright colour on plain paper, to be
// seen across the room. The red is covered by two white half discs turning in two halves of the face, each clipped by
// its half (`overflow: hidden`), so only `transform` moves; a hand turns with the edge, and the knob in the middle turns
// a little every second (H-63). A ladybug crawls round the face's rim about once a minute, like a second hand, and
// leaves a dot outside the rim after each round, so one sees how many minutes are over (H-67): two speeds as on a real
// clock – the ladybug shows that it runs, the red how much is left.

/** The face: its middle, the red disc's radius and the white face's radius round it. */
export const DISC = { cx: 700, cy: 450, r: 290, face: 322 } as const;

/** The ladybug's dots: their distance from the middle, their radius and the angle between two of them (H-67). */
export const DOTS = { ring: DISC.face + 30, r: 12, apart: 12 } as const;

/** The ladybug's size, crawling on the face's black rim. */
const BUG = 76;

/** The overlays reach a little past the red, so no red hairline shows at its rim. */
const COVER = DISC.r + 3;

/** The plain paper behind the face; drawn once. */
const DiscBackdrop = memo(function DiscBackdrop() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <rect width={STAGE_W} height={STAGE_H} fill="#fff4e0" />
        <rect y="800" width={STAGE_W} height="100" fill="#f1dcb8" />
      </Draw>
    </Layer>
  );
});

/** The white face with its minute marks round the red; drawn once. */
const DiscFace = memo(function DiscFace() {
  const { cx, cy, face, r } = DISC;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H}>
      <Draw w={STAGE_W} h={STAGE_H}>
        <circle cx={cx} cy={cy} r={face} fill="#fff" stroke={INK} strokeWidth="9" />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * 2 * Math.PI;
          const inner = i % 5 ? face - 16 : face - 26;
          return (
            <path
              key={i}
              d={`M${cx + Math.sin(a) * inner} ${cy - Math.cos(a) * inner} L${cx + Math.sin(a) * (face - 6)} ${cy - Math.cos(a) * (face - 6)}`}
              stroke={INK}
              strokeWidth={i % 5 ? 3 : 6}
              strokeLinecap="round"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={r + 1} fill="none" stroke="#f1f3f5" strokeWidth="2" />
      </Draw>
    </Layer>
  );
});

/** The red disc and the two white halves that cover it from 12 o'clock round, the right half first, then the left. */
function Red({ glow }: { glow: number }) {
  const { cx, cy } = DISC;
  return (
    <>
      <Layer x={cx - DISC.r} y={cy - DISC.r} w={2 * DISC.r} h={2 * DISC.r} className="tm-red">
        {/* A tap lights up the red still left (H-51); the white halves over it hide the rest of the light. */}
        <LeftGlow n={glow} />
      </Layer>
      <Layer x={cx} y={cy - COVER} w={COVER} h={2 * COVER} className="tm-half tm-half-right">
        <div className="tm-cover tm-move" />
      </Layer>
      <Layer x={cx - COVER} y={cy - COVER} w={COVER} h={2 * COVER} className="tm-half tm-half-left">
        <div className="tm-cover tm-move" />
      </Layer>
    </>
  );
}

/** The hand along the red's edge, going round once over the whole time, and the knob in the middle. */
function Hand() {
  const { cx, cy } = DISC;
  return (
    <>
      <Layer x={cx - COVER} y={cy - COVER} w={2 * COVER} h={2 * COVER} className="tm-hand tm-move">
        <div className="tm-hand-line" />
      </Layer>
      <Layer x={cx - 46} y={cy - 46} w={92} h={92}>
        <div className="tm-knob tm-beat">
          <svg viewBox="0 0 100 100">
            {Array.from({ length: 6 }, (_, i) => (
              <ellipse key={i} cx="50" cy="22" rx="14" ry="22" fill="#ced4da" stroke={INK} strokeWidth="4" transform={`rotate(${i * 60} 50 50)`} />
            ))}
            <circle cx="50" cy="50" r="24" fill="#495057" stroke={INK} strokeWidth="4" />
            <circle cx="44" cy="44" r="7" fill="#868e96" />
          </svg>
        </div>
      </Layer>
    </>
  );
}

/** Where the dot left after round `k` (from 0) lies: from 12 o'clock on clockwise, outside the rim. */
export function dotAt(k: number) {
  const a = ((k * DOTS.apart) / 180) * Math.PI;
  return { x: DISC.cx + Math.sin(a) * DOTS.ring, y: DISC.cy - Math.cos(a) * DOTS.ring };
}

/**
 * The ladybug crawling clockwise round the rim, a round in `lap` ms, never stopping until the end, when it stands at the
 * top. The layer round the face turns, the ladybug drawn once at its top: only `transform` moves.
 */
const Ladybug = memo(function Ladybug({ lap }: { lap: number }) {
  const { cx, cy, face } = DISC;
  const box = face + BUG / 2;
  return (
    <Layer x={cx - box} y={cy - box} w={2 * box} h={2 * box} className="tm-ladybug tm-move" style={{ "--tm-lap": `${lap}ms` } as CSSProperties}>
      <svg viewBox={`0 0 ${2 * box} ${2 * box}`}>
        <g transform={`translate(${box} ${BUG / 2}) rotate(90) scale(1.2)`} stroke={INK} strokeWidth="3" strokeLinecap="round">
          {[-14, 0, 14].map((y) => (
            <path key={y} d={`M${y} -20 L${y * 1.3} -30 M${y} 20 L${y * 1.3} 30`} fill="none" />
          ))}
          <ellipse cx="0" cy="0" rx="22" ry="26" fill="#e03131" />
          <path d="M0 -26 V26" fill="none" />
          <circle cx="0" cy="-30" r="12" fill="#343a40" />
          <circle cx="-5" cy="-34" r="3" fill="#fff" stroke="none" />
          <circle cx="5" cy="-34" r="3" fill="#fff" stroke="none" />
          {[
            [-11, -10],
            [11, -10],
            [-12, 8],
            [12, 8],
          ].map(([x, y]) => (
            <circle key={`${x} ${y}`} cx={x} cy={y} r="5" fill="#343a40" stroke="none" />
          ))}
        </g>
      </svg>
    </Layer>
  );
});

/**
 * The dots the ladybug leaves, one after every `every` rounds: each waits on its own clock (`animation-delay`) and
 * comes as the ladybug is back at the top; the last one comes with the end.
 */
const Dots = memo(function Dots({ dots, total }: { dots: number; total: number }) {
  return (
    <>
      {Array.from({ length: dots }, (_, k) => {
        const { x, y } = dotAt(k);
        return (
          <Layer key={k} x={x - DOTS.r} y={y - DOTS.r} w={2 * DOTS.r} h={2 * DOTS.r}>
            <div className="tm-dot" style={{ animationDelay: `${((k + 1) * total) / dots}ms` }} />
          </Layer>
        );
      })}
    </>
  );
});

/**
 * The whole picture: the face with the red disc, the ladybug going round it and its dots.
 * `total` is how long it runs, `set` how long a grown-up set (the rounds are cut from it).
 */
export function DiscScene({ glow, total, set }: { glow: number; total: number; set: number }) {
  const { dots, laps } = ladybugLaps(set);
  return (
    <>
      <DiscBackdrop />
      <DiscFace />
      <Red glow={glow} />
      <Hand />
      <Dots dots={dots} total={total} />
      <Ladybug lap={total / laps} />
    </>
  );
}
