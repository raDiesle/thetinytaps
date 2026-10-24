import type { ReactNode } from "react";
import { Face, INK, SKIN, nth, side } from "../shared";
import { Drops, Hearts, Lids, Lines, Mouth, SleepFace, Sparkles, Zzz } from "./parts";

// The children and the teacher. Each drawing has its foot point at (0, 0) and is placed with
// ground(). The children are built from the same few parts (head with hair, arms on a
// shoulder pivot), so they share proportions; the looks make them different.

export const SKIN_LIGHT = "#ffdbac";
export const SKIN_DARK = "#a86b45";
export const SKIN_BROWN = "#c68642";

type HairStyle = "short" | "bob" | "pigtails" | "curly" | "bun";

interface Look {
  skin?: string;
  hair: string;
  style: HairStyle;
  /** Colour of the hair bands (pigtails) or the bun's scrunchie. */
  band?: string;
}

/** Hair on a head of radius r centred on (cx, cy). Pigtails and buns swing with the class `tail`. */
function Hair({ cx, cy, r, look, tail }: { cx: number; cy: number; r: number; look: Look; tail?: string }) {
  const { hair, style, band = "#ff6b6b" } = look;
  const cap = `M${cx - r} ${cy - 2} Q${cx - r - 3} ${cy - r - 8} ${cx} ${cy - r - 5} Q${cx + r + 3} ${cy - r - 8} ${cx + r} ${cy - 2} Q${cx + r * 0.5} ${cy - r * 0.6} ${cx + r * 0.1} ${cy - r * 0.42} Q${cx - r * 0.5} ${cy - r * 0.62} ${cx - r} ${cy - 2} Z`;
  if (style === "bob") {
    return (
      <path
        d={`M${cx - r - 5} ${cy + r * 0.4} Q${cx - r - 9} ${cy - r - 9} ${cx} ${cy - r - 6} Q${cx + r + 9} ${cy - r - 9} ${cx + r + 5} ${cy + r * 0.4} H${cx + r - 7} Q${cx + r - 2} ${cy - r * 0.45} ${cx + r * 0.2} ${cy - r * 0.5} Q${cx - r * 0.4} ${cy - r * 0.2} ${cx - r + 7} ${cy + r * 0.4} Z`}
        fill={hair}
      />
    );
  }
  if (style === "curly") {
    return (
      <g fill={hair}>
        {[195, 220, 245, 270, 295, 320, 345].map((a) => (
          <circle key={a} cx={cx + r * 0.92 * Math.cos((a * Math.PI) / 180)} cy={cy + r * 0.92 * Math.sin((a * Math.PI) / 180)} r={r * 0.3} />
        ))}
        <path d={cap} />
      </g>
    );
  }
  if (style === "pigtails") {
    return (
      <>
        {[-1, 1].map((s, i) => (
          <g key={s} className={tail} style={{ ...nth(i), ...side(s as 1 | -1), transformOrigin: `${cx + s * (r - 4)}px ${cy - r * 0.3}px` }}>
            <ellipse cx={cx + s * (r + 10)} cy={cy - r * 0.1} rx={r * 0.32} ry={r * 0.42} fill={hair} />
            <circle cx={cx + s * (r - 1)} cy={cy - r * 0.3} r={r * 0.15} fill={band} />
          </g>
        ))}
        <path d={cap} fill={hair} />
      </>
    );
  }
  if (style === "bun") {
    return (
      <>
        <g className={tail} style={{ transformOrigin: `${cx}px ${cy - r}px` }}>
          <circle cx={cx} cy={cy - r - 12} r={r * 0.42} fill={hair} />
          <rect x={cx - r * 0.3} y={cy - r - 1} width={r * 0.6} height={r * 0.14} rx={r * 0.07} fill={band} />
        </g>
        <path
          d={`M${cx - r - 2} ${cy + 6} Q${cx - r - 6} ${cy - r - 6} ${cx} ${cy - r - 4} Q${cx + r + 6} ${cy - r - 6} ${cx + r + 2} ${cy + 6} Q${cx + r * 0.7} ${cy - r * 0.5} ${cx} ${cy - r * 0.55} Q${cx - r * 0.7} ${cy - r * 0.5} ${cx - r - 2} ${cy + 6} Z`}
          fill={hair}
        />
      </>
    );
  }
  return <path d={cap} fill={hair} />;
}

