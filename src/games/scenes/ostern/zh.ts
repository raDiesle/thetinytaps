import type { SceneTranslation } from "../types";

// The Easter picture in Chinese (Mandarin, simplified characters): the title, every item's name and
// sentences and the chain sentences. Names are bare nouns, without measure word or 这/那; the hidden eggs
// are told apart by colour („绿彩蛋“), the forsythia is simply the yellow flowering bush (黄花丛) and the
// daffodils (German „Osterglocken“, Easter bells) are 黄水仙 that ring like little bells.

/** „Ostern“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "复活节",
  description: "复活节兔子、小鸡和藏起来的彩蛋。",
  items: {
    sonne: { name: "太阳", sentences: ["太阳出来啦！", "太阳在笑。"] },
    wolke: { name: "云朵", sentences: ["云朵下雨啦。滴答，滴答！", "云朵白白的，软软的。"] },
    gartentor: { name: "院门", sentences: ["吱呀！院门打开了。", "谁来花园啦？", "门上挂着复活节花环。"] },
    mutterschaf: { name: "羊妈妈", sentences: ["咩！羊妈妈在叫小羊。", "羊妈妈的毛软软的。"] },
    laemmchen: { name: "小羊", sentences: ["小羊高兴得跳起来！", "叮铃，叮铃，小铃铛在响。", "小羊还很小。"] },
    nistkasten: { name: "鸟箱", sentences: ["谁住在鸟箱里？是山雀！", "吱吱喳！山雀在唱歌。"] },
    kirschbaum: { name: "樱桃树", sentences: ["樱桃树开了粉红色的花。", "呼！花瓣在空中飞。", "春天，树都开花啦。"] },
    amselnest: { name: "鸟窝", sentences: ["叽叽！小乌鸫们饿了。", "乌鸫妈妈叼来一条虫子。"] },
    gartenhaus: { name: "花园小屋", sentences: ["花园小屋的门打开了。", "里面是谁呀？", "园艺工具住在花园小屋里。"] },
    osterstrauch: { name: "复活节彩蛋树", sentences: ["彩蛋树上挂着彩色的蛋。", "彩蛋荡来荡去。", "你看见几个彩蛋？"] },
    schubkarre: { name: "手推车", sentences: ["手推车里装着花。", "手推车滚起来啦！"] },
    vogelbad: { name: "小鸟浴盆", sentences: ["麻雀在洗澡。哗啦，哗啦！", "浴盆里有给小鸟的水。"] },
    henne: { name: "母鸡", sentences: ["咯咯！母鸡下了一个蛋。", "母鸡坐在窝里。"] },
    maltisch: { name: "画画桌", sentences: ["在这里给鸡蛋画画。", "红、黄、蓝。鸡蛋变得五颜六色！"] },
    schokohase: { name: "巧克力兔", sentences: ["巧克力兔金光闪闪。", "叮铃！巧克力兔戴着小铃铛。", "嗯，巧克力！"] },
    forsythie: { name: "黄花丛", sentences: ["花丛开满了黄花。", "沙沙，沙沙，花丛在响。"] },
    gruenesei: { name: "绿彩蛋", sentences: ["在那儿，花丛下面！一个绿彩蛋！", "绿彩蛋滚呀滚。"] },
    hohlerbaum: { name: "老树", sentences: ["笃笃！啄木鸟在敲树。", "老树上有个洞。谁在往外看？", "树枝上长着毛茸茸的柳絮。"] },
    gelbesei: { name: "黄彩蛋", sentences: ["藏在树里：一个黄彩蛋！", "黄彩蛋晃一晃。"] },
    eikueken: { name: "小鸡", sentences: ["咔嚓！小鸡从蛋里钻出来。", "叽叽！你好，小鸡！"] },
    blauesei: { name: "蓝彩蛋", sentences: ["在花盆后面！一个蓝彩蛋！", "蓝彩蛋上有白点点。"] },
    blumentopf: { name: "花盆", sentences: ["花盆里开着报春花。", "花盆晃一晃。"] },
    tulpen: { name: "郁金香", sentences: ["郁金香开花啦。", "红的、黄的、紫的郁金香！"] },
    hummel: { name: "熊蜂", sentences: ["嗡嗡！熊蜂飞向花儿。", "熊蜂胖胖的，毛茸茸的。"] },
    bollerwagen: { name: "小拉车", sentences: ["小拉车滚起来了。", "小拉车里有彩蛋和花。"] },
    osterglocken: { name: "黄水仙", sentences: ["叮，当！黄水仙像小铃铛一样响。", "黄水仙是黄色的。"] },
    zitronenfalter: { name: "蝴蝶", sentences: ["黄蝴蝶飞来飞去。", "这只蝴蝶叫钩粉蝶。"] },
    regenwurm: { name: "蚯蚓", sentences: ["你好，蚯蚓！", "蚯蚓住在土里。"] },
    osterhase: { name: "复活节兔子", sentences: ["你好！我是复活节兔子。", "蹦蹦！复活节兔子送来彩蛋。", "复活节快乐！"] },
    gartenzwerg: { name: "花园小矮人", sentences: ["花园小矮人困了。啊——！", "花园小矮人戴着红帽子。"] },
    haeschen: { name: "小兔子", sentences: ["吧唧吧唧！小兔子在吃胡萝卜。", "小兔子动动鼻子。"] },
    korbkind: { name: "小女孩", sentences: ["好耶！我找到一个彩蛋！", "小女孩在找复活节彩蛋。"] },
    eierlauf: { name: "小男孩", sentences: ["勺子运蛋！鸡蛋在勺子上晃。", "哎呀！鸡蛋差点掉下来。"] },
    osternest: { name: "复活节篮子", sentences: ["复活节篮子里装满了彩蛋！", "篮子里还有一个巧克力蛋。"] },
    giesskanne: { name: "洒水壶", sentences: ["洒水壶给花儿浇水。", "哗啦，哗啦！给郁金香喝水。"] },
    osterei: { name: "红彩蛋", sentences: ["草地里有一个红彩蛋！", "谁从彩蛋后面探出头来？"] },
    glueckskaefer: { name: "瓢虫", sentences: ["瓢虫飞走啦！", "瓢虫是红色的，有黑点点。"] },
    pusteblume: { name: "蒲公英", sentences: ["吹一吹！种子飞走啦。", "呼——！像小小的降落伞。"] },
  },
  chains: [
    ["郁金香喝了水，开花啦。", "湿湿的！蚯蚓探出头来。"],
    ["咔嚓！小鸡从蛋里钻出来。", "复活节兔子高兴得跳起来。"],
    ["小羊听见妈妈，跳起来。", "蝴蝶飞起来啦。"],
  ],
};
