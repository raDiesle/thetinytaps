import { type CSSProperties, memo } from "react";
import type { Daytime } from "@/lib/days";

// The basin seen from above, as a child stands at it on its stool: tiles on the wall behind, the counter, the white
// basin with its drain, the chrome mixer tap behind it (a blue dot on its right for cold, a red one on its left for
// warm), the pink soap pump on its left and the teal towel hanging from its hook on the right – the bathroom of the
// painted pictures (`handwashPictures.ts`). The picture is 1600 × 900 units (16 : 9, the video's stage); it is drawn
// once and lies still, and every part that moves (the tap's lever, the water, the pump's head, the towel's side that
// folds round the hands) is an HTML layer of its own over it, placed in the same units by `place`.

/** The picture's size in units. */
export const STAGE_W = 1600;
export const STAGE_H = 900;

/** A box in picture units. */
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Where a layer lies on the stage: a box in picture units as percentages of the stage. */
export const place = ({ x, y, width, height }: Box): CSSProperties => ({
  left: `${(x / STAGE_W) * 100}%`,
  top: `${(y / STAGE_H) * 100}%`,
  width: `${(width / STAGE_W) * 100}%`,
  height: `${(height / STAGE_H) * 100}%`,
});

/** Where the water comes out of the tap. */
export const SPOUT = { x: 800, y: 332 };

/** The layers' places on the stage. */
export const AREAS = {
  left: { x: 440, y: 240, width: 340, height: 700 },
  right: { x: 820, y: 240, width: 340, height: 700 },
  lever: { x: 706, y: 104, width: 120, height: 110 },
  stream: { x: SPOUT.x - 26, y: SPOUT.y - 4, width: 52, height: 370 },
  splash: { x: SPOUT.x - 70, y: 664, width: 140, height: 70 },
  pumpHead: { x: 500, y: 110, width: 150, height: 100 },
  towelWrap: { x: 1180, y: 150, width: 380, height: 520 },
} satisfies Record<string, Box>;

/** A point in picture units. */
type Pt = readonly [number, number];

/** A point on the cubic curve a–b–c–d at t. */
const cubic = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): Pt => {
  const u = 1 - t;
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [k[0] * a[0] + k[1] * b[0] + k[2] * c[0] + k[3] * d[0], k[0] * a[1] + k[1] * b[1] + k[2] * c[1] + k[3] * d[1]];
};

/** The gooseneck's middle line, from the foot up the column, over its arch and down to the outlet over the basin. */
const NECK: Pt[] = (() => {
  const points: Pt[] = [];
  for (let i = 0; i <= 8; i++) points.push([786, 214 - (i / 8) * 76]);
  const arch: [Pt, Pt, Pt, Pt] = [
    [786, 138],
    [786, 78],
    [824, 62],
    [830, 112],
  ];
  const down: [Pt, Pt, Pt, Pt] = [
    [830, 112],
    [836, 168],
    [804, 250],
    [800, SPOUT.y - 12],
  ];
  for (let i = 1; i <= 24; i++) points.push(cubic(...arch, i / 24));
  for (let i = 1; i <= 24; i++) points.push(cubic(...down, i / 24));
  return points;
})();

/** How wide the tube is at a share of its length: slim at the back, wider as it comes towards the eye. */
const neckWidth = (share: number) => 30 + 22 * share * share;

/** A strip along the gooseneck between two sides of its middle line (-0.5 its left edge, 0.5 its right), as a path. */
function neckStrip(from: number, to: number): string {
  const side = (at: number) =>
    NECK.map((p, i) => {
      const q = NECK[Math.min(i + 1, NECK.length - 1)];
      const o = NECK[Math.max(i - 1, 0)];
      const dx = q[0] - o[0];
      const dy = q[1] - o[1];
      const length = Math.hypot(dx, dy) || 1;
      const w = neckWidth(i / (NECK.length - 1)) * at;
      return `${(p[0] - (dy / length) * w).toFixed(1)} ${(p[1] + (dx / length) * w).toFixed(1)}`;
    });
  return `M${side(from).join(" L")} L${side(to).reverse().join(" L")} Z`;
}

/** The gooseneck's outline, its shaded side and its long light, worked out once. */
const NECK_BODY = neckStrip(-0.5, 0.5);
const NECK_SHADE = neckStrip(0.12, 0.5);
const NECK_LIGHT = neckStrip(-0.34, -0.14);

