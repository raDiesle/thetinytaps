import type { SockTexts } from "./content";

// Chinese texts for "Socken-Paare". One sock is counted with 只.

/** The Chinese texts; a sentence added later without its Chinese is said in German (content.ts fills the gaps). */
export const CHINESE_TEXTS: Partial<SockTexts> = {
  start: "找两只一样的袜子！",
  pair: ["一双！", "它们是一对！", "一模一样！", "两只一样的！"],
  done: "袜子都挂到绳子上啦！",
  sock: (n) => `第${n}只袜子`,
};
