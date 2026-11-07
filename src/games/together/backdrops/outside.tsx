import type { ReactNode } from "react";
import type { BackdropId } from "./index";

// The backdrops outside (see index.ts for what each shows and how they are drawn). Small shared parts (a cloud, a
// tree, a fir, a fence, a flower) are drawn in their own little coordinates and placed with `translate … scale`, their
// line widened against the scale, so every backdrop keeps the same line.

const OUT = "#5a4636";

/** The outline every shape shares, `w` wide in the box's units however the shape is scaled by `s`. */
const line = (w = 3, s = 1) => ({ stroke: OUT, strokeWidth: w / s, strokeLinejoin: "round" as const, strokeLinecap: "round" as const });

/** Places a part drawn round 0, 0 at x, y, scaled by s. */
const at = (x: number, y: number, s = 1) => `translate(${x} ${y}) scale(${s})`;

/** The sky's colour on a fair day. */
const SKY = "#d4ecfb";
/** Grass, its shade and a darker green for blades. */
const GRASS = "#a9d68b";
const GRASS_FAR = "#c7e5ae";
const BLADE = "#7fb565";

/** A whole box of one colour. */
const Fill = ({ c }: { c: string }) => <rect width="300" height="200" fill={c} />;

/** Ground from y down to the bottom, its top edge gently waving by `wave`. */
function Ground({ y, c, wave = 4, w = 3 }: { y: number; c: string; wave?: number; w?: number }) {
  return <path d={`M-4 ${y} Q75 ${y - wave} 150 ${y} T304 ${y} V204 H-4 Z`} fill={c} {...line(w)} />;
}

/** A soft cloud, about 66 wide at s = 1. */
function Cloud({ x, y, s = 1, c = "#ffffff" }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={at(x, y, s)}>
      <path d="M-24 9 C-35 9 -35 -5 -24 -5 C-23 -17 -8 -19 -4 -9 C0 -22 20 -20 19 -6 C31 -8 34 9 23 9 Z" fill={c} {...line(2.5, s)} />
      <path d="M-22 6 H20" stroke="#000" strokeOpacity="0.06" strokeWidth={4 / s} strokeLinecap="round" />
    </g>
  );
}

/** The sun with short rays, r its radius. */
function Sun({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4 + 0.39;
    return `M${x + Math.cos(a) * (r + 5)} ${y + Math.sin(a) * (r + 5)} L${x + Math.cos(a) * (r + 11)} ${y + Math.sin(a) * (r + 11)}`;
  });
  return (
    <g>
      <path d={rays.join(" ")} stroke="#f2bf4f" strokeWidth="3" strokeLinecap="round" />
      <circle cx={x} cy={y} r={r} fill="#ffe08f" {...line(2.5)} />
      <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.3} fill="#fff3c4" />
    </g>
  );
}

/** A round leafy tree standing on x, y, about 84 wide and 100 tall at s = 1. */
function Tree({ x, y, s = 1, leaf = "#8cc76f", shade = "#76b15a", light = "#a8d78e", trunk = "#b98a5c" }: TreeProps) {
  return (
    <g transform={at(x, y, s)}>
      <path d="M-6 0 L-5 -44 H5 L6 0 Z" fill={trunk} {...line(3, s)} />
      <path d="M-30 -48 C-46 -56 -40 -84 -20 -84 C-16 -100 12 -102 20 -86 C40 -86 46 -60 32 -48 C26 -36 -22 -36 -30 -48 Z" fill={leaf} {...line(3, s)} />
      <path d="M-26 -46 C-10 -40 14 -40 28 -48 C36 -54 38 -62 36 -68 C30 -56 4 -48 -26 -46 Z" fill={shade} />
      <circle cx="-14" cy="-74" r="7" fill={light} />
      <circle cx="4" cy="-84" r="5" fill={light} />
    </g>
  );
}
type TreeProps = { x: number; y: number; s?: number; leaf?: string; shade?: string; light?: string; trunk?: string };

/** A fir standing on x, y, about 52 wide and 84 tall at s = 1, with snow on its branches if `snow`. */
function Fir({
  x,
  y,
  s = 1,
  c = "#7fb879",
  shade = "#6aa365",
  snow = false,
}: {
  x: number;
  y: number;
  s?: number;
  c?: string;
  shade?: string;
  snow?: boolean;
}) {
  return (
    <g transform={at(x, y, s)}>
      <path d="M-4 0 V-12 H4 V0 Z" fill="#a97e55" {...line(3, s)} />
      <path d="M0 -84 L14 -58 L8 -58 L21 -36 L13 -36 L26 -12 L-26 -12 L-13 -36 L-21 -36 L-8 -58 L-14 -58 Z" fill={c} {...line(3, s)} />
      <path d="M0 -80 L12 -58 L8 -58 L19 -37 L13 -37 L24 -14 L4 -14 Z" fill={shade} />
      {snow && (
        <g fill="#ffffff" {...line(2, s)}>
          <path d="M0 -84 L8 -69 Q4 -66 1 -69 Q-3 -65 -8 -69 Z" />
          <path d="M-14 -58 H14 L16 -55 Q8 -51 2 -55 Q-5 -51 -16 -55 Z" />
          <path d="M-21 -36 H21 L23 -33 Q12 -29 4 -33 Q-7 -29 -23 -33 Z" />
          <path d="M-26 -12 H26 L27 -9 Q14 -6 4 -9 Q-10 -6 -27 -9 Z" />
        </g>
      )}
    </g>
  );
}

