// Hindi language pack (hi-IN): the ten vowels and 33 consonants of the Hindi alphabet that the keys type
// (InScript places, src/lib/devanagariKeys.ts; no ऋ, अं, अः or the joined letters क्ष त्र ज्ञ, which have no
// key of their own). Each letter is named as itself („क“), and „क से कबूतर“ is how Hindi alphabet charts
// say it. ङ, ञ, ण and ष start no word a toddler knows, so their words have them inside (हिरण), as Russian Ы.
// Devanagari has one form per letter, so the games show no small letters. Nouns are counted with their own
// plural (केला → केले); "एक" is the same for every noun.

import { devanagariLetterOf, HINDI_KEYBOARD_ROWS, sameDevanagariKey } from "@/lib/devanagariKeys";
import { de } from "./de";
import { relabel } from "./translate";
import type { Countable, LanguagePack, LetterEntry, ThemeId, WordEntry } from "./types";

const w = (word: string, emoji: string, image?: string): WordEntry => ({ word, emoji, image });
const themed =
  (theme: ThemeId) =>
  (word: string, emoji: string, image?: string): WordEntry => ({ word, emoji, image, theme });
const janwar = themed("animals");
const gaadi = themed("vehicles");
const khana = themed("food");
const sharir = themed("body");
const kapde = themed("clothes");
const parivar = themed("family");
const sangeet = themed("music");
const prakriti = themed("nature");
const tyohar = themed("holidays");

/** A Hindi letter is named as itself, „क“, and has no small form. */
const letter = (upper: string, words: WordEntry[], inWord?: true): LetterEntry => ({ upper, lower: upper, spoken: upper, words, inWord });

