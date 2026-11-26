/** What `rasteredPixels` reads of a Chrome trace event. */
export interface RasterTraceEvent {
  name: string;
  ph: string;
  args?: {
    tileData?: { layerId?: number; tileId?: { id_ref?: string } };
    snapshot?: { active_tiles?: { id?: string; layer_id?: number | string; content_rect?: number[] }[] };
  };
}

/**
 * How many pixels a trace's raster tasks rastered anew: each task's tile, its size from the compositor's tile snapshots.
 * A tile is known by its layer and its id together: Chrome's tile ids are addresses it hands out again to tiles of other
 * layers, so a small sprite's 192 px tile, found by its id alone, was counted as a world layer's 992 × 288 band (A-42:
 * the Licht-Kette's middle counted 392 screens where 332 were rastered, and its fireflies looked like the main cost).
 */
export function rasteredPixels(events: RasterTraceEvent[]) {
  const tileArea = new Map<string, number>();
  for (const e of events) {
    for (const tile of e.args?.snapshot?.active_tiles ?? []) {
      const [, , w = 0, h = 0] = tile.content_rect ?? [];
      if (tile.id) tileArea.set(`${tile.layer_id}/${tile.id.replace(/^.*\//, "")}`, w * h);
    }
  }
  return events
    .filter((e) => e.name === "RasterTask" && (e.ph === "X" || e.ph === "B"))
    .reduce((sum, e) => sum + (tileArea.get(`${e.args?.tileData?.layerId}/${e.args?.tileData?.tileId?.id_ref ?? ""}`) ?? 0), 0);
}
