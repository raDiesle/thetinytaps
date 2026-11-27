// What is seen inside the open mouth behind the teeth: the throat with the soft palate and the uvula at its back, the
// tongue lying on the mouth's floor and the hard palate's roof (user request, November 2026: the tongue should be
// plainly a tongue, and the throat should show). Drawn in the still picture of the mirror, under the teeth. Its look
// („natürlich weich“) was picked by the user from four drawn side by side (November 2026): soft, natural pinks, the
// tongue with no hard outline, a groove down its middle and a soft light, a few soft ridges across the palate's front.
import type { MouthModel, Projector, Vec3 } from "./jaw";

/** A point on the screen, in picture units. */
type Point2 = { x: number; y: number };

/** The colours of the inside of the mouth. */
export const INSIDE = {
  /** The dark of the mouth behind the teeth. */
  dark: "#6b1d36",
  /** The throat at the back, deepest in its middle. */
  throat: "#3a0c1d",
  /** The soft palate's arch hanging over the throat, and the uvula in its middle, with their soft edge. */
  softPalate: "#e57d93",
  softEdge: "#c45a74",
  /** The tongue, its light and the groove down its middle. */
  tongue: "#f2849a",
  tongueLight: "#f9aab9",
  groove: "#d4607b",
  /** The hard palate's roof and the ridges across its front. */
  palate: "#d9758d",
  ridges: "#c45c77",
};

const fmt = (p: Point2) => `${Math.round(p.x * 10) / 10} ${Math.round(p.y * 10) / 10}`;
const box = (points: Point2[]) => ({
  x0: Math.min(...points.map((p) => p.x)),
  x1: Math.max(...points.map((p) => p.x)),
  y0: Math.min(...points.map((p) => p.y)),
  y1: Math.max(...points.map((p) => p.y)),
});