/** A child's head on its neck; it tilts with the class `cls` (pivot at the chin). */
function Head({
  cx,
  cy,
  r = 44,
  look,
  cls,
  tail,
  children,
}: {
  cx: number;
  cy: number;
  r?: number;
  look: Look;
  cls?: string;
  tail?: string;
  children?: ReactNode;
}) {
  const skin = look.skin ?? SKIN;
  const size = r / 34;
  return (
    <g className={cls} style={{ transformOrigin: `${cx}px ${cy + r}px` }}>
      {look.style === "bob" && <path d={`M${cx - r - 5} ${cy + r * 0.4} V${cy - 4} H${cx + r + 5} V${cy + r * 0.4} Z`} fill={look.hair} />}
      <circle cx={cx - r} cy={cy + 4} r={r * 0.17} fill={skin} />
      <circle cx={cx + r} cy={cy + 4} r={r * 0.17} fill={skin} />
      <circle cx={cx} cy={cy} r={r} fill={skin} />
      <Face cx={cx} cy={cy + 4} size={size} />
      <Lids cx={cx} cy={cy + 4} size={size} fill={skin} />
      <Mouth cx={cx} cy={cy + 4} size={size} />
      <Hair cx={cx} cy={cy} r={r} look={look} tail={tail} />
      {children}
    </g>
  );
}

/**
 * An arm hanging from the shoulder (x, y), turned by `angle` degrees (0 = straight down,
 * negative = the hand goes to the right). `children` sit in the hand at (x, y + len + 4).
 */
function Arm({
  x,
  y,
  angle,
  colour,
  cls,
  i = 0,
  s,
  len = 72,
  w = 17,
  skin = SKIN,
  children,
}: {
  x: number;
  y: number;
  angle: number;
  colour: string;
  cls?: string;
  i?: number;
  s?: 1 | -1;
  len?: number;
  w?: number;
  skin?: string;
  children?: ReactNode;
}) {
  return (
    <g className={cls} style={{ ...nth(i), ...(s ? side(s) : {}), transformOrigin: `${x}px ${y}px` }}>
      <g transform={`rotate(${angle} ${x} ${y})`}>
        <path d={`M${x} ${y} V${y + len - 6}`} stroke={colour} strokeWidth={w} strokeLinecap="round" />
        {children}
        <circle cx={x} cy={y + len + 2} r={w * 0.58} fill={skin} />
      </g>
    </g>
  );
}

/** A standing child, feet at (0, 0); `left` and `right` are the arms on our left and right. */
function StandingKid({
  look,
  shirt,
  pants,
  cls,
  i,
  left,
  right,
}: {
  look: Look;
  shirt: string;
  pants: string;
  cls: string;
  i: number;
  left: number;
  right: number;
}) {
  const skin = look.skin ?? SKIN;
  return (
    <g className={`${cls}-body`} style={{ ...nth(i), transformOrigin: "0px 0px" }}>
      <ellipse cx="-15" cy="-7" rx="16" ry="8" fill="#e8590c" />
      <ellipse cx="15" cy="-7" rx="16" ry="8" fill="#e8590c" />
      <rect x="-22" y="-100" width="18" height="92" rx="8" fill={pants} />
      <rect x="4" y="-100" width="18" height="92" rx="8" fill={pants} />
      <rect x="-36" y="-198" width="72" height="110" rx="26" fill={shirt} />
      <path d="M-20 -194 Q0 -176 20 -194" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6" />
      <rect x="-8" y="-212" width="16" height="20" fill={skin} />
      <Arm x={-30} y={-184} angle={left} colour={shirt} skin={skin} cls={left > 90 ? `${cls}-wave` : `${cls}-arm`} i={i} s={-1} />
      <Arm x={30} y={-184} angle={right} colour={shirt} skin={skin} cls={right < -90 ? `${cls}-wave` : `${cls}-arm`} i={i} s={1} />
      <Head cx={0} cy={-250} look={look} cls={`${cls}-head`} tail={`${cls}-tail`} />
    </g>
  );
}

