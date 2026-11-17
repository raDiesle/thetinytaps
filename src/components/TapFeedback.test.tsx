import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { createFeedbackEffects, FeedbackLayer } from "./TapFeedback";

// A tap's ring once lived in the game's own state, so every tap rendered the whole play component twice (code review
// R-C15). Now the effects live in a store the game holds unchanged, and only `FeedbackLayer` follows it.

const ripple = { kind: "ripple" as const, x: 10, y: 20, delay: 0 };

test("an effect added tells the layer, and goes again after its lifetime", async () => {
  const effects = createFeedbackEffects();
  let told = 0;
  const unsubscribe = effects.subscribe(() => told++);
  effects.add([ripple], 5);
  expect(told).toBe(1);
  expect(effects.current().map((e) => e.kind)).toEqual(["ripple"]);
  await new Promise((done) => setTimeout(done, 30));
  expect(effects.current()).toEqual([]);
  expect(told).toBe(2);
  unsubscribe();
  effects.add([ripple], 5);
  expect(told).toBe(2);
  effects.dispose();
});

test("mashing keys keeps at most 24 effects, the newest", () => {
  const effects = createFeedbackEffects();
  for (let i = 0; i < 30; i++) effects.add([{ ...ripple, x: i }], 1000);
  expect(effects.current().length).toBe(24);
  expect(effects.current()[0].x).toBe(6);
  effects.dispose();
});

test("nothing changes after the game is gone", async () => {
  const effects = createFeedbackEffects();
  effects.add([ripple], 5);
  let told = 0;
  effects.subscribe(() => told++);
  effects.dispose();
  await new Promise((done) => setTimeout(done, 30));
  expect(told).toBe(0);
});

test("the layer draws the store's rings with the same markup as before", () => {
  const effects = createFeedbackEffects();
  effects.add([ripple, { kind: "glow", x: 1, y: 2, delay: 0 }], 1000);
  const html = renderToStaticMarkup(<FeedbackLayer effects={effects} fixed />);
  expect(html).toContain('class="fx-layer fixed"');
  expect(html).toContain('class="fx-ripple-at"');
  expect(html).toContain('class="fx-ripple late"');
  expect(html).toContain('class="fx-glow"');
  effects.dispose();
});

test("the game using useTapFeedback holds one handle and no state that a tap changes", () => {
  const code = readFileSync(join(import.meta.dir, "TapFeedback.tsx"), "utf8");
  const hook = code.slice(code.indexOf("export function useTapFeedback"), code.indexOf("export function FeedbackLayer"));
  // The handle is made once (a lazy initial state never set again), so a tap renders only the layer.
  expect(hook).toContain("const [effects] = useState(createFeedbackEffects);");
  expect(hook).not.toMatch(/setEffects|useReducer|useSyncExternalStore/);
  expect(code).toContain("useSyncExternalStore(effects.subscribe, effects.current, effects.current)");
});
