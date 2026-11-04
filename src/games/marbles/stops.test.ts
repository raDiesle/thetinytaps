import { describe, expect, test } from "bun:test";
import { buildBath } from "./bath";
import { buildBuilding } from "./building";
import { buildCircus } from "./circus";
import { buildFarm } from "./farm";
import { buildGarden } from "./garden";
import { buildKitchen } from "./kitchen";
import { VIEW_H, VIEW_W } from "./level";
import { buildLight } from "./light";
import { buildMachine } from "./machine";
import type { MachineBase } from "./MachineStage";
import { STOP_HINT, stopFinger } from "./MachineStage";
import { buildNight } from "./night";
import { buildSpace } from "./space";
import { buildTidy } from "./tidy";

// Every machine holds still at three or four stations on its way until the child taps (R-03). What glows there must be
// on the screen while it waits – the camera stands still with the machine – and the 👇 beside it too, clear of the
// picture's edges and the ✕ in the top left corner.

const MACHINES: Record<string, () => MachineBase> = {
  machine: buildMachine,
  kitchen: buildKitchen,
  garden: buildGarden,
  building: buildBuilding,
  circus: buildCircus,
  space: buildSpace,
  light: buildLight,
  bath: buildBath,
  farm: buildFarm,
  night: buildNight,
  tidy: buildTidy,
};

describe("machine stops", () => {
  for (const [name, build] of Object.entries(MACHINES)) {
    const machine = build();
    test(`${name}: three or four stops, spread over the way`, () => {
      const times = machine.stops.map((s) => s.at);
      expect(times.length).toBeGreaterThanOrEqual(3);
      expect(times.length).toBeLessThanOrEqual(4);
      expect(times[0]).toBeGreaterThan(3);
      expect(times[times.length - 1]).toBeLessThan(machine.duration - 3);
      for (let i = 1; i < times.length; i++) expect(times[i] - times[i - 1]).toBeGreaterThan(4);
    });

    test(`${name}: each stop's glow and finger are on the screen while it waits`, () => {
      for (const stop of machine.stops) {
        const camera = machine.cameraTarget(stop.at);
        const left = stop.x - camera;
        const finger = stopFinger(stop);
        const fingerLeft = finger.x - camera;
        const fingerTop = finger.y - 90;
        const spot = { at: stop.at, left: Math.round(left), y: Math.round(stop.y) };
        expect({ ...spot, inside: left > STOP_HINT.glow && left < VIEW_W - STOP_HINT.glow && fingerLeft < VIEW_W - 60 }).toEqual({ ...spot, inside: true });
        expect({ ...spot, onScreen: stop.y > STOP_HINT.glow && stop.y < VIEW_H - STOP_HINT.glow / 2 && fingerTop > 60 && finger.y < 850 }).toEqual({
          ...spot,
          onScreen: true,
        });
        // The ✕ is the page's corner, about 220 × 200 in the picture's top left.
        expect({ ...spot, clearOfClose: left > 260 || fingerTop > 220 }).toEqual({ ...spot, clearOfClose: true });
      }
    });

    test(`${name}: no stop lands on the end`, () => {
      const end = machine.events.find((e) => e.done)?.at ?? machine.duration;
      for (const stop of machine.stops) expect(stop.at).toBeLessThan(end);
    });
  }
});
