import { expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { STORIES } from "./content";

// The rules of CLAUDE.md that data can show: few presses in a row, and a wish in the room only where the bubble can be seen.

test("never more than two presses in a row", () => {
  for (const story of STORIES) {
    for (const step of story.steps) {
      let run = 0;
      for (const task of step.tasks ?? []) {
        const where = `${story.id} ${step.wish} ${task.name}`;
        // Something that happens by itself, or a walk, ends a run of presses.
        if (!task.wish || task.spot !== undefined) run = 0;
        if (task.wish) {
          run += task.taps;
          expect(run, where).toBeLessThanOrEqual(2);
        }
        if (task.wait) run = 0;
      }
    }
  }
});

test("every task does something", () => {
  for (const story of STORIES)
    for (const step of story.steps) for (const task of step.tasks ?? []) expect(task.taps, `${story.id} ${task.name}`).toBeGreaterThan(0);
});

test("a wish in the room only while the child can be seen", () => {
  // The bubble hangs over the child; in the bathtub or the bed it is hidden, so nothing can be wished for there.
  for (const story of STORIES)
    for (const step of story.steps)
      if (step.hide) for (const task of step.tasks ?? []) expect(task.wish, `${story.id} ${step.wish} ${task.name}`).toBeUndefined();
});

test("the thing of every wish can be found in its room, for its outline", () => {
  // The outline finds the thing by `data-wish`; the brother is not part of the room but the child waiting there.
  for (const story of STORIES)
    for (const step of story.steps) {
      if (step.wish === "brother") continue;
      const room = renderToStaticMarkup(createElement(story.rooms[step.floor], { playing: null, used: [], task: null, taps: {} }));
      const tags = [...room.matchAll(/data-wish="([^"]*)"/g)].flatMap((m) => m[1].split(" "));
      expect(tags, `${story.id} ${step.wish}`).toContain(step.wish);
    }
});
