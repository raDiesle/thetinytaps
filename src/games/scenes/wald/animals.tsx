import { Eye, nth } from "../shared";
import { Lid, Lines } from "./parts";
import { STUMP_HOLE, StumpHole } from "./trees";

// The forest animals. Each drawing has its foot point at (0, 0), except the mouse, which
// lives in the stump and is drawn in its coordinates.

const EYE = "#2b2d42";

/** A thin leg with a dark hoof. */
function Leg({ x, top, w, fill, hoof = "#3d2b1f" }: { x: number; top: number; w: number; fill: string; hoof?: string }) {
  return (
    <>
      <rect x={x - w / 2} y={top} width={w} height={-top} rx={w / 2.4} fill={fill} />
      <rect x={x - w / 2} y="-9" width={w} height="9" rx="3" fill={hoof} />
    </>
  );
}

const STAG = "#a0522d";
const ANTLER = "#e6c79c";

/** Red stag behind the brook, facing left; he lifts his head and bellows, his breath puffs, ears and tail flick, he blinks. */
export function Hirsch() {
  return (
    <>
      <Leg x={52} top={-96} w={15} fill="#8b4513" />
      <Leg x={-46} top={-96} w={15} fill="#8b4513" />
      <path className="wd-hirsch-tail" d="M86 -150 q14 4 10 20 q-10 -4 -10 -20 Z" fill="#f8f1e5" style={{ transformOrigin: "86px -150px" }} />
      <ellipse cx="0" cy="-124" rx="92" ry="42" fill={STAG} />
      <ellipse cx="70" cy="-126" rx="22" ry="30" fill="#e6c79c" />
      <path d="M-70 -100 Q0 -76 70 -100 Q40 -84 0 -84 Q-40 -84 -70 -100 Z" fill="#d4a373" />
      <Leg x={70} top={-100} w={16} fill={STAG} />
      <Leg x={-62} top={-100} w={16} fill={STAG} />
      <path d="M-50 -150 Q-74 -200 -86 -214 L-58 -224 Q-44 -190 -24 -150 Z" fill={STAG} />
      <path d="M-66 -170 Q-70 -186 -80 -196" stroke="#6b4423" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5" />
      <g className="wd-hirsch-head" style={{ transformOrigin: "-60px -170px" }}>
        <g className="wd-hirsch-breath" fill="#fff">
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={-146 - i * 12} cy={-196 - i * 10} r={7 + i * 3} style={nth(i)} />
          ))}
        </g>
        <g fill="none" stroke={ANTLER} strokeWidth="7" strokeLinecap="round">
          <path d="M-88 -236 Q-108 -270 -100 -310 M-102 -262 L-126 -276 M-98 -288 L-120 -306 M-100 -310 L-88 -326" />
          <path d="M-70 -236 Q-56 -272 -66 -314 M-60 -264 L-36 -276 M-62 -292 L-40 -306 M-66 -314 L-78 -328" />
        </g>
        <g className="wd-hirsch-ear" style={{ transformOrigin: "-92px -230px" }}>
          <ellipse cx="-104" cy="-236" rx="16" ry="7" transform="rotate(-24 -104 -236)" fill={STAG} />
          <ellipse cx="-104" cy="-236" rx="9" ry="4" transform="rotate(-24 -104 -236)" fill="#f4a261" />
        </g>
        <g className="wd-hirsch-ear wd-ear-right" style={{ transformOrigin: "-60px -232px" }}>
          <ellipse cx="-50" cy="-240" rx="16" ry="7" transform="rotate(24 -50 -240)" fill={STAG} />
          <ellipse cx="-50" cy="-240" rx="9" ry="4" transform="rotate(24 -50 -240)" fill="#f4a261" />
        </g>
        <path d="M-56 -238 Q-60 -206 -94 -190 Q-124 -184 -138 -200 Q-138 -214 -120 -224 Q-96 -244 -56 -238 Z" fill={STAG} />
        <path className="wd-hirsch-jaw" d="M-138 -196 Q-118 -180 -96 -190 Q-112 -192 -134 -202 Z" fill="#8b4513" style={{ transformOrigin: "-100px -192px" }} />
        <ellipse cx="-134" cy="-204" rx="8" ry="6" fill="#3d2b1f" />
        <circle cx="-131" cy="-206" r="2" fill="#6c757d" />
        <Eye cx={-96} cy={-220} r={4.2} />
        <Lid cx={-96} cy={-220} r={4.2} fill={STAG} />
        <path d="M-56 -238 Q-62 -226 -70 -222" stroke="#f8f1e5" strokeWidth="5" strokeLinecap="round" fill="none" />
        <Lines x={-150} y={-190} dir={-1} />
      </g>
    </>
  );
}

