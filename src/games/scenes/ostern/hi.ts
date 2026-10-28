import type { SceneTranslation } from "../types";

// The Easter garden in Hindi: the title, every item's name and sentences and the chain sentences.
// Easter keeps its English name „ईस्टर“; the coloured eggs are named by their colour first (लाल अंडा),
// the dandelion clock is the „फूँक वाला फूल“ and the watering can the „झारी“.

/** „Ostern“ in Hindi. */
export const HI: SceneTranslation = {
  title: "ईस्टर",
  description: "ईस्टर खरगोश, चूज़े और छिपे हुए अंडे।",
  items: {
    sonne: { name: "सूरज", gender: "m", sentences: ["सूरज चमकता है!", "सूरज मुस्कुराता है।"] },
    wolke: { name: "बादल", gender: "m", sentences: ["बादल से बारिश होती है। छप-छप!", "बादल सफ़ेद और नरम है।"] },
    gartentor: { name: "गेट", gender: "m", sentences: ["चीं! गेट खुलता है।", "बगीचे में कौन आ रहा है?", "गेट पर ईस्टर की माला टँगी है।"] },
    mutterschaf: { name: "भेड़", gender: "f", sentences: ["मैं! भेड़ अपने मेमने को बुलाती है।", "भेड़ का ऊन नरम है।"] },
    laemmchen: { name: "मेमना", gender: "m", sentences: ["मेमना ख़ुशी से उछलता है!", "टुन, टुन, बजती है घंटी।", "मेमना अभी छोटा है।"] },
    nistkasten: { name: "लकड़ी का घोंसला", gender: "m", sentences: ["लकड़ी के घोंसले में कौन रहता है? छोटी चिड़िया!", "ची-ची-बी! चिड़िया गाती है।"] },
    kirschbaum: {
      name: "चेरी का पेड़",
      gender: "m",
      sentences: ["चेरी का पेड़ गुलाबी फूलों से खिलता है।", "वूह! फूल हवा में उड़ते हैं।", "बसंत में पेड़ों पर फूल खिलते हैं।"],
    },
    amselnest: { name: "घोंसला", gender: "m", sentences: ["चीं, चीं! छोटी चिड़ियों को भूख लगी है।", "चिड़िया मम्मी एक कीड़ा लाती है।"] },
    gartenhaus: { name: "कोठरी", gender: "f", sentences: ["कोठरी का दरवाज़ा खुलता है।", "अंदर कौन है?", "कोठरी में बगीचे का सामान रहता है।"] },
    osterstrauch: {
      name: "ईस्टर का पेड़",
      gender: "m",
      sentences: ["ईस्टर के पेड़ पर रंग-बिरंगे अंडे लटके हैं।", "अंडे इधर-उधर झूलते हैं।", "तुम्हें कितने अंडे दिखते हैं?"],
    },
    schubkarre: { name: "ठेला", gender: "m", sentences: ["ठेले में फूल हैं।", "ठेला चल पड़ता है!"] },
    vogelbad: { name: "पानी का कटोरा", gender: "m", sentences: ["गौरैया नहाती है। छप, छप!", "कटोरे में चिड़ियों के लिए पानी है।"] },
    henne: { name: "मुर्गी", gender: "f", sentences: ["कुड़, कुड़! मुर्गी ने अंडा दिया है।", "मुर्गी घोंसले में बैठी है।"] },
    maltisch: { name: "रंगों की मेज़", gender: "f", sentences: ["यहाँ अंडों को रंगते हैं।", "लाल, पीला और नीला। अंडा रंग-बिरंगा हो जाता है!"] },
    schokohase: {
      name: "चॉकलेट खरगोश",
      gender: "m",
      sentences: ["चॉकलेट खरगोश सुनहरा चमकता है।", "टुन! चॉकलेट खरगोश के पास एक घंटी है।", "उम्म, चॉकलेट!"],
    },
    forsythie: { name: "पीली झाड़ी", gender: "f", sentences: ["झाड़ी पीली-पीली खिलती है।", "सरसर, करती है झाड़ी।"] },
    gruenesei: { name: "हरा अंडा", gender: "m", sentences: ["वहाँ, झाड़ी के नीचे! एक हरा अंडा!", "हरा अंडा लुढ़कता है।"] },
    hohlerbaum: {
      name: "पुराना पेड़",
      gender: "m",
      sentences: ["ठक, ठक! कठफोड़वा पेड़ पर ठोकता है।", "पेड़ में एक छेद है। वहाँ से कौन झाँक रहा है?", "टहनियों पर रोएँदार कलियाँ हैं।"],
    },
    gelbesei: { name: "पीला अंडा", gender: "m", sentences: ["पेड़ में छिपा: एक पीला अंडा!", "पीला अंडा हिलता है।"] },
    eikueken: { name: "चूज़ा", gender: "m", sentences: ["कड़क! चूज़ा अंडे से निकलता है।", "चीं, चीं! हेलो, छोटे चूज़े!"] },
    blauesei: { name: "नीला अंडा", gender: "m", sentences: ["गमले के पीछे! एक नीला अंडा!", "नीले अंडे पर सफ़ेद बिंदियाँ हैं।"] },
    blumentopf: { name: "गमला", gender: "m", sentences: ["गमले में फूल खिले हैं।", "गमला हिलता है।"] },
    tulpen: { name: "ट्यूलिप", gender: "m", plural: true, sentences: ["ट्यूलिप खिलते हैं।", "लाल, पीले और बैंगनी ट्यूलिप!"] },
    hummel: { name: "भौंरा", gender: "m", sentences: ["भिन, भिन! भौंरा फूलों की ओर उड़ता है।", "भौंरा मोटा और रोएँदार है।"] },
    bollerwagen: { name: "हाथगाड़ी", gender: "f", sentences: ["हाथगाड़ी चलती है।", "हाथगाड़ी में अंडे और फूल हैं।"] },
    osterglocken: { name: "डैफ़ोडिल", gender: "m", plural: true, sentences: ["टन, टन! डैफ़ोडिल घंटी बजाते हैं।", "डैफ़ोडिल पीले हैं।"] },
    zitronenfalter: { name: "तितली", gender: "f", sentences: ["पीली तितली फड़फड़ाती है।", "ये तितली नींबू जैसी पीली है।"] },
    regenwurm: { name: "केंचुआ", gender: "m", sentences: ["हेलो, केंचुए!", "केंचुआ मिट्टी में रहता है।"] },
    osterhase: {
      name: "ईस्टर खरगोश",
      gender: "m",
      sentences: ["हेलो! मैं ईस्टर खरगोश हूँ।", "हॉप, हॉप! ईस्टर खरगोश अंडे लाता है।", "हैप्पी ईस्टर!"],
    },
    gartenzwerg: { name: "बौना", gender: "m", sentences: ["बौना थका हुआ है। आ-आ-ह!", "बौने की टोपी लाल है।"] },
    haeschen: { name: "छोटा खरगोश", gender: "m", sentences: ["चप, चप! छोटा खरगोश गाजर खाता है।", "छोटा खरगोश अपनी नाक हिलाता है।"] },
    korbkind: { name: "लड़की", gender: "f", sentences: ["हुर्रे! मुझे एक अंडा मिला!", "लड़की ईस्टर के अंडे ढूँढती है।"] },
    eierlauf: { name: "लड़का", gender: "m", sentences: ["अंडा दौड़! चम्मच पर अंडा हिलता है।", "अरे! अंडा बस गिरने वाला है।"] },
    osternest: { name: "ईस्टर की टोकरी", gender: "f", sentences: ["ईस्टर की टोकरी अंडों से भरी है।", "टोकरी में एक चॉकलेट अंडा भी है।"] },
    giesskanne: { name: "झारी", gender: "f", sentences: ["झारी फूलों को पानी देती है।", "छप, छप! ट्यूलिप के लिए पानी।"] },
    osterei: { name: "लाल अंडा", gender: "m", sentences: ["घास में एक लाल अंडा है!", "अंडे के पीछे से कौन झाँक रहा है?"] },
    glueckskaefer: { name: "लेडीबग", gender: "f", sentences: ["लेडीबग उड़ चलती है!", "लेडीबग लाल है, काले धब्बों वाली।"] },
    pusteblume: { name: "फूँक वाला फूल", gender: "m", sentences: ["फूँक मारो! बीज उड़ जाते हैं।", "वूऊ! जैसे छोटे-छोटे पैराशूट।"] },
  },
  chains: [
    ["ट्यूलिप पानी पीते हैं और खिल जाते हैं।", "गीला! केंचुआ बाहर झाँकता है।"],
    ["कड़क! चूज़ा अंडे से निकलता है।", "ईस्टर खरगोश ख़ुश होकर उछलता है।"],
    ["मेमना मम्मी की आवाज़ सुनकर उछलता है।", "तितली उड़ चलती है।"],
  ],
};
