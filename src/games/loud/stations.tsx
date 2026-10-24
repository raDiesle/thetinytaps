import { useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
import { BRIGHT_COLORS } from "@/components/Bursts";
import { playCountNote, playDing, playPuff } from "@/lib/sfx";
import { Lion, Mouse, Tuft } from "./animals";

// The pictures of the blowing level. Each one gets the wind (0–1) on every
// frame and says when it is all blown.

/** Each frame: how strong the wind blows (0–1) and the seconds since the last frame. */
export type Step = (wind: number, dt: number) => void;

export interface StationProps {
  /** The picture puts its frame handler here. */
  step: RefObject<Step | null>;
  /** All blown; the party follows after `pause` ms. */
  done: (pause?: number) => void;
  /** Plays a sound; the microphone stays deaf for `ms`, so the game doesn't blow on its own. */
  sound: (play: () => void, ms?: number) => void;
}

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** A little colourful garland across the top of the picture. */
function Garland({ y }: { y: number }) {
  return (
    <g>
      <path d={`M-40 ${y} Q500 ${y + 70} 1040 ${y}`} stroke="#8d5a2b" strokeWidth="3" fill="none" />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 30 + i * 70;
        // On the curve of the string: it sags 35 below `y` in the middle.
        const t = (x + 40) / 1080;
        const top = y + 140 * t * (1 - t) - 2;
        return <path key={i} d={`M${x - 22} ${top} L${x + 22} ${top} L${x} ${top + 42} Z`} fill={BRIGHT_COLORS[i % BRIGHT_COLORS.length]} />;
      })}
    </g>
  );
}

// ---------- Kerzen ausblasen ----------

const CANDLE_X = [434, 478, 522, 566];
const CANDLE_COLORS = ["#4cc9f0", "#ffb703", "#80ed99", "#ff7bd0"];
/** Wind below this only makes the flames flicker. */
const CANDLE_FROM_WIND = 0.3;
/** This much wind above CANDLE_FROM_WIND, in seconds, blows out one candle: about a tap or a short puff. */
const CANDLE_BREATH = 0.15;
const CANDLE_BREATH_FADE_PER_S = 0.2;