const DEER = "#c68642";

/** Roe deer at the edge of the clearing, facing right; she leaps, flicks her ears and tail and blinks. */
export function Reh() {
  return (
    <g className="wd-reh-body">
      <Leg x={-38} top={-80} w={11} fill="#a0632b" />
      <Leg x={44} top={-80} w={11} fill="#a0632b" />
      <ellipse className="wd-reh-tail" cx="-62" cy="-100" rx="13" ry="15" fill="#fff" />
      <ellipse cx="0" cy="-96" rx="64" ry="30" fill={DEER} />
      <path d="M-48 -82 Q0 -64 48 -82 Q24 -70 0 -70 Q-24 -70 -48 -82 Z" fill="#e6c79c" />
      <Leg x={-50} top={-84} w={12} fill={DEER} />
      <Leg x={56} top={-84} w={12} fill={DEER} />
      <path d="M38 -116 Q54 -146 64 -158 L84 -146 Q72 -120 60 -96 Z" fill={DEER} />
      <g className="wd-reh-head" style={{ transformOrigin: "62px -130px" }}>
        <g className="wd-reh-ear" style={{ transformOrigin: "66px -170px" }}>
          <ellipse cx="56" cy="-182" rx="9" ry="18" transform="rotate(-30 56 -182)" fill={DEER} />
          <ellipse cx="56" cy="-182" rx="5" ry="12" transform="rotate(-30 56 -182)" fill="#f4a261" />
        </g>
        <g className="wd-reh-ear wd-ear-right" style={{ transformOrigin: "80px -170px" }}>
          <ellipse cx="88" cy="-182" rx="9" ry="18" transform="rotate(30 88 -182)" fill={DEER} />
          <ellipse cx="88" cy="-182" rx="5" ry="12" transform="rotate(30 88 -182)" fill="#f4a261" />
        </g>
        <path d="M58 -168 Q80 -178 96 -160 Q108 -144 98 -136 Q84 -134 70 -146 Q56 -156 58 -168 Z" fill={DEER} />
        <ellipse cx="100" cy="-140" rx="7" ry="6" fill="#3d2b1f" />
        <path d="M86 -136 q6 4 10 0" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
        <Eye cx={80} cy={-158} r={4} />
        <Lid cx={80} cy={-158} r={4} fill={DEER} />
      </g>
    </g>
  );
}

/** Fawn with white spots, facing its mother; it hops on wobbly legs, wags its tail, twitches its ears and squeaks. */
export function Rehkitz() {
  return (
    <g className="wd-kitz-body">
      <Leg x={26} top={-48} w={8} fill="#a0632b" />
      <Leg x={-26} top={-48} w={8} fill="#a0632b" />
      <path className="wd-kitz-tail" d="M38 -70 q12 -2 12 8 q-8 2 -12 -8 Z" fill="#f8f1e5" style={{ transformOrigin: "38px -68px" }} />
      <ellipse cx="0" cy="-62" rx="42" ry="21" fill="#d4874a" />
      {[
        [-14, -70],
        [2, -74],
        [18, -68],
        [-4, -60],
        [12, -56],
        [-22, -58],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.2" fill="#fff" />
      ))}
      <Leg x={32} top={-50} w={9} fill="#d4874a" />
      <Leg x={-34} top={-50} w={9} fill="#d4874a" />
      <path d="M-28 -72 Q-38 -92 -42 -100 L-28 -108 Q-20 -90 -12 -72 Z" fill="#d4874a" />
      <g className="wd-kitz-head" style={{ transformOrigin: "-30px -90px" }}>
        <g className="wd-kitz-ear" style={{ transformOrigin: "-38px -118px" }}>
          <ellipse cx="-52" cy="-124" rx="8" ry="14" transform="rotate(-40 -52 -124)" fill="#d4874a" />
          <ellipse cx="-52" cy="-124" rx="4" ry="9" transform="rotate(-40 -52 -124)" fill="#ffb3c1" />
        </g>
        <g className="wd-kitz-ear wd-ear-right" style={{ transformOrigin: "-26px -118px" }}>
          <ellipse cx="-18" cy="-126" rx="8" ry="14" transform="rotate(30 -18 -126)" fill="#d4874a" />
          <ellipse cx="-18" cy="-126" rx="4" ry="9" transform="rotate(30 -18 -126)" fill="#ffb3c1" />
        </g>
        <circle cx="-38" cy="-110" r="17" fill="#d4874a" />
        <ellipse cx="-56" cy="-102" rx="10" ry="8" fill="#e6a26b" />
        <circle cx="-62" cy="-104" r="4" fill="#3d2b1f" />
        <Eye cx={-42} cy={-114} r={4} />
        <Lid cx={-42} cy={-114} r={4} fill="#d4874a" />
        <circle cx="-34" cy="-104" r="3.5" fill="#ff8fa3" opacity="0.5" />
        <Lines x={-72} y={-108} dir={-1} size={0.6} />
      </g>
    </g>
  );
}

