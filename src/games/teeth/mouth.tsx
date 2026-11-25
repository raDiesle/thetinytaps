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
import { Brush, lerp3, squeezeOut, type BrushAnchor } from "./brush";
import type { Motion } from "./steps";
import { faceKey } from "./stains";

// A child's face in a mirror, close up. The mouth is a small 3D model (see
// jaw.ts), so the picture can turn and tilt to show exactly where to brush.

export { INK, SKIN } from "./face";
/**
 * A clean tooth's faces: a bright, cool white, the side turned to the viewer purest, the others a breath darker so the
 * tooth reads round – never cream (user feedback, November 2026: brushed teeth should be a beautiful white).
 */
export const TOOTH_FILLS: Record<FaceKind, string> = { outer: "#ffffff", top: "#f5f7fb", inner: "#eff2f7", side: "#dde2ea" };
/**
 * A face not brushed yet is a little yellow, with grey-yellow plaque along the gum (in the fissure on a chewing surface)
 * and a few grey spots (`StainedFace`); brushed it turns white (user request, November 2026). Soft, a picture book's
 * stain, never brown or rotten.
 */
export const STAIN_FILLS: Record<FaceKind, string> = { outer: "#f3e3b3", top: "#ead59b", inner: "#e6d4a6", side: "#e6d8bd" };
/** The stain's plaque and spots, the story's (origin.tsx) too. */
export const STAIN = { plaque: "#dcc27c", plaqueOpacity: 0.75, spot: "#b9b09c", spotOpacity: 0.5 };
const GUM_FILLS: Record<FaceKind, string> = { outer: "#ff8fab", top: "#ffa6bc", inner: "#f27c9c", side: "#ff8fab" };
/** The gum's edge round each tooth. */
const GUM_RIM = "#e2577c";
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
  /** The faces not brushed yet (`faceKey`): stained, and white once brushed. */
  dirty: readonly string[];
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
   * to brush waits until it holds still (their monsters show the way meanwhile).
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

/** The faces of a crown that show: slivers of the sides between teeth only add clutter. */
const shownFaces = (t: MouthModel["teeth"][number], project: Project) =>
  t.faces.filter((f) => project.facing(f.normal) > (f.kind === "side" ? 0.3 : MIN_FACING));
/** How round a face's corners are drawn. */
const faceRadius = (f: Face) => (f.kind === "outer" ? 7 : 3);

/**
 * A tooth's crown: the faces that show, with the groove on a molar; `dirty` the faces not brushed yet, which are
 * stained. The light on its front shows only once that face is clean: a brushed tooth gains its shine.
 */
function Crown({ tooth: t, project, dirty }: { tooth: MouthModel["teeth"][number]; project: Project; dirty?: ReadonlySet<FaceKind> }) {
  const p = project.point;
  return (
    <>
      {shownFaces(t, project).map((f, j) =>
        dirty?.has(f.kind) ? (
          <StainedFace key={j} face={f} project={project} seed={seedOf(t.id)} />
        ) : (
          <path key={j} d={facePath(f, project, faceRadius(f))} fill={TOOTH_FILLS[f.kind]} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
        ),
      )}
      {!dirty?.has("outer") && project.facing(surfaceFace(t.faces, "outer").normal) > 0.55 && (
        <path d={`M${fmt(p(t.shine[0]))} L${fmt(p(t.shine[1]))}`} stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
      )}
      {t.groove && project.facing(surfaceFace(t.faces, "top").normal) > 0.25 && <Groove tooth={t} project={project} />}
    </>
  );
}

/** The groove along a molar's chewing surface. */
function Groove({ tooth: t, project }: { tooth: MouthModel["teeth"][number]; project: Project }) {
  return <path d={`M${t.groove!.map((g) => fmt(project.point(g))).join(" L")}`} fill="none" stroke="#ccd3de" strokeWidth={2} strokeLinecap="round" />;
}

/** A number of its own for each tooth, so the stains differ from tooth to tooth but stay where they are. */
const seedOf = (id: ToothId) => id.n + (id.side === "left" ? 0 : 5) + (id.jaw === "upper" ? 0 : 10);

