import type { SceneTranslation } from "../types";

// The daycare in Hindi: the title, every item's name and sentences and the chain sentences.
// The Kita is the „प्ले स्कूल“ and the teacher „टीचर दीदी“, as children in India say; the pudding is
// the wobbling „जेली“ they know.

/** „Kita“ in Hindi. */
export const HI: SceneTranslation = {
  title: "प्ले स्कूल",
  description: "खूँटी पर जैकेट, ब्लॉक कोना, कहानी, खाना और दोपहर की नींद।",
  items: {
    wimpelkette: { name: "झंडियाँ", gender: "f", plural: true, sentences: ["रंग-बिरंगी झंडियाँ इधर-उधर हिलती हैं।", "आज प्ले स्कूल में उत्सव है!"] },
    bilder: { name: "तस्वीरें", gender: "f", plural: true, sentences: ["ये बच्चों ने बनाई हैं!", "देखो, एक घर, एक इंद्रधनुष और एक बिल्ली।"] },
    tuer: { name: "दरवाज़ा", gender: "m", sentences: ["दरवाज़ा खुलता है। हेलो, मम्मी!", "मम्मी जल्दी लेने आएगी।"] },
    geburtstagszug: { name: "जन्मदिन की ट्रेन", gender: "f", sentences: ["छुक-छुक! जन्मदिन की ट्रेन चलती है।", "ट्रेन पर मोमबत्ती वाला केक है।"] },
    uhr: { name: "घड़ी", gender: "f", sentences: ["टिक-टिक! घड़ी चलती है।", "जल्दी ही खाना मिलेगा।"] },
    garderobe: {
      name: "खूँटियाँ",
      gender: "f",
      plural: true,
      sentences: ["यहाँ जैकेट टँगी हैं।", "हर बच्चे की खूँटी पर एक तस्वीर है: सूरज, बत्तख, तारा।"],
    },
    rucksack: { name: "बस्ता", gender: "m", sentences: ["बस्ता खुलता है। अंदर एक सेब है!", "और टेडी भी प्ले स्कूल आया है।"] },
    fenster: { name: "खिड़की", gender: "f", sentences: ["खिड़की खुलती है। ताज़ी हवा!", "पापा बगीचे में हाथ हिलाते हैं: टाटा!"] },
    vogel: { name: "चिड़िया", gender: "f", sentences: ["चीं, चीं! चिड़िया एक दाना चुगती है।", "छोटी चिड़िया दाने वाले घर पर बैठी है।"] },
    hamster: { name: "हैम्स्टर", gender: "m", sentences: ["हैम्स्टर पहिए में दौड़ता है।", "देखो, उसके गाल फूले हुए हैं!", "छोटा दरवाज़ा खुलता है।"] },
    schrank: { name: "अलमारी", gender: "f", sentences: ["अलमारी खुलती है।", "अंदर रंग, ब्रश और चमकी है।", "देखो, रंगों के पीछे कौन बैठा है!"] },
    rollo: { name: "पर्दा", gender: "m", sentences: ["पर्दा नीचे आता है। अब सोने का समय है।", "और फिर ऊपर। गुड मॉर्निंग!"] },
    gummistiefel: { name: "गमबूट", gender: "m", plural: true, sentences: ["छप, छप! गमबूट धम-धम करते हैं।", "गमबूट पहनकर पोखर में चलते हैं।"] },
    winkekinder: { name: "बच्चे", gender: "m", plural: true, sentences: ["टाटा, पापा! बच्चे हाथ हिलाते हैं।", "दोपहर में मिलते हैं!"] },
    schlafkind: { name: "सोता बच्चा", gender: "m", sentences: ["श्श्श! बच्चा सो रहा है।", "वो एक तारे का सपना देख रहा है।"] },
    kisten: { name: "डिब्बे", gender: "m", plural: true, sentences: ["डिब्बे खुलते हैं।", "अंदर एक गाड़ी, एक बत्तख और एक गेंद है।"] },
    puppenwagen: { name: "गुड़िया की गाड़ी", gender: "f", sentences: ["गुड़िया अपनी गाड़ी में झूलती है।", "हेलो, गुड़िया! वो आँखें खोलती है।"] },
    trommel: { name: "ढोल", gender: "m", sentences: ["ढम, ढम! ढोल ज़ोर से बजता है।", "चलो, ढोल पर एक गाना बजाएँ।"] },
    spieluhr: { name: "संगीत डिब्बा", gender: "m", sentences: ["संगीत डिब्बा लोरी बजाता है।", "छोटा चाँद घूमता है।"] },
    erzieherin: {
      name: "टीचर दीदी",
      gender: "f",
      sentences: ["टीचर दीदी कहानी पढ़कर सुनाती है।", "एक बार की बात है, एक छोटी सी बत्तख थी।", "देखो, अगले पन्ने पर एक मेंढक है!"],
    },
    junge: { name: "लड़का", gender: "m", sentences: ["लड़का अपने टेडी को गले लगाता है।", "टेडी भी सुनता है।"] },
    baukind: { name: "ब्लॉक वाला बच्चा", gender: "m", sentences: ["खट, खट! बच्चा ब्लॉक से बनाता है।", "ऊपर, और ऊपर!"] },
    maedchen: { name: "लड़की", gender: "f", sentences: ["लड़की ताली बजाती है।", "कहानी मज़ेदार है!"] },
    aufwachkind: { name: "थका बच्चा", gender: "m", sentences: ["आ-आ-ह! बच्चा जाग गया है।", "वो लंबी अंगड़ाई लेता है।"] },
    turm: { name: "मीनार", gender: "f", sentences: ["मीनार हिलती है। वूह!", "मीनार बहुत ऊँची है।"] },
    nudelkind: { name: "नूडल्स वाला बच्चा", gender: "m", sentences: ["चप! बच्चा नूडल्स खाता है।", "सुड़प! नूडल ख़त्म।"] },
    becherkind: { name: "गिलास वाला बच्चा", gender: "m", sentences: ["ब्लब, ब्लब! बच्चा जूस पीता है।", "स्ट्रॉ से वो बुलबुले बनाता है।"] },
    kipplaster: { name: "डंपर", gender: "m", sentences: ["घर्र, घर्र! डंपर चलता है।", "डंपर ब्लॉक उलट देता है।"] },
    bilderbuch: { name: "किताब", gender: "f", sentences: ["किताब खुलती है। टर्र! एक मेंढक!", "मेंढक किताब से बाहर कूदता है।"] },
    kuscheltier: { name: "खिलौना खरगोश", gender: "m", sentences: ["खिलौना खरगोश उछलता है।", "वो बहुत नरम और मुलायम है।"] },
    tisch: { name: "मेज़", gender: "f", sentences: ["खड़-खड़! मेज़ हिलती है।", "मेज़ पर खाना मिलता है।"] },
    topf: { name: "पतीला", gender: "m", sentences: ["उम्म, सूप की ख़ुशबू!", "ढक्कन उछलता है। एक गाजर बाहर कूदती है।"] },
    pudding: { name: "जेली", gender: "f", sentences: ["हिल, हिल! जेली हिलती है।", "ऊपर एक चेरी है।"] },
    kanne: { name: "जग", gender: "m", sentences: ["गट, गट! गिलास में पानी।", "अब गिलास भर गया।"] },
    xylophon: { name: "ज़ाइलोफ़ोन", gender: "m", sentences: ["टिंग, टांग, टोंग! ज़ाइलोफ़ोन बजता है।", "हर सुर का एक रंग है।"] },
    ball: { name: "गेंद", gender: "f", sentences: ["बोइंग, बोइंग! गेंद उछलती है।", "गेंद रंग-बिरंगी है।"] },
    spielzeugkiste: {
      name: "खिलौनों का बक्सा",
      gender: "m",
      sentences: ["बक्सा खुलता है। बोइंग! एक जोकर!", "जोकर ऊपर उछलता है और हाथ हिलाता है।"],
    },
    hausschuhe: { name: "चप्पलें", gender: "f", plural: true, sentences: ["टिप, टैप! चप्पलें उछलती हैं।", "प्ले स्कूल में हम चप्पलें पहनते हैं।"] },
  },
  chains: [
    ["पापा भी हाथ हिलाते हैं: टाटा!", "और चिड़िया गाती है: चीं, चीं!"],
    ["वूह, मीनार हिलती है! बच्चा बनाता रहता है।", "डंपर नए ब्लॉक लाता है।"],
    ["बच्चा लोरी सुनकर सपने देखता है।", "और खिलौना खरगोश दुबक जाता है।"],
  ],
};