const BOAR = "#5c4033";

/** Wild boar rooting in the ground, facing right; she digs with her snout, the soil flies, she grunts, flicks ears and tail. */
export function Wildschwein() {
  return (
    <>
      <path className="wd-schwein-tail" d="M-74 -78 q-14 -2 -16 12 q-4 6 2 10" stroke={BOAR} strokeWidth="4" strokeLinecap="round" fill="none" style={{ transformOrigin: "-74px -78px" }} />
      <Leg x={-44} top={-40} w={14} fill="#3d2b1f" hoof="#212529" />
      <Leg x={30} top={-40} w={14} fill="#3d2b1f" hoof="#212529" />
      <path d="M-80 -60 Q-82 -112 -20 -114 Q48 -116 70 -80 Q76 -40 40 -28 H-50 Q-80 -32 -80 -60 Z" fill={BOAR} />
      <path d="M-66 -96 l6 -10 l6 8 l6 -12 l6 10 l6 -12 l6 10 l6 -12 l6 10 l6 -10 l6 8" stroke="#3d2b1f" strokeWidth="4" strokeLinejoin="round" fill="none" />
      <path d="M-50 -60 q20 -10 40 0 M0 -50 q20 -10 40 0" stroke="#7f5539" strokeWidth="3" strokeLinecap="round" fill="none" />
      <Leg x={-58} top={-40} w={15} fill={BOAR} hoof="#212529" />
      <Leg x={44} top={-40} w={15} fill={BOAR} hoof="#212529" />
      <g className="wd-schwein-dirt" fill="#7f5539">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={126 + (i % 2) * 10} cy={-10 - i * 4} r={6 + (i % 2) * 2} style={nth(i)} />
        ))}
      </g>
      <g className="wd-schwein-head" style={{ transformOrigin: "60px -70px" }}>
        <g className="wd-schwein-ear" style={{ transformOrigin: "62px -96px" }}>
          <path d="M54 -98 L60 -122 L74 -100 Z" fill="#3d2b1f" />
        </g>
        <path d="M50 -96 Q84 -94 116 -56 Q122 -40 112 -32 Q80 -34 56 -42 Q44 -70 50 -96 Z" fill="#6b4c3b" />
        <ellipse cx="118" cy="-44" rx="9" ry="13" fill="#b5838d" />
        <circle cx="117" cy="-48" r="2.2" fill="#3d2b1f" />
        <circle cx="118" cy="-40" r="2.2" fill="#3d2b1f" />
        <path d="M96 -40 q6 -8 2 -16" stroke="#f8f1e5" strokeWidth="4" strokeLinecap="round" fill="none" />
        <Eye cx={80} cy={-74} r={3.6} />
        <Lid cx={80} cy={-74} r={3.6} fill="#6b4c3b" />
        <Lines x={132} y={-60} size={0.7} />
      </g>
    </>
  );
}