/** A round bush on x, y (its bottom middle), about 56 wide at s = 1. */
function Bush({ x, y, s = 1, c = "#93ca74", shade = "#7db760" }: { x: number; y: number; s?: number; c?: string; shade?: string }) {
  return (
    <g transform={at(x, y, s)}>
      <path d="M-28 0 C-36 -10 -28 -26 -16 -24 C-12 -38 10 -38 14 -26 C28 -28 36 -10 28 0 Z" fill={c} {...line(3, s)} />
      <path d="M-24 -2 C-8 2 14 2 26 -3 C30 -8 30 -12 29 -14 C22 -6 0 -4 -24 -2 Z" fill={shade} />
    </g>
  );
}

/** A small flower on a stem at x, y (its foot), its petals in c. */
function Flower({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={at(x, y, s)}>
      <path d="M0 0 Q1 -5 0 -9" stroke={BLADE} strokeWidth="2" strokeLinecap="round" fill="none" />
      <g fill={c} {...line(1.2)}>
        <circle cx="0" cy="-14" r="2.8" />
        <circle cx="4.6" cy="-10.6" r="2.8" />
        <circle cx="2.8" cy="-5.6" r="2.8" />
        <circle cx="-2.8" cy="-5.6" r="2.8" />
        <circle cx="-4.6" cy="-10.6" r="2.8" />
      </g>
      <circle cx="0" cy="-9.5" r="2.4" fill="#ffd25e" {...line(1.2)} />
    </g>
  );
}

/** A tuft of grass blades at x, y. */
function Tuft({ x, y, c = BLADE }: { x: number; y: number; c?: string }) {
  return (
    <path
      d={`M${x - 5} ${y} Q${x - 5} ${y - 5} ${x - 8} ${y - 8} M${x} ${y} Q${x} ${y - 7} ${x + 1} ${y - 11} M${x + 5} ${y} Q${x + 5} ${y - 5} ${x + 8} ${y - 8}`}
      stroke={c}
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  );
}

/** A row of pointed wooden pickets from x0 to x1 (step 16), standing on y, h tall, with two rails behind them. */
function Pickets({ x0, x1, y, h, c = "#f4e4c6", rail = "#e2cba3" }: { x0: number; x1: number; y: number; h: number; c?: string; rail?: string }) {
  const xs: number[] = [];
  for (let x = x0; x <= x1 - 12; x += 16) xs.push(x);
  const end = xs[xs.length - 1] + 12;
  return (
    <g>
      <rect x={x0 - 2} y={y - h * 0.78} width={end - x0 + 2} height="6" fill={rail} {...line(2.5)} />
      <rect x={x0 - 2} y={y - h * 0.34} width={end - x0 + 2} height="6" fill={rail} {...line(2.5)} />
      {xs.map((x) => (
        <path key={x} d={`M${x} ${y} V${y - h + 6} L${x + 6} ${y - h} L${x + 12} ${y - h + 6} V${y} Z`} fill={c} {...line(2.5)} />
      ))}
    </g>
  );
}

/** A tiny bird far off, a soft m. */
const Bird = ({ x, y }: { x: number; y: number }) => <path d={`M${x} ${y} q4 -4 7 0 q3 -4 7 0`} fill="none" {...line(1.8)} />;

/** A little star with four points. */
const Star = ({ x, y, r = 4, c = "#fff1b0" }: { x: number; y: number; r?: number; c?: string }) => (
  <path
    d={`M${x} ${y - r} Q${x + r * 0.2} ${y - r * 0.2} ${x + r} ${y} Q${x + r * 0.2} ${y + r * 0.2} ${x} ${y + r} Q${x - r * 0.2} ${y + r * 0.2} ${x - r} ${y} Q${x - r * 0.2} ${y - r * 0.2} ${x} ${y - r} Z`}
    fill={c}
  />
);

/** A plain house front on x, y (bottom left), w × h, with a roof, a door and windows (lit ones glow when `lit`). */
function House({ x, y, w, h, wall, roof, lit }: { x: number; y: number; w: number; h: number; wall: string; roof: string; lit?: string }) {
  const win = lit ?? "#e3f1fb";
  const ww = Math.min(14, w * 0.24);
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={wall} {...line(2.5)} />
      <path d={`M${x - 5} ${y - h} L${x + w / 2} ${y - h - w * 0.45} L${x + w + 5} ${y - h} Z`} fill={roof} {...line(2.5)} />
      <rect x={x + w * 0.18} y={y - h * 0.8} width={ww} height={ww} rx="1.5" fill={win} {...line(2)} />
      <rect x={x + w * 0.82 - ww} y={y - h * 0.8} width={ww} height={ww} rx="1.5" fill={win} {...line(2)} />
      <rect x={x + w / 2 - 5} y={y - 18} width="10" height="18" rx="2" fill="#c99c70" {...line(2)} />
    </g>
  );
}

// ---------- The backdrops ----------

