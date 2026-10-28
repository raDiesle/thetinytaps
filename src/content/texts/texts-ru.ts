import { ru as pack } from "@/content/ru";
import { RU as badezimmer } from "@/games/scenes/badezimmer/ru";
import { RU as bauernhof } from "@/games/scenes/bauernhof/ru";
import { RU as baustelle } from "@/games/scenes/baustelle/ru";
import { RU as dinotal } from "@/games/scenes/dinotal/ru";
import { RU as feuerwache } from "@/games/scenes/feuerwache/ru";
import { RU as flughafen } from "@/games/scenes/flughafen/ru";
import { RU as gutenacht } from "@/games/scenes/gutenacht/ru";
import { RU as herbst } from "@/games/scenes/herbst/ru";
import { RU as hof } from "@/games/scenes/hof/ru";
import { RU as kinderarzt } from "@/games/scenes/kinderarzt/ru";
import { RU as kita } from "@/games/scenes/kita/ru";
import { RU as kueche } from "@/games/scenes/kueche/ru";
import { RU as ostern } from "@/games/scenes/ostern/ru";
import { RU as spielplatz } from "@/games/scenes/spielplatz/ru";
import { RU as stadt } from "@/games/scenes/stadt/ru";
import { RU as strand } from "@/games/scenes/strand/ru";
import { RU as supermarkt } from "@/games/scenes/supermarkt/ru";
import { RU as unterwasser } from "@/games/scenes/unterwasser/ru";
import { RU as wald } from "@/games/scenes/wald/ru";
import { RU as weltall } from "@/games/scenes/weltall/ru";
import { RU as winter } from "@/games/scenes/winter/ru";
import { RU as winterbaustelle } from "@/games/scenes/winterbaustelle/ru";
import { RU as zoo } from "@/games/scenes/zoo/ru";
import { RU as elevator } from "@/games/elevator/ru";
import { RUSSIAN as animals } from "@/games/animals/content.ru";
import { RUSSIAN as shadows } from "@/games/shadows/content.ru";
import { RUSSIAN_TEXTS as socks } from "@/games/socks/content.ru";
import { STEP_TEXTS_RU as teethSteps } from "@/games/teeth/steps.ru";
import { DAYTIME_RU as teethDaytime } from "@/games/teeth/daytime.ru";
import { COMFORTS_RU as comforts, FEELINGS_RU as feelings } from "@/games/feelings/bear.ru";
import { SITUATIONS_RU as situations } from "@/games/feelings/kita.ru";
import { TRANSLATION as cloudTrip } from "@/games/adventure/stories/cloudTrip/lines.ru";
import { TRANSLATION as treasureIsland } from "@/games/adventure/stories/treasureIsland/lines.ru";
import type { LanguageTexts } from ".";

// Everything in Russian that lives in files of its own, one chunk loaded only when the app plays in Russian
// (see index.ts). A new Russian file is listed here; texts.test.ts checks that none is missing.

/** The Russian texts. */
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
