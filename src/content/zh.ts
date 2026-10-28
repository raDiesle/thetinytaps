// Chinese language pack (Mandarin, Simplified characters, zh-CN): the Latin letters as children learn them
// with pinyin. Each letter is named the way Chinese children read it (b → 玻 bō, m → 摸 mō), and its words
// are Chinese words whose pinyin starts with it (B – 爸爸 bàba). Every word keeps its pinyin with tone marks
// in `spelling`: the card shows it under the characters, and „Wörter tippen“ types it letter by letter (the
// tones don't need a key). V is left out: pinyin has no v (only the ü that keyboards type on it).
// I, O and U start no syllable (it is yi, wo, wu), so their words have them inside, as on pinyin charts
// (衣服 yīfu for i, 乌鸦 wūyā for u). Counting uses the measure word of each thing: 三只鸭子, 两辆车.

import { de } from "./de";
import { relabel } from "./translate";
import type { ActionWord, ColorWord, Countable, LanguagePack, LetterEntry, ThemeId, WordEntry } from "./types";

const w = (word: string, spelling: string, emoji: string, image?: string): WordEntry => ({ word, spelling, emoji, image });
const themed =
  (theme: ThemeId) =>
  (word: string, spelling: string, emoji: string, image?: string): WordEntry => ({ word, spelling, emoji, image, theme });
const dongwu = themed("animals");
const jiaotong = themed("vehicles");
const shiwu = themed("food");
const shenti = themed("body");
const yifu = themed("clothes");
const jiaren = themed("family");
const yinyue = themed("music");
const ziran = themed("nature");
const jieri = themed("holidays");

const letter = (upper: string, spoken: string, words: WordEntry[], inWord?: true): LetterEntry => ({
  upper,
  lower: upper.toLowerCase(),
  spoken,
  words,
  inWord,
});

