import type { TogetherTranslation } from "./pairs";

// Chinese sentences for "Was gehört zusammen?", by the ids of the pairs in pairs.tsx: things "是一对", helpers "需要"
// their tools.

/** Chinese, for the table of languages in pairs.tsx. */
export const CHINESE: TogetherTranslation = {
  zahnbuerste: { name: "牙刷", partner: "牙膏", question: "我们想刷牙。", right: "牙膏和牙刷是一对。真棒！", belongs: "牙膏和牙刷是一对！" },
  tuer: { name: "门", partner: "钥匙", question: "门关着。我们想进去。", right: "钥匙和门是一对。真棒！", belongs: "钥匙和门是一对！" },
  topf: { name: "锅", partner: "锅盖", question: "锅开着呢。我们想把它关好。", right: "锅盖和锅是一对。真棒！", belongs: "锅盖和锅是一对！" },
  blume: { name: "花", partner: "洒水壶", question: "花渴了。", right: "洒水壶和花是一对。真棒！", belongs: "洒水壶和花是一对！" },
  papier: { name: "纸", partner: "蜡笔", question: "我们想画一幅画。", right: "蜡笔和纸是一对。真棒！", belongs: "蜡笔和纸是一对！" },
  feuerwehr: { name: "消防员", partner: "水管", question: "消防员想把火扑灭。", right: "消防员需要水管。真棒！", belongs: "消防员需要水管！" },
  aerztin: { name: "医生", partner: "听诊器", question: "医生想听听你的心跳。", right: "医生需要听诊器。真棒！", belongs: "医生需要听诊器！" },
  baecker: { name: "面包师", partner: "小面包", question: "烘焙师想烤点好吃的当早饭。", right: "面包师需要小面包。真棒！", belongs: "面包师需要小面包！" },
  friseurin: { name: "理发师", partner: "剪刀", question: "理发师想把头发修短。", right: "理发师需要剪刀。真棒！", belongs: "理发师需要剪刀！" },
};
