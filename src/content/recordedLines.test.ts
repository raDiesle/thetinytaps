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
  "src/games/animals/stimme": "src/games/animals/voice.ts",
  "src/games/feelings/stimme": "src/games/feelings/shared.tsx",
  "src/games/shadows/stimme": "src/games/shadows/voice.ts",
  "src/games/together/stimme": "src/games/together/voice.ts",
  "src/games/marbles/stimme": "src/games/marbles/voice.ts",
  "src/games/potty/stimme": "src/games/potty/voice.ts",
  "src/games/socks/stimme": "src/games/socks/voice.ts",
  "src/games/letters/stimme": "src/games/letters/voice.ts",
  "src/games/timer/stimme": "src/games/timer/voice.ts",
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

// The user asked for every game's voice in every app language (November 2026): a game that says something only in
// German would stay silent in the others, so each recorded game lists lines in each language.
test("every recorded game says something in every app language", () => {
  for (const game of RECORDED_GAMES)
    for (const language of RECORDED_LANGUAGES) expect(game.lines(language).length, `${game.name} ${language}`).toBeGreaterThan(0);
});

// A line a language hasn't translated is said in German there, and has no recording in that language: it must never be
// recorded with that language's voice (only the letters' packs are whole, where an English „A!“ is English).
test("no game records a German line as another language's", () => {
  for (const game of RECORDED_GAMES.filter((g) => g.name !== "buchstaben")) {
    const german = new Set(game.lines("de").map((l) => l.text));
    for (const language of RECORDED_LANGUAGES.filter((l) => l !== "de"))
      for (const line of game.lines(language))
        expect({ game: game.name, language, text: line.text, german: german.has(line.text) }).toMatchObject({ german: false });
  }
});
