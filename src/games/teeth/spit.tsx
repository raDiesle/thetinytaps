import { useRef, type RefObject } from "react";
import { useFigure } from "@/lib/common";
import type { Daytime } from "@/lib/days";
import { useT } from "@/lib/language";
import { playSpit } from "@/lib/sfx";
import { clothesOf, PyjamaPattern, topFill } from "./clothes";
import type { Cue } from "./cues";
import { BROW, Ear, EyeBall, EyeLid, eyeOpening, FACE, HAIR, Hair, type HeadMap, INK, Iris, LASHES, LIP, Nose, SkinGradient } from "./face";
import { fitBox, FrameStroke, screenFrame, useRoom, type Box } from "./mouth";
import { BROWS, CHEEK, CHEEKS, CLOSED_AREA, ClosedMouth, HEAD } from "./origin";
import { Piece, pictureSpace } from "./piece";

// Idea X-18: after the cheer and before the brush is rinsed, the child spits the foam out – and only spits: no cup of
// water to rinse the mouth, so the fluoride stays on the teeth. The mirror shows the child leaning over the basin, its
// lips pursed, a dab of foam dropping into the basin with a soft „ptü“. Two bars, no words on the picture.
//
// The child is the story's child, drawn with the same parts in the same place (`origin.tsx`, `face.tsx`); the basin
// lies in front of it at the bottom. As everywhere in this game the picture is still and every moving thing an HTML
// layer of its own (`Piece`): the child leaning (one layer with its lips and the foam on them), and the dab of foam
// falling into the basin. Its keyframes are `teeth-spit-…` in teeth.css, as long as SPIT_MS.

/** How long the spitting lasts: two bars of the song (8 beats at 112 BPM). */
export const SPIT_MS = 4290;

/** „Ptü“ on the fifth beat, as the dab leaves the lips (`teeth-spit-blob` at 50 %); its splat comes with it. */
export const SPIT_CUES: Cue[] = [{ at: 2145, play: playSpit }];

/** The face from the brows down to the basin's front rim: what has to fit between the controls; the rest shows more wall. */
const FOCUS: Box = { x: 0, y: 112, width: 440, height: 384 };
/** The top of the counter, in front of the child's chest. */
const COUNTER = 408;
/** The basin let into the counter, seen from the mirror's side: its rim and its bowl. */
const BASIN = { x: HEAD.x, y: 452, rx: 178, ry: 36 };
/** Where the lips meet: the pursed lips and the dab of foam start there. */
const LIPS = { x: HEAD.x, y: 272 };
/** How far the child leans down over the basin while it spits (`teeth-spit-lean`). */
export const LEAN = 10;
/** Where the dab lands in the bowl, a little in front of the drain. */
const LANDS_AT = BASIN.y + 4;

/** The child's layer: head, hair, pigtails and shoulders, down to below the counter's top. */
const CHILD: Box = { x: -10, y: 0, width: 460, height: COUNTER + 40 };
/** The pursed lips' layer, round where the lips meet. */
const PUCKER: Box = { x: LIPS.x - 32, y: LIPS.y - 26, width: 64, height: 54 };
/** The foam on the lips before the spit: in both corners and on the lower lip, as the mirror showed it. */
const LIP_FOAM: Box = { x: 150, y: 250, width: 140, height: 60 };
/** The dab of foam, where it peeks out of the pursed lips once the child has leaned down. */
const BLOB: Box = { x: LIPS.x - 15, y: LIPS.y + LEAN - 10, width: 30, height: 30 };
/** How far the dab drops from the lips into the bowl, in picture units (`teeth-spit-blob`'s last keyframes). */
export const FALL = LANDS_AT - (BLOB.y + BLOB.height);

/** A point of the head (head units round its middle, `face.tsx`) in this picture: the story's head, standing straight. */
const onHead: HeadMap = (x, y) => ({ x: HEAD.x + x, y: HEAD.y + y });
/** The eyes' middles. */
const EYES = ([-1, 1] as const).map((s) => ({ s, x: HEAD.x + s * FACE.eyes.x, y: HEAD.y + FACE.eyes.y }));
/** Where the irises look: down into the basin. */
const LOOK_DOWN = 9;
const OPENING = eyeOpening(FACE.eyes.rx, FACE.eyes.ry);

