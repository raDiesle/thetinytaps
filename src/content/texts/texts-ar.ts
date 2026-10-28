import { ar as pack } from "@/content/ar";
import { AR as badezimmer } from "@/games/scenes/badezimmer/ar";
import { AR as bauernhof } from "@/games/scenes/bauernhof/ar";
import { AR as baustelle } from "@/games/scenes/baustelle/ar";
import { AR as dinotal } from "@/games/scenes/dinotal/ar";
import { AR as feuerwache } from "@/games/scenes/feuerwache/ar";
import { AR as flughafen } from "@/games/scenes/flughafen/ar";
import { AR as gutenacht } from "@/games/scenes/gutenacht/ar";
import { AR as herbst } from "@/games/scenes/herbst/ar";
import { AR as hof } from "@/games/scenes/hof/ar";
import { AR as kinderarzt } from "@/games/scenes/kinderarzt/ar";
import { AR as kita } from "@/games/scenes/kita/ar";
import { AR as kueche } from "@/games/scenes/kueche/ar";
import { AR as ostern } from "@/games/scenes/ostern/ar";
import { AR as spielplatz } from "@/games/scenes/spielplatz/ar";
import { AR as stadt } from "@/games/scenes/stadt/ar";
import { AR as strand } from "@/games/scenes/strand/ar";
import { AR as supermarkt } from "@/games/scenes/supermarkt/ar";
import { AR as unterwasser } from "@/games/scenes/unterwasser/ar";
import { AR as wald } from "@/games/scenes/wald/ar";
import { AR as weltall } from "@/games/scenes/weltall/ar";
import { AR as winter } from "@/games/scenes/winter/ar";
import { AR as winterbaustelle } from "@/games/scenes/winterbaustelle/ar";
import { AR as zoo } from "@/games/scenes/zoo/ar";
import { AR as elevator } from "@/games/elevator/ar";
import { ARABIC as animals } from "@/games/animals/content.ar";
import { ARABIC as shadows } from "@/games/shadows/content.ar";
import { ARABIC_TEXTS as socks } from "@/games/socks/content.ar";
import { STEP_TEXTS_AR as teethSteps } from "@/games/teeth/steps.ar";
import { DAYTIME_AR as teethDaytime } from "@/games/teeth/daytime.ar";
import { COMFORTS_AR as comforts, FEELINGS_AR as feelings } from "@/games/feelings/bear.ar";
import { SITUATIONS_AR as situations } from "@/games/feelings/kita.ar";
import { TRANSLATION as cloudTrip } from "@/games/adventure/stories/cloudTrip/lines.ar";
import { TRANSLATION as treasureIsland } from "@/games/adventure/stories/treasureIsland/lines.ar";
import type { LanguageTexts } from ".";

// Everything in Arabic that lives in files of its own, one chunk loaded only when the app plays in Arabic
// (see index.ts). A new Arabic file is listed here; texts.test.ts checks that none is missing.

/** The Arabic texts. */
export const TEXTS: LanguageTexts = {
  pack,
  scenes: {
    badezimmer,
    bauernhof,
    baustelle,
    dinotal,
    feuerwache,
    flughafen,
    gutenacht,
    herbst,
    hof,
    kinderarzt,
    kita,
    kueche,
    ostern,
    spielplatz,
    stadt,
    strand,
    supermarkt,
    unterwasser,
    wald,
    weltall,
    winter,
    winterbaustelle,
    zoo,
  },
  elevator,
  animals,
  shadows,
  socks,
  teethSteps,
  teethDaytime,
  comforts,
  feelings,
  situations,
  stories: { cloudTrip, treasureIsland },
};
