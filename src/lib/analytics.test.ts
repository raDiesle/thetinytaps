import { afterEach, describe, expect, test } from "bun:test";
import { durationStep, track } from "./analytics";

describe("durationStep", () => {
  test("puts a play time into the same few steps every time", () => {
    expect(durationStep(30_000)).toBe("unter 1 Min");
    expect(durationStep(60_000)).toBe("1–3 Min");
    expect(durationStep(5 * 60_000)).toBe("3–10 Min");
    expect(durationStep(15 * 60_000)).toBe("10–20 Min");
    expect(durationStep(45 * 60_000)).toBe("über 20 Min");
  });
});

describe("track", () => {
  const before = (globalThis as { window?: unknown }).window;
  afterEach(() => {
    (globalThis as { window?: unknown }).window = before;
  });

  test("does nothing without Umami's script, and never throws from it", () => {
    (globalThis as { window?: unknown }).window = {};
    expect(() => track("ende")).not.toThrow();
    (globalThis as { window?: unknown }).window = {
      umami: {
        track() {
          throw new Error("blocked");
        },
      },
    };
    expect(() => track("ende", { spiel: "/zaehne/" })).not.toThrow();
  });

  test("hands the event to Umami when it is there", () => {
    const sent: unknown[] = [];
    (globalThis as { window?: unknown }).window = { umami: { track: (...args: unknown[]) => sent.push(args) } };
    track("ende", { spiel: "/socken/", dauer: "1–3 Min" });
    expect(sent).toEqual([["ende", { spiel: "/socken/", dauer: "1–3 Min" }]]);
  });
});
