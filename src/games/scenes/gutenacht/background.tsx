import type { ReactElement } from "react";
import { HORIZON, towardsHorizon, transformOf } from "../layout";
import { SHELF, SHELF_BOARD_1, SHELF_BOARD_2, SHELF_TOP, WINDOW } from "./layout";
import { sparkle, star } from "./parts";

// The back wall with lavender wallpaper (little stars and dots), a wooden rail and the
// skirting; the window with the evening sky, the hills, the town and the owl's branch; the
// bookshelf with its books and baskets; the door frame; the mouse hole. The floor is made of
// wooden planks running towards the back. Everything in `gn-room` darkens at night; the
// glows of the night light and the moon (`gn-nightglow`) only show then.

const WALL_RAIL = 236;

/** Wallpaper: rows of little stars and dots, every other row shifted. */
function Wallpaper() {
  const shapes: ReactElement[] = [];
  for (let row = 0; row < 5; row++) {
    const y = 34 + row * 46;
    for (let col = 0; col < 24; col++) {
      const x = col * 70 + (row % 2) * 35 + 18;
      shapes.push(
        (col + row) % 3 ? (
          <circle key={`${row}-${col}`} cx={x} cy={y} r="3.5" />
        ) : (
          <path key={`${row}-${col}`} d={star(x, y, 9)} />
        ),
      );
    }
  }
  return <g fill="#e6defa">{shapes}</g>;
}

/** Floor planks: their joints run towards the back, with short cross joints scaled by depth. */
function Planks() {
  const long = Array.from({ length: 23 }, (_, i) => {
    const x = -520 + i * 120;
    return `M${towardsHorizon(x, 1000, HORIZON + 2)} ${HORIZON + 2} L${x} 1000`;
  });
  const rows = [352, 384, 424, 474, 534, 606, 690, 788, 900];
  const cross = rows.flatMap((y, r) =>
    Array.from({ length: 23 }, (_, i) => {
      if ((i + r) % 3) return "";
      const x = -520 + i * 120;
      const a = towardsHorizon(x, 1000, y);
      const b = towardsHorizon(x + 120, 1000, y);
      return `M${a} ${y} L${b} ${y}`;
    }),
  );
  return (
    <>
      <path d={long.join(" ")} stroke="#c48d58" strokeWidth="2.5" opacity="0.55" />
      <path d={cross.join(" ")} stroke="#c48d58" strokeWidth="2" opacity="0.4" />
    </>
  );
}

/** Evening sky in the window: hills, a little town with lit windows and the owl's branch. */
function WindowView() {
  const { x, y, w, h } = WINDOW;
  const bottom = y + h;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill="url(#gn-sky)" />
      {[
        [626, 168, 2.5],
        [700, 152, 2],
        [744, 132, 2.5],
        [690, 72, 2],
        [820, 140, 2],
        [770, 64, 1.8],
      ].map(([sx, sy, r]) => (
        <path key={`${sx}-${sy}`} d={sparkle(sx, sy, r * 2)} fill="#fff" opacity="0.7" />
      ))}
      <path d={`M${x} ${bottom - 44} Q${x + 60} ${bottom - 70} ${x + 130} ${bottom - 48} Q${x + 190} ${bottom - 30} ${x + w} ${bottom - 56} V${bottom} H${x} Z`} fill="#5b5f9e" />
      {/* Little houses with lit windows */}
      {[
        [654, bottom - 52, 22, 20],
        [684, bottom - 46, 18, 16],
        [770, bottom - 50, 24, 22],
      ].map(([hx, hy, hw, hh]) => (
        <g key={hx}>
          <rect x={hx} y={hy} width={hw} height={hh} fill="#3f4380" />
          <path d={`M${hx - 3} ${hy} L${hx + hw / 2} ${hy - hw * 0.5} L${hx + hw + 3} ${hy} Z`} fill="#3f4380" />
          <rect x={hx + hw * 0.3} y={hy + hh * 0.3} width={hw * 0.35} height={hh * 0.35} fill="#ffd8a8" />
        </g>
      ))}
      <path d={`M${x} ${bottom - 18} Q${x + 100} ${bottom - 36} ${x + w} ${bottom - 14} V${bottom} H${x} Z`} fill="#454a85" />
      {/* The owl's branch, coming in from the right */}
      <path d={`M${x + w} 236 Q800 226 752 232`} stroke="#6d4c41" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M786 230 q-6 -14 6 -22" stroke="#6d4c41" strokeWidth="4" strokeLinecap="round" fill="none" />
      {[
        [760, 240, -20],
        [818, 246, 20],
        [826, 222, -30],
      ].map(([lx, ly, a]) => (
        <ellipse key={lx} cx={lx} cy={ly} rx="12" ry="6" transform={`rotate(${a} ${lx} ${ly})`} fill="#3d6b5a" />
      ))}
    </>
  );
}

function Window() {
  const { x, y, w, h } = WINDOW;
  return (
    <>
      <WindowView />
      <path d={`M${x} ${y} h${w} v${h} h${-w} Z`} fill="none" stroke="#fffaf0" strokeWidth="18" />
      <path d={`M${x - 9} ${y + h + 9} h${w + 18}`} stroke="#e8dccb" strokeWidth="4" />
      {/* Sill */}
      <rect x={x - 26} y={y + h + 4} width={w + 52} height="16" rx="5" fill="#fffaf0" />
      <rect x={x - 22} y={y + h + 16} width={w + 44} height="6" rx="3" fill="#e0d3c0" />
      {/* Curtain rod */}
      <rect x="530" y="22" width="380" height="8" rx="4" fill="#b08968" />
      <circle cx="530" cy="26" r="9" fill="#c9a27e" />
      <circle cx="910" cy="26" r="9" fill="#c9a27e" />
    </>
  );
}