/**
 * A point on a face: `u` along the tooth from one end (0) to the other (1), `v` from its first long edge (0: the biting
 * edge, on a chewing surface the cheek side) to its second (1: the gum, or the tongue side).
 */
function onFace(face: Face, u: number, v: number): Vec3 {
  const n = face.points.length;
  const half = n / 2;
  const x = Math.min(1, Math.max(0, u)) * (half - 1);
  const i = Math.min(half - 2, Math.floor(x));
  const k = x - i;
  const a = lerp3(face.points[i], face.points[i + 1], k);
  const b = lerp3(face.points[n - 1 - i], face.points[n - 2 - i], k);
  return lerp3(a, b, v);
}

/** A closed shape on a face from points given as (u, v), in the face's own perspective. */
const facePatch = (face: Face, project: Project, uv: [number, number][]) => `M${uv.map(([u, v]) => fmt(project.point(onFace(face, u, v)))).join(" L")} Z`;

/** A round spot on a face, (u, v) its middle and (ru, rv) how far it reaches. */
const faceSpot = (face: Face, project: Project, u: number, v: number, ru: number, rv: number) =>
  facePatch(
    face,
    project,
    Array.from({ length: 10 }, (_, i): [number, number] => [u + ru * Math.cos((i * Math.PI) / 5), v + rv * Math.sin((i * Math.PI) / 5)]),
  );

/**
 * A face not brushed yet: a little yellow, grey-yellow plaque where a real tooth gathers it – along the gum, or in the
 * fissure of a chewing surface – and two soft grey spots, each tooth's a little different (`seed`).
 */
function StainedFace({ face, project, seed }: { face: Face; project: Project; seed: number }) {
  const d = facePath(face, project, faceRadius(face));
  const wave = (u: number, by: number) => by * Math.sin(u * Math.PI * 3 + seed);
  const us = Array.from({ length: 9 }, (_, i) => 0.04 + (0.92 * i) / 8);
  // Along the gum a wavy band; on a chewing surface a patch along the middle, where the groove is.
  const plaque: [number, number][] =
    face.kind === "top"
      ? [...us.map((u): [number, number] => [u, 0.36 + wave(u, 0.06)]), ...[...us].reverse().map((u): [number, number] => [u, 0.64 + wave(u + 0.4, 0.06)])]
      : [...us.map((u): [number, number] => [u, 0.6 + wave(u, 0.08)]), [0.96, 1], [0.04, 1]];
  const at = (k: number) => 0.2 + ((seed * 0.37 + k) % 1) * 0.6;
  return (
    <>
      <path d={d} fill={STAIN_FILLS[face.kind]} />
      <path d={facePatch(face, project, plaque)} fill={STAIN.plaque} opacity={STAIN.plaqueOpacity} />
      <path d={faceSpot(face, project, at(0), face.kind === "top" ? 0.25 : 0.32, 0.1, 0.12)} fill={STAIN.spot} opacity={STAIN.spotOpacity} />
      <path d={faceSpot(face, project, at(0.5), face.kind === "top" ? 0.72 : 0.5, 0.07, 0.09)} fill={STAIN.spot} opacity={STAIN.spotOpacity * 0.8} />
      <path d={d} fill="none" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
    </>
  );
}

/**
 * A tooth's own piece of gum: its top, drawn under the tooth, or its walls with their darker rim, drawn over the
 * tooth's foot so it stands in the gum.
 */
function GumFaces({ gum, project, top }: { gum: MouthModel["gums"][number]; project: Project; top: boolean }) {
  const p = project.point;
  const rims = top ? [] : (["outer", "inner"] as const).filter((kind) => project.facing(surfaceFace(gum.faces, kind).normal) > MIN_FACING);
  return (
    <>
      {gum.faces
        .filter((f) => (f.kind === "top") === top && project.facing(f.normal) > MIN_FACING)
        .map((f, j) => (
          <path key={`gum-${top}-${j}`} d={facePath(f, project)} fill={GUM_FILLS[f.kind]} stroke={GUM_FILLS[f.kind]} strokeWidth={1.5} />
        ))}
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
    </>
  );
}

/** The mirror's glass behind the head. */
const MIRROR_GLASS = "#dff6ff";