/** A child sitting cross-legged on the floor, feet at (0, 0). */
function SittingKid({
  look,
  shirt,
  pants,
  cls,
  arms,
  children,
}: {
  look: Look;
  shirt: string;
  pants: string;
  cls: string;
  arms: ReactNode;
  children?: ReactNode;
}) {
  const skin = look.skin ?? SKIN;
  return (
    <g className={`${cls}-body`} style={{ transformOrigin: "0px 0px" }}>
      <path d="M-58 -10 Q-60 -40 -20 -42 L20 -42 Q60 -40 58 -10 Q30 2 0 -8 Q-30 2 -58 -10 Z" fill={pants} />
      <ellipse cx="-36" cy="-10" rx="15" ry="9" fill="#fff" />
      <ellipse cx="36" cy="-10" rx="15" ry="9" fill="#fff" />
      <rect x="-34" y="-128" width="68" height="96" rx="24" fill={shirt} />
      <rect x="-8" y="-142" width="16" height="18" fill={skin} />
      {arms}
      <Head cx={0} cy={-178} r={42} look={look} cls={`${cls}-head`} tail={`${cls}-tail`} />
      {children}
    </g>
  );
}

// ---------- At the window ----------

const WINK_GIRL: Look = { hair: "#8d5a3b", style: "pigtails", band: "#ffd43b" };
const WINK_BOY: Look = { hair: "#2b2d42", style: "curly", skin: SKIN_DARK };

/** Two children on a step at the window; they wave goodbye to Papa outside, hop and call "Tschüss!". */
export function Winkekinder() {
  return (
    <>
      {/* The wooden step */}
      <path d="M-150 -56 L-134 -76 H134 L150 -56 Z" fill="#f3cf94" />
      <rect x="-150" y="-56" width="300" height="56" rx="6" fill="#e9b872" />
      <rect x="-150" y="-10" width="300" height="10" rx="4" fill="#d4a35a" />
      <path d="M0 -42 l6 12 h13 l-10 8 l4 13 l-13 -8 l-13 8 l4 -13 l-10 -8 h13 Z" fill="#fff" opacity="0.7" />
      <g transform="translate(-68 -62)">
        <StandingKid look={WINK_GIRL} shirt="#f783ac" pants="#4dabf7" cls="ki-wink" i={0} left={14} right={-150} />
      </g>
      <g transform="translate(68 -62)">
        <StandingKid look={WINK_BOY} shirt="#ffd43b" pants="#51cf66" cls="ki-wink" i={1} left={150} right={-14} />
      </g>
      <Hearts x={0} y={-400} count={2} spread={60} colour="#ff8787" />
    </>
  );
}

// ---------- The reading corner ----------

const TEACHER: Look = { hair: "#c0603a", style: "bun", band: "#7950f2", skin: SKIN_LIGHT };

