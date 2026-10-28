import type { SceneTranslation } from "../types";

// The underwater picture in Chinese (Mandarin, simplified characters): the title, every item's name and
// sentences and the chain sentences. Names are bare nouns, without measure word or 这/那; the fish are told
// apart by colour („蓝色的鱼“).

/** „Unterwasser“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "海底世界",
  description: "大海里的鲸鱼、章鱼和宝箱。",
  items: {
    leuchtturm: { name: "灯塔", sentences: ["灯塔亮亮的。", "船就能找到路。"] },
    wolke: { name: "云朵", sentences: ["云朵下雨啦。滴答，滴答！", "雨落进大海里。"] },
    moewe: { name: "海鸥", sentences: ["嘎，嘎！海鸥飞过大海。", "海鸥在找鱼。"] },
    sonne: { name: "太阳", sentences: ["太阳出来啦！", "太阳把海水晒暖了。"] },
    anker: { name: "船锚", sentences: ["哗啦，哗啦！船锚升上去。", "扑通！船锚掉进沙子里。"] },
    boot: { name: "小船", sentences: ["呜呜！小船在波浪上摇。", "船长在船上挥手。"] },
    wal: { name: "鲸鱼", sentences: ["噗——！鲸鱼喷出水柱。", "鲸鱼在唱歌：呜——！", "鲸鱼好大好大。"] },
    delfin: { name: "海豚", sentences: ["呼！海豚跳出水面。", "唧唧唧！海豚在笑。"] },
    rochen: { name: "鳐鱼", sentences: ["鳐鱼在水里飞。", "鳐鱼扇着鳍。"] },
    fische: { name: "鱼群", sentences: ["小鱼们在转圈圈游。", "好多小鱼一起游。"] },
    qualle: { name: "水母", sentences: ["水母往上飘。", "软软的，晃晃的！水母是粉红色的。"] },
    schiff: { name: "沉船", sentences: ["叮，当！沉船上的钟响了。", "一条鱼住在沉船里。", "沉船躺在海底。"] },
    uboot: { name: "潜水艇", sentences: ["叮！潜水艇在海里潜行。", "潜水艇是黄色的。", "船长从窗户往外看。"] },
    seepferdchen: { name: "海马", sentences: ["嘿，嘿！海马在水里跳。", "海马是黄色的。"] },
    schildkroete: { name: "海龟", sentences: ["海龟划着鳍。", "海龟游得慢慢的。"] },
    meerjungfrau: { name: "美人鱼", sentences: ["美人鱼在唱歌。啦啦啦！", "美人鱼在跟你挥手。"] },
    taucher: { name: "潜水员", sentences: ["咕噜，咕噜！潜水员在吐泡泡。", "潜水员挥挥手。"] },
    schnecke: { name: "海螺", sentences: ["海螺躲进壳里。", "躲猫猫！海螺又出来啦。"] },
    koralle: { name: "珊瑚", sentences: ["珊瑚闪闪发光。", "珊瑚五颜六色。"] },
    clownfisch: { name: "小丑鱼", sentences: ["哎呀！小丑鱼躲起来了。", "小丑鱼住在海葵里。"] },
    krake: { name: "章鱼", sentences: ["章鱼挥着八只手。", "你好！章鱼是红色的。"] },
    hai: { name: "鲨鱼", sentences: ["鲨鱼游了一圈。", "鲨鱼在笑。它很友好。"] },
    hummer: { name: "龙虾", sentences: ["咔嚓咔嚓！龙虾举起钳子。", "龙虾是红色的。"] },
    krabbe: { name: "螃蟹", sentences: ["螃蟹横着走。", "咔嚓咔嚓！螃蟹的钳子在响。"] },
    schatztruhe: { name: "宝箱", sentences: ["宝箱打开了。里面有金子！", "哇，闪闪发光！"] },
    seestern: { name: "海星", sentences: ["海星在转圈跳舞。", "海星有五只手臂。"] },
    flaschenpost: { name: "漂流瓶", sentences: ["噗！漂流瓶打开了。", "瓶子里有一封信。"] },
    seegras: { name: "海草", sentences: ["海草摇来摇去。", "快看！海草里住着一条小鱼。"] },
    flunder: { name: "比目鱼", sentences: ["哎呀！比目鱼藏在沙子里。", "比目鱼扁扁的。"] },
    kugelfisch: { name: "河豚", sentences: ["噗——！河豚把自己鼓得圆圆的。", "河豚是黄色的。"] },
    blauerfisch: { name: "蓝色的鱼", sentences: ["蓝色的鱼游来游去。", "咕噜！蓝色的鱼在吐泡泡。"] },
    luftblasen: { name: "气泡", sentences: ["咕噜，咕噜！气泡往上冒。", "啪！气泡破了。"] },
    gruenerfisch: { name: "绿色的鱼", sentences: ["绿色的鱼摆摆鳍。", "咕噜！绿色的鱼在吐泡泡。"] },
    seeigel: { name: "海胆", sentences: ["海胆晃晃身上的刺。", "嘿！海胆是紫色的。"] },
    muschel: { name: "贝壳", sentences: ["贝壳打开了。里面有一颗珍珠！", "珍珠亮晶晶。"] },
  },
  chains: [
    ["海豚从水柱里跳过去！", "小船在波浪上摇呀摇。"],
    ["潜水员找到一个宝箱！", "螃蟹围着宝藏跳舞。"],
    ["章鱼向鲨鱼挥手。", "小丑鱼赶快躲起来！"],
  ],
};
