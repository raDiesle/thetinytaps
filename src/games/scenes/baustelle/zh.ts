import type { SceneTranslation } from "../types";

// The Chinese words of the Baustelle picture (Mandarin, simplified characters): names, what each item says
// and the chain sentences. Names are bare nouns, without measure word or 这/那, so the engine can put them
// into its own sentences.

/** „Baustelle“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "工地",
  description: "挖掘机、起重机和自卸车在干活。",
  items: {
    sonne: { name: "太阳", sentences: ["太阳出来啦！", "太阳在笑。"] },
    wolke: { name: "云朵", sentences: ["云朵下雨啦。滴答，滴答！", "云朵白白的，软软的。"] },
    ballon: { name: "热气球", sentences: ["热气球飞得好高好高！", "呼！火苗让空气变热。"] },
    heli: { name: "直升机", sentences: ["直升机起飞啦！", "嗒嗒嗒，直升机来啦。"] },
    baum: { name: "大树", sentences: ["风吹大树，沙沙响。", "大树上长着红苹果。"] },
    eichhoernchen: { name: "松鼠", sentences: ["嗖！松鼠爬上大树。", "松鼠的尾巴毛茸茸的。"] },
    container: { name: "垃圾箱", sentences: ["碎砖碎石放进垃圾箱。", "咚！全都倒进垃圾箱。"] },
    hase: { name: "小兔子", sentences: ["快看，灌木丛里有只小兔子！", "蹦蹦跳跳，小兔子跳呀跳。"] },
    klo: { name: "厕所", sentences: ["咚咚！厕所里有人。", "这是工地的厕所。", "门开了。里面是谁呀？"] },
    bauwagen: { name: "工棚", sentences: ["工人们在工棚里休息。", "嗯，工棚里有热可可！"] },
    gabelstapler: { name: "叉车", sentences: ["叉车把箱子举高高。", "叉车上上下下！"] },
    haus: { name: "房子", sentences: ["这里在盖房子！", "一块砖，又一块砖，房子真漂亮。", "很快就有人住这儿啦。"] },
    katze: { name: "小猫", sentences: ["喵！小猫在看。", "小猫坐在墙上。"] },
    kran: { name: "起重机", sentences: ["起重机把砖头吊起来！", "起重机好高好高。", "起重机，往上，往上！"] },
    vogel: { name: "小鸟", sentences: ["叽叽喳喳！小鸟飞呀飞。", "小鸟站在起重机上。"] },
    radio: { name: "收音机", sentences: ["收音机在放音乐。啦啦啦！", "有音乐，干活更轻松。"] },
    bagger: { name: "挖掘机", sentences: ["挖掘机在挖土！", "轰隆隆！挖掘机挖了个坑。", "挖掘机是黄色的。"] },
    arbeiter: { name: "工人", sentences: ["你好！我是工人。", "工人戴着安全帽。"] },
    kabeltrommel: { name: "电缆盘", sentences: ["电缆盘滚呀滚。", "电缆盘上绕着长长的电线。"] },
    igel: { name: "刺猬", sentences: ["刺猬身上有好多刺。", "嗅嗅，嗅嗅，刺猬在闻。"] },
    karre: { name: "手推车", sentences: ["手推车滚起来啦！", "手推车里装着沙子。"] },
    schild: { name: "牌子", sentences: ["注意，工地！", "牌子说：这里在干活。"] },
    laterne: { name: "路灯", sentences: ["路灯亮了。现在好亮呀！", "天黑了，路灯就亮。"] },
    walze: { name: "压路机", sentences: ["压路机把路压得平平的。", "压路机很重，开得慢慢的。"] },
    kipper: { name: "自卸车", sentences: ["自卸车把沙子倒出来！", "小心，自卸车在倒车！"] },
    mischer: { name: "水泥搅拌车", sentences: ["水泥搅拌车转呀转！", "水泥搅拌车里装着水泥。"] },
    ampel: { name: "红绿灯", sentences: ["红灯、黄灯、绿灯！大家都可以走啦。", "红灯亮了，我们停下来。"] },
    schnecke: { name: "蜗牛", sentences: ["蜗牛爬得慢慢的。", "蜗牛把房子背在背上。"] },
    hund: { name: "小狗", sentences: ["汪汪！小狗想一起玩。", "小狗摇尾巴。"] },
    maulwurf: { name: "鼹鼠", sentences: ["你好，鼹鼠！它在地下挖隧道。", "鼹鼠从土堆里探出头。"] },
    sandhaufen: { name: "沙堆", sentences: ["铲子在铲沙子。", "沙堆里可以挖沙玩。"] },
    frosch: { name: "青蛙", sentences: ["呱！青蛙跳起来。", "青蛙是绿色的。"] },
    hammer: { name: "风镐", sentences: ["嗒嗒嗒！风镐好吵。", "工人把马路打开。"] },
    falter: { name: "蝴蝶", sentences: ["蝴蝶飞来飞去。", "蝴蝶喜欢花。"] },
    maus: { name: "小老鼠", sentences: ["吱！小老鼠住在管子里。", "你好，小老鼠！"] },
    ente: { name: "鸭子", sentences: ["嘎嘎！鸭子在水坑里玩水。", "鸭子喜欢水。"] },
    saege: { name: "锯子", sentences: ["嚓嚓嚓！锯子在锯木板。", "锯子把木头锯短。"] },
    werkzeug: { name: "工具箱", sentences: ["工具箱里有锤子、钳子和扳手。", "咔嗒！工具箱打开了。"] },
    huetchen: { name: "路锥", sentences: ["路锥跳起来！", "路锥是橙色的。"] },
    marienkaefer: { name: "瓢虫", sentences: ["瓢虫飞走啦！", "瓢虫身上有黑点点。"] },
  },
  chains: [
    ["小猫吓了一跳！", "小鸟赶快飞走啦！"],
    ["什么声音这么吵？鼹鼠探出头来。", "刺猬还是赶快跑吧。"],
    ["下雨啦！青蛙高兴得跳起来。", "鸭子在水坑里玩水。"],
  ],
};