const CHROME_STOPS = (
  <>
    <stop offset="0" stopColor="#8d99a6" />
    <stop offset="0.3" stopColor="#f4f8fb" />
    <stop offset="0.55" stopColor="#c3ccd5" />
    <stop offset="0.8" stopColor="#eef3f7" />
    <stop offset="1" stopColor="#7d8996" />
  </>
);

/** The terry cloth's loops, shared by the hanging towel and its side folding round the hands. */
function Terry({ id }: { id: string }) {
  return (
    <pattern id={id} width={14} height={14} patternUnits="userSpaceOnUse">
      <rect width={14} height={14} fill="#5fc2b6" />
      <circle cx={4} cy={4} r={2.6} fill="#79d2c7" />
      <circle cx={11} cy={10} r={2.6} fill="#4fb0a4" />
    </pattern>
  );
}

/** The still picture: wall, counter, basin, tap, the soap bottle (its head is a layer of its own) and the towel. */
export const SinkPicture = memo(function SinkPicture({ daytime, label }: { daytime: Daytime; label: string }) {
  return (
    <svg className="hw-sink" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} role="img" aria-label={label}>
      <defs>
        <pattern id="hw-tiles" width={80} height={80} patternUnits="userSpaceOnUse">
          <rect width={80} height={80} fill={daytime === "evening" ? "#cfe3f2" : "#dff0fb"} />
          <path d="M0 1 H80 M1 0 V80" stroke="#b3d3e8" strokeWidth={4} />
          <path d="M10 16 Q10 10 16 10 H28" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
        </pattern>
        <linearGradient id="hw-wall-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#3a5a70" stopOpacity={0.22} />
        </linearGradient>
        <linearGradient id="hw-counter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6d6c2" />
          <stop offset="0.25" stopColor="#f2e8db" />
          <stop offset="1" stopColor="#f8f1e7" />
        </linearGradient>
        <radialGradient id="hw-rim" cx="0.5" cy="0.4" r="0.62">
          <stop offset="0.7" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d8e3eb" />
        </radialGradient>
        <radialGradient id="hw-bowl" cx="0.5" cy="0.78" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#eaf1f6" />
          <stop offset="1" stopColor="#a9bccb" />
        </radialGradient>
        <linearGradient id="hw-chrome" x1="0" y1="0" x2="1" y2="0">
          {CHROME_STOPS}
        </linearGradient>
        <radialGradient id="hw-drain" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#f4f8fb" />
          <stop offset="1" stopColor="#7d8996" />
        </radialGradient>
        <linearGradient id="hw-soap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e68fb7" />
          <stop offset="0.35" stopColor="#ffd2e7" />
          <stop offset="1" stopColor="#d97aa6" />
        </linearGradient>
        <linearGradient id="hw-towel-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity={0.28} />
          <stop offset="0.25" stopColor="#000" stopOpacity={0} />
          <stop offset="0.55" stopColor="#fff" stopOpacity={0.12} />
          <stop offset="1" stopColor="#000" stopOpacity={0.3} />
        </linearGradient>
        <Terry id="hw-terry" />
        <filter id="hw-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>
      {/* The wall, darker down where it meets the counter, and the counter's front edge in light. */}
      <rect width={STAGE_W} height={210} fill="url(#hw-tiles)" />
      <rect width={STAGE_W} height={210} fill="url(#hw-wall-shade)" />
      <rect y={196} width={STAGE_W} height={STAGE_H - 196} fill="url(#hw-counter)" />
      <rect y={196} width={STAGE_W} height={12} fill="#cdbba5" />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={(i * 397) % STAGE_W} cy={240 + ((i * 211) % 640)} r={2 + (i % 3)} fill="#c9b8a2" opacity={0.3} />
      ))}
      {/* The basin: its shadow on the counter, the rim, and the bowl going down into it, dark under the far rim. */}
      <ellipse cx={802} cy={676} rx={512} ry={322} fill="#6f5f4e" opacity={0.25} filter="url(#hw-blur)" />
      <ellipse cx={790} cy={652} rx={500} ry={318} fill="url(#hw-rim)" stroke="#c4d0d9" strokeWidth={4} />
      <ellipse cx={790} cy={676} rx={418} ry={254} fill="url(#hw-bowl)" stroke="#b8c7d2" strokeWidth={3} />
      <path d="M392 620 Q790 400 1188 620" fill="none" stroke="#8ea3b3" strokeWidth={30} opacity={0.22} filter="url(#hw-blur)" />
      <path d="M430 790 Q790 960 1150 790" fill="none" stroke="#fff" strokeWidth={10} opacity={0.6} strokeLinecap="round" />
      <ellipse cx={800} cy={712} rx={40} ry={26} fill="#7d8996" opacity={0.25} filter="url(#hw-blur)" />
      <ellipse cx={800} cy={704} rx={36} ry={24} fill="url(#hw-drain)" stroke="#6f7b88" strokeWidth={3} />
      {[-10, 0, 10].map((d) => (
        <path key={d} d={`M${786} ${704 + d} H${814}`} stroke="#5d6874" strokeWidth={4} strokeLinecap="round" />
      ))}
      {/* The mixer tap: its round foot with the warm and cold dots, a slim column rising from it and the gooseneck
          arching over and coming down towards the eye, wider as it comes nearer, its outlet right over the basin. Its
          shadow falls on the counter; the lever is a layer of its own on the column's side. */}
      <ellipse cx={800} cy={232} rx={70} ry={22} fill="#6f7b88" opacity={0.3} filter="url(#hw-blur)" />
      <path d={NECK_BODY} fill="#5d6874" opacity={0.18} filter="url(#hw-blur)" transform="translate(14 26)" />
      <ellipse cx={792} cy={218} rx={70} ry={21} fill="#7d8996" />
      <ellipse cx={792} cy={212} rx={70} ry={21} fill="url(#hw-chrome)" stroke="#6f7b88" strokeWidth={3} />
      <circle cx={740} cy={214} r={7} fill="#f05a4a" stroke="#b33a2e" strokeWidth={2} />
      <circle cx={848} cy={212} r={7} fill="#3d8ff0" stroke="#2862a8" strokeWidth={2} />
      <path d={NECK_BODY} fill="#c3ccd5" stroke="#6f7b88" strokeWidth={3} strokeLinejoin="round" />
      <path d={NECK_SHADE} fill="#7d8996" opacity={0.55} />
      <path d={NECK_LIGHT} fill="#fff" opacity={0.85} />
      <ellipse cx={800} cy={SPOUT.y - 8} rx={26} ry={10} fill="#c3ccd5" stroke="#6f7b88" strokeWidth={3} />
      <ellipse cx={800} cy={SPOUT.y - 6} rx={17} ry={6} fill="#4c5660" />
      {/* The soap bottle on the left, its head with the nozzle lying over it. */}
      <ellipse cx={546} cy={324} rx={74} ry={20} fill="#6f5f4e" opacity={0.28} filter="url(#hw-blur)" />
      <rect x={476} y={188} width={124} height={136} rx={34} fill="url(#hw-soap)" stroke="#c0628f" strokeWidth={3} />
      <rect x={494} y={206} width={20} height={92} rx={10} fill="#fff" opacity={0.55} />
      <circle cx={556} cy={262} r={18} fill="#fff" opacity={0.55} />
      <rect x={520} y={170} width={36} height={24} rx={6} fill="#f2f2f2" stroke="#9a9a9a" strokeWidth={2} />
      {/* The towel hanging from its hook on the right: its shadow on the wall and counter, the soft folds, the stripes. */}
      <circle cx={1380} cy={30} r={14} fill="url(#hw-chrome)" stroke="#6f7b88" strokeWidth={3} />
      <path d="M1236 74 Q1380 30 1524 74 L1546 664 Q1390 700 1226 664 Z" fill="#33524c" opacity={0.25} filter="url(#hw-blur)" transform="translate(16 18)" />
      <path d="M1230 70 Q1380 22 1530 70 L1548 650 Q1390 684 1222 650 Z" fill="url(#hw-terry)" stroke="#3f9a8e" strokeWidth={5} strokeLinejoin="round" />
      <path d="M1230 70 Q1380 22 1530 70 L1548 650 Q1390 684 1222 650 Z" fill="url(#hw-towel-shade)" />
      {[1300, 1380, 1460].map((x, i) => (
        <path key={i} d={`M${x} 60 Q${x + 12} 340 ${x - 6} 660`} fill="none" stroke="#2f7f75" strokeWidth={6} opacity={0.22} strokeLinecap="round" />
      ))}
      <path d="M1226 560 Q1390 590 1546 560 L1547 584 Q1390 614 1225 584 Z" fill="#fff" opacity={0.85} />
      <path d="M1225 598 Q1390 628 1547 598 L1547 614 Q1390 644 1224 614 Z" fill="#ffcf5a" />
    </svg>
  );
});