/** Three striped piglets, facing right; they hop one after the other and wiggle their tails. */
export function Frischlinge() {
  return (
    <>
      {[-48, 0, 48].map((x, i) => (
        <g key={x} className="wd-frischling" style={nth(i)}>
          <path d={`M${x - 20} -30 q-8 -4 -10 4`} stroke="#9c6644" strokeWidth="3" strokeLinecap="round" fill="none" className="wd-frischling-tail" />
          <rect x={x - 14} y="-14" width="7" height="14" rx="3" fill="#6b4423" />
          <rect x={x + 8} y="-14" width="7" height="14" rx="3" fill="#6b4423" />
          <ellipse cx={x} cy="-26" rx="22" ry="15" fill="#b08968" />
          <path d={`M${x - 16} -32 h28 M${x - 18} -24 h30 M${x - 14} -16 h24`} stroke="#e6ccb2" strokeWidth="3.5" strokeLinecap="round" />
          <path d={`M${x + 14} -38 Q${x + 34} -32 ${x + 36} -20 Q${x + 24} -14 ${x + 16} -18 Z`} fill="#9c6644" />
          <path d={`M${x + 16} -38 l3 -9 l6 7 Z`} fill="#6b4423" />
          <ellipse cx={x + 36} cy="-22" rx="3.5" ry="5" fill="#b5838d" />
          <circle cx={x + 24} cy="-30" r="2.3" fill={EYE} />
        </g>
      ))}
    </>
  );
}

const FOX = "#e8743b";

/** Red fox behind the brook, facing left; it pounces like after a mouse, swishes its tail, flicks its ears, blinks and barks. */
export function Fuchs() {
  return (
    <g className="wd-fuchs-body">
      <g className="wd-fuchs-tail" style={{ transformOrigin: "44px -60px" }}>
        <path d="M44 -62 Q90 -90 106 -54 Q108 -30 84 -36 Q70 -54 44 -50 Z" fill={FOX} />
        <path d="M96 -40 Q108 -30 84 -36 Q90 -46 96 -40 Z M104 -50 Q110 -40 100 -36 L92 -42 Z" fill="#fff" />
      </g>
      <Leg x={34} top={-40} w={10} fill="#2b2d42" hoof="#2b2d42" />
      <Leg x={-30} top={-40} w={10} fill="#2b2d42" hoof="#2b2d42" />
      <ellipse cx="0" cy="-56" rx="52" ry="24" fill={FOX} />
      <path d="M-40 -48 Q-10 -32 30 -42 Q0 -36 -40 -48 Z" fill="#fff" />
      <Leg x={-40} top={-42} w={11} fill="#2b2d42" hoof="#2b2d42" />
      <Leg x={42} top={-42} w={11} fill="#2b2d42" hoof="#2b2d42" />
      <g className="wd-fuchs-head" style={{ transformOrigin: "-40px -70px" }}>
        <g className="wd-fuchs-ear" style={{ transformOrigin: "-56px -100px" }}>
          <path d="M-66 -96 L-70 -124 L-50 -104 Z" fill={FOX} />
          <path d="M-66 -104 L-69 -124 L-60 -114 Z" fill="#2b2d42" />
        </g>
        <g className="wd-fuchs-ear wd-ear-right" style={{ transformOrigin: "-36px -100px" }}>
          <path d="M-44 -104 L-30 -124 L-30 -96 Z" fill={FOX} />
          <path d="M-38 -112 L-30 -124 L-31 -110 Z" fill="#2b2d42" />
        </g>
        <path d="M-26 -96 Q-30 -66 -60 -62 Q-84 -66 -100 -80 Q-80 -86 -70 -98 Q-50 -110 -26 -96 Z" fill={FOX} />
        <path d="M-40 -66 Q-60 -60 -84 -72 Q-62 -70 -48 -80 Z" fill="#fff" />
        <circle cx="-100" cy="-80" r="5" fill="#2b2d42" />
        <Eye cx={-62} cy={-88} r={3.6} />
        <Lid cx={-62} cy={-88} r={3.6} fill={FOX} />
        <Lines x={-110} y={-80} dir={-1} size={0.7} />
      </g>
    </g>
  );
}