function garten() {
  return (
    <>
      <Fill c={SKY} />
      <Sun x={268} y={28} />
      <Cloud x={62} y={24} s={0.8} />
      <Cloud x={176} y={18} s={0.55} />
      <Tree x={38} y={124} s={0.8} />
      <Bush x={262} y={124} s={0.9} />
      <Ground y={140} c={GRASS} wave={2} />
      <path d="M128 140 L172 140 L230 204 L70 204 Z" fill="#ecdab5" {...line(2.5)} />
      <Pickets x0={-4} x1={108} y={148} h={38} />
      <Pickets x0={204} x1={316} y={148} h={38} />
      <path d="M-4 182 Q26 166 60 184 V204 H-4 Z" fill="#c09470" {...line(3)} />
      <Flower x={10} y={176} c="#f7a7b9" />
      <Flower x={26} y={172} c="#fff0a0" />
      <Flower x={42} y={177} c="#c8b5f2" />
      <path d="M240 184 Q274 166 304 182 V204 H240 Z" fill="#c09470" {...line(3)} />
      <Flower x={256} y={177} c="#ffffff" />
      <Flower x={272} y={172} c="#f7a7b9" />
      <Flower x={288} y={175} c="#fff0a0" />
    </>
  );
}

function wiese() {
  return (
    <>
      <Fill c={SKY} />
      <Sun x={270} y={28} />
      <Cloud x={70} y={30} s={0.9} />
      <Cloud x={196} y={22} s={0.6} />
      <Bird x={130} y={26} />
      <Bird x={146} y={20} />
      <path d="M-4 132 Q60 106 130 128 Q200 110 304 126 V204 H-4 Z" fill={GRASS_FAR} {...line(2.5)} />
      <Tree x={40} y={122} s={0.32} />
      <Tree x={58} y={124} s={0.26} />
      <path d="M-4 158 Q90 142 170 152 Q240 160 304 146 V204 H-4 Z" fill={GRASS} {...line(3)} />
      <Tree x={258} y={154} s={1.12} />
      {[
        [14, 182, "#f7a7b9"],
        [32, 172, "#fff0a0"],
        [52, 188, "#ffffff"],
        [72, 176, "#c8b5f2"],
        [226, 188, "#fff0a0"],
        [244, 176, "#f7a7b9"],
        [270, 190, "#c8b5f2"],
        [290, 176, "#ffffff"],
      ].map(([x, y, c]) => (
        <Flower key={`${x}`} x={x as number} y={y as number} c={c as string} />
      ))}
      <Tuft x={90} y={196} />
      <Tuft x={208} y={194} />
    </>
  );
}

/** The bumpy edge of far tree tops, from x 0 to 300 at height y. */
function treeline(y: number, bump: number, step: number) {
  let d = `M-4 ${y + 30} V${y}`;
  for (let x = -4; x < 304; x += step) d += ` Q${x + step / 2} ${y - bump * (x % (step * 2) === 0 ? 1 : 0.6)} ${x + step} ${y}`;
  return `${d} V${y + 30} Z`;
}

function wald() {
  return (
    <>
      <Fill c="#e0f0e2" />
      <Cloud x={150} y={20} s={0.5} />
      <path d={treeline(118, 18, 22)} fill="#c3dfb6" {...line(2.5)} />
      <Ground y={142} c="#b3d38f" wave={3} />
      <path d="M142 142 Q130 170 96 204 H214 Q172 170 158 142 Z" fill="#e3cfa3" {...line(2.5)} />
      <Fir x={20} y={162} s={1.6} />
      <Tree x={70} y={150} s={0.78} />
      <Tree x={236} y={150} s={0.78} />
      <Fir x={282} y={164} s={1.6} />
      <Fern x={44} y={186} />
      <Mushroom x={74} y={180} />
      <Fern x={256} y={190} flip />
      <Mushroom x={226} y={186} s={0.8} />
      <Tuft x={10} y={196} />
      <Tuft x={292} y={198} />
    </>
  );
}

