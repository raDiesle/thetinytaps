import type { StoryTranslation } from "../story";

// What Tapsi says in „Die Wolkenreise“ in Mandarin Chinese (simplified characters): the lines of
// lines.ts, step by step. Tapsi is 塔普西, Kiki 琪琪 and the little cloud Wolle 棉棉 (cotton).

/** „Die Wolkenreise“ in Chinese. */
export const TRANSLATION: StoryTranslation = {
  title: "云朵之旅",
  defaultTurn: "轮到你啦！",
  opening: ["哎呀！太阳在哪儿呢？", "它躲在厚厚的雨云后面。", "我们把它找出来！你跟我一起去吗？"],
  steps: [
    // 👋
    {
      name: "向琪琪挥手",
      situation: "你好！我是塔普西。这是棉棉，我的小云朵！",
      instruction: "琪琪来啦！我们挥挥手——像这样！",
      turn: "你也跟琪琪挥挥手吧？",
      again: "你好，琪琪！",
      praise: "琪琪跟我们一起飞！",
    },
    // 🐦
    {
      name: "像小鸟一样扇翅膀",
      situation: "棉棉想飞起来。我们来帮它！",
      instruction: "像小鸟一样扇扇翅膀——像这样！",
      turn: "轮到你——一起扇翅膀！",
      again: "扇呀扇——飞得高高的！",
      praise: "我们飞得好高呀！",
    },
    // ✈️
    {
      name: "在飞机下弯腰",
      situation: "哎呀，小飞机来啦！",
      instruction: "飞机来了，我们就蹲下——像这样！",
      turn: "小心！快蹲下！",
      again: "再蹲一次！",
      praise: "小飞机都飞走啦。",
    },
    // 🎈
    {
      name: "碰气球",
      situation: "好多气球呀！",
      instruction: "我们碰一碰——啪！像这样！",
      turn: "轮到你——碰碰气球！",
      again: "啪！再啪！",
      praise: "好多彩纸呀！",
    },
    // 🪑
    { name: "坐下", instruction: "要飞快啦！跟我一起坐下——像这样！", praise: "抓紧啦！" },
    // ⭐
    {
      name: "顺着弯道倾斜拿星星",
      situation: "这里挂着好多星星！",
      instruction: "身体歪向一边，摘下星星——像这样！",
      turn: "轮到你——往一边歪！",
      again: "再往另一边！",
      praise: "星星都摘到啦！",
    },
    // 🧍
    { name: "站起来", instruction: "雨云在那儿！跟我一起站起来——像这样！", praise: "现在我们去找太阳！" },
    // 🌧️
    {
      name: "把雨云往上推",
      situation: "这里在下雨！太阳在上面。",
      instruction: "用两只手把云往上推——像这样！",
      turn: "轮到你——一起推！",
      again: "推呀推——太阳出来啦！",
      praise: "太阳在这儿！",
    },
    // 🌈
    {
      name: "画彩虹",
      situation: "现在就差彩虹啦。",
      instruction: "用手臂画一个大大的弯——像这样！",
      turn: "轮到你——一起画！",
      again: "再画一种颜色！",
      praise: "一道彩虹！",
    },
    // 🙌
    {
      name: "好耶！",
      situation: "太阳笑啦！",
      instruction: "举起手——好耶！",
      turn: "你也来——好耶！",
      praise: "太阳回来啦！",
    },
    // 🏡
    {
      name: "挥手告别",
      situation: "棉棉带我们回家。",
      instruction: "我们挥手说再见——像这样！",
      turn: "你也挥挥手吧？",
      again: "再见，太阳！再见，琪琪！",
      praise: "谢谢你一起飞！下次见！",
    },
  ],
};
