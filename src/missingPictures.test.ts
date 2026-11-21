import { describe, expect, it } from "bun:test";
import { type StoryChapter, withPictures } from "@/components/ChapterBook";
import { playedPasses, sceneMade } from "@/games/cause/images";
import { CAUSE_PASSES, type CauseScene } from "@/games/cause/scenes";

// A story, scene or page whose pictures aren't made yet is never shown to players: the built site leaves it out, the
// dev server shows it with its placeholder (user request, November 2026; root CLAUDE.md, „Rules for every game“).
describe("what waits for its pictures stays out of the built site", () => {
  const page = (id: string) => ({ id, de: id }) as unknown as StoryChapter["pages"][number];
  const chapters = [
    { id: "a", title: "A", pages: [page("a1"), page("a2")] },
    { id: "b", title: "B", pages: [page("b1")] },
  ] as StoryChapter[];
  const made = (id: string) => (id === "a2" ? undefined : `${id}.webp`);

  it("a chapter book leaves out a page without its picture, and a chapter left empty", () => {
    expect(withPictures(chapters, made, false).flatMap((c) => c.pages.map((p) => p.id))).toEqual(["a1", "b1"]);
    expect(withPictures(chapters, () => undefined, false)).toEqual([]);
    expect(withPictures(chapters, () => undefined, true)).toBe(chapters);
  });

  it("Was ist passiert? leaves out a scene without all three pictures, and a pass left empty", () => {
    const [first, second] = CAUSE_PASSES;
    const missing = new Set(second.map((s) => s.id));
    const passes = playedPasses([first, second], (scene: CauseScene) => !missing.has(scene.id), false);
    expect(passes).toEqual([first]);
    // Today every scene is made, so players get all of them.
    expect(playedPasses(CAUSE_PASSES, sceneMade, false)).toEqual(CAUSE_PASSES);
  });
});
