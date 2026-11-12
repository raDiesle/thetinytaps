import { memo, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Wecker (H-70, user request, November 2026): a children's digital alarm clock on the bedside table, as families know
// it – a chunky, rounded radio clock in bright colours with a big snooze bar on top, little feet and stickers, and a
// dark screen with glowing segment digits counting down to 0:00. The digits are the time left, so this picture needs
// no note in the corner (`TimeShownNote` stays off). Under them a row of light blocks goes out one by one from the
// right, so a child that can't read digits sees the time go too; it is a window sliding left over a still drawing that
// slides back the same way (`overflow: hidden`, only `transform` moves, like `BulbSand`). The digits change once a
// second in a small layer of their own – the clock's step a second (H-63) – and the colon stays lit, never blinking.
// At the end it beeps and the clock rings on its feet; a tap presses the snooze bar.

/** The clock's box on the stage (body, snooze bar and feet), which rings as a whole at the end. */
export const CLOCK = { x: 300, y: 180, w: 1000, h: 540 } as const;

/** The table top the clock stands on. */
export const CLOCK_FLOOR = 712;

/** The body, the white frame round the screen and the dark screen, in stage units. */
const BODY = { x: 340, y: 252, w: 920, h: 440, r: 120 } as const;
const BEZEL = { x: 410, y: 312, w: 780, h: 316, r: 62 } as const;
const SCREEN = { x: 440, y: 338, w: 720, h: 266, r: 42 } as const;

/** The big snooze bar on top, pressed at a tap. */
const SNOOZE = { x: 570, y: 196, w: 460, h: 70 } as const;

/** Where the digits stand on the screen, in stage units. */
export const DIGITS = { x: 480, y: 384, w: 640, h: 150 } as const;

/** The row of light blocks under the digits, and how many blocks it has: one goes out at each share of the time. */
export const BAR = { x: 492, y: 556, w: 616, h: 28 } as const;
export const CLOCK_BLOCKS = 20;

/** The lit segments' colour (a warm orange, friendly in the dark) and the unlit ones', faint as on a real screen. */
const LIT = "#ff9a52";
const GHOST = "#29363f";
const SCREEN_FILL = "#1f2b33";

/**
 * The time left as the clock shows it: minutes and seconds, with the hours in front when the whole run is an hour or
 * longer („1:04:37“), and a blank in front of one-digit minutes when it started at ten minutes or more („ 9:59“) – so
 * the digits never shift while it runs. Rounded up to the second, so it starts on the time set and ends on 0:00.
 */
export function clockText(left: number, total: number) {
  const secs = Math.max(0, Math.ceil(left / 1000));
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = String(secs % 60).padStart(2, "0");
  if (total >= 3_600_000) return `${h}:${String(m).padStart(2, "0")}:${s}`;
  const minutes = String(Math.floor(secs / 60));
  return `${total >= 600_000 ? minutes.padStart(2, " ") : minutes}:${s}`;
}

/** Which of a digit's seven segments are lit (a top, b top right, c bottom right, d bottom, e bottom left, f top left, g middle). */
const SEGMENTS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abged",
  "3": "abgcd",
  "4": "fgbc",
  "5": "afgcd",
  "6": "afgedc",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
  " ": "",
};

/** A digit's width and height, a segment's thickness, and the room a digit and a colon take, in the digits' units. */
const DIGIT = { w: 92, h: 150, t: 19, advance: 116, colon: 50 } as const;

/** The seven segments of one digit as polygons, with a hair of room between them as on a real display. */
function segmentShapes() {
  const { w, h, t } = DIGIT;
  const g = 3;
  const half = t / 2;
  const across = (y: number) => {
    const x0 = half + g;
    const x1 = w - half - g;
    return `${x0},${y} ${x0 + half},${y - half} ${x1 - half},${y - half} ${x1},${y} ${x1 - half},${y + half} ${x0 + half},${y + half}`;
  };
  const down = (x: number, y0: number, y1: number) =>
    `${x},${y0 + g} ${x + half},${y0 + g + half} ${x + half},${y1 - g - half} ${x},${y1 - g} ${x - half},${y1 - g - half} ${x - half},${y0 + g + half}`;
  return {
    a: across(half),
    b: down(w - half, half, h / 2),
    c: down(w - half, h / 2, h - half),
    d: across(h - half),
    e: down(half, h / 2, h - half),
    f: down(half, half, h / 2),
    g: across(h / 2),
  };
}
const SHAPES = segmentShapes();