/** The teacher on her chair, reading a picture book aloud; a page turns and she tells the story. */
export function Erzieherin() {
  const skin = TEACHER.skin;
  return (
    <>
      {/* Chair */}
      <rect x="-62" y="-262" width="124" height="22" rx="8" fill="#ff922b" />
      <path d="M-50 -246 V-130 M50 -246 V-130" stroke="#ff922b" strokeWidth="12" strokeLinecap="round" />
      <path d="M-58 -120 L-60 0 M58 -120 L60 0" stroke="#e8590c" strokeWidth="12" strokeLinecap="round" />
      <path d="M-68 -132 H68 L62 -114 H-62 Z" fill="#ffa94d" />
      <g className="ki-erz-body" style={{ transformOrigin: "0px -120px" }}>
        {/* Knees and legs */}
        <rect x="-50" y="-150" width="100" height="40" rx="18" fill="#5c7cfa" />
        <rect x="-46" y="-118" width="30" height="104" rx="13" fill="#5c7cfa" />
        <rect x="16" y="-118" width="30" height="104" rx="13" fill="#5c7cfa" />
        <ellipse cx="-34" cy="-12" rx="22" ry="11" fill="#7048e8" />
        <ellipse cx="34" cy="-12" rx="22" ry="11" fill="#7048e8" />
        {/* Body */}
        <rect x="-50" y="-282" width="100" height="160" rx="32" fill="#38d9a9" />
        <path d="M-26 -278 Q0 -252 26 -278" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6" />
        <rect x="-10" y="-298" width="20" height="22" fill={skin} />
        <g className="ki-erz-head" style={{ transformOrigin: "0px -290px" }}>
          <circle cx="-46" cy="-326" r="8" fill={skin} />
          <circle cx="46" cy="-326" r="8" fill={skin} />
          <circle cx="0" cy="-330" r="46" fill={skin} />
          <Face cx={0} cy={-326} size={1.35} />
          <Lids cx={0} cy={-326} size={1.35} fill={skin} />
          <Mouth cx={0} cy={-326} size={1.35} />
          {/* Round glasses */}
          <g fill="#fff" fillOpacity="0.25" stroke="#7048e8" strokeWidth="3">
            <circle cx="-14" cy="-326" r="13" />
            <circle cx="14" cy="-326" r="13" />
          </g>
          <path d="M-2 -327 H2" stroke="#7048e8" strokeWidth="3" />
          <Hair cx={0} cy={-330} r={46} look={TEACHER} tail="ki-erz-bun" />
        </g>
        {/* Arms holding the book */}
        <path d="M-44 -262 Q-82 -220 -72 -176" stroke="#38d9a9" strokeWidth="20" strokeLinecap="round" fill="none" />
        <path d="M44 -262 Q82 -220 72 -176" stroke="#38d9a9" strokeWidth="20" strokeLinecap="round" fill="none" />
        {/* The book: cover, the left page with the sun, the frog under the page that turns */}
        <rect x="-82" y="-244" width="164" height="94" rx="6" fill="#ff6b6b" />
        <path d="M-76 -238 Q-38 -246 0 -236 V-156 Q-38 -166 -76 -158 Z" fill="#fff" />
        <circle cx="-38" cy="-202" r="16" fill="#ffd43b" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <path key={a} d="M-38 -226 V-232" stroke="#fab005" strokeWidth="4" strokeLinecap="round" transform={`rotate(${a} -38 -202)`} />
        ))}
        <path d="M0 -236 Q38 -246 76 -238 V-158 Q38 -166 0 -156 Z" fill="#fff" />
        <g className="ki-erz-frog">
          <ellipse cx="38" cy="-190" rx="22" ry="16" fill="#51cf66" />
          <circle cx="28" cy="-208" r="8" fill="#51cf66" />
          <circle cx="48" cy="-208" r="8" fill="#51cf66" />
          <circle cx="28" cy="-208" r="3.5" fill={INK} />
          <circle cx="48" cy="-208" r="3.5" fill={INK} />
          <path d="M28 -186 Q38 -178 48 -186" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
        <g className="ki-erz-page" style={{ transformOrigin: "0px -196px" }}>
          <path d="M0 -236 Q38 -246 76 -238 V-158 Q38 -166 0 -156 Z" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
          <g className="ki-erz-duck">
            <ellipse cx="40" cy="-186" rx="20" ry="13" fill="#ffd43b" />
            <circle cx="28" cy="-206" r="11" fill="#ffd43b" />
            <path d="M18 -206 L8 -203 L18 -200 Z" fill="#ff922b" />
            <circle cx="26" cy="-209" r="2.5" fill={INK} />
            <path d="M52 -194 L62 -200 L58 -186 Z" fill="#fcc419" />
          </g>
        </g>
        <path d="M0 -236 V-156" stroke="#e9ecef" strokeWidth="3" />
        <circle cx="-72" cy="-172" r="12" fill={skin} />
        <circle cx="72" cy="-172" r="12" fill={skin} />
      </g>
      <Sparkles x={0} y={-272} spread={70} />
    </>
  );
}

