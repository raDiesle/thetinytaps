import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import {
  playBaa,
  playBlub,
  playBoing,
  playBuzz,
  playChatter,
  playCoo,
  playHiss,
  playHoot,
  playMeow,
  playMoo,
  playMunch,
  playNeigh,
  playPop,
  playRoar,
  playRumble,
  playSnap,
  playSniff,
  playSqueak,
  playSquawk,
  playTrumpet,
  playTweet,
  playTwinkle,
  playWhale,
} from "@/lib/sfx";

const INK = "#2a1e5c";
const PINK = "#ffb3c1";
const BEAK = "#ff9f1c";
const IVORY = "#f1e3c8";

/** The letter comes alive this long after it appears, and stays an animal for this long. */
const WAKE_MS = 700;
const ALIVE_MS = 3200;

// The animals are drawn in hundredths of an em, like the letter they sit on:
// y = 0 is the top of a capital, y = 70 the baseline, x = 50 the middle.
// The letters are strokes as thick as the stems of the bold rounded font,
// so the drawn letter lies right on top of the real one.

type Point = [number, number];

/** Centre for a part's rotation or squash, in the drawing's units. */
const at = ([x, y]: Point): CSSProperties => ({ transformOrigin: `${x}px ${y}px` });

const edge = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" } as const;

/** A part that moves on its own while the letter is alive; see `.ll-*` in globals.css. */
function Moving({ move, origin, delay, children }: { move: string; origin: Point; delay?: number; children: ReactNode }) {
  return (
    <g className={`ll-${move}`} style={{ ...at(origin), animationDelay: delay ? `${delay}s` : undefined }}>
      {children}
    </g>
  );
}

