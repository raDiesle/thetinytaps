import { expect, test } from "bun:test";
import { ORBIT, ORBIT_CUES, SPACE_CUES, STRETCHES } from "./trackStretches";

test("the Weltraumbahn's things go round the planet once, and a quarter more to come off on its near side", () => {
  // User request, 26 November 2026: twice round and a quarter was too long to watch.
  expect(ORBIT.laps).toBe(1.25);
  expect(ORBIT_CUES).toBe(2);
  // The wormhole's cues follow the orbit's, and the stretch fires every one of them.
  expect(SPACE_CUES.wormIn).toBe(ORBIT_CUES);
  expect(STRETCHES.space.cues).toBe(SPACE_CUES.wormOut + 1);
});
