import type { ShadowItem, ShadowTexts, ShadowTranslation } from "./content";

// Hindi texts for "Schatten finden" and "Wer schaut da raus?", by the ids of the pictures in content.ts. Hindi verbs
// follow the picture's gender (ढूँढ रहा/रही), so the sentences are built with की and "यह … है" instead, which need
// none: "हाथी की परछाईं कहाँ है?", "यह हाथी है।". Before की a masculine noun in -ा takes its oblique form
// (कछुआ → कछुए की), kept as `of`.

/** A picture's name in Hindi. */
export interface HindiName {
  /** As said on its own, shown under the picture: "कछुआ". */
  name: string;
  /** Before की (oblique), where it differs: "कछुए". */
  of?: string;
}

/** Pictures of content.ts by their id; one without an entry is said in German. */
export const HINDI_NAMES: Record<string, HindiName> = {
  elefant: { name: "हाथी" },
  giraffe: { name: "जिराफ़" },
  schildkroete: { name: "कछुआ", of: "कछुए" },
  schnecke: { name: "घोंघा", of: "घोंघे" },
  schmetterling: { name: "तितली" },
  fisch: { name: "मछली" },
  hahn: { name: "मुर्गा", of: "मुर्गे" },
  ente: { name: "बत्तख" },
  hase: { name: "खरगोश" },
  katze: { name: "बिल्ली" },
  hund: { name: "कुत्ता", of: "कुत्ते" },
  pferd: { name: "घोड़ा", of: "घोड़े" },
  kuh: { name: "गाय" },
  schwein: { name: "सूअर" },
  schaf: { name: "भेड़" },
  igel: { name: "साही" },
  krebs: { name: "केकड़ा", of: "केकड़े" },
  tintenfisch: { name: "ऑक्टोपस" },
  dino: { name: "डायनासोर" },
  krokodil: { name: "मगरमच्छ" },
  eichhoernchen: { name: "गिलहरी" },
  eule: { name: "उल्लू" },
  biene: { name: "मधुमक्खी" },
  wal: { name: "व्हेल" },
  flamingo: { name: "फ़्लेमिंगो" },
  pinguin: { name: "पेंगुइन" },
  maus: { name: "चूहा", of: "चूहे" },

  auto: { name: "कार" },
  fahrrad: { name: "साइकिल" },
  lok: { name: "रेलगाड़ी" },
  flugzeug: { name: "हवाई जहाज़" },
  hubschrauber: { name: "हेलीकॉप्टर" },
  segelboot: { name: "पालनाव" },
  rakete: { name: "रॉकेट" },
  traktor: { name: "ट्रैक्टर" },
  roller: { name: "स्कूटर" },
  feuerwehr: { name: "दमकल" },
  motorrad: { name: "मोटरसाइकिल" },

  banane: { name: "केला", of: "केले" },
  apfel: { name: "सेब" },
  birne: { name: "नाशपाती" },
  moehre: { name: "गाजर" },
  erdbeere: { name: "स्ट्रॉबेरी" },
  melone: { name: "तरबूज़" },
  kaese: { name: "चीज़" },
  brezel: { name: "प्रेट्ज़ेल" },
  eis: { name: "आइसक्रीम" },
  pilz: { name: "मशरूम" },
  mais: { name: "भुट्टा", of: "भुट्टे" },
  brokkoli: { name: "ब्रोकली" },
  pizza: { name: "पिज़्ज़ा" },

  stern: { name: "तारा", of: "तारे" },
  schirm: { name: "छाता", of: "छाते" },
  schluessel: { name: "चाबी" },
  ballon: { name: "गुब्बारा", of: "गुब्बारे" },
  mond: { name: "चाँद" },
  baum: { name: "पेड़" },
  haus: { name: "घर" },
  schere: { name: "कैंची" },
  gitarre: { name: "गिटार" },
  schuh: { name: "जूता", of: "जूते" },
  teddy: { name: "टेडी बियर" },
  drachen: { name: "पतंग" },
  glocke: { name: "घंटी" },
  herz: { name: "दिल" },
};

/** The Hindi texts; a picture without its Hindi name gets the whole German sentence. */
export function hindiTexts(german: ShadowTexts): ShadowTexts {
  const about =
    (sentence: (hi: HindiName, of: string) => string, fallback: (item: ShadowItem) => string) =>
    (item: ShadowItem): string => {
      const hi = HINDI_NAMES[item.id];
      return hi ? sentence(hi, hi.of ?? hi.name) : fallback(item);
    };
  return {
    name: about((hi) => hi.name, german.name),
    search: about((_, of) => `${of} की परछाईं कहाँ है?`, german.search),
    found: about((_, of) => `वाह! यह रही ${of} की परछाईं!`, german.found),
    thatIs: about((hi) => `यह ${hi.name} है।`, german.thatIs),
    peek: "कौन झाँक रहा है?",
    there: about((hi) => `अरे, यह तो ${hi.name} है!`, german.there),
    shadow: (n) => `परछाईं ${n}`,
    stars: (n) => `${n} पूरे`,
  };
}

/** Hindi, for the table of languages in content.ts. */
export const HINDI: ShadowTranslation = { names: HINDI_NAMES, texts: hindiTexts };