const GIRL: Look = { hair: "#3d2c2c", style: "bob", skin: SKIN_BROWN };
const BOY: Look = { hair: "#e9b872", style: "short" };

/** A girl listening on the rug; she laughs and claps her hands. */
export function Maedchen() {
  const skin = GIRL.skin;
  return (
    <>
      <SittingKid
        look={GIRL}
        shirt="#ff922b"
        pants="#845ef7"
        cls="ki-maed"
        arms={
          <>
            <Arm x={-28} y={-116} angle={14} colour="#ff922b" skin={skin} cls="ki-maed-arm" s={-1} len={66} w={15} />
            <Arm x={28} y={-116} angle={-14} colour="#ff922b" skin={skin} cls="ki-maed-arm" s={1} len={66} w={15} />
          </>
        }
      />
      <Lines x={58} y={-90} colour="#ff922b" />
      <Lines x={-58} y={-90} dir={-1} colour="#ff922b" />
    </>
  );
}

/** A boy listening on the rug with his teddy; he hugs it tight and hearts fly up. */
export function Junge() {
  return (
    <>
      <SittingKid
        look={BOY}
        shirt="#4dabf7"
        pants="#868e96"
        cls="ki-junge"
        arms={
          <>
            <path d="M-34 -100 H34 M-34 -76 H34" stroke="#fff" strokeWidth="6" opacity="0.5" />
            {/* The teddy in his lap */}
            <g className="ki-junge-teddy" style={{ transformOrigin: "0px -24px" }}>
              <circle cx="-22" cy="-24" r="10" fill="#a0662f" />
              <circle cx="22" cy="-24" r="10" fill="#a0662f" />
              <ellipse cx="0" cy="-50" rx="26" ry="28" fill="#c88b3a" />
              <ellipse cx="0" cy="-44" rx="14" ry="15" fill="#e9b872" />
              <g className="ki-junge-ear" style={{ transformOrigin: "-17px -96px" }}>
                <circle cx="-19" cy="-100" r="10" fill="#c88b3a" />
              </g>
              <circle cx="19" cy="-100" r="10" fill="#c88b3a" />
              <circle cx="0" cy="-86" r="22" fill="#c88b3a" />
              <ellipse cx="0" cy="-80" rx="10" ry="7" fill="#e9b872" />
              <circle cx="0" cy="-83" r="3" fill={INK} />
              <circle cx="-8" cy="-92" r="2.6" fill={INK} />
              <circle cx="8" cy="-92" r="2.6" fill={INK} />
            </g>
            <Arm x={-28} y={-116} angle={-22} colour="#4dabf7" cls="ki-junge-arm" s={-1} len={62} w={15} />
            <Arm x={28} y={-116} angle={22} colour="#4dabf7" cls="ki-junge-arm" s={1} len={62} w={15} />
          </>
        }
      />
      <Hearts x={10} y={-250} count={3} spread={34} />
    </>
  );
}

// ---------- The building corner ----------

const BUILDER: Look = { hair: "#2b2d42", style: "short", skin: SKIN_DARK };

/** A block for the builder's hands, centred on (x, y). */
function HandBlock({ x, y, colour }: { x: number; y: number; colour: string }) {
  return (
    <>
      <rect x={x - 17} y={y - 17} width="34" height="34" rx="4" fill={colour} />
      <rect x={x - 12} y={y - 12} width="10" height="10" rx="2" fill="#fff" opacity="0.45" />
    </>
  );
}

