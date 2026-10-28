import type { Localized } from "@/lib/language";
import type { SceneTrigger } from "./settings";
import type { SceneItem, SceneTrait } from "./types";

// Every sentence the engine builds itself, in each language: prompts, praise,
// the party, find and trait questions, vehicles driving between pictures. The
// items' own names and sentences come from the scene (localize.ts). A language
// missing here is German; add a new German line in every language next to it.

/** "der Bagger" → "Der Bagger", "экскаватор" → "Экскаватор". */
export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** How a trait question is asked and a right answer praised. */
export interface TraitWords {
  question: string;
  /** "Der Bus ist rot!" */
  praise: (item: SceneItem) => string;
  /** Colours: said for an item with only a part in that colour ("Da ist Rot!"); without it, `praise`. */
  part?: string;
  emoji: string;
}

/** How a picture is named in sentences: "fährt in die Stadt", "kommt aus der Stadt", "ist wieder in der Stadt". */
export interface PlaceWords {
  to: string;
  from: string;
  at: string;
}

/** The engine's words in one language. */
export interface ScenePhrases {
  /** Shown until the first tap, by trigger. */
  prompts: Record<SceneTrigger, string>;
  /** The same in colour mode. */
  colourPrompts: Record<SceneTrigger, string>;
  /** Said before the praise of a right answer, one at random. */
  praise: string[];
  /** The party when everything is coloured / discovered. */
  allColoured: string;
  allFound: string;
  /** Bedtime picture: all are asleep. */
  goodNight: string;
  /** A surprise peeks out of a hideout: "Guck-guck! Da ist ja eine Katze!" */
  peekaboo: (found: string) => string;
  /** Find mode: "Wo ist der Bagger?" */
  whereIs: (item: SceneItem) => string;
  /** Find mode, right answer: "Das ist der Bagger!" */
  hereIs: (item: SceneItem) => string;
  /** A wrong tap while something is looked for: what it is, then the question again. */
  thatIs: (item: SceneItem, question: string) => string;
  /** Questions mode, by trait. */
  traits: Record<SceneTrait, TraitWords>;
  /** The pictures vehicles drive between, by scene id (see roads.ts). */
  places: Record<string, PlaceWords>;
  /** A vehicle comes back to its own picture. */
  backHome: (item: SceneItem, place: PlaceWords) => string;
  /** A vehicle visits from another picture. */
  comesFrom: (item: SceneItem, place: PlaceWords) => string;
  /** A vehicle drives off into another picture. */
  drivesTo: (item: SceneItem, place: PlaceWords) => string;
  /** Label of the sign that follows a vehicle. */
  follow: (item: SceneItem) => string;
  /** "2 von 3", for the progress dots and the goal counter. */
  of: (count: number, total: number) => string;
  /** Label of the stars: "4 gefunden". */
  foundCount: (count: number) => string;
  /** Label of the goal counter: "5 von 20 entdeckt". */
  discoveredCount: (count: number, total: number) => string;
  /** Label of the space bar on screen. */
  spaceBar: string;
  /** Shown on a phone held upright. */
  rotate: string;
}

