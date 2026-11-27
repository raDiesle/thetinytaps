import { type CSSProperties, memo, type ReactNode, type RefObject, useRef } from "react";
import { useFigure } from "@/lib/common";
import type { Daytime } from "@/lib/days";
import { useT } from "@/lib/language";
import { playLittleRoar, playRecorded, playRoar } from "@/lib/sfx";
import type { Cue } from "./cues";
import { EyeBall, EyeLid, INK, Iris, LIP } from "./face";
import { fitBox, FrameStroke, screenFrame, useRoom, type Box } from "./mouth";
import { CLOSED_AREA, ClosedMouth, HEAD } from "./origin";
import { Piece, pictureSpace } from "./piece";
import { StoryHead, StoryShoulders } from "./storyChild";

// The lion (X-26), right after the toothpaste and before the mirror shows the open mouth, one phase of the bar (user
// requests, November 2026: the lion's and the roaring's two phases became one, and the lion alone is seen only
// briefly): the lion is seen close up and the camera draws back to the story's child beside it, already in its lion
// costume (the mane is on from the start, never grown in). Meanwhile the voice tells the child what comes – before
// brushing, roar like a lion three times (`PRELUDE_TEXTS.lion`) – and before each round a call of its own says to roar
// (`LION_CALLS` in lines.ts, said `CALL_BEATS` before the roar, so it is over before the roar sounds). Then both roar
// together, each roar louder and a little longer than the one before, each a recording of its own. Nothing on the
// picture counts or shows when to roar: three marks between the heads did, and were taken out (user feedback, November
// 2026) – the voice says it. The child's mouth stays open after the last roar, so the mirror after it shows the mouth
// already wide open.
//
// As everywhere in this game the picture is still and every moving thing an HTML layer of its own (`Piece`): the
// camera, the child's mouths, the lion and its mouths and the roar's waves. Their keyframes are `teeth-lion-…` in
// teeth.css, all as long as LION_MS. The lion is drawn here in SVG; a painted one may take its place later.

/** One beat of the song (112 BPM). */
const BEAT_MS = 60000 / 112;
/** How many beats the lion's scene lasts: the lion and the first line, then three rounds of a call and a roar. */
export const LION_BEATS = 37;
/** How long the lion's scene lasts. */
export const LION_MS = LION_BEATS * BEAT_MS;
/** When the camera has drawn back from the lion alone to the lion and the child (`teeth-lion-camera`). */
export const BOTH_SEEN_BEAT = 3;

/** One round of roaring, in beats of the scene: the voice calls to roar, then both roar. */
export interface RoarRound {
  /** The beat both roar on, their mouths just wide open. */
  roar: number;
  /** How many beats the mouths stay wide open after it: longer round by round. */
  open: number;
  /** How loud both roars are played: louder round by round, the last at full loudness. */
  gain: number;
  /** The lion's roar of this round, a recording from ElevenLabs. */
  lion: string;
  /** The child's roar of this round, a recording from ElevenLabs too. */
  child: string;
}

/** How many beats before its roar a round's call is said: room for the longest recording to end first. */
export const CALL_BEATS = 4;

/**
 * The three rounds, each roar louder and a little longer than the one before (user request, November 2026). The first
 * call comes once the scene's first line (about 4 s) is over; each later one once the mouths of the round before closed.
 */
export const ROUNDS: RoarRound[] = [
  { roar: 13, open: 3, gain: 0.5, lion: "lion-roar-1", child: "child-roar-1" },
  { roar: 21, open: 4, gain: 0.72, lion: "lion-roar-2", child: "child-roar-2" },
  { roar: 30, open: 5, gain: 1, lion: "lion-roar-3", child: "child-roar-3" },
];

/** When each round's call is said, in ms from the scene's start. */
export const CALL_MS = ROUNDS.map((round) => (round.roar - CALL_BEATS) * BEAT_MS);

/**
 * Both roars of a round at once: the round's own ElevenLabs recordings at the round's loudness, loaded before the
 * prelude (synthesized roars only where a recording could not load).
 */
const roarTogether = (round: RoarRound) => () => {
  playRecorded(round.lion, playRoar, round.gain);
  playRecorded(round.child, playLittleRoar, round.gain);
};

/** The scene's roars, in ms from its start: both together in each round. No chime over them. */
export const ROAR_CUES: Cue[] = ROUNDS.map((round) => ({ at: round.roar * BEAT_MS, play: roarTogether(round) }));

