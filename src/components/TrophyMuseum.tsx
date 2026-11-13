import { type CSSProperties, memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FullscreenButton } from "@/components/FullscreenButton";
import { ShelfLabelArt } from "@/components/PageCornerArt";
import { Trophy } from "@/components/Trophy";
import { useLevelNames } from "@/components/trophyNames";
import { useAppLanguage, useT } from "@/lib/language";
import { goBack } from "@/lib/goBack";
import { TROPHY_PARAM, TROPHY_ROOM, useMuseumTrophies } from "@/lib/museum";
import { useStepAddress } from "@/lib/stepAddress";
import { gameOf, gameOrder, type TrophyWon, trophyKey } from "@/lib/trophies";
import "@/styles/museum.css";

/*
 * The trophy room (user request, November 2026): no menu over the shelf but a room of its own next to it, a little
 * museum. Its rooms are drawn in simple perspective – back wall, side walls, ceiling and a floor of boards running to one
 * vanishing point – and in each the trophies stand in a row on plinths, each with a brass plate naming its level and
 * game. Doorways in the side walls lead on to the next room and back; the first room's left door leads back to the
 * shelf, as does the round shelf label in the top left at any time. A tap on a trophy shows it big. Everything is drawn
 * once and stands still; only walking through a door and a trophy coming close move, by transforms and opacity.
 */

/** The vanishing point's height on the screen, and how big the back wall is against the screen round that point. */
const EYE = 0.42;
const BACK = 0.6;

/** Where the plinths stand: their front's bottom edge, and their height at most, as shares of the screen's height. */
const PLINTH_FOOT = 0.95;
const PLINTH_HIGH = 0.24;

/** A plinth's width for its trophy's height, the room between two, and how far its top reaches back (towards the eye's point). */
const PLINTH_WIDE = 0.74;
const PLINTH_GAP = 0.2;
const PLINTH_DEEP = 0.92;

/** The row of plinths' width, as a share of the screen's width. */
const ROW_WIDTH = 0.86;

/** How long a walk through a door takes, out of one room and into the next (`museum-walk-*` in museum.css). */
const WALK_MS = 420;

/** One room: the trophies standing in it and the games they were won in. */
interface MuseumRoom {
  trophies: TrophyWon[];
  games: string[];
}

/** How the rooms are drawn on a screen `w` × `h`: their walls and how many trophies stand in each, how big. */
export function museumLayout(w: number, h: number) {
  const vx = w / 2;
  const vy = h * EYE;
  const back = { x0: vx - vx * BACK, x1: vx + vx * BACK, y0: vy - vy * BACK, y1: vy + (h - vy) * BACK };
  const row = w * ROW_WIDTH;
  // As many as stand big on the screen, at least two, at most six; then each as big as the row and the height allow.
  const perRoom = Math.max(2, Math.min(6, Math.floor(row / ((PLINTH_WIDE + PLINTH_GAP) * h * 0.4))));
  const trophy = Math.min(h * 0.42, row / (perRoom * (PLINTH_WIDE + PLINTH_GAP)));
  const plinth = Math.min(h * PLINTH_HIGH, trophy * 0.72);
  return { w, h, vx, vy, back, perRoom, trophy, plinth, foot: h * PLINTH_FOOT };
}

/** The museum's measures on this screen. */
type Layout = ReturnType<typeof museumLayout>;

/**
 * The trophies in rooms of at most `perRoom`, in the shelf's order of the games, each game's in the order they were won:
 * games with few trophies share a room, a game with more than a room holds fills rooms of its own, evenly.
 */
export function museumRooms(trophies: TrophyWon[], perRoom: number): MuseumRoom[] {
  const games = [...new Set(trophies.map((trophy) => trophy.game))].sort((a, b) => gameOrder(a) - gameOrder(b));
  const rooms: MuseumRoom[] = [];
  let open: MuseumRoom | undefined;
  for (const game of games) {
    const own = trophies.filter((trophy) => trophy.game === game).sort((a, b) => a.at - b.at);
    if (own.length > perRoom) {
      const count = Math.ceil(own.length / perRoom);
      const each = Math.ceil(own.length / count);
      for (let i = 0; i < own.length; i += each) rooms.push({ trophies: own.slice(i, i + each), games: [game] });
      open = undefined;
    } else if (open && open.trophies.length + own.length <= perRoom) {
      open.trophies.push(...own);
      open.games.push(game);
    } else {
      open = { trophies: [...own], games: [game] };
      rooms.push(open);
    }
  }
  return rooms.length ? rooms : [{ trophies: [], games: [] }];
}

