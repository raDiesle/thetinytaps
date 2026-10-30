import { memo, useEffect, useId, useMemo } from "react";
import { loadRecordings } from "@/lib/sfx";
import {
  BALE,
  BARN,
  BARN_MID,
  buildFarm,
  CAN,
  CAT,
  COW,
  DOG_END,
  DONKEY,
  DUCKS,
  FARM_SOUNDS,
  type Farm,
  FLOOR,
  KENNEL,
  MOO_MOUTH,
  MOO_RING_GROW,
  MOO_RING_R0,
  PLANK,
  POND,
  POST,
  PUDDLE,
  ROCKS,
  SINGERS,
  WORLD_W,
  YARN_R,
} from "./farm";
import { VIEW_H, type LevelProps, wobble } from "./level";
import { along, easeOut, seg } from "./machineKit";
import { MachineStage, TapHint } from "./MachineStage";
import { BAR_COLORS } from "./parts";
import { INK, Sparkles } from "./scenery";

const GRASS = "#7cc94e";
const MUD = "#8d5a3b";
const PINK = "#ffb3c6";
const BARN_RED = "#c0392b";
const BEAK = "#ff8c42";

/**
 * Level: the farm machine (R-06). Every link of the chain is an animal: one
 * tap, and the rooster crows, the pig jumps into the puddle, the mud wakes the
 * cat, her ball of wool rolls onto the cow's nose, the moo wakes the goat, who
 * hops down her rocks and butts the milk can (twice – the first time it only
 * wobbles) into the kennel, the dog comes out and chases the ducks onto the
 * donkey's back, the donkey brays „I-aah“ and kicks the barn, the ducks fly
 * up onto its roof, the barn doors open, and all the animals sing together.
 * The camera walks along the farmyard.
 */
export function FarmLevel(props: LevelProps) {
  const farm = useMemo(buildFarm, []);
  const ids = useId();
  // The animals call with their recordings; load them now, so the first crow is already the real one.
  useEffect(() => loadRecordings(FARM_SOUNDS), []);
  // Things that keep moving (singing, wagging) stop when the level is over.
  const still = (t: number) => Math.min(t, farm.tDone);

  return (
    <MachineStage machine={farm} level="farm" {...props}>
      {(t) => (
        <>
          <Yard />
          <StartGlow t={t} glow={`${ids}-glow`} />
          <Fence />
          <Rooster farm={farm} t={t} />
          <Puddle farm={farm} t={t} />
          <Pig farm={farm} t={t} />
          <Bale />
          <Yarn farm={farm} t={t} />
          <Cat farm={farm} t={t} />
          <Mud farm={farm} t={t} />
          <Cow farm={farm} t={t} />
          <Rocks />
          <Goat farm={farm} t={t} />
          <Kennel farm={farm} t={t} />
          <MilkCan farm={farm} t={t} />
          <Pond />
          <Barn farm={farm} t={t} still={still(t)} />
          <Donkey farm={farm} t={t} still={still(t)} />
          <Dog farm={farm} t={t} still={still(t)} />
          {Array.from({ length: DUCKS }, (_, i) => (
            <Duck key={i} farm={farm} i={i} t={t} still={still(t)} />
          ))}
          <CrowNotes farm={farm} t={t} />
          <MooRings farm={farm} t={t} />
          <ChoirNotes farm={farm} t={t} />
          <Sparkles x={BARN_MID} y={BARN.peak - 40} age={t - farm.tChoir - 0.8} n={12} spread={340} />
          <TapHint t={t} x={POST.x + 120} y={POST.top + 150} />
        </>
      )}
    </MachineStage>
  );
}

/* ---------- The farmyard ---------- */

function Yard() {
  return (
    <g>
      <rect x="-400" y="-200" width={WORLD_W + 800} height="800" fill="#9ad8ff" />
      {[300, 1500, 2700, 3900, 5000].map((x, i) => (
        <g key={x} transform={`translate(${x} ${110 + (i % 2) * 60})`} fill="#fff">
          <ellipse cx="0" cy="0" rx="70" ry="30" />
          <ellipse cx="50" cy="-18" rx="50" ry="30" />
          <ellipse cx="100" cy="0" rx="60" ry="26" />
        </g>
      ))}
      <path d={`M-400 600 Q300 470 1000 580 T2400 560 T3800 580 T5200 550 T${WORLD_W + 400} 580 V900 H-400 Z`} fill="#a8d672" stroke={INK} strokeWidth="3" />
      <rect x="-400" y="600" width={WORLD_W + 800} height={VIEW_H + 200} fill={GRASS} />
      <line x1="-400" y1="600" x2={WORLD_W + 400} y2="600" stroke="#5fae3a" strokeWidth="4" />
      {Array.from({ length: Math.ceil(WORLD_W / 140) }, (_, i) => (
        <path key={i} d={`M${i * 140 + 40} ${830 + (i % 3) * 22} l8 -22 l8 22 l8 -18`} fill="none" stroke="#5fae3a" strokeWidth="4" strokeLinecap="round" />
      ))}
    </g>
  );
}

/** A soft, still glow behind the rooster: what to tap. */
function StartGlow({ t, glow }: { t: number; glow: string }) {
  if (t >= 0) return null;
  return (
    <g>
      <defs>
        <radialGradient id={glow}>
          <stop offset="0" stopColor="#fff6a8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff6a8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={POST.x + 10} cy={POST.top - 80} r="150" fill={`url(#${glow})`} />
    </g>
  );
}

/** A piece of wooden fence; the rooster stands on its tallest post. */
function Fence() {
  return (
    <g stroke={INK} strokeWidth="4" strokeLinejoin="round">
      {[640, 710].map((y) => (
        <rect key={y} x="40" y={y} width="380" height="22" rx="4" fill="#d9a066" />
      ))}
      {[60, 160, 380].map((x) => (
        <rect key={x} x={x - 14} y="620" width="28" height={FLOOR - 620} rx="4" fill="#c68a4f" />
      ))}
      <rect x={POST.x - 22} y={POST.top} width="44" height={FLOOR - POST.top} rx="5" fill="#c68a4f" />
    </g>
  );
}