/** The tap's lever: lifted to let the water run, turned to the blue dot for cold and towards the red one for warm. */
export const LeverArt = memo(function LeverArt() {
  return (
    <svg viewBox="0 0 120 110" aria-hidden>
      <defs>
        <linearGradient id="hw-lever" x1="0" y1="0" x2="1" y2="0">
          {CHROME_STOPS}
        </linearGradient>
      </defs>
      <path d="M48 70 L52 14 Q60 4 68 14 L72 70 Z" fill="url(#hw-lever)" stroke="#6f7b88" strokeWidth={3} strokeLinejoin="round" />
      <circle cx={60} cy={72} r={20} fill="url(#hw-lever)" stroke="#6f7b88" strokeWidth={3} />
      <circle cx={54} cy={66} r={5} fill="#fff" opacity={0.8} />
    </svg>
  );
});

/** The water falling from the spout: light stripes running down inside the stream, and a cold blue over it while cold. */
export function Stream() {
  return (
    <div className="hw-stream-clip">
      <div className="hw-stream-flow" />
      <div className="hw-stream-cold" />
    </div>
  );
}

/** Where the water lands in the basin: a ring of splashing water. */
export const SplashArt = memo(function SplashArt() {
  return (
    <svg viewBox="-70 -35 140 70" aria-hidden>
      <ellipse cx={0} cy={0} rx={60} ry={24} fill="none" stroke="#9fd3f0" strokeWidth={5} opacity={0.7} />
      <ellipse cx={0} cy={0} rx={34} ry={13} fill="#d8f0ff" opacity={0.8} />
      {[-48, -22, 24, 50].map((x, i) => (
        <circle key={i} cx={x} cy={-14 - (i % 2) * 8} r={4} fill="#bfe6fb" />
      ))}
    </svg>
  );
});

