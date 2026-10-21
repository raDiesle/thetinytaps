import { useMemo, useRef, type CSSProperties, type PointerEvent } from "react";
import { STAR_PATH } from "@/components/Bursts";
import {
  buildMouth,
  PICTURE,
  projectors,
  toothKey,
  type Face,
  type FaceKind,
  type Jaw,
  type Point2,
  type Projector,
  type Surface,
  type ToothId,
  type Vec3,
  type View,
} from "./jaw";
import type { Motion } from "./steps";

// A child's face in a mirror, close up. The mouth is a small 3D model (see
// jaw.ts), so the picture can turn and tilt to show exactly where to brush.

export const INK = "#2a1e5c";
export const SKIN = "#f7c9a1";
const TOOTH_FILLS: Record<FaceKind, string> = { outer: "#fffdf6", top: "#fbeed0", inner: "#f2e6d2", side: "#e6d8bd" };
const GUM_FILLS: Record<FaceKind, string> = { outer: "#ff8fab", top: "#ffa6bc", inner: "#f27c9c", side: "#ff8fab" };
const ZONE_FILL = "#fff2a8";
const MIN_FACING = 0.03;
/** Monsters still waiting for a later step only show where their side of the tooth clearly faces out of the mouth. */
const WAITING_FACING = 0.25;
const HEAD = 270;
const MONSTER_SIZE = 1.15;
const WAITING_SIZE = 0.72;

export interface MonsterSpot {
  id: number;
  tooth: ToothId;
  surface: Surface;
  /** Where along the tooth: 2 is the middle, 1 and 3 nearer its ends (molars have room for two). */
  spot: number;
  color: string;
  /** Horns, feelers or spiky hair. */
  variant: number;
  /** When it pops up, so they don't all appear at once. */
  delayMs: number;
  /** On a tooth that comes later: a bit smaller, and only where it clearly shows. */
  waiting: boolean;
  /** The brush is coming for this one. */
  scared: boolean;
  gone: boolean;
  tickled: boolean;
}

/** Arrows on the lips: open up wide, or bite together. */
export type MouthAction = "open" | "close";

interface MouthProps {
  view: View;
  /** The surfaces being brushed now. */
  zone: { surface: Surface; teeth: ToothId[] } | null;
  monsters: MonsterSpot[];
  brush: { tooth: ToothId; surface: Surface; motion: Motion } | null;
  /** All clean: sparkles and smiling eyes. */
  happy: boolean;
  /** Shown while the child should open or close their mouth. */
  action: MouthAction | null;
  onTickle: (id: number) => void;
}

type Project = Projector;

const fmt = (p: { x: number; y: number }) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;

/** A polygon with its corners rounded off by up to `radius`. */
function roundedPath(points: { x: number; y: number }[], radius = 3) {
  const n = points.length;
  let d = "";
  points.forEach((cur, i) => {
    const toward = (other: { x: number; y: number }) => {
      const length = Math.hypot(other.x - cur.x, other.y - cur.y) || 1;
      const k = Math.min(0.5, radius / length);
      return { x: cur.x + (other.x - cur.x) * k, y: cur.y + (other.y - cur.y) * k };
    };
    const a = toward(points[(i - 1 + n) % n]);
    const b = toward(points[(i + 1) % n]);
    d += `${i === 0 ? "M" : "L"}${fmt(a)} Q${fmt(cur)} ${fmt(b)} `;
  });
  return `${d}Z`;
}

/** A smooth closed curve through the points (Catmull-Rom as cubic Béziers). */
function smoothPath(points: { x: number; y: number }[]) {
  const n = points.length;
  let d = `M${fmt(points[0])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [points[(i - 1 + n) % n], points[i], points[(i + 1) % n], points[(i + 2) % n]];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${fmt(c1)} ${fmt(c2)} ${fmt(p2)}`;
  }
  return `${d}Z`;
}

const facePath = (face: Face, project: Project, radius = 3) => roundedPath(face.points.map(project.point), radius);

