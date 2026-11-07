import type { TogetherTranslation } from "./pairs";

// Russian sentences for "Was gehört zusammen?", by the ids of the pairs in pairs.tsx: things "подходят к" (with the
// dative), helpers say what they need with „нужен / нужна / нужны“, which follows the tool, never the helper.

/** Russian, for the table of languages in pairs.tsx. */
export const RUSSIAN: TogetherTranslation = {
  zahnbuerste: {
    name: "Зубная щётка",
    partner: "Зубная паста",
    question: "Что подходит к зубной щётке?",
    right: "Зубная паста подходит к зубной щётке. Здорово!",
    belongs: "Зубная паста подходит к зубной щётке!",
  },
  tuer: {
    name: "Дверь",
    partner: "Ключ",
    question: "Что подходит к двери?",
    right: "Ключ подходит к двери. Здорово!",
    belongs: "Ключ подходит к двери!",
  },
  topf: {
    name: "Кастрюля",
    partner: "Крышка",
    question: "Что подходит к кастрюле?",
    right: "Крышка подходит к кастрюле. Здорово!",
    belongs: "Крышка подходит к кастрюле!",
  },
  blume: {
    name: "Цветок",
    partner: "Лейка",
    question: "Что подходит к цветку?",
    right: "Лейка подходит к цветку. Здорово!",
    belongs: "Лейка подходит к цветку!",
  },
  papier: {
    name: "Бумага",
    partner: "Мелок",
    question: "Что подходит к бумаге?",
    right: "Мелок подходит к бумаге. Здорово!",
    belongs: "Мелок подходит к бумаге!",
  },
  feuerwehr: {
    name: "Пожарный",
    partner: "Шланг",
    question: "Что нужно пожарному?",
    right: "Пожарному нужен шланг. Здорово!",
    belongs: "Пожарному нужен шланг!",
  },
  aerztin: {
    name: "Врач",
    partner: "Стетоскоп",
    question: "Что нужно врачу?",
    right: "Врачу нужен стетоскоп. Здорово!",
    belongs: "Врачу нужен стетоскоп!",
  },
  baecker: {
    name: "Пекарь",
    partner: "Булочка",
    question: "Что нужно пекарю?",
    right: "Пекарю нужна булочка. Здорово!",
    belongs: "Пекарю нужна булочка!",
  },
  friseurin: {
    name: "Парикмахер",
    partner: "Ножницы",
    question: "Что нужно парикмахеру?",
    right: "Парикмахеру нужны ножницы. Здорово!",
    belongs: "Парикмахеру нужны ножницы!",
  },
};
