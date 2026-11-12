// The stories of „Alltagssituationen“ grouped by feeling (user decision, November 2026): one card per group, and a
// group plays its scenes one after another, each with one choice. The next time a scene comes, it asks its next
// choice, so the pictures of all its steps are seen over several passes.

import type { Localized } from "@/lib/language";
import { STORIES, type Story } from "./stories";

/** One card of „Alltagssituationen“: a feeling and the stories that show it. */
export interface StoryGroup {
  id: string;
  emoji: string;
  /** Its name on the card and under „Weiter“. */
  title: Localized;
  /** Ids from `STORIES`, in the order they are played. */
  stories: string[];
}

export const GROUPS: StoryGroup[] = [
  {
    id: "traurig",
    emoji: "😢",
    title: { de: "Traurig", en: "Sad", zh: "难过", hi: "उदास", es: "Tristeza", ar: "حزن", ru: "Грусть" },
    stories: ["zuhause-sad", "selbst-screen", "selbst-lost", "selbst-miss", "selbst-cookie", "selbst-join", "alltag-farewell", "alltag-homesick"],
  },
  {
    id: "wuetend",
    emoji: "😠",
    title: { de: "Wütend", en: "Angry", zh: "生气", hi: "गुस्सा", es: "Enojo", ar: "غضب", ru: "Злость" },
    stories: [
      "zuhause-angry",
      "kita-angry",
      "selbst-leave",
      "selbst-checkout",
      "selbst-jacket",
      "selbst-pancake",
      "alltag-race",
      "alltag-paintbrush",
      "alltag-bluecup",
      "alltag-teeth",
    ],
  },
  {
    // Anger without anyone to be angry at (C-54: the Zones of Regulation name frustration on its own). Only new scenes
    // so far, German only: the built site shows the group once their pictures are made.
    id: "frust",
    emoji: "😤",
    title: { de: "Frust & Warten" },
    stories: ["alltag-puzzle", "alltag-myself", "alltag-pointing", "alltag-phone"],
  },
  {
    id: "angst",
    emoji: "😨",
    title: { de: "Angst", en: "Fear", zh: "害怕", hi: "डर", es: "Miedo", ar: "خوف", ru: "Страх" },
    stories: [
      "zuhause-scared",
      "selbst-night",
      "selbst-vacuum",
      "selbst-dog",
      "selbst-doctor",
      "selbst-hairwash",
      "selbst-startle",
      "alltag-barber",
      "alltag-supermarket",
      "alltag-bee",
    ],
  },
  {
    id: "freude",
    emoji: "🥳",
    title: { de: "Freude & Stolz", en: "Joy & pride", zh: "开心和骄傲", hi: "खुशी और गर्व", es: "Alegría y orgullo", ar: "فرح وفخر", ru: "Радость и гордость" },
    stories: ["zuhause-happy", "selbst-snow", "selbst-proud", "alltag-excited", "alltag-pickup", "alltag-bath", "alltag-butterfly"],
  },
  {
    id: "muede",
    emoji: "😴",
    title: {
      de: "Müde & zu viel",
      en: "Tired & overwhelmed",
      zh: "累了和受不了了",
      hi: "थकान और बहुत ज़्यादा",
      es: "Cansancio y agobio",
      ar: "تعب وضغط",
      ru: "Усталость и слишком много",
    },
    stories: ["zuhause-tired", "selbst-loud", "selbst-bored", "alltag-morning", "alltag-worn", "alltag-sick", "alltag-car", "alltag-nap", "alltag-bedtime"],
  },
  {
    id: "streit",
    emoji: "✋",
    title: {
      de: "Streit im Kindergarten",
      en: "Quarrels at kindergarten",
      zh: "幼儿园里的争吵",
      hi: "प्ले स्कूल में झगड़ा",
      es: "Peleas en la guardería",
      ar: "شجار في الروضة",
      ru: "Ссоры в детском саду",
    },
    stories: ["kita-push", "kita-kick", "kita-grab", "kita-slide", "kita-want", "kita-stop", "alltag-laughed", "alltag-hit"],
  },
  {
    id: "freunde",
    emoji: "🫂",
    title: {
      de: "Freunde & Familie",
      en: "Friends & family",
      zh: "朋友和家人",
      hi: "दोस्त और परिवार",
      es: "Amigos y familia",
      ar: "أصدقاء وعائلة",
      ru: "Друзья и семья",
    },
    stories: ["kita-bye", "kita-new", "kita-fall", "selbst-baby", "selbst-shy", "selbst-empathy", "alltag-envy"],
  },
  {
    id: "igitt",
    emoji: "🥦",
    title: { de: "Igitt & Hoppla", en: "Yuck & oops", zh: "恶心和哎呀", hi: "छी और उफ़", es: "Guácala y ups", ar: "قرف وأوه", ru: "Фу и ой" },
    stories: ["selbst-broccoli", "selbst-oops", "alltag-accident", "alltag-sticky", "alltag-nappy", "alltag-socks", "alltag-lick"],
  },
];

/** The group with this id, or the first. */
export const groupById = (id: string): StoryGroup => GROUPS.find((g) => g.id === id) ?? GROUPS[0];

/** The group's stories that can be played (the built site leaves out a story whose pictures are not all made). */
export const groupStories = (group: StoryGroup): Story[] =>
  group.stories.map((id) => STORIES.find((s) => s.id === id)).filter((s): s is Story => s !== undefined);

/** The groups with something to play, in their fixed order. */
export const playableGroups = (): StoryGroup[] => GROUPS.filter((g) => groupStories(g).length > 0);

/** The group „Weiter“ brings after this one: the next, after the last the first. */
export function groupAfter(group: StoryGroup): StoryGroup {
  const groups = playableGroups();
  return groups[(groups.indexOf(group) + 1) % groups.length];
}