// Vowels, then the consonants in the order of the alphabet chart (क ख ग घ ङ …).
// A word stands under one letter only, so the words game doesn't bring it twice.
const letters: LetterEntry[] = [
  letter("अ", [khana("अंगूर", "🍇"), khana("अनानास", "🍍"), khana("अंडा", "🥚")]),
  letter("आ", [khana("आम", "🥭"), khana("आलू", "🥔"), sharir("आँख", "👁️"), khana("आइसक्रीम", "🍦"), prakriti("आग", "🔥")]),
  letter("इ", [prakriti("इंद्रधनुष", "🌈"), gaadi("इंजन", "🚂")]),
  letter("ई", [w("ईंट", "🧱"), tyohar("ईद", "🌙")]),
  letter("उ", [janwar("उल्लू", "🦉"), sharir("उँगली", "☝️")]),
  letter("ऊ", [janwar("ऊँट", "🐫"), w("ऊन", "🧶")]),
  letter("ए", [gaadi("एंबुलेंस", "🚑")]),
  letter("ऐ", [w("ऐनक", "👓")]),
  letter("ओ", [prakriti("ओस", "💧")]),
  letter("औ", [parivar("औरत", "👩")]),
  letter("क", [
    janwar("कबूतर", "🕊️"),
    khana("केला", "🍌"),
    janwar("कुत्ता", "🐶"),
    prakriti("कमल", "🪷"),
    w("किताब", "📖"),
    gaadi("कार", "🚗"),
    janwar("कछुआ", "🐢"),
    sharir("कान", "👂"),
    kapde("कमीज़", "👕"),
  ]),
  letter("ख", [janwar("खरगोश", "🐰"), w("खिलौना", "🧸"), khana("खीरा", "🥒"), w("खिड़की", "🪟")]),
  letter("ग", [
    janwar("गाय", "🐮"),
    tyohar("गुब्बारा", "🎈"),
    khana("गाजर", "🥕"),
    w("गेंद", "⚽"),
    janwar("गधा", "🫏"),
    sangeet("गिटार", "🎸"),
    prakriti("गुलाब", "🌹"),
  ]),
  letter("घ", [w("घर", "🏠"), w("घड़ी", "⏰"), janwar("घोड़ा", "🐴"), sangeet("घंटी", "🔔")]),
  letter("ङ", [w("पङ्खा", "🪭"), w("शङ्ख", "🐚")], true),
  letter("च", [janwar("चिड़िया", "🐦"), w("चम्मच", "🥄"), prakriti("चाँद", "🌙"), janwar("चूहा", "🐭"), khana("चॉकलेट", "🍫"), khana("चाय", "☕")]),
  letter("छ", [w("छाता", "☂️"), janwar("छिपकली", "🦎"), w("छल्ला", "💍")]),
  letter("ज", [gaadi("जहाज़", "🚢"), kapde("जूता", "👟"), janwar("जिराफ़", "🦒"), khana("जामुन", "🫐"), kapde("जुराब", "🧦")]),
  letter("झ", [w("झंडा", "🚩"), w("झूला", "🛝"), janwar("झींगा", "🦐")]),
  letter("ञ", [janwar("पञ्जा", "🐾")], true),
  letter("ट", [khana("टमाटर", "🍅"), kapde("टोपी", "🧢"), gaadi("ट्रक", "🚚"), w("टीवी", "📺")]),
  letter("ठ", [gaadi("ठेला", "🛒")]),
  letter("ड", [sangeet("डमरू", "🥁"), w("डिब्बा", "📦"), janwar("डायनासोर", "🦕")]),
  letter("ढ", [sangeet("ढोल", "🪘")]),
  letter("ण", [janwar("हिरण", "🦌"), w("बाण", "🏹")], true),
  letter("त", [janwar("तितली", "🦋"), janwar("तोता", "🦜"), khana("तरबूज़", "🍉"), prakriti("तारा", "⭐"), w("ताला", "🔒")]),
  letter("थ", [w("थाली", "🍽️"), w("थैला", "👜")]),
  letter("द", [
    khana("दूध", "🥛"),
    w("दरवाज़ा", "🚪"),
    sharir("दाँत", "🦷"),
    parivar("दादी", "👵"),
    parivar("दादा", "👴"),
    tyohar("दीया", "🪔"),
    sharir("दिल", "❤️"),
  ]),
  letter("ध", [prakriti("धूप", "☀️"), w("धागा", "🧵")]),
  letter("न", [sharir("नाक", "👃"), gaadi("नाव", "⛵"), khana("नारियल", "🥥"), parivar("नानी", "👵"), khana("नींबू", "🍋"), w("नल", "🚰")]),
  letter("प", [
    tyohar("पतंग", "🪁"),
    prakriti("पानी", "💧"),
    prakriti("पेड़", "🌳"),
    sharir("पैर", "🦶"),
    parivar("पापा", "👨"),
    w("पेंसिल", "✏️"),
    prakriti("पत्ता", "🍃"),
    khana("पिज़्ज़ा", "🍕"),
  ]),
  letter("फ", [prakriti("फूल", "🌸"), w("फ़ोन", "📱"), w("फुटबॉल", "⚽")]),
  letter("ब", [
    janwar("बंदर", "🐒"),
    gaadi("बस", "🚌"),
    janwar("बत्तख", "🦆"),
    janwar("बकरी", "🐐"),
    janwar("बिल्ली", "🐱"),
    prakriti("बादल", "☁️"),
    parivar("बच्चा", "👶"),
    prakriti("बर्फ़", "❄️"),
    sangeet("बाँसुरी", "🪈"),
  ]),
  letter("भ", [janwar("भालू", "🐻"), parivar("भैया", "👦"), janwar("भेड़", "🐑")]),
  letter("म", [
    janwar("मछली", "🐟"),
    janwar("मोर", "🦚"),
    janwar("मकड़ी", "🕷️"),
    parivar("मम्मी", "👩"),
    janwar("मुर्गा", "🐓"),
    khana("मटर", "🫛"),
    tyohar("मोमबत्ती", "🕯️"),
    khana("मिठाई", "🍬"),
  ]),
  letter("य", [gaadi("यान", "🚀"), w("योग", "🧘")]),
  letter("र", [gaadi("रेलगाड़ी", "🚂"), khana("रोटी", "🫓"), w("रंग", "🎨"), w("रस्सी", "🪢"), w("रानी", "👸")]),
  letter("ल", [janwar("लोमड़ी", "🦊"), parivar("लड़का", "👦"), parivar("लड़की", "👧"), tyohar("लालटेन", "🏮")]),
  letter("व", [sangeet("वायलिन", "🎻"), prakriti("वर्षा", "🌧️")]),
  letter("श", [janwar("शेर", "🦁"), khana("शहद", "🍯"), w("शीशा", "🪞")]),
  letter("ष", [w("धनुष", "🏹")], true),
  letter("स", [
    khana("सेब", "🍎"),
    janwar("साँप", "🐍"),
    prakriti("सूरज", "☀️"),
    gaadi("साइकिल", "🚲"),
    janwar("सूअर", "🐷"),
    khana("संतरा", "🍊"),
    prakriti("समुद्र", "🌊"),
  ]),
  letter("ह", [janwar("हाथी", "🐘"), sharir("हाथ", "✋"), gaadi("हेलीकॉप्टर", "🚁"), janwar("हंस", "🦢"), gaadi("हवाई जहाज़", "✈️")]),
];

const thing = (emoji: string, singular: string, plural: string, theme?: ThemeId): Countable => ({ emoji, singular, plural, theme });

