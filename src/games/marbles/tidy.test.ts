import { describe, expect, test } from "bun:test";
import { BED, BELLOWS, BLOCKS, BOOK_LEN, BOOKS, buildTidy, CHEST, IN_BED, IN_THE_CHEST, LID_FOOT, SHELF, TRUCK } from "./tidy";

describe("Aufräum-Maschine", () => {
  const tidy = buildTidy();
  const end = tidy.duration;

  test("the machine runs about twenty seconds and ends after everything else", () => {
    expect(end).toBeGreaterThan(16);
    expect(end).toBeLessThan(40);
    expect(Math.max(...tidy.events.map((e) => e.at))).toBe(end);
  });

  test("the mess lies where the machine gets to it: blocks before the lid, books between the truck and the bellows", () => {
    for (const b of BLOCKS) expect(b.x + 32).toBeLessThan(LID_FOOT.x);
    for (const b of BOOKS) {
      expect(b.x).toBeGreaterThan(TRUCK.back0 + TRUCK.len);
      expect(b.x + BOOK_LEN).toBeLessThan(BELLOWS.x0);
    }
  });

  test("at the end every block and the ball are in the chest, every book stands in the shelf and the bunny lies in bed", () => {
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

  test("things happen one after the other: blocks, the ball in the chest, the lid, the books, the bellows, the bunny", () => {
    const order = [tidy.tKick, tidy.tTop, tidy.tBallIn, tidy.tShut, tidy.tGo, tidy.tStop, tidy.tRollOn, tidy.tPump, tidy.tLaunch, tidy.tLand, tidy.tGlitter];
    order.slice(1).forEach((t, k) => {
      expect(t).toBeGreaterThan(order[k]);
    });
    // The truck stops with its pile of books right in front of the bellows, and later rolls on, but not into the shelf.
    expect(tidy.truckFront(tidy.tStop) + BOOK_LEN).toBeLessThan(BELLOWS.x0);
    expect(tidy.truckFront(end)).toBeLessThanOrEqual(SHELF.x0);
  });

  test("the camera stays inside the room", () => {
    for (let t = -1; t <= end; t += 0.1) {
      expect(tidy.cameraTarget(t)).toBeGreaterThanOrEqual(0);
    }
  });
});
