import { expect, test } from "bun:test";
import { sceneAfter } from "./scenes";

// A phase tapped on the bar while paused showed the picture before it until the game went on: the slide to the new
// picture stood still on its first frame (user feedback, November 2026). Paused, the picture comes at once.
test("paused, a new picture comes at once with nothing sliding", () => {
  const shown = { key: "0-story", move: "", leaving: [] };
  expect(sceneAfter(shown, "0-lion", "fade", "story", true)).toEqual({ key: "0-lion", move: "", leaving: [] });
  // A slide that was still running when the game paused goes too.
  const sliding = { key: "0-sink", move: "enter-down", leaving: [{ key: "0-story", node: "story", move: "leave-down" }] };
  expect(sceneAfter(sliding, "0-lion", "fade", "sink", true)).toEqual({ key: "0-lion", move: "", leaving: [] });
});

test("playing, the old picture slides out while the new one slides in", () => {
  const shown = { key: "0-story", move: "", leaving: [] };
  expect(sceneAfter(shown, "0-sink", "down", "story", false)).toEqual({
    key: "0-sink",
    move: "enter-down",
    leaving: [{ key: "0-story", node: "story", move: "leave-down" }],
  });
});
