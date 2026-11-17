import { type CSSProperties, memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FullscreenButton } from "@/components/FullscreenButton";
import { ShelfLabelArt } from "@/components/PageCornerArt";
import { Trophy } from "@/components/Trophy";
import { useLevelNames } from "@/components/trophyNames";
import { bookIdOf, CATEGORIES } from "@/content/games";
import { goBack } from "@/lib/goBack";
import { type Texts, useAppLanguage, useT } from "@/lib/language";
import { TROPHY_PARAM, TROPHY_ROOM, useMuseumTrophies } from "@/lib/museum";
import { useStepAddress } from "@/lib/stepAddress";
import { BACK_TO_SHELF } from "@/lib/sharedTexts";
import { gameOf, type TrophyWon, trophyKey } from "@/lib/trophies";
import "@/styles/museum.css";

/*
 * The trophy room (user request, November 2026): no menu over the shelf but a little museum next to it. One walks in
 * into a hall with a door and a sign for each category that has trophies; a tap on a door walks into that category's
 * room (user request, November 2026: grouped by category, no walking left and right). In a room the trophies stand on
 * tiers – as many as the number of trophies needs, each tier a board along the back wall with a small brass plate for
 * each level. A category with more trophies than a room shows big becomes a wing: its own hall with a door for each game.
 * The rooms are drawn in simple perspective – back wall, side walls, ceiling and a floor of boards running to one vanishing
 * point; the left doorway always leads one room back (the first one to the shelf), as does the round shelf label in the
 * top left. A tap on a trophy shows it big. Everything is drawn once and stands still; only walking through a door and a
 * trophy coming close move, by transforms and opacity.
 */

/** The vanishing point's height on the screen, and how big the back wall is against the screen round that point. */
const EYE = 0.42;
const BACK = 0.92;

/** How long a walk through a door takes, out of one room and into the next (`museum-walk-*` in museum.css). */
const WALK_MS = 420;

/** A trophy is at least this share of the screen's shorter side, or the medallion's picture is not recognised. */
const MIN_TROPHY = 0.13;

/** A trophy with its board and its plate is this many trophy heights tall; and this many wide per trophy width. */
const CELL_HIGH = 1.28;
const CELL_WIDE = 0.74;

/** How the rooms are drawn on a screen `w` × `h`: their walls, and the area of the back wall the tiers and doors stand in. */
export function museumLayout(w: number, h: number) {
  const vx = w / 2;
  const vy = h * EYE;
  const back = { x0: vx - vx * BACK, x1: vx + vx * BACK, y0: vy - vy * BACK, y1: vy + (h - vy) * BACK };
  // Under the room's sign, between the back wall's sides, down to its foot.
  const area = { x: back.x0 + w * 0.01, y: back.y0 + h * 0.14, w: back.x1 - back.x0 - w * 0.02, h: back.y1 - back.y0 - h * 0.14 };
  return { w, h, vx, vy, back, area };
}

/** The museum's measures on this screen. */
type Layout = ReturnType<typeof museumLayout>;

/** The smallest a trophy may be on this screen. */
const minTrophy = (l: Layout) => Math.min(l.w, l.h) * MIN_TROPHY;

/** How `count` trophies stand on tiers in a room: how many tiers, how many on each, how big each, and the cell it stands in. */
export function tierPlan(count: number, l: Layout) {
  let best = { rows: 1, per: Math.max(count, 1), trophy: 0, cellW: 0, cellH: 0 };
  for (let rows = 1; rows <= Math.max(count, 1); rows++) {
    const per = Math.ceil(count / rows);
    const cellW = l.area.w / per;
    const cellH = l.area.h / rows;
    const trophy = Math.min(cellH / CELL_HIGH, cellW / CELL_WIDE, l.h * 0.42);
    if (trophy > best.trophy) best = { rows, per, trophy, cellW, cellH };
  }
  return best;
}

/** One place in the museum with trophies in it: a category's room, a wing's game room or a wing's hall of `kids`. */
export interface MuseumNode {
  id: string;
  title: Texts;
  emoji: string;
  /** Every trophy behind this door, in the shelf's order of the games, each game's in the order they were won. */
  trophies: TrophyWon[];
  /** Where the trophies are too many for one room: a door for each game. */
  kids?: MuseumNode[];
}