/* ---------- The animals ---------- */

/** The rooster, side on, looking right; he throws his head back and flaps while he crows. */
function Rooster({ farm, t }: { farm: Farm; t: number }) {
  const c = Math.sin(Math.PI * seg(t, farm.tCrow, farm.tCrow + 1.4));
  const flap = c * 25 * Math.sin(t * 22);
  return (
    <g transform={`translate(${POST.x} ${POST.top})`} stroke={INK} strokeWidth="4" strokeLinejoin="round">
      <path d="M-8 0 V-30 M8 0 V-30" stroke={BEAK} strokeWidth="6" strokeLinecap="round" />
      {["#264653", "#2a9d8f", "#e9c46a"].map((color, i) => (
        <path key={color} d={`M-34 -66 Q${-90 + i * 8} ${-150 + i * 26} ${-60 + i * 6} ${-40 + i * 6} Z`} fill={color} />
      ))}
      <ellipse cx="0" cy="-62" rx="48" ry="38" fill="#e76f51" />
      <ellipse cx="-6" cy="-60" rx="28" ry="17" fill="#c44536" transform={`rotate(${-flap} 14 -64)`} />
      <g transform={`rotate(${-28 * c} 22 -84)`}>
        <path d="M14 -76 Q20 -102 32 -112 L44 -96 Q40 -80 30 -70 Z" fill="#e76f51" />
        <path d="M20 -124 q2 -18 10 -6 q4 -18 10 -4 q6 -16 10 0 l-4 8 h-24 Z" fill="#e63946" />
        <circle cx="34" cy="-104" r="22" fill="#e76f51" />
        <ellipse cx="50" cy="-86" rx="6" ry="10" fill="#e63946" />
        <path d="M54 -110 L76 -104 L54 -100 Z" fill="#ffb703" />
        <path d="M54 -100 L74 -98 L54 -94 Z" fill="#ffb703" transform={`rotate(${30 * c} 54 -100)`} />
        {c > 0.2 ? <path d="M37 -110 q5 -5 10 0" fill="none" strokeLinecap="round" /> : <circle cx="42" cy="-110" r="4" fill={INK} stroke="none" />}
      </g>
    </g>
  );
}

/** Little coloured notes from the crow, flying over to the pig. */
function CrowNotes({ farm, t }: { farm: Farm; t: number }) {
  return (
    <g>
      {[0, 1, 2, 3].map((i) => {
        const { pt, k } = farm.crowNote(i, t);
        if (k <= 0 || k >= 1) return null;
        return <Note key={i} x={pt.x} y={pt.y} size={1.1} color={BAR_COLORS[i * 2]} />;
      })}
    </g>
  );
}

/** A music note, its head at (x, y). */
function Note({ x, y, size, color, opacity = 1 }: { x: number; y: number; size: number; color: string; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size}) rotate(-12)`} opacity={opacity} stroke={INK} strokeWidth="3" strokeLinejoin="round">
      <path d="M10 0 V-40 Q22 -34 26 -22" fill="none" strokeLinecap="round" strokeWidth="5" />
      <ellipse cx="0" cy="0" rx="13" ry="10" fill={color} />
    </g>
  );
}

/** The puddle, and the splash when the pig lands in it. */
function Puddle({ farm, t }: { farm: Farm; t: number }) {
  const age = t - farm.tSplash;
  return (
    <g>
      <ellipse cx={PUDDLE.x} cy={FLOOR - 4} rx={PUDDLE.rx} ry={PUDDLE.ry} fill={MUD} stroke={INK} strokeWidth="4" />
      <ellipse cx={PUDDLE.x - 50} cy={FLOOR - 12} rx="50" ry="8" fill="#b07a55" />
      {age >= 0 &&
        age < 0.9 &&
        Array.from({ length: 10 }, (_, i) => {
          const a = Math.PI * (0.1 + (0.8 * i) / 9);
          const r = 40 + 260 * easeOut(age / 0.9);
          return (
            <circle
              key={i}
              cx={PUDDLE.x - r * Math.cos(a)}
              cy={FLOOR - 20 - r * 0.7 * Math.sin(a) + 300 * age * age}
              r={14 - 8 * age}
              fill={MUD}
              stroke={INK}
              strokeWidth="2"
            />
          );
        })}
    </g>
  );
}

/** The pig: asleep on its side, up with a start, a big jump, and then happy in the mud. */
function Pig({ farm, t }: { farm: Farm; t: number }) {
  const p = farm.pigAt(t);
  const up = p.inPuddle ? 0.15 : p.up;
  const bodyY = -(52 + 40 * up);
  const startled = t >= farm.tPigWake && t < farm.tSplash;
  const asleep = t < farm.tPigWake;
  const wallow = p.inPuddle ? wobble(t - farm.tSplash, 6, 10, 2) : 0;
  return (
    <g transform={`translate(${p.x} ${FLOOR - p.lift}) rotate(${wallow})`} stroke={INK} strokeWidth="4" strokeLinejoin="round">
      {up > 0.05 && [-62, -30, 34, 66].map((x) => <rect key={x} x={x - 12} y={bodyY + 30} width="24" height={-bodyY - 30} rx="6" fill={PINK} />)}
      <path d={`M-100 ${bodyY - 10} q-24 -10 -16 -26 q10 -8 12 6 q2 12 -14 14`} fill="none" />
      <ellipse cx="0" cy={bodyY} rx="105" ry="56" fill={PINK} />
      {p.inPuddle &&
        [
          [-50, 14, 18],
          [10, 30, 22],
          [56, 0, 14],
        ].map(([x, y, r]) => <ellipse key={x} cx={x} cy={bodyY + y} rx={r} ry={r * 0.7} fill={MUD} stroke="none" />)}
      <g transform={`translate(92 ${bodyY - 18})`}>
        <path d="M-26 -36 L-30 -66 L-6 -44 Z M10 -42 L20 -70 L30 -38 Z" fill="#ff8fab" />
        <circle r="46" fill={PINK} />
        <ellipse cx="44" cy="8" rx="16" ry="20" fill="#ff8fab" />
        <circle cx="42" cy="2" r="3" fill={INK} stroke="none" />
        <circle cx="46" cy="14" r="3" fill={INK} stroke="none" />
        {asleep ? (
          <path d="M8 -10 q8 6 16 0" fill="none" strokeLinecap="round" />
        ) : (
          <circle cx="16" cy="-12" r={startled ? 9 : 5} fill={startled ? "#fff" : INK} />
        )}
        {startled && <circle cx="18" cy="-12" r="4" fill={INK} stroke="none" />}
        {p.inPuddle && <path d="M8 22 q12 12 26 2" fill="none" strokeLinecap="round" />}
      </g>
    </g>
  );
}

/** The hay bale, and the plank the wool rolls down. */
function Bale() {
  const dx = PLANK.b.x - PLANK.a.x;
  const dy = PLANK.b.y - PLANK.a.y;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <g stroke={INK} strokeWidth="4" strokeLinejoin="round">
      <g transform={`translate(${PLANK.a.x} ${PLANK.a.y}) rotate(${angle})`}>
        <rect x="0" y="0" width={Math.hypot(dx, dy)} height="18" rx="4" fill="#b8763d" />
      </g>
      <rect x={BALE.x0} y={BALE.top} width={BALE.x1 - BALE.x0} height={FLOOR - BALE.top} rx="14" fill="#f4c95d" />
      {[0.25, 0.75].map((k) => (
        <line key={k} x1={BALE.x0 + k * (BALE.x1 - BALE.x0)} y1={BALE.top} x2={BALE.x0 + k * (BALE.x1 - BALE.x0)} y2={FLOOR} stroke="#b5651d" strokeWidth="6" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${BALE.x0 + 20 + i * 30} ${BALE.top + 30 + (i % 3) * 36} l18 -8`} stroke="#d9a52f" strokeWidth="3" strokeLinecap="round" />
      ))}
    </g>
  );
}

