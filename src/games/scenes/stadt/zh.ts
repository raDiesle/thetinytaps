import type { SceneTranslation } from "../types";

// The town picture in Chinese (Mandarin, simplified characters): the title, every item's name and
// sentences and the chain sentences. Names are bare nouns, without measure word or 这/那.

/** „Stadt“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "城市",
  description: "城市里的公交车、消防车和面包店。",
  items: {
    sonne: { name: "太阳", sentences: ["太阳出来啦！", "太阳在笑。"] },
    wolke: { name: "云朵", sentences: ["云朵下雨啦。滴答，滴答！", "云朵白白的，软软的。"] },
    flugzeug: { name: "飞机", sentences: ["飞机翻了一个跟头！", "嗡！飞机飞过城市。"] },
    kirche: { name: "教堂", sentences: ["叮，当！钟声响了。", "塔顶上站着一只公鸡。", "大钟告诉我们几点了。"] },
    haus: { name: "房子", sentences: ["房子里住着好多人。", "灯亮了！", "你好！小朋友在窗口挥手。"] },
    katze: { name: "小猫", sentences: ["喵！小猫坐在窗边。", "小猫看着马路。"] },
    baeckerei: { name: "面包店", sentences: ["嗯，面包店有新鲜的扭结饼！", "面包师在烤面包和小面包。"] },
    feuerwache: { name: "消防站", sentences: ["这是消防站。", "大门打开了。消防车住在这里。"] },
    baum: { name: "大树", sentences: ["大树上长着红苹果。", "风吹大树，沙沙响。"] },
    vogel: { name: "小鸟", sentences: ["叽叽！小鸟在飞。", "小鸟住在树上。"] },
    schaukel: { name: "秋千", sentences: ["呼！小朋友荡得好高。", "荡过来，荡过去。"] },
    eiswagen: { name: "冰淇淋车", sentences: ["真好吃，冰淇淋！", "草莓、巧克力还是香草？"] },
    oma: { name: "奶奶", sentences: ["你好！奶奶在挥手。", "奶奶坐在长椅上。"] },
    briefkasten: { name: "邮筒", sentences: ["有你的一封信！", "邮筒是黄色的。"] },
    spatz: { name: "麻雀", sentences: ["啾！麻雀站在邮筒上。", "麻雀小小的，棕棕的。"] },
    laterne: { name: "路灯", sentences: ["路灯亮了。现在好亮呀！", "路灯在晚上发光。"] },
    hydrant: { name: "消防栓", sentences: ["消防栓里的水给消防员用。", "哗啦，哗啦！"] },
    bus: { name: "公交车", sentences: ["公交车停下来。大家上车！", "车门开了，又关上。", "嘀嘀！公交车开走啦。"] },
    polizei: { name: "警车", sentences: ["呜哇呜哇！警察来啦。", "警灯闪着蓝光。"] },
    fahrrad: { name: "自行车", sentences: ["叮铃，叮铃！自行车来啦。", "戴上头盔才安全。"] },
    enten: { name: "鸭子一家", sentences: ["嘎嘎！鸭子们过马路。", "汽车在等鸭子。"] },
    auto: { name: "小汽车", sentences: ["嘀嘀！小汽车按喇叭。", "小汽车是红色的。"] },
    feuerwehr: { name: "消防车", sentences: ["呜哇呜哇！消防车出发啦。", "云梯升得好高好高。", "消防车是红色的。"] },
    muellauto: { name: "垃圾车", sentences: ["垃圾车来收垃圾。", "把垃圾桶举起来，倒进去！"] },
    ampel: { name: "红绿灯", sentences: ["红色小人：站住别动！", "绿色小人：现在可以走啦。"] },
    muelleimer: { name: "垃圾桶", sentences: ["垃圾放进垃圾桶。", "哎呀，垃圾桶在晃！"] },
    blumen: { name: "花", sentences: ["花儿开得五颜六色。", "粉的、黄的、紫的。"] },
    falter: { name: "蝴蝶", sentences: ["蝴蝶飞来飞去。", "蝴蝶喜欢花。"] },
    roller: { name: "滑板车", sentences: ["滑板车滚起来啦！", "坐滑板车走得快。"] },
    kinderwagen: { name: "婴儿车", sentences: ["婴儿车里躺着一个小宝宝。", "小宝宝笑了。嘻嘻！"] },
    brunnen: { name: "喷泉", sentences: ["喷泉把水喷得好高！", "哗啦啦，哗啦啦！"] },
    luftballon: { name: "气球", sentences: ["气球是红色的。", "抓紧它！"] },
    hund: { name: "小狗", sentences: ["汪汪！小狗想玩。", "小狗摇尾巴。"] },
    marienkaefer: { name: "瓢虫", sentences: ["瓢虫飞走啦！", "瓢虫身上有黑点点。"] },
    taube: { name: "鸽子", sentences: ["咕咕！鸽子在啄面包屑。", "鸽子是灰色的。"] },
    maus: { name: "小老鼠", sentences: ["吱！小老鼠住在下水道里。", "你好，小老鼠！"] },
  },
  chains: [
    ["窗边的小猫弓起了背！", "小鸟赶快飞走啦！"],
    ["呜哇呜哇！消防车出发啦。", "放水！"],
    ["绿灯！鸭子们过马路。", "小汽车等一等，按喇叭：嘀嘀！"],
  ],
};
