// The child's face, drawn alike in the story at the start (origin.tsx, flat) and in the mirror (mouth.tsx, turned and
// zoomed like a 3D head): the same hair, ears, eyes and nose, so the child in the mirror at the end is plainly the one
// who ate the sweets (user feedback, November 2026: the end's face had a plain fringe, small black dot eyes and looked
// like another child). Every part is drawn for a head of radius `HEAD_UNITS` round (0, 0), y down, and placed by a
// `HeadMap`, which takes such a point to the picture: in the story a plain shift, in the mirror the head's projection.

/** The outlines of every drawing in the game. */
export const INK = "#2a1e5c";
export const SKIN = "#f7c9a1";
/** The skin in shade, at the head's edge and inside the ears. */
export const SKIN_SHADE = "#eab089";
/** The skin in the light, up on the forehead and cheeks. */
export const SKIN_LIGHT = "#fde0c4";
/** The child's hair. */
export const HAIR = "#8a5a3b";
/** Strands in the hair. */
export const HAIR_DARK = "#6b4229";
/** The light on the hair. */
export const HAIR_LIGHT = "#b98457";
/** The brows: a little darker than the hair, so they read on the skin. */
export const BROW = "#6b4229";
/** The lips, alike in the story and the mirror. */
export const LIP = "#ff7088";
/** A warm brown iris round the pupil, as the app's mascots have (root CLAUDE.md). */
export const IRIS = "#8a5533";
/** The iris's rim and the pupil: dark warm browns. */
const IRIS_RIM = "#4a2a18";
const PUPIL = "#2b1810";

/** The head's radius in the units the parts are drawn in: the story's head. */
export const HEAD_UNITS = 165;

/** Where a point of the head (in head units round its middle, y down) lies in the picture. */
export type HeadMap = (x: number, y: number) => { x: number; y: number };

/** A path through points of the head: each command's points are mapped, so the shape turns with the head. */
type PathPart = [string, ...[number, number][]];

const pathOf = (parts: PathPart[], at: HeadMap) =>
  parts
    .map(([cmd, ...points]) => {
      const coords = points.map(([x, y]) => {
        const p = at(x, y);
        return `${Math.round(p.x * 10) / 10} ${Math.round(p.y * 10) / 10}`;
      });
      return `${cmd}${coords.join(" ")}`;
    })
    .join(" ");

/** The hair: round over the top, a fringe of soft locks over the forehead. */
const HAIR_PARTS: PathPart[] = [
  ["M", [-162, -15]],
  ["C", [-172, -123], [-80, -173], [0, -173]],
  ["C", [80, -173], [172, -123], [162, -15]],
  ["C", [152, -65], [122, -97], [82, -91]],
  ["Q", [62, -120], [32, -100]],
  ["Q", [4, -126], [-24, -100]],
  ["Q", [-54, -122], [-82, -91]],
  ["C", [-122, -97], [-152, -65], [-162, -15]],
  ["Z"],
];
/** The little curl on top. */
const CURL_PARTS: PathPart[] = [
  ["M", [2, -171]],
  ["C", [-14, -197], [18, -211], [24, -191]],
  ["C", [28, -177], [10, -173], [8, -183]],
];
/** Strands running down to the fringe's locks, and the light on the hair. */
const STRAND_PARTS: PathPart[][] = [
  [
    ["M", [-58, -160]],
    ["Q", [-74, -130], [-66, -106]],
  ],
  [
    ["M", [6, -166]],
    ["Q", [-6, -138], [4, -114]],
  ],
  [
    ["M", [64, -158]],
    ["Q", [76, -128], [60, -104]],
  ],
];
const SHINE_PARTS: PathPart[] = [
  ["M", [-120, -110]],
  ["Q", [-96, -150], [-46, -160]],
];

/** The hair with its strands, its light and its curl; `k` scales the outlines. */
export function Hair({ at, k = 1 }: { at: HeadMap; k?: number }) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d={pathOf(HAIR_PARTS, at)} fill={HAIR} stroke={INK} strokeWidth={5 * k} />
      {STRAND_PARTS.map((parts, i) => (
        <path key={i} d={pathOf(parts, at)} fill="none" stroke={HAIR_DARK} strokeWidth={3.5 * k} />
      ))}
      <path d={pathOf(SHINE_PARTS, at)} fill="none" stroke={HAIR_LIGHT} strokeWidth={7 * k} opacity={0.75} />
      <path d={pathOf(CURL_PARTS, at)} fill="none" stroke={INK} strokeWidth={5 * k} />
    </g>
  );
}

