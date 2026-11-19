import type { StoryTranslation } from "../story";

// What Tapsi says in „Fire Rescue“ in Mandarin Chinese (simplified characters): the English lines of lines.ts, step by
// step (translated on request, 19 November 2026). Tapsi is 塔普西, Kiki 琪琪 and Robo, the hover robot, 罗博.

/** „Fire Rescue“ in Chinese. */
export const TRANSLATION: StoryTranslation = {
  title: "消防救援",
  defaultTurn: "轮到你啦！",
  opening: ["哎呀！看，那边在冒烟！", "屋顶上还有小猫咪呢。", "我们去帮忙！你跟我一起去吗？"],
  steps: [
    // 👋
    {
      name: "向琪琪挥手",
      situation: "你好！我是塔普西。这是罗博，我的飞行机器人！",
      instruction: "琪琪来啦！我们挥挥手——像这样！",
      turn: "你也跟琪琪挥挥手吧？",
      again: "你好，琪琪！",
      praise: "琪琪跟我们一起去！",
    },
    // 🔔
    {
      name: "拉响消防铃",
      situation: "大门关着。我们来拉响消防铃！",
      instruction: "手伸得高高的，往下拉——像这样！",
      turn: "轮到你——拉！",
      again: "叮咚！大门升起来啦！",
      praise: "大门开啦。出发！",
    },
    // 👕
    {
      name: "在晾衣绳下弯腰",
      situation: "罗博沿着街道飞。看，晾衣绳！",
      instruction: "绳子来了，我们就蹲下——像这样！",
      turn: "小心！快蹲下！",
      again: "再蹲一次！",
      praise: "我们穿过来啦！",
    },
    // 💧
    {
      name: "抽水",
      situation: "罗博的水管需要水。看，有个喷泉！",
      instruction: "握住把手，往下压——像这样！",
      turn: "轮到你——压水！",
      again: "咕噜咕噜！水进来啦！",
      praise: "罗博的水箱满啦！",
    },
    // 💦
    {
      name: "喷水赶走烟",
      situation: "那就是冒烟的房子！",
      instruction: "握住水管喷水——向左，再向右！像这样！",
      turn: "轮到你——喷水！",
      again: "哗——！烟散开啦！",
      praise: "烟全都没有啦！",
    },
    // 🐱
    {
      name: "接住小猫",
      situation: "小猫们在屋顶上。罗博飞上去！",
      instruction: "张开手臂接住——像这样！",
      turn: "小猫跳下来啦——接住！",
      again: "还有一只！",
      praise: "小猫们都安全啦！",
    },
    // 🎉
    {
      name: "好耶！",
      situation: "我们成功啦！",
      instruction: "举起手——好耶！",
      turn: "你也来——好耶！",
      praise: "消防救援，好耶！",
    },
    // 👋
    {
      name: "挥手告别",
      situation: "罗博送小猫们回家。",
      instruction: "我们挥手说再见——像这样！",
      turn: "你也挥挥手吧？",
      again: "再见，小猫们！再见，琪琪！",
      praise: "谢谢你来帮忙！下次见！",
    },
  ],
};
