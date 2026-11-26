// What `bun run perf` reads from Chrome's trace about rastering: how many pixels were turned into tiles anew.

/** The parts of a trace event `bun run perf` reads. */
export interface TraceEvent {
  name: string;
  ph: string;
  /** When it happened, in µs. */
  ts?: number;
  dur?: number;
  tid: number;
  args?: {
    tileData?: { tileId?: { id_ref?: string }; layerId?: number };
    snapshot?: { active_tiles?: { id?: string; layer_id?: number; content_rect?: number[] }[] };
  };
}

/**
 * The pixels rastered anew in a trace: each raster task's tile, its size taken from the compositor's tile snapshots.
 *
 * A raster task names its tile only by the tile's memory address, and Chrome gives a deleted tile's address to the next
 * tile it makes, of any layer and size: in ten seconds of a marble run 152 of 239 addresses had stood for several tiles
 * (a marble's 192 × 192 and a screen-wide band of the wall, 1920 × 288). Taking the last size seen at an address counted
 * a marble's raster as a whole band and a band's as a marble's, so the same stretch measured 21 one time and 39 the next
 * on the same code, and the wooden run's start 20 screens a second where it really rastered 36 (A-41, November 2026). So a
 * task's tile is looked up by address *and* layer, in the first snapshot from the task's time on (else the last before).
 */
export function rasteredPixels(events: readonly TraceEvent[]): number {
  const seen = new Map<string, { ts: number; area: number }[]>();
  for (const e of events) {
    for (const tile of e.args?.snapshot?.active_tiles ?? []) {
      if (!tile.id) continue;
      const [, , w = 0, h = 0] = tile.content_rect ?? [];
      const key = `${tile.id.replace(/^.*\//, "")}|${tile.layer_id}`;
      const list = seen.get(key) ?? [];
      list.push({ ts: e.ts ?? 0, area: w * h });
      seen.set(key, list);
    }
  }
  for (const list of seen.values()) list.sort((a, b) => a.ts - b.ts);
  let pixels = 0;
  for (const e of events) {
    if (e.name !== "RasterTask" || !(e.ph === "X" || e.ph === "B")) continue;
    const tile = e.args?.tileData;
    const list = seen.get(`${tile?.tileId?.id_ref ?? ""}|${tile?.layerId}`);
    if (!list?.length) continue;
    const at = e.ts ?? 0;
    pixels += (list.find((s) => s.ts >= at) ?? list[list.length - 1]).area;
  }
  return pixels;
}