/** The ball of wool: it turns as it rolls, and lays a red thread behind it. */
function Yarn({ farm, t }: { farm: Farm; t: number }) {
  const d = farm.yarnDist(t);
  const pt = farm.yarnAt(t);
  const thread: string[] = [];
  for (let s = 0; s < d; s += 20) {
    const a = along(farm.yarnPath, s);
    thread.push(`${a.pt.x - Math.sin(a.angle) * (YARN_R - 3)} ${a.pt.y + Math.cos(a.angle) * (YARN_R - 3)}`);
  }
  const spin = (d / YARN_R) * (180 / Math.PI);
  return (
    <g>
      {thread.length > 1 && <path d={`M${thread.join(" L")}`} fill="none" stroke="#c1121f" strokeWidth="6" strokeLinecap="round" />}
      <g transform={`translate(${pt.x} ${pt.y}) rotate(${spin})`} stroke={INK} strokeLinecap="round">
        <circle r={YARN_R} fill="#e63946" strokeWidth="4" />
        <path d="M-24 -12 Q0 -30 24 -12 M-28 4 Q0 -14 28 4 M-22 18 Q0 4 22 18 M-8 -30 Q8 0 -6 30" fill="none" stroke="#a4161a" strokeWidth="3" />
      </g>
    </g>
  );
}

/** The cat: curled up asleep on the bale, then up with a jump and a meow, and a pat of her paw at the wool. */
function Cat({ farm, t }: { farm: Farm; t: number }) {
  const awake = t >= farm.tCatWake;
  const jump = 80 * Math.sin(Math.PI * seg(t, farm.tCatWake, farm.tCatWake + 0.5));
  const swat = Math.sin(Math.PI * seg(t, farm.tSwat - 0.2, farm.tSwat + 0.3));
  const fur = "#f4a261";
  if (!awake) {
    return (
      <g transform={`translate(${CAT.x} ${BALE.top})`} stroke={INK} strokeWidth="4" strokeLinejoin="round">
        <path d="M-60 -10 Q-80 -60 -30 -58" fill="none" stroke={fur} strokeWidth="14" strokeLinecap="round" />
        <ellipse cx="-6" cy="-30" rx="62" ry="32" fill={fur} />
        <g transform="translate(46 -26)">
          <path d="M-20 -14 L-22 -42 L-2 -24 Z M8 -24 L22 -42 L22 -12 Z" fill={fur} />
          <circle r="25" fill={fur} />
          <path d="M-12 -2 q6 5 12 0 M6 -2 q6 5 12 0" fill="none" strokeLinecap="round" strokeWidth="3" />
        </g>
      </g>
    );
  }
  return (
    <g transform={`translate(${CAT.x} ${BALE.top - jump})`} stroke={INK} strokeWidth="4" strokeLinejoin="round">
      <path d="M-52 -66 Q-96 -90 -76 -146" fill="none" stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <path d="M-52 -66 Q-96 -90 -76 -146" fill="none" stroke={fur} strokeWidth="11" strokeLinecap="round" />
      {[-40, -18, 24].map((x) => (
        <rect key={x} x={x - 9} y="-50" width="18" height="50" rx="8" fill={fur} />
      ))}
      <rect x="37" y="-50" width="18" height="50" rx="8" fill={fur} transform={`rotate(${-70 * swat} 46 -46)`} />
      <ellipse cx="0" cy="-62" rx="60" ry={28 + 6 * Math.sin(Math.PI * seg(t, farm.tCatWake, farm.tCatWake + 0.6))} fill={fur} />
      {[-30, -8, 14].map((x) => (
        <path key={x} d={`M${x} -88 q4 12 0 24`} fill="none" stroke="#d07a3a" strokeWidth="5" strokeLinecap="round" />
      ))}
      {[
        [-26, -70, 13],
        [6, -78, 11],
        [32, -60, 10],
      ].map(([x, y, r]) => (
        <ellipse key={x} cx={x} cy={y} rx={r} ry={r * 0.7} fill={MUD} stroke="none" />
      ))}
      <g transform="translate(60 -96)">
        <path d="M-22 -14 L-24 -46 L-2 -26 Z M10 -26 L26 -44 L24 -10 Z" fill={fur} />
        <circle r="28" fill={fur} />
        <circle cx="-6" cy="-6" r="7" fill="#fff" />
        <circle cx="14" cy="-6" r="7" fill="#fff" />
        <circle cx="-5" cy="-6" r="3.5" fill={INK} stroke="none" />
        <circle cx="15" cy="-6" r="3.5" fill={INK} stroke="none" />
        <ellipse cx="6" cy="8" rx="7" ry={2 + 5 * Math.sin(Math.PI * seg(t, farm.tCatWake, farm.tCatWake + 0.8))} fill="#8a3355" />
        <path d="M-30 6 h-18 M-30 12 l-16 6 M34 6 h18 M34 12 l16 6" strokeWidth="2" />
      </g>
    </g>
  );
}

