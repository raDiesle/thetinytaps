// Im Kindergarten in Chinese (Mandarin, simplified characters): the words of kita.ts, by story id, beat for beat
// and step for step (the sounds stay the German beats'). 小熊 the bear, 小狐狸 the fox, 小兔子 the hare, 小刺猬 the
// hedgehog, 老师 the kindergarten teacher, and 大熊 who brings 小熊. Nothing is said about the child that depends on
// boy or girl; the not-so-good answers start with „嗯，“.

import type { SituationId } from "./kita";
import type { SituationText } from "./localized";

/** The kindergarten stories in Chinese. */
export const SITUATIONS_ZH: Partial<Record<SituationId, SituationText>> = {
  push: {
    title: "被推了",
    caption: "小狐狸推小熊",
    intro: [{ narration: "小熊在外面玩。" }, { narration: "小狐狸推了小熊一下。哎哟！" }],
    steps: [
      {
        caption: "说“停！”",
        question: "小狐狸推小熊。小熊可以怎么做？",
        beats: [{ narration: "小熊大声说：", line: "停！不要！我不喜欢这样！" }],
        instead: { caption: "推回去", answer: "嗯，那样会更疼。还是大声说：停！" },
      },
      {
        caption: "走开",
        question: "小狐狸还在这儿。小熊可以怎么做？",
        beats: [{ narration: "然后他走开，离小狐狸远一点。" }],
        instead: { caption: "扔沙子", answer: "嗯，沙子进了眼睛会疼。还是走开吧。" },
      },
      {
        caption: "找老师",
        question: "小熊需要帮助。他可以怎么做？",
        beats: [{ narration: "他去找老师。", line: "小狐狸推我！" }, { line: "停下，小狐狸。推人会疼。" }, { line: "对不起，小熊。" }],
        instead: { caption: "弄坏小桶", answer: "嗯，现在小桶坏了，小狐狸也哭了。还是去找人帮忙吧。" },
      },
    ],
    outro: [{ narration: "太棒了！说停，走开，找人帮忙。" }],
    endCaption: "小熊和小狐狸又开心了",
  },
  kick: {
    title: "被踢了",
    caption: "小狐狸踢小熊",
    intro: [{ narration: "小熊和小狐狸在外面。" }, { narration: "小狐狸踢了小熊的腿。哎哟！" }],
    steps: [
      {
        caption: "说“停！”",
        question: "小狐狸踢小熊。小熊可以怎么做？",
        beats: [{ narration: "小熊大声说：", line: "停！不许踢！" }],
        instead: { caption: "踢回去", answer: "嗯，那样两个都会疼。还是大声说：停！" },
      },
      {
        caption: "走开",
        question: "小狐狸还在这儿。小熊可以怎么做？",
        beats: [{ narration: "他走开几步。" }],
        instead: { caption: "揪耳朵", answer: "嗯，揪耳朵也会疼。还是走开吧。" },
      },
      {
        caption: "叫老师",
        question: "小熊需要帮助。他可以怎么做？",
        beats: [{ narration: "他叫老师。", line: "救命！小狐狸踢我。" }, { line: "小狐狸，踢人会疼。我们不这样做。" }, { line: "对不起。" }],
        instead: { caption: "扔掉帽子", answer: "嗯，那样小狐狸会难过，还会吵架。还是叫老师吧。" },
      },
    ],
    outro: [{ narration: "真好！说停，离远一点，找人帮忙。" }],
    endCaption: "小熊和小狐狸又开心了",
  },
  grab: {
    title: "被拿走了",
    caption: "小狐狸拿走拖拉机",
    intro: [{ narration: "小熊在玩他的拖拉机。" }, { narration: "小狐狸一下子就把拖拉机拿走了！" }, {}],
    steps: [
      {
        caption: "说“这是我的！”",
        question: "小狐狸拿走拖拉机。小熊可以怎么做？",
        beats: [{ narration: "小熊大声说：", line: "停！这是我的拖拉机！" }],
        instead: { caption: "把拖拉机抢回来", answer: "嗯，那样两个都在拉，会吵架的。还是说：停，这是我的！" },
      },
      {
        caption: "请他还回来",
        question: "拖拉机还在小狐狸那儿。小熊可以怎么做？",
        beats: [{ line: "请还给我。" }, { line: "给你。对不起。" }, {}],
        instead: { caption: "打人", answer: "嗯，打人会疼。还是说：请还给我。" },
      },
      {
        caption: "一起玩",
        question: "小熊拿回了拖拉机。他可以怎么做？",
        beats: [{ line: "你想一起玩吗？小桶给你玩。" }, { line: "好呀！" }],
        instead: { caption: "赶走他", answer: "嗯，现在小狐狸一个人，好难过。还是问一问：你想一起玩吗？" },
      },
    ],
    outro: [{ narration: "真棒！要是他不还给你，就去找老师。" }],
    endCaption: "小熊举起拖拉机，小狐狸拍手",
  },
  slide: {
    title: "滑梯排满了",
    caption: "滑梯上排满了，小熊想马上滑",
    intro: [{ narration: "大家都想滑滑梯。" }, { narration: "小熊想马上就滑。可是滑梯上排满了！" }],
    steps: [
      {
        caption: "排队",
        question: "滑梯上排满了。小熊可以怎么做？",
        beats: [{ narration: "他到后面排队。", line: "小狐狸后面就轮到我。" }],
        instead: { caption: "插队", answer: "嗯，在滑梯上会有人摔下来。还是到后面排队吧。" },
      },
      {
        caption: "等一等",
        question: "小熊在排队。他可以怎么做？",
        beats: [{ narration: "他等着。先是小兔子滑……" }, { narration: "……然后是小狐狸。" }],
        instead: { caption: "又哭又闹", answer: "嗯，大喊大叫也不会快一点。还是等一等，马上就轮到你了。" },
      },
      {
        caption: "滑下来",
        question: "轮到小熊了。他可以怎么做？",
        beats: [{ narration: "现在轮到小熊啦！" }, { line: "耶——！" }],
        instead: { caption: "坐在上面不下来", answer: "嗯，那样谁都滑不了。还是滑下来吧，下一个就能滑了。" },
      },
    ],
    outro: [{ narration: "等得真好！每个人都会轮到。" }],
    endCaption: "小熊、小狐狸和小兔子在欢呼",
  },
  want: {
    title: "也想要",
    caption: "小兔子在玩小汽车，小熊也想要",
    intro: [{ narration: "小兔子在玩一辆很棒的小汽车。" }, { narration: "小熊也想要这辆小汽车！" }],
    steps: [
      {
        caption: "问一问",
        question: "小熊想要小汽车。他可以怎么做？",
        beats: [{ narration: "他问：", line: "我也可以玩一下吗？" }, { line: "等一下。我还在玩。" }],
        instead: { caption: "抢走小汽车", answer: "嗯，那样小兔子会难过。还是问一问：我也可以玩一下吗？" },
      },
      {
        caption: "等一等，玩皮球",
        question: "小兔子还在玩。小熊可以怎么做？",
        beats: [{ narration: "小熊等着。等的时候他玩皮球。" }],
        instead: { caption: "冲他大喊", answer: "嗯，大喊会让小兔子难过。还是等一等，先玩一会儿皮球吧。" },
      },
      {
        caption: "换一换",
        question: "小熊拿着皮球。他可以怎么做？",
        beats: [{ line: "现在给你玩。我们换一换好吗？" }, { line: "好！谢谢！" }],
        instead: { caption: "全都自己留着", answer: "嗯，现在小兔子什么都没有了。还是换一换吧：小汽车换皮球。" },
      },
    ],
    outro: [{ narration: "真好！问一问，等一等，换一换。" }],
    endCaption: "小熊开小汽车，小兔子拿着皮球",
  },
  angry: {
    title: "自己生气了",
    caption: "小狐狸推倒了塔，小熊很生气",
    intro: [{ narration: "小熊在搭一座高高的塔。" }, { narration: "哗啦！小狐狸把塔推倒了。小熊好——生气。他想推人！" }],
    steps: [
      {
        caption: "跺跺脚",
        question: "小熊很生气。他可以怎么做？",
        beats: [{ narration: "可他不推人，他跺跺脚。咚，咚！" }],
        instead: { caption: "推人", answer: "嗯，推人会疼。还是把生气放出来吧：用力跺跺脚！" },
      },
      {
        caption: "深深吹气",
        question: "小熊还在生气。他可以怎么做？",
        beats: [{ narration: "他深深吸一口气，再吹出来：呼——。" }],
        instead: { caption: "踢倒塔", answer: "嗯，现在小狐狸也哭了。还是深深地吹口气吧：呼——。" },
      },
      {
        caption: "说“我生气了！”",
        question: "小熊还有一点点生气。他可以怎么做？",
        beats: [{ narration: "然后他说：", line: "我生气了！我的塔倒了！" }, { line: "哎呀，对不起！我来帮你。" }, {}],
        instead: { caption: "打人", answer: "嗯，打人会疼。还是说：我生气了！" },
      },
    ],
    outro: [{ narration: "真棒！生气没关系。跺跺脚，吹吹气，说出来——不打人。" }],
    endCaption: "塔又搭好了，两个都在笑",
  },
  bye: {
    title: "门口说再见",
    caption: "小熊紧紧拉着大熊",
    intro: [{ narration: "小熊来到幼儿园。" }, { narration: "大熊现在要走了。小熊哭了。他不想让大熊走！" }],
    steps: [
      {
        caption: "紧紧抱抱",
        question: "大熊要走了。小熊可以怎么做？",
        beats: [{ narration: "小熊紧紧地抱住大熊。", line: "再见！我爱你！" }, { line: "我待会儿来接你。" }],
        instead: { caption: "追出去", answer: "嗯，外面有汽车，很危险。还是紧紧抱抱他，说再见吧。" },
      },
      {
        caption: "在窗边挥手",
        question: "大熊现在走了。小熊可以怎么做？",
        beats: [{ narration: "然后他在窗边挥手。", line: "再见！" }, { narration: "大熊也向他挥手。" }],
        instead: { caption: "躲起来", answer: "嗯，一个人躲着好难过。还是在窗边挥挥手吧。" },
      },
      {
        caption: "一起玩",
        question: "小熊还很难过。他可以怎么做？",
        beats: [{ line: "来，我们和小狐狸一起搭塔吧。" }, { narration: "小熊不哭了。他和大家一起玩。" }],
        instead: { caption: "一个人待在角落", answer: "嗯，一个人待在角落好无聊。还是一起玩吧。" },
      },
    ],
    outro: [{ narration: "太棒了！抱一抱，挥挥手，一起玩。待会儿大熊就回来了。" }],
    endCaption: "来接了，两个都很开心",
  },
  new: {
    title: "新来的小朋友",
    caption: "小刺猬是新来的，一个人",
    intro: [{ narration: "今天来了一位新朋友：小刺猬。" }, { narration: "他一个人站在门口。他很害羞。" }],
    steps: [
      {
        caption: "说“你好！”",
        question: "小刺猬是新来的，一个人。小熊可以怎么做？",
        beats: [{ narration: "小熊走过去挥挥手。", line: "你好！我是小熊。" }, { line: "你好。我是小刺猬。" }],
        instead: { caption: "笑话他", answer: "嗯，现在小刺猬难过了。还是说：你好！" },
      },
      {
        caption: "给他看积木",
        question: "小刺猬还很害羞。小熊可以怎么做？",
        beats: [{ line: "看，积木在这儿。" }, { narration: "小刺猬看着。他露出一点点笑容。" }],
        instead: { caption: "把积木藏起来", answer: "嗯，这样小刺猬就不能一起玩了。还是给他看看积木吧。" },
      },
      {
        caption: "让他一起玩",
        question: "小刺猬想一起玩。小熊可以怎么做？",
        beats: [{ line: "你想一起玩吗？" }, { line: "想！" }],
        instead: { caption: "只和小狐狸玩", answer: "嗯，现在小刺猬一个人了。还是问问他：你想一起玩吗？" },
      },
    ],
    outro: [{ narration: "真棒！说你好，给他看，让他一起玩。现在小刺猬有朋友了。" }],
    endCaption: "小熊、小狐狸和小刺猬在欢呼",
  },
  fall: {
    title: "摔倒了",
    caption: "小熊摔倒了，膝盖疼",
    intro: [{ narration: "小熊跑得好快。" }, { narration: "扑通！他摔倒了。哎哟，膝盖好疼！" }],
    steps: [
      {
        caption: "喊人帮忙",
        question: "小熊摔倒了。他可以怎么做？",
        beats: [{ narration: "小熊喊：", line: "哎哟！救命！" }, { line: "我来了！给我看看。" }],
        instead: { caption: "又踢又叫", answer: "嗯，这样谁也帮不了他。还是叫老师吧。" },
      },
      {
        caption: "贴创可贴",
        question: "老师有创可贴。小熊会怎么做？",
        beats: [{ narration: "老师贴上创可贴，再吹一吹。" }, { line: "好了。马上就不疼了。" }],
        instead: { caption: "撕掉创可贴", answer: "嗯，那样又会疼。还是留着创可贴吧。" },
      },
      {
        caption: "慢慢接着玩",
        question: "膝盖不疼了。小熊可以怎么做？",
        beats: [{ narration: "小狐狸扶他起来。", line: "来，我们慢慢玩。" }, { narration: "他们互相滚皮球。" }],
        instead: { caption: "马上疯跑", answer: "嗯，那样他马上又会摔倒。还是先慢慢玩吧。" },
      },
    ],
    outro: [{ narration: "太棒了！喊人帮忙，贴上创可贴，慢慢接着玩。疼很快就会过去。" }],
    endCaption: "小熊骄傲地给大家看创可贴",
  },
  stop: {
    title: "不停下来",
    caption: "小狐狸挠痒痒，小熊不想玩了",
    intro: [{ narration: "小狐狸给小熊挠痒痒。一开始很好玩。" }, { narration: "可是现在小熊不想玩了。小狐狸却不停下来！" }],
    steps: [
      {
        caption: "说“停！”",
        question: "小狐狸不停下来。小熊可以怎么做？",
        beats: [
          { narration: "小熊大声说：", line: "停！我不想玩了！" },
          { narration: "小狐狸停下来了。", line: "哦。好吧。" },
        ],
        instead: { caption: "咬人", answer: "嗯，咬人会疼。还是大声说：停！我不喜欢这样！" },
      },
      {
        caption: "提议玩抓人",
        question: "小狐狸停下来了。小熊可以怎么做？",
        beats: [{ line: "我们来玩抓人游戏好吗？" }, { line: "好呀！" }],
        instead: { caption: "挠回去", answer: "嗯，现在小狐狸不想要了。停就是停，对谁都一样。还是问一问：我们玩抓人游戏好吗？" },
      },
      {
        caption: "玩抓人游戏",
        question: "两个都想玩抓人游戏。小熊可以怎么做？",
        beats: [{ narration: "他们又跑又笑。", line: "来抓我呀！" }],
        instead: { caption: "生气地走开", answer: "嗯，现在两个都是一个人了。还是一起玩抓人游戏吧。" },
      },
    ],
    outro: [{ narration: "真好！停就是停。然后玩两个都喜欢的游戏。" }],
    endCaption: "小熊和小狐狸击掌",
  },
};
