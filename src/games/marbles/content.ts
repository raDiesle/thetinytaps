// The names and first lines of Kettenreaktion's levels in every language the
// game speaks. The lines said along the way sit next to their moment in the
// level's own file (`say: { de, ru }`), so timing and words stay together.

import type { Localized } from "@/lib/language";
import type { MarbleLevel } from "./settings";

/** The game's name, on its start screen and in the browser tab. */
export const GAME_TITLE: Localized = { de: "Kettenreaktion", ru: "Цепная реакция" };

/** Each level's name (mode card, „Weiter“ button, the picture's label) and the line said when it starts. */
export const LEVEL_TEXTS: Record<MarbleLevel, { name: Localized; intro: Localized }> = {
  track: {
    name: { de: "Klingende Kugelbahn", ru: "Звонкие шарики" },
    intro: { de: "Tipp! Dann rollen die Kugeln.", ru: "Нажми — и шарики покатятся!" },
  },
  machine: {
    name: { de: "Große Maschine", ru: "Большая машина" },
    intro: { de: "Tipp! Dann läuft die große Maschine.", ru: "Нажми — и большая машина заработает!" },
  },
  sneeze: {
    name: { de: "Hatschi-Kette", ru: "Апчхи-цепочка" },
    intro: { de: "Tipp! Dann kitzelt die Feder die Maus.", ru: "Нажми — и пёрышко пощекочет мышку!" },
  },
  kitchen: {
    name: { de: "Verrückte Küche", ru: "Чудо-кухня" },
    intro: { de: "Tipp! Dann wird in der Küche gezaubert.", ru: "Нажми — и на кухне начнётся волшебство!" },
  },
  garden: {
    name: { de: "Im Garten", ru: "В саду" },
    intro: { de: "Tipp! Dann wacht der Garten auf.", ru: "Нажми — и сад проснётся!" },
  },
  pegs: {
    name: { de: "Nagelbrett", ru: "Доска с гвоздиками" },
    intro: { de: "Tipp oben hin! Dort fällt die Kugel los.", ru: "Нажми наверху! Оттуда упадёт шарик." },
  },
  topple: {
    name: { de: "Alles fällt um", ru: "Всё падает" },
    intro: { de: "Tipp an, dann fällt alles um!", ru: "Толкни — и всё упадёт!" },
  },
  building: {
    name: { de: "Baustelle", ru: "Стройка" },
    intro: { de: "Tipp! Dann geht es los auf der Baustelle.", ru: "Нажми — и на стройке закипит работа!" },
  },
  water: {
    name: { de: "Wasserbahn", ru: "Водная горка" },
    intro: { de: "Tipp auf das Tor! Dann schwimmt die Ente weiter.", ru: "Нажми на ворота — и уточка поплывёт дальше!" },
  },
  circus: {
    name: { de: "Zirkus", ru: "Цирк" },
    intro: { de: "Tipp! Manege frei!", ru: "Нажми! Представление начинается!" },
  },
  space: {
    name: { de: "Raketenstart", ru: "Запуск ракеты" },
    intro: { de: "Tipp! Dann startet die Rakete.", ru: "Нажми — и ракета взлетит!" },
  },
  light: {
    name: { de: "Licht-Kette", ru: "Световая цепочка" },
    intro: { de: "Tipp! Dann geht das Licht an.", ru: "Нажми — и зажжётся свет!" },
  },
};