const de: ScenePhrases = {
  prompts: { tap: "Tipp etwas an! 👆", hover: "Zeig auf etwas! 👆", keys: "Drück eine Taste! ⌨️" },
  colourPrompts: {
    tap: "Tipp etwas an – es wird bunt! 🖍️",
    hover: "Zeig auf etwas – es wird bunt! 🖍️",
    keys: "Drück eine Taste – es wird bunt! 🖍️",
  },
  praise: ["Super!", "Toll!", "Prima!", "Ja, genau!", "Richtig!"],
  allColoured: "Hurra! Das ganze Bild ist bunt!",
  allFound: "Hurra! Du hast alles entdeckt!",
  goodNight: "Gute Nacht! Alle schlafen jetzt.",
  peekaboo: (found) => `Guck-guck! ${found}`,
  whereIs: (item) => `Wo ${item.plural ? "sind" : "ist"} ${item.name}?`,
  hereIs: (item) => `Das ${item.plural ? "sind" : "ist"} ${item.name}!`,
  thatIs: (item, question) => `Das ${item.plural ? "sind" : "ist"} ${item.name}. ${question}`,
  traits: {
    red: deTrait("Was ist rot?", "ist rot", "sind rot", "Da ist Rot!", "🔴"),
    yellow: deTrait("Was ist gelb?", "ist gelb", "sind gelb", "Da ist Gelb!", "🟡"),
    blue: deTrait("Was ist blau?", "ist blau", "sind blau", "Da ist Blau!", "🔵"),
    green: deTrait("Was ist grün?", "ist grün", "sind grün", "Da ist Grün!", "🟢"),
    flies: deTrait("Wer kann fliegen?", "kann fliegen", "können fliegen", undefined, "🪽"),
    big: deTrait("Was ist ganz groß?", "ist ganz groß", "sind ganz groß", undefined, "🐘"),
    small: deTrait("Was ist ganz klein?", "ist ganz klein", "sind ganz klein", undefined, "🐜"),
    animal: deTrait("Wo ist ein Tier?", "ist ein Tier", "sind Tiere", undefined, "🐾"),
    wheels: deTrait("Was hat Räder?", "hat Räder", "haben Räder", undefined, "🛞"),
  },
  places: {
    stadt: { to: "in die Stadt", from: "aus der Stadt", at: "in der Stadt" },
    feuerwache: { to: "zur Feuerwache", from: "von der Feuerwache", at: "an der Feuerwache" },
    bauernhof: { to: "auf den Bauernhof", from: "vom Bauernhof", at: "auf dem Bauernhof" },
    wald: { to: "in den Wald", from: "aus dem Wald", at: "im Wald" },
    zoo: { to: "in den Zoo", from: "aus dem Zoo", at: "im Zoo" },
    baustelle: { to: "zur Baustelle", from: "von der Baustelle", at: "auf der Baustelle" },
  },
  backHome: (item, place) => `${capitalize(item.name)} ${item.plural ? "sind" : "ist"} wieder ${place.at}!`,
  comesFrom: (item, place) => `${capitalize(item.name)} ${item.plural ? "kommen" : "kommt"} ${place.from}!`,
  drivesTo: (item, place) => `Tschüss! ${capitalize(item.name)} ${item.plural ? "fahren" : "fährt"} ${place.to}.`,
  follow: (item) => `${capitalize(item.name)} hinterher`,
  of: (count, total) => `${count} von ${total}`,
  foundCount: (count) => `${count} gefunden`,
  discoveredCount: (count, total) => `${count} von ${total} entdeckt`,
  spaceBar: "Leertaste",
  rotate: "Quer halten – dann wird das Bild groß",
};

/** A German trait: the question, the answer after the name for one thing and for several, and for colours the praise of a part. */
function deTrait(question: string, answer: string, pluralAnswer: string, part: string | undefined, emoji: string): TraitWords {
  return { question, emoji, part, praise: (item) => `${capitalize(item.name)} ${item.plural ? pluralAnswer : answer}!` };
}

/** The word that agrees with the item's name: masculine, feminine, neuter or plural (a name without gender counts as masculine). */
const agree = (item: SceneItem, m: string, f: string, n: string, pl: string) => (item.plural ? pl : item.gender === "f" ? f : item.gender === "n" ? n : m);

/** A Russian colour or size trait: the question with the neuter adjective ("Что красное?"), the praise agreeing with the name. */
function ruAdjective(m: string, f: string, n: string, pl: string, emoji: string, very = false): TraitWords {
  const prefix = very ? "очень " : "";
  return { question: `Что ${prefix}${n}?`, emoji, praise: (item) => `${capitalize(item.name)} ${prefix}${agree(item, m, f, n, pl)}!` };
}

/** A Russian colour trait, praising a part in that colour by the colour's name ("Вот красный цвет!"). */
const ruColour = (m: string, f: string, n: string, pl: string, emoji: string): TraitWords => ({ ...ruAdjective(m, f, n, pl, emoji), part: `Вот ${m} цвет!` });

