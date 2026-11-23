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
  "src/components/stimme": "src/components/GoodNight.tsx",
  "src/games/animals/stimme": "src/games/animals/voice.ts",
  "src/games/feelings/stimme": "src/games/feelings/shared.tsx",
  "src/games/shadows/stimme": "src/games/shadows/voice.ts",
  "src/games/together/stimme": "src/games/together/voice.ts",
  "src/games/marbles/stimme": "src/games/marbles/voice.ts",
  "src/games/potty/stimme": "src/games/potty/voice.ts",
  "src/games/socks/stimme": "src/games/socks/voice.ts",
  "src/games/letters/stimme": "src/games/letters/voice.ts",
  "src/games/timer/stimme": "src/games/timer/voice.ts",
  "src/games/milkchain/stimme": "src/games/milkchain/MilkChainGame.tsx",
  "src/games/pacifierstory/stimme": "src/games/pacifierstory/PacifierStoryGame.tsx",
  "src/games/kitastory/stimme": "src/games/kitastory/KitaStoryGame.tsx",
  "src/games/hairstory/stimme": "src/games/hairstory/HairStoryGame.tsx",
  "src/games/nightmilk/stimme": "src/games/nightmilk/story.ts",
  "src/games/milkgoodbye/stimme": "src/games/milkgoodbye/story.ts",
  "src/games/pacifiertree/stimme": "src/games/pacifiertree/story.ts",
  "src/games/hairshower/stimme": "src/games/hairshower/story.ts",
  "src/games/bottlestory/stimme": "src/games/bottlestory/BottleStoryGame.tsx",
  "src/games/bedstory/stimme": "src/games/bedstory/BedStoryGame.tsx",
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
    const plays = !!player && dirname(player) === dirname(game.folder) && /"\.\/stimme\/\*\*\/\*\.mp3\?glob(-by-language)?"/.test(readFileSync(player, "utf8"));
    expect({ folder: game.folder, plays }).toEqual({ folder: game.folder, plays: true });
  }
});

// The user asked for every game's voice in every app language (November 2026), and since 22 November 2026 every new text
// comes translated into all of them at once: a game saying something in one language only would stay silent in the
// others, so each recorded game lists lines in each language – a story written English first as well as the older ones.
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