/** A child kneeling on the building rug; it knocks two blocks together and lifts one up high. */
export function Baukind() {
  const skin = BUILDER.skin;
  return (
    <>
      <g className="ki-bau-body" style={{ transformOrigin: "0px 0px" }}>
        <ellipse cx="18" cy="-14" rx="52" ry="15" fill="#1c7ed6" />
        <ellipse cx="62" cy="-12" rx="14" ry="9" fill="#e8590c" />
        <rect x="-30" y="-90" width="60" height="80" rx="20" fill="#1c7ed6" />
        <rect x="-36" y="-182" width="72" height="104" rx="26" fill="#51cf66" />
        <path d="M-36 -150 H36 M-36 -126 H36" stroke="#2f9e44" strokeWidth="5" opacity="0.5" />
        <rect x="-8" y="-196" width="16" height="18" fill={skin} />
        <Arm x={-30} y={-168} angle={64} colour="#51cf66" skin={skin} cls="ki-bau-arm" s={-1} len={66}>
          <HandBlock x={-30} y={-90} colour="#ff6b6b" />
        </Arm>
        <Arm x={30} y={-168} angle={-64} colour="#51cf66" skin={skin} cls="ki-bau-arm" s={1} len={66}>
          <HandBlock x={30} y={-90} colour="#4dabf7" />
        </Arm>
        <Head cx={0} cy={-232} r={42} look={BUILDER} cls="ki-bau-head" />
      </g>
      <Lines x={0} y={-150} colour="#495057" size={0.9} />
    </>
  );
}

// ---------- At the lunch table (their legs are hidden behind the table) ----------

const EATER: Look = { hair: "#d9480f", style: "pigtails", band: "#51cf66", skin: SKIN_LIGHT };
const DRINKER: Look = { hair: "#3d2c2c", style: "short", skin: SKIN_BROWN };

/** A child's chair behind the table. */
function KidChair({ colour }: { colour: string }) {
  return (
    <>
      <rect x="-56" y="-262" width="112" height="140" rx="18" fill={colour} />
      <rect x="-44" y="-250" width="88" height="10" rx="5" fill="#fff" opacity="0.35" />
    </>
  );
}

/** A child eating noodles with a fork; the noodle is slurped up, mmh! */
export function KindNudeln() {
  const skin = EATER.skin;
  return (
    <>
      <KidChair colour="#74c0fc" />
      <g className="ki-nudel-body" style={{ transformOrigin: "0px -120px" }}>
        <rect x="-38" y="-232" width="76" height="130" rx="26" fill="#fab005" />
        {/* Bib with a little duck */}
        <path d="M-24 -228 H24 V-156 Q0 -140 -24 -156 Z" fill="#fff" />
        <circle cx="0" cy="-184" r="9" fill="#ffd43b" />
        <path d="M8 -186 L14 -184 L8 -182 Z" fill="#ff922b" />
        <rect x="-8" y="-246" width="16" height="18" fill={skin} />
        <Arm x={-30} y={-218} angle={10} colour="#fab005" skin={skin} len={64} />
        <Head cx={0} cy={-288} look={EATER} cls="ki-nudel-head" tail="ki-nudel-tail" />
        <Arm x={30} y={-218} angle={-6} colour="#fab005" skin={skin} cls="ki-nudel-arm" len={64}>
          {/* The fork with a noodle dangling from it */}
          <path
            d="M30 -150 V-196 M24 -196 V-210 M30 -196 V-212 M36 -196 V-210 M23 -196 H37"
            stroke="#adb5bd"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <g className="ki-nudel-strand" style={{ transformOrigin: "30px -200px" }}>
            <path d="M30 -200 Q42 -186 32 -172 Q22 -158 34 -146" stroke="#ffe066" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>
        </Arm>
      </g>
    </>
  );
}