/** The blobs of mud flying from the puddle onto the cat. */
function Mud({ farm, t }: { farm: Farm; t: number }) {
  return (
    <g>
      {farm.MUD_LAND.map((_, i) => {
        const p = farm.mudAt(i, t);
        return p && <circle key={i} cx={p.x} cy={p.y} r="15" fill={MUD} stroke={INK} strokeWidth="3" />;
      })}
    </g>
  );
}

/** The cow, side on, facing left: grazing until the wool bumps her nose, then her head goes up and she moos. */
function Cow({ farm, t }: { farm: Farm; t: number }) {
  const up = farm.cowHead(t);
  const mouth = Math.sin(Math.PI * seg(t, farm.tMoo, farm.tMoo + 1.1));
  const swish = 18 * Math.sin(Math.PI * 2 * seg(t, farm.tMoo, farm.tMoo + 1.1));
  const angle = -51 + 63 * up;
  return (
    <g transform={`translate(${COW.x} ${FLOOR})`} stroke={INK} strokeWidth="4" strokeLinejoin="round">
      <g transform={`rotate(${swish} 146 -184)`}>
        <path d="M146 -184 Q186 -150 172 -90" fill="none" />
        <path d="M172 -96 q-14 6 -6 28 q16 -2 16 -26 Z" fill={INK} />
      </g>
      {[-110, -64, 66, 112].map((x) => (
        <g key={x}>
          <rect x={x - 16} y="-110" width="32" height="110" rx="8" fill="#fff" />
          <rect x={x - 16} y="-18" width="32" height="18" rx="4" fill={INK} />
        </g>
      ))}
      <ellipse cx="40" cy="-86" rx="30" ry="18" fill={PINK} />
      <ellipse cx="0" cy="-160" rx="155" ry="76" fill="#fff" />
      <path d="M-60 -210 q40 -20 60 10 q-10 40 -50 30 q-30 -10 -10 -40 Z" fill={INK} />
      <path d="M60 -160 q40 -30 70 0 q0 40 -40 40 q-40 -10 -30 -40 Z" fill={INK} />
      <g transform={`rotate(${angle} -130 -150)`}>
        <ellipse cx="-165" cy="-155" rx="50" ry="38" fill="#fff" />
        <path d="M-222 -194 q-6 -16 6 -22 M-196 -196 q6 -18 18 -14" fill="none" stroke="#f1e3c3" strokeWidth="8" strokeLinecap="round" />
        <path d="M-180 -182 l-34 -24 l44 2 Z" fill="#fff" />
        <ellipse cx="-215" cy="-158" rx="52" ry="40" fill="#fff" />
        <path d="M-196 -196 q30 -2 28 30 q-20 4 -28 -30 Z" fill={INK} />
        <ellipse cx="-280" cy="-140" rx="30" ry="26" fill={PINK} />
        <circle cx="-290" cy="-146" r="4" fill={INK} stroke="none" />
        <circle cx="-272" cy="-146" r="4" fill={INK} stroke="none" />
        {up > 0.5 ? <circle cx="-226" cy="-170" r="6" fill={INK} stroke="none" /> : <path d="M-234 -168 q8 6 16 0" fill="none" strokeLinecap="round" />}
        <ellipse cx="-282" cy="-120" rx="16" ry={2 + 12 * mouth} fill="#8a3355" />
      </g>
    </g>
  );
}

/** Rings of the moo, rolling out over the meadow to the goat. */
function MooRings({ farm, t }: { farm: Farm; t: number }) {
  return (
    <g fill="none" stroke="#fff">
      {[0, 1, 2].map((i) => {
        const k = farm.mooRing(i, t);
        if (k <= 0 || k >= 1) return null;
        return <circle key={i} cx={MOO_MOUTH.x} cy={MOO_MOUTH.y} r={MOO_RING_R0 + MOO_RING_GROW * easeOut(k)} strokeWidth={14 * (1 - k) + 2} opacity={1 - k} />;
      })}
    </g>
  );
}

/** The goat's three stone steps, drawn once: the lower ones in front. */
const Rocks = memo(function Rocks() {
  return (
    <g stroke={INK} strokeWidth="4" strokeLinejoin="round">
      {ROCKS.map((r, i) => (
        <g key={r.x0}>
          <rect x={r.x0} y={r.top} width={r.x1 - r.x0} height={FLOOR - r.top + 6} rx="26" fill={i % 2 ? "#a7a9bd" : "#b9bbcd"} />
          <path d={`M${r.x0 + 26} ${r.top + 22} q24 -10 44 0`} fill="none" stroke="#dfe0ea" strokeWidth="6" strokeLinecap="round" />
          <path d={`M${r.x1 - 34} ${r.top + 40} l-12 22 l10 14`} fill="none" strokeWidth="3" strokeLinecap="round" />
          <path d={`M${r.x0 + 14} ${r.top + 6} q8 -16 16 0 q8 -14 14 2`} fill="#7cc94e" strokeWidth="3" />
        </g>
      ))}
    </g>
  );
});