/** The recordings the step plays, loaded before the prelude: each round's two roars. */
export const LION_RECORDINGS = ROUNDS.flatMap((r) => [r.lion, r.child]);

/** The lion alone: what the camera shows first. */
const FOCUS_LION: Box = { x: 440, y: 10, width: 480, height: 470 };
/** The child and the lion beside it: what the camera draws back to. */
const FOCUS_BOTH: Box = { x: -20, y: 0, width: 920, height: 480 };

/** The lion's head's middle, beside the child's at about its height. */
const LION = { x: 680, y: 238 };
/** How much bigger the lion is drawn than its parts' numbers below: about as big as the child with its mane. */
const LION_SIZE = 1.3;
/** A box of the lion's parts, grown round its head's middle to its size. */
const grown = (b: Box): Box => ({
  x: LION.x + (b.x - LION.x) * LION_SIZE,
  y: LION.y + (b.y - LION.y) * LION_SIZE,
  width: b.width * LION_SIZE,
  height: b.height * LION_SIZE,
});
/** The lion's layer: its mane, head and chest, down past the picture's foot. */
const LION_AREA: Box = grown({ x: LION.x - 160, y: LION.y - 165, width: 320, height: 370 });

/** The child's roaring mouth, wide open under the nose, and where it opens from. */
const KID_MOUTH = { x: HEAD.x, y: 302, rx: 58, ry: 52 };
const KID_JAW: Box = { x: KID_MOUTH.x - 64, y: KID_MOUTH.y - 58, width: 128, height: 116 };
const KID_JAW_PIVOT = { x: KID_MOUTH.x, y: KID_MOUTH.y - 44 };

/** The costume's mane round the child's face: tufts in a ring, its ears on top. */
const MANE = { x: HEAD.x, y: HEAD.y, r: 180 };
const MANE_AREA: Box = { x: MANE.x - 230, y: MANE.y - 230, width: 460, height: 460 };

/** The lion's mouth wide open (in the picture, at its size), where its roar's waves go out from. */
const LION_ROAR_AT = { x: LION.x, y: LION.y + 66 * LION_SIZE };
/** The roar's waves: arcs from this far out from a mouth, `WAVE_GAP` apart. */
const WAVE_FROM = 130;
const WAVE_GAP = 24;
const WAVE_COUNT = 3;
const wavesArea = (at: { x: number; y: number }): Box => ({ x: at.x - 200, y: at.y - 125, width: 400, height: 250 });

/** The lion's muzzle, its mouths under it. */
const MUZZLE = { y: LION.y + 26 };
const LION_MOUTH = { x: LION.x, y: LION.y + 66, rx: 30, ry: 32 };
const LION_JAW: Box = grown({ x: LION_MOUTH.x - 36, y: LION_MOUTH.y - 40, width: 72, height: 78 });
const LION_SHUT: Box = grown({ x: LION.x - 22, y: MUZZLE.y + 14, width: 44, height: 22 });
const MUZZLE_AREA: Box = grown({ x: LION.x - 58, y: LION.y - 4, width: 116, height: 54 });

/** Draws the lion's parts at its size. */
function Grown({ children }: { children: ReactNode }) {
  return <g transform={`translate(${LION.x} ${LION.y}) scale(${LION_SIZE}) translate(${-LION.x} ${-LION.y})`}>{children}</g>;
}

const MANE_DARK = "#b8601f";
const MANE_LIGHT = "#de8a34";
const LION_FUR = "#f6c165";
const LION_BODY = "#f0b552";
const MOUTH_DARK = "#7a2338";
const TONGUE = "#ff8fab";

/** A ring of round tufts, for a mane. */
function Tufts({ x, y, r, size, count, fill, stroke }: { x: number; y: number; r: number; size: number; count: number; fill: string; stroke?: boolean }) {
  return (
    <g fill={fill} stroke={stroke ? INK : "none"} strokeWidth={4}>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * 2 * Math.PI;
        return <circle key={i} cx={(x + r * Math.sin(a)).toFixed(1)} cy={(y - r * Math.cos(a)).toFixed(1)} r={size} />;
      })}
    </g>
  );
}

/** The costume: a fluffy lion's mane round the child's face, with two round lion's ears on top. */
function CostumeMane() {
  return (
    <>
      <Tufts {...MANE} size={40} count={22} fill={MANE_DARK} stroke />
      <Tufts x={MANE.x} y={MANE.y} r={MANE.r - 18} size={36} count={22} fill={MANE_LIGHT} />
      {([-1, 1] as const).map((s) => {
        const ear = { x: MANE.x + s * 116, y: MANE.y - 140 };
        return (
          <g key={s} stroke={INK} strokeWidth={4}>
            <circle cx={ear.x} cy={ear.y} r={32} fill={MANE_LIGHT} />
            <circle cx={ear.x} cy={ear.y + 2} r={17} fill="#ffc89a" strokeWidth={0} />
          </g>
        );
      })}
    </>
  );
}

