import type { SceneTranslation } from "../types";

// The airport and station picture in Chinese (Mandarin, simplified characters): the title, every item's
// name and sentences and the chain sentences. Names are bare nouns, without measure word or 这/那; the
// follow-me car is 引导车 and its English sign is told in Chinese („跟我来“).

/** „Flughafen & Bahnhof“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "机场和火车站",
  description: "机场和火车站的飞机、火车和行李传送带。",
  items: {
    sonne: { name: "太阳", sentences: ["太阳出来啦！", "太阳在笑。"] },
    wolke: { name: "云朵", sentences: ["云朵下雨啦。滴答，滴答！", "云朵白白的，软软的。"] },
    hubschrauber: { name: "直升机", sentences: ["呼呼呼！直升机在飞。", "直升机是黄色的。", "飞行员在跟你挥手。"] },
    luftschiff: { name: "飞艇", sentences: ["飞艇慢慢地飘着。", "吊舱里的人在挥手。"] },
    tower: { name: "塔台", sentences: ["塔台里坐着空管员。", "她告诉飞机什么时候可以起飞。", "雷达在转。"] },
    lichter: { name: "跑道灯", sentences: ["跑道灯给飞机指路。", "一，二，三，四，五！"] },
    flugzeug: { name: "飞机", sentences: ["飞机起飞啦！呼——！", "飞上天，又飞下来。", "人们从窗户往外看。"] },
    windsack: { name: "风向袋", sentences: ["风向袋告诉我们风从哪里来。", "呼——，风在吹！"] },
    hangar: { name: "机库", sentences: ["飞机在机库里睡觉。", "大门打开了。你好，小飞机！"] },
    hase: { name: "小兔子", sentences: ["小兔子住在机场的草地上。", "蹦蹦！小兔子跳呀跳。"] },
    signal: { name: "信号灯", sentences: ["红灯就是：停！", "现在信号灯变绿了。火车可以开啦。"] },
    speisewagen: { name: "餐车", sentences: ["餐车里有吃的。", "厨师在做煎饼。真好吃！"] },
    wagen: { name: "车厢", sentences: ["车门开了。谁下车啦？", "车厢里坐着好多人。"] },
    lok: { name: "火车", sentences: ["呜呜！火车进站啦。", "火车头是红色的。", "呜——！火车到啦。"] },
    uhr: { name: "车站大钟", sentences: ["滴答，滴答！大钟告诉我们几点了。", "火车准时到。"] },
    spatz: { name: "麻雀", sentences: ["啾！麻雀站在大钟上。", "麻雀在唱歌。"] },
    schaffner: { name: "列车员", sentences: ["吹哨子！列车员吹响哨子。", "大家请上车！", "绿色的牌子就是：出发！"] },
    tafel: { name: "显示屏", sentences: ["叮，咚！火车马上就要开了。", "显示屏上写着火车去哪儿。"] },
    reisende: { name: "旅客", sentences: ["你好！这位阿姨去度假。", "她的行李箱跟在后面滚。"] },
    automat: { name: "售票机", sentences: ["嘀嘀！这里可以买车票。", "车票出来啦！"] },
    treppenwagen: { name: "舷梯", sentences: ["人们走上舷梯，进飞机。", "舷梯升起来！"] },
    tankwagen: { name: "加油车", sentences: ["加油车给飞机送油。", "油管放出来了。"] },
    followme: { name: "引导车", sentences: ["车上写着：跟我来！", "引导车给飞机带路。"] },
    bus: { name: "公交车", sentences: ["公交车把人们送到机场。", "车门开了。上车啦！", "嘀嘀！"] },
    huetchen: { name: "路锥", sentences: ["路锥是橙色的。", "哎哟，路锥晃一晃！"] },
    einweiser: { name: "引导员", sentences: ["引导员挥着两块牌子。", "飞机，往这边！慢一点，慢一点！"] },
    taxi: { name: "出租车", sentences: ["出租车！出租车送你回家。", "嘀嘀！出租车是黄色的。"] },
    gepaeckzug: { name: "行李车", sentences: ["行李车把箱子运到飞机那儿。", "颠呀颠！箱子跳起来。"] },
    gepaeckband: { name: "行李传送带", sentences: ["箱子坐着传送带往上走。", "上，上，上！"] },
    kind: { name: "小朋友", sentences: ["小朋友在玩开飞机。嗡！", "小朋友很快就要坐飞机去度假啦。"] },
    tauben: { name: "鸽子", sentences: ["咕咕！鸽子在啄面包屑。", "扑棱，扑棱！"] },
    kofferkuli: { name: "行李推车", sentences: ["行李推车上放着箱子。", "推呀推，行李推车！"] },
    katze: { name: "小猫", sentences: ["喵！小猫坐在笼子里旅行。", "小猫往外看。"] },
    hund: { name: "小狗", sentences: ["汪汪！小狗也一起坐飞机去度假。", "小狗摇尾巴。"] },
    pilotin: { name: "女飞行员", sentences: ["女飞行员开飞机。", "你好！女飞行员在打招呼。"] },
  },
  chains: [
    ["绿灯！呜呜，火车进站啦。", "列车员吹哨子：大家上车！", "车门开了，又关上。"],
    ["引导员挥着牌子。", "飞机可以起飞啦。呼——！"],
    ["鸽子扑棱棱飞起来！", "笼子里的小猫吓了一跳：喵！"],
  ],
};