/** Badger peeking out of its burrow under the oak's roots; it climbs up, looks left and right, sniffs, blinks and ducks back. */
export function Dachs() {
  return (
    <>
      <path d="M-74 0 Q-60 -50 0 -54 Q60 -50 74 0 Z" fill="#8d6346" />
      <ellipse cx="0" cy="-22" rx="36" ry="22" fill="#3d2b1f" />
      <g className="wd-dachs-crumbs" fill="#9c6644">
        {[-30, 0, 30].map((cx, i) => (
          <circle key={cx} cx={cx} cy={-40} r="5" style={nth(i)} />
        ))}
      </g>
      <g className="wd-dachs-body">
        <ellipse cx="0" cy="-24" rx="28" ry="20" fill="#868e96" />
        <g className="wd-dachs-head" style={{ transformOrigin: "0px -36px" }}>
          <circle cx="-22" cy="-62" r="8" fill="#343a40" />
          <circle cx="22" cy="-62" r="8" fill="#343a40" />
          <ellipse cx="0" cy="-48" rx="26" ry="22" fill="#f8f9fa" />
          <path d="M-14 -68 Q-12 -46 -4 -30 L-12 -30 Q-24 -46 -22 -64 Z M14 -68 Q12 -46 4 -30 L12 -30 Q24 -46 22 -64 Z" fill="#2b2d42" />
          <ellipse className="wd-dachs-nose" cx="0" cy="-30" rx="6" ry="4.5" fill="#2b2d42" />
          <circle cx="-14" cy="-48" r="2.8" fill="#fff" />
          <circle cx="14" cy="-48" r="2.8" fill="#fff" />
          <circle cx="-14" cy="-48" r="2" fill={EYE} />
          <circle cx="14" cy="-48" r="2" fill={EYE} />
          <Lid cx={-14} cy={-48} r={2.6} fill="#2b2d42" />
          <Lid cx={14} cy={-48} r={2.6} fill="#2b2d42" />
        </g>
      </g>
      {/* Front rim of the burrow, over the badger's tummy */}
      <path d="M-40 -14 Q0 -2 40 -14 Q42 0 0 2 Q-42 0 -40 -14 Z" fill="#8d6346" />
      <path d="M-60 -6 q10 -14 24 -10 M40 -10 q14 -6 22 6" stroke="#6f4e37" strokeWidth="5" strokeLinecap="round" fill="none" />
    </>
  );
}

const SQUIRREL = "#c8551d";

/** Red squirrel at the foot of the fir, facing left; it hops, buries its nut, flicks its tail and ears, blinks and chatters. */
export function Eichhoernchen() {
  return (
    <>
      <ellipse cx="-34" cy="-2" rx="14" ry="4" fill="#7f5539" />
      <g className="wd-hoernchen-dirt" fill="#9c6644">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={-40 + i * 6} cy={-6} r="4" style={nth(i)} />
        ))}
      </g>
      <g className="wd-hoernchen-body">
        <g className="wd-hoernchen-tail" style={{ transformOrigin: "14px -14px" }}>
          <path d="M10 -12 Q52 -18 46 -64 Q42 -104 8 -104 Q34 -88 30 -64 Q26 -36 6 -30 Z" fill={SQUIRREL} />
          <path d="M18 -90 Q34 -80 32 -62" stroke="#e76f51" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
        <ellipse cx="0" cy="-34" rx="17" ry="26" fill={SQUIRREL} />
        <ellipse cx="-6" cy="-30" rx="9" ry="18" fill="#f8e5c8" />
        <ellipse cx="-4" cy="-6" rx="12" ry="6" fill="#a8441a" />
        <g className="wd-hoernchen-nut" style={{ transformOrigin: "-22px -42px" }}>
          <ellipse cx="-22" cy="-40" rx="7" ry="8" fill="#bc6c25" />
          <path d="M-29 -44 Q-22 -52 -15 -44 Z" fill="#7f5539" />
        </g>
        <path d="M-12 -46 q-8 2 -12 8 M-10 -38 q-8 2 -12 6" stroke={SQUIRREL} strokeWidth="5" strokeLinecap="round" fill="none" />
        <g className="wd-hoernchen-head" style={{ transformOrigin: "-6px -60px" }}>
          <g className="wd-hoernchen-ear" style={{ transformOrigin: "-4px -82px" }}>
            <path d="M-8 -80 L-4 -98 L2 -80 Z" fill={SQUIRREL} />
            <path d="M-4 -98 l-3 -6 M-4 -98 l3 -6" stroke="#a8441a" strokeWidth="2" strokeLinecap="round" />
          </g>
          <circle cx="-10" cy="-72" r="14" fill={SQUIRREL} />
          <ellipse cx="-20" cy="-66" rx="7" ry="5" fill="#f8e5c8" />
          <circle cx="-26" cy="-68" r="2.4" fill="#2b2d42" />
          <Eye cx={-14} cy={-76} r={3.2} />
          <Lid cx={-14} cy={-76} r={3.2} fill={SQUIRREL} />
          <Lines x={-34} y={-72} dir={-1} size={0.55} />
        </g>
      </g>
    </>
  );
}

