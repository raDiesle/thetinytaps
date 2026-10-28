import type { SceneTranslation } from "../types";

// The farmyard-by-the-pond picture in Chinese (Mandarin, simplified characters): the title, every item's
// name and sentences and the chain sentences. Names are bare nouns, without measure word or 这/那; the dog
// Bello gets a Chinese dog's name, 豆豆, as the Russian gets Бобик.

/** „Hof am Teich“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "池塘边的农家院",
  description: "农家院池塘边的鸭子、青蛙和小猪。",
  items: {
    sonne: { name: "太阳", sentences: ["太阳出来啦！", "太阳在笑。"] },
    wolke: { name: "云朵", sentences: ["云朵下雨啦。滴答，滴答！", "下雨对植物很好。"] },
    windmuehle: { name: "风车", sentences: ["风吹着风车转。", "风车磨坊里磨面粉。"] },
    vogelscheuche: { name: "稻草人", sentences: ["稻草人晃一晃。乌鸦，快走开！", "稻草人在看守田地。"] },
    bauernhaus: { name: "农舍", sentences: ["农民一家住在农舍里。", "农妇在窗口挥手。你好！"] },
    scheune: { name: "谷仓", sentences: ["谷仓的大门打开了。", "谷仓里放着干草。", "一只燕子飞出来啦！"] },
    storch: { name: "鹳鸟", sentences: ["嗒嗒嗒！鹳鸟敲着嘴巴。", "鹳鸟住在高高的鸟窝里。"] },
    apfelbaum: { name: "苹果树", sentences: ["苹果树上长着红苹果。", "扑通！一个苹果掉下来。"] },
    schaf: { name: "绵羊", sentences: ["咩！绵羊跳起来。", "绵羊的毛软软的。"] },
    lamm: { name: "小羊", sentences: ["咩！小羊在叫妈妈。", "小羊还很小很小。"] },
    huehnerstall: { name: "鸡窝", sentences: ["母鸡们在鸡窝里睡觉。", "门开了。一个鸡蛋滚出来啦！"] },
    hahn: { name: "大公鸡", sentences: ["喔喔喔！大公鸡在打鸣。", "大公鸡把大家都叫醒了。"] },
    kuh: { name: "奶牛", sentences: ["哞！奶牛产牛奶。", "奶牛在吃草。", "叮当，铃铛在响。"] },
    ziege: { name: "山羊", sentences: ["咩咩！山羊用头顶一顶。", "山羊有胡子。"] },
    pferd: { name: "马", sentences: ["咴咴！马抬起前腿。", "马有长长的鬃毛。", "马跑得好快。"] },
    hund: { name: "小狗", sentences: ["汪汪！小狗叫豆豆。", "小狗在看家。"] },
    huhn: { name: "母鸡", sentences: ["咯咯！母鸡在啄米。", "母鸡会下蛋。"] },
    gans: { name: "大白鹅", sentences: ["嘎嘎嘎！大白鹅伸长脖子。", "大白鹅系着蓝色的蝴蝶结。"] },
    kueken: { name: "小鸡", sentences: ["叽叽！小鸡们跳呀跳。", "小鸡小小的，黄黄的。"] },
    bauer: { name: "农民", sentences: ["农民吹着口哨唱歌。", "手推车里装着蔬菜。", "你好！农民挥挥帽子。"] },
    traktor: { name: "拖拉机", sentences: ["突突突！拖拉机开走啦。", "拖拉机是红色的。", "拖拉机有大大的轮子。"] },
    heuballen: { name: "干草捆", sentences: ["干草是动物们的饲料。", "干草捆圆圆的。"] },
    katze: { name: "小猫", sentences: ["喵！小猫醒啦。", "小猫喜欢睡在干草里。"] },
    kuerbis: { name: "南瓜", sentences: ["南瓜又大又橙。", "南瓜长在菜园里。"] },
    schwein: { name: "猪", sentences: ["哼哼！猪在泥巴里玩。", "猪最喜欢泥巴啦。", "猪有一条卷卷的尾巴。"] },
    ente: { name: "鸭子", sentences: ["小脑袋钻进水里，小尾巴翘上天！", "嘎嘎！鸭子在池塘里游泳。"] },
    frosch: { name: "青蛙", sentences: ["呱！青蛙跳得高高的。", "青蛙坐在荷叶上。"] },
    bienenkorb: { name: "蜂箱", sentences: ["蜜蜂住在蜂箱里。", "嗡嗡！蜜蜂飞出来啦。"] },
    biene: { name: "蜜蜂", sentences: ["嗡嗡！蜜蜂在飞。", "蜜蜂会做蜂蜜。"] },
    blumen: { name: "花", sentences: ["草地上开满了花。", "红的、蓝的、黄的、白的。"] },
    schmetterling: { name: "蝴蝶", sentences: ["蝴蝶黄黄的，像柠檬一样。", "蝴蝶从这朵花飞到那朵花。"] },
    ferkel: { name: "小猪", sentences: ["小猪是猪的孩子。", "哼！小猪们跳起来。"] },
    hase: { name: "小兔子", sentences: ["蹦蹦跳跳！小兔子跳呀跳。", "小兔子在啃胡萝卜。"] },
    schnecke: { name: "蜗牛", sentences: ["蜗牛爬得慢慢的。", "蜗牛把房子背在背上。"] },
    maus: { name: "小老鼠", sentences: ["吱！小老鼠找到了一根麦穗。", "你好，小老鼠！"] },
  },
  chains: [
    ["母鸡咯咯叫：早上好！", "小鸡们也叽叽叫！"],
    ["小猫醒啦：喵！", "小老鼠吱吱叫：救命，有猫！"],
    ["鸭子把头伸进水里。", "鹳鸟嗒嗒嗒：青蛙在哪儿？"],
  ],
};