/** A little yellow star circling over a dizzy head. */
function DizzyStar({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y - 12} L${x + 4} ${y - 4} L${x + 12} ${y} L${x + 4} ${y + 4} L${x} ${y + 12} L${x - 4} ${y + 4} L${x - 12} ${y} L${x - 4} ${y - 4} Z`}
      fill="#ffd60a"
    />
  );
}

/**
 * The goat, side on, looking right: dozing on the top step, up with a start at the moo, hopping down,
 * then horns forward at the milk can – a shake of the head after the first butt, stars after the second.
 */
function Goat({ farm, t }: { farm: Farm; t: number }) {
  const g = farm.goatAt(t);
  const running = (t >= farm.tCharge1 && t < farm.tButt1) || (t >= farm.tCharge && t < farm.tButt);
  const stride = running ? 26 * Math.sin(t * 24) : 0;
  const fur = "#f3efe6";
  const horn = "#c9a96e";
  return (
    <g transform={`translate(${g.pt.x} ${g.pt.y})`} stroke={INK} strokeWidth="4" strokeLinejoin="round">
      <path d="M-54 -88 l-16 -22 l12 2 Z" fill={fur} />
      {[-40, -22, 26, 44].map((x, i) => (
        <g key={x} transform={`rotate(${i % 2 ? stride : -stride} ${x} -56)`}>
          <rect x={x - 6} y="-56" width="12" height="56" rx="5" fill={fur} />
          <rect x={x - 6} y="-10" width="12" height="10" rx="3" fill="#5b4636" />
        </g>
      ))}
      <ellipse cx="0" cy="-80" rx="60" ry="32" fill={fur} />
      <ellipse cx="-14" cy="-66" rx="26" ry="9" fill="#e6dccb" stroke="none" />
      <g transform={`rotate(${44 * g.head + 9 * g.shake} 40 -94)`}>
        <path d="M30 -102 L56 -150 L80 -132 L58 -88 Z" fill={fur} />
        {[0, 10].map((dx) => (
          <g key={dx}>
            <path d={`M${58 + dx} -158 Q${50 + dx} -196 ${24 + dx} -186`} fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" />
            <path d={`M${58 + dx} -158 Q${50 + dx} -196 ${24 + dx} -186`} fill="none" stroke={horn} strokeWidth="7" strokeLinecap="round" />
          </g>
        ))}
        <ellipse cx="44" cy="-152" rx="20" ry="8" fill={fur} transform="rotate(-24 44 -152)" />
        <ellipse cx="76" cy="-146" rx="26" ry="21" fill={fur} transform="rotate(32 76 -146)" />
        <ellipse cx="92" cy="-128" rx="14" ry="12" fill="#eadbc8" />
        <circle cx="98" cy="-132" r="2.5" fill={INK} stroke="none" />
        <path d="M84 -116 l-4 26 l14 -22 Z" fill="#ddd3c3" />
        {g.awake ? (
          <>
            <circle cx="76" cy="-152" r="8" fill="#fff" strokeWidth="3" />
            <rect x="71" y="-153.5" width="10" height="3" rx="1.5" fill={INK} stroke="none" />
          </>
        ) : (
          <path d="M69 -152 q7 5 14 0" fill="none" strokeLinecap="round" strokeWidth="3" />
        )}
      </g>
      {g.dizzy > 0.05 &&
        [0, 1, 2].map((i) => {
          const a = t * 6 + i * 2.1;
          return (
            <g key={i} opacity={g.dizzy} strokeWidth="2.5">
              <DizzyStar x={70 + 44 * Math.cos(a)} y={-196 + 12 * Math.sin(a)} />
            </g>
          );
        })}
    </g>
  );
}

/** The milk can: it rocks after the goat's first butt, then tumbles over and over into the kennel. */
function MilkCan({ farm, t }: { farm: Farm; t: number }) {
  const { pt, angle } = farm.canAt(t);
  const rock = farm.canRock(t);
  const half = CAN.h / 2;
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${angle}) rotate(${rock} 0 ${half})`} stroke={INK} strokeWidth="4" strokeLinejoin="round">
      <rect x={-CAN.w / 2} y={-half + 26} width={CAN.w} height={CAN.h - 26} rx="8" fill="#d6dde3" />
      <path
        d={`M${-CAN.w / 2} ${-half + 30} Q${-CAN.w / 2} ${-half + 16} -15 ${-half + 12} H15 Q${CAN.w / 2} ${-half + 16} ${CAN.w / 2} ${-half + 30} Z`}
        fill="#d6dde3"
      />
      <rect x="-14" y={-half + 4} width="28" height="10" fill="#c3ccd3" />
      <rect x="-20" y={-half} width="40" height="9" rx="3" fill="#a9b4bd" />
      <rect x={-CAN.w / 2} y="2" width={CAN.w} height="12" fill="#e63946" />
      <path d={`M${-CAN.w / 2 - 2} ${-half + 34} q-12 10 0 20 M${CAN.w / 2 + 2} ${-half + 34} q12 10 0 20`} fill="none" strokeWidth="5" strokeLinecap="round" />
      <path d={`M${-CAN.w / 2 + 12} ${-half + 40} V${half - 16}`} stroke="#f4f7f9" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

/** The kennel: it shakes when the milk can bumps into it; before that the dog's sleepy head looks out of the door. */
function Kennel({ farm, t }: { farm: Farm; t: number }) {
  const shake = wobble(t - farm.tKennelHit, 5, 36, 4);
  const mid = (KENNEL.x0 + KENNEL.x1) / 2;
  return (
    <g transform={`rotate(${shake} ${mid} ${FLOOR})`} stroke={INK} strokeWidth="4" strokeLinejoin="round">
      <rect x={KENNEL.x0} y={KENNEL.top + 80} width={KENNEL.x1 - KENNEL.x0} height={FLOOR - KENNEL.top - 80} fill="#4ea8de" />
      <path d={`M${KENNEL.x0 - 24} ${KENNEL.top + 90} L${mid} ${KENNEL.top} L${KENNEL.x1 + 24} ${KENNEL.top + 90} Z`} fill={BARN_RED} />
      <path d={`M${mid - 48} ${FLOOR} V${FLOOR - 70} a48 48 0 0 1 96 0 V${FLOOR} Z`} fill="#2b2140" />
      {t < farm.tDog && (
        <g transform={`translate(${mid} ${FLOOR - 40})`}>
          <ellipse cx="-30" cy="0" rx="12" ry="26" fill="#6b3e26" />
          <circle r="30" fill="#b5835a" />
          <ellipse cx="0" cy="14" rx="16" ry="11" fill="#e8c9a0" />
          <circle cx="0" cy="8" r="5" fill={INK} stroke="none" />
          <path d="M-16 -8 q6 5 12 0 M4 -8 q6 5 12 0" fill="none" strokeLinecap="round" strokeWidth="3" />
        </g>
      )}
    </g>
  );
}

