import type { EnglishFirst } from "@/lib/language";

// Up to four children in every picture of taking turns, each with a name or a photo (user request, 25 November 2026).
// Written English first and translated into every app language in the same commit; its texts stand here on their own,
// so the language table (`languageStatus.ts`) can name them as a part of their own.

/** The group of the pictures of taking turns on the start screen, naming how many children can play (default two). */
export const TURNS_GROUP: EnglishFirst = {
  en: "Taking Turns (up to 4)",
  de: "Abwechseln (bis 4)",
  zh: "轮流（最多4人）",
  hi: "बारी-बारी (4 तक)",
  es: "Por turnos (hasta 4)",
  ar: "بالتناوب (حتى 4)",
  ru: "По очереди (до 4)",
};

/** Behind ⚙️: the children's names and photos. */
export const PLAYERS_TITLE: EnglishFirst = {
  en: "Children's names and photos",
  de: "Namen und Fotos der Kinder",
  zh: "孩子的名字和照片",
  hi: "बच्चों के नाम और फ़ोटो",
  es: "Nombres y fotos de los niños",
  ar: "أسماء الأطفال وصورهم",
  ru: "Имена и фото детей",
};

/** The empty name field's hint. */
export const NAME_HINT: EnglishFirst = { en: "Name", de: "Name", zh: "名字", hi: "नाम", es: "Nombre", ar: "الاسم", ru: "Имя" };

/** The button that picks a photo from the device (only read out, its look is a camera). */
export const PICK_PHOTO: EnglishFirst = {
  en: "Choose a photo",
  de: "Foto wählen",
  zh: "选择照片",
  hi: "फ़ोटो चुनें",
  es: "Elegir una foto",
  ar: "اختيار صورة",
  ru: "Выбрать фото",
};

/** The small ✕ that takes the photo away again. */
export const REMOVE_PHOTO: EnglishFirst = {
  en: "Remove photo",
  de: "Foto entfernen",
  zh: "删除照片",
  hi: "फ़ोटो हटाएँ",
  es: "Quitar la foto",
  ar: "إزالة الصورة",
  ru: "Убрать фото",
};

/** Under the names: where the photos and names stay. */
export const PLAYERS_NOTE: EnglishFirst = {
  en: "A photo shows instead of the name. Both stay only on this device.",
  de: "Ein Foto steht statt des Namens da. Beides bleibt nur auf diesem Gerät.",
  zh: "有照片时显示照片，不显示名字。两者都只保存在这台设备上。",
  hi: "फ़ोटो हो तो नाम की जगह फ़ोटो दिखती है। दोनों सिर्फ़ इसी डिवाइस पर रहते हैं।",
  es: "Una foto se muestra en lugar del nombre. Ambos se quedan solo en este dispositivo.",
  ar: "تظهر الصورة بدل الاسم. ويبقى كلاهما على هذا الجهاز فقط.",
  ru: "Фото показывается вместо имени. И то и другое остаётся только на этом устройстве.",
};