const ru: ScenePhrases = {
  prompts: { tap: "Нажми на что-нибудь! 👆", hover: "Покажи на что-нибудь! 👆", keys: "Нажми на клавишу! ⌨️" },
  colourPrompts: {
    tap: "Нажми на что-нибудь – и оно станет цветным! 🖍️",
    hover: "Покажи на что-нибудь – и оно станет цветным! 🖍️",
    keys: "Нажми на клавишу – и что-то станет цветным! 🖍️",
  },
  praise: ["Молодец!", "Здорово!", "Супер!", "Да, точно!", "Правильно!"],
  allColoured: "Ура! Вся картинка цветная!",
  allFound: "Ура! Всё-всё найдено!",
  goodNight: "Спокойной ночи! Все уже спят.",
  peekaboo: (found) => `Ку-ку! ${found}`,
  whereIs: (item) => `Где ${item.name}?`,
  hereIs: (item) => `Вот ${item.name}!`,
  thatIs: (item, question) => `Это ${item.name}. ${question}`,
  traits: {
    red: ruColour("красный", "красная", "красное", "красные", "🔴"),
    yellow: ruColour("жёлтый", "жёлтая", "жёлтое", "жёлтые", "🟡"),
    blue: ruColour("синий", "синяя", "синее", "синие", "🔵"),
    green: ruColour("зелёный", "зелёная", "зелёное", "зелёные", "🟢"),
    flies: { question: "Кто летает?", emoji: "🪽", praise: (item) => `${capitalize(item.name)} ${item.plural ? "летают" : "летает"}!` },
    big: ruAdjective("большой", "большая", "большое", "большие", "🐘", true),
    small: ruAdjective("маленький", "маленькая", "маленькое", "маленькие", "🐜", true),
    animal: { question: "Где животное?", emoji: "🐾", praise: (item) => `${capitalize(item.name)} – это ${item.plural ? "животные" : "животное"}!` },
    wheels: { question: "Что на колёсах?", emoji: "🛞", praise: (item) => `${capitalize(item.name)} на колёсах!` },
  },
  places: {
    stadt: { to: "в город", from: "из города", at: "в городе" },
    feuerwache: { to: "в пожарную часть", from: "из пожарной части", at: "в пожарной части" },
    bauernhof: { to: "на ферму", from: "с фермы", at: "на ферме" },
    wald: { to: "в лес", from: "из леса", at: "в лесу" },
    zoo: { to: "в зоопарк", from: "из зоопарка", at: "в зоопарке" },
    baustelle: { to: "на стройку", from: "со стройки", at: "на стройке" },
  },
  backHome: (item, place) => `${capitalize(item.name)} снова ${place.at}!`,
  comesFrom: (item, place) => `${capitalize(item.name)} ${item.plural ? "приезжают" : "приезжает"} ${place.from}!`,
  drivesTo: (item, place) => `Пока-пока! ${capitalize(item.name)} ${item.plural ? "едут" : "едет"} ${place.to}.`,
  follow: (item) => `Поехать за: ${item.name}`,
  of: (count, total) => `${count} из ${total}`,
  foundCount: (count) => `Найдено: ${count}`,
  discoveredCount: (count, total) => `Найдено ${count} из ${total}`,
  spaceBar: "Пробел",
  rotate: "Поверни телефон – и картинка станет большой",
};

// English names come without article and in lower case: the engine says "the" (a name with every word in
// capitals, "Santa Claus", is a proper name and gets none). Only `plural` matters, never a gender.

/** A proper name: every word starts with a capital ("Santa Claus", "Earth"; not "Christmas tree" or "T. rex"). */
const isProperName = (name: string) => /^\p{Lu}\S*(\s\p{Lu}\S*)*$/u.test(name);

/** The name with "the", as said inside a sentence: "the excavator", "the chicks", "the Christmas tree". */
const enThe = (item: SceneItem) => (isProperName(item.name) ? item.name : `the ${item.name}`);

/** An English trait: the question and the words after the name for one thing and for several ("is red" / "are red"). */
function enTrait(question: string, answer: string, pluralAnswer: string, part: string | undefined, emoji: string): TraitWords {
  return { question, emoji, part, praise: (item) => `${capitalize(enThe(item))} ${item.plural ? pluralAnswer : answer}!` };
}

