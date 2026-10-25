import { existsSync, readdirSync } from "node:fs";
import { expect, test } from "@rstest/core";
import { TREASURE_ISLAND } from "./stories/treasureIsland";
import { DEFAULT_TURN } from "./stories/story";
import { spokenLines, voiceId } from "./voiceId";

// Recordings are named by the hash of their line (voice.ts, `yarn voice make`).
const STORIES = [{ folder: "src/games/adventure/stories/treasureIsland/stimme", story: TREASURE_ISLAND }];

test("no two lines of a story share a recording", () => {
  for (const { story } of STORIES) {
    const lines = spokenLines(story.opening?.lines ?? [], story.lines, DEFAULT_TURN);
    expect(new Set(lines.map((l) => voiceId(l.text))).size).toBe(lines.length);
  }
});

test("a story with recordings has one for every line and none left over (yarn voice make)", () => {
  for (const { folder, story } of STORIES) {
    if (!existsSync(folder)) continue;
    const wanted = spokenLines(story.opening?.lines ?? [], story.lines, DEFAULT_TURN).map((l) => `${voiceId(l.text)}.mp3`);
    const files = readdirSync(folder).filter((f) => f.endsWith(".mp3"));
    expect(
      wanted.filter((f) => !files.includes(f)),
      "lines without a recording",
    ).toEqual([]);
    expect(
      files.filter((f) => !wanted.includes(f)),
      "recordings no line uses",
    ).toEqual([]);
  }
});
