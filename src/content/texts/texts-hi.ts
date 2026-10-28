import { hi as pack } from "@/content/hi";
import { HI as badezimmer } from "@/games/scenes/badezimmer/hi";
import { HI as bauernhof } from "@/games/scenes/bauernhof/hi";
import { HI as baustelle } from "@/games/scenes/baustelle/hi";
import { HI as dinotal } from "@/games/scenes/dinotal/hi";
import { HI as feuerwache } from "@/games/scenes/feuerwache/hi";
import { HI as flughafen } from "@/games/scenes/flughafen/hi";
import { HI as gutenacht } from "@/games/scenes/gutenacht/hi";
import { HI as herbst } from "@/games/scenes/herbst/hi";
import { HI as hof } from "@/games/scenes/hof/hi";
import { HI as kinderarzt } from "@/games/scenes/kinderarzt/hi";
import { HI as kita } from "@/games/scenes/kita/hi";
import { HI as kueche } from "@/games/scenes/kueche/hi";
import { HI as ostern } from "@/games/scenes/ostern/hi";
import { HI as spielplatz } from "@/games/scenes/spielplatz/hi";
import { HI as stadt } from "@/games/scenes/stadt/hi";
import { HI as strand } from "@/games/scenes/strand/hi";
import { HI as supermarkt } from "@/games/scenes/supermarkt/hi";
import { HI as unterwasser } from "@/games/scenes/unterwasser/hi";
import { HI as wald } from "@/games/scenes/wald/hi";
import { HI as weltall } from "@/games/scenes/weltall/hi";
import { HI as winter } from "@/games/scenes/winter/hi";
import { HI as winterbaustelle } from "@/games/scenes/winterbaustelle/hi";
import { HI as zoo } from "@/games/scenes/zoo/hi";
import { HI as elevator } from "@/games/elevator/hi";
import { HINDI as animals } from "@/games/animals/content.hi";
import { HINDI as shadows } from "@/games/shadows/content.hi";
import { HINDI_TEXTS as socks } from "@/games/socks/content.hi";
import { STEP_TEXTS_HI as teethSteps } from "@/games/teeth/steps.hi";
import { DAYTIME_HI as teethDaytime } from "@/games/teeth/daytime.hi";
import { COMFORTS_HI as comforts, FEELINGS_HI as feelings } from "@/games/feelings/bear.hi";
import { SITUATIONS_HI as situations } from "@/games/feelings/kita.hi";
import { TRANSLATION as cloudTrip } from "@/games/adventure/stories/cloudTrip/lines.hi";
import { TRANSLATION as treasureIsland } from "@/games/adventure/stories/treasureIsland/lines.hi";
import inline from "inline-texts:hi";
import type { LanguageTexts } from ".";

// Everything in Hindi that lives in files of its own, one chunk loaded only when the app plays in Hindi
// (see index.ts). A new Hindi file is listed here; texts.test.ts checks that none is missing.

/** The Hindi texts. */
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