const surfaceFace = (faces: Face[], surface: Surface) => faces.find((f) => f.kind === surface)!;

/** A tipped jaw goes on top; otherwise the far one first (looking down, the upper teeth are nearer). */
const jawOrder = (view: View): Jaw[] => {
  if (Math.abs(view.tilt.upper) > Math.abs(view.tilt.lower)) return ["lower", "upper"];
  if (Math.abs(view.tilt.lower) > 0) return ["upper", "lower"];
  return view.pitch >= 0 ? ["lower", "upper"] : ["upper", "lower"];
};

export function Mouth({ view, zone, monsters, brush, happy, action, onTickle }: MouthProps) {
  const model = useMemo(() => buildMouth(view.open), [view.open]);
  const all = projectors(view);
  const project = all.face;
  const zoneKeys = new Set(zone?.teeth.map(toothKey));
  const teethByKey = new Map(model.teeth.map((t) => [t.key, t]));
  const toothFace = (id: ToothId, surface: Surface) => surfaceFace(teethByKey.get(toothKey(id))!.faces, surface);

  const head = project.point([0, 20, -60]);
  const lipPoints = model.lips.map(project.point);
  const lipsPath = smoothPath(lipPoints);

  const jawParts = jawOrder(view).map((jaw) => {
    const project = all[jaw];
    const p = project.point;
    const gums = model.gums.filter((g) => g.jaw === jaw).sort((a, b) => p(a.center).depth - p(b.center).depth);
    const teeth = model.teeth.filter((t) => t.id.jaw === jaw).sort((a, b) => p(a.center).depth - p(b.center).depth);
    return (
      <g key={jaw}>
        {gums.flatMap((g, i) =>
          g.faces
            .filter((f) => project.facing(f.normal) > MIN_FACING)
            .map((f, j) => {
              const d = facePath(f, project);
              return <path key={`${i}-${j}`} d={d} fill={GUM_FILLS[f.kind]} stroke={GUM_FILLS[f.kind]} strokeWidth={1.5} />;
            }),
        )}
        {teeth.map((t) => (
          <g key={t.key}>
            {t.faces
              // Slivers of the sides between teeth only add clutter.
              .filter((f) => project.facing(f.normal) > (f.kind === "side" ? 0.3 : MIN_FACING))
              .map((f, j) => (
                <path
                  key={j}
                  d={facePath(f, project, f.kind === "outer" ? 7 : 3)}
                  fill={zone && f.kind === zone.surface && zoneKeys.has(t.key) ? ZONE_FILL : TOOTH_FILLS[f.kind]}
                  stroke={INK}
                  strokeWidth={2.2}
                  strokeLinejoin="round"
                />
              ))}
            {project.facing(surfaceFace(t.faces, "outer").normal) > 0.55 && (
              <path d={`M${fmt(p(t.shine[0]))} L${fmt(p(t.shine[1]))}`} stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
            )}
            {t.groove && project.facing(surfaceFace(t.faces, "top").normal) > 0.25 && (
              <path d={`M${t.groove.map((g) => fmt(p(g))).join(" L")}`} fill="none" stroke="#d9c49a" strokeWidth={2} strokeLinecap="round" />
            )}
          </g>
        ))}
      </g>
    );
  });

  const tongueUp = all.lower.facing([0, 1, 0.2]) > 0.05;
  const palateDown = all.upper.facing([0, -1, 0.2]) > 0.05;

  return (
    <svg className="mouth" viewBox={`0 0 ${PICTURE.width} ${PICTURE.height}`} role="img" aria-label="Ein Kindergesicht im Spiegel beim Zähneputzen">
      <defs>
        <clipPath id="mirror">
          <rect x={10} y={10} width={PICTURE.width - 20} height={PICTURE.height - 20} rx={70} />
        </clipPath>
        <clipPath id="mouth-inside">
          <path d={lipsPath} />
        </clipPath>
      </defs>

      <rect x={10} y={10} width={PICTURE.width - 20} height={PICTURE.height - 20} rx={70} fill="#dff6ff" />
      <g clipPath="url(#mirror)">
        <Face project={project} head={head} happy={happy} open={view.open} />

        <g clipPath="url(#mouth-inside)">
          <path d={lipsPath} fill="#5c1430" />
          {tongueUp && <path d={smoothPath(model.tongue.map(all.lower.point))} fill="#ff6f91" stroke="#d94f74" strokeWidth={3} />}
          {palateDown && <path d={smoothPath(model.palate.map(all.upper.point))} fill="#c94a6e" />}
          {jawParts}
          {zone?.teeth.map((id) => {
            const face = toothFace(id, zone.surface);
            const at = all[id.jaw];
            if (at.facing(face.normal) <= MIN_FACING) return null;
            return (
              <path
                key={toothKey(id)}
                className="zone-glow"
                d={facePath(face, at)}
                fill="none"
                stroke="#ffd23f"
                strokeWidth={5}
                strokeLinejoin="round"
              />
            );
          })}
        </g>

        <path d={lipsPath} fill="none" stroke={INK} strokeWidth={34} strokeLinejoin="round" />
        <path d={lipsPath} fill="none" stroke="#ff7088" strokeWidth={27} strokeLinejoin="round" />

        {/* The ones being brushed now on top. */}
        {[...monsters.filter((m) => m.waiting), ...monsters.filter((m) => !m.waiting)].map((m) => {
          const face = toothFace(m.tooth, m.surface);
          const jaw = all[m.tooth.jaw];
          const facing = jaw.facing(face.normal);
          // The ones being brushed stay even on a steep face. The waiting ones only where nothing hides them:
          // with the teeth together, only the outside of the teeth shows.
          if (m.waiting ? facing <= WAITING_FACING || (view.open < 0.5 && m.surface !== "outer") : facing <= -0.3) return null;
          const at = jaw.point(lift(along(face, m.spot), face, 4));
          const size = (m.waiting ? WAITING_SIZE : MONSTER_SIZE) * project.zoom;
          return (
            <g key={m.id} transform={`translate(${at.x.toFixed(1)} ${at.y.toFixed(1)})`}>
              <g className="monster-size" style={{ transform: `scale(${size.toFixed(2)})` }}>
                <Monster
                  color={m.color}
                  variant={m.variant}
                  gone={m.gone}
                  scared={m.scared}
                  tickled={m.tickled}
                  delayMs={m.delayMs}
                  onTickle={() => onTickle(m.id)}
                />
              </g>
            </g>
          );
        })}

        {happy &&
          model.teeth.map((t, i) => {
            const face = surfaceFace(t.faces, "outer");
            if (all[t.id.jaw].facing(face.normal) < 0.4 || t.id.n > 2) return null;
            const at = all[t.id.jaw].point(face.center);
            return (
              <g key={t.key} transform={`translate(${(at.x - 10).toFixed(1)} ${(at.y - 10).toFixed(1)}) scale(0.2)`}>
                {/* The animation's transform would replace a transform attribute, so that sits on the group. */}
                <path
                  className="tooth-sparkle"
                  d={STAR_PATH}
                  fill="#ffd23f"
                  stroke={INK}
                  strokeWidth={8}
                  style={{ "--delay": `${i * 90}ms` } as CSSProperties}
                />
              </g>
            );
          })}

        {brush && <Brush brush={brush} project={all[brush.tooth.jaw]} face={toothFace(brush.tooth, brush.surface)} />}

        {action && <LipArrows action={action} lips={lipPoints} zoom={project.zoom} />}

        {/* The mirror glass catches the light. */}
        <g fill="#fff" opacity={0.35} pointerEvents="none">
          <path d="M80 10 L135 10 L10 135 L10 80 Z" />
          <path d="M160 10 L178 10 L10 178 L10 160 Z" />
        </g>
      </g>
      <rect
        x={10}
        y={10}
        width={PICTURE.width - 20}
        height={PICTURE.height - 20}
        rx={70}
        fill="none"
        stroke={INK}
        strokeWidth={14}
      />
      <rect x={10} y={10} width={PICTURE.width - 20} height={PICTURE.height - 20} rx={70} fill="none" stroke="#b9a8ff" strokeWidth={7} />
    </svg>
  );
}