const en: ScenePhrases = {
  prompts: { tap: "Tap something! 👆", hover: "Point at something! 👆", keys: "Press a key! ⌨️" },
  colourPrompts: {
    tap: "Tap something – it gets colorful! 🖍️",
    hover: "Point at something – it gets colorful! 🖍️",
    keys: "Press a key – something gets colorful! 🖍️",
  },
  praise: ["Super!", "Great!", "Well done!", "Yes, exactly!", "That's right!"],
  allColoured: "Hooray! The whole picture is colorful!",
  allFound: "Hooray! You found everything!",
  goodNight: "Good night! Everyone is asleep now.",
  peekaboo: (found) => `Peekaboo! ${found}`,
  whereIs: (item) => `Where ${item.plural ? "are" : "is"} ${enThe(item)}?`,
  hereIs: (item) => `Here ${item.plural ? "are" : "is"} ${enThe(item)}!`,
  thatIs: (item, question) => `${item.plural ? "Those are" : "That is"} ${enThe(item)}. ${question}`,
  traits: {
    red: enTrait("What is red?", "is red", "are red", "Look, there's red!", "🔴"),
    yellow: enTrait("What is yellow?", "is yellow", "are yellow", "Look, there's yellow!", "🟡"),
    blue: enTrait("What is blue?", "is blue", "are blue", "Look, there's blue!", "🔵"),
    green: enTrait("What is green?", "is green", "are green", "Look, there's green!", "🟢"),
    flies: enTrait("Who can fly?", "can fly", "can fly", undefined, "🪽"),
    big: enTrait("What is very big?", "is very big", "are very big", undefined, "🐘"),
    small: enTrait("What is very small?", "is very small", "are very small", undefined, "🐜"),
    animal: enTrait("Where is an animal?", "is an animal", "are animals", undefined, "🐾"),
    wheels: enTrait("What has wheels?", "has wheels", "have wheels", undefined, "🛞"),
  },
  places: {
    stadt: { to: "to the city", from: "from the city", at: "in the city" },
    feuerwache: { to: "to the fire station", from: "from the fire station", at: "at the fire station" },
    bauernhof: { to: "to the farm", from: "from the farm", at: "on the farm" },
    wald: { to: "to the forest", from: "from the forest", at: "in the forest" },
    zoo: { to: "to the zoo", from: "from the zoo", at: "at the zoo" },
    baustelle: { to: "to the construction site", from: "from the construction site", at: "at the construction site" },
  },
  backHome: (item, place) => `${capitalize(enThe(item))} ${item.plural ? "are" : "is"} back ${place.at}!`,
  comesFrom: (item, place) => `Here ${item.plural ? "come" : "comes"} ${enThe(item)} ${place.from}!`,
  drivesTo: (item, place) => `Bye-bye! ${capitalize(enThe(item))} ${item.plural ? "drive" : "drives"} ${place.to}.`,
  follow: (item) => `Follow ${enThe(item)}`,
  of: (count, total) => `${count} of ${total}`,
  foundCount: (count) => `${count} found`,
  discoveredCount: (count, total) => `${count} of ${total} discovered`,
  spaceBar: "Space bar",
  rotate: "Turn it sideways – the picture gets big",
};

// Chinese names are bare nouns (no measure word); Chinese has no articles, gender or plural endings,
// so every sentence is the same for every item.

/** A Chinese trait: the question and what follows the name. */
const zhTrait = (question: string, answer: string, part: string | undefined, emoji: string): TraitWords => ({
  question,
  emoji,
  part,
  praise: (item) => `${item.name}${answer}！`,
});

const zh: ScenePhrases = {
  prompts: { tap: "点一点！👆", hover: "用手指指一指！👆", keys: "按一个键！⌨️" },
  colourPrompts: {
    tap: "点一点，它就变成彩色的！🖍️",
    hover: "指一指，它就变成彩色的！🖍️",
    keys: "按一个键，就有东西变成彩色的！🖍️",
  },
  praise: ["真棒！", "太好了！", "好厉害！", "对，就是它！", "答对了！"],
  allColoured: "好耶！整幅画都变成彩色的了！",
  allFound: "好耶！你全都找到了！",
  goodNight: "晚安！大家都睡着了。",
  peekaboo: (found) => `哇！${found}`,
  whereIs: (item) => `${item.name}在哪里？`,
  hereIs: (item) => `${item.name}在这里！`,
  thatIs: (item, question) => `这是${item.name}。${question}`,
  traits: {
    red: zhTrait("什么是红色的？", "是红色的", "这里有红色！", "🔴"),
    yellow: zhTrait("什么是黄色的？", "是黄色的", "这里有黄色！", "🟡"),
    blue: zhTrait("什么是蓝色的？", "是蓝色的", "这里有蓝色！", "🔵"),
    green: zhTrait("什么是绿色的？", "是绿色的", "这里有绿色！", "🟢"),
    flies: zhTrait("谁会飞？", "会飞", undefined, "🪽"),
    big: zhTrait("什么很大很大？", "很大很大", undefined, "🐘"),
    small: zhTrait("什么很小很小？", "很小很小", undefined, "🐜"),
    animal: zhTrait("动物在哪里？", "是动物", undefined, "🐾"),
    wheels: zhTrait("什么有轮子？", "有轮子", undefined, "🛞"),
  },
  // The same word in all three: "开去城里了", "从城里来了", "回到城里了".
  places: {
    stadt: { to: "城里", from: "城里", at: "城里" },
    feuerwache: { to: "消防站", from: "消防站", at: "消防站" },
    bauernhof: { to: "农场", from: "农场", at: "农场" },
    wald: { to: "森林", from: "森林", at: "森林" },
    zoo: { to: "动物园", from: "动物园", at: "动物园" },
    baustelle: { to: "工地", from: "工地", at: "工地" },
  },
  backHome: (item, place) => `${item.name}回到${place.at}了！`,
  comesFrom: (item, place) => `${item.name}从${place.from}来了！`,
  drivesTo: (item, place) => `拜拜！${item.name}开去${place.to}了。`,
  follow: (item) => `跟着${item.name}走`,
  of: (count, total) => `${total}个里的${count}个`,
  foundCount: (count) => `找到了${count}个`,
  discoveredCount: (count, total) => `发现了${count}个，一共${total}个`,
  spaceBar: "空格键",
  rotate: "把手机横过来，画就变大了",
};

