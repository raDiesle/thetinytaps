import type { StoryTranslation } from "../story";

// What Tapsi says in „Fire Rescue“ in Russian: the English lines of lines.ts, step by step (translated on request,
// 19 November 2026). Nothing in the past tense or with adjectives for "you", which would differ for a boy and a girl.
// Robo, the hover robot, is „Робо“.

/** „Fire Rescue“ in Russian. */
export const TRANSLATION: StoryTranslation = {
  title: "Пожарные спешат на помощь",
  defaultTurn: "Теперь ты!",
  opening: ["Ой! Смотри, там дым!", "А на крыше сидят маленькие котята.", "Мы поможем! Полетишь со мной?"],
  steps: [
    // 👋
    {
      name: "Помахать Кики",
      situation: "Привет! Я Тапси. А это Робо, мой летающий робот!",
      instruction: "Вот летит Кики! Машем – вот так!",
      turn: "А ты помашешь Кики?",
      again: "Привет, Кики!",
      praise: "Кики летит с нами!",
    },
    // 🔔
    {
      name: "Позвонить в пожарный колокол",
      situation: "Ворота закрыты. Звоним в пожарный колокол!",
      instruction: "Поднимаем руки высоко и тянем вниз – вот так!",
      turn: "Теперь ты – тяни!",
      again: "Дзинь-дон! Ворота поднимаются!",
      praise: "Ворота открыты. Полетели!",
    },
    // 👕
    {
      name: "Пригнуться под бельевыми верёвками",
      situation: "Робо летит по улице. Смотри, бельевые верёвки!",
      instruction: "Когда подлетаем к верёвке, мы пригибаемся – вот так!",
      turn: "Внимание! Пригнись!",
      again: "И ещё раз пригнись!",
      praise: "Мы проскочили!",
    },
    // 💧
    {
      name: "Качать воду",
      situation: "Робо нужна вода для шланга. Смотри, фонтан!",
      instruction: "Держим ручку и жмём вниз – вот так!",
      turn: "Теперь ты – качай!",
      again: "Буль-буль! Вода набирается!",
      praise: "Баки Робо полные!",
    },
    // 💦
    {
      name: "Прогнать дым водой",
      situation: "Вот дом, где дым!",
      instruction: "Держим шланг и брызгаем – влево и вправо! Вот так!",
      turn: "Теперь ты – брызгай водой!",
      again: "Пш-ш-ш! Дым уходит!",
      praise: "Весь дым пропал!",
    },
    // 🐱
    {
      name: "Ловить котят",
      situation: "Котята сидят на крыше. Робо летит наверх!",
      instruction: "Раскрываем руки и ловим – вот так!",
      turn: "Вот прыгает котёнок – лови!",
      again: "И ещё один!",
      praise: "Все котята спасены!",
    },
    // 🎉
    {
      name: "Ура!",
      situation: "У нас получилось!",
      instruction: "Руки вверх – ура!",
      turn: "И ты тоже – ура!",
      praise: "Ура спасателям!",
    },
    // 👋
    {
      name: "Помахать на прощание",
      situation: "Робо везёт котят домой.",
      instruction: "Машем на прощание – вот так!",
      turn: "Помашешь со мной?",
      again: "Пока, котята! Пока, Кики!",
      praise: "Спасибо за помощь! До скорой встречи!",
    },
  ],
};