/** A soft light on the skin from the top left, and shade towards the head's edge: the head looks round, not flat. */
export function SkinGradient({ id, head }: { id: string; head?: { x: number; y: number; r: number } }) {
  // Given the head, the gradient lies in picture units, so a patch of skin drawn in another svg (the story's happy
  // eyes, a layer of their own) matches the head under it.
  const place = head
    ? { gradientUnits: "userSpaceOnUse" as const, cx: head.x - 0.16 * head.r, cy: head.y - 0.24 * head.r, r: 1.36 * head.r }
    : { cx: "0.42", cy: "0.38", r: "0.68" };
  return (
    <radialGradient id={id} {...place}>
      <stop offset="0" stopColor={SKIN_LIGHT} />
      <stop offset="0.55" stopColor={SKIN} />
      <stop offset="1" stopColor={SKIN_SHADE} />
    </radialGradient>
  );
}

/** An ear beside the head, `side` -1 on the left; with the curve inside it. */
export function Ear({ x, y, r, side, k = 1, fill = SKIN }: { x: number; y: number; r: number; side: -1 | 1; k?: number; fill?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill} stroke={INK} strokeWidth={5 * k} />
      <path
        d={`M${x - side * r * 0.1} ${y - r * 0.5} Q${x + side * r * 0.55} ${y - r * 0.15} ${x} ${y + r * 0.45}`}
        fill="none"
        stroke={SKIN_SHADE}
        strokeWidth={5 * k}
        strokeLinecap="round"
      />
    </g>
  );
}

/** An eye's white with its outline, `rx` already narrowed where the head is turned; its lid (`EyeLid`) goes over the iris. */
export function EyeBall({ x, y, rx, ry, k = 1 }: { x: number; y: number; rx: number; ry: number; k?: number }) {
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#fff" stroke={INK} strokeWidth={4 * k} />;
}

/**
 * The eye's white less its outline, where the iris shows: the iris is clipped to it, so however it looks round it never
 * reaches past the eye (a small iris swimming free in a big white looked staring and creepy, user feedback, November 2026).
 */
export const eyeOpening = (rx: number, ry: number, k = 1) => ({ rx: rx - 2 * k, ry: ry - 2 * k });

/** The upper lid: a stronger line over the top, as drawn eyes with lashes have, lying over the top of the iris. */
export function EyeLid({ x, y, rx, ry, k = 1 }: { x: number; y: number; rx: number; ry: number; k?: number }) {
  return (
    <path
      d={`M${x - rx * 0.92} ${y - ry * 0.3} Q${x} ${y - ry * 1.34} ${x + rx * 0.92} ${y - ry * 0.3}`}
      fill="none"
      stroke={INK}
      strokeWidth={6 * k}
      strokeLinecap="round"
    />
  );
}

/** The girl's three lashes at the outer top of each eye, in head units from the eye's middle: from x, y to x, y. */
export const LASHES = [
  [12, -22, 18, -34],
  [19, -14, 30, -22],
  [22, -4, 34, -8],
];

/**
 * The iris with its pupil and two lights, round (x, y); `sx` narrows it where the head is turned. Big and warm, as a
 * child's eye in a picture book: a brown iris filling most of the eye with a soft dark brown rim and pupil (never the
 * ink's violet), a big light up on the outside and a small one below.
 */
export function Iris({ x, y, r, sx = 1 }: { x: number; y: number; r: number; sx?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r * sx} ry={r} fill={IRIS} stroke={IRIS_RIM} strokeWidth={r * 0.12} />
      <ellipse cx={x} cy={y + r * 0.08} rx={r * 0.5 * sx} ry={r * 0.5} fill={PUPIL} />
      <circle cx={x + r * 0.32 * sx} cy={y - r * 0.38} r={r * 0.3} fill="#fff" />
      <circle cx={x - r * 0.36 * sx} cy={y + r * 0.42} r={r * 0.13} fill="#fff" opacity={0.85} />
    </g>
  );
}

/** A small round nose, a little darker than the skin, with a light on top and its shadow under it. */
export function Nose({ x, y, r, sx = 1, k = 1 }: { x: number; y: number; r: number; sx?: number; k?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r * 1.3 * sx} ry={r} fill={SKIN_SHADE} />
      <ellipse cx={x - r * 0.35 * sx} cy={y - r * 0.35} rx={r * 0.45 * sx} ry={r * 0.3} fill="#fff" opacity={0.55} />
      <path
        d={`M${x - r * sx} ${y + r * 0.7} Q${x} ${y + r * 1.25} ${x + r * sx} ${y + r * 0.7}`}
        fill="none"
        stroke="#c98463"
        strokeWidth={3 * k}
        strokeLinecap="round"
      />
    </g>
  );
}

/** Where the face's parts sit on the head, in head units round its middle (y down): the story's child. */
export const FACE = {
  eyes: { x: 60, y: -29, rx: 22, ry: 26, iris: 17.5 },
  brows: { x: 60, y: -68 },
  nose: { y: 10, r: 9 },
  ears: { x: 165, y: 13, r: 26 },
  pigtails: { x: 187, y: -75, rx: 44, ry: 72 },
  bands: { x: 153, y: -97, r: 17 },
} as const;