// Hindi names always have a `gender` (plurals too, marked `plural`): adjectives ending in -ा and verbs agree
// with it (पीला / पीली / पीले, उड़ सकता / सकती / सकते). The name always stays in the direct case: it never
// stands before a postposition (के, में, से), which would change "घोड़ा" into "घोड़े".

/** The Hindi word that agrees with the name: masculine, feminine, masculine plural, feminine plural. */
const hiAgree = (item: SceneItem, m: string, f: string, mPl: string, fPl: string) =>
  item.plural ? (item.gender === "f" ? fPl : mPl) : item.gender === "f" ? f : m;

/** "है" for one thing, "हैं" for several. */
const hiIs = (item: SceneItem) => (item.plural ? "हैं" : "है");

/** A Hindi colour or size trait ("पीला / पीली / पीले"), praising a part in that colour by the colour's name for colours. */
function hiAdjective(question: string, m: string, f: string, pl: string, part: string | undefined, emoji: string, very = false): TraitWords {
  const prefix = very ? "बहुत " : "";
  return { question, emoji, part, praise: (item) => `${item.name} ${prefix}${hiAgree(item, m, f, pl, f)} ${hiIs(item)}!` };
}

const hi: ScenePhrases = {
  prompts: { tap: "कुछ भी छुओ! 👆", hover: "किसी चीज़ की ओर इशारा करो! 👆", keys: "कोई भी बटन दबाओ! ⌨️" },
  colourPrompts: {
    tap: "कुछ भी छुओ – उसमें रंग भर जाएगा! 🖍️",
    hover: "किसी चीज़ की ओर इशारा करो – उसमें रंग भर जाएगा! 🖍️",
    keys: "कोई भी बटन दबाओ – कहीं रंग भर जाएगा! 🖍️",
  },
  praise: ["शाबाश!", "बहुत बढ़िया!", "वाह!", "हाँ, बिल्कुल!", "सही!"],
  allColoured: "हुर्रे! पूरी तस्वीर रंगीन हो गई!",
  allFound: "हुर्रे! तुमने सब कुछ खोज लिया!",
  goodNight: "शुभ रात्रि! अब सब सो रहे हैं।",
  peekaboo: (found) => `देखो! ${found}`,
  whereIs: (item) => `${item.name} कहाँ ${hiIs(item)}?`,
  hereIs: (item) => `${hiAgree(item, "यह रहा", "यह रही", "ये रहे", "ये रहीं")} ${item.name}!`,
  thatIs: (item, question) => `${item.plural ? "ये" : "यह"} ${item.name} ${hiIs(item)}। ${question}`,
  traits: {
    red: hiAdjective("लाल चीज़ कहाँ है?", "लाल", "लाल", "लाल", "यहाँ लाल रंग है!", "🔴"),
    yellow: hiAdjective("पीली चीज़ कहाँ है?", "पीला", "पीली", "पीले", "यहाँ पीला रंग है!", "🟡"),
    blue: hiAdjective("नीली चीज़ कहाँ है?", "नीला", "नीली", "नीले", "यहाँ नीला रंग है!", "🔵"),
    green: hiAdjective("हरी चीज़ कहाँ है?", "हरा", "हरी", "हरे", "यहाँ हरा रंग है!", "🟢"),
    flies: {
      question: "कौन उड़ सकता है?",
      emoji: "🪽",
      praise: (item) => `${item.name} उड़ ${hiAgree(item, "सकता", "सकती", "सकते", "सकती")} ${hiIs(item)}!`,
    },
    big: hiAdjective("बहुत बड़ी चीज़ कहाँ है?", "बड़ा", "बड़ी", "बड़े", undefined, "🐘", true),
    small: hiAdjective("बहुत छोटी चीज़ कहाँ है?", "छोटा", "छोटी", "छोटे", undefined, "🐜", true),
    animal: { question: "जानवर कहाँ है?", emoji: "🐾", praise: (item) => `${item.name} ${item.plural ? "जानवर हैं" : "एक जानवर है"}!` },
    wheels: {
      question: "पहियों पर क्या चलता है?",
      emoji: "🛞",
      praise: (item) => `${item.name} पहियों पर ${hiAgree(item, "चलता", "चलती", "चलते", "चलती")} ${hiIs(item)}!`,
    },
  },
  places: {
    stadt: { to: "शहर की ओर", from: "शहर से", at: "शहर में" },
    feuerwache: { to: "फ़ायर स्टेशन की ओर", from: "फ़ायर स्टेशन से", at: "फ़ायर स्टेशन पर" },
    bauernhof: { to: "खेत की ओर", from: "खेत से", at: "खेत पर" },
    wald: { to: "जंगल की ओर", from: "जंगल से", at: "जंगल में" },
    zoo: { to: "चिड़ियाघर की ओर", from: "चिड़ियाघर से", at: "चिड़ियाघर में" },
    baustelle: { to: "निर्माण स्थल की ओर", from: "निर्माण स्थल से", at: "निर्माण स्थल पर" },
  },
  backHome: (item, place) => `${item.name} फिर से ${place.at} ${hiIs(item)}!`,
  comesFrom: (item, place) => `${item.name} ${place.from} ${hiAgree(item, "आ रहा", "आ रही", "आ रहे", "आ रही")} ${hiIs(item)}!`,
  drivesTo: (item, place) => `टाटा! ${item.name} ${place.to} ${hiAgree(item, "जा रहा", "जा रही", "जा रहे", "जा रही")} ${hiIs(item)}।`,
  // "X के पीछे" would need the oblique case of the name, so the name comes last.
  follow: (item) => `पीछे चलो: ${item.name}`,
  of: (count, total) => `${total} में से ${count}`,
  foundCount: (count) => `${count} मिले`,
  discoveredCount: (count, total) => `${total} में से ${count} खोजे`,
  spaceBar: "स्पेस बार",
  rotate: "फ़ोन को आड़ा करो – तस्वीर बड़ी हो जाएगी",
};

