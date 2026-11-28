import { expect, test } from "bun:test";
import { STORIES } from "./content";
import { DESIGN_ROOM_R, DESIGN_ROOM_W, ROOM_L, VIEW_H, VIEW_L, houseLayout, roomWidthFor } from "./layout";
import { kidAnchor } from "./rooms";

// The house fills the screen by stretching its rooms (CLAUDE.md, „The house fills the screen“): the things move apart
// in groups, and a child keeps its place beside the group it uses.

test("the rooms are never narrower than drawn and fill a wide screen", () => {
  expect(roomWidthFor(1)).toBe(DESIGN_ROOM_W);
  for (const aspect of [844 / 390, 1280 / 720, 1920 / 1080]) {
    const layout = houseLayout(roomWidthFor(aspect));
    expect(layout.roomW).toBeGreaterThan(DESIGN_ROOM_W);
    // Within a rounding step of the screen's shape.
    expect(Math.abs((layout.viewR - VIEW_L) / VIEW_H - aspect)).toBeLessThan(0.02);
  }
});

test("a design x keeps its place at the rooms' edges and past them", () => {
  const layout = houseLayout(1600);
  expect(layout.rx(ROOM_L)).toBe(ROOM_L);
  expect(layout.rx(DESIGN_ROOM_R)).toBe(layout.roomR);
  expect(layout.rx(DESIGN_ROOM_R + 100)).toBe(layout.roomR + 100);
});

test("every child stands beside the group of things it uses", () => {
  for (const story of STORIES) {
    const near = (floor: number, x: number | undefined, where: string) => {
      if (x === undefined) return;
      // In the lift there is no group to stand by.
      if (x > DESIGN_ROOM_R) return;
      const room = story.rooms[floor];
      expect(room, where).toBeDefined();
      if (!room) return;
      const anchor = kidAnchor(room, x);
      expect(anchor === x, `${where}: the room ${room.name} has no zones for its children`).toBe(false);
      expect(Math.abs(anchor - x), `${where}: ${x} is far from its group at ${anchor}`).toBeLessThanOrEqual(260);
    };
    near(story.start, story.startX, `${story.id} start`);
    if (story.buddy) near(story.buddy.floor, story.buddy.x, `${story.id} buddy`);
    for (const step of story.steps) {
      const where = `${story.id} ${step.wish}`;
      near(step.floor, step.spot, where);
      near(step.floor, step.otherSpot, `${where} other`);
      for (const task of step.tasks ?? []) near(step.floor, task.spot, `${where} ${task.name}`);
    }
  }
});