const letters: LetterEntry[] = [
  letter("A", "啊", [jiaren("阿姨", "āyí", "👩"), shenti("爱心", "àixīn", "❤️")]),
  letter("B", "玻", [
    jiaren("爸爸", "bàba", "👨"),
    shiwu("包子", "bāozi", "🥟"),
    shiwu("冰淇淋", "bīngqílín", "🍦"),
    w("杯子", "bēizi", "🥤"),
    shenti("鼻子", "bízi", "👃"),
    w("笔", "bǐ", "✏️"),
    shiwu("饼干", "bǐnggān", "🍪"),
    dongwu("豹子", "bàozi", "🐆"),
  ]),
  letter("C", "雌", [
    shiwu("草莓", "cǎoméi", "🍓"),
    jiaotong("船", "chuán", "⛵"),
    dongwu("虫子", "chóngzi", "🐛"),
    ziran("彩虹", "cǎihóng", "🌈"),
    w("窗户", "chuānghu", "🪟"),
    w("床", "chuáng", "🛏️"),
    ziran("草", "cǎo", "🌿"),
  ]),
  letter("D", "得", [
    dongwu("大象", "dàxiàng", "🐘"),
    jieri("蛋糕", "dàngāo", "🎂"),
    w("灯", "dēng", "💡"),
    jiaren("弟弟", "dìdi", "👦"),
    dongwu("袋鼠", "dàishǔ", "🦘"),
    w("电话", "diànhuà", "📞"),
    yinyue("笛子", "dízi", "🪈"),
  ]),
  letter("E", "鹅", [shenti("耳朵", "ěrduo", "👂"), dongwu("鳄鱼", "èyú", "🐊"), dongwu("鹅", "é", "🪿")]),
  letter("F", "佛", [
    jiaotong("飞机", "fēijī", "✈️"),
    w("房子", "fángzi", "🏠"),
    jieri("风筝", "fēngzheng", "🪁"),
    shiwu("蜂蜜", "fēngmì", "🍯"),
    shiwu("饭", "fàn", "🍚"),
  ]),
  letter("G", "哥", [
    dongwu("狗", "gǒu", "🐶"),
    jiaren("哥哥", "gēge", "👦"),
    yinyue("鼓", "gǔ", "🥁"),
    dongwu("公鸡", "gōngjī", "🐓"),
    shiwu("果汁", "guǒzhī", "🧃"),
    shenti("骨头", "gǔtou", "🦴"),
    dongwu("鸽子", "gēzi", "🕊️"),
  ]),
  letter("H", "喝", [
    ziran("花", "huā", "🌸"),
    dongwu("猴子", "hóuzi", "🐒"),
    jiaotong("火车", "huǒchē", "🚂"),
    dongwu("蝴蝶", "húdié", "🦋"),
    dongwu("河马", "hémǎ", "🦛"),
    dongwu("海豚", "hǎitún", "🐬"),
    shiwu("汉堡", "hànbǎo", "🍔"),
    w("盒子", "hézi", "📦"),
    ziran("火", "huǒ", "🔥"),
  ]),
  letter("I", "衣", [yifu("衣服", "yīfu", "👕"), dongwu("鸡", "jī", "🐔"), shiwu("米", "mǐ", "🍚")], true),
  letter("J", "基", [
    shiwu("鸡蛋", "jīdàn", "🥚"),
    shiwu("橘子", "júzi", "🍊"),
    dongwu("金鱼", "jīnyú", "🐠"),
    jiaren("姐姐", "jiějie", "👧"),
    shiwu("饺子", "jiǎozi", "🥟"),
    w("剪刀", "jiǎndāo", "✂️"),
  ]),
  letter("K", "科", [
    dongwu("恐龙", "kǒnglóng", "🦕"),
    yifu("裤子", "kùzi", "👖"),
    dongwu("孔雀", "kǒngquè", "🦚"),
    w("筷子", "kuàizi", "🥢"),
    dongwu("考拉", "kǎolā", "🐨"),
  ]),
  letter("L", "勒", [
    dongwu("老虎", "lǎohǔ", "🐯"),
    dongwu("狼", "láng", "🐺"),
    dongwu("龙", "lóng", "🐉"),
    yinyue("铃铛", "língdang", "🔔"),
    dongwu("老鼠", "lǎoshǔ", "🐭"),
    w("篮球", "lánqiú", "🏀"),
    shiwu("梨", "lí", "🍐"),
  ]),
  letter("M", "摸", [
    jiaren("妈妈", "māma", "👩"),
    dongwu("猫", "māo", "🐱"),
    dongwu("马", "mǎ", "🐴"),
    yifu("帽子", "màozi", "🧢"),
    dongwu("蜜蜂", "mìfēng", "🐝"),
    shiwu("面包", "miànbāo", "🍞"),
    ziran("蘑菇", "mógu", "🍄"),
    dongwu("猫头鹰", "māotóuyīng", "🦉"),
    shiwu("面条", "miàntiáo", "🍜"),
  ]),
  letter("N", "讷", [
    dongwu("牛", "niú", "🐮"),
    jiaren("奶奶", "nǎinai", "👵"),
    shiwu("牛奶", "niúnǎi", "🥛"),
    dongwu("鸟", "niǎo", "🐦"),
    shiwu("柠檬", "níngméng", "🍋"),
    jieri("南瓜", "nánguā", "🎃"),
  ]),
  letter("O", "喔", [dongwu("蜗牛", "wōniú", "🐌"), shiwu("菠萝", "bōluó", "🍍"), shiwu("萝卜", "luóbo", "🥕"), jiaotong("火箭", "huǒjiàn", "🚀")], true),
  letter("P", "坡", [
    shiwu("苹果", "píngguǒ", "🍎"),
    dongwu("螃蟹", "pángxiè", "🦀"),
    shiwu("葡萄", "pútao", "🍇"),
    w("盘子", "pánzi", "🍽️"),
    w("皮球", "píqiú", "⚽"),
    dongwu("瓢虫", "piáochóng", "🐞"),
    shiwu("披萨", "pīsà", "🍕"),
  ]),
  letter("Q", "欺", [
    dongwu("企鹅", "qǐ'é", "🐧"),
    jieri("气球", "qìqiú", "🎈"),
    dongwu("青蛙", "qīngwā", "🐸"),
    jiaotong("汽车", "qìchē", "🚗"),
    yifu("裙子", "qúnzi", "👗"),
  ]),
  letter("R", "日", [shiwu("肉", "ròu", "🥩"), shiwu("热狗", "règǒu", "🌭"), w("人", "rén", "🧍")]),
  letter("S", "思", [
    ziran("树", "shù", "🌳"),
    w("书", "shū", "📖"),
    dongwu("狮子", "shīzi", "🦁"),
    dongwu("蛇", "shé", "🐍"),
    shenti("手", "shǒu", "✋"),
    w("勺子", "sháozi", "🥄"),
    dongwu("松鼠", "sōngshǔ", "🐿️"),
    w("伞", "sǎn", "☂️"),
    ziran("水", "shuǐ", "💧"),
    ziran("山", "shān", "⛰️"),
  ]),
  letter("T", "特", [
    ziran("太阳", "tàiyáng", "☀️"),
    dongwu("兔子", "tùzi", "🐰"),
    shiwu("汤", "tāng", "🍲"),
    shiwu("糖", "táng", "🍬"),
    jiaotong("拖拉机", "tuōlājī", "🚜"),
    yifu("拖鞋", "tuōxié", "🩴"),
  ]),
  letter("U", "乌", [dongwu("乌鸦", "wūyā", "🐦‍⬛"), dongwu("猪", "zhū", "🐷"), ziran("竹子", "zhúzi", "🎋")], true),
  letter("W", "乌", [w("娃娃", "wáwa", "🪆"), yifu("袜子", "wàzi", "🧦"), w("碗", "wǎn", "🥣"), jiaren("外婆", "wàipó", "👵")]),
  letter("X", "希", [
    dongwu("熊猫", "xióngmāo", "🐼"),
    shiwu("西瓜", "xīguā", "🍉"),
    ziran("星星", "xīngxing", "⭐"),
    yifu("鞋", "xié", "👟"),
    dongwu("熊", "xióng", "🐻"),
    ziran("雪", "xuě", "❄️"),
    shiwu("香蕉", "xiāngjiāo", "🍌"),
  ]),
  letter("Y", "衣", [
    dongwu("鱼", "yú", "🐟"),
    dongwu("鸭子", "yāzi", "🦆"),
    ziran("月亮", "yuèliang", "🌙"),
    ziran("雨", "yǔ", "🌧️"),
    dongwu("羊", "yáng", "🐑"),
    shenti("眼睛", "yǎnjing", "👁️"),
    shiwu("椰子", "yēzi", "🥥"),
    shenti("牙齿", "yáchǐ", "🦷"),
  ]),
  letter("Z", "资", [
    w("足球", "zúqiú", "⚽"),
    shenti("嘴巴", "zuǐba", "👄"),
    dongwu("蜘蛛", "zhīzhū", "🕷️"),
    w("钟", "zhōng", "⏰"),
    w("帐篷", "zhàngpeng", "⛺"),
    dongwu("章鱼", "zhāngyú", "🐙"),
  ]),
];