/** The bookshelf: frame, boards, a row of books, puzzle boxes and two baskets. */
function Shelf() {
  const books = ["#f28482", "#84a59d", "#f6bd60", "#7c83c9", "#f5cac3", "#90be6d"];
  return (
    <g transform={transformOf(SHELF)}>
      <rect x="-150" y={SHELF_TOP} width="300" height={-SHELF_TOP} rx="8" fill="#b5835a" />
      <rect x="-136" y={SHELF_TOP + 14} width="272" height={-SHELF_TOP - 28} fill="#8f6544" />
      {[SHELF_TOP, SHELF_BOARD_1, SHELF_BOARD_2, -14].map((by) => (
        <g key={by}>
          <rect x="-152" y={by - 2} width="304" height="16" rx="4" fill="#c99a70" />
          <rect x="-150" y={by + 10} width="300" height="4" fill="#9c6f4a" />
        </g>
      ))}
      {/* Books on the upper board, right of the good-night book */}
      {books.map((colour, i) => {
        const bh = 96 - (i % 3) * 12;
        return (
          <g key={i}>
            <rect x={-6 + i * 22} y={SHELF_BOARD_1 - bh} width="19" height={bh} rx="3" fill={colour} />
            <rect x={-6 + i * 22} y={SHELF_BOARD_1 - bh + 12} width="19" height="5" fill="#fff" opacity="0.5" />
          </g>
        );
      })}
      {/* Puzzle boxes on the lower board */}
      <rect x="30" y={SHELF_BOARD_2 - 34} width="104" height="34" rx="4" fill="#90be6d" />
      <rect x="40" y={SHELF_BOARD_2 - 64} width="86" height="30" rx="4" fill="#f6bd60" />
      <circle cx="83" cy={SHELF_BOARD_2 - 49} r="8" fill="#fff" opacity="0.6" />
      {/* Baskets in the bottom */}
      {[-72, 72].map((bx, i) => (
        <g key={bx}>
          <path d={`M${bx - 60} -110 H${bx + 60} L${bx + 52} -16 H${bx - 52} Z`} fill={i ? "#f5cac3" : "#cdb4db"} />
          <path d={`M${bx - 58} -92 H${bx + 58} M${bx - 56} -66 H${bx + 56} M${bx - 54} -40 H${bx + 54}`} stroke="#fff" strokeWidth="4" opacity="0.4" />
          <rect x={bx - 16} y="-102" width="32" height="10" rx="5" fill="#fff" opacity="0.7" />
        </g>
      ))}
    </g>
  );
}

/** The door frame and the dark hallway behind it; the door and its light are an item. */
function DoorFrame() {
  return (
    <>
      <rect x="1398" y="12" width="194" height="324" rx="4" fill="#fffaf0" />
      <rect x="1412" y="26" width="166" height="308" fill="#6c5f8d" />
      <path d="M1398 12 h194" stroke="#e8dccb" strokeWidth="4" />
    </>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="gn-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfc4ef" />
          <stop offset="1" stopColor="#c2b5e6" />
        </linearGradient>
        <linearGradient id="gn-floor" gradientUnits="userSpaceOnUse" x1="0" y1={HORIZON} x2="0" y2="1000">
          <stop offset="0" stopColor="#d9a874" />
          <stop offset="1" stopColor="#e8bd8a" />
        </linearGradient>
        <linearGradient id="gn-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9a6a0" stopOpacity="0.6" />
          <stop offset="1" stopColor="#c9a6a0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f3a7a" />
          <stop offset="1" stopColor="#8e7cc3" />
        </linearGradient>
        <linearGradient id="gn-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff8dc" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fff8dc" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="gn-glow-warm">
          <stop offset="0" stopColor="#ffe8a3" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="#ffd8a8" stopOpacity="0.25" />
          <stop offset="1" stopColor="#ffd8a8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gn-glow-moon">
          <stop offset="0" stopColor="#fff9db" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff9db" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="gn-room">
        {/* Wall: wallpaper above the rail, a darker band below, the skirting at the bottom */}
        <rect width="1600" height={HORIZON} fill="url(#gn-wall)" />
        <Wallpaper />
        <rect y={WALL_RAIL} width="1600" height={HORIZON - WALL_RAIL} fill="#b3a5dc" />
        <rect y={WALL_RAIL - 6} width="1600" height="10" rx="3" fill="#f3ebff" />
        <rect y={HORIZON - 14} width="1600" height="14" fill="#f3e9dc" />
        <path d={`M0 ${HORIZON - 14} H1600`} stroke="#fff" strokeWidth="3" opacity="0.7" />

        <Window />
        <DoorFrame />

        {/* Mouse hole in the skirting, and the socket for the night light */}
        <path d="M1348 332 V314 Q1348 296 1368 296 Q1388 296 1388 314 V332 Z" fill="#3d2c3e" />
        <rect x="766" y="296" width="34" height="30" rx="6" fill="#f8f4ff" />

        {/* Floor */}
        <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#gn-floor)" />
        <Planks />
        <rect y={HORIZON} width="1600" height="50" fill="url(#gn-haze)" />
        {/* Moonlight falling through the window onto the floor */}
        <path d="M612 334 H828 L1010 760 H500 Z" fill="url(#gn-beam)" />

        <Shelf />
      </g>

      {/* Only at night: the warm glow of the night light and the moon's shine */}
      <g className="gn-nightglow">
        <ellipse cx="783" cy="320" rx="300" ry="230" fill="url(#gn-glow-warm)" />
        <circle cx="652" cy="100" r="150" fill="url(#gn-glow-moon)" />
        <path d="M612 334 H828 L1010 760 H500 Z" fill="url(#gn-beam)" />
      </g>
    </>
  );
}
