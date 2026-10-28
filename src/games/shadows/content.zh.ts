import type { ShadowItem, ShadowTexts, ShadowTranslation } from "./content";

// Chinese (Simplified, Mandarin) texts for "Schatten finden" and "Wer schaut da raus?", by the ids of the pictures
// in content.ts. Chinese has no articles, gender or plural, so each picture needs only its name ("大象的影子").

/** Pictures of content.ts by their id; one without an entry is said in German. „小“ where a child would say it. */
export const CHINESE_NAMES: Record<string, string> = {
  elefant: "大象",
  giraffe: "长颈鹿",
  schildkroete: "乌龟",
  schnecke: "蜗牛",
  schmetterling: "蝴蝶",
  fisch: "小鱼",
  hahn: "公鸡",
  ente: "小鸭子",
  hase: "小兔子",
  katze: "小猫",
  hund: "小狗",
  pferd: "小马",
  kuh: "奶牛",
  schwein: "小猪",
  schaf: "小羊",
  igel: "刺猬",
  krebs: "螃蟹",
  tintenfisch: "章鱼",
  dino: "恐龙",
  krokodil: "鳄鱼",
  eichhoernchen: "松鼠",
  eule: "猫头鹰",
  biene: "小蜜蜂",
  wal: "鲸鱼",
  flamingo: "火烈鸟",
  pinguin: "企鹅",
  maus: "小老鼠",

  auto: "汽车",
  fahrrad: "自行车",
  lok: "火车",
  flugzeug: "飞机",
  hubschrauber: "直升机",
  segelboot: "帆船",
  rakete: "火箭",
  traktor: "拖拉机",
  roller: "滑板车",
  feuerwehr: "消防车",
  motorrad: "摩托车",

  banane: "香蕉",
  apfel: "苹果",
  birne: "梨",
  moehre: "胡萝卜",
  erdbeere: "草莓",
  melone: "西瓜",
  kaese: "奶酪",
  brezel: "椒盐卷饼",
  eis: "冰淇淋",
  pilz: "蘑菇",
  mais: "玉米",
  brokkoli: "西兰花",
  pizza: "披萨",

  stern: "星星",
  schirm: "雨伞",
  schluessel: "钥匙",
  ballon: "气球",
  mond: "月亮",
  baum: "大树",
  haus: "房子",
  schere: "剪刀",
  gitarre: "吉他",
  schuh: "鞋子",
  teddy: "泰迪熊",
  drachen: "风筝",
  glocke: "铃铛",
  herz: "爱心",
};

/** The Chinese texts; a picture without its Chinese name gets the whole German sentence. */
export function chineseTexts(german: ShadowTexts): ShadowTexts {
  const about =
    (sentence: (name: string) => string, fallback: (item: ShadowItem) => string) =>
    (item: ShadowItem): string => {
      const name = CHINESE_NAMES[item.id];
      return name ? sentence(name) : fallback(item);
    };
  return {
    name: about((name) => name, german.name),
    search: about((name) => `${name}在找自己的影子。`, german.search),
    found: about((name) => `耶！这就是${name}的影子！`, german.found),
    thatIs: about((name) => `这是${name}。`, german.thatIs),
    peek: "谁在偷偷看？",
    there: about((name) => `原来是${name}！`, german.there),
    shadow: (n) => `影子 ${n}`,
    stars: (n) => `完成了 ${n} 个`,
  };
}

/** Chinese, for the table of languages in content.ts. */
export const CHINESE: ShadowTranslation = { names: CHINESE_NAMES, texts: chineseTexts };