/** A line with an ink edge: legs, tails, trunks. */
function Limb({ d, color, width = 6 }: { d: string; color: string; width?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={width + 5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

/** A thin ink line: antennae, whiskers, mouths. */
function Line({ d, width = 2.5 }: { d: string; width?: number }) {
  return <path d={d} fill="none" stroke={INK} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />;
}

/** An eye that blinks now and then; `ring` gives it a coloured iris, like an owl's. */
function Eye({ x, y, r = 5, ring }: { x: number; y: number; r?: number; ring?: string }) {
  return (
    <g className="ll-eye" style={at([x, y])}>
      <circle cx={x} cy={y} r={r} fill={ring ?? "#fff"} stroke={INK} strokeWidth={Math.max(1.6, r * 0.28)} />
      {ring && <circle cx={x} cy={y} r={r * 0.62} fill="#fff" />}
      <circle cx={x} cy={y + r * 0.15} r={r * 0.42} fill={INK} />
    </g>
  );
}

/** A small tooth at (x, y), pointing along (nx, ny). */
function Tooth({ x, y, nx, ny }: { x: number; y: number; nx: number; ny: number }) {
  const [px, py] = [-ny * 3, nx * 3];
  return <path d={`M ${x + px} ${y + py} L ${x + nx * 6} ${y + ny * 6} L ${x - px} ${y - py} Z`} fill="#fff" {...edge} strokeWidth={1.8} />;
}

interface Segment {
  d: string;
  /** Moves on its own, like a jaw or a wing. */
  move?: string;
  origin?: Point;
  /** Drawn on top of this segment and moving with it. */
  extra?: ReactNode;
}

interface Animal {
  /** Who the letter turns into; read out to screen readers. */
  name: string;
  /** The letter's colour while it is the animal. */
  color: string;
  /** The letter as strokes; parts that move on their own are segments of their own. */
  body: (string | Segment)[];
  /** Stripes or spots along the letter: dashes, or dots with a dash of 0. */
  pattern?: { color: string; width: number; dash: string };
  /** Parts behind the letter (ears, wings, tails) and in front of it (eyes, noses). */
  back?: ReactNode;
  front?: ReactNode;
  /** How the whole animal moves; see `.ll-move-*` in globals.css. */
  move?: string;
  sound: () => void;
}

/** One animal per letter, mostly one whose name starts with it; the shape of the letter is part of the animal. */
const ANIMALS: Record<string, Animal> = {
  A: {
    name: "Affe",
    color: "#b07d56",
    body: ["M 24 61 L 50 10 L 76 61 M 35 45 H 65"],
    back: (
      <>
        <circle cx={34} cy={8} r={8} fill="#b07d56" {...edge} />
        <circle cx={34} cy={8} r={4} fill="#f2c9a0" />
        <circle cx={66} cy={8} r={8} fill="#b07d56" {...edge} />
        <circle cx={66} cy={8} r={4} fill="#f2c9a0" />
        <Moving move="wag" origin={[76, 58]}>
          <Limb d="M 76 58 C 92 58 96 40 87 35 C 80 32 76 40 82 43" color="#b07d56" width={5} />
        </Moving>
      </>
    ),
    front: (
      <>
        <ellipse cx={50} cy={14} rx={12} ry={10} fill="#f2c9a0" {...edge} />
        <Eye x={45.5} y={12} r={3.8} />
        <Eye x={54.5} y={12} r={3.8} />
        <Line d="M 46 19 Q 50 22 54 19" width={2} />
      </>
    ),
    move: "hop",
    sound: playChatter,
  },
  B: {
    name: "Biene",
    color: "#ffd23f",
    body: ["M 32 10 V 61 H 54 C 66 61 69 54 69 47.5 C 69 41 65 35 54 35 H 32 M 32 10 H 51 C 61 10 65 16 65 22.5 C 65 29 61 35 51 35"],
    pattern: { color: INK, width: 11, dash: "5 6" },
    back: (
      <>
        <Moving move="flap" origin={[48, 4]}>
          <ellipse cx={40} cy={-6} rx={8} ry={12} transform="rotate(-25 40 -6)" fill="#e3f6ff" fillOpacity={0.9} {...edge} />
          <ellipse cx={57} cy={-7} rx={8} ry={12} transform="rotate(25 57 -7)" fill="#e3f6ff" fillOpacity={0.9} {...edge} />
        </Moving>
        <Line d="M 30 4 Q 26 -6 20 -9" />
        <circle cx={20} cy={-9} r={3} fill={INK} />
        <path d="M 26 58 L 13 64 L 26 68 Z" fill={INK} {...edge} />
      </>
    ),
    front: (
      <>
        <Eye x={48} y={22} r={4.5} />
        <Line d="M 44 47 Q 50 52 56 47" />
      </>
    ),
    move: "fly",
    sound: playBuzz,
  },
  C: {
    name: "Chamäleon",
    color: "#52b788",
    body: ["M 67 15 A 23 27 0 1 0 67 57"],
    pattern: { color: "#b7e4c7", width: 4, dash: "0 9" },
    back: (
      <>
        <Limb d="M 40 62 L 36 74" color="#52b788" />
        <Limb d="M 58 62 L 61 74" color="#52b788" />
        <Limb d="M 67 57 C 82 60 85 49 79 45 C 75 43 72 47 75 50" color="#52b788" width={5} />
      </>
    ),
    front: (
      <>
        <Moving move="tongue" origin={[62, 33]}>
          <path d="M 62 33 H 90" stroke="#ff5d73" strokeWidth={4} strokeLinecap="round" />
          <circle cx={91} cy={33} r={4.5} fill="#ff5d73" {...edge} strokeWidth={2} />
        </Moving>
        <Eye x={47} y={5} r={6.5} />
      </>
    ),
    move: "sway",
    sound: playPop,
  },
  D: {
    name: "Dino",
    color: "#80b918",
    body: ["M 29 10 V 61 H 44 C 63 61 72 50 72 35.5 C 72 21 63 10 44 10 Z"],
    back: (
      <>
        {(
          [
            [40, 1, 0],
            [58, 3, 20],
            [73, 12, 50],
            [80, 28, 80],
            [79, 46, 110],
          ] as const
        ).map(([x, y, turn]) => (
          <path key={x} d={`M ${x - 6} ${y + 2} L ${x} ${y - 10} L ${x + 6} ${y + 2} Z`} transform={`rotate(${turn} ${x} ${y})`} fill="#f77f00" {...edge} />
        ))}
        <Limb d="M 30 58 Q 15 66 6 55" color="#80b918" width={9} />
        <Limb d="M 38 63 V 74" color="#80b918" width={8} />
        <Limb d="M 57 61 V 74" color="#80b918" width={8} />
      </>
    ),
    front: (
      <>
        <Eye x={47} y={26} r={5.5} />
        <Line d="M 42 41 Q 50 47 58 41" />
      </>
    ),
    move: "stomp",
    sound: playRoar,
  },
  E: {
    name: "Elefant",
    color: "#9aa5b8",
    body: ["M 70 10 H 33 V 61 H 70 M 33 35.5 H 64"],
    back: (
      <>
        <Moving move="ear" origin={[33, 30]}>
          <ellipse cx={21} cy={30} rx={13} ry={17} fill="#9aa5b8" {...edge} />
          <ellipse cx={21} cy={30} rx={7} ry={10} fill={PINK} />
        </Moving>
        <Moving move="trunk" origin={[64, 35.5]}>
          <Limb d="M 62 35.5 C 76 35.5 80 44 78 52 C 77 57 81 61 86 57" color="#9aa5b8" width={9} />
        </Moving>
      </>
    ),
    front: <Eye x={50} y={23} r={4.5} />,
    move: "sway",
    sound: playTrumpet,
  },
  F: {
    name: "Fisch",
    color: "#f8961e",
    body: ["M 69 10 H 32 V 61 M 32 37 H 63"],
    back: (
      <>
        <Moving move="wag" origin={[32, 60]}>
          <path d="M 32 58 L 18 77 Q 32 71 46 77 Z" fill="#f8961e" {...edge} />
        </Moving>
        {[0, 0.4, 0.8].map((delay, i) => (
          <Moving key={delay} move="rise" origin={[80, -2]} delay={delay}>
            <circle cx={78 + i * 4} cy={-2 - i * 3} r={3 + i} fill="none" stroke="#4cc9f0" strokeWidth={2.5} />
          </Moving>
        ))}
      </>
    ),
    front: (
      <>
        <Eye x={47} y={23.5} r={4.5} />
        <Line d="M 72 13 Q 75 16 72 19" />
      </>
    ),
    move: "sway",
    sound: playBlub,
  },
  G: {
    name: "Glühwürmchen",
    color: "#7b5ea7",
    body: ["M 68 16 A 23 27 0 1 0 73 39 H 54"],
    back: (
      <>
        <Moving move="flap" origin={[50, 2]}>
          <ellipse cx={42} cy={-7} rx={8} ry={12} transform="rotate(-25 42 -7)" fill="#e3f6ff" fillOpacity={0.9} {...edge} />
          <ellipse cx={58} cy={-8} rx={8} ry={12} transform="rotate(25 58 -8)" fill="#e3f6ff" fillOpacity={0.9} {...edge} />
        </Moving>
        <Line d="M 70 12 Q 74 2 82 -2" />
        <circle cx={82} cy={-2} r={3} fill={INK} />
        <Moving move="glow" origin={[56, 39]}>
          <circle cx={56} cy={39} r={15} fill="#ffe066" opacity={0.75} />
        </Moving>
      </>
    ),
    front: (
      <>
        <Moving move="glow" origin={[56, 39]}>
          <circle cx={56} cy={39} r={6} fill="#fff3b0" />
        </Moving>
        <Eye x={40} y={26} r={4.5} />
        <Eye x={51} y={24} r={4.5} />
      </>
    ),
    move: "fly",
    sound: playTwinkle,
  },
  H: {
    name: "Hase",
    color: "#d6c3a5",
    body: ["M 29 10 V 61 M 71 10 V 61 M 29 36 H 71"],
    back: (
      <>
        {[29, 71].map((x, i) => (
          <Moving key={x} move="ear-wiggle" origin={[x, 4]} delay={i * 0.2}>
            <ellipse cx={x} cy={-11} rx={7} ry={16} fill="#d6c3a5" {...edge} />
            <ellipse cx={x} cy={-11} rx={3} ry={10} fill={PINK} />
          </Moving>
        ))}
        <circle cx={82} cy={58} r={7} fill="#fff" {...edge} />
      </>
    ),
    front: (
      <>
        <Eye x={43} y={23} r={4.5} />
        <Eye x={57} y={23} r={4.5} />
        <ellipse cx={50} cy={32} rx={3.5} ry={2.5} fill="#ff8fab" {...edge} strokeWidth={1.5} />
        <Line d="M 46 38 Q 50 41 54 38" width={2} />
      </>
    ),
    move: "hop",
    sound: playBoing,
  },
  I: {
    name: "Igel",
    color: "#c69c72",
    body: ["M 50 10 V 61"],
    back: (
      <>
        {[1, -1].map((side) => (
          <Moving key={side} move="bristle" origin={[50, 35]}>
            <path
              d={`M 50 6 ${[10, 16, 22, 28, 34, 40, 46, 52, 58, 64]
                .map((y, i) => `L ${50 - side * (i % 2 ? 6 : 19)} ${y}`)
                .join(" ")} L 50 66 Z`}
              fill="#6f4518"
              {...edge}
              strokeWidth={2.5}
            />
          </Moving>
        ))}
        <ellipse cx={43} cy={73} rx={5} ry={3} fill="#c69c72" {...edge} strokeWidth={2} />
        <ellipse cx={57} cy={73} rx={5} ry={3} fill="#c69c72" {...edge} strokeWidth={2} />
      </>
    ),
    front: (
      <>
        <Eye x={46} y={14} r={3.5} />
        <Eye x={54} y={14} r={3.5} />
        <circle cx={50} cy={3} r={3.5} fill={INK} />
      </>
    ),
    move: "wiggle",
    sound: playSniff,
  },
  J: {
    name: "Jaguar",
    color: "#f4a261",
    body: ["M 64 10 V 44 Q 64 61 47 61 Q 36 61 33 52"],
    pattern: { color: INK, width: 4.5, dash: "0 10" },
    back: (
      <>
        <path d="M 56 6 L 57 -8 L 64 2 Z M 64 2 L 71 -8 L 72 6 Z" fill="#f4a261" {...edge} />
        <Moving move="wag" origin={[33, 52]}>
          <Limb d="M 33 52 Q 25 40 31 30" color="#f4a261" width={6} />
          <circle cx={31} cy={29} r={4} fill={INK} />
        </Moving>
      </>
    ),
    front: (
      <>
        <Eye x={60} y={11} r={3.5} />
        <Eye x={68} y={11} r={3.5} />
        <ellipse cx={64} cy={17} rx={2.5} ry={1.8} fill="#ff8fab" />
        <Line d="M 57 18 H 49 M 71 18 H 79" width={1.5} />
      </>
    ),
    move: "sway",
    sound: playMeow,
  },
  K: {
    name: "Krokodil",
    color: "#40916c",
    // The upper jaw last, so its eye stays on top.
    body: [
      "M 33 10 V 61",
      {
        d: "M 46 33 L 70 61",
        move: "jaw-down",
        origin: [39, 38],
        extra: (
          <>
            <Tooth x={62} y={39} nx={0.76} ny={-0.65} />
            <Tooth x={69} y={47} nx={0.76} ny={-0.65} />
          </>
        ),
      },
      {
        d: "M 37 40 L 68 10",
        move: "jaw-up",
        origin: [37, 39],
        extra: (
          <>
            <Tooth x={57} y={30} nx={0.69} ny={0.72} />
            <Tooth x={64} y={23} nx={0.69} ny={0.72} />
            <Eye x={49} y={24} r={5} />
            <circle cx={67} cy={11} r={1.8} fill={INK} />
          </>
        ),
      },
    ],
    pattern: { color: "#95d5b2", width: 4, dash: "0 9" },
    back: <Limb d="M 33 58 Q 20 67 9 60" color="#40916c" width={9} />,
    sound: playSnap,
  },
  L: {
    name: "Lama",
    color: "#ddb892",
    body: ["M 36 10 V 61 H 68"],
    back: (
      <>
        <Moving move="ear-wiggle" origin={[34, 2]}>
          <ellipse cx={31} cy={-4} rx={3.5} ry={8} transform="rotate(-15 31 -4)" fill="#ddb892" {...edge} strokeWidth={2.5} />
          <ellipse cx={40} cy={-4} rx={3.5} ry={8} transform="rotate(15 40 -4)" fill="#ddb892" {...edge} strokeWidth={2.5} />
        </Moving>
        {[42, 50, 59, 66].map((x) => (
          <Limb key={x} d={`M ${x} 62 V 76`} color="#ddb892" width={4.5} />
        ))}
        <circle cx={75} cy={57} r={5} fill="#ddb892" {...edge} strokeWidth={2.5} />
      </>
    ),
    front: (
      <>
        <ellipse cx={47} cy={14} rx={8} ry={5.5} fill="#ddb892" {...edge} strokeWidth={2.5} />
        <circle cx={52} cy={13} r={1.3} fill={INK} />
        <Eye x={36} y={9} r={4} />
      </>
    ),
    move: "walk",
    sound: playBaa,
  },
  M: {
    name: "Maus",
    color: "#b8bec6",
    body: ["M 21 61 V 10 L 50 44 L 79 10 V 61"],
    back: (
      <>
        {[17, 83].map((x) => (
          <g key={x}>
            <circle cx={x} cy={-2} r={12} fill="#b8bec6" {...edge} />
            <circle cx={x} cy={-2} r={7} fill={PINK} />
          </g>
        ))}
        <Moving move="wag" origin={[79, 58]}>
          <Limb d="M 79 58 C 94 62 96 48 90 42 C 86 38 82 42 84 46" color={PINK} width={3.5} />
        </Moving>
      </>
    ),
    front: (
      <>
        <Eye x={39} y={31} r={4.5} />
        <Eye x={61} y={31} r={4.5} />
        <Line d="M 46 48 L 34 45 M 46 50 L 34 52 M 54 48 L 66 45 M 54 50 L 66 52" width={1.5} />
        <circle cx={50} cy={48} r={4} fill="#ff8fab" {...edge} strokeWidth={2} />
      </>
    ),
    move: "wiggle",
    sound: playSqueak,
  },
  N: {
    name: "Nashorn",
    color: "#8d99ae",
    body: ["M 28 61 V 10 L 72 61 V 10"],
    back: (
      <>
        <path d="M 21 5 Q 21 -12 13 -20 Q 31 -13 35 4 Z" fill={IVORY} {...edge} />
        <ellipse cx={72} cy={-3} rx={4} ry={7} fill="#8d99ae" {...edge} />
        <ellipse cx={28} cy={72} rx={7} ry={3} fill="#8d99ae" {...edge} strokeWidth={2} />
        <ellipse cx={72} cy={72} rx={7} ry={3} fill="#8d99ae" {...edge} strokeWidth={2} />
      </>
    ),
    front: <Eye x={57} y={22} r={5} />,
    move: "stomp",
    sound: playRumble,
  },
  O: {
    name: "Oktopus",
    color: "#c77dff",
    body: ["M 24 36 A 26 27 0 1 1 76 36 A 26 27 0 1 1 24 36"],
    back: (
      <>
        {(
          [
            [30, 54],
            [40, 60],
            [50, 62],
            [60, 60],
            [70, 54],
          ] as const
        ).map(([x, y], i) => (
          <Moving key={x} move="tentacle" origin={[x, y]} delay={i * 0.12}>
            <Limb d={`M ${x} ${y} q ${-4 + i * 2} 9 0 16 q 4 6 ${-2 + i} 11`} color="#c77dff" width={6} />
          </Moving>
        ))}
      </>
    ),
    front: (
      <>
        <Eye x={42} y={31} r={5} />
        <Eye x={58} y={31} r={5} />
        <Line d="M 44 43 Q 50 48 56 43" />
      </>
    ),
    move: "squish",
    sound: playBlub,
  },
  P: {
    name: "Pinguin",
    color: "#4a4e69",
    body: ["M 33 61 V 10 H 51 C 63 10 69 17 69 26 C 69 35 63 42 51 42 H 33"],
    back: (
      <>
        <path d="M 74 21 L 86 26 L 74 31 Z" fill={BEAK} {...edge} strokeWidth={2} />
        <ellipse cx={28} cy={72} rx={6} ry={3} fill={BEAK} {...edge} strokeWidth={2} />
        <ellipse cx={40} cy={72} rx={6} ry={3} fill={BEAK} {...edge} strokeWidth={2} />
        <Moving move="wag" origin={[42, 48]}>
          <Limb d="M 42 48 L 50 60" color="#4a4e69" width={5} />
        </Moving>
      </>
    ),
    front: (
      <>
        <ellipse cx={33} cy={53} rx={4.5} ry={9} fill="#fff" />
        <Eye x={53} y={24} r={5} />
      </>
    ),
    move: "waddle",
    sound: playSquawk,
  },
  Q: {
    name: "Qualle",
    color: "#ff8fab",
    body: ["M 24 36 A 26 27 0 1 1 76 36 A 26 27 0 1 1 24 36", "M 60 52 L 79 66"],
    back: (
      <>
        <ellipse cx={50} cy={36} rx={26} ry={27} fill="#ffc2d1" opacity={0.8} />
        {[38, 48, 58].map((x, i) => (
          <Moving key={x} move="tentacle" origin={[x, 62]} delay={i * 0.15}>
            <path d={`M ${x} 62 q -4 7 0 13 q 4 6 0 12`} fill="none" stroke="#ff8fab" strokeWidth={3.5} strokeLinecap="round" />
          </Moving>
        ))}
      </>
    ),
    front: (
      <>
        <Eye x={42} y={26} r={4.5} />
        <Eye x={58} y={26} r={4.5} />
        <Line d="M 45 36 Q 50 40 55 36" />
      </>
    ),
    move: "squish",
    sound: playBlub,
  },
  R: {
    name: "Raupe",
    color: "#70c040",
    body: ["M 32 61 V 10 H 50 C 62 10 68 16 68 25 C 68 34 62 40 50 40 H 32 M 50 40 L 71 61"],
    pattern: { color: "#d8f3dc", width: 5, dash: "0 10" },
    back: (
      <>
        <Line d="M 29 4 Q 25 -6 19 -10 M 36 3 Q 38 -8 44 -12" />
        <circle cx={19} cy={-10} r={3} fill="#ffd23f" {...edge} strokeWidth={1.5} />
        <circle cx={44} cy={-12} r={3} fill="#ffd23f" {...edge} strokeWidth={1.5} />
        {[26, 38, 66, 77].map((x) => (
          <ellipse key={x} cx={x} cy={72} rx={4} ry={2.5} fill="#70c040" {...edge} strokeWidth={2} />
        ))}
      </>
    ),
    front: (
      <>
        <Eye x={45} y={25} r={4} />
        <Eye x={55} y={25} r={4} />
      </>
    ),
    move: "squish",
    sound: playMunch,
  },
  S: {
    name: "Schlange",
    color: "#55a630",
    body: ["M 66 18 C 62 12 56 9 49 9 C 40 9 33 14 33 22 C 33 31 41 34 50 36 C 59 38 67 41 67 50 C 67 58 60 62 50 62 C 42 62 36 59 33 54"],
    pattern: { color: "#ffd23f", width: 5, dash: "0 10" },
    back: (
      <Moving move="tongue" origin={[70, 15]}>
        <Line d="M 70 15 L 82 8 L 89 9 M 82 8 L 86 2" />
      </Moving>
    ),
    front: (
      <>
        <Eye x={57} y={9.5} r={3.8} />
        <Eye x={65.5} y={14} r={3.8} />
      </>
    ),
    move: "slither",
    sound: playHiss,
  },
  T: {
    name: "Taube",
    color: "#a2b7d0",
    body: [
      { d: "M 50 10 H 29", move: "wing-left", origin: [50, 10] },
      { d: "M 50 10 H 71", move: "wing-right", origin: [50, 10] },
      "M 50 10 V 61",
    ],
    back: <path d="M 50 58 L 39 77 L 50 72 L 61 77 Z" fill="#a2b7d0" {...edge} />,
    front: (
      <>
        <circle cx={50} cy={-4} r={9} fill="#a2b7d0" {...edge} />
        <path d="M 57 -5 L 66 -2 L 57 1 Z" fill={BEAK} {...edge} strokeWidth={1.8} />
        <Eye x={52} y={-6} r={3.2} />
      </>
    ),
    move: "fly",
    sound: playCoo,
  },
  U: {
    name: "Uhu",
    color: "#9c6644",
    body: ["M 28 10 V 40 C 28 54 38 62 50 62 C 62 62 72 54 72 40 V 10"],
    back: (
      <>
        <path d="M 21 7 L 17 -10 L 33 3 Z M 79 7 L 83 -10 L 67 3 Z" fill="#9c6644" {...edge} />
        <ellipse cx={43} cy={73} rx={5} ry={3} fill={BEAK} {...edge} strokeWidth={2} />
        <ellipse cx={57} cy={73} rx={5} ry={3} fill={BEAK} {...edge} strokeWidth={2} />
      </>
    ),
    front: (
      <>
        <Eye x={42} y={27} r={7} ring="#ffb703" />
        <Eye x={58} y={27} r={7} ring="#ffb703" />
        <path d="M 46 37 H 54 L 50 45 Z" fill={BEAK} {...edge} strokeWidth={2} />
      </>
    ),
    move: "sway",
    sound: playHoot,
  },
  V: {
    name: "Vogel",
    color: "#4895ef",
    body: [
      { d: "M 50 61 L 25 10", move: "vwing-left", origin: [50, 61] },
      { d: "M 50 61 L 75 10", move: "vwing-right", origin: [50, 61] },
    ],
    front: (
      <>
        <circle cx={50} cy={62} r={10} fill="#4895ef" {...edge} />
        <Eye x={46} y={60} r={3.2} />
        <Eye x={54} y={60} r={3.2} />
        <path d="M 47 65 L 50 72 L 53 65 Z" fill={BEAK} {...edge} strokeWidth={1.8} />
      </>
    ),
    move: "fly",
    sound: playTweet,
  },
  W: {
    name: "Wal",
    color: "#4a7fb5",
    body: ["M 13 10 L 30 61 L 50 22 L 70 61 L 87 10"],
    back: (
      <>
        {[0, 0.3, 0.6, 0.9].map((delay, i) => (
          <Moving key={delay} move="rise" origin={[50, 10]} delay={delay}>
            <circle cx={50 + [0, -6, 6, 0][i]} cy={8 - i * 3} r={3.5} fill="#4cc9f0" {...edge} strokeWidth={1.5} />
          </Moving>
        ))}
        <path d="M 87 8 Q 80 -2 78 -8 Q 85 -4 87 0 Q 89 -4 96 -8 Q 94 -2 87 8 Z" fill="#4a7fb5" {...edge} />
      </>
    ),
    front: (
      <>
        <Eye x={21} y={31} r={4.5} />
        <Line d="M 23 42 Q 27 45 31 42" width={2} />
      </>
    ),
    move: "sway",
    sound: playWhale,
  },
  X: {
    name: "Krabbe",
    color: "#e63946",
    body: ["M 25 10 L 75 61 M 75 10 L 25 61"],
    back: (
      <>
        {(
          [
            [25, 1],
            [75, -1],
          ] as const
        ).map(([x, side]) => (
          <g key={x}>
            <Limb d={`M ${x} 8 Q ${x - side * 11} -2 ${x - side * 7} -12`} color="#e63946" width={5} />
            <Moving move="pinch" origin={[x, 8]}>
              <Limb d={`M ${x} 8 Q ${x + side * 5} -4 ${x + side * 1} -14`} color="#e63946" width={5} />
            </Moving>
          </g>
        ))}
        <Line d="M 46 30 L 42 19 M 54 30 L 58 19" width={3} />
      </>
    ),
    front: (
      <>
        <Eye x={42} y={17} r={4.5} />
        <Eye x={58} y={17} r={4.5} />
      </>
    ),
    move: "walk",
    sound: playSnap,
  },
  Y: {
    name: "Yak",
    color: "#7f5539",
    body: ["M 27 10 L 50 37 L 73 10 M 50 37 V 61"],
    back: (
      <>
        <Limb d="M 27 10 Q 14 5 14 -10" color={IVORY} width={6} />
        <Limb d="M 73 10 Q 86 5 86 -10" color={IVORY} width={6} />
        <path d="M 38 40 L 35 57 L 42 52 L 44 63 L 50 56 L 56 63 L 58 52 L 65 57 L 62 40 Z" fill="#5e3c22" {...edge} strokeWidth={2.5} />
      </>
    ),
    front: (
      <>
        <Eye x={44} y={29} r={4} />
        <Eye x={56} y={29} r={4} />
        <ellipse cx={50} cy={42} rx={6} ry={4} fill="#d8b893" {...edge} strokeWidth={2} />
      </>
    ),
    move: "wiggle",
    sound: playMoo,
  },
  Z: {
    name: "Zebra",
    color: "#ffffff",
    body: ["M 31 10 H 70 L 31 61 H 70"],
    pattern: { color: INK, width: 11, dash: "5 6" },
    back: (
      <>
        <ellipse cx={34} cy={-4} rx={3.5} ry={7} transform="rotate(-15 34 -4)" fill="#fff" {...edge} strokeWidth={2.5} />
        <ellipse cx={42} cy={-4} rx={3.5} ry={7} transform="rotate(15 42 -4)" fill="#fff" {...edge} strokeWidth={2.5} />
        <path d="M 46 2 L 49 -6 L 53 1 L 56 -6 L 60 1 L 63 -6 L 66 2 Z" fill={INK} />
        <Moving move="wag" origin={[72, 60]}>
          <Line d="M 72 60 Q 84 56 86 66" width={3} />
          <circle cx={86} cy={67} r={3.5} fill={INK} />
        </Moving>
      </>
    ),
    front: (
      <>
        <ellipse cx={22} cy={12} rx={7} ry={6} fill="#6c757d" {...edge} strokeWidth={2} />
        <Eye x={36} y={9} r={4} />
      </>
    ),
    move: "hop",
    sound: playNeigh,
  },
};

/** Ä, Ö, Ü: the animal of the letter without the dots, with two dots on top. */
const UMLAUT = "̈";

function findAnimal(glyph: string): { animal: Animal; dots: boolean } | null {
  if (ANIMALS[glyph]) return { animal: ANIMALS[glyph], dots: false };
  const [base, mark, ...rest] = glyph.normalize("NFD");
  if (mark === UMLAUT && !rest.length && ANIMALS[base]) return { animal: ANIMALS[base], dots: true };
  return null;
}

function Stroke({ d, pattern }: { d: string; pattern?: Animal["pattern"] }) {
  return (
    <>
      <path className="ll-outline" d={d} />
      <path className="ll-fill" d={d} />
      {pattern && (
        <path
          className="ll-pattern"
          d={d}
          stroke={pattern.color}
          strokeWidth={pattern.width}
          strokeDasharray={pattern.dash}
          strokeLinecap={pattern.dash.startsWith("0 ") ? "round" : "butt"}
        />
      )}
    </>
  );
}

/**
 * A capital that comes alive for a moment soon after it appears, and again when tapped:
 * S slithers as a snake, M gets mouse ears, K snaps as a crocodile. Letters without
 * an animal of their own (Ł, Ş …) just get eyes and feet and hop.
 */
export function LivingLetter({ glyph, sounds }: { glyph: string; sounds: boolean }) {
  const found = useMemo(() => findAnimal(glyph), [glyph]);
  const [alive, setAlive] = useState(false);
  const sleepTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const wake = () => {
    setAlive(true);
    if (sounds) (found?.animal.sound ?? playBoing)();
    clearTimeout(sleepTimer.current);
    sleepTimer.current = setTimeout(() => setAlive(false), ALIVE_MS);
  };
  const wakeRef = useRef(wake);
  wakeRef.current = wake;

  // A new card is a new letter: it wakes up once by itself.
  useEffect(() => {
    const timer = setTimeout(() => wakeRef.current(), WAKE_MS);
    return () => {
      clearTimeout(timer);
      clearTimeout(sleepTimer.current);
    };
  }, []);

  const onPointerDown = (e: PointerEvent) => {
    e.stopPropagation();
    wake();
  };

  const animal = found?.animal;
  const move = animal ? animal.move : "hop";
  const className = ["living", alive && "alive", !animal && "plain", move && `ll-move-${move}`].filter(Boolean).join(" ");

  return (
    <span className={className} onPointerDown={onPointerDown} aria-label={animal && alive ? `${glyph}: ${animal.name}` : undefined}>
      <span className="living-glyph">{glyph}</span>
      <svg className="living-animal" viewBox="0 -17.5 100 100" aria-hidden style={{ "--ll-color": animal?.color } as CSSProperties}>
        {animal ? (
          <>
            <g className="ll-parts">{animal.back}</g>
            {animal.body.map((part, i) => {
              const segment = typeof part === "string" ? { d: part } : part;
              return (
                <g key={i} className={segment.move ? `ll-${segment.move}` : undefined} style={segment.origin && at(segment.origin)}>
                  <Stroke d={segment.d} pattern={animal.pattern} />
                  {segment.extra && <g className="ll-parts">{segment.extra}</g>}
                </g>
              );
            })}
            <g className="ll-parts">
              {animal.front}
              {found.dots && (
                <>
                  <circle cx={39} cy={-11} r={6} fill={animal.color} {...edge} />
                  <circle cx={61} cy={-11} r={6} fill={animal.color} {...edge} />
                </>
              )}
            </g>
          </>
        ) : (
          <g className="ll-parts">
            <ellipse cx={38} cy={74} rx={8} ry={4} fill={BEAK} {...edge} />
            <ellipse cx={62} cy={74} rx={8} ry={4} fill={BEAK} {...edge} />
            <Eye x={43} y={10} r={6} />
            <Eye x={57} y={10} r={6} />
          </g>
        )}
      </svg>
    </span>
  );
}
