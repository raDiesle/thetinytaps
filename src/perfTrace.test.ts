import { describe, expect, test } from "bun:test";
import { rasteredPixels, type TraceEvent } from "../tools/perfTrace";

// `bun run perf` counts the pixels rastered anew from Chrome's trace (tools/perfTrace.ts). A raster task names its tile
// only by a memory address, which Chrome reuses for tiles of other layers and sizes: counted by address alone, the same
// marble run measured 21 and 39 screens a second on the same code (A-41).

const snapshot = (ts: number, tiles: { id: string; layer: number; w: number; h: number }[]): TraceEvent => ({
  name: "LayerTreeHostImpl",
  ph: "O",
  ts,
  tid: 1,
  args: { snapshot: { active_tiles: tiles.map((t) => ({ id: `cc::Tile/${t.id}`, layer_id: t.layer, content_rect: [0, 0, t.w, t.h] })) } },
});
const raster = (ts: number, id: string, layer: number): TraceEvent => ({
  name: "RasterTask",
  ph: "X",
  ts,
  dur: 100,
  tid: 2,
  args: { tileData: { tileId: { id_ref: id }, layerId: layer } },
});

describe("rasteredPixels", () => {
  test("a tile address reused by another layer counts each raster at its own layer's size", () => {
    const events = [
      snapshot(0, [{ id: "0xa", layer: 7, w: 192, h: 192 }]),
      raster(10, "0xa", 7),
      // The marble's tile is deleted, and a band of the wall gets its address.
      snapshot(20, [{ id: "0xa", layer: 3, w: 1920, h: 288 }]),
      raster(30, "0xa", 3),
    ];
    expect(rasteredPixels(events)).toBe(192 * 192 + 1920 * 288);
  });

  test("an address reused within one layer takes the tile seen next after the raster", () => {
    const events = [
      snapshot(0, [{ id: "0xb", layer: 3, w: 1920, h: 288 }]),
      raster(10, "0xb", 3),
      snapshot(15, [{ id: "0xb", layer: 3, w: 1920, h: 288 }]),
      raster(20, "0xb", 3),
      snapshot(25, [{ id: "0xb", layer: 3, w: 1920, h: 288 }]),
      // An edge tile of the same layer at the same address later on.
      raster(30, "0xb", 3),
      snapshot(35, [{ id: "0xb", layer: 3, w: 1920, h: 40 }]),
    ];
    expect(rasteredPixels(events)).toBe(2 * 1920 * 288 + 1920 * 40);
  });

  test("a raster after the last snapshot takes that last snapshot, and an unknown tile counts nothing", () => {
    const events = [snapshot(0, [{ id: "0xc", layer: 5, w: 100, h: 100 }]), raster(50, "0xc", 5), raster(60, "0xd", 5), raster(70, "0xc", 6)];
    expect(rasteredPixels(events)).toBe(100 * 100);
  });
});