/** Chinese counts with a measure word between number and thing: 三只鸭子, 两辆车. */
interface ChineseCountable extends Countable {
  /** The measure word: 只, 辆, 个 … */
  measure: string;
}

/** Chinese nouns have one form, so singular and plural are the same word. */
const thing = (emoji: string, measure: string, noun: string, theme?: ThemeId): ChineseCountable => ({
  emoji,
  measure,
  singular: noun,
  plural: noun,
  theme,
});

const countables: ChineseCountable[] = [
  thing("🦆", "只", "鸭子", "animals"),
  thing("🐞", "只", "瓢虫", "animals"),
  thing("🐟", "条", "鱼", "animals"),
  thing("🐥", "只", "小鸡", "animals"),
  thing("🐝", "只", "蜜蜂", "animals"),
  thing("🐸", "只", "青蛙", "animals"),
  thing("🚗", "辆", "汽车", "vehicles"),
  thing("🚌", "辆", "公交车", "vehicles"),
  thing("🚜", "辆", "拖拉机", "vehicles"),
  thing("🚲", "辆", "自行车", "vehicles"),
  thing("✈️", "架", "飞机", "vehicles"),
  thing("🍎", "个", "苹果", "food"),
  thing("🍓", "颗", "草莓", "food"),
  thing("🍌", "根", "香蕉", "food"),
  thing("🥕", "根", "胡萝卜", "food"),
  thing("🍪", "块", "饼干", "food"),
  thing("🦷", "颗", "牙齿", "body"),
  thing("👂", "只", "耳朵", "body"),
  thing("🦶", "只", "脚", "body"),
  thing("🦴", "根", "骨头", "body"),
  thing("🧦", "只", "袜子", "clothes"),
  thing("🧢", "顶", "帽子", "clothes"),
  thing("👕", "件", "衣服", "clothes"),
  thing("🧤", "只", "手套", "clothes"),
  thing("👶", "个", "宝宝", "family"),
  thing("🧒", "个", "小朋友", "family"),
  thing("🎵", "个", "音符", "music"),
  thing("🎸", "把", "吉他", "music"),
  thing("🔔", "个", "铃铛", "music"),
  thing("🎺", "把", "小号", "music"),
  thing("🌳", "棵", "树", "nature"),
  thing("🍄", "个", "蘑菇", "nature"),
  thing("🌷", "朵", "郁金香", "nature"),
  thing("🌼", "朵", "花", "nature"),
  thing("🎈", "个", "气球", "holidays"),
  thing("🎁", "个", "礼物", "holidays"),
  thing("🕯️", "根", "蜡烛", "holidays"),
  thing("⭐", "颗", "星星"),
];

