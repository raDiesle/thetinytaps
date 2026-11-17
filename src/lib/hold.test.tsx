import { afterEach, beforeEach, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { KeyboardEvent, PointerEvent } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { useSecretHold } from "@/pages/Home";
import { useHold } from "./hold";

// A hold that a child's second finger could leave running opens a grown-ups' page under its hand: every hold keeps
// exactly one timer, and letting go stops it (`useHold`, and the home title's secret hold).

/** The timers started and stopped while a test runs, so no test has to wait for a hold to end. */
let started: unknown[] = [];
let stopped: unknown[] = [];
const realSet = globalThis.setTimeout;
const realClear = globalThis.clearTimeout;

beforeEach(() => {
  started = [];
  stopped = [];
  globalThis.setTimeout = ((...args: Parameters<typeof setTimeout>) => {
    const id = realSet(...args);
    started.push(id);
    return id;
  }) as typeof setTimeout;
  globalThis.clearTimeout = ((id: Parameters<typeof clearTimeout>[0]) => {
    stopped.push(id);
    realClear(id);
  }) as typeof clearTimeout;
});

afterEach(() => {
  for (const id of started) realClear(id as Parameters<typeof clearTimeout>[0]);
  globalThis.setTimeout = realSet;
  globalThis.clearTimeout = realClear;
});

/** The timers still running: started and never stopped. */
const running = () => started.filter((id) => !stopped.includes(id));

/** What a hook returns when a component is drawn once; its handlers stay callable afterwards. */
function drawn<T>(hook: () => T): T {
  let result: T | undefined;
  renderToStaticMarkup(
    <MemoryRouter>
      <Probe
        run={() => {
          result = hook();
        }}
      />
    </MemoryRouter>,
  );
  return result as T;
}

/** Draws nothing: only calls the hook under test while it renders. */
function Probe({ run }: { run: () => void }) {
  run();
  return null;
}

/** A finger landing on the held button. */
const finger = (pointerId: number) => ({ pointerId, stopPropagation() {}, currentTarget: { setPointerCapture() {} } }) as unknown as PointerEvent<HTMLElement>;

/** A key pressed or let go on the held button. */
const key = (name: string, repeat = false) => ({ key: name, repeat, preventDefault() {} }) as unknown as KeyboardEvent;

test("useHold keeps one timer however many fingers land, and letting go stops it", () => {
  let done = 0;
  const { props } = drawn(() => useHold(() => done++, 5000));
  props.onPointerDown(finger(1));
  props.onPointerDown(finger(2));
  expect(started.length).toBe(1);
  props.onPointerUp();
  expect(running()).toEqual([]);
  props.onPointerUp();
  expect(done).toBe(0);
});

test("useHold starts again after a release, and a key held down counts once", () => {
  const { props } = drawn(() => useHold(() => {}, 5000));
  props.onKeyDown(key("Enter"));
  props.onKeyDown(key("Enter", true));
  props.onKeyDown(key("a"));
  expect(started.length).toBe(1);
  props.onKeyUp(key("Enter"));
  expect(running()).toEqual([]);
  props.onKeyDown(key(" "));
  expect(started.length).toBe(2);
  props.onBlur();
  expect(running()).toEqual([]);
});

test("useHold acts once the time is over", async () => {
  let done = 0;
  const { props } = drawn(() => useHold(() => done++, 5));
  props.onPointerDown(finger(1));
  await new Promise((resolve) => realSet(resolve, 40));
  expect(done).toBe(1);
});

test("the home title's secret hold leaves no timer running when two fingers land and both lift", () => {
  const props = drawn(useSecretHold);
  const down = props.onPointerDown as unknown as () => void;
  const up = props.onPointerUp as unknown as () => void;
  down();
  down();
  expect(running().length).toBe(1);
  up();
  expect(running()).toEqual([]);
  up();
  expect(running()).toEqual([]);
});

test("the play time lock's ⏳ is held with useHold, not a copy of it", () => {
  const lock = readFileSync(join(import.meta.dir, "..", "components", "PlaytimeLock.tsx"), "utf8");
  expect(lock).toContain("useHold(onUnlock, UNLOCK_HOLD_MS)");
  expect(lock).not.toContain("setPointerCapture");
});
