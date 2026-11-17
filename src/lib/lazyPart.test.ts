import { expect, test } from "bun:test";
import { CODE_WAIT_MS, codeSoon, lazyPart } from "./lazyPart";

test("a part is fetched once and read at once when it is there", async () => {
  let fetches = 0;
  const part = lazyPart(async () => {
    fetches++;
    return "level";
  });
  expect(part.loaded()).toBeUndefined();
  expect(part.load()).toBe(part.load());
  await part.load();
  expect(part.loaded()).toBe("level");
  expect(fetches).toBe(1);
});

test("a failed download is tried again next time", async () => {
  let fetches = 0;
  const part = lazyPart(async () => {
    if (++fetches === 1) throw new Error("offline");
    return "level";
  });
  await part.load().catch(() => undefined);
  expect(part.loaded()).toBeUndefined();
  expect(await part.load()).toBe("level");
  expect(fetches).toBe(2);
});

test("a tap waits for its level's code only a moment, and a failed download never rejects", async () => {
  const from = performance.now();
  await codeSoon(new Promise(() => {}));
  expect(performance.now() - from).toBeGreaterThanOrEqual(CODE_WAIT_MS - 20);
  expect(CODE_WAIT_MS).toBeLessThanOrEqual(500);
  await codeSoon(Promise.reject(new Error("offline")));
});

test("a screen that loads a part reads it at once where it is loaded, so the level is drawn before the page turns", async () => {
  const marbles = await Bun.file("src/games/marbles/MarblePlay.tsx").text();
  const adventure = await Bun.file("src/games/adventure/AdventureGame.tsx").text();
  expect(marbles).toContain("loadedLevel(entry) ?? use(loadLevel(entry))");
  expect(adventure).toContain("loadedStory(entry) ?? use(loadStory(entry))");
  expect(adventure).toContain("loadedPlay() ?? use(loadPlay())");
  for (const game of ["src/games/marbles/MarbleGame.tsx", "src/games/adventure/AdventureGame.tsx"]) {
    expect(await Bun.file(game).text()).toContain("prepare={");
  }
});
