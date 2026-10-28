import type { SceneTranslation } from "../types";

// The Kita picture in Chinese (Mandarin, simplified characters): the title, every item's name and sentences
// and the chain sentences. Names are bare nouns, without measure word or 这/那; the many children are told
// apart by what they do („搭积木的小朋友“).

/** „Kita“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "幼儿园",
  description: "挂衣服、搭积木、听故事、吃午饭和睡午觉。",
  items: {
    wimpelkette: { name: "彩旗", sentences: ["彩色的小旗子晃来晃去。", "今天幼儿园过节啦！"] },
    bilder: { name: "图画", sentences: ["这是小朋友们画的！", "快看，一座房子、一道彩虹和一只小猫。"] },
    tuer: { name: "门", sentences: ["门开了。你好，妈妈！", "妈妈马上来接啦。"] },
    geburtstagszug: { name: "生日小火车", sentences: ["呜呜！生日小火车开啦。", "火车上有一个插着蜡烛的蛋糕。"] },
    uhr: { name: "钟", sentences: ["滴答，滴答！钟在走。", "马上就吃午饭啦。"] },
    garderobe: { name: "衣帽架", sentences: ["衣服挂在这里。", "每个小朋友的挂钩上都有一个图案：太阳、小鸭子、星星。"] },
    rucksack: { name: "小书包", sentences: ["小书包打开了。里面有一个苹果！", "小熊也一起来幼儿园。"] },
    fenster: { name: "窗户", sentences: ["窗户打开了。好新鲜的空气！", "爸爸在院子里挥手：再见！"] },
    vogel: { name: "小鸟", sentences: ["叽叽！小鸟在啄米粒。", "小鸟站在喂鸟器上。"] },
    hamster: { name: "仓鼠", sentences: ["仓鼠在轮子里跑。", "快看，它的腮帮子鼓鼓的！", "小门打开了。"] },
    schrank: { name: "手工柜", sentences: ["手工柜打开了。", "有颜料、画笔和亮片。", "快看，谁坐在颜料后面！"] },
    rollo: { name: "卷帘", sentences: ["卷帘放下来了。该睡午觉啦。", "又拉上去了。早上好！"] },
    gummistiefel: { name: "雨靴", sentences: ["啪嗒，啪嗒！雨靴在踩。", "穿上雨靴去踩水坑。"] },
    winkekinder: { name: "窗边的小朋友", sentences: ["再见，爸爸！小朋友们在挥手。", "下午见！"] },
    schlafkind: { name: "睡觉的小朋友", sentences: ["嘘——！小朋友在睡觉。", "小朋友梦见一颗星星。"] },
    kisten: { name: "玩具筐", sentences: ["玩具筐打开了。", "里面有一辆汽车、一只小鸭子和一个球。"] },
    puppenwagen: { name: "娃娃车", sentences: ["娃娃在娃娃车里摇呀摇。", "你好，娃娃！她睁开了眼睛。"] },
    trommel: { name: "小鼓", sentences: ["咚，咚！小鼓好响。", "我们敲一首歌。"] },
    spieluhr: { name: "音乐盒", sentences: ["音乐盒在放摇篮曲。", "小月亮在转。"] },
    erzieherin: { name: "老师", sentences: ["老师在讲故事。", "从前，有一只小鸭子。", "快看，下一页有一只青蛙！"] },
    junge: { name: "小男孩", sentences: ["小男孩抱着他的小熊。", "小熊也在听。"] },
    baukind: { name: "搭积木的小朋友", sentences: ["咔哒，咔哒！小朋友在搭积木。", "高高的，高高的！"] },
    maedchen: { name: "小女孩", sentences: ["小女孩拍拍手。", "这个故事真好玩！"] },
    aufwachkind: { name: "刚睡醒的小朋友", sentences: ["啊——！小朋友醒啦。", "伸一个长长的懒腰。"] },
    turm: { name: "积木塔", sentences: ["积木塔在晃。哎呀！", "积木塔好高好高。"] },
    nudelkind: { name: "吃面条的小朋友", sentences: ["啊呜！小朋友在吃面条。", "吸溜！面条不见啦。"] },
    becherkind: { name: "拿杯子的小朋友", sentences: ["咕噜，咕噜！小朋友在喝果汁。", "用吸管吹出泡泡。"] },
    kipplaster: { name: "自卸车", sentences: ["轰隆隆！自卸车开过来。", "它把积木倒出来。"] },
    bilderbuch: { name: "图画书", sentences: ["书打开了。呱！一只青蛙！", "青蛙从书里跳出来。"] },
    kuscheltier: { name: "毛绒兔", sentences: ["毛绒兔跳一跳。", "它软软的，抱着好舒服。"] },
    tisch: { name: "桌子", sentences: ["咔哒，咔哒！桌子在晃。", "我们在桌子上吃午饭。"] },
    topf: { name: "汤锅", sentences: ["嗯，汤好香呀！", "锅盖跳起来。一根胡萝卜蹦出来啦。"] },
    pudding: { name: "布丁", sentences: ["晃呀晃！布丁在晃。", "上面有一颗樱桃。"] },
    kanne: { name: "水壶", sentences: ["咕嘟，咕嘟！水倒进杯子里。", "现在杯子满啦。"] },
    xylophon: { name: "木琴", sentences: ["叮，当，咚！木琴在唱歌。", "每个音都有一种颜色。"] },
    ball: { name: "皮球", sentences: ["嘣，嘣！皮球跳起来。", "皮球的颜色真多。"] },
    spielzeugkiste: { name: "玩具箱", sentences: ["箱子打开了。嘣！一个小丑！", "小丑跳起来，挥挥手。"] },
    hausschuhe: { name: "拖鞋", sentences: ["嗒，嗒！拖鞋跳呀跳。", "在幼儿园我们穿拖鞋。"] },
  },
  chains: [
    ["爸爸也挥手：再见！", "小鸟在唱歌：叽叽！"],
    ["哎呀，积木塔在晃！小朋友接着搭。", "自卸车送来新积木。"],
    ["小朋友听着摇篮曲，做梦啦。", "毛绒兔也依偎着睡着了。"],
  ],
};
