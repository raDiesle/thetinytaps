import type { SceneTranslation } from "../types";

// The zoo picture in Chinese (Mandarin, simplified characters): the title, every item's name and sentences
// and the chain sentences. Names are bare nouns, without measure word or 这/那.

/** „Zoo“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "动物园",
  description: "动物园里的狮子、大象和企鹅。",
  items: {
    sonne: { name: "太阳", sentences: ["太阳出来啦！", "太阳在笑。"] },
    wolke: { name: "云朵", sentences: ["云朵下雨啦。滴答，滴答！", "动物们都淋湿啦。"] },
    luftballon: { name: "气球", sentences: ["气球飞走啦！", "气球是红色的。"] },
    giraffe: { name: "长颈鹿", sentences: ["长颈鹿在吃树顶上的叶子。", "吧唧吧唧！长颈鹿的脖子好长。"] },
    strauss: { name: "鸵鸟", sentences: ["鸵鸟跑得好快！", "鸵鸟是一只大鸟。"] },
    zebra: { name: "斑马", sentences: ["呼！斑马跳起来。", "斑马身上有黑白条纹。"] },
    elefant: { name: "大象", sentences: ["嘟——！大象在喷水。", "大象有一条长长的鼻子。", "大象好大好大。"] },
    elefantenbaby: { name: "小象", sentences: ["小象也在喷水！", "嘟！小象扇扇耳朵。"] },
    papagei: { name: "鹦鹉", sentences: ["你好！鹦鹉会说话。", "鹦鹉是红色的，颜色好多。"] },
    affe: { name: "猴子", sentences: ["呼！猴子在绳子上荡。", "呜呜，啊啊！猴子真好玩。"] },
    aeffchen: { name: "小猴子", sentences: ["小猴子在吃香蕉。", "嗯，真好吃！小猴子拍拍手。"] },
    panda: { name: "熊猫", sentences: ["熊猫在吃竹子。", "吧唧吧唧！熊猫是黑白色的。"] },
    loewe: { name: "狮子", sentences: ["嗷——！狮子大声打哈欠。", "狮子躺在它的石头上。", "狮子有一大圈鬃毛。"] },
    loewenbaby: { name: "小狮子", sentences: ["小狮子在玩。", "小狮子轻轻地吼：嗷！"] },
    nashorn: { name: "犀牛", sentences: ["哼！犀牛跺跺脚。", "犀牛的鼻子上有一只角。"] },
    kaenguru: { name: "袋鼠", sentences: ["蹦，蹦！袋鼠在跳。", "袋鼠宝宝住在育儿袋里。"] },
    koala: { name: "考拉", sentences: ["考拉醒了，挥挥手。", "考拉喜欢在树上睡觉。"] },
    flamingo: { name: "火烈鸟", sentences: ["火烈鸟用一条腿站着。", "火烈鸟是粉红色的。"] },
    bimmelbahn: { name: "观光小火车", sentences: ["叮，叮！观光小火车开过动物园。", "小朋友们在小火车上挥手。"] },
    pfau: { name: "孔雀", sentences: ["快看！孔雀开屏啦。", "孔雀的羽毛真漂亮。"] },
    tierpfleger: { name: "饲养员", sentences: ["你好！饲养员送来吃的。", "饲养员扔出一条鱼。"] },
    taube: { name: "鸽子", sentences: ["咕咕！鸽子在啄面包屑。", "鸽子扑扑翅膀。"] },
    kind: { name: "小朋友", sentences: ["小朋友有一个冰淇淋。真好吃！", "小朋友高兴得跳起来。"] },
    eiswagen: { name: "冰淇淋车", sentences: ["叮铃，叮铃！冰淇淋车来啦。", "有草莓冰淇淋和巧克力冰淇淋。"] },
    pinguin: { name: "企鹅", sentences: ["呜——！企鹅滑进水里。", "企鹅很会游泳。"] },
    pinguinkueken: { name: "企鹅宝宝", sentences: ["企鹅宝宝摇摇摆摆地走。", "企鹅宝宝毛茸茸的。"] },
    fisch: { name: "小鱼", sentences: ["哗啦！小鱼跳出水面。", "小鱼是蓝色的。"] },
    seehund: { name: "海豹", sentences: ["嗷，嗷！海豹在玩球。", "海豹拍拍鳍。"] },
    erdmaennchen: { name: "狐獴", sentences: ["哎呀！狐獴从洞里往外看。", "狐獴在认真放哨。"] },
    schmetterling: { name: "蝴蝶", sentences: ["蝴蝶飞向花儿。", "蝴蝶是黄色的。"] },
    schildkroete: { name: "乌龟", sentences: ["乌龟躲进壳里。", "你好！它又出来啦。"] },
    krokodil: { name: "鳄鱼", sentences: ["啊呜！鳄鱼张开嘴，又合上。", "鳄鱼是绿色的。"] },
    nilpferd: { name: "河马", sentences: ["河马把嘴张得好大好大。", "咕噜！河马在河里洗澡。"] },
    pelikan: { name: "鹈鹕", sentences: ["嗖！鹈鹕抓住一条鱼。", "鹈鹕有一张大嘴巴。"] },
  },
  chains: [
    ["海豹接住了鱼。嗷，嗷！", "企鹅也赶快滑过去！"],
    ["哎呀！鸵鸟赶快跑开。", "小狮子也吼一声——轻轻的。"],
    ["小象往回喷水！", "哎呀！犀牛全身都湿啦。"],
  ],
};