/** Pursed lips, pushed forward round a small opening: the shape a child makes to spit. */
function Pucker() {
  const { x, y } = LIPS;
  return (
    <g strokeLinejoin="round">
      <ellipse cx={x} cy={y} rx={23} ry={18} fill={LIP} stroke={INK} strokeWidth={4} />
      {/* The lips' fullness: a soft fold round the opening and a light on the lower lip. */}
      <ellipse cx={x} cy={y + 1} rx={12} ry={9} fill="#e85a74" />
      <ellipse cx={x} cy={y + 1} rx={7} ry={5.5} fill="#7a2338" stroke={INK} strokeWidth={2.5} />
      <path d={`M${x - 9} ${y + 13} Q${x} ${y + 16} ${x + 9} ${y + 13}`} fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.55} />
      {/* The little creases where the lips are drawn together. */}
      <path
        d={`M${x - 20} ${y - 6} l5 3 M${x + 20} ${y - 6} l-5 3 M${x - 20} ${y + 6} l5 -3 M${x + 20} ${y + 6} l-5 -3`}
        stroke="#c94a63"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </g>
  );
}

/** A soft clump of foam: a few bubbles merged into one white cloud with a light blue rim. */
function FoamClump({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g fill="#fff" stroke="#9fd8ef" strokeWidth={2}>
      <circle cx={x - 6 * k} cy={y + 1 * k} r={6 * k} />
      <circle cx={x + 6 * k} cy={y + 1 * k} r={5.5 * k} />
      <circle cx={x} cy={y - 3 * k} r={7 * k} />
      <circle cx={x + 2 * k} cy={y - 2 * k} r={5 * k} stroke="none" />
    </g>
  );
}

