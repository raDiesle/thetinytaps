import { afterEach, describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pick, shuffle } from "./random";

const realRandom = Math.random;

/** The same row of chances in every run (mulberry32), so a count below can never fail by bad luck. */
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

afterEach(() => {
  Math.random = realRandom;
});

describe("shuffle", () => {
  test("gives a new list with the same items and leaves the old one as it was", () => {
    const list = Object.freeze(["a", "b", "c", "d", "e", "f"]);
    const shuffled = shuffle(list);
    expect(shuffled).not.toBe(list);
    expect([...shuffled].sort()).toEqual([...list]);
    expect(list).toEqual(["a", "b", "c", "d", "e", "f"]);
    expect(shuffle([])).toEqual([]);
    expect(shuffle(["only"])).toEqual(["only"]);
  });

  test("every order comes about as often as any other", () => {
    Math.random = seededRandom(7);
    const counts = new Map<string, number>();
    const rounds = 6000;
    for (let i = 0; i < rounds; i++) {
      const order = shuffle([1, 2, 3]).join("");
      counts.set(order, (counts.get(order) ?? 0) + 1);
    }
    expect(counts.size).toBe(6);
    // 1000 each on average; a biased shuffle (sorting by a random comparison) is off by hundreds.
    for (const count of counts.values()) expect(Math.abs(count - rounds / 6)).toBeLessThan(120);
  });
});

describe("pick", () => {
  test("gives one of the list, the first for the lowest chance and the last for the highest", () => {
    const list = ["a", "b", "c"] as const;
    for (let i = 0; i < 50; i++) expect(list).toContain(pick(list));
    Math.random = () => 0;
    expect(pick(list)).toBe("a");
    Math.random = () => 0.999999;
    expect(pick(list)).toBe("c");
  });

  test("every item comes", () => {
    Math.random = seededRandom(3);
    const seen = new Set<number>();
    for (let i = 0; i < 200; i++) seen.add(pick([1, 2, 3, 4, 5]));
    expect(seen.size).toBe(5);
  });
});

// Every game once had its own copy of these two, and one shuffled by sorting with a random comparison, which favours
// some orders: chance comes from here.
describe("the games' code", () => {
  const sources = readdirSync("src", { recursive: true, encoding: "utf8" })
    .filter((file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file) && file !== join("lib", "random.ts"))
    .map((file) => ({ file, code: readFileSync(join("src", file), "utf8") }));
  const filesWith = (pattern: RegExp) => sources.filter(({ code }) => pattern.test(code)).map(({ file }) => file);

  test("never shuffles by sorting with a random comparison", () => {
    expect(filesWith(/\.sort\(\s*\(\)\s*=>\s*(?:Math\.random\(\)\s*-\s*0?\.5|0?\.5\s*-\s*Math\.random\(\))/)).toEqual([]);
  });

  test("has no shuffle or random pick of its own", () => {
    expect(filesWith(/(?:function|const) shuffle\b/)).toEqual([]);
    expect(filesWith(/=>\s*\w+\[Math\.floor\(Math\.random\(\) \* \w+\.length\)\];/)).toEqual([]);
  });
});