/** The child's mouth wide open, roaring: lips round a dark opening, milk teeth above and below, the tongue. */
function KidRoar() {
  const { x, y, rx, ry } = KID_MOUTH;
  const inner = { rx: rx - 10, ry: ry - 10 };
  const edge = (dx: number) => inner.ry * Math.sqrt(1 - (dx / inner.rx) ** 2);
  return (
    <g strokeLinejoin="round">
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={LIP} stroke={INK} strokeWidth={4} />
      <ellipse cx={x} cy={y} rx={inner.rx} ry={inner.ry} fill={MOUTH_DARK} stroke={INK} strokeWidth={3} />
      <ellipse cx={x} cy={y + 18} rx={22} ry={11} fill={TONGUE} />
      {[-24, -12, 0, 12, 24].map((dx) => (
        <rect key={dx} x={x + dx - 5.5} y={y - edge(dx) - 1} width={11} height={12} rx={4} fill="#fff" stroke={INK} strokeWidth={1.5} />
      ))}
      {[-14, 0, 14].map((dx) => (
        <rect key={dx} x={x + dx - 5.5} y={y + edge(dx) - 10} width={11} height={10} rx={4} fill="#fff" stroke={INK} strokeWidth={1.5} />
      ))}
      <path
        d={`M${x - 18} ${y + ry - 5} Q${x} ${y + ry - 1} ${x + 18} ${y + ry - 5}`}
        fill="none"
        stroke="#fff"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.55}
      />
    </g>
  );
}