const numberWords = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

/** "一只鸭子", "两只鸭子" (two is 两 before a measure word), "三只鸭子". */
function countSentence(n: number, countable: Countable) {
  const item = countable as ChineseCountable;
  return `${n === 2 ? "两" : numberWords[n]}${item.measure}${item.singular}！`;
}

/** The pack's colour or doing words with the Chinese word and its pinyin per emoji. */
function withPinyin<T extends WordEntry>(items: T[], words: Record<string, [word: string, spelling: string]>): T[] {
  const labelled = relabel(items, Object.fromEntries(Object.entries(words).map(([emoji, [word]]) => [emoji, word])));
  return labelled.map((item) => ({ ...item, spelling: words[item.emoji][1] }));
}

export const zh: LanguagePack = {
  speechLang: "zh-CN",
  themes: [
    { id: "animals", label: "动物", emoji: "🐾" },
    { id: "vehicles", label: "交通工具", emoji: "🚗" },
    { id: "food", label: "食物", emoji: "🍎" },
    { id: "body", label: "身体", emoji: "🖐️" },
    { id: "clothes", label: "衣服", emoji: "👕" },
    { id: "family", label: "家人", emoji: "👪" },
    { id: "music", label: "音乐", emoji: "🎵" },
    { id: "nature", label: "大自然", emoji: "🌳" },
    { id: "holidays", label: "节日", emoji: "🎄" },
  ],
  letters,
  numberWords,
  countables,
  zero: { emoji: "🪹", sentence: "鸟窝空空的！" },
  // "玻——爸爸！", and for a letter inside the word "衣服——衣！"
  letterSentence: (l, word) => (l.inWord ? `${word.word}——${l.spoken}！` : `${l.spoken}——${word.word}！`),
  findPrompt: (l) => `${l.spoken}在哪里？`,
  keyboardRows: ["1234567890", "QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"],
  countSentence,
  praise: ["真棒！", "太好了！", "好厉害！", "耶！", "哇！"],
  firstLetterPrompt: (word) => `${word.word}！${word.word}是哪个字母开头的？`,
  colors: withPinyin<ColorWord>(de.colors, {
    "🔴": ["红色", "hóngsè"],
    "🔵": ["蓝色", "lánsè"],
    "🟡": ["黄色", "huángsè"],
    "🟢": ["绿色", "lǜsè"],
    "🟣": ["紫色", "zǐsè"],
    "🩷": ["粉色", "fěnsè"],
    "🟠": ["橙色", "chéngsè"],
  }),
  actions: withPinyin<ActionWord>(de.actions, {
    "🐸": ["跳", "tiào"],
    "🏃": ["跑", "pǎo"],
    "😴": ["睡觉", "shuìjiào"],
    "💃": ["跳舞", "tiàowǔ"],
    "👋": ["挥手", "huīshǒu"],
    "🐱": ["转圈", "zhuànquān"],
    "🐦": ["飞", "fēi"],
    "🐟": ["游泳", "yóuyǒng"],
    "👏": ["拍手", "pāishǒu"],
  }),
  joinIn: (word) => `和我一起${word.word}！`,
  whistle: "呜呜！",
};
