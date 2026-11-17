import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createStore, useStore } from "./store";

describe("createStore", () => {
  test("tells its listeners of a change, and only of a change", () => {
    const store = createStore(1);
    let told = 0;
    const stop = store.subscribe(() => told++);
    store.set(2);
    store.set(2);
    expect(store.get()).toBe(2);
    expect(told).toBe(1);
    stop();
    store.set(3);
    expect(told).toBe(1);
  });

  test("a store's own `same` decides what counts as a change", () => {
    const store = createStore({ n: 1 }, { same: (a, b) => a.n === b.n });
    let told = 0;
    store.subscribe(() => told++);
    store.set({ n: 1 });
    expect(told).toBe(0);
    store.set({ n: 2 });
    expect(told).toBe(1);
  });

  test("a function as the first value is called once, at the first read", () => {
    let calls = 0;
    const store = createStore(() => {
      calls++;
      return "loaded";
    });
    expect(calls).toBe(0);
    expect(store.get()).toBe("loaded");
    expect(store.get()).toBe("loaded");
    expect(calls).toBe(1);
  });

  test("a listener that stops itself while told doesn't keep the others from hearing it", () => {
    const store = createStore(0);
    const heard: string[] = [];
    const stop = store.subscribe(() => {
      heard.push("first");
      stop();
    });
    store.subscribe(() => heard.push("second"));
    store.set(1);
    store.set(2);
    expect(heard).toEqual(["first", "second", "second"]);
  });
});

const counted = createStore({ count: 3 });
const Show = () => <i>{useStore(counted).count}</i>;
const Many = () => <b>{String(useStore(counted, (value) => value.count > 2))}</b>;

describe("useStore", () => {
  test("shows the value, or the part `select` picks", () => {
    expect(renderToStaticMarkup(<Show />)).toBe("<i>3</i>");
    expect(renderToStaticMarkup(<Many />)).toBe("<b>true</b>");
  });
});
