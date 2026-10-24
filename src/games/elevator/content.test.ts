import { expect, test } from "@rstest/core";
import { STORIES } from "./content";

// The rules of CLAUDE.md that data can show: few taps in a row, and the first move in a room is the child's own.

test("never more than two taps in a row", () => {
  for (const story of STORIES) {
    for (const step of story.steps) {
      let run = 0;
      for (const task of step.tasks ?? []) {
        const where = `${story.id} ${step.wish} ${task.name}`;
        // Something that happens by itself, or a walk, ends a run of taps.
        if (task.auto || task.spot !== undefined) run = 0;
        if (!task.auto) {
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
