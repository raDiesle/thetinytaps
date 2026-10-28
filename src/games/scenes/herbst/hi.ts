import type { SceneTranslation } from "../types";

// The autumn picture in Hindi: the title, every item's name and sentences and the chain sentences.
// The kite is the पतंग children in India fly, the windmill toy the „फिरकी“; chestnuts, unknown to most,
// keep their English name „चेस्टनट“, and grandpa and grandma (दादाजी, दादी) get the respectful plural.

/** „Herbst“ in Hindi. */
export const HI: SceneTranslation = {
  title: "पतझड़",
  description: "रंग-बिरंगे पत्ते, कद्दू और हवा में पतंग।",
  items: {
    sonne: { name: "सूरज", gender: "m", sentences: ["पतझड़ का सूरज चमकता है!", "सूरज मुस्कुराता है।", "सूरज अभी भी थोड़ी गरमी देता है।"] },
    wolke: { name: "बादल", gender: "m", sentences: ["बादल से बारिश होती है। छप-छप!", "पतझड़ में अक्सर बारिश होती है।"] },
    herbstwind: { name: "हवा", gender: "f", sentences: ["हवा फूँकती है: वूऊऊ!", "हवा पत्तों को उड़ा ले जाती है।", "सूऊँ! आज बहुत हवा चल रही है।"] },
    wildgaense: { name: "जंगली हंस", gender: "m", plural: true, sentences: ["जंगली हंस दक्षिण की ओर उड़ते हैं।", "कें, कें! टाटा, हंसो!"] },
    herbstdrachen: { name: "पतंग", gender: "f", sentences: ["पतंग बहुत ऊँची उड़ती है!", "पतंग हवा में नाचती है।", "पतंग पर एक हँसता चेहरा है।"] },
    pflugtraktor: { name: "ट्रैक्टर", gender: "m", sentences: ["ट्रैक्टर खेत जोतता है।", "टक, टक, टक, करता है ट्रैक्टर।"] },
    kraehe: { name: "कौआ", gender: "m", sentences: ["काँव, काँव! कौआ पुकारता है।", "कौआ खंभे पर बैठा है।"] },
    schuppen: { name: "कोठरी", gender: "f", sentences: ["कोठरी में दंताली और झाड़ू रहते हैं।", "चर्र! दरवाज़ा खुलता है। अंदर कौन है?"] },
    spinnennetz: { name: "जाला", gender: "m", sentences: ["जाले में ओस की बूँदें चमकती हैं।", "मकड़ी धागे से नीचे उतरती है।"] },
    baeuerin: { name: "किसान आंटी", gender: "f", sentences: ["हेलो! तुम्हें कद्दू चाहिए?", "किसान आंटी कद्दू बेचती है।"] },
    kuerbisstand: {
      name: "कद्दू की दुकान",
      gender: "f",
      sentences: ["कद्दू की दुकान पर बहुत सारे कद्दू हैं।", "पीले, हरे और नारंगी कद्दू!", "डिब्बे में क्या है?"],
    },
    apfelkorb: { name: "सेबों की टोकरी", gender: "f", sentences: ["टोकरी सेबों से भरी है।", "लाल, हरे और पीले सेब। उम्म!"] },
    ahorn: {
      name: "मेपल",
      gender: "m",
      sentences: ["मेपल के पत्ते लाल हैं।", "बीज छोटे-छोटे हेलीकॉप्टर की तरह उड़ते हैं!", "सरसर! पत्ते गिरते हैं।"],
    },
    drachenjunge: { name: "लड़का", gender: "m", sentences: ["लड़का पतंग उड़ाता है।", "हुर्रे! लड़का डोर को कसकर पकड़ता है।"] },
    laubopa: { name: "दादाजी", gender: "m", sentences: ["दादाजी पत्तों को इकट्ठा करते हैं।", "खर्र, खर्र, करती है दंताली।", "दादाजी कहते हैं: हेलो!"] },
    laubhaufen: {
      name: "पत्तों का ढेर",
      gender: "m",
      sentences: ["वूह! पत्ते ऊपर उड़ते हैं।", "पत्तों के ढेर में छिप सकते हैं।", "सरसर! पत्तों में कौन है?"],
    },
    strickoma: { name: "दादी", gender: "f", sentences: ["दादी मफ़लर बुनती हैं।", "खट, खट, करती हैं सलाइयाँ।", "मफ़लर लंबा और गरम होता जाता है।"] },
    bankkatze: { name: "बिल्ली", gender: "f", sentences: ["म्याऊँ! बिल्ली ऊन से खेलती है।", "बिल्ली बेंच पर बैठी है।"] },
    kastanienbaum: {
      name: "चेस्टनट का पेड़",
      gender: "m",
      sentences: ["धप! चेस्टनट नीचे गिरते हैं।", "पत्ते पीले और भूरे हैं।", "चेस्टनट का पेड़ बड़ा है।"],
    },
    herbsthoernchen: { name: "गिलहरी", gender: "f", sentences: ["गिलहरी सर्दी के लिए मेवे इकट्ठा करती है।", "कुतर, कुतर! स्वादिष्ट, एक मेवा।"] },
    laubigel: { name: "साही", gender: "f", sentences: ["साही अपनी पीठ पर एक सेब ले जाती है।", "सूँ, सूँ! साही पत्तों का बिस्तर ढूँढती है।"] },
    kuerbiswagen: { name: "हाथगाड़ी", gender: "f", sentences: ["हाथगाड़ी में कद्दू रखे हैं।", "खड़-खड़, हाथगाड़ी चलती है।"] },
    laubhund: { name: "कुत्ता", gender: "m", sentences: ["भौं-भौं! कुत्ता पत्ता पकड़ना चाहता है।", "कुत्ता ऊपर उछलता है!"] },
    kastanie: { name: "चेस्टनट", gender: "m", sentences: ["चेस्टनट भूरा और चमकीला है।", "छिलका काँटेदार है। उई!"] },
    steinpilze: { name: "मशरूम", gender: "m", plural: true, sentences: ["पॉप, पॉप! मशरूम उगते हैं।", "मशरूमों की टोपियाँ भूरी हैं।"] },
    kastanienmann: { name: "चेस्टनट गुड्डा", gender: "m", sentences: ["चेस्टनट गुड्डा नाचता है!", "वो चेस्टनट से बना है।"] },
    herbstwindrad: { name: "फिरकी", gender: "f", sentences: ["फिरकी हवा में घूमती है।", "लाल, पीली, नीली और हरी। स्स्स!"] },
    amsel: { name: "काली चिड़िया", gender: "f", sentences: ["काली चिड़िया लाल बेर खाती है।", "काली चिड़िया एक गाना गाती है।"] },
    riesenkuerbis: {
      name: "कद्दू",
      gender: "m",
      sentences: ["कद्दू उछलता है! सरसर!", "कद्दू मोटा और गोल है।", "कद्दू के पीछे एक चूहा रहता है।"],
    },
    martinslaterne: {
      name: "लालटेन",
      gender: "f",
      sentences: ["लालटेन, लालटेन, सूरज, चाँद और तारे!", "लालटेन तेज़ चमकती है।", "बच्चा लालटेन का गाना गाता है।"],
    },
    matschpfuetze: { name: "पोखर", gender: "m", sentences: ["छपाक! पोखर का पानी उछलता है।", "एक पत्ता नाव की तरह तैरता है।"] },
    pfuetzenkind: {
      name: "लड़की",
      gender: "f",
      sentences: ["हॉप! लड़की पोखर में कूदती है।", "लड़की के पास छाता है।", "गमबूट पहनकर पोखर में कूद सकते हैं!"],
    },
    apfelwurm: { name: "कीड़ा", gender: "m", sentences: ["हेलो, छोटे कीड़े!", "कीड़ा सेब में रहता है। चप, चप!"] },
    herbststiefel: {
      name: "गमबूट",
      gender: "m",
      plural: true,
      sentences: ["गमबूट उछलते हैं!", "लाल गमबूट, सफ़ेद बिंदियों वाले।", "बूट में कौन छिपा है?"],
    },
    regenschnecke: { name: "घोंघा", gender: "m", sentences: ["घोंघे को बारिश पसंद है।", "घोंघा बहुत धीरे-धीरे रेंगता है।"] },
  },
  chains: [
    ["हवा पतंग को बहुत ऊपर उड़ा देती है!", "और फिरकी घूमती है।", "पत्ते पेड़ से उड़ जाते हैं।"],
    ["बारिश! लड़की पोखर में कूदती है।", "घोंघा बाहर आता है।", "बारिश के बाद मशरूम उगते हैं।"],
    ["धप! एक चेस्टनट नीचे गिरता है।", "गिलहरी ने उसे देख लिया है!"],
  ],
};