/**
 * The face's outline in a profile as a path: `line` is `profileLine`'s two runs of equal length, down to the upper
 * lip's end and on from the lower one's, drawn apart so nothing runs across the mouth between the lips.
 */
function profileOutline(line: Point2[]): string {
  const half = line.length / 2;
  return `M${line.slice(0, half).map(fmt).join(" L")} M${line.slice(half).map(fmt).join(" L")}`;
}

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
 * `front` are the front teeth's corners on the screen, `k` how far the view is a profile (`profileOf`).
 *
 * The cut is never see-through: while the head turns into the profile its outline slides in from the head's own edge
 * on the far side, where it covers nothing, to the face's front, so the far cheek goes behind it as if the head turned
 * on. Faded in by its opacity, the glass and the profile's lips lay half see-through over the front view's lips and
 * gum for a moment, which looked broken (user feedback, November 2026).
 */
function profileParts(lips3d: Vec3[], lips: Point2[], face: Project, front: Point2[], k: number): ProfileParts {
  // Past the face's front, as far as the picture could reach: the direction its front faces on the screen.
  const out = face.direction([0, 0, 1]);
  const head = face.point(HEAD_MIDDLE);
  const radius = HEAD_RADIUS * face.zoom;
  const side = Math.sign(out.x) || 1;
  const line = profileLine(lips3d)
    .map(face.point)
    .map((p) => {
      const dy = Math.max(-radius, Math.min(radius, p.y - head.y));
      const edge = head.x + side * Math.sqrt(radius * radius - dy * dy);
      return { ...p, x: edge + (p.x - edge) * k };
    });
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

export function Mouth({ view, zone, monsters, dirty, brush, happy, dazzled, action, gliding, glide, free, onTickle }: MouthProps) {
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
    return profileParts(lips3d, lipPoints, all.face, front, profile);
  }, [profile, model, lips3d, lipPoints, all]);

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

  // The teeth in the order the still picture draws them: jaw by jaw, far teeth first.
  const painted = useMemo(
    () =>
      jawOrder(view).flatMap((jaw) => {
        const project = all[jaw];
        const p = project.point;
        return model.teeth
          .filter((t) => t.id.jaw === jaw)
          .sort((a, b) => p(a.center).depth - p(b.center).depth)
          .map((t) => ({ tooth: t, gum: gumsByKey.get(t.key)!, project }));
      }),
    [view, all, model, gumsByKey],
  );

  // The faces being brushed now turn white in layers of their own (`ToothStain`), so the still picture draws them
  // white already and stays the same while they are brushed; while the head glides they are stained in it like the rest.
  const layered = zone !== null && !gliding;
  const zoneFaces = useMemo(() => new Set(zone?.teeth.map((id) => faceKey(id, zone.surface))), [zone?.teeth, zone?.surface]);
  const stillDirty = dirty.filter((k) => !(layered && zoneFaces.has(k))).join(" ");

  // The face and the teeth change only while the head turns or the mouth opens, or a step's teeth are done: built once
  // for each, not again with every tick of the clock (hundreds of paths, too slow for a phone five times a second).
  const still = useMemo(() => {
    const dirtyBy = new Map<string, Set<FaceKind>>();
    for (const k of stillDirty.split(" ").filter(Boolean)) {
      const [tooth, surface] = k.split(":");
      dirtyBy.set(tooth, (dirtyBy.get(tooth) ?? new Set()).add(surface as Surface));
    }
    // Far teeth first; each one stands in its own piece of gum: the gum's top under it, its walls over its foot.
    const jawParts = painted.map(({ tooth: t, gum, project }) => (
      <g key={t.key}>
        <GumFaces gum={gum} project={project} top />
        <Crown tooth={t} project={project} dirty={dirtyBy.get(t.key)} />
        <GumFaces gum={gum} project={project} top={false} />
      </g>
    ));

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
  }, [view, all, model, painted, lipPoints, lipsPath, stillDirty, happy]);

  // The stains on the teeth being brushed now, each a small layer of its own over the still picture that fades away
  // as its tooth's monsters are brushed off: a fade inside the picture's svg would have the phone paint the screen
  // anew in every frame of it. Each holds only what the still picture draws over that face (`StainGeometry`).
  const stains = useMemo(
    () => (layered && zone ? zone.teeth.flatMap((id) => stainGeometry(painted, id, zone.surface)) : []),
    [layered, zone?.teeth, zone?.surface, painted],
  );
  // A face shows its fading stain and its glint only once it was seen stained: a step jumped to half way through
  // starts with its brushed teeth white.
  const seenDirty = useRef(new Set<string>());
  for (const k of dirty) if (zoneFaces.has(k)) seenDirty.current.add(k);
  const shownStains = stains.filter((g) => seenDirty.current.has(g.key));
  // A brushed face sparkles only once the brush has reached the next tooth (user feedback, November 2026: a glint
  // flashing while the brush still lay on the tooth was hardly seen, and only the step's last tooth seemed to sparkle),
  // and then every brushed face of the view goes on sparkling softly while the head holds still.
  const sparkling = stains.filter((g) => !dirty.includes(g.key) && brush !== null && brushLeft(brush, g.tooth.id));

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
    const squeeze = m.gone && !m.waiting ? squeezedBy(squeezeOut(anchorAt(m, m.surface), m.surface, m.tooth, jaw), lean, MONSTER_SIZE * project.zoom) : null;
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
        squeezeAngle={squeeze?.angle ?? 0}
        squeezeBy={squeeze?.by ?? 1}
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
  // 2026). It comes in as the head turns that far (`profile`), never at once, and never see-through: its outline slides
  // in from the head's far edge (`profileParts`).
  const profileCut = useMemo(() => {
    if (!side) return null;
    const near = smoothPart(lipPoints, side.nearFrom, side.nearCount);
    return (
      <g>
        <path d={side.beyond} fill={MIRROR_GLASS} />
        {/* Two lines, down to the upper lip and on from the lower one: the outline never runs across the mouth between
            the lips, where it lay as a black stroke in front of the teeth (user feedback, November 2026). */}
        <path d={profileOutline(side.line)} fill="none" stroke={INK} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
        <path d={near} fill="none" stroke={INK} strokeWidth={34} strokeLinejoin="round" strokeLinecap="round" />
        <path d={near} fill="none" stroke={LIP} strokeWidth={27} strokeLinejoin="round" strokeLinecap="round" />
      </g>
    );
  }, [side, lipPoints]);

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

      {shownStains.length > 0 && (
        <div className="mouth-stains">
          {shownStains.map((g) => {
            const at = onScreen(g.box, 1);
            return (
              <ToothStain
                key={g.key}
                geometry={g}
                x={round(at.x)}
                y={round(at.y)}
                width={round(g.box.width / unit)}
                height={round(g.box.height / unit)}
                clean={!dirty.includes(g.key)}
              />
            );
          })}
        </div>
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
        {/* The teeth of this view already brushed sparkle softly, small glints coming and going, once the brush has
            moved on from them (`sparkling`). */}
        {sparkling.map((g) =>
          g.sparkles.map((spark, j) => {
            const at = onScreen(spark, GLINT_SIZE * SPARKLE_SIZE);
            return (
              <Sprite
                key={`${g.key}-${j}`}
                spot={{ x: round(at.x), y: round(at.y), scale: round(at.scale, 1000) }}
                reach={GLINT_REACH}
                className="tooth-glint brushed"
              >
                <div style={{ "--turn": j + (g.seed % 3) * 0.5 } as CSSProperties}>
                  <svg viewBox={spriteBox(GLINT_REACH)} aria-hidden>
                    <Glint />
                  </svg>
                </div>
              </Sprite>
            );
          }),
        )}
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
  squeezeAngle,
  squeezeBy,
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
  /** Caught by the brush (`gone`): which way it is squeezed out in its sprite, in degrees, and how far (`squeezedBy`). */
  squeezeAngle: number;
  squeezeBy: number;
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
        <div
          className="sprite-body"
          style={
            gone
              ? ({
                  "--squeeze-a": `${squeezeAngle}deg`,
                  "--squeeze-k": squeezeBy,
                  "--squeeze-s": round(1 / Math.sqrt(squeezeBy), 100),
                } as CSSProperties)
              : undefined
          }
        >
          <svg viewBox={spriteBox(MONSTER_REACH)}>{drawn}</svg>
        </div>
        {gone && <MonsterDust color={color} />}
      </Sprite>
    );
  return <g transform={`translate(${x} ${y}) scale(${scale})${lean && ` matrix(${lean} 0 0)`}`}>{drawn}</g>;
});

