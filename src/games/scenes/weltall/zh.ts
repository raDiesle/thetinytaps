import type { SceneTranslation } from "../types";

// The space picture in Chinese (Mandarin, simplified characters): the title, every item's name and
// sentences and the chain sentences. Names are bare nouns, without measure word or 这/那; the UFO is 飞碟
// and the alien 外星人, never in Latin letters.

/** „Weltall“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "太空",
  description: "月球上的火箭、飞碟和行星。",
  items: {
    erde: { name: "地球", sentences: ["你好，地球！我们住在那里。", "地球在转。", "地球是蓝色和绿色的。"] },
    mars: { name: "火星", sentences: ["火星是红色的。", "火星在转。它的小月亮跟着飞。"] },
    saturn: { name: "土星", sentences: ["土星有一个光环。", "光环转呀转。", "土星眨眨眼。"] },
    sterne: { name: "星星", sentences: ["星星一闪一闪。", "一闪一闪小星星！"] },
    stern: { name: "大星星", sentences: ["大星星亮亮的。", "大星星转一转，眨眨眼。"] },
    sternschnuppe: { name: "流星", sentences: ["嗖！流星飞过去啦。", "快许个愿吧！"] },
    komet: { name: "彗星", sentences: ["彗星有一条长长的尾巴。", "嗖！彗星飞过太空。"] },
    asteroid: { name: "小行星", sentences: ["小行星在太空里翻跟头。", "咕隆，咕隆！"] },
    satellit: { name: "卫星", sentences: ["嘀嘀！卫星在发消息。", "卫星收起它的翅膀。"] },
    raumstation: { name: "空间站", sentences: ["宇航员住在空间站里。", "窗户亮了。你好！"] },
    astronaut: { name: "宇航员", sentences: ["宇航员在太空里飘。", "宇航员在跟你挥手！"] },
    ufo: { name: "飞碟", sentences: ["呜咿，呜咿！飞碟在发光。", "飞碟里坐着一个小外星人。", "飞碟飘在空中。"] },
    flagge: { name: "旗子", sentences: ["旗子在飘。", "旗子上有一颗星星。"] },
    solarzellen: { name: "太阳能板", sentences: ["太阳能板接住阳光。", "这样就有电啦。"] },
    antenne: { name: "天线", sentences: ["天线向地球问好。", "叮！天线在转。"] },
    landefaehre: { name: "登月舱", sentences: ["登月舱降落在月球上了。", "舱门打开了。谁在往外看？"] },
    mondbasis: { name: "月球基地", sentences: ["叮，咚！宇航员住在月球基地里。", "门开了，有人在挥手。", "窗户亮着灯。"] },
    rakete: { name: "火箭", sentences: ["三，二，一——发射！火箭飞起来啦。", "火箭飞得好高，又落回来。", "火箭是红白色的。"] },
    weltraumblume: { name: "太空花", sentences: ["太空花转动花朵。", "太空花在笑。亮晶晶！"] },
    gewaechshaus: { name: "温室", sentences: ["温室里长着西红柿。", "哗啦，哗啦！给植物浇水啦。"] },
    ausserirdischer: { name: "外星人", sentences: ["哔噗，啵噗！外星人说你好。", "外星人跳一跳，挥挥手。", "它有两根触角。"] },
    mondbagger: { name: "月球挖掘机", sentences: ["轰隆！月球挖掘机在挖月球土。", "月球挖掘机是黄色的。"] },
    alienbaby: { name: "外星宝宝", sentences: ["外星宝宝笑了。", "哗啦，哗啦！外星宝宝在玩。"] },
    buggy: { name: "月球车", sentences: ["月球车在月球上开。", "颠呀颠！嘀嘀！"] },
    mondhase: { name: "月亮兔", sentences: ["嘿！月亮兔跳得好高好高。", "在月球上可以跳得好高。", "月亮兔拿着一根胡萝卜。"] },
    krater: { name: "陨石坑", sentences: ["这是陨石坑。月球上的一个坑。", "嘿，嘿！石头跳起来。"] },
    roboterhund: { name: "机器狗", sentences: ["汪，嘀！机器狗在叫。", "机器狗摇摇尾巴。"] },
    kristall: { name: "水晶", sentences: ["水晶闪着蓝光。", "水晶在发光。"] },
    helm: { name: "头盔", sentences: ["躲猫猫！头盔后面住着一个小外星人。", "头盔晃一晃。"] },
    mondball: { name: "皮球", sentences: ["嘣，嘣！皮球跳起来。", "在月球上，皮球跳得好高。"] },
    kiste: { name: "箱子", sentences: ["箱子打开了。里面有什么？", "一颗星星跳出来啦！"] },
    maus: { name: "小老鼠", sentences: ["吱吱！小老鼠在啃月亮奶酪。", "小老鼠说：月亮是奶酪做的。"] },
    astronautin: { name: "女宇航员", sentences: ["女宇航员在月球上跳。", "女宇航员挥挥手。你好！"] },
    fernrohr: { name: "望远镜", sentences: ["用望远镜可以看星星。", "望远镜朝上看。"] },
    roboter: { name: "机器人", sentences: ["哔，啵，哔！机器人在说话。", "机器人举起手臂。", "机器人是蓝色的。"] },
  },
  chains: [
    ["外星人向飞碟挥手！", "外星宝宝笑着跳起来。"],
    ["望远镜里能看见土星！", "一颗彗星飞过去啦。"],
    ["月亮兔吓了一跳，跳得好高！", "小老鼠从奶酪里探出头。"],
  ],
};
