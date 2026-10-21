import { bauernhof } from "./bauernhof/Bauernhof";
import { baustelle } from "./baustelle/Baustelle";
import { hof } from "./hof/Hof";
import { stadt } from "./stadt/Stadt";
import type { Scene } from "./types";

/** All playable scenes, in menu order. */
export const SCENES: Scene[] = [baustelle, stadt, bauernhof, hof];

/** Shown greyed out in the menu so children (and parents) know more is coming. */
export const UPCOMING_SCENES = [
  { emoji: "🦁", title: "Zoo" },
];

export function findScene(id: string): Scene | undefined {
  return SCENES.find((s) => s.id === id);
}
