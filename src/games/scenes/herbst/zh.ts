import type { SceneTranslation } from "../types";

// The autumn picture in Chinese (Mandarin, simplified characters): the title, every item's name and
// sentences and the chain sentences. Names are bare nouns, without measure word or 这/那. The St Martin's
// lantern song is told as a simple Chinese rhyme.

/** „Herbst“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "秋天",
  description: "彩色的树叶、南瓜，还有风里的风筝。",
  items: {
    sonne: { name: "太阳", sentences: ["秋天的太阳出来啦！", "太阳在笑。", "太阳还有一点点暖。"] },
    wolke: { name: "云朵", sentences: ["云朵下雨啦。滴答，滴答！", "秋天常常下雨。"] },
    herbstwind: { name: "风", sentences: ["风在吹：呼——！", "风把树叶吹走了。", "呼呼！今天风好大。"] },
    wildgaense: { name: "大雁", sentences: ["大雁飞到南方去。", "嘎嘎，嘎嘎！再见，大雁！"] },
    herbstdrachen: { name: "风筝", sentences: ["风筝飞得好高好高！", "风筝在风里跳舞。", "风筝有一张笑脸。"] },
    pflugtraktor: { name: "拖拉机", sentences: ["拖拉机在耕地。", "突突突，拖拉机在响。"] },
    kraehe: { name: "乌鸦", sentences: ["呱，呱！乌鸦在叫。", "乌鸦站在木桩上。"] },
    schuppen: { name: "小木屋", sentences: ["耙子和扫帚住在小木屋里。", "吱呀！门开了。里面是谁呀？"] },
    spinnennetz: { name: "蜘蛛网", sentences: ["蜘蛛网上的露珠亮晶晶。", "蜘蛛顺着丝爬下来。"] },
    baeuerin: { name: "农妇", sentences: ["你好！你想要一个南瓜吗？", "农妇在卖南瓜。"] },
    kuerbisstand: { name: "南瓜摊", sentences: ["南瓜摊上有好多南瓜。", "黄的、绿的、橙的南瓜！", "箱子里有什么呀？"] },
    apfelkorb: { name: "苹果篮", sentences: ["篮子里装满了苹果。", "红的、绿的、黄的苹果。嗯！"] },
    ahorn: { name: "枫树", sentences: ["枫树的叶子是红色的。", "种子像小直升机一样飞！", "沙沙！树叶落下来了。"] },
    drachenjunge: { name: "小男孩", sentences: ["小男孩在放风筝。", "好耶！小男孩紧紧地拉着线。"] },
    laubopa: { name: "爷爷", sentences: ["爷爷把落叶耙到一起。", "唰唰，耙子在响。", "爷爷说：你好！"] },
    laubhaufen: { name: "落叶堆", sentences: ["呼！树叶飞起来了。", "可以躲在落叶堆里。", "沙沙，沙沙！谁在树叶里？"] },
    strickoma: { name: "奶奶", sentences: ["奶奶在织围巾。", "嗒嗒嗒，毛衣针在响。", "围巾又长又暖和。"] },
    bankkatze: { name: "小猫", sentences: ["喵！小猫在玩毛线。", "小猫坐在长椅上。"] },
    kastanienbaum: { name: "栗子树", sentences: ["扑通！栗子掉下来了。", "树叶是黄色和棕色的。", "栗子树好大。"] },
    herbsthoernchen: { name: "松鼠", sentences: ["松鼠在为冬天收集坚果。", "咔嚓咔嚓！真好吃，一个坚果。"] },
    laubigel: { name: "刺猬", sentences: ["刺猬背上背着一个苹果。", "嗅嗅，嗅嗅！刺猬在找一张落叶小床。"] },
    kuerbiswagen: { name: "小拉车", sentences: ["小拉车里装着南瓜。", "咕噜咕噜，小拉车滚起来啦。"] },
    laubhund: { name: "小狗", sentences: ["汪汪！小狗想抓住树叶。", "小狗跳起来！"] },
    kastanie: { name: "栗子", sentences: ["栗子是棕色的，亮亮的。", "外壳有刺。哎哟！"] },
    steinpilze: { name: "蘑菇", sentences: ["噗，噗！蘑菇长出来啦。", "蘑菇戴着棕色的帽子。"] },
    kastanienmann: { name: "栗子小人", sentences: ["栗子小人在跳舞！", "它是用栗子做的。"] },
    herbstwindrad: { name: "风车", sentences: ["风车在风里转。", "红、黄、蓝、绿。呼——！"] },
    amsel: { name: "乌鸫", sentences: ["乌鸫在吃红果子。", "乌鸫在唱歌。"] },
    riesenkuerbis: { name: "南瓜", sentences: ["南瓜跳起来啦！沙沙，沙沙！", "南瓜又大又圆。", "南瓜后面住着一只小老鼠。"] },
    martinslaterne: { name: "灯笼", sentences: ["灯笼，灯笼，太阳、月亮和星星！", "灯笼好亮呀。", "小朋友在唱灯笼歌。"] },
    matschpfuetze: { name: "水坑", sentences: ["啪嗒！水坑溅起水花。", "一片叶子像小船一样漂着。"] },
    pfuetzenkind: { name: "小女孩", sentences: ["嘿！小女孩跳进水坑。", "小女孩拿着一把伞。", "穿上雨靴就可以踩水坑啦！"] },
    apfelwurm: { name: "小虫子", sentences: ["你好，小虫子！", "小虫子住在苹果里。吧唧，吧唧！"] },
    herbststiefel: { name: "雨靴", sentences: ["雨靴跳起来啦！", "红色的雨靴，上面有白点点。", "谁躲在靴子里？"] },
    regenschnecke: { name: "蜗牛", sentences: ["蜗牛喜欢下雨。", "蜗牛爬得慢慢的。"] },
  },
  chains: [
    ["风把风筝吹得好高好高！", "风车也转起来了。", "树叶从树上飞下来。"],
    ["下雨啦！小女孩跳进水坑。", "蜗牛出来啦。", "下过雨，蘑菇长出来了。"],
    ["扑通！一颗栗子掉下来。", "松鼠看见啦！"],
  ],
};
