import { memo, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode, type RefObject } from "react";
import { useFigure } from "@/lib/common";
import { clothesOf } from "./clothes";
import { useT } from "@/lib/language";
import {
  alongFace,
  brushedPoints,
  buildMouth,
  cornerStretch,
  glideStretch,
  insideBy,
  MIN_FACING,
  NO_STRETCH,
  projectors,
  stretchLips,
  TOOTH_CLEAR,
  toothKey,
  type Face,
  type FaceKind,
  type Jaw,
  type MouthModel,
  type Point2,
  type Projector,
  type Surface,
  type ToothId,
  type Vec3,
  type View,
  cheekSpots,
  HEAD_MIDDLE,
  HEAD_RADIUS,
  headNormal,
  onHead,
  profileLine,
  profileOf,
  viewedLips,
} from "./jaw";
import { BROW, Ear, EyeBall, EyeLid, eyeOpening, FACE, HAIR, Hair, HEAD_UNITS, type HeadMap, INK, Iris, LASHES, LIP, Nose, SkinGradient } from "./face";
import { Brush, lerp3, type BrushAnchor } from "./brush";
import type { Motion } from "./steps";

// A child's face in a mirror, close up. The mouth is a small 3D model (see
// jaw.ts), so the picture can turn and tilt to show exactly where to brush.

export { INK, SKIN } from "./face";
const TOOTH_FILLS: Record<FaceKind, string> = { outer: "#fffdf6", top: "#fbeed0", inner: "#f2e6d2", side: "#e6d8bd" };
const GUM_FILLS: Record<FaceKind, string> = { outer: "#ff8fab", top: "#ffa6bc", inner: "#f27c9c", side: "#ff8fab" };
/** The gum's edge round each tooth. */
const GUM_RIM = "#e2577c";
const ZONE_FILL = "#fff2a8";
/** The inside of the cheeks and lips round the teeth: the gum runs into it, so nothing dark shows between gum and lips. */
const CHEEK_INSIDE = "#f27e9c";
/** The dark of the mouth behind the teeth, seen only between the rows of an open mouth. */
const MOUTH_DARK = "#5c1430";
/** From how far open the dark behind the teeth shows; with the teeth together only cheek shows round them. */
const DARK_FROM = 0.3;
/** Monsters still waiting for a later step only show where their side of the tooth clearly faces out of the mouth. */
const WAITING_FACING = 0.25;
/** Small enough that a monster sits on its tooth rather than covering it and its neighbours. */
const MONSTER_SIZE = 0.58;
/** How flat a monster gets at most on a face seen from the side (`leanOn`): flatter, it would no longer be seen as one. */
const MIN_LEAN = 0.42;
/** How far inside the lips' outline a monster's middle has to be: past the thick lip (half its stroke) onto the teeth. */
const LIP_EDGE = 15;

/** A part of the picture or the screen: x, y, width and height. */
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** The picture's size on screen in px, and the free part of it between the heading and the controls. */
export interface Room {
  width: number;
  height: number;
  /** Relative to the picture's top left corner. */
  free: Box;
}

/**
 * Measures a picture that fills the whole screen behind the heading and the
 * controls, and the free part of the screen between them (`free`), where what
 * matters has to fit.
 */