/** The dog: out of the kennel with a bark, running to the pond, then on to the barn, where he sings along. */
function Dog({ farm, t, still }: { farm: Farm; t: number; still: number }) {
  if (t < farm.tDog) return null;
  const d = farm.dogAt(t);
  const stride = d.running ? 30 * Math.sin(t * 18) : 0;
  const bob = d.running ? 6 * Math.abs(Math.sin(t * 18)) : 0;
  const barks = [farm.tDog, farm.tPond];
  const mouth = Math.max(farm.singing(3, t), ...barks.map((b) => Math.sin(Math.PI * seg(t, b, b + 0.4))));
  const wag = still > farm.tDog && still < farm.tDone ? 20 * Math.sin(still * 16) : 0;
  const fur = "#b5835a";
  return (
    <g transform={`translate(${d.x} ${FLOOR - bob})`} stroke={INK} strokeWidth="4" strokeLinejoin="round">
      <path d="M-56 -70 q-20 -30 -10 -50" fill="none" strokeWidth="10" strokeLinecap="round" transform={`rotate(${wag} -56 -70)`} />
      {[-40, 30].map((x, i) => (
        <g key={x}>
          <rect x={x - 22} y="-50" width="18" height="50" rx="8" fill={fur} transform={`rotate(${i ? stride : -stride} ${x - 13} -46)`} />
          <rect x={x} y="-50" width="18" height="50" rx="8" fill={fur} transform={`rotate(${i ? -stride : stride} ${x + 9} -46)`} />
        </g>
      ))}
      <ellipse cx="0" cy="-64" rx="64" ry="32" fill={fur} />
      <g transform="translate(60 -100)">
        <circle r="32" fill={fur} />
        <ellipse cx="30" cy="10" rx="22" ry="15" fill="#e8c9a0" />
        <circle cx="46" cy="4" r="6" fill={INK} stroke="none" />
        <circle cx="10" cy="-10" r="5" fill={INK} stroke="none" />
        <ellipse cx="30" cy="24" rx="12" ry={2 + 9 * mouth} fill="#8a3355" />
        <ellipse cx="-16" cy="4" rx="13" ry="28" fill="#6b3e26" transform="rotate(14 -16 -20)" />
      </g>
    </g>
  );
}

/**
 * The donkey, side on, facing left, his rump to the barn: his back gives under each duck landing on it, he stamps,
 * lifts his head for „I-aah“, and kicks the barn wall with his hind legs. At the end he sings along.
 */
function Donkey({ farm, t, still }: { farm: Farm; t: number; still: number }) {
  const d = farm.donkeyAt(t);
  const mouth = Math.max(d.mouth, farm.singing(5, t));
  const sway = still >= farm.tChoir ? 4 * Math.sin(still * 5 + 5) : 0;
  const grey = "#a39e9a";
  const light = "#e8e1d8";
  const { hip, pivot } = DONKEY;
  // The ears prick up with each duck and lie back while he brays.
  const ears = -1.6 * d.dip + 26 * d.head;
  return (
    <g transform={`translate(${DONKEY.x} ${FLOOR}) rotate(${d.tilt + sway} ${pivot.x} ${pivot.y})`} stroke={INK} strokeWidth="4" strokeLinejoin="round">
      <g transform={`rotate(${d.swing} ${hip.x} ${hip.y})`}>
        {[-12, 14].map((dx) => (
          <g key={dx}>
            <rect x={hip.x + dx - 11} y={hip.y} width="22" height={DONKEY.leg} rx="8" fill={grey} />
            <rect x={hip.x + dx - 11} y={hip.y + DONKEY.leg - 16} width="22" height="16" rx="4" fill={INK} />
          </g>
        ))}
      </g>
      {[-82, -50].map((x, i) => (
        <g key={x} transform={`rotate(${i ? 0 : 38 * d.stamp} ${x} -122)`}>
          <rect x={x - 11} y="-125" width="22" height="125" rx="8" fill={grey} />
          <rect x={x - 11} y="-16" width="22" height="16" rx="4" fill={INK} />
        </g>
      ))}
      <g transform={`translate(0 ${d.dip})`}>
        <path d="M108 -176 Q132 -136 120 -96" fill="none" strokeWidth="7" strokeLinecap="round" />
        <path d="M120 -104 q-12 6 -6 26 q16 -2 14 -26 Z" fill={INK} />
        <ellipse cx="0" cy={DONKEY.back.y} rx={DONKEY.back.rx} ry={DONKEY.back.ry} fill={grey} />
        <ellipse cx="-6" cy="-116" rx="74" ry="16" fill={light} stroke="none" />
        <path d="M-40 -198 q16 -8 30 0" fill="none" stroke="#5b5552" strokeWidth="5" strokeLinecap="round" />
        <g transform={`rotate(${10 * d.head} -88 -170)`}>
          <path d="M-60 -196 L-140 -262 L-172 -222 L-96 -134 Z" fill={grey} />
          <path
            d="M-64 -202 L-70 -222 L-80 -214 L-86 -234 L-96 -226 L-102 -246 L-112 -238 L-118 -258 L-128 -250 L-134 -270 L-140 -264"
            fill="none"
            stroke="#4a3b3b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* For „I-aah“ he throws his head back, nose up. */}
          <g transform={`rotate(${34 * d.head} -150 -240)`}>
            <ellipse cx="-142" cy="-300" rx="11" ry="44" fill={grey} transform={`rotate(${-14 + ears} -142 -262)`} />
            <ellipse cx="-122" cy="-296" rx="11" ry="44" fill={grey} transform={`rotate(${10 + ears} -122 -258)`} />
            <ellipse cx="-122" cy="-298" rx="5" ry="30" fill="#c9a3a8" stroke="none" transform={`rotate(${10 + ears} -122 -258)`} />
            <ellipse cx="-178" cy="-226" rx="60" ry="32" fill={grey} transform="rotate(-32 -178 -226)" />
            <ellipse cx="-222" cy="-196" rx="28" ry="24" fill={light} />
            <circle cx="-236" cy="-204" r="3.5" fill={INK} stroke="none" />
            <ellipse cx="-222" cy="-174" rx="13" ry={2 + 12 * mouth} fill="#8a3355" />
            {t >= farm.tLand(0) ? (
              <>
                <circle cx="-174" cy="-240" r="9" fill="#fff" strokeWidth="3" />
                <circle cx="-177" cy="-240" r="4" fill={INK} stroke="none" />
              </>
            ) : (
              <path d="M-182 -240 q8 5 16 0" fill="none" strokeLinecap="round" strokeWidth="3" />
            )}
          </g>
        </g>
      </g>
    </g>
  );
}

