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
  CLOWN,
  CRANK,
  CRAYON,
  CRAYONS,
  CRUMBS,
  CUSHION,
  FLOOR,
  HANGER_STOP,
  IN_BED,
  IN_THE_CHEST,
  JACK,
  LID_FOOT,
  LINE,
  NOZZLE,
  PIECES,
  PLUG,
  POT,
  PUZZLE,
  PUZZLE_X1,
  PYJAMAS,
  ROBOT,
  RUG,
  RULER,
  SHELF,
  SLINKY,
  SOCK_BALL_R,
  SOCK_HALF,
  SOCKS,
  STEPS,
  slotCentre,
  STOOL,
  TRUCK,
  WORLD_W,
} from "./tidy";

describe("Aufräum-Maschine", () => {
  const tidy = buildTidy();
  const end = tidy.duration;

  test("the machine runs 56–64 seconds and ends after everything else", () => {
    expect(end).toBeGreaterThan(56);
    expect(end).toBeLessThan(64);
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
    // Then the crayons round the stool, then the puzzle pieces, the rug, the jack-in-the-box, the step stool, the ruler,
    // the vacuum with its crumbs, then the cushion and the bed, none overlapping.
    const lastCrayon = CRAYONS[CRAYONS.length - 1];
    expect(CRAYONS[0].x - CRAYON.len / 2).toBeGreaterThan(BASKET.x1);
    expect(STOOL.x).toBeGreaterThan(CRAYONS[0].x);
    expect(STOOL.x).toBeLessThan(lastCrayon.x);
    expect(lastCrayon.x + CRAYON.len / 2).toBeLessThan(PIECES[0].x - PUZZLE.w / 2);
    expect(PIECES[PIECES.length - 1].x + PUZZLE.w / 2).toBeLessThan(RUG.x - RUG.r0 - 2 * SOCK_BALL_R);
    expect(RUG.end + RUG.r1).toBeLessThan(JACK.x0);
    expect(JACK.x0 + JACK.w).toBeLessThan(STEPS[0].x0);
    expect(STEPS[STEPS.length - 1].x1).toBeLessThan(RULER.x - RULER.half);
    expect(RULER.x + RULER.half).toBeLessThan(ROBOT.x - ROBOT.w / 2);
    expect(CRUMBS[0].x).toBeGreaterThan(ROBOT.x + ROBOT.w / 2);
    expect(CRUMBS[CRUMBS.length - 1].x).toBeLessThan(PLUG.x);
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

  test("things happen one after the other: chest, lid, books, bellows, socks, sock ball, crayons, puzzle, rug, clown, pyjamas, slinky, ruler, plane, vacuum, plug, bunny, glitter", () => {
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
      tidy.tRug,
      tidy.tRugEnd,
      tidy.tJack,
      tidy.tNudge,
      tidy.tSlide,
      tidy.tArrive,
      tidy.tFeet,
      tidy.tOnRuler,
      tidy.tSnap,
      tidy.tPlaneDown,
      tidy.tWake,
      tidy.tDrive,
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

  test("the sock ball bounces off the full basket, rolls in front of everything and really reaches the rug", () => {
    const hit = tidy.sockBallAt(tidy.tHit).pt;
    expect(hit.x).toBeGreaterThan(BASKET.x0);
    expect(hit.x).toBeLessThan(BASKET.x1);
    expect(hit.y + SOCK_BALL_R).toBeLessThan(BASKET.top);
    const atRug = tidy.sockBallAt(tidy.tRug).pt;
    const roll = tidy.rugAt(tidy.tRug);
    expect(Math.hypot(atRug.x - roll.pt.x, atRug.y - roll.pt.y)).toBeCloseTo(RUG.r0 + SOCK_BALL_R, 0);
    for (let t = 0; t <= end; t += 0.05) {
      const { pt } = tidy.sockBallAt(t);
      expect(pt.x - SOCK_BALL_R).toBeGreaterThan(0);
      expect(pt.x + SOCK_BALL_R).toBeLessThanOrEqual(WORLD_W);
      expect(pt.y + SOCK_BALL_R).toBeLessThanOrEqual(FLOOR + 0.01);
      // It never runs into the rug's roll.
      expect(pt.x).toBeLessThanOrEqual(atRug.x + 0.01);
    }
    // The plug's cap lands on the floor behind the vacuum, never on it.
    const cap = tidy.capAt(end).pt;
    expect(cap.x + 10).toBeLessThan(tidy.robotX(end) - ROBOT.w / 2);
  });

  test("the rug unrolls up to the crank's knob, and the clown, popping out after the crank's turn, nudges the pyjamas' leg", () => {
    // Before the bump the rug lies rolled up; it unrolls only forward, getting thinner.
    expect(tidy.rugAt(tidy.tRug).pt.x).toBe(RUG.x);
    for (let t = tidy.tRug; t < tidy.tRugEnd; t += 0.05) {
      expect(tidy.rugAt(t + 0.05).pt.x).toBeGreaterThan(tidy.rugAt(t).pt.x);
      expect(tidy.rugAt(t + 0.05).r).toBeLessThan(tidy.rugAt(t).r);
    }
    const roll = tidy.rugAt(tidy.tRugEnd);
    const knob = { x: CRANK.x, y: CRANK.y + CRANK.arm };
    expect(Math.abs(Math.hypot(roll.pt.x - knob.x, roll.pt.y - knob.y) - (roll.r + CRANK.knob))).toBeLessThan(5);
    expect(tidy.crankTurn(tidy.tRugEnd)).toBeCloseTo(0, 6);
    expect(tidy.crankTurn(tidy.tJack)).toBe(-360);
    // The clown stays hidden below the box's rim until the pop, the tip of its hat too, and its collar above the floor.
    const hidden = tidy.clownHead(tidy.tJack - 0.01);
    expect(hidden.y - CLOWN.head - CLOWN.hat).toBeGreaterThan(FLOOR - JACK.h);
    expect(hidden.y + CLOWN.head + 6).toBeLessThan(FLOOR);
    // At the nudge the head touches the pyjamas' near leg from the left, at the leg's height.
    const head = tidy.clownHead(tidy.tNudge);
    const { hook, swing } = tidy.hangerAt(tidy.tNudge);
    expect(swing).toBe(0);
    const legLeft = hook.x - PYJAMAS.leg - 15;
    expect(Math.abs(legLeft - (head.x + CLOWN.head))).toBeLessThan(6);
    expect(head.y).toBeGreaterThan(hook.y + PYJAMAS.top - 10);
    expect(head.y).toBeLessThan(hook.y + PYJAMAS.feet);
    // Before the nudge it never reaches into the leg.
    for (let t = tidy.tJack; t < tidy.tNudge; t += 0.02) expect(tidy.clownHead(t).x + CLOWN.head).toBeLessThan(legLeft + 3);
  });

  test("the pyjamas zip down the line to its knot, and their foot kicks the slinky on the top step", () => {
    for (let t = tidy.tNudge; t <= tidy.tArrive; t += 0.05) {
      const { hook } = tidy.hangerAt(t);
      expect(hook.x).toBeGreaterThanOrEqual(LINE.x0);
      expect(hook.x).toBeLessThanOrEqual(HANGER_STOP + 0.01);
    }
    expect(tidy.hangerAt(tidy.tArrive).hook.x).toBeCloseTo(HANGER_STOP, 0);
    // The kick: the foot's outer side touches the slinky's side, below its top.
    const foot = tidy.footAt(tidy.tFeet);
    const slinky = tidy.slinkyAt(tidy.tFeet - 0.01);
    expect(Math.abs(foot.x + 15 - (slinky.a.x - SLINKY.w / 2))).toBeLessThan(1);
    expect(foot.y).toBeGreaterThan(STEPS[0].top - SLINKY.h);
    expect(foot.y).toBeLessThan(STEPS[0].top);
    // Before the kick the foot never gets into the slinky.
    for (let t = tidy.tArrive; t < tidy.tFeet; t += 0.01) expect(tidy.footAt(t).x + 15).toBeLessThan(slinky.a.x - SLINKY.w / 2 + 0.5);
  });

  test("the slinky walks down each step, onto the floor and onto the ruler's raised end, which flings the plane onto the vacuum's button", () => {
    const spots = tidy.slinkySpots;
    expect(spots.length).toBe(STEPS.length + 2);
    STEPS.forEach((s, k) => {
      expect(spots[k].y).toBe(s.top);
      expect(spots[k].x - SLINKY.w / 2).toBeGreaterThan(s.x0 - 4);
      expect(spots[k].x + SLINKY.w / 2).toBeLessThan(s.x1 + 4);
    });
    const floor = spots[STEPS.length];
    expect(floor.y).toBe(FLOOR);
    expect(floor.x - SLINKY.w / 2).toBeGreaterThan(STEPS[STEPS.length - 1].x1);
    expect(floor.x + SLINKY.w / 2).toBeLessThan(RULER.x - RULER.half);
    // Standing on the ruler's left end, which is up until it lands there.
    const onRuler = tidy.slinkyAt(tidy.tOnRuler).a;
    expect(onRuler.x).toBeGreaterThan(RULER.x - RULER.half);
    expect(onRuler.x).toBeLessThan(RULER.x);
    expect(tidy.rulerTilt(tidy.tOnRuler)).toBe(RULER.tilt);
    expect(tidy.rulerTilt(tidy.tOnRuler + 0.3)).toBeLessThan(0);
    // The plane waits on the ruler's other end, flies inside the room and lands on the vacuum's button.
    expect(tidy.planeAt(tidy.tSnap - 0.01).pt.x).toBeGreaterThan(RULER.x);
    for (let t = tidy.tSnap; t < tidy.tPlaneDown; t += 0.02) {
      const { pt } = tidy.planeAt(t);
      expect(pt.y).toBeGreaterThan(40);
      expect(pt.y).toBeLessThan(FLOOR);
      expect(pt.x).toBeGreaterThan(0);
      expect(pt.x).toBeLessThan(WORLD_W);
    }
    const down = tidy.planeAt(tidy.tPlaneDown).pt;
    expect(Math.abs(down.x - ROBOT.x)).toBeLessThan(20);
    expect(Math.abs(down.y - (FLOOR - ROBOT.h - 9))).toBeLessThan(2);
  });

  test("the vacuum sweeps up every crumb on its way and knocks the plug out with its front", () => {
    expect(tidy.robotX(tidy.tDrive)).toBe(ROBOT.x);
    expect(tidy.robotX(tidy.tPop) + ROBOT.w / 2).toBeCloseTo(PLUG.x, 0);
    CRUMBS.forEach((_, i) => {
      expect(tidy.crumbAt(i, tidy.tDrive)).not.toBeNull();
      expect(tidy.crumbAt(i, tidy.tPop)).toBeNull();
    });
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

  test("the camera stays inside the room and ends on the vacuum, the cushion and the bed", () => {
    for (let t = -1; t <= end; t += 0.1) {
      expect(tidy.cameraTarget(t)).toBeGreaterThanOrEqual(0);
      expect(tidy.cameraTarget(t)).toBeLessThanOrEqual(WORLD_W - 1600);
    }
    const left = tidy.cameraTarget(end);
    expect(left).toBeLessThan(PLUG.x - 300);
    expect(left + 1600).toBeGreaterThan(BED.x1);
  });
});
