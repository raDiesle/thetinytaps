import { readFileSync } from "node:fs";
import { expect, test } from "bun:test";

const playing = readFileSync("src/styles/playing.css", "utf8");
const rule = (selector: string) => playing.match(new RegExp(`\\n${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

// A game with many ways to play behind ⚙️ tells grown-ups so as play starts (user feedback, November 2026): a note
// under ⚙️ that fades by itself, never stays or comes back, and never catches a child's tap.
test("the intro under ⚙️ fades by itself and lets taps through", () => {
  const intro = rule(".play-options-intro");
  expect(intro).toContain("pointer-events: none");
  const animation = intro.match(/animation:\s*([^;]+);/)?.[1] ?? "";
  expect(animation).toContain("play-options-intro");
  expect(animation).not.toContain("infinite");
  // Its last keyframe hides it, and the component drops it when that animation ends.
  expect(playing).toMatch(/@keyframes play-options-intro \{[\s\S]*100% \{\s*opacity: 0;/);
  expect(readFileSync("src/components/PlayOptions.tsx", "utf8")).toContain("onAnimationEnd");
});

test("Buchstaben & Zahlen says what its options hold as play starts", () => {
  expect(readFileSync("src/games/letters/LettersGame.tsx", "utf8")).toMatch(/<PlayOptions\s[^>]*intro=/);
});