/** How far a monster reaches from its middle across, in its own units (`Monster`, about 30 wide). */
const MONSTER_HALF = 15;
/** How far a squeezed monster shows past the brush's head on each side, in its own half-widths. */
const SQUEEZE_PAST = 1;

/**
 * How a monster the brush catches is squeezed: so flat under the head that it bulges out past the head's edges on
 * both sides, where the head is thinnest on the screen (`squeezeOut`) – the brush lies in front of it, and only so is
 * it seen that the brush has caught it (user request, November 2026). The squeeze is done inside the sprite, under its
 * lean (`leanOn`), so the screen's direction is turned back through the lean first. `size` is how big one of the
 * monster's units is in the picture; `angle` in degrees in the sprite, `by` how much longer it gets that way.
 */
export function squeezedBy(head: { angle: number; reach: number }, lean: string, size: number): { angle: number; by: number } {
  const a = (head.angle * Math.PI) / 180;
  let d = { x: Math.cos(a), y: Math.sin(a) };
  if (lean) {
    const [m11, m12, m21, m22] = lean.split(" ").map(Number);
    // CSS matrix(a, b, c, d): x' = a x + c y, y' = b x + d y; solved for the sprite's own direction.
    const det = m11 * m22 - m21 * m12 || 1;
    d = { x: (m22 * d.x - m21 * d.y) / det, y: (-m12 * d.x + m11 * d.y) / det };
  }
  const stretch = Math.hypot(d.x, d.y);
  const by = Math.min(3.4, Math.max(1.8, (head.reach / (MONSTER_HALF * size) + SQUEEZE_PAST) * stretch));
  return { angle: Math.round((Math.atan2(d.y, d.x) * 180) / Math.PI / 5) * 5, by: round(by) };
}

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
              // After the beat it is held squeezed under the brush.
              animationDelay: `${((1 + d.delay) * 0.536).toFixed(3)}s`,
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