// Spanish names come without article and always with a `gender` (plurals too, marked `plural`): the engine
// adds el / la / los / las (el for feminine nouns with a stressed a: el agua, el águila), and adjectives agree
// (rojo / roja / rojos / rojas). A name with every word in capitals ("Papá Noel") is a proper name and gets no article.

/** Feminine nouns beginning with a stressed "a" take "el" in the singular. */
const EL_FEMININE = /^(agua|águila|hacha|hada|ala|alma|arpa|ancla|área|aula|ave|hambre)(?=\s|$)/;

/** The Spanish word that agrees with the name: masculine, feminine, masculine plural, feminine plural. */
const esAgree = (item: SceneItem, m: string, f: string, mPl: string, fPl: string) =>
  item.plural ? (item.gender === "f" ? fPl : mPl) : item.gender === "f" ? f : m;

/** The name with its article: "el sol", "la grúa", "los pollitos", "el agua". */
function esThe(item: SceneItem) {
  if (isProperName(item.name)) return item.name;
  const article = esAgree(item, "el", EL_FEMININE.test(item.name) ? "el" : "la", "los", "las");
  return `${article} ${item.name}`;
}

/** "es" for one thing, "son" for several. */
const esIs = (item: SceneItem) => (item.plural ? "son" : "es");

/** A Spanish colour or size trait: the question with the masculine adjective, the praise agreeing with the name. */
function esAdjective(question: string, m: string, f: string, mPl: string, fPl: string, part: string | undefined, emoji: string, very = false): TraitWords {
  const prefix = very ? "muy " : "";
  return { question, emoji, part, praise: (item) => `¡${capitalize(esThe(item))} ${esIs(item)} ${prefix}${esAgree(item, m, f, mPl, fPl)}!` };
}

