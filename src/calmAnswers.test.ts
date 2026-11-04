import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "bun:test";

// After a choice or an answer the picture's change and its sound are the answer: nothing floats up, and no card,
// button or frame hops, shakes, pulses, blinks or grows (root CLAUDE.md, „Rules for every game“; user feedback from
// Gefühle, November 2026: too much fast blinking and movement for small children).

const files = readdirSync("src", { recursive: true, encoding: "utf8" });
const cssFiles = files.filter((file) => file.endsWith(".css")).map((file) => join("src", file));

/** Every plain rule of a stylesheet (no nesting), as its selector and its declarations, comments left out. */
function rules(file: string): { selector: string; body: string }[] {
  const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  // `:not(.done)` names a state the rule is *not* for, so it is left out of the selector looked at.
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
    selector: selector
      .trim()
      .replace(/\s+/g, " ")
      .replace(/:not\([^()]*\)/g, ""),
    body,
  }));
}

/** The animation a rule sets, unless it only switches one off. */
const animationOf = (body: string) => body.match(/(?:^|;)\s*animation(?:-name)?\s*:\s*([^;]+)/)?.[1].trim();

/** Classes that mark a thing just picked or answered, right or not. */
const ANSWERED = /\.(matched|happy|solved|won|correct|right|found|done|picked|chosen|peek|nope|refused|wrong|yes|no)\b/;
/** Classes of the things a child picks from: cards, options, buttons, slots, homes. */
const CHOICE = /(-option|-card|\.card|\.slot|-home|-choice|-said|-button)\b/;

test("a card or button picked or answered keeps still", () => {
  const moving = cssFiles.flatMap((file) =>
    rules(file)
      .filter(({ selector }) => selector.split(",").some((one) => ANSWERED.test(one) && CHOICE.test(one)))
      .filter(({ body }) => {
        const animation = animationOf(body);
        return animation !== undefined && animation !== "none";
      })
      .map(({ selector, body }) => `${file}: ${selector} → ${animationOf(body)}`),
  );
  expect(moving).toEqual([]);
});

test("nothing answered keeps on moving", () => {
  const endless = cssFiles.flatMap((file) =>
    rules(file)
      .filter(({ selector, body }) => ANSWERED.test(selector) && /\binfinite\b/.test(animationOf(body) ?? ""))
      .map(({ selector }) => `${file}: ${selector}`),
  );
  expect(endless).toEqual([]);
});

test("the end buttons come calmly and never call", () => {
  const calling = cssFiles.flatMap((file) =>
    rules(file)
      .filter(({ selector, body }) => /game-end/.test(selector) && /\b(infinite|pop-in|breathe|wiggle|hop|bob|shake)\b/.test(animationOf(body) ?? ""))
      .map(({ selector }) => `${file}: ${selector}`),
  );
  expect(calling).toEqual([]);
});

// `spawn()` without a place showers shapes over the whole screen: a firework, only for a level's end or a story's
// party, never after a choice or an answer. A shower somewhere new must be such an end and be added here on purpose.
const SHOWERS = new Set([
  "src/games/elevator/ElevatorPlay.tsx", // the story's party at its end
  "src/games/elevator/film/FilmPlay.tsx", // the film's party at its end
  "src/games/elevator/trail/TrailPlay.tsx", // the finale when the goal is back
  "src/games/marbles/MarblePlay.tsx", // the machine's party when it has run
  "src/games/pacifier/PacifierPlay.tsx", // the present unwrapped in the story
  "src/games/potty/PottyPlay.tsx", // it came, and the party at the end (Aufs Töpfchen's point)
  "src/games/rewards/BoardScreen.tsx", // a full star chart
  "src/games/rewards/PlanScreen.tsx", // the day's plan done
  "src/games/scenes/ScenePlay.tsx", // every item of a picture found
  "src/games/socks/SocksPlay.tsx", // the whole wash on the line
  "src/games/teeth/TeethPlay.tsx", // all teeth brushed
  "src/games/weaning/WeaningPlay.tsx", // the morning at the story's end
]);

test("shapes shower only at a level's or story's end", () => {
  const showering = files
    .filter((file) => /\.tsx?$/.test(file) && !file.endsWith(".test.ts"))
    .map((file) => join("src", file))
    .filter((file) => /\bspawn\(\)/.test(readFileSync(file, "utf8")));
  expect(showering.filter((file) => !SHOWERS.has(file))).toEqual([]);
});
