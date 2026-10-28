import type { SceneTranslation } from "../types";

// The Dinotal picture in Chinese (Mandarin, simplified characters): the title, every item's name and
// sentences and the chain sentences. Names are bare nouns, without measure word or 这/那; the dinosaurs
// have their usual Chinese names (霸王龙, 三角龙, 腕龙), the Archaeopteryx is 始祖鸟.

/** „Dinotal“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "恐龙谷",
  description: "腕龙、三角龙、恐龙蛋，还有一只要打喷嚏的霸王龙。",
  items: {
    sonne: { name: "太阳", sentences: ["太阳暖暖地照着恐龙谷。", "太阳在笑。"] },
    wolke: { name: "云朵", sentences: ["云朵下雨啦。滴答，滴答！", "下过雨，蕨类长出来啦。"] },
    flugsaurier: { name: "翼龙", sentences: ["呼！翼龙飞了一大圈。", "翼龙有一对大大的皮翅膀。", "嘎——！翼龙在叫。"] },
    vulkan: { name: "火山", sentences: ["噗，噗！火山吐出一朵云。", "火山轻轻地咕噜咕噜。", "火山是一座大山。"] },
    baum: { name: "大树", sentences: ["大树好大好大。", "沙沙，沙沙！树叶在响。", "大树上长着好吃的果子。"] },
    urvogel: { name: "始祖鸟", sentences: ["叽！始祖鸟站在树枝上。", "始祖鸟有羽毛，翅膀上还有爪子。"] },
    brachiosaurus: { name: "腕龙", sentences: ["吧唧吧唧！腕龙在吃树顶上的叶子。", "腕龙的脖子好长好长。", "腕龙好大好大。"] },
    hoehle: { name: "山洞", sentences: ["谁住在山洞里？嘻嘻！", "山洞里黑黑的。", "一只小恐龙探出头来：你好！"] },
    flugbaby: { name: "翼龙宝宝", sentences: ["叽叽！翼龙宝宝饿了。", "翼龙宝宝住在岩石顶上的窝里。"] },
    parasaurolophus: { name: "副栉龙", sentences: ["嘟嘟！副栉龙在吹号。", "副栉龙头上有一根长长的管子。"] },
    wassersaurier: { name: "蛇颈龙", sentences: ["咕噜！蛇颈龙潜下去了。", "哗啦！它又出来啦。", "蛇颈龙在湖里游泳。"] },
    libelle: { name: "蜻蜓", sentences: ["嗖！蜻蜓飞过湖面。", "蜻蜓是蓝色的。"] },
    fisch: { name: "小鱼", sentences: ["哗啦！小鱼跳出水面。", "小鱼是橙色的。咕噜！"] },
    seerose: { name: "睡莲", sentences: ["睡莲开花啦。", "睡莲漂在水上。"] },
    frosch: { name: "青蛙", sentences: ["呱！青蛙坐在睡莲上。", "嘿！青蛙跳起来。"] },
    schildkroete: { name: "乌龟", sentences: ["乌龟把头缩进去。", "躲猫猫！头又出来啦。", "乌龟在石头上晒太阳。"] },
    palmfarn: { name: "苏铁", sentences: ["苏铁有大大的绿叶子。", "沙沙，沙沙！叶子在摇。"] },
    stegosaurus: { name: "剑龙", sentences: ["叮叮！背上的骨板在晃。", "剑龙的尾巴上有尖刺。", "剑龙只吃叶子。"] },
    triceratops: { name: "三角龙", sentences: ["三角龙有三只角。", "哼！三角龙点点头。", "三角龙是黄色的。"] },
    babytri: { name: "三角龙宝宝", sentences: ["三角龙宝宝跳到妈妈身边。", "三角龙宝宝的角小小的。"] },
    dinomama: { name: "恐龙妈妈", sentences: ["恐龙妈妈守着她的蛋。", "恐龙妈妈在哼歌。", "恐龙妈妈头上戴着一朵花。"] },
    nest: { name: "恐龙窝", sentences: ["窝里有三个恐龙蛋。", "咚咚！谁在蛋里敲？"] },
    ankylosaurus: { name: "甲龙", sentences: ["甲龙有一身硬甲。", "咚！甲龙摇摇尾巴上的大锤。"] },
    baumstamm: { name: "树干", sentences: ["树干里面是空的。", "咚咚！谁住在树干里？"] },
    eidechse: { name: "蜥蜴", sentences: ["蜥蜴在树干上晒太阳。", "蜥蜴在做俯卧撑。嘿，嘿！"] },
    dinoei: { name: "恐龙蛋", sentences: ["咔嚓！一只小恐龙从蛋里钻出来。", "你好，小恐龙！", "恐龙蛋晃一晃。"] },
    pfuetze: { name: "水坑", sentences: ["啪嗒！一只恐龙跳进了水坑。", "这里有大大的脚印。"] },
    bernstein: { name: "琥珀", sentences: ["琥珀像金子一样闪闪发光。", "琥珀里有一片小叶子。"] },
    kaefer: { name: "甲虫", sentences: ["嗡！甲虫飞了一小段。", "甲虫是红色的。"] },
    pilze: { name: "蘑菇", sentences: ["蘑菇跳呀跳。嘿，嘿，嘿！", "噗！蘑菇喷出孢子。"] },
    trex: { name: "霸王龙", sentences: ["霸王龙轻轻地吼：嗷……", "阿……阿……阿嚏！霸王龙打喷嚏啦。", "祝你健康，亲爱的霸王龙！"] },
    blume: { name: "花", sentences: ["花儿张开花瓣。", "花儿是粉红色的。"] },
    schmetterling: { name: "蝴蝶", sentences: ["蝴蝶是黄色的。", "蝴蝶在花儿上面飞。"] },
    schnecke: { name: "蜗牛", sentences: ["蜗牛爬得慢慢的。", "蜗牛有一个粉红色的房子。"] },
    farn: { name: "蕨类", sentences: ["蕨类已经好老好老啦。", "蕨类展开一片叶子。"] },
    schachtelhalm: { name: "木贼", sentences: ["木贼弹来弹去。", "嘣！木贼晃一晃。"] },
  },
  chains: [
    ["哎呀！翼龙吓了一跳，飞了一圈。", "始祖鸟叽叽叫：祝你健康！"],
    ["咔嚓！恐龙宝宝从蛋里钻出来。", "恐龙妈妈好高兴：你好，我的小宝贝！"],
    ["副栉龙吹号：嘟嘟！", "腕龙看一看：发生什么事啦？"],
  ],
};