/** The duck pond further back in the meadow, with reeds. */
function Pond() {
  return (
    <g stroke={INK} strokeWidth="4">
      <ellipse cx={POND.x} cy={POND.y + 10} rx={POND.rx} ry={POND.ry} fill="#4fb3e8" />
      <ellipse cx={POND.x + 60} cy={POND.y + 20} rx="120" ry="12" fill="#8fd5ff" stroke="none" />
      {[-1, 1].map((side) =>
        [0, 22, 44].map((dx) => {
          const x = POND.x + side * (POND.rx - 30 + dx);
          return (
            <path key={`${side}${dx}`} d={`M${x} ${POND.y + 30} q${side * 6} -60 ${side * -4} -${90 + dx}`} fill="none" stroke="#3a7d2c" strokeWidth="6" />
          );
        }),
      )}
    </g>
  );
}

/** A duck, side on, looking right: on the pond, in the air with beating wings, on the donkey's back, with a somersault onto the barn roof, singing along at the end. */
function Duck({ farm, i, t, still }: { farm: Farm; i: number; t: number; still: number }) {
  const { pt, flying, spin } = farm.duckAt(i, t);
  const flap = flying ? 40 * Math.sin(t * 24 + i) : 0;
  const mouth = farm.singing(4, t);
  const bob = mouth * 4 * Math.sin(still * 12 + i);
  return (
    <g transform={`translate(${pt.x} ${pt.y - bob}) rotate(${spin} 0 -25) scale(1.4)`} stroke={INK} strokeWidth="3" strokeLinejoin="round">
      <path d="M-34 -22 L-48 -34 L-30 -12 Z" fill="#fff" />
      <ellipse cx="0" cy="-18" rx="36" ry="22" fill="#fff" />
      <path d="M-14 -24 q20 -12 34 4 q-16 12 -34 -4 Z" fill="#e9f2ff" transform={`rotate(${-flap} -6 -22)`} />
      <circle cx="26" cy="-46" r="17" fill="#fff" />
      <circle cx="31" cy="-50" r="3.5" fill={INK} stroke="none" />
      <path d="M40 -48 L58 -44 L40 -40 Z" fill={BEAK} />
      <path d="M40 -40 L56 -38 L40 -34 Z" fill={BEAK} transform={`rotate(${30 * mouth} 40 -40)`} />
      {!flying && t < farm.tTakeOff(i) && <ellipse cx="0" cy="-2" rx="46" ry="7" fill="#4fb3e8" stroke="#8fd5ff" strokeWidth="3" />}
    </g>
  );
}

/* ---------- The barn and its choir ---------- */

/** The barn: the stable inside with the horse, the sheep and the hen, and two doors that swing open. */
function Barn({ farm, t, still }: { farm: Farm; t: number; still: number }) {
  const open = farm.doorsOpen(t);
  const half = (BARN.door1 - BARN.door0) / 2;
  const doorH = FLOOR - BARN.doorTop;
  const swing = Math.cos(open * Math.PI * 0.94);
  // The donkey's kick shakes the whole barn.
  const shake = wobble(t - farm.tKick, 1.2, 26, 3.5);
  return (
    <g transform={`rotate(${shake} ${BARN_MID} ${FLOOR})`} stroke={INK} strokeWidth="5" strokeLinejoin="round">
      <rect x={BARN.x0} y={BARN.wallTop} width={BARN.x1 - BARN.x0} height={FLOOR - BARN.wallTop} fill={BARN_RED} />
      <path d={`M${BARN.x0 - 40} ${BARN.wallTop} L${BARN_MID} ${BARN.peak} L${BARN.x1 + 40} ${BARN.wallTop} Z`} fill="#7b2d26" />
      <circle cx={BARN_MID} cy={BARN.wallTop - 70} r="34" fill="#ffe8a3" />
      <path d={`M${BARN_MID - 34} ${BARN.wallTop - 70} H${BARN_MID + 34} M${BARN_MID} ${BARN.wallTop - 104} V${BARN.wallTop - 36}`} strokeWidth="4" />
      {/* Inside the stable. */}
      <rect x={BARN.door0} y={BARN.doorTop} width={BARN.door1 - BARN.door0} height={doorH} fill="#4a2c20" />
      <rect x={BARN.door0} y={FLOOR - 40} width={BARN.door1 - BARN.door0} height="40" fill="#f4c95d" stroke="none" />
      {open > 0 && (
        <>
          <Horse x={SINGERS[0].x} mouth={farm.singing(0, t)} sway={swayOf(farm, 0, still)} />
          <Sheep x={SINGERS[1].x} mouth={farm.singing(1, t)} sway={swayOf(farm, 1, still)} />
          <Hen x={SINGERS[2].x} mouth={farm.singing(2, t)} sway={swayOf(farm, 2, still)} />
        </>
      )}
      <rect x={BARN.door0} y={BARN.doorTop} width={BARN.door1 - BARN.door0} height={doorH} fill="none" stroke="#fff" strokeWidth="10" />
      {[
        { hinge: BARN.door0, dir: 1 },
        { hinge: BARN.door1, dir: -1 },
      ].map(({ hinge, dir }) => (
        <g key={hinge} transform={`translate(${hinge} ${BARN.doorTop}) scale(${swing * dir} 1)`}>
          <rect width={half} height={doorH} fill={BARN_RED} />
          <path d={`M0 0 L${half} ${doorH} M${half} 0 L0 ${doorH}`} stroke="#fff" strokeWidth="9" />
          <rect width={half} height={doorH} fill="none" stroke="#fff" strokeWidth="9" />
        </g>
      ))}
    </g>
  );
}

