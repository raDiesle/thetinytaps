import type { SceneTranslation } from "../types";

// The farm picture in Chinese (Mandarin, simplified characters): the title, every item's name and sentences
// and the chain sentences. Names are bare nouns, without measure word or 这/那.

/** „Bauernhof“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "农场",
  description: "农场里的奶牛、拖拉机和小猪。",
  items: {
    sonne: { name: "太阳", sentences: ["太阳出来啦！", "太阳在笑。"] },
    wolke: { name: "云朵", sentences: ["云朵下雨啦。滴答，滴答！", "下雨对花儿很好。"] },
    schwalbe: { name: "燕子", sentences: ["燕子飞得好快！", "叽叽！燕子嗖地飞过天空。"] },
    windmuehle: { name: "风车", sentences: ["风车在风里转呀转。", "风车磨坊里磨面粉。"] },
    maehdrescher: { name: "收割机", sentences: ["收割机在收麦子。", "轰隆！麦粒从上面出来啦。"] },
    bauernhaus: {
      name: "农舍",
      sentences: ["农民一家住在农舍里。", "你好！农妇在窗口挥手。", "门开了。里面是谁呀？", "灯亮了！"],
    },
    storch: { name: "鹳鸟", sentences: ["嗒嗒嗒！鹳鸟敲着嘴巴。", "鹳鸟住在高高的鸟窝里。"] },
    katze: { name: "小猫", sentences: ["喵！小猫坐在门口。", "小猫在洗脸。"] },
    scheune: { name: "谷仓", sentences: ["大门打开了。谷仓里有干草！", "谷仓又大又红。"] },
    eule: { name: "猫头鹰", sentences: ["咕咕！猫头鹰住在谷仓里。", "猫头鹰有一双大眼睛。"] },
    baum: { name: "苹果树", sentences: ["扑通！苹果掉到草地上。", "苹果树上长着红苹果。"] },
    hahn: { name: "大公鸡", sentences: ["喔喔喔！大公鸡在打鸣。", "大公鸡站在篱笆上。"] },
    pferd: { name: "马", sentences: ["驾！马抬起前腿。", "马在嘶叫。", "马是棕色的。"] },
    heuballen: { name: "干草捆", sentences: ["干草捆滚起来啦！", "干草是奶牛的饲料。"] },
    vogelscheuche: { name: "稻草人", sentences: ["稻草人晃一晃。小鸟们，快走开！", "稻草人戴着帽子。"] },
    schaf: { name: "绵羊", sentences: ["咩！绵羊跳起来。", "绵羊的毛软软的。"] },
    kuh: { name: "奶牛", sentences: ["哞！奶牛产牛奶。", "奶牛在吃草。", "叮当！铃铛响啦。"] },
    ziege: { name: "山羊", sentences: ["咩！山羊站起来啦。", "山羊有胡子。"] },
    bauer: { name: "农民", sentences: ["你好！农民在挥手。", "农民拿着干草叉。"] },
    schubkarre: { name: "手推车", sentences: ["手推车里装着南瓜。", "哎哟，南瓜跳起来啦！"] },
    gans: { name: "大白鹅", sentences: ["嘎嘎嘎！大白鹅好激动。", "大白鹅是白色的。"] },
    traktor: { name: "拖拉机", sentences: ["拖拉机突突地开走啦！", "突突突！拖拉机是红色的。", "拖拉机有大大的轮子。"] },
    hund: { name: "小狗", sentences: ["汪汪！小狗在看家。", "小狗跳起来。"] },
    pumpe: { name: "水泵", sentences: ["压一压，压一压！水来啦。", "水哗哗地流进桶里。"] },
    huhn: { name: "母鸡", sentences: ["咯咯！母鸡在啄米。", "母鸡下了一个蛋！"] },
    ente: { name: "鸭子", sentences: ["嘎嘎！鸭子在池塘里游泳。", "鸭子把头伸进水里。"] },
    hase: { name: "小兔子", sentences: ["蹦蹦！小兔子跳呀跳。", "小兔子喜欢吃胡萝卜。"] },
    schwein: { name: "猪", sentences: ["哼哼！猪在泥巴里打滚。", "猪是粉红色的。"] },
    frosch: { name: "青蛙", sentences: ["呱！青蛙跳得高高的。", "青蛙坐在荷叶上。"] },
    kueken: { name: "小鸡", sentences: ["叽叽！小鸡从蛋里出来啦。", "小鸡小小的，黄黄的。"] },
    ferkel: { name: "小猪", sentences: ["小猪是猪宝宝。", "哼！小猪跳起来。"] },
    biene: { name: "蜜蜂", sentences: ["嗡嗡！蜜蜂飞向花儿。", "蜜蜂会做蜂蜜。"] },
    schnecke: { name: "蜗牛", sentences: ["蜗牛爬得慢慢的。", "蜗牛把房子背在背上。"] },
  },
  chains: [
    ["大白鹅吓了一跳：嘎嘎嘎！", "山羊跳得高高的！"],
    ["早上好！农妇醒来啦。", "奶牛说：哞！"],
    ["小猪也跳进泥巴里！", "哎呀，母鸡全身都湿啦！"],
  ],
};
