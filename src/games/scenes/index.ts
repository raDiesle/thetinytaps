import { badezimmer } from "./badezimmer/Badezimmer";
import { bauernhof } from "./bauernhof/Bauernhof";
import { baustelle } from "./baustelle/Baustelle";
import { feuerwache } from "./feuerwache/Feuerwache";
import { hof } from "./hof/Hof";
import { stadt } from "./stadt/Stadt";
import type { Scene } from "./types";
import { unterwasser } from "./unterwasser/Unterwasser";
import { wald } from "./wald/Wald";
import { weltall } from "./weltall/Weltall";
import { winterbaustelle } from "./winterbaustelle/WinterBaustelle";
import { zoo } from "./zoo/Zoo";

/** All playable scenes, in menu order. */
export const SCENES: Scene[] = [baustelle, stadt, bauernhof, hof, zoo, unterwasser, badezimmer, wald, feuerwache, weltall, winterbaustelle];

/** Shown greyed out in the menu so children (and parents) know more is coming. */
export const UPCOMING_SCENES: { emoji: string; title: string }[] = [];

export function findScene(id: string): Scene | undefined {
  return SCENES.find((s) => s.id === id);
}