/** The trophy room: its rooms one after the other, the way back to the shelf always in the top left. */
export function TrophyMuseum() {
  const t = useT();
  const language = useAppLanguage();
  const navigate = useNavigate();
  const { search } = useLocation();
  const trophies = useMuseumTrophies();
  const size = useScreen();
  const layout = useMemo(() => museumLayout(size.w, size.h), [size]);
  const rooms = useMemo(() => museumRooms(trophies, layout.perRoom), [trophies, layout.perRoom]);
  const names = useLevelNames(
    rooms.flatMap((room) => room.games),
    language.id,
  );

  // The trophy named in the address (tapped at a level's end) opens big, in its room.
  const named = new URLSearchParams(search).get(TROPHY_PARAM);
  const [big, setBig] = useState<{ trophy: TrophyWon; from?: DOMRect } | undefined>(() => {
    const trophy = named ? trophies.find((one) => trophyKey(one.game, one.level) === named) : undefined;
    return trophy && { trophy };
  });
  const [room, setRoom] = useState(() => {
    const at = named ? rooms.findIndex((one) => one.trophies.some((trophy) => trophyKey(trophy.game, trophy.level) === named)) : -1;
    return Math.max(0, at);
  });
  const shown = Math.min(room, rooms.length - 1);
  useStepAddress(shown + 1);

  // Walking through a door: out of this room towards it, then into the next one.
  const [walk, setWalk] = useState<{ to: number; phase: "out" | "in"; side: "left" | "right" }>();
  const toShelf = () => goBack(navigate, "/");
  // Put back, the trophy is no longer named in the address, so a reload opens the room as it is now. In place like the
  // room's step (stepAddress.ts), past the router, keeping its place in the history.
  const putBack = () => {
    setBig(undefined);
    const url = new URL(window.location.href);
    if (!url.searchParams.has(TROPHY_PARAM)) return;
    url.searchParams.delete(TROPHY_PARAM);
    window.history.replaceState(window.history.state, "", url);
  };
  const walkTo = (side: "left" | "right") => {
    if (walk) return;
    const to = shown + (side === "right" ? 1 : -1);
    if (to < 0) return toShelf();
    if (to >= rooms.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setRoom(to);
    setWalk({ to, phase: "out", side });
  };
  useEffect(() => {
    if (!walk) return;
    const timer = setTimeout(() => {
      if (walk.phase === "out") {
        setRoom(walk.to);
        setWalk({ ...walk, phase: "in" });
      } else setWalk(undefined);
    }, WALK_MS);
    return () => clearTimeout(timer);
  }, [walk]);

  // The arrow keys walk, Esc puts a trophy shown big back.
  const keys = useRef<(e: KeyboardEvent) => void>(() => {});
  keys.current = (e) => {
    if (e.key === "Escape" && big) putBack();
    else if (big) return;
    else if (e.key === "ArrowRight") walkTo("right");
    else if (e.key === "ArrowLeft") walkTo("left");
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => keys.current(e);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const current = rooms[shown];
  const title = current.games.map((href) => {
    const game = gameOf(href);
    return game ? t(game.title) : href;
  });
  const shelfLabel = t({
    de: "Zurück zum Bücherregal",
    ru: "Назад к книжной полке",
    en: "Back to the bookshelf",
    zh: "返回书架",
    hi: "किताबों की अलमारी पर वापस",
    es: "Volver a la estantería",
    ar: "العودة إلى رف الكتب",
  });
  const style = {
    "--trophy": `${layout.trophy}px`,
    "--plinth": `${layout.plinth}px`,
  } as CSSProperties;

  return (
    <main className="museum" style={style}>
      <div className={`museum-scene${walk ? ` walk-${walk.phase} to-${walk.side}` : ""}`}>
        <RoomShell layout={layout} left={shown === 0 ? "shelf" : "room"} right={shown < rooms.length - 1} />
        <span className="museum-room-sign" style={{ top: layout.back.y0 + layout.h * 0.02 }}>
          <span className="museum-room-name">{title.length ? title.join(" · ") : t(TROPHY_ROOM)}</span>
          {rooms.length > 1 && (
            <span className="museum-room-dots" aria-hidden>
              {rooms.map((_, i) => (
                <span key={i} className={i === shown ? "here" : undefined} />
              ))}
            </span>
          )}
        </span>
        <Plinths
          layout={layout}
          trophies={current.trophies}
          nameOf={(trophy) => names(trophy.game, trophy.level)}
          onPick={(trophy, from) => setBig({ trophy, from })}
        />
        <Doors
          layout={layout}
          left={shown === 0 ? shelfLabel : t({ en: "Room before" })}
          right={shown < rooms.length - 1 ? t({ en: "Next room" }) : undefined}
          onWalk={walkTo}
        />
      </div>
      <button type="button" className="museum-exit" aria-label={shelfLabel} title={shelfLabel} onClick={toShelf}>
        <ShelfLabelArt />
      </button>
      <FullscreenButton className="museum-fullscreen" />
      {big && <BigTrophy trophy={big.trophy} from={big.from} name={names(big.trophy.game, big.trophy.level)} onClose={putBack} />}
    </main>
  );
}

/** The screen's size, following it as it turns or the window changes. */
function useScreen() {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

/** A point `k` of the way from the vanishing point to the screen's point (`x`, `y`): `k` 1 at the screen, `BACK` at the back wall. */
const toward = (l: Layout, x: number, y: number, k: number) => [l.vx + (x - l.vx) * k, l.vy + (y - l.vy) * k] as const;

/** A polygon's points for an svg. */
const points = (list: readonly (readonly [number, number])[]) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

/** A doorway in a side wall, between depths `near` and `far` (1 at the screen, `BACK` at the back wall). */
function doorway(l: Layout, side: "left" | "right", near = 0.86, far = 0.7) {
  const x = side === "left" ? 0 : l.w;
  const high = 0.66;
  const at = (k: number, up: number) => toward(l, x, l.h - up * l.h, k);
  return [at(near, high), at(far, high), at(far, 0), at(near, 0)];
}

/**
 * The room's walls, ceiling and floor, drawn once as one still svg the size of the screen: the back wall with its
 * wallpaper and wainscot, the side walls in shade, the floor's boards running to the vanishing point, light from the
 * ceiling, and the doorways – light from the next room in them, the shelf's room in the first room's left one.
 */
const RoomShell = memo(function RoomShell({ layout: l, left, right }: { layout: Layout; left: "shelf" | "room"; right: boolean }) {
  const { w, h, back } = l;
  const corners = { tl: [0, 0], tr: [w, 0], br: [w, h], bl: [0, h] } as const;
  const b = { tl: [back.x0, back.y0], tr: [back.x1, back.y0], br: [back.x1, back.y1], bl: [back.x0, back.y1] } as const;
  const wainscot = back.y1 - (back.y1 - back.y0) * 0.3;
  // The floor's boards: lines from the vanishing point through even steps along the back wall's foot, out to the screen.
  const boards = Array.from({ length: 15 }, (_, i) => {
    const x = back.x0 + ((back.x1 - back.x0) * (i + 0.5)) / 15;
    const k = (h - l.vy) / (back.y1 - l.vy);
    return [x, back.y1, l.vx + (x - l.vx) * k, h] as const;
  });
  // Across the boards, where one board ends and the next begins, closer together far away.
  const joints = [0.66, 0.74, 0.84, 0.94].map((k) => toward(l, 0, h, k)[1]);
  return (
    <svg className="museum-shell" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="museum-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8e3b3b" />
          <stop offset="1" stopColor="#6f2a2e" />
        </linearGradient>
        <pattern id="museum-paper" width="34" height="34" patternUnits="userSpaceOnUse">
          <rect width="34" height="34" fill="url(#museum-wall)" />
          <path d="M17 6 L20 17 L17 28 L14 17 Z" fill="#ffffff10" />
        </pattern>
        <linearGradient id="museum-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a4a26" />
          <stop offset="1" stopColor="#b47a45" />
        </linearGradient>
        <radialGradient id="museum-door-light" cx="0.5" cy="0.6" r="0.7">
          <stop offset="0" stopColor="#fff6d8" />
          <stop offset="1" stopColor="#e8b464" />
        </radialGradient>
        {/* The plinths' fronts (PlinthArt), each in an svg of its own. */}
        <linearGradient id="museum-plinth-front" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9e0cc" />
          <stop offset="0.45" stopColor="#f6f0e2" />
          <stop offset="1" stopColor="#e2d8c2" />
        </linearGradient>
        <radialGradient id="museum-ceiling-light" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff8e6" />
          <stop offset="1" stopColor="#f3e2c0" />
        </radialGradient>
      </defs>
      {/* Ceiling, with a skylight in its middle. */}
      <polygon points={points([corners.tl, corners.tr, b.tr, b.tl])} fill="#e9d8b8" />
      <polygon
        points={points([toward(l, w * 0.3, 0, 0.82), toward(l, w * 0.7, 0, 0.82), toward(l, w * 0.7, 0, 0.66), toward(l, w * 0.3, 0, 0.66)])}
        fill="url(#museum-ceiling-light)"
        stroke="#c9b089"
        strokeWidth="2"
      />
      {/* The back wall: wallpaper, a wainscot of wood, a moulding under the ceiling. */}
      <rect x={back.x0} y={back.y0} width={back.x1 - back.x0} height={back.y1 - back.y0} fill="url(#museum-paper)" />
      <rect x={back.x0} y={wainscot} width={back.x1 - back.x0} height={back.y1 - wainscot} fill="#5c3216" />
      <rect x={back.x0} y={wainscot} width={back.x1 - back.x0} height={h * 0.008} fill="#c9a060" />
      <rect x={back.x0} y={back.y0} width={back.x1 - back.x0} height={h * 0.012} fill="#d9c49a" />
      {/* The side walls, in their own shade, with the wainscot running along them. */}
      {(["left", "right"] as const).map((side) => {
        const x = side === "left" ? 0 : w;
        const bx = side === "left" ? back.x0 : back.x1;
        const wall = [toward(l, x, 0, 1), [bx, back.y0], [bx, back.y1], toward(l, x, h, 1)] as const;
        const low = [[bx, wainscot], toward(l, x, l.vy + (wainscot - l.vy) / BACK, 1), toward(l, x, h, 1), [bx, back.y1]] as const;
        return (
          <g key={side}>
            <polygon points={points(wall)} fill="url(#museum-paper)" />
            <polygon points={points(wall)} fill="#2a0e0e" opacity="0.32" />
            <polygon points={points(low)} fill="#4a2810" />
          </g>
        );
      })}
      {/* The floor: oiled boards to the vanishing point. */}
      <polygon points={points([b.bl, b.br, corners.br, corners.bl])} fill="url(#museum-floor)" />
      <g stroke="#4a2810" strokeOpacity="0.45" strokeWidth="1.5">
        {boards.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <g stroke="#4a2810" strokeOpacity="0.25" strokeWidth="1">
        {joints.map((y, i) => (
          <line key={i} x1={0} y1={y} x2={w} y2={y} />
        ))}
      </g>
      {/* A warm pool of light on the floor under the skylight. */}
      <ellipse cx={l.vx} cy={(back.y1 + h) / 2} rx={w * 0.42} ry={(h - back.y1) * 0.42} fill="#ffe6a8" opacity="0.18" />
      {/* The doorways: on the left the way back (the shelf's room in the first room), on the right the next room. */}
      <Doorway layout={l} side="left" kind={left} />
      {right && <Doorway layout={l} side="right" kind="room" />}
    </svg>
  );
});

/** One doorway in a side wall: its frame, the light (or the shelf's room) beyond, and paw tracks walking into it. */
function Doorway({ layout: l, side, kind }: { layout: Layout; side: "left" | "right"; kind: "shelf" | "room" }) {
  const door = doorway(l, side);
  const frame = doorway(l, side, 0.885, 0.68);
  return (
    <g>
      <polygon points={points(frame)} fill="#5c3216" />
      <polygon points={points(door)} fill={kind === "shelf" ? "#f4e7cd" : "url(#museum-door-light)"} />
      {kind === "shelf" && (
        // The shelf's room beyond: its striped wallpaper and the shelf's edge.
        <g>
          <polygon points={points(door)} fill="#efdfc1" opacity="0.6" />
          <polygon
            points={points([
              door[1],
              [door[1][0] + (door[0][0] - door[1][0]) * 0.45, door[1][1]],
              [door[2][0] + (door[3][0] - door[2][0]) * 0.45, door[2][1]],
              door[2],
            ])}
            fill="#d4a874"
          />
        </g>
      )}
      {/* Paw tracks on the floor, a big one and a small one, walking into the doorway. */}
      <PawTrack layout={l} side={side} />
    </g>
  );
}

/** A trail of paw prints on the floor towards a doorway, a grown-up's and a child's side by side. */
function PawTrack({ layout: l, side }: { layout: Layout; side: "left" | "right" }) {
  const [x0, y0] = doorway(l, side)[3];
  const dir = side === "left" ? 1 : -1;
  const prints = [0, 1, 2].map((i) => {
    const x = x0 + dir * l.w * (0.07 + i * 0.045);
    const y = y0 - l.h * (0.03 - i * 0.012) + l.h * 0.01;
    const r = l.h * (0.012 + i * 0.002);
    return { x, y, r };
  });
  return (
    <g fill="#3a1e0e" opacity="0.35">
      {prints.map(({ x, y, r }, i) => (
        <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${side === "left" ? -70 : 70}) scale(${r / 10})`}>
          <ellipse cx="0" cy="4" rx="7" ry="6" />
          <ellipse cx="-7" cy="-5" rx="2.6" ry="3.4" />
          <ellipse cx="-2.5" cy="-9" rx="2.6" ry="3.4" />
          <ellipse cx="2.5" cy="-9" rx="2.6" ry="3.4" />
          <ellipse cx="7" cy="-5" rx="2.6" ry="3.4" />
        </g>
      ))}
    </g>
  );
}

/** What can be tapped of the doorways, laid over the drawn ones: on the left the way back, on the right the next room. */
function Doors({ layout: l, left, right, onWalk }: { layout: Layout; left: string; right?: string; onWalk: (side: "left" | "right") => void }) {
  return (
    <>
      {(["left", "right"] as const).map((side) => {
        const label = side === "left" ? left : right;
        if (!label) return null;
        const door = doorway(l, side, 0.92, 0.66);
        const xs = door.map(([x]) => x);
        const ys = door.map(([, y]) => y);
        const box = { left: Math.min(...xs), top: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
        return (
          <button
            key={side}
            type="button"
            className={`museum-door ${side}`}
            style={box}
            aria-label={label}
            title={label}
            data-tap=""
            onClick={() => onWalk(side)}
          >
            <ArrowArt side={side} />
          </button>
        );
      })}
    </>
  );
}

/** A big soft arrow on the floor of a doorway, pointing through it. */
function ArrowArt({ side }: { side: "left" | "right" }) {
  return (
    <svg className={`museum-door-arrow ${side}`} viewBox="0 0 40 40" aria-hidden>
      <path
        d={side === "right" ? "M12 8 L28 20 L12 32" : "M28 8 L12 20 L28 32"}
        fill="none"
        stroke="#fff8e6"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The row of plinths in a room, each with its trophy and its plate, centred in front of the back wall. */
function Plinths({
  layout: l,
  trophies,
  nameOf,
  onPick,
}: {
  layout: Layout;
  trophies: TrophyWon[];
  nameOf: (trophy: TrophyWon) => string | undefined;
  onPick: (trophy: TrophyWon, from: DOMRect) => void;
}) {
  const t = useT();
  const width = l.trophy * PLINTH_WIDE;
  const gap = l.trophy * PLINTH_GAP;
  const count = Math.max(trophies.length, 1);
  const start = l.vx - (count * width + (count - 1) * gap) / 2;
  const top = l.foot - l.plinth;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const trophy = trophies[i];
        const x = start + i * (width + gap);
        const game = trophy && gameOf(trophy.game);
        const gameName = game ? t(game.title) : "";
        const name = trophy ? nameOf(trophy) : undefined;
        return (
          <div
            key={trophy ? trophyKey(trophy.game, trophy.level) : "empty"}
            className="museum-stand"
            style={{ left: x, top, width, height: l.plinth, "--deep": `${(top - l.vy) * (1 - PLINTH_DEEP)}px` } as CSSProperties}
          >
            <PlinthArt layout={l} x={x} y={top} width={width} height={l.plinth} />
            {/* A warm light falling on it from above, painted still. */}
            <span className="museum-spot" />
            {trophy && (
              <>
                <button
                  type="button"
                  className="museum-trophy"
                  aria-label={[name, gameName].filter(Boolean).join(" – ")}
                  data-tap=""
                  onClick={(e) => onPick(trophy, e.currentTarget.getBoundingClientRect())}
                >
                  <Trophy game={trophy.game} level={trophy.level} wins={trophy.wins} />
                </button>
                <span className="museum-plate" aria-hidden>
                  {name && <span className="museum-plate-name">{name}</span>}
                  <span className={name ? "museum-plate-game" : "museum-plate-name"}>{gameName}</span>
                </span>
              </>
            )}
          </div>
        );
      })}
    </>
  );
}

/**
 * A plinth drawn in the room's perspective: its front, its top going back towards the vanishing point, and the side
 * that faces the room's middle. Its svg is as big as the box it stands in plus the room the top and side take.
 */
function PlinthArt({ layout: l, x, y, width, height }: { layout: Layout; x: number; y: number; width: number; height: number }) {
  const back = (px: number, py: number) => [l.vx + (px - l.vx) * PLINTH_DEEP, l.vy + (py - l.vy) * PLINTH_DEEP] as const;
  // In the plinth's own px, from the front's top left corner; the svg reaches a little beyond the front all round.
  const pad = width * 0.2;
  const local = ([px, py]: readonly [number, number]) => [px - x + pad, py - y + pad] as const;
  const fl = [x, y] as const;
  const fr = [x + width, y] as const;
  const bl = [x, y + height] as const;
  const br = [x + width, y + height] as const;
  const top = [fl, fr, back(...fr), back(...fl)].map(local);
  const side = x + width / 2 < l.vx ? [fr, back(...fr), back(...br), br].map(local) : [fl, back(...fl), back(...bl), bl].map(local);
  return (
    <svg
      className="museum-plinth"
      style={{ left: -pad, top: -pad, width: width + 2 * pad, height: height + 2 * pad }}
      viewBox={`0 0 ${width + 2 * pad} ${height + 2 * pad}`}
      aria-hidden
    >
      <ellipse cx={pad + width / 2} cy={pad + height} rx={width * 0.62} ry={width * 0.08} fill="#2a140866" />
      <polygon points={points(side)} fill="#cbbfa8" />
      <polygon points={points(top)} fill="#fbf6ec" stroke="#b8a888" strokeWidth="1" />
      <rect x={pad} y={pad} width={width} height={height} fill="url(#museum-plinth-front)" stroke="#b8a888" strokeWidth="1" />
      <rect x={pad} y={pad + height * 0.9} width={width} height={height * 0.1} fill="#d9cdb4" />
      <rect x={pad} y={pad} width={width} height={height * 0.06} fill="#fffaf0" />
    </svg>
  );
}

/**
 * A trophy shown big (a tap on it in the room): it comes from its plinth into the middle of the dimmed room, its plate
 * big under it with the level, the game, how often it was won and since when. A tap anywhere, or Esc, puts it back.
 */
function BigTrophy({ trophy, from, name, onClose }: { trophy: TrophyWon; from?: DOMRect; name?: string; onClose: () => void }) {
  const t = useT();
  const language = useAppLanguage();
  const art = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState<CSSProperties>();
  // From where it stood: measured before it is painted, so it grows out of its plinth (one transform).
  useLayoutEffect(() => {
    const box = art.current?.getBoundingClientRect();
    if (!from || !box || box.height <= 0) return;
    setStart({
      "--from-x": `${(from.left + from.width / 2 - (box.left + box.width / 2)).toFixed(1)}px`,
      "--from-y": `${(from.top + from.height / 2 - (box.top + box.height / 2)).toFixed(1)}px`,
      "--from-s": (from.height / box.height).toFixed(3),
    } as CSSProperties);
  }, [from]);
  const game = gameOf(trophy.game);
  const since = new Intl.DateTimeFormat(language.id, { day: "numeric", month: "long", year: "numeric" }).format(trophy.at);
  return (
    <div className="museum-big" role="dialog" aria-label={name ?? (game ? t(game.title) : "")}>
      {/* The whole screen puts it back: one tap anywhere. */}
      <button type="button" className="museum-big-close" aria-label={t({ en: "Put it back" })} onClick={onClose} />
      <div ref={art} className={`museum-big-trophy${from ? (start ? " grow" : " waiting") : ""}`} style={start}>
        <Trophy game={trophy.game} level={trophy.level} wins={trophy.wins} />
      </div>
      <div className="museum-big-plate">
        {name && <span className="museum-plate-name">{name}</span>}
        {game && <span className={name ? "museum-plate-game" : "museum-plate-name"}>{t(game.title)}</span>}
        {/* Since when, for the grown-ups; the test view's trophies were never won and have no day. */}
        {trophy.at > 1e12 && (
          <span className="museum-plate-since">
            {t({ en: "First won" })}: {since}
          </span>
        )}
      </div>
    </div>
  );
}