/** A fern of three fronds at x, y, each a stem with rounded leaflets growing smaller towards its tip. */
function Fern({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
  const leaflets = [6, 5.4, 4.6, 3.8, 3, 2.2];
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      {[-46, -4, 40].map((r) => (
        <g key={r} transform={`rotate(${r}) scale(${r === -4 ? 1 : 0.82})`}>
          <path d="M0 0 V-36" stroke={OUT} strokeWidth="3.6" strokeLinecap="round" />
          {leaflets.map((l, i) => (
            <g key={l} fill="#8cc46e" {...line(1.4)}>
              <ellipse cx={l + 0.5} cy={-7 - i * 5} rx={l} ry="2.4" transform={`rotate(-22 ${l + 0.5} ${-7 - i * 5})`} />
              <ellipse cx={-l - 0.5} cy={-7 - i * 5} rx={l} ry="2.4" transform={`rotate(22 ${-l - 0.5} ${-7 - i * 5})`} />
            </g>
          ))}
          <path d="M0 -1 V-35" stroke="#6aa354" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

/** A small toadstool at x, y (its foot). */
function Mushroom({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={at(x, y, s)}>
      <path d="M-4 0 Q-5 -8 -3 -12 H3 Q5 -8 4 0 Z" fill="#fbf1dc" {...line(2, s)} />
      <path d="M-12 -11 Q-12 -24 0 -24 Q12 -24 12 -11 Z" fill="#ec8b7c" {...line(2.5, s)} />
      <circle cx="-5" cy="-17" r="2" fill="#fff" />
      <circle cx="4" cy="-19" r="1.6" fill="#fff" />
      <circle cx="6" cy="-14" r="1.4" fill="#fff" />
    </g>
  );
}

function strasse() {
  return (
    <>
      <Fill c={SKY} />
      <Cloud x={150} y={22} s={0.6} />
      <Cloud x={250} y={30} s={0.75} />
      <path
        d="M86 146 V128 L96 120 L106 128 V134 L118 126 L130 134 V122 H142 V130 L154 122 L166 130 V126 L178 118 L190 126 V136 L200 128 L214 136 V146 Z"
        fill="#dfe3ec"
        {...line(2.5)}
      />
      <House x={-6} y={146} w={50} h={66} wall="#f6d9b8" roof="#d98b75" />
      <House x={46} y={146} w={42} h={52} wall="#cfe3d1" roof="#8fa7c9" />
      <House x={212} y={146} w={44} h={56} wall="#f7e7a8" roof="#c98a6e" />
      <House x={258} y={146} w={48} h={70} wall="#e3d3ef" roof="#d98b75" />
      <rect x="-4" y="146" width="308" height="16" fill="#e7ddcf" {...line(2.5)} />
      <path d="M30 146 V162 M80 146 V162 M130 146 V162 M180 146 V162 M230 146 V162 M280 146 V162" stroke={OUT} strokeOpacity="0.35" strokeWidth="1.5" />
      <rect x="-4" y="162" width="308" height="44" fill="#b9bcc4" {...line(3)} />
      <path d="M8 184 H34 M66 184 H92 M208 184 H234 M266 184 H292" stroke="#f7f4ea" strokeWidth="4" strokeLinecap="round" />
      <path d="M290 158 V70" stroke={OUT} strokeWidth="7" strokeLinecap="round" />
      <path d="M290 158 V70" stroke="#7d8697" strokeWidth="3" strokeLinecap="round" />
      <path d="M290 72 Q290 62 280 62" fill="none" stroke={OUT} strokeWidth="5" strokeLinecap="round" />
      <path d="M290 72 Q290 62 280 62" fill="none" stroke="#7d8697" strokeWidth="2" strokeLinecap="round" />
      <path d="M272 62 H288 L285 70 H275 Z" fill="#fff3c4" {...line(2.5)} />
      <rect x="284" y="154" width="12" height="6" rx="1" fill="#7d8697" {...line(2)} />
    </>
  );
}

function spielplatz() {
  return (
    <>
      <Fill c={SKY} />
      <Sun x={150} y={22} r={11} />
      <Cloud x={70} y={26} s={0.7} />
      <Cloud x={232} y={20} s={0.6} />
      <Bush x={110} y={140} s={0.6} />
      <Bush x={196} y={140} s={0.5} />
      <Ground y={140} c={GRASS} wave={2} />
      <path d="M-4 160 Q60 150 150 154 Q240 150 304 158 V204 H-4 Z" fill="#f2deae" {...line(3)} />
      {/* the slide at the left: ladder, platform and chute */}
      <path d="M12 168 L26 74 M30 168 L42 74" stroke={OUT} strokeWidth="6" strokeLinecap="round" />
      <path d="M12 168 L26 74 M30 168 L42 74" stroke="#7fb3df" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 146 H32 M19 124 H35 M22 102 H38 M25 84 H40" stroke={OUT} strokeWidth="3" strokeLinecap="round" />
      <path d="M22 76 H46 V82 H22 Z" fill="#f4a36e" {...line(2.5)} />
      <path d="M44 74 Q58 76 66 112 Q74 150 96 162 L92 172 Q62 160 54 116 Q48 84 40 82 Z" fill="#f6c95f" {...line(3)} />
      <path d="M48 80 Q58 86 62 112 Q68 146 92 164" fill="none" stroke="#fbe3a2" strokeWidth="3" strokeLinecap="round" />
      {/* the swing frame at the right */}
      <path d="M216 166 L236 64 L256 166 M262 166 L282 64 L302 166" fill="none" stroke={OUT} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M216 166 L236 64 L256 166 M262 166 L282 64 L302 166" fill="none" stroke="#ea8b78" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M232 64 H288" stroke={OUT} strokeWidth="7" strokeLinecap="round" />
      <path d="M232 64 H288" stroke="#ea8b78" strokeWidth="3" strokeLinecap="round" />
      <path d="M252 66 V134 M272 66 V134" stroke={OUT} strokeWidth="1.8" />
      <rect x="248" y="133" width="28" height="6" rx="2" fill="#8cc0e6" {...line(2.5)} />
    </>
  );
}

function strand() {
  return (
    <>
      <Fill c="#d8eefb" />
      <Sun x={262} y={30} r={15} />
      <Cloud x={120} y={22} s={0.6} />
      <Bird x={170} y={38} />
      <Bird x={184} y={32} />
      <rect x="-4" y="112" width="308" height="44" fill="#9fd3ec" {...line(2.5)} />
      <path
        d="M20 124 q6 -4 12 0 M60 132 q6 -4 12 0 M226 122 q6 -4 12 0 M264 134 q6 -4 12 0 M110 120 q6 -4 12 0 M180 128 q6 -4 12 0"
        fill="none"
        stroke="#e8f6fc"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M-4 150 Q30 142 70 148 Q120 156 160 148 Q220 140 304 150 V204 H-4 Z" fill="#f4e2b6" {...line(3)} />
      <path d="M-4 152 Q30 144 70 150 Q120 158 160 150 Q220 142 304 152" fill="none" stroke="#ffffff" strokeWidth="3" strokeOpacity="0.8" />
      <path d="M-4 112 Q20 98 50 118 Q76 136 92 168 Q96 182 120 204 H-4 Z" fill="#ead3a0" {...line(3)} />
      <path
        d="M12 108 Q10 92 4 84 M18 108 Q20 90 26 82 M30 112 Q30 98 36 92 M40 116 Q36 104 30 98"
        fill="none"
        stroke="#8fbf6a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M226 182 q5 -3 10 0 M262 192 q5 -3 10 0 M280 172 q5 -3 10 0 M30 190 q5 -3 10 0"
        fill="none"
        stroke="#e2c88f"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </>
  );
}

/** Flakes of falling snow, standing still, more at the sides than in the middle. */
const FLAKES = [
  [12, 20],
  [38, 46],
  [20, 78],
  [56, 16],
  [70, 64],
  [48, 104],
  [84, 34],
  [8, 120],
  [112, 14],
  [190, 16],
  [214, 46],
  [236, 22],
  [260, 58],
  [288, 32],
  [274, 92],
  [248, 108],
  [296, 118],
  [228, 84],
  [150, 30],
  [134, 50],
  [176, 48],
];

function schnee() {
  return (
    <>
      <Fill c="#d7e5f2" />
      <path d="M-4 134 Q50 112 120 128 Q190 112 304 130 V204 H-4 Z" fill="#eef4fa" {...line(2.5)} />
      <Fir x={98} y={130} s={0.34} c="#9cc3a0" shade="#89b28d" snow />
      <Fir x={208} y={128} s={0.3} c="#9cc3a0" shade="#89b28d" snow />
      <Ground y={150} c="#fbfdff" wave={5} />
      <path d="M-4 168 Q40 160 80 170" fill="none" stroke="#dbe7f3" strokeWidth="4" strokeLinecap="round" />
      <path d="M220 172 Q260 162 304 168" fill="none" stroke="#dbe7f3" strokeWidth="4" strokeLinecap="round" />
      <Fir x={24} y={162} s={1.3} snow />
      <Fir x={66} y={156} s={0.8} snow />
      <Fir x={240} y={156} s={0.8} snow />
      <Fir x={280} y={164} s={1.3} snow />
      {FLAKES.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={x > 100 && x < 200 ? 1.8 : 2.4} fill="#ffffff" stroke="#b8cbe0" strokeWidth="0.8" />
      ))}
    </>
  );
}

/** Short slanted lines of rain, standing still, fewer in the middle. */
const DROPS = [
  [10, 52],
  [30, 74],
  [18, 100],
  [50, 60],
  [62, 92],
  [40, 124],
  [80, 70],
  [76, 112],
  [104, 54],
  [196, 56],
  [222, 70],
  [212, 104],
  [244, 52],
  [256, 90],
  [276, 66],
  [290, 100],
  [266, 124],
  [236, 128],
  [150, 50],
  [130, 66],
  [170, 70],
];

function regen() {
  return (
    <>
      <Fill c="#cfd8e0" />
      <path d={treeline(130, 10, 26)} fill="#b9cbbb" {...line(2.5)} />
      <Ground y={146} c="#a3c38e" wave={3} />
      <path d="M134 146 Q122 172 84 204 H216 Q178 172 166 146 Z" fill="#cdbfa4" {...line(2.5)} />
      <ellipse cx="128" cy="186" rx="16" ry="4.5" fill="#b5cfe3" {...line(2)} />
      <ellipse cx="178" cy="168" rx="11" ry="3.2" fill="#b5cfe3" {...line(2)} />
      <ellipse cx="34" cy="180" rx="20" ry="5" fill="#b5cfe3" {...line(2)} />
      <ellipse cx="266" cy="186" rx="22" ry="5.5" fill="#b5cfe3" {...line(2)} />
      <path d="M24 180 h10 M258 186 h12" stroke="#e6f0f7" strokeWidth="2" strokeLinecap="round" />
      <Tree x={40} y={150} s={0.95} leaf="#86b27c" shade="#749f6b" light="#9cc293" trunk="#9f7e60" />
      <Tree x={262} y={152} s={1.0} leaf="#86b27c" shade="#749f6b" light="#9cc293" trunk="#9f7e60" />
      <path d={DROPS.map(([x, y]) => `M${x} ${y} l-3 8`).join(" ")} stroke="#7f9ab3" strokeWidth="2" strokeLinecap="round" />
      <Cloud x={40} y={18} s={1.3} c="#aab6c3" />
      <Cloud x={150} y={10} s={1.1} c="#b6c1cc" />
      <Cloud x={262} y={18} s={1.3} c="#aab6c3" />
    </>
  );
}

/** A fallen leaf at x, y, turned by r degrees. */
const Leaf = ({ x, y, r, c }: { x: number; y: number; r: number; c: string }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <path d="M-7 0 Q0 -6 7 0 Q0 6 -7 0 Z" fill={c} {...line(1.5)} />
    <path d="M-6 0 H6" stroke={OUT} strokeWidth="1" />
  </g>
);

function herbst() {
  const orange = { leaf: "#f2a65e", shade: "#e08c4a", light: "#f8c48a", trunk: "#a7774f" };
  const red = { leaf: "#e8836b", shade: "#d26c56", light: "#f2a590", trunk: "#a7774f" };
  return (
    <>
      <Fill c="#e4edf2" />
      <Cloud x={150} y={22} s={0.65} c="#fbfaf6" />
      <Bird x={196} y={34} />
      <Bird x={210} y={28} />
      <path d="M-4 134 Q70 112 150 130 Q220 116 304 128 V204 H-4 Z" fill="#e3d6a2" {...line(2.5)} />
      <Ground y={150} c="#cbd08c" wave={4} />
      <Tree x={36} y={160} s={1.15} {...orange} />
      <Tree x={82} y={146} s={0.6} {...red} />
      <Tree x={222} y={146} s={0.6} {...orange} />
      <Tree x={270} y={162} s={1.15} {...red} />
      {[
        [12, 180, 20, "#f2a65e"],
        [34, 190, -30, "#e8836b"],
        [60, 176, 60, "#f3cf6b"],
        [80, 192, -10, "#f2a65e"],
        [106, 186, 40, "#e8836b"],
        [196, 190, -40, "#f3cf6b"],
        [226, 178, 10, "#e8836b"],
        [248, 192, 70, "#f2a65e"],
        [282, 182, -20, "#f3cf6b"],
        [150, 196, 0, "#f2a65e"],
        [62, 100, 30, "#f3cf6b"],
        [240, 92, -40, "#e8836b"],
      ].map(([x, y, r, c]) => (
        <Leaf key={`${x}-${y}`} x={x as number} y={y as number} r={r as number} c={c as string} />
      ))}
    </>
  );
}

function bauernhof() {
  return (
    <>
      <Fill c={SKY} />
      <Sun x={150} y={22} r={11} />
      <Cloud x={226} y={26} s={0.7} />
      <path d="M-4 136 Q70 118 150 132 Q230 118 304 134 V204 H-4 Z" fill="#ead58f" {...line(2.5)} />
      <path
        d="M98 134 Q130 130 150 136 M110 140 Q140 136 168 142 M180 132 Q196 128 214 132"
        fill="none"
        stroke="#d8bf6e"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Ground y={150} c={GRASS} wave={3} />
      {/* the red barn at the left */}
      <path d="M-6 158 V92 L18 66 H60 L84 92 V158 Z" fill="#df8a76" {...line(3)} />
      <path d="M-10 94 L18 62 H60 L88 94" fill="none" stroke={OUT} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M-10 94 L18 62 H60 L88 94" fill="none" stroke="#f5ede0" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <rect x="27" y="74" width="24" height="14" fill="#f5ede0" {...line(2.5)} />
      <rect x="18" y="108" width="42" height="50" fill="#c9705f" {...line(3)} />
      <path d="M18 108 L60 158 M60 108 L18 158 M39 108 V158" stroke="#f5ede0" strokeWidth="3" />
      <rect x="18" y="108" width="42" height="50" fill="none" stroke="#f5ede0" strokeWidth="3" />
      <rect x="18" y="108" width="42" height="50" fill="none" {...line(2.5)} />
      {/* the silo at the right */}
      <path d="M262 158 V74 Q277 56 292 74 V158 Z" fill="#d8dde6" {...line(3)} />
      <path d="M280 76 V156" stroke="#c3cad6" strokeWidth="5" />
      <path d="M262 96 H292 M262 118 H292 M262 140 H292" stroke={OUT} strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M262 74 Q277 56 292 74 Z" fill="#9fb2cf" {...line(3)} />
      <path d="M262 158 V74 Q277 56 292 74 V158 Z" fill="none" {...line(3)} />
      {/* a rail fence along the sides */}
      <Rails x0={-4} x1={100} y={168} />
      <Rails x0={200} x1={304} y={168} />
    </>
  );
}

/** A low wooden rail fence from x0 to x1, standing on y. */
function Rails({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const posts: number[] = [];
  for (let x = x0 + 8; x < x1; x += 26) posts.push(x);
  return (
    <g>
      <rect x={x0} y={y - 26} width={x1 - x0} height="6" rx="2" fill="#d7ad80" {...line(2.5)} />
      <rect x={x0} y={y - 14} width={x1 - x0} height="6" rx="2" fill="#d7ad80" {...line(2.5)} />
      {posts.map((x) => (
        <rect key={x} x={x} y={y - 32} width="8" height="34" rx="2" fill="#c99a6c" {...line(2.5)} />
      ))}
    </g>
  );
}

function baustelle() {
  return (
    <>
      <Fill c={SKY} />
      <Cloud x={130} y={24} s={0.6} />
      <Ground y={148} c="#dcc49a" wave={3} />
      {/* a half-built concrete wall at the left, its bars sticking out (no bricks: they are an answer) */}
      <path d="M8 96 V86 M30 108 V98 M52 122 V112" stroke="#8a8f99" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M-4 152 V96 H30 V108 H52 V122 H74 V152 Z" fill="#c9ccd3" {...line(3)} />
      {/* red and white barriers along the sides */}
      <Barrier x={2} y={170} />
      <Barrier x={218} y={160} />
      {/* a heap of sand at the right */}
      <path d="M232 204 Q246 168 270 166 Q292 166 308 196 V204 Z" fill="#efcf8e" {...line(3)} />
      <path d="M254 180 q4 -3 8 0 M276 176 q4 -3 8 0" fill="none" stroke="#d9b06c" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

/** A red and white barrier on two feet, 80 wide, standing on y. */
function Barrier({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x + 8} ${y} V${y - 26} M${x + 72} ${y} V${y - 26}`} stroke={OUT} strokeWidth="5" strokeLinecap="round" />
      <path d={`M${x + 8} ${y} V${y - 26} M${x + 72} ${y} V${y - 26}`} stroke="#c9ccd3" strokeWidth="2" strokeLinecap="round" />
      <rect x={x} y={y - 34} width="80" height="14" rx="2" fill="#ffffff" {...line(2.5)} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${x + 4 + i * 20} ${y - 20} L${x + 14 + i * 20} ${y - 34} H${x + 22 + i * 20} L${x + 12 + i * 20} ${y - 20} Z`} fill="#e77f6f" />
      ))}
      <rect x={x} y={y - 34} width="80" height="14" rx="2" fill="none" {...line(2.5)} />
    </g>
  );
}

function berg() {
  return (
    <>
      <Fill c={SKY} />
      <Cloud x={154} y={20} s={0.6} />
      <Bird x={196} y={44} />
      {/* far low peaks in the middle */}
      <path d="M70 152 L110 100 L134 118 L158 92 L190 124 L210 110 L240 152 Z" fill="#c8d4e6" {...line(2.5)} />
      <path d="M150 100 L158 92 L166 102 L161 99 L156 104 Z" fill="#ffffff" />
      {/* big peaks at the sides */}
      <path d="M-20 152 L40 36 L70 76 L110 152 Z" fill="#b4c2d8" {...line(3)} />
      <path d="M40 36 L70 76 L110 152 L60 152 L58 94 Z" fill="#a2b1ca" />
      <path d="M40 36 L54 63 L46 58 L40 66 L33 58 L26 64 Z" fill="#ffffff" {...line(2.5)} />
      <path d="M190 152 L250 28 L276 68 L284 60 L320 152 Z" fill="#b4c2d8" {...line(3)} />
      <path d="M250 28 L276 68 L284 60 L320 152 L266 152 L262 82 Z" fill="#a2b1ca" />
      <path d="M250 28 L264 54 L256 50 L250 58 L243 51 L236 56 Z" fill="#ffffff" {...line(2.5)} />
      <path d="M-20 152 L40 36 L70 76 L110 152 Z M190 152 L250 28 L276 68 L284 60 L320 152 Z" fill="none" {...line(3)} />
      <Ground y={146} c={GRASS} wave={4} />
      <path d="M140 146 Q120 160 136 172 Q158 186 120 204 H200 Q180 184 168 172 Q154 160 160 146 Z" fill="#e8d5ab" {...line(2.5)} />
      <Fir x={18} y={172} s={0.9} />
      <Fir x={52} y={166} s={0.65} />
      <Fir x={250} y={166} s={0.65} />
      <Fir x={284} y={174} s={0.9} />
      <path d="M78 188 q4 -6 10 -6 q6 0 8 6 Z M226 190 q4 -5 9 -5 q5 0 7 5 Z" fill="#c7c9cf" {...line(2)} />
    </>
  );
}

function unterwasser() {
  return (
    <>
      <Fill c="#a9dbef" />
      <rect y="100" width="300" height="100" fill="#98d1ea" />
      <path d="M-4 8 Q20 2 44 8 T92 8 T140 8 T188 8 T236 8 T284 8 T332 8 V-4 H-4 Z" fill="#cdeef8" {...line(2.5)} />
      <path d="M40 14 L22 110 M110 14 L100 90 M196 14 L208 90 M262 14 L284 110" stroke="#c4e9f6" strokeWidth="10" strokeLinecap="round" opacity="0.6" />
      <Ground y={160} c="#efdcaa" wave={5} />
      <path d="M100 178 q4 -3 8 0 M180 186 q4 -3 8 0 M150 170 q4 -3 8 0" fill="none" stroke="#d7bf86" strokeWidth="2" strokeLinecap="round" />
      {/* seaweed at the sides */}
      <Weed x={14} h={110} />
      <Weed x={34} h={78} c="#9ccf7e" />
      <Weed x={268} h={90} c="#9ccf7e" />
      <Weed x={290} h={120} />
      {/* a coral at the left, a rock at the right */}
      <Ribbon d="M70 172 V150 M70 160 Q58 156 58 140 M70 152 Q82 148 82 132 M58 148 Q52 146 50 138 M82 140 Q88 138 90 130" c="#f4a6a0" w={6} />
      <path d="M216 170 Q216 138 242 134 Q270 132 272 170 Z" fill="#a7afbf" {...line(3)} />
      <path d="M226 160 Q228 146 242 142" fill="none" stroke="#c3cad6" strokeWidth="3" strokeLinecap="round" />
      {/* bubbles rising at the sides */}
      {[
        [48, 110, 4],
        [56, 92, 3],
        [46, 74, 5],
        [54, 52, 3],
        [244, 120, 4],
        [236, 98, 3],
        [248, 76, 5],
        [240, 54, 3],
        [76, 30, 3],
        [224, 34, 2.5],
      ].map(([x, y, r]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={r} fill="#e3f5fb" {...line(1.6)} />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.3} fill="#ffffff" />
        </g>
      ))}
    </>
  );
}