const es: ScenePhrases = {
  prompts: { tap: "¡Toca algo! 👆", hover: "¡Señala algo! 👆", keys: "¡Pulsa una tecla! ⌨️" },
  colourPrompts: {
    tap: "¡Toca algo y se llena de color! 🖍️",
    hover: "¡Señala algo y se llena de color! 🖍️",
    keys: "¡Pulsa una tecla y algo se llena de color! 🖍️",
  },
  praise: ["¡Súper!", "¡Genial!", "¡Muy bien!", "¡Sí, exacto!", "¡Correcto!"],
  allColoured: "¡Hurra! ¡Todo el dibujo tiene color!",
  allFound: "¡Hurra! ¡Lo encontraste todo!",
  goodNight: "¡Buenas noches! Ya todos duermen.",
  peekaboo: (found) => `¡Cucú! ${found}`,
  whereIs: (item) => `¿Dónde ${item.plural ? "están" : "está"} ${esThe(item)}?`,
  hereIs: (item) => `¡Aquí ${item.plural ? "están" : "está"} ${esThe(item)}!`,
  thatIs: (item, question) => `${capitalize(esIs(item))} ${esThe(item)}. ${question}`,
  traits: {
    red: esAdjective("¿Qué es rojo?", "rojo", "roja", "rojos", "rojas", "¡Ahí hay rojo!", "🔴"),
    yellow: esAdjective("¿Qué es amarillo?", "amarillo", "amarilla", "amarillos", "amarillas", "¡Ahí hay amarillo!", "🟡"),
    blue: esAdjective("¿Qué es azul?", "azul", "azul", "azules", "azules", "¡Ahí hay azul!", "🔵"),
    green: esAdjective("¿Qué es verde?", "verde", "verde", "verdes", "verdes", "¡Ahí hay verde!", "🟢"),
    flies: { question: "¿Quién puede volar?", emoji: "🪽", praise: (item) => `¡${capitalize(esThe(item))} ${item.plural ? "pueden" : "puede"} volar!` },
    big: esAdjective("¿Qué es muy grande?", "grande", "grande", "grandes", "grandes", undefined, "🐘", true),
    small: esAdjective("¿Qué es muy pequeño?", "pequeño", "pequeña", "pequeños", "pequeñas", undefined, "🐜", true),
    animal: {
      question: "¿Dónde hay un animal?",
      emoji: "🐾",
      praise: (item) => `¡${capitalize(esThe(item))} ${item.plural ? "son animales" : "es un animal"}!`,
    },
    wheels: { question: "¿Qué tiene ruedas?", emoji: "🛞", praise: (item) => `¡${capitalize(esThe(item))} ${item.plural ? "tienen" : "tiene"} ruedas!` },
  },
  places: {
    stadt: { to: "a la ciudad", from: "de la ciudad", at: "en la ciudad" },
    feuerwache: { to: "a la estación de bomberos", from: "de la estación de bomberos", at: "en la estación de bomberos" },
    bauernhof: { to: "a la granja", from: "de la granja", at: "en la granja" },
    wald: { to: "al bosque", from: "del bosque", at: "en el bosque" },
    zoo: { to: "al zoológico", from: "del zoológico", at: "en el zoológico" },
    baustelle: { to: "a la obra", from: "de la obra", at: "en la obra" },
  },
  backHome: (item, place) => `¡${capitalize(esThe(item))} ya ${item.plural ? "están" : "está"} de vuelta ${place.at}!`,
  comesFrom: (item, place) => `¡${capitalize(esThe(item))} ${item.plural ? "vienen" : "viene"} ${place.from}!`,
  drivesTo: (item, place) => `¡Adiós! ${capitalize(esThe(item))} ${item.plural ? "van" : "va"} ${place.to}.`,
  // "a el" is always said "al".
  follow: (item) => `Seguir ${`a ${esThe(item)}`.replace(/^a el /, "al ")}`,
  of: (count, total) => `${count} de ${total}`,
  foundCount: (count) => `${count} encontrados`,
  discoveredCount: (count, total) => `${count} de ${total} descubiertos`,
  spaceBar: "Barra espaciadora",
  rotate: "Gira la pantalla y el dibujo se hace grande",
};

// Arabic names carry their article (الحافلة; a construct like سيارة الإطفاء has it on the second word) and always a
// `gender`, plurals too (marked `plural`). Plurals of things and animals take feminine singular agreement, so they
// carry gender "f" (الكتاكيت صغيرة); a plural with gender "m" is people (الأطفال) and takes the masculine plural.
// Verbs before the name stay singular and only follow its gender (تأتي الحافلة, يأتي الأطفال). The child is
// never addressed with an imperative, which is masculine or feminine: "let's" (هيّا) instead.

/** How an Arabic name is agreed with: masculine, feminine (things in the plural too) or masculine plural (people). */
const arForm = (item: SceneItem) => (item.gender === "f" || (item.plural && item.gender !== "m") ? "f" : item.plural ? "mPl" : "m");

/** The Arabic word that agrees with the name: masculine, feminine, masculine plural. */
const arAgree = (item: SceneItem, m: string, f: string, mPl: string) => ({ m, f, mPl })[arForm(item)];

/** A verb standing before its name: singular, by gender only ("يأتي الأطفال"). */
const arVerbFirst = (item: SceneItem, m: string, f: string) => (arForm(item) === "f" ? f : m);

