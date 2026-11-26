import { expect, test } from "bun:test";
import { type RasterTraceEvent, rasteredPixels } from "../tools/rasterArea";

const snapshot = (tiles: { id: string; layer: number; w: number; h: number }[]): RasterTraceEvent => ({
  name: "LayerTreeHostImpl:snapshot",
  ph: "O",
  args: { snapshot: { active_tiles: tiles.map((t) => ({ id: `cc::Tile/${t.id}`, layer_id: t.layer, content_rect: [0, 0, t.w, t.h] })) } },
});
const raster = (id: string, layer: number): RasterTraceEvent => ({
  name: "RasterTask",
  ph: "X",
  args: { tileData: { layerId: layer, tileId: { id_ref: id } } },
});

test("a raster task counts the tile of its own layer, though another layer's tile had the same id", () => {
  // Chrome hands a freed tile's address to a tile of another layer: by id alone the small tile took the big one's size.
  const events = [snapshot([{ id: "0xa", layer: 1, w: 192, h: 192 }]), snapshot([{ id: "0xa", layer: 2, w: 992, h: 288 }]), raster("0xa", 1), raster("0xa", 1)];
  expect(rasteredPixels(events)).toBe(2 * 192 * 192);
  expect(rasteredPixels([...events, raster("0xa", 2)])).toBe(2 * 192 * 192 + 992 * 288);
});

test("a raster task whose tile no snapshot shows counts nothing", () => {
  expect(rasteredPixels([raster("0xb", 3)])).toBe(0);
});
