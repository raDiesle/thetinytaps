import type { SceneTranslation } from "../types";

// The winter picture in Chinese (Mandarin, simplified characters): the title, every item's name and
// sentences and the chain sentences. Names are bare nouns, without measure word or 这/那; the little plastic
// sledge one sits on (German „Po-Rutscher“) is a 滑雪垫.

/** „Winter“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "冬天",
  description: "雪人、雪橇、滑冰，还有雪地里的马拉雪橇。",
  items: {
    sonne: { name: "太阳", sentences: ["冬天的太阳出来啦！", "太阳在笑。可是天好冷！"] },
    schneewolke: { name: "雪云", sentences: ["雪云下雪啦！", "雪花轻轻地飘下来。", "雪云白白的，软软的。"] },
    schneeflocke: { name: "雪花", sentences: ["雪花在转！", "亮晶晶！雪花闪闪发光。", "每片雪花都有六个角。"] },
    kirchturm: { name: "教堂钟楼", sentences: ["叮，当！钟声响了。", "塔顶上有一只公鸡在转。", "钟楼上的大钟告诉我们时间。"] },
    hase: { name: "小兔子", sentences: ["快看，盖着雪的灌木丛里有只小兔子！", "蹦蹦跳跳，小兔子跳呀跳。"] },
    schneetanne: { name: "冷杉", sentences: ["冷杉抖一抖。雪掉下来啦！", "冬天，冷杉还是绿的。", "扑通！好多好多雪。"] },
    eichhoernchen: { name: "松鼠", sentences: ["松鼠坐在冷杉上。", "松鼠在啃坚果。"] },
    futterkrippe: { name: "喂食架", sentences: ["喂食架里有给小鹿的干草。", "冬天，动物们找不到多少吃的。", "里面还有胡萝卜和一个苹果！"] },
    reh: { name: "小鹿", sentences: ["小鹿来到喂食架旁。", "嘿！小鹿在雪地里跳。", "小鹿有大大的耳朵。"] },
    holzhaus: { name: "小木屋", sentences: ["小木屋里又暖和又舒服。", "烟囱冒出烟来。", "门开了。是谁呀？"] },
    eiszapfen: { name: "冰柱", sentences: ["屋檐上挂着冰柱。", "冰柱亮晶晶。滴答，滴答！", "冰柱又冷又滑。"] },
    tannenbaum: { name: "圣诞树", sentences: ["圣诞树亮起来啦！", "树顶上有一颗星星。", "树下面放着礼物。"] },
    schneeopa: { name: "爷爷", sentences: ["爷爷在铲雪。", "嘿哟！路通啦。", "呼，爷爷喘口气。"] },
    vogelhaus: { name: "喂鸟屋", sentences: ["喂鸟屋里有给小鸟的谷粒。", "鸟食球荡呀荡。"] },
    meise: { name: "山雀", sentences: ["叽！山雀在啄谷粒。", "山雀的头是蓝色的，肚子是黄色的。"] },
    eisente: { name: "鸭子", sentences: ["呼！鸭子在冰上滑。", "嘎！冰好滑呀！", "鸭子围着红围巾。"] },
    eislaeuferin: { name: "滑冰的小女孩", sentences: ["小女孩在滑冰。", "她转呀转圈圈。真漂亮！", "冰面亮晶晶。"] },
    iglu: { name: "冰屋", sentences: ["冰屋是用雪做的。", "谁住在冰屋里？你好！", "冰屋里的灯亮了。"] },
    skifahrer: { name: "滑雪的小男孩", sentences: ["小男孩在滑雪。呼！", "他用雪杖撑一撑。", "雪花飞起来。"] },
    schlitten: { name: "雪橇", sentences: ["好耶！小朋友在坐雪橇。", "雪橇冲下山坡。", "叮铃铃，铃铛在响。"] },
    rutscher: { name: "滑雪垫", sentences: ["小朋友坐在滑雪垫上滑。", "它转呀转圈圈。好耶！", "滑雪垫是红色的。"] },
    schlittschuhe: { name: "冰鞋", sentences: ["这里放着一双冰鞋。", "穿上冰鞋可以在冰上滑。", "嘿！冰鞋跳起来。"] },
    schlittenmama: { name: "妈妈", sentences: ["妈妈拉着雪橇。", "小宝宝挥挥手。你好！", "咯吱，咯吱，雪在响。"] },
    parkbank: { name: "长椅", sentences: ["长椅上有雪。", "扑通！雪掉下来啦。", "可以在这里歇一歇。"] },
    kakao: { name: "热可可", sentences: ["嗯，热可可！", "吹一吹！热可可好烫。", "热可可把小手暖暖。"] },
    rotkehlchen: { name: "知更鸟", sentences: ["知更鸟站在长椅上。", "嘀哩哩！知更鸟在唱歌。"] },
    pferdeschlitten: { name: "马拉雪橇", sentences: ["马拉着雪橇。", "叮铃铃！小铃铛在响。", "驾，小马，快跑！"] },
    laterne: { name: "路灯", sentences: ["路灯亮了。冬天，天黑得早。", "路灯戴着一顶雪帽子。"] },
    handschuh: { name: "手套", sentences: ["雪地里有一只手套。", "谁把手套弄丢了？", "快看，手套里住着谁！"] },
    winterfuchs: { name: "狐狸", sentences: ["嘿！狐狸跳进雪里。", "狐狸听见雪下面有一只老鼠。", "狐狸的尾巴毛茸茸的。"] },
    schneekugel: { name: "大雪球", sentences: ["小朋友在滚一个大雪球。", "雪球越滚越大！", "它要变成雪人啦。"] },
    schneeengel: { name: "雪天使", sentences: ["小女孩在做雪天使。", "手臂抬上去，放下来！", "嘻嘻，雪好痒。"] },
    schneemann: { name: "雪人", sentences: ["你好，雪人！", "雪人有一个胡萝卜鼻子。", "雪人摘下帽子。"] },
    schneeballkinder: { name: "打雪仗的小朋友", sentences: ["小朋友们在打雪仗！", "啪！没打中！", "小朋友们在笑。"] },
    hund: { name: "小狗", sentences: ["汪汪！小狗在雪地里玩。", "小狗摇尾巴。", "小狗也想要一个雪球！"] },
    fussspuren: { name: "脚印", sentences: ["雪地里有脚印。是谁留下的？", "咯吱，咯吱！雪地里的脚印。"] },
  },
  chains: [
    ["小狗想一起玩。汪汪！", "啪！一个雪球打中了雪人。他摘下帽子。"],
    ["是谁呀？是狐狸！嘿，它跳进雪里。", "知更鸟吓了一跳，跳走了。"],
    ["现在滑雪垫冲下山坡。", "滑雪的小男孩也跟着来啦！"],
  ],
};