/** One digit (or a blank): all seven segments, the lit ones glowing and the others faint. */
function Digit({ char, x }: { char: string; x: number }) {
  const lit = SEGMENTS[char] ?? "";
  return (
    <g transform={`translate(${x} 0) skewX(-6)`}>
      {Object.entries(SHAPES).map(([name, points]) => (
        <polygon key={name} points={points} fill={lit.includes(name) ? LIT : GHOST} />
      ))}
    </g>
  );
}

/** The digits as text is laid out: centred on the screen, a colon narrower than a digit. */
function Digits({ text }: { text: string }) {
  const width = [...text].reduce((sum, c) => sum + (c === ":" ? DIGIT.colon : DIGIT.advance), 0) - (DIGIT.advance - DIGIT.w);
  const scale = Math.min(1, DIGITS.w / width);
  let x = 0;
  const parts: ReactNode[] = [];
  [...text].forEach((c, i) => {
    if (c === ":") {
      parts.push(
        <g key={i} fill={LIT}>
          <circle cx={x + DIGIT.colon / 2 - 6} cy={DIGIT.h * 0.3} r={10} />
          <circle cx={x + DIGIT.colon / 2 - 10} cy={DIGIT.h * 0.7} r={10} />
        </g>,
      );
      x += DIGIT.colon;
    } else {
      parts.push(<Digit key={i} char={c} x={x} />);
      x += DIGIT.advance;
    }
  });
  return (
    <svg viewBox={`0 0 ${DIGITS.w} ${DIGITS.h}`}>
      <g transform={`translate(${(DIGITS.w - width * scale) / 2} ${(DIGITS.h - DIGIT.h * scale) / 2}) scale(${scale})`}>{parts}</g>
    </svg>
  );
}

/**
 * The time left on the screen, ticking while it runs (only this small layer is drawn again); 0:00 once it is up. `still`
 * (a menu's card) shows the time left now and ticks no more.
 */
function ClockDigits({ endsAt, total, running, still }: { endsAt: number; total: number; running: boolean; still?: boolean }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (!running || still) return;
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [running, still]);
  const text = clockText(running ? endsAt - now : 0, total);
  return (
    <Part {...DIGITS} className="tm-clock-digits">
      <Digits text={text} />
    </Part>
  );
}

/** A piece of the clock placed in stage units inside the clock's box, which rings as a whole at the end. */
function Part({
  x,
  y,
  w,
  h,
  className,
  style,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={`tm-layer${className ? ` ${className}` : ""}`}
      style={{
        left: `${((x - CLOCK.x) / CLOCK.w) * 100}%`,
        top: `${((y - CLOCK.y) / CLOCK.h) * 100}%`,
        width: `${(w / CLOCK.w) * 100}%`,
        height: `${(h / CLOCK.h) * 100}%`,
        ...style,
      }}
      aria-hidden
    >
      {children}
    </div>
  );
}

/** The child's room behind: a soft wall with a few stars and the bedside table's top; drawn once. */
const ClockBackdrop = memo(function ClockBackdrop() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <rect width={STAGE_W} height={STAGE_H} fill="#dcecff" />
        {[
          [180, 160],
          [1420, 130],
          [1480, 420],
          [140, 470],
          [260, 330],
          [1330, 280],
        ].map(([x, y], i) => (
          <path
            key={i}
            d={`M${x} ${y - 18} L${x + 6} ${y - 6} L${x + 19} ${y - 5} L${x + 9} ${y + 4} L${x + 12} ${y + 17} L${x} ${y + 10} L${x - 12} ${y + 17} L${x - 9} ${y + 4} L${x - 19} ${y - 5} L${x - 6} ${y - 6} Z`}
            fill="#fff3bf"
          />
        ))}
        <rect y={CLOCK_FLOOR - 14} width={STAGE_W} height={STAGE_H - CLOCK_FLOOR + 14} fill="#e2b07a" />
        <rect y={CLOCK_FLOOR - 14} width={STAGE_W} height="20" fill="#eec493" />
        <path d={`M0 ${CLOCK_FLOOR + 6} H${STAGE_W}`} stroke="#c48d58" strokeWidth="5" />
      </Draw>
    </Layer>
  );
});