/**
 * The hall's doors, one for each category with trophies, in the shelf's order. A category whose trophies would stand
 * smaller than `MIN_TROPHY` on `layout` is a wing with a door for each of its games.
 */
export function museumTree(trophies: TrophyWon[], layout: Layout): MuseumNode[] {
  const sorted = (list: TrophyWon[]) => [...list].sort((a, b) => a.at - b.at);
  return CATEGORIES.flatMap((category): MuseumNode[] => {
    const own = category.games.flatMap((game) => sorted(trophies.filter((trophy) => trophy.game === game.href)));
    if (!own.length) return [];
    const node: MuseumNode = { id: category.id, title: category.title, emoji: category.emoji, trophies: own };
    const games = category.games.filter((game) => own.some((trophy) => trophy.game === game.href));
    if (games.length > 1 && tierPlan(own.length, layout).trophy < minTrophy(layout)) {
      node.kids = games.map((game) => ({
        id: bookIdOf(game.href),
        title: game.title,
        emoji: game.emoji,
        trophies: own.filter((trophy) => trophy.game === game.href),
      }));
    }
    return [node];
  });
}

/** The node `path` (ids from the hall's doors on) leads to: undefined for the hall itself or a path that leads nowhere. */
function nodeAt(tree: MuseumNode[], path: string[]): MuseumNode | undefined {
  let list = tree;
  let found: MuseumNode | undefined;
  for (const id of path) {
    found = list.find((node) => node.id === id);
    if (!found) return undefined;
    list = found.kids ?? [];
  }
  return found;
}

/** The path to the room that holds the trophy `key`: its category's, or its game's where the category is a wing. */
function pathOfTrophy(tree: MuseumNode[], key: string): string[] {
  const walk = (list: MuseumNode[], path: string[]): string[] | undefined => {
    for (const node of list) {
      const here = [...path, node.id];
      if (node.kids) {
        const inKid = walk(node.kids, here);
        if (inKid) return inKid;
      } else if (node.trophies.some((trophy) => trophyKey(trophy.game, trophy.level) === key)) return here;
    }
  };
  return walk(tree, []) ?? [];
}