export function useRoom(svg: RefObject<Element | null>, free: RefObject<HTMLElement | null>): Room | null {
  const [room, setRoom] = useState<Room | null>(null);
  useLayoutEffect(() => {
    // The pictures fill the stage, and while one slides in or zooms (a scene change, the story's camera) only the
    // stage keeps its place: measured there, the picture is sized for where it ends up.
    const element = svg.current?.closest(".teeth-stage") ?? svg.current;
    const area = free.current;
    if (!element || !area) return;
    const measure = () => {
      const s = element.getBoundingClientRect();
      const f = area.getBoundingClientRect();
      if (!s.width || !s.height) return;
      const whole = { x: 0, y: 0, width: s.width, height: s.height };
      setRoom({
        width: s.width,
        height: s.height,
        free: f.width && f.height ? { x: f.left - s.left, y: f.top - s.top, width: f.width, height: f.height } : whole,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(area);
    return () => observer.disconnect();
  }, [svg, free]);
  return room;
}

/**
 * The part of the picture the whole screen shows, so `focus` is as big as it
 * fits into the free room and sits in its middle; the rest of the screen shows
 * more of the picture around it. `unit` is one screen pixel in picture units,
 * for a frame that stays the same thickness however far it zooms.
 */
export function fitBox(room: Room | null, focus: Box): { box: Box; unit: number } {
  if (!room) return { box: focus, unit: 1 };
  const scale = Math.min(room.free.width / focus.width, room.free.height / focus.height);
  const box = {
    x: focus.x + focus.width / 2 - (room.free.x + room.free.width / 2) / scale,
    y: focus.y + focus.height / 2 - (room.free.y + room.free.height / 2) / scale,
    width: room.width / scale,
    height: room.height / scale,
  };
  return { box, unit: 1 / scale };
}

/** The mirror's frame along the screen's edge, in px; it keeps its thickness however far the picture zooms. */
const FRAME_PX = { inset: 6, radius: 36, ink: 12, color: 6 };

/** A frame at the edge of `box`, see FRAME_PX. */
export function screenFrame(box: Box, unit: number) {
  const inset = FRAME_PX.inset * unit;
  return { x: box.x + inset, y: box.y + inset, width: box.width - 2 * inset, height: box.height - 2 * inset, rx: FRAME_PX.radius * unit };
}

/** The mirror frame's two strokes, see screenFrame. */
export function FrameStroke({ frame, unit }: { frame: ReturnType<typeof screenFrame>; unit: number }) {
  return (
    <>
      <rect {...frame} fill="none" stroke={INK} strokeWidth={FRAME_PX.ink * unit} />
      <rect {...frame} fill="none" stroke="#b9a8ff" strokeWidth={FRAME_PX.color * unit} />
    </>
  );
}

/**
 * Room round the lips that always shows: the lips' thick outline and the arrows above and below them.
 * The arrows that close the mouth stand further out (`closed`) than the ones on an open mouth (`open`).
 */
const LIP_ROOM = { x: 22, closed: 62, open: 46 };
/** The mouth never zooms in so far that it shows less of the picture than this, in picture units. */
const MIN_FOCUS = { width: 240, height: 120 };

/**
 * The part of the picture that has to show: the lips with everything inside
 * them (teeth, monsters, brush) and the arrows on them. It follows the view,
 * so the mouth fills the free room whether it is open or closed, seen from
 * the front or the side.
 */
function mouthFocus(lips: Point2[], zoom: number, open: number): Box {
  const xs = lips.map((p) => p.x);
  const ys = lips.map((p) => p.y);
  const [left, right, top, bottom] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const width = Math.max(MIN_FOCUS.width, right - left + 2 * LIP_ROOM.x * zoom);
  const above = LIP_ROOM.closed + (LIP_ROOM.open - LIP_ROOM.closed) * open;
  const height = Math.max(MIN_FOCUS.height, bottom - top + 2 * above * Math.min(1, zoom));
  return { x: (left + right - width) / 2, y: (top + bottom - height) / 2, width, height };
}

/**
 * The whole head with its ears: what the end shows, so the clean grin comes with the happy eyes and glowing cheeks
 * (zoomed onto the lips alone, the end showed a mouth and a nose).
 */
export function faceFocus(project: Projector): Box {
  const middle = project.point(HEAD_MIDDLE);
  const r = HEAD_RADIUS * project.zoom;
  const [across, up, down] = [1.16 * r, 1.04 * r, 1.04 * r];
  return { x: middle.x - across, y: middle.y - up, width: 2 * across, height: up + down };
}

/** Between two boxes: the middle moves evenly and the size changes by the same factor in every frame, so a zoom feels even. */
export function blendBox(a: Box, b: Box, k: number): Box {
  if (k <= 0) return a;
  if (k >= 1) return b;
  const width = a.width * (b.width / a.width) ** k;
  const height = a.height * (b.height / a.height) ** k;
  const cx = a.x + a.width / 2 + (b.x + b.width / 2 - a.x - a.width / 2) * k;
  const cy = a.y + a.height / 2 + (b.y + b.height / 2 - a.y - a.height / 2) * k;
  return { x: cx - width / 2, y: cy - height / 2, width, height };
}

export interface MonsterSpot {
  id: number;
  tooth: ToothId;
  surface: Surface;
  /** Where along the tooth: 2 is the middle, 1 and 3 nearer its ends (molars have room for two). */
  spot: number;
  color: string;
  /** Horns, feelers or spiky hair. */
  variant: number;
  /** Where in its blink it starts, so they don't all blink at once. */
  blinkMs: number;
  /** On a tooth that comes later: only shown where it clearly shows. The others glow. */
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
  /** The brush goes from stop to stop; `at` is how far, 1.5 is half way from the second to the third. */
  brush: { stops: { tooth: ToothId; spot: number }[]; at: number; surface: Surface; motion: Motion } | null;
  /** All clean: the teeth shine and the eyes smile. */
  happy: boolean;
  /** Right after the brushing: a last sugar monster peeks in, dazzled by the shining teeth, and puts on sunglasses. */
  dazzled: boolean;
  /** Shown while the child should open or close their mouth. */
  action: MouthAction | null;
  /**
   * The head turns or the mouth opens or closes: the picture is drawn anew in every frame, so the glow on the teeth
   * to brush waits until it holds still (the yellow of those teeth shows the way meanwhile).
   */
  gliding: boolean;
  /** Where the glide is going, and how far it has come (0 to 1, eased like the view): the corners of the mouth follow it. */
  glide: { to: View; k: number };
  /** The free part of the screen between heading and controls, where the mouth has to fit. */
  free: RefObject<HTMLElement | null>;
  onTickle: (id: number) => void;
}

type Project = Projector;

/** A point for a path, to a tenth (rounding is quicker than `toFixed`, and the mouth formats thousands per frame while it moves). */
const fmt = (p: { x: number; y: number }) => `${Math.round(p.x * 10) / 10} ${Math.round(p.y * 10) / 10}`;

/** How finely the opening mouth's model is built: a hundred steps from shut to wide open, each built once. */
const OPEN_STEPS = 100;
const models = new Map<number, MouthModel>();
/** The mouth's model for an opening, kept: while the mouth opens it is needed every frame, and again on the next step. */
function mouthAt(open: number) {
  const step = Math.round(open * OPEN_STEPS);
  const kept = models.get(step);
  if (kept) return kept;
  const model = buildMouth(step / OPEN_STEPS);
  models.set(step, model);
  return model;
}

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
  return `${smoothPart(points, 0, points.length)}Z`;
}

/** A part of the smooth closed curve through `points`: from point `from` on, `count` pieces, exactly as `smoothPath` draws them. */
function smoothPart(points: { x: number; y: number }[], from: number, count: number) {
  const n = points.length;
  const at = (i: number) => points[((i % n) + n) % n];
  let d = `M${fmt(at(from))}`;
  for (let i = from; i < from + count; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${fmt(c1)} ${fmt(c2)} ${fmt(p2)}`;
  }
  return d;
}

const facePath = (face: Face, project: Project, radius = 3) => roundedPath(face.points.map(project.point), radius);

/** A tooth's crown: the faces that show, with the light on its front and the groove on a molar; `zone` the face to brush. */
function Crown({ tooth: t, project, zone }: { tooth: MouthModel["teeth"][number]; project: Project; zone?: Surface }) {
  const p = project.point;
  return (
    <>
      {t.faces
        // Slivers of the sides between teeth only add clutter.
        .filter((f) => project.facing(f.normal) > (f.kind === "side" ? 0.3 : MIN_FACING))
        .map((f, j) => (
          <path
            key={j}
            d={facePath(f, project, f.kind === "outer" ? 7 : 3)}
            fill={f.kind === zone ? ZONE_FILL : TOOTH_FILLS[f.kind]}
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
    </>
  );
}

/** The mirror's glass behind the head. */
const MIRROR_GLASS = "#dff6ff";

/** What a profile needs on the screen: the face's outline, the region past it, the lips' near half and the front teeth. */
interface ProfileParts {
  /** The face's outline from the top of the head down (`profileLine`). */
  line: Point2[];
  /** The region past the face's front, not seen: as a path, and its outline. */
  beyond: string;
  ring: { x: number; y: number }[];
  /** The near half of the lips, from the upper lip's end round the near corner to the lower one's: its index and pieces. */
  nearFrom: number;
  nearCount: number;
  /** The near half's points and the front teeth's, for the camera. */
  near: Point2[];
  front: Point2[];
}

/**
 * The profile's parts for lips (`lips3d`, as the view shows them) whose projection with their corners pulled is `lips`;
 * `front` are the front teeth's corners on the screen.
 */
function profileParts(lips3d: Vec3[], lips: Point2[], face: Project, front: Point2[]): ProfileParts {
  const line = profileLine(lips3d).map(face.point);
  // Past the face's front, as far as the picture could reach: the direction its front faces on the screen.
  const out = face.direction([0, 0, 1]);
  const length = Math.hypot(out.x, out.y) || 1;
  const far = 6000;
  const away = (p: { x: number; y: number }, up: number) => ({ x: p.x + (out.x / length) * far, y: p.y + (out.y / length) * far + up });
  const [first, last] = [line[0], line[line.length - 1]];
  const ring = [...line, { x: last.x, y: last.y + far }, away(last, far), away(first, -far), { x: first.x, y: first.y - far }];
  const beyond = `M${ring.map(fmt).join(" L")}Z`;
  // The lips' ring runs from the right corner (0) over the top (a quarter) to the left corner and under it back:
  // the near half is the side whose corner is nearer the eye.
  const n = lips.length;
  const quarter = n / 4;
  const leftNear = lips[n / 2].depth > lips[0].depth;
  const nearFrom = leftNear ? quarter : 3 * quarter;
  const near = Array.from({ length: n / 2 + 1 }, (_, i) => lips[(nearFrom + i) % n]);
  return { line, beyond, ring, nearFrom, nearCount: n / 2, near, front };
}

const surfaceFace = (faces: Face[], surface: Surface) => faces.find((f) => f.kind === surface)!;

/** A tipped jaw goes on top; otherwise the far one first (looking down, the upper teeth are nearer). */
const jawOrder = (view: View): Jaw[] => {
  if (Math.abs(view.tilt.upper) > Math.abs(view.tilt.lower)) return ["lower", "upper"];
  if (Math.abs(view.tilt.lower) > 0) return ["upper", "lower"];
  return view.pitch >= 0 ? ["lower", "upper"] : ["upper", "lower"];
};

export function Mouth({ view, zone, monsters, brush, happy, dazzled, action, gliding, glide, free, onTickle }: MouthProps) {
  const pictureLabel = useT()({
    de: "Ein Kindergesicht im Spiegel beim Zähneputzen",
    en: "A child's face in the mirror while brushing teeth",
    zh: "刷牙时镜子里孩子的脸",
    hi: "दाँत साफ़ करते समय आईने में एक बच्चे का चेहरा",
    es: "La cara de un niño en el espejo mientras se lava los dientes",
    ar: "وجه طفل في المرآة أثناء تنظيف الأسنان",
    ru: "Лицо ребёнка в зеркале во время чистки зубов",
  });
  const model = mouthAt(view.open);
  const all = useMemo(() => projectors(view), [view]);
  const project = all.face;
  const teethByKey = useMemo(() => new Map(model.teeth.map((t) => [t.key, t])), [model]);
  const gumsByKey = useMemo(() => new Map(model.gums.map((g) => [g.key, g])), [model]);
  const toothFace = (id: ToothId, surface: Surface) => surfaceFace(teethByKey.get(toothKey(id))!.faces, surface);

  /** Where on a tooth the brush works. Outside with the teeth together, it brushes both rows at once, on the bite. */
  const anchorAt = (stop: { tooth: ToothId; spot: number }, surface: Surface): BrushAnchor => {
    const face = toothFace(stop.tooth, surface);
    const half = face.points.length / 2;
    const along = unitOf(subOf(face.points[half - 1], face.points[0]));
    if (surface === "outer" && view.open < 0.5) {
      const other = toothFace({ ...stop.tooth, jaw: stop.tooth.jaw === "upper" ? "lower" : "upper" }, "outer");
      return { at: lerp3(alongFace(face, 2), alongFace(other, 2), 0.5), normal: unitOf(lerp3(face.normal, other.normal, 0.5)), along };
    }
    return { at: alongFace(face, stop.spot), normal: face.normal, along };
  };

  // The corners of the mouth open as far as the teeth being brushed need, so seen from the side none hides behind them.
  // Worked out for where the view is going; while it glides there they go from where they were (`glideStretch`).
  const settled = useMemo(() => {
    if (!zone) return NO_STRETCH;
    const to = projectors(glide.to);
    const target = mouthAt(glide.to.open);
    return cornerStretch(viewedLips(target.lips, glide.to).map(to.face.point), brushedPoints(target, to, zone), TOOTH_CLEAR);
  }, [glide.to, zone?.teeth, zone?.surface]);
  // The stretch shown last while the head held still: where the corners start from when it glides again.
  const heldStretch = useRef(settled);
  if (!gliding) heldStretch.current = settled;
  const stretch = gliding ? glideStretch(heldStretch.current, settled, glide.k) : settled;
  const lips3d = useMemo(() => viewedLips(model.lips, view), [model, view]);
  const lipPoints = useMemo(() => stretchLips(lips3d.map(project.point), stretch), [lips3d, project, stretch.left, stretch.right]);
  const lipsPath = useMemo(() => smoothPath(lipPoints), [lipPoints]);
  // Seen from the side the head is a profile: what lies past the face's front is not seen (`profileOf`, `Profile`).
  const profile = profileOf(view);
  const side = useMemo(() => {
    if (profile <= 0) return null;
    const front = model.teeth.filter((t) => t.id.n <= 1).flatMap((t) => surfaceFace(t.faces, "outer").points.map(all[t.id.jaw].point));
    return profileParts(lips3d, lipPoints, all.face, front);
  }, [profile > 0, model, lips3d, lipPoints, all]);

  const svg = useRef<SVGSVGElement>(null);
  const room = useRoom(svg, free);
  // At the end the camera zooms out from the lips to the whole laughing head, along with the head's glide to the grin.
  // In a profile the lips' far half is not seen: the camera looks at the near half and the front teeth past it.
  const ringFocus = mouthFocus(lipPoints, project.zoom, view.open);
  const lipFocus = side ? blendBox(ringFocus, mouthFocus([...side.near, ...side.front], project.zoom, view.open), profile) : ringFocus;
  const focus = happy ? blendBox(lipFocus, faceFocus(project), gliding ? glide.k : 1) : lipFocus;
  const { box, unit } = fitBox(room, focus);
  const frame = screenFrame(box, unit);
  // The mirror's glass and frame stay where they are on the screen however the picture zooms, so they are drawn in
  // screen px: an svg whose viewBox changed with every frame of a turning head was painted anew each time.
  const screen = { width: Math.round(room?.width ?? box.width), height: Math.round(room?.height ?? box.height) };
  const screenEdge = screenFrame({ x: 0, y: 0, ...screen }, 1);
  const viewBox = `${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.width.toFixed(1)} ${box.height.toFixed(1)}`;
  /** A point of the picture in screen px from the screen's middle (where the box's middle lies), and `scale` in px. */
  const onScreen = (at: { x: number; y: number }, scale: number): SpriteSpot => ({
    x: (at.x - box.x - box.width / 2) / unit,
    y: (at.y - box.y - box.height / 2) / unit,
    scale: scale / unit,
  });

  // The outer faces of the teeth that show, for the shine round them at the end.
  const shineTeeth = useMemo(
    () =>
      happy
        ? model.teeth.flatMap((t) => {
            const face = surfaceFace(t.faces, "outer");
            return all[t.id.jaw].facing(face.normal) > MIN_FACING ? [{ key: t.key, d: facePath(face, all[t.id.jaw]) }] : [];
          })
        : [],
    [happy, model, all],
  );

  // Glints flashing on the front teeth's light, one after the other (`GLINT_TEETH`), where a tooth faces the viewer.
  const glints = useMemo(
    () =>
      happy
        ? GLINT_TEETH.flatMap((id, i) => {
            const t = teethByKey.get(toothKey(id));
            if (!t || all[id.jaw].facing(surfaceFace(t.faces, "outer").normal) <= 0.55) return [];
            return [{ key: t.key, at: all[id.jaw].point(t.shine[0]), turn: i }];
          })
        : [],
    [happy, teethByKey, all],
  );

  // The face and the teeth change only while the head turns or the mouth opens: built once for each view,
  // not again with every tick of the clock (hundreds of paths, too slow for a phone five times a second).
  const zoneSurface = zone?.surface;
  const zoneTeeth = zone?.teeth;
  const still = useMemo(() => {
    const zoneKeys = new Set(zoneTeeth?.map(toothKey));
    const jawParts = jawOrder(view).map((jaw) => {
      const project = all[jaw];
      const p = project.point;
      const teeth = model.teeth.filter((t) => t.id.jaw === jaw).sort((a, b) => p(a.center).depth - p(b.center).depth);
      return (
        <g key={jaw}>
          {teeth.map((t) => {
            // Far teeth first; each one stands in its own piece of gum: the gum's top under it, its walls over its foot.
            const gum = gumsByKey.get(t.key)!;
            const gumFaces = (top: boolean) =>
              gum.faces
                .filter((f) => (f.kind === "top") === top && project.facing(f.normal) > MIN_FACING)
                .map((f, j) => <path key={`gum-${top}-${j}`} d={facePath(f, project)} fill={GUM_FILLS[f.kind]} stroke={GUM_FILLS[f.kind]} strokeWidth={1.5} />);
            const rims = (["outer", "inner"] as const).filter((kind) => project.facing(surfaceFace(gum.faces, kind).normal) > MIN_FACING);
            return (
              <g key={t.key}>
                {gumFaces(true)}
                <Crown tooth={t} project={project} zone={zoneKeys.has(t.key) ? zoneSurface : undefined} />
                {gumFaces(false)}
                {rims.map((kind) => (
                  <path
                    key={kind}
                    d={`M${gum.rims[kind].map((r) => fmt(p(r))).join(" L")}`}
                    fill="none"
                    stroke={GUM_RIM}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </g>
            );
          })}
        </g>
      );
    });

    const tongueUp = all.lower.facing([0, 1, 0.2]) > 0.05;
    const palateDown = all.upper.facing([0, -1, 0.2]) > 0.05;
    return (
      <>
        <KidFace project={all.face} head={all.face.point(HEAD_MIDDLE)} happy={happy} open={view.open} lips={lipPoints} />
        <g clipPath="url(#mouth-inside)">
          <path d={lipsPath} fill={CHEEK_INSIDE} />
          {view.open > DARK_FROM && <path d={cavityPath(model, all)} fill={MOUTH_DARK} />}
          {tongueUp && <path d={smoothPath(model.tongue.map(all.lower.point))} fill="#ff6f91" stroke="#d94f74" strokeWidth={3} />}
          {palateDown && <path d={smoothPath(model.palate.map(all.upper.point))} fill="#c94a6e" />}
          {jawParts}
        </g>
      </>
    );
  }, [view, all, model, gumsByKey, lipPoints, lipsPath, zoneSurface, zoneTeeth, happy]);

  const placed = (m: MonsterSpot) => {
    const face = toothFace(m.tooth, m.surface);
    const jaw = all[m.tooth.jaw];
    const facing = jaw.facing(face.normal);
    // The ones being brushed stay even on a steep face. The waiting ones only where nothing hides them:
    // with the teeth together, only the outside of the teeth shows.
    if (m.waiting ? facing <= WAITING_FACING || (view.open < 0.5 && m.surface !== "outer") : facing <= -0.3) return null;
    const at = jaw.point(lift(alongFace(face, m.spot), face, 4));
    // Back teeth hidden behind the corners of the lips: their monsters would sit on the lip.
    if (!insideBy(at, lipPoints, LIP_EDGE)) return null;
    // Seen from the side nothing past the face's front is seen: a waiting monster there waits out of sight.
    if (m.waiting && side && insideBy(at, side.ring, 0)) return null;
    // The ones being brushed move, so each lies in a layer of its own (Sprite), placed on the screen.
    const spot = m.waiting ? { x: at.x, y: at.y, scale: MONSTER_SIZE * project.zoom } : onScreen(at, MONSTER_SIZE * project.zoom);
    const lean = leanOn(jaw.direction(face.normal), facing);
    return (
      <PlacedMonster
        key={m.id}
        id={m.id}
        x={round(spot.x)}
        y={round(spot.y)}
        scale={round(spot.scale, 100)}
        lean={lean}
        sprite={!m.waiting}
        color={m.color}
        variant={m.variant}
        active={!m.waiting}
        still={m.waiting}
        gone={m.gone}
        scared={m.scared}
        tickled={m.tickled}
        blinkMs={m.blinkMs}
        onTickle={onTickle}
      />
    );
  };

  // Seen from the side, over the lips: the far side of the head past the face's front is the mirror's glass, the face's
  // outline runs down its front, and the lips' near half ends round at the front, a little in front of the front teeth:
  // every tooth stays inside the mouth, growing out of its gum, seen through the lips' opening (user feedback, November
  // 2026). It comes in as the head turns that far (`profile`), never at once.
  const profileCut = useMemo(() => {
    if (!side) return null;
    const near = smoothPart(lipPoints, side.nearFrom, side.nearCount);
    return (
      <g opacity={round(profile, 100)}>
        <path d={side.beyond} fill={MIRROR_GLASS} />
        <path d={`M${side.line.map(fmt).join(" L")}`} fill="none" stroke={INK} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
        <path d={near} fill="none" stroke={INK} strokeWidth={34} strokeLinejoin="round" strokeLinecap="round" />
        <path d={near} fill="none" stroke={LIP} strokeWidth={27} strokeLinejoin="round" strokeLinecap="round" />
      </g>
    );
  }, [side, profile, lipPoints]);

  // The lips over the glow's edge, in a layer of their own above it, so the glow stays inside them; with them the
  // monsters waiting for a later step, which stand still. While the head turns or the mouth opens there is no glow and
  // every layer with the picture's viewBox is drawn anew in every frame, so they join the still picture instead:
  // one screen painted per frame rather than two.
  const lipsAndWaiting = (
    <>
      <path d={lipsPath} fill="none" stroke={INK} strokeWidth={34} strokeLinejoin="round" />
      <path d={lipsPath} fill="none" stroke={LIP} strokeWidth={27} strokeLinejoin="round" />
      {profileCut}
      {monsters.filter((m) => m.waiting).map(placed)}
    </>
  );

  // Pictures on top of each other, all with the same viewBox and size, so they line up exactly: the still one below
  // (face, teeth), then each in a layer of its own the glow on the teeth to brush (the whole svg pulses, which a phone
  // does without painting), the lips and the waiting monsters, what moves (the monsters being brushed, the arrows on
  // the lips) each in a small layer of its own (Sprite), the mirror's glass and frame, and the brush. Something
  // animated inside an svg has the browser paint that whole svg again in every frame: the glow once pulsed with the
  // lips in one picture, and the swaying monsters lay in one the size of the screen, and each time the phone painted
  // the screen anew 50 times a second.
  return (
    <>
      <svg ref={svg} className="mouth" viewBox={viewBox} role="img" aria-label={pictureLabel}>
        <defs>
          <clipPath id="mirror">
            <rect {...frame} />
          </clipPath>
          <clipPath id="mouth-inside">
            <path d={lipsPath} />
          </clipPath>
        </defs>
        <rect {...frame} fill="#dff6ff" />
        <g clipPath="url(#mirror)">
          {still}
          {gliding && lipsAndWaiting}
        </g>
      </svg>

      {zone && !gliding && (
        <svg className="mouth mouth-moving zone-glow" viewBox={viewBox} aria-hidden>
          <defs>
            <clipPath id="mirror-glow">
              <rect {...frame} />
            </clipPath>
            <clipPath id="mouth-inside-glow">
              <path d={lipsPath} />
            </clipPath>
          </defs>
          <g clipPath="url(#mirror-glow)">
            <g clipPath="url(#mouth-inside-glow)">
              {zone.teeth.map((id) => {
                const face = toothFace(id, zone.surface);
                const at = all[id.jaw];
                if (at.facing(face.normal) <= MIN_FACING) return null;
                return <path key={toothKey(id)} d={facePath(face, at)} fill="none" stroke="#ffd23f" strokeWidth={5} strokeLinejoin="round" />;
              })}
            </g>
          </g>
        </svg>
      )}

      {/* All clean: a bright light round the teeth that breathes, clipped to the mouth with the teeth themselves left
          out, so their outlines stay sharp, and a warm light beaming out round the lips. Its own layer, which only
          changes its opacity. */}
      {happy && !gliding && (
        <svg className="mouth mouth-moving teeth-shine" viewBox={viewBox} aria-hidden>
          <defs>
            <clipPath id="mirror-shine">
              <rect {...frame} />
            </clipPath>
            <clipPath id="mouth-shine">
              <path d={`${lipsPath} ${shineTeeth.map((t) => t.d).join(" ")}`} clipRule="evenodd" />
            </clipPath>
            <clipPath id="smile-halo">
              <path d={`${rectPath(frame)} ${lipsPath}`} clipRule="evenodd" />
            </clipPath>
            <filter id="teeth-shine-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={5} />
            </filter>
            <filter id="smile-halo-soft" x="-30%" y="-60%" width="160%" height="220%">
              <feGaussianBlur stdDeviation={14} />
            </filter>
          </defs>
          <g clipPath="url(#mirror-shine)">
            {/* The smile beams: a warm light round the lips, over the face. */}
            <g clipPath="url(#smile-halo)">
              <path d={lipsPath} fill="none" stroke="#fffaf0" strokeWidth={80} opacity={0.9} filter="url(#smile-halo-soft)" />
            </g>
            <g clipPath="url(#mouth-shine)">
              <g filter="url(#teeth-shine-soft)" fill="none" stroke="#fffdf2" strokeWidth={34} strokeLinejoin="round">
                {shineTeeth.map((t) => (
                  <path key={t.key} d={t.d} />
                ))}
              </g>
            </g>
          </g>
        </svg>
      )}

      {!gliding && (
        <svg className="mouth mouth-moving" viewBox={viewBox} aria-hidden>
          <defs>
            <clipPath id="mirror-moving">
              <rect {...frame} />
            </clipPath>
          </defs>
          <g clipPath="url(#mirror-moving)">{lipsAndWaiting}</g>
        </svg>
      )}

      <div className="mouth-sprites">
        {/* The ones being brushed now on top. */}
        {monsters.filter((m) => !m.waiting).map(placed)}
        {action && <LipArrows action={action} lips={lipPoints} zoom={project.zoom} onScreen={onScreen} />}
        {/* A last sugar monster peeks in, dazzled by the clean teeth, and puts on sunglasses: no sugar left for it. */}
        {dazzled && <DazzledMonster screen={screen} />}
        {/* All clean: glints of light flash on the teeth in turn, each a small layer of its own. */}
        {!gliding &&
          glints.map((g) => {
            const at = onScreen(g.at, GLINT_SIZE);
            return (
              <Sprite key={g.key} spot={{ x: round(at.x), y: round(at.y), scale: round(at.scale, 1000) }} reach={GLINT_REACH} className="tooth-glint">
                <div style={{ "--turn": g.turn } as CSSProperties}>
                  <svg viewBox={spriteBox(GLINT_REACH)} aria-hidden>
                    <Glint />
                  </svg>
                </div>
              </Sprite>
            );
          })}
      </div>

      <svg className="mouth mouth-moving" viewBox={`0 0 ${screen.width} ${screen.height}`} aria-hidden>
        <defs>
          <clipPath id="mirror-active">
            <rect {...screenEdge} />
          </clipPath>
        </defs>
        {/* The mirror glass catches the light. */}
        <g clipPath="url(#mirror-active)" fill="#fff" opacity={0.35} pointerEvents="none" transform="scale(1.6)">
          <path d="M80 10 L135 10 L10 135 L10 80 Z" />
          <path d="M160 10 L178 10 L10 178 L10 160 Z" />
        </g>
        <FrameStroke frame={screenEdge} unit={1} />
      </svg>
      {brush &&
        brush.stops.length > 0 &&
        (() => {
          // Glide between the two stops either side of `at`, held as on the nearer one: so the brush's shape changes only
          // when it turns to the next stop, and in between only its layer moves, which a phone does without painting.
          const i = Math.min(brush.stops.length - 1, Math.max(0, Math.floor(brush.at)));
          const next = Math.min(brush.stops.length - 1, i + 1);
          const k = Math.min(1, Math.max(0, brush.at - i));
          const near = brush.stops[k < 0.5 ? i : next];
          const at = lerp3(anchorAt(brush.stops[i], brush.surface).at, anchorAt(brush.stops[next], brush.surface).at, k);
          return (
            <Brush
              anchor={anchorAt(near, brush.surface)}
              at={at}
              surface={brush.surface}
              tooth={near.tooth}
              motion={brush.motion}
              project={all[near.tooth.jaw]}
              frame={{ box, unit }}
            />
          );
        })()}
    </>
  );
}

/**
 * The opening into the mouth between the two rows of teeth: the outline round every chewing surface of both jaws,
 * each seen through its own (perhaps tipped) projector. Dark behind the tongue and palate; outside it the cheeks show.
 */
function cavityPath(model: MouthModel, all: ReturnType<typeof projectors>): string {
  const points = model.teeth.flatMap((t) => surfaceFace(t.faces, "top").points.map(all[t.id.jaw].point));
  return `M${convexHull(points).map(fmt).join(" L")}Z`;
}

/** The smallest convex outline round `points` (Andrew's monotone chain). */
function convexHull<P extends { x: number; y: number }>(points: P[]): P[] {
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  if (sorted.length < 3) return sorted;
  const cross = (o: P, a: P, b: P) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const half = (list: P[]) => {
    const out: P[] = [];
    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
      out.push(p);
    }
    out.pop();
    return out;
  };
  return [...half(sorted), ...half([...sorted].reverse())];
}

/**
 * A monster on its tooth. Drawn again only when one of its own props changes, not with every tick of the clock:
 * `onTickle` has to stay the same function (useCallback) for that.
 */
const PlacedMonster = memo(function PlacedMonster({
  id,
  x,
  y,
  scale,
  lean,
  sprite,
  onTickle,
  ...monster
}: {
  id: number;
  /** Where its middle lies and how big it is: in picture units, or for a `sprite` as a SpriteSpot on the screen. */
  x: number;
  y: number;
  scale: number;
  /** How it lies flat on its tooth's face (`leanOn`): a matrix's first four numbers, or "" facing us. */
  lean: string;
  sprite: boolean;
  onTickle: (id: number) => void;
} & Omit<Parameters<typeof Monster>[0], "onTickle">) {
  // While the head turns only the place changes: the monster itself is kept, so React doesn't draw it again.
  const { color, variant, active, still, gone, scared, tickled, blinkMs } = monster;
  const drawn = useMemo(
    () => (
      <Monster
        color={color}
        variant={variant}
        active={active && !sprite}
        still={still}
        gone={gone}
        scared={scared}
        tickled={tickled}
        blinkMs={blinkMs}
        onTickle={() => onTickle(id)}
      />
    ),
    [id, color, variant, active, sprite, still, gone, scared, tickled, blinkMs, onTickle],
  );
  if (sprite)
    return (
      <Sprite
        spot={{ x, y, scale }}
        lean={lean}
        reach={MONSTER_REACH}
        className={`monster-sprite${gone ? " gone" : ""}${scared ? " scared" : ""}${tickled ? " tickled" : ""}`}
      >
        {active && <div className="sprite-glow" />}
        <div className="sprite-body">
          <svg viewBox={spriteBox(MONSTER_REACH)}>{drawn}</svg>
        </div>
        {gone && <MonsterDust color={color} />}
      </Sprite>
    );
  return <g transform={`translate(${x} ${y}) scale(${scale})${lean && ` matrix(${lean} 0 0)`}`}>{drawn}</g>;
});

/**
 * A monster lies on its tooth's face, not upright in front of it (user feedback, November 2026: on the teeth seen from
 * the side they looked as if they flew before them): it is squashed along the way the face turns away on the screen
 * (`away`, the face's normal on the screen) as much as the face is turned (`facing`, at most to `MIN_LEAN`), as a
 * sticker on the tooth would be. Facing us it stays as it is (""), so most monsters keep one drawing.
 */
export function leanOn(away: { x: number; y: number }, facing: number): string {
  const length = Math.hypot(away.x, away.y);
  const k = Math.max(MIN_LEAN, Math.min(1, facing));
  if (length < 0.05 || k > 0.97) return "";
  const [dx, dy] = [away.x / length, away.y / length];
  const r = (n: number) => Math.round(n * 50) / 50;
  return [1 + (k - 1) * dx * dx, (k - 1) * dx * dy, (k - 1) * dx * dy, 1 + (k - 1) * dy * dy].map(r).join(" ");
}

/**
 * The grains a brushed monster falls apart into: where each lies on its body and where it drifts, in % of its sprite
 * from the sprite's middle, when it comes loose in beats (the top first, so it dissolves from the top down), its size
 * in % and whether it is a foam bubble (a white ring) or a sugar grain in the monster's colour. Spread over the body
 * by the golden angle and fixed, so every monster dissolves alike.
 */
const DUST = Array.from({ length: 16 }, (_, i) => {
  const angle = i * 2.39996;
  const r = Math.sqrt((i + 0.5) / 16);
  const sx = Math.round(19 * r * Math.cos(angle));
  const sy = Math.round(17 * r * Math.sin(angle));
  return {
    sx,
    sy,
    dx: Math.round(sx * 1.8 + (i % 2 ? 6 : -6)),
    dy: Math.round(sy * 1.2 - 34 - (i % 3) * 8),
    delay: Math.round((0.15 + ((sy + 17) / 34) * 0.7) * 100) / 100,
    size: 6 + (i % 3) * 2,
    foam: i % 3 === 1,
  };
});

/**
 * A brushed monster dissolves: its body squeezes, blurs and fades upwards while it falls apart into sugar grains and
 * foam bubbles that drift off and melt away. Each grain is a small HTML element moved by CSS (`teeth-dust`), never
 * something animated inside an svg.
 */
function MonsterDust({ color }: { color: string }) {
  return (
    <div className="monster-dust" aria-hidden>
      {DUST.map((d, i) => (
        <i
          key={i}
          className={d.foam ? "foam" : undefined}
          style={
            {
              "--sx": `${d.sx}%`,
              "--sy": `${d.sy}%`,
              "--dx": `${d.dx}%`,
              "--dy": `${d.dy}%`,
              "--size": `${d.size}%`,
              "--grain": color,
              animationDelay: `${(d.delay * 0.536).toFixed(3)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Rounded, so a place that hasn't really moved leaves the page as it is. */
const round = (n: number, by = 10) => Math.round(n * by) / by;

/** How far a monster reaches from its middle, glow and sway included, in its own units. */
const MONSTER_REACH = 34;

/** Where a sprite's middle lies on the screen, in px from the screen's middle, and how many px one of its units is. */
interface SpriteSpot {
  x: number;
  y: number;
  scale: number;
}

/**
 * A small moving picture over the mirror in an HTML layer of its own, `reach` of its units each way round its middle
 * (an svg in it takes `spriteBox(reach)`). Something animated inside an svg has the browser paint that whole svg again
 * in every frame, and even a small svg on every frame keeps a phone's main thread busy: so the monsters being brushed
 * and the arrows on the lips are each such a layer, and what moves in them (sway, glow, nudge) moves the HTML around
 * their svg, which the browser does without painting (`.monster-sprite`, `.lip-arrow` in teeth.css).
 */
function Sprite({
  spot,
  lean = "",
  reach,
  className,
  children,
}: {
  spot: SpriteSpot;
  /** How it lies flat on a face turned away (`leanOn`). */
  lean?: string;
  reach: number;
  className: string;
  children: ReactNode;
}) {
  const size = round(2 * reach * spot.scale);
  const flat = lean && ` matrix(${lean.split(" ").join(", ")}, 0, 0)`;
  return (
    <div
      className={`mouth-sprite ${className}`}
      style={{ width: size, height: size, transform: `translate(${round(spot.x - size / 2)}px, ${round(spot.y - size / 2)}px)${flat}` }}
    >
      {children}
    </div>
  );
}

/**
 * The front teeth a glint flashes on at the end, in the order they flash: crossing from one side of the smile to the
 * other and between the rows, so the light seems to run over all of them.
 */
const GLINT_TEETH: ToothId[] = [
  { jaw: "upper", side: "left", n: 0 },
  { jaw: "lower", side: "right", n: 1 },
  { jaw: "upper", side: "right", n: 2 },
  { jaw: "upper", side: "left", n: 3 },
  { jaw: "lower", side: "left", n: 0 },
  { jaw: "upper", side: "right", n: 0 },
];
/** How far a glint's rays reach from its middle, in its own units. */
const GLINT_REACH = 50;
/** A glint's size in the picture: its long rays reach about one tooth each way – bigger was too strong. */
const GLINT_SIZE = 1.3;

/**
 * A glint of light as on something polished: a white core with four long, thin rays and four short ones between them,
 * in white light only – never a drawn star with an ink line (stars on the teeth looked out of place, and emoji look
 * poor), nor gold (too strong; user feedback, November 2026). A faint cool shade along its rays lets the white show on
 * the white teeth. Drawn still: its Sprite's HTML flashes it, slowly.
 */
function Glint() {
  const ray = (length: number, width: number, angle: number) => (
    <path key={angle} d={`M0 ${-length} Q${width} 0 0 ${length} Q${-width} 0 0 ${-length} Z`} transform={`rotate(${angle})`} />
  );
  return (
    <>
      <defs>
        <radialGradient id="glint-core">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="0.6" stopColor="#c9dcf2" stopOpacity="0.45" />
          <stop offset="1" stopColor="#c9dcf2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r={26} fill="url(#glint-core)" />
      {/* A faint cool edge, so the white light shows on the white teeth too. */}
      <g fill="#fff" stroke="#7f9cc0" strokeOpacity={0.8} strokeWidth={1.6} strokeLinejoin="round">
        {ray(49, 5.5, 0)}
        {ray(49, 5.5, 90)}
        {ray(24, 4, 45)}
        {ray(24, 4, 135)}
      </g>
      <circle r={6} fill="#fff" />
    </>
  );
}

/** A rectangle as a path, to cut a shape out of it (evenodd). */
const rectPath = ({ x, y, width, height }: { x: number; y: number; width: number; height: number }) => `M${x} ${y} H${x + width} V${y + height} H${x} Z`;

/** The viewBox of an svg filling a Sprite: `reach` units each way round (0, 0). */
const spriteBox = (reach: number) => `${-reach} ${-reach} ${2 * reach} ${2 * reach}`;

/** A point just in front of a face, where a monster or the brush sits. */
const lift = (at: Vec3, face: Face, by: number): Vec3 => [at[0] + face.normal[0] * by, at[1] + face.normal[1] * by, at[2] + face.normal[2] * by];

const subOf = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const unitOf = (a: Vec3): Vec3 => {
  const length = Math.hypot(...a) || 1;
  return [a[0] / length, a[1] / length, a[2] / length];
};

const ARROW_PATH = "M0 -28 L22 -4 L9 -4 L9 24 L-9 24 L-9 -4 L-22 -4 Z";

/** Big arrows on the lips that nudge the way the mouth should move. */
function LipArrows({
  action,
  lips,
  zoom,
  onScreen,
}: {
  action: MouthAction;
  lips: Point2[];
  zoom: number;
  onScreen: (at: { x: number; y: number }, scale: number) => SpriteSpot;
}) {
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
  return arrows.map((a, i) => (
    <Sprite key={i} spot={onScreen({ x, y: a.y }, Math.min(1.1, zoom))} reach={44} className="lip-arrow-sprite">
      <div style={{ transform: `rotate(${a.turn}deg)` }}>
        <svg className="lip-arrow" viewBox={spriteBox(44)}>
          <path d={ARROW_PATH} fill="#ffd23f" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        </svg>
      </div>
    </Sprite>
  ));
}

/**
 * The child's head round the mouth, drawn with the story's parts (`face.tsx`) – the same hair, ears, eyes with their
 * irises, brows and nose – placed on the round head and turned with it, so the mirror shows the child of the story.
 */
function KidFace({ project, head, happy, open, lips }: { project: Project; head: Point2; happy: boolean; open: number; lips: Point2[] }) {
  /** Head units (the story's, round the head's middle, y down) to the picture. */
  const at: HeadMap = (x, y) => project.point(onHead(x / HEAD_UNITS, y / HEAD_UNITS));
  const facingAt = (x: number, y: number) => project.facing(headNormal(x / HEAD_UNITS, y / HEAD_UNITS));
  /** Picture units per head unit: the parts grow with the head. */
  const k = (HEAD_RADIUS * project.zoom) / HEAD_UNITS;
  /** Outlines grow less than the head, so they stay as thick as the lips' and teeth's. */
  const w = Math.min(k, 1.5);
  const squash = (facing: number) => Math.max(0.25, Math.min(1, facing));
  // The cheeks keep clear of the lips: a wide mouth pushes them up and out instead of the blush touching its corners.
  const cheeks = cheekSpots(project, lips);
  // The girl (👧 on the home page) has two pigtails above the ears, which turn with the head like the ears do, and
  // lashes at her eyes – the mirror is so close that often only the eyes show.
  const girl = useFigure() === "girl";
  const { eyes, brows, nose, ears, pigtails, bands } = FACE;
  const sides = [-1, 1] as const;
  const noseFacing = facingAt(0, nose.y);
  const noseTip = at(0, nose.y);

  return (
    <g>
      <defs>
        {/* A soft blush that fades into the skin, no hard edge. */}
        <radialGradient id="kid-cheek">
          <stop offset="0" stopColor="#ff7f99" stopOpacity={0.7} />
          <stop offset="0.6" stopColor="#ff8fa3" stopOpacity={0.45} />
          <stop offset="1" stopColor="#ff8fa3" stopOpacity={0} />
        </radialGradient>
        <SkinGradient id="kid-skin" />
      </defs>
      {girl &&
        sides.map((s) => {
          const tail = at(s * pigtails.x, pigtails.y);
          return (
            <ellipse
              key={s}
              cx={tail.x}
              cy={tail.y}
              rx={pigtails.rx * k}
              ry={pigtails.ry * k}
              transform={`rotate(${s * -35} ${tail.x} ${tail.y})`}
              fill={HAIR}
              stroke={INK}
              strokeWidth={5 * w}
            />
          );
        })}
      {sides.map((s) => {
        const ear = at(s * ears.x, ears.y);
        return <Ear key={s} x={ear.x} y={ear.y} r={ears.r * k} side={s} k={w} />;
      })}
      <circle cx={head.x} cy={head.y} r={HEAD_RADIUS * project.zoom} fill="url(#kid-skin)" stroke={INK} strokeWidth={5 * w} />
      <Hair at={at} k={w} />
      {girl &&
        sides.map((s) => {
          if (facingAt(s * bands.x * 0.6, bands.y) <= 0) return null;
          const band = at(s * bands.x, bands.y);
          return <circle key={s} cx={band.x} cy={band.y} r={bands.r * k} fill={clothesOf("girl").band} stroke={INK} strokeWidth={4 * w} />;
        })}
      {cheeks.map((c, i) => (
        <ellipse key={i} cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} fill="url(#kid-cheek)" />
      ))}
      {sides.map((s) => {
        const facing = facingAt(s * eyes.x, eyes.y);
        if (facing <= 0) return null;
        const eye = at(s * eyes.x, eyes.y);
        const sx = squash(facing);
        // Happy at the end: the eyes closed into laughing arcs, as the story's child's while it chews.
        if (happy)
          return (
            <path
              key={s}
              d={`M${eye.x - eyes.rx * k * sx} ${eye.y + 6 * k} Q${eye.x} ${eye.y - 18 * k} ${eye.x + eyes.rx * k * sx} ${eye.y + 6 * k}`}
              fill="none"
              stroke={INK}
              strokeWidth={6 * w}
              strokeLinecap="round"
            />
          );
        // The eyes don't blink: the face is the still picture under the mirror, and anything moving in it has a phone paint it again.
        return (
          <g key={s}>
            {girl && (
              <path
                d={LASHES.map(([x1, y1, x2, y2]) => `M${eye.x + s * x1 * k * sx} ${eye.y + y1 * k} L${eye.x + s * x2 * k * sx} ${eye.y + y2 * k}`).join(" ")}
                stroke={INK}
                strokeWidth={4 * w}
                strokeLinecap="round"
              />
            )}
            <EyeBall x={eye.x} y={eye.y} rx={eyes.rx * k * sx} ry={eyes.ry * k} k={w} />
            {/* Looking a little down, at the mouth in the mirror; clipped to the eye's white, with the lid over it. */}
            <clipPath id={`kid-eye-${s}`}>
              <ellipse cx={eye.x} cy={eye.y} {...eyeOpening(eyes.rx * k * sx, eyes.ry * k, w)} />
            </clipPath>
            <g clipPath={`url(#kid-eye-${s})`}>
              <Iris x={eye.x + 2 * k * sx} y={eye.y + 5 * k} r={eyes.iris * k} sx={sx} />
            </g>
            <EyeLid x={eye.x} y={eye.y} rx={eyes.rx * k * sx} ry={eyes.ry * k} k={w} />
          </g>
        );
      })}
      {sides.map((s) => {
        const facing = facingAt(s * brows.x, brows.y);
        if (facing <= 0) return null;
        // The brows go up with a wide open mouth.
        const brow = at(s * brows.x, brows.y - 10 * open);
        const half = 20 * k * squash(facing);
        return (
          <path
            key={s}
            d={`M${brow.x - half} ${brow.y + 3 * k} Q${brow.x} ${brow.y - 8 * k} ${brow.x + half} ${brow.y + 3 * k}`}
            fill="none"
            stroke={BROW}
            strokeWidth={6 * w}
            strokeLinecap="round"
          />
        );
      })}
      {noseFacing > 0 && <Nose x={noseTip.x} y={noseTip.y} r={nose.r * k} sx={squash(noseFacing)} k={w} />}
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

/** A sugar monster's round body with its wavy foot, about 30 wide round (0, 0). */
const MONSTER_BODY = "M-15 8 C-17 -6 -10 -15 0 -15 C10 -15 17 -6 15 8 C12 14 7 11 5 15 C2 11 -2 11 -5 15 C-7 11 -12 14 -15 8 Z";

/** Where the mirror's frame covers its bottom edge, in px from the screen's edge (FRAME_PX: inset and half the ink). */
const MIRROR_EDGE_PX = 12;

/** How far the dazzled monster reaches round its middle, horns and paws included, in its own units. */
const DAZZLED_REACH = 26;

/**
 * The end's surprise: a last sugar monster rises at the bottom edge of the mirror, squeezes its eyes shut at the
 * shining teeth, then sunglasses drop onto its nose and it grins – there is no sugar left for it. A small layer of
 * its own (body and glasses each an HTML layer moved by CSS, `teeth-dazzle-…`), placed on the screen, so the end's
 * zoom doesn't move it.
 */
function DazzledMonster({ screen }: { screen: { width: number; height: number } }) {
  const size = round(Math.min(screen.height * 0.36, screen.width * 0.26));
  const box = spriteBox(DAZZLED_REACH);
  return (
    <div
      className="mouth-sprite dazzled-monster"
      style={{
        width: size,
        height: size,
        transform: `translate(${round(screen.width * 0.3 - size / 2)}px, ${round(screen.height / 2 - size - MIRROR_EDGE_PX)}px)`,
      }}
    >
      <div className="dazzle-body">
        <svg viewBox={box} aria-hidden>
          <path d={MONSTER_TOPS[0]} fill="#8bd346" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          {/* Paws up at the bright light. */}
          <g fill="#8bd346" stroke={INK} strokeWidth={2}>
            <ellipse cx={-17} cy={0} rx={4.5} ry={3.5} transform="rotate(-30 -17 0)" />
            <ellipse cx={17} cy={0} rx={4.5} ry={3.5} transform="rotate(30 17 0)" />
          </g>
          <path d={MONSTER_BODY} fill="#8bd346" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          {/* Eyes squeezed shut: > < */}
          <path d="M-9 -7 L-4 -4 L-9 -1 M9 -7 L4 -4 L9 -1" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-6 4 Q0 10 6 4" fill="#7a1f3d" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path d="M-3.5 5.6 L-2.2 9 L-0.8 6.6 Z" fill="#fff" />
        </svg>
        <div className="dazzle-glasses">
          <svg viewBox={box} aria-hidden>
            <path d="M-13 -5 L13 -5" stroke={INK} strokeWidth={2} />
            <path d="M-13 -5 L-17 -8 M13 -5 L17 -8" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
            <path
              d="M-12.5 -6.5 H-1.5 Q-1.5 1.5 -7 1.5 Q-12.5 1.5 -12.5 -6.5 Z M1.5 -6.5 H12.5 Q12.5 1.5 7 1.5 Q1.5 1.5 1.5 -6.5 Z"
              fill="#2b2140"
              stroke={INK}
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
            {/* The light on the lenses. */}
            <path d="M-10 -4.5 L-7.5 -4.5 M3.5 -4.5 L6 -4.5" stroke="#fff" strokeWidth={1.3} strokeLinecap="round" opacity={0.85} />
          </svg>
        </div>
      </div>
    </div>
  );
}

/** A sugar monster drawn round its middle, about 30 wide; the story at the start (origin.tsx) shows the same ones. */
export function Monster({
  color,
  variant,
  active,
  gone,
  scared,
  tickled,
  blinkMs,
  still,
  onTickle,
}: {
  color: string;
  variant: number;
  active: boolean;
  /** Stands still, not even blinking: in the mirror only the ones to brush now move, so a phone keeps up. */
  still?: boolean;
  gone: boolean;
  scared: boolean;
  tickled: boolean;
  blinkMs: number;
  onTickle: () => void;
}) {
  // A tapped monster giggles instead of the tap pausing the brushing; where one is gone, the tap goes on to the picture.
  const stop = (e: PointerEvent) => {
    if (gone) return;
    e.stopPropagation();
    onTickle();
  };
  return (
    <g
      className={`sugar-monster${gone ? " gone" : ""}${scared ? " scared" : ""}${tickled ? " tickled" : ""}${still ? " still" : ""}`}
      style={{ "--blink": `${-(blinkMs % 3700)}ms` } as CSSProperties}
    >
      {/* The ones to brush now glow. */}
      {active && <circle className="monster-glow" cy={-3} r={27} fill="url(#monster-glow)" />}
      <g className="monster-body" data-tap={gone ? "done" : ""} onPointerDown={stop}>
        <path d={MONSTER_TOPS[variant % MONSTER_TOPS.length]} fill={color} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {variant % MONSTER_TOPS.length === 1 && (
          <g fill={color} stroke={INK} strokeWidth={2}>
            <circle cx={-9} cy={-24} r={3.2} />
            <circle cx={9} cy={-24} r={3.2} />
          </g>
        )}
        <path d={MONSTER_BODY} fill={color} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
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
    </g>
  );
}