/** Hedgehog with an apple on its spikes, facing left; it curls up into a ball, bristles, uncurls, sniffs and the apple hops. */
export function Igel() {
  const spikes = Array.from({ length: 13 }, (_, i) => {
    const a = Math.PI * (0.95 - i * 0.07);
    const [x, y] = [6 + 44 * Math.cos(a), -30 - 34 * Math.sin(a)];
    const [tx, ty] = [6 + 62 * Math.cos(a), -30 - 50 * Math.sin(a)];
    return `M${x - 8 * Math.sin(a)} ${y - 8 * Math.cos(a)} L${tx} ${ty} L${x + 8 * Math.sin(a)} ${y + 8 * Math.cos(a)} Z`;
  });
  return (
    <g className="wd-igel-body">
      <g className="wd-igel-spikes" style={{ transformOrigin: "6px -20px" }}>
        <path d={spikes.join(" ")} fill="#5c4033" />
        <ellipse cx="6" cy="-30" rx="48" ry="32" fill="#7f5539" />
        <path d="M-20 -46 l6 -8 M0 -54 l4 -8 M20 -50 l6 -8 M34 -36 l8 -6 M-6 -36 l4 -8 M14 -30 l6 -8" stroke="#5c4033" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="wd-igel-apple" style={{ transformOrigin: "10px -70px" }}>
        <circle cx="10" cy="-74" r="14" fill="#e63946" />
        <circle cx="5" cy="-79" r="4" fill="#fff" opacity="0.6" />
        <path d="M10 -88 v-6" stroke="#6b4423" strokeWidth="3" strokeLinecap="round" />
        <path d="M11 -92 q8 -6 12 0 q-8 4 -12 0 Z" fill="#52b788" />
      </g>
      <g className="wd-igel-face" style={{ transformOrigin: "-30px -20px" }}>
        <path d="M-34 -42 Q-58 -38 -70 -18 Q-62 -8 -40 -8 Q-30 -20 -34 -42 Z" fill="#e6ccb2" />
        <circle className="wd-igel-nose" cx="-70" cy="-19" r="4.5" fill="#2b2d42" />
        <Eye cx={-48} cy={-28} r={3.2} />
        <Lid cx={-48} cy={-28} r={3.2} fill="#e6ccb2" />
        <circle cx="-44" cy="-18" r="3" fill="#ff8fa3" opacity="0.6" />
        <ellipse cx="-36" cy="-4" rx="7" ry="4" fill="#9c6644" />
        <ellipse cx="30" cy="-4" rx="7" ry="4" fill="#9c6644" />
      </g>
    </g>
  );
}

const RABBIT = "#a68a64";