/** A child drinking juice through a straw; bubbles blub up in the cup. */
export function KindBecher() {
  const skin = DRINKER.skin;
  return (
    <>
      <KidChair colour="#ff8787" />
      <g className="ki-becher-body" style={{ transformOrigin: "0px -120px" }}>
        <rect x="-38" y="-232" width="76" height="130" rx="26" fill="#20c997" />
        <path d="M-38 -196 H38 M-38 -168 H38" stroke="#fff" strokeWidth="6" opacity="0.4" />
        <rect x="-8" y="-246" width="16" height="18" fill={skin} />
        <Head cx={0} cy={-288} look={DRINKER} cls="ki-becher-head">
          <g className="ki-becher-cheeks">
            <circle cx="-17" cy="-271" r="9" fill={skin} />
            <circle cx="17" cy="-271" r="9" fill={skin} />
          </g>
        </Head>
        {/* The cup, held with both hands, and the straw */}
        <g className="ki-becher-cup" style={{ transformOrigin: "0px -170px" }}>
          <path d="M6 -200 L14 -256" stroke="#ff6b6b" strokeWidth="5" strokeLinecap="round" />
          <path d="M-24 -206 H24 L20 -156 Q19 -150 13 -150 H-13 Q-19 -150 -20 -156 Z" fill="#e7f5ff" fillOpacity="0.9" stroke="#a5d8ff" strokeWidth="3" />
          <path d="M-21 -190 H21 L19 -156 Q18 -153 13 -153 H-13 Q-18 -153 -19 -156 Z" fill="#ffa94d" />
          <g className="ki-becher-bubbles" fill="#fff" stroke="#ffa94d" strokeWidth="2">
            {[-10, 0, 10].map((x, i) => (
              <circle key={x} cx={x} cy={-194} r={4 + (i % 2) * 2} style={nth(i)} />
            ))}
          </g>
          <path d="M-44 -220 Q-50 -186 -26 -176" stroke="#20c997" strokeWidth="16" strokeLinecap="round" fill="none" />
          <path d="M44 -220 Q50 -186 26 -176" stroke="#20c997" strokeWidth="16" strokeLinecap="round" fill="none" />
          <circle cx="-24" cy="-176" r="10" fill={skin} />
          <circle cx="24" cy="-176" r="10" fill={skin} />
        </g>
      </g>
      <Drops x={0} y={-238} count={3} spread={22} colour="#ffa94d" size={0.9} />
    </>
  );
}

// ---------- The sleeping corner ----------

/** A sleeping mat seen from the front; its front edge stands on (0, 0). */
function Mat({ top, edge }: { top: string; edge: string }) {
  return (
    <>
      <path d="M-190 -14 L-168 -86 H168 L190 -14 Z" fill={top} />
      <rect x="-190" y="-16" width="380" height="16" rx="6" fill={edge} />
      <path d="M-150 -76 H150" stroke="#fff" strokeWidth="4" strokeDasharray="10 12" strokeLinecap="round" opacity="0.5" />
    </>
  );
}

const SLEEPER: Look = { hair: "#8d5a3b", style: "short" };

