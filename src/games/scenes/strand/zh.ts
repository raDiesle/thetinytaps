import type { SceneTranslation } from "../types";

// The beach picture in Chinese (Mandarin, simplified characters): the title, every item's name and
// sentences and the chain sentences. Names are bare nouns, without measure word or 这/那.

/** „Strand“ in Chinese. */
export const ZH: SceneTranslation = {
  title: "海滩",
  description: "海浪、沙堡、螃蟹和灯塔。",
  items: {
    sonne: { name: "太阳", sentences: ["太阳暖暖地照着！", "太阳在大海上面笑。"] },
    wolke: { name: "云朵", sentences: ["云朵下雨啦。滴答，滴答！", "下过雨，出来一道彩虹。"] },
    flugzeug: { name: "飞机", sentences: ["飞机拉着一条横幅。上面写着：你好！", "嗡！螺旋桨在转。", "飞行员在挥手。"] },
    drachen: { name: "风筝", sentences: ["风筝在风里飞！", "呼！风筝飞来飞去。", "风筝在笑。"] },
    leuchtturm: { name: "灯塔", sentences: ["灯塔在闪光！船就能找到路。", "门开了。你好，守塔人！", "灯塔是红白色的。"] },
    segelboot: { name: "帆船", sentences: ["帆船在波浪上摇呀摇。", "风吹着船帆。呼！", "啊嗬！水手在挥手。"] },
    schiff: { name: "大轮船", sentences: ["呜呜！大轮船在海上开。", "烟囱冒出烟来。", "船长在挥手。"] },
    delfin: { name: "海豚", sentences: ["嘿！海豚跳出水面。", "唧唧唧！海豚在笑。", "扑通！它又钻进水里。"] },
    boot: { name: "小船", sentences: ["小船摇来摇去。", "渔夫在划船。哗啦，哗啦！", "哇，鱼竿上钓到一条鱼！"] },
    boje: { name: "浮标", sentences: ["浮标在水里晃。", "叮，咚！铃铛响啦。", "浮标是红色的。"] },
    schwimmring: { name: "游泳圈里的小朋友", sentences: ["小朋友坐在游泳圈里玩水。", "好耶！水花溅起来啦。", "游泳圈是红白色的。"] },
    badeente: { name: "大黄鸭", sentences: ["嘎嘎！大黄鸭在游泳。", "大黄鸭点点头。", "大黄鸭是黄色的。"] },
    luftmatratze: { name: "充气垫", sentences: ["爸爸躺在充气垫上。", "哎呀！充气垫在晃。", "哦，帽子飞走啦！"] },
    wellen: { name: "海浪", sentences: ["海浪涌上沙滩。", "哗哗，哗哗！啪！", "海浪翻起白色的泡沫。"] },
    rettungsturm: { name: "救生塔", sentences: ["救生员认真地看着大家。", "吹哨子：嘟——！", "旗子在风里飘。"] },
    pommesbude: { name: "薯条小店", sentences: ["薯条小店开门啦！", "滋滋，滋滋！薯条好烫。", "厨师挥着一袋薯条。"] },
    strandhaus: { name: "海边小屋", sentences: ["海边小屋的门打开了。", "你好！谁在往外看？", "海边小屋是蓝白色的。"] },
    strandzelt: { name: "沙滩帐篷", sentences: ["沙滩帐篷里坐着一个小宝宝。", "小宝宝拍拍手。", "躲猫猫！帐篷打开了。"] },
    strandkorb: { name: "沙滩椅", sentences: ["爷爷坐在沙滩椅上。", "啊——！爷爷打个哈欠，伸个懒腰。", "爷爷抬抬帽子。早上好！"] },
    sonnenschirm: { name: "遮阳伞", sentences: ["遮阳伞在转。呼！", "伞下面有阴凉。", "遮阳伞是红白色的。"] },
    hund: { name: "小狗", sentences: ["汪汪！小狗在沙子上跳。", "小狗摇尾巴。"] },
    mama: { name: "妈妈", sentences: ["妈妈在晒太阳。", "妈妈把太阳镜推上去。", "你好！妈妈在挥手。"] },
    pommes: { name: "薯条", sentences: ["嗯，薯条配番茄酱！", "薯条从盒子里跳出来。"] },
    moewe: { name: "海鸥", sentences: ["嘎——！海鸥偷了一根薯条！", "调皮的海鸥飞上天。", "海鸥是白色和灰色的。"] },
    kind: { name: "小朋友", sentences: ["小朋友拿着一个小网兜。", "嘿！小朋友喊着挥手。", "嘿！小朋友跳起来。"] },
    ball: { name: "沙滩球", sentences: ["嘣！沙滩球跳得好高。", "沙滩球是红色、蓝色和黄色的。"] },
    krebs: { name: "螃蟹", sentences: ["螃蟹横着走。嗒，嗒，嗒！", "咔嚓咔嚓！螃蟹有大钳子。", "螃蟹是红色的。"] },
    sonnencreme: { name: "防晒霜", sentences: ["吱！防晒霜挤出来啦。", "涂上防晒霜，就不会晒伤。"] },
    seestern: { name: "海星", sentences: ["海星有五只手臂。", "海星晃一晃，笑一笑。"] },
    eimer: { name: "小桶", sentences: ["小桶里有水。", "哗啦！一条小鱼跳出来。", "小桶是蓝色的。"] },
    sandburg: { name: "沙堡", sentences: ["沙堡越来越大！一座塔，又一座塔！", "顶上飘着一面旗子。", "好大的沙堡呀！"] },
    windrad: { name: "风车", sentences: ["风车转得好快！", "风在吹。呼！"] },
    schaufel: { name: "铲子", sentences: ["铲子在挖沙子。", "嘿哟！沙子飞起来。", "铲子是绿色的。"] },
    sandhaufen: { name: "沙堆", sentences: ["谁住在沙堆里？", "躲猫猫！一条小虫子探出头。", "小虫子又钻回去了。"] },
    schatztruhe: { name: "宝箱", sentences: ["沙子里有一个宝箱！", "盖子打开了。金子闪闪发光！", "哇，好多金币！里面坐着谁呀？"] },
    kuehlbox: { name: "冷藏箱", sentences: ["冷藏箱打开了。哇，好冷！", "里面有一根冰棍！", "冰块叮当响。"] },
    muschel: { name: "贝壳", sentences: ["贝壳打开了。", "哇，一颗珍珠！", "贝壳又合上了。"] },
  },
  chains: [
    ["喂，海鸥！那是妈妈的薯条！", "汪汪！小狗冲着海鸥叫。"],
    ["呼！海浪摇着小朋友。", "哎呀！爸爸在充气垫上晃来晃去。"],
    ["大轮船看见了灯光。呜——！", "小船也摇起来了。"],
  ],
};
