// Research for grown-ups, shown on the hidden page /management/recherchen/ by topic (`area`),
// one file per study. Newest first. Idea ids and game addresses are checked in content.test.ts.

import type { Research } from "./types";
import { svgAnimationLeistung } from "./svg-animation-leistung";
import { youtubeTimerThemen } from "./youtube-timer-themen";
import { tinyfingersMarke } from "./tinyfingers-marke";
import { nachtsAbstillen } from "./nachts-abstillen";
import { flascheAbgewoehnen } from "./flasche-abgewoehnen";
import { grossesBett } from "./grosses-bett";
import { youtubeThemen } from "./youtube-themen";
import { youtubeRechte } from "./youtube-rechte";
import { youtubeKanal } from "./youtube-kanal";
import { youtubeSuchen } from "./youtube-suchen";
import { haareWaschen } from "./haare-waschen";
import { geminiBildpreise } from "./gemini-bildpreise";
import { kitaEingewoehnung } from "./kita-eingewoehnung";
import { schnullerfeeKapitel } from "./schnullerfee-kapitel";
import { abstillenKapitel } from "./abstillen-kapitel";
import { besucherVerhalten } from "./besucher-verhalten";
import { gefuehleGruppen } from "./gefuehle-gruppen";
import { rituale } from "./rituale";
import { websiteDownload } from "./website-download";
import { aehnlicheUmrisse } from "./aehnliche-umrisse";
import { gefuehleSelbstRegulieren } from "./gefuehle-selbst-regulieren";
import { tafelVerkaufen } from "./tafel-verkaufen";
import { domainTafel } from "./domain-tafel";
import { domainKids } from "./domain-kids";
import { leistungAlteHandys } from "./leistung-alte-handys";
import { seoPruefung } from "./seo-pruefung";
import { domain } from "./domain";
import { tagesplan } from "./tagesplan";
import { belohnungstafel } from "./belohnungstafel";
import { toepfchenOderHygiene } from "./toepfchen-oder-hygiene";
import { googleEltern } from "./google-eltern";

export { RESEARCH_AREAS } from "./types";
export type { Research, ResearchArea, ResearchDomain, ResearchExclusion, ResearchGameMatch, ResearchTopic } from "./types";

export const RESEARCH: Research[] = [
  svgAnimationLeistung,
  youtubeTimerThemen,
  tinyfingersMarke,
  nachtsAbstillen,
  flascheAbgewoehnen,
  grossesBett,
  youtubeThemen,
  youtubeRechte,
  youtubeSuchen,
  youtubeKanal,
  haareWaschen,
  geminiBildpreise,
  kitaEingewoehnung,
  schnullerfeeKapitel,
  abstillenKapitel,
  besucherVerhalten,
  gefuehleGruppen,
  rituale,
  websiteDownload,
  aehnlicheUmrisse,
  gefuehleSelbstRegulieren,
  tafelVerkaufen,
  domainTafel,
  domainKids,
  leistungAlteHandys,
  seoPruefung,
  domain,
  tagesplan,
  belohnungstafel,
  toepfchenOderHygiene,
  googleEltern,
];
