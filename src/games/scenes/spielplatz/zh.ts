import type { SceneTranslation } from "../types";

// The playground picture in Chinese (Mandarin, simplified characters): the title, every item's name and
// sentences and the chain sentences. Names are bare nouns, without measure word or 这/那; the German
// rhymes become short Chinese ones.

/** „Spielplatz“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "游乐场",
  description: "滑梯、秋千、跷跷板和沙坑。",
  items: {
    sonne: { name: "太阳", sentences: ["太阳出来啦！", "太阳在笑。"] },
    wolke: { name: "云朵", sentences: ["云朵下雨啦。滴答，滴答！", "云朵白白的，软软的。"] },
    flugzeug: { name: "飞机", sentences: ["飞机在高高的天上飞。", "嗡！螺旋桨在转。", "女飞行员摇摇机翼打招呼。"] },
    drachen: { name: "风筝", sentences: ["风筝在风里飞！", "呼！风筝飞来飞去。", "风筝有一条长长的尾巴。"] },
    luftballon: { name: "气球", sentences: ["红气球飞走啦！", "气球往上飘。"] },
    opa: { name: "爷爷", sentences: ["爷爷在看报纸。", "你好，爷爷！爷爷抬抬帽子。", "爷爷坐在长椅上。"] },
    muelleimer: { name: "垃圾桶", sentences: ["咔嗒！垃圾桶打开了。", "垃圾放进垃圾桶。"] },
    eiswagen: { name: "冰淇淋车", sentences: ["叮铃，叮铃！冰淇淋车来啦。", "嗯，草莓冰淇淋！", "卖冰淇淋的叔叔在挥手。"] },
    baum: { name: "大树", sentences: ["风吹大树，沙沙响。", "大树上长着红苹果。", "大树又高又绿。"] },
    vogel: { name: "小鸟", sentences: ["叽叽！小鸟在飞。", "小鸟站在树枝上。"] },
    eichhoernchen: { name: "松鼠", sentences: ["嗖！松鼠爬上大树。", "松鼠在啃坚果。"] },
    schaukel: { name: "秋千", sentences: ["呼！秋千荡得好高。", "荡过来，荡过去，一点都不难！", "吱呀，吱呀，秋千在响。"] },
    kletterturm: { name: "攀爬塔", sentences: ["啊嗬！这是一艘海盗船。", "梯子通到塔顶上。", "谁在窗口往外看？"] },
    rutsche: { name: "滑梯", sentences: ["呼！从滑梯滑下来！", "滑梯黄黄的，滑滑的。", "再滑一次！"] },
    katze: { name: "小猫", sentences: ["喵！小猫坐在屋顶上。", "小猫在舔爪子。"] },
    seifenblasen: { name: "肥皂泡", sentences: ["呼！好多肥皂泡飞起来。", "肥皂泡闪着彩色的光。", "啪！肥皂泡破啦。"] },
    wippe: { name: "跷跷板", sentences: ["跷跷板上上下下！", "跷跷板上坐着两个小朋友。", "上，下，好耶！"] },
    karussell: { name: "转盘", sentences: ["转盘转呀转！", "小朋友们抓得紧紧的。", "转呀转，转圈圈！"] },
    hund: { name: "小狗", sentences: ["汪汪！小狗想一起玩。", "小狗摇尾巴。"] },
    schaukelpferd: { name: "摇摇马", sentences: ["驾，驾！摇摇马摇起来。", "小马有紫色的鬃毛。", "嘚嘚嘚，小马快快跑！"] },
    ball: { name: "皮球", sentences: ["嘣！皮球跳得好高。", "皮球是红色、蓝色和黄色的。"] },
    mama: { name: "妈妈", sentences: ["妈妈推着婴儿车。", "你好！妈妈在挥手。"] },
    kinderwagen: { name: "婴儿车", sentences: ["婴儿车里躺着一个小宝宝。", "小宝宝笑着摇拨浪鼓。", "婴儿车滚起来了。"] },
    tauben: { name: "鸽子", sentences: ["咕咕！鸽子在啄面包屑。", "鸽子在找吃的。"] },
    roller: { name: "滑板车", sentences: ["嗖！滑板车冲出去啦。", "用脚蹬一蹬，出发！"] },
    laufrad: { name: "平衡车", sentences: ["平衡车滚起来了。跑呀跑！", "叮铃，叮铃！平衡车的车铃。", "小朋友戴着头盔。"] },
    pumpe: { name: "水泵", sentences: ["压一压，压一压！水来啦。", "哗啦啦！水流进小溪里。"] },
    sandburg: { name: "沙堡", sentences: ["这是一座沙堡！", "城门打开了。谁住在里面？", "旗子在沙堡上飘。"] },
    kind: { name: "小朋友", sentences: ["小朋友在挖沙子。", "嘻嘻！沙子飞起来。", "小朋友戴着遮阳帽。"] },
    schnecke: { name: "蜗牛", sentences: ["蜗牛爬得慢慢的。", "蜗牛把房子背在背上。"] },
    blumen: { name: "花", sentences: ["花儿开得五颜六色。", "花儿在风里点头。"] },
    schmetterling: { name: "蝴蝶", sentences: ["蝴蝶飞来飞去。", "蝴蝶喜欢花。"] },
    marienkaefer: { name: "瓢虫", sentences: ["瓢虫飞走啦！", "瓢虫身上有黑点点。"] },
    eimer: { name: "小桶", sentences: ["小桶倒了。沙子流出来啦！", "小桶是红色的。"] },
    bagger: { name: "玩具挖掘机", sentences: ["小挖掘机在挖沙子。", "轰隆隆！挖掘机是黄色的。"] },
    foermchen: { name: "沙模", sentences: ["我们用沙模做沙子蛋糕。", "一颗星星、一条鱼和一颗爱心！"] },
  },
  chains: [
    ["小猫吓了一跳！", "小鸟赶快飞走啦！"],
    ["冰淇淋！平衡车快快开过去。", "滑板车也跟着冲过去！"],
    ["下雨啦！蜗牛好高兴。", "快，婴儿车的车篷合上啦。"],
  ],
};
