import type { SceneTranslation } from "../types";

// The winter building site picture in Chinese (Mandarin, simplified characters): the title, every item's
// name and sentences and the chain sentences. Names are bare nouns, without measure word or 这/那, the same
// as in the Baustelle and Winter pictures where the item is the same.

/** „Winter-Baustelle“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "冬天的工地",
  description: "雪地工地上的扫雪车、雪人和雪橇。",
  items: {
    sonne: { name: "太阳", sentences: ["冬天的太阳出来啦！", "太阳在笑，可是天好冷。"] },
    schneewolke: { name: "雪云", sentences: ["雪云下雪啦！", "雪花轻轻地飘下来。", "雪云白白的，软软的。"] },
    heli: { name: "直升机", sentences: ["直升机飞过雪地。", "嗒嗒嗒，直升机来啦。"] },
    hase: { name: "小兔子", sentences: ["快看，盖着雪的灌木丛里有只小兔子！", "蹦蹦跳跳，小兔子跳呀跳。"] },
    klo: { name: "厕所", sentences: ["咚咚！厕所里有人。", "厕所顶上有雪。", "门开了。里面是谁呀？"] },
    bauwagen: { name: "工棚", sentences: ["工棚里暖暖的。", "嗯，工棚里有热可可！", "工棚上亮着一串彩灯。"] },
    schneetanne: { name: "冷杉", sentences: ["冷杉抖一抖。雪掉下来啦！", "冬天，冷杉还是绿的。", "扑通！好多好多雪。"] },
    eichhoernchen: { name: "松鼠", sentences: ["松鼠坐在冷杉上。", "松鼠在啃它藏起来的坚果。"] },
    container: { name: "垃圾箱", sentences: ["垃圾箱里装满了雪。", "咚！雪滑下来了。"] },
    gabelstapler: { name: "叉车", sentences: ["叉车把箱子举高高。", "上上下下，下雪也不怕！"] },
    iglu: { name: "冰屋", sentences: ["冰屋是用雪做的。", "谁住在冰屋里？你好！", "冰屋里的灯亮了。"] },
    haus: { name: "房子", sentences: ["这里在盖房子，冬天也在盖！", "房子上有雪。", "很快就有人住这儿啦。"] },
    eiszapfen: { name: "冰柱", sentences: ["窗户上挂着冰柱。", "冰柱亮晶晶。滴答，滴答！", "冰柱又冷又滑。"] },
    katze: { name: "小猫", sentences: ["喵！小猫的爪子好冷。", "小猫坐在雪地里的墙上。"] },
    kran: { name: "起重机", sentences: ["起重机把砖头吊起来！", "起重机上有雪。", "起重机，往上，往上！"] },
    weihnachtsbaum: { name: "圣诞树", sentences: ["起重机顶上有一棵圣诞树！", "圣诞树上的灯一闪一闪。", "星星亮晶晶。"] },
    radio: { name: "收音机", sentences: ["收音机在放冬天的歌。啦啦啦！", "有音乐，我们就暖和啦。"] },
    bagger: { name: "挖掘机", sentences: ["挖掘机在铲雪！", "轰隆隆！挖掘机堆了一座雪山。", "挖掘机是黄色的。"] },
    karre: { name: "手推车", sentences: ["手推车滚起来啦！", "手推车里装着雪。"] },
    schild: { name: "牌子", sentences: ["注意，工地！", "注意，路很滑！"] },
    teearbeiter: { name: "工人", sentences: ["工人在喝热茶。吹一吹！", "他戴着一顶暖和的帽子。", "在火旁边，手就暖和啦。"] },
    feuertonne: { name: "火桶", sentences: ["火桶里烧着火。", "噼啪，噼啪！火好暖和。", "别碰，好烫！"] },
    vogelhaus: { name: "喂鸟屋", sentences: ["喂鸟屋里有给小鸟的谷粒。", "鸟食球荡呀荡。"] },
    meise: { name: "山雀", sentences: ["叽！山雀在啄谷粒。", "山雀的头是蓝色的，肚子是黄色的。"] },
    schneeschaufel: { name: "雪铲", sentences: ["我们用雪铲铲雪。", "嘿哟！雪飞起来。"] },
    laterne: { name: "路灯", sentences: ["路灯亮了。冬天，天黑得早。", "路灯戴着一顶雪帽子。"] },
    streuwagen: { name: "撒盐车", sentences: ["撒盐车往路上撒盐。", "现在路不滑了。", "圆盘转得好快。"] },
    kipper: { name: "自卸车", sentences: ["自卸车把雪运走！", "小心，自卸车在倒雪！"] },
    schneepflug: { name: "扫雪车", sentences: ["扫雪车把雪推开！", "轰隆！扫雪车把路扫干净。", "扫雪车是橙色的。"] },
    winterfuchs: { name: "狐狸", sentences: ["嘿！狐狸跳进雪里。", "狐狸听见雪下面有一只老鼠。", "狐狸的尾巴毛茸茸的。"] },
    schlitten: { name: "雪橇", sentences: ["好耶！小朋友在坐雪橇。", "雪橇在雪地里飞快地跑。", "叮铃铃，铃铛在响。"] },
    rotkehlchen: { name: "知更鸟", sentences: ["知更鸟在雪地里跳。", "嘀哩哩！知更鸟在唱歌。"] },
    schneemann: { name: "雪人", sentences: ["你好，雪人！", "雪人的鼻子是胡萝卜做的。", "雪人摘下帽子。"] },
    schneeballkinder: { name: "打雪仗的小朋友", sentences: ["小朋友们在打雪仗！", "啪！没打中！", "小朋友们在笑。"] },
    hund: { name: "小狗", sentences: ["汪汪！小狗在雪地里玩。", "小狗摇尾巴。"] },
    fussspuren: { name: "脚印", sentences: ["雪地里有脚印。是谁留下的？", "咯吱，咯吱！雪地里的脚印。"] },
    huetchen: { name: "路锥", sentences: ["路锥跳起来！", "路锥戴着一顶雪帽子。"] },
    maus: { name: "小老鼠", sentences: ["吱！小老鼠住在管子里。", "小老鼠说，管子里很暖和。"] },
  },
  chains: [
    ["撒盐车来了，在撒盐。", "自卸车把雪运走。"],
    ["是谁呀？是狐狸！嘿，它跳进雪里。", "小老鼠赶快躲进管子里。"],
    ["知更鸟吓了一跳，跳走了。", "扑通！路锥晃一晃。"],
  ],
};