/** A birthday cake with four candles; each strong puff blows out one. */
export function Candles({ step, done, sound }: StationProps) {
  const [out, setOut] = useState<boolean[]>(() => CANDLE_X.map(() => false));
  const outRef = useRef(out);
  const breath = useRef(0);

  step.current = (wind, dt) => {
    breath.current = Math.max(0, breath.current + (wind > CANDLE_FROM_WIND ? wind - CANDLE_FROM_WIND : -CANDLE_BREATH_FADE_PER_S) * dt);
    if (breath.current < CANDLE_BREATH) return;
    breath.current = 0;
    const lit = outRef.current.flatMap((o, i) => (o ? [] : [i]));
    if (!lit.length) return;
    const next = outRef.current.slice();
    next[pick(lit)] = true;
    outRef.current = next;
    setOut(next);
    sound(playPuff, 700);
    if (lit.length === 1) done();
  };

  return (
    <g>
      <rect x="-1000" y="-1000" width="3000" height="1560" fill="#ffe8cc" />
      <rect x="-1000" y="560" width="3000" height="440" fill="#d9a36a" />
      <Garland y={40} />

      {/* The table */}
      <rect x="230" y="472" width="540" height="22" rx="8" fill="#b5651d" />
      <rect x="270" y="494" width="20" height="70" fill="#9c541a" />
      <rect x="710" y="494" width="20" height="70" fill="#9c541a" />

      <g className="bl-target">
        <ellipse cx="500" cy="470" rx="190" ry="16" fill="#fff" stroke="#e0d6c8" strokeWidth="4" />
        <rect x="350" y="380" width="300" height="88" rx="18" fill="#f4a3b4" />
        <path d="M350 400 Q350 380 370 380 H630 Q650 380 650 400 V408 Q630 426 612 408 Q594 426 576 408 Q558 426 540 408 Q522 426 504 408 Q486 426 468 408 Q450 426 432 408 Q414 426 396 408 Q378 426 360 408 Q354 404 350 408 Z" fill="#fff" />
        <rect x="400" y="300" width="200" height="82" rx="16" fill="#9b5de5" />
        <path d="M400 318 Q400 300 416 300 H584 Q600 300 600 318 V324 Q585 340 570 324 Q555 340 540 324 Q525 340 510 324 Q495 340 480 324 Q465 340 450 324 Q435 340 420 324 Q408 336 400 326 Z" fill="#fff" />
        {[380, 440, 500, 560, 620].map((x) => (
          <circle key={x} cx={x} cy="446" r="9" fill="#d62828" />
        ))}
        {CANDLE_X.map((x, i) => (
          <g key={x}>
            <rect x={x - 8} y="232" width="16" height="70" rx="5" fill={CANDLE_COLORS[i]} />
            <path d={`M${x - 8} 250 l16 -8 M${x - 8} 270 l16 -8 M${x - 8} 290 l16 -8`} stroke="#ffffffaa" strokeWidth="4" />
            <path d={`M${x} 232 v-8`} stroke="#333" strokeWidth="3" strokeLinecap="round" />
            <g transform={`translate(${x} 226)`}>
              {out[i] ? (
                <path className="bl-smoke" d="M0 0 q-10 -14 0 -28 q10 -14 0 -28 q-10 -14 0 -26" stroke="#9a9aa8" strokeWidth="5" fill="none" strokeLinecap="round" />
              ) : (
                <g className="bl-flame">
                  <circle cy="-20" r="26" fill="#ffd16655" />
                  <g className="bl-flame-flicker" style={{ animationDelay: `${-i * 0.13}s` }}>
                    <path d="M0 0 C-14 -8 -12 -30 0 -50 C12 -30 14 -8 0 0 Z" fill="#ff8c42" />
                    <path d="M0 -2 C-7 -6 -6 -20 0 -32 C6 -20 7 -6 0 -2 Z" fill="#ffe066" />
                  </g>
                </g>
              )}
            </g>
          </g>
        ))}
      </g>

      {/* The mouse with a party hat is waiting for the cake. */}
      <g transform="translate(150 562) scale(1.3)">
        <ellipse cx="0" cy="2" rx="48" ry="8" fill="#00000018" />
        <g className="bl-cheer">
          <Mouse />
          <path d="M-20 -136 L0 -196 L20 -136 Z" fill="#ffb703" />
          <path d="M-14 -152 L14 -152 M-8 -170 L8 -170" stroke="#ff5d73" strokeWidth="5" />
          <circle cx="0" cy="-198" r="8" fill="#ff5d73" />
        </g>
      </g>
    </g>
  );
}

// ---------- Pusteblume ----------

const SEEDS = 26;
const HEAD = { x: 500, y: 250 };
/** Wind below this only makes the dandelion sway. */
const SEED_FROM_WIND = 0.15;
const SEEDS_PER_S = 22;
/** After the last seed, until they have flown out of the picture. */
const SEEDS_FLY_MS = 2400;

interface Flight {
  dx: number;
  dy: number;
  seconds: number;
}

