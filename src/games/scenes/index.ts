import { baustelle } from "./baustelle/Baustelle";
import type { Scene } from "./types";

/** All playable scenes, in menu order. */
export const SCENES: Scene[] = [baustelle];

/** Shown greyed out in the menu so children (and parents) know more is coming. */
export const UPCOMING_SCENES = [
  { emoji: "🐮", title: "Bauernhof" },
  { emoji: "🦁", title: "Zoo" },
  { emoji: "🚦", title: "Stadt" },
];

export function findScene(id: string): Scene | undefined {
  return SCENES.find((s) => s.id === id);
}