const countables: Countable[] = [
  thing("🦆", "बत्तख", "बत्तखें", "animals"),
  thing("🐟", "मछली", "मछलियाँ", "animals"),
  thing("🐝", "मधुमक्खी", "मधुमक्खियाँ", "animals"),
  thing("🐸", "मेंढक", "मेंढक", "animals"),
  thing("🐥", "चूज़ा", "चूज़े", "animals"),
  thing("🚗", "कार", "कारें", "vehicles"),
  thing("🚌", "बस", "बसें", "vehicles"),
  thing("🚜", "ट्रैक्टर", "ट्रैक्टर", "vehicles"),
  thing("🚲", "साइकिल", "साइकिलें", "vehicles"),
  thing("✈️", "हवाई जहाज़", "हवाई जहाज़", "vehicles"),
  thing("🍎", "सेब", "सेब", "food"),
  thing("🍌", "केला", "केले", "food"),
  thing("🥕", "गाजर", "गाजरें", "food"),
  thing("🍪", "बिस्कुट", "बिस्कुट", "food"),
  thing("🦷", "दाँत", "दाँत", "body"),
  thing("👂", "कान", "कान", "body"),
  thing("🦶", "पैर", "पैर", "body"),
  thing("🧦", "मोज़ा", "मोज़े", "clothes"),
  thing("🧢", "टोपी", "टोपियाँ", "clothes"),
  thing("👕", "कमीज़", "कमीज़ें", "clothes"),
  thing("🧤", "दस्ताना", "दस्ताने", "clothes"),
  thing("👶", "बच्चा", "बच्चे", "family"),
  thing("🎸", "गिटार", "गिटार", "music"),
  thing("🔔", "घंटी", "घंटियाँ", "music"),
  thing("🥁", "ढोलक", "ढोलक", "music"),
  thing("🌳", "पेड़", "पेड़", "nature"),
  thing("🌼", "फूल", "फूल", "nature"),
  thing("🍄", "मशरूम", "मशरूम", "nature"),
  thing("🎈", "गुब्बारा", "गुब्बारे", "holidays"),
  thing("🎁", "तोहफ़ा", "तोहफ़े", "holidays"),
  thing("🕯️", "मोमबत्ती", "मोमबत्तियाँ", "holidays"),
  thing("🪔", "दीया", "दीये", "holidays"),
  thing("⭐", "तारा", "तारे"),
];

const numberWords = ["शून्य", "एक", "दो", "तीन", "चार", "पाँच", "छह", "सात", "आठ", "नौ"];

export const hi: LanguagePack = {
  speechLang: "hi-IN",
  themes: [
    { id: "animals", label: "जानवर", emoji: "🐾" },
    { id: "vehicles", label: "गाड़ियाँ", emoji: "🚗" },
    { id: "food", label: "खाना", emoji: "🍎" },
    { id: "body", label: "शरीर", emoji: "🖐️" },
    { id: "clothes", label: "कपड़े", emoji: "👕" },
    { id: "family", label: "परिवार", emoji: "👪" },
    { id: "music", label: "संगीत", emoji: "🎵" },
    { id: "nature", label: "प्रकृति", emoji: "🌳" },
    { id: "holidays", label: "त्योहार", emoji: "🎄" },
  ],
  letters,
  numberWords,
  countables,
  zero: { emoji: "🪹", sentence: "घोंसला खाली है!" },
  // "क से कबूतर!", and for a letter inside its word "ण – हिरण में!"
  letterSentence: (l, word) => (l.inWord ? `${l.spoken} – ${word.word} में!` : `${l.spoken} से ${word.word}!`),
  findPrompt: (l) => `${l.spoken} कहाँ है?`,
  // The InScript keyboard as printed, with the signs on Z, X and full stop that type no letter here.
  keyboardRows: ["1234567890", `${HINDI_KEYBOARD_ROWS[0]}ञ`, HINDI_KEYBOARD_ROWS[1], "ॆंमनवलसष।य"],
  letterOfKey: devanagariLetterOf,
  sameKey: sameDevanagariKey,
  exampleLetter: "क",
  countSentence: (n, thing) => `${numberWords[n]} ${n === 1 ? thing.singular : thing.plural}!`,
  praise: ["शाबाश!", "बहुत बढ़िया!", "वाह!", "कमाल है!", "हुर्रे!"],
  firstLetterPrompt: (word) => `${word.word}! ${word.word} किस अक्षर से शुरू होता है?`,
  colors: relabel(de.colors, {
    "🔴": "लाल",
    "🔵": "नीला",
    "🟡": "पीला",
    "🟢": "हरा",
    "🟣": "बैंगनी",
    "🩷": "गुलाबी",
    "🟠": "नारंगी",
  }),
  // Only doing words of one word; sleeping, waving and clapping need two (सो जाओ, हाथ हिलाओ, ताली बजाओ).
  actions: relabel(de.actions, {
    "🐸": "कूदो",
    "🏃": "दौड़ो",
    "💃": "नाचो",
    "🐱": "घूमो",
    "🐦": "उड़ो",
    "🐟": "तैरो",
  }),
  joinIn: (word) => `मेरे साथ ${word.word}!`,
  whistle: "छुक-छुक!",
};