/** A dandelion clock; blowing sends its little parachutes flying. */
export function Dandelion({ step, done }: StationProps) {
  const seeds = useMemo(
    () => Array.from({ length: SEEDS }, (_, i) => ({ angle: (i * 360) / SEEDS + Math.random() * 8 - 4, length: 72 + Math.random() * 14 })),
    [],
  );
  const [flights, setFlights] = useState<(Flight | null)[]>(() => seeds.map(() => null));
  const flightsRef = useRef(flights);
  const due = useRef(0);

  step.current = (wind, dt) => {
    due.current += Math.max(0, wind - SEED_FROM_WIND) * dt * SEEDS_PER_S;
    if (due.current < 1) return;
    const left = flightsRef.current.flatMap((f, i) => (f ? [] : [i]));
    if (!left.length) return;
    const next = flightsRef.current.slice();
    for (; due.current >= 1 && left.length; due.current--) {
      const i = left.splice(Math.floor(Math.random() * left.length), 1)[0];
      const a = (seeds[i].angle * Math.PI) / 180;
      next[i] = {
        dx: Math.sin(a) * 320 + Math.random() * 300 - 150,
        dy: -Math.cos(a) * 180 - 220 - Math.random() * 220,
        seconds: 2.4 + Math.random() * 1.4,
      };
    }
    due.current = Math.min(due.current, 1);
    flightsRef.current = next;
    setFlights(next);
    if (!left.length) done(SEEDS_FLY_MS);
  };

  const seed = (i: number) => {
    const { angle, length } = seeds[i];
    return (
      <g transform={`rotate(${angle})`}>
        <path d={`M0 -10 L0 ${-length + 12}`} stroke="#f4f1e6" strokeWidth="2.5" />
        {[-60, -30, 0, 30, 60].map((d) => (
          <path
            key={d}
            d={`M0 ${-length + 12} l${Math.sin((d * Math.PI) / 180) * 16} ${-Math.cos((d * Math.PI) / 180) * 16}`}
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}
        <ellipse cy="-8" rx="2.5" ry="5" fill="#8d6e3f" />
      </g>
    );
  };

  return (
    <g>
      <rect x="-1000" y="-1000" width="3000" height="1600" fill="url(#bl-sky)" />
      <defs>
        <linearGradient id="bl-sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="600">
          <stop offset="0" stopColor="#5fb4e8" />
          <stop offset="1" stopColor="#bfe6ff" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="100" r="54" fill="#ffd166" />
      <path d="M-1000 520 H0 Q250 490 500 515 T1000 505 H2000 V600 H-1000 Z" fill="#7cb15a" />
      {[120, 300, 700, 880].map((x) => (
        <Tuft key={x} x={x} y={530} />
      ))}
      {[200, 780, 850].map((x, i) => (
        <g key={x} transform={`translate(${x} ${540 - i * 6})`}>
          <path d="M0 0 V-40" stroke="#4f772d" strokeWidth="5" />
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cy="-52" rx="7" ry="13" transform={`rotate(${r} 0 -40)`} fill={i === 1 ? "#ff7bd0" : "#ffe066"} />
          ))}
          <circle cy="-40" r="7" fill="#ff8c42" />
        </g>
      ))}

      <g className="bl-target">
        <g className="bl-sway" style={{ transformOrigin: "500px 520px" }}>
          <path d={`M500 525 Q480 400 ${HEAD.x} ${HEAD.y + 12}`} stroke="#5a8f3a" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M496 470 Q440 440 420 470 Q450 470 496 485 Z M500 430 Q560 400 585 420 Q555 432 500 445 Z" fill="#6a994e" />
          <g transform={`translate(${HEAD.x} ${HEAD.y})`}>
            {seeds.map((_, i) => !flights[i] && <g key={i}>{seed(i)}</g>)}
            <circle r="13" fill="#c9b27c" />
            <circle r="7" fill="#a68a55" />
          </g>
        </g>
      </g>

      <g transform={`translate(${HEAD.x} ${HEAD.y})`}>
        {flights.map(
          (f, i) =>
            f && (
              <g
                key={i}
                className="bl-seed-fly"
                style={{ "--dx": `${f.dx}px`, "--dy": `${f.dy}px`, animationDuration: `${f.seconds}s` } as CSSProperties}
              >
                {seed(i)}
              </g>
            ),
        )}
      </g>
    </g>
  );
}

// ---------- Windrad ----------

