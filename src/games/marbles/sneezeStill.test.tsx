import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { heavyTest } from "@/heavyTest";
import { DONE_AFTER_LAUGH_S, LAUGH_S, PART2 } from "./sneeze";
import { held, PART2_SPANS, PastTheTree } from "./SneezeLevel";

/**
 * The Hatschi-Kette draws each thing past the tree at a held moment while it rests (A-44), so React skips it in that
 * frame. That is right only if the held moment draws exactly what the moment itself would: a span ending too early
 * would freeze a thing mid-move.
 */
describe("Hatschi-Kette: things past the tree rest between their spans", () => {
  const draw = (u: number, hold: boolean) => renderToStaticMarkup(<PastTheTree x={6000} u={u} tapped={() => 1} hold={hold} />);

  // About a second: every 20 ms of the second part drawn twice.
  heavyTest("each thing at its held moment looks exactly as at the moment itself", () => {
    const end = PART2.laugh + LAUGH_S + DONE_AFTER_LAUGH_S + 2;
    const wrong: number[] = [];
    for (let u = -3; u <= end; u += 0.02) if (draw(u, true) !== draw(u, false)) wrong.push(Math.round(u * 100) / 100);
    expect(draw(-100, true)).toBe(draw(-100, false));
    expect(wrong).toEqual([]);
  });

  test("a held moment stays the same between two spans, before the first and inside one moves on", () => {
    const spans = PART2_SPANS.tortoise;
    expect(held(-100, spans)).toBe(-100);
    expect(held(PART2.sniff - 0.1, spans)).toBe(-100);
    expect(held(PART2.sniff + 1, spans)).toBe(PART2.sniff + 1);
    expect(held(20, spans)).toBe(PART2.land + 1.1);
    expect(held(25, spans)).toBe(PART2.land + 1.1);
    expect(held(PART2.laugh + 1, spans)).toBe(PART2.laugh + 1);
    expect(held(100, spans)).toBe(PART2.laugh + LAUGH_S + 0.1);
  });
});
