import type { Localized } from "@/lib/language";

// What the lion, the mouse and the blowing pictures say and show, German and
// Russian side by side (the app language picks one). Every text needs both;
// texts.test.ts checks that.

/** Who reacts: the lion to a loud voice, the mouse to a quiet one. */
export type Who = "lion" | "mouse";

/** What an animal says after its sound (with speech on), one picked at random. */
export const SAYS: Record<Who, Localized<string[]>> = {
  lion: {
    de: ["Roaaar! Ich bin der Löwe!", "So laut! Roaaar!", "Roaaar! Noch mal!"],
    ru: ["Р-р-р! Я лев!", "Как громко! Р-р-р!", "Р-р-р! Ещё раз!"],
  },
  mouse: {
    de: ["Piep! Ich bin die kleine Maus.", "Pssst. Piep, piep.", "Piep! Ganz leise."],
    ru: ["Пи! Я маленькая мышка.", "Тс-с-с. Пи-пи.", "Пи! Тихо-тихо."],
  },
};

/** After a quiet while: what the animal asks for, with a microphone and without. */
export const NUDGES: Record<Who, { mic: Localized; tap: Localized }> = {
  lion: {
    mic: { de: "Ruf mal ganz laut: Hallo, Löwe!", ru: "Крикни громко-громко: Привет, лев!" },
    tap: { de: "Tipp mal den Löwen an!", ru: "Нажми на льва!" },
  },
  mouse: {
    mic: { de: "Und jetzt ganz leise flüstern: Hallo, Maus.", ru: "А теперь тихо-тихо шепни: Привет, мышка." },
    tap: { de: "Tipp mal die kleine Maus an!", ru: "Нажми на маленькую мышку!" },
  },
};

/** The words in the bubbles and under the animals, read by nobody but seen by everyone. */
export const VOICE_WORDS = {
  roar: { de: "ROAAAR!", ru: "Р-Р-Р!" },
  squeak: { de: "piep!", ru: "пи!" },
  quiet: { de: "🤫 leise", ru: "🤫 тихо" },
  loud: { de: "📣 laut", ru: "📣 громко" },
  scene: { de: "Löwe und Maus", ru: "Лев и мышка" },
} satisfies Record<string, Localized>;

/** The blowing pictures, in the order they are played. */
export type StationId = "candles" | "dandelion" | "pinwheel" | "boat";

/** What each blowing picture is called (for screen readers), how it invites blowing, and the cheer when it is all blown. */
export const STATION_TEXTS: Record<StationId, { label: Localized; intro: { mic: Localized; tap: Localized }; cheer: Localized }> = {
  candles: {
    label: { de: "Kuchen mit Kerzen", ru: "Торт со свечками" },
    intro: {
      mic: { de: "Puste die Kerzen aus! Ganz fest pusten!", ru: "Задуй свечки! Дуй сильно-сильно!" },
      tap: { de: "Tipp, dann pustest du die Kerzen aus!", ru: "Нажми — и свечки погаснут!" },
    },
    cheer: { de: "Alle Kerzen sind aus! Hurra!", ru: "Все свечки погасли! Ура!" },
  },
  dandelion: {
    label: { de: "Pusteblume", ru: "Одуванчик" },
    intro: {
      mic: { de: "Puste die Pusteblume an!", ru: "Подуй на одуванчик!" },
      tap: { de: "Tipp, dann fliegen die Schirmchen!", ru: "Нажми — и пушинки полетят!" },
    },
    cheer: { de: "Alle Schirmchen fliegen weg!", ru: "Все пушинки улетают!" },
  },
  pinwheel: {
    label: { de: "Windrad", ru: "Вертушка" },
    intro: {
      mic: { de: "Puste, dann dreht sich das Windrad!", ru: "Подуй — и вертушка закрутится!" },
      tap: { de: "Tipp, dann dreht sich das Windrad!", ru: "Нажми — и вертушка закрутится!" },
    },
    cheer: { de: "Ein Regenbogen!", ru: "Радуга!" },
  },
  boat: {
    label: { de: "Segelboot", ru: "Парусник" },
    intro: {
      mic: { de: "Puste ins Segel! Die Maus will zum Löwen.", ru: "Подуй на парус! Мышка плывёт ко льву." },
      tap: { de: "Tipp, dann segelt die Maus zum Löwen!", ru: "Нажми — и мышка поплывёт ко льву!" },
    },
    cheer: { de: "Angekommen! Hallo, Löwe!", ru: "Приплыли! Привет, лев!" },
  },
};

/** The two levels: their name (on the „Weiter“ button) and what to tap when there is no microphone. */
export const LEVEL_TEXTS = {
  voice: { name: { de: "Löwe und Maus", ru: "Лев и мышка" }, tapHint: { de: "Löwe und Maus antippen", ru: "нажимайте на льва и мышку" } },
  blow: { name: { de: "Pusten", ru: "Дуем" }, tapHint: { de: "antippen, das pustet auch", ru: "нажимайте на картинку, это тоже дует" } },
} satisfies Record<string, { name: Localized; tapHint: Localized }>;