/** The lion's still parts: chest, mane, ears, face and friendly eyes (muzzle and mouths are layers of their own). */
function LionHead() {
  const { x, y } = LION;
  return (
    <g strokeLinejoin="round">
      <path
        d={`M${x - 125} 600 C${x - 125} 450 ${x - 85} 360 ${x} 360 C${x + 85} 360 ${x + 125} 450 ${x + 125} 600 Z`}
        fill={LION_BODY}
        stroke={INK}
        strokeWidth={5}
      />
      <path d={`M${x - 40} 600 C${x - 40} 470 ${x - 20} 420 ${x} 420 C${x + 20} 420 ${x + 40} 470 ${x + 40} 600`} fill="#fbe1a6" />
      <Tufts x={x} y={y} r={112} size={36} count={18} fill={MANE_DARK} stroke />
      <Tufts x={x} y={y} r={96} size={30} count={18} fill={MANE_LIGHT} />
      {([-1, 1] as const).map((s) => (
        <g key={s} stroke={INK} strokeWidth={4}>
          <circle cx={x + s * 62} cy={y - 74} r={22} fill={LION_FUR} />
          <circle cx={x + s * 62} cy={y - 72} r={11} fill="#f2a37a" strokeWidth={0} />
        </g>
      ))}
      <circle cx={x} cy={y} r={90} fill={LION_FUR} stroke={INK} strokeWidth={5} />
      {([-1, 1] as const).map((s) => (
        <g key={s}>
          <EyeBall x={x + s * 36} y={y - 22} rx={15} ry={17} />
          <Iris x={x + s * 36} y={y - 20} r={11} />
          <EyeLid x={x + s * 36} y={y - 22} rx={15} ry={17} />
          <path
            d={`M${x + s * 22} ${y - 50} Q${x + s * 36} ${y - 58} ${x + s * 50} ${y - 50}`}
            fill="none"
            stroke="#8a4a1c"
            strokeWidth={5}
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  );
}

/** Arcs going out on both sides of a mouth at (x, y): the roar seen, white with the ink line round it. */
function RoarArcs({ x, y, from, gap, count, width }: { x: number; y: number; from: number; gap: number; count: number; width: number }) {
  const a = (35 * Math.PI) / 180;
  const arcs = Array.from({ length: count }, (_, i) => {
    const r = from + i * gap;
    const [dx, dy] = [r * Math.cos(a), r * Math.sin(a)];
    return ([-1, 1] as const).map(
      (s) => `M${(x + s * dx).toFixed(1)} ${(y - dy).toFixed(1)} A${r} ${r} 0 0 ${s > 0 ? 1 : 0} ${(x + s * dx).toFixed(1)} ${(y + dy).toFixed(1)}`,
    );
  }).flat();
  return (
    <g fill="none" strokeLinecap="round">
      {arcs.map((d) => (
        <path key={`o${d}`} d={d} stroke={INK} strokeWidth={width * 1.8} />
      ))}
      {arcs.map((d) => (
        <path key={`i${d}`} d={d} stroke="#fff8e6" strokeWidth={width} />
      ))}
    </g>
  );
}

/** The lion's muzzle and nose, over its mouths. */
function Muzzle() {
  const { x } = LION;
  const { y } = MUZZLE;
  return (
    <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
      <ellipse cx={x - 21} cy={y} rx={29} ry={20} fill="#fff0d2" />
      <ellipse cx={x + 21} cy={y} rx={29} ry={20} fill="#fff0d2" />
      <path
        d={`M${x - 15} ${y - 22} Q${x} ${y - 28} ${x + 15} ${y - 22} Q${x + 8} ${y - 8} ${x} ${y - 6} Q${x - 8} ${y - 8} ${x - 15} ${y - 22} Z`}
        fill="#6b3226"
      />
      <path d={`M${x} ${y - 6} V${y + 6}`} fill="none" />
      {[-1, 1].map((s) => (
        <g key={s} fill="#8a4a1c" stroke="none">
          <circle cx={x + s * 18} cy={y + 2} r={2.5} />
          <circle cx={x + s * 30} cy={y - 4} r={2.5} />
          <circle cx={x + s * 30} cy={y + 8} r={2.5} />
        </g>
      ))}
    </g>
  );
}

/** The lion's mouth shut: a little chin under the muzzle. */
function LionShut() {
  const { x } = LION;
  const y = MUZZLE.y + 18;
  return <path d={`M${x - 14} ${y} Q${x} ${y + 14} ${x + 14} ${y} Z`} fill="#c0504d" stroke={INK} strokeWidth={3} strokeLinejoin="round" />;
}

/** The lion's mouth wide open, roaring – friendly, not fierce: round, its fangs short and round. */
function LionRoar() {
  const { x, y, rx, ry } = LION_MOUTH;
  return (
    <g strokeLinejoin="round">
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={MOUTH_DARK} stroke={INK} strokeWidth={4} />
      <ellipse cx={x} cy={y + 16} rx={18} ry={10} fill={TONGUE} />
      {[-1, 1].map((s) => (
        <g key={s} fill="#fff" stroke={INK} strokeWidth={1.5}>
          <path d={`M${x + s * 22} ${y - 24} Q${x + s * 20} ${y - 6} ${x + s * 15} ${y - 6} Q${x + s * 11} ${y - 10} ${x + s * 10} ${y - 28} Z`} />
          <path d={`M${x + s * 16} ${y + 26} Q${x + s * 15} ${y + 15} ${x + s * 11} ${y + 15} Q${x + s * 7} ${y + 17} ${x + s * 7} ${y + 29} Z`} />
        </g>
      ))}
    </g>
  );
}

/**
 * The lion's scene, both its parts, filling the screen; `free` is the part between the controls and the edges, where the picture has to
 * fit. Drawn once (`memo`): TeethPlay draws again on every frame of the mouth's glide in the mirror meanwhile.
 */
export const Lion = memo(function Lion({ daytime, free }: { daytime: Daytime; free: RefObject<HTMLElement | null> }) {
  const t = useT();
  const scene = useRef<HTMLDivElement>(null);
  const room = useRoom(scene, free);
  const { box, unit } = fitBox(room, FOCUS_BOTH);
  const frame = screenFrame(box, unit);
  const bottom = box.y + box.height;
  const viewBox = `${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.width.toFixed(1)} ${box.height.toFixed(1)}`;
  const space = pictureSpace(box, unit);
  const figure = useFigure();
  // The camera starts close on the lion and draws back to both: the whole picture is scaled as an HTML layer, which
  // the browser moves without painting it again, from showing `close` to showing `box`.
  const close = fitBox(room, FOCUS_LION);
  const camera = {
    "--zoom": (unit / close.unit).toFixed(4),
    "--zoom-x": `${((box.x - close.box.x) / close.unit).toFixed(1)}px`,
    "--zoom-y": `${((box.y - close.box.y) / close.unit).toFixed(1)}px`,
  } as CSSProperties;
  const label = t({
    en: "A lion, and the child in a lion costume beside it: both roar together – three times, louder each time",
    de: "Ein Löwe und daneben das Kind im Löwenkostüm: Beide brüllen zusammen – dreimal, jedes Mal lauter",
    zh: "一只狮子，旁边是穿着狮子服的孩子：两个一起吼——吼三次，一次比一次响",
    hi: "एक शेर, और उसके पास शेर की पोशाक में बच्चा: दोनों साथ दहाड़ते हैं – तीन बार, हर बार और ज़ोर से",
    es: "Un león y, a su lado, el niño disfrazado de león: los dos rugen juntos, tres veces, cada vez más fuerte",
    ar: "أسد، وبجانبه الطفل في زيّ الأسد: يزأران معًا – ثلاث مرات، وكل مرة أعلى من سابقتها",
    ru: "Лев, а рядом ребёнок в костюме льва: оба рычат вместе – три раза, каждый раз громче",
  });
  return (
    <div ref={scene} className={`lion-scene ${daytime}`}>
      <div className="lion-camera" style={camera}>
        {/* A warm sky over a sunny savanna, and the child's shoulders. */}
        <svg className="lion-picture" viewBox={viewBox} role="img" aria-label={label}>
          <defs>
            <linearGradient id="lion-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffe3a3" />
              <stop offset="1" stopColor="#fff4d6" />
            </linearGradient>
          </defs>
          <rect {...frame} fill="url(#lion-sky)" />
          <path
            d={`M${box.x - 20} 360 C${box.x + 200} 320 420 350 600 330 C760 312 ${box.x + box.width} 340 ${box.x + box.width + 20} 335 V${bottom + 20} H${box.x - 20} Z`}
            fill="#f1cf73"
          />
          <path d={`M${box.x - 20} 420 C200 400 500 430 ${box.x + box.width + 20} 410 V${bottom + 20} H${box.x - 20} Z`} fill="#e7bb55" />
          <StoryShoulders id="lion" figure={figure} daytime={daytime} bottom={Math.max(500, bottom + 20)} />
        </svg>

        <div className="teeth-space" style={space}>
          {/* The costume's mane round the face, behind the head and over the shoulders: on from the start. */}
          <Piece area={MANE_AREA} className="lion-still">
            <CostumeMane />
          </Piece>
          <Piece area={{ x: -50, y: 0, width: 540, height: 400 }} className="lion-still">
            <StoryHead id="lion" figure={figure} />
          </Piece>
          {/* The smile gives way to the mouth wide open in each round, and after the last roar the mouth stays open. */}
          <Piece area={CLOSED_AREA} className="lion-kid-smile">
            <ClosedMouth />
          </Piece>
          <Piece area={KID_JAW} pivot={KID_JAW_PIVOT} className="lion-kid-roar">
            <KidRoar />
          </Piece>
          {/* The roar seen: waves going out from both mouths while they roar. */}
          <Piece area={wavesArea(KID_MOUTH)} className="lion-waves">
            <RoarArcs x={KID_MOUTH.x} y={KID_MOUTH.y} from={WAVE_FROM} gap={WAVE_GAP} count={WAVE_COUNT} width={7} />
          </Piece>
          <Piece area={wavesArea(LION_ROAR_AT)} className="lion-waves">
            <RoarArcs x={LION_ROAR_AT.x} y={LION_ROAR_AT.y} from={WAVE_FROM} gap={WAVE_GAP} count={WAVE_COUNT} width={7} />
          </Piece>

          {/* The lion beside the child, seen first; it leans into each roar a little more. */}
          <Piece
            area={LION_AREA}
            pivot={{ x: LION.x, y: 480 }}
            className="lion-lion"
            over={
              <>
                <Piece area={LION_SHUT} within={LION_AREA} className="lion-lion-shut">
                  <Grown>
                    <LionShut />
                  </Grown>
                </Piece>
                <Piece area={LION_JAW} within={LION_AREA} pivot={{ x: LION_MOUTH.x, y: LION_JAW.y }} className="lion-lion-jaw">
                  <Grown>
                    <LionRoar />
                  </Grown>
                </Piece>
                <Piece area={MUZZLE_AREA} within={LION_AREA} className="lion-still">
                  <Grown>
                    <Muzzle />
                  </Grown>
                </Piece>
              </>
            }
          >
            <Grown>
              <LionHead />
            </Grown>
          </Piece>
        </div>
      </div>

      {/* The mirror's frame stays at the screen's edge, over everything. */}
      <svg className="lion-frame" viewBox={viewBox} aria-hidden>
        <FrameStroke frame={frame} unit={unit} />
      </svg>
    </div>
  );
});
