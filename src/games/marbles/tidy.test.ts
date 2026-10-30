import { describe, expect, test } from "bun:test";
import {
  BASKET,
  BED,
  BELLOWS,
  BLOCKS,
  BOOK_LEN,
  BOOKS,
  buildTidy,
  CHEST,
  CRAYON,
  CRAYONS,
  CUSHION,
  FLOOR,
  IN_BED,
  IN_THE_CHEST,
  LID_FOOT,
  NOZZLE,
  PIECES,
  PLUG,
  POT,
  PUZZLE,
  PUZZLE_X1,
  SHELF,
  SOCK_BALL_R,
  SOCK_HALF,
  SOCKS,
  slotCentre,
  STOOL,
  TRUCK,
  WORLD_W,
} from "./tidy";

describe("Aufräum-Maschine", () => {
  const tidy = buildTidy();
  const end = tidy.duration;

  test("the machine runs 32–36 seconds and ends after everything else", () => {
    expect(end).toBeGreaterThan(32);
    expect(end).toBeLessThan(36);
    expect(Math.max(...tidy.events.map((e) => e.at))).toBe(end);
    expect(tidy.events[tidy.events.length - 1].done).toBe(true);
  });

  test("the mess lies where the machine gets to it", () => {
    // Blocks before the lid, books between the truck and the bellows.
    for (const b of BLOCKS) expect(b.x + 32).toBeLessThan(LID_FOOT.x);
    for (const b of BOOKS) {
      expect(b.x).toBeGreaterThan(TRUCK.back0 + TRUCK.len);
      expect(b.x + BOOK_LEN).toBeLessThan(BELLOWS.x0);
    }
    // The socks lie in a heap round the hose's end, past the shelf and before the basket.
    for (const s of SOCKS) {
      expect(Math.abs(s.x - NOZZLE.x)).toBeLessThan(80);
      expect(s.x - SOCK_HALF).toBeGreaterThan(SHELF.x1);
      expect(s.x + SOCK_HALF).toBeLessThan(BASKET.x0);
      expect(s.y + SOCK_HALF).toBeLessThanOrEqual(FLOOR);
    }
    // Then the crayons round the stool, then the puzzle pieces, then the cushion and the bed, none overlapping.
    const lastCrayon = CRAYONS[CRAYONS.length - 1];
    expect(CRAYONS[0].x - CRAYON.len / 2).toBeGreaterThan(BASKET.x1);
    expect(STOOL.x).toBeGreaterThan(CRAYONS[0].x);
    expect(STOOL.x).toBeLessThan(lastCrayon.x);
    expect(lastCrayon.x + CRAYON.len / 2).toBeLessThan(PIECES[0].x - PUZZLE.w / 2);
    expect(PIECES[PIECES.length - 1].x + PUZZLE.w / 2).toBeLessThan(PLUG.x - 2 * SOCK_BALL_R);
    expect(CUSHION.x1).toBeLessThan(BED.x0);
    expect(BED.x1).toBeLessThan(WORLD_W);
    // Every piece has its own slot.
    expect(new Set(PIECES.map((p) => p.slot)).size).toBe(PUZZLE.cols * PUZZLE.rows);
  });

  test("at the end everything is tidy: blocks and ball in the chest, books in the shelf, socks in the basket, crayons in the pot, the puzzle whole, the bunny in bed", () => {
    BLOCKS.forEach((_, i) => {
      expect(tidy.blockAt(i, end).pt).toEqual(IN_THE_CHEST.blocks[i]);
    });
    expect(tidy.ballAt(end).pt).toEqual(IN_THE_CHEST.ball);
    BOOKS.forEach((_, j) => {
      const { pt, angle } = tidy.bookAt(j, end);
      expect(angle).toBe(-90);
      expect(pt.x).toBeGreaterThan(SHELF.x0 + 18);
      expect(pt.x).toBeLessThan(SHELF.x1 - 18);
      expect(pt.y + BOOK_LEN / 2).toBe(SHELF.board);
    });
    SOCKS.forEach((_, k) => {
      const { pt } = tidy.sockAt(k, end);
      expect(pt.x - SOCK_HALF).toBeGreaterThan(BASKET.x0);
      expect(pt.x + SOCK_HALF).toBeLessThan(BASKET.x1);
      expect(pt.y).toBeGreaterThan(BASKET.top - 10);
      expect(pt.y + SOCK_HALF).toBeLessThan(FLOOR);
    });
    CRAYONS.forEach((_, k) => {
      const { pt, angle } = tidy.crayonAt(k, end);
      expect(Math.abs(pt.x - POT.x)).toBeLessThan(POT.w / 2 - CRAYON.th / 2);
      // Standing tip up, with its tip out of the pot and its end inside it.
      expect(Math.abs(angle + 90)).toBeLessThan(20);
      expect(pt.y - CRAYON.len / 2).toBeLessThan(STOOL.top - POT.h);
      expect(pt.y + CRAYON.len / 2 - 8).toBeGreaterThan(STOOL.top - POT.h);
    });
    PIECES.forEach((p, i) => {
      const { pt, angle, flat } = tidy.pieceAt(i, end);
      expect(pt).toEqual(slotCentre(p.slot));
      expect(Math.abs(angle % 360)).toBe(0);
      expect(flat).toBe(1);
    });
    const bunny = tidy.bunnyAt(end);
    expect(bunny.pt).toEqual(IN_BED);
    expect(bunny.angle % 360).toBe(90);
    expect(IN_BED.x).toBeGreaterThan(BED.x0);
    expect(IN_BED.x).toBeLessThan(BED.x1);
  });

  test("everything in the chest is hidden below its rim", () => {
    for (const p of IN_THE_CHEST.blocks) expect(p.y - 32).toBeGreaterThan(CHEST.top);
    expect(IN_THE_CHEST.ball.y - 36).toBeGreaterThan(CHEST.top);
  });

  test("things happen one after the other: chest, lid, books, bellows, socks, sock ball, crayons, puzzle, plug, bunny, glitter", () => {
    const order = [
      tidy.tKick,
      tidy.tTop,
      tidy.tBallIn,
      tidy.tShut,
      tidy.tGo,
      tidy.tStop,
      tidy.tRollOn,
      tidy.tPump,
      tidy.tSocksIn,
      tidy.tBallOff,
      tidy.tHit,
      tidy.tRoll,
      tidy.tCrayonsIn,
      tidy.tPuzzle,
      tidy.tPop,
      tidy.tLaunch,
      tidy.tLand,
      tidy.tGlitter,
    ];
    order.slice(1).forEach((t, k) => {
      expect(t).toBeGreaterThan(order[k]);
    });
    // The truck stops with its pile of books right in front of the bellows, and later rolls on, but not into the shelf.
    expect(tidy.truckFront(tidy.tStop) + BOOK_LEN).toBeLessThan(BELLOWS.x0);
    expect(tidy.truckFront(end)).toBeLessThanOrEqual(SHELF.x0);
  });

  test("the bellows is pressed once for each sock and once for the sock ball, and each sock flies only after a puff", () => {
    let presses = 0;
    let last = tidy.squash(tidy.tPump - 0.01);
    let rising = true;
    for (let t = tidy.tPump - 0.01; t < tidy.tBallOff; t += 0.01) {
      const s = tidy.squash(t);
      if (rising && s < last - 1e-6) {
        presses++;
        rising = false;
      }
      if (s > last + 1e-6) rising = true;
      last = s;
    }
    // Between the six presses the bellows springs up five times; after the last one it stays flat.
    expect(presses).toBe(SOCKS.length);
    expect(tidy.squash(tidy.tBallOff)).toBe(1);
    SOCKS.forEach((s, k) => {
      expect(tidy.sockAt(k, tidy.tPump).pt).toEqual({ x: s.x, y: s.y });
    });
  });

  test("the sock ball bounces off the full basket, rolls in front of everything and really reaches the plug", () => {
    const hit = tidy.sockBallAt(tidy.tHit).pt;
    expect(hit.x).toBeGreaterThan(BASKET.x0);
    expect(hit.x).toBeLessThan(BASKET.x1);
    expect(hit.y + SOCK_BALL_R).toBeLessThan(BASKET.top);
    const atPlug = tidy.sockBallAt(tidy.tPop).pt;
    expect(atPlug.x + SOCK_BALL_R).toBeCloseTo(PLUG.x, 0);
    expect(Math.abs(atPlug.y - PLUG.y)).toBeLessThan(SOCK_BALL_R);
    for (let t = 0; t <= end; t += 0.05) {
      const { pt } = tidy.sockBallAt(t);
      expect(pt.x - SOCK_BALL_R).toBeGreaterThan(0);
      expect(pt.x + SOCK_BALL_R).toBeLessThanOrEqual(WORLD_W);
      expect(pt.y + SOCK_BALL_R).toBeLessThanOrEqual(FLOOR + 0.01);
      // Once out of the plug's way, it never runs into the cushion or the plug's cap.
      expect(pt.x + SOCK_BALL_R).toBeLessThanOrEqual(PLUG.x + 0.5);
    }
    const cap = tidy.capAt(end).pt;
    expect(cap.x + 10).toBeLessThan(tidy.sockBallAt(end).pt.x - SOCK_BALL_R);
  });

  test("each crayon and puzzle piece hops when the ball gets to it, and stays inside the room", () => {
    CRAYONS.forEach((c, k) => {
      const ballX = (t: number) => tidy.sockBallAt(t).pt.x;
      // Still on the floor until the ball is close, then up.
      let start = -1;
      for (let t = tidy.tRoll; t < tidy.tPop; t += 0.01) {
        if (tidy.crayonAt(k, t).pt.y < FLOOR - CRAYON.th) {
          start = t;
          break;
        }
      }
      expect(start).toBeGreaterThan(0);
      expect(Math.abs(ballX(start) + SOCK_BALL_R - (c.x - CRAYON.len / 2))).toBeLessThan(30);
    });
    for (let t = 0; t <= end; t += 0.05) {
      CRAYONS.forEach((_, k) => {
        const { pt } = tidy.crayonAt(k, t);
        expect(pt.y).toBeGreaterThan(0);
        expect(pt.y).toBeLessThanOrEqual(FLOOR);
      });
      PIECES.forEach((_, i) => {
        const { pt } = tidy.pieceAt(i, t);
        expect(pt.y).toBeGreaterThan(0);
        expect(pt.y).toBeLessThanOrEqual(FLOOR);
      });
      SOCKS.forEach((_, k) => {
        const { pt } = tidy.sockAt(k, t);
        expect(pt.y - SOCK_HALF).toBeGreaterThan(0);
        expect(pt.y + SOCK_HALF).toBeLessThanOrEqual(FLOOR + 0.01);
      });
    }
    // The pieces land in the board, which stands on the floor.
    expect(PUZZLE.top + 2 * PUZZLE.frame + PUZZLE.rows * PUZZLE.h).toBeLessThanOrEqual(FLOOR);
    expect(PUZZLE_X1).toBeLessThan(PLUG.x);
  });

  test("the camera stays inside the room and ends on the puzzle, the cushion and the bed", () => {
    for (let t = -1; t <= end; t += 0.1) {
      expect(tidy.cameraTarget(t)).toBeGreaterThanOrEqual(0);
      expect(tidy.cameraTarget(t)).toBeLessThanOrEqual(WORLD_W - 1600);
    }
    const left = tidy.cameraTarget(end);
    expect(left).toBeLessThan(PUZZLE.x0);
    expect(left + 1600).toBeGreaterThan(BED.x1);
  });
});
