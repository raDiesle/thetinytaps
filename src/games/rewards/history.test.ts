import { describe, expect, test } from "bun:test";
import { emptyHistory, HISTORY_LIMIT, record, redo, undo } from "./history";

describe("undo and redo of a chart", () => {
  test("undo goes back one change and redo forward again", () => {
    let history = record(record(emptyHistory<string>(), "a"), "b");
    const back = undo(history, "c");
    expect(back?.value).toBe("b");
    history = back?.history ?? history;
    const again = redo(history, "b");
    expect(again?.value).toBe("c");
    expect(again?.history.past).toEqual(["a", "b"]);
  });

  test("nothing to undo or redo gives null", () => {
    expect(undo(emptyHistory<string>(), "a")).toBeNull();
    expect(redo(emptyHistory<string>(), "a")).toBeNull();
  });

  test("a new change after an undo can't be redone into", () => {
    const back = undo(record(emptyHistory<string>(), "a"), "b");
    const changed = record(back?.history ?? emptyHistory<string>(), "a");
    expect(changed.future).toEqual([]);
  });

  test("letters typed in a row are taken back as one word", () => {
    const typed = record(record(record(emptyHistory<string>(), ""), "L", true), "Le", true);
    expect(typed.past).toEqual([""]);
  });

  test("only the newest changes are kept", () => {
    let history = emptyHistory<number>();
    for (let i = 0; i < HISTORY_LIMIT + 10; i++) history = record(history, i);
    expect(history.past.length).toBe(HISTORY_LIMIT);
    expect(history.past.at(-1)).toBe(HISTORY_LIMIT + 9);
  });
});