/** Wild rabbit behind the brook, facing right, with a dandelion leaf; it hops, wiggles ears, nose and tail and nibbles. */
export function Hase() {
  return (
    <g className="wd-hase-body">
      <circle className="wd-hase-tail" cx="-32" cy="-26" r="10" fill="#fff" />
      <ellipse cx="-4" cy="-6" rx="26" ry="7" fill="#8d6e4c" />
      <ellipse cx="0" cy="-38" rx="34" ry="34" fill={RABBIT} />
      <ellipse cx="12" cy="-32" rx="15" ry="20" fill="#e6ccb2" />
      <ellipse cx="22" cy="-8" rx="10" ry="6" fill="#e6ccb2" />
      <g className="wd-hase-head" style={{ transformOrigin: "18px -64px" }}>
        <g className="wd-hase-ear" style={{ transformOrigin: "8px -100px" }}>
          <ellipse cx="6" cy="-122" rx="9" ry="26" transform="rotate(-14 6 -122)" fill={RABBIT} />
          <ellipse cx="6" cy="-120" rx="4.5" ry="18" transform="rotate(-14 6 -120)" fill="#ffb3c1" />
        </g>
        <g className="wd-hase-ear wd-ear-right" style={{ transformOrigin: "26px -100px" }}>
          <ellipse cx="32" cy="-122" rx="9" ry="26" transform="rotate(14 32 -122)" fill={RABBIT} />
          <ellipse cx="32" cy="-120" rx="4.5" ry="18" transform="rotate(14 32 -120)" fill="#ffb3c1" />
        </g>
        <circle cx="20" cy="-84" r="22" fill={RABBIT} />
        <ellipse cx="30" cy="-76" rx="10" ry="8" fill="#e6ccb2" />
        <ellipse className="wd-hase-nose" cx="38" cy="-80" rx="4" ry="3" fill="#ff8fa3" />
        <Eye cx={22} cy={-90} r={3.6} />
        <Lid cx={22} cy={-90} r={3.6} fill={RABBIT} />
        <g className="wd-hase-leaf" style={{ transformOrigin: "36px -72px" }}>
          <path d="M36 -72 Q52 -66 60 -50 Q48 -52 44 -58 Q38 -56 36 -72 Z" fill="#52b788" />
          <path d="M38 -70 L56 -52" stroke="#40916c" strokeWidth="2" />
        </g>
      </g>
    </g>
  );
}

/** Wood mouse in the stump's hole, in the stump's coordinates; it runs out, squeaks, wiggles nose and ears, blinks and goes home. */
export function Maus() {
  const { cx, cy } = STUMP_HOLE;
  return (
    <StumpHole>
      <g className="wd-maus-body">
        <path className="wd-maus-tail" d={`M${cx + 14} ${cy + 8} Q${cx + 40} ${cy + 12} ${cx + 46} ${cy - 6}`} stroke="#c8b6a6" strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse cx={cx + 6} cy={cy + 4} rx="17" ry="12" fill="#a47148" />
        <g className="wd-maus-ear" style={{ transformOrigin: `${cx - 6}px ${cy - 12}px` }}>
          <circle cx={cx - 4} cy={cy - 16} r="7" fill="#a47148" />
          <circle cx={cx - 4} cy={cy - 16} r="4" fill="#ffb3c1" />
        </g>
        <circle cx={cx - 10} cy={cy - 2} r="11" fill="#a47148" />
        <g className="wd-maus-ear wd-ear-right" style={{ transformOrigin: `${cx - 14}px ${cy - 12}px` }}>
          <circle cx={cx - 16} cy={cy - 15} r="7" fill="#b5835a" />
          <circle cx={cx - 16} cy={cy - 15} r="4" fill="#ffb3c1" />
        </g>
        <ellipse cx={cx - 18} cy={cy + 2} rx="6" ry="5" fill="#e6ccb2" />
        <circle className="wd-maus-nose" cx={cx - 23} cy={cy + 1} r="2.6" fill="#ff8fa3" />
        <Eye cx={cx - 12} cy={cy - 4} r={2.4} />
        <Lid cx={cx - 12} cy={cy - 4} r={2.4} fill="#a47148" />
        <path d={`M${cx - 22} ${cy + 4} H${cx - 34} M${cx - 22} ${cy + 6} L${cx - 33} ${cy + 10}`} stroke="#6c584c" strokeWidth="1" />
        <Lines x={cx - 36} y={cy - 4} dir={-1} size={0.5} />
      </g>
    </StumpHole>
  );
}

