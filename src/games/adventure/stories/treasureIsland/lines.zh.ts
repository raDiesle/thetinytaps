import type { StoryTranslation } from "../story";

// What Tapsi says in „Die Schatzinsel“ in Mandarin Chinese (simplified characters): the lines of
// lines.ts, step by step. Tapsi is 塔普西, Kiki 琪琪 and Ole 奥乐.

/** „Die Schatzinsel“ in Chinese. */
export const TRANSLATION: StoryTranslation = {
  defaultTurn: "轮到你啦！",
  opening: ["看——那边就是宝藏岛！", "那里有一个宝藏！", "你跟我一起去吗？"],
  steps: [
    // 👋
    {
      situation: "啊嗬！我是塔普西。琪琪来啦，它是我的鹦鹉！",
      instruction: "我跟琪琪挥挥手——像这样！",
      turn: "你也跟琪琪挥挥手吧？",
      again: "你好，琪琪！",
      praise: "琪琪很高兴你来啦！",
    },
    // 🎣
    {
      situation: "现在我们去钓鱼！",
      instruction: "从肩膀后面甩——远远地抛出去，像这样！",
      turn: "轮到你——把鱼竿甩出去！",
      again: "往后甩——扑通！",
      praise: "好多鱼呀！",
    },
    // 🪑
    { instruction: "跟我一起坐下——像这样！", praise: "出发啦！" },
    // 🛶
    {
      situation: "奥乐游起来啦——游向宝藏岛！",
      instruction: "看：桨在右边划水——再在左边。",
      turn: "跟我一起划！",
      again: "划呀划——小岛越来越近！",
      praise: "到啦！奥乐到沙滩上了。",
    },
    // 🧍
    { instruction: "我们到岛上啦！跟我一起站起来——像这样！", praise: "继续出发！" },
    // 🦂
    {
      situation: "哎呀！蝎子爬到奥乐身上啦！",
      instruction: "抬起脚——快快用力跺，像这样！",
      turn: "轮到你——跟我一起跺！",
      again: "跺跺跺——啵！",
      praise: "蝎子都跑光啦！",
    },
    // 🌉
    {
      situation: "一座小桥！上面飘着好多箱子。",
      instruction: "跳——用头顶箱子，砰！",
      turn: "轮到你——跟我一起跳！",
      again: "跳，砰！跳，砰！",
      praise: "过来啦！好多金色的星星！",
    },
    // 🪵
    {
      situation: "小心！上面有根木头在晃。",
      instruction: "它过来的时候，我们蹲下——像这样！",
      turn: "来啦！蹲下！",
      again: "再蹲一次！",
      praise: "呼，木头过去啦！",
    },
    // 🥁
    {
      situation: "哦，路上停着好多小鸟！那里还挂着两面鼓。",
      instruction: "左边——咚！右边——咚！像这样！",
      turn: "轮到你——跟我一起敲鼓！",
      again: "咚，咚——小鸟飞走啦！",
      praise: "路通啦！",
    },
    // ⚙️
    {
      situation: "一扇大门！那里有个摇把。",
      instruction: "我们转摇把——转呀转，像这样！",
      turn: "轮到你——跟我一起转！",
      again: "转呀转——大门升起来啦！",
      praise: "大门开啦！",
    },
    // 🥥
    {
      situation: "哦，猴子扔下椰子啦！椰子正朝我们滚过来。",
      instruction: "往旁边迈一大步——再回来。像这样！",
      turn: "椰子来啦！往旁边迈一大步！",
      again: "再让开一次！",
      praise: "椰子都滚过去啦。",
    },
    // 🦵
    {
      situation: "现在它们从左边滚过来！",
      instruction: "抬起腿——椰子从下面滚过去。像这样！",
      turn: "轮到你——抬腿！",
      again: "抬腿！",
      praise: "从下面滚过去啦！真棒。",
    },
    // 🦶
    {
      situation: "现在它们从中间滚过来！",
      instruction: "两腿张得大大的——椰子从中间滚过去。像这样！",
      turn: "轮到你——张开腿！",
      again: "张开腿！",
      praise: "从腿中间过去啦！猴子们哈哈笑。",
    },
    // 🐒
    {
      situation: "哦，猴子！它们在扔椰子！",
      instruction: "我们慢慢地躲开——往旁边，像这样！",
      turn: "轮到你——躲开！",
      again: "再往另一边！",
      praise: "没打中！猴子们拍手啦。",
    },
    // 🍎
    {
      situation: "一棵苹果树！那里有个篮子。",
      instruction: "伸得高高的，摘苹果——像这样！",
      turn: "轮到你——摘个苹果！",
      again: "往上——扑通掉进篮子！",
      praise: "篮子满啦！",
    },
    // 🧩
    {
      situation: "一扇门上有三幅画。是个谜题！",
      instruction: "我们学画里的样子。先变得高高的——像这样！",
      turn: "轮到你——变高高！",
      more: ["现在变得宽宽的，像一颗星星！", "现在变得小小的！", "再从头来：变高高！", "变宽宽！", "变小小！"],
      praise: "谜题解开啦！门打开了。",
    },
    // 🕸️
    {
      situation: "哦，好多蜘蛛网！我们过不去。",
      instruction: "爪子举高——往旁边远远地挥，像这样！",
      turn: "轮到你——跟我一起挥！",
      again: "左边——右边——走开！",
      praise: "路通啦！蜘蛛在挥手。",
    },
    // 🪢
    {
      situation: "宝箱漂过来啦！",
      instruction: "两只手轮流拉绳子——像这样！",
      turn: "跟我一起拉！",
      again: "拉呀拉——它过来啦！",
      praise: "宝箱到啦！",
    },
    // 🔑
    {
      situation: "哦，有把锁！琪琪带来了钥匙。",
      instruction: "捡起来，插进去，转一转——像这样！",
      turn: "轮到你——转钥匙！",
      again: "咔嗒——再来一次！",
      praise: "锁打开啦！",
    },
    // 💰
    {
      situation: "哦！金子！螃蟹把宝箱搬过来啦。我跳下来！",
      instruction: "手深深伸进去——把金币抛得高高的！像这样！",
      turn: "轮到你——伸进去，抛高高！",
      again: "伸进去——抛高高！",
      praise: "下金子雨啦！",
    },
    // 🙌
    {
      situation: "我们找到宝藏啦！",
      instruction: "举起手臂——耶！",
      turn: "你也来——耶！",
      again: "耶，找到宝藏啦！",
      praise: "好多金子！我们发财啦！",
    },
    // 🌅
    {
      situation: "太阳下山啦。",
      instruction: "我跟琪琪挥手说再见——像这样！",
      turn: "你也挥挥手吗？",
      again: "再见，琪琪！再见，小岛！",
      praise: "谢谢你一起玩！下次见！",
    },
  ],
};