/** A point just in front of a face, where a monster or the brush sits. */
const lift = (at: Vec3, face: Face, by: number): Vec3 => [at[0] + face.normal[0] * by, at[1] + face.normal[1] * by, at[2] + face.normal[2] * by];

/** A point on a face, `i` steps along the tooth from one end, half way between its long edges. */
function along(face: Face, i: number): Vec3 {
  const a = face.points[i];
  const b = face.points[face.points.length - 1 - i];
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}

const ARROW_PATH = "M0 -28 L22 -4 L9 -4 L9 24 L-9 24 L-9 -4 L-22 -4 Z";

/** Big arrows on the lips that nudge the way the mouth should move. */
function LipArrows({ action, lips, zoom }: { action: MouthAction; lips: Point2[]; zoom: number }) {
  const xs = lips.map((p) => p.x);
  const ys = lips.map((p) => p.y);
  const x = (Math.min(...xs) + Math.max(...xs)) / 2;
  const [top, bottom] = [Math.min(...ys), Math.max(...ys)];
  // Opening: they sit on the lips and point away from each other. Closing: just outside, pointing in.
  const off = (action === "open" ? 14 : 30) * Math.min(1, zoom);
  const arrows = [
    { y: top - off, turn: action === "open" ? 0 : 180 },
    { y: bottom + off, turn: action === "open" ? 180 : 0 },
  ];
  return (
    <g pointerEvents="none">
      {arrows.map((a, i) => (
        <g key={i} transform={`translate(${x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${a.turn}) scale(${Math.min(1.1, zoom).toFixed(2)})`}>
          <path className="lip-arrow" d={ARROW_PATH} fill="#ffd23f" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        </g>
      ))}
    </g>
  );
}