/**
 * The sparkles on a tooth brushed are small, under a third of the end's glints, two to a face: small glints rather
 * than one big one (user feedback, November 2026).
 */
const SPARKLE_SIZE = 0.3;

/**
 * Whether the brush has moved on from `tooth` to the next one: it has reached the stop after the tooth's last. A tooth
 * with no stop is never left.
 */
function brushLeft(brush: { stops: { tooth: ToothId }[]; at: number }, tooth: ToothId): boolean {
  const key = toothKey(tooth);
  let last = -1;
  brush.stops.forEach((s, i) => {
    if (toothKey(s.tooth) === key) last = i;
  });
  return last >= 0 && last < brush.stops.length - 1 && brush.at >= last + 1;
}

/** What a stain layer of one face needs, in picture units: where it lies and what the still picture draws over it. */
interface StainGeometry {
  key: string;
  face: Face;
  tooth: MouthModel["teeth"][number];
  project: Project;
  seed: number;
  /** The layer's place, a little bigger than the face for its outline. */
  box: Box;
  /** Where the face sparkles once it is clean: two small points apart on it. */
  sparkles: { x: number; y: number }[];
  /**
   * The outlines of what the still picture draws over the face – its crown's later faces, its gum's walls, the teeth
   * drawn after it that reach into its box – as plain shapes (`cut`, filled with their outline) and gum rims (`rims`,
   * lines): the stain's mask cuts them out in black, with no filter to turn the drawn things black.
   */
  cut: string[];
  rims: string[];
}

/** The outlines of a tooth's gum (its top or walls, `top`) and their rims, as the still picture draws them. */
function gumOutlines(gum: MouthModel["gums"][number], project: Project, top: boolean) {
  const cut = gum.faces.filter((f) => (f.kind === "top") === top && project.facing(f.normal) > MIN_FACING).map((f) => facePath(f, project));
  const rims = top
    ? []
    : (["outer", "inner"] as const)
        .filter((kind) => project.facing(surfaceFace(gum.faces, kind).normal) > MIN_FACING)
        .map((kind) => `M${gum.rims[kind].map((r) => fmt(project.point(r))).join(" L")}`);
  return { cut, rims };
}