/** How a singer rocks from side to side while the choir sings. */
function swayOf(farm: Farm, i: number, still: number) {
  return still >= farm.tChoir ? 6 * Math.sin(still * 5 + i) : 0;
}

/** The horse looks over the stall, facing us. */
function Horse({ x, mouth, sway }: { x: number; mouth: number; sway: number }) {
  return (
    <g transform={`translate(${x} ${FLOOR - 120}) rotate(${sway})`} strokeWidth="4">
      <rect x="-36" y="-30" width="72" height="150" rx="20" fill="#a0522d" />
      <path d="M-30 -110 l-10 -30 l24 18 Z M30 -110 l10 -30 l-24 18 Z" fill="#a0522d" />
      <ellipse cx="0" cy="-60" rx="38" ry="64" fill="#a0522d" />
      <path d="M-14 -120 q14 -20 28 0 q-6 10 -14 4 q-8 6 -14 -4 Z" fill="#3b2314" />
      <ellipse cx="0" cy="-10" rx="30" ry="22" fill="#d9a77a" />
      <circle cx="-18" cy="-74" r="6" fill={INK} stroke="none" />
      <circle cx="18" cy="-74" r="6" fill={INK} stroke="none" />
      <ellipse cx="0" cy="2" rx="14" ry={2 + 10 * mouth} fill="#8a3355" />
    </g>
  );
}

/** A woolly sheep, facing us. */
function Sheep({ x, mouth, sway }: { x: number; mouth: number; sway: number }) {
  return (
    <g transform={`translate(${x} ${FLOOR - 40}) rotate(${sway})`} strokeWidth="4">
      {[-30, -10, 10, 30].map((dx) => (
        <rect key={dx} x={dx - 6} y="-10" width="12" height="40" fill={INK} />
      ))}
      {[-40, 0, 40, -24, 24].map((dx, i) => (
        <circle key={i} cx={dx} cy={i < 3 ? -40 : -78} r="34" fill="#fff" />
      ))}
      <ellipse cx="0" cy="-60" rx="56" ry="44" fill="#fff" stroke="none" />
      <ellipse cx="0" cy="-104" rx="26" ry="32" fill="#4a3b3b" />
      <path d="M-22 -118 l-24 -6 l22 18 Z M22 -118 l24 -6 l-22 18 Z" fill="#4a3b3b" />
      <circle cx="-10" cy="-112" r="5" fill="#fff" stroke="none" />
      <circle cx="10" cy="-112" r="5" fill="#fff" stroke="none" />
      <ellipse cx="0" cy="-88" rx="9" ry={2 + 8 * mouth} fill="#8a3355" stroke="none" />
    </g>
  );
}

/** A hen, facing us. */
function Hen({ x, mouth, sway }: { x: number; mouth: number; sway: number }) {
  return (
    <g transform={`translate(${x} ${FLOOR - 40}) rotate(${sway})`} strokeWidth="4">
      <path d="M-10 0 v28 M10 0 v28" stroke={BEAK} strokeWidth="6" />
      <ellipse cx="0" cy="-30" rx="44" ry="40" fill="#fff4e0" />
      <path d="M-14 -96 q2 -18 10 -4 q4 -18 10 -2 q6 -14 8 4 Z" fill="#e63946" />
      <circle cx="0" cy="-78" r="26" fill="#fff4e0" />
      <circle cx="-10" cy="-84" r="4" fill={INK} stroke="none" />
      <circle cx="10" cy="-84" r="4" fill={INK} stroke="none" />
      <path d="M-8 -74 L0 -60 L8 -74 Z" fill="#ffb703" />
      <path d="M-6 -66 L0 -56 L6 -66 Z" fill="#ffb703" transform={`translate(0 ${10 * mouth})`} />
    </g>
  );
}

/** Notes rising from the singers: from each one as it sings alone, then from everyone in the choir. */
function ChoirNotes({ farm, t }: { farm: Farm; t: number }) {
  if (t < 0 || t >= farm.tDone) return null;
  const from = [
    { x: SINGERS[0].x, y: FLOOR - 230 },
    { x: SINGERS[1].x, y: FLOOR - 170 },
    { x: SINGERS[2].x, y: FLOOR - 150 },
    { x: DOG_END + 70, y: FLOOR - 160 },
    { x: BARN_MID, y: BARN.peak - 80 },
    { x: DONKEY.x - 200, y: FLOOR - 330 },
  ];
  return (
    <g>
      {from.map((p, i) => {
        const level = farm.singing(i, t);
        if (level <= 0.05) return null;
        return [0, 1, 2].map((j) => {
          const k = (t * 0.7 + j / 3 + i * 0.17) % 1;
          return (
            <Note
              key={`${i}${j}`}
              x={p.x + 40 * Math.sin(k * 6 + j * 2) + (j - 1) * 30}
              y={p.y - 220 * k}
              size={1.4}
              color={BAR_COLORS[(i * 3 + j) % BAR_COLORS.length]}
              opacity={level * Math.sin(Math.PI * k)}
            />
          );
        });
      })}
    </g>
  );
}