/** A soft line in colour c, w wide, with the outline round it (seaweed, a coral's branches). */
function Ribbon({ d, c, w }: { d: string; c: string; w: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={OUT} strokeWidth={w + 5} />
      <path d={d} stroke={c} strokeWidth={w} />
    </g>
  );
}

/** A strand of seaweed waving up from the ground at x, h tall. */
function Weed({ x, h, c = "#86c06a" }: { x: number; h: number; c?: string }) {
  const q = h / 4;
  return <Ribbon d={`M${x} 174 Q${x - 9} ${174 - q / 2} ${x} ${174 - q} T${x} ${174 - 2 * q} T${x} ${174 - 3 * q} T${x} ${174 - 4 * q}`} c={c} w={6} />;
}

/** Stars over a friendly dark sky, more at the sides than in the middle. */
const STARS = [
  [14, 16, 4],
  [40, 44, 3],
  [70, 18, 5],
  [24, 82, 3],
  [60, 70, 2.5],
  [92, 40, 3],
  [130, 14, 3.5],
  [176, 26, 3],
  [206, 12, 4],
  [222, 52, 3],
  [196, 74, 2.5],
  [286, 108, 3],
  [264, 128, 2.5],
  [18, 120, 3],
  [76, 110, 2.5],
  [150, 44, 2.5],
  [234, 96, 3],
];

