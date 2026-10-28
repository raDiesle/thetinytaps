// Zu Hause in Chinese (Mandarin, simplified characters): the words of bear.ts, by id. The bear is „小熊“, his
// teddy „泰迪熊“; the child is „你“, and nothing is said about the child that depends on boy or girl.
// The not-so-good answers start with „嗯，“ like the German „Hmm,“.

import type { ComfortId, FeelingId } from "./bear";
import type { ComfortText, FeelingText } from "./localized";

/** The kind things in Chinese. */
export const COMFORTS_ZH: Partial<Record<ComfortId, ComfortText>> = {
  stroke: { caption: "摸一摸", narration: "你摸摸小熊。轻轻地，柔柔地。" },
  hug: { caption: "抱一抱", narration: "你紧紧地抱住小熊。" },
  teddy: { caption: "给泰迪熊", narration: "你给小熊一只泰迪熊抱抱。" },
  stomp: { caption: "跺跺脚", narration: "咚，咚！把生气都跺出去。" },
  blow: { caption: "深深吹气", narration: "深深吸一口气……再吹出来：呼——。" },
  blanket: { caption: "盖被子", narration: "你给小熊盖好被子。暖暖和和的。" },
  lullaby: { caption: "唱摇篮曲", narration: "你轻轻地唱一首摇篮曲。" },
  hand: { caption: "牵着手", narration: "你握着他的小爪子。你在这儿陪着他。" },
  light: { caption: "开灯", narration: "你把灯打开。现在亮亮的。" },
  dance: { caption: "一起跳舞", narration: "你们一起跳舞。跳呀跳！" },
  streamers: { caption: "撒彩带", narration: "你撒出五颜六色的彩带。好耶！" },
};

/** The bear's feelings in Chinese, every round with its question and its not-so-good idea. */
export const FEELINGS_ZH: Partial<Record<FeelingId, FeelingText>> = {
  sad: {
    title: "难过，在哭",
    questions: ["小熊很难过，在哭。你会怎么做？", "小熊还很难过。你会怎么做？", "小熊还有一点点难过。你会怎么做？"],
    intro: "小熊很难过。他在哭。",
    instead: [
      { caption: "推开", answer: "嗯，推人会疼。还是抱抱他吧。" },
      { caption: "弄坏玩具", answer: "嗯，现在他的玩具坏了。还是摸摸他吧。" },
      { caption: "拿走积木", answer: "嗯，现在小熊哭得更厉害了。还是把泰迪熊给他吧。" },
    ],
    end: { narration: "小熊又开心啦！", line: "谢谢！" },
    endCaption: "又开心了",
  },
  angry: {
    title: "生气，塔倒了",
    questions: ["塔倒了，小熊很生气。他可以怎么做？", "小熊还在生气。他可以怎么做？", "小熊还有一点点生气。你会怎么做？"],
    intro: "小熊很生气！他的塔倒了。",
    instead: [
      { caption: "扔玩具", answer: "嗯，扔东西会把东西摔坏。还是把生气放出来吧：用力跺跺脚！" },
      { caption: "大声喊叫", answer: "嗯，大喊大叫会让生气变得更大。还是深深地吹口气吧：呼——。" },
      { caption: "打人", answer: "嗯，打人会疼。还是抱抱他吧。" },
    ],
    end: { narration: "生气没有了。小熊又平静下来了。", line: "谢谢！" },
    endCaption: "又平静了",
  },
  tired: {
    title: "晚上困了",
    questions: ["小熊困了，在打哈欠。你会怎么做？", "小熊还没睡着。你会怎么做？", "小熊快睡着了。你会怎么做？"],
    intro: "小熊困了。他在打哈欠。",
    instead: [
      { caption: "拉走被子", answer: "嗯，没有被子小熊会冷。还是给他盖好被子吧。" },
      { caption: "大声敲鼓", answer: "嗯，这么吵小熊睡不着。还是安安静静的吧。" },
      { caption: "给他看平板", answer: "嗯，亮亮的屏幕让小熊又醒了。还是把泰迪熊给他吧。" },
    ],
    end: { narration: "小熊开开心心地睡着了。晚安！", line: "晚安……" },
    endCaption: "睡着了",
  },
  scared: {
    title: "打雷害怕",
    questions: ["打雷了，小熊很害怕。你会怎么做？", "小熊还在害怕。你会怎么做？", "好黑呀。你会怎么做？"],
    intro: "小熊很害怕。打雷了！",
    instead: [
      { caption: "“哇！”地吓他", answer: "嗯，现在小熊更害怕了。还是抱抱他吧。" },
      { caption: "丢下他一个", answer: "嗯，一个人的时候小熊更害怕。还是握着他的小爪子吧。" },
      { caption: "关灯", answer: "嗯，黑黑的，小熊更害怕了。还是把灯打开吧。" },
    ],
    end: { narration: "雷雨过去了。小熊又笑了！", line: "谢谢！" },
    endCaption: "又开心了",
  },
  happy: {
    title: "高兴，过生日",
    questions: ["小熊过生日啦！你怎么和他一起庆祝？", "小熊还在庆祝。你会怎么做？", "小熊好高兴呀。你会怎么做？"],
    intro: "小熊过生日啦！他好高兴。",
    question: "你怎么和他一起庆祝？",
    instead: [
      { caption: "弄破气球", answer: "嗯，现在他的气球破了。还是和他一起跳舞吧。" },
      { caption: "拿走礼物", answer: "嗯，这是他的礼物。现在他难过了。还是和他一起庆祝吧。" },
      { caption: "拿走蛋糕", answer: "嗯，这是他的生日蛋糕。现在他难过了。还是和他一起庆祝吧。" },
    ],
    end: { narration: "多么美好的生日呀！", line: "谢谢！太棒了！" },
    endCaption: "生日派对",
  },
};