function Face({ project, head, happy, open }: { project: Project; head: Point2; happy: boolean; open: number }) {
  const p = project.point;
  const feature = (x: number, y: number, z: number) => ({ at: p([x, y, z]), facing: project.facing([x / 200, 0.1, 0.95]) });
  const ears = [-1, 1].map((s) => ({ s, at: p([s * HEAD * 0.97, 70, -60]) }));
  const eyes = [-1, 1].map((s) => feature(s * 66, 138, 120));
  // The eyebrows go up with a wide open mouth.
  const brows = [-1, 1].map((s) => feature(s * 70, 174 + 14 * open, 112));
  const cheeks = [-1, 1].map((s) => feature(s * 150, 84, 84));
  const nose = feature(0, 96, 148);
  const squash = (facing: number) => Math.max(0.25, Math.min(1, facing));

  return (
    <g>
      {ears.map(({ s, at }) => (
        <circle key={s} cx={at.x} cy={at.y} r={40 * project.zoom} fill={SKIN} stroke={INK} strokeWidth={5} />
      ))}
      <circle cx={head.x} cy={head.y} r={HEAD * project.zoom} fill={SKIN} stroke={INK} strokeWidth={6} />
      <clipPath id="head-shape">
        <circle cx={head.x} cy={head.y} r={HEAD * project.zoom} />
      </clipPath>
      {/* Hair: a fringe that moves with the head. */}
      <ellipse clipPath="url(#head-shape)" cx={head.x} cy={head.y - 250 * project.zoom} rx={270 * project.zoom} ry={110 * project.zoom} fill="#8a5a3c" stroke={INK} strokeWidth={6} />
      {cheeks.map(({ at, facing }, i) =>
        facing > 0 ? <ellipse key={i} cx={at.x} cy={at.y} rx={30 * squash(facing)} ry={20} fill="#ff8fa3" opacity={0.55} /> : null,
      )}
      {eyes.map(({ at, facing }, i) =>
        facing <= 0 ? null : happy ? (
          <path
            key={i}
            d={`M${at.x - 15 * squash(facing)} ${at.y + 6} Q${at.x} ${at.y - 16} ${at.x + 15 * squash(facing)} ${at.y + 6}`}
            fill="none"
            stroke={INK}
            strokeWidth={6}
            strokeLinecap="round"
          />
        ) : (
          <g key={i} className="face-eye">
            <ellipse cx={at.x} cy={at.y} rx={14 * squash(facing)} ry={19} fill={INK} />
            <circle cx={at.x + 4 * squash(facing)} cy={at.y - 6} r={5} fill="#fff" />
          </g>
        ),
      )}
      {brows.map(({ at, facing }, i) =>
        facing > 0 ? (
          <path
            key={i}
            d={`M${at.x - 17 * squash(facing)} ${at.y + 4} Q${at.x} ${at.y - 7} ${at.x + 17 * squash(facing)} ${at.y + 4}`}
            fill="none"
            stroke="#8a5a3c"
            strokeWidth={6}
            strokeLinecap="round"
          />
        ) : null,
      )}
      {nose.facing > 0 && <ellipse cx={nose.at.x} cy={nose.at.y} rx={16 * squash(nose.facing)} ry={11} fill="#e8a982" />}
    </g>
  );
}

