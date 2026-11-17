import { expect } from "bun:test";
import { heavyTest } from "@/heavyTest";
import { CLOUD_TRIP } from "../stories/cloudTrip";
import { storyOverlaps } from "./collisions";

// One story per file, so the stories play side by side under `bun test --parallel` (see `collisions.ts`).

heavyTest("in Die Wolkenreise nothing reaches into Tapsi's body", () => {
  expect(storyOverlaps(CLOUD_TRIP)).toEqual([]);
});
