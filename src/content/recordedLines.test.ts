import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { expect, test } from "bun:test";
import { recordingName } from "@/lib/voiceName";
import { RECORDED_GAMES, RECORDED_LANGUAGES } from "./recordedLines";

// The games recorded with `bun run voice make` from src/content/recordedLines.ts and played by src/lib/voice.ts.

/** The file that plays each game's recordings, by its folder. */
const PLAYERS: Record<string, string> = {
  "src/games/teeth/stimme": "src/games/teeth/TeethPlay.tsx",
  "src/games/elevator/stimme": "src/games/elevator/voice.ts",
  "src/components/stimme": "src/components/GameShell.tsx",
};

test("no two lines of a game share a recording", () => {
  for (const game of RECORDED_GAMES) {
    for (const language of RECORDED_LANGUAGES) {
      const lines = game.lines(language);
      expect(new Set(lines.map((l) => recordingName(l.text, language))).size, `${game.name} ${language}`).toBe(lines.length);
    }
  }
});

// A folder the script fills but no code plays would stay silent without anyone noticing.
test("every recorded game's folder is played, with its languages below it", () => {
  for (const game of RECORDED_GAMES) {
    const player = PLAYERS[game.folder];
    const plays = !!player && dirname(player) === dirname(game.folder) && readFileSync(player, "utf8").includes('"./stimme/**/*.mp3?glob"');
    expect({ folder: game.folder, plays }).toEqual({ folder: game.folder, plays: true });
  }
});

test("every recorded game says something in German", () => {
  for (const game of RECORDED_GAMES) expect(game.lines("de").length, game.name).toBeGreaterThan(0);
});