function Brush({ brush, project, face }: { brush: NonNullable<MouthProps["brush"]>; project: Project; face: Face }) {
  const lastAngle = useRef(0);
  const spot = project.point(lift(face.center, face, 6));
  // The handle comes out of the front of the mouth, or out of the corner for the cheek side.
  const jawY = brush.tooth.jaw === "lower" ? -70 : 70;
  let dir: { x: number; y: number };
  if (brush.surface === "outer") {
    dir = brush.tooth.n <= 1 ? { x: 1, y: 0.2 } : { x: brush.tooth.side === "left" ? -1 : 1, y: 0.15 };
  } else {
    const front = project.point([brush.tooth.side === "left" ? -40 : 40, jawY, 220]);
    dir = { x: front.x - spot.x, y: front.y - spot.y };
  }
  let angle = (Math.atan2(dir.y, dir.x) * 180) / Math.PI;
  // Turn the short way round when the brush moves on.
  while (angle - lastAngle.current > 180) angle -= 360;
  while (angle - lastAngle.current < -180) angle += 360;
  lastAngle.current = angle;

  // Bristles (drawn pointing up) towards the tooth.
  const rad = (angle * Math.PI) / 180;
  const bristles = { x: Math.sin(rad), y: -Math.cos(rad) };
  const n = project.direction(face.normal);
  const intoTooth = Math.hypot(n.x, n.y) > 0.15 ? { x: -n.x, y: -n.y } : { x: 0, y: brush.tooth.jaw === "lower" ? 1 : -1 };
  const flip = bristles.x * intoTooth.x + bristles.y * intoTooth.y < 0 ? -1 : 1;

  return (
    <g className="brush shown" style={{ transform: `translate(${spot.x}px, ${spot.y}px) rotate(${angle}deg)` }}>
      <g transform={`scale(0.7 ${0.7 * flip})`}>
        <g className={`brush-move ${brush.motion}`}>
          <Toothbrush foam />
        </g>
      </g>
    </g>
  );
}

const MONSTER_TOPS = [
  // Horns
  "M-9 -12 L-12 -20 L-4 -14 Z M9 -12 L12 -20 L4 -14 Z",
  // Feelers
  "M-5 -14 L-9 -23 M5 -14 L9 -23",
  // Spiky hair
  "M-11 -10 L-8 -21 L-3 -14 Z M-3 -14 L0 -24 L3 -14 Z M3 -14 L8 -21 L11 -10 Z",
];

