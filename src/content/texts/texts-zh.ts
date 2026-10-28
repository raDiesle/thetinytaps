import { zh as pack } from "@/content/zh";
import { ZH as badezimmer } from "@/games/scenes/badezimmer/zh";
import { ZH as bauernhof } from "@/games/scenes/bauernhof/zh";
import { ZH as baustelle } from "@/games/scenes/baustelle/zh";
import { ZH as dinotal } from "@/games/scenes/dinotal/zh";
import { ZH as feuerwache } from "@/games/scenes/feuerwache/zh";
import { ZH as flughafen } from "@/games/scenes/flughafen/zh";
import { ZH as gutenacht } from "@/games/scenes/gutenacht/zh";
import { ZH as herbst } from "@/games/scenes/herbst/zh";
import { ZH as hof } from "@/games/scenes/hof/zh";
import { ZH as kinderarzt } from "@/games/scenes/kinderarzt/zh";
import { ZH as kita } from "@/games/scenes/kita/zh";
import { ZH as kueche } from "@/games/scenes/kueche/zh";
import { ZH as ostern } from "@/games/scenes/ostern/zh";
import { ZH as spielplatz } from "@/games/scenes/spielplatz/zh";
import { ZH as stadt } from "@/games/scenes/stadt/zh";
import { ZH as strand } from "@/games/scenes/strand/zh";
import { ZH as supermarkt } from "@/games/scenes/supermarkt/zh";
import { ZH as unterwasser } from "@/games/scenes/unterwasser/zh";
import { ZH as wald } from "@/games/scenes/wald/zh";
import { ZH as weltall } from "@/games/scenes/weltall/zh";
import { ZH as winter } from "@/games/scenes/winter/zh";
import { ZH as winterbaustelle } from "@/games/scenes/winterbaustelle/zh";
import { ZH as zoo } from "@/games/scenes/zoo/zh";
import { ZH as elevator } from "@/games/elevator/zh";
import { CHINESE as animals } from "@/games/animals/content.zh";
import { CHINESE as shadows } from "@/games/shadows/content.zh";
import { CHINESE_TEXTS as socks } from "@/games/socks/content.zh";
import { STEP_TEXTS_ZH as teethSteps } from "@/games/teeth/steps.zh";
import { DAYTIME_ZH as teethDaytime } from "@/games/teeth/daytime.zh";
import { COMFORTS_ZH as comforts, FEELINGS_ZH as feelings } from "@/games/feelings/bear.zh";
import { SITUATIONS_ZH as situations } from "@/games/feelings/kita.zh";
import { TRANSLATION as cloudTrip } from "@/games/adventure/stories/cloudTrip/lines.zh";
import { TRANSLATION as treasureIsland } from "@/games/adventure/stories/treasureIsland/lines.zh";
import inline from "inline-texts:zh";
import type { LanguageTexts } from ".";

// Everything in Chinese that lives in files of its own, one chunk loaded only when the app plays in Chinese
// (see index.ts). A new Chinese file is listed here; texts.test.ts checks that none is missing.

/** The Chinese texts. */
export const TEXTS: LanguageTexts = {
  inline,
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
