import { es as pack } from "@/content/es";
import { SEO_ES as seo } from "@/content/seo.es";
import { ES as badezimmer } from "@/games/scenes/badezimmer/es";
import { ES as bauernhof } from "@/games/scenes/bauernhof/es";
import { ES as baustelle } from "@/games/scenes/baustelle/es";
import { ES as dinotal } from "@/games/scenes/dinotal/es";
import { ES as feuerwache } from "@/games/scenes/feuerwache/es";
import { ES as flughafen } from "@/games/scenes/flughafen/es";
import { ES as gutenacht } from "@/games/scenes/gutenacht/es";
import { ES as herbst } from "@/games/scenes/herbst/es";
import { ES as hof } from "@/games/scenes/hof/es";
import { ES as kinderarzt } from "@/games/scenes/kinderarzt/es";
import { ES as kita } from "@/games/scenes/kita/es";
import { ES as kueche } from "@/games/scenes/kueche/es";
import { ES as ostern } from "@/games/scenes/ostern/es";
import { ES as spielplatz } from "@/games/scenes/spielplatz/es";
import { ES as stadt } from "@/games/scenes/stadt/es";
import { ES as strand } from "@/games/scenes/strand/es";
import { ES as supermarkt } from "@/games/scenes/supermarkt/es";
import { ES as unterwasser } from "@/games/scenes/unterwasser/es";
import { ES as wald } from "@/games/scenes/wald/es";
import { ES as weltall } from "@/games/scenes/weltall/es";
import { ES as winter } from "@/games/scenes/winter/es";
import { ES as winterbaustelle } from "@/games/scenes/winterbaustelle/es";
import { ES as zoo } from "@/games/scenes/zoo/es";
import { SPANISH as animals } from "@/games/animals/content.es";
import { SPANISH as shadows } from "@/games/shadows/content.es";
import { SPANISH_TEXTS as socks } from "@/games/socks/content.es";
import { STEP_TEXTS_ES as teethSteps } from "@/games/teeth/steps.es";
import { DAYTIME_ES as teethDaytime } from "@/games/teeth/daytime.es";
import { MILK_CHAIN_ES as milkChain } from "@/games/milkchain/es";
import { PACIFIER_STORY_ES as pacifierStory } from "@/games/pacifierstory/es";
import { KITA_STORY_ES as kitaStory } from "@/games/kitastory/es";
import { HAIR_STORY_ES as hairStory } from "@/games/hairstory/es";
import { NIGHT_MILK_ES as nightMilk } from "@/games/nightmilk/es";
import { GOODBYE_MILK_ES as goodbyeMilk } from "@/games/milkgoodbye/es";
import { PACIFIER_TREE_ES as pacifierTree } from "@/games/pacifiertree/es";
import { BOTTLE_STORY_ES as bottleStory } from "@/games/bottlestory/es";
import { BED_STORY_ES as bedStory } from "@/games/bedstory/es";
import { TRANSLATION as cloudTrip } from "@/games/adventure/stories/cloudTrip/lines.es";
import { TRANSLATION as fireRescue } from "@/games/adventure/stories/fireRescue/lines.es";
import { TRANSLATION as treasureIsland } from "@/games/adventure/stories/treasureIsland/lines.es";
import { CAUSE_SCENES_ES as cause } from "@/games/cause/scenes.es";
import type { LanguageTexts } from ".";

// Everything in Spanish that lives in files of its own, one chunk loaded only when the app plays in Spanish
// (see index.ts). A new Spanish file is listed here; texts.test.ts checks that none is missing.

/** The Spanish texts. */
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
  nightMilk,
  goodbyeMilk,
  pacifierTree,
  bottleStory,
  bedStory,
  cause,
  seo,
  stories: { cloudTrip, fireRescue, treasureIsland },
};