/** The box round points in picture units, `pad` more each way. */
function boxAround(points: { x: number; y: number }[], pad: number): Box {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const x = Math.floor(Math.min(...xs) - pad);
  const y = Math.floor(Math.min(...ys) - pad);
  return { x, y, width: Math.ceil(Math.max(...xs) + pad) - x, height: Math.ceil(Math.max(...ys) + pad) - y };
}

const overlaps = (a: Box, b: Box) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

/** The stain layer of a tooth's face being brushed now, or none where that face is turned away. */
function stainGeometry(
  painted: { tooth: MouthModel["teeth"][number]; gum: MouthModel["gums"][number]; project: Project }[],
  id: ToothId,
  surface: Surface,
): StainGeometry[] {
  const i = painted.findIndex((p) => p.tooth.key === toothKey(id));
  if (i < 0) return [];
  const { tooth, gum, project } = painted[i];
  const shown = shownFaces(tooth, project);
  const face = shown.find((f) => f.kind === surface);
  if (!face) return [];
  const box = boxAround(face.points.map(project.point), 3);
  const reach = (t: MouthModel["teeth"][number], g: MouthModel["gums"][number], at: Project) =>
    boxAround(
      [...t.faces, ...g.faces].flatMap((f) => f.points.map(at.point)),
      3,
    );
  const own = shown.slice(shown.indexOf(face) + 1).map((f) => facePath(f, project, faceRadius(f)));
  const walls = gumOutlines(gum, project, false);
  const after = painted
    .slice(i + 1)
    .filter((p) => overlaps(box, reach(p.tooth, p.gum, p.project)))
    .map((p) => {
      const [top, sides] = [gumOutlines(p.gum, p.project, true), gumOutlines(p.gum, p.project, false)];
      const crown = shownFaces(p.tooth, p.project).map((f) => facePath(f, p.project, faceRadius(f)));
      return { cut: [...top.cut, ...crown, ...sides.cut], rims: sides.rims };
    });
  return [
    {
      key: faceKey(id, surface),
      face,
      tooth,
      project,
      seed: seedOf(id),
      box,
      sparkles: [project.point(onFace(face, 0.3, 0.3)), project.point(onFace(face, 0.7, 0.65))],
      cut: [...own, ...walls.cut, ...after.flatMap((a) => a.cut)],
      rims: [...walls.rims, ...after.flatMap((a) => a.rims)],
    },
  ];
}

/**
 * The stain on a face being brushed, in a small layer of its own over the still picture (which draws that face white
 * already): it fades away as the tooth's monsters are brushed off (`clean`), moving only its opacity. The still picture
 * draws other things over the face (its gum's walls, nearer teeth, the other row): they are masked out of the stain,
 * so it lies exactly where the face shows.
 */
