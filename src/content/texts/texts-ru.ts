import { ru as pack } from "@/content/ru";
import { SEO_RU as seo } from "@/content/seo.ru";
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
import { RUSSIAN as animals } from "@/games/animals/content.ru";
import { RUSSIAN as shadows } from "@/games/shadows/content.ru";
import { RUSSIAN_TEXTS as socks } from "@/games/socks/content.ru";
import { STEP_TEXTS_RU as teethSteps } from "@/games/teeth/steps.ru";
import { DAYTIME_RU as teethDaytime } from "@/games/teeth/daytime.ru";
import { MILK_CHAIN_RU as milkChain } from "@/games/milkchain/ru";
import { PACIFIER_STORY_RU as pacifierStory } from "@/games/pacifierstory/ru";
import { KITA_STORY_RU as kitaStory } from "@/games/kitastory/ru";
import { HAIR_STORY_RU as hairStory } from "@/games/hairstory/ru";
import { HAIR_SHOWER_RU as hairShower } from "@/games/hairshower/ru";
import { CHILDMINDER_RU as childminder } from "@/games/childminder/ru";
import { NIGHT_MILK_RU as nightMilk } from "@/games/nightmilk/ru";
import { GOODBYE_MILK_RU as goodbyeMilk } from "@/games/milkgoodbye/ru";
import { PACIFIER_TREE_RU as pacifierTree } from "@/games/pacifiertree/ru";
import { BOTTLE_STORY_RU as bottleStory } from "@/games/bottlestory/ru";
import { BED_STORY_RU as bedStory } from "@/games/bedstory/ru";
import { TRANSLATION as cloudTrip } from "@/games/adventure/stories/cloudTrip/lines.ru";
import { TRANSLATION as fireRescue } from "@/games/adventure/stories/fireRescue/lines.ru";
import { TRANSLATION as treasureIsland } from "@/games/adventure/stories/treasureIsland/lines.ru";
import { CAUSE_SCENES_RU as cause } from "@/games/cause/scenes.ru";
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
  animals,
  shadows,
  socks,
  teethSteps,
  teethDaytime,
  milkChain,
  pacifierStory,
  kitaStory,
  hairStory,
  hairShower,
  childminder,
  nightMilk,
  goodbyeMilk,
  pacifierTree,
  bottleStory,
  bedStory,
  cause,
  seo,
  stories: { cloudTrip, fireRescue, treasureIsland },
};
