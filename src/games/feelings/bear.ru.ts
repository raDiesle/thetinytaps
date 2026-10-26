// Zu Hause in Russian: the words of bear.ts, by id. The bear is „Мишка“; nothing
// is said about the child that depends on boy or girl.

import type { ComfortId, FeelingId } from "./bear";
import type { ComfortText, FeelingText } from "./localized";

/** The kind things in Russian. */
export const COMFORTS_RU: Record<ComfortId, ComfortText> = {
  stroke: { caption: "Погладить", narration: "Ты гладишь Мишку. Нежно-нежно." },
  hug: { caption: "Обнять", narration: "Ты крепко обнимаешь Мишку." },
  teddy: { caption: "Дать игрушку", narration: "Ты даёшь Мишке мягкую игрушку." },
  stomp: { caption: "Потопать", narration: "Топ, топ! Пусть злость выходит." },
  blow: { caption: "Глубоко подуть", narration: "Глубокий вдох … и выдох: Фууух." },
  blanket: { caption: "Укрыть", narration: "Ты укрываешь Мишку. Тепло и уютно." },
  lullaby: { caption: "Спеть колыбельную", narration: "Ты поёшь тихую колыбельную." },
  hand: { caption: "Держать за лапку", narration: "Ты держишь его лапку. Ты рядом." },
  light: { caption: "Включить свет", narration: "Ты включаешь свет. Теперь светло." },
  dance: { caption: "Танцевать вместе", narration: "Вы танцуете вместе. Прыг-скок!" },
  streamers: { caption: "Бросить серпантин", narration: "Ты бросаешь яркий серпантин. Ура!" },
};

/** The bear's feelings in Russian. */
export const FEELINGS_RU: Record<FeelingId, FeelingText> = {
  sad: {
    title: "Грустно, плачет",
    intro: "Мишке грустно. Он плачет.",
    instead: { caption: "Забрать игрушку", answer: "Хм, теперь Мишка плачет ещё сильнее. Лучше утешь его." },
    end: { narration: "Мишке снова весело!", line: "Спасибо!" },
    endCaption: "Снова весёлый",
  },
  angry: {
    title: "Злость, башня упала",
    intro: "Мишка злится! Его башня упала.",
    instead: { caption: "Бросать игрушки", answer: "Хм, когда бросаешь, вещи ломаются. Лучше выпусти злость: топни сильно-сильно!" },
    end: { narration: "Злости больше нет. Мишка снова спокойный.", line: "Спасибо!" },
    endCaption: "Снова спокойный",
  },
  tired: {
    title: "Сонный вечер",
    intro: "Мишка хочет спать. Он зевает.",
    instead: { caption: "Громко барабанить", answer: "Хм, так громко Мишка не может уснуть. Лучше сиди тихо-тихо." },
    end: { narration: "Мишка сладко засыпает. Спокойной ночи!", line: "Спокойной ночи …" },
    endCaption: "Засыпает",
  },
  scared: {
    title: "Страшно в грозу",
    intro: "Мишке страшно. Гром гремит!",
    instead: { caption: "Выключить свет", answer: "Хм, в темноте Мишке ещё страшнее. Лучше включи свет." },
    end: { narration: "Гроза кончается. Мишка снова смеётся!", line: "Спасибо!" },
    endCaption: "Снова весёлый",
  },
  happy: {
    title: "Радость, день рождения",
    intro: "У Мишки день рождения! Он так радуется.",
    question: "Как ты отпразднуешь с ним?",
    instead: { caption: "Забрать торт", answer: "Хм, это его праздничный торт. Теперь Мишке грустно. Лучше празднуй вместе с ним." },
    end: { narration: "Какой чудесный день рождения!", line: "Спасибо! Как здорово!" },
    endCaption: "Праздник",
  },
};