const BLADE_COLORS = ["#ff5d73", "#ffb703", "#00b4d8", "#3ec300"];
const RAINBOW = ["#e63946", "#f77f00", "#fcbf49", "#80b918", "#4895ef", "#8e7dff"];
const MAX_SPEED_DEG_PER_S = 1000;
/** The pinwheel picks up quickly and coasts for a while, like a real one. */
const SPIN_UP_PER_S = 3;
const SPIN_DOWN_PER_S = 0.7;
/** Every two turns paint one more band of the rainbow. */
const TURNS_PER_BAND = 2;
const PIN = { x: 500, y: 290 };

/** A pinwheel on a stick; the more it turns, the more of the rainbow behind it shows. */
export function Pinwheel({ step, done, sound }: StationProps) {
  const [bands, setBands] = useState(0);
  const rotorRef = useRef<SVGGElement>(null);
  const spin = useRef({ angle: 0, speed: 0, turns: 0, bands: 0 });

  step.current = (wind, dt) => {
    const s = spin.current;
    const target = wind * MAX_SPEED_DEG_PER_S;
    s.speed += (target - s.speed) * Math.min(1, dt * (target > s.speed ? SPIN_UP_PER_S : SPIN_DOWN_PER_S));
    s.angle = (s.angle + s.speed * dt) % 360;
    s.turns += (s.speed * dt) / 360;
    rotorRef.current?.setAttribute("transform", `rotate(${s.angle.toFixed(1)})`);
    const nextBands = Math.min(RAINBOW.length, Math.floor(s.turns / TURNS_PER_BAND));
    if (nextBands <= s.bands) return;
    s.bands = nextBands;
    setBands(nextBands);
    sound(() => playCountNote(nextBands - 1), 350);
    if (nextBands === RAINBOW.length) done();
  };

  return (
    <g>
      <rect x="-1000" y="-1000" width="3000" height="1600" fill="#9ad8ff" />
      <g fill="#fff">
        <ellipse cx="160" cy="120" rx="70" ry="26" />
        <ellipse cx="200" cy="100" rx="50" ry="30" />
        <ellipse cx="840" cy="90" rx="64" ry="24" />
        <ellipse cx="880" cy="74" rx="42" ry="26" />
      </g>
      {RAINBOW.map((color, i) => {
        const r = 400 - i * 24;
        return (
          i < bands && (
            <path
              key={color}
              className="bl-band"
              d={`M${500 - r} 540 A${r} ${r} 0 0 1 ${500 + r} 540`}
              pathLength={1}
              stroke={color}
              strokeWidth="25"
              fill="none"
            />
          )
        );
      })}
      <path d="M-1000 530 H0 Q300 505 600 528 T1000 520 H2000 V600 H-1000 Z" fill="#7cb15a" />
      {[90, 260, 740, 920].map((x) => (
        <Tuft key={x} x={x} y={545} />
      ))}

      <rect x="493" y={PIN.y} width="14" height={548 - PIN.y} rx="6" fill="#fff" stroke="#c9c2b8" strokeWidth="2" />
      <path d={`M493 ${PIN.y + 40} l14 -12 M493 ${PIN.y + 100} l14 -12 M493 ${PIN.y + 160} l14 -12 M493 ${PIN.y + 220} l14 -12`} stroke="#ff5d73" strokeWidth="6" />
      <g className="bl-target">
        <g transform={`translate(${PIN.x} ${PIN.y})`}>
          <g ref={rotorRef}>
            {BLADE_COLORS.map((color, i) => (
              <g key={color} transform={`rotate(${i * 90})`}>
                <path d="M0 0 L-4 -128 Q66 -124 84 -46 Z" fill={color} stroke="#00000022" strokeWidth="2" />
                <path d="M0 0 L84 -46 Q46 -40 22 -10 Z" fill="#ffffff55" />
              </g>
            ))}
          </g>
          <circle r="13" fill="#fff" stroke="#c9c2b8" strokeWidth="3" />
        </g>
      </g>
    </g>
  );
}

// ---------- Segelboot ----------