/** The pump's head, its nozzle reaching out over the basin, pressed down to give the soap. */
export const PumpHeadArt = memo(function PumpHeadArt() {
  return (
    <svg viewBox="0 0 150 100" aria-hidden>
      <rect x={28} y={40} width={20} height={56} fill="#e6e6e6" stroke="#9a9a9a" strokeWidth={2} />
      <path d="M8 26 Q8 14 20 14 L60 14 Q72 14 72 26 L72 44 L8 44 Z" fill="#fafafa" stroke="#9a9a9a" strokeWidth={3} />
      <path d="M70 22 L132 40 Q142 43 140 52 L139 56 L70 40 Z" fill="#fafafa" stroke="#9a9a9a" strokeWidth={3} strokeLinejoin="round" />
      <ellipse cx={139} cy={54} rx={4} ry={3} fill="#c46a96" />
      <rect x={18} y={20} width={30} height={8} rx={4} fill="#fff" />
    </svg>
  );
});

/**
 * The towel's free side, folded round the hands: it lies over them while they rub inside, so they really are in the
 * towel (user feedback, 25 November 2026: a towel lying flat on top of the hands is not how hands are dried).
 */
export const TowelWrapArt = memo(function TowelWrapArt() {
  return (
    <svg viewBox="0 0 380 520" overflow="visible" aria-hidden>
      <defs>
        <Terry id="hw-terry-wrap" />
        <linearGradient id="hw-wrap-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={0.3} />
          <stop offset="0.12" stopColor="#fff" stopOpacity={0.05} />
          <stop offset="0.5" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.3} />
        </linearGradient>
        <filter id="hw-wrap-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={12} />
        </filter>
      </defs>
      {/* Its shadow on the hands below it, then the cloth, rounded where it folds over at the left. */}
      <path d="M30 40 Q10 260 34 500 L380 512 L380 30 Z" fill="#23413b" opacity={0.3} filter="url(#hw-wrap-blur)" transform="translate(-14 14)" />
      <path d="M44 24 Q-6 60 4 260 Q-4 460 40 504 L380 516 L380 12 Z" fill="url(#hw-terry-wrap)" stroke="#3f9a8e" strokeWidth={5} strokeLinejoin="round" />
      <path d="M44 24 Q-6 60 4 260 Q-4 460 40 504 L380 516 L380 12 Z" fill="url(#hw-wrap-shade)" />
      <path d="M34 40 Q8 260 32 492" fill="none" stroke="#fff" strokeWidth={9} opacity={0.35} strokeLinecap="round" />
      {[110, 200, 290].map((x, i) => (
        <path key={i} d={`M${x} 24 Q${x - 16} 260 ${x + 6} 508`} fill="none" stroke="#2f7f75" strokeWidth={6} opacity={0.22} strokeLinecap="round" />
      ))}
      <path d="M12 420 Q190 434 380 424 L380 446 Q190 456 14 442 Z" fill="#fff" opacity={0.85} />
      <path d="M18 458 Q190 470 380 460 L380 474 Q190 484 22 472 Z" fill="#ffcf5a" />
    </svg>
  );
});
