import { en as pack } from "@/content/en";
import { EN as badezimmer } from "@/games/scenes/badezimmer/en";
import { EN as bauernhof } from "@/games/scenes/bauernhof/en";
import { EN as baustelle } from "@/games/scenes/baustelle/en";
import { EN as dinotal } from "@/games/scenes/dinotal/en";
import { EN as feuerwache } from "@/games/scenes/feuerwache/en";
import { EN as flughafen } from "@/games/scenes/flughafen/en";
import { EN as gutenacht } from "@/games/scenes/gutenacht/en";
import { EN as herbst } from "@/games/scenes/herbst/en";
import { EN as hof } from "@/games/scenes/hof/en";
import { EN as kinderarzt } from "@/games/scenes/kinderarzt/en";
import { EN as kita } from "@/games/scenes/kita/en";
import { EN as kueche } from "@/games/scenes/kueche/en";
import { EN as ostern } from "@/games/scenes/ostern/en";
import { EN as spielplatz } from "@/games/scenes/spielplatz/en";
import { EN as stadt } from "@/games/scenes/stadt/en";
import { EN as strand } from "@/games/scenes/strand/en";
import { EN as supermarkt } from "@/games/scenes/supermarkt/en";
import { EN as unterwasser } from "@/games/scenes/unterwasser/en";
import { EN as wald } from "@/games/scenes/wald/en";
import { EN as weltall } from "@/games/scenes/weltall/en";
import { EN as winter } from "@/games/scenes/winter/en";
import { EN as winterbaustelle } from "@/games/scenes/winterbaustelle/en";
import { EN as zoo } from "@/games/scenes/zoo/en";
import { EN as elevator } from "@/games/elevator/en";
import { ENGLISH as animals } from "@/games/animals/content.en";
import { ENGLISH as shadows } from "@/games/shadows/content.en";
import { ENGLISH_TEXTS as socks } from "@/games/socks/content.en";
import { STEP_TEXTS_EN as teethSteps } from "@/games/teeth/steps.en";
import { DAYTIME_EN as teethDaytime } from "@/games/teeth/daytime.en";
import { COMFORTS_EN as comforts, FEELINGS_EN as feelings } from "@/games/feelings/bear.en";
import { SITUATIONS_EN as situations } from "@/games/feelings/kita.en";
import { TRANSLATION as cloudTrip } from "@/games/adventure/stories/cloudTrip/lines.en";
import { TRANSLATION as treasureIsland } from "@/games/adventure/stories/treasureIsland/lines.en";
import type { LanguageTexts } from ".";

// Everything in English that lives in files of its own, one chunk loaded only when the app plays in English
// (see index.ts). A new English file is listed here; texts.test.ts checks that none is missing.

/** The English texts. */
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
