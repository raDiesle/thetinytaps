// The animal children (and the teacher) of the feelings game: one drawing,
// different ears and colours. Poses are CSS classes on a wrapper (see
// feelings.css), the face is drawn from a few numbers so it can change bit by bit.

export type Species = "bear" | "fox" | "bunny" | "mouse";

export type Mood = "happy" | "joy" | "neutral" | "sad" | "angry" | "scared" | "surprised" | "sorry" | "sleepy" | "asleep";

export interface Face {
  /** -1 a deep frown … 1 a big smile. */
  smile: number;
  /** -1 sad (inner ends up) … 1 angry (inner ends down). */
  brows: number;
  eyes: "open" | "wide" | "sleepy" | "closed" | "smile";
  tears: boolean;
  /** An open mouth instead of the smile line. */
  mouth?: "o" | "yawn";
  /** 0 … 1: how red the face is with anger. */
  red: number;
}

export const MOODS: Record<Mood, Face> = {
  happy: { smile: 0.8, brows: 0, eyes: "open", tears: false, red: 0 },
  joy: { smile: 1, brows: 0, eyes: "smile", tears: false, red: 0 },
  neutral: { smile: 0.25, brows: 0, eyes: "open", tears: false, red: 0 },
  sad: { smile: -0.9, brows: -1, eyes: "open", tears: true, red: 0 },
  angry: { smile: -0.7, brows: 1, eyes: "open", tears: false, red: 1 },
  scared: { smile: -0.5, brows: -0.8, eyes: "wide", tears: false, red: 0 },
  surprised: { smile: 0, brows: -0.4, eyes: "wide", tears: false, mouth: "o", red: 0 },
  sorry: { smile: -0.35, brows: -0.7, eyes: "open", tears: false, red: 0 },
  sleepy: { smile: 0, brows: -0.2, eyes: "sleepy", tears: false, mouth: "yawn", red: 0 },
  asleep: { smile: 0.6, brows: 0, eyes: "closed", tears: false, red: 0 },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A face part way from `from` to `to` (t from 0 to 1): the numbers glide, the rest switches over on the way. */
export function blendFace(from: Face, to: Face, t: number): Face {
  if (t <= 0) return from;
  if (t >= 1) return to;
  return {
    smile: lerp(from.smile, to.smile, t),
    brows: lerp(from.brows, to.brows, t),
    red: lerp(from.red, to.red, t),
    tears: from.tears && t < 0.5,
    eyes: t < 0.9 ? from.eyes : to.eyes,
    mouth: t < 0.3 ? from.mouth : to.mouth,
  };
}

interface Look {
  fur: string;
  light: string;
  inner: string;
  shirt: string;
  pants: string;
}

const LOOKS: Record<Species, Look> = {
  bear: { fur: "#b5794b", light: "#ecc9a2", inner: "#ecc9a2", shirt: "#4cc9f0", pants: "#5a4fcf" },
  fox: { fur: "#f08a3c", light: "#fff3e6", inner: "#2a1e5c", shirt: "#3ddc97", pants: "#ff6b6b" },
  bunny: { fur: "#e9e4f2", light: "#ffffff", inner: "#ffb3c7", shirt: "#ffd23f", pants: "#4cc9f0" },
  mouse: { fur: "#b8b3c9", light: "#efe9f5", inner: "#ffb3c7", shirt: "#b388ff", pants: "#5a4fcf" },
};

function Ears({ species, look }: { species: Species; look: Look }) {
  switch (species) {
    case "bear":
      return (
        <g>
          <circle className="o" cx="27" cy="22" r="10" fill={look.fur} />
          <circle cx="27" cy="22" r="5" fill={look.inner} />
          <circle className="o" cx="73" cy="22" r="10" fill={look.fur} />
          <circle cx="73" cy="22" r="5" fill={look.inner} />
        </g>
      );
    case "fox":
      return (
        <g>
          <path className="o" d="M24 34 L20 2 L46 20 Z" fill={look.fur} />
          <path d="M27 27 L25 10 L39 20 Z" fill={look.inner} />
          <path className="o" d="M76 34 L80 2 L54 20 Z" fill={look.fur} />
          <path d="M73 27 L75 10 L61 20 Z" fill={look.inner} />
        </g>
      );
    case "bunny":
      return (
        <g>
          <ellipse className="o" cx="38" cy="2" rx="8" ry="21" fill={look.fur} transform="rotate(-10 38 2)" />
          <ellipse cx="38" cy="3" rx="4" ry="15" fill={look.inner} transform="rotate(-10 38 2)" />
          <ellipse className="o" cx="62" cy="2" rx="8" ry="21" fill={look.fur} transform="rotate(10 62 2)" />
          <ellipse cx="62" cy="3" rx="4" ry="15" fill={look.inner} transform="rotate(10 62 2)" />
        </g>
      );
    case "mouse":
      return (
        <g>
          <circle className="o" cx="21" cy="24" r="16" fill={look.fur} />
          <circle cx="21" cy="24" r="10" fill={look.inner} />
          <circle className="o" cx="79" cy="24" r="16" fill={look.fur} />
          <circle cx="79" cy="24" r="10" fill={look.inner} />
        </g>
      );
  }
}

function Eye({ x, eyes }: { x: number; eyes: Face["eyes"] }) {
  switch (eyes) {
    case "wide":
      return (
        <g>
          <circle cx={x} cy="44" r="6.5" fill="#fff" stroke="#2a1e5c" strokeWidth="1.8" />
          <circle cx={x} cy="45" r="3.4" fill="#2a1e5c" />
        </g>
      );
    case "sleepy":
      return <path d={`M${x - 5} 44 Q${x} 47 ${x + 5} 44`} className="fg-line" />;
    case "closed":
      return <path d={`M${x - 5} 43 Q${x} 48 ${x + 5} 43`} className="fg-line" />;
    case "smile":
      return <path d={`M${x - 5} 46 Q${x} 39 ${x + 5} 46`} className="fg-line" />;
    default:
      return (
        <g>
          <circle cx={x} cy="44" r="4.4" fill="#2a1e5c" />
          <circle cx={x + 1.4} cy="42.6" r="1.4" fill="#fff" />
        </g>
      );
  }
}

function FaceParts({ face }: { face: Face }) {
  const b = face.brows;
  // Inner ends of the brows go up when sad, down when angry.
  const outer = 34 - 2 * b;
  const inner = 34 + 2.6 * b;
  const s = face.smile;
  return (
    <g className="c-face">
      <path d={`M33 ${outer} L44 ${inner}`} className="fg-line" />
      <path d={`M67 ${outer} L56 ${inner}`} className="fg-line" />
      <Eye x={39} eyes={face.eyes} />
      <Eye x={61} eyes={face.eyes} />
      <circle cx="30" cy="55" r="4.5" fill="#ff8fa3" opacity="0.55" />
      <circle cx="70" cy="55" r="4.5" fill="#ff8fa3" opacity="0.55" />
      <ellipse cx="50" cy="52.5" rx="4.6" ry="3.3" fill="#2a1e5c" />
      {face.mouth === "o" && <ellipse cx="50" cy="62" rx="3.4" ry="4" fill="#2a1e5c" />}
      {face.mouth === "yawn" && <ellipse cx="50" cy="63" rx="5" ry="6.5" fill="#2a1e5c" />}
      {!face.mouth && <path d={`M42 ${61 - s * 2} Q50 ${61 + s * 9} 58 ${61 - s * 2}`} className="fg-line" />}
      {face.tears && (
        <g className="c-tears">
          <path d="M37 50 q-3.5 6 0 8.5 q3.5 -2.5 0 -8.5z" fill="#59c3ff" />
          <path d="M63 50 q-3.5 6 0 8.5 q3.5 -2.5 0 -8.5z" fill="#59c3ff" />
        </g>
      )}
    </g>
  );
}

/** One animal child; `teacher` adds glasses and an apron. */
export function Critter({ species, face, teacher = false }: { species: Species; face: Face; teacher?: boolean }) {
  const look = LOOKS[species];
  return (
    <svg className="fg-critter" viewBox="0 -18 100 148" aria-hidden>
      <g className="c-leg c-leg-l">
        <rect className="o" x="36" y="104" width="12" height="22" rx="6" fill={look.pants} />
      </g>
      <g className="c-leg c-leg-r">
        <rect className="o" x="52" y="104" width="12" height="22" rx="6" fill={look.pants} />
      </g>
      <g className="c-body">
        <ellipse className="o" cx="50" cy="92" rx="25" ry="21" fill={look.shirt} />
        {teacher && <path className="o" d="M36 84 H64 V104 Q50 112 36 104 Z" fill="#fff" />}
      </g>
      <g className="c-arm c-arm-l">
        <rect className="o" x="18" y="78" width="11" height="26" rx="5.5" fill={look.fur} />
        <circle className="o" cx="23.5" cy="103" r="6" fill={look.light} />
      </g>
      <g className="c-arm c-arm-r">
        <rect className="o" x="71" y="78" width="11" height="26" rx="5.5" fill={look.fur} />
        <circle className="o" cx="76.5" cy="103" r="6" fill={look.light} />
      </g>
      <g className="c-head">
        <Ears species={species} look={look} />
        <circle className="o" cx="50" cy="46" r="30" fill={look.fur} />
        <ellipse cx="50" cy="58" rx="15" ry="11" fill={look.light} />
        <circle cx="50" cy="46" r="30" fill="#ff3b3b" opacity={face.red * 0.3} />
        <FaceParts face={face} />
        {teacher && (
          <g fill="none" stroke="#2a1e5c" strokeWidth="1.8">
            <circle cx="39" cy="44" r="8" />
            <circle cx="61" cy="44" r="8" />
            <path d="M47 44 H53" />
          </g>
        )}
      </g>
    </svg>
  );
}