/** The trophy room: the hall and the rooms behind its doors, the way back to the shelf always in the top left. */
export function TrophyMuseum() {
  const t = useT();
  const language = useAppLanguage();
  const navigate = useNavigate();
  const { search } = useLocation();
  const trophies = useMuseumTrophies();
  const size = useScreen();
  const layout = useMemo(() => museumLayout(size.w, size.h), [size]);
  const tree = useMemo(() => museumTree(trophies, layout), [trophies, layout]);
  const names = useLevelNames(
    trophies.map((trophy) => trophy.game),
    language.id,
  );

  // The trophy named in the address (tapped at a level's end) opens big, in its room.
  const named = new URLSearchParams(search).get(TROPHY_PARAM);
  const [big, setBig] = useState<{ trophy: TrophyWon; from?: DOMRect } | undefined>(() => {
    const trophy = named ? trophies.find((one) => trophyKey(one.game, one.level) === named) : undefined;
    return trophy && { trophy };
  });
  // Where one stands: the ids of the doors walked through, none in the hall.
  const [path, setPath] = useState<string[]>(() => (named ? pathOfTrophy(tree, named) : []));
  const node = nodeAt(tree, path);
  const here = node ? path : [];
  useStepAddress(here.length ? here.join("-") : "hall");

  // Walking through a door: out of this room towards it, then into the next one.
  const [walk, setWalk] = useState<{ to: string[]; phase: "out" | "in"; origin: string }>();
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
  const walkTo = (to: string[], origin = "50% 62%") => {
    if (walk) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setPath(to);
    setWalk({ to, phase: "out", origin });
  };
  const [planOpen, setPlanOpen] = useState(false);
  const walkBack = () => (here.length ? walkTo(here.slice(0, -1), "8% 62%") : toShelf());
  useEffect(() => {
    if (!walk) return;
    const timer = setTimeout(() => {
      if (walk.phase === "out") {
        setPath(walk.to);
        setWalk({ ...walk, phase: "in" });
      } else setWalk(undefined);
    }, WALK_MS);
    return () => clearTimeout(timer);
  }, [walk]);

  // Left walks back, Esc puts a trophy shown big back.
  const keys = useRef<(e: KeyboardEvent) => void>(() => {});
  keys.current = (e) => {
    if (e.key === "Escape" && planOpen) setPlanOpen(false);
    else if (e.key === "Escape" && big) putBack();
    else if (big || planOpen) return;
    else if (e.key === "ArrowLeft") walkBack();
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => keys.current(e);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const shelfLabel = t(BACK_TO_SHELF);
  // Where the left door leads: the shelf from the hall, else the room one step up (the hall, or the wing's hall).
  const parent = here.length > 1 ? nodeAt(tree, here.slice(0, -1)) : undefined;
  const backName = here.length === 0 ? t({ en: "Bookshelf" }) : parent ? t(parent.title) : t({ en: "Hall" });
  const backLabel = here.length === 0 ? shelfLabel : backName;
  const doors = node ? node.kids : tree;
  const style = { "--ox": walk?.origin.split(" ")[0], "--oy": walk?.origin.split(" ")[1] } as CSSProperties;
  const plan = node && !node.kids ? tierPlan(node.trophies.length, layout) : undefined;

  return (
    <main className="museum" style={style}>
      <div className={`museum-scene${walk ? ` walk-${walk.phase}` : ""}`}>
        <RoomShell layout={layout} left={here.length === 0 ? "shelf" : "room"} />
        {/* The room's name once, on a sign on the back wall: the hall's, or the category's or game's. */}
        <span className="museum-room-sign" style={{ top: layout.back.y0 + layout.h * 0.02 }}>
          <span className="museum-room-name">
            {node ? (
              <>
                <span aria-hidden>{node.emoji}</span> {t(node.title)}
              </>
            ) : (
              t(TROPHY_ROOM)
            )}
          </span>
        </span>
        {doors && <HallDoors layout={layout} nodes={doors} onOpen={(next, from) => walkTo([...here, next], `${from.x.toFixed(0)}px ${from.y.toFixed(0)}px`)} />}
        {node && plan && (
          <Tiers
            layout={layout}
            plan={plan}
            trophies={node.trophies}
            nameOf={(trophy) => names(trophy.game, trophy.level)}
            showGame={new Set(node.trophies.map((trophy) => trophy.game)).size > 1}
            onPick={(trophy, from) => setBig({ trophy, from })}
          />
        )}
        <Door layout={layout} label={backLabel} name={backName} onWalk={walkBack} />
      </div>
      <button type="button" className="museum-exit" aria-label={shelfLabel} title={shelfLabel} onClick={toShelf}>
        <ShelfLabelArt />
      </button>
      <button
        type="button"
        className="museum-map-button"
        aria-label={t({ en: "Plan of the trophy rooms" })}
        title={t({ en: "Plan of the trophy rooms" })}
        onClick={() => setPlanOpen(true)}
      >
        <PlanIcon />
      </button>
      <FullscreenButton className="museum-fullscreen" />
      {planOpen && (
        <Plan
          tree={tree}
          here={here}
          onClose={() => setPlanOpen(false)}
          onShelf={toShelf}
          onGo={(to) => {
            setPlanOpen(false);
            if (to.join("/") !== here.join("/")) walkTo(to);
          }}
        />
      )}
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
function doorway(l: Layout, side: "left" | "right", near = 0.995, far = BACK + 0.02) {
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
const RoomShell = memo(function RoomShell({ layout: l, left }: { layout: Layout; left: "shelf" | "room" }) {
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
    </svg>
  );
});

/** One doorway in a side wall: its frame, the light (or the shelf's room) beyond, and paw tracks walking into it. */
function Doorway({ layout: l, side, kind }: { layout: Layout; side: "left" | "right"; kind: "shelf" | "room" }) {
  const door = doorway(l, side);
  const frame = doorway(l, side, 1, BACK);
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

/** The left doorway's tap: one room back, the shelf from the hall. Laid over the drawn doorway, with a soft arrow on its floor. */
function Door({ layout: l, label, name, onWalk }: { layout: Layout; label: string; name: string; onWalk: () => void }) {
  const door = doorway(l, "left", 1, BACK - 0.02);
  const xs = door.map(([x]) => x);
  const ys = door.map(([, y]) => y);
  const box = { left: Math.min(...xs), top: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
  return (
    <button type="button" className="museum-door left" style={box} aria-label={label} title={label} data-tap="" onClick={onWalk}>
      <span className="museum-door-sign" aria-hidden>
        ← {name}
      </span>
      <svg className="museum-door-arrow" viewBox="0 0 40 40" aria-hidden>
        <path d="M28 8 L12 20 L28 32" fill="none" stroke="#fff8e6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/**
 * The doors of a hall (the museum's, or a wing's), side by side in one or two rows along the back wall, each under a
 * sign with its name and how many trophies are behind it. A tap walks through it.
 */
function HallDoors({ layout: l, nodes, onOpen }: { layout: Layout; nodes: MuseumNode[]; onOpen: (id: string, from: { x: number; y: number }) => void }) {
  const t = useT();
  const rows = nodes.length > 6 ? 2 : 1;
  const per = Math.ceil(nodes.length / rows);
  const cellW = l.area.w / Math.max(per, 1);
  const cellH = l.area.h / rows;
  // The sign above takes a fifth of the cell, the door the rest, as wide as it is tall allows.
  const door = Math.min(cellH * 0.72, (cellW * 0.8) / 0.62);
  return (
    <>
      {nodes.map((node, i) => {
        const row = Math.floor(i / per);
        const inRow = row === rows - 1 ? nodes.length - per * (rows - 1) : per;
        const x = l.vx - (inRow * cellW) / 2 + (i - row * per) * cellW;
        const y = l.area.y + row * cellH;
        const name = t(node.title);
        return (
          <button
            key={node.id}
            type="button"
            className="museum-hall-door"
            style={{ left: x, top: y, width: cellW, height: cellH, "--door": `${door}px` } as CSSProperties}
            aria-label={name}
            data-tap=""
            onClick={(e) => {
              const box = e.currentTarget.getBoundingClientRect();
              onOpen(node.id, { x: box.left + box.width / 2, y: box.top + box.height / 2 });
            }}
          >
            <span className="museum-hall-sign">
              <span aria-hidden>{node.emoji}</span> {name}
            </span>
            <svg className="museum-hall-door-art" viewBox="0 0 62 100" aria-hidden>
              <path d="M2 100 V34 A29 29 0 0 1 60 34 V100 Z" fill="#5c3216" />
              <path d="M7 100 V34 A24 24 0 0 1 55 34 V100 Z" fill="url(#museum-door-light)" />
              <path d="M7 100 V34 A24 24 0 0 1 31 10 V100 Z" fill="#8a5a2c" />
              <circle cx="25" cy="64" r="2.4" fill="#f2d27a" />
              <path d="M31 10 V100" stroke="#4a2810" strokeWidth="1.5" />
            </svg>
            <span className="museum-hall-count" aria-hidden>
              🏆 {node.trophies.length}
            </span>
          </button>
        );
      })}
    </>
  );
}

/**
 * The trophies of a room on `plan.rows` tiers: each tier a wooden board along the back wall, the trophies standing on it,
 * a small brass plate under each with its level's name (the game's too where the room holds several games' – the category
 * stands on the room's sign once and is not said again here).
 */
function Tiers({
  layout: l,
  plan,
  trophies,
  nameOf,
  showGame,
  onPick,
}: {
  layout: Layout;
  plan: ReturnType<typeof tierPlan>;
  trophies: TrophyWon[];
  nameOf: (trophy: TrophyWon) => string | undefined;
  showGame: boolean;
  onPick: (trophy: TrophyWon, from: DOMRect) => void;
}) {
  const t = useT();
  const { rows, per, trophy: size, cellW, cellH } = plan;
  return (
    <div className="museum-tiers" style={{ "--trophy": `${size}px`, "--cell": `${cellW}px` } as CSSProperties}>
      {Array.from({ length: rows }, (_, row) => {
        const inRow = trophies.slice(row * per, (row + 1) * per);
        const top = l.area.y + row * cellH + (cellH - size * CELL_HIGH) / 2;
        return (
          <div key={row} className="museum-tier" style={{ top, height: size * CELL_HIGH }}>
            <span className="museum-board" style={{ top: size }} />
            {inRow.map((trophy, i) => {
              const game = gameOf(trophy.game);
              const gameName = game ? t(game.title) : "";
              const name = nameOf(trophy);
              const x = l.vx - (inRow.length * cellW) / 2 + i * cellW;
              return (
                <div key={trophyKey(trophy.game, trophy.level)} className="museum-stand" style={{ left: x, width: cellW }}>
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
                    <span className="museum-plate-name">{name ?? gameName}</span>
                    {name && showGame && <span className="museum-plate-game">{gameName}</span>}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/** A small floor plan for the map button: three rooms joined by a corridor. */
function PlanIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <g fill="none" stroke="#3a2410" strokeWidth="2.2" strokeLinejoin="round">
        <rect x="3" y="12" width="9" height="8" />
        <rect x="20" y="3" width="9" height="8" />
        <rect x="20" y="21" width="9" height="8" />
        <path d="M12 16 H16 M16 7 V25 M16 7 H20 M16 25 H20" />
      </g>
    </svg>
  );
}

/**
 * The plan of the whole museum (the map button, top right): the shelf, the hall, every category's room and the game
 * rooms of the wings, joined as the doors join them, the room one is in marked. A tap on a room walks there at once, so a
 * grown-up finds a trophy's room without opening doors one after the other.
 */
function Plan({
  tree,
  here,
  onGo,
  onShelf,
  onClose,
}: {
  tree: MuseumNode[];
  here: string[];
  onGo: (path: string[]) => void;
  onShelf: () => void;
  onClose: () => void;
}) {
  const t = useT();
  const now = here.join("/");
  const room = (path: string[], label: string, emoji: string, count?: number) => {
    const key = path.join("/");
    return (
      <button
        type="button"
        key={key}
        className={`museum-plan-room${key === now ? " here" : ""}`}
        aria-current={key === now ? "location" : undefined}
        onClick={() => onGo(path)}
      >
        {key === now && <span className="museum-plan-here">{t({ en: "You are here" })}</span>}
        <span>
          <span aria-hidden>{emoji}</span> {label}
        </span>
        {count !== undefined && (
          <span className="museum-plan-count" aria-hidden>
            🏆 {count}
          </span>
        )}
      </button>
    );
  };
  return (
    <div className="museum-plan" role="dialog" aria-label={t({ en: "Plan of the trophy rooms" })}>
      <button type="button" className="museum-big-close" aria-label={t({ en: "Close" })} onClick={onClose} />
      <div className="museum-plan-card">
        <div className="museum-plan-map">
          <button type="button" className="museum-plan-room shelf" onClick={onShelf}>
            <span>
              <span aria-hidden>📚</span> {t({ en: "Bookshelf" })}
            </span>
          </button>
          <span className="museum-plan-link" aria-hidden />
          {room([], t({ en: "Hall" }), "🏛️")}
          <span className="museum-plan-link" aria-hidden />
          <ul className="museum-plan-rooms">
            {tree.map((node) => (
              <li key={node.id}>
                {room([node.id], t(node.title), node.emoji, node.trophies.length)}
                {node.kids && (
                  <>
                    <span className="museum-plan-link" aria-hidden />
                    <ul className="museum-plan-kids">
                      {node.kids.map((kid) => (
                        <li key={kid.id}>{room([node.id, kid.id], t(kid.title), kid.emoji, kid.trophies.length)}</li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
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
        {/* A magnifying glass over the trophy tapped: its lens opens out and the trophy grows to fill the room. */}
        <div className="museum-lens">
          <Trophy game={trophy.game} level={trophy.level} wins={trophy.wins} />
        </div>
        {from && <span className="museum-lens-rim" aria-hidden />}
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
