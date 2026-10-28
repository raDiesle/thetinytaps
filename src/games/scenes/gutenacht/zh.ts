import type { SceneTranslation } from "../types";

// The bedtime picture in Chinese (Mandarin, simplified characters): the title, every item's name and
// sentences and the chain sentences. Names are bare nouns, without measure word or 这/那. Every first
// sentence wishes the thing good night („晚安，…！“), as in German.

/** „Gute Nacht“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "晚安",
  description: "大家都说晚安——直到房间黑下来。",
  items: {
    lichterkette: { name: "彩灯串", sentences: ["彩灯串亮着好多颜色。晚安，小彩灯！", "小灯一盏一盏地熄灭了。"] },
    bild: { name: "画", sentences: ["画里的太阳落山了。晚安，太阳！", "画里变成晚上啦。"] },
    mobile: { name: "床铃", sentences: ["床铃轻轻地转。晚安，床铃！", "床铃上的小月亮睡着了。"] },
    kuckucksuhr: { name: "布谷鸟钟", sentences: ["布谷！晚安，布谷鸟！", "布谷鸟回到小房子里。"] },
    mond: { name: "月亮", sentences: ["月亮打哈欠：啊——！晚安，月亮！", "月亮戴着睡帽。"] },
    sterne: { name: "星星", sentences: ["星星一闪一闪。晚安，星星！", "一闪一闪小星星。"] },
    gluehwuermchen: { name: "萤火虫", sentences: ["萤火虫在发光。晚安，萤火虫！", "嗡嗡！它们在转圈圈飞。"] },
    eule: { name: "猫头鹰", sentences: ["咕咕！晚安，猫头鹰！", "猫头鹰闭上大眼睛。"] },
    vorhang: { name: "窗帘", sentences: ["窗帘拉上了。晚安，窗帘！", "窗帘轻轻地飘。"] },
    schlafanzug: { name: "睡衣", sentences: ["睡衣在挂钩上荡呀荡。晚安，睡衣！", "睡衣是蓝色的，上面有星星。"] },
    nachtlicht: { name: "小夜灯", sentences: ["小夜灯亮一整夜。晚安，小夜灯！", "小夜灯守着大家。"] },
    maus: { name: "小老鼠", sentences: ["吱！晚安，小老鼠！", "小老鼠钻进洞里，缩成一团。"] },
    tuer: { name: "门", sentences: ["门留了一条缝。晚安，门！", "走廊里又亮又暖和。"] },
    mama: { name: "妈妈", sentences: ["妈妈说：晚安，睡个好觉！", "妈妈送来一个飞吻。"] },
    goldfisch: { name: "金鱼", sentences: ["咕噜！晚安，小金鱼！", "金鱼在转圈圈游。"] },
    buch: { name: "故事书", sentences: ["故事书打开了。晚安，故事书！", "从前，有一只小绵羊……"] },
    spieluhr: { name: "音乐盒", sentences: ["音乐盒在放摇篮曲。晚安，音乐盒！", "叮，咚。轻轻的。"] },
    puppenhaus: { name: "娃娃屋", sentences: ["娃娃屋里的灯熄了。晚安，娃娃们！", "娃娃屋的门开了，又关上。"] },
    nachttisch: { name: "床头柜", sentences: ["抽屉打开了。晚安，床头柜！", "里面有一只袜子！"] },
    lampe: { name: "台灯", sentences: ["咔嗒！台灯关了。晚安，台灯！", "现在好舒服呀。"] },
    wecker: { name: "闹钟", sentences: ["滴答，滴答！晚安，闹钟！", "明天早上闹钟叫我们起床。"] },
    bett: { name: "小床", sentences: ["小床软软的。晚安，小床！", "床上的星星一闪一闪。"] },
    decke: { name: "小被子", sentences: ["小被子暖暖的。晚安，小被子！", "一起一伏。小被子也在呼吸。"] },
    kind: { name: "小朋友", sentences: ["小朋友打哈欠：啊——！晚安！", "小朋友挥挥手，钻进被窝。"] },
    teddy: { name: "小熊", sentences: ["小熊挥挥手。晚安，小熊！", "小熊陪着小朋友睡觉。"] },
    teppich: { name: "地毯", sentences: ["地毯软软的。晚安，地毯！", "地毯上的星星一闪一闪。"] },
    hase: { name: "小兔子", sentences: ["小兔子嗅一嗅。晚安，小兔子！", "长耳朵耷拉下来了。"] },
    bausteine: { name: "积木", sentences: ["积木晃一晃。晚安，积木！", "高塔没倒。呼！"] },
    katze: { name: "小猫", sentences: ["喵！小猫打哈欠。晚安，小猫！", "小猫在小篮子里蜷成一团。"] },
    schaukelpferd: { name: "摇摇马", sentences: ["摇摇马摇呀摇。晚安，小马！", "驾！现在慢慢地摇。"] },
    eisenbahn: { name: "小火车", sentences: ["嘟嘟！小火车要去睡觉啦。晚安，小火车！", "轮子慢慢地转。"] },
    ball: { name: "皮球", sentences: ["皮球又跳了一下。晚安，皮球！", "嘿！现在它不动啦。"] },
    puppenwagen: { name: "娃娃车", sentences: ["娃娃车摇呀摇。晚安，娃娃！", "娃娃在车里睡觉。"] },
    roboter: { name: "机器人", sentences: ["嘀，哔！晚安，机器人！", "机器人的眼睛灭了。"] },
    kreisel: { name: "陀螺", sentences: ["陀螺在转。晚安，陀螺！", "它转得越来越慢。"] },
    schaf: { name: "小绵羊", sentences: ["咩！晚安，小绵羊！", "小绵羊在数星星。"] },
    elefant: { name: "大象", sentences: ["嘟——，轻轻的！晚安，大象！", "大象扇扇耳朵。"] },
    hausschuhe: { name: "拖鞋", sentences: ["拖鞋跳到床前。晚安，拖鞋！", "小兔耳朵晃呀晃。"] },
    taschenlampe: { name: "手电筒", sentences: ["咔嗒！手电筒关了。晚安，手电筒！", "现在黑黑的，好舒服。"] },
    spielzeugkiste: { name: "玩具箱", sentences: ["啪！玩具箱关上了。晚安，玩具们！", "全都收拾好啦。"] },
  },
  chains: [
    ["床铃跟着音乐转。", "小朋友打哈欠：啊——！"],
    ["小猫听见猫头鹰，打了个哈欠。", "小老鼠钻进洞里，缩成一团。"],
    ["妈妈关灯。咔嗒！", "小熊也钻进被窝。"],
  ],
};
