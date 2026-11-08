import type { Animal, AnimalTexts, AnimalTranslation, Food, GiftTexts } from "./content";
import type { Gift, GiftId } from "./gifts";
import type { Growth, GrowTexts, GrowthId } from "./growth";
import type { Home, HomeId } from "./homes";

// Chinese (Simplified, Mandarin) texts for "Was gehört zum Tier?", by the ids of the animals, foods and homes in
// content.ts and homes.tsx. Chinese has no articles, gender or plural, so the sentences take the words as they are;
// a home only needs its place word ("狗窝里", "冰上") for "住在……".

/** Animals by their id (one without an entry is said in German): with „小“ where a child would say it („小兔子“). */
export const CHINESE_ANIMALS: Record<string, string> = {
  hase: "小兔子",
  hund: "小狗",
  katze: "小猫",
  maus: "小老鼠",
  vogel: "小鸟",
  baer: "小熊",
  biene: "小蜜蜂",
  frosch: "小青蛙",
  kuh: "奶牛",
  pferd: "小马",
  eichhoernchen: "小松鼠",
  pinguin: "企鹅",
  fisch: "小鱼",
  spinne: "小蜘蛛",
  ente: "小鸭子",
  fuchs: "狐狸",
  schwein: "小猪",
  affe: "小猴子",
  huhn: "母鸡",
  panda: "熊猫",
  schnecke: "蜗牛",
  loewe: "狮子",
  giraffe: "长颈鹿",
  schaf: "小绵羊",
  biber: "河狸",
  ameise: "蚂蚁",
  wal: "鲸鱼",
  krebs: "螃蟹",
  schildkroete: "乌龟",
  kamel: "骆驼",
  eule: "猫头鹰",
  fledermaus: "蝙蝠",
  ziege: "山羊",
  gans: "大白鹅",
  lama: "羊驼",
  elefant: "大象",
  gorilla: "大猩猩",
  koala: "考拉",
  seehund: "海豹",
  delfin: "海豚",
  eisbaer: "北极熊",
  krokodil: "鳄鱼",
  tiger: "老虎",
  wolf: "大灰狼",
  igel: "刺猬",
  schmetterling: "蝴蝶",
  raupe: "毛毛虫",
  papagei: "鹦鹉",
  zebra: "斑马",
  esel: "小毛驴",
  hamster: "小仓鼠",
  nilpferd: "河马",
  nashorn: "犀牛",
  kaenguru: "袋鼠",
  hirsch: "小鹿",
  elch: "驼鹿",
  faultier: "树懒",
  otter: "水獭",
  hai: "鲨鱼",
  kugelfisch: "河豚",
  oktopus: "章鱼",
  flamingo: "火烈鸟",
  adler: "老鹰",
  marienkaefer: "瓢虫",
  grashuepfer: "蚱蜢",
  wildschwein: "野猪",
  waschbaer: "浣熊",
  dachs: "獾",
  qualle: "水母",
  schwan: "天鹅",
};

/** Foods by their id (one without an entry is said in German), for the plate and „……爱吃……“. */
export const CHINESE_FOODS: Record<string, string> = {
  moehre: "胡萝卜",
  knochen: "骨头",
  fisch: "鱼",
  kaese: "奶酪",
  wurm: "虫子",
  honig: "蜂蜜",
  blume: "花",
  fliege: "苍蝇",
  heu: "干草",
  apfel: "苹果",
  nuss: "坚果",
  banane: "香蕉",
  mais: "玉米",
  bambus: "竹子",
  salat: "生菜",
  fleisch: "肉",
  blaetter: "树叶",
  erdnuss: "花生",
  trauben: "葡萄",
  melone: "西瓜",
  garnele: "虾",
  holz: "木头",
};

/** A home in Chinese. */
export interface ChineseHome {
  /** Shown under the drawing: "狗窝". */
  name: string;
  /** The place, for "小狗住在狗窝里。": "狗窝里". */
  place: string;
}

/** Homes by their id; one without an entry is said in German. */
export const CHINESE_HOMES: Partial<Record<HomeId, ChineseHome>> = {
  huette: { name: "狗窝", place: "狗窝里" },
  nest: { name: "鸟窝", place: "鸟窝里" },
  aquarium: { name: "鱼缸", place: "鱼缸里" },
  bienenstock: { name: "蜂箱", place: "蜂箱里" },
  stall: { name: "棚子", place: "棚子里" },
  hoehle: { name: "山洞", place: "山洞里" },
  teich: { name: "池塘", place: "池塘里" },
  bau: { name: "地洞", place: "地洞里" },
  mauseloch: { name: "老鼠洞", place: "老鼠洞里" },
  koerbchen: { name: "小篮子", place: "小篮子里" },
  baum: { name: "树洞", place: "树洞里" },
  netz: { name: "蜘蛛网", place: "蜘蛛网上" },
  eis: { name: "冰面", place: "冰面上" },
  biberburg: { name: "河狸窝", place: "河狸窝里" },
  ameisenhaufen: { name: "蚁巢", place: "蚁巢里" },
  meer: { name: "大海", place: "大海里" },
  wueste: { name: "沙漠", place: "沙漠里" },
  dschungel: { name: "丛林", place: "丛林里" },
  savanne: { name: "大草原", place: "大草原上" },
  bambuswald: { name: "竹林", place: "竹林里" },
  kaefig: { name: "笼子", place: "笼子里" },
  laubhaufen: { name: "落叶堆", place: "落叶堆里" },
  wiese: { name: "草地", place: "草地上" },
  garten: { name: "花园", place: "花园里" },
  fluss: { name: "小河", place: "小河里" },
  berg: { name: "高山", place: "高山上" },
  wald: { name: "森林", place: "森林里" },
  riff: { name: "珊瑚礁", place: "珊瑚礁里" },
};