function weltraum() {
  return (
    <>
      <Fill c="#3f5592" />
      <circle cx="40" cy="150" r="80" fill="#4a62a0" />
      <circle cx="270" cy="60" r="70" fill="#4a5f9c" />
      {STARS.map(([x, y, r]) => (
        <Star key={`${x}-${y}`} x={x} y={y} r={r} />
      ))}
      <circle cx="110" cy="70" r="1.5" fill="#fff1b0" />
      <circle cx="190" cy="100" r="1.5" fill="#fff1b0" />
      <circle cx="120" cy="120" r="1.2" fill="#fff1b0" />
      {/* a small blue planet far off at the top left */}
      <circle cx="28" cy="22" r="9" fill="#9ed0ef" {...line(2.5)} />
      <path d="M22 18 q4 -3 7 1 q2 4 -2 6" fill="#a8d88a" />
      {/* the moon's grey ground */}
      <path d="M-4 156 Q50 146 100 154 Q160 162 210 152 Q260 144 304 154 V204 H-4 Z" fill="#c6c9d4" {...line(3)} />
      <ellipse cx="36" cy="176" rx="18" ry="5" fill="#aeb2c0" {...line(2)} />
      <ellipse cx="72" cy="192" rx="10" ry="3" fill="#aeb2c0" {...line(2)} />
      <ellipse cx="250" cy="180" rx="20" ry="5.5" fill="#aeb2c0" {...line(2)} />
      <ellipse cx="288" cy="166" rx="8" ry="2.5" fill="#aeb2c0" {...line(2)} />
      <ellipse cx="150" cy="190" rx="9" ry="2.5" fill="#b9bcc8" />
    </>
  );
}