function Monster({
  color,
  variant,
  gone,
  scared,
  tickled,
  delayMs,
  onTickle,
}: {
  color: string;
  variant: number;
  gone: boolean;
  scared: boolean;
  tickled: boolean;
  delayMs: number;
  onTickle: () => void;
}) {
  const stop = (e: PointerEvent) => {
    e.stopPropagation();
    if (!gone) onTickle();
  };
  return (
    <g
      className={`sugar-monster${gone ? " gone" : ""}${scared ? " scared" : ""}${tickled ? " tickled" : ""}`}
      style={{ "--delay": `${delayMs}ms`, "--blink": `${-(delayMs % 3700)}ms` } as CSSProperties}
    >
      <g className="monster-body" onPointerDown={stop}>
        <path d={MONSTER_TOPS[variant % MONSTER_TOPS.length]} fill={color} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {variant % MONSTER_TOPS.length === 1 && (
          <g fill={color} stroke={INK} strokeWidth={2}>
            <circle cx={-9} cy={-24} r={3.2} />
            <circle cx={9} cy={-24} r={3.2} />
          </g>
        )}
        <path
          d="M-15 8 C-17 -6 -10 -15 0 -15 C10 -15 17 -6 15 8 C12 14 7 11 5 15 C2 11 -2 11 -5 15 C-7 11 -12 14 -15 8 Z"
          fill={color}
          stroke={INK}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <g className="monster-eyes">
          <circle cx={-5.5} cy={-4} r={4.2} fill="#fff" stroke={INK} strokeWidth={1.8} />
          <circle cx={5.5} cy={-4} r={4.2} fill="#fff" stroke={INK} strokeWidth={1.8} />
          <circle cx={-4.8} cy={-3.4} r={1.9} fill={INK} />
          <circle cx={6.2} cy={-3.4} r={1.9} fill={INK} />
        </g>
        {scared ? (
          // "Oh no, the brush!"
          <ellipse cx={0} cy={6} rx={3.2} ry={4} fill="#7a1f3d" stroke={INK} strokeWidth={2} />
        ) : (
          <>
            <path d="M-6 4 Q0 10 6 4" fill="#7a1f3d" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
            <path d="M-3.5 5.6 L-2.2 9 L-0.8 6.6 Z" fill="#fff" />
          </>
        )}
      </g>
      <g className="monster-puff">
        <g fill="#fff" stroke="#bde0fe" strokeWidth={2}>
          <circle cx={-10} cy={-4} r={7} />
          <circle cx={8} cy={-8} r={8} />
          <circle cx={2} cy={7} r={7} />
        </g>
        <path d={STAR_PATH} transform="translate(-7 -9) scale(0.14)" fill="#ffd23f" stroke={INK} strokeWidth={10} />
      </g>
    </g>
  );
}

/** Drawn lying down with the bristles up and the handle to the right; the head sits at the origin. */
export function Toothbrush({ foam = false }: { foam?: boolean }) {
  return (
    <g stroke={INK} strokeLinejoin="round">
      <rect x={26} y={4} width={150} height={16} rx={8} fill="#4cc9f0" strokeWidth={3} />
      <rect x={-38} y={2} width={70} height={14} rx={7} fill="#4cc9f0" strokeWidth={3} />
      <rect x={-34} y={-15} width={58} height={18} rx={3} fill="#fff" strokeWidth={2.5} />
      <path d="M-24 -13 V1 M-14 -13 V1 M-4 -13 V1 M6 -13 V1 M16 -13 V1" stroke="#9fd8f5" strokeWidth={2} />
      {foam && (
        <g className="brush-foam" fill="#fff" stroke="#bde0fe" strokeWidth={2}>
          <circle cx={-30} cy={-20} r={6} />
          <circle cx={-12} cy={-24} r={7} />
          <circle cx={8} cy={-21} r={5} />
          <circle cx={22} cy={-25} r={6} />
          <circle cx={-22} cy={-32} r={4} />
          <circle cx={14} cy={-34} r={4.5} />
        </g>
      )}
    </g>
  );
}