/** The Chinese texts; what has no Chinese words yet is the whole German sentence. */
export function chineseTexts(german: AnimalTexts): AnimalTexts {
  const animal = (a: Animal) => CHINESE_ANIMALS[a.id];
  const food = (f: Food) => CHINESE_FOODS[f.id];
  const home = (h: Home) => CHINESE_HOMES[h.id];
  return {
    animal: (a) => animal(a) ?? german.animal(a),
    food: (f) => food(f) ?? german.food(f),
    home: (h) => home(h)?.name ?? german.home(h),
    hungry: (a) => (animal(a) ? `${animal(a)}饿了！` : german.hungry(a)),
    whatEats: (a) => (animal(a) ? `${animal(a)}爱吃什么？` : german.whatEats(a)),
    yummy: (a, f) => (animal(a) && food(f) ? `嗯，真好吃！${animal(a)}爱吃${food(f)}。谢谢！` : german.yummy(a, f)),
    yuck: (a) => (animal(a) ? `咦！${animal(a)}不爱吃这个。` : german.yuck(a)),
    whereLives: (a) => (animal(a) ? `${animal(a)}住在哪里？` : german.whereLives(a)),
    movedIn: (a, h) => (animal(a) && home(h) ? `耶！${animal(a)}住在${home(h)!.place}。` : german.movedIn(a, h)),
    livesHere: (resident) => (animal(resident) ? `不对，这里住的是${animal(resident)}！` : german.livesHere(resident)),
    stars: (n) => `完成了 ${n} 个`,
  };
}

/** What the animals give us, by gift id ("Was gibt uns das Tier?"); one without an entry is said in German. */
export const CHINESE_GIFTS: Partial<Record<GiftId, string>> = {
  milch: "牛奶",
  ei: "鸡蛋",
  honig: "蜂蜜",
  wolle: "羊毛",
  kaese: "奶酪",
};

/** "Was gibt uns das Tier?" in Chinese; what has no Chinese words yet is the whole German sentence. */
export function chineseGifts(german: GiftTexts): GiftTexts {
  const animal = (a: Animal) => CHINESE_ANIMALS[a.id];
  const gift = (g: Gift) => CHINESE_GIFTS[g.id];
  return {
    gift: (g) => gift(g) ?? german.gift(g),
    whatGives: (a) => (animal(a) ? `${animal(a)}给我们什么？` : german.whatGives(a)),
    gives: (a, g) => (animal(a) && gift(g) ? `${animal(a)}给我们${gift(g)}。谢谢！` : german.gives(a, g)),
    comesFrom: (g, giver) => (animal(giver) && gift(g) ? `${gift(g)}是${animal(giver)}给我们的！` : german.comesFrom(g, giver)),
  };
}

/** A small one and what it becomes, in Chinese ("Was wird aus mir?"). */
export interface ChineseGrowth {
  /** The small one: "毛毛虫". */
  young: string;
  /** What it becomes: "蝴蝶". */
  adult: string;
}

/** The small ones by their id; one without an entry is said in German. */
export const CHINESE_GROWTHS: Partial<Record<GrowthId, ChineseGrowth>> = {
  raupe: { young: "毛毛虫", adult: "蝴蝶" },
  ei: { young: "鸡蛋", adult: "小鸡" },
  samen: { young: "种子", adult: "向日葵" },
  kaulquappe: { young: "小蝌蚪", adult: "小青蛙" },
  eichel: { young: "橡果", adult: "大树" },
  zwiebel: { young: "球根", adult: "郁金香" },
  kuerbiskern: { young: "南瓜子", adult: "南瓜" },
  kokosnuss: { young: "椰子", adult: "椰子树" },
  knospe: { young: "花苞", adult: "玫瑰" },
  schildkroetenei: { young: "蛋", adult: "乌龟" },
  krokodilei: { young: "蛋", adult: "鳄鱼" },
  dinoei: { young: "蛋", adult: "恐龙" },
  pinguinei: { young: "蛋", adult: "企鹅" },
  schlangenei: { young: "蛋", adult: "蛇" },
  fischei: { young: "蛋", adult: "小鱼" },
  larve: { young: "幼虫", adult: "小蜜蜂" },
  karottensamen: { young: "种子", adult: "胡萝卜" },
  maiskorn: { young: "玉米粒", adult: "玉米" },
  schirmchen: { young: "小伞", adult: "蒲公英" },
  erdbeersamen: { young: "种子", adult: "草莓" },
};

/** "Was wird aus mir?" in Chinese; a small one without its Chinese words is the whole German sentence. */
export function chineseGrowth(german: GrowTexts): GrowTexts {
  const word = (g: Growth) => CHINESE_GROWTHS[g.id];
  return {
    young: (g) => word(g)?.young ?? german.young(g),
    adult: (g) => word(g)?.adult ?? german.adult(g),
    whatBecomes: (g) => (word(g) ? `${word(g)!.young}会变成什么？` : german.whatBecomes(g)),
    becomes: (g) => (word(g) ? `${word(g)!.young}变成${word(g)!.adult}啦。真棒！` : german.becomes(g)),
    comesFrom: (g) => (word(g) ? `${word(g)!.adult}是${word(g)!.young}变成的！` : german.comesFrom(g)),
  };
}

/** Chinese, for the table of languages in content.ts. */
export const CHINESE: AnimalTranslation = {
  words: { animals: CHINESE_ANIMALS, foods: CHINESE_FOODS, homes: CHINESE_HOMES },
  texts: chineseTexts,
  gifts: chineseGifts,
  growth: chineseGrowth,
};