/** A smooth curve through the points (Catmull-Rom as cubic Béziers), closed or open. */
function smooth(points: Point2[], closed = true) {
  const n = points.length;
  const at = (i: number) => (closed ? points[((i % n) + n) % n] : points[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${fmt(points[0])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    d += ` C${fmt({ x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 })} ${fmt({ x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 })} ${fmt(p2)}`;
  }
  return closed ? `${d}Z` : d;
}

/** The ids of the inside's clip and throat shading: one mirror is on the page at a time. */
const CLIP_ID = "mouth-inside-clip";
const THROAT_ID = "mouth-inside-throat";

/**
 * The inside of the open mouth, in the dark opening between the rows (`cavity`, its outline, and `hull`, its points):
 * the throat at the back with the soft palate and uvula over it, the tongue in front of it and the hard palate's roof.
 * The tongue is the model's, lying on the floor, where the lower jaw is tipped to show it (`tongueUp`); else only its
 * back is seen as a hump rising behind the lower teeth. The throat hangs from the palate's back edge where the palate
 * shows (`palateDown`), else from the opening's top.
 */
export function MouthInside({
  model,
  upper,
  lower,
  cavity,
  hull,
  tongueUp,
  palateDown,
}: {
  model: MouthModel;
  upper: Projector;
  lower: Projector;
  cavity: string;
  hull: Point2[];
  tongueUp: boolean;
  palateDown: boolean;
}) {
  const { x0, x1, y0, y1 } = box(hull);
  const cx = (x0 + x1) / 2;
  const w = x1 - x0;
  const palate = model.palate.map(upper.point);
  const tongue = model.tongue.map(lower.point);
  // Where the throat begins at the top (the palate's back edge, or the opening's top) and where the tongue's back is.
  const top = palateDown ? Math.max(...palate.filter((p) => Math.abs(p.x - cx) < w * 0.2).map((p) => p.y), y0) : y0;
  const back = tongueUp ? Math.min(...tongue.map((p) => p.y)) : y1 - 0.42 * (y1 - top);
  const gap = Math.max(8, back - top);
  const uvula = Math.min(w * 0.05, gap * 0.16);

  // The soft palate: a band at the top whose lower edge arches up over the throat, the uvula hanging from its middle
  // (drawn first, so the band covers its top).
  const band = smooth([
    { x: x0 - 40, y: top - 60 },
    { x: x1 + 40, y: top - 60 },
    { x: x1 + 40, y: back + gap * 0.3 },
    { x: cx + w * 0.36, y: back + gap * 0.1 },
    { x: cx + w * 0.2, y: top + gap * 0.35 },
    { x: cx, y: top + gap * 0.18 },
    { x: cx - w * 0.2, y: top + gap * 0.35 },
    { x: cx - w * 0.36, y: back + gap * 0.1 },
    { x: x0 - 40, y: back + gap * 0.3 },
  ]);
  const drop = `M${fmt({ x: cx - uvula, y: top })} C${fmt({ x: cx - uvula, y: top + gap * 0.42 })} ${fmt({ x: cx - uvula * 1.05, y: top + gap * 0.6 })} ${fmt({ x: cx, y: top + gap * 0.62 })} C${fmt({ x: cx + uvula * 1.05, y: top + gap * 0.6 })} ${fmt({ x: cx + uvula, y: top + gap * 0.42 })} ${fmt({ x: cx + uvula, y: top })}Z`;

  // The tongue's back seen over the lower teeth where the floor is not tipped into view: a rounded hump.
  const humpRy = (y1 - back) * 1.15;
  const hump = { cx, cy: back + humpRy, rx: w * 0.4, ry: humpRy };
  const groove = tongueUp
    ? smooth(
        ([80, 60, 40, 20, 4] as const).map((z) => lower.point(onTongue(model, z))),
        false,
      )
    : `M${fmt({ x: cx, y: back + (y1 - back) * 0.3 })} Q${fmt({ x: cx + 1, y: back + (y1 - back) * 0.7 })} ${fmt({ x: cx, y: y1 + 10 })}`;
  const t = box(tongue);
  const light = tongueUp
    ? { cx: (t.x0 + t.x1) / 2 - (t.x1 - t.x0) * 0.17, cy: t.y0 + (t.y1 - t.y0) * 0.45, rx: (t.x1 - t.x0) * 0.13, ry: (t.y1 - t.y0) * 0.16 }
    : { cx: cx - w * 0.15, cy: back + (y1 - back) * 0.45, rx: w * 0.08, ry: (y1 - back) * 0.2 };
  const tongueMarks = (
    <>
      <ellipse {...light} fill={INSIDE.tongueLight} opacity={0.5} />
      <path d={groove} fill="none" stroke={INSIDE.groove} strokeWidth={3} strokeLinecap="round" opacity={0.8} />
    </>
  );

  return (
    <g>
      <defs>
        <clipPath id={CLIP_ID}>
          <path d={cavity} />
        </clipPath>
        <radialGradient id={THROAT_ID} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={INSIDE.throat} />
          <stop offset="1" stopColor={INSIDE.throat} stopOpacity={0} />
        </radialGradient>
      </defs>
      <path d={cavity} fill={INSIDE.dark} />
      <g clipPath={`url(#${CLIP_ID})`}>
        <ellipse cx={cx} cy={top + gap * 0.62} rx={w * 0.35} ry={gap * 0.7} fill={`url(#${THROAT_ID})`} />
        <path d={drop} fill={INSIDE.softPalate} stroke={INSIDE.softEdge} strokeWidth={2} />
        <path d={band} fill={INSIDE.softPalate} stroke={INSIDE.softEdge} strokeWidth={2} />
        {!tongueUp && (
          <>
            <ellipse {...hump} fill={INSIDE.tongue} />
            {tongueMarks}
          </>
        )}
      </g>
      {tongueUp && (
        <>
          <path d={smooth(tongue)} fill={INSIDE.tongue} />
          {tongueMarks}
        </>
      )}
      {palateDown && (
        <>
          <path d={smooth(palate)} fill={INSIDE.palate} />
          {palateRidges(model, upper).map((d, i) => (
            <path key={i} d={d} fill="none" stroke={INSIDE.ridges} strokeWidth={2.5} strokeLinecap="round" opacity={0.75} />
          ))}
        </>
      )}
    </g>
  );
}

/** A point on the tongue's top along its middle, `z` from its back (about -28) to its tip (88). */
function onTongue(model: MouthModel, z: number): Vec3 {
  const floor = Math.min(...model.tongue.map((p) => p[1]));
  return [0, floor + 10, z];
}

/** A few soft ridges across the hard palate's front, as seen through the upper jaw's projector. */
function palateRidges(model: MouthModel, upper: Projector): string[] {
  const y = model.palate[0][1] + 0.5;
  // Each ridge a soft wave from near the middle out and back towards the throat, as the rugae behind the front teeth.
  const ridge = (z: number, reach: number, side: 1 | -1) =>
    smooth(
      [0.15, 0.4, 0.65, 0.9].map((k) => upper.point([side * reach * k * 1.3, y, z - 10 * k * k + 2.5 * Math.sin(k * 9)])),
      false,
    );
  return ([1, -1] as const).flatMap((s) => [ridge(82, 30, s), ridge(72, 36, s), ridge(62, 34, s)]);
}