const ToothStain = memo(function ToothStain({
  geometry: g,
  x,
  y,
  width,
  height,
  clean,
}: {
  geometry: StainGeometry;
  x: number;
  y: number;
  width: number;
  height: number;
  clean: boolean;
}) {
  const { box } = g;
  const id = `stain-${g.key.replace(/[^a-z0-9-]/gi, "-")}`;
  const d = facePath(g.face, g.project, faceRadius(g.face));
  // The drawing never changes while the layer lives, only the layer's place and opacity.
  const drawing = useMemo(
    () => (
      <svg viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`} aria-hidden>
        <defs>
          {/* Everything the still picture draws over the face is cut out of the stain in plain black: no filter, which
              had an old phone paint each layer anew and doubled the paint while brushing (`bun run perf zaehne`). */}
          <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x={box.x} y={box.y} width={box.width} height={box.height}>
            <path d={d} fill="#fff" stroke="#fff" strokeWidth={2.2} strokeLinejoin="round" />
            <g fill="#000" stroke="#000" strokeWidth={2.2} strokeLinejoin="round">
              {g.cut.map((c, j) => (
                <path key={j} d={c} />
              ))}
            </g>
            <g fill="none" stroke="#000" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              {g.rims.map((c, j) => (
                <path key={j} d={c} />
              ))}
            </g>
          </mask>
        </defs>
        <g mask={`url(#${id}-mask)`}>
          <StainedFace face={g.face} project={g.project} seed={g.seed} />
          {g.face.kind === "top" && g.tooth.groove && g.project.facing(g.face.normal) > 0.25 && <Groove tooth={g.tooth} project={g.project} />}
        </g>
      </svg>
    ),
    [g],
  );
  return (
    <div className={`tooth-stain${clean ? " clean" : ""}`} style={{ width, height, transform: `translate(${x}px, ${y}px)` }}>
      {drawing}
    </div>
  );
});

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
/**
 * Drips of sticky sugar hanging from a monster's foot onto its tooth, each ending in a round drop; drawn under the body,
 * which covers their tops. Each kind of monster drips a little differently.
 */
const MONSTER_DRIPS = [
  [
    "M-11 10 C-11.5 15 -12 17 -10 19.5 C-8 21 -6.5 18.5 -7.5 16 C-8 14 -7.5 12 -7.5 10 Z",
    "M7 11 C7 14 6.5 15.5 8 16.8 C9.6 17.6 10.6 15.8 10 14 C9.6 12.8 10 11.5 10 10 Z",
  ],
  [
    "M-3 12 C-3 16 -3.6 18.5 -1.5 20.5 C0.6 21.8 2.2 19.4 1.4 17 C0.8 15.2 1.2 13.6 1.2 12 Z",
    "M9 10 C9.4 13 8.6 14.6 10.2 15.8 C11.8 16.6 12.6 14.8 12 13 C11.6 12 12 11 12 9.5 Z",
  ],
  [
    "M-12 9 C-12.2 12.5 -12.8 14.4 -11 15.8 C-9.4 16.8 -8.2 15 -8.8 13.2 C-9.2 12 -8.8 10.6 -8.8 9.5 Z",
    "M3 12 C3.2 16.5 2.4 19 4.6 20.6 C6.6 21.6 7.8 19.2 6.8 17 C6.2 15.4 6.6 13.8 6.6 12 Z",
  ],
];

/** Little paws on both sides, pressed flat onto the tooth where the monster clings to it. */
const MONSTER_PAWS = "M-14.5 1 C-18 0 -20.5 2 -20.5 4.5 C-20.5 7 -18 8 -15 7 Z M14.5 1 C18 0 20.5 2 20.5 4.5 C20.5 7 18 8 15 7 Z";

/** A wet light on the top of a monster's head. */
const MONSTER_SHINE = "M-10.5 -7.5 C-10 -11 -7 -13 -4 -13 C-6 -11.6 -8 -9.8 -8.6 -7.4 C-9 -6.4 -10.6 -6.4 -10.5 -7.5 Z";

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
      {/* The ones to brush now glow, only just round them, so the light stays on their tooth (`.sprite-glow`). */}
      {active && <circle className="monster-glow" cy={-3} r={21} fill="url(#monster-glow)" />}
      <g className="monster-body" data-tap={gone ? "done" : ""} onPointerDown={stop}>
        {/* Sticky: the monster has melted a little onto its tooth – a puddle of its sugar under it, drips hanging from
            its foot and little paws stuck to the tooth on both sides (user feedback, November 2026). */}
        <ellipse cx={0} cy={13} rx={18} ry={4.5} fill={color} opacity={0.5} />
        <g fill={color} stroke={INK} strokeWidth={1.6} strokeLinejoin="round">
          {MONSTER_DRIPS[variant % MONSTER_DRIPS.length].map((d) => (
            <path key={d} d={d} />
          ))}
          <path d={MONSTER_PAWS} />
        </g>
        <path d={MONSTER_TOPS[variant % MONSTER_TOPS.length]} fill={color} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {variant % MONSTER_TOPS.length === 1 && (
          <g fill={color} stroke={INK} strokeWidth={2}>
            <circle cx={-9} cy={-24} r={3.2} />
            <circle cx={9} cy={-24} r={3.2} />
          </g>
        )}
        <path d={MONSTER_BODY} fill={color} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        {/* The wet shine of something sticky. */}
        <path d={MONSTER_SHINE} fill="#fff" opacity={0.75} />
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