/** A child asleep on its mat under a blanket with moons; it breathes, smiles and dreams of a star. */
export function Schlafkind() {
  return (
    <>
      <Mat top="#a5d8ff" edge="#4dabf7" />
      <ellipse cx="-124" cy="-60" rx="48" ry="21" fill="#fff" />
      <ellipse cx="-124" cy="-66" rx="38" ry="12" fill="#f1f3f5" />
      <g className="ki-schlaf-head" style={{ transformOrigin: "-118px -46px" }}>
        <circle cx="-118" cy="-78" r="32" fill={SKIN} />
        <SleepFace cx={-118} cy={-76} size={1} />
        <Hair cx={-118} cy={-78} r={32} look={SLEEPER} />
      </g>
      {/* Toes peeking out at the end */}
      <g className="ki-schlaf-toes" style={{ transformOrigin: "176px -30px" }}>
        <circle cx="178" cy="-40" r="9" fill={SKIN} />
        <circle cx="182" cy="-26" r="8" fill={SKIN} />
      </g>
      <g className="ki-schlaf-blanket" style={{ transformOrigin: "40px -20px" }}>
        <path d="M-92 -30 Q-88 -100 -18 -98 Q70 -104 128 -88 Q176 -76 176 -36 Q176 -20 154 -20 H-76 Q-92 -20 -92 -30 Z" fill="#ffd43b" />
        <path d="M-84 -60 Q-20 -76 60 -66" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.45" />
        {[
          [-30, -52],
          [40, -44],
          [110, -56],
        ].map(([x, y]) => (
          <path key={x} d={`M${x} ${y - 10} A10 10 0 1 0 ${x} ${y + 10} A7 7 0 1 1 ${x} ${y - 10} Z`} fill="#fab005" />
        ))}
      </g>
      {/* The dream: a little cloud with a star */}
      <g className="ki-schlaf-dream" style={{ transformOrigin: "-40px -150px" }}>
        <circle cx="-74" cy="-120" r="6" fill="#fff" />
        <circle cx="-58" cy="-136" r="9" fill="#fff" />
        <ellipse cx="-14" cy="-170" rx="40" ry="26" fill="#fff" />
        <path d="M-14 -186 l5 10 h11 l-9 7 l3 11 l-10 -6 l-10 6 l3 -11 l-9 -7 h11 Z" fill="#fcc419" />
      </g>
      <Zzz x={-70} y={-120} />
    </>
  );
}

const WAKER: Look = { hair: "#f59f00", style: "short", skin: SKIN_LIGHT };

/** A child who has just woken up on its mat; it stretches both arms up and yawns, uaaah! */
export function Aufwachkind() {
  const skin = WAKER.skin;
  return (
    <>
      <Mat top="#b2f2bb" edge="#51cf66" />
      <ellipse cx="-130" cy="-60" rx="46" ry="20" fill="#fff" />
      <g className="ki-wach-body" style={{ transformOrigin: "-60px -50px" }}>
        <rect x="-96" y="-170" width="72" height="116" rx="26" fill="#748ffc" />
        {[
          [-80, -140],
          [-44, -118],
          [-74, -92],
        ].map(([x, y]) => (
          <path key={x} d={`M${x} ${y - 6} l2 4 h5 l-4 3 l1.6 5 l-4.6 -3 l-4.6 3 l1.6 -5 l-4 -3 h5 Z`} fill="#fff" opacity="0.8" />
        ))}
        <rect x="-68" y="-184" width="16" height="18" fill={skin} />
        <Arm x={-90} y={-156} angle={22} colour="#748ffc" skin={skin} cls="ki-wach-arm" s={-1} len={64} w={16} />
        <Arm x={-30} y={-156} angle={-22} colour="#748ffc" skin={skin} cls="ki-wach-arm" s={1} len={64} w={16} />
        <Head cx={-60} cy={-222} r={40} look={WAKER} cls="ki-wach-head">
          <g className="ki-wach-tuft" style={{ transformOrigin: "-58px -262px" }}>
            <path d="M-62 -262 Q-70 -286 -54 -290 Q-60 -278 -52 -264 Z" fill="#f59f00" />
          </g>
          <g className="ki-wach-yawn">
            <ellipse cx="-60" cy="-202" rx="9" ry="11" fill="#9c2c3a" />
            <ellipse cx="-60" cy="-197" rx="5" ry="4" fill="#ff8fa3" />
          </g>
        </Head>
      </g>
      {/* Blanket over the legs */}
      <path d="M-104 -40 Q-110 -84 -40 -84 Q60 -90 140 -76 Q178 -68 176 -36 Q176 -20 154 -20 H-86 Q-104 -20 -104 -40 Z" fill="#ffc9c9" />
      {[
        [-40, -56],
        [30, -64],
        [100, -50],
        [140, -36],
        [-70, -34],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="6" fill="#ff8787" />
      ))}
      <Sparkles x={-60} y={-290} spread={58} colour="#ffd43b" />
    </>
  );
}
