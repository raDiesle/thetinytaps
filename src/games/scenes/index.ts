import { badezimmer } from "./badezimmer/Badezimmer";
import { bauernhof } from "./bauernhof/Bauernhof";
import { baustelle } from "./baustelle/Baustelle";
import { dinotal } from "./dinotal/Dinotal";
import { feuerwache } from "./feuerwache/Feuerwache";
import { flughafen } from "./flughafen/Flughafen";
import { gutenacht } from "./gutenacht/GuteNacht";
import { herbst } from "./herbst/Herbst";
import { hof } from "./hof/Hof";
import { kinderarzt } from "./kinderarzt/Kinderarzt";
import { kita } from "./kita/Kita";
import { kueche } from "./kueche/Kueche";
import { ostern } from "./ostern/Ostern";
import { spielplatz } from "./spielplatz/Spielplatz";
import { stadt } from "./stadt/Stadt";
import { strand } from "./strand/Strand";
import { supermarkt } from "./supermarkt/Supermarkt";
import type { Scene } from "./types";
import { unterwasser } from "./unterwasser/Unterwasser";
import { wald } from "./wald/Wald";
import { weltall } from "./weltall/Weltall";
import { winter } from "./winter/Winter";
import { winterbaustelle } from "./winterbaustelle/WinterBaustelle";
import { zoo } from "./zoo/Zoo";

/**
 * All playable scenes, in menu order, loaded at once: only for the tests and the management page. The game loads each
 * picture on its own (`loadScene` in catalog.ts), so a picture never downloads the other 22.
 */
export const SCENES: Scene[] = [
  baustelle,
  stadt,
  bauernhof,
  hof,
  zoo,
  unterwasser,
  badezimmer,
  wald,
  feuerwache,
  weltall,
  spielplatz,
  kueche,
  supermarkt,
  flughafen,
  winterbaustelle,
  kita,
  kinderarzt,
  strand,
  dinotal,
  gutenacht,
  winter,
  herbst,
  ostern,
];

export function findScene(id: string): Scene | undefined {
  return SCENES.find((s) => s.id === id);
}
