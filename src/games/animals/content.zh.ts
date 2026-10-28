import type { Animal, AnimalTexts, AnimalTranslation, Food } from "./content";
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
  kartoffel: "土豆",
  banane: "香蕉",
  mais: "玉米",
  bambus: "竹子",
  salat: "生菜",
  fleisch: "肉",
  blaetter: "树叶",
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
    yummy: (a, f) => (animal(a) && food(f) ? `嗯，真好吃！${animal(a)}爱吃${food(f)}。谢谢！` : german.yummy(a, f)),
    yuck: (a) => (animal(a) ? `咦！${animal(a)}不爱吃这个。` : german.yuck(a)),
    whereLives: (a) => (animal(a) ? `${animal(a)}住在哪里？` : german.whereLives(a)),
    movedIn: (a, h) => (animal(a) && home(h) ? `耶！${animal(a)}住在${home(h)!.place}。` : german.movedIn(a, h)),
    livesHere: (resident) => (animal(resident) ? `不对，这里住的是${animal(resident)}！` : german.livesHere(resident)),
    yuckBubble: "咦！",
    thanksBubble: "谢谢！",
    stars: (n) => `完成了 ${n} 个`,
  };
}

/** Chinese, for the table of languages in content.ts. */
export const CHINESE: AnimalTranslation = { words: { animals: CHINESE_ANIMALS, foods: CHINESE_FOODS, homes: CHINESE_HOMES }, texts: chineseTexts };