/** The clock's body: feet, the rounded case, two little buttons, the white frame and the dark screen with its faint blocks; drawn once. */
const ClockBody = memo(function ClockBody() {
  const local = { x: BODY.x - CLOCK.x, y: BODY.y - CLOCK.y };
  const at = (v: { x: number; y: number }) => ({ x: v.x - CLOCK.x, y: v.y - CLOCK.y });
  const bezel = at(BEZEL);
  const screen = at(SCREEN);
  const bar = at(BAR);
  const block = BAR.w / CLOCK_BLOCKS;
  return (
    <Part x={CLOCK.x} y={CLOCK.y} w={CLOCK.w} h={CLOCK.h}>
      <Draw w={CLOCK.w} h={CLOCK.h}>
        {/* Little round feet. */}
        {[local.x + 150, local.x + BODY.w - 150].map((x) => (
          <ellipse key={x} cx={x} cy={CLOCK_FLOOR - CLOCK.y - 18} rx="62" ry="26" fill="#ff8787" stroke={INK} strokeWidth="7" />
        ))}
        {/* Two little round buttons on top, beside the snooze bar. */}
        {[local.x + 150, local.x + BODY.w - 150].map((x) => (
          <g key={x}>
            <rect x={x - 34} y={local.y - 34} width="68" height="50" rx="20" fill="#b197fc" stroke={INK} strokeWidth="7" />
            <rect x={x - 22} y={local.y - 26} width="26" height="10" rx="5" fill="#d0bfff" />
          </g>
        ))}
        <rect x={local.x} y={local.y} width={BODY.w} height={BODY.h} rx={BODY.r} fill="#3bc9db" stroke={INK} strokeWidth="9" />
        {/* Light on the case's top, darker towards its foot: rounded, not flat. */}
        <path
          d={`M${local.x + 70} ${local.y + 36} Q${local.x + BODY.w / 2} ${local.y + 8} ${local.x + BODY.w - 70} ${local.y + 36}`}
          fill="none"
          stroke="#99e9f2"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d={`M${local.x + 90} ${local.y + BODY.h - 26} Q${local.x + BODY.w / 2} ${local.y + BODY.h - 6} ${local.x + BODY.w - 90} ${local.y + BODY.h - 26}`}
          fill="none"
          stroke="#22b8cf"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <rect x={bezel.x} y={bezel.y} width={BEZEL.w} height={BEZEL.h} rx={BEZEL.r} fill="#fff9ec" stroke={INK} strokeWidth="7" />
        <rect x={screen.x} y={screen.y} width={SCREEN.w} height={SCREEN.h} rx={SCREEN.r} fill={SCREEN_FILL} stroke={INK} strokeWidth="5" />
        {/* The screen's faint blocks, seen where the lit ones have gone out. */}
        {Array.from({ length: CLOCK_BLOCKS }, (_, i) => (
          <rect key={i} x={bar.x + i * block + 3} y={bar.y} width={block - 6} height={BAR.h} rx="5" fill={GHOST} />
        ))}
        {/* The radio sign (a mast sending its waves) and the bell of the alarm that is set, glowing in the screen's corners. */}
        <g stroke={LIT} strokeWidth="5" strokeLinecap="round" fill="none">
          <path
            d={`M${screen.x + 44} ${screen.y + 50} L${screen.x + 54} ${screen.y + 18} L${screen.x + 64} ${screen.y + 50} M${screen.x + 48} ${screen.y + 38} H${screen.x + 60}`}
          />
          <path d={`M${screen.x + 72} ${screen.y + 14} Q${screen.x + 82} ${screen.y + 24} ${screen.x + 72} ${screen.y + 34}`} />
          <path d={`M${screen.x + 82} ${screen.y + 6} Q${screen.x + 98} ${screen.y + 24} ${screen.x + 82} ${screen.y + 42}`} />
        </g>
        <g fill={LIT}>
          <path
            d={`M${screen.x + SCREEN.w - 62} ${screen.y + 44} Q${screen.x + SCREEN.w - 62} ${screen.y + 16} ${screen.x + SCREEN.w - 48} ${screen.y + 16} Q${screen.x + SCREEN.w - 34} ${screen.y + 16} ${screen.x + SCREEN.w - 34} ${screen.y + 44} Z`}
          />
          <rect x={screen.x + SCREEN.w - 68} y={screen.y + 42} width="40" height="6" rx="3" />
          <circle cx={screen.x + SCREEN.w - 48} cy={screen.y + 53} r="5" />
        </g>
      </Draw>
    </Part>
  );
});

