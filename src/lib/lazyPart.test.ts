import { expect, test } from "bun:test";
import { CODE_WAIT_MS, codeSoon, lazyPart } from "./lazyPart";

test("a part is fetched once and read at once when it is there", async () => {
  let fetches = 0;
  const part = lazyPart(async () => {
    fetches++;
    return "level";
  });
  expect(part.load()).toBe(part.load());
  expect(await part.load()).toBe("level");
  expect(fetches).toBe(1);
});

test("a failed download is tried again next time", async () => {
  let fetches = 0;
  const part = lazyPart(async () => {
    if (++fetches === 1) throw new Error("offline");
    return "level";
  });
  const failed = part.load() as Promise<string> & { status?: string };
  await failed.catch(() => undefined);
  expect(failed.status).toBeUndefined();
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

test("a part fetched ahead is marked fulfilled, so use() draws it in the same render", async () => {
  const part = lazyPart(async () => "level");
  const promise = part.load() as Promise<string> & { status?: string; value?: string };
  await promise;
  expect(promise.status).toBe("fulfilled");
  expect(promise.value).toBe("level");
});

test("a screen that loads a part reads it with use() alone, and its start screen fetches it before the page turns", async () => {
  const screens = ["src/games/marbles/MarblePlay.tsx", "src/games/adventure/AdventureGame.tsx", "src/games/elevator/ElevatorGame.tsx"];
  for (const screen of screens) {
    const code = await Bun.file(screen).text();
    expect(code).toMatch(/\buse\(load\w*\(/);
    // `loaded ?? use(load())` calls use() in one render and not the next, which React warns about.
    expect(code).not.toMatch(/\?\?\s*use\(/);
  }
  for (const game of ["src/games/marbles/MarbleGame.tsx", "src/games/adventure/AdventureGame.tsx", "src/games/elevator/ElevatorGame.tsx"]) {
    expect(await Bun.file(game).text()).toContain("prepare={");
  }
});
