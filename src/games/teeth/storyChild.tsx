import type { Figure } from "@/lib/common";
import type { Daytime } from "@/lib/days";
import { clothesOf, PyjamaPattern, topFill } from "./clothes";
import { BROW, Ear, EyeBall, EyeLid, eyeOpening, FACE, HAIR, Hair, type HeadMap, INK, Iris, LASHES, Nose, SkinGradient } from "./face";
import { BROWS, CHEEK, CHEEKS, HEAD } from "./origin";

// The story's child as the pictures after the story show it, standing straight at the story's place (`HEAD` of
// origin.tsx) with the parts of face.tsx: the spitting over the basin (spit.tsx) and the little lion (lion.tsx). Drawn
// in two parts, so something can lie between its shoulders and its head (the lion costume's mane).

/** A point of the head (head units round its middle, `face.tsx`) in the picture: the story's head, standing straight. */
const onHead: HeadMap = (x, y) => ({ x: HEAD.x + x, y: HEAD.y + y });
/** The eyes' middles. */
const EYES = ([-1, 1] as const).map((s) => ({ s, x: HEAD.x + s * FACE.eyes.x, y: HEAD.y + FACE.eyes.y }));
const OPENING = eyeOpening(FACE.eyes.rx, FACE.eyes.ry);

/** The child's shoulders in its T-shirt, or pyjamas in the evening, from under the chin down to `bottom`. */
export function StoryShoulders({ id, figure, daytime, bottom }: { id: string; figure: Figure; daytime: Daytime; bottom: number }) {
  return (
    <>
      <defs>
        <PyjamaPattern id={`${id}-pyjama`} figure={figure} />
      </defs>
      <path
        d={`M20 ${bottom} V440 C20 395 110 365 ${HEAD.x} 365 C330 365 420 395 420 440 V${bottom} Z`}
        fill={topFill(figure, daytime, `${id}-pyjama`)}
        stroke={INK}
        strokeWidth={5}
      />
    </>
  );
}

/**
 * The child's head with its pigtails (the girl), ears, hair, eyes, brows, nose and cheeks – everything but the mouth,
 * which each picture draws as a layer of its own. `look` moves the irises down (the spitting looks into the basin).
 */
export function StoryHead({ id, figure, look = 0 }: { id: string; figure: Figure; look?: number }) {
  const girl = figure === "girl";
  return (
    <>
      <defs>
        <SkinGradient id={`${id}-skin`} head={HEAD} />
        <radialGradient id={`${id}-cheek`}>
          <stop offset="0" stopColor="#ff7f99" stopOpacity={0.7} />
          <stop offset="0.6" stopColor="#ff8fab" stopOpacity={0.45} />
          <stop offset="1" stopColor="#ff8fab" stopOpacity={0} />
        </radialGradient>
        {EYES.map(({ s, x, y }) => (
          <clipPath key={s} id={`${id}-eye-${s}`}>
            <ellipse cx={x} cy={y} rx={OPENING.rx} ry={OPENING.ry} />
          </clipPath>
        ))}
      </defs>
      {girl &&
        ([-1, 1] as const).map((s) => {
          const tail = onHead(s * FACE.pigtails.x, FACE.pigtails.y);
          return (
            <ellipse
              key={s}
              cx={tail.x}
              cy={tail.y}
              rx={FACE.pigtails.rx}
              ry={FACE.pigtails.ry}
              transform={`rotate(${s * -35} ${tail.x} ${tail.y})`}
              fill={HAIR}
              stroke={INK}
              strokeWidth={5}
            />
          );
        })}
      {([-1, 1] as const).map((s) => {
        const ear = onHead(s * FACE.ears.x, FACE.ears.y);
        return <Ear key={s} x={ear.x} y={ear.y} r={FACE.ears.r} side={s} />;
      })}
      <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill={`url(#${id}-skin)`} stroke={INK} strokeWidth={5} />
      <Hair at={onHead} />
      {girl &&
        ([-1, 1] as const).map((s) => {
          const band = onHead(s * FACE.bands.x, FACE.bands.y);
          return <circle key={s} cx={band.x} cy={band.y} r={FACE.bands.r} fill={clothesOf(figure).band} stroke={INK} strokeWidth={4} />;
        })}
      {/* The irises stay inside the eyes' whites. */}
      {EYES.map(({ s, x, y }) => (
        <g key={s}>
          {girl && (
            <path
              d={LASHES.map(([x1, y1, x2, y2]) => `M${x + s * x1} ${y + y1} L${x + s * x2} ${y + y2}`).join(" ")}
              stroke={INK}
              strokeWidth={4}
              strokeLinecap="round"
            />
          )}
          <EyeBall x={x} y={y} rx={FACE.eyes.rx} ry={FACE.eyes.ry} />
          <g clipPath={`url(#${id}-eye-${s})`}>
            <Iris x={x} y={y + look} r={FACE.eyes.iris} />
          </g>
          <EyeLid x={x} y={y} rx={FACE.eyes.rx} ry={FACE.eyes.ry} />
        </g>
      ))}
      {BROWS.map((brow) => (
        <path key={brow.side} d={brow.d} fill="none" stroke={BROW} strokeWidth={6} strokeLinecap="round" />
      ))}
      <Nose x={HEAD.x} y={HEAD.y + FACE.nose.y} r={FACE.nose.r} />
      {CHEEKS.map((cx) => (
        <ellipse key={cx} cx={cx} cy={CHEEK.y} rx={CHEEK.rx} ry={CHEEK.ry} fill={`url(#${id}-cheek)`} />
      ))}
    </>
  );
}