/** Stickers a child stuck on the case: a star and a heart in its lower corners; they step back from afar. */
const Stickers = memo(function Stickers() {
  const star = (x: number, y: number, r: number) =>
    Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * 2 * Math.PI;
      const k = i % 2 ? r * 0.45 : r;
      return `${x + Math.sin(a) * k},${y - Math.cos(a) * k}`;
    }).join(" ");
  return (
    <Part x={CLOCK.x} y={CLOCK.y} w={CLOCK.w} h={CLOCK.h} className="tm-dims">
      <Draw w={CLOCK.w} h={CLOCK.h}>
        <polygon points={star(BODY.x - CLOCK.x + 72, BODY.y - CLOCK.y + BODY.h - 66, 30)} fill="#ffd43b" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path
          transform={`translate(${BODY.x - CLOCK.x + BODY.w - 74} ${BODY.y - CLOCK.y + BODY.h - 70})`}
          d="M0 22 C-34 0 -26 -26 -12 -26 C-4 -26 0 -18 0 -14 C0 -18 4 -26 12 -26 C26 -26 34 0 0 22 Z"
          fill="#ff6b6b"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
      </Draw>
    </Part>
  );
});

/** The big yellow snooze bar on top; a tap presses it down (a fresh press each time, keyed by the tap). */
function Snooze({ press }: { press: number }) {
  return (
    <Part {...SNOOZE} className="tm-clock-snooze">
      <div key={press} className={press ? "tm-clock-press" : undefined}>
        <svg viewBox={`0 0 ${SNOOZE.w} ${SNOOZE.h}`}>
          <rect x="6" y="6" width={SNOOZE.w - 12} height={SNOOZE.h + 20} rx="30" fill="#ffd43b" stroke={INK} strokeWidth="8" />
          <path d={`M40 26 H${SNOOZE.w - 40}`} stroke="#fff3bf" strokeWidth="10" strokeLinecap="round" />
        </svg>
      </div>
    </Part>
  );
}

/** The row of lit blocks: a window that slides left a block at each share of the time, its drawing sliding back so it stays put. */
const Blocks = memo(function Blocks({ glow }: { glow: number }) {
  const block = BAR.w / CLOCK_BLOCKS;
  return (
    <Part {...BAR} className="tm-clock-win tm-move" style={{ "--tm-blocks": CLOCK_BLOCKS } as CSSProperties}>
      <div className="tm-clock-lit tm-move">
        <svg viewBox={`0 0 ${BAR.w} ${BAR.h}`}>
          {Array.from({ length: CLOCK_BLOCKS }, (_, i) => (
            <rect key={i} x={i * block + 3} y="0" width={block - 6} height={BAR.h} rx="5" fill={LIT} />
          ))}
        </svg>
        {/* A tap lights the blocks still lit (H-51). */}
        <LeftGlow n={glow} />
      </div>
    </Part>
  );
});

/** The whole picture: the room, and the clock with its ticking digits, its blocks and its snooze bar (`still`: not ticking). */
export function ClockScene({ glow, endsAt, total, running, still }: { glow: number; endsAt: number; total: number; running: boolean; still?: boolean }) {
  return (
    <>
      <ClockBackdrop />
      <Layer {...CLOCK} className="tm-clock">
        {/* The snooze bar first: the case covers its foot, and a press pushes it down into the case. */}
        <Snooze press={glow} />
        <ClockBody />
        <Stickers />
        <Blocks glow={glow} />
        <ClockDigits endsAt={endsAt} total={total} running={running} still={still} />
      </Layer>
    </>
  );
}
