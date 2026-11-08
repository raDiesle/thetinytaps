import type { TogetherTranslation } from "./pairs";

// Russian sentences for "Was gehört zusammen?", by the ids of the pairs in pairs.tsx: things "подходят к" (with the
// dative), helpers say what they need with „нужен / нужна / нужны“, which follows the tool, never the helper.

/** Russian, for the table of languages in pairs.tsx. */
export const RUSSIAN: TogetherTranslation = {
  zahnbuerste: {
    name: "Зубная щётка",
    partner: "Зубная паста",
    question: "Мы хотим почистить зубы.",
    right: "Зубная паста подходит к зубной щётке. Здорово!",
    belongs: "Зубная паста подходит к зубной щётке!",
  },
  tuer: {
    name: "Дверь",
    partner: "Ключ",
    question: "Дверь закрыта. Мы хотим войти.",
    right: "Ключ подходит к двери. Здорово!",
    belongs: "Ключ подходит к двери!",
  },
  topf: {
    name: "Кастрюля",
    partner: "Крышка",
    question: "Кастрюля открыта. Мы хотим её закрыть.",
    right: "Крышка подходит к кастрюле. Здорово!",
    belongs: "Крышка подходит к кастрюле!",
  },
  blume: {
    name: "Цветок",
    partner: "Лейка",
    question: "Цветок хочет пить.",
    right: "Лейка подходит к цветку. Здорово!",
    belongs: "Лейка подходит к цветку!",
  },
  papier: {
    name: "Бумага",
    partner: "Мелок",
    question: "Мы хотим нарисовать картинку.",
    right: "Мелок подходит к бумаге. Здорово!",
    belongs: "Мелок подходит к бумаге!",
  },
  feuerwehr: {
    name: "Пожарный",
    partner: "Шланг",
    question: "Пожарный хочет погасить пожар.",
    right: "Пожарному нужен шланг. Здорово!",
    belongs: "Пожарному нужен шланг!",
  },
  aerztin: {
    name: "Врач",
    partner: "Стетоскоп",
    question: "Врач хочет послушать твоё сердце.",
    right: "Врачу нужен стетоскоп. Здорово!",
    belongs: "Врачу нужен стетоскоп!",
  },
  baecker: {
    name: "Пекарь",
    partner: "Булочка",
    question: "Пекарь хочет испечь что-то вкусное к завтраку.",
    right: "Пекарю нужна булочка. Здорово!",
    belongs: "Пекарю нужна булочка!",
  },
  friseurin: {
    name: "Парикмахер",
    partner: "Ножницы",
    question: "Парикмахер хочет подстричь волосы.",
    right: "Парикмахеру нужны ножницы. Здорово!",
    belongs: "Парикмахеру нужны ножницы!",
  },
};
