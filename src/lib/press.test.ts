import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import type { MouseEvent } from "react";
import { noPointerClick } from "./press";

// A shared button that acts as the finger lands must still answer a keyboard and a screen reader, which send a click
// and no pointer: GameEnd's „Nochmal“ and „Weiter“, the way back of a scene and a story's page buttons did nothing for
// them.

/** A click with this many presses of a pointer behind it: none for Enter, Space and a screen reader. */
const click = (detail: number) => ({ detail }) as MouseEvent;

test("a click no pointer made acts, a pointer's own click does not act a second time", () => {
  let acted = 0;
  const onClick = noPointerClick(() => acted++);
  onClick(click(1));
  onClick(click(2));
  expect(acted).toBe(0);
  onClick(click(0));
  expect(acted).toBe(1);
});

/** The opening tags of every `<button>` in a source, each up to the `>` that closes it (braces of its handlers skipped). */
function buttonTags(source: string): string[] {
  const tags: string[] = [];
  for (let at = source.indexOf("<button"); at >= 0; at = source.indexOf("<button", at + 1)) {
    let depth = 0;
    let end = at;
    for (; end < source.length; end++) {
      const char = source[end];
      if (char === "{") depth++;
      else if (char === "}") depth--;
      else if (char === ">" && depth === 0) break;
    }
    tags.push(source.slice(at, end + 1));
  }
  return tags;
}

test("every shared button that acts on pointer down has a way without a pointer", () => {
  const pointerOnly: string[] = [];
  for (const file of new Bun.Glob("src/components/*.tsx").scanSync()) {
    for (const tag of buttonTags(readFileSync(file, "utf8"))) {
      if (!tag.includes("onPointerDown=")) continue;
      // A click, a key handler, or handlers spread on it (`useHold`'s props, `tapProps`), which bring their keys.
      if (!/onClick=|onKeyDown=|\{\.\.\./.test(tag)) pointerOnly.push(`${file}: ${tag.split("\n")[0]} …`);
    }
  }
  expect(pointerOnly).toEqual([]);
});

test("the tags of a source's buttons are found whole, arrows and all", () => {
  const tags = buttonTags('<div><button type="button" onPointerDown={(e) => go(e)} onClick={() => {}}>x</button><button\n  {...props}\n>y</button></div>');
  expect(tags).toEqual(['<button type="button" onPointerDown={(e) => go(e)} onClick={() => {}}>', "<button\n  {...props}\n>"]);
});
