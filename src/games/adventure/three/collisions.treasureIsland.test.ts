import { expect } from "bun:test";
import { heavyTest } from "@/heavyTest";
import { TREASURE_ISLAND } from "../stories/treasureIsland";
import { storyOverlaps } from "./collisions";

// One story per file, so the stories play side by side under `bun test --parallel` (see `collisions.ts`).

heavyTest("in Die Schatzinsel nothing reaches into Tapsi's body", () => {
  expect(storyOverlaps(TREASURE_ISLAND)).toEqual([]);
});