/** An Arabic colour or size trait: the praise agreeing with the name ("الحافلة حمراء!"). */
function arAdjective(question: string, m: string, f: string, mPl: string, part: string | undefined, emoji: string, very = false): TraitWords {
  return { question, emoji, part, praise: (item) => `${item.name} ${arAgree(item, m, f, mPl)}${very ? " جدا" : ""}!` };
}

const ar: ScenePhrases = {
  prompts: { tap: "هيّا نلمس شيئا! 👆", hover: "هيّا نشير إلى شيء! 👆", keys: "هيّا نضغط على زر! ⌨️" },
  colourPrompts: {
    tap: "هيّا نلمس شيئا فيصبح ملونا! 🖍️",
    hover: "هيّا نشير إلى شيء فيصبح ملونا! 🖍️",
    keys: "هيّا نضغط على زر فيصبح شيء ملونا! 🖍️",
  },
  praise: ["رائع!", "ممتاز!", "جميل جدا!", "نعم، بالضبط!", "صحيح!"],
  allColoured: "مرحى! الصورة كلها ملونة!",
  allFound: "مرحى! وجدنا كل شيء!",
  goodNight: "ليلة سعيدة! الجميع نائمون الآن.",
  peekaboo: (found) => `مفاجأة! ${found}`,
  whereIs: (item) => `أين ${item.name}؟`,
  hereIs: (item) => `${arAgree(item, "ها هو", "ها هي", "ها هم")} ${item.name}!`,
  thatIs: (item, question) => `${arAgree(item, "هذا هو", "هذه هي", "هؤلاء هم")} ${item.name}. ${question}`,
  traits: {
    red: arAdjective("أين شيء أحمر؟", "أحمر", "حمراء", "حمر", "هنا لون أحمر!", "🔴"),
    yellow: arAdjective("أين شيء أصفر؟", "أصفر", "صفراء", "صفر", "هنا لون أصفر!", "🟡"),
    blue: arAdjective("أين شيء أزرق؟", "أزرق", "زرقاء", "زرق", "هنا لون أزرق!", "🔵"),
    green: arAdjective("أين شيء أخضر؟", "أخضر", "خضراء", "خضر", "هنا لون أخضر!", "🟢"),
    flies: { question: "من يطير؟", emoji: "🪽", praise: (item) => `${item.name} ${arAgree(item, "يطير", "تطير", "يطيرون")}!` },
    big: arAdjective("أين شيء كبير جدا؟", "كبير", "كبيرة", "كبار", undefined, "🐘", true),
    small: arAdjective("أين شيء صغير جدا؟", "صغير", "صغيرة", "صغار", undefined, "🐜", true),
    animal: { question: "أين حيوان؟", emoji: "🐾", praise: (item) => `${item.name} ${item.plural ? "حيوانات" : "حيوان"}!` },
    wheels: { question: "أين شيء له عجلات؟", emoji: "🛞", praise: (item) => `${item.name} ${arAgree(item, "له", "لها", "لهم")} عجلات!` },
  },
  places: {
    stadt: { to: "إلى المدينة", from: "من المدينة", at: "في المدينة" },
    feuerwache: { to: "إلى مركز الإطفاء", from: "من مركز الإطفاء", at: "في مركز الإطفاء" },
    bauernhof: { to: "إلى المزرعة", from: "من المزرعة", at: "في المزرعة" },
    wald: { to: "إلى الغابة", from: "من الغابة", at: "في الغابة" },
    zoo: { to: "إلى حديقة الحيوان", from: "من حديقة الحيوان", at: "في حديقة الحيوان" },
    baustelle: { to: "إلى موقع البناء", from: "من موقع البناء", at: "في موقع البناء" },
  },
  backHome: (item, place) => `${arAgree(item, "ها هو", "ها هي", "ها هم")} ${item.name} ${place.at} من جديد!`,
  comesFrom: (item, place) => `${arVerbFirst(item, "يأتي", "تأتي")} ${item.name} ${place.from}!`,
  drivesTo: (item, place) => `مع السلامة! ${arVerbFirst(item, "يذهب", "تذهب")} ${item.name} ${place.to}.`,
  follow: (item) => `هيّا نتبع ${item.name}`,
  of: (count, total) => `${count} من ${total}`,
  foundCount: (count) => `وجدنا ${count}`,
  discoveredCount: (count, total) => `اكتشفنا ${count} من ${total}`,
  spaceBar: "مفتاح المسافة",
  rotate: "أديروا الهاتف بالعرض فتكبر الصورة",
};

/** The engine's words by language; pick them with `pick(SCENE_PHRASES, language.id)`. */
export const SCENE_PHRASES: Localized<ScenePhrases> = { de, ru, en, zh, hi, es, ar };
