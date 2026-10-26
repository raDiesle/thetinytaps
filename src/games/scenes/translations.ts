import { RU as badezimmer } from "./badezimmer/ru";
import { RU as bauernhof } from "./bauernhof/ru";
import { RU as baustelle } from "./baustelle/ru";
import { RU as dinotal } from "./dinotal/ru";
import { RU as feuerwache } from "./feuerwache/ru";
import { RU as flughafen } from "./flughafen/ru";
import { RU as gutenacht } from "./gutenacht/ru";
import { RU as herbst } from "./herbst/ru";
import { RU as hof } from "./hof/ru";
import { RU as kinderarzt } from "./kinderarzt/ru";
import { RU as kita } from "./kita/ru";
import { RU as kueche } from "./kueche/ru";
import { RU as ostern } from "./ostern/ru";
import { RU as spielplatz } from "./spielplatz/ru";
import { RU as stadt } from "./stadt/ru";
import { RU as strand } from "./strand/ru";
import { RU as supermarkt } from "./supermarkt/ru";
import { RU as unterwasser } from "./unterwasser/ru";
import { RU as wald } from "./wald/ru";
import { RU as weltall } from "./weltall/ru";
import { RU as winter } from "./winter/ru";
import { RU as winterbaustelle } from "./winterbaustelle/ru";
import { RU as zoo } from "./zoo/ru";
import type { SceneTranslations } from "./types";

// The translations of every scene, by scene id: each scene folder has a ru.ts (and so
// on) with its words in that language. A scene or item without a translation is
// said in German.

/** Translations by scene id. */
export const SCENE_TRANSLATIONS: Record<string, SceneTranslations> = {
  badezimmer: { ru: badezimmer },
  bauernhof: { ru: bauernhof },
  baustelle: { ru: baustelle },
  dinotal: { ru: dinotal },
  feuerwache: { ru: feuerwache },
  flughafen: { ru: flughafen },
  gutenacht: { ru: gutenacht },
  herbst: { ru: herbst },
  hof: { ru: hof },
  kinderarzt: { ru: kinderarzt },
  kita: { ru: kita },
  kueche: { ru: kueche },
  ostern: { ru: ostern },
  spielplatz: { ru: spielplatz },
  stadt: { ru: stadt },
  strand: { ru: strand },
  supermarkt: { ru: supermarkt },
  unterwasser: { ru: unterwasser },
  wald: { ru: wald },
  weltall: { ru: weltall },
  winter: { ru: winter },
  winterbaustelle: { ru: winterbaustelle },
  zoo: { ru: zoo },
};