const BOAT_START_X = 150;
const BOAT_END_X = 700;
const BOAT_PX_PER_S = 170;
const SEA_Y = 440;

/** The mouse sails across the sea to the lion on his island. */
export function Boat({ step, done, sound }: StationProps) {
  const boatRef = useRef<SVGGElement>(null);
  const x = useRef(BOAT_START_X);
  const [arrived, setArrived] = useState(false);

  step.current = (wind, dt) => {
    if (x.current >= BOAT_END_X) return;
    x.current = Math.min(BOAT_END_X, x.current + wind * BOAT_PX_PER_S * dt);
    boatRef.current?.setAttribute("transform", `translate(${x.current.toFixed(1)} ${SEA_Y})`);
    if (x.current < BOAT_END_X) return;
    setArrived(true);
    sound(playDing, 1400);
    done();
  };

  const waves = (y: number, color: string, className: string) => (
    <path
      className={className}
      d={`M-1000 ${y} ${Array.from({ length: 40 }, () => "q20 -14 40 0 q20 14 40 0").join(" ")} V600 H-1000 Z`}
      fill={color}
    />
  );

  return (
    <g className={arrived ? "bl-arrived" : undefined}>
      <rect x="-1000" y="-1000" width="3000" height="1600" fill="#a8dcff" />
      <circle cx="860" cy="100" r="54" fill="#ffd166" />
      <g fill="#fff">
        <ellipse cx="240" cy="110" rx="70" ry="24" />
        <ellipse cx="280" cy="92" rx="44" ry="28" />
      </g>

      {/* The lion's island */}
      <ellipse cx="960" cy={SEA_Y + 6} rx="190" ry="54" fill="#f2d49b" />
      <path d="M990 404 Q1000 330 975 270" stroke="#8d5a2b" strokeWidth="14" fill="none" strokeLinecap="round" />
      {[-70, -20, 30, 80, 130].map((r) => (
        <ellipse key={r} cx="975" cy="240" rx="70" ry="16" fill="#4f9d3a" transform={`rotate(${r} 975 270)`} />
      ))}
      <g transform="translate(890 402) scale(0.38)">
        <g className="bl-cheer">
          <Lion />
        </g>
      </g>

      {waves(SEA_Y, "#3a9bdc", "bl-wave")}

      <g ref={boatRef} transform={`translate(${BOAT_START_X} ${SEA_Y})`}>
        <g className="bl-target">
          <g className="bl-boat-bob">
            <g className="bl-foam" fill="#fff">
              <ellipse cx="-110" cy="18" rx="26" ry="7" />
              <ellipse cx="-150" cy="22" rx="18" ry="5" />
              <ellipse cx="-180" cy="16" rx="12" ry="4" />
            </g>
            <path d="M0 -12 V-178" stroke="#8d5a2b" strokeWidth="7" strokeLinecap="round" />
            <path className="bl-flag" d="M0 -178 L34 -168 L0 -158 Z" fill="#ff5d73" />
            <g className="bl-sail">
              <path d="M6 -170 Q70 -100 104 -24 L6 -24 Z" fill="#fff" stroke="#d8d2c8" strokeWidth="3" />
              <path d="M6 -110 Q48 -80 74 -60 L6 -60 Z" fill="#4cc9f0" opacity="0.6" />
            </g>
            <path d="M-6 -150 Q-40 -90 -66 -24 L-6 -24 Z" fill="#fff4d6" stroke="#d8d2c8" strokeWidth="3" />
            <g transform="translate(-36 -6) scale(0.42)">
              <Mouse />
            </g>
            <path d="M-100 -14 H104 L76 30 H-74 Z" fill="#e63946" />
            <path d="M-92 -2 H96" stroke="#fff" strokeWidth="6" />
          </g>
        </g>
      </g>

      {waves(SEA_Y + 50, "#2f86c4", "bl-wave bl-wave-front")}
    </g>
  );
}