function nacht() {
  const dark = { leaf: "#557f6a", shade: "#4a7160", light: "#638d78", trunk: "#7b6551" };
  return (
    <>
      <Fill c="#4b609c" />
      {STARS.filter(([x]) => x < 230).map(([x, y, r]) => (
        <Star key={`${x}-${y}`} x={x} y={y} r={r * 0.9} />
      ))}
      {/* the moon, a crescent at the top right */}
      <circle cx="262" cy="34" r="22" fill="#5a6ea8" />
      <path d="M262 14 A20 20 0 1 0 280 44 A16 16 0 1 1 262 14 Z" fill="#fde9a6" {...line(2.5)} />
      <path d={treeline(128, 12, 24)} fill="#4f6f8e" {...line(2.5)} />
      <Ground y={148} c="#5f8a6c" wave={4} />
      <Tree x={30} y={156} s={1.05} {...dark} />
      <Bush x={84} y={156} s={0.7} c="#557f6a" shade="#4a7160" />
      {/* the house with a lit window at the right */}
      <rect x="216" y="94" width="76" height="64" fill="#8b85a8" {...line(3)} />
      <path d="M208 96 L254 58 L300 96 Z" fill="#6c5f84" {...line(3)} />
      <rect x="226" y="108" width="22" height="20" rx="2" fill="#ffd97a" {...line(2.5)} />
      <path d="M237 108 V128 M226 118 H248" stroke={OUT} strokeWidth="2" />
      <rect x="262" y="124" width="18" height="34" rx="3" fill="#6d5a4c" {...line(2.5)} />
      <circle cx="276" cy="141" r="1.6" fill="#ffd97a" />
    </>
  );
}