/** The spitting, filling the screen; `free` is the part between the controls and the edges, where the picture has to fit. */
export function Spit({ daytime, free }: { daytime: Daytime; free: RefObject<HTMLElement | null> }) {
  const t = useT();
  const scene = useRef<HTMLDivElement>(null);
  const { box, unit } = fitBox(useRoom(scene, free), FOCUS);
  const frame = screenFrame(box, unit);
  const bottom = box.y + box.height;
  const viewBox = `${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.width.toFixed(1)} ${box.height.toFixed(1)}`;
  const space = pictureSpace(box, unit);
  const figure = useFigure();
  const girl = figure === "girl";
  const label = t({
    en: "The child leans over the sink and spits out the foam",
    de: "Das Kind beugt sich über das Waschbecken und spuckt den Schaum aus",
    zh: "孩子弯腰对着洗手池，把泡沫吐出来",
    hi: "बच्चा सिंक पर झुककर झाग थूकता है",
    es: "El niño se inclina sobre el lavabo y escupe la espuma",
    ar: "الطفل ينحني فوق المغسلة ويبصق الرغوة",
    ru: "Ребёнок наклоняется над раковиной и сплёвывает пену",
  });
  return (
    <div ref={scene} className="spit">
      {/* The bathroom's wall behind the child, the same tiles as at the sink. */}
      <svg className="spit-picture" viewBox={viewBox} role="img" aria-label={label}>
        <defs>
          <pattern id="spit-tiles" width={55} height={55} patternUnits="userSpaceOnUse">
            <rect width={55} height={55} fill="#e6f7ff" />
            <path d="M0 0.5 H55 M0.5 0 V55" stroke="#b8e2f5" strokeWidth={3} />
            <path d="M6 10 Q6 6 10 6 H18" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
          </pattern>
        </defs>
        <rect {...frame} fill="url(#spit-tiles)" />
      </svg>

      <div className="teeth-space" style={space}>
        {/* The child, leaning down over the basin and up again: one layer with what moves on its face. */}
        <Piece
          area={CHILD}
          className="spit-child"
          over={
            <>
              {/* The smile closes, the lips purse round the foam and push it out, then the smile comes back. */}
              <Piece area={CLOSED_AREA} within={CHILD} className="spit-smile">
                <ClosedMouth />
              </Piece>
              <Piece area={LIP_FOAM} within={CHILD} pivot={LIPS} className="spit-lip-foam">
                <FoamClump x={172} y={268} />
                <FoamClump x={268} y={268} k={0.9} />
                <FoamClump x={222} y={292} k={0.8} />
              </Piece>
              <Piece area={PUCKER} within={CHILD} pivot={LIPS} className="spit-pucker">
                <Pucker />
              </Piece>
            </>
          }
        >
          <defs>
            <PyjamaPattern id="spit-pyjama" figure={figure} />
            <SkinGradient id="spit-skin" head={HEAD} />
            <radialGradient id="spit-cheek">
              <stop offset="0" stopColor="#ff7f99" stopOpacity={0.7} />
              <stop offset="0.6" stopColor="#ff8fab" stopOpacity={0.45} />
              <stop offset="1" stopColor="#ff8fab" stopOpacity={0} />
            </radialGradient>
            {EYES.map(({ s, x, y }) => (
              <clipPath key={s} id={`spit-eye-${s}`}>
                <ellipse cx={x} cy={y} rx={OPENING.rx} ry={OPENING.ry} />
              </clipPath>
            ))}
          </defs>
          {/* Shoulders in the boy's or the girl's T-shirt, or pyjamas in the evening, going down behind the counter. */}
          <path
            d={`M20 ${COUNTER + 40} V440 C20 395 110 365 ${HEAD.x} 365 C330 365 420 395 420 440 V${COUNTER + 40} Z`}
            fill={topFill(figure, daytime, "spit-pyjama")}
            stroke={INK}
            strokeWidth={5}
          />
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
          <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill="url(#spit-skin)" stroke={INK} strokeWidth={5} />
          <Hair at={onHead} />
          {girl &&
            ([-1, 1] as const).map((s) => {
              const band = onHead(s * FACE.bands.x, FACE.bands.y);
              return <circle key={s} cx={band.x} cy={band.y} r={FACE.bands.r} fill={clothesOf(figure).band} stroke={INK} strokeWidth={4} />;
            })}
          {/* The eyes look down into the basin; the irises stay inside the eyes' whites. */}
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
              <g clipPath={`url(#spit-eye-${s})`}>
                <Iris x={x} y={y + LOOK_DOWN} r={FACE.eyes.iris} />
              </g>
              <EyeLid x={x} y={y} rx={FACE.eyes.rx} ry={FACE.eyes.ry} />
            </g>
          ))}
          {BROWS.map((brow) => (
            <path key={brow.side} d={brow.d} fill="none" stroke={BROW} strokeWidth={6} strokeLinecap="round" />
          ))}
          <Nose x={HEAD.x} y={HEAD.y + FACE.nose.y} r={FACE.nose.r} />
          {CHEEKS.map((cx) => (
            <ellipse key={cx} cx={cx} cy={CHEEK.y} rx={CHEEK.rx} ry={CHEEK.ry} fill="url(#spit-cheek)" />
          ))}
        </Piece>
      </div>

      {/* The counter and the basin in front of the child, still. */}
      <svg className="spit-picture" viewBox={viewBox} aria-hidden>
        <defs>
          <clipPath id="spit-frame">
            <rect {...frame} />
          </clipPath>
          <linearGradient id="spit-bowl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eef8fe" />
            <stop offset="0.5" stopColor="#d6eefa" />
            <stop offset="1" stopColor="#a9d6ee" />
          </linearGradient>
        </defs>
        <g clipPath="url(#spit-frame)" stroke={INK} strokeLinejoin="round">
          <rect x={box.x - 20} y={COUNTER} width={box.width + 40} height={Math.max(140, bottom - COUNTER + 20)} rx={26} fill="#fff" strokeWidth={6} />
          <ellipse cx={BASIN.x} cy={BASIN.y} rx={BASIN.rx} ry={BASIN.ry} fill="#f4fbff" strokeWidth={4} />
          <ellipse cx={BASIN.x} cy={BASIN.y + 2} rx={BASIN.rx - 22} ry={BASIN.ry - 10} fill="url(#spit-bowl)" strokeWidth={3} />
          <ellipse cx={BASIN.x} cy={BASIN.y + 8} rx={12} ry={4} fill="#9fb4c4" strokeWidth={2.5} />
          <path
            d={`M${BASIN.x - 140} ${BASIN.y - 20} Q${BASIN.x} ${BASIN.y - 34} ${BASIN.x + 140} ${BASIN.y - 20}`}
            fill="none"
            stroke="#fff"
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.9}
          />
        </g>
      </svg>

      {/* The dab of foam: it peeks out of the pursed lips, drops with the „ptü“ and lands as a splat in the bowl. */}
      <div className="teeth-space" style={space}>
        <Piece area={BLOB} pivot={{ x: LIPS.x, y: BLOB.y + BLOB.height }} className="spit-blob">
          <path
            d={`M${LIPS.x} ${BLOB.y + 2} C${LIPS.x + 8} ${BLOB.y + 10} ${LIPS.x + 13} ${BLOB.y + 16} ${LIPS.x + 13} ${BLOB.y + 21} C${LIPS.x + 13} ${BLOB.y + 27} ${LIPS.x + 7} ${BLOB.y + 29} ${LIPS.x} ${BLOB.y + 29} C${LIPS.x - 7} ${BLOB.y + 29} ${LIPS.x - 13} ${BLOB.y + 27} ${LIPS.x - 13} ${BLOB.y + 21} C${LIPS.x - 13} ${BLOB.y + 16} ${LIPS.x - 8} ${BLOB.y + 10} ${LIPS.x} ${BLOB.y + 2} Z`}
            fill="#fff"
            stroke="#9fd8ef"
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          <circle cx={LIPS.x - 4} cy={BLOB.y + 19} r={3} fill="#cfeefb" />
          <circle cx={LIPS.x + 5} cy={BLOB.y + 24} r={2} fill="#cfeefb" />
        </Piece>
      </div>

      {/* The mirror's frame stays at the screen's edge, over everything. */}
      <svg className="spit-frame" viewBox={viewBox} aria-hidden>
        <FrameStroke frame={frame} unit={unit} />
      </svg>
    </div>
  );
}
