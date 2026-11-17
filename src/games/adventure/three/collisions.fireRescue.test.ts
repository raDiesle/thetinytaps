import { expect } from "bun:test";
import { heavyTest } from "@/heavyTest";
import { FIRE_RESCUE } from "../stories/fireRescue";
import { storyOverlaps } from "./collisions";

// One story per file, so the stories play side by side under `bun test --parallel` (see `collisions.ts`).

heavyTest("in Fire Rescue nothing reaches into Tapsi's body", () => {
  expect(storyOverlaps(FIRE_RESCUE)).toEqual([]);
});