/** Mole on its molehill; the soil bursts, it pops up, waves its pink spade hands, sniffs and ducks back down. */
export function Maulwurf() {
  return (
    <>
      <g className="wd-maulwurf-crumbs" fill="#6f4e37">
        {[-36, -12, 14, 38].map((cx, i) => (
          <circle key={cx} cx={cx} cy={-46} r="6" style={nth(i)} />
        ))}
      </g>
      <g className="wd-maulwurf-body">
        <ellipse cx="0" cy="-48" rx="24" ry="26" fill="#495057" />
        <ellipse cx="-6" cy="-58" rx="10" ry="6" fill="#6c757d" opacity="0.6" />
        <g className="wd-maulwurf-hand" style={{ transformOrigin: "-22px -42px" }}>
          <ellipse cx="-30" cy="-46" rx="10" ry="8" fill="#ffb3c1" />
          <path d="M-38 -52 l-4 -4 M-40 -46 h-5 M-38 -40 l-4 3" stroke="#ffb3c1" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g className="wd-maulwurf-hand wd-hand-right" style={{ transformOrigin: "22px -42px" }}>
          <ellipse cx="30" cy="-46" rx="10" ry="8" fill="#ffb3c1" />
          <path d="M38 -52 l4 -4 M40 -46 h5 M38 -40 l4 3" stroke="#ffb3c1" strokeWidth="3" strokeLinecap="round" />
        </g>
        <ellipse className="wd-maulwurf-nose" cx="0" cy="-40" rx="8" ry="6" fill="#ff8fa3" />
        <path d="M-12 -54 q3 2 6 0 M6 -54 q3 2 6 0" stroke="#f8f9fa" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M-8 -40 H-22 M8 -40 H22" stroke="#adb5bd" strokeWidth="1.2" />
      </g>
      <path d="M-62 0 Q-50 -38 -22 -34 Q0 -26 22 -34 Q50 -38 62 0 Z" fill="#7f5539" />
      <path d="M-40 -14 h8 M20 -20 h8 M-8 -8 h8" stroke="#5c4033" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="-30" cy="-28" rx="10" ry="4" fill="#9c6644" />
    </>
  );
}

const BEAVER = "#8d5524";

/** Beaver on the bank next to its dam, facing right; it gnaws its stick, chips fly, and it slaps its flat tail on the water. */
export function Biber() {
  return (
    <>
      <g className="wd-biber-splash" fill="#bde0fe">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={-74 + i * 12} cy={-20 - (i % 2) * 8} r="5" style={nth(i)} />
        ))}
      </g>
      <g className="wd-biber-tail" style={{ transformOrigin: "-30px -14px" }}>
        <ellipse cx="-62" cy="-10" rx="32" ry="11" fill="#495057" />
        <path d="M-84 -14 l40 6 M-80 -6 l36 -6 M-70 -18 l14 16" stroke="#343a40" strokeWidth="2" />
      </g>
      <ellipse cx="0" cy="-36" rx="40" ry="32" fill={BEAVER} />
      <ellipse cx="10" cy="-28" rx="22" ry="22" fill="#b5835a" />
      <ellipse cx="-16" cy="-4" rx="12" ry="6" fill="#6b4423" />
      <ellipse cx="22" cy="-4" rx="12" ry="6" fill="#6b4423" />
      <g className="wd-biber-stick" style={{ transformOrigin: "40px -44px" }}>
        <path d="M12 -20 L66 -66" stroke="#b08968" strokeWidth="7" strokeLinecap="round" />
        <path d="M58 -58 q10 -12 20 -6 q-8 10 -20 6 Z" fill="#52b788" />
        <ellipse cx="38" cy="-42" rx="5" ry="3" fill="#e6c79c" />
      </g>
      <g className="wd-biber-head" style={{ transformOrigin: "26px -54px" }}>
        <circle cx="22" cy="-80" r="6" fill="#6b4423" />
        <circle cx="34" cy="-66" r="20" fill={BEAVER} />
        <ellipse cx="48" cy="-58" rx="10" ry="8" fill="#b5835a" />
        <ellipse cx="54" cy="-62" rx="4" ry="3" fill="#2b2d42" />
        <rect x="44" y="-52" width="9" height="10" rx="2" fill="#f4a261" />
        <path d="M48.5 -52 v10" stroke="#e76f51" strokeWidth="1.5" />
        <Eye cx={36} cy={-72} r={3.2} />
        <Lid cx={36} cy={-72} r={3.2} fill={BEAVER} />
      </g>
      <g className="wd-biber-chips" fill="#e6c79c">
        {[0, 1, 2].map((i) => (
          <rect key={i} x={56 + i * 4} y={-50 + i * 3} width="6" height="3" rx="1" style={nth(i)} />
        ))}
      </g>
    </>
  );
}
