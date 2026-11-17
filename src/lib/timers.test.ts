import { expect, test } from "bun:test";
import { timerSet } from "./timers";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test("a timeout runs once its time has come", async () => {
  const { later } = timerSet();
  let ran = 0;
  later(() => ran++, 5);
  expect(ran).toBe(0);
  await wait(30);
  expect(ran).toBe(1);
});

test("clearAll drops every timeout still waiting, as leaving a game does", async () => {
  const { later, clearAll } = timerSet();
  const ran: string[] = [];
  later(() => ran.push("sound"), 5);
  later(() => ran.push("end"), 10);
  clearAll();
  await wait(30);
  expect(ran).toEqual([]);
});

test("one timeout is dropped by what later returned, the others still run", async () => {
  const { later } = timerSet();
  const ran: string[] = [];
  clearTimeout(later(() => ran.push("dropped"), 5));
  later(() => ran.push("kept"), 5);
  await wait(30);
  expect(ran).toEqual(["kept"]);
});

test("timeouts set after clearAll run again", async () => {
  const { later, clearAll } = timerSet();
  let ran = 0;
  clearAll();
  later(() => ran++, 5);
  await wait(30);
  expect(ran).toBe(1);
});

// A timeout whose handle is thrown away can never be dropped: it still fires after ✕, and its sound, line or level's end
// comes in the menu (Kettenreaktion's end tune, Zähne putzen's cheer). A game's component sets one through `later` of
// `useTimers`, or keeps the handle and clears it when it unmounts.
test("no game's component sets a timeout it can't drop when it is left", async () => {
  /** A call that is a statement of its own, or one per item of a `forEach`: nothing takes what it returns. */
  const thrownAway = /^\s*(if \(.*\) |else )?(window\.)?setTimeout\(|forEach\(.*=> (window\.)?setTimeout\(/;
  /** The line before ends inside a call, a list or an assignment: the timeout on this line is handed on to it. */
  const handedOn = /(\(|\[|,|=|=>)$/;
  const found: string[] = [];
  for await (const file of new Bun.Glob("src/games/**/*.tsx").scan(".")) {
    if (file.includes(".test.")) continue;
    const lines = (await Bun.file(file).text()).split("\n");
    lines.forEach((line, i) => {
      if (thrownAway.test(line) && !handedOn.test((lines[i - 1] ?? "").trimEnd())) found.push(`${file}:${i + 1}`);
    });
  }
  expect(found).toEqual([]);
});