/** Dusk: the sky gone dark blue with a pale band where the sun set, dark hills, a tree and a house with a lit window – no moon and no stars yet, so neither is shown before it is picked. */
function abend() {
  const dark = { leaf: "#5d8770", shade: "#507863", light: "#6a957d", trunk: "#7b6551" };
  return (
    <>
      <Fill c="#55689f" />
      {/* the last light low over the hills */}
      <rect x="-4" y="96" width="308" height="40" fill="#8a87b8" />
      <rect x="-4" y="112" width="308" height="24" fill="#d7a7a6" />
      <Cloud x={62} y={34} s={0.8} c="#7180b0" />
      <Cloud x={232} y={52} s={0.55} c="#7180b0" />
      <path d={treeline(124, 10, 26)} fill="#56708f" {...line(2.5)} />
      <Ground y={150} c="#668f72" wave={4} />
      <Tree x={34} y={158} s={1} {...dark} />
      <Bush x={86} y={158} s={0.66} c="#5d8770" shade="#507863" />
      {/* the house with a lit window at the right */}
      <rect x="220" y="100" width="72" height="58" fill="#938cb0" {...line(3)} />
      <path d="M212 102 L256 66 L300 102 Z" fill="#74678c" {...line(3)} />
      <rect x="230" y="114" width="20" height="18" rx="2" fill="#ffd97a" {...line(2.5)} />
      <path d="M240 114 V132 M230 123 H250" stroke={OUT} strokeWidth="2" />
      <rect x="264" y="126" width="18" height="32" rx="3" fill="#6d5a4c" {...line(2.5)} />
      <Tuft x={150} y={188} c="#557c62" />
    </>
  );
}

export const OUTSIDE_BACKDROPS = {
  garten,
  wiese,
  wald,
  strasse,
  spielplatz,
  strand,
  schnee,
  regen,
  herbst,
  bauernhof,
  baustelle,
  berg,
  unterwasser,
  weltraum,
  nacht,
  abend,
} satisfies Partial<Record<BackdropId, () => ReactNode>>;
