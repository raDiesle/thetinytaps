import { memo } from "react";
import { Draw, Family, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Rote Scheibe (H-47): the plainest picture, as many Kitas know it from the „Time Timer“ – a big red disc on a white
// face that gets smaller like a clock's hand going round, until nothing red is left. Bright colour on plain paper, to be
// seen across the room. The red is covered by two white half discs turning in two halves of the face, each clipped by
// its half (`overflow: hidden`), so only `transform` moves; a hand turns with the edge, and the knob in the middle turns
// a little every second (H-63).

/** The face: its middle, the red disc's radius and the white face's radius round it. */
export const DISC = { cx: 760, cy: 450, r: 290, face: 322 } as const;

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

/** The whole picture: the face with the red disc, and the fox family beside it. */
export function DiscScene({ glow }: { glow: number }) {
  return (
    <>
      <DiscBackdrop />
      <DiscFace />
      <Red glow={glow} />
      <Hand />
      <Family kind="fox" x={1200} floor={790} childLeft />
    </>
  );
}
